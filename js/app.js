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
/* ================= 词典真人发音 引擎 v6（媒体元素直出 + SW 缓存） =================
   唯一声源保证：全局 epoch——每一次新的播放请求（点击/重试/链式下一词）
   都会让之前所有待播/在播音频作废，任何情况下最多只有一个声音出喇叭。

   ★ 为什么不再做音量归一化（v5 的教训，2026-10-25 线上失声事故）：
   有道不返回 Access-Control-Allow-Origin，浏览器只会给 opaque 响应——
   opaque 的 body 读不到（arrayBuffer 直接抛错），也加不了响应头。
   所以「SW 注入 CORS → 页面拿字节 → decodeAudioData 归一化」这条路
   在浏览器安全模型下根本走不通；v5 硬做，结果是每个发音请求都被 SW
   判成"坏音频"返回 502，全站静音。
   能做音量的只有媒体元素：volume 上限 1.0（只能压不能抬），
   稳定性靠缓存与预热，不靠增益。
   真要逐条归一化，唯一可行路线是把音频预处理成**同源静态文件**（另立项）。

   v7 链路（本地优先）：
   ① 词库里 1000 个词都有**同源离线音频** audio/<slug>.mp3?v=1 ——
      这批文件是离线烘焙好的：裁掉首尾静音、静态压限 + RMS 归一到 -12.5 dBFS，
      所以既不用 CORS、也不用在浏览器里算，音量还整齐（原生极差 5.3 dB → 0.2 dB）。
   ② 取不到本地文件（短语/生僻词/文件缺失）才算回有道在线合成。
   ③ SW 用**独立缓存** birdie-audio-v1 存音频：发版不清，6.6MB 只下一次。
   失败重试一次；仍失败给一次网络提示，绝不切机器音。 */
const DICT_AUDIO_URL = t => 'https://dict.youdao.com/dictvoice?type=1&audio=' + encodeURIComponent(t);

/* ===== 本地离线音频包 =====
   文件名规则必须与生成脚本（_gen_audio.py 的 slug）逐字一致：
   小写、非字母数字压成一个下划线、去首尾下划线。1000 个词无撞名。
   AUDIO_VER 与 SW 的 AUDIO_CACHE 一起改：重做音频时两个都 +1，
   否则 SW 会拿旧文件（URL 没变就等于没换）。 */
const AUDIO_VER = 1;
const audioSlug = t => String(t).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
const __LOCAL_AUDIO = (() => {
  const set = new Set();
  try {
    THEMES.forEach(t => t.words.forEach(w => { const k = audioSlug(w.w); if (k) set.add(k); }));
    /* 造词实验室的扩展词（js/build-data.js 只在游戏页加载，没加载时跳过） */
    if (typeof BUILD_LEX !== 'undefined') BUILD_LEX.forEach(w => { const k = audioSlug(w); if (k) set.add(k); });
  } catch (e) {}
  return set;
})();
const localAudioURL = t => {
  const k = audioSlug(t);
  return k && __LOCAL_AUDIO.has(k) ? `audio/${k}.mp3?v=${AUDIO_VER}` : '';
};
/* 音源优先级：有本地就用本地，本地失败自动换有道（绝不因此变哑）。
   短语（句子连读的两词一组）一般没有本地文件，直接走有道。 */
const __audioSources = t => {
  const l = localAudioURL(t);
  return l ? [l, DICT_AUDIO_URL(t)] : [DICT_AUDIO_URL(t)];
};
let __curAudio = null;
let __inflight = new Set();   // 所有在途 Audio（含预热），统一管理
let __firstPlayDone = false;
let __dictFailNotified = 0;
let __audioEpoch = 0;              // 唯一声源令牌：任何新请求令旧的全部作废
const __guards = new Set();        // 所有加载/播放超时计时器，stopAllSpeech 时统一拆

/* 预热：把音频提前拉进 SW 缓存（用户一点击零等待）。
   opaque 响应看不到状态码，能不能用交给播放时判断；这里只负责暖链路。 */
function prewarmWord(text, onFail) {
  if (!text) return;
  try {
    const a = new Audio(__audioSources(text)[0]);   // 有本地就预热本地，第二次点开零等待
    a.preload = 'auto';
    __inflight.add(a);
    a.oncanplay = () => { __inflight.delete(a); };
    a.onerror = () => { __inflight.delete(a); if (onFail) onFail(); };
  } catch (e) { if (onFail) onFail(); }
}
/* 播放入口：直接走媒体元素。epoch 在这里统一递增；
   timeoutMs 可选（连读链传短超时保持节奏）。 */
