/* ============================================================
   小鸟英语乐园 · 共享运行时
   进度存储(localStorage) / 语音点读 / 音效 / 星星奖励 / 徽章 / 打卡
   ============================================================ */
'use strict';

/* 构建标识：家长中心底部会显示它。
   用户报"还是有问题"时，第一句要问的就是"你手上是哪一版" ——
   Service Worker 缓存 + 离线包分发，两个都会造成版本混用（已经踩过两次）。 */
const BUILD = '2026-11-11.1';

/* 游戏数量的唯一真相源：首页岛屿文案、SEO 元信息、games.html 的 GAMES 数组
   都跟它对账。增删游戏时改这里 + 各页 meta，并跑 _audit/check_facts.py。
   2026-11-09.4 下线游戏5（句子听力）后为 6 个；增删游戏必须同步改这里。 */
const GAME_COUNT = 7;

/* ===== 新版本提醒 =====
   ★ 为什么必须有：这是一个 PWA。页面一旦打开就一直留着，Service Worker 又把
     HTML/JS 缓存着，用户在旧页面里怎么点都看不到新代码 —— 于是「改了他说还是老样子」
     反复发生（本项目已经三次）。靠「请刷新一下」是治不好的，得让页面自己发现。
   做法：每 5 分钟 / 每次切回前台，拉一次 version.json（带唯一查询串，绕过 SW 缓存），
        和当前 BUILD 不一样就在底部浮一条「有新版本 · 点这里刷新」。
   ⚠️ 发版时**必须同时改 version.json 里的 build**，只改 BUILD 不会提示。 */
const UPDATE_CHECK_MS = 5 * 60 * 1000;
let __updChecked = 0;
let __updShown = false;
function __showUpdateBar(v) {
  if (__updShown) return;
  __updShown = true;
  try {
    const bar = document.createElement('div');
    bar.id = 'updateBar';
    bar.setAttribute('role', 'button');
    bar.setAttribute('tabindex', '0');
    /* 只占右下角一小块。原来 left/right 都钉住 = 横贯屏幕底部的全宽浮条，
       会把页面底部的「开始学习 / 下一题」按钮整排盖住，点一下就误触发刷新。 */
    bar.style.cssText = 'position:fixed;right:12px;bottom:12px;z-index:99999;max-width:min(320px,calc(100vw - 24px));' +
      'background:#FF8A3D;color:#fff;border-radius:14px;padding:10px 14px;' +
      'font:600 14px/1.3 system-ui,-apple-system,"Microsoft YaHei",sans-serif;' +
      'box-shadow:0 8px 24px rgba(255,110,20,.35);display:flex;align-items:center;gap:8px;cursor:pointer';
    bar.innerHTML = '<span style="font-size:1.2em">🔄</span><span style="flex:1">有新版本（' +
      String(v || '').replace(/[<>&"]/g, '') + '），点这里刷新</span><span>▶</span>';
    const go = () => {
      try {
        if (navigator.serviceWorker && navigator.serviceWorker.getRegistrations) {
          navigator.serviceWorker.getRegistrations().then(rs => rs.forEach(r => { try { r.update(); } catch (e) {} }));
        }
      } catch (e) {}
      setTimeout(() => location.reload(), 120);
    };
    bar.addEventListener('click', go);
    bar.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
    (document.body || document.documentElement).appendChild(bar);
  } catch (e) {}
}
function __checkUpdate(force) {
  const now = Date.now();
  if (!force && now - __updChecked < 60000) return;
  __updChecked = now;
  try {
    if (!window.fetch) return;
    fetch('version.json?t=' + now, { cache: 'no-store' })
      .then(r => (r && r.ok ? r.json() : null))
      .then(j => { if (j && j.build && j.build !== BUILD) __showUpdateBar(j.build); })
      .catch(() => {});
  } catch (e) {}
}
if (typeof document !== 'undefined') {
  setTimeout(() => __checkUpdate(true), 4000);
  setInterval(() => __checkUpdate(false), UPDATE_CHECK_MS);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) __checkUpdate(false); });
}

const $  = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* ---------------- 页面位置快照（刷新后不回退层级） ----------------
   ★ 2026-11-08 修「刚进页面、一加载就弹回上一级别」：
     getsmart / pep 的「哪一册 → 哪个单元 → 第几步」全是内存变量，页面一刷新就丢，
     init 又回到默认的选书页 / 课程表 —— 看起来就是被弹回上一级。
     这里只记「导航位置」，绝不记题目和答案（题目页不得出现答案）；
     sessionStorage 只作用于当前标签页，关掉即清，不污染长期进度。
     只有 navigation.type === 'reload' 才恢复：从首页正常点进来仍走默认入口。 */
window.__navSave = function (tag, data) {
  try { sessionStorage.setItem('birdie_nav_' + tag, JSON.stringify({ d: data, t: Date.now() })); } catch (e) {}
};
window.__navLoad = function (tag, maxAgeMs) {
  try {
    const o = JSON.parse(sessionStorage.getItem('birdie_nav_' + tag) || 'null');
    if (!o || (maxAgeMs && Date.now() - o.t > maxAgeMs)) return null;
    return o.d;
  } catch (e) { return null; }
};
window.__isReload = function () {
  try {
    const n = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
    if (n && n.type) return n.type === 'reload';
    return (performance.navigation || {}).type === 1;   // 老浏览器兜底
  } catch (e) { return false; }
};

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
    /* 确认框由调用方弹（askConfirm）：window.confirm 在手机 WebView 里常被屏蔽，
       屏蔽时返回 undefined = 直接当成"取消"，用户看到的是「删不掉」。 */
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
/* 词库总量：从 THEMES 现算，不写死。
   ★ 2026-11-09.15：colour / color 合并后词库从 1000 变 999，
     「千词小博士」原来是 if (w >= 1000) —— 门槛比词库总量还高，
     这枚徽章就永远拿不到（家长不会发现，孩子学到死也开不出来）。
     现在按实际总量判，以后加词减词都不会再坏。 */
let __totalWords = 0;
function totalWordCount() {
  if (!__totalWords) {
    let n = 0;
    if (typeof THEMES !== 'undefined') THEMES.forEach(t => { n += (t.words || []).length; });
    __totalWords = n;
  }
  return __totalWords;
}

function awardBadge(id) {
  if (Store.d.badges[id]) return;
  const b = BADGES.find(x => x.id === id); if (!b) return;
  Store.d.badges[id] = todayStr(); Store.save();
  setTimeout(() => { sfx.win(); toast(`${b.emoji} 获得徽章【${b.name}】！${b.desc}`); confetti(); }, 400);
}

