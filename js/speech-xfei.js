/* 小鸟英语乐园 · 讯飞 ISE 语音评测集成模块
   懒加载：仅当家长中心开启「云评测」时才激活
   隐私：录音仅在家长主动开启云评测后发送至讯飞服务器即时评分，不做存储
   回退：网络异常/引擎关闭 → 自动回退本地 DTW（speech-dtw.js）
   儿童评测：celevel=low（宽松），分制 0-100
   
   ★ 前置条件：用户已在 https://www.xfyun.cn 注册并创建「语音评测（流式版）」应用，
     将 APPID / APIKey / APISecret 填入下方 CONFIG（或家长中心输入框存入 localStorage）。 */
'use strict';

/* ---------- 配置（家长中心可改） ---------- */
const XFEI_CONFIG = {
  appId: '',        // ★ 讯飞控制台 → 应用管理 → APPID
  apiKey: '',       // ★ 同上 → APIKey  
  apiSecret: '',    // ★ 同上 → APISecret
  url: 'wss://ise-api.xfyun.cn/v2/open-ise',
  category: 'read_sentence',   // read_sentence（整句跟读）
  language: 'en',               // 英文
  accent: 'en_us',              // 美式
  celevel: 'low',               // 儿童宽松模式
  sampleRate: 16000,            // 16kHz PCM
  audioType: 1,                 // 1=uncompressed PCM
};

/* ---------- 工具 ---------- */
function xfeiGetConfig() {
  try {
    const saved = JSON.parse(localStorage.getItem('birdie_xfei_config') || '{}');
    return Object.assign({}, XFEI_CONFIG, saved);
  } catch (e) { return Object.assign({}, XFEI_CONFIG); }
}
function xfeiSetConfig(cfg) {
  try { localStorage.setItem('birdie_xfei_config', JSON.stringify(cfg)); } catch (e) {}
}
function xfeiEnabled() {
  try { return localStorage.getItem('birdie_asr_engine') === 'xfei'; } catch (e) { return false; }
}
function xfeiSetEnabled(on) {
  try { localStorage.setItem('birdie_asr_engine', on ? 'xfei' : 'dtw'); } catch (e) {}
}
function xfeiHasCredentials() {
  const c = xfeiGetConfig();
  return !!(c.appId && c.apiKey && c.apiSecret);
}

/* ---------- 签名（HMAC-SHA256） ---------- */
async function xfeiSign(host, path, dateStr, apiSecret) {
  const encoder = new TextEncoder();
  const origin = `host: ${host}\ndate: ${dateStr}\nPOST ${path} HTTP/1.1`;
  const key = await crypto.subtle.importKey('raw', encoder.encode(apiSecret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(origin));
  return btoa(String.fromCharCode(...new Uint8Array(sig)));
}

/* ---------- PCM 采集（16kHz 16bit mono）---------- */
async function xfeiRecord(seconds) {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) throw new Error('no-webaudio');
  const ctx = new AC();
  if (ctx.state === 'suspended') { try { await ctx.resume(); } catch (e) {} }

  const stream = await navigator.mediaDevices.getUserMedia({
    audio: { channelCount: 1, sampleRate: XFEI_CONFIG.sampleRate, echoCancellation: true, noiseSuppression: true }
  });

  return new Promise((resolve, reject) => {
    const processor = ctx.createScriptProcessor(4096, 1, 1);
    const source = ctx.createMediaStreamSource(stream);
    const chunks = [];
    let stopped = false;

    processor.onaudioprocess = (e) => {
      if (stopped) return;
      const input = e.inputBuffer.getChannelData(0);
      // Float32 → Int16
      const pcm = new Int16Array(input.length);
      for (let i = 0; i < input.length; i++) {
        const v = Math.max(-1, Math.min(1, input[i]));
        pcm[i] = Math.round(v * 32767);
      }
      chunks.push(pcm);
    };
    source.connect(processor);
    processor.connect(ctx.destination); // 某些浏览器需要 connect 才触发 onaudioprocess

    setTimeout(() => {
      stopped = true;
      try { processor.disconnect(); source.disconnect(); stream.getTracks().forEach(t => t.stop()); } catch (e) {}
      ctx.close();
      // 合并 chunks
      const total = chunks.reduce((a, c) => a + c.length, 0);
      const pcm = new Int16Array(total);
      let off = 0;
      for (const c of chunks) { pcm.set(c, off); off += c.length; }
      resolve(pcm);
    }, (seconds || 3.6) * 1000);
  });
}

