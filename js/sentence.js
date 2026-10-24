/* ============================================================
   小鸟英语乐园 · 句子朗读引擎
   speakSentence(text)        整句朗读（一次请求，语调最自然）
   speakSentence(text, el)    逐词朗读 + 高亮（绘本页点句子跟读）
   哲学与 app.js 一致：只用词典真人发音；失败保持安静，绝不切机器音。
   ============================================================ */
'use strict';

/* 去掉词首尾的标点再发音（显示保留原样） */
function __spokenToken(tok) {
  const t = tok.replace(/^[^A-Za-z']+|[^A-Za-z']+$/g, '');
  return t || tok;
}

/* 逐词朗读：读完一个词接下一个，同时把高亮移动到当前词 */
function __speakWordByWord(tokens, spans, i) {
  if (i >= tokens.length) {
    spans.forEach(s => s.classList.remove('hi'));
    return;
  }
  spans.forEach(s => s.classList.remove('hi'));
  if (spans[i]) spans[i].classList.add('hi');
  playDictAudio(__spokenToken(tokens[i]), 1,
    () => __speakWordByWord(tokens, spans, i + 1),
    () => spans.forEach(s => s.classList.remove('hi')));
}

function speakSentence(text, el) {
  if (!Store.d.soundOn) return;
  const t = String(text).trim(); if (!t) return;

  /* 没有元素：整句一次请求（语法答对朗读 / 家长试听 / 游戏收尾） */
  if (!el) { stopAllSpeech(); playDictAudio(t, 1, null, null); return; }

  /* 有元素：把句子按词拆开渲染成 span，逐词朗读并高亮（绘本页） */
  stopAllSpeech();
  const tokens = t.split(/\s+/).filter(Boolean);
  if (!tokens.length) return;
  el.innerHTML = tokens.map(tok => `<span class="w">${esc(tok)}</span>`).join(' ');
  __speakWordByWord(tokens, Array.prototype.slice.call(el.querySelectorAll('span.w')), 0);
}
