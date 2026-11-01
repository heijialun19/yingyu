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
| js/app.js | v60 | 全站共享运行时：发音系统（本地音频优先 + 坏音频自愈）、词图、星星、档案、导航 |
| js/words-data.js | v32 | 1000 词词库 |
| js/data.js | v33 | 字母岛 / 句子工厂等数据（v33：THEMES 去掉 flatMap，见文末） |
| js/sentence.js | v46 | 句子朗读引擎（两词一组连读 + 词组高亮，句子工厂/游戏/Get Smart 共用） |
| js/speech.js | v1 | 跟读评分引擎（浏览器语音识别 → 「听清度」，**不是**发音评分） |
| js/grammar-engine.js | v5 | 语法引擎（词性、复数、冠词、句型转换、能不能加 a/an） |
| js/ipa.js | v2 | 音标 |
| js/build-data.js | v1 | 造词实验室题库（合成词 / 派生词 / 词根） |
| js/getsmart-data.js | v10 | Get Smart 1-6 全系列课程数据（6 册 237 课） |
| css/style.css | v46 | 全站样式（含首屏加载层 6 秒兜底） |
| svg/word-svg.js | v3 | 345 个手绘单词 SVG 卡通 |
| svg/emoji-svg.js | v5 | 内置 emoji SVG **基础库 626 条**。**用 async 加载，不挡首屏**，挂 `window.WORD_EMOJI` |
| svg/emoji-svg2.js | v2 | 内置 emoji SVG **课程扩展 186 条**（🐓🦅🦖🟡🩷🪑…）。只有 getsmart.html 加载，async |
| sw.js | birdie-abc-v102 | Service Worker（音频缓存 birdie-audio-v1 不随发版清） |

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
