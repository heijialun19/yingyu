/* ============================================================
   小鸟英语乐园 · 跟读评分引擎 v1
   ────────────────────────────────────────────────────────────
   用浏览器原生 SpeechRecognition 把孩子的跟读**识别成文字**，
   再和目标句做归一化比对，给出「听清度」评分。

   ★ 评分口径必须诚实（产品铁律，改前必读）：
   这是「听清度」（识别得有多准），**不是**「发音评分」。
   浏览器语音识别只认「说的词对不对」，听不出口音/重音/语调。
   所以 UI 上一律叫「听清度」，绝不出现「发音分」「发音评分」字样。
   识别不准时（孩子说对了但机器没识别出）宁可说「再试一次」，
   也绝不给低分打击孩子——误差一律朝宽松方向偏。

   ────────────────────────────────────────────────────────────
   识别支持情况（2026-10-25）：
   - Chrome / Edge / Safari（iOS 14.5+）：支持 webkitSpeechRecognition
   - Firefox / 国产套壳浏览器：不支持 → 引擎返回 null，UI 走「点击音节跟读」替代
   ────────────────────────────────────────────────────────────
   评分算法（宽松偏置，专为儿童设计）：
   1. 归一化：小写、去标点、缩写展开（what's → what is）、去语气词
   2. 编辑距离 + 词序对齐 → 逐词对错
   3. 听清度 = 100 * (对的词数 / 目标词数)，但：
      - 少说一个虚词（a/the/is/am）只扣 2 分（不是按比例扣）
      - 完全没识别出（识别结果为空）→ 不打分，提示「没听清，再试一次」
      - 听清度 ≥ 80 → 🎉；60-79 → 👍；< 60 → 💪 再来一次
   ============================================================ */
'use strict';

/* ---------- 归一化 ---------- */
const __SPEECH_CONTRACTIONS = {
  "what's": 'what is', "where's": 'where is', "who's": 'who is',
  "it's": 'it is', "i'm": 'i am', "you're": 'you are', "we're": 'we are',
  "they're": 'they are', "he's": 'he is', "she's": 'she is', "that's": 'that is',
  "there's": 'there is', "let's": 'let us', "isn't": 'is not', "aren't": 'are not',
  "don't": 'do not', "doesn't": 'does not', "didn't": 'did not', "can't": 'can not',
  "cannot": 'can not', "won't": 'will not', "i've": 'i have', "i'll": 'i will',
  "i'd": 'i would', "he'll": 'he will', "she'll": 'she will', "we'll": 'we will',
};
/* 轻虚词：漏说这些几乎不算错（孩子嘴瓢很正常） */
const __SPEECH_FILLER = new Set(['a', 'an', 'the', 'am', 'is', 'are', 'to', 'of', 'and']);

