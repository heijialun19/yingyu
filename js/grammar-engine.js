/* ============================================================
   句子语法解析引擎 v1（句子工厂专用）
   ------------------------------------------------------------
   两件事：
   1) 给每道题一个「看得懂的句子解析」——每个词标出词性 + 句子成分；
   2) 提供"一句话的三种面孔"（陈述 / 否定 / 疑问）的生成能力。

   ★ 铁律：解析是「描述」，不是「猜」。
   引擎只认本站真实会出现的句型，认不出来就返回 ok:false，页面只显示词性，
   ★ 绝不瞎标成分 —— 教语法的东西标错一次比不标更糟。

   词性靠词表（GX_*）判断，不靠猜；动词表里没有的词一律不当作动词。
   ============================================================ */
'use strict';

/* ---------------- 词表 ---------------- */
const GX_PRON = new Set(['i','you','he','she','it','we','they','me','him','us','them',
  'my','your','his','her','its','our','their','this','that','these','those']);
/* 物主代词：后面跟名词时是定语（my mom） */
const GX_POSS = new Set(['my','your','his','her','its','our','their']);
const GX_BE = new Set(['am','is','are','was','were']);
const GX_MODAL = new Set(['can','could','must','should','will','would','may','might']);
const GX_DO = new Set(['do','does','did']);
const GX_DET = new Set(['a','an','the','some','any','many']);
const GX_NUM = new Set(['one','two','three','four','five','six','seven','eight','nine','ten',
  'eleven','twelve','thirteen','fifteen','twenty','thirty']);
const GX_PREP = new Set(['in','on','under','at','to','for','of','from','near','behind','with','by','about','into']);
const GX_CONJ = new Set(['and','but','or','because','so']);

/* 动词表：只收本站句子里真的当动词用的词（避免 run 被当名词之类的误判） */
const GX_VERB = new Set(['run','jump','swim','sing','dance','read','draw','play','eat','drink',
  'sleep','cook','wash','walk','fly','cry','laugh','smile','look','watch','listen','speak',
  'write','climb','ride','sit','stand','like','love','have','see','want','help','clean',
  'open','close','go','do','study','teach','work','buy','make','take','give','get','put',
  'know','think','find','say','tell','come','live','need','use','start','stop','wait','wear',
  'catch','throw','count','spell']);
const GX_ADJ = new Set(['big','small','long','short','tall','fat','thin','old','young','new',
  'happy','sad','angry','tired','hungry','thirsty','hot','cold','warm','cool','fast','slow',
  'good','bad','nice','fine','beautiful','cute','lovely','strong','heavy','light','dirty',
  'easy','hard','interesting','boring','red','blue','yellow','green','black','white',
  'pink','brown','grey','gray','purple','ready','busy','free','right','wrong','same',
  'clean']);

/* 动词三单：一个个写死（规则拼会出 flys / gos / haves） */
/* 三单 / can 出题只挑单独说也成立的动词（run / swim / sing…）。
   make / take / put 这类必须带宾语，中文「她做」「我会拿」读起来不完整，不进题池。 */
const GX_INTRANS_ZH = { run:'跑步', jump:'跳', swim:'游泳', sing:'唱歌', dance:'跳舞', read:'读书',
  draw:'画画', play:'玩', eat:'吃东西', drink:'喝水', sleep:'睡觉', cook:'做饭', wash:'洗东西',
  walk:'走路', fly:'飞', cry:'哭', laugh:'笑', smile:'微笑', watch:'看', listen:'听',
  speak:'说话', write:'写字', climb:'爬', ride:'骑车', stand:'站', study:'学习', work:'工作', wait:'等' };

