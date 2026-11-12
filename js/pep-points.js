/* ============================================================
   小鸟英语乐园 · 拼读 / 音节工具与课本查询函数（2026-11-12.3 拆分）
   ------------------------------------------------------------
   ⚠ 本文件只放「工具与函数」，三块大数据已按页拆出，别再塞回来：
     js/pep-lessons.js  PEP_POINTS 课本单元讲解     仅 pep.html 引
     js/pep-mem.js      PEP_MEM / PEP_POS / PEP_IPA  getsmart + pep 引
   多个 <script> 的顶层 const 共享同一个全局词法环境，所以本文件里的
   pepPosKey / pepIpaOf / pepMemOf 能读到另两个文件的数据；单词镇只引
   本文件且不调用这三个函数，不会因数据缺失报错（真浏览器已验）。
   ⚠ 改拼读规则只改本文件，不要在别处复制实现。
   ============================================================ */

/* ---- 自然拼读拆块（全站统一：词卡展示、拼词游戏、单元拼读地图共用这套） ----
   常见字母组合：3 字母 → 2 字母 → 单字母，贪心切分。
   ear 的发音分两派：ear/hear/year 读 /ɪə/（整块科学），
   bear/wear/pear 读 /eə/、learn/early/earth 读 /ɜː/ —— 这些词整块 ear 会教错，
   例外表让它们退回 ea+r 切分（ea 在这些词里恰好读对应音）。 */
/* ★ 2026-11-11.11（B2）只留「一个块 = 一个音」的真组合。
   去掉的全是辅音连缀 / 韵脚整块，它们不是音素：
     str/spr/thr（三个辅音连读）、old/all/ell/ill/ing/ang/ong/ung（韵脚，
     里面还含独立音素）、air（ai+r 已能覆盖）—— 留着会把 grandma 切成 gr·a·nd·m·a。
   保留 ear/ire 是因为它们对应 /ɪə/、/aɪə/ 一个韵，例外表另有处理。 */
const PEP_TRIGRAPHS = ['tion', 'igh', 'eau', 'ear', 'ire'];
/* ★（B2）辅音连缀全部移除：st sp sk tr dr cr fr gr pr br pl bl cl fl gl sl sw
   tw sm sn nd nk nt mp ld lt ft pt lk —— 它们各自由两个音素组成，当成一个块
   会让孩子把 nt、nd 读成一个音（elephant → e·l·e·ph·a·nt 就是它造成的）。
   ll ss tt ff pp rr dd 保留：双写只读一个音，确实是一个块。 */
const PEP_DIGRAPHS = ['ch', 'sh', 'th', 'ph', 'wh', 'ck', 'ng', 'qu',
  'oo', 'ee', 'ea', 'ai', 'ay', 'oa', 'ow', 'ou', 'oi', 'oy',
  'ar', 'or', 'er', 'ir', 'ur', 'au', 'ew', 'ei', 'eo', 'ie', 'ui', 'kn',
  'll', 'ss', 'tt', 'ff', 'pp', 'rr', 'dd'];
const EAR_NOT_IER = { bear: 1, wear: 1, pear: 1, learn: 1, early: 1, earth: 1, search: 1, heart: 1, swear: 1 };
/* 组合例外表：这些词在特定位置组合并不成立，命中也要跳过（回到逐字母诚实拆分）。
   - homework/bathroom：复合词边界（home|work、bath|room）上的 ew/thr 是假组合
   - laugh/laughed/because：au 在这些词读 /ɑː/、/ɒ/，不教 /ɔː/ 主音
   - science/scientist/worried/heavier/view/alien：ie 不是标准组合（拉丁前缀 / y→i 变形词）
   - direct：ire 分属两个音节；building：ui 特读 /ɪ/ */
