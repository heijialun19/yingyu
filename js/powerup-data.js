/* ============================================================
   剑桥 Power Up 教材系列 · 站点数据 v1.3（2026-11-22 整理）
   由 _pu/build_site_data.js 从上线包重建，勿手改。
   · 6 册 × (9 正课 + 3 复习) = 72 单元 / 967 词，全部来自站内 999 词库
   · 复习单元已按「每 3 单元一次」排序（原包 pu3-pu6 堆在册末）
   · 词图统一取词库 emoji（原包的占位 🐦 已清除；词库为空则走自绘 SVG）
   · 考试对齐：PU1 Pre A1 Starters / PU2 A1 Movers / PU3 A2 Flyers /
              PU4 Flyers→A2 Key / PU5 A2 Key for Schools / PU6 B1 Preliminary
   ============================================================ */
'use strict';
const POWERUP_LEVELS = [
 {
  "id": "pu1",
  "name": "Power Up 1",
  "exam": "Pre A1 Starters",
  "title": "剑桥 Power Up 1（剑桥少儿英语 Pre A1 Starters 备考）",
  "units": [
   {
    "id": "pu1-u1",
    "mod": 1,
    "title": "Unit 1 · Hello, Birdie!",
    "zh": "你好，小鸟！",
    "tip": "本单元任务：和班里每个人打个招呼，学会介绍自己。",
    "grammar": "be 动词 am/is/are；What's your name? / I'm ... / My name is ...",
    "sentences": [
     {
      "en": "I'm Lucy.",
      "zh": "我是露西。"
     },
     {
      "en": "What's your name?",
      "zh": "你叫什么名字？"
     },
     {
      "en": "Nice to meet you!",
      "zh": "很高兴认识你！"
     }
    ],
    "clil": {
     "t": "🔢 CLIL · 数学：字母与排序",
     "kid": "把自己的名字按字母表排序，看看谁的名字排最前——字母有顺序，就像数字一样。"
    },
    "values": {
     "t": "💛 素养 · 有礼貌地打招呼",
     "kid": "见面先说 hello，离开说 goodbye——礼貌的话让每个人都开心。"
    },
    "words": [
     {
      "w": "hello",
      "zh": "你好",
      "e": "👋",
      "reuse": true,
      "core": true
     },
     {
      "w": "hi",
      "zh": "嗨",
      "e": "🙋",
      "reuse": true,
      "core": true
     },
     {
      "w": "goodbye",
      "zh": "再见",
      "e": "🤚",
      "reuse": true,
      "core": true
     },
     {
      "w": "bye",
      "zh": "拜拜",
      "e": "🖐️",
      "reuse": true,
      "core": true
     },
     {
      "w": "good morning",
      "zh": "早上好",
      "e": "🌅",
      "reuse": true,
      "core": true
     },
     {
      "w": "good afternoon",
      "zh": "下午好",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "good night",
      "zh": "晚安",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "thank",
      "zh": "感谢",
      "e": "🙏",
      "reuse": true,
      "core": true
     },
     {
      "w": "please",
      "zh": "请",
      "e": "🤲",
      "reuse": true,
      "core": true
     },
     {
      "w": "OK",
      "zh": "好的",
      "e": "👌",
      "reuse": true,
      "core": true
     },
     {
      "w": "I",
      "zh": "我",
      "e": "",
      "reuse": true
     },
     {
      "w": "you",
      "zh": "你",
      "e": "",
      "reuse": true
     },
     {
      "w": "am",
      "zh": "是(我)",
      "e": "",
      "reuse": true
     },
     {
      "w": "is",
      "zh": "是(他她它)",
      "e": "",
      "reuse": true
     },
     {
      "w": "are",
      "zh": "是(你/我们)",
      "e": "",
      "reuse": true
     },
     {
      "w": "name",
      "zh": "名字",
      "e": "",
      "reuse": true
     }
    ]
   },
   {
    "id": "pu1-u2",
    "mod": 2,
    "title": "Unit 2 · My school bag",
    "zh": "我的书包",
    "tip": "本单元任务：整理自己的书包，说出每样文具。",
    "grammar": "可数名词单复数（+s）；What's this? It's a ...；a/an 的读音判断",
    "sentences": [
     {
      "en": "This is my pen.",
      "zh": "这是我的钢笔。"
     },
     {
      "en": "What's this? It's a ruler.",
      "zh": "这是什么？是尺子。"
     },
     {
      "en": "Put it in your bag, please.",
      "zh": "请把它放进书包。"
     }
    ],
    "clil": {
     "t": "🔢 CLIL · 数学：数一数文具",
     "kid": "数一数书包里有几支笔、几本书——文具是最好的数数教具。"
    },
    "values": {
     "t": "💛 素养 · 爱护文具",
     "kid": "铅笔轻轻放，橡皮不乱丢——爱护文具的小朋友人人喜欢。"
    },
    "words": [
     {
      "w": "school",
      "zh": "学校",
      "e": "🏫",
      "reuse": true,
      "core": true
     },
     {
      "w": "book",
      "zh": "书",
      "e": "📖",
      "reuse": true,
      "core": true
     },
     {
      "w": "pen",
      "zh": "钢笔",
      "e": "🖊️",
      "reuse": true,
      "core": true
     },
     {
      "w": "pencil",
      "zh": "铅笔",
      "e": "✏️",
      "reuse": true,
      "core": true
     },
     {
      "w": "ruler",
      "zh": "尺子",
      "e": "📏",
      "reuse": true,
      "core": true
     },
     {
      "w": "bag",
      "zh": "包",
      "e": "🎒",
      "reuse": true,
      "core": true
     },
     {
      "w": "eraser",
      "zh": "橡皮",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "desk",
      "zh": "课桌",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "chair",
      "zh": "椅子",
      "e": "💺",
      "reuse": true,
      "core": true
     },
     {
      "w": "crayon",
      "zh": "蜡笔",
      "e": "🖍️",
      "reuse": true,
      "core": true
     },
     {
      "w": "pencil-box",
      "zh": "铅笔盒",
      "e": "📦",
      "reuse": true
     },
     {
      "w": "schoolbag",
      "zh": "书包",
      "e": "🎒",
      "reuse": true
     },
     {
      "w": "teacher",
      "zh": "老师",
      "e": "👩‍🏫",
      "reuse": true
     },
     {
      "w": "student",
      "zh": "学生",
      "e": "🎓",
      "reuse": true
     }
    ]
   },
   {
    "id": "pu1-u3",
    "mod": 3,
    "title": "Unit 3 · This is my family",
    "zh": "这是我的家",
    "tip": "本单元任务：画一张全家福并介绍家庭成员。",
    "grammar": "this is ... / these are ...；my/your；he/she 的性别对应",
    "sentences": [
     {
      "en": "This is my mum.",
      "zh": "这是我妈妈。"
     },
     {
      "en": "These are my brothers.",
      "zh": "这是我的哥哥们。"
     },
     {
      "en": "I love my family.",
      "zh": "我爱我的家。"
     }
    ],
    "clil": {
     "t": "🌍 CLIL · 社会：家庭树",
     "kid": "画一棵家庭树：爷爷奶奶在树下，爸爸妈妈在中间，你在树梢——一看就懂谁和谁是一家人。"
    },
    "values": {
     "t": "💛 素养 · 关心家人",
     "kid": "给爷爷奶奶捶捶背，帮爸爸妈妈拿拖鞋——爱要说出来也要做出来。"
    },
    "words": [
     {
      "w": "dad",
      "zh": "爸爸",
      "e": "👨‍👦",
      "reuse": true,
      "core": true
     },
     {
      "w": "mom",
      "zh": "妈妈",
      "e": "👩‍👦",
      "reuse": true,
      "core": true
     },
     {
      "w": "father",
      "zh": "父亲",
      "e": "👨",
      "reuse": true,
      "core": true
     },
     {
      "w": "mother",
      "zh": "母亲",
      "e": "👩",
      "reuse": true,
      "core": true
     },
     {
      "w": "brother",
      "zh": "兄弟",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "sister",
      "zh": "姐妹",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "grandpa",
      "zh": "爷爷",
      "e": "👴",
      "reuse": true,
      "core": true
     },
     {
      "w": "grandma",
      "zh": "奶奶",
      "e": "👵",
      "reuse": true,
      "core": true
     },
     {
      "w": "family",
      "zh": "家",
      "e": "👨‍👩‍👧‍👦",
      "reuse": true,
      "core": true
     },
     {
      "w": "baby",
      "zh": "宝宝",
      "e": "👶",
      "reuse": true,
      "core": true
     },
     {
      "w": "friend",
      "zh": "朋友",
      "e": "🤝",
      "reuse": true
     },
     {
      "w": "boy",
      "zh": "男孩",
      "e": "👦",
      "reuse": true
     },
     {
      "w": "girl",
      "zh": "女孩",
      "e": "👧",
      "reuse": true
     },
     {
      "w": "child",
      "zh": "孩子",
      "e": "🧒",
      "reuse": true
     }
    ]
   },
   {
    "id": "pu1-r1",
    "mod": 0,
    "title": "Review 1-3",
    "zh": "复习 1-3",
    "tip": "Pre A1 Starters 题型练：Listen and point / Read and match。",
    "grammar": "复习：be 动词、名词复数、this/these、he/she",
    "words": [
     {
      "w": "hello",
      "zh": "你好",
      "e": "👋",
      "reuse": true
     },
     {
      "w": "book",
      "zh": "书",
      "e": "📖",
      "reuse": true
     },
     {
      "w": "pen",
      "zh": "钢笔",
      "e": "🖊️",
      "reuse": true
     },
     {
      "w": "ruler",
      "zh": "尺子",
      "e": "📏",
      "reuse": true
     },
     {
      "w": "dad",
      "zh": "爸爸",
      "e": "👨‍👦",
      "reuse": true
     },
     {
      "w": "mom",
      "zh": "妈妈",
      "e": "👩‍👦",
      "reuse": true
     },
     {
      "w": "brother",
      "zh": "兄弟",
      "e": "",
      "reuse": true
     },
     {
      "w": "sister",
      "zh": "姐妹",
      "e": "",
      "reuse": true
     },
     {
      "w": "teacher",
      "zh": "老师",
      "e": "👩‍🏫",
      "reuse": true
     },
     {
      "w": "friend",
      "zh": "朋友",
      "e": "🤝",
      "reuse": true
     },
     {
      "w": "I",
      "zh": "我",
      "e": "",
      "reuse": true
     },
     {
      "w": "you",
      "zh": "你",
      "e": "",
      "reuse": true
     },
     {
      "w": "am",
      "zh": "是(我)",
      "e": "",
      "reuse": true
     },
     {
      "w": "is",
      "zh": "是(他她它)",
      "e": "",
      "reuse": true
     },
     {
      "w": "are",
      "zh": "是(你/我们)",
      "e": "",
      "reuse": true
     },
     {
      "w": "name",
      "zh": "名字",
      "e": "",
      "reuse": true
     }
    ]
   },
   {
    "id": "pu1-u4",
    "mod": 4,
    "title": "Unit 4 · Colours and numbers",
    "zh": "颜色与数字",
    "tip": "本单元任务：数一数教室里的东西，说出它们的颜色。",
    "grammar": "How many ...? 数字 1-10；颜色词作定语（a red bag）",
    "sentences": [
     {
      "en": "I have three red pens.",
      "zh": "我有三支红钢笔。"
     },
     {
      "en": "How many books? Five!",
      "zh": "几本书？五本！"
     },
     {
      "en": "Two blue birds are in the tree.",
      "zh": "两只蓝色的鸟在树上。"
     }
    ],
    "clil": {
     "t": "🔢 CLIL · 数学：颜色分类统计",
     "kid": "把玩具按颜色分堆再数一数——红色一堆、蓝色一堆，这就是数学里的分类统计。"
    },
    "values": {
     "t": "💛 素养 · 分享与合作",
     "kid": "数数的时候把积木分给同桌一起数——一起数得又快又准。"
    },
    "words": [
     {
      "w": "red",
      "zh": "红色",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "yellow",
      "zh": "黄色",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "blue",
      "zh": "蓝色",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "green",
      "zh": "绿色",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "white",
      "zh": "白色",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "black",
      "zh": "黑色",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "pink",
      "zh": "粉色",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "one",
      "zh": "一",
      "e": "1️⃣",
      "reuse": true,
      "core": true
     },
     {
      "w": "two",
      "zh": "二",
      "e": "2️⃣",
      "reuse": true,
      "core": true
     },
     {
      "w": "three",
      "zh": "三",
      "e": "3️⃣",
      "reuse": true,
      "core": true
     },
     {
      "w": "four",
      "zh": "四",
      "e": "4️⃣",
      "reuse": true
     },
     {
      "w": "five",
      "zh": "五",
      "e": "5️⃣",
      "reuse": true
     },
     {
      "w": "colour",
      "zh": "颜色",
      "e": "🌈",
      "reuse": true
     },
     {
      "w": "count",
      "zh": "数数",
      "e": "🧮",
      "reuse": true
     },
     {
      "w": "number",
      "zh": "数字",
      "e": "🔢",
      "reuse": true
     }
    ]
   },
   {
    "id": "pu1-u5",
    "mod": 5,
    "title": "Unit 5 · Animal friends",
    "zh": "动物朋友",
    "tip": "本单元任务：给农场动物排队，介绍你最喜欢的动物。",
    "grammar": "It is a/an ...；They are ...；第三人称单数 has（It has ...）",
    "sentences": [
     {
      "en": "The cow says moo.",
      "zh": "奶牛哞哞叫。"
     },
     {
      "en": "It has four legs.",
      "zh": "它有四条腿。"
     },
     {
      "en": "I like the little pig.",
      "zh": "我喜欢小猪。"
     }
    ],
    "clil": {
     "t": "🔬 CLIL · 科学：农场动物与产品",
     "kid": "cow 给我们 milk，hen 给我们 eggs，sheep 给我们 wool——农场动物是我们的好帮手。"
    },
    "values": {
     "t": "💛 素养 · 爱护动物",
     "kid": "动物是我们的朋友——喂食轻轻的，摸它们柔柔的，不追不吓。"
    },
    "words": [
     {
      "w": "cat",
      "zh": "小猫",
      "e": "🐱",
      "reuse": true,
      "core": true
     },
     {
      "w": "dog",
      "zh": "小狗",
      "e": "🐶",
      "reuse": true,
      "core": true
     },
     {
      "w": "bird",
      "zh": "小鸟",
      "e": "🐦",
      "reuse": true,
      "core": true
     },
     {
      "w": "fish",
      "zh": "鱼",
      "e": "🐟",
      "reuse": true,
      "core": true
     },
     {
      "w": "duck",
      "zh": "鸭子",
      "e": "🦆",
      "reuse": true,
      "core": true
     },
     {
      "w": "pig",
      "zh": "小猪",
      "e": "🐷",
      "reuse": true,
      "core": true
     },
     {
      "w": "mouse",
      "zh": "老鼠",
      "e": "🐭",
      "reuse": true,
      "core": true
     },
     {
      "w": "hen",
      "zh": "母鸡",
      "e": "🐔",
      "reuse": true,
      "core": true
     },
     {
      "w": "chick",
      "zh": "小鸡",
      "e": "🐤",
      "reuse": true,
      "core": true
     },
     {
      "w": "rabbit",
      "zh": "兔子",
      "e": "🐰",
      "reuse": true,
      "core": true
     },
     {
      "w": "monkey",
      "zh": "猴子",
      "e": "🐵",
      "reuse": true
     },
     {
      "w": "panda",
      "zh": "熊猫",
      "e": "🐼",
      "reuse": true
     },
     {
      "w": "tiger",
      "zh": "老虎",
      "e": "🐯",
      "reuse": true
     },
     {
      "w": "lion",
      "zh": "狮子",
      "e": "🦁",
      "reuse": true
     },
     {
      "w": "elephant",
      "zh": "大象",
      "e": "🐘",
      "reuse": true
     }
    ]
   },
   {
    "id": "pu1-u6",
    "mod": 6,
    "title": "Unit 6 · Yummy food",
    "zh": "好吃的东西",
    "tip": "本单元任务：设计一份健康午餐盘。",
    "grammar": "I like ... / I don't like ...；不可数名词（milk/rice/water 不加 s）",
    "sentences": [
     {
      "en": "I like apples.",
      "zh": "我喜欢苹果。"
     },
     {
      "en": "I don't like candy.",
      "zh": "我不喜欢糖果。"
     },
     {
      "en": "Milk is good for you.",
      "zh": "牛奶对你有好处。"
     }
    ],
    "clil": {
     "t": "🔬 CLIL · 科学：健康餐盘",
     "kid": "健康餐盘一半是水果和蔬菜，四分之一是米饭，四分之一是蛋白质——你的餐盘长什么样？"
    },
    "values": {
     "t": "💛 素养 · 不挑食",
     "kid": "每样食物都有自己的本领——胡萝卜护眼、牛奶壮骨。什么都吃，身体才棒。"
    },
    "words": [
     {
      "w": "apple",
      "zh": "苹果",
      "e": "🍎",
      "reuse": true,
      "core": true
     },
     {
      "w": "banana",
      "zh": "香蕉",
      "e": "🍌",
      "reuse": true,
      "core": true
     },
     {
      "w": "pear",
      "zh": "梨",
      "e": "🍐",
      "reuse": true,
      "core": true
     },
     {
      "w": "grape",
      "zh": "葡萄",
      "e": "🍇",
      "reuse": true,
      "core": true
     },
     {
      "w": "egg",
      "zh": "鸡蛋",
      "e": "🥚",
      "reuse": true,
      "core": true
     },
     {
      "w": "rice",
      "zh": "米饭",
      "e": "🍚",
      "reuse": true,
      "core": true
     },
     {
      "w": "bread",
      "zh": "面包",
      "e": "🍞",
      "reuse": true,
      "core": true
     },
     {
      "w": "milk",
      "zh": "牛奶",
      "e": "🥛",
      "reuse": true,
      "core": true
     },
     {
      "w": "water",
      "zh": "水",
      "e": "💧",
      "reuse": true,
      "core": true
     },
     {
      "w": "juice",
      "zh": "果汁",
      "e": "🧃",
      "reuse": true,
      "core": true
     },
     {
      "w": "cake",
      "zh": "蛋糕",
      "e": "🍰",
      "reuse": true
     },
     {
      "w": "food",
      "zh": "食物",
      "e": "🍱",
      "reuse": true
     },
     {
      "w": "fruit",
      "zh": "水果",
      "e": "🍏",
      "reuse": true
     },
     {
      "w": "eat",
      "zh": "吃",
      "e": "🍽️",
      "reuse": true
     }
    ]
   },
   {
    "id": "pu1-r2",
    "mod": 0,
    "title": "Review 4-6",
    "zh": "复习 4-6",
    "tip": "Pre A1 Starters 题型练：Speaking Part 3 看图说话。",
    "grammar": "复习：How many、like+名词、动物与食物词",
    "words": [
     {
      "w": "red",
      "zh": "红色",
      "e": "",
      "reuse": true
     },
     {
      "w": "blue",
      "zh": "蓝色",
      "e": "",
      "reuse": true
     },
     {
      "w": "one",
      "zh": "一",
      "e": "1️⃣",
      "reuse": true
     },
     {
      "w": "two",
      "zh": "二",
      "e": "2️⃣",
      "reuse": true
     },
     {
      "w": "three",
      "zh": "三",
      "e": "3️⃣",
      "reuse": true
     },
     {
      "w": "cat",
      "zh": "小猫",
      "e": "🐱",
      "reuse": true
     },
     {
      "w": "dog",
      "zh": "小狗",
      "e": "🐶",
      "reuse": true
     },
     {
      "w": "rabbit",
      "zh": "兔子",
      "e": "🐰",
      "reuse": true
     },
     {
      "w": "apple",
      "zh": "苹果",
      "e": "🍎",
      "reuse": true
     },
     {
      "w": "banana",
      "zh": "香蕉",
      "e": "🍌",
      "reuse": true
     },
     {
      "w": "egg",
      "zh": "鸡蛋",
      "e": "🥚",
      "reuse": true
     },
     {
      "w": "milk",
      "zh": "牛奶",
      "e": "🥛",
      "reuse": true
     },
     {
      "w": "fruit",
      "zh": "水果",
      "e": "🍏",
      "reuse": true
     },
     {
      "w": "like",
      "zh": "喜欢",
      "e": "💗",
      "reuse": true
     }
    ]
   },
   {
    "id": "pu1-u7",
    "mod": 7,
    "title": "Unit 7 · Toys we love",
    "zh": "我们喜爱的玩具",
    "tip": "本单元任务：带一件玩具来介绍它。",
    "grammar": "I have a ...；形容词放名词前（a big ball）；This is my favourite ...",
    "sentences": [
     {
      "en": "This is my teddy bear.",
      "zh": "这是我的泰迪熊。"
     },
     {
      "en": "I have a big ball.",
      "zh": "我有一个大球。"
     },
     {
      "en": "Let's play together!",
      "zh": "我们一起玩吧！"
     }
    ],
    "clil": {
     "t": "🔬 CLIL · 科学：玩具怎么动",
     "kid": "ball 会 roll（滚），kite 会 fly（飞），robot 会 walk（走）——动的方式不一样，能量来源也不一样。"
    },
    "values": {
     "t": "💛 素养 · 玩完收好",
     "kid": "玩具玩完送回家——每个玩具都有自己的家，书包和玩具箱就是它们的家。"
    },
    "words": [
     {
      "w": "ball",
      "zh": "球",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "kite",
      "zh": "风筝",
      "e": "🪁",
      "reuse": true,
      "core": true
     },
     {
      "w": "doll",
      "zh": "娃娃",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "toy",
      "zh": "玩具",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "teddy bear",
      "zh": "泰迪熊",
      "e": "🧸",
      "reuse": true,
      "core": true
     },
     {
      "w": "yo-yo",
      "zh": "悠悠球",
      "e": "🪀",
      "reuse": true,
      "core": true
     },
     {
      "w": "robot",
      "zh": "机器人",
      "e": "🤖",
      "reuse": true,
      "core": true
     },
     {
      "w": "puzzle",
      "zh": "拼图",
      "e": "🧩",
      "reuse": true,
      "core": true
     },
     {
      "w": "balloon",
      "zh": "气球",
      "e": "🎈",
      "reuse": true,
      "core": true
     },
     {
      "w": "game",
      "zh": "游戏",
      "e": "🎮",
      "reuse": true,
      "core": true
     },
     {
      "w": "plane",
      "zh": "飞机",
      "e": "✈️",
      "reuse": true
     },
     {
      "w": "car",
      "zh": "小汽车",
      "e": "🚗",
      "reuse": true
     }
    ]
   },
   {
    "id": "pu1-u8",
    "mod": 8,
    "title": "Unit 8 · My body can move!",
    "zh": "我的身体会动",
    "tip": "本单元任务：跟着指令做动作（Touch your nose!）。",
    "grammar": "祈使句 Touch ... / Stand up；can 表示能力（I can jump）",
    "sentences": [
     {
      "en": "Touch your nose!",
      "zh": "摸摸你的鼻子！"
     },
     {
      "en": "I can jump.",
      "zh": "我会跳。"
     },
     {
      "en": "Clap your hands.",
      "zh": "拍拍手。"
     }
    ],
    "clil": {
     "t": "🔬 CLIL · 科学：五官的本领",
     "kid": "eyes 用来 see，ears 用来 hear，nose 用来 smell——每个五官都是身体的小侦探。"
    },
    "values": {
     "t": "💛 素养 · 团队合作",
     "kid": "Simon says 游戏里有人快有人慢——等一等大家，一起赢才有趣。"
    },
    "words": [
     {
      "w": "eye",
      "zh": "眼睛",
      "e": "👁️",
      "reuse": true,
      "core": true
     },
     {
      "w": "ear",
      "zh": "耳朵",
      "e": "👂",
      "reuse": true,
      "core": true
     },
     {
      "w": "nose",
      "zh": "鼻子",
      "e": "👃",
      "reuse": true,
      "core": true
     },
     {
      "w": "mouth",
      "zh": "嘴巴",
      "e": "👄",
      "reuse": true,
      "core": true
     },
     {
      "w": "hand",
      "zh": "手",
      "e": "✋",
      "reuse": true,
      "core": true
     },
     {
      "w": "head",
      "zh": "头",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "hair",
      "zh": "头发",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "face",
      "zh": "脸",
      "e": "😊",
      "reuse": true,
      "core": true
     },
     {
      "w": "arm",
      "zh": "手臂",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "leg",
      "zh": "腿",
      "e": "🦵",
      "reuse": true,
      "core": true
     },
     {
      "w": "foot",
      "zh": "脚",
      "e": "🦶",
      "reuse": true
     },
     {
      "w": "sing",
      "zh": "唱歌",
      "e": "🎤",
      "reuse": true
     },
     {
      "w": "dance",
      "zh": "跳舞",
      "e": "💃",
      "reuse": true
     },
     {
      "w": "jump",
      "zh": "跳",
      "e": "🤸",
      "reuse": true
     }
    ]
   },
   {
    "id": "pu1-u9",
    "mod": 9,
    "title": "Unit 9 · Fun days out",
    "zh": "快乐的出游",
    "tip": "本单元任务：计划一次公园出游，说说要做什么。",
    "grammar": "Let's ...；There is ...；we can ...",
    "sentences": [
     {
      "en": "Let's go to the park!",
      "zh": "我们去公园吧！"
     },
     {
      "en": "I can see the sun.",
      "zh": "我能看见太阳。"
     },
     {
      "en": "It's fun!",
      "zh": "太好玩了！"
     }
    ],
    "clil": {
     "t": "🌍 CLIL · 社会：公园里的规则",
     "kid": "公园里要排队玩滑梯、不踩草坪、离小狗远一点——规则让每个人都玩得开心。"
    },
    "values": {
     "t": "💛 素养 · 安全第一",
     "kid": "出门玩先告诉大人，跟紧小伙伴——安全是快乐出游的第一条。"
    },
    "words": [
     {
      "w": "park",
      "zh": "公园",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "zoo",
      "zh": "动物园",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "playground",
      "zh": "操场",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "swing",
      "zh": "秋千",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "slide",
      "zh": "滑梯",
      "e": "🛝",
      "reuse": true,
      "core": true
     },
     {
      "w": "ride",
      "zh": "骑",
      "e": "🚴",
      "reuse": true,
      "core": true
     },
     {
      "w": "walk",
      "zh": "走路",
      "e": "🚶",
      "reuse": true,
      "core": true
     },
     {
      "w": "run",
      "zh": "跑",
      "e": "🏃",
      "reuse": true,
      "core": true
     },
     {
      "w": "play",
      "zh": "玩",
      "e": "🎾",
      "reuse": true,
      "core": true
     },
     {
      "w": "happy",
      "zh": "开心的",
      "e": "😄",
      "reuse": true,
      "core": true
     },
     {
      "w": "sun",
      "zh": "太阳",
      "e": "☀️",
      "reuse": true
     },
     {
      "w": "friend",
      "zh": "朋友",
      "e": "🤝",
      "reuse": true
     }
    ]
   },
   {
    "id": "pu1-r3",
    "mod": 0,
    "title": "Review 7-9",
    "zh": "复习 7-9",
    "tip": "Pre A1 Starters 模拟题：Reading & Writing Part 1-5。",
    "grammar": "复习：have/can/Let's、身体与玩具词",
    "words": [
     {
      "w": "ball",
      "zh": "球",
      "e": "",
      "reuse": true
     },
     {
      "w": "kite",
      "zh": "风筝",
      "e": "🪁",
      "reuse": true
     },
     {
      "w": "doll",
      "zh": "娃娃",
      "e": "",
      "reuse": true
     },
     {
      "w": "toy",
      "zh": "玩具",
      "e": "",
      "reuse": true
     },
     {
      "w": "eye",
      "zh": "眼睛",
      "e": "👁️",
      "reuse": true
     },
     {
      "w": "nose",
      "zh": "鼻子",
      "e": "👃",
      "reuse": true
     },
     {
      "w": "mouth",
      "zh": "嘴巴",
      "e": "👄",
      "reuse": true
     },
     {
      "w": "hand",
      "zh": "手",
      "e": "✋",
      "reuse": true
     },
     {
      "w": "leg",
      "zh": "腿",
      "e": "🦵",
      "reuse": true
     },
     {
      "w": "run",
      "zh": "跑",
      "e": "🏃",
      "reuse": true
     },
     {
      "w": "play",
      "zh": "玩",
      "e": "🎾",
      "reuse": true
     },
     {
      "w": "park",
      "zh": "公园",
      "e": "",
      "reuse": true
     },
     {
      "w": "zoo",
      "zh": "动物园",
      "e": "",
      "reuse": true
     },
     {
      "w": "happy",
      "zh": "开心的",
      "e": "😄",
      "reuse": true
     }
    ]
   }
  ]
 },
 {
  "id": "pu2",
  "name": "Power Up 2",
  "exam": "A1 Movers",
  "title": "剑桥 Power Up 2（剑桥少儿英语 A1 Movers 备考）",
  "units": [
   {
    "id": "pu2-u1",
    "mod": 1,
    "title": "Unit 1 · Back to school",
    "zh": "回到学校",
    "tip": "本单元任务：做一张班级值日表。",
    "grammar": "现在进行时 be+doing（We are reading）；where 引导的方位问句",
    "sentences": [
     {
      "en": "We are reading.",
      "zh": "我们在读书。"
     },
     {
      "en": "Where is the glue?",
      "zh": "胶水在哪里？"
     },
     {
      "en": "It's on the desk.",
      "zh": "在课桌上。"
     }
    ],
    "clil": {
     "t": "🔢 CLIL · 数学：文具分类统计",
     "kid": "把全班的书包文具分类统计：几支笔、几把尺——一张统计表就说清楚了。"
    },
    "values": {
     "t": "💛 素养 · 借还礼貌",
     "kid": "借东西先问 May I…?，用完说 thank you——小礼貌换来大朋友。"
    },
    "words": [
     {
      "w": "classroom",
      "zh": "教室",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "class",
      "zh": "班级",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "classmate",
      "zh": "同学",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "card",
      "zh": "卡片",
      "e": "🃏",
      "reuse": true,
      "core": true
     },
     {
      "w": "picture",
      "zh": "图片",
      "e": "🖼️",
      "reuse": true,
      "core": true
     },
     {
      "w": "sticker",
      "zh": "贴纸",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "scissors",
      "zh": "剪刀",
      "e": "✂️",
      "reuse": true,
      "core": true
     },
     {
      "w": "glue",
      "zh": "胶水",
      "e": "🧴",
      "reuse": true,
      "core": true
     },
     {
      "w": "paper",
      "zh": "纸",
      "e": "📄",
      "reuse": true,
      "core": true
     },
     {
      "w": "bell",
      "zh": "铃铛",
      "e": "🔔",
      "reuse": true,
      "core": true
     },
     {
      "w": "blackboard",
      "zh": "黑板",
      "e": "",
      "reuse": true
     },
     {
      "w": "read",
      "zh": "读书",
      "e": "📚",
      "reuse": true
     },
     {
      "w": "write",
      "zh": "写",
      "e": "✍️",
      "reuse": true
     },
     {
      "w": "draw",
      "zh": "画画",
      "e": "🎨",
      "reuse": true
     }
    ]
   },
   {
    "id": "pu2-u2",
    "mod": 2,
    "title": "Unit 2 · People around me",
    "zh": "我身边的人",
    "tip": "本单元任务：描述一位家人的样子。",
    "grammar": "人称代词主格/形容词性物主代词（he/his, she/her）",
    "sentences": [
     {
      "en": "He is my uncle.",
      "zh": "他是我叔叔。"
     },
     {
      "en": "She is wearing a hat.",
      "zh": "她戴着一顶帽子。"
     },
     {
      "en": "They are my cousins.",
      "zh": "他们是我的表兄弟姐妹。"
     }
    ],
    "clil": {
     "t": "🌍 CLIL · 社会：家庭角色",
     "kid": "每个家庭成员都有自己的角色——有人做饭、有人工作、有人讲故事，家像一个团队。"
    },
    "values": {
     "t": "💛 素养 · 尊重不同",
     "kid": "有的家庭人多、有的家庭人少——每一家都有自己的幸福。"
    },
    "words": [
     {
      "w": "he",
      "zh": "他",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "she",
      "zh": "她",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "it",
      "zh": "它",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "we",
      "zh": "我们",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "they",
      "zh": "他们",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "my",
      "zh": "我的",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "your",
      "zh": "你的",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "his",
      "zh": "他的",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "her",
      "zh": "她的",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "man",
      "zh": "男人",
      "e": "🧍‍♂️",
      "reuse": true,
      "core": true
     },
     {
      "w": "woman",
      "zh": "女人",
      "e": "🧍‍♀️",
      "reuse": true
     },
     {
      "w": "boy",
      "zh": "男孩",
      "e": "👦",
      "reuse": true
     },
     {
      "w": "girl",
      "zh": "女孩",
      "e": "👧",
      "reuse": true
     },
     {
      "w": "kid",
      "zh": "小孩",
      "e": "",
      "reuse": true
     }
    ]
   },
   {
    "id": "pu2-u3",
    "mod": 3,
    "title": "Unit 3 · Numbers up to twenty",
    "zh": "数字到二十",
    "tip": "本单元任务：玩数字接龙，算一算教室里的物品。",
    "grammar": "数字 11-20 的构词（-teen）；How many ... are there? There are ...",
    "sentences": [
     {
      "en": "How many books? Fifteen.",
      "zh": "多少本书？十五本。"
     },
     {
      "en": "There are twenty chairs.",
      "zh": "有二十把椅子。"
     },
     {
      "en": "Count from one to twenty!",
      "zh": "从一数到二十！"
     }
    ],
    "clil": {
     "t": "🔢 CLIL · 数学：20 以内加减",
     "kid": "十五加五是二十，二十减三是十七——数字加加减减就是数学游戏。"
    },
    "values": {
     "t": "💛 素养 · 排队不加塞",
     "kid": "玩游戏、领东西都要排队——排队是公平的第一步。"
    },
    "words": [
     {
      "w": "eleven",
      "zh": "十一",
      "e": "1️⃣1️⃣",
      "reuse": true,
      "core": true
     },
     {
      "w": "twelve",
      "zh": "十二",
      "e": "1️⃣2️⃣",
      "reuse": true,
      "core": true
     },
     {
      "w": "thirteen",
      "zh": "十三",
      "e": "1️⃣3️⃣",
      "reuse": true,
      "core": true
     },
     {
      "w": "fourteen",
      "zh": "十四",
      "e": "1️⃣4️⃣",
      "reuse": true,
      "core": true
     },
     {
      "w": "fifteen",
      "zh": "十五",
      "e": "1️⃣5️⃣",
      "reuse": true,
      "core": true
     },
     {
      "w": "sixteen",
      "zh": "十六",
      "e": "1️⃣6️⃣",
      "reuse": true,
      "core": true
     },
     {
      "w": "seventeen",
      "zh": "十七",
      "e": "1️⃣7️⃣",
      "reuse": true,
      "core": true
     },
     {
      "w": "eighteen",
      "zh": "十八",
      "e": "1️⃣8️⃣",
      "reuse": true,
      "core": true
     },
     {
      "w": "nineteen",
      "zh": "十九",
      "e": "1️⃣9️⃣",
      "reuse": true,
      "core": true
     },
     {
      "w": "twenty",
      "zh": "二十",
      "e": "2️⃣0️⃣",
      "reuse": true,
      "core": true
     },
     {
      "w": "hundred",
      "zh": "百",
      "e": "💯",
      "reuse": true
     },
     {
      "w": "count",
      "zh": "数数",
      "e": "🧮",
      "reuse": true
     },
     {
      "w": "number",
      "zh": "数字",
      "e": "🔢",
      "reuse": true
     }
    ]
   },
   {
    "id": "pu2-r1",
    "mod": 0,
    "title": "Review 1-3",
    "zh": "复习 1-3",
    "tip": "A1 Movers 题型练：Reading Part 2 配对。",
    "grammar": "复习：现在进行时、代词、数字 11-20",
    "words": [
     {
      "w": "classroom",
      "zh": "教室",
      "e": "",
      "reuse": true
     },
     {
      "w": "scissors",
      "zh": "剪刀",
      "e": "✂️",
      "reuse": true
     },
     {
      "w": "paper",
      "zh": "纸",
      "e": "📄",
      "reuse": true
     },
     {
      "w": "he",
      "zh": "他",
      "e": "",
      "reuse": true
     },
     {
      "w": "she",
      "zh": "她",
      "e": "",
      "reuse": true
     },
     {
      "w": "they",
      "zh": "他们",
      "e": "",
      "reuse": true
     },
     {
      "w": "his",
      "zh": "他的",
      "e": "",
      "reuse": true
     },
     {
      "w": "her",
      "zh": "她的",
      "e": "",
      "reuse": true
     },
     {
      "w": "eleven",
      "zh": "十一",
      "e": "1️⃣1️⃣",
      "reuse": true
     },
     {
      "w": "fifteen",
      "zh": "十五",
      "e": "1️⃣5️⃣",
      "reuse": true
     },
     {
      "w": "twenty",
      "zh": "二十",
      "e": "2️⃣0️⃣",
      "reuse": true
     },
     {
      "w": "count",
      "zh": "数数",
      "e": "🧮",
      "reuse": true
     },
     {
      "w": "number",
      "zh": "数字",
      "e": "🔢",
      "reuse": true
     }
    ]
   },
   {
    "id": "pu2-u4",
    "mod": 4,
    "title": "Unit 4 · Animal world",
    "zh": "动物世界",
    "tip": "本单元任务：做一页动物图鉴，写出它们会做什么。",
    "grammar": "第三人称单数 has/is；否定句 doesn't have",
    "sentences": [
     {
      "en": "The fox has a long tail.",
      "zh": "狐狸有长尾巴。"
     },
     {
      "en": "Owls sleep in the day.",
      "zh": "猫头鹰白天睡觉。"
     },
     {
      "en": "Frogs can swim too.",
      "zh": "青蛙也会游泳。"
     }
    ],
    "clil": {
     "t": "🔬 CLIL · 科学：昼行与夜行",
     "kid": "owl 在夜里看得见，eagle 在白天看得远——动物的眼睛跟着它们的生活方式长。"
    },
    "values": {
     "t": "💛 素养 · 保护野生动物",
     "kid": "野生动物不属于家里的笼子——让它们留在属于它们的大自然里。"
    },
    "words": [
     {
      "w": "cow",
      "zh": "奶牛",
      "e": "🐮",
      "reuse": true,
      "core": true
     },
     {
      "w": "sheep",
      "zh": "绵羊",
      "e": "🐑",
      "reuse": true,
      "core": true
     },
     {
      "w": "giraffe",
      "zh": "长颈鹿",
      "e": "🦒",
      "reuse": true,
      "core": true
     },
     {
      "w": "goose",
      "zh": "大鹅",
      "e": "🦢",
      "reuse": true,
      "core": true
     },
     {
      "w": "zebra",
      "zh": "斑马",
      "e": "🦓",
      "reuse": true,
      "core": true
     },
     {
      "w": "koala",
      "zh": "考拉",
      "e": "🐨",
      "reuse": true,
      "core": true
     },
     {
      "w": "owl",
      "zh": "猫头鹰",
      "e": "🦉",
      "reuse": true,
      "core": true
     },
     {
      "w": "eagle",
      "zh": "老鹰",
      "e": "🦅",
      "reuse": true,
      "core": true
     },
     {
      "w": "fox",
      "zh": "狐狸",
      "e": "🦊",
      "reuse": true,
      "core": true
     },
     {
      "w": "wolf",
      "zh": "狼",
      "e": "🐺",
      "reuse": true,
      "core": true
     },
     {
      "w": "deer",
      "zh": "鹿",
      "e": "🦌",
      "reuse": true
     },
     {
      "w": "frog",
      "zh": "青蛙",
      "e": "🐸",
      "reuse": true
     },
     {
      "w": "turtle",
      "zh": "乌龟",
      "e": "🐢",
      "reuse": true
     },
     {
      "w": "snake",
      "zh": "蛇",
      "e": "🐍",
      "reuse": true
     }
    ]
   },
   {
    "id": "pu2-u5",
    "mod": 5,
    "title": "Unit 5 · Clothes we wear",
    "zh": "我们穿的衣服",
    "tip": "本单元任务：按天气给衣柜分类。",
    "grammar": "I am wearing ...（现在进行时）；复数 clothes/shoes/socks 谓语用 are",
    "sentences": [
     {
      "en": "I am wearing a red hat.",
      "zh": "我戴着一顶红帽子。"
     },
     {
      "en": "Put on your coat.",
      "zh": "穿上你的外套。"
     },
     {
      "en": "These are my socks.",
      "zh": "这是我的袜子。"
     }
    ],
    "clil": {
     "t": "🌍 CLIL · 社会：场合与穿着",
     "kid": "运动会穿 sport shoes，下雨穿 raincoat——不同场合穿不同的衣服，这是生活的智慧。"
    },
    "values": {
     "t": "💛 素养 · 自己的事情自己做",
     "kid": "自己穿袜子、自己扣扣子——每学会一样，就长大一点。"
    },
    "words": [
     {
      "w": "shirt",
      "zh": "衬衫",
      "e": "👔",
      "reuse": true,
      "core": true
     },
     {
      "w": "T-shirt",
      "zh": "T恤",
      "e": "👕",
      "reuse": true,
      "core": true
     },
     {
      "w": "dress",
      "zh": "连衣裙",
      "e": "👗",
      "reuse": true,
      "core": true
     },
     {
      "w": "skirt",
      "zh": "短裙",
      "e": "👚",
      "reuse": true,
      "core": true
     },
     {
      "w": "pants",
      "zh": "裤子",
      "e": "👖",
      "reuse": true,
      "core": true
     },
     {
      "w": "shorts",
      "zh": "短裤",
      "e": "🩳",
      "reuse": true,
      "core": true
     },
     {
      "w": "coat",
      "zh": "大衣",
      "e": "🧥",
      "reuse": true,
      "core": true
     },
     {
      "w": "sweater",
      "zh": "毛衣",
      "e": "🧶",
      "reuse": true,
      "core": true
     },
     {
      "w": "jacket",
      "zh": "夹克",
      "e": "🥼",
      "reuse": true,
      "core": true
     },
     {
      "w": "hat",
      "zh": "帽子",
      "e": "🎩",
      "reuse": true,
      "core": true
     },
     {
      "w": "cap",
      "zh": "鸭舌帽",
      "e": "🧢",
      "reuse": true
     },
     {
      "w": "shoe",
      "zh": "鞋",
      "e": "👟",
      "reuse": true
     },
     {
      "w": "sock",
      "zh": "袜子",
      "e": "🧦",
      "reuse": true
     },
     {
      "w": "clothes",
      "zh": "衣服",
      "e": "🧺",
      "reuse": true
     }
    ]
   },
   {
    "id": "pu2-u6",
    "mod": 6,
    "title": "Unit 6 · Food and drinks",
    "zh": "食物与饮料",
    "tip": "本单元任务：写一张三明治食谱。",
    "grammar": "some/any；Would you like ...? / I'd like ...",
    "sentences": [
     {
      "en": "I'd like some soup.",
      "zh": "我想要一些汤。"
     },
     {
      "en": "Would you like some candy?",
      "zh": "你想吃点糖吗？"
     },
     {
      "en": "Noodles are yummy.",
      "zh": "面条很好吃。"
     }
    ],
    "clil": {
     "t": "🔬 CLIL · 科学：健康餐盘",
     "kid": "健康的餐盘 = 一半蔬菜 + 四分之一主食 + 四分之一蛋白质 + 一杯水。"
    },
    "values": {
     "t": "💛 素养 · 餐桌礼仪",
     "kid": "吃饭前说 please，吃完说 thank you——餐桌上的礼貌和美味一样重要。"
    },
    "words": [
     {
      "w": "chicken",
      "zh": "鸡肉",
      "e": "🍗",
      "reuse": true,
      "core": true
     },
     {
      "w": "beef",
      "zh": "牛肉",
      "e": "🥩",
      "reuse": true,
      "core": true
     },
     {
      "w": "pork",
      "zh": "猪肉",
      "e": "🥓",
      "reuse": true,
      "core": true
     },
     {
      "w": "soup",
      "zh": "汤",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "noodle",
      "zh": "面条",
      "e": "🍜",
      "reuse": true,
      "core": true
     },
     {
      "w": "dumpling",
      "zh": "饺子",
      "e": "🥟",
      "reuse": true,
      "core": true
     },
     {
      "w": "candy",
      "zh": "糖果",
      "e": "🍬",
      "reuse": true,
      "core": true
     },
     {
      "w": "chocolate",
      "zh": "巧克力",
      "e": "🍫",
      "reuse": true,
      "core": true
     },
     {
      "w": "biscuit",
      "zh": "饼干",
      "e": "🍪",
      "reuse": true,
      "core": true
     },
     {
      "w": "tea",
      "zh": "茶",
      "e": "🍵",
      "reuse": true,
      "core": true
     },
     {
      "w": "breakfast",
      "zh": "早餐",
      "e": "",
      "reuse": true
     },
     {
      "w": "lunch",
      "zh": "午餐",
      "e": "",
      "reuse": true
     },
     {
      "w": "dinner",
      "zh": "晚餐",
      "e": "",
      "reuse": true
     },
     {
      "w": "drink",
      "zh": "喝",
      "e": "🥤",
      "reuse": true
     }
    ]
   },
   {
    "id": "pu2-r2",
    "mod": 0,
    "title": "Review 4-6",
    "zh": "复习 4-6",
    "tip": "A1 Movers 题型练：Listening Part 3。",
    "grammar": "复习：has/doesn't have、be+doing、Would you like",
    "words": [
     {
      "w": "cow",
      "zh": "奶牛",
      "e": "🐮",
      "reuse": true
     },
     {
      "w": "giraffe",
      "zh": "长颈鹿",
      "e": "🦒",
      "reuse": true
     },
     {
      "w": "zebra",
      "zh": "斑马",
      "e": "🦓",
      "reuse": true
     },
     {
      "w": "frog",
      "zh": "青蛙",
      "e": "🐸",
      "reuse": true
     },
     {
      "w": "shirt",
      "zh": "衬衫",
      "e": "👔",
      "reuse": true
     },
     {
      "w": "dress",
      "zh": "连衣裙",
      "e": "👗",
      "reuse": true
     },
     {
      "w": "sweater",
      "zh": "毛衣",
      "e": "🧶",
      "reuse": true
     },
     {
      "w": "chicken",
      "zh": "鸡肉",
      "e": "🍗",
      "reuse": true
     },
     {
      "w": "soup",
      "zh": "汤",
      "e": "",
      "reuse": true
     },
     {
      "w": "breakfast",
      "zh": "早餐",
      "e": "",
      "reuse": true
     },
     {
      "w": "dinner",
      "zh": "晚餐",
      "e": "",
      "reuse": true
     },
     {
      "w": "candy",
      "zh": "糖果",
      "e": "🍬",
      "reuse": true
     },
     {
      "w": "tea",
      "zh": "茶",
      "e": "🍵",
      "reuse": true
     }
    ]
   },
   {
    "id": "pu2-u7",
    "mod": 7,
    "title": "Unit 7 · My home",
    "zh": "我的家",
    "tip": "本单元任务：画自己家的平面图并介绍房间。",
    "grammar": "方位介词 in/on/under/behind/between；There is/There are",
    "sentences": [
     {
      "en": "The ball is under the bed.",
      "zh": "球在床底下。"
     },
     {
      "en": "There are two windows.",
      "zh": "有两扇窗户。"
     },
     {
      "en": "My lamp is on the table.",
      "zh": "我的台灯在桌子上。"
     }
    ],
    "clil": {
     "t": "🔢 CLIL · 数学：房间里的位置",
     "kid": "用 left/right/under 描述家具位置——说清楚位置，找东西就快。"
    },
    "values": {
     "t": "💛 素养 · 整洁的小房间",
     "kid": "玩具回玩具箱、书回书架——整洁的房间让人心情好。"
    },
    "words": [
     {
      "w": "home",
      "zh": "家",
      "e": "🏠",
      "reuse": true,
      "core": true
     },
     {
      "w": "house",
      "zh": "房子",
      "e": "🏡",
      "reuse": true,
      "core": true
     },
     {
      "w": "door",
      "zh": "门",
      "e": "🚪",
      "reuse": true,
      "core": true
     },
     {
      "w": "window",
      "zh": "窗户",
      "e": "🪟",
      "reuse": true,
      "core": true
     },
     {
      "w": "bed",
      "zh": "床",
      "e": "🛏️",
      "reuse": true,
      "core": true
     },
     {
      "w": "table",
      "zh": "桌子",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "sofa",
      "zh": "沙发",
      "e": "🛋️",
      "reuse": true,
      "core": true
     },
     {
      "w": "lamp",
      "zh": "台灯",
      "e": "💡",
      "reuse": true,
      "core": true
     },
     {
      "w": "kitchen",
      "zh": "厨房",
      "e": "🍳",
      "reuse": true,
      "core": true
     },
     {
      "w": "bedroom",
      "zh": "卧室",
      "e": "🛌",
      "reuse": true,
      "core": true
     },
     {
      "w": "bathroom",
      "zh": "浴室",
      "e": "🛁",
      "reuse": true
     },
     {
      "w": "living room",
      "zh": "客厅",
      "e": "",
      "reuse": true
     },
     {
      "w": "garden",
      "zh": "花园",
      "e": "🌷",
      "reuse": true
     }
    ]
   },
   {
    "id": "pu2-u8",
    "mod": 8,
    "title": "Unit 8 · Weather and sky",
    "zh": "天气与天空",
    "tip": "本单元任务：当一周天气播报员。",
    "grammar": "It is + 天气形容词（It's sunny）；What's the weather like?",
    "sentences": [
     {
      "en": "It's sunny. Let's play outside!",
      "zh": "晴天！我们出去玩吧！"
     },
     {
      "en": "Put on your coat. It's cold.",
      "zh": "天冷，穿上外套。"
     },
     {
      "en": "I can see a cloud like a sheep.",
      "zh": "我能看见一朵像绵羊的云。"
     }
    ],
    "clil": {
     "t": "🔬 CLIL · 科学：四季与穿衣",
     "kid": "夏天穿短袖、冬天穿棉衣——天气决定穿衣，这是人和自然的配合。"
    },
    "values": {
     "t": "💛 素养 · 关心他人冷暖",
     "kid": "天冷提醒朋友加衣——一句关心让人心里暖暖的。"
    },
    "words": [
     {
      "w": "sun",
      "zh": "太阳",
      "e": "☀️",
      "reuse": true,
      "core": true
     },
     {
      "w": "moon",
      "zh": "月亮",
      "e": "🌙",
      "reuse": true,
      "core": true
     },
     {
      "w": "star",
      "zh": "星星",
      "e": "⭐",
      "reuse": true,
      "core": true
     },
     {
      "w": "sky",
      "zh": "天空",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "cloud",
      "zh": "云",
      "e": "☁️",
      "reuse": true,
      "core": true
     },
     {
      "w": "rain",
      "zh": "雨",
      "e": "🌧️",
      "reuse": true,
      "core": true
     },
     {
      "w": "snow",
      "zh": "雪",
      "e": "❄️",
      "reuse": true,
      "core": true
     },
     {
      "w": "wind",
      "zh": "风",
      "e": "🌬️",
      "reuse": true,
      "core": true
     },
     {
      "w": "hot",
      "zh": "热",
      "e": "🥵",
      "reuse": true,
      "core": true
     },
     {
      "w": "cold",
      "zh": "冷",
      "e": "🥶",
      "reuse": true,
      "core": true
     },
     {
      "w": "warm",
      "zh": "温暖",
      "e": "",
      "reuse": true
     },
     {
      "w": "cool",
      "zh": "凉爽",
      "e": "",
      "reuse": true
     },
     {
      "w": "sunny",
      "zh": "晴朗的",
      "e": "🔆",
      "reuse": true
     },
     {
      "w": "rainy",
      "zh": "下雨的",
      "e": "",
      "reuse": true
     }
    ]
   },
   {
    "id": "pu2-u9",
    "mod": 9,
    "title": "Unit 9 · Sports and hobbies",
    "zh": "运动与爱好",
    "tip": "本单元任务：设计一场运动会比赛表。",
    "grammar": "like + doing（I like swimming）；play + 球类（play football）",
    "sentences": [
     {
      "en": "I can swim fast.",
      "zh": "我能游得很快。"
     },
     {
      "en": "Let's play football!",
      "zh": "我们踢足球吧！"
     },
     {
      "en": "I like riding my bike.",
      "zh": "我喜欢骑自行车。"
     }
    ],
    "clil": {
     "t": "🔬 CLIL · 健康：运动让身体强壮",
     "kid": "running 练腿、swimming 练全身、ball games 练反应——每种运动锻炼的地方不一样。"
    },
    "values": {
     "t": "💛 素养 · 输赢都是朋友",
     "kid": "赢了说 good game，输了也说 good game——会输的小朋友更勇敢。"
    },
    "words": [
     {
      "w": "football",
      "zh": "足球",
      "e": "⚽",
      "reuse": true,
      "core": true
     },
     {
      "w": "basketball",
      "zh": "篮球",
      "e": "🏀",
      "reuse": true,
      "core": true
     },
     {
      "w": "ping-pong",
      "zh": "乒乓球",
      "e": "🏓",
      "reuse": true,
      "core": true
     },
     {
      "w": "swim",
      "zh": "游泳",
      "e": "🏊",
      "reuse": true,
      "core": true
     },
     {
      "w": "fly",
      "zh": "飞",
      "e": "🕊️",
      "reuse": true,
      "core": true
     },
     {
      "w": "skate",
      "zh": "滑冰",
      "e": "⛸️",
      "reuse": true,
      "core": true
     },
     {
      "w": "ride",
      "zh": "骑",
      "e": "🚴",
      "reuse": true,
      "core": true
     },
     {
      "w": "climb",
      "zh": "爬",
      "e": "🧗",
      "reuse": true,
      "core": true
     },
     {
      "w": "run",
      "zh": "跑",
      "e": "🏃",
      "reuse": true,
      "core": true
     },
     {
      "w": "walk",
      "zh": "走路",
      "e": "🚶",
      "reuse": true,
      "core": true
     },
     {
      "w": "play",
      "zh": "玩",
      "e": "🎾",
      "reuse": true
     },
     {
      "w": "game",
      "zh": "游戏",
      "e": "🎮",
      "reuse": true
     },
     {
      "w": "ball",
      "zh": "球",
      "e": "",
      "reuse": true
     }
    ]
   },
   {
    "id": "pu2-r3",
    "mod": 0,
    "title": "Review 7-9",
    "zh": "复习 7-9",
    "tip": "A1 Movers 模拟题：Speaking Part 1-4。",
    "grammar": "复习：方位介词、天气、like+doing",
    "words": [
     {
      "w": "door",
      "zh": "门",
      "e": "🚪",
      "reuse": true
     },
     {
      "w": "window",
      "zh": "窗户",
      "e": "🪟",
      "reuse": true
     },
     {
      "w": "bed",
      "zh": "床",
      "e": "🛏️",
      "reuse": true
     },
     {
      "w": "kitchen",
      "zh": "厨房",
      "e": "🍳",
      "reuse": true
     },
     {
      "w": "bedroom",
      "zh": "卧室",
      "e": "🛌",
      "reuse": true
     },
     {
      "w": "sun",
      "zh": "太阳",
      "e": "☀️",
      "reuse": true
     },
     {
      "w": "cloud",
      "zh": "云",
      "e": "☁️",
      "reuse": true
     },
     {
      "w": "sunny",
      "zh": "晴朗的",
      "e": "🔆",
      "reuse": true
     },
     {
      "w": "football",
      "zh": "足球",
      "e": "⚽",
      "reuse": true
     },
     {
      "w": "swim",
      "zh": "游泳",
      "e": "🏊",
      "reuse": true
     },
     {
      "w": "ride",
      "zh": "骑",
      "e": "🚴",
      "reuse": true
     },
     {
      "w": "climb",
      "zh": "爬",
      "e": "🧗",
      "reuse": true
     },
     {
      "w": "play",
      "zh": "玩",
      "e": "🎾",
      "reuse": true
     }
    ]
   }
  ]
 },
 {
  "id": "pu3",
  "name": "Power Up 3",
  "exam": "A2 Flyers",
  "title": "剑桥 Power Up 3（剑桥少儿英语 A2 Flyers 备考）",
  "units": [
   {
    "id": "pu3-u1",
    "mod": 1,
    "title": "Unit 1 · My weekly schedule",
    "zh": "我的一周安排",
    "tip": "本单元任务：做一张周计划表并口述。",
    "grammar": "一般现在时三单（-s/-es）；on + 星期；时间表达 o'clock/half past",
    "sentences": [
     {
      "en": "On Monday I have English.",
      "zh": "周一我有英语课。"
     },
     {
      "en": "What do you do on Saturday?",
      "zh": "周六你做什么？"
     },
     {
      "en": "I get up at seven o'clock.",
      "zh": "我七点起床。"
     }
    ],
    "clil": {
     "t": "🔢 CLIL · 数学：周计划时间分配",
     "kid": "把一周 168 小时画成一张饼图：睡觉、上课、玩耍各占多少？看看你的时间都去哪了。"
    },
    "values": {
     "t": "💛 素养 · 学习与休息平衡",
     "kid": "会安排时间的人既学得好又玩得开心——计划是自己的小管家。"
    },
    "words": [
     {
      "w": "Monday",
      "zh": "星期一",
      "e": "1️⃣",
      "reuse": true,
      "core": true
     },
     {
      "w": "Tuesday",
      "zh": "星期二",
      "e": "2️⃣",
      "reuse": true,
      "core": true
     },
     {
      "w": "Wednesday",
      "zh": "星期三",
      "e": "3️⃣",
      "reuse": true,
      "core": true
     },
     {
      "w": "Thursday",
      "zh": "星期四",
      "e": "4️⃣",
      "reuse": true,
      "core": true
     },
     {
      "w": "Friday",
      "zh": "星期五",
      "e": "5️⃣",
      "reuse": true,
      "core": true
     },
     {
      "w": "Saturday",
      "zh": "星期六",
      "e": "6️⃣",
      "reuse": true,
      "core": true
     },
     {
      "w": "Sunday",
      "zh": "星期日",
      "e": "7️⃣",
      "reuse": true,
      "core": true
     },
     {
      "w": "week",
      "zh": "星期",
      "e": "🗓️",
      "reuse": true,
      "core": true
     },
     {
      "w": "weekend",
      "zh": "周末",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "today",
      "zh": "今天",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "tomorrow",
      "zh": "明天",
      "e": "",
      "reuse": true
     },
     {
      "w": "yesterday",
      "zh": "昨天",
      "e": "",
      "reuse": true
     },
     {
      "w": "early",
      "zh": "早",
      "e": "🌄",
      "reuse": true
     },
     {
      "w": "late",
      "zh": "晚",
      "e": "🌜",
      "reuse": true
     }
    ]
   },
   {
    "id": "pu3-u2",
    "mod": 2,
    "title": "Unit 2 · What's for breakfast?",
    "zh": "早餐吃什么",
    "tip": "本单元任务：开一家小餐馆，写菜单。",
    "grammar": "可数/不可数与 a bowl of；How much/How many 的区分",
    "sentences": [
     {
      "en": "What's for breakfast?",
      "zh": "早餐吃什么？"
     },
     {
      "en": "I eat noodles every morning.",
      "zh": "我每天早上吃面条。"
     },
     {
      "en": "Pass me the spoon, please.",
      "zh": "请把勺子递给我。"
     }
    ],
    "clil": {
     "t": "🔬 CLIL · 科学：早餐是发动机的燃料",
     "kid": "睡了一夜，身体的油箱空了——breakfast 就是给大脑加油，不吃早餐上午会没精神。"
    },
    "values": {
     "t": "💛 素养 · 帮家人摆餐具",
     "kid": "吃饭前帮着摆 bowl 和 chopsticks——小小的动作就是大大的关心。"
    },
    "words": [
     {
      "w": "breakfast",
      "zh": "早餐",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "lunch",
      "zh": "午餐",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "dinner",
      "zh": "晚餐",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "cup",
      "zh": "杯子",
      "e": "☕",
      "reuse": true,
      "core": true
     },
     {
      "w": "plate",
      "zh": "盘子",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "bowl",
      "zh": "碗",
      "e": "🥣",
      "reuse": true,
      "core": true
     },
     {
      "w": "chopsticks",
      "zh": "筷子",
      "e": "🥢",
      "reuse": true,
      "core": true
     },
     {
      "w": "spoon",
      "zh": "勺子",
      "e": "🥄",
      "reuse": true,
      "core": true
     },
     {
      "w": "fork",
      "zh": "叉子",
      "e": "🍴",
      "reuse": true,
      "core": true
     },
     {
      "w": "knife",
      "zh": "刀",
      "e": "🔪",
      "reuse": true,
      "core": true
     },
     {
      "w": "hamburger",
      "zh": "汉堡包",
      "e": "🍔",
      "reuse": true
     },
     {
      "w": "hot dog",
      "zh": "热狗",
      "e": "🌭",
      "reuse": true
     },
     {
      "w": "French fries",
      "zh": "薯条",
      "e": "🍟",
      "reuse": true
     },
     {
      "w": "porridge",
      "zh": "粥",
      "e": "🍲",
      "reuse": true
     }
    ]
   },
   {
    "id": "pu3-u3",
    "mod": 3,
    "title": "Unit 3 · A healthy body",
    "zh": "健康的身体",
    "tip": "本单元任务：给同学开一张「健康处方」。",
    "grammar": "should/shouldn't 表示建议；have a fever/headache 搭配",
    "sentences": [
     {
      "en": "You should rest and drink water.",
      "zh": "你应该休息并多喝水。"
     },
     {
      "en": "I have a headache.",
      "zh": "我头疼。"
     },
     {
      "en": "Take this medicine twice a day.",
      "zh": "这药一天吃两次。"
     }
    ],
    "clil": {
     "t": "🔬 CLIL · 科学：发烧是身体的战斗",
     "kid": "fever 是身体在和病毒打仗——多喝水多休息，就是给身体派援兵。"
    },
    "values": {
     "t": "💛 素养 · 关心生病的同学",
     "kid": "同学请假了，帮他记笔记、问问好——生病的时候最需要朋友。"
    },
    "words": [
     {
      "w": "health",
      "zh": "健康",
      "e": "💚",
      "reuse": true,
      "core": true
     },
     {
      "w": "healthy",
      "zh": "健康的",
      "e": "🥗",
      "reuse": true,
      "core": true
     },
     {
      "w": "exercise",
      "zh": "锻炼",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "sick",
      "zh": "生病的",
      "e": "🤒",
      "reuse": true,
      "core": true
     },
     {
      "w": "ill",
      "zh": "病的",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "fever",
      "zh": "发烧",
      "e": "🌡️",
      "reuse": true,
      "core": true
     },
     {
      "w": "headache",
      "zh": "头疼",
      "e": "🤕",
      "reuse": true,
      "core": true
     },
     {
      "w": "medicine",
      "zh": "药",
      "e": "💊",
      "reuse": true,
      "core": true
     },
     {
      "w": "rest",
      "zh": "休息",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "hurt",
      "zh": "受伤",
      "e": "🩹",
      "reuse": true,
      "core": true
     },
     {
      "w": "pain",
      "zh": "疼痛",
      "e": "😖",
      "reuse": true
     },
     {
      "w": "tired",
      "zh": "累的",
      "e": "😪",
      "reuse": true
     },
     {
      "w": "thirsty",
      "zh": "渴的",
      "e": "",
      "reuse": true
     },
     {
      "w": "hungry",
      "zh": "饿的",
      "e": "",
      "reuse": true
     }
    ]
   },
   {
    "id": "pu3-r1",
    "mod": 0,
    "title": "Review 1-3",
    "zh": "复习 1-3",
    "tip": "A2 Flyers 题型练：Reading Part 4 判断。",
    "grammar": "复习：三单、should、was/were",
    "words": [
     {
      "w": "Monday",
      "zh": "星期一",
      "e": "1️⃣",
      "reuse": true
     },
     {
      "w": "Friday",
      "zh": "星期五",
      "e": "5️⃣",
      "reuse": true
     },
     {
      "w": "weekend",
      "zh": "周末",
      "e": "",
      "reuse": true
     },
     {
      "w": "early",
      "zh": "早",
      "e": "🌄",
      "reuse": true
     },
     {
      "w": "late",
      "zh": "晚",
      "e": "🌜",
      "reuse": true
     },
     {
      "w": "breakfast",
      "zh": "早餐",
      "e": "",
      "reuse": true
     },
     {
      "w": "dinner",
      "zh": "晚餐",
      "e": "",
      "reuse": true
     },
     {
      "w": "chopsticks",
      "zh": "筷子",
      "e": "🥢",
      "reuse": true
     },
     {
      "w": "spoon",
      "zh": "勺子",
      "e": "🥄",
      "reuse": true
     },
     {
      "w": "healthy",
      "zh": "健康的",
      "e": "🥗",
      "reuse": true
     },
     {
      "w": "medicine",
      "zh": "药",
      "e": "💊",
      "reuse": true
     },
     {
      "w": "rest",
      "zh": "休息",
      "e": "",
      "reuse": true
     },
     {
      "w": "fever",
      "zh": "发烧",
      "e": "🌡️",
      "reuse": true
     },
     {
      "w": "hurt",
      "zh": "受伤",
      "e": "🩹",
      "reuse": true
     }
    ]
   },
   {
    "id": "pu3-u4",
    "mod": 4,
    "title": "Unit 4 · Fun in the jungle",
    "zh": "丛林大冒险",
    "tip": "本单元任务：做一页丛林动物卡片并讲一个短故事。",
    "grammar": "一般过去时（规则 -ed）；was/were 叙述过去",
    "sentences": [
     {
      "en": "Yesterday we saw a hippo in the jungle.",
      "zh": "昨天我们在丛林里看到了河马。"
     },
     {
      "en": "The monkey was very funny.",
      "zh": "那只猴子很有趣。"
     },
     {
      "en": "Was it dangerous?",
      "zh": "危险吗？"
     }
    ],
    "clil": {
     "t": "🔬 CLIL · 科学：丛林分层住宅",
     "kid": "丛林是一栋生命大楼：鸟住树冠、猴子住中层、昆虫住地面——每层都住满了房客。"
    },
    "values": {
     "t": "💛 素养 · 不打扰野生动物",
     "kid": "看动物用眼睛和相机，不用手和笼子——保持距离就是保护。"
    },
    "words": [
     {
      "w": "jungle",
      "zh": "丛林",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "hippo",
      "zh": "河马",
      "e": "🦛",
      "reuse": true,
      "core": true
     },
     {
      "w": "camel",
      "zh": "骆驼",
      "e": "🐫",
      "reuse": true,
      "core": true
     },
     {
      "w": "kangaroo",
      "zh": "袋鼠",
      "e": "🦘",
      "reuse": true,
      "core": true
     },
     {
      "w": "penguin",
      "zh": "企鹅",
      "e": "🐧",
      "reuse": true,
      "core": true
     },
     {
      "w": "parrot",
      "zh": "鹦鹉",
      "e": "🦜",
      "reuse": true,
      "core": true
     },
     {
      "w": "butterfly",
      "zh": "蝴蝶",
      "e": "🦋",
      "reuse": true,
      "core": true
     },
     {
      "w": "bee",
      "zh": "蜜蜂",
      "e": "🐝",
      "reuse": true,
      "core": true
     },
     {
      "w": "ant",
      "zh": "蚂蚁",
      "e": "🐜",
      "reuse": true,
      "core": true
     },
     {
      "w": "spider",
      "zh": "蜘蛛",
      "e": "🕷️",
      "reuse": true,
      "core": true
     },
     {
      "w": "bat",
      "zh": "蝙蝠",
      "e": "🦇",
      "reuse": true
     },
     {
      "w": "snake",
      "zh": "蛇",
      "e": "🐍",
      "reuse": true
     }
    ]
   },
   {
    "id": "pu3-u5",
    "mod": 5,
    "title": "Unit 5 · Feelings and friends",
    "zh": "情绪与朋友",
    "tip": "本单元任务：做「情绪温度计」并说说原因。",
    "grammar": "Why are you ...? Because ...；形容词描述人",
    "sentences": [
     {
      "en": "Why are you sad?",
      "zh": "你为什么难过？"
     },
     {
      "en": "Because my team lost the game.",
      "zh": "因为我们队输了比赛。"
     },
     {
      "en": "Don't worry, we can try again!",
      "zh": "别担心，我们可以再试！"
     }
    ],
    "clil": {
     "t": "🧠 CLIL · 心理健康：说出情绪",
     "kid": "把情绪说出来（I'm sad / I'm excited）是管理情绪的第一步——说出来，就轻松一半。"
    },
    "values": {
     "t": "💛 素养 · 安慰朋友",
     "kid": "朋友难过时陪着他、听他说——安慰不需要大道理，需要好朋友。"
    },
    "words": [
     {
      "w": "happy",
      "zh": "开心的",
      "e": "😄",
      "reuse": true,
      "core": true
     },
     {
      "w": "sad",
      "zh": "难过的",
      "e": "😔",
      "reuse": true,
      "core": true
     },
     {
      "w": "angry",
      "zh": "生气的",
      "e": "😠",
      "reuse": true,
      "core": true
     },
     {
      "w": "afraid",
      "zh": "害怕的",
      "e": "😨",
      "reuse": true,
      "core": true
     },
     {
      "w": "excited",
      "zh": "兴奋的",
      "e": "🤩",
      "reuse": true,
      "core": true
     },
     {
      "w": "bored",
      "zh": "感到无聊的（人）",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "surprised",
      "zh": "惊讶的",
      "e": "😲",
      "reuse": true,
      "core": true
     },
     {
      "w": "proud",
      "zh": "自豪的",
      "e": "😎",
      "reuse": true,
      "core": true
     },
     {
      "w": "shy",
      "zh": "害羞的",
      "e": "😳",
      "reuse": true,
      "core": true
     },
     {
      "w": "smile",
      "zh": "微笑",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "feel",
      "zh": "感觉",
      "e": "🫶",
      "reuse": true
     },
     {
      "w": "friend",
      "zh": "朋友",
      "e": "🤝",
      "reuse": true
     }
    ]
   },
   {
    "id": "pu3-u6",
    "mod": 6,
    "title": "Unit 6 · Places in town",
    "zh": "城镇里的地方",
    "tip": "本单元任务：画一张小镇地图，标出地点并指路。",
    "grammar": "Where is ...? Go straight / turn left；地点名词搭配（at the bank）",
    "sentences": [
     {
      "en": "Turn left at the bank.",
      "zh": "在银行左转。"
     },
     {
      "en": "The museum is next to the park.",
      "zh": "博物馆紧挨着公园。"
     },
     {
      "en": "How do I get to the library?",
      "zh": "图书馆怎么走？"
     }
    ],
    "clil": {
     "t": "🌍 CLIL · 社会：城镇功能分区",
     "kid": "hospital 救人、library 借书、bank 存钱——城镇里每个地方都有自己的工作。"
    },
    "values": {
     "t": "💛 素养 · 公共场所轻声",
     "kid": "图书馆和医院里轻声说话——安静的场所需要每个人守护。"
    },
    "words": [
     {
      "w": "park",
      "zh": "公园",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "zoo",
      "zh": "动物园",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "shop",
      "zh": "商店",
      "e": "🏪",
      "reuse": true,
      "core": true
     },
     {
      "w": "supermarket",
      "zh": "超市",
      "e": "🛒",
      "reuse": true,
      "core": true
     },
     {
      "w": "hospital",
      "zh": "医院",
      "e": "🏥",
      "reuse": true,
      "core": true
     },
     {
      "w": "library",
      "zh": "图书馆",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "cinema",
      "zh": "电影院",
      "e": "🎦",
      "reuse": true,
      "core": true
     },
     {
      "w": "museum",
      "zh": "博物馆",
      "e": "🏛️",
      "reuse": true,
      "core": true
     },
     {
      "w": "hotel",
      "zh": "旅馆",
      "e": "🏨",
      "reuse": true,
      "core": true
     },
     {
      "w": "restaurant",
      "zh": "餐馆",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "bank",
      "zh": "银行",
      "e": "🏦",
      "reuse": true
     },
     {
      "w": "city",
      "zh": "城市",
      "e": "🏙️",
      "reuse": true
     },
     {
      "w": "town",
      "zh": "城镇",
      "e": "🏘️",
      "reuse": true
     },
     {
      "w": "street",
      "zh": "街道",
      "e": "",
      "reuse": true
     }
    ]
   },
   {
    "id": "pu3-r2",
    "mod": 0,
    "title": "Review 4-6",
    "zh": "复习 4-6",
    "tip": "A2 Flyers 题型练：Listening Part 4。",
    "grammar": "复习：Why/Because、地点与职业、there was/were",
    "words": [
     {
      "w": "happy",
      "zh": "开心的",
      "e": "😄",
      "reuse": true
     },
     {
      "w": "afraid",
      "zh": "害怕的",
      "e": "😨",
      "reuse": true
     },
     {
      "w": "excited",
      "zh": "兴奋的",
      "e": "🤩",
      "reuse": true
     },
     {
      "w": "proud",
      "zh": "自豪的",
      "e": "😎",
      "reuse": true
     },
     {
      "w": "friend",
      "zh": "朋友",
      "e": "🤝",
      "reuse": true
     },
     {
      "w": "park",
      "zh": "公园",
      "e": "",
      "reuse": true
     },
     {
      "w": "supermarket",
      "zh": "超市",
      "e": "🛒",
      "reuse": true
     },
     {
      "w": "hospital",
      "zh": "医院",
      "e": "🏥",
      "reuse": true
     },
     {
      "w": "library",
      "zh": "图书馆",
      "e": "",
      "reuse": true
     },
     {
      "w": "cinema",
      "zh": "电影院",
      "e": "🎦",
      "reuse": true
     },
     {
      "w": "doctor",
      "zh": "医生",
      "e": "👨‍⚕️",
      "reuse": true
     },
     {
      "w": "pilot",
      "zh": "飞行员",
      "e": "👨‍✈️",
      "reuse": true
     },
     {
      "w": "scientist",
      "zh": "科学家",
      "e": "🔬",
      "reuse": true
     },
     {
      "w": "street",
      "zh": "街道",
      "e": "",
      "reuse": true
     }
    ]
   },
   {
    "id": "pu3-u7",
    "mod": 7,
    "title": "Unit 7 · People and jobs",
    "zh": "人们与职业",
    "tip": "本单元任务：采访一位家人的职业。",
    "grammar": "What does he/she do? 三单问答；work in/at 搭配",
    "sentences": [
     {
      "en": "My aunt is a pilot.",
      "zh": "我姑姑是飞行员。"
     },
     {
      "en": "She works at a big company.",
      "zh": "她在大公司工作。"
     },
     {
      "en": "What does your father do?",
      "zh": "你爸爸做什么工作？"
     }
    ],
    "clil": {
     "t": "🌍 CLIL · 社会：职业与工具",
     "kid": "pilot 开飞机、writer 用笔、scientist 用实验——每个职业都有自己的工具箱。"
    },
    "values": {
     "t": "💛 素养 · 尊重每一种职业",
     "kid": "清洁工让城市干净、农民让餐桌丰盛——每种职业都值得说 thank you。"
    },
    "words": [
     {
      "w": "doctor",
      "zh": "医生",
      "e": "👨‍⚕️",
      "reuse": true,
      "core": true
     },
     {
      "w": "nurse",
      "zh": "护士",
      "e": "👩‍⚕️",
      "reuse": true,
      "core": true
     },
     {
      "w": "driver",
      "zh": "司机",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "cook",
      "zh": "厨师",
      "e": "👩‍🍳",
      "reuse": true,
      "core": true
     },
     {
      "w": "farmer",
      "zh": "农民",
      "e": "👨‍🌾",
      "reuse": true,
      "core": true
     },
     {
      "w": "policeman",
      "zh": "警察",
      "e": "👮",
      "reuse": true,
      "core": true
     },
     {
      "w": "worker",
      "zh": "工人",
      "e": "👷",
      "reuse": true,
      "core": true
     },
     {
      "w": "singer",
      "zh": "歌手",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "dancer",
      "zh": "舞蹈家",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "writer",
      "zh": "作家",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "pilot",
      "zh": "飞行员",
      "e": "👨‍✈️",
      "reuse": true
     },
     {
      "w": "scientist",
      "zh": "科学家",
      "e": "🔬",
      "reuse": true
     },
     {
      "w": "job",
      "zh": "工作",
      "e": "",
      "reuse": true
     },
     {
      "w": "vet",
      "zh": "兽医",
      "e": "🐕",
      "reuse": true
     }
    ]
   },
   {
    "id": "pu3-u8",
    "mod": 8,
    "title": "Unit 8 · Nature around us",
    "zh": "我们身边的自然",
    "tip": "本单元任务：做一页自然观察笔记。",
    "grammar": "there is/there are 的过去式 there was/were",
    "sentences": [
     {
      "en": "There was a river near my school.",
      "zh": "以前学校附近有条河。"
     },
     {
      "en": "The stars are bright tonight.",
      "zh": "今晚星星很亮。"
     },
     {
      "en": "Look at that tall mountain!",
      "zh": "看那座高山！"
     }
    ],
    "clil": {
     "t": "🔬 CLIL · 科学：河流从哪里来",
     "kid": "河流从 mountain 流向 sea——一路汇集小溪，越流越宽，就像知识越学越多。"
    },
    "values": {
     "t": "💛 素养 · 爱护自然环境",
     "kid": "不往河里丢垃圾、不摘花折树——大自然的美留给下一个人。"
    },
    "words": [
     {
      "w": "tree",
      "zh": "树",
      "e": "🌳",
      "reuse": true,
      "core": true
     },
     {
      "w": "flower",
      "zh": "花",
      "e": "🌸",
      "reuse": true,
      "core": true
     },
     {
      "w": "river",
      "zh": "河",
      "e": "🏞️",
      "reuse": true,
      "core": true
     },
     {
      "w": "mountain",
      "zh": "大山",
      "e": "⛰️",
      "reuse": true,
      "core": true
     },
     {
      "w": "sea",
      "zh": "大海",
      "e": "🌊",
      "reuse": true,
      "core": true
     },
     {
      "w": "forest",
      "zh": "森林",
      "e": "🌲",
      "reuse": true,
      "core": true
     },
     {
      "w": "lake",
      "zh": "湖",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "hill",
      "zh": "小山",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "grass",
      "zh": "草",
      "e": "🌱",
      "reuse": true,
      "core": true
     },
     {
      "w": "field",
      "zh": "田野",
      "e": "🌾",
      "reuse": true,
      "core": true
     },
     {
      "w": "sky",
      "zh": "天空",
      "e": "",
      "reuse": true
     },
     {
      "w": "moon",
      "zh": "月亮",
      "e": "🌙",
      "reuse": true
     },
     {
      "w": "star",
      "zh": "星星",
      "e": "⭐",
      "reuse": true
     }
    ]
   },
   {
    "id": "pu3-u9",
    "mod": 9,
    "title": "Unit 9 · Getting around",
    "zh": "出行方式",
    "tip": "本单元任务：规划一次城市出行路线并说明。",
    "grammar": "by bus/by train 乘行方式；How do you go to school?",
    "sentences": [
     {
      "en": "I go to school by bus.",
      "zh": "我坐公交上学。"
     },
     {
      "en": "The train is faster than the bus.",
      "zh": "火车比公交快。"
     },
     {
      "en": "How long does it take?",
      "zh": "要花多长时间？"
     }
    ],
    "clil": {
     "t": "🔢 CLIL · 数学：比较出行时间",
     "kid": "bus 40 分钟，subway 25 分钟——把时间画成条形图，一眼看出哪种更快。"
    },
    "values": {
     "t": "💛 素养 · 排队上车",
     "kid": "先下后上、排队等候——交通规则让每个人都安全。"
    },
    "words": [
     {
      "w": "bus",
      "zh": "公交车",
      "e": "🚌",
      "reuse": true,
      "core": true
     },
     {
      "w": "taxi",
      "zh": "出租车",
      "e": "🚕",
      "reuse": true,
      "core": true
     },
     {
      "w": "train",
      "zh": "火车",
      "e": "🚂",
      "reuse": true,
      "core": true
     },
     {
      "w": "subway",
      "zh": "地铁",
      "e": "🚇",
      "reuse": true,
      "core": true
     },
     {
      "w": "ship",
      "zh": "轮船",
      "e": "🚢",
      "reuse": true,
      "core": true
     },
     {
      "w": "plane",
      "zh": "飞机",
      "e": "✈️",
      "reuse": true,
      "core": true
     },
     {
      "w": "boat",
      "zh": "小船",
      "e": "⛵",
      "reuse": true,
      "core": true
     },
     {
      "w": "bike",
      "zh": "自行车",
      "e": "🚲",
      "reuse": true,
      "core": true
     },
     {
      "w": "road",
      "zh": "马路",
      "e": "🛣️",
      "reuse": true,
      "core": true
     },
     {
      "w": "street",
      "zh": "街道",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "bridge",
      "zh": "桥",
      "e": "🌉",
      "reuse": true
     },
     {
      "w": "station",
      "zh": "车站",
      "e": "🚉",
      "reuse": true
     },
     {
      "w": "airport",
      "zh": "机场",
      "e": "🛫",
      "reuse": true
     },
     {
      "w": "traffic",
      "zh": "交通",
      "e": "🚥",
      "reuse": true
     }
    ]
   },
   {
    "id": "pu3-r3",
    "mod": 0,
    "title": "Review 7-9",
    "zh": "复习 7-9",
    "tip": "A2 Flyers 模拟题：Reading & Writing Part 6。",
    "grammar": "复习：by+交通、自然词、一般过去时",
    "words": [
     {
      "w": "bus",
      "zh": "公交车",
      "e": "🚌",
      "reuse": true
     },
     {
      "w": "train",
      "zh": "火车",
      "e": "🚂",
      "reuse": true
     },
     {
      "w": "subway",
      "zh": "地铁",
      "e": "🚇",
      "reuse": true
     },
     {
      "w": "airport",
      "zh": "机场",
      "e": "🛫",
      "reuse": true
     },
     {
      "w": "traffic",
      "zh": "交通",
      "e": "🚥",
      "reuse": true
     },
     {
      "w": "tree",
      "zh": "树",
      "e": "🌳",
      "reuse": true
     },
     {
      "w": "river",
      "zh": "河",
      "e": "🏞️",
      "reuse": true
     },
     {
      "w": "mountain",
      "zh": "大山",
      "e": "⛰️",
      "reuse": true
     },
     {
      "w": "forest",
      "zh": "森林",
      "e": "🌲",
      "reuse": true
     },
     {
      "w": "sea",
      "zh": "大海",
      "e": "🌊",
      "reuse": true
     },
     {
      "w": "star",
      "zh": "星星",
      "e": "⭐",
      "reuse": true
     },
     {
      "w": "boat",
      "zh": "小船",
      "e": "⛵",
      "reuse": true
     },
     {
      "w": "bike",
      "zh": "自行车",
      "e": "🚲",
      "reuse": true
     },
     {
      "w": "bridge",
      "zh": "桥",
      "e": "🌉",
      "reuse": true
     }
    ]
   }
  ]
 },
 {
  "id": "pu4",
  "name": "Power Up 4",
  "exam": "A2 Flyers → A2 Key",
  "title": "剑桥 Power Up 4（Flyers 备考收官 · 通往 A2 Key）",
  "units": [
   {
    "id": "pu4-u1",
    "mod": 1,
    "title": "Unit 1 · School subjects",
    "zh": "学校学科",
    "tip": "本单元任务：做一张个人课表并排喜好。",
    "grammar": "like/love/enjoy + doing；序数词 first/second/third",
    "sentences": [
     {
      "en": "I like art best of all.",
      "zh": "所有学科里我最喜欢美术。"
     },
     {
      "en": "We have PE on Monday and Friday.",
      "zh": "周一和周五有体育课。"
     },
     {
      "en": "Science is interesting but hard.",
      "zh": "科学有趣但是难。"
     }
    ],
    "clil": {
     "t": "🎨 CLIL · 艺术：课程表设计",
     "kid": "给课表配上颜色和图标——信息设计得好看，一眼就能看明白。"
    },
    "values": {
     "t": "💛 素养 · 每科都认真",
     "kid": "不喜欢的科目也要认真——认真是你对所有事的尊重。"
    },
    "words": [
     {
      "w": "Chinese",
      "zh": "语文",
      "e": "🀄",
      "reuse": true,
      "core": true
     },
     {
      "w": "English",
      "zh": "英语",
      "e": "🔠",
      "reuse": true,
      "core": true
     },
     {
      "w": "math",
      "zh": "数学",
      "e": "➗",
      "reuse": true,
      "core": true
     },
     {
      "w": "music",
      "zh": "音乐",
      "e": "🎵",
      "reuse": true,
      "core": true
     },
     {
      "w": "art",
      "zh": "美术",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "PE",
      "zh": "体育",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "science",
      "zh": "科学",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "computer",
      "zh": "电脑",
      "e": "💻",
      "reuse": true,
      "core": true
     },
     {
      "w": "lesson",
      "zh": "课",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "homework",
      "zh": "作业",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "subject",
      "zh": "学科",
      "e": "",
      "reuse": true
     },
     {
      "w": "test",
      "zh": "测验",
      "e": "",
      "reuse": true
     },
     {
      "w": "notebook",
      "zh": "笔记本",
      "e": "📓",
      "reuse": true
     },
     {
      "w": "dictionary",
      "zh": "词典",
      "e": "📕",
      "reuse": true
     }
    ]
   },
   {
    "id": "pu4-u2",
    "mod": 2,
    "title": "Unit 2 · Time and dates",
    "zh": "时间与日期",
    "tip": "本单元任务：做一张生日日历。",
    "grammar": "in + 月份；on + 具体日期；half past / a quarter to",
    "sentences": [
     {
      "en": "My birthday is in April.",
      "zh": "我的生日在四月。"
     },
     {
      "en": "It's half past three.",
      "zh": "现在三点半。"
     },
     {
      "en": "What's the date today?",
      "zh": "今天是几号？"
     }
    ],
    "clil": {
     "t": "🔢 CLIL · 数学：日历里的数学",
     "kid": "一年 12 个月 365 天，一个月约 30 天——日历里藏着除法和余数。"
    },
    "values": {
     "t": "💛 素养 · 守时",
     "kid": "约好的时间就要到——守时的人让每个人都安心。"
    },
    "words": [
     {
      "w": "hour",
      "zh": "小时",
      "e": "⏰",
      "reuse": true,
      "core": true
     },
     {
      "w": "minute",
      "zh": "分钟",
      "e": "⏲️",
      "reuse": true,
      "core": true
     },
     {
      "w": "half",
      "zh": "一半",
      "e": "🌗",
      "reuse": true,
      "core": true
     },
     {
      "w": "quarter",
      "zh": "一刻钟",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "past",
      "zh": "过去",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "noon",
      "zh": "正午",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "midnight",
      "zh": "午夜",
      "e": "🌃",
      "reuse": true,
      "core": true
     },
     {
      "w": "month",
      "zh": "月份",
      "e": "📆",
      "reuse": true,
      "core": true
     },
     {
      "w": "year",
      "zh": "年",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "January",
      "zh": "一月",
      "e": "1️⃣",
      "reuse": true,
      "core": true
     },
     {
      "w": "February",
      "zh": "二月",
      "e": "2️⃣",
      "reuse": true
     },
     {
      "w": "March",
      "zh": "三月",
      "e": "3️⃣",
      "reuse": true
     },
     {
      "w": "April",
      "zh": "四月",
      "e": "4️⃣",
      "reuse": true
     },
     {
      "w": "date",
      "zh": "日期",
      "e": "",
      "reuse": true
     }
    ]
   },
   {
    "id": "pu4-u3",
    "mod": 3,
    "title": "Unit 3 · Ocean animals",
    "zh": "海洋动物",
    "tip": "本单元任务：做一张海洋生物海报。",
    "grammar": "the largest/one of the ...（最高级初步）；whale/dolphin 量词搭配",
    "sentences": [
     {
      "en": "The whale is the largest animal in the sea.",
      "zh": "鲸是海里最大的动物。"
     },
     {
      "en": "Dolphins are very smart.",
      "zh": "海豚非常聪明。"
     },
     {
      "en": "Whales breathe air, not water!",
      "zh": "鲸呼吸的是空气，不是水！"
     }
    ],
    "clil": {
     "t": "🔬 CLIL · 科学：海洋哺乳动物",
     "kid": "whale 和 dolphin 住在海里却呼吸空气——它们是哺乳动物，要浮上水面换气。"
    },
    "values": {
     "t": "💛 素养 · 海洋垃圾问题",
     "kid": "塑料袋在海里像水母，海龟会误食——少用一个塑料袋就是救一条生命。"
    },
    "words": [
     {
      "w": "whale",
      "zh": "鲸鱼",
      "e": "🐳",
      "reuse": true,
      "core": true
     },
     {
      "w": "dolphin",
      "zh": "海豚",
      "e": "🐬",
      "reuse": true,
      "core": true
     },
     {
      "w": "shark",
      "zh": "鲨鱼",
      "e": "🦈",
      "reuse": true,
      "core": true
     },
     {
      "w": "octopus",
      "zh": "章鱼",
      "e": "🐙",
      "reuse": true,
      "core": true
     },
     {
      "w": "crab",
      "zh": "螃蟹",
      "e": "🦀",
      "reuse": true,
      "core": true
     },
     {
      "w": "goldfish",
      "zh": "金鱼",
      "e": "🐠",
      "reuse": true,
      "core": true
     },
     {
      "w": "starfish",
      "zh": "海星",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "seal",
      "zh": "海豹",
      "e": "🦭",
      "reuse": true,
      "core": true
     },
     {
      "w": "sea",
      "zh": "大海",
      "e": "🌊",
      "reuse": true,
      "core": true
     },
     {
      "w": "ocean",
      "zh": "海洋",
      "e": "🌊",
      "reuse": true,
      "core": true
     },
     {
      "w": "island",
      "zh": "岛",
      "e": "🏝️",
      "reuse": true
     }
    ]
   },
   {
    "id": "pu4-r1",
    "mod": 0,
    "title": "Review 1-3",
    "zh": "复习 1-3",
    "tip": "A2 Flyers 收官练 + A2 Key 入门题。",
    "grammar": "复习：enjoy+doing、序数词、最高级初步",
    "words": [
     {
      "w": "English",
      "zh": "英语",
      "e": "🔠",
      "reuse": true
     },
     {
      "w": "math",
      "zh": "数学",
      "e": "➗",
      "reuse": true
     },
     {
      "w": "science",
      "zh": "科学",
      "e": "",
      "reuse": true
     },
     {
      "w": "homework",
      "zh": "作业",
      "e": "",
      "reuse": true
     },
     {
      "w": "subject",
      "zh": "学科",
      "e": "",
      "reuse": true
     },
     {
      "w": "hour",
      "zh": "小时",
      "e": "⏰",
      "reuse": true
     },
     {
      "w": "minute",
      "zh": "分钟",
      "e": "⏲️",
      "reuse": true
     },
     {
      "w": "quarter",
      "zh": "一刻钟",
      "e": "",
      "reuse": true
     },
     {
      "w": "whale",
      "zh": "鲸鱼",
      "e": "🐳",
      "reuse": true
     },
     {
      "w": "dolphin",
      "zh": "海豚",
      "e": "🐬",
      "reuse": true
     },
     {
      "w": "shark",
      "zh": "鲨鱼",
      "e": "🦈",
      "reuse": true
     },
     {
      "w": "octopus",
      "zh": "章鱼",
      "e": "🐙",
      "reuse": true
     },
     {
      "w": "sea",
      "zh": "大海",
      "e": "🌊",
      "reuse": true
     },
     {
      "w": "island",
      "zh": "岛",
      "e": "🏝️",
      "reuse": true
     }
    ]
   },
   {
    "id": "pu4-u4",
    "mod": 4,
    "title": "Unit 4 · Seasons and weather",
    "zh": "季节与天气",
    "tip": "本单元任务：播报未来三天天气预报。",
    "grammar": "will 表预测（It will rain）；wear + 服装建议",
    "sentences": [
     {
      "en": "It will be stormy tomorrow.",
      "zh": "明天会有暴风雨。"
     },
     {
      "en": "Take an umbrella with you.",
      "zh": "带上雨伞。"
     },
     {
      "en": "The temperature is 15 degrees.",
      "zh": "气温十五度。"
     }
    ],
    "clil": {
     "t": "🔬 CLIL · 科学：水循环",
     "kid": "海面蒸发成云、云变成 rain 落下、雨水流回大海——水一直在旅行，这就是水循环。"
    },
    "values": {
     "t": "💛 素养 · 提醒家人",
     "kid": "出门前看天气预报，提醒家人带伞——看天气是一种关心。"
    },
    "words": [
     {
      "w": "spring",
      "zh": "春天",
      "e": "🌼",
      "reuse": true,
      "core": true
     },
     {
      "w": "summer",
      "zh": "夏天",
      "e": "🌞",
      "reuse": true,
      "core": true
     },
     {
      "w": "autumn",
      "zh": "秋天",
      "e": "🍁",
      "reuse": true,
      "core": true
     },
     {
      "w": "season",
      "zh": "季节",
      "e": "🔄",
      "reuse": true,
      "core": true
     },
     {
      "w": "weather",
      "zh": "天气",
      "e": "🌤️",
      "reuse": true,
      "core": true
     },
     {
      "w": "storm",
      "zh": "暴风雨",
      "e": "⛈️",
      "reuse": true,
      "core": true
     },
     {
      "w": "fog",
      "zh": "雾",
      "e": "🌫️",
      "reuse": true,
      "core": true
     },
     {
      "w": "ice",
      "zh": "冰",
      "e": "🧊",
      "reuse": true,
      "core": true
     },
     {
      "w": "dry",
      "zh": "干的",
      "e": "🏜️",
      "reuse": true,
      "core": true
     },
     {
      "w": "wet",
      "zh": "湿的",
      "e": "💦",
      "reuse": true,
      "core": true
     },
     {
      "w": "shower",
      "zh": "阵雨",
      "e": "🌦️",
      "reuse": true
     },
     {
      "w": "temperature",
      "zh": "温度",
      "e": "",
      "reuse": true
     },
     {
      "w": "degree",
      "zh": "度数",
      "e": "",
      "reuse": true
     },
     {
      "w": "raincoat",
      "zh": "雨衣",
      "e": "",
      "reuse": true
     },
     {
      "w": "umbrella",
      "zh": "雨伞",
      "e": "☂️",
      "reuse": true
     }
    ]
   },
   {
    "id": "pu4-u5",
    "mod": 5,
    "title": "Unit 5 · Daily routines and chores",
    "zh": "日常与家务",
    "tip": "本单元任务：做一张家务轮值表。",
    "grammar": "have to / has to 表示必须；频率副词 always/usually/sometimes",
    "sentences": [
     {
      "en": "I have to wash the dishes.",
      "zh": "我得洗碗。"
     },
     {
      "en": "She makes the bed every morning.",
      "zh": "她每天早上整理床铺。"
     },
     {
      "en": "I always clean my room on Sunday.",
      "zh": "我周日总是打扫房间。"
     }
    ],
    "clil": {
     "t": "🔢 CLIL · 数学：家务时间统计",
     "kid": "把一周的家务时间记下来画成图表——数据会告诉你谁做得最多。"
    },
    "values": {
     "t": "💛 素养 · 家务人人有份",
     "kid": "家是每个人的家——家务不是妈妈一个人的事。"
    },
    "words": [
     {
      "w": "wash",
      "zh": "洗",
      "e": "🚿",
      "reuse": true,
      "core": true
     },
     {
      "w": "clean",
      "zh": "干净的",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "cook",
      "zh": "厨师",
      "e": "👩‍🍳",
      "reuse": true,
      "core": true
     },
     {
      "w": "help",
      "zh": "帮助",
      "e": "🆘",
      "reuse": true,
      "core": true
     },
     {
      "w": "make",
      "zh": "制作",
      "e": "🔨",
      "reuse": true,
      "core": true
     },
     {
      "w": "put",
      "zh": "放",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "take",
      "zh": "拿走",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "bring",
      "zh": "带来",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "kitchen",
      "zh": "厨房",
      "e": "🍳",
      "reuse": true,
      "core": true
     },
     {
      "w": "fridge",
      "zh": "冰箱",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "clock",
      "zh": "钟",
      "e": "🕰️",
      "reuse": true
     },
     {
      "w": "watch",
      "zh": "手表",
      "e": "⌚",
      "reuse": true
     },
     {
      "w": "mirror",
      "zh": "镜子",
      "e": "🪞",
      "reuse": true
     }
    ]
   },
   {
    "id": "pu4-u6",
    "mod": 6,
    "title": "Unit 6 · Personality",
    "zh": "性格与品格",
    "tip": "本单元任务：给一位同学写「性格奖状」。",
    "grammar": "be + 性格形容词；who 描述人（a friend who is kind）",
    "sentences": [
     {
      "en": "She is kind to everyone.",
      "zh": "她对每个人都友善。"
     },
     {
      "en": "He never gives up.",
      "zh": "他从不放弃。"
     },
     {
      "en": "A friend who is honest is a real friend.",
      "zh": "诚实的朋友才是真朋友。"
     }
    ],
    "clil": {
     "t": "📖 CLIL · 文学：从行为看性格",
     "kid": "故事里不直接说人物性格——他扶起摔倒的同学，你就知道他很 kind。"
    },
    "values": {
     "t": "💛 素养 · 发现别人的优点",
     "kid": "每天发现一位同学的一个优点——你也会变成大家最喜欢的同学。"
    },
    "words": [
     {
      "w": "kind",
      "zh": "善良的",
      "e": "💞",
      "reuse": true,
      "core": true
     },
     {
      "w": "brave",
      "zh": "勇敢的",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "smart",
      "zh": "聪明的",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "clever",
      "zh": "机灵的",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "lazy",
      "zh": "懒惰的",
      "e": "🦥",
      "reuse": true,
      "core": true
     },
     {
      "w": "funny",
      "zh": "滑稽的",
      "e": "🤡",
      "reuse": true,
      "core": true
     },
     {
      "w": "strict",
      "zh": "严格的",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "friendly",
      "zh": "友好的",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "honest",
      "zh": "诚实的",
      "e": "🤞",
      "reuse": true,
      "core": true
     },
     {
      "w": "polite",
      "zh": "有礼貌的",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "patient",
      "zh": "耐心的",
      "e": "",
      "reuse": true
     },
     {
      "w": "active",
      "zh": "活跃的",
      "e": "",
      "reuse": true
     }
    ]
   },
   {
    "id": "pu4-r2",
    "mod": 0,
    "title": "Review 4-6",
    "zh": "复习 4-6",
    "tip": "A2 Key 题型练：Reading Part 2。",
    "grammar": "复习：will、have to、性格形容词",
    "words": [
     {
      "w": "spring",
      "zh": "春天",
      "e": "🌼",
      "reuse": true
     },
     {
      "w": "summer",
      "zh": "夏天",
      "e": "🌞",
      "reuse": true
     },
     {
      "w": "autumn",
      "zh": "秋天",
      "e": "🍁",
      "reuse": true
     },
     {
      "w": "season",
      "zh": "季节",
      "e": "🔄",
      "reuse": true
     },
     {
      "w": "storm",
      "zh": "暴风雨",
      "e": "⛈️",
      "reuse": true
     },
     {
      "w": "temperature",
      "zh": "温度",
      "e": "",
      "reuse": true
     },
     {
      "w": "raincoat",
      "zh": "雨衣",
      "e": "",
      "reuse": true
     },
     {
      "w": "umbrella",
      "zh": "雨伞",
      "e": "☂️",
      "reuse": true
     },
     {
      "w": "wash",
      "zh": "洗",
      "e": "🚿",
      "reuse": true
     },
     {
      "w": "cook",
      "zh": "厨师",
      "e": "👩‍🍳",
      "reuse": true
     },
     {
      "w": "kitchen",
      "zh": "厨房",
      "e": "🍳",
      "reuse": true
     },
     {
      "w": "clock",
      "zh": "钟",
      "e": "🕰️",
      "reuse": true
     },
     {
      "w": "kind",
      "zh": "善良的",
      "e": "💞",
      "reuse": true
     },
     {
      "w": "honest",
      "zh": "诚实的",
      "e": "🤞",
      "reuse": true
     }
    ]
   },
   {
    "id": "pu4-u7",
    "mod": 7,
    "title": "Unit 7 · Money and shopping",
    "zh": "金钱与购物",
    "tip": "本单元任务：模拟商店买卖对话。",
    "grammar": "How much is/are ...? too + 形容词（too expensive）",
    "sentences": [
     {
      "en": "This T-shirt is too expensive.",
      "zh": "这件 T 恤太贵了。"
     },
     {
      "en": "How much is this hat?",
      "zh": "这顶帽子多少钱？"
     },
     {
      "en": "I pay with my pocket money.",
      "zh": "我用零花钱付。"
     }
    ],
    "clil": {
     "t": "🔢 CLIL · 数学：价格计算",
     "kid": "两件 15 元的东西加起来是多少？找零怎么算？购物是最真实的数学课。"
    },
    "values": {
     "t": "💛 素养 · 理性消费",
     "kid": "买之前问自己：需要，还是想要？想清楚再花钱。"
    },
    "words": [
     {
      "w": "money",
      "zh": "钱",
      "e": "💰",
      "reuse": true,
      "core": true
     },
     {
      "w": "price",
      "zh": "价格",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "cheap",
      "zh": "便宜的",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "expensive",
      "zh": "昂贵的",
      "e": "💎",
      "reuse": true,
      "core": true
     },
     {
      "w": "buy",
      "zh": "买",
      "e": "🛍️",
      "reuse": true,
      "core": true
     },
     {
      "w": "sell",
      "zh": "卖",
      "e": "🏷️",
      "reuse": true,
      "core": true
     },
     {
      "w": "pay",
      "zh": "付款",
      "e": "💳",
      "reuse": true,
      "core": true
     },
     {
      "w": "cost",
      "zh": "花费",
      "e": "💸",
      "reuse": true,
      "core": true
     },
     {
      "w": "market",
      "zh": "市场",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "list",
      "zh": "清单",
      "e": "📋",
      "reuse": true,
      "core": true
     },
     {
      "w": "size",
      "zh": "尺码",
      "e": "",
      "reuse": true
     },
     {
      "w": "customer",
      "zh": "顾客",
      "e": "",
      "reuse": true
     }
    ]
   },
   {
    "id": "pu4-u8",
    "mod": 8,
    "title": "Unit 8 · Travel and places",
    "zh": "旅行与地点",
    "tip": "本单元任务：设计一次周末旅行计划卡。",
    "grammar": "be going to 表计划；by plane / on foot",
    "sentences": [
     {
      "en": "We are going to the beach by car.",
      "zh": "我们打算开车去海滩。"
     },
     {
      "en": "Don't forget your suitcase!",
      "zh": "别忘了你的行李箱！"
     },
     {
      "en": "I can't wait to see the sea!",
      "zh": "我等不及要看大海了！"
     }
    ],
    "clil": {
     "t": "🌍 CLIL · 地理：海滩是怎么形成的",
     "kid": "海浪把石头打磨了几千年，变成了 sand——beach 是大海的雕刻作品。"
    },
    "values": {
     "t": "💛 素养 · 旅行环保",
     "kid": "离开沙滩时带走自己的垃圾——把美丽留给下一批游客。"
    },
    "words": [
     {
      "w": "travel",
      "zh": "旅行",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "trip",
      "zh": "旅程",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "tour",
      "zh": "观光",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "visit",
      "zh": "参观",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "ticket",
      "zh": "票",
      "e": "🎫",
      "reuse": true,
      "core": true
     },
     {
      "w": "suitcase",
      "zh": "行李箱",
      "e": "🧳",
      "reuse": true,
      "core": true
     },
     {
      "w": "beach",
      "zh": "海滩",
      "e": "🏖️",
      "reuse": true,
      "core": true
     },
     {
      "w": "island",
      "zh": "岛",
      "e": "🏝️",
      "reuse": true,
      "core": true
     },
     {
      "w": "camp",
      "zh": "露营",
      "e": "⛺",
      "reuse": true,
      "core": true
     },
     {
      "w": "photo",
      "zh": "照片",
      "e": "📷",
      "reuse": true,
      "core": true
     },
     {
      "w": "vacation",
      "zh": "度假",
      "e": "🌴",
      "reuse": true
     },
     {
      "w": "map",
      "zh": "地图",
      "e": "🗺️",
      "reuse": true
     },
     {
      "w": "east",
      "zh": "东方",
      "e": "",
      "reuse": true
     },
     {
      "w": "west",
      "zh": "西方",
      "e": "",
      "reuse": true
     }
    ]
   },
   {
    "id": "pu4-u9",
    "mod": 9,
    "title": "Unit 9 · Media and arts",
    "zh": "媒体与艺术",
    "tip": "本单元任务：做一份班级节目单。",
    "grammar": "like/love + doing 复习；句型 There is a programme about ...",
    "sentences": [
     {
      "en": "There is a concert on TV tonight.",
      "zh": "今晚电视上有音乐会。"
     },
     {
      "en": "I painted a picture of my family.",
      "zh": "我画了一张全家福。"
     },
     {
      "en": "Music makes me happy.",
      "zh": "音乐让我开心。"
     }
    ],
    "clil": {
     "t": "🎨 CLIL · 艺术：乐器家族",
     "kid": "piano 和 violin 是弦与键的家族——不同乐器振动的方式不同，声音就不同。"
    },
    "values": {
     "t": "💛 素养 · 尊重表演者",
     "kid": "演出结束再鼓掌，安静听完整首曲子——掌声是最好的赞美。"
    },
    "words": [
     {
      "w": "TV",
      "zh": "电视",
      "e": "📺",
      "reuse": true,
      "core": true
     },
     {
      "w": "phone",
      "zh": "电话",
      "e": "📱",
      "reuse": true,
      "core": true
     },
     {
      "w": "email",
      "zh": "电子邮件",
      "e": "📧",
      "reuse": true,
      "core": true
     },
     {
      "w": "film",
      "zh": "电影",
      "e": "🎬",
      "reuse": true,
      "core": true
     },
     {
      "w": "cartoon",
      "zh": "动画片",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "story",
      "zh": "故事",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "magazine",
      "zh": "杂志",
      "e": "📔",
      "reuse": true,
      "core": true
     },
     {
      "w": "piano",
      "zh": "钢琴",
      "e": "🎹",
      "reuse": true,
      "core": true
     },
     {
      "w": "guitar",
      "zh": "吉他",
      "e": "🎸",
      "reuse": true,
      "core": true
     },
     {
      "w": "violin",
      "zh": "小提琴",
      "e": "🎻",
      "reuse": true,
      "core": true
     },
     {
      "w": "song",
      "zh": "歌曲",
      "e": "🎶",
      "reuse": true
     },
     {
      "w": "paint",
      "zh": "绘画",
      "e": "",
      "reuse": true
     },
     {
      "w": "brush",
      "zh": "画笔",
      "e": "🖌️",
      "reuse": true
     },
     {
      "w": "concert",
      "zh": "音乐会",
      "e": "",
      "reuse": true
     }
    ]
   },
   {
    "id": "pu4-r3",
    "mod": 0,
    "title": "Review 7-9",
    "zh": "复习 7-9",
    "tip": "A2 Key 模拟题：Listening Part 2。",
    "grammar": "复习：How much、be going to、媒体与艺术词",
    "words": [
     {
      "w": "money",
      "zh": "钱",
      "e": "💰",
      "reuse": true
     },
     {
      "w": "price",
      "zh": "价格",
      "e": "",
      "reuse": true
     },
     {
      "w": "expensive",
      "zh": "昂贵的",
      "e": "💎",
      "reuse": true
     },
     {
      "w": "market",
      "zh": "市场",
      "e": "",
      "reuse": true
     },
     {
      "w": "size",
      "zh": "尺码",
      "e": "",
      "reuse": true
     },
     {
      "w": "travel",
      "zh": "旅行",
      "e": "",
      "reuse": true
     },
     {
      "w": "ticket",
      "zh": "票",
      "e": "🎫",
      "reuse": true
     },
     {
      "w": "beach",
      "zh": "海滩",
      "e": "🏖️",
      "reuse": true
     },
     {
      "w": "photo",
      "zh": "照片",
      "e": "📷",
      "reuse": true
     },
     {
      "w": "TV",
      "zh": "电视",
      "e": "📺",
      "reuse": true
     },
     {
      "w": "phone",
      "zh": "电话",
      "e": "📱",
      "reuse": true
     },
     {
      "w": "piano",
      "zh": "钢琴",
      "e": "🎹",
      "reuse": true
     },
     {
      "w": "concert",
      "zh": "音乐会",
      "e": "",
      "reuse": true
     },
     {
      "w": "cartoon",
      "zh": "动画片",
      "e": "",
      "reuse": true
     }
    ]
   }
  ]
 },
 {
  "id": "pu5",
  "name": "Power Up 5",
  "exam": "A2 Key for Schools",
  "title": "剑桥 Power Up 5（A2 Key for Schools 备考）",
  "units": [
   {
    "id": "pu5-u1",
    "mod": 1,
    "title": "Unit 1 · Nature and environment",
    "zh": "自然与环境",
    "tip": "本单元任务：写一份班级环保公约。",
    "grammar": "must/mustn't 表示义务与禁止；protect + 名词",
    "sentences": [
     {
      "en": "We must protect the earth.",
      "zh": "我们必须保护地球。"
     },
     {
      "en": "Don't throw rubbish in the sea.",
      "zh": "不要往海里扔垃圾。"
     },
     {
      "en": "Recycling saves energy.",
      "zh": "回收利用节约能源。"
     }
    ],
    "clil": {
     "t": "🔬 CLIL · 科学：垃圾去哪了",
     "kid": "一个塑料瓶要 450 年才能消失——recycle 让它变成新瓶子，这是垃圾的第二次生命。"
    },
    "values": {
     "t": "💛 素养 · 随手环保",
     "kid": "随手关灯、自带水杯、双面用纸——环保不是大事，是每天的小事。"
    },
    "words": [
     {
      "w": "earth",
      "zh": "地球",
      "e": "🌍",
      "reuse": true,
      "core": true
     },
     {
      "w": "planet",
      "zh": "行星",
      "e": "🪐",
      "reuse": true,
      "core": true
     },
     {
      "w": "space",
      "zh": "太空",
      "e": "🌌",
      "reuse": true,
      "core": true
     },
     {
      "w": "rock",
      "zh": "岩石",
      "e": "🪨",
      "reuse": true,
      "core": true
     },
     {
      "w": "sand",
      "zh": "沙子",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "plant",
      "zh": "植物",
      "e": "🪴",
      "reuse": true,
      "core": true
     },
     {
      "w": "wood",
      "zh": "木头",
      "e": "🪵",
      "reuse": true,
      "core": true
     },
     {
      "w": "air",
      "zh": "空气",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "smoke",
      "zh": "烟",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "environment",
      "zh": "环境",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "pollution",
      "zh": "污染",
      "e": "🏭",
      "reuse": true
     },
     {
      "w": "rubbish",
      "zh": "垃圾",
      "e": "🗑️",
      "reuse": true
     },
     {
      "w": "recycle",
      "zh": "回收利用",
      "e": "♻️",
      "reuse": true
     },
     {
      "w": "energy",
      "zh": "能源",
      "e": "",
      "reuse": true
     }
    ]
   },
   {
    "id": "pu5-u2",
    "mod": 2,
    "title": "Unit 2 · Describing things",
    "zh": "描述事物",
    "tip": "本单元任务：「神秘物品」描述猜谜游戏。",
    "grammar": "形状/尺寸形容词排序（a big round …）；made of 材质表达",
    "sentences": [
     {
      "en": "This box is heavy but small.",
      "zh": "这个盒子重但小。"
     },
     {
      "en": "It's made of wood.",
      "zh": "它是木头做的。"
     },
     {
      "en": "The bag is light and cheap.",
      "zh": "这个包又轻又便宜。"
     }
    ],
    "clil": {
     "t": "🔬 CLIL · 科学：材料属性",
     "kid": "wood 浮在水面、stone 沉下去——材料不同，本领不同，用途就不同。"
    },
    "values": {
     "t": "💛 素养 · 描述准确",
     "kid": "说清楚「多大、多重、什么做的」——准确的描述是一种诚实。"
    },
    "words": [
     {
      "w": "circle",
      "zh": "圆形",
      "e": "⭕",
      "reuse": true,
      "core": true
     },
     {
      "w": "square",
      "zh": "正方形",
      "e": "🟥",
      "reuse": true,
      "core": true
     },
     {
      "w": "triangle",
      "zh": "三角形",
      "e": "🔺",
      "reuse": true,
      "core": true
     },
     {
      "w": "shape",
      "zh": "形状",
      "e": "🔷",
      "reuse": true,
      "core": true
     },
     {
      "w": "round",
      "zh": "圆的",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "big",
      "zh": "大的",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "small",
      "zh": "小的",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "long",
      "zh": "长的",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "short",
      "zh": "短的/矮的",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "heavy",
      "zh": "重的",
      "e": "🏋️",
      "reuse": true,
      "core": true
     },
     {
      "w": "light",
      "zh": "轻的",
      "e": "🪶",
      "reuse": true
     },
     {
      "w": "hard",
      "zh": "难的",
      "e": "",
      "reuse": true
     },
     {
      "w": "easy",
      "zh": "容易的",
      "e": "",
      "reuse": true
     },
     {
      "w": "clean",
      "zh": "干净的",
      "e": "",
      "reuse": true
     },
     {
      "w": "dirty",
      "zh": "脏的",
      "e": "",
      "reuse": true
     }
    ]
   },
   {
    "id": "pu5-u3",
    "mod": 3,
    "title": "Unit 3 · Health and habits",
    "zh": "健康与习惯",
    "tip": "本单元任务：做一周健康习惯打卡表。",
    "grammar": "How often ...? 频率回答；stay + 形容词（stay healthy）",
    "sentences": [
     {
      "en": "How often do you exercise?",
      "zh": "你多久锻炼一次？"
     },
     {
      "en": "Stay healthy and strong.",
      "zh": "保持健康强壮。"
     },
     {
      "en": "Exercise makes your body strong.",
      "zh": "锻炼让身体强壮。"
     }
    ],
    "clil": {
     "t": "🔬 CLIL · 科学：习惯与身体",
     "kid": "每天刷牙、按时睡觉、经常锻炼——身体的分数是按天攒出来的。"
    },
    "values": {
     "t": "💛 素养 · 坚持好习惯",
     "kid": "好习惯做一天容易，做一年才厉害——坚持就是你对自己说的话。"
    },
    "words": [
     {
      "w": "health",
      "zh": "健康",
      "e": "💚",
      "reuse": true,
      "core": true
     },
     {
      "w": "healthy",
      "zh": "健康的",
      "e": "🥗",
      "reuse": true,
      "core": true
     },
     {
      "w": "exercise",
      "zh": "锻炼",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "sick",
      "zh": "生病的",
      "e": "🤒",
      "reuse": true,
      "core": true
     },
     {
      "w": "medicine",
      "zh": "药",
      "e": "💊",
      "reuse": true,
      "core": true
     },
     {
      "w": "rest",
      "zh": "休息",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "vitamin",
      "zh": "维生素",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "body",
      "zh": "身体",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "safe",
      "zh": "安全的",
      "e": "🦺",
      "reuse": true,
      "core": true
     },
     {
      "w": "toothbrush",
      "zh": "牙刷",
      "e": "🪥",
      "reuse": true,
      "core": true
     },
     {
      "w": "soap",
      "zh": "香皂",
      "e": "🧼",
      "reuse": true
     }
    ]
   },
   {
    "id": "pu5-r1",
    "mod": 0,
    "title": "Review 1-3",
    "zh": "复习 1-3",
    "tip": "A2 Key 题型练：Reading Part 3。",
    "grammar": "复习：must/mustn't、描述事物、How often",
    "words": [
     {
      "w": "earth",
      "zh": "地球",
      "e": "🌍",
      "reuse": true
     },
     {
      "w": "space",
      "zh": "太空",
      "e": "🌌",
      "reuse": true
     },
     {
      "w": "plant",
      "zh": "植物",
      "e": "🪴",
      "reuse": true
     },
     {
      "w": "air",
      "zh": "空气",
      "e": "",
      "reuse": true
     },
     {
      "w": "environment",
      "zh": "环境",
      "e": "",
      "reuse": true
     },
     {
      "w": "pollution",
      "zh": "污染",
      "e": "🏭",
      "reuse": true
     },
     {
      "w": "rubbish",
      "zh": "垃圾",
      "e": "🗑️",
      "reuse": true
     },
     {
      "w": "recycle",
      "zh": "回收利用",
      "e": "♻️",
      "reuse": true
     },
     {
      "w": "energy",
      "zh": "能源",
      "e": "",
      "reuse": true
     },
     {
      "w": "shape",
      "zh": "形状",
      "e": "🔷",
      "reuse": true
     },
     {
      "w": "round",
      "zh": "圆的",
      "e": "",
      "reuse": true
     },
     {
      "w": "heavy",
      "zh": "重的",
      "e": "🏋️",
      "reuse": true
     },
     {
      "w": "health",
      "zh": "健康",
      "e": "💚",
      "reuse": true
     },
     {
      "w": "exercise",
      "zh": "锻炼",
      "e": "",
      "reuse": true
     }
    ]
   },
   {
    "id": "pu5-u4",
    "mod": 4,
    "title": "Unit 4 · Directions and places",
    "zh": "方向与位置",
    "tip": "本单元任务：画出从学校到家的路线图。",
    "grammar": "祈使指路 Turn left / Go along；near/far from",
    "sentences": [
     {
      "en": "Go along this street, then turn right.",
      "zh": "沿这条街走，然后右转。"
     },
     {
      "en": "It's far from my home.",
      "zh": "离我家很远。"
     },
     {
      "en": "Is it near the park?",
      "zh": "在公园附近吗？"
     }
    ],
    "clil": {
     "t": "🌍 CLIL · 地理：地图与方向",
     "kid": "上北下南左西右东——看懂地图的人，走到哪都不会迷路。"
    },
    "values": {
     "t": "💛 素养 · 帮助问路的人",
     "kid": "有人问路时，说清楚、有耐心——你曾是找不到路的小孩吗？"
    },
    "words": [
     {
      "w": "map",
      "zh": "地图",
      "e": "🗺️",
      "reuse": true,
      "core": true
     },
     {
      "w": "east",
      "zh": "东方",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "west",
      "zh": "西方",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "north",
      "zh": "北方",
      "e": "⬆️",
      "reuse": true,
      "core": true
     },
     {
      "w": "south",
      "zh": "南方",
      "e": "⬇️",
      "reuse": true,
      "core": true
     },
     {
      "w": "direction",
      "zh": "方向",
      "e": "🧭",
      "reuse": true,
      "core": true
     },
     {
      "w": "corner",
      "zh": "角落",
      "e": "📐",
      "reuse": true,
      "core": true
     },
     {
      "w": "here",
      "zh": "这里",
      "e": "📍",
      "reuse": true,
      "core": true
     },
     {
      "w": "there",
      "zh": "那里",
      "e": "📌",
      "reuse": true,
      "core": true
     },
     {
      "w": "left",
      "zh": "左边",
      "e": "⬅️",
      "reuse": true,
      "core": true
     },
     {
      "w": "right",
      "zh": "右边",
      "e": "➡️",
      "reuse": true
     },
     {
      "w": "middle",
      "zh": "中间",
      "e": "🎯",
      "reuse": true
     },
     {
      "w": "near",
      "zh": "在附近",
      "e": "",
      "reuse": true
     },
     {
      "w": "far",
      "zh": "远的",
      "e": "",
      "reuse": true
     }
    ]
   },
   {
    "id": "pu5-u5",
    "mod": 5,
    "title": "Unit 5 · Music and performance",
    "zh": "音乐与表演",
    "tip": "本单元任务：策划一场班级音乐会。",
    "grammar": "play the + 乐器（play the piano） vs play + 球类 的区别",
    "sentences": [
     {
      "en": "She plays the violin in the school band.",
      "zh": "她在学校乐队拉小提琴。"
     },
     {
      "en": "Our band plays every Friday.",
      "zh": "我们乐队每周五演出。"
     },
     {
      "en": "Practice makes the music beautiful.",
      "zh": "练习让音乐变美。"
     }
    ],
    "clil": {
     "t": "🔢 CLIL · 数学：节拍里的分数",
     "kid": "一个音拍 1 拍，半个音拍 1/2 拍——音乐里的节奏就是数学的分数。"
    },
    "values": {
     "t": "💛 素养 · 练习需要坚持",
     "kid": "台上一分钟，台下十年功——每一次练习都在靠近舞台。"
    },
    "words": [
     {
      "w": "piano",
      "zh": "钢琴",
      "e": "🎹",
      "reuse": true,
      "core": true
     },
     {
      "w": "guitar",
      "zh": "吉他",
      "e": "🎸",
      "reuse": true,
      "core": true
     },
     {
      "w": "violin",
      "zh": "小提琴",
      "e": "🎻",
      "reuse": true,
      "core": true
     },
     {
      "w": "drum",
      "zh": "鼓",
      "e": "🥁",
      "reuse": true,
      "core": true
     },
     {
      "w": "song",
      "zh": "歌曲",
      "e": "🎶",
      "reuse": true,
      "core": true
     },
     {
      "w": "band",
      "zh": "乐队",
      "e": "🎺",
      "reuse": true,
      "core": true
     },
     {
      "w": "concert",
      "zh": "音乐会",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "stage",
      "zh": "舞台",
      "e": "🎭",
      "reuse": true,
      "core": true
     },
     {
      "w": "magic",
      "zh": "魔法",
      "e": "✨",
      "reuse": true,
      "core": true
     },
     {
      "w": "sing",
      "zh": "唱歌",
      "e": "🎤",
      "reuse": true,
      "core": true
     },
     {
      "w": "dance",
      "zh": "跳舞",
      "e": "💃",
      "reuse": true
     },
     {
      "w": "paint",
      "zh": "绘画",
      "e": "",
      "reuse": true
     }
    ]
   },
   {
    "id": "pu5-u6",
    "mod": 6,
    "title": "Unit 6 · Communication",
    "zh": "通讯与媒体",
    "tip": "本单元任务：写一封 50 词的英文邮件。",
    "grammar": "邮件格式 Dear ... / Best wishes；send/收到 的搭配",
    "sentences": [
     {
      "en": "I sent you an email.",
      "zh": "我给你发了一封邮件。"
     },
     {
      "en": "Don't forget the subject line.",
      "zh": "别忘了写主题行。"
     },
     {
      "en": "Write back soon!",
      "zh": "记得回信！"
     }
    ],
    "clil": {
     "t": "💻 CLIL · 信息：邮件的结构",
     "kid": "一封邮件 = 收件人 + 主题 + 正文 + 结尾——结构清楚，别人一看就懂。"
    },
    "values": {
     "t": "💛 素养 · 回消息是礼貌",
     "kid": "收到消息及时回复——让别人等待是小事，也是大事。"
    },
    "words": [
     {
      "w": "phone",
      "zh": "电话",
      "e": "📱",
      "reuse": true,
      "core": true
     },
     {
      "w": "email",
      "zh": "电子邮件",
      "e": "📧",
      "reuse": true,
      "core": true
     },
     {
      "w": "message",
      "zh": "消息",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "call",
      "zh": "打电话",
      "e": "📞",
      "reuse": true,
      "core": true
     },
     {
      "w": "video",
      "zh": "视频",
      "e": "📹",
      "reuse": true,
      "core": true
     },
     {
      "w": "news",
      "zh": "新闻",
      "e": "📰",
      "reuse": true,
      "core": true
     },
     {
      "w": "letter",
      "zh": "信",
      "e": "✉️",
      "reuse": true,
      "core": true
     },
     {
      "w": "radio",
      "zh": "收音机",
      "e": "📻",
      "reuse": true,
      "core": true
     },
     {
      "w": "program",
      "zh": "节目",
      "e": "🎙️",
      "reuse": true,
      "core": true
     },
     {
      "w": "screen",
      "zh": "屏幕",
      "e": "🖥️",
      "reuse": true,
      "core": true
     },
     {
      "w": "channel",
      "zh": "频道",
      "e": "📡",
      "reuse": true
     }
    ]
   },
   {
    "id": "pu5-r2",
    "mod": 0,
    "title": "Review 4-6",
    "zh": "复习 4-6",
    "tip": "A2 Key 题型练：Writing Part 6 便条。",
    "grammar": "复习：祈使指路、play the+乐器、邮件格式",
    "words": [
     {
      "w": "map",
      "zh": "地图",
      "e": "🗺️",
      "reuse": true
     },
     {
      "w": "south",
      "zh": "南方",
      "e": "⬇️",
      "reuse": true
     },
     {
      "w": "direction",
      "zh": "方向",
      "e": "🧭",
      "reuse": true
     },
     {
      "w": "left",
      "zh": "左边",
      "e": "⬅️",
      "reuse": true
     },
     {
      "w": "right",
      "zh": "右边",
      "e": "➡️",
      "reuse": true
     },
     {
      "w": "piano",
      "zh": "钢琴",
      "e": "🎹",
      "reuse": true
     },
     {
      "w": "guitar",
      "zh": "吉他",
      "e": "🎸",
      "reuse": true
     },
     {
      "w": "violin",
      "zh": "小提琴",
      "e": "🎻",
      "reuse": true
     },
     {
      "w": "song",
      "zh": "歌曲",
      "e": "🎶",
      "reuse": true
     },
     {
      "w": "concert",
      "zh": "音乐会",
      "e": "",
      "reuse": true
     },
     {
      "w": "phone",
      "zh": "电话",
      "e": "📱",
      "reuse": true
     },
     {
      "w": "email",
      "zh": "电子邮件",
      "e": "📧",
      "reuse": true
     },
     {
      "w": "video",
      "zh": "视频",
      "e": "📹",
      "reuse": true
     },
     {
      "w": "news",
      "zh": "新闻",
      "e": "📰",
      "reuse": true
     }
    ]
   },
   {
    "id": "pu5-u7",
    "mod": 7,
    "title": "Unit 7 · Jobs and dreams",
    "zh": "职业与梦想",
    "tip": "本单元任务：「二十年后的我」演讲卡。",
    "grammar": "want to be / hope to do；when I grow up 时间状语从句",
    "sentences": [
     {
      "en": "I want to be a scientist.",
      "zh": "我想成为科学家。"
     },
     {
      "en": "Study hard for your dream.",
      "zh": "为梦想努力学习。"
     },
     {
      "en": "Every job is important.",
      "zh": "每种工作都重要。"
     }
    ],
    "clil": {
     "t": "🌍 CLIL · 社会：职业学习路径",
     "kid": "想当 scientist 就要先学好 science 和 math——每个梦想都有一条通向它的路。"
    },
    "values": {
     "t": "💛 素养 · 尊重每个梦想",
     "kid": "有人想当 pilot，有人想当 vet——每个认真的梦想都值得鼓掌。"
    },
    "words": [
     {
      "w": "job",
      "zh": "工作",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "dream",
      "zh": "梦想",
      "e": "💫",
      "reuse": true,
      "core": true
     },
     {
      "w": "goal",
      "zh": "目标",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "work",
      "zh": "工作",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "success",
      "zh": "成功",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "study",
      "zh": "学习",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "exam",
      "zh": "考试",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "review",
      "zh": "复习",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "believe",
      "zh": "相信",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "effort",
      "zh": "努力",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "ideal",
      "zh": "理想",
      "e": "",
      "reuse": true
     },
     {
      "w": "college",
      "zh": "大学",
      "e": "",
      "reuse": true
     },
     {
      "w": "knowledge",
      "zh": "知识",
      "e": "",
      "reuse": true
     }
    ]
   },
   {
    "id": "pu5-u8",
    "mod": 8,
    "title": "Unit 8 · Festivals and cultures",
    "zh": "节日与文化",
    "tip": "本单元任务：对比中外一个节日的异同。",
    "grammar": "both/and 与 but/however 的对比句式",
    "sentences": [
     {
      "en": "Both festivals are about family.",
      "zh": "两个节日都关于家庭。"
     },
     {
      "en": "We celebrate with a big party.",
      "zh": "我们用聚会庆祝。"
     },
     {
      "en": "Christmas is a festival in the West.",
      "zh": "圣诞节是西方的节日。"
     }
    ],
    "clil": {
     "t": "🌍 CLIL · 社会：节日比较表",
     "kid": "春节和 Christmas 都吃团圆饭——把两个节日做成对比表，异同一目了然。"
    },
    "values": {
     "t": "💛 素养 · 了解别人的文化",
     "kid": "别人的节日你不必过，但要懂得尊重——了解让人成为好朋友。"
    },
    "words": [
     {
      "w": "festival",
      "zh": "节日",
      "e": "🎉",
      "reuse": true,
      "core": true
     },
     {
      "w": "Christmas",
      "zh": "圣诞节",
      "e": "🎄",
      "reuse": true,
      "core": true
     },
     {
      "w": "present",
      "zh": "礼物",
      "e": "🎁",
      "reuse": true,
      "core": true
     },
     {
      "w": "party",
      "zh": "聚会",
      "e": "🥳",
      "reuse": true,
      "core": true
     },
     {
      "w": "candle",
      "zh": "蜡烛",
      "e": "🕯️",
      "reuse": true,
      "core": true
     },
     {
      "w": "lantern",
      "zh": "灯笼",
      "e": "🏮",
      "reuse": true,
      "core": true
     },
     {
      "w": "dragon",
      "zh": "龙",
      "e": "🐉",
      "reuse": true,
      "core": true
     },
     {
      "w": "celebrate",
      "zh": "庆祝",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "New Year",
      "zh": "新年",
      "e": "🎇",
      "reuse": true,
      "core": true
     },
     {
      "w": "invite",
      "zh": "邀请",
      "e": "💌",
      "reuse": true,
      "core": true
     },
     {
      "w": "prepare",
      "zh": "准备",
      "e": "",
      "reuse": true
     },
     {
      "w": "China",
      "zh": "中国",
      "e": "🇨🇳",
      "reuse": true
     },
     {
      "w": "America",
      "zh": "美国",
      "e": "🇺🇸",
      "reuse": true
     },
     {
      "w": "culture",
      "zh": "文化",
      "e": "",
      "reuse": true
     }
    ]
   },
   {
    "id": "pu5-u9",
    "mod": 9,
    "title": "Unit 9 · Countries and travel",
    "zh": "国家与旅行",
    "tip": "本单元任务：做一张世界旅行护照手册。",
    "grammar": "people in + 国家；语言与国籍词的关联记忆",
    "sentences": [
     {
      "en": "People in France speak French.",
      "zh": "法国人说法语。"
     },
     {
      "en": "I'd love to travel abroad.",
      "zh": "我很想出国旅行。"
     },
     {
      "en": "Every country has its own flag.",
      "zh": "每个国家都有自己的国旗。"
     }
    ],
    "clil": {
     "t": "🌍 CLIL · 地理：国家与首都",
     "kid": "China—Beijing、France—Paris、Japan—Tokyo——国家与首都像钥匙和锁，一一配对。"
    },
    "values": {
     "t": "💛 素养 · 世界很大，去看看",
     "kid": "学好英语就是带上世界的钥匙——它能打开更多的大门。"
    },
    "words": [
     {
      "w": "country",
      "zh": "国家",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "world",
      "zh": "世界",
      "e": "🌍",
      "reuse": true,
      "core": true
     },
     {
      "w": "language",
      "zh": "语言",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "flag",
      "zh": "旗帜",
      "e": "🚩",
      "reuse": true,
      "core": true
     },
     {
      "w": "people",
      "zh": "人们",
      "e": "👥",
      "reuse": true,
      "core": true
     },
     {
      "w": "foreign",
      "zh": "外国的",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "culture",
      "zh": "文化",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "friendship",
      "zh": "友谊",
      "e": "🤝",
      "reuse": true,
      "core": true
     },
     {
      "w": "abroad",
      "zh": "国外",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "Japan",
      "zh": "日本",
      "e": "🇯🇵",
      "reuse": true,
      "core": true
     },
     {
      "w": "France",
      "zh": "法国",
      "e": "🇫🇷",
      "reuse": true
     },
     {
      "w": "Australia",
      "zh": "澳大利亚",
      "e": "🇦🇺",
      "reuse": true
     },
     {
      "w": "Canada",
      "zh": "加拿大",
      "e": "🇨🇦",
      "reuse": true
     }
    ]
   },
   {
    "id": "pu5-r3",
    "mod": 0,
    "title": "Review 7-9",
    "zh": "复习 7-9",
    "tip": "A2 Key 模拟题：Speaking Part 2。",
    "grammar": "复习：want to be、both/however、国家与语言",
    "words": [
     {
      "w": "job",
      "zh": "工作",
      "e": "",
      "reuse": true
     },
     {
      "w": "dream",
      "zh": "梦想",
      "e": "💫",
      "reuse": true
     },
     {
      "w": "goal",
      "zh": "目标",
      "e": "",
      "reuse": true
     },
     {
      "w": "success",
      "zh": "成功",
      "e": "",
      "reuse": true
     },
     {
      "w": "effort",
      "zh": "努力",
      "e": "",
      "reuse": true
     },
     {
      "w": "college",
      "zh": "大学",
      "e": "",
      "reuse": true
     },
     {
      "w": "festival",
      "zh": "节日",
      "e": "🎉",
      "reuse": true
     },
     {
      "w": "Christmas",
      "zh": "圣诞节",
      "e": "🎄",
      "reuse": true
     },
     {
      "w": "present",
      "zh": "礼物",
      "e": "🎁",
      "reuse": true
     },
     {
      "w": "celebrate",
      "zh": "庆祝",
      "e": "",
      "reuse": true
     },
     {
      "w": "country",
      "zh": "国家",
      "e": "",
      "reuse": true
     },
     {
      "w": "language",
      "zh": "语言",
      "e": "",
      "reuse": true
     },
     {
      "w": "flag",
      "zh": "旗帜",
      "e": "🚩",
      "reuse": true
     },
     {
      "w": "friendship",
      "zh": "友谊",
      "e": "🤝",
      "reuse": true
     }
    ]
   }
  ]
 },
 {
  "id": "pu6",
  "name": "Power Up 6",
  "exam": "B1 Preliminary for Schools",
  "title": "剑桥 Power Up 6（B1 Preliminary for Schools 备考）",
  "units": [
   {
    "id": "pu6-u1",
    "mod": 1,
    "title": "Unit 1 · Learning how to learn",
    "zh": "学会学习",
    "tip": "本单元任务：写 5 条「高效学习法」清单。",
    "grammar": "一般将来 will/going to 复习；动名词作主语（Learning English is ...）",
    "sentences": [
     {
      "en": "Learning English takes practice.",
      "zh": "学英语需要练习。"
     },
     {
      "en": "I will review my notes tonight.",
      "zh": "今晚我要复习笔记。"
     },
     {
      "en": "Never forget to ask why.",
      "zh": "别忘了多问为什么。"
     }
    ],
    "clil": {
     "t": "🧠 CLIL · 心理学：遗忘曲线",
     "kid": "学完 20 分钟忘 40%，一天后忘 70%——review 就是把忘记的东西抢回来。"
    },
    "values": {
     "t": "💛 素养 · 复述是最好的学习",
     "kid": "把学到的讲给别人听——能讲明白，才是真的懂了。"
    },
    "words": [
     {
      "w": "learn",
      "zh": "学习",
      "e": "🧠",
      "reuse": true,
      "core": true
     },
     {
      "w": "teach",
      "zh": "教",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "understand",
      "zh": "明白",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "remember",
      "zh": "记住",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "forget",
      "zh": "忘记",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "know",
      "zh": "知道",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "spell",
      "zh": "拼写",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "mistake",
      "zh": "错误",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "question",
      "zh": "问题",
      "e": "❓",
      "reuse": true,
      "core": true
     },
     {
      "w": "answer",
      "zh": "回答",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "homework",
      "zh": "作业",
      "e": "",
      "reuse": true
     },
     {
      "w": "grade",
      "zh": "年级",
      "e": "🎖️",
      "reuse": true
     }
    ]
   },
   {
    "id": "pu6-u2",
    "mod": 2,
    "title": "Unit 2 · Community and rules",
    "zh": "社区与规则",
    "tip": "本单元任务：为学校写三条新规则并说明理由。",
    "grammar": "must/have to/need to 的强弱；because 从句说理",
    "sentences": [
     {
      "en": "Everyone must follow the rules.",
      "zh": "每个人都必须遵守规则。"
     },
     {
      "en": "Volunteers clean the park together.",
      "zh": "志愿者一起清扫公园。"
     },
     {
      "en": "Rules protect everyone.",
      "zh": "规则保护每个人。"
     }
    ],
    "clil": {
     "t": "🌍 CLIL · 社会：规则如何保护大家",
     "kid": "traffic rules 让马路安全、class rules 让课堂安静——规则不是限制，是保护。"
    },
    "values": {
     "t": "💛 素养 · 规则面前的公平",
     "kid": "规则对每个人都一样——不因为关系好就不遵守，这才是公平。"
    },
    "words": [
     {
      "w": "rule",
      "zh": "规则",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "law",
      "zh": "法律",
      "e": "⚖️",
      "reuse": true,
      "core": true
     },
     {
      "w": "police",
      "zh": "警察",
      "e": "🚓",
      "reuse": true,
      "core": true
     },
     {
      "w": "protect",
      "zh": "保护",
      "e": "🛡️",
      "reuse": true,
      "core": true
     },
     {
      "w": "save",
      "zh": "拯救",
      "e": "🦸",
      "reuse": true,
      "core": true
     },
     {
      "w": "danger",
      "zh": "危险",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "accident",
      "zh": "事故",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "team",
      "zh": "团队",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "group",
      "zh": "小组",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "neighbour",
      "zh": "邻居",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "volunteer",
      "zh": "志愿者",
      "e": "",
      "reuse": true
     },
     {
      "w": "activity",
      "zh": "活动",
      "e": "🎪",
      "reuse": true
     }
    ]
   },
   {
    "id": "pu6-u3",
    "mod": 3,
    "title": "Unit 3 · Personality and values",
    "zh": "品格与价值观",
    "tip": "本单元任务：评选班级「品格之星」并写颁奖词。",
    "grammar": "be + 形容词 + to do（It's kind of you to ...）",
    "sentences": [
     {
      "en": "It was brave of him to speak first.",
      "zh": "他第一个发言很勇敢。"
     },
     {
      "en": "Patient people make good teachers.",
      "zh": "有耐心的人能成为好老师。"
     },
     {
      "en": "Helpful students are always welcome.",
      "zh": "乐于助人的学生总是受欢迎。"
     }
    ],
    "clil": {
     "t": "📖 CLIL · 文学：从行为推断性格",
     "kid": "故事不会直接写「他很勇敢」——他第一个冲上去，你就读懂了。"
    },
    "values": {
     "t": "💛 素养 · 看见别人的努力",
     "kid": "夸奖别人的努力而不只是聪明——努力是每个人都拥有的力量。"
    },
    "words": [
     {
      "w": "kind",
      "zh": "善良的",
      "e": "💞",
      "reuse": true,
      "core": true
     },
     {
      "w": "brave",
      "zh": "勇敢的",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "smart",
      "zh": "聪明的",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "honest",
      "zh": "诚实的",
      "e": "🤞",
      "reuse": true,
      "core": true
     },
     {
      "w": "polite",
      "zh": "有礼貌的",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "patient",
      "zh": "耐心的",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "helpful",
      "zh": "乐于助人的",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "careful",
      "zh": "小心的",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "gentle",
      "zh": "温柔的",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "friendly",
      "zh": "友好的",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "lazy",
      "zh": "懒惰的",
      "e": "🦥",
      "reuse": true
     },
     {
      "w": "strict",
      "zh": "严格的",
      "e": "",
      "reuse": true
     }
    ]
   },
   {
    "id": "pu6-r1",
    "mod": 0,
    "title": "Review 1-3",
    "zh": "复习 1-3",
    "tip": "B1 Preliminary 题型练：Reading Part 3。",
    "grammar": "复习：动名词主语、must/have to、品格形容词",
    "words": [
     {
      "w": "learn",
      "zh": "学习",
      "e": "🧠",
      "reuse": true
     },
     {
      "w": "understand",
      "zh": "明白",
      "e": "",
      "reuse": true
     },
     {
      "w": "remember",
      "zh": "记住",
      "e": "",
      "reuse": true
     },
     {
      "w": "forget",
      "zh": "忘记",
      "e": "",
      "reuse": true
     },
     {
      "w": "spell",
      "zh": "拼写",
      "e": "",
      "reuse": true
     },
     {
      "w": "question",
      "zh": "问题",
      "e": "❓",
      "reuse": true
     },
     {
      "w": "rule",
      "zh": "规则",
      "e": "",
      "reuse": true
     },
     {
      "w": "protect",
      "zh": "保护",
      "e": "🛡️",
      "reuse": true
     },
     {
      "w": "team",
      "zh": "团队",
      "e": "",
      "reuse": true
     },
     {
      "w": "volunteer",
      "zh": "志愿者",
      "e": "",
      "reuse": true
     },
     {
      "w": "kind",
      "zh": "善良的",
      "e": "💞",
      "reuse": true
     },
     {
      "w": "honest",
      "zh": "诚实的",
      "e": "🤞",
      "reuse": true
     },
     {
      "w": "patient",
      "zh": "耐心的",
      "e": "",
      "reuse": true
     },
     {
      "w": "careful",
      "zh": "小心的",
      "e": "",
      "reuse": true
     }
    ]
   },
   {
    "id": "pu6-u4",
    "mod": 4,
    "title": "Unit 4 · Technology and media",
    "zh": "科技与媒体",
    "tip": "本单元任务：辩论「屏幕时间」利与弊。",
    "grammar": "比较级 + than 的论证句式； agree/disagree 表达",
    "sentences": [
     {
      "en": "Phones are cheaper than before.",
      "zh": "手机比以前便宜了。"
     },
     {
      "en": "Screens are bigger this year.",
      "zh": "今年的屏幕更大了。"
     },
     {
      "en": "Don't spend too much time on screens.",
      "zh": "别在屏幕上花太多时间。"
     }
    ],
    "clil": {
     "t": "🔬 CLIL · 科学：技术迭代",
     "kid": "手机从大砖头变成小屏幕，十年一小变——技术的进步是一代代人攒出来的。"
    },
    "values": {
     "t": "💛 素养 · 屏幕时间管理",
     "kid": "屏幕是好工具也是时间黑洞——定好时间，做完该做的事再玩。"
    },
    "words": [
     {
      "w": "computer",
      "zh": "电脑",
      "e": "💻",
      "reuse": true,
      "core": true
     },
     {
      "w": "phone",
      "zh": "电话",
      "e": "📱",
      "reuse": true,
      "core": true
     },
     {
      "w": "TV",
      "zh": "电视",
      "e": "📺",
      "reuse": true,
      "core": true
     },
     {
      "w": "screen",
      "zh": "屏幕",
      "e": "🖥️",
      "reuse": true,
      "core": true
     },
     {
      "w": "email",
      "zh": "电子邮件",
      "e": "📧",
      "reuse": true,
      "core": true
     },
     {
      "w": "message",
      "zh": "消息",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "video",
      "zh": "视频",
      "e": "📹",
      "reuse": true,
      "core": true
     },
     {
      "w": "film",
      "zh": "电影",
      "e": "🎬",
      "reuse": true,
      "core": true
     },
     {
      "w": "news",
      "zh": "新闻",
      "e": "📰",
      "reuse": true,
      "core": true
     },
     {
      "w": "magazine",
      "zh": "杂志",
      "e": "📔",
      "reuse": true,
      "core": true
     },
     {
      "w": "radio",
      "zh": "收音机",
      "e": "📻",
      "reuse": true
     },
     {
      "w": "program",
      "zh": "节目",
      "e": "🎙️",
      "reuse": true
     }
    ]
   },
   {
    "id": "pu6-u5",
    "mod": 5,
    "title": "Unit 5 · Protecting the planet",
    "zh": "保护地球",
    "tip": "本单元任务：设计一个校园环保项目海报。",
    "grammar": "should/shouldn't/ought to 建议；so that 目的从句",
    "sentences": [
     {
      "en": "We recycle so that we protect the earth.",
      "zh": "我们回收利用以保护地球。"
     },
     {
      "en": "Fresh air matters to everyone.",
      "zh": "新鲜空气对每个人都重要。"
     },
     {
      "en": "Small actions make a big change.",
      "zh": "小行动带来大改变。"
     }
    ],
    "clil": {
     "t": "🔬 CLIL · 科学：循环经济",
     "kid": "一个瓶子 recycle 后变成新瓶子——垃圾是放错位置的资源。"
    },
    "values": {
     "t": "💛 素养 · 每个人都是一环",
     "kid": "环保不是一个人的大事，是每个人的小事——你也是重要的一环。"
    },
    "words": [
     {
      "w": "environment",
      "zh": "环境",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "pollution",
      "zh": "污染",
      "e": "🏭",
      "reuse": true,
      "core": true
     },
     {
      "w": "rubbish",
      "zh": "垃圾",
      "e": "🗑️",
      "reuse": true,
      "core": true
     },
     {
      "w": "recycle",
      "zh": "回收利用",
      "e": "♻️",
      "reuse": true,
      "core": true
     },
     {
      "w": "energy",
      "zh": "能源",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "power",
      "zh": "力量",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "fresh",
      "zh": "新鲜的",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "land",
      "zh": "陆地",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "ocean",
      "zh": "海洋",
      "e": "🌊",
      "reuse": true,
      "core": true
     },
     {
      "w": "protect the earth",
      "zh": "保护地球",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "save water",
      "zh": "节约用水",
      "e": "",
      "reuse": true
     }
    ]
   },
   {
    "id": "pu6-u6",
    "mod": 6,
    "title": "Unit 6 · Time and change",
    "zh": "时间与变化",
    "tip": "本单元任务：写「我的过去与现在」对比短文。",
    "grammar": "used to 表示过去习惯；一般过去 vs 现在完成的对比",
    "sentences": [
     {
      "en": "I used to lose my keys.",
      "zh": "我以前总是丢钥匙。"
     },
     {
      "en": "The city has changed a lot.",
      "zh": "这座城市变了很多。"
     },
     {
      "en": "Change starts with a small step.",
      "zh": "改变从小小一步开始。"
     }
    ],
    "clil": {
     "t": "📖 CLIL · 历史：过去与现在对比",
     "kid": "把「以前的学校」和「现在的学校」列成两栏对比——历史学家的方法你也会用。"
    },
    "values": {
     "t": "💛 素养 · 改变从今天开始",
     "kid": "想变成更好的自己？改变从今天的第一小步开始。"
    },
    "words": [
     {
      "w": "history",
      "zh": "历史",
      "e": "📜",
      "reuse": true,
      "core": true
     },
     {
      "w": "future",
      "zh": "未来",
      "e": "🚀",
      "reuse": true,
      "core": true
     },
     {
      "w": "century",
      "zh": "世纪",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "past",
      "zh": "过去",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "end",
      "zh": "结束",
      "e": "🔚",
      "reuse": true,
      "core": true
     },
     {
      "w": "begin",
      "zh": "开始",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "start",
      "zh": "出发",
      "e": "🚦",
      "reuse": true,
      "core": true
     },
     {
      "w": "finish",
      "zh": "完成",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "stop",
      "zh": "停止",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "continue",
      "zh": "继续",
      "e": "⏭️",
      "reuse": true,
      "core": true
     },
     {
      "w": "change",
      "zh": "改变",
      "e": "",
      "reuse": true
     },
     {
      "w": "become",
      "zh": "变成",
      "e": "",
      "reuse": true
     },
     {
      "w": "grow",
      "zh": "生长",
      "e": "",
      "reuse": true
     }
    ]
   },
   {
    "id": "pu6-r2",
    "mod": 0,
    "title": "Review 4-6",
    "zh": "复习 4-6",
    "tip": "B1 Preliminary 题型练：Writing Part 2 短文。",
    "grammar": "复习：比较级论证、should/ought to、used to",
    "words": [
     {
      "w": "computer",
      "zh": "电脑",
      "e": "💻",
      "reuse": true
     },
     {
      "w": "screen",
      "zh": "屏幕",
      "e": "🖥️",
      "reuse": true
     },
     {
      "w": "video",
      "zh": "视频",
      "e": "📹",
      "reuse": true
     },
     {
      "w": "magazine",
      "zh": "杂志",
      "e": "📔",
      "reuse": true
     },
     {
      "w": "environment",
      "zh": "环境",
      "e": "",
      "reuse": true
     },
     {
      "w": "recycle",
      "zh": "回收利用",
      "e": "♻️",
      "reuse": true
     },
     {
      "w": "energy",
      "zh": "能源",
      "e": "",
      "reuse": true
     },
     {
      "w": "fresh",
      "zh": "新鲜的",
      "e": "",
      "reuse": true
     },
     {
      "w": "history",
      "zh": "历史",
      "e": "📜",
      "reuse": true
     },
     {
      "w": "future",
      "zh": "未来",
      "e": "🚀",
      "reuse": true
     },
     {
      "w": "continue",
      "zh": "继续",
      "e": "⏭️",
      "reuse": true
     },
     {
      "w": "change",
      "zh": "改变",
      "e": "",
      "reuse": true
     },
     {
      "w": "become",
      "zh": "变成",
      "e": "",
      "reuse": true
     },
     {
      "w": "grow",
      "zh": "生长",
      "e": "",
      "reuse": true
     }
    ]
   },
   {
    "id": "pu6-u7",
    "mod": 7,
    "title": "Unit 7 · Money and choices",
    "zh": "金钱与选择",
    "tip": "本单元任务：做一份零花钱预算表。",
    "grammar": "if 条件句（真实条件）；cost/spend/pay/take 的区分",
    "sentences": [
     {
      "en": "If it costs too much, I won't buy it.",
      "zh": "如果太贵，我就不买。"
     },
     {
      "en": "Make a list before you shop.",
      "zh": "购物前列张清单。"
     },
     {
      "en": "Needs come before wants.",
      "zh": "需要先于想要。"
     }
    ],
    "clil": {
     "t": "🔢 CLIL · 数学：预算与比较",
     "kid": "零花钱 50 元，东西一共 65 元——超支了怎么办？学会取舍就是预算。"
    },
    "values": {
     "t": "💛 素养 · 需要与想要",
     "kid": "需要的先买，想要的想一想——管好零花钱是管理自己的第一步。"
    },
    "words": [
     {
      "w": "money",
      "zh": "钱",
      "e": "💰",
      "reuse": true,
      "core": true
     },
     {
      "w": "price",
      "zh": "价格",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "cheap",
      "zh": "便宜的",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "expensive",
      "zh": "昂贵的",
      "e": "💎",
      "reuse": true,
      "core": true
     },
     {
      "w": "cost",
      "zh": "花费",
      "e": "💸",
      "reuse": true,
      "core": true
     },
     {
      "w": "pay",
      "zh": "付款",
      "e": "💳",
      "reuse": true,
      "core": true
     },
     {
      "w": "bill",
      "zh": "账单",
      "e": "🧾",
      "reuse": true,
      "core": true
     },
     {
      "w": "gift",
      "zh": "礼物",
      "e": "🎁",
      "reuse": true,
      "core": true
     },
     {
      "w": "choice",
      "zh": "选择",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "chance",
      "zh": "机会",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "buy",
      "zh": "买",
      "e": "🛍️",
      "reuse": true
     },
     {
      "w": "sell",
      "zh": "卖",
      "e": "🏷️",
      "reuse": true
     }
    ]
   },
   {
    "id": "pu6-u8",
    "mod": 8,
    "title": "Unit 8 · Travel and cultures",
    "zh": "旅行与文化",
    "tip": "本单元任务：给外国笔友写一封介绍家乡的信。",
    "grammar": "一般现在/现在完成的时间标志词对比（ever/never/already）",
    "sentences": [
     {
      "en": "Have you ever been abroad?",
      "zh": "你出过国吗？"
     },
     {
      "en": "Every culture has its own festivals.",
      "zh": "每种文化都有自己的节日。"
     },
     {
      "en": "Be curious, not judgemental.",
      "zh": "保持好奇，不要评判。"
     }
    ],
    "clil": {
     "t": "🌍 CLIL · 地理：文化多样性",
     "kid": "同一个节日，不同国家有不同过法——差异不是对错，是色彩。"
    },
    "values": {
     "t": "💛 素养 · 好奇而不评判",
     "kid": "先了解再评价——对世界保持好奇，对差异保持尊重。"
    },
    "words": [
     {
      "w": "travel",
      "zh": "旅行",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "journey",
      "zh": "旅途",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "culture",
      "zh": "文化",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "language",
      "zh": "语言",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "foreign",
      "zh": "外国的",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "foreigner",
      "zh": "外国人",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "abroad",
      "zh": "国外",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "meet",
      "zh": "遇见",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "introduce",
      "zh": "介绍",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "agree",
      "zh": "同意",
      "e": "🙆",
      "reuse": true,
      "core": true
     },
     {
      "w": "discuss",
      "zh": "讨论",
      "e": "",
      "reuse": true
     },
     {
      "w": "explain",
      "zh": "解释",
      "e": "",
      "reuse": true
     }
    ]
   },
   {
    "id": "pu6-u9",
    "mod": 9,
    "title": "Unit 9 · Skills for success",
    "zh": "成功技能",
    "tip": "本单元任务：制定本学期学习目标与行动计划。",
    "grammar": "计划表达 plan to / decide to；目标句型 My goal is to ...",
    "sentences": [
     {
      "en": "My goal is to pass the B1 exam.",
      "zh": "我的目标是通过 B1 考试。"
     },
     {
      "en": "Practice makes perfect.",
      "zh": "熟能生巧。"
     },
     {
      "en": "Plan your work, then work your plan.",
      "zh": "计划你的学习，然后执行它。"
     }
    ],
    "clil": {
     "t": "🧠 CLIL · 学习科学：刻意练习",
     "kid": "只练会的不够——专挑不会的练，进步最快。"
    },
    "values": {
     "t": "💛 素养 · 努力比天赋更可靠",
     "kid": "聪明是天生的，努力是自己的——努力的人走到哪都发光。"
    },
    "words": [
     {
      "w": "work",
      "zh": "工作",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "success",
      "zh": "成功",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "fail",
      "zh": "失败",
      "e": "📉",
      "reuse": true,
      "core": true
     },
     {
      "w": "study",
      "zh": "学习",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "review",
      "zh": "复习",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "exam",
      "zh": "考试",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "believe",
      "zh": "相信",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "effort",
      "zh": "努力",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "ideal",
      "zh": "理想",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "graduate",
      "zh": "毕业",
      "e": "",
      "reuse": true,
      "core": true
     },
     {
      "w": "college",
      "zh": "大学",
      "e": "",
      "reuse": true
     },
     {
      "w": "knowledge",
      "zh": "知识",
      "e": "",
      "reuse": true
     },
     {
      "w": "plan",
      "zh": "计划",
      "e": "",
      "reuse": true
     },
     {
      "w": "practice",
      "zh": "练习",
      "e": "🔁",
      "reuse": true
     }
    ]
   },
   {
    "id": "pu6-r3",
    "mod": 0,
    "title": "Review 7-9",
    "zh": "复习 7-9",
    "tip": "B1 Preliminary 模拟题：Speaking Part 3-4。",
    "grammar": "复习：if 条件句、ever/never、目标句型",
    "words": [
     {
      "w": "money",
      "zh": "钱",
      "e": "💰",
      "reuse": true
     },
     {
      "w": "price",
      "zh": "价格",
      "e": "",
      "reuse": true
     },
     {
      "w": "choice",
      "zh": "选择",
      "e": "",
      "reuse": true
     },
     {
      "w": "chance",
      "zh": "机会",
      "e": "",
      "reuse": true
     },
     {
      "w": "journey",
      "zh": "旅途",
      "e": "",
      "reuse": true
     },
     {
      "w": "culture",
      "zh": "文化",
      "e": "",
      "reuse": true
     },
     {
      "w": "language",
      "zh": "语言",
      "e": "",
      "reuse": true
     },
     {
      "w": "foreign",
      "zh": "外国的",
      "e": "",
      "reuse": true
     },
     {
      "w": "abroad",
      "zh": "国外",
      "e": "",
      "reuse": true
     },
     {
      "w": "explain",
      "zh": "解释",
      "e": "",
      "reuse": true
     },
     {
      "w": "success",
      "zh": "成功",
      "e": "",
      "reuse": true
     },
     {
      "w": "review",
      "zh": "复习",
      "e": "",
      "reuse": true
     },
     {
      "w": "believe",
      "zh": "相信",
      "e": "",
      "reuse": true
     },
     {
      "w": "practice",
      "zh": "练习",
      "e": "🔁",
      "reuse": true
     }
    ]
   }
  ]
 }
];

