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
const PH_BLEND_OK = new Set(['sh', 'ch', 'th', 'ai', 'ay', 'oa', 'ck', 'ee', 'oo', 'ar', 'or', 'ir', 'ng',
  /* 2026-11-25.15：11 个补录音素 + 派生 /ʒ/，与 pep-points 的 PBX_BLEND_OK 保持同一份清单。 */
  'oo_short', 'i_long', 'ow', 'oi', 'th_v', 'schwa', 'ear', 'air', 'tion', 'sion', 'u_e', 'zh']);

/* ================= 2026-11-24.6 长词切分（用户：「单词很长的你都弄整体认读，不能切分么？」）=================
   一、同一发音的另一种写法（同音异拼）
      bb/dd/ff… 双写只发一个音；wh 读 /w/；ea/ie 读 /iː/；ue 读 /uː/；ge/dge 读 /dʒ/；词尾 le 读 /l/。
      拼读课 L10「同音异拼」教的就是这件事，所以这里用同一套录音，不算「放错音」。
   二、PH_EXTRA_SEGS：原先没写切分的单音节词，按块补上（plate = p-l-a-t-e 这种魔法 e 词）。
   三、PH_SYL：多音节词按音节切开（rab·bit）。音节本身不做独立录音——孤立音节合成容易读成
      「重读版」（sister 的 -ter 会被读成 /tɜːr/），所以音节只做**视觉切分 + 点一下听整词**，
      教学上先记 rab、再记 bit，最后合起来，不额外发明读音。
*/
const PH_ALIAS = {
  bb: 'b', cc: 'c', dd: 'd', ff: 'f', gg: 'g', ll: 'l', mm: 'm', nn: 'n',
  pp: 'p', rr: 'r', ss: 's', tt: 't', zz: 'z',
  ea: 'ee', ie: 'ee', ue: 'oo',
  wh: 'w', le: 'l', ge: 'j', dge: 'j',
};

/* 单音节词的补切分。⚠️ 词尾不发音的 e（Magic E）一律不进这里：
   cake 按 c-a-k-e 拼会被读成 /kæ-ke/，这正是「魔法 e 不逐字母拼」的那条铁律。
   所以 plate / grape / whale / white / stone / horse / nurse 这些保持整体认读 + 规则说明。 */
const PH_EXTRA_SEGS = {
  peach: ['p','ea','ch'],      /* ea 读 /iː/，与 ee 同音 */
  chess: ['ch','e','ss'],      /* 双写 ss 只发一个 /s/ */
  dress: ['d','r','e','ss'],
  grass: ['g','r','a','ss'],
  clean: ['c','l','ea','n'],
  short: ['sh','or','t'],
};
/* 说明：happy/candy/sunny/funny/story 的词尾 y 读 /i/，而 audio/phonics/y.mp3 是字母音 /waɪ/，
   直接切进去会读成「haep-wai」——这类词一律走音节切分（hap·py / can·dy / sto·ry），不按块拼。
   nurse / sister 的 ur、er 是 r 音节，块里没有对应录音，也走音节切分。 */

/* 多音节词的音节切分（教学用：先记第一段，再记第二段） */
const PH_SYL = {
  August: ['Au','gust'], Australia: ['Aus','tra','lia'],
  Thursday: ['Thurs','day'], Tuesday: ['Tues','day'],
  afternoon: ['af','ter','noon'], autumn: ['au','tumn'],
  because: ['be','cause'], birthday: ['birth','day'],
  brother: ['broth','er'], chicken: ['chick','en'],
  doctor: ['doc','tor'], family: ['fam','i','ly'],
  father: ['fa','ther'], flower: ['flow','er'],
  garden: ['gar','den'], gentle: ['gen','tle'],
  giraffe: ['gi','raffe'], market: ['mar','ket'],
  morning: ['morn','ing'], mother: ['moth','er'],
  orange: ['or','ange'], pencil: ['pen','cil'],
  purple: ['pur','ple'], rabbit: ['rab','bit'],
  review: ['re','view'], sister: ['sis','ter'],
  statue: ['stat','ue'], strawberry: ['straw','ber','ry'],
  teacher: ['teach','er'], turtle: ['tur','tle'],
  window: ['win','dow'], yellow: ['yel','low'],
  happy: ['hap','py'], candy: ['can','dy'],
  sunny: ['sun','ny'], funny: ['fun','ny'],
  story: ['sto','ry'], water: ['wa','ter'],
  tiger: ['ti','ger'], paper: ['pa','per'],
  magic: ['mag','ic'], today: ['to','day'],
  along: ['a','long'], about: ['a','bout'],
  potato: ['po','ta','to'], tomato: ['to','ma','to'],
  banana: ['ba','na','na'], elephant: ['el','e','phant'],
  animal: ['an','i','mal'], hospital: ['hos','pi','tal'],
  holiday: ['hol','i','day'],
};
window.PH_ALIAS = PH_ALIAS;
window.PH_EXTRA_SEGS = PH_EXTRA_SEGS;
window.PH_SYL = PH_SYL;
/* ================= 字母音的中文提示（2026-11-15 / 第三轮复检 N12） =================
   字母岛 data.js 的 szh 是「象形故事 + 拼音对照」，给的是汉字谐音（丝/特/泼/讷）。
   那套写法在字母岛的语境里没问题，但拼读课 L1 教的是**音素本身**：
   /s/ /t/ /p/ 是清辅音，只有气流没有元音；照「丝/特/泼」读出来就是 si/te/po，
   后面拼 cat 会变成 si-a-te。这里改用口型/气流描述，并逐条写明「别读成 X」。
   元音保留口型描述（大嘴、短促），不用汉字注音。 */
