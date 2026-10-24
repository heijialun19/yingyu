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
/* 限定头像：用星星解锁（星星的消费出口，让奖励有真实目标） */
const AVATAR_PRICES = { '🐼':30, '🦊':30, '🐙':50, '🦄':80, '🐳':80, '🦁':120 };

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
      name: '', stars: 0, soundOn: true, grade: '', lettersSkip: false,
      badges: {},                    // {badgeId: date}
      letters: {},                   // {A: {t}}
      words: {},                     // {cat: {box, due}}  box:0-5 记忆盒子
      grammar: {},                   // {g1: {t, stars}}
      books: {},                     // {b1: {t}} 读过的绘本
      streak: { count: 0, last: '' },
      daily: { date: '', tasks: { letter: false, words: false, game: false }, bonus: false, studySec: 0, break15: false, break30: false },
      unlocked: {},                  // {emoji: true} 星星解锁的限定头像
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
    if (this.d.daily.date !== todayStr()) this.d.daily = { date: todayStr(), tasks: { letter: false, words: false, game: false }, bonus: false, studySec: 0, break15: false, break30: false };
    // 字母任务只为「正在学字母」的孩子保留：没开始学（选学）、已学完、或点了跳过的，自动视为完成，
    // 保证「三任务全勤」奖励对每个孩子都可达
    const __letterN = Object.keys(this.d.letters || {}).length;
    if (this.d.lettersSkip || __letterN === 0 || __letterN >= 26) this.d.daily.tasks.letter = true;
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
  const a = Store.d.activity[t] || (Store.d.activity[t] = { letters: 0, words: 0, games: 0, grammar: 0, books: 0, stars: 0 });
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

/* ---------------- 护眼休息提醒 ----------------
   家长中心的建议是"每天 15 分钟"：连续学习满 15 分钟温和提醒休息一次，
   满 30 分钟建议收工。只统计页面可见的时间（切到后台不计时），
   每档每天最多提醒一次。 */
function restTip(msg) {
  sfx.pop();
  document.body.insertAdjacentHTML('beforeend', `
    <div class="modal-mask" id="restMask" onclick="if(event.target===this)closeRestTip()">
      <div class="modal card" style="text-align:center;max-width:420px">
        <div style="font-size:60px">🌿</div>
        <h2 style="justify-content:center">休息一下吧！</h2>
        <p style="color:#5C6273;font-size:.95rem;line-height:1.9;margin:8px 0 16px">${msg}</p>
        <button class="btn mint big" style="width:100%" onclick="closeRestTip()">好的 ☀️</button>
      </div>
    </div>`);
}
function closeRestTip() { const m = document.getElementById('restMask'); if (m) m.remove(); }
function __studyTick() {
  if (document.visibilityState !== 'visible') return;
  const d = Store.d.daily;
  d.studySec = (d.studySec || 0) + 60;
  if (d.studySec >= 15 * 60 && d.studySec < 16 * 60 && !d.break15) {
    d.break15 = true; Store.save();
    restTip('已经连续学了 <b>15 分钟</b>啦！站起来看看窗外的远处，让眼睛休息 5 分钟，再回来继续 🌿');
    return;
  }
  if (d.studySec >= 30 * 60 && d.studySec < 31 * 60 && !d.break30) {
    d.break30 = true; Store.save();
    restTip('今天已经学了 <b>30 分钟</b>，进步够多啦！去玩一会儿，明天再来找啾啾吧 🐤');
    return;
  }
  Store.save();
}
setInterval(__studyTick, 60000);

