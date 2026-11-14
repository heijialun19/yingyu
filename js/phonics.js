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
   th 补充说明：/θ/ 是轻咬舌尖、声带不振动的清音；the / this 里的 th 是浊音 /ð/，
   那些词在词族里走整体认读，不教错。 */
const PH_BLOCKS = [
  { b: 'sh', ipa: '/ʃ/',  tip: 'sh 发 /ʃ/（「嘘——」）',       g: 'c', words: [] },
  { b: 'ch', ipa: '/tʃ/', tip: 'ch 发 /tʃ/（「吃——」）',      g: 'c', words: ['chair', 'peach', 'teacher'] },
  { b: 'th', ipa: '/θ/',  tip: 'th 发 /θ/（轻咬舌尖吐气，声带不振动）', g: 'c', words: ['thin','think','three'],
    note: 'th 有两种声音：这里的 /θ/ 轻咬舌尖、声带不振动（think、thin）；the、this 里是浊音 /ð/（舌尖位置一样，但声带振动），那些词先整体认读。' },
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
  { name: 'th · /θ/', id: 'th', sounds: ['th'], tip: 'th 发 /θ/（轻咬舌尖吐气，声带不振动）', words: ['teeth','thumb','third','thin','birthday'],
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
  /* ---- 2026-11-14.9 增补（科学次序补齐，追加在末尾不打乱旧索引） ----
     对标系统拼读标准次序（CVC → 双辅音 → 连缀 → 元音组合 → 魔法 e → r 控制元音，
     同 NRP / Rose Report / 瑞格叔叔五级体系）：
     · ng 补进双辅音（两个字母一个音）；
     · 辅音连缀 l/r/s 新开第 ⑤ 站：两个辅音**各自出声**连着读——与双辅音正好相反。
       元音必须与字母音吻合才给 segs：from/front 的 o 实读 /ʌ/、blue 的 ue、
       snow 的 ow、snake/smile 的魔法 e 都拼不出正确音——宁可不进词族，也不给错音；
       young（ou 不是短 u）、along（首音 schwa）走整体认读。
     · u_e 补齐魔法 e；ir 补齐卷舌音。 */
  { name: 'ng · /ŋ/', id: 'ng', sounds: ['ng'], tip: 'ng 发 /ŋ/（鼻子哼「嗯」）',
    words: ['sing','king','thing','bring','spring','young','along'],
    segs: { sing:['s','i','ng'], king:['k','i','ng'], thing:['th','i','ng'], bring:['b','r','i','ng'],
            spring:['s','p','r','i','ng'] } },
  { name: 'l 连缀 · 两个音', id: 'blends-l', sounds: [], rule: '连缀没有「一块」的音——每个字母都出声，连着读',
    tip: 'fl / pl / bl / cl：l 和前面的辅音连着读，两个音都出声',
    words: ['flag','plan','black','clock','play'],
    segs: { flag:['f','l','a','g'], plan:['p','l','a','n'], black:['b','l','a','ck'],
            clock:['c','l','o','ck'], play:['p','l','ay'] } },
  { name: 'r 连缀 · 两个音', id: 'blends-r', sounds: [], rule: '连缀没有「一块」的音——每个字母都出声，连着读',
    tip: 'cr / dr / fr / gr / tr：r 和前面的辅音连着读，两个音都出声',
    words: ['crab','drum','dress','frog','fresh','trip','truck','grass'],
    segs: { crab:['c','r','a','b'], drum:['d','r','u','m'], dress:['d','r','e','s','s'], frog:['f','r','o','g'],
            fresh:['f','r','e','sh'], trip:['t','r','i','p'], truck:['t','r','u','ck'], grass:['g','r','a','s','s'] } },
  { name: 's 连缀 · 两个音', id: 'blends-s', sounds: [], rule: '连缀没有「一块」的音——每个字母都出声，连着读',
    tip: 'st / sw / sk：s 和后面的辅音连着读，两个音都出声',
    words: ['stop','swim','swing','skirt','strong'],
    segs: { stop:['s','t','o','p'], swim:['s','w','i','m'], swing:['s','w','i','ng'],
            skirt:['s','k','ir','t'], strong:['s','t','r','o','ng'] } },
  { name: 'u_e · /uː/、/juː/', id: 'u_e', sounds: [], tip: 'u 加哑巴 e，u 念本名', words: ['cute','use','rule'] },
  { name: 'ir · /ɜːr/', id: 'ir', sounds: ['ir'], tip: 'ir 发 /ɜːr/（卷舌）',
    words: ['bird','girl','shirt','skirt','sir'],
    segs: { bird:['b','ir','d'], girl:['g','ir','l'], shirt:['sh','ir','t'], skirt:['s','k','ir','t'], sir:['s','ir'] } },
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

/* 整词发音：站内单词 mp3（和拼读闯关「🔊 听这个词」同一标准音）。
   ★ 视觉词 a / an 必须走弱读文件：audio/a.mp3 是字母岛的字母名 /eɪ/，
   直接读就成了「诶」。weak_a / weak_an 是同一说话人的 schwa 音素。 */
function phPlayWord(w) {
  const t = String(w).trim();
  const low = t.toLowerCase();
  speak((low === 'a' || low === 'an') ? 'weak_' + low : t);
}

/* 卡片点击发音：比 phPlayWord 多一个按压音效（沿用 speakWord 的手感） */
function phSpeakWord(w) {
  sfx.pop();
  phPlayWord(w);
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

/* ================= 视觉词 / 可解码短文 / 听音能写（2026-11-14.10） =================
   ★ 全部自研：词表按「不规则、或用到还没教的规则」自行挑选并自写解析；
     短文全部自编句，不搬运任何教材、词表品牌或竞品的原文与编排。
   ★ 音频策略与全站一致：优先站内 mp3，缺文件走设备语音（绝不静默失败）；
     字母音 / 拼读块仍只走 audio/phonics/ 母语者录音（发音铁律不变）。 */

/* 视觉词（高频整体认读词）：先整体认住，学到对应规则再回头「认领」。
   ipa 为常用读音（弱读另行注明）；note 讲清「为什么不按字母直接拼」。 */
const SIGHT_WORDS = [
  { w: 'the',  ipa: '/ðə/',  zh: '这个；那个', note: 'th 是浊音 /ð/；a 弱读 /ə/（元音前读 /ði/）' },
  { w: 'said', ipa: '/sed/', zh: '说',        note: 'ai 在这里不读 /eɪ/，读 /e/——不规则' },
  { w: 'you',  ipa: '/juː/', zh: '你；你们',   note: 'ou 在这里读 /uː/' },
  { w: 'one',  ipa: '/wʌn/', zh: '一',        note: 'o 读 /ʌ/，还多了个 w 的音' },
  { w: 'two',  ipa: '/tuː/', zh: '二',        note: 'w 不发音，o 读 /uː/' },
  { w: 'was',  ipa: '/wʌz/', zh: '是（过去）',  note: 'a 读 /ʌ/，不是 /æ/也不是本名' },
  { w: 'is',   ipa: '/ɪz/',  zh: '是',        note: '词尾 s 在这里读 /z/，不是 /s/！' },
  { w: 'has',  ipa: '/hæz/', zh: '有（三单）',  note: '词尾 s 在这里读 /z/，不是 /s/！' },
  { w: 'were', ipa: '/wɜːr/', zh: '是（过去）', note: 'e 不读 /e/，整词读 /wɜːr/' },
  { w: 'come', ipa: '/kʌm/', zh: '来',        note: '魔法 e 例外！o 读 /ʌ/，不读本名' },
  { w: 'some', ipa: '/sʌm/', zh: '一些',      note: '魔法 e 例外！o 读 /ʌ/，不读本名' },
  { w: 'have', ipa: '/hæv/', zh: '有',        note: '魔法 e 例外！a 读 /æ/，不读本名' },
  { w: 'do',   ipa: '/duː/', zh: '做',        note: 'o 读 /uː/，不是 /ɑ/' },
  { w: 'does', ipa: '/dʌz/', zh: '做（三单）',  note: 'o 读 /ʌ/，词尾 es 读 /z/' },
  { w: 'of',   ipa: '/ʌv/',  zh: '……的',      note: 'o 读 /ʌ/，f 读 /v/！' },
  { w: 'to',   ipa: '/tuː/', zh: '到；向',     note: 'o 读 /uː/（弱读时是 /tə/）' },
  { w: 'a',    ipa: '/ə/',   zh: '一（个）',   note: '不定冠词弱读 /ə/，不是字母音 /æ/，也不是本名 /eɪ/' },
  { w: 'are',  ipa: '/ɑːr/', zh: '是',        note: 'a 读 /ɑːr/，整体认读' },
  { w: 'they', ipa: '/ðeɪ/', zh: '他们',      note: 'th 是浊音 /ð/，ey 读 /eɪ/' },
  { w: 'them', ipa: '/ðem/', zh: '他们（宾格）', note: 'th 是浊音 /ð/，不是咬舌不振动的 /θ/' },
  { w: 'this', ipa: '/ðɪs/', zh: '这个',      note: 'th 是浊音 /ð/，不是 /θ/' },
  { w: 'that', ipa: '/ðæt/', zh: '那个',      note: 'th 是浊音 /ð/，不是 /θ/' },
  { w: 'there', ipa: '/ðer/', zh: '那里',     note: 'th 是浊音 /ð/，ere 整体认读' },
  { w: 'what', ipa: '/wʌt/', zh: '什么',      note: 'a 读 /ʌ/，不是 /æ/' },
  { w: 'where', ipa: '/wer/', zh: '哪里',     note: 'wh 读 /w/，ere 不按字母音读' },
  { w: 'who',  ipa: '/huː/', zh: '谁',        note: 'wh 在这里读 /h/！' },
  { w: 'why',  ipa: '/waɪ/', zh: '为什么',     note: 'y 在词尾当元音读 /aɪ/（还没学 y）' },
  { w: 'he',   ipa: '/hiː/', zh: '他',        note: 'e 在词尾读本名 /iː/（开音节）' },
  { w: 'she',  ipa: '/ʃiː/', zh: '她',        note: 'sh 读 /ʃ/，e 在词尾读本名 /iː/' },
  { w: 'we',   ipa: '/wiː/', zh: '我们',      note: 'e 在词尾读本名 /iː/（开音节）' },
  { w: 'my',   ipa: '/maɪ/', zh: '我的',      note: 'y 在词尾当元音读 /aɪ/（还没学 y）' },
  { w: 'out',  ipa: '/aʊt/', zh: '外面',      note: 'ou 读 /aʊ/（还没学这个组合）' },
  { w: 'now',  ipa: '/naʊ/', zh: '现在',      note: 'ow 读 /aʊ/（还没学这个组合）' },
  { w: 'all',  ipa: '/ɔːl/', zh: '全部',      note: 'a 在这里读 /ɔː/，不是 /æ/' },
  { w: 'her',  ipa: '/hɜːr/', zh: '她的',     note: 'er 读 /ɜːr/（卷舌，还没学 er）' },
];

/* 可解码短文（全部自编句）：只用「已教规则可拼的词 + 上面的视觉词」。
   tags 标注用到的规则，便于家长知道这句在练什么。 */
const DECODE_SENTENCES = [
  { s: 'The fish can swim.',        zh: '这条鱼会游泳。',    tags: '视觉词 the · 短元音 a、i · sh · 连缀 sw' },
  { s: 'A frog can jump.',          zh: '一只青蛙会跳。',    tags: '视觉词 a · 连缀 fr · 短元音 o、u' },
  { s: 'The bird can sing.',        zh: '这只鸟会唱歌。',    tags: '视觉词 the · 卷舌音 ir · ng · 短元音 a、i' },
  { s: 'My dog can run.',           zh: '我的狗会跑。',      tags: '视觉词 my · 短元音 a、o、u' },
  { s: 'We play in the rain.',      zh: '我们在雨里玩。',    tags: '视觉词 we/the · 连缀 pl · ai · 短元音 i' },
  { s: 'The sun is hot.',           zh: '太阳很热。',        tags: '视觉词 the/is · 短元音 u、o' },
  { s: 'See the green tree.',       zh: '看那棵绿树。',      tags: '视觉词 the · ee · 连缀 gr' },
  { s: 'He can see the moon.',      zh: '他能看见月亮。',    tags: '视觉词 he/the · oo · 短元音 a' },
  { s: 'She has a red hen.',        zh: '她有一只红母鸡。',  tags: '视觉词 she/has/a · sh · 短元音 e' },
  { s: 'The cake is on the plate.', zh: '蛋糕在盘子上。',    tags: '视觉词 the/is · 魔法 e · 短元音 o' },
];

/* 听音能写（拼写编码）词表：3-4 个字母、站内有音频、字母级可拼。
   含少量 4 字母词（milk/fish/ship/duck/desk/frog/drum/flag/plan/jump）。 */
const SPELL_WORDS = ['cat','hat','man','pen','hen','ten','pig','big','six','dog','hot','fox','bus','sun','run','cup','map','van','bag','leg','bed','red','milk','fish','ship','shop','duck','desk','frog','drum','flag','plan','jump'];

/* ================= 分级闯关体系（2026-11-14.14） =================
   对标国际主流 SSP 分级思路（Jolly Phonics 七组音素顺序 / Letters and Sounds
   六阶段 / Oxford Phonics World 五级）：学 → 拼 → 读句 → 小挑战，一关一屏。
   · 字母音按「最能先拼出词」分 4 批（s a t i p n 起步，b / d 分批不打架）；
   · 可解码句按「用到的最难规则」挂到对应关卡，视觉词随句早批引入、第 8 关全表认读；
   · 仅新增数据，PHONICS / SIGHT_WORDS / DECODE_SENTENCES 原形状不动
     （games.html / index.html 共用，向后兼容）。 */

const PH_L1_BATCHES = [
  { title: '第 1 批 · 起步六音', hint: 's a t i p n——学完这 6 个，sat / pin / tap 就能拼！', letters: ['s', 'a', 't', 'i', 'p', 'n'] },
  { title: '第 2 批 · 再来七个', hint: 'cat / red / hen 都会拼了', letters: ['c', 'k', 'e', 'h', 'r', 'm', 'd'] },
  { title: '第 3 批 · 又是六个', hint: 'dog / sun / bag / frog 出场', letters: ['g', 'o', 'u', 'l', 'f', 'b'] },
  { title: '第 4 批 · 收尾七个', hint: 'b 和 d 分开学，不打架', letters: ['j', 'v', 'w', 'y', 'z', 'x', 'q'] },
];

const PH_LEVELS = [
  { id: 'L1', icon: '🔤', name: '字母音启蒙', kind: 'letters',
    goal: '26 个字母在单词里的声音——见字母就想音',
    intro: '字母<b>名</b>是它的名字（A 读 /eɪ/），字母<b>音</b>是它在单词里的声音（a 读 /æ/）——自然拼读学的是<b>声音</b>。分 4 批学，点字母卡听音，点小词听例词。想看象形小故事去 <a href="letters.html" style="color:var(--lake)">字母岛 →</a>',
    goals: ['听得出 26 个字母音', '分清字母名和字母音', '听例词找到开头音'] },
  { id: 'L2', icon: '🧱', name: '短元音拼读', kind: 'words',
    goal: '元音发短音，c-a-t 一拼就会',
    intro: '元音发短音，一个一个音拼起来就是词：c + a + t → cat。点<b>蓝块</b>听单个音，点「🔊 拼一拼」先逐音、后整词——整词发音是唯一的标准音。',
    goals: ['听出 5 个短元音', '拼出 cat / hen / pig 这样的词', '读 2 句可解码小句'],
    fams: ['short-a', 'short-e', 'short-i', 'short-o', 'short-u'],
    sight: ['the', 'a', 'is', 'my'],
    sents: ['My dog can run.', 'The sun is hot.'] },
  { id: 'L3', icon: '🧩', name: '双辅音', kind: 'words',
    goal: '两个字母一个音：sh 不是 s+h，就是一声「嘘」',
    intro: 'sh / ch / th / ck / ng 都是「两个字母，<b>一个音</b>」，把它们当<b>一整块</b>拼进词里。（连缀正好相反：两个字母<b>两个音</b>，都出声——下一关见。）',
    goals: ['把 sh/ch/th/ck/ng 当一整块认', '拼 fish / chick 这类词', '读 1 句可解码小句'],
    fams: ['sh', 'ch', 'th', 'ck', 'ng'],
    sight: ['he', 'she', 'has'],
    sents: ['She has a red hen.'] },
  { id: 'L4', icon: '🔗', name: '辅音连缀', kind: 'words',
    goal: '两个辅音各自出声、连着读',
    intro: 'fl / pl / bl、cr / dr / fr、st / sw / sk……和双辅音<b>正好相反</b>：两个辅音<b>各自出声</b>、连着读（f-l、c-r、s-t），中间不停。逐块听一遍再连读。',
    goals: ['分清「一个音」和「两个音」', '连读 fl / pl / cr / st', '读 2 句可解码小句'],
    fams: ['blends-l', 'blends-r', 'blends-s'],
    sight: [],
    sents: ['The fish can swim.', 'A frog can jump.'] },
  { id: 'L5', icon: '🌈', name: '元音组合', kind: 'words',
    goal: '两个元音手拉手，发一个长音',
    intro: '两个元音字母手拉手发一个长音：ee 长「衣」、oo 长「乌」、ai / ay 都是 /eɪ/、oa 是 o 的本名。',
    goals: ['认出 ee/oo/ai-ay/oa 的长音', '拼 rain / moon / boat', '读 3 句可解码小句'],
    fams: ['ee', 'oo', 'ai-ay', 'oa'],
    sight: ['we'],
    sents: ['See the green tree.', 'He can see the moon.', 'We play in the rain.'] },
  { id: 'L6', icon: '🪄', name: '魔法 e', kind: 'words',
    goal: '结尾的 e 不出声，让元音念本名',
    intro: '结尾的 e <b>不出声</b>，它像个小魔法师，让前面的元音念自己的<b>本名</b>：a_e 读 /eɪ/、i_e 读 /aɪ/、o_e 读 /oʊ/、u_e 读 /uː/（或 /juː/）。这些词先<b>整体认读</b>（硬拆成 c-a-k-e 会读错）。',
    goals: ['知道「哑巴 e」的魔法', '整体认读 cake / kite / nose', '读 1 句可解码小句'],
    fams: ['a_e', 'i_e', 'o_e', 'u_e'],
    sight: [],
    sents: ['The cake is on the plate.'] },
  { id: 'L7', icon: '🐻', name: '卷舌音', kind: 'words',
    goal: 'r 跟着元音一起卷舌头',
    intro: 'r 跟着元音一起卷舌头：ar /ɑːr/、or /ɔːr/，还有 ir /ɜːr/（bird、girl、third）。',
    goals: ['听出 ar/or/ir 的卷舌音', '拼 car / horse / bird', '读 1 句可解码小句'],
    fams: ['ar', 'or', 'ir'],
    sight: [],
    sents: ['The bird can sing.'] },
  { id: 'L8', icon: '⭐', name: '视觉词', kind: 'sight',
    goal: '35 个高频词，先整体认住',
    intro: '这些词太常用了，而且<b>不按规则出牌</b>（或用到还没学的规则）——先整个认住、听音就懂，学到对应规则再回头「认领」它们。点词听音，📌 提示讲「为什么不按字母拼」。',
    goals: ['整体认读 35 个视觉词', '知道「为什么不按字母拼」', '听音就能认词'],
    sightBatches: [
      { title: '第 1 批 · 最先认', words: ['the', 'a', 'is', 'my', 'he', 'she', 'we', 'you', 'are', 'they', 'this', 'that'] },
      { title: '第 2 批 · 很常用', words: ['said', 'one', 'two', 'was', 'has', 'were', 'come', 'some', 'have', 'do', 'does', 'of', 'to'] },
      { title: '第 3 批 · 也要会', words: ['them', 'there', 'what', 'where', 'who', 'why', 'out', 'now', 'all', 'her'] },
    ] },
  { id: 'L9', icon: '✍️', name: '听音能写', kind: 'spell',
    goal: '反过来练：听声音，把字母按顺序点出来',
    intro: '反过来练：<b>听声音，把字母按顺序点出来</b>。词都来自前面的词族——会拼读了，拼写也会。点错了点字母格可以退回去。',
    goals: ['听音拆出字母', '按顺序拼出 3-4 字母词', '拿下拼写小达人'] },
  { id: 'TX', icon: '🧰', name: '工具箱', kind: 'toolbox',
    goal: '拼读块速查 + 规则彩蛋，随查随听',
    intro: '13 个拼读块的<b>速查表</b>，学到哪查到哪。不在清单里的字母组合这里<b>不发声</b>——宁可不响，也不教错。',
    goals: ['查任意拼读块的音', '记住 c/g 软音等彩蛋规则'] },
];

window.PHONICS = PHONICS;
window.PH_EXTRA = PH_EXTRA;
window.PH_BLOCKS = PH_BLOCKS;
window.PH_BLEND_OK = PH_BLEND_OK;
window.SIGHT_WORDS = SIGHT_WORDS;
window.DECODE_SENTENCES = DECODE_SENTENCES;
window.SPELL_WORDS = SPELL_WORDS;
window.PH_L1_BATCHES = PH_L1_BATCHES;
window.PH_LEVELS = PH_LEVELS;

