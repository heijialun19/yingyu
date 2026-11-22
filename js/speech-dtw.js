/* ============================================================
   小鸟英语乐园 · 离线跟读还原度引擎 v1
   ------------------------------------------------------------
   为什么换掉原来的 speech.js（浏览器 SpeechRecognition）：
     1) Chrome 的语音识别要把录音发到境外服务器，与本站「零联网、零上传」
        的产品铁律冲突；在国内/WebView 里基本不可用，孩子说对了也判错，
        这就是「跟读评分太差劲」的根因。
     2) Android WebView / 国产套壳浏览器根本没有 SpeechRecognition。
     3) 识别成文字只能比「词对不对」，听不出重音、连读、节奏。

   现在的做法（全程在本机）：
     标准 mp3 → 解码 → 16kHz → MFCC
     孩子录音 → 解码 → 16kHz → VTLN 频率规整（童声共振峰偏高）→ MFCC
     → 带状 DTW 对齐 → 还原度（音准 60% + 完整度 25% + 流利度 15%）

   ★ 口径必须诚实：这是「还原度」（和母语者录音的相似程度），
     不是音素级 GOP 打分，也不是考试发音分。UI 一律写「还原度」。
   ★ 不上传任何录音。录音只留在内存中，算完即弃。
   ============================================================ */
'use strict';

const DTW_CFG = {
  sampleRate: 16000,
  frameMs: 25,
  hopMs: 10,
  melBands: 22,
  mfcc: 13,
  preEmph: 0.97,
  vtln: [1.00, 1.06, 1.12, 1.18, 1.24],
  bandMin: 24,
  bandExtra: 12,
  /* 未校准映射：上线收集真实分数分布后可只调这两个数 */
  mapA: 118,
  mapB: 75,
  wAccuracy: 0.60,
  wComplete: 0.25,
  wFluency: 0.15,
};

/* ---------- 基础 DSP ---------- */
function dtwResample(x, from, to) {
  if (from === to) return x;
  const n = Math.max(1, Math.round(x.length * to / from));
  const out = new Float32Array(n);
  const ratio = from / to;
  for (let i = 0; i < n; i++) {
    const p = i * ratio;
    const i0 = Math.floor(p), i1 = Math.min(x.length - 1, i0 + 1);
    const f = p - i0;
    out[i] = x[i0] * (1 - f) + x[i1] * f;
  }
  return out;
}

function dtwHann(n) {
  const w = new Float64Array(n);
  for (let i = 0; i < n; i++) w[i] = 0.54 - 0.46 * Math.cos(2 * Math.PI * i / (n - 1));
  return w;
}

/* 迭代 FFT（实数输入，复数输出），长度取 2 的幂 */
function dtwFFT(re, im) {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) {
      let t = re[i]; re[i] = re[j]; re[j] = t;
      t = im[i]; im[i] = im[j]; im[j] = t;
    }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const ang = -2 * Math.PI / len;
    const wr = Math.cos(ang), wi = Math.sin(ang);
    for (let i = 0; i < n; i += len) {
      let cr = 1, ci = 0;
      for (let k = 0; k < len / 2; k++) {
        const ur = re[i + k], ui = im[i + k];
        const vr = re[i + k + len / 2] * cr - im[i + k + len / 2] * ci;
        const vi = re[i + k + len / 2] * ci + im[i + k + len / 2] * cr;
        re[i + k] = ur + vr; im[i + k] = ui + vi;
        re[i + k + len / 2] = ur - vr; im[i + k + len / 2] = ui - vi;
        const nr = cr * wr - ci * wi;
        ci = cr * wi + ci * wr; cr = nr;
      }
    }
  }
}

function hzToMel(hz) { return 2595 * Math.log10(1 + hz / 700); }
function melToHz(m) { return 700 * (Math.pow(10, m / 2595) - 1); }

