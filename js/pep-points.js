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
/* ★ 2026-11-15（第三轮复检 B2 精准修）：phonics.js 明确宣布「整体认读」的词。
   这些词在拼读课里没有 segs（硬拼会把 cake 读成 /kæke/、把 shoe 的哑巴 e 念出来）。
   词卡之前仍走 splitBlocks 逐音拆，属于同一站两套标准：对这些词改为整词认读提示。
   其余词保持逐音素拆——那正是 phonics.js segs 的做法（cat→c·a·t），实测 106/109 一致。 */
const PH_WHOLE_WORDS = new Set('rabbit egg doctor wash shoe chair peach teacher thumb cake lake name plate grape whale gate game kite bike nine white ice five rice time nose rose home bone stone rope afternoon away today garden market horse short chicken young along cute use rule'.split(' '));
/* 视觉词（phonics.js SIGHT_WORDS 同步清单）：逐音拆会把 the 拆成 t·h·e，必须整词认读。 */
const PH_SIGHT_WORDS = new Set('the a is my he she we you are they this that said one two was has were come some have do does of to them there what where who why out now all her'.split(' '));
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
function phonicsLine(w) {
  return splitPhrase(w).map(p => {
    const key = p.toLowerCase().replace(/[^a-z]/g, '');
    /* 2026-11-15.2（第四轮验收 B2）：三层判定。
       ① 拼读课 segs 覆盖的词走 segs（splitBlocks 与之一致，106/109）；
       ② 整体认读词 / 视觉词：硬拼会把 the 拆成 t·h·e、把 cake 的哑巴 e 念出来；
       ③ 多音节词（splitSyllables>=2）：breakfast / grandma / umbrella 这类，逐音素拆
          没有音节边界，会让孩子按 /æ/ /e/ 硬拼——一律整词认读；
       剩单音节规则词（cat / hat / dog）保留逐音素拆，那正是拼读教学标准。 */
    if (key && (PH_WHOLE_WORDS.has(key) || PH_SIGHT_WORDS.has(key))) return p + '（整词认读）';
    if (key && splitSyllables(p).length >= 2) return p + '（整词认读）';
    return splitBlocks(p).join(' · ');
  }).join(' ／ ');
}

/* ============================================================================
   ★ 2026-11-24.9 全站统一「可点读拼读拆解」引擎 pbx（phonics blocks extended）
   用户诉求：「单词下面的拼读模块太多整体认读，能拆都拆；拆开后每个音节用自然
   拼读发音；不是自然拼读的给解释；单词镇/人教/GS/PU 全部都要。」

   设计红线（务必遵守）：
     · 音素录音只有 39 个真人音（26 单字母 + 13 组合），禁止合成新音。
     · 所以「发音」只走这些真音 + 同音异拼 alias；发不出来的组合不硬造音，
       而是给一句为什么（读音例外），这正是用户说的「给解释」。
     · 音节只是视觉分组，真正发声的是音节内的音素块——这才是纯正自然拼读。
     · 整词标准音永远用 speakWord()（站内词音频），是唯一权威读音。

   本函数不依赖 js/phonics.js（四页未加载），只依赖 app.js 暴露的全局：
   window.phonicsURL / window.playAudioChain / window.speakWord。
   ============================================================================ */