const GX_THIRD = {
  run:'runs', jump:'jumps', swim:'swims', sing:'sings', dance:'dances', read:'reads',
  draw:'draws', play:'plays', eat:'eats', drink:'drinks', sleep:'sleeps', cook:'cooks',
  wash:'washes', walk:'walks', fly:'flies', cry:'cries', laugh:'laughs', smile:'smiles',
  look:'looks', watch:'watches', listen:'listens', speak:'speaks', write:'writes',
  climb:'climbs', ride:'rides', sit:'sits', stand:'stands', like:'likes', love:'loves',
  have:'has', see:'sees', want:'wants', help:'helps', clean:'cleans', open:'opens',
  close:'closes', go:'goes', do:'does', study:'studies', teach:'teaches', work:'works',
  buy:'buys', make:'makes', take:'takes', give:'gives', get:'gets', put:'puts',
  know:'knows', think:'thinks', find:'finds', say:'says', tell:'tells', come:'comes',
  live:'lives', need:'needs', use:'uses', start:'starts', stop:'stops', wait:'waits',
  wear:'wears', catch:'catches', throw:'throws', count:'counts', spell:'spells'
};
const GX_BASE = (() => { const m = {}; for (const k in GX_THIRD) m[GX_THIRD[k]] = k; return m; })();
/* 能进造句/变形题的动作动词池（do 只当助动词用，不进池，免得生成 I do apples. 这种句子） */
const GX_ACTION = ['run','jump','swim','sing','dance','read','draw','play','eat','drink','sleep',
  'cook','wash','walk','fly','cry','laugh','smile','watch','listen','speak','write','climb',
  'ride','stand','like','love','have','see','want','help','clean','open','close','go','study',
  'teach','work','buy','make','take','give','get','put','know','think','find','say','tell',
  'come','live','need','use','start','stop','wait','wear','catch','throw','count','spell'];
const GX_ACTION_ZH = { run:'跑步', jump:'跳', swim:'游泳', sing:'唱歌', dance:'跳舞', read:'读书',
  draw:'画画', play:'玩', eat:'吃东西', drink:'喝水', sleep:'睡觉', cook:'做饭', wash:'洗',
  walk:'走路', fly:'飞', cry:'哭', laugh:'笑', smile:'微笑', watch:'看', listen:'听', speak:'说',
  write:'写', climb:'爬', ride:'骑', stand:'站', like:'喜欢', love:'爱', have:'有', see:'看见',
  want:'想要', help:'帮忙', clean:'打扫', open:'打开', close:'关上', go:'去', study:'学习',
  teach:'教', work:'工作', buy:'买', make:'做', take:'拿', give:'给', get:'得到', put:'放',
  know:'知道', think:'想', find:'找到', say:'说', tell:'告诉', come:'来', live:'住', need:'需要',
  use:'用', start:'开始', stop:'停', wait:'等', wear:'穿', catch:'接住', throw:'扔',
  count:'数', spell:'拼写' };