const COMBO_EXC = {
  homework: ['ew'], bathroom: ['thr'],
  laugh: ['au'], laughed: ['au'], because: ['au'],
  science: ['ie'], scientist: ['ie'], worried: ['ie'], heavier: ['ie'], view: ['ie'], alien: ['ie'],
  direct: ['ire'], building: ['ui'],
  /* 全库扫描第二轮补录：ui 特读（biscuit /ɪ/、guide /aɪ/、guitar /ɪ/、penguin /wɪ/） */
  biscuit: ['ui'], biscuits: ['ui'], guide: ['ui'], guitar: ['ui'], penguin: ['ui'],
  /* all 特读（balloon /əl/、alley /æl/） */
  balloon: ['all'], alley: ['all'],
  /* ie 特读（y→i 变形词 cherries/strawberries/veggie 读 /i/） */
  cherries: ['ie'], strawberries: ['ie'], veggie: ['ie'],
  /* 复合/派生边界的假组合（pine|apple 的 ea、side|walk 的 ew、some|one 的 eo） */
  pineapple: ['ea'], sidewalk: ['ew'], someone: ['eo'],
  /* ire 跨音节（di-rect、di-rec-tion、di-rec-tor） */
  direction: ['ire'], director: ['ire'],
  /* sew 特读 /səʊ/（不教 /suː/） */
  sew: ['ew'],
};
function splitBlocks(w) {
  /* ★ 2026-11-11.4：保留词库原始大小写。China / January / Monday 是专有
     名词，切块前若先 toLowerCase，孩子拼出来就是 china / january / monday。
     raw 与 s 等长（同样滤掉非字母），切片位置一一对应。 */
  const raw = String(w).replace(/[^A-Za-z]/g, '');
  const s = raw.toLowerCase();
  const exc = COMBO_EXC[s];
  let trigs = EAR_NOT_IER[s] ? PEP_TRIGRAPHS.filter(d => d !== 'ear') : PEP_TRIGRAPHS;
  let digs = PEP_DIGRAPHS;
  if (exc) {
    trigs = trigs.filter(d => !exc.includes(d));
    digs = digs.filter(d => !exc.includes(d));
  }
  const parts = [];
  let i = 0;
  while (i < s.length) {
    let hit = null;
    if (i + 4 <= s.length && s.startsWith('tion', i)) hit = 'tion';
    if (!hit && i + 3 <= s.length) hit = trigs.find(d => d !== 'tion' && s.startsWith(d, i)) || null;
    if (!hit) hit = digs.find(d => s.startsWith(d, i)) || null;
    const len = (hit || s[i]).length;
    parts.push(raw.slice(i, i + len));
    i += len;
  }
  return parts;
}
/* 短语/连字符词分段：'look after'→['look','after']，'o'clock'→['o','clock'] */
function splitPhrase(w) { return String(w).split(/[\s'’\-]+/).filter(Boolean); }
/* 词 → 拼读拆分展示串（按音）：look after → l · oo · k ／ a · f · t · er */
function phonicsLine(w) { return splitPhrase(w).map(p => splitBlocks(p).join(' · ')).join(' ／ '); }

/* ================= 音节切分（2026-11-11.11 / B2） =================
   用途：拆词（"按一口气读得出来分"）、跟读音节。
   与上面的 splitBlocks 不是一回事：那个切「音」，这个切「音节」。

   规则（最大音节首原则 MOP，也就是词典里 apple→ap·ple 那套）：
     1. 先把字母聚成单元：音素组合（ch/sh/ee/ai/igh…）算一个单元；
        其余每个字母一个单元。这样切出来的边界绝不会落在组合中间。
     2. 找元音单元 = 音节核。词尾的哑音 e（make/nine/table 的 e）不算核。
     3. 两个核之间的辅音串：从右边取**最长的合法音节首**（≤3 个单元），
        剩下的留给前一个音节的尾巴。
        · win|ter（nt 不是合法音节首，只能取 t）
        · ap|ple（pl 是合法音节首，取 pl，剩 p 给前面）
        · um|brel|la（br 合法；ll 取一个 l）
     4. -Cle 结尾（apple/table/little）：le 自成音节，由第 3 条自然得出。
     5. 兜底：切出没有元音的块就与前一块合并；最终拼接必须等于原词。 */
const SYL_ONSET2 = new Set(['pl', 'pr', 'bl', 'br', 'tr', 'dr', 'kl', 'kr', 'gl', 'gr',
  'fl', 'fr', 'sl', 'sw', 'sp', 'st', 'sk', 'sm', 'sn', 'tw', 'kw', 'dw', 'gw',
  'th', 'sh', 'ch', 'ph', 'wh', 'qu']);
const SYL_ONSET3 = new Set(['str', 'spr', 'skr', 'spl', 'skw', 'thr', 'shr']);
const SYL_CANT_START = new Set(['ck', 'ng']);      // 不能作音节首的组合
const SYL_VOWEL_DIGRAPH = ['eau', 'igh', 'air', 'ear', 'eer', 'ire', 'our', 'oor',
  'ea', 'ee', 'oo', 'ai', 'ay', 'oa', 'ow', 'ou', 'oi', 'oy', 'au', 'aw', 'ew',
  'ei', 'ie', 'ue', 'ui', 'eo', 'ar', 'or', 'er', 'ir', 'ur'];
const SYL_CONS_DIGRAPH = ['tch', 'dge', 'ch', 'sh', 'th', 'ph', 'wh', 'ck', 'ng', 'qu'];

function sylUnits(s) {
  /* 返回 [{t:'V'|'C', s:原文片段, i:起始下标}] */
  const out = [];
  let i = 0;
  while (i < s.length) {
    const rest = s.slice(i);
    const isVowelAt = c => 'aeiou'.includes(c);
    let hit = null, type = null;
    for (const d of SYL_VOWEL_DIGRAPH) if (rest.startsWith(d)) { hit = d; type = 'V'; break; }
    if (!hit) for (const d of SYL_CONS_DIGRAPH) if (rest.startsWith(d)) { hit = d; type = 'C'; break; }
    if (!hit) {
      const c = rest[0];
      if (isVowelAt(c)) { hit = c; type = 'V'; }
      else if (c === 'y') {
        /* y：词首或紧跟元音 → 辅音（yes / play 的 y 已在 ay 里）；其余当元音（happy 的 y） */
        const prev = s[i - 1] || '';
        const next = s[i + 1] || '';
        /* ⚠️ 不能只写 !isVowelAt(next)：''.includes('') 是 true，
           词尾的 y 会被误判成辅音（happy 就不切了）。 */
        const vowelLike = i > 0 && !isVowelAt(prev) && (next === '' || !isVowelAt(next));
        hit = c; type = vowelLike ? 'V' : 'C';
      } else { hit = c; type = 'C'; }
    }
    out.push({ t: type, s: hit, i });
    i += hit.length;
  }
  return out;
}

function sylIsLegalOnset(units) {
  const txt = units.map(u => u.s).join('');
  if (units.length === 1) {
    const u = units[0];
    if (u.t !== 'C') return false;
    if (SYL_CANT_START.has(u.s)) return false;
    if (u.s === 'x') return false;                 // x = /ks/，不能起头
    return true;
  }
  if (units.some(u => u.t !== 'C')) return false;
  if (units.length === 2) return SYL_ONSET2.has(txt);
  if (units.length === 3) return SYL_ONSET3.has(txt);
  return false;
}

/* 复合词：先按词根切，切不动再走音节规则（goodbye → good·bye） */
const SYL_COMPOUNDS = {
  goodbye: ['good', 'bye'], grandma: ['grand', 'ma'], grandpa: ['grand', 'pa'],
  grandfather: ['grand', 'father'], grandmother: ['grand', 'mother'],
  grandparent: ['grand', 'parent'], grandson: ['grand', 'son'],
  granddaughter: ['grand', 'daughter'], classroom: ['class', 'room'],
  classmate: ['class', 'mate'], homework: ['home', 'work'],
  housework: ['house', 'work'], bedroom: ['bed', 'room'], bathroom: ['bath', 'room'],
  playground: ['play', 'ground'], football: ['foot', 'ball'],
  basketball: ['basket', 'ball'], volleyball: ['volley', 'ball'],
  baseball: ['base', 'ball'], weekend: ['week', 'end'], weekday: ['week', 'day'],
  birthday: ['birth', 'day'], breakfast: ['break', 'fast'], afternoon: ['after', 'noon'],
  morning: ['morn', 'ing'], nothing: ['no', 'thing'], something: ['some', 'thing'],
  anything: ['any', 'thing'], everything: ['every', 'thing'], everybody: ['every', 'body'],
  everyone: ['every', 'one'], sometimes: ['some', 'times'], always: ['al', 'ways'],
  outside: ['out', 'side'], inside: ['in', 'side'], upstairs: ['up', 'stairs'],
  downstairs: ['down', 'stairs'], supermarket: ['super', 'market'],
  postoffice: ['post', 'office'], policeman: ['police', 'man'],
  firefighter: ['fire', 'fighter'], watermelon: ['water', 'melon'],
  pineapple: ['pine', 'apple'], strawberry: ['straw', 'berry'],
  blackboard: ['black', 'board'], whiteboard: ['white', 'board'],
  bookcase: ['book', 'case'], notebook: ['note', 'book'], storybook: ['story', 'book'],
  playgrounds: ['play', 'grounds'], bedroom2: ['bed', 'room'],
};

function splitSyllablesOnce(raw) {
  const s = raw.toLowerCase();
  /* -tion / -sion 是固定的一整个音节（/ʃən/），不按 ti·on 切。
     先摘掉尾巴再切前半，避免 station → sta·ti·on。 */
  if (s.length > 5 && /(tion|sion)$/.test(s)) {
    return splitSyllablesOnce(raw.slice(0, -4)).concat([raw.slice(-4)]);
  }
  const fixed = SYL_COMPOUNDS[s];
  if (fixed) {
    /* 用词根长度回切原文，保证大小写一致 */
    const out = [];
    let p = 0;
    for (const part of fixed) { out.push(raw.substr(p, part.length)); p += part.length; }
    if (out.join('') === raw) return out;
  }
  const units = sylUnits(s);
  /* 音节核：元音单元；词尾哑音 e 不算 */
  let nuclei = [];
  for (let k = 0; k < units.length; k++) {
    if (units[k].t !== 'V') continue;
    nuclei.push(k);
  }
  const lastU = units[units.length - 1];
  if (nuclei.length > 1 && lastU && lastU.t === 'V' && lastU.s === 'e') {
    /* 哑音 e：make / nine / table 的尾 e。table 的 le 另算（l 是响音） */
    const prev = units[units.length - 2];
    if (!(prev && prev.t === 'C' && prev.s === 'l')) nuclei = nuclei.slice(0, -1);
  }
  /* -Cle 结尾且 l 前只有一个辅音时，le 单独成一个音节核（syllabic l） */
  const mLe = /([^aeiou])le$/.exec(s);
  if (mLe) {
    /* -Cle 的尾音节核是 l 本身（syllabic l），把尾巴上的 e 从核里去掉，
       否则会切出 tabl·e / appl·e 这种。 */
    const lIdx = units.findIndex(u => u.i === s.length - 2);
    if (lIdx >= 0) {
      nuclei = nuclei.filter(k => k < lIdx);
      if (!nuclei.includes(lIdx)) nuclei.push(lIdx);
    }
  }
  nuclei = [...new Set(nuclei)].sort((a, b) => a - b);
  if (nuclei.length <= 1) return [raw];

  /* 计算每个音节的起始单元下标 */
  const starts = [0];
  for (let n = 0; n < nuclei.length - 1; n++) {
    const a = nuclei[n], b = nuclei[n + 1];
    const run = [];
    for (let k = a + 1; k < b; k++) run.push(units[k]);
    let onsetLen = 0;
    for (let take = Math.min(3, run.length); take >= 1; take--) {
      const cand = run.slice(run.length - take);
      if (sylIsLegalOnset(cand)) { onsetLen = take; break; }
    }
    starts.push(b - onsetLen);            // 音节从「音节首」的第一个单元开始
  }
  /* 按单元下标切原文 */
  const idx = starts.map(k => units[k].i).concat([raw.length]);
  const out = [];
  for (let k = 0; k < idx.length - 1; k++) {
    const piece = raw.slice(idx[k], idx[k + 1]);
    if (!piece) continue;
    /* 兜底：没有元音字母的块并入前一块 */
    if (!/[aeiouy]/i.test(piece) && out.length) out[out.length - 1] += piece;
    else out.push(piece);
  }
  return out.length ? out : [raw];
}

function splitSyllables(w) {
  return splitPhrase(w).reduce((acc, part) => acc.concat(splitSyllablesOnce(part)), []);
}
/* 词 → 音节展示串：apple → ap · ple */
function syllableLine(w) { return splitSyllables(w).join(' · '); }

/* ---- 复合词趣味记（自动拆分高置信复合词，补齐 PEP 特有词的记忆法） ---- */
const PEP_COMPOUNDS = {
  classmate: ['class 班级', 'mate 伙伴'], grandfather: ['grand 隔一代', 'father 爸爸'], grandmother: ['grand 隔一代', 'mother 妈妈'],
  grandparent: ['grand 隔一代', 'parent 父母'], 'red panda': ['red 红色', 'panda 熊猫'], classroom: ['class 班级', 'room 房间'],
  workbook: ['work 作业', 'book 本子'], homework: ['home 家', 'work 功课'], notebook: ['note 笔记', 'book 本子'],
  newspaper: ['news 新闻', 'paper 纸'], blackboard: ['black 黑色', 'board 板子'], football: ['foot 脚', 'ball 球'],
  basketball: ['basket 篮', 'ball 球'], 'bus stop': ['bus 公交', 'stop 站'], 'office worker': ['office 办公室', 'worker 工作者'],
  'factory worker': ['factory 工厂', 'worker 工作者'], 'delivery worker': ['delivery 快递', 'worker 工作者'],
  'police officer': ['police 警方', 'officer 官员'], firefighter: ['fire 火', 'fighter 战士'], snowman: ['snow 雪', 'man 人'],
  raincoat: ['rain 雨', 'coat 外衣'], sunglasses: ['sun 太阳', 'glasses 眼镜'], 'T-shirt': ['T 字形', 'shirt 衬衫'],
  'living room': ['living 起居', 'room 房间'], bedroom: ['bed 床', 'room 房间'], bathroom: ['bath 洗澡', 'room 房间'],
  supermarket: ['super 超级', 'market 市场'], 'green bean': ['green 绿色', 'bean 豆'], chopstick: ['chop 戳', 'stick 棍'],
  hamburger: ['ham 火腿', 'burger 包'], 'ice cream': ['ice 冰', 'cream 奶油'], 'pocket money': ['pocket 口袋', 'money 钱'],
  schoolbag: ['school 学校', 'bag 包'], 'space station': ['space 太空', 'station 站'], 'outer space': ['outer 外面', 'space 太空'],
  'air conditioner': ['air 空气', 'conditioner 调节器'], 'runny nose': ['runny 流水的', 'nose 鼻子'],
  'dining hall': ['dining 用餐', 'hall 大厅'], 'gingerbread house': ['ginger 姜', 'bread 面包', 'house 房子'],
  'book fair': ['book 书', 'fair 集市'], 'count down': ['count 数', 'down 向下'], 'save up': ['save 存', 'up 起来'],
  'stay up': ['stay 待着', 'up 不躺'], 'run out': ['run 跑', 'out 光了'], 'make the bed': ['make 铺', 'bed 床'],
  'look after': ['look 看', 'after 后面'], 'look up': ['look 查', 'up 向上'], 'turn off': ['turn 拧', 'off 关掉'],
  'hand out': ['hand 递', 'out 出去'], 'get together': ['get 聚', 'together 在一起'],
  'hard-working': ['hard 努力', 'working 工作'], hometown: ['home 家', 'town 镇'], sunshine: ['sun 太阳', 'shine 照耀'],
  waterfall: ['water 水', 'fall 落下'], 'piggy bank': ['piggy 小猪', 'bank 罐'], 'go hiking': ['go 去', 'hiking 徒步'],
  'go cycling': ['go 去', 'cycling 骑行'], 'went camping': ['went 去（过去式）', 'camping 露营'], 'went fishing': ['went 去（过去式）', 'fishing 钓鱼'],
  'took pictures': ['took 拍（过去式）', 'pictures 照片'], 'had a cold': ['had 得了（过去式）', 'a cold 感冒'],
  month: ['moon 月亮', 'th 名词后缀'], astronaut: ['astro 星星', 'naut 航行者'], taikonaut: ['taikong 太空', 'naut 航行者'],
  underground: ['under 地下', 'ground 地面'], 'ping-pong': ['乒 ping', 'pong 乓'], 'ice-skate': ['ice 冰', 'skate 滑'],
  'Eiffel Tower': ['Eiffel 埃菲尔（人名）', 'Tower 塔'], 'Beijing opera': ['Beijing 北京', 'opera 戏剧'],
  'Mount Taishan': ['Mount 山峰', 'Taishan 泰山'], 'Dragon Boat Festival': ['Dragon 龙', 'Boat 船', 'Festival 节'],
  'Labour Day': ['Labour 劳动', 'Day 节日'], 'National Day': ['National 国家', 'Day 节日'], maybe: ['may 可能', 'be 是'],
  everyday: ['every 每个', 'day 天'], today: ['to = 今（古义）', 'day 天'], weekend: ['week 周', 'end 末尾'],
  birthday: ['birth 诞生', 'day 日子'], sometimes: ['some 有些', 'times 次'], seafood: ['sea 海', 'food 食物'],
  hotpot: ['hot 热的', 'pot 锅'], toothpaste: ['tooth 牙齿', 'paste 膏'], toothbrush: ['tooth 牙齿', 'brush 刷子'],
  someone: ['some 某个', 'one 人'], anything: ['any 任何', 'thing 东西'], everything: ['every 每个', 'thing 东西'],
  nothing: ['no 没有', 'thing 东西'], internet: ['inter 互相', 'net 网'],
};

/* ---- 词性查询：显式表(pep-mem.js) → 词库借用 → 词形规则 ---- */
function pepPosKey(w) {
  /* 词性查询：显式表 → 词库借用 → 词形规则 → 名词兜底 */
  const s = String(w.w || w).toLowerCase();
  for (const k in PEP_POS) { if (PEP_POS[k].indexOf(s) >= 0) return k; }
  if (typeof GRADES !== 'undefined') {
    for (const g of GRADES) for (const t of g.themes) for (const x of t.words) {
      if (x.w.toLowerCase() === s) return (x.pos || t.pos || 'n');
    }
  }
  if (/ed$/.test(s) && s.length > 4) return 'v';
  if (/ing$/.test(s) && s.length > 5) return 'v';
  return 'n';
}

/* 音标查询：补充表 → ipa.js 借用（返回裸音标，不含斜杠） */
function pepIpaOf(w) {
  /* ★ 2026-11-08 修两个 bug（用户截图 Thursday 没音标 / start 有字没斜杠）：
     ① 大小写不敏感——原来只用 toLowerCase() 查，PEP_IPA 和 ipa.js 的键是
        「Thursday」（大写 T），小写查两边都落空 → 音标整行没了。
     ② 不许剥斜杠——原来 replace(/^\/+|\/+$/g,'') 把 /stɑrt/ 剥成 stɑrt，
        看起来像把单词又打一遍。PEP_IPA 的值本身不带斜杠，所以统一在这包一层：
        输出永远是 /…/ 一对斜杠，显示端直接印。 */
  const raw = String(w.w || w);
  const s = raw.toLowerCase();
  const cap = s.charAt(0).toUpperCase() + s.slice(1);
  let v = PEP_IPA[raw] || PEP_IPA[s] || PEP_IPA[cap] || '';
  if (!v && typeof ipaOf === 'function') {
    try { v = String(ipaOf(raw) || ''); } catch (e) { v = ''; }
  }
  if (!v) return '';
  v = String(v).trim().replace(/^\/+|\/+$/g, '');
  return v ? '/' + v + '/' : '';
}

/* ---- 记忆法借用：单词镇词库同名词的 dec（记法） ---- */
let __wordDecMap = null;
function pepDecOf(w) {
  const s = String(w.w || w).toLowerCase();
  if (!__wordDecMap) {
    __wordDecMap = {};
    try { GRADES.forEach(g => g.themes.forEach(t => t.words.forEach(x => { if (x.dec) __wordDecMap[x.w] = x.dec; }))); } catch (e) {}
  }
  return __wordDecMap[s] || '';
}

/* 记忆法查询链：词库 dec 借用 → PEP_MEM 精写 → 复合词自动拆 → 无
   （大小写双查：Wednesday 这类首字母大写的词表词也能命中） */
function pepMemOf(w) {
  const raw = String(w.w || w);
  const key = raw.toLowerCase();
  const borrowed = pepDecOf(w);
  if (borrowed) return borrowed;
  if (PEP_MEM[key]) return PEP_MEM[key];
  if (PEP_MEM[raw]) return PEP_MEM[raw];
  const parts = PEP_COMPOUNDS[key] || PEP_COMPOUNDS[raw];
  if (Array.isArray(parts) && parts.length >= 2) {
    return parts.join(' + ') + ' = ' + (w.zh || '');
  }
  return '';
}