/* 与 phonics.js 的 PH_BLEND_OK / PH_ALIAS 逐字一致（口径同源，四页可用） */
const PBX_BLEND_OK = new Set('sh ch th ai ay oa ck ee oo ar or ir ng'.split(' '));
const PBX_ALIAS = {
  bb:'b', cc:'c', dd:'d', ff:'f', gg:'g', ll:'l', mm:'m', nn:'n',
  pp:'p', rr:'r', ss:'s', tt:'t', zz:'z',
  ea:'ee', ie:'ee', ue:'oo', wh:'w', le:'l', ge:'j', dge:'j'
};
/* 块 → 真人音素录音 URL；'' 表示没有可靠录音（不发声，改给解释） */
function pbxSoundURL(b) {
  const k = String(b == null ? '' : b).toLowerCase().trim();
  if (!k || typeof phonicsURL !== 'function') return '';
  if (/^[a-z]$/.test(k)) return phonicsURL(k);
  if (PBX_BLEND_OK.has(k)) return phonicsURL(k);
  const a = PBX_ALIAS[k];
  return a ? phonicsURL(a) : '';
}
/* 视觉词（高频不规则）：整词认读，给一句「为什么不能按字母拼」 */
const PBX_SIGHT_NOTE = {
  the:'th 在这里是浊音 /ð/（不像 think 的清音），e 读轻声，整体记住',
  a:'a 在句子里读轻声 /ə/，不是字母名 /eɪ/',
  is:'s 在这里读 /z/，整体记住',
  my:'词尾 y 读 /aɪ/，整体记住', he:'词尾 e 读 /iː/，整体记住',
  she:'词尾 e 读 /iː/，整体记住', we:'词尾 e 读 /iː/，整体记住',
  you:'ou 在这里读 /uː/，不是 /aʊ/，整体记住',
  are:'are 读 /ɑːr/，不是 a+r 分开念', they:'ey 读 /eɪ/，整体记住',
  this:'th 是浊音 /ð/，整体记住', that:'th 是浊音 /ð/，整体记住',
  said:'ai 在这里读 /e/（例外），整体记住',
  one:'o 读 /wʌ/，开头有 w 音，整体记住',
  two:'tw 读 /t/（w 不发音），整体记住',
  was:'a 读 /ɒ/、s 读 /z/，整体记住',
  has:'a 读 /æ/、s 读 /z/，整体记住',
  were:'ere 读 /ɜːr/，整体记住',
  come:'o 读 /ʌ/、词尾 e 不发音，整体记住',
  some:'o 读 /ʌ/、词尾 e 不发音，整体记住',
  have:'a 读 /æ/、词尾 e 不发音，整体记住',
  do:'o 读 /uː/，整体记住', does:'o 读 /ʌ/，整体记住',
  of:'o 读 /ə/、f 读 /v/，整体记住', to:'o 读 /uː/，整体记住',
  them:'th 是浊音 /ð/，整体记住', there:'th 浊音、ere 读 /er/，整体记住',
  what:'wh 读 /w/、a 读 /ɒ/，整体记住', where:'wh 读 /w/、ere 读 /er/，整体记住',
  who:'wh 读 /h/、o 读 /uː/，整体记住', why:'wh 读 /w/、y 读 /aɪ/，整体记住',
  out:'ou 读 /aʊ/，整体记住', now:'ow 读 /aʊ/，整体记住',
  all:'al 读 /ɔː/，整体记住', her:'er 读 /ɜːr/，整体记住',
};
function pbxSightNote(w) {
  return PBX_SIGHT_NOTE[String(w).toLowerCase()] || '这是高频词，有特别读音，整体记住';
}

