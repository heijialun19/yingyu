/* ============================================================
   小鸟英语乐园 · 句子朗读引擎 v3（逐词 + 容错链）
   speakSentence(text)        逐词连读（无高亮场景：语法/游戏/家长试听）
   speakSentence(text, el)    逐词连读 + 高亮当前词（绘本页点句子）
   prewarmSentence(text)      把整句的词逐个温和预热进缓存（绘本翻页时）

   为什么必须逐词：实测有道词典接口对整句合成不支持——
   2 词短语可用，3 词及以上直接 HTTP 500（这是线上"总是加载失败"的根因）；
   而单词查询是它的本职，极稳。所以朗读走逐词，但把链路修结实：
   ① 失败跳词：某词失败（引擎已自动重试一次）→ 跳过继续读下一个，整句不断
   ② 连续失败 3 次才整链停止（保持安静，绝不切机器音）
   ③ 绘本翻页时把整句的词逐个预热（220ms 间隔防限流），点击时基本秒播
   ============================================================ */
'use strict';

/* 去掉词首尾的标点再发音（显示保留原样） */
function __spokenToken(tok) {
  const t = tok.replace(/^[^A-Za-z']+|[^A-Za-z']+$/g, '');
  return t || tok;
}

const __prewarmed = new Set();
function prewarmSentence(text, gapMs) {
  const gap = gapMs || 220;
  let i = 0;
  String(text).split(/\s+/).forEach(tok => {
    const w = __spokenToken(tok);
    if (!w || __prewarmed.has(w)) return;
    __prewarmed.add(w);
    setTimeout(() => prewarmWord(w), i * gap);
    i++;
  });
}

/* 逐词朗读链：失败跳词继续，连续失败 3 次才停 */
function __speakTokens(tokens, spans, i, fails) {
  if (i >= tokens.length) {
    if (spans) spans.forEach(s => s.classList.remove('hi'));
    return;
  }
  if (spans) {
    spans.forEach(s => s.classList.remove('hi'));
    if (spans[i]) spans[i].classList.add('hi');
  }
  playDictAudio(__spokenToken(tokens[i]), 1,
    () => __speakTokens(tokens, spans, i + 1, 0),
    () => {
      if (fails + 1 >= 3) { if (spans) spans.forEach(s => s.classList.remove('hi')); return; }
      __speakTokens(tokens, spans, i + 1, fails + 1);   // 跳过这个词，继续读
    });
}

function speakSentence(text, el) {
  if (!Store.d.soundOn) return;
  const t = String(text).trim(); if (!t) return;
  stopAllSpeech();
  const tokens = t.split(/\s+/).filter(Boolean);
  if (!tokens.length) return;
  if (el) el.innerHTML = tokens.map(tok => `<span class="w">${esc(tok)}</span>`).join(' ');
  const spans = el ? Array.prototype.slice.call(el.querySelectorAll('span.w')) : null;
  __speakTokens(tokens, spans, 0, 0);
}