function checkBadges() {
  const d = Store.d;
  const w = wordMasteredCount();
  const totalWords = totalWordCount();          // 0 = 词库还没加载，绝不能用 0 当门槛，否则一进站就发徽章
  if (letterCount() >= 10) awardBadge('letter10');
  if (letterCount() >= 26) awardBadge('letter26');
  if (w >= 20)  awardBadge('word20');
  if (w >= 100) awardBadge('word100');
  if (w >= 500) awardBadge('word500');
  if (w >= totalWords && totalWords > 0) awardBadge('word1000');   // 词库全掌握（总量现算，见 totalWordCount）
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

/* ---------------- 语音核心：只用站内自带音频（全部由本站合成） ----------------
   ★ 2026-11-08 v8：彻底切断第三方发音接口。
   旧版全靠某公开词典的 dictvoice 接口「查词典真人录音」：那是查词接口，
   不是语音合成，整句一律返 500；而且那是别人家的录音，站里还带着历史抓下来
   的 2000 多个 mp3 —— 既有服务条款问题，音色也杂（男女混搭、音量忽大忽小）。
   现在全站发音都是本站用开源引擎（Piper，MIT）与 en_US-libritts-high
   一次合成的同源静态文件：一个说话人贯穿 2874 个单词 / 拼读块 / 字母名
   与 503 句整句。模型权重 MIT，训练数据 LibriTTS (OpenSLR 60) 为
   CC BY 4.0，署名与许可全文见 THIRD-PARTY-NOTICES.txt。
     · 不跨域、不联网、断网照读
     · 不依赖任何第三方服务，谁家接口半死不活都影响不到这里
     · 音量天然统一（同一引擎、同一套参数出来）
   唯一兜底：包里没有的临时内容，用浏览器内置 speechSynthesis（本机系统语音，
   零网络、零第三方请求），且只在**单独朗读**时启用，句子接龙里绝不插机器音。 */
/* ================= 发音引擎 v8（媒体元素直出 + SW 缓存） =================
   唯一声源保证：全局 epoch——每一次新的播放请求（点击/重试/链式下一词）
   都会让之前所有待播/在播音频作废，任何情况下最多只有一个声音出喇叭。

   ★ 为什么不再做音量归一化（v5 的教训，2026-10-25 线上失声事故）：
   当年为了在浏览器里做增益，想让 SW 注入 CORS 头再读字节解码；
   但对方不返回 Access-Control-Allow-Origin，页面只能拿到 opaque 响应——
   body 读不到（arrayBuffer 直接抛错），也加不了响应头，这条路根本走不通，
   v5 硬做的结果是每个发音请求都被判成"坏音频"、全站静音。
   v8 之后不存在这个问题：音频是本站自己烘焙的**同源静态文件**，
   首尾静音已裁、码率与采样率统一，直接喂给媒体元素即可，不用浏览器再算一遍。

   v8 链路：
   ① 全站每个发音目标都有同源文件 audio/<slug>.mp3?v=2（单词/拼读块/字母名）
      或 audio/sentences/<slug>.mp3（整句），文件名规则见 audioSlug()。
   ② 拿不到本地文件时不再回退外网，改用浏览器内置 speechSynthesis 兜底。
   ③ SW 用**独立缓存**存音频：发版不清，听过一次之后永久零网络。 */

/* ===== 本地离线音频包 =====
   文件名规则必须与生成脚本（_tts/build_words.py 的 slug）逐字一致：
   小写、非字母数字压成一个下划线、去首尾下划线。
   ★ 2026-11-08：全部 2450 个词音频用同一声线重做（原 2244 个是历史抓来的
     词典录音，格式与音量都不统一），所以 AUDIO_VER 1 → 2 —— 老用户缓存里的
     旧文件按新 URL 自动失效。
   AUDIO_VER 与 SW 的 AUDIO_CACHE 一起改：重做音频时两个都 +1，
   否则 SW 会拿旧文件（URL 没变就等于没换）。 */
/* ★ 2026-11-09：V3 重烘（没换声线，仍是 en_US-ljspeech-medium 公有领域）。
   旧参数把 /p/ /t/ /k/ 清爆破音当静音裁掉了（pink 被听成 Kink），
   改 length_scale 1.0 / 裁静音 -70dB / 96kbps，AUDIO_VER 2 → 3。
   整句、词块、字母音都有独立版本号，本次一个都没动。 */
/* ★ 2026-11-09.7：全站换 C2 声线（Piper(MIT) + en_US-libritts-high，
   训练数据 LibriTTS/OpenSLR 60 = CC BY 4.0，须署名，见 THIRD-PARTY-NOTICES）。
   固定 speaker_id=381 + noise_scale=0 / noise_w=0，保证每次重烘一致。
   单词/整句/词块三类一起换，各自版本号 +1；字母音是母语者录音，不动。 */
/* ★ 2026-11-09.8：只修 pep.html 拼词复习的泄底，音频零改动，
   所以 AUDIO_VER / SENTENCE_VER / PHRASE_VER 都不动。 */
const AUDIO_VER = 4;
const audioSlug = t => String(t).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
/* ===== 例句逐词朗读的补充音频（2026-11-07）=====
   有道 dictvoice 是「词典真人录音查词」，不是语音合成：整句请求一律 500
   （120 字节的 JSON），浏览器等 12 秒超时 + 自动重试 12 秒才报失败，
   孩子看到的就是「点一下半天没声音」。改成把例句按词拆开、用本地真人
   音频接龙之后，例句里原本不在词库音频包里的 108 个词（the / an / be /
   books / didn't …）会漏音，所以这批文件补进了 audio/ 并登记 manifest。
   这里再内联一份清单：离线包走 file:// 时 fetch 不到 manifest，
   有了它照样全本地、断网也能读。 */
const AUDIO_EXTRA = ["ali","an","animals","answers","be","began","beijing","birds","books","break","by","cakes","came","can_t","cards","cats","chairs","cheaper","cheered","children_s","clears","climbed","counted","days","desks","did","didn_t","dogs","don_t","drinks","drives","dumplings","eiffel","en","enjoyed","example","fair","fifty_five","fishing","flowers","foods","foxes","friends","games","goes","going","grandparents","grows","helps","horses","hospitals","hurry","hurts","i_m","isn_t","it_s","kilometres","learned","leaves","let_s","lights","living","looks","lot","made","makes","mike","more","mustn_t","newspapers","officer","ones","pencils","photos","pictures","playing","plays","pocket","potatoes","pyramids","questions","roots","runny","runs","schoolbags","shouldn_t","smoking","staying","stories","students","sweeps","telling","the","things","tips","turn","twenty_three","us","vegetables","visits","waited","walking","who_s","workbooks","works","would","years","zongzi","weak_a","weak_an"];
const __LOCAL_AUDIO = (() => {
  const set = new Set(AUDIO_EXTRA);
  try {
    THEMES.forEach(t => t.words.forEach(w => { const k = audioSlug(w.w); if (k) set.add(k); }));
    /* 造词实验室的扩展词（js/build-data.js 只在游戏页加载，没加载时跳过） */
    if (typeof BUILD_LEX !== 'undefined') BUILD_LEX.forEach(w => { const k = audioSlug(w); if (k) set.add(k); });
  } catch (e) {}
  return set;
})();
/* ===== Get Smart 词库的音频补登记 =====
   ★ 2026-11-01 修的 bug：audio/ 里有 1896 个 mp3，其中 644 个属于
     Get Smart 独有的词（insect / stand up / bicycle / crocodile …），
     但 __LOCAL_AUDIO 只按「词库全部单词 + 造词实验室」建，
     而 getsmart-data.js 比 app.js **晚加载**（脚本顺序），
     于是这 644 个词一律查不到本地文件 → 全部回退有道：
       · 在线要多绕一圈外网（getsmart 的 prewarmBatch 一次发几百个请求）
       · 断网直接没声音 —— 6 册 237 课的单词点读全哑
     文件明明已经在包里，只是没人登记。这里改成「第一次查不到就补登记一次」，
     不依赖脚本加载顺序，任何页面都能受益。 */
let __gsAudioRegistered = false;
function __registerGSAudio() {
  if (__gsAudioRegistered) return;
  if (typeof GS_LEVELS === 'undefined' || !GS_LEVELS) return;   // 该页没加载课程数据
  __gsAudioRegistered = true;
  try {
    GS_LEVELS.forEach(lv => (lv.units || []).forEach(u => {
      (u.words || []).forEach(w => { const k = audioSlug(w.w); if (k) __LOCAL_AUDIO.add(k); });
    }));
  } catch (e) {}
}
/* 全量音频清单：js/audio-list.js 登记包内全部音频 slug（2874 条）。
   PEP 等晚加载数据源的词从此直接命中本地文件，不会被推去兜底语音。
   ★ 2026-11-08 从「fetch audio/manifest.json」改成「defer 脚本」：
     旧做法每翻一页都要多一次网络往返（SW 对它走网络优先），而且 file:// 下
     fetch 会被拦掉 → 离线包里的课程词查不到本地文件。脚本标签两处都正常。
     清单没到时（首访极短窗口）不再一刀切判定"没有"——见 localAudioURL。 */
let __audioListReady = false;
function __registerAudioList() {
  if (__audioListReady) return;
  if (!window.__AUDIO_LIST) return;
  __audioListReady = true;
  try { window.__AUDIO_LIST.forEach(k => __LOCAL_AUDIO.add(k)); } catch (e) {}
}
window.__registerAudioList = __registerAudioList;
__registerAudioList();          /* audio-list.js 比 app.js 先执行时直接生效 */
/* ===== 整句自有音频（2026-11-08）=====
   以前句子靠「单词 mp3 逐词接龙」或「两词一组绕有道」：前者男女声混搭、
   没有连读和句末语调，后者断网无声。现在把全站 503 句固定例句用同一个
   说话人一次合成整句，落在 audio/sentences/，零网络、离线可读。
   合规：合成引擎 Piper(MIT)，语音模型 en_US-libritts-high(权重 MIT)，
   训练数据 LibriTTS/OpenSLR 60 为 CC BY 4.0（已按许可署名，见 NOTICES）；
   输出音频可自由分发；不再新增任何抓取来的词典音频。
   ★ SENTENCE_VER 独立于 AUDIO_VER：重做整句音频只升它。
     若动 AUDIO_VER，已缓存的单词 mp3 会全部作废（要重下十来 MB）。
   ★ 必须放独立目录：有 slug 与单词音频同名（clap_your_hands），
     混进 audio/ 会互相覆盖。 */
const SENTENCE_VER = 2;
const SENTENCE_AUDIO = new Set([
  "a_cheetah_can_run_fast","a_firefighter_can_put_out_fires","a_month_is_about_one_trip_of_the_moon","a_parrot_can_talk","a_penguin_can_t_fly_but_it_can_swim","adults_pay_the_bill",
  "an_apple_and_an_egg_please","an_elephant_can_carry_things","an_insect_is_a_tiny_animal","are_there_any_peppers_no_there_aren_t_any_peppers","are_they_making_a_cake_no_they_aren_t","are_they_playing_hide_and_seek_yes_they_are",
  "are_you_happy_yes_i_am","be_quiet","bees_make_honey_from_nectar","before_i_was_quiet_but_now_i_am_active","beijing_has_a_long_history","bring_a_heavy_raincoat_with_you",
  "bring_an_umbrella_it_may_rain","brush_your_teeth_twice_a_day","can_i_try_them_on","can_you_feed_the_cow_yes_i_can","can_you_help_them_yes_i_can","can_you_swim_yes_i_can",
  "cars_pollute_the_air","chopsticks_are_a_tradition_in_china","clap_your_hands","climbing_mountains_is_tiring","could_you_tell_me_about_your_hometown","dad_is_busy_today",
  "did_you_wake_up_at_ten_oclock_yes_i_did","did_you_watch_tv_yes_i_did","do_not_drop_broken_glass","do_you_have_a_car_yes_i_do","do_you_have_any_cereal_there_isn_t_any_juice","do_you_have_any_cheaper_ones",
  "do_you_have_twenty_shells_yes_i_do","do_you_like_carrots_yes_i_do","do_you_work_in_a_restaurant_yes_i_do","does_he_have_brown_eyes_yes_he_does","does_she_take_the_bus_to_school_yes_she_does","don_t_be_late_for_class",
  "don_t_be_loud_in_the_study","don_t_be_sad","don_t_be_worried_it_is_easy","don_t_cut_down_the_trees","don_t_run_in_the_bedroom","don_t_stay_up_late_playing_video_games",
  "don_t_take_pictures","eat_less_sugar_and_more_vegetables","elephants_are_bigger_than_rhinos","energy_will_run_out_one_day","even_the_koala_is_special_there","everyone_can_enter_the_competition",
  "everyone_can_recycle","everyone_helps_in_the_community","february_is_before_march","finally_we_get_to_the_station","first_wash_your_hands_then_eat","from_farm_to_table",
  "get_enough_sleep_every_night","give_him_the_gift_please","go_across_the_bridge","grandpa_and_grandma_are_old","happy_birthday_lisa","has_she_got_curly_hair_yes_she_has",
  "have_you_ever_tried_rock_climbing","he_always_plays_football","he_asked_me_to_follow_him","he_can_t_paint_but_he_can_do_karate","he_didn_t_swim","he_fell_off_his_bike_and_hurt_his_foot",
  "he_goes_skiing_in_the_winter","he_has_a_long_tail","he_has_got_a_brother","he_is_also_my_best_friend","he_is_also_my_classmate","he_is_going_to_write_an_article",
  "he_is_my_best_friend","he_is_strict_but_friendly","he_s_riding_a_bike","he_s_sad","he_sometimes_plays_chess","he_sprained_his_ankle",
  "he_trains_hard","he_usually_answers_questions_in_class","he_usually_visits_his_grandparents_on_sunday","he_was_exploring_the_island","he_was_the_star_of_the_race","hello_i_m_mike",
  "hi_i_m_april","his_hair_is_short","his_name_was_tutankhamun","how_are_we_going_to_get_there_by_bus","how_are_you_i_am_fine_thank_you","how_can_i_get_to_the_station",
  "how_did_he_die_a_snake_bit_him","how_did_you_go_to_turpan","how_long_does_it_take_twenty_minutes","how_many_cakes_five","how_many_crayons_thirty_crayons","how_many_dolls_two_dolls",
  "how_many_frogs_are_there_there_are_twenty_frogs","how_many_horses_are_there_on_the_farm","how_many_pencils_twenty","how_many_pencils_twenty_pencils","how_many_pencils_two","how_much_is_it_twenty_yuan",
  "how_much_is_it_two_dollars_and_fifty_cents","how_much_is_this_jacket","how_much_money_is_in_the_jar","how_much_water_do_you_drink_every_day","how_often_do_you_have_gym_twice_a_week","how_old_are_you_i_m_six",
  "how_tall_is_the_dinosaur","hurry_up_or_we_are_late_for_class","i_always_skate_before_dinner","i_always_walk_to_school","i_am_from_china","i_am_going_to_go_camping_this_summer",
  "i_am_hungry_let_s_have_dumplings","i_am_six_years_old","i_am_taller_than_my_brother","i_am_thirteen","i_am_your_friend","i_borrow_books_from_the_library",
  "i_can_count_to_ten","i_can_give_them_sun","i_can_see_some_birds_at_sea","i_can_see_with_my_eyes","i_can_smell_with_my_nose","i_can_water_the_flowers",
  "i_climbed_the_mountain_last_summer","i_cook_and_clean_the_room","i_could_count_when_i_was_four","i_didn_t_take_the_train_to_the_airport","i_don_t_have_a_kite","i_don_t_like_bananas",
  "i_don_t_like_meat","i_drink_a_little_tea_and_eat_a_few_dumplings","i_feed_the_cow_every_morning","i_feel_better_and_stronger_now","i_feel_better_today_thank_you","i_feel_safe_in_the_living_room",
  "i_fixed_the_broken_lamp_before","i_get_up_at_six_o_clock","i_go_home_at_five","i_had_a_cold_and_slept_all_day","i_have_a_big_family","i_have_a_fever_and_a_runny_nose",
  "i_have_milk_and_bread_for_breakfast","i_have_never_won_a_contest","i_have_ten_books","i_have_to_rake_leaves","i_have_twenty_three_books","i_have_two_big_feet",
  "i_help_mum_cook_dinner","i_learned_to_skate_two_years_ago","i_like_apples","i_like_cats_what_about_you","i_like_dogs_and_cats","i_like_friday_because_we_play_ping_pong",
  "i_like_noodles","i_like_sandwiches","i_like_skating","i_look_after_my_sister","i_love_playing_the_violin","i_m_good_at_basketball",
  "i_m_wearing_a_blue_coat","i_m_wearing_a_skirt","i_often_play_chess_with_him","i_pay_with_my_pocket_money","i_play_the_piano_and_he_plays_chess","i_read_a_magazine_yesterday_afternoon",
  "i_save_half_of_my_pocket_money","i_save_up_for_a_new_microscope","i_save_up_for_a_ticket_to_the_show","i_saw_the_eiffel_tower_and_took_pictures","i_see_a_black_and_white_bird","i_see_a_yellow_duck",
  "i_see_three_foxes","i_see_two_mice_and_three_potatoes","i_set_the_table_and_she_clears_it","i_stayed_at_home_and_watched_tv_last_weekend","i_suggest_going_there_early","i_take_photos_and_tell_stories",
  "i_thought_it_was_a_dream_then_i_woke_up","i_visit_my_grandparents_on_sunday","i_walk_to_school_with_my_friend","i_want_a_box_of_milk","i_want_a_pair_of_shoes","i_want_to_go_to_bed",
  "i_want_to_save_money_to_buy_a_globe","i_want_to_see_beijing_opera_one_day","i_was_in_paris_last_year","i_wear_a_sweater_in_winter","i_wish_to_see_the_pyramids_one_day","ice_cream_is_made_from_milk",
  "if_we_plant_trees_the_air_will_be_cleaner","if_you_have_the_flu_stay_at_home","in_my_spare_time_i_collect_comic_books","is_he_your_cousin_yes_he_is","is_it_a_crocodile_yes_it_is","is_it_in_the_box_no_it_isn_t",
  "is_she_doing_gymnastics_yes_she_is","is_she_wearing_glasses_yes_she_is","is_that_your_mother_yes_it_is","is_there_any_cheese_yes_there_is","is_this_a_computer_yes_it_is","is_this_a_pencil_yes_it_is",
  "is_this_pen_yours_yes_it_is_mine","is_this_your_father_yes_it_is","is_this_your_sister_yes_it_is","it_has_a_big_body_and_a_long_tail","it_is_a_blue_bag","it_is_cold_i_have_a_cold",
  "it_is_cold_today","it_is_fifty_meters_long","it_is_not_a_dog_it_is_a_cat","it_is_rainy_in_sydney","it_is_seven_o_clock","it_is_still_here",
  "it_is_windy_today","it_may_be_a_cold_let_s_call_the_doctor","it_s_good_for_you","it_s_nine_o_clock","it_will_be_sunny_tomorrow","its_head_was_as_big_as_a_small_car",
  "its_tail_is_long","june_is_after_may","keep_still_please","last_weekend_i_cleaned_my_room","listen_and_share","look_at_this_flower",
  "may_i_borrow_your_pen","may_i_have_another_glass_of_water","maybe_they_will_raise_money_for_charity","mike_and_i_are_good_friends","millions_of_insects_live_in_the_rainforest","mum_is_tired_after_the_chores",
  "my_birthday_is_in_may","my_birthday_is_on_may_the_first","my_brother_is_one_year_old","my_favourite_place_is_the_library","my_favourite_subject_is_science","my_foot_hurts_when_i_walk",
  "my_hometown_is_by_the_sea","my_mom_works_in_a_big_office","my_robot_is_clever","my_sister_is_helpful_at_home","never_cheat_in_a_game","nice_to_meet_you_nice_to_meet_you_too",
  "no_smoking_in_the_library","noodles_come_from_china","nothing_is_faster_than_the_cheetah","now_the_police_officer_is_telling_a_story","pass_me_the_chopsticks_please","people_used_to_travel_by_streetcar",
  "plants_need_sunlight_and_water","please_hand_out_the_workbooks","please_stand_in_line_and_wait","please_wait_inside_the_room","prehistoric_humans_used_spears","press_the_button_to_download",
  "put_on_your_life_jacket","put_the_cap_on_the_box","red_and_yellow_make_orange","room_twelve_please","she_clears_the_table_herself","she_dances_softly",
  "she_has_big_eyes_and_small_ears","she_has_curly_hair","she_has_straight_hair","she_has_to_go_shopping","she_has_to_look_after_her_little_brother","she_is_a_dancer",
  "she_is_a_famous_artist","she_is_a_lovely_player","she_is_a_talented_musician","she_is_an_actress_who_is_well_known","she_is_an_office_worker","she_is_from_australia",
  "she_is_from_canada","she_is_hard_working_and_clever","she_is_kind_and_quiet","she_is_my_teacher","she_is_very_nice","she_said_she_was_dizzy",
  "she_shouldn_t_run_on_the_stairs","she_sweeps_the_floor_every_day","she_takes_part_in_triathlons","she_wears_a_watch_on_her_neck","sit_beside_me_and_enjoy_the_sunshine","solar_panels_make_clean_energy",
  "stand_up_sit_down","surfing_is_exciting","the_astronaut_is_my_hero","the_astronaut_looks_at_mars_through_a_telescope","the_ball_is_under_the_box","the_blue_sweater_is_mine",
  "the_boy_scout_learned_first_aid","the_bridge_is_fifty_five_kilometres_long","the_building_which_he_designed_is_famous","the_cake_is_yummy_the_salad_is_healthy","the_camel_has_a_hump","the_capital_existed_hundreds_of_years_ago",
  "the_captain_sailed_the_ship","the_cartoon_is_fantastic","the_chicken_is_on_the_farm_we_eat_chicken","the_chopsticks_are_on_the_table","the_cinema_is_between_the_park_and_the_station","the_cleaner_makes_the_bed",
  "the_coach_told_him_to_rest","the_dress_is_on_the_bed","the_earth_goes_around_the_sun","the_earth_looks_like_a_blue_marble","the_elephant_is_heavier_than_the_horse","the_ferris_wheel_is_huge",
  "the_giraffe_is_tall","the_island_has_its_own_beach","the_leaves_fall_in_autumn","the_machine_runs_on_solar_power","the_magician_can_do_tricks","the_monkey_has_a_long_tail",
  "the_mountain_is_famous_but_dangerous","the_mountain_is_high_and_the_forest_is_big","the_news_is_exciting_we_are_excited","the_party_is_in_june_on_children_s_day","the_planets_go_around_the_sun","the_polar_bear_lives_at_the_north_pole",
  "the_race_began_at_nine_yesterday","the_ring_is_made_of_silver","the_rover_drives_into_the_red_soil","the_scientist_and_the_artist_live_in_our_city","the_sculpture_is_made_of_steel","the_seed_grows_a_stem_and_roots",
  "the_shadow_is_much_longer_in_the_evening","the_star_is_in_front_of_the_team","the_station_is_far_from_here","the_station_is_next_to_the_cinema","the_taikonaut_works_in_the_space_station","the_talent_show_is_on_stage",
  "the_teacher_told_us_not_to_panic","the_teddy_bear_is_under_the_bed","the_wax_melted_in_the_sun","the_weather_will_change_quickly","the_world_has_different_foods","the_writer_was_the_winner_of_the_book_fair",
  "their_kite_is_red_and_yellow","there_are_a_lot_of_people_in_the_community","there_are_fifteen_desks_and_forty_chairs","there_are_ten_sheep_on_the_farm","there_are_three_hundred_students","there_are_twenty_students",
  "there_are_two_hospitals_near_the_shop","there_is_a_library_in_my_community","there_is_a_park_in_my_town","there_is_a_river_near_the_hotel","there_is_one_big_room","there_is_someone_at_the_door",
  "there_is_something_on_the_table","there_s_a_toy_store","there_s_some_milk","there_used_to_be_a_lake_here","there_was_a_small_school_three_years_ago","there_was_a_theater_near_my_home",
  "these_are_my_books","these_scissors_are_used_for_cutting","they_are_between_the_lamp_and_the_computer","they_are_cute_animals","they_travelled_by_hot_air_balloon","things_are_different_now_can_you_see_the_difference",
  "this_card_is_for_you","this_is_between_the_lamp_and_the_computer","this_is_my_grandfather","this_is_my_mother","this_is_the_easiest_race_of_all","those_sunglasses_are_beautiful",
  "those_trousers_are_large","throw_trash_in_the_trash_can","tigers_are_stronger_than_lions","touch_your_nose","turn_left_at_the_traffic_lights","turn_off_the_fan_please",
  "turn_off_the_faucet_please","turn_off_the_light_please","two_hundred_books_are_on_the_list","unplug_the_air_conditioner_before_you_leave","vegetables_are_healthy_food","walking_is_good_for_everyday_health",
  "walking_is_good_for_your_health","was_the_movie_good_yes_it_was","wash_your_hands_before_dinner","wash_your_hands_with_soap","we_are_both_excited_about_the_project","we_are_going_to_explore_the_old_palace",
  "we_can_t_fly_a_kite_in_the_rain","we_can_water_the_grass","we_cheered_and_counted_down_together","we_cheered_for_the_winner_of_the_race","we_could_see_the_beach_from_the_hill","we_eat_zongzi_at_the_dragon_boat_festival",
  "we_enjoyed_staying_at_the_hotel","we_find_good_tips_on_the_internet","we_get_information_on_the_internet","we_get_together_in_winter","we_go_by_plane_but_go_to_the_museum_on_foot","we_go_to_the_island_by_ship",
  "we_have_a_science_lesson_on_monday","we_have_lunch_at_school","we_learn_in_class","we_may_see_seals_on_the_shore","we_must_follow_the_family_rules","we_need_some_eggs_some_milk_and_some_cheese",
  "we_packed_our_bags","we_plan_to_try_the_local_hotpot","we_plan_to_visit_beijing","we_reduce_reuse_and_recycle","we_sell_goods_for_example_drinks_and_schoolbags","we_should_save_energy_at_home",
  "we_should_save_water_and_save_money","we_waited_till_the_bus_came","we_walk_in_the_park","we_went_fishing_last_sunday","we_went_to_the_village_three_days_ago","what_are_these_they_re_erasers",
  "what_are_these_they_re_pencils","what_are_you_doing_i_m_playing_the_guitar","what_are_you_going_to_dress_up_as_i_m_going_to_dress_up_as_a_ghost","what_color_is_it_blue","what_colour_is_it_it_is_blue","what_day_is_it_it_s_monday",
  "what_did_they_sing_at_the_gala","what_did_you_do_on_the_weekend_i_went_to_the_forest","what_do_you_do_i_m_a_dentist","what_do_you_have_for_lunch_i_have_rice","what_is_he_doing_he_s_washing_the_dishes","what_is_it_it_is_a_panda",
  "what_is_on_at_the_theater_tonight","what_is_the_matter_i_feel_afraid","what_is_this_it_is_a_green_book","what_is_your_name","what_s_her_name_her_name_is_anna","what_s_that_it_s_my_sister",
  "what_s_the_matter_i_have_a_headache","what_s_the_weather_like_it_s_sunny","what_s_this_it_s_a_pencil","what_s_your_favorite_food","what_s_your_favorite_season_my_favorite_season_is_spring","what_s_your_favorite_subject",
  "what_s_your_name_my_name_s_john","what_time_do_you_get_up_i_get_up_at_seven_o_clock","what_time_does_the_movie_start","what_time_is_it_it_is_seven","what_time_is_it_it_s_a_quarter_to_three","what_time_is_it_it_s_three_thirty",
  "what_would_you_like_to_drink_i_d_like_some_water_please","when_do_we_hand_out_the_newspapers","when_s_your_birthday_it_s_in_march","when_s_your_birthday_it_s_on_january_fifth","where_are_the_socks_they_re_on_the_table","where_are_the_tigers_they_are_in_the_trees",
  "where_are_the_toys_they_re_in_front_of_the_closet","where_are_you_from_i_m_from_mexico_i_m_mexican","where_did_you_go_last_sunday","where_is_the_ball_it_is_under_the_box","where_is_the_doll_it_s_in_the_closet","where_is_the_hospital_it_s_across_from_the_supermarket",
  "where_s_the_ball_it_s_in_the_closet","where_s_the_cat_it_s_behind_the_door","where_were_you_yesterday_i_was_at_the_mall","which_is_the_hottest_planet_venus_is_the_hottest_planet","which_season_do_you_like_best","while_i_was_digging_i_heard_a_noise",
  "who_s_this_it_s_my_grandma","who_s_this_this_is_my_grandma","whose_coat_is_it_it_s_mine","whose_coat_is_this_it_s_mine","whose_jacket_is_this_it_s_mine","whose_shirt_is_this_it_s_pat_s",
  "why_because_they_help_us","why_do_you_like_giraffes_because_they_re_tall_and_pretty","why_don_t_we_ride_the_roller_coaster","would_you_like_a_cup_of_tea","would_you_like_some_ice_cream","would_you_like_to_visit_the_planetarium_i_would_love_to",
  "yesterday_we_made_cards_for_the_writer","you_are_older_than_me_but_i_am_taller","you_have_to_wear_a_space_suit","you_must_return_the_book_on_time","you_mustn_t_shout_in_the_library","you_should_exercise_every_day",
  "you_should_not_eat_too_much_junk_food","you_should_shake_hands_when_you_meet","you_should_take_some_medicine","you_shouldn_t_stay_up_late","your_wish_will_come_true",
  /* 句子工厂的固定短句：原来只能逐词蹦单词，现在有整句音频一次读完 */
  "i_run","birds_fly","we_sing","we_drink_milk","i_am_a_girl","i_am_a_boy"
]);
const sentenceAudioURL = t => {
  const k = audioSlug(t);
  return k && SENTENCE_AUDIO.has(k)
    ? `audio/sentences/${k}.mp3?v=${SENTENCE_VER}` : '';
};

/* ===== 动态句子的「连读词块」（2026-11-09）=====
   为什么需要：程序临时拼出来的句子（句子火车员 / 句子工厂）
   没有整句 mp3，只能逐词接龙。而单独合成冠词 "a" 时 Piper 会念成**字母名**
   /eɪ/（语音识别听成 "Hey"），于是 "This is a cat." 变成 "This is A cat."
   —— 这就是家长说的「句子读得不对」。把句子里固定不变的前半段
   （This is a / I have a / I don't like …）一次合成，冠词在语流里自然弱读，
   动态句子也就有了连读。词块只有 44 条、389KB，不用给上千种组合各存一整句。
   ★ PHRASE_VER 独立于 AUDIO_VER / SENTENCE_VER，重做词块只升它。 */
const PHRASE_VER = 2;
const PHRASE_AUDIO = new Set([
  "this_is_a","this_is_an","this_is_my","this_is","i_have_a","i_have_an",
  "i_have_two","i_have","i_eat","i_drink","i_see_a","i_see_an","i_see",
  "i_like","i_can","i_am","i_don_t_like","i_don_t","we_like","we_drink",
  "we_have","he_likes","she_is","she_can","it_is_a","it_is","there_is_a",
  "there_are","is_this_a","do_you","can_you","what_is","where_is","how_many",
  "my_name_is","every_day","i_run","birds_fly","we_sing","we_drink_milk",
  "i_am_a_girl","i_am_a_boy","a_boy","a_girl"
]);
const phraseAudioURL = t => {
  const k = audioSlug(t);
  return k && PHRASE_AUDIO.has(k)
    ? `audio/phrases/${k}.mp3?v=${PHRASE_VER}` : '';
};

const localAudioURL = t => {
  const k = audioSlug(t);
  if (!k) return '';
  /* 整句自有音频优先：命中就一次播完，不再逐词拼接。
     speak() 里那句「含空格就走接龙」的判断正是看这里有没有命中。 */
  const whole = sentenceAudioURL(t);
  if (whole) return whole;
  /* 连读词块：句子接龙里命中就一次播完这一整块（含弱读冠词） */
  const phrase = phraseAudioURL(t);
  if (phrase) return phrase;
  if (!__LOCAL_AUDIO.has(k)) __registerGSAudio();
  if (__LOCAL_AUDIO.has(k)) return `audio/${k}.mp3?v=${AUDIO_VER}`;
  /* 清单还没落地（首访的几十毫秒窗口）：单个词先按「本地应该有」试一次。
     真有文件的当场响，真没有的 404 之后才走兜底语音，反正比现在更慢的情况不存在。
     带空格的短语不做这个乐观判断——那会把整句朗读引到 404 上，
     该走逐词接龙的还是走逐词接龙。 */
  if (!__audioListReady && !/\s/.test(String(t))) return `audio/${k}.mp3?v=${AUDIO_VER}`;
  return '';
};
/* 音源：只认站内自有 mp3，一个外部 URL 都不产生。
   以前这里第二顺位是有道，用来兜「本地没有的短语/生僻词」；v8 之后
   全站发音目标都在包里（2452 个），兜底改成本机 speechSynthesis，
   所以这里返回空数组 = 调用方知道「这段包内没有」。
   bust 参数保留兼容（本地文件不可变，不需要靠参数绕缓存）。 */
const __audioSources = t => {
  const l = localAudioURL(t);
  return l ? [l] : [];
};
let __curAudio = null;
let __inflight = new Set();   // 所有在途 Audio（含预热），统一管理
let __firstPlayDone = false;
let __dictFailNotified = 0;
let __audioEpoch = 0;              // 唯一声源令牌：任何新请求令旧的全部作废
const __guards = new Set();        // 所有加载/播放超时计时器，stopAllSpeech 时统一拆

/* ================= 声音预取调度器（2026-11-08）=================
   目标：玩当前这一页时，把「接下来几页」的声音提前拉进离线缓存，点一下就出声。
   铁律（前几轮白屏事故的教训）：预取绝不能和首屏、更不能和用户点击抢带宽。
     ① 用 fetch({priority:'low'}) 只下字节让 SW 入库，不 new Audio() 解码占内存；
        媒体元素请求在浏览器里是高优先级，几十个一起灌会拖死首屏。
     ② 全局最多 2 个在途、单批最多 24 条（约 3~5 页、300KB 上下）。
     ③ 页面 load 之后再宽限 2.2 秒，且只在 requestIdleCallback 空闲时跑；
        避开 SW activate 的 1.2 秒后台补齐，首屏期间一个音频请求都不发。
     ④ 用户真点播放时暂停预取 1.5 秒，让路给「立刻出声」。
     ⑤ 同一 tag 重复 queue = 滑窗替换：翻到下一页时上一页没跑完的任务自动作废。
     ⑥ 离线包 file://、断网、省流量、2g/3g 一律跳过；后台标签页暂停。
     ⑦ 只预取站内自有音频，绝不预热有道（外网请求一律不碰）。
     ⑧ 所有异常吞掉：预取是锦上添花，永远不能拖垮页面。
   ==================================================================== */
const __audioPrefetch = (() => {
  const MAXQ = 24, PAR = 2, GRACE = 2200;
  const done = new Set(), failed = new Set();
  let q = [], active = 0, epoch = 0, timer = 0, ready = false, pausedUntil = 0;

  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection || {};
  const blocked = () => {
    if (location.protocol === 'file:') return true;      // 离线包文件本来就在磁盘上
    if (navigator.onLine === false) return true;         // 断网只播已缓存的
    if (conn.saveData) return true;
    if (/^(slow-)?2g|3g$/.test(conn.effectiveType || '')) return true;
    if (document.hidden) return true;
    return false;
  };
  const idle = fn => {
    if (typeof requestIdleCallback === 'function') requestIdleCallback(fn, { timeout: 4000 });
    else setTimeout(fn, 500);
  };
  function pump() {
    if (!ready || blocked()) return;
    if (Date.now() < pausedUntil) { setTimeout(pump, 500); return; }
    while (active < PAR && q.length) {
      const job = q.shift();
      if (job.ep !== epoch || done.has(job.url) || failed.has(job.url)) continue;
      active++;
      fetch(job.url, { priority: 'low' })
        .then(r => { if (!r.ok) throw 0; return r.arrayBuffer(); })  // 读干净，连接及时归还
        .then(() => { done.add(job.url); })
        .catch(() => { if (job.ep === epoch) failed.add(job.url); })
        .then(() => { active--; if (job.ep === epoch) idle(pump); });
    }
  }
  function schedule() {
    if (timer) return;
    timer = setTimeout(() => { timer = 0; if (ready) idle(pump); }, 260);
  }
  /* texts 可以是单词也可以是整句；只有能解析成本地 mp3 的才会入队。 */
  function queue(texts, tag) {
    try {
      if (blocked() || !texts || !texts.length) return 0;
      if (tag) q = q.filter(j => j.tag !== tag);         // 翻页滑窗：旧页任务作废
      const ep = epoch, urls = [];
      for (let i = 0; i < texts.length && urls.length < MAXQ; i++) {
        const t = String(texts[i] || '').trim();
        if (!t) continue;
        const u = localAudioURL(t);
        if (!u || done.has(u) || failed.has(u) || urls.indexOf(u) >= 0) continue;
        urls.push(u);
      }
      urls.forEach(u => q.push({ url: u, ep, tag: tag || '' }));
      if (q.length > MAXQ) q = q.slice(-MAXQ);
      schedule();
      return urls.length;
    } catch (e) { return 0; }
  }
  function cancel() { epoch++; q = []; }
  function pause(ms) { pausedUntil = Date.now() + (ms || 1500); }
  /* 从当前页 DOM 认出「能点读的文本」：onclick 里的 speakXxx('...')、
     知识点例句 .pc-en、句型卡 .se。只收纯英文，认不出就跳过。 */
  function scan(root) {
    const host = root || document.getElementById('app') || document.querySelector('main');
    if (!host) return 0;
    const texts = [];
    const add = t => {
      t = String(t || '').replace(/^🔊\s*/, '').trim();
      if (!t || t.length > 120 || !/^[A-Za-z][A-Za-z0-9 ,.'’!?\-:]*$/.test(t)) return;
      texts.push(t);
    };
    try {
      host.querySelectorAll('[onclick*="speak"]').forEach(el => {
        const m = (el.getAttribute('onclick') || '').match(/speak\w*\(\s*'((?:\\.|[^'\\])*)'/);
        if (m) add(m[1].replace(/\\'/g, "'").replace(/\\n/g, ' ').replace(/\\\\/g, '\\'));
      });
      host.querySelectorAll('.pc-en,.gs-sentcard .se').forEach(el => add(el.textContent));
    } catch (e) {}
    return queue(texts, '__scan');
  }
  function boot() {
    const start = () => {
      ready = true;
      scan();
      idle(pump);          // 页面加载阶段排进来的队列，到这里才第一次真正开跑
      const host = document.getElementById('app') || document.querySelector('main');
      if (host && typeof MutationObserver === 'function') {
        let t = 0;
        new MutationObserver(() => {
          clearTimeout(t);
          t = setTimeout(() => scan(host), 340);
        }).observe(host, { childList: true, subtree: true });
      }
    };
    const after = () => setTimeout(start, GRACE);
    if (document.readyState === 'complete') after();
    else window.addEventListener('load', after, { once: true });
    document.addEventListener('visibilitychange', () => { if (!document.hidden) idle(pump); });
  }
  boot();
  return { queue, cancel, pause, scan,
    stats: () => ({ queued: q.length, active, cached: done.size, failed: failed.size, ready }) };
})();
window.__audioPrefetch = __audioPrefetch;

/* 预热：只排队站内自有音频。v8 之后没有外网音源可探路，
   包内没有的直接返回——不假装失败，免得 sentence.js 把正常的词判成"坏词组"。 */
function prewarmWord(text, onFail) {
  if (!text) return;
  if (localAudioURL(String(text))) { __audioPrefetch.queue([String(text)]); return; }
}
/* 播放入口：直接走媒体元素。epoch 在这里统一递增；
   timeoutMs 可选（连读链传短超时保持节奏）。 */
function playDictAudio(text, rate, onEnd, onFail, isRetry, timeoutMs, startIdx, reuseEl) {
  /* 用户真点播放了：暂停后台预取 1.5 秒，把带宽让给「立刻出声」。 */
  try { __audioPrefetch.pause(); } catch (e) {}
  const epoch = ++__audioEpoch;
  const t = String(text).trim();
  if (!t) { if (onFail) onFail(); return; }
  __playMediaElement(t, rate, epoch, onEnd, onFail, isRetry, timeoutMs, startIdx, reuseEl);
}
/* ===== 坏音频自愈：把这条 URL 从缓存里踢掉 =====
   v8 之后音频都是站内静态文件，正常不会坏；但下载中途断网、磁盘写满、
   部署换版时正好读到半截文件，都会在音频缓存里留下一条坏条目，
   此后这个设备上这个词就再也不出声（换台电脑又好了，极难复现）。
   播放最终失败时删掉这条缓存，下次点击重新下载即可自愈。
   不依赖 SW 消息通道：页面和 SW 共用同一个 CacheStorage，直接删就行，
   也就不需要知道 CACHE 叫什么名字。 */
function __purgeAudioCache(url) {
  try {
    const u = String(url || '');
    if (!u || u.indexOf('audio/') < 0) return;            // 只处理站内音频
    if (!window.caches || !caches.keys) return;
    const urls = [u];
    caches.keys().then(ks => {
      ks.forEach(k => {
        caches.open(k).then(c => { urls.forEach(x => { c.delete(x).catch(() => {}); }); }).catch(() => {});
      });
    }).catch(() => {});
  } catch (e) { /* 删不掉就算了，绝不影响播放 */ }
}
/* ===== 朗读诊断（只给家长中心看，孩子看不到） =====
   为什么要有：句子朗读是「多段音频接龙」，真机上出问题时用户只能描述
   「念到一半停了」，没有别的线索；而这台开发机又复现不出来（桌面浏览器
   的自动播放策略和手机不一样）。
   记最近 80 条：播放哪一段、共用还是新建元素、结束还是失败、用第几个音源。
   存 localStorage，家长中心底部可一键复制。 */
const __AUD_LOG_KEY = 'birdie_audit_v1';
const __audLog = (() => {
  try {
    const raw = localStorage.getItem(__AUD_LOG_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.slice(-80) : [];
  } catch (e) { return []; }
})();
let __audTimer = 0;
function __alog(kind, text, extra) {
  try {
    const t = (typeof performance !== 'undefined' ? performance.now() : Date.now()) / 1000;
    __audLog.push([Math.round(t * 10) / 10, kind, String(text == null ? '' : text).slice(0, 28), extra || '']);
    if (__audLog.length > 80) __audLog.shift();
    if (!__audTimer) {
      __audTimer = setTimeout(() => {
        __audTimer = 0;
        try { localStorage.setItem(__AUD_LOG_KEY, JSON.stringify(__audLog)); } catch (e) {}
      }, 800);
    }
  } catch (e) {}
}
window.auditLog = () => __audLog;
window.auditClear = () => { __audLog.length = 0; try { localStorage.removeItem(__AUD_LOG_KEY); } catch (e) {} };

/* 媒体元素兜底（v4 链路 + 句子复用同一个元素）：唯一声源保证 + 重试一次。
   epoch 由调用方传入并负责递增——重试时也走同一令牌，不会和归一化路径抢令牌。

   ★ reuseEl（2026-11-01「念完 pencil 就停」的修法）：
     移动端/安卓 WebView 的自动播放策略是「按元素授权」——只有**被点击那一刻
     play 过的那个 <audio>** 才拿到许可，之后新建的元素 play() 直接被拒
     （NotAllowedError），链条就走不下去了。桌面浏览器有 5 秒的「粘性用户激活」，
     所以两三个片段以内是好的，慢网络上第 3 段就超过 5 秒 → 从那里开始全哑。
     症状恰好是「念完前两句就停」，而且每次都在同一处。
     解法：整句连读共用一个 <audio>，只换 src —— 已授权的元素换源不会被重新拦截。 */
/* ===== 系统语音兜底（2026-11-08）=====
   只在「包内没有这段音频 + 单独朗读」时用：本机 speechSynthesis，零网络、
   零第三方请求，断网也能出声。刻意不给句子接龙用（那样一句话会前后两种音色）。
   失败不弹任何提示——点了没声是事实，页面另有「测试声音」可自查。 */
let __ttsUtter = null;
function __ttsFallback(text, epoch, onEnd, onFail) {
  const done = (() => { let d = false; return fn => { if (d) return; d = true; fn && fn(); }; })();
  let guard = null;
  const finish = ok => done(() => {
    if (guard) { clearTimeout(guard); __guards.delete(guard); guard = null; }
    __ttsUtter = null;
    if (ok) { if (onEnd) onEnd(); } else { if (onFail) onFail(); }
  });
  try {
    if (!window.speechSynthesis || typeof SpeechSynthesisUtterance !== 'function') { finish(false); return; }
    const u = new SpeechSynthesisUtterance(String(text));
    u.lang = 'en-US'; u.rate = 0.9; u.pitch = 1;
    u.onend = () => finish(true);
    u.onerror = () => finish(false);
    __ttsUtter = u;
    __alog('tts', text, '系统语音兜底');
    guard = setTimeout(() => finish(false), Math.max(4000, String(text).length * 220));
    __guards.add(guard);
    speechSynthesis.speak(u);
  } catch (e) { finish(false); }
}

function __playMediaElement(text, rate, epoch, onEnd, onFail, isRetry, timeoutMs, srcIdx, reuseEl) {
  rate = 1; // mobile compat: always normal speed
  const srcs = __audioSources(text);
  /* 包内没有这段音频（极少：用户自己造的怪拼写、未来新增内容还没烘焙）。
     句子接龙里（reuseEl 非空）直接跳过这一段，绝不把机器音插进一句话中间；
     单独朗读时才让系统语音兜底，宁可音色差一点，也不能点了没反应。 */
  if (!srcs.length) {
    if (reuseEl) { if (onFail) onFail(); return; }
    __ttsFallback(text, epoch, onEnd, onFail);
    return;
  }
  const si = Math.min(srcIdx || 0, srcs.length - 1);
  let a = reuseEl || null;
  if (a) {
    /* 复用元素：换源之前先把上一段的回调解干净，避免上一段的 error/ended 串到这一句上 */
    try {
      a.onended = a.onerror = a.oncanplay = a.onplaying = null;
      a.pause();
    } catch (e) {}
    if (a.__src !== srcs[si]) {
      a.__src = srcs[si];
      try { a.src = srcs[si]; a.load(); } catch (e) {}
    }
  } else {
    a = new Audio(srcs[si]);
  }
  a.preload = 'auto';
  __curAudio = a;
  __inflight.add(a);
  __alog('play', text, (reuseEl ? '共用' : '新建') + '#' + si + (isRetry ? '·重试' : ''));
  let done = false, guard = null, played = false;
  /* 计时器统一登记：stopAllSpeech 时一次性拆干净。
     否则翻页/切题后，9 秒前的旧 guard 到点会把旧词又播一遍。 */
  const clearG = () => { if (guard) { clearTimeout(guard); __guards.delete(guard); guard = null; } };
  const setG = ms => { guard = setTimeout(fail, ms); __guards.add(guard); };
  const disarm = () => { try { a.onended = a.onerror = a.oncanplay = a.onplaying = null; a.pause(); } catch (e) {} };
  const end = () => { if (!done) { done = true; clearG(); __inflight.delete(a); __alog('end', text); if (onEnd) onEnd(); } };
  const fail = () => {
    if (done) return;
    done = true; clearG(); disarm(); __inflight.delete(a); // 解除全部回调：迟到的加载绝不再出声
    __alog('fail', text, 'src' + si + (isRetry ? '·已重试' : ''));
    /* 已被更新的一次点击取代：绝不重试、绝不回头抢声源
       （重试会 ++epoch，把用户正在听的新词掐掉再播回旧词）。 */
    if (epoch !== __audioEpoch) return;
    /* 本地文件取不到（删除/损坏/部署不全）→ 立刻换下一个音源。
       这不算"失败重试"：孩子不该为一个仓库问题多等两秒。 */
    if (si + 1 < srcs.length) { __playMediaElement(text, rate, epoch, onEnd, onFail, isRetry, timeoutMs, si + 1, reuseEl); return; }
    /* 自动重试一次：从"最后试过的那个音源"再来，不回头再撞 404 的本地文件。
       重试前先把这条 URL 从缓存里删掉 —— 否则缓存里就是那条坏响应，
       重试等于把同一份错误再听一遍（见 __purgeAudioCache 的说明）。 */
    if (!isRetry) { __purgeAudioCache(srcs[si]); playDictAudio(text, rate, onEnd, onFail, true, timeoutMs, si, reuseEl); return; }
    __purgeAudioCache(srcs[si]);
    const now = Date.now();
    if (now - __dictFailNotified > 30000) { __dictFailNotified = now; toast('🔇 这段发音没能播放，再点一次试试'); }
    if (onFail) onFail();
  };
  /* ★ 看门狗：真正出声后不能把超时全拆掉。
     坏流（比如缓存里那条 120 字节的 500 JSON）可能 fire 过 playing 之后
     就再也不 fire ended / error —— 链条会永久停在这一段，
     用户听到的就是「念完前两句就停」。所以按真实时长挂一个兜底：
       · 播到过有声（currentTime > 0.15）→ 当作这一段读完了，链条继续
       · 一秒都没出声 → 判定坏流，走 fail()（清缓存 + 重试 + 降级） */
  const watchdog = () => {
    if (done) return;
    if (a.ended) return end();
    const t = a.currentTime || 0;
    if (t > 0.15) { __alog('看门狗', text, '已出声' + t.toFixed(2) + 's'); return end(); }
    __alog('看门狗', text, '没出声');
    fail();
  };
  a.onended = end;
  a.onerror = fail;
  a.onplaying = () => {
    if (epoch !== __audioEpoch) return;
    played = true;
    clearG();
    const d = (isFinite(a.duration) && a.duration > 0) ? a.duration * 1000 : 0;
    guard = setTimeout(watchdog, Math.min(Math.max(d + 1500, 2500), 15000));
    __guards.add(guard);
  };
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
    /* 首次点击在手机上可能要等网络下载 2-5 秒——1.5 秒后还没好就提示一次，让孩子知道没坏 */
    var __slowTip = setTimeout(() => {
      if (!done && epoch === __audioEpoch) {
        const now = Date.now();
        if (now - __dictFailNotified > 30000) { __dictFailNotified = now; toast('🔊 正在加载发音，请稍等…'); }
      }
    }, 1500);
    a.oncanplay = () => { a.oncanplay = null; clearTimeout(__slowTip); stopAllSpeechExcept(a); go(); };
    setG(timeoutMs || (__firstPlayDone ? 9000 : 12000));
  }
}
/* 让路：暂停除 a 以外的所有在途音频（预热队列立刻腾出连接） */
function stopAllSpeechExcept(keep) {
  __inflight.forEach(x => { if (x !== keep) { try { x.onended = x.onerror = x.oncanplay = x.onplaying = null; x.pause(); } catch (e) {} __inflight.delete(x); } });
}

/* 音标：ipa.js 只在单词页加载，别的页面没有这个全局变量 */
/* ★ 2026-11-08：两处修正——
   ① 大小写不敏感。ipa.js 里星期/月份/国名是首字母大写键（Thursday、Monday…），
     直接 IPA[w] 查「thursday」会落空 → 音标整行消失（用户截图 Thursday 就是这个）。
   ② 统一输出 /…/ 一对斜杠。各显示端都直接印这个值，谁也不许再补斜杠
     （pep.html 曾补成 //muv//，删补丁时又变成了没斜杠）。 */
function ipaOf(w) {
  if (typeof IPA === 'undefined') return '';
  const raw = String(w == null ? '' : w);
  const hit = IPA[raw] || IPA[raw.toLowerCase()]
    || IPA[raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase()] || '';
  if (!hit) return '';
  const v = String(hit).trim().replace(/^\/+|\/+$/g, '');
  return v ? '/' + v + '/' : '';
}

/* 颜色词的图：emoji 里根本没有"灰色圆点"这类符号，硬凑就会出现 grey=🐈 这种错。
   颜色一律用**色块**——这正是课本教颜色的方式，也不会和别的词撞图。 */
const WORD_COLOR = {
  red: '#EF4444', yellow: '#FACC15', blue: '#3B82F6', green: '#22C55E',
  white: '#FFFFFF', black: '#1F2937', orange: '#F97316', pink: '#F472B6',
  purple: '#A855F7', brown: '#92400E', grey: '#9CA3AF',
};

/* 词图三级：色块（颜色词）→ emoji（有合适图形的）→ 首字母牌（配不上的）
   代词/介词/连词/抽象动词这类词根本没有形象，硬塞一个 emoji 是错的——
   it=🐱 会让孩子以为 it 就是"猫"，believe=🙏 会以为"相信"就是祈祷。
   宁可给字母牌，也不给假图。 */
function wordIcon(w) {
  const name = String((w && w.w) || '').toLowerCase();
  const emo = String((w && w.e) || '').trim();
  /* 内置 SVG 优先：不依赖系统 emoji 字体，任何电脑画出来都一样彩色
     （emoji 靠字体渲染，会变黑白或吐方块，见下面 emojiClusters 的说明） */
  if (emo && hasEmojiSvg(emo)) {
    return `<span class="wsvg" role="img" aria-label="${esc(w.zh || name)}">${emoSvg(emo)}</span>`;
  }
  /* SVG 卡通插画（svg/word-svg.js） */
  if (typeof WORD_SVG !== 'undefined' && WORD_SVG[name]) {
    return `<span class="wsvg" role="img" aria-label="${esc(w.zh || name)}">${WORD_SVG[name]}</span>`;
  }
  if (WORD_COLOR[name]) {
    return `<span class="cchip" style="background:${WORD_COLOR[name]}" role="img" aria-label="${esc(w.zh || name)}"></span>`;
  }
  /* 没内置图才退回系统 emoji，并强制走彩色 emoji 字体（.emj） */
  if (emo) return `<span class="emj" role="img" aria-label="${esc(w.zh || name)}">${esc(emo)}</span>`;
  const ch = String((w && w.w) || '?').trim().charAt(0).toUpperCase();
  return `<span class="wtile" aria-hidden="true">${esc(ch)}</span>`;
}

/* ---------------- 词图的统一取用口 ----------------
   ★ 血泪教训（2026-10-26）：wordIcon 修好之后，页面上仍有一大半地方直接写
     `${w.e}` 渲染 emoji 字符 —— 等于把「靠系统字体画图」的老毛病原样留着，
     老 Windows 上照样黑白/方块。凡是「给孩子看的词图」一律走下面两个函数：
       iconOf(w)  拿渲染好的 HTML（带缓存，整库批量出题也不卡）
       hasIcon(w) 判断有没有真图（字母牌不算图，不能拿去做「看图选」的选项）
   例外：站点导航图标（岛屿、按钮、标题前缀）是界面装饰，不是词图，不在此列。 */
const __iconCache = new Map();
function iconOf(w) {
  if (!w) return '';
  const key = String(w.w || '') + '\u0001' + String(w.e || '') + '\u0001' + String(w.zh || '');
  let hit = __iconCache.get(key);
  if (hit === undefined) { hit = wordIcon(w); __iconCache.set(key, hit); }
  return hit;
}
/* 字母牌 = 没有真图。这类词不能进「看图选」的选项，否则孩子看到四个字母牌没得选。 */
function hasIcon(w) {
  return !/class="wtile"/.test(iconOf(w));
}
/* ---------------- 词图的「身份」：只认画出来的那张图 ----------------
   ★ 2026-11-09.14：图词配对、听词选图、拼读闯关的选项去重，原来都拿 iconOf(w)
     的返回串当 key。可 iconOf 的 HTML 里带 aria-label="释义" ——
     两个词只要释义不同（colour / color、child / children、bag / schoolbag），
     字符串就不同，去重等于没做。用户截图里同一轮出现两张彩虹，就是这条。
     全库有 18 组「一张图配两个以上词」，每一组都可能撞在同一道题里。
   iconKey 只取图源，与 aria-label 无关：
     内置 emoji SVG / 自绘 SVG / 颜色色块 / emoji 码位 / 字母牌。 */
function iconKey(w) {
  if (!w) return '';
  const name = String(w.w || '').toLowerCase();
  const emo = String(w.e || '').trim();
  /* U+FE0F（变体选择符）要去掉：同一张图有时带有时不带，key 必须一致 */
  if (emo) {
    const plain = emo.replace(/\uFE0F/g, '');
    if (typeof hasEmojiSvg === 'function' && hasEmojiSvg(emo)) return 'esvg:' + plain;
  }
  if (typeof WORD_SVG !== 'undefined' && WORD_SVG[name]) {
    /* 两对自绘 SVG 的路径数据**逐字节相同**（correct/well、everybody/everyone），
       只按词名做 key 会漏掉它们，同一轮照样出现两张一样的画。归一到同一个 key。 */
    return 'svg:' + (SVG_SAME_KEY[name] || name);
  }
  if (WORD_COLOR[name]) return 'chip:' + WORD_COLOR[name];
  if (emo) return 'emoji:' + emo.replace(/\uFE0F/g, '');
  return 'letter:' + name.charAt(0);
}
/* 画面相同、词不同：后来者归一到前者（校验脚本 _audit/test_icon_key.js 会核对这张表） */
const SVG_SAME_KEY = { well: 'correct', everyone: 'everybody' };

/* ================= emoji → 内置矢量图 =================
   ★ 2026-10-26：这是「整页显示黑白」的根因修复。

   emoji 在网页上是「字体字形」，不是图片。浏览器挑字体的规则是：
   用字体栈里第一个**含这个字形**的字体。
   我们原来的字体栈是
     "Microsoft YaHei", "Segoe UI Symbol", "Segoe UI Emoji", sans-serif
   而微软雅黑自带 🎡🔎🔒 这类符号的**单色字形** —— 它排在彩色 emoji 字体前面，
   浏览器就近取用，画出来就是黑白线条。
   实测（Win11 + Edge，不是老电脑）：🎡🔎🔒 全黑白。
   更老的机器（Win7/8）根本没有彩色 emoji 字体，只有黑白轮廓；
   精简系统 / Linux 没有对应字形，直接吐空白方块。

   只调字体栈救不了 Win7，所以把 emoji 全部换成内置 SVG
   （svg/emoji-svg.js，Twemoji 15.0.0，CC-BY 4.0）。 */

/* 判断一个码位是否属于 emoji / 符号区。
   刻意**不用** \p{Extended_Pictographic}：那是 ES2018 的 Unicode 属性转义，
   微信 X5 内核和老 Android 不支持 —— 正则字面量会在**解析阶段**抛 SyntaxError，
   整个脚本挂掉，比黑白严重得多。所以用码位区间手写。 */
function isEmojiCp(cp) {
  return (cp >= 0x1F000 && cp <= 0x1FAFF) || (cp >= 0x2600 && cp <= 0x27BF) ||
         (cp >= 0x2B00 && cp <= 0x2BFF) || (cp >= 0x2190 && cp <= 0x21FF) ||
         (cp >= 0x2300 && cp <= 0x23FF) || (cp >= 0x25A0 && cp <= 0x25FF) ||
         cp === 0x2934 || cp === 0x2935 || cp === 0x203C || cp === 0x2049 ||
         cp === 0x3030 || cp === 0x303D || cp === 0x3297 || cp === 0x3299 ||
         cp === 0x20E3;
}

/* 把字符串切成 emoji 视觉单元（cluster）。
   ⚠️ 切分规则必须与 _audit/gen_emoji_svg2.py 的 clusters() 逐字一致，
   否则图库 key 对不上，等于没图。
   返回 [{ text, emoji }]，非 emoji 字符逐字返回。 */
function emojiClusters(str) {
  const s = String(str == null ? '' : str);
  const out = [];
  const n = s.length;
  let i = 0;
  while (i < n) {
    const ch = s.charAt(i);
    const cp = s.codePointAt(i);
    /* 键帽：数字 / # / *  + 可选 FE0F + U+20E3（如 1️⃣） */
    if ('#*0123456789'.indexOf(ch) >= 0) {
      let j = i + 1;
      if (j < n && s.charCodeAt(j) === 0xFE0F) j++;
      if (j < n && s.charCodeAt(j) === 0x20E3) {
        out.push({ text: s.slice(i, j + 1), emoji: true });
        i = j + 1;
        continue;
      }
    }
    if (!isEmojiCp(cp)) {
      out.push({ text: ch, emoji: false });
      i += 1;
      continue;
    }
    let j = i + (cp > 0xFFFF ? 2 : 1);
    while (j < n) {
      const c2 = s.charCodeAt(j);
      if (c2 === 0xFE0F || c2 === 0x20E3) { j++; continue; }   // 变体选择符 / 键帽组合
      if (c2 === 0x200D) {                                      // ZWJ：把下一个 emoji 也并入
        j++;
        if (j < n) {
          const c3 = s.codePointAt(j);
          if (isEmojiCp(c3)) j += (c3 > 0xFFFF ? 2 : 1);
        }
        continue;
      }
      break;
    }
    out.push({ text: s.slice(i, j), emoji: true });
    i = j;
  }
  return out;
}

/* key 规范化：去掉 U+FE0F。这样 🏘 和 🏘️ 查到同一张图，
   不会再出现「带不带变体选择符决定有没有图」这种随机 bug。 */
function normEmoji(cl) { return String(cl).replace(/\uFE0F/g, ''); }

const __emojiSvgCache = new Map();
function emojiSvgFor(cl) {
  const k = normEmoji(cl);
  if (__emojiSvgCache.has(k)) return __emojiSvgCache.get(k);
  /* 图库（svg/emoji-svg.js，gzip 290KB）是 async 加载的，可能比这里晚到。
     所以读 window.WORD_EMOJI —— 读到空就先用字体字形顶上，图库到了再升级。 */
  const v = (window.WORD_EMOJI && window.WORD_EMOJI[k]) ? window.WORD_EMOJI[k] : '';
  __emojiSvgCache.set(k, v);
  return v;
}

/* 这个 emoji 串里只要有一个字符能画出来，就返回 true */
function hasEmojiSvg(emo) {
  const s = String(emo || '').trim();
  if (!s) return false;
  const segs = emojiClusters(s);
  for (let i = 0; i < segs.length; i++) {
    if (segs[i].emoji && emojiSvgFor(segs[i].text)) return true;
  }
  return false;
}

/* emoji 串 → 内置 SVG 的 HTML。
   图库里没有的（← → ★ ✓ 这类纯符号，Twemoji 15 已移除它们的彩色版本）
   原样保留：它们在所有系统上本来就是黑白符号字符，不是 bug。 */
function emoSvg(emo, size) {
  const e = String(emo == null ? '' : emo).trim();
  if (!e) return '';
  const box = size ? ` style="width:${size}px;height:${size}px"` : '';
  let out = '';
  const segs = emojiClusters(e);
  for (let i = 0; i < segs.length; i++) {
    const g = segs[i];
    if (!g.emoji) { out += esc(g.text); continue; }
    const svg = emojiSvgFor(g.text);
    out += svg
      ? `<span class="emj-img"${box} aria-hidden="true">${svg}</span>`
      : `<span class="emj"${box} aria-hidden="true">${esc(g.text)}</span>`;
  }
  return out;
}

/* ---------------- DOM 级兜底：把页面上残留的 emoji 全换成内置图 ----------------
   为什么要扫 DOM，而不是只改渲染代码：
   全站有 150+ 处直接写 emoji 字符（首页 6 个岛屿、各页标题、按钮、
   解析符号、底部导航、声音开关、云朵装饰…）。逐个改既容易漏，
   以后新加内容还会再漏。这里一处兜底，静态 HTML 和 innerHTML 重绘都覆盖。 */

const __noPaintTag = {
  SCRIPT: 1, STYLE: 1, TEXTAREA: 1, INPUT: 1, CODE: 1, PRE: 1, SVG: 1, TITLE: 1, OPTION: 1
};

/* 快速判断：这段文字里有没有 emoji 码位（纯中文/英文直接跳过，不建 TreeWalker） */
function __hasEmojiChar(s) {
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    if (c >= 0xD800 && c <= 0xDBFF) {
      if (isEmojiCp(s.codePointAt(i))) return true;
      i++;                                   // 跳过代理对低位
    } else if (isEmojiCp(c)) {
      return true;
    }
  }
  return false;
}

/* 处理一个文本节点：把里面的 emoji 换成 <span class="emj-img"><svg/></span> */
function __paintTextNode(node) {
  const s = node.nodeValue;
  if (!s || !__hasEmojiChar(s)) return;
  const segs = emojiClusters(s);
  let any = false;
  for (let i = 0; i < segs.length; i++) {
    if (segs[i].emoji && emojiSvgFor(segs[i].text)) { any = true; break; }
  }
  if (!any) return;                          // 全是画不出来的符号，别动 DOM
  const frag = document.createDocumentFragment();
  for (let i = 0; i < segs.length; i++) {
    const g = segs[i];
    const svg = g.emoji ? emojiSvgFor(g.text) : '';
    if (svg) {
      const sp = document.createElement('span');
      sp.className = 'emj-img';
      sp.setAttribute('aria-hidden', 'true');
      sp.innerHTML = svg;                    // Twemoji 是我们自己的常量，无注入风险
      frag.appendChild(sp);
    } else {
      frag.appendChild(document.createTextNode(g.text));
    }
  }
  if (node.parentNode) node.parentNode.replaceChild(frag, node);
}

function paintEmoji(root) {
  if (typeof document === 'undefined') return;
  root = root || document.body;
  if (!root) return;
  if (root.nodeType === 3) { __paintTextNode(root); return; }
  if (root.nodeType !== 1) return;
  if (__noPaintTag[root.nodeName]) return;
  if (!window.WORD_EMOJI) return;                 // 图库还没到，等 __emojiSvgReady 再来
  if (!__hasEmojiChar(root.textContent || '')) return;
  if (typeof document.createTreeWalker !== 'function') return;
  /* 先收集再改：TreeWalker 边走边改会漏节点 */
  const walker = document.createTreeWalker(root, 4 /* SHOW_TEXT */, null, false);
  const list = [];
  let n;
  while ((n = walker.nextNode())) {
    const p = n.parentNode;
    if (!p || __noPaintTag[p.nodeName]) continue;
    if (p.classList && p.classList.contains('emj-img')) continue;
    if (__hasEmojiChar(n.nodeValue || '')) list.push(n);
  }
  for (let i = 0; i < list.length; i++) __paintTextNode(list[i]);
}

/* 观察器：innerHTML 重绘出来的新节点也要补上 */
let __emojiPending = [];
let __emojiTimer = 0;
function __emojiFlush() {
  __emojiTimer = 0;
  const list = __emojiPending;
  __emojiPending = [];
  for (let i = 0; i < list.length; i++) {
    const t = list[i];
    if (!t || !t.parentNode) continue;
    try { paintEmoji(t.nodeType === 3 ? t.parentNode : t); } catch (e) { /* 不能因为画图挂掉整页 */ }
  }
}
function __emojiQueue(n) {
  __emojiPending.push(n);
  if (__emojiTimer) return;
  __emojiTimer = (typeof requestAnimationFrame === 'function')
    ? requestAnimationFrame(__emojiFlush)
    : setTimeout(__emojiFlush, 16);
}
let __emojiMO = null;
function __bootEmojiPaint() {
  if (typeof document === 'undefined' || !document.body) return;
  if (!window.WORD_EMOJI) return;
  paintEmoji(document.body);
  if (typeof MutationObserver !== 'function' || __emojiMO) return;
  __emojiMO = new MutationObserver(function (muts) {
    let got = false;
    for (let i = 0; i < muts.length; i++) {
      const m = muts[i];
      if (m.type === 'characterData') { __emojiQueue(m.target); got = true; continue; }
      const add = m.addedNodes;
      for (let k = 0; k < add.length; k++) {
        const nd = add[k];
        if (nd.nodeType !== 1 && nd.nodeType !== 3) continue;
        /* 跳过自己刚插进去的 .emj-img，否则会自己触发自己 */
        if (nd.nodeType === 1 && nd.classList && nd.classList.contains('emj-img')) continue;
        __emojiQueue(nd);
        got = true;
      }
    }
    return got;
  });
  try {
    __emojiMO.observe(document.body, { childList: true, subtree: true, characterData: true });
  } catch (e) { /* 老内核不支持就只做首屏那一次 */ }
}
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', __bootEmojiPaint);
  else __bootEmojiPaint();
}

/* ---------------- 图库到货后的「升级」 ----------------
   ★ 2026-11-01 首屏提速：svg/emoji-svg.js 原始 857KB、gzip 290KB，
     占了首页传输量的 66%，而且原来排在 app.js 前面 —— 全屏加载层要等它下完才消失，
     手机上就是「一直转圈加载不完」。
     现在它改成 async（浏览器并行下载、不挡解析），页面先用系统 emoji 字形顶上，
     图库一到就把图标逐个换成矢量图：
       · 现代手机/电脑：字形本来就是彩色的，用户几乎看不出差别
       · 老 Windows / 无彩色 emoji 字体的机器：先看到黑白轮廓，图库到了自动变彩色
     两种情况都不影响功能，只是"先能玩，后变漂亮"。 */
window.__emojiSvgReady = function () {
  try {
    if (!window.WORD_EMOJI) return;
    __emojiSvgCache.clear();                       // 清掉「查不到」的负缓存
    const spans = document.querySelectorAll('span.emj');
    for (let i = 0; i < spans.length; i++) {
      const el = spans[i];
      const t = (el.textContent || '').trim();
      const svg = t ? emojiSvgFor(t) : '';
      if (!svg) continue;
      el.classList.remove('emj');                  // 就地换掉，不嵌套 span
      el.classList.add('emj-img');
      el.innerHTML = svg;                          // 自己的常量，无注入风险
    }
    __bootEmojiPaint();                            // 剩下的裸字符 + 装上观察器
  } catch (e) { /* 升级失败就保持字体字形，绝不影响功能 */ }
};
if (window.WORD_EMOJI) window.__emojiSvgReady();    // 图库比 app.js 先到的情形

/* ================= emoji 图库的加载时机（2026-11-08 晚）=================
   emoji-svg.js 是全站最大单体（原始 870KB / gzip 297KB）。原来是 HTML 里的
   <script async>，虽然不挡渲染，但**会和首屏阻塞脚本抢带宽**——
   实测用户在 13~21KB/s 的窄带下，297KB 的图库能把 app.js/words-data 的下载
   拖后十几秒，屏幕就停在浏览器自己的「服务器正在响应」转圈上。
   现在改成由这里注入：
     · 正常网速：立刻注入（和以前的 async 行为一致）
     · 慢网（2g/3g/省流量）：等 load + 空闲再下，先把页面跑起来，
       图标稍后由 __emojiSvgReady() 就地升级（本来就有这个机制）
   页面里不再写 <script src="svg/emoji-svg.js">，避免绕开这个门。 */
(function () {
  const load = () => {
    if (window.WORD_EMOJI) return;                   // 已经到了（file:// 内联兜底等）
    const s = document.createElement('script');
    s.src = 'svg/emoji-svg.js?v=5';
    s.async = true;
    s.onerror = () => {};                            // 拉不到就保持字体字形，不影响功能
    (document.head || document.documentElement).appendChild(s);
  };
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection || {};
  const slow = !!(conn.saveData || /^(slow-)?2g|3g$/.test(conn.effectiveType || ''));
  if (!slow) { load(); return; }
  const idle = fn => (typeof requestIdleCallback === 'function')
    ? requestIdleCallback(fn, { timeout: 6000 }) : setTimeout(fn, 800);
  if (document.readyState === 'complete') idle(load);
  else window.addEventListener('load', () => idle(load));
})();

/* 立刻闭嘴：所有在途音频解除回调并暂停（翻页/切题/点新词时用） */
/* 音频链状态（在 stopAllSpeech 里用到，所以声明必须在它之前，
   否则首次调用会踩 let 的暂时性死区） */
let __chainToken = 0;
let __chainEl = null;

function stopAllSpeech() {
  __audioEpoch++;                          // 作废所有迟到的加载/失败回调
  __chainToken++;                          // 作废「字母名→字母音→例词」这类音频链
  if (__chainEl) { try { __chainEl.pause(); } catch (e) {} __chainEl = null; }
  __guards.forEach(g => clearTimeout(g));  // 拆掉加载超时，否则 9 秒后会把旧词又播一遍
  __guards.clear();
  __inflight.forEach(a => { try { a.onended = a.onerror = a.oncanplay = a.onplaying = null; a.pause(); } catch (e) {} });
  __inflight.clear();
  __curAudio = null;
  /* 系统语音兜底也要掐断，否则点下一个词时上一句还在念 */
  try { if (__ttsUtter && window.speechSynthesis) speechSynthesis.cancel(); } catch (e) {}
  __ttsUtter = null;
  /* 句子朗读的"读完了"回调也要作废：否则被打断的旧句子会在新页面上触发自动跳题 */
  if (typeof window.__cancelSpeak === 'function') window.__cancelSpeak();
}

/* ================= 字母音 / 拼读块（自然拼读 letter sound） =================
   字母岛原来点「字母音」播的是**代表词**（apple / ball），孩子听到的是 /æpl/，
   不是 /æ/ —— 自然拼读要教的就是这个音素本身，播代表词等于没教。

   2026-11-08：这批音频**换成母语者录音**，不再自己合成。
     来源 GitHub s5s5/phonics（MIT，作者 Xiaochao Liu，README 自述 Native speaker
     pronunciation），public/sound/<IPA>.mp3 逐音素录音；取用与署名见
     THIRD-PARTY-NOTICES.txt。处理脚本 _tts/build_phonics_native.py（只做响度归一 +
     裁静音 + 转 48kbps/22050 单声道，与全站规格一致）。
   换掉的原因：自合成的辅音是「载体词 buh/kuh + 裁 ʌ」，孩子听到的是 "buh /æ/ tuh"，
   拼读教学里是怪腔；母语者录音是真孤立音素（/k/ 0.15s 爆破、/ʃ/ 0.64s 擦音）。
   唯一例外：U = /ʌ/ 仍用自合成（源库只有 /ə/ 没有 /ʌ/）。

   目录里 39 个文件 = 26 个字母音 + 13 个拼读块（sh/ch/th/ai/ay/oa/ck/ee/oo/ar/or/ir/ng）。
   拼读闯关的多字母块也走这里，所以 ck/sh 之类不再借字母名凑数。

   ★ 不要改回「用代表词当字母音」，那是被用户否掉的旧行为。
   ★ 不要把这些音素丢回给 TTS 合成：字符串 "sh" 会被念成字母名 "S H"（见 VERSION.md）。
   ★ 单独版本号：重做字母音只升 PHONICS_VER，不动 AUDIO_VER
     （后者一动，用户已缓存的十几 MB 词音频全部作废重下）。
   ★ 文件在 audio/phonics/，SW 的 /audio/ 分支会自动缓存，发版不清理。 */
const PHONICS_VER = 2;
const phonicsURL = L => `audio/phonics/${String(L).toLowerCase()}.mp3?v=${PHONICS_VER}`;

/* 顺序播放一串音频（字母岛「完整口诀」= 字母名 → 字母音 → 例词）。
   用递增 token 作废旧链：连点几次只播最后一次，不会叠音、不会串到下一页。 */
function playAudioChain(urls, onDone, gapMs) {
  const list = (urls || []).filter(Boolean);
  const gap = Math.max(0, gapMs || 0);
  stopAllSpeech();                 // 先停干净（它会把 __chainToken +1）
  const token = __chainToken;      // 拿停完之后的值，本次链就用它
  const step = i => {
    if (token !== __chainToken) return;                       // 已被新的播放/切页作废
    if (i >= list.length) { __chainEl = null; if (onDone) onDone(); return; }
    let a;
    try { a = new Audio(list[i]); } catch (e) { step(i + 1); return; }
    __chainEl = a;
    __inflight.add(a);
    const next = () => {
      __inflight.delete(a);
      try { a.onended = a.onerror = null; } catch (e) {}
      if (token !== __chainToken) return;
      /* gapMs：逐音拼读用（/k/ … /æ/ … /t/ 之间要留空隙，否则连成一串听不出是三个音） */
      if (gap) setTimeout(() => { if (token === __chainToken) step(i + 1); }, gap);
      else step(i + 1);
    };
    a.onended = next;
    a.onerror = next;              // 缺文件就跳过，绝不卡住整串
    const pr = a.play();
    if (pr && pr.catch) pr.catch(() => next());
  };
  step(0);
}

/* 只播一个字母的「字母音」 */
function playPhonics(L, onDone) { playAudioChain([phonicsURL(L)], onDone); }

/* ================= 拼读块朗读（2026-11-09）=================
   拼词小火车 / 跟读点音节会逐块发音。原来走 speak(block) → localAudioURL('th')
   → audio/th.mp3 —— 那是把 "th" 当**词**合成的 TTS 文件，espeak 念成字母名
   "T H"（VERSION.md 2026-11-08.9 有案底）。母语者音素在 audio/phonics/，
   这里统一走它：26 字母 + 13 个拼读块，全部是真音素。
   没有音素文件的块（tion / ing / igh…）退回站内词音频；再没有就不响 ——
   宁可不响，也不放错音。 */
const PH_BLOCK_OK = new Set(['sh','ch','th','ai','ay','oa','ck','ee','oo','ar','or','ir','ng']);
function speakBlock(b) {
  const k = String(b == null ? '' : b).toLowerCase().trim();
  if (!k) return;
  if ((k.length === 1 && /^[a-z]$/.test(k)) || PH_BLOCK_OK.has(k)) { playPhonics(k); return; }
  if (localAudioURL(k)) { speakWord(k); return; }
}
window.speakBlock = speakBlock;
window.playAudioChain = playAudioChain;
window.playPhonics = playPhonics;
window.phonicsURL = phonicsURL;

/* 统一朗读入口：只走站内自带音频。没有对应文件时用系统语音兜底，绝不静默失败。 */
/* ★ 2026-10-26：删掉所有「猜你没听到声音」的自动提示。

   原来有三处会主动弹 toast：
     ① 声音关闭时每次点发音都弹（节流 2.5 秒）—— 反复点词就反复弹
     ② 会话首次点读 → 700ms 后弹「设备可能静音了」
     ③ 同一个词 5 秒内连点 3 次 → 弹「听不到？按一下音量键」
   这三个都是在**猜**：用户明明听得见，①②照样弹。
   用户反馈「光出现太烦人」，全部去掉，一个都不留。

   声音状态本来就写在右上角喇叭上（🔊 / 🔇），想自查有「我的 → 测试声音」，
   都是用户主动看的，不需要任何自动弹窗。 */

function speak(text, lang = 'en-US', rate = 0.85) {
  if (!Store.d.soundOn) return;                    // 静默：一个字都不弹
  const t = String(text).trim(); if (!t) return;
  if (lang.startsWith('zh')) return; // 词典不支持中文句：中文不朗读
  stopAllSpeech();
  /* 句子（含空格）：整句丢给有道必 500，改成按词用本地真人音频接龙。
     将来若给某句烘焙了整句离线音频，localAudioURL 命中就照旧一次播完。 */
  if (/\s/.test(t) && !localAudioURL(t)) { speakSentenceWords(t); return; }
  playDictAudio(t, rate, null, null);
}

/* ===== 例句朗读：按词接龙（2026-11-07）=====
   为什么不是"再等等"：有道 dictvoice 只查词典里收录的词/短语，
   整句 She is hard-working and clever. 实测返回 500 + 120 字节 JSON，
   媒体元素永远等不到 canplay，12 秒超时 + 自动重试 12 秒才报失败。
   改法：把句子按词拆开，每个词都有本地真人 mp3（含本次补的 108 个），
   点一下第一个词立刻出声，全句零网络、断网也能读。

   ★ 整句共用同一个 <audio>：移动端自动播放许可是「按元素」发放的，
     每段新建一个元素的话，第 2 段起 play() 会被拒（症状＝念一个词就停）。
     只换 src 不换元素，已授权的元素不会被重新拦截。
   ★ 某个词万一失败/超时，onEnd 与 onFail 都推进下一段，绝不卡住整句。 */
function speakSentenceWords(text) {
  const words = String(text).match(/[A-Za-z]+(?:['\u2019\-][A-Za-z]+)*/g) || [];
  if (!words.length) { playDictAudio(text, 1, null, null); return; }
  const el = new Audio();
  el.preload = 'auto';
  __inflight.add(el);                 // 登记后 stopAllSpeech() 能整链掐断
  let i = 0;
  const next = () => {
    if (i >= words.length) { __inflight.delete(el); return; }
    const w = words[i++];
    playDictAudio(w, 1, next, next, false, 9000, 0, el);
  };
  next();
}

/* 测试声音：播放一段欢快音效 + 一个单词，让孩子/家长确认设备有没有声。
   网站内的声音开关关着时自动打开（不然测了也是静音，毫无意义）。 */
function testSound() {
  if (!Store.d.soundOn) {
    Store.d.soundOn = true; Store.save();
    const sb = document.getElementById('soundBtn'); if (sb) sb.textContent = '🔊';
    toast('🔊 已打开网站声音，正在测试…');
  }
  sfx.correct();
  setTimeout(() => {
    speak('hello', 'en-US', 1);
    setTimeout(() => toast('❓ 能听到我说话吗？如果听不到，请检查设备的音量键 🔊'), 1200);
  }, 350);
}

/* 链式朗读：读完一句自动读下一句；单段失败（已自动重试过）跳过继续，
   连续失败 3 次才整链停止——不因个别词失败打断整段朗读（绝不切机器音） */
/* speakChain 已删除（2026-11-08）：它被用来播「字母名 + 0.55 倍速代表词」冒充字母音，
   也正是慢速怪声的来源。全站已无调用者；想分段播就用 playAudioChain(urls, onDone, gapMs)。 */

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
    /* 静音播一下站内的 hi.mp3：解锁媒体通道，同时把这条音频塞进缓存。
       以前这里播放的是外网词典音频，顺便预热 DNS/TLS；现在全站零外网，不需要了。 */
    const u = localAudioURL('hi') || localAudioURL('hello');
    if (u) {
      const a = new Audio(u);
      a.volume = 0;
      const p = a.play();
      if (p && p.catch) p.catch(() => {});
      setTimeout(() => { try { a.pause(); } catch (e) {} }, 1500);
    }
  } catch (e) {}
}
document.addEventListener('pointerdown', unlockAudioChannels, { capture: true });
document.addEventListener('keydown', unlockAudioChannels, { capture: true });

/* 语音环境检测（家长中心诊断用） */
function speechEnv() {
  return {
    engine: '站内自带音频（2913 个发音文件 + 503 句整句；单词、整句与词块由 Piper + LibriTTS 声线合成，CC BY 4.0 已署名；字母音与拼读块为母语者录音）',
    wechat: /MicroMessenger/i.test(navigator.userAgent),
    online: navigator.onLine
  };
}
/* 微信内打开：词典发音通常可用，若仍无声提示改用系统浏览器 */
(function wechatTip() {
  if (!/MicroMessenger/i.test(navigator.userAgent)) return;
  document.body.insertAdjacentHTML('afterbegin', `
    <div class="wechat-tip" onclick="this.remove()">
      📱 本站发音以<b>站内自带音频</b>为主；若仍无声，请点右上角「···」→「在浏览器打开」
      <span style="float:right;cursor:pointer">✕</span>
    </div>`);
})();

/* ---------------- PWA：离线可用 + 装到主屏 ----------------
   ★ 2026-11-07 修「发音加载慢」第二层：注册不能再等 window.load。
     首页 async 的 emoji-svg.js 有 870KB，跨境下载会一直拖住 load 事件
     （线上实测 26 秒后 loadEventEnd 仍为 0），挂在 load 上的 SW 就永远不注册，
     音频缓存形同虚设 —— 每次点发音都重新跨境下载一遍。
     SW 注册不依赖 DOM / 图片 / 字体，app.js 一执行就开始即可。
   ★ 2026-11-08 修「刚进页面、一加载就弹回上一级别」：
     原来只要 controllerchange（新版 SW 接管）就 location.reload()。
     但 getsmart / pep / grammar 的「哪一册 → 哪个单元 → 第几步」是内存变量，
     一重载全丢，页面 init 又回到默认的选书页 / 课程表，用户正上着课就被踹回去。
     发版后每个页面的第一次打开都会中招一次，所以感觉「经常」。
     本站导航是网络优先、静态资源带不可变版本号：新版 SW 接管后，当前页面
     继续用已经加载完整的代码是安全的，下一次自然导航就吃到新版本，
     完全没必要打断用户。要立刻更新由用户自己点右下角「有新版本」提示。 */
if ('serviceWorker' in navigator && location.protocol === 'https:') {
  navigator.serviceWorker.register('sw.js').then(reg => {
    // 发现新版本时立即激活，让**新打开的页面**拿到最新代码（当前页面不刷新）
    if (reg.waiting) reg.waiting.postMessage('SKIP_WAITING');
    reg.addEventListener('updatefound', () => {
      const nw = reg.installing;
      if (nw) nw.addEventListener('statechange', () => { if (nw.state === 'installed' && navigator.serviceWorker.controller) nw.postMessage('SKIP_WAITING'); });
    });
  }).catch(() => {});
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    window.__swTookOver = true;   // 只留诊断标记：绝不自动刷新
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
  { id: 'words',   href: 'words.html',   emoji: '🏘️', label: '单词镇' },
  { id: 'pep',     href: 'pep.html',     emoji: '🏫', label: '人教课本' },
  { id: 'getsmart', href: 'getsmart.html', emoji: '🎓', label: 'Get Smart' },
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
/* 手机底栏只放 6 格（再多就挤成一排小图标了）。
     2026-11-08 调整：把「字母」换成「语法（句子工厂）」——
     字母岛是起步期的短周期内容，学完就过去了；语法要反复练，必须随手可进。
     字母岛没有消失，首页的岛屿卡片里一直有它的入口。 */
const TABS = [
    { id: 'index',   href: 'index.html',   emoji: '🏠', label: '首页' },
    { id: 'grammar', href: 'grammar.html', emoji: '🚂', label: '语法' },
    { id: 'words',   href: 'words.html',   emoji: '🏘️', label: '单词' },
    { id: 'pep',     href: 'pep.html',     emoji: '🏫', label: '课本' },
    { id: 'getsmart', href: 'getsmart.html', emoji: '🎓', label: '学堂' },
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
        <div style="margin-top:14px" data-avatar-target="profile">
          <div style="display:flex;align-items:baseline;gap:8px;flex-wrap:wrap">
            <b style="font-size:.95rem">🖼️ 换个头像</b>
            <small style="color:#5C6273">现在是 <span id="curAvatarEcho">${p.avatar}</span> · ⭐ 当前 <b>${Store.d.stars}</b> 颗</small>
          </div>
          <small style="display:block;color:#5C6273;margin:4px 0 8px">点一下就换好。带 🔒 的用星星解锁，解锁后永久有效。</small>
          <div class="avatar-grid">${AVATARS.map(a => avatarChipHtml(a, a === p.avatar)).join('')}</div>
        </div>
        <div style="display:flex;gap:8px;margin-top:12px">
          <button class="btn ghost" style="flex:1" onclick="toggleSoundQuick();this.textContent=Store.d.soundOn?'🔊 声音：开':'🔇 声音：关'">🔊 声音：${Store.d.soundOn ? '开' : '关'}</button>
          <button class="btn mint" style="flex:1" onclick="testSound()">🎵 测试声音</button>
        </div>
        <p style="font-size:.72rem;color:#5C6273;margin:8px 0 0;text-align:center">没听到声音？点「测试声音」检查设备音量键 🔊</p>
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
            <div class="avatar-grid" style="margin-top:8px" data-avatar-target="new">
              ${AVATARS.map(a => avatarChipHtml(a, false)).join('')}
            </div>
            <div class="theme-tabs" style="margin-top:10px">
              ${GRADES.map(g => `<button class="theme-tab" data-g="${g.id}" onclick="this.parentNode.querySelectorAll('.theme-tab').forEach(b=>b.classList.remove('on'));this.classList.add('on')"><span class="te">${g.emoji}</span>${g.name}</button>`).join('')}
            </div>
            <button class="btn grape" style="margin-top:12px" onclick="createProfile()">✅ 创建并切换</button>
          </div>
        </details>
        <details class="profile-tool">
          <summary>💾 备份与同步（换电脑、防丢失）</summary>
          <div style="margin-top:10px">
            <p style="font-size:.78rem;color:#5C6273;margin:0 0 10px;line-height:1.6">
              点「导出进度」会同时给你两样东西：<b>一段短码</b>（发微信/短信到另一台设备）和
              <b>一个备份文件</b>（下载存档防丢）。到了新设备，粘贴短码或选备份文件都能恢复。
            </p>
            <div style="display:flex;gap:8px;flex-wrap:wrap">
              <button class="btn mint" onclick="exportProfile()">📤 导出「${esc(p.name)}」的进度</button>
              <button class="btn orange" onclick="copySyncCode()">📋 复制短码</button>
            </div>
            <textarea id="syncCodeBox" readonly placeholder="点「导出进度」后，这里会出现一段短码。发到另一台设备粘贴即可同步！" style="width:100%;height:72px;border:3px dashed var(--mint,#4E9E59);border-radius:14px;padding:8px;font-size:.68rem;font-family:monospace;resize:vertical;margin-top:10px"></textarea>
            <div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap">
              <input type="file" id="importFile" accept=".json,.txt" style="display:none" onchange="importProfileFile(this)">
              <button class="btn grape" onclick="importFromSyncCode()">📥 粘贴短码恢复</button>
              <button class="btn orange" onclick="document.getElementById('importFile').click()">📂 选择备份文件恢复</button>
            </div>
            <p style="font-size:.7rem;color:#6B7280;margin:8px 0 0">🔒 进度只存在你自己的浏览器里，不上传任何服务器。短码经微信/短信发送时，传输安全由该渠道负责。恢复会新建一个档案，不会覆盖现有进度。</p>
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
/* 轻量确认框。原因：手机浏览器 / 内置 WebView 经常屏蔽 window.confirm，
   被屏蔽时它返回 undefined，用户看到的就是「点了没反应」——
   2026-11-08 用户反馈「有了星星想换个头像都不行」，一半就栽在这里。 */
function askConfirm(msg, onOk) {
  const old = document.getElementById('askMask'); if (old) old.remove();
  document.body.insertAdjacentHTML('beforeend', `
    <div class="modal-mask" id="askMask" onclick="if(event.target===this)this.remove()">
      <div class="modal card" style="max-width:340px">
        <p style="font-size:.95rem;line-height:1.8;margin:8px 0 18px">${msg}</p>
        <div style="display:flex;gap:10px">
          <button class="btn ghost" style="flex:1" onclick="document.getElementById('askMask').remove()">再想想</button>
          <button class="btn mint" style="flex:1" id="askOkBtn">确定</button>
        </div>
      </div>
    </div>`);
  document.getElementById('askOkBtn').onclick = function () {
    document.getElementById('askMask').remove();
    if (onOk) onOk();
  };
}
/* 输入框。同样原因：window.prompt 在手机 WebView 里常被屏蔽 = 点了没反应。 */
function askInput(msg, placeholder, onOk) {
  const old = document.getElementById('inputMask'); if (old) old.remove();
  document.body.insertAdjacentHTML('beforeend', `
    <div class="modal-mask" id="inputMask" onclick="if(event.target===this)this.remove()">
      <div class="modal card" style="max-width:380px">
        <p style="font-size:.92rem;line-height:1.8;margin:8px 0 12px">${msg}</p>
        <textarea id="inputBox" placeholder="${placeholder || ''}" style="width:100%;height:110px;border:3px solid var(--lemon,#FFD93D);border-radius:14px;padding:10px;font-size:.82rem;font-family:monospace;resize:vertical"></textarea>
        <div style="display:flex;gap:10px;margin-top:12px">
          <button class="btn ghost" style="flex:1" onclick="document.getElementById('inputMask').remove()">取消</button>
          <button class="btn mint" style="flex:1" id="inputOkBtn">确定</button>
        </div>
      </div>
    </div>`);
  document.getElementById('inputOkBtn').onclick = function () {
    const v = (document.getElementById('inputBox').value || '').trim();
    document.getElementById('inputMask').remove();
    if (v && onOk) onOk(v);
  };
}
function avatarTap(btn) {
  const a = btn.dataset.a;
  const grid = btn.closest('[data-avatar-target]');
  const mode = grid ? grid.getAttribute('data-avatar-target') : 'new';
  if (!btn.dataset.price) { applyAvatar(a, mode, btn); return; }
  const price = parseInt(btn.dataset.price, 10);
  if (Store.d.stars < price) {
    sfx.wrong();
    toast(`🎈 解锁 ${a} 需要 ${price} 颗星星，还差 ${price - Store.d.stars} 颗，继续加油！`);
    return;
  }
  askConfirm(`用 <b>${price}</b> 颗星星解锁头像 ${a} 吗？<br><small style="color:#6B7280">解锁后永久有效，马上就能用上。</small>`, function () {
    Store.d.stars -= price;
    Store.d.unlocked = Store.d.unlocked || {};
    Store.d.unlocked[a] = true;
    Store.save(); updateNavStats(); checkBadges();
    /* 两个网格里的同一个头像一起解锁，别只改点中的那个 */
    document.querySelectorAll('.avatar-chip').forEach(b => {
      if (b.dataset.a !== a) return;
      b.classList.remove('locked'); b.removeAttribute('data-price');
      const lk = b.querySelector('.lock-mark'); if (lk) lk.remove();
    });
    sfx.win(); confetti(); toast(`🎉 解锁成功！${a} 加入你的小伙伴啦`);
    applyAvatar(a, mode, btn);
  });
}
/* mode='profile' → 立刻换当前档案的头像；mode='new' → 只是新建档案时用哪个 */
function applyAvatar(a, mode, btn) {
  document.querySelectorAll('.avatar-chip').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  if (mode === 'profile') {
    Profiles.updateActive({ avatar: a });
    updateNavStats();
    const echo = document.getElementById('curAvatarEcho'); if (echo) echo.textContent = a;
    const rowPa = document.querySelector('.profile-row.on .pa'); if (rowPa) rowPa.textContent = a;
    toast(`🖼️ 头像换成 ${a} 啦`);
  } else {
    __pickedAvatar = a;
  }
}
function pickAvatar(btn) { applyAvatar(btn.dataset.a, 'new', btn); }   /* 兼容旧调用 */
function switchProfile(id) { Profiles.switchTo(id); location.reload(); }
function removeProfile(id) {
  const p = Profiles.meta.list.find(x => x.id === id);
  askConfirm(`确定删除档案 <b>${esc(p ? p.name : '')}</b> 吗？<br><small style="color:#6B7280">它的全部学习进度将无法恢复。</small>`, function () {
    if (Profiles.remove(id)) location.reload();
  });
}
function createProfile() {
  const name = (document.getElementById('newName').value || '').trim() || '小朋友';
  const avatar = __pickedAvatar || '🐤';
  const gbtn = document.querySelector('.profile-tool .theme-tab.on');
  Profiles.create(name, avatar, gbtn ? gbtn.dataset.g : '');
  toast('🎉 档案创建成功！'); setTimeout(() => location.reload(), 600);
}
function exportProfile() {
  const text = Profiles.exportActive();
  /* 一步两样：短码（发微信）+ 文件（下载存档）。2026-11-08 合并原两套入口。 */
  showSyncCode();                                    // 短码写进 syncCodeBox
  try {
    const blob = new Blob([text], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = '小鸟英语乐园-' + Profiles.active().name + '.json';
    a.click();
  } catch (e) {}
  toast('📤 短码已生成 + 备份文件已下载');
}
/* ---------------- 跨设备同步码 ----------------
   跨设备同步的最小可用闭环：
   - 本机生成「同步码」= 压缩+base64 的进度 JSON，短到能发微信/口述
   - 另一台设备粘贴同步码 → 解码 → 新建档案并载入进度
   不依赖后端、不依赖网络、不需要登录，孩子在奶奶家电脑上也能同步。

   编码：JSON → UTF-8 字节 → deflate-raw 压缩 → base64url（去 padding）
   解码：base64url → inflate-raw → UTF-8 → JSON
   压缩率：典型进度 JSON 2-3KB → 同步码 600-900 字符（微信能整段粘贴）。
   进一步压缩到 6 位数字需要服务器，纯静态做不到——这是诚实的物理约束。 */
function b64urlEncode(bytes) {
  let s = '';
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function b64urlDecode(str) {
  let s = str.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  const bin = atob(s);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}
async function compressText(text) {
  // CompressionStream('deflate-raw') 现代浏览器都支持
  if (typeof CompressionStream === 'undefined') return null;
  const cs = new CompressionStream('deflate-raw');
  const reader = cs.readable.getReader();
  const chunks = [];
  let failed = false;
  const pump = (async () => {
    try {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }
    } catch (e) { failed = true; }
  })();
  const w = cs.writable.getWriter();
  try {
    await w.write(new TextEncoder().encode(text));
    await w.close();
  } catch (e) { failed = true; }
  await pump;
  if (failed || !chunks.length) return null; // 老/异常路径，回退不压缩
  const total = chunks.reduce((n, c) => n + c.length, 0);
  const out = new Uint8Array(total);
  let off = 0;
  for (const c of chunks) { out.set(c, off); off += c.length; }
  return out;
}
async function decompressText(bytes) {
  if (typeof DecompressionStream === 'undefined') return null;
  const ds = new DecompressionStream('deflate-raw');
  const reader = ds.readable.getReader();
  const chunks = [];
  // ★ 关键：zlib 解压失败在 Node 下是 unhandledRejection，会把进程打死
  //   （浏览器里可能是 unhandledrejection）。必须手动 pump + 显式捕获。
  //   同时明确 inflate 失败要抛错（不能默认吞掉后返回半截文本）。
  let inflateFailed = false;
  const pump = (async () => {
    try {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }
    } catch (e) { inflateFailed = true; }
  })();
  const w = ds.writable.getWriter();
  try {
    await w.write(bytes);
    await w.close();
  } catch (e) { inflateFailed = true; }
  await pump;
  if (inflateFailed) throw new Error('inflate-fail');
  if (!chunks.length) throw new Error('empty-inflate');
  const total = chunks.reduce((n, c) => n + c.length, 0);
  const out = new Uint8Array(total);
  let off = 0;
  for (const c of chunks) { out.set(c, off); off += c.length; }
  return new TextDecoder().decode(out);
}
async function makeSyncCode() {
  const raw = Profiles.exportActive();
  const packed = await compressText(raw);
  if (!packed) return b64urlEncode(new TextEncoder().encode(raw)); // 老浏览器：不压缩
  return b64urlEncode(packed);
}
async function parseSyncCode(code) {
  const clean = String(code).trim().replace(/\s+/g, '');
  if (!clean) throw new Error('empty');
  const bytes = b64urlDecode(clean);
  // 先试解压；不行就当纯 base64 的 UTF-8
  let text = null;
  try { text = await decompressText(bytes); } catch (e) {}
  if (!text) {
    try { text = new TextDecoder().decode(bytes); } catch (e) {}
  }
  if (!text) throw new Error('decode-fail');
  const obj = JSON.parse(text);
  if (!obj || obj.app !== 'birdie-abc') throw new Error('bad-format');
  return obj;
}
async function showSyncCode() {
  try {
    const code = await makeSyncCode();
    const box = document.getElementById('syncCodeBox');
    if (box) { box.value = code; box.select(); }
    toast('📋 同步码已生成，发给孩子另一台设备就行');
  } catch (e) {
    toast('❌ 生成同步码失败，请重试');
  }
}
function copySyncCode() {
  const box = document.getElementById('syncCodeBox');
  if (!box || !box.value) { toast('先点「生成同步码」'); return; }
  box.select();
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(box.value).then(() => toast('📋 已复制到剪贴板'));
    } else {
      document.execCommand('copy');
      toast('📋 已复制到剪贴板');
    }
  } catch (e) {
    toast('📋 复制失败，请手动选中复制');
  }
}
function importFromSyncCode() {
  const box = document.getElementById('syncCodeBox');
  const go = code => {
    if (!code || !code.trim()) return;
    const t = code.trim();
    /* 自动识别：{ 开头 = 裸 JSON（备份文件内容），否则当压缩短码解析。
       2026-11-08 合并两套入口后，一个按钮搞定两种格式。 */
    if (t.startsWith('{')) {
      try {
        const p = Profiles.importActive(t);
        toast('📥 恢复成功！欢迎回来，' + p.name);
        setTimeout(() => location.reload(), 700);
      } catch (e) {
        toast('❌ 备份内容不对，请检查后重试');
      }
      return;
    }
    parseSyncCode(t).then(obj => {
      const p = Profiles.importActive(JSON.stringify(obj));
      toast('📥 同步成功！欢迎回来，' + p.name);
      setTimeout(() => location.reload(), 800);
    }).catch(() => {
      toast('❌ 同步码不对，请检查后重试（注意不要漏字符）');
    });
  };
  if (box && box.value && box.value.trim().length > 20) return go(box.value);
  askInput('把短码或备份内容粘贴到这里：', '短码是一长串字符，备份是 JSON 文本，整段粘进来', go);
}
function importProfileFile(input) {
  const f = input.files && input.files[0]; if (!f) return;
  const r = new FileReader();
  r.onload = () => doImport(String(r.result));
  r.readAsText(f, 'utf-8');
}
/* importProfileText 已删除（2026-11-08）：合并进 importFromSyncCode，自动识别码和 JSON。 */
function doImport(text) {
  try {
    const p = Profiles.importActive(text);
    toast('📥 恢复成功！欢迎回来，' + p.name);
    setTimeout(() => location.reload(), 700);
  } catch (e) {
    toast('❌ 备份码不对，请检查后重试');
  }
}

/* ================= 批量预热 + 首屏加载指示 =================
   手机首次进来音频要从网络下载，不等用户点就后台全部拉好，
   用户点哪个词哪个词秒出声。 */
function prewarmBatch(list, gap) {
  /* gap 参数保留兼容旧调用；节奏统一由 __audioPrefetch 管：
     原来的 setTimeout(i*200) 队列不可取消、无并发上限，换页后还在后台偷跑。 */
  __audioPrefetch.queue(list || [], '__batch');
}
/* ================= 首屏加载指示：等页面真正渲染完再撤 =================
   ★ 2026-11-07 白屏事故：app.js 并不是各页最后一个脚本，后面还有 sentence.js /
     pep-data.js / pep-points.js 等同步脚本和页面自己的 init。原来 app.js 一执行完
     就把全屏「加载中」撤掉，慢网下后续脚本还在下载时，用户看到的是
     「标题在上面、下面一大片空白」，以为卡死了。
   现在：① 占位直接写死在各页 HTML 里（HTML 一解析出来就有，不依赖任何脚本）
        ② 等 DOMContentLoaded（所有同步脚本 + 页面 init 跑完）再撤加载层和占位
        ③ 只有「资源确实加载失败」或「load 后内容区仍为空」才给重试，不按秒数猜 */
(function () {
  const bl = document.getElementById('bootLoader');
  const hide = () => {
    const ph = document.getElementById('bootPlaceholder');
    if (ph) { try { ph.remove(); } catch (e) {} }
    if (!bl) return;
    bl.style.opacity = '0'; bl.style.transition = 'opacity .3s';
    setTimeout(() => { try { bl.remove(); } catch (e) {} }, 300);
  };
  const showRetry = () => {
    let ph = document.getElementById('bootPlaceholder');
    if (!ph) {
      const app = document.getElementById('app');
      const host = app || document.querySelector('main');
      if (!host || (app && app.innerHTML.trim())) return;
      ph = document.createElement('div');
      ph.id = 'bootPlaceholder'; ph.className = 'card';
      ph.style.cssText = 'max-width:560px;margin:22px auto;text-align:center;padding:26px 18px';
      host.appendChild(ph);
    }
    ph.innerHTML = '<p style="color:#6B7280;font-size:.9rem">内容没能加载出来，检查网络后重试一下～</p>'
      + '<button class="btn" style="margin-top:10px" onclick="location.reload()">🔄 点这里重试</button>';
  };
  window.addEventListener('error', e => {
    const t = e.target;
    if (t && (t.tagName === 'SCRIPT' || t.tagName === 'LINK')) showRetry();
  }, true);
  window.addEventListener('load', () => {
    const app = document.getElementById('app');
    if (app && !app.innerHTML.trim()) showRetry();
  });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', hide, { once: true });
  else hide();
})();