/* 发不出来的块，给一句「为什么不是自然拼读」的解释 */
const PBX_NOTE = {
  er:'er 读 /ɚ/（带 r 的音），没有单块录音，跟着整词念',
  ir:'ir 读 /ɜːr/，和 er 很像，跟着整词念',
  ur:'ur 读 /ɜːr/，和 ir 很像，跟着整词念',
  ar:'ar 读 /ɑːr/，跟着整词念',
  or:'or 读 /ɔːr/，跟着整词念',
  ou:'ou 多数读 /aʊ/（house），也读 /u/（you）、/ʌ/（young）——按整词记',
  ow:'ow 读 /aʊ/（cow）或 /oʊ/（snow、yellow）——按整词记',
  'igh':'igh 读 /aɪ/，和字母 I 同名（night、light、high）',
  ear:'ear 多读 /ɪə/（hear、near），也读 /eə/（bear）、/ɜː/（learn）',
  ew:'ew 读 /uː/（new）或 /juː/（few、new）',
  ui:'ui 常读 /uː/（fruit、juice 这里例外读 /ɪ/）',
  oi:'oi 读 /ɔɪ/（coin、choice）',
  oy:'oy 读 /ɔɪ/（boy、toy），和 oi 同音',
  au:'au 读 /ɔː/（autumn）或 /ɑː/（because 例外）',
  aw:'aw 读 /ɔː/（draw、law、saw）',
  'tion':'tion 读 /ʃən/，是名词后缀（action、station）',
  ph:'ph 读 /f/（phone、photo、elephant）',
  qu:'qu 读 /kw/（queen、quick、question）',
  kn:'k 不发音，kn 只读 /n/（knee、know、knife）',
  wr:'w 不发音，wr 只读 /r/（write、wrong）',
  mb:'词尾 b 不发音（comb、climb、bomb）',
  'e': '词尾的 e 不发音——它让前面的元音念自己的字母名（magic e）',
};
function pbxNote(b) {
  const k = String(b == null ? '' : b).toLowerCase().trim();
  if (PBX_NOTE[k]) return PBX_NOTE[k];
  /* 魔法 e：a_e / i_e / o_e / u_e */
  if (/^[aiou]_e$/.test(k)) return '魔法 e：结尾 e 不出声，让 ' + k[0] + ' 读字母名';
  return '这组字母有特别读音，先听整词记住它';
}
/* 词尾哑音 e 检测：cake / bike / nose / cute（元音+辅音+不发音e） */
function pbxMagicE(s) {
  return /^[a-z]+$/.test(s) && s.length >= 3 && s.endsWith('e') &&
    /[aeiou]/.test(s[s.length - 3]) && !/[aeiou]/.test(s[s.length - 2]) &&
    !/(che|she|the|ge|be|me|we|he|re|ve)$/.test(s);
}
/* 解码一个词（短语按空格/连字符分段）。每段 → 音节 → 音素块。
   返回 { parts:[{raw, syls:[{raw, blocks:[{raw,url,note?}], playable}]}], whole:bool } */
function pbxDecode(w) {
  /* 只有「视觉词」真正整体认读（the/is/my… 硬拼会读错）。
     PH_WHOLE_WORDS 里的魔法e/缺块词（cake/night/boy…）现在都按新引擎拆：
     能发音的块发音，缺录音的块给解释——这正是用户要的「能拆都拆」。 */
  const wholeSet = PH_SIGHT_WORDS;
  const parts = splitPhrase(w).map(raw => {
    const low = raw.toLowerCase().replace(/[^a-z]/g, '');
    const magic = pbxMagicE(low);
    const syls = splitSyllables(raw).map((sraw, sidx, arr) => {
      const blocks = splitBlocks(sraw).map((br, bidx) => {
        /* 魔法 e：最后音节的最后一块 e 不发音（硬发会让 cake→/kæ-ke/） */
        const isMagicE = magic && sidx === arr.length - 1 && bidx === splitBlocks(sraw).length - 1
          && br.toLowerCase() === 'e';
        const url = isMagicE ? '' : pbxSoundURL(br);
        const note = url ? '' : (isMagicE ? pbxNote('a_e') : pbxNote(br));
        return { raw: br, url: url, note: note };
      });
      return { raw: sraw, blocks: blocks, playable: blocks.some(b => !!b.url) };
    });
    const whole = !!wholeSet.has(low) && syls.length === 1;
    return { raw: raw, syls: syls, magic: magic, whole: whole,
             wholeNote: whole ? pbxSightNote(low) : '' };
  });
  return { parts: parts };
}

