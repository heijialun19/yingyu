/* ============================================================
   小鸟英语乐园 · 共享运行时
   进度存储(localStorage) / 语音点读 / 音效 / 星星奖励 / 徽章 / 打卡
   ============================================================ */
'use strict';

const $  = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* ---------------- 日期工具 ---------------- */
function todayStr(off = 0) {
  const d = new Date(); d.setDate(d.getDate() + off);
  const p = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/* ---------------- 多伙伴档案系统 ----------------
   一台电脑可以有多个小朋友（如兄妹），每人一份独立进度；
   支持导出/导入 JSON 备份，换电脑、清缓存也不丢进度。 */
const PROFILES_KEY = 'birdie_abc_profiles_v2';
const LEGACY_KEY = 'birdie_abc_v1';
const AVATARS = ['🐤','🐰','🐯','🐼','🦊','🐸','🐙','🦄','🐝','🐳','🐨','🦁'];

const Profiles = {
  meta: null, // { list: [{id,name,avatar,grade,created}], activeId }
  load() {
    try { this.meta = JSON.parse(localStorage.getItem(PROFILES_KEY)); } catch (e) { this.meta = null; }
    if (!this.meta || !Array.isArray(this.meta.list) || !this.meta.list.length) {
      this.meta = { list: [], activeId: null };
      // 旧版单档案自动迁移
      const legacy = localStorage.getItem(LEGACY_KEY);
      if (legacy) {
        try {
          const old = JSON.parse(legacy);
          const p = { id: 'p_' + Date.now().toString(36), name: '我的档案', avatar: '🐤', grade: old.grade || '', created: Date.now() };
          this.meta.list.push(p); this.meta.activeId = p.id;
          try { localStorage.setItem(this.dataKey(p.id), legacy); } catch (e) {}
        } catch (e) {}
      }
      if (!this.meta.list.length) {
        this.meta.list.push({ id: 'p_default', name: '小朋友', avatar: '🐤', grade: '', created: Date.now() });
        this.meta.activeId = 'p_default';
      }
      this.saveMeta();
    }
    if (!this.meta.list.find(p => p.id === this.meta.activeId)) this.meta.activeId = this.meta.list[0].id;
    return this.meta;
  },
  saveMeta() { try { localStorage.setItem(PROFILES_KEY, JSON.stringify(this.meta)); } catch (e) {} },
  dataKey(id) { return 'birdie_abc_p_' + id; },
  active() { return this.meta.list.find(p => p.id === this.meta.activeId) || this.meta.list[0]; },
  create(name, avatar, grade) {
    const p = { id: 'p_' + Date.now().toString(36) + Math.floor(Math.random() * 99), name: (name || '').trim() || '小朋友', avatar: avatar || '🐤', grade: grade || '', created: Date.now() };
    this.meta.list.push(p); this.meta.activeId = p.id; this.saveMeta();
    try { localStorage.setItem(this.dataKey(p.id), JSON.stringify(Store.def())); } catch (e) {}
    return p;
  },
  switchTo(id) { if (this.meta.list.find(p => p.id === id)) { this.meta.activeId = id; this.saveMeta(); } },
  remove(id) {
    if (this.meta.list.length <= 1) return false; // 至少保留一个档案
    if (!confirm('确定删除这个档案吗？它的全部学习进度将无法恢复。')) return false;
    try { localStorage.removeItem(this.dataKey(id)); } catch (e) {}
    this.meta.list = this.meta.list.filter(p => p.id !== id);
    if (this.meta.activeId === id) this.meta.activeId = this.meta.list[0].id;
    this.saveMeta(); return true;
  },
  updateActive(patch) { Object.assign(this.active(), patch); this.saveMeta(); },
  exportActive() {
    let data = {}; try { data = JSON.parse(localStorage.getItem(this.dataKey(this.active().id)) || '{}'); } catch (e) {}
    return JSON.stringify({ app: 'birdie-abc', v: 1, exported: new Date().toISOString(), profile: this.active(), data });
  },
  importActive(text) {
    const obj = JSON.parse(text);
    if (!obj || obj.app !== 'birdie-abc' || !obj.profile) throw new Error('格式不对');
    const p = { id: 'p_' + Date.now().toString(36) + Math.floor(Math.random() * 99), name: obj.profile.name || '导入的档案', avatar: obj.profile.avatar || '🐤', grade: obj.profile.grade || '', created: Date.now() };
    this.meta.list.push(p); this.meta.activeId = p.id; this.saveMeta();
    try { localStorage.setItem(this.dataKey(p.id), JSON.stringify(obj.data || {})); } catch (e) {}
    return p;
  }
};

/* ---------------- 进度存储（按档案隔离） ---------------- */
const Store = {
  d: null,
  def() {
    return {
      name: '', stars: 0, soundOn: true, grade: '',
      badges: {},                    // {badgeId: date}
      letters: {},                   // {A: {t}}
      words: {},                     // {cat: {box, due}}  box:0-5 记忆盒子
      grammar: {},                   // {g1: {t, stars}}
      streak: { count: 0, last: '' },
      daily: { date: '', tasks: { letter: false, words: false, game: false }, bonus: false },
      activity: {}                   // {2026-10-24: {letters,words,games,grammar,stars}}
    };
  },
  load() {
    Profiles.load();
    let d = null;
    try { d = JSON.parse(localStorage.getItem(Profiles.dataKey(Profiles.active().id))); } catch (e) { d = null; }
    this.d = Object.assign(this.def(), d || {});
    const def = this.def();
    for (const k of Object.keys(def)) if (this.d[k] === undefined) this.d[k] = def[k];
    // 年级以档案为准
    this.d.grade = Profiles.active().grade || this.d.grade;
    if (this.d.daily.date !== todayStr()) this.d.daily = { date: todayStr(), tasks: { letter: false, words: false, game: false }, bonus: false };
    return this.d;
  },
  save() {
    try {
      this.d.grade = Profiles.active().grade || this.d.grade;
      localStorage.setItem(Profiles.dataKey(Profiles.active().id), JSON.stringify(this.d));
    } catch (e) {}
  },
  resetActive() { try { localStorage.removeItem(Profiles.dataKey(Profiles.active().id)); } catch (e) {} }
};
Store.load();

/* ---------------- 打卡 + 活动记录 ---------------- */
function markActivity(type) {
  const t = todayStr();
  const a = Store.d.activity[t] || (Store.d.activity[t] = { letters: 0, words: 0, games: 0, grammar: 0, stars: 0 });
  a[type] = (a[type] || 0) + 1;
  const s = Store.d.streak;
  if (s.last !== t) {
    s.count = (s.last === todayStr(-1)) ? s.count + 1 : 1;
    s.last = t;
  }
  checkBadges(); Store.save(); updateNavStats();
}

function completeDailyTask(kind) { // 'letter' | 'words' | 'game'
  if (Store.d.daily.tasks[kind]) return;
  Store.d.daily.tasks[kind] = true;
  const t = Object.values(Store.d.daily.tasks);
  if (t.every(Boolean) && !Store.d.daily.bonus) {
    Store.d.daily.bonus = true;
    addStars(5);
    setTimeout(() => { sfx.win(); toast('🎉 今日任务全部完成！奖励 5 颗星星！'); confetti(); }, 600);
  }
  Store.save();
}

/* ---------------- 星星与徽章 ---------------- */
function addStars(n) {
  Store.d.stars += n;
  const t = todayStr();
  const a = Store.d.activity[t] || (Store.d.activity[t] = { letters: 0, words: 0, games: 0, grammar: 0, stars: 0 });
  a.stars = (a.stars || 0) + n;
  sfx.star(); checkBadges(); Store.save(); updateNavStats();
}

function letterCount() { return Object.keys(Store.d.letters).length; }
function wordMasteredCount() { return Object.values(Store.d.words).filter(w => w.box >= 2).length; }
function wordSeenCount() { return Object.keys(Store.d.words).length; }
function grammarDoneCount() { return Object.keys(Store.d.grammar).length; }

function awardBadge(id) {
  if (Store.d.badges[id]) return;
  const b = BADGES.find(x => x.id === id); if (!b) return;
  Store.d.badges[id] = todayStr(); Store.save();
  setTimeout(() => { sfx.win(); toast(`${b.emoji} 获得徽章【${b.name}】！${b.desc}`); confetti(); }, 400);
}

function checkBadges() {
  const d = Store.d;
  const w = wordMasteredCount();
  if (letterCount() >= 10) awardBadge('letter10');
  if (letterCount() >= 26) awardBadge('letter26');
  if (w >= 20)  awardBadge('word20');
  if (w >= 100) awardBadge('word100');
  if (w >= 500) awardBadge('word500');
  if (w >= 1000) awardBadge('word1000');
  const s1Ids = GRAMMAR_LEVELS.filter(l => l.stage === 's1').map(l => l.id);
  if (s1Ids.every(id => d.grammar[id])) awardBadge('grammar8');
  if (grammarDoneCount() >= GRAMMAR_LEVELS.length) awardBadge('grammar1');
  if (d.streak.count >= 3) awardBadge('streak3');
  if (d.streak.count >= 7) awardBadge('streak7');
  if (d.stars >= 100) awardBadge('star100');
}

/* ---------------- 学习事件 ---------------- */
function learnLetter(L) {
  if (!Store.d.letters[L]) { Store.d.letters[L] = { t: Date.now() }; markActivity('letters'); completeDailyTask('letter'); }
  checkBadges(); Store.save();
}

/* 单词进入记忆盒子（艾宾浩斯）；答错记入错题本 */
function touchWord(word, correct) {
  const rec = Store.d.words[word] || { box: 0, due: 0, wrong: 0 };
  rec.box = correct ? Math.min(rec.box + 1, 5) : 0;
  if (!correct) rec.wrong = (rec.wrong || 0) + 1;
  const days = rec.box === 0 ? 0 : (REVIEW_INTERVALS[Math.min(rec.box - 1, REVIEW_INTERVALS.length - 1)] || 15);
  rec.due = Date.now() + days * 864e5;
  Store.d.words[word] = rec;
  markActivity('words'); Store.save();
}
/* 累计词单：我的年级及以下所有年级（科学的分级=高年级涵盖低年级知识） */
function cumGrades() {
  const gi = Math.max(0, GRADES.findIndex(g => g.id === myGrade().id));
  return GRADES.slice(0, gi + 1);
}
function cumWordCount() { return cumGrades().reduce((s, g) => s + gradeWordCount(g.id), 0); }
function cumMasteredCount() {
  let n = 0;
  cumGrades().forEach(g => g.themes.forEach(t => t.words.forEach(w => { if ((Store.d.words[w.w] || {}).box >= 2) n++; })));
  return n;
}
/* 待补词：累计范围内未掌握的，先补本年级、再补低年级漏洞 */
function planWords() {
  const list = [];
  cumGrades().slice().reverse().forEach(g => g.themes.forEach(t => t.words.forEach(w => {
    const rec = Store.d.words[w.w];
    if (!rec || rec.box < 2) list.push(Object.assign({ themeName: t.name, themeEmoji: t.emoji, themeColor: t.color, fromGrade: g.name }, w));
  })));
  return list;
}
/* 错题本：答错过的词 */
function wrongWords() {
  return Object.entries(Store.d.words)
    .filter(([w, r]) => (r.wrong || 0) > 0)
    .sort((a, b) => (b[1].wrong || 0) - (a[1].wrong || 0))
    .map(([w, r]) => {
      const th = THEMES.find(t => t.words.some(x => x.w === w));
      const wd = th && th.words.find(x => x.w === w);
      return wd ? Object.assign({ themeName: th.name, themeEmoji: th.emoji, themeColor: th.color, wrongCount: r.wrong }, wd) : null;
    }).filter(Boolean);
}
function dueWords() {
  const now = Date.now();
  return Object.entries(Store.d.words)
    .filter(([w, r]) => r.box > 0 && r.box < 5 && r.due <= now)
    .sort((a, b) => a[1].due - b[1].due)
    .map(([w]) => w);
}
function grammarLevelDone(id, stars) {
  const old = Store.d.grammar[id];
  Store.d.grammar[id] = { t: Date.now(), stars: Math.max(stars, old ? old.stars : 0) };
  markActivity('grammar'); Store.save();
}
function gameDone() { markActivity('games'); completeDailyTask('game'); }

/* ---------------- 年级体系（全站主线，与档案联动） ---------------- */
function myGrade() {
  const gid = Profiles.active().grade || Store.d.grade;
  return GRADES.find(g => g.id === gid) || GRADES[0];
}
function gradeWordCount(id) { const g = GRADES.find(x => x.id === id); return g ? g.themes.reduce((s, t) => s + t.words.length, 0) : 0; }
function setGrade(id, silent) {
  const g = GRADES.find(x => x.id === id); if (!g) return;
  const changed = (Profiles.active().grade !== id);
  Profiles.updateActive({ grade: id });
  Store.d.grade = id; Store.save(); updateNavStats();
  const hb = document.getElementById('bGrade'); if (hb) hb.textContent = `🎓 ${g.name}`;
  if (changed && !silent) { sfx.win(); toast(`🎓 已切换到${g.name}！单词镇、游戏、句子工厂都为你调整好了`); }
  document.querySelectorAll('.grade-btn').forEach(b => b.classList.toggle('on', b.dataset.g === id));
}
/* 渲染年级选择按钮组 */
function renderGradePicker(sel) {
  const cur = Store.d.grade || '';
  const el = document.querySelector(sel); if (!el) return;
  el.innerHTML = GRADES.map(g => `
    <button class="grade-btn ${g.id === cur ? 'on' : ''}" data-g="${g.id}" onclick="setGrade('${g.id}')">
      <span class="ge">${g.emoji}</span><b>${g.name}</b>
      <small>${gradeWordCount(g.id)} 词</small>
    </button>`).join('');
}

/* ---------------- 语音核心：词典真人发音（有道MP3）优先，系统语音兜底 ----------------
   手机浏览器（尤其微信/国产内核）的 speechSynthesis 极不可靠；
   有道词典发音接口返回高质量 MP3，国内实测 0.2 秒可达，单词/句子/中文都支持；
   Audio 元件在点击手势内 play() 即可出声，兼容所有手机浏览器。
   万一有道失败（断网/接口变化），自动回退浏览器系统语音，永远有声音。 */
let VOICES = [];
function loadVoices() { try { VOICES = speechSynthesis.getVoices(); } catch (e) {} }
if ('speechSynthesis' in window) { loadVoices(); speechSynthesis.onvoiceschanged = loadVoices; }

function pickVoice(lang) {
  const p = lang.split('-')[0];
  return VOICES.find(v => v.lang.replace('_', '-').toLowerCase() === lang.toLowerCase() && v.localService)
      || VOICES.find(v => v.lang.toLowerCase().startsWith(p));
}

/* 系统语音（兜底用） */
function synthSpeak(text, lang = 'en-US', rate = 0.85, onEnd) {
  if (!('speechSynthesis' in window)) { if (onEnd) onEnd(); return; }
  try {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang; u.rate = rate; u.pitch = 1.05;
    const v = pickVoice(lang); if (v) u.voice = v;
    if (onEnd) { u.onend = onEnd; u.onerror = onEnd; }
    speechSynthesis.speak(u);
  } catch (e) { if (onEnd) onEnd(); }
}

/* 有道词典发音（全站统一的真人女声） */
const youdaoUrl = t => 'https://dict.youdao.com/dictvoice?type=1&audio=' + encodeURIComponent(t);
let __curAudio = null;
const __audioCache = new Map();
let __engineCooldownUntil = 0; // 有道故障后的冷静期：期间全部走系统语音，避免音色来回切换
function stopAllSpeech() {
  if (__curAudio) { try { __curAudio.onended = __curAudio.onerror = null; __curAudio.pause(); } catch (e) {} }
  try { speechSynthesis.cancel(); } catch (e) {}
}
/* 预热：提前把单词的音频拉到缓存（答题前预热，答对回显零延迟） */
function prewarmWord(text) {
  if (__audioCache.has(text) || !text) return;
  try { const a = new Audio(youdaoUrl(text)); a.preload = 'auto'; __audioCache.set(text, a); } catch (e) {}
}
function playYoudao(text, rate, onEnd, onFail) {
  let a = __audioCache.get(text);
  if (!a) {
    a = new Audio(youdaoUrl(text)); a.preload = 'auto';
    if (__audioCache.size > 300) __audioCache.clear();
    __audioCache.set(text, a);
  }
  __curAudio = a;
  let done = false;
  const end = () => { if (!done) { done = true; clearTimeout(guard); if (onEnd) onEnd(); } };
  const fail = () => {
    if (done) return;
    done = true; clearTimeout(guard);
    try { a.pause(); } catch (e) {} // 关键：掐断迟到加载的音频，防止和兜底语音重叠出双声
    __engineCooldownUntil = Date.now() + 45000; // 45秒冷静期统一用系统语音，保证音色一致
    if (onFail) onFail();
  };
  a.onended = end; a.onerror = fail;
  // 空音频（接口返回异常内容）立即判定失败
  a.onloadedmetadata = () => { if (isFinite(a.duration) && a.duration === 0) fail(); };
  // 关键：一旦真正开始播放就取消超时——超时只负责"加载不出来"，不掐正在播的慢速长音频
  a.onplaying = () => { if (guard) clearTimeout(guard); };
  try { a.currentTime = 0; } catch (e) {}
  // 变速朗读（慢速拼读用同一真人录音，保持音高不变卡通化）
  const pr = Math.max(0.5, Math.min(1.5, rate || 1));
  try { a.preservesPitch = true; a.mozPreservesPitch = true; a.webkitPreservesPitch = true; } catch (e) {}
  try { a.playbackRate = pr; } catch (e) {}
  let guard = setTimeout(fail, 3500); // 3.5 秒没开始播放就整体降级
  const p = a.play();
  if (p && p.catch) p.catch(fail);
}

/* 统一朗读入口（按内容自动路由引擎，音色保持一致）：
   - 真实英文单词/句子/字母名/字母音组合 → 有道词典真人女声（全站统一音色）
   - 中文文本 → 系统语音（有道不支持中文句）
   - 有道故障 → 45 秒冷静期内全部走系统语音（宁可整体换音色，不来回切换） */
function speak(text, lang = 'en-US', rate = 0.85) {
  if (!Store.d.soundOn) return; // 全局 🔇 静音对语音同样生效
  const t = String(text).trim(); if (!t) return;
  stopAllSpeech();
  if (lang.startsWith('zh')) { synthSpeak(t, lang, rate); return; }
  if (Date.now() < __engineCooldownUntil) { synthSpeak(t, lang, rate); return; }
  playYoudao(t, rate, null, () => synthSpeak(t, lang, rate));
}
function speakCN(text, rate = 0.95) { speak(text, 'zh-CN', rate); }

/* 链式朗读：读完一句自动读下一句；冷却期或有道失败则整链走系统语音（音色一致） */
function speakChain(items) {
  if (!Store.d.soundOn) return;
  stopAllSpeech();
  const synthAll = () => { try { speechSynthesis.cancel(); } catch (e) {} items.forEach(x => synthSpeak(x.text, x.lang || 'en-US', x.rate || 0.85)); };
  if (Date.now() < __engineCooldownUntil) { synthAll(); return; }
  let failed = false;
  const next = i => {
    if (failed || i >= items.length) return;
    const it = items[i];
    playYoudao(it.text, it.rate, () => next(i + 1), () => { failed = true; synthAll(); });
  };
  next(0);
}

/* 拼读文本（仅用于屏幕显示提示，不再朗读——拟音串 TTS 读出来孩子听不懂） */
function phonicsText(word) {
  const letters = String(word).toLowerCase().split('').filter(c => /[a-z]/.test(c));
  if (!letters.length || letters.length > 12) return null;
  return letters.join('-');
}

/* 点单词：三读法（同一真人录音变速，孩子听懂每个音）
   ① 标准语速 ② 0.55 倍慢速拖长（听清拼读）③ 再标准一遍收尾 */
function speakWordDouble(word) {
  sfx.pop();
  const w = String(word).trim();
  speakChain([
    { text: w, rate: 1 },
    { text: w, rate: 0.55 },
    { text: w, rate: 1 }
  ]);
}

/* ---------------- 移动端声音解锁与诊断 ----------------
   iOS/部分安卓：第一次出声必须在手指点击事件内触发。
   首次触碰时静音播放一小段，同时解锁 <audio> 通道和 speechSynthesis 引擎。 */
let __speechUnlocked = false, __audioUnlockDone = false;
function unlockAudioChannels() {
  if (!__audioUnlockDone) {
    __audioUnlockDone = true;
    try {
      const a = new Audio(youdaoUrl('hi'));
      a.volume = 0;
      const p = a.play();
      if (p && p.catch) p.catch(() => {});
      setTimeout(() => { try { a.pause(); } catch (e) {} }, 1500);
    } catch (e) {}
  }
  if (!__speechUnlocked && 'speechSynthesis' in window) {
    __speechUnlocked = true;
    try {
      const u = new SpeechSynthesisUtterance(' ');
      u.volume = 0;
      speechSynthesis.speak(u);
    } catch (e) {}
  }
}
document.addEventListener('pointerdown', unlockAudioChannels, { capture: true });
document.addEventListener('keydown', unlockAudioChannels, { capture: true });

/* 语音环境检测（家长中心诊断用 / 微信提示） */
function speechEnv() {
  const has = 'speechSynthesis' in window;
  let voices = [];
  try { voices = speechSynthesis.getVoices() || []; } catch (e) {}
  return {
    available: true, // 有道发音 + 系统语音双引擎，总有方案
    engine: '词典真人发音（有道）+ 系统语音兜底',
    synthAvailable: has,
    unlocked: __speechUnlocked,
    voiceCount: voices.length,
    enVoice: (voices.find(v => /^en/i.test(v.lang)) || {}).name || null,
    wechat: /MicroMessenger/i.test(navigator.userAgent)
  };
}
/* 微信内打开：词典发音通常可用，若仍无声提示改用系统浏览器 */
(function wechatTip() {
  if (!/MicroMessenger/i.test(navigator.userAgent)) return;
  document.body.insertAdjacentHTML('afterbegin', `
    <div class="wechat-tip" onclick="this.remove()">
      📱 本站已用<b>词典真人发音</b>，微信里一般能正常出声；若仍无声，请点右上角「···」→「在浏览器打开」
      <span style="float:right;cursor:pointer">✕</span>
    </div>`);
})();

/* ---------------- 音效（WebAudio 合成，零音频文件） ---------------- */
let AC = null;
function ac() {
  if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} }
  if (AC && AC.state === 'suspended') AC.resume();
  return AC;
}
function tone(freq, delay, dur, type = 'sine', vol = 0.18) {
  const ctx = ac(); if (!ctx || !Store.d.soundOn) return;
  const t0 = ctx.currentTime + delay;
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type; o.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g); g.connect(ctx.destination);
  o.start(t0); o.stop(t0 + dur + 0.05);
}
const sfx = {
  pop()      { tone(520, 0, 0.08, 'triangle', 0.12); },
  correct()  { tone(523, 0, 0.12); tone(659, 0.09, 0.12); tone(784, 0.18, 0.22); },
  wrong()    { tone(220, 0, 0.18, 'square', 0.08); tone(174, 0.15, 0.25, 'square', 0.08); },
  star()     { tone(880, 0, 0.09, 'triangle', 0.14); tone(1175, 0.07, 0.14, 'triangle', 0.14); },
  win()      { [523, 587, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.11, 0.18, 'triangle', 0.16)); }
};