const PH_LETTER_HINT = {
  a: { desc:'张大嘴、舌尖放低，短促「哎」', warn:'' },
  b: { desc:'双唇闭合再放开，声带振动', warn:'别读成完整的「波」，后面不加元音' },
  c: { desc:'舌根抵住软腭，一下放开，只送气', warn:'别读成完整的「次」，c 在 cat 里是 /k/' },
  d: { desc:'舌尖顶上齿龈再放开，声带振动', warn:'别读成完整的「得」，后面不加元音' },
  e: { desc:'嘴巴半开，短促「哎」', warn:'' },
  f: { desc:'上齿轻咬下唇，气流擦出来，不振动', warn:'别读成完整的「夫」，只出气' },
  g: { desc:'舌根抵软腭，声带振动', warn:'别读成完整的「哥」，后面不加元音' },
  h: { desc:'张嘴轻轻哈气，声带不振动', warn:'别读成完整的「喝」，只是一口气' },
  i: { desc:'嘴角微张，短促「衣」，别拖长', warn:'' },
  j: { desc:'舌面贴上颚再放开，声带振动', warn:'别读成完整的「基」' },
  k: { desc:'舌根抵软腭，一下放开，只送气', warn:'别读成完整的「科」，后面不加元音' },
  l: { desc:'舌尖抵上齿龈，气从舌两边出来', warn:'别读成完整的「勒」' },
  m: { desc:'双唇闭合，气从鼻子出来，声带振动', warn:'别读成完整的「摸」' },
  n: { desc:'舌尖抵上齿龈，气从鼻子出来，声带振动', warn:'别读成完整的「讷」' },
  o: { desc:'嘴巴张大、嘴唇放松不圆，短促「啊」', warn:'别读成完整的「袄」（双元音）或「喔」（那是字母名）' },
  p: { desc:'双唇闭合再突然打开，只送气', warn:'别读成完整的「泼」，双唇一开就停' },
  q: { desc:'q 常和 u 手拉手，/k/ + /w/ 连着读', warn:'qu 要连着读 /kw/，别拆成「阔」一个音' },
  r: { desc:'舌尖卷起、不碰上颚，声带振动', warn:'别读成完整的「若」' },
  s: { desc:'舌尖靠近上齿龈，气流从缝里擦出，不振动', warn:'别读成完整的「丝」，只有气流没有元音' },
  t: { desc:'舌尖顶上齿龈，憋一下再放开，不振动', warn:'别读成完整的「特」，后面不加元音' },
  u: { desc:'嘴巴放松半开，短促「厄」，别张太大', warn:'别读成完整的「啊」，那是 short o /ɑ/' },
  v: { desc:'上齿轻咬下唇，声带要振动', warn:'别读成完整的「乌」（/w/），和 /f/ 差在声带振动' },
  w: { desc:'双唇撅圆，再快速放开', warn:'别读成完整的「大不留」，那是字母名' },
  x: { desc:'x 在词尾常读 /ks/，两个音连着', warn:'别读成完整的「克思」两个音节' },
  y: { desc:'舌面抬向硬腭，声带振动', warn:'别读成完整的「歪」，那是字母名' },
  z: { desc:'舌尖靠近上齿龈，气流擦出且声带振动', warn:'别读成完整的「资」，/z/ 要振动' },
};


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
  { b: 'ee', ipa: '/i/', tip: 'ee 发 /i/（长「衣」）',       g: 'v', words: [] },
  { b: 'oo', ipa: '/u/', tip: 'oo 发 /u/（长「乌」）',       g: 'v', words: [] },
  { b: 'ai', ipa: '/eɪ/', tip: 'ai / ay 都发 /eɪ/',     g: 'v', words: [] },
  { b: 'ay', ipa: '/eɪ/', tip: 'ai / ay 都发 /eɪ/',     g: 'v', words: ['today', 'away'] },
  { b: 'oa', ipa: '/oʊ/', tip: 'oa 发 /oʊ/',                   g: 'v', words: [] },
  { b: 'ar', ipa: '/ɑr/', tip: 'ar 发 /ɑr/（卷舌）',        g: 'v', words: ['garden', 'market'] },
  { b: 'or', ipa: '/ɔr/', tip: 'or 发 /ɔr/（卷舌）',        g: 'v', words: ['horse', 'short'] },
  { b: 'ir', ipa: '/ɜr/', tip: 'ir 发 /ɜr/（卷舌）',        g: 'v', words: ['bird', 'girl'] },
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
  { name: 'short o · /ɑ/', id: 'short-o', sounds: ['o'], tip: 'o 发 /ɑ/（张嘴短「啊」，别读成完整的「袄」或「喔」）', words: ['box','fox','dog','hot','stop','clock','rock','shop','doctor'],
    note: 'dog、long、soft 这类词受美音 LOT–CLOTH 影响读 /ɔ/，仍属同一个短音家族；音标表里也这么标。',
    segs: { box:['b','o','x'], fox:['f','o','x'], dog:['d','o','g'], hot:['h','o','t'], stop:['s','t','o','p'],
            clock:['c','l','o','ck'], rock:['r','o','ck'], shop:['sh','o','p'] } },
  { name: 'short u · /ʌ/', id: 'short-u', sounds: ['u'], tip: 'u 发 /ʌ/（短促「厄」，嘴半开）', words: ['bus','sun','run','duck','cup','jump','truck','gum','hut'],
    segs: { bus:['b','u','s'], sun:['s','u','n'], run:['r','u','n'], duck:['d','u','ck'], cup:['c','u','p'],
            jump:['j','u','m','p'], truck:['t','r','u','ck'], gum:['g','u','m'], hut:['h','u','t'] } },
  { name: 'sh · /ʃ/', id: 'sh', sounds: ['sh'], tip: 'sh 发 /ʃ/（「嘘——」）', words: ['ship','fish','sheep','shelf','brush','wash','shop','shoe'],
    segs: { ship:['sh','i','p'], fish:['f','i','sh'], sheep:['sh','ee','p'], shelf:['sh','e','l','f'],
            brush:['b','r','u','sh'], shop:['sh','o','p'] } },
  { name: 'ch · /tʃ/', id: 'ch', sounds: ['ch'], tip: 'ch 发 /tʃ/（「吃——」）', words: ['chair','peach','lunch','catch','teacher','chess'],
    segs: { lunch:['l','u','n','ch'], catch:['c','a','t','ch'] } },
  { name: 'th · /θ/', id: 'th', sounds: ['th'], tip: 'th 发 /θ/（轻咬舌尖吐气，声带不振动）', words: ['teeth','thumb','third','thin','birthday'],
    note: 'th 有两种声音：这里的 /θ/ 轻咬舌尖、声带不振动（think、thin）；the、this 里是浊音 /ð/（舌尖位置一样，但声带振动），那些词先整体认读。',
    segs: { teeth:['t','ee','th'], thin:['th','i','n'], third:['th','ir','d'], birthday:['b','ir','th','d','ay'] } },
  { name: 'a_e · /eɪ/', id: 'a_e', sounds: [], tip: 'a 加哑巴 e，a 念本名', words: ['cake','lake','name','plate','grape','whale','gate','game'] },
  { name: 'i_e · /aɪ/', id: 'i_e', sounds: [], tip: 'i 加哑巴 e，i 念本名', words: ['kite','bike','nine','white','ice','five','rice','time'] },
  { name: 'o_e · /oʊ/', id: 'o_e', sounds: [], tip: 'o 加哑巴 e，o 念本名', words: ['nose','rose','home','bone','stone','rope'] },
  { name: 'ee · /i/', id: 'ee', sounds: ['ee'], tip: 'ee 发 /i/（长「衣」）', words: ['see','tree','bee','three','green','sleep','feet','week'],
    segs: { see:['s','ee'], tree:['t','r','ee'], bee:['b','ee'], three:['th','r','ee'],
            green:['g','r','ee','n'], sleep:['s','l','ee','p'], feet:['f','ee','t'], week:['w','ee','k'] } },
  { name: 'oo · /u/', id: 'oo', sounds: ['oo'], tip: 'oo 发 /u/（长「乌」）', words: ['moon','food','zoo','spoon','room','afternoon'],
    note: 'oo 多数读长音 /u/（moon、food）；book、look、good 里读短音 /ʊ/，遇到先整体认读。',
    segs: { moon:['m','oo','n'], food:['f','oo','d'], zoo:['z','oo'], spoon:['s','p','oo','n'], room:['r','oo','m'] } },
  { name: 'ai/ay · /eɪ/', id: 'ai-ay', sounds: ['ai','ay'], tip: 'ai / ay 都发 /eɪ/', words: ['rain','tail','train','paint','day','play','away','today'],
    segs: { rain:['r','ai','n'], tail:['t','ai','l'], train:['t','r','ai','n'], paint:['p','ai','n','t'],
            day:['d','ay'], play:['p','l','ay'] } },
  { name: 'oa · /oʊ/', id: 'oa', sounds: ['oa'], tip: 'oa 发 /oʊ/', words: ['boat','coat','goat','road'],
    segs: { boat:['b','oa','t'], coat:['c','oa','t'], goat:['g','oa','t'], road:['r','oa','d'] } },
  { name: 'ar · /ɑr/', id: 'ar', sounds: ['ar'], tip: 'ar 发 /ɑr/（卷舌）', words: ['car','star','farm','arm','garden','market'],
    segs: { car:['c','ar'], star:['s','t','ar'], farm:['f','ar','m'], arm:['ar','m'] } },
  { name: 'or · /ɔr/', id: 'or', sounds: ['or'], tip: 'or 发 /ɔr/（卷舌）', words: ['fork','horse','short','sport','morning'],
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
    segs: { crab:['c','r','a','b'], drum:['d','r','u','m'], frog:['f','r','o','g'],
            fresh:['f','r','e','sh'], trip:['t','r','i','p'], truck:['t','r','u','ck'],  } },
  { name: 's 连缀 · 两个音', id: 'blends-s', sounds: [], rule: '连缀没有「一块」的音——每个字母都出声，连着读',
    tip: 'st / sw / sk：s 和后面的辅音连着读，两个音都出声',
    words: ['stop','swim','swing','skirt','strong'],
    segs: { stop:['s','t','o','p'], swim:['s','w','i','m'], swing:['s','w','i','ng'],
            skirt:['s','k','ir','t'], strong:['s','t','r','o','ng'] } },
  { name: 'u_e · /u/、/ju/', id: 'u_e', sounds: [], tip: 'u 加哑巴 e：多数读 /ju/（cute、use），r 后面读 /u/（rule）', words: ['cute','use','rule'] },
  { name: 'ir · /ɜr/', id: 'ir', sounds: ['ir'], tip: 'ir 发 /ɜr/（卷舌）',
    words: ['bird','girl','shirt','skirt','sir'],
    segs: { bird:['b','ir','d'], girl:['g','ir','l'], shirt:['sh','ir','t'], skirt:['s','k','ir','t'], sir:['s','ir'] } },
  /* ---- 2026-11-20.2 增补：Phase 5 剩下的写法（17 个规则族） ----
     ★ 这些块（ea / igh / ou / ow / oi / oy / er / ur / au / aw / ew / ue / y /
       软音 c / 软音 g / 不发音字母）站内**没有母语者单音录音**，按发音铁律
       绝不能用 TTS 顶替（espeak 会把 ea 念成字母名 E A）。
     所以整族走「规则卡 + 关键词 + 整词」：sounds 留空、不给 segs（不切块），
     每个词都有站内整词 mp3——孩子听的是真词，不是机器音。
     关键词 key 用来听这个音在真实单词里的样子；将来补了块录音，
     再给 sounds 加上、给 segs 切块即可，数据形状不变。 */
  { name: 'ea · /i/', id: 'ea', sounds: [], key: 'eat',
    rule: 'ea 多数读 /i/（长「衣」）—— eat、tea 里的音',
    note: 'ea 也有例外：head /hed/、bread /bred/、bear /ber/ 读 /e/；这些遇到先整体认读。',
    words: ['eat','tea','sea','read','peach','leaf','clean','teacher'] },
  { name: 'igh · /aɪ/', id: 'igh', sounds: [], key: 'night',
    rule: 'igh 读 /aɪ/（「爱」）—— gh 不发音，i 念本名',
    note: 'eight /eɪt/、neighbour 里的 eigh 读 /eɪ/，不是 /aɪ/——别混。',
    words: ['night','light','right','high','tight'] },
  { name: 'ou · /aʊ/', id: 'ou', sounds: [], key: 'house',
    rule: 'ou 常读 /aʊ/（「嗷」）—— house、mouse 里的音',
    note: 'ou 花样最多：you /u/、four /ɔr/、young /ʌ/、soup /u/ —— 这几个先整体认读。',
    words: ['house','mouse','mouth','out','cloud','round','loud','about'] },
  { name: 'ow · /aʊ/', id: 'ow-au', sounds: [], key: 'cow',
    rule: 'ow 有两个音：cow、now 里读 /aʊ/（「嗷」）',
    note: '同一个 ow，在 snow、window 里却读 /oʊ/ —— 下一族就是它。',
    words: ['cow','now','how','down','town','brown','flower'] },
  { name: 'ow · /oʊ/', id: 'ow-oh', sounds: [], key: 'snow',
    rule: 'ow 的第二个音：snow、window 里读 /oʊ/（「欧」）',
    note: '判断口诀：词尾的 ow 多是 /oʊ/（snow、yellow），词中/短词多是 /aʊ/（down、how）。',
    words: ['snow','window','yellow','show','slow','grow'] },
  { name: 'oi / oy · /ɔɪ/', id: 'oi-oy', sounds: [], key: 'boy',
    rule: 'oi 和 oy 都读 /ɔɪ/（「奥衣」连读）—— boy、toy 里的音',
    note: 'oy 常在词尾（boy、toy），oi 常在词中（choice）；读音完全一样。',
    words: ['boy','toy','choice'] },
  { name: 'er · /ər/', id: 'er', sounds: [], key: 'teacher',
    rule: '词尾的 er 读轻声 /ər/（「儿」化）—— teacher、water 结尾的音',
    note: '重读的 her 才读 /ɜr/；teacher /ˈtitʃər/、water /ˈwɔtər/ 是轻声。',
    words: ['teacher','water','sister','brother','father','mother','tiger','paper'] },
  { name: 'ur · /ɜr/', id: 'ur', sounds: [], key: 'nurse',
    rule: 'ur 读 /ɜr/（卷舌「厄」）—— 和 ir 同音',
    note: 'nurse、turn、purple 的 ur 和 bird 的 ir 是同一个音，写法不同。',
    words: ['nurse','purple','turtle','hurt','Thursday'] },
  { name: 'au · /ɔ/', id: 'au', sounds: [], key: 'autumn',
    rule: 'au 多读 /ɔ/（圆唇「奥」）—— autumn、August 里的音',
    note: '美音 /ɔ/ 略带卷舌，英音更接近 /ɔː/；because /bɪˈkɔz/ 也是这个音。',
    words: ['autumn','August','because','Australia'] },
  { name: 'aw · /ɔ/', id: 'aw', sounds: [], key: 'draw',
    rule: 'aw 也读 /ɔ/ —— draw、yawn 里的音，和 au 同音',
    note: 'au 和 aw 读音一样，只是出现的位置不同（au 多在词中，aw 多在词尾）。',
    words: ['draw','yawn','strawberry','law'] },
  { name: 'ew · /ju/、/u/', id: 'ew', sounds: [], key: 'new',
    rule: 'ew 在 n / f 后面读 /ju/（new、few），其他时候读 /u/',
    note: 'news /njuz/ 是 /ju/；blew、grew 是 /u/（本站词库暂时没有这两个词）。',
    words: ['new','few','news','review'] },
  { name: 'ue · /u/', id: 'ue', sounds: [], key: 'blue',
    rule: 'ue 读 /u/（长「乌」）—— blue、true 里的音',
    note: 'continue /kənˈtɪnju/ 里的 ue 读 /ju/，是例外。',
    words: ['blue','glue','true','statue','Tuesday'] },
  { name: 'y 结尾 · /aɪ/', id: 'y-ai', sounds: [], key: 'my',
    rule: '单音节词尾的 y 读 /aɪ/（「爱」）—— my、fly、sky',
    note: 'y 在词尾当元音用，不是辅音 /j/。',
    words: ['my','why','fly','sky','cry','try'] },
  { name: 'y 结尾 · /i/', id: 'y-i', sounds: [], key: 'happy',
    rule: '多音节词尾的 y 读 /i/（长「衣」）—— happy、baby',
    note: '前面音节多、y 不重读时读 /i/；单音节才读 /aɪ/。',
    words: ['happy','baby','candy','sunny','funny','family','story'] },
  { name: '软音 c · /s/', id: 'soft-c', sounds: [], key: 'city',
    rule: 'c 在 e / i / y 前读 /s/（city、ice），其他时候读 /k/（cat）',
    note: 'ice、rice、face 的 c 都在词尾的 e 前，所以读 /s/，不读 /k/。',
    words: ['city','ice','rice','face','dance','juice','pencil'] },
  { name: '软音 g · /dʒ/', id: 'soft-g', sounds: [], key: 'giraffe',
    rule: 'g 在 e / i / y 前常读 /dʒ/（giraffe、magic）',
    note: '但 get、give、girl、gift 仍读 /g/——这几个要单独记。',
    words: ['giraffe','orange','bridge','magic','fridge','change','gentle'] },
  { name: '不发音字母', id: 'silent', sounds: [], key: 'knife',
    rule: '有些字母在词里不出声：knife 的 k、write 的 w、comb 的 b、hour 的 h',
    note: 'igh / light 里的 gh 也不发音（L8 学过）；eight 的 gh 同样不出声。',
    words: ['knee','know','knife','write','wrong','climb','comb','hour'] },
];

