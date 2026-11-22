/* ============================================================
   Power Up 知识点卡 v1.2（2026-11-22 整理）
   由 _pu/build_site_data.js 从上线包重建，勿手改。
   · 72 单元，每单元 4-6 张：语法聚焦 / 拼读词族 / 真题题型 / CLIL / 素养 / 记忆加速
   · 拼读词族卡已按单元真实词重算（原包 34 张里 30 张例词不符）
   · 标题重复 emoji 已去除
   ============================================================ */
'use strict';
const POWERUP_POINTS = {
 "pu1": {
  "pu1-u1": [
   {
    "t": "🎯 语法聚焦：be 动词 am/is/are",
    "kid": "先看例句：I'm Lucy. What's your name? —— 它用的就是本单元核心「be 动词 am/is/are」。本单元任务里就会反复用到：和班里每个人打个招呼，学会介绍自己。",
    "tip": "be 动词 am/is/are",
    "en": "I'm Lucy. What's your name?",
    "zh": "你好，小鸟！"
   },
   {
    "t": "🔤 语音拼读：hello",
    "kid": "点开本单元词卡的拼读行，按音节把 hello 读准，再连读整词。",
    "tip": "见词能读",
    "en": "hello",
    "zh": "拼读示范词"
   },
   {
    "t": "📝 Pre A1 Starters · Listening Part 1（听音连线）",
    "kid": "本单元任务：和班里每个人打个招呼，学会介绍自己。 学完这些词和句型，Pre A1 Starters 的「Listening Part 1（听音连线）」你就有把握了——考的就是它们。",
    "tip": "Listening Part 1（听音连线）",
    "en": "hi",
    "zh": "考试重点词"
   },
   {
    "t": "🔬 🔢 CLIL · 数学：字母与排序",
    "kid": "把自己的名字按字母表排序，看看谁的名字排最前——字母有顺序，就像数字一样。",
    "tip": "CLIL 跨学科",
    "en": "hello",
    "zh": "跨学科链接"
   },
   {
    "t": "💛 素养 · 有礼貌地打招呼",
    "kid": "见面先说 hello，离开说 goodbye——礼貌的话让每个人都开心。",
    "tip": "社会价值观",
    "en": "hello",
    "zh": "素养成长"
   },
   {
    "t": "🧠 记忆加速",
    "kid": "hello：hello 原是喊人的『喂喽！』，和 hi 一样都是招呼声 ｜ hi：hi 是短促一声『嗨！』——招呼就喊它 ｜ goodbye：goodbye 原是 God be with ye（愿上帝与你同行）缩成的（前 10 词为课本核心词 ⭐）",
    "tip": "词库记忆法",
    "en": "hello / hi / goodbye",
    "zh": "记忆加速"
   }
  ],
  "pu1-u2": [
   {
    "t": "🎯 语法聚焦：可数名词单复数（+s）",
    "kid": "先看例句：This is my school bag. —— 它用的就是本单元核心「可数名词单复数（+s）」。本单元任务里就会反复用到：整理自己的书包，说出每样文具。",
    "tip": "可数名词单复数（+s）",
    "en": "This is my school bag.",
    "zh": "我的书包"
   },
   {
    "t": "🔤 拼读词族：ch（如 school / chair）",
    "kid": "school、chair、schoolbag 都属于 ch 词族——同一组字母读同一个音。点开词卡上的拼读行，跟着读三遍，见词就能读。",
    "tip": "ch 词族",
    "en": "school",
    "zh": "拼读词族"
   },
   {
    "t": "📝 Pre A1 Starters · Listening Part 2（听音写词）",
    "kid": "本单元任务：整理自己的书包，说出每样文具。 学完这些词和句型，Pre A1 Starters 的「Listening Part 2（听音写词）」你就有把握了——考的就是它们。",
    "tip": "Listening Part 2（听音写词）",
    "en": "book",
    "zh": "考试重点词"
   },
   {
    "t": "🔬 🔢 CLIL · 数学：数一数文具",
    "kid": "数一数书包里有几支笔、几本书——文具是最好的数数教具。",
    "tip": "CLIL 跨学科",
    "en": "school",
    "zh": "跨学科链接"
   },
   {
    "t": "💛 素养 · 爱护文具",
    "kid": "铅笔轻轻放，橡皮不乱丢——爱护文具的小朋友人人喜欢。",
    "tip": "社会价值观",
    "en": "school",
    "zh": "素养成长"
   },
   {
    "t": "🧠 记忆加速",
    "kid": "school：school 学校——来自希腊语「闲暇」：古人只有闲下来才读书 ｜ book：book 书——原来是「山毛榉树皮」，古人把字写在树皮上 ｜ pen：pen 钢笔——原来是「羽毛」，古人用羽毛蘸墨写字（前 10 词为课本核心词 ⭐）",
    "tip": "词库记忆法",
    "en": "school / book / pen",
    "zh": "记忆加速"
   }
  ],
  "pu1-u3": [
   {
    "t": "🎯 语法聚焦：this is ... / these are ...",
    "kid": "先看例句：This is my mum. She is kind. —— 它用的就是本单元核心「this is ... / these are ...」。本单元任务里就会反复用到：画一张全家福并介绍家庭成员。",
    "tip": "this is ... / these are ...",
    "en": "This is my mum. She is kind.",
    "zh": "这是我的家"
   },
   {
    "t": "🔤 拼读词族：er（如 father / mother）",
    "kid": "father、mother、brother 都属于 er 词族——同一组字母读同一个音。点开词卡上的拼读行，跟着读三遍，见词就能读。",
    "tip": "er 词族",
    "en": "father",
    "zh": "拼读词族"
   },
   {
    "t": "📝 Pre A1 Starters · Listening Part 3（听音涂色）",
    "kid": "本单元任务：画一张全家福并介绍家庭成员。 学完这些词和句型，Pre A1 Starters 的「Listening Part 3（听音涂色）」你就有把握了——考的就是它们。",
    "tip": "Listening Part 3（听音涂色）",
    "en": "mom",
    "zh": "考试重点词"
   },
   {
    "t": "🔬 🌍 CLIL · 社会：家庭树",
    "kid": "画一棵家庭树：爷爷奶奶在树下，爸爸妈妈在中间，你在树梢——一看就懂谁和谁是一家人。",
    "tip": "CLIL 跨学科",
    "en": "dad",
    "zh": "跨学科链接"
   },
   {
    "t": "💛 素养 · 关心家人",
    "kid": "给爷爷奶奶捶捶背，帮爸爸妈妈拿拖鞋——爱要说出来也要做出来。",
    "tip": "社会价值观",
    "en": "dad",
    "zh": "素养成长"
   },
   {
    "t": "🧠 记忆加速",
    "kid": "dad：dad 是最简单的叫法：d 张嘴喊『大！』 ｜ mom：mom 是最简单的叫法：m 闭嘴哼『妈——』 ｜ father：father 和拉丁 pater 是亲戚（f↔p 音变）：papa、paternal 同根（前 10 词为课本核心词 ⭐）",
    "tip": "词库记忆法",
    "en": "dad / mom / father",
    "zh": "记忆加速"
   }
  ],
  "pu1-r1": [
   {
    "t": "🎯 语法聚焦：复习：be 动词、名词复数、this/these、he/she",
    "kid": "先看例句：Hello! This is my friend. —— 它用的就是本单元核心「复习：be 动词、名词复数、this/these、he/she」。本单元任务里就会反复用到：Pre A1 Starters 题型练：Listen and point / Read and match。",
    "tip": "复习：be 动词、名词复数、this/these、he/she",
    "en": "Hello! This is my friend.",
    "zh": "复习 1-3"
   },
   {
    "t": "🔤 拼读词族：er（如 ruler / brother）",
    "kid": "ruler、brother、sister 都属于 er 词族——同一组字母读同一个音。点开词卡上的拼读行，跟着读三遍，见词就能读。",
    "tip": "er 词族",
    "en": "ruler",
    "zh": "拼读词族"
   },
   {
    "t": "📝 Pre A1 Starters · Reading & Writing Part 1（看词连线）",
    "kid": "本单元任务：Pre A1 Starters 题型练：Listen and point / Read and match。 学完这些词和句型，Pre A1 Starters 的「Reading & Writing Part 1（看词连线）」你就有把握了——考的就是它们。",
    "tip": "Reading & Writing Part 1（看词连线）",
    "en": "book",
    "zh": "考试重点词"
   },
   {
    "t": "🧠 记忆加速",
    "kid": "hello：hello 原是喊人的『喂喽！』，和 hi 一样都是招呼声 ｜ book：book 书——原来是「山毛榉树皮」，古人把字写在树皮上 ｜ pen：pen 钢笔——原来是「羽毛」，古人用羽毛蘸墨写字",
    "tip": "词库记忆法",
    "en": "hello / book / pen",
    "zh": "记忆加速"
   }
  ],
  "pu1-u4": [
   {
    "t": "🎯 语法聚焦：How many ...? 数字 1-10",
    "kid": "先看例句：I have three red pens. —— 它用的就是本单元核心「How many ...? 数字 1-10」。本单元任务里就会反复用到：数一数教室里的东西，说出它们的颜色。",
    "tip": "How many ...? 数字 1-10",
    "en": "I have three red pens.",
    "zh": "颜色与数字"
   },
   {
    "t": "🔤 拼读词族：ou（如 four / colour）",
    "kid": "four、colour、count 都属于 ou 词族——同一组字母读同一个音。点开词卡上的拼读行，跟着读三遍，见词就能读。",
    "tip": "ou 词族",
    "en": "four",
    "zh": "拼读词族"
   },
   {
    "t": "📝 Pre A1 Starters · Reading & Writing Part 3（看图选词）",
    "kid": "本单元任务：数一数教室里的东西，说出它们的颜色。 学完这些词和句型，Pre A1 Starters 的「Reading & Writing Part 3（看图选词）」你就有把握了——考的就是它们。",
    "tip": "Reading & Writing Part 3（看图选词）",
    "en": "yellow",
    "zh": "考试重点词"
   },
   {
    "t": "🔬 🔢 CLIL · 数学：颜色分类统计",
    "kid": "把玩具按颜色分堆再数一数——红色一堆、蓝色一堆，这就是数学里的分类统计。",
    "tip": "CLIL 跨学科",
    "en": "red",
    "zh": "跨学科链接"
   },
   {
    "t": "💛 素养 · 分享与合作",
    "kid": "数数的时候把积木分给同桌一起数——一起数得又快又准。",
    "tip": "社会价值观",
    "en": "red",
    "zh": "素养成长"
   },
   {
    "t": "🧠 记忆加速",
    "kid": "red：red 和 rust（铁锈）同根：铁锈就是红的 ｜ yellow：yellow 和 gold 同根：金子是黄的 ｜ blue：blue 蓝天 blue sky；blew（吹过）和它同音不同义（前 10 词为课本核心词 ⭐）",
    "tip": "词库记忆法",
    "en": "red / yellow / blue",
    "zh": "记忆加速"
   }
  ],
  "pu1-u5": [
   {
    "t": "🎯 语法聚焦：It is a/an ...",
    "kid": "先看例句：The panda is so cute! —— 它用的就是本单元核心「It is a/an ...」。本单元任务里就会反复用到：给农场动物排队，介绍你最喜欢的动物。",
    "tip": "It is a/an ...",
    "en": "The panda is so cute!",
    "zh": "动物朋友"
   },
   {
    "t": "🔤 拼读词族：ck（如 duck / chick）",
    "kid": "duck、chick 都属于 ck 词族——同一组字母读同一个音。点开词卡上的拼读行，跟着读三遍，见词就能读。",
    "tip": "ck 词族",
    "en": "duck",
    "zh": "拼读词族"
   },
   {
    "t": "📝 Pre A1 Starters · Reading & Writing Part 5（看图填词）",
    "kid": "本单元任务：给农场动物排队，介绍你最喜欢的动物。 学完这些词和句型，Pre A1 Starters 的「Reading & Writing Part 5（看图填词）」你就有把握了——考的就是它们。",
    "tip": "Reading & Writing Part 5（看图填词）",
    "en": "dog",
    "zh": "考试重点词"
   },
   {
    "t": "🔬 CLIL · 科学：农场动物与产品",
    "kid": "cow 给我们 milk，hen 给我们 eggs，sheep 给我们 wool——农场动物是我们的好帮手。",
    "tip": "CLIL 跨学科",
    "en": "cat",
    "zh": "跨学科链接"
   },
   {
    "t": "💛 素养 · 爱护动物",
    "kid": "动物是我们的朋友——喂食轻轻的，摸它们柔柔的，不追不吓。",
    "tip": "社会价值观",
    "en": "cat",
    "zh": "素养成长"
   },
   {
    "t": "🧠 记忆加速",
    "kid": "cat：c 像蜷缩的小猫 + at 在：蜷在角落的猫 ｜ dog：dog 拟声『汪』：dog 一叫就汪汪 ｜ bird：bird 像展翅的小鸟：b 是身，ird 是飞（前 10 词为课本核心词 ⭐）",
    "tip": "词库记忆法",
    "en": "cat / dog / bird",
    "zh": "记忆加速"
   }
  ],
  "pu1-u6": [
   {
    "t": "🎯 语法聚焦：I like ... / I don't like ...",
    "kid": "先看例句：I like apples and milk. —— 它用的就是本单元核心「I like ... / I don't like ...」。本单元任务里就会反复用到：设计一份健康午餐盘。",
    "tip": "I like ... / I don't like ...",
    "en": "I like apples and milk.",
    "zh": "好吃的东西"
   },
   {
    "t": "🔤 拼读词族：ea（如 pear / bread）",
    "kid": "pear、bread、eat 都属于 ea 词族——同一组字母读同一个音。点开词卡上的拼读行，跟着读三遍，见词就能读。",
    "tip": "ea 词族",
    "en": "pear",
    "zh": "拼读词族"
   },
   {
    "t": "📝 Pre A1 Starters · Listening Part 1（听音连线）",
    "kid": "本单元任务：设计一份健康午餐盘。 学完这些词和句型，Pre A1 Starters 的「Listening Part 1（听音连线）」你就有把握了——考的就是它们。",
    "tip": "Listening Part 1（听音连线）",
    "en": "banana",
    "zh": "考试重点词"
   },
   {
    "t": "🔬 CLIL · 科学：健康餐盘",
    "kid": "健康餐盘一半是水果和蔬菜，四分之一是米饭，四分之一是蛋白质——你的餐盘长什么样？",
    "tip": "CLIL 跨学科",
    "en": "apple",
    "zh": "跨学科链接"
   },
   {
    "t": "💛 素养 · 不挑食",
    "kid": "每样食物都有自己的本领——胡萝卜护眼、牛奶壮骨。什么都吃，身体才棒。",
    "tip": "社会价值观",
    "en": "apple",
    "zh": "素养成长"
   },
   {
    "t": "🧠 记忆加速",
    "kid": "apple：apple 苹果——苹果公司的名字就是它 ｜ banana：banana 香蕉——弯弯像月牙 ｜ pear：pear 梨——和 pair（一对）同音不同义（前 10 词为课本核心词 ⭐）",
    "tip": "词库记忆法",
    "en": "apple / banana / pear",
    "zh": "记忆加速"
   }
  ],
  "pu1-r2": [
   {
    "t": "🎯 语法聚焦：复习：How many、like+名词、动物与食物词",
    "kid": "先看例句：I like apples. How many cats can you see? —— 它用的就是本单元核心「复习：How many、like+名词、动物与食物词」。本单元任务里就会反复用到：Pre A1 Starters 题型练：Speaking Part 3 看图说话。",
    "tip": "复习：How many、like+名词、动物与食物词",
    "en": "I like apples. How many cats can you see?",
    "zh": "复习 4-6"
   },
   {
    "t": "🔤 语音拼读：red",
    "kid": "点开本单元词卡的拼读行，按音节把 red 读准，再连读整词。",
    "tip": "见词能读",
    "en": "red",
    "zh": "拼读词族"
   },
   {
    "t": "📝 Pre A1 Starters · Listening Part 2（听音写词）",
    "kid": "本单元任务：Pre A1 Starters 题型练：Speaking Part 3 看图说话。 学完这些词和句型，Pre A1 Starters 的「Listening Part 2（听音写词）」你就有把握了——考的就是它们。",
    "tip": "Listening Part 2（听音写词）",
    "en": "blue",
    "zh": "考试重点词"
   },
   {
    "t": "🧠 记忆加速",
    "kid": "red：red 和 rust（铁锈）同根：铁锈就是红的 ｜ blue：blue 蓝天 blue sky；blew（吹过）和它同音不同义 ｜ one：one 的亲戚：once 一次、alone 独自、only 唯一、none 没有一个",
    "tip": "词库记忆法",
    "en": "red / blue / one",
    "zh": "记忆加速"
   }
  ],
  "pu1-u7": [
   {
    "t": "🎯 语法聚焦：I have a ...",
    "kid": "先看例句：I have a big yellow ball. —— 它用的就是本单元核心「I have a ...」。本单元任务里就会反复用到：带一件玩具来介绍它。",
    "tip": "I have a ...",
    "en": "I have a big yellow ball.",
    "zh": "我们喜爱的玩具"
   },
   {
    "t": "🔤 拼读词族：ar（如 teddy bear / car）",
    "kid": "teddy bear、car 都属于 ar 词族——同一组字母读同一个音。点开词卡上的拼读行，跟着读三遍，见词就能读。",
    "tip": "ar 词族",
    "en": "teddy bear",
    "zh": "拼读词族"
   },
   {
    "t": "📝 Pre A1 Starters · Listening Part 3（听音涂色）",
    "kid": "本单元任务：带一件玩具来介绍它。 学完这些词和句型，Pre A1 Starters 的「Listening Part 3（听音涂色）」你就有把握了——考的就是它们。",
    "tip": "Listening Part 3（听音涂色）",
    "en": "kite",
    "zh": "考试重点词"
   },
   {
    "t": "🔬 CLIL · 科学：玩具怎么动",
    "kid": "ball 会 roll（滚），kite 会 fly（飞），robot 会 walk（走）——动的方式不一样，能量来源也不一样。",
    "tip": "CLIL 跨学科",
    "en": "ball",
    "zh": "跨学科链接"
   },
   {
    "t": "💛 素养 · 玩完收好",
    "kid": "玩具玩完送回家——每个玩具都有自己的家，书包和玩具箱就是它们的家。",
    "tip": "社会价值观",
    "en": "ball",
    "zh": "素养成长"
   },
   {
    "t": "🧠 记忆加速",
    "kid": "ball：ball 球家族：basketball、football、volleyball ｜ kite：kite 风筝；kite 也是『鸢』（一种鹰） ｜ doll：doll 娃娃；doll 原指玩偶（前 10 词为课本核心词 ⭐）",
    "tip": "词库记忆法",
    "en": "ball / kite / doll",
    "zh": "记忆加速"
   }
  ],
  "pu1-u8": [
   {
    "t": "🎯 语法聚焦：祈使句 Touch ... / Stand up",
    "kid": "先看例句：Touch your nose, then clap your hands! —— 它用的就是本单元核心「祈使句 Touch ... / Stand up」。本单元任务里就会反复用到：跟着指令做动作（Touch your nose!）。",
    "tip": "祈使句 Touch ... / Stand up",
    "en": "Touch your nose, then clap your hands!",
    "zh": "我的身体会动"
   },
   {
    "t": "🔤 拼读词族：ea（如 ear / head）",
    "kid": "ear、head 都属于 ea 词族——同一组字母读同一个音。点开词卡上的拼读行，跟着读三遍，见词就能读。",
    "tip": "ea 词族",
    "en": "ear",
    "zh": "拼读词族"
   },
   {
    "t": "📝 Pre A1 Starters · Reading & Writing Part 1（看词连线）",
    "kid": "本单元任务：跟着指令做动作（Touch your nose!）。 学完这些词和句型，Pre A1 Starters 的「Reading & Writing Part 1（看词连线）」你就有把握了——考的就是它们。",
    "tip": "Reading & Writing Part 1（看词连线）",
    "en": "ear",
    "zh": "考试重点词"
   },
   {
    "t": "🔬 CLIL · 科学：五官的本领",
    "kid": "eyes 用来 see，ears 用来 hear，nose 用来 smell——每个五官都是身体的小侦探。",
    "tip": "CLIL 跨学科",
    "en": "eye",
    "zh": "跨学科链接"
   },
   {
    "t": "💛 素养 · 团队合作",
    "kid": "Simon says 游戏里有人快有人慢——等一等大家，一起赢才有趣。",
    "tip": "社会价值观",
    "en": "eye",
    "zh": "素养成长"
   },
   {
    "t": "🧠 记忆加速",
    "kid": "eye：eye 眼睛——两只 e 是眼睛，y 是鼻梁 ｜ ear：ear 耳朵——和 hear 同根（用耳朵听） ｜ nose：nose 鼻子——鼻子尖尖（前 10 词为课本核心词 ⭐）",
    "tip": "词库记忆法",
    "en": "eye / ear / nose",
    "zh": "记忆加速"
   }
  ],
  "pu1-u9": [
   {
    "t": "🎯 语法聚焦：Let's ...",
    "kid": "先看例句：Let's go to the park and play! —— 它用的就是本单元核心「Let's ...」。本单元任务里就会反复用到：计划一次公园出游，说说要做什么。",
    "tip": "Let's ...",
    "en": "Let's go to the park and play!",
    "zh": "快乐的出游"
   },
   {
    "t": "🔤 语音拼读：park",
    "kid": "点开本单元词卡的拼读行，按音节把 park 读准，再连读整词。",
    "tip": "见词能读",
    "en": "park",
    "zh": "拼读示范词"
   },
   {
    "t": "📝 Pre A1 Starters · Reading & Writing Part 3（看图选词）",
    "kid": "本单元任务：计划一次公园出游，说说要做什么。 学完这些词和句型，Pre A1 Starters 的「Reading & Writing Part 3（看图选词）」你就有把握了——考的就是它们。",
    "tip": "Reading & Writing Part 3（看图选词）",
    "en": "zoo",
    "zh": "考试重点词"
   },
   {
    "t": "🔬 🌍 CLIL · 社会：公园里的规则",
    "kid": "公园里要排队玩滑梯、不踩草坪、离小狗远一点——规则让每个人都玩得开心。",
    "tip": "CLIL 跨学科",
    "en": "park",
    "zh": "跨学科链接"
   },
   {
    "t": "💛 素养 · 安全第一",
    "kid": "出门玩先告诉大人，跟紧小伙伴——安全是快乐出游的第一条。",
    "tip": "社会价值观",
    "en": "park",
    "zh": "素养成长"
   },
   {
    "t": "🧠 记忆加速",
    "kid": "park：park 公园——来自法语「围起来的猎场」 ｜ zoo：zoo 动物园——zoological garden 的缩写 ｜ playground：play 玩 + ground 场：玩耍的场地（前 10 词为课本核心词 ⭐）",
    "tip": "词库记忆法",
    "en": "park / zoo / playground",
    "zh": "记忆加速"
   }
  ],
  "pu1-r3": [
   {
    "t": "🎯 语法聚焦：复习：have/can/Let's、身体与玩具词",
    "kid": "先看例句：Let's play with my new kite! —— 它用的就是本单元核心「复习：have/can/Let's、身体与玩具词」。本单元任务里就会反复用到：Pre A1 Starters 模拟题：Reading & Writing Part 1-5。",
    "tip": "复习：have/can/Let's、身体与玩具词",
    "en": "Let's play with my new kite!",
    "zh": "复习 7-9"
   },
   {
    "t": "🔤 语音拼读：ball",
    "kid": "点开本单元词卡的拼读行，按音节把 ball 读准，再连读整词。",
    "tip": "见词能读",
    "en": "ball",
    "zh": "拼读词族"
   },
   {
    "t": "📝 Pre A1 Starters · Reading & Writing Part 5（看图填词）",
    "kid": "本单元任务：Pre A1 Starters 模拟题：Reading & Writing Part 1-5。 学完这些词和句型，Pre A1 Starters 的「Reading & Writing Part 5（看图填词）」你就有把握了——考的就是它们。",
    "tip": "Reading & Writing Part 5（看图填词）",
    "en": "kite",
    "zh": "考试重点词"
   },
   {
    "t": "🧠 记忆加速",
    "kid": "ball：ball 球家族：basketball、football、volleyball ｜ kite：kite 风筝；kite 也是『鸢』（一种鹰） ｜ doll：doll 娃娃；doll 原指玩偶",
    "tip": "词库记忆法",
    "en": "ball / kite / doll",
    "zh": "记忆加速"
   }
  ]
 },
 "pu2": {
  "pu2-u1": [
   {
    "t": "🎯 语法聚焦：现在进行时 be+doing（We are reading）",
    "kid": "先看例句：We are reading in the classroom. —— 它用的就是本单元核心「现在进行时 be+doing（We are reading）」。本单元任务里就会反复用到：做一张班级值日表。",
    "tip": "现在进行时 be+doing（We are reading）",
    "en": "We are reading in the classroom.",
    "zh": "回到学校"
   },
   {
    "t": "🔤 拼读词族：ck（如 sticker / blackboard）",
    "kid": "sticker、blackboard 都属于 ck 词族——同一组字母读同一个音。点开词卡上的拼读行，跟着读三遍，见词就能读。",
    "tip": "ck 词族",
    "en": "sticker",
    "zh": "拼读词族"
   },
   {
    "t": "📝 A1 Movers · Listening Part 1（听音连线）",
    "kid": "本单元任务：做一张班级值日表。 学完这些词和句型，A1 Movers 的「Listening Part 1（听音连线）」你就有把握了——考的就是它们。",
    "tip": "Listening Part 1（听音连线）",
    "en": "class",
    "zh": "考试重点词"
   },
   {
    "t": "🔬 🔢 CLIL · 数学：文具分类统计",
    "kid": "把全班的书包文具分类统计：几支笔、几把尺——一张统计表就说清楚了。",
    "tip": "CLIL 跨学科",
    "en": "classroom",
    "zh": "跨学科链接"
   },
   {
    "t": "💛 素养 · 借还礼貌",
    "kid": "借东西先问 May I…?，用完说 thank you——小礼貌换来大朋友。",
    "tip": "社会价值观",
    "en": "classroom",
    "zh": "素养成长"
   },
   {
    "t": "🧠 记忆加速",
    "kid": "classroom：class 班级 + room 房间：班级的房间 = 教室 ｜ class：class 和 classic 同根：class 是班级，classic 是经典 ｜ classmate：class 班 + mate 伴：同班同伴（前 10 词为课本核心词 ⭐）",
    "tip": "词库记忆法",
    "en": "classroom / class / classmate",
    "zh": "记忆加速"
   }
  ],
  "pu2-u2": [
   {
    "t": "🎯 语法聚焦：人称代词主格/形容词性物主代词（he/his, she/her）",
    "kid": "先看例句：This is his bike, and that is her bag. —— 它用的就是本单元核心「人称代词主格/形容词性物主代词（he/his, she/her）」。本单元任务里就会反复用到：描述一位家人的样子。",
    "tip": "人称代词主格/形容词性物主代词（he/his, she/her）",
    "en": "This is his bike, and that is her bag.",
    "zh": "我身边的人"
   },
   {
    "t": "🔤 语音拼读：he",
    "kid": "点开本单元词卡的拼读行，按音节把 he 读准，再连读整词。",
    "tip": "见词能读",
    "en": "he",
    "zh": "拼读示范词"
   },
   {
    "t": "📝 A1 Movers · Listening Part 2（听音填空）",
    "kid": "本单元任务：描述一位家人的样子。 学完这些词和句型，A1 Movers 的「Listening Part 2（听音填空）」你就有把握了——考的就是它们。",
    "tip": "Listening Part 2（听音填空）",
    "en": "she",
    "zh": "考试重点词"
   },
   {
    "t": "🔬 🌍 CLIL · 社会：家庭角色",
    "kid": "每个家庭成员都有自己的角色——有人做饭、有人工作、有人讲故事，家像一个团队。",
    "tip": "CLIL 跨学科",
    "en": "he",
    "zh": "跨学科链接"
   },
   {
    "t": "💛 素养 · 尊重不同",
    "kid": "有的家庭人多、有的家庭人少——每一家都有自己的幸福。",
    "tip": "社会价值观",
    "en": "he",
    "zh": "素养成长"
   },
   {
    "t": "🧠 记忆加速",
    "kid": "he：he 他 → him 他（宾格）→ his 他的，一家三口 ｜ she：she 里的 he 就是『他』，前面加 s 变成『她』 ｜ it：i 小点 + t 小尾巴：指着小猫小狗的小尾巴（前 10 词为课本核心词 ⭐）",
    "tip": "词库记忆法",
    "en": "he / she / it",
    "zh": "记忆加速"
   }
  ],
  "pu2-u3": [
   {
    "t": "🎯 语法聚焦：数字 11-20 的构词（-teen）",
    "kid": "先看例句：There are fifteen books on the desk. —— 它用的就是本单元核心「数字 11-20 的构词（-teen）」。本单元任务里就会反复用到：玩数字接龙，算一算教室里的物品。",
    "tip": "数字 11-20 的构词（-teen）",
    "en": "There are fifteen books on the desk.",
    "zh": "数字到二十"
   },
   {
    "t": "🔤 语音拼读：eleven",
    "kid": "点开本单元词卡的拼读行，按音节把 eleven 读准，再连读整词。",
    "tip": "见词能读",
    "en": "eleven",
    "zh": "拼读示范词"
   },
   {
    "t": "📝 A1 Movers · Reading & Writing Part 2（图片配对）",
    "kid": "本单元任务：玩数字接龙，算一算教室里的物品。 学完这些词和句型，A1 Movers 的「Reading & Writing Part 2（图片配对）」你就有把握了——考的就是它们。",
    "tip": "Reading & Writing Part 2（图片配对）",
    "en": "twelve",
    "zh": "考试重点词"
   },
   {
    "t": "🔬 🔢 CLIL · 数学：20 以内加减",
    "kid": "十五加五是二十，二十减三是十七——数字加加减减就是数学游戏。",
    "tip": "CLIL 跨学科",
    "en": "eleven",
    "zh": "跨学科链接"
   },
   {
    "t": "💛 素养 · 排队不加塞",
    "kid": "玩游戏、领东西都要排队——排队是公平的第一步。",
    "tip": "社会价值观",
    "en": "eleven",
    "zh": "素养成长"
   },
   {
    "t": "🧠 记忆加速",
    "kid": "eleven：eleven 十一；eleven 和 leave（离开）不同源 ｜ twelve：twelve = tw-(二) + elf(余)：二加十 = 十二 ｜ thirteen：three 三 + teen 十：三加十 = 十三（前 10 词为课本核心词 ⭐）",
    "tip": "词库记忆法",
    "en": "eleven / twelve / thirteen",
    "zh": "记忆加速"
   }
  ],
  "pu2-u4": [
   {
    "t": "🎯 语法聚焦：第三人称单数 has/is",
    "kid": "先看例句：The giraffe has a long neck. —— 它用的就是本单元核心「第三人称单数 has/is」。本单元任务里就会反复用到：做一页动物图鉴，写出它们会做什么。",
    "tip": "第三人称单数 has/is",
    "en": "The giraffe has a long neck.",
    "zh": "动物世界"
   },
   {
    "t": "🔤 拼读词族：ee（如 sheep / deer）",
    "kid": "sheep、deer 都属于 ee 词族——同一组字母读同一个音。点开词卡上的拼读行，跟着读三遍，见词就能读。",
    "tip": "ee 词族",
    "en": "sheep",
    "zh": "拼读词族"
   },
   {
    "t": "📝 A1 Movers · Reading & Writing Part 4（看图排序）",
    "kid": "本单元任务：做一页动物图鉴，写出它们会做什么。 学完这些词和句型，A1 Movers 的「Reading & Writing Part 4（看图排序）」你就有把握了——考的就是它们。",
    "tip": "Reading & Writing Part 4（看图排序）",
    "en": "sheep",
    "zh": "考试重点词"
   },
   {
    "t": "🔬 CLIL · 科学：昼行与夜行",
    "kid": "owl 在夜里看得见，eagle 在白天看得远——动物的眼睛跟着它们的生活方式长。",
    "tip": "CLIL 跨学科",
    "en": "cow",
    "zh": "跨学科链接"
   },
   {
    "t": "💛 素养 · 保护野生动物",
    "kid": "野生动物不属于家里的笼子——让它们留在属于它们的大自然里。",
    "tip": "社会价值观",
    "en": "cow",
    "zh": "素养成长"
   },
   {
    "t": "🧠 记忆加速",
    "kid": "cow：cow 奶牛，拟声『哞 moo』；ox 公牛 ｜ sheep：sheep 绵羊，拟声『咩』；复数还是 sheep（不加 s） ｜ giraffe：giraffe 来自阿拉伯语；长颈鹿 giraffe 脖子最长（前 10 词为课本核心词 ⭐）",
    "tip": "词库记忆法",
    "en": "cow / sheep / giraffe",
    "zh": "记忆加速"
   }
  ],
  "pu2-u5": [
   {
    "t": "🎯 语法聚焦：I am wearing ...（现在进行时）",
    "kid": "先看例句：I am wearing a red hat today. —— 它用的就是本单元核心「I am wearing ...（现在进行时）」。本单元任务里就会反复用到：按天气给衣柜分类。",
    "tip": "I am wearing ...（现在进行时）",
    "en": "I am wearing a red hat today.",
    "zh": "我们穿的衣服"
   },
   {
    "t": "🔤 拼读词族：sh（如 shirt / T-shirt）",
    "kid": "shirt、T-shirt、shorts 都属于 sh 词族——同一组字母读同一个音。点开词卡上的拼读行，跟着读三遍，见词就能读。",
    "tip": "sh 词族",
    "en": "shirt",
    "zh": "拼读词族"
   },
   {
    "t": "📝 A1 Movers · Reading & Writing Part 6（完形填空）",
    "kid": "本单元任务：按天气给衣柜分类。 学完这些词和句型，A1 Movers 的「Reading & Writing Part 6（完形填空）」你就有把握了——考的就是它们。",
    "tip": "Reading & Writing Part 6（完形填空）",
    "en": "T-shirt",
    "zh": "考试重点词"
   },
   {
    "t": "🔬 🌍 CLIL · 社会：场合与穿着",
    "kid": "运动会穿 sport shoes，下雨穿 raincoat——不同场合穿不同的衣服，这是生活的智慧。",
    "tip": "CLIL 跨学科",
    "en": "shirt",
    "zh": "跨学科链接"
   },
   {
    "t": "💛 素养 · 自己的事情自己做",
    "kid": "自己穿袜子、自己扣扣子——每学会一样，就长大一点。",
    "tip": "社会价值观",
    "en": "shirt",
    "zh": "素养成长"
   },
   {
    "t": "🧠 记忆加速",
    "kid": "shirt：shirt 和 skirt 是亲兄弟（sh↔sk 音变）：shirt 衬衫穿上面，skirt 短裙穿下面 ｜ T-shirt：T 字形的 T 恤，像字母 T 一样展开两只袖子 ｜ dress：dress 原意是「整理、穿戴」——dress up 就是打扮（前 10 词为课本核心词 ⭐）",
    "tip": "词库记忆法",
    "en": "shirt / T-shirt / dress",
    "zh": "记忆加速"
   }
  ],
  "pu2-u6": [
   {
    "t": "🎯 语法聚焦：some/any",
    "kid": "先看例句：I'd like some chicken soup, please. —— 它用的就是本单元核心「some/any」。本单元任务里就会反复用到：写一张三明治食谱。",
    "tip": "some/any",
    "en": "I'd like some chicken soup, please.",
    "zh": "食物与饮料"
   },
   {
    "t": "🔤 拼读词族：ch（如 chicken / chocolate）",
    "kid": "chicken、chocolate、lunch 都属于 ch 词族——同一组字母读同一个音。点开词卡上的拼读行，跟着读三遍，见词就能读。",
    "tip": "ch 词族",
    "en": "chicken",
    "zh": "拼读词族"
   },
   {
    "t": "📝 A1 Movers · Speaking Part 3（讲故事排序）",
    "kid": "本单元任务：写一张三明治食谱。 学完这些词和句型，A1 Movers 的「Speaking Part 3（讲故事排序）」你就有把握了——考的就是它们。",
    "tip": "Speaking Part 3（讲故事排序）",
    "en": "beef",
    "zh": "考试重点词"
   },
   {
    "t": "🔬 CLIL · 科学：健康餐盘",
    "kid": "健康的餐盘 = 一半蔬菜 + 四分之一主食 + 四分之一蛋白质 + 一杯水。",
    "tip": "CLIL 跨学科",
    "en": "chicken",
    "zh": "跨学科链接"
   },
   {
    "t": "💛 素养 · 餐桌礼仪",
    "kid": "吃饭前说 please，吃完说 thank you——餐桌上的礼貌和美味一样重要。",
    "tip": "社会价值观",
    "en": "chicken",
    "zh": "素养成长"
   },
   {
    "t": "🧠 记忆加速",
    "kid": "chicken：chicken 是老词（古英语 ċīcen），chick 是它的缩略形式——先有 chicken，后有 chick ｜ beef：beef 来自拉丁 bōs（牛），和 bull（公牛）是亲戚。贵族吃肉说法语，农民养牛说英语——所以「牛」和「牛肉」长得不像 ｜ pork：pork 来自法语 porc（猪）——同样，贵族吃肉说法语（pork），农民养猪说英语（pig）（前 10 词为课本核心词 ⭐）",
    "tip": "词库记忆法",
    "en": "chicken / beef / pork",
    "zh": "记忆加速"
   }
  ],
  "pu2-r1": [
   {
    "t": "🎯 语法聚焦：复习：现在进行时、代词、数字 11-20",
    "kid": "先看例句：They are drawing pictures with crayons. —— 它用的就是本单元核心「复习：现在进行时、代词、数字 11-20」。本单元任务里就会反复用到：A1 Movers 题型练：Reading Part 2 配对。",
    "tip": "复习：现在进行时、代词、数字 11-20",
    "en": "They are drawing pictures with crayons.",
    "zh": "复习 1-3"
   },
   {
    "t": "🔤 语音拼读：classroom",
    "kid": "点开本单元词卡的拼读行，按音节把 classroom 读准，再连读整词。",
    "tip": "见词能读",
    "en": "classroom",
    "zh": "拼读示范词"
   },
   {
    "t": "📝 A1 Movers · Listening Part 1（听音连线）",
    "kid": "本单元任务：A1 Movers 题型练：Reading Part 2 配对。 学完这些词和句型，A1 Movers 的「Listening Part 1（听音连线）」你就有把握了——考的就是它们。",
    "tip": "Listening Part 1（听音连线）",
    "en": "scissors",
    "zh": "考试重点词"
   },
   {
    "t": "🧠 记忆加速",
    "kid": "classroom：class 班级 + room 房间：班级的房间 = 教室 ｜ scissors：sc- 常与『切/剪』有关：scissors 剪刀、scrape 刮、scratch 抓 ｜ paper：paper 纸——来自 papyrus（纸莎草）：古埃及人用它当纸",
    "tip": "词库记忆法",
    "en": "classroom / scissors / paper",
    "zh": "记忆加速"
   }
  ],
  "pu2-u7": [
   {
    "t": "🎯 语法聚焦：方位介词 in/on/under/behind/between",
    "kid": "先看例句：The cat is under the table. —— 它用的就是本单元核心「方位介词 in/on/under/behind/between」。本单元任务里就会反复用到：画自己家的平面图并介绍房间。",
    "tip": "方位介词 in/on/under/behind/between",
    "en": "The cat is under the table.",
    "zh": "我的家"
   },
   {
    "t": "🔤 拼读词族：oo（如 door / bedroom）",
    "kid": "door、bedroom、bathroom 都属于 oo 词族——同一组字母读同一个音。点开词卡上的拼读行，跟着读三遍，见词就能读。",
    "tip": "oo 词族",
    "en": "door",
    "zh": "拼读词族"
   },
   {
    "t": "📝 A1 Movers · Listening Part 2（听音填空）",
    "kid": "本单元任务：画自己家的平面图并介绍房间。 学完这些词和句型，A1 Movers 的「Listening Part 2（听音填空）」你就有把握了——考的就是它们。",
    "tip": "Listening Part 2（听音填空）",
    "en": "house",
    "zh": "考试重点词"
   },
   {
    "t": "🔬 🔢 CLIL · 数学：房间里的位置",
    "kid": "用 left/right/under 描述家具位置——说清楚位置，找东西就快。",
    "tip": "CLIL 跨学科",
    "en": "home",
    "zh": "跨学科链接"
   },
   {
    "t": "💛 素养 · 整洁的小房间",
    "kid": "玩具回玩具箱、书回书架——整洁的房间让人心情好。",
    "tip": "社会价值观",
    "en": "home",
    "zh": "素养成长"
   },
   {
    "t": "🧠 记忆加速",
    "kid": "home：home 家——和 hamlet 同源：小小的家的聚落 ｜ house：house 房子——和 hide 同源：让人藏身的地方 ｜ door：door 门——推开门（前 10 词为课本核心词 ⭐）",
    "tip": "词库记忆法",
    "en": "home / house / door",
    "zh": "记忆加速"
   }
  ],
  "pu2-u8": [
   {
    "t": "🎯 语法聚焦：It is + 天气形容词（It's sunny）",
    "kid": "先看例句：It's sunny today, but it's windy now. —— 它用的就是本单元核心「It is + 天气形容词（It's sunny）」。本单元任务里就会反复用到：当一周天气播报员。",
    "tip": "It is + 天气形容词（It's sunny）",
    "en": "It's sunny today, but it's windy now.",
    "zh": "天气与天空"
   },
   {
    "t": "🔤 拼读词族：oo（如 moon / cool）",
    "kid": "moon、cool 都属于 oo 词族——同一组字母读同一个音。点开词卡上的拼读行，跟着读三遍，见词就能读。",
    "tip": "oo 词族",
    "en": "moon",
    "zh": "拼读词族"
   },
   {
    "t": "📝 A1 Movers · Reading & Writing Part 2（图片配对）",
    "kid": "本单元任务：当一周天气播报员。 学完这些词和句型，A1 Movers 的「Reading & Writing Part 2（图片配对）」你就有把握了——考的就是它们。",
    "tip": "Reading & Writing Part 2（图片配对）",
    "en": "moon",
    "zh": "考试重点词"
   },
   {
    "t": "🔬 CLIL · 科学：四季与穿衣",
    "kid": "夏天穿短袖、冬天穿棉衣——天气决定穿衣，这是人和自然的配合。",
    "tip": "CLIL 跨学科",
    "en": "sun",
    "zh": "跨学科链接"
   },
   {
    "t": "💛 素养 · 关心他人冷暖",
    "kid": "天冷提醒朋友加衣——一句关心让人心里暖暖的。",
    "tip": "社会价值观",
    "en": "sun",
    "zh": "素养成长"
   },
   {
    "t": "🧠 记忆加速",
    "kid": "sun：sun 太阳——和拉丁 sōl 同源：solar 太阳的 ｜ moon：moon 月亮——和 month 同源：月亮圆缺一次 = 一个月 ｜ star：star 星星——和拉丁 stella 同源：stellar 星球的（前 10 词为课本核心词 ⭐）",
    "tip": "词库记忆法",
    "en": "sun / moon / star",
    "zh": "记忆加速"
   }
  ],
  "pu2-u9": [
   {
    "t": "🎯 语法聚焦：like + doing（I like swimming）",
    "kid": "先看例句：I like swimming, and I can ride a bike. —— 它用的就是本单元核心「like + doing（I like swimming）」。本单元任务里就会反复用到：设计一场运动会比赛表。",
    "tip": "like + doing（I like swimming）",
    "en": "I like swimming, and I can ride a bike.",
    "zh": "运动与爱好"
   },
   {
    "t": "🔤 语音拼读：football",
    "kid": "点开本单元词卡的拼读行，按音节把 football 读准，再连读整词。",
    "tip": "见词能读",
    "en": "football",
    "zh": "拼读词族"
   },
   {
    "t": "📝 A1 Movers · Reading & Writing Part 4（看图排序）",
    "kid": "本单元任务：设计一场运动会比赛表。 学完这些词和句型，A1 Movers 的「Reading & Writing Part 4（看图排序）」你就有把握了——考的就是它们。",
    "tip": "Reading & Writing Part 4（看图排序）",
    "en": "basketball",
    "zh": "考试重点词"
   },
   {
    "t": "🔬 CLIL · 健康：运动让身体强壮",
    "kid": "running 练腿、swimming 练全身、ball games 练反应——每种运动锻炼的地方不一样。",
    "tip": "CLIL 跨学科",
    "en": "football",
    "zh": "跨学科链接"
   },
   {
    "t": "💛 素养 · 输赢都是朋友",
    "kid": "赢了说 good game，输了也说 good game——会输的小朋友更勇敢。",
    "tip": "社会价值观",
    "en": "football",
    "zh": "素养成长"
   },
   {
    "t": "🧠 记忆加速",
    "kid": "football：foot 脚 + ball 球：用脚踢的球 ｜ basketball：basket 篮 + ball 球：投进篮的球 ｜ ping-pong：ping-pong 是拟声词——乒乒乓乓就是球来回打的声音（前 10 词为课本核心词 ⭐）",
    "tip": "词库记忆法",
    "en": "football / basketball / ping-pong",
    "zh": "记忆加速"
   }
  ],
  "pu2-r2": [
   {
    "t": "🎯 语法聚焦：复习：has/doesn't have、be+doing、Would you like",
    "kid": "先看例句：The cow has four legs and a long tail. —— 它用的就是本单元核心「复习：has/doesn't have、be+doing、Would you like」。本单元任务里就会反复用到：A1 Movers 题型练：Listening Part 3。",
    "tip": "复习：has/doesn't have、be+doing、Would you like",
    "en": "The cow has four legs and a long tail.",
    "zh": "复习 4-6"
   },
   {
    "t": "🔤 拼读词族：ea（如 sweater / breakfast）",
    "kid": "sweater、breakfast、tea 都属于 ea 词族——同一组字母读同一个音。点开词卡上的拼读行，跟着读三遍，见词就能读。",
    "tip": "ea 词族",
    "en": "sweater",
    "zh": "拼读词族"
   },
   {
    "t": "📝 A1 Movers · Reading & Writing Part 6（完形填空）",
    "kid": "本单元任务：A1 Movers 题型练：Listening Part 3。 学完这些词和句型，A1 Movers 的「Reading & Writing Part 6（完形填空）」你就有把握了——考的就是它们。",
    "tip": "Reading & Writing Part 6（完形填空）",
    "en": "giraffe",
    "zh": "考试重点词"
   },
   {
    "t": "🧠 记忆加速",
    "kid": "cow：cow 奶牛，拟声『哞 moo』；ox 公牛 ｜ giraffe：giraffe 来自阿拉伯语；长颈鹿 giraffe 脖子最长 ｜ zebra：zebra 斑马，z 像黑白相间的条纹",
    "tip": "词库记忆法",
    "en": "cow / giraffe / zebra",
    "zh": "记忆加速"
   }
  ],
  "pu2-r3": [
   {
    "t": "🎯 语法聚焦：复习：方位介词、天气、like+doing",
    "kid": "先看例句：It's rainy, so I'm at home with my doll. —— 它用的就是本单元核心「复习：方位介词、天气、like+doing」。本单元任务里就会反复用到：A1 Movers 模拟题：Speaking Part 1-4。",
    "tip": "复习：方位介词、天气、like+doing",
    "en": "It's rainy, so I'm at home with my doll.",
    "zh": "复习 7-9"
   },
   {
    "t": "🔤 拼读词族：oo（如 door / bedroom）",
    "kid": "door、bedroom、football 都属于 oo 词族——同一组字母读同一个音。点开词卡上的拼读行，跟着读三遍，见词就能读。",
    "tip": "oo 词族",
    "en": "door",
    "zh": "拼读词族"
   },
   {
    "t": "📝 A1 Movers · Speaking Part 3（讲故事排序）",
    "kid": "本单元任务：A1 Movers 模拟题：Speaking Part 1-4。 学完这些词和句型，A1 Movers 的「Speaking Part 3（讲故事排序）」你就有把握了——考的就是它们。",
    "tip": "Speaking Part 3（讲故事排序）",
    "en": "window",
    "zh": "考试重点词"
   },
   {
    "t": "🧠 记忆加速",
    "kid": "door：door 门——推开门 ｜ window：window 窗户——wind 风 + eye 眼：风的眼睛 ｜ bed：bed 床——b 像床头、d 像床尾",
    "tip": "词库记忆法",
    "en": "door / window / bed",
    "zh": "记忆加速"
   }
  ]
 },
 "pu3": {
  "pu3-u1": [
   {
    "t": "🎯 语法聚焦：一般现在时三单（-s/-es）",
    "kid": "先看例句：On Monday I have English and art. —— 它用的就是本单元核心「一般现在时三单（-s/-es）」。本单元任务里就会反复用到：做一张周计划表并口述。",
    "tip": "一般现在时三单（-s/-es）",
    "en": "On Monday I have English and art.",
    "zh": "我的一周安排"
   },
   {
    "t": "🔤 拼读词族：ay（如 Monday / Tuesday）",
    "kid": "Monday、Tuesday、Wednesday 都属于 ay 词族——同一组字母读同一个音。点开词卡上的拼读行，跟着读三遍，见词就能读。",
    "tip": "ay 词族",
    "en": "Monday",
    "zh": "拼读词族"
   },
   {
    "t": "📝 A2 Flyers · Listening Part 1（听音连线）",
    "kid": "本单元任务：做一张周计划表并口述。 学完这些词和句型，A2 Flyers 的「Listening Part 1（听音连线）」你就有把握了——考的就是它们。",
    "tip": "Listening Part 1（听音连线）",
    "en": "Tuesday",
    "zh": "考试重点词"
   },
   {
    "t": "🔬 🔢 CLIL · 数学：周计划时间分配",
    "kid": "把一周 168 小时画成一张饼图：睡觉、上课、玩耍各占多少？看看你的时间都去哪了。",
    "tip": "CLIL 跨学科",
    "en": "Monday",
    "zh": "跨学科链接"
   },
   {
    "t": "💛 素养 · 学习与休息平衡",
    "kid": "会安排时间的人既学得好又玩得开心——计划是自己的小管家。",
    "tip": "社会价值观",
    "en": "Monday",
    "zh": "素养成长"
   },
   {
    "t": "🧠 记忆加速",
    "kid": "Monday：Monday = Moon 月亮 + day：月亮日（北欧月亮神 Mani） ｜ Tuesday：Tuesday = Tyr 战神 + day：战神日（北欧战神提尔） ｜ Wednesday：Wednesday = Woden 主神 + day：主神日（w 不发音）（前 10 词为课本核心词 ⭐）",
    "tip": "词库记忆法",
    "en": "Monday / Tuesday / Wednesday",
    "zh": "记忆加速"
   }
  ],
  "pu3-u2": [
   {
    "t": "🎯 语法聚焦：可数/不可数与 a bowl of",
    "kid": "先看例句：I eat bread and eggs for breakfast. —— 它用的就是本单元核心「可数/不可数与 a bowl of」。本单元任务里就会反复用到：开一家小餐馆，写菜单。",
    "tip": "可数/不可数与 a bowl of",
    "en": "I eat bread and eggs for breakfast.",
    "zh": "早餐吃什么"
   },
   {
    "t": "🔤 拼读词族：ch（如 lunch / chopsticks）",
    "kid": "lunch、chopsticks、French fries 都属于 ch 词族——同一组字母读同一个音。点开词卡上的拼读行，跟着读三遍，见词就能读。",
    "tip": "ch 词族",
    "en": "lunch",
    "zh": "拼读词族"
   },
   {
    "t": "📝 A2 Flyers · Listening Part 3（听对话选图）",
    "kid": "本单元任务：开一家小餐馆，写菜单。 学完这些词和句型，A2 Flyers 的「Listening Part 3（听对话选图）」你就有把握了——考的就是它们。",
    "tip": "Listening Part 3（听对话选图）",
    "en": "lunch",
    "zh": "考试重点词"
   },
   {
    "t": "🔬 CLIL · 科学：早餐是发动机的燃料",
    "kid": "睡了一夜，身体的油箱空了——breakfast 就是给大脑加油，不吃早餐上午会没精神。",
    "tip": "CLIL 跨学科",
    "en": "breakfast",
    "zh": "跨学科链接"
   },
   {
    "t": "💛 素养 · 帮家人摆餐具",
    "kid": "吃饭前帮着摆 bowl 和 chopsticks——小小的动作就是大大的关心。",
    "tip": "社会价值观",
    "en": "breakfast",
    "zh": "素养成长"
   },
   {
    "t": "🧠 记忆加速",
    "kid": "breakfast：break 打破 + fast 禁食：打破一夜禁食 ｜ lunch：lunch 原来是 lump（一大块）：午饭就是「一大块」吃下去 ｜ dinner：dinner 来自拉丁「打破禁食」——和 breakfast 是同一个意思，古人一天的主餐（前 10 词为课本核心词 ⭐）",
    "tip": "词库记忆法",
    "en": "breakfast / lunch / dinner",
    "zh": "记忆加速"
   }
  ],
  "pu3-u3": [
   {
    "t": "🎯 语法聚焦：should/shouldn't 表示建议",
    "kid": "先看例句：You should rest and drink lots of water. —— 它用的就是本单元核心「should/shouldn't 表示建议」。本单元任务里就会反复用到：给同学开一张「健康处方」。",
    "tip": "should/shouldn't 表示建议",
    "en": "You should rest and drink lots of water.",
    "zh": "健康的身体"
   },
   {
    "t": "🔤 语音拼读：health",
    "kid": "点开本单元词卡的拼读行，按音节把 health 读准，再连读整词。",
    "tip": "见词能读",
    "en": "health",
    "zh": "拼读示范词"
   },
   {
    "t": "📝 A2 Flyers · Reading & Writing Part 2（完形填空）",
    "kid": "本单元任务：给同学开一张「健康处方」。 学完这些词和句型，A2 Flyers 的「Reading & Writing Part 2（完形填空）」你就有把握了——考的就是它们。",
    "tip": "Reading & Writing Part 2（完形填空）",
    "en": "healthy",
    "zh": "考试重点词"
   },
   {
    "t": "🔬 CLIL · 科学：发烧是身体的战斗",
    "kid": "fever 是身体在和病毒打仗——多喝水多休息，就是给身体派援兵。",
    "tip": "CLIL 跨学科",
    "en": "health",
    "zh": "跨学科链接"
   },
   {
    "t": "💛 素养 · 关心生病的同学",
    "kid": "同学请假了，帮他记笔记、问问好——生病的时候最需要朋友。",
    "tip": "社会价值观",
    "en": "health",
    "zh": "素养成长"
   },
   {
    "t": "🧠 记忆加速",
    "kid": "health：health 和 heal（治愈）同根：健康就是「被治愈」的状态 ｜ healthy：health 健康 + -y ｜ exercise：exercise = ex-（出）+ arcere（阻止）：「去除惰性」→锻炼（前 10 词为课本核心词 ⭐）",
    "tip": "词库记忆法",
    "en": "health / healthy / exercise",
    "zh": "记忆加速"
   }
  ],
  "pu3-u4": [
   {
    "t": "🎯 语法聚焦：一般过去时（规则 -ed）",
    "kid": "先看例句：Yesterday we saw a hippo in the jungle. —— 它用的就是本单元核心「一般过去时（规则 -ed）」。本单元任务里就会反复用到：做一页丛林动物卡片并讲一个短故事。",
    "tip": "一般过去时（规则 -ed）",
    "en": "Yesterday we saw a hippo in the jungle.",
    "zh": "丛林大冒险"
   },
   {
    "t": "🔤 语音拼读：jungle",
    "kid": "点开本单元词卡的拼读行，按音节把 jungle 读准，再连读整词。",
    "tip": "见词能读",
    "en": "jungle",
    "zh": "拼读示范词"
   },
   {
    "t": "📝 A2 Flyers · Reading & Writing Part 5（故事填词）",
    "kid": "本单元任务：做一页丛林动物卡片并讲一个短故事。 学完这些词和句型，A2 Flyers 的「Reading & Writing Part 5（故事填词）」你就有把握了——考的就是它们。",
    "tip": "Reading & Writing Part 5（故事填词）",
    "en": "hippo",
    "zh": "考试重点词"
   },
   {
    "t": "🔬 CLIL · 科学：丛林分层住宅",
    "kid": "丛林是一栋生命大楼：鸟住树冠、猴子住中层、昆虫住地面——每层都住满了房客。",
    "tip": "CLIL 跨学科",
    "en": "jungle",
    "zh": "跨学科链接"
   },
   {
    "t": "💛 素养 · 不打扰野生动物",
    "kid": "看动物用眼睛和相机，不用手和笼子——保持距离就是保护。",
    "tip": "社会价值观",
    "en": "jungle",
    "zh": "素养成长"
   },
   {
    "t": "🧠 记忆加速",
    "kid": "jungle：jungle 来自梵语 jangala（荒地/丛林） ｜ hippo：hippo = hippos（希腊语「马」）+ potamos（河）：河里的马 = 河马 ｜ camel：camel 来自阿拉伯语 jamal（骆驼）——这个词跟着沙漠商队走遍了世界（前 10 词为课本核心词 ⭐）",
    "tip": "词库记忆法",
    "en": "jungle / hippo / camel",
    "zh": "记忆加速"
   }
  ],
  "pu3-r1": [
   {
    "t": "🎯 语法聚焦：复习：三单、should、was/were",
    "kid": "先看例句：Last Friday I was late for class. —— 它用的就是本单元核心「复习：三单、should、was/were」。本单元任务里就会反复用到：A2 Flyers 题型练：Reading Part 4 判断。",
    "tip": "复习：三单、should、was/were",
    "en": "Last Friday I was late for class.",
    "zh": "复习 1-3"
   },
   {
    "t": "🔤 拼读词族：ea（如 early / breakfast）",
    "kid": "early、breakfast、healthy 都属于 ea 词族——同一组字母读同一个音。点开词卡上的拼读行，跟着读三遍，见词就能读。",
    "tip": "ea 词族",
    "en": "early",
    "zh": "拼读词族"
   },
   {
    "t": "📝 A2 Flyers · Reading & Writing Part 7（看图写句）",
    "kid": "本单元任务：A2 Flyers 题型练：Reading Part 4 判断。 学完这些词和句型，A2 Flyers 的「Reading & Writing Part 7（看图写句）」你就有把握了——考的就是它们。",
    "tip": "Reading & Writing Part 7（看图写句）",
    "en": "Friday",
    "zh": "考试重点词"
   },
   {
    "t": "🧠 记忆加速",
    "kid": "Monday：Monday = Moon 月亮 + day：月亮日（北欧月亮神 Mani） ｜ Friday：Friday = Frigg 爱神 + day：爱神日（周末前最后一天） ｜ weekend：week 周 + end 末：一周的末尾",
    "tip": "词库记忆法",
    "en": "Monday / Friday / weekend",
    "zh": "记忆加速"
   }
  ],
  "pu3-u5": [
   {
    "t": "🎯 语法聚焦：Why are you ...? Because ...",
    "kid": "先看例句：I'm excited because we won the race! —— 它用的就是本单元核心「Why are you ...? Because ...」。本单元任务里就会反复用到：做「情绪温度计」并说说原因。",
    "tip": "Why are you ...? Because ...",
    "en": "I'm excited because we won the race!",
    "zh": "情绪与朋友"
   },
   {
    "t": "🔤 语音拼读：happy",
    "kid": "点开本单元词卡的拼读行，按音节把 happy 读准，再连读整词。",
    "tip": "见词能读",
    "en": "happy",
    "zh": "拼读示范词"
   },
   {
    "t": "📝 A2 Flyers · Speaking Part 3（图片讨论）",
    "kid": "本单元任务：做「情绪温度计」并说说原因。 学完这些词和句型，A2 Flyers 的「Speaking Part 3（图片讨论）」你就有把握了——考的就是它们。",
    "tip": "Speaking Part 3（图片讨论）",
    "en": "sad",
    "zh": "考试重点词"
   },
   {
    "t": "🔬 🧠 CLIL · 心理健康：说出情绪",
    "kid": "把情绪说出来（I'm sad / I'm excited）是管理情绪的第一步——说出来，就轻松一半。",
    "tip": "CLIL 跨学科",
    "en": "happy",
    "zh": "跨学科链接"
   },
   {
    "t": "💛 素养 · 安慰朋友",
    "kid": "朋友难过时陪着他、听他说——安慰不需要大道理，需要好朋友。",
    "tip": "社会价值观",
    "en": "happy",
    "zh": "素养成长"
   },
   {
    "t": "🧠 记忆加速",
    "kid": "happy：happy 开心——咧嘴笑开了花（来自 hap 运气） ｜ sad：sad 难过——眼泪啪嗒掉 ｜ angry：angry 生气——气得头顶冒烟（前 10 词为课本核心词 ⭐）",
    "tip": "词库记忆法",
    "en": "happy / sad / angry",
    "zh": "记忆加速"
   }
  ],
  "pu3-u6": [
   {
    "t": "🎯 语法聚焦：Where is ...? Go straight / turn left",
    "kid": "先看例句：Turn left at the bank, then go straight. —— 它用的就是本单元核心「Where is ...? Go straight / turn left」。本单元任务里就会反复用到：画一张小镇地图，标出地点并指路。",
    "tip": "Where is ...? Go straight / turn left",
    "en": "Turn left at the bank, then go straight.",
    "zh": "城镇里的地方"
   },
   {
    "t": "🔤 拼读词族：ar（如 park / supermarket）",
    "kid": "park、supermarket、library 都属于 ar 词族——同一组字母读同一个音。点开词卡上的拼读行，跟着读三遍，见词就能读。",
    "tip": "ar 词族",
    "en": "park",
    "zh": "拼读词族"
   },
   {
    "t": "📝 A2 Flyers · Listening Part 1（听音连线）",
    "kid": "本单元任务：画一张小镇地图，标出地点并指路。 学完这些词和句型，A2 Flyers 的「Listening Part 1（听音连线）」你就有把握了——考的就是它们。",
    "tip": "Listening Part 1（听音连线）",
    "en": "zoo",
    "zh": "考试重点词"
   },
   {
    "t": "🔬 🌍 CLIL · 社会：城镇功能分区",
    "kid": "hospital 救人、library 借书、bank 存钱——城镇里每个地方都有自己的工作。",
    "tip": "CLIL 跨学科",
    "en": "park",
    "zh": "跨学科链接"
   },
   {
    "t": "💛 素养 · 公共场所轻声",
    "kid": "图书馆和医院里轻声说话——安静的场所需要每个人守护。",
    "tip": "社会价值观",
    "en": "park",
    "zh": "素养成长"
   },
   {
    "t": "🧠 记忆加速",
    "kid": "park：park 公园——来自法语「围起来的猎场」 ｜ zoo：zoo 动物园——zoological garden 的缩写 ｜ shop：shop 商店——来自古英语「摊位」（前 10 词为课本核心词 ⭐）",
    "tip": "词库记忆法",
    "en": "park / zoo / shop",
    "zh": "记忆加速"
   }
  ],
  "pu3-u7": [
   {
    "t": "🎯 语法聚焦：What does he/she do? 三单问答",
    "kid": "先看例句：My aunt is a pilot, and she flies to Beijing. —— 它用的就是本单元核心「What does he/she do? 三单问答」。本单元任务里就会反复用到：采访一位家人的职业。",
    "tip": "What does he/she do? 三单问答",
    "en": "My aunt is a pilot, and she flies to Beijing.",
    "zh": "人们与职业"
   },
   {
    "t": "🔤 语音拼读：doctor",
    "kid": "点开本单元词卡的拼读行，按音节把 doctor 读准，再连读整词。",
    "tip": "见词能读",
    "en": "doctor",
    "zh": "拼读示范词"
   },
   {
    "t": "📝 A2 Flyers · Listening Part 3（听对话选图）",
    "kid": "本单元任务：采访一位家人的职业。 学完这些词和句型，A2 Flyers 的「Listening Part 3（听对话选图）」你就有把握了——考的就是它们。",
    "tip": "Listening Part 3（听对话选图）",
    "en": "nurse",
    "zh": "考试重点词"
   },
   {
    "t": "🔬 🌍 CLIL · 社会：职业与工具",
    "kid": "pilot 开飞机、writer 用笔、scientist 用实验——每个职业都有自己的工具箱。",
    "tip": "CLIL 跨学科",
    "en": "doctor",
    "zh": "跨学科链接"
   },
   {
    "t": "💛 素养 · 尊重每一种职业",
    "kid": "清洁工让城市干净、农民让餐桌丰盛——每种职业都值得说 thank you。",
    "tip": "社会价值观",
    "en": "doctor",
    "zh": "素养成长"
   },
   {
    "t": "🧠 记忆加速",
    "kid": "doctor：doct- = 教（拉丁 docere）：doctor 原是「教书的学者」，后来才专指看病的医生。document 同根 ｜ nurse：nurse 来自拉丁 nutrire（喂养）——nurse 原是「奶妈」 ｜ driver：drive 开车 + -er 表「人」：开车的人（前 10 词为课本核心词 ⭐）",
    "tip": "词库记忆法",
    "en": "doctor / nurse / driver",
    "zh": "记忆加速"
   }
  ],
  "pu3-u8": [
   {
    "t": "🎯 语法聚焦：there is/there are 的过去式 there was/were",
    "kid": "先看例句：There was a small river near my school. —— 它用的就是本单元核心「there is/there are 的过去式 there was/were」。本单元任务里就会反复用到：做一页自然观察笔记。",
    "tip": "there is/there are 的过去式 there was/were",
    "en": "There was a small river near my school.",
    "zh": "我们身边的自然"
   },
   {
    "t": "🔤 拼读词族：er（如 flower / river）",
    "kid": "flower、river 都属于 er 词族——同一组字母读同一个音。点开词卡上的拼读行，跟着读三遍，见词就能读。",
    "tip": "er 词族",
    "en": "flower",
    "zh": "拼读词族"
   },
   {
    "t": "📝 A2 Flyers · Reading & Writing Part 2（完形填空）",
    "kid": "本单元任务：做一页自然观察笔记。 学完这些词和句型，A2 Flyers 的「Reading & Writing Part 2（完形填空）」你就有把握了——考的就是它们。",
    "tip": "Reading & Writing Part 2（完形填空）",
    "en": "flower",
    "zh": "考试重点词"
   },
   {
    "t": "🔬 CLIL · 科学：河流从哪里来",
    "kid": "河流从 mountain 流向 sea——一路汇集小溪，越流越宽，就像知识越学越多。",
    "tip": "CLIL 跨学科",
    "en": "tree",
    "zh": "跨学科链接"
   },
   {
    "t": "💛 素养 · 爱护自然环境",
    "kid": "不往河里丢垃圾、不摘花折树——大自然的美留给下一个人。",
    "tip": "社会价值观",
    "en": "tree",
    "zh": "素养成长"
   },
   {
    "t": "🧠 记忆加速",
    "kid": "tree：tree 树——和 true 同源：树木坚实可靠 ｜ flower：flower 花——和 flour 亲兄弟：面粉是「花朵的精华」 ｜ river：river 河——来自拉丁「河岸」：河岸在哪河就在哪（前 10 词为课本核心词 ⭐）",
    "tip": "词库记忆法",
    "en": "tree / flower / river",
    "zh": "记忆加速"
   }
  ],
  "pu3-u9": [
   {
    "t": "🎯 语法聚焦：by bus/by train 乘行方式",
    "kid": "先看例句：I go to school by bus with my friends. —— 它用的就是本单元核心「by bus/by train 乘行方式」。本单元任务里就会反复用到：规划一次城市出行路线并说明。",
    "tip": "by bus/by train 乘行方式",
    "en": "I go to school by bus with my friends.",
    "zh": "出行方式"
   },
   {
    "t": "🔤 拼读词族：ai（如 train / airport）",
    "kid": "train、airport 都属于 ai 词族——同一组字母读同一个音。点开词卡上的拼读行，跟着读三遍，见词就能读。",
    "tip": "ai 词族",
    "en": "train",
    "zh": "拼读词族"
   },
   {
    "t": "📝 A2 Flyers · Reading & Writing Part 5（故事填词）",
    "kid": "本单元任务：规划一次城市出行路线并说明。 学完这些词和句型，A2 Flyers 的「Reading & Writing Part 5（故事填词）」你就有把握了——考的就是它们。",
    "tip": "Reading & Writing Part 5（故事填词）",
    "en": "taxi",
    "zh": "考试重点词"
   },
   {
    "t": "🔬 🔢 CLIL · 数学：比较出行时间",
    "kid": "bus 40 分钟，subway 25 分钟——把时间画成条形图，一眼看出哪种更快。",
    "tip": "CLIL 跨学科",
    "en": "bus",
    "zh": "跨学科链接"
   },
   {
    "t": "💛 素养 · 排队上车",
    "kid": "先下后上、排队等候——交通规则让每个人都安全。",
    "tip": "社会价值观",
    "en": "bus",
    "zh": "素养成长"
   },
   {
    "t": "🧠 记忆加速",
    "kid": "bus：bus 公交车——来自拉丁「给所有人的车」 ｜ taxi：taxi 是 taximeter cabriolet 的缩写：taximeter 是「计价器」，按价钱走的车 ｜ train：train 火车——来自拉丁「拉」：拉着一串车厢（前 10 词为课本核心词 ⭐）",
    "tip": "词库记忆法",
    "en": "bus / taxi / train",
    "zh": "记忆加速"
   }
  ],
  "pu3-r2": [
   {
    "t": "🎯 语法聚焦：复习：Why/Because、地点与职业、there was/were",
    "kid": "先看例句：My friend is kind and funny. —— 它用的就是本单元核心「复习：Why/Because、地点与职业、there was/were」。本单元任务里就会反复用到：A2 Flyers 题型练：Listening Part 4。",
    "tip": "复习：Why/Because、地点与职业、there was/were",
    "en": "My friend is kind and funny.",
    "zh": "复习 4-6"
   },
   {
    "t": "🔤 语音拼读：happy",
    "kid": "点开本单元词卡的拼读行，按音节把 happy 读准，再连读整词。",
    "tip": "见词能读",
    "en": "happy",
    "zh": "拼读示范词"
   },
   {
    "t": "📝 A2 Flyers · Reading & Writing Part 7（看图写句）",
    "kid": "本单元任务：A2 Flyers 题型练：Listening Part 4。 学完这些词和句型，A2 Flyers 的「Reading & Writing Part 7（看图写句）」你就有把握了——考的就是它们。",
    "tip": "Reading & Writing Part 7（看图写句）",
    "en": "afraid",
    "zh": "考试重点词"
   },
   {
    "t": "🧠 记忆加速",
    "kid": "happy：happy 开心——咧嘴笑开了花（来自 hap 运气） ｜ afraid：afraid 害怕——心里害怕发抖 ｜ excited：excited = ex-（向外）+ cite（叫）：被「叫」得心向外跳",
    "tip": "词库记忆法",
    "en": "happy / afraid / excited",
    "zh": "记忆加速"
   }
  ],
  "pu3-r3": [
   {
    "t": "🎯 语法聚焦：复习：by+交通、自然词、一般过去时",
    "kid": "先看例句：We went to the museum by subway. —— 它用的就是本单元核心「复习：by+交通、自然词、一般过去时」。本单元任务里就会反复用到：A2 Flyers 模拟题：Reading & Writing Part 6。",
    "tip": "复习：by+交通、自然词、一般过去时",
    "en": "We went to the museum by subway.",
    "zh": "复习 7-9"
   },
   {
    "t": "🔤 拼读词族：ai（如 train / airport）",
    "kid": "train、airport、mountain 都属于 ai 词族——同一组字母读同一个音。点开词卡上的拼读行，跟着读三遍，见词就能读。",
    "tip": "ai 词族",
    "en": "train",
    "zh": "拼读词族"
   },
   {
    "t": "📝 A2 Flyers · Speaking Part 3（图片讨论）",
    "kid": "本单元任务：A2 Flyers 模拟题：Reading & Writing Part 6。 学完这些词和句型，A2 Flyers 的「Speaking Part 3（图片讨论）」你就有把握了——考的就是它们。",
    "tip": "Speaking Part 3（图片讨论）",
    "en": "train",
    "zh": "考试重点词"
   },
   {
    "t": "🧠 记忆加速",
    "kid": "bus：bus 公交车——来自拉丁「给所有人的车」 ｜ train：train 火车——来自拉丁「拉」：拉着一串车厢 ｜ subway：sub（下）+ way（路）：地下铁路",
    "tip": "词库记忆法",
    "en": "bus / train / subway",
    "zh": "记忆加速"
   }
  ]
 },
 "pu4": {
  "pu4-u1": [
   {
    "t": "🎯 语法聚焦：like/love/enjoy + doing",
    "kid": "先看例句：I like art best of all the subjects. —— 它用的就是本单元核心「like/love/enjoy + doing」。本单元任务里就会反复用到：做一张个人课表并排喜好。",
    "tip": "like/love/enjoy + doing",
    "en": "I like art best of all the subjects.",
    "zh": "学校学科"
   },
   {
    "t": "🔤 语音拼读：Chinese",
    "kid": "点开本单元词卡的拼读行，按音节把 Chinese 读准，再连读整词。",
    "tip": "见词能读",
    "en": "Chinese",
    "zh": "拼读示范词"
   },
   {
    "t": "📝 A2 Flyers → A2 Key · Flyers Reading & Writing Part 5（故事填词）",
    "kid": "本单元任务：做一张个人课表并排喜好。 学完这些词和句型，A2 Flyers → A2 Key 的「Flyers Reading & Writing Part 5（故事填词）」你就有把握了——考的就是它们。",
    "tip": "Flyers Reading & Writing Part 5（故事填词）",
    "en": "English",
    "zh": "考试重点词"
   },
   {
    "t": "🔬 🎨 CLIL · 艺术：课程表设计",
    "kid": "给课表配上颜色和图标——信息设计得好看，一眼就能看明白。",
    "tip": "CLIL 跨学科",
    "en": "Chinese",
    "zh": "跨学科链接"
   },
   {
    "t": "💛 素养 · 每科都认真",
    "kid": "不喜欢的科目也要认真——认真是你对所有事的尊重。",
    "tip": "社会价值观",
    "en": "Chinese",
    "zh": "素养成长"
   },
   {
    "t": "🧠 记忆加速",
    "kid": "Chinese：China 中国 + -ese 表「某国的」 ｜ English：England 英格兰 + -ish 表「某国的」 ｜ math：math 是 mathematics 的缩写，来自希腊语 manthanein（学习）——数学就是「学习」的学问（前 10 词为课本核心词 ⭐）",
    "tip": "词库记忆法",
    "en": "Chinese / English / math",
    "zh": "记忆加速"
   }
  ],
  "pu4-u2": [
   {
    "t": "🎯 语法聚焦：in + 月份",
    "kid": "先看例句：My birthday is in April, on the twelfth. —— 它用的就是本单元核心「in + 月份」。本单元任务里就会反复用到：做一张生日日历。",
    "tip": "in + 月份",
    "en": "My birthday is in April, on the twelfth.",
    "zh": "时间与日期"
   },
   {
    "t": "🔤 语音拼读：hour",
    "kid": "点开本单元词卡的拼读行，按音节把 hour 读准，再连读整词。",
    "tip": "见词能读",
    "en": "hour",
    "zh": "拼读示范词"
   },
   {
    "t": "📝 A2 Flyers → A2 Key · Flyers Speaking Part 3（图片讨论）",
    "kid": "本单元任务：做一张生日日历。 学完这些词和句型，A2 Flyers → A2 Key 的「Flyers Speaking Part 3（图片讨论）」你就有把握了——考的就是它们。",
    "tip": "Flyers Speaking Part 3（图片讨论）",
    "en": "minute",
    "zh": "考试重点词"
   },
   {
    "t": "🔬 🔢 CLIL · 数学：日历里的数学",
    "kid": "一年 12 个月 365 天，一个月约 30 天——日历里藏着除法和余数。",
    "tip": "CLIL 跨学科",
    "en": "hour",
    "zh": "跨学科链接"
   },
   {
    "t": "💛 素养 · 守时",
    "kid": "约好的时间就要到——守时的人让每个人都安心。",
    "tip": "社会价值观",
    "en": "hour",
    "zh": "素养成长"
   },
   {
    "t": "🧠 记忆加速",
    "kid": "hour：hour 小时——来自希腊语「时辰」 ｜ minute：minute 分钟——来自拉丁「小的」：小小的时刻 ｜ half：half 一半——一半一半（前 10 词为课本核心词 ⭐）",
    "tip": "词库记忆法",
    "en": "hour / minute / half",
    "zh": "记忆加速"
   }
  ],
  "pu4-u3": [
   {
    "t": "🎯 语法聚焦：the largest/one of the ...（最高级初步）",
    "kid": "先看例句：The whale is the largest animal in the sea. —— 它用的就是本单元核心「the largest/one of the ...（最高级初步）」。本单元任务里就会反复用到：做一张海洋生物海报。",
    "tip": "the largest/one of the ...（最高级初步）",
    "en": "The whale is the largest animal in the sea.",
    "zh": "海洋动物"
   },
   {
    "t": "🔤 拼读词族：sh（如 shark / goldfish）",
    "kid": "shark、goldfish、starfish 都属于 sh 词族——同一组字母读同一个音。点开词卡上的拼读行，跟着读三遍，见词就能读。",
    "tip": "sh 词族",
    "en": "shark",
    "zh": "拼读词族"
   },
   {
    "t": "📝 A2 Flyers → A2 Key · Key Reading & Writing Part 1（标识选择题）",
    "kid": "本单元任务：做一张海洋生物海报。 学完这些词和句型，A2 Flyers → A2 Key 的「Key Reading & Writing Part 1（标识选择题）」你就有把握了——考的就是它们。",
    "tip": "Key Reading & Writing Part 1（标识选择题）",
    "en": "dolphin",
    "zh": "考试重点词"
   },
   {
    "t": "🔬 CLIL · 科学：海洋哺乳动物",
    "kid": "whale 和 dolphin 住在海里却呼吸空气——它们是哺乳动物，要浮上水面换气。",
    "tip": "CLIL 跨学科",
    "en": "whale",
    "zh": "跨学科链接"
   },
   {
    "t": "💛 素养 · 海洋垃圾问题",
    "kid": "塑料袋在海里像水母，海龟会误食——少用一个塑料袋就是救一条生命。",
    "tip": "社会价值观",
    "en": "whale",
    "zh": "素养成长"
   },
   {
    "t": "🧠 记忆加速",
    "kid": "whale：whale 鲸鱼——海里最大的鲸 ｜ dolphin：dolphin 来自希腊语 delphis（海豚） ｜ shark：shark 的词源没有定论（一说与「切」的词根有关）——记住这个词就行，别当规律用（前 10 词为课本核心词 ⭐）",
    "tip": "词库记忆法",
    "en": "whale / dolphin / shark",
    "zh": "记忆加速"
   }
  ],
  "pu4-u4": [
   {
    "t": "🎯 语法聚焦：will 表预测（It will rain）",
    "kid": "先看例句：It will be stormy tomorrow, so take an umbrella. —— 它用的就是本单元核心「will 表预测（It will rain）」。本单元任务里就会反复用到：播报未来三天天气预报。",
    "tip": "will 表预测（It will rain）",
    "en": "It will be stormy tomorrow, so take an umbrella.",
    "zh": "季节与天气"
   },
   {
    "t": "🔤 拼读词族：er（如 summer / weather）",
    "kid": "summer、weather、shower 都属于 er 词族——同一组字母读同一个音。点开词卡上的拼读行，跟着读三遍，见词就能读。",
    "tip": "er 词族",
    "en": "summer",
    "zh": "拼读词族"
   },
   {
    "t": "📝 A2 Flyers → A2 Key · Key Reading & Writing Part 4（完形填空）",
    "kid": "本单元任务：播报未来三天天气预报。 学完这些词和句型，A2 Flyers → A2 Key 的「Key Reading & Writing Part 4（完形填空）」你就有把握了——考的就是它们。",
    "tip": "Key Reading & Writing Part 4（完形填空）",
    "en": "summer",
    "zh": "考试重点词"
   },
   {
    "t": "🔬 CLIL · 科学：水循环",
    "kid": "海面蒸发成云、云变成 rain 落下、雨水流回大海——水一直在旅行，这就是水循环。",
    "tip": "CLIL 跨学科",
    "en": "spring",
    "zh": "跨学科链接"
   },
   {
    "t": "💛 素养 · 提醒家人",
    "kid": "出门前看天气预报，提醒家人带伞——看天气是一种关心。",
    "tip": "社会价值观",
    "en": "spring",
    "zh": "素养成长"
   },
   {
    "t": "🧠 记忆加速",
    "kid": "spring：spring 原意是「跳/涌出」——草木从土里「跳」出来 ｜ summer：summer 夏天——太热了，太阳在头顶猛晒 ｜ autumn：autumn 来自拉丁 autumnus（n 不发音）（前 10 词为课本核心词 ⭐）",
    "tip": "词库记忆法",
    "en": "spring / summer / autumn",
    "zh": "记忆加速"
   }
  ],
  "pu4-u5": [
   {
    "t": "🎯 语法聚焦：have to / has to 表示必须",
    "kid": "先看例句：I have to wash the dishes after dinner. —— 它用的就是本单元核心「have to / has to 表示必须」。本单元任务里就会反复用到：做一张家务轮值表。",
    "tip": "have to / has to 表示必须",
    "en": "I have to wash the dishes after dinner.",
    "zh": "日常与家务"
   },
   {
    "t": "🔤 拼读词族：ch（如 kitchen / watch）",
    "kid": "kitchen、watch 都属于 ch 词族——同一组字母读同一个音。点开词卡上的拼读行，跟着读三遍，见词就能读。",
    "tip": "ch 词族",
    "en": "kitchen",
    "zh": "拼读词族"
   },
   {
    "t": "📝 A2 Flyers → A2 Key · Key Listening Part 2（听对话填空）",
    "kid": "本单元任务：做一张家务轮值表。 学完这些词和句型，A2 Flyers → A2 Key 的「Key Listening Part 2（听对话填空）」你就有把握了——考的就是它们。",
    "tip": "Key Listening Part 2（听对话填空）",
    "en": "clean",
    "zh": "考试重点词"
   },
   {
    "t": "🔬 🔢 CLIL · 数学：家务时间统计",
    "kid": "把一周的家务时间记下来画成图表——数据会告诉你谁做得最多。",
    "tip": "CLIL 跨学科",
    "en": "wash",
    "zh": "跨学科链接"
   },
   {
    "t": "💛 素养 · 家务人人有份",
    "kid": "家是每个人的家——家务不是妈妈一个人的事。",
    "tip": "社会价值观",
    "en": "wash",
    "zh": "素养成长"
   },
   {
    "t": "🧠 记忆加速",
    "kid": "wash：wash 洗——用水洗（w- 水） ｜ clean：clean 干净——擦得干干净净（和 clear 同源） ｜ cook：cook 来自拉丁 coquere（烹调）——cook 做、kitchen 厨房同根（前 10 词为课本核心词 ⭐）",
    "tip": "词库记忆法",
    "en": "wash / clean / cook",
    "zh": "记忆加速"
   }
  ],
  "pu4-u6": [
   {
    "t": "🎯 语法聚焦：be + 性格形容词",
    "kid": "先看例句：She is kind to everyone in our class. —— 它用的就是本单元核心「be + 性格形容词」。本单元任务里就会反复用到：给一位同学写「性格奖状」。",
    "tip": "be + 性格形容词",
    "en": "She is kind to everyone in our class.",
    "zh": "性格与品格"
   },
   {
    "t": "🔤 语音拼读：kind",
    "kid": "点开本单元词卡的拼读行，按音节把 kind 读准，再连读整词。",
    "tip": "见词能读",
    "en": "kind",
    "zh": "拼读示范词"
   },
   {
    "t": "📝 A2 Flyers → A2 Key · Key Speaking Part 2（图片讨论）",
    "kid": "本单元任务：给一位同学写「性格奖状」。 学完这些词和句型，A2 Flyers → A2 Key 的「Key Speaking Part 2（图片讨论）」你就有把握了——考的就是它们。",
    "tip": "Key Speaking Part 2（图片讨论）",
    "en": "brave",
    "zh": "考试重点词"
   },
   {
    "t": "🔬 📖 CLIL · 文学：从行为看性格",
    "kid": "故事里不直接说人物性格——他扶起摔倒的同学，你就知道他很 kind。",
    "tip": "CLIL 跨学科",
    "en": "kind",
    "zh": "跨学科链接"
   },
   {
    "t": "💛 素养 · 发现别人的优点",
    "kid": "每天发现一位同学的一个优点——你也会变成大家最喜欢的同学。",
    "tip": "社会价值观",
    "en": "kind",
    "zh": "素养成长"
   },
   {
    "t": "🧠 记忆加速",
    "kid": "kind：kind 善良——对人好（原意「天性」） ｜ brave：brave 勇敢——小英雄挺身而出 ｜ smart：smart 聪明——小脑瓜聪明（原意「刺痛」）（前 10 词为课本核心词 ⭐）",
    "tip": "词库记忆法",
    "en": "kind / brave / smart",
    "zh": "记忆加速"
   }
  ],
  "pu4-u7": [
   {
    "t": "🎯 语法聚焦：How much is/are ...? too + 形容词（too expensive）",
    "kid": "先看例句：This T-shirt is too expensive for me. —— 它用的就是本单元核心「How much is/are ...? too + 形容词（too expensive）」。本单元任务里就会反复用到：模拟商店买卖对话。",
    "tip": "How much is/are ...? too + 形容词（too expensive）",
    "en": "This T-shirt is too expensive for me.",
    "zh": "金钱与购物"
   },
   {
    "t": "🔤 语音拼读：money",
    "kid": "点开本单元词卡的拼读行，按音节把 money 读准，再连读整词。",
    "tip": "见词能读",
    "en": "money",
    "zh": "拼读示范词"
   },
   {
    "t": "📝 A2 Flyers → A2 Key · Flyers Reading & Writing Part 5（故事填词）",
    "kid": "本单元任务：模拟商店买卖对话。 学完这些词和句型，A2 Flyers → A2 Key 的「Flyers Reading & Writing Part 5（故事填词）」你就有把握了——考的就是它们。",
    "tip": "Flyers Reading & Writing Part 5（故事填词）",
    "en": "price",
    "zh": "考试重点词"
   },
   {
    "t": "🔬 🔢 CLIL · 数学：价格计算",
    "kid": "两件 15 元的东西加起来是多少？找零怎么算？购物是最真实的数学课。",
    "tip": "CLIL 跨学科",
    "en": "money",
    "zh": "跨学科链接"
   },
   {
    "t": "💛 素养 · 理性消费",
    "kid": "买之前问自己：需要，还是想要？想清楚再花钱。",
    "tip": "社会价值观",
    "en": "money",
    "zh": "素养成长"
   },
   {
    "t": "🧠 记忆加速",
    "kid": "money：money 钱——来自拉丁 Moneta（铸钱女神）！ ｜ price：price 来自拉丁 pretium（价值）——precious（珍贵的）同根 ｜ cheap：cheap 来自古英语 cēap（交易/买卖）——cheap 原意是「能买到的」（前 10 词为课本核心词 ⭐）",
    "tip": "词库记忆法",
    "en": "money / price / cheap",
    "zh": "记忆加速"
   }
  ],
  "pu4-u8": [
   {
    "t": "🎯 语法聚焦：be going to 表计划",
    "kid": "先看例句：We are going to the beach by car. —— 它用的就是本单元核心「be going to 表计划」。本单元任务里就会反复用到：设计一次周末旅行计划卡。",
    "tip": "be going to 表计划",
    "en": "We are going to the beach by car.",
    "zh": "旅行与地点"
   },
   {
    "t": "🔤 语音拼读：travel",
    "kid": "点开本单元词卡的拼读行，按音节把 travel 读准，再连读整词。",
    "tip": "见词能读",
    "en": "travel",
    "zh": "拼读示范词"
   },
   {
    "t": "📝 A2 Flyers → A2 Key · Flyers Speaking Part 3（图片讨论）",
    "kid": "本单元任务：设计一次周末旅行计划卡。 学完这些词和句型，A2 Flyers → A2 Key 的「Flyers Speaking Part 3（图片讨论）」你就有把握了——考的就是它们。",
    "tip": "Flyers Speaking Part 3（图片讨论）",
    "en": "trip",
    "zh": "考试重点词"
   },
   {
    "t": "🔬 🌍 CLIL · 地理：海滩是怎么形成的",
    "kid": "海浪把石头打磨了几千年，变成了 sand——beach 是大海的雕刻作品。",
    "tip": "CLIL 跨学科",
    "en": "travel",
    "zh": "跨学科链接"
   },
   {
    "t": "💛 素养 · 旅行环保",
    "kid": "离开沙滩时带走自己的垃圾——把美丽留给下一批游客。",
    "tip": "社会价值观",
    "en": "travel",
    "zh": "素养成长"
   },
   {
    "t": "🧠 记忆加速",
    "kid": "travel：travel 来自法语 travail（辛苦的工作）——travel 原意是「辛苦的旅程」！ ｜ trip：trip 来自法语 tripper（绊倒/快走）——trip 原是「快步走」 ｜ tour：tour 来自拉丁 tornare（转一圈）——tour 就是「转一圈」。tournament 锦标赛同根（前 10 词为课本核心词 ⭐）",
    "tip": "词库记忆法",
    "en": "travel / trip / tour",
    "zh": "记忆加速"
   }
  ],
  "pu4-u9": [
   {
    "t": "🎯 语法聚焦：like/love + doing 复习",
    "kid": "先看例句：There is a concert on TV tonight. —— 它用的就是本单元核心「like/love + doing 复习」。本单元任务里就会反复用到：做一份班级节目单。",
    "tip": "like/love + doing 复习",
    "en": "There is a concert on TV tonight.",
    "zh": "媒体与艺术"
   },
   {
    "t": "🔤 语音拼读：TV",
    "kid": "点开本单元词卡的拼读行，按音节把 TV 读准，再连读整词。",
    "tip": "见词能读",
    "en": "TV",
    "zh": "拼读示范词"
   },
   {
    "t": "📝 A2 Flyers → A2 Key · Key Reading & Writing Part 1（标识选择题）",
    "kid": "本单元任务：做一份班级节目单。 学完这些词和句型，A2 Flyers → A2 Key 的「Key Reading & Writing Part 1（标识选择题）」你就有把握了——考的就是它们。",
    "tip": "Key Reading & Writing Part 1（标识选择题）",
    "en": "phone",
    "zh": "考试重点词"
   },
   {
    "t": "🔬 🎨 CLIL · 艺术：乐器家族",
    "kid": "piano 和 violin 是弦与键的家族——不同乐器振动的方式不同，声音就不同。",
    "tip": "CLIL 跨学科",
    "en": "TV",
    "zh": "跨学科链接"
   },
   {
    "t": "💛 素养 · 尊重表演者",
    "kid": "演出结束再鼓掌，安静听完整首曲子——掌声是最好的赞美。",
    "tip": "社会价值观",
    "en": "TV",
    "zh": "素养成长"
   },
   {
    "t": "🧠 记忆加速",
    "kid": "TV：TV 是 television 的缩写：tele-（远）+ vis（看）：「看远处的东西」 ｜ phone：phone 来自希腊语 phone（声音）——telephone = tele（远）+ phone（声）：远处的声音 ｜ email：e-（电子）+ mail（邮件）（前 10 词为课本核心词 ⭐）",
    "tip": "词库记忆法",
    "en": "TV / phone / email",
    "zh": "记忆加速"
   }
  ],
  "pu4-r1": [
   {
    "t": "🎯 语法聚焦：复习：enjoy+doing、序数词、最高级初步",
    "kid": "先看例句：Science is interesting, but math is hard. —— 它用的就是本单元核心「复习：enjoy+doing、序数词、最高级初步」。本单元任务里就会反复用到：A2 Flyers 收官练 + A2 Key 入门题。",
    "tip": "复习：enjoy+doing、序数词、最高级初步",
    "en": "Science is interesting, but math is hard.",
    "zh": "复习 1-3"
   },
   {
    "t": "🔤 拼读词族：sh（如 English / shark）",
    "kid": "English、shark 都属于 sh 词族——同一组字母读同一个音。点开词卡上的拼读行，跟着读三遍，见词就能读。",
    "tip": "sh 词族",
    "en": "English",
    "zh": "拼读词族"
   },
   {
    "t": "📝 A2 Flyers → A2 Key · Key Reading & Writing Part 4（完形填空）",
    "kid": "本单元任务：A2 Flyers 收官练 + A2 Key 入门题。 学完这些词和句型，A2 Flyers → A2 Key 的「Key Reading & Writing Part 4（完形填空）」你就有把握了——考的就是它们。",
    "tip": "Key Reading & Writing Part 4（完形填空）",
    "en": "math",
    "zh": "考试重点词"
   },
   {
    "t": "🧠 记忆加速",
    "kid": "English：England 英格兰 + -ish 表「某国的」 ｜ math：math 是 mathematics 的缩写，来自希腊语 manthanein（学习）——数学就是「学习」的学问 ｜ science：science 来自拉丁 scire（知道）——science 就是「知道的东西」。conscious（有意识的）同根",
    "tip": "词库记忆法",
    "en": "English / math / science",
    "zh": "记忆加速"
   }
  ],
  "pu4-r2": [
   {
    "t": "🎯 语法聚焦：复习：will、have to、性格形容词",
    "kid": "先看例句：It rained for two hours last night. —— 它用的就是本单元核心「复习：will、have to、性格形容词」。本单元任务里就会反复用到：A2 Key 题型练：Reading Part 2。",
    "tip": "复习：will、have to、性格形容词",
    "en": "It rained for two hours last night.",
    "zh": "复习 4-6"
   },
   {
    "t": "🔤 拼读词族：er（如 summer / temperature）",
    "kid": "summer、temperature 都属于 er 词族——同一组字母读同一个音。点开词卡上的拼读行，跟着读三遍，见词就能读。",
    "tip": "er 词族",
    "en": "summer",
    "zh": "拼读词族"
   },
   {
    "t": "📝 A2 Flyers → A2 Key · Key Listening Part 2（听对话填空）",
    "kid": "本单元任务：A2 Key 题型练：Reading Part 2。 学完这些词和句型，A2 Flyers → A2 Key 的「Key Listening Part 2（听对话填空）」你就有把握了——考的就是它们。",
    "tip": "Key Listening Part 2（听对话填空）",
    "en": "summer",
    "zh": "考试重点词"
   },
   {
    "t": "🧠 记忆加速",
    "kid": "spring：spring 原意是「跳/涌出」——草木从土里「跳」出来 ｜ summer：summer 夏天——太热了，太阳在头顶猛晒 ｜ autumn：autumn 来自拉丁 autumnus（n 不发音）",
    "tip": "词库记忆法",
    "en": "spring / summer / autumn",
    "zh": "记忆加速"
   }
  ],
  "pu4-r3": [
   {
    "t": "🎯 语法聚焦：复习：How much、be going to、媒体与艺术词",
    "kid": "先看例句：The shopping list has ten things on it. —— 它用的就是本单元核心「复习：How much、be going to、媒体与艺术词」。本单元任务里就会反复用到：A2 Key 模拟题：Listening Part 2。",
    "tip": "复习：How much、be going to、媒体与艺术词",
    "en": "The shopping list has ten things on it.",
    "zh": "复习 7-9"
   },
   {
    "t": "🔤 语音拼读：money",
    "kid": "点开本单元词卡的拼读行，按音节把 money 读准，再连读整词。",
    "tip": "见词能读",
    "en": "money",
    "zh": "拼读示范词"
   },
   {
    "t": "📝 A2 Flyers → A2 Key · Key Speaking Part 2（图片讨论）",
    "kid": "本单元任务：A2 Key 模拟题：Listening Part 2。 学完这些词和句型，A2 Flyers → A2 Key 的「Key Speaking Part 2（图片讨论）」你就有把握了——考的就是它们。",
    "tip": "Key Speaking Part 2（图片讨论）",
    "en": "price",
    "zh": "考试重点词"
   },
   {
    "t": "🧠 记忆加速",
    "kid": "money：money 钱——来自拉丁 Moneta（铸钱女神）！ ｜ price：price 来自拉丁 pretium（价值）——precious（珍贵的）同根 ｜ expensive：expensive = ex-（出）+ pens（付）+ -ive：要「付出去」很多的",
    "tip": "词库记忆法",
    "en": "money / price / expensive",
    "zh": "记忆加速"
   }
  ]
 },
 "pu5": {
  "pu5-u1": [
   {
    "t": "🎯 语法聚焦：must/mustn't 表示义务与禁止",
    "kid": "先看例句：We must protect the earth and save water. —— 它用的就是本单元核心「must/mustn't 表示义务与禁止」。本单元任务里就会反复用到：写一份班级环保公约。",
    "tip": "must/mustn't 表示义务与禁止",
    "en": "We must protect the earth and save water.",
    "zh": "自然与环境"
   },
   {
    "t": "🔤 语音拼读：earth",
    "kid": "点开本单元词卡的拼读行，按音节把 earth 读准，再连读整词。",
    "tip": "见词能读",
    "en": "earth",
    "zh": "拼读示范词"
   },
   {
    "t": "📝 A2 Key for Schools · Reading & Writing Part 1（标识选择题）",
    "kid": "本单元任务：写一份班级环保公约。 学完这些词和句型，A2 Key for Schools 的「Reading & Writing Part 1（标识选择题）」你就有把握了——考的就是它们。",
    "tip": "Reading & Writing Part 1（标识选择题）",
    "en": "planet",
    "zh": "考试重点词"
   },
   {
    "t": "🔬 CLIL · 科学：垃圾去哪了",
    "kid": "一个塑料瓶要 450 年才能消失——recycle 让它变成新瓶子，这是垃圾的第二次生命。",
    "tip": "CLIL 跨学科",
    "en": "earth",
    "zh": "跨学科链接"
   },
   {
    "t": "💛 素养 · 随手环保",
    "kid": "随手关灯、自带水杯、双面用纸——环保不是大事，是每天的小事。",
    "tip": "社会价值观",
    "en": "earth",
    "zh": "素养成长"
   },
   {
    "t": "🧠 记忆加速",
    "kid": "earth：earth 地球——泥土/大地 ｜ planet：planet 来自希腊语「游荡的」——行星是「游荡的星」 ｜ space：space 来自拉丁 spatium（空间）（前 10 词为课本核心词 ⭐）",
    "tip": "词库记忆法",
    "en": "earth / planet / space",
    "zh": "记忆加速"
   }
  ],
  "pu5-u2": [
   {
    "t": "🎯 语法聚焦：形状/尺寸形容词排序（a big round …）",
    "kid": "先看例句：This box is heavy but small. —— 它用的就是本单元核心「形状/尺寸形容词排序（a big round …）」。本单元任务里就会反复用到：「神秘物品」描述猜谜游戏。",
    "tip": "形状/尺寸形容词排序（a big round …）",
    "en": "This box is heavy but small.",
    "zh": "描述事物"
   },
   {
    "t": "🔤 拼读词族：ea（如 heavy / easy）",
    "kid": "heavy、easy、clean 都属于 ea 词族——同一组字母读同一个音。点开词卡上的拼读行，跟着读三遍，见词就能读。",
    "tip": "ea 词族",
    "en": "heavy",
    "zh": "拼读词族"
   },
   {
    "t": "📝 A2 Key for Schools · Reading & Writing Part 4（完形填空）",
    "kid": "本单元任务：「神秘物品」描述猜谜游戏。 学完这些词和句型，A2 Key for Schools 的「Reading & Writing Part 4（完形填空）」你就有把握了——考的就是它们。",
    "tip": "Reading & Writing Part 4（完形填空）",
    "en": "square",
    "zh": "考试重点词"
   },
   {
    "t": "🔬 CLIL · 科学：材料属性",
    "kid": "wood 浮在水面、stone 沉下去——材料不同，本领不同，用途就不同。",
    "tip": "CLIL 跨学科",
    "en": "circle",
    "zh": "跨学科链接"
   },
   {
    "t": "💛 素养 · 描述准确",
    "kid": "说清楚「多大、多重、什么做的」——准确的描述是一种诚实。",
    "tip": "社会价值观",
    "en": "circle",
    "zh": "素养成长"
   },
   {
    "t": "🧠 记忆加速",
    "kid": "circle：circle 的词根 circ- = 圆：circle 圆、circus 马戏场（圆形场地）、circulate 循环 ｜ square：square = ex-（完全）+ quadr-（四）：完全四四方方。quadr- = 四：quarter 四分之一 ｜ triangle：tri- = 三：triangle 三角、tricycle 三轮车、triple 三倍（前 10 词为课本核心词 ⭐）",
    "tip": "词库记忆法",
    "en": "circle / square / triangle",
    "zh": "记忆加速"
   }
  ],
  "pu5-u3": [
   {
    "t": "🎯 语法聚焦：How often ...? 频率回答",
    "kid": "先看例句：Exercise keeps you healthy and strong. —— 它用的就是本单元核心「How often ...? 频率回答」。本单元任务里就会反复用到：做一周健康习惯打卡表。",
    "tip": "How often ...? 频率回答",
    "en": "Exercise keeps you healthy and strong.",
    "zh": "健康与习惯"
   },
   {
    "t": "🔤 语音拼读：health",
    "kid": "点开本单元词卡的拼读行，按音节把 health 读准，再连读整词。",
    "tip": "见词能读",
    "en": "health",
    "zh": "拼读示范词"
   },
   {
    "t": "📝 A2 Key for Schools · Reading & Writing Part 6（写便条 25 词）",
    "kid": "本单元任务：做一周健康习惯打卡表。 学完这些词和句型，A2 Key for Schools 的「Reading & Writing Part 6（写便条 25 词）」你就有把握了——考的就是它们。",
    "tip": "Reading & Writing Part 6（写便条 25 词）",
    "en": "healthy",
    "zh": "考试重点词"
   },
   {
    "t": "🔬 CLIL · 科学：习惯与身体",
    "kid": "每天刷牙、按时睡觉、经常锻炼——身体的分数是按天攒出来的。",
    "tip": "CLIL 跨学科",
    "en": "health",
    "zh": "跨学科链接"
   },
   {
    "t": "💛 素养 · 坚持好习惯",
    "kid": "好习惯做一天容易，做一年才厉害——坚持就是你对自己说的话。",
    "tip": "社会价值观",
    "en": "health",
    "zh": "素养成长"
   },
   {
    "t": "🧠 记忆加速",
    "kid": "health：health 和 heal（治愈）同根：健康就是「被治愈」的状态 ｜ healthy：health 健康 + -y ｜ exercise：exercise = ex-（出）+ arcere（阻止）：「去除惰性」→锻炼（前 10 词为课本核心词 ⭐）",
    "tip": "词库记忆法",
    "en": "health / healthy / exercise",
    "zh": "记忆加速"
   }
  ],
  "pu5-u4": [
   {
    "t": "🎯 语法聚焦：祈使指路 Turn left / Go along",
    "kid": "先看例句：Go along this street, then turn right at the corner. —— 它用的就是本单元核心「祈使指路 Turn left / Go along」。本单元任务里就会反复用到：画出从学校到家的路线图。",
    "tip": "祈使指路 Turn left / Go along",
    "en": "Go along this street, then turn right at the corner.",
    "zh": "方向与位置"
   },
   {
    "t": "🔤 语音拼读：map",
    "kid": "点开本单元词卡的拼读行，按音节把 map 读准，再连读整词。",
    "tip": "见词能读",
    "en": "map",
    "zh": "拼读示范词"
   },
   {
    "t": "📝 A2 Key for Schools · Reading & Writing Part 7（看图写短文）",
    "kid": "本单元任务：画出从学校到家的路线图。 学完这些词和句型，A2 Key for Schools 的「Reading & Writing Part 7（看图写短文）」你就有把握了——考的就是它们。",
    "tip": "Reading & Writing Part 7（看图写短文）",
    "en": "east",
    "zh": "考试重点词"
   },
   {
    "t": "🔬 🌍 CLIL · 地理：地图与方向",
    "kid": "上北下南左西右东——看懂地图的人，走到哪都不会迷路。",
    "tip": "CLIL 跨学科",
    "en": "map",
    "zh": "跨学科链接"
   },
   {
    "t": "💛 素养 · 帮助问路的人",
    "kid": "有人问路时，说清楚、有耐心——你曾是找不到路的小孩吗？",
    "tip": "社会价值观",
    "en": "map",
    "zh": "素养成长"
   },
   {
    "t": "🧠 记忆加速",
    "kid": "map：map 是 mappa（布）的缩写——古人把世界画在布上 ｜ east：east 的 e- 表「出」——太阳「出来」的方向 ｜ west：west 就是太阳「落」的方向（前 10 词为课本核心词 ⭐）",
    "tip": "词库记忆法",
    "en": "map / east / west",
    "zh": "记忆加速"
   }
  ],
  "pu5-u5": [
   {
    "t": "🎯 语法聚焦：play the + 乐器（play the piano） vs play + 球类 的区别",
    "kid": "先看例句：She plays the violin in the school band. —— 它用的就是本单元核心「play the + 乐器（play the piano） vs play + 球类 的区别」。本单元任务里就会反复用到：策划一场班级音乐会。",
    "tip": "play the + 乐器（play the piano） vs play + 球类 的区别",
    "en": "She plays the violin in the school band.",
    "zh": "音乐与表演"
   },
   {
    "t": "🔤 语音拼读：piano",
    "kid": "点开本单元词卡的拼读行，按音节把 piano 读准，再连读整词。",
    "tip": "见词能读",
    "en": "piano",
    "zh": "拼读示范词"
   },
   {
    "t": "📝 A2 Key for Schools · Listening Part 2（听对话填空）",
    "kid": "本单元任务：策划一场班级音乐会。 学完这些词和句型，A2 Key for Schools 的「Listening Part 2（听对话填空）」你就有把握了——考的就是它们。",
    "tip": "Listening Part 2（听对话填空）",
    "en": "guitar",
    "zh": "考试重点词"
   },
   {
    "t": "🔬 🔢 CLIL · 数学：节拍里的分数",
    "kid": "一个音拍 1 拍，半个音拍 1/2 拍——音乐里的节奏就是数学的分数。",
    "tip": "CLIL 跨学科",
    "en": "piano",
    "zh": "跨学科链接"
   },
   {
    "t": "💛 素养 · 练习需要坚持",
    "kid": "台上一分钟，台下十年功——每一次练习都在靠近舞台。",
    "tip": "社会价值观",
    "en": "piano",
    "zh": "素养成长"
   },
   {
    "t": "🧠 记忆加速",
    "kid": "piano：piano 来自意大利语 pianoforte（轻和响）——钢琴能「轻能响」！ ｜ guitar：guitar 来自希腊语 kithara（琴） ｜ violin：violin 来自意大利语 viola 的「小」版——violin 小提琴（前 10 词为课本核心词 ⭐）",
    "tip": "词库记忆法",
    "en": "piano / guitar / violin",
    "zh": "记忆加速"
   }
  ],
  "pu5-u6": [
   {
    "t": "🎯 语法聚焦：邮件格式 Dear ... / Best wishes",
    "kid": "先看例句：I sent you an email with a photo. —— 它用的就是本单元核心「邮件格式 Dear ... / Best wishes」。本单元任务里就会反复用到：写一封 50 词的英文邮件。",
    "tip": "邮件格式 Dear ... / Best wishes",
    "en": "I sent you an email with a photo.",
    "zh": "通讯与媒体"
   },
   {
    "t": "🔤 语音拼读：phone",
    "kid": "点开本单元词卡的拼读行，按音节把 phone 读准，再连读整词。",
    "tip": "见词能读",
    "en": "phone",
    "zh": "拼读示范词"
   },
   {
    "t": "📝 A2 Key for Schools · Speaking Part 2（图片讨论）",
    "kid": "本单元任务：写一封 50 词的英文邮件。 学完这些词和句型，A2 Key for Schools 的「Speaking Part 2（图片讨论）」你就有把握了——考的就是它们。",
    "tip": "Speaking Part 2（图片讨论）",
    "en": "email",
    "zh": "考试重点词"
   },
   {
    "t": "🔬 💻 CLIL · 信息：邮件的结构",
    "kid": "一封邮件 = 收件人 + 主题 + 正文 + 结尾——结构清楚，别人一看就懂。",
    "tip": "CLIL 跨学科",
    "en": "phone",
    "zh": "跨学科链接"
   },
   {
    "t": "💛 素养 · 回消息是礼貌",
    "kid": "收到消息及时回复——让别人等待是小事，也是大事。",
    "tip": "社会价值观",
    "en": "phone",
    "zh": "素养成长"
   },
   {
    "t": "🧠 记忆加速",
    "kid": "phone：phone 来自希腊语 phone（声音）——telephone = tele（远）+ phone（声）：远处的声音 ｜ email：e-（电子）+ mail（邮件） ｜ message：message 来自拉丁 mittere（送）——message 就是「送出去的话」。missile 导弹同根（前 10 词为课本核心词 ⭐）",
    "tip": "词库记忆法",
    "en": "phone / email / message",
    "zh": "记忆加速"
   }
  ],
  "pu5-u7": [
   {
    "t": "🎯 语法聚焦：want to be / hope to do",
    "kid": "先看例句：My dream is to go to college and study science. —— 它用的就是本单元核心「want to be / hope to do」。本单元任务里就会反复用到：「二十年后的我」演讲卡。",
    "tip": "want to be / hope to do",
    "en": "My dream is to go to college and study science.",
    "zh": "职业与梦想"
   },
   {
    "t": "🔤 语音拼读：job",
    "kid": "点开本单元词卡的拼读行，按音节把 job 读准，再连读整词。",
    "tip": "见词能读",
    "en": "job",
    "zh": "拼读示范词"
   },
   {
    "t": "📝 A2 Key for Schools · Reading & Writing Part 1（标识选择题）",
    "kid": "本单元任务：「二十年后的我」演讲卡。 学完这些词和句型，A2 Key for Schools 的「Reading & Writing Part 1（标识选择题）」你就有把握了——考的就是它们。",
    "tip": "Reading & Writing Part 1（标识选择题）",
    "en": "dream",
    "zh": "考试重点词"
   },
   {
    "t": "🔬 🌍 CLIL · 社会：职业学习路径",
    "kid": "想当 scientist 就要先学好 science 和 math——每个梦想都有一条通向它的路。",
    "tip": "CLIL 跨学科",
    "en": "job",
    "zh": "跨学科链接"
   },
   {
    "t": "💛 素养 · 尊重每个梦想",
    "kid": "有人想当 pilot，有人想当 vet——每个认真的梦想都值得鼓掌。",
    "tip": "社会价值观",
    "en": "job",
    "zh": "素养成长"
   },
   {
    "t": "🧠 记忆加速",
    "kid": "job：job 的原意是「一块/一项工作」——job 就是「一件活儿」 ｜ dream：dream 原意是「欢乐/音乐」——后来才指「梦」 ｜ goal：goal 原是「终点线」（古英语 gal 界限）（前 10 词为课本核心词 ⭐）",
    "tip": "词库记忆法",
    "en": "job / dream / goal",
    "zh": "记忆加速"
   }
  ],
  "pu5-u8": [
   {
    "t": "🎯 语法聚焦：both/and 与 but/however 的对比句式",
    "kid": "先看例句：Both festivals are about family and food. —— 它用的就是本单元核心「both/and 与 but/however 的对比句式」。本单元任务里就会反复用到：对比中外一个节日的异同。",
    "tip": "both/and 与 but/however 的对比句式",
    "en": "Both festivals are about family and food.",
    "zh": "节日与文化"
   },
   {
    "t": "🔤 语音拼读：festival",
    "kid": "点开本单元词卡的拼读行，按音节把 festival 读准，再连读整词。",
    "tip": "见词能读",
    "en": "festival",
    "zh": "拼读示范词"
   },
   {
    "t": "📝 A2 Key for Schools · Reading & Writing Part 4（完形填空）",
    "kid": "本单元任务：对比中外一个节日的异同。 学完这些词和句型，A2 Key for Schools 的「Reading & Writing Part 4（完形填空）」你就有把握了——考的就是它们。",
    "tip": "Reading & Writing Part 4（完形填空）",
    "en": "Christmas",
    "zh": "考试重点词"
   },
   {
    "t": "🔬 🌍 CLIL · 社会：节日比较表",
    "kid": "春节和 Christmas 都吃团圆饭——把两个节日做成对比表，异同一目了然。",
    "tip": "CLIL 跨学科",
    "en": "festival",
    "zh": "跨学科链接"
   },
   {
    "t": "💛 素养 · 了解别人的文化",
    "kid": "别人的节日你不必过，但要懂得尊重——了解让人成为好朋友。",
    "tip": "社会价值观",
    "en": "festival",
    "zh": "素养成长"
   },
   {
    "t": "🧠 记忆加速",
    "kid": "festival：festival 来自拉丁 festum（节日） ｜ Christmas：Christ 基督 + mas 弥撒：基督的弥撒 ｜ present：present = pre-（前）+ sent（在）：「放在前面」的东西 = 礼物（前 10 词为课本核心词 ⭐）",
    "tip": "词库记忆法",
    "en": "festival / Christmas / present",
    "zh": "记忆加速"
   }
  ],
  "pu5-u9": [
   {
    "t": "🎯 语法聚焦：people in + 国家",
    "kid": "先看例句：People in France speak French. —— 它用的就是本单元核心「people in + 国家」。本单元任务里就会反复用到：做一张世界旅行护照手册。",
    "tip": "people in + 国家",
    "en": "People in France speak French.",
    "zh": "国家与旅行"
   },
   {
    "t": "🔤 语音拼读：country",
    "kid": "点开本单元词卡的拼读行，按音节把 country 读准，再连读整词。",
    "tip": "见词能读",
    "en": "country",
    "zh": "拼读示范词"
   },
   {
    "t": "📝 A2 Key for Schools · Reading & Writing Part 6（写便条 25 词）",
    "kid": "本单元任务：做一张世界旅行护照手册。 学完这些词和句型，A2 Key for Schools 的「Reading & Writing Part 6（写便条 25 词）」你就有把握了——考的就是它们。",
    "tip": "Reading & Writing Part 6（写便条 25 词）",
    "en": "world",
    "zh": "考试重点词"
   },
   {
    "t": "🔬 🌍 CLIL · 地理：国家与首都",
    "kid": "China—Beijing、France—Paris、Japan—Tokyo——国家与首都像钥匙和锁，一一配对。",
    "tip": "CLIL 跨学科",
    "en": "country",
    "zh": "跨学科链接"
   },
   {
    "t": "💛 素养 · 世界很大，去看看",
    "kid": "学好英语就是带上世界的钥匙——它能打开更多的大门。",
    "tip": "社会价值观",
    "en": "country",
    "zh": "素养成长"
   },
   {
    "t": "🧠 记忆加速",
    "kid": "country：country = contra（对面）+ -ry：「对面的那片地」，和 contrast（对比）同根 ｜ world：world = wer（人）+ old（时代）：「人的时代」就是世界 ｜ language：lingu- = 舌/语言：language 语言、linguistics 语言学、bilingual 双语（前 10 词为课本核心词 ⭐）",
    "tip": "词库记忆法",
    "en": "country / world / language",
    "zh": "记忆加速"
   }
  ],
  "pu5-r1": [
   {
    "t": "🎯 语法聚焦：复习：must/mustn't、描述事物、How often",
    "kid": "先看例句：Rubbish in the sea is bad for fish and whales. —— 它用的就是本单元核心「复习：must/mustn't、描述事物、How often」。本单元任务里就会反复用到：A2 Key 题型练：Reading Part 3。",
    "tip": "复习：must/mustn't、描述事物、How often",
    "en": "Rubbish in the sea is bad for fish and whales.",
    "zh": "复习 1-3"
   },
   {
    "t": "🔤 语音拼读：earth",
    "kid": "点开本单元词卡的拼读行，按音节把 earth 读准，再连读整词。",
    "tip": "见词能读",
    "en": "earth",
    "zh": "拼读示范词"
   },
   {
    "t": "📝 A2 Key for Schools · Reading & Writing Part 7（看图写短文）",
    "kid": "本单元任务：A2 Key 题型练：Reading Part 3。 学完这些词和句型，A2 Key for Schools 的「Reading & Writing Part 7（看图写短文）」你就有把握了——考的就是它们。",
    "tip": "Reading & Writing Part 7（看图写短文）",
    "en": "space",
    "zh": "考试重点词"
   },
   {
    "t": "🧠 记忆加速",
    "kid": "earth：earth 地球——泥土/大地 ｜ space：space 来自拉丁 spatium（空间） ｜ plant：plant 来自拉丁 planta（脚掌/插枝）——plant 原是「插进土里的枝」",
    "tip": "词库记忆法",
    "en": "earth / space / plant",
    "zh": "记忆加速"
   }
  ],
  "pu5-r2": [
   {
    "t": "🎯 语法聚焦：复习：祈使指路、play the+乐器、邮件格式",
    "kid": "先看例句：A square has four sides, but a circle has none. —— 它用的就是本单元核心「复习：祈使指路、play the+乐器、邮件格式」。本单元任务里就会反复用到：A2 Key 题型练：Writing Part 6 便条。",
    "tip": "复习：祈使指路、play the+乐器、邮件格式",
    "en": "A square has four sides, but a circle has none.",
    "zh": "复习 4-6"
   },
   {
    "t": "🔤 语音拼读：map",
    "kid": "点开本单元词卡的拼读行，按音节把 map 读准，再连读整词。",
    "tip": "见词能读",
    "en": "map",
    "zh": "拼读词族"
   },
   {
    "t": "📝 A2 Key for Schools · Listening Part 2（听对话填空）",
    "kid": "本单元任务：A2 Key 题型练：Writing Part 6 便条。 学完这些词和句型，A2 Key for Schools 的「Listening Part 2（听对话填空）」你就有把握了——考的就是它们。",
    "tip": "Listening Part 2（听对话填空）",
    "en": "south",
    "zh": "考试重点词"
   },
   {
    "t": "🧠 记忆加速",
    "kid": "map：map 是 mappa（布）的缩写——古人把世界画在布上 ｜ south：south 和 sun 同源——南边是太阳多、暖和的方向 ｜ direction：direction = di-（分开）+ reg（直）+ -ion：「指引着直走」。reg- = 直/王：correct 正确、regal 帝王的",
    "tip": "词库记忆法",
    "en": "map / south / direction",
    "zh": "记忆加速"
   }
  ],
  "pu5-r3": [
   {
    "t": "🎯 语法聚焦：复习：want to be、both/however、国家与语言",
    "kid": "先看例句：My goal is to pass the exam this year. —— 它用的就是本单元核心「复习：want to be、both/however、国家与语言」。本单元任务里就会反复用到：A2 Key 模拟题：Speaking Part 2。",
    "tip": "复习：want to be、both/however、国家与语言",
    "en": "My goal is to pass the exam this year.",
    "zh": "复习 7-9"
   },
   {
    "t": "🔤 语音拼读：job",
    "kid": "点开本单元词卡的拼读行，按音节把 job 读准，再连读整词。",
    "tip": "见词能读",
    "en": "job",
    "zh": "拼读示范词"
   },
   {
    "t": "📝 A2 Key for Schools · Speaking Part 2（图片讨论）",
    "kid": "本单元任务：A2 Key 模拟题：Speaking Part 2。 学完这些词和句型，A2 Key for Schools 的「Speaking Part 2（图片讨论）」你就有把握了——考的就是它们。",
    "tip": "Speaking Part 2（图片讨论）",
    "en": "dream",
    "zh": "考试重点词"
   },
   {
    "t": "🧠 记忆加速",
    "kid": "job：job 的原意是「一块/一项工作」——job 就是「一件活儿」 ｜ dream：dream 原意是「欢乐/音乐」——后来才指「梦」 ｜ goal：goal 原是「终点线」（古英语 gal 界限）",
    "tip": "词库记忆法",
    "en": "job / dream / goal",
    "zh": "记忆加速"
   }
  ]
 },
 "pu6": {
  "pu6-u1": [
   {
    "t": "🎯 语法聚焦：一般将来 will/going to 复习",
    "kid": "先看例句：Learning English takes practice every day. —— 它用的就是本单元核心「一般将来 will/going to 复习」。本单元任务里就会反复用到：写 5 条「高效学习法」清单。",
    "tip": "一般将来 will/going to 复习",
    "en": "Learning English takes practice every day.",
    "zh": "学会学习"
   },
   {
    "t": "🔤 语音拼读：learn",
    "kid": "点开本单元词卡的拼读行，按音节把 learn 读准，再连读整词。",
    "tip": "见词能读",
    "en": "learn",
    "zh": "拼读示范词"
   },
   {
    "t": "📝 B1 Preliminary for Schools · Reading Part 1（理解短讯）",
    "kid": "本单元任务：写 5 条「高效学习法」清单。 学完这些词和句型，B1 Preliminary for Schools 的「Reading Part 1（理解短讯）」你就有把握了——考的就是它们。",
    "tip": "Reading Part 1（理解短讯）",
    "en": "teach",
    "zh": "考试重点词"
   },
   {
    "t": "🔬 🧠 CLIL · 心理学：遗忘曲线",
    "kid": "学完 20 分钟忘 40%，一天后忘 70%——review 就是把忘记的东西抢回来。",
    "tip": "CLIL 跨学科",
    "en": "learn",
    "zh": "跨学科链接"
   },
   {
    "t": "💛 素养 · 复述是最好的学习",
    "kid": "把学到的讲给别人听——能讲明白，才是真的懂了。",
    "tip": "社会价值观",
    "en": "learn",
    "zh": "素养成长"
   },
   {
    "t": "🧠 记忆加速",
    "kid": "learn：learn 和 lore（知识）同源：学到的就是 lore ｜ teach：teach 原意是「展示」——teacher 就是「展示给你看的人」 ｜ understand：understand = under + stand（置身其中）——「钻进去」才能理解（前 10 词为课本核心词 ⭐）",
    "tip": "词库记忆法",
    "en": "learn / teach / understand",
    "zh": "记忆加速"
   }
  ],
  "pu6-u2": [
   {
    "t": "🎯 语法聚焦：must/have to/need to 的强弱",
    "kid": "先看例句：Everyone must follow the school rules. —— 它用的就是本单元核心「must/have to/need to 的强弱」。本单元任务里就会反复用到：为学校写三条新规则并说明理由。",
    "tip": "must/have to/need to 的强弱",
    "en": "Everyone must follow the school rules.",
    "zh": "社区与规则"
   },
   {
    "t": "🔤 拼读词族：ou（如 group / neighbour）",
    "kid": "group、neighbour 都属于 ou 词族——同一组字母读同一个音。点开词卡上的拼读行，跟着读三遍，见词就能读。",
    "tip": "ou 词族",
    "en": "group",
    "zh": "拼读词族"
   },
   {
    "t": "📝 B1 Preliminary for Schools · Reading Part 3（人物观点配对）",
    "kid": "本单元任务：为学校写三条新规则并说明理由。 学完这些词和句型，B1 Preliminary for Schools 的「Reading Part 3（人物观点配对）」你就有把握了——考的就是它们。",
    "tip": "Reading Part 3（人物观点配对）",
    "en": "law",
    "zh": "考试重点词"
   },
   {
    "t": "🔬 🌍 CLIL · 社会：规则如何保护大家",
    "kid": "traffic rules 让马路安全、class rules 让课堂安静——规则不是限制，是保护。",
    "tip": "CLIL 跨学科",
    "en": "rule",
    "zh": "跨学科链接"
   },
   {
    "t": "💛 素养 · 规则面前的公平",
    "kid": "规则对每个人都一样——不因为关系好就不遵守，这才是公平。",
    "tip": "社会价值观",
    "en": "rule",
    "zh": "素养成长"
   },
   {
    "t": "🧠 记忆加速",
    "kid": "rule：rule 来自拉丁 regula（直尺）——reg- = 直！rule 原是「直尺/规矩」 ｜ law：law 来自北欧语 lag（放好的东西）——law 原是「定好的规矩」 ｜ police：police 来自拉丁 polis（城市）——police 就是「城市管理」。politics 政治同根！（前 10 词为课本核心词 ⭐）",
    "tip": "词库记忆法",
    "en": "rule / law / police",
    "zh": "记忆加速"
   }
  ],
  "pu6-u3": [
   {
    "t": "🎯 语法聚焦：be + 形容词 + to do（It's kind of you to ...）",
    "kid": "先看例句：It was brave of him to speak first. —— 它用的就是本单元核心「be + 形容词 + to do（It's kind of you to ...）」。本单元任务里就会反复用到：评选班级「品格之星」并写颁奖词。",
    "tip": "be + 形容词 + to do（It's kind of you to ...）",
    "en": "It was brave of him to speak first.",
    "zh": "品格与价值观"
   },
   {
    "t": "🔤 语音拼读：kind",
    "kid": "点开本单元词卡的拼读行，按音节把 kind 读准，再连读整词。",
    "tip": "见词能读",
    "en": "kind",
    "zh": "拼读示范词"
   },
   {
    "t": "📝 B1 Preliminary for Schools · Writing Part 1（写邮件 100 词）",
    "kid": "本单元任务：评选班级「品格之星」并写颁奖词。 学完这些词和句型，B1 Preliminary for Schools 的「Writing Part 1（写邮件 100 词）」你就有把握了——考的就是它们。",
    "tip": "Writing Part 1（写邮件 100 词）",
    "en": "brave",
    "zh": "考试重点词"
   },
   {
    "t": "🔬 📖 CLIL · 文学：从行为推断性格",
    "kid": "故事不会直接写「他很勇敢」——他第一个冲上去，你就读懂了。",
    "tip": "CLIL 跨学科",
    "en": "kind",
    "zh": "跨学科链接"
   },
   {
    "t": "💛 素养 · 看见别人的努力",
    "kid": "夸奖别人的努力而不只是聪明——努力是每个人都拥有的力量。",
    "tip": "社会价值观",
    "en": "kind",
    "zh": "素养成长"
   },
   {
    "t": "🧠 记忆加速",
    "kid": "kind：kind 善良——对人好（原意「天性」） ｜ brave：brave 勇敢——小英雄挺身而出 ｜ smart：smart 聪明——小脑瓜聪明（原意「刺痛」）（前 10 词为课本核心词 ⭐）",
    "tip": "词库记忆法",
    "en": "kind / brave / smart",
    "zh": "记忆加速"
   }
  ],
  "pu6-u4": [
   {
    "t": "🎯 语法聚焦：比较级 + than 的论证句式",
    "kid": "先看例句：Phones are cheaper than before, and screens are bigger. —— 它用的就是本单元核心「比较级 + than 的论证句式」。本单元任务里就会反复用到：辩论「屏幕时间」利与弊。",
    "tip": "比较级 + than 的论证句式",
    "en": "Phones are cheaper than before, and screens are bigger.",
    "zh": "科技与媒体"
   },
   {
    "t": "🔤 语音拼读：computer",
    "kid": "点开本单元词卡的拼读行，按音节把 computer 读准，再连读整词。",
    "tip": "见词能读",
    "en": "computer",
    "zh": "拼读示范词"
   },
   {
    "t": "📝 B1 Preliminary for Schools · Listening Part 3（听独白判断）",
    "kid": "本单元任务：辩论「屏幕时间」利与弊。 学完这些词和句型，B1 Preliminary for Schools 的「Listening Part 3（听独白判断）」你就有把握了——考的就是它们。",
    "tip": "Listening Part 3（听独白判断）",
    "en": "phone",
    "zh": "考试重点词"
   },
   {
    "t": "🔬 CLIL · 科学：技术迭代",
    "kid": "手机从大砖头变成小屏幕，十年一小变——技术的进步是一代代人攒出来的。",
    "tip": "CLIL 跨学科",
    "en": "computer",
    "zh": "跨学科链接"
   },
   {
    "t": "💛 素养 · 屏幕时间管理",
    "kid": "屏幕是好工具也是时间黑洞——定好时间，做完该做的事再玩。",
    "tip": "社会价值观",
    "en": "computer",
    "zh": "素养成长"
   },
   {
    "t": "🧠 记忆加速",
    "kid": "computer：computer = compute（计算）+ -er（机器）：计算的机器。compute = com + putare ｜ phone：phone 来自希腊语 phone（声音）——telephone = tele（远）+ phone（声）：远处的声音 ｜ TV：TV 是 television 的缩写：tele-（远）+ vis（看）：「看远处的东西」（前 10 词为课本核心词 ⭐）",
    "tip": "词库记忆法",
    "en": "computer / phone / TV",
    "zh": "记忆加速"
   }
  ],
  "pu6-u5": [
   {
    "t": "🎯 语法聚焦：should/shouldn't/ought to 建议",
    "kid": "先看例句：We recycle rubbish so that we protect the earth. —— 它用的就是本单元核心「should/shouldn't/ought to 建议」。本单元任务里就会反复用到：设计一个校园环保项目海报。",
    "tip": "should/shouldn't/ought to 建议",
    "en": "We recycle rubbish so that we protect the earth.",
    "zh": "保护地球"
   },
   {
    "t": "🔤 语音拼读：environment",
    "kid": "点开本单元词卡的拼读行，按音节把 environment 读准，再连读整词。",
    "tip": "见词能读",
    "en": "environment",
    "zh": "拼读示范词"
   },
   {
    "t": "📝 B1 Preliminary for Schools · Speaking Part 3（图片描述）",
    "kid": "本单元任务：设计一个校园环保项目海报。 学完这些词和句型，B1 Preliminary for Schools 的「Speaking Part 3（图片描述）」你就有把握了——考的就是它们。",
    "tip": "Speaking Part 3（图片描述）",
    "en": "pollution",
    "zh": "考试重点词"
   },
   {
    "t": "🔬 CLIL · 科学：循环经济",
    "kid": "一个瓶子 recycle 后变成新瓶子——垃圾是放错位置的资源。",
    "tip": "CLIL 跨学科",
    "en": "environment",
    "zh": "跨学科链接"
   },
   {
    "t": "💛 素养 · 每个人都是一环",
    "kid": "环保不是一个人的大事，是每个人的小事——你也是重要的一环。",
    "tip": "社会价值观",
    "en": "environment",
    "zh": "素养成长"
   },
   {
    "t": "🧠 记忆加速",
    "kid": "environment：environ（围绕）+ -ment：围绕我们的环境 ｜ pollution：pollute（弄脏）+ -ion。pollute 来自拉丁 polluere ｜ rubbish：rubbish 来自古法语 robbe（破布）——rubbish 原是「破烂」（前 10 词为课本核心词 ⭐）",
    "tip": "词库记忆法",
    "en": "environment / pollution / rubbish",
    "zh": "记忆加速"
   }
  ],
  "pu6-u6": [
   {
    "t": "🎯 语法聚焦：used to 表示过去习惯",
    "kid": "先看例句：I used to lose my keys, but not any more. —— 它用的就是本单元核心「used to 表示过去习惯」。本单元任务里就会反复用到：写「我的过去与现在」对比短文。",
    "tip": "used to 表示过去习惯",
    "en": "I used to lose my keys, but not any more.",
    "zh": "时间与变化"
   },
   {
    "t": "🔤 语音拼读：history",
    "kid": "点开本单元词卡的拼读行，按音节把 history 读准，再连读整词。",
    "tip": "见词能读",
    "en": "history",
    "zh": "拼读示范词"
   },
   {
    "t": "📝 B1 Preliminary for Schools · Speaking Part 4（话题讨论）",
    "kid": "本单元任务：写「我的过去与现在」对比短文。 学完这些词和句型，B1 Preliminary for Schools 的「Speaking Part 4（话题讨论）」你就有把握了——考的就是它们。",
    "tip": "Speaking Part 4（话题讨论）",
    "en": "future",
    "zh": "考试重点词"
   },
   {
    "t": "🔬 📖 CLIL · 历史：过去与现在对比",
    "kid": "把「以前的学校」和「现在的学校」列成两栏对比——历史学家的方法你也会用。",
    "tip": "CLIL 跨学科",
    "en": "history",
    "zh": "跨学科链接"
   },
   {
    "t": "💛 素养 · 改变从今天开始",
    "kid": "想变成更好的自己？改变从今天的第一小步开始。",
    "tip": "社会价值观",
    "en": "history",
    "zh": "素养成长"
   },
   {
    "t": "🧠 记忆加速",
    "kid": "history：history 和 story 同源（拉丁 historia）——history 就是「讲出来的故事」 ｜ future：future 来自拉丁 futurus（将要来的） ｜ century：cent- = 百（拉丁 centum）：century 世纪（一百年）、cent 分（百分之一元）（前 10 词为课本核心词 ⭐）",
    "tip": "词库记忆法",
    "en": "history / future / century",
    "zh": "记忆加速"
   }
  ],
  "pu6-u7": [
   {
    "t": "🎯 语法聚焦：if 条件句（真实条件）",
    "kid": "先看例句：If it costs too much, I won't buy it. —— 它用的就是本单元核心「if 条件句（真实条件）」。本单元任务里就会反复用到：做一份零花钱预算表。",
    "tip": "if 条件句（真实条件）",
    "en": "If it costs too much, I won't buy it.",
    "zh": "金钱与选择"
   },
   {
    "t": "🔤 语音拼读：money",
    "kid": "点开本单元词卡的拼读行，按音节把 money 读准，再连读整词。",
    "tip": "见词能读",
    "en": "money",
    "zh": "拼读示范词"
   },
   {
    "t": "📝 B1 Preliminary for Schools · Reading Part 1（理解短讯）",
    "kid": "本单元任务：做一份零花钱预算表。 学完这些词和句型，B1 Preliminary for Schools 的「Reading Part 1（理解短讯）」你就有把握了——考的就是它们。",
    "tip": "Reading Part 1（理解短讯）",
    "en": "price",
    "zh": "考试重点词"
   },
   {
    "t": "🔬 🔢 CLIL · 数学：预算与比较",
    "kid": "零花钱 50 元，东西一共 65 元——超支了怎么办？学会取舍就是预算。",
    "tip": "CLIL 跨学科",
    "en": "money",
    "zh": "跨学科链接"
   },
   {
    "t": "💛 素养 · 需要与想要",
    "kid": "需要的先买，想要的想一想——管好零花钱是管理自己的第一步。",
    "tip": "社会价值观",
    "en": "money",
    "zh": "素养成长"
   },
   {
    "t": "🧠 记忆加速",
    "kid": "money：money 钱——来自拉丁 Moneta（铸钱女神）！ ｜ price：price 来自拉丁 pretium（价值）——precious（珍贵的）同根 ｜ cheap：cheap 来自古英语 cēap（交易/买卖）——cheap 原意是「能买到的」（前 10 词为课本核心词 ⭐）",
    "tip": "词库记忆法",
    "en": "money / price / cheap",
    "zh": "记忆加速"
   }
  ],
  "pu6-u8": [
   {
    "t": "🎯 语法聚焦：一般现在/现在完成的时间标志词对比（ever/never/already）",
    "kid": "先看例句：Have you ever been abroad? I'd love to travel. —— 它用的就是本单元核心「一般现在/现在完成的时间标志词对比（ever/never/already）」。本单元任务里就会反复用到：给外国笔友写一封介绍家乡的信。",
    "tip": "一般现在/现在完成的时间标志词对比（ever/never/already）",
    "en": "Have you ever been abroad? I'd love to travel.",
    "zh": "旅行与文化"
   },
   {
    "t": "🔤 语音拼读：travel",
    "kid": "点开本单元词卡的拼读行，按音节把 travel 读准，再连读整词。",
    "tip": "见词能读",
    "en": "travel",
    "zh": "拼读示范词"
   },
   {
    "t": "📝 B1 Preliminary for Schools · Reading Part 3（人物观点配对）",
    "kid": "本单元任务：给外国笔友写一封介绍家乡的信。 学完这些词和句型，B1 Preliminary for Schools 的「Reading Part 3（人物观点配对）」你就有把握了——考的就是它们。",
    "tip": "Reading Part 3（人物观点配对）",
    "en": "journey",
    "zh": "考试重点词"
   },
   {
    "t": "🔬 🌍 CLIL · 地理：文化多样性",
    "kid": "同一个节日，不同国家有不同过法——差异不是对错，是色彩。",
    "tip": "CLIL 跨学科",
    "en": "travel",
    "zh": "跨学科链接"
   },
   {
    "t": "💛 素养 · 好奇而不评判",
    "kid": "先了解再评价——对世界保持好奇，对差异保持尊重。",
    "tip": "社会价值观",
    "en": "travel",
    "zh": "素养成长"
   },
   {
    "t": "🧠 记忆加速",
    "kid": "travel：travel 来自法语 travail（辛苦的工作）——travel 原意是「辛苦的旅程」！ ｜ journey：journey 来自法语 journée（一天的行程）——journey 原是「一天的路」 ｜ culture：culture 来自拉丁 colere（耕种/照料）——culture 原是「耕种」，后来才指文化！（前 10 词为课本核心词 ⭐）",
    "tip": "词库记忆法",
    "en": "travel / journey / culture",
    "zh": "记忆加速"
   }
  ],
  "pu6-u9": [
   {
    "t": "🎯 语法聚焦：计划表达 plan to / decide to",
    "kid": "先看例句：My goal is to pass the B1 exam this year. —— 它用的就是本单元核心「计划表达 plan to / decide to」。本单元任务里就会反复用到：制定本学期学习目标与行动计划。",
    "tip": "计划表达 plan to / decide to",
    "en": "My goal is to pass the B1 exam this year.",
    "zh": "成功技能"
   },
   {
    "t": "🔤 语音拼读：work",
    "kid": "点开本单元词卡的拼读行，按音节把 work 读准，再连读整词。",
    "tip": "见词能读",
    "en": "work",
    "zh": "拼读示范词"
   },
   {
    "t": "📝 B1 Preliminary for Schools · Writing Part 1（写邮件 100 词）",
    "kid": "本单元任务：制定本学期学习目标与行动计划。 学完这些词和句型，B1 Preliminary for Schools 的「Writing Part 1（写邮件 100 词）」你就有把握了——考的就是它们。",
    "tip": "Writing Part 1（写邮件 100 词）",
    "en": "success",
    "zh": "考试重点词"
   },
   {
    "t": "🔬 🧠 CLIL · 学习科学：刻意练习",
    "kid": "只练会的不够——专挑不会的练，进步最快。",
    "tip": "CLIL 跨学科",
    "en": "work",
    "zh": "跨学科链接"
   },
   {
    "t": "💛 素养 · 努力比天赋更可靠",
    "kid": "聪明是天生的，努力是自己的——努力的人走到哪都发光。",
    "tip": "社会价值观",
    "en": "work",
    "zh": "素养成长"
   },
   {
    "t": "🧠 记忆加速",
    "kid": "work：work 工作——认真干活 ｜ success：suc-（下面）+ cess（走）：「一路走下去」= 成功。cess = 走：process 过程 ｜ fail：fail 来自拉丁 fallere（欺骗）——fail 原是「辜负/欺骗」（前 10 词为课本核心词 ⭐）",
    "tip": "词库记忆法",
    "en": "work / success / fail",
    "zh": "记忆加速"
   }
  ],
  "pu6-r1": [
   {
    "t": "🎯 语法聚焦：复习：动名词主语、must/have to、品格形容词",
    "kid": "先看例句：I never forget my homework now. —— 它用的就是本单元核心「复习：动名词主语、must/have to、品格形容词」。本单元任务里就会反复用到：B1 Preliminary 题型练：Reading Part 3。",
    "tip": "复习：动名词主语、must/have to、品格形容词",
    "en": "I never forget my homework now.",
    "zh": "复习 1-3"
   },
   {
    "t": "🔤 语音拼读：learn",
    "kid": "点开本单元词卡的拼读行，按音节把 learn 读准，再连读整词。",
    "tip": "见词能读",
    "en": "learn",
    "zh": "拼读示范词"
   },
   {
    "t": "📝 B1 Preliminary for Schools · Listening Part 3（听独白判断）",
    "kid": "本单元任务：B1 Preliminary 题型练：Reading Part 3。 学完这些词和句型，B1 Preliminary for Schools 的「Listening Part 3（听独白判断）」你就有把握了——考的就是它们。",
    "tip": "Listening Part 3（听独白判断）",
    "en": "understand",
    "zh": "考试重点词"
   },
   {
    "t": "🧠 记忆加速",
    "kid": "learn：learn 和 lore（知识）同源：学到的就是 lore ｜ understand：understand = under + stand（置身其中）——「钻进去」才能理解 ｜ remember：remember = re-（再）+ member（= memor 记忆）：再回到记忆里。memory 同根",
    "tip": "词库记忆法",
    "en": "learn / understand / remember",
    "zh": "记忆加速"
   }
  ],
  "pu6-r2": [
   {
    "t": "🎯 语法聚焦：复习：比较级论证、should/ought to、used to",
    "kid": "先看例句：Recycling is better than throwing things away. —— 它用的就是本单元核心「复习：比较级论证、should/ought to、used to」。本单元任务里就会反复用到：B1 Preliminary 题型练：Writing Part 2 短文。",
    "tip": "复习：比较级论证、should/ought to、used to",
    "en": "Recycling is better than throwing things away.",
    "zh": "复习 4-6"
   },
   {
    "t": "🔤 语音拼读：computer",
    "kid": "点开本单元词卡的拼读行，按音节把 computer 读准，再连读整词。",
    "tip": "见词能读",
    "en": "computer",
    "zh": "拼读示范词"
   },
   {
    "t": "📝 B1 Preliminary for Schools · Speaking Part 3（图片描述）",
    "kid": "本单元任务：B1 Preliminary 题型练：Writing Part 2 短文。 学完这些词和句型，B1 Preliminary for Schools 的「Speaking Part 3（图片描述）」你就有把握了——考的就是它们。",
    "tip": "Speaking Part 3（图片描述）",
    "en": "screen",
    "zh": "考试重点词"
   },
   {
    "t": "🧠 记忆加速",
    "kid": "computer：computer = compute（计算）+ -er（机器）：计算的机器。compute = com + putare ｜ screen：screen 来自法语 escren（屏风） ｜ video：video 来自拉丁 videre（看）——video 就是「看的」",
    "tip": "词库记忆法",
    "en": "computer / screen / video",
    "zh": "记忆加速"
   }
  ],
  "pu6-r3": [
   {
    "t": "🎯 语法聚焦：复习：if 条件句、ever/never、目标句型",
    "kid": "先看例句：They say practice makes perfect. —— 它用的就是本单元核心「复习：if 条件句、ever/never、目标句型」。本单元任务里就会反复用到：B1 Preliminary 模拟题：Speaking Part 3-4。",
    "tip": "复习：if 条件句、ever/never、目标句型",
    "en": "They say practice makes perfect.",
    "zh": "复习 7-9"
   },
   {
    "t": "🔤 语音拼读：money",
    "kid": "点开本单元词卡的拼读行，按音节把 money 读准，再连读整词。",
    "tip": "见词能读",
    "en": "money",
    "zh": "拼读示范词"
   },
   {
    "t": "📝 B1 Preliminary for Schools · Speaking Part 4（话题讨论）",
    "kid": "本单元任务：B1 Preliminary 模拟题：Speaking Part 3-4。 学完这些词和句型，B1 Preliminary for Schools 的「Speaking Part 4（话题讨论）」你就有把握了——考的就是它们。",
    "tip": "Speaking Part 4（话题讨论）",
    "en": "price",
    "zh": "考试重点词"
   },
   {
    "t": "🧠 记忆加速",
    "kid": "money：money 钱——来自拉丁 Moneta（铸钱女神）！ ｜ price：price 来自拉丁 pretium（价值）——precious（珍贵的）同根 ｜ choice：choice 和 choose 同根：choose 选、choice 选择",
    "tip": "词库记忆法",
    "en": "money / price / choice",
    "zh": "记忆加速"
   }
  ]
 }
};

window.POWERUP_POINTS = POWERUP_POINTS;