/* ---------------- 界面组件 ---------------- */
const NAV_ITEMS = [
  { id: 'index',   href: 'index.html',   emoji: '🏠', label: '首页' },
  { id: 'letters', href: 'letters.html', emoji: '🏝️', label: '字母岛' },
  { id: 'words',   href: 'words.html',   emoji: '🏘️', label: '单词镇' },
  { id: 'grammar', href: 'grammar.html', emoji: '🏭', label: '句子工厂' },
  { id: 'games',   href: 'games.html',   emoji: '🎡', label: '游戏乐园' },
  { id: 'parents', href: 'parents.html', emoji: '👨‍👩‍👧', label: '家长中心' },
];

function renderNav(activeId) {
  const links = NAV_ITEMS.map(n => `
    <a class="nav-link ${n.id === activeId ? 'on' : ''}" href="${n.href}">
      <span class="nav-emoji">${n.emoji}</span><span class="nav-txt">${n.label}</span>
    </a>`).join('');
  document.body.insertAdjacentHTML('afterbegin', `
    <header class="nav">
      <a class="brand" href="index.html">
        <span class="brand-bird">🐤</span>
        <span class="brand-txt">小鸟英语乐园<small>Birdie ABC</small></span>
      </a>
      <nav class="nav-links">${links}</nav>
      <div class="nav-stats">
        <button class="chip" id="profileBtn" title="小伙伴档案（切换/新建/备份）">${Profiles.active().avatar} <b id="navProfile">${esc(Profiles.active().name)}</b></button>
        <a class="chip" href="index.html#grade-setting" title="我的年级（点击修改）">🎓 <b id="navGrade">${myGrade().name}</b></a>
        <button class="chip" id="soundBtn" title="声音开关">${Store.d.soundOn ? '🔊' : '🔇'}</button>
        <span class="chip" id="streakChip" title="连续学习天数">🔥 <b id="navStreak">${Store.d.streak.count}</b> 天</span>
        <span class="chip gold" title="我的星星">⭐ <b id="navStars">${Store.d.stars}</b></span>
      </div>
    </header>`);
  $('#soundBtn').addEventListener('click', () => {
    Store.d.soundOn = !Store.d.soundOn; Store.save();
    $('#soundBtn').textContent = Store.d.soundOn ? '🔊' : '🔇';
    if (Store.d.soundOn) sfx.pop();
  });
  $('#profileBtn').addEventListener('click', openProfileModal);
}
function updateNavStats() {
  const s = $('#navStars'), k = $('#streakChip b'), g = $('#navGrade'), pr = $('#navProfile'), pb = $('#profileBtn');
  if (s) s.textContent = Store.d.stars;
  if (k) k.textContent = Store.d.streak.count;
  if (g) g.textContent = myGrade().name;
  if (pr) pr.textContent = Profiles.active().name;
  if (pb) pb.innerHTML = Profiles.active().avatar + ' <b id="navProfile">' + esc(Profiles.active().name) + '</b>';
}

