/* ================= js/phonics.js · 自然拼读数据与发音助手 =================
   唯一真相源，三方共用：
     · phonics.html  拼读课（七大站：字母音 → 拼读块 → 词族拼读）
     · index.html    首页「自然拼读」专栏
     · games.html    拼读闯关游戏（只取 PHONICS / PH_BLEND_OK）

   ★ 发音铁律（2026-11-08 事故，详见 VERSION.md，不要再踩）：
     · 字母音与拼读块只走 audio/phonics/（母语者录音，s5s5/phonics，MIT），
       URL 由 app.js 的 phonicsURL() 给，版本号 PHONICS_VER 独立管。
     · 绝不要把 "sh" 之类丢给 TTS 合成：espeak 会念成字母名 "S H"。
     · 不在 PH_BLEND_OK 的多字母块一律不发声 —— 宁可不响，也不放错音。
     · 本文件里的音标与 tip 是「拼读闯关」教学文案的同源副本，
       改这里 = 游戏与拼读课一起变，不要单边改。

   ★ 数据形状（PHONICS 每个词族）：
     id     课程站位用的稳定键（short-a / sh / a_e / ai-ay …）
     name   词族名，形如 'short a · /æ/'（游戏标题栏直接显示）
     sounds 这个词族的「代表音」块，可点按发音；[] 表示没有单块录音
            （a_e/i_e/o_e 是规则，硬凑单块音会教错）
     tip    一句话教学提示（游戏与课里逐字一致）
     words  词族词表（全部取自 999 词库，有图有声）
     segs   词的手工分块，用于逐音拼读；**不在 segs 里的词只做整体认读**
            （rabbit / egg / shoe / 魔法 e 系……硬拼会把 cake 读成 /kæke/）
   ====================================================================== */

/* 有母语者录音的 13 个多字母块（26 个单字母另有录音，不受此表限制）。
   不在集合里的多字母块一律不发声 —— 宁可不响，也不放错音。
   ⚠️ 绝不要给不在 audio/phonics/ 里的字符串走 localAudioURL()：
      TTS 会把 "sh" 念成字母名 "S H"（2026-11-08 踩过）。 */
const PH_BLEND_OK = new Set(['sh', 'ch', 'th', 'ai', 'ay', 'oa', 'ck', 'ee', 'oo', 'ar', 'or', 'ir', 'ng']);

/* 13 个拼读块的讲解（拼读课「第 2 站」用）。
   tip 与下面 PHONICS 词族里的同名块逐字一致；ng / ir 在词族里只当分块出现，
   这里给它们单独的讲解。example 词全部在 999 词库（有图有声）。
   th 补充说明：/θ/ 是轻轻吐舌的清音；the / this 里的 th 是浊音 /ð/，
   那些词在词族里走整体认读，不教错。 */
const PH_BLOCKS = [
  { b: 'sh', ipa: '/ʃ/',  tip: 'sh 发 /ʃ/（「嘘——」）',       g: 'c', words: [] },
  { b: 'ch', ipa: '/tʃ/', tip: 'ch 发 /tʃ/（「吃——」）',      g: 'c', words: ['chair', 'peach', 'teacher'] },
  { b: 'th', ipa: '/θ/',  tip: 'th 轻轻吐舌',                  g: 'c', words: [],
    note: 'th 在 the、this 里是另一种声音（浊音 /ð/），那些词先整体认读。' },
  { b: 'ck', ipa: '/k/',  tip: 'ck 发 /k/（和字母 k 一样）',   g: 'c', words: ['chicken'] },
  { b: 'ng', ipa: '/ŋ/',  tip: 'ng 发 /ŋ/（鼻子哼「嗯」）',    g: 'c', words: ['sing', 'long', 'young'] },
  { b: 'ee', ipa: '/iː/', tip: 'ee 发 /iː/（长「衣」）',       g: 'v', words: [] },
  { b: 'oo', ipa: '/uː/', tip: 'oo 发 /uː/（长「乌」）',       g: 'v', words: [] },
  { b: 'ai', ipa: '/eɪ/', tip: 'ai 发 /eɪ/（和 ay 一样）',     g: 'v', words: [] },
  { b: 'ay', ipa: '/eɪ/', tip: 'ay 发 /eɪ/（和 ai 一样）',     g: 'v', words: ['today', 'away'] },
  { b: 'oa', ipa: '/oʊ/', tip: 'oa 发 /oʊ/',                   g: 'v', words: [] },
  { b: 'ar', ipa: '/ɑːr/', tip: 'ar 发 /ɑːr/（卷舌）',        g: 'v', words: ['garden', 'market'] },
  { b: 'or', ipa: '/ɔːr/', tip: 'or 发 /ɔːr/（卷舌）',        g: 'v', words: ['horse', 'short'] },
  { b: 'ir', ipa: '/ɜːr/', tip: 'ir 发 /ɜːr/（卷舌）',        g: 'v', words: ['bird', 'girl'] },
];

