/* 验证 ipaOf / pepIpaOf 的查找与斜杠输出（2026-11-08 用户截图：Thursday 没音标、start 没斜杠）
   ★ 从线上源文件里**抽真实函数**来跑，不自写简化版（自写 = 假报警）。
   通过：node _audit/test_ipa_lookup.js */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

let pass = 0, fail = 0;
function ok(name, cond, extra) {
  if (cond) { pass++; console.log('  ok  ' + name); }
  else { fail++; console.log('  FAIL ' + name + (extra ? '  <- ' + extra : '')); }
}

/* ---- 1. 载入真实数据 ---- */
const ipaSrc = fs.readFileSync(path.join(ROOT, 'js/ipa.js'), 'utf8');
const IPA = {}; // ipa.js 形如 { "cat": "/kæt/", ... }，用 eval 装进对象
(function () {
  const body = ipaSrc.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  const m = body.match(/\{[\s\S]*\}/);
  if (!m) { console.log('FATAL: ipa.js 里找不到对象字面量'); process.exit(1); }
  const obj = eval('(' + m[0] + ')');
  Object.assign(IPA, obj);
})();
console.log('ipa.js 条目', Object.keys(IPA).length);

const pepSrc = fs.readFileSync(path.join(ROOT, 'js/pep-points.js'), 'utf8');
let PEP_IPA = {};
(function () {
  const i = pepSrc.indexOf('const PEP_IPA = {');
  if (i < 0) { console.log('FATAL: pep-points.js 里找不到 PEP_IPA'); process.exit(1); }
  let depth = 0, j = pepSrc.indexOf('{', i);
  for (let k = j; k < pepSrc.length; k++) {
    if (pepSrc[k] === '{') depth++;
    else if (pepSrc[k] === '}') { depth--; if (depth === 0) { PEP_IPA = eval('(' + pepSrc.slice(j, k + 1) + ')'); break; } }
  }
})();
console.log('PEP_IPA 条目', Object.keys(PEP_IPA).length);

/* ---- 2. 抽真实函数源（app.js 的 ipaOf、pep-points.js 的 pepIpaOf） ---- */
function extractFn(src, name) {
  const i = src.indexOf('function ' + name + '(');
  if (i < 0) throw new Error('找不到函数 ' + name);
  let depth = 0, started = false, j = i;
  for (let k = i; k < src.length; k++) {
    if (src[k] === '{') { depth++; started = true; }
    else if (src[k] === '}') { depth--; if (started && depth === 0) { j = k + 1; break; } }
  }
  return src.slice(i, j);
}
const ipaOfSrc = extractFn(fs.readFileSync(path.join(ROOT, 'js/app.js'), 'utf8'), 'ipaOf');
const pepIpaOfSrc = extractFn(pepSrc, 'pepIpaOf');
console.log('抽到 ipaOf：', ipaOfSrc.split('\n')[0]);
console.log('抽到 pepIpaOf：', pepIpaOfSrc.split('\n')[0]);

/* ---- 3. 在共享作用域里跑真实实现 ---- */
const run = new Function('IPA', 'PEP_IPA', `
  ${ipaOfSrc}
  ${pepIpaOfSrc}
  return { ipaOf, pepIpaOf };
`);
const { ipaOf, pepIpaOf } = run(IPA, PEP_IPA);

/* ---- 4. 断言 ---- */
console.log('\n[ipaOf] 大小写不敏感 + 带斜杠');
ok('Thursday（原样键）', ipaOf('Thursday') === '/ˈθɜrzdeɪ/', ipaOf('Thursday'));
ok('thursday（小写查大写键）', ipaOf('thursday') === '/ˈθɜrzdeɪ/', ipaOf('thursday'));
ok('THURSDAY（全大写）', ipaOf('THURSDAY') === '/ˈθɜrzdeɪ/', ipaOf('THURSDAY'));
ok('Monday 小写能查到', ipaOf('monday') !== '', ipaOf('monday'));
ok('start 有斜杠', ipaOf('start') === '/stɑrt/', ipaOf('start'));
ok('move 有斜杠', ipaOf('move') === '/muv/', ipaOf('move'));
ok('cat 正常', ipaOf('cat') === '/kæt/', ipaOf('cat'));
ok('查不到返回空串（不是 undefined）', ipaOf('zzzzz') === '', String(ipaOf('zzzzz')));

console.log('\n[pepIpaOf] 不剥斜杠 + 大小写不敏感 + 永远包 /…/');
const asObj = w => ({ w });
const cases = [
  ['Thursday', '周四（用户截图：原来整行没音标）'],
  ['thursday', '小写也要命中'],
  ['start', '（用户截图：原来有字没斜杠）'],
  ['move', '之前 //muv// 报过的词'],
  ['eraser', '上一轮修过英式音标的词'],
  ['Wednesday', 'PEP_IPA 里的大写键'],
  ['boat', 'PEP_IPA 美式改造过的词'],
];
for (const [w, note] of cases) {
  const v = pepIpaOf(asObj(w));
  const okSlash = /^\/.+\/$/.test(v);
  ok(`${w} 输出带斜杠且非空  ${note}`, okSlash && v.length > 2, JSON.stringify(v));
}
ok('查不到的词返回空串', pepIpaOf(asObj('zzzzz')) === '', JSON.stringify(pepIpaOf(asObj('zzzzz'))));
ok('大小写查询结果一致', pepIpaOf(asObj('Thursday')) === pepIpaOf(asObj('thursday')));
ok('不出现双斜杠', !pepIpaOf(asObj('move')).includes('//'), pepIpaOf(asObj('move')));

/* PEP_IPA 命中时也要带斜杠（它的值本身不带斜杠） */
const vWed = pepIpaOf(asObj('Wednesday'));
ok('PEP_IPA 命中项也被包上斜杠', /^\/.+\/$/.test(vWed), vWed);

console.log('\n' + (fail === 0 ? 'ALL PASS' : 'FAIL ' + fail) + '  (通过 ' + pass + ')');
process.exit(fail === 0 ? 0 : 1);
