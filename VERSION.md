# 版本快照 · 小鸟英语乐园 Birdie ABC

> 本文件是给修改者（人类或 AI）看的版本基准。改动任何文件前先读完这份说明。

## 基本信息

- 线上地址：https://heijialun19.github.io/yingyu/
- 仓库：heijialun19/yingyu（main 分支，GitHub Pages）
- 快照日期：2026-11-01（含当日修复，见文末「2026-11-01 修了什么」）
- 本包 = 线上 main 分支的完整快照；核验是否最新，以 GitHub 仓库 main 分支与「最近提交」为准
- 技术栈：纯 HTML/CSS/原生 JS，零依赖、零构建，进度存 localStorage（多档案 birdie_abc_profiles_v2）

## 各文件版本号（改了哪个文件，就把它的 ?v= 加 1）

| 文件 | 版本 | 说明 |
|---|---|---|
| js/app.js | v57 | 全站共享运行时：发音系统（本地音频优先）、词图、星星、档案、导航 |
| js/words-data.js | v32 | 1000 词词库 |
| js/data.js | v33 | 字母岛 / 句子工厂等数据（v33：THEMES 去掉 flatMap，见文末） |
| js/sentence.js | v44 | 句子朗读引擎（两词一组连读 + 词组高亮，句子工厂/游戏/Get Smart 共用） |
| js/speech.js | v1 | 跟读评分引擎（浏览器语音识别 → 「听清度」，**不是**发音评分） |
| js/grammar-engine.js | v5 | 语法引擎（词性、复数、冠词、句型转换、能不能加 a/an） |
| js/ipa.js | v2 | 音标 |
| js/build-data.js | v1 | 造词实验室题库（合成词 / 派生词 / 词根） |
| js/getsmart-data.js | v10 | Get Smart 1-6 全系列课程数据（6 册 237 课） |
| css/style.css | v46 | 全站样式（含首屏加载层 6 秒兜底） |
| svg/word-svg.js | v3 | 345 个手绘单词 SVG 卡通 |
| svg/emoji-svg.js | v4 | 内置 emoji SVG **基础库 617 条**。**用 async 加载，不挡首屏**，挂 `window.WORD_EMOJI` |
| svg/emoji-svg2.js | v1 | 内置 emoji SVG **课程扩展 195 条**（🐓🦅🦖🟡🩷🪑…）。只有 getsmart.html 加载，async |
| sw.js | birdie-abc-v100 | Service Worker（音频缓存 birdie-audio-v1 不随发版清） |

版本号引用位置：各 HTML `<script src="...?v=N">`、sw.js 的 CORE 数组。**改了 JS/CSS 必须同步升 ?v= 和 sw.js 里的引用**，否则老用户的 Service Worker 缓存会继续用旧文件。

## 缓存机制（改版前必读）

- 页面 HTML：Service Worker 走「网络优先」——发版即生效
- 带版本号的 JS/CSS：走「缓存优先」——**只改文件内容不升版本号 = 老用户永远拿旧版**
- audio/ 目录：独立缓存，发版不清；重建音频需同步把 sw.js 的 AUDIO_CACHE 与 app.js 的 AUDIO_VER 加 1

## 页面清单

| 页面 | 功能 |
|---|---|
| index.html | 首页：主卡任务推荐 + 今日任务流入口 + 各岛屿入口 |
| getsmart.html | Get Smart 学堂：课本同步（学单词→闯关→句型 三步 + 复习课 + 单元小测 + 今日任务流 ?flow=1） |
| words.html | 单词镇：分主题练词 + 复习（间隔重复）+ 听写 |
| letters.html | 字母岛：26 字母象形故事 |
| grammar.html | 句子工厂：19 关 |
| games.html | 游戏乐园：7 个游戏（含自然拼读） |
| parents.html | 家长中心：进度报告 |
| disclaimer.html | 免责声明 / 隐私 / 条款 |

## 已知约定

- 单词发音：优先本地 audio/{word}.mp3，失败回退有道 API。**本地音频清单是动态登记的**：
  1000 词词库在 app.js 启动时入表，Get Smart 的 1027 个词在第一次查不到时补登记一次
  （`__registerGSAudio()`）——因为 getsmart-data.js 比 app.js 晚加载，写死在启动时就会漏掉 644 个词
- Get Smart 课程数据里 unit.mod 是**数字**（1-10），moduleLessons/startModuleTest 都按数字匹配
- 单元闯关每词只考 1 题（听音选图 或 看词选义随机），认义题干扰项按中文释义去重
- **认义题（look）的选项一律是中文释义**，听音题（listen）才是英文词/图片。
  认义题若用英文词做选项，题干里的单词会直接出现在选项里 → 答案白送
- 图标渲染优先级：内置 SVG → 手绘 WORD_SVG → 色块（颜色词）→ 系统 emoji → 字母块
- 新增 js/css 文件时**必须同时加进 sw.js 的 CORE**，否则离线首次打开该功能会 504 崩掉
  （2026-11-01 的 speech.js 就是这么漏的）

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

- **Get Smart 的 227 个句子没有离线音频**（只有 1 句中奖）。它们靠 sentence.js 两词一组
  调有道接口朗读，**断网时句子朗读无声**。单词点读不受影响（本地音频已修好）。
  ⚠️ 2026-11-01 评估过「把 643 个两词词组全烘成本地 mp3」，结论是**不做**，理由三条，
  别再来一遍：① 有道 dictvoice 对任意短语是**看心情 500**（实测 "Hi I am" / "a red ball"
  连续 3 次都 500，"she likes apples" 却 200），批量 643 个必然掺一堆空文件；
  ② 本机没有 ffmpeg，做不了与现有词音一致的响度归一（现有 1000 词已归一到 -12.5 dBFS），
  音量忽大忽小比没声音更糟；③ SW 已经把播放过的有道响应缓存下来了，
  「听过的句子」本来就能离线，真正的缺口只剩「第一次就断网」。
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
   句子工厂（4 处）、句子火车员、听句选图都改用它。
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