function speechNorm(text) {
  let t = String(text || '').toLowerCase().trim();
  // 去掉所有标点，保留字母数字和空格
  t = t.replace(/[^a-z0-9\s']/g, ' ');
  // 展开缩写
  for (const [k, v] of Object.entries(__SPEECH_CONTRACTIONS)) t = t.split(k).join(v);
  // 去掉残留的撇号
  t = t.replace(/'/g, '');
  // 折叠空白
  t = t.replace(/\s+/g, ' ').trim();
  return t;
}

function speechWords(text) {
  return speechNorm(text).split(' ').filter(Boolean);
}

/* ---------- 逐词比对（编辑距离 + 宽松虚词） ---------- */
/**
 * 返回 { score: 0-100|null, words: [{word, ok}], detail, heard }
 * score 为 null = 没识别出任何东西，不能打分
 */
function speechScore(targetText, heardText) {
  const target = speechWords(targetText);
  const heard = speechWords(heardText);
  if (!target.length) return { score: 100, words: [], detail: 'ok', heard: heardText };
  if (!heard.length) return { score: null, words: [], detail: 'empty', heard: heardText };

  // 词袋比对（对儿童跟读更宽松：词序小错不算错）
  const heardPool = new Map();
  for (const w of heard) heardPool.set(w, (heardPool.get(w) || 0) + 1);

  let hardOK = 0, softMiss = 0, hardMiss = 0;
  const words = target.map(w => {
    const isFiller = __SPEECH_FILLER.has(w);
    const cnt = heardPool.get(w) || 0;
    if (cnt > 0) {
      heardPool.set(w, cnt - 1);
      hardOK++;
      return { word: w, ok: true };
    }
    if (isFiller) { softMiss++; return { word: w, ok: true, soft: true }; } // 虚词漏了算对
    hardMiss++;
    return { word: w, ok: false };
  });

  // 听清度：硬词全对 = 100；虚词漏一个扣 2 分；硬词错按比例扣
  const hardTotal = hardOK + hardMiss;
  let score = hardTotal === 0 ? 100 : Math.round(100 * hardOK / hardTotal);
  score = Math.max(0, score - softMiss * 2);
  score = Math.min(100, score);

  return {
    score,
    words,
    detail: hardMiss === 0 && softMiss === 0 ? 'perfect' : (hardMiss === 0 ? 'soft' : 'miss'),
    heard: heardText,
  };
}

/* ---------- 评分文案（诚实 + 鼓励） ---------- */
function speechVerdict(score) {
  if (score === null) return { emoji: '🤔', text: '没听清，再说一次吧', cls: '' };
  if (score >= 90) return { emoji: '🎉', text: '听得很清楚！', cls: 'good' };
  if (score >= 75) return { emoji: '👍', text: '不错哦，很接近了', cls: 'good' };
  if (score >= 55) return { emoji: '💪', text: '再试一次会更好', cls: 'mid' };
  return { emoji: '🌱', text: '跟着音频慢慢说', cls: 'mid' };
}

/* ---------- 浏览器语音识别封装 ---------- */
function speechRecognitionAvailable() {
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

/**
 * startListening({ lang, onResult, onInterim, onError, onEnd })
 *  → 返回 { stop() } 取消/停止
 *
 * onResult(finalText)  只在最终结果时调用一次
 * onInterim(text)      中间结果（可选，用于 UI 实时显示）
 * onError(err)         失败（no-speech / not-allowed / network）
 * onEnd()              无论成败结束
 */
function startListening(opts) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { if (opts.onError) opts.onError('unsupported'); return null; }
  const rec = new SR();
  rec.lang = opts.lang || 'en-US';
  rec.continuous = false;
  rec.interimResults = !!opts.onInterim;
  rec.maxAlternatives = 1;

  let finalText = '';
  rec.onresult = e => {
    let interim = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const r = e.results[i];
      if (r.isFinal) finalText += r[0].transcript + ' ';
      else interim += r[0].transcript;
    }
    if (opts.onInterim) opts.onInterim(interim);
  };
  rec.onerror = e => { if (opts.onError) opts.onError(e.error || 'error'); };
  rec.onend = () => {
    if (finalText.trim()) { if (opts.onResult) opts.onResult(finalText.trim()); }
    else if (opts.onError) opts.onError('no-speech');
    if (opts.onEnd) opts.onEnd();
  };
  try {
    rec.start();
    return { stop: () => { try { rec.stop(); } catch (e) {} } };
  } catch (e) {
    if (opts.onError) opts.onError('start-fail');
    return null;
  }
}

/* ---------- 词级逐字高亮（跟读 UI 用） ----------
   把目标句拆成 span，比对后给每个词加 ok/miss/skip 状态 */
function speechMarkSpans(targetText, result) {
  const words = String(targetText).split(/(\s+)/); // 保留空白
  let wi = 0;
  return words.map(tok => {
    if (/^\s+$/.test(tok)) return tok;
    const w = result.words[wi++];
    if (!w) return `<span class="sp-w">${esc(tok)}</span>`;
    const cls = w.ok ? (w.soft ? 'sp-skip' : 'sp-ok') : 'sp-miss';
    return `<span class="sp-w ${cls}">${esc(tok)}</span>`;
  }).join('');
}

/* ---------- 打分动画（给孩子正反馈，不是炫技） ---------- */
function speechBurst(container) {
  if (!container || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const colors = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4EC5F1', '#9B72FF'];
  for (let i = 0; i < 14; i++) {
    const p = document.createElement('i');
    p.style.cssText = `position:absolute;left:${10 + Math.random() * 80}%;top:${20 + Math.random() * 40}%;width:8px;height:8px;border-radius:50%;background:${colors[i % 5]};pointer-events:none;animation:speechBurst 0.7s ease forwards;animation-delay:${Math.random() * 0.2}s`;
    container.appendChild(p);
    setTimeout(() => p.remove(), 1000);
  }
}
