/* ============================================================
   Power Up 教材系列 · 站点数据 v2.2（2026-11-28 L4-L6 官方目录对齐）
   由 _pu/build_spec_v2.py 生成，勿手改。
   · L1-L3：剑桥官方 Map of the book 第二版（spec_v1），保持不变
   · L4-L6：剑桥官方 Map of the book 逐列对齐（spec_v2）——
     L4/L5 用第二版官方 PDF（cambridgelatamcatalogue.org），
     L6 用官方第一版样章（oxico.sk power_up_6.pdf，两版单元名与语法一致）
   · words 全部来自站内 1030 词库（音频零缺口），按官方 Vocabulary 话题选取
   · 单元新增 vocab/spell/cc/lit/sel/m1/m2/exam 官方列，供页面与卡片使用
   ============================================================ */
'use strict';
const POWERUP_LEVELS = [
 {
  "id": "pu1",
  "name": "Power Up 1",
  "exam": "Pre A1 Starters",
  "emoji": "🐣",
  "tag": "剑桥",
  "units": [
   {
    "id": "pu1-u0",
    "mod": 0,
    "title": "Hello",
    "zh": "你好",
    "page": 4,
    "vocab": "人物名 · 数字 · 颜色 · 问候",
    "grammar": "自我介绍：What's your name? I'm … / How old are you? I'm …",
    "spell": "",
    "cc": "",
    "lit": "",
    "sel": "",
    "m1": "",
    "m2": "",
    "lit1": "",
    "sel1": "",
    "words": [
     {
      "w": "hello",
      "zh": "你好",
      "e": "👋"
     },
     {
      "w": "hi",
      "zh": "嗨",
      "e": "🙋"
     },
     {
      "w": "goodbye",
      "zh": "再见",
      "e": "🤚"
     },
     {
      "w": "bye",
      "zh": "拜拜",
      "e": "🖐️"
     },
     {
      "w": "good",
      "zh": "好的",
      "e": "👍"
     },
     {
      "w": "good morning",
      "zh": "早上好",
      "e": "🌅"
     },
     {
      "w": "good afternoon",
      "zh": "下午好",
      "e": ""
     },
     {
      "w": "good night",
      "zh": "晚安",
      "e": ""
     },
     {
      "w": "thank",
      "zh": "感谢",
      "e": "🙏"
     },
     {
      "w": "thanks",
      "zh": "谢谢",
      "e": "🙇"
     },
     {
      "w": "please",
      "zh": "请",
      "e": "🤲"
     },
     {
      "w": "sorry",
      "zh": "对不起",
      "e": "😞"
     },
     {
      "w": "yes",
      "zh": "是的",
      "e": "✅"
     },
     {
      "w": "no",
      "zh": "不",
      "e": "❌"
     }
    ]
   },
   {
    "id": "pu1-u1",
    "mod": 1,
    "title": "Unit 1 · Our new school",
    "zh": "我们的新学校",
    "page": 6,
    "vocab": "教室物品与人物",
    "grammar": "Where …? 方位介词 in/on/under/next to；this/these 单复数",
    "spell": "p, b",
    "cc": "Be kind at school 对同学友善",
    "lit": "The first day（剧本）",
    "sel": "帮助他人",
    "m1": "Make our classroom English",
    "m2": "Make a classroom poster",
    "lit1": "",
    "sel1": "",
    "words": [
     {
      "w": "school",
      "zh": "学校",
      "e": "🏫"
     },
     {
      "w": "book",
      "zh": "书",
      "e": "📖"
     },
     {
      "w": "pen",
      "zh": "钢笔",
      "e": "🖊️"
     },
     {
      "w": "pencil",
      "zh": "铅笔",
      "e": "✏️"
     },
     {
      "w": "ruler",
      "zh": "尺子",
      "e": "📏"
     },
     {
      "w": "bag",
      "zh": "包",
      "e": "🎒"
     },
     {
      "w": "eraser",
      "zh": "橡皮",
      "e": ""
     },
     {
      "w": "desk",
      "zh": "课桌",
      "e": ""
     },
     {
      "w": "chair",
      "zh": "椅子",
      "e": "💺"
     },
     {
      "w": "crayon",
      "zh": "蜡笔",
      "e": "🖍️"
     },
     {
      "w": "teacher",
      "zh": "老师",
      "e": "👩‍🏫"
     },
     {
      "w": "student",
      "zh": "学生",
      "e": "🎓"
     },
     {
      "w": "classroom",
      "zh": "教室",
      "e": ""
     },
     {
      "w": "window",
      "zh": "窗户",
      "e": "🪟"
     }
    ]
   },
   {
    "id": "pu1-u2",
    "mod": 2,
    "title": "Unit 2 · All about us",
    "zh": "认识我们",
    "page": 18,
    "vocab": "家庭 · 身体部位",
    "grammar": "is/are；have/haven't got",
    "spell": "th, t",
    "cc": "Using our senses 五官与感官",
    "lit": "Mo's friends（真实故事）",
    "sel": "同理心",
    "m1": "Make an All about me book",
    "m2": "Make an All about me book",
    "lit1": "Sara's favourite game（真实故事）",
    "sel1": "关心他人",
    "words": [
     {
      "w": "family",
      "zh": "家",
      "e": "👨‍👩‍👧‍👦"
     },
     {
      "w": "dad",
      "zh": "爸爸",
      "e": "👨‍👦"
     },
     {
      "w": "mom",
      "zh": "妈妈",
      "e": "👩‍👦"
     },
     {
      "w": "father",
      "zh": "父亲",
      "e": "👨"
     },
     {
      "w": "mother",
      "zh": "母亲",
      "e": "👩"
     },
     {
      "w": "brother",
      "zh": "兄弟",
      "e": ""
     },
     {
      "w": "sister",
      "zh": "姐妹",
      "e": ""
     },
     {
      "w": "grandpa",
      "zh": "爷爷",
      "e": "👴"
     },
     {
      "w": "grandma",
      "zh": "奶奶",
      "e": "👵"
     },
     {
      "w": "baby",
      "zh": "宝宝",
      "e": "👶"
     },
     {
      "w": "eye",
      "zh": "眼睛",
      "e": "👁️"
     },
     {
      "w": "ear",
      "zh": "耳朵",
      "e": "👂"
     },
     {
      "w": "nose",
      "zh": "鼻子",
      "e": "👃"
     },
     {
      "w": "mouth",
      "zh": "嘴巴",
      "e": "👄"
     }
    ]
   },
   {
    "id": "pu1-u3",
    "mod": 3,
    "title": "Unit 3 · Fun on the farm",
    "zh": "农场趣事",
    "page": 30,
    "vocab": "农场动物 · 形容词",
    "grammar": "is/are + 形容词；形容词 + 名词；has/hasn't got",
    "spell": "c, k, ck",
    "cc": "What do animals give us? 动物给我们什么",
    "lit": "Animal babies（网页）",
    "sel": "批判性思维",
    "m1": "Make a farm",
    "m2": "Make a farm",
    "lit1": "How cows got their spots（幻想故事）",
    "sel1": "体察他人情绪",
    "words": [
     {
      "w": "duck",
      "zh": "鸭子",
      "e": "🦆"
     },
     {
      "w": "pig",
      "zh": "小猪",
      "e": "🐷"
     },
     {
      "w": "hen",
      "zh": "母鸡",
      "e": "🐔"
     },
     {
      "w": "chick",
      "zh": "小鸡",
      "e": "🐤"
     },
     {
      "w": "cow",
      "zh": "奶牛",
      "e": "🐮"
     },
     {
      "w": "sheep",
      "zh": "绵羊",
      "e": "🐑"
     },
     {
      "w": "goose",
      "zh": "大鹅",
      "e": "🦢"
     },
     {
      "w": "big",
      "zh": "大的",
      "e": ""
     },
     {
      "w": "small",
      "zh": "小的",
      "e": ""
     },
     {
      "w": "long",
      "zh": "长的",
      "e": ""
     },
     {
      "w": "short",
      "zh": "短的/矮的",
      "e": ""
     },
     {
      "w": "young",
      "zh": "年轻的",
      "e": ""
     },
     {
      "w": "pretty",
      "zh": "漂亮的",
      "e": ""
     },
     {
      "w": "cute",
      "zh": "可爱的",
      "e": "🥰"
     }
    ]
   },
   {
    "id": "pu1-u4",
    "mod": 4,
    "title": "Unit 4 · Food with friends",
    "zh": "和朋友吃东西",
    "page": 44,
    "vocab": "食物与饮料",
    "grammar": "like / don't like；请求与提供 Can I have …? Would you like …?",
    "spell": "a",
    "cc": "Making a recipe 食材与做法",
    "lit": "A picnic with friends（真实故事）",
    "sel": "协作",
    "m1": "Organise a picnic",
    "m2": "Organise a picnic",
    "lit1": "",
    "sel1": "分享",
    "words": [
     {
      "w": "egg",
      "zh": "鸡蛋",
      "e": "🥚"
     },
     {
      "w": "rice",
      "zh": "米饭",
      "e": "🍚"
     },
     {
      "w": "noodle",
      "zh": "面条",
      "e": "🍜"
     },
     {
      "w": "bread",
      "zh": "面包",
      "e": "🍞"
     },
     {
      "w": "cake",
      "zh": "蛋糕",
      "e": "🍰"
     },
     {
      "w": "milk",
      "zh": "牛奶",
      "e": "🥛"
     },
     {
      "w": "water",
      "zh": "水",
      "e": "💧"
     },
     {
      "w": "juice",
      "zh": "果汁",
      "e": "🧃"
     },
     {
      "w": "tea",
      "zh": "茶",
      "e": "🍵"
     },
     {
      "w": "hamburger",
      "zh": "汉堡包",
      "e": "🍔"
     },
     {
      "w": "hot dog",
      "zh": "热狗",
      "e": "🌭"
     },
     {
      "w": "apple",
      "zh": "苹果",
      "e": "🍎"
     },
     {
      "w": "banana",
      "zh": "香蕉",
      "e": "🍌"
     },
     {
      "w": "orange",
      "zh": "橙色",
      "e": ""
     }
    ]
   },
   {
    "id": "pu1-u5",
    "mod": 5,
    "title": "Unit 5 · Happy birthday!",
    "zh": "生日快乐",
    "page": 56,
    "vocab": "玩具",
    "grammar": "Whose …? 所有格 's；物主代词 my/your/his/her；want/wants",
    "spell": "h",
    "cc": "Shapes around us 身边的形状",
    "lit": "Nora and Flora can share（真实故事）",
    "sel": "情绪发展",
    "m1": "",
    "m2": "Make a birthday present from recycled materials",
    "lit1": "",
    "sel1": "",
    "words": [
     {
      "w": "ball",
      "zh": "球",
      "e": ""
     },
     {
      "w": "kite",
      "zh": "风筝",
      "e": "🪁"
     },
     {
      "w": "doll",
      "zh": "娃娃",
      "e": ""
     },
     {
      "w": "toy",
      "zh": "玩具",
      "e": ""
     },
     {
      "w": "teddy bear",
      "zh": "泰迪熊",
      "e": "🧸"
     },
     {
      "w": "bike",
      "zh": "自行车",
      "e": "🚲"
     },
     {
      "w": "robot",
      "zh": "机器人",
      "e": "🤖"
     },
     {
      "w": "puzzle",
      "zh": "拼图",
      "e": "🧩"
     },
     {
      "w": "plane",
      "zh": "飞机",
      "e": "✈️"
     },
     {
      "w": "boat",
      "zh": "小船",
      "e": "⛵"
     },
     {
      "w": "car",
      "zh": "小汽车",
      "e": "🚗"
     },
     {
      "w": "balloon",
      "zh": "气球",
      "e": "🎈"
     },
     {
      "w": "game",
      "zh": "游戏",
      "e": "🎮"
     },
     {
      "w": "swing",
      "zh": "秋千",
      "e": ""
     }
    ]
   },
   {
    "id": "pu1-u6",
    "mod": 6,
    "title": "Unit 6 · A day out",
    "zh": "出去玩一天",
    "page": 68,
    "vocab": "交通工具与场所 · 动物园动物",
    "grammar": "there is/are；let's …",
    "spell": "ai, a-e",
    "cc": "Animals in the wild 野生动物的家",
    "lit": "When we go to the wildlife park（诗）",
    "sel": "换位思考",
    "m1": "",
    "m2": "Plan a wildlife tour",
    "lit1": "",
    "sel1": "",
    "words": [
     {
      "w": "bus",
      "zh": "公交车",
      "e": "🚌"
     },
     {
      "w": "train",
      "zh": "火车",
      "e": "🚂"
     },
     {
      "w": "ship",
      "zh": "轮船",
      "e": "🚢"
     },
     {
      "w": "taxi",
      "zh": "出租车",
      "e": "🚕"
     },
     {
      "w": "street",
      "zh": "街道",
      "e": ""
     },
     {
      "w": "truck",
      "zh": "卡车",
      "e": "🚚"
     },
     {
      "w": "van",
      "zh": "面包车",
      "e": "🚐"
     },
     {
      "w": "zoo",
      "zh": "动物园",
      "e": ""
     },
     {
      "w": "park",
      "zh": "公园",
      "e": ""
     },
     {
      "w": "shop",
      "zh": "商店",
      "e": "🏪"
     },
     {
      "w": "lion",
      "zh": "狮子",
      "e": "🦁"
     },
     {
      "w": "tiger",
      "zh": "老虎",
      "e": "🐯"
     },
     {
      "w": "monkey",
      "zh": "猴子",
      "e": "🐵"
     },
     {
      "w": "panda",
      "zh": "熊猫",
      "e": "🐼"
     }
    ]
   },
   {
    "id": "pu1-u7",
    "mod": 7,
    "title": "Unit 7 · Let's play!",
    "zh": "一起玩",
    "page": 82,
    "vocab": "运动与爱好",
    "grammar": "现在进行时 What are you doing?；can 表示许可",
    "spell": "s",
    "cc": "Look after your body! 让身体更强壮",
    "lit": "A good friend（真实故事）",
    "sel": "社会责任",
    "m1": "",
    "m2": "Plan a sports day",
    "lit1": "",
    "sel1": "",
    "words": [
     {
      "w": "football",
      "zh": "足球",
      "e": "⚽"
     },
     {
      "w": "basketball",
      "zh": "篮球",
      "e": "🏀"
     },
     {
      "w": "ping-pong",
      "zh": "乒乓球",
      "e": "🏓"
     },
     {
      "w": "run",
      "zh": "跑",
      "e": "🏃"
     },
     {
      "w": "jump",
      "zh": "跳",
      "e": "🤸"
     },
     {
      "w": "swim",
      "zh": "游泳",
      "e": "🏊"
     },
     {
      "w": "ride",
      "zh": "骑",
      "e": "🚴"
     },
     {
      "w": "climb",
      "zh": "爬",
      "e": "🧗"
     },
     {
      "w": "throw",
      "zh": "扔",
      "e": "🤾"
     },
     {
      "w": "catch",
      "zh": "接住",
      "e": "🥅"
     },
     {
      "w": "kick",
      "zh": "踢",
      "e": ""
     },
     {
      "w": "skate",
      "zh": "滑冰",
      "e": "⛸️"
     },
     {
      "w": "race",
      "zh": "比赛",
      "e": "🏁"
     },
     {
      "w": "play",
      "zh": "玩",
      "e": "🎾"
     }
    ]
   },
   {
    "id": "pu1-u8",
    "mod": 8,
    "title": "Unit 8 · At home",
    "zh": "在家里",
    "page": 94,
    "vocab": "房间与家中物品",
    "grammar": "can 表示能力；方位介词 in front of / between / behind",
    "spell": "i",
    "cc": "Houses around the world 世界各地的房子",
    "lit": "The clock on the wall（诗）",
    "sel": "自主性",
    "m1": "",
    "m2": "Invite a friend to your home",
    "lit1": "",
    "sel1": "",
    "words": [
     {
      "w": "home",
      "zh": "家",
      "e": "🏠"
     },
     {
      "w": "house",
      "zh": "房子",
      "e": "🏡"
     },
     {
      "w": "door",
      "zh": "门",
      "e": "🚪"
     },
     {
      "w": "mirror",
      "zh": "镜子",
      "e": "🪞"
     },
     {
      "w": "bed",
      "zh": "床",
      "e": "🛏️"
     },
     {
      "w": "table",
      "zh": "桌子",
      "e": ""
     },
     {
      "w": "sofa",
      "zh": "沙发",
      "e": "🛋️"
     },
     {
      "w": "lamp",
      "zh": "台灯",
      "e": "💡"
     },
     {
      "w": "kitchen",
      "zh": "厨房",
      "e": "🍳"
     },
     {
      "w": "bedroom",
      "zh": "卧室",
      "e": "🛌"
     },
     {
      "w": "living room",
      "zh": "客厅",
      "e": ""
     },
     {
      "w": "garage",
      "zh": "车库",
      "e": ""
     },
     {
      "w": "floor",
      "zh": "地板",
      "e": ""
     },
     {
      "w": "wall",
      "zh": "墙",
      "e": "🧱"
     }
    ]
   },
   {
    "id": "pu1-u9",
    "mod": 9,
    "title": "Unit 9 · Happy holidays",
    "zh": "快乐假期",
    "page": 106,
    "vocab": "衣服 · 在海边",
    "grammar": "祈使句；like/enjoy + 动名词（me too / so do I）",
    "spell": "j, h",
    "cc": "What can we see on holiday? 自然景观",
    "lit": "The monkey and the shark（传统故事）",
    "sel": "批判性思维",
    "m1": "",
    "m2": "Plan a holiday",
    "lit1": "",
    "sel1": "",
    "words": [
     {
      "w": "shirt",
      "zh": "衬衫",
      "e": "👔"
     },
     {
      "w": "T-shirt",
      "zh": "T恤",
      "e": "👕"
     },
     {
      "w": "dress",
      "zh": "连衣裙",
      "e": "👗"
     },
     {
      "w": "skirt",
      "zh": "短裙",
      "e": "👚"
     },
     {
      "w": "shorts",
      "zh": "短裤",
      "e": "🩳"
     },
     {
      "w": "coat",
      "zh": "大衣",
      "e": "🧥"
     },
     {
      "w": "hat",
      "zh": "帽子",
      "e": "🎩"
     },
     {
      "w": "cap",
      "zh": "鸭舌帽",
      "e": "🧢"
     },
     {
      "w": "shoe",
      "zh": "鞋",
      "e": "👟"
     },
     {
      "w": "sock",
      "zh": "袜子",
      "e": "🧦"
     },
     {
      "w": "beach",
      "zh": "海滩",
      "e": "🏖️"
     },
     {
      "w": "sea",
      "zh": "大海",
      "e": "🌊"
     },
     {
      "w": "sun",
      "zh": "太阳",
      "e": "☀️"
     },
     {
      "w": "sand",
      "zh": "沙子",
      "e": ""
     }
    ]
   },
   {
    "id": "pu1-r1",
    "mod": 0,
    "title": "Review 1-3",
    "zh": "复习 1-3 单元",
    "page": 42,
    "vocab": "",
    "grammar": "复习：方位介词、this/these、have got、like、农场动物",
    "spell": "",
    "cc": "",
    "lit": "",
    "sel": "",
    "m1": "",
    "m2": "",
    "lit1": "",
    "sel1": "",
    "words": []
   },
   {
    "id": "pu1-r2",
    "mod": 0,
    "title": "Review 4-6",
    "zh": "复习 4-6 单元",
    "page": 80,
    "vocab": "",
    "grammar": "复习：like/请求与提供、所有格、there is/are",
    "spell": "",
    "cc": "",
    "lit": "",
    "sel": "",
    "m1": "",
    "m2": "",
    "lit1": "",
    "sel1": "",
    "words": []
   },
   {
    "id": "pu1-r3",
    "mod": 0,
    "title": "Review 7-9",
    "zh": "复习 7-9 单元",
    "page": 118,
    "vocab": "",
    "grammar": "复习：现在进行时、can、祈使句、like+doing",
    "spell": "",
    "cc": "",
    "lit": "",
    "sel": "",
    "m1": "",
    "m2": "",
    "lit1": "",
    "sel1": "",
    "words": []
   }
  ]
 },
 {
  "id": "pu2",
  "name": "Power Up 2",
  "exam": "A1 Movers",
  "emoji": "🐥",
  "tag": "剑桥",
  "units": [
   {
    "id": "pu2-u0",
    "mod": 0,
    "title": "Meet the family",
    "zh": "认识这一家人",
    "page": 4,
    "vocab": "人物名 · 描述人物",
    "grammar": "How old is she? She's five. / He's got long hair.",
    "spell": "",
    "cc": "",
    "lit": "",
    "sel": "",
    "m1": "",
    "m2": "",
    "lit1": "",
    "sel1": "",
    "words": [
     {
      "w": "man",
      "zh": "男人",
      "e": "🧍‍♂️"
     },
     {
      "w": "woman",
      "zh": "女人",
      "e": "🧍‍♀️"
     },
     {
      "w": "boy",
      "zh": "男孩",
      "e": "👦"
     },
     {
      "w": "girl",
      "zh": "女孩",
      "e": "👧"
     },
     {
      "w": "child",
      "zh": "孩子",
      "e": "🧒"
     },
     {
      "w": "children",
      "zh": "孩子们",
      "e": "🧒"
     },
     {
      "w": "kid",
      "zh": "小孩",
      "e": ""
     },
     {
      "w": "lady",
      "zh": "女士",
      "e": ""
     },
     {
      "w": "Mr",
      "zh": "先生",
      "e": ""
     },
     {
      "w": "Miss",
      "zh": "小姐(未婚)",
      "e": ""
     },
     {
      "w": "twin",
      "zh": "双胞胎",
      "e": ""
     },
     {
      "w": "friend",
      "zh": "朋友",
      "e": "🤝"
     },
     {
      "w": "people",
      "zh": "人们",
      "e": "👥"
     },
     {
      "w": "person",
      "zh": "人",
      "e": "🧍"
     }
    ]
   },
   {
    "id": "pu2-u1",
    "mod": 1,
    "title": "Unit 1 · A day on the farm",
    "zh": "农场的一天",
    "page": 6,
    "vocab": "乡村 · 日常作息",
    "grammar": "现在进行时复习；一般现在时表习惯；o'clock 报时",
    "spell": "r",
    "cc": "Look after our planet 照顾我们的星球",
    "lit": "The race（诗 / 第二版漫画）",
    "sel": "社会责任",
    "m1": "Make a daily routine chart",
    "m2": "Make a daily routine poster",
    "lit1": "",
    "sel1": "",
    "words": [
     {
      "w": "sun",
      "zh": "太阳",
      "e": "☀️"
     },
     {
      "w": "moon",
      "zh": "月亮",
      "e": "🌙"
     },
     {
      "w": "star",
      "zh": "星星",
      "e": "⭐"
     },
     {
      "w": "sky",
      "zh": "天空",
      "e": ""
     },
     {
      "w": "cloud",
      "zh": "云",
      "e": "☁️"
     },
     {
      "w": "rain",
      "zh": "雨",
      "e": "🌧️"
     },
     {
      "w": "wind",
      "zh": "风",
      "e": "🌬️"
     },
     {
      "w": "tree",
      "zh": "树",
      "e": "🌳"
     },
     {
      "w": "flower",
      "zh": "花",
      "e": "🌸"
     },
     {
      "w": "grass",
      "zh": "草",
      "e": "🌱"
     },
     {
      "w": "river",
      "zh": "河",
      "e": "🏞️"
     },
     {
      "w": "mountain",
      "zh": "大山",
      "e": "⛰️"
     },
     {
      "w": "sea",
      "zh": "大海",
      "e": "🌊"
     },
     {
      "w": "leaf",
      "zh": "树叶",
      "e": "🍃"
     }
    ]
   },
   {
    "id": "pu2-u2",
    "mod": 2,
    "title": "Unit 2 · My week",
    "zh": "我的一周",
    "page": 18,
    "vocab": "星期 · 课余活动",
    "grammar": "How often …? 频率副词 always/often/sometimes/never；must/mustn't",
    "spell": "ay",
    "cc": "Let's be healthy! 运动安全",
    "lit": "Bad, bad Monday（叙事）",
    "sel": "考虑行为的后果",
    "m1": "Plan a fun activities timetable for two friends",
    "m2": "Make an activities timetable",
    "lit1": "",
    "sel1": "",
    "words": [
     {
      "w": "Monday",
      "zh": "星期一",
      "e": "1️⃣"
     },
     {
      "w": "Tuesday",
      "zh": "星期二",
      "e": "2️⃣"
     },
     {
      "w": "Wednesday",
      "zh": "星期三",
      "e": "3️⃣"
     },
     {
      "w": "Thursday",
      "zh": "星期四",
      "e": "4️⃣"
     },
     {
      "w": "Friday",
      "zh": "星期五",
      "e": "5️⃣"
     },
     {
      "w": "Saturday",
      "zh": "星期六",
      "e": "6️⃣"
     },
     {
      "w": "Sunday",
      "zh": "星期日",
      "e": "7️⃣"
     },
     {
      "w": "weekend",
      "zh": "周末",
      "e": ""
     },
     {
      "w": "birthday",
      "zh": "生日",
      "e": "🎂"
     },
     {
      "w": "read",
      "zh": "读书",
      "e": "📚"
     },
     {
      "w": "write",
      "zh": "写",
      "e": "✍️"
     },
     {
      "w": "draw",
      "zh": "画画",
      "e": "🎨"
     },
     {
      "w": "sing",
      "zh": "唱歌",
      "e": "🎤"
     },
     {
      "w": "dance",
      "zh": "跳舞",
      "e": "💃"
     }
    ]
   },
   {
    "id": "pu2-u3",
    "mod": 3,
    "title": "Unit 3 · Party time!",
    "zh": "派对时间",
    "page": 30,
    "vocab": "职业与派对 · 外貌描述",
    "grammar": "一般现在时 vs 现在进行时；Why …? Because …",
    "spell": "/ɑː/",
    "cc": "People who help us 帮助我们的人",
    "lit": "The costume party（故事）",
    "sel": "求助与提供帮助",
    "m1": "Plan and act out a scene",
    "m2": "Plan a costume party",
    "lit1": "",
    "sel1": "",
    "words": [
     {
      "w": "doctor",
      "zh": "医生",
      "e": "👨‍⚕️"
     },
     {
      "w": "nurse",
      "zh": "护士",
      "e": "👩‍⚕️"
     },
     {
      "w": "driver",
      "zh": "司机",
      "e": ""
     },
     {
      "w": "cook",
      "zh": "厨师",
      "e": "👩‍🍳"
     },
     {
      "w": "farmer",
      "zh": "农民",
      "e": "👨‍🌾"
     },
     {
      "w": "policeman",
      "zh": "警察",
      "e": "👮"
     },
     {
      "w": "worker",
      "zh": "工人",
      "e": "👷"
     },
     {
      "w": "singer",
      "zh": "歌手",
      "e": ""
     },
     {
      "w": "dancer",
      "zh": "舞蹈家",
      "e": ""
     },
     {
      "w": "pilot",
      "zh": "飞行员",
      "e": "👨‍✈️"
     },
     {
      "w": "waiter",
      "zh": "服务员",
      "e": ""
     },
     {
      "w": "job",
      "zh": "工作",
      "e": ""
     },
     {
      "w": "party",
      "zh": "聚会",
      "e": "🥳"
     },
     {
      "w": "candle",
      "zh": "蜡烛",
      "e": "🕯️"
     }
    ]
   },
   {
    "id": "pu2-u4",
    "mod": 4,
    "title": "Unit 4 · The family at home",
    "zh": "一家人在家",
    "page": 44,
    "vocab": "大家庭 · 家居",
    "grammar": "比较级 -er/-ier/better/worse；名词性物主代词 ours/theirs",
    "spell": "/ʌ/",
    "cc": "Machines in our homes 家里的机器",
    "lit": "Surprise!（故事）",
    "sel": "主动性与情绪管理",
    "m1": "Act out a visit to my cousins' new home",
    "m2": "Give a tour of your family's home",
    "lit1": "",
    "sel1": "",
    "words": [
     {
      "w": "uncle",
      "zh": "叔叔",
      "e": "🧔"
     },
     {
      "w": "aunt",
      "zh": "阿姨",
      "e": "👩‍🦰"
     },
     {
      "w": "grandpa",
      "zh": "爷爷",
      "e": "👴"
     },
     {
      "w": "grandma",
      "zh": "奶奶",
      "e": "👵"
     },
     {
      "w": "home",
      "zh": "家",
      "e": "🏠"
     },
     {
      "w": "house",
      "zh": "房子",
      "e": "🏡"
     },
     {
      "w": "door",
      "zh": "门",
      "e": "🚪"
     },
     {
      "w": "window",
      "zh": "窗户",
      "e": "🪟"
     },
     {
      "w": "bed",
      "zh": "床",
      "e": "🛏️"
     },
     {
      "w": "table",
      "zh": "桌子",
      "e": ""
     },
     {
      "w": "sofa",
      "zh": "沙发",
      "e": "🛋️"
     },
     {
      "w": "kitchen",
      "zh": "厨房",
      "e": "🍳"
     },
     {
      "w": "bathroom",
      "zh": "浴室",
      "e": "🛁"
     },
     {
      "w": "garden",
      "zh": "花园",
      "e": "🌷"
     }
    ]
   },
   {
    "id": "pu2-u5",
    "mod": 5,
    "title": "Unit 5 · Animal world",
    "zh": "动物世界",
    "page": 56,
    "vocab": "野生动物的家养动物 · 动作动词",
    "grammar": "最高级 the prettiest/the best；方位介词 above/below/near/opposite",
    "spell": "g",
    "cc": "The animal kingdom 动物与食物",
    "lit": "Why the kangaroo has a pouch（澳洲梦幻故事）",
    "sel": "帮助他人",
    "m1": "",
    "m2": "Make an animal fact file",
    "lit1": "",
    "sel1": "",
    "words": [
     {
      "w": "horse",
      "zh": "马",
      "e": "🐴"
     },
     {
      "w": "goat",
      "zh": "山羊",
      "e": "🐐"
     },
     {
      "w": "fox",
      "zh": "狐狸",
      "e": "🦊"
     },
     {
      "w": "wolf",
      "zh": "狼",
      "e": "🐺"
     },
     {
      "w": "deer",
      "zh": "鹿",
      "e": "🦌"
     },
     {
      "w": "snake",
      "zh": "蛇",
      "e": "🐍"
     },
     {
      "w": "frog",
      "zh": "青蛙",
      "e": "🐸"
     },
     {
      "w": "turtle",
      "zh": "乌龟",
      "e": "🐢"
     },
     {
      "w": "butterfly",
      "zh": "蝴蝶",
      "e": "🦋"
     },
     {
      "w": "bee",
      "zh": "蜜蜂",
      "e": "🐝"
     },
     {
      "w": "ant",
      "zh": "蚂蚁",
      "e": "🐜"
     },
     {
      "w": "spider",
      "zh": "蜘蛛",
      "e": "🕷️"
     },
     {
      "w": "bat",
      "zh": "蝙蝠",
      "e": "🦇"
     },
     {
      "w": "parrot",
      "zh": "鹦鹉",
      "e": "🦜"
     }
    ]
   },
   {
    "id": "pu2-u6",
    "mod": 6,
    "title": "Unit 6 · Our weather",
    "zh": "我们的天气",
    "page": 68,
    "vocab": "天气 · 衣服",
    "grammar": "was/were；there was / there were",
    "spell": "ee and y",
    "cc": "What's the weather like today? 测量天气的工具",
    "lit": "Fun in all types of weather!（诗）",
    "sel": "积极心态",
    "m1": "",
    "m2": "Make a weather map for a country",
    "lit1": "",
    "sel1": "",
    "words": [
     {
      "w": "hot",
      "zh": "热",
      "e": "🥵"
     },
     {
      "w": "cold",
      "zh": "冷",
      "e": "🥶"
     },
     {
      "w": "warm",
      "zh": "温暖",
      "e": ""
     },
     {
      "w": "cool",
      "zh": "凉爽",
      "e": ""
     },
     {
      "w": "sunny",
      "zh": "晴朗的",
      "e": "🔆"
     },
     {
      "w": "rainy",
      "zh": "下雨的",
      "e": ""
     },
     {
      "w": "windy",
      "zh": "刮风的",
      "e": "💨"
     },
     {
      "w": "snowy",
      "zh": "下雪的",
      "e": "🌨️"
     },
     {
      "w": "cloudy",
      "zh": "多云的",
      "e": "⛅"
     },
     {
      "w": "fine",
      "zh": "晴好",
      "e": ""
     },
     {
      "w": "raincoat",
      "zh": "雨衣",
      "e": ""
     },
     {
      "w": "umbrella",
      "zh": "雨伞",
      "e": "☂️"
     },
     {
      "w": "spring",
      "zh": "春天",
      "e": "🌼"
     },
     {
      "w": "summer",
      "zh": "夏天",
      "e": "🌞"
     }
    ]
   },
   {
    "id": "pu2-u7",
    "mod": 7,
    "title": "Unit 7 · Let's cook!",
    "zh": "来做饭",
    "page": 82,
    "vocab": "食物 · 厨房动作",
    "grammar": "一般过去时：不规则动词；规则动词",
    "spell": "ch",
    "cc": "Plants are delicious! 植物与食物",
    "lit": "Sonny's dream（奇幻故事）",
    "sel": "坚持",
    "m1": "",
    "m2": "Make a class recipe book",
    "lit1": "",
    "sel1": "",
    "words": [
     {
      "w": "potato",
      "zh": "土豆",
      "e": "🥔"
     },
     {
      "w": "tomato",
      "zh": "西红柿",
      "e": "🍅"
     },
     {
      "w": "carrot",
      "zh": "胡萝卜",
      "e": "🥕"
     },
     {
      "w": "onion",
      "zh": "洋葱",
      "e": "🧅"
     },
     {
      "w": "corn",
      "zh": "玉米",
      "e": "🌽"
     },
     {
      "w": "pumpkin",
      "zh": "南瓜",
      "e": "🎃"
     },
     {
      "w": "pepper",
      "zh": "辣椒",
      "e": "🌶️"
     },
     {
      "w": "bean",
      "zh": "豆子",
      "e": "🫘"
     },
     {
      "w": "wash",
      "zh": "洗",
      "e": "🚿"
     },
     {
      "w": "mix",
      "zh": "混合",
      "e": ""
     },
     {
      "w": "open",
      "zh": "打开",
      "e": "📂"
     },
     {
      "w": "close",
      "zh": "关上",
      "e": "📁"
     },
     {
      "w": "eat",
      "zh": "吃",
      "e": "🍽️"
     },
     {
      "w": "drink",
      "zh": "喝",
      "e": "🥤"
     }
    ]
   },
   {
    "id": "pu2-u8",
    "mod": 8,
    "title": "Unit 8 · Around town",
    "zh": "城里转转",
    "page": 94,
    "vocab": "一日游 · 城镇场所",
    "grammar": "更多不规则过去式；have to / don't have to",
    "spell": "ow and oa",
    "cc": "Road safety 交通安全",
    "lit": "Tom's first day at the new school（幽默故事）",
    "sel": "乐观",
    "m1": "",
    "m2": "Write a trip review",
    "lit1": "",
    "sel1": "",
    "words": [
     {
      "w": "park",
      "zh": "公园",
      "e": ""
     },
     {
      "w": "zoo",
      "zh": "动物园",
      "e": ""
     },
     {
      "w": "shop",
      "zh": "商店",
      "e": "🏪"
     },
     {
      "w": "store",
      "zh": "店铺",
      "e": "🏬"
     },
     {
      "w": "supermarket",
      "zh": "超市",
      "e": "🛒"
     },
     {
      "w": "hospital",
      "zh": "医院",
      "e": "🏥"
     },
     {
      "w": "library",
      "zh": "图书馆",
      "e": ""
     },
     {
      "w": "cinema",
      "zh": "电影院",
      "e": "🎦"
     },
     {
      "w": "museum",
      "zh": "博物馆",
      "e": "🏛️"
     },
     {
      "w": "hotel",
      "zh": "旅馆",
      "e": "🏨"
     },
     {
      "w": "restaurant",
      "zh": "餐馆",
      "e": ""
     },
     {
      "w": "bank",
      "zh": "银行",
      "e": "🏦"
     },
     {
      "w": "road",
      "zh": "马路",
      "e": "🛣️"
     },
     {
      "w": "street",
      "zh": "街道",
      "e": ""
     }
    ]
   },
   {
    "id": "pu2-u9",
    "mod": 9,
    "title": "Unit 9 · A big change",
    "zh": "大变化",
    "page": 106,
    "vocab": "观点与情感形容词 · 新冒险",
    "grammar": "more 比较级；the most 最高级",
    "spell": "ing / in",
    "cc": "The wonders of the world 世界奇观",
    "lit": "（本单元以任务与复习为主）",
    "sel": "自豪",
    "m1": "",
    "m2": "Plan a holiday world tour",
    "lit1": "",
    "sel1": "",
    "words": [
     {
      "w": "tired",
      "zh": "累的",
      "e": "😪"
     },
     {
      "w": "thirsty",
      "zh": "渴的",
      "e": ""
     },
     {
      "w": "hungry",
      "zh": "饿的",
      "e": ""
     },
     {
      "w": "afraid",
      "zh": "害怕的",
      "e": "😨"
     },
     {
      "w": "worried",
      "zh": "担心的",
      "e": "😟"
     },
     {
      "w": "excited",
      "zh": "兴奋的",
      "e": "🤩"
     },
     {
      "w": "bored",
      "zh": "感到无聊的（人）",
      "e": ""
     },
     {
      "w": "surprised",
      "zh": "惊讶的",
      "e": "😲"
     },
     {
      "w": "proud",
      "zh": "自豪的",
      "e": "😎"
     },
     {
      "w": "happy",
      "zh": "开心的",
      "e": "😄"
     },
     {
      "w": "sad",
      "zh": "难过的",
      "e": "😔"
     },
     {
      "w": "travel",
      "zh": "旅行",
      "e": ""
     },
     {
      "w": "trip",
      "zh": "旅程",
      "e": ""
     },
     {
      "w": "visit",
      "zh": "参观",
      "e": ""
     }
    ]
   },
   {
    "id": "pu2-r1",
    "mod": 0,
    "title": "Review 1-3",
    "zh": "复习 1-3 单元",
    "page": 42,
    "vocab": "",
    "grammar": "复习：现在进行时、频率副词、Why/Because",
    "spell": "",
    "cc": "",
    "lit": "",
    "sel": "",
    "m1": "",
    "m2": "",
    "lit1": "",
    "sel1": "",
    "words": []
   },
   {
    "id": "pu2-r2",
    "mod": 0,
    "title": "Review 4-6",
    "zh": "复习 4-6 单元",
    "page": 80,
    "vocab": "",
    "grammar": "复习：比较级、最高级、was/were",
    "spell": "",
    "cc": "",
    "lit": "",
    "sel": "",
    "m1": "",
    "m2": "",
    "lit1": "",
    "sel1": "",
    "words": []
   },
   {
    "id": "pu2-r3",
    "mod": 0,
    "title": "Review 7-9",
    "zh": "复习 7-9 单元",
    "page": 118,
    "vocab": "",
    "grammar": "复习：过去时、have to、more/most",
    "spell": "",
    "cc": "",
    "lit": "",
    "sel": "",
    "m1": "",
    "m2": "",
    "lit1": "",
    "sel1": "",
    "words": []
   }
  ]
 },
 {
  "id": "pu3",
  "name": "Power Up 3",
  "exam": "A1 Movers → A2 Flyers",
  "emoji": "🦉",
  "tag": "剑桥",
  "units": [
   {
    "id": "pu3-u0",
    "mod": 0,
    "title": "Welcome to Diversicus",
    "zh": "欢迎来到迪弗西库斯",
    "page": 4,
    "vocab": "人物名 · 问候 · 语言复习",
    "grammar": "疑问词复习 how/what/when/where/which/who/why；was/were + could",
    "spell": "numbers",
    "cc": "",
    "lit": "",
    "sel": "",
    "m1": "",
    "m2": "",
    "lit1": "",
    "sel1": "",
    "words": [
     {
      "w": "hello",
      "zh": "你好",
      "e": "👋"
     },
     {
      "w": "hi",
      "zh": "嗨",
      "e": "🙋"
     },
     {
      "w": "meet",
      "zh": "遇见",
      "e": ""
     },
     {
      "w": "introduce",
      "zh": "介绍",
      "e": ""
     },
     {
      "w": "greet",
      "zh": "问候",
      "e": ""
     },
     {
      "w": "name",
      "zh": "名字",
      "e": ""
     },
     {
      "w": "how",
      "zh": "怎样",
      "e": ""
     },
     {
      "w": "what",
      "zh": "什么",
      "e": ""
     },
     {
      "w": "when",
      "zh": "什么时候",
      "e": ""
     },
     {
      "w": "where",
      "zh": "哪里",
      "e": ""
     },
     {
      "w": "which",
      "zh": "哪一个",
      "e": ""
     },
     {
      "w": "who",
      "zh": "谁",
      "e": ""
     },
     {
      "w": "why",
      "zh": "为什么",
      "e": ""
     },
     {
      "w": "goodbye",
      "zh": "再见",
      "e": "🤚"
     }
    ]
   },
   {
    "id": "pu3-u1",
    "mod": 1,
    "title": "Unit 1 · Practice time",
    "zh": "练习时间",
    "page": 6,
    "vocab": "报时 · 动作动词",
    "grammar": "was/were + could；疑问词复习",
    "spell": "numbers",
    "cc": "Balancing act 平衡与协调",
    "lit": "The circus child（真实故事）",
    "sel": "坚持",
    "m1": "",
    "m2": "Plan a week in the life of a circus artist",
    "lit1": "",
    "sel1": "",
    "words": [
     {
      "w": "day",
      "zh": "天",
      "e": "📅"
     },
     {
      "w": "week",
      "zh": "星期",
      "e": "🗓️"
     },
     {
      "w": "today",
      "zh": "今天",
      "e": ""
     },
     {
      "w": "tomorrow",
      "zh": "明天",
      "e": ""
     },
     {
      "w": "yesterday",
      "zh": "昨天",
      "e": ""
     },
     {
      "w": "now",
      "zh": "现在",
      "e": ""
     },
     {
      "w": "early",
      "zh": "早",
      "e": "🌄"
     },
     {
      "w": "late",
      "zh": "晚",
      "e": "🌜"
     },
     {
      "w": "o'clock",
      "zh": "点钟",
      "e": "🕐"
     },
     {
      "w": "hour",
      "zh": "小时",
      "e": "⏰"
     },
     {
      "w": "minute",
      "zh": "分钟",
      "e": "⏲️"
     },
     {
      "w": "dance",
      "zh": "跳舞",
      "e": "💃"
     },
     {
      "w": "run",
      "zh": "跑",
      "e": "🏃"
     },
     {
      "w": "jump",
      "zh": "跳",
      "e": "🤸"
     },
     {
      "w": "climb",
      "zh": "爬",
      "e": "🧗"
     }
    ]
   },
   {
    "id": "pu3-u2",
    "mod": 2,
    "title": "Unit 2 · What's for breakfast?",
    "zh": "早餐吃什么",
    "page": 18,
    "vocab": "食物与饮料 · 不规则过去式",
    "grammar": "定语从句 where/who/which；过去时 + with/when",
    "spell": "c 发 /s/ 与 /k/",
    "cc": "Food, glorious food 食物与营养",
    "lit": "The old man and the small fish（真实故事）",
    "sel": "尊重他人的选择",
    "m1": "Become a restaurant owner",
    "m2": "Make a flyer for your restaurant",
    "lit1": "",
    "sel1": "",
    "words": [
     {
      "w": "breakfast",
      "zh": "早餐",
      "e": ""
     },
     {
      "w": "lunch",
      "zh": "午餐",
      "e": ""
     },
     {
      "w": "dinner",
      "zh": "晚餐",
      "e": ""
     },
     {
      "w": "egg",
      "zh": "鸡蛋",
      "e": "🥚"
     },
     {
      "w": "milk",
      "zh": "牛奶",
      "e": "🥛"
     },
     {
      "w": "bread",
      "zh": "面包",
      "e": "🍞"
     },
     {
      "w": "juice",
      "zh": "果汁",
      "e": "🧃"
     },
     {
      "w": "rice",
      "zh": "米饭",
      "e": "🍚"
     },
     {
      "w": "soup",
      "zh": "汤",
      "e": ""
     },
     {
      "w": "fruit",
      "zh": "水果",
      "e": "🍏"
     },
     {
      "w": "apple",
      "zh": "苹果",
      "e": "🍎"
     },
     {
      "w": "banana",
      "zh": "香蕉",
      "e": "🍌"
     },
     {
      "w": "orange",
      "zh": "橙色",
      "e": ""
     },
     {
      "w": "grape",
      "zh": "葡萄",
      "e": "🍇"
     }
    ]
   },
   {
    "id": "pu3-u3",
    "mod": 3,
    "title": "Unit 3 · A healthy body",
    "zh": "健康的身体",
    "page": 30,
    "vocab": "身体部位 · 健康问题",
    "grammar": "比较级最高级复习 as … as；want/need + 不定式",
    "spell": "kn 与 n",
    "cc": "Work your body 骨骼与关节",
    "lit": "Too-too-moo and the Komodo dragon（奇幻剧本）",
    "sel": "同理心",
    "m1": "Become a health expert",
    "m2": "Make a health plan",
    "lit1": "",
    "sel1": "",
    "words": [
     {
      "w": "head",
      "zh": "头",
      "e": ""
     },
     {
      "w": "hand",
      "zh": "手",
      "e": "✋"
     },
     {
      "w": "arm",
      "zh": "手臂",
      "e": ""
     },
     {
      "w": "leg",
      "zh": "腿",
      "e": "🦵"
     },
     {
      "w": "foot",
      "zh": "脚",
      "e": "🦶"
     },
     {
      "w": "eye",
      "zh": "眼睛",
      "e": "👁️"
     },
     {
      "w": "ear",
      "zh": "耳朵",
      "e": "👂"
     },
     {
      "w": "nose",
      "zh": "鼻子",
      "e": "👃"
     },
     {
      "w": "mouth",
      "zh": "嘴巴",
      "e": "👄"
     },
     {
      "w": "tooth",
      "zh": "牙齿",
      "e": "🦷"
     },
     {
      "w": "health",
      "zh": "健康",
      "e": "💚"
     },
     {
      "w": "healthy",
      "zh": "健康的",
      "e": "🥗"
     },
     {
      "w": "sick",
      "zh": "生病的",
      "e": "🤒"
     },
     {
      "w": "fever",
      "zh": "发烧",
      "e": "🌡️"
     }
    ]
   },
   {
    "id": "pu3-u4",
    "mod": 4,
    "title": "Unit 4 · Fun in the jungle",
    "zh": "丛林探险",
    "page": 44,
    "vocab": "自然地貌 · 过去式动词",
    "grammar": "副词 well/badly/loudly…；比较副词 faster/better",
    "spell": "l, ll, le",
    "cc": "From the roots to the flower 植物怎么长",
    "lit": "The story of Rama and Sita（印度神话）",
    "sel": "帮助他人",
    "m1": "",
    "m2": "Create a jungle adventure park",
    "lit1": "",
    "sel1": "",
    "words": [
     {
      "w": "earth",
      "zh": "地球",
      "e": "🌍"
     },
     {
      "w": "planet",
      "zh": "行星",
      "e": "🪐"
     },
     {
      "w": "rock",
      "zh": "岩石",
      "e": "🪨"
     },
     {
      "w": "sand",
      "zh": "沙子",
      "e": ""
     },
     {
      "w": "plant",
      "zh": "植物",
      "e": "🪴"
     },
     {
      "w": "wood",
      "zh": "木头",
      "e": "🪵"
     },
     {
      "w": "air",
      "zh": "空气",
      "e": ""
     },
     {
      "w": "bamboo",
      "zh": "竹子",
      "e": "🎍"
     },
     {
      "w": "cave",
      "zh": "山洞",
      "e": "🕳️"
     },
     {
      "w": "volcano",
      "zh": "火山",
      "e": "🌋"
     },
     {
      "w": "desert",
      "zh": "沙漠",
      "e": ""
     },
     {
      "w": "jungle",
      "zh": "丛林",
      "e": ""
     },
     {
      "w": "forest",
      "zh": "森林",
      "e": "🌲"
     },
     {
      "w": "lake",
      "zh": "湖",
      "e": ""
     }
    ]
   },
   {
    "id": "pu3-u5",
    "mod": 5,
    "title": "Unit 5 · Behind the scenes",
    "zh": "幕后",
    "page": 56,
    "vocab": "描述服装 · 材料",
    "grammar": "be made of；shall / could / let's 表建议",
    "spell": "igh, i-e",
    "cc": "Materials and properties 材料的性质",
    "lit": "The myth of Icarus（希腊神话）",
    "sel": "批判性思维",
    "m1": "",
    "m2": "Plan a play",
    "lit1": "",
    "sel1": "",
    "words": [
     {
      "w": "shirt",
      "zh": "衬衫",
      "e": "👔"
     },
     {
      "w": "dress",
      "zh": "连衣裙",
      "e": "👗"
     },
     {
      "w": "coat",
      "zh": "大衣",
      "e": "🧥"
     },
     {
      "w": "hat",
      "zh": "帽子",
      "e": "🎩"
     },
     {
      "w": "shoe",
      "zh": "鞋",
      "e": "👟"
     },
     {
      "w": "scarf",
      "zh": "围巾",
      "e": "🧣"
     },
     {
      "w": "glove",
      "zh": "手套",
      "e": "🧤"
     },
     {
      "w": "belt",
      "zh": "皮带",
      "e": ""
     },
     {
      "w": "button",
      "zh": "纽扣",
      "e": ""
     },
     {
      "w": "paint",
      "zh": "绘画",
      "e": ""
     },
     {
      "w": "brush",
      "zh": "画笔",
      "e": "🖌️"
     },
     {
      "w": "stage",
      "zh": "舞台",
      "e": "🎭"
     },
     {
      "w": "band",
      "zh": "乐队",
      "e": "🎺"
     },
     {
      "w": "concert",
      "zh": "音乐会",
      "e": ""
     }
    ]
   },
   {
    "id": "pu3-u6",
    "mod": 6,
    "title": "Unit 6 · Classroom stars",
    "zh": "教室之星",
    "page": 68,
    "vocab": "学科 · 学校词汇",
    "grammar": "should / shouldn't 给建议",
    "spell": "",
    "cc": "Where are we? 地图与符号",
    "lit": "The project（故事带歌）",
    "sel": "协作",
    "m1": "",
    "m2": "",
    "lit1": "",
    "sel1": "",
    "words": [
     {
      "w": "Chinese",
      "zh": "语文",
      "e": "🀄"
     },
     {
      "w": "English",
      "zh": "英语",
      "e": "🔠"
     },
     {
      "w": "math",
      "zh": "数学",
      "e": "➗"
     },
     {
      "w": "music",
      "zh": "音乐",
      "e": "🎵"
     },
     {
      "w": "art",
      "zh": "美术",
      "e": ""
     },
     {
      "w": "science",
      "zh": "科学",
      "e": ""
     },
     {
      "w": "computer",
      "zh": "电脑",
      "e": "💻"
     },
     {
      "w": "lesson",
      "zh": "课",
      "e": ""
     },
     {
      "w": "homework",
      "zh": "作业",
      "e": ""
     },
     {
      "w": "subject",
      "zh": "学科",
      "e": ""
     },
     {
      "w": "classmate",
      "zh": "同学",
      "e": ""
     },
     {
      "w": "test",
      "zh": "测验",
      "e": ""
     },
     {
      "w": "grade",
      "zh": "年级",
      "e": "🎖️"
     },
     {
      "w": "class",
      "zh": "班级",
      "e": ""
     }
    ]
   },
   {
    "id": "pu3-u7",
    "mod": 7,
    "title": "Unit 7 · When I grow up …",
    "zh": "长大后",
    "page": 82,
    "vocab": "职业 · 性格形容词",
    "grammar": "have to / must；because 说原因",
    "spell": "-er, -ar",
    "cc": "Time detectives 考古",
    "lit": "Don Quixote（冒险剧本）",
    "sel": "数字素养",
    "m1": "",
    "m2": "",
    "lit1": "",
    "sel1": "",
    "words": [
     {
      "w": "doctor",
      "zh": "医生",
      "e": "👨‍⚕️"
     },
     {
      "w": "nurse",
      "zh": "护士",
      "e": "👩‍⚕️"
     },
     {
      "w": "teacher",
      "zh": "老师",
      "e": "👩‍🏫"
     },
     {
      "w": "driver",
      "zh": "司机",
      "e": ""
     },
     {
      "w": "cook",
      "zh": "厨师",
      "e": "👩‍🍳"
     },
     {
      "w": "farmer",
      "zh": "农民",
      "e": "👨‍🌾"
     },
     {
      "w": "singer",
      "zh": "歌手",
      "e": ""
     },
     {
      "w": "dancer",
      "zh": "舞蹈家",
      "e": ""
     },
     {
      "w": "writer",
      "zh": "作家",
      "e": ""
     },
     {
      "w": "pilot",
      "zh": "飞行员",
      "e": "👨‍✈️"
     },
     {
      "w": "scientist",
      "zh": "科学家",
      "e": "🔬"
     },
     {
      "w": "dentist",
      "zh": "牙医",
      "e": ""
     },
     {
      "w": "artist",
      "zh": "画家",
      "e": ""
     },
     {
      "w": "job",
      "zh": "工作",
      "e": ""
     }
    ]
   },
   {
    "id": "pu3-u8",
    "mod": 8,
    "title": "Unit 8 · City break",
    "zh": "城市短假",
    "page": 94,
    "vocab": "方向 · 城镇场所",
    "grammar": "be going to 表计划",
    "spell": "",
    "cc": "Home, sweet home 城市与乡村",
    "lit": "The road to Hope（诗）",
    "sel": "社会责任",
    "m1": "",
    "m2": "",
    "lit1": "",
    "sel1": "",
    "words": [
     {
      "w": "building",
      "zh": "大楼",
      "e": "🏢"
     },
     {
      "w": "tower",
      "zh": "塔",
      "e": "🗼"
     },
     {
      "w": "corner",
      "zh": "角落",
      "e": "📐"
     },
     {
      "w": "block",
      "zh": "街区",
      "e": ""
     },
     {
      "w": "map",
      "zh": "地图",
      "e": "🗺️"
     },
     {
      "w": "east",
      "zh": "东方",
      "e": ""
     },
     {
      "w": "west",
      "zh": "西方",
      "e": ""
     },
     {
      "w": "north",
      "zh": "北方",
      "e": "⬆️"
     },
     {
      "w": "south",
      "zh": "南方",
      "e": "⬇️"
     },
     {
      "w": "capital",
      "zh": "首都",
      "e": ""
     },
     {
      "w": "fountain",
      "zh": "广场喷泉",
      "e": "⛲"
     },
     {
      "w": "hill",
      "zh": "小山",
      "e": ""
     },
     {
      "w": "park",
      "zh": "公园",
      "e": ""
     },
     {
      "w": "museum",
      "zh": "博物馆",
      "e": "🏛️"
     }
    ]
   },
   {
    "id": "pu3-u9",
    "mod": 9,
    "title": "Unit 9 · Let's travel!",
    "zh": "去旅行",
    "page": 106,
    "vocab": "形容词 · 度假",
    "grammar": "before / after / when 从句",
    "spell": "",
    "cc": "North, south, east and west 徒步带什么",
    "lit": "The story of Popocatepetl and Iztaccihuatl（传说）",
    "sel": "情绪发展",
    "m1": "",
    "m2": "",
    "lit1": "",
    "sel1": "",
    "words": [
     {
      "w": "travel",
      "zh": "旅行",
      "e": ""
     },
     {
      "w": "trip",
      "zh": "旅程",
      "e": ""
     },
     {
      "w": "tour",
      "zh": "观光",
      "e": ""
     },
     {
      "w": "visit",
      "zh": "参观",
      "e": ""
     },
     {
      "w": "ticket",
      "zh": "票",
      "e": "🎫"
     },
     {
      "w": "suitcase",
      "zh": "行李箱",
      "e": "🧳"
     },
     {
      "w": "passport",
      "zh": "护照",
      "e": "🛂"
     },
     {
      "w": "beach",
      "zh": "海滩",
      "e": "🏖️"
     },
     {
      "w": "island",
      "zh": "岛",
      "e": "🏝️"
     },
     {
      "w": "camp",
      "zh": "露营",
      "e": "⛺"
     },
     {
      "w": "photo",
      "zh": "照片",
      "e": "📷"
     },
     {
      "w": "vacation",
      "zh": "度假",
      "e": "🌴"
     },
     {
      "w": "journey",
      "zh": "旅途",
      "e": ""
     },
     {
      "w": "pack",
      "zh": "打包",
      "e": ""
     }
    ]
   },
   {
    "id": "pu3-r1",
    "mod": 0,
    "title": "Review 1-3",
    "zh": "复习 1-3 单元",
    "page": 42,
    "vocab": "",
    "grammar": "复习：could、定语从句、as…as、should",
    "spell": "",
    "cc": "",
    "lit": "",
    "sel": "",
    "m1": "",
    "m2": "",
    "lit1": "",
    "sel1": "",
    "words": []
   },
   {
    "id": "pu3-r2",
    "mod": 0,
    "title": "Review 4-6",
    "zh": "复习 4-6 单元",
    "page": 80,
    "vocab": "",
    "grammar": "复习：比较副词、be made of、should",
    "spell": "",
    "cc": "",
    "lit": "",
    "sel": "",
    "m1": "",
    "m2": "",
    "lit1": "",
    "sel1": "",
    "words": []
   },
   {
    "id": "pu3-r3",
    "mod": 0,
    "title": "Review 7-9",
    "zh": "复习 7-9 单元",
    "page": 118,
    "vocab": "",
    "grammar": "复习：have to、be going to、时间从句",
    "spell": "",
    "cc": "",
    "lit": "",
    "sel": "",
    "m1": "",
    "m2": "",
    "lit1": "",
    "sel1": "",
    "words": []
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
    "id": "pu4-u0",
    "mod": 0,
    "title": "Welcome to Diversicus",
    "zh": "欢迎来到迪维西城",
    "page": 4,
    "vocab": "主角人名 · 人物描写",
    "grammar": "复习 Level 3 全部语法",
    "spell": "",
    "cc": "",
    "lit": "",
    "sel": "",
    "m1": "",
    "m2": "",
    "exam": "",
    "words": [
     {
      "w": "welcome",
      "zh": "欢迎",
      "e": "🎊"
     },
     {
      "w": "friend",
      "zh": "朋友",
      "e": "🤝"
     },
     {
      "w": "boy",
      "zh": "男孩",
      "e": "👦"
     },
     {
      "w": "girl",
      "zh": "女孩",
      "e": "👧"
     },
     {
      "w": "name",
      "zh": "名字",
      "e": ""
     },
     {
      "w": "happy",
      "zh": "开心的",
      "e": "😄"
     },
     {
      "w": "twin",
      "zh": "双胞胎",
      "e": ""
     },
     {
      "w": "family",
      "zh": "家",
      "e": "👨‍👩‍👧‍👦"
     }
    ]
   },
   {
    "id": "pu4-u1",
    "mod": 1,
    "title": "This year's trip",
    "zh": "今年的旅行",
    "page": 6,
    "vocab": "月份与序数词 · 旅程",
    "grammar": "might/may 表推测（It might be hot.）；不定代词 everywhere/somewhere/anywhere/nowhere、everyone/someone/anyone/no-one、everything/something/anything/nothing",
    "spell": "月份词的重音",
    "cc": "What's the climate like? 气候与气候带 · The Arabian Desert",
    "lit": "The lion of the Seas（儿童百科条目）",
    "sel": "文化意识",
    "m1": "",
    "m2": "Plan a trip with a friend",
    "exam": "A2 Reading and Writing",
    "words": [
     {
      "w": "month",
      "zh": "月份",
      "e": "📆"
     },
     {
      "w": "year",
      "zh": "年",
      "e": ""
     },
     {
      "w": "first",
      "zh": "首先",
      "e": ""
     },
     {
      "w": "last",
      "zh": "最后的",
      "e": ""
     },
     {
      "w": "next",
      "zh": "下一个",
      "e": ""
     },
     {
      "w": "trip",
      "zh": "旅程",
      "e": ""
     },
     {
      "w": "travel",
      "zh": "旅行",
      "e": ""
     },
     {
      "w": "journey",
      "zh": "旅途",
      "e": ""
     },
     {
      "w": "ticket",
      "zh": "票",
      "e": "🎫"
     },
     {
      "w": "map",
      "zh": "地图",
      "e": "🗺️"
     },
     {
      "w": "warm",
      "zh": "温暖",
      "e": ""
     },
     {
      "w": "cool",
      "zh": "凉爽",
      "e": ""
     },
     {
      "w": "hot",
      "zh": "热",
      "e": "🥵"
     },
     {
      "w": "raincoat",
      "zh": "雨衣",
      "e": ""
     }
    ],
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
    ]
   },
   {
    "id": "pu4-u2",
    "mod": 2,
    "title": "Our beautiful planet",
    "zh": "我们美丽的星球",
    "page": 18,
    "vocab": "自然界 · 动物",
    "grammar": "一般过去时复习：规则与不规则动词 + ago（We got here three days ago.）；too 和 enough（There is too much pollution. / There is not enough ice.）",
    "spell": "silent e 不发音的 e",
    "cc": "Save our world 濒危动物 · Animals in Australia",
    "lit": "When Dad lost his glasses（诗歌）",
    "sel": "系统思维 · 欣赏相互依存",
    "m1": "",
    "m2": "Make an explorer's expedition diary",
    "exam": "A2 Listening",
    "words": [
     {
      "w": "earth",
      "zh": "地球",
      "e": "🌍"
     },
     {
      "w": "sky",
      "zh": "天空",
      "e": ""
     },
     {
      "w": "star",
      "zh": "星星",
      "e": "⭐"
     },
     {
      "w": "moon",
      "zh": "月亮",
      "e": "🌙"
     },
     {
      "w": "sun",
      "zh": "太阳",
      "e": "☀️"
     },
     {
      "w": "tree",
      "zh": "树",
      "e": "🌳"
     },
     {
      "w": "flower",
      "zh": "花",
      "e": "🌸"
     },
     {
      "w": "river",
      "zh": "河",
      "e": "🏞️"
     },
     {
      "w": "mountain",
      "zh": "大山",
      "e": "⛰️"
     },
     {
      "w": "sea",
      "zh": "大海",
      "e": "🌊"
     },
     {
      "w": "panda",
      "zh": "熊猫",
      "e": "🐼"
     },
     {
      "w": "tiger",
      "zh": "老虎",
      "e": "🐯"
     },
     {
      "w": "lion",
      "zh": "狮子",
      "e": "🦁"
     },
     {
      "w": "elephant",
      "zh": "大象",
      "e": "🐘"
     },
     {
      "w": "bird",
      "zh": "小鸟",
      "e": "🐦"
     },
     {
      "w": "fish",
      "zh": "鱼",
      "e": "🐟"
     }
    ],
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
    ]
   },
   {
    "id": "pu4-u3",
    "mod": 3,
    "title": "Let's celebrate!",
    "zh": "一起庆祝吧",
    "page": 30,
    "vocab": "比赛 · 音乐与节日",
    "grammar": "现在完成时表经历（Have you ever won a competition?）；现在完成时 + just/already/yet（I have already taken more than 100 photos. / I have not seen the pyramids yet.）",
    "spell": "b 和 v 的辨音",
    "cc": "Making music history 乐器的历史 · Brazilian carnival music",
    "lit": "The local football hero（真实故事）",
    "sel": "创意思维",
    "m1": "",
    "m2": "Have a quiz party",
    "exam": "A2 Listening",
    "words": [
     {
      "w": "race",
      "zh": "比赛",
      "e": "🏁"
     },
     {
      "w": "winner",
      "zh": "获胜者",
      "e": "🏅"
     },
     {
      "w": "music",
      "zh": "音乐",
      "e": "🎵"
     },
     {
      "w": "song",
      "zh": "歌曲",
      "e": "🎶"
     },
     {
      "w": "dance",
      "zh": "跳舞",
      "e": "💃"
     },
     {
      "w": "sing",
      "zh": "唱歌",
      "e": "🎤"
     },
     {
      "w": "game",
      "zh": "游戏",
      "e": "🎮"
     },
     {
      "w": "win",
      "zh": "赢",
      "e": "🏆"
     },
     {
      "w": "party",
      "zh": "聚会",
      "e": "🥳"
     },
     {
      "w": "play",
      "zh": "玩",
      "e": "🎾"
     },
     {
      "w": "photo",
      "zh": "照片",
      "e": "📷"
     },
     {
      "w": "year",
      "zh": "年",
      "e": ""
     }
    ],
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
    ]
   },
   {
    "id": "pu4-r1",
    "mod": 0,
    "title": "Review 1-3",
    "zh": "复习 1-3 单元",
    "page": 0,
    "vocab": "",
    "grammar": "复习：might/may、不定代词、ago、too/enough、现在完成时",
    "spell": "",
    "cc": "",
    "lit": "",
    "sel": "",
    "m1": "",
    "m2": "",
    "exam": "",
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
    "title": "Time of our lives",
    "zh": "我们的时光",
    "page": 44,
    "vocab": "提供/承诺/请求的动词 · 报时",
    "grammar": "过去进行时（We were waiting at the bus stop when it started to rain. / While we were getting on the bus, I was looking for my ticket.）；现在完成时 + since/for（I have worked in restaurants since I was a teenager.）",
    "spell": "ee 的多种拼法",
    "cc": "Time zones 时区 · New Year celebrations around the world",
    "lit": "The legend of Mother Mountain（传说）",
    "sel": "数字素养 · 欣赏相互依存",
    "m1": "",
    "m2": "Write a chain story",
    "exam": "A2 Listening",
    "words": [
     {
      "w": "o'clock",
      "zh": "点钟",
      "e": "🕐"
     },
     {
      "w": "hour",
      "zh": "小时",
      "e": "⏰"
     },
     {
      "w": "minute",
      "zh": "分钟",
      "e": "⏲️"
     },
     {
      "w": "today",
      "zh": "今天",
      "e": ""
     },
     {
      "w": "tonight",
      "zh": "今晚",
      "e": ""
     },
     {
      "w": "tomorrow",
      "zh": "明天",
      "e": ""
     },
     {
      "w": "yesterday",
      "zh": "昨天",
      "e": ""
     },
     {
      "w": "now",
      "zh": "现在",
      "e": ""
     },
     {
      "w": "early",
      "zh": "早",
      "e": "🌄"
     },
     {
      "w": "late",
      "zh": "晚",
      "e": "🌜"
     },
     {
      "w": "day",
      "zh": "天",
      "e": "📅"
     },
     {
      "w": "week",
      "zh": "星期",
      "e": "🗓️"
     },
     {
      "w": "wait",
      "zh": "等待",
      "e": "⏳"
     },
     {
      "w": "look",
      "zh": "看",
      "e": "👀"
     }
    ],
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
    ]
   },
   {
    "id": "pu4-u5",
    "mod": 5,
    "title": "Let it snow!",
    "zh": "让雪下吧",
    "page": 56,
    "vocab": "季节与天气 · 冬季",
    "grammar": "will/won't（We will not go outside today. / You will stay at home.）；连词 so 和 because（We did not go skiing because it was foggy. / We could not see very well, so it was not safe to ski.）",
    "spell": "-er / -ar / -or 结尾复习",
    "cc": "Spring, summer, autumn, winter 四季成因 · Climate in Argentina",
    "lit": "Tomás and the snowman（真实故事）",
    "sel": "创意思维",
    "m1": "",
    "m2": "Prepare a TV weather report",
    "exam": "A2 Speaking",
    "words": [
     {
      "w": "weather",
      "zh": "天气",
      "e": "🌤️"
     },
     {
      "w": "snow",
      "zh": "雪",
      "e": "❄️"
     },
     {
      "w": "rain",
      "zh": "雨",
      "e": "🌧️"
     },
     {
      "w": "wind",
      "zh": "风",
      "e": "🌬️"
     },
     {
      "w": "cloud",
      "zh": "云",
      "e": "☁️"
     },
     {
      "w": "hot",
      "zh": "热",
      "e": "🥵"
     },
     {
      "w": "cold",
      "zh": "冷",
      "e": "🥶"
     },
     {
      "w": "warm",
      "zh": "温暖",
      "e": ""
     },
     {
      "w": "cool",
      "zh": "凉爽",
      "e": ""
     },
     {
      "w": "sunny",
      "zh": "晴朗的",
      "e": "🔆"
     },
     {
      "w": "rainy",
      "zh": "下雨的",
      "e": ""
     },
     {
      "w": "windy",
      "zh": "刮风的",
      "e": "💨"
     },
     {
      "w": "snowy",
      "zh": "下雪的",
      "e": "🌨️"
     },
     {
      "w": "cloudy",
      "zh": "多云的",
      "e": "⛅"
     },
     {
      "w": "raincoat",
      "zh": "雨衣",
      "e": ""
     },
     {
      "w": "umbrella",
      "zh": "雨伞",
      "e": "☂️"
     }
    ],
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
    ]
   },
   {
    "id": "pu4-u6",
    "mod": 6,
    "title": "Working together",
    "zh": "一起工作",
    "page": 68,
    "vocab": "职业 · 职场",
    "grammar": "反义疑问句（You are a mechanic, are not you? / You cannot fix robots, can you?）；短问句（I have got a problem. — Have you? / I cannot find my mobile phone. — Can not you?）",
    "spell": "复合名词的重音",
    "cc": "Inventions and robotics 发明与机器人 · South Korean inventions",
    "lit": "Buddie has fun（科幻故事）",
    "sel": "情感发展 · 数字素养",
    "m1": "",
    "m2": "Prepare for a job interview",
    "exam": "A2 Reading and Writing",
    "words": [
     {
      "w": "job",
      "zh": "工作",
      "e": ""
     },
     {
      "w": "work",
      "zh": "工作",
      "e": ""
     },
     {
      "w": "doctor",
      "zh": "医生",
      "e": "👨‍⚕️"
     },
     {
      "w": "nurse",
      "zh": "护士",
      "e": "👩‍⚕️"
     },
     {
      "w": "teacher",
      "zh": "老师",
      "e": "👩‍🏫"
     },
     {
      "w": "driver",
      "zh": "司机",
      "e": ""
     },
     {
      "w": "farmer",
      "zh": "农民",
      "e": "👨‍🌾"
     },
     {
      "w": "worker",
      "zh": "工人",
      "e": "👷"
     },
     {
      "w": "cook",
      "zh": "厨师",
      "e": "👩‍🍳"
     },
     {
      "w": "pilot",
      "zh": "飞行员",
      "e": "👨‍✈️"
     },
     {
      "w": "scientist",
      "zh": "科学家",
      "e": "🔬"
     },
     {
      "w": "police",
      "zh": "警察",
      "e": "🚓"
     },
     {
      "w": "robot",
      "zh": "机器人",
      "e": "🤖"
     },
     {
      "w": "computer",
      "zh": "电脑",
      "e": "💻"
     }
    ],
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
    ]
   },
   {
    "id": "pu4-r2",
    "mod": 0,
    "title": "Review 4-6",
    "zh": "复习 4-6 单元",
    "page": 0,
    "vocab": "",
    "grammar": "复习：过去进行时、since/for、will/won't、so/because、反义疑问句",
    "spell": "",
    "cc": "",
    "lit": "",
    "sel": "",
    "m1": "",
    "m2": "",
    "exam": "",
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
    "title": "Then and now",
    "zh": "过去与现在",
    "page": 82,
    "vocab": "家中物品 · 描写物品的形容词",
    "grammar": "过去分词 seen/found/driven/ridden/taken/broken/gone/left/tried/forgotten/put/stood/fallen/cut；be used for/to（They were used to bury the Egyptian kings. / They are used for teaching people about the Ancient Egyptians.）",
    "spell": "j 的拼法",
    "cc": "Time machines 物品的演化 · The pyramids of Ancient Egypt",
    "lit": "The boy king（历史小说）",
    "sel": "社会责任",
    "m1": "",
    "m2": "Make a poster about a household object",
    "exam": "A2 Reading and Writing",
    "words": [
     {
      "w": "home",
      "zh": "家",
      "e": "🏠"
     },
     {
      "w": "house",
      "zh": "房子",
      "e": "🏡"
     },
     {
      "w": "door",
      "zh": "门",
      "e": "🚪"
     },
     {
      "w": "window",
      "zh": "窗户",
      "e": "🪟"
     },
     {
      "w": "table",
      "zh": "桌子",
      "e": ""
     },
     {
      "w": "sofa",
      "zh": "沙发",
      "e": "🛋️"
     },
     {
      "w": "lamp",
      "zh": "台灯",
      "e": "💡"
     },
     {
      "w": "kitchen",
      "zh": "厨房",
      "e": "🍳"
     },
     {
      "w": "bedroom",
      "zh": "卧室",
      "e": "🛌"
     },
     {
      "w": "chair",
      "zh": "椅子",
      "e": "💺"
     },
     {
      "w": "bed",
      "zh": "床",
      "e": "🛏️"
     },
     {
      "w": "big",
      "zh": "大的",
      "e": ""
     },
     {
      "w": "small",
      "zh": "小的",
      "e": ""
     },
     {
      "w": "new",
      "zh": "新的",
      "e": "🆕"
     },
     {
      "w": "round",
      "zh": "圆的",
      "e": ""
     },
     {
      "w": "black",
      "zh": "黑色",
      "e": ""
     }
    ],
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
    ]
   },
   {
    "id": "pu4-u8",
    "mod": 8,
    "title": "Space travel",
    "zh": "太空旅行",
    "page": 94,
    "vocab": "太空 · 冒险词汇",
    "grammar": "will 和 going to（We are going to have a special visitor. / Some people think we will live on Mars.）；过去时态总复习",
    "spell": "s + 辅音连缀",
    "cc": "Preparing for Mars 火星探索 · The International Space Station",
    "lit": "My space blog（博客）",
    "sel": "想象替代未来",
    "m1": "",
    "m2": "Write a space mission report",
    "exam": "A2 Reading and Writing",
    "words": [
     {
      "w": "star",
      "zh": "星星",
      "e": "⭐"
     },
     {
      "w": "moon",
      "zh": "月亮",
      "e": "🌙"
     },
     {
      "w": "sky",
      "zh": "天空",
      "e": ""
     },
     {
      "w": "earth",
      "zh": "地球",
      "e": "🌍"
     },
     {
      "w": "sun",
      "zh": "太阳",
      "e": "☀️"
     },
     {
      "w": "plane",
      "zh": "飞机",
      "e": "✈️"
     },
     {
      "w": "ship",
      "zh": "轮船",
      "e": "🚢"
     },
     {
      "w": "boat",
      "zh": "小船",
      "e": "⛵"
     },
     {
      "w": "light",
      "zh": "轻的",
      "e": "🪶"
     },
     {
      "w": "high",
      "zh": "高的",
      "e": "🏔️"
     },
     {
      "w": "far",
      "zh": "远的",
      "e": ""
     },
     {
      "w": "first",
      "zh": "首先",
      "e": ""
     },
     {
      "w": "photo",
      "zh": "照片",
      "e": "📷"
     },
     {
      "w": "game",
      "zh": "游戏",
      "e": "🎮"
     }
    ],
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
    ]
   },
   {
    "id": "pu4-u9",
    "mod": 9,
    "title": "Great bakers",
    "zh": "烘焙大师",
    "page": 106,
    "vocab": "三餐与零食 · 烹饪",
    "grammar": "It smells/tastes/looks/feels/sounds like …（It felt like dry grass. / It smelt like carrot cake.）；make somebody + adjective（The smell is making me hungry.）",
    "spell": "sh 的拼法",
    "cc": "How chocolate is made 巧克力生产 · Traditional food in the UK",
    "lit": "The gingerbread girl's adventure（童话改编）",
    "sel": "情感发展 · 欣赏文化多样性",
    "m1": "",
    "m2": "Invent a new recipe",
    "exam": "A2 Reading and Writing",
    "words": [
     {
      "w": "breakfast",
      "zh": "早餐",
      "e": ""
     },
     {
      "w": "lunch",
      "zh": "午餐",
      "e": ""
     },
     {
      "w": "dinner",
      "zh": "晚餐",
      "e": ""
     },
     {
      "w": "rice",
      "zh": "米饭",
      "e": "🍚"
     },
     {
      "w": "bread",
      "zh": "面包",
      "e": "🍞"
     },
     {
      "w": "egg",
      "zh": "鸡蛋",
      "e": "🥚"
     },
     {
      "w": "milk",
      "zh": "牛奶",
      "e": "🥛"
     },
     {
      "w": "cake",
      "zh": "蛋糕",
      "e": "🍰"
     },
     {
      "w": "sweet",
      "zh": "甜的",
      "e": "🍯"
     },
     {
      "w": "chocolate",
      "zh": "巧克力",
      "e": "🍫"
     },
     {
      "w": "biscuit",
      "zh": "饼干",
      "e": "🍪"
     },
     {
      "w": "cook",
      "zh": "厨师",
      "e": "👩‍🍳"
     },
     {
      "w": "eat",
      "zh": "吃",
      "e": "🍽️"
     },
     {
      "w": "drink",
      "zh": "喝",
      "e": "🥤"
     }
    ],
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
    ]
   },
   {
    "id": "pu4-r3",
    "mod": 0,
    "title": "Review 7-9",
    "zh": "复习 7-9 单元",
    "page": 0,
    "vocab": "",
    "grammar": "复习：过去分词、be used for/to、will 和 going to、感官动词 like",
    "spell": "",
    "cc": "",
    "lit": "",
    "sel": "",
    "m1": "",
    "m2": "",
    "exam": "",
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
    "title": "In style",
    "zh": "时尚风格",
    "page": 4,
    "vocab": "衣服 · 衣服部件",
    "grammar": "比较级形容词、副词与 as … as（The blue jacket is more expensive than the grey jacket, but it fits better. / It is not as heavy as the grey jacket.）；一般现在时表将来（What time does the fashion show start tomorrow?）",
    "spell": "复数 s 的发音",
    "cc": "Clothes throughout history 服饰的过去、现在与未来",
    "lit": "King Canute's day on the beach（面对挫折的故事）",
    "sel": "情感发展 · 探索解决方案",
    "m1": "",
    "m2": "Plan a fashion show",
    "exam": "A2 Key for Schools: Reading and Writing Part 1 / Listening Part 1",
    "words": [
     {
      "w": "shirt",
      "zh": "衬衫",
      "e": "👔"
     },
     {
      "w": "T-shirt",
      "zh": "T恤",
      "e": "👕"
     },
     {
      "w": "dress",
      "zh": "连衣裙",
      "e": "👗"
     },
     {
      "w": "skirt",
      "zh": "短裙",
      "e": "👚"
     },
     {
      "w": "pants",
      "zh": "裤子",
      "e": "👖"
     },
     {
      "w": "shorts",
      "zh": "短裤",
      "e": "🩳"
     },
     {
      "w": "coat",
      "zh": "大衣",
      "e": "🧥"
     },
     {
      "w": "sweater",
      "zh": "毛衣",
      "e": "🧶"
     },
     {
      "w": "jacket",
      "zh": "夹克",
      "e": "🥼"
     },
     {
      "w": "hat",
      "zh": "帽子",
      "e": "🎩"
     },
     {
      "w": "cap",
      "zh": "鸭舌帽",
      "e": "🧢"
     },
     {
      "w": "shoe",
      "zh": "鞋",
      "e": "👟"
     },
     {
      "w": "sock",
      "zh": "袜子",
      "e": "🧦"
     },
     {
      "w": "clothes",
      "zh": "衣服",
      "e": "🧺"
     },
     {
      "w": "scarf",
      "zh": "围巾",
      "e": "🧣"
     },
     {
      "w": "glove",
      "zh": "手套",
      "e": "🧤"
     }
    ],
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
    ]
   },
   {
    "id": "pu5-u2",
    "mod": 2,
    "title": "Future technology",
    "zh": "未来科技",
    "page": 16,
    "vocab": "科技 · 使用电脑的动词",
    "grammar": "第一条件句（If something breaks, a robot will fix it.）；零条件句（If you press this button, it turns on.）",
    "spell": "双音节词的音节重音",
    "cc": "How to make an app 什么是应用、怎么做一个",
    "lit": "The Tech Times（关于嫉妒的报纸文章）",
    "sel": "创意思维 · 沟通",
    "m1": "",
    "m2": "Invent a piece of technology for a home of the future",
    "exam": "A2 Key for Schools: Speaking Part 1 / Reading and Writing Part 2",
    "words": [
     {
      "w": "computer",
      "zh": "电脑",
      "e": "💻"
     },
     {
      "w": "robot",
      "zh": "机器人",
      "e": "🤖"
     },
     {
      "w": "phone",
      "zh": "电话",
      "e": "📱"
     },
     {
      "w": "screen",
      "zh": "屏幕",
      "e": "🖥️"
     },
     {
      "w": "email",
      "zh": "电子邮件",
      "e": "📧"
     },
     {
      "w": "game",
      "zh": "游戏",
      "e": "🎮"
     },
     {
      "w": "TV",
      "zh": "电视",
      "e": "📺"
     },
     {
      "w": "photo",
      "zh": "照片",
      "e": "📷"
     },
     {
      "w": "write",
      "zh": "写",
      "e": "✍️"
     },
     {
      "w": "draw",
      "zh": "画画",
      "e": "🎨"
     },
     {
      "w": "read",
      "zh": "读书",
      "e": "📚"
     },
     {
      "w": "play",
      "zh": "玩",
      "e": "🎾"
     }
    ],
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
    ]
   },
   {
    "id": "pu5-u3",
    "mod": 3,
    "title": "Jim-nastics",
    "zh": "吉姆体操",
    "page": 28,
    "vocab": "运动 · 运动动作、人物与装备",
    "grammar": "一般现在时被动语态（The hosts are decided by the World Rugby Council.）；shall/could/should 提议（Shall we watch the wheelchair rugby? / I think we should ask Mum and Dad.）",
    "spell": "元音发音",
    "cc": "Practice makes perfect 运动员赛前怎么训练吃睡",
    "lit": "The Spartan Princess（关于坚持的漫画）",
    "sel": "创意思维",
    "m1": "",
    "m2": "Create a news report about a sporting event",
    "exam": "A2 Key for Schools: Listening Part 2 / Reading and Writing Part 5",
    "words": [
     {
      "w": "football",
      "zh": "足球",
      "e": "⚽"
     },
     {
      "w": "basketball",
      "zh": "篮球",
      "e": "🏀"
     },
     {
      "w": "ping-pong",
      "zh": "乒乓球",
      "e": "🏓"
     },
     {
      "w": "baseball",
      "zh": "棒球",
      "e": "⚾"
     },
     {
      "w": "swim",
      "zh": "游泳",
      "e": "🏊"
     },
     {
      "w": "run",
      "zh": "跑",
      "e": "🏃"
     },
     {
      "w": "jump",
      "zh": "跳",
      "e": "🤸"
     },
     {
      "w": "skate",
      "zh": "滑冰",
      "e": "⛸️"
     },
     {
      "w": "ski",
      "zh": "滑雪",
      "e": "🎿"
     },
     {
      "w": "ride",
      "zh": "骑",
      "e": "🚴"
     },
     {
      "w": "race",
      "zh": "比赛",
      "e": "🏁"
     },
     {
      "w": "win",
      "zh": "赢",
      "e": "🏆"
     },
     {
      "w": "winner",
      "zh": "获胜者",
      "e": "🏅"
     },
     {
      "w": "exercise",
      "zh": "锻炼",
      "e": ""
     },
     {
      "w": "climb",
      "zh": "爬",
      "e": "🧗"
     },
     {
      "w": "throw",
      "zh": "扔",
      "e": "🤾"
     }
    ],
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
    ]
   },
   {
    "id": "pu5-r1",
    "mod": 0,
    "title": "Review 1-3",
    "zh": "复习 1-3 单元",
    "page": 0,
    "vocab": "",
    "grammar": "复习：as…as、一般现在时表将来、第一/零条件句、被动语态",
    "spell": "",
    "cc": "",
    "lit": "",
    "sel": "",
    "m1": "",
    "m2": "",
    "exam": "",
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
    "title": "Stay well!",
    "zh": "保持健康",
    "page": 42,
    "vocab": "事故与疾病 · 健康与医药",
    "grammar": "现在完成时 + how long/for/since（How long has your arm been sore? / I have felt worried about it since yesterday.）；现在进行时表将来（I am seeing the doctor again.）",
    "spell": "句子重音",
    "cc": "Making lives better 科学如何改善生活",
    "lit": "The £20,000 adventure（关于情绪的故事）",
    "sel": "情感发展 · 学会学习",
    "m1": "",
    "m2": "Make a wellness diary",
    "exam": "A2 Key for Schools: Reading and Writing Part 4 / Listening Part 4",
    "words": [
     {
      "w": "doctor",
      "zh": "医生",
      "e": "👨‍⚕️"
     },
     {
      "w": "nurse",
      "zh": "护士",
      "e": "👩‍⚕️"
     },
     {
      "w": "hospital",
      "zh": "医院",
      "e": "🏥"
     },
     {
      "w": "medicine",
      "zh": "药",
      "e": "💊"
     },
     {
      "w": "hurt",
      "zh": "受伤",
      "e": "🩹"
     },
     {
      "w": "head",
      "zh": "头",
      "e": ""
     },
     {
      "w": "tooth",
      "zh": "牙齿",
      "e": "🦷"
     },
     {
      "w": "ear",
      "zh": "耳朵",
      "e": "👂"
     },
     {
      "w": "eye",
      "zh": "眼睛",
      "e": "👁️"
     },
     {
      "w": "sick",
      "zh": "生病的",
      "e": "🤒"
     },
     {
      "w": "rest",
      "zh": "休息",
      "e": ""
     },
     {
      "w": "safe",
      "zh": "安全的",
      "e": "🦺"
     },
     {
      "w": "danger",
      "zh": "危险",
      "e": ""
     },
     {
      "w": "help",
      "zh": "帮助",
      "e": "🆘"
     },
     {
      "w": "arm",
      "zh": "手臂",
      "e": ""
     },
     {
      "w": "well",
      "zh": "好/井",
      "e": ""
     }
    ],
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
    ]
   },
   {
    "id": "pu5-u5",
    "mod": 5,
    "title": "Fun foods",
    "zh": "趣味食物",
    "page": 54,
    "vocab": "烹饪食材 · 烹饪动作与装备",
    "grammar": "prefer、would prefer 和 would rather（I prefer eating salad to potatoes! / I would rather have steak.）；一般过去时被动语态（Pizza was first made in southern Italy! / Chocolate-chip cookies were invented by Ruth Wakefield!）",
    "spell": "动词过去式结尾的发音",
    "cc": "Healthy eating 为什么有些食物对健康有益",
    "lit": "A very interesting week in the life of Juana Sánchez（关于情绪管理的日记）",
    "sel": "情感发展 · 系统思维",
    "m1": "",
    "m2": "Present a traditional food or dish",
    "exam": "A2 Key for Schools: Listening Part 5 / Reading and Writing Part 7",
    "words": [
     {
      "w": "rice",
      "zh": "米饭",
      "e": "🍚"
     },
     {
      "w": "noodle",
      "zh": "面条",
      "e": "🍜"
     },
     {
      "w": "egg",
      "zh": "鸡蛋",
      "e": "🥚"
     },
     {
      "w": "bread",
      "zh": "面包",
      "e": "🍞"
     },
     {
      "w": "cake",
      "zh": "蛋糕",
      "e": "🍰"
     },
     {
      "w": "milk",
      "zh": "牛奶",
      "e": "🥛"
     },
     {
      "w": "cook",
      "zh": "厨师",
      "e": "👩‍🍳"
     },
     {
      "w": "make",
      "zh": "制作",
      "e": "🔨"
     },
     {
      "w": "eat",
      "zh": "吃",
      "e": "🍽️"
     },
     {
      "w": "drink",
      "zh": "喝",
      "e": "🥤"
     },
     {
      "w": "delicious",
      "zh": "美味的",
      "e": "😋"
     },
     {
      "w": "fruit",
      "zh": "水果",
      "e": "🍏"
     },
     {
      "w": "vegetable",
      "zh": "蔬菜",
      "e": "🥦"
     },
     {
      "w": "sweet",
      "zh": "甜的",
      "e": "🍯"
     },
     {
      "w": "chicken",
      "zh": "鸡肉",
      "e": "🍗"
     },
     {
      "w": "beef",
      "zh": "牛肉",
      "e": "🥩"
     }
    ],
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
    ]
   },
   {
    "id": "pu5-u6",
    "mod": 6,
    "title": "Environmentally friendly",
    "zh": "环保生活",
    "page": 66,
    "vocab": "家 · 环境",
    "grammar": "a few/a little/a lot of/lots of（There are a lot of old clothes in this box.）；反义疑问句（We could be more environmentally friendly, could we not? / We should not throw plastic into the wrong bin, should we?）",
    "spell": "schwa 弱央元音",
    "cc": "Ecosystems 城市里的动物家园",
    "lit": "The fall of a Mayan city（保护环境的故事）",
    "sel": "推动积极改变 · 系统思维",
    "m1": "",
    "m2": "Discover how schools could be more environmentally friendly",
    "exam": "A2 Key for Schools: Speaking Part 2 / Reading and Writing Part 6",
    "words": [
     {
      "w": "tree",
      "zh": "树",
      "e": "🌳"
     },
     {
      "w": "flower",
      "zh": "花",
      "e": "🌸"
     },
     {
      "w": "water",
      "zh": "水",
      "e": "💧"
     },
     {
      "w": "air",
      "zh": "空气",
      "e": ""
     },
     {
      "w": "rubbish",
      "zh": "垃圾",
      "e": "🗑️"
     },
     {
      "w": "earth",
      "zh": "地球",
      "e": "🌍"
     },
     {
      "w": "home",
      "zh": "家",
      "e": "🏠"
     },
     {
      "w": "house",
      "zh": "房子",
      "e": "🏡"
     },
     {
      "w": "garden",
      "zh": "花园",
      "e": "🌷"
     },
     {
      "w": "plant",
      "zh": "植物",
      "e": "🪴"
     },
     {
      "w": "save",
      "zh": "拯救",
      "e": "🦸"
     },
     {
      "w": "green",
      "zh": "绿色",
      "e": ""
     },
     {
      "w": "bird",
      "zh": "小鸟",
      "e": "🐦"
     },
     {
      "w": "fish",
      "zh": "鱼",
      "e": "🐟"
     },
     {
      "w": "duck",
      "zh": "鸭子",
      "e": "🦆"
     },
     {
      "w": "grass",
      "zh": "草",
      "e": "🌱"
     }
    ],
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
    ]
   },
   {
    "id": "pu5-r2",
    "mod": 0,
    "title": "Review 4-6",
    "zh": "复习 4-6 单元",
    "page": 0,
    "vocab": "",
    "grammar": "复习：现在完成时 how long/for/since、prefer/would rather、a few/a little、反义疑问句",
    "spell": "",
    "cc": "",
    "lit": "",
    "sel": "",
    "m1": "",
    "m2": "",
    "exam": "",
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
    "title": "Feeling it",
    "zh": "感受情绪",
    "page": 80,
    "vocab": "感受与情绪 · 身心健康",
    "grammar": "have to/don't have to/needn't/must/mustn't（I really must study for the history test tomorrow. / You need not worry — you have studied a lot.）；so … that / such … that（I felt so scared that I wanted to go home!）",
    "spell": "/b/ /v/ /w/ 辨音",
    "cc": "Emotional awareness 同理心与情绪表达",
    "lit": "The cowboy who cried wolf（诚实的故事）",
    "sel": "情感发展",
    "m1": "",
    "m2": "Make a feelings chart",
    "exam": "A2 Key for Schools: Reading and Writing Part 3 / Listening Part 3",
    "words": [
     {
      "w": "happy",
      "zh": "开心的",
      "e": "😄"
     },
     {
      "w": "sad",
      "zh": "难过的",
      "e": "😔"
     },
     {
      "w": "angry",
      "zh": "生气的",
      "e": "😠"
     },
     {
      "w": "tired",
      "zh": "累的",
      "e": "😪"
     },
     {
      "w": "excited",
      "zh": "兴奋的",
      "e": "🤩"
     },
     {
      "w": "afraid",
      "zh": "害怕的",
      "e": "😨"
     },
     {
      "w": "smile",
      "zh": "微笑",
      "e": ""
     },
     {
      "w": "cry",
      "zh": "哭",
      "e": "😢"
     },
     {
      "w": "laugh",
      "zh": "笑",
      "e": "😂"
     },
     {
      "w": "feel",
      "zh": "感觉",
      "e": "🫶"
     },
     {
      "w": "brave",
      "zh": "勇敢的",
      "e": ""
     },
     {
      "w": "kind",
      "zh": "善良的",
      "e": "💞"
     },
     {
      "w": "friend",
      "zh": "朋友",
      "e": "🤝"
     },
     {
      "w": "family",
      "zh": "家",
      "e": "👨‍👩‍👧‍👦"
     }
    ],
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
    ]
   },
   {
    "id": "pu5-u8",
    "mod": 8,
    "title": "Pretty cities",
    "zh": "美丽城市",
    "page": 92,
    "vocab": "城市游览 · 拜访新地方",
    "grammar": "间接疑问句（Could you tell us what that big building is, please?）；used to / didn't use to（People didn't use to have running water in their kitchens.）",
    "spell": "疑问句的语调",
    "cc": "Responsible tourism 假期如何爱护景点",
    "lit": "The case of the Butterfly Diamond（管理压力的故事）",
    "sel": "创意思维 · 社会责任",
    "m1": "",
    "m2": "Plan a city visit",
    "exam": "A2 Key for Schools: Reading and Writing Part 4 / B1 Preliminary for Schools: Reading Part 6",
    "words": [
     {
      "w": "city",
      "zh": "城市",
      "e": "🏙️"
     },
     {
      "w": "park",
      "zh": "公园",
      "e": ""
     },
     {
      "w": "zoo",
      "zh": "动物园",
      "e": ""
     },
     {
      "w": "shop",
      "zh": "商店",
      "e": "🏪"
     },
     {
      "w": "supermarket",
      "zh": "超市",
      "e": "🛒"
     },
     {
      "w": "hospital",
      "zh": "医院",
      "e": "🏥"
     },
     {
      "w": "library",
      "zh": "图书馆",
      "e": ""
     },
     {
      "w": "cinema",
      "zh": "电影院",
      "e": "🎦"
     },
     {
      "w": "museum",
      "zh": "博物馆",
      "e": "🏛️"
     },
     {
      "w": "hotel",
      "zh": "旅馆",
      "e": "🏨"
     },
     {
      "w": "restaurant",
      "zh": "餐馆",
      "e": ""
     },
     {
      "w": "street",
      "zh": "街道",
      "e": ""
     },
     {
      "w": "road",
      "zh": "马路",
      "e": "🛣️"
     },
     {
      "w": "bridge",
      "zh": "桥",
      "e": "🌉"
     },
     {
      "w": "building",
      "zh": "大楼",
      "e": "🏢"
     },
     {
      "w": "station",
      "zh": "车站",
      "e": "🚉"
     }
    ],
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
    ]
   },
   {
    "id": "pu5-u9",
    "mod": 9,
    "title": "Lights, camera, action!",
    "zh": "灯光、摄影、开拍！",
    "page": 104,
    "vocab": "影视类型 · 电视",
    "grammar": "have / get something done（We are having the costumes made.）；第二条件句（If I had €250 million, I would give lots of it to charity.）",
    "spell": "单词重音",
    "cc": "Special effects 电影特效怎么做",
    "lit": "Lost in the Rainforest（环保电影脚本）",
    "sel": "创意思维",
    "m1": "",
    "m2": "Plan and record an interview with a celebrity",
    "exam": "A2 Key for Schools: Reading and Writing Part 7 / B1 Preliminary for Schools: Writing Part 1",
    "words": [
     {
      "w": "TV",
      "zh": "电视",
      "e": "📺"
     },
     {
      "w": "film",
      "zh": "电影",
      "e": "🎬"
     },
     {
      "w": "cartoon",
      "zh": "动画片",
      "e": ""
     },
     {
      "w": "story",
      "zh": "故事",
      "e": ""
     },
     {
      "w": "music",
      "zh": "音乐",
      "e": "🎵"
     },
     {
      "w": "song",
      "zh": "歌曲",
      "e": "🎶"
     },
     {
      "w": "star",
      "zh": "星星",
      "e": "⭐"
     },
     {
      "w": "photo",
      "zh": "照片",
      "e": "📷"
     },
     {
      "w": "dance",
      "zh": "跳舞",
      "e": "💃"
     },
     {
      "w": "sing",
      "zh": "唱歌",
      "e": "🎤"
     },
     {
      "w": "game",
      "zh": "游戏",
      "e": "🎮"
     },
     {
      "w": "book",
      "zh": "书",
      "e": "📖"
     }
    ],
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
    ]
   },
   {
    "id": "pu5-r3",
    "mod": 0,
    "title": "Review 7-9",
    "zh": "复习 7-9 单元",
    "page": 0,
    "vocab": "",
    "grammar": "复习：have to/mustn't、so/such…that、间接疑问句、used to、第二条件句",
    "spell": "",
    "cc": "",
    "lit": "",
    "sel": "",
    "m1": "",
    "m2": "",
    "exam": "",
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
    "title": "A song and a dance",
    "zh": "歌与舞",
    "page": 4,
    "vocab": "音乐 · 描写性格的形容词",
    "grammar": "形容词 + 介词（I am interested in all kinds of music. / It is perfect for people who are keen on music.）；so 和 nor 的短答（I had lots of fun! So have we! / I don't know. Nor do I.）",
    "spell": "辅音连缀的连读",
    "cc": "Eighteenth-century music 贝多芬与莫扎特",
    "lit": "The Concert（日记）",
    "sel": "社交情感技能：自信",
    "m1": "Write a concert review",
    "m2": "Write a concert review",
    "exam": "Preliminary for Schools: Reading Part 1 / Listening Part 1",
    "words": [
     {
      "w": "music",
      "zh": "音乐",
      "e": "🎵"
     },
     {
      "w": "sing",
      "zh": "唱歌",
      "e": "🎤"
     },
     {
      "w": "song",
      "zh": "歌曲",
      "e": "🎶"
     },
     {
      "w": "dance",
      "zh": "跳舞",
      "e": "💃"
     },
     {
      "w": "piano",
      "zh": "钢琴",
      "e": "🎹"
     },
     {
      "w": "guitar",
      "zh": "吉他",
      "e": "🎸"
     },
     {
      "w": "drum",
      "zh": "鼓",
      "e": "🥁"
     },
     {
      "w": "concert",
      "zh": "音乐会",
      "e": ""
     },
     {
      "w": "band",
      "zh": "乐队",
      "e": "🎺"
     },
     {
      "w": "violin",
      "zh": "小提琴",
      "e": "🎻"
     },
     {
      "w": "brave",
      "zh": "勇敢的",
      "e": ""
     },
     {
      "w": "friend",
      "zh": "朋友",
      "e": "🤝"
     },
     {
      "w": "happy",
      "zh": "开心的",
      "e": "😄"
     },
     {
      "w": "play",
      "zh": "玩",
      "e": "🎾"
     }
    ],
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
    ]
   },
   {
    "id": "pu6-u2",
    "mod": 2,
    "title": "Big wide world",
    "zh": "广阔世界",
    "page": 16,
    "vocab": "大洲、语言与文化 · 我们周围的地方",
    "grammar": "关系从句（My cousins who live in Portugal speak Portuguese.）；more … than, fewer … than, less … than, the most, the fewest, the best, the worst（People can drink less water than camels.）",
    "spell": "比较结构的重音",
    "cc": "Coral reefs 珊瑚礁",
    "lit": "Festivals round the world（杂志文章）",
    "sel": "社交情感技能：拥抱其他文化",
    "m1": "Create a class encyclopaedia",
    "m2": "Create a class encyclopaedia",
    "exam": "Preliminary for Schools: Speaking Part 1 / Reading Part 4",
    "words": [
     {
      "w": "world",
      "zh": "世界",
      "e": "🌍"
     },
     {
      "w": "country",
      "zh": "国家",
      "e": ""
     },
     {
      "w": "China",
      "zh": "中国",
      "e": "🇨🇳"
     },
     {
      "w": "ocean",
      "zh": "海洋",
      "e": "🌊"
     },
     {
      "w": "sea",
      "zh": "大海",
      "e": "🌊"
     },
     {
      "w": "mountain",
      "zh": "大山",
      "e": "⛰️"
     },
     {
      "w": "river",
      "zh": "河",
      "e": "🏞️"
     },
     {
      "w": "city",
      "zh": "城市",
      "e": "🏙️"
     },
     {
      "w": "map",
      "zh": "地图",
      "e": "🗺️"
     },
     {
      "w": "language",
      "zh": "语言",
      "e": ""
     },
     {
      "w": "flag",
      "zh": "旗帜",
      "e": "🚩"
     },
     {
      "w": "earth",
      "zh": "地球",
      "e": "🌍"
     },
     {
      "w": "fish",
      "zh": "鱼",
      "e": "🐟"
     },
     {
      "w": "bird",
      "zh": "小鸟",
      "e": "🐦"
     },
     {
      "w": "tree",
      "zh": "树",
      "e": "🌳"
     },
     {
      "w": "flower",
      "zh": "花",
      "e": "🌸"
     }
    ],
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
    ]
   },
   {
    "id": "pu6-u3",
    "mod": 3,
    "title": "Shopping around",
    "zh": "购物攻略",
    "page": 28,
    "vocab": "购物词 · 购物场景",
    "grammar": "动词+动名词、动词+不定式（They need to sleep and play! / Do you fancy buying one?）；动名词作主语和宾语（Shopping is great! / She's keen on learning about tea.）",
    "spell": "gerunds 发音",
    "cc": "The history of money 货币的历史",
    "lit": "Where's Wanda?（故事）",
    "sel": "社交情感技能：珍惜收到的礼物",
    "m1": "Present tips on shopping",
    "m2": "Present tips on shopping",
    "exam": "Preliminary for Schools: Speaking Part 3 / Reading Part 6",
    "words": [
     {
      "w": "money",
      "zh": "钱",
      "e": "💰"
     },
     {
      "w": "buy",
      "zh": "买",
      "e": "🛍️"
     },
     {
      "w": "sell",
      "zh": "卖",
      "e": "🏷️"
     },
     {
      "w": "shop",
      "zh": "商店",
      "e": "🏪"
     },
     {
      "w": "store",
      "zh": "店铺",
      "e": "🏬"
     },
     {
      "w": "supermarket",
      "zh": "超市",
      "e": "🛒"
     },
     {
      "w": "market",
      "zh": "市场",
      "e": ""
     },
     {
      "w": "price",
      "zh": "价格",
      "e": ""
     },
     {
      "w": "cheap",
      "zh": "便宜的",
      "e": ""
     },
     {
      "w": "expensive",
      "zh": "昂贵的",
      "e": "💎"
     },
     {
      "w": "pay",
      "zh": "付款",
      "e": "💳"
     },
     {
      "w": "gift",
      "zh": "礼物",
      "e": "🎁"
     },
     {
      "w": "clothes",
      "zh": "衣服",
      "e": "🧺"
     },
     {
      "w": "book",
      "zh": "书",
      "e": "📖"
     },
     {
      "w": "game",
      "zh": "游戏",
      "e": "🎮"
     },
     {
      "w": "sweet",
      "zh": "甜的",
      "e": "🍯"
     }
    ],
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
    ]
   },
   {
    "id": "pu6-r1",
    "mod": 0,
    "title": "Review 1-3",
    "zh": "复习 1-3 单元",
    "page": 0,
    "vocab": "",
    "grammar": "复习：形容词+介词、so/nor 短答、关系从句、比较结构、动词+动名词",
    "spell": "",
    "cc": "",
    "lit": "",
    "sel": "",
    "m1": "",
    "m2": "",
    "exam": "",
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
    "title": "Getting about",
    "zh": "出行交通",
    "page": 42,
    "vocab": "乘飞机旅行 · 周边出行",
    "grammar": "被动语态复习（Singapore Airport was built to be fun. / It has been open since 2011.）；短语动词与宾语（He put on his swimming trunks. / He put them on.）",
    "spell": "弱读形式",
    "cc": "Women aviators 女飞行员 Amy Johnson",
    "lit": "How we got back from our holiday（科幻故事）",
    "sel": "社交情感技能：保持冷静",
    "m1": "Write a travel guide",
    "m2": "Write a travel guide",
    "exam": "Preliminary for Schools: Reading Part 2 / Listening Part 2",
    "words": [
     {
      "w": "plane",
      "zh": "飞机",
      "e": "✈️"
     },
     {
      "w": "airport",
      "zh": "机场",
      "e": "🛫"
     },
     {
      "w": "station",
      "zh": "车站",
      "e": "🚉"
     },
     {
      "w": "bus",
      "zh": "公交车",
      "e": "🚌"
     },
     {
      "w": "train",
      "zh": "火车",
      "e": "🚂"
     },
     {
      "w": "taxi",
      "zh": "出租车",
      "e": "🚕"
     },
     {
      "w": "ship",
      "zh": "轮船",
      "e": "🚢"
     },
     {
      "w": "ticket",
      "zh": "票",
      "e": "🎫"
     },
     {
      "w": "passport",
      "zh": "护照",
      "e": "🛂"
     },
     {
      "w": "suitcase",
      "zh": "行李箱",
      "e": "🧳"
     },
     {
      "w": "travel",
      "zh": "旅行",
      "e": ""
     },
     {
      "w": "trip",
      "zh": "旅程",
      "e": ""
     },
     {
      "w": "journey",
      "zh": "旅途",
      "e": ""
     },
     {
      "w": "road",
      "zh": "马路",
      "e": "🛣️"
     },
     {
      "w": "map",
      "zh": "地图",
      "e": "🗺️"
     },
     {
      "w": "photo",
      "zh": "照片",
      "e": "📷"
     }
    ],
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
    ]
   },
   {
    "id": "pu6-u5",
    "mod": 5,
    "title": "Study smarter",
    "zh": "高效学习",
    "page": 54,
    "vocab": "教育 · 个人感受",
    "grammar": "一般过去时与现在完成时的时间短语（Ten days ago, I borrowed some books. / I have never felt so great!）；过去完成时（I thought that I could never get good marks. / There were two essay questions that I hadn't seen!）",
    "spell": "句子重音",
    "cc": "Education in the past 100 年前的学校",
    "lit": "My first camping trip（故事）",
    "sel": "社交情感技能：面对恐惧",
    "m1": "Do a quiz",
    "m2": "Do a quiz",
    "exam": "Preliminary for Schools: Reading Part 5 / Writing Part 2 (an article or a story)",
    "words": [
     {
      "w": "school",
      "zh": "学校",
      "e": "🏫"
     },
     {
      "w": "class",
      "zh": "班级",
      "e": ""
     },
     {
      "w": "lesson",
      "zh": "课",
      "e": ""
     },
     {
      "w": "teacher",
      "zh": "老师",
      "e": "👩‍🏫"
     },
     {
      "w": "student",
      "zh": "学生",
      "e": "🎓"
     },
     {
      "w": "learn",
      "zh": "学习",
      "e": "🧠"
     },
     {
      "w": "study",
      "zh": "学习",
      "e": ""
     },
     {
      "w": "read",
      "zh": "读书",
      "e": "📚"
     },
     {
      "w": "write",
      "zh": "写",
      "e": "✍️"
     },
     {
      "w": "question",
      "zh": "问题",
      "e": "❓"
     },
     {
      "w": "answer",
      "zh": "回答",
      "e": ""
     },
     {
      "w": "homework",
      "zh": "作业",
      "e": ""
     },
     {
      "w": "test",
      "zh": "测验",
      "e": ""
     },
     {
      "w": "think",
      "zh": "思考",
      "e": "💭"
     },
     {
      "w": "know",
      "zh": "知道",
      "e": ""
     },
     {
      "w": "remember",
      "zh": "记住",
      "e": ""
     }
    ],
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
    ]
   },
   {
    "id": "pu6-u6",
    "mod": 6,
    "title": "Good job!",
    "zh": "好工作！",
    "page": 66,
    "vocab": "职业 · 工作",
    "grammar": "情态动词表推测（It must be an old printer. / I think it might be an old hairdryer. / It can't be an ice-cream maker.）；现在完成进行时（I have been working full-time for the last four years.）",
    "spell": "词群的连读",
    "cc": "Economic sectors 产业链与服务",
    "lit": "The daydreamer（故事）",
    "sel": "社交情感技能：主动进取",
    "m1": "Write about your dream job",
    "m2": "Write about your dream job",
    "exam": "Preliminary for Schools: Listening Part 4 / Reading Part 6",
    "words": [
     {
      "w": "job",
      "zh": "工作",
      "e": ""
     },
     {
      "w": "work",
      "zh": "工作",
      "e": ""
     },
     {
      "w": "doctor",
      "zh": "医生",
      "e": "👨‍⚕️"
     },
     {
      "w": "nurse",
      "zh": "护士",
      "e": "👩‍⚕️"
     },
     {
      "w": "driver",
      "zh": "司机",
      "e": ""
     },
     {
      "w": "cook",
      "zh": "厨师",
      "e": "👩‍🍳"
     },
     {
      "w": "farmer",
      "zh": "农民",
      "e": "👨‍🌾"
     },
     {
      "w": "writer",
      "zh": "作家",
      "e": ""
     },
     {
      "w": "scientist",
      "zh": "科学家",
      "e": "🔬"
     },
     {
      "w": "artist",
      "zh": "画家",
      "e": ""
     },
     {
      "w": "dream",
      "zh": "梦想",
      "e": "💫"
     },
     {
      "w": "success",
      "zh": "成功",
      "e": ""
     },
     {
      "w": "computer",
      "zh": "电脑",
      "e": "💻"
     },
     {
      "w": "phone",
      "zh": "电话",
      "e": "📱"
     },
     {
      "w": "team",
      "zh": "团队",
      "e": ""
     },
     {
      "w": "goal",
      "zh": "目标",
      "e": ""
     }
    ],
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
    ]
   },
   {
    "id": "pu6-r2",
    "mod": 0,
    "title": "Review 4-6",
    "zh": "复习 4-6 单元",
    "page": 0,
    "vocab": "",
    "grammar": "复习：被动语态、短语动词、过去完成时、情态推测、现在完成进行时",
    "spell": "",
    "cc": "",
    "lit": "",
    "sel": "",
    "m1": "",
    "m2": "",
    "exam": "",
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
    "title": "It's the law!",
    "zh": "这是法律！",
    "page": 80,
    "vocab": "新闻报道 · 转述动词",
    "grammar": "间接引语（He said she could walk in a circle or go to jail! / He said that the man had to do a bike ride for charity.）；间接引语的疑问句（Luis asked Clara why her hair was wet. / Luis asked Dan if he could tell him the answer.）",
    "spell": "对比重音",
    "cc": "Forensic science 指纹的发明",
    "lit": "The hours（报纸文章）",
    "sel": "社交情感技能：诚实",
    "m1": "Write a news report",
    "m2": "Write a news report",
    "exam": "Preliminary for Schools: Reading Part 3 / Listening Part 2",
    "words": [
     {
      "w": "news",
      "zh": "新闻",
      "e": "📰"
     },
     {
      "w": "police",
      "zh": "警察",
      "e": "🚓"
     },
     {
      "w": "rule",
      "zh": "规则",
      "e": ""
     },
     {
      "w": "law",
      "zh": "法律",
      "e": "⚖️"
     },
     {
      "w": "safe",
      "zh": "安全的",
      "e": "🦺"
     },
     {
      "w": "danger",
      "zh": "危险",
      "e": ""
     },
     {
      "w": "help",
      "zh": "帮助",
      "e": "🆘"
     },
     {
      "w": "protect",
      "zh": "保护",
      "e": "🛡️"
     },
     {
      "w": "team",
      "zh": "团队",
      "e": ""
     },
     {
      "w": "question",
      "zh": "问题",
      "e": "❓"
     },
     {
      "w": "answer",
      "zh": "回答",
      "e": ""
     },
     {
      "w": "speak",
      "zh": "讲话",
      "e": "🗣️"
     },
     {
      "w": "tell",
      "zh": "告诉",
      "e": "📢"
     },
     {
      "w": "ask",
      "zh": "问",
      "e": ""
     }
    ],
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
    ]
   },
   {
    "id": "pu6-u8",
    "mod": 8,
    "title": "Fantastic flavours",
    "zh": "美味佳肴",
    "page": 92,
    "vocab": "三道式套餐 · 描写食物",
    "grammar": "反身代词（We really enjoyed ourselves! / My mum makes them herself.）；too 和 enough（They are too messy to hold in your hands. / It is not sweet enough for me to want to drink.）",
    "spell": "语调",
    "cc": "Food labels 学会看食品标签",
    "lit": "The girl who turned blue（剧本）",
    "sel": "社交情感技能：努力带来成功",
    "m1": "Write a café review",
    "m2": "Write a café review",
    "exam": "Preliminary for Schools: Listening Part 3 / Speaking Part 4",
    "words": [
     {
      "w": "sweet",
      "zh": "甜的",
      "e": "🍯"
     },
     {
      "w": "hot",
      "zh": "热",
      "e": "🥵"
     },
     {
      "w": "delicious",
      "zh": "美味的",
      "e": "😋"
     },
     {
      "w": "dumpling",
      "zh": "饺子",
      "e": "🥟"
     },
     {
      "w": "noodle",
      "zh": "面条",
      "e": "🍜"
     },
     {
      "w": "soup",
      "zh": "汤",
      "e": ""
     },
     {
      "w": "chicken",
      "zh": "鸡肉",
      "e": "🍗"
     },
     {
      "w": "beef",
      "zh": "牛肉",
      "e": "🥩"
     },
     {
      "w": "fruit",
      "zh": "水果",
      "e": "🍏"
     },
     {
      "w": "vegetable",
      "zh": "蔬菜",
      "e": "🥦"
     },
     {
      "w": "cake",
      "zh": "蛋糕",
      "e": "🍰"
     },
     {
      "w": "breakfast",
      "zh": "早餐",
      "e": ""
     },
     {
      "w": "lunch",
      "zh": "午餐",
      "e": ""
     },
     {
      "w": "dinner",
      "zh": "晚餐",
      "e": ""
     },
     {
      "w": "rice",
      "zh": "米饭",
      "e": "🍚"
     },
     {
      "w": "bread",
      "zh": "面包",
      "e": "🍞"
     }
    ],
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
    ]
   },
   {
    "id": "pu6-u9",
    "mod": 9,
    "title": "Raining cats and dogs",
    "zh": "倾盆大雨",
    "page": 104,
    "vocab": "天气 · 天气形容词",
    "grammar": "第一/第二条件句复习（If it is sunny this weekend, I will play football and fly my kite. / If I was delighted if there was no more lightning!）；I wish …（I wish it was snowing today. / I wish I could talk to animals.）",
    "spell": "条件句的语调",
    "cc": "Wild weather 飓风的形成",
    "lit": "Lost in the hills（故事）",
    "sel": "社交情感技能：觉察决定对他人影响",
    "m1": "Present a weather forecast",
    "m2": "Present a weather forecast",
    "exam": "Preliminary for Schools: Reading Part 1 (an email) / Speaking Part 3",
    "words": [
     {
      "w": "weather",
      "zh": "天气",
      "e": "🌤️"
     },
     {
      "w": "rain",
      "zh": "雨",
      "e": "🌧️"
     },
     {
      "w": "snow",
      "zh": "雪",
      "e": "❄️"
     },
     {
      "w": "wind",
      "zh": "风",
      "e": "🌬️"
     },
     {
      "w": "cloud",
      "zh": "云",
      "e": "☁️"
     },
     {
      "w": "storm",
      "zh": "暴风雨",
      "e": "⛈️"
     },
     {
      "w": "fog",
      "zh": "雾",
      "e": "🌫️"
     },
     {
      "w": "umbrella",
      "zh": "雨伞",
      "e": "☂️"
     },
     {
      "w": "raincoat",
      "zh": "雨衣",
      "e": ""
     },
     {
      "w": "sunny",
      "zh": "晴朗的",
      "e": "🔆"
     },
     {
      "w": "rainy",
      "zh": "下雨的",
      "e": ""
     },
     {
      "w": "ice",
      "zh": "冰",
      "e": "🧊"
     },
     {
      "w": "cold",
      "zh": "冷",
      "e": "🥶"
     },
     {
      "w": "warm",
      "zh": "温暖",
      "e": ""
     },
     {
      "w": "sky",
      "zh": "天空",
      "e": ""
     },
     {
      "w": "wind",
      "zh": "风",
      "e": "🌬️"
     }
    ],
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
    ]
   },
   {
    "id": "pu6-r3",
    "mod": 0,
    "title": "Review 7-9",
    "zh": "复习 7-9 单元",
    "page": 0,
    "vocab": "",
    "grammar": "复习：间接引语、反身代词、too/enough、第一/第二条件句、I wish",
    "spell": "",
    "cc": "",
    "lit": "",
    "sel": "",
    "m1": "",
    "m2": "",
    "exam": "",
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

const POWERUP_GRAMMAR = {
 "pu1-u0": "自我介绍：What's your name? I'm … / How old are you? I'm …",
 "pu1-u1": "Where …? 方位介词 in/on/under/next to；this/these 单复数",
 "pu1-u2": "is/are；have/haven't got",
 "pu1-u3": "is/are + 形容词；形容词 + 名词；has/hasn't got",
 "pu1-u4": "like / don't like；请求与提供 Can I have …? Would you like …?",
 "pu1-u5": "Whose …? 所有格 's；物主代词 my/your/his/her；want/wants",
 "pu1-u6": "there is/are；let's …",
 "pu1-u7": "现在进行时 What are you doing?；can 表示许可",
 "pu1-u8": "can 表示能力；方位介词 in front of / between / behind",
 "pu1-u9": "祈使句；like/enjoy + 动名词（me too / so do I）",
 "pu1-r1": "复习：方位介词、this/these、have got、like、农场动物",
 "pu1-r2": "复习：like/请求与提供、所有格、there is/are",
 "pu1-r3": "复习：现在进行时、can、祈使句、like+doing",
 "pu2-u0": "How old is she? She's five. / He's got long hair.",
 "pu2-u1": "现在进行时复习；一般现在时表习惯；o'clock 报时",
 "pu2-u2": "How often …? 频率副词 always/often/sometimes/never；must/mustn't",
 "pu2-u3": "一般现在时 vs 现在进行时；Why …? Because …",
 "pu2-u4": "比较级 -er/-ier/better/worse；名词性物主代词 ours/theirs",
 "pu2-u5": "最高级 the prettiest/the best；方位介词 above/below/near/opposite",
 "pu2-u6": "was/were；there was / there were",
 "pu2-u7": "一般过去时：不规则动词；规则动词",
 "pu2-u8": "更多不规则过去式；have to / don't have to",
 "pu2-u9": "more 比较级；the most 最高级",
 "pu2-r1": "复习：现在进行时、频率副词、Why/Because",
 "pu2-r2": "复习：比较级、最高级、was/were",
 "pu2-r3": "复习：过去时、have to、more/most",
 "pu3-u0": "疑问词复习 how/what/when/where/which/who/why；was/were + could",
 "pu3-u1": "was/were + could；疑问词复习",
 "pu3-u2": "定语从句 where/who/which；过去时 + with/when",
 "pu3-u3": "比较级最高级复习 as … as；want/need + 不定式",
 "pu3-u4": "副词 well/badly/loudly…；比较副词 faster/better",
 "pu3-u5": "be made of；shall / could / let's 表建议",
 "pu3-u6": "should / shouldn't 给建议",
 "pu3-u7": "have to / must；because 说原因",
 "pu3-u8": "be going to 表计划",
 "pu3-u9": "before / after / when 从句",
 "pu3-r1": "复习：could、定语从句、as…as、should",
 "pu3-r2": "复习：比较副词、be made of、should",
 "pu3-r3": "复习：have to、be going to、时间从句",
 "pu4-u0": "复习 Level 3 全部语法",
 "pu4-u1": "might/may 表推测（It might be hot.）；不定代词 everywhere/somewhere/anywhere/nowhere、everyone/someone/anyone/no-one、everything/something/anything/nothing",
 "pu4-u2": "一般过去时复习：规则与不规则动词 + ago（We got here three days ago.）；too 和 enough（There is too much pollution. / There is not enough ice.）",
 "pu4-u3": "现在完成时表经历（Have you ever won a competition?）；现在完成时 + just/already/yet（I have already taken more than 100 photos. / I have not seen the pyramids yet.）",
 "pu4-r1": "复习：might/may、不定代词、ago、too/enough、现在完成时",
 "pu4-u4": "过去进行时（We were waiting at the bus stop when it started to rain. / While we were getting on the bus, I was looking for my ticket.）；现在完成时 + since/for（I have worked in restaurants since I was a teenager.）",
 "pu4-u5": "will/won't（We will not go outside today. / You will stay at home.）；连词 so 和 because（We did not go skiing because it was foggy. / We could not see very well, so it was not safe to ski.）",
 "pu4-u6": "反义疑问句（You are a mechanic, are not you? / You cannot fix robots, can you?）；短问句（I have got a problem. — Have you? / I cannot find my mobile phone. — Can not you?）",
 "pu4-r2": "复习：过去进行时、since/for、will/won't、so/because、反义疑问句",
 "pu4-u7": "过去分词 seen/found/driven/ridden/taken/broken/gone/left/tried/forgotten/put/stood/fallen/cut；be used for/to（They were used to bury the Egyptian kings. / They are used for teaching people about the Ancient Egyptians.）",
 "pu4-u8": "will 和 going to（We are going to have a special visitor. / Some people think we will live on Mars.）；过去时态总复习",
 "pu4-u9": "It smells/tastes/looks/feels/sounds like …（It felt like dry grass. / It smelt like carrot cake.）；make somebody + adjective（The smell is making me hungry.）",
 "pu4-r3": "复习：过去分词、be used for/to、will 和 going to、感官动词 like",
 "pu5-u1": "比较级形容词、副词与 as … as（The blue jacket is more expensive than the grey jacket, but it fits better. / It is not as heavy as the grey jacket.）；一般现在时表将来（What time does the fashion show start tomorrow?）",
 "pu5-u2": "第一条件句（If something breaks, a robot will fix it.）；零条件句（If you press this button, it turns on.）",
 "pu5-u3": "一般现在时被动语态（The hosts are decided by the World Rugby Council.）；shall/could/should 提议（Shall we watch the wheelchair rugby? / I think we should ask Mum and Dad.）",
 "pu5-r1": "复习：as…as、一般现在时表将来、第一/零条件句、被动语态",
 "pu5-u4": "现在完成时 + how long/for/since（How long has your arm been sore? / I have felt worried about it since yesterday.）；现在进行时表将来（I am seeing the doctor again.）",
 "pu5-u5": "prefer、would prefer 和 would rather（I prefer eating salad to potatoes! / I would rather have steak.）；一般过去时被动语态（Pizza was first made in southern Italy! / Chocolate-chip cookies were invented by Ruth Wakefield!）",
 "pu5-u6": "a few/a little/a lot of/lots of（There are a lot of old clothes in this box.）；反义疑问句（We could be more environmentally friendly, could we not? / We should not throw plastic into the wrong bin, should we?）",
 "pu5-r2": "复习：现在完成时 how long/for/since、prefer/would rather、a few/a little、反义疑问句",
 "pu5-u7": "have to/don't have to/needn't/must/mustn't（I really must study for the history test tomorrow. / You need not worry — you have studied a lot.）；so … that / such … that（I felt so scared that I wanted to go home!）",
 "pu5-u8": "间接疑问句（Could you tell us what that big building is, please?）；used to / didn't use to（People didn't use to have running water in their kitchens.）",
 "pu5-u9": "have / get something done（We are having the costumes made.）；第二条件句（If I had €250 million, I would give lots of it to charity.）",
 "pu5-r3": "复习：have to/mustn't、so/such…that、间接疑问句、used to、第二条件句",
 "pu6-u1": "形容词 + 介词（I am interested in all kinds of music. / It is perfect for people who are keen on music.）；so 和 nor 的短答（I had lots of fun! So have we! / I don't know. Nor do I.）",
 "pu6-u2": "关系从句（My cousins who live in Portugal speak Portuguese.）；more … than, fewer … than, less … than, the most, the fewest, the best, the worst（People can drink less water than camels.）",
 "pu6-u3": "动词+动名词、动词+不定式（They need to sleep and play! / Do you fancy buying one?）；动名词作主语和宾语（Shopping is great! / She's keen on learning about tea.）",
 "pu6-r1": "复习：形容词+介词、so/nor 短答、关系从句、比较结构、动词+动名词",
 "pu6-u4": "被动语态复习（Singapore Airport was built to be fun. / It has been open since 2011.）；短语动词与宾语（He put on his swimming trunks. / He put them on.）",
 "pu6-u5": "一般过去时与现在完成时的时间短语（Ten days ago, I borrowed some books. / I have never felt so great!）；过去完成时（I thought that I could never get good marks. / There were two essay questions that I hadn't seen!）",
 "pu6-u6": "情态动词表推测（It must be an old printer. / I think it might be an old hairdryer. / It can't be an ice-cream maker.）；现在完成进行时（I have been working full-time for the last four years.）",
 "pu6-r2": "复习：被动语态、短语动词、过去完成时、情态推测、现在完成进行时",
 "pu6-u7": "间接引语（He said she could walk in a circle or go to jail! / He said that the man had to do a bike ride for charity.）；间接引语的疑问句（Luis asked Clara why her hair was wet. / Luis asked Dan if he could tell him the answer.）",
 "pu6-u8": "反身代词（We really enjoyed ourselves! / My mum makes them herself.）；too 和 enough（They are too messy to hold in your hands. / It is not sweet enough for me to want to drink.）",
 "pu6-u9": "第一/第二条件句复习（If it is sunny this weekend, I will play football and fly my kite. / If I was delighted if there was no more lightning!）；I wish …（I wish it was snowing today. / I wish I could talk to animals.）",
 "pu6-r3": "复习：间接引语、反身代词、too/enough、第一/第二条件句、I wish"
};

window.POWERUP_LEVELS = POWERUP_LEVELS;
window.POWERUP_GRAMMAR = POWERUP_GRAMMAR;