function playDictAudio(text, rate, onEnd, onFail, isRetry, timeoutMs, startIdx) {
  const epoch = ++__audioEpoch;
  const t = String(text).trim();
  if (!t) { if (onFail) onFail(); return; }
  __playMediaElement(t, rate, epoch, onEnd, onFail, isRetry, timeoutMs, startIdx);
}
/* 媒体元素兜底（v4 链路，原封不动）：全新 Audio + 唯一声源保证 + 重试一次。
   epoch 由调用方传入并负责递增——重试时也走同一令牌，不会和归一化路径抢令牌。 */
function __playMediaElement(text, rate, epoch, onEnd, onFail, isRetry, timeoutMs, srcIdx) {
  rate = 1; // mobile compat: always normal speed
  const srcs = __audioSources(text);
  const si = Math.min(srcIdx || 0, srcs.length - 1);
  const a = new Audio(srcs[si]);
  a.preload = 'auto';
  __curAudio = a;
  __inflight.add(a);
  let done = false, guard = null;
  /* 计时器统一登记：stopAllSpeech 时一次性拆干净。
     否则翻页/切题后，9 秒前的旧 guard 到点会把旧词又播一遍。 */
  const clearG = () => { if (guard) { clearTimeout(guard); __guards.delete(guard); guard = null; } };
  const setG = ms => { guard = setTimeout(fail, ms); __guards.add(guard); };
  const disarm = () => { try { a.onended = a.onerror = a.oncanplay = a.onplaying = null; a.pause(); } catch (e) {} };
  const end = () => { if (!done) { done = true; clearG(); __inflight.delete(a); if (onEnd) onEnd(); } };
  const fail = () => {
    if (done) return;
    done = true; clearG(); disarm(); __inflight.delete(a); // 解除全部回调：迟到的加载绝不再出声
    /* 已被更新的一次点击取代：绝不重试、绝不回头抢声源
       （重试会 ++epoch，把用户正在听的新词掐掉再播回旧词）。 */
    if (epoch !== __audioEpoch) return;
    /* 本地文件取不到（删除/损坏/部署不全）→ 立刻换下一个音源。
       这不算"失败重试"：孩子不该为一个仓库问题多等两秒。 */
    if (si + 1 < srcs.length) { __playMediaElement(text, rate, epoch, onEnd, onFail, isRetry, timeoutMs, si + 1); return; }
    /* 自动重试一次：从"最后试过的那个音源"再来，不回头再撞 404 的本地文件 */
    if (!isRetry) { playDictAudio(text, rate, onEnd, onFail, true, timeoutMs, si); return; }
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
    setG(timeoutMs || (__firstPlayDone ? 9000 : 12000));
    const p = a.play();
    if (p && p.catch) p.catch(() => { if (epoch === __audioEpoch) fail(); });
  };
  if (a.readyState >= 1) { stopAllSpeechExcept(a); go(); }
  else {
    a.oncanplay = () => { a.oncanplay = null; stopAllSpeechExcept(a); go(); };
    setG(timeoutMs || (__firstPlayDone ? 9000 : 12000));
  }
}
/* 让路：暂停除 a 以外的所有在途音频（预热队列立刻腾出连接） */
function stopAllSpeechExcept(keep) {
  __inflight.forEach(x => { if (x !== keep) { try { x.onended = x.onerror = x.oncanplay = x.onplaying = null; x.pause(); } catch (e) {} __inflight.delete(x); } });
}

/* 音标：ipa.js 只在单词页加载，别的页面没有这个全局变量 */
function ipaOf(w) {
  return (typeof IPA !== 'undefined' && IPA[w]) || '';
}

/* 词图：有合适图形的用 emoji，没有的用首字母色块。
   代词/介词/连词这类词根本没有形象，硬塞一个 emoji 是错的——
   it=🐱 会让孩子以为 it 就是"猫"。宁可给字母牌，也不给假图。 */
function wordIcon(w) {
  const e = w && w.e;
  if (e) return e;
  const ch = String((w && w.w) || '?').trim().charAt(0).toUpperCase();
  return `<span class="wtile" aria-hidden="true">${esc(ch)}</span>`;
}

