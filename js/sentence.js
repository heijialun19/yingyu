/* ============================================================
   小鸟英语乐园 · 句子朗读引擎 v4（词组连读 + 三级降级）
   speakSentence(text)        连读（无高亮场景：语法/游戏/家长试听）
   speakSentence(text, el)    连读 + 高亮当前词组（绘本页点句子）
   prewarmSentence(text)      翻页时把整句的词组逐个预热进缓存

   实测有道接口：常用词短语（≤4 词）支持合成，含生僻词（如主角名
   Mimi）的短语返回 HTTP 500，单词查询永远可用。所以：
   ① 每 3 个词一组连读——组内语流自然，请求数降为 1/3，速度大幅提升
   ② 组失败（含生僻词）→ 自动降级为组内逐词（单词必稳）
   ③ 逐词也连续失败 3 次（网络级问题）→ 跳过继续，绝不切机器音
   ④ 失败过的词组会被记住，下次直接走逐词，不再浪费时间
   ⑤ 播放当前组的同时预热下一组，组间几乎无停顿
   ============================================================ */
'use strict';

const __CHUNK_MAX = 3;

/* 去掉词首尾的标点再发音（显示保留原样） */
function __spokenToken(tok) {
  const t = tok.replace(/^[^A-Za-z']+|[^A-Za-z']+$/g, '');
  return t || tok;
}

const __prewarmed = new Set();
const __brokenChunks = new Set();   // 实测合成失败的词组，本会话内直接走逐词

function prewarmSentence(text, gapMs) {
  const gap = gapMs || 220;
  const toks = String(text).split(/\s+/).filter(Boolean).map(__spokenToken);
  let k = 0;
  for (let i = 0; i < toks.length; i += __CHUNK_MAX) {
    const chunk = toks.slice(i, i + __CHUNK_MAX).join(' ');
    if (__prewarmed.has(chunk)) continue;
    __prewarmed.add(chunk);
    // 预热即探路：含生僻词的组会立刻报错，提前标记并预热组内单词，
    // 这样点击时坏组直接走逐词且全部命中缓存，零等待
    setTimeout(() => prewarmWord(chunk, () => {
      __brokenChunks.add(chunk);
      toks.slice(i, i + __CHUNK_MAX).forEach(w => {
        if (__prewarmed.has(w)) return;
        __prewarmed.add(w);
        setTimeout(() => prewarmWord(w), k * gap);
      });
    }), k * gap);
    k++;
  }
}

function __clearHi(spans) { if (spans) spans.forEach(s => s.classList.remove('hi')); }
function __hiWord(spans, i) { __clearHi(spans); if (spans && spans[i]) spans[i].classList.add('hi'); }
function __hiChunk(spans, i, n) { __clearHi(spans); if (spans) for (let k = i; k < i + n && k < spans.length; k++) spans[k].classList.add('hi'); }

/* 主链：i 从第几个词开始；fails = 连续单词级失败次数；链内 6 秒超时保持节奏 */
function __speakFrom(tokens, spans, i, fails) {
  if (i >= tokens.length) { __clearHi(spans); return; }
  const n = Math.min(__CHUNK_MAX, tokens.length - i);
  const text = tokens.slice(i, i + n).map(__spokenToken).join(' ');
  if (__brokenChunks.has(text)) { __speakOne(tokens, spans, i, i + n, fails); return; }

  __hiChunk(spans, i, n);
  playDictAudio(text, 1,
    () => __speakFrom(tokens, spans, i + n, 0),
    () => {                              // 词组合成失败：多半含生僻词 → 降级为逐词
      __brokenChunks.add(text);
      __speakOne(tokens, spans, i, i + n, fails);
    }, false, 6000);
  __prewarmChunk(tokens, i + n);         // 播放当前组的同时预热下一组
}

/* 降级链：组内逐词读（单词查询必稳）；连续失败 3 次才放弃 */
function __speakOne(tokens, spans, i, end, fails) {
  if (i >= end) { __speakFrom(tokens, spans, end, 0); return; }
  __hiWord(spans, i);
  playDictAudio(__spokenToken(tokens[i]), 1,
    () => __speakOne(tokens, spans, i + 1, end, 0),
    () => {
      if (fails + 1 >= 3) { __clearHi(spans); return; }
      __speakOne(tokens, spans, i + 1, end, fails + 1);
    }, false, 6000);
}

function __prewarmChunk(tokens, i) {
  if (i >= tokens.length) return;
  const text = tokens.slice(i, i + __CHUNK_MAX).map(__spokenToken).join(' ');
  if (!__prewarmed.has(text)) { __prewarmed.add(text); prewarmWord(text, () => __brokenChunks.add(text)); }
}

function speakSentence(text, el) {
  if (!Store.d.soundOn) return;
  const t = String(text).trim(); if (!t) return;
  stopAllSpeech();
  const tokens = t.split(/\s+/).filter(Boolean);
  if (!tokens.length) return;
  if (el) el.innerHTML = tokens.map(tok => `<span class="w">${esc(tok)}</span>`).join(' ');
  const spans = el ? Array.prototype.slice.call(el.querySelectorAll('span.w')) : null;
  __speakFrom(tokens, spans, 0, 0);
}
