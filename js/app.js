/* ============================================================
   小鸟英语乐园 · 共享运行时
   进度存储(localStorage) / 语音点读 / 音效 / 星星奖励 / 徽章 / 打卡
   ============================================================ */
'use strict';

/* 构建标识：家长中心底部会显示它。
   用户报"还是有问题"时，第一句要问的就是"你手上是哪一版" ——
   Service Worker 缓存 + 离线包分发，两个都会造成版本混用（已经踩过两次）。 */
const BUILD = '2026-11-22.10';

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
   ⚠️ 发版时**必须同时改 version.json 里的 build**，只改 BUILD 不会提示。
   ⚠️ 发版时**必须同时升 js/app.js?v=**（门禁里有 git 基线自动断言）：
     静态资源是 cache-first，URL 不变就永远拿旧字节；version.json 却在变，
     于是「点刷新 → 还是旧 BUILD → 4 秒后又弹」无限循环（2026-11-13 事故）。
   ★ 三道防线，缺一不可：
     ① sessionStorage 幂等：同一版本在本标签页只提示一次，点过就不再弹；
     ② 点击时让 SW 把「当前页 HTML」缓存失效，reload 才能拿到引用新 ?v= 的新页面；
     ③ 发版升 ?v=，新 URL 不在旧缓存里，cache-first 自然回源拿新代码。 */
const UPDATE_CHECK_MS = 5 * 60 * 1000;
const UPD_DONE_KEY = 'birdie_upd_done';
let __updChecked = 0;
let __updShown = false;
function __updDone() { try { return sessionStorage.getItem(UPD_DONE_KEY) || ''; } catch (e) { return ''; } }
function __markUpdDone(v) { try { sessionStorage.setItem(UPD_DONE_KEY, String(v || '')); } catch (e) {} }
function __reloadAfterRefresh() {
  let fired = false;
  const go = () => { if (fired) return; fired = true; location.reload(); };
  try {
    const ctrl = navigator.serviceWorker && navigator.serviceWorker.controller;
    if (ctrl && typeof MessageChannel !== 'undefined') {
      const ch = new MessageChannel();
      ch.port1.onmessage = go;
      ctrl.postMessage({ t: 'FORCE_REFRESH', url: location.href }, [ch.port2]);
      setTimeout(go, 700);      // 旧版 SW 不认识这条消息，也要照常刷新，不能卡住
      return;
    }
  } catch (e) {}
  setTimeout(go, 120);
}
function __showUpdateBar(v) {
  /* 壳内不提示更新：APK 里的站点是随包分发的静态资产，没有 SW 热更新，
     这条浮条在壳里点了也刷不出新版本（只会把用户困在「刷新→还是旧版」）。
     换版本靠安装新 APK，见家长中心的版本卡。 */
  if (window.__isNativeShell) return;
  if (__updShown) return;
  /* ★ 2026-11-13：点过「刷新」后，即使 reload 回来仍因发版漏升 ?v=／网络失败
     而拿到旧 BUILD，也绝不再反复弹 —— 之前是「点一次 → 4 秒后又弹 → 无限循环」。
     sessionStorage 只作用于本标签页，关掉重开仍会重新提示，不会掩盖真有新版本；
     版本号变了（又一次发版）也会重新提示。 */
  if (__updDone() === String(v || '')) return;
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
      __markUpdDone(v);                 // 先落标记：reload 之后仍然生效
      try { bar.remove(); } catch (e) {}
      try {
        if (navigator.serviceWorker && navigator.serviceWorker.getRegistrations) {
          navigator.serviceWorker.getRegistrations().then(rs => rs.forEach(r => { try { r.update(); } catch (e) {} }));
        }
      } catch (e) {}
      __reloadAfterRefresh();
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
if (typeof document !== 'undefined' && !window.__isNativeShell) {
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
/* 2026-11-13.5：导航快照必须按档案隔离，否则哥哥切到妹妹后，
   sessionStorage 里的旧位置会把妹妹拉回哥哥的那一课。 */
const __navKey = tag => 'birdie_nav_' + tag + '_' +
  ((typeof Profiles !== 'undefined' && Profiles.meta && Profiles.meta.activeId) ? Profiles.meta.activeId : 'default');
window.__navSave = function (tag, data) {
  try { sessionStorage.setItem(__navKey(tag), JSON.stringify({ d: data, t: Date.now() })); } catch (e) {}
};
window.__navLoad = function (tag, maxAgeMs) {
  try {
    const o = JSON.parse(sessionStorage.getItem(__navKey(tag)) || 'null');
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
      /* 2026-11-13.5：隐私模式 / 禁用站点数据时 getItem 会抛 SecurityError，
         原来这行是裸调用，顶层中断 → 整站卡在加载层。 */
      let legacy = null;
      try { legacy = localStorage.getItem(LEGACY_KEY); } catch (e) { legacy = null; }
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
    /* 导入的 data 也按对象校验，避免把 null / 数组直接落盘 */
    const raw = (obj.data && typeof obj.data === 'object' && !Array.isArray(obj.data)) ? obj.data : {};
    try { localStorage.setItem(this.dataKey(p.id), JSON.stringify(raw)); } catch (e) {}
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
    /* 2026-11-13.5：只补 undefined 挡不住 null —— 存档里 daily:null 会让
       下面的 this.d.daily.date 直接抛 TypeError，整站白屏且家长中心也进不去。
       这里对所有结构化字段做类型兜底，坏数据一律回退到默认结构。 */
    for (const k of Object.keys(def)) {
      const want = def[k], got = this.d[k];
      if (want && typeof want === 'object' && !Array.isArray(want) &&
          (!got || typeof got !== 'object' || Array.isArray(got))) this.d[k] = want;
    }
    // 年级以档案为准
    this.d.grade = Profiles.active().grade || this.d.grade;
    if (this.d.daily.date !== todayStr()) this.d.daily = { date: todayStr(), tasks: { letter: false, words: false, game: false }, bonus: false, studySec: 0, break15: false, break30: false };
    /* ★ 2026-11-11.11（E1）这里原来写着：
         if (lettersSkip || __letterN === 0 || __letterN >= 26) tasks.letter = true;
       「没学过任何字母」被当成「已完成」—— 新档案一进门就是「字母 ✅」，
       而首页又据此宣布「2/3 已完成」。没数据 ≠ 做完了。
       现在不再改写任务状态，改成「不计入分母」：dailyTaskList() 只在孩子
       真的在学字母（1~25 个）时才算这一项，三任务全勤的奖励对谁都可达成。 */
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
/* 顶层最后一道防线：即使存档或存储本身出了意料之外的错，也不能让后面
   几百行运行时代码全部不执行（那样页面只会停在「加载中…」）。 */
try { Store.load(); } catch (e) { try { Store.d = Store.def(); } catch (e2) {} }

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

/* 「今日任务」里到底有哪几项：
   字母岛只在孩子正在学字母（学过 1~25 个、且没点「我会字母了」）时才算一项。
   其余情况这一项不存在 —— 而不是假装它已经完成（2026-11-11.11 / E1）。 */
function dailyLetterApplicable() {
  const n = Object.keys(Store.d.letters || {}).length;
  return !Store.d.lettersSkip && n > 0 && n < 26;
}
function dailyTaskList() {
  return dailyLetterApplicable() ? ['letter', 'words', 'game'] : ['words', 'game'];
}

function completeDailyTask(kind) { // 'letter' | 'words' | 'game'
  if (Store.d.daily.tasks[kind]) return;
  Store.d.daily.tasks[kind] = true;
  const t = dailyTaskList().map(k => !!Store.d.daily.tasks[k]);
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
        <p style="color:#3F4658;font-size:.95rem;line-height:1.9;margin:8px 0 16px">${msg}</p>
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
  /* 2026-11-13.5：语法生成器曾把词对象传进来，写出
     Store.d.words["[object Object]"] 垃圾键，虚增掌握数与徽章。 */
  if (!word || typeof word !== 'string') return;
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
   一次合成的同源静态文件：一个说话人贯穿 2912 个单词 / 拼读块 / 字母名
   与 934 句整句。模型权重 MIT，训练数据 LibriTTS (OpenSLR 60) 为
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
/* ★ 2026-11-15.4 v6：换声线 libritts(381) → **en_US-ljspeech-medium**。
   原因：LibriTTS 训练于 LibriVox 志愿者录音，房间底噪被模型学进去（开口前 -48dB），
   换码率治不好。曾试 lessac（-85dB 最干净），但它是 Blizzard 2013 研究许可
   （"exclusively for Research Purposes only"、禁止 distribute），不能公开发布，
   已作废。最终选 ljspeech：**公有领域（LJSpeech）**，句内底噪 -70.3dB 优于原 -65.6dB。
   音素块仍是母语者录音，WEAK_VER 不动（0.2s schwa，音色差异不可辨）。 */
const AUDIO_VER = 6;
/* 2026-11-15.5：个别词的发音单独重修过（pe 原来只读 "P"；with 孤立发音只有 0.174s）。
   用 &f=1 只让这几个文件失效——不动 AUDIO_VER，否则 2912 个词全部重下。 */
/* 重做过、需要让老缓存失效的单词音频。加进来只会让这几个文件的 URL 变形，
   其余 3000 多个词一个字节都不重下。
   pe / with：早期版本尾音含混，重录过。
   hi：裸词被 G2P 读成字母 I（ASR 实测 "I."），改用 "Hi!" 合成后才读 /haɪ/。
   yes：结尾 /s/ 齿音过锐（6–8kHz 占 37%），做过 -3.5dB 柔化 + 10kHz 低通。 */
const AUDIO_FIX = new Set(['pe', 'with', 'hi', 'yes']);
const __audioFixQS = k => (AUDIO_FIX.has(k) ? '&f=1' : '');
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
/* 全量音频清单：js/audio-list.js 登记包内全部音频 slug（2903 条）。
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
   没有连读和句末语调，后者断网无声。现在把全站 830 句固定例句用同一个
   说话人一次合成整句，落在 audio/sentences/，零网络、离线可读。
   合规：合成引擎 Piper(MIT)，语音模型 en_US-libritts-high(权重 MIT)，
   训练数据 LibriTTS/OpenSLR 60 为 CC BY 4.0（已按许可署名，见 NOTICES）；
   输出音频可自由分发；不再新增任何抓取来的词典音频。
   ★ SENTENCE_VER 独立于 AUDIO_VER：重做整句音频只升它。
     若动 AUDIO_VER，已缓存的单词 mp3 会全部作废（要重下十来 MB）。
   ★ 必须放独立目录：有 slug 与单词音频同名（clap_your_hands），
     混进 audio/ 会互相覆盖。 */
/* 2026-11-13.9：只新增 51 条、既有 502 条一个字节没动，故**不升版本**——
   升了会让每个老用户把 6MB 整句全部重下；新 slug 本来没有缓存条目，
   AUDIO_CACHE 按完整 URL 精确匹配，自然只下新增的这 51 条。
   2026-11-14.19 v6：全量 934 条 64kbps → 128kbps 重编，修「长句子轻微啫啫/电流声」。
   根因是 64k 的 4-10kHz 编解码误差余量仅 ~10dB（量化噪声骑在摩擦音与高次谐波上）；
   128k 后余量 ~26dB（实测 +14~16dB）。934 条字节全变，必须升版本——老用户按需
   重下（预取每页最多 24 条、低优先级，不是一次性全量 20MB）。词音频 96k 不动，
   AUDIO_VER 不升；本条只影响 audio/sentences/。
   ★ 2026-11-15.4 v8：换声线 libritts → ljspeech-medium（公有领域）。934 条全部重新
   合成，句内底噪 -65.6 → -70.3dB。ljspeech 无前导静音（第 0 采样即语音），
   故不裁头、改为补 15ms 静音后 8ms 淡入，避免起首辅音爆音或被削。 */
const SENTENCE_VER = 8;
const SENTENCE_AUDIO = new Set([
  "a_bad_cat_a_sad_cat", "a_ball", "a_bee_can_fly_up_high", "a_bee_is_in_the_tree", "a_bee_looks_for_sweet_food_in_a_flower_the_sweet_food_is_deep_inside_the_flower", "a_better_question_is_a_better_idea",
  "a_better_question_is_a_start", "a_big_cat", "a_big_day_for_my_duck_and_pig", "a_big_dog", "a_big_drum", "a_big_fish_a_big_fish",
  "a_big_fish_can_sing", "a_big_fish_is_in_the_shop", "a_big_mouse_run", "a_big_panda_can_eat_for_hours_and_hours_it_needs_a_lot_of_food", "a_big_pit", "a_big_ship",
  "a_big_ship_has_much_room_inside_too_that_is_why_the_ship_stays_up_on_the_water", "a_big_sneeze", "a_big_storm_was_on_us", "a_bird_has_a_long_wing", "a_bird_has_a_long_wing_it_is_long_and_thin", "a_bird_has_long_wings_they_are_long_and_thin",
  "a_bird_in_a_nest", "a_bird_in_the_park", "a_bird_is_on_the_car", "a_bird_is_on_the_nest", "a_bird_sings_in_the_tall_green_tree_a_bus_goes_by_and_it_makes_a_sound", "a_bird_sits_on_the_fence_and_sings_in_the_morning",
  "a_black_cat", "a_black_cat_is_my_pal", "a_black_hat", "a_board_is_on_the_wall", "a_board_is_on_the_wall_ming_writes_on_it_with_a_pen", "a_boat_is_on_the_sea",
  "a_boat_is_on_the_sea_the_sea_is_blue", "a_boat_on_the_sea", "a_boat_on_the_sea_the_wind_brings_it_home", "a_boat_on_the_sea_the_wind_moves_it_out_and_back", "a_book_is_in_my_bag_too", "a_book_is_on_the_desk",
  "a_book_is_on_the_desk_it_is_an_old_book", "a_book_is_on_the_desk_it_is_an_old_thick_book", "a_bowl_of_rice_looks_simple_but_behind_it_lies_a_whole_year_of_careful_repeated_work", "a_bowl_of_rice_tastes_good_with_almost_everything", "a_bright_star_shines_over_the_far_dark_hills", "a_brown_cow_looks_over_the_fence_doudou_bounds_to_the_gate",
  "a_bug_can_move_fast_or_slow", "a_bug_flies_by", "a_bug_flies_by_the_frog_sees_it", "a_bug_in_a_mug", "a_bug_is_on_a_leaf", "a_bug_is_on_a_leaf_it_is_very_small",
  "a_bug_is_on_a_leaf_it_is_very_small_but_ming_can_see_it", "a_bug_is_on_a_leaf_look_ming_says_it_is_very_small", "a_bun_a_sun_two_words", "a_bun_is_not_rice", "a_cake_for_grandma", "a_cake_for_grandma_the_second_one_is_good",
  "a_cake_for_grandma_the_second_one_was_good", "a_cake_on_a_plate", "a_cake_rises_in_the_heat_that_is_why_we_use_the_hot_place", "a_cake_rises_in_the_heat_that_is_why_we_use_the_oven", "a_cake_rises_with_heat", "a_cake_rises_with_heat_that_is_why_we_use_the_hot_place",
  "a_cap_a_cape_one_e_makes_a_new_word", "a_cap_is_in_the_bag", "a_car_is_not_a_bird_they_are_different_things_but_both_have_r", "a_car_is_on_the_farm", "a_car_some_corn_a_curl_three_sounds_here_today_ar_or_ur", "a_cat_a_cap_two_words",
  "a_cat_a_hat", "a_cat_is_here_too", "a_cat_is_here_too_it_comes_in_slowly", "a_cat_is_here_too_the_cat_comes_in_slowly", "a_cat_is_in_my_hat", "a_cat_is_in_the_book",
  "a_cheetah_can_run_fast", "a_chick_can_see_the_chip", "a_chick_grows_from_egg_to_hen", "a_chick_grows_inside_an_egg", "a_chick_has_wings_it_can_sing", "a_chick_is_in_an_egg",
  "a_chick_is_on_a_mat", "a_chick_is_on_the_duck", "a_clean_dish_is_good", "a_clear_question_is_half_of_an_answer", "a_clear_question_is_half_of_an_answer_it_was_a_good_thing_to_notice", "a_clock_says_it_is_early",
  "a_cloud_drops_rain_on_his_nose_he_shakes_it_off_with_a_growl", "a_cloud_hides_the_moon_for_a_while_then_it_comes_out_again", "a_cloud_is_made_of_many_small_drops_each_drop_is_only_a_little_water", "a_coat_is_in_the_boat", "a_coat_is_long_a_cot_is_small", "a_cow_is_on_the_farm",
  "a_cow_is_on_the_farm_it_is_the_biggest_animal_here", "a_cow_is_on_the_farm_it_is_the_biggest_animal_here_so_ming_looks_up_at_it", "a_cow_on_the_farm", "a_cow_on_the_farm_he_will_come_back", "a_cow_on_the_farm_he_will_come_back_because_the_cow_is_his_friend_now", "a_crab_a_crab",
  "a_crab_can_snap", "a_crab_stops_by_the_log_and_blinks", "a_crow_was_thirsty", "a_cup_can_be_a_tool", "a_cup_can_be_a_tool_any_cup_will_do", "a_cup_can_be_a_tool_it_does_not_need_to_be_new",
  "a_cup_is_in_the_box_too", "a_cut_a_cute_cat_the_e_changes_the_sound", "a_cute_cube", "a_dark_storm_is_far_off", "a_dish_on_the_ship", "a_dog_has_a_tail",
  "a_dog_has_a_tail_the_dog_is_big", "a_dog_has_a_tail_the_dog_is_big_and_brown", "a_dog_looks_at_the_duck", "a_drop_hits_the_big_drum", "a_drummer_sits_in_the_middle_of_each_boat_and_beats_a_steady_loud_rhythm", "a_duck",
  "a_duck_and_a_pig", "a_duck_can_smell_it", "a_duck_in_a_sack_of_socks", "a_duck_in_a_sock", "a_duck_in_the_shop_says_a_man", "a_duck_is_in_the_shop",
  "a_duck_is_on_a_rock", "a_duck_is_on_the_path", "a_duck_is_on_the_rock", "a_duck_on_the_lake_looks_at_the_moon_that_is_down_in_the_water_the_duck_thinks_the_moon_is_a_big_ball", "a_duck_on_the_lake_looks_at_the_moon_the_duck_thinks_the_moon_is_a_big_ball", "a_farmer_works_on_the_farm",
  "a_farmer_works_on_the_farm_the_farm_is_his_work", "a_farmer_works_on_the_farm_the_farm_is_his_work_and_he_likes_it", "a_fast_page_needs_doing_again_that_takes_more_time", "a_fat_cat_sat_on_a_mat", "a_few_nights_later_a_thin_crescent_appears_low_in_the_west_after_sunset", "a_firefighter_can_put_out_fires",
  "a_fish_can_sing", "a_fish_can_wish", "a_fish_in_a_black_sock", "a_fish_in_a_dish", "a_fish_swims_by_it_is_quick", "a_fixed_order_turns_guessing_into_counting_it_was_a_good_thing_to_notice",
  "a_flower_is_on_the_stem", "a_fox_is_in_the_box", "a_frog_can_jump", "a_frog_has_eggs_in_a_pond", "a_frog_is_in_my_hand", "a_frog_is_in_the_grass",
  "a_frog_is_not_a_fish_it_can_hop_on_land", "a_frog_is_on_a_stone", "a_frog_sits_on_a_wet_log_in_the_sun", "a_game_for_the_family", "a_game_for_the_family_they_will_play_it_again_next_wet_day", "a_giant_panda_is_black_and_white_and_it_lives_in_the_mountains_of_china",
  "a_gift_is_in_the_basket", "a_girl_has_a_bag_it_is_red", "a_girl_in_a_red_skirt", "a_girl_next_to_me_has_a_book_she_reads_it_fast", "a_goat_in_a_coat", "a_goat_is_on_the_boat",
  "a_goat_is_on_the_hill", "a_goat_is_on_the_hill_the_wind_is_cold", "a_goat_on_the_road", "a_good_answer_starts_small", "a_good_answer_starts_small_he_found_one_word_first", "a_good_bottom_makes_a_tall_top",
  "a_good_night_for_the_family", "a_good_night_for_the_family_he_keeps_the_last_mooncake", "a_good_night_in_the_town", "a_good_night_in_the_town_ming_does_not_want_it_to_end", "a_good_plan_can_change", "a_good_question_is_a_useful_tool_it_gets_you_all_the_words_that_you_really_need",
  "a_good_rope_is_strong", "a_good_rope_is_strong_a_broken_one_is_not", "a_good_rope_is_strong_mend_it_before_it_breaks", "a_green_frog_sits_on_a_stone", "a_green_hat", "a_green_seed",
  "a_habit_every_day", "a_habit_is_a_friend", "a_habit_is_doing_it_every_day", "a_habit_is_doing_it_every_day_ming_wants_one_of_his_own", "a_habit_is_something_you_do_every_day_ming_wants_one_of_his_own", "a_hat_is_in_the_box",
  "a_hat_is_on_mimi", "a_hen_is_in_the_pen", "a_hen_is_not_asleep", "a_hen_is_on_a_mat", "a_hill_is_on_the_map", "a_hole_in_the_rope",
  "a_hole_in_the_rope_it_made_the_rope_not_strong", "a_horse_and_a_cart", "a_horse_and_a_hen", "a_horse_is_in_the_car", "a_horse_is_on_the_farm", "a_hot_fox_in_the_box",
  "a_hot_pot", "a_house_and_a_cow", "a_house_and_a_cow_now_find_two_more", "a_house_and_a_cow_now_find_two_more_that_have_ow", "a_house_and_a_cow_now_find_two_more_words_that_have_ow", "a_house_is_not_a_cow_they_are_different_things_but_the_sound_is_the_same",
  "a_house_is_on_the_hill", "a_house_is_on_the_hill_it_is_not_big", "a_house_is_on_the_hill_it_is_not_big_but_it_is_warm", "a_house_with_a_window", "a_house_with_a_window_at_night_the_window_is_dark", "a_hug_for_the_bug",
  "a_huge_stone_in_the_road", "a_journey_of_small_steps", "a_king_has_a_ring", "a_kit_a_kite_the_e_at_the_end_is_not_read", "a_kite", "a_kite_by_the_lake",
  "a_kite_by_the_lake_they_stay_there_a_long_time_and_ming_does_not_let_go", "a_kite_is_by_the_lake", "a_kite_is_by_the_lake_the_lake_is_big", "a_kite_is_by_the_lake_the_lake_is_calm", "a_knife_and_a_wheel", "a_knife_and_a_wheel_are_on_the_table_one_cuts_and_one_turns",
  "a_knife_and_a_wheel_both_are_on_the_table", "a_knife_and_a_wheel_ming_pushes_the_cart_to_the_gate", "a_lamb_is_on_the_grass", "a_lamp_a_big_lamp", "a_leaf_comes_out", "a_leaf_is_up_too",
  "a_leaf_is_up_too_it_is_green_and_turns_to_the_sun", "a_leaf_is_up_too_the_leaf_is_green", "a_letter_from_the_farm", "a_letter_from_the_farm_it_came_a_long_way", "a_lid_is_on_the_pot", "a_line_is_faster_than_a_crowd",
  "a_little_cat_jumps_out_of_the_hat_the_cat_was_in_the_hat_all_the_time", "a_little_chick_has_it", "a_little_chick_is_here", "a_little_family_is_in_the_little_house_there_is_a_dad_a_mom_and_a_baby", "a_little_fish_comes_out_it_can_swim", "a_little_mouse_is_here",
  "a_little_mouse_is_here_it_is_in_the_kitchen", "a_little_mouse_is_here_it_stands_in_the_kitchen_near_the_bread", "a_little_wind_comes_down_the_street_ming_jumps_and_catches_the_hat_on_top_with_one_hand", "a_little_wind_comes_down_the_street_ming_jumps_and_catches_the_top_hat_with_one_hand", "a_long_book_is_not_just_a_long_list_of_hard_words_it_is_a_few_big_ideas_joined_by_smaller_ones", "a_long_long_road",
  "a_long_long_song", "a_long_song_for_us", "a_long_train_ride", "a_long_train_ride_mom_gives_him_a_cake", "a_long_train_ride_mom_gives_him_a_cake_when_he_is_hungry", "a_long_way_starts_with_small_steps",
  "a_loud_shout_at_night", "a_loud_shout_at_night_it_is_only_the_wind_at_the_window", "a_loud_shout_at_night_it_was_only_the_wind", "a_loud_shout_at_night_it_was_only_the_wind_that_pushed_the_window", "a_loud_sound_is_outside", "a_loud_sound_is_outside_it_comes_again",
  "a_loud_sound_is_outside_it_comes_again_and_ming_sits_up", "a_mad_dog_a_made_cake_two_words", "a_man_picks_it_up_he_gives_it_back", "a_man_picks_it_up_he_gives_it_back_before_the_wind_takes_it_again", "a_man_puts_his_hat_on_a_box", "a_map_helps_when_the_town_is_new_to_you_it_helps_you_find_a_place_you_do_not_know",
  "a_map_is_a_good_tool_to_have_with_it_you_can_find_any_place_in_a_new_town", "a_map_is_in_the_bag", "a_map_with_a_mark", "a_map_works_best_when_we_can_read_it_now_they_could_see_why", "a_market_is_at_the_corner", "a_market_is_at_the_corner_it_is_near_ming_s_home",
  "a_market_is_at_the_corner_it_is_near_ming_s_home_so_he_goes_there_often", "a_month_is_about_one_cycle_of_the_moon", "a_mooncake_is_for_ming", "a_mooncake_is_for_ming_it_is_round_like_the_moon", "a_mooncake_is_for_ming_it_is_round_like_the_moon_and_it_smells_sweet", "a_moth_is_in_the_bath",
  "a_name_is_on_the_plate", "a_name_is_on_the_plate_the_name_is_in_black", "a_name_on_the_plate", "a_name_on_the_plate_it_was_there_all_the_time", "a_name_on_the_plate_it_was_there_from_the_start", "a_nap_on_my_lap",
  "a_nest_on_a_branch", "a_newborn_cub_is_tiny_it_is_pink_blind_and_has_no_fur", "a_not_a_note_a_hop_a_hope", "a_note_in_a_book", "a_note_in_a_book_it_has_been_there_a_long_time", "a_note_in_a_book_it_was_there_a_long_time",
  "a_note_is_in_the_book", "a_note_is_in_the_book_it_falls_out", "a_nut_for_the_ant", "a_pan_a_pen_two_words", "a_panda_eats_bamboo_all_day_long_bamboo_is_a_tall_grass", "a_panda_is_black_and_white_it_has_big_black_spots",
  "a_parrot_can_talk", "a_pen_a_pin_two_words", "a_pen_is_in_my_bag", "a_pen_is_in_the_bag", "a_pen_is_not_a_pin", "a_penguin_can_t_fly_but_it_can_swim",
  "a_photo_at_the_station", "a_photo_says_a_lot", "a_picture_for_cousin", "a_picture_for_cousin_far_away", "a_picture_for_his_cousin_far_away", "a_picture_for_the_teacher",
  "a_picture_for_the_teacher_it_took_him_all_morning", "a_plate_is_on_the_table", "a_plate_is_on_the_table_it_is_a_small_plate", "a_plate_is_on_the_table_it_is_a_small_white_plate", "a_pool_is_deep_a_pull_is_quick", "a_problem_has_two_sides",
  "a_problem_has_two_sides_ming_sees_that_at_school_today", "a_problem_has_two_sides_ming_sees_that_at_school_today_when_two_hands_want_one_board", "a_problem_has_two_sides_ming_sees_that_at_school_today_when_two_people_want_one_board", "a_problem_is_not_so_hard_now", "a_problem_is_not_so_hard_now_it_was_one_board_and_two_people", "a_problem_is_not_so_hard_now_it_was_one_board_and_two_people_and_it_had_a_simple_answer",
  "a_promise_to_oneself_is_strong", "a_question_is_on_the_board", "a_question_is_on_the_board_the_teacher_put_it_there", "a_question_is_on_the_board_the_teacher_put_it_there_before_the_class_came_in", "a_question_on_the_board", "a_quick_look_and_a_careful_look_are_not_the_same",
  "a_quick_look_and_a_careful_look_are_not_the_same_it_was_a_good_thing_to_notice", "a_quiet_museum", "a_rat_a_rat", "a_rat_ran_in", "a_real_question_is_not_just_a_statement_with_a_question_mark_at_the_end", "a_red_cap",
  "a_red_flag", "a_red_flag_is_here_too", "a_red_hat", "a_red_packet_on_my_bed_it_is_for_me", "a_ring_a_gold_ring", "a_rope_is_here",
  "a_rope_is_here_it_is_thick", "a_rope_is_here_it_is_thick_and_long", "a_rope_on_a_nose", "a_rose_at_the_gate", "a_rose_at_the_gate_it_was_the_best_one_there", "a_rose_is_at_the_gate",
  "a_rose_is_at_the_gate_ming_sees_it_first", "a_sad_cat", "a_scarf_for_winter", "a_scarf_for_winter_it_is_long_and_it_is_warm", "a_scientist_has_a_question", "a_scientist_has_a_question_she_wants_to_know_why_a_seed_grows",
  "a_seed_is_in_the_pot", "a_seed_is_in_the_pot_the_pot_is_in_the_sun", "a_seed_is_small_but_a_plant_can_grow_from_it_first_the_seed_must_get_to_a_new_place", "a_seed_needs_rain", "a_seed_needs_rain_it_needs_the_sun_too", "a_seed_sleeps_in_the_wet_mud",
  "a_seed_so_small", "a_shark_is_in_the_sea_too", "a_shark_is_in_the_sea_too_it_comes_from_the_deep", "a_shark_is_in_the_sea_too_it_comes_from_the_deep_when_it_is_hungry", "a_sheep_a_ship_two_words", "a_sheep_in_a_tree",
  "a_small_bird_makes_a_small_high_sound_a_big_drum_makes_a_deep_and_loud_sound", "a_small_boat_waits_by_the_green_grass", "a_small_cat", "a_small_change_a_big_day", "a_small_change_can_do_much", "a_small_dog",
  "a_small_home_a_big_cake_and_a_fine_day_for_us", "a_small_mark_shows_where_you_are_you_can_look_at_it_before_you_walk", "a_small_mouse", "a_small_stem_is_here", "a_snail_is_slow", "a_snail_moves_very_slowly",
  "a_snail_was_on_the_path", "a_snake_at_the_gate", "a_sock_is_here_it_is_soft_and_warm", "a_spot_was_on_the_wall", "a_star_in_a_jar", "a_star_on_the_card",
  "a_stem_comes_up", "a_stem_comes_up_it_is_small_and_green", "a_stem_comes_up_that_looks_for_the_sun_small_leaves_open_up_over_the_ground", "a_stem_comes_up_to_look_for_the_sun_small_leaves_open_up_over_the_ground", "a_stone_has_no_room_inside_it_is_not_light_so_it_goes_down", "a_stone_is_small_but_it_goes_down_a_board_is_light_and_it_stays_up",
  "a_storm_is_on_the_way", "a_story_needs_all_its_parts", "a_story_needs_its_order_to_make_sense", "a_story_needs_its_order_to_make_sense_it_made_more_sense_now", "a_story_needs_its_order_to_make_sense_now_they_could_see_why", "a_story_needs_its_order_to_make_sense_we_say_the_words_again_boat_and_snail",
  "a_story_needs_its_order_to_make_sense_we_say_the_words_again_chain_and_grandpa", "a_story_needs_its_order_to_make_sense_we_say_the_words_again_grass_and_green", "a_story_needs_its_order_to_make_sense_we_say_the_words_again_whale_and_whale", "a_story_needs_its_order_to_make_sense_we_say_the_words_again_zoo_and_chain", "a_stream_runs_under_the_bridge_all_day", "a_string_is_on_the_step",
  "a_swan_is_on_the_water", "a_thick_book_a_thin_book", "a_thing_is_in_the_sink", "a_train_a_train_on_the_track", "a_train_can_go_very_fast_it_goes_faster_than_a_car_on_the_road", "a_train_can_take_many_people_at_one_time_because_it_has_many_cars_it_can_take_more_people_than_a_car",
  "a_train_can_take_many_people_at_one_time_because_it_has_many_cars_it_can_take_more_than_a_car", "a_train_can_take_many_people_at_one_time_it_can_take_more_than_a_car", "a_train_comes_it_is_not_our_train", "a_train_has_many_cars_that_go_together_all_the_cars_are_joined_from_front_to_back", "a_train_is_long_and_very_strong_it_runs_on_two_long_lines_all_day", "a_tree",
  "a_tree_from_a_seed", "a_tree_is_tall", "a_trip_to_the_pond", "a_turtle_is_in_the_sea", "a_turtle_is_in_the_sea_the_sea_is_deep", "a_turtle_is_in_the_sea_the_sea_is_deep_and_the_water_is_blue",
  "a_van_a_red_van", "a_very_old_pot_is_here", "a_very_old_pot_is_here_it_has_a_broken_side", "a_very_old_pot_is_here_one_side_is_broken", "a_week_before_the_festival_lili_promised_grandma_a_mooncake_made_entirely_by_herself_at_home", "a_week_on_the_farm",
  "a_week_on_the_farm_every_day_is_different", "a_white_hat", "a_whole_sentence", "a_whole_sentence_has_words", "a_whole_sentence_has_words_count_them", "a_whole_sentence_has_words_you_can_count_them",
  "a_whole_sentence_is_a_whole_thought", "a_whole_sentence_is_a_whole_thought_keep_the_words_together", "a_whole_sentence_now_listen_to_the_pace", "a_whole_sentence_now_listen_to_the_pace_of_the_words", "a_whole_sentence_now_listen_to_the_pace_that_the_words_make", "a_wig_is_in_the_pit",
  "a_wig_on_the_pig", "a_wish_a_big_wish", "a_word_changes_a_little_inside_a_sentence", "a_written_word_is_there", "a_yellow_leaf_starts_to_fall_it_falls_down_by_the_trees_that_stand_so_tall", "about_two_weeks_after_new_moon_we_see_a_full_round_disc_all_night",
  "adults_pay_the_bill", "after_a_chapter_tell_someone_the_story_in_three_sentences_first_then_finally", "after_a_week_it_is_easy_he_does_not_have_to_think_about_it", "after_a_while_it_is_different", "after_a_while_it_is_different_he_finds_that_he_can_read_a_whole_page", "after_a_while_it_is_different_now_he_can_read_a_whole_page",
  "after_a_while_ming_looks_back", "after_a_while_ming_looks_back_the_house_is_small_now", "after_about_a_month_the_shoots_are_tall_enough_to_move_this_is_called_transplanting", "after_dinner_lili_looks_up_at_the_dark_dark_sky", "after_dinner_the_red_packets_come_out_each_one_has_a_few_crisp_notes", "after_dinner_we_sit_by_the_window_and_count_the_stars_again",
  "after_dinner_we_sit_still_and_watch_the_stars_turn", "after_one_month_your_drawings_will_tell_the_whole_story_by_themselves", "after_the_harvest_the_village_holds_a_shared_meal_and_every_household_brings_one_dish", "afterwards_we_sweep_the_stage_and_fold_the_costumes_into_a_cardboard_box", "all_is_quiet", "all_is_quiet_even_the_dog_is_quiet",
  "all_is_quiet_even_the_dog_is_quiet_tonight", "all_our_family_sits_down_around_one_round_table_in_the_yard", "all_sounds_big_and_small_work_in_this_way_something_moves_and_you_hear_it", "all_the_children_can_sing", "all_the_way_home", "all_the_way_home_the_road_feels_long",
  "all_the_way_home_the_road_was_long", "all_together_tonight", "all_together_tonight_grandma_sits_by_ming", "all_together_tonight_grandma_sits_by_ming_and_she_holds_his_hand", "always_answer_in_a_full_sentence_at_first_then_you_may_shorten_it_much_later", "an_adult_panda_eats_bamboo_for_more_than_twelve_hours_a_day",
  "an_apple_and_an_egg_please", "an_elephant_can_carry_things", "an_insect_is_a_tiny_animal", "and_a_fish_has_the_ring", "and_i_am_wet", "ants_are_at_home_in_the_ground",
  "ants_do_not_stop_when_they_work_they_are_small_but_their_work_is_big", "ants_stay_under_the_ground_they_dig_little_rooms_down_there", "are_there_any_peppers_no_there_aren_t_any_peppers", "are_they_making_a_cake_no_they_aren_t", "are_they_playing_hide_and_seek_yes_they_are", "are_you_going_to_visit_your_grandma",
  "are_you_happy_yes_i_am", "are_you_ready_for_class", "as_the_moon_travels_around_the_earth_the_lit_part_we_can_see_grows_and_shrinks", "asking_again_is_not_the_same_as_not_listening", "asking_again_is_not_the_same_as_not_listening_it_was_a_good_lesson", "asking_is_faster_than_looking_alone_it_made_more_sense_now",
  "at_about_six_months_the_cub_starts_to_chew_bamboo_shoots", "at_dinner_grandpa_says_the_garden_is_our_little_farm", "at_first_it_is_not_clear_he_can_only_say_a_few_words", "at_first_it_was_not_clear", "at_first_ming_forgets_his_lines_and_whispers_them_to_lili_behind_the_curtain", "at_first_nothing_seems_different",
  "at_first_nothing_seems_different_the_box_has_only_three_notes", "at_first_nothing_seems_different_the_box_has_only_three_notes_so_it_looks_empty", "at_first_the_two_look_the_same_before_they_went_on_they_wrote_down_jug_king_and_kite", "at_first_the_two_look_the_same_they_looked_more_than_once_they_wrote_three_words_on_the_board_village_village_and_phone", "at_first_the_two_look_the_same_they_made_a_list_green_ham_and_hat", "at_first_the_two_look_the_same_they_made_a_list_ham_hat_and_hen",
  "at_first_the_two_look_the_same_they_made_a_list_hole_home_and_jam", "at_first_the_two_look_the_same_they_wrote_down_grandma_grandpa_and_grapes", "at_first_the_two_look_the_same_they_wrote_down_three_words_doctor_family_and_farmer", "at_first_the_two_look_the_same_they_wrote_down_three_words_horse_jam_and_jug", "at_first_the_two_look_the_same_they_wrote_down_three_words_purse_shark_and_flower", "at_first_the_two_look_the_same_they_wrote_three_words_on_the_board_knee_king_and_kite",
  "at_first_the_two_look_the_same_they_wrote_three_words_on_the_board_leaf_leg_and_letter", "at_first_the_two_look_the_same_three_words_mattered_that_day_practice_problem_and_promise", "at_first_the_two_look_the_same_we_say_bug_arm_and_bat", "at_first_the_two_look_the_same_we_say_cup_dad_and_dog", "at_first_the_two_look_the_same_we_say_egg_fan_and_fish", "at_first_the_two_look_the_same_we_say_green_ham_and_hat_again",
  "at_first_the_two_look_the_same_we_say_rain_room_and_root_again", "at_first_the_two_look_the_same_we_say_the_words_friend_grandma_and_grandpa", "at_first_the_two_look_the_same_we_say_the_words_ship_moth_and_path", "at_home_grandpa_tells_us_the_same_tale_again", "at_home_we_say_that_was_a_good_day", "at_home_we_wash_the_grains_add_water_and_let_them_steam_until_each_one_is_soft_and_separate",
  "at_home_we_wrap_dumplings_again_and_this_time_ming_s_do_not_leak", "at_last_he_lifted_the_bike_upright_rang_the_small_bell_and_asked_ming_to_try_it", "at_last_ming_finds_it_out", "at_last_ming_finds_it_out_nothing_grew_in_the_pot_with_no_sun", "at_last_ming_finds_it_out_the_cold_pot_was_too_slow", "at_last_ming_finds_it_out_the_pot_with_no_sun_did_not_grow",
  "at_last_the_answer_comes", "at_last_the_answer_comes_the_wet_pot_has_a_green_stem", "at_last_the_answer_comes_the_wet_pot_has_a_green_stem_and_the_others_stay_dry", "at_last_the_houses_look_familiar_that_is_grandma_s_village", "at_last_they_see_the_park_gate_it_is_just_where_the_map_shows_it", "at_last_they_see_the_park_gate_it_is_just_where_the_mark_sits_on_the_map",
  "at_midnight_the_sky_lights_up_far_away_but_we_stay_warm_indoors", "at_new_moon_the_lit_side_faces_away_from_us_so_the_sky_looks_dark", "at_night_it_gets_cold_outside_the_pig_wants_to_find_a_warm_place", "at_night_she_is_not_sleepy_at_all", "at_night_the_moon_wears_the_scarf_again_ming_looks_up_and_the_moon_looks_back", "at_night_the_sun_is_not_in_the_sky_then_it_is_dark_and_we_cannot_see_well",
  "at_noon_it_is_short_again_grandma_was_right", "at_noon_it_is_short_again_grandma_was_right_and_now_ming_knows_why", "at_noon_the_shadow_is_short", "at_noon_the_shadow_is_short_it_sits_right_under_him", "at_noon_the_shadow_is_short_it_sits_right_under_him_because_the_sun_is_high_over_him", "at_seven_in_the_early_morning_we_arrive_at_the_big_new_station",
  "at_spring_festival_grandma_gives_ming_a_red_packet", "at_the_bridge_they_saw_the_familiar_red_roof_of_their_building_across_the_street", "at_the_corner_an_old_woman_stood_beside_a_fallen_basket_apples_had_rolled_into_the_shallow_water", "at_the_far_turn_grandpa_points_to_the_hills", "at_the_gate_grandpa_sees_the_two_hats_that_sit_on_one_head_he_says_the_big_one_is_his_hat", "at_the_shop_he_sees_a_kite_a_game_and_a_cake",
  "at_the_turn_the_red_boat_is_third_then_second_then_level_with_the_first", "at_the_very_top_a_tassel_drops_fine_yellow_dust", "auntie_brings_sweet_rice_balls_cousin_bo_shows_us_his_new_kite", "autumn_is_the_busiest_everyone_cuts_bundles_and_carries_the_sheaves_to_the_flat_stone_yard", "baby_pandas_are_very_small_a_new_baby_is_as_small_as_a_cup", "back_to_the_first_place",
  "back_to_the_first_place_nothing_has_moved", "back_to_the_playground_all_is_well", "bad_cat_said_the_rat", "bang_bang_bang", "be_careful_with_the_knife", "be_careful_with_the_knife_grandma_keeps_it_high",
  "be_careful_with_the_knife_grandma_keeps_it_high_so_it_is_hard_to_get", "be_quiet", "because_their_habitat_is_shrinking_people_plant_more_bamboo_and_protect_the_forest", "bees_and_flowers_are_good_friends_in_the_sun_they_help_each_other_day_after_day", "bees_and_flowers_help_each_other_every_day_the_bee_gets_food_and_the_flower_gets_help", "bees_can_see_yellow_and_blue_very_well_bright_flowers_are_easy_for_them_to_find",
  "bees_make_honey", "bees_make_honey_from_nectar", "before_bed_dad_closes_every_window_we_check_them_all_twice_just_to_be_sure", "before_bed_we_put_one_mooncake_by_the_window_for_good_luck", "before_i_was_quiet_but_now_i_am_active", "before_long_it_is_a_thin_crescent_once_more_this_time_just_before_dawn",
  "behind_the_old_house_grandpa_has_a_small_green_garden", "beijing_has_a_long_history", "being_calm_brings_calm_it_was_a_good_thing_to_notice", "being_calm_is_how_sleep_comes_it_was_a_good_thing_to_notice", "being_careful_is_not_the_same_as_being_slow", "being_careful_is_not_the_same_as_being_slow_it_was_a_good_lesson",
  "being_careful_is_not_the_same_as_being_slow_it_was_worth_thinking_about", "big_and_small_both_are_plates", "big_and_small_both_are_plates_both_hold_a_good_lunch", "big_and_small_i_like_them_all", "big_stones_can_make_small_sand", "big_stones_can_turn_into_sand",
  "big_things_can_start_small", "birds_are_at_home_in_the_trees", "birds_fly", "birds_pick_up_seeds_and_drop_them_far_away_a_bird_can_fly_all_day_before_it_drops_one", "blue_and_red_flags", "blue_and_red_flags_we_hold_them_up",
  "boats_go_on_the_water_every_day_they_stay_up_and_do_not_go_down", "both_are_plates_both_hold_a_good_lunch", "both_are_plates_both_hold_good_food", "both_have_a_part_of_the_rice_here_is_some_rice_here_is_some_milk", "both_have_an_r_sound", "both_have_an_r_sound_listen_for_it",
  "both_have_an_r_sound_listen_for_it_when_you_say_them", "both_have_sh", "both_have_the_ow_sound", "both_have_the_ow_sound_listen_to_the_two_words", "both_have_the_ow_sound_listen_to_the_two_words_and_say_them_slowly", "both_help_people",
  "both_help_people_but_they_help_in_different_ways", "both_of_them_are_tall", "both_of_them_get_to_use_the_flag_we_look_at_the_flag_and_the_clock", "both_sides_are_the_same_problem", "both_sides_are_the_same_problem_there_is_only_one_board", "both_sides_are_the_same_problem_there_is_only_one_board_and_they_both_need_it_today",
  "both_sides_are_the_same_problem_there_is_only_one_board_they_both_need_it_today", "both_work_well_again_look_at_the_tree_and_the_jam", "both_work_well_again_they_were_glad_they_kept_looking", "bread_is_made_from_wheat_wheat_grows_on_the_farm", "breeding_centres_help_cubs_survive_then_return_them_to_the_wild_when_they_are_ready", "bring_a_heavy_raincoat_with_you",
  "bring_an_umbrella_it_may_rain", "brush_your_teeth_twice_a_day", "but_a_sentence_is_not_just_words", "but_a_sentence_is_not_just_words_the_words_work_as_a_team", "but_changing_it_helped_too", "but_gold_is_not_warm",
  "but_i_can_be_brave", "but_i_like_the_huge_one", "but_i_still_read_on", "but_it_can_not_stop", "but_it_can_not_swim", "but_it_is_my_sock",
  "but_it_is_the_same_moon", "but_it_is_the_same_moon_nothing_about_it_changes", "but_it_is_the_same_moon_nothing_about_it_changes_only_what_we_see", "but_it_is_the_same_moon_nothing_about_it_changes_only_what_we_see_is_different", "but_ming_is_warm_the_scarf_does_its_job", "but_ming_is_warm_the_scarf_does_its_work",
  "but_ming_is_warm_with_the_scarf", "but_ming_is_warm_with_the_scarf_it_keeps_the_wind_out", "but_ming_reads_anyway", "but_ming_still_does_not_get_it", "but_ming_still_does_not_get_it_some_of_the_words_are_strange_to_him_because_he_has_never_seen_them_before", "but_ming_still_does_not_get_it_the_words_are_all_strange_to_him",
  "but_ming_still_does_not_get_it_the_words_are_all_strange_to_him_because_he_has_never_seen_them_before", "but_ming_takes_another", "but_ming_takes_another_and_then_one_more_his_legs_feel_tired_but_he_keeps_going", "but_ming_takes_another_then_one_more_and_one_more", "but_ming_takes_another_then_one_more_and_one_more_his_legs_feel_tired", "but_my_dog_can_nap",
  "but_now_i_can_not_sleep", "but_the_day_is_over", "but_the_day_is_over_the_sky_is_dark_now", "but_the_day_is_over_the_sky_is_dark_now_and_the_kite_is_still_in_the_tree", "but_the_day_is_over_the_sky_is_dark_now_the_kite_is_in_the_tree", "but_the_farm_is_good",
  "but_the_farm_is_good_the_corn_is_tall", "but_the_idea_is_whole_nothing_important_is_missing", "but_the_idea_is_whole_nothing_important_is_missing_and_he_can_explain_it_in_three_words", "but_the_idea_was_whole", "but_the_knife_can_hurt", "but_the_knife_can_hurt_ming_once_cut_his_hand",
  "but_the_knife_can_hurt_ming_once_cut_his_hand_so_he_learned_to_be_careful", "but_the_turtle_is_not_afraid", "but_the_turtle_is_not_afraid_it_has_a_hard_shell", "but_the_turtle_is_not_afraid_it_has_a_hard_shell_that_keeps_it_safe", "but_the_water_was_too_low", "but_they_are_both_plates",
  "but_they_are_both_plates_both_can_hold_food", "but_we_can_not_stay", "but_why_does_practice_work", "but_why_does_practice_work_ming_wants_to_know", "by_grandpa_s_home_is_a_long_old_stone_bridge", "by_late_summer_the_plants_are_tall_and_gold",
  "by_late_summer_the_plants_turn_gold_and_bend_under_the_weight_of_the_grain_heads", "by_late_summer_the_soft_kernels_turn_gold_and_firm", "by_the_sixth_one_her_hands_knew_the_motion_and_the_pattern_on_top_was_clear", "cake_on_the_lake_cake_on_the_plate", "can_i_do_it_myself_asks_grandma", "can_i_try_them_on",
  "can_we_do_it_all_today_asks_ming", "can_we_do_it_all_today_asks_mom", "can_you_answer_the_question", "can_you_carry_this_bag", "can_you_feed_the_cow_yes_i_can", "can_you_help_me",
  "can_you_help_me_asks_dad", "can_you_help_me_asks_grandpa", "can_you_help_me_asks_lili", "can_you_help_me_asks_mom", "can_you_help_them_yes_i_can", "can_you_swim_yes_i_can",
  "cap_and_cape", "cap_and_cape_the_two_words_look_almost_the_same", "cap_cape", "cap_cape_kit_kite_not_note_say_them", "cap_cape_now_you_can_hear_the_difference", "cap_is_not_cape",
  "cap_is_not_cape_one_is_short_and_one_is_long", "car_and_bird", "car_and_bird_say_both_words", "car_bird_car_bird", "car_bird_car_bird_now_say_them_fast", "car_corn_curl_far_short_turn_now_say_them_all",
  "car_is_not_bird", "car_is_not_bird_they_are_different_things_but_both_have_r", "care_keeps_us_safe", "cars_pollute_the_air", "cat_cap_pen_pin_bun_sun_say_them", "change_is_all_around",
  "chasing_made_them_afraid_now_they_could_see_why", "checking_turns_a_guess_into_knowledge_it_was_a_good_thing_to_notice", "chip_on_the_bench", "chips_chips_chips", "chirp_chirp_chirp", "chop_chop_chop",
  "chop_chop_no_chip", "chopsticks_are_a_tradition_in_china", "clap_clap_clap", "clap_clap_step_step_stop_again", "clap_not_kuh_lap_clap_clap_clap", "clap_your_hands",
  "class_starts_at_eight", "clever_crow_full_jar", "climbing_mountains_is_tiring", "cloud_cow_coin_toy_sauce_straw_now_you_can_read_them_all", "come_and_join_us", "come_and_run_outside_with_me",
  "come_and_see_my_garden", "come_close_not_so_close", "come_out_and_run_run_run", "come_out_duck_come_out", "come_to_the_farm_and_see", "comparing_needs_a_plan_not_just_a_look",
  "comparing_needs_a_plan_not_just_a_look_it_was_a_good_lesson", "corn_grows_by_the_wall_beans_climb_the_sticks", "corn_in_the_garden", "corn_in_the_garden_it_is_tall_and_yellow", "corn_is_in_the_garden", "corn_is_in_the_garden_ming_put_the_seeds_in",
  "corn_is_in_the_garden_ming_put_the_seeds_in_when_spring_came", "corn_on_a_fork", "corn_starts_as_a_small_hard_yellow_seed_in_the_dirt", "could_you_tell_me_about_your_hometown", "count_the_coins", "count_the_coins_it_takes_care",
  "counting_is_fun", "counting_is_fun_he_shows_grandma_how_many", "counting_is_fun_he_shows_grandma_how_many_and_she_says_he_is_right", "counting_is_fun_he_shows_grandma_how_many_you_are_right_she_says", "counting_is_hard_on_grass", "cousin_gets_the_letter",
  "cousin_gets_the_letter_she_opens_it_that_day", "cousin_gets_the_letter_she_opens_it_that_day_because_she_sees_ming_name_on_it", "cousin_gets_the_letter_she_opens_it_that_day_because_she_sees_ming_s_name_on_it", "cousin_likes_the_picture", "cousin_likes_the_picture_she_writes_back_to_ming", "cousin_likes_the_picture_she_writes_back_to_ming_and_she_draws_a_small_picture_too",
  "curl_your_tongue_up_but_do_not_touch_the_roof", "dad_and_lili_are_at_home", "dad_answers_but_grandpa_still_looks_lost", "dad_answers_but_grandpa_still_looks_lost_they_did_their_best_at_this_step", "dad_asks_which_word_is_the_hard_one", "dad_asks_which_word_is_the_hard_one_two_pairs_of_eyes_see_more",
  "dad_borrows_a_coat_from_lili", "dad_closes_the_book_and_tells_it_again_we_say_the_words_again_discover_and_energy", "dad_closes_the_book_and_tells_it_again_we_say_the_words_again_stair_and_air", "dad_goes_to_the_street_for_lili", "dad_goes_to_the_street_for_lili_they_had_been_here_before", "dad_has_a_big_ball_and_the_pig_is_glad",
  "dad_has_a_big_hat", "dad_has_a_bike", "dad_has_a_bike_it_is_red", "dad_has_a_bike_it_is_red_and_new", "dad_has_just_finished_a_book_in_the_classroom", "dad_has_just_finished_a_book_in_the_library",
  "dad_is_busy_today", "dad_is_glad_lili_is_glad_too_we_say_the_words_again_grape_and_hole", "dad_is_in_bed_at_night", "dad_is_in_the_park_with_a_swan", "dad_is_wet_dad_is_mad", "dad_laughs_and_puts_the_wet_hat_on",
  "dad_listens_then_reads_it_in_two_parts", "dad_looks_at_a_box_and_a_pot", "dad_looks_at_a_corner_and_a_ball", "dad_looks_at_a_plate_and_a_rope", "dad_looks_at_a_playground_and_a_garden", "dad_looks_at_a_road_and_a_path",
  "dad_looks_at_a_shed_and_a_shop", "dad_looks_at_a_shop_and_a_photo", "dad_looks_at_a_story_and_a_kite", "dad_looks_at_a_town_and_a_cup", "dad_looks_at_an_idea_and_a_cap", "dad_makes_a_guess",
  "dad_makes_a_guess_they_did_their_best_at_this_step", "dad_opens_a_book_at_home", "dad_opens_a_book_at_the_beach", "dad_opens_a_book_in_the_park", "dad_opens_a_book_on_the_street", "dad_points_at_the_book_and_then_the_room_we_say_pen_park_and_water",
  "dad_points_at_the_cake_and_then_the_brush_they_made_a_list_nose_nose_and_cube", "dad_points_at_the_letter_and_then_the_morning_they_wrote_down_three_words_doctor_cart_and_winter", "dad_points_at_the_mooncake_and_then_the_box_they_looked_more_than_once_before_they_went_on_they_wrote_down_owl_owl_and_straw", "dad_points_at_the_nut_and_then_the_pen_we_say_animal_animal_and_bat", "dad_points_at_the_season_and_then_the_day_they_looked_more_than_once_they_wrote_three_words_on_the_board_action_air_and_earth", "dad_points_at_the_seed_and_then_the_wing_we_say_sea_sea_and_whale_again",
  "dad_points_at_the_stem_and_then_the_clock_they_wrote_down_person_snow_and_plum", "dad_puts_his_hat_on_the_table", "dad_puts_up_red_couplets_by_the_door_while_ming_holds_the_ladder_steady", "dad_reads_it_once_more_smiling_we_say_the_words_again_cart_and_corn", "dad_reads_it_once_more_smiling_we_say_the_words_again_soup_and_south", "dad_reads_it_one_word_at_a_time",
  "dad_reads_the_list_again_out_loud", "dad_runs_with_the_bike", "dad_runs_with_the_bike_he_does_not_let_go", "dad_says_a_little_water_is_enough", "dad_says_do_not_chase_stand_still_two_pairs_of_eyes_see_more", "dad_says_look_at_one_part_at_a_time",
  "dad_says_make_a_line_and_wait", "dad_says_make_a_line_and_wait_two_pairs_of_eyes_see_more", "dad_says_make_a_little_song_about_it_two_pairs_of_eyes_see_more", "dad_says_move_the_turtle_up_higher", "dad_says_start_from_the_same_end", "dad_says_start_from_the_same_end_two_pairs_of_eyes_see_more",
  "dad_says_the_whole_sentence_slowly", "dad_says_wait_a_little_longer", "dad_says_waiting_is_part_of_the_trip", "dad_says_you_can_have_it_first", "dad_says_you_can_have_it_first_they_did_their_best_at_this_step", "dad_shows_the_tickets_on_his_phone_the_screen_is_bright_and_clear",
  "dad_starts_again_in_order", "dad_stops_and_thinks", "dad_takes_the_letter_to_the_post_box_on_the_corner", "dad_tells_the_last_part_first", "dad_thinks_about_the_answer_in_the_book_they_wrote_three_words_on_the_board_stair_air_and_earth", "dad_thinks_about_the_problem_in_the_book_three_words_mattered_that_day_discover_energy_and_forget",
  "dad_thinks_about_the_shed_in_the_book_we_say_the_words_chips_chips_and_fog", "dad_uses_it_well_and_looks_after_it", "dad_wants_a_note", "dad_wants_it_lili_wants_it_too", "dad_wants_to_do_it_alone", "dad_wants_to_find_one_special_shell",
  "dad_wants_to_practice_the_answer_they_had_been_here_before", "dad_wants_to_practice_the_problem_they_had_been_here_before", "dad_wants_to_read_it_out_loud", "dad_wants_to_use_it_for_a_day", "dad_will_return_what_is_not_theirs", "dark_clouds_have_more_water_in_them_they_often_bring_us_rain",
  "dark_makes_things_look_different", "day_after_day_ming_reads", "day_by_day_it_adds_up", "day_by_day_it_adds_up_the_notes_fill_the_box", "day_by_day_it_adds_up_the_notes_fill_the_box_and_soon_the_box_is_full", "day_by_day_it_adds_up_the_notes_fill_the_box_the_box_is_full",
  "day_by_day_the_rice_gets_tall", "day_by_day_the_tree_gets_tall", "did_you_go_to_the_zoo", "did_you_see_my_ball_ming_asks_a_man_at_the_gate", "did_you_wake_up_at_ten_o_clock_yes_i_did", "did_you_watch_tv_yes_i_did",
  "different_things_different_uses", "dig_pig_dig", "do_not_add_a_chinese_particle_at_the_end_english_uses_your_voice_not_a_final_word", "do_not_be_loud_in_the_study", "do_not_drop_broken_glass", "do_not_guess_from_chinese_look_at_the_letters_and_say_the_sound",
  "do_not_litter_in_the_street", "do_not_read_word_by_word", "do_not_read_word_by_word_that_breaks_the_line", "do_not_talk_in_class", "do_not_waste_food", "do_you_have_a_car_yes_i_do",
  "do_you_have_a_wish_too", "do_you_have_any_cereal_no_i_don_t", "do_you_have_any_cheaper_ones", "do_you_have_twenty_shells_yes_i_do", "do_you_like_apples", "do_you_like_carrots_yes_i_do",
  "do_you_want_to_play_asks_lili", "do_you_work_in_a_restaurant_yes_i_do", "does_he_have_brown_eyes_yes_he_does", "does_it_need_water_asks_grandpa", "does_she_run", "does_she_take_the_bus_to_school_yes_she_does",
  "does_the_map_help_asks_ming", "does_the_map_help_asks_ming_a_good_question_is_a_good_start", "doing_it_again_makes_a_path", "doing_it_again_makes_a_path_the_path_is_in_your_brain", "doing_it_again_makes_a_path_the_path_is_in_your_brain_and_it_gets_strong_with_use", "don_t_be_late_for_class",
  "don_t_be_loud_in_the_study", "don_t_be_sad", "don_t_be_worried_it_is_easy", "don_t_cut_down_the_trees", "don_t_run_in_the_bedroom", "don_t_stay_up_late_playing_video_games",
  "don_t_take_pictures", "doudou_can_jump_on_a_log", "doudou_can_run_and_run", "doudou_has_a_loud_day_he_finds_a_lot_to_shout_about", "doudou_is_a_dog", "doudou_is_in_the_mud",
  "doudou_is_tired_now_his_loud_day_is_over_at_last", "doudou_naps_in_the_sun", "doudou_runs_in_and_stops_at_the_drum", "doudou_runs_in_he_is_the_king", "down_by_the_shed_all_is_well", "down_by_the_shed_i_see_a_hen",
  "drive_car_drive", "dumplings_with_grandma", "dumplings_with_grandma_he_wants_to_make_them_again", "dumplings_with_grandma_he_wants_to_make_them_again_because_it_was_fun", "each_day_she_writes_a_note_she_keeps_them_all_in_her_book", "each_evening_the_bright_part_gets_wider_we_call_this_the_waxing_moon",
  "each_page_takes_a_short_time_he_looks_at_it_slowly", "each_page_takes_a_short_time_he_looks_at_it_slowly_before_he_starts_the_next", "each_season_is_different", "each_season_is_different_the_garden_shows_it", "each_silk_grows_into_one_small_soft_kernel_of_corn", "each_small_page_is_part_of_the_whole_each_one_has_its_place",
  "each_small_page_is_part_of_the_whole_not_one_is_lost", "each_step_loses_a_little_of_the_outer_layer_which_is_why_brown_rice_keeps_more_fibre", "each_word_has_its_place_together_they_say_one_thing", "eat_less_sugar_and_more_vegetables", "elephants_are_bigger_than_rhinos", "energy_will_run_out_one_day",
  "even_a_very_big_ship_can_go_on_the_sea_the_air_inside_keeps_it_light_enough", "even_the_koala_is_special_there", "every_animal_has_a_home", "every_day_ming_reads", "every_sound_comes_from_something_that_moves_a_quiet_room_is_quiet_because_nothing_moves", "every_winter_grandpa_draws_a_calendar_on_a_sheet_of_brown_paper_and_hangs_it_by_the_door",
  "every_word_is_on_a_page", "every_year_in_early_summer_our_town_holds_a_dragon_boat_race_on_the_river", "everyone_can_enter_the_competition", "everyone_can_recycle", "everyone_gets_through_the_door_they_were_glad_they_kept_looking", "everyone_gets_through_the_door_we_look_at_the_clock_and_the_school",
  "everyone_helps_in_the_community", "everyone_is_sleeping_in_a_bed_the_house_is_quiet_and_dark", "everyone_is_together", "everyone_is_together_no_one_is_away_tonight", "everyone_is_together_no_one_is_away_tonight_so_the_house_is_full", "everyone_laughs_kindly_he_tries_it_again_and_this_time_all_the_words_come_out",
  "everyone_likes_the_name_they_say_it_out_loud", "everyone_looks_at_me_i_do_not_say_a_word", "everyone_looks_up_and_starts_to_laugh_the_cake_is_on_the_wall_not_on_the_table", "everything_is_quiet_even_the_dog_makes_no_sound", "farmers_plant_rice_in_the_south_where_it_is_warm_and_wet", "farmers_stand_in_shallow_water_and_place_each_bunch_by_hand_in_straight_rows_with_even_gaps",
  "fast_and_slow_you_can_say_both", "february_is_before_march", "feet_on_the_mat_fit_in_the_hat", "finally_we_get_to_the_station", "finding_a_way_to_remember_is_a_skill_it_was_a_good_thing_to_notice", "finding_the_hard_word_was_the_real_work",
  "finding_the_hard_word_was_the_real_work_looking_back_it_seemed_clear", "first_a_big_bug", "first_a_small_green_shoot_pushes_through_the_soft_wet_earth", "first_there_was_a_question", "first_there_was_a_question_ming_could_not_find_his_ball", "first_there_was_a_question_ming_could_not_find_his_ball_and_he_looked_all_over",
  "first_wash_your_hands_then_eat", "fish_and_chips", "fish_and_chips_are_good", "fish_are_at_home_in_the_water", "fish_swim", "five_cats",
  "five_ducks_in_the_lake", "five_kites_in_the_sky", "five_kites_one_tree", "flop_on_the_grass", "food_at_the_zoo", "food_at_the_zoo_we_watch_them_eat",
  "food_at_the_zoo_we_watch_them_eat_and_we_laugh", "for_ar_open_the_mouth_wide_car_star_far_hard_part", "for_ir_er_ur_the_sound_is_the_same_her_bird_turn_first_girl", "for_many_months_the_rice_is_green_then_it_turns_gold", "for_or_round_the_lips_corn_short_morning_north_sport", "for_you_says_grandma_she_has_a_big_smile",
  "four_cats", "fresh_cheese_is_good", "fresh_cheese_is_good_i_like_it_a_lot", "frog_not_fuh_rog_one_word_frog", "from_a_tower_you_can_see_far_away_the_wall_runs_like_a_long_dragon", "from_a_wet_field_to_a_bowl_at_home",
  "from_farm_to_table", "from_one_small_seed_a_whole_field_of_corn", "from_seed_to_bowl_more_than_forty_hands_may_have_touched_those_grains_that_is_worth_remembering", "from_wheat_to_bread_takes_many_steps_now_we_know_how_bread_is_made", "fun_in_the_sun", "get_enough_sleep_every_night",
  "get_the_eggs_get_the_eggs", "get_the_mop", "get_the_net_get_the_net", "give_him_the_gift_please", "give_it_back_said_my_dog", "give_me_the_book_please",
  "giving_things_back_is_how_we_keep_trust_we_say_the_words_again_coat_and_road", "go_across_the_bridge", "go_train_go_go_boat_go", "going_too_fast_made_ming_tired", "gold_came_all_at_once", "good",
  "good_find_one_more_word_with_a_quiet_e", "good_food_good_sleep_and_play_help_us_grow_this_is_the_way_we_grow", "good_habits_help_us_grow", "good_ideas_need_time", "good_now_say_them_again_when_you_are_ready", "good_now_say_them_fast_and_do_not_mix_them",
  "good_now_say_them_slowly", "good_readers_reread_constantly_they_also_say_a_sentence_aloud_when_the_words_feel_tangled", "good_reading", "good_reading_now_you_know_the_quiet_letters", "good_reading_try_it_again_slower", "good_reading_try_two_more_words",
  "good_reading_try_two_more_words_and_listen_for_the_quiet_letters", "good_reading_you_can_hear_the_quiet_letters_now", "good_say_it_again", "good_you_can_say_both", "good_you_can_say_it", "grab_crab_grab",
  "grandma_answers", "grandma_answers_but_ming_still_looks_lost", "grandma_answers_but_ming_still_looks_lost_they_did_their_best_at_this_step", "grandma_answers_she_explains_the_whole_line", "grandma_answers_she_explains_the_whole_line_and_she_talks_slowly", "grandma_answers_she_explains_the_whole_line_because_he_cannot_get_it",
  "grandma_asks_about_the_park_ming_tells_that_part_again", "grandma_asks_about_the_park_ming_tells_that_part_again_because_she_wants_to_hear_it", "grandma_asks_how_he_does_it_ming_points_to_the_door", "grandma_asks_how_many_hats_he_will_wear_tomorrow_ming_says_three_because_two_is_never_enough", "grandma_asks_one_more_thing_she_wants_to_hear_about_the_ball", "grandma_asks_when_we_last_saw_her_and_what_the_window_looked_like_then",
  "grandma_asks_which_word_is_the_hard_one", "grandma_asks_which_word_is_the_hard_one_two_pairs_of_eyes_see_more", "grandma_boils_water_for_tea_the_pot_lets_out_a_loud_hiss", "grandma_calls_us_in_we_take_one_last_long_look", "grandma_can_hear_the_book_at_night_too_she_thinks_the_story_is_a_good_one", "grandma_chops_cabbage_and_meat_then_adds_a_little_salt_and_oil",
  "grandma_claps_at_the_steps", "grandma_closes_the_book_and_tells_it_again_we_say_the_words_again_promise_and_protect", "grandma_comes_and_helps", "grandma_comes_and_helps_it_is_fine_she_says_we_will_try_again_together", "grandma_comes_and_helps_she_says_it_is_fine", "grandma_comes_in_she_looks_at_the_pages_in_order",
  "grandma_comes_in_she_looks_at_the_pages_in_the_order_he_painted_them", "grandma_comes_in_she_looks_at_the_pages_in_the_order_that_he_painted_them", "grandma_counts_the_notes_with_him_because_he_wants_to_know", "grandma_counts_the_notes_with_him_there_are_more_than_he_thought", "grandma_has_it_now", "grandma_has_just_finished_a_book_at_home",
  "grandma_has_mooncakes", "grandma_has_mooncakes_there_are_many_on_the_plate", "grandma_holds_on_and_tries", "grandma_holds_the_noodle_up_high_she_starts_to_laugh", "grandma_is_at_the_far_end_in_the_kitchen_she_holds_the_noodle_up_and_starts_to_laugh", "grandma_is_by_the_water_with_the_fish",
  "grandma_is_glad", "grandma_is_glad_she_smiles_and_says_thank_you", "grandma_is_glad_she_smiles_at_ming", "grandma_is_glad_thank_you_ming_she_says_and_she_smiles", "grandma_is_in_bed_at_night", "grandma_is_in_bed_at_night_they_had_been_here_before",
  "grandma_is_in_the_kitchen", "grandma_is_in_the_kitchen_the_kitchen_is_warm", "grandma_is_in_the_kitchen_the_kitchen_is_warm_because_she_is_cooking", "grandma_is_in_the_kitchen_the_kitchen_is_warm_because_the_pot_is_on", "grandma_is_in_the_photo", "grandma_is_in_the_photo_she_holds_a_big_cake",
  "grandma_is_in_the_photo_she_holds_the_big_cake_that_she_made_that_morning", "grandma_is_on_the_farm", "grandma_is_on_the_farm_she_is_there_for_a_week", "grandma_is_on_the_farm_she_is_there_for_a_week_so_she_has_time_to_write", "grandma_is_reading_the_word_cap_at_home", "grandma_is_reading_the_word_car_at_home",
  "grandma_is_reading_the_word_garden_in_the_garden", "grandma_is_reading_the_word_hat_at_home", "grandma_is_reading_the_word_house_at_home", "grandma_is_reading_the_word_knee_at_home", "grandma_is_reading_the_word_moon_at_home", "grandma_is_reading_the_word_mud_in_the_garden",
  "grandma_is_reading_the_word_name_at_home", "grandma_is_reading_the_word_pen_at_home", "grandma_is_reading_the_word_rain_at_home", "grandma_is_reading_the_word_reason_at_home", "grandma_is_reading_the_word_red_at_home", "grandma_is_reading_the_word_shadow_in_the_field",
  "grandma_is_reading_the_word_ship_at_home", "grandma_is_reading_the_word_star_at_home", "grandma_is_reading_the_word_tree_at_home", "grandma_is_reading_the_word_window_at_home", "grandma_likes_the_cake", "grandma_likes_the_cake_she_eats_a_big_piece",
  "grandma_likes_the_rose", "grandma_likes_the_rose_she_stops_to_look_at_it", "grandma_listens_then_reads_it_in_two_parts", "grandma_listens_then_reads_it_in_two_parts_this_time_they_went_more_slowly", "grandma_lives_in_the_small_village_we_live_in_the_big_city_far_away_from_her", "grandma_looks_at_the_two_pots_she_asks_which_one_grew_first",
  "grandma_looks_at_the_two_pots_she_asks_which_one_grew_first_and_ming_shows_her_the_marks", "grandma_makes_a_cake_ming_makes_the_shape", "grandma_makes_a_guess_they_did_their_best_at_this_step", "grandma_makes_dumplings", "grandma_makes_dumplings_she_makes_a_round_piece", "grandma_makes_dumplings_she_makes_a_round_piece_that_is_thin_and_soft",
  "grandma_makes_dumplings_today_it_is_my_best_day", "grandma_makes_hot_tea_in_a_cup_at_first_the_cup_is_too_hot_to_hold", "grandma_opens_a_book_at_home", "grandma_opens_a_book_at_home_they_had_been_here_before", "grandma_pinches_the_edge_her_dumplings_stand_up_like_little_boats", "grandma_points_to_one_small_part",
  "grandma_points_to_one_small_part_two_pairs_of_eyes_see_more", "grandma_points_to_one_word", "grandma_points_to_one_word_and_asks_again", "grandma_points_to_one_word_it_sits_near_the_end", "grandma_points_to_one_word_it_sits_near_the_end_of_the_line", "grandma_points_to_the_bamboo_pole_at_the_far_end_and_says_watch_that_flag",
  "grandma_puts_a_fish_at_the_beach", "grandma_puts_a_mooncake_on_a_plate_and_cuts_it_into_four_pieces", "grandma_puts_mooncakes_on_the_table_she_counted_them_three_times", "grandma_reads_it_once_more_smiling_both_of_them_felt_the_same_way_we_say_the_words_again_knee_and_phone", "grandma_reads_it_once_more_smiling_it_was_a_good_moment_we_say_the_words_again_reason_and_reason", "grandma_reads_it_once_more_smiling_we_say_the_words_again_car_and_corner",
  "grandma_reads_it_once_more_smiling_we_say_the_words_again_oyster_and_oyster", "grandma_reads_it_once_more_smiling_we_say_the_words_again_sheep_and_rope", "grandma_reads_it_one_word_at_a_time", "grandma_reads_it_one_word_at_a_time_they_did_their_best_at_this_step", "grandma_reads_the_list_again_out_loud", "grandma_runs_after_them",
  "grandma_says_a_round_moon_means_the_whole_family_is_together", "grandma_says_ask_someone_who_knows_two_pairs_of_eyes_see_more", "grandma_says_dig_around_it_not_at_it", "grandma_says_go_at_your_own_speed", "grandma_says_he_has_courage_ming_says_one_word_is_easy", "grandma_says_it_is_fine",
  "grandma_says_it_is_fine_she_shows_him_again", "grandma_says_it_is_fine_she_shows_him_again_so_he_can_see_how", "grandma_says_it_is_patience_ming_says_it_is_a_quiet_kind_of_strength", "grandma_says_it_is_patience_ming_says_it_is_a_quiet_kind_of_strength_that_comes_when_you_wait", "grandma_says_let_us_go_back_and_look_again", "grandma_says_let_us_go_back_and_look_again_two_pairs_of_eyes_see_more",
  "grandma_says_look_at_one_part_at_a_time", "grandma_says_she_does_that_too_she_stops_and_sings", "grandma_says_she_likes_the_end_ming_says_he_likes_the_gate_part", "grandma_says_the_clouds_will_move", "grandma_says_the_new_year_is_not_the_noise_it_is_being_together_again", "grandma_says_the_sentence_out_loud_we_say_the_words_again_believe_and_later",
  "grandma_says_the_sentence_out_loud_we_say_the_words_again_hat_and_hen", "grandma_says_the_sentence_out_loud_we_say_the_words_again_hill_and_hole", "grandma_says_the_sentence_out_loud_we_say_the_words_again_horse_and_house", "grandma_says_the_sentence_out_loud_we_say_the_words_again_knee_and_knife", "grandma_says_the_sentence_out_loud_we_say_the_words_again_shadow_and_visitor", "grandma_says_the_sentence_out_loud_we_say_the_words_again_snake_and_bike",
  "grandma_says_the_sentence_out_loud_we_say_the_words_again_window_and_house", "grandma_says_the_sentence_out_loud_we_say_the_words_again_worker_and_yogurt", "grandma_says_wait_a_little_longer", "grandma_says_wait_for_the_wind", "grandma_says_wait_for_the_wind_to_turn", "grandma_says_we_can_each_do_one_part",
  "grandma_says_we_can_try_to_put_them_back_two_pairs_of_eyes_see_more", "grandma_sees_him_and_starts_to_laugh_she_asks_if_his_head_is_a_hat_shop", "grandma_shows_ming_how", "grandma_shows_ming_how_she_puts_the_food_on_the_round_piece", "grandma_sings_a_long_long_song", "grandma_smiled_i_know_she_said_the_old_woman_telephoned_she_said_two_kind_children_helped_her",
  "grandma_smiles_the_cake_is_sweet_the_note_is_nice", "grandma_starts_again_in_order", "grandma_tasted_one_slowly_they_are_not_darker_she_said_they_are_just_the_first_batch", "grandma_tells_him_not_to_run_he_walks_slowly", "grandma_tells_him_not_to_run_he_walks_slowly_because_the_floor_is_old", "grandma_tells_the_last_part_first",
  "grandma_thinks_about_the_habit_in_the_book_three_words_mattered_that_day_promise_protect_and_realize", "grandma_tries_to_mend_it_but_it_is_not_easy", "grandma_tries_to_mend_it_but_it_is_not_easy_they_did_their_best_at_this_step", "grandma_uses_the_small_one", "grandma_uses_the_small_one_she_puts_a_cake_on_it", "grandma_waits_with_us_she_has_a_big_bag",
  "grandma_wants_to_dig_in_the_garden_they_had_been_here_before", "grandma_wants_to_get_them_all_back", "grandma_wants_to_learn_to_swim", "grandma_wants_to_mend_it", "grandma_wants_to_read_it_out_loud", "grandma_wants_to_read_it_out_loud_they_had_talked_about_it",
  "grandma_wants_to_see_it_change", "grandma_wants_to_understand_it", "grandma_was_standing_at_the_door_with_two_dry_towels_and_a_pot_of_hot_ginger_soup", "grandma_will_come_today_ming_wants_to_put_the_cake_in_a_good_place", "grandma_wins_the_game", "grandma_wins_the_game_ming_claps_for_her",
  "grandma_writes_a_letter", "grandma_writes_a_letter_she_sits_at_the_desk", "grandma_writes_a_letter_she_sits_at_the_desk_because_the_light_is_good", "grandpa_and_dad_are_at_home", "grandpa_and_dad_are_in_the_field", "grandpa_and_dad_are_on_the_street",
  "grandpa_and_grandma_are_old", "grandpa_brings_a_small_old_chart_of_the_stars_to_us", "grandpa_cannot_follow_the_story", "grandpa_cannot_follow_the_story_it_was_a_little_disappointing", "grandpa_comes_in_he_has_a_wide_smile", "grandpa_comes_to_the_door_and_sees_it_he_laughs_when_he_steps_over_the_long_noodle",
  "grandpa_counts_one_two_three", "grandpa_counts_one_two_three_they_did_their_best_at_this_step", "grandpa_gives_it_a_lot_of_water", "grandpa_grins_at_ming_and_lili", "grandpa_had_ridden_it_to_work_for_thirty_years_long_before_ming_was_born", "grandpa_has_a_better_idea",
  "grandpa_has_a_big_drum_in_the_shed", "grandpa_has_a_new_hat_today_it_is_a_very_big_brown_hat", "grandpa_has_an_idea_at_home", "grandpa_is_at_home_with_a_picture", "grandpa_is_at_school_with_a_clock", "grandpa_is_at_the_station_he_has_a_bag_of_oranges",
  "grandpa_is_glad_to_see_the_cap_again_look_at_the_cap_and_the_word", "grandpa_is_reading_the_word_answer_in_the_classroom", "grandpa_is_reading_the_word_answer_in_the_library_they_had_been_here_before", "grandpa_is_reading_the_word_book_in_the_library", "grandpa_is_reading_the_word_cake_at_home", "grandpa_is_reading_the_word_letter_at_home",
  "grandpa_is_reading_the_word_mooncake_at_home", "grandpa_is_reading_the_word_nut_at_home", "grandpa_is_reading_the_word_plan_in_the_classroom", "grandpa_is_reading_the_word_season_in_the_field", "grandpa_is_reading_the_word_seed_in_the_garden", "grandpa_is_reading_the_word_stem_in_the_garden",
  "grandpa_is_reading_the_word_wing_in_the_garden", "grandpa_is_reading_the_word_wing_in_the_library", "grandpa_laughed_not_the_whole_family_he_said_but_once_it_carried_your_dad_and_two_big_bags_of_rice", "grandpa_listens_then_says_it_again", "grandpa_lives_in_a_small_town_the_train_stops_there", "grandpa_looks_at_a_bug_and_a_fish",
  "grandpa_looks_at_a_turtle_and_a_photo", "grandpa_looks_at_the_big_hat_on_the_table_he_says_that_the_hat_is_for_the_cat_now", "grandpa_opens_a_book_on_the_playground", "grandpa_opens_the_gift_at_home_he_puts_it_by_his_bed", "grandpa_plays_the_whole_sentence", "grandpa_points_at_a_bike_they_made_a_list_note_rope_and_rose",
  "grandpa_points_at_some_rice_we_say_park_pig_and_rice", "grandpa_points_at_some_wheat_they_wrote_three_words_on_the_board_wheel_world_and_wrist", "grandpa_points_to_one_small_part", "grandpa_points_to_one_word_and_asks_again", "grandpa_points_to_one_word_and_asks_again_this_time_they_went_more_slowly", "grandpa_pours_tea_and_tells_the_old_story_of_the_lady_on_the_moon",
  "grandpa_pulls_the_ears_and_carries_them_home", "grandpa_puts_a_bug_in_the_garden", "grandpa_puts_a_seed_in_the_garden", "grandpa_puts_the_hat_on_his_head_the_hat_is_too_big_for_him", "grandpa_reads_it_one_word_at_a_time", "grandpa_reads_the_list_again_out_loud",
  "grandpa_reads_the_list_again_out_loud_two_pairs_of_eyes_see_more", "grandpa_runs_after_them_they_did_their_best_at_this_step", "grandpa_says_it_but_it_does_not_sound_right", "grandpa_says_it_once_more_all_alone_we_say_the_words_again_note_and_rope", "grandpa_says_it_once_more_all_alone_we_say_the_words_again_wheel_and_world", "grandpa_says_look_at_one_part_at_a_time",
  "grandpa_says_look_at_one_part_at_a_time_two_pairs_of_eyes_see_more", "grandpa_says_look_at_the_small_details", "grandpa_says_make_the_bottom_wide_first", "grandpa_says_tell_me_who_where_then_what", "grandpa_says_tell_me_who_where_then_what_two_pairs_of_eyes_see_more", "grandpa_says_that_something_is_in_his_hat_he_takes_the_hat_off_his_head",
  "grandpa_says_the_bridge_is_a_hundred_years_old_and_still_here", "grandpa_says_the_little_oak_looked_prouder_than_any_tree_in_the_park", "grandpa_says_the_sentence_out_loud_it_was_a_good_moment_we_say_the_words_again_later_and_patient", "grandpa_says_the_sentence_out_loud_we_say_the_words_again_hen_and_hill", "grandpa_says_the_sentence_out_loud_we_say_the_words_again_house_and_jam", "grandpa_says_the_sentence_out_loud_we_say_the_words_again_patience_and_patient",
  "grandpa_says_the_sentence_out_loud_we_say_the_words_again_season_and_lake", "grandpa_says_the_sentence_out_loud_we_say_the_words_again_weather_and_weather", "grandpa_says_the_sentence_out_loud_we_say_the_words_again_winter_and_home", "grandpa_says_they_burn_far_away_like_our_sun", "grandpa_says_this_is_the_best_cake_he_has_had", "grandpa_says_turn_on_a_little_light_two_pairs_of_eyes_see_more",
  "grandpa_says_we_can_each_do_one_job", "grandpa_says_we_can_take_turns", "grandpa_sees_a_lot_of_things_at_home", "grandpa_sees_a_lot_of_things_at_home_they_had_been_here_before", "grandpa_sees_a_lot_of_things_at_school", "grandpa_sees_a_lot_of_things_in_the_garden",
  "grandpa_showed_them_how_to_test_the_brakes_and_how_to_tighten_a_loose_chain_with_a_spanner", "grandpa_sits_at_the_head_of_the_table_he_tells_us_why_we_must_not_sweep_tonight", "grandpa_stands_by_the_table_and_laughs_he_says_that_a_noodle_this_long_is_a_good_one", "grandpa_stands_in_the_rain_and_mud", "grandpa_stops_step_step_stop", "grandpa_takes_us_to_the_bank_before_sunrise_when_the_mist_still_hangs_low",
  "grandpa_tells_the_old_story_of_the_poet_and_why_people_throw_rice_in_the_water", "grandpa_tells_us_the_first_part_was_built_long_ago", "grandpa_walks_to_the_door_but_he_walks_into_a_wall_he_puts_up_his_hands_and_stops", "grandpa_wants_it_to_grow_well", "grandpa_wants_it_very_much", "grandpa_wants_to_count_them_all",
  "grandpa_wants_to_count_them_all_they_had_talked_about_it", "grandpa_wants_to_do_it_alone", "grandpa_wants_to_get_them_all_back_they_had_talked_about_it", "grandpa_wants_to_hear_all_about_it", "grandpa_wants_to_hear_all_about_it_they_had_talked_about_it", "grandpa_wants_to_read_it_out_loud",
  "grandpa_wants_to_see_it_change", "grandpa_wants_to_understand_it", "grandpa_wants_to_understand_it_they_had_talked_about_it", "green_feet_on_the_moon", "green_husks_wrap_the_young_ear_and_keep_it_safe_and_warm", "green_leaves_are_nice",
  "green_leaves_are_nice_i_want_to_paint_a_red_one", "green_shoots_come_up_in_the_sun", "guessing_is_how_we_start_to_find_out", "guessing_is_how_we_start_to_find_out_it_made_more_sense_now", "guessing_is_how_we_start_to_find_out_now_they_could_see_why", "guessing_is_how_we_start_to_find_out_we_say_the_words_again_classroom_and_classroom",
  "half_of_the_moon_is_always_bright_the_other_half_is_dark", "half_of_the_moon_is_always_lit_but_we_do_not_always_see_all_of_that_half", "half_the_people_in_the_world_eat_rice_every_day_it_is_a_lot_of_work", "happy_birthday_lisa", "hard_days_do_not_last", "hard_questions_need_time",
  "hard_work_warm_sun_and_water_make_a_good_garden", "harvest_must_wait_for_a_dry_day_wet_grain_stored_in_a_pile_would_heat_up_and_spoil", "has_she_got_curly_hair_yes_she_has", "hat", "hat_cup_box", "hat_hat_hat",
  "have_and_give_are_exceptions_we_just_know_them", "have_you_ever_seen_a_gala", "have_you_ever_tried_rock_climbing", "he_always_plays_football", "he_asked_me_to_follow_him", "he_buys_a_small_cake_for_her_not_a_kite",
  "he_can_see_the_moon", "he_can_t_paint_but_he_can_do_karate", "he_counts_his_steps_on_the_path_there_are_many_of_them", "he_cuts_a_fine_tail_lili_cuts_a_red_stripe", "he_didn_t_swim", "he_does_it_the_next_night_too_it_takes_a_short_time",
  "he_does_it_the_next_night_too_it_takes_a_short_time_and_soon_it_takes_no_time_at_all", "he_does_it_the_next_night_too_it_takes_a_short_time_soon_it_takes_no_time", "he_does_not_do_it_all_in_one_day_he_paints_one_page", "he_doesn_t_like_apples", "he_draws_a_line_to_the_new_step_the_board_still_makes_sense", "he_draws_a_line_to_the_pot_with_no_sun_the_board_still_makes_sense",
  "he_draws_mimi_at_the_bottom_of_the_page_with_a_very_long_tail", "he_draws_the_pot_with_no_sun_on_the_board_the_board_still_makes_sense", "he_falls_gets_up_and_runs_on_he_is_fourth", "he_fell_off_his_bike_and_hurt_his_foot", "he_gets_into_bed_again_it_is_warm", "he_goes_back_to_the_board_the_line_is_still_there",
  "he_goes_back_to_the_board_the_line_is_still_there_so_he_reads_it_again", "he_goes_out_to_the_street_he_walks_slowly_because_the_hats_are_high", "he_goes_skiing_in_the_winter", "he_has_a_ball", "he_has_got_a_brother", "he_holds_one_hat_in_each_hand_the_red_one_stays_on_his_head_all_the_way",
  "he_holds_the_big_hat_in_one_hand_the_red_one_stays_on_his_head_all_the_way", "he_is_a_good_player", "he_is_a_police_officer", "he_is_also_my_best_friend", "he_is_also_my_classmate", "he_is_angry_with_me",
  "he_is_from_australia", "he_is_going_to_write_an_article", "he_is_ill_today", "he_is_kind_and_quiet", "he_is_my_best_friend", "he_is_my_big_brother",
  "he_is_my_classmate", "he_is_one_metre_tall", "he_is_slower_he_looks_tired_then_he_falls_down", "he_is_strict_but_friendly", "he_is_the_first_in_line", "he_is_the_tallest_in_our_class",
  "he_is_young_but_clever", "he_isn_t_going_to_play_football", "he_listens_the_house_is_quiet_again", "he_looks_at_the_table_first_the_table_is_small_and_it_is_full_of_things", "he_looks_at_the_trees_by_the_window", "he_looks_up_at_the_leaves_they_are_big_and_green",
  "he_looks_up_at_the_leaves_they_are_big_and_green_and_they_move_in_the_wind", "he_makes_the_gift_that_day_he_uses_the_things_on_the_board", "he_makes_the_gift_that_day_he_uses_the_things_on_the_board_so_nothing_is_missing", "he_paints_that_page_again_the_slow_one_looks_better", "he_points_to_the_north_star_and_the_big_dipper", "he_puts_the_red_hat_on_his_head_first_then_he_puts_the_big_one_on_top",
  "he_reads_his_first_three_steps_again_he_did_not_forget_one", "he_reads_his_first_three_steps_again_he_did_not_forget_one_because_they_are_on_the_board", "he_reads_his_first_three_steps_again_not_one_is_missing_because_he_wrote_them_on_the_board", "he_runs", "he_runs_to_tell_grandma_she_laughs_and_sings_the_song", "he_s_riding_a_bike",
  "he_s_sad", "he_sang_as_he_walked", "he_saw_a_small_straw_hat_and_tried_to_chew_it", "he_says_the_wall_is_part_of_our_story_we_nod", "he_shows_grandma_the_two_pages_she_can_see_the_change", "he_shows_it_to_his_class_they_look_at_every_page",
  "he_shows_it_to_his_class_they_look_at_every_page_and_they_ask_how_long_it_took", "he_shows_the_plan_to_his_teacher_she_asks_two_questions", "he_sits_on_a_stone_to_rest_because_the_wind_feels_good_up_here", "he_sits_on_a_stone_to_rest_because_the_wind_feels_good_up_here_he_drinks_some_water_too", "he_sits_on_a_stone_to_rest_the_wind_feels_good_up_here", "he_sits_on_a_stone_to_rest_the_wind_feels_good_up_here_he_drinks_some_water",
  "he_sits_under_the_tree_for_a_while_i_made_it_he_says_then_he_walks_home_and_the_way_back_feels_short", "he_sits_under_the_tree_for_a_while_then_he_walks_home", "he_sits_under_the_tree_for_a_while_then_he_walks_home_and_the_way_back_feels_short", "he_smiles", "he_sometimes_plays_chess", "he_sprained_his_ankle",
  "he_takes_the_scarf_outside_to_a_tree_the_night_wind_can_find_it_there", "he_taps_it_tap_tap_clap", "he_tells_her_all_about_his_new_teacher_and_the_new_school_play", "he_trains_hard", "he_usually_answers_questions_in_class", "he_usually_visits_his_grandparents_on_sunday",
  "he_walks_to_the_door_with_the_two_hats_the_hat_on_top_goes_this_way_and_that_way_when_he_walks", "he_walks_to_the_door_with_the_two_hats_the_top_hat_goes_this_way_and_that_way_when_he_walks", "he_wants_to_become_a_doctor", "he_wants_to_make_a_picture_book_because_he_has_many_pictures", "he_wants_to_make_a_picture_book_because_he_likes_to_paint", "he_wants_to_make_a_picture_book_it_will_have_many_pages",
  "he_was_exploring_the_island", "he_was_the_star_of_the_race", "he_watches_her_cut_the_pork_she_does_it_slowly", "he_watches_her_cut_the_pork_she_does_it_slowly_because_the_knife_is_sharp", "he_watches_tv_every_day", "he_wears_a_t_shirt",
  "he_wished_for_gold", "he_wished_to_share_his_bread", "he_won_the_race", "he_works_hard_and_he_likes_it", "he_works_hard_at_school", "he_writes_the_answer_in_his_note_grandma_reads_it_that_is_a_good_answer_she_says",
  "he_writes_the_answer_in_his_note_grandma_reads_it_too", "he_writes_the_answer_in_his_note_grandma_reads_it_too_and_she_says_it_is_a_good_answer", "he_writes_the_answer_in_his_note_grandma_reads_it_too_she_says_it_is_a_good_answer", "heat_also_comes_from_things_that_burn_when_they_burn_the_air_near_them_gets_hot", "heat_can_go_from_your_hand_to_a_cold_cup_the_cold_cup_gets_a_little_warm_that_way", "heat_does_not_stay_in_one_place_it_goes_out_into_the_air_around_the_cup",
  "hello_i_m_mike", "her_book_has_three_weeks_of_notes_she_counts_them_with_the_class_so_they_can_see_how_long_it_took", "her_book_has_three_weeks_of_notes_she_counts_them_with_the_class_so_they_can_see_the_time", "her_first_mooncake_came_out_of_the_old_mould_with_a_crooked_edge_but_it_still_held_together", "her_shirt_is_red_too", "here_are_some_travel_tips",
  "here_is_a_box", "here_is_a_small_stem", "here_is_the_mark", "hi_i_m_april", "high_up_in_the_sky_it_is_cold_the_water_makes_very_small_drops_there", "his_bag_goes_there_first_his_cap_goes_on_the_bag",
  "his_bag_goes_there_first_his_cap_goes_on_the_bag_and_everything_is_ready", "his_bag_goes_there_first_his_cap_goes_on_the_bag_the_bag_is_there", "his_cousin_gets_the_letter_she_opens_it_that_day_because_she_sees_ming_s_name_on_it", "his_friends_see_him_and_laugh_with_him_they_say_that_he_is_carrying_a_very_big_hat", "his_friends_see_him_and_laugh_with_him_they_say_that_he_is_wearing_a_very_tall_hat", "his_hair_is_short",
  "his_name_was_tutankhamun", "hit_a_drum_with_your_hand_the_drum_moves_very_fast_when_you_hit_it", "hold_the_basket_mom_says_she_puts_the_rice_in_and_it_gets_full", "home_is_good", "home_is_good_the_light_is_on", "hop_fox_hop",
  "hop_hop_the_dog_can_hop", "hot_and_cold_change_all_the_time_heat_always_goes_from_hot_things_to_cold_things", "house_and_cow", "house_and_cow_two_short_words", "house_cow_house_cow", "house_is_not_cow",
  "house_is_not_cow_they_are_different_things", "house_is_not_cow_they_are_different_things_but_the_sound_is_the_same", "houses_and_tall_grey_buildings_slide_past_then_wide_fields_of_green_rice", "how_a_farmer_works", "how_a_farmer_works_it_is_hard_work", "how_a_stem_grows",
  "how_a_stem_grows_and_how_it_gets_tall", "how_are_we_going_to_get_there_by_bus", "how_are_you_i_am_fine_thank_you", "how_can_i_get_to_the_station", "how_can_i_remember_this_asks_dad_a_good_question_is_a_good_start", "how_can_i_remember_this_asks_grandpa_a_good_question_is_a_good_start",
  "how_can_we_both_have_it_asks_grandma", "how_can_we_both_have_it_asks_grandpa", "how_can_we_both_have_it_asks_lili", "how_did_he_die_a_snake_bit_him", "how_did_you_go_to_turpan", "how_do_i_get_better_asks_dad_a_good_question_is_a_good_start",
  "how_do_i_look_after_it_asks_dad", "how_do_i_look_after_it_asks_lili", "how_do_we_get_them_back_asks_grandma", "how_do_we_get_them_back_asks_grandpa_a_good_question_is_a_good_start", "how_do_we_make_it_stand_asks_lili", "how_do_you_do_it_grandma_asks_ming_points_to_the_door",
  "how_long_does_it_take_twenty_minutes", "how_many_are_there_asks_grandpa", "how_many_are_there_asks_grandpa_a_good_question_is_a_good_start", "how_many_are_there_asks_mom", "how_many_cakes_five", "how_many_crayons_thirty_crayons",
  "how_many_dolls_two_dolls", "how_many_frogs_are_there_there_are_twenty_frogs", "how_many_horses_are_there_on_the_farm", "how_many_pencils_twenty", "how_many_pencils_twenty_pencils", "how_many_pencils_two",
  "how_much_is_it", "how_much_is_it_twenty_yuan", "how_much_is_it_two_dollars_and_fifty_cents", "how_much_is_this_jacket", "how_much_money_is_in_the_jar", "how_much_water_do_you_drink_every_day",
  "how_often_do_you_have_gym_twice_a_week", "how_old_are_you_i_m_six", "how_tall_is_the_dinosaur", "how_we_measure_rain", "hurry_up_or_we_are_late_for_class", "hurry_up_or_you_will_be_late",
  "i_always_skate_before_dinner", "i_always_walk_to_school", "i_am_a_bit_scared", "i_am_a_boy", "i_am_a_girl", "i_am_active_in_class",
  "i_am_careful_with_it", "i_am_careful_with_the_basket", "i_am_chinese", "i_am_cold", "i_am_cold_and_my_hands_are_cold_too", "i_am_eight_years_old",
  "i_am_first_but_then_i_look_back_at_my_friend", "i_am_from_china", "i_am_from_the_uk", "i_am_glad_and_the_clock_is_glad_too", "i_am_glad_i_look_at_the_clock_and_smile", "i_am_glad_in_my_pit",
  "i_am_glad_the_clock_helped_me_again", "i_am_going_to_go_camping_this_summer", "i_am_going_to_swim_tomorrow", "i_am_happy", "i_am_happy_at_home", "i_am_happy_too",
  "i_am_happy_too_i_sit_with_the_dog", "i_am_home", "i_am_home_mom_is_there", "i_am_home_mom_is_there_with_cold_water", "i_am_hungry", "i_am_hungry_let_s_have_dumplings",
  "i_am_late_for_class", "i_am_lost_can_you_help_me", "i_am_nine_years_old", "i_am_not_cold_now", "i_am_not_glad", "i_am_not_happy_the_mud_is_cold",
  "i_am_not_late", "i_am_not_sad_i_can_run", "i_am_on_the_farm_for_a_week", "i_am_on_the_farm_for_a_week_the_farm_is_big", "i_am_reading", "i_am_six_years_old",
  "i_am_taller_than_my_brother", "i_am_taller_than_you", "i_am_thirteen", "i_am_thirteen_years_old", "i_am_tired", "i_am_tired_my_legs_are_tired_too",
  "i_am_tired_my_legs_are_tired_too_so_i_go_slowly", "i_am_warm_with_the_coat", "i_am_warm_with_the_coat_the_goat_has_no_coat", "i_am_worried_about_the_test", "i_am_your_friend", "i_borrow_books_from_the_library",
  "i_bought_a_gift_for_my_mum", "i_brush_my_teeth_three_times_a_day", "i_brush_my_teeth_twice_a_day", "i_can_clap_my_hands", "i_can_count_to_one_hundred", "i_can_count_to_ten",
  "i_can_count_to_three", "i_can_dig_dig_dig", "i_can_draw_a_duck", "i_can_give_them_sun", "i_can_hear_a_song", "i_can_jump_rope",
  "i_can_manage_my_money", "i_can_milk_the_cow", "i_can_not_get_in", "i_can_not_get_it", "i_can_not_get_them", "i_can_not_see_the_path",
  "i_can_not_wake_up", "i_can_read", "i_can_read_a_big_book", "i_can_read_it_all", "i_can_ride_a_camel", "i_can_ride_a_horse",
  "i_can_see_a_big_pig", "i_can_see_it_sleep", "i_can_see_it_there", "i_can_see_my_cat", "i_can_see_my_red_hen", "i_can_see_some_birds",
  "i_can_see_some_birds_at_sea", "i_can_see_the_big_pig", "i_can_see_the_frog_and_the_crab", "i_can_see_the_sea", "i_can_see_with_my_eyes", "i_can_share",
  "i_can_share_with_it", "i_can_skip", "i_can_smell_with_my_nose", "i_can_spin_and_spin", "i_can_swim", "i_can_water_the_flowers",
  "i_carry_the_basket", "i_catch_the_bus_at_seven", "i_cleaned_my_room", "i_climb_the_hill", "i_climbed_the_mountain_last_summer", "i_close_my_eyes_the_moon_is_still_there",
  "i_cook_and_clean_the_room", "i_could_count_when_i_was_four", "i_could_not_sleep", "i_could_sleep_with_it", "i_cut_a_little_piece_and_eat_it", "i_cut_a_piece_for_her",
  "i_cut_more_cheese", "i_cut_the_cheese", "i_cut_the_cheese_and_eat_a_little", "i_didn_t_take_the_train_to_the_airport", "i_do_my_homework_after_school", "i_do_not_like_that_my_hand_is_red",
  "i_do_not_like_the_mud", "i_do_not_put_my_hand_there_again", "i_do_that_too_grandma_says_she_stops_and_sings", "i_don_t_have_a_kite", "i_don_t_like_apples", "i_don_t_like_bananas",
  "i_don_t_like_meat", "i_drink_a_little_tea_and_eat_a_few_dumplings", "i_drink_the_milk_it_is_good", "i_drink_the_water", "i_eat_a_little", "i_eat_an_apple",
  "i_eat_an_apple_too", "i_eat_and_drink_then_i_put_my_cup_down", "i_eat_and_eat", "i_eat_and_eat_i_am_happy", "i_eat_dumplings_at_the_spring_festival", "i_eat_it_all_then_i_put_the_dish_in_the_water",
  "i_eat_rice", "i_eat_the_apple_first", "i_eat_the_bun", "i_eat_the_fish_first", "i_eat_the_last_piece_then_the_dish_is_clean", "i_eat_the_rice",
  "i_eat_the_rice_and_drink_the_water_then_i_put_my_cup_down", "i_feed_the_chickens_every_morning", "i_feed_the_cow_every_morning", "i_feel_better_and_stronger_now", "i_feel_better_today_thank_you", "i_feel_safe_in_the_living_room",
  "i_find_my_cap", "i_fixed_the_broken_lamp_before", "i_gave_it_water", "i_get_a_bun", "i_get_it_back_the_sand_is_on_my_hat", "i_get_jam_too",
  "i_get_my_bike_and_ride_i_ride_fast", "i_get_on_the_bus", "i_get_the_cake_a_book_says_grandma_ha", "i_get_up_and_walk_again", "i_get_up_and_walk_again_i_want_to_be_home", "i_get_up_at_six_o_clock",
  "i_get_up_at_six_thirty", "i_give_it_my_cake", "i_give_it_to_my_grandma", "i_give_it_water_i_put_the_pot_in_the_sun", "i_give_the_chick_food", "i_give_the_gift_to_mom",
  "i_give_the_seed_water", "i_give_the_seed_water_i_put_the_pot_in_the_sun", "i_go_down_the_road", "i_go_down_the_road_it_is_white_and_dry", "i_go_home_and_put_water_on_my_leg", "i_go_home_and_wash_my_leg",
  "i_go_home_at_five", "i_go_out_with_a_lamp", "i_go_to_school_on_foot", "i_go_to_the_park_on_sunday", "i_go_to_the_room", "i_go_to_the_tree_the_tree_is_good",
  "i_go_up_the_hill", "i_grab_it_at_last", "i_had_a_cold_and_slept_all_day", "i_had_a_cold_last_week", "i_had_a_dream_last_night", "i_had_to_wait_for_an_hour",
  "i_have_a_bag", "i_have_a_bag_my_bag_is_big", "i_have_a_ball", "i_have_a_basket", "i_have_a_big_family", "i_have_a_blue_flag",
  "i_have_a_cat", "i_have_a_coat", "i_have_a_coat_the_coat_is_thick", "i_have_a_coat_the_coat_is_thick_and_red", "i_have_a_cup", "i_have_a_cup_my_cup_is_red",
  "i_have_a_drum", "i_have_a_fever_and_a_runny_nose", "i_have_a_friend", "i_have_a_headache", "i_have_a_plate_of_vegetables", "i_have_a_pot",
  "i_have_a_pot_the_pot_is_small", "i_have_a_pot_the_pot_is_small_and_brown", "i_have_a_red_cap", "i_have_a_runny_nose", "i_have_a_shirt_and_a_skirt", "i_have_a_wish_for_the_chick",
  "i_have_a_wish_for_the_star", "i_have_an_apple_too", "i_have_art_on_monday", "i_have_breakfast_at_seven", "i_have_eleven_books", "i_have_five_books",
  "i_have_it_on_a_plate", "i_have_milk_and_bread_for_breakfast", "i_have_never_won_a_contest", "i_have_new_shoes_they_are_soft_and_very_fast", "i_have_rice_i_like_rice", "i_have_some_bread_and_milk",
  "i_have_ten_books", "i_have_to_rake_leaves", "i_have_twenty_three_books", "i_have_two_apples", "i_have_two_big_feet", "i_have_two_books",
  "i_have_two_cats", "i_have_two_hands", "i_help_her", "i_help_her_i_put_meat_in_the_middle", "i_help_mum_cook_dinner", "i_help_my_mum_with_the_housework",
  "i_hit_and_hit", "i_hit_the_drum", "i_hit_the_drum_with_my_hand", "i_hold_it_up_high", "i_hold_the_flag", "i_jump_and_spin",
  "i_jump_up_but_i_cannot_fly", "i_keep_looking_up", "i_know_the_password", "i_learn_english_at_school", "i_learned_to_skate_two_years_ago", "i_leave_my_book",
  "i_leave_my_book_i_go_to_the_classroom", "i_leave_my_book_i_go_to_the_room", "i_leave_the_hen_by_the_shed", "i_like_a_clean_dish", "i_like_a_dry_pot", "i_like_apples",
  "i_like_bananas", "i_like_cats", "i_like_cats_what_about_you", "i_like_dogs", "i_like_dogs_and_cats", "i_like_eggs_very_much",
  "i_like_fresh_cheese", "i_like_fresh_cheese_it_is_soft", "i_like_friday_because_we_play_ping_pong", "i_like_fruit", "i_like_green_beans", "i_like_green_leaves",
  "i_like_green_leaves_they_are_the_best_part_of_the_tree", "i_like_hot_corn", "i_like_it_very_much_cousin_writes_she_draws_a_small_picture_too", "i_like_it_very_much_his_cousin_writes_she_draws_a_small_picture_too", "i_like_jam", "i_like_jam_on_a_bun",
  "i_like_milk", "i_like_my_bag", "i_like_my_blue_flag", "i_like_my_book", "i_like_my_cat", "i_like_my_drum",
  "i_like_my_drum_i_like_the_sound", "i_like_my_little_bug", "i_like_my_name", "i_like_my_name_i_can_write_it_on_a_plate_too", "i_like_my_pot_and_seed", "i_like_my_pot_and_seed_i_will_water_them_tomorrow",
  "i_like_my_red_cap", "i_like_my_two_hands", "i_like_noodles", "i_like_red_do_you_like_blue", "i_like_rice", "i_like_sandwiches",
  "i_like_skating", "i_like_the_big_ball", "i_like_the_boat", "i_like_the_boat_i_want_to_go_on_it_one_day", "i_like_the_bus", "i_like_the_crab",
  "i_like_the_dog_and_the_tail", "i_like_the_dog_and_the_tail_i_watch_it_from_here", "i_like_the_dog_and_the_tail_i_watch_the_dog_from_here", "i_like_the_dog_and_the_tail_i_watch_them_from_here", "i_like_the_goat", "i_like_the_goat_i_go_up_the_hill_to_see_it",
  "i_like_the_moon_at_night", "i_like_the_moon_at_night_i_look_up_and_wait", "i_like_the_moon_at_night_i_look_up_at_the_sky", "i_like_the_playground", "i_like_the_pot", "i_like_the_rain_on_the_farm",
  "i_like_the_rain_on_the_farm_i_like_the_sun_after_it_too", "i_like_the_red_kite", "i_like_the_shed_and_the_hen", "i_like_the_shop_on_the_hill", "i_like_the_snow", "i_like_the_snow_i_like_the_street_now",
  "i_like_the_stars", "i_like_the_stars_at_night", "i_like_the_sun", "i_like_the_sun_but_i_like_the_tree_too", "i_like_to_give_gifts", "i_like_to_paint",
  "i_like_to_paint_i_will_paint_again_tomorrow", "i_like_to_play_this_way", "i_like_to_read_my_book", "i_look_after_my_sister", "i_look_at_the_bug", "i_look_at_the_clock",
  "i_look_at_the_clock_it_is_early", "i_look_at_the_road", "i_look_at_the_road_it_goes_up_the_hill", "i_look_at_the_sky", "i_look_by_the_door", "i_look_for_a_long_time",
  "i_look_for_it_on_the_path", "i_look_for_my_cap", "i_look_for_the_crab", "i_look_on_the_bed", "i_look_out_of_the_window_i_can_see_farms_and_rivers", "i_look_under_the_chair",
  "i_look_up_at_the_sky", "i_look_up_with_my_glass", "i_look_up_words_on_the_internet", "i_lost_my_bag_in_the_park_i_am_not_glad", "i_love_playing_the_violin", "i_love_you_so_much",
  "i_m_good_at_basketball", "i_m_wearing_a_blue_coat", "i_m_wearing_a_skirt", "i_make_a_ball_of_snow", "i_make_a_big_ball_of_snow", "i_make_a_card",
  "i_make_a_wish_for_the_chick", "i_make_one_more_ball_then_i_go_home", "i_make_the_bed_every_morning", "i_mop_and_mop", "i_need_a_haircut", "i_need_a_pair_of_gloves",
  "i_need_some_water", "i_noticed_a_new_student_in_class", "i_often_play_chess_with_him", "i_open_the_packet_a_note", "i_paint_a_leaf", "i_paint_a_leaf_i_take_a_green_pen",
  "i_paint_and_paint", "i_paint_and_paint_my_hands_are_green_now", "i_paint_it_green", "i_paint_it_green_i_go_slow", "i_paint_it_green_i_go_slow_so_the_line_is_clean", "i_paint_the_stem_too",
  "i_paint_the_stem_too_the_stem_is_thin", "i_paint_the_stem_too_the_stem_is_thin_and_green", "i_pay_ten_yuan", "i_pay_with_my_pocket_money", "i_pick_up_a_fresh_egg", "i_play_basketball_after_school",
  "i_play_in_the_afternoon", "i_play_on_the_weekend", "i_play_ping_pong_on_friday", "i_play_the_piano_and_he_plays_chess", "i_played_football_yesterday", "i_put_a_book_in_my_bag_too",
  "i_put_a_pen_in_my_bag", "i_put_a_seed_in_the_pot", "i_put_a_seed_in_the_pot_it_goes_into_the_ground", "i_put_it_in_the_mud", "i_put_it_out_in_the_sun", "i_put_jam_on_the_bun",
  "i_put_money_in_my_piggy_bank", "i_put_my_ball_in_it_now_it_is_too_big", "i_put_my_ball_in_it_now_the_bag_is_too_full", "i_put_my_hand_in_the_water", "i_put_my_hand_in_water", "i_put_my_hand_on_the_lid_it_is_hot",
  "i_put_my_hat_on_and_sit_in_the_sun", "i_put_the_dish_away", "i_put_the_fish_on_the_dish", "i_put_the_pot_in_the_sun", "i_put_too_much_in_my_dumpling_is_big_and_fat", "i_read_a_magazine",
  "i_read_a_magazine_yesterday_afternoon", "i_read_a_travel_blog", "i_read_and_read", "i_read_in_the_evening", "i_read_my_book", "i_read_my_book_and_wait",
  "i_ride_by_the_side", "i_ride_my_bike", "i_ride_my_bike_and_run", "i_run", "i_run_after_my_hat", "i_run_all_the_way_home",
  "i_run_and_run_i_am_not_sad_at_all", "i_run_and_run_it_is_fun_to_run", "i_run_and_run_running_is_good_too", "i_run_so_fast_fast_fast", "i_save_half_of_my_pocket_money", "i_save_up_for_a_new_microscope",
  "i_save_up_for_a_ticket_to_the_show", "i_saw_the_eiffel_tower_and_took_pictures", "i_say_my_name", "i_see_a_ball_and_a_flag", "i_see_a_big_brown_bear", "i_see_a_big_pot",
  "i_see_a_big_pot_it_is_in_the_kitchen", "i_see_a_bird", "i_see_a_black_and_white_bird", "i_see_a_black_cat", "i_see_a_bun", "i_see_a_bun_i_put_jam_on_the_bun",
  "i_see_a_bus", "i_see_a_crab_too", "i_see_a_hen_too", "i_see_a_little_bug", "i_see_a_moth", "i_see_a_pig",
  "i_see_a_pig_i_see_a_hen_too", "i_see_a_shop", "i_see_a_star", "i_see_a_star_then_i_see_two_stars", "i_see_a_tree", "i_see_a_tree_by_the_gate",
  "i_see_a_yellow_duck", "i_see_an_ant", "i_see_an_elephant", "i_see_blue", "i_see_grass_by_the_water", "i_see_many_flowers",
  "i_see_many_stars", "i_see_many_stars_in_the_sky", "i_see_mud", "i_see_red", "i_see_rice", "i_see_three_foxes",
  "i_see_two_fish", "i_see_two_horses", "i_see_two_mice_and_three_potatoes", "i_see_two_stars", "i_see_water", "i_sent_a_card_to_my_friend",
  "i_set_the_table_and_she_clears_it", "i_sing_to_the_sheep", "i_sit_and_listen", "i_sit_in_the_pit", "i_sit_on_a_stone", "i_sit_on_a_stone_i_rest_and_drink_some_water",
  "i_sit_on_a_stone_i_rest_for_a_bit", "i_sit_on_the_mat", "i_sleep_for_eight_hours", "i_slept_for_nine_hours", "i_spot_it_on_the_wall", "i_stamp_and_stamp",
  "i_stayed_at_home_and_watched_tv_last_weekend", "i_still_keep_my_old_toys", "i_stop_and_go_back_i_give_him_my_hand", "i_suggest_going_there_early", "i_sweep_the_floor", "i_swim_with_the_swan",
  "i_take_it_to_the_park", "i_take_my_hat_off", "i_take_photos_and_tell_stories", "i_take_the_ball", "i_take_the_ball_out", "i_thought_it_was_a_dream_then_i_woke_up",
  "i_use_a_knife_and_fork", "i_use_water", "i_visit_my_grandparents_on_sunday", "i_wait_and_do_not_move", "i_wait_and_wait", "i_wait_and_wait_i_wait_for_a_week",
  "i_wait_for_a_dry_day", "i_walk_and_i_walk", "i_walk_and_i_walk_the_sun_is_hot", "i_walk_back_home", "i_walk_on_the_path", "i_walk_on_the_street",
  "i_walk_slowly_and_hold_it_in_my_hands", "i_walk_slowly_and_hold_it_up", "i_walk_to_school_every_day", "i_walk_to_school_with_my_friend", "i_want_a_box_of_milk", "i_want_a_pair_of_shoes",
  "i_want_fish_and_chips", "i_want_it_dry", "i_want_more_fresh_cheese", "i_want_more_milk_mom_gives_me_more", "i_want_some_cake", "i_want_this_day_to_last",
  "i_want_to_come_back", "i_want_to_come_back_i_will_come_again_next_year", "i_want_to_go_to_bed", "i_want_to_look_in_the_pot", "i_want_to_save_money_to_buy_a_globe", "i_want_to_see_beijing_opera_one_day",
  "i_was_a_bit_scared", "i_was_happy_yesterday", "i_was_in_paris_last_year", "i_wash_and_wash", "i_wash_my_hands_with_water", "i_wash_the_dish",
  "i_wasn_t_at_home_yesterday", "i_watch_the_boat", "i_watch_the_boat_i_look_for_a_long_time", "i_watch_the_long_wing", "i_watch_the_long_wing_i_wish_i_could_fly", "i_watch_the_long_wings_i_wish_i_could_fly",
  "i_watch_the_moth", "i_watch_the_swan", "i_watch_tv_after_dinner", "i_wear_a_sweater_in_winter", "i_wear_my_cap", "i_wear_the_coat",
  "i_wear_the_coat_i_put_my_hands_in_it", "i_went_to_beijing_last_year", "i_went_to_turpan_last_year", "i_win_the_flag", "i_wish_and_wish", "i_wish_i_could_fly",
  "i_wish_to_see_the_pyramids_one_day", "i_woke_up_at_seven", "i_write_with_a_pen", "ice_cream_is_made_from_milk", "ideas_can_change_things", "if_a_word_is_new_read_to_the_end_of_the_sentence_before_you_stop_to_guess_its_meaning",
  "if_the_ground_is_wet_the_seed_can_grow_a_root_goes_down_and_a_stem_comes_up", "if_the_tea_stands_a_long_time_it_gets_cold_the_heat_goes_away_little_by_little", "if_we_plant_trees_the_air_will_be_cleaner", "if_you_are_tired_have_a_rest", "if_you_can_tell_it_you_have_read_it", "if_you_can_tell_it_you_have_read_it_it_was_a_good_lesson",
  "if_you_can_tell_it_you_have_read_it_it_was_worth_thinking_about", "if_you_cannot_you_know_exactly_which_page_to_open_again_that_is_a_useful_feeling", "if_you_have_the_flu_stay_at_home", "important_the_earth_s_shadow_is_not_what_makes_the_phases_that_is_an_eclipse", "in_american_english_the_r_is_always_sounded_after_a_vowel", "in_autumn_farmers_cut_it_and_take_it_home",
  "in_british_english_a_car_may_sound_like_cah", "in_early_spring_he_repairs_the_tools_soaks_the_rice_seed_and_watches_the_willow_buds_by_the_ditch", "in_knee_the_k_is_quiet", "in_knee_the_k_is_quiet_you_do_not_say_it", "in_knee_the_k_is_quiet_you_do_not_say_it_but_it_stays_in_the_word", "in_late_spring_the_whole_family_transplants_the_young_shoots_standing_knee_deep_in_cold_mud",
  "in_my_spare_time_i_collect_comic_books", "in_spring_grandpa_places_each_seed_in_soft_mud", "in_spring_he_turns_the_dirt_and_plants_the_seeds", "in_summer_the_sun_is_strong_and_high_the_air_is_hot_and_people_feel_it_all_day", "in_the_corner_of_the_shed_stood_an_old_black_bicycle_with_a_dusty_seat_and_two_flat_tyres", "in_the_mooncake_promise_the_dough_changes_three_times_and_so_does_lili_s_patience",
  "in_the_morning_he_cannot_find_it_his_cap_is_under_the_bed_too", "in_the_morning_ming_is_awake_in_the_bed_he_sees_the_pig_next_to_him", "in_the_morning_ming_wakes_up_and_eats_then_he_runs_and_jumps_with_his_friends", "in_the_morning_ming_wakes_up_in_the_big_bed_he_sees_the_pig_next_to_him", "in_the_morning_she_draws_it_on_a_big_sheet_of_paper", "in_the_morning_the_book_is_quiet_again_it_sits_on_the_desk_like_any_other_book",
  "in_the_sun_the_stem_is_thin_and_small", "in_winter_the_air_is_cold_outside_people_wear_coats_and_a_scarf_to_keep_warm", "in_write_the_w_is_quiet", "in_write_the_w_is_quiet_it_is_there_but_you_do_not_say_it", "inside_is_sweet_bean_paste_and_a_golden_egg_yolk_lili_says", "inside_is_white_rice_we_wash_it_then_cook_it",
  "inside_it_is_money_ming_smiles_at_the_thick_red_paper", "inside_the_boat_there_is_a_lot_of_room_that_room_is_full_of_air", "inside_the_boat_there_is_a_lot_of_room_the_room_is_full_of_air", "is_he_your_cousin_yes_he_is", "is_it_a_cat_or_a_dog", "is_it_a_crocodile_yes_it_is",
  "is_it_an_orange", "is_it_coming_asks_grandpa", "is_it_deep_asks_grandma", "is_it_far_i_ask_not_far_says_mom_two_hours", "is_it_in_my_sock", "is_it_in_the_box_no_it_isn_t",
  "is_it_on_the_rock", "is_it_working_at_all_asks_grandma", "is_it_working_at_all_asks_grandpa", "is_it_working_at_all_asks_lili", "is_it_working_at_all_asks_ming", "is_it_working_at_all_asks_mom",
  "is_she_doing_gymnastics_yes_she_is", "is_she_wearing_glasses_yes_she_is", "is_someone_else_hungry_asks_dad", "is_that_your_mother_yes_she_is", "is_the_water_coming_up_asks_dad", "is_the_wind_right_asks_grandma",
  "is_there_any_cheese_yes_there_is", "is_this_a_computer_yes_it_is", "is_this_a_dog", "is_this_a_pencil_yes_it_is", "is_this_pen_yours_yes_it_is_mine", "is_this_your_father_yes_he_is",
  "is_this_your_sister_yes_she_is", "is_this_yours_she_says_it_is_i_say", "is_this_yours_the_man_asks_he_gives_it_back_before_the_wind_takes_it", "it_adds_up_again", "it_adds_up_again_by_spring_he_finishes_a_whole_book", "it_adds_up_again_by_spring_he_finishes_a_whole_book_and_he_reads_the_last_page_twice",
  "it_adds_up_again_by_spring_he_finishes_a_whole_book_he_reads_the_last_page_again", "it_began_as_just_three_words_now_the_corner_has_a_name", "it_began_as_three_words_on_a_board_now_the_corner_has_a_name", "it_begins_in_early_spring_when_the_seed_is_soaked_in_water_for_two_days_and_then_kept_warm", "it_can_get_big", "it_can_pick_up_a_bug",
  "it_can_push_a_boat_on_the_water", "it_can_rush_and_run", "it_can_track_in_the_dark", "it_chirps_and_chirps", "it_chirps_first_at_sun_up", "it_chirps_for_a_bug",
  "it_comes_out_it_is_wet", "it_does_not_come_at_first", "it_does_not_come_at_first_he_sits_and_thinks_hard", "it_does_not_come_at_first_he_sits_and_thinks_hard_but_nothing_comes", "it_does_not_look_right", "it_does_not_look_right_it_was_a_little_disappointing",
  "it_does_not_look_right_something_is_wrong", "it_dropped_stones_in", "it_dug_and_dug", "it_eats_food_and_drinks_water", "it_falls_by_a_bench_ming_runs_after_it", "it_falls_by_a_bench_ming_runs_after_it_because_he_wants_it_back",
  "it_falls_down", "it_feels_like_home", "it_floats_up_over_the_green_tree", "it_found_a_jar_with_water", "it_gets_dark_in_the_room_they_had_been_here_before", "it_gets_easier_and_easier",
  "it_gets_easier_and_easier_by_the_end_of_the_week_they_look_good", "it_goes_back_to_the_stone", "it_goes_up_and_up_we_can_not_see_the_line", "it_grows_and_grows", "it_grows_and_grows_every_day", "it_had_a_clever_wish",
  "it_had_a_home_with_it", "it_had_to_carry_it_all_day", "it_has_a_big_body_and_a_long_tail", "it_has_a_big_load", "it_has_a_long_tail", "it_has_marks_on_it",
  "it_has_no_legs_it_can_swim_fast", "it_helps_me_every_day", "it_hides_in_the_grass", "it_hides_in_the_rocks_below", "it_hides_it_in_a_stone", "it_holds_its_head_up_high",
  "it_hopes_to_get_it_back", "it_is_a_big_big_pig", "it_is_a_big_day", "it_is_a_big_stone_under_the_ground", "it_is_a_blue_bag", "it_is_a_bright_night",
  "it_is_a_deep_night", "it_is_a_panda", "it_is_a_quiet_night_by_the_lake_the_moon_is_round_and_bright_in_the_sky", "it_is_a_small_map", "it_is_a_very_little_door_ming_looks_at_it_for_a_long_time", "it_is_a_very_small_ball",
  "it_is_clean_he_puts_it_deep_in_his_bag", "it_is_clean_he_puts_it_deep_in_his_bag_so_the_wind_cannot_get_it_again", "it_is_cold_i_have_a_cold", "it_is_cold_today", "it_is_dangerous_to_swim_in_the_river", "it_is_dark_and_far",
  "it_is_dark_in_my_room", "it_is_early", "it_is_far_far_off", "it_is_fifty_meters_long", "it_is_fine_today", "it_is_first_up_in_the_dark",
  "it_is_five_kilometres_away", "it_is_fun_to_run_in_the_wind_the_wind_is_good_to_us_because_it_is_kind", "it_is_glad_to_see_me", "it_is_good_i_want_more", "it_is_good_to_be_together_they_will_do_this_again_when_the_next_big_day_comes", "it_is_grandma_s_name",
  "it_is_grandma_s_name_ming_sees_it_now", "it_is_grandma_s_name_ming_sees_it_now_and_he_smiles", "it_is_hard_to_cut", "it_is_her_first_day_too", "it_is_high_over_the_park_grandma_is_at_the_gate", "it_is_hotter_today_than_yesterday",
  "it_is_hungry", "it_is_in_a_tree", "it_is_just_a_stone", "it_is_just_six_o_clock", "it_is_just_the_book_in_the_room_they_were_glad_they_kept_looking", "it_is_more_than_twenty_thousand_kilometres_that_is_a_lot",
  "it_is_my_cat", "it_is_my_duck", "it_is_my_first_day", "it_is_my_lamp_now", "it_is_nice_by_the_window_he_can_see_the_sky", "it_is_nice_i_will_take_it",
  "it_is_nice_to_sit_in_the_sun_then_we_get_up_and_have_a_run", "it_is_not_a_dog_it_is_a_cat", "it_is_not_a_normal_calendar_each_square_holds_one_job_that_the_fields_will_need_that_month", "it_is_not_a_school_day", "it_is_not_huge", "it_is_not_safe_to_run_in_the_kitchen",
  "it_is_not_there", "it_is_on_a_dish", "it_is_on_my_dog", "it_is_on_the_tail", "it_is_raining_now", "it_is_rainy_in_sydney",
  "it_is_seven_o_clock", "it_is_small_and_it_feels_warm", "it_is_so_round_and_bright", "it_is_sports_day_everyone_is_on_the_playground", "it_is_still_here", "it_is_still_not_easy_it_was_a_little_disappointing",
  "it_is_still_not_here", "it_is_tall_now", "it_is_the_wind_it_pushes_at_the_window_because_it_wants_to_come_in", "it_is_the_wrong_game", "it_is_time_for_soup", "it_is_time_to_go",
  "it_is_time_to_harvest", "it_is_time_to_harvest_the_farmer_comes_early", "it_is_time_to_harvest_the_farmer_comes_early_because_the_day_will_be_hot", "it_is_time_to_ride", "it_is_twenty_yuan", "it_is_warm_in_spring",
  "it_is_windy_today", "it_jumps_up_and_gets_the_bug", "it_keeps_its_eyes_open", "it_leaves_a_smell_on_the_way_the_other_ants_follow_the_smell", "it_likes_the_fast_ride", "it_lives_in_the_mountains_of_china_the_mountains_are_green",
  "it_looks_a_little_strange_now", "it_looks_at_the_cheese", "it_looks_at_the_chips", "it_looks_down_at_us_and_smiles", "it_looks_for_food", "it_looks_for_food_it_smells_the_bread",
  "it_looks_hard", "it_looks_hard_he_thinks_she_will_not_share", "it_looks_hard_he_thinks_she_will_not_share_and_he_is_not_happy", "it_looks_hard_he_thinks_she_will_not_share_he_is_not_happy", "it_may_be_a_cold_let_s_call_the_doctor", "it_naps_on_my_hat",
  "it_needs_sun_and_rain", "it_plays_with_the_little_cat", "it_reads_word_by_word_nice_and_slow_nobody_sits_by_the_desk_at_that_hour", "it_rides_by_my_side", "it_runs_to_me_the_chick_is_big_now", "it_s_good_for_you",
  "it_s_nine_o_clock", "it_seems_too_small", "it_seems_too_small_the_tree_is_still_far_away", "it_sits_and_waits", "it_sleeps_by_the_door", "it_smells_the_bread_so_it_comes_near",
  "it_sounds_broken_not_like_a_sentence", "it_sounds_broken_not_like_a_sentence_it_was_a_little_disappointing", "it_started_small_now_the_stem_is_tall", "it_starts_to_rain_we_put_on_a_coat", "it_still_does_not_work", "it_still_looks_strange_in_the_dark",
  "it_still_swims_but_it_can_hop_too", "it_swims_on_the_water_it_comes_to_me", "it_takes_a_long_long_time", "it_takes_a_very_long_long_time", "it_takes_the_cake", "it_takes_the_whole_cake",
  "it_takes_time_to_grow_each_day_he_adds_one_small_part", "it_takes_two_hours_by_train", "it_took_time_to_grow", "it_walks_like_a_little_man", "it_walks_on_the_sand", "it_wants_a_big_room",
  "it_wants_a_boat", "it_was_a_bug", "it_was_a_soft_sound", "it_was_dark_and_late", "it_was_dark_on_the_hill", "it_was_grandma",
  "it_was_grandma_ming_sees_her_name", "it_was_grandma_ming_sees_her_name_and_knows", "it_was_my_cat", "it_was_small_at_first_look_at_it_now", "it_was_small_at_first_now_the_stem_is_tall", "it_was_so_small",
  "it_was_the_best_day", "it_was_the_wind", "it_was_the_wind_it_pushes_at_the_window", "it_was_the_wind_it_pushes_at_the_window_because_it_wants_to_come_in", "it_was_there_all_along", "it_was_there_all_along_he_just_could_not_find_it",
  "it_was_time_to_fly", "it_was_too_quiet_now", "it_weighs_about_one_hundred_grams_less_than_a_small_apple", "it_will_be_sunny_tomorrow", "its_front_paws_have_a_special_thumb_that_helps_it_grip_the_stems", "its_head_was_as_big_as_a_small_car",
  "its_shell_was_so_small", "its_tail_is_long", "its_wish_is_a_big_bone", "jump_lamb_jump", "june_is_after_may", "just_a_big_weed",
  "just_read_the_sound", "just_read_the_sound_do_not_read_every_letter", "just_read_the_sound_do_not_read_every_letter_because_some_are_quiet", "just_the_fork_is_left", "keep_one_question_in_your_head_as_you_read_what_has_changed_since_the_last_page", "keep_practicing",
  "keep_practicing_tomorrow_he_will_try_a_new_word", "keep_practicing_tomorrow_he_will_try_a_new_word_because_the_old_one_is_easy_now", "keep_still_please", "knee_and_write", "knee_and_write_now_say_them_together", "knee_and_write_now_say_them_together_and_keep_the_quiet_letters_in",
  "knee_write_knee_write", "last_weekend_i_cleaned_my_room", "leaves_fall_in_autumn", "leaving_too_early_means_missing_it", "let_us_go_to_the_zoo", "let_us_make_a_cake_says_ming",
  "let_us_make_a_cup_says_lili", "let_us_make_a_dish_says_ming", "let_us_make_a_drawing_says_grandpa", "let_us_make_a_dumpling_says_ming", "let_us_make_a_flag_says_lili", "let_us_make_a_gift_says_ming",
  "let_us_make_a_letter_says_ming", "let_us_make_a_mooncake_says_lili", "let_us_make_a_pot_says_mom", "let_us_make_a_tail_says_mom", "let_your_eyes_go_on_to_the_end_of_the_line", "letters_and_pictures",
  "letters_and_pictures_they_can_go_a_long_way", "letters_and_pictures_they_can_go_a_long_way_when_someone_waits_for_them", "letters_carry_good_words", "letters_carry_good_words_ming_will_keep_this_one", "letters_carry_good_words_they_go_a_long_way", "light_can_come_from_far_away_the_light_of_the_sun_comes_a_long_way_before_it_gets_to_us",
  "light_can_come_from_far_away_the_light_of_the_sun_comes_a_long_way_to_us", "light_helps_us_see_red_and_blue_in_the_dark_all_things_look_the_same", "light_is_in_the_day_and_in_the_night_with_light_we_can_see_the_world", "lili_adds_a_small_red_flower_and_three_bright_yellow_stars_at_the_top", "lili_asks_grandpa_why_the_stars_are_so_far_away", "lili_borrows_a_cap_from_grandpa",
  "lili_cannot_follow_the_story", "lili_carries_water_in_a_small_pail_for_the_seeds", "lili_closes_the_book_and_tells_it_again_both_of_them_felt_the_same_way_we_say_the_words_again_wheel_and_world", "lili_closes_the_book_and_tells_it_again_it_was_a_good_moment_we_say_the_words_again_planet_and_planet", "lili_closes_the_book_and_tells_it_again_it_was_a_good_moment_we_say_the_words_again_suggest_and_team", "lili_closes_the_book_and_tells_it_again_we_say_the_words_again_field_and_hair",
  "lili_closes_the_book_and_tells_it_again_we_say_the_words_again_home_and_horse", "lili_closes_the_book_and_tells_it_again_we_say_the_words_again_horse_and_hen", "lili_closes_the_book_and_tells_it_again_we_say_the_words_again_kite_and_knee", "lili_closes_the_book_and_tells_it_again_we_say_the_words_again_mouse_and_plate", "lili_closes_the_book_and_tells_it_again_we_say_the_words_again_pork_and_farmer", "lili_could_not_picture_that_she_asked_whether_the_bicycle_had_ever_carried_the_whole_family",
  "lili_does_not_want_to_be_afraid", "lili_draws_a_big_yellow_sun_doudou_puts_a_paw_on_the_paper", "lili_draws_a_map_of_our_route_and_marks_every_stop_with_a_dot", "lili_draws_first_then_ming_he_waits_and_watches_her_work", "lili_draws_first_then_ming_he_waits_and_watches_her_work_because_that_was_the_plan", "lili_dreams_of_a_bright_star_over_the_hills",
  "lili_drops_a_leaf_it_floats_away", "lili_drops_her_bag_ming_grabs_it", "lili_finishes_her_part_ming_picks_up_the_pen", "lili_gets_a_pail_ming_gets_a_pot", "lili_gets_one_too_she_hides_it_in_a_pocket", "lili_gives_it_some_food",
  "lili_has_a_better_idea", "lili_has_a_better_idea_two_pairs_of_eyes_see_more", "lili_has_a_coat_too", "lili_has_a_cup", "lili_has_a_green_kite_and_a_long_tail", "lili_has_a_new_toy_doudou_wants_that_toy_but_he_must_not_take_it",
  "lili_has_a_red_sock", "lili_has_an_idea_at_home", "lili_has_an_idea_at_home_they_had_been_here_before", "lili_has_an_idea_on_the_playground", "lili_has_just_finished_a_book_at_home", "lili_has_just_finished_a_book_at_the_beach",
  "lili_has_just_finished_a_book_in_the_classroom", "lili_has_just_finished_a_book_in_the_library", "lili_has_just_finished_a_book_in_the_library_they_had_been_here_before", "lili_has_just_finished_a_book_in_the_park", "lili_has_some_jam_and_a_book", "lili_is_at_home_with_a_cat",
  "lili_is_glad_to_see_the_coat_again", "lili_is_on_the_farm_with_a_duck", "lili_is_playing_alone_with_the_drum", "lili_keeps_the_old_sheets_in_a_box_twelve_years_of_weather_she_says_written_in_grandpa_s_hand", "lili_laughs_grandpa_laughs_too_we_say_the_words_again_cube_and_face", "lili_listens_then_reads_it_in_two_parts",
  "lili_looks_at_a_board_and_a_note_they_had_been_here_before", "lili_looks_at_a_mouse_and_a_photo", "lili_looks_at_it_more_closely_they_did_their_best_at_this_step", "lili_looks_up_for_the_rabbit_ming_says_he_can_see_its_long_ears", "lili_once_asked_why_he_did_not_just_look_at_the_date_grandpa_said_the_trees_are_never_late", "lili_opens_a_book_at_the_station",
  "lili_opens_a_book_in_the_field", "lili_paints_the_name_on_the_board_ming_puts_the_first_book_in", "lili_paints_the_name_on_the_board_ming_puts_the_first_book_in_and_the_corner_is_ready", "lili_picks_it_up_and_claps", "lili_plays_the_whole_sentence", "lili_presses_each_piece_flat_with_her_palm_some_are_round_some_are_not",
  "lili_put_down_the_umbrella_and_helped_gather_them_ming_chased_one_that_was_floating_toward_a_drain", "lili_puts_a_duck_on_the_farm", "lili_puts_in_five_eggs_and_a_cup_of_milk", "lili_reads_it_once_more_smiling_we_say_the_words_again_country_and_courage", "lili_reads_it_once_more_smiling_we_say_the_words_again_imagine_and_important", "lili_reads_it_one_word_at_a_time",
  "lili_s_kite_is_old_and_small_it_has_no_tail", "lili_s_team_is_short_of_one_runner_she_calls_ming", "lili_said_they_could_turn_back_but_the_flooded_road_would_be_worse_now_so_they_kept_going", "lili_says_ask_someone_who_works_here", "lili_says_being_a_seed_was_hard_ming_says_forgetting_was_harder", "lili_says_bring_it_back_when_you_can",
  "lili_says_go_slow_and_do_one_small_part_two_pairs_of_eyes_see_more", "lili_says_guess_again_and_then_check", "lili_says_guess_again_and_then_check_two_pairs_of_eyes_see_more", "lili_says_let_us_go_back_and_look_again", "lili_says_look_at_one_part_at_a_time", "lili_says_look_at_the_small_details",
  "lili_says_make_a_little_song_about_it_two_pairs_of_eyes_see_more", "lili_says_tell_me_who_where_then_what", "lili_says_the_best_part_is_not_winning_it_is_twenty_people_moving_as_one", "lili_says_you_can_have_it_first", "lili_says_you_can_have_it_first_they_did_their_best_at_this_step", "lili_sings_the_song_too",
  "lili_starts_again_in_order", "lili_starts_again_in_order_this_time_they_went_more_slowly", "lili_stops_and_thinks", "lili_stops_to_take_a_picture_of_a_green_bird", "lili_takes_a_map_out_of_her_bag_a_map_shows_the_whole_town_on_paper", "lili_tells_the_last_part_first",
  "lili_tells_the_last_part_first_they_did_their_best_at_this_step", "lili_thinks_about_the_board_in_the_book_they_wrote_three_words_on_the_board_kite_knee_and_knife", "lili_thinks_about_the_boat_in_the_book_we_say_boat_snail_and_spoon_again", "lili_thinks_about_the_cat_in_the_book_we_say_cat_one_and_cup", "lili_thinks_about_the_change_in_the_book_they_looked_more_than_once_three_words_mattered_that_day_suggest_team_and_weather", "lili_thinks_about_the_jam_in_the_book_we_say_shop_top_and_tub",
  "lili_thinks_about_the_journey_in_the_book_they_looked_more_than_once_three_words_mattered_that_day_planet_planet_and_journey", "lili_thinks_about_the_mouse_in_the_book_they_made_a_list_mouse_plate_and_rope", "lili_thinks_about_the_night_in_the_book_before_they_went_on_they_wrote_down_home_horse_and_house", "lili_thinks_about_the_park_in_the_book_they_wrote_down_three_words_horse_hen_and_hill", "lili_thinks_about_the_park_in_the_book_they_wrote_down_three_words_pork_farmer_and_cart", "lili_thinks_about_the_question_in_the_book_they_looked_more_than_once_they_wrote_three_words_on_the_board_wheel_world_and_wrist",
  "lili_thinks_about_the_question_in_the_book_they_wrote_three_words_on_the_board_field_hair_and_harvest", "lili_thinks_about_the_zoo_in_the_book_we_say_chain_grandpa_and_grapes_again", "lili_thinks_about_the_zoo_in_the_book_we_say_zoo_chain_and_pool_again", "lili_tries_the_same_thing_again", "lili_uses_it_well_and_looks_after_it", "lili_wants_it_grandpa_wants_it_too",
  "lili_wants_one_of_her_own_ming_gives_her_a_pen", "lili_wants_to_do_it_alone", "lili_wants_to_feed_it", "lili_wants_to_find_one_special_shell", "lili_wants_to_fix_it", "lili_wants_to_hear_all_about_it",
  "lili_wants_to_keep_it_safe", "lili_wants_to_mix_them", "lili_wants_to_read_it_out_loud", "lili_wants_to_see_it_change", "lili_wants_to_try_it_too_she_puts_her_bag_next_to_his", "lili_wants_to_try_it_too_she_puts_her_bag_next_to_his_so_they_can_both_do_it",
  "lili_wants_to_use_it_for_a_day", "lili_will_return_what_is_not_theirs", "lili_writes_one_line_in_her_diary_ask_where_not_just_who", "listen_and_share", "listen_to_me", "listen_to_the_small_difference_here_you_are_coming_you_are_coming",
  "listen_to_the_two_words_point_to_the_long_one", "listening_first_made_saying_easier", "little_fish_see_the_moon_in_the_water_they_swim_up_to_say_hello_to_it", "long_and_short_now_say_them_all_again", "long_noodles_are_fun", "long_noodles_are_fun_they_are_hard_to_pick_up",
  "long_noodles_are_fun_they_are_hard_to_pick_up_so_people_eat_them_slowly", "look_around_at_night_and_see_the_lights_some_are_big_and_some_are_small", "look_at_a_boat_on_the_water_next_time_its_shape_and_its_room_keep_it_up", "look_at_a_boat_on_the_water_next_time_its_shape_and_the_room_inside_keep_it_up", "look_at_it_night_after_night_you_will_see_it_change", "look_at_it_night_after_night_you_will_see_it_change_because_we_see_different_parts",
  "look_at_the_big_hot_sun", "look_at_the_birds_that_fly_up_so_high_they_fly_in_the_wide_blue_sky", "look_at_the_moon", "look_at_the_moon_tonight", "look_at_the_moon_tonight_see_which_part_is_bright", "look_at_the_moon_tonight_see_which_part_is_bright_and_which_part_is_dark",
  "look_at_the_tree", "look_at_this_big_stone", "look_at_this_flower", "look_at_those_wings", "look_the_hat_is_on_the_cat", "look_up_at_the_sky_in_the_day_you_can_see_many_white_clouds",
  "look_up_grandpa_says_the_moon_is_very_round_tonight", "looking_from_far_away_does_not_help", "looking_from_far_away_does_not_help_it_was_a_little_disappointing", "looking_from_two_sides_helps", "make_a_game", "make_a_game_it_is_not_hard_and_it_is_fun",
  "many_ants_have_one_home_they_work_and_work_there_all_day", "many_bees_are_together_in_one_home_there_is_one_mom_bee_and_many_worker_bees", "many_moths_are_falling_it_is_the_season_we_look_at_the_moth_and_the_dish", "many_people_are_busy", "mars_is_a_planet", "may_i_borrow_your_pen",
  "may_i_have_another_glass_of_water", "maybe_they_will_raise_money_for_charity", "maybe_we_will_go_by_train", "measuring_is_useful", "measuring_is_useful_he_wants_to_measure_the_snow", "measuring_is_useful_he_wants_to_measure_the_snow_and_he_will_use_the_same_cup",
  "measuring_needs_a_way", "measuring_needs_a_way_this_way_is_simple", "measuring_needs_a_way_this_way_is_simple_and_you_can_do_it_too", "men_carried_big_stones_up_the_hill_by_hand", "men_made_it_by_hand_stone_by_stone", "mike_and_i_are_good_friends",
  "milk_in_a_glass", "milk_is_in_my_cup", "milk_on_the_desk", "millions_of_insects_live_in_the_rainforest", "mimi_can_nap_on_a_mat", "mimi_can_run_and_jump",
  "mimi_comes_down_at_last_lili_wraps_her_in_a_towel_and_holds_her_close", "mimi_comes_home_at_six_now_she_is_sleepy", "mimi_has_a_chip_too", "mimi_has_a_ring", "mimi_is_a_cat", "mimi_is_in_the_bag_too",
  "mimi_is_my_cat_she_sleeps_all_day", "mimi_is_not_sad_now", "mimi_is_on_the_wall_she_is_not_alone", "mimi_is_sad", "mimi_jumps_and_lands_on_the_flat_step", "mimi_jumps_she_grips_the_tail_and_hangs_on",
  "mimi_sees_it_she_jumps_at_the_tail", "mimi_sits_by_the_chick", "mimi_sits_in_the_tree_she_sees_us", "mimi_sits_on_the_steps", "mimi_slips_she_grabs_the_step", "mimi_the_cat_is_on_the_bed_she_listens_hard_and_does_not_move",
  "mine_opens_in_the_water_now_it_is_soup", "ming_adds_a_short_note_he_tells_her_about_the_garden_that_grandpa_keeps", "ming_and_grandma_are_at_home", "ming_and_grandma_are_at_home_they_had_been_here_before", "ming_and_grandma_are_in_the_park", "ming_and_grandma_are_on_the_farm",
  "ming_and_grandpa_laugh_and_laugh_the_cat_is_happy_but_grandpa_is_not", "ming_and_lili_get_it_back", "ming_and_lili_go_out_to_see_and_they_find_a_little_yellow_bee", "ming_and_lili_go_to_a_fish_shop", "ming_and_lili_look_at_the_map_they_find_the_road_that_goes_to_the_park", "ming_and_lili_nod",
  "ming_and_lili_plant_a_small_green_tree_today", "ming_and_lili_walk_in_a_new_town_they_do_not_know_the_way_to_the_park", "ming_and_mom_go_to_the_market", "ming_and_mom_go_to_the_market_they_take_a_basket", "ming_and_mom_go_to_the_market_they_take_a_basket_because_they_will_buy_a_lot", "ming_and_the_hen_run",
  "ming_and_the_wind_like_to_run_they_run_together_under_the_sun", "ming_asks_a_better_question", "ming_asks_a_better_question_he_stops_and_thinks_first", "ming_asks_a_better_question_he_stops_and_thinks_first_before_he_says_a_word", "ming_asks_about_the_dry_pots_she_writes_his_question_down", "ming_asks_about_the_dry_pots_she_writes_his_question_down_because_it_is_a_good_one",
  "ming_asks_for_help", "ming_asks_for_help_he_asks_a_man_at_the_gate", "ming_asks_for_help_he_asks_a_man_at_the_gate_when_he_sees_him", "ming_asks_to_try_grandma_says_he_can_watch_today", "ming_asks_to_try_grandma_says_he_can_watch_today_and_he_can_try_next_year", "ming_asks_what_does_it_mean",
  "ming_asks_what_does_it_mean_grandma_comes_to_his_desk", "ming_asks_whether_a_phone_could_do_it_better_grandpa_smiles_and_says_a_phone_never_feels_the_wind", "ming_began_to_worry_grandma_would_be_waiting_and_nobody_knew_where_they_were", "ming_brings_an_apple_for_the_little_family_the_apple_is_big_for_them_but_they_are_happy", "ming_brought_a_basin_of_water_lili_found_a_rag_a_small_brush_and_an_old_tin_of_oil", "ming_buys_an_apple",
  "ming_buys_an_apple_it_is_red_and_bright", "ming_can_hear_the_clock_in_his_room_at_night_the_little_sound_goes_on_all_night", "ming_can_hear_the_loud_sounds_across_the_street_he_can_hear_the_quiet_ones_when_he_is_close", "ming_can_ride_the_bike", "ming_can_ride_the_bike_dad_lets_go", "ming_can_ride_the_bike_dad_lets_go_and_ming_goes_on",
  "ming_can_ride_the_bike_you_can_do_it_dad_says_and_he_lets_go", "ming_can_see_that_he_grows_fast_the_line_on_the_wall_goes_up_and_up", "ming_can_see_the_stars_at_night_the_moon_gives_just_enough_soft_light", "ming_cannot_follow_the_story", "ming_cannot_follow_the_story_it_was_a_little_disappointing", "ming_changes_one_small_thing",
  "ming_changes_one_small_thing_each_day_he_writes_one_new_word", "ming_changes_one_small_thing_each_day_he_writes_one_new_word_before_bed", "ming_changes_the_plan_a_little", "ming_changes_the_plan_a_little_he_puts_that_pot_in_the_sun", "ming_changes_the_plan_a_little_he_puts_that_pot_in_the_sun_and_marks_the_day_on_the_board", "ming_changes_the_plan_a_little_he_puts_that_pot_in_the_sun_he_marks_the_day_on_the_board",
  "ming_checks_the_laundry_basket_grandpa_looks_in_the_shed_and_the_old_box", "ming_claps_his_hands_lili_claps_too", "ming_closes_his_eyes_and_goes_to_sleep_the_wind_is_quiet_and_the_night_is_deep", "ming_counts_again", "ming_counts_again_he_starts_from_one_again", "ming_counts_again_he_starts_from_one_again_because_he_is_not_sure",
  "ming_counts_the_coins", "ming_counts_the_coins_he_puts_them_in_a_line", "ming_counts_the_coins_he_puts_them_in_a_line_so_he_will_not_miss_one", "ming_counts_the_minutes_one_hundred_and_twenty_grandma_says", "ming_counts_them_all", "ming_counts_them_all_he_goes_slowly_this_time",
  "ming_counts_them_all_he_goes_slowly_this_time_so_he_gets_it_right", "ming_does_not_fall", "ming_does_not_fall_he_is_careful", "ming_does_not_fall_he_is_careful_so_the_bike_stays_up", "ming_does_not_find_the_ball", "ming_does_not_find_the_ball_he_sits_down_to_think",
  "ming_does_not_find_the_ball_he_sits_down_to_think_because_he_is_tired", "ming_does_not_move_the_pots_he_wants_to_see_what_will_happen", "ming_does_not_read_to_the_book_at_night_at_night_the_book_reads_to_him", "ming_does_not_rush", "ming_does_not_rush_he_paints_one_page_each_day", "ming_draws_a_house",
  "ming_draws_a_house_he_makes_it_big_and_warm", "ming_draws_a_picture", "ming_draws_a_picture_he_sits_at_the_desk", "ming_draws_a_picture_he_sits_at_the_desk_because_the_light_is_good_there", "ming_draws_a_picture_he_uses_a_new_pen", "ming_draws_a_picture_he_uses_a_new_pen_that_grandma_gave_him",
  "ming_draws_a_window_on_it", "ming_draws_a_window_on_it_he_draws_a_small_ming_in_it", "ming_draws_a_window_on_it_he_draws_a_small_ming_that_looks_out_of_it", "ming_draws_more_pictures", "ming_draws_more_pictures_one_is_for_grandma", "ming_draws_more_pictures_one_is_for_grandma_and_one_is_for_mom",
  "ming_draws_the_garden", "ming_draws_the_garden_he_draws_the_green_grass", "ming_draws_the_garden_he_draws_the_green_grass_and_he_adds_a_small_bug", "ming_draws_the_sun_too", "ming_draws_the_sun_too_the_sun_is_yellow", "ming_drops_a_coin_it_rolls_under_the_couch_with_a_small_sound",
  "ming_eats_at_the_door_on_this_end_grandma_eats_in_the_kitchen_at_that_end", "ming_eats_the_dumplings", "ming_eats_the_dumplings_he_eats_more_than_grandma", "ming_falls_a_little_behind", "ming_feels_tired", "ming_feels_tired_he_also_lost_a_page_of_his_story",
  "ming_feels_tired_he_also_lost_a_page_of_his_story_he_will_write_it_again_tomorrow", "ming_feels_tired_he_also_lost_a_page_of_his_story_so_he_cannot_finish_it_tonight", "ming_finds_a_small_part", "ming_finds_a_small_part_it_is_one_word_he_knows", "ming_finds_a_small_part_it_is_one_word_that_he_knows_well", "ming_finds_a_worm_under_a_green_leaf_and_calls_lili",
  "ming_finds_the_line_he_lost_now_he_knows_what_to_buy", "ming_finds_the_way", "ming_finds_two_hats_on_the_bed_one_is_big_and_brown_and_one_is_red", "ming_fixes_the_hole", "ming_fixes_the_hole_he_mends_it_with_care", "ming_follows_the_plan",
  "ming_follows_the_plan_because_he_wants_to_know_why", "ming_follows_the_plan_one_pot_goes_by_the_window", "ming_gets_on_the_bike", "ming_gets_on_the_bike_dad_holds_the_back", "ming_gets_the_things_ready", "ming_gets_the_things_ready_he_puts_eggs_and_milk_on_the_table",
  "ming_gets_the_things_ready_he_puts_eggs_and_milk_on_the_table_and_he_finds_a_spoon", "ming_gives_an_answer", "ming_gives_an_answer_he_says_it_slowly", "ming_gives_an_answer_he_says_it_slowly_because_he_wants_to_be_clear", "ming_gives_the_big_hat_back_to_grandpa_grandpa_wears_the_big_hat_and_laughs", "ming_gives_the_cow_grass",
  "ming_gives_the_cow_grass_he_puts_it_on_the_ground", "ming_gives_the_cow_grass_he_puts_it_on_the_ground_because_his_hand_is_small", "ming_gives_the_picture_to_the_teacher", "ming_gives_the_picture_to_the_teacher_he_holds_it_with_two_hands", "ming_gives_the_picture_to_the_teacher_he_holds_it_with_two_hands_when_he_gives_it", "ming_gives_the_plate_to_grandma",
  "ming_gives_the_plate_to_grandma_he_carries_it_with_two_hands", "ming_gives_the_rose_to_grandma", "ming_gives_the_rose_to_grandma_for_you_he_says_and_he_puts_it_in_her_hand", "ming_gives_the_rose_to_grandma_he_puts_it_in_her_hand", "ming_goes_back_to_bed", "ming_goes_back_to_bed_he_is_warm_again",
  "ming_goes_back_to_the_kitchen_with_his_end_grandma_takes_the_other_end_to_the_door", "ming_goes_on", "ming_goes_on_each_morning_he_marks_what_he_sees", "ming_goes_to_the_garden", "ming_goes_to_the_garden_he_goes_out_early", "ming_goes_to_the_garden_he_goes_out_early_because_he_wants_to_see_it_wake_up",
  "ming_goes_to_the_park", "ming_goes_to_the_park_he_takes_his_ball", "ming_goes_to_the_park_he_takes_his_ball_and_he_plays_by_the_tree", "ming_grows_a_little_more_every_year_his_mom_says_he_is_tall_now", "ming_had_a_big_idea", "ming_had_forgotten_his_umbrella_again_lili_shared_hers_though_it_was_much_too_small_for_two_people",
  "ming_has_a_bag", "ming_has_a_big_big_bag", "ming_has_a_big_idea_he_wants_a_reading_corner_in_class", "ming_has_a_big_red_bag", "ming_has_a_bun", "ming_has_a_cat",
  "ming_has_a_dumpling_and_a_nut_they_had_been_here_before", "ming_has_a_good_habit", "ming_has_a_good_idea", "ming_has_a_good_idea_he_wants_to_make_grandpa_a_gift", "ming_has_a_good_idea_he_wants_to_make_grandpa_a_gift_but_he_does_not_know_what", "ming_has_a_hat",
  "ming_has_a_little_ship", "ming_has_a_map", "ming_has_a_photo", "ming_has_a_photo_he_keeps_it_in_his_bag", "ming_has_a_photo_he_keeps_it_in_his_bag_so_it_will_not_get_lost", "ming_has_a_plan_he_takes_a_wide_white_sheet",
  "ming_has_a_red_scarf_in_his_room_it_is_long_warm_and_very_soft", "ming_has_a_ship_by_the_water", "ming_has_a_very_good_idea_he_puts_the_cake_on_the_wall", "ming_has_an_idea_at_home", "ming_has_coins", "ming_has_coins_they_are_in_a_small_box",
  "ming_has_coins_they_are_in_a_small_box_that_grandma_gave_him", "ming_has_come_far", "ming_has_come_far_he_can_see_the_whole_town", "ming_has_the_cash", "ming_helps_grandma", "ming_helps_grandma_he_washes_his_hands_first",
  "ming_holds_his_end_near_the_door_grandma_holds_the_other_end_in_the_kitchen", "ming_holds_one_side_of_the_board_lili_holds_the_other", "ming_holds_the_ladder_grandpa_reaches_up_slowly_and_speaks_in_a_soft_voice", "ming_holds_the_line", "ming_holds_the_line_the_line_is_thin", "ming_holds_the_line_the_line_is_thin_but_strong",
  "ming_is_at_the_farm_for_the_night_he_is_going_to_sleep_in_a_big_bed", "ming_is_at_the_station", "ming_is_at_the_station_he_waits_for_grandma", "ming_is_at_the_station_the_train_comes_late", "ming_is_at_the_station_the_train_comes_late_so_he_waits_a_long_time", "ming_is_careful_with_his_socks_he_looks_at_them_first",
  "ming_is_careful_with_the_rope", "ming_is_careful_with_the_rope_he_looks_at_it_first", "ming_is_glad", "ming_is_glad_anyway", "ming_is_glad_anyway_he_wants_to_play_again", "ming_is_glad_grandma_is_glad_too_both_of_them_felt_the_same_way_we_say_the_words_again_photo_and_pair",
  "ming_is_glad_grandma_is_glad_too_we_say_the_words_again_cousin_and_crown", "ming_is_glad_grandma_is_glad_too_we_say_the_words_again_scarf_and_letter", "ming_is_glad_grandma_is_there_to_meet_them", "ming_is_glad_grandma_is_there_to_meet_them_and_she_puts_up_her_hand", "ming_is_glad_grandma_is_there_to_meet_them_you_are_here_grandma_says_and_she_puts_up_her_hand", "ming_is_glad_he_is_glad_that_he_kept_going_and_he_shows_grandma_the_full_box",
  "ming_is_glad_he_is_glad_that_he_kept_going_and_he_shows_grandma_the_full_box_if_he_stops_the_box_will_stay_empty", "ming_is_glad_he_waited", "ming_is_glad_he_waited_he_did_not_try_too_hard", "ming_is_glad_of_the_habit", "ming_is_glad_of_the_idea", "ming_is_glad_that_he_kept_going_and_he_shows_grandma_the_full_box_if_he_stops_the_box_will_stay_empty",
  "ming_is_glad_that_he_waited_he_did_not_try_too_hard", "ming_is_glad_to_be_back", "ming_is_glad_to_be_back_he_stands_there_a_long_time", "ming_is_glad_to_be_back_he_stands_there_a_long_time_because_he_is_thinking", "ming_is_glad_to_find_the_ball", "ming_is_glad_to_find_the_ball_he_takes_it_home",
  "ming_is_glad_to_keep_going", "ming_is_glad_to_keep_going_he_shows_grandma_the_full_box", "ming_is_glad_too", "ming_is_glad_too_he_will_try_the_next_hard_one", "ming_is_glad_too_he_will_try_the_next_hard_one_when_it_comes", "ming_is_in_a_museum",
  "ming_is_in_a_museum_it_is_a_big_old_house", "ming_is_in_a_museum_it_is_a_big_old_house_that_is_quiet_inside", "ming_is_in_bed", "ming_is_in_bed_the_window_is_closed", "ming_is_in_bed_the_window_is_closed_because_the_night_is_cold", "ming_is_in_bed_too_and_he_listens_he_can_hear_every_word_the_book_says",
  "ming_is_in_the_field", "ming_is_in_the_field_it_is_a_warm_morning", "ming_is_in_the_field_it_is_a_warm_morning_and_the_sun_is_high", "ming_is_in_the_field_it_is_a_warm_morning_and_the_sun_is_not_high_yet", "ming_is_in_the_kitchen_with_grandma_they_make_noodles_together_on_a_cold_day", "ming_is_in_the_park_he_played_with_his_ball_by_the_tree_this_morning",
  "ming_is_in_the_photo_too", "ming_is_in_the_photo_too_he_was_much_smaller_then", "ming_is_in_the_photo_too_he_was_much_smaller_then_because_he_was_only_six", "ming_is_late_for_school_he_does_not_like_being_late", "ming_is_late_for_school_he_does_not_like_being_late_because_it_feels_bad", "ming_is_not_afraid",
  "ming_is_not_afraid_he_knows_what_it_is_now", "ming_is_not_afraid_he_knows_what_it_is_now_so_he_goes_back_to_bed", "ming_is_not_afraid_he_takes_one_step_closer", "ming_is_not_afraid_he_takes_one_step_closer_and_the_cow_does_not_move", "ming_is_on_a_train", "ming_is_on_a_train_it_is_his_first_long_trip",
  "ming_is_on_a_train_it_is_his_first_long_trip_so_he_looks_at_everything", "ming_is_proud", "ming_is_proud_he_smiles_all_day", "ming_is_proud_of_the_way", "ming_is_proud_of_the_way_he_pats_the_old_tree", "ming_is_proud_of_the_way_he_pats_the_old_tree_that_he_came_so_far_to_see",
  "ming_is_reading_a_hard_sentence_it_is_in_his_new_book", "ming_is_reading_the_word_frog_in_the_library", "ming_is_reading_the_word_idea_in_the_library", "ming_is_reading_the_word_idea_in_the_library_they_had_been_here_before", "ming_is_reading_the_word_promise_at_home", "ming_is_reading_the_word_promise_in_the_library_they_had_been_here_before",
  "ming_is_sad", "ming_is_sad_he_sits_down", "ming_is_sad_he_sits_down_and_does_not_want_to_try_again", "ming_is_sleeping_in_the_big_bed_a_warm_coat_is_on_the_bed", "ming_is_up", "ming_is_up_he_sits_up_in_bed",
  "ming_is_warm_now", "ming_is_warm_now_his_face_is_warm", "ming_is_with_the_family", "ming_is_with_the_family_grandpa_talks_about_the_farm", "ming_joins_the_relay_he_takes_the_last_turn", "ming_keeps_a_book_on_the_desk_by_his_bed_he_likes_the_story_in_it_very_much",
  "ming_keeps_going", "ming_keeps_going_he_does_not_stop_even_on_the_days_when_he_is_tired", "ming_keeps_going_he_does_not_stop_on_tired_days", "ming_keeps_his_promise_he_gets_the_kite_down_and_takes_it_to_the_park", "ming_keeps_his_promise_he_takes_the_kite_outside_again", "ming_keeps_his_promise_he_takes_the_kite_to_the_park",
  "ming_keeps_looking_out_the_window_he_does_not_want_to_sleep_because_he_may_miss_something", "ming_keeps_practicing", "ming_keeps_practicing_he_writes_three_lines_each_day", "ming_keeps_practicing_he_writes_three_lines_each_day_and_the_lines_look_better", "ming_keeps_practicing_he_writes_three_lines_each_day_the_lines_look_better", "ming_keeps_the_board_by_his_desk_he_writes_his_next_plan_on_it",
  "ming_keeps_the_board_by_his_desk_he_writes_the_next_plan_on_it", "ming_keeps_the_board_by_his_desk_he_writes_the_next_plan_on_it_because_it_works", "ming_keeps_the_coins", "ming_keeps_the_coins_he_will_buy_a_small_toy", "ming_keeps_the_idea_safe", "ming_keeps_the_idea_safe_the_paper_stays_in_his_bag",
  "ming_keeps_the_pace", "ming_keeps_the_paper_safe_his_idea_is_on_it", "ming_keeps_the_photo_safe", "ming_keeps_walking", "ming_keeps_walking_the_path_goes_up_again", "ming_keeps_walking_the_path_goes_up_again_and_his_legs_feel_it",
  "ming_knows_that_bees_help_flowers_make_seeds_he_is_happy_to_see_a_little_bee", "ming_knows_them_all", "ming_knows_them_all_he_grew_up_here", "ming_knows_this_place_he_grew_up_here", "ming_knows_what_to_do_now", "ming_knows_what_to_do_now_he_has_a_plan_of_his_own",
  "ming_laughs_because_the_hat_is_very_big_it_is_like_a_big_box_on_his_head", "ming_laughs_grandma_laughs_too_we_say_the_words_again_coin_and_coin", "ming_laughs_grandma_laughs_too_we_say_the_words_again_museum_and_phone", "ming_laughs_the_hat_is_back", "ming_learns_from_them", "ming_learns_from_them_he_did_not_know_people_cooked_like_that",
  "ming_lets_go_a_little", "ming_lets_go_a_little_because_trying_too_hard_does_not_help", "ming_lets_go_a_little_he_stops_trying_to_remember", "ming_likes_a_good_story", "ming_likes_corn", "ming_likes_corn_he_eats_it_all",
  "ming_likes_his_name_he_can_write_it_on_a_plate_too", "ming_likes_his_talking_cat", "ming_likes_hot_soup_when_the_air_is_cold_he_likes_cold_water_when_summer_is_hot", "ming_likes_hot_soup_when_the_air_is_cold_he_likes_cold_water_when_the_summer_is_hot", "ming_likes_noodles_too", "ming_likes_noodles_too_he_eats_them_with_grandma",
  "ming_likes_noodles_too_he_eats_them_with_grandma_when_she_makes_them", "ming_likes_the_bike", "ming_likes_the_bike_he_wants_to_ride_again", "ming_likes_the_bike_he_wants_to_ride_again_tomorrow", "ming_likes_the_cake", "ming_likes_the_cake_he_cuts_a_piece_for_grandma",
  "ming_likes_the_corner", "ming_likes_the_corner_he_will_come_back", "ming_likes_the_cow", "ming_likes_the_cow_good_cow_he_says_and_he_pats_its_nose", "ming_likes_the_cow_he_pats_its_nose", "ming_likes_the_hat",
  "ming_likes_the_house", "ming_likes_the_house_he_is_glad_to_be_home", "ming_likes_the_house_he_is_glad_to_be_home_when_the_day_is_over", "ming_likes_the_kite", "ming_likes_the_kite_he_does_not_want_to_stop", "ming_likes_the_market",
  "ming_likes_the_market_he_likes_to_look_around", "ming_likes_the_market_he_likes_to_look_around_when_they_go", "ming_likes_the_morning", "ming_likes_the_morning_it_is_quiet_here", "ming_likes_the_morning_it_is_quiet_here_before_the_town_wakes_up", "ming_likes_the_photo",
  "ming_likes_the_photo_at_home_he_will_show_grandma", "ming_likes_the_photo_at_home_he_will_show_it_to_grandma_and_she_will_smile", "ming_likes_the_scarf", "ming_likes_the_scarf_he_wears_it_to_school", "ming_likes_the_town", "ming_likes_the_town_he_likes_the_market_and_the_park",
  "ming_likes_the_window", "ming_likes_the_window_he_does_not_want_to_sleep", "ming_likes_the_window_he_does_not_want_to_sleep_because_he_may_miss_something", "ming_likes_the_window_he_sits_there_to_read", "ming_likes_the_window_he_sits_there_to_read_when_the_sun_is_warm", "ming_likes_to_count",
  "ming_likes_to_count_he_counts_the_plates_too", "ming_likes_to_count_he_counts_the_plates_too_when_he_puts_them_out", "ming_likes_to_watch_the_trains_go_by_he_counts_the_cars_of_every_train", "ming_likes_to_write", "ming_lives_in_the_house", "ming_lives_in_the_house_his_room_is_near_the_window",
  "ming_lives_in_the_house_his_room_is_near_the_window_so_he_hears_the_birds", "ming_looks_all_over_the_park", "ming_looks_all_over_the_park_he_walks_a_long_way", "ming_looks_all_over_the_park_he_walks_a_long_way_but_he_cannot_find_it", "ming_looks_and_looks", "ming_looks_and_looks_he_counts_the_cows",
  "ming_looks_and_looks_he_counts_the_cows_because_he_has_nothing_else_to_do", "ming_looks_at_a_game_and_a_book", "ming_looks_at_a_museum_and_a_station", "ming_looks_at_a_ship_and_a_board", "ming_looks_at_grandpa_and_laughs_grandpa_laughs_too_but_he_cannot_see", "ming_looks_at_it_again",
  "ming_looks_at_one_side", "ming_looks_at_one_side_because_he_wants_the_board_too", "ming_looks_at_one_side_lili_has_the_big_board_again", "ming_looks_at_some_corn_and_a_yogurt", "ming_looks_at_some_rain_and_a_photo", "ming_looks_at_the_board",
  "ming_looks_at_the_board_he_reads_each_line_again", "ming_looks_at_the_bug", "ming_looks_at_the_bug_he_gets_down_close", "ming_looks_at_the_cake", "ming_looks_at_the_cake_he_is_glad_and_he_tells_grandma", "ming_looks_at_the_corn",
  "ming_looks_at_the_corn_he_looks_at_the_leaves", "ming_looks_at_the_cow", "ming_looks_at_the_cow_he_stays_near_the_gate", "ming_looks_at_the_cow_he_stays_near_the_gate_so_he_can_run_if_he_needs_to", "ming_looks_at_the_hats_in_the_window_he_can_see_the_hats_but_not_his_face", "ming_looks_at_the_hole",
  "ming_looks_at_the_hole_he_holds_it_up_to_the_light", "ming_looks_at_the_map", "ming_looks_at_the_market", "ming_looks_at_the_market_he_sees_the_baskets", "ming_looks_at_the_market_he_sees_the_baskets_and_he_remembers", "ming_looks_at_the_name",
  "ming_looks_at_the_name_he_reads_it_slowly", "ming_looks_at_the_name_he_reads_it_slowly_and_says_it_out_loud", "ming_looks_at_the_park", "ming_looks_at_the_park_the_tree_is_big_now", "ming_looks_at_the_park_the_tree_is_big_now_but_it_is_the_same_tree", "ming_looks_at_the_photo",
  "ming_looks_at_the_photo_he_finds_grandma_in_it", "ming_looks_at_the_photo_he_finds_grandma_in_it_and_he_smiles", "ming_looks_at_the_pig_and_starts_to_laugh_the_pig_is_sleeping_and_does_not_move", "ming_looks_at_the_pot", "ming_looks_at_the_pot_he_can_not_touch_it", "ming_looks_at_the_pot_he_cannot_touch_it_so_he_puts_his_hands_behind_his_back",
  "ming_looks_at_the_problem_from_both_sides_now_he_is_not_sad", "ming_looks_at_the_rose", "ming_looks_at_the_rose_he_looks_for_the_best_one", "ming_looks_at_the_rose_one_more_time_then_he_goes_in", "ming_looks_at_the_shadow_again_now_he_can_see_how_it_changes", "ming_looks_at_the_shadow_again_now_he_can_see_it",
  "ming_looks_at_the_two_plates", "ming_looks_at_the_two_plates_he_puts_them_together", "ming_looks_back_at_his_first_question_it_was_too_big_to_answer_and_now_he_sees_why", "ming_looks_back_at_his_first_question_it_was_too_big_to_help", "ming_looks_back_at_his_first_question_it_was_too_big_to_help_and_now_he_sees_why", "ming_looks_back_at_his_first_question_it_was_too_big_to_help_he_sees_why_now",
  "ming_looks_by_a_stone", "ming_looks_by_a_stone_he_finds_an_old_leaf", "ming_looks_for_a_ball", "ming_looks_for_a_ball_he_put_it_here_this_morning", "ming_looks_for_a_ball_he_put_it_here_this_morning_before_he_went_home", "ming_looks_from_both_sides",
  "ming_looks_from_both_sides_he_tells_her_about_his_picture", "ming_looks_from_both_sides_now_he_is_not_sad", "ming_looks_in_the_window_he_can_see_the_hats_but_not_his_face", "ming_looks_out_the_window", "ming_looks_out_the_window_he_sees_the_hill_and_the_road", "ming_looks_out_the_window_he_sees_the_trees",
  "ming_looks_out_the_window_the_houses_go_by", "ming_looks_out_the_window_the_houses_go_by_and_the_trees_do_too", "ming_looks_under_a_tree", "ming_looks_under_a_tree_only_a_bug_is_there", "ming_looks_under_a_tree_only_a_bug_is_there_so_he_looks_in_another_place", "ming_makes_a_cake",
  "ming_makes_a_cake_for_grandma_it_is_big_and_very_sweet", "ming_makes_a_cake_he_puts_it_in_a_pan", "ming_makes_a_plan", "ming_makes_a_plan_he_writes_three_steps_on_a_board", "ming_makes_a_plan_he_writes_three_steps_on_a_board_so_he_will_not_forget_them", "ming_makes_a_promise",
  "ming_makes_a_promise_because_he_wants_to_try_again", "ming_makes_a_promise_before_bed_he_wants_to_try_again", "ming_makes_a_promise_he_will_try_the_kite_once_more", "ming_makes_another_change", "ming_makes_another_change_now_he_reads_one_page_each_night", "ming_makes_one_dumpling",
  "ming_makes_one_dumpling_he_closes_it_with_his_hands", "ming_makes_one_dumpling_he_closes_it_with_his_hands_but_one_side_stays_open", "ming_makes_one_small_change_he_will_do_it_every_day", "ming_makes_one_small_change_he_will_do_it_every_day_and_he_will_not_miss_one", "ming_makes_the_game", "ming_makes_the_game_he_uses_paper_and_a_pen",
  "ming_makes_the_game_he_uses_paper_and_a_pen_and_he_makes_a_small_board", "ming_marks_how_much_he_writes_it_down", "ming_marks_the_long_shadow_with_a_stone", "ming_marks_the_two_places_he_will_come_back_at_noon", "ming_mixes_and_makes", "ming_mixes_and_makes_he_mixes_fast_and_does_not_look_at_the_book",
  "ming_mixes_and_makes_he_mixes_fast_because_he_wants_it_done", "ming_mixes_and_makes_he_mixes_fast_because_he_wants_to_finish", "ming_mixes_the_eggs_and_milk_he_mixes_fast_because_he_wants_to_finish", "ming_moves_closer_to_see", "ming_offered_to_help_her_lili_shook_her_head_a_promise_she_said_means_i_do_it_all_myself", "ming_opens_the_book",
  "ming_opens_the_book_he_wants_to_read", "ming_opens_the_little_door_and_looks_inside_there_is_a_small_house_in_the_tree", "ming_opens_the_window_he_sees_the_hill_and_the_road", "ming_paints_the_last_page_he_puts_the_book_together", "ming_paints_the_last_page_he_puts_the_book_together_and_it_looks_like_a_book_from_a_shop", "ming_paints_the_last_page_he_puts_the_book_together_it_looks_like_a_book_from_a_shop",
  "ming_picks_a_fish_lili_picks_a_shell", "ming_picks_the_corn", "ming_picks_the_corn_he_takes_three", "ming_picks_up_a_rock", "ming_plays_the_whole_sentence", "ming_points_at_them_one_by_one_they_wrote_down_grass_basket_and_bread",
  "ming_points_to_one_small_part", "ming_points_to_one_word_and_asks_again", "ming_points_to_one_word_and_asks_again_this_time_they_went_more_slowly", "ming_practices_every_day", "ming_practices_every_day_at_first_the_letters_are_not_even", "ming_puts_a_dish_at_home",
  "ming_puts_a_leaf_in_the_garden", "ming_puts_a_seed_in_the_garden_he_wants_to_see_it_start_its_own_trip", "ming_puts_both_hats_back_on_one_head_he_likes_the_way_it_feels_to_wear_two_hats", "ming_puts_his_school_things_by_the_door_he_does_it_before_bed", "ming_puts_his_school_things_by_the_door_he_does_it_before_he_goes_to_bed", "ming_puts_the_map_back_in_his_bag_he_keeps_it_there_because_they_will_use_it_again",
  "ming_puts_the_picture_in_a_letter", "ming_puts_the_picture_in_a_letter_he_writes_her_name_on_it", "ming_puts_the_picture_in_a_letter_he_writes_her_name_on_it_so_it_will_get_there", "ming_puts_the_rope_back_on_the_wall_now_it_will_hold", "ming_puts_the_ship_on_the_water", "ming_puts_the_sock_away_now_he_can_wear_it_again",
  "ming_puts_the_sock_on_he_pulls_it_up", "ming_puts_the_wheel_back_on_the_cart_grandma_puts_the_knife_away", "ming_puts_the_wheel_back_on_the_cart_grandma_puts_the_knife_away_because_it_is_sharp", "ming_raises_a_hand", "ming_raises_a_hand_the_teacher_asks_him_to_try", "ming_raises_a_hand_the_teacher_asks_him_to_try_and_the_class_turns_to_look",
  "ming_raises_a_hand_try_it_the_teacher_says_and_the_class_turns_to_look", "ming_reads_a_hard_sentence", "ming_reads_a_hard_sentence_it_is_in_his_new_book", "ming_reads_it_out_loud_the_goat_is_big_now_he_laughs", "ming_reads_it_twice_then_puts_it_in_his_small_special_box", "ming_reads_the_letter",
  "ming_reads_the_letter_he_reads_it_slowly", "ming_reads_the_list_again_out_loud", "ming_reads_the_note", "ming_reads_the_note_he_says_the_words_out_loud", "ming_reads_the_question_again", "ming_reads_the_question_again_he_reads_it_word_by_word",
  "ming_reads_the_question_again_he_reads_it_word_by_word_so_he_can_find_a_part_he_knows", "ming_rests_now", "ming_rests_now_he_sleeps_well_that_night", "ming_rests_now_he_sleeps_well_that_night_because_he_has_a_plan_for_tomorrow", "ming_rests_now_he_sleeps_well_that_night_he_thinks_about_tomorrow", "ming_rides_and_rides",
  "ming_rides_and_rides_he_looks_at_the_road", "ming_rides_and_rides_he_looks_at_the_road_and_he_does_not_look_down", "ming_rolls_the_dough_into_a_long_rope_and_cuts_it_into_small_pieces", "ming_runs_in_the_first_race_lili_runs_in_the_third", "ming_runs_to_get_it", "ming_runs_with_the_kite",
  "ming_runs_with_the_kite_dad_runs_behind_him", "ming_runs_with_the_kite_go_on_dad_says", "ming_s_first_dumpling_leaks_he_laughs_and_tries_another_one", "ming_s_job_is_the_scarecrow_he_rebuilds_it_every_june_with_an_old_hat_and_two_bamboo_arms", "ming_says_dig_around_it_not_at_it", "ming_says_he_is_happy",
  "ming_says_he_is_happy_he_asks_her_to_come_home", "ming_says_he_is_happy_he_asks_her_to_come_home_soon", "ming_says_he_wants_to_ride_a_train_again_he_likes_the_trains_that_go_fast_and_far", "ming_says_let_us_go_back_and_look_again", "ming_says_look_then_write_then_look", "ming_says_one_hat_is_for_the_sun_he_says_the_other_one_is_just_for_fun",
  "ming_says_say_them_out_loud_in_order", "ming_says_say_them_out_loud_in_order_two_pairs_of_eyes_see_more", "ming_says_start_from_the_same_end", "ming_says_tell_me_who_where_then_what", "ming_says_tell_me_who_where_then_what_two_pairs_of_eyes_see_more", "ming_says_thank_you_he_checks_the_photo",
  "ming_says_thank_you_he_checks_the_photo_because_he_wants_to_be_sure_it_is_not_broken", "ming_says_thank_you_he_checks_the_photo_because_he_wants_to_be_sure_it_is_whole", "ming_says_the_sentence_out_loud_it_was_a_good_moment_we_say_the_words_again_promise_and_planet", "ming_says_the_sentence_out_loud_it_was_a_good_moment_we_say_the_words_again_scientist_and_scientist", "ming_says_the_sentence_out_loud_we_say_the_words_again_city_and_continue", "ming_says_the_sentence_out_loud_we_say_the_words_again_reason_and_stranger",
  "ming_says_wait_a_little_longer", "ming_says_we_can_each_do_one_part_two_pairs_of_eyes_see_more", "ming_says_you_can_have_it_first", "ming_sees_a_shadow", "ming_sees_a_shadow_it_is_dark_on_the_grass", "ming_sees_a_shadow_it_is_dark_on_the_grass_and_it_moves_with_him",
  "ming_sees_hills_and_trees", "ming_sees_hills_and_trees_he_sees_cows_on_the_grass", "ming_sees_hills_and_trees_he_sees_cows_that_stand_on_the_grass", "ming_sees_how_it_works", "ming_sees_how_it_works_he_tells_his_class_about_the_box", "ming_sees_the_bag_at_school",
  "ming_sees_the_hill", "ming_sees_the_hill_a_tree_stands_on_it", "ming_sees_the_hill_a_tree_stands_on_it_and_its_leaves_move_in_the_wind", "ming_sees_the_same_tree", "ming_sees_the_same_tree_he_pats_it", "ming_sees_the_same_tree_he_pats_it_and_he_stands_under_it",
  "ming_shows_the_two_pots_to_grandma", "ming_sits_by_lili_and_grins", "ming_sits_by_the_window", "ming_sits_by_the_window_mom_sits_with_him", "ming_sits_by_the_window_mom_sits_with_him_and_she_has_a_bag_of_food", "ming_sits_down_again_he_is_glad",
  "ming_sits_down_again_he_is_glad_that_he_tried", "ming_sits_up_in_bed_he_sees_the_trees", "ming_sits_with_the_little_family_outside_they_give_him_a_little_flower_from_the_tree", "ming_sleeps_well", "ming_sleeps_well_in_the_morning_he_tells_mom", "ming_speaks_his_longest_line_without_a_mistake_the_audience_claps_at_the_end",
  "ming_stands_at_the_station_he_waits_for_grandma", "ming_stands_on_a_step_and_gets_it", "ming_starts_a_journey_to_the_old_tree_it_is_up_on_the_hill", "ming_starts_fast_but_his_shirt_catches_on_a_small_post", "ming_stops_to_thank_the_wind_he_thinks_the_wind_is_good_and_kind", "ming_takes_a_pot_home_he_puts_a_seed_in_it_that_night",
  "ming_takes_a_small_step", "ming_takes_it_out_again_he_wants_one_more_look", "ming_takes_it_out_again_he_wants_one_more_look_before_the_train_comes", "ming_takes_it_to_the_beach", "ming_takes_one_end_of_the_long_noodle_he_cannot_see_grandma_because_she_is_way_back_in_the_kitchen", "ming_takes_one_small_step",
  "ming_takes_one_small_step_because_the_tree_is_far_away", "ming_takes_one_small_step_he_wants_to_get_to_the_old_tree", "ming_takes_the_kite", "ming_takes_the_kite_he_runs_to_the_grass", "ming_takes_the_kite_he_runs_to_the_grass_and_dad_goes_with_him", "ming_takes_the_map_with_him_he_will_use_it_again",
  "ming_talked_about_it", "ming_tells_her_about_his_picture_she_listens", "ming_tells_it_again", "ming_tells_it_again_this_time_nothing_is_missing", "ming_tells_lili_about_it_they_stand_at_the_gate", "ming_tells_lili_about_it_they_stand_at_the_gate_and_he_talks_with_his_hands",
  "ming_tells_the_ball_part_again_then_grandma_asks_about_the_park", "ming_tells_the_whole_story", "ming_tells_the_whole_story_grandma_listens_all_the_way", "ming_tells_the_whole_story_grandma_listens_all_the_way_and_she_does_not_stop_him", "ming_thinks_about_that_part", "ming_thinks_about_that_part_he_writes_it_on_his_paper",
  "ming_thinks_about_the_whole_story", "ming_thinks_about_the_whole_story_he_wants_to_tell_it_to_grandma", "ming_thinks_about_the_whole_story_he_wants_to_tell_it_to_grandma_but_he_is_not_sure_where_to_start", "ming_thinks_about_them", "ming_thinks_about_them_he_pictures_a_family_at_a_table", "ming_thinks_of_something_else",
  "ming_thinks_of_something_else_he_helps_grandma_in_the_kitchen", "ming_thinks_of_something_else_he_helps_grandma_in_the_kitchen_he_helps_with_the_food", "ming_thinks_of_something_else_he_helps_grandma_in_the_kitchen_with_the_food", "ming_tries_the_same_thing_again", "ming_tries_the_same_thing_again_they_did_their_best_at_this_step", "ming_uses_the_big_plate",
  "ming_uses_the_big_plate_he_puts_rice_on_it", "ming_waits", "ming_waits_for_a_memory_to_come", "ming_waits_for_a_memory_to_come_he_wants_the_name_of_an_old_song", "ming_waits_for_a_memory_to_come_he_wants_the_name_of_an_old_song_it_is_grandma_s_song", "ming_waits_for_a_memory_to_come_he_wants_the_name_of_an_old_song_that_grandma_sings",
  "ming_waits_he_waits_many_days", "ming_waits_he_waits_many_days_and_he_looks_at_it_each_morning", "ming_walks_across_the_park_with_the_wind_it_goes_along_beside_him_in_the_dark", "ming_walks_and_looks", "ming_walks_and_looks_he_stays_close_to_grandma", "ming_walks_home_with_the_wind_across_the_park_it_goes_along_beside_him_in_the_dark",
  "ming_walks_in_the_park_after_school_he_sees_a_big_tree_with_a_small_door", "ming_walks_on", "ming_walks_to_the_corner", "ming_walks_to_the_corner_he_walks_alone", "ming_walks_to_the_corner_he_walks_alone_and_he_takes_his_time", "ming_wants_a_coin",
  "ming_wants_a_frog", "ming_wants_a_hat", "ming_wants_a_letter", "ming_wants_a_photo_they_had_talked_about_it", "ming_wants_a_pig", "ming_wants_it_grandma_wants_it_too",
  "ming_wants_to_buy_cakes_with_his_money", "ming_wants_to_come_back", "ming_wants_to_come_back_he_asks_grandma_if_she_will_bring_him_again", "ming_wants_to_come_back_he_asks_grandma_if_she_will_bring_him_back_again", "ming_wants_to_come_back_he_asks_grandma_to_bring_him_again", "ming_wants_to_dig_in_the_garden",
  "ming_wants_to_find_out_something", "ming_wants_to_find_out_something_he_wonders_why_one_seed_did_not_grow", "ming_wants_to_fix_it", "ming_wants_to_go_to_the_farm", "ming_wants_to_go_to_the_farm_he_will_go_in_summer", "ming_wants_to_go_to_the_farm_he_will_go_in_summer_when_school_is_out",
  "ming_wants_to_hear_all_about_it", "ming_wants_to_hear_all_about_it_they_had_talked_about_it", "ming_wants_to_make_a_cake", "ming_wants_to_make_a_cake_he_gets_up_early", "ming_wants_to_make_a_cake_he_gets_up_early_before_the_sun_is_high", "ming_wants_to_make_a_game",
  "ming_wants_to_make_a_game_it_is_a_wet_day", "ming_wants_to_mix_them", "ming_wants_to_ride_it_he_puts_on_his_cap_and_goes_out", "ming_wants_to_ride_the_bike", "ming_wants_to_see_it_change", "ming_wants_to_see_it_sail",
  "ming_wants_to_see_what_it_does", "ming_wants_to_understand_it", "ming_wants_to_understand_it_they_had_talked_about_it", "ming_watches_and_does_not_touch_he_keeps_his_hands_on_the_table", "ming_watches_the_shadow", "ming_watches_the_shadow_he_wants_to_check_his_answer",
  "ming_watches_the_shadow_he_wants_to_check_his_answer_when_the_sun_is_high", "ming_wears_the_scarf", "ming_wears_the_scarf_he_goes_out_to_play", "ming_wears_the_scarf_he_goes_out_to_play_and_the_wind_cannot_get_in", "ming_will_come_back_tomorrow", "ming_will_come_back_tomorrow_he_will_bring_grandma",
  "ming_will_come_back_tomorrow_he_will_bring_grandma_so_she_can_see_it_too", "ming_will_come_back_when_the_door_is_open_he_wants_to_see_his_little_friends_again", "ming_will_count_more_tomorrow", "ming_will_count_more_tomorrow_he_wants_to_get_it_right", "ming_will_grow_more_and_more_he_wants_to_be_tall_and_strong_one_day", "ming_will_keep_the_habit",
  "ming_will_keep_the_promise", "ming_will_keep_the_promise_he_takes_the_kite_back_to_the_park", "ming_will_keep_this_letter_he_puts_it_in_a_safe_place", "ming_will_look_at_both_sides", "ming_will_mark_it_on_a_board_he_wants_to_see_the_change", "ming_will_mark_the_seasons_on_a_board_he_wants_to_see_the_change",
  "ming_will_plant_more_corn", "ming_will_plant_more_corn_he_will_plant_it_next_year", "ming_will_plant_more_corn_he_will_plant_it_next_year_when_spring_comes", "ming_will_remember_this", "ming_will_remember_this_he_writes_the_song_name_down", "ming_will_remember_this_he_writes_the_song_name_down_so_it_stays_with_him",
  "ming_will_start_again", "ming_will_start_again_he_has_a_new_plan", "ming_will_start_again_he_has_a_new_plan_and_he_will_begin_here", "ming_will_take_more_photos", "ming_will_write_more", "ming_wobbled_across_the_yard_with_lili_running_beside_him_and_doudou_barking_behind",
  "ming_writes_a_note_too", "ming_writes_a_note_too_he_puts_it_in_the_same_book", "ming_writes_a_note_too_he_tells_her_about_the_garden", "ming_writes_a_note_too_he_tells_her_about_the_garden_that_grandpa_keeps", "ming_writes_back_to_grandma", "ming_writes_back_to_grandma_he_tells_her_about_school",
  "ming_writes_back_to_grandma_he_tells_her_about_school_and_he_draws_a_small_picture", "ming_writes_down_the_question", "ming_writes_down_the_question_he_puts_it_on_a_note_by_his_desk", "ming_writes_down_the_question_he_puts_it_on_a_note_by_his_desk_so_it_stays_where_he_can_see_it", "ming_writes_down_what_we_found", "ming_writes_down_what_we_found_he_shows_the_two_pots_to_grandma",
  "ming_writes_for_the_best_grandma_she_keeps_it", "ming_writes_it_down", "ming_writes_it_down_and_draws_a_small_plan_on_paper_the_paper_is_small_but_it_is_clear", "ming_writes_it_down_he_draws_a_small_plan_on_paper", "ming_writes_it_down_he_draws_a_small_plan_on_paper_the_paper_is_small_but_clear", "ming_writes_it_down_he_puts_three_words_on_the_board",
  "ming_writes_more", "ming_writes_more_he_adds_what_he_needs_to_buy", "ming_writes_more_he_adds_what_he_needs_to_buy_and_he_draws_a_small_picture", "ming_writes_the_answer_on_the_board_tomorrow_he_will_try_three_pots", "ming_writes_the_answer_on_the_board_tomorrow_he_will_try_three_pots_so_he_can_compare_them", "ming_wrote_it_down",
  "miss_lin_gives_out_the_scripts_lili_is_the_seed_ming_is_the_old_oak", "mom_and_ming_are_at_home", "mom_and_ming_are_in_the_kitchen", "mom_and_ming_are_in_the_park", "mom_and_ming_are_on_the_farm", "mom_answers_but_grandma_still_looks_lost",
  "mom_asks_where_the_big_cake_is_nobody_in_the_room_can_find_it", "mom_asks_which_word_is_the_hard_one", "mom_buys_rice", "mom_buys_rice_she_puts_it_in_the_basket", "mom_buys_rice_she_puts_it_in_the_basket_and_the_basket_gets_full", "mom_cannot_follow_the_story",
  "mom_closes_the_book_and_tells_it_again_both_of_them_felt_the_same_way_we_say_the_words_again_air_and_earth", "mom_closes_the_book_and_tells_it_again_it_was_a_good_moment_we_say_the_words_again_stranger_and_stranger", "mom_closes_the_book_and_tells_it_again_we_say_the_words_again_cube_and_cube", "mom_closes_the_book_and_tells_it_again_we_say_the_words_again_hill_and_hole", "mom_closes_the_book_and_tells_it_again_we_say_the_words_again_home_and_horse", "mom_closes_the_book_and_tells_it_again_we_say_the_words_again_jam_and_jug",
  "mom_closes_the_book_and_tells_it_again_we_say_the_words_again_lake_and_leaf", "mom_closes_the_book_and_tells_it_again_we_say_the_words_again_lake_and_lime", "mom_closes_the_book_and_tells_it_again_we_say_the_words_again_planet_and_practice", "mom_closes_the_book_and_tells_it_again_we_say_the_words_again_purse_and_shark", "mom_closes_the_book_and_tells_it_again_we_say_the_words_again_straw_and_straw", "mom_comes_in_she_looks_in_the_pot",
  "mom_comes_into_the_room_with_some_cups_she_looks_at_the_table_and_stops", "mom_cooks_eggs_for_me", "mom_counts_one_two_three", "mom_gives_the_scarf_to_ming", "mom_gives_the_scarf_to_ming_she_puts_it_on_him", "mom_gives_the_scarf_to_ming_she_puts_it_on_him_so_he_stays_warm",
  "mom_has_an_idea_at_home", "mom_has_just_finished_a_book_at_home", "mom_has_just_finished_a_book_at_home_they_had_been_here_before", "mom_has_just_finished_a_book_at_the_beach", "mom_has_just_finished_a_book_in_the_garden", "mom_has_just_finished_a_book_in_the_library",
  "mom_has_just_finished_a_book_in_the_library_they_had_been_here_before", "mom_has_just_finished_a_book_in_the_park", "mom_has_just_finished_a_book_on_the_farm", "mom_has_just_finished_a_book_on_the_farm_they_had_been_here_before", "mom_helps_him_look_they_find_the_bag_at_last", "mom_helps_him_look_they_find_the_bag_at_last_because_it_was_under_a_coat",
  "mom_is_at_school_with_a_bag", "mom_is_glad_ming_is_glad_too_we_say_the_words_again_cow_and_noodle", "mom_is_glad_ming_is_glad_too_we_say_the_words_again_knife_and_village", "mom_is_happy", "mom_is_happy_i_am_happy_too", "mom_laughs_ming_laughs_too_we_say_the_words_again_shirt_and_sister",
  "mom_listens_then_reads_it_in_two_parts", "mom_makes_a_scarf", "mom_makes_a_scarf_she_works_at_night", "mom_makes_a_scarf_she_works_at_night_after_ming_sleeps", "mom_opens_a_book_in_the_library", "mom_plays_the_whole_sentence",
  "mom_plays_the_whole_sentence_two_pairs_of_eyes_see_more", "mom_puts_some_grass_on_the_farm", "mom_puts_the_lid_back_on_i_do_not_touch_it", "mom_puts_the_lid_back_on_she_smiles_at_me", "mom_puts_the_lid_back_on_the_pot_is_safe_now", "mom_puts_the_soup_on_the_table",
  "mom_reads_it_once_more_smiling_we_say_the_words_again_problem_and_suggest", "mom_reads_it_one_word_at_a_time", "mom_says_dig_around_it_not_at_it", "mom_says_guess_again_and_then_check_two_pairs_of_eyes_see_more", "mom_says_let_us_do_it_slowly_together", "mom_says_let_us_do_it_slowly_together_two_pairs_of_eyes_see_more",
  "mom_says_listen_to_the_quiet_sounds", "mom_says_listen_to_the_quiet_sounds_two_pairs_of_eyes_see_more", "mom_says_tell_me_who_where_then_what", "mom_sees_a_lot_of_things_in_the_garden", "mom_starts_again_in_order", "mom_starts_again_in_order_this_time_they_went_more_slowly",
  "mom_tells_the_last_part_first", "mom_tells_the_last_part_first_they_did_their_best_at_this_step", "mom_thinks_about_the_cheese_in_the_book_we_say_the_words_fox_friend_and_grandma", "mom_thinks_about_the_cheese_in_the_book_we_say_the_words_shed_shed_and_chips", "mom_thinks_about_the_farm_in_the_book_we_say_grass_green_and_ham_again", "mom_thinks_about_the_farm_in_the_book_we_say_whale_whale_and_classroom_again",
  "mom_thinks_about_the_farmer_in_the_book_they_wrote_down_three_words_home_horse_and_jam", "mom_thinks_about_the_farmer_in_the_book_they_wrote_down_three_words_purse_shark_and_shirt", "mom_thinks_about_the_future_in_the_book_they_looked_more_than_once_three_words_mattered_that_day_stranger_stranger_and_memory", "mom_thinks_about_the_future_in_the_book_three_words_mattered_that_day_planet_practice_and_problem", "mom_thinks_about_the_hole_in_the_book_they_made_a_list_cube_cube_and_crowd", "mom_thinks_about_the_hole_in_the_book_they_made_a_list_hill_hole_and_home",
  "mom_thinks_about_the_noodle_in_the_book_before_they_went_on_they_wrote_down_jam_jug_and_king", "mom_thinks_about_the_noodle_in_the_book_they_looked_more_than_once_before_they_went_on_they_wrote_down_straw_straw_and_coast", "mom_thinks_about_the_pot_in_the_book_we_say_bat_bat_and_fan", "mom_thinks_about_the_pot_in_the_book_we_say_lid_duck_and_egg", "mom_thinks_about_the_rain_in_the_book_they_looked_more_than_once_they_wrote_three_words_on_the_board_air_earth_and_hair", "mom_thinks_about_the_rain_in_the_book_they_wrote_three_words_on_the_board_lake_leaf_and_leg",
  "mom_thinks_about_the_rose_in_the_book_they_made_a_list_lake_lime_and_nose", "mom_thinks_about_the_snow_in_the_book_they_wrote_down_glove_grandma_and_grandpa", "mom_thinks_about_the_snow_in_the_book_they_wrote_down_song_plum_and_crow", "mom_thinks_about_the_water_in_the_book_we_say_cat_cup_and_dad", "mom_thinks_about_the_water_in_the_book_we_say_fish_water_and_milk", "mom_tries_the_same_thing_again",
  "mom_wants_a_cow", "mom_wants_a_knife", "mom_wants_a_moth", "mom_wants_some_too", "mom_wants_to_count_them_all", "mom_wants_to_dig_in_the_garden",
  "mom_wants_to_do_it_alone", "mom_wants_to_fix_it", "mom_wants_to_hear_all_about_it", "mom_wants_to_know_why", "mom_wants_to_read_it_out_loud", "mom_wants_to_see_it_change",
  "mom_wants_to_write_the_word_they_had_been_here_before", "mom_writes_it_once_they_did_their_best_at_this_step", "mooncakes_and_the_moon", "mooncakes_and_the_moon_ming_will_remember_this_night", "mooncakes_and_the_moon_ming_will_remember_this_night_when_he_is_older", "more_noodles_ming_says_grandma_gives_him_more",
  "more_rain_more_water", "more_rain_more_water_that_is_how_we_know", "more_rain_more_water_that_is_how_we_know_and_it_is_easy_to_see", "morning_comes_and_the_wind_is_calm_ming_takes_the_kite_outside", "morning_comes_the_wind_is_calm", "morning_in_the_garden",
  "morning_in_the_garden_the_air_is_fresh", "morning_is_here", "morning_is_here_the_sky_is_bright", "morning_is_here_the_sky_is_bright_and_the_air_is_soft", "mrs_li_makes_good_dumplings", "ms_li_is_our_teacher",
  "much_too_much_grandma_checks", "mum_is_tired_after_the_chores", "my_arms_are_not_wings", "my_aunt_is_an_office_worker", "my_bag", "my_bag_is_big",
  "my_bag_is_good_now_i_like_my_bag", "my_bag_is_just_right_now", "my_bag_is_just_right_now_i_put_it_by_the_door", "my_birthday_is_in_may", "my_birthday_is_on_may_the_first", "my_book",
  "my_brother_is_one_year_old", "my_cap_is_on_my_head", "my_cat", "my_cat_drinks_it_up", "my_cat_had_it", "my_cat_has_a_bone",
  "my_cat_has_it_on", "my_cat_is_in_my_bag", "my_cat_is_small", "my_cat_made_a_new_sound", "my_cat_sat_on_the_mat", "my_coat_is_red_lili_s_coat_is_green",
  "my_corn_is_in_the_storm", "my_cup", "my_cup_is_full_again", "my_cup_is_good", "my_cup_is_red", "my_dad",
  "my_dad_fixed_the_lamp", "my_dad_reads_a_newspaper", "my_dog", "my_dog_can_run", "my_dog_has_a_bone", "my_dog_has_one",
  "my_dog_hopes_for_a_bone", "my_dog_is_by_the_pot", "my_dog_is_in_my_hat", "my_dog_looks_up_too", "my_dog_lost_its_bone", "my_dog_rides_too",
  "my_dog_runs_and_runs", "my_dog_wants_some", "my_father_is_strong", "my_favourite_place_is_the_library", "my_favourite_subject_is_science", "my_foot_hurts_when_i_walk",
  "my_friend_claps", "my_friend_claps_and_jumps", "my_friend_has_a_flag", "my_friend_stands_with_me_he_has_a_red_flag", "my_grandma", "my_grandpa",
  "my_grandpa_lives_far_away_we_go_to_see_him_today", "my_hand_is_wet", "my_hands_are_clean_too", "my_hands_are_wet", "my_hands_can_hold_a_ball", "my_hands_help_me_eat",
  "my_hat", "my_hen_is_red", "my_hometown_is_by_the_sea", "my_kite_went_up_high", "my_leaf_is_good", "my_leaf_is_good_i_put_it_on_the_wall",
  "my_leg_is_in_the_mud", "my_mom", "my_mom_works_in_a_big_office", "my_mother_has_a_new_job", "my_pet_is_a_rat", "my_pet_is_wet",
  "my_pig_is_big", "my_pup_is_in_the_sun", "my_ring_is_not_on_my_hand", "my_robot_is_clever", "my_room_number_is_two_zero_one", "my_rule_no_more_cubes",
  "my_seed_can_grow", "my_seed_is_a_tree", "my_shadow_is_longer_in_the_evening", "my_sister_is_helpful_at_home", "my_sock_is_on_the_deck", "my_wet_pet_is_not_sad",
  "my_wish_is_good", "names_can_tell_us_things", "names_can_tell_us_things_they_tell_us_who_it_is", "naming_the_parts_made_the_difference_visible", "neither_of_them_had_walked_that_way_before_the_shops_gave_way_to_small_grey_houses_and_a_wet_garden", "never_cheat_in_a_game",
  "new_days_come", "new_days_come_the_kite_goes_up_on_the_first_try", "next_morning_we_put_on_our_new_clothes_and_greet_the_neighbours_in_the_lane", "next_spring_we_will_turn_the_dirt_all_over_again_grandpa_says", "next_they_will_compare_the_ball_and_the_plate_they_made_a_list_of_all_the_small_differences", "next_they_will_compare_the_board_and_the_box",
  "next_they_will_compare_the_book_and_the_ball_they_made_a_list_of_all_the_small_differences", "next_they_will_compare_the_cap_and_the_promise_they_made_a_list_of_all_the_small_differences", "next_they_will_compare_the_cup_and_the_kite_they_made_a_list_of_all_the_small_differences", "next_they_will_compare_the_fish_and_the_plate", "next_they_will_compare_the_garden_and_the_farm", "next_they_will_compare_the_kite_and_the_picture_they_made_a_list_of_all_the_small_differences",
  "next_they_will_compare_the_note_and_the_clock_they_would_come_back_to_this_they_made_a_list_of_all_the_small_differences", "next_they_will_compare_the_path_and_the_pen_they_made_a_list_of_all_the_small_differences", "next_they_will_compare_the_photo_and_the_cup", "next_they_will_compare_the_photo_and_the_flag_they_made_a_list_of_all_the_small_differences", "next_they_will_compare_the_photo_and_the_rock_they_made_a_list_of_all_the_small_differences", "next_they_will_compare_the_photo_and_the_whale_they_made_a_list_of_all_the_small_differences",
  "next_they_will_compare_the_pot_and_the_dish", "next_they_will_compare_the_rope_and_the_box_they_made_a_list_of_all_the_small_differences", "next_they_will_compare_the_shop_and_the_park", "next_they_will_compare_the_station_and_the_lake_they_made_a_list_of_all_the_small_differences", "next_they_will_compare_the_yogurt_and_the_jam_they_made_a_list_of_all_the_small_differences", "next_they_will_count_the_box_and_the_cheese_that_was_not_the_last_of_it_they_wrote_the_number_where_they_could_see_it",
  "next_they_will_count_the_brush_and_the_line_they_wrote_the_number_where_they_could_see_it", "next_they_will_count_the_clock_and_the_map", "next_they_will_count_the_day_and_the_moon_they_would_come_back_to_this_they_wrote_the_number_where_they_could_see_it", "next_they_will_count_the_morning_and_the_time_they_wrote_the_number_where_they_could_see_it", "next_they_will_count_the_pen_and_the_ball", "next_they_will_count_the_room_and_the_cup",
  "next_they_will_count_the_wing_and_the_flag", "next_they_will_count_the_wing_and_the_light_they_wrote_the_number_where_they_could_see_it", "next_time_he_will_ask_a_small_one_he_keeps_the_idea_on_a_note", "next_time_he_will_ask_a_small_one_he_keeps_the_idea_on_a_note_because_small_questions_work", "next_time_he_will_ask_a_small_one_if_he_asks_a_small_one_he_can_get_an_answer", "next_time_he_will_ask_a_small_one_then_he_can_get_an_answer",
  "next_time_they_will_ask_before_they_decide", "next_time_they_will_ask_before_they_decide_that_was_not_the_last_of_it_they_both_remembered_that_day", "next_time_they_will_ask_before_they_decide_they_both_remembered_that_day", "next_time_they_will_look_around_first", "next_time_they_will_save_a_part_first", "next_time_you_see_an_ant_watch_it_see_how_small_ants_do_big_work_together",
  "next_time_you_see_an_ant_watch_it_see_how_small_ants_work_together", "nice_to_meet_you_nice_to_meet_you_too", "night_is_here", "night_is_here_the_house_is_dark", "night_is_here_the_house_is_dark_and_the_wind_is_up", "nine_pigs_in_a_line",
  "nine_pigs_in_a_pile", "no_car_can_get_by", "no_coin_not_here_not_there", "no_cow_not_here_not_there", "no_cup_for_ming_but_the_class_sings_his_name", "no_extra_uh_now_you_can_say_them",
  "no_frog_not_here_not_there", "no_i_am_too_sleepy", "no_knife_not_here_not_there", "no_letter_not_here_not_there", "no_moth_not_here_not_there", "no_not_in_the_sock",
  "no_note_not_here_not_there", "no_one_answers_at_first", "no_one_answers_at_first_ming_does_not_put_up_his_hand", "no_one_answers_at_first_ming_does_not_put_up_his_hand_because_he_is_not_sure", "no_one_is_home", "no_photo_not_here_not_there_it_was_a_little_disappointing",
  "no_run_bug_run", "no_slip_no_fall_mimi_is_glad", "no_smoking_in_the_library", "no_step_is_too_small", "nobody_can_get_through_the_door", "nobody_can_use_it_now",
  "nobody_has_seen_her_yet_lili_s_eyes_fill_with_tears_but_grandma_stays_calm", "nobody_opens_the_book_at_night_it_opens_when_the_room_gets_dark", "noodles_are_easy_to_make_that_is_why_people_eat_them_so_often", "noodles_are_good_food", "noodles_are_good_food_ming_asks_for_more", "noodles_are_good_to_eat",
  "noodles_are_good_to_eat_they_are_warm_in_winter", "noodles_are_good_to_eat_they_are_warm_in_winter_when_the_air_is_cold", "noodles_are_good_to_eat_they_keep_you_warm_in_winter_when_the_air_is_cold", "noodles_are_warm_and_good", "noodles_are_warm_and_good_they_are_best_on_a_cold_day", "noodles_are_warm_and_good_they_are_best_on_a_cold_day_so_people_eat_them_in_winter",
  "noodles_come_from_china", "noodles_in_the_south", "noodles_in_the_south_each_town_has_its_own_way", "not_the_same_plate_two_plates_big_and_small", "not_too_much_says_grandma_small_is_good", "not_with_that_hat_said_the_cat",
  "notes_are_fun", "notes_are_fun_grandma_will_find_it", "notes_are_fun_grandma_will_find_it_and_write_back", "nothing_is_faster_than_the_cheetah", "now_a_nap_said_the_cat", "now_ask_me_three_questions_about_this_book_i_will_answer_every_one",
  "now_bike_sounds_right", "now_both_can_find_the_cup_here_is_a_two_here_is_a_box", "now_each_of_them_has_a_part", "now_each_of_them_has_a_part_look_at_the_fan_and_the_hen", "now_each_of_them_has_a_part_look_at_the_jam_and_the_jug", "now_each_of_them_has_a_part_they_were_glad_they_kept_looking",
  "now_each_of_them_has_a_part_we_look_at_the_friend_and_the_frog", "now_grandma_can_move_in_the_water_we_look_at_the_front_and_the_chick", "now_he_looks_for_the_ball_he_put_it_here_before_he_went_home", "now_her_skirt_is_red_and_green", "now_his_things_are_always_there_he_never_looks_for_them", "now_his_things_are_always_there_he_never_looks_for_them_because_they_are_by_the_door",
  "now_i_have_jam_on_my_hand", "now_it_can_not_get_it", "now_it_chirps_for_a_bath", "now_it_chirps_for_more", "now_it_is_a_frog_it_sits_on_a_log", "now_it_is_a_tree",
  "now_it_is_day", "now_it_is_glad_for_its_shell", "now_it_is_hard_to_use", "now_it_is_night", "now_it_is_not_day", "now_it_is_on_me",
  "now_it_is_so_tall", "now_it_sounds_like_one_sentence", "now_it_sounds_like_one_sentence_here_is_a_green_here_is_a_three", "now_it_sounds_like_one_sentence_here_is_a_sun_here_is_a_dog", "now_it_sounds_like_one_sentence_look_at_the_fog_and_the_fox", "now_it_sounds_like_one_sentence_look_at_the_top_and_the_shop",
  "now_it_sounds_like_one_sentence_they_were_glad_they_kept_looking", "now_it_sounds_like_one_sentence_we_look_at_the_chick_and_the_egg", "now_it_sounds_like_one_sentence_we_look_at_the_chips_and_the_king", "now_it_sounds_like_one_sentence_we_look_at_the_path_and_the_path", "now_it_sounds_like_one_sentence_we_look_at_the_stem_and_the_snow", "now_jam_is_on_my_hand",
  "now_look_at_the_sand", "now_ming_knows_where_it_is_hard", "now_ming_knows_where_it_is_hard_it_is_just_that_one_word", "now_ming_knows_where_it_is_hard_it_is_just_that_one_word_and_he_looks_at_it_closely", "now_ming_knows_where_it_is_hard_it_is_just_that_one_word_he_looks_at_it_too", "now_my_cup_is_not_full",
  "now_my_hand_is_clean", "now_my_leg_is_clean", "now_only_jam_is_left", "now_rice_sounds_right_here_is_a_park_here_is_a_pig", "now_say_it_with_me", "now_say_them_fast",
  "now_say_them_fast_say_them_one_more_time", "now_say_them_fast_say_them_one_more_time_at_the_end", "now_say_them_together", "now_say_them_together_say_them_one_more_time", "now_say_them_together_say_them_one_more_time_when_you_are_ready", "now_take_the_last_book_on_this_shelf_read_slowly_chunk_by_chunk_and_enjoy_being_lost_sometimes",
  "now_the_bag_moves_easily_here_is_a_bag_here_is_a_tree", "now_the_ball_works_again_here_is_a_ball_here_is_a_bed", "now_the_cake_is_up_on_the_wall_it_looks_nice_there_and_everyone_can_see_it", "now_the_cat_moves_easily_here_is_a_bird_here_is_a_blue", "now_the_chick_works_again_we_look_at_the_fan_and_the_fish", "now_the_clock_moves_easily_we_look_at_the_snow_and_the_stem",
  "now_the_coin_works_again_they_were_glad_they_kept_looking", "now_the_dish_is_clean", "now_the_duck_moves_easily_we_look_at_the_sock_and_the_wind", "now_the_game_goes_well_we_look_at_the_playground_and_the_crab", "now_the_gift_works_again_we_look_at_the_gift_and_the_cloud", "now_the_kite_stands_tall",
  "now_the_kite_works_again", "now_the_moon_is_high_in_the_sky_again_the_moon_is_still_down_in_the_lake_too", "now_the_noodle_goes_from_room_to_room_nothing_else_in_the_house_is_this_long", "now_the_panda_is_safe_china_sends_pandas_to_many_zoos", "now_the_photo_works_again", "now_the_picture_moves_easily_we_look_at_the_sand_and_the_ham",
  "now_the_picture_works_again", "now_the_pig_sleeps_on_the_bed_every_night_ming_laughs_and_makes_room_for_the_pig", "now_the_police_officer_is_telling_a_story", "now_the_problem_is_clear", "now_the_problem_is_clear_they_can_use_the_board_in_turn", "now_the_rice_is_good",
  "now_the_rice_is_not_too_hot", "now_the_room_is_tidy_and_the_bag_is_back_here_is_a_bed_here_is_a_home", "now_the_rope_is_on_me", "now_the_swan_moves_easily_we_look_at_the_slug_and_the_swan", "now_the_train_is_still", "now_the_tree_is_tall_and_green_we_are_glad",
  "now_the_turtle_is_safe_from_the_water", "now_the_whole_sentence_is_clear", "now_the_whole_sentence_is_clear_here_is_a_can_here_is_a_cat", "now_the_whole_sentence_is_clear_here_is_a_friend_here_is_a_green", "now_the_whole_sentence_is_clear_here_is_a_red_here_is_an_egg", "now_the_whole_sentence_is_clear_look_at_the_lip_and_the_ant",
  "now_the_whole_sentence_is_clear_look_at_the_mud_and_the_nut", "now_the_whole_sentence_is_clear_look_at_the_pin_and_the_rat", "now_the_whole_sentence_is_clear_they_were_glad_they_kept_looking", "now_the_whole_sentence_is_clear_we_look_at_the_fish_and_the_fog", "now_the_whole_sentence_is_clear_we_look_at_the_fog_and_the_fox", "now_the_whole_sentence_is_clear_we_look_at_the_frog_and_the_gift",
  "now_the_whole_sentence_is_clear_we_look_at_the_frog_and_the_song", "now_the_whole_sentence_is_clear_we_look_at_the_gift_and_the_glove", "now_the_whole_sentence_is_clear_we_look_at_the_sock_and_the_sock", "now_the_whole_sentence_is_clear_we_look_at_the_star_and_the_cloud", "now_there_are_more_coins", "now_there_are_more_coins_grandma_gives_him_two_more",
  "now_there_are_more_coins_grandma_gives_him_two_more_when_she_comes_in", "now_there_are_two_hats_on_one_head_they_sit_tall_and_they_will_not_stay_still", "now_they_all_sleep", "now_they_are_all_in_order", "now_they_are_all_in_order_they_were_glad_they_kept_looking", "now_they_are_friends",
  "now_they_remember_it_they_were_glad_they_kept_looking", "now_try_fin_fine_cub_cube_us_use", "now_try_star_north_girl_water_first_purple_her_bird", "now_we_can_measure_the_rain", "now_we_can_measure_the_rain_the_cup_is_our_tool", "now_we_can_measure_the_rain_the_cup_is_our_tool_because_it_shows_how_much_rain_came",
  "now_we_can_say_them_all", "now_we_know_what_a_cloud_is_look_up_and_see_the_water_in_the_sky", "now_we_know_why_boats_stay_up_it_is_the_room_full_of_light_air", "now_we_know_why_we_give_the_seed_water_and_wait", "now_wheat_sounds_right", "now_you_can_say_it_try_them_all",
  "now_you_know_how_all_the_bugs_move", "now_you_know_how_bugs_move", "now_you_know_how_these_bugs_move", "often_the_next_clause_explains_it_the_mould_a_wooden_shape_that_presses_patterns_into_dough", "oh_no_the_kite_is_in_the_tree", "old_things_are_here",
  "old_things_are_here_some_come_from_long_ago", "old_things_are_here_some_come_from_long_ago_and_they_are_very_different", "old_things_tell_stories", "old_things_tell_stories_this_pot_tells_one_about_food", "old_things_tell_stories_this_pot_tells_one_about_food_and_family", "on_a_cold_winter_day_grandma_says_we_will_make_dumplings_together",
  "on_a_rainy_saturday_afternoon_lili_notices_that_mimi_is_not_on_the_mat", "on_a_warm_summer_day_bees_fly_out_they_fly_from_flower_to_flower_in_the_sun", "on_saturday_morning_she_borrowed_the_big_bowl_and_carefully_measured_the_flour_the_oil_and_the_syrup", "on_the_festival_night_lili_put_her_own_mooncake_in_the_middle_of_the_round_table", "on_the_first_day_nothing_looks_different_they_wrote_down_grass_light_and_light", "on_the_first_day_nothing_looks_different_we_say_bug_yellow_and_hen",
  "on_the_first_day_nothing_looks_different_we_say_classroom_food_and_bee_again", "on_the_first_day_nothing_looks_different_we_say_seed_tail_and_whale_again", "on_the_first_day_nothing_looks_different_we_say_the_words_chick_floor_and_ham", "on_the_first_day_nothing_looks_different_we_say_the_words_egg_fan_and_fish", "on_the_first_day_nothing_looks_different_we_say_the_words_sand_shed_and_beach", "on_the_night_of_the_play_the_hall_is_full_of_parents_and_younger_children",
  "one_ant_cannot_carry_much_food_alone_many_ants_can_carry_big_things_together", "one_ant_goes_out_to_find_food_when_it_finds_some_it_goes_back", "one_big_one_small", "one_big_one_small_they_look_like_a_family", "one_cat", "one_coin_two_coins_three_coins",
  "one_coin_two_coins_three_coins_he_points_to_each_one", "one_cuts_one_carries_you_can_see_the_difference", "one_cuts_one_carries_you_can_see_the_difference_when_you_use_them", "one_cuts_one_helps_the_cart_go", "one_day_he_paints_too_fast_the_green_leaf_looks_wrong", "one_day_i_feed_the_pig",
  "one_day_i_feed_the_pig_it_is_hungry_so_it_eats_and_eats", "one_day_i_feed_the_pig_it_is_hungry_so_it_eats_it_all", "one_day_i_feed_the_pig_the_pig_is_hungry", "one_day_i_find_an_egg", "one_day_i_find_an_egg_it_is_small_and_warm", "one_day_i_find_an_egg_the_egg_is_small",
  "one_day_i_pick_the_corn", "one_day_i_pick_the_corn_the_corn_is_tall", "one_day_i_sit_on_the_hill", "one_day_i_sit_on_the_hill_i_look_at_the_farm", "one_day_i_wash_the_goat", "one_day_i_wash_the_goat_it_is_clean_now",
  "one_day_i_wash_the_goat_the_goat_is_clean_now", "one_day_i_watch_the_rain", "one_day_i_watch_the_rain_i_stay_at_home", "one_day_is_not_enough_for_all_of_it_he_paints_one_page", "one_day_my_cap_is_not_here", "one_day_the_cat_talks",
  "one_day_the_hat_is_not_here", "one_day_the_hen_has_eggs_too", "one_day_the_king_cannot_find_the_ring", "one_day_the_little_chick_comes_out", "one_day_the_ring_is_not_here", "one_has_sh_one_has_ch",
  "one_is_missing_she_says_who_took_it", "one_leg_two_legs", "one_more_bug_comes_it_jumps_again", "one_more_bug_comes_the_frog_is_glad", "one_more_bug_comes_the_frog_jumps_again", "one_morning_the_bag_walks_to_school",
  "one_morning_there_is_a_small_change", "one_morning_there_is_a_small_change_look_at_the_bug_and_the_yellow", "one_morning_there_is_a_small_change_we_look_at_the_chick_and_the_floor", "one_morning_there_is_a_small_change_we_look_at_the_egg_and_the_fan", "one_morning_there_is_a_small_change_we_look_at_the_grass_and_the_light", "one_morning_there_is_a_small_change_we_look_at_the_sand_and_the_shed",
  "one_night_he_is_too_tired_he_puts_the_bag_under_the_bed", "one_night_he_is_too_tired_he_puts_the_bag_under_the_bed_so_he_can_rest", "one_night_i_get_up_and_look", "one_night_the_book_reads_a_new_story_ming_sits_up_after_the_first_word", "one_night_the_moon_talks_to_ming_the_moon_says_it_wants_a_warm_scarf", "one_pig_rides_fast",
  "one_plate_is_big", "one_plate_is_big_it_is_for_ming", "one_plate_is_small", "one_plate_is_small_it_is_for_grandma", "one_saturday_he_wheeled_it_into_the_yard_and_said_today_we_shall_make_it_run_again", "one_sentence_does_not_make_sense_before_they_went_on_they_wrote_down_horse_house_and_jam",
  "one_sentence_does_not_make_sense_before_they_went_on_they_wrote_down_house_jam_and_jug", "one_sentence_does_not_make_sense_before_they_went_on_they_wrote_down_window_house_and_neighbor", "one_sentence_does_not_make_sense_they_looked_more_than_once_three_words_mattered_that_day_later_patient_and_stranger", "one_sentence_does_not_make_sense_they_looked_more_than_once_three_words_mattered_that_day_promise_planet_and_protect", "one_sentence_does_not_make_sense_they_looked_more_than_once_three_words_mattered_that_day_scientist_scientist_and_realize", "one_sentence_does_not_make_sense_they_made_a_list_hat_hen_and_hill",
  "one_sentence_does_not_make_sense_they_made_a_list_hen_hill_and_hole", "one_sentence_does_not_make_sense_they_made_a_list_snake_bike_and_gate", "one_sentence_does_not_make_sense_they_wrote_down_frog_gift_and_glove", "one_sentence_does_not_make_sense_they_wrote_down_frog_song_and_fog", "one_sentence_does_not_make_sense_they_wrote_down_gift_glove_and_grandma", "one_sentence_does_not_make_sense_they_wrote_down_star_cloud_and_crab",
  "one_sentence_does_not_make_sense_they_wrote_down_three_words_hill_hole_and_home", "one_sentence_does_not_make_sense_they_wrote_down_three_words_winter_home_and_horse", "one_sentence_does_not_make_sense_they_wrote_down_three_words_worker_yogurt_and_brother", "one_sentence_does_not_make_sense_they_wrote_three_words_on_the_board_knee_knife_and_lake", "one_sentence_does_not_make_sense_they_wrote_three_words_on_the_board_season_lake_and_leaf", "one_sentence_does_not_make_sense_they_wrote_three_words_on_the_board_shadow_visitor_and_wheat",
  "one_sentence_does_not_make_sense_three_words_mattered_that_day_believe_later_and_memory", "one_sentence_does_not_make_sense_three_words_mattered_that_day_city_continue_and_future", "one_sentence_does_not_make_sense_three_words_mattered_that_day_patience_patient_and_planet", "one_sentence_does_not_make_sense_three_words_mattered_that_day_reason_stranger_and_sudden", "one_sentence_does_not_make_sense_three_words_mattered_that_day_weather_weather_and_weather", "one_sentence_does_not_make_sense_we_say_can_cat_and_cup",
  "one_sentence_does_not_make_sense_we_say_friend_green_and_milk", "one_sentence_does_not_make_sense_we_say_grandpa_grapes_and_grass_again", "one_sentence_does_not_make_sense_we_say_grapes_grass_and_green_again", "one_sentence_does_not_make_sense_we_say_leaf_moon_and_pool_again", "one_sentence_does_not_make_sense_we_say_lip_ant_and_bin", "one_sentence_does_not_make_sense_we_say_mud_nut_and_pan",
  "one_sentence_does_not_make_sense_we_say_pin_rat_and_rock", "one_sentence_does_not_make_sense_we_say_red_egg_and_fish", "one_sentence_does_not_make_sense_we_say_the_words_fish_fog_and_fox", "one_sentence_does_not_make_sense_we_say_the_words_fog_fox_and_friend", "one_sentence_does_not_make_sense_we_say_the_words_sock_sock_and_shed", "one_small_hole_it_made_the_sock_no_good",
  "one_small_hole_the_sock_was_no_good", "one_small_lamp_is_on", "one_small_letter_one_big_change_that_is_magic_e", "one_sock_two_socks", "one_star_comes_down_at_night", "one_step_two_steps",
  "one_thing_can_be_enough_for_two_people", "one_thing_can_be_enough_for_two_people_it_made_more_sense_now", "one_thing_can_be_enough_for_two_people_we_say_the_words_again_coat_and_goat", "one_tongue_three_spellings_and_you_can_hear_them_all_today", "one_two_three_ducks", "one_two_three_flop",
  "one_word_at_a_time_is_not_how_a_sentence_goes", "order_turns_a_mess_into_something_clear_it_was_a_good_thing_to_notice", "ou_ow_oi_oy_au_aw_six_spellings_four_sounds_say_them", "our_class_goes_on_a_big_trip", "our_class_puts_on_a_short_play_about_a_little_seed_that_is_afraid_to_grow", "our_coats_and_scarves_keep_the_cold_out",
  "our_home_has_a_green_tree_we_feel_glad", "our_legs_hurt_but_we_do_not_turn_back", "our_school_holds_a_sports_day_every_autumn", "our_teacher_says_the_best_part_is_not_the_score", "our_team_wears_red_ming_shouts_until_his_voice_is_almost_gone", "out_in_the_sun",
  "painting_it_again_takes_more_time_but_he_does_not_mind", "pandas_eat_bamboo", "pandas_live_high_in_cool_wet_forests_where_bamboo_grows_all_year", "pass_me_the_chopsticks_please", "patience_is_a_kind_of_strength", "pen_and_pin",
  "pen_is_not_pin", "people_built_it_many_years_ago_it_was_very_hard_work", "people_can_help_where_maps_cannot_it_was_a_good_thing_to_notice", "people_eat_the_noodles", "people_eat_the_noodles_they_eat_them_hot", "people_eat_the_noodles_they_eat_them_hot_because_they_taste_best_then",
  "people_from_all_over_the_world_come_to_visit_it", "people_make_noodles", "people_make_noodles_they_make_it_into_long_lines", "people_make_noodles_they_make_them_into_long_lines", "people_make_noodles_they_pull_them_into_long_lines", "people_take_the_wheat_and_make_it_dry_then_they_break_it_into_very_small_pieces",
  "people_used_it_long_ago", "people_used_it_long_ago_they_cooked_rice_in_it", "people_used_it_long_ago_they_cooked_rice_in_it_and_they_ate_together", "people_used_to_travel_by_streetcar", "pick_up_the_sack", "pictures_can_say_things",
  "pictures_can_say_things_they_can_tell_a_story", "pigs_are_at_home_on_farms", "plants_need_sunlight_and_water", "plants_need_water_and_sun", "play_goat_play", "please_call_me_tomorrow",
  "please_hand_out_the_workbooks", "please_stand_in_line", "please_stand_in_line_and_wait", "please_wait_inside_the_room", "plop_plop", "practice_is_making_a_path",
  "practice_is_making_a_path_a_path_you_can_use_later", "practice_is_making_a_path_it_is_a_path_you_can_use_later", "practice_is_not_just_doing", "practice_is_not_just_doing_it_is_doing_it_again_with_care", "practice_is_not_just_doing_it_is_doing_it_again_with_care_and_that_is_what_makes_it_work", "practice_is_the_answer",
  "practice_is_the_answer_ming_practices_writing_his_name", "practice_is_the_answer_ming_practices_writing_his_name_because_he_wants_it_to_look_good", "practice_makes_the_hard_part_easy_looking_back_it_seemed_clear", "practice_makes_us_better", "practice_makes_us_better_ming_sees_it_when_he_writes", "practice_makes_us_better_ming_sees_it_with_his_pen",
  "practice_works", "practice_works_his_name_looks_different_now", "practice_works_his_name_looks_different_now_and_he_can_see_the_change", "practicing_everything_at_once_is_too_much_now_they_could_see_why", "prehistoric_humans_used_spears", "press_the_button_to_download",
  "pulling_harder_does_not_help", "push_push_it_will_not_move", "pushing_hard_could_break_something", "pushing_hard_could_break_something_it_made_more_sense_now", "pushing_hard_could_break_something_we_say_the_words_again_zoo_and_bee", "put_away_your_toys_please",
  "put_it_here_please", "put_on_your_life_jacket", "put_the_cap_on_the_box", "put_your_hands_on_the_loud_drum_you_can_feel_the_drum_move_under_your_hands", "questions_lead_to_answers", "quiet_letters_can_be_there",
  "quiet_letters_can_be_there_they_are_part_of_the_word", "quiet_letters_can_be_there_they_are_part_of_the_word_so_do_not_drop_them_when_you_write", "rain_and_day", "rain_and_day_both_words_are_easy_to_say", "rain_and_sun_make_the_green_shoots_rise", "rain_can_be_in_the_day",
  "rain_can_be_in_the_day_both_words_are_good", "rain_can_be_in_the_day_both_words_are_good_to_know", "rain_can_be_measured", "rain_can_be_measured_so_can_many_other_things", "rain_day_rain_day", "rain_day_rain_day_now_you_can_read_both",
  "rain_falls_on_my_coat_and_on_my_bag", "rain_falls_the_field_is_wet_and_soft", "rain_helps_the_seed", "rain_helps_the_seed_with_no_rain_it_stays_dry", "rain_is_good", "rain_is_good_for_the_farm",
  "rain_is_good_for_the_farm_the_seeds_can_grow", "rain_is_good_for_the_farm_the_seeds_can_grow_now", "rain_is_good_now_we_know_why", "rain_is_not_day", "rain_is_not_day_one_is_water_and_one_is_time", "rain_is_on_the_farm",
  "rain_is_on_the_farm_the_sky_is_gray", "rain_makes_the_ground_wet", "rain_makes_the_ground_wet_the_water_goes_down", "rain_on_the_roof_all_night", "rain_rain_go_away", "rain_rain_rain",
  "rain_rain_we_are_on_the_train", "read_it_all_at_once", "read_it_all_at_once_and_keep_the_words_together", "read_it_all_at_once_it_will_make_sense", "read_it_as_one", "read_it_as_one_then_it_is_easy_to_understand",
  "read_it_as_one_then_it_is_easy_to_understand_because_the_words_help_each_other", "read_the_whole_sentence", "read_the_whole_sentence_do_not_stop_at_each_word", "read_the_whole_sentence_do_not_stop_at_each_word_because_that_breaks_the_line", "read_the_whole_sentence_do_not_stop_at_each_word_because_that_breaks_the_thought", "read_these_aloud_what_is_that_who_said_so_when_do_we_go",
  "read_this_in_the_corner_of_the_shed_beside_the_old_wooden_box_a_small_bell_rang", "reading_gets_easier", "reading_is_closer_to_speaking_than_to_spelling", "reading_is_closer_to_speaking_than_to_spelling_it_was_a_good_lesson", "reading_is_closer_to_speaking_than_to_spelling_it_was_worth_thinking_about", "ready_go_the_race_starts_we_all_run_fast",
  "red_and_yellow_make_orange", "red_here_blue_there", "red_wins_by_half_a_boat_the_bank_erupts_and_lili_jumps_up_and_down", "remembering_is_easier_with_a_good_way_looking_back_it_seemed_clear", "remembering_is_not_the_same_as_telling", "remembering_is_not_the_same_as_telling_it_was_a_good_thing_to_notice",
  "rice_and_buns_are_fun", "rice_and_grapes_on_the_plate", "rice_eggs_and_milk_are_good_food_apples_and_green_leaves_are_good_food_too", "rice_is_a_small_seed_it_grows_in_a_wet_field", "rice_is_food_for_us_every_day", "rice_is_in_a_pot",
  "rice_is_in_my_cup", "rice_is_the_most_important_food_in_china_people_eat_it_every_day", "rice_needs_a_wet_field_and_sun", "ride_a_bike", "ride_a_bike_it_is_hard_at_first_and_then_it_is_easy", "room_twelve_please",
  "roses_are_nice", "roses_are_nice_ming_will_pick_one_again_next_week", "run_and_grab_the_flag", "run_duck_run", "run_lili_run_the_kite_goes_up", "run_pup_run",
  "running_was_not_the_answer_it_was_a_good_lesson", "rushing_is_not_the_answer", "rushing_made_the_break_bigger", "same_and_almost_the_same_are_not_the_same", "same_and_almost_the_same_are_not_the_same_it_was_a_good_thing_to_notice", "sand_is_little_pieces_of_rock",
  "save_me_a_mooncake_he_says_his_voice_is_warm", "save_me_a_mooncake_he_says_i_put_one_in_a_box_for_him", "say_bird", "say_bird_say_it_again", "say_cap", "say_cap_say_it_slow",
  "say_cap_say_it_slowly_and_keep_the_a_short", "say_cape", "say_cape_say_it_again", "say_cape_say_it_again_and_hold_the_a_longer", "say_cape_say_it_again_and_let_the_a_say_its_name", "say_car",
  "say_car_say_it_slow", "say_car_say_it_slowly", "say_chip", "say_cow", "say_cow_say_it_again", "say_day",
  "say_day_say_it_again", "say_day_say_it_again_and_keep_the_d_quick", "say_each_one_slowly_and_check_the_ow", "say_each_one_slowly_and_check_the_ow_sound", "say_house", "say_house_say_it_slow",
  "say_house_say_it_slowly", "say_it_hat", "say_knee", "say_knee_say_it_slow", "say_knee_say_it_slowly", "say_pen",
  "say_pin", "say_rain", "say_rain_say_it_slow", "say_rain_say_it_slowly_and_clearly", "say_ship", "say_the_r_well",
  "say_the_r_well_do_not_drop_it", "say_the_r_well_do_not_drop_it_when_you_talk_fast", "say_the_whole_sentence", "say_the_whole_sentence_say_it_from_start_to_end", "say_the_whole_sentence_say_it_from_start_to_end_and_keep_the_words_together", "say_them_thin_thick_three_thank",
  "say_tr_ee", "say_tree", "say_write", "say_write_say_it_again", "saying_the_order_helps_the_eyes_see_it_now_they_could_see_why", "saying_the_order_helps_the_eyes_see_it_we_say_the_words_again_tail_and_goat",
  "school_ended_early_that_friday_and_the_sky_was_already_dark_when_ming_and_lili_stepped_outside_the_gate", "school_is_over_at_four", "search_the_park", "search_the_park_it_was_there_all_the_time", "see_sit_feet_fit_coat_cot_say_them", "see_the_green_tree",
  "see_you_next_week_mom_says_they_walk_home_with_the_full_basket", "see_you_next_week_mom_says_to_the_man_at_the_door", "seeds_are_small_but_they_go_a_long_way_wind_birds_and_water_all_help_them_along", "seeds_go_far_because_plants_need_new_ground_that_is_how_green_things_get_across_the_fields", "seeds_go_far_because_plants_need_new_ground_that_is_how_plants_get_across_the_fields", "shadows_are_fun_to_watch",
  "she_answers_every_question_and_sends_a_photo_of_her_green_garden", "she_asks_how_tall_the_plant_grew_and_ming_shows_her_the_marks", "she_asks_which_one_grew_first_and_ming_shows_her_the_marks", "she_can_sing_and_dance", "she_clears_the_table_herself", "she_comes_and_stands_at_the_door_she_listens_with_ming_until_the_story_is_done",
  "she_dances_softly", "she_goes_out_by_the_window", "she_had_watched_grandma_do_it_many_times_and_it_looked_simple_dough_filling_a_mould_and_an_oven", "she_has_a_nice_smile", "she_has_a_red_hen", "she_has_a_red_shirt_too_she_smiles_at_me",
  "she_has_a_star_in_her_hair", "she_has_big_eyes_and_small_ears", "she_has_curly_hair", "she_has_long_hair", "she_has_straight_hair", "she_has_to_go_shopping",
  "she_has_to_look_after_her_little_brother", "she_is_a_dancer", "she_is_a_famous_artist", "she_is_a_lovely_player", "she_is_a_talented_musician", "she_is_afraid_of_dogs",
  "she_is_an_actress_who_is_well_known", "she_is_an_office_worker", "she_is_chinese", "she_is_from_australia", "she_is_from_canada", "she_is_going_to_buy_a_book",
  "she_is_hard_working_and_clever", "she_is_in_my_class", "she_is_kind_and_quiet", "she_is_my_english_teacher", "she_is_my_teacher", "she_is_not_afraid_of_me",
  "she_is_the_tallest_of_the_three", "she_is_the_third_girl", "she_is_unhappy_today", "she_is_very_nice", "she_likes_cats", "she_likes_to_paint",
  "she_mixes_flour_and_water_in_a_big_bowl_until_the_dough_is_smooth", "she_said_she_was_dizzy", "she_sat_down_wiped_the_table_and_read_grandma_s_notes_one_line_at_a_time", "she_shouldn_t_run_on_the_stairs", "she_shows_him_again_slowly_this_time_he_watches_her_hands", "she_suggests_one_more_thing_a_small_box_for_the_little_books",
  "she_suggests_one_more_thing_a_small_box_that_will_hold_the_little_books", "she_suggests_one_more_thing_a_small_light_so_people_can_read_at_night", "she_suggests_one_more_thing_a_small_light_so_people_can_read_when_it_is_dark", "she_sweeps_the_floor_every_day", "she_takes_one_noodle_and_gives_a_big_pull_it_comes_out_long_and_she_sees_that_it_keeps_going", "she_takes_one_noodle_and_gives_it_a_big_pull_it_comes_out_long_and_she_sees_that_it_keeps_going",
  "she_takes_part_in_triathlons", "she_tells_the_class_what_she_found_they_look_at_the_three_pots", "she_waits_at_the_door_with_a_warm_smile_and_hot_soup", "she_watched_tv_yesterday", "she_wears_a_watch_on_her_wrist", "she_writes_for_grandpa_who_showed_me_the_stars_at_night",
  "sheep_are_on_the_hill", "sheep_are_on_the_hill_they_stand_on_the_grass", "sheep_are_on_the_hill_they_stand_on_the_grass_and_eat", "sheep_can_you_get_down", "ship_and_chip", "ship_is_not_chip",
  "short_is_not_bad_at_all", "sing_chick_sing", "sing_duck_sing", "sit_beside_me_and_enjoy_the_sunshine", "sit_with_me_said_the_cat", "six_eggs_hatch",
  "six_eggs_in_the_nest", "six_long_boats_wait_in_a_row_each_with_a_carved_dragon_head_at_the_front", "skip_and_spin_is_fun", "sleep_bees_sleep", "sleep_helps_us_grow_just_like_good_food_we_must_sleep_well_at_night", "slip_i_slip",
  "slow_and_safe", "slow_can_be_good", "slow_can_be_good_slow_can_be_safe_too", "slow_can_be_good_slow_can_be_safe_too_when_a_big_fish_is_near", "slow_is_not_always_slower", "slow_is_not_always_slower_it_was_worth_thinking_about",
  "slowly_the_black_patches_appear_around_its_eyes_and_ears", "slowly_they_go_to_sleep", "slowly_they_go_to_sleep_here_is_a_sun_here_is_a_bag", "slowly_they_go_to_sleep_they_were_glad_they_kept_looking", "slowly_they_go_to_sleep_we_look_at_the_star_and_the_light", "small_changes_are_strong",
  "small_days_make_a_big_habit", "small_parts_add_up_to_something_big_it_was_a_good_thing_to_notice", "small_steps_long_way", "small_steps_long_way_he_gets_to_the_tree_at_last", "small_steps_make_a_long_way_he_gets_to_the_tree_at_last", "small_things_can_make_a_difference",
  "snap_and_clap", "snap_snap_my_hand", "snow_is_cold_and_it_comes_in_winter_when_you_hold_snow_your_hand_gets_cold_fast", "snow_is_on_the_street", "snow_on_the_street_is_good", "so_he_starts_at_the_beginning_and_tells_it_once_more",
  "so_ming_starts_at_the_beginning_he_tells_the_park_part_too", "so_ming_starts_at_the_beginning_he_tells_the_park_part_too_so_nothing_is_missing", "so_sometimes_our_part_is_toward_the_sun_the_sun_is_high_then_and_the_days_are_long", "so_sometimes_our_part_of_the_earth_is_toward_the_sun_the_sun_is_high_then_and_the_days_are_long", "so_the_gold_went_away", "so_the_seasons_change",
  "so_the_seasons_change_it_happens_every_year", "so_the_seasons_change_it_happens_every_year_because_the_earth_keeps_going", "so_they_go_back_and_look_more_slowly", "so_they_go_back_and_look_more_slowly_this_time_they_went_more_slowly", "so_we_see_a_round_moon_big_like_a_mooncake", "so_we_see_a_round_moon_big_like_a_mooncake_that_is_why_it_looks_full",
  "so_winter_is_cold", "so_winter_is_cold_that_is_why_we_wear_coats", "solar_energy_is_clean", "solar_panels_make_clean_energy", "some_bugs_have_wings_and_fly", "some_bugs_jump_up_and_down",
  "some_bugs_walk_on_six_legs", "some_cake_and_jam", "some_days_it_is_not_easy", "some_eggs_have_a_baby_chick_inside", "some_letters_are_quiet", "some_letters_are_quiet_but_they_are_still_in_the_word",
  "some_light_is_bright_and_some_light_is_dim_we_read_and_write_in_bright_light", "some_people_eat_noodles", "some_people_eat_noodles_in_the_south_many_do", "some_people_eat_noodles_in_the_south_many_do_and_they_eat_them_often", "some_seeds_are_very_small_and_light_the_wind_can_take_them_a_long_way", "some_seeds_just_fall_near_the_big_plant_most_seeds_do_not_go_very_far_at_all",
  "some_seeds_ride_on_the_water_the_water_takes_them_down_to_a_new_place", "some_steps_are_small", "some_things_are_hot_and_some_things_are_cold_you_can_feel_hot_and_cold_with_your_hands", "some_things_come_when_we_wait", "some_things_did_not_work", "some_things_did_not_work_his_kite_went_into_a_tree",
  "some_things_do_not", "some_things_do_not_the_other_pot_stays_dark_and_dry", "some_things_do_not_the_other_pot_stays_dark_and_dry_because_it_gets_no_sun", "some_things_do_not_the_other_pot_stays_dark_because_it_gets_no_sun", "some_things_go_well", "some_things_go_well_the_warm_pot_has_a_green_stem",
  "some_things_work_better_by_themselves", "some_trains_run_under_the_ground_in_a_big_city_some_trains_run_high_over_the_ground", "some_words_come_first_and_others_come_after_the_order_helps_you_read", "some_words_go_after", "some_words_go_in_front", "some_words_go_in_front_and_some_go_after_the_order_helps_you_read",
  "some_words_go_in_front_some_words_go_after", "some_words_go_in_front_some_words_go_after_this_helps", "some_work_takes_a_long_time_ming_thinks_about_the_future", "some_work_takes_a_long_time_ming_thinks_about_the_future_when_the_book_will_be_done", "someone_saw_the_ball", "someone_saw_the_ball_it_went_that_way",
  "someone_saw_the_ball_it_went_that_way_when_the_wind_pushed_it", "sometimes_it_is_soft_and_light", "sometimes_it_reads_slowly_when_ming_wants_to_sleep_it_reads_in_a_soft_way_so_the_room_stays_quiet", "sometimes_it_reads_slowly_when_ming_wants_to_sleep_its_sound_is_soft_so_the_room_stays_quiet", "sometimes_our_part_is_away_from_the_sun_the_sun_is_not_high_so_it_is_cold", "sometimes_our_part_is_toward_the_sun",
  "sometimes_our_part_is_toward_the_sun_the_sun_is_high_then", "sometimes_our_part_is_toward_the_sun_the_sun_is_high_then_and_the_days_are_long", "sometimes_our_part_of_the_earth_is_away_from_the_sun_the_sun_is_not_high_so_it_is_cold", "sometimes_our_part_turns_away", "sometimes_our_part_turns_away_the_sun_is_not_high", "sometimes_our_part_turns_away_the_sun_is_not_high_so_it_is_cold",
  "sometimes_the_moon_looks_small", "sometimes_the_moon_looks_small_we_see_only_a_thin_part", "sometimes_the_moon_looks_small_we_see_only_a_thin_part_and_the_rest_is_dark", "sometimes_the_wind_is_very_strong", "sometimes_they_look_at_the_map_again_they_look_because_they_want_to_be_sure_of_the_way", "sometimes_we_see_only_a_thin_part_of_it_then_the_moon_looks_thin",
  "songs_help_the_mind_hold_on_now_they_could_see_why", "soon_all_thirty_sing", "soon_it_is_up_again", "soon_the_sky_is_a_little_bright_the_moon_must_go_back_up_to_the_sky", "sound_goes_through_the_air_to_your_ears_you_can_hear_a_thing_far_away_in_this_way", "sound_goes_through_the_air_to_your_head_you_can_hear_a_thing_far_away_in_this_way",
  "sounds_are_all_around_you_every_day_you_hear_them_at_home_at_school_and_in_the_park", "sounds_can_be_loud_and_sounds_can_be_quiet_a_shout_is_loud_and_a_soft_song_is_quiet", "soup_is_ready_mom_says_the_kitchen_smells_good", "special_things_hide_in_small_details_we_say_the_words_again_tide_and_boat", "spin_spin_spin", "spring_summer_fall_winter",
  "spring_summer_fall_winter_each_one_looks_different", "spring_summer_fall_winter_each_one_looks_different_and_each_one_brings_new_things", "stand_up_sit_down", "stars_are_up_in_the_dark", "steady_is_better", "steady_steps_go_far",
  "steam_rises_the_rice_is_soft_and_warm", "step_by_step_ming_goes_on", "step_by_step_ming_goes_on_the_path_is_long_and_hot", "step_stop_clap_swim_frog_tree_say_them", "still_the_best_day", "still_the_same_grandma_wants_to_give_up",
  "still_the_same_grandpa_wants_to_give_up", "still_the_same_lili_wants_to_give_up", "still_the_same_ming_wants_to_give_up", "still_the_same_mom_wants_to_give_up", "stop_and_listen_to_the_room_you_are_in_how_many_sounds_can_you_hear_right_now", "stop_frog_stop",
  "stop_not_suh_top_just_one_word_stop", "stop_the_bus_stop", "such_a_big_chip", "such_a_long_song", "such_a_loud_song", "summer_means_weeding_watching_the_water_level_and_chasing_birds_away_from_the_ripening_grain",
  "sun_rain_mud_and_hands_that_is_rice", "surfing_is_exciting", "swim_two_lips_then_a_hum_swim", "tap_tap_tap", "tell_me_a_story_please", "ten_cubes_so_huge",
  "ten_eggs_in_the_pen", "ten_men_on_a_bed", "ten_men_ten_men", "thank_you_grandpa_says_he_puts_the_gift_by_his_bed", "thank_you_ming_the_teacher_says_she_looks_at_the_picture_a_long_time", "thank_you_mom_ming_says_he_hugs_her_because_he_is_glad",
  "thank_you_you_are_the_first_to_find_it", "that_ball_is_small", "that_cat_is_thick", "that_evening_grandpa_wrote_a_date_on_the_frame_a_bicycle_he_said_should_have_a_memory", "that_is_not_fair_to_one_of_them", "that_is_the_whole_story_a_question_like_this_turns_fifteen_pages_into_one_clear_line",
  "that_is_why_practice_works_the_path_is_there_when_he_needs_it", "that_night_grandma_sings_it_once_more_ming_goes_to_sleep_with_the_song", "that_night_he_puts_everything_by_the_door_again", "that_night_the_rain_kept_falling_but_the_long_way_home_felt_like_the_right_way_after_all", "that_one_is_yours_she_says_with_a_smile", "that_small_part_is_easy_now_they_were_glad_they_kept_looking",
  "the_air_inside_is_very_light_light_air_helps_the_boat_stay_up", "the_animals_are_happy", "the_animals_are_happy_they_sit_in_the_sun_and_rest", "the_animals_are_hungry", "the_animals_are_hungry_they_come_near_us", "the_answer_is_good",
  "the_answer_is_good_seeds_need_water_to_grow", "the_answer_is_good_seeds_need_water_to_grow_and_now_she_can_show_why", "the_answer_is_not_easy", "the_answer_is_not_easy_nothing_grows_in_two_of_the_pots", "the_answer_is_not_easy_two_of_the_pots_do_not_grow", "the_answer_is_not_easy_two_of_the_pots_do_not_grow_and_she_does_not_know_why",
  "the_answer_is_not_on_the_moth", "the_answer_is_right", "the_answer_is_right_the_teacher_smiles", "the_answer_is_right_the_teacher_smiles_and_the_class_claps", "the_answer_was_right_but_not_the_right_answer", "the_answer_was_right_but_not_the_right_answer_it_was_a_little_disappointing",
  "the_ant_gets_the_nut_up", "the_ant_has_a_nut", "the_ant_is_happy", "the_ant_is_small", "the_ant_pulls_the_nut_to_its_home", "the_ant_pulls_the_nut_up_the_hill",
  "the_ant_walks_all_day_long", "the_apple_is_good", "the_astronaut_is_my_hero", "the_astronaut_looks_at_mars_through_a_telescope", "the_bag_goes_down_the_street", "the_bag_is_too_much_for_one_pair_of_hands_we_say_bag_tree_and_water",
  "the_bag_likes_school", "the_bag_sits_under_a_desk", "the_ball_does_not_work_on_the_playground", "the_ball_is_by_the_gate", "the_ball_is_by_the_gate_ming_runs_to_get_it", "the_ball_is_by_the_gate_ming_runs_to_get_it_and_he_laughs",
  "the_ball_is_not_here", "the_ball_is_not_here_he_looks_at_the_grass", "the_ball_is_on_the_box", "the_ball_is_soft_and_wet_now_it_is_ready_for_the_oven", "the_ball_is_too_small_and_he_is_sad", "the_ball_is_under_the_bed",
  "the_ball_is_under_the_box", "the_ball_of_snow_is_big_and_cold", "the_basket_is_empty_now", "the_basket_is_full_ming_holds_one_side", "the_bed_is_flat", "the_bees_can_read_too_no_no_no",
  "the_bees_can_see_the_moon", "the_bees_sleep_on_the_moon", "the_bell_still_rang_clearly_as_bright_as_it_must_have_sounded_thirty_years_before", "the_best_idea_came_after_they_talked", "the_best_idea_came_after_they_talked_it_was_worth_thinking_about", "the_best_place_to_look_is_often_where_you_started",
  "the_best_place_to_look_is_often_where_you_started_it_was_a_good_lesson", "the_big_hat_is_still_over_his_face_he_cannot_find_the_door_at_all", "the_big_hat_is_still_over_his_face_he_cannot_find_the_door_at_all_because_he_cannot_see_anything", "the_bike_goes", "the_bike_goes_it_goes_slowly_at_first", "the_bike_goes_it_goes_slowly_at_first_and_ming_holds_on",
  "the_bike_is_big", "the_bike_is_big_it_is_too_big_for_ming", "the_bike_is_big_it_is_too_big_for_ming_but_he_wants_to_try", "the_bird_can_sing", "the_bird_flies", "the_bird_flies_long_and_far",
  "the_bird_flies_with_its_wings_up_and_up_it_goes", "the_bird_flies_with_the_wing", "the_bird_flies_with_the_wing_up_and_up_it_goes", "the_bird_is_flying", "the_bird_sits_and_sits", "the_black_cat_sits_still",
  "the_blue_sweater_is_mine", "the_board_holds_ideas", "the_board_is_full_now", "the_board_is_full_now_there_is_no_room_for_more", "the_boat_comes_back", "the_boat_comes_back_the_wind_brings_it_home",
  "the_boat_goes_away", "the_boat_goes_far", "the_boat_goes_far_it_is_very_small_now", "the_boat_goes_on_the_sea", "the_boat_goes_on_the_sea_it_goes_far_out", "the_boat_is_small",
  "the_boat_is_small_it_goes_up_and_down_on_the_water", "the_boat_rocks_on_the_pond", "the_bone_is_home_too", "the_book_gets_thick_there_are_many_pages_now", "the_book_gets_thick_there_are_many_pages_now_and_he_counts_them", "the_book_reads_the_same_story_every_night_ming_knows_it_well_because_he_listens_every_night",
  "the_book_turns_one_page_and_keeps_reading_it_reads_on_because_the_story_is_not_done", "the_boy_scout_learned_first_aid", "the_brave_little_mouse", "the_brave_little_mouse_it_is_quick_and_it_is_careful_too", "the_brave_little_mouse_it_was_quick_and_it_was_careful_too", "the_bridge_is_fifty_five_kilometres_long",
  "the_bridge_is_old_its_stones_are_wide", "the_bright_part_grows_and_then_it_gets_small_again_night_after_night", "the_bright_part_we_see_grows_and_then_it_gets_small_again_night_after_night", "the_brown_cow", "the_brown_cow_it_takes_the_grass", "the_bug_hops_back_to_the_rock",
  "the_bug_hops_to_my_hand", "the_bug_is_in_my_mug", "the_bug_is_in_the_jug", "the_bug_is_on_a_rock", "the_bug_is_small", "the_building_which_he_designed_is_famous",
  "the_bun_is_in_my_hand", "the_bus_is_big", "the_bus_is_here", "the_bus_is_on_the_road", "the_bus_runs_and_runs", "the_bus_stops_at_last",
  "the_bus_stops_here", "the_cake_bakes_in_the_hot_stove_the_home_smells_sweet", "the_cake_gets_bigger", "the_cake_gets_bigger_ming_stays_and_watches_it", "the_cake_gets_bigger_ming_watches_it", "the_cake_gets_bigger_ming_watches_it_and_does_not_go_away",
  "the_cake_goes_in_the_hot_place", "the_cake_goes_in_the_hot_place_it_is_hot_in_there", "the_cake_goes_in_the_oven_it_is_hot_in_there", "the_cake_has_little_holes_inside_the_heat_makes_them_big_and_they_push_it_up", "the_cake_is_by_the_lake", "the_cake_is_for_grandma",
  "the_cake_is_for_grandma_he_does_not_tell_her", "the_cake_is_good", "the_cake_is_good_it_smells_sweet", "the_cake_is_good_it_smells_sweet_and_it_is_warm", "the_cake_is_high_now", "the_cake_is_high_now_it_is_soft_and_brown_on_top",
  "the_cake_is_high_now_it_is_soft_too", "the_cake_is_not_big_but_we_share_it", "the_cake_is_not_right", "the_cake_is_not_right_it_is_thin_and_dry", "the_cake_is_on_the_plate", "the_cake_is_yummy_the_salad_is_healthy",
  "the_camel_has_a_hump", "the_camel_lives_in_the_desert", "the_cap_is_in_the_gap", "the_cap_is_in_the_van", "the_cap_is_on_the_map", "the_capital_existed_hundreds_of_years_ago",
  "the_captain_sailed_the_ship", "the_car_is_red_my_car", "the_cart_is_by_the_barn", "the_cart_is_full", "the_cart_rolls_on_by_itself", "the_cartoon_is_fantastic",
  "the_cat_and_the_star_play_ball", "the_cat_comes_to_look_at_the_noodle_she_walks_on_it_because_it_looks_like_a_line", "the_cat_goes_away", "the_cat_goes_away_the_kitchen_is_quiet_again", "the_cat_goes_away_the_kitchen_is_quiet_again_and_the_bread_is_still_there", "the_cat_is_behind_the_door",
  "the_cat_is_on_my_lap", "the_cat_is_on_the_bed", "the_cat_is_small_and_happy", "the_cat_is_too_much_for_one_pair_of_hands_we_say_bird_blue_and_cat", "the_cat_is_under_the_tree", "the_cat_is_wet",
  "the_cat_just_sat_on_it", "the_cat_likes_milk", "the_cat_looks_at_me", "the_cat_ran_at_the_rat", "the_cat_runs_home", "the_cat_sat_on_the_bag",
  "the_cat_sat_on_the_rat", "the_cat_says_hello_to_ming", "the_cat_sits_on_the_bed", "the_cat_wears_the_big_hat_it_is_just_right_for_the_little_cat", "the_cat_wears_the_big_hat_when_it_does_the_hat_is_just_right_for_the_little_cat", "the_chain_is_on_the_dog",
  "the_chain_is_on_the_dog_it_is_not_long", "the_chain_is_short_so_the_dog_stays_by_the_house", "the_change_had_been_happening_all_along_we_say_the_words_again_classroom_and_food", "the_change_had_been_happening_all_along_we_say_the_words_again_seed_and_tail", "the_change_is_slow_the_garden_shows_it", "the_characters_mean_good_luck_and_a_long_life_lili_traces_one_with_her_finger",
  "the_cheese_is_fresh", "the_cheese_is_fresh_it_is_on_a_dish", "the_cheese_is_soft", "the_chick_and_mimi_munch", "the_chick_comes_out_of_the_egg", "the_chick_does_not_eat_it",
  "the_chick_does_not_work_at_home", "the_chick_eats_and_eats", "the_chick_eats_it_all_up_we_look_at_the_wing_and_the_cheese", "the_chick_grows_day_by_day", "the_chick_has_a_chip", "the_chick_is_a_hen_now",
  "the_chick_is_fat_now", "the_chick_is_not_sad", "the_chick_is_not_thin_now", "the_chick_is_not_thin_now_it_runs_to_me", "the_chick_is_small_and_thin", "the_chick_is_wet_at_first",
  "the_chick_looks_hungry", "the_chick_picks_at_the_shell", "the_chicken_is_on_the_farm_we_eat_chicken", "the_children_play_on_the_grass", "the_chips_are_hot", "the_chips_go_on_the_dish_too",
  "the_chopsticks_are_on_the_table", "the_cinema_is_between_the_park_and_the_station", "the_city_is_famous_for_its_lake", "the_class_is_glad", "the_class_is_glad_they_clap_for_ming", "the_class_is_glad_they_clap_for_ming_because_he_found_the_way",
  "the_class_is_glad_they_saw_how_he_found_the_way", "the_class_looks_at_it", "the_class_looks_at_it_the_class_is_quiet", "the_class_looks_at_it_the_class_is_quiet_because_no_one_is_sure", "the_cleaner_is_cleaning_the_street", "the_cleaner_makes_the_bed",
  "the_clock_helps_me", "the_clock_helps_me_every_day", "the_clock_is_on_the_wall", "the_clock_is_too_much_for_one_pair_of_hands_they_wrote_down_snow_stem_and_stone", "the_clock_says_it_is_early", "the_clock_says_it_is_time",
  "the_clouds_are_in_the_way", "the_clouds_move_and_the_rain_is_there", "the_coach_told_him_to_rest", "the_coat_is_big", "the_coat_is_big_it_is_too_big_for_me", "the_coin_does_not_work_at_home_they_had_been_here_before",
  "the_coins_are_all_here_he_puts_them_back_in_the_box", "the_coins_are_here", "the_coins_are_here_he_puts_them_back_in_the_box", "the_coins_are_small", "the_coins_are_small_some_are_brown_and_some_are_bright", "the_coins_are_small_some_are_brown_some_are_bright",
  "the_corn_grows_and_grows", "the_corn_grows_and_grows_it_needs_water_and_sun", "the_corn_grows_and_grows_it_needs_water_and_sun_so_ming_waters_it", "the_corn_is_good", "the_corn_is_good_mom_cooks_it_in_a_pot", "the_corn_is_good_mom_cooks_it_in_a_pot_and_the_kitchen_smells_sweet",
  "the_corn_is_not_ready", "the_corn_is_not_ready_it_is_green_not_yellow", "the_corn_is_not_ready_it_is_green_not_yellow_so_ming_waits", "the_corn_is_ready_ming_says_it_is_yellow_and_full", "the_corn_is_ready_now", "the_corn_is_ready_now_it_is_yellow_and_full",
  "the_corn_is_ready_now_it_is_yellow_and_full_and_it_is_big", "the_corn_is_ready_to_pick_they_had_been_here_before", "the_corn_is_tall", "the_corn_is_tall_it_is_taller_than_ming", "the_corn_is_tall_it_is_taller_than_ming_and_it_moves_in_the_wind", "the_corn_is_tall_now_she_writes_and_the_pears_are_sweet",
  "the_corner_is_the_first_place", "the_corner_is_the_first_place_he_started_here", "the_corner_is_the_first_place_he_started_here_when_he_was_small", "the_cow_eats_and_eats", "the_cow_eats_and_eats_it_does_not_look_at_ming", "the_cow_eats_grass",
  "the_cow_eats_grass_it_eats_slowly", "the_cow_eats_grass_it_eats_slowly_because_it_has_all_day", "the_cow_is_big", "the_cow_is_big_ming_looks_up_at_it", "the_cow_is_big_ming_looks_up_at_it_and_he_takes_one_step_back", "the_cow_is_brown",
  "the_cow_is_brown_its_nose_is_soft", "the_cow_is_calm", "the_cow_is_calm_its_tail_goes_slowly", "the_cow_is_on_the_farm", "the_cow_is_ready_to_pick_they_had_been_here_before", "the_cow_likes_ming",
  "the_cow_likes_ming_it_comes_near_him", "the_cow_likes_ming_it_comes_near_him_when_he_holds_out_the_grass", "the_crab_and_the_frog_rest", "the_crab_and_the_grass", "the_crab_asks_the_frog_to_swim", "the_crab_can_clap_too",
  "the_crab_comes_out", "the_crab_comes_out_it_walks_to_me", "the_crab_hides_in_the_grass", "the_crab_is_green_the_grass_is_green_too", "the_crab_is_on_the_frog", "the_crab_is_on_the_sand",
  "the_crab_is_small", "the_crab_is_small_it_walks_on_the_sand", "the_cut_stalks_are_tied_carried_to_a_flat_yard_and_spread_in_the_sun_to_dry", "the_dark_is_their_time", "the_day_is_long", "the_day_is_not_dry",
  "the_day_is_not_dry_there_is_fog", "the_day_is_over_it_is_time_to_give_it_back", "the_days_are_not_long", "the_days_are_not_long_it_gets_dark_early", "the_days_are_not_long_it_gets_dark_early_because_the_sun_goes_down_soon", "the_days_get_longer_again_when_spring_comes",
  "the_difference_was_small_not_missing", "the_difference_was_small_not_missing_now_they_could_see_why", "the_difference_was_small_not_missing_we_say_the_words_again_green_and_ham", "the_difference_was_small_not_missing_we_say_the_words_again_rain_and_room", "the_dinosaur_is_very_tall", "the_dish_is_clean_now",
  "the_dish_is_not_clean", "the_dish_is_not_for_a_fish", "the_dog_has_a_chain_too", "the_dog_has_a_chain_too_it_is_on_the_dog", "the_dog_is_happy", "the_dog_is_happy_it_sits_and_waits_for_me",
  "the_dog_licked_my_hand", "the_dog_looks_at_the_duck", "the_dog_puts_its_nose_up", "the_dog_runs_and_the_tail_goes", "the_dog_runs_and_the_tail_goes_the_chain_stops_it_at_the_gate", "the_dog_runs_and_the_tail_goes_too_the_chain_stops_the_dog_at_the_gate",
  "the_dog_runs_faster", "the_doll_is_in_the_box", "the_door_is_open", "the_drawing_is_for_cousin", "the_drawing_is_for_cousin_she_lives_in_another_town", "the_drawing_is_for_cousin_she_lives_in_another_town_far_away",
  "the_drawing_is_for_his_cousin_she_lives_in_another_town_far_away", "the_dress_is_on_the_bed", "the_drops_are_small_and_light_they_stay_up_in_the_sky", "the_drum_gets_faster_twenty_strokes_ten_strokes_then_the_flag_comes_down", "the_drum_is_fun", "the_drum_is_fun_and_we_laugh",
  "the_drum_is_loud", "the_drum_is_loud_and_it_is_fun", "the_drum_is_loud_my_friend_hears_it", "the_drum_is_too_loud", "the_drum_moves_and_makes_a_sound_when_it_stops_the_sound_stops_too", "the_duck_and_the_chick_sing_and_sing",
  "the_duck_can_run_and_sing", "the_duck_can_sing", "the_duck_has_a_wet_back", "the_duck_is_in_the_cake", "the_duck_is_in_the_sack", "the_duck_is_not_afraid",
  "the_duck_is_on_a_rock", "the_duck_is_out_now", "the_duck_is_thin", "the_duck_is_too_much_for_one_pair_of_hands_we_say_the_words_sock_wind_and_wing", "the_duck_picks_up_the_sock", "the_duck_puts_the_hat_on",
  "the_duck_sits_on_the_sock", "the_duck_walks_and_walks", "the_duck_walks_home", "the_duck_walks_home_like_a_man", "the_ducks_like_cake_and_grapes", "the_ducks_like_the_cake",
  "the_dumpling_is_not_pretty", "the_dumpling_is_not_pretty_one_side_is_open", "the_dumplings_are_good", "the_dumplings_are_good_ming_tastes_one", "the_dumplings_are_good_ming_tastes_one_when_it_is_still_hot", "the_dumplings_cook_in_the_pot",
  "the_dumplings_cook_in_the_pot_the_water_boils", "the_dumplings_cook_in_the_pot_the_water_boils_and_the_kitchen_smells_good", "the_e_changes_the_sound", "the_e_changes_the_sound_one_little_e_does_it", "the_e_has_no_sound_it_gives_the_vowel_a_name", "the_e_makes_the_a_say_its_name",
  "the_e_makes_the_a_say_its_name_listen_to_both_words", "the_e_makes_the_a_say_its_name_listen_to_the_two_words", "the_ear_found_what_the_eye_had_missed", "the_ear_found_what_the_eye_had_missed_looking_back_it_seemed_clear", "the_earth_goes_around_the_sun", "the_earth_goes_around_the_sun_it_takes_a_whole_year",
  "the_earth_goes_around_the_sun_it_takes_a_whole_year_so_the_seasons_come_back", "the_earth_is_a_little_on_its_side_it_does_not_stand_up", "the_earth_is_a_little_on_its_side_it_is_not_up_and_down", "the_earth_keeps_going", "the_earth_keeps_going_it_never_stops", "the_earth_looks_like_a_blue_marble",
  "the_egg_is_for_my_family", "the_egg_is_small_and_round", "the_eggs_are_small_and_black", "the_elephant_is_heavier_than_the_horse", "the_family_is_happy", "the_family_is_happy_ming_looks_at_them_all",
  "the_family_is_happy_ming_looks_at_them_all_and_smiles", "the_family_is_in_the_photo", "the_family_is_in_the_photo_they_stand_in_front_of_the_house", "the_family_is_in_the_photo_they_stand_in_front_of_the_house_where_ming_grew_up", "the_family_is_together", "the_family_is_together_they_sit_near_the_window",
  "the_family_is_together_they_sit_near_the_window_so_they_can_see_the_moon", "the_family_stands_together_they_are_in_front_of_the_house_where_ming_grew_up", "the_farm_dog_is_very_big", "the_farm_helps_many_people", "the_farm_helps_many_people_the_food_goes_to_the_market", "the_farm_helps_many_people_the_food_goes_to_the_market_when_it_is_ready",
  "the_farm_is_dark_at_night", "the_farm_is_good", "the_farm_is_good_i_like_the_animals", "the_farm_is_good_i_like_the_animals_and_the_work", "the_farm_is_not_wet_now", "the_farm_is_not_wet_now_the_grass_is_dry",
  "the_farm_is_quiet", "the_farm_is_quiet_the_sheep_stand_by_the_tree", "the_farm_is_wet", "the_farm_is_wet_the_path_is_wet_too", "the_farmer_cuts_the_wheat", "the_farmer_cuts_the_wheat_he_uses_a_sharp_tool",
  "the_farmer_feeds_the_animals", "the_farmer_feeds_the_animals_he_gives_them_corn", "the_farmer_feeds_the_animals_he_gives_them_corn_and_they_eat_it_fast", "the_farmer_gets_up_early", "the_farmer_gets_up_early_it_is_still_dark", "the_farmer_gets_up_early_it_is_still_dark_when_he_goes_out",
  "the_farmer_grows_corn", "the_farmer_grows_corn_he_watches_it_grow", "the_farmer_grows_corn_he_watches_it_grow_and_he_waters_it", "the_farmer_is_careful", "the_farmer_is_careful_he_looks_at_the_sky", "the_farmer_is_tired",
  "the_farmer_is_tired_his_back_hurts", "the_farmer_is_tired_his_back_hurts_so_he_sits_for_a_while", "the_farmer_likes_the_farm", "the_farmer_likes_the_farm_he_is_glad_to_work_there", "the_farmer_looks_at_the_cart_it_is_full_too", "the_farmer_works_all_day",
  "the_farmer_works_all_day_he_does_not_rest_much", "the_farmer_works_all_day_he_does_not_rest_much_but_he_is_happy", "the_farmer_works_with_his_strong_arm", "the_ferris_wheel_is_huge", "the_fields_are_full_of_water_farmers_stand_in_it_for_hours", "the_fine_dust_falls_on_the_silk_of_the_young_ear",
  "the_first_dough_was_much_too_dry_and_broke_into_dry_crumbs_as_soon_as_she_pressed_it_down", "the_first_note_is_still_in_the_box_it_has_one_word_on_it", "the_first_note_is_still_in_the_box_it_has_one_word_on_it_that_he_wrote_long_ago", "the_first_one_sings", "the_first_place_is_good", "the_first_place_is_good_it_feels_like_home",
  "the_first_place_is_good_it_feels_like_home_when_he_stands_here", "the_first_red_flower_opens_in_the_warm_sun", "the_first_star_comes_out_and_it_is_far_we_look_up_and_see_a_star", "the_first_time_they_did_two_steps_at_once", "the_first_time_they_did_two_steps_at_once_we_say_the_words_again_road_and_sea", "the_fish_can_see_a_ship",
  "the_fish_can_sit_on_the_dish", "the_fish_can_swim", "the_fish_is_fresh", "the_fish_is_in_the_ship", "the_fish_is_in_the_shop", "the_fish_is_not_glad",
  "the_fish_is_on_the_ship", "the_fish_wish_to_swim", "the_flag_is_blue", "the_flag_is_blue_it_is_big_and_new", "the_flag_is_for_all_of_us", "the_flags_are_for_all_of_us_we_are_glad",
  "the_fox_is_hot", "the_fox_is_on_the_box", "the_fox_is_on_the_dog", "the_frog_and_the_crab_swim_and_grab", "the_frog_can_swim", "the_frog_gets_the_bug",
  "the_frog_is_glad", "the_frog_is_green", "the_frog_is_happy", "the_frog_is_on_the_stone_again", "the_frog_jumps", "the_frog_jumps_in",
  "the_frog_jumps_on_a_rock", "the_frog_rests_on_a_branch", "the_frog_sits_and_waits", "the_frog_swims_the_crab_swims_too", "the_frog_waits_it_does_not_move", "the_full_moon_is_round_and_bright_above_our_small_courtyard_tonight",
  "the_game_has_a_name", "the_game_has_a_name_they_all_like_the_name", "the_game_has_a_name_they_all_like_the_name_and_they_say_it_out_loud", "the_game_is_for_the_family", "the_game_is_for_the_family_he_writes_it_on_paper", "the_game_is_for_the_family_he_writes_it_on_paper_with_a_name_at_the_top",
  "the_game_is_fun", "the_game_is_fun_grandpa_laughs_first", "the_game_is_fun_grandpa_laughs_first_and_then_all_of_them_laugh", "the_gaps_matter_they_let_sunlight_reach_every_plant_and_make_it_harder_for_weeds_to_spread", "the_garden_is_a_good_place", "the_garden_is_a_good_place_it_is_quiet_and_green",
  "the_garden_is_nice_now", "the_garden_is_nice_now_a_flower_opens", "the_garden_is_nice_now_a_flower_opens_when_the_sun_hits_it", "the_garden_is_wet", "the_garden_is_wet_the_path_is_wet", "the_garden_is_wet_the_path_is_wet_too_so_ming_walks_slowly",
  "the_gift_does_not_work_at_home", "the_gift_is_for_mom", "the_gift_is_for_mom_it_is_small", "the_giraffe_is_tall", "the_girl_next_to_me_smiles", "the_glass_spills",
  "the_goat_and_my_coat", "the_goat_and_my_coat_both_of_us_are_warm", "the_goat_eats_the_food", "the_goat_eats_the_food_it_eats_it_all", "the_goat_gets_the_coat", "the_goat_is_on_the_hill",
  "the_goat_is_on_the_hill_it_does_not_move", "the_goat_is_small", "the_goat_is_small_it_eats_grass_on_the_hill", "the_goat_is_warm_too_its_coat_grows_on_its_back", "the_goat_likes_the_hill", "the_goat_likes_the_hill_it_stays_there_all_day",
  "the_goat_waits_in_the_rain", "the_goods_are_in_the_shop", "the_grain_is_spread_to_dry_in_the_sun_and_grandma_turns_it_with_a_wooden_rake_each_noon", "the_grass_is_green", "the_grass_is_green_it_is_long_now", "the_grass_is_wet",
  "the_great_wall_is_in_the_north_of_china_it_is_very_long", "the_green_and_yellow_leaves_fall_but_the_tree_is_still_very_tall", "the_ground_is_too_wet_now", "the_guess_is_not_right", "the_guess_is_not_right_it_was_a_little_disappointing", "the_habit_gets_strong",
  "the_hard_part_gets_clear", "the_hard_part_gets_clear_ming_says_it_out_loud", "the_hard_part_gets_clear_ming_says_it_out_loud_so_he_can_hear_it", "the_hard_part_gets_clear_ming_says_the_word_out_loud", "the_hardest_part_was_the_back_tyre_it_took_three_tries_before_the_air_stayed_in", "the_harvest_feeds_many",
  "the_harvest_feeds_many_now_ming_knows_why_they_work", "the_harvest_is_big_this_year", "the_harvest_is_big_this_year_he_is_glad", "the_harvest_is_big_this_year_he_is_glad_and_he_thanks_the_workers", "the_hat_falls_into_the_soup", "the_hat_goes_up_and_up",
  "the_hat_is_on_the_cat", "the_heat_makes_it_rise", "the_heat_makes_it_rise_the_hot_air_inside_gets_big", "the_hen_can_get_the_corn", "the_hen_has_an_egg", "the_hen_has_the_bun",
  "the_hen_is_by_the_shed", "the_hen_is_in_the_red_pen", "the_hen_is_not_glad", "the_hen_is_short", "the_hen_is_small", "the_hen_is_wet",
  "the_hen_looks_at_him_she_comes_back", "the_hen_runs_away_she_is_afraid", "the_hen_runs_to_the_pig", "the_hen_sits_on_the_egg_to_keep_it_warm", "the_hole_is_small", "the_hole_is_small_but_it_gets_big",
  "the_hole_is_small_but_it_is_deep", "the_horse_can_not_get_it", "the_horse_is_half_asleep", "the_horse_is_in_the_car", "the_horse_is_tall", "the_horse_pulls_hard",
  "the_horse_stops_for_a_rest", "the_hospital_is_across_from_the_school", "the_house_has_a_window", "the_house_has_a_window_the_window_faces_the_town", "the_house_has_a_window_the_window_faces_the_town_so_ming_can_see_far", "the_house_has_little_beds_and_little_cups_everything_in_the_house_is_very_small",
  "the_house_is_nice", "the_house_is_nice_it_is_warm_in_winter", "the_house_is_warm", "the_house_is_warm_mom_is_in_the_kitchen", "the_house_is_warm_mom_is_in_the_kitchen_and_the_soup_smells_good", "the_houses_have_lights",
  "the_houses_have_lights_each_window_is_bright", "the_houses_have_lights_each_window_is_bright_because_every_family_is_home", "the_idea_gets_clearer_she_asks_where_the_books_will_go", "the_idea_got_clearer", "the_idea_will_help_others", "the_idea_will_help_others_the_class_can_share_the_books",
  "the_idea_will_help_others_the_class_can_share_the_books_so_everyone_reads_more", "the_ideas_are_there", "the_ideas_are_there_nothing_has_gone_away", "the_ideas_are_there_nothing_has_gone_away_because_the_board_keeps_them", "the_island_has_its_own_beach", "the_jam_is_good",
  "the_jam_is_good_i_eat_the_bun", "the_journey_goes_on", "the_kid_is_in_a_wig", "the_king_can_sing", "the_king_had_a_wish", "the_king_is_asleep",
  "the_king_keeps_the_ring_safe", "the_king_laughs", "the_king_likes_the_ring", "the_king_looks_and_looks", "the_king_sings_for_the_ring", "the_kitchen_window_is_open_a_little_a_small_paw_print_sits_on_the_sill",
  "the_kite_dips_but_lili_holds_on_to_the_line", "the_kite_does_not_work_in_the_park", "the_kite_goes_up", "the_kite_goes_up_it_goes_up_and_up", "the_kite_goes_up_it_goes_up_and_up_and_the_line_goes_with_it", "the_kite_goes_up_on_the_first_try_ming_laughs",
  "the_kite_goes_up_on_the_first_try_ming_laughs_and_he_runs_with_the_line", "the_kite_is_by_the_lake", "the_kite_is_by_the_lake_it_goes_up_and_down", "the_kite_is_high_in_the_sky", "the_kite_is_high_in_the_sky_it_looks_small_from_here", "the_kite_is_high_over_the_park_grandma_is_at_the_gate",
  "the_kite_is_red_and_blue", "the_kite_is_red_and_blue_it_has_a_long_tail", "the_kite_rides_the_wind_it_slides_up_fast", "the_knife_cuts_things", "the_knife_cuts_things_grandma_uses_it_for_the_pork", "the_knife_cuts_things_grandma_uses_it_for_the_pork_and_she_cuts_slowly",
  "the_knife_is_all_in_a_mess_they_had_been_here_before", "the_knife_is_sharp", "the_knife_is_sharp_it_can_cut_an_apple", "the_knife_is_sharp_it_can_cut_an_apple_but_ming_must_be_careful", "the_lake_is_bright_when_the_moon_is_in_it_all_the_water_has_light_from_the_moon", "the_lambs_can_jump",
  "the_lamp_is_broken", "the_lamp_is_on_the_path", "the_last_stop", "the_leaf_is_green", "the_leaf_is_green_and_soft", "the_leaf_is_green_it_is_from_the_tree_by_the_gate",
  "the_leaf_is_on_my_paper", "the_leaf_is_on_my_paper_it_looks_like_a_real_leaf", "the_leaf_was_so_wet", "the_leaves_fall_in_autumn", "the_letter_comes_to_ming", "the_letter_comes_to_ming_dad_brings_it_home",
  "the_letter_comes_to_ming_dad_brings_it_home_after_work", "the_letter_goes_to_cousin", "the_letter_goes_to_cousin_it_goes_far_away", "the_letter_goes_to_his_cousin_it_goes_far_away", "the_letter_is_for_ming", "the_letter_is_for_ming_she_writes_his_name_on_it",
  "the_letter_says_the_farm_is_good", "the_letter_says_the_farm_is_good_it_says_the_rain_came", "the_letter_says_the_farm_is_good_it_says_the_rain_came_so_the_corn_is_tall", "the_letter_says_the_goat_is_big_now", "the_letter_says_the_goat_is_big_now_ming_laughs_at_that", "the_letter_says_the_goat_is_big_now_ming_laughs_when_he_reads_that",
  "the_library_is_near_my_home", "the_lights_go_up_lili_stays_very_still_on_the_stage_because_a_seed_must_not_move", "the_lines_are_hard_and_do_not_move_the_wheels_of_the_train_run_on_the_lines", "the_lines_go_all_the_way_to_the_town_so_the_train_can_go_far_and_not_get_lost", "the_lines_go_all_the_way_to_the_town_so_the_train_can_go_very_far", "the_lines_go_all_the_way_to_the_town_so_the_train_does_not_get_lost_when_it_goes_very_far",
  "the_lines_on_a_map_are_roads_a_long_line_is_a_long_road_in_the_town", "the_little_dad_is_happy_because_ming_is_kind_he_asks_ming_to_sit_by_the_tree", "the_little_door_closes_for_the_night_ming_puts_his_hand_on_the_tree", "the_little_hen_is_by_the_tree", "the_little_pigs_run_and_run", "the_load_can_jump",
  "the_load_is_a_toad", "the_long_way_gets_shorter", "the_long_way_is_fine", "the_machine_runs_on_solar_power", "the_magician_can_do_tricks", "the_man_at_the_gate_saw_it_it_went_that_way_when_the_wind_pushed_it",
  "the_man_sees_it_and_laughs", "the_man_sees_the_duck_and_laughs", "the_man_takes_the_duck_to_the_door", "the_map_is_for_ming", "the_map_is_good", "the_map_is_hard_to_read_it_was_a_little_disappointing",
  "the_map_is_small_but_the_town_is_big_you_can_hold_the_whole_town_in_two_hands", "the_market_at_the_corner", "the_market_at_the_corner_it_is_always_full", "the_market_has_many_things", "the_market_has_many_things_there_are_apples_and_eggs", "the_market_has_many_things_there_are_apples_and_eggs_and_there_is_rice_too",
  "the_market_is_big", "the_market_is_big_there_are_many_people_and_it_is_warm_inside", "the_market_is_good", "the_market_is_good_they_will_come_back_next_week", "the_memory_is_safe_now", "the_memory_is_safe_now_it_is_on_a_note_by_his_bed",
  "the_memory_is_safe_now_it_is_on_a_note_that_sits_by_his_bed", "the_memory_is_there_now_it_is_on_a_note_that_sits_by_his_bed", "the_men_are_in_a_pen", "the_mid_autumn_moon", "the_mid_autumn_moon_the_night_is_quiet", "the_mid_autumn_moon_the_night_is_quiet_and_the_moon_is_high",
  "the_mid_autumn_night_is_here", "the_mid_autumn_night_is_here_the_sky_is_clear", "the_mid_autumn_night_is_here_the_sky_is_clear_so_the_moon_is_easy_to_see", "the_monkey_has_a_long_tail", "the_moon_and_the_sheep", "the_moon_and_the_sheep_one_is_up_and_one_is_on_the_hill",
  "the_moon_comes_up_and_stars_come_out", "the_moon_does_not_make_its_own_light_it_reflects_light_from_the_sun", "the_moon_does_not_make_light_the_sun_lights_it", "the_moon_goes_around_the_earth", "the_moon_is_always_there", "the_moon_is_always_there_in_the_day_it_is_hard_to_see",
  "the_moon_is_big", "the_moon_is_big_it_is_white_and_round", "the_moon_is_bright", "the_moon_is_far_away", "the_moon_is_far_away_it_is_much_bigger_than_it_looks", "the_moon_is_in_the_pool",
  "the_moon_is_in_the_sky", "the_moon_is_in_the_sky_and_the_sheep_are_on_the_hill", "the_moon_is_in_the_sky_the_sky_is_black", "the_moon_is_our_friend", "the_moon_is_quiet_too", "the_moon_is_quiet_too_the_night_is_long",
  "the_moon_is_quiet_too_the_sky_is_big", "the_moon_is_round", "the_moon_is_round_it_looks_like_a_plate", "the_moon_is_round_it_looks_like_a_plate_up_in_the_sky", "the_moon_is_the_same_for_him_and_for_us_i_am_not_sad_now", "the_moon_is_up",
  "the_moon_is_up_in_the_night_sky_it_is_cold_up_there_every_night", "the_moon_is_very_bright_tonight", "the_moon_likes_the_lake_because_it_is_quiet_it_swims_for_a_long_time", "the_moon_looks_at_the_sheep", "the_moon_looks_at_the_sheep_it_is_high_over_the_hill", "the_moon_looks_back",
  "the_moon_looks_back_ming_smiles_at_it", "the_moon_looks_bright_at_night_but_we_know_that_the_sun_lights_the_moon", "the_moon_looks_round", "the_moon_looks_round_it_is_a_big_ball_of_rock_far_away", "the_moon_looks_round_it_is_far_away_in_the_sky", "the_moon_looks_round_it_is_far_away_in_the_sky_so_it_looks_small",
  "the_moon_plays_with_the_little_fish_they_swim_all_over_the_lake_together", "the_moon_puts_the_scarf_on_and_smiles_now_it_is_warm_all_night_long", "the_moon_says_good_night_to_the_fish_it_goes_up_and_up_into_the_sky", "the_moon_says_good_night_to_the_fish_that_swam_with_it_it_goes_up_and_up_into_the_sky", "the_moon_swims_and_swims_in_the_lake_it_is_happy_when_the_water_is_warm", "the_moon_tells_the_fish_that_it_is_nice_here_the_fish_say_the_lake_is_nice_too",
  "the_moon_tells_the_stars_about_ming_the_moon_says_he_is_a_good_friend", "the_mooncake_is_good", "the_mooncake_is_good_it_is_sweet_and_soft", "the_moth_falls_from_the_tree", "the_moth_flies_away", "the_moth_is_gone_but_i_am_happy",
  "the_moth_is_small_and_thin", "the_moth_sits_on_a_leaf", "the_mother_holds_it_close_and_feeds_it_milk_for_many_months", "the_mountain_is_famous_but_dangerous", "the_mountain_is_high_and_the_forest_is_big", "the_mouse_comes_out",
  "the_mouse_comes_out_it_finds_the_bread", "the_mouse_hides_in_a_hole", "the_mouse_hides_in_a_hole_it_waits_there", "the_mouse_hides_in_the_hole_it_waits_and_does_not_move", "the_mouse_is_not_afraid", "the_mouse_is_not_afraid_it_looks_for_food_and_it_goes_here_and_there",
  "the_mouse_is_safe", "the_mouse_is_safe_it_eats_the_bread_now", "the_mouse_is_safe_it_eats_the_bread_now_and_then_it_goes_home", "the_mouse_is_safe_it_eats_the_bread_now_and_then_it_sleeps", "the_mouse_is_small", "the_mouse_is_small_its_tail_is_long",
  "the_mouse_runs_fast", "the_mouse_runs_fast_it_runs_to_the_hole", "the_mouse_runs_fast_it_runs_to_the_hole_and_does_not_look_back", "the_mud_comes_back_on_its_own_look_at_the_tree_and_the_hen", "the_mud_is_not_dry", "the_mud_runs_off_in_all_directions",
  "the_museum_is_a_good_place", "the_museum_is_a_good_place_he_will_look_at_the_other_rooms", "the_museum_is_quiet", "the_museum_is_quiet_people_do_not_shout", "the_museum_is_quiet_people_do_not_shout_because_they_want_to_keep_it_that_way", "the_museum_keeps_old_things",
  "the_museum_keeps_old_things_a_case_keeps_them_safe", "the_museum_keeps_old_things_a_case_keeps_them_safe_so_people_can_see_them_for_years", "the_name_has_a_small_break", "the_name_is_not_ming", "the_name_is_not_ming_it_is_not_mom_and_it_is_not_dad", "the_name_is_whole_again",
  "the_new_plant_grows_day_by_day_in_time_it_makes_seeds_of_its_own", "the_new_sheet_goes_up_by_the_door_in_the_first_square_he_writes_one_word_again_sow", "the_new_story_is_about_a_small_cat_mimi_listens_and_her_tail_goes_soft_and_still", "the_news_is_exciting_we_are_excited", "the_next_day_he_is_not_sure_one_part_has_gone_from_his_mind", "the_next_day_he_is_not_sure_one_part_has_gone_from_his_mind_and_he_cannot_find_it",
  "the_next_day_he_paints_one_more_and_keeps_the_same_pace_the_book_grows_page_by_page", "the_next_day_he_paints_one_more_he_keeps_the_same_pace", "the_next_day_he_paints_one_more_he_keeps_the_same_pace_the_book_grows_page_by_page", "the_next_day_it_rains_again_ming_runs_outside", "the_night_air_is_cold_we_pull_our_scarves_tight", "the_night_is_good",
  "the_night_is_good_i_sleep_well_under_the_moon", "the_night_is_here", "the_night_is_quiet_again_by_the_lake_the_moon_will_come_down_to_swim_again_soon", "the_night_is_quiet_again_by_the_lake_the_moon_will_come_down_to_swim_again_when_it_is_dark", "the_night_is_quiet_lili_dreams_of_a_rabbit_on_the_moon", "the_noodle_goes_across_the_kitchen_floor_it_goes_by_the_table_and_to_the_door",
  "the_noodles_are_long", "the_noodles_are_long_they_are_thin_and_soft", "the_noodles_are_long_they_are_thin_and_soft_so_they_cook_fast", "the_noodles_are_ready_soon", "the_noodles_are_ready_soon_they_do_not_take_long", "the_noodles_are_ready_soon_they_do_not_take_long_at_all",
  "the_noodles_go_in_the_pot", "the_noodles_go_in_the_pot_the_water_boils", "the_noodles_go_in_the_pot_the_water_boils_and_they_move_in_it", "the_nose_is_big", "the_note_is_small", "the_note_is_small_the_paper_is_yellow",
  "the_note_is_small_the_paper_is_yellow_and_soft", "the_note_says_get_a_book", "the_note_says_hello", "the_note_says_hello_it_asks_how_she_is", "the_note_says_hello_there_is_a_name_too", "the_nut_is_big_for_the_ant",
  "the_orange_is_orange", "the_order_is_the_shape_of_the_story", "the_order_is_the_shape_of_the_story_looking_back_it_seemed_clear", "the_oven_made_the_whole_kitchen_smell_of_toasted_sugar_grandma_came_in_but_said_nothing", "the_ow_sounds_the_same", "the_ow_sounds_the_same_the_first_sounds_are_different_so_listen_carefully",
  "the_ow_sounds_the_same_the_first_sounds_do_not", "the_ow_sounds_the_same_the_first_sounds_do_not_so_listen_carefully", "the_park_is_far_from_the_station_but_the_map_shows_them_close_together", "the_park_is_over_there", "the_parts_make_a_whole", "the_party_is_in_june_on_children_s_day",
  "the_path_gets_easy_to_follow", "the_path_gets_easy_to_follow_your_hand_knows_what_comes_next", "the_path_gets_easy_to_follow_your_hand_knows_what_comes_next_before_you_think", "the_path_is_strong_now", "the_path_is_strong_now_he_does_not_have_to_think_hard", "the_path_is_strong_now_he_does_not_have_to_think_hard_when_he_writes",
  "the_patience_is_all_in_a_mess_they_had_been_here_before", "the_patience_to_wait", "the_person_shows_them_the_way_look_at_the_map_and_the_kitchen", "the_person_shows_them_the_way_they_were_glad_they_kept_looking", "the_photo_does_not_work_at_the_station", "the_photo_is_a_good_thing",
  "the_photo_is_of_his_family_it_is_from_an_autumn_day_when_ming_was_small", "the_photo_is_of_the_family", "the_photo_is_of_the_family_it_is_from_an_autumn_day_when_ming_was_small", "the_photo_is_of_the_family_it_is_from_last_autumn", "the_picture_does_not_work_in_the_classroom", "the_picture_is_for_the_teacher",
  "the_picture_is_for_the_teacher_he_does_not_tell_her", "the_picture_is_for_the_teacher_he_does_not_tell_her_because_she_does_not_know", "the_picture_is_for_the_teacher_he_does_not_tell_her_what_it_is", "the_picture_is_nice", "the_picture_is_nice_he_paints_the_sky_blue", "the_picture_is_nice_he_works_a_long_time",
  "the_picture_is_nice_he_works_a_long_time_because_he_wants_it_right", "the_picture_is_too_much_for_one_pair_of_hands_we_say_the_words_sand_ham_and_ring", "the_pig_and_the_hen_are_friends", "the_pig_can_dig", "the_pig_can_dig_in_the_sun", "the_pig_comes_back_and_does_it_again_look_at_the_pig_and_the_duck",
  "the_pig_eats_too", "the_pig_eats_too_it_eats_fast_so_we_give_it_more", "the_pig_gets_up_on_the_bed_it_sleeps_there_under_the_warm_coat", "the_pig_has_a_ball", "the_pig_in_the_wig", "the_pig_is_big",
  "the_pig_is_doing_something", "the_pig_is_fat", "the_pig_is_fat_the_hen_is_small", "the_pig_is_in_a_pit", "the_pig_runs_to_the_hen", "the_pig_sees_the_door_is_open_it_goes_inside_to_look_for_a_bed",
  "the_pig_stops_he_sits_down", "the_pig_walks_and_walks_to_a_room_there_is_a_big_bed_in_it", "the_plan_helped_a_lot", "the_plan_says_what_to_do", "the_plan_says_what_to_do_first_put_seeds_in_two_pots", "the_plan_says_what_to_do_first_put_seeds_in_two_pots_one_gets_sun_and_one_does_not",
  "the_plan_says_what_to_do_first_put_seeds_in_two_pots_that_get_the_same_sun", "the_planets_go_around_the_sun", "the_playground_is_big", "the_playground_is_big_and_new", "the_polar_bear_lives_at_the_north_pole", "the_pond_is_big",
  "the_pool_is_cool", "the_pot_is_dry_now", "the_pot_is_for_all_of_us", "the_pot_is_hot", "the_pot_is_hot_a_lid_is_on_it", "the_pot_is_hot_not_for_me",
  "the_pot_is_in_the_kitchen", "the_pot_is_on_the_mop", "the_pot_is_wet", "the_problem_was_not_so_hard_it_was_one_board_and_two_people_and_it_had_a_simple_answer", "the_promise_is_to_try_again", "the_promise_is_to_try_again_he_says_it_out_loud",
  "the_promise_is_to_try_again_he_says_it_out_loud_so_he_will_hear_it", "the_pup_can_run", "the_pup_is_in_the_mud", "the_question_is_hard", "the_question_is_hard_it_has_many_words", "the_question_is_hard_it_has_many_words_that_no_one_knows",
  "the_question_is_hard_no_book_gives_the_answer", "the_race_began_at_nine_yesterday", "the_rain_falls_and_falls", "the_rain_falls_and_falls_water_runs_down_the_path", "the_rain_falls_in_the_cup", "the_rain_falls_in_the_cup_all_night_it_fills",
  "the_rain_falls_in_the_cup_it_fills_up_all_night", "the_rain_falls_the_pond_is_not_still", "the_rain_is_cold", "the_rain_is_cold_it_falls_on_the_trees_and_the_grass", "the_rain_stops", "the_rain_stops_the_clouds_go_away_and_the_sky_is_clear",
  "the_rat_hid_in_a_bag", "the_rat_sat_on_the_hat", "the_real_question_had_been_a_smaller_one", "the_real_question_had_been_a_smaller_one_now_they_could_see_why", "the_real_question_had_been_a_smaller_one_we_say_the_words_again_grandpa_and_grapes", "the_real_question_had_been_a_smaller_one_we_say_the_words_again_grapes_and_grass",
  "the_real_question_had_been_a_smaller_one_we_say_the_words_again_leaf_and_moon", "the_reason_is_simple", "the_reason_is_simple_a_sentence_is_one_idea", "the_reason_is_simple_a_sentence_is_one_idea_so_read_it_as_one", "the_red_hen_is_on_the_bed", "the_red_net_is_on_my_pet",
  "the_red_packet_is_small_the_smile_is_big", "the_red_scarf_is_bright_in_the_sky_the_stars_come_near_to_look_at_it", "the_rice_is_hot_it_is_too_hot_to_eat", "the_ring_goes_ding", "the_ring_is_made_of_silver", "the_ring_is_old",
  "the_ring_is_rich", "the_road_goes_home", "the_road_goes_home_i_can_see_my_home", "the_road_goes_home_i_can_see_my_house", "the_road_is_long", "the_road_is_long_it_goes_by_the_farm",
  "the_road_is_wet", "the_road_is_wet_i_see_mud", "the_room_is_not_tidy", "the_room_is_warm_our_hands_are_tired_but_nobody_wants_to_leave", "the_rope_is_long", "the_rope_is_long_it_goes_from_the_wall_to_the_tree",
  "the_rope_is_not_strong_now", "the_rope_is_not_strong_now_it_may_break", "the_rope_is_strong_again", "the_rope_is_strong_again_he_uses_it_again", "the_rope_is_strong_again_he_uses_it_and_it_holds", "the_rope_moves",
  "the_rose_grows_at_the_gate", "the_rose_grows_at_the_gate_it_gets_the_sun_all_day", "the_rose_is_for_grandma", "the_rose_is_for_grandma_ming_picks_it_carefully", "the_rose_is_nice", "the_rose_is_nice_it_smells_sweet",
  "the_rose_is_nice_it_smells_sweet_and_the_bees_come", "the_rose_is_red", "the_rose_is_red_it_is_small_but_very_bright", "the_rose_makes_grandma_glad", "the_rose_makes_grandma_glad_she_puts_it_in_water", "the_rover_drives_into_the_red_soil",
  "the_rowers_pull_together_if_one_is_early_the_whole_boat_slows_down", "the_rule_is_go_by_the_side", "the_salad_is_delicious", "the_same_plate", "the_same_plate_two_plates_can_be_the_same", "the_sand_is_nice",
  "the_sand_is_small_and_soft", "the_satellite_goes_around_the_earth", "the_scarf_is_from_mom", "the_scarf_is_from_mom_he_hugs_her", "the_scarf_is_from_mom_he_hugs_her_because_he_is_glad", "the_scarf_is_long",
  "the_scarf_is_long_it_is_purple", "the_scarf_keeps_the_cold_out_his_hands_are_warm", "the_scientist_and_an_answer", "the_scientist_and_the_artist_live_in_our_city", "the_scientist_does_not_stop", "the_scientist_does_not_stop_she_writes_down_what_she_sees",
  "the_scientist_does_not_stop_she_writes_down_what_she_sees_because_she_wants_to_remember", "the_scientist_is_glad", "the_scientist_looks_for_an_answer", "the_scientist_looks_for_an_answer_she_puts_seeds_in_three_pots", "the_scientist_looks_for_an_answer_she_puts_seeds_in_three_pots_so_she_can_compare_them", "the_scientist_tries_many_times",
  "the_scientist_tries_many_times_one_pot_gets_no_water", "the_scientist_tries_many_times_two_pots_get_no_water", "the_scientist_writes_it_down", "the_scientist_writes_it_down_each_day_she_writes_a_note", "the_sculpture_is_made_of_steel", "the_sea_is_big",
  "the_sea_is_big_i_stand_on_the_sand", "the_sea_is_big_i_stand_on_the_sand_and_look", "the_seasons_change", "the_seasons_change_the_trees_tell_us_first", "the_seasons_change_the_trees_tell_us_first_and_we_can_see_it_in_the_leaves", "the_seasons_keep_changing",
  "the_seasons_keep_changing_next_year_they_will_come_back_again", "the_seasons_keep_changing_watch_the_same_tree_all_year", "the_seasons_keep_changing_watch_the_same_tree_all_year_so_you_can_mark_each_change", "the_second_was_too_wet_it_stuck_to_her_fingers_the_table_and_eventually_the_cat", "the_seed_drinks_the_water", "the_seed_drinks_the_water_it_drinks_slowly",
  "the_seed_drinks_the_water_it_gets_big", "the_seed_grows", "the_seed_grows_a_stem_and_roots", "the_seed_grows_the_pot_is_full_of_green", "the_seed_grows_up", "the_seed_grows_up_a_stem_and_a_leaf_come_out",
  "the_seed_grows_up_a_stem_comes_out", "the_seed_is_in_the_garden", "the_seed_is_in_the_pot", "the_seed_is_in_the_pot_i_look_at_it_every_day", "the_seed_is_small", "the_seed_is_small_it_looks_like_a_stone",
  "the_seed_looks_happy_and_green", "the_seed_needs_rain", "the_seed_needs_rain_it_needs_water_too", "the_seed_needs_rain_rain_is_water_for_the_seed", "the_seeds_fall_down_to_the_ground_then_new_flowers_grow_in_the_warm_sun", "the_sentence_does_not_make_sense",
  "the_sentence_does_not_make_sense_he_reads_it_three_times", "the_sentence_does_not_make_sense_he_reads_it_three_times_because_he_wants_to_get_it", "the_sentence_with_the_word_beach_is_long_we_say_the_words_chick_egg_and_fan", "the_sentence_with_the_word_bus_is_long_we_say_fog_fox_and_ham", "the_sentence_with_the_word_cap_is_long_they_made_a_list_sheep_rope_and_nose", "the_sentence_with_the_word_car_is_long_they_wrote_down_three_words_car_corner_and_doctor",
  "the_sentence_with_the_word_change_is_long_three_words_mattered_that_day_country_courage_and_difficult", "the_sentence_with_the_word_hat_is_long_we_say_green_three_and_park", "the_sentence_with_the_word_house_is_long_before_they_went_on_they_wrote_down_soup_south_and_straw", "the_sentence_with_the_word_house_is_long_they_looked_more_than_once_before_they_went_on_they_wrote_down_oyster_oyster_and_owl", "the_sentence_with_the_word_journey_is_long_three_words_mattered_that_day_imagine_important_and_improve", "the_sentence_with_the_word_knee_is_long_they_looked_more_than_once_they_wrote_three_words_on_the_board_knee_phone_and_phone",
  "the_sentence_with_the_word_market_is_long_they_wrote_down_three_words_cart_corn_and_corner", "the_sentence_with_the_word_patience_is_long_three_words_mattered_that_day_problem_suggest_and_team", "the_sentence_with_the_word_pen_is_long_we_say_top_shop_and_animal", "the_sentence_with_the_word_picture_is_long_we_say_the_words_chips_king_and_lunch", "the_sentence_with_the_word_rain_is_long_we_say_pool_bee_and_sea_again", "the_sentence_with_the_word_reason_is_long_they_looked_more_than_once_three_words_mattered_that_day_reason_reason_and_future",
  "the_sentence_with_the_word_ship_is_long_we_say_the_words_path_path_and_sock", "the_sentence_with_the_word_sun_is_long_we_say_sun_dog_and_duck", "the_sentence_with_the_word_tree_is_long_they_wrote_down_stem_snow_and_friend", "the_service_is_good_here", "the_shadow_changes_with_the_sun", "the_shadow_changes_with_the_sun_that_is_the_answer",
  "the_shadow_changes_with_the_sun_that_is_the_answer_that_grandma_gives_him", "the_shadow_follows_ming", "the_shadow_follows_ming_it_stays_right_behind_him", "the_shadow_grows_again", "the_shadow_grows_again_the_sun_is_going_down", "the_shadow_grows_again_the_sun_is_going_down_so_the_shadow_gets_longer",
  "the_shadow_in_the_field", "the_shadow_is_long_in_the_morning", "the_shadow_is_long_in_the_morning_it_goes_far_across_the_field", "the_shadow_is_long_in_the_morning_it_goes_far_across_the_field_because_the_sun_is_not_high", "the_shadow_is_much_longer_in_the_evening", "the_shark_is_big",
  "the_shark_is_big_it_is_bigger_than_the_turtle_and_it_swims_fast", "the_shark_swims_away", "the_shark_swims_away_it_can_not_find_the_turtle", "the_shark_swims_away_it_cannot_find_the_turtle_so_it_looks_in_another_place", "the_shark_swims_fast", "the_shark_swims_fast_it_comes_up_from_below",
  "the_shark_swims_fast_it_is_much_bigger", "the_sheep_are_quiet", "the_sheep_are_quiet_they_make_no_sound", "the_sheep_can_not_sleep", "the_sheep_sleep_at_night", "the_sheep_sleep_at_night_they_sleep_on_the_hill",
  "the_sheep_sleeps_and_sleeps", "the_sheep_sleeps_at_last", "the_ship_can_rock", "the_shop_has_a_big_cake_the_cake_has_a_red_top", "the_shop_has_a_bun_and_jam", "the_shop_is_closed_today",
  "the_shop_is_near_the_school", "the_shop_is_next_to_the_bank", "the_shop_is_on_a_hill", "the_short_road_home_was_flooded_so_they_turned_down_the_narrow_lane_behind_the_old_bakery", "the_sky_is_big_the_stars_are_many", "the_sky_is_big_there_are_many_stars",
  "the_sky_is_dark_and_wide", "the_small_ball_is_good_too", "the_small_change", "the_small_change_did_it", "the_small_change_did_it_one_word_a_day_was_enough", "the_small_change_did_it_one_word_a_day_was_enough_and_he_could_see_it",
  "the_small_steps_add_up", "the_small_steps_add_up_he_stops_for_a_drink", "the_small_steps_add_up_he_stops_for_a_drink_when_the_sun_is_high", "the_small_steps_are_steady", "the_small_wheat_is_white_and_soft_we_mix_it_with_water_in_a_bowl", "the_snail_is_still_there",
  "the_snake_is_our_teacher", "the_snake_lets_me_in", "the_snow_ball_is_big", "the_snow_ball_is_big_and_cold", "the_snow_is_white_and_cold", "the_sock_is_good_again_it_holds_together_now",
  "the_sock_is_in_the_wind", "the_sock_is_not_good_now_the_hole_is_too_big", "the_song_is_so_long", "the_song_is_too_long", "the_stalk_grows_taller_long_leaves_curl_around_it", "the_star_is_in_front_of_the_team",
  "the_star_is_just_a_bug", "the_star_is_not_far_now", "the_star_is_on_the_car", "the_star_wants_to_play_with_us", "the_stars_are_in_the_sky", "the_stars_are_small",
  "the_stars_are_small_and_white", "the_station_is_far_from_here", "the_station_is_next_to_the_cinema", "the_stem_gets_big", "the_stem_gets_big_a_leaf_comes_out", "the_stem_gets_thick_a_leaf_comes_out",
  "the_stem_grows_up", "the_stem_grows_up_to_the_light", "the_stem_is_tall_now", "the_stem_is_thin_and_small", "the_stem_is_thin_and_small_in_the_sun", "the_stone_is_big_and_hard",
  "the_stone_is_by_the_pond", "the_stone_is_still_there", "the_storm_is_on_and_on", "the_story_has_three_parts", "the_story_has_three_parts_he_counts_them_one_by_one", "the_story_moved_me",
  "the_sun_can_make_a_cloud_go_away_it_warms_the_drops_and_they_go_up", "the_sun_comes_in_the_window", "the_sun_comes_in_the_window_it_makes_a_bright_line_on_the_floor", "the_sun_comes_in_the_window_it_makes_a_bright_line_that_moves_across_the_floor", "the_sun_comes_out_we_go_back_to_the_boat", "the_sun_comes_up",
  "the_sun_comes_up_in_the_morning", "the_sun_comes_up_the_garden_gets_warm", "the_sun_comes_up_the_garden_gets_warm_and_the_bug_moves", "the_sun_dries_them_then_we_shake_out_the_grains", "the_sun_gives_the_most_light_of_all_it_lights_up_the_sky_and_the_ground", "the_sun_goes_down_and_the_sky_is_dark_the_little_family_goes_back_into_their_house",
  "the_sun_goes_down_in_the_west", "the_sun_is_a_big_hot_thing_in_the_sky_it_gives_us_heat_and_light_every_day", "the_sun_is_big_and_hot", "the_sun_is_bright_on_that_side", "the_sun_is_bright_on_that_side_the_rest_is_dark", "the_sun_is_bright_on_that_side_the_rest_is_dark_because_no_light_gets_to_it",
  "the_sun_is_going_down_the_shadow_grows_longer_again", "the_sun_is_good", "the_sun_is_here", "the_sun_is_here_the_sky_is_bright_again", "the_sun_is_high", "the_sun_is_high_in_the_sky",
  "the_sun_is_high_there_are_no_clouds", "the_sun_is_high_there_are_no_clouds_so_the_light_is_strong", "the_sun_is_hot", "the_sun_is_hot_we_stand_in_a_line_and_wait_for_the_start", "the_sun_is_in_the_book_too", "the_sun_is_in_the_sky",
  "the_sun_is_in_the_sky_it_is_big_and_hot", "the_sun_is_not_high", "the_sun_is_not_high_it_is_far_away", "the_sun_is_not_high_it_is_far_away_so_its_light_is_not_strong", "the_sun_is_not_high_its_light_comes_in_from_the_side_so_it_is_not_strong", "the_sun_is_not_hot",
  "the_sun_is_not_hot_the_light_is_not_strong", "the_sun_is_not_hot_the_light_is_not_strong_so_the_air_stays_cold", "the_sun_is_up", "the_sun_is_up_it_is_hot", "the_sun_is_up_the_steps_are_hot_and_dry", "the_sun_is_warm_on_my_hand",
  "the_sun_moves_across_the_sky", "the_sun_moves_across_the_sky_it_is_not_high_now", "the_sun_moves_across_the_sky_it_is_not_high_now_so_the_shadow_grows_again", "the_sun_moves_across_the_sky_the_shadow_moves_with_it", "the_sun_moves_grandma_says_the_shadow_goes_with_it", "the_sun_sets_far_away_it_is_a_day_to_remember",
  "the_sun_was_warm", "the_sunglasses_are_free", "the_swan_and_i_are_friends", "the_swan_is_big", "the_swan_is_big_it_is_white", "the_swan_is_not_afraid",
  "the_swan_is_too_much_for_one_pair_of_hands_they_wrote_down_slug_swan_and_crow", "the_swan_swims_on_the_water", "the_swan_swims_to_me", "the_swollen_seeds_are_scattered_thinly_on_a_nursery_bed_a_small_field_protected_from_the_wind", "the_table_fills_up_fish_chicken_hot_soup_and_a_plate_of_green_vegetables", "the_taikonaut_works_in_the_space_station",
  "the_tail_and_the_chain", "the_tail_and_the_chain_one_is_part_of_the_dog", "the_tail_goes_up_and_down", "the_tail_goes_up_and_down_the_dog_is_glad_to_see_me", "the_tail_is_all_in_a_mess", "the_tail_is_long",
  "the_tail_is_long_it_moves_when_the_dog_runs", "the_tail_is_part_of_the_dog_the_chain_is_not", "the_talent_show_is_on_stage", "the_teacher_likes_the_picture", "the_teacher_likes_the_picture_she_looks_at_it_a_long_time", "the_teacher_likes_the_picture_she_looks_at_it_a_long_time_and_she_smiles",
  "the_teacher_puts_it_on_the_wall", "the_teacher_puts_it_on_the_wall_all_can_see_it", "the_teacher_puts_it_on_the_wall_all_can_see_it_when_they_come_in", "the_teacher_told_us_not_to_panic", "the_teddy_bear_is_under_the_bed", "the_thick_cat_can_not",
  "the_thick_one_is_ming_s", "the_thin_cat_can_jump", "the_thin_one_is_mimi_s", "the_third_dough_rested_under_a_cloth_for_half_an_hour_just_as_the_notes_said", "the_third_one_sings_too", "the_three_weeks_are_on_her_notes_she_counts_them_with_the_class",
  "the_three_weeks_are_on_her_notes_she_counts_them_with_the_class_so_they_can_see_the_time", "the_town_is_a_good_place", "the_town_is_a_good_place_he_knows_every_street", "the_town_is_a_good_place_he_knows_every_street_because_he_grew_up_here", "the_town_is_quiet", "the_town_is_quiet_the_shops_are_closed",
  "the_town_is_quiet_the_shops_are_closed_and_the_streets_are_empty", "the_town_is_warm_tonight", "the_town_is_warm_tonight_the_wind_is_cold", "the_town_is_warm_tonight_the_wind_is_cold_outside", "the_toys_are_on_sale", "the_tr_is_one_sound",
  "the_tr_is_one_sound_say_it_together", "the_train_crosses_a_long_bridge_over_a_wide_brown_river", "the_train_goes_and_goes", "the_train_goes_and_goes_it_does_not_stop", "the_train_goes_and_goes_it_does_not_stop_at_all", "the_train_goes_fast",
  "the_train_goes_fast_the_trees_go_by_quickly", "the_train_goes_fast_we_are_on_our_way", "the_train_goes_very_fast_the_trees_go_by_like_wind", "the_train_is_in", "the_train_is_not_here_we_wait_and_wait", "the_train_ran_all_night",
  "the_train_ride_is_long", "the_train_ride_is_long_it_will_take_many_hours", "the_train_starts_so_smoothly_that_lili_does_not_notice_at_first", "the_train_stops", "the_train_stops_in_a_town_to_let_people_get_on_then_it_starts_again_and_goes_on", "the_train_stops_they_are_in_the_town",
  "the_train_takes_people_who_go_to_work_it_takes_things_too_like_food_and_boxes", "the_tree_is_green", "the_tree_is_green_but_it_is_not_big", "the_tree_is_still_there", "the_tree_is_still_there_it_has_more_leaves", "the_trouble_was_small_but_it_was_hard_to_see",
  "the_turtle_and_the_shark", "the_turtle_and_the_shark_one_is_slow_and_one_is_fast", "the_turtle_goes_down", "the_turtle_goes_down_it_hides_in_the_rocks", "the_turtle_is_not_fast", "the_turtle_is_not_fast_it_can_not_swim_away",
  "the_turtle_is_not_fast_it_cannot_swim_away_so_it_goes_down", "the_turtle_is_safe", "the_turtle_is_safe_it_comes_up_slowly", "the_turtle_swims_slowly", "the_turtle_swims_slowly_it_looks_for_food", "the_turtle_swims_slowly_it_looks_for_food_and_it_eats_small_things",
  "the_twin_is_on_the_grass", "the_two_dry_pots_are_there_too_she_tells_the_class_why_nothing_grew_in_them", "the_two_dry_pots_are_there_too_she_tells_the_class_why_they_did_not_grow", "the_wall_is_long_and_hard_to_climb_in_the_hot_sun", "the_water_came_up", "the_water_comes_up_to_the_turtle",
  "the_water_does_not_stay_in_one_place_it_made_more_sense_now", "the_water_goes_over_grandma_s_face", "the_water_holds_the_boat_up_it_pushes_up_on_the_boat_all_the_time", "the_water_is_hot_we_wait_and_wait_and_wait", "the_water_is_long", "the_water_must_be_just_right_too_much_rain_is_bad_for_rice",
  "the_wax_melted_in_the_sun", "the_way_goes_to_the_future", "the_way_is_long", "the_way_you_look_matters", "the_way_you_look_matters_ming_is_not_sad_now", "the_weather_is_good_today",
  "the_weather_will_change_quickly", "the_wet_cat_is_sad", "the_wet_ground_is_good_for_the_seed", "the_wet_ground_is_good_the_seed_can_drink_there", "the_wheat_becomes_food", "the_wheat_becomes_food_it_is_made_into_bread",
  "the_wheat_becomes_food_it_is_made_into_bread_that_we_eat_every_day", "the_wheat_comes_back_on_its_own_they_were_glad_they_kept_looking", "the_wheat_is_dry_now", "the_wheat_is_dry_now_the_sun_has_dried_it", "the_wheat_is_dry_now_the_sun_made_it_dry", "the_wheat_is_dry_now_the_sun_made_it_dry_before_the_rain_came",
  "the_wheat_is_good", "the_wheat_is_good_the_heads_are_full", "the_wheat_is_good_the_heads_are_full_because_the_rain_came_at_the_right_time", "the_wheat_is_tall_now", "the_wheat_is_tall_now_it_is_taller_than_ming", "the_wheat_is_tall_now_it_is_taller_than_ming_and_it_moves_in_the_wind",
  "the_wheat_is_tall_now_it_is_very_tall_and_the_heads_are_full", "the_wheat_is_yellow", "the_wheat_is_yellow_the_green_has_gone", "the_wheat_is_yellow_the_green_has_gone_because_the_sun_has_been_strong", "the_wheat_runs_off_in_all_directions_they_had_been_here_before", "the_wheel_is_round",
  "the_wheel_is_round_and_it_turns_when_the_cart_moves", "the_wheel_is_round_it_turns_on_a_cart", "the_wheel_is_safe_to_touch", "the_wheel_is_safe_to_touch_ming_gives_it_a_push", "the_wheel_turns", "the_wheel_turns_and_the_cart_goes_down_the_road_because_of_it",
  "the_wheel_turns_the_cart_goes_down_the_road", "the_wheels_sang", "the_white_clouds_go_up_so_high_they_sit_up_in_the_blue_sky", "the_whole_cycle_takes_about_twenty_nine_and_a_half_days_not_one_day", "the_whole_idea", "the_whole_idea_is_there_a_box_a_board_and_books",
  "the_whole_idea_is_there_a_box_a_board_and_books_he_smiles_at_it", "the_whole_idea_start_to_end", "the_whole_idea_start_to_end_they_build_the_corner_that_week", "the_whole_idea_was_there", "the_whole_sentence_is_clear_now", "the_whole_sentence_is_clear_now_he_reads_it_again_from_the_start",
  "the_whole_sentence_is_clear_now_he_reads_it_again_from_the_start_and_this_time_it_makes_sense", "the_whole_story", "the_whole_story_is_clear_now", "the_whole_story_is_clear_now_grandma_smiles_at_him", "the_whole_story_is_clear_now_grandma_smiles_at_him_because_he_did_it_well", "the_whole_story_start_to_end",
  "the_whole_story_start_to_end_he_will_tell_mom_at_home", "the_whole_story_start_to_end_he_will_tell_mom_at_home_and_she_will_want_to_hear_it_too", "the_wind_and_the_leaves_like_to_play_they_play_together_on_a_fine_summer_day", "the_wind_can_be_loud", "the_wind_can_be_loud_but_it_can_not_come_in", "the_wind_can_be_loud_but_it_cannot_come_in_because_the_window_is_closed",
  "the_wind_can_dry_our_wet_socks", "the_wind_can_move_the_leaves", "the_wind_comes_in_and_the_photo_flies_up_before_ming_can_catch_it", "the_wind_comes_in_the_photo_flies_up", "the_wind_comes_out_to_play_ming_runs_with_it_all_day", "the_wind_goes_down_to_the_ground_the_whole_town_is_quiet_without_a_sound",
  "the_wind_goes_through_the_tall_green_tree_ming_looks_up_there_because_he_wants_to_see", "the_wind_goes_to_sleep_at_night_then_the_moon_gives_us_its_light", "the_wind_helps_the_bird_the_bird_flies_far", "the_wind_helps_the_boat", "the_wind_helps_the_boat_the_wind_is_strong", "the_wind_helps_the_boat_the_wind_is_strong_so_it_goes_fast",
  "the_wind_helps_the_wing", "the_wind_helps_the_wing_the_bird_flies_far", "the_wind_hit_so_hard", "the_wind_hits_hard", "the_wind_is_air_that_moves", "the_wind_is_cold",
  "the_wind_is_cold_ming_feels_it_on_his_face", "the_wind_is_cold_ming_feels_it_on_his_face_when_he_goes_out", "the_wind_is_cold_there_you_will_be_tired_but_glad", "the_wind_is_cold_too", "the_wind_is_cold_too_it_touches_our_face_when_we_go_out", "the_wind_is_cold_too_we_feel_it_on_our_face",
  "the_wind_is_cold_too_we_feel_it_on_our_face_when_we_go_out", "the_wind_is_good_to_us_and_kind_we_like_the_tree_and_we_like_the_wind", "the_wind_is_high_in_the_tall_green_tree_it_pushes_the_leaves_for_you_and_me_to_see", "the_wind_is_just_right_he_holds_the_line_with_two_hands", "the_wind_is_just_right_ming_holds_the_line_with_two_hands", "the_wind_is_not_strong_under_the_warm_sun_ming_and_grandpa_like_to_run",
  "the_wind_is_playing_with_the_tree_ming_and_grandpa_stop_to_see", "the_wind_is_sharp_my_scarf_flies_in_the_air", "the_wind_is_short_and_hard", "the_wind_is_still_cold", "the_wind_is_still_cold_the_sky_is_gray", "the_wind_is_still_cold_the_sky_is_gray_and_the_trees_have_no_leaves",
  "the_wind_is_strong", "the_wind_is_strong_by_the_lake", "the_wind_is_strong_by_the_lake_it_comes_across_the_water", "the_wind_is_strong_it_takes_my_hat", "the_wind_is_strong_we_run_to_the_hill", "the_wind_is_up_we_run_to_the_green_grass",
  "the_wind_pushes_a_little_ball_across_the_park_it_looks_so_small", "the_wind_says_hello_to_a_little_bee_the_bee_goes_home_to_the_tall_tree", "the_wind_sleeps_after_a_long_long_day_tomorrow_it_will_come_again_to_play", "the_wind_takes_hold_of_the_big_old_hat_it_comes_down_just_next_to_a_black_cat", "the_wind_takes_it_far_away", "the_wind_takes_it_up",
  "the_wind_takes_the_scarf_up_and_up_it_goes_all_the_way_to_the_moon", "the_wind_turns_and_brings_the_ship_back_we_look_at_the_ship_and_the_sand", "the_wind_turns_and_the_ship_comes_back", "the_window_has_a_small_break_they_had_been_here_before", "the_window_is_big", "the_window_is_big_ming_can_see_far_out_of_it",
  "the_window_is_big_ming_can_see_out_of_it", "the_window_is_nice", "the_window_is_nice_he_can_see_the_sky", "the_window_is_whole_again_they_were_glad_they_kept_looking", "the_wing_is_long_and_thin", "the_woman_thanked_them_and_pointed_to_a_low_bridge_that_way_is_dry_she_said_and_a_little_longer",
  "the_word_is_there_but_the_sound_is_not", "the_words_belong_to_groups_not_to_themselves", "the_words_belong_to_groups_not_to_themselves_it_made_more_sense_now", "the_words_belong_to_groups_not_to_themselves_now_they_could_see_why", "the_words_belong_to_groups_not_to_themselves_we_say_the_words_again_pool_and_bee", "the_words_work_together",
  "the_words_work_together_they_say_one_thing", "the_world_has_different_foods", "the_writer_was_the_winner_of_the_book_fair", "the_zebra_eats_and_eats", "the_zoo_has_many_animals", "the_zoo_has_many_animals_some_are_big",
  "the_zoo_has_much_food", "the_zoo_is_too_small", "their_kite_is_red_and_yellow", "then_a_thin_envelope_arrives_with_grandma_s_round_handwriting", "then_another_small_step", "then_he_can_see_both_and_he_will_know_the_answer",
  "then_he_can_see_both_and_the_shadow_will_show_him_the_answer", "then_he_goes_out_to_the_street_he_walks_slowly_because_the_hats_are_high", "then_he_thinks_of_grandma_and_her_warm_hands", "then_i_can_see_a_thing", "then_i_eat_the_chips", "then_in_the_pond",
  "then_it_can_run", "then_it_falls_in_the_dirt", "then_it_got_tall", "then_it_has_legs_it_can_jump", "then_it_hits_a_tree", "then_it_is_cold",
  "then_it_is_cold_we_wear_thick_coats", "then_it_is_gone_so_fast", "then_it_is_on_the_lamp", "then_it_is_time_to_say_good_night_the_moon_is_big_and_the_water_is_bright", "then_it_is_too_hot", "then_it_is_warm",
  "then_it_is_warm_the_days_are_long", "then_it_moved", "then_it_rained_all_at_once", "then_it_was_all_done", "then_many_ants_come_to_carry_the_food_they_take_it_home_together", "then_ming_looks_at_the_other_side",
  "then_ming_looks_at_the_other_side_he_asks_her_why_she_needs_it", "then_ming_looks_at_the_other_side_why_do_you_need_it_he_asks", "then_ming_looks_at_the_white_wall_it_is_clean_and_white_by_the_door", "then_on_a_log", "then_our_train_comes_it_is_big_and_fast", "then_she_comes_and_stands_at_the_door_she_listens_with_ming_until_the_story_is_done",
  "then_the_bee_goes_to_the_next_flower_the_yellow_bits_fall_off_on_the_new_flower", "then_the_dumplings_cook_in_the_pot_the_water_boils_and_the_kitchen_smells_good", "then_the_hat_starts_to_move_it_moves_up_and_down_on_his_head", "then_the_hat_starts_to_move_it_moves_up_and_down_when_grandpa_walks_to_the_door", "then_the_light_seems_to_shrink_again_night_after_night_from_the_right", "then_the_little_dog_looks_up_at_the_wall_he_sees_the_cake_up_there_and_runs_to_it",
  "then_the_memory_comes_back", "then_the_memory_comes_back_it_comes_when_he_washes_a_plate", "then_the_memory_comes_back_it_comes_while_he_washes_a_plate", "then_the_moon_comes_down_to_the_lake_it_goes_into_the_dark_water_to_swim", "then_the_music_starts_and_she_slowly_lifts_both_arms_toward_the_light", "then_the_rain_came",
  "then_the_rain_comes", "then_the_rain_was_gone", "then_the_seeds_start_the_trip_again_some_go_with_the_wind_and_some_go_with_birds", "then_the_star_goes_back_to_the_sky", "then_the_sun_came_up", "then_the_sun_comes_up",
  "then_the_sun_goes_down", "then_the_sun_is_out", "then_there_was_an_answer", "then_there_was_an_answer_the_ball_was_by_the_gate", "then_there_was_an_answer_the_ball_was_by_the_gate_where_he_first_played", "then_there_was_work",
  "then_there_was_work_he_looked_all_over_the_park", "then_there_was_work_he_looked_in_every_part_of_the_park", "then_they_all_fly_off", "then_we_put_the_ball_in_the_oven_the_oven_is_very_hot_inside", "then_we_take_the_bread_out_we_cannot_eat_it_when_it_is_too_hot", "then_we_went_home",
  "there_are_a_lot_of_people_in_the_community", "there_are_fifteen_desks_and_forty_chairs", "there_are_no_clouds_in_the_sky_so_the_light_is_strong", "there_are_no_clouds_so_the_light_is_strong", "there_are_ten_sheep_on_the_farm", "there_are_three_hundred_students",
  "there_are_towers_on_the_wall_people_lived_in_them", "there_are_twenty_students", "there_are_two_hospitals_near_the_shop", "there_are_two_pencils_in_the_bag", "there_is_a_book_on_the_desk", "there_is_a_clock_at_school",
  "there_is_a_hole_in_the_rope", "there_is_a_hole_in_the_rope_ming_finds_it", "there_is_a_hole_in_the_rope_ming_finds_it_when_he_pulls", "there_is_a_hole_in_the_sock_ming_finds_it_when_he_pulls", "there_is_a_library_in_my_community", "there_is_a_little_pig_on_the_farm_it_is_fat_and_it_likes_to_eat",
  "there_is_a_loud_sound_outside_it_comes_again_and_ming_sits_up", "there_is_a_park_in_my_town", "there_is_a_path", "there_is_a_river_near_the_hotel", "there_is_a_rustle_above_us_mimi_is_on_the_low_branch_wet_and_shivering", "there_is_an_empty_seat_by_the_door_my_uncle_is_not_here_this_year",
  "there_is_fog", "there_is_fog_the_day_is_cold", "there_is_heavy_rain_today", "there_is_just_enough_rice_for_one", "there_is_no_air_in_space", "there_is_one_big_room",
  "there_is_only_one_cap_at_home", "there_is_only_one_coat_at_home", "there_is_only_one_drum_at_home", "there_is_only_one_house_at_home_they_had_been_here_before", "there_is_only_one_map_on_the_street", "there_is_only_one_mooncake_at_home",
  "there_is_only_one_note_at_home", "there_is_only_one_scarf_at_home", "there_is_only_one_scarf_at_home_they_had_been_here_before", "there_is_someone_at_the_door", "there_is_something_on_the_table", "there_is_still_a_lot_to_do",
  "there_it_is_the_coin_was_at_home_all_along", "there_it_is_the_cow_was_on_the_farm_all_along", "there_it_is_the_frog_was_in_the_park_all_along_we_look_at_the_frog_and_the_gift", "there_it_is_the_hat_was_at_home_all_along_here_is_a_hat_here_is_a_cup", "there_it_is_the_hat_was_at_home_all_along_here_is_a_hat_here_is_an_apple", "there_it_is_the_knife_was_at_home_all_along",
  "there_it_is_the_letter_was_at_home_all_along", "there_it_is_the_moth_was_in_the_park_all_along_we_look_at_the_bench_and_the_brush", "there_it_is_the_note_was_at_home_all_along", "there_it_is_the_photo_was_at_home_all_along_they_were_glad_they_kept_looking", "there_it_is_the_pig_was_on_the_farm_all_along_look_at_the_bun_and_the_bus", "there_one_shell_is_a_little_different",
  "there_one_shell_is_a_little_different_we_look_at_the_crab_and_the_swan", "there_one_shell_is_a_little_different_we_look_at_the_wing_and_the_bench", "there_one_small_part_is_different", "there_one_small_part_is_different_here_is_a_cup_here_is_a_dad", "there_one_small_part_is_different_look_at_the_bug_and_the_arm", "there_one_small_part_is_different_look_at_the_egg_and_the_fan",
  "there_one_small_part_is_different_they_were_glad_they_kept_looking", "there_one_small_part_is_different_we_look_at_the_friend_and_the_grandma", "there_one_small_part_is_different_we_look_at_the_grandma_and_the_grandpa", "there_one_small_part_is_different_we_look_at_the_ship_and_the_moth", "there_s_a_toy_store", "there_s_some_milk",
  "there_the_bike_is_coming", "there_used_to_be_a_lake_here", "there_was_a_small_school_three_years_ago", "there_was_a_theater_near_my_home", "there_were_no_buses_then_he_said_if_it_rained_we_carried_our_shoes_and_rode_barefoot", "these_are_my_books",
  "these_are_my_pencils", "these_clothes_are_beautiful", "these_scissors_are_used_for_cutting", "they_all_go_at_the_same_time", "they_all_go_at_the_same_time_they_did_their_best_at_this_step", "they_all_look_the_same",
  "they_all_want_to_go_first", "they_all_want_to_go_to_the_school_for_the_clock", "they_all_want_to_go_to_the_school_for_the_drawing_they_had_been_here_before", "they_almost_missed_the_easy_answer", "they_almost_missed_the_easy_answer_it_was_worth_thinking_about", "they_are_all_together",
  "they_are_between_the_lamp_and_the_computer", "they_are_cute_animals", "they_are_glad_the_turtle_is_dry_we_say_the_words_again_turtle_and_teacher", "they_are_glad_they_did_not_stop", "they_are_glad_they_did_not_stop_it_was_worth_thinking_about", "they_are_glad_they_ran_we_say_the_words_again_lime_and_face",
  "they_are_glad_they_remember_it_both_of_them_felt_the_same_way_we_say_the_words_again_action_and_hair", "they_are_glad_they_remember_it_it_was_a_good_moment_we_say_the_words_again_imagine_and_important", "they_are_glad_to_find_the_way_both_of_them_felt_the_same_way_we_say_the_words_again_museum_and_visitor", "they_are_glad_to_go_on_we_say_the_words_again_gate_and_hole", "they_are_glad_to_go_together_we_say_the_words_again_drawing_and_board", "they_are_glad_to_have_them_back_both_of_them_felt_the_same_way_we_say_the_words_again_field_and_wheat",
  "they_are_glad_to_help_lili_we_say_the_words_again_corner_and_car", "they_are_happy_together", "they_are_happy_together_they_talk_for_a_long_time", "they_are_happy_together_they_talk_for_a_long_time_because_no_one_wants_to_sleep", "they_are_happy_under_the_big_moon", "they_are_high_in_the_sky",
  "they_are_my_friends", "they_are_not_afraid_now_it_was_worth_thinking_about", "they_are_not_the_same", "they_are_not_the_same_one_holds_more_food_than_the_other", "they_are_not_the_same_one_is_big_and_one_is_small", "they_are_proud_of_the_cake_we_say_the_words_again_cake_and_line",
  "they_are_proud_of_the_cake_we_say_the_words_again_cake_and_plate", "they_are_proud_of_the_corn_we_say_the_words_again_farmer_and_corn", "they_are_proud_of_the_cow_we_say_the_words_again_cow_and_shirt", "they_are_proud_of_the_drawing_we_say_the_words_again_towel_and_town", "they_are_proud_of_the_dumpling_we_say_the_words_again_dumpling_and_coast", "they_are_proud_of_the_letter_we_say_the_words_again_letter_and_skirt",
  "they_are_proud_of_the_mooncake_we_say_the_words_again_soup_and_mooncake", "they_are_proud_of_the_name_we_say_the_words_again_note_and_piece", "they_are_proud_of_the_window_we_say_the_words_again_window_and_house", "they_are_proud_of_the_work_both_of_them_felt_the_same_way_we_say_the_words_again_station_and_village", "they_are_proud_of_the_work_it_was_a_good_moment_we_say_the_words_again_city_and_city", "they_are_still_awake",
  "they_are_still_awake_it_was_a_little_disappointing", "they_are_very_quiet", "they_ask_a_person_on_the_road_this_time_they_went_more_slowly", "they_both_do_it_before_bed_it_is_just_part_of_the_day", "they_both_do_it_before_bed_it_is_just_part_of_the_day_and_they_do_it_without_thinking", "they_both_get_to_the_end",
  "they_both_get_to_the_end_here_is_a_ball_here_is_a_three", "they_both_hold_the_flag", "they_both_pull_but_it_does_not_move", "they_both_want_it_now", "they_both_want_to_be_first", "they_both_want_to_use_the_flag",
  "they_can_both_use_the_flag_now", "they_can_not_see_at_first_they_stay_with_their_mother", "they_can_tell_the_order_to_someone_now_it_was_a_good_lesson", "they_can_use_this_way_again_it_was_a_good_lesson", "they_cannot_cook_it_in_the_small_pot_so_they_eat_it_where_it_is_end_to_end", "they_cannot_find_one_thing_on_the_list",
  "they_carried_stones_with_their_hands_no_big_machines_then", "they_carry_the_things_home", "they_carry_the_things_home_ming_helps_mom_carry_it", "they_carry_the_things_home_ming_helps_mom_carry_it_because_there_is_a_lot", "they_carry_the_things_home_ming_helps_mom_carry_them_because_there_is_a_lot", "they_change_only_that_one_part",
  "they_check_one_part_then_another", "they_check_one_part_then_another_this_time_they_went_more_slowly", "they_check_the_list_before_they_go_now", "they_close_their_eyes_and_try", "they_close_their_eyes_and_try_they_did_their_best_at_this_step", "they_come_out_at_night",
  "they_cook_it_and_wait", "they_count_again_slowly_and_in_order", "they_count_again_slowly_and_in_order_this_time_they_went_more_slowly", "they_crawl_all_over_it", "they_cut_the_house_into_two_parts", "they_cut_the_mooncake_into_two_parts",
  "they_did_not_need_a_new_window_it_was_worth_thinking_about", "they_dig_a_small_hole", "they_dig_a_small_hole_they_did_their_best_at_this_step", "they_do_it_again_and_again_they_did_their_best_at_this_step", "they_do_not_know_the_answer", "they_do_not_know_the_answer_they_had_been_here_before",
  "they_do_not_know_where_the_street_is", "they_do_not_know_where_the_street_is_they_had_been_here_before", "they_do_not_know_who_does_what", "they_do_not_need_to_push_it_was_worth_thinking_about", "they_do_not_need_to_try_so_hard_it_was_a_good_lesson", "they_do_one_small_part_at_a_time",
  "they_do_one_small_part_slowly_this_time_they_went_more_slowly", "they_each_do_one_part_of_the_work", "they_eat_together", "they_eat_together_there_are_dumplings_and_soup", "they_eat_together_there_are_dumplings_and_soup_and_the_table_is_full", "they_feel_rested_in_the_morning_both_of_them_felt_the_same_way_we_say_the_words_again_shadow_and_wheel",
  "they_feel_safe_in_the_room_we_say_the_words_again_towel_and_towel", "they_fill_the_hole_when_they_are_done", "they_find_a_beach_and_many_shells_by_the_water", "they_find_a_boat_and_many_shells_by_the_water", "they_find_a_swan_and_many_shells_by_the_water", "they_find_it_and_buy_all_the_things",
  "they_find_it_and_buy_all_the_things_look_at_the_shop_and_the_bus", "they_find_the_bag_at_last_it_is_under_the_bed_right_where_he_put_it", "they_finish_before_the_sun_goes_down", "they_finish_before_the_sun_goes_down_they_were_glad_they_kept_looking", "they_follow_the_map", "they_follow_the_map_they_did_their_best_at_this_step",
  "they_follow_the_road_that_the_map_shows_at_the_corner_they_make_a_turn", "they_gather_the_wheat", "they_gather_the_wheat_they_put_it_in_a_cart", "they_gather_the_wheat_they_put_it_in_a_cart_so_it_can_go_home", "they_get_a_different_number_each_time", "they_get_a_different_number_each_time_it_was_a_little_disappointing",
  "they_get_everything_ready_before_they_went_on_they_wrote_down_dumpling_coast_and_coin", "they_get_everything_ready_before_they_went_on_they_wrote_down_towel_town_and_trout", "they_get_everything_ready_they_looked_more_than_once_before_they_went_on_they_wrote_down_soup_mooncake_and_brother", "they_get_everything_ready_they_made_a_list_cake_line_and_mouse", "they_get_everything_ready_they_made_a_list_cake_plate_and_spoon", "they_get_everything_ready_they_wrote_down_drum_grapes_and_friend",
  "they_get_everything_ready_they_wrote_down_flag_light_and_plum", "they_get_everything_ready_they_wrote_down_three_words_letter_skirt_and_turtle", "they_get_everything_ready_we_say_map_mop_and_net", "they_get_everything_ready_we_say_road_sea_and_sheep_again", "they_get_everything_ready_we_say_sky_tea_and_yellow", "they_get_everything_ready_we_say_the_words_cheese_brush_and_bench",
  "they_get_one_thing_and_then_another", "they_get_one_thing_and_then_another_they_did_their_best_at_this_step", "they_get_the_food_ready", "they_get_the_food_ready_there_is_pork_and_green_leaves", "they_get_the_food_ready_there_is_pork_and_green_leaves_and_ming_puts_them_on_the_table", "they_get_the_food_ready_there_is_pork_and_there_are_green_leaves_and_ming_puts_them_on_the_table",
  "they_go_as_fast_as_they_can", "they_go_down_the_road", "they_go_up_high_into_the_air_they_come_down_after_they_go_a_long_way", "they_grow_and_grow_soon_they_can_climb_trees_and_play", "they_guess_again_and_then_check", "they_guess_again_and_then_check_this_time_they_went_more_slowly",
  "they_had_been_in_a_hurry_the_first_time", "they_had_been_in_a_hurry_the_first_time_it_made_more_sense_now", "they_had_been_in_a_hurry_the_first_time_now_they_could_see_why", "they_had_started_from_a_different_place", "they_had_started_from_a_different_place_it_made_more_sense_now", "they_had_started_from_a_different_place_now_they_could_see_why",
  "they_had_started_from_a_different_place_we_say_the_words_again_sea_and_sea", "they_have_a_new_question_now", "they_have_a_new_question_now_it_was_a_good_day", "they_have_a_new_question_now_that_was_not_the_last_of_it", "they_have_a_race_with_the_ball", "they_have_a_race_with_the_game",
  "they_hit_something_hard", "they_learned_what_happens_when_they_mix_it_was_worth_thinking_about", "they_like_finding_out_it_was_a_good_moment_we_say_the_words_again_believe_and_country", "they_like_finding_out_it_was_a_good_moment_we_say_the_words_again_weather_and_team", "they_like_finding_out_we_say_the_words_again_crowd_and_crowd", "they_like_finding_out_we_say_the_words_again_purse_and_shark",
  "they_like_finding_out_we_say_the_words_again_town_and_coast", "they_like_finding_things_out_we_say_the_words_again_flower_and_sister", "they_like_finding_things_out_we_say_the_words_again_rose_and_gate", "they_like_the_clear_order_both_of_them_felt_the_same_way_we_say_the_words_again_knife_and_field", "they_like_the_clear_order_it_was_a_good_moment_we_say_the_words_again_patience_and_city", "they_like_the_tall_kite_we_say_the_words_again_bike_and_kite",
  "they_like_the_word_they_wrote_we_say_the_words_again_horse_and_market", "they_like_to_ride", "they_like_to_try_new_things_we_say_the_words_again_noodle_and_dumpling", "they_listen_to_the_quiet_sounds_this_time_they_went_more_slowly", "they_look_again_the_next_morning", "they_look_and_look",
  "they_look_around_for_a_friend_they_wrote_down_playground_crab_and_fog", "they_look_around_the_farm_they_looked_more_than_once_they_wrote_three_words_on_the_board_field_wheat_and_wrist", "they_look_around_the_farm_we_say_tree_hen_and_duck", "they_look_at_all_the_shells_they_wrote_down_crab_swan_and_drum", "they_look_at_all_the_shells_we_say_the_words_wing_bench_and_brush", "they_look_at_all_the_shells_we_say_tide_boat_and_food_again",
  "they_look_at_all_the_things_they_looked_more_than_once_they_wrote_three_words_on_the_board_knife_field_and_wrist", "they_look_at_all_the_things_they_looked_more_than_once_three_words_mattered_that_day_patience_city_and_continue", "they_look_at_all_the_things_we_say_tail_goat_and_stone_again", "they_look_at_each_other_they_wrote_down_flag_clock_and_street", "they_look_at_how_it_should_be_done_they_looked_more_than_once_they_wrote_three_words_on_the_board_station_village_and_visitor", "they_look_at_how_it_should_be_done_they_looked_more_than_once_three_words_mattered_that_day_city_city_and_problem",
  "they_look_at_how_much_there_is_they_looked_more_than_once_before_they_went_on_they_wrote_down_cow_shirt_and_house", "they_look_at_how_much_there_is_they_wrote_down_three_words_farmer_corn_and_pork", "they_look_at_it_and_smile_we_say_cap_word_and_mud", "they_look_at_it_and_smile_we_say_coat_road_and_leaf_again", "they_look_at_it_and_think_they_looked_more_than_once_they_wrote_three_words_on_the_board_action_hair_and_scientist", "they_look_at_it_and_think_they_looked_more_than_once_three_words_mattered_that_day_imagine_important_and_improve",
  "they_look_at_it_and_think_we_say_rice_milk_and_water", "they_look_at_it_from_every_side_they_looked_more_than_once_before_they_went_on_they_wrote_down_coin_coin_and_towel", "they_look_at_it_from_every_side_they_made_a_list_cube_face_and_game", "they_look_at_it_from_every_side_they_wrote_down_gift_cloud_and_person", "they_look_at_it_from_every_side_they_wrote_down_three_words_shirt_sister_and_car", "they_look_at_it_from_every_side_they_wrote_three_words_on_the_board_museum_phone_and_scientist",
  "they_look_at_it_from_every_side_we_say_ball_bed_and_cup", "they_look_at_it_from_every_side_we_say_the_words_fan_fish_and_fog", "they_look_at_it_from_here_we_say_pig_duck_and_mud", "they_look_at_the_bag_and_the_cap_before_they_went_on_they_wrote_down_cow_noodle_and_owl", "they_look_at_the_book_and_the_box_we_say_hat_cup_and_bag", "they_look_at_the_break_in_the_light_they_looked_more_than_once_before_they_went_on_they_wrote_down_window_house_and_noodle",
  "they_look_at_the_break_in_the_light_they_made_a_list_note_piece_and_line", "they_look_at_the_cake_and_the_clock_they_made_a_list_grape_hole_and_green", "they_look_at_the_cap_for_a_long_time_we_say_jam_jug_and_leg", "they_look_at_the_coat_for_a_long_time_we_say_coat_goat_and_zoo_again", "they_look_at_the_door_they_looked_more_than_once_before_they_went_on_they_wrote_down_drawing_board_and_soup", "they_look_at_the_door_they_wrote_down_clock_school_and_drum",
  "they_look_at_the_drum_for_a_long_time_they_wrote_down_friend_frog_and_gift", "they_look_at_the_fish_and_the_pen_we_say_the_words_bench_brush_and_cheese", "they_look_at_the_flag_and_the_bin_they_wrote_three_words_on_the_board_knife_village_and_action", "they_look_at_the_floor_and_the_book_we_say_bed_home_and_mom", "they_look_at_the_food_and_the_chick_we_say_the_words_wing_cheese_and_path", "they_look_at_the_garden_and_the_ground_first_they_wrote_down_three_words_flower_sister_and_teacher",
  "they_look_at_the_ground_and_the_seed_we_say_leaf_seed_and_tide_again", "they_look_at_the_hat_and_the_home_we_say_pot_jam_and_nut", "they_look_at_the_house_for_a_long_time_they_looked_more_than_once_before_they_went_on_they_wrote_down_coin_brother_and_board", "they_look_at_the_kite_and_the_board_we_say_bun_bus_and_cap", "they_look_at_the_kite_and_the_map_they_wrote_down_frog_gift_and_glove", "they_look_at_the_leaf_and_the_ground_first_we_say_zoo_bee_and_chain_again",
  "they_look_at_the_lid_and_the_rope_before_they_went_on_they_wrote_down_cousin_crown_and_oyster", "they_look_at_the_list_and_the_bus_we_say_shop_bus_and_nut", "they_look_at_the_list_and_the_market_they_wrote_down_three_words_corner_car_and_horse", "they_look_at_the_map_and_the_road_we_say_map_kitchen_and_nut", "they_look_at_the_map_for_a_long_time_we_say_fan_hen_and_hill", "they_look_at_the_moon",
  "they_look_at_the_moon_grandpa_talks_about_the_moon", "they_look_at_the_moon_grandpa_talks_about_the_moon_and_ming_listens", "they_look_at_the_moon_in_the_dark_room_we_say_moon_sky_and_goat_again", "they_look_at_the_mooncake_for_a_long_time_before_they_went_on_they_wrote_down_mooncake_drawing_and_ground", "they_look_at_the_museum_and_the_road_they_looked_more_than_once_they_wrote_three_words_on_the_board_museum_visitor_and_station", "they_look_at_the_night_around_the_dark_room_they_looked_more_than_once_before_they_went_on_they_wrote_down_towel_towel_and_oyster",
  "they_look_at_the_note_for_a_long_time_they_made_a_list_spoon_bottom_and_lime", "they_look_at_the_pen_and_the_picture_we_say_hat_apple_and_baby", "they_look_at_the_pieces_in_the_playground_they_made_a_list_bike_kite_and_face", "they_look_at_the_question_they_looked_more_than_once_before_they_went_on_they_wrote_down_town_coast_and_coast", "they_look_at_the_question_they_looked_more_than_once_three_words_mattered_that_day_believe_country_and_courage", "they_look_at_the_question_they_looked_more_than_once_three_words_mattered_that_day_weather_team_and_habit",
  "they_look_at_the_question_they_made_a_list_crowd_crowd_and_lake", "they_look_at_the_question_they_wrote_down_playground_crow_and_stone", "they_look_at_the_question_they_wrote_down_three_words_purse_shark_and_brother", "they_look_at_the_question_we_say_classroom_classroom_and_sheep_again", "they_look_at_the_question_we_say_fan_fan_and_ham", "they_look_at_the_question_we_say_pen_fish_and_yellow",
  "they_look_at_the_question_we_say_red_one_and_grandma", "they_look_at_the_race_and_the_bench_they_wrote_down_three_words_scarf_letter_and_teacher", "they_look_at_the_rain_at_night", "they_look_at_the_road_in_front_they_made_a_list_lime_face_and_rope", "they_look_at_the_road_in_front_we_say_ball_three_and_two", "they_look_at_the_rope_and_the_game_they_looked_more_than_once_they_wrote_three_words_on_the_board_photo_pair_and_town",
  "they_look_at_the_rose_and_the_ground_first_they_made_a_list_rose_gate_and_gate", "they_look_at_the_scarf_for_a_long_time_they_wrote_down_three_words_scarf_lake_and_sister", "they_look_at_the_scarf_for_a_long_time_they_wrote_down_three_words_scarf_market_and_pork", "they_look_at_the_shadow_in_the_dark_room_they_looked_more_than_once_they_wrote_three_words_on_the_board_shadow_wheel_and_world", "they_look_at_the_star_in_the_dark_room_they_wrote_down_star_light_and_cloud", "they_look_at_the_sun_in_the_dark_room_we_say_sun_bag_and_can",
  "they_look_at_the_tree_and_the_moth_we_say_the_words_moth_dish_and_beach", "they_look_at_the_two_things_they_looked_more_than_once_before_they_went_on_they_wrote_down_noodle_dumpling_and_mooncake", "they_look_at_the_two_things_we_say_tree_jam_and_top", "they_look_at_the_water_first_we_say_the_words_front_chick_and_dish", "they_look_at_the_water_they_wrote_down_three_words_turtle_teacher_and_flower", "they_look_at_the_wind_and_the_water_we_say_the_words_ship_sand_and_beach",
  "they_look_at_the_word_on_the_school_they_wrote_down_three_words_horse_market_and_pork", "they_look_down_the_road_they_made_a_list_gate_hole_and_note", "they_look_for_a_good_place_we_say_two_box_and_green", "they_look_here_and_they_look_there", "they_look_here_and_they_look_there_they_did_their_best_at_this_step", "they_look_up_at_the_sky_we_say_moon_rain_and_stone_again",
  "they_make_a_line_and_wait", "they_make_a_list_and_they_start", "they_make_a_list_and_they_start_they_did_their_best_at_this_step", "they_make_a_little_song_and_sing_it_this_time_they_went_more_slowly", "they_make_many_dumplings", "they_make_many_dumplings_the_table_is_full",
  "they_make_the_cake_again", "they_make_the_cake_again_this_time_ming_is_careful", "they_make_the_cake_again_this_time_ming_is_careful_and_he_mixes_slowly", "they_mix_them_together", "they_mix_them_together_they_did_their_best_at_this_step", "they_move_the_board_near_the_window_the_light_is_better_there",
  "they_move_the_board_near_the_window_the_light_is_better_there_so_they_can_see_the_lines", "they_moved_it_just_in_time", "they_need_to_remember_a_plan_they_had_been_here_before", "they_need_to_remember_a_story_they_had_been_here_before", "they_pass_the_stick_and_win_by_a_short_step", "they_pick_the_corn_one_by_one_they_did_their_best_at_this_step",
  "they_pick_the_cow_one_by_one_they_did_their_best_at_this_step", "they_pick_up_one_and_then_another", "they_pick_up_the_moth_and_look_at_it", "they_play_again_this_time_ming_wins_and_he_is_glad", "they_play_and_do_not_watch_the_water_they_did_their_best_at_this_step", "they_play_the_game",
  "they_play_the_game_again", "they_play_the_game_they_sit_around_the_table", "they_play_the_game_they_sit_around_the_table_and_dad_goes_first", "they_play_the_game_together", "they_point_at_a_book_and_start_again", "they_point_at_a_cup_and_start_again_by_the_end_of_the_page_the_word_felt_easy",
  "they_point_at_a_kite_and_start_again_by_the_end_of_the_page_the_word_felt_easy", "they_put_one_before_another", "they_put_one_before_another_they_did_their_best_at_this_step", "they_put_one_piece_on_another", "they_put_the_coin_back_where_it_belongs_from_then_on_they_looked_twice_before_they_gave_up", "they_put_the_cow_back_where_it_belongs_from_then_on_they_looked_twice_before_they_gave_up",
  "they_put_the_frog_back_where_it_belongs", "they_put_the_hat_back_where_it_belongs", "they_put_the_knife_back_where_it_belongs_from_then_on_they_looked_twice_before_they_gave_up", "they_put_the_letter_back_where_it_belongs_from_then_on_they_looked_twice_before_they_gave_up", "they_put_the_moth_back_where_it_belongs", "they_put_the_note_back_where_it_belongs_from_then_on_they_looked_twice_before_they_gave_up",
  "they_put_the_photo_back_where_it_belongs_they_would_come_back_to_this_from_then_on_they_looked_twice_before_they_gave_up", "they_put_the_picture_on_the_wall_it_has_both_of_their_names", "they_put_the_picture_on_the_wall_it_has_both_of_their_names_because_both_of_them_made_it", "they_put_the_pig_back_where_it_belongs", "they_put_the_ship_on_the_water", "they_put_the_turtle_near_the_water_they_had_been_here_before",
  "they_put_them_back_in_two_places", "they_put_them_side_by_side", "they_put_them_side_by_side_they_did_their_best_at_this_step", "they_remember_to_look_before_they_try_again", "they_remember_to_look_before_they_try_again_that_was_not_the_last_of_it_they_kept_the_small_part_in_a_box", "they_remember_to_look_before_they_try_again_they_kept_the_small_part_in_a_box",
  "they_run_even_farther_away_it_was_a_little_disappointing", "they_say_good_night_and_go_in", "they_say_it_again_and_again_they_did_their_best_at_this_step", "they_say_thank_you_to_the_person_it_was_a_good_lesson", "they_say_them_out_loud_and_put_them_in_order_this_time_they_went_more_slowly", "they_see_apples_and_rice",
  "they_see_apples_and_rice_ming_looks_at_the_grapes", "they_see_apples_and_rice_ming_looks_at_the_grapes_because_they_are_purple", "they_see_that_they_are_getting_better_it_was_a_good_lesson", "they_sit_around_the_table_i_will_go_first_dad_says", "they_sit_in_the_sun_together_now_they_are_friends", "they_sit_on_the_soft_grass",
  "they_sit_together_and_they_are_happy_we_say_the_words_again_coin_and_brother", "they_sit_together_and_they_are_happy_we_say_the_words_again_mooncake_and_drawing", "they_sit_together_and_they_are_happy_we_say_the_words_again_scarf_and_lake", "they_sit_together_and_they_are_happy_we_say_the_words_again_scarf_and_market", "they_sit_together_and_they_are_happy_we_say_the_words_again_spoon_and_bottom", "they_splash_in_the_pond_it_is_fun",
  "they_stand_still_and_wait_this_time_they_went_more_slowly", "they_start_again_one_step_at_a_time", "they_still_forget_it_it_was_a_little_disappointing", "they_take_the_duck_to_the_door", "they_talk_about_fish_and_birds", "they_talk_about_that_one_word",
  "they_talk_about_that_one_word_grandma_says_it_in_a_short_sentence", "they_talk_about_that_one_word_grandma_says_it_in_a_short_sentence_so_he_can_hear_it", "they_talk_and_laugh", "they_talk_and_laugh_ming_shows_them_his_drawing", "they_talk_and_laugh_ming_shows_them_his_drawing_when_they_ask", "they_tell_dad_what_they_found_we_say_the_words_again_hole_and_home",
  "they_tell_dad_what_they_found_we_say_the_words_again_horse_and_jam", "they_tell_dad_what_they_found_we_say_the_words_again_jug_and_king", "they_tell_dad_what_they_found_we_say_the_words_again_leaf_and_leg", "they_tell_dad_what_they_found_we_say_the_words_again_practice_and_problem", "they_tell_grandpa_what_they_found_we_say_the_words_again_doctor_and_family", "they_tell_lili_what_they_found_both_of_them_felt_the_same_way_we_say_the_words_again_village_and_village",
  "they_tell_lili_what_they_found_we_say_the_words_again_ham_and_hat", "they_tell_ming_what_they_found_we_say_the_words_again_green_and_ham", "they_tell_ming_what_they_found_we_say_the_words_again_knee_and_king", "they_tell_ming_what_they_found_we_say_the_words_again_purse_and_shark", "they_traveled_by_hot_air_balloon", "they_try_the_next_sentence_about_a_bag_reading_out_loud_became_easier_after_that",
  "they_try_the_next_sentence_about_a_book_reading_out_loud_became_easier_after_that", "they_try_the_next_sentence_about_a_box_reading_out_loud_became_easier_after_that", "they_try_the_next_sentence_about_a_cap_it_was_a_good_day_reading_out_loud_became_easier_after_that", "they_try_the_next_sentence_about_a_cap_reading_out_loud_became_easier_after_that", "they_try_the_next_sentence_about_a_chick_reading_out_loud_became_easier_after_that", "they_try_the_next_sentence_about_a_clock",
  "they_try_the_next_sentence_about_a_hat", "they_try_the_next_sentence_about_a_hole_that_was_not_the_last_of_it_reading_out_loud_became_easier_after_that", "they_try_the_next_sentence_about_a_kite", "they_try_the_next_sentence_about_a_kite_they_would_come_back_to_this_reading_out_loud_became_easier_after_that", "they_try_the_next_sentence_about_a_light", "they_try_the_next_sentence_about_a_map_reading_out_loud_became_easier_after_that",
  "they_try_the_next_sentence_about_a_photo", "they_try_the_next_sentence_about_a_picture", "they_try_the_next_sentence_about_a_race", "they_try_the_next_sentence_about_some_food_reading_out_loud_became_easier_after_that", "they_try_to_put_it_in_the_pot_but_the_pot_is_too_small_when_the_noodle_is_this_long", "they_turn_on_a_little_light",
  "they_wait_and_wait", "they_wait_at_the_street_for_the_bike", "they_walk_along_the_road_on_the_map_at_the_corner_they_make_a_turn", "they_walk_home_together", "they_walk_home_with_the_basket_ming_carries_the_light_one", "they_walked_on_rain_tapped_on_the_leaves_above_them_and_the_lane_smelled_of_wet_earth_and_bread",
  "they_want_it_to_be_the_tallest", "they_want_it_to_come_soon", "they_want_someone_to_play_with", "they_want_to_build_a_tall_kite", "they_want_to_buy_the_right_thing", "they_want_to_cook_a_pot",
  "they_want_to_find_out_about_the_box", "they_want_to_find_out_about_the_corner", "they_want_to_find_out_about_the_habit_they_had_talked_about_it", "they_want_to_find_out_about_the_idea_they_had_talked_about_it", "they_want_to_find_out_about_the_plate", "they_want_to_find_out_about_the_playground",
  "they_want_to_find_out_about_the_red", "they_want_to_find_out_about_the_road", "they_want_to_find_out_about_the_shop", "they_want_to_find_the_way", "they_want_to_find_the_way_they_had_talked_about_it", "they_want_to_get_better_they_had_talked_about_it",
  "they_want_to_go_to_sleep", "they_want_to_go_to_sleep_they_had_talked_about_it", "they_want_to_know_how_they_are_different", "they_want_to_know_how_they_are_different_they_had_talked_about_it", "they_want_to_make_it_tidy", "they_want_to_name_what_they_see",
  "they_want_to_pick_it_all", "they_want_to_play_some_more", "they_want_to_put_them_in_order", "they_want_to_put_them_in_order_they_had_talked_about_it", "they_want_to_remember_it_well_they_had_talked_about_it", "they_want_to_see_it_clearly",
  "they_want_to_see_what_is_under_the_ground", "they_want_to_write_about_the_picture_well", "they_were_a_little_darker_than_hers_lili_said_looking_at_the_tray", "they_were_at_school_yesterday", "they_will_ask_another_friend_next_time", "they_will_build_another_one_tomorrow",
  "they_will_come_back", "they_will_come_back_and_look_again_tomorrow", "they_will_come_back_and_look_again_tomorrow_by_the_end_of_the_week_it_had_changed_again", "they_will_come_back_they_come_here_every_week", "they_will_cook_it_again_for_ming", "they_will_dig_another_day",
  "they_will_feed_it_again_tomorrow", "they_will_guess_and_check_again_looking_back_it_seemed_clear", "they_will_help_again_next_time", "they_will_help_someone_else_next_time", "they_will_help_someone_else_next_time_they_would_come_back_to_this", "they_will_keep_a_close_eye_on_the_mud",
  "they_will_keep_a_close_eye_on_the_wheat_they_would_come_back_to_this", "they_will_keep_it_in_the_same_place", "they_will_keep_the_little_light_on_that_was_not_the_last_of_it", "they_will_keep_them_in_order", "they_will_keep_them_in_order_it_was_a_good_day", "they_will_keep_them_in_order_they_would_come_back_to_this",
  "they_will_listen_to_quiet_sounds_again", "they_will_listen_to_quiet_sounds_again_they_would_come_back_to_this", "they_will_look_closely_next_time_too", "they_will_make_a_line_again_next_time", "they_will_make_a_line_again_next_time_that_was_not_the_last_of_it", "they_will_pick_the_rest_tomorrow",
  "they_will_pick_the_rest_tomorrow_that_was_not_the_last_of_it", "they_will_practice_again_next_time", "they_will_practice_the_next_small_part_it_was_a_good_day", "they_will_practice_the_next_small_part_they_would_come_back_to_this", "they_will_race_again_another_day", "they_will_sail_it_again_when_the_wind_is_right",
  "they_will_show_grandma_what_they_learned_that_was_not_the_last_of_it", "they_will_show_grandpa_what_they_learned", "they_will_take_care_of_it_from_now_on", "they_will_take_care_of_it_from_now_on_that_was_not_the_last_of_it", "they_will_teach_this_way_to_someone_it_was_a_good_day", "they_will_teach_this_way_to_someone_they_would_come_back_to_this",
  "they_will_wait_together_next_time", "they_will_watch_the_pig_again_tomorrow", "they_will_watch_the_tree_change", "they_will_watch_the_water_when_they_play", "they_will_water_it_again_tomorrow", "they_will_write_it_again_tomorrow",
  "they_will_write_one_more_word", "they_wiped_the_frame_until_the_black_paint_shone_then_cleaned_every_spoke_of_both_wheels", "they_work_hard_for_it", "they_work_hard_for_it_their_backs_hurt", "they_work_hard_for_it_their_backs_hurt_but_no_one_stops", "they_write_a_name_on_it_lili_and_ming",
  "they_write_down_one_new_question", "they_write_down_one_new_question_it_was_a_good_day_the_smaller_question_stayed_with_them", "they_write_down_one_new_question_the_smaller_question_stayed_with_them", "they_write_down_what_they_would_do_next_time", "they_write_down_what_they_would_do_next_time_that_was_not_the_last_of_it_the_list_went_up_on_the_wall", "they_write_down_what_they_would_do_next_time_the_list_went_up_on_the_wall",
  "they_write_the_number_down_both_of_them_felt_the_same_way_we_say_the_words_again_action_and_air", "they_write_the_number_down_we_say_the_words_again_doctor_and_cart", "they_write_the_number_down_we_say_the_words_again_nose_and_nose", "they_write_the_number_down_we_say_the_words_again_owl_and_owl", "thick_thick_fog", "things_are_different_now_can_you_see_the_difference",
  "things_in_order_are_easy_to_find_looking_back_it_seemed_clear", "third_or_first_we_are_a_team_that_is_sports_day", "thirty_birds_in_a_tree", "this_ball_is_big", "this_book_is_for_me", "this_book_is_interesting",
  "this_book_is_more_expensive_than_that_one", "this_bottle_is_useful", "this_card_is_for_you", "this_cat_is_thin", "this_egg_is_from_a_hen", "this_elephant_is_bigger_than_that_one",
  "this_game_is_easy", "this_hat_is_cheap", "this_helps_the_flower_because_it_can_make_seeds_with_the_yellow_bits_the_flower_makes_seeds", "this_helps_the_flower_because_it_can_make_seeds_with_the_yellow_bits_the_flower_makes_seeds_for_next_year", "this_is_a_bird", "this_is_a_bird_it_has_an_r_too",
  "this_is_a_book", "this_is_a_cap", "this_is_a_cap_it_is_a_short_word", "this_is_a_cap_it_is_one_short_word", "this_is_a_cap_it_is_one_word", "this_is_a_cape",
  "this_is_a_cape_it_is_a_longer_word", "this_is_a_car", "this_is_a_car_it_has_an_r", "this_is_a_car_it_has_an_r_at_the_end", "this_is_a_chip", "this_is_a_cow",
  "this_is_a_cow_it_has_ow_too", "this_is_a_dog", "this_is_a_fine_day_at_the_lake_we_run_and_play", "this_is_a_good_way_to_learn", "this_is_a_hat", "this_is_a_house",
  "this_is_a_house_it_has_ow", "this_is_a_house_it_has_ow_at_the_end", "this_is_a_knee", "this_is_a_knee_it_starts_with_a_quiet_k", "this_is_a_part_of_the_story", "this_is_a_pen",
  "this_is_a_pin", "this_is_a_ship", "this_is_a_tree", "this_is_a_tree_that_has_a_little_door_ming_looks_at_it_for_a_long_time", "this_is_an_old_book", "this_is_cap_it_is_a_short_word",
  "this_is_cape_it_is_a_longer_word", "this_is_day", "this_is_day_it_is_one_short_word_too", "this_is_day_it_is_one_word_too", "this_is_mr_wang", "this_is_my_grandfather",
  "this_is_my_grandmother", "this_is_my_mom", "this_is_my_mother", "this_is_my_uncle", "this_is_rain", "this_is_rain_it_is_one_short_word",
  "this_is_rain_it_is_one_word", "this_is_red_and_that_is_blue", "this_is_rice", "this_is_the_easiest_race_of_all", "this_is_thin_that_is_thick", "this_is_write",
  "this_is_write_it_starts_with_a_quiet_w", "this_jacket_is_too_expensive", "this_robot_can_walk", "this_side_looks_easier", "this_side_looks_easier_it_is_for_our_class_she_says", "this_side_looks_easier_she_is_drawing_for_the_class",
  "this_time_both_get_the_same_number", "this_time_both_get_the_same_number_here_is_a_pen_here_is_a_park", "this_time_both_get_the_same_number_look_at_the_animal_and_the_animal", "this_time_both_get_the_same_number_they_were_glad_they_kept_looking", "this_time_both_get_the_same_number_we_look_at_the_grass_and_the_basket", "this_time_both_get_the_same_number_we_look_at_the_person_and_the_snow",
  "this_time_grandpa_can_see_the_whole_thing", "this_time_grandpa_can_see_the_whole_thing_here_is_a_cat_here_is_an_one", "this_time_grandpa_can_see_the_whole_thing_look_at_the_shop_and_the_top", "this_time_grandpa_can_see_the_whole_thing_they_were_glad_they_kept_looking", "this_time_lili_can_see_the_whole_thing", "this_time_lili_can_see_the_whole_thing_we_look_at_the_chips_and_the_chips",
  "this_time_ming_can_see_the_whole_thing", "this_time_ming_can_see_the_whole_thing_here_is_a_cat_here_is_a_cup", "this_time_ming_can_see_the_whole_thing_here_is_a_fish_here_is_some_water", "this_time_ming_can_see_the_whole_thing_look_at_the_bat_and_the_bat", "this_time_ming_can_see_the_whole_thing_look_at_the_lid_and_the_duck", "this_time_ming_can_see_the_whole_thing_they_were_glad_they_kept_looking",
  "this_time_ming_can_see_the_whole_thing_we_look_at_the_fox_and_the_friend", "this_time_ming_can_see_the_whole_thing_we_look_at_the_glove_and_the_grandma", "this_time_ming_can_see_the_whole_thing_we_look_at_the_shed_and_the_shed", "this_time_ming_can_see_the_whole_thing_we_look_at_the_song_and_the_plum", "this_time_mom_can_see_the_whole_thing", "this_time_nothing_is_missing",
  "this_time_the_cake_is_good", "this_time_the_cake_is_good_it_is_soft_and_sweet", "this_time_the_cake_is_just_right", "this_time_the_cup_is_just_right_here_is_a_sky_here_is_a_tea", "this_time_the_dish_is_just_right_we_look_at_the_cheese_and_the_brush", "this_time_the_drawing_is_just_right",
  "this_time_the_dumpling_is_just_right", "this_time_the_flag_is_just_right_we_look_at_the_flag_and_the_light", "this_time_the_gift_is_just_right_we_look_at_the_drum_and_the_grapes", "this_time_the_guess_is_right", "this_time_the_guess_is_right_here_is_a_pen_here_is_a_fish", "this_time_the_guess_is_right_here_is_a_red_here_is_an_one",
  "this_time_the_guess_is_right_look_at_the_fan_and_the_fan", "this_time_the_guess_is_right_they_were_glad_they_kept_looking", "this_time_the_guess_is_right_we_look_at_the_playground_and_the_crow", "this_time_the_letter_is_just_right", "this_time_the_mooncake_is_just_right_they_were_glad_they_kept_looking", "this_time_the_pot_is_just_right_look_at_the_map_and_the_mop",
  "this_time_the_pot_is_just_right_look_at_the_pot_and_the_jam", "this_time_the_tail_is_just_right", "this_time_the_word_looks_right", "those_sunglasses_are_beautiful", "those_trousers_are_large", "three_bugs_one_wet_leaf",
  "three_cats", "three_cats_sit_in_a_line_they_look_at_the_moon", "three_chunks_one_picture_you_do_not_need_to_hold_all_twenty_words_in_your_head_at_once", "three_green_bees", "three_little_bugs_on_a_leaf", "three_then_i_jump",
  "three_thin_things_three_thick_things", "three_weeks_of_notes_are_in_her_book_she_counts_them_with_the_class_so_they_can_see_the_time", "threshing_separates_the_grains_from_the_stalks_a_mill_then_removes_the_hard_outer_husk", "through_summer_the_water_level_is_checked_almost_daily_because_rice_needs_wet_roots_but_not_deep_flooding", "through_the_window_we_can_see_water_buffalo_standing_in_the_wet_fields", "throw_trash_in_the_trash_can",
  "tigers_are_stronger_than_lions", "today_is_a_big_day_at_our_home", "today_is_a_special_day", "today_is_may_the_first", "today_there_are_more_pandas_than_thirty_years_ago_that_is_good_news", "today_was_a_hard_day",
  "today_was_a_hard_day_it_did_not_go_the_way_ming_wanted", "today_was_a_hard_day_nothing_went_the_way_ming_wanted", "today_we_climb_the_great_wall_with_grandpa_and_lili", "today_you_can_climb_the_steps_some_are_very_high", "together_is_good", "together_is_good_they_will_do_this_again",
  "together_is_good_they_will_do_this_again_when_the_next_big_day_comes", "together_they_make_sense", "together_they_make_sense_alone_they_are_not_enough", "together_they_make_sense_alone_they_are_not_enough_try_it_both_ways", "tomorrow_at_noon_he_will_mark_the_short_one", "tomorrow_grandma_will_try_to_make_a_short_one_ming_says_the_long_one_is_more_fun",
  "tomorrow_he_will_do_it_again_he_puts_his_cap_on_the_bag", "tomorrow_he_will_do_it_again_he_puts_his_cap_on_the_bag_so_it_is_ready", "tomorrow_he_will_write_one_more_word_he_puts_the_box_back_on_the_desk", "tomorrow_he_will_write_one_more_word_he_puts_the_box_back_on_the_desk_where_he_can_see_it", "tomorrow_is_a_new_day", "tomorrow_is_a_new_day_he_is_ready_to_try_again",
  "tomorrow_is_a_new_day_he_puts_the_kite_by_the_door", "tomorrow_may_be_hot_or_cold_ming_will_know_what_to_wear_because_he_feels_the_air", "tomorrow_the_wind_will_come_to_play_ming_will_run_with_it_all_day", "tomorrow_they_will_read_about_a_bag_they_could_still_tell_it_the_next_morning", "tomorrow_they_will_read_about_a_ball", "tomorrow_they_will_read_about_a_ball_they_could_still_tell_it_the_next_morning",
  "tomorrow_they_will_read_about_a_board_that_was_not_the_last_of_it_they_could_still_tell_it_the_next_morning", "tomorrow_they_will_read_about_a_box", "tomorrow_they_will_read_about_a_bun", "tomorrow_they_will_read_about_a_cap_they_could_still_tell_it_the_next_morning", "tomorrow_they_will_read_about_a_chick_they_could_still_tell_it_the_next_morning", "tomorrow_they_will_read_about_a_clock",
  "tomorrow_they_will_read_about_a_clock_they_could_still_tell_it_the_next_morning", "tomorrow_they_will_read_about_a_dad_they_could_still_tell_it_the_next_morning", "tomorrow_they_will_read_about_a_dish_they_could_still_tell_it_the_next_morning", "tomorrow_they_will_read_about_a_knife_they_could_still_tell_it_the_next_morning", "tomorrow_they_will_read_about_a_mess_it_was_a_good_day_they_could_still_tell_it_the_next_morning", "tomorrow_they_will_read_about_a_park",
  "tomorrow_they_will_read_about_a_park_they_could_still_tell_it_the_next_morning", "tomorrow_they_will_read_about_a_path_they_could_still_tell_it_the_next_morning", "tomorrow_they_will_read_about_a_path_they_would_come_back_to_this_they_could_still_tell_it_the_next_morning", "tomorrow_they_will_read_about_a_pen_they_could_still_tell_it_the_next_morning", "tomorrow_they_will_read_about_a_photo_it_was_a_good_day_they_could_still_tell_it_the_next_morning", "tomorrow_they_will_read_about_a_plate_it_was_a_good_day_they_could_still_tell_it_the_next_morning",
  "tomorrow_they_will_read_about_a_playground_they_could_still_tell_it_the_next_morning", "tomorrow_they_will_read_about_a_pot_they_could_still_tell_it_the_next_morning", "tomorrow_they_will_read_about_a_room_they_could_still_tell_it_the_next_morning", "tomorrow_they_will_read_about_a_sky", "tomorrow_they_will_read_about_a_stem_they_would_come_back_to_this_they_could_still_tell_it_the_next_morning", "tomorrow_they_will_read_about_a_sun",
  "tomorrow_they_will_read_about_a_toy_they_could_still_tell_it_the_next_morning", "tomorrow_they_will_read_about_some_grass_they_could_still_tell_it_the_next_morning", "tomorrow_they_will_read_about_some_patience_they_could_still_tell_it_the_next_morning", "tomorrow_they_will_read_about_some_sand_they_could_still_tell_it_the_next_morning", "tomorrow_they_will_read_about_some_water", "tomorrow_we_begin_again",
  "tomorrow_we_begin_again_grandma_says_it_to_him", "tomorrow_we_begin_again_ming_says_this_time_he_means_it", "tonight_ming_writes_her_a_long_letter_on_a_clean_sheet_of_white_paper", "tonight_the_moon_is_round_and_bright_everyone_in_my_family_is_here", "tonight_they_will_put_things_back_again", "tonight_we_will_write_back_a_letter_is_a_slow_warm_talk",
  "too_many_cats", "too_much_food", "too_much_water_is_not_good_either_we_say_the_words_again_leaf_and_seed", "touch_your_nose", "trains_are_good_for_long_trips_people_can_sit_and_look_out_the_window", "tree_one_sound_not_two_sounds_tree_tree_tree",
  "tree_tree_tree", "try_again_grandma_says_i_will_help_you", "trying_again_helps", "trying_hard_does_not_help", "trying_hard_does_not_help_the_word_will_not_come", "trying_hard_does_not_help_the_word_will_not_come_because_it_is_not_ready",
  "trying_hard_to_sleep_makes_it_hard_now_they_could_see_why", "trying_hard_to_sleep_makes_it_hard_we_say_the_words_again_moon_and_sky", "trying_harder_is_not_the_same_as_looking_closer", "turn_left_at_the_traffic_lights", "turn_off_the_fan_please", "turn_off_the_faucet_please",
  "turn_off_the_light_please", "twin_lambs_jump_well", "two_ants_meet_on_a_little_path_they_make_room_and_let_each_other_go", "two_ants_meet_on_a_little_path_they_make_room_for_each_other", "two_cats", "two_cats_run",
  "two_cubes_make_a_box", "two_days_before_new_year_we_clean_every_room_in_the_house_from_top_to_bottom_grandma_says", "two_fish_sing_along", "two_flags_in_the_sun_we_are_glad", "two_hundred_books_are_on_the_list", "two_men_are_in_the_room",
  "two_people_can_do_more_than_one", "two_people_can_do_more_than_one_it_made_more_sense_now", "two_plates_are_on_the_table", "two_plates_are_on_the_table_they_are_both_clean", "two_sides_of_a_problem", "two_sides_one_answer",
  "two_twin_lambs", "two_useful_things", "unplug_the_air_conditioner_before_you_leave", "up_and_up_it_goes", "up_in_the_sky_the_moon_is_round_it_looks_like_a_plate", "up_pup_up_wet_pup",
  "use_each_one_well", "vegetables_are_healthy", "vegetables_are_healthy_food", "wait_a_minute_please", "waiting_can_be_hard", "waiting_can_be_hard_ming_finds_that_out_today",
  "waiting_has_its_own_work", "waiting_let_the_sky_change_we_say_the_words_again_moon_and_rain", "wake_up_it_is_late", "walking_is_good_for_everyday_health", "walking_is_good_for_your_health", "warm_days_will_come",
  "warm_days_will_come_we_can_play_in_the_park", "warm_sun_and_spring_rain_wake_the_small_seed_up", "was_the_movie_good_yes_it_was", "wash_your_hands_before_dinner", "wash_your_hands_with_soap", "water_and_milk_are_good_to_drink_we_need_water_when_we_run_and_play",
  "water_and_rice", "water_and_rice_are_good", "water_boils_in_the_pot_the_dumplings_float_up_when_they_are_done", "we_all_go_down_to_the_lake_we_bring_a_big_and_sweet_cake", "we_all_like_a_fine_warm_day_when_the_sun_is_out_we_run_and_play", "we_all_run_fast",
  "we_are_a_big_family", "we_are_all_out_now_all_out", "we_are_both_excited_about_the_project", "we_are_going_to_explore_the_old_palace", "we_are_going_to_go_to_the_park", "we_are_happy_at_the_beach",
  "we_are_late_for_the_game", "we_ate_lunch_at_noon", "we_bake_the_bread_for_some_time_it_gets_brown_and_smells_very_good", "we_boil_them_in_a_big_pot_or_we_make_corn_bread", "we_call_her_name_in_the_hall_then_look_under_the_bed_and_behind_the_door", "we_call_uncle_in_another_city_he_says_the_same_moon_shines_there",
  "we_can_eat_eggs_too", "we_can_feel_it_on_our_face", "we_can_fly_a_kite_in_the_park", "we_can_get_on", "we_can_not_grab_it", "we_can_not_play",
  "we_can_not_sing_that_long", "we_can_play_in_it", "we_can_read_we_can_read", "we_can_see_a_tree", "we_can_see_light_all_around_us_the_sun_gives_us_light_in_the_day", "we_can_t_fly_a_kite_in_the_rain",
  "we_can_water_the_grass", "we_cannot_see_the_wind", "we_carry_paper_lanterns_down_the_lane_and_count_the_bright_ones", "we_celebrate_the_spring_festival", "we_cheered_and_counted_down_together", "we_cheered_for_the_winner_of_the_race",
  "we_clap_and_shout_for_our_class_by_the_track", "we_clap_and_spin", "we_clap_and_spin_and_laugh", "we_cook_it_with_water_it_becomes_hot_and_soft", "we_could_see_the_beach_from_the_hill", "we_count_down_together",
  "we_count_seven_stars_then_thirty_more_far_away", "we_cut_it_dry_it_and_cook_it", "we_cut_the_bread_and_eat_it_it_is_warm_and_soft_and_good", "we_cut_the_stems_and_lay_them_in_the_sun", "we_discovered_much_today", "we_drink_milk",
  "we_eat_bread_in_the_morning_bread_is_good_food_for_every_day", "we_eat_it_all_now_the_dish_is_clean", "we_eat_lunch_from_a_small_box_rice_chicken_and_a_piece_of_fruit", "we_eat_the_bread_from_wheat", "we_eat_the_bread_from_wheat_ming_eats_a_piece", "we_eat_them_with_vinegar_grandpa_says_these_are_the_best_this_year",
  "we_eat_turkey_at_christmas", "we_eat_zongzi_at_the_dragon_boat_festival", "we_eat_zongzi_wrapped_in_green_leaves_some_sweet_and_some_with_meat", "we_enjoyed_staying_at_the_hotel", "we_find_good_tips_on_the_internet", "we_find_it_at_last",
  "we_find_our_seats_by_the_wide_window_and_put_the_bags_up_above_us", "we_finish_last_hand_in_hand_everyone_smiles_at_us", "we_follow_the_wet_prints_across_the_yard_to_the_bamboo_at_the_back", "we_get_in_the_little_boat_dad_puts_on_his_warm_old_coat", "we_get_in_we_see_the_rain_go_by", "we_get_information_on_the_internet",
  "we_get_on_a_big_red_bus", "we_get_on_at_last", "we_get_together_in_winter", "we_give_her_warm_milk_she_eats_then_sleeps_for_the_whole_long_evening", "we_give_the_animals_food", "we_give_them_food_we_put_it_down_and_step_back",
  "we_go_back_to_the_playground", "we_go_back_what_a_grand_day", "we_go_by_plane_but_go_to_the_museum_on_foot", "we_go_hiking_in_the_forest", "we_go_home_at_last", "we_go_home_late_the_kite_is_safe",
  "we_go_the_long_way", "we_go_there_by_ship", "we_go_to_the_beach", "we_go_to_the_beach_the_sand_is_nice", "we_go_to_the_farm", "we_go_to_the_island_by_ship",
  "we_go_to_the_pond_to_see_a_boat", "we_go_to_the_zoo", "we_go_to_the_zoo_it_is_not_far", "we_go_to_the_zoo_it_is_not_far_so_we_walk", "we_had_lunch_on_the_grass", "we_have_a_holiday_in_october",
  "we_have_a_science_lesson_on_monday", "we_have_fun_with_a_red_ball_it_is_very_small", "we_have_lunch_at_school", "we_have_many_class_rules", "we_have_pe_on_monday", "we_have_the_same_skirt",
  "we_hold_the_flags_and_run", "we_hold_the_flags_up", "we_hope_to_move_it", "we_laugh_and_laugh_at_the_hat", "we_laugh_and_smile", "we_lean_on_the_side_and_see_five_small_fish",
  "we_learn_in_class", "we_like_red_and_blue", "we_like_the_old_stones_we_like_the_tale_too", "we_like_the_zoo", "we_like_the_zoo_we_want_to_come_back_next_week", "we_like_to_feel_the_wind",
  "we_live_in_the_country", "we_live_in_the_countryside", "we_look_at_mars_through_a_telescope", "we_look_at_the_cells_with_a_microscope", "we_look_at_the_water_in_the_cup", "we_look_at_the_water_in_the_cup_ming_marks_the_line",
  "we_look_at_the_water_in_the_cup_ming_marks_the_line_so_we_can_compare_later", "we_look_here_and_there", "we_look_up_at_the_sky", "we_make_a_cake", "we_make_it_at_last", "we_make_lights_for_the_night_lights_in_the_house_help_us_see_at_night",
  "we_make_ten_dumplings_mine_is_the_biggest_of_all", "we_mark_how_much", "we_mark_how_much_he_writes_it_in_a_note", "we_may_see_seals_on_the_shore", "we_measure_again_tomorrow", "we_measure_again_tomorrow_ming_will_compare_the_two_marks",
  "we_measure_again_tomorrow_ming_will_compare_the_two_marks_so_he_can_see_the_change", "we_must_eat_every_day_but_not_too_much_we_eat_rice_in_the_morning_and_at_night", "we_must_follow_the_family_rules", "we_need_a_lot_of_sleep_because_we_grow_fast_ming_sleeps_for_a_long_time_every_night", "we_need_a_way_to_measure", "we_need_a_way_to_measure_grandma_brings_a_cup",
  "we_need_a_way_to_measure_grandma_brings_a_cup_and_she_puts_it_on_the_table", "we_need_light_because_without_it_we_cannot_see_we_see_things_when_light_comes_to_them", "we_need_light_because_without_it_we_cannot_see_we_see_things_when_light_falls_on_them", "we_need_power_for_the_lights", "we_need_some_eggs_some_milk_and_some_cheese", "we_need_sun_and_rain_for_the_tree",
  "we_packed_our_bags", "we_paint_a_green_hill_on_a_big_sheet_and_cut_out_clouds_from_white_paper", "we_pick_apples_on_the_farm", "we_pick_corn_and_beans_for_grandma_s_big_pot", "we_plan_to_try_the_local_hotpot", "we_plan_to_visit_beijing",
  "we_play_all_day", "we_play_all_day_the_kite_is_green", "we_play_and_play", "we_play_in_the_rain", "we_play_in_the_rain_today", "we_play_some_more",
  "we_play_some_more_then_we_rest", "we_play_the_drum_all_day", "we_play_the_drum_all_day_and_we_are_glad", "we_play_with_the_ball", "we_play_with_the_ball_and_laugh", "we_played_by_the_bench_then_it_was_dark",
  "we_put_a_cup_outside", "we_put_a_cup_outside_it_stands_on_a_stone", "we_put_a_cup_outside_it_stands_on_a_stone_so_the_wind_will_not_knock_it_over", "we_put_a_spoon_of_filling_in_the_middle_and_fold_the_wrapper_over", "we_recycle_paper_and_bottles", "we_reduce_reuse_and_recycle",
  "we_run_and_jump_to_grow_big_and_strong_ming_plays_in_the_playground_after_school", "we_run_and_jump_up_high", "we_run_and_play_all_day", "we_run_and_run", "we_run_and_run_in_the_sun", "we_run_and_we_clap",
  "we_run_and_we_clap_and_we_spin", "we_run_home_at_dark_now_i_have_my_bag", "we_run_home_grandma_has_a_hot_pot", "we_run_to_the_lake", "we_run_together_every_day", "we_sat_in_the_dark",
  "we_see_a_big_fish_then_we_eat_from_a_dish", "we_see_a_different_part", "we_see_a_different_part_the_dark_part_grows", "we_see_a_fat_little_pig", "we_see_a_goat_and_a_pig", "we_see_a_goat_and_a_pig_the_pig_is_fat",
  "we_see_a_goat_and_a_pig_the_pig_sits_in_the_mud", "we_see_a_star_in_the_dark", "we_see_a_waterfall", "we_see_one_side_of_the_moon", "we_see_one_side_of_the_moon_the_sun_lights_that_side", "we_see_one_side_of_the_moon_the_sun_lights_that_side_and_the_rest_is_dark",
  "we_see_three_green_buds_on_it", "we_sell_goods_for_example_drinks_and_schoolbags", "we_should_get_enough_exercise", "we_should_protect_the_environment", "we_should_protect_wild_animals", "we_should_reduce_waste",
  "we_should_save_energy_at_home", "we_should_save_water_and_save_money", "we_should_stay_healthy", "we_should_take_care_of_our_teeth", "we_sing", "we_sing_and_sing",
  "we_sing_at_the_beach", "we_sing_at_the_beach_we_are_happy", "we_sing_it_at_night", "we_sing_we_clap_we_cut_the_same_cake", "we_sit_and_talk", "we_sit_and_wait_the_rain_stops_at_last",
  "we_sit_down_again", "we_sit_down_under_a_tall_green_tree_it_is_nice_here_as_you_can_see", "we_sit_in_the_dark", "we_sit_in_the_garden_and_look_up_the_moon_is_like_a_big_plate", "we_sit_on_a_step_and_share_oranges_and_water", "we_sit_on_the_grass_and_clap",
  "we_sit_on_the_sand", "we_sit_on_the_sand_and_sing", "we_sleep_at_night", "we_stand_still_and_sing", "we_start_at_a_tall_tower_and_walk_far", "we_stay_in_all_day",
  "we_step_on_it_the_old_stones_are_smooth_and_cool", "we_stop_at_a_big_tree", "we_swim_and_we_are_glad", "we_take_a_photo_together_with_the_painted_hill_leaning_against_the_wall", "we_take_it_to_the_lake", "we_take_off_the_hard_case_by_hand",
  "we_take_the_fast_train_it_is_white_and_long", "we_thank_the_farmer", "we_thank_the_farmer_we_eat_it_all", "we_thank_the_farmer_we_eat_it_all_and_we_think_of_his_work", "we_thank_the_farmer_we_eat_the_food_and_we_think_of_his_work", "we_took_many_pictures",
  "we_took_pictures_on_the_beach", "we_took_the_long_way_ming_said_and_started_to_explain_about_the_basket_and_the_apples", "we_use_electricity_every_day", "we_use_our_hands_to_make_a_ball_we_push_it_and_work_it_again_and_again", "we_use_the_american_way_on_this_site_every_single_time", "we_wait_and_wait",
  "we_wait_for_rain_a_wet_coat_is_not_dry", "we_wait_for_the_bus_here", "we_wait_for_the_train", "we_wait_for_the_train_on_a_hot_day", "we_wait_three_long_days_lili_checks_the_box_early_every_morning", "we_wait_we_set_the_table_with_a_white_plate_and_a_cup",
  "we_waited_till_the_bus_came", "we_walk_home_in_the_warm_evening_tired_and_glad", "we_walk_in_the_park", "we_walk_on_the_farm", "we_walk_to_the_market_for_fish_oranges_and_a_big_bag_of_white_rice", "we_want_to_measure_the_rain",
  "we_want_to_measure_the_rain_ming_asks_how_much_rain_there_was", "we_want_to_try_local_food", "we_watch_a_film_today", "we_watch_the_spring_gala_until_midnight_though_lili_falls_asleep_first", "we_watch_the_sunrise", "we_wear_coats",
  "we_wear_coats_we_wear_scarves_too", "we_wear_thick_coats_then_they_keep_us_warm", "we_went_fishing_last_sunday", "we_went_to_the_park", "we_went_to_the_village_three_days_ago", "we_were_all_safe_here",
  "we_will_explore_the_old_town", "we_will_measure_again_tomorrow_ming_will_compare_the_two_marks_so_he_can_see_the_change", "we_will_tour_the_city_by_bus", "were_you_at_school_yesterday", "wet_and_dry", "wh_questions_usually_go_down_where_is_mimi_why_is_she_there",
  "what_are_these_they_re_erasers", "what_are_these_they_re_pencils", "what_are_you_doing_i_m_playing_the_guitar", "what_are_you_going_to_dress_up_as_i_m_going_to_dress_up_as_a_ghost", "what_can_it_be", "what_color_is_it_blue",
  "what_colour_is_it_it_is_blue", "what_comes_first_asks_ming", "what_comes_first_asks_ming_a_good_question_is_a_good_start", "what_day_is_it_it_s_monday", "what_did_they_sing_at_the_gala", "what_did_we_change_asks_grandma",
  "what_did_we_change_asks_grandpa", "what_did_we_change_asks_ming", "what_did_you_do_last_weekend", "what_did_you_do_on_the_weekend_i_went_to_the_forest", "what_did_you_see", "what_do_we_need_first_asks_dad",
  "what_do_we_need_first_asks_grandma", "what_do_we_need_first_asks_grandpa", "what_do_we_need_first_asks_ming", "what_do_you_do_i_m_a_dentist", "what_do_you_have_for_lunch_i_have_rice", "what_do_you_think_asks_lili",
  "what_do_you_think_asks_lili_a_good_question_is_a_good_start", "what_do_you_think_asks_mom", "what_do_you_think_asks_mom_a_good_question_is_a_good_start", "what_does_it_eat_asks_grandpa", "what_does_it_mean_ming_asks_and_grandma_comes_over_when_she_hears_him", "what_does_this_part_mean_asks_grandma",
  "what_does_this_part_mean_asks_grandpa", "what_does_this_part_mean_asks_grandpa_a_good_question_is_a_good_start", "what_does_this_part_mean_asks_ming", "what_does_this_part_mean_asks_ming_a_good_question_is_a_good_start", "what_goes_in_first_asks_ming", "what_is_he_doing_he_s_washing_the_dishes",
  "what_is_in_it_i_shake_it_shake_shake", "what_is_in_my_bag", "what_is_in_my_cup", "what_is_in_the_book", "what_is_in_the_box", "what_is_in_the_pot",
  "what_is_it_it_is_a_panda", "what_is_it_what_is_it", "what_is_not_the_same_asks_dad", "what_is_not_the_same_asks_grandma", "what_is_not_the_same_asks_grandpa", "what_is_not_the_same_asks_grandpa_a_good_question_is_a_good_start",
  "what_is_not_the_same_asks_lili", "what_is_on_at_the_theater_tonight", "what_is_on_the_list_asks_dad", "what_is_on_the_map", "what_is_that_asks_lili", "what_is_the_english_word_asks_dad",
  "what_is_the_matter_i_feel_afraid", "what_is_this_it_is_a_green_book", "what_is_your_name", "what_remains_is_brown_rice_polish_it_further_and_you_get_the_white_rice_most_families_cook", "what_s_her_name_her_name_is_anna", "what_s_the_matter_i_have_a_headache",
  "what_s_the_weather_like_it_s_sunny", "what_s_this_it_s_a_pencil", "what_s_your_favorite_food", "what_s_your_favorite_season_my_favorite_season_is_spring", "what_s_your_favorite_subject", "what_s_your_name_my_name_s_john",
  "what_size_do_you_want", "what_time_do_you_get_up_i_get_up_at_seven_o_clock", "what_time_does_the_movie_start", "what_time_is_it_it_is_seven", "what_time_is_it_it_s_a_quarter_to_three", "what_time_is_it_it_s_three_thirty",
  "what_was_it", "what_was_that_ming_asks_he_listens_hard_so_he_can_hear_it_again", "what_was_that_sound", "what_was_that_sound_he_listens_hard", "what_was_that_sound_he_listens_hard_so_he_can_hear_it_again", "what_we_discovered",
  "what_will_happen_asks_lili", "what_will_happen_asks_ming", "what_will_we_find_asks_grandma", "what_will_we_find_asks_ming", "what_will_we_find_asks_mom", "what_would_you_like_to_drink_i_d_like_some_water_please",
  "wheat_and_harvest", "wheat_grows_in_the_field", "wheat_grows_in_the_field_it_was_planted_in_winter", "wheat_grows_in_the_field_it_was_planted_in_winter_and_it_grows_all_spring", "when_a_seed_comes_to_a_good_place_it_grows_it_needs_wet_ground_and_enough_sun", "when_a_sentence_runs_past_fifteen_words_stop_at_the_comma_and_ask_what_came_before_it",
  "when_asks_about_time_why_asks_for_a_reason_how_asks_about_the_way", "when_did_you_get_up", "when_do_we_hand_out_the_newspapers", "when_he_puts_it_on_it_comes_down_over_his_face_now_grandpa_cannot_see_a_thing", "when_it_grows_up_it_is_a_hen", "when_many_drops_get_together_they_get_big_then_they_fall_down_to_us_as_rain",
  "when_ming_looks_in_the_family_sees_him_they_smile_and_say_hello_to_ming", "when_ming_moves_it_moves", "when_ming_moves_it_moves_he_takes_a_step_and_it_takes_one_too", "when_night_comes_the_moon_comes_up_soon_ming_looks_up_to_find_the_big_round_moon", "when_night_comes_the_room_gets_dark_the_book_starts_to_read_out_loud", "when_night_comes_the_town_gets_quiet_you_can_hear_sounds_from_far_away_then",
  "when_s_your_birthday_it_s_in_march", "when_s_your_birthday_it_s_on_january_fifth", "when_the_bee_goes_in_yellow_bits_get_on_it_the_bits_are_on_its_head_and_legs", "when_the_buds_open_he_says_the_water_is_warm_enough_that_is_how_he_knows_when_to_sow", "when_the_day_is_done_the_wind_comes_down_the_whole_town_is_quiet_without_a_sound", "when_the_night_is_quiet_we_see_the_moon_then_the_wind_will_come_back_again_soon",
  "when_the_sun_comes_up_the_moon_goes_down_the_scarf_comes_back_to_the_tree_for_the_day", "when_the_train_comes_people_stand_back_the_train_is_big_and_very_strong", "when_the_wind_comes_the_leaves_fall_the_trees_by_the_water_are_tall", "when_the_wind_comes_up_a_leaf_goes_high_it_rides_the_air_up_to_the_sky", "when_the_words_stay_together_the_thought_stays_whole", "when_there_is_light_we_can_see_everything_we_can_see_the_tree_and_the_little_bird",
  "when_things_burn_they_give_light_and_heat_we_can_see_a_bright_light_from_far_away", "when_we_eat_good_food_we_grow_tall_and_strong_food_gives_us_what_we_need_to_grow", "when_we_practice_the_brain_learns", "when_we_practice_the_brain_learns_it_keeps_what_we_do_again_and_again", "when_we_practice_the_brain_learns_it_remembers_what_we_do_again_and_again", "when_we_see_the_bright_half_the_moon_looks_round_like_a_mooncake",
  "when_winter_comes_the_sun_is_not_so_strong_the_days_are_short_and_the_nights_are_long", "when_winter_comes_the_sun_is_not_so_strong_the_days_get_cold_and_the_nights_are_long", "when_you_look_around_at_night_you_can_see_many_lights_some_are_big_and_some_are_small", "when_you_lose_the_thread_go_back_one_page_not_to_the_beginning_rereading_is_not_failure", "where_are_the_socks_they_re_on_the_table", "where_are_the_tigers_they_are_in_the_trees",
  "where_are_the_toys_they_re_in_front_of_the_closet", "where_are_you_from_i_m_from_mexico_i_m_mexican", "where_did_you_go_last_sunday", "where_did_you_go_yesterday", "where_do_clouds_come_from_water_goes_up_from_the_sea_and_the_ground", "where_do_i_start_asks_dad",
  "where_do_i_start_asks_grandma", "where_do_i_start_asks_lili", "where_do_i_start_asks_lili_a_good_question_is_a_good_start", "where_do_i_start_asks_mom", "where_do_i_start_asks_mom_a_good_question_is_a_good_start", "where_do_i_stop_for_breath_asks_dad",
  "where_do_i_stop_for_breath_asks_grandma", "where_do_i_stop_for_breath_asks_grandma_a_good_question_is_a_good_start", "where_do_i_stop_for_breath_asks_grandpa", "where_do_i_stop_for_breath_asks_lili", "where_do_i_stop_for_breath_asks_mom", "where_do_we_start_asks_grandma",
  "where_do_we_start_asks_mom", "where_does_a_sound_come_from_it_comes_when_something_starts_to_move", "where_does_she_go_i_do_not_know", "where_is_a_safe_place_asks_lili", "where_is_it_asks_ming", "where_is_mimi_she_is_on_the_low_branch_not_just_one_word_branch",
  "where_is_my_bag_i_look_and_look", "where_is_my_coin_asks_ming", "where_is_my_cow_asks_mom", "where_is_my_frog_asks_ming", "where_is_my_hat", "where_is_my_hat_asks_ming",
  "where_is_my_knife_asks_mom", "where_is_my_letter_asks_ming", "where_is_my_moth_asks_mom", "where_is_my_note_asks_dad", "where_is_my_photo_asks_ming_a_good_question_is_a_good_start", "where_is_my_pig_asks_ming",
  "where_is_the_ball_it_is_under_the_box", "where_is_the_doll_it_s_in_the_closet", "where_is_the_duck_where_is_the_duck", "where_is_the_hospital_it_s_across_from_the_supermarket", "where_s_the_ball_it_s_in_the_closet", "where_s_the_cat_it_s_behind_the_door",
  "where_was_the_bone", "where_were_you_yesterday_i_was_at_the_mall", "where_you_pause_changes_what_you_hear", "where_you_pause_changes_what_you_hear_it_was_a_good_thing_to_notice", "which_is_the_hottest_planet_venus_is_the_hottest_planet", "which_one_is_special_asks_dad",
  "which_one_is_special_asks_lili", "which_one_whose_turn_how_many_how_much_they_each_ask_a_different_thing", "which_season_do_you_like_best", "which_word_is_hard_asks_ming", "which_word_is_hard_asks_ming_now_the_question_is_small", "which_word_is_hard_asks_ming_the_question_is_small_now_so_grandma_can_answer_it",
  "while_i_was_digging_i_heard_a_noise", "while_she_waited_she_mashed_the_sweet_bean_paste_and_counted_out_twelve_equal_pieces_of_filling", "while_they_worked_grandpa_talked_about_the_road_to_his_first_school_and_the_hills_beyond_it", "white_clouds_are_light_and_small_they_often_just_sit_in_the_sky", "who_asks_about_a_person_what_asks_about_a_thing_where_asks_about_a_place", "who_goes_first_asks_dad",
  "who_goes_first_asks_grandpa", "who_s_that_it_s_my_sister", "who_s_this_it_s_my_grandma", "who_s_this_this_is_my_grandma", "who_wrote_the_note", "who_wrote_the_note_ming_looks_at_the_name",
  "who_wrote_the_note_ming_reads_the_name", "whose_coat_is_it_it_s_mine", "whose_coat_is_this_it_s_mine", "whose_jacket_is_this_it_s_mine", "whose_name_is_it", "whose_name_is_it_ming_does_not_know_so_he_looks_again",
  "whose_shirt_is_this_it_s_pat_s", "why_a_cake_rises", "why_a_cake_rises_now_ming_can_tell_grandma", "why_because_they_help_us", "why_can_i_not_sleep_asks_dad", "why_can_i_not_sleep_asks_grandma",
  "why_can_i_not_sleep_asks_grandma_a_good_question_is_a_good_start", "why_do_seasons_change", "why_do_you_like_giraffes_because_they_re_tall_and_pretty", "why_does_a_boat_stay_up_on_the_water_the_boat_is_big_but_it_does_not_go_down", "why_does_a_cake_rise", "why_does_a_cake_rise_ming_wants_to_know",
  "why_does_a_seed_need_rain", "why_does_a_seed_need_rain_we_can_find_out", "why_does_it_fall_asks_mom", "why_does_the_moon_look_round", "why_does_the_shadow_change", "why_does_the_shadow_change_ming_asks_grandma",
  "why_does_the_shadow_change_ming_asks_grandma_because_he_wants_to_know", "why_don_t_we_ride_the_roller_coaster", "why_is_winter_cold", "why_is_winter_cold_we_can_find_out", "why_practice_works", "why_seasons_change",
  "why_the_moon_looks_round", "why_the_moon_looks_round_now_you_can_tell_a_friend", "why_the_moon_looks_round_now_you_can_tell_a_friend_when_you_see_it", "why_winter_is_cold", "why_winter_is_cold_now_we_know", "will_it_run_away_asks_ming",
  "wind_and_water_break_the_rock", "winter_is_cold_but_we_are_warm", "winter_is_cold_but_we_are_warm_our_coats_and_scarves_keep_it_out", "winter_is_for_repairs_stories_and_the_next_calendar_grandpa_rolls_the_old_one_up_carefully", "winter_is_here", "winter_is_here_the_days_are_short",
  "winter_is_here_the_days_are_short_and_the_nights_are_long", "winter_is_here_the_trees_have_no_leaves", "winter_is_here_the_trees_have_no_leaves_and_the_wind_is_cold", "winter_will_go", "winter_will_go_the_days_get_long_again", "winter_will_go_the_days_get_long_again_when_spring_comes",
  "wish_wish_wish", "worker_bees_are_the_bees_who_fly_out_and_get_food_they_work_all_day_and_come_home_at_night", "would_you_like_a_cup_of_tea", "would_you_like_some_ice_cream", "would_you_like_to_visit_the_planetarium_i_would_love_to", "write_it_down",
  "writing_helps_us_remember", "writing_helps_us_remember_the_idea_will_stay_there", "writing_helps_us_remember_the_idea_will_stay_there_so_he_will_not_forget_it", "writing_is_a_good_tool", "writing_needs_looking_as_much_as_moving_it_made_more_sense_now", "wrong_guesses_taught_them_something",
  "wrong_guesses_taught_them_something_it_was_a_good_lesson", "wrong_guesses_taught_them_something_it_was_worth_thinking_about", "yes_or_no_questions_go_up_at_the_end_are_you_ready_is_it_hot", "yes_she_is", "yes_the_ring_is_in_the_sink", "yesterday_we_made_cards_for_the_writer",
  "you_already_know_that_word_mould_now_because_the_clause_after_it_did_all_the_teaching", "you_and_me_and_my_duck", "you_are_first_in_my_heart_says_my_teacher", "you_are_older_than_me_but_i_am_taller", "you_can_ask_for_help", "you_can_eat_a_noodle_too",
  "you_can_eat_a_noodle_too_take_one_and_taste_it", "you_can_feel_heat_without_touching_a_thing_hold_your_hand_near_hot_tea_and_you_feel_it", "you_can_follow_the_line_to_a_place_if_the_line_turns_you_turn_too", "you_can_keep_a_moon_diary_draw_what_you_see_at_the_same_hour_each_night", "you_can_look_it_up_on_the_internet", "you_can_read_both",
  "you_can_read_both_look_at_each_word_first", "you_can_read_both_look_at_each_word_first_and_then_say_it", "you_can_say_both", "you_can_say_both_both_are_short_words", "you_can_say_both_both_are_short_words_so_they_are_easy", "you_can_say_both_say_cap_then_cape_then_cap",
  "you_can_say_both_say_them_one_after_the_other", "you_can_say_both_say_them_together", "you_can_say_both_say_them_together_and_keep_the_ow_the_same", "you_can_say_it_well", "you_can_say_it_well_try_this_long_one", "you_can_say_it_well_try_this_long_one_and_read_it_to_the_end",
  "you_can_say_tree", "you_can_see_ants_on_the_grass_they_are_small_but_they_are_always_at_work", "you_can_see_it_in_one_tree_watch_it_all_year", "you_can_see_it_in_one_tree_watch_it_all_year_and_you_will_see_the_change", "you_have_courage_grandma_says_one_word_is_easy_ming_says", "you_have_to_wear_a_space_suit",
  "you_must_be_quiet_in_class", "you_must_not_smoke_here", "you_must_return_the_book_on_time", "you_mustn_t_shout_in_the_library", "you_need_a_way_to_measure_this_way_is_simple_and_you_can_do_it_too", "you_should_exercise_every_day",
  "you_should_not_eat_too_much_junk_food", "you_should_shake_hands_when_you_meet", "you_should_take_some_medicine", "you_shouldn_t_stay_up_late", "you_will_get_better_soon", "your_wish_will_come_true",

  /* Power Up 主题课程 156 条整句（2026-11-22.9 补齐）：
     原来只有 6 条命中，其余 150 条走「逐词接龙」= 一个词一个词蹦。
     现在全部有整句 mp3，规格与站内 7140 条逐字节同源（probe 校验过）。 */
  "i_m_lucy", "what_s_your_name", "nice_to_meet_you", "this_is_my_pen", "what_s_this_it_s_a_ruler", "put_it_in_your_bag_please",
  "this_is_my_mum", "these_are_my_brothers", "i_love_my_family", "i_have_three_red_pens", "how_many_books_five", "two_blue_birds_are_in_the_tree",
  "the_cow_says_moo", "it_has_four_legs", "i_like_the_little_pig", "i_don_t_like_candy", "milk_is_good_for_you", "this_is_my_teddy_bear",
  "i_have_a_big_ball", "let_s_play_together", "i_can_jump", "let_s_go_to_the_park", "i_can_see_the_sun", "it_s_fun",
  "we_are_reading", "where_is_the_glue", "it_s_on_the_desk", "he_is_my_uncle", "she_is_wearing_a_hat", "they_are_my_cousins",
  "how_many_books_fifteen", "there_are_twenty_chairs", "count_from_one_to_twenty", "the_fox_has_a_long_tail", "owls_sleep_in_the_day", "frogs_can_swim_too",
  "i_am_wearing_a_red_hat", "put_on_your_coat", "these_are_my_socks", "i_d_like_some_soup", "would_you_like_some_candy", "noodles_are_yummy",
  "there_are_two_windows", "my_lamp_is_on_the_table", "it_s_sunny_let_s_play_outside", "put_on_your_coat_it_s_cold", "i_can_see_a_cloud_like_a_sheep", "i_can_swim_fast",
  "let_s_play_football", "i_like_riding_my_bike", "on_monday_i_have_english", "what_do_you_do_on_saturday", "i_get_up_at_seven_o_clock", "what_s_for_breakfast",
  "i_eat_noodles_every_morning", "pass_me_the_spoon_please", "you_should_rest_and_drink_water", "take_this_medicine_twice_a_day", "yesterday_we_saw_a_hippo_in_the_jungle", "the_monkey_was_very_funny",
  "was_it_dangerous", "why_are_you_sad", "because_my_team_lost_the_game", "don_t_worry_we_can_try_again", "turn_left_at_the_bank", "the_museum_is_next_to_the_park",
  "how_do_i_get_to_the_library", "my_aunt_is_a_pilot", "she_works_at_a_big_company", "what_does_your_father_do", "there_was_a_river_near_my_school", "the_stars_are_bright_tonight",
  "look_at_that_tall_mountain", "i_go_to_school_by_bus", "the_train_is_faster_than_the_bus", "how_long_does_it_take", "i_like_art_best_of_all", "we_have_pe_on_monday_and_friday",
  "science_is_interesting_but_hard", "my_birthday_is_in_april", "it_s_half_past_three", "what_s_the_date_today", "the_whale_is_the_largest_animal_in_the_sea", "dolphins_are_very_smart",
  "whales_breathe_air_not_water", "it_will_be_stormy_tomorrow", "take_an_umbrella_with_you", "the_temperature_is_15_degrees", "i_have_to_wash_the_dishes", "she_makes_the_bed_every_morning",
  "i_always_clean_my_room_on_sunday", "she_is_kind_to_everyone", "he_never_gives_up", "a_friend_who_is_honest_is_a_real_friend", "this_t_shirt_is_too_expensive", "how_much_is_this_hat",
  "we_are_going_to_the_beach_by_car", "don_t_forget_your_suitcase", "i_can_t_wait_to_see_the_sea", "there_is_a_concert_on_tv_tonight", "i_painted_a_picture_of_my_family", "music_makes_me_happy",
  "we_must_protect_the_earth", "don_t_throw_rubbish_in_the_sea", "recycling_saves_energy", "this_box_is_heavy_but_small", "it_s_made_of_wood", "the_bag_is_light_and_cheap",
  "how_often_do_you_exercise", "stay_healthy_and_strong", "exercise_makes_your_body_strong", "go_along_this_street_then_turn_right", "it_s_far_from_my_home", "is_it_near_the_park",
  "she_plays_the_violin_in_the_school_band", "our_band_plays_every_friday", "practice_makes_the_music_beautiful", "i_sent_you_an_email", "don_t_forget_the_subject_line", "write_back_soon",
  "i_want_to_be_a_scientist", "study_hard_for_your_dream", "every_job_is_important", "both_festivals_are_about_family", "we_celebrate_with_a_big_party", "christmas_is_a_festival_in_the_west",
  "people_in_france_speak_french", "i_d_love_to_travel_abroad", "every_country_has_its_own_flag", "learning_english_takes_practice", "i_will_review_my_notes_tonight", "never_forget_to_ask_why",
  "everyone_must_follow_the_rules", "volunteers_clean_the_park_together", "rules_protect_everyone", "it_was_brave_of_him_to_speak_first", "patient_people_make_good_teachers", "helpful_students_are_always_welcome",
  "phones_are_cheaper_than_before", "screens_are_bigger_this_year", "don_t_spend_too_much_time_on_screens", "we_recycle_so_that_we_protect_the_earth", "fresh_air_matters_to_everyone", "small_actions_make_a_big_change",
  "i_used_to_lose_my_keys", "the_city_has_changed_a_lot", "change_starts_with_a_small_step", "if_it_costs_too_much_i_won_t_buy_it", "make_a_list_before_you_shop", "needs_come_before_wants",
  "have_you_ever_been_abroad", "every_culture_has_its_own_festivals", "be_curious_not_judgemental", "my_goal_is_to_pass_the_b1_exam", "practice_makes_perfect", "plan_your_work_then_work_your_plan",
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
   动态句子也就有了连读。词块 137 条、约 961KB，不用给上千种组合各存一整句。
   ★ PHRASE_VER 独立于 AUDIO_VER / SENTENCE_VER，重做词块只升它。
   2026-11-14.19 v4：137 条 64kbps → 128kbps 重编（同整句降噪，词块是
   整句缺失时的连读兜底，码率必须与整句同规格才没有音质断层）。 */
const PHRASE_VER = 6;
const PHRASE_AUDIO = new Set([
  "a_boy","a_girl","are_these","are_they","birds_fly","can_he",
  "can_i","can_she","can_they","can_you","did_you","do_you",
  "do_you_have","do_you_want","do_you_want_to","does_he","does_he_eat","does_he_have",
  "does_he_like","does_he_see","does_he_want","does_it","does_it_eat","does_it_have",
  "does_it_like","does_it_see","does_it_want","does_she","does_she_eat","does_she_have",
  "does_she_like","does_she_see","does_she_want","every_day","going_to","has_a",
  "he_can_t","he_doesn_t","he_doesn_t_eat","he_doesn_t_have","he_doesn_t_like","he_doesn_t_see",
  "he_doesn_t_want","he_is","he_isn_t","he_likes","he_was","how_many",
  "i_am","i_am_a_boy","i_am_a_girl","i_can","i_can_t","i_don_t",
  "i_don_t_eat","i_don_t_have","i_don_t_like","i_don_t_see","i_don_t_want","i_drink",
  "i_eat","i_have","i_have_a","i_have_an","i_have_two","i_like",
  "i_run","i_see","i_see_a","i_see_an","i_was","is_going_to",
  "is_he","is_it","is_on_the","is_on_the_bed","is_on_the_chair","is_on_the_floor",
  "is_on_the_sofa","is_on_the_table","is_she","is_this","is_this_a","is_this_an",
  "it_doesn_t","it_doesn_t_eat","it_doesn_t_have","it_doesn_t_like","it_doesn_t_see","it_doesn_t_want",
  "it_is","it_is_a","it_isn_t","my_name_is","on_the","over_there",
  "she_can","she_can_t","she_doesn_t","she_doesn_t_have","she_doesn_t_like","she_doesn_t_see",
  "she_doesn_t_want","she_is","she_is_not","she_isn_t","she_was","the_cat_is",
  "there_are","there_are_some","there_is_a","there_is_an","they_are","they_aren_t",
  "they_can_t","they_don_t","they_don_t_have","they_don_t_like","they_don_t_see","they_don_t_want",
  "they_were","this_is","this_is_a","this_is_an","this_is_my","want_to",
  "was_at","we_are","we_drink","we_drink_milk","we_have","we_like",
  "we_sing","were_at","what_is","where_is","you_can_t"
]);
const phraseAudioURL = t => {
  const k = audioSlug(t);
  return k && PHRASE_AUDIO.has(k)
    ? `audio/phrases/${k}.mp3?v=${PHRASE_VER}` : '';
};

/* 弱读冠词 a / an 的文件（句子里单独成段时用）。
   ★ 独立版本号：只重做这两个文件时，不必让 2903 条单词音频一起作废。
   2026-11-13.10 v2：旧文件是 ljspeech 另一副嗓子 + /ʌ/ 重读（"啊/阿"），
   换成同一说话人(381)的真 schwa 音素，与词块里的 a 完全一个音色。 */
const WEAK_VER = 2;
const localAudioURL = t => {
  const k = audioSlug(t);
  if (!k) return '';
  /* 整句自有音频优先：命中就一次播完，不再逐词拼接。
     speak() 里那句「含空格就走接龙」的判断正是看这里有没有命中。 */
  /* 弱读冠词走自己的版本号，别被 AUDIO_VER 带着全站重下 */
  if (k === 'weak_a' || k === 'weak_an') return `audio/${k}.mp3?v=${WEAK_VER}`;
  const whole = sentenceAudioURL(t);
  if (whole) return whole;
  /* 连读词块：句子接龙里命中就一次播完这一整块（含弱读冠词） */
  const phrase = phraseAudioURL(t);
  if (phrase) return phrase;
  if (!__LOCAL_AUDIO.has(k)) __registerGSAudio();
  if (__LOCAL_AUDIO.has(k)) return `audio/${k}.mp3?v=${AUDIO_VER}${__audioFixQS(k)}`;
  /* 清单还没落地（首访的几十毫秒窗口）：单个词先按「本地应该有」试一次。
     真有文件的当场响，真没有的 404 之后才走兜底语音，反正比现在更慢的情况不存在。
     带空格的短语不做这个乐观判断——那会把整句朗读引到 404 上，
     该走逐词接龙的还是走逐词接龙。 */
  if (!__audioListReady && !/\s/.test(String(t))) return `audio/${k}.mp3?v=${AUDIO_VER}${__audioFixQS(k)}`;
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
   颜色一律用**色块**——这正是课本教颜色的方式，也不会和别的词撞图。

   ★ 2026-11-14.12：色块必须是**圆角方块**，不能是圆点。
     🔴（以及自绘 WORD_SVG 里 red/blue/yellow/black/grey 的圆球）在小朋友眼里
     就是一个「白底红圆」——家长反馈像日本国旗，怕误导孩子。
     同理蓝黄绿圆点也容易被看成旗子/球。改成方角色卡：像一张颜料卡，
     一眼就是"颜色"，谁都不会看错，也和「学堂」页的颜色词画法统一。
   ⚠️ wordIcon 与 iconKey 必须同时判在最前：只改一处，图与身份对不上，去重会静默失效。 */
const WORD_COLOR = {
  red: '#EF4444', yellow: '#FACC15', blue: '#3B82F6', green: '#22C55E',
  white: '#FFFFFF', black: '#1F2937', orange: '#F97316', pink: '#F472B6',
  purple: '#A855F7', brown: '#92400E', grey: '#9CA3AF', gray: '#9CA3AF',
};

/* 色卡图：圆角方块 + 左上高光 + 描边。
   白 / 黄在白卡上必须加深描边，否则和白底糊成一片（学堂页踩过这个坑）。 */
function colorCardSVG(name) {
  const fill = WORD_COLOR[name];
  if (!fill) return '';
  const light = (name === 'white' || name === 'yellow');
  const edge = light ? 'rgba(15,23,42,.42)' : 'rgba(15,23,42,.22)';
  return '<svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">'
    + '<rect x="2.6" y="2.6" width="30.8" height="30.8" rx="7.5" fill="' + fill + '"'
    + ' stroke="' + edge + '" stroke-width="2.4"/>'
    + '<rect x="6.4" y="6" width="23.2" height="7.6" rx="3.8" fill="#FFFFFF"'
    + ' opacity="' + (light ? '.55' : '.22') + '"/></svg>';
}

/* 词图三级：色块（颜色词）→ emoji（有合适图形的）→ 首字母牌（配不上的）
   代词/介词/连词/抽象动词这类词根本没有形象，硬塞一个 emoji 是错的——
   it=🐱 会让孩子以为 it 就是"猫"，believe=🙏 会以为"相信"就是祈祷。
   宁可给字母牌，也不给假图。 */
function wordIcon(w) {
  const name = String((w && w.w) || '').toLowerCase();
  const emo = String((w && w.e) || '').trim();
  /* 颜色词最先判：色卡是"画出来的图形"，不能让 emoji 圆点 / 自绘圆球抢在前面 */
  if (WORD_COLOR[name]) {
    return `<span class="wsvg" role="img" aria-label="${esc(w.zh || name)}">${colorCardSVG(name)}</span>`;
  }
  /* 内置 SVG 优先：不依赖系统 emoji 字体，任何电脑画出来都一样彩色
     （emoji 靠字体渲染，会变黑白或吐方块，见下面 emojiClusters 的说明） */
  if (emo && !wordSvgFirst(name) && hasEmojiSvg(emo)) {
    return `<span class="wsvg" role="img" aria-label="${esc(w.zh || name)}">${emoSvg(emo)}</span>`;
  }
  /* SVG 卡通插画（svg/word-svg.js） */
  if (typeof WORD_SVG !== 'undefined' && WORD_SVG[name]) {
    return `<span class="wsvg" role="img" aria-label="${esc(w.zh || name)}">${WORD_SVG[name]}</span>`;
  }
  /* 没内置图才退回系统 emoji，并强制走彩色 emoji 字体（.emj） */
  if (emo) return `<span class="emj" role="img" aria-label="${esc(w.zh || name)}">${esc(emo)}</span>`;
  const ch = String((w && w.w) || '?').trim().charAt(0).toUpperCase();
  return `<span class="wtile" aria-hidden="true">${esc(ch)}</span>`;
}

/* ---------------- 自绘优先的「坏 emoji」词 ----------------
   ★ 2026-11-11.3：组合键帽（1️⃣1️⃣）在图库里会画成两张并排的蓝色键帽，
     区域指示符国旗（🇨🇳）画成两张字母方块 —— 「十一 / 中国 / 星期一」根本
     看不出来。svg/word-svg.js 已补 33 张数字卡 / 日历卡 / 几何国旗卡，
     这些词改走自绘 SVG。0️⃣～9️⃣ 十个数字词的图是合适的，不在此列。
   ⚠️ wordIcon 与 iconKey 必须同时判断：只改一处，图与身份对不上，去重会静默失效。
   ⚠️ 集合里的词必须在 svg/word-svg.js 有条目（_audit/check_facts.py 会核对）。
   ⚠️ 卡面只放数字 / 序号 / 几何图形，绝不写英文：看词选图会泄答案（产品铁律 3）。 */
const WORD_SVG_FIRST = new Set(
  ('eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty ' +
   'monday tuesday wednesday thursday friday saturday sunday ' +
   'january february march april may june july august september ' +
   'china america england australia canada japan france ' +
   'board blackboard').split(' '));
function wordSvgFirst(name) { return WORD_SVG_FIRST.has(name); }

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
  /* 与 wordIcon 同序：颜色词走色卡 key，不能退回 emoji 码位 */
  if (WORD_COLOR[name]) return 'chip:' + WORD_COLOR[name];
  /* U+FE0F（变体选择符）要去掉：同一张图有时带有时不带，key 必须一致 */
  if (emo && !wordSvgFirst(name)) {
    const plain = emo.replace(/\uFE0F/g, '');
    if (typeof hasEmojiSvg === 'function' && hasEmojiSvg(emo)) return 'esvg:' + plain;
  }
  if (typeof WORD_SVG !== 'undefined' && WORD_SVG[name]) {
    /* 两对自绘 SVG 的路径数据**逐字节相同**（correct/well、everybody/everyone），
       只按词名做 key 会漏掉它们，同一轮照样出现两张一样的画。归一到同一个 key。 */
    return 'svg:' + (SVG_SAME_KEY[name] || name);
  }
  if (emo) return 'emoji:' + emo.replace(/\uFE0F/g, '');
  return 'letter:' + name.charAt(0);
}
/* board / blackboard 是同一块黑板，共用一张自绘画，必须同 key；
   画面相同、词不同：后来者归一到前者（校验脚本 _audit/test_icon_key.js 会核对这张表） */
const SVG_SAME_KEY = { well: 'correct', everyone: 'everybody',
  blackboard: 'board' };

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
  /* ★ 2026-11-11.11（C2）图库拆成两份：
       emoji-core.js（约 87KB）—— 界面装饰 / 导航 / 岛屿 / 弹窗 / 提示语用到的 80 个；
       emoji-svg.js（约 860KB）—— 词库 999 个词的表情，只有真画词卡时才需要。
     首页 / 家长中心 / 声明 / 404 只取核心库（界面装饰全部已收进核心库，
     2026-11-13.5 补入 🧽）；重页面（单词镇 / 课本 / 学堂 / 游戏 /
     字母岛 / 语法）在 <body data-emoji="full"> 上直接声明要全量，
     避免先下一份核心库再下一份全量。核心库是全集的子集，不会缺图。 */
  const inject = src => {
    const el = document.createElement('script');
    el.src = src;
    el.async = true;
    el.onerror = () => {};                           // 拉不到就保持字体字形，不影响功能
    /* ★ 2026-11-13.4：图库到货必须通知 app.js 去替换，否则整页图标一直用系统字形。
       三份库的末尾本来都有 __emojiSvgReady() 调用，但 emoji-core.js 是脚本重拼的，
       那行被丢了 —— 轻页（首页 / 家长中心 / 声明 / 404）于是从不替换，
       ZWJ 组合如 👨‍👩‍👧 在部分机型被画成黑色剪影。
       这里再挂一道 onload：不依赖产物里有没有那行，重复调用也是幂等的。 */
    el.onload = () => {
      try { if (window.__emojiSvgReady) window.__emojiSvgReady(); } catch (e) {}
    };
    (document.head || document.documentElement).appendChild(el);
  };
  const wantFull = /\bfull\b/.test((document.body && document.body.getAttribute('data-emoji')) || '');
  let fullLoaded = false;
  const loadFull = () => {
    if (fullLoaded) return;
    fullLoaded = true;
    inject('svg/emoji-svg.js?v=6');
  };
  const load = () => {
    if (window.WORD_EMOJI && wantFull === false) return;
    if (wantFull) { loadFull(); return; }
    inject('svg/emoji-core.js?v=3');
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
  /* ★ 2026-11-13.10：多词文本一律交给句子朗读链（整句 mp3 → 连读词块 → 单词）。
     原来这里走 speakSentenceWords：逐词念、而且冠词 a 直接取 audio/a.mp3 ——
     那是字母岛的**字母名 /eɪ/**，于是 "protect the earth" 读成三个孤立词、
     "a pair of shoes" 里那个 a 变成 "诶"。这就是家长说的「中间的 a 读 A」。 */
  if (/\s/.test(t) && !localAudioURL(t)) {
    if (typeof speakSentence === 'function') { speakSentence(t); return; }
    speakSentenceWords(t); return;
  }
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
  /* 2026-11-15.3：点词只出人声，不再先播 520Hz 的 sfx.pop。
     家长反馈「很多单词有杂音」——这个 80ms 短音在语音起点叠着响，
     连续点词就是「啵-词-啵-词」，容易被当成底噪。 */
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
    engine: '站内自带音频（单词、整句与词块由 Piper + LJSpeech 公有领域声线合成；字母音与拼读块为母语者录音，全部离线可用）',
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
if (!window.__isNativeShell && 'serviceWorker' in navigator && location.protocol === 'https:') {
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
    /* 壳内本身就是桌面图标，再教人「添加到主屏幕」是荒谬的 */
    if (window.__isNativeShell) return;
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
  { id: 'learn',   href: 'learn.html',   emoji: '🎯', label: '学习' },
  { id: 'words',   href: 'words.html',   emoji: '🏘️', label: '单词镇' },
  { id: 'pep',     href: 'pep.html',     emoji: '🏫', label: '人教课本' },
  { id: 'powerup', href: 'powerup.html', emoji: '🚀', label: 'Power Up' },
  { id: 'getsmart', href: 'getsmart.html', emoji: '🎓', label: 'Get Smart' },
  { id: 'grammar', href: 'grammar.html', emoji: '🏭', label: '句子工厂' },
  { id: 'read',    href: 'read.html',    emoji: '📚', label: '读书馆' },
  { id: 'games',   href: 'games.html',   emoji: '🎡', label: '游戏乐园' },
  { id: 'parents', href: 'parents.html', emoji: '👤', label: '我的' },
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
/* 底部栏最终定为 4 格：学习 / 读书馆 / 游戏 / 我的（2026-11-22.2）。
   ★ 为什么去掉「首页」：首页的「继续学习 / 今日任务 / 阅读游戏入口」
     和这四格几乎一一重复，孩子进来先看见一遍入口、再点一遍导航。
     现在「学习」页就是首页：顶部是继续学习 + 今日任务，下面是课程地图。
   ★ 为什么没有第 5 格头像+星星：那实际上是把「我的」拆成两格。
     星星改成「我的」图标右上角的小角标，档案入口在「我的」页顶部。
   ★ 加回任何一格之前先问：它是不是「每天都要点」且无法被这四格覆盖？ */
const TABS = [
    { id: 'learn',   href: 'learn.html',   emoji: '🎯', label: '学习' },
    { id: 'read',    href: 'read.html',    emoji: '📚', label: '读书馆' },
    { id: 'games',   href: 'games.html',   emoji: '🎮', label: '游戏' },
    { id: 'parents', href: 'parents.html', emoji: '👤', label: '我的', stars: true },
  ];
  document.body.insertAdjacentHTML('beforeend', `
    <nav class="bottom-nav" aria-label="底部导航">
      ${TABS.map(n => `<a class="bnav ${n.id === activeId ? 'on' : ''}" href="${n.href}">
        <span class="nav-emoji">${n.emoji}${n.stars ? `<i class="bnav-star" id="navStarsBtm">${Store.d.stars}</i>` : ''}</span>
        <span class="bnav-label">${n.label}</span>
      </a>`).join('')}
    </nav>`);
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
    p.style.animationDuration = (0.5 + Math.random() * 0.3) + 's';   /* F3：≤0.8 秒，读解析前就散 */
    p.style.transform = `rotate(${Math.random() * 360}deg)`;
    box.appendChild(p);
  }
  document.body.appendChild(box);
  setTimeout(() => box.remove(), 1200);
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
        <small style="display:block;color:#3F4658">${x.grade ? GRADES.find(g => g.id === x.grade) ? GRADES.find(g => g.id === x.grade).name : '' : '未设年级'} · ${x.created ? new Date(x.created).toLocaleDateString() : ''}</small>
      </div>
      ${x.id === p.id ? '' : `<button class="btn mint" style="padding:6px 14px;font-size:.8rem" onclick="switchProfile('${x.id}')">🔄 切换</button>`}
      ${Profiles.meta.list.length > 1 ? `<button class="btn coral" style="padding:6px 12px;font-size:.8rem" onclick="removeProfile('${x.id}')">🗑️</button>` : ''}
    </div>`).join('');
  document.body.insertAdjacentHTML('beforeend', `
    <div class="modal-mask" id="profileMask" onclick="if(event.target===this)closeProfileModal()">
      <div class="modal card">
        <h2>👤 小伙伴档案</h2>
        <p style="font-size:.8rem;color:#3F4658;margin:4px 0 10px">一台电脑可以有多个小朋友，每人一份独立进度，互不打扰！</p>
        <div class="profile-list">${rows}</div>
        <div style="margin-top:14px" data-avatar-target="profile">
          <div style="display:flex;align-items:baseline;gap:8px;flex-wrap:wrap">
            <b style="font-size:.95rem">🖼️ 换个头像</b>
            <small style="color:#3F4658">现在是 <span id="curAvatarEcho">${p.avatar}</span> · ⭐ 当前 <b>${Store.d.stars}</b> 颗</small>
          </div>
          <small style="display:block;color:#3F4658;margin:4px 0 8px">点一下就换好。带 🔒 的用星星解锁，解锁后永久有效。</small>
          <div class="avatar-grid">${AVATARS.map(a => avatarChipHtml(a, a === p.avatar)).join('')}</div>
        </div>
        <div style="display:flex;gap:8px;margin-top:12px">
          <button class="btn ghost" style="flex:1" onclick="toggleSoundQuick();this.textContent=Store.d.soundOn?'🔊 声音：开':'🔇 声音：关'">🔊 声音：${Store.d.soundOn ? '开' : '关'}</button>
          <button class="btn mint" style="flex:1" onclick="testSound()">🎵 测试声音</button>
        </div>
        <p style="font-size:.72rem;color:#3F4658;margin:8px 0 0;text-align:center">没听到声音？点「测试声音」检查设备音量键 🔊</p>
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
            <small style="display:block;color:#3F4658;margin-top:8px">⭐ 当前有 <b>${Store.d.stars}</b> 颗星星 · 带 🔒 的头像用星星解锁，永久有效</small>
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
            <p style="font-size:.78rem;color:#3F4658;margin:0 0 10px;line-height:1.6">
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
            <p style="font-size:.7rem;color:#4A5162;margin:8px 0 0">🔒 进度只存在你自己的浏览器里，不上传任何服务器。短码经微信/短信发送时，传输安全由该渠道负责。恢复会新建一个档案，不会覆盖现有进度。</p>
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
  askConfirm(`用 <b>${price}</b> 颗星星解锁头像 ${a} 吗？<br><small style="color:#4A5162">解锁后永久有效，马上就能用上。</small>`, function () {
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
  askConfirm(`确定删除档案 <b>${esc(p ? p.name : '')}</b> 吗？<br><small style="color:#4A5162">它的全部学习进度将无法恢复。</small>`, function () {
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
  /* 一步两样：短码（发微信）+ 文件（下载存档）。2026-11-08 合并原两套入口。
     ★ 2026-11-22：文件那一半改走 Shell.saveFile。
       原因：Android WebView 不处理 blob + a[download]，点「导出」会提示
       已下载、实际什么都没有（网页版一切正常，所以这个 bug 只在 App 里出现）。
       壳内改由 Capacitor Filesystem 真写进「文档」；网页仍是原来的下载。 */
  showSyncCode();                                    // 短码写进 syncCodeBox
  const name = '小鸟英语乐园-' + Profiles.active().name;
  if (window.Shell && Shell.saveFile) {
    Shell.saveFile(name, text, 'application/json').then(r => {
      if (r && r.ok && r.where === 'download') toast('📤 短码已生成 + 备份文件已下载');
    });
    return;
  }
  try {
    const blob = new Blob([text], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name + '.json';
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
  /* 2026-11-13.5：syncCodeBox 是只读展示框，导出后里面留着本机码。
     原来「框里有码就直接用」会让「粘贴短码恢复」把刚导出的码再导一遍，
     凭空多出一个重复档案。这里始终弹输入框，让「粘贴」名副其实。 */
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
  /* kind: 'error' 资源加载失败 / 'slow' 迟迟没渲染完（2026-11-11.11 / C1） */
  const showRetry = (kind) => {
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
    const msg = kind === 'slow'
      ? '网络有点慢，内容还在路上…<br><span style="font-size:.82rem">可以先点下面重试，或者等一下下～</span>'
      : '内容没能加载出来，检查网络后重试一下～';
    ph.innerHTML = '<p style="color:#3F4658;font-size:.9rem;line-height:1.6">' + msg + '</p>'
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
  /* ★ 2026-11-11.11（C1）原来只在「资源加载失败」时给重试，脚本**慢**但没失败
     就一直转圈：实测冷缓存 3G 下单词镇首屏要等约 1.6MB 同步脚本，慢网能停
     十几秒。10 秒还没渲染出内容就换成「网络有点慢」+ 重试按钮。
     ⚠️ 只是**多给一条出路**：不清占位、不假装成功 —— 内容一到，hide() 照常接管。 */
  const slowTimer = setTimeout(() => {
    if (!document.getElementById('bootLoader')) return;        // 加载层已经撤了
    const app = document.getElementById('app');
    if (app && app.innerHTML.trim()) return;                    // 内容已经渲染
    showRetry('slow');
  }, 10000);
  const hideOnce = () => { clearTimeout(slowTimer); hide(); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', hideOnce, { once: true });
  else hideOnce();
})();

/* ================= 键盘可达性：把「div 按钮」升级成真按钮 =================
   ★ 2026-11-20：单词卡 / 游戏岛 / 关卡卡 / 字母词卡 / 书卡原来是纯 <div onclick>，
     Tab 走不到、读屏也不念成按钮 —— 首页主卡（mainCard）早就补了 role+tabindex，
     这些主要内容入口却没跟上。这里统一补，动态渲染出来的也一并管。
   · 视觉焦点不用另加：css 里已有全局 :focus-visible 4px 描边
   · 只补三样：role="button" / tabindex="0" / Enter·空格 触发 click()
   · 已有 role / tabindex 的元素不覆盖（页面自己写了更好的就听页面的）；也不写 aria-label，
   · MutationObserver 只盯 childList，不改属性，不会自激；一轮变更只跑一次 upgrade */
(function () {
  const SELECTOR = '.word-card, .island, .level-card, .gs-level, .word-mini, .bk-card, .gs-catch';
  const FLAG = '__kbBtn';
  const upgrade = (root) => {
    if (!root || !root.querySelectorAll) return;
    const list = root.querySelectorAll(SELECTOR);
    for (let i = 0; i < list.length; i++) {
      const el = list[i];
      if (el[FLAG]) continue;
      el[FLAG] = true;                                   // 原生属性缺失时才补，重复调用无副作用
      if (!el.hasAttribute('role')) el.setAttribute('role', 'button');
      if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
      el.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter' && e.key !== ' ' && e.key !== 'Spacebar') return;
        if (e.target !== el) return;                     // 焦点在卡片内部的小按钮上时，交给它自己处理
        e.preventDefault();
        el.click();
      });
    }
  };
  const start = () => {
    upgrade(document);
    if (typeof MutationObserver !== 'function') return;
    let queued = false;
    const mo = new MutationObserver(() => {
      if (queued) return;
      queued = true;
      Promise.resolve().then(() => { queued = false; upgrade(document); });
    });
    mo.observe(document.body, { childList: true, subtree: true });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