function renderDecor() {
  document.body.insertAdjacentHTML('beforeend',
    `<div class="sky-decor" aria-hidden="true">
       <div class="cloud c1">☁️</div><div class="cloud c2">⛅</div><div class="cloud c3">☁️</div>
       <div class="sun">🌞</div>
     </div>`);
}

function toast(msg) {
  const el = document.createElement('div');
  el.className = 'toast'; el.innerHTML = msg;
  document.body.appendChild(el);
  setTimeout(() => el.classList.add('show'), 20);
  setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 400); }, 2600);
}

function confetti() {
  const colors = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4EC5F1', '#9B72FF', '#FF9F45'];
  const box = document.createElement('div');
  box.className = 'confetti-box';
  for (let i = 0; i < 28; i++) {
    const p = document.createElement('i');
    p.style.left = (5 + Math.random() * 90) + 'vw';
    p.style.background = colors[i % colors.length];
    p.style.animationDelay = (Math.random() * 0.3) + 's';
    p.style.animationDuration = (0.9 + Math.random() * 0.9) + 's';
    p.style.transform = `rotate(${Math.random() * 360}deg)`;
    box.appendChild(p);
  }
  document.body.appendChild(box);
  setTimeout(() => box.remove(), 2200);
}

/* 星星飞入动画（从触发元素飞向右上角星星计数） */
function flyStar(fromEl) {
  if (!fromEl) return;
  const r = fromEl.getBoundingClientRect();
  const s = document.createElement('div');
  s.className = 'fly-star'; s.textContent = '⭐';
  s.style.left = (r.left + r.width / 2) + 'px';
  s.style.top = (r.top + r.height / 2) + 'px';
  document.body.appendChild(s);
  setTimeout(() => s.remove(), 1000);
}

