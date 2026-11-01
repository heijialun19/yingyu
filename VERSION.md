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
| js/data.js | v32 | 字母岛 / 句子工厂等数据 |
| js/sentence.js | v44 | 句子朗读引擎（两词一组连读 + 词组高亮，句子工厂/游戏/Get Smart 共用） |
| js/speech.js | v1 | 跟读评分引擎（浏览器语音识别 → 「听清度」，**不是**发音评分） |
| js/grammar-engine.js | v4 | 语法引擎（词性、复数、冠词、句型转换） |
| js/ipa.js | v2 | 音标 |
| js/build-data.js | v1 | 造词实验室题库（合成词 / 派生词 / 词根） |
| js/getsmart-data.js | v10 | Get Smart 1-6 全系列课程数据（6 册 237 课） |
| css/style.css | v46 | 全站样式（含首屏加载层 6 秒兜底） |
| svg/word-svg.js | v3 | 345 个手绘单词 SVG 卡通 |
| svg/emoji-svg.js | v3 | 内置 emoji SVG（617 条）。**用 async 加载，不挡首屏**，挂 `window.WORD_EMOJI` |
| sw.js | birdie-abc-v98 | Service Worker（音频缓存 birdie-audio-v1 不随发版清） |

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

- **Get Smart 的 225 个句子没有离线音频**（只有 1 句中奖）。它们靠 sentence.js 两词一组
  调有道接口朗读，**断网时句子朗读无声**。单词点读不受影响（本地音频已修好）。
- `svg/` 目录里混着 19 个绘图文稿（batch*.js / memo_*.js / merge.js / colors.js，共约 228KB），
  没有任何页面引用。保留是因为它们是重画用的源文件；要清理请先确认不需要重画。
- `robots.txt` / `sitemap.xml` 放在项目站点根目录下，搜索引擎只读**域名根**的 robots.txt，
  所以这个 robots.txt 实际不生效；sitemap 需要去 Google Search Console 手动提交。

## 2026-11-01 首屏提速（用户反馈「加载太慢，太久加载不完」）

实测首页要传 440KB（gzip），其中 **`svg/emoji-svg.js` 一家 290KB，占 66%**，
而且它排在 `app.js` 前面 —— 全屏加载层必须等它下完才消失。手机上就是一直转圈。

1. **图库改 async**：`<script async src="svg/emoji-svg.js?v=3">`，不再挡解析。
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

## 待定（还没做，需要拍板）

- Get Smart 课程数据里有 **约 200 个 emoji 不在内置图库里**（🐓🦅🦖🟡🩷🪑 等），
  老 Windows 上会是黑白/空白。补进图库会让文件再涨约 130KB(gzip)，
  和「首屏要快」直接冲突，所以先留着，等确认要不要为老机器付这个带宽。