/* 单元语法聚焦（单元 id → 语法） */
const POWERUP_GRAMMAR = {
 "pu1-u1": "be 动词 am/is/are；What's your name? / I'm ... / My name is ...",
 "pu1-u2": "可数名词单复数（+s）；What's this? It's a ...；a/an 的读音判断",
 "pu1-u3": "this is ... / these are ...；my/your；he/she 的性别对应",
 "pu1-r1": "复习：be 动词、名词复数、this/these、he/she",
 "pu1-u4": "How many ...? 数字 1-10；颜色词作定语（a red bag）",
 "pu1-u5": "It is a/an ...；They are ...；第三人称单数 has（It has ...）",
 "pu1-u6": "I like ... / I don't like ...；不可数名词（milk/rice/water 不加 s）",
 "pu1-r2": "复习：How many、like+名词、动物与食物词",
 "pu1-u7": "I have a ...；形容词放名词前（a big ball）；This is my favourite ...",
 "pu1-u8": "祈使句 Touch ... / Stand up；can 表示能力（I can jump）",
 "pu1-u9": "Let's ...；There is ...；we can ...",
 "pu1-r3": "复习：have/can/Let's、身体与玩具词",
 "pu2-u1": "现在进行时 be+doing（We are reading）；where 引导的方位问句",
 "pu2-u2": "人称代词主格/形容词性物主代词（he/his, she/her）",
 "pu2-u3": "数字 11-20 的构词（-teen）；How many ... are there? There are ...",
 "pu2-r1": "复习：现在进行时、代词、数字 11-20",
 "pu2-u4": "第三人称单数 has/is；否定句 doesn't have",
 "pu2-u5": "I am wearing ...（现在进行时）；复数 clothes/shoes/socks 谓语用 are",
 "pu2-u6": "some/any；Would you like ...? / I'd like ...",
 "pu2-r2": "复习：has/doesn't have、be+doing、Would you like",
 "pu2-u7": "方位介词 in/on/under/behind/between；There is/There are",
 "pu2-u8": "It is + 天气形容词（It's sunny）；What's the weather like?",
 "pu2-u9": "like + doing（I like swimming）；play + 球类（play football）",
 "pu2-r3": "复习：方位介词、天气、like+doing",
 "pu3-u1": "一般现在时三单（-s/-es）；on + 星期；时间表达 o'clock/half past",
 "pu3-u2": "可数/不可数与 a bowl of；How much/How many 的区分",
 "pu3-u3": "should/shouldn't 表示建议；have a fever/headache 搭配",
 "pu3-r1": "复习：三单、should、was/were",
 "pu3-u4": "一般过去时（规则 -ed）；was/were 叙述过去",
 "pu3-u5": "Why are you ...? Because ...；形容词描述人",
 "pu3-u6": "Where is ...? Go straight / turn left；地点名词搭配（at the bank）",
 "pu3-r2": "复习：Why/Because、地点与职业、there was/were",
 "pu3-u7": "What does he/she do? 三单问答；work in/at 搭配",
 "pu3-u8": "there is/there are 的过去式 there was/were",
 "pu3-u9": "by bus/by train 乘行方式；How do you go to school?",
 "pu3-r3": "复习：by+交通、自然词、一般过去时",
 "pu4-u1": "like/love/enjoy + doing；序数词 first/second/third",
 "pu4-u2": "in + 月份；on + 具体日期；half past / a quarter to",
 "pu4-u3": "the largest/one of the ...（最高级初步）；whale/dolphin 量词搭配",
 "pu4-r1": "复习：enjoy+doing、序数词、最高级初步",
 "pu4-u4": "will 表预测（It will rain）；wear + 服装建议",
 "pu4-u5": "have to / has to 表示必须；频率副词 always/usually/sometimes",
 "pu4-u6": "be + 性格形容词；who 描述人（a friend who is kind）",
 "pu4-r2": "复习：will、have to、性格形容词",
 "pu4-u7": "How much is/are ...? too + 形容词（too expensive）",
 "pu4-u8": "be going to 表计划；by plane / on foot",
 "pu4-u9": "like/love + doing 复习；句型 There is a programme about ...",
 "pu4-r3": "复习：How much、be going to、媒体与艺术词",
 "pu5-u1": "must/mustn't 表示义务与禁止；protect + 名词",
 "pu5-u2": "形状/尺寸形容词排序（a big round …）；made of 材质表达",
 "pu5-u3": "How often ...? 频率回答；stay + 形容词（stay healthy）",
 "pu5-r1": "复习：must/mustn't、描述事物、How often",
 "pu5-u4": "祈使指路 Turn left / Go along；near/far from",
 "pu5-u5": "play the + 乐器（play the piano） vs play + 球类 的区别",
 "pu5-u6": "邮件格式 Dear ... / Best wishes；send/收到 的搭配",
 "pu5-r2": "复习：祈使指路、play the+乐器、邮件格式",
 "pu5-u7": "want to be / hope to do；when I grow up 时间状语从句",
 "pu5-u8": "both/and 与 but/however 的对比句式",
 "pu5-u9": "people in + 国家；语言与国籍词的关联记忆",
 "pu5-r3": "复习：want to be、both/however、国家与语言",
 "pu6-u1": "一般将来 will/going to 复习；动名词作主语（Learning English is ...）",
 "pu6-u2": "must/have to/need to 的强弱；because 从句说理",
 "pu6-u3": "be + 形容词 + to do（It's kind of you to ...）",
 "pu6-r1": "复习：动名词主语、must/have to、品格形容词",
 "pu6-u4": "比较级 + than 的论证句式； agree/disagree 表达",
 "pu6-u5": "should/shouldn't/ought to 建议；so that 目的从句",
 "pu6-u6": "used to 表示过去习惯；一般过去 vs 现在完成的对比",
 "pu6-r2": "复习：比较级论证、should/ought to、used to",
 "pu6-u7": "if 条件句（真实条件）；cost/spend/pay/take 的区分",
 "pu6-u8": "一般现在/现在完成的时间标志词对比（ever/never/already）",
 "pu6-u9": "计划表达 plan to / decide to；目标句型 My goal is to ...",
 "pu6-r3": "复习：if 条件句、ever/never、目标句型"
};

window.POWERUP_LEVELS = POWERUP_LEVELS;
window.POWERUP_GRAMMAR = POWERUP_GRAMMAR;