/* ---------------- 词性 ---------------- */
const gxClean = w => String(w).toLowerCase().replace(/[^a-z']/g, '');

function gxPos(word) {
  const w = gxClean(word);
  if (!w) return { pos: '标点' };
  if (GX_PRON.has(w)) return { pos: '代词' };
  if (GX_BE.has(w)) return { pos: 'be 动词' };
  if (GX_MODAL.has(w)) return { pos: '情态动词' };
  if (GX_DO.has(w)) return { pos: '助动词' };
  if (w === 'not' || w === 'no') return { pos: '否定词' };
  if (w === 'there') return { pos: '引导词' };
  if (GX_DET.has(w)) return { pos: '冠词' };
  if (GX_NUM.has(w)) return { pos: '数词' };
  if (GX_PREP.has(w)) return { pos: '介词' };
  if (GX_CONJ.has(w)) return { pos: '连词' };
  if (GX_BASE[w]) return { pos: '动词', base: GX_BASE[w], extra: '第三人称单数' };
  if (GX_VERB.has(w)) return { pos: '动词', base: w };
  if (GX_ADJ.has(w)) return { pos: '形容词' };
  if (/ing$/.test(w)) {
    const b = w.slice(0, -3), be = b + 'e';
    if (GX_VERB.has(b)) return { pos: '动词', base: b, extra: '现在分词' };
    if (GX_VERB.has(be)) return { pos: '动词', base: be, extra: '现在分词' };
    // 认不出原形的 -ing 词按名词处理：dumpling / morning / spring / building
    return { pos: '名词' };
  }
  return { pos: '名词' };
}

/* ============================================================
   按词性取词 —— 全站唯一入口
   ------------------------------------------------------------
   任何"把词填进一句话"的地方都必须先过这里。
   不筛词性就会造出这种题（真实发生过，500 轮里 115 种）：
     This is a from.        ← 介词被当成名词
     This is an and.        ← 连词被当成名词
     I can yoga.            ← 名词被当成动词
   「拼写对、语法错」比不出题更糟：孩子会照着背下来。
   词库的 pos 是人工校对过的（data.js 已挂到每个词条），gxPos 只兜底。
   ============================================================ */
const GX_POS_CODE = { '名词':'n', '动词':'v', '形容词':'adj', '数词':'num', '副词':'adv',
  '代词':'pron', '介词':'prep', '连词':'conj', '感叹词':'interj', 'be 动词':'be',
  '疑问词':'qw', '短语':'phrase' };
function gxPosCode(w) {
  const o = (w && typeof w === 'object') ? w : { w };
  if (o.pos) return o.pos;                        // 词库真相优先
  return GX_POS_CODE[gxPos(o.w).pos] || 'n';      // 引擎兜底
}
/* 只留"真名词"：介词 / 动词 / 形容词一律不进（单字词、短语也不要） */
const gxNouns = ws => ws.filter(w => gxPosCode(w) === 'n' && !String(w.w).includes(' '));
/* 只留动词原形（三单形不能填进 I can __） */
const gxVerbs = ws => ws.filter(w => gxPosCode(w) === 'v');

/* ---------------- 分词 ---------------- */
const GX_CONTRACTION = {
  "isn't": ['is', 'not'], "aren't": ['are', 'not'], "wasn't": ['was', 'not'],
  "don't": ['do', 'not'], "doesn't": ['does', 'not'], "didn't": ['did', 'not'],
  "can't": ['can', 'not'], "cannot": ['can', 'not'],
  "it's": ['it', 'is'], "he's": ['he', 'is'], "she's": ['she', 'is'],
  "i'm": ['i', 'am'], "we're": ['we', 'are'], "they're": ['they', 'are'], "you're": ['you', 'are']
};

function gxTokenize(sentence) {
  const s = String(sentence).trim().replace(/[.?!,]+$/, '');
  const words = s.split(/\s+/).filter(Boolean);
  const out = [];
  words.forEach(w => {
    const clean = w.replace(/[^A-Za-z']/g, '');
    const low = clean.toLowerCase();
    const ex = GX_CONTRACTION[low];
    if (ex) {
      /* 缩写拆成两个词分别标成分（aren't → are + not），页面上会注明缩写关系 */
      ex.forEach((core, i) => {
        const cap = i === 0 && clean[0] === clean[0].toUpperCase();
        out.push({ display: cap ? core[0].toUpperCase() + core.slice(1) : core, core, expanded: true });
      });
    } else {
      out.push({ display: clean, core: low });
    }
  });
  return out;
}

const GX_PATTERNS = {
  there:  { label: 'There be 句型（某地有某物）', formula: 'There + is/are + 什么 + 地点' },
  prog:   { label: '现在进行时（正在做）', formula: '谁 + be + 动词ing' },
  can:    { label: '情态动词 can（会做）', formula: '谁 + can + 动词原形' },
  slv:    { label: '主系表（谁 + 是 + 什么/怎么样）', formula: '谁 + be动词 + 表语' },
  spo:    { label: '主谓宾（谁 + 干什么 + 什么）', formula: '谁 + 干什么 + 什么' },
  sp:     { label: '主谓（谁 + 干什么）', formula: '谁 + 干什么' },
  frag:   { label: '词组 / 单词', formula: '' }
};

/* ---------------- 核心：句子解析 ---------------- */
function gxAnalyze(sentence) {
  const raw = String(sentence || '').trim();
  const punct = /\?$/.test(raw) ? '?' : (raw ? '.' : '');
  const body = raw.replace(/[.?!]+$/, '');
  const empty = { ok: false, tokens: [], punct: '', pattern: 'frag', ...GX_PATTERNS.frag, note: '' };
  if (!body) return empty;

  const tokens = gxTokenize(body).map(t => Object.assign({}, t, gxPos(t.core)));
  const n = tokens.length;
  const setRole = (i, role, note) => { if (i >= 0 && i < n) { tokens[i].role = role; if (note) tokens[i].note = note; } };
  const noVerbFallback = () => ({
    ok: false,
    tokens: tokens.map(t => Object.assign({}, t, { role: '' })),
    punct, pattern: 'frag', ...GX_PATTERNS.frag,
    note: n > 1 ? '这是一个词组，不是完整句子——看每个词的词性就行。' : '这是一个单词，看它的词性。'
  });

  /* 名词短语：冠词/数词/形容词/物主代词都是定语，最后一个名词拿角色 */
  const markNP = (start, roleName) => {
    const t0 = tokens[start];
    if (t0.pos === '代词' && !GX_POSS.has(t0.core)) { setRole(start, roleName); return start; }
    let last = start;
    for (let i = start; i < n; i++) {
      const t = tokens[i];
      if (t.pos === '名词' || (t.pos === '代词' && !GX_POSS.has(t.core))) last = i;
      if (t.pos === '介词' || t.pos === '动词' || t.pos === 'be 动词' || t.pos === '助动词') break;
    }
    for (let i = start; i <= last; i++) {
      const t = tokens[i];
      const isModifier = t.pos === '冠词' || t.pos === '数词' || t.pos === '形容词' || GX_POSS.has(t.core);
      setRole(i, isModifier ? '定语' : (i === last ? roleName : '定语'));
    }
    return last;
  };

  /* be 后面的部分：有名词 → 名词是表语；只有形容词 → 形容词是表语 */
  const markPredicate = start => {
    let j = start;
    if (tokens[j] && tokens[j].pos === '否定词') { setRole(j, '否定词'); j++; }
    const rest = [];
    for (let k = j; k < n; k++) rest.push(k);
    if (!rest.length) return;
    const prepAt = rest.find(k => tokens[k].pos === '介词');
    const nounAt = rest.filter(k => tokens[k].pos === '名词' || (tokens[k].pos === '代词' && !GX_POSS.has(tokens[k].core)));
    for (const k of rest) {
      const t = tokens[k];
      if (prepAt !== undefined && k >= prepAt) { setRole(k, '状语'); continue; }
      if (nounAt.length) {
        setRole(k, t.pos === '名词' ? '表语' : '定语');
      } else {
        setRole(k, '表语');
      }
    }
  };

  /* 0. 单个词（比如"动作王是谁"的答案 runs） */
  if (n === 1) {
    const p = tokens[0].pos;
    setRole(0, p === '动词' ? '谓语' : '');
    return { ok: p === '动词', tokens, punct, pattern: 'frag', ...GX_PATTERNS.frag,
      note: p === '动词' ? '这是一个动词，在句子里当谓语。' : '这是一个单词，看它的词性。' };
  }

  /* 1. There be */
  if (tokens[0].core === 'there' && tokens[1] && GX_BE.has(tokens[1].core)) {
    setRole(0, '引导词');
    setRole(1, '谓语', 'be 跟后面的名词走：一个用 is，多个用 are');
    let i = 2;
    let subjAt = -1;
    for (; i < n; i++) {
      const t = tokens[i];
      if (t.pos === '冠词' || t.pos === '数词' || t.pos === '形容词') { setRole(i, '定语'); continue; }
      if (t.pos === '名词') { setRole(i, '主语', 'There be 的"谁"放在 be 后面'); subjAt = i; i++; break; }
      break;
    }
    for (; i < n; i++) {
      const t = tokens[i];
      if (t.pos === '介词') setRole(i, '状语');
      else if (t.pos === '冠词' || t.pos === '形容词' || t.pos === '数词') setRole(i, '定语');
      else setRole(i, '状语');
    }
    return { ok: subjAt >= 0, tokens, punct, pattern: 'there', ...GX_PATTERNS.there,
      note: 'There be = "有"，be 后面的名词才是真正的主语。' };
  }

  /* 2. 疑问句（be / 助动词 / 情态动词提到最前） */
  if (GX_BE.has(tokens[0].core) || GX_MODAL.has(tokens[0].core) || GX_DO.has(tokens[0].core)) {
    const isBe = GX_BE.has(tokens[0].core);
    setRole(0, isBe ? '谓语' : '助动词', '问句要把它搬到句子最前面');
    let i = 1;
    if (tokens[i] && (tokens[i].pos === '代词' || tokens[i].pos === '名词' || tokens[i].pos === '冠词' || tokens[i].pos === '数词')) {
      i = markNP(i, '主语') + 1;
    }
    if (tokens[i] && tokens[i].pos === '否定词') { setRole(i, '否定词'); i++; }
    let verbAfter = -1;
    for (let k = i; k < n; k++) if (tokens[k].pos === '动词') { verbAfter = k; break; }
    if (isBe && verbAfter < 0) {
      markPredicate(i);                       // Is this a dog? → a dog 是表语
      return { ok: true, tokens, punct, pattern: 'slv', ...GX_PATTERNS.slv,
        note: '一般疑问句：把 be 搬到最前面，句号变问号。' };
    }
    if (verbAfter >= 0) {
      setRole(verbAfter, '谓语');
      for (let k = verbAfter + 1; k < n; k++) {
        const t = tokens[k];
        if (t.pos === '介词') setRole(k, '状语');
        else if (t.pos === '冠词' || t.pos === '数词' || t.pos === '形容词' || GX_POSS.has(t.core)) setRole(k, '定语');
        else if (t.pos === '名词' || t.pos === '代词') setRole(k, '宾语');
        else setRole(k, '');
      }
      const hasObj = tokens.some(t => t.role === '宾语');
      const isCan = GX_MODAL.has(tokens[0].core);
      const pat = isCan ? 'can' : (hasObj ? 'spo' : 'sp');
      return { ok: true, tokens, punct, pattern: pat, ...GX_PATTERNS[pat],
        note: '一般疑问句：把 be / 助动词 / can 搬到最前面。' };
    }
    return { ok: true, tokens, punct, pattern: 'sp', ...GX_PATTERNS.sp, note: '一般疑问句。' };
  }

  /* 3. 陈述句：先找主语 */
  if (!(tokens[0].pos === '代词' || tokens[0].pos === '名词' || tokens[0].pos === '冠词' || tokens[0].pos === '数词')) {
    return noVerbFallback();
  }
  let i = markNP(0, '主语') + 1;

  /* 4. 否定词 */
  if (tokens[i] && tokens[i].pos === '否定词') { setRole(i, '否定词', '放在助动词/be 后面'); i++; }

  /* 5. can / 助动词 */
  if (tokens[i] && (GX_MODAL.has(tokens[i].core) || GX_DO.has(tokens[i].core))) {
    const isCan = GX_MODAL.has(tokens[i].core);
    setRole(i, '助动词', '后面永远跟动词原形');
    i++;
    if (tokens[i] && tokens[i].pos === '否定词') { setRole(i, '否定词'); i++; }
    const v = i;
    if (tokens[v] && tokens[v].pos === '动词') {
      setRole(v, '谓语');
      let hasObj = false;
      for (let k = v + 1; k < n; k++) {
        const t = tokens[k];
        if (t.pos === '介词') setRole(k, '状语');
        else if (t.pos === '冠词' || t.pos === '数词' || t.pos === '形容词' || GX_POSS.has(t.core)) setRole(k, '定语');
        else if (t.pos === '名词' || t.pos === '代词') { setRole(k, '宾语'); hasObj = true; }
        else setRole(k, '');
      }
      const pat = isCan ? 'can' : (hasObj ? 'spo' : 'sp');
      return { ok: true, tokens, punct, pattern: pat, ...GX_PATTERNS[pat],
        note: isCan ? 'can 后面的动词永远是原形，不加 s、不加 ing。' : '助动词后面跟动词原形。' };
    }
    return { ok: true, tokens, punct, pattern: 'sp', ...GX_PATTERNS.sp, note: '助动词后面跟动词原形。' };
  }

  /* 6. be 动词 */
  if (tokens[i] && GX_BE.has(tokens[i].core)) {
    const beAt = i;
    const next = tokens[beAt + 1];
    if (next && next.pos === '动词' && /ing$/.test(next.core)) {
      setRole(beAt, '助动词', '进行时的 be 是助动词，不是"是"');
      setRole(beAt + 1, '谓语');
      for (let k = beAt + 2; k < n; k++) {
        const t = tokens[k];
        if (t.pos === '介词') setRole(k, '状语');
        else if (t.pos === '冠词' || t.pos === '数词' || t.pos === '形容词' || GX_POSS.has(t.core)) setRole(k, '定语');
        else if (t.pos === '名词' || t.pos === '代词') setRole(k, '宾语');
        else setRole(k, '');
      }
      return { ok: true, tokens, punct, pattern: 'prog', ...GX_PATTERNS.prog,
        note: '正在做：be + 动词ing，两个都不能少。' };
    }
    setRole(beAt, '谓语', '"是"在这里就是谓语');
    markPredicate(beAt + 1);
    return { ok: true, tokens, punct, pattern: 'slv', ...GX_PATTERNS.slv,
      note: 'be 动词（am/is/are）后面接"是什么 / 怎么样"，那部分叫表语。' };
  }

  /* 7. 实义动词 */
  if (tokens[i] && tokens[i].pos === '动词') {
    setRole(i, '谓语', '一句话只有一个谓语（动作王）');
    let hasObj = false;
    for (let k = i + 1; k < n; k++) {
      const t = tokens[k];
      if (t.pos === '介词') setRole(k, '状语');
      else if (t.pos === '冠词' || t.pos === '数词' || t.pos === '形容词' || GX_POSS.has(t.core)) setRole(k, '定语');
      else if (t.pos === '名词' || t.pos === '代词') { setRole(k, '宾语'); hasObj = true; }
      else setRole(k, '');
    }
    const pat = hasObj ? 'spo' : 'sp';
    return { ok: true, tokens, punct, pattern: pat, ...GX_PATTERNS[pat],
      note: hasObj ? '谁 + 干什么 + 什么；宾语就是被动作作用的东西。' : '只有"谁 + 干什么"也能成句。' };
  }

  return noVerbFallback();
}

/* ---------------- 一句话的三种面孔 ---------------- */
const GX_SUBJ = {
  i:    { en: 'I',    zh: '我',   person: 'first',  be: 'am', aux: "don't", qaux: 'Do',   adj: 'my' },
  you:  { en: 'You',  zh: '你',   person: 'second', be: 'are', aux: "don't", qaux: 'Do',  adj: 'your' },
  he:   { en: 'He',   zh: '他',   person: 'third',  be: 'is', aux: "doesn't", qaux: 'Does', adj: 'his' },
  she:  { en: 'She',  zh: '她',   person: 'third',  be: 'is', aux: "doesn't", qaux: 'Does', adj: 'her' },
  it:   { en: 'It',   zh: '它',   person: 'third',  be: 'is', aux: "doesn't", qaux: 'Does', adj: 'its' },
  we:   { en: 'We',   zh: '我们', person: 'first',  be: 'are', aux: "don't", qaux: 'Do',   adj: 'our' },
  they: { en: 'They', zh: '他们', person: 'third2', be: 'are', aux: "don't", qaux: 'Do',   adj: 'their' }
};
const GX_Q_SUBJ = { i: 'you', we: 'you', you: 'you', he: 'he', she: 'she', it: 'it', they: 'they' };
const GX_ANS_SUBJ = { i: 'I', we: 'we', you: 'I', he: 'he', she: 'she', it: 'it', they: 'they' };
const gxIsThird = s => GX_SUBJ[s].person === 'third';

/* 实义动词句：spec = { s:'he', v:'like', o:{ en:'apples', zh:'苹果' } } */
function gxStatement(spec) {
  const S = GX_SUBJ[spec.s];
  const v = gxIsThird(spec.s) ? (GX_THIRD[spec.v] || spec.v) : spec.v;
  return `${S.en} ${v}${spec.o ? ' ' + spec.o.en : ''}.`;
}
function gxNegative(spec) {
  const S = GX_SUBJ[spec.s];
  return `${S.en} ${S.aux} ${spec.v}${spec.o ? ' ' + spec.o.en : ''}.`;
}
function gxQuestion(spec) {
  const S = GX_SUBJ[spec.s];
  return `${S.qaux} ${GX_Q_SUBJ[spec.s]} ${spec.v}${spec.o ? ' ' + spec.o.en : ''}?`;
}
function gxShortAnswer(spec, yes) {
  const S = GX_SUBJ[spec.s];
  const aux = gxIsThird(spec.s) ? 'does' : 'do';
  return yes ? `Yes, ${GX_ANS_SUBJ[spec.s]} ${aux}.` : `No, ${GX_ANS_SUBJ[spec.s]} ${aux}n't.`;
}

/* be 句：spec = { s:'he', pred:{ en:'happy', zh:'开心' } } */
const gxBeStatement = spec => `${GX_SUBJ[spec.s].en} ${GX_SUBJ[spec.s].be} ${spec.pred.en}.`;
/* am 没有 amn't，只能写 I am not（教材同样这么写） */
const gxBeNegative = spec => {
  const be = GX_SUBJ[spec.s].be;
  return be === 'am'
    ? `${GX_SUBJ[spec.s].en} am not ${spec.pred.en}.`
    : `${GX_SUBJ[spec.s].en} ${be}n't ${spec.pred.en}.`;
};
/* 答语 / 问句里的 be 要跟着"换了人的主语"变：I am a boy. → Are you a boy? → Yes, I am. */
const GX_BE_OF = { i: 'am', you: 'are', he: 'is', she: 'is', it: 'is', we: 'are', they: 'are' };
const gxBeQuestion = spec => {
  const subj = GX_Q_SUBJ[spec.s];
  const be = GX_BE_OF[subj];
  return `${be[0].toUpperCase() + be.slice(1)} ${subj} ${spec.pred.en}?`;
};
const gxBeAnswer = (spec, yes) => {
  const subj = GX_ANS_SUBJ[spec.s];
  const be = GX_BE_OF[subj.toLowerCase()];
  if (yes) return `Yes, ${subj} ${be}.`;
  return be === 'am' ? `No, ${subj}'m not.` : `No, ${subj} ${be}n't.`;
};

/* can 句：spec = { s:'he', v:'swim' } */
const gxCanStatement = spec => `${GX_SUBJ[spec.s].en} can ${spec.v}.`;
const gxCanNegative = spec => `${GX_SUBJ[spec.s].en} can't ${spec.v}.`;
const gxCanQuestion = spec => `Can ${GX_Q_SUBJ[spec.s]} ${spec.v}?`;
const gxCanAnswer = (spec, yes) => (yes ? 'Yes, ' : 'No, ') + GX_ANS_SUBJ[spec.s] + (yes ? ' can.' : " can't.");

/* 三单练习：中文 → 选正确动词形式 */
function gxThirdItem(verb, zh, subj) {
  const s = subj || 'he';
  const third = GX_THIRD[verb];
  if (!third) return null;
  const S = GX_SUBJ[s];
  return {
    type: 'choice',
    prompt: `「${S.zh}${zh}」哪个说法对？`,
    options: [`${S.en} ${third}.`, `${S.en} ${verb}.`, `${S.en} ${verb}ing.`],
    answer: 0,
    say: `${S.en} ${third}.`,
    zh: `${S.en} ${third}. ${S.zh}${zh}。`,
    explain: `主语是第三人称单数（${S.en}），动词要加 s / es：${verb} → ${third}。`
  };
}

/* ---------------- 名词规则（句子工厂与游戏共用） ----------------
   不可数名词：既不能加 a/an，也不能加 s。
   注意 fish / chicken 不算在内——「a fish」「a chicken」都对，
   fish 只是复数同形（走 IRREG_PLURAL），chicken 正常加 s。 */
const UNCOUNTABLE = new Set(['bread','milk','water','juice','rice','meat','soup','tea',
  'coffee','butter','cheese','food','ice','grass','snow','rain','paper','money',
  'music','homework','sugar','salt','fruit','news']);
/* 只有复数形式的名词：英语里从不单用，所以既不能加 a/an，也不能当单数主语。
   ★ 2026-10-26 修的 bug：这些词原来被 countable() 判成可数，生成了
     "There is a scissors on the desk" / "This is a pants" 这种错句。
     scissors 一套两片、trousers/pants/shorts 两条腿、clothes 衣件总称 ——
     只能用 a pair of ... 或者直接复数主语。 */
const PLURAL_ONLY = new Set(['scissors','trousers','pants','shorts','clothes',
  'jeans','pyjamas','pajamas','chopsticks','french fries']);
const IRREG_PLURAL = { fish:'fish', goose:'geese', mouse:'mice', sheep:'sheep', deer:'deer',
  ox:'oxen', person:'people', man:'men', woman:'women', child:'children', foot:'feet',
  tooth:'teeth', knife:'knives', leaf:'leaves', tomato:'tomatoes', potato:'potatoes',
  photo:'photos', piano:'pianos' };
const wordOf = w => String(w && w.w !== undefined ? w.w : w);
const countable = w => {
  const x = wordOf(w).toLowerCase();
  return !UNCOUNTABLE.has(x) && !PLURAL_ONLY.has(x);
};
/* 能不能用「a/an + 词」：可数单数才行 */
const takesArticle = w => countable(w);

/* ---------------- a / an 的判定 ----------------
   ★ 2026-10-26 修的 bug：原来用首字母判断（/^[aeiou]/ → an），
     这必然错 —— 冠词看的是**读音首音素**，不是首字母：
       a hour（h 不发音，实际 /aʊə/ 元音开头）→ 应该 an hour
       a honest boy（同上）→ 应该 an honest
       a useful book（u 发 /juː/，辅音开头）→ 现在给的是 an useful（错）
       a one-way street（o 发 /w/）→ 现在给的是 an one（错）
     例外表比规则可靠：小学词库会踩坑的就这几个，穷举掉最稳。 */
const AN_WORDS = new Set(['hour','honest','honor','honour','heir','herb','honorary']);
const A_WORDS = new Set(['one','once','useful','useless','university','uniform','united',
  'unit','union','unique','user','usual','usually','utility','european','music',
  'ukulele','eulogy','ewe','ubiquitous']);
function artOf(w) {
  const x = wordOf(w).toLowerCase().trim();
  if (!x) return 'a';
  if (AN_WORDS.has(x)) return 'an';
  if (A_WORDS.has(x)) return 'a';
  /* 缩写按字母名读：an MBA / an hour，但 a UFO —— 词库里没有缩写，先不处理 */
  return /^[aeiou]/i.test(x) ? 'an' : 'a';
}
/* 只有"加 s 一定对"的词才进复数题——白名单比黑名单可靠：
   除了 s/x/z/sh/ch/o/f/fe/man/ouse/oose 结尾和辅音+y、不规则复数，
   其余才放行（giraffe 这种 -ffe 结尾是安全的，单独放行）。 */
const pluralSafe = w => {
  const x = wordOf(w).toLowerCase();
  if (!countable(w) || IRREG_PLURAL[x]) return false;
  if (!/^[a-z]+$/.test(x)) return false;
  if (/ffe$/.test(x)) return true;
  if (/(s|x|z|sh|ch|o|f|fe|man|ouse|oose)$/.test(x)) return false;
  if (/[^aeiou]y$/.test(x)) return false;
  return true;
};
function pluralOf(w) {
  const x = wordOf(w), k = x.toLowerCase();
  if (IRREG_PLURAL[k]) return IRREG_PLURAL[k];
  if (/[^aeiou]y$/i.test(x)) return x.slice(0, -1) + 'ies';
  if (/(s|x|z|sh|ch|o)$/i.test(x)) return x + 'es';
  return x + 's';
}