/* ---------------- 星星与徽章 ---------------- */
function addStars(n) {
  Store.d.stars += n;
  const t = todayStr();
  const a = Store.d.activity[t] || (Store.d.activity[t] = { letters: 0, words: 0, games: 0, grammar: 0, books: 0, stars: 0 });
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
  if (Object.keys(d.books || {}).length >= BOOKS_TOTAL) awardBadge('reader6');
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

/* One-tap: mark all letters known so recommendations go straight to words */
function markAllLettersKnown() {
  LETTERS.forEach(l => { if (!Store.d.letters[l.L]) Store.d.letters[l.L] = { t: Date.now() }; });
  Store.d.lettersSkip = true;
  addStars(5); markActivity('letters'); completeDailyTask('letter'); Store.save(); checkBadges();
  sfx.win(); confetti();
  toast('OK! Now we start from words!');
}

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

/* ---------------- 语音核心：只用词典标准发音（真人录音 MP3） ----------------
   决策：浏览器内置合成语音（speechSynthesis）音色与词典音混杂、质量参差，
   已全部移除——全站只有一种声音：词典真人女声。
   网络不可用或接口失败时保持安静（绝不出现机器音），用户重试即可。 */
/* ================= 词典真人发音 引擎 v4 =================
   唯一声源保证：全局 epoch——每一次新的播放请求（点击/重试/链式下一词）
   都会让之前所有待播/在播音频作废，任何情况下最多只有一个声音出喇叭。
   系统性修复：
   1) 慢网络下"超时重试"与"迟到的加载"互相叠加导致的重复出声（乱糟糟的根源）：
      重试前彻底解除旧 Audio 的全部回调，迟到的数据永远不会再发声
   2) 用户点击时掐掉所有在途预热/排队音频——防止点击排在下载队列尾部被超时误杀
   3) 失败自动重试一次（换全新 Audio），重试仍失败才提示；双重超时计时器不再泄漏
   4) 超时：首次 10s、后续 7s（移动网络）；成功的音频由 Service Worker 缓存，二次播放零延迟 */
const DICT_AUDIO_URL = t => 'https://dict.youdao.com/dictvoice?type=1&audio=' + encodeURIComponent(t);
let __curAudio = null;
let __inflight = new Set();   // 所有在途 Audio（含预热），统一管理
let __firstPlayDone = false;
let __dictFailNotified = 0;

function stopAllSpeech() {
  __inflight.forEach(a => { try { a.onended = a.onerror = a.oncanplay = a.onplaying = null; a.pause(); } catch (e) {} });
  __inflight.clear();
  __curAudio = null;
}
/* 预热：只下载不播放；登记在途，用户一点击即被让路 */
function prewarmWord(text) {
  if (!text) return;
  try {
    const a = new Audio(DICT_AUDIO_URL(text));
    a.preload = 'auto';
    __inflight.add(a);
    a.oncanplay = () => { __inflight.delete(a); };
    a.onerror = () => { __inflight.delete(a); };
  } catch (e) {}
}
/* 核心播放：全新 Audio + 唯一声源保证（epoch）+ 重试一次 */
let __audioEpoch = 0;
function playDictAudio(text, rate, onEnd, onFail, isRetry) {
  const epoch = ++__audioEpoch; // 新请求让之前所有待播/在播音频作废
  rate = 1; // mobile compat: always normal speed
  const a = new Audio(DICT_AUDIO_URL(text));
  a.preload = 'auto';
  __curAudio = a;
  __inflight.add(a);
  let done = false, guard = null;
  const clearG = () => { if (guard) { clearTimeout(guard); guard = null; } };
  const disarm = () => { try { a.onended = a.onerror = a.oncanplay = a.onplaying = null; a.pause(); } catch (e) {} };
  const end = () => { if (!done) { done = true; clearG(); __inflight.delete(a); if (onEnd) onEnd(); } };
  const fail = () => {
    if (done) return;
    done = true; clearG(); disarm(); __inflight.delete(a); // 解除全部回调：迟到的加载绝不再出声
    if (!isRetry) { playDictAudio(text, rate, onEnd, onFail, true); return; } // 自动重试一次
    const now = Date.now();
    if (now - __dictFailNotified > 30000) { __dictFailNotified = now; toast('📶 发音加载失败，请检查网络后重试'); }
    if (onFail) onFail();
  };
  a.onended = end;
  a.onerror = fail;
  a.onplaying = () => { if (epoch === __audioEpoch) clearG(); }; // 真正出声后取消超时
  // mobile compat: no playbackRate (slow rate breaks some phone browsers)
  const go = () => {
    if (done || epoch !== __audioEpoch) { disarm(); return; } // 已被更新的一次点击取代：绝不出声
    try { a.currentTime = 0; } catch (e) {}
    clearG(); // 清掉还在等待的加载超时，避免播放中被误杀重播
    guard = setTimeout(fail, __firstPlayDone ? 7000 : 10000);
    const p = a.play();
    __firstPlayDone = true;
    if (p && p.catch) p.catch(() => { if (epoch === __audioEpoch) fail(); });
  };
  if (a.readyState >= 1) { stopAllSpeechExcept(a); go(); }
  else {
    a.oncanplay = () => { a.oncanplay = null; stopAllSpeechExcept(a); go(); };
    guard = setTimeout(fail, __firstPlayDone ? 7000 : 10000);
  }
}
/* 让路：暂停除 a 以外的所有在途音频（预热队列立刻腾出连接） */
function stopAllSpeechExcept(keep) {
  __inflight.forEach(x => { if (x !== keep) { try { x.onended = x.onerror = x.oncanplay = x.onplaying = null; x.pause(); } catch (e) {} __inflight.delete(x); } });
}

/* 统一朗读入口：只走词典真人发音。失败保持安静（绝不出现机器音）。 */
function speak(text, lang = 'en-US', rate = 0.85) {
  if (!Store.d.soundOn) return;
  const t = String(text).trim(); if (!t) return;
  if (lang.startsWith('zh')) return; // 词典不支持中文句：中文不朗读
  stopAllSpeech();
  playDictAudio(t, rate, null, null);
}

/* 链式朗读：读完一句自动读下一句；某段失败则整链停止（不切机器音） */
function speakChain(items) {
  if (!Store.d.soundOn) return;
  stopAllSpeech();
  let stopped = false;
  const next = i => {
    if (stopped || i >= items.length) return;
    const it = items[i];
    if (it.onStart) try { it.onStart(); } catch (e) {}
    playDictAudio(it.text, it.rate, () => next(i + 1), () => { stopped = true; });
  };
  next(0);
}

/* 拼读文本（仅用于屏幕显示提示，不再朗读——拟音串 TTS 读出来孩子听不懂） */
function phonicsText(word) {
  const letters = String(word).toLowerCase().split('').filter(c => /[a-z]/.test(c));
  if (!letters.length || letters.length > 12) return null;
  return letters.join('-');
}

/* 点单词：点一下读一遍，点几次读几次（不自动连读） */
function speakWord(word) {
  sfx.pop();
  speak(String(word).trim(), 'en-US', 1);
}

/* ---------------- 移动端声音解锁与预热 ----------------
   iOS/部分安卓：第一次出声必须在手指点击事件内触发。
   首次触碰时静音播放一小段词典音频，解锁 <audio> 通道并预热网络连接。 */
let __audioUnlockDone = false;
function unlockAudioChannels() {
  if (__audioUnlockDone) return;
  __audioUnlockDone = true;
  try {
    prewarmWord('hi');
    const a = new Audio(DICT_AUDIO_URL('hi'));
    a.volume = 0;
    const p = a.play();
    if (p && p.catch) p.catch(() => {});
    setTimeout(() => { try { a.pause(); } catch (e) {} }, 1500);
  } catch (e) {}
}
document.addEventListener('pointerdown', unlockAudioChannels, { capture: true });
document.addEventListener('keydown', unlockAudioChannels, { capture: true });

/* 语音环境检测（家长中心诊断用） */
function speechEnv() {
  return {
    engine: '词典标准发音（真人录音，单一音源）',
    wechat: /MicroMessenger/i.test(navigator.userAgent),
    online: navigator.onLine
  };
}
/* 微信内打开：词典发音通常可用，若仍无声提示改用系统浏览器 */
(function wechatTip() {
  if (!/MicroMessenger/i.test(navigator.userAgent)) return;
  document.body.insertAdjacentHTML('afterbegin', `
    <div class="wechat-tip" onclick="this.remove()">
      📱 本站使用<b>词典真人发音</b>，微信里一般能正常出声；若仍无声，请点右上角「···」→「在浏览器打开」
      <span style="float:right;cursor:pointer">✕</span>
    </div>`);
})();

/* ---------------- PWA：离线可用 + 装到主屏 ---------------- */
if ('serviceWorker' in navigator && location.protocol === 'https:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').then(reg => {
      // 发现新版本时立即激活，确保用户拿到最新代码
      if (reg.waiting) reg.waiting.postMessage('SKIP_WAITING');
      reg.addEventListener('updatefound', () => {
        const nw = reg.installing;
        if (nw) nw.addEventListener('statechange', () => { if (nw.state === 'installed' && navigator.serviceWorker.controller) nw.postMessage('SKIP_WAITING'); });
      });
    }).catch(() => {});
  });
}

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
  { id: 'books',   href: 'books.html',   emoji: '📚', label: '绘本馆' },
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
        <button class="chip" id="profileBtn" title="小伙伴档案（切换/新建/备份/改年级）">${Profiles.active().avatar} <b id="navProfile">${esc(Profiles.active().name)}</b></button>
        <button class="chip" id="soundBtn" title="声音开关">${Store.d.soundOn ? '🔊' : '🔇'}</button>
        <span class="chip gold" title="我的星星">⭐ <b id="navStars">${Store.d.stars}</b></span>
      </div>
    </header>`);
  $('#soundBtn').addEventListener('click', () => {
    Store.d.soundOn = !Store.d.soundOn; Store.save();
    $('#soundBtn').textContent = Store.d.soundOn ? '🔊' : '🔇';
    if (Store.d.soundOn) sfx.pop();
  });
  $('#profileBtn').addEventListener('click', openProfileModal);

  /* 底部栏（手机端 App 风格，桌面端由 CSS 隐藏）：5 个常用页面 + 「我的」，
     档案/星星/声音都收在底部，顶部完全让给内容 */
  const TABS = [
    { id: 'index',   href: 'index.html',   emoji: '🏠', label: '首页' },
    { id: 'letters', href: 'letters.html', emoji: '🏝️', label: '字母' },
    { id: 'words',   href: 'words.html',   emoji: '🏘️', label: '单词' },
    { id: 'books',   href: 'books.html',   emoji: '📚', label: '绘本' },
    { id: 'games',   href: 'games.html',   emoji: '🎡', label: '游戏' },
  ];
  document.body.insertAdjacentHTML('beforeend', `
    <nav class="bottom-nav" aria-label="底部导航">
      ${TABS.map(n => `<a class="bnav ${n.id === activeId ? 'on' : ''}" href="${n.href}"><span class="nav-emoji">${n.emoji}</span>${n.label}</a>`).join('')}
      <button class="bnav bnav-me" id="bnavProfile" title="小伙伴档案（切换/新建/备份/声音/改年级）">
        <span class="nav-emoji">${Profiles.active().avatar}</span><span class="bnav-stars">⭐<b id="navStarsBtm">${Store.d.stars}</b></span>
      </button>
    </nav>`);
  $('#bnavProfile').addEventListener('click', openProfileModal);
}

/* 手机端底栏的声音开关（桌面仍用顶栏 🔊 按钮） */
function toggleSoundQuick() {
  Store.d.soundOn = !Store.d.soundOn; Store.save();
  const sb = document.getElementById('soundBtn');
  if (sb) sb.textContent = Store.d.soundOn ? '🔊' : '🔇';
  if (Store.d.soundOn) sfx.pop();
  toast(Store.d.soundOn ? '🔊 声音已打开' : '🔇 声音已关闭');
}
function updateNavStats() {
  const s = $('#navStars'), pr = $('#navProfile'), pb = $('#profileBtn');
  const sb = $('#navStarsBtm');
  if (s) s.textContent = Store.d.stars;
  if (sb) sb.textContent = Store.d.stars;
  if (pr) pr.textContent = Profiles.active().name;
  if (pb) pb.innerHTML = Profiles.active().avatar + ' <b id="navProfile">' + esc(Profiles.active().name) + '</b>';
  const me = $('#bnavProfile');
  if (me) me.querySelector('.nav-emoji').textContent = Profiles.active().avatar;
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
        <button class="btn ghost" style="margin-top:12px;width:100%" onclick="toggleSoundQuick();this.textContent=Store.d.soundOn?'🔊 声音：开':'🔇 声音：关'">🔊 声音：${Store.d.soundOn ? '开' : '关'}</button>
        <details class="profile-tool">
          <summary>🔧 修改当前档案的年级</summary>
          <div class="theme-tabs" style="margin-top:10px">
            ${GRADES.map(g => `<button class="theme-tab ${g.id === p.grade ? 'on' : ''}" data-g="${g.id}" onclick="setGrade(this.dataset.g)"><span class="te">${g.emoji}</span>${g.name}</button>`).join('')}
          </div>
        </details>

<details class="profile-tool">
          <summary>➕ 新建一个档案</summary>
          <div style="margin-top:10px">
            <input id="newName" type="text" placeholder="小伙伴的名字" maxlength="10" style="width:100%;padding:10px 14px;border:3px solid var(--lemon);border-radius:14px;font-family:inherit;font-size:.95rem">
            <small style="display:block;color:#5C6273;margin-top:8px">⭐ 当前有 <b>${Store.d.stars}</b> 颗星星 · 带 🔒 的头像用星星解锁，永久有效</small>
            <div class="avatar-grid" style="margin-top:8px">
              ${AVATARS.map(a => avatarChipHtml(a, false)).join('')}
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
/* ---------- 头像商店：锁定头像用星星解锁（星星的消费出口） ---------- */
function avatarLocked(a) { const p = AVATAR_PRICES[a]; return !!p && !(Store.d.unlocked && Store.d.unlocked[a]); }
function avatarChipHtml(a, selected) {
  const locked = avatarLocked(a);
  return `<button class="avatar-chip ${selected ? 'on' : ''} ${locked ? 'locked' : ''}" data-a="${a}" ${locked ? `data-price="${AVATAR_PRICES[a]}"` : ''} onclick="avatarTap(this)">${a}${locked ? '<i class="lock-mark">🔒</i>' : ''}</button>`;
}
function avatarTap(btn) {
  if (!btn.dataset.price) { pickAvatar(btn); return; }
  const a = btn.dataset.a, price = parseInt(btn.dataset.price, 10);
  if (Store.d.stars < price) { sfx.wrong(); toast(`🎈 解锁 ${a} 需要 ${price} 颗星星，还差 ${price - Store.d.stars} 颗，继续加油！`); return; }
  if (!confirm(`用 ${price} 颗星星解锁头像 ${a} 吗？解锁后永久有效。`)) return;
  Store.d.stars -= price;
  Store.d.unlocked = Store.d.unlocked || {};
  Store.d.unlocked[a] = true;
  Store.save(); updateNavStats(); checkBadges();
  btn.classList.remove('locked'); btn.removeAttribute('data-price');
  const lk = btn.querySelector('.lock-mark'); if (lk) lk.remove();
  sfx.win(); confetti(); toast(`🎉 解锁成功！${a} 加入你的小伙伴啦`);
  pickAvatar(btn);
}
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