/* mel 滤波器组；alpha 为 VTLN 频率轴缩放（只对童声一侧搜） */
function dtwFilterbank(sr, fftN, bands, alpha) {
  const lo = hzToMel(80), hi = hzToMel(sr / 2 * 0.92);
  const m = [];
  for (let i = 0; i < bands + 2; i++) m.push(lo + (hi - lo) * i / (bands + 1));
  const fb = [];
  for (let k = 0; k < bands; k++) {
    const f = [
      melToHz(m[k]) / alpha,
      melToHz(m[k + 1]) / alpha,
      melToHz(m[k + 2]) / alpha,
    ];
    const b = new Float64Array(fftN / 2 + 1);
    for (let j = 0; j < b.length; j++) {
      const hz = j * sr / fftN;
      let v = 0;
      if (hz >= f[0] && hz <= f[1] && f[1] > f[0]) v = (hz - f[0]) / (f[1] - f[0]);
      else if (hz > f[1] && hz <= f[2] && f[2] > f[1]) v = (f[2] - hz) / (f[2] - f[1]);
      b[j] = v;
    }
    fb.push(b);
  }
  return fb;
}

/* 提取 MFCC（13 维 + 一阶差分 = 26 维），并做 MVN */
function dtwFeatures(x, alpha) {
  const sr = DTW_CFG.sampleRate;
  const N = 512;                       // 16k * 25ms = 400 → 取 512 做 FFT
  const hop = Math.round(sr * DTW_CFG.hopMs / 1000);
  const win = dtwHann(N);
  const fb = dtwFilterbank(sr, N, DTW_CFG.melBands, alpha || 1);

  /* 预加重 */
  const y = new Float64Array(x.length);
  for (let i = 0; i < x.length; i++) y[i] = i ? x[i] - DTW_CFG.preEmph * x[i - 1] : x[i];

  const rows = [];
  let voiced = 0;
  for (let start = 0; start + N <= y.length; start += hop) {
    let energy = 0;
    const re = new Float64Array(N), im = new Float64Array(N);
    for (let i = 0; i < N; i++) {
      const v = y[start + i] * win[i];
      re[i] = v; energy += y[start + i] * y[start + i];
    }
    /* 帧能量相对峰值 -38dB 以下算静音，直接跳过（否则静音段的噪声会毁掉对齐） */
    if (energy < 1e-9) continue;
    dtwFFT(re, im);
    const power = new Float64Array(N / 2 + 1);
    for (let i = 0; i < power.length; i++) power[i] = re[i] * re[i] + im[i] * im[i];
    const coef = [];
    for (let k = 0; k < fb.length; k++) {
      let s = 0;
      for (let j = 1; j < power.length; j++) s += power[j] * fb[k][j];
      coef.push(Math.log(s + 1e-10));
    }
    /* DCT-II → 前 13 维 */
    const mf = [];
    for (let k = 0; k < DTW_CFG.mfcc; k++) {
      let s = 0;
      for (let j = 0; j < coef.length; j++) s += coef[j] * Math.cos(Math.PI * k * (j + 0.5) / coef.length);
      mf.push(s);
    }
    rows.push(mf);
    voiced++;
  }
  if (rows.length < 3) return { frames: [], voicedRatio: 0, frameCount: 0 };

  /* 一阶差分 */
  const out = rows.map((r, i) => {
    const prev = rows[Math.max(0, i - 1)], next = rows[Math.min(rows.length - 1, i + 1)];
    return r.concat(r.map((v, k) => (next[k] - prev[k]) * 0.5));
  });

  /* MVN：逐维减均值、除标准差（标准差太小就当常数维，不除） */
  const D = out[0].length;
  const mu = new Float64Array(D), sd = new Float64Array(D);
  for (const r of out) for (let d = 0; d < D; d++) mu[d] += r[d];
  for (let d = 0; d < D; d++) mu[d] /= out.length;
  for (const r of out) for (let d = 0; d < D; d++) { const z = r[d] - mu[d]; sd[d] += z * z; }
  for (let d = 0; d < D; d++) sd[d] = Math.sqrt(sd[d] / Math.max(1, out.length - 1));
  for (const r of out) for (let d = 0; d < D; d++) r[d] = sd[d] > 1e-4 ? (r[d] - mu[d]) / sd[d] : 0;

  return { frames: out, voicedRatio: voiced / Math.max(1, Math.ceil((y.length - N) / hop)), frameCount: out.length };
}

