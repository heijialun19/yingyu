# 版本快照 · 小鸟英语乐园 Birdie ABC

> 本文件是给修改者（人类或 AI）看的版本基准。改动任何文件前先读完这份说明。

## 基本信息

- 线上地址：https://heijialun19.github.io/yingyu/
- 仓库：heijialun19/yingyu（main 分支，GitHub Pages）
- 快照日期：2026-11-08（发音全面重做 + 许可补齐，见文末）
- 本包 = 线上 main 分支的完整快照；核验是否最新，以 GitHub 仓库 main 分支与「最近提交」为准
- 技术栈：纯 HTML/CSS/原生 JS，零依赖、零构建，进度存 localStorage（多档案 birdie_abc_profiles_v2）

## 各文件版本号（改了哪个文件，就把它的 ?v= 加 1）

| 文件 | 版本 | 说明 |
|---|---|---|
| js/app.js | v153 | 全站共享运行时：发音系统（只用站内音频 + 系统语音兜底）、词图、星星、档案、导航 |
| js/books-data.js | v2 | 读书馆 15 本分级拼读小书（2026-11-14.16 新增）：严格可解码（已教音素可拼校验），每本 4-25 词、读后 3 题；read.html 消费 |
| js/phonics.js | v7 | 自然拼读数据与发音助手：PHONICS 24 词族 + PH_BLEND_OK + PH_BLOCKS 13 块 + 视觉词/可解码句/拼写词表；v7 新增 **PH_LEVELS / PH_L1_BATCHES 分级闯关数据**（纯新增，games/index 向后兼容）。拼读课 / 首页专栏 / 拼读闯关三方同源 |
| svg/emoji-core.js | v3 | 轻页面核心表情库（界面核心 ~80 条；视觉簇扫描含 👨‍👩‍👧 家庭组合与 6 个年级 emoji，尾部 __emojiSvgReady 回调触发替换；app.js inject 加 onload 兜底） |
| js/words-data.js | v46 | 999 词词库（2026-11-09.15：colour/color 合并为一条） |
| js/data.js | v45 | 字母岛 / 句子工厂等数据（v33：THEMES 去掉 flatMap，见文末） |
| js/sentence.js | v52 | 句子朗读引擎（整句音频优先 / 逐词接龙兜底 + 高亮），句子工厂/游戏/Get Smart 共用 |
| js/speech.js | v1 | 跟读评分引擎（浏览器语音识别 → 「听清度」，**不是**发音评分） |
| js/grammar-engine.js | v9 | 语法引擎（词性、复数、冠词、句型转换、能不能加 a/an） |
| js/ipa.js | v9 | 音标 |
| js/ipa-gs.js | v3 | Get Smart 学堂页补充美式音标 646 条（2026-11-14.1 新增；仅 getsmart.html 引，末尾 Object.assign 并入主表） |
| js/build-data.js | v3 | 造词实验室题库（合成词 / 派生词 / 词根） |
| js/getsmart-data.js | v16 | Get Smart 1-6 全系列课程数据（6 册 237 课） |
| js/pep-data.js | v2 | 人教版 8 册 47 单元词表 |
| js/pep-lessons.js | v3 | 人教版单元知识点「基础篇」273 张卡。**仅 pep.html 引**；`en:` 字段与整句音频对账；v3 起 `pepPointsOf()` 会把 js/pep-points-more.js 的拓展条拼在后面 |
| js/pep-points-more.js | v1 | 人教版单元知识点「拓展篇」282 张卡（2026-11-14.6 新增）。每单元 +6 条，全站 273 → 555；只写课本主线之外的角度，与基础篇零撞题 |
| js/pep-mem.js | v5 | PEP 记忆法 891 条 + 词性表 + 音标补充表（gzip 33.6KB）。getsmart / pep 引 |
| js/pep-points.js | v24 | 拼读 / 音节工具 + 课本查询函数（2026-11-12.3 拆瘦到 gzip 8.8KB）；三页共用 |
| js/audio-list.js | v8 | 发音清单（2903 条 slug，构建产物）。defer 加载，file:// 也能用；改了音频必须与 AUDIO_VER 一起升 |
| css/style.css | v53 | 全站样式（含首屏加载层 10 秒兜底；F2 次级文字对比度与音标字号） |
| svg/word-svg.js | v7 | 379 张自绘词图（346 张卡通 + 33 张数字 / 日历 / 国旗卡；3 张泄答案图已重画，board / blackboard 共用黑板画） |
| svg/emoji-svg.js | v6 | 内置 emoji SVG **基础库 626 条**。**用 async 加载，不挡首屏**，挂 `window.WORD_EMOJI` |
| svg/emoji-svg2.js | v3 | 内置 emoji SVG **课程扩展 227 条**（含 13 面国旗）。getsmart.html / pep.html 加载，async |
| audio/phonics/ | v2 | **26 个字母音 + 13 个拼读块**（母语者录音，s5s5/phonics，MIT，见 THIRD-PARTY-NOTICES.txt）。不进 audio-list 清单，用 app.js 的 `PHONICS_VER` 独立版本号；重做时只升它，不动 AUDIO_VER |
| sw.js | birdie-abc-v212 | Service Worker（音频缓存 birdie-audio-v5 不随发版清；换名时自动删旧音频缓存）；CORE 含两个 async 图库 |
---

## 2026-11-14.17 · 读书馆质检修订（测验答案分布 / 歧义 / 发音注记）

用户：「这几本书足够好了吗？有没有语法错误？有没有单词错误？」→ 全文重审 15 本书。
结论：**拼写与语法硬错误 0 处**（逐句人工复核 + 校验器），但抓到 3 类质量问题并修复：

- **测验答案分布**（最严重）：b5/b6/b8/b10/b12/b14/b15 七本书 3 题正确答案全在第 1 项，
  孩子蒙「A」即可全对。已打散 8 本书选项顺序（含 b3 双 0），全站答案位置 17/17/11，
  且逐题复核答案内容无一错位。
- **b1 测验歧义**：「猫坐在哪里？」猫既坐过垫子又坐过老鼠 → 改「故事开头，猫坐在哪里？」
- **发音/词义注记**（英文句与音频不动）：away / today 首音节弱读 /ə/（音素直拼会教错音）→
  标注「整体认读」；horse 词尾 e 不发音；pen 注明「围栏（养动物的）」以区分钢笔。
- 复核确认不改：无谓语的片段句（A dish on the ship! 等）是 Bob Books 式图说体，合规；
  b9「Three green feet!」偏无厘头但不算错（改动需重合成音频，收益低）。
- 可解码校验 _check_books.py 重跑 15/15 全过。零音频变更，books-data.js v2。

## 2026-11-14.16 · 读书馆上线（15 本分级拼读小书）

用户：「增加一下读书馆吧。Starfall 15 本循序拼读书。不需要太多，只要求优质。」

### 学了谁的做法（调研结论）
- **Starfall Learn to Read**：15 本序列拼读书（Zac the Rat 起步），每本聚焦一个元音/规则，
  点词听音素拼合、点句听整句、读完配活动——「书序 = 教学序」。
- **Bob Books**：每本 12 页仅 8-25 个不重复词、极简句（Bud has a box.）、极少视觉词、
  幽默插画与荒诞收尾（"I read the whole book!" 成就感）。

### 本站实现（宁少而精，15 本封顶）
- **内容铁律**：每页每词必须「已教音素可拼」（单字母→sh/ch/th/ck/ng→连缀→ee/oo/ai/ay/oa→
  魔法 e→ar/or/ir）或为显式视觉词；_check_books.py 强制校验（含复数还原、胶水词表），
  15 本全部通过。每本 4-25 个不重复词、句长 ≤8 词、重复句式 + 荒诞小笑点收尾。
- **级别映射**：B1-B5=L2 短元音 → B6-B7=L3 双辅音 → B8=L4 连缀 → B9-B10=L5 元音组合
  → B11=L6 魔法 e → B12=L7 卷舌音 → B13=L8 视觉词（16 个视觉词小书）→ B14-B15=L9 毕业读物。
- **交互**：书架（分级分组）→ 阅读器（点句整句朗读+词高亮、点词听音、中文开关、生词表点读、
  翻页预热）→ 读后 3 题 → ⭐+2 奖励与彩蛋式庆祝；进度存 localStorage bk1；
  read.html#bN 直开某书（拼读关卡收尾「去读小书」按钮按关卡映射跳转）。
- **音频**：104 条整句（length 1.1 / 64k / 22050 mono）+ 9 个缺词（sat/mat/pit/hop/pup/mud/
  dish/grab/dark）词级 mp3，C2 声线 speaker 381、noise 0/0 确定性合成，QA 全过（句 1.08-2.54s、
  词 0.47-0.65s、无削波）。SENTENCE_VER 不升（纯新增），SENTENCE_AUDIO 830→934，audio-list 2903→2912。
- **版本链**：app v152（BUILD .14.16）/ CACHE v211 / books-data.js v1 新增 / audio-list v9；
  CORE 加 read.html + books-data.js；首页岛屿、拼读关卡收尾、家长中心计数同步。

## 2026-11-14.15 · 拼读课评测 + 趣味升级（定级测 / 掌握门槛 / 彩蛋 / 家长报告）

用户：「这个自然拼读体系做到市面上最优秀了么？」→ 对标 Reading Eggs / Starfall / 斑马 / 叽里呱啦，
评测与趣味是最大短板，本轮补 P2（对标 Reading Eggs 的「蒙不过去」设计）。

### 改了什么（全部在 phonics.html，phonics.js 数据形状不动）
- **定级测**：8 题摸底（L1→L8 各 1 题，听音三选一），第一道做错的题对应关 = 起点；
  全对从 L9 开始。结果存 `phstat2`，家长报告与地图可见。答错不惩罚。
- **掌握门槛（能量条 7 格）**：听音挑一挑从「3 题对 2」改为「答对 7 格才亮星」——
  答错本题重来（蒙不过去），逐关记录对/错计数。星星改为能量满格自动点亮，
  撤掉旧的「我会了」手点按钮（L9 拼写 ≥8/10 同理）。
- **奖励收集**：9 关各 1 枚彩蛋（过关点亮，地图蛋格展示，弹窗 + sfx 庆祝）；
  连续学习天数 streak（本地日期去重，记最佳）。老用户已点亮的星星自动补发彩蛋。
- **家长学习报告**：通关进度 / 连续天数 / 累计答题 / 正确率 + 逐关对错表 +
  动态学习建议（定级结果、正确率 <70% 的关提醒重练、下一关指引）+ 清空本机记录。
  数据只存 localStorage（`phlv1` 星星 + `phstat2` 学情），不上传。
- 版本链：app v151（BUILD 2026-11-14.15）/ CACHE v210；**零音频变更**，phonics.js 仍 v7。

## 2026-11-14.14 · 自然拼读专栏分级闯关重构（9 关 + 工具箱，一关一屏）

用户：「自然拼读专栏设计的还是不大好，从上到下太长了，小孩子都不想翻了，能优化体系么，分级一下。
对照网上市面上所有的优秀的自然拼读体系，继续优化。」

### 对标结论（方法论，内容仍全部自研、零搬运）
- **Jolly Phonics**：42 音素按 7 组教（s a t i p/n 起步——首组就能拼出最多词）；5 技能线
  （字母音→书写→拼合→拆音→tricky words）；视觉词按需分批引入。
- **Letters and Sounds**（英国 DfE）：6 阶段递进，每阶段配 tricky words + 可解码读物。
- **Oxford Phonics World**：5 级（字母→短元音→长元音/魔法e→辅音组合→字母组合），
  每级 8 单元 + 复习单元 + 故事，单元内「音→词→句」闭环。
- 共同点：**分级短单元、学→拼→读句→测闭环、视觉词与读物随级引入、进度感**。
  原页面 11 站从头滚到底（一屏 ~15000px），正是缺这四条。

### 改了什么
- **phonics.html 全量重构为「关卡地图 + 一关一屏」**：
  L1 字母音启蒙（26 音按 Jolly 式顺序分 4 批，s a t i p/n 起步、b/d 分批）
  → L2 短元音（5 词族）→ L3 双辅音（5 词族）→ L4 辅音连缀（3 词族）
  → L5 元音组合（4 词族）→ L6 魔法 e（4 词族）→ L7 卷舌音（3 词族）
  → L8 视觉词（35 词分 3 批）→ L9 听音能写 → TX 工具箱（13 块速查 + 规则彩蛋）。
  一次只渲染一关；词族/批次用 details 折叠，一屏只展开一个。
- **每关四段闭环**：🎯目标条 → 学/拼（折叠词族）→ 📖读句子 → 🎮听音挑一挑（3 题）。
- **可解码句按「用到的最难规则」挂进对应关**：L2×2 / L3×1 / L4×2 / L5×3 / L6×1 / L7×1
  （原 10 句全部保留）。视觉词早批（the/a/is/my/he/she/has/we）随 L2/L3/L5 句子先认，
  L8 全表 35 词螺旋复习——对标 Jolly tricky words / Letters and Sounds 阶段词表。
- **进度系统**：localStorage `phlv1`，每关「⭐我会了」或小挑战 ≥2/3 点亮星星；
  地图显示 ⭐/当前关；默认落在第一关未通关处。
- **听音挑一挑**：L1 听音找字母、L2-L7 听音找词、L8 听音找视觉词——全部走既有站内音频
  （phPlayBlock / phPlayWord / phSpeakWord，发音铁律不变，weak_a 弱读链保留）。
- **旧锚点兼容**：#s1…#s11 自动映射到新关卡（s3→L2、s9→L8……）。
- phonics.js **只新增** PH_L1_BATCHES + PH_LEVELS（PHONICS / SIGHT_WORDS /
  DECODE_SENTENCES 原形状不动，games.html / index.html 零影响）。
- 版本链：app v150（BUILD .14.14）/ phonics.js v7 / sw.js CACHE v209；
  无音频变更，AUDIO_VER / SENTENCE_VER / PHONICS_VER 均不动。


## 2026-11-14.13 · 知识点例句整句朗读修复：277 句补整句音频 + 拼读页连带问题

用户：「课本新增的一些知识点里面有例句，他们的句子都是一个一个蹦的，并不是长的读出来的。」

### 根因
2026-11-14.6 拓展知识点 282 条的 `en` 例句**几乎都没有整句 mp3**（命中率 5%），
点朗读只能走逐词接龙 → 一个一个蹦。同批内容还有三处连带 bug。

### 改了什么
- **277 句整句音频**（267 条知识点例句 + 10 条可解码句）：Piper + LibriTTS 说话人 381，
  与既有 553 句同声线同规格（md5 探针 i_like_apples / it_is_cold_today / cat 逐字节一致；
  句长 1.02–2.46s、词长 0.48–0.87s、无削波）。登记 SENTENCE_AUDIO **553 → 830**；
  SENTENCE_VER 不升（只新增文件，老用户不重下 6MB）。
- **21 个词级音频**：15 个例句缺词（men / wang / times / piggy / li / moved / hiking /
  bottles / feels / sent / sang / walked / seen / noticed / cells）+ 拼读页脚承认缺失的
  6 词（vest / king / gum / hut / thumb / gate）。登记 audio-list.js **2882 → 2903**。
- **视觉词 a 发音错误**：卡片点击原来读 `audio/a.mp3`（字母岛字母名 /eɪ/，教错音），
  改走 `weak_a`（真 schwa /ə/）；可解码句的词按钮同样处理（新增 `phSpeakWord`）。
- **「🔊 读整句」逐词蹦**：原来调 `speakSentenceWords`（无弱读替换），
  改走 `speak()` → 命中整句 mp3 一次播完；phonics.html 补引 sentence.js，
  兜底逐词链也带 a/an 弱读。页脚删「六词暂无」，导语改「听整句连读」。
- **计数文案**：README.txt / README.md / THIRD-PARTY-NOTICES / disclaimer / parents /
  app.js / sentence.js / audio-list.js 头注释，553→830 句、2882→2903 词、2921→2942 发音文件。

### 版本链
app v148→v149、sentence.js v51→v52、phonics.js v5→v6、audio-list v7→v8、
CACHE v207→v208、BUILD 2026-11-14.12→.13。SENTENCE_VER=5 / AUDIO_VER=4 /
AUDIO_CACHE=v5 / WEAK_VER=2 都不动（音频只增不改，老用户零重下）。

---

## 2026-11-14.12 · th 提示语修正：「轻轻吐舌」→「轻咬舌尖不振动」

用户：「th 的发音对么？总感觉很奇怪」。先取证再改文案：