/* ---- 词族（与拼读闯关逐字同源；含游戏修订史，改数据前先读完） ----
   词族来自 Get Smart 各册 Phonics 线，词全部取自词库（有图有声）。

   ★ 2026-11-08 第三次修订。前两版的坑（都写在 VERSION.md 里，别再踩）：
     ① 把 sh/ch/th/ai/ay/oa/ck 当「词」丢给 TTS，espeak 对不认识的串会逐字母念字母名
        （sh → "S H"、ck → "C K"），拼读闯关里三分之一的题在教错。
     ② 槽位数 = 手工切的分块数，孩子按常规拼写（clock = c-l-o-c-k）第 5 块点不进去，
        正确答案被判错。
   现在的修法：
     · 全部块音换成母语者录音（GitHub s5s5/phonics，MIT，见 THIRD-PARTY-NOTICES.txt），
       放在 audio/phonics/，和字母音同一套文件，PHONICS_VER 统一管。
     · 2026-11-14.7：king 的分块 ['k','i','n','g'] → ['k','i','ng']。原切法把 /ŋ/
       拆成 n+g 两块逐音读，与 morning 的 ng 块不一致；判卷按字母串不受影响。
     · 干扰块按「单词里出现过的字母」排除（clock 的 c、k 不能当干扰项），
       正常拼写不会被判错；判卷比「拼出来的字母串 === 单词」，不比切法。 */

