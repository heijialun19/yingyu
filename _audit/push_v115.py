# -*- coding: utf-8 -*-
"""上线 2026-11-09.6（单词发音 V3 重烘）：Git Data API 新 commit，不 force push。

安全闸：
  1. 远端 HEAD 的 tree 必须等于 EXPECT_TREE（否则线上被别处改过，立刻中止）
  2. 只提交 git 索引里已 staged 的内容
  3. 上传前逐个校验 blob sha，已存在则跳过（断点续传）
  4. 提交后逐项核对远端 tree == 本地新 tree
"""
import base64, json, os, subprocess, sys, time, urllib.request, urllib.error
from concurrent.futures import ThreadPoolExecutor

REPO_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TOKEN = os.environ.get('GH_TOKEN') or open(os.path.join(REPO_DIR, '_audit', '.gh_token'), encoding='ascii').read().strip()
API = 'https://api.github.com/repos/heijialun19/yingyu'
H = {'Authorization': 'Bearer ' + TOKEN, 'Accept': 'application/vnd.github+json',
     'User-Agent': 'birdie-deploy', 'Content-Type': 'application/json'}
EXPECT_HEAD = '0cace36b5f15c4847053959fe6ab0d96075894c5'
EXPECT_TREE = 'efed757e4915ff62bcaf1e079db3a91dfb4fb475'
MSG = ('单词发音 V3 重烘：家长反馈「单词声音听起来很奇怪，比如 pink」。14 组同口径 ASR A/B 定位根因不是声线，而是生成参数——-50dB 硬裁首尾静音把 /p/ /t/ /k/ 清爆破音削掉、length_scale 1.1 人为拖慢、低码率压掉高频。保持 Piper(MIT)+en_US-ljspeech-medium(公有领域) 不变，改 1.0 / 96kbps / -70dB，2874 词全量重烘，32 词转写正确率 16/32→24/32。lessac-high 虽同为 24/32 但训练数据是 Blizzard 2013 研究专用许可（禁语音合成产品开发与分发），未采用；ljspeech-high 实测降到 8~14/32，也未采用。整句/词块/字母音未动。版本 2026-11-09.6')


def git(*args, **kw):
    return subprocess.run(['git'] + list(args), cwd=REPO_DIR, check=True,
                          capture_output=True, **kw).stdout


def api(method, path, data=None, retries=4):
    body = json.dumps(data).encode() if data is not None else None
    last = None
    for i in range(retries):
        try:
            req = urllib.request.Request(API + path, data=body, method=method, headers=H)
            with urllib.request.urlopen(req, timeout=120) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            msg = e.read()[:300]
            if e.code in (502, 503, 504) or e.code == 429:
                last = e
                time.sleep(2 + i * 3)
                continue
            raise SystemExit('API %s %s -> %s %s' % (method, path, e.code, msg))
        except Exception as e:
            last = e
            time.sleep(2 + i * 3)
    raise SystemExit('API failed: %s %s' % (method, path))


def main():
    local_tree = git('write-tree').decode().strip()
    print('本地新 tree :', local_tree)
    print('远端基线 tree:', EXPECT_TREE)
    if local_tree == EXPECT_TREE:
        raise SystemExit('本地索引没有任何改动')
    if git('rev-parse', 'HEAD^{tree}').decode().strip() != local_tree:
        raise SystemExit('本地 HEAD 与索引不一致，先 commit')

    ref = api('GET', '/git/ref/heads/main')
    rh = ref['object']['sha']
    if rh != EXPECT_HEAD:
        raise SystemExit('远端 HEAD 已变化（%s），线上可能被改过，中止。' % rh)
    rc = api('GET', '/git/commits/' + rh)
    if rc['tree']['sha'] != EXPECT_TREE:
        raise SystemExit('远端 tree 与基线不符：' + rc['tree']['sha'])
    print('远端基线一致 :', rh)

    def ls(tree):
        out = {}
        for line in git('ls-tree', '-r', tree).decode().splitlines():
            meta, path = line.split('\t', 1)
            mode, typ, sha = meta.split()
            out[path] = (mode, typ, sha)
        return out

    new, old = ls(local_tree), ls(EXPECT_TREE)
    changed = [(p, new[p]) for p in new if old.get(p, (None, None, None))[2] != new[p][2]]
    deleted = [p for p in old if p not in new]
    print('变更 %d 个文件（新增/修改），删除 %d 个' % (len(changed), len(deleted)))

    done = [0]

    def upload(item):
        path, (mode, typ, sha) = item
        try:
            api('GET', '/git/blobs/' + sha, retries=1)
            return (path, sha, 'exists')
        except SystemExit:
            pass
        raw = git('cat-file', 'blob', sha)
        api('POST', '/git/blobs', {'content': base64.b64encode(raw).decode(), 'encoding': 'base64'})
        done[0] += 1
        return (path, sha, 'uploaded')

    t0 = time.time()
    with ThreadPoolExecutor(max_workers=8) as pool:
        res = list(pool.map(upload, changed))
    up = sum(1 for r in res if r[2] == 'uploaded')
    print('blob 完成：新上传 %d，已存在 %d，用时 %.0fs' % (up, len(res) - up, time.time() - t0))

    entries = []
    for p, s, _ in res:
        mode, typ = new[p][0], new[p][1]
        entries.append({'path': p, 'mode': mode, 'type': typ, 'sha': s})
    entries += [{'path': p, 'mode': old[p][0], 'type': old[p][1], 'sha': None} for p in deleted]
    base = EXPECT_TREE
    for i in range(0, len(entries), 500):
        part = entries[i:i + 500]
        t = api('POST', '/git/trees', {'base_tree': base, 'tree': part})
        base = t['sha']
        print('  tree %d-%d -> %s' % (i, i + len(part), base[:10]), flush=True)
    print('新 tree 创建:', base)
    if base != local_tree:
        raise SystemExit('远端 tree (%s) 与本地 (%s) 不一致，中止（未改分支）' % (base, local_tree))

    commit = api('POST', '/git/commits', {'message': MSG, 'tree': base, 'parents': [rh]})
    print('commit:', commit['sha'])
    api('PATCH', '/git/refs/heads/main', {'sha': commit['sha']})
    print('分支已更新 ->', commit['sha'])
    chk = api('GET', '/git/commits/' + commit['sha'])
    print('远端提交 tree:', chk['tree']['sha'], '一致:', chk['tree']['sha'] == local_tree)


if __name__ == '__main__':
    main()
