/* 把所有批次合并成一个 WORD_SVG 对象 */
const fs = require('fs');
const path = require('path');
const files = ['colors.js','batch2.js','batch3.js','batch4.js','batch5.js'];
let all = '/* 单词 SVG 卡通插画（自动生成合并） */\nconst WORD_SVG = {};\n';
for (const f of files) {
  const src = fs.readFileSync(path.join(__dirname, f), 'utf8');
  // 提取对象字面量里的键值对
  const m = src.match(/=\s*\{([\s\S]*)\};/);
  if (!m) { console.log('跳过', f); continue; }
  const body = m[1];
  // 找出所有 'key': `...` 对
  const entries = [...body.matchAll(/'([^']+)':\s*(`[^`]+`)/g)];
  for (const [, k, v] of entries) {
    all += `WORD_SVG['${k}'] = ${v};\n`;
  }
  console.log(f, '→', entries.length, '个');
}
fs.writeFileSync(path.join(__dirname, 'word-svg.js'), all);
console.log('合并完成 → svg/word-svg.js');