const PHONICS = [
  { name: 'short a · /æ/', id: 'short-a', sounds: ['a'], tip: 'a 发 /æ/（大嘴「哎」）', words: ['cat','hat','man','van','bag','ant','map','hand','fan','rabbit','sand','camp'],
    segs: { cat:['c','a','t'], hat:['h','a','t'], man:['m','a','n'], van:['v','a','n'], bag:['b','a','g'],
            ant:['a','n','t'], map:['m','a','p'], hand:['h','a','n','d'], fan:['f','a','n'],
            sand:['s','a','n','d'], camp:['c','a','m','p'] } },
  { name: 'short e · /e/', id: 'short-e', sounds: ['e'], tip: 'e 发 /e/（小嘴「哎」）', words: ['pen','hen','ten','desk','bed','leg','egg','tent','vest','red'],
    segs: { pen:['p','e','n'], hen:['h','e','n'], ten:['t','e','n'], desk:['d','e','s','k'], bed:['b','e','d'],
            leg:['l','e','g'], tent:['t','e','n','t'], vest:['v','e','s','t'], red:['r','e','d'] } },
  { name: 'short i · /ɪ/', id: 'short-i', sounds: ['i'], tip: 'i 发 /ɪ/（短「衣」）', words: ['pig','big','six','fish','milk','ship','sit','fin','pink','king'],
    segs: { pig:['p','i','g'], big:['b','i','g'], six:['s','i','x'], fish:['f','i','sh'],
            milk:['m','i','l','k'], ship:['sh','i','p'], sit:['s','i','t'], fin:['f','i','n'],
            pink:['p','i','n','k'], king:['k','i','ng'] } },
  { name: 'short o · /ɑ/', id: 'short-o', sounds: ['o'], tip: 'o 发 /ɑ/（张嘴「啊」）', words: ['box','fox','dog','hot','stop','clock','rock','shop','doctor'],
    segs: { box:['b','o','x'], fox:['f','o','x'], dog:['d','o','g'], hot:['h','o','t'], stop:['s','t','o','p'],
            clock:['c','l','o','ck'], rock:['r','o','ck'], shop:['sh','o','p'] } },
  { name: 'short u · /ʌ/', id: 'short-u', sounds: ['u'], tip: 'u 发 /ʌ/（短「啊」）', words: ['bus','sun','run','duck','cup','jump','truck','gum','hut'],
    segs: { bus:['b','u','s'], sun:['s','u','n'], run:['r','u','n'], duck:['d','u','ck'], cup:['c','u','p'],
            jump:['j','u','m','p'], truck:['t','r','u','ck'], gum:['g','u','m'], hut:['h','u','t'] } },
  { name: 'sh · /ʃ/', id: 'sh', sounds: ['sh'], tip: 'sh 发 /ʃ/（「嘘——」）', words: ['ship','fish','sheep','shelf','brush','wash','shop','shoe'],
    segs: { ship:['sh','i','p'], fish:['f','i','sh'], sheep:['sh','ee','p'], shelf:['sh','e','l','f'],
            brush:['b','r','u','sh'], shop:['sh','o','p'] } },
  { name: 'ch · /tʃ/', id: 'ch', sounds: ['ch'], tip: 'ch 发 /tʃ/（「吃——」）', words: ['chair','peach','lunch','catch','teacher','chess'],
    segs: { lunch:['l','u','n','ch'], catch:['c','a','t','ch'], chess:['ch','e','s','s'] } },
  { name: 'th · /θ/', id: 'th', sounds: ['th'], tip: 'th 轻轻吐舌', words: ['teeth','thumb','third','thin','birthday'],
    segs: { teeth:['t','ee','th'], thin:['th','i','n'], third:['th','ir','d'], birthday:['b','ir','th','d','ay'] } },
  { name: 'a_e · /eɪ/', id: 'a_e', sounds: [], tip: 'a 加哑巴 e，a 念本名', words: ['cake','lake','name','plate','grape','whale','gate','game'] },
  { name: 'i_e · /aɪ/', id: 'i_e', sounds: [], tip: 'i 加哑巴 e，i 念本名', words: ['kite','bike','nine','white','ice','five','rice','time'] },
  { name: 'o_e · /oʊ/', id: 'o_e', sounds: [], tip: 'o 加哑巴 e，o 念本名', words: ['nose','rose','home','bone','stone','rope'] },
  { name: 'ee · /iː/', id: 'ee', sounds: ['ee'], tip: 'ee 发 /iː/（长「衣」）', words: ['see','tree','bee','three','green','sleep','feet','week'],
    segs: { see:['s','ee'], tree:['t','r','ee'], bee:['b','ee'], three:['th','r','ee'],
            green:['g','r','ee','n'], sleep:['s','l','ee','p'], feet:['f','ee','t'], week:['w','ee','k'] } },
  { name: 'oo · /uː/', id: 'oo', sounds: ['oo'], tip: 'oo 发 /uː/（长「乌」）', words: ['moon','food','zoo','spoon','room','afternoon'],
    segs: { moon:['m','oo','n'], food:['f','oo','d'], zoo:['z','oo'], spoon:['s','p','oo','n'], room:['r','oo','m'] } },
  { name: 'ai/ay · /eɪ/', id: 'ai-ay', sounds: ['ai','ay'], tip: 'ai / ay 都发 /eɪ/', words: ['rain','tail','train','paint','day','play','away','today'],
    segs: { rain:['r','ai','n'], tail:['t','ai','l'], train:['t','r','ai','n'], paint:['p','ai','n','t'],
            day:['d','ay'], play:['p','l','ay'] } },
  { name: 'oa · /oʊ/', id: 'oa', sounds: ['oa'], tip: 'oa 发 /oʊ/', words: ['boat','coat','goat','road'],
    segs: { boat:['b','oa','t'], coat:['c','oa','t'], goat:['g','oa','t'], road:['r','oa','d'] } },
  { name: 'ar · /ɑːr/', id: 'ar', sounds: ['ar'], tip: 'ar 发 /ɑːr/（卷舌）', words: ['car','star','farm','arm','garden','market'],
    segs: { car:['c','ar'], star:['s','t','ar'], farm:['f','ar','m'], arm:['ar','m'] } },
  { name: 'or · /ɔːr/', id: 'or', sounds: ['or'], tip: 'or 发 /ɔːr/（卷舌）', words: ['fork','horse','short','sport','morning'],
    segs: { fork:['f','or','k'], sport:['s','p','or','t'], morning:['m','or','n','i','ng'] } },
  { name: 'ck · /k/', id: 'ck', sounds: ['ck'], tip: 'ck 发 /k/（和字母 k 一样）', words: ['duck','clock','rock','black','chicken'],
    segs: { duck:['d','u','ck'], clock:['c','l','o','ck'], rock:['r','o','ck'], black:['b','l','a','ck'] } },
];

/* ---- 词族里不在 999 主词库的词（Get Smart Phonics 线的 25 个词） ----
   这些词人教/Get Smart 课本词表里有、主词库没有。中文释义前 19 个**照抄课本数据**
   （pep-data.js / getsmart-data.js，程序抽取不手翻），vest/king/gum/hut/thumb/gate
   六个课本词表也没有，按小学词义补：vest 背心 / king 国王 / gum 口香糖 /
   hut 小屋 / thumb 大拇指 / gate 大门。图标用 emoji 图库（Twemoji）里的字形。
   音频：19 个有站内 mp3；那 6 个词包里没有，点读走设备语音兜底（站内既定策略：
   没有对应文件时用系统语音，绝不静默失败）。页面页脚已注明。 */
