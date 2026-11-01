# 版本快照 · 小鸟英语乐园 Birdie ABC

> 本文件是给修改者（人类或 AI）看的版本基准。改动任何文件前先读完这份说明。

## 基本信息

- 线上地址：https://heijialun19.github.io/yingyu/
- 仓库：heijialun19/yingyu（main 分支，GitHub Pages）
- 快照日期：2026-11-01
- 快照对应线上 commit：d13769f9（此后若无新 commit，本包与线上完全一致）
- 技术栈：纯 HTML/CSS/原生 JS，零依赖、零构建，进度存 localStorage（多档案 birdie_abc_profiles_v2）

## 各文件版本号（改了哪个文件，就把它的 ?v= 加 1）

| 文件 | 版本 | 说明 |
|---|---|---|
| js/app.js | v56 | 全站共享运行时：发音系统、星星、档案、导航 |
| js/words-data.js | v32 | 1000 词词库 |
| js/data.js | v32 | 字母岛 / 句子工厂等数据 |
| js/sentence.js | v44 | 句子工厂逻辑 |
| js/grammar-engine.js | v4 | 语法引擎 |
| js/ipa.js | v2 | 音标 |
| js/build-data.js | v1 | 数据构建辅助 |
| js/getsmart-data.js | v10 | Get Smart 1-6 全系列课程数据（6 册 237 课） |
| css/style.css | v45 | 全站样式 |
| svg/word-svg.js | v3 | 345 个手绘单词 SVG 卡通 |
| svg/emoji-svg.js | v2 | 内置 emoji SVG |
| sw.js | birdie-abc-v96 | Service Worker（音频缓存 birdie-audio-v1 不随发版清） |

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

- 单词发音：优先本地 audio/{word}.mp3，失败回退有道 API
- Get Smart 课程数据里 unit.mod 是**数字**（1-10），moduleLessons/startModuleTest 都按数字匹配
- 单元闯关每词只考 1 题（听音选图 或 看词选义随机），认义题干扰项按中文释义去重
- 图标渲染优先级：内置 SVG → 手绘 WORD_SVG → 色块（颜色词）→ 系统 emoji → 字母块