/* 通用：答对/答错反馈 */
function feedback(el, ok) {
  if (!el) return;
  el.classList.add(ok ? 'good' : 'bad');
  setTimeout(() => el.classList.remove('good', 'bad'), 700);
}

/* ---------------- 小伙伴档案管理弹窗 ---------------- */
let __pickedAvatar = null;
function openProfileModal() {
  sfx.pop();
  closeProfileModal();
  const p = Profiles.active();
  __pickedAvatar = null;
  const rows = Profiles.meta.list.map(x => `
    <div class="profile-row ${x.id === p.id ? 'on' : ''}">
      <span class="pa">${x.avatar}</span>
      <div style="flex:1;min-width:0">
        <b>${esc(x.name)}${x.id === p.id ? ' <small style="color:#4E9E59">（当前）</small>' : ''}</b>
        <small style="display:block;color:#5C6273">${x.grade ? GRADES.find(g => g.id === x.grade) ? GRADES.find(g => g.id === x.grade).name : '' : '未设年级'} · ${x.created ? new Date(x.created).toLocaleDateString() : ''}</small>
      </div>
      ${x.id === p.id ? '' : `<button class="btn mint" style="padding:6px 14px;font-size:.8rem" onclick="switchProfile('${x.id}')">🔄 切换</button>`}
      ${Profiles.meta.list.length > 1 ? `<button class="btn coral" style="padding:6px 12px;font-size:.8rem" onclick="removeProfile('${x.id}')">🗑️</button>` : ''}
    </div>`).join('');
  document.body.insertAdjacentHTML('beforeend', `
    <div class="modal-mask" id="profileMask" onclick="if(event.target===this)closeProfileModal()">
      <div class="modal card">
        <h2>👤 小伙伴档案</h2>
        <p style="font-size:.8rem;color:#5C6273;margin:4px 0 10px">一台电脑可以有多个小朋友，每人一份独立进度，互不打扰！</p>
        <div class="profile-list">${rows}</div>
        <details class="profile-tool">
          <summary>➕ 新建一个档案</summary>
          <div style="margin-top:10px">
            <input id="newName" type="text" placeholder="小伙伴的名字" maxlength="10" style="width:100%;padding:10px 14px;border:3px solid var(--lemon);border-radius:14px;font-family:inherit;font-size:.95rem">
            <div class="avatar-grid" style="margin-top:10px">
              ${AVATARS.map(a => `<button class="avatar-chip" data-a="${a}" onclick="pickAvatar(this)">${a}</button>`).join('')}
            </div>
            <div class="theme-tabs" style="margin-top:10px">
              ${GRADES.map(g => `<button class="theme-tab" data-g="${g.id}" onclick="this.parentNode.querySelectorAll('.theme-tab').forEach(b=>b.classList.remove('on'));this.classList.add('on')"><span class="te">${g.emoji}</span>${g.name}</button>`).join('')}
            </div>
            <button class="btn grape" style="margin-top:12px" onclick="createProfile()">✅ 创建并切换</button>
          </div>
        </details>
        <details class="profile-tool">
          <summary>💾 备份与恢复（换电脑、防丢失）</summary>
          <div style="margin-top:10px">
            <button class="btn" style="margin-bottom:8px" onclick="exportProfile()">📤 导出「${esc(p.name)}」的进度</button>
            <textarea id="backupBox" readonly placeholder="点上面的按钮，这里会出现备份码。把它保存好（或发到家长手机），就能在任何电脑恢复！" style="width:100%;height:72px;border:3px dashed var(--lake);border-radius:14px;padding:8px;font-size:.7rem;font-family:monospace;resize:vertical"></textarea>
            <div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap">
              <input type="file" id="importFile" accept=".json,.txt" style="display:none" onchange="importProfileFile(this)">
              <button class="btn orange" style="padding:8px 14px;font-size:.82rem" onclick="document.getElementById('importFile').click()">📂 选择备份文件</button>
              <button class="btn orange" style="padding:8px 14px;font-size:.82rem" onclick="importProfileText()">📥 粘贴备份码恢复</button>
            </div>
            <p style="font-size:.7rem;color:#5C6273;margin-top:6px">恢复会新建一个档案，不会覆盖现有进度。</p>
          </div>
        </details>
        <button class="btn ghost" style="margin-top:14px;width:100%" onclick="closeProfileModal()">关闭</button>
      </div>
    </div>`);
}
function closeProfileModal() { const m = document.getElementById('profileMask'); if (m) m.remove(); }
function pickAvatar(btn) {
  document.querySelectorAll('.avatar-chip').forEach(b => b.classList.remove('on'));
  btn.classList.add('on'); __pickedAvatar = btn.dataset.a;
}
function switchProfile(id) { Profiles.switchTo(id); location.reload(); }
function removeProfile(id) { if (Profiles.remove(id)) location.reload(); }
function createProfile() {
  const name = (document.getElementById('newName').value || '').trim() || '小朋友';
  const avatar = __pickedAvatar || '🐤';
  const gbtn = document.querySelector('.profile-tool .theme-tab.on');
  Profiles.create(name, avatar, gbtn ? gbtn.dataset.g : '');
  toast('🎉 档案创建成功！'); setTimeout(() => location.reload(), 600);
}
function exportProfile() {
  const text = Profiles.exportActive();
  const box = document.getElementById('backupBox'); if (box) box.value = text;
  try {
    const blob = new Blob([text], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = '小鸟英语乐园-' + Profiles.active().name + '.json';
    a.click();
  } catch (e) {}
  toast('📤 备份已生成并开始下载');
}
function importProfileFile(input) {
  const f = input.files && input.files[0]; if (!f) return;
  const r = new FileReader();
  r.onload = () => doImport(String(r.result));
  r.readAsText(f, 'utf-8');
}
function importProfileText() {
  let t = '';
  const box = document.getElementById('backupBox');
  if (box && box.value && box.value.trim().startsWith('{')) t = box.value;
  else t = prompt('把备份码粘贴到这里：') || '';
  if (t.trim()) doImport(t);
}
function doImport(text) {
  try {
    const p = Profiles.importActive(text);
    toast('📥 恢复成功！欢迎回来，' + p.name);
    setTimeout(() => location.reload(), 700);
  } catch (e) {
    toast('❌ 备份码不对，请检查后重试');
  }
}