/* 带状 DTW，返回归一化距离 */
function dtwDistance(a, b) {
  const n = a.length, m = b.length;
  if (!n || !m) return 99;
  const band = Math.max(DTW_CFG.bandMin, Math.abs(n - m) + DTW_CFG.bandExtra);
  const INF = 1e18;
  const cost = [];
  for (let i = 0; i <= n; i++) cost.push(new Float64Array(m + 1).fill(INF));
  cost[0][0] = 0;
  const D = a[0].length;
  for (let i = 1; i <= n; i++) {
    const j0 = Math.max(1, i - band), j1 = Math.min(m, i + band);
    for (let j = j0; j <= j1; j++) {
      let s = 0;
      for (let d = 0; d < D; d++) { const z = a[i - 1][d] - b[j - 1][d]; s += z * z; }
      cost[i][j] = Math.sqrt(s / D) + Math.min(cost[i - 1][j], cost[i][j - 1], cost[i - 1][j - 1]);
    }
  }
  /* ★ 归一化必须用 max(n,m)，不要回溯路径长度：
     累计代价带 sqrt，浮点误差让「和父格相等」的 1e-9 判断在第一步就失败，
     回溯得到 steps=0 → 距离被放大几十倍（实测 same=0 但异词=75）。
     max(n,m) 是 DTW 的标准稳定归一，且路径长度本来就夹在 max(n,m) 与 n+m 之间。 */
  return cost[n][m] / Math.max(n, m);
}

/* ---------- 录音 → PCM ---------- */
function dtwRecord(seconds) {
  return new Promise((resolve, reject) => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || typeof MediaRecorder === 'undefined') {
      reject(new Error('no-recorder')); return;
    }
    let stream = null, rec = null, timer = null;
    const chunks = [];
    const done = () => {
      clearTimeout(timer);
      try { if (rec && rec.state !== 'inactive') rec.stop(); } catch (e) {}
      try { if (stream) stream.getTracks().forEach(t => t.stop()); } catch (e) {}
    };
    navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } })
      .then(s => {
        stream = s;
        let mime = '';
        for (const m of ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus']) {
          if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(m)) { mime = m; break; }
        }
        try { rec = mime ? new MediaRecorder(s, { mimeType: mime }) : new MediaRecorder(s); }
        catch (e) { done(); reject(e); return; }
        rec.ondataavailable = e => { if (e.data && e.data.size) chunks.push(e.data); };
        rec.onstop = () => { done(); resolve(new Blob(chunks, { type: rec.mimeType || mime })); };
        rec.onerror = e => { done(); reject(e.error || new Error('record-fail')); };
        rec.start();
        timer = setTimeout(() => { try { if (rec.state !== 'inactive') rec.stop(); } catch (e) {} }, (seconds || 3.6) * 1000);
      })
      .catch(e => { done(); reject(e); });
  });
}

async function dtwDecode(blobOrBuf, ctx) {
  let ab = blobOrBuf;
  if (blobOrBuf instanceof Blob) ab = await blobOrBuf.arrayBuffer();
  const buf = await ctx.decodeAudioData(ab.slice(0));
  let x = buf.numberOfChannels > 1 ? (() => {
    const a = buf.getChannelData(0), b = buf.getChannelData(1), o = new Float32Array(a.length);
    for (let i = 0; i < a.length; i++) o[i] = (a[i] + b[i]) * 0.5;
    return o;
  })() : new Float32Array(buf.getChannelData(0));
  x = dtwResample(x, buf.sampleRate, DTW_CFG.sampleRate);
  /* 峰值归一：设备音量差异不该影响相似度 */
  let peak = 0;
  for (let i = 0; i < x.length; i++) peak = Math.max(peak, Math.abs(x[i]));
  if (peak > 1e-6) for (let i = 0; i < x.length; i++) x[i] /= peak;
  return x;
}

/* ---------- 对外唯一入口 ---------- */
/**
 * scoreRepeat({ refUrl, seconds })
 *  → { ok, score, accuracy, complete, fluent, detail, voiced, duration }
 *    不抛异常；失败时在 detail 里说明原因，UI 一律走鼓励话术。
 */
