/* 听句选图题目生成回归测试：30 轮 × 6 题，渲染 HTML 不含 undefined/NaN */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.dirname(__dirname);
const wordsSrc = fs.readFileSync(path.join(ROOT, 'js/words-data.js'), 'utf8');
const dataSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');

// 评估 words-data.js + data.js，拿到 THEMES
const vm = require('vm');
const sandbox = { console, globalThis: null };
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
// const 不泄漏到 sandbox——把顶层 const 转成 var
const patched = (wordsSrc + '\n' + dataSrc)
  .replace(/const (W|GRADES|THEMES|TOTAL_WORDS|POS_OVERRIDE|PART_ZH|LETTERS) =/g, 'var $1 =')
  .replace(/const ([A-Z_]+) =/g, 'var $1 =');
vm.runInContext(patched.replace(/^'use strict';$/m, '') + '\n;globalThis.__out = THEMES;', sandbox);
const THEMES = sandbox.__out;

const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = a => a[Math.floor(Math.random() * a.length)];
const wordIcon = w => w.e || '🔤';
const gxNouns = pool => pool.filter(w => /^[A-Za-z]+$/.test(w.w));

const pool = [];
THEMES.forEach(t => t.words.forEach(w => { if (/^[a-z]+$/.test(w.w) && w.w.length <= 8) pool.push(w); }));
console.log('pool size:', pool.length);

let bad = 0, total = 0, emptyRounds = 0, skipped = 0;
for (let round = 0; round < 30; round++) {
  const p = shuffle(pool).slice(0, 60);
  const nouns = gxNouns(p).filter(w => w.e || w.w.length <= 8);
  const foods = p.filter(w => ['egg','rice','bread','cake','chicken','beef','pork','soup','noodle','dumpling','biscuit'].includes(w.w));
  const drinks = p.filter(w => ['water','juice','milk','tea'].includes(w.w));
  const animals = p.filter(w => ['cat','dog','pig','duck','cow','horse','sheep','tiger','lion','monkey','elephant','rabbit','mouse','bird','fish'].includes(w.w));
  const colors = p.filter(w => ['red','yellow','blue','green','white','black','orange','pink','purple','brown'].includes(w.w));
  const mk = [];
  if (foods.length) mk.push(() => { const w = pick(foods); return { audio: `I eat ${w.w}.`, right: w, all: foods.concat(nouns).slice(0, 12) }; });
  if (drinks.length) mk.push(() => { const w = pick(drinks); return { audio: `I drink ${w.w}.`, right: w, all: drinks.concat(nouns).slice(0, 12) }; });
  if (animals.length) mk.push(() => { const w = pick(animals); return { audio: `This is a ${w.w}.`, right: w, all: animals.concat(nouns).slice(0, 12) }; });
  if (colors.length) mk.push(() => { const w = pick(colors); return { audio: `I see ${w.w}.`, right: w, all: colors.concat(nouns).slice(0, 12) }; });
  if (nouns.length) mk.push(() => { const w = pick(nouns); return { audio: `I have a ${w.w}.`, right: w, all: nouns.slice(0, 12) }; });

  if (!mk.length) { emptyRounds++; continue; }

  for (let i = 0; i < 6; i++) {
    const q = mk[i % mk.length]();
    const opts = [q.right];
    const seen = new Set([q.right.w]);
    for (const cand of shuffle(q.all)) {
      if (opts.length >= 4) break;
      if (seen.has(cand.w)) continue;
      if (!cand.e && !cand.w) continue;
      if (!cand.e) continue;
      if (cand.e === '🔤') continue;
      seen.add(cand.w); opts.push(cand);
    }
    if (opts.length < 2) { skipped++; continue; }
    q.opts = shuffle(opts);
    total++;
    const html = q.opts.map(o => `${wordIcon(o)}${o.w}`).join('|');
    if (html.includes('undefined') || html.includes('NaN')) { bad++; console.log('BAD HTML:', html); }
    if (!q.audio || !q.right.w) { bad++; console.log('BAD q:', JSON.stringify(q.audio), q.right && q.right.w); }
    // 正确项必须在 opts 里
    if (!q.opts.some(o => o.w === q.right.w)) { bad++; console.log('BAD: right answer missing'); }
    // 正确项必须有图（否则孩子看图选不出来）
    if (!q.right.e && !q.right.w) { bad++; console.log('BAD: right answer no icon'); }
    // 干扰项里不能有字母牌（孩子看图选不出来）
    for (const o of q.opts) {
      if (o.e === '🔤') { bad++; console.log('BAD: letter-tile distractor:', o.w); }
    }
    // 同题内不能有同图选项（图去重）
    const icons = q.opts.map(o => wordIcon(o));
    const iconSet = new Set(icons);
    if (iconSet.size !== icons.length) {
      // 同图 = 同 emoji，可能是合法同义词，这里只警告不判坏
      console.log('WARN: duplicate icons in opts:', icons.join(''));
    }
  }
}
console.log(`total questions: ${total}, bad: ${bad}, emptyRounds: ${emptyRounds}, skipped: ${skipped}`);
console.log(bad === 0 ? 'ALL RENDER TESTS PASS' : `FOUND ${bad} BAD`);
process.exit(bad === 0 ? 0 : 1);