/* ---------- WebSocket 评测（讯飞 ISE 协议） ---------- */
async function xfeiEvaluate(pcm, refText) {
  const cfg = xfeiGetConfig();
  const host = 'ise-api.xfyun.cn';
  const path = '/v2/open-ise';
  const dateStr = new Date().toUTCString();
  const sig = await xfeiSign(host, path, dateStr, cfg.apiSecret);
  const auth = `api_key="${cfg.apiKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${sig}"`;
  const url = `${cfg.url}?authorization=${encodeURIComponent(auth)}&host=${encodeURIComponent(host)}&date=${encodeURIComponent(dateStr)}`;

  return new Promise((resolve, reject) => {
    const ws = new WebSocket(url);
    let result = null;
    let audioOffset = 0;

    const PCM_BYTES = new Uint8Array(pcm.buffer);
    const FRAME_SIZE = 1280; // 40ms @16kHz 16bit
    let sent = 0;

    ws.onopen = () => {
      /* 首帧：评测配置 */
      const firstFrame = {
        common: { sub: 'ise', business_id: cfg.appId, dt_entry: 'en_en_evl', tte: 'utf-8' },
        data: {
          status: 0, // 首帧
          data_type: 1, // 音频
          data_encoding: 'raw',
          audio: '',
          business: {
            category: cfg.category,
            subcategory: cfg.category,
            ent: cfg.category,
            tte: 'utf-8',
            ttpatch: 'tte',
            text: '\uFEFF' + refText,
            launch: 'wpgs',
            ace: cfg.language,
            aupt: cfg.accent,
            ace_type: cfg.celevel,
            aum: cfg.audioType,
            auf: cfg.sampleRate,
            rstc: 'json',
          },
        },
      };
      ws.send(JSON.stringify(firstFrame));

      /* 音频帧（逐帧发送） */
      const sendAudio = () => {
        while (sent < PCM_BYTES.length) {
          const end = Math.min(sent + FRAME_SIZE, PCM_BYTES.length);
          const chunk = PCM_BYTES.slice(sent, end);
          sent = end;
          const isLast = sent >= PCM_BYTES.length;
          ws.send(JSON.stringify({
            data: {
              status: isLast ? 2 : 1,
              data_type: 1,
              data_encoding: 'raw',
              audio: btoa(String.fromCharCode(...chunk)),
            },
          }));
          if (isLast) return;
        }
      };
      setTimeout(sendAudio, 100); // 首帧后稍等
    };

    ws.onmessage = (e) => {
      try {
        const j = JSON.parse(e.data);
        if (j.code !== 0) { ws.close(); return reject(new Error('ise-error-' + j.code + ': ' + (j.message || ''))); }
        if (j.data && j.data.status === 2) {
          // 最终结果（XML）
          try {
            const xml = atob(j.data.data);
            result = parseIseXml(xml);
          } catch (ee) { /* base64 解码失败 */ }
          ws.close();
        }
      } catch (err) { /* 忽略解析错误 */ }
    };

    ws.onerror = () => reject(new Error('ws-error'));
    ws.onclose = () => {
      if (result) resolve(result);
      else reject(new Error('ise-no-result'));
    };

    // 超时保护
    setTimeout(() => { try { ws.close(); } catch (e) {} }, 15000);
  });
}

/* 解析讯飞 ISE XML 评分结果 */
function parseIseXml(xml) {
  const get = (tag) => { const m = xml.match(new RegExp('<' + tag + '>([^<]+)</' + tag + '>')); return m ? parseFloat(m[1]) : 0; };
  const overall = get('overall_score');
  const accuracy = get('accuracy_score');
  const fluency = get('fluency_score');
  const integrity = get('integrity_score');
  // 逐词得分
  const wordScores = [];
  const wordRe = /<word[^>]*content="([^"]+)"[^>]*>[\s\S]*?<total_score>([\d.]+)<\/total_score>[\s\S]*?<\/word>/g;
  let wm;
  while ((wm = wordRe.exec(xml)) !== null) {
    wordScores.push({ word: wm[1], score: parseFloat(wm[2]) });
  }
  return {
    overall, accuracy, fluency, integrity,
    score: Math.round(overall),
    words: wordScores,
    passed: overall >= 60,  // 讯飞 60 分及格，比 DTW 宽松
  };
}

/* ---------- 对外入口（兼容现有 scoreRepeat 接口） ---------- */
async function xfeiScoreRepeat(opts) {
  if (!xfeiEnabled() || !xfeiHasCredentials()) return null; // 引擎关闭 → 走 DTW
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return null;
  if (!window.WebSocket) return null;

  const refUrl = opts && opts.refUrl;
  if (!refUrl) return null;
  // 从 refUrl 提取目标文本（如 audio/sentences/hello.mp3 → 不行，需要原文）
  // 实际由调用方传入 refText（单词或句子原文）
  const refText = opts.refText || '';
  if (!refText) return null;

  const pcm = await xfeiRecord(opts.seconds || 3.6);
  return await xfeiEvaluate(pcm, refText);
}

window.SpeechXfei = {
  scoreRepeat: xfeiScoreRepeat,
  enabled: xfeiEnabled,
  setEnabled: xfeiSetEnabled,
  hasCredentials: xfeiHasCredentials,
  getConfig: xfeiGetConfig,
  setConfig: xfeiSetConfig,
};
