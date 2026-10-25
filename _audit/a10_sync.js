/* 同步码编解码回归测试 */
'use strict';

// 浏览器 API 桩
globalThis.btoa = s => Buffer.from(s, 'binary').toString('base64');
globalThis.atob = s => Buffer.from(s, 'base64').toString('binary');

// Node 22 自带 CompressionStream/DecompressionStream，直接用。

const fs = require('fs');
const src = fs.readFileSync(__dirname + '/../js/app.js', 'utf8');

// 抽取 b64url* / compressText / decompressText / makeSyncCode / parseSyncCode
// 停在 showSyncCode 之前（showSyncCode 依赖 DOM/tok，本测试不需要）。
const start = src.indexOf('function b64urlEncode');
const end = src.indexOf('async function showSyncCode');
if (start < 0 || end < 0) { console.error('FAIL: 无法定位 sync 函数区段'); process.exit(1); }
const code = src.slice(start, end);

// Profiles 存根：测试不需要读 localStorage。
// 注意：eval 内 `const Profiles = ...` 是 eval 私有作用域，外部看不到。
// 所以挂在 globalThis 上，被 eval 里的 makeSyncCode 闭包捕获。
globalThis.Profiles = {
  _json: null,
  exportActive() { return this._json; },
  set(json) { this._json = json; },
};

// 用 Function 工厂包装：把 app.js 的片段当作函数体执行，
// 返回的对象拿到的是同一个闭包里的函数引用（避免 eval 私有作用域丢函数）。
const factory = new Function(
  'Profiles',
  code + '\n;return { b64urlEncode, b64urlDecode, compressText, decompressText, makeSyncCode, parseSyncCode };'
);
const { b64urlEncode, b64urlDecode, compressText, decompressText, makeSyncCode, parseSyncCode } = factory(globalThis.Profiles);

async function main() {
  const sample = {
    app: 'birdie-abc',
    v: 1,
    exported: new Date().toISOString(),
    profile: { id: 'p_xxx', name: '小明', avatar: '🐤', grade: 'g3', created: Date.now() },
    data: {
      name: '小明', stars: 123, soundOn: true, grade: 'g3', lettersSkip: false,
      badges: { first: '2026-10-25' },
      letters: { A: { t: 1 }, B: { t: 2 }, C: { t: 3 } },
      words: { apple: { box: 3, due: 1 }, cat: { box: 1, due: 0 } },
      grammar: { g1: { t: 1, stars: 5 }, g2: { t: 1, stars: 3 } },
      streak: { count: 4, last: '2026-10-25' },
      daily: { date: '2026-10-25', tasks: { letter: true, words: true, game: true }, bonus: true, studySec: 320, break15: true, break30: false },
      unlocked: { '🐼': true },
      activity: { '2026-10-24': { letters: 2, words: 3, games: 1, grammar: 1, stars: 5 } },
    },
  };
  const raw = JSON.stringify(sample);
  console.log('raw JSON length:', raw.length);

  Profiles.set(raw);
  const code = await makeSyncCode();
  console.log('sync code length:', code.length);
  console.log('compression ratio:', Math.round(100 * code.length / raw.length) + '%');
  console.log('code sample:', code.slice(0, 60) + '...');

  // 微信粘贴可行性：手机整段粘贴 ~1000-1500 字符内最舒服
  console.log('pasteable (<=1500 chars):', code.length <= 1500 ? 'YES' : 'NO (可能不便微信粘贴)');

  // 解码
  const decoded = await parseSyncCode(code);
  const ok = JSON.stringify(decoded.data) === JSON.stringify(sample.data)
    && decoded.profile.name === sample.profile.name
    && decoded.app === 'birdie-abc';
  console.log('decode roundtrip:', ok ? 'PASS' : 'FAIL');
  if (!ok) {
    console.log('decoded:', JSON.stringify(decoded).slice(0, 200));
    process.exit(1);
  }

  // 抗脏字符：用户复制粘贴常带空格/换行/标点
  const dirty = '  ' + code.slice(0, 20) + '\n' + code.slice(20) + '  ';
  try {
    await parseSyncCode(dirty);
    console.log('whitespace-tolerant decode: PASS');
  } catch (e) {
    console.log('whitespace-tolerant decode: FAIL', e.message);
    process.exit(1);
  }

  // 抗截断：故意截断后要优雅失败
  try {
    await parseSyncCode(code.slice(0, 20));
    console.log('truncated rejection: FAIL (should throw)');
    process.exit(1);
  } catch (e) {
    console.log('truncated rejection: PASS');
  }

  // 抗乱入字符串
  try {
    await parseSyncCode('hello world this is not a sync code');
    console.log('garbage rejection: FAIL (should throw)');
    process.exit(1);
  } catch (e) {
    console.log('garbage rejection: PASS');
  }

  // 纯 base64 路径（老浏览器不压缩）：手动编码也要能解回来
  const plainB64 = b64urlEncode(new TextEncoder().encode(raw));
  const d3 = await parseSyncCode(plainB64);
  const ok3 = JSON.stringify(d3.data) === JSON.stringify(sample.data);
  console.log('uncompressed path:', ok3 ? 'PASS' : 'FAIL');
  if (!ok3) process.exit(1);

  // 损坏后 JSON.parse 失败要抛
  try {
    await parseSyncCode(b64urlEncode(new TextEncoder().encode('not json at all')));
    console.log('bad-json rejection: FAIL (should throw)');
    process.exit(1);
  } catch (e) {
    console.log('bad-json rejection: PASS');
  }

  // app 字段不对要抛
  try {
    await parseSyncCode(await (async () => {
      const fake = JSON.stringify({ app: 'not-birdie', v: 1 });
      const p = await compressText(fake);
      return b64urlEncode(p);
    })());
    console.log('bad-app rejection: FAIL (should throw)');
    process.exit(1);
  } catch (e) {
    console.log('bad-app rejection: PASS');
  }

  console.log('--- all pass ---');
}
main().catch(e => { console.error('FAIL:', e); process.exit(1); });