async function scoreRepeat(opts) {
  const refUrl = opts && opts.refUrl;
  if (!refUrl) return { ok: false, detail: 'no-ref' };
  let ctx = null;
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return { ok: false, detail: 'no-webaudio' };
    ctx = new AC();
    if (ctx.state === 'suspended') { try { await ctx.resume(); } catch (e) {} }

    const [refBuf, voiceBlob] = await Promise.all([
      fetch(refUrl, { cache: 'force-cache' }).then(r => {
        if (!r.ok) throw new Error('ref-http-' + r.status);
        return r.arrayBuffer();
      }),
      dtwRecord(opts.seconds || 3.6),
    ]);

    const ref = await dtwDecode(refBuf, ctx);
    const test = await dtwDecode(voiceBlob, ctx);
    const refF = dtwFeatures(ref, 1);

    /* 孩子声道短、共振峰比成人参考音高 15-25%：只在测试侧搜 alpha */
    let best = 99, bestFeat = null;
    for (const a of DTW_CFG.vtln) {
      const tf = dtwFeatures(test, a);
      if (!tf.frames.length) continue;
      const d = dtwDistance(refF.frames, tf.frames);
      if (d < best) { best = d; bestFeat = tf; }
    }
    if (!bestFeat) return { ok: false, detail: 'too-quiet' };

    const duration = test.length / DTW_CFG.sampleRate;
    const refDur = ref.length / DTW_CFG.sampleRate;
    const ratio = duration / Math.max(0.1, refDur);

    /* 完整度：时长太短（只说了一半）直接压低；太长（长时间不说话）也压 */
    let complete = 100;
    if (ratio < 0.55) complete = Math.max(0, Math.round(100 * ratio / 0.55));
    else if (ratio > 2.4) complete = Math.max(40, Math.round(100 - (ratio - 2.4) * 30));
    complete = Math.min(complete, Math.round(60 + 40 * Math.min(1, bestFeat.voicedRatio / 0.45)));

    /* 流利度：中段长停顿（>0.5s 静音）会打断，按有声帧的连续性近似 */
    const fluent = Math.round(100 * Math.min(1, bestFeat.voicedRatio / 0.5));

    const accuracy = Math.max(0, Math.min(100, Math.round(DTW_CFG.mapA - DTW_CFG.mapB * best)));
    const score = Math.max(0, Math.min(100, Math.round(
      accuracy * DTW_CFG.wAccuracy + complete * DTW_CFG.wComplete + fluent * DTW_CFG.wFluency)));

    return {
      ok: true, score, accuracy, complete, fluent,
      detail: 'ok', voiced: bestFeat.voicedRatio,
      duration: +duration.toFixed(2), refDuration: +refDur.toFixed(2),
      dNorm: +best.toFixed(3),
    };
  } catch (e) {
    const msg = String((e && e.message) || e || '');
    if (/NotAllowed|Permission/i.test(msg)) return { ok: false, detail: 'mic-denied' };
    if (/too-quiet|no-recorder/i.test(msg)) return { ok: false, detail: msg };
    return { ok: false, detail: 'error', error: msg.slice(0, 80) };
  } finally {
    try { if (ctx) ctx.close(); } catch (e) {}
  }
}

/* 诚实文案：叫「还原度」，绝不叫「发音分」 */
function dtwVerdict(r) {
  if (!r || !r.ok) {
    if (r && r.detail === 'mic-denied') return { emoji: '🎙️', text: '没拿到麦克风权限，先点音节跟着念也行' };
    if (r && r.detail === 'too-quiet') return { emoji: '🤫', text: '没听到声音，凑近一点再说一次' };
    return { emoji: '🤔', text: '这次没听清，再来一次吧' };
  }
  if (r.score >= 88) return { emoji: '🎉', text: '很像录音里的话！' };
  if (r.score >= 72) return { emoji: '👍', text: '很不错，再跟一遍会更像' };
  if (r.score >= 55) return { emoji: '💪', text: '听着录音慢慢跟，别着急' };
  return { emoji: '🌱', text: '先听两遍，再一句一句跟着说' };
}

window.SpeechDTW = { scoreRepeat: scoreRepeat, verdict: dtwVerdict, cfg: DTW_CFG };