- **声学验证（CDP + OfflineAudioContext）**：th.mp3 基音强度 0.13（清音，对照 ng 0.65 / m 0.60）、
  过零率 11705（擦音，对照 sh 10790 / f 12375）、频谱重心 5767Hz（介于 f 5511 与 s 6857 之间）、
  0.38s 单段——**是标准清齿擦音 /θ/**，不是 /s/、不是浊音 /ð/、不是字母名。录音正确。
- **「奇怪」的真因是提示语**：「th 轻轻吐舌」有两个问题——①「吐舌」会让口型过度外伸、发出来就怪；
  ②只讲口型没讲振动，而 /θ/ 和 /ð/ 的舌尖位置一样、区别恰在声带振不振动。
  正确口径：**轻咬舌尖（舌尖夹在上下牙之间）吐气，声带不振动 = /θ/**。
- 修改 5 处：PH_BLOCKS th tip+note（补 thin/think/three 例词锚点）、PHONICS 族 tip（三方同源）、
  视觉词 them 解析、phonics.html 规则彩蛋、PH_BLOCKS 头注释。清浊两音在块注里讲透：
  /θ/ 咬舌不振动（think/thin）；/ð/ 咬舌但声带振动（the/this），走整体认读。
- 版本链：app v147→v148、js/phonics.js v4→v5、CACHE v206→v207、BUILD .14.12。音频零改动。

---

## 2026-11-14.11 · 内容自审纠错：视觉词补 a/is/has + 标签纠错

用户：「拼读课侵权吗？体系完整了吗？还有错误吗？」自审三条线（侵权/完整性/错误回归），
句词归属审计揪出 4 处内容错误，当日订正：

1. **视觉词缺 a / is / has**：短文里 a（不定冠词 /ə/）、is（/ɪz/，s=/z/）、has（/hæz/，s=/z/）
   当整体认读用（标签也这么标），但 SIGHT_WORDS 表里没有——孩子去表里找不到。
   补 3 词并自写解析（ipa.js 口径 is=/ɪz/、has=/hæz/ 一致）。32→35 词。
2. **短文标签把 can/on 误标成视觉词**：can（c-a-n）、on（o-n）是规则 CVC 短元音词，
   逐块可拼，不是整体认读——与正文「只有绿色标签里的视觉词是整体认读」自相矛盾。
   10 句标签逐条改准（如「视觉词 the/can · 短元音 i · sh」→「视觉词 the · 短元音 a、i · sh · 连缀 sw」）。
3. **「35 词池」记述有误**：SPELL_WORDS 实际 33 词（测试断言 ≥30 未暴露）。version.json/VERSION.md 订正。
4. 标签口径现与正文一致：句中每个词 ∈ 视觉词表 ∪ 词族 ∪ 规则 CVC，逐词可验证（新增测试断言把关）。

侵权审查结论：10 句与站内 301 句课本句零雷同（编辑距离≤2 零命中）；32+3 条解析文案
在 phonics.js 之外零出现；视觉词编排与 Dolch/Fry 顺序 LCS 仅 2-6/32（自创按拼读特征分组）；
中文译文零搬运。完整性结论见 .14.9/.14.10 章节，已知缺口：音节划分、词缀、成篇读物。

版本链：app v146→v147、js/phonics.js v3→v4、CACHE v205→v206、BUILD 2026-11-14.11。音频零改动。

---

## 2026-11-14.10 · 三大练习：视觉词 + 可解码短文 + 听音能写

用户：「3 项都做，去吧，不能有错误，不能侵权」——即补齐瑞格叔叔体系里我们缺的
视觉词 / 可解码阅读 / 听音能写（编码方向）三块，全部自研、零搬运。

- **⑨ 视觉词**：32 个高频整体认读词（the/said/you/come/some/have/of/who/why/her…），
  每词 IPA + 中文 +「为什么不按字母拼」自写解析（said 的 ai 读 /e/、come/some/have 的
  魔法 e 例外、who 的 wh 读 /h/、of 的 f 读 /v/）。词表按「不规则或用到未教规则」自选自排，
  不搬运 Dolch/Fry 等词表品牌的编排与文案。
- **⑩ 可解码短文**：10 句自编短文（The fish can swim. / The cake is on the plate. …），
  只用「已教规则可拼的词 + 视觉词」，标签注明练什么规则；点词听单字，
  「读整句」走 speakSentenceWords 逐词连读（站内音频优先）。
- **⑪ 听音能写**：拼写编码游戏——听音 → 看字母数 → 点字母块拼词 → 自动判卷，
  答错退回重来；33 词池（CVC + 少量 4 字母词）每轮随机 10 题。（.14.11 自审订正：原记 35 有误）
- 正确性口径：视觉词 IPA 逐条核对常用读音；短文逐句人工核对语法与可解码性；
  mat/sat/I 等无站内音频的词不进句子。发音铁律不变，音频零新增。
- 版本链：app v145→v146、js/phonics.js v2→v3、CACHE v204→v205、BUILD 2026-11-14.10。

---

## 2026-11-14.9 · 拼读课科学化增补：连缀站 + ng/u_e/ir 补齐（24 族八站）

用户：「对比一下我们设计的自然拼读和雪梨英语、瑞格叔叔、钟平老师的逻辑英语谁的更科学？
如果我们不是最好的、最正确的那我们还能再优化的更好更正确么？」（雪梨英语与瑞格叔叔是两个人）

三方对照后按 Science of Reading 标准次序（NRP 2000 / Rose Report 2006，同瑞格叔叔五级体系）补齐：

- **新增第 ⑤ 站「辅音连缀」**（l/r/s 连缀 3 族 18 词）：两个辅音各自出声连着读，
  与第④站「两个字母一个音」形成对比教学——这是此前最大的内容缺口。
- **ng 补进第④站**（sing/king/thing/bring/spring + young/along 整体认读）；
  **u_e 补进第⑦站魔法e**（cute/use/rule）；**ir 补进第⑧站卷舌音**（bird/girl/shirt/skirt/sir）。
- **正确性口径**：连缀词只收元音与字母音吻合的。from/front 的 o 实读 /ʌ/、blue 的 ue、
  snow 的 ow、snake/smile 的魔法 e 都会被逐块拼读教错，故不收；young（ou）、along（schwa）
  走整体认读。延续「宁可不响/不进词族，也不放错音」铁律，音频零新增。
- **规则彩蛋**（纯文字）：c/g 软音（city/gentle）与不发音字母（knife/knee/comb）。
- 版本链：app v144→v145、js/phonics.js v1→v2、CACHE v203→v204、BUILD 2026-11-14.9。

---

## 2026-11-14.8 · 音标修正：government 少一个 n

用户：「继续」（.14.7 发版复验收尾）。线上复验全绿后跑音标回归，抽样对照发现 2 项不一致，逐项裁决：

- **ipa-gs.js government**：`/ˈɡʌvərmənt/` → `/ˈɡʌvərnmənt/`。IPA_GS 全表口径是辅音簇写满
  （iron `/ˈaɪərn/`、furniture `/ˈfɜrnɪtʃər/`、performance `/pərˈfɔrməns/`），government 少写了 -ern- 里的 n，
  词典主音也是 ˈɡʌvərnmənt（MW 另收 ˈɡʌvərmənt 变体，但表内口径不取省音）。**数据笔误，改数据**。
- **pep-mem.js apple**：测试预期 `ˈæpəl` 与数据 `ˈæpl` 不一致。查证人教版词表写法：people `/ˈpiːpl/`、
  hospital `/ˈhɒspɪtl/`、beautiful `/ˈbjuːtɪfl/` 均为无 schwa 音节辅音记法，与表内一致；教习网 2023-2024
  人教 PEP 全册词表作 `/ˈæp(ə)l/`，去可选 schwa 即 `ˈæpl`。**数据正确，改测试预期**。

版本链：`app v143→v144`、`ipa-gs v2→v3`（getsmart.html + sw CORE）、`CACHE v202→v203`、`BUILD 2026-11-14.8`。
音频零改动。

---

## 2026-11-14.7 · 自然拼读专栏：phonics.html 七站课程 + 首页专栏

用户：「拼读闯关每个字母都能发音非常好。但是这个网站里没有系统学习自然拼读的地方，
能在首页里系统加一个自然拼读的专栏么？要和拼读闯关里读音一致。当然，前提是正确。」

- 新增 **phonics.html（拼读课）**七站：① 26 字母音 ② 13 拼读块 ③ 短元音词族 ④ 双辅音词族
  ⑤ 元音组合词族 ⑥ 魔法 e ⑦ 卷舌音词族。字母音 / 块音点按走 `audio/phonics/` 母语者录音
  （与拼读闯关同一个 `phonicsURL()`，同一个 PHONICS_VER）；词族行「🔊 拼一拼」= 逐块音
  （gap 420ms）+ 整词标准音收尾。无 segs 的词（rabbit / egg / shoe / 魔法 e 系）只做**整体认读**——
  硬拆会把 cake 读成 /kæke/，与游戏同口径（「宁可不响，也不放错音」）。
- 新增 **js/phonics.js（唯一真相源）**：PHONICS 18 词族 + PH_BLEND_OK + PH_BLOCKS 13 块讲解 +
  发音助手（phBlockURL / phBlendWord / phBlockExamples）。games.html 的内联 PHONICS / PH_BLEND_OK
  删除、改为引用；**拼读闯关 / 拼读课 / 首页专栏三方同源**，改一处三边一起变。
- **首页专栏**：「🔤 自然拼读 · 见词能读」（18 个音素 chip 点按发音 + 课程三步 + 进入拼读课按钮），
  两套岛屿列表各加「自然拼读」卡（8 张），noscript 站点地图补链接。letters.html 加「去拼读课」入口。
- **顺手修一处数据不一致**：king 的分块 ['k','i','n','g'] → ['k','i','ng']。morning 用 ng 块而 king
  把 /ŋ/ 拆成 n+g 两块逐音读；判卷按字母串，游戏行为不受影响（3 块代替 4 块）。
- 魔法 e 是规则不是音素，a_e 没有对应 mp3 —— 不硬凑单块音，规则卡标「没有单块录音，先记规则、听整词」。

- 版本链：`app v142→v143`、`js/phonics.js v1（新）`、`CACHE v201→v202`、`BUILD 2026-11-14.7`；
  音频零改动（audio/phonics/ 39 个文件原样）。
- 课程顺序按系统拼读的通用次序：字母音 → CVC 短元音 → 辅音 digraph → 元音组合 → 魔法 e → r 控制元音。

## 2026-11-14.6 · 课本知识点扩容：每单元 6 条 → 12 条

用户原话：「课本不可能一个单元就 6 个知识点，不科学啊。」

### 改了什么
- 新增 **js/pep-points-more.js（282 条 / 47 个单元，每单元 +6 条）**，全站知识点 **273 → 555**。
- 原有 273 条**一个字未动**（零回归风险）；`pepPointsOf()` 改成「基础篇 → 拓展篇」拼接，
  没加载新文件的页面按基础条返回，单词镇 / 学堂页不受影响。
- 页面显示随之变成「11-12 个知识点」，卡片顺序是「先课本主线，再思维拓展」，读起来是递进而不是堆砌。

### 拓展篇写的是什么角度
统一口径：**中文这么说，英语为什么那么说**（不写作者名、不引任何原书例句，全部自己组织语言）。

| 支柱 | 举例 |
|---|---|
| 名词的边界 | 数得清才加 s；water/bread/homework/grass/bamboo 数不清要装箱子；fish/sheep 不改样；person→people、man→men、mouse→mice |
| 空间隐喻 | in 是包住、on 是贴面、under 是正下方；over there 是隔一段；再把空间词借去说时间（before/after/ago/till） |
| 形合与意合 | 中文靠意思连，英语靠记号：s 标数量、ed 标时间、be 标状态、the 标「你知道的那个」 |
| 词尾定词性 | -er 干这活的人、-ful 装满、-less 没有、re- 再来一次、un- 不、kilo/micro/tele 一串单位与仪器 |
| 词源画面 | breakfast 是「打破禁食」、robot 本是「苦工」、dinosaur 是「可怕的蜥蜴」、blog 是 web+log、satellite 是「随从」、library 是「放书的地方」 |
| 英美差异 | film/movie、autumn/fall、holiday/vacation、clothes 永远复数 |
| 一词多职 | power 力量也电力、part 部分也角色、country 国家也乡下、tip 小费也提示、line 线也队、can 能也罐头 |

### 质量把关
- **逐单元比对旧 273 条**，发现 75 条讲的是同一件事（如旧有「also 也——住在动词旁」，新写「also 贴着动词站」），
  全部换成真正未覆盖的点；最终 282 条与旧 273 条**零撞题**（脚本逐条校验）。
- 12 条与旧条目共用同一课本例句（同一句话从两个角度讲），保留——课本核心句复用是合理的。
- 282 条 kid 字段长度 61-130 字，平均 93 字，与旧条目（80-130）同一档。
- 英文例句过 a/an、be+动词原形、句首大写、句末标点四类检查：0 条问题。
- `en` 例句优先取课本词表能拼出的句子；不在 audio/sentences 预生成清单里的，播放退回逐词接龙 / 本机语音，
  不会 404（与原有 20 条同处理）。

### 版本链
`app v141→v142`、`pep-lessons v2→v3`、`pep-points-more v1（新）`、`CACHE v200→v201`、`BUILD 2026-11-14.6`；音频零改动。

版本号引用位置：各 HTML `<script src="...?v=N">`、sw.js 的 CORE 数组。**改了 JS/CSS 必须同步升 ?v= 和 sw.js 里的引用**，否则老用户的 Service Worker 缓存会继续用旧文件。

## 2026-11-14.5 · 单元名与课本逐条核对（8 册 47 个单元）

起点是一个误会：上一版记着「三下 Unit 2/3/5 的单元名与已出版教材不一致」。这次把八册单元名**全查了一遍**，
结论是那条记录本身错了，但顺手查出另一处真错。

### 逐册核对结果

| 册次 | 站内单元名 | 课本 | 来源 | 结论 |
|---|---|---|---|---|
| 三上 (2024秋) | Making friends / Different families / Amazing animals / Plants around us / The colourful world / Useful numbers | 同 | 人教社官网音频页、电子课本网 2024秋版 | 一致 |
| 三下 (2026春) | Meeting new people / My words and actions / Tools and senses for learning / Healthy food / Old things / Numbers in life | 同 | 课本 Contents 扫描（页码 2/14/26/38/50/62）、出卷网 2026 单元卷、当当 26春教辅 | 一致 |
| 四上 (2025秋) | Helping at home / My friends / Places we live in / Helping in the community / The weather and us / Changing for the seasons | 同 | 人教社官网音频页、文轩教辅 | 一致 |
| 四下 (2026春) | ~~From farm to table~~ → **On the farm** | On the farm | 21世纪教育网 Contents 扫描（页码 4/14/26/38/50/62/74）、当当科学普及教辅、孔夫子教辅、Unit 6 知识清单 | **本轮修正** |
| 五上 (2026秋) | Different friends / My feelings / Work and play / Healthy habits / Food we eat / Nature and us | 同 | 课本 Contents 扫描、文轩&孔夫子教辅 | 一致 |
| 五下 (2027春) | Following the rules / Our community / Life in different seasons / My hometown / Travelling around / Making a travel plan | 同 | 课本 Contents 扫描 | 一致 |
| 六上 (2026秋) | Amazing places / Getting together / Healthy life / Managing money well / Exploring space / Energy, nature and us | 同 | 人教社官网音频页、电子课本网 2026秋版、课本 Contents 扫描 | 一致 |
| 六下 (旧版) | How tall are you? / Last weekend / Where did you go? / Then and now | 旧版同 | 旧版教材 | 标题对旧版；标签「现行」已改「旧版」 |

### 改了什么

1. **四下 Unit 6：`From farm to table` → `On the farm`**（中文「从农场到餐桌」→「在农场」）。
   这个错不是编的：文轩网那本《课堂笔记 26春英语4年级下》的目录就写 *From farm to table*，站内当年照抄了它；
   而课本扫描件、当当《教材伴读课堂笔记》、孔夫子《课堂笔记英语四年级下册RJ》、21世纪教育网《Unit 6 知识清单》
   四家都是 *On the farm*。**该单元词表（feed / pick / milk / knife / fork / chopsticks / bowl / spoon /
   set the table / clear the table / salad / delicious / waste）本来就对应 On the farm**，所以只改标题即可，词表不用动。
2. **六下标签：`现行版` → `旧版`**。站内六下一直是旧版四个单元（How tall are you? / Last weekend / Where did you go? /
   Then and now），但标签写「现行版」。2027 春起人教版六下换新（Happy together / Our traditions / Then and now /
   Great inventions，4 单元 + Revision Graduation week），旧版词表还能用，但不能再叫「现行」。新版词表待补。
3. **`pep.html` 说明文字**同步改为「三 ~ 五年级与六上为 2024 审定新课标版；六下仍按旧版整理（2027 春起换新）。
   单元名按课本 Contents 逐条核对」。

### 一个教训（写下来免得再犯）
「送审稿目录」和「实际印本」会不一样。三下的 *Expressing yourself / Learning better / Old toys* 是送审稿标题，
实际印本改成了 *My words and actions / Tools and senses for learning / Old things*——
证据是课本 Contents 页码（2/14/26/38/50/62）与单元开篇句（Unit 2 "How do you express yourself?" 是单元里的歌名，不是单元名）。
**判断依据优先级：课本正文扫描 > 教辅目录 > 电子课本网站目录**，教辅和网站都可能停在送审稿上。

## 2026-11-14.4 · 静态文案复核：修掉 6 处英文 / 中文错误

上一轮（.14.3）修的是内容和数据，这一轮专门盯「用户能看到的字」。新写两个扫描器：一个只看静态英文串
（助动词拼写、a/an 冠词、重复词、标点后缺空格），一个只看可见中文（占位符泄漏、乱码、标点粘连、括号配对）。
查出并修掉 6 处，全部在 Get Smart 模块卡的 `modTip` 里：

| # | 原文 | 问题 | 改为 |
|---|---|---|---|
| 1-3 | `Don not judge by appearance` / `Don not play tricks on your friends` / `Don not make hasty judgments` | 英语里没有「Don not」，是 Do not 与 Don't 混写 | `Do not ...` |
| 4 | `Ask before using others things` | others 是代词，不能直接修饰名词 | `other people's things` |
| 5 | `品德: 做个好友谊` | 中文不通 | `品德: 做个好朋友` |
| 6 | `Phonics: 三单词尾` | 漏空格（同文件另两处是「三单 -s」「三单 -es」） | `Phonics: 三单 词尾` |

另有一处搭配不通顺带改掉：`善行再小也不浪费` → `善行再小也算数`。

**没改的**：`js/data.js` 里「元音音 / 辅音音」是站内一贯的儿童向说法（和「第一个音是元音音」对称），
不是笔误；Get Smart 1-2 册的品德提示用英文、3-6 册用中文，是两套教材目录的原始写法，保持原样。

## 2026-11-14.3 · 第二轮全站体检：修掉 18 处内容与文档错误

前面几轮都是「按家长指出的问题改」，这一轮改成「主动全站扫一遍」。检查分四层：数据层（词表 / 音标 / 例句 / 音频清单）、
内容层（中英对照 / 词性 / 词源）、渲染层（9 页 + 关键交互）、工程层（死链 / 版本链 / 署名）。查出并修掉 11 处：

### 一、教学上会教错的（2 处）

- **字母页 I 组**：首词原来是 `ice cream`，页面明确写「点字母音 /ɪ/，再听 ice cream 的开头，是同一个音」——
  可 ice cream 开头是 /aɪ/，两音对不上。改成 `in / pig / six`，三个都是 /ɪ/，页面这句话才成立。
- **字母页 O 组**：`nose` 的 o 读 /oʊ/，而页面教的是 /ɑ/；且 nose 同时出现在 N 组，重复。
  改成 `octopus / hot / orange`，首词 octopus 严格 /ɑ/。

### 二、中文病句（2 处）

- 「我们住那家旅馆**住**得很开心。」→「我们住那家旅馆很开心。」（enjoy 卡）
- 「我们坐飞机去，**去**博物馆走路。」→「我们坐飞机去，去博物馆则走路。」（by 卡）

### 三、音标与词性（2 处）

- `government` 主表与学堂表都写成 `/ˈɡʌvərnmənt/`，多一个 n（ˈɡʌv-ərn-mənt）。改 `/ˈɡʌvərmənt/`。
- `graduate` 释义是「毕业」，词性却按主题默认判成名词。POS_OVERRIDE 补 `graduate: 'v'`。

### 四、记忆法里编错的词源（3 处）

- `nest ... 和 network 网络同源` —— 错。nest 来自 PIE *nisdós（坐下），network 是 net + work，两者不同源。
- `sugar ... 和 cane 甘蔗同根` —— 错。sugar 经由阿拉伯语 sukkar 上溯梵语 śarkarā；cane 经由阿拉伯语 qanah 上溯希腊语 kanna。
- `feather ... 和 fly 同源` —— 说法过强。改成只讲「轻得能飞」这个助记，不作同源声明。

另两条补写法：`dancing` / `amazing` 只写「动词 + -ing」，孩子会拼成 danceing / amazeing，
补成「去 e 加 -ing」；`for example` 的「for（拿）」改成「for（为了）」。

### 五、音标细节与文档（2 处）

- 课本音标 `kangaroo /kæŋɡəˈruː/` 缺次重音，补 `/ˌkæŋɡəˈruː/`。
- `VERSION.md` 版本表**漏登记 `js/ipa-gs.js`**（上一轮新增的文件，一直在 sw 的 CORE 里预缓存，表里却没有）。
- `THIRD-PARTY-NOTICES.txt` 章节顺序错乱：「三之二 s5s5/phonics」的正文被插到了目录后面、
  「四/五/六/七」的目录行也被挤到那里，正文读起来是 三之二 → 四 → 一 → 二 → 三。已按 一~七 重排。

### 六、这一轮查了但没改的（有据可查，不是漏）

- **音标与 ipa-dict 原词典的 48 处差异**（学堂 12 + 课本 36）逐条看过，全部属于三类正常现象：
  成音节写法（`apple /ˈæpl/` vs 词典 `/ˈæpəl/`）、d/r 脱落变体（`grandfather`、`whisper`）、
  词典自身的错（`engineer` 重音标在首音节、`sandwiches` 把 d 吞掉、`Korean /ˈkɹiən/`）。站内值保持不动。
- **单词镇 999 条词性与中文逐条比对**：除 graduate 外，`job / work / answer / end / choice / toy / plane`
  都能作名词，`visit / study / travel / once` 已被 POS_OVERRIDE 覆盖，不改。
- **语法页 1897 条动态句**跑主谓一致 / a-an / 数词复数 / 双动词 / 缺 be 规则，0 条命中
  （初版 469 条全是疑问句误判：`Can she wash?` 情态后本就用原形）。
- **课本知识点 273 条中英对照**逐条通读，只有上述 2 处病句。
- **9 个页面渲染**：build 一致、0 JS 异常、0 非音频 404；人教页学习卡与拼词页都是课本音标。
- **静态检查**：4 处「重复 id」都是 if/else 互斥分支（同一时刻只渲染一个），不是 bug；
  本地缺的图标（apple-touch-icon / icon-192 / og-cover 等）线上全部 200，属本地快照不含未改动文件。

### 七、收尾又补的三处（改完第一轮后复查发现）

- **字母页 X 的说明句本来不成立**：页面统一写「点字母音，再听首例词的开头，是同一个音」，但 X 的音 /ks/
  在词**结尾**（box / fox / six），而首例词 X-ray 读 /eks/，开头先有个「哎」。X 改成单独文案，
  指向 fox 的结尾音，并说明 X-ray 为什么不算。其余 25 个字母逐字母验过，「字母音 = 首例词首音」都成立。
- **三条短语补主重音**：主表 17 个短语词条里 14 个标了 ˈ，`French fries` / `good night` / `hot dog`
  三个漏了，补齐为 `/ˌfrentʃ ˈfraɪz/`、`/ɡʊd ˈnaɪt/`、`/ˈhɑt dɔɡ/`。
- **VERSION.md 自身的重复**：`2026-11-08.16` 整节被复制过两遍（后一份多了 ASR 验证小节），
  `2026-11-08.2` 的标题连着写了两遍，`.14.1` / `.14.2` 标题下各有一行重复文字。合并去重。

## 2026-11-14.2 · 人教课本页音标：按课本词表核对（不再说成笼统「英式 RP」）

家长纠正：「人教教材以他们教材的音标为准，不是以英式为准。」上一轮把课本音标
等同于「英式 DJ/RP 通行式」，这不够——课本怎么印才作数。

### 做法
1. 抓 7 份公开人教版 PEP 词表（2024 新版为主；含 2025 三下、2025 四上、2026 五上），
   官方站与资料站混采，存 `_ipa_src/`。
2. 归一化后逐条比对：`ː`/`:`、`ɡ`/`g`、`'`/`ˈ`、`ɔ`/`ɒ`、`e`/`ɛ`、`(ə)`/成音节。
3. 判定规则：≥3 份词表写法一致才改；只差成音节写法按教材写法改；
   教材标法自相矛盾（词表漏标重音、明显错字如 `kŋgəruː`）一律保留本站。

### 结果（894 条）
| 类别 | 条数 |
|---|---|
| 与公开教材词表一致（不动） | 534 |
| 教材标法自相矛盾，保留本站 | 35 |
| 无公开词表可比（五下 / 六上等新册） | 289 |
| 本轮实际修改 | 36 |

### 改了哪些（举例）
| 词 | 改前 | 改后 |
|---|---|---|
| apple | /ˈæpəl/ | /ˈæpl/ |
| beautiful | /ˈbjuːtɪfəl/ | /ˈbjuːtɪfl/ |
| bottle | /ˈbɒtəl/ | /ˈbɒtl/ |
| colourful | /ˈkʌləfəl/ | /ˈkʌləfl/ |
| eleven | /ɪˈlevən/ | /ɪˈlevn/ |
| garden | /ˈɡɑːdən/ | /ˈɡɑːdn/ |
| hospital | /ˈhɒspɪtəl/ | /ˈhɒspɪtl/ |
| lesson | /ˈlesən/ | /ˈlesn/ |
| listen | /ˈlɪsən/ | /ˈlɪsn/ |
| little | /ˈlɪtəl/ | /ˈlɪtl/ |
| people | /ˈpiːpəl/ | /ˈpiːpl/ |
| plant | /plænt/ | /plɑːnt/ |
| purple | /ˈpɜːpəl/ | /ˈpɜːpl/ |
| season | /ˈsiːzən/ | /ˈsiːzn/ |
| travel | /ˈtrævəl/ | /ˈtrævl/ |
| uncle | /ˈʌŋkəl/ | /ˈʌŋkl/ |
| Chinese | /tʃaɪˈniːz/ | /ˌtʃaɪˈniːz/ |
| National Day | /ˈnæʃənəl deɪ/ | /ˈnæʃnəl deɪ/ |

- 成音节写法按教材统一：`apple /ˈæpl/`、`pencil /ˈpensl/`、`seven /ˈsevn/`。
- 真错 1 处：`plant /plænt/ → /plɑːnt/`（5 份词表一致，原值是美式）。
- 重音位置错 2 处：`magazine`（重音在 zine）、`sometimes`（首重音）。
- `-teen` 家族补次重音：`thirteen /ˌθɜːˈtiːn/`、`sixteen /ˌsɪksˈtiːn/`（原值还丢了 six 的 s）。

> **2026-11-14.5 更正**：下面这段原来的判断是**错的**。当时看到电子课本网「三年级下册 2025 春版」的目录写
> *Expressing yourself* / *Learning better* / *Old toys*，就认定站内三条单元名有误。实际上那是**送审稿目录**，
> 2026 春起实际印的课本（Contents 页码 2/14/26/38/50/62）是 *My words and actions* / *Tools and senses for learning* /
> *Old things*，站内一直是对的。原始错误留档，结论见文末「2026-11-14.5」一节。

### 顺手改掉的过度声明
`pep.html` 原写「每单元词表与课本附录**完全一致**」。改成「词表按课本附录**逐单元整理**」，
并注明音标里可核对的 605 条已核。这条改动本身仍然成立（词表确实只是整理、不是影印），
但当时引用的理由（三下单元名不一致）不成立。

### 未做（留待确认）
- `(r)` 标记：公开词表一半印 `teacher /ˈtiːtʃə(r)/`、一半不印，教材印法不统一，本站不印。

## 2026-11-14.1 · 音标分两套口径：课本页英式、其余美式；Get Smart 补齐 650 处



家长要求：「人教教材的那里面的用英式，其他的全部都用美式，但是音标不能有任何的错误。
就算同一个单词前后不一致也没关系，只要是正确的就可以。」

### 一、人教版课本页 → 课本口径（英式 DJ / RP），894 条全覆盖
`js/pep-mem.js` 的 `PEP_IPA` 原先是 328 条美式补充表，现整表换成 894 条英式：

| 词 | 改前（美式） | 改后（课本写法） |
|---|---|---|
| teacher | /ˈtitʃər/ | /ˈtiːtʃə/ |
| dog | /dɔɡ/ | /dɒɡ/ |
| tomato | /təˈmeɪtoʊ/ | /təˈmɑːtəʊ/ |
| student | /ˈstudənt/ | /ˈstjuːdənt/ |
| tomato 之外，water /ˈwɔtər/ → /ˈwɔːtə/、family /ˈfæməli/ → /ˈfæmɪli/ 等同样按课本 |

**不能机械转换**（原注释早就警告过）。实际做法：
- 音素取 ipa-dict `en_UK`（MIT），**重音位置改用美式主表定** —— 词典的重音标记位置不可靠
  （`expensive` 记成 `eˈkspensɪv`，`information` 记成 `ɪnfəmˈeɪʃən`）。
- **长音符必须保留**：第一版把 `ː` 当标记一起剥掉，`father` 变成 /ˈfɑðə/，是硬错。
- 单音节不标重音（`name /neɪm/`、`eye /aɪ/`）。
- 动态规划对齐，只放行已知的英美对应关系（ɑ↔ɒ、oʊ↔əʊ、ɜr↔ɜː、词尾 r 脱落…），
  对不上的 **143 条逐条人工核定**（其中 73 条是词典根本没收录的高频词：
  he / have / nice / Monday / Wednesday / T-shirt / maths …）。
- 反向校验：`_verify_uk.py` 查重音个数、音节数、非法字符 —— **894 条 0 异常**。

### 二、Get Smart 学堂页补齐 650 处空音标（新增 js/ipa-gs.js，共 646 条）
学堂页 1026 个词条里，650 处在主表查不到音标（其中 190 处是含空格的短语），音标位一直是空的
（thirty / meat / salad 这些都没标）。新文件写 646 条（456 词 + 190 短语），只有 getsmart.html 引，
加载后 `Object.assign(IPA, IPA_GS)` 并入主表，`ipaOf()` 不用改。
剩 5 个词条（Art / Music / Math / Science / miss）主表本身有全小写键，`ipaOf()` 按原样查不到、
按小写能查到 —— 实测 1026 个词条 **0 空缺**。

来源 ipa-dict `en_US`，但词典本身有三类毛病，不改就是错音标：

| 毛病 | 例子 | 处理 |
|---|---|---|
| 重读音节也写 schwa | honey=ˈhəni、puppy=ˈpəpi、customs=ˈkəstəmz | 重读位置的 ə 一律改 ʌ |
| ɝ/ɚ 换成 ɜ/ə 会丢 r | butter 变 /ˈbʌtɜ/、government 变 /ˈɡʌvəmənt/ | 改写成 ɜr/ər，非重读 ɜr → ər |
| 一个词两个主重音 | downstairs=ˈdaʊnˈsterz | 前一个降为 ˌ |

又用英式词典交叉比对**辅音骨架**，抓出「少一个字母」的硬伤并手工改正：
`printer /ˈprɪnɜr/ → /ˈprɪntər/`、`softly /ˈsɔfli/ → /ˈsɔftli/`、
`sandwiches /ˈsæmwɪtʃɪz/ → /ˈsænwɪtʃɪz/`、`entertainment` 少 t、`government` 少 n、
`Korean /kriən/ → /kəˈriən/`。短语里的虚词用弱读式（`a cup of tea` = /ə kʌp əv ti/，
不是按词典的 /eɪ … ʌv/）。

### 三、顺手修的
- 主表 `of` = `/ʌv/` → **`/əv/`**（`of` 的美式弱读就是 /əv/，/ʌv/ 是错的）。
- `words.html` 词卡弹窗、`parents.html` 口径说明改写为「两套口径怎么分工」，
  不再宣称「本站不逐词提供课本音标」——现在人教课本页逐词提供了。
- `disclaimer.html` 与 `THIRD-PARTY-NOTICES.txt` 补 ipa-dict（MIT）署名与两批音标的数量。

版本链：`app v136→v137`（9 页 + SW 两处）、`ipa v7→v8`（4 页 + SW）、
`pep-mem v2→v3`（2 页 + SW）、`ipa-gs v1`（新文件，已进 CORE）、`CACHE v195→v196`、
`BUILD 2026-11-13.13→2026-11-14.1`。**音频零改动。**

## 2026-11-13.13 · 内容审计：音标错误 / 两页两套音标 / 声明数字

本轮是「侵权、不正确、错误内容」专项体检后的修复。先给体检结论，再说改了什么。

### 体检结论（未改的部分）

| 项 | 结果 |
|---|---|
| 国旗 | 站内 13 面国旗全是主权国家（CN/US/GB/CA/IN/IT/NZ/FR/MX/BR/KR/AU/JP），**没有**台/港/澳旗 |
| 第三方请求 | 0（无 CDN、无统计、无字体外链），学习数据只存 localStorage |
| 知名 IP | 0（无迪士尼/佩奇/宝可梦等） |
| 绝对化宣传 | 0（「保证」「100%」只出现在免责条款与 CSS 宽度里） |
| 教材原文 | PEP 273 条讲解句、Get Smart 226 条例句，含教材角色名的各只有 2 句（"Hello, I'm Mike." / "Hi! I'm April."），其余为按语法点自编 |
| 记忆法词源 | 891 条抽查无「his story / golf / tips」这类著名谣言；family 一条还主动辟谣「F-A-M-I-L-Y 是好玩的玩笑，不是词源」 |

### 改了什么

**① February 音标错**
`/ˈfebjəweri/` → `/ˈfebruˌeri/`（CMUdict: F EH1 B R UW0 EH2 R IY0）。原来的写法把 `-bru-` 读成了 `-bju-we-`。

**② 同一个词，两个页面两套音标**（最要紧的一条）
`js/pep-mem.js` 的 `PEP_IPA` 原本 529 条，其中 **202 条与 `js/ipa.js` 主表重复**，而且写法不同：

| 词 | 主表（单词镇） | PEP_IPA（人教课本页） |
|---|---|---|
| Wednesday | `/ˈwenzdi/` | `/ˈwɛnzdeɪ/` ❌（-day 读 /di/） |
| photo | `/ˈfoʊtoʊ/` | `/foʊtə/` ❌ |
| excited | `/ɪkˈsaɪtɪd/` | `/ɪkˈsaɪtəd/` ❌ |
| basketball | `/ˈbæskətbɔl/` | `/ˈbæskɪtbɔl/` ❌ |
| uncle | `/ˈʌŋkəl/` | `/ʌŋkl/`（缺重音） |
| colour | `/ˈkʌlər/` | `/kʌlə/`（英式尾） |

`pepIpaOf()` 先查 `PEP_IPA` 再回退主表，所以孩子在这两页看到的同一个词音标不一样。
**修法**：删掉这 202 条重复项，一律回退主表（主表是 CMUdict 转写、统一美式）。
保留 328 条是课本特有、主表确实没有的词（含新增 `may` /meɪ/），并补齐 27 条缺失的主重音
（`panda` `/ˈpændə/`、`animal` `/ˈænɪml/`、`get up` `/ˈɡet ʌp/`…），`ɛ` 统一写成 `e` 与主表口径一致。

**③ grammar.html 两处标注**
`every day` 由「副词」改为「名词短语」（名词短语作时间状语，不是副词）；
`Yes` 词性「感叹词」/ 成分「状语」自相矛盾，改为「副词 / 状语」，note 同步。

**④ 声明数字与实际不符**

| 位置 | 原文 | 实际 |
|---|---|---|
| THIRD-PARTY | 970 条音标 | 主表 1000 条 + 课本补充 328 条 |
| THIRD-PARTY | 自绘 345 张 SVG | 379 张（`grep -c 'WORD_SVG\["'`） |
| disclaimer.html | 课本补充 243 条 | 328 条 |
| svg/emoji-svg.js 注释 | Get Smart 专用 195 个 | 227 个 |
| VERSION.md 表格 | emoji-svg v5 | 实际引用是 v6（app.js / sw.js） |

`svg/emoji-svg.js` 只改了一行注释，**故意不升 `?v=`** —— 升了会让老用户白重下 626 条图库（约 300KB）。

版本链：`app v135→v136`、`ipa v6→v7`（4 页 + sw）、`pep-mem v1→v2`（2 页 + sw）、
`CACHE v194→v195`、`BUILD .12→.13`。音频零改动。

### 已知但未改（下一轮可选）

- Get Smart 1026 个词条里 583 条没有音标（`insect`、`bicycle`、`eyes`…），页面上音标位是空的。
  复数与短语可以按单数音标派生，但要一条条定规则，属于补内容不是修错。
- 两表符号体系已统一到 `e`，但仍有 `ɑ` / `ɔ` 这类美式变体写法与部分教材的 `/ɒ/` `/ɔː/` 不同 ——
  家长中心已注明「以老师板书和课本词表为准」，不逐词跟随课本。

## 2026-11-13.12 · 颜色词图从「圆点 / 圆球」改成「圆角方色卡」

**现象（用户报）**：字母岛 B 关小练习里，干扰项 `red` 的图标是一个红圆，像日本国旗，
怕给小朋友错误联想。

**为什么是红圆**：`red` 的数据里 `e:'🔴'`，而 `wordIcon` 的判定顺序是
「内置 emoji SVG → 自绘 `WORD_SVG` → 颜色色块」。`svg/emoji-svg.js` 有 🔴
（`<circle fill="#DD2E44">`），第一道就命中，色块分支**永远走不到**。
即便走到自绘 `WORD_SVG`，`red/blue/yellow/black/grey` 画的也都是圆球 —— 一样有"旗子/球"的观感。

**修法**：颜色词改为 `wordIcon` **最先**判，统一产出 `colorCardSVG()`
（圆角方块 + 左上高光 + 描边；白/黄加深描边，否则与白卡糊成一片），
与「学堂」页 `gsIcon` 的颜色词画法一致。`iconKey` 同步前移 ——
**图与身份必须同源**，只改一处会让"看图选词"的去重静默失效。

| 项 | 结果 |
|---|---|
| 受影响词 | red / yellow / blue / green / white / black / orange / pink / purple / brown / grey（另补 gray 同一色值） |
| 页面 | 字母岛、单词镇、语法页、Get Smart 全一致（都走 `wordIcon` / `iconOf`） |
| letters.html | 拼读口诀里的例词 emoji 由 `${l.words[0].e}` 改为 `wordIcon(l.words[0])`，不再直渲字符 |
| 音频 | 零改动（`AUDIO_VER` / `SENTENCE_VER` / `PHRASE_VER` / `WEAK_VER` 全不动） |

版本链：`app v134→v135`（9 个正式页 + SW CORE/BOOT 两处）、`CACHE v193→v194`、
`BUILD 2026-11-13.11→.12`。

## 2026-11-13.11 · 语法页动态句补 37 条连读词块（100→137）

家长在 L13「问问句：Is this __?」看到 `He isn't happy.` 一词一蹦。
查证该句**不是固定例句**，而是 `beTransform` 随机生成（随机形容词 × he/she/it/they × 一半概率否定），
所以不在 553 条整句库里，只能靠词块接龙；而词块库原先只有疑问句开头 `is_he/is_she/is_it`，
没有否定缩写，3 个词就落 3 段。

- A 档 5 条：`he_isn_t` `she_isn_t` `it_isn_t` `they_aren_t` `the_cat_is` → 23 句「短句全碎」从 3~4 段降到 2 段
- B 档 32 条：`it_doesn_t_like` / `they_don_t_want` / `does_he_see` …（主语+助动词+动词），覆盖占比最大的一族约 1000 句
- 效果：语法页 1901 句 段/词 **0.664 → 0.545**，纯逐词 106(5.6%) → 83(4.4%)，剩余全是 `He sings.` 这类两词句
- 词块 100→**137**（+350.5KB，同声线逐字节同源）；`PHRASE_VER` 不升（纯新增 slug，URL 天然无缓存）
- 版本链：`app v133→v134`、`CACHE v192→v193`、`BUILD .10→.11`

**坑**：`Network.setCacheDisabled` 管不到 Service Worker —— 它会绕过 HTTP 缓存把旧 HTML
（引用旧 `?v=`）发回来。验证线上新版本时，每个标签页先 `Storage.clearDataForOrigin({storageTypes:'service_workers,cache_storage'})`。

## 2026-11-13.10 · 句子火车员词组扩表 + 冠词 a 不再读成字母名

**现象（用户报）**：句子火车员里"中间的 a 读 A 不读 a"，句子还是一个个词蹦。

**根因 1：`speak()` 的多词分支走的是逐词朗读**
`speak(text)` 只要文本含空格、又没有整句 mp3，就走 `speakSentenceWords()`：
按单词拆开、逐个取 `audio/<词>.mp3`。而 `audio/a.mp3` 是**字母岛的字母名 /eɪ/**
（`weak_a` 只有 `speakSentence` 的逐词链在用）。所以"protect the earth"这类短语
被读成三个孤立词，含 a 的短语那个 a 就是"诶"。

**根因 2：`weak_a` / `weak_an` 本身是错的**
旧文件用 `en_US-ljspeech-medium` —— 和全站 `libritts-high` speaker 381 **不是同一副嗓子**，
载体词还是 "uh" / "un"，即 /ʌ/、/ʌn/ 的重读开音节，不是弱读 schwa /ə/。
句子里一旦出现单独一段的 a，听起来就是"啊/阿"，而不是轻轻带过。

**改法**：
- `weak_a` / `weak_an` 用 espeak 音素输入 `[[@]]`、`[[@]]+[[n]]` 重做，
  同一模型/同一 speaker 381/同 length_scale 1.1，帧能量裁切 + 12ms 淡出，
  时长压到 0.20s / 0.26s（孤立音素被模型拉到 0.35~0.68s 会像"念了一个字"）。
  频谱指纹：新文件 F2 落在 1.5~2kHz（中央元音），旧文件能量全压在 0.5~1kHz（/ʌ/），
  字母名则是 2~3kHz 的滑音 —— 三者可区分。
- 冠词判断**不分大小写**：句首 "A cat is on the bed." 的 A 也是冠词。
- `speak()` 多词文本改走 `speakSentence()`（整句 → 词块 → 弱读冠词）。
- `prewarmSentence()` 预热也映射到弱读文件，别再白下字母名。

**词块扩表 75 → 100（+25 条 / 218.8KB）**
选词依据是合并语料 2585 句（句子火车员 910 + 语法页 1770）的真实省段数：
| 词块 | 省段 | 词块 | 省段 |
|---|---|---|---|
| do_you_have | 69 | is_this | 31 |
| do_you_want_to | 60 | want_to | 30 |
| are_these | 36 | do_you_want | 30 |
| there_are_some | 35 | he_is | 24 |
| they_don_t_like | 32 | does_she_have / does_he_have | 23 / 22 |

另有用户点名的常用组：`they_are` `we_are` `i_was` `he_was` `she_was` `they_were`
`was_at` `were_at` `has_a` `is_going_to` `going_to` `she_is_not` `he_doesn_t_like` `i_don_t_want`。

**效果**（同一套切段逻辑，词块 75 → 100）：
| 语料 | 段/词 | 纯逐词句 |
|---|---|---|
| 句子火车员 910 句 | 0.643 → **0.569** | 91 (10.0%) → **0** |
| 语法页 1770 句 | 0.680 → **0.661** | 106 → 106 |
| 合并 2585 句 | 0.670 → **0.630** | 197 (7.6%) → **106 (4.1%)** |

句子火车员**一句逐词的都没有了**（那 91 句正是 "Do you have X?" / "Are these X?" /
"Whose X is this?" 这几个模板）。

**音频**：25 条 218.8KB，规格与既有 75 条一致（libritts-high / 381 / 1.1 / noise 0 /
64k / 22050 mono / 不裁静音）。同源校验：重造 `this_is_a`、`do_you`、`is_on_the_bed`，
md5 与线上**逐字节相同**。

**版本链**：`app v132→v133`、`sentence v50→v51`（冠词判定与预热改了）、
`CACHE v191→v192`、`BUILD 2026-11-13.9→.10`；词块 75 → **100**。
`PHRASE_VER` 不升：25 条全是新文件，新 URL 本来就没有缓存条目。
`AUDIO_VER` 不升：weak_a / weak_an 走独立的 `WEAK_VER`（v1 → v2），
否则 2882 条单词音频会跟着全部作废。

## 2026-11-13.9 · 语法页 51 条固定例句补整句音频

**现象**：上一版把动态句逐词率从 68.1% 压到 7.1%，但静态门禁里仍有 10 句长句
一词一段（`This book is more expensive than that one.` 8 段/8 词）。核查发现它们
**不是动态句，而是 23 关里的固定例句**——2026-11 新加的 L20–L23 从上线起就没有整句 mp3。

**量化**（只算 23 关静态题，按 sentence.js 真实取音链）：
- 静态题 80 条 → 去重英文句 57 句，其中只有 6 句有整句音频
- 剩 51 句全靠「词块 + 单词」接龙：201 段 / 241 词 = 0.83 段每词
- ≥5 词长句 23 句，**10 句一词一段**（8 段/8 词 ×2、7 段/7 词 ×3、6 段/6 词 ×3、5 段/5 词 ×3）
- 另有 11 句只差 1~2 段（`There are | two | pencils | in | the | bag`）

**决定**：不再往词块表里堆长尾组合，直接给这 51 句补整句音频（630.5KB）。

**音频规格**：与线上 502 句同一管道 `en_US-libritts-high` + speaker 381 +
`length_scale 1.1` / `noise_scale 0` / `noise_w 0` / 64k / 22050 mono / 不裁首尾静音。
**同源校验**：重造已上线的 `i_like_apples`、`it_is_cold_today`、`we_sing`，
md5 与线上逐字节相同、maxΔ = 0.000000（同源才允许补录，避免音色分层）。

**为什么不升 SENTENCE_VER**：既有 502 条一个字节没动，升版本会让每个老用户重下
6MB 整句（跨境窄带代价极大）；新增的 51 个 slug 本来就没有缓存条目，
URL 天然是新的，AUDIO_CACHE 按完整 URL 精确匹配，自然只下这 51 条。
只升 app.js 的 `?v=`（集合内容变了）、sentence.js 的 `?v=`（注释句数同步）与 `CACHE`。

**效果**：51 句从 0.83 段每词 → **1 段整句**；23 关固定例句整句覆盖率 6/57 → **57/57**。

版本链：`app v131→v132`、`sentence v49→v50`、`CACHE v190→v191`、
`BUILD 2026-11-13.8→.9`；整句库 502 → **553**。

## 2026-11-13.8 · 连读词块扩容（语法页不再一个词一个词念）

**现象**：语法页（句子工厂）动态生成的句子朗读是「一个词一个词」蹦。

**量化**（按 sentence.js 真实取音链：整句 → 最长 4 词连读块 → 单词）：
- 语法页真实出题 1791 句，只有 3 句有整句音频，1788 句逐词接龙
- 其中 **68.1% 段数 = 词数**（完全一词一段），平均 0.87 段/词
- 真实关卡 ≥5 词长句 147 句，**79 句一词一段**
- 对照：PEP 绘本 272 句、Get Smart 224 句全部有整句音频，零逐词

**根因**：整句音频只做了 502 条固定例句；词块库 44 条全是旧题型
（`this_is_a` / `i_have_a` / `my_name_is`），而 2026-11 新加的**否定句、
疑问句、方位句**模板一条词块都没有，所以这些题型 100% 逐词。
`The X is on the Y.` 一个句式就占 59 句（6 段/6 词）。

**改动**：补 31 条词块（44 → 75 条）
- 否定：`it/he/she doesn't`、`they don't`
- 疑问：`does he/she/it`、`did you`、`is he/she/it`、`are they`、`can i/he/she/they`
- `can't`：`i/he/she/you/they can't`
- 方位：`is on the` + `is on the table/bed/chair/sofa/floor`（地点只有这 5 个）
- 其余：`there is an`、`is this an`、`over there`、`on the`

**效果**：段/词 0.87 → 0.68；纯逐词 68.1% → **7.1%**；
长句纯逐词 79/147 → **10/147**；`The cat is on the bed.` 6 段 → 3 段
（`The` + `cat` + `is on the bed`）。剩余 10 句属长尾（各出现 1–2 次）。

**音频**：31 条 270.7KB，`en_US-libritts-high` + speaker 381 +
`length_scale 1.1` / `noise_scale 0` / `noise_w 0` / 64k / 22050 mono / 不裁静音
（同 build_c2.py 的 phrases 段）。**同源校验**：重造已上线的 `this_is_a`、`do_you`，
md5 与线上文件逐字节相同、maxΔ = 0.000000、corr = 1.000000。

**版本链**：`PHRASE_VER` 2 → 3（词块独立版本号，不动 AUDIO_VER / SENTENCE_VER，
避免逼用户重下 2882 条单词音频）；`app.js` v130 → v131（9 页 + sw.js 两处）；
`CACHE` v189 → v190。文案「44 段/个连读词块」→ 75（parents / README.md / README.txt）。
音频总数 2921 不变（口径 = 词音频 2882 + 39 字母音，词块不计入）。
词块不进 SW 的 CORE 预热（同既有 44 条，按需加载），首装体积不变。


## 2026-11-13.7 · 派生词两个根问题（方位词 / 词性守卫）

**触发**：2026-11-13.6 结尾留了一句「全词池压力测试还有 23 句缺 lefts / rights /
backs / fronts / middles / ways / mistakes」，用户要求一并收掉。这次不靠模板抽样，
直接穷举派生形。

**第一步：把"缺词"查成全集，而不是抽样**
`_audit_derived.py` 在真浏览器里调站点自己的 `pluralSafe()` / `pluralOf()`，
穷举全词库 999 词条 → 714 个可复数形，逐条对 `__LOCAL_AUDIO` 核对：

| 项 | 数 |
|---|---|
| 词库去重词条 | 999 |
| 可复数形 | 714 |
| 基础词缺音频 | 0 |
| 复数形缺音频 | 219 |
| 其中「词性是名词」（模板真能取到） | **7** |
| 其中「词性不是名词」（当前调用方已过滤） | 212 |

**第二步：7 个缺口分两类，只有一类该补音频**

- `back / front / left / middle / right`（方位词，zh 后面/前面/左边/中间/右边）——
  `*lefts` / `*middles` / `*fronts` 不是英语，给它们配音等于把病句固化成
  「能念出来的正确答案」。正确处理是**不生成**：`grammar-engine.js` 的
  `NO_ARTICLE` 早就挡住了 `north/south/east/west`（注释写明"方位词本身没有单数形式，
  也没有复数"），相对方位是同一类词却漏了。本次把 5 个词补进同一张表，
  `takesArticle()` 与 `pluralSafe()` 都读这张表，一处改动同时关掉：
  `There is a left over there.` ✗ / `I like lefts.` ✗ / `Is this a middle?` ✗
- `way / mistake` —— 合法可数名词，`ways` / `mistakes` 是正常复数，只是音频库缺文件。
  用原 TTS 管道补两条（`_tts_fix_words2.py`，参数同 .6，重造 `taller` 逐采样
  maxΔ = 0.000000 后再合成），`audio-list` 2880 → 2882 条。

**第三步：顺手堵掉函数级的坑（212 条垃圾形的来源）**
`pluralSafe()` 原实现只查拼写规则（结尾是不是 s/x/z/sh/ch/o/f/fe、辅音+y、不规则表），
**完全不查词性**。形容词、副词只要拼写过关就被判成"可加 s"：

```
beautiful → beautifuls   fast → fasts   sad → sads
again → agains           maybe → maybes   often → oftens
```

全词库 212 条。线上没漏出病句，是因为每个调用方都自己先写了
`gxPosCode(w) === 'n'`（`grammar.html` 5 处、`gxNouns()`、`words.html` 跟读筛选）。
但这是"靠调用方记得"的契约，谁少写一道过滤，孩子就会看到 `I like beautifuls.`。
本次把词性判断收进函数本身：

```js
const pluralSafe = w => {
  const x = wordOf(w).toLowerCase();
  if (gxPosCode(w) !== 'n') return false;   // ★ 2026-11-13.7
  ...
```

契约变为"只对真名词返回 true"，`可复数形` 714 → 502，行为对现有调用方不变
（它们本来就已经过滤过），但函数从此自证安全。

**版本链**：BUILD .6 → 2026-11-13.7；`js/grammar-engine.js` v8 → v9
（games / grammar / words + sw.js CORE 四处）；`js/audio-list.js` v6 → v7
（2880 → 2882 条，9 个 HTML + sw.js CORE）；`js/app.js` v129 → v130
（9 个 HTML + sw.js CORE/BOOT）；CACHE v188 → v189。
`AUDIO_VER`(4) / `SENTENCE_VER`(5) / `PHRASE_VER`(2) / `AUDIO_CACHE`(v5) **不动**：
只新增两个文件，没有替换任何既有音频，升了会逼全站重下 2880 条。

**用户可见文案**：披露页 / 家长中心 / README.md / `speechEnv()` 的
「2919 个发音文件」→ **2921**（口径 = 词音频 2882 + 39 字母音）。

**复检**：`_audit_long_audio.py` 压力测试缺词 23 句 → **0 句**；
`_audit_derived.py` 复数形缺音频 219 → **0 条**（阻挡后方位词不再进池，不再产生该形）；
事实门禁 PASS；线上真浏览器取音链零缺词。

## 2026-11-13.6 · 长句朗读补词（tallest / hotter）

**触发**：用户问「长句还有不连贯的么」。用句子工厂全量导出（23 关静态 80 题 +
GEN 20 个模板 × 全词池 400 轮）逐句跑真实取音链，发现 L22 比较级/最高级有 3 句
会**整词消失**：

| 句子 | 实际听到 | 缺的词 |
|---|---|---|
| He is the tallest in our class. | He is the ___ in our class. | tallest |
| She is the tallest of the three. | She is the ___ of the three. | tallest |
| It is hotter today than yesterday. | It is ___ today than yesterday. | hotter |

**根因**：`sentence.js __speakFrom` 取不到音频就跳过继续（设计如此：宁可漏一个词，
也不在句子中间插机器音）。`tallest` / `hotter` 既没有 `audio/*.mp3`，也不在
`audio-list` 清单，`localAudioURL()` 返回空 → 直接跳过。`taller` 有音频，所以
同关的「I am taller than you.」正常 —— 这也解释了为什么只有这 3 句出问题。

**补法**：用本机原 TTS 管道补录，不是换引擎：
`_tts/bin/piper` + `en_US-libritts-high` / spk 381 / noise 0 / length_scale 1.0 /
libmp3lame 96k / 22050Hz mono / 裁首尾静音(-70dB, 0.03s)。
**先验证管道同源**：用同一参数重造已上线的 `taller.mp3`，解码后逐采样比对
13718 点，maxΔ = 0.000000、相关系数 = 1.000000 → 孩子听不出是新补的。

**版本链**：BUILD .5 → 2026-11-13.6；audio-list 2878 → 2880 条、v5 → v6
（9 个 HTML + sw.js CORE 同步）；CACHE v187 → v188。
`AUDIO_VER`(4) / `SENTENCE_VER`(5) / `PHRASE_VER`(2) / `AUDIO_CACHE`(v5) **不动**：
只新增文件，没有替换任何既有音频，升了反而会逼全站重下 2878 条。

**复检（可复跑 `_audit_long_audio.py`）**：
本补丁后句子工厂静态 57 句、自动出题 1742 句、Get Smart 224 句、PEP 272 句，
缺词 0 句。全词池压力测试仍有 22 句缺 `lefts/rights/backs/fronts/middles/ways/mistakes`
（主题 position/magic/classroom），但这三个主题不进任何出题关的 `gen.themes`，
玩家碰不到；若日后要放开，先补这批复数音频。

## 2026-11-13.5 · 独立复检收尾

一次只读复检 + 真浏览器点击流 + 题库 fuzz 后修掉 10 类真 bug：
存档 `daily:null` 或隐私模式禁用 localStorage 会让 `Store.load()` 顶层抛错、全站卡在加载层
（现按字段类型归一化、顶层 try/catch、`Profiles.load` 裸 getItem 补 try、导入 data 校验）；
`games.html` 的 `learnedPool()` 把字符串 key 当对象取 `.w`，恒返回空数组使复习池永久不可用；
导出同步码后点「粘贴短码恢复」会把自己再导一遍（改为始终弹输入框）；
小词池干扰项凑不满 3 个导致选项只剩 1 个（从全词库补足）；
`getsmart.html` 句型填空只替换首个答案词造成泄题（改为全部挖空）；
语法生成器把词对象传给 `touchWord` 写出 `[object Object]` 垃圾键（取词名 + 入参守卫）；
三单否定干扰项助动词写反并造成近 40% 生成被去重丢弃；
`__navSave/__navLoad` 的 key 不含档案 id 导致切档案串位置；
SW CORE 漏了由 app.js 动态注入的 `emoji-svg.js?v=6`（离线冷启动重页面图标退化）；
核心图库缺 🧽 且注释承诺的 `__emojiNeedFull()` 从未被调用（补图 + 删除死代码、修正注释）。
验证：事实门禁全绿、10 页运行时零异常、451 次内容遍历零异常零 404、7 个游戏点击流与 390px 窄屏通过。

## 缓存机制（改版前必读）

- 页面 HTML：Service Worker 走「网络优先」——发版即生效
- 带版本号的 JS/CSS：走「缓存优先」——**只改文件内容不升版本号 = 老用户永远拿旧版**
- audio/ 目录：独立缓存，正常发版不清；重建音频 = 换 sw.js 的 AUDIO_CACHE 名 + 升 app.js 的 AUDIO_VER，
  两处一起改（只改一处会拿到旧字节），旧音频缓存由 activate 自动删除

## 页面清单

| 页面 | 功能 |
|---|---|
| index.html | 首页：主卡任务推荐 + 今日任务流入口 + 各岛屿入口 |
| getsmart.html | Get Smart 学堂：课本同步（学单词→闯关→句型 三步 + 复习课 + 单元小测 + 今日任务流 ?flow=1） |
| words.html | 单词镇：分主题练词 + 复习（间隔重复）+ 听写 |
| letters.html | 字母岛：26 字母象形故事 |
| grammar.html | 句子工厂：23 关（第 5 关 a/an 按读音首音素教，不是看首字母） |
| games.html | 游戏乐园：7 个游戏（含听词选图、自然拼读） |
| parents.html | 家长中心：进度报告 + 版本与朗读诊断 |
| pep.html | 人教课本：8 册知识点 + 拼词 |
| 404.html | 友好错误页 |
| disclaimer.html | 免责声明 / 隐私 / 条款 |

## 已知约定

- 整句发音：课本 273 句 + Get Smart 227 句共 497 个 slug 的自合成整句 MP3 在 audio/sentences/，
  清单 SENTENCE_AUDIO 在 app.js，命中就一次播完；不命中才走逐词连读
- 单词发音：**只用站内 audio/{slug}.mp3，一个外网请求都不发**（v8，2026-11-08）。
  全站发音目标共 2882 个（单词 + 拼读块 + 字母名 + 复数/三单/进行时派生词），清单是 `js/audio-list.js`；
  另有 26 个字母音在 `audio/phonics/`（不进清单，用 `PHONICS_VER` 独立版本号）
  （`window.__AUDIO_LIST`，defer 加载，不挡首屏、file:// 也能用）；
  清单没落地前对单个词按本地文件乐观解析，`__registerGSAudio()` 另做兜底。
  包内真没有的内容才用浏览器 speechSynthesis 兜底，且只在单独朗读时启用
- 音频合成规范（重做时必须一致）：Piper + `en_US-libritts-high` / `speaker_id=381`
  （模型权重 MIT；训练数据 LibriTTS / OpenSLR 60 = CC BY 4.0，须署名），
  **`--noise_scale 0 --noise_w 0` 必须钉死**（默认噪声下同词连烘 5 次 MD5 全不同）。
  单词 = `--length_scale 1.0`、96kbps / 22050Hz 单声道、
  裁首尾静音 `silenceremove -70dB / start_silence 0.03`（-50dB 会削掉 /p/ /t/ /k/）；
  整句与词块 = 1.1 / 64kbps、不裁；字母音是母语者录音（见 THIRD-PARTY-NOTICES）。
- **音标口径 = 美式**（2026-11-09.11 家长拍板 A）：`js/ipa.js` 与 `PEP_IPA` 全部美式符号
  （无长音符、`ER→ɜr`、`AH0→ə`），与站内朗读声线一致。部分教材（人教版词表）用英式符号
  （`/ˈwɔːtə/`），写法不同、读音是同一个词。**要换就全站 999+ 条一起换**，
  不要只把某几个词改成英式 —— 同一页两种符号体系比不改更糟。
  生成脚本在项目外的 `_tts/`（build_c2.py / deploy_c2.py）
- Get Smart 课程数据里 unit.mod 是**数字**（1-10），moduleLessons/startModuleTest 都按数字匹配
- 单元闯关每词只考 1 题（听音选图 或 看词选义随机），认义题干扰项按中文释义去重
- **认义题（look）的选项一律是中文释义**，听音题（listen）才是英文词/图片。
  认义题若用英文词做选项，题干里的单词会直接出现在选项里 → 答案白送
- 图标渲染优先级：内置 SVG → 手绘 WORD_SVG → 色块（颜色词）→ 系统 emoji → 字母块
- 新增 js/css 文件时**必须同时加进 sw.js 的 CORE**，否则离线首次打开该功能会 504 崩掉
  （2026-11-01 的 speech.js 就是这么漏的）

## 2026-11-11.1 统信 UOS 浏览器切导航偶发「整页黑白」

**现象**：国产 Linux 浏览器（多为软件合成、无 GPU 硬件加速）点顶部导航换页时，
小概率整页颜色消失，刷新通常恢复。站点里**没有任何整页 grayscale 规则**，
`grayscale` 只用在家长中心徽章格和首页未解锁关卡这两个局部元素上。

**三层加固（都是消掉放大偶发的缺陷，不是给页面加反灰度滤镜）**：

1. `css/style.css` `.nav` 删掉 `backdrop-filter: blur(4px)`。背景本来就是 92% 不
   透明白、模糊肉眼看不出来，却强制整页成为 backdrop root；软件合成内核切页重建
   合成层时，backdrop 读回偶发色彩通道丢失。白度补到 96%，视觉几乎零变化。
2. `sw.js` 同站静态资源原逻辑是「缓存 miss + 网络失败 → 直接 504 空响应」。
   CSS/JS 带 `?v=`，发版迁移或删旧缓存的窗口期里切导航容易恰好 miss，网络抖一下
   浏览器就拿到 0 字节 CSS → 整页白底黑字。改成 **网络重试一次 → 同路径任意 `?v=`
   的旧版本缓存降级 → 才 504**；`matchAll(ignoreSearch)` 里挑第一个好响应，不会被
   历史毒化的 404 挡住。
3. 10 个页面的 CSS `<link>` 加 `onerror` 自愈：失败时把地址换成 `?v=49&retry=1`
   重取一次，绕开坏缓存条目，和第 2 点的降级闭环。不会无限重试（先置 null）。

另补 `@media (forced-colors: active)`：系统高对比度/色彩滤镜把彩色词图、emoji 刷成
黑白剪影后，「看词选图 / 听词选图」这类题直接失效。只对承载教学信息的彩图用
`forced-color-adjust: none`，文字和页面其余配色仍交给系统 —— 站点**不主动反转**
用户或系统的灰度设置，也不猜是不是误开。若确属系统黑白模式，需在系统设置里关。

**未能验证**：统信真机无法在此环境复现，以上按代码缺陷与渲染机理定位；需家长在
真机上连续切几十次导航确认。自测：Node 桩覆盖 SW 四种失败分支 + 真浏览器探针
验证 CSS 首请求失败后能自愈。

版本链：BUILD .16 → 2026-11-11.1，app v113 → v114，style v48 → v49，CACHE v167 → v168。
音频零改动（AUDIO_VER 4 / SENTENCE_VER 2 / PHRASE_VER 2 / AUDIO_CACHE v5 不动）。

## 2026-11-09.16 colour 记忆法的示例改成英式 colourful

`.15` 合并时写成「colour（英式拼写）＝ 美式 color：colorful 多彩的」——
先讲英式，例子却用美式拼写，孩子容易以为本站教的是 color / colorful。
课本 `pep3b-u4` 的词条就是 **colourful**（五彩缤纷的），统一改成英式示例。

文案一处、代码零逻辑改动；版本链为了缓存一致照常升：
BUILD .15 → .16，app v112 → v113，words-data v41 → v42，CACHE v166 → v167。

## 2026-11-09.15 colour / color 合并为一条（词库 1000 → 999）

**决定**：家长拍板 B。`colour`「颜色(英式)」和 `color`「颜色(美式)」是同一个意思的
两条词条、共用同一张 🌈，同一个意思占两个词位。合并成 **一条 `colour`（颜色）**，
记忆法写清「英式拼写 colour ＝ 美式 color，两种写法读音相同」。

**顺手修掉一个会静静坏掉的 bug**：`js/app.js` 的「千词小博士」徽章门槛写死
`if (w >= 1000)`，词库变 999 后这枚徽章**永远拿不到**——孩子学完全库也开不出来，
界面上只会显示「离目标还差 1 个」。改成 `w >= totalWordCount()`（从 THEMES 现算），
以后加减词都不会再坏；`totalWords === 0`（词库没加载）时直接跳过，
避免门槛变成 0 一进站就发徽章。

**同步的口径**：全站「1000 词」→「999 词」，共 16 个文件：
`index.html`（description / og / JSON-LD）、`games.html`（两处按钮文案）、
`parents.html`、`disclaimer.html`、`manifest.json`、`README.md`、`README.txt`、
`VERSION.md`、`js/words-data.js` / `js/data.js` / `js/ipa.js` / `js/pep-points.js` /
`js/app.js` / `svg/emoji-svg.js` / `letters.html` / `pep.html` 的注释与徽章文案。

**保留不动的**：
- `js/ipa.js` 里的 `color` 音标条目：Get Smart 1 课文原句就是 `What color is it?`
  （美式教材），删了那一行音标会空掉。音标表比词库多这一条是有意为之。
- `js/build-data.js` 的 `color + ful = colorful`：造词实验室演示的是构词法（美式拼写），
  与 Get Smart 的美式课文同源，不跟着改成英式。
- `audio/color.mp3` 等美式读音文件：仍在 `audio-list` 清单里（Get Smart 要用），
  不删（删了反而要同时改清单和门禁，风险大于收益）。

**验收**：词库 999 词 / 61 主题；门禁 136 PASS；8 套自测 + 8 个真浏览器探针全绿；
`_audit/test_icon_key.js` 里「同图词对」从 18 组降到 17 组（彩虹那组消失了）。

**版本链**：BUILD .14 → .15；app v111 → v112；words-data v40 → v41；
data v38 → v39；CACHE v165 → v166；音频零改动。

## 2026-11-09.14 修「同图去重失效」（配对里出现两张一样的图）

**现象**：图词翻翻乐一局 8 张牌里出现**两张彩虹**（`colour` / `color`），
孩子翻开图片后不知道它该配哪个词；同类情况还有 `child`/`children`（都是 🧒）、
`bag`/`schoolbag`（🎒）、`sea`/`ocean`（🌊）、`gift`/`present`（🎁）等。

**原因**：不是数据错，是**去重键取错**。四处「同一张图不许出现两次」的代码
（配对抽词、拼读闯关干扰项、听词选图撞图判定、单词镇看词选图的干扰项）
都拿 `iconOf(w)` 的**返回 HTML 串**当 key。而 `iconOf` 的输出里带
`aria-label="释义"` —— 两个词只要释义不同，整串就不同，
`iconOf(a) === iconOf(b)` 永远为假，**去重从来没生效过**。

**修法**：新增 `iconKey(w)`（`js/app.js`），只认画出来的那张图：
内置 emoji SVG → `esvg:`＋码位（去掉 U+FE0F）／自绘 SVG → `svg:`＋词／
颜色色块 → `chip:`＋色值／裸 emoji → `emoji:`＋码位／字母牌 → `letter:`＋首字母。
四处去重全部改用 `iconKey`，`iconOf` 只管渲染。

另外自绘 SVG 里有两组**路径数据逐字节相同**的画面（`correct`/`well`、
`everybody`/`everyone`），只按词名做 key 仍会漏，用 `SVG_SAME_KEY` 把它们归一；
自测会核对这张表名副其实、且没有漏项（以后再加重复画面会被门禁挡住）。

**验收**：
- `_audit/test_icon_key.js`（注入线上真实 `wordIcon`/`iconOf`/`iconKey`）
  48 项：同图必同 key（11 组）、异图必异 key（5 组）、自绘画面重复组全覆盖、
  30 主题 × 30 轮抽词图不重复、全库同图词对 ≥18 对全部被归并、
  四个去重点都改成 `iconKey`（防回退）。
- `_audit/probe_mem_dup.py`（真浏览器）：9 个主题 × 40 局 + 6 个年级池 × 20 局
  = 480 局，每局都是 4 张不同的图，0 重复、0 少牌。
- 门禁新增 3 条断言（含跑上面那个 node 自测），134 PASS / 0 FAIL。

**版本链**：BUILD .13 → .14；app v110 → v111；CACHE v164 → v165；音频零改动。

## 2026-11-09.13 修错题本空态文案（1~3 个词时谎称「空的」）

**现象**：错题本 / 我的词单里只有 1~3 个词时，页面上面写「共 3 个词」，
下面同一张卡片却写「太棒了，这里暂时是空的！」—— 自相矛盾，家长会以为数据丢了。

**原因**：`showPool()` 只有一个分支：`list.length >= 4` 出练习按钮，否则一律当空态。
但练习需要至少 4 个词才能凑够选项，所以按钮阈值没错，**错的是把 1~3 个也归进「空」**。

**修法**：分三档 —— 0 个才说空；1~3 个说「已经攒了 N 个，再攒到 4 个就能练这一批」；
≥4 个出练习 / 拼写工坊 / 跟读三个按钮。

**顺带修的**：第一次改的时候把开发注释写进了模板字符串，整段中文注释会直接印在页面上。
已把注释移到模板外，状态 HTML 提成 `poolStatus` 变量。

**验收**（`_audit/probe_pool_empty.py`，真浏览器三档对照）：
0 个 → 只有空态；2 个 → 「已经攒了 2 个」且无按钮；4 个 → 出按钮；
页面文本里不再出现任何开发注释。

**版本链**：BUILD .12 → .13；app v109 → v110；CACHE v163 → v164；音频零改动。

## 2026-11-09.12 修词库两处数据错误 + 同义歧义守卫

**1. color 放错了主题**（打开「音乐艺术」会看到一个「颜色」词）
`color`（颜色(美式)）原来挂在 `music2 音乐艺术` 的最后，而 `color 颜色` 主题里
只有英式 `colour`。英式/美式对照应该并排放在颜色主题里：
颜色主题 12 → **13 词**、音乐艺术 14 → **13 词**，总词数仍是 1000、主题仍是 61。

**2. bored / boring 释义与记忆法都错**
| 词 | 修前 | 修后 |
|---|---|---|
| bored | 无聊的 | **感到无聊的（人）** |
| boring | 无聊的；记忆法却是「bored 来自 bore…」 | **令人无聊的（事/物）**；`boring = bore + -ing`，-ing 修饰事/物 |

修前「无聊的」的英语是？—— `bored` 和 `boring` 两个选项都对；
而且 `boring` 的记忆法整段抄了 `bored`，孩子看不出 -ed/-ing 的区别。

**3. 同义歧义守卫**
扫描「中文释义完全相同」的 19 组，其中 12 组没进 `SYN_GROUPS`
（good/OK、no/not、sir/Mr、on/above、tall/high、policeman/police、job/work、
cost/spend、gift/present、everyone/everybody、anyone/anybody、bored/boring），
「中文选英文」题里会出现两个都算对的选项。已全部补进去。

**验收**（`_audit/probe_syn_guard.py`，真浏览器）：16 组同义对 × 120 次抽题
= **1920 题，同义对同时出现 0 次**；`bored`/`boring` 的中文已不同。

**版本链**：BUILD .11 → .12；app v108 → v109；`words-data.js` v39 → v40；CACHE v162 → v163。

## 2026-11-09.11 明确音标口径（美式）+ 修过期数字

家长拍板：**保持 A 档 —— 全站美式**，不换成课本的英式符号。

- `disclaimer.html`：把「970 条美式音标」改成真实覆盖（1000 个单词全部 + 课本补充 243 条），
  并写明「统一用美式符号，与站内朗读的美音一致；部分教材用英式符号，写法不同但读的是同一个词」。
  原数字自 2026-11-08 起就没跟上（当时 970 条，现在 1000 + 243）。
- `VERSION.md`：新增「音标口径」条目并写死规则 —— 要换就全站 1000+ 条一起换，
  **不要只把某几个词改成英式**，否则同一页里两种符号体系，孩子更困惑。
- 代码零改动，音频零改动；只改文案 + 版本链。

**版本链**：BUILD .10 → .11；app v107 → v108；CACHE v161 → v162。

## 2026-11-09.10 补齐最后 273 个缺失音标（家长：「全音标了」）

家长指出的问题：单词镇有 19 个词没有音标，课本页更多。实际全量扫描是
**273 个**：单词镇 30 个（含 18 个短语/连字符词）、课本独有 243 个。

**为什么以前是空的**：`js/ipa.js` 的规则是「同形异音词与短语一律不标 —— 标错比不标更糟」。
但词库每个词条只收**一个义项**，读音其实是唯一的，按义项标不会错：

| 词 | 词库义项 | 以前 | 现在 |
|---|---|---|---|
| read | 读书 | 空 | `/rid/`（不是过去式 /red/） |
| live | 居住 | 空 | `/lɪv/`（不是 /laɪv/） |
| use | 使用 | 空 | `/juz/`（不是名词 /jus/） |
| close | 关上 | 空 | `/kloʊz/`（不是形容词 /kloʊs/） |
| present | 礼物 | 空 | `/ˈprezənt/`（不是 /prɪˈzent/） |
| tear | 眼泪 | 空 | `/tɪr/`（不是 /ter/） |
| desert | 沙漠 | 空 | `/ˈdezərt/`（不是 /dɪˈzɜrt/） |
| wind | 风 | 空 | `/wɪnd/`（不是 /waɪnd/） |
| minute | 分钟 | 空 | `/ˈmɪnɪt/`（不是 /maɪˈnjut/） |

**怎么标的**：用 CMUdict（BSD，已在 `THIRD-PARTY-NOTICES.txt` 署名）批量转写，
与既有的 970 条同一个美式口径（无长音符、`ER→ɜr`、`AH0→ə`）；
重音按**音节首辅音**放（`ˈpɛnsəl` 而不是 `pˈɛnsəl`），单音节词不标重音，
短语逐词拼接。同形异音词按上表逐条人工指定，不取词典第一条。

**口径说明**：本站音标一直是美式，与站内朗读声线（美音）一致；
人教版课本词表用的是英式符号，两者写法不同但读的是同一个词。
若要与课本符号完全对齐，需要全站 1000+ 条一起换成英式，属于另一个决定。

覆盖：单词镇 **1000/1000**、课本 **965/965** 全部有音标；
`_audit/test_ipa_coverage.js` 5 项断言进发版门禁。

**版本链**：BUILD .9 → .10；app v106 → v107；`ipa.js` v4 → v5；
`pep-points.js` v16 → v17；CACHE v160 → v161；音频版本全部不动。

## 2026-11-09.9 修 children 复数（原来会教成 childrens）

`children` 是 `child` 的复数，词库里 `child` 与 `children` 是两条独立词条。
但 `children` 既不在 `PLURAL_ONLY`（唯复数），也不在 `IRREG_PLURAL`（不规则复数）里，
于是三处判定全错：

| 判定 | 修前 | 修后 |
|---|---|---|
| `countable('children')` | true | **false** |
| `pluralSafe('children')` | true | **false** |
| `pluralOf('children')` | **childrens** ✗ | **children** ✓ |
| `takesArticle('children')` | true | **false** |

后果（句子火车员/语法题会实际生成）：
- 「我喜欢孩子们（复数）」→ `I like __.` 选项 `childrens / children / childrenes`，
  正确答案被标成 **childrens**
- `This is a children.` / `There is a children over there.`（a + 复数）

修法：`children` 进 `PLURAL_ONLY`，同时给 `IRREG_PLURAL` 补
`children/people/police` 三条「复数同形」，保证 `pluralOf` 原样返回。
顺带核过词库里其余不规则复数（fish/sheep/deer）本来就正确，无需改。

验收 `_audit/probe_sentence_plural.py`：3 个难度 × 200 轮 = **3600 题，0 错句**；
门禁新增断言防止以后再漏。音频零改动（`audio/childrens.mp3` 是历史派生产物，
修后不会再被任何文本触发，留档不动）。

**版本链**：BUILD .8 → .9；app v105 → v106；CACHE v159 → v160；
grammar-engine.js v7 → v8（3 个页面 + SW CORE）；AUDIO_VER 4 等音频版本不动。

## 2026-11-09.8 修拼词复习泄底（当前段答案印在题面上）

**家长截图**：课本 → 拼词复习，中文「工作努力的；辛勤的」，题面上一行
`hard · working` —— 红色的 `working` 正是当前要拼的那一段，孩子照着字母块点就行。

**根因**：`pep.html` 的 `renderSpell()` 里 `partTip` 对「当前段」直接
`<b style="color:#FF6B6B">${esc(p)}</b>` 原样输出，只有单段词才不渲染这一行，
所以**所有带空格/连字符的短语词**都中招（hard-working、get up、ice cream…）。

**修法**：已拼完的段保留绿色删除线（那是孩子自己拼对的，应该看到）；
当前段改成固定 4 个 `▁▁▁▁`（不按字母数，避免泄露长度）；
未到的段用 `……`。发音与空槽数不变，难度只回到「听音 + 看中文 + 看空槽」。

**验收**（`_audit/probe_spell_leak.py`，真浏览器 headless）：
`pep5a-u1` 第 7 词 hard-working，第 0 段可见文本不含 hard/working、
第 1 段为 `hard · ▁▁▁▁`、可见文本不含 working，`PASS`。
门禁新增断言：`pep.html` 必须含 `▁▁▁▁` 占位，且不得再出现
「当前段用红色粗体 esc(p) 原样输出」那行代码。

**注意**：`words.html` 拼写工坊第 2 步「看清楚：几个字母？」是**有意的教学步骤**
（先看后拼），第 5 步打错两次后可点「看答案」，都不算泄底，不要一起改掉。

**版本链**：BUILD .7 → .8；app v104 → v105；CACHE v158 → v159；
AUDIO_VER 4 / SENTENCE_VER 2 / PHRASE_VER 2 / PHONICS_VER 2 不动，音频零改动。

## 2026-11-09.7 全站换 C2 声线（LibriTTS / CC BY 4.0，须署名）

**家长试听后选定 C2**（libritts-high 的 381 号女声，「她的比较清楚」）。
机器口径 38 词单遍 ASR 严格命中：线上 V3 6/38、C1(221) 30/38、
C2(381) 27/38、C3(843) 27/38；C2 虽比 C1 低 3 词，但在
**26 字母名 / 67 拼读块 / 弱读冠词 / 含空格短语**专项复核里明显更清楚：
51 条特殊条目 ASR 覆盖 37 条（V3 只有 17 条），26 条含空格短语逐条全对，
V3 把 `drama class` 听成 `drummer class`、字母名成片粘连，C2 都能分开。
最后一公里是「声音亲不亲切」这种机器证明不了的事，以家长试听为准。

**换了什么**：单词类 2874 + 整句 503 + 词块 44，共 3421 个 mp3 全量重烘；
`audio/phonics/` 39 个母语者录音不动。
Piper(MIT) + `en_US-libritts-high`（模型权重 MIT / 训练数据 LibriTTS
OpenSLR 60 **CC BY 4.0**），固定 `speaker_id=381`，
**`--noise_scale 0 --noise_w 0` 钉死噪声**（默认噪声下同词连烘 5 次 MD5 全不同，
音色会随每次发版飘）。分类参数沿用线上，不擅自改教学节奏：
单词 1.0 / 96k / -70dB 裁静音；整句与词块 1.1 / 64k / 不裁。

**新增的合规义务**：CC BY 4.0 要求署名 + 许可链接 + 改动说明，
`THIRD-PARTY-NOTICES.txt` 第三节已按论文标题 / 8 位作者 / OpenSLR SLR60 /
CC BY 4.0 全文补齐；`disclaimer.html`、`parents.html`、`README.md|txt`
与 `js/app.js` 的 `speechEnv().engine` 同步改写，不再声称「公有领域声线」。
事实门禁新增断言守住这些披露，防止以后换声线又漏改。

**顺手修掉的旧数字**：`speechEnv()` 曾写「2903 个 + 497 句整句」、
`README.md` 文件结构写「2450 条 slug」、`js/sentence.js` 注释写「497 句」、
`THIRD-PARTY-NOTICES.txt` 写「2450 + 497」，均为历史遗留，现统一口径为：
**合计 3463 个音频文件** = 2878 条词音频 + 502 句整句 + 44 段词块 + 39 个字母音
（其中「词音频 + 字母音」= 2917，是披露页 `disclaimer` / `parents` 里那个数字的口径）。

**版本链**：BUILD 2026-11-09.6 → .7；app v103 → v104；CACHE v157 → v158；
AUDIO_VER 3 → 4、SENTENCE_VER 1 → 2、PHRASE_VER 1 → 2（PHONICS_VER 2 不动）；
AUDIO_CACHE v4 → v5，activate 自动清掉上一代整包。
生成脚本 `_tts/build_c2.py`、专项复核 `probe_c2_special.py` /
`align_c2_special.py`、部署 `_tts/deploy_c2.py`。

## 2026-11-09.6 单词发音 V3 重烘（没换声线，别再改回调参）

**家长反馈**：「单词声音听起来很奇怪，比如粉色 pink」。改成只念一个单词的
「听词选图」后，短词失去了句子语流的上下文，音质短板被放大。

**根因不是声线，是生成参数**（14 组同口径 A/B，32 词机器转写正确率）：

| 方案 | 正确 | 短爆破音词 | 结论 |
|---|---|---|---|
| 线上 v2（1.1 / 48k→实 56k / -50dB 硬裁） | 16/32 | 3/12 | 基线 |
| 只换 `en_US-ljspeech-high`（同数据集 high 版） | 8~14/32 | 1~4/12 | **更差，弃** |
| 换 `en_US-lessac-high` | 24/32 | 10/12 | 音质最好，但训练数据是 Blizzard 2013 **研究专用许可**，明确禁止语音合成产品开发与分发，公开发布站点不能用，**弃** |
| **v3：保持 medium，1.0 / 96k / -70dB** | **24/32** | **7/12** | **采用** |

`-50dB` 硬裁首尾静音是主凶：英语 /p/ /t/ /k/ 清爆破音能量就贴着 -50dB，
被当静音削掉，`pink` 被听成 `Kink`、`pig` 被听成 `K.`、`cat` 被听成 `Pet.`。
换成 -70dB 只削纯数字静音；`length_scale` 从 1.1 回到模型原生 1.0 去掉拖沓；
96kbps 保住清辅音高频细节。

**没动的部分**（各有独立版本号，避免全站音色被悄悄换掉）：
`audio/sentences/` 503 句（SENTENCE_VER=1）、`audio/phrases/` 44 词块
（PHRASE_VER=1）、`audio/phonics/` 39 字母音（PHONICS_VER=2，母语者录音、
本来就不是同一个音源）、`js/audio-list.js`（清单未变）。

体积：单词包 12.69 MB → 约 21 MB；音频按需缓存、不进 SW 的 CORE/BOOT，
首屏不受影响；`AUDIO_CACHE` v3 → v4，activate 会自动删掉上一代整包。

生成脚本在项目外 `_tts/`：`build_words_v3.py`（合成/校验）、`deploy_v3.py`（接入）、
`ab_high.py` / `ab_round2.py` / `score_asr.py`（A/B 取证，参数别凭印象改）。

## 2026-11-09.5 听词选图：把句子题改成单词题（别改回去）

**家长决策**：上一版把「听句选图」整体下线后，家长认为删除影响太大，建议
「改成听词选图，只说单词，让他们选择」。这个改法比逐条补黑名单更根本：

| 老问题（听句选图） | 听单词后 |
|---|---|
| `I have a children.` / `I have an o'clock.` 等病句 | 不出句子，a/an、可数性、唯复数全部无关 |
| 485 句要逐句烘整句音频（5.28 MB） | 直接复用站内已有的单词 mp3 |
| 两段拼接断一下、冠词弱读 | 一个文件一次播完 |
| 选项印英文单词 = 看拼写选，听力白做 | 选项**只给图**，答对才揭示 |
| `year` / `month` 两张日历图同屏 | 同题四个选项来自四个**不同主题** |

**词池不是拍脑袋黑名单**，是 `_audit/build_wordpic_pool.py` 按 5 条可复算规则
从真浏览器量测结果里筛出来的 **364 词 / 28 主题**：

1. 具体实物主题白名单；`country` 整主题剔除 —— 7 个国家词是蓝底白字首字母块
   （China / Canada 都是 C），孩子没法分辨。
2. `hasIcon` 真图 + 有站内单词 mp3 + 单词不含空格。
3. 图的有效像素：把每张 SVG 画到 64×64 画布，`ink>=0.14` 且
   `(colors>=5 或 ink>=0.20)`。剔掉 `plate` / `message` / `story` / `breakfast`
   这类淡到看不见的图（其中 `plate` 只有 1 种颜色、ink 0.066）。
4. 逐条读过词表后，剔掉抽象概念 / 动作 / 总称词（`peace` / `pay` / `kick` /
   `colour` / `vegetable`…）；剔完不足 4 词的主题整组剔除。
5. 运行时 `wpConflict`：同主题、同中文、同音（`ipaOf`）、同渲染图、同近图组
   一律不能同题；再加一张跨主题近图组表（车 / 船 / 飞机 / 球 / 天气成对词…）。

- 量测：`_audit/probe_wordpic_pool.html`（撞图/同音/音频覆盖）、
  `probe_wordpic_contrast.html`（图像有效像素）、`probe_wordpic_wall.html`（人眼复核图墙）
- 生成：`_audit/build_wordpic_pool.py` → `_audit/wordpic_final.json` + `wp_words.js`
- 自测：`_audit/test_wordpic_pool.js`（5000 轮抽题，检查四图互异/无泄答案）

⛔ **改词库、图库、SVG 或出题规则，必须重跑上面三个探针 + 生成脚本 + 自测**。
更不要在选项里印英文或中文 —— 那就退回成认字题，是这个游戏唯一不能碰的红线。

## 2026-11-09.4 下线「听句选图」（.5 已改成听词选图重做，不是恢复旧玩法）

**用户拍板**：「这是什么垃圾题目？如果处理不好这些垃圾题目，你就直接给我删掉吧。
这个游戏就不要要了。」截图题目是 `year` vs `month`（两张几乎一样的日历图），
句子是 `I have a year.` 这类病句。

**为什么删而不是补黑名单**：这个游戏的选题机制有三处结构性缺陷，不是 109 个词
黑名单能堵住的 ——
1. 名词池直接取 `gxNouns(全词库)` + `hasIcon + takesArticle`。`takesArticle`
   只管「能不能加 a/an」，不管这个词有没有**清晰可辨、语义不混淆**的图，
   于是 `year / month / day / hour / o'clock / children / forget` 全进来了；
2. 干扰项与正确项从**同一个名词池**随机取，`seenIcon` 只按 SVG 完全相等去重，
   `year` 和 `month` 是两张不同的日历图，因此能同时出现在四个选项里；
3. 选项卡片直接印英文单词，孩子听到 /jɪə/ 看拼写就能选，听力训练形同虚设。

要修干净得重做选题引擎 + 建视觉相似组 + 去掉选项文字，等于重写一个游戏；
用户明确不要了，所以整体下线，不为「保住题量」留半成品。

**删了什么**：`GAMES` 的 `picsent` 项、`startGame` 路由、`games.html` 游戏5 整段
（含 `FOOD_PLURAL` / `foodSay` / `gPicSent` / `_picShow` 等）、
`audio/sentences/` 下 485 个专属整句 mp3（5.28 MB）、`SENTENCE_AUDIO` 相应 485 条。
`GAME_COUNT` 7→6，首页 / meta / SEO / README / 封面图数字全部同步。

**保留了什么（别连带删）**：
- `ZH_QTY` / `zhQty` 中文量词表 —— 游戏4「句子火车员」的 there be 题目在用；
- 44 段连读词块 + `weak_a` / `weak_an` —— 句子火车员、句子工厂的动态句仍靠它们接龙；
- 503 句固定例句整句音频 —— 教材课堂、句子工厂在用；
- `pluralOf` / `takesArticle` / `hasIcon` 等引擎函数 —— 其他 6 个游戏在用。

⛔ **别把 `_audit/picsent_*.json`、`_tts/build_picsent.py` 当成可复用的现成方案**：
它们只是这次失败方案的历史记录。真要做句子级听力，先解决上面三条，
再考虑烘整句音频，否则就是把垃圾题固化成 mp3。

## 2026-11-09.3 听句选图：整句音频全覆盖（已于 .4 整体下线，以下仅为历史记录）


**现象**：家长反馈「听句选图的句子不流畅」。上一轮加的连读词块只解决了冠词的
**读音**（a 不再念字母名），没解决**流畅度**——真实页面逐句量测：485 句全部
没有整句 mp3，全部被切成 **2 段**（`I drink` | `juice`、`This is a` | `cat`）。
两段是两次独立合成，各自带首尾静音，中间还夹一次 `onended` 调度，听感就是
「This is a … 　cat.」断一下，而且词块是当完整短语念的，句尾已经降调了。

**解法**：把 485 句全部用 Piper 一次合成整句（同参数 length_scale 1.1 / 64kbps /
22050Hz 单声道，共 **5.28 MB**，按需加载、不进 CORE），登记进 `SENTENCE_AUDIO`。
`speakSentence` 走整句优先，一次播完，0.65–1.0 秒一句，有连读、弱读和句末语调。
ASR 抽检：`This is a cat.` / `I eat eggs.` / `I have an umbrella.` / `I see red.` 全对。

- 句表：`_audit/picsent_final.json`（slug ↔ 文本），slug 清单 `_audit/picsent_slugs.json`
- 枚举：真浏览器 iframe 探针 `_audit/probe_picsent.html`（复现 games.html 的 5 类句型 + 全库词池）
- 合成：`_tts/build_picsent.py`；自测：`_audit/test_picsent_audio.js`
- 烘音频前修掉 4 句可数单数裸用病句：`I eat egg.` → `I eat eggs.`（biscuit / dumpling / noodle 同）。
  `games.html` 的 `FOOD_PLURAL` + `foodSay()` 是唯一出口，中文「我吃鸡蛋。」不变。

⛔ **改了 games.html 的句型、词池或 FOOD_PLURAL，必须重跑探针 + 重烘 + 重跑自测**，
否则新句子又会静默退回两段拼接。也不要把这 485 个文件删掉只留词块——那就是本次要修的问题。

## 2026-11-09.2 句子朗读根治 + 词卡空白占位清理（别改回去）

**根因（用语音识别实测出来的，不是猜的）**：`audio/a.mp3` 被识别成 **"Hey"** ——
Piper 单独合成冠词 `a` 时念的是字母名 /eɪ/。动态生成的句子（听句选图、句子火车员、
句子工厂）没有整句 mp3，只能逐词接龙，于是 `This is a cat.` 读成 `This is A cat.`，
每句都不对。而 `a.mp3` 又必须保留字母名，因为字母岛「字母名 A」用的就是它。

**解法（三层，别只留一层）**：
1. **连读词块** `audio/phrases/`（44 段 / 389KB）：把 `This is a` / `I have a` /
   `I don't like` / `We like` 这类固定前半段一次合成。Piper 在短语里会把 a 自然弱读
   （ASR 验证：`This is a` → "This is a"，不是 "Hey"）。`sentence.js::__speakFrom`
   从当前词起试最长 4 词前缀，命中就整块播完；`prewarmSentence` 用同一套切法预热。
2. **弱读冠词兜底** `audio/weak_a.mp3` / `weak_an.mp3`（载体词 uh / un）：
   逐词链里遇到**小写** `a`/`an` 就换这两个文件；大写 `A` 仍是字母名，两者不冲突。
3. **固定短句补整句**：`I run.` / `Birds fly.` / `We sing.` / `We drink milk.` /
   `I am a boy.` / `I am a girl.` 6 句加进 `SENTENCE_AUDIO`，不再逐词蹦。

⛔ 不要为了「省文件」把 44 段词块删掉只留 weak_a：weak_a 是单个音，
没有连读和节奏，句子又会变回一个字一个字蹦。通用动态句也不要给上千种组合各存一整句，
静态站扛不住那个体积；**但听句选图是 485 句的有限集合，已在 2026-11-09.3 全部烘成整句
（5.28 MB），这是流畅度的唯一解，见下一节**。

**词卡空白**：`words.html` 三处 `<div class="dec" style="background:transparent">`
是纯占位空块、`<div class="ph">` 对不标音标的词留一整行空白 —— 现在改成显示真实
主题信息 / 不渲染空行；「我的词单」标签加了 `undefined` 兜底。全站 61 主题 1000 词
逐一渲染核验，`word-card` 无空卡、无空图。

版本：app v99 / sentence v49 / audio-list v4 / CACHE v153（AUDIO_CACHE 保持 v3，
新音频是新 URL，换名会清掉用户已缓存的十几 MB）。

## 2026-11-09.1 长句发音逻辑修复（别改回去）

**用户反馈**：「有很多长句子的发音逻辑不对，7 个游戏，教材课堂你都看看还是之前的吧」。

### 三个根因
1. **派生词缺音频 → 逐词接龙静默漏词**（「发音逻辑不对」的主因）。
   生成句里的复数/三单没有 mp3，`__speakFrom` 遇到没音频的词直接跳过：
   "I have two numbers." 读成 "I have two"、"She talks every day." 读成 "She every day."。
   补 15 个派生词音频（numbers/words/sentences/texts/notebooks/raincoats/umbrellas/
   tears/colours + talks/dreams/begins/stays/cheers/greets），Piper 同参数合成。
2. **"I like reds." 病句**：颜色词被当可数名词进复数池。red 等 10 个纯颜色词
   加进 UNCOUNTABLE（orange 不加，它是水果），病句消灭。
3. **拼词块朗读念字母名**：pep 拼词小火车 / words 音节跟读走 `speak(block)` →
   `localAudioURL('th')` → `audio/th.mp3` = TTS 把 "th" 当词合成的 **"T H"**。
   新增 `speakBlock()` 统一入口：块音一律走 audio/phonics/（母语者音素），
   没音素文件的块（tion/ing…）才退回词音频。删掉 7 个念字母名的坏块文件
   （sh/ch/th/ai/ay/oa/ck）—— 注意 E='ee'、R='ar' 那批是正确巧合，保留。

### 顺带修的
- **pep.html 是唯一没加载 sentence.js 的内容页**（「还是之前的吧」——对）：
  例句走 `speakWord` 旧链。现在加载 sentence.js、例句改 `speakSentence`，
  与 getsmart/games/grammar 同链（整句优先 + 逐词预热）。
- **句子火车读句混中文**：`q.zh.split('.')[0]` 问句没英文句号 split 不开，
  中文整段进英文朗读。改用 `sent.replace('__', ans)`（英文句的唯一真相）。

### 门禁（+10，共 114 项）
派生词音频齐全（复数/三单/进行时逐条对）、颜色词 pluralSafe=false、
speakBlock 存在且 pep/words 都走它、坏块文件不许复活、gSentence 不许 zh.split 读句。

### 教训
「发音逻辑不对」的根因常是**静默跳过**而不是报错——__speakFrom 对没音频的词
一声不吭跳过，句子残缺但程序正常。检查发音必须**逐词对音频清单**，
不能只看「页面能跑」。

## 2026-11-08.29 音标查找：大小写不敏感 + 恢复斜杠

**用户反馈**：「为啥没有音标或者音标的旁边的斜杠？」（截图：Thursday 卡整行没音标；
start 卡有 stɑrt 但没 /…/）。

### 两个 bug（都与上一轮修 //muv// 有关）
1. **大小写不敏感缺失**：pepIpaOf 拿 `toLowerCase()` 后的 thursday 去查，但
   PEP_IPA 和 ipa.js 的键都是 `Thursday`（大写 T，星期/月份/国名都是）——
   两边都落空 → 音标整行消失。**34 个大写键全中招**（Mon–Sun、十二个月、China…）。
2. **斜杠被剥掉**：pepIpaOf 里 `replace(/^\/+|\/+$/g,'')` 把 /stɑrt/ 剥成 stɑrt，
   看起来像把单词又打一遍。这是修 //muv// 时「删了显示端补斜杠、没删查找端剥斜杠」
   的半截手术。

### 修法（单一出口）
- `ipaOf` / `pepIpaOf` 都做三键查找（原样 / 小写 / 首字母大写），并统一输出 `/…/` 一对斜杠。
- 显示端一律直接印，谁也不许再手工拼斜杠（曾拼成 //muv//）。
- PEP_IPA 的值本身不带斜杠 → 由 pepIpaOf 包一层，全站一致。

### 验证
- 新增 `_audit/test_ipa_lookup.js`：**从源文件抽真实函数**跑 19 项断言
  （Thursday/thursday/start/move/eraser/Wednesday… 全部命中且带斜杠、无双斜杠）。
- check_facts 105 项（+3：真实实现自测 / 显示端禁拼斜杠 / ipaOf 大小写不敏感）。

### 教训
修 bug 只删一半（删补斜杠、留剥斜杠）等于把 bug 换了个方向。
**一条数据链上的「加/减」操作必须成对处理**，改完跑一遍端到端断言。

## 2026-11-08.28 英式残留清零

用户：「还有没有用英式英语的？」

全站扫完：
- **PEP_IPA**：BATH 音 5 处（grass/classmate/plant/card/garden 的 ɑː→æ 或 ɑr）+ 长音符 12 处，全清
- **ipa.js 主字典**：0 英式、0 长音符（已验证，之前的「英式记号」全是误报——
  fire/faɪər/ 里的 ɪə 是 faɪ+ər 不是 NEAR 音）
- **ASR 抽查** grass/classmate/tomato 音频全对
- 两表口径统一：美式、无长音符、/ɜr/ 不是 /ɝ/

## 2026-11-08.27 PEP_IPA 表大修

用户：「这个声音对吗？」（截图 eraser 显示 /i'reisər/）。

### 问题（一查一大片）
PEP_IPA 表（课本页专用音标表）有三类错：
1. **5 条混入了记忆法文本**：orange/cake/ruler/bread/train 的值是中文记忆法不是 IPA
2. **230 条是英式音标**：əʊ→oʊ、ɒ→ɑ、ɜː→ɜr、juː→ju，和全站美式口径矛盾
3. **缺重音符号**：eraser 写成 ɪreɪzə（英式、无重音），应为 ɪˈreɪsər（美式）

ASR 把 eraser 听成 "A razor"（/z/ 不是 /s/），也印证了音标是英式。

### 修了
- 5 条记忆法文本 → 正确 IPA
- 230 条英式 → 美式（əʊ/ɒ/ɜː/juː 全部清零）
- 补重音符号
- eraser = ɪˈreɪsər（美式，和音频一致）

## 2026-11-08.26 音标显示与准确性修正

用户：「这个的发音我总觉不对」（截图 move 音标显示 //muv//）。
1. pep.html 音标双斜杠：IPA 自带斜杠又加了一对 → 修掉
2. 3 个真错音标：chocolate /ɔ/→/ɑ/、beautiful /ə/→/ɪ/、every 去多余 schwa
3. ASR 抽查 8 词音频全对——发音没问题，是显示让人以为标错了

## 2026-11-08.25 记忆法质量修正

用户截图：「来自古英语没写清楚」「真构词纯属没用」。
删全部「真构词」标签（114 条）；281 条干巴巴词源换有用钩子；
9 条拆解补结论。判据：孩子读完能不能记住这个词。

## 2026-11-08.24 文档一致性扫尾（主动全站扫）

**用户反馈**：「还有没有其他漏的或者其他错的？为啥不弄？」—— 说得对，不该等他找。

### 扫出 6 处文档-实际不一致，全修
| 问题 | 位置 | 严重度 |
|---|---|---|
| **README.txt 两处「同一个说话人」**（字母音已是母语者录音） | README.txt:16,123 | **披露错误** |
| README 字母岛写「字母名/代表词」，漏了字母音 | README.md:26 | 知识性 |
| README 写「页面网络优先」，实际已改「缓存优先」 | README.md:44 | 不一致 |
| README.txt 写「备份与恢复」，已改名「备份与同步」 | README.txt:31 | 过时 |
| OG 描述写「按年级分主题」（用户要求去年级标签） | index.html | 轻微 |
| sitemap 缺 404.html | sitemap.xml | 轻微 |

### 确认干净的（扫过无问题）
- 声音按钮-行为一致性（28 个按钮逐条对了）
- 原生 confirm/alert/prompt 清零、死按钮 0、死链 0
- 音频覆盖（1440 个词全部有音频，之前误报 17 个是正则问题）
- 数字对账（游戏 7 / 词 1000 / 句 497 / 音频 2903 / 语法 19 关）
- 语法页年级标注已清、TODO 无实际占位

### 门禁 +4（第 12 节，共 102 项）
文档-实际一致性：不许说「同一个说话人」、不许说「网络优先」、
字母岛描述必须含「字母音」、不许用旧名「备份与恢复」。

### 根因（又一次）
**改了产品的一部分，相关披露文案没全扫**。换母语者录音时改了 disclaimer
的细节段，但 README.txt 的结论句漏了。以后改「事实」必须 grep 全站所有
提到该事实的文件。门禁就是抓这个的。

## 2026-11-08.23 备份/同步合并 + 免责声明纠偏

**用户反馈**：「家长中心的两个同步码是不是有点重复？免责声明有没有没写清楚的？」

### 问题 1：两套功能重复
「🔄 跨设备同步（同步码）」和「💾 备份与恢复」本质都是「把进度搬到别处」，
但用户得自己判断该用哪个，还用了两个不同名字（同步码/备份码）。

**合并为一套「💾 备份与同步」**：
- 「📤 导出进度」一步出两样：短码（发微信）+ 备份文件（下载存档）
- 「📥 粘贴短码恢复」自动识别：{ 开头 = 裸 JSON，否则当压缩短码解析
- 「📂 选择备份文件恢复」不变
- 删掉死代码 importProfileText（功能已合并进 importFromSyncCode）

### 问题 2：语音来源自相矛盾（实锤）
「语音来源说明」开头写「全站只有一个人的声音」，但同页下面写
「字母音与拼读块为另一套母语者录音」。换母语者录音时漏改了开头。
已改为「全站发音都是静态音频文件，分两套声源」。

### 问题 3：免责缺口
- 第 7 条只说「使用导出功能」，没提同步码 → 补上
- 短码经微信/短信传输，安全由该渠道负责 → **原来没写**，已补：
  「短码本身不加密，看到码的人可以恢复你的进度」
- 家长须知同步改措辞

## 2026-11-08.22 课程词记忆法全覆盖（588 条缺口补完）

**用户反馈**：「单词这么多 1200 多个吧，是不是有很多单词没有记忆法？」——对。

### 问题
`getsmart-data.js` 课程词 1026 个去重后，**588 个没有记忆法**（57%）：
- 主词库 999 条只能覆盖 381 个课程词
- PEP_MEM 精写只有 301 条（命中 76 个课程词）
- 其余全靠 PEP_COMPOUNDS 32 条复合词表，杯水车薪

### 做了什么
PEP_MEM 表从 301 → **890 条**（+589），课程词覆盖 43% → **100%**：

| 类型 | 条数 | 方法 |
|---|---|---|
| 复数/变形（apples/teeth/feet…） | 44 | 自动：X = base 词 + s/es 复数 |
| 复合词（bookstore/armchair…） | 14 | 自动：book + store = 书店 |
| 短语（stand up/a bag of chips…） | 181 | 逐词拆解教记法 |
| 独立词（acrobat/architect…） | 349 | 刘一男式词源串词 |
| 零碎补漏 | 31 | 变形/短语 |

**短语也教怎么记**（用户明确要求）：不只给答案，还教拆法——
`a bag of chips = a bag（一袋）+ of（的）+ chips（薯片）`、
`endangered species = endangered（濒危的）+ species（物种）`。

### 验证
check_facts 97 项全过；课程词覆盖扫描 **1026/1026，0 缺口**。

## 2026-11-08.21 记忆法批次 5（最后一批，第 801–999 条，改 199 条）—— 797/999 全部完成

**有惊喜感的**：
- both 来自古英语 bā þā（那两个）——tw- 词族（二）：two、twice、between、twenty
- police 来自拉丁 polis（城市）——police 就是「城市管理」，politics 政治同根
- thing 原是「集会上讨论的东西」（古英语 þing 集会）
- not 来自古英语 nāwiht（没有东西）——not 和 naught/nothing 同源
- person 来自拉丁 persona（面具）——person 原是「面具/角色」
- neighbour = neigh-（近）+ bour（家）：住在附近的人
- very 来自拉丁 verus（真的）——very 原意是「真的」！
- praise 来自拉丁 pretium（价值）——praise 就是「说你有价值」，price 同根

### 记忆法升级全部完成（2026-11-08 一天内五批）
| 批次 | 范围 | 改动 | 代表 |
|---|---|---|---|
| 1 | 0–199 | 195 | thank←think、doctor=教 |
| 2 | 200–399 | 199 | hamburger=汉堡城（非火腿）、window=风的眼 |
| 3 | 400–599 | 199 | Sept=七/Oct=八、星期=神名 |
| 4 | 600–799 | 200 | money=铸钱女神、noon=第九小时、China=秦 |
| 5 | 800–998 | 199 | both=那两个、police=城市、person=面具 |
| **合计** | | **797** | 词序/释义/词性零改动 |

## 2026-11-08.20 记忆法批次 4（第 601–800 条，改 200 条）

**最有惊喜感的一批**：
- money 来自拉丁 Moneta（铸钱女神朱诺的别名）——她的庙里铸钱，money 就是「铸钱女神」的地方
- noon 来自拉丁 nona（第九个时辰）——noon 原是「第九个小时」（下午三点）！后来才指正午
- China 来自梵语 Cina（秦）——中国的名字来自「秦」朝
- volcano 来自罗马火神 Vulcan——火山是「火神的山」
- octopus = octo-（八）+ pus（脚）：八条腿。October 十月同根（古第八月）
- wrong 来自古英语 wrang（扭歪的）——wrong 原是「歪的」
- travel 来自法语 travail（辛苦的工作）——travel 原意是「辛苦的旅程」
- magazine 来自阿拉伯语 makhazin（仓库）——杂志是「知识的仓库」

其它：vitamin = vita（生命）+ amine；piano = pianoforte（轻和响）；
Christmas = Christ + mas（弥撒）；story 和 history 同源。
词序/释义/词性零改动。备份 _audit/words-data.bak2.js。还剩最后一批 5（801–999）。

## 2026-11-08.19 记忆法批次 3（第 401–600 条，改 199 条）

继续三层法。**这一批的金矿是月份**——原来写「Sep 像「开」+ tember 像「学」」全是假音变，
真相是拉丁数字，孩子会觉得很有意思：

- September = septem（七）——古罗马历法里真的是**第 7 个月**
- October = octo（八）——真的是第 8 个月（octopus 八爪鱼同根）
- November = novem（九）——真的是第 9 个月
- December = decem（十）——真的是第 10 个月（decade 十年同根）
- July = Julius Caesar（凯撒大帝）、August = Augustus（奥古斯都皇帝）

**其它有惊喜感的**：
- ambulance 来自拉丁 ambulare（走动）——「流动的医院」，跟着伤员走（原来写「俺不能死」谐音）
- coach 来自匈牙利 Kocs 村（造马车的地方）——马车→教练车→教练
- hospital / hotel / host 是一家（hospit- 客人）：hospital 原是「收留客人的地方」
- music 和 museum 同源（希腊 Mousa 缪斯）：艺术一家
- left 原意是「弱的」（弱手）、right 原意是「直的/对的」（正手）
- 12 个星期 = 北欧神名（Moon/Tyr/Woden/Thor/Frigg/Saturn/Sun），原条目本来就对，保留

职业后缀成串记：-er（driver/worker/singer）、-ist（scientist/dentist/artist）。
备份 _audit/words-data.bak2.js（含前两批）。词序/释义/词性零改动。

## 2026-11-08.18 记忆法批次 2（第 201–400 条，改 199 条）

按批次 1 的三层法继续：真词源 130 / 真构词纠偏 22 / 有据联想 47。

**新抓到的「假构词」**（比假音变更隐蔽，因为看起来像真的）：
- hamburger 原写「ham 火腿 + burger 饼」——**假的**。其实来自德国汉堡城 Hamburg。
- beef / pork 原写「b 像牛 + eef 像「必富」」——真相反转：贵族吃肉说法语
  （beef/pork），农民养牛猪说英语（cow/pig），所以「牛」和「牛肉」长得不像。
- tomorrow 原写「tomor 像「明天」」——其实是 to + morn（早晨）。

**最有惊喜感的**：window = wind + eye（古北欧语「风的眼睛」）、spider =「纺纱者」、
hippo = hippos（马）+ potamos（河）、onion 和 one 同根（一层裹成一颗）、
biscuit = bis（两次）+ cook（烤两次的干粮）。

备份 _audit/words-data.bak2.js。词序/释义/词性零改动。还剩批次 3–5。

## 2026-11-08.17 记忆法批次 1：假音变 → 刘一男式词源（别改回去）

**用户反馈**：「现在的记忆法比你推荐的好，你有没有好好学刘一男的英语词源啊？」
—— 说我上一轮给的替代文案（"雪、牛奶、云都是白的"）是**复述中文**，违反「不复述中文」铁律，
比原来的假拆分还差。批评成立，我认了。

### 根因
原记忆法 **792/999 条是「假音变」**：把单词切成无意义片段再安个中文音
（`hite 像「嗨特」`、`cto 像「看」`），教的是假的词内结构。违反铁律「不假拆分」。

### 三层改法（用户拍板：「可以，刘一男式升级吧」）
1. **① 真词源/同源串词**（主力）：词根、音变、同源串词，能举一反三
   - `thank ← think`（th↔k 音变）；`doct-=教` → doctor/document/teach
   - `hospit-=客人` → hospital/host/hotel；`libr-=书` → library/librarian
2. **② 真构词**：sun+ny、balloon = ball+-oon（大）、bike = bi+cycle
3. **③ 有据联想**（真词族，不是乱安音）：bl- 暗（blind/blank/bleak）、gl- 黏滑、sl- 滑、tw- 二

### 本批成果（前 200 条）
195 条已改（`I`/`it` 是好的象形钩子，保留）：
假音变→词源 130 条 / 构词补后缀含义 54 条 / 象形→有据联想 11 条。
备份 `_audit/words-data.bak1.js`。词序、词条数、释义、词性全部未动，只动 `dec` 字段。

### 还剩
批次 2（201–400）、3（401–600）、4（601–800）、5（801–999），共约 597 条待改。
**每批只动「假音变」，不自作聪明编新谐音。**

## 2026-11-08.16 全站知识性错误扫描（读音/语法/释义）

**用户要求**：「扫描全局，看看有没有知识性错误，比如语法错误，读音错误等等」

### 实锤 2 处（已修）
1. **字母岛 A 的「字母名」播的是 I 的名字**。nameEn 写的是 'ay' → 读 audio/ay.mp3，
   而那个文件是把字符串 "ay" 当**词**交给 TTS 合成的，espeak 念成 /aɪ/（字母 I 的名字）。
   用 ASR 逐个听文件确认：audio/ay.mp3 听成 "Five/eye"（=/aɪ/）、audio/a.mp3 听成 "Hey"（=/eɪ/ ✓）。
   已改成 nameEn='A'（走 audio/a.mp3）。
   ⚠️ 同类撞车：E='ee'、R='ar' 也撞拼读块文件，但那两个是**正确的巧合**（E 名 /iː/、R 名 /ɑr/），
   没改。门禁只钉死已验证为错的 'ay'。
2. **A 的象形故事自相矛盾**：说「小鸟张开嘴巴"啊——"地唱歌，a 的读音就藏在这里」，
   但 A 的音是 /æ/「哎」（szh 写的是 /æ/）。已改为「哎——」并写明 /æ/。

### 机器扫过、结论干净的
- **音标库 970 条**：口径是美式、无长音符、/ɜr/ 而非 /ɝ/。无英式写法残留、
  无多主重音、高频词抽查（cat/dog/hot/bird/teacher/banana/orange…）与标准一致。
  （注：orange 的第二音节用 ə，与 CMUdict 一致，不是错。）
- **例句 503 条**（getsmart + pep-points）：主谓一致、冠词、句首大写、句末标点、
  英文句子里混中文标点、常见错拼——0 处真错。（扫描器自己先误报了 8 条
  give→gI've、疑问句里的 he have，是我正则看岔，已剔除。）
- **词性 1000 条**：除 am/is/are 用 'be' 这个刻意的类别外，无越界取值。
- **中英对照 503 对**：问号/句式一致率 100%。
- **语法知识点卡**（pep-points 高危 13 张：复数/冠词/三单/就近/不可数/how many/a lot of）：
  规则本身全对。
- **记忆法泄题**：拼写工坊已有 decLeaks 守卫（含答案就不显示），无泄漏。

### 门禁（94 → 97 项，第 11 节）
26 个字母都有 nameEn；A 不许再用 'ay'；每个 nameEn 必须有对应音频。

## 2026-11-08.15 听音选字母：一轮只考一种（别改回去）

**用户反馈**：贴了两张截图（一题「听字母名」、一题「听字母音」）说「感觉这都不对啊」。

对完证据，两个问题：
1. **「听字母音」那题播的是字母名 + 慢速单词**（旧版），和「听字母名」开头播的是同一个东西
   ——孩子听到的两题没区别，当然觉得不对。这个 16:45 已修（见 .13），
   但**用户玩的是旧页**（新缓存策略先给旧页 + 更新条），所以截图里还是坏的。
2. **一轮里随机一半考名字一半考音**：孩子分不清这题在考什么。→ 改成一轮固定一种，
   题头大字写明（「🔤 听字母名（A 读 /eɪ/）」/「📢 听字母音（A 读 /æ/）」——这轮都考这个）。
   顺带：一轮内不重复出同一个字母。

### 验证（这轮用 ASR 逐个听了音频文件）
- 字母名：audio/y.mp3 → “Y”、w.mp3 → “W”、p.mp3 → “P” ✓ 确实是字母名
- 字母音：audio/phonics/s.mp3 → 空（纯擦音 /s/）、g.mp3 → 无意义音节 ✓ 确实是孤立音素，
  不是字母名 —— 说明 .13 换的母语者录音是对的。
- check_facts 94 项全过。

## 2026-11-08.14 「界面承诺 = 代码做的」专项（门禁升级，别改回去）

**用户反馈**：「我随手一找就是一大堆 bug，你却找不到」—— 说到点子上了。
88 项门禁全绿还连环漏，是因为**门禁在验错的东西**：它验数据自洽、代码自洽，
不验「按钮/题面说的和实际做的是不是一回事」。而用户撞到的全是后者。

### 这一轮按新标准扫出来的
1. **2 处 `window.prompt()`**（同步码、备份恢复）——手机 WebView 同样屏蔽 prompt，
   和上次的 confirm 是一类：**点了没反应**。→ 新增 `askInput()` 站内输入框替换。
2. **README 描述了不存在的功能**：「🔊 单词双读（第二遍逐音拆读 cat → kuh-ah-tuh）」
   ——代码里根本没这功能，而且描述的正是被否掉的"kuh-ah-tuh"。
   → 改成「点读发音」；顺带把字母岛那行改成「字母名、字母音、代表词各读一遍」。
3. **`speakChain()` 死代码**：全站已无调用者，但它正是"字母名+慢速代表词"冒充
   字母音的工具，留着就是陷阱。→ 删除。

### 新门禁（check_facts 88 → 94 项，第 10 节）
- 不许用原生 `confirm/alert/prompt`（手机 WebView 屏蔽 = 点了没反应）
- README 不许描述不存在的功能（kuh-ah-tuh / 单词双读）
- 声音按钮一致性：「听字母音」必须走 playPhonics；字母岛同；不许 rate:0.55/speakChain
- 死按钮扫描：onclick 调用的处理函数必须存在（107 个入口全过）

### 方法论（写给以后的自己）
「随手一点就有一堆」的 bug 是**承诺-行为不一致**类，静态数据校验天生看不见。
每次发版前必须做一遍：**把每个按钮的文案和它调用的函数逐条对**，
再用手机 WebView 的约束（confirm/alert/prompt 会屏蔽）过一遍 API 清单。

## 2026-11-08.13 听音选字母：按钮说听字母音，播的却不是（别改回去）

**用户反馈**：「听音选字母的音频有问题啊」

### 三个问题（都在 gListen 里）
1. **「📢 听字母音」播的不是字母音**：`speakChain([{text:'A'},{text:'apple', rate:0.55}])`
   —— 字母名 + **0.55 倍速的代表词**。这正是用户早就否掉的「拿单词当字母音」，
   而且慢速播放听着像音频坏了。
2. **C 和 K 同音**（都是 /k/）：现在字母音是真的了，同题出现就有两个正确答案，
   孩子点哪个都判错。
3. 答对后又播一遍代表词，进一步坐实「字母音=那个单词」的错误联想。

### 改法
- sound 模式改 `playPhonics(L)`（audio/phonics/，母语者录音）；
  name 模式不变（`speak(L)` = 字母名）。
- 出题加 `SOUND_TWIN = { C:'K', K:'C' }`，同音字母不同题。
- 答对后 `window._listenSay()` 再听一遍刚考的那个音；代表词只留文字。

### 门禁
check_facts 新增 3 条：字母音模式必须走 playPhonics、不许出现 rate:0.55/speakChain、
必须有 SOUND_TWIN。共 88 项。

## 2026-11-08.12 头像商店修通：星星终于花得出去（别改回去）

**用户反馈**：「有了星星想换个头像都不行，要星星有啥用？」

### 两个真 bug
1. **根本换不了当前头像**。头像网格只渲染在「➕ 新建一个档案」里，
   `pickAvatar()` 也只把选择存进 `__pickedAvatar`（给 createProfile 用）。
   想给正在用的档案换头像 —— **没有任何入口**。
2. **`window.confirm` 在手机 WebView 里经常被屏蔽**，被屏蔽时返回 undefined，
   解锁流程直接 return，用户看到的就是「点了没反应」。

### 改法
- 档案弹窗在档案列表下面新增**「🖼️ 换个头像」**（不用展开，一进来就看得到）：
  点一下立刻换当前档案的头像，顶栏/底栏同步；带 🔒 的走星星解锁。
- `applyAvatar(a, mode)`：mode='profile' 改当前档案（`Profiles.updateActive`），
  mode='new' 仍然只是新建时用哪个。两个网格用 `data-avatar-target` 区分。
- 解锁成功后**两个网格里的同一头像一起解锁**（原来只改点中的那个，另一处还挂着 🔒）。
- 新增 `askConfirm(msg, onOk)` 站内确认框，替换全部 4 处 `window.confirm`：
  解锁头像 / 删档案 / 家长中心清进度 / 字母岛「全标已会」。
  顺带修 parents.html 里把 `Profiles.active().name` 当**字面文本**印出来的模板 bug。

### 星星怎么花（说给用户听）
6 个限定头像：🐼30 🦊30 🐙50 🦄80 🐳80 🦁120。解锁后永久有效（存档内）。
⚠️ 解锁记录存在**档案数据**里（`Store.d.unlocked`）：换档案要重新解锁。
如果希望"一台设备解锁一次全家共用"，要改成设备级存储 —— 未做，等用户定。

### 验证
node --check（app.js + 各页内联脚本）通过；check_facts 全过。

## 2026-11-08.11 慢网提速：页面秒开 + 图库让路（别改回去）

**用户反馈**：手机上「经常」出现浏览器自己的白屏转圈（截图是
「服务器正在响应，请稍候」/「正在努力加载」），状态栏网速只有 13~21KB/s。

### 诊断（先量再改）
那两个转圈是**浏览器的首字节等待**，不是站内加载层 —— HTML 还没回来。
量了一下关键路径（gzip 后）：index 首屏约 167KB；
其中 `svg/emoji-svg.js` 单文件 gzip 297KB，是全站最大单体。
在 20KB/s 的链路上，光这一个图库就要 15 秒，而且它是 async 的，
**会和首屏阻塞脚本抢带宽**，把 app.js / words-data 的下载一起拖慢。

### 改了三处
1. **页面导航：网络优先 → 缓存优先 + 后台更新（stale-while-revalidate）**
   原来在线时每次打开都等 GitHub Pages 的响应头，跨境窄带下必然转圈，
   而且**每次**都这样 —— 缓存一点忙都帮不上。
   现在有缓存立刻回页面（老用户秒开），网络请求在后台刷新缓存；
   发新版本由 version.json 的更新条提示用户点刷新。
   ⚠️ 绝不在 controllerchange 里 location.reload()（「一加载就弹回上一级」的老 bug）。
   ⚠️ 代价：发版后老用户看到的是上一版，直到点更新条或下次冷启动。
     比「每次白屏十几秒」划算；更新条本来就有（4 秒首查 + 5 分钟 + 切前台）。
2. **emoji 图库改由 app.js 注入**：正常网速立刻下（行为不变）；
   慢网（2g/3g/省流量）等 load + 空闲再下，图标由 __emojiSvgReady() 就地升级。
   9 个页面里的 `<script async src="svg/emoji-svg.js">` 全部移除，避免绕开这个门。
3. **窄带下跳过 SW 的 CORE 后台整包补齐**（30+ 文件约 700KB）。
   以前 activate 后 1.2 秒就开始后台下，在窄带里就是和首屏抢带宽。
   缺什么以后用到时由 fetch 分支按需入缓存。

### 没做 / 为什么
- **没有换托管**。GitHub Pages 在国内的跨境链路是根本瓶颈，代码能救的是
  「重复访问」和「窄带下的带宽分配」，救不了**首次访问的 TTFB**。
  如果首次打开还是要十几秒，那只能换国内可达的托管（WorkBuddy 站点托管 /
  对象存储 + CDN），这是产品决策，留给用户拍板。
- 没有把 words-data / word-svg 也改异步：首页要用它们渲染内容，
  异步会造成图标和数字「跳一下」，得不偿失。

### 验证
- `node --check` 通过；check_facts 85 项全过（含「HTML 与 sw.js CORE/BOOT 版本一致」）。
- 逻辑上：SWR 命中缓存即返回，后台 netP 由 e.waitUntil 保住生命周期；
  断网无缓存仍走「同页 → 首页 → 503 明确报错」三级兜底。

## 2026-11-08.10 字母音 / 拼读块换成母语者录音（别改回去）

**用户反馈**：「字母自然拼读发音直接用网上的……不要自己弄，你的发音太差了。」

### 做了什么
audio/phonics/ 下 38 个文件换成**母语者逐音素录音**：
- 来源：GitHub `s5s5/phonics`（MIT，Copyright (c) 2022 Xiaochao Liu，
  README 自述 Native speaker pronunciation，public/sound/<IPA>.mp3）
- 取用：25 个字母音（a-z 里除 u）+ 13 个拼读块
  （sh/ch/th/ai/ay/oa/ck/ee/oo/ar/or/ir/ng），取用表在 `_tts/build_phonics_native.py`
- 处理：只做裁静音 + loudnorm 响度归一 + 转 48kbps/22050 单声道（与全站规格一致），
  **发音内容未改**；署名与许可全文在 `THIRD-PARTY-NOTICES.txt`
- 例外：U = /ʌ/ 仍是自合成（源库只有 /ə/ 没有 /ʌ/，教「u 发 /ʌ/」不用 schwa 顶替）

为什么必须换：自合成的辅音是「载体词 buh/kuh + 裁 ʌ」，孩子听到 "buh /æ/ tuh"，
是怪腔；母语者是真孤立音素（/k/ 0.15s 爆破、/ʃ/ 0.64s 擦音）。

### 顺带修的
- **拼读闯关的 sh/ch/th/ai/ay/oa 六族从「听词选图」升级成真拼词**（块音对了才敢拼），
  拼词族从 10 个变 15 个，只剩 a_e/i_e/o_e 三族走选图（字母音 a 是 /æ/，拼 cake 会教错）。
- 新增可拼：fish/ship/shop、three、birthday、lunch/catch/chess 等。
  morning 改成 m-or-n-i-ng（or 是 /ɔɹ/，ng 是 /ŋ/）。
- **字母 O 音标口径**：`/ɒ/ 喔` → `/ɑ/ 啊`（data.js）。全站音标是美式（ipa.js 里
  hot = /hɑt/，一个 ɒ 都没有），字母音也是 /ɑ/，只有字母岛写着 /ɒ/，属于知识性不一致。

### 版权口径（别再说"谁都能读没版权"）
孤立音素录音**是有版权的**（录音制品权）。能安全用的是 CC0 / MIT / CC-BY 这类
明确许可的来源，且 MIT 要求保留版权声明。本站现在是：
单词与句子 = 自合成（Piper + 公有领域声线）；字母音与拼读块 = s5s5/phonics（MIT）。
disclaimer / parents / README / THIRD-PARTY-NOTICES 四处已同步，**不再说"同一个说话人"**。

### 验证
- 38 个新文件逐个 ffmpeg 复核时长与响度（/k/ 0.15s、/ʃ/ 0.64s、/æ/ 0.43s…）
- `check_facts.py` 86 项全过（新增：拼读块必须在 audio/phonics/ 有同名文件、
  39 个文件数、念错的块不许走 localAudioURL）
- `_audit/test_phonics.js` 644 项全过（15 个拼词族 + 3 个选图族各跑两遍）

### 环境限制（记录备查）
本机出网被代理限制：只有 `api.github.com` 可用，upload.wikimedia.org / freesound /
huggingface / raw.githubusercontent 全部不通。所以「从网上拿音频」实际只能走 GitHub
API 取文件 —— 这也是为什么最终选的是 GitHub 上的 MIT 项目，而不是维基共享的 IPA 录音
（后者许可是 CC BY-SA，改编要同权共享，且网络不通）。

## 2026-11-08.9 拼读闯关修正（上一版是错的，别改回去）

**用户反馈**：「现在的拼读闯关完全不合格了。题目都是错的。念的读音也很奇怪。」

上一版（11-08.8）是我做的「听逐音 /k/ /æ/ /t/ 再把字母块拼成词」，两个硬伤：

### 1. 读音是假的 —— 拼读块被当成"词"合成，念出来是字母名

`build_words.py` 把 `sh / ch / th / ee / oo / ai / ay / oa / ck / ar / or / ir / ing`
当成普通词丢给 Piper，而 espeak 对不认识的"词"会**逐字母念字母名**。
用 `piper --debug` 看音素序列，实测：

| 块 | 实际念的 | 应该是 |
|---|---|---|
| sh | `ˌesˈeɪtʃ`（"S H"） | /ʃ/ |
| ch | `siː eɪtʃ`（"C H"） | /tʃ/ |
| th | `tiː eɪtʃ`（"T H"） | /θ/ |
| ck | `siː keɪ`（"C K"） | /k/ |
| ai | `ˌeɪˈaɪ`（"A I"） | /eɪ/ |
| ay | `ˈaɪ`（"I"） | /eɪ/ |
| oa | `ˈəʊə`（怪音） | /oʊ/ |
| ee | `/iː/` ✅ | /iː/ |
| oo | `/uː/` ✅ | /uː/ |
| ar | `/ɑː/` ✅ | /ɑː/ |
| or | `/ɔː/` ✅ | /ɔː/ |
| ir | `/ɜː/` ✅ | /ɜː/ |
| ing | `/ɪŋ/` ✅ | /ɪŋ/ |

上一版有 7 个族（sh/ch/th/ai-ay/oa/ck）全靠这些爆音，占题目三分之一以上。
**教训：给 TTS 一个不是单词的字符串，它不会报错，它会念字母名。**
凡是"音素级"音频，必须用 `--debug` 看音素序列自证，不能凭「有个文件就能用」。

### 2. 题目本身无解 —— 槽位数是我手工切的分块数

槽位固定 `segs.length` 格。孩子按常规拼写拆 `clock = c-l-o-c-k`（5 块）时，
第 5 块点不进去（`S.ans.length >= S.seg.length` 直接 return），4 格填满即判错。
**按作者的切法猜**，正确答案被判成错。

### 3. 现在怎么做

- `PH_BLOCK_SRC` 白名单：只有上表 ✅ 的块允许发声；`ck` 借字母 c 的 /k/。
  没在白名单里的多字母块 `phBlockAudio()` 返回空 → **宁可不响，也不放错音**。
- `phBlendable(seg)`：每个块都得有正确读音，否则该词退回「听词选图」。
  所以 sh/ch/th/ai-ay/oa/a_e/i_e/o_e 这些族只有听词选图，不硬拼。
- 干扰块按**单词里出现过的字母**排除（clock 的 c、k 不能当干扰项），
  正常拼写不会被判错。
- 判卷比的是「拼出来的字母串 === 单词」，不是「和我切得一样不一样」。
- **不再自动连播逐音**：数字母音本身是 "kuh /æ/ tuh"，连起来像怪腔怪调。
  点一个块响一个块（孩子主动点），整词发音是唯一标准音。

### 验证
- `check_facts.py` 新增硬断言：每个 `segs` 的 `join('') === 词`；
  `phBlendable` 为真的词，每一块都必须有音频；sh/ch/th/ai/ay/oa/ck 这 7 个块
  不许出现在 `PH_BLOCK_SRC` 里。
- 真机路径：正确拼 → 判定过；用干扰块拼 → 判错并可「⌫ 退一格」；
  听词选图 4 选 1；干扰图按渲染图去重。

## 2026-11-08.7 导航重排 + 真「字母音」（别改回去）

**导航**
- 手机底栏 6 格：「字母」→「语法（句子工厂）」。理由：字母岛是起步期的短周期内容，
  学完就过去了；语法要反复练，必须随手可进。字母岛入口一直在首页岛屿卡片里
  （未学完字母时排到第 2 位，学完后自动退到最后）。
- 桌面导航同样去掉「字母岛」。
- ⚠️ 底栏只有 6 格，加第 7 个会挤成小图标；再加内容请先想清楚换掉谁。

**句子工厂去年级**
- 关卡卡片原来印着「🎓 一年级 / 二年级 / 三年级+」，阶段名也叫「第一阶段（一年级）」。
  用户指出会让别的年级孩子觉得「这不是我的」而不学。
- 现在只按难度分组：**句子公式 / 用单词造句 / 进阶句型**，卡片上不再有年级。
- ⚠️ 别再按年级标注语法关卡 —— 语法不按年级走。

**字母音（本次的技术重点）**
- 原来「📢 字母音」播的是**代表词**（apple / ball），孩子听到 /æpl/，不是 /æ/。
  自然拼读要教的就是 letter sound 本身，播代表词等于没教。
- 新增 `audio/phonics/a–z.mp3`（26 个，61KB），同引擎同声线单独合成。
- **piper 的 CLI 无法直接喂 IPA 音素**：`[[æ]]` 会被 espeak 当普通字符念成字母名
  「A E」（`--debug` 可见 `Phonemizing text: [[æ]] → ˌeɪˈiː`）；`[[a]]` 侥幸出 ɐ，
  其余 20 多个全失败。**不要再试音素直输这条路。**
- 采用的法子：**用能稳定触发目标音素的短词做载体，再裁掉多余的辅音**，
  每一步都能自证：
    `buh → bˈʌ`（辅音+ʌ，phonics 教学的标准近似读法）
    `at → at`（a 即 /æ/，裁掉词尾 /t/；实测平均过零率 0.076 → 纯浊元音）
    `et/ot/it → ˈɛt/ˈɒt/ɪt`，`uh → ˈʌ`（本身就是单个音素）
    `ox → ˈɒks`（裁掉词首元音得 /ks/；平均过零率 0.663 → 纯清擦音）
- 裁剪不能按「能量下降」切：`ox` 的元音和 /s/ 之间隔着 /k/ 的闭合静音（实测 200–410ms），
  按能量切会把静音带进来，得到 0.58s 的假 /ks/。**要按过零率突增定位清辅音起点。**
- 生成脚本 `_tts/build_phonics.py`；`summary.json` 里有每个字母的载体、音素序列、时长、
  峰值、有声比例，可复核。
- 前端：`PHONICS_VER` / `phonicsURL()` / `playAudioChain()` / `playPhonics()`。
  「完整口诀」= 字母名 → 字母音 → 例词（三段文件顺序播，token 作废旧链）。
  进入字母岛后空闲时预取全部 26 个（61KB，比一张图小）。
- 顺带修正中文提示：`/æ/ 啊` → `/æ/ 大嘴"哎"`（/æ/ 不是"啊"）、
  `/v/ 呜` → `/v/ 夫（咬下唇、出声）`（"呜"是元音）、C 与 K 统一写"克"。

## 2026-11-08.6 教学内容大校对（别改回去）

**背景**：用户指出「一眼就能看出 bug，那知识性错误岂不是误导小朋友」。
之前的检查几乎都是机器可验证项（文件、版本、报错、音频是否存在），
知识正确性没逐条读过。这一轮把教学内容导出成可读文本，逐条读 + 机器对账。

1. **词性**：主题只能给一个默认词性，但同主题内词性并不统一。实测 82 个词错：
   classroom 整主题 pos='v'（word/sentence/question 全成动词）、sport 全标 n
   （skate/ride/throw/catch 是动词）、shop2 全标 n（buy/sell/pay 是动词）、
   health 的 healthy/sick/ill/safe 标 n、feeling 的 feel/smile 标 adj、
   self 的 am/is/are 标 pron、prep1 的 and/or/but/so/because/if 标 prep、
   question2 的 everyone/anyone 标 qw、country 的 foreign/abroad 标 n…
   → `W()` 增加第 5 个参数 pos（逐词覆盖），主题默认只作兜底。
2. **音标** 35 处：重音错位（giraffe /dʒˈəræf/、koala /kˈoʊɑlə/、garage、direction、
   correct、arrive、around、kangaroo）、双主重音（thirteen/fourteen/seventeen/nineteen/
   baseball/TV/outside）、-ɪ- 弱化成 -ə-（biscuit/ticket/jacket/rabbit/practice/
   dentist/artist/excited/medicine/vitamin/penguin）、拼写错（toothbrush 的 brush、
   usually 多了 w、beyond 少 j、reusable 少 j、however 重音错）。
3. **自动出题的语法错误**：
   - 不可数词进了 a/an 与复数模板 → `UNCOUNTABLE` 补 chicken（本站义为"鸡肉"）、
     breakfast、lunch、dinner。
   - 中文量词按主题给（food='份'、fruit='个'），出现"一个飞机""一个自行车"
     "两个奶牛""两个鸡肉""两个早餐"。→ `MW_BY_WORD` 按词精确（架/艘/辆/本/支/
     朵/棵/头/匹/颗/件/条/顶/片/块），主题只作兜底；`havePlural` 的"两个"也改成
     读量词（原来硬编码）。
   - 否定句中文是病句「她不有饺子」「它不有书包」「她不看见熊」→ 新增
     `GX_VOBJ_NEG`（没有/看不见/不想要/不吃）。
   - 否定句中文末尾带问号（「她不累？」）→ 问号只在疑问句。
   - can 疑问句中文主谓不一致（Can you speak? 配「我会说话吗？」）→ 主语跟
     `GX_Q_SUBJ` 走。
   - 「小猫正在飞」→ `ING_VERBS` 去掉 fly（自动题主语固定是猫）。
   - 「秋千在床上」「自行车在椅子上」→ whereIs 里玩具只配 floor。
   - 家庭关出 "This is a mom." → thisIs 排除 family 主题。
4. **单词页跟读句**（words.html）原来是三个死模板
   `I see a ${w}` / `This is ${w}` / `I like ${w}`，按词长取模选，会让孩子跟读
   "I see a apple." / "This is cat."。改为按语法属性生成：`takesArticle` 才加
   a/an（`artOf` 按读音）、`pluralSafe` 才用复数、形容词动词不进来、
   本身是复数形的词条（children/people）不再加 s。words.html 因此要加载
   `js/grammar-engine.js`（已在 SW CORE 里）。
5. **PEP 知识点** 273 卡：中英例句齐全、问号句号一致、无英文残留；
   修掉一处笔误（"foxes fox" → "fox→foxes"）。
6. **称呼语不加冠词**：sir/miss/mr/mrs/ms/madam 进 `NO_ARTICLE`，
   否则会生成 "I see a sir."。

⚠️ **教训**：机器只能证明"文件在、能跑、对得上"，证明不了"教得对"。
以后改词库/出题模板/课程文案，必须把内容导出成可读文本抽读，
并对同一句做"英文语法 + 中文表达 + 中英对应"三向检查。

## 2026-11-08.5 去掉「念口诀」按钮（别再加回来）

- 2026-11-08.4 曾给句子工厂的「🔊 念口诀」加系统中文语音（`speakZh()`）。
  **用户设备实测没有中文语音**，降级后仍然只念出 am / are / is 几个英文词，
  既不像口诀又碍眼 —— 功能没有价值。
- 按要求**直接删按钮 + 删掉整套 `speakZh()`**（含 voice 预取、emoji 清洗）。
  口诀只剩文字：「🎵 本关口诀（跟着屏幕读两遍）」，由孩子自己读。
- ⚠️ **不要重新加「让中文发声」的能力**：站内音频只有英文声线，
  设备中文语音不可控（有的设备干脆没有）。再遇到「中文想读出来」的需求，
  先跟用户确认，不要自己补一套语音方案 —— 已经被否过一次。
- 顺手修掉「使用条款」重复编号（原来两个 `6.`，现为 6 / 7）。

## 2026-11-08.2 发音重做与合规收口（v8，别改回去）

1. **单词音频全量换成本站自合成**：2450 个（单词 2094 / 拼读块 73 / 字母名 40 / 例句拆词 231 /
   历史残留 12）用 `en_US-ljspeech-medium` 一次生成，与 497 句整句同一个说话人。
   原来那 2244 个是早期从公开词典接口批量抓的真人录音：条款不允许批量抓取与再分发，
   而且混了多批次转码（Lavf56/58/59）、男女混搭、音量不齐。
   实测体积 29.7MB → 10.6MB（中位 4.3KB/0.88s），点读出声更快。
2. **切断第三方发音接口**：删掉 `DICT_AUDIO_URL`、`__audioSources` 的外网分支、
   sw.js 里 `dict.youdao.com` 的 opaque 转发/缓存分支。现在全站零外网请求。
   包内没有的内容走 `__ttsFallback()`（speechSynthesis，本机发声），
   **只在单独朗读时启用**：句子接龙里绝不插机器音（否则一句话前后两种音色）。
3. **缓存链**：`AUDIO_VER` 1→2、`AUDIO_CACHE` v2→v3、`CACHE` v127→v128。
   activate 里新增「删掉所有非当前 birdie-audio-*」——只换名字不删旧的，会让老设备
   白留一整代 20~30MB。
4. **句子朗读简化**：sentence.js 去掉两词一组（`__CHUNK_MAX` / `__brokenChunks` 一并删），
   整句命中就一次播完，否则逐词接龙；`prewarmSentence` 改成预热单词。
5. **许可与披露**：新增 `LICENSE`（代码 MIT）+ `THIRD-PARTY-NOTICES.txt`
   （Twemoji CC-BY 4.0 署名、CMUdict BSD 许可全文、Piper MIT 全文、eSpeak NG 说明、
   教材名称非官方声明）；disclaimer.html 重写语音来源段并补「与出版社无关联」；
   parents.html / README.txt 同步真实数量。
6. **og-cover.png 重绘**：旧图内文字写「12 本点读绘本」，真实是 14 本（6 册 Get Smart + 8 册人教）、
   7 个游戏。文本校验扫不到图内文字，所以旧版一直没被发现；现在图与文案同一套事实。
7. ⚠️ **踩坑：解析 `en:` 字段必须过滤中文**。数据里有 `broken: 'break（打破）的过去分词…'`，
   字符串里恰好含 `en: `，naive 按 `"en: "` 切分会把整段中文当成例句，切出 slug `break_a`，
   合成出 9 秒中文音频。旧管线靠 CJK 过滤挡住了，重做时必须同样挡。

## 2026-11-01 修了什么（别改回去）

1. **Get Smart 644 个词的离线音频白放了**：audio/ 里明明有对应 mp3，但 `__LOCAL_AUDIO`
   只登记了 1000 词词库 + 造词实验室，课程词全部回退有道 → 在线绕外网、**断网没声音**。
   修法：`__registerGSAudio()` 惰性补登记（见上面的「已知约定」）。
2. **复习课认义题把答案印在题干上**：61 节复习课的认义题约六成是「题干英文 + 选项里有同一个英文词」。
   修法：认义题改用中文释义选项（并去重），中文干扰项不足 3 个就退回听音题。
3. **句型填空选项重复**：句子里的重复词（the / are / they / she，42 句）会让干扰项出现两个相同选项
   → 一题两个正确答案。修法：干扰项去重；顺带不再挖空 the / is / are 这类功能词。
4. **跟读在离线时整块崩掉**：`speech.js` 没进 SW 预缓存，`words.html` 又直接调用
   `speechRecognitionAvailable()` → 脚本没加载就 ReferenceError，连「点音节跟读」的降级都走不到。
   修法：补进 CORE + 调用前 `typeof` 守卫。
5. 404.html 的 `style.css?v=43` 对齐成 v45（其他页都是 v45）。
6. Get Smart 答对提示里的 `?` 换成 `✅`（原来是个被吞掉的 emoji）。

## 已知限制（不是 bug，但要知道）

- ~~Get Smart 的 227 个句子没有离线音频~~ **已解决（2026-11-08）**：全站 497 句固定例句
  都有整句 mp3（audio/sentences/），单一说话人，断网可读。
- 程序临时生成的句子（句子工厂随机造句）没有整句音频，按**逐词**用站内单词音频接龙：
  每个词都有文件，不会失败；听感是「一个一个词念」，这是刻意取舍（比原来两词一组
  失败 12% 稳）。不要为了「顺一点」再塞外网合成。
- `robots.txt` / `sitemap.xml` 放在项目站点根目录下，搜索引擎只读**域名根**的 robots.txt，
  所以这个 robots.txt 实际不生效；sitemap 需要去 Google Search Console 手动提交。
  GitHub Pages 项目站点没法把文件放到域名根，这一条**修不了**，不是待办。

## 2026-11-01 首屏提速（用户反馈「加载太慢，太久加载不完」）

实测首页要传 440KB（gzip），其中 **`svg/emoji-svg.js` 一家 290KB，占 66%**，
而且它排在 `app.js` 前面 —— 全屏加载层必须等它下完才消失。手机上就是一直转圈。

1. **图库改 async**：`<script async src="svg/emoji-svg.js?v=4">`，不再挡解析。
   页面先用系统 emoji 字形顶上（现代手机本来就是彩色），图库到了由
   `window.__emojiSvgReady()` 把图标就地换成矢量图（不嵌套 span）。
   关键路径从 440KB 降到约 156KB。
   ⚠️ 图库现在挂 `window.WORD_EMOJI`，**不再是 `const`** —— 读它必须写
   `window.WORD_EMOJI`，用 `typeof WORD_EMOJI` 会在 TDZ 里抛错。
2. **Get Smart 不再预热整册音频**：原来一进页面就把整册 134~263 个 mp3
   （1.6~3MB）按 180ms 一个往网络上灌，持续 30~47 秒，手机带宽被占满。
   改成只预热「下一课」前 8 个词，等 `requestIdleCallback` 空闲再开始。
3. **加载层 6 秒兜底**：纯 CSS `#bootLoader { animation: bootAutoHide 0s linear 6s forwards }`，
   万一脚本报错也不会永久转圈。

## 2026-11-02 第八批：桌面端「选择年级 / 选择主题」被胶囊盖住

用户截图（电脑宽屏）：单词镇的两个小标题只露出左边一截，被下面那行胶囊按钮压住了。

根因：`css/style.css` 的 `.tab-label { margin: 0 2px -12px; }` —— **负的下边距**
把下面那行 `.theme-tabs` 拉上来 12px，正好压住标题自己。
手机端媒体查询里写了 `.tab-label { margin-bottom: 10px }` 覆盖掉了，所以只有宽屏中招。

修法：`margin: 0 2px 8px;`，间距交给 `.theme-tabs` 自己的 margin 管，不再用负值。
（全表扫过一遍，CSS 里另一处负 margin 是 `.sr-only` 的标准做法，无此问题。）

验证：1280×900 与 390×844 两档截图对比，标题与胶囊行彻底分开、间距正常。

## 2026-11-01 第七批：新版本浮条（治「改了他说还是老样子」）

这是本项目**第三次**栽在同一个坑上：PWA 一旦打开就一直留着，Service Worker 又缓存着
HTML/JS，用户在旧页面里怎么点都看不到新代码，于是「都改了吗？还是老样子」。

`js/app.js` 新增 `__checkUpdate()`：
- 每 5 分钟 + 每次切回前台，拉 `version.json?t=<时间戳>`（唯一串绕过 SW 缓存）
- 和当前 `BUILD` 不一致 → 底部浮一条橙色「🔄 有新版本（xxx），点这里刷新」
- 点它：`registration.update()` + reload

配套：
- 新增 `version.json`（`build` 字段）。**发版必须同时改它和 `js/app.js` 的 `BUILD`**，
  只改一个不会提示 / 会误报。
- `sw.js` 里把 `version.json` 排除出缓存（永远走网络）—— 它被缓存住就等于永远说"你最新"。

## 2026-11-01 第六批：给「句子念一半」装上黑匣子

第五批上线后用户复测仍然停在 pencil。开发机（桌面 Chrome，限速 120KB/s + 400ms）
复现不出来：真实点击 + 严格自动播放策略下整句都能念完，所以只能让真机自己说话。

1. **家长中心底部新增「版本与朗读诊断」**（`parents.html`）：
   - 显示 `BUILD`（`js/app.js` 顶部的 `2026-11-01.x`）+ 实际加载的 `app.js?v=N`
     —— 用户说"还是不行"时，第一件事就是确认他手上是哪一版（版本混用已经踩过两次）
   - 下面是最近 40 条朗读事件：`play / end / fail / 看门狗`，带第几个音源、共用还是新建元素
   - 「📋 复制诊断」一键复制，`localStorage.birdie_audit_v1` 存最近 80 条
2. **`__speakFrom` 全段 try/catch**：任何异常都只跳过当前段，绝不把整句卡死在半路
3. 顺带：家长中心的 🔧 是新加的 emoji，重新生成图库时发现
   **生成器会把「非课程页也用到」的新 emoji 全塞进扩展库** → 那些页面没加载扩展库就没图。
   改成：只有「仅出现在课程数据/课程页」的进扩展库，其余进基础库。基础库 617 → 626。

## 2026-11-01 第五批：句子「念完 pencil 就停」的真正原因

第四批（清坏缓存）上线后，用户复测：**还是同一个位置停** —— 说明不是缓存毒化，
是「点击之后第 3 段开始全部无声」。这次定位到的是移动端自动播放策略。

### 根因：自动播放许可是「按 `<audio>` 元素」发的

`__playMediaElement` 原来每播一段就 `new Audio(src)` 造一个新元素。桌面浏览器有
**5 秒粘性用户激活**，所以点完「再听一遍」的头两三段能放；慢网络上第 3 段往往已经
超过 5 秒，`play()` 直接抛 `NotAllowedError` → 走 `fail()` → 重试还是新元素还是被拒 →
降级成逐词也还是新元素还是被拒 → **整条链走完，但一段声音都没有**。
症状就是「念完 Is this a pencil 就停」，而且每次停在同一句的同一处。

修法：整句共用一个**全局** `<audio>`（`js/sentence.js` 的 `__voice()`），只换 `src`。
已经播过的元素换源不会再被拦。单词点读仍然一次一个元素（那是点击本身在手势里，不受影响）。

### 顺带补的第二个洞：`onplaying` 之后没有兜底

原来 `onplaying` 一到就把超时 `clearG()` 全拆了。要是媒体元素 fire 了 `playing` 之后
再也不 fire `ended` / `error`（坏流、opaque 缓存里的错误响应都可能这样），链条就**永久**
停在那一段。现在改成挂看门狗：
- 播到过有声（`currentTime > 0.15`）→ 按真实时长 `duration + 1.5s` 到点当作读完，链条继续
- 一秒都没出声 → 判定坏流，走 `fail()`（清缓存 + 换 URL 重试 + 降级逐词）

### 验证（假元素 + 真页面上下文）

| 场景 | 结果 |
|---|---|
| 正常整句 7 词 | 全程只用 **1 个** 元素（id 都是 1），4 段依次换 src |
| 第 3 段 500 | 同一元素继续：`Yes it → Yes it&_r=… → audio/yes.mp3 → audio/it.mp3 → audio/is.mp3`，读完 |
| 每段都不 fire ended | 看门狗 3.5s/段推进，14 秒读完，不卡死 |
| 单词点读 | 仍然每次新建元素（`[1]`），不受句子共用影响 |
| 7 个页面冒烟 | 0 异常、0 残留字体 emoji |

版本：`app.js` v59、`sentence.js` v45。

## 2026-11-01 第四批：句子「读不全」（用户截图反馈句型闯关）

用户报「读的不全」，截图是 Get Smart 句型闯关的一句 `Is this a pencil? Yes, it is.`。
用真实 `js/sentence.js` + 真实网络跑了一遍，链路上**没有写错逻辑**——7 个词每个都被念到。
真正的问题是音频本身，两条：

### 1. 一次偶发 500 会把这个词永久钉死在这台设备上（主因）

有道的响应不带 CORS 头，落到页面上是 **opaque 响应**：`status` 恒为 0、`ok` 恒为 false，
SW 那边**分不清「200 的音频」和「500 的错误 JSON」**，只能原样缓存
（sw.js 的判断是 `res.ok || res.type === 'opaque'`）。
于是一个词只要失败过一次，缓存里就永远躺着那条错误响应 → 以后每次播都拿它 →
**这个设备上这个词再也不出声**。句子是两词一组，坏掉哪一组、或者组内降级后坏掉哪个词，
听起来就是「这句话没读全」。换台电脑/无痕窗口又是好的，所以极难复现。

修法（js/app.js）：
- 新增 `__purgeAudioCache(url)`：播放最终失败时，直接把这个 URL 从**所有** CacheStorage
  里删掉（页面和 SW 共用同一个存储，不需要知道 CACHE 叫什么，也不用走消息通道）。
- 重试必须换 URL：`__audioSources(text, bust)` 在重试时加 `&_r=<时间戳>`，
  否则「重试」拿到的还是缓存里那份坏响应，等于把同一个错误再听一遍。
- `CACHE` 升到 v101：老用户缓存里的历史毒条目一次性清空（代价是 youdao 音频缓存重下一次）。

### 2. 两词一组的成功率已经掉到 57%，中途撞 500 就是「卡一下」

2026-10-25 的记录是「2 词 88% 成功」，**2026-11-01 实测 40 个真实词组样本只有 23 个成功
（17 个 500）**；整句一次合成的成功率更低，29 个样本只有 1 个成功。
失败要在播放中途白等一次往返才降级成逐词，听感就是断断续续。

修法：`renderSentences()` 渲染时就 `prewarmSentence(s.en)` 把整句的词组先探一遍
——ⓘ 这个函数在 sentence.js 里定义了、注释也写了「翻页时预热」，**但全站从来没有调用过**，
是死代码。接上之后：坏词组在播放前就被标记，点「再听一遍」直接走单词，中间不再有空档。

### 3. 顺带修：点句子卡片会把中文那一行吞掉

`<div id="sentBox" onclick="speakSentence(text,this)">` 里 `this` 是整张卡，
而 `speakSentence` 会 `el.innerHTML = ...` 把内容换成单词 span —— 中文释义和样式一起没了。
改成传 `this.querySelector('.se')`，只把英文那一行拆成单词。
（实测：点完之后 `.sz` 仍在，`.se` 里 3 个 `.w`。）

### 验证

- 真实网络 + 真实 sentence.js 跑 `Is this a pencil? Yes, it is.`：请求序列
  `Is this(200) → a pencil(200) → Yes it(500) → Yes(200) → it(200) → is(200)`，7 词全覆盖
- 单词失败率 0/39（所以降级路径是可靠的）；两词词组失败率 17/40；整句 28/29 失败
- `__purgeAudioCache` 用源码原文跑单测：两个缓存都删、本地 mp3 不误删
- 重试 URL：`...&audio=cat` → `...&audio=cat&_r=12345`（普通播放不带）
- 预热生效：预热阶段标掉 `Yes it` 后，播放序列里不再出现它
- 7 页真实浏览器冒烟：0 异常、0 残留字体 emoji、getsmart 812 keys / 其余 617

## 2026-11-01 第三批：补齐课程 emoji + 老内核兜底

### 1. 课程 emoji 补齐（原「待定」项，已做）

**问题**：Get Smart 数据里有 **195 个 emoji 不在内置图库**（🐓🦅🦖🟡🩷🪑🧹🪳…），
老 Windows / 精简系统上是黑白或空白方块。全站 1102 个带图课程词里，
这 195 个是唯一还依赖系统字体的那一批。

**为什么之前没做**：怕给首屏加 130KB。现在图库本来就是 async 的，
「首屏」不受影响，只剩带宽竞争问题 —— 所以拆成两个文件：

- `svg/emoji-svg.js` v4 —— 基础库 617 条，**每个页面都加载**（gzip 290KB，和以前一样）
- `svg/emoji-svg2.js` v1 —— 课程扩展 195 条，**只有 getsmart.html 加载**（gzip 119KB）

两个文件都写成 `Object.assign(window.WORD_EMOJI || {}, {...})` —— async 脚本到达
顺序不确定，**谁后到谁合并**；直接赋值会让先到的被覆盖（这是唯一的技术坑）。
验证：getsmart 页面 `Object.keys(WORD_EMOJI).length === 812`，其余页面 617。

剩下 13 个符号（→ ← ★ ✗ ✓ ↑ ♪ ♫ ⇄ ↻ ❙ ✕）Twemoji 15 没有彩色版，
它们本来就是黑白符号字符，不算缺陷。

### 2. 老内核兜底：去掉 flatMap

`GRADES.flatMap()`（js/data.js 的 THEMES）+ games.html 翻翻乐 + getsmart.html 干扰项，
三处都改成 `reduce`/`forEach`。原因是 **flatMap 要 Chromium 69 / Safari 12**，
比本项目其余语法要求（对象展开 + async/await，Chromium 60 / Safari 11.1）**高出一档**。
落后一档的老平板会在 `const THEMES = ...` 这里抛 TypeError —— 而 THEMES 一挂，
data.js 后面所有声明（POS_INFO / LETTERS / 19 个语法关）全部不执行，整站数据层报废。
这是预防性修复，没有线上投诉对应。

静态审计结论（扫全部线上 js/html）：
- ✅ 没有 `\p{...}`（ES2018 属性转义，微信 X5 解析阶段抛错）、没有 lookbehind、
  没有 `?.` / `??` / `??=`、没有 `replaceAll` / `.at()` / `replaceChildren` / `globalThis`
- ✅ `requestIdleCallback` 有 typeof 守卫；`scrollIntoView` 有存在性判断 + try/catch
- ⚠️ 仍未实测：iOS Safari、微信内置浏览器、老 Android、真机音频听感

### 3. svg/ 里的 19 个绘图文稿已移出仓库

batch2-11.js / colors.js / memo_1-5.js / merge.js（228KB）没有任何页面引用，
且 `_audit/build_svg.py` 重新生成 word-svg.js 时读的是 **`git show HEAD:svg/word-svg.js`**，
不是这些批次文件 —— 它们已经彻底不再是构建源。
已移到仓库外的 `_audit/svg_src/`（保留源文件），`svg/` 现在只有 3 个上线文件。

### 验证（这一轮）
- 8 个页面真实浏览器探针（Edge headless + virtual-time）：**0 JS 异常、0 残留字体 emoji、0 未替换字符**
- getsmart 全 176 个单元批量出题：1119 题，每题 4 个互不相同的选项、正确答案必在选项内：0 问题
- 翻翻乐强行开局 4 对牌：4 图 + 4 词，0 异常
- THEMES 61 主题 / 1000 词 / grade+gradeName 字段完好（reduce 改写未破坏数据）
- 课程 1102 个带图词：仅剩 `information ℹ️` 一个符号级字符没有彩色版（可接受）

## 2026-11-01 第二批：出题语义修复（把"能出题"变成"出的题是对的"）

上一批修的是"题面会不会泄题"，这一批把生成出来的**英文本身**拿去逐句验，
发现 6 类真错句（都是模板 + 词池没对齐导致的）：

1. **I eat milk. / I eat water.** —— 「我吃 X」的词池直接用整个 food 主题，
   而里面含 milk/water/juice/tea。修：食物池排掉饮品，饮品走「我喝 X」。
2. **Whose book is this?（没有空格）** —— 句型题应该挖空，原来句子是完整的，
   答案单词直接印在题干里，孩子照抄就能选。修：改成 `Whose __ is this?`。
3. **I don't like sweater.** —— like 后面光秃秃放可数名词单数。修：可数名词用复数。
4. **I can put. / He can't take. / Do you want to give?** —— 这些模板动词后面没有宾语，
   及物动词填进去就是半截话。修：加 `BARE_VERBS` 白名单（和 ING_FORM 一个口径）。
5. **This is a south. / an America. / a music. / I don't like Canadas.**
   —— 「可数」不等于「能加 a/an」，专有名词/方位/学科既不能加冠词也不能加 s。
   修：grammar-engine 新增 `NO_ARTICLE` 与 `takesArticle/canTakeArticle`，
   句子工厂（4 处）、句子火车员都改用它。
6. **This is a work. / a weather. / I like natures.** —— 词库里 pos='n' 但实际不可数的词
   （work/weather/traffic/space/health…）被当普通名词。修：补进 `UNCOUNTABLE`；
   people / police 补进 `PLURAL_ONLY`（"This is a people." 是错的）。

顺带：letters.html 的 `sayWord(this,'${w.w}')` 补上撇号转义（当前数据没有撇号词，
属潜在隐患，按项目铁律"任何可能含撇号的文本都不许裸拼进 onclick"先堵上）。

### 验证（这一轮全是真浏览器 + 沙箱批量出题）
- 单词镇四种题型 × 6000 题：0 问题
- 句子火车员三档 × 7200 题：0 问题（修前平均每 7200 题约 230 个错句）
- 句子工厂 19 关 × 6480 题：0 问题
- 造词实验室 312 条 × 9360 次选项生成：0 问题
- 字母岛 26 字母 × 40 轮 = 1040 次：0 问题
- 同步码往返（3524B 进度 → 1195 字符）：字段零丢失，导入可用，带换行也能解析，坏码会报错
- 8 个页面 + 7 个游戏的入口冒烟（含 19 个语法关卡、拼写/听写/跟读）：0 未捕获异常

## 2026-11-11.2 拼读闯关「点进去却是听词选图」跨局串画面

两个独立成因，本次只修第 2 个（真 bug），第 1 个是设计口径，待家长拍板：

1. **设计侧（未改）**：`gPhonics()` 用 `pick(usable)` 随机挑词族，`a_e / i_e / o_e` 三族没有 `segs`（三族不做拼词，硬拼会把 cake 读成 /kæke/），整族 `phBlendable()` 恒 false → 整局 6 题全走「听词选图」渲染分支。16 个可用词族里占 3 个，真浏览器 300 局实测首屏选图 17%～20%。另外 8 个词族可拼词不足 6 个，后半局也会用选图补齐。
2. **竞态（本次修复）**：`gPhonics()` 的 7 个 `setTimeout` 全是裸的，不走站内既有的 `Flow`。`renderHome()` 的 `Flow.reset()` 管不到它们：上一局答对后挂着的 `phShow()`（1400 / 2100ms）会在新一局打开后照常触发，把画面整个覆盖成上一局的下一题。真浏览器实证：旧局 `a_e` 选图答对 → 退出 → 新局 `short a` 首题本是拼词 → 1.8 秒后画面变成「第 2 / 6 词」选图题，标题栏还留着旧局的 `a_e`。

修法：`gPhonics()` 与 `phShow()` 入口补 `Flow.reset()`，7 个延时改 `Flow.after()`；图词翻翻乐 `gMemory()` 的 2 个同类裸 timer 一并收掉（最后一轮配对 500ms 后的 `endCard` 也会覆盖新局）。沿用 Flow 的既有铁律：幂等、可取消、不抢时间。

版本链：BUILD .1 → 2026-11-11.2，app v114 → v115，CACHE v168 → v169。音频零改动（AUDIO_VER 4 / SENTENCE_VER 2 / PHRASE_VER 2 / AUDIO_CACHE v5 不动）。

## 2026-11-11.3 拼读闯关首屏 100% 拼词 + 33 张可看懂的词图

家长拍板 ①A + ②A。**先纠正上一版的一处误报**：.2 里报的「3 组 / 18 个词渲染同图、去重静默失效」是探针口径错误 —— 它只取 `querySelector('svg')`的第一个 SVG，而 `1️⃣1️⃣` 会渲染成两张并排的键帽；按「整幅画」重扫，全库 938 个带图词里 **0 组**「画相同但 iconKey 不同」，`iconKey` 机制本来没坏。

真正的问题是**图没有教学信息量**：

- `one / Monday / January` 都是同一张 `1️⃣`，「星期一」画成一个「1」；
- `eleven` 是 `1️⃣1️⃣` 两张方块，孩子看到「1 1」，对不上「十一」；
- `China / Canada` 是两张蓝色区域指示符字母块，不是国旗。

全库扫描共 36 个数字键帽词 + 7 个国家词。`0–9` 十个数字词用 keycap 合适，保留；其余 **33 词**补自绘图：11–20 数字卡、7 张星期日历卡（第 N 天高亮）、9 张月份日历卡（第 N 月高亮）、7 面几何国旗卡。卡面只放数字 / 序号 / 几何图形，**不写英文**，避免看词选图泄答案（产品铁律 3）。生成脚本 `_audit/gen_card_svg.py`，产物 `svg/word-svg.js` 345 → 378 条。

图源优先级：`wordIcon` / `iconKey` 同时判断 `WORD_SVG_FIRST` 集合，两处口径必须一致，否则图与身份对不上。新增图两两不同，`iconKey` 天然互斥；`_audit/check_facts.py` 会核对集合与产物条目。

①A：`gPhonics()` 的 `usable` 池加 `p.ws.some(w => phBlendable(p.segs[w.w]))`过滤。`a_e / i_e / o_e` 三族无 `segs`（硬拼会把 cake 读成 /kæke/，教学上故意不做拼词），整族无可拼词，原来随机挑中就是整局 6 题全选图，300 局实测首屏选图 17%～20%。用「至少一个可拼词」而非硬编码三个族名，以后新增的全选图词族也进不来。三族的 18 个词在单词镇 / 听词选图里仍练得到。

版本链：BUILD .2 → 2026-11-11.3，app v115 → v116，word-svg v3 → v4，CACHE v169 → v170。音频零改动（AUDIO_VER 4 / SENTENCE_VER 2 / PHRASE_VER 2 / AUDIO_CACHE v5 不动）。

## 2026-11-11.5 位置题中文改说「人话」

家长反馈「游戏在地板上」这句不通顺、不像正常话。.4 只是把 game 等抽象/大型词
塞进黑名单，属于治标：`gxNouns(animal1 + toy)` 里还有自行车、踏板车、小船、
飞机、小汽车、母鸡、风筝，随机配 bed / sofa / floor 仍会生成「自行车在地板上」
「小船在地板上」「母鸡在沙发上」「风筝在床上」。本版改两处：

1. **词池改真白名单** `WHERE_OK`：只留家中真会摆在家具或地上的小宠物 +
   小玩具（16 个）。`WHERE_FURNITURE_OK` 子集才可上 bed / table / chair / sofa，
   其余（家禽、会飘的）只说「在地上」。交通工具（真车/玩具车有歧义）、
   户外设施、大型野生动物、离水动物、抽象名词整族不进这一关；
   它们在单词镇、听词选图里照常学得到，教学覆盖不减。
2. **中文自然化**：`PLACE_ZH` 把 on the floor 写成「在地上」而不是「在地板上」；
   题面从「"X在Y上" 哪个说法对？」改成「想说「X在Y上」，哪句英语对？」，
   答题解析同步。L11 静态题问法也同步；其它关既有的「哪个说法对？」问法未动。

三选一里两句错句是辨析用干扰项，按家长选 A 保持不动。

验证：导出 19 关全量题库逐条审阅，L11 中文题面里「在地板上」0 条、
不通顺名词 0 条；改动前基线负对照能抓到 42 条荒谬/生硬组合。
check_facts 新增白名单、自然中文与静态题问法断言；真浏览器探针全覆盖。

版本链：BUILD .4 → 2026-11-11.5，app v117 → v118，data v39 → v40，
CACHE v171 → v172。音频零改动（AUDIO_VER 4 / SENTENCE_VER 2 /
PHRASE_VER 2 / AUDIO_CACHE v5 不动）。

## 2026-11-11.8 · 重录 6 条整句，撤回「迁就音频」的妥协

`2026-11-11.7` 里有一批改动是「为了对上已有音频而妥协」：把英文改成音频里念的
那句，而不是把音频改成正确的句子。当时的依据是「本机没有 Piper 环境」——
**这个判断是错的**。`_tts/bin/piper` 与 `voices/en_US-libritts-high.onnx`
一直都在，只是查找时的目录深度不够，没找到。

本版把这 6 处改回正确英语，并用原声线重录（spk 381 / noise 0 / 整句参数
length_scale 1.1 / 64k / 22050 mono / 不裁首尾静音）：

| 旧（迁就音频） | 新（正确） | 原因 |
|---|---|---|
| A month is about one trip of the moon. | A month is about one cycle of the moon. | trip 是「一趟旅行」；讲解写的是「月亮走一圈」 |
| Is that your mother? Yes, it is. | Is that your mother? Yes, she is. | 指人用 she |
| Is this your sister? Yes, it is. | Is this your sister? Yes, she is. | 同上 |
| Do you have any cereal? There isn't any juice. | Do you have any cereal? No, I don't. | 问麦片、答果汁，问答不搭 |
| Is she wearing glasses? Yes, she is.（借用） | She wears a watch on her wrist. | 饰品单元该讲手表戴在手腕 |
| Who's this? This is my grandma.（借用） | Who's that? It's my sister. | 原句问物答人，改问人答人 |

验证（均可复跑）：
- `_tts/smoke_tts.py`：用同一参数重造 3 条线上已有音频，解码后逐采样
  maxΔ = 0、corr = 1.000000 —— 证明现在的管道与当初烘出线上音频的管道一致。
- `_tts/verify_new_sent.py`：6 条「旧文本 → 旧文件」全部逐采样一致（maxΔ = 0），
  因此新音频必然念的是新文本；新文件规格 22050Hz / mono / 64kb/s、
  峰值 0.94–0.97 无削波。
- `_tts/audit_sentence_slugs.py` / `_tts/sync_sentence_list.py`：
  数据 ↔ 清单 ↔ 文件三方一致，502 条。
- `check_facts.py` 257 PASS / 0 FAIL（新增 20 项，含「旧 slug 已下线」「新 slug 有文件」）；
  9 套 Node 自测、20 个真浏览器探针全绿。

⚠️ 只升 `SENTENCE_VER`（2 → 3），**不动 `AUDIO_VER` / `AUDIO_CACHE`**：
这次只换了 6 个整句，若动 AUDIO_CACHE 会让老设备把 2874 个词音频
（约 30MB）全部重下，代价与收益不成比例。

版本链：BUILD .7 → 2026-11-11.8，app v120 → v121，getsmart-data v11 → v12，
pep-points v19 → v20，SENTENCE_VER 2 → 3，CACHE v174 → v175。

## 2026-11-11.9 · 通读 438 条整句后的修正

`.8` 只撤回了「因缺音频而妥协」的 6 处。这版把两个数据文件里的英文例句去重后
**全部 438 条逐条读了一遍**（导出工具 `_tts/dump_sentences.py`），又抓到 3 处：

1. **问人却答 it**：`Is this your father? Yes, it is.` → `Yes, he is.`
   同一条讲解里「这是你的妈妈吗」的答语也从 `Yes, it is.` 改成 `Yes, she is.`。
   上一版只修了 `Is that your mother` / `Is this your sister` 两条，漏了爸爸这条。
2. **指动物用 it**：`He has a long tail.` → `It has a long tail.`，中文「他」→「它」。
   这条讲解的主题正是「他她它用 has」，拿 it 举例才贴题；中文用「他」指动物也不自然。
3. **拼写内部矛盾**：`What color is it?` → `What colour is it?`。词库与 PEP 全用
   colour（2026-11-09.15 已把 colour/color 合并成一条），这里却用美式，孩子会当成两个词。

另修中文：`make the bed` 译作「铺床」而不是「整理床铺」。

⚠️ **剩下的是两套教材本身的美式/英式差异，不是错误**，本版未动，需要口径拍板：
`meter/metre`（Get Smart 用 meters、PEP 用 kilometres）、`math/maths`（5:3）、
`cookie/biscuit`（2:5）、`fall/autumn`（4:2）、`theater/theatre`（全美式）、
`trash`（全美式）。统一成哪一套都会牵动几十条句子与音频，属体系选择。

验证：`check_facts.py` 263 PASS / 0 FAIL（新增 6 项）；9 套 Node 自测；
20 个真浏览器探针全绿；三条新音频 1.56–2.47s、规格 22050Hz/mono/64kb/s。

版本链：BUILD .8 → 2026-11-11.9，app v121 → v122，getsmart-data v12 → v13，
pep-points v20 → v21，SENTENCE_VER 3 → 4，CACHE v175 → v176。

## 2026-11-11.10 · 按教材口径分治：PEP 英式、Get Smart 美式

家长指示：「要和教材同步。教材是英式就用英式，教材是美式就用美式。」
上一版（.9）我按「全站统一英式」处理，方向错了。

**先查证教材版本**（不猜）：
- `js/getsmart-data.js` 文件头写着 `教材：MM Publications《Get Smart》(New Get Smart, American Edition)`；
  官方目录也确认 Get Smart 是「two editions, AmE / BrE」双版本。
- 数据内部证据一致：`football` 释义「美式橄榄球」、`favorite×7`、`theater`、`trash`、
  `pants`、`Math`、`candy`、`fall`(秋天) 全是美式 → 用的是 **American Edition**。
- PEP（人教版）是英式：`colour / favourite / trousers / lift` 压倒性。

⚠️ **本文件早写过这件事**（`.15` 那段）：「`js/ipa.js` 里的 `color` 音标条目：
Get Smart 1 课文原句就是 `What color is it?`（美式教材）」「`audio/color.mp3` 仍在
audio-list 清单里（Get Smart 要用），不删」。**.9 把 `What color is it?` 改成
`colour` 是把教材原文改错了**，本版改回。

### Get Smart（AmE）清掉混入的英式
| 位置 | 旧 | 新 |
|---|---|---|
| 4 个单元标题 | `Colours` | `Colors` |
| 颜色问句 | `What colour is it? Blue.` | `What color is it? Blue.` |
| 零食单元 | `biscuits`（饼干） | `cookies` |
| 句子 | `They travelled by…` | `They traveled by…` |
| 邻居词条 | `neighbour` | `neighbor` |

### PEP（BrE）保持不变
`neighbour`（词库）、`colour`、`favourite`、`trousers`、`lift`、`metres` 全部正确，未动。
PEP 里那套记忆法字典是**全站共享**的（`take out the trash`、`theater`、`meters`、
`soccer` 这些 key 服务的是 Get Smart 的词条），所以**不能按 PEP 口径改成英式**，
否则 Get Smart 的词卡就查不到记忆法了。

### 音频
新录 4 个词音频（`cycle` / `neighbor` / `traveled` / `wrist`，都是句子里的词、
逐词接龙要用）与 2 条整句；下线 2 条旧句。发音清单 2874 → **2878**。
⚠️ 只升 `SENTENCE_VER` 与 audio-list 的 `?v=`，**不动 `AUDIO_VER` / `AUDIO_CACHE`**
（只新增文件，旧文件 URL 未变，老设备不必重下 30MB）。

### 顺带修正两个一直没更新的数字
- 披露文案的整句数还写着 **503**，但 `.8` 起实际就是 502 → 4 处文案 + 断言一起改。
- 单词音频 2874 → 2878、合计 2913 → 2917（= 2878 + 39 字母音）、总音频 3463。

验证：`check_facts.py` **275 PASS / 0 FAIL**（新增 12 项，含「Get Smart 数据头写明
American Edition」「Get Smart 用 Colors/color/cookies/traveled/neighbor」
「PEP 保留英式用词」「美式音频仍在」）；9 套 Node 自测；20 个真浏览器探针全绿。

版本链：BUILD .9 → 2026-11-11.10，app v122 → v123，getsmart-data v13 → v14，
pep-points v21 → v22，audio-list v4 → v5，SENTENCE_VER 4 → 5，CACHE v176 → v177。
## 2026-11-11.11 · 全站质量审查：20 项问题一次收干净

家长转来一份外部审查报告（20 项：P0×5 / P1×8 / P2×7），审的是 2026-11-11.10。
逐条对照代码核实后：**12 项完全属实、5 项部分不准确、3 项是误报**（D3 games.js
实际无引用、F2 音标行用的是 --ink2 而非 #8B93A7、B4 是家长已拍板的美式音标口径）。
按家长指示「除 D3/F2/B4 外全部做」落地：

### A · 显示与排版
- **A1（P0）数字被撑成「1 7 1」**：根因是字体栈把三个 emoji 字体排在所有文字字体
  之前，安卓预装的 Noto Color Emoji 连**数字**也接管了（14px 下 "171" 量到 51px，
  正常字体 25px）。改用 @font-face + unicode-range 声明一个**只覆盖表情码位**的
  EmojiFallback 通道：表情仍走彩色字形（雅黑会画成黑白线条的问题保留原对策），
  数字 / 字母 / 汉字完全不经过它。
- **A2 家长中心标题竖排**：.card h2 是 flex 且不换行，长副标题把主标题压到最窄
  （390px 下「学习总览」变成四行）。加 flex-wrap，副标题独占一行。
- **A3 导航「Get Smart」折行**：导航项加 white-space: nowrap。
- **A4 底栏透出下层文字 + 没有家长中心入口**：底栏改不透明白；家长中心放进
  底栏「我的」弹窗里（第 6 格已满，不再挤掉现有项）。
- **F1 糖果色按钮白字对比度**：湖蓝 1.98 / 薄荷 2.01 / 橙 2.04 / 粉 2.15 /
  珊瑚 2.78 / 柠檬 1.38，全部低于 WCAG AA 的 4.5。按钮文字改深墨蓝（6.0~6.8），
  珊瑚 #FF8585、葡萄 #B79AFF 提亮以压住深字；字母 Hero、句子车厢同步。
- **F3 彩带盖住解析文字**：z-index 98 → 40（toast 之下），单颗 0.9~1.8 秒 →
  0.5~0.8 秒并淡出，数量 28 → 18。

### B · 内容与教学
- **B1（P0）her / miss / she 没有头发**：三条路径里有生成器残渣 `*`（如
  `q0 -9 * 1.1`），浏览器报 Expected number 整条丢弃。按头部圆心/半径重算两段
  头发（后脑圆 + 额前刘海），并给门禁加「d 属性不得含 *」。
- **B2 拆块粒度混乱**：根因是 PEP_DIGRAPHS 把 nd/nt/st/mp/pp/tr/str 这类**辅音
  连缀**当成字母组合。拆成两套各管各的：
  · 拼读（🔤 行、拼读地图、拼词块）**按音**：只留真 phonogram，辅音连缀全拆
    （apple → a·p·p·l·e，每个字母一个音）。
  · 拆词（拼写工坊第 3 步、跟读音节）**按音节**：新增 splitSyllables()，最大音节
    首原则 + 复合词先行 + -tion/-le 特例（apple → ap·ple、umbrella → um·brel·la、
    elephant → e·le·phant、banana → ba·na·na、goodbye → good·bye）。
  1648 个词全量跑过：拼接 100% 等于原词、无「无元音块」（除 Mr/Mrs. 缩写）。
- **B3（P1）语法 19 关止于现在进行时**：补 4 关，对齐人教六下四个单元 ——
  L20 一般过去时（was/were + -ed）、L21 Where did you go?（did + 动词原形）、
  L22 比较级与最高级（-er/-est、双写、more/most）、L23 be going to。23 关。
- **B5 伪词源**：good/well「亲兄弟、元音降级」、night/knight「同根」都改成
  不断言词源的联想（good/well 的用法差异、knight 的 k 不发音）。
- **B6 口径**：「999 个必背词」→「999 条必背词条（含 13 条常用短语）」。

### C · 性能
- **C1（P0）慢网无限停在「正在打开」**：原来只在资源加载失败时给重试，脚本慢但
  没失败就一直等（冷缓存 3G 首屏要等约 1.6MB 同步脚本）。加 10 秒超时兜底，
  显示「网络有点慢」+ 重试按钮 —— 只给出路，不清占位，内容一到照常接管。
- **C2 871KB 表情库每页全量加载**：拆成 emoji-core.js（界面核心 80 条 / 87KB）+
  emoji-svg.js（词库全量 625 条 / 860KB）。首页/声明/404 只取核心库；要画词卡的
  7 个页面用 <body data-emoji="full"> 直接取全量，避免先下小的再下大的。
- **C3 各页数据未裁剪**：首页不画任何词图，去掉 246KB 的 svg/word-svg.js
  （typeof 保护下自动回退表情 SVG）。

### D · 结构与可发现性
- **D1 canonical / og:url 打架**：9 页只有 2 页有 canonical，首页 canonical 用
  /yingyu/ 而 og:url 用 /index.html。统一目录形式、补齐 7 页 canonical、
  getsmart 补 description 与 og:*、sitemap 去掉 404.html 与 /index.html 重复项。
- **D2 全站 JS 渲染，搜索引擎看不到内容**：words / grammar / pep 三页各加一段
  <noscript> 静态摘要（年级词量 + 前 12 个词、23 关标题与公式、8 册单元与词量），
  由 _audit/gen_static_digest.js 从数据现算，不手写数字。

### E · 状态逻辑
- **E1（P0）新用户一进门就「2/3 已完成」**：两处叠加 —— Store.load 把「0 个字母」
  当成字母任务已完成；首页把 gap=null / due=0 两个「空」都算成做完。现在
  「没数据 ≠ 做完了」：字母任务只在真在学字母（1~25 个）时计入分母，否则显示
  「➖ 字母·选学」；GS 卡片有 started 才计数，否则写「还没开始」。
- **E2 两套进度口径打架**：同屏两处「x/3」含义不同。GS 卡片标题写明是
  「Get Smart 三步（补课 / 复习 / 游戏）」，与下方「今日任务（字母 / 单词 / 游戏）」
  分层。

验证：check_facts **318 PASS / 0 FAIL**（新增 45 项，把 A1~E2 每条都钉成断言）；
9 套 Node 自测、20 个真浏览器探针全绿；390px 真机宽度渲染目视验收
（标题横排、数字无空隙、按钮深色字可读）；33 张小人插画里 her/miss/she 的
头发与 he/you/i 风格一致。

版本链：BUILD .10 → 2026-11-11.11，app v123 → v124，style v49 → v50，
data v42 → v43，pep-points v22 → v23，words-data v44 → v45，
getsmart-data v14 → v15，word-svg v4 → v5，emoji-svg v5 → v6，
新增 emoji-core v1，CACHE v177 → v178。音频零改动。

## 2026-11-11.12 · F2 收尾：次级文字对比度与音标字号

外部审查 **F2** 原文：「次级文字 `#8B93A7` 在白色上只有 3.07:1，用在词卡的音标行、
年级、说明文字；音标 11px + 3.07:1 是双重不利；修法换 `#6B7280`（4.83:1），
音标字号提到 13px 以上。」

**逐条核实后的判定**（没有照单全收）：

| 子断言 | 代码实际 | 判定 |
|---|---|---|
| 词卡音标行用 `#8B93A7` | `.wl-card .ph` / `.word-card .ph` 都是 `#6B7280`，白卡上 4.83:1 已过 AA | **误报**，颜色不改 |
| 对比度 3.07:1 | 是拿错误色 `#8B93A7` 算出来的，音标行实际 4.83:1 | **误报**（同上） |
| 音标 11px | `.wl-card .ph` = `.72rem` = 11.5px、`.word-card .ph` = `.8rem` = 12.8px | **属实** |
| 年级 / 说明文字用 `#8B93A7` | 9 处（style.css 2 / words.html 6 / grammar.html 1），白底 3.07:1 | **属实** |

**修法按背景分档，不搞一刀切**：

- 8 处白 / 近白底（`#FFFFFF` / `#F1F3F7` / `#FBFCFE` / `#FFFDF7`）统一用系统色
  `var(--ink2)` = `#5C6273`，实测 5.48~6.09:1 全过 AA。比报告建议的 `#6B7280` 更稳：
  后者在 `#F1F3F7` 上只有 4.35:1，仍不达标。
- `.tab-label` 是唯一落在天空渐变上的（最深处 `#8ED8F8`），`#5C6273` 在那里只有
  3.86:1，单独给 `#3D4459`（6.14:1）；底栏 `.bnav` 已是不透明白，用 `--ink2` 即可。
- 两处音标字号 11.5px / 12.8px → `.85rem` = 13.6px，`.wl-card .ph` 补
  `line-height:1.25` 防长音标挤行。颜色 `#6B7280` 保持不动。

**顺带修掉的真错**：`VERSION.md` 版本表落后一轮（style 写 v49、word-svg 写 v4，
实际 v50 / v5），`check_facts` 的「版本表 = HTML 实际引用」逐行比对当时已 FAIL，
这次一并对齐，并补 3 条 F2 防回退断言。

**音标数据未动**：抽查 999 条，未发现 F2 相关错误。B4「美式无长音符」是家长
2026-11-09 拍板的口径，9 条次重音 `ˌ`（thirteen / nineteen / TV …）属同一套美式记法，
不在 F2 范围，本次不改，也不借机改教学口径。

版本链：BUILD .11 → 2026-11-11.12，style v50 → v51，CACHE v178 → v179。
其余 JS / 数据 / 音频零改动。

## 2026-11-12 · 全站收尾：独立扫描后的 5 类真 bug

这一轮不是接着外部审查清单往下做，而是重新独立扫了一遍：真浏览器逐页运行时、
资源死链、动态题全量抽样、19 个既有探针回归。**审查报告 20 项的结论不变**
（除 B4 美式音标是家长已拍板的口径、D3 的 `games.js` 全站零引用属误报），
以下都是扫描新发现或上一轮遗留的真问题。

### 1. 句子工厂会教「这是一个名字」，还把答案印在图上（最严重）

`GEN.thisIs` 是 20 个自动出题模板里**唯一**没过 `NOT_CONCRETE` + `isObj` 闸门的
（其余 seeBuild / thereBe / havePlural 等都过了）。线上 23 关批量抽 200 轮，
关 5「小小 a 和 an」与关 16「综合大闯关」真的抽到了：

| 题面 | 正确英文 |
|---|---|
| 「这是一个名字」`NAME` | This is a name. |
| 「这是一个班级」 | This is a class. |
| 「这是一个游戏」 | This is a game. |

`name` 的自绘图当时是一块写着 **NAME** 的牌子 —— 题干里直接出现了答案单词，
违反「题目页不得出现答案」。已给 `thisIs` 补齐两层闸门，三个词一起出池。

### 2. 3 张自绘插画写出本词完整英文拼写

扫 378 张 `WORD_SVG` 的 `<text>`，与 key 比对，命中 3 张：`name→NAME`、
`spell→S/P/E/L/L`、`thousand→1000 + thousand`。其余 76 张写的是数字、符号或
提示词（ABC / SLOW / z / $ / 月份数字），不泄露拼写，属数字卡与日历卡的既有设计，保留。

三张重画为：姓名牌（人像 + 横线，不写字）、拼写（5 个空彩色方格 + 铅笔）、
千（保留阿拉伯数字 `1000` + 小方块阵列）。`svg/word-svg.js` 头部写明是生成产物，
但原生成入口 `build_svg.py` 已不在仓库，因此用 `_audit/fix_leak_icons.py`
**幂等脚本**替换，并在 `check_facts` 钉死「全库不得写出本词拼写」，将来任何
生成器覆盖都会立刻 FAIL。

### 3. 中文量词有个隐性依赖

`measureOf` 原本只认 `themeWords()` 才附加的 `w._theme`。任何直接拿 `THEMES`
扁平词表调用的生成器都会丢主题，动物量词静默退化成「个」→「一个老鼠」。
改为一次性建 `词 → 主题` 索引，缺 `_theme` 时按词现查。线上现有 15 个自动出题关
都走 `themeWords`，所以**这次没有线上病句**，属于防未来回归的加固。

### 4. D3 残留：`/favicon.ico` 线上 404 + 两页漏图标

报告 D3 里 `js/games.js` 404 是误报（全站零引用，不会有真实请求）；但
`curl /favicon.ico` 确实 404 —— 浏览器与爬虫会自动请求根路径。补一个
32×32 32bpp BMP ICO（`_audit/make_favicon.py` 纯标准库生成，兼容老浏览器，
不是 PNG-in-ICO），并进 SW CORE。另发现 `getsmart.html` / `pep.html` 漏了
`apple-touch-icon`（其余 7 页都有），补齐。

### 5. 验收工具自己有 bug（会造成假 FAIL / 假警报）

- `_audit/probe_v3.py` 把 `SENTENCE_VER == 2` 写死，而实际早已升到 5，
  每次跑都报 `FAIL ⛔`，但页面一切正常。改为从 `js/app.js` 现读
  `AUDIO_VER` / `SENTENCE_VER` / `PHRASE_VER` / `PHONICS_VER`。
- 本轮新增 `_audit/scan_runtime.py`（逐页抓 console/资源失败）、
  `_audit/dump_dynamic_q.py`（6170 条动态题导出）、
  `_audit/check_dynamic_q.py`（病句体检）；体检判据里「词性题中文选项」
  与「一个书包 / 一个鸡蛋」两类误报已修（前者选项本就该是中文，后者是
  正则缺词边界）。

### 验收

| 项 | 结果 |
|---|---|
| 真浏览器 10 页运行时 | 0 console error / 0 资源加载失败 / 加载层全部正常撤掉 / 每页恰好 1 个 h1 |
| 动态题全量抽样 | 15 关 × 200 轮 + 20 kind × 200 轮 = 6170 条唯一题，生成器 0 异常 |
| 病句体检 | 答案可达性、a/an、主谓、非法复数、选项唯一性、模板残留 —— 结构性 0 硬伤 |
| 19 个既有真浏览器探针 | 全绿（修掉 probe_v3 的假 FAIL 后） |
| 事实门禁 | 见本次提交记录 |

版本链：`word-svg v5→v6`、`CACHE v179→v180`、`BUILD 2026-11-11.12→2026-11-12.1`。
**音频零改动**，`AUDIO_CACHE` / 四个音频版本号全部未动，老设备不会重下音频包。

**没有动的部分**：B4 美式音标无长音符与 9 条次重音 `ˌ` 是家长 2026-11-09
拍板的口径；B3 新补 4 关仍是静态题；自动出题关的 themes 白名单没扩，
探针用全量词池抽出的抽象名词题（「这是一个力量」等）**不是线上路径**，
不据此改教学口径，只作为未来扩池时的参考。

## 2026-11-12.2 · B4 音标课本写法对照 + D3 注释清理

外部审查 **B4**（P2）：「`js/ipa.js` 1000 条音标里长音符 `ː` 出现 0 次……家长对着
课本核对会以为音标打错了，孩子抄到作业本上也和老师的板书不一致。修法二选一：
① 全表补长音符，与教材统一；② 保留现写法，但在词卡上加一行『课本写法 /iː/』对照。」

**决定：走 ②，且只给符号对照，不生成逐词课本音标。**

- ① 会推翻家长 2026-11-09 拍板的「全站美式」口径，也会让站内音标与朗读的美音
  声线自相矛盾，不做。
- ② 若理解成「给每个词配一条课本音标」，等于凭空造第二份 1000 条音标表。
  本站美式表由 CMUdict 转写而来，**已经丢了重音层级**：`/i/` 在重读音节
  （she /ʃi/）课本写 `/iː/`，在词尾非重读音节（happy /ˈhæpi/）课本常仍写 `/i/`；
  `/ɑ/` 的英式对应依词不同（`ɑː` / `ɒ`），`/ɔr/` 又牵涉 r 是否省略。
  机械规则必然教错孩子 —— 这比不加对照更糟。机器能证明文件在、能跑、对得上，
  证明不了教得对（见 2026-11-11 教学内容正确性那课）。

**落地**：单词镇 3 处词卡音标行 + 卡片学 `cf-ipa` 加一个 `?` 小圆按钮
（纯 ASCII + CSS 画圈，不依赖 emoji 字体；`data-w` 属性寻址，单词不拼进 onclick，
`event.stopPropagation()` 防止点说明时触发整卡发音）。点开浮层显示当前词的美式音标、
5 组符号对照表、以及「本站不逐词提供课本音标，抄写作业请以老师板书和课本词表为准」。
家长中心补完整说明卡，免责声明补入口指引。**`js/ipa.js` 与 `PEP_IPA` 一个字符未动。**

**D3 残留一并清掉**：3 处正式页 HTML 注释写着本地 `_audit/...` 脚本路径
（index / words / games），另 1 处 games.html 还写着「China/Canada 都是蓝底 C 字母块」
—— 两国早在图库补齐时就是国旗自绘图了。零功能影响，随这次发版顺手带，
不单独为 4 行注释升一次 CACHE。

### C3 首屏数据：本轮不裁，附工程结论

报告 C3 建议「首页只导出年级→词数的统计」，核算后**不成立**。
先给可复算的基线：按两页 HTML 实际引用的 `script[src]` / `link[rel=stylesheet]`
逐个文件 gzip -9 实测（KB 按 1024 换算；不含 SW 后台补缓存的资源、
不含点击后才请求的音频；旧报告快照里的 1.7MB 是 raw 且已过期）：

| 页面 | 首屏资源 raw | gzip | 最大的几块（gzip） |
|---|---|---|---|
| `index.html` | 509.6 KB | **176.4 KB** | `app.js` 54.4 / `words-data.js` 40.6 / `getsmart-data.js` 34.0 / `data.js` 21.1 / `style.css` 16.3 / `audio-list.js` 10.2 |
| `words.html` | 937.7 KB | **292.7 KB** | `pep-points.js` 83.0 / `app.js` 54.4 / `words-data.js` 40.6 / `word-svg.js` 29.9 / `data.js` 21.1 / `style.css` 16.3 |

| 文件 | 首页真实依赖 | 能否用统计替代 |
|---|---|---|
| `js/words-data.js` raw 97.2KB / gzip 40.6KB | `cumGrades()` → `gradeWordCount()` / `cumMasteredCount()` 要**逐词**查 `Store.d.words[w.w].box` | 否，需要词条对象本身 |
| `js/getsmart-data.js` raw 128.3KB / gzip 34.0KB | `gsLevelProgress()` 与 `gsFlowState()` 要读每册每单元算「今天补哪一课」 | 否，需要课程表 |
| `js/app.js` raw 136.8KB / gzip 54.4KB | 9 个正式页共用，导航 / 档案 / 发音 / 进度全在里面 | 否 |

两档可选（都需单独立项，本轮不动）：
- **A 档（低风险）**：不动数据结构，只把首页 `sentence.js`（raw 8.6KB / gzip 3.9KB）摘掉。
  已逐页核过：9 个正式页都引它（404 不引），但 `index.html` 既不调用
  `speakSentence` 也不调用 `prewarmSentence`，`js/app.js` 同样没有调用点，
  确证首页可摘。收益 gzip 3.9KB，几乎无感，且会让 9 页脚本矩阵不一致，性价比一般。
- **B 档（架构级）**：把词库拆成「轻量索引（词 w + 年级 + 主题 id）」与「详情（中文/记忆法/图解）」，
  首页只载索引；或用构建脚本生成 `home-stats.js` 派生数据并用门禁钉住与真相源一致。
  理论上限是 `words-data.js` 40.6KB + `getsmart-data.js` 34.0KB = 74.6KB，
  扣掉要新增的索引/派生数据，净省估计 55~65KB；但要把进度计算改成异步 fetch，
  **会把 2026-11-07 白屏事故的风险重新引回来**，需先补首屏骨架与超时回归。
- 另注：`words.html` 最大的 `pep-points.js`（gzip 83.0KB）不是首页问题，
  若真要优化单词镇首屏，比动首页数据结构更值，但同样要单独立项验证依赖。

版本链：style v51→v52、CACHE v180→v181、BUILD 2026-11-12.1→.2。
音频四套版本号与 `AUDIO_CACHE` 全未动，老设备不重下音频包。

## 2026-11-12.3 · C3 首屏瘦身：课本数据按页拆开（别再合并回去）

**决定：不采纳上一节的 B 档（拆词库索引）。** 那条路净省 55~65KB，但要把
`cumGrades()` / `gsLevelProgress()` 改成异步 fetch，等于把 2026-11-07 白屏事故
的风险请回来。本轮改走零架构风险的一条：把「9 页复制粘贴出来的脚本矩阵」
按真实依赖拆开，收益更大、一个字符的数据结构和进度逻辑都没动。

### 账：`js/pep-points.js` gzip 83.0KB 里到底装了什么

| 段（拆分前行号） | gzip | 谁真的用 |
|---|---|---|
| `PEP_POINTS` 单元讲解 5-389 | 40.1 KB | **只有 pep.html**（`pepPointsOf`） |
| `PEP_MEM` 记忆法 667-1563 | 25.8 KB | getsmart / pep（`pepMemOf`） |
| `PEP_POS` + `PEP_IPA` | 8.2 KB | pep.html（`pepPosKey` / `pepIpaOf`） |
| 拼读 / 音节工具 390-666 + 查询函数 | **8.8 KB** | words / getsmart / pep 全站 |

`words.html` 只用 `phonicsLine` / `splitSyllables`（词卡那行「🔤 拼读拆分」和
跟读音节），却为 74KB 课本数据付了首屏。`getsmart.html` 只用 `pepMemOf` +
`phonicsLine`，不需要 40KB 的单元讲解。静态符号级依赖矩阵 +
逐页 `onclick` 全文核对过，`js/app.js` 里**没有任何** `PEP_*` 引用。

### 切法与接线

拆成三份纯静态脚本（生成脚本 `_audit/split_pep_20261112.py` 幂等可复算，
⚠ 读写一律 `newline=''`，否则 LF 变 CRLF 整文件 diff 上千行）：

| 页面 | 引用 | 首屏 gzip |
|---|---|---|
| `words.html` | `pep-points.js` | 8.8 KB |
| `getsmart.html` | `pep-mem.js` + `pep-points.js` | 42.4 KB |
| `pep.html` | `pep-lessons.js` + `pep-mem.js` + `pep-points.js` | 82.5 KB |

**跨 `<script>` 的顶层 `const` 共享同一个全局词法环境**：`pep-points.js` 里的
`pepMemOf` / `pepIpaOf` / `pepPosKey` 运行时能读到另两个文件的数据；
函数定义时不求值，所以 words 页单独加载它、缺那三块数据也不会报错。
数据先于工具加载是刻意选的顺序。所有脚本仍是**同步加载**，没有 async、
没有 fetch、没有首屏骨架，白屏风险不增。

⚠ 切分边界别按「大块行数」硬切：390-399 是「自然拼读拆块」的两段注释
（属工具，不属课本讲解），667 行是 `PEP_MEM` 的段头注释（属数据，不属工具）。
第一版按 5-399 / 400-667 切，把注释放错了文件，已按顶层定义行重新定位。

### 发版升级路径的坑

activate 会把旧 CACHE 的字节搬进新 CACHE，但**这两个文件是本次新增的，
上一代缓存里根本没有，搬不过来**。老用户升级后若立刻打开课本页，后台
补齐还没跑到，就会静默没讲解 / 没记忆法。已把 `todo.sort()` 加进 SW，
让 `pep-lessons.js` / `pep-mem.js` 排到后台补齐队列最前面先补；
BOOT 没动，激活不被拖慢，窄带仍整批跳过（那时页面自身的 fetch 会顺带入缓存）。

### 实测（按各页 HTML 实际 script/link 逐文件 gzip -9，KB 按 1024）

| 页面 | 拆分前 | 现在 | 变化 |
|---|---|---|---|
| `index.html` | 176.4 KB | 176.4 KB | 0（首页不引课本数据） |
| `words.html` | 292.7 KB | **220.5 KB** | **-72.2 KB / -24.7%** |
| `getsmart.html` | 430.1 KB | **391.4 KB** | **-38.7 KB / -9.0%** |
| `pep.html` | 412.1 KB | 413.5 KB | +1.4 KB（两个新文件头，基本持平） |

`sw.js CORE` 仍预缓存三份，离线可用性和总下载量不变；CORE 后台补齐有
1200ms 宽限期 + 低并发 + 窄带跳过，不与首屏抢连接。

### 验收

| 项 | 结果 |
|---|---|
| 事实门禁 | **348 PASS / 0 FAIL**；新增跨文件求值（`PEP_POINTS`/`PEP_MEM`/`PEP_IPA`/`phonicsLine`/`splitSyllables` 在拼接作用域里真实可调用）与按页引用断言 |
| 真浏览器 `probe_split_pep.py` | 16 项全绿：**Performance API 实证** words 没下载 lessons/mem、getsmart 只下载 mem、pep 三份齐全；三页拼读结果一致；**交互层劫持计数**证明 pep 点进单元时 `pepPointsOf` 真被调用且渲染 6 张知识点卡、Get Smart 走到词卡时 `pepMemOf` 真被调用并返回记忆法；零 console / 零资源失败 / 零溢出 |
| 全站 10 页运行时 | 0 console error / 0 资源失败 / 加载层全撤 / 每页 1 个 h1 |
| 390px 多状态溢出 | 16/16 PASS |
| B4 音标浮层 | 16/16 PASS（words.html 改过，复验） |
| 本地 IPA 自测 | `test_ipa_coverage.js` / `test_ipa_lookup.js` 改为读拆分后的文件，全绿 |

门禁改造时踩到并修掉 3 个坑，都记在这里防重犯：
① 判「页面引了什么」只能扫 `<script src=...>` 标签，扫全文会被 words.html
   的说明注释里写的文件名误命中；
② 老断言读 `js/pep-points.js` 检查教材文案，拆分后要看三份合并文本
   `_PEP_ALL`，否则把「文件里没有」误判成「内容被删」；
③ `en:` 字段 ↔ 整句音频的对账列表必须把 `js/pep-lessons.js` 加进去；
④ 交互探针第一版判「页面文本含『知识点』」—— 导航栏本来就有这三个字，
   **假 PASS**。改成劫持 `pepPointsOf` / `pepMemOf` 数调用次数 + 数
   `.point-card`，并让 Get Smart 真的走到 `L.step=1` 词卡
   （Step 0 只是开场页，根本不调 `pepMemOf`）。判据松等于没验。

### 维护备注 / 还没做的

- ⚠ `pep-points.js` 里 `pepMemOf` / `pepIpaOf` / `pepPosKey` / `pepPointsOf`
  依赖另两份数据；**将来若要在单词镇调用它们，必须先引对应数据文件**，
  否则会抛 ReferenceError。当前 words 页线上路径零调用，探针已单独确认。
- 后续可选（本轮刻意没做，收益小或需改结构）：
  ① `sentence.js`（gzip 3.9KB）在 index/letters/disclaimer 三页零调用点
     （`__cancelSpeak` 是 `typeof` 软调用），可摘，但 parents 页有「点我试听」
     真调用，**不能整站摘**；
  ② `words.html` 的 `pep-data.js`（15.6KB）只用 `PEP_LEVELS` 一个符号，
     `getsmart.html` 的 `pep-points.js` 同理可再细拆，收益递减；
  ③ 首页 `words-data.js` 40.6KB + `getsmart-data.js` 34.0KB 仍是**真依赖**
     （逐词掌握统计 / 课程表），要保持现状，别按「统计能代替」硬裁。

版本链：新增 `pep-lessons.js?v=1` / `pep-mem.js?v=1` 并进 CORE，
`pep-points.js?v=23→v24`、`CACHE v181→v182`、`BUILD 2026-11-12.2→.3`。
音频四套版本号、`AUDIO_CACHE`、`js/ipa.js` 与 `PEP_IPA` 数据零改动。

## 2026-11-13.1 · 修「底部反复弹版本更新，点一下刷新又出来」

**现象**：家长反馈底部经常出现橙色「有新版本」条，点它刷新后隔几秒又出现，
反复出现、像是永远更新不完。

**根因不是提示太勤，是发版流程漏项**。四段代码串成一个闭环：

| 环节 | 事实 |
|---|---|
| 发版 | 连续 6 次提交（`fe96d5a` 起）都改了 `js/app.js` 的 `BUILD`（`.11`→`.12`→`.1`→`.2`→`.3`），但 `js/app.js?v=124` **一次都没升** |
| SW 静态资源 | `cache-first`：`c.match(e.request)` 命中就返回；URL 不变就永远拿旧字节 |
| SW activate | 为防 11-07 白屏会把旧缓存条目搬进新缓存，包含 `js/app.js?v=124` 的旧字节；后台补齐 `todo` 只补 `!c.match(u)` 的 → 同 URL 判定「已有」，**新 app.js 永远不下载** |
| 页面 | `BUILD` 来自旧 app.js，`version.json` 不进缓存、每次发版都变新；4 秒 / 5 分钟 / 切前台各比对一次，必然不等 → 弹条。`__updShown` 是内存变量，`reload` 清零 → 又弹 |

取证可复算：`git log -6 --format='%h'` 逐个 `git show <sha>:js/app.js` 取 `BUILD`、
`git show <sha>:index.html` 取 `?v=`，即可看到 6 次 BUILD 变化对应同一个 `v124`。
`_audit/probe_update_loop.py --expect-loop` 在真浏览器里把 `version.json` hook 成
「永远更新」，修复前实测：加载 2 次、第二次 `updateBar` 仍在、无幂等标记 → 死循环成立。

**三道防线（缺一不可）**：

1. **止住循环**：`__showUpdateBar` 按版本号查 `sessionStorage` 的
   `birdie_upd_done`，同一版本在本标签页只提示一次；点击时先落标记再 reload。
   关掉标签页重开、或又发了新版本，标记不同仍会正常提示 —— 不掩盖真更新。
2. **让刷新真的生效**：点击时给 SW 发 `FORCE_REFRESH`（MessageChannel 等回执，
   700ms 超时兜底，旧版 SW 不认识也能照常刷新）。SW 只在内存 `forceNav` 里
   给当前 pathname 记一次性标记，下一次导航跳过缓存直接回源 —— 拿到的才是
   引用新 `?v=` 的新 HTML。**一个字节缓存都不删**：11-07 整页白底黑字就是清空
   旧缓存造成的，弱网/离线时 `same` / `home` 兜底必须留着。
3. **让新代码进得来**：本次把 `js/app.js?v=124→125` 同步到 9 个正式页、
   SW `CORE` 与 `BOOT`。新 URL 不在旧缓存里，`cache-first` 自然回源。
   另加 `_audit/check_facts.py` 的 **git 基线自动断言**：工作区 `js/app.js`
   内容相对 `HEAD` 有变化却没升 `?v=` 直接 FAIL，不写死任何版本号。

**验收**：

| 项 | 结果 |
|---|---|
| `probe_update_loop.py --expect-loop` | 修复前复现成功（第二次加载仍弹条） |
| `probe_update_loop.py`（默认） | 修复后 PASS：经历 reload、第二次不再弹、`birdie_upd_done` 已落 |
| `probe_force_refresh.py` | 7/7 PASS：把线上真实 `sw.js` 注入 Node 桩，实证「未 force 命中缓存 → force 后回源 → 再下一次回缓存」，且 `deletes=0`（一个缓存条目都没删） |
| `check_facts.py` | **352 PASS / 0 FAIL**（新增 4 条事故断言）；故意把 `index.html` 退回 `v124` 做负对照，新断言如预期 FAIL（`changed=True base=124 cur=124`），恢复后全绿 |
| 10 页运行时 / 16 个窄屏状态 | 0 console error / 0 资源失败 / 0 溢出 |
| B4 浮层 / C3 拆分探针 / 动态题 | 全绿（6171 条动态题无结构性病句） |

版本链：`js/app.js?v=124→125`、`CACHE v182→v183`、
`BUILD 2026-11-12.3→2026-11-13.1`、`README.txt` / `VERSION.md` / `version.json` 同步。
音频四套版本号、`AUDIO_CACHE`、`js/ipa.js` 与课本数据零改动。

⚠️ 以后每次发版**改了 `js/app.js` 就必须升 `?v=`**，门禁会盯着；
只改 HTML/CSS/数据文件而 `app.js` 未动时不受此约束。

---

## 2026-11-13.2 · 第二轮外部复检报告验收（修真 bug，不照单全收）

外部报告基于 2026-11-13 09:22 的线上快照（`app.js?v=125`），验收上一轮 21 条、
新增 8 条。逐条用源码 + 真浏览器复现核过，**报告大体准确，但有一半结论是口径项或误报**。

### 判定表：改了什么

| 编号 | 报告结论 | 复核判定 | 本轮处理 |
|---|---|---|---|
| N1 | 新语法关卡把「表语/状语」标反（P0） | **属实，且比报告严重** | ✅ 人工校对 23 道固定句 + 5 处旧关卡同类误标 |
| N2 | L20–L23 整句选项在 390px 挤成三列（P1） | 属实（`.opt` 窄屏 `min-width:0` + `flex:1`） | ✅ 长选项纵向单列 |
| E2 | 「还没开始」和两个绿勾同屏（P1） | 属实（`parts` 无条件拼 ✅） | ✅ 未开始一律空框 |
| A4 | 手机底栏没有家长中心（P1） | 属实（6 项 + 「我的」，入口只在页脚） | ✅ 底栏 8 格加「家长」 |
| D2 | 首页对搜索引擎是空壳（P1） | 属实（只有 words/grammar/pep 三页有 noscript） | ✅ 首页补静态摘要 + 8 个站点链接 |
| F1 | `.btn` 修了，业务组件漏了（P2） | 属实（白字压珊瑚 2.78、湖蓝字压白 1.98） | ✅ 改深墨蓝字 / 提亮渐变，实测 5.49 / 6.09 |
| F2 | 10–12px 小字仍不达标（P2） | 部分属实 | ✅ 底栏选中项 3.10→5.95、语法小标签 3.30→5.10、页脚 5.70 |
| N4 | 字母岛图例红/蓝字几乎看不清（P2） | 属实（2.27 / 1.62） | ✅ 按**最坏天空底** `#8ED8F8` 重选，5.09 / 5.78 |
| N3 | L20 公式把两种过去式混成一个（P2） | 属实 | ✅ 改「be 动词用 was/were，实义动词加 -ed」 |
| N6 | 「你是一年级，一至一年级的词都该会」（P2） | 属实 | ✅ 改「先把本年级的词过关」 |
| N8 | L20–L23 少「用单词镇的词造句」标签（P3） | **不能按报告补** | ✅ 改副标题写清「第三阶段例句固定」——新关卡本来就不是生成题，补标签等于说谎 |
| B5 | `green` 用「grow 元音降级」解释（基本修复） | 属实，违反「伪词源是硬伤」 | ✅ 改成画面记忆，不再假拆分 |
| B6 | manifest 仍写「999词」 | 属实 | ✅ 统一为「999 条词条（含短语）」 |

### 判定表：刻意不动的（附理由，避免下轮又被当漏修）

| 编号 | 报告建议 | 不采纳的理由 |
|---|---|---|
| B2 | 拆音节 / 拆音块分两层 | **报告这条判断有误**：代码里早就是两套 —— `splitBlocks`（按音素，刻意去掉辅音连缀，因为 br 是 /b/+/r/ 两个音）与 `splitSyllables`（按音节，apple→ap·ple）；`words.html` 拆词第 3 步用的就是后者。把连缀合回「一个块」会退回 11-11 修掉的「nt 当一个音」错误。属教学口径，要家长拍板 |
| B4 | 词卡加「课本写法」小字 | 家长 11-09 已拍板美式口径；CMUdict 转写丢了重音层级，`/i/` 在 she / happy 写法不同、`/ɑ/` 英式对应随词变化，机械转 1000 条必然教错。11-12.2 的符号对照浮层是已定方案，报告自己也评价「诚实且低风险」 |
| C1 | 五个同步脚本全加 `defer` | **危险**：页面底部内联脚本是非 defer，会先于 defer 的外部脚本执行，`Store` / `renderNav` 未定义 → 重演 11-07 白屏。不能照做 |
| C2 / C3 | 内容页再裁 296KB 图库 / words 摘 pep 脚本 | 架构级，11-12.3 已按页拆过课本数据；再动要改异步加载，收益不抵白屏风险 |
| N5 | 68 个无图词改句子卡 | 产品形态变更，且「听词选图」已用 364 词白名单规避，不是 bug |
| N7 | 听词选图下方留白给 `min-height` | P3 观感项，本轮不动 |
| D3 | `js/games.js` 直连 404 | 全站零引用，不存在的文件本就不该被引用，非 bug |

### N1 详解：为什么用人工标注而不是调规则

真浏览器复现 + 真实引擎导出 80 题解析后，影响面远大于报告举的那一题：

| 句子 | 修复前引擎输出 |
|---|---|
| `I was happy yesterday.` | happy=**定语**、yesterday=**表语**（报告 N1） |
| `It is hotter today than yesterday.` | hotter/today/than/yesterday **四个词全标表语**，且 hotter 词性是名词 |
| `I played football yesterday.` | 整句 `ok:false`，played 被兜底成**名词** |
| `I am going to swim tomorrow.` | tomorrow=**宾语** |
| `Where did you go yesterday?` | Where=名词/主语，you 和 go 没有成分 |
| `He watches TV every day.` | every / day 都标宾语 |

根因：`gxAnalyze` 的词表只覆盖「谁 + 干什么 + 什么」基础句型，
`yesterday/tomorrow/played/bigger/Where` 全走「兜底成名词」；`markPredicate`
又把 be 后句末名词一律当表语。**L20–L23 是新增的固定句子，超出引擎设计范围。**

按引擎自己文件头写的铁律「教语法的东西标错一次比不标更糟」，
本轮给 23 道固定句逐词人工校对（`grammar.html` 的 `MANUAL_PARSE`，
另含 5 处旧关卡同类误标共 28 条），`parseHTML(sentence, it)` 优先查表；
L1–L19 动态生成句仍走引擎。人工标注允许把介词短语合成一格显示得更清楚，
但**拼回去必须与原句逐字相同**，由门禁跨文件求值校验。

⚠️ 不采用「给 80 题都内置标注」：L1–L19 是单词镇动态生成的，句子不固定，
内置表覆盖不了；也不采用「全面升级引擎支持过去时/比较级」——工作量大、
风险高，且动态题根本用不到这些句型。

### 验收表

| 项 | 结果 |
|---|---|
| `check_facts.py` | **368 PASS / 0 FAIL**（比上一版 +16 条；含 28 条标注完整性、23 句覆盖、概念级钉死、7 处 WCAG 取实际 CSS 值计算） |
| `probe_review2.py`（新增） | **15/15**：390px 精确视口逐词验解析、长选项 317px 单列、底栏 8 格零溢出、noscript 8 链接、绿勾、六处对比度 |
| 负对照 | 4 项故意破坏（happy 标回定语 / 漏标一句 / 图例退回浅蓝 / 摘掉家长入口）**全部被门禁抓到**，恢复后 0 FAIL |
| 10 页运行时 / 16 个 390px 状态 | 0 console 错误、0 资源失败、0 溢出 |
| B4 浮层 / C3 拆分 / 更新条 / SW 强制回源 / 动态题 | 全绿；6171 条动态题无结构性病句 |
| 对比度实测（最坏底色） | 拼词按钮 5.49、游戏标签 6.09、图例 5.09/5.78、底栏选中 5.95、语法标签 5.10、页脚 5.70 |

### 版本链与未验部分

`app v125→v126` / `words-data v45→v46` / `data v43→v44` / `style v52→v53` /
`CACHE v183→v184` / `BUILD 2026-11-13.1→.2`；`README.txt` / `VERSION.md` /
`version.json` / `manifest.json` 同步。音频四套版本号、`AUDIO_CACHE`、
`js/ipa.js`、课本数据零改动。

盲区未变：安卓真机数字间距、2878 条音频逐条听音、教材逐词对齐；
人工标注的语义正确性靠导出逐条读 + 门禁概念级断言，机器证明不了「教得对」。
`N1` 的 28 条标注是人工校对结果，若后续改题目 `say` 文本，门禁会因「漏标」直接 FAIL。

## 2026-11-13.3 黑板词图重画（board 不再是 🟩 绿方块）

家长反馈：Get Smart 学堂里 `board`（黑板）的配图「确实不大像」——
截图上就是一块纯绿色圆角矩形，没有任何黑板特征。

### 根因

不是画得差，是**根本没画**。`js/getsmart-data.js` 里这条词是
`{ w: 'board', zh: '黑板', e: '🟩' }`，🟩 的 Twemoji SVG 本来就是纯色方块。
`wordIcon()` 的优先级是「emoji 图库 → 自绘 SVG → 色块 → 字母牌」，
所以课程词 `board` 永远走第一分支；而词库里的 `blackboard` 虽有自绘黑板图，
却因为 `e` 为空、且两词不同名，从未与它共享。

### 处置

| 项 | 做法 |
|---|---|
| 新画 | 100×100 自绘：木框（四角钉 + 内圈高光）、深墨绿板面、四段错落的粉笔擦痕、粉笔槽、白/淡黄粉笔、木背灰毡底板擦、两条腿与脚 |
| 卡面 | **零文字**。旧 `blackboard` 图上的 `ABC` 一并去掉；擦痕刻意不用两道对称弧线（会看成眉毛 + 嘴，孩子容易认成一张脸） |
| 两词同图 | `WORD_SVG["board"]` 与 `WORD_SVG["blackboard"]` 逐字节相同 |
| 自绘优先 | 两词加入 `WORD_SVG_FIRST`（`wordIcon` 与 `iconKey` 共用这个词集，只改一处会图与身份脱节） |
| 去重归一 | `SVG_SAME_KEY` 加 `blackboard: 'board'`，两者 `iconKey` 同为 `svg:board` |
| 刻意不动 | 课程数据的 `e:'🟩'` 保留作 emoji 兜底；不删词条、不加 defer、不动题库与进度逻辑 |

产物 `svg/word-svg.js` 由 `_audit/redraw_board_20261113.py --apply` 生成，未手改；
接线（白名单 + 归一表 + 注释）同脚本幂等写入 `js/app.js`。

### 门禁修正（顺带修掉三条过期断言）

铁律 8.5「全库类门槛不许写死数字」：`check_facts.py` 原写死
`自绘图库 378 条` / `WORD_SVG_FIRST 恰好 33 个词` / `33 张新卡画面两两不同`。
加一张图后前两条必然假 FAIL，第三条还会把「board/blackboard 刻意同图」误判成错。
改成：条数与赋值行数自洽（现算）、白名单每个词都有图（现算）、
基准 33 张卡两两不同（排除同义词对）、同义词对单独断言「同画 + 已归一」。

### 验收

| 项 | 结果 |
|---|---|
| 目视对照图 | 修复前 🟩 纯色块 / 旧 blackboard（带 ABC）/ 新黑板支架，放大 210px 复核两轮，一眼可辨 |
| `probe_board_icon.py` | **11/11 PASS**：真实 `GS_BOOKS` 词条、emoji 图库已到货（🟩 在图库里，回退路径真实存在）、渲染新画、零文字、DOM 可见、两词同画同 key |
| 正负对照 | 故意把 `board` 移出白名单 → `iconKey` 退回 `esvg:🟩`、5 项报红；恢复 → 11/11 |
| `test_icon_key.js` | 73 项通过（全库同图对 10 对，`SVG_SAME_KEY` 名副其实） |
| 全量回归 | 事实门禁、10 页运行时、16 个 390px 状态、B4 浮层、C3 拆分、更新条、SW、动态题全绿 |

版本链：`word-svg v6→v7`、`app v126→v127`（改了 app.js，必须升）、
`CACHE v184→v185`、`BUILD 2026-11-13.2→.3`，9 个正式页与 SW CORE/BOOT 同步；
本地 `_probe_*.html` 一起升，避免同一资源两种版本并存。
音频四套版本号、`AUDIO_CACHE`、音标与课本数据零改动。

## 2026-11-13.4 家长图标黑块修复（轻页面 emoji 不再回退成系统字体黑色剪影）

家长反馈：轻页面（首页 / 家长中心 / 声明页 / 404）底部的「家长」导航图标
**有时候渲染成一个黑色的人形剪影**，而不是彩色矢量图。

### 根因

不是图标画错，是**替换根本没发生**。轻页面只引核心表情库 `svg/emoji-core.js`
（首页 / 家长中心 / 声明页 / 404 不声明 `data-emoji="full"`，走这套 ~80 条的小库），
而它有两个缺陷：

1. 生成脚本 `_audit/gen_emoji_core.py` 按**单个码点**扫描 emoji，把 ZWJ 组合
   `👨‍👩‍👧`（家长中心正是这个图标）拆成 3 个孤立的人，整串没进库；
2. 拆分出核心库时漏掉了 `emoji-svg.js` / `emoji-svg2.js` 末尾的
   `try { if (window.__emojiSvgReady) window.__emojiSvgReady(); } catch(e){}` 回调。

结果：轻页面加载 emoji 库后没有触发 `paintEmoji` 替换，`👨‍👩‍👧` 等留在 DOM 里
由系统字体渲染——部分平台 / 字体下 ZWJ 组合没有彩色字形，就退化成黑色剪影。
年级切换按钮（`🌱🌿🍀🌻🍁🎓`）也有同样的隐患。

### 处置

| 项 | 做法 |
|---|---|
| 重新收集 | `gen_emoji_core.py` 改成**视觉簇扫描**（按 ZWJ / VS16 把组合收成整串），`👨‍👩‍👧` 与 6 个年级 emoji 一起进库 |
| 补回调 | 核心库末尾补回 `__emojiSvgReady()` 回调，替换时机与全量库一致 |
| 双保险 | `app.js` 的 `inject()` 给动态注入的 `<script>` 加 `onload` 兜底，即便库的回调缺失也会触发替换 |
| 不降级重页 | 重页（data-emoji=full）走全量库，本来就正常，这次零改动 |

### 验收

| 项 | 结果 |
|---|---|
| `probe_nav_icons.py` | 8/8 PASS：家长 tab 渲染成 `<svg>`（非文本字形）、年级按钮也解析成矢量图 |
| 正负对照 | 故意删回调 / 删 onload 各自仍能靠另一道防御过关；两道同时删才复现黑块 → 证明两道防御各自独立必要 |
| 全量回归 | 事实门禁、10 页运行时、16 个 390px 状态、B4 浮层、C3 拆分、更新条、SW、动态题全绿 |

版本链：`emoji-core v1→v2`、`app v127→v128`（改了 app.js，必须升）、
`CACHE v185→v186`、`BUILD 2026-11-13.3→.4`，9 个正式页与 SW CORE/BOOT 同步；
本地 `_probe_*.html` 一起升，避免同一资源两种版本并存。
黑板重画（.3）的其余资源零改动。