const PH_EXTRA = {
  fan: { zh: '风扇', e: '\u{1F32C}\uFE0F' }, tent: { zh: '帐篷', e: '\u26FA' },
  vest: { zh: '背心', e: '\u{1F9BA}' }, sit: { zh: '坐', e: '\u{1FA91}' },
  fin: { zh: '鳍', e: '\u{1F41F}' }, king: { zh: '国王', e: '\u{1F451}' },
  box: { zh: '盒子', e: '\u{1F4E6}' }, gum: { zh: '口香糖', e: '\u{1F36C}' },
  hut: { zh: '小屋', e: '\u{1F6D6}' }, shelf: { zh: '架子', e: '\u{1F5C4}\uFE0F' },
  chess: { zh: '国际象棋', e: '\u265F\uFE0F' }, teeth: { zh: '牙齿', e: '\u{1F9B7}' },
  thumb: { zh: '大拇指', e: '\u{1F44D}' }, third: { zh: '第三', e: '3\uFE0F\u20E3' },
  thin: { zh: '瘦的', e: '\u{1F4CF}' }, gate: { zh: '大门', e: '\u{1F6AA}' },
  time: { zh: '时间', e: '\u23F0' }, bone: { zh: '骨头', e: '\u{1F9B4}' },
  rope: { zh: '绳；粗绳', e: '\u{1FAA2}' }, feet: { zh: '脚', e: '\u{1F463}' },
  room: { zh: '房间', e: '\u{1F6CB}\uFE0F' }, afternoon: { zh: '下午', e: '\u{1F307}' },
  tail: { zh: '尾巴', e: '\u{1F415}' }, sport: { zh: '体育运动', e: '\u26BD' },
  morning: { zh: '早上', e: '\u{1F305}' },
};

/* ================= 发音助手（拼读课 / 首页专栏共用） ================= */

/* 这个块有没有可靠录音：单字母 → 26 个字母音；多字母 → 只认 PH_BLEND_OK。
   返回 '' 表示「宁可不响」。 */
function phBlockURL(b) {
  const k = String(b == null ? '' : b).toLowerCase().trim();
  if (!k) return '';
  if (typeof phonicsURL !== 'function') return '';
  if (k.length === 1 && /^[a-z]$/.test(k)) return phonicsURL(k);
  return PH_BLEND_OK.has(k) ? phonicsURL(k) : '';
}

/* 单块发音（点按拼读块 / 字母音卡片） */
function phPlayBlock(b) {
  const u = phBlockURL(b);
  if (u) playAudioChain([u]);
}

/* 整词发音：站内单词 mp3（和拼读闯关「🔊 听这个词」同一标准音） */
function phPlayWord(w) {
  speak(String(w).trim());
}

/* 逐音拼读：块音一个一个来（中间留空隙），最后一个音落下后用整词标准音收尾。
   和拼读闯关的教学口径一致——整词发音始终是唯一标准音。 */
function phBlendWord(word, segs) {
  const list = (segs || []).map(phBlockURL);
  if (!list.length || list.some(u => !u)) { phPlayWord(word); return; }
  playAudioChain(list, () => phPlayWord(word), 420);
}

/* 某个块的例词：先扫 PHONICS.segs 里真用到这个块的词，再补 PH_BLOCKS.words。
   返回词字符串列表；页面侧用 ALLW 过滤有图有声的。 */
function phBlockExamples(b) {
  const k = String(b).toLowerCase();
  const out = [];
  PHONICS.forEach(f => {
    const segs = f.segs || {};
    Object.keys(segs).forEach(w => {
      if (segs[w].some(x => String(x).toLowerCase() === k) && out.indexOf(w) < 0) out.push(w);
    });
  });
  const me = PH_BLOCKS.find(x => x.b === k);
  if (me && me.words) me.words.forEach(w => { if (out.indexOf(w) < 0) out.push(w); });
  return out;
}

/* 词族里「可逐音拼读」的词（每块都有可靠录音），与游戏 phBlendable 同口径 */
function phBlendableWord(f, w) {
  const seg = (f.segs || {})[w.w];
  return !!(seg && seg.length) && seg.every(b => !!phBlockURL(b));
}

window.PHONICS = PHONICS;
window.PH_EXTRA = PH_EXTRA;
window.PH_BLOCKS = PH_BLOCKS;
window.PH_BLEND_OK = PH_BLEND_OK;
