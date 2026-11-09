# -*- coding: utf-8 -*-
"""V3 发版前真浏览器验收：版本链生效 + 音频 URL 命中新包 + 听词选图仍可开局。

自起本地服务（8766）+ Edge headless dump-dom，不依赖外部进程。
"""
import os, re, json, threading, http.server, subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EDGE = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'

PROBE = r"""<script>
(function(){
  var R = { err: [], ext: [] };
  window.addEventListener('error', function(e){
    R.err.push('error: ' + (e.message||'') + ' @' + ((e.filename||'').split('/').pop()) + ':' + (e.lineno||''));
  });
  window.addEventListener('load', function(){
    setTimeout(function(){
      (async function(){
        try {
          R.build = (typeof BUILD !== 'undefined') ? BUILD : '?';
          R.audioVer = (typeof AUDIO_VER !== 'undefined') ? AUDIO_VER : '?';
          R.sentenceVer = (typeof SENTENCE_VER !== 'undefined') ? SENTENCE_VER : '?';
          R.phraseVer = (typeof PHRASE_VER !== 'undefined') ? PHRASE_VER : '?';
          R.phonicsVer = (typeof PHONICS_VER !== 'undefined') ? PHONICS_VER : '?';
          R.urlPink = (typeof localAudioURL === 'function') ? localAudioURL('pink') : '?';
          R.urlCat  = (typeof localAudioURL === 'function') ? localAudioURL('cat') : '?';
          R.urlSentence = (typeof sentenceAudioURL === 'function')
            ? sentenceAudioURL('A cheetah can run fast') : '?';
          R.cards = document.querySelectorAll('.island').length;

          var r = await fetch('audio/pink.mp3?v=4');
          var b = await r.arrayBuffer();
          R.audioStatus = r.status;
          R.audioBytes = b.byteLength;
          R.audioType = r.headers.get('content-type');

          /* 听词选图：开局四图、只念单词、URL 是单词 mp3 */
          if (typeof startGame === 'function' && typeof renderHome === 'function') {
            renderHome();
            var spy = [], orig = window.speak;
            window.speak = function(t){ spy.push(String(t)); };
            startGame('wordpic');
            var opts = [].slice.call(document.querySelectorAll('.opt'));
            var q = window._wpQ;
            R.wpOpts = opts.length;
            R.wpOptText = opts.map(function(b){ return String(b.textContent||'').trim(); });
            R.wpRight = q ? q.right.w.w : null;
            R.wpSayUrl = q ? ((typeof localAudioURL === 'function') ? localAudioURL(q.right.w.w) : '') : '';
            if (typeof window._wpSay === 'function') window._wpSay();
            R.wpSpoken = spy.slice();
            window.speak = orig;
          }
          var rs = performance.getEntriesByType('resource');
          rs.forEach(function(x){
            try { var u = new URL(x.name);
              if (u.origin !== location.origin) R.ext.push(u.host); } catch(e){}
          });
          R.ext = Array.from(new Set(R.ext));
        } catch(e) { R.err.push('probe: ' + String(e)); }
        R.loader = !!document.getElementById('bootLoader');
        var tag = document.createElement('script');
        tag.id = '__v3dump'; tag.type = 'text/plain';
        tag.textContent = JSON.stringify(R).replace(/</g, '\\u003c');
        document.body.appendChild(tag);
      })();
    }, 1500);
  });
})();
</script>"""


class H(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)

    def log_message(self, *a):
        pass


def main():
    src = open(os.path.join(ROOT, 'games.html'), encoding='utf-8').read()
    out = re.sub(r'(<head[^>]*>)', lambda m: m.group(1) + PROBE, src, count=1, flags=re.I)
    probe = os.path.join(ROOT, '_probe_v3.html')
    open(probe, 'w', encoding='utf-8', newline='').write(out)
    srv = http.server.ThreadingHTTPServer(('127.0.0.1', 8766), H)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    cmd = [EDGE, '--headless', '--disable-gpu', '--no-first-run', '--disable-extensions',
           '--autoplay-policy=no-user-gesture-required',
           '--user-data-dir=C:/Users/10548/AppData/Local/Temp/birdie_v3probe',
           '--virtual-time-budget=20000', '--dump-dom',
           'http://127.0.0.1:8766/_probe_v3.html']
    try:
        dom = subprocess.run(cmd, capture_output=True, text=True, timeout=150,
                            encoding='utf-8', errors='replace').stdout or ''
    except Exception as e:
        dom = ''
        print('EDGE ERR', e)
    srv.shutdown()
    m = re.search(r'<script id="__v3dump"[^>]*>(.*?)</script>', dom, re.S)
    if not m:
        print('NO PROBE OUTPUT (dom=%d)' % len(dom))
        return
    d = json.loads(m.group(1))
    for k in sorted(d):
        print('%-15s %s' % (k, json.dumps(d[k], ensure_ascii=False)))
    # 期望 BUILD 从 js/app.js 现读，避免每次发版都要手改这里
    _exp = re.search(r"const BUILD = '([\d.\-]+)'",
                     open(os.path.join(ROOT, 'js/app.js'), encoding='utf-8').read()).group(1)
    ok = (d.get('build') == _exp and d.get('audioVer') == 4
          and d.get('audioStatus') == 200 and d.get('audioBytes', 0) > 2000
          and '?v=4' in str(d.get('urlPink', ''))
          and d.get('sentenceVer') == 2 and d.get('phraseVer') == 2
          and d.get('phonicsVer') == 2
          and d.get('wpOpts') == 4 and '?v=4' in str(d.get('wpSayUrl', ''))
          and not d.get('err') and not d.get('ext'))
    print('\n验收：', 'PASS ✅' if ok else 'FAIL ⛔')


if __name__ == '__main__':
    main()