/* 渲染注册表：索引 → 解码结果 + 原始词 */
const PBR = [];
function pbxReg(w) { PBR.push({ w: String(w), d: pbxDecode(w) }); return PBR.length - 1; }
function escPB(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

/* 播放：单块 / 单音节（块串）/ 整词（块串+标准音收尾） */
function pbxPlayOne(i, si, bi) {
  const e = PBR[i]; if (!e) return;
  const blk = e.d.parts[0].syls[si].blocks[bi];
  if (!blk.url) { pbxExplain(i, si, bi); return; }
  sfx && sfx.pop && sfx.pop();
  playAudioChain([blk.url]);
}
function pbxPlaySyl(i, si) {
  const e = PBR[i]; if (!e) return;
  const urls = e.d.parts[0].syls[si].blocks.map(b => b.url).filter(Boolean);
  sfx && sfx.pop && sfx.pop();
  if (urls.length) playAudioChain(urls, null, 240);
  else speakWord(e.w);
}
function pbxBlend(i) {
  const e = PBR[i]; if (!e) return;
  sfx && sfx.pop && sfx.pop();
  /* 视觉词/整体认读词：不按字母逐块拼（会把 the 读成 t-h-e），直接整词发音 */
  if (e.d.parts.some(p => p.whole)) {
    const note = document.getElementById('pbxNote' + i);
    if (note) { note.textContent = '💡 ' + e.d.parts.find(p => p.whole).wholeNote; note.style.display = 'block'; }
    speakWord(e.w); return;
  }
  const urls = [];
  e.d.parts.forEach(p => p.syls.forEach(s => s.blocks.forEach(b => { if (b.url) urls.push(b.url); })));
  if (urls.length) playAudioChain(urls, () => speakWord(e.w), 200);
  else speakWord(e.w);
}
function pbxExplain(i, si, bi) {
  const e = PBR[i]; if (!e) return;
  const blk = e.d.parts[0].syls[si].blocks[bi];
  const el = document.getElementById('pbxNote' + i);
  if (el) { el.textContent = '💡 ' + blk.raw + '：' + blk.note; el.style.display = 'block'; }
}
window.PBR = PBR; window.pbxPlayOne = pbxPlayOne; window.pbxPlaySyl = pbxPlaySyl;
window.pbxBlend = pbxBlend; window.pbxExplain = pbxExplain; window.pbxReg = pbxReg;

/* 生成可点读拼读模块 HTML：紧凑一行（音素块 chip + 拼一拼），解释默认收起。
   参数 opt.slim=true 时更精简（用于课本词卡窄行）。 */
function pbxHTML(w, opt) {
  opt = opt || {};
  const i = pbxReg(w);
  const e = PBR[i];
  const sylSep = opt.slim ? '<i class="pbx-dot">·</i>' : '<i class="pbx-mid">·</i>';
  const sylHTML = [];
  e.d.parts.forEach((p, pi) => {
    if (pi) sylHTML.push('<span class="pbx-slash">／</span>');
    p.syls.forEach((s, si) => {
      if (si) sylHTML.push(sylSep);
      const chips = s.blocks.map((b, bi) => {
        const cls = b.url ? 'pbx-b' : 'pbx-b pbx-b-x';
        const fn = b.url ? 'pbxPlayOne' : 'pbxExplain';
        const tip = b.url ? ('点我听 ' + b.raw + ' 的音') : (b.raw + '：' + b.note);
        return `<button class="${cls}" onclick="event.stopPropagation();${fn}(${i},${si},${bi})" title="${escPB(tip)}">${escPB(b.raw)}</button>`;
      }).join('');
      sylHTML.push(`<span class="pbx-syl" onclick="event.stopPropagation();pbxPlaySyl(${i},${si})" title="点音节听拼读">${chips}</span>`);
    });
  });
  const wholePart = e.d.parts.find(p => p.whole);
  const sylsArea = wholePart
    ? `<span class="pbx-whole" onclick="event.stopPropagation();pbxBlend(${i})" title="点我听整词">${escPB(e.d.parts.map(p=>p.raw).join(' '))} · 整体认读</span>`
    : sylHTML.join('');
  return `<div class="pbx${opt.slim ? ' pbx-slim' : ''}">
    <span class="pbx-tag">🔤</span>
    <span class="pbx-syls">${sylsArea}</span>
    <button class="pbx-go" onclick="event.stopPropagation();pbxBlend(${i})" title="${wholePart ? '听整词读音' : '按自然拼读逐块拼，再读整词'}">${wholePart ? '🔊' : '▶拼'}</button>
    <div class="pbx-note" id="pbxNote${i}" style="display:none"></div>
  </div>`;
}
window.pbxHTML = pbxHTML;
window.pbxDecode = pbxDecode;

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
  supermarket: ['super 超级', 'market 市场'], 'green bean': ['green 绿色', 'bean 豆'], chopstick: ['chop 快（洋泾浜「快子」）', 'stick 棍'],
  hamburger: ['Hamburg 汉堡城', 'er 从那儿来的'], 'ice cream': ['ice 冰', 'cream 奶油'], 'pocket money': ['pocket 口袋', 'money 钱'],
  schoolbag: ['school 学校', 'bag 包'], 'space station': ['space 太空', 'station 站'], 'outer space': ['outer 外面', 'space 太空'],
  'air conditioner': ['air 空气', 'conditioner 调节器'], 'runny nose': ['runny 流水的', 'nose 鼻子'],
  'dining hall': ['dining 用餐', 'hall 大厅'], 'gingerbread house': ['ginger 姜', 'bread 面包', 'house 房子'],
  'book fair': ['book 书', 'fair 集市'], 'count down': ['count 数', 'down 向下'], 'save up': ['save 存', 'up 起来'],
  'stay up': ['stay 待着', 'up 不躺'], 'run out': ['run 跑', 'out 光了'], 'make the bed': ['make 铺', 'bed 床'],
  'look after': ['look 看', 'after 后面'], 'look up': ['look 查', 'up 向上'], 'turn off': ['turn 拧', 'off 关掉'],
  'hand out': ['hand 递', 'out 出去'], 'get together': ['get 聚', 'together 在一起'],
  'hard-working': ['hard 努力', 'working 工作'], hometown: ['home 家', 'town 镇'], sunshine: ['sun 太阳', 'shine 照耀'],
  waterfall: ['water 水', 'fall 落下'], 'piggy bank': ['piggy 小猪', 'bank 存钱的地方'], 'go hiking': ['go 去', 'hiking 徒步'],
  'go cycling': ['go 去', 'cycling 骑行'], 'went camping': ['went 去（过去式）', 'camping 露营'], 'went fishing': ['went 去（过去式）', 'fishing 钓鱼'],
  'took pictures': ['took 拍（过去式）', 'pictures 照片'], 'had a cold': ['had 得了（过去式）', 'a cold 感冒'],
  month: ['moon 月亮', 'th 名词后缀'], astronaut: ['astro 星星', 'naut 航行者'], taikonaut: ['taikong 太空', 'naut 航行者'],
  underground: ['under 地下', 'ground 地面'], 'ping-pong': ['乒 ping', 'pong 乓'], 'ice-skate': ['ice 冰', 'skate 滑'],
  'Eiffel Tower': ['Eiffel 埃菲尔（人名）', 'Tower 塔'], 'Beijing opera': ['Beijing 北京', 'opera 戏剧'],
  'Mount Taishan': ['Mount 山峰', 'Taishan 泰山'], 'Dragon Boat Festival': ['Dragon 龙', 'Boat 船', 'Festival 节'],
  'Labour Day': ['Labour 劳动', 'Day 节日'], 'National Day': ['National 国家', 'Day 节日'], maybe: ['may 可能', 'be 是'],
  everyday: ['every 每个', 'day 天'], today: ['to 在（古义：on this day）', 'day 天'], weekend: ['week 周', 'end 末尾'],
  birthday: ['birth 诞生', 'day 日子'], sometimes: ['some 有些', 'times 次'], seafood: ['sea 海', 'food 食物'],
  hotpot: ['hot 热的', 'pot 锅'], toothpaste: ['tooth 牙齿', 'paste 膏'], toothbrush: ['tooth 牙齿', 'brush 刷子'],
  someone: ['some 某个', 'one 人'], anything: ['any 任何', 'thing 东西'], everything: ['every 每个', 'thing 东西'],
  nothing: ['no 没有', 'thing 东西'], internet: ['inter 互相', 'net 网'],
};

/* ---- 词性查询：显式表(pep-mem.js) → 词库借用 → 词形规则 ---- */
function pepPosKey(w) {
  /* 词性查询：条目自带 pos（按单元语境）→ 显式表 → 词库借用 → 词形规则 → 名词兜底 */
  const s = String(w.w || w).toLowerCase();
  /* ★ 2026-11-21.1（第十轮复检 B1）：同一个词在不同单元词性不同——
     dress 四下「连衣裙」是名词、六上「穿衣服」是动词；light 四下「灯」、六上「照亮」；
     milk 三下「奶」、四下「挤奶」。全局一张表按 for...in 键序取首个命中，
     必然把其中一边标错。改为**词条级 pos 优先**，只有没标时才走全局表。 */
  if (w && typeof w === 'object' && w.pos) return w.pos;
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
     ② 不许剥斜杠——原来 replace(/^\/+|\/+$/g,'') 把 /stɑːt/ 剥成 stɑːt，
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