/* ---- 词族里不在 999 主词库的词（Get Smart Phonics 线的 26 个词） ----
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
  night: { zh: '夜晚', e: '\u{1F319}' },
};

/* ================= 发音助手（拼读课 / 首页专栏共用） ================= */

/* 这个块有没有可靠录音：单字母 → 26 个字母音；多字母 → 只认 PH_BLEND_OK。
   返回 '' 表示「宁可不响」。 */
function phBlockURL(b) {
  const k = String(b == null ? '' : b).toLowerCase().trim();
  if (!k) return '';
  if (typeof phonicsURL !== 'function') return '';
  if (k.length === 1 && /^[a-z]$/.test(k)) return phonicsURL(k);
  if (PH_BLEND_OK.has(k)) return phonicsURL(k);
  /* 同音异拼：双写辅音、wh、ea/ie、ue、ge/dge、词尾 le 都借同音的那个录音 */
  const alias = PH_ALIAS[k];
  return alias ? phonicsURL(alias) : '';
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
  { w: 'you',  ipa: '/ju/', zh: '你；你们',   note: 'ou 在这里读 /u/' },
  { w: 'one',  ipa: '/wʌn/', zh: '一',        note: 'o 读 /ʌ/，还多了个 w 的音' },
  { w: 'two',  ipa: '/tu/', zh: '二',        note: 'w 不发音，o 读 /u/' },
  { w: 'was',  ipa: '/wʌz/', zh: '是（过去）',  note: 'a 读 /ʌ/，不是 /æ/也不是本名' },
  { w: 'is',   ipa: '/ɪz/',  zh: '是',        note: '词尾 s 在这里读 /z/，不是 /s/！' },
  { w: 'has',  ipa: '/hæz/', zh: '有（三单）',  note: '词尾 s 在这里读 /z/，不是 /s/！' },
  { w: 'were', ipa: '/wɜr/', zh: '是（过去）', note: 'e 不读 /e/，整词读 /wɜr/' },
  { w: 'come', ipa: '/kʌm/', zh: '来',        note: '魔法 e 例外！o 读 /ʌ/，不读本名' },
  { w: 'some', ipa: '/sʌm/', zh: '一些',      note: '魔法 e 例外！o 读 /ʌ/，不读本名' },
  { w: 'have', ipa: '/hæv/', zh: '有',        note: '魔法 e 例外！a 读 /æ/，不读本名' },
  { w: 'do',   ipa: '/du/', zh: '做',        note: 'o 读 /u/，不是 /ɑ/' },
  { w: 'does', ipa: '/dʌz/', zh: '做（三单）',  note: 'o 读 /ʌ/，词尾 es 读 /z/' },
  { w: 'of',   ipa: '/ʌv/',  zh: '……的',      note: 'o 读 /ʌ/，f 读 /v/！' },
  { w: 'to',   ipa: '/tu/', zh: '到；向',     note: 'o 读 /u/（弱读时是 /tə/）' },
  { w: 'a',    ipa: '/ə/',   zh: '一（个）',   note: '不定冠词弱读 /ə/，不是字母音 /æ/，也不是本名 /eɪ/' },
  { w: 'are',  ipa: '/ɑr/', zh: '是',        note: 'a 读 /ɑr/，整体认读' },
  { w: 'they', ipa: '/ðeɪ/', zh: '他们',      note: 'th 是浊音 /ð/，ey 读 /eɪ/' },
  { w: 'them', ipa: '/ðem/', zh: '他们（宾格）', note: 'th 是浊音 /ð/，不是咬舌不振动的 /θ/' },
  { w: 'this', ipa: '/ðɪs/', zh: '这个',      note: 'th 是浊音 /ð/，不是 /θ/' },
  { w: 'that', ipa: '/ðæt/', zh: '那个',      note: 'th 是浊音 /ð/，不是 /θ/' },
  { w: 'there', ipa: '/ðer/', zh: '那里',     note: 'th 是浊音 /ð/，ere 整体认读' },
  { w: 'what', ipa: '/wʌt/', zh: '什么',      note: 'a 读 /ʌ/，不是 /æ/' },
  { w: 'where', ipa: '/wer/', zh: '哪里',     note: 'wh 读 /w/，ere 不按字母音读' },
  { w: 'who',  ipa: '/hu/', zh: '谁',        note: 'wh 在这里读 /h/！' },
  { w: 'why',  ipa: '/waɪ/', zh: '为什么',     note: 'y 在词尾当元音读 /aɪ/（还没学 y）' },
  { w: 'he',   ipa: '/hi/', zh: '他',        note: 'e 在词尾读本名 /i/（开音节）' },
  { w: 'she',  ipa: '/ʃi/', zh: '她',        note: 'sh 读 /ʃ/，e 在词尾读本名 /i/' },
  { w: 'we',   ipa: '/wi/', zh: '我们',      note: 'e 在词尾读本名 /i/（开音节）' },
  { w: 'my',   ipa: '/maɪ/', zh: '我的',      note: 'y 在词尾当元音读 /aɪ/（还没学 y）' },
  { w: 'out',  ipa: '/aʊt/', zh: '外面',      note: 'ou 读 /aʊ/（还没学这个组合）' },
  { w: 'now',  ipa: '/naʊ/', zh: '现在',      note: 'ow 读 /aʊ/（还没学这个组合）' },
  { w: 'all',  ipa: '/ɔl/', zh: '全部',      note: 'a 在这里读 /ɔ/，不是 /æ/' },
  { w: 'her',  ipa: '/hɜr/', zh: '她的',     note: 'er 读 /ɜr/（卷舌，还没学 er）' },
];