/* 立刻闭嘴：所有在途音频解除回调并暂停（翻页/切题/点新词时用） */
function stopAllSpeech() {
  __audioEpoch++;                          // 作废所有迟到的加载/失败回调
  __guards.forEach(g => clearTimeout(g));  // 拆掉加载超时，否则 9 秒后会把旧词又播一遍
  __guards.clear();
  __inflight.forEach(a => { try { a.onended = a.onerror = a.oncanplay = a.onplaying = null; a.pause(); } catch (e) {} });
  __inflight.clear();
  __curAudio = null;
  /* 句子朗读的"读完了"回调也要作废：否则被打断的旧句子会在新页面上触发自动跳题 */
  if (typeof window.__cancelSpeak === 'function') window.__cancelSpeak();
}

/* 统一朗读入口：只走词典真人发音。失败保持安静（绝不出现机器音）。 */
/* 声音被关掉时，点发音按钮给一声轻提示——否则用户只会觉得「网站坏了」。
   toast 本身没有去重，连续点击会叠罗汉，这里自己节流 2.5 秒。 */
let __soundHintAt = 0;
function soundOffHint() {
  const now = Date.now();
  if (now - __soundHintAt < 2500) return;
  __soundHintAt = now;
  toast('🔇 声音关着呢，点右上角（或底部「我的」里）的喇叭 🔊 打开');
}

function speak(text, lang = 'en-US', rate = 0.85) {
  if (!Store.d.soundOn) { soundOffHint(); return; }
  const t = String(text).trim(); if (!t) return;
  if (lang.startsWith('zh')) return; // 词典不支持中文句：中文不朗读
  stopAllSpeech();
  playDictAudio(t, rate, null, null);
}

/* 链式朗读：读完一句自动读下一句；单段失败（已自动重试过）跳过继续，
   连续失败 3 次才整链停止——不因个别词失败打断整段朗读（绝不切机器音） */
function speakChain(items) {
  if (!Store.d.soundOn) { soundOffHint(); return; }
  stopAllSpeech();
  let stopped = false, fails = 0;
  const next = i => {
    if (stopped || i >= items.length) return;
    const it = items[i];
    if (it.onStart) try { it.onStart(); } catch (e) {}
    playDictAudio(it.text, it.rate,
      () => next(i + 1),
      () => { if (++fails >= 3) stopped = true; else next(i + 1); });
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
  /* v5：Web Audio 通道也要在手指事件内解锁——归一化播放走 AudioContext，
     iOS 上非手势内创建会一直 suspended，首次单词点击就没声 */
  try { ac(); } catch (e) {}
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
    engine: '词典真人发音（真人录音 MP3，浏览器缓存加速）',
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
    // 新版本接管后自动刷新一次：用户无需手动强刷即可看到最新版
    let __swRefreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (__swRefreshing) return;
      __swRefreshing = true;
      location.reload();
    });
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
/* ---------------- 答题推进器 Flow：全站唯一的「下一题」出口 ----------------

   以前「自动跳题」和「下一题按钮」是两套各自独立的逻辑：
   练一练答对 1.9 秒自己跳走（字还没看清），句子工厂必须手点（节奏又太慢）；
   更糟的是自动计时器不随换页取消 —— 孩子答对后点「返回」，
   一秒多之后会被自己拽回答题页。这是真实存在的 bug，不是理论风险。

   现在只有一种推进动作 next()，两个触发器：
     ① 孩子点「下一个」按钮 —— 永远都在，想走就走
     ② 纯游戏回合的自动计时 —— 只是按钮的超时兜底，不让孩子干等

   三条铁律（改这里之前先读完）：
     1) 幂等：一次答题只推进一次。连点、按钮与自动撞车，都不会跳两题。
     2) 可取消：换页/退出必须 Flow.reset()，旧计时器一律作废。
     3) 不抢时间：凡是有解析 / 单词 / 记忆法要读的题，autoMs 必须传 0。
        自动跳只允许出现在「答对后除了庆祝没有别的信息」的纯游戏回合。 */
