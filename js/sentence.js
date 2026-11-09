/* ============================================================
   小鸟英语乐园 · 句子朗读引擎 v5（整句优先 + 逐词兜底）
   speakSentence(text)        连读（无高亮场景：语法/游戏/家长试听）
   speakSentence(text, el)    连读 + 高亮当前词组（绘本页点句子）
   prewarmSentence(text)      翻页时把整句要用的音频预热进缓存

   ★ 2026-11-08 v5：不再有「两词一组绕外网合成」这条路。
     固定例句（497 句）已有整句 mp3，一次播完，有连读和句末语调。
     程序临时生成的句子没有整句音频，就按**逐词**用站内单词音频接龙：
       ① 每个词都有站内文件，命中率 100%，零网络、断网照读
       ② 词与词之间留一点空隙，听起来是"一个一个词念"，但这正是教发音
          需要的效果；比原来两词一组里 12% 的组直接失败要好
       ③ 任何一段失败都跳过继续，绝不把整句卡死，也绝不切机器音
       ④ 播放当前词的同时预热下一个，词间几乎无停顿
   ============================================================ */
'use strict';


/* 去掉词首尾的标点再发音（显示保留原样） */
function __spokenToken(tok) {
  const t = tok.replace(/^[^A-Za-z']+|[^A-Za-z']+$/g, '');
  return t || tok;
}

const __prewarmed = new Set();

function prewarmSentence(text, gapMs) {
  /* 已有整句自有音频就别再预热单词了：一条就够。 */
  if (typeof sentenceAudioURL === 'function' && sentenceAudioURL(text)) return;
  const gap = gapMs || 60;
  const toks = String(text).split(/\s+/).filter(Boolean).map(__spokenToken);
  /* 和播放链同一套切法：能连读的词块整块预热，别把里面每个单词都单独拉一遍 */
  const items = [];
  for (let i = 0; i < toks.length; i++) {
    let jumped = 0;
    if (typeof phraseAudioURL === 'function') {
      for (let n = Math.min(4, toks.length - i); n >= 2; n--) {
        const chunk = toks.slice(i, i + n).join(' ');
        if (phraseAudioURL(chunk)) { items.push(chunk); jumped = n - 1; break; }
      }
    }
    if (!jumped) items.push(toks[i]);
    i += jumped;
  }
  let k = 0;
  for (const w of items) {
    if (__prewarmed.has(w)) continue;
    __prewarmed.add(w);
    setTimeout(() => prewarmWord(w), k * gap);   // 低优先级调度器自己排队，不会抢带宽
    k++;
    if (k >= 24) break;
  }
}

function __clearHi(spans) { if (spans) spans.forEach(s => s.classList.remove('hi')); }
function __hiWord(spans, i) { __clearHi(spans); if (spans && spans[i]) spans[i].classList.add('hi'); }
function __hiChunk(spans, i, n) { __clearHi(spans); if (spans) for (let k = i; k < i + n && k < spans.length; k++) spans[k].classList.add('hi'); }

/* 主链：从第 i 个词开始逐词念。
   ★ voice：整句共用的一个 <audio> 元素。
     移动端的自动播放许可是**按元素**发的 —— 只有点击那一刻 play 过的那个元素有效，
     之后新建的元素 play() 会被直接拒掉（桌面有 5 秒粘性激活，所以前两段能放、第三段开始哑）。
     整句复用同一个元素只换 src，就不会被重新拦截。见 app.js __playMediaElement 的说明。 */
