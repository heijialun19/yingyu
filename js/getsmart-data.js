/* ============================================================
   小鸟英语乐园 · Get Smart 学堂课程数据 v1
   教材：MM Publications《Get Smart》(New Get Smart, American Edition)
        H. Q. Mitchell & Marileni Malkogianni
   结构：每册 = 若干模块(Module)，每模块 = 正课(Unit) + 复习课(Review)
   数据来源标注：sent 字段里的例句、grammar 语法点来自教材同步教研；
        kind:'review' 的复习课词库自动取自 from 指向的单元。
   ============================================================ */

/* 儿子当前在学的册（页面上会标 📍 并默认打开） */
const GS_CURRENT_LEVEL = 'gs2';

/* 首页岛卡用的进度：当前册已完成 x/y 课 */
function gsLevelProgress(lvId) {
  try {
    const lv = GS_LEVELS.find(l => l.id === lvId);
    if (!lv || !lv.units.length) return '课本同步';
    const done = lv.units.filter(u => Store.d.getsmart && Store.d.getsmart[u.id]).length;
    return done + '/' + lv.units.length + ' 课';
  } catch (e) { return '课本同步'; }
}

const GS_LEVELS = [
  /* ============ Get Smart 1 ============ */
  {
    id: 'gs1', name: 'Get Smart 1', zh: '第一册 · 启蒙起步', emoji: '🐣', color: '#F59E0B',
    desc: '启蒙起步：打招呼、颜色、数字、玩具、宠物和心情。课程按系列递进设计，发教材目录来可逐课校准。',
    units: [
      { id: 'gs1-u01', mod: 1, modName: '第 1 组 · 开口说', modEmoji: '👋', kind: 'unit',
        title: 'Lesson 1 · Hello!', zh: '你好！',
        grammar: 'I am... 我是…',
        words: [
          { w: 'hello', zh: '你好', e: '👋' }, { w: 'hi', zh: '嗨', e: '🙋' },
          { w: 'goodbye', zh: '再见', e: '👋' }, { w: 'teacher', zh: '老师', e: '👩‍🏫' },
          { w: 'boy', zh: '男孩', e: '👦' }, { w: 'girl', zh: '女孩', e: '👧' },
          { w: 'name', zh: '名字', e: '🏷️' }, { w: 'friend', zh: '朋友', e: '🤝' },
        ],
        sentences: [
          { en: 'Hello! I am Jojo.', zh: '你好！我是啾啾。' },
          { en: 'What is your name? My name is Lily.', zh: '你叫什么名字？我叫莉莉。' },
          { en: 'Goodbye, teacher!', zh: '老师再见！' },
        ] },
      { id: 'gs1-u02', mod: 1, kind: 'unit',
        title: 'Lesson 2 · Colours', zh: '颜色',
        grammar: 'It is + 颜色',
        words: [
          { w: 'red', zh: '红色', e: '🔴' }, { w: 'blue', zh: '蓝色', e: '🔵' },
          { w: 'yellow', zh: '黄色', e: '🟡' }, { w: 'green', zh: '绿色', e: '🟢' },
          { w: 'pink', zh: '粉色', e: '🩷' }, { w: 'orange', zh: '橙色', e: '🟠' },
          { w: 'purple', zh: '紫色', e: '🟣' }, { w: 'black', zh: '黑色', e: '⚫' }, { w: 'white', zh: '白色', e: '⚪' },
        ],
        sentences: [
          { en: 'What colour is it? It is blue.', zh: '它是什么颜色？是蓝色。' },
          { en: 'I like the red kite!', zh: '我喜欢那个红色的风筝！' },
        ] },
      { id: 'gs1-u03', mod: 1, kind: 'unit',
        title: 'Lesson 3 · Numbers 1-10', zh: '数字 1-10',
        grammar: 'How many? 数字回答',
        words: [
          { w: 'one', zh: '一', e: '1️⃣' }, { w: 'two', zh: '二', e: '2️⃣' }, { w: 'three', zh: '三', e: '3️⃣' },
          { w: 'four', zh: '四', e: '4️⃣' }, { w: 'five', zh: '五', e: '5️⃣' }, { w: 'six', zh: '六', e: '6️⃣' },
          { w: 'seven', zh: '七', e: '7️⃣' }, { w: 'eight', zh: '八', e: '8️⃣' }, { w: 'nine', zh: '九', e: '9️⃣' },
          { w: 'ten', zh: '十', e: '🔟' },
        ],
        sentences: [
          { en: 'How many cats? Six cats!', zh: '几只猫？六只猫！' },
          { en: 'I can count one to ten!', zh: '我能从一数到十！' },
        ] },
      { id: 'gs1-r1', mod: 1, kind: 'review', title: '第 1 组复习课', zh: '打招呼 · 颜色 · 数字 混合闯关',
        from: ['gs1-u01', 'gs1-u02', 'gs1-u03'], count: 10 },
      { id: 'gs1-u04', mod: 2, modName: '第 2 组 · 我的小世界', modEmoji: '🧸', kind: 'unit',
        title: 'Lesson 4 · My Toys', zh: '我的玩具',
        grammar: 'This is my... / I like...',
        words: [
          { w: 'ball', zh: '球', e: '⚽' }, { w: 'kite', zh: '风筝', e: '🪁' },
          { w: 'bike', zh: '自行车', e: '🚲' }, { w: 'car', zh: '小汽车', e: '🚗' },
          { w: 'drum', zh: '鼓', e: '🥁' }, { w: 'plane', zh: '飞机', e: '✈️' },
          { w: 'train', zh: '火车', e: '🚂' }, { w: 'boat', zh: '小船', e: '⛵' },
        ],
        sentences: [
          { en: 'This is my ball. I like my ball!', zh: '这是我的球。我喜欢我的球！' },
          { en: 'My kite is big and red.', zh: '我的风筝又大又红。' },
        ] },
      { id: 'gs1-u05', mod: 2, kind: 'unit',
        title: 'Lesson 5 · My Pets', zh: '我的宠物',
        grammar: 'It is a... / I have a...',
        words: [
          { w: 'dog', zh: '狗', e: '🐶' }, { w: 'cat', zh: '猫', e: '🐱' }, { w: 'fish', zh: '鱼', e: '🐟' },
          { w: 'bird', zh: '鸟', e: '🐦' }, { w: 'rabbit', zh: '兔子', e: '🐰' }, { w: 'frog', zh: '青蛙', e: '🐸' },
          { w: 'duck', zh: '鸭子', e: '🦆' }, { w: 'mouse', zh: '老鼠', e: '🐭' },
        ],
        sentences: [
          { en: 'I have a dog. It is small!', zh: '我有一只狗。它很小！' },
          { en: 'The fish can swim. The bird can fly.', zh: '鱼会游泳。鸟会飞。' },
        ] },
      { id: 'gs1-u06', mod: 2, kind: 'unit',
        title: 'Lesson 6 · Feelings', zh: '心情与感觉',
        grammar: 'I am happy. 我很…',
        words: [
          { w: 'happy', zh: '开心', e: '😊' }, { w: 'sad', zh: '难过', e: '😢' },
          { w: 'hungry', zh: '饿', e: '🍽️' }, { w: 'thirsty', zh: '渴', e: '🥤' },
          { w: 'sleepy', zh: '困', e: '😴' }, { w: 'hot', zh: '热', e: '🥵' },
          { w: 'cold', zh: '冷', e: '🥶' }, { w: 'tired', zh: '累', e: '🥱' },
        ],
        sentences: [
          { en: 'I am happy! Are you happy?', zh: '我很开心！你开心吗？' },
          { en: 'I am thirsty. I want water.', zh: '我渴了。我想要水。' },
        ] },
      { id: 'gs1-r2', mod: 2, kind: 'review', title: '第 2 组复习课', zh: '玩具 · 宠物 · 心情 混合闯关',
        from: ['gs1-u04', 'gs1-u05', 'gs1-u06'], count: 10 },
    ]
  },

  /* ============ Get Smart 2（当前在学） ============ */
  {
    id: 'gs2', name: 'Get Smart 2', zh: '第二册 · 正在学', emoji: '🐥', color: '#FF6B6B',
    desc: '第 1-8 课把学校发的《Units 1-4 词汇清单》按主题分成小课补课用；「Units 1-4 词汇复习课」= 清单原样强度。正课粒度以课本为准：把课本单元页拍照发来，逐课严格对齐后上架。',
    units: [
      /* ---- 第 1 组 ---- */
      { id: 'gs2-u01', mod: 1, modName: '第 1 组 · 校园与家人（教材 U1-U4 前半）', modEmoji: '🎒', modTip: 'What 提问 · This is... · How many', kind: 'unit',
        title: 'Lesson 1 · School things', zh: '校园文具',
        grammar: 'What is it? 它是什么',
        words: [
          { w: 'ruler', zh: '尺子', e: '📏' },
          { w: 'bag', zh: '书包', e: '🎒' },
          { w: 'pen', zh: '钢笔', e: '🖊️' },
          { w: 'pencil', zh: '铅笔', e: '✏️' },
          { w: 'book', zh: '书', e: '📖' },
          { w: 'eraser', zh: '橡皮', e: '🧽' },
          { w: 'computer', zh: '电脑', e: '💻' },
          { w: 'desk', zh: '书桌', e: '🪑' },
          { w: 'chair', zh: '椅子', e: '💺' },
          { w: 'board', zh: '黑板', e: '🟩' },
          { w: 'pencil case', zh: '铅笔盒', e: '🗃️' },
        ],
        sentences: [
          { en: 'What is it? It is a ruler.', zh: '它是什么？它是一把尺子。' },
          { en: 'What is it? It is my pencil case.', zh: '它是什么？它是我的铅笔盒。' },
          { en: 'This is my bag. I like my bag.', zh: '这是我的书包。我喜欢我的书包。' },
        ] },
      { id: 'gs2-u02', mod: 1, kind: 'unit',
        title: 'Lesson 2 · Numbers & Colours', zh: '数字与颜色',
        grammar: 'How many? 数字 1-10',
        words: [
          { w: 'one', zh: '一', e: '1️⃣' }, { w: 'two', zh: '二', e: '2️⃣' }, { w: 'three', zh: '三', e: '3️⃣' },
          { w: 'four', zh: '四', e: '4️⃣' }, { w: 'five', zh: '五', e: '5️⃣' }, { w: 'six', zh: '六', e: '6️⃣' },
          { w: 'seven', zh: '七', e: '7️⃣' }, { w: 'eight', zh: '八', e: '8️⃣' }, { w: 'nine', zh: '九', e: '9️⃣' },
          { w: 'ten', zh: '十', e: '🔟' },
          { w: 'red', zh: '红色', e: '🔴' }, { w: 'blue', zh: '蓝色', e: '🔵' }, { w: 'yellow', zh: '黄色', e: '🟡' },
          { w: 'green', zh: '绿色', e: '🟢' }, { w: 'pink', zh: '粉色', e: '🩷' }, { w: 'orange', zh: '橙色', e: '🟠' },
          { w: 'black', zh: '黑色', e: '⚫' }, { w: 'white', zh: '白色', e: '⚪' }, { w: 'brown', zh: '棕色', e: '🟤' },
        ],
        sentences: [
          { en: 'How many pens? Three pens.', zh: '几支钢笔？三支钢笔。' },
          { en: 'What colour is it? It is blue.', zh: '它是什么颜色？是蓝色。' },
          { en: 'I can see a green book.', zh: '我看见一本绿色的书。' },
        ] },
      { id: 'gs2-u03', mod: 1, kind: 'unit',
        title: 'Lesson 3 · My Family', zh: '我的家人',
        grammar: 'This is... / These are...',
        words: [
          { w: 'father', zh: '爸爸', e: '👨' }, { w: 'mother', zh: '妈妈', e: '👩' },
          { w: 'sister', zh: '姐姐/妹妹', e: '👧' }, { w: 'brother', zh: '哥哥/弟弟', e: '👦' },
          { w: 'uncle', zh: '叔叔', e: '🧔' }, { w: 'aunt', zh: '阿姨', e: '👩‍🦰' },
          { w: 'cousin', zh: '表兄弟姊妹', e: '🧒' }, { w: 'grandfather', zh: '爷爷', e: '👴' },
          { w: 'grandmother', zh: '奶奶', e: '👵' }, { w: 'friend', zh: '朋友', e: '🤝' }, { w: 'baby', zh: '宝宝', e: '👶' },
        ],
        sentences: [
          { en: 'This is my father. He is tall.', zh: '这是我的爸爸。他很高。' },
          { en: 'These are my cousins. They are funny.', zh: '这些是我的表兄弟姊妹。他们很有趣。' },
          { en: 'I love my family!', zh: '我爱我的家人！' },
        ] },
      { id: 'gs2-r1', mod: 1, kind: 'review', title: '第 1 组复习课', zh: '文具 · 数字颜色 · 家人 混合闯关',
        from: ['gs2-u01', 'gs2-u02', 'gs2-u03'], count: 10 },
      /* ---- 第 2 组 ---- */
      { id: 'gs2-u04', mod: 2, modName: '第 2 组 · 房间与动物（教材 U1-U4 后半）', modEmoji: '🛏️', modTip: 'Where is...? · It can... · has got', kind: 'unit',
        title: 'Lesson 4 · My Room', zh: '我的房间',
        grammar: 'Where is...? It is in/on/under...',
        words: [
          { w: 'puzzle', zh: '拼图', e: '🧩' }, { w: 'closet', zh: '衣柜', e: '🚪' },
          { w: 'bed', zh: '床', e: '🛏️' }, { w: 'teddy bear', zh: '泰迪熊', e: '🧸' },
          { w: 'doll', zh: '玩偶', e: '🎎' }, { w: 'board game', zh: '棋盘游戏', e: '🎲' },
          { w: 'lamp', zh: '台灯', e: '🛋️' }, { w: 'couch', zh: '沙发', e: '🛋️' },
          { w: 'TV', zh: '电视', e: '📺' }, { w: 'window', zh: '窗户', e: '🪟' },
        ],
        sentences: [
          { en: 'Where is my teddy bear? It is on the bed.', zh: '我的泰迪熊在哪里？它在床上。' },
          { en: 'The lamp is on the couch.', zh: '台灯在沙发上。' },
          { en: 'My room is big and clean!', zh: '我的房间又大又干净！' },
        ] },
      { id: 'gs2-u05', mod: 2, kind: 'unit',
        title: 'Lesson 5 · Numbers 20-50', zh: '数字 20-50',
        grammar: 'How many...? 数一数',
        words: [
          { w: 'twenty', zh: '二十', e: '2️⃣' }, { w: 'thirty', zh: '三十', e: '3️⃣' },
          { w: 'forty', zh: '四十', e: '4️⃣' }, { w: 'fifty', zh: '五十', e: '5️⃣' },
        ],
        sentences: [
          { en: 'How many crayons? Thirty crayons!', zh: '多少支蜡笔？三十支蜡笔！' },
        ] },
      { id: 'gs2-u06', mod: 2, kind: 'unit',
        title: 'Lesson 6 · Face & Hair', zh: '五官与头发',
        grammar: 'He/She has... has got',
        words: [
          { w: 'eyes', zh: '眼睛', e: '👀' }, { w: 'ears', zh: '耳朵', e: '👂' },
          { w: 'nose', zh: '鼻子', e: '👃' }, { w: 'mouth', zh: '嘴巴', e: '👄' },
          { w: 'tooth', zh: '牙齿（单颗）', e: '🦷' }, { w: 'teeth', zh: '牙齿（全部）', e: '🦷' },
          { w: 'curly hair', zh: '卷头发', e: '💇' }, { w: 'short hair', zh: '短头发', e: '💇‍♂️' },
          { w: 'straight hair', zh: '直头发', e: '👩' }, { w: 'long hair', zh: '长头发', e: '👩‍🦳' },
        ],
        sentences: [
          { en: 'She has big eyes and long hair.', zh: '她有大眼睛和长头发。' },
          { en: 'He has short straight hair.', zh: '他有短的直头发。' },
          { en: 'I brush my teeth every day!', zh: '我每天都刷牙！' },
        ] },
      { id: 'gs2-u07', mod: 2, kind: 'unit',
        title: 'Lesson 7 · Animals', zh: '动物园',
        grammar: 'It can... / It has...',
        words: [
          { w: 'lizard', zh: '蜥蜴', e: '🦎' }, { w: 'cat', zh: '猫', e: '🐱' }, { w: 'dog', zh: '狗', e: '🐶' },
          { w: 'snake', zh: '蛇', e: '🐍' }, { w: 'rabbit', zh: '兔子', e: '🐰' }, { w: 'elephant', zh: '大象', e: '🐘' },
          { w: 'penguin', zh: '企鹅', e: '🐧' }, { w: 'hippo', zh: '河马', e: '🦛' }, { w: 'crocodile', zh: '鳄鱼', e: '🐊' },
          { w: 'tiger', zh: '老虎', e: '🐯' }, { w: 'giraffe', zh: '长颈鹿', e: '🦒' }, { w: 'lion', zh: '狮子', e: '🦁' },
          { w: 'zebra', zh: '斑马', e: '🦓' }, { w: 'parrot', zh: '鹦鹉', e: '🦜' }, { w: 'monkey', zh: '猴子', e: '🐵' },
        ],
        sentences: [
          { en: 'The monkey has a long tail.', zh: '猴子有一条长尾巴。' },
          { en: 'A crocodile can swim. A bird can fly.', zh: '鳄鱼会游泳。鸟会飞。' },
          { en: 'Look at the giraffe! It has a long neck.', zh: '看那只长颈鹿！它有长脖子。' },
        ] },
      { id: 'gs2-u08', mod: 2, kind: 'unit',
        title: 'Lesson 8 · Animal Actions', zh: '动物的本领',
        grammar: 'can / cannot 句型',
        words: [
          { w: 'swim', zh: '游泳', e: '🏊' }, { w: 'jump', zh: '跳', e: '🤸' }, { w: 'run', zh: '跑', e: '🏃' },
          { w: 'fly', zh: '飞', e: '🕊️' }, { w: 'climb', zh: '爬', e: '🧗' }, { w: 'talk', zh: '说话', e: '💬' },
          { w: 'see', zh: '看见', e: '👁️' }, { w: 'leg', zh: '腿', e: '🦵' }, { w: 'wings', zh: '翅膀', e: '🪽' },
          { w: 'head', zh: '头', e: '🧠' }, { w: 'tail', zh: '尾巴', e: '🦨' },
        ],
        sentences: [
          { en: 'A penguin cannot fly, but it can swim!', zh: '企鹅不会飞，但是它会游泳！' },
          { en: 'The parrot can talk!', zh: '鹦鹉会说话！' },
          { en: 'I can run and jump. Can you?', zh: '我会跑会跳。你呢？' },
        ] },
      { id: 'gs2-r2', mod: 2, kind: 'review', title: '第 2 组复习课', zh: '房间 · 数字 · 五官 · 动物 混合闯关',
        from: ['gs2-u04', 'gs2-u05', 'gs2-u06', 'gs2-u07', 'gs2-u08'], count: 12 },
      /* 学校发的《U1-U4 词汇清单》原样 = 课本里一节复习课的强度（家长校准） */
      { id: 'gs2-rx', mod: 2, kind: 'review', title: 'Units 1-4 词汇复习课', zh: '学校词汇清单 · 全部单词混合大闯关',
        from: ['gs2-u01', 'gs2-u02', 'gs2-u03', 'gs2-u04', 'gs2-u05', 'gs2-u06', 'gs2-u07', 'gs2-u08'], count: 20 },
    ]
  },

  /* ============ Get Smart 3 ============ */
  {
    id: 'gs3', name: 'Get Smart 3', zh: '第三册 · 进阶', emoji: '🐓', color: '#3B82F6',
    desc: '进阶：食物、作息、天气、城镇与运动。课程按系列递进设计，发教材目录来可逐课校准。',
    units: [
      { id: 'gs3-u01', mod: 1, modName: '第 1 组 · 吃喝与作息', modEmoji: '🍎', kind: 'unit',
        title: 'Lesson 1 · Food & Drinks', zh: '食物与饮料',
        grammar: 'I like... / Do you like...?',
        words: [
          { w: 'rice', zh: '米饭', e: '🍚' }, { w: 'bread', zh: '面包', e: '🍞' },
          { w: 'milk', zh: '牛奶', e: '🥛' }, { w: 'juice', zh: '果汁', e: '🧃' },
          { w: 'egg', zh: '鸡蛋', e: '🥚' }, { w: 'chicken', zh: '鸡肉', e: '🍗' },
          { w: 'apple', zh: '苹果', e: '🍎' }, { w: 'banana', zh: '香蕉', e: '🍌' },
          { w: 'water', zh: '水', e: '💧' }, { w: 'cake', zh: '蛋糕', e: '🍰' },
        ],
        sentences: [
          { en: 'I like bread and milk. Do you like eggs?', zh: '我喜欢面包和牛奶。你喜欢鸡蛋吗？' },
          { en: 'Yummy! The cake is sweet!', zh: '真好吃！蛋糕是甜的！' },
        ] },
      { id: 'gs3-u02', mod: 1, kind: 'unit',
        title: 'Lesson 2 · My Day', zh: '我的一天',
        grammar: '... o\'clock 整点时间',
        words: [
          { w: 'morning', zh: '早上', e: '🌅' }, { w: 'afternoon', zh: '下午', e: '☀️' },
          { w: 'evening', zh: '傍晚', e: '🌆' }, { w: 'night', zh: '夜晚', e: '🌙' },
          { w: 'breakfast', zh: '早餐', e: '🥣' }, { w: 'lunch', zh: '午餐', e: '🍱' },
          { w: 'dinner', zh: '晚餐', e: '🍛' }, { w: 'bedtime', zh: '睡觉时间', e: '🛌' },
        ],
        sentences: [
          { en: 'I get up at seven o\'clock.', zh: '我七点起床。' },
          { en: 'Good night! It is bedtime.', zh: '晚安！睡觉时间到了。' },
        ] },
      { id: 'gs3-u03', mod: 1, kind: 'unit',
        title: 'Lesson 3 · Weather', zh: '天气',
        grammar: 'It is + 天气形容词',
        words: [
          { w: 'sunny', zh: '晴朗', e: '☀️' }, { w: 'rainy', zh: '下雨', e: '🌧️' },
          { w: 'cloudy', zh: '多云', e: '☁️' }, { w: 'windy', zh: '刮风', e: '🌬️' },
          { w: 'snowy', zh: '下雪', e: '❄️' }, { w: 'hot', zh: '热', e: '🥵' },
          { w: 'cold', zh: '冷', e: '🥶' }, { w: 'warm', zh: '温暖', e: '🌤️' },
          { w: 'raincoat', zh: '雨衣', e: '🧥' }, { w: 'umbrella', zh: '雨伞', e: '☂️' },
        ],
        sentences: [
          { en: 'It is sunny today. Let us play!', zh: '今天晴天。我们出去玩吧！' },
          { en: 'It is rainy. I need my umbrella.', zh: '下雨了。我需要雨伞。' },
        ] },
      { id: 'gs3-r1', mod: 1, kind: 'review', title: '第 1 组复习课', zh: '食物 · 作息 · 天气 混合闯关',
        from: ['gs3-u01', 'gs3-u02', 'gs3-u03'], count: 10 },
      { id: 'gs3-u04', mod: 2, modName: '第 2 组 · 出门看世界', modEmoji: '🏙️', kind: 'unit',
        title: 'Lesson 4 · Places in Town', zh: '城镇场所',
        grammar: 'Where are you going? I go to...',
        words: [
          { w: 'park', zh: '公园', e: '🌳' }, { w: 'school', zh: '学校', e: '🏫' },
          { w: 'shop', zh: '商店', e: '🏪' }, { w: 'zoo', zh: '动物园', e: '🦁' },
          { w: 'hospital', zh: '医院', e: '🏥' }, { w: 'street', zh: '街道', e: '🛣️' },
          { w: 'supermarket', zh: '超市', e: '🛒' }, { w: 'library', zh: '图书馆', e: '📚' },
        ],
        sentences: [
          { en: 'I go to the park with my friends.', zh: '我和朋友们去公园。' },
          { en: 'The library is big. I love books!', zh: '图书馆很大。我爱书！' },
        ] },
      { id: 'gs3-u05', mod: 2, kind: 'unit',
        title: 'Lesson 5 · Sports', zh: '运动会',
        grammar: 'I can... / Can you...?',
        words: [
          { w: 'football', zh: '足球', e: '⚽' }, { w: 'basketball', zh: '篮球', e: '🏀' },
          { w: 'ping pong', zh: '乒乓球', e: '🏓' }, { w: 'swim', zh: '游泳', e: '🏊' },
          { w: 'skate', zh: '滑冰', e: '⛸️' }, { w: 'dance', zh: '跳舞', e: '💃' },
          { w: 'sing', zh: '唱歌', e: '🎤' }, { w: 'draw', zh: '画画', e: '🎨' },
        ],
        sentences: [
          { en: 'I can play football. Can you swim?', zh: '我会踢足球。你会游泳吗？' },
          { en: 'She can sing and dance!', zh: '她会唱歌会跳舞！' },
        ] },
      { id: 'gs3-u06', mod: 2, kind: 'unit',
        title: 'Lesson 6 · Clothes', zh: '衣服',
        grammar: 'I am wearing... / Whose...?',
        words: [
          { w: 'T-shirt', zh: 'T恤', e: '👕' }, { w: 'shirt', zh: '衬衫', e: '👔' },
          { w: 'shorts', zh: '短裤', e: '🩳' }, { w: 'pants', zh: '裤子', e: '👖' },
          { w: 'dress', zh: '连衣裙', e: '👗' }, { w: 'skirt', zh: '短裙', e: '🩱' },
          { w: 'coat', zh: '外套', e: '🧥' }, { w: 'sweater', zh: '毛衣', e: '🧶' },
          { w: 'shoes', zh: '鞋子', e: '👟' }, { w: 'socks', zh: '袜子', e: '🧦' },
        ],
        sentences: [
          { en: 'Whose jacket is that? It is my coat!', zh: '那是谁的夹克？那是我的外套！' },
          { en: 'I am wearing a blue T-shirt today.', zh: '我今天穿着蓝色T恤。' },
        ] },
      { id: 'gs3-r2', mod: 2, kind: 'review', title: '第 2 组复习课', zh: '场所 · 运动 · 衣服 混合闯关',
        from: ['gs3-u04', 'gs3-u05', 'gs3-u06'], count: 10 },
    ]
  },

  /* ============ Get Smart 4 ============ */
  {
    id: 'gs4', name: 'Get Smart 4', zh: '第四册 · 提高', emoji: '🦅', color: '#8B5CF6',
    desc: '提高：季节、家居、爱好、职业与交通。课程按系列递进设计，发教材目录来可逐课校准。',
    units: [
      { id: 'gs4-u01', mod: 1, modName: '第 1 组 · 时间与家', modEmoji: '🏡', kind: 'unit',
        title: 'Lesson 1 · Seasons & Months', zh: '季节与月份',
        grammar: 'in + 月份 / 春夏秋冬',
        words: [
          { w: 'spring', zh: '春天', e: '🌸' }, { w: 'summer', zh: '夏天', e: '🌞' },
          { w: 'autumn', zh: '秋天', e: '🍂' }, { w: 'winter', zh: '冬天', e: '⛄' },
          { w: 'January', zh: '一月', e: '1️⃣' }, { w: 'June', zh: '六月', e: '6️⃣' },
          { w: 'December', zh: '十二月', e: '🎁' }, { w: 'weekend', zh: '周末', e: '🎉' },
        ],
        sentences: [
          { en: 'I like summer! It is hot and sunny.', zh: '我喜欢夏天！又热又晴朗。' },
          { en: 'My birthday is in December.', zh: '我的生日在十二月。' },
        ] },
      { id: 'gs4-u02', mod: 1, kind: 'unit',
        title: 'Lesson 2 · My House', zh: '我的家',
        grammar: 'There is / There are',
        words: [
          { w: 'kitchen', zh: '厨房', e: '🍳' }, { w: 'bathroom', zh: '浴室', e: '🛁' },
          { w: 'living room', zh: '客厅', e: '🛋️' }, { w: 'garden', zh: '花园', e: '🌷' },
          { w: 'fridge', zh: '冰箱', e: '🧊' }, { w: 'sofa', zh: '沙发', e: '🛋️' },
          { w: 'mirror', zh: '镜子', e: '🪞' }, { w: 'bookshelf', zh: '书架', e: '📚' },
        ],
        sentences: [
          { en: 'There is a big fridge in the kitchen.', zh: '厨房里有一台大冰箱。' },
          { en: 'There are many flowers in the garden.', zh: '花园里有许多花。' },
        ] },
      { id: 'gs4-u03', mod: 1, kind: 'unit',
        title: 'Lesson 3 · Hobbies', zh: '兴趣爱好',
        grammar: 'like + doing 喜欢做…',
        words: [
          { w: 'reading', zh: '阅读', e: '📖' }, { w: 'painting', zh: '画画', e: '🖌️' },
          { w: 'singing', zh: '唱歌', e: '🎵' }, { w: 'dancing', zh: '跳舞', e: '🕺' },
          { w: 'cooking', zh: '烹饪', e: '👨‍🍳' }, { w: 'chess', zh: '国际象棋', e: '♟️' },
          { w: 'kite', zh: '风筝', e: '🪁' }, { w: 'camera', zh: '相机', e: '📷' },
        ],
        sentences: [
          { en: 'I like reading and painting.', zh: '我喜欢阅读和画画。' },
          { en: 'My hobby is flying a kite.', zh: '我的爱好是放风筝。' },
        ] },
      { id: 'gs4-r1', mod: 1, kind: 'review', title: '第 1 组复习课', zh: '季节 · 家 · 爱好 混合闯关',
        from: ['gs4-u01', 'gs4-u02', 'gs4-u03'], count: 10 },
      { id: 'gs4-u04', mod: 2, modName: '第 2 组 · 职业与出行', modEmoji: '🚦', kind: 'unit',
        title: 'Lesson 4 · Jobs', zh: '职业',
        grammar: 'He/She is a... 职业表达',
        words: [
          { w: 'doctor', zh: '医生', e: '🩺' }, { w: 'nurse', zh: '护士', e: '💉' },
          { w: 'driver', zh: '司机', e: '🚕' }, { w: 'policeman', zh: '警察', e: '👮' },
          { w: 'farmer', zh: '农民', e: '🧑‍🌾' }, { w: 'cook', zh: '厨师', e: '🧑‍🍳' },
          { w: 'worker', zh: '工人', e: '👷' }, { w: 'pilot', zh: '飞行员', e: '👨‍✈️' },
        ],
        sentences: [
          { en: 'She is a doctor. She helps people.', zh: '她是医生。她帮助人们。' },
          { en: 'My uncle is a pilot. He can fly planes!', zh: '我叔叔是飞行员。他会开飞机！' },
        ] },
      { id: 'gs4-u05', mod: 2, kind: 'unit',
        title: 'Lesson 5 · Transport', zh: '交通工具',
        grammar: 'by bus / by train 出行方式',
        words: [
          { w: 'bus', zh: '公交车', e: '🚌' }, { w: 'train', zh: '火车', e: '🚄' },
          { w: 'plane', zh: '飞机', e: '✈️' }, { w: 'ship', zh: '轮船', e: '🚢' },
          { w: 'subway', zh: '地铁', e: '🚇' }, { w: 'taxi', zh: '出租车', e: '🚖' },
          { w: 'left', zh: '左', e: '⬅️' }, { w: 'right', zh: '右', e: '➡️' },
        ],
        sentences: [
          { en: 'I go to school by bus.', zh: '我坐公交车上学。' },
          { en: 'Turn left at the street, then go straight!', zh: '在街道左转，然后直走！' },
        ] },
      { id: 'gs4-u06', mod: 2, kind: 'unit',
        title: 'Lesson 6 · Health', zh: '健康小卫士',
        grammar: 'have a... 身体不适表达',
        words: [
          { w: 'headache', zh: '头疼', e: '🤕' }, { w: 'toothache', zh: '牙疼', e: '🦷' },
          { w: 'fever', zh: '发烧', e: '🌡️' }, { w: 'medicine', zh: '药', e: '💊' },
          { w: 'healthy', zh: '健康的', e: '💪' }, { w: 'exercise', zh: '锻炼', e: '🏃' },
          { w: 'rest', zh: '休息', e: '😴' }, { w: 'dentist', zh: '牙医', e: '🦷' },
        ],
        sentences: [
          { en: 'I have a headache. I need some rest.', zh: '我头疼。我需要休息。' },
          { en: 'Eat well and exercise every day!', zh: '好好吃饭，每天锻炼！' },
        ] },
      { id: 'gs4-r2', mod: 2, kind: 'review', title: '第 2 组复习课', zh: '职业 · 交通 · 健康 混合闯关',
        from: ['gs4-u04', 'gs4-u05', 'gs4-u06'], count: 10 },
    ]
  },

  /* ============ Get Smart 5 ============ */
  {
    id: 'gs5', name: 'Get Smart 5', zh: '第五册 · 冲刺', emoji: '🐉', color: '#059669',
    desc: '冲刺：学科、购物、自然、过去时与比较级。课程按系列递进设计，发教材目录来可逐课校准。',
    units: [
      { id: 'gs5-u01', mod: 1, modName: '第 1 组 · 校园与生活', modEmoji: '📚', kind: 'unit',
        title: 'Lesson 1 · School Subjects', zh: '学校课程',
        grammar: 'My favourite... is...',
        words: [
          { w: 'Chinese', zh: '语文', e: '🀄' }, { w: 'math', zh: '数学', e: '➗' },
          { w: 'English', zh: '英语', e: '🔤' }, { w: 'music', zh: '音乐', e: '🎼' },
          { w: 'art', zh: '美术', e: '🎨' }, { w: 'science', zh: '科学', e: '🔬' },
          { w: 'subject', zh: '科目', e: '📋' }, { w: 'timetable', zh: '课程表', e: '🗓️' },
        ],
        sentences: [
          { en: 'My favourite subject is science!', zh: '我最喜欢的科目是科学！' },
          { en: 'We have English and art on Monday.', zh: '我们周一有英语和美术。' },
        ] },
      { id: 'gs5-u02', mod: 1, kind: 'unit',
        title: 'Lesson 2 · Shopping', zh: '购物',
        grammar: 'How much is it? 价格问答',
        words: [
          { w: 'money', zh: '钱', e: '💰' }, { w: 'buy', zh: '买', e: '🛍️' },
          { w: 'sell', zh: '卖', e: '🏪' }, { w: 'expensive', zh: '贵的', e: '💸' },
          { w: 'cheap', zh: '便宜的', e: '🏷️' }, { w: 'dollar', zh: '美元', e: '💵' },
          { w: 'shopkeeper', zh: '店主', e: '🧑‍💼' }, { w: 'customer', zh: '顾客', e: '🛒' },
        ],
        sentences: [
          { en: 'How much is this toy? It is five dollars.', zh: '这个玩具多少钱？五美元。' },
          { en: 'The bag is cheap, but the camera is expensive.', zh: '包很便宜，但相机很贵。' },
        ] },
      { id: 'gs5-u03', mod: 1, kind: 'unit',
        title: 'Lesson 3 · Nature', zh: '大自然',
        grammar: 'There is / are + nature words',
        words: [
          { w: 'forest', zh: '森林', e: '🌲' }, { w: 'river', zh: '河流', e: '🏞️' },
          { w: 'mountain', zh: '山', e: '⛰️' }, { w: 'sea', zh: '大海', e: '🌊' },
          { w: 'island', zh: '岛屿', e: '🏝️' }, { w: 'star', zh: '星星', e: '⭐' },
          { w: 'moon', zh: '月亮', e: '🌙' }, { w: 'earth', zh: '地球', e: '🌍' },
        ],
        sentences: [
          { en: 'The moon is bright tonight. Look at the stars!', zh: '今晚月亮很亮。看那些星星！' },
          { en: 'There are tall trees in the forest.', zh: '森林里有高高的树。' },
        ] },
      { id: 'gs5-r1', mod: 1, kind: 'review', title: '第 1 组复习课', zh: '学科 · 购物 · 自然 混合闯关',
        from: ['gs5-u01', 'gs5-u02', 'gs5-u03'], count: 10 },
      { id: 'gs5-u04', mod: 2, modName: '第 2 组 · 时态与旅行', modEmoji: '✈️', kind: 'unit',
        title: 'Lesson 4 · Yesterday (Past)', zh: '昨天（过去时入门）',
        grammar: 'was / were + 动词过去式',
        words: [
          { w: 'yesterday', zh: '昨天', e: '📅' }, { w: 'was', zh: '是（过去）', e: '⏮️' },
          { w: 'went', zh: '去（过去）', e: '🚶' }, { w: 'saw', zh: '看见（过去）', e: '👀' },
          { w: 'ate', zh: '吃（过去）', e: '🍽️' }, { w: 'played', zh: '玩（过去）', e: '🎲' },
          { w: 'happy', zh: '开心', e: '😊' }, { w: 'tired', zh: '累', e: '🥱' },
        ],
        sentences: [
          { en: 'Yesterday I went to the park. I was happy!', zh: '昨天我去了公园。我很开心！' },
          { en: 'We played football and ate cakes.', zh: '我们踢了足球，吃了蛋糕。' },
        ] },
      { id: 'gs5-u05', mod: 2, kind: 'unit',
        title: 'Lesson 5 · Bigger, Faster!', zh: '比较级',
        grammar: 'bigger / smaller / the biggest',
        words: [
          { w: 'big', zh: '大', e: '🐘' }, { w: 'small', zh: '小', e: '🐭' },
          { w: 'tall', zh: '高', e: '🦒' }, { w: 'fast', zh: '快', e: '🐆' },
          { w: 'long', zh: '长', e: '📏' }, { w: 'strong', zh: '强壮', e: '💪' },
          { w: 'heavy', zh: '重', e: '🪨' }, { w: 'light', zh: '轻', e: '🎈' },
        ],
        sentences: [
          { en: 'An elephant is bigger than a mouse.', zh: '大象比老鼠大。' },
          { en: 'The cheetah is the fastest animal!', zh: '猎豹是最快的动物！' },
        ] },
      { id: 'gs5-u06', mod: 2, kind: 'unit',
        title: 'Lesson 6 · Holidays', zh: '假期旅行',
        grammar: 'be going to 打算做…',
        words: [
          { w: 'holiday', zh: '假期', e: '🏖️' }, { w: 'travel', zh: '旅行', e: '🧳' },
          { w: 'trip', zh: '短途旅行', e: '🚌' }, { w: 'visit', zh: '参观', e: '🎟️' },
          { w: 'beach', zh: '沙滩', e: '🏖️' }, { w: 'hotel', zh: '旅馆', e: '🏨' },
          { w: 'suitcase', zh: '行李箱', e: '🧳' }, { w: 'passport', zh: '护照', e: '🛂' },
        ],
        sentences: [
          { en: 'I am going to visit the beach this summer!', zh: '今年夏天我打算去沙滩！' },
          { en: 'We are going to travel by plane.', zh: '我们打算坐飞机去旅行。' },
        ] },
      { id: 'gs5-r2', mod: 2, kind: 'review', title: '第 2 组复习课', zh: '过去时 · 比较级 · 假期 混合闯关',
        from: ['gs5-u04', 'gs5-u05', 'gs5-u06'], count: 10 },
    ]
  },

  /* ============ Get Smart 6 ============ */
  {
    id: 'gs6', name: 'Get Smart 6', zh: '第六册 · 毕业班', emoji: '🦖', color: '#DC2626',
    desc: '毕业班：将来时、环境、转述句与梦想。课程按系列递进设计，发教材目录来可逐课校准。',
    units: [
      { id: 'gs6-u01', mod: 1, modName: '第 1 组 · 表达升级', modEmoji: '🚀', kind: 'unit',
        title: 'Lesson 1 · Tomorrow (Future)', zh: '明天（将来时）',
        grammar: 'will / be going to 将来时',
        words: [
          { w: 'tomorrow', zh: '明天', e: '⏭️' }, { w: 'will', zh: '将要', e: '🔮' },
          { w: 'weekend', zh: '周末', e: '🎉' }, { w: 'plan', zh: '计划', e: '📋' },
          { w: 'hope', zh: '希望', e: '🌟' }, { w: 'promise', zh: '承诺', e: '🤝' },
        ],
        sentences: [
          { en: 'I will visit my grandparents tomorrow.', zh: '明天我要去看爷爷奶奶。' },
          { en: 'It will be sunny this weekend. Let us go out!', zh: '这周末会晴。我们出去玩吧！' },
        ] },
      { id: 'gs6-u02', mod: 1, kind: 'unit',
        title: 'Lesson 2 · Story Time (Past)', zh: '讲故事（过去进行）',
        grammar: 'was doing / while 当…时候',
        words: [
          { w: 'suddenly', zh: '突然', e: '⚡' }, { w: 'while', zh: '当…时候', e: '⏳' },
          { w: 'knock', zh: '敲（门）', e: '🚪' }, { w: 'shout', zh: '喊叫', e: '📣' },
          { w: 'story', zh: '故事', e: '📖' }, { w: 'dream', zh: '梦', e: '💭' },
        ],
        sentences: [
          { en: 'I was reading when someone knocked.', zh: '我正在读书，突然有人敲门。' },
          { en: 'While we were playing, it started to rain.', zh: '我们正玩着，开始下雨了。' },
        ] },
      { id: 'gs6-u03', mod: 1, kind: 'unit',
        title: 'Lesson 3 · Healthy Habits', zh: '健康习惯',
        grammar: 'should / shouldn\'t 应该与不该',
        words: [
          { w: 'should', zh: '应该', e: '✅' }, { w: 'exercise', zh: '锻炼', e: '🏃' },
          { w: 'sleep', zh: '睡觉', e: '😴' }, { w: 'vegetable', zh: '蔬菜', e: '🥦' },
          { w: 'sweet', zh: '甜食', e: '🍬' }, { w: 'energy', zh: '能量', e: '⚡' },
        ],
        sentences: [
          { en: 'You should eat vegetables and sleep early.', zh: '你应该吃蔬菜、早点睡觉。' },
          { en: 'You should not eat too many sweets!', zh: '你不该吃太多甜食！' },
        ] },
      { id: 'gs6-r1', mod: 1, kind: 'review', title: '第 1 组复习课', zh: '将来 · 讲故事 · 健康 混合闯关',
        from: ['gs6-u01', 'gs6-u02', 'gs6-u03'], count: 10 },
      { id: 'gs6-u04', mod: 2, modName: '第 2 组 · 世界与我', modEmoji: '🌍', kind: 'unit',
        title: 'Lesson 4 · Protect the Earth', zh: '保护地球',
        grammar: 'must / must not 必须',
        words: [
          { w: 'recycle', zh: '回收', e: '♻️' }, { w: 'protect', zh: '保护', e: '🛡️' },
          { w: 'pollution', zh: '污染', e: '🏭' }, { w: 'rubbish', zh: '垃圾', e: '🗑️' },
          { w: 'reusable', zh: '可重复用的', e: '🛍️' }, { w: 'save water', zh: '节约用水', e: '💧' },
        ],
        sentences: [
          { en: 'We must protect the earth. Do not drop rubbish!', zh: '我们必须保护地球。不要乱扔垃圾！' },
          { en: 'I save water and recycle paper every day.', zh: '我每天节约用水、回收纸张。' },
        ] },
      { id: 'gs6-u05', mod: 2, kind: 'unit',
        title: 'Lesson 5 · He Said...', zh: '转述句',
        grammar: 'He said... / She told me... 转述',
        words: [
          { w: 'said', zh: '说（过去）', e: '💬' }, { w: 'told', zh: '告诉（过去）', e: '🗣️' },
          { w: 'asked', zh: '问（过去）', e: '❓' }, { w: 'answered', zh: '回答（过去）', e: '💡' },
          { w: 'message', zh: '消息', e: '✉️' }, { w: 'news', zh: '新闻', e: '📰' },
        ],
        sentences: [
          { en: 'He said it was a great game!', zh: '他说那是一场精彩的比赛！' },
          { en: 'Mom told me the news this morning.', zh: '妈妈今天早上告诉了我这个消息。' },
        ] },
      { id: 'gs6-u06', mod: 2, kind: 'unit',
        title: 'Lesson 6 · My Dream', zh: '我的梦想',
        grammar: 'want to be... / believe 梦想表达',
        words: [
          { w: 'dream', zh: '梦想', e: '💭' }, { w: 'grow up', zh: '长大', e: '🌱' },
          { w: 'future', zh: '未来', e: '🛤️' }, { w: 'believe', zh: '相信', e: '🙏' },
          { w: 'practise', zh: '练习', e: '🔁' }, { w: 'proud', zh: '骄傲', e: '🏆' },
        ],
        sentences: [
          { en: 'I want to be a scientist. I believe in my dream!', zh: '我想成为科学家。我相信我的梦想！' },
          { en: 'Practise every day, and you will be proud.', zh: '每天练习，你会为自己骄傲。' },
        ] },
      { id: 'gs6-r2', mod: 2, kind: 'review', title: '第 2 组复习课 · 毕业大闯关', zh: '地球 · 转述 · 梦想 混合闯关',
        from: ['gs6-u04', 'gs6-u05', 'gs6-u06'], count: 12 },
    ]
  },
];

/* 把专栏单词注册进本地发音包索引（app.js 的 __LOCAL_AUDIO）：
   上面每个词的 audio/<词>.mp3 都已生成，本地离线直接响，不用等有道。 */
try {
  if (typeof __LOCAL_AUDIO !== 'undefined') {
    GS_LEVELS.forEach(l => l.units.forEach(u => (u.words || []).forEach(w => {
      const k = String(w.w).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
      if (k) __LOCAL_AUDIO.add(k);
    })));
  }
} catch (e) {}