/* 可解码短文（全部自编句）：只用「已教规则可拼的词 + 上面的视觉词」。
   tags 标注用到的规则，便于家长知道这句在练什么。 */
const DECODE_SENTENCES = [
  /* ---- L2 短元音 ---- */
  { s: 'My dog can run.',            zh: '我的狗会跑。',        tags: '视觉词 my · 短元音 o、u' },
  { s: 'The sun is hot.',            zh: '太阳很热。',          tags: '视觉词 the/is · 短元音 u、o' },
  { s: 'The cat is big.',            zh: '这只猫很大。',        tags: '视觉词 the/is · 短元音 a、i' },
  { s: 'The fox is in the box.',     zh: '狐狸在盒子里。',      tags: '视觉词 the/is · 短元音 o · 连缀 x' },
  { s: 'A cat can run.',             zh: '猫会跑。',            tags: '视觉词 a · 短元音 a、u' },
  /* ---- L3 双辅音 ---- */
  { s: 'She has a red hen.',         zh: '她有一只红母鸡。',    tags: '视觉词 she/has/a · sh · 短元音 e' },
  { s: 'He can see the ship.',       zh: '他能看见那艘船。',    tags: '视觉词 he/the · sh · 短元音 i' },
  { s: 'This is my fish.',           zh: '这是我的鱼。',        tags: '视觉词 this/is/my · sh · 短元音 i' },
  /* ---- L4 连缀 ---- */
  { s: 'The fish can swim.',         zh: '这条鱼会游泳。',      tags: '视觉词 the · sh · 连缀 sw · 短元音 i' },
  { s: 'A frog can jump.',           zh: '一只青蛙会跳。',      tags: '视觉词 a · 连缀 fr · 短元音 o、u' },
  { s: 'The crab is in the sand.',   zh: '螃蟹在沙子里。',      tags: '视觉词 the/is · 连缀 cr · 短元音 a' },
  { s: 'I can jump and swim.',       zh: '我会跳，也会游泳。',  tags: '连缀 jmp/sw · 短元音 u' },
  /* ---- L5 元音组合 ---- */
  { s: 'See the green tree.',        zh: '看那棵绿树。',        tags: '视觉词 the · ee · 连缀 gr' },
  { s: 'He can see the moon.',       zh: '他能看见月亮。',      tags: '视觉词 he/the · oo · 短元音 a' },
  { s: 'We play in the rain.',       zh: '我们在雨里玩。',      tags: '视觉词 we/the · ay、ai · 连缀 pl' },
  { s: 'The goat is on the road.',   zh: '山羊在路上。',        tags: '视觉词 the/is · oa · 短元音 o' },
  { s: 'I can see the boat.',        zh: '我能看见那条船。',    tags: 'oa · 视觉词 the' },
  { s: 'The bee is in the tree.',    zh: '蜜蜂在树上。',        tags: 'ee · 视觉词 the/is' },
  /* ---- L6 魔法 e ---- */
  { s: 'The cake is on the plate.',  zh: '蛋糕在盘子上。',      tags: '视觉词 the/is · 魔法 e · 连缀 pl · 短元音 o' },
  { s: 'The rose is red.',           zh: '玫瑰是红色的。',      tags: '魔法 e o_e · 短元音 e' },
  { s: 'I can ride a bike.',         zh: '我会骑自行车。',      tags: '魔法 e i_e · 视觉词 a' },
  { s: 'The stone is big.',          zh: '这块石头很大。',      tags: '魔法 e o_e · 连缀 st · 短元音 i' },
  /* ---- L7 卷舌音 ---- */
  { s: 'The bird can sing.',         zh: '这只鸟会唱歌。',      tags: '视觉词 the · ir · ng · 短元音 a、i' },
  { s: 'The horse can run.',         zh: '马会跑。',            tags: 'or · 短元音 a、u' },
  { s: 'My shirt is red.',           zh: '我的衬衫是红色的。',  tags: '视觉词 my/is · ir · 短元音 e' },
  { s: 'I can see the star.',        zh: '我能看见那颗星星。',  tags: 'ar · 视觉词 the' },
  /* ---- L8 元音组合 II ---- */
  { s: 'I can see the sea.',         zh: '我能看见大海。',      tags: 'ea · 视觉词 the' },
  { s: 'The light is on.',           zh: '灯亮着。',            tags: 'igh · 视觉词 the/is · 短元音 o' },
  { s: 'The mouse is in the house.', zh: '老鼠在房子里。',      tags: 'ou · 视觉词 the/is' },
  { s: 'The boy has a toy.',         zh: '男孩有一个玩具。',    tags: 'oy · 视觉词 the/has/a' },
  { s: 'The cow is brown.',          zh: '奶牛是棕色的。',      tags: 'ow /aʊ/ · 视觉词 the/is' },
  /* ---- L9 更多元音 ---- */
  { s: 'My sister is a teacher.',    zh: '我的姐姐是老师。',    tags: 'er · ea · 视觉词 my/is/a' },
  { s: 'The turtle is slow.',        zh: '乌龟很慢。',          tags: 'ur · ow /oʊ/ · 视觉词 the/is' },
  { s: 'I can draw a cat.',          zh: '我会画猫。',          tags: 'aw · 视觉词 a' },
  { s: 'The sky is blue.',           zh: '天空是蓝色的。',      tags: 'y /aɪ/ · ue · 视觉词 the/is' },
  { s: 'I have a new book.',         zh: '我有一本新书。',      tags: 'ew · oo · 视觉词 have/a' },
  /* ---- L11 规则例外 ---- */
  { s: 'The city is big.',           zh: '城市很大。',          tags: '软音 c · 短元音 i' },
  { s: 'I know the girl.',           zh: '我认识那个女孩。',    tags: '不发音 k · ir' },
  { s: 'I can climb.',               zh: '我会爬。',            tags: '不发音 b · 短元音 i' },
  { s: 'The giraffe is tall.',       zh: '长颈鹿很高。',        tags: '软音 g · 短元音 a' },
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

/* ================= 同音异拼（Phase 5b：一个音、几种写法） =================
   2026-11-20.3：SSP 里最容易被漏掉的一环 —— 孩子学会了 ai，还要知道 /eɪ/
   还能写成 ay、a_e；只教「一个音一种写法」，遇到真实单词就卡住（rain 会读，
   play 就懵）。这一关把「同一个音的不同写法」摆在一起对比，
   再用「听一个词、选它用的是哪种写法」来检验。
   ★ 每组只放**已经学过**的写法；词全部来自 999 词库（有图有声），
     只有 night 来自 PH_EXTRA 补充表（PEP 课本音频）。 */
const SAME_SOUNDS = [
  { sound: '/eɪ/', zh: '「诶」', groups: [
    { sp: 'ai', words: ['rain', 'train', 'paint'] },
    { sp: 'ay', words: ['play', 'day', 'away'] },
    { sp: 'a_e', words: ['cake', 'name', 'game'] } ] },
  { sound: '/i/', zh: '「衣」', groups: [
    { sp: 'ee', words: ['see', 'tree', 'green'] },
    { sp: 'ea', words: ['eat', 'tea', 'sea'] },
    { sp: 'y', words: ['happy', 'baby', 'candy'] },
    { sp: 'e', words: ['he', 'she', 'we'] } ] },
  { sound: '/aɪ/', zh: '「爱」', groups: [
    { sp: 'i_e', words: ['kite', 'bike', 'five'] },
    { sp: 'igh', words: ['night', 'light', 'high'] },
    { sp: 'y', words: ['my', 'fly', 'sky'] } ] },
  { sound: '/oʊ/', zh: '「欧」', groups: [
    { sp: 'oa', words: ['boat', 'coat', 'goat'] },
    { sp: 'o_e', words: ['nose', 'home', 'rose'] },
    { sp: 'ow', words: ['snow', 'window', 'yellow'] } ] },
  { sound: '/u/', zh: '「乌」', groups: [
    { sp: 'oo', words: ['moon', 'food', 'zoo'] },
    { sp: 'ue', words: ['blue', 'true'] },
    { sp: 'u_e', words: ['rule'] } ] },
  /* ★ 2026-11-21.1（第十轮复检 E12）：ew / u_e 多数读 /ju/（new、few、cute），
     原来并进 /u/ 组，和 L9「ew 在 n/f 后面读 /ju/」「u_e 多数读 /ju/」自相矛盾。
     这里拆成独立的 /ju/ 组，与 L9 教的口径对齐。 */
  { sound: '/ju/', zh: '「优」', groups: [
    { sp: 'ew', words: ['new', 'few'] },
    { sp: 'u_e', words: ['cute', 'use'] } ] },
  { sound: '/ɜr/', zh: '卷舌「厄」', groups: [
    { sp: 'ir', words: ['bird', 'girl', 'shirt'] },
    { sp: 'er', words: ['her', 'person'] },
    { sp: 'ur', words: ['nurse', 'purple'] } ] },
  { sound: '/aʊ/', zh: '「嗷」', groups: [
    { sp: 'ou', words: ['house', 'mouse'] },
    { sp: 'ow', words: ['cow', 'now'] } ] },
  { sound: '/ɔɪ/', zh: '「奥衣」', groups: [
    { sp: 'oi', words: ['choice'] },
    { sp: 'oy', words: ['boy', 'toy'] } ] },
];

/* 每块「什么时候教」——关卡分档用。
   单字母在 L1；双辅音 L3；元音组合 L5；卷舌 L7；其余（无录音的规则块）L8。 */
const BLOCK_STAGE = {
  sh: 'L3', ch: 'L3', th: 'L3', ck: 'L3', ng: 'L3',
  ee: 'L5', oo: 'L5', ai: 'L5', ay: 'L5', oa: 'L5',
  ar: 'L7', or: 'L7', ir: 'L7',
};
function blockStage(b) {
  const k = String(b || '').toLowerCase();
  if (!k) return 'L1';
  if (BLOCK_STAGE[k]) return BLOCK_STAGE[k];
  return k.length === 1 ? 'L1' : 'L8';
}
/* 这个词在某一关能不能逐块拼：块都得是这一关或更早教的 */
function wordInStage(word, segs, lvId) {
  if (!segs || !segs.length) return true;          // 整体认读的词不涉及块
  const rank = id => parseInt(String(id).replace(/[^0-9]/g, ''), 10) || 0;
  return segs.every(b => rank(blockStage(b)) <= rank(lvId));
}
/* 这个词里最先「超纲」的那一块（给页面提示用）*/
function firstLaterBlock(segs, lvId) {
  if (!segs) return null;
  const rank = id => parseInt(String(id).replace(/[^0-9]/g, ''), 10) || 0;
  for (const b of segs) if (rank(blockStage(b)) > rank(lvId)) return { b: b, lv: blockStage(b) };
  return null;
}

const PH_L1_BATCHES = [
  { title: '第 1 批 · 起步六音', hint: 's a t i p n——学完这 6 个，sat / pin / tap 就能拼！', letters: ['s', 'a', 't', 'i', 'p', 'n'] },
  { title: '第 2 批 · 再来七个', hint: 'cat / red / hen 都会拼了', letters: ['c', 'k', 'e', 'h', 'r', 'm', 'd'] },
  { title: '第 3 批 · 又是六个', hint: 'dog / sun / bag / frog 出场', letters: ['g', 'o', 'u', 'l', 'f', 'b'] },
  { title: '第 4 批 · 收尾七个', hint: 'b 和 d 分开学，不打架', letters: ['j', 'v', 'w', 'y', 'z', 'x', 'q'] },
];

const PH_LEVELS = [
  { id: 'L1', icon: '🔤', name: '字母音启蒙', kind: 'letters',
    goal: '26 个字母在单词里的声音——见字母就想音',
    intro: '字母<b>名</b>是它的名字（A 读 /eɪ/），字母<b>音</b>是它在单词里的声音（a 读 /æ/）——自然拼读学的是<b>声音</b>。分 4 批学，点字母卡听音，点小词听例词。想看象形小故事去 <a href="letters.html" style="color:var(--ink)">字母岛 →</a>',
    goals: ['听得出 26 个字母音', '分清字母名和字母音', '听例词找到开头音'] },
  { id: 'L2', icon: '🧱', name: '短元音拼读', kind: 'words',
    goal: '元音发短音，c-a-t 一拼就会',
    intro: '元音发短音，一个一个音拼起来就是词：c + a + t → cat。点<b>蓝块</b>听单个音，点「🔊 拼一拼」先逐音、后整词——整词发音是唯一的标准音。',
    goals: ['听出 5 个短元音', '拼出 cat / hen / pig 这样的词', '读 4 句可解码小句'],
    fams: ['short-a', 'short-e', 'short-i', 'short-o', 'short-u'],
    sight: ['the', 'a', 'is', 'my'],
    sents: ['My dog can run.', 'The sun is hot.', 'The cat is big.', 'The fox is in the box.', 'A cat can run.'] },
  { id: 'L3', icon: '🧩', name: '双辅音', kind: 'words',
    goal: '两个字母一个音：sh 不是 s+h，就是一声「嘘」',
    intro: 'sh / ch / th / ck / ng 都是「两个字母，<b>一个音</b>」，把它们当<b>一整块</b>拼进词里。（连缀正好相反：两个字母<b>两个音</b>，都出声——下一关见。）',
    goals: ['把 sh/ch/th/ck/ng 当一整块认', '拼 fish / chick 这类词', '读 3 句可解码小句'],
    fams: ['sh', 'ch', 'th', 'ck', 'ng'],
    sight: ['he', 'she', 'has'],
    sents: ['She has a red hen.', 'He can see the ship.', 'This is my fish.'] },
  { id: 'L4', icon: '🔗', name: '辅音连缀', kind: 'words',
    goal: '两个辅音各自出声、连着读',
    intro: 'fl / pl / bl、cr / dr / fr、st / sw / sk……和双辅音<b>正好相反</b>：两个辅音<b>各自出声</b>、连着读（f-l、c-r、s-t），中间不停。逐块听一遍再连读。',
    goals: ['分清「一个音」和「两个音」', '连读 fl / pl / cr / st', '读 4 句可解码小句'],
    fams: ['blends-l', 'blends-r', 'blends-s'],
    sight: [],
    sents: ['The fish can swim.', 'A frog can jump.', 'The crab is in the sand.', 'I can jump and swim.'] },
  { id: 'L5', icon: '🌈', name: '元音组合', kind: 'words',
    goal: '两个元音手拉手，发一个长音',
    intro: '两个元音字母手拉手发一个长音：ee 长「衣」、oo 长「乌」、ai / ay 都是 /eɪ/、oa 是 o 的本名。',
    goals: ['认出 ee/oo/ai-ay/oa 的长音', '拼 rain / moon / boat', '读 6 句可解码小句'],
    fams: ['ee', 'oo', 'ai-ay', 'oa'],
    sight: ['we'],
    sents: ['See the green tree.', 'He can see the moon.', 'We play in the rain.', 'The goat is on the road.', 'I can see the boat.', 'The bee is in the tree.'] },
  { id: 'L6', icon: '🪄', name: '魔法 e', kind: 'words',
    goal: '结尾的 e 不出声，让元音念本名',
    intro: '结尾的 e <b>不出声</b>，它像个小魔法师，让前面的元音念自己的<b>本名</b>：a_e 读 /eɪ/、i_e 读 /aɪ/、o_e 读 /oʊ/、u_e 读 /u/（或 /ju/）。这些词先<b>整体认读</b>（硬拆成 c-a-k-e 会读错）。',
    goals: ['知道「哑巴 e」的魔法', '整体认读 cake / kite / nose', '读 4 句可解码小句'],
    fams: ['a_e', 'i_e', 'o_e', 'u_e'],
    sight: [],
    sents: ['The cake is on the plate.', 'The rose is red.', 'I can ride a bike.', 'The stone is big.'] },
  { id: 'L7', icon: '🐻', name: '卷舌音', kind: 'words',
    goal: 'r 跟着元音一起卷舌头',
    intro: 'r 跟着元音一起卷舌头：ar /ɑr/、or /ɔr/，还有 ir /ɜr/（bird、girl、third）。',
    goals: ['听出 ar/or/ir 的卷舌音', '拼 car / horse / bird', '读 4 句可解码小句'],
    fams: ['ar', 'or', 'ir'],
    sight: [],
    sents: ['The bird can sing.', 'The horse can run.', 'My shirt is red.', 'I can see the star.'] },
  { id: 'L8', icon: '🌊', name: '元音组合 II', kind: 'words',
    goal: 'ea / igh / ou / ow / oi / oy——多出来的长音写法',
    intro: '元音组合不止 ee / oo / ai / oa。这一关补上 <b>ea、igh、ou、ow、oi、oy</b>：eat 的 ea、night 的 igh、house 的 ou、cow 和 snow 的两个 ow、boy 的 oy。它们<b>没有单块录音</b>，用<b>关键词</b>感受这个音，再点整词听。',
    goals: ['认 ea / igh / ou / ow / oi / oy', '知道 ow 有两个音', '读 5 句可解码小句'],
    fams: ['ea', 'igh', 'ou', 'ow-au', 'ow-oh', 'oi-oy'],
    sight: [],
    sents: ['I can see the sea.', 'The light is on.', 'The mouse is in the house.', 'The boy has a toy.', 'The cow is brown.'] },
  { id: 'L9', icon: '🐢', name: '更多元音', kind: 'words',
    goal: 'er / ur / au / aw / ew / ue / y 结尾',
    intro: '再补一批：<b>er</b>（teacher）、<b>ur</b>（nurse）、<b>au</b>（autumn）、<b>aw</b>（draw）、<b>ew</b>（new）、<b>ue</b>（blue），还有词尾的 <b>y</b>——my 读 /aɪ/、happy 读 /i/。同样用关键词听音、整词收口。',
    goals: ['分出 er/ur 都是 /ɜr/', '知道 au/aw 同音', 'y 结尾两种读法'],
    fams: ['er', 'ur', 'au', 'aw', 'ew', 'ue', 'y-ai', 'y-i'],
    sight: [],
    sents: ['My sister is a teacher.', 'The turtle is slow.', 'I can draw a cat.', 'The sky is blue.', 'I have a new book.'] },
  { id: 'L10', icon: '🎭', name: '同音异拼', kind: 'sameSound',
    goal: '同一个音，好几种写法——见到哪个都能读',
    intro: '同一个音常有好几种写法：/eɪ/ 能写成 ai、ay、a_e。只学一种，遇到 play 就会卡。这一关把<b>同一个音的不同写法</b>摆在一起，<b>听一个词，判断它用的是哪种写法</b>。',
    goals: ['同一个音能认出 2~4 种写法', '看到 ai/ay/a_e 都读 /eɪ/', '听词判断它用哪种写法'] },
  { id: 'L11', icon: '⚡', name: '规则例外', kind: 'words',
    goal: 'c/g 的软音、不发音的字母',
    intro: '规则也有例外：<b>c</b> 在 e/i/y 前读 /s/（city、ice），<b>g</b> 在 e/i/y 前常读 /dʒ/（giraffe、magic）；<b>knife 的 k、write 的 w、comb 的 b、hour 的 h</b> 都不出声。这些词整体认读，记住样子最省事。',
    goals: ['city 的 c 读 /s/ 不读 /k/', '知道 get / give 仍是 /g/', '认出不发音的字母'],
    fams: ['soft-c', 'soft-g', 'silent'],
    sight: [],
    sents: ['The city is big.', 'I know the girl.', 'I can climb.', 'The giraffe is tall.'] },
  { id: 'L12', icon: '⭐', name: '视觉词', kind: 'sight',
    goal: '35 个高频词，先整体认住',
    intro: '这些词太常用了，而且<b>不按规则出牌</b>（或用到还没学的规则）——先整个认住、听音就懂，学到对应规则再回头「认领」它们。点词听音，📌 提示讲「为什么不按字母拼」。',
    goals: ['整体认读 35 个视觉词', '知道「为什么不按字母拼」', '听音就能认词'],
    sightBatches: [
      { title: '第 1 批 · 最先认', words: ['the', 'a', 'is', 'my', 'he', 'she', 'we', 'you', 'are', 'they', 'this', 'that'] },
      { title: '第 2 批 · 很常用', words: ['said', 'one', 'two', 'was', 'has', 'were', 'come', 'some', 'have', 'do', 'does', 'of', 'to'] },
      { title: '第 3 批 · 也要会', words: ['them', 'there', 'what', 'where', 'who', 'why', 'out', 'now', 'all', 'her'] },
    ] },
  { id: 'L13', icon: '✍️', name: '听音能写', kind: 'spell',
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
window.PH_LETTER_HINT = PH_LETTER_HINT;
window.SAME_SOUNDS = SAME_SOUNDS;
window.BLOCK_STAGE = BLOCK_STAGE;
window.blockStage = blockStage;
window.wordInStage = wordInStage;
window.firstLaterBlock = firstLaterBlock;