function __speakFrom(tokens, spans, i, fails, voice) {
  if (i >= tokens.length) { __finishSpeak(spans); return; }
  /* ===== 词块连读优先（2026-11-09）=====
     从当前位置试最长 4 个词的前缀，命中「连读词块」音频就一次播完。
     冠词 a 单独合成会变成字母名 /eɪ/，在 "This is a" 这样的词块里才弱读；
     先把固定前半段连起来，句子才不会一个字一个字蹦。 */
  if (typeof phraseAudioURL === 'function') {
    const maxN = Math.min(4, tokens.length - i);
    for (let n = maxN; n >= 2; n--) {
      const chunk = tokens.slice(i, i + n).map(__spokenToken).join(' ');
      if (!phraseAudioURL(chunk)) continue;
      __hiChunk(spans, i, n);
      try {
        playDictAudio(chunk, 1,
          () => __speakFrom(tokens, spans, i + n, 0, voice),
          () => __speakFrom(tokens, spans, i + 1, fails, voice),
          false, 8000, 0, voice);
        return;
      } catch (e) { /* 落回逐词，不让整句卡死 */ }
    }
  }
  const text = __spokenToken(tokens[i]);
  /* 小写冠词 a / an 必须弱读。audio/a.mp3 是字母岛的**字母名** /eɪ/，
     直接拿它进句子就成了 "This is A cat."。词块命中时已经连读过了，
     这里是没命中词块时的兜底：换专门的弱读文件（uh / un 合成）。
     大写 A 是字母名，走 speakWord('A')，不经过这里。 */
  const audioKey = (text === 'a' || text === 'an') ? 'weak_' + text : text;
  __hiWord(spans, i);
  /* 包内没有这个词（理论上不会：全站词表都已烘焙）：
     跳过它继续念，宁可漏一个词，也不在一句话中间插机器音。 */
  if (!localAudioURL(audioKey)) { __speakFrom(tokens, spans, i + 1, fails, voice); return; }
  try {
    playDictAudio(audioKey, 1,
      () => __speakFrom(tokens, spans, i + 1, 0, voice),
      () => {                              // 这一段没放出来：跳过继续，连续 3 次才放弃
        if (fails + 1 >= 3) { __finishSpeak(spans); return; }
        __speakFrom(tokens, spans, i + 1, fails + 1, voice);
      }, false, 6000, 0, voice);
    __prewarmChunk(tokens, i + 1);         // 播当前词的同时预热下一个
  } catch (e) {
    /* 任何意外都不许把整句卡死在半路：跳过这一段，接着念下一段 */
    try { if (window.console) console.warn('[speak] 跳过第', i, '段:', e && e.message); } catch (x) {}
    setTimeout(() => __speakFrom(tokens, spans, i + 1, 0, voice), 30);
  }
}

function __prewarmChunk(tokens, i) {
  if (i >= tokens.length) return;
  const text = __spokenToken(tokens[i]);
  if (!__prewarmed.has(text)) { __prewarmed.add(text); prewarmWord(text); }
}

function speakSentence(text, el, onDone) {
  /* 声音关着也要走完回调：游戏靠"读完自动跳题"，这里 return 掉回调
     就等于把自动推进永久挂起（实测玩几题就卡住的元凶）。
     2026-10-26：这里原本会调 soundOffHint() 弹「声音关着呢」，
     那个提示已经删掉了（用户反馈太烦），现在完全静默。 */
  if (!Store.d.soundOn) { if (onDone) onDone(); return; }
  const t = String(text).trim(); if (!t) { if (onDone) onDone(); return; }
  stopAllSpeech();
  const tokens = t.split(/\s+/).filter(Boolean);
  if (!tokens.length) { if (onDone) onDone(); return; }
  if (el) el.innerHTML = tokens.map(tok => `<span class="w">${esc(tok)}</span>`).join(' ');
  const spans = el ? Array.prototype.slice.call(el.querySelectorAll('span.w')) : null;
  /* 整句读完（含放弃）回调：给"听完再走"的页面用。
     用序号作废——被新句子/stopAllSpeech 打断的旧链，不会再触发旧回调。 */
  const my = ++__speakSeq;
  __speakDone = typeof onDone === 'function'
    ? () => { if (my === __speakSeq) onDone(); }
    : null;
  /* ===== 整句自有音频优先（2026-11-08）=====
     固定例句已用同一个说话人合成好整句 mp3：一次播完，有连读、重音和句末
     语调，音色全站统一，断网也能读。
     不在清单里的动态生成句子走逐词接龙（每个词都有站内音频）。 */
  if (typeof sentenceAudioURL === 'function' && sentenceAudioURL(t)) {
    __hiChunk(spans, 0, tokens.length);
    try {
      playDictAudio(t, 1,
        () => __finishSpeak(spans),
        () => __speakFrom(tokens, spans, 0, 0, __voice()),  // 本地文件异常时回落老链
        false, 10000, 0, __voice());
      return;
    } catch (e) { /* 落回老链 */ }
  }
  /* 整句共用一个 <audio>（全局只造一个）：第一次在点击的同一个调用栈里创建并 play，
     这个元素就算「被授权」了，之后换 src 不再受自动播放策略限制。
     拿不到 Audio（Node 测试/极端老内核）就退回每段新建元素的老路径。 */
  __speakFrom(tokens, spans, 0, 0, __voice());
}

/* 全局唯一的朗读元素。懒创建：第一次用到时才 new，避免脚本一加载就占一个媒体槽 */
let __voiceEl = null;
function __voice() {
  try {
    if (!__voiceEl && typeof Audio === 'function') __voiceEl = new Audio();
  } catch (e) { __voiceEl = null; }
  return __voiceEl;
}

let __speakSeq = 0;
let __speakDone = null;
function __finishSpeak(spans) {
  __clearHi(spans);
  const cb = __speakDone;
  __speakDone = null;
  if (cb) cb();
}
/* 打断正在读的句子时，旧的回调必须作废（否则"读完自动跳题"会在新页面上触发） */
window.__cancelSpeak = () => { __speakSeq++; __speakDone = null; };