const Flow = (() => {
  let seq = 0;                 // 题号令牌：reset 一次 +1，旧闭包全部失效
  let adv = null;              // 自动推进计时器
  const timers = new Set();    // 与本题同生命周期的普通计时器（朗读、音效）
  const clearAdv = () => { if (adv) { clearTimeout(adv); adv = null; } };
  return {
    /* 换题/换页：作废本题所有挂起动作 */
    reset() {
      seq++; clearAdv();
      timers.forEach(t => clearTimeout(t)); timers.clear();
    },
    /* 造一个一次性推进器。autoMs > 0 才会到点自动触发；返回的函数给按钮用 */
    make(next, autoMs) {
      clearAdv();
      const my = seq;
      let used = false;
      const fire = () => {
        if (used || my !== seq) return false;   // 已推进过 / 已换页 → 静默忽略
        used = true; clearAdv(); next(); return true;
      };
      /* 之后再挂自动推进：给"等这句话读完再走"的场景用（句子火车员） */
      fire.arm = ms => {
        if (used || my !== seq) return;
        clearAdv();
        adv = setTimeout(fire, ms);
      };
      if (autoMs > 0) adv = setTimeout(fire, autoMs);
      return fire;
    },
    /* 朗读、音效这类"只是效果"的延时：换页就哑掉，不会串到下一个页面 */
    after(ms, fn) {
      const my = seq;
      const t = setTimeout(() => { timers.delete(t); if (my === seq) fn(); }, ms);
      timers.add(t);
    },
    /* 只停自动推进（手动按钮仍可用） */
    stop: clearAdv,
  };
})();

const sfx = {
  pop()      { tone(520, 0, 0.08, 'triangle', 0.12); },
  correct()  { tone(523, 0, 0.12); tone(659, 0.09, 0.12); tone(784, 0.18, 0.22); },
  wrong()    { tone(220, 0, 0.18, 'square', 0.08); tone(174, 0.15, 0.25, 'square', 0.08); },
  star()     { tone(880, 0, 0.09, 'triangle', 0.14); tone(1175, 0.07, 0.14, 'triangle', 0.14); },
  win()      { [523, 587, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.11, 0.18, 'triangle', 0.16)); }
};

/* ---------------- 手机端「添加到主屏幕」引导 ----------------
   孩子几乎每天都要用：装到主屏幕后全屏打开、无地址栏，和 App 一样。
   只在手机浏览器里出现；第 2 次访问起展示；关掉后不再打扰。 */
function maybeShowInstallHint() {
  try {
    const ua = navigator.userAgent;
    const isMobile = /Android|iPhone|iPad|iPod/i.test(ua) || (/Mobile/i.test(ua) && window.innerWidth < 820);
    const standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    if (!isMobile || standalone) return;
    if (localStorage.getItem('birdie_install_hint') === 'off') return;
    const n = (+localStorage.getItem('birdie_visits') || 0) + 1;
    localStorage.setItem('birdie_visits', String(n));
    if (n < 2 || document.getElementById('installHint')) return;
    const isIOS = /iPhone|iPad|iPod/i.test(ua);
    const steps = isIOS
      ? '点 Safari 底部中间的「<b>分享</b>」按钮，往上滑，选「<b>添加到主屏幕</b>」'
      : '点浏览器右上角「<b>⋮ / ···</b>」菜单，选「<b>添加到主屏幕</b>」或「<b>安装应用</b>」';
    document.body.insertAdjacentHTML('beforeend', `
      <div class="install-hint" id="installHint">
        <div class="ih-emoji">🐣</div>
        <div class="ih-txt">
          <b>把小鸟英语乐园放到手机桌面</b>
          <span>像 App 一样全屏打开，孩子一点就开学：${steps}</span>
        </div>
        <button class="ih-close" onclick="dismissInstallHint()" title="知道了，不再提示">✕</button>
      </div>`);
  } catch (e) {}
}
function dismissInstallHint() {
  try { localStorage.setItem('birdie_install_hint', 'off'); } catch (e) {}
  const el = document.getElementById('installHint');
  if (el) { el.classList.add('ih-out'); setTimeout(() => el.remove(), 320); }
}

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

/* 结题后锁住选项：正确的保持绿底，其余变淡且不可点。
   以前不锁 —— 孩子答对后再点一下别的，解析会被"再想想"覆盖；
   点回正确项还会再计一次分、再挂一个跳题计时器，一下就跳两题。 */
function lockChoices(keep) {
  document.querySelectorAll('.opt').forEach(b => {
    b.classList.add('locked');
    if (b === keep) b.classList.add('good-keep');
    else b.classList.add('dim');
  });
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
