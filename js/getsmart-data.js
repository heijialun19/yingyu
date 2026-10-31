/* ============================================================
   小鸟英语乐园 · Get Smart 学堂课程数据 v1
   教材：MM Publications《Get Smart》(New Get Smart, American Edition)
        H. Q. Mitchell & Marileni Malkogianni
   结构：每册 = 若干模块(Module)，每模块 = 正课(Unit) + 复习课(Review)
   数据来源标注：sent 字段里的例句、grammar 语法点来自教材同步教研；
        kind:'review' 的复习课词库自动取自 from 指向的单元。
   ============================================================ */

/* 「正在学哪一册」跟着档案走（Store.d.gsLevel），不写死任何一个孩子。
   档案第一次用专栏时若已有学习进度，自动按进度最多的册推断一次；
   之后在课程表里用「📍 设为正在学」随时切换。 */
function gsActiveLevelId() {
  try {
    if (Store.d.gsLevel && GS_LEVELS.some(l => l.id === Store.d.gsLevel)) return Store.d.gsLevel;
    let best = null, bestN = -1;
    GS_LEVELS.forEach(l => {
      const n = l.units.filter(u => Store.d.getsmart && Store.d.getsmart[u.id]).length;
      if (n > bestN) { bestN = n; best = l.id; }
    });
    if (bestN > 0) { Store.d.gsLevel = best; Store.save(); return best; }
  } catch (e) {}
  return null;
}
function gsSetActiveLevel(lid) {
  try {
    if (GS_LEVELS.some(l => l.id === lid)) { Store.d.gsLevel = lid; Store.save(); }
  } catch (e) {}
}

/* 首页岛卡用的进度：当前档案正在学的册已完成 x/y 课 */
function gsLevelProgress() {
  try {
    const lv = GS_LEVELS.find(l => l.id === gsActiveLevelId());
    if (!lv || !lv.units.length) return '课本同步';
    const done = lv.units.filter(u => Store.d.getsmart && Store.d.getsmart[u.id]).length;
    return lv.name.replace('Get Smart ', 'GS') + ' ' + done + '/' + lv.units.length + ' 课';
  } catch (e) { return '课本同步'; }
}

/* 今日任务流状态（首页卡片 + getsmart 任务页共用）：
   ① GS 落下的课 ② 到期复习词数 ③ 今天玩过游戏没有 */
function gsFlowState() {
  try {
    const d = new Date(); const p = n => String(n).padStart(2, '0');
    const today = d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
    const due = (typeof dueWords === 'function') ? dueWords().length : 0;
    const act = (Store.d.activity || {})[today] || {};
    let gap = null;
    const lv = GS_LEVELS.find(l => l.id === gsActiveLevelId());
    if (lv) {
      const gm = Store.d.getsmart || {};
      const g = lv.units.find(u => u.kind === 'unit' && !gm[u.id]);
      gap = g ? { id: g.id, title: g.title } : null;
    }
    return { today, due, games: act.games || 0, gap };
  } catch (e) { return { today: '', due: 0, games: 0, gap: null }; }
}

const GS_LEVELS = [
  /* ============ Get Smart 1（官方 New Get Smart 1 Contents 逐字对齐） ============ */
  {
    id: 'gs1', name: 'Get Smart 1', zh: '第一册 · 官方目录对齐', emoji: '🐣', color: '#F59E0B',
    desc: '与课本逐字对齐：10 个 Module（Hello! → Places），每 Module 3-4 节小课 + 复习闯关，词汇与句型全部来自官方目录。',
    units: [
      { id: 'gs1-m01l1', mod: 1, modName: 'Module 1 · Hello! 你好', modEmoji: '👋', modTip: 'Phonics: a e i o u 元音音 · 品德: Listen when people are speaking', kind: 'unit',
        title: 'M1-L1 · Hello!', zh: '打招呼',
        words: [
          { w: 'hello', zh: '你好', e: '👋' }, { w: 'hi', zh: '嗨', e: '🙋' },
          { w: 'goodbye', zh: '再见', e: '👋' }, { w: 'bye', zh: '拜拜', e: '🫱' },
        ],
        sentences: [
          { en: "Hi! I'm April.", zh: '嗨！我是 April。' },
          { en: "What's your name? My name's John.", zh: '你叫什么名字？我叫 John。' },
        ] },
      { id: 'gs1-m01l2', mod: 1, kind: 'unit',
        title: 'M1-L2 · Numbers 1-10', zh: '数字 1-10',
        words: [
          { w: 'one', zh: '一', e: '1️⃣' }, { w: 'two', zh: '二', e: '2️⃣' }, { w: 'three', zh: '三', e: '3️⃣' },
          { w: 'four', zh: '四', e: '4️⃣' }, { w: 'five', zh: '五', e: '5️⃣' }, { w: 'six', zh: '六', e: '6️⃣' },
          { w: 'seven', zh: '七', e: '7️⃣' }, { w: 'eight', zh: '八', e: '8️⃣' }, { w: 'nine', zh: '九', e: '9️⃣' },
          { w: 'ten', zh: '十', e: '🔟' },
        ],
        sentences: [
          { en: 'I can count to ten!', zh: '我能数到十！' },
        ] },
      { id: 'gs1-m01l3', mod: 1, kind: 'unit',
        title: 'M1-L3 · A B C Words', zh: '元音启蒙词',
        words: [
          { w: 'apple', zh: '苹果', e: '🍎' }, { w: 'egg', zh: '鸡蛋', e: '🥚' },
          { w: 'insect', zh: '昆虫', e: '🐛' }, { w: 'octopus', zh: '章鱼', e: '🐙' },
          { w: 'umbrella', zh: '雨伞', e: '☂️' },
        ],
        sentences: [
          { en: 'An apple and an egg, please.', zh: '请给我一个苹果和一个鸡蛋。' },
        ] },
      { id: 'gs1-m01r', mod: 1, kind: 'review', title: 'Module 1 复习闯关', zh: '打招呼 · 数字 · 启蒙词',
        from: ['gs1-m01l1', 'gs1-m01l2', 'gs1-m01l3'], count: 8 },
      { id: 'gs1-m02l1', mod: 2, modName: 'Module 2 · School 学校', modEmoji: '🏫', modTip: 'Phonics: b bag, c cat · 品德: Ask before using others things', kind: 'unit',
        title: 'M2-L1 · Colours', zh: '颜色',
        words: [
          { w: 'red', zh: '红色', e: '🔴' }, { w: 'blue', zh: '蓝色', e: '🔵' },
          { w: 'yellow', zh: '黄色', e: '🟡' }, { w: 'green', zh: '绿色', e: '🟢' },
          { w: 'orange', zh: '橙色', e: '🟠' }, { w: 'purple', zh: '紫色', e: '🟣' },
          { w: 'white', zh: '白色', e: '⚪' }, { w: 'black', zh: '黑色', e: '⚫' },
        ],
        sentences: [
          { en: 'What color is it? Blue.', zh: '它是什么颜色？蓝色。' },
        ] },
      { id: 'gs1-m02l2', mod: 2, kind: 'unit',
        title: 'M2-L2 · Classroom Objects', zh: '教室物品',
        words: [
          { w: 'pencil', zh: '铅笔', e: '✏️' }, { w: 'eraser', zh: '橡皮', e: '🧽' },
          { w: 'book', zh: '书', e: '📖' }, { w: 'bag', zh: '书包', e: '🎒' },
          { w: 'computer', zh: '电脑', e: '💻' }, { w: 'chair', zh: '椅子', e: '💺' },
        ],
        sentences: [
          { en: "What's this? It's a pencil.", zh: '这是什么？是铅笔。' },
          { en: 'Is this a computer? Yes, it is.', zh: '这是电脑吗？是的。' },
        ] },
      { id: 'gs1-m02r', mod: 2, kind: 'review', title: 'Module 2 复习闯关', zh: '颜色 · 教室物品',
        from: ['gs1-m02l1', 'gs1-m02l2'], count: 8 },
      { id: 'gs1-m03l1', mod: 3, modName: 'Module 3 · Family and friends 家人与朋友', modEmoji: '👨‍👩‍👧', modTip: 'Phonics: d dad, dog · 品德: Never make fun of other people', kind: 'unit',
        title: 'M3-L1 · Family', zh: '家人',
        words: [
          { w: 'mom', zh: '妈妈', e: '👩' }, { w: 'dad', zh: '爸爸', e: '👨' },
          { w: 'brother', zh: '哥哥/弟弟', e: '👦' }, { w: 'sister', zh: '姐姐/妹妹', e: '👧' },
          { w: 'grandpa', zh: '爷爷', e: '👴' }, { w: 'grandma', zh: '奶奶', e: '👵' },
        ],
        sentences: [
          { en: "Who's this? It's my grandma.", zh: '这是谁？是我的奶奶。' },
          { en: 'Is this your sister? Yes, it is.', zh: '这是你妹妹吗？是的。' },
        ] },
      { id: 'gs1-m03l2', mod: 3, kind: 'unit',
        title: 'M3-L2 · Friends & Pets', zh: '朋友与宠物',
        words: [
          { w: 'teacher', zh: '老师', e: '👩‍🏫' }, { w: 'friend', zh: '朋友', e: '🤝' },
          { w: 'rabbit', zh: '兔子', e: '🐰' }, { w: 'bird', zh: '鸟', e: '🐦' },
          { w: 'fish', zh: '鱼', e: '🐟' }, { w: 'turtle', zh: '乌龟', e: '🐢' },
        ],
        sentences: [
          { en: 'How are you? I am fine, thank you.', zh: '你好吗？我很好，谢谢。' },
        ] },
      { id: 'gs1-m03r', mod: 3, kind: 'review', title: 'Module 3 复习闯关', zh: '家人 · 朋友 · 宠物',
        from: ['gs1-m03l1', 'gs1-m03l2'], count: 8 },
      { id: 'gs1-m04l1', mod: 4, modName: 'Module 4 · You and me 你和我', modEmoji: '🧒', modTip: 'Phonics: f/g · 品德: Help your friends', kind: 'unit',
        title: 'M4-L1 · Numbers 11-15', zh: '数字 11-15',
        words: [
          { w: 'eleven', zh: '十一', n: '11' }, { w: 'twelve', zh: '十二', n: '12' },
          { w: 'thirteen', zh: '十三', n: '13' }, { w: 'fourteen', zh: '十四', n: '14' },
          { w: 'fifteen', zh: '十五', n: '15' },
        ],
        sentences: [
          { en: "How old are you? I'm six.", zh: '你几岁？我六岁。' },
        ] },
      { id: 'gs1-m04l2', mod: 4, kind: 'unit',
        title: 'M4-L2 · Happy & Sad', zh: '大与小 · 开心与难过',
        words: [
          { w: 'big', zh: '大的', e: '🐘' }, { w: 'small', zh: '小的', e: '🐭' },
          { w: 'happy', zh: '开心的', e: '😊' }, { w: 'sad', zh: '难过的', e: '😢' },
          { w: 'boy', zh: '男孩', e: '👦' }, { w: 'girl', zh: '女孩', e: '👧' },
        ],
        sentences: [
          { en: 'Are you happy? Yes, I am.', zh: '你开心吗？是的。' },
          { en: "He's sad.", zh: '他很难过。' },
        ] },
      { id: 'gs1-m04r', mod: 4, kind: 'review', title: 'Module 4 复习闯关', zh: '数字 · 形容词 · 人物',
        from: ['gs1-m04l1', 'gs1-m04l2'], count: 8 },
      { id: 'gs1-m05l1', mod: 5, modName: 'Module 5 · Party time! 派对时间', modEmoji: '🎂', modTip: 'Phonics: h/w/y/z · 品德: Parties are important', kind: 'unit',
        title: 'M5-L1 · Toys', zh: '玩具',
        words: [
          { w: 'doll', zh: '玩偶', e: '🎎' }, { w: 'guitar', zh: '吉他', e: '🎸' },
          { w: 'teddy bear', zh: '泰迪熊', e: '🧸' }, { w: 'ball', zh: '球', e: '⚽' },
          { w: 'yo-yo', zh: '悠悠球', e: '🪀' },
        ],
        sentences: [
          { en: 'How many dolls? Two dolls!', zh: '几个玩偶？两个玩偶！' },
        ] },
      { id: 'gs1-m05l2', mod: 5, kind: 'unit',
        title: 'M5-L2 · Party & Colours', zh: '派对与颜色',
        words: [
          { w: 'present', zh: '礼物', e: '🎁' }, { w: 'hat', zh: '帽子', e: '🎩' },
          { w: 'candle', zh: '蜡烛', e: '🕯️' }, { w: 'cake', zh: '蛋糕', e: '🍰' },
          { w: 'pink', zh: '粉色', e: '🩷' }, { w: 'brown', zh: '棕色', e: '🟤' },
        ],
        sentences: [
          { en: 'Happy birthday, Lisa!', zh: 'Lisa 生日快乐！' },
          { en: "What are these? They're pencils.", zh: '这些是什么？是铅笔。' },
        ] },
      { id: 'gs1-m05r', mod: 5, kind: 'review', title: 'Module 5 复习闯关', zh: '玩具 · 派对 · 颜色',
        from: ['gs1-m05l1', 'gs1-m05l2'], count: 8 },
      { id: 'gs1-m06l1', mod: 6, modName: 'Module 6 · Toys and games 玩具与游戏', modEmoji: '🪁', modTip: 'Phonics: r 音词 · 品德: Put your toys away', kind: 'unit',
        title: 'M6-L1 · Actions', zh: '课堂动作',
        words: [
          { w: 'come', zh: '过来', e: '👉' }, { w: 'stand up', zh: '起立', e: '🧍' },
          { w: 'sit down', zh: '坐下', e: '🪑' }, { w: 'turn around', zh: '转个圈', e: '🔄' },
          { w: 'clap your hands', zh: '拍拍手', e: '👏' },
        ],
        sentences: [
          { en: 'Stand up! Sit down!', zh: '起立！坐下！' },
        ] },
      { id: 'gs1-m06l2', mod: 6, kind: 'unit',
        title: 'M6-L2 · Toys', zh: '交通工具玩具',
        words: [
          { w: 'car', zh: '小汽车', e: '🚗' }, { w: 'plane', zh: '飞机', e: '✈️' },
          { w: 'train', zh: '火车', e: '🚂' }, { w: 'boat', zh: '小船', e: '⛵' },
          { w: 'kite', zh: '风筝', e: '🪁' }, { w: 'bicycle', zh: '自行车', e: '🚲' },
          { w: 'blocks', zh: '积木', e: '🧱' },
        ],
        sentences: [
          { en: 'Do you have a car? Yes, I do.', zh: '你有小汽车吗？有的。' },
          { en: "I don't have a kite.", zh: '我没有风筝。' },
        ] },
      { id: 'gs1-m06r', mod: 6, kind: 'review', title: 'Module 6 复习闯关', zh: '动作 · 玩具',
        from: ['gs1-m06l1', 'gs1-m06l2'], count: 8 },
      { id: 'gs1-m07l1', mod: 7, modName: 'Module 7 · My body 我的身体', modEmoji: '🧍', modTip: 'Phonics: th thumb · 品德: Don not judge by appearance', kind: 'unit',
        title: 'M7-L1 · My Body', zh: '身体（一）',
        words: [
          { w: 'eyes', zh: '眼睛', e: '👀' }, { w: 'ears', zh: '耳朵', e: '👂' },
          { w: 'mouth', zh: '嘴巴', e: '👄' }, { w: 'nose', zh: '鼻子', e: '👃' },
          { w: 'head', zh: '头', e: '👤' }, { w: 'arms', zh: '手臂', e: '💪' }, { w: 'hands', zh: '手', e: '✋' },
        ],
        sentences: [
          { en: 'Touch your nose!', zh: '摸摸你的鼻子！' },
        ] },
      { id: 'gs1-m07l2', mod: 7, kind: 'unit',
        title: 'M7-L2 · My Body', zh: '身体（二）',
        words: [
          { w: 'legs', zh: '腿', e: '🦵' }, { w: 'feet', zh: '脚', e: '🦶' },
          { w: 'toes', zh: '脚趾', e: '🦶' }, { w: 'fingers', zh: '手指', e: '👆' },
          { w: 'long', zh: '长的', e: '📏' }, { w: 'short', zh: '短的', e: '📐' },
        ],
        sentences: [
          { en: 'I have two big feet.', zh: '我有两只大脚。' },
          { en: 'Clap your hands!', zh: '拍拍手！' },
        ] },
      { id: 'gs1-m07r', mod: 7, kind: 'review', title: 'Module 7 复习闯关', zh: '身体部位 · 动作',
        from: ['gs1-m07l1', 'gs1-m07l2'], count: 8 },
      { id: 'gs1-m08l1', mod: 8, modName: 'Module 8 · Food 食物', modEmoji: '🍇', modTip: 'Phonics: i_e kite · 品德: Listen to your elders', kind: 'unit',
        title: 'M8-L1 · Fruit', zh: '水果（一）',
        words: [
          { w: 'tomatoes', zh: '西红柿', e: '🍅' }, { w: 'grapes', zh: '葡萄', e: '🍇' },
          { w: 'mangoes', zh: '芒果', e: '🥭' }, { w: 'strawberries', zh: '草莓', e: '🍓' },
          { w: 'bananas', zh: '香蕉', e: '🍌' },
        ],
        sentences: [
          { en: 'I like apples.', zh: '我喜欢苹果。' },
        ] },
      { id: 'gs1-m08l2', mod: 8, kind: 'unit',
        title: 'M8-L2 · Fruit & Veggies', zh: '水果与蔬菜',
        words: [
          { w: 'apples', zh: '苹果', e: '🍎' }, { w: 'pears', zh: '梨', e: '🍐' },
          { w: 'oranges', zh: '橙子', e: '🍊' }, { w: 'carrots', zh: '胡萝卜', e: '🥕' },
          { w: 'celery', zh: '芹菜', e: '🥬' }, { w: 'lettuce', zh: '生菜', e: '🥗' },
        ],
        sentences: [
          { en: "I don't like bananas.", zh: '我不喜欢香蕉。' },
        ] },
      { id: 'gs1-m08l3', mod: 8, kind: 'unit',
        title: 'M8-L3 · Yummy!', zh: '更多好吃的',
        words: [
          { w: 'pizza', zh: '披萨', e: '🍕' }, { w: 'burger', zh: '汉堡', e: '🍔' },
          { w: 'pasta', zh: '意大利面', e: '🍝' }, { w: 'milk', zh: '牛奶', e: '🥛' },
          { w: 'cake', zh: '蛋糕', e: '🍰' },
        ],
        sentences: [
          { en: "What's your favorite food?", zh: '你最喜欢的食物是什么？' },
        ] },
      { id: 'gs1-m08r', mod: 8, kind: 'review', title: 'Module 8 复习闯关', zh: '食物词汇',
        from: ['gs1-m08l1', 'gs1-m08l2', 'gs1-m08l3'], count: 10 },
      { id: 'gs1-m09l1', mod: 9, modName: 'Module 9 · My house 我的家', modEmoji: '🏠', modTip: 'Phonics: o_e nose · 品德: Keep your bedroom clean and tidy', kind: 'unit',
        title: 'M9-L1 · Rooms', zh: '房间',
        words: [
          { w: 'kitchen', zh: '厨房', e: '🍳' }, { w: 'bathroom', zh: '浴室', e: '🛁' },
          { w: 'living room', zh: '客厅', e: '🛋️' }, { w: 'bedroom', zh: '卧室', e: '🛏️' },
        ],
        sentences: [
          { en: "Where's the ball? It's in the closet.", zh: '球在哪里？在衣柜里。' },
        ] },
      { id: 'gs1-m09l2', mod: 9, kind: 'unit',
        title: 'M9-L2 · Furniture', zh: '家具',
        words: [
          { w: 'bed', zh: '床', e: '🛏️' }, { w: 'closet', zh: '衣柜', e: '🚪' },
          { w: 'table', zh: '桌子', e: '🪑' }, { w: 'lamp', zh: '台灯', e: '💡' },
        ],
        sentences: [
          { en: "Where are the socks? They're on the table.", zh: '袜子在哪里？在桌子上。' },
        ] },
      { id: 'gs1-m09l3', mod: 9, kind: 'unit',
        title: 'M9-L3 · Clothes', zh: '衣服',
        words: [
          { w: 'dress', zh: '连衣裙', e: '👗' }, { w: 'shorts', zh: '短裤', e: '🩳' },
          { w: 'shirt', zh: '衬衫', e: '👔' }, { w: 'shoes', zh: '鞋子', e: '👞' },
          { w: 'socks', zh: '袜子', e: '🧦' },
        ],
        sentences: [
          { en: 'The dress is on the bed.', zh: '连衣裙在床上。' },
        ] },
      { id: 'gs1-m09r', mod: 9, kind: 'review', title: 'Module 9 复习闯关', zh: '房间 · 家具 · 衣服',
        from: ['gs1-m09l1', 'gs1-m09l2', 'gs1-m09l3'], count: 8 },
      { id: 'gs1-m10l1', mod: 10, modName: 'Module 10 · Places 场所', modEmoji: '🏪', modTip: 'Phonics: m/n · 品德: Respect wildlife', kind: 'unit',
        title: 'M10-L1 · Places', zh: '场所',
        words: [
          { w: 'bookstore', zh: '书店', e: '📚' }, { w: 'toy store', zh: '玩具店', e: '🧸' },
          { w: 'fast food restaurant', zh: '快餐店', e: '🍔' }, { w: 'pet shop', zh: '宠物店', e: '🐾' },
        ],
        sentences: [
          { en: "There's a toy store.", zh: '有一家玩具店。' },
        ] },
      { id: 'gs1-m10l2', mod: 10, kind: 'unit',
        title: 'M10-L2 · Animals', zh: '动物',
        words: [
          { w: 'bear', zh: '熊', e: '🐻' }, { w: 'crocodile', zh: '鳄鱼', e: '🐊' },
          { w: 'monkey', zh: '猴子', e: '🐵' }, { w: 'giraffe', zh: '长颈鹿', e: '🦒' },
          { w: 'hippo', zh: '河马', e: '🦛' }, { w: 'zebra', zh: '斑马', e: '🦓' },
        ],
        sentences: [
          { en: 'Where are the tigers? They are in the trees.', zh: '老虎在哪里？它们在树上。' },
        ] },
      { id: 'gs1-m10l3', mod: 10, kind: 'unit',
        title: 'M10-L3 · Numbers 20-50', zh: '数字 20-50',
        words: [
          { w: 'twenty', zh: '二十', n: '20' }, { w: 'thirty', zh: '三十', n: '30' },
          { w: 'forty', zh: '四十', n: '40' }, { w: 'fifty', zh: '五十', n: '50' },
        ],
        sentences: [
          { en: 'How many frogs are there? There are twenty frogs.', zh: '有多少只青蛙？有二十只。' },
        ] },
      { id: 'gs1-m10r', mod: 10, kind: 'review', title: 'Module 10 复习闯关 · 毕业大闯关', zh: '场所 · 动物 · 数字',
        from: ['gs1-m10l1', 'gs1-m10l2', 'gs1-m10l3'], count: 10 },
    ]
  },

  /* ============ Get Smart 2（儿子在学 · 官方目录逐字对齐） ============
     结构与内容全部来自 MM 官方 New Get Smart 2 Contents（10 个 Module），
     交叉核对旧版官方 Syllabus 与学校发的 U1-U4 词汇清单。
     每 Module 4-5 节小课：词课一节 ≤8 词，末节复习闯关。 */
  {
    id: 'gs2', name: 'Get Smart 2', zh: '第二册 · 儿子在学', emoji: '🐥', color: '#FF6B6B',
    desc: '与课本逐字对齐：10 个 Module × 4-5 节小课（官方目录 We are back! → Having fun），词课一节 5-8 个词，末节复习闯关；「U1-U4 词汇复习课」= 学校清单原样。',
    units: [
      /* ---- Module 1 · We're back!（文具 · 颜色 · 数字1-20）---- */
      { id: 'gs2-m01l1', mod: 1, modName: 'Module 1 · We are back! 开学啦', modEmoji: '🎒', modTip: 'Phonics: short a/e · 品德: Be responsible for your pet', kind: 'unit',
        title: 'M1-L1 · School things', zh: '文具（一）',
        words: [
          { w: 'bag', zh: '书包', e: '🎒' }, { w: 'book', zh: '书', e: '📖' },
          { w: 'pen', zh: '钢笔', e: '🖊️' }, { w: 'pencil', zh: '铅笔', e: '✏️' },
          { w: 'pencil case', zh: '铅笔盒', e: '🗃️' }, { w: 'chair', zh: '椅子', e: '💺' },
        ],
        sentences: [
          { en: "What's this? It's a pencil.", zh: '这是什么？是一支铅笔。' },
          { en: 'Is this a pencil? Yes, it is.', zh: '这是铅笔吗？是的。' },
        ] },
      { id: 'gs2-m01l2', mod: 1, kind: 'unit',
        title: 'M1-L2 · School things & Colours', zh: '文具（二）与颜色（一）',
        words: [
          { w: 'computer', zh: '电脑', e: '💻' }, { w: 'desk', zh: '书桌', e: '🗄️' },
          { w: 'eraser', zh: '橡皮', e: '🧽' }, { w: 'board', zh: '黑板', e: '🟩' },
          { w: 'red', zh: '红色', e: '🔴' }, { w: 'blue', zh: '蓝色', e: '🔵' }, { w: 'yellow', zh: '黄色', e: '🟡' },
        ],
        sentences: [
          { en: "What are these? They're erasers.", zh: '这些是什么？是橡皮。' },
          { en: 'It is a blue bag.', zh: '它是一个蓝色的书包。' },
        ] },
      { id: 'gs2-m01l3', mod: 1, kind: 'unit',
        title: 'M1-L3 · Colours', zh: '颜色（二）',
        words: [
          { w: 'green', zh: '绿色', e: '🟢' }, { w: 'orange', zh: '橙色', e: '🟠' },
          { w: 'purple', zh: '紫色', e: '🟣' }, { w: 'white', zh: '白色', e: '⚪' },
          { w: 'black', zh: '黑色', e: '⚫' }, { w: 'brown', zh: '棕色', e: '🟤' },
        ],
        sentences: [
          { en: 'What is this? It is a green book.', zh: '这是什么？是一本绿色的书。' },
        ] },
      { id: 'gs2-m01l4', mod: 1, kind: 'unit',
        title: 'M1-L4 · Numbers 11-20', zh: '数字 11-20',
        words: [
          { w: 'eleven', zh: '十一', e: '🔢' }, { w: 'twelve', zh: '十二', e: '🔢' },
          { w: 'thirteen', zh: '十三', e: '🔢' }, { w: 'fourteen', zh: '十四', e: '🔢' },
          { w: 'fifteen', zh: '十五', e: '🔢' }, { w: 'sixteen', zh: '十六', e: '🔢' },
          { w: 'seventeen', zh: '十七', e: '🔢' }, { w: 'eighteen', zh: '十八', e: '🔢' },
          { w: 'nineteen', zh: '十九', e: '🔢' }, { w: 'twenty', zh: '二十', e: '🔢' },
        ],
        sentences: [
          { en: 'How many pencils? Twenty pencils!', zh: '多少支铅笔？二十支！' },
        ] },
      { id: 'gs2-m01r', mod: 1, kind: 'review', title: 'Module 1 复习闯关', zh: '文具 · 颜色 · 数字 混合闯关',
        from: ['gs2-m01l1', 'gs2-m01l2', 'gs2-m01l3', 'gs2-m01l4'], count: 8 },

      /* ---- Module 2 · Home and family（家人 · 玩具 · 房间）---- */
      { id: 'gs2-m02l1', mod: 2, modName: 'Module 2 · Home and family 家与家人', modEmoji: '🏠', modTip: 'Phonics: short o/i · 品德: Help your elders', kind: 'unit',
        title: 'M2-L1 · Family', zh: '家人（一）',
        words: [
          { w: 'father', zh: '爸爸', e: '👨' }, { w: 'mother', zh: '妈妈', e: '👩' },
          { w: 'sister', zh: '姐姐/妹妹', e: '👧' }, { w: 'brother', zh: '哥哥/弟弟', e: '👦' },
          { w: 'baby', zh: '宝宝', e: '👶' },
        ],
        sentences: [
          { en: "What's that? It's my sister.", zh: '那是谁？是我的姐姐。' },
          { en: 'Is that your mother? Yes, it is.', zh: '那是你妈妈吗？是的。' },
        ] },
      { id: 'gs2-m02l2', mod: 2, kind: 'unit',
        title: 'M2-L2 · Family', zh: '家人（二）',
        words: [
          { w: 'grandfather', zh: '爷爷', e: '👴' }, { w: 'grandmother', zh: '奶奶', e: '👵' },
          { w: 'uncle', zh: '叔叔', e: '🧔' }, { w: 'aunt', zh: '阿姨', e: '👩‍🦰' },
          { w: 'cousin', zh: '表兄弟姊妹', e: '🧒' }, { w: 'friend', zh: '朋友', e: '🤝' },
        ],
        sentences: [
          { en: 'He has got a brother.', zh: '他有一个哥哥。' },
          { en: 'Is he your cousin? Yes, he is.', zh: '他是你表哥吗？是的。' },
        ] },
      { id: 'gs2-m02l3', mod: 2, kind: 'unit',
        title: 'M2-L3 · Toys', zh: '玩具',
        words: [
          { w: 'puzzle', zh: '拼图', e: '🧩' }, { w: 'board game', zh: '棋盘游戏', e: '🎲' },
          { w: 'doll', zh: '玩偶', e: '🎎' }, { w: 'teddy bear', zh: '泰迪熊', e: '🧸' },
          { w: 'closet', zh: '衣柜', e: '🚪' }, { w: 'bed', zh: '床', e: '🛏️' },
        ],
        sentences: [
          { en: "Where is the doll? It's in the closet.", zh: '玩偶在哪里？在衣柜里。' },
          { en: 'This is between the lamp and the computer.', zh: '它在家灯和电脑之间。' },
        ] },
      { id: 'gs2-m02l4', mod: 2, kind: 'unit',
        title: 'M2-L4 · Rooms', zh: '房间里',
        words: [
          { w: 'lamp', zh: '台灯', e: '💡' }, { w: 'couch', zh: '沙发', e: '🛋️' },
          { w: 'TV', zh: '电视', e: '📺' }, { w: 'window', zh: '窗户', e: '🪟' },
        ],
        sentences: [
          { en: 'The teddy bear is under the bed.', zh: '泰迪熊在床底下。' },
          { en: 'They are between the lamp and the computer.', zh: '它们在台灯和电脑之间。' },
        ] },
      { id: 'gs2-m02r', mod: 2, kind: 'review', title: 'Module 2 复习闯关', zh: '家人 · 玩具 · 房间 混合闯关',
        from: ['gs2-m02l1', 'gs2-m02l2', 'gs2-m02l3', 'gs2-m02l4'], count: 8 },

      /* ---- Module 3 · Friends（数字10-50 · 宠物 · 外貌 · 五官）---- */
      { id: 'gs2-m03l1', mod: 3, modName: 'Module 3 · Friends 朋友们', modEmoji: '👫', modTip: 'Phonics: short i/e · 品德: Love your pets even if they are different', kind: 'unit',
        title: 'M3-L1 · Numbers 10-50', zh: '数字 10-50',
        words: [
          { w: 'thirty', zh: '三十', e: '🔢' }, { w: 'forty', zh: '四十', e: '🔢' }, { w: 'fifty', zh: '五十', e: '🔢' },
        ],
        sentences: [
          { en: 'How many crayons? Thirty crayons!', zh: '多少支蜡笔？三十支！' },
        ] },
      { id: 'gs2-m03l2', mod: 3, kind: 'unit',
        title: 'M3-L2 · Hair & Pets', zh: '头发与宠物',
        words: [
          { w: 'cat', zh: '猫', e: '🐱' }, { w: 'dog', zh: '狗', e: '🐶' }, { w: 'snake', zh: '蛇', e: '🐍' },
          { w: 'curly hair', zh: '卷头发', e: '💇' }, { w: 'straight hair', zh: '直头发', e: '👩' },
          { w: 'short hair', zh: '短头发', e: '💇‍♂️' }, { w: 'long hair', zh: '长头发', e: '👩‍🦳' },
        ],
        sentences: [
          { en: 'Has she got curly hair? Yes, she has.', zh: '她是卷发吗？是的。' },
          { en: 'She has straight hair.', zh: '她是直头发。' },
        ] },
      { id: 'gs2-m03l3', mod: 3, kind: 'unit',
        title: 'M3-L3 · My Face', zh: '五官',
        words: [
          { w: 'eyes', zh: '眼睛', e: '👀' }, { w: 'ears', zh: '耳朵', e: '👂' },
          { w: 'nose', zh: '鼻子', e: '👃' }, { w: 'mouth', zh: '嘴巴', e: '👄' },
          { w: 'teeth', zh: '牙齿', e: '🦷' }, { w: 'pretty', zh: '漂亮的', e: '😊' }, { w: 'ugly', zh: '丑的', e: '🙈' },
        ],
        sentences: [
          { en: 'Does he have brown eyes? Yes, he does.', zh: '他有棕色眼睛吗？是的。' },
          { en: 'She has big eyes and small ears.', zh: '她有大眼睛和小耳朵。' },
        ] },
      { id: 'gs2-m03r', mod: 3, kind: 'review', title: 'Module 3 复习闯关', zh: '数字 · 头发 · 五官 混合闯关',
        from: ['gs2-m03l1', 'gs2-m03l2', 'gs2-m03l3'], count: 8 },

      /* ---- Module 4 · Animals（动物 · 能力）---- */
      { id: 'gs2-m04l1', mod: 4, modName: 'Module 4 · Animals 动物园', modEmoji: '🦁', modTip: 'Phonics: short o/u · 品德: Respect animals', kind: 'unit',
        title: 'M4-L1 · Animals', zh: '动物（一）',
        words: [
          { w: 'parrot', zh: '鹦鹉', e: '🦜' }, { w: 'monkey', zh: '猴子', e: '🐵' },
          { w: 'elephant', zh: '大象', e: '🐘' }, { w: 'penguin', zh: '企鹅', e: '🐧' },
          { w: 'hippo', zh: '河马', e: '🦛' }, { w: 'crocodile', zh: '鳄鱼', e: '🐊' }, { w: 'gorilla', zh: '大猩猩', e: '🦍' },
        ],
        sentences: [
          { en: 'Is it a crocodile? Yes, it is.', zh: '它是鳄鱼吗？是的。' },
        ] },
      { id: 'gs2-m04l2', mod: 4, kind: 'unit',
        title: 'M4-L2 · Animals', zh: '动物（二）',
        words: [
          { w: 'tiger', zh: '老虎', e: '🐯' }, { w: 'lion', zh: '狮子', e: '🦁' },
          { w: 'giraffe', zh: '长颈鹿', e: '🦒' }, { w: 'zebra', zh: '斑马', e: '🦓' },
          { w: 'shark', zh: '鲨鱼', e: '🦈' }, { w: 'whale', zh: '鲸鱼', e: '🐳' }, { w: 'cheetah', zh: '猎豹', e: '🐆' },
        ],
        sentences: [
          { en: 'A cheetah can run fast.', zh: '猎豹跑得很快。' },
          { en: 'An elephant can carry things.', zh: '大象能搬东西。' },
        ] },
      { id: 'gs2-m04l3', mod: 4, kind: 'unit',
        title: 'M4-L3 · Body & Actions', zh: '身体与本领（一）',
        words: [
          { w: 'head', zh: '头', e: '👤' }, { w: 'wings', zh: '翅膀', e: '🪽' },
          { w: 'leg', zh: '腿', e: '🦵' }, { w: 'tail', zh: '尾巴', e: '🦨' },
          { w: 'swim', zh: '游泳', e: '🏊' }, { w: 'jump', zh: '跳', e: '🤸' }, { w: 'run', zh: '跑', e: '🏃' },
        ],
        sentences: [
          { en: 'Its tail is long.', zh: '它的尾巴很长。' },
          { en: 'Can you swim? Yes, I can.', zh: '你会游泳吗？会的。' },
        ] },
      { id: 'gs2-m04l4', mod: 4, kind: 'unit',
        title: 'M4-L4 · Actions', zh: '本领（二）',
        words: [
          { w: 'fly', zh: '飞', e: '🕊️' }, { w: 'climb', zh: '爬', e: '🧗' },
          { w: 'talk', zh: '说话', e: '💬' }, { w: 'see', zh: '看见', e: '👁️' },
        ],
        sentences: [
          { en: 'A parrot can talk.', zh: '鹦鹉会说话。' },
          { en: "A penguin can't fly, but it can swim!", zh: '企鹅不会飞，但会游泳！' },
        ] },
      { id: 'gs2-m04r', mod: 4, kind: 'review', title: 'Module 4 复习闯关', zh: '动物 · 本领 混合闯关',
        from: ['gs2-m04l1', 'gs2-m04l2', 'gs2-m04l3', 'gs2-m04l4'], count: 8 },

      /* ---- Module 5 · My town（城镇 · 天气）---- */
      { id: 'gs2-m05l1', mod: 5, modName: 'Module 5 · My town 我的城镇', modEmoji: '🏙️', modTip: 'Phonics: th · 品德: Be prepared', kind: 'unit',
        title: 'M5-L1 · Places', zh: '城镇场所（一）',
        words: [
          { w: 'park', zh: '公园', e: '🌳' }, { w: 'school', zh: '学校', e: '🏫' },
          { w: 'toy store', zh: '玩具店', e: '🧸' }, { w: 'restaurant', zh: '餐馆', e: '🍽️' },
          { w: 'supermarket', zh: '超市', e: '🛒' },
        ],
        sentences: [
          { en: 'There is a park in my town.', zh: '我的城镇里有一个公园。' },
        ] },
      { id: 'gs2-m05l2', mod: 5, kind: 'unit',
        title: 'M5-L2 · Places', zh: '城镇场所（二）',
        words: [
          { w: 'museum', zh: '博物馆', e: '🏛️' }, { w: 'swimming pool', zh: '游泳池', e: '🏊' },
          { w: 'playground', zh: '游乐场', e: '🛝' }, { w: 'hospital', zh: '医院', e: '🏥' },
        ],
        sentences: [
          { en: "Where is the hospital? It's across from the supermarket.", zh: '医院在哪里？在超市对面。' },
        ] },
      { id: 'gs2-m05l3', mod: 5, kind: 'unit',
        title: 'M5-L3 · Weather', zh: '天气',
        words: [
          { w: 'sunny', zh: '晴朗', e: '☀️' }, { w: 'raining', zh: '下雨', e: '🌧️' },
          { w: 'snowy', zh: '下雪', e: '❄️' }, { w: 'windy', zh: '刮风', e: '🌬️' },
          { w: 'cloudy', zh: '多云', e: '☁️' }, { w: 'hot', zh: '热', e: '🥵' }, { w: 'cold', zh: '冷', e: '🥶' },
        ],
        sentences: [
          { en: "What's the weather like? It's sunny.", zh: '天气怎么样？是晴天。' },
          { en: 'It is cold today.', zh: '今天很冷。' },
        ] },
      { id: 'gs2-m05r', mod: 5, kind: 'review', title: 'Module 5 复习闯关', zh: '场所 · 天气 混合闯关',
        from: ['gs2-m05l1', 'gs2-m05l2', 'gs2-m05l3'], count: 8 },

      /* ---- Module 6 · My favorite food（食物）---- */
      { id: 'gs2-m06l1', mod: 6, modName: 'Module 6 · My favorite food 我的最爱', modEmoji: '🍎', modTip: 'Phonics: a_e/o_e · 品德: Eat healthy', kind: 'unit',
        title: 'M6-L1 · Food', zh: '食物（一）',
        words: [
          { w: 'rice', zh: '米饭', e: '🍚' }, { w: 'meat', zh: '肉', e: '🥩' },
          { w: 'chicken', zh: '鸡肉', e: '🍗' }, { w: 'cheese', zh: '奶酪', e: '🧀' },
          { w: 'tomatoes', zh: '西红柿', e: '🍅' }, { w: 'sandwiches', zh: '三明治', e: '🥪' },
        ],
        sentences: [
          { en: 'I like sandwiches.', zh: '我喜欢三明治。' },
          { en: "I don't like meat.", zh: '我不喜欢肉。' },
        ] },
      { id: 'gs2-m06l2', mod: 6, kind: 'unit',
        title: 'M6-L2 · Vegetables', zh: '蔬菜',
        words: [
          { w: 'chips', zh: '薯条', e: '🍟' }, { w: 'carrots', zh: '胡萝卜', e: '🥕' },
          { w: 'peas', zh: '豌豆', e: '🫛' }, { w: 'spaghetti', zh: '意大利面', e: '🍝' },
          { w: 'celery', zh: '芹菜', e: '🥬' }, { w: 'salad', zh: '沙拉', e: '🥗' },
        ],
        sentences: [
          { en: 'Do you like carrots? Yes, I do.', zh: '你喜欢胡萝卜吗？喜欢。' },
        ] },
      { id: 'gs2-m06l3', mod: 6, kind: 'unit',
        title: 'M6-L3 · Snacks', zh: '零食甜点',
        words: [
          { w: 'candy', zh: '糖果', e: '🍬' }, { w: 'cake', zh: '蛋糕', e: '🍰' },
          { w: 'fruit', zh: '水果', e: '🍎' }, { w: 'cereal', zh: '麦片', e: '🥣' },
          { w: 'sausages', zh: '香肠', e: '🌭' }, { w: 'biscuits', zh: '饼干', e: '🍪' },
        ],
        sentences: [
          { en: "It's good for you.", zh: '它对你有好处。' },
        ] },
      { id: 'gs2-m06l4', mod: 6, kind: 'unit',
        title: 'M6-L4 · Fruit & Meals', zh: '水果与三餐',
        words: [
          { w: 'oranges', zh: '橙子', e: '🍊' }, { w: 'pears', zh: '梨', e: '🍐' },
          { w: 'watermelon', zh: '西瓜', e: '🍉' }, { w: 'cherries', zh: '樱桃', e: '🍒' },
          { w: 'breakfast', zh: '早餐', e: '🥣' }, { w: 'lunch', zh: '午餐', e: '🍱' }, { w: 'dinner', zh: '晚餐', e: '🍛' },
        ],
        sentences: [
          { en: "What's your favorite food?", zh: '你最喜欢的食物是什么？' },
        ] },
      { id: 'gs2-m06r', mod: 6, kind: 'review', title: 'Module 6 复习闯关', zh: '食物词汇 混合闯关',
        from: ['gs2-m06l1', 'gs2-m06l2', 'gs2-m06l3', 'gs2-m06l4'], count: 10 },

      /* ---- Module 7 · On time（星期 · 时间 · 月份）---- */
      { id: 'gs2-m07l1', mod: 7, modName: 'Module 7 · On time 守时', modEmoji: '⏰', modTip: 'Phonics: ai/ay · 品德: Make friends from other countries', kind: 'unit',
        title: 'M7-L1 · Days of the Week', zh: '星期',
        words: [
          { w: 'Monday', zh: '星期一', e: '📅' }, { w: 'Tuesday', zh: '星期二', e: '📅' },
          { w: 'Wednesday', zh: '星期三', e: '📅' }, { w: 'Thursday', zh: '星期四', e: '📅' },
          { w: 'Friday', zh: '星期五', e: '📅' }, { w: 'Saturday', zh: '星期六', e: '📅' }, { w: 'Sunday', zh: '星期日', e: '📅' },
        ],
        sentences: [
          { en: "What day is it? It's Monday.", zh: '今天星期几？星期一。' },
        ] },
      { id: 'gs2-m07l2', mod: 7, kind: 'unit',
        title: 'M7-L2 · Time of Day', zh: '一天中的时间',
        words: [
          { w: 'morning', zh: '早上', e: '🌅' }, { w: 'afternoon', zh: '下午', e: '☀️' },
          { w: 'evening', zh: '傍晚', e: '🌆' }, { w: 'night', zh: '夜晚', e: '🌙' },
        ],
        sentences: [
          { en: "It's nine o'clock.", zh: '九点了。' },
        ] },
      { id: 'gs2-m07l3', mod: 7, kind: 'unit',
        title: 'M7-L3 · My Day', zh: '我的一天',
        words: [
          { w: 'get up', zh: '起床', e: '🛌' }, { w: 'go to school', zh: '去上学', e: '🎒' },
          { w: 'do homework', zh: '做作业', e: '📝' }, { w: 'go to bed', zh: '上床睡觉', e: '🛏️' },
        ],
        sentences: [
          { en: 'What time do you get up? I get up at seven o\'clock.', zh: '你几点起床？我七点起床。' },
        ] },
      { id: 'gs2-m07l4', mod: 7, kind: 'unit',
        title: 'M7-L4 · Months (1-6)', zh: '月份（1-6月）',
        words: [
          { w: 'January', zh: '一月', e: '🗓️' }, { w: 'February', zh: '二月', e: '🗓️' },
          { w: 'March', zh: '三月', e: '🗓️' }, { w: 'April', zh: '四月', e: '🗓️' },
          { w: 'May', zh: '五月', e: '🗓️' }, { w: 'June', zh: '六月', e: '🗓️' },
        ],
        sentences: [
          { en: 'February is before March.', zh: '二月在三月之前。' },
        ] },
      { id: 'gs2-m07l5', mod: 7, kind: 'unit',
        title: 'M7-L5 · Months (7-12)', zh: '月份（7-12月）',
        words: [
          { w: 'July', zh: '七月', e: '🗓️' }, { w: 'August', zh: '八月', e: '🗓️' },
          { w: 'September', zh: '九月', e: '🗓️' }, { w: 'October', zh: '十月', e: '🗓️' },
          { w: 'November', zh: '十一月', e: '🗓️' }, { w: 'December', zh: '十二月', e: '🗓️' },
        ],
        sentences: [
          { en: 'June is after May.', zh: '六月在五月之后。' },
        ] },
      { id: 'gs2-m07r', mod: 7, kind: 'review', title: 'Module 7 复习闯关', zh: '星期 · 时间 · 月份 混合闯关',
        from: ['gs2-m07l1', 'gs2-m07l2', 'gs2-m07l3', 'gs2-m07l4', 'gs2-m07l5'], count: 10 },

      /* ---- Module 8 · At work（职业）---- */
      { id: 'gs2-m08l1', mod: 8, modName: 'Module 8 · At work 职业体验', modEmoji: '👷', modTip: 'Phonics: i_e · 品德: Everybody has a special name', kind: 'unit',
        title: 'M8-L1 · Jobs', zh: '职业（一）',
        words: [
          { w: 'police officer', zh: '警察', e: '👮' }, { w: 'teacher', zh: '老师', e: '👩‍🏫' },
          { w: 'doctor', zh: '医生', e: '🩺' }, { w: 'singer', zh: '歌手', e: '🎤' },
          { w: 'dancer', zh: '舞者', e: '💃' }, { w: 'chef', zh: '厨师', e: '👨‍🍳' },
        ],
        sentences: [
          { en: 'She is a dancer.', zh: '她是一名舞者。' },
        ] },
      { id: 'gs2-m08l2', mod: 8, kind: 'unit',
        title: 'M8-L2 · Jobs', zh: '职业（二）',
        words: [
          { w: 'artist', zh: '画家', e: '🎨' }, { w: 'clown', zh: '小丑', e: '🤡' },
          { w: 'fisherman', zh: '渔夫', e: '🎣' }, { w: 'waiter', zh: '服务员', e: '🍽️' },
          { w: 'nurse', zh: '护士', e: '💉' }, { w: 'pilot', zh: '飞行员', e: '👨‍✈️' },
        ],
        sentences: [
          { en: 'Do you work in a restaurant? Yes, I do.', zh: '你在餐馆工作吗？是的。' },
        ] },
      { id: 'gs2-m08l3', mod: 8, kind: 'unit',
        title: 'M8-L3 · At Work', zh: '工作做什么',
        words: [
          { w: 'work', zh: '工作', e: '💼' }, { w: 'sing', zh: '唱歌', e: '🎤' },
          { w: 'play the piano', zh: '弹钢琴', e: '🎹' }, { w: 'fly a helicopter', zh: '开直升机', e: '🚁' },
          { w: 'Mr.', zh: '先生', e: '🕴️' }, { w: 'Mrs.', zh: '夫人', e: '👩' },
        ],
        sentences: [
          { en: 'What time does the movie start?', zh: '电影几点开始？' },
        ] },
      { id: 'gs2-m08r', mod: 8, kind: 'review', title: 'Module 8 复习闯关', zh: '职业词汇 混合闯关',
        from: ['gs2-m08l1', 'gs2-m08l2', 'gs2-m08l3'], count: 8 },

      /* ---- Module 9 · Clothes（衣服）---- */
      { id: 'gs2-m09l1', mod: 9, modName: 'Module 9 · Clothes 衣服', modEmoji: '👕', modTip: 'Phonics: a_e/br/pr · 品德: Look after your belongings', kind: 'unit',
        title: 'M9-L1 · Clothes', zh: '衣服（一）',
        words: [
          { w: 'jeans', zh: '牛仔裤', e: '👖' }, { w: 'shorts', zh: '短裤', e: '🩳' },
          { w: 'coat', zh: '外套', e: '🧥' }, { w: 'jacket', zh: '夹克', e: '🥼' },
          { w: 'skirt', zh: '短裙', e: '👗' }, { w: 'dress', zh: '连衣裙', e: '👚' },
        ],
        sentences: [
          { en: "I'm wearing a skirt.", zh: '我穿着短裙。' },
        ] },
      { id: 'gs2-m09l2', mod: 9, kind: 'unit',
        title: 'M9-L2 · Clothes', zh: '衣服（二）',
        words: [
          { w: 'socks', zh: '袜子', e: '🧦' }, { w: 'sneakers', zh: '运动鞋', e: '👟' },
          { w: 'glasses', zh: '眼镜', e: '👓' }, { w: 'T-shirt', zh: 'T恤', e: '👕' },
          { w: 'gloves', zh: '手套', e: '🧤' }, { w: 'scarf', zh: '围巾', e: '🧣' },
        ],
        sentences: [
          { en: "I'm wearing a blue coat.", zh: '我穿着蓝色外套。' },
        ] },
      { id: 'gs2-m09l3', mod: 9, kind: 'unit',
        title: 'M9-L3 · Whose is it?', zh: '这是谁的？',
        words: [
          { w: 'shirt', zh: '衬衫', e: '👔' }, { w: 'sweater', zh: '毛衣', e: '🧶' },
          { w: 'shoes', zh: '鞋子', e: '👞' }, { w: 'pants', zh: '长裤', e: '👖' },
        ],
        sentences: [
          { en: "Whose shirt is this? It's Pat's.", zh: '这是谁的衬衫？是帕特的。' },
          { en: 'Is she wearing glasses? Yes, she is.', zh: '她戴着眼镜吗？是的。' },
        ] },
      { id: 'gs2-m09r', mod: 9, kind: 'review', title: 'Module 9 复习闯关', zh: '衣服词汇 混合闯关',
        from: ['gs2-m09l1', 'gs2-m09l2', 'gs2-m09l3'], count: 8 },

      /* ---- Module 10 · Having fun（运动与游戏）---- */
      { id: 'gs2-m10l1', mod: 10, modName: 'Module 10 · Having fun 玩得开心', modEmoji: '🎡', modTip: 'Phonics: ea/oa · 品德: Play fair', kind: 'unit',
        title: 'M10-L1 · Sports & Games', zh: '运动与游戏（一）',
        words: [
          { w: 'basketball', zh: '篮球', e: '🏀' }, { w: 'soccer', zh: '足球', e: '⚽' },
          { w: 'hide and seek', zh: '捉迷藏', e: '🙈' }, { w: 'tag', zh: '贴人游戏', e: '🏃' },
          { w: 'riding a bike', zh: '骑自行车', e: '🚴' }, { w: 'jumping rope', zh: '跳绳', e: '🪢' },
        ],
        sentences: [
          { en: "He's riding a bike.", zh: '他在骑自行车。' },
        ] },
      { id: 'gs2-m10l2', mod: 10, kind: 'unit',
        title: 'M10-L2 · Sports', zh: '运动（二）',
        words: [
          { w: 'playing soccer', zh: '踢足球', e: '⚽' }, { w: 'ice skating', zh: '滑冰', e: '⛸️' },
          { w: 'skiing', zh: '滑雪', e: '🎿' }, { w: 'dancing', zh: '跳舞', e: '💃' },
          { w: 'playing volleyball', zh: '打排球', e: '🏐' }, { w: 'playing tennis', zh: '打网球', e: '🎾' },
        ],
        sentences: [
          { en: 'I like skating.', zh: '我喜欢滑冰。' },
        ] },
      { id: 'gs2-m10l3', mod: 10, kind: 'unit',
        title: 'M10-L3 · More Fun', zh: '更多乐趣',
        words: [
          { w: 'sailing', zh: '帆船', e: '⛵' }, { w: 'chasing', zh: '追逐', e: '🏃' },
          { w: 'listening to music', zh: '听音乐', e: '🎧' }, { w: 'playing computer games', zh: '玩电脑游戏', e: '🖥️' },
          { w: 'sleeping', zh: '睡觉', e: '😴' }, { w: 'tennis racket', zh: '网球拍', e: '🎾' },
        ],
        sentences: [
          { en: 'Are they playing hide and seek? Yes, they are.', zh: '他们在捉迷藏吗？是的。' },
        ] },
      { id: 'gs2-m10r', mod: 10, kind: 'review', title: 'Module 10 复习闯关', zh: '运动游戏 混合闯关',
        from: ['gs2-m10l1', 'gs2-m10l2', 'gs2-m10l3'], count: 8 },

      /* ---- 学校发的《U1-U4 词汇清单》原样 = 一节复习课的强度（家长校准） ---- */
      { id: 'gs2-rx', mod: 4, kind: 'review', title: 'U1-U4 词汇复习课', zh: '学校词汇清单 · 全部单词混合大闯关',
        from: ['gs2-m01l1', 'gs2-m01l2', 'gs2-m01l3', 'gs2-m01l4', 'gs2-m02l1', 'gs2-m02l2', 'gs2-m02l3', 'gs2-m02l4', 'gs2-m03l1', 'gs2-m03l2', 'gs2-m03l3', 'gs2-m04l1', 'gs2-m04l2', 'gs2-m04l3', 'gs2-m04l4'], count: 20 },
    ]
  },

  /* ============ Get Smart 3（官方 New Get Smart 3 Contents 逐字对齐） ============ */
  {
    id: 'gs3', name: 'Get Smart 3', zh: '第三册 · 官方目录对齐', emoji: '🐓', color: '#3B82F6',
    desc: '与课本逐字对齐：10 个 Module（Welcome! → The world around us），词汇与句型全部来自官方目录。',
    units: [
      { id: 'gs3-m01l1', mod: 1, modName: 'Module 1 · Welcome! 欢迎', modEmoji: '🎉', modTip: 'Phonics: l- blends · 品德: Don not play tricks on your friends', kind: 'unit',
        title: 'M1-L1 · Appearance', zh: '外貌',
        words: [
          { w: 'pretty', zh: '漂亮的', e: '😊' }, { w: 'ugly', zh: '丑的', e: '🙈' },
          { w: 'straight hair', zh: '直发', e: '👩' }, { w: 'curly hair', zh: '卷发', e: '💇' },
          { w: 'blond hair', zh: '金发', e: '👱' }, { w: 'purple', zh: '紫色', e: '🟣' },
        ],
        sentences: [
          { en: "What's her name? Her name is Anna.", zh: '她叫什么名字？她叫 Anna。' },
          { en: 'She has curly hair.', zh: '她是卷发。' },
        ] },
      { id: 'gs3-m01l2', mod: 1, kind: 'unit',
        title: 'M1-L2 · Numbers 10-100', zh: '数字 10-100',
        words: [
          { w: 'thirty', zh: '三十', n: '30' }, { w: 'forty', zh: '四十', n: '40' },
          { w: 'fifty', zh: '五十', n: '50' }, { w: 'sixty', zh: '六十', n: '60' },
          { w: 'seventy', zh: '七十', n: '70' }, { w: 'eighty', zh: '八十', n: '80' },
          { w: 'ninety', zh: '九十', n: '90' }, { w: 'hundred', zh: '一百', n: '100' },
        ],
        sentences: [
          { en: 'Do you have twenty shells? Yes, I do.', zh: '你有二十个贝壳吗？是的。' },
        ] },
      { id: 'gs3-m01l3', mod: 1, kind: 'unit',
        title: 'M1-L3 · Can You?', zh: '本领与时间',
        words: [
          { w: 'do karate', zh: '练空手道', e: '🥋' }, { w: 'dive', zh: '跳水', e: '🤿' },
          { w: 'paint', zh: '画画', e: '🎨' }, { w: 'shells', zh: '贝壳', e: '🐚' },
        ],
        sentences: [
          { en: "He can't paint, but he can do karate.", zh: '他不会画画，但会练空手道。' },
          { en: "What time is it? It's three thirty.", zh: '几点了？三点半。' },
        ] },
      { id: 'gs3-m01r', mod: 1, kind: 'review', title: 'Module 1 复习闯关', zh: '外貌 · 数字 · 本领',
        from: ['gs3-m01l1', 'gs3-m01l2', 'gs3-m01l3'], count: 8 },
      { id: 'gs3-m02l1', mod: 2, modName: 'Module 2 · Every day 每一天', modEmoji: '🗓️', modTip: 'Phonics: r- blends · 品德: Every job is important', kind: 'unit',
        title: 'M2-L1 · Every Day', zh: '日常活动',
        words: [
          { w: 'do my homework', zh: '做作业', e: '📝' }, { w: 'brush my teeth', zh: '刷牙', e: '🪥' },
          { w: 'take a shower', zh: '洗澡', e: '🚿' }, { w: 'get dressed', zh: '穿衣服', e: '👔' },
          { w: 'comb my hair', zh: '梳头', e: '💇' }, { w: 'take the bus', zh: '乘公交', e: '🚌' },
        ],
        sentences: [
          { en: 'I always walk to school.', zh: '我总是走路去学校。' },
          { en: 'Does she take the bus to school? Yes, she does.', zh: '她坐公交上学吗？是的。' },
        ] },
      { id: 'gs3-m02l2', mod: 2, kind: 'unit',
        title: 'M2-L2 · Jobs', zh: '职业',
        words: [
          { w: 'firefighter', zh: '消防员', e: '🧑‍🚒' }, { w: 'lifeguard', zh: '救生员', e: '🛟' },
          { w: 'dentist', zh: '牙医', e: '🦷' }, { w: 'pilot', zh: '飞行员', e: '👨‍✈️' },
          { w: 'farmer', zh: '农民', e: '🧑‍🌾' }, { w: 'photographer', zh: '摄影师', e: '📷' },
        ],
        sentences: [
          { en: "What do you do? I'm a dentist.", zh: '你是做什么的？我是牙医。' },
          { en: 'A firefighter can put out fires.', zh: '消防员会灭火。' },
        ] },
      { id: 'gs3-m02r', mod: 2, kind: 'review', title: 'Module 2 复习闯关', zh: '日常 · 职业',
        from: ['gs3-m02l1', 'gs3-m02l2'], count: 8 },
      { id: 'gs3-m03l1', mod: 3, modName: 'Module 3 · Right now 正在进行', modEmoji: '🏃', modTip: 'Phonics: s- blends · 品德: Don not make hasty judgments', kind: 'unit',
        title: 'M3-L1 · Sports', zh: '正在运动',
        words: [
          { w: 'playing the guitar', zh: '弹吉他', e: '🎸' }, { w: 'playing volleyball', zh: '打排球', e: '🏐' },
          { w: 'playing tennis', zh: '打网球', e: '🎾' }, { w: 'playing baseball', zh: '打棒球', e: '⚾' },
          { w: 'doing gymnastics', zh: '做体操', e: '🤸' }, { w: 'skateboarding', zh: '玩滑板', e: '🛹' },
        ],
        sentences: [
          { en: "What are you doing? I'm playing the guitar.", zh: '你在做什么？我在弹吉他。' },
          { en: 'Is she doing gymnastics? Yes, she is.', zh: '她在做体操吗？是的。' },
        ] },
      { id: 'gs3-m03l2', mod: 3, kind: 'unit',
        title: 'M3-L2 · Chores', zh: '正在做家务',
        words: [
          { w: 'making a cake', zh: '做蛋糕', e: '🎂' }, { w: 'washing the dishes', zh: '洗碗', e: '🧼' },
          { w: 'watering the plants', zh: '浇花', e: '🪴' }, { w: 'making the bed', zh: '铺床', e: '🛏️' },
          { w: 'cleaning', zh: '打扫', e: '🧹' }, { w: 'bat', zh: '球棒', e: '🏏' },
        ],
        sentences: [
          { en: "What is he doing? He's washing the dishes.", zh: '他在做什么？他在洗碗。' },
          { en: "Are they making a cake? No, they aren't.", zh: '他们在做蛋糕吗？没有。' },
        ] },
      { id: 'gs3-m03r', mod: 3, kind: 'review', title: 'Module 3 复习闯关', zh: '正在进行时',
        from: ['gs3-m03l1', 'gs3-m03l2'], count: 8 },
      { id: 'gs3-m04l1', mod: 4, modName: 'Module 4 · Year in, year out 四季与天气', modEmoji: '🍂', modTip: 'Phonics: sh/ch/tch · 品德: Each season has its own beauty', kind: 'unit',
        title: 'M4-L1 · Seasons', zh: '四季与冷暖',
        words: [
          { w: 'spring', zh: '春天', e: '🌸' }, { w: 'summer', zh: '夏天', e: '🌞' },
          { w: 'fall', zh: '秋天', e: '🍂' }, { w: 'winter', zh: '冬天', e: '⛄' },
          { w: 'warm', zh: '温暖', e: '🌤️' }, { w: 'cool', zh: '凉爽', e: '🍃' },
        ],
        sentences: [
          { en: "What's your favorite season? My favorite season is spring.", zh: '你最喜欢哪个季节？春天。' },
        ] },
      { id: 'gs3-m04l2', mod: 4, kind: 'unit',
        title: 'M4-L2 · Weather & Go!', zh: '天气与去玩',
        words: [
          { w: 'snowing', zh: '下雪', e: '❄️' }, { w: 'windy', zh: '刮风', e: '🌬️' },
          { w: 'go windsurfing', zh: '玩帆板', e: '🏄' }, { w: 'go skiing', zh: '滑雪', e: '🎿' },
          { w: 'go sailing', zh: '玩帆船', e: '⛵' }, { w: 'boots', zh: '靴子', e: '🥾' },
        ],
        sentences: [
          { en: 'He goes skiing in the winter.', zh: '他冬天去滑雪。' },
          { en: "When's your birthday? It's in March.", zh: '你生日是什么时候？三月。' },
        ] },
      { id: 'gs3-m04r', mod: 4, kind: 'review', title: 'Module 4 复习闯关', zh: '四季 · 天气 · 去玩',
        from: ['gs3-m04l1', 'gs3-m04l2'], count: 8 },
      { id: 'gs3-m05l1', mod: 5, modName: 'Module 5 · My new house 我的新家', modEmoji: '🏠', modTip: 'Phonics: th · 品德: Pick up your things after playtime', kind: 'unit',
        title: 'M5-L1 · The House', zh: '房子结构',
        words: [
          { w: 'door', zh: '门', e: '🚪' }, { w: 'floor', zh: '地板', e: '🟫' },
          { w: 'upstairs', zh: '楼上', e: '⬆️' }, { w: 'downstairs', zh: '楼下', e: '⬇️' },
          { w: 'dining room', zh: '饭厅', e: '🍽️' }, { w: 'yard', zh: '院子', e: '🏡' }, { w: 'wall', zh: '墙', e: '🧱' },
        ],
        sentences: [
          { en: "Where's the cat? It's behind the door.", zh: '猫在哪里？在门后面。' },
        ] },
      { id: 'gs3-m05l2', mod: 5, kind: 'unit',
        title: 'M5-L2 · Furniture', zh: '家具',
        words: [
          { w: 'armchair', zh: '扶手椅', e: '🪑' }, { w: 'bookcase', zh: '书柜', e: '📚' },
          { w: 'cupboard', zh: '橱柜', e: '🗄️' }, { w: 'refrigerator', zh: '冰箱', e: '🧊' },
          { w: 'clock', zh: '钟', e: '🕰️' }, { w: 'mirror', zh: '镜子', e: '🪞' }, { w: 'painting', zh: '画作', e: '🖼️' },
        ],
        sentences: [
          { en: 'There is one big room.', zh: '有一个大房间。' },
          { en: "Whose coat is this? It's mine.", zh: '这是谁的外套？是我的。' },
        ] },
      { id: 'gs3-m05l3', mod: 5, kind: 'unit',
        title: 'M5-L3 · In Front Of', zh: '方位与拖鞋',
        words: [
          { w: 'in front of', zh: '在…前面', e: '🔀' }, { w: 'behind', zh: '在…后面', e: '🔙' },
          { w: 'slippers', zh: '拖鞋', e: '🥿' }, { w: 'cushion', zh: '靠垫', e: '🛋️' },
        ],
        sentences: [
          { en: "Where are the toys? They're in front of the closet.", zh: '玩具在哪里？在衣柜前面。' },
        ] },
      { id: 'gs3-m05r', mod: 5, kind: 'review', title: 'Module 5 复习闯关', zh: '房子 · 家具 · 方位',
        from: ['gs3-m05l1', 'gs3-m05l2', 'gs3-m05l3'], count: 8 },
      { id: 'gs3-m06l1', mod: 6, modName: 'Module 6 · Food, please! 食物请上桌', modEmoji: '🍕', modTip: 'Phonics: 复数 -s 发音 · 品德: Practice makes perfect', kind: 'unit',
        title: 'M6-L1 · Food', zh: '食物（一）',
        words: [
          { w: 'onions', zh: '洋葱', e: '🧅' }, { w: 'lettuce', zh: '生菜', e: '🥬' },
          { w: 'chocolate', zh: '巧克力', e: '🍫' }, { w: 'cookies', zh: '曲奇', e: '🍪' },
          { w: 'sugar', zh: '糖', e: '🍬' }, { w: 'flour', zh: '面粉', e: '🌾' },
        ],
        sentences: [
          { en: "There's some milk.", zh: '有一些牛奶。' },
          { en: 'Is there any cheese? Yes, there is.', zh: '有奶酪吗？有的。' },
        ] },
      { id: 'gs3-m06l2', mod: 6, kind: 'unit',
        title: 'M6-L2 · Food', zh: '食物（二）',
        words: [
          { w: 'omelette', zh: '煎蛋卷', e: '🍳' }, { w: 'peas', zh: '豌豆', e: '🫛' },
          { w: 'pancake', zh: '薄煎饼', e: '🥞' }, { w: 'pineapple', zh: '菠萝', e: '🍍' },
          { w: 'peppers', zh: '彩椒', e: '🫑' }, { w: 'coconut', zh: '椰子', e: '🥥' },
        ],
        sentences: [
          { en: "Are there any peppers? No, there aren't any peppers.", zh: '有彩椒吗？没有。' },
        ] },
      { id: 'gs3-m06l3', mod: 6, kind: 'unit',
        title: 'M6-L3 · At the Restaurant', zh: '餐厅点餐',
        words: [
          { w: 'noodles', zh: '面条', e: '🍜' }, { w: 'soup', zh: '汤', e: '🍲' },
          { w: 'sausages', zh: '香肠', e: '🌭' }, { w: 'hot dog', zh: '热狗', e: '🌭' },
          { w: 'lemonade', zh: '柠檬水', e: '🍋' }, { w: 'watermelon', zh: '西瓜', e: '🍉' }, { w: 'dessert', zh: '甜点', e: '🍮' },
        ],
        sentences: [
          { en: "What would you like to drink? I'd like some water, please.", zh: '你想喝什么？请给我水。' },
          { en: 'Noodles come from China.', zh: '面条来自中国。' },
        ] },
      { id: 'gs3-m06r', mod: 6, kind: 'review', title: 'Module 6 复习闯关', zh: '食物 · 点餐',
        from: ['gs3-m06l1', 'gs3-m06l2', 'gs3-m06l3'], count: 10 },
      { id: 'gs3-m07l1', mod: 7, modName: 'Module 7 · Out and about 外出走一走', modEmoji: '🧭', modTip: 'Phonics: 复数 -es · 品德: Stay together, play together', kind: 'unit',
        title: 'M7-L1 · Directions', zh: '方向',
        words: [
          { w: 'turn right', zh: '右转', e: '➡️' }, { w: 'turn left', zh: '左转', e: '⬅️' },
          { w: 'go straight', zh: '直走', e: '⬆️' }, { w: 'cross the street', zh: '过马路', e: '🚸' },
          { w: 'stop', zh: '停', e: '🛑' },
        ],
        sentences: [
          { en: "What time is it? It's a quarter to three.", zh: '几点了？差一刻三点。' },
        ] },
      { id: 'gs3-m07l2', mod: 7, kind: 'unit',
        title: 'M7-L2 · Farm Animals', zh: '农场动物',
        words: [
          { w: 'duck', zh: '鸭子', e: '🦆' }, { w: 'horse', zh: '马', e: '🐎' },
          { w: 'sheep', zh: '羊', e: '🐑' }, { w: 'goat', zh: '山羊', e: '🐐' },
          { w: 'cow', zh: '牛', e: '🐄' }, { w: 'wolf', zh: '狼', e: '🐺' }, { w: 'mice', zh: '老鼠（复数）', e: '🐭' },
        ],
        sentences: [
          { en: 'Be quiet!', zh: '保持安静！' },
          { en: "Don't take pictures.", zh: '不要拍照。' },
        ] },
      { id: 'gs3-m07l3', mod: 7, kind: 'unit',
        title: 'M7-L3 · Places', zh: '场所与规则',
        words: [
          { w: 'library', zh: '图书馆', e: '📚' }, { w: 'museum', zh: '博物馆', e: '🏛️' },
          { w: 'swimming pool', zh: '游泳池', e: '🏊' }, { w: 'trash can', zh: '垃圾桶', e: '🗑️' },
        ],
        sentences: [
          { en: 'Throw trash in the trash can.', zh: '把垃圾扔进垃圾桶。' },
        ] },
      { id: 'gs3-m07r', mod: 7, kind: 'review', title: 'Module 7 复习闯关', zh: '方向 · 动物 · 规则',
        from: ['gs3-m07l1', 'gs3-m07l2', 'gs3-m07l3'], count: 8 },
      { id: 'gs3-m08l1', mod: 8, modName: 'Module 8 · Where were you yesterday? 昨天你在哪', modEmoji: '🕰️', modTip: 'Phonics: ck/nk/ng · 品德: Share your experiences', kind: 'unit',
        title: 'M8-L1 · Places to Go', zh: '去过的地方',
        words: [
          { w: 'mall', zh: '商场', e: '🛍️' }, { w: 'theater', zh: '剧院', e: '🎭' },
          { w: 'amusement park', zh: '游乐园', e: '🎡' }, { w: 'circus', zh: '马戏团', e: '🎪' },
          { w: 'popcorn', zh: '爆米花', e: '🍿' },
        ],
        sentences: [
          { en: 'Where were you yesterday? I was at the mall.', zh: '你昨天在哪里？我在商场。' },
        ] },
      { id: 'gs3-m08l2', mod: 8, kind: 'unit',
        title: 'M8-L2 · Feelings', zh: '感受形容词',
        words: [
          { w: 'scary', zh: '吓人的', e: '👻' }, { w: 'funny', zh: '好笑的', e: '😄' },
          { w: 'boring', zh: '无聊的', e: '🥱' }, { w: 'delicious', zh: '美味的', e: '😋' },
          { w: 'noisy', zh: '吵的', e: '📢' }, { w: 'interesting', zh: '有趣的', e: '🤩' },
        ],
        sentences: [
          { en: 'Was the movie good? Yes, it was.', zh: '电影好看吗？好看。' },
          { en: 'There was a theater near my home.', zh: '我家附近曾有一个剧院。' },
        ] },
      { id: 'gs3-m08r', mod: 8, kind: 'review', title: 'Module 8 复习闯关', zh: '场所 · 感受 · 过去',
        from: ['gs3-m08l1', 'gs3-m08l2'], count: 8 },
      { id: 'gs3-m09l1', mod: 9, modName: 'Module 9 · On vacation 假期', modEmoji: '🏖️', modTip: 'Phonics: nd/nt · 品德: Be helpful and caring', kind: 'unit',
        title: 'M9-L1 · Vacation Fun', zh: '假期活动',
        words: [
          { w: 'pack', zh: '收拾行李', e: '🧳' }, { w: 'pick flowers', zh: '摘花', e: '🌷' },
          { w: 'make a fire', zh: '生火', e: '🔥' }, { w: 'catch fish', zh: '钓鱼', e: '🎣' },
          { w: 'buy postcards', zh: '买明信片', e: '📮' }, { w: 'look at the stars', zh: '看星星', e: '🌟' },
        ],
        sentences: [
          { en: 'We packed our bags.', zh: '我们收拾好了行李。' },
          { en: 'What did you do on the weekend? I went to the forest.', zh: '你周末做了什么？我去了森林。' },
        ] },
      { id: 'gs3-m09l2', mod: 9, kind: 'unit',
        title: 'M9-L2 · Island Days', zh: '海岛时光',
        words: [
          { w: 'island', zh: '岛', e: '🏝️' }, { w: 'ocean', zh: '海洋', e: '🌊' },
          { w: 'forest', zh: '森林', e: '🌲' }, { w: 'river', zh: '河', e: '🏞️' },
          { w: 'boat', zh: '小船', e: '⛵' }, { w: 'open', zh: '开的', e: '🔓' }, { w: 'closed', zh: '关的', e: '🔒' },
        ],
        sentences: [
          { en: 'Did you watch TV? Yes, I did.', zh: '你看电视了吗？看了。' },
          { en: "He didn't swim.", zh: '他没有游泳。' },
        ] },
      { id: 'gs3-m09r', mod: 9, kind: 'review', title: 'Module 9 复习闯关', zh: '假期 · 过去时',
        from: ['gs3-m09l1', 'gs3-m09l2'], count: 8 },
      { id: 'gs3-m10l1', mod: 10, modName: 'Module 10 · The world around us 我们的世界', modEmoji: '🌍', modTip: 'Phonics: ph/wh · 品德: Believe in yourself', kind: 'unit',
        title: 'M10-L1 · Animals', zh: '动物之最',
        words: [
          { w: 'cheetah', zh: '猎豹', e: '🐆' }, { w: 'rat', zh: '老鼠', e: '🐀' },
          { w: 'whale', zh: '鲸鱼', e: '🐳' }, { w: 'dolphin', zh: '海豚', e: '🐬' },
          { w: 'shark', zh: '鲨鱼', e: '🦈' },
        ],
        sentences: [
          { en: 'Tigers are stronger than lions.', zh: '老虎比狮子强壮。' },
        ] },
      { id: 'gs3-m10l2', mod: 10, kind: 'unit',
        title: 'M10-L2 · Compare!', zh: '比较级',
        words: [
          { w: 'strong', zh: '强壮', e: '💪' }, { w: 'fast', zh: '快', e: '⚡' },
          { w: 'angry', zh: '生气', e: '😠' }, { w: 'close', zh: '近', e: '📍' },
          { w: 'far', zh: '远', e: '🛣️' }, { w: 'young', zh: '年轻', e: '🐣' }, { w: 'old', zh: '老', e: '👴' },
        ],
        sentences: [
          { en: 'Which is the hottest planet? Venus is the hottest planet.', zh: '哪个行星最热？金星最热。' },
        ] },
      { id: 'gs3-m10l3', mod: 10, kind: 'unit',
        title: 'M10-L3 · Space', zh: '太空',
        words: [
          { w: 'planet', zh: '行星', e: '🪐' }, { w: 'science', zh: '科学', e: '🔬' },
          { w: 'around', zh: '环绕', e: '🔄' },
        ],
        sentences: [
          { en: 'The planets go around the sun.', zh: '行星绕着太阳转。' },
        ] },
      { id: 'gs3-m10r', mod: 10, kind: 'review', title: 'Module 10 复习闯关 · 毕业大闯关', zh: '动物 · 比较 · 太空',
        from: ['gs3-m10l1', 'gs3-m10l2', 'gs3-m10l3'], count: 10 },
    ]
  },

  /* ============ Get Smart 4（官方 New Get Smart 4 Contents 逐字对齐） ============ */
  {
    id: 'gs4', name: 'Get Smart 4', zh: '第四册 · 官方目录对齐', emoji: '🦅', color: '#8B5CF6',
    desc: '与课本逐字对齐：10 个 Module（Where are you from? → What is the matter?），词汇与句型全部来自官方目录。',
    units: [
      { id: 'gs4-m01l1', mod: 1, modName: 'Module 1 · Where are you from? 你来自哪', modEmoji: '🌍', modTip: 'Phonics: 三单 -s 发音 · 品德: 尊重各国生活方式', kind: 'unit',
        title: 'M1-L1 · Countries', zh: '国家与国籍',
        words: [
          { w: 'American', zh: '美国人', e: '🇺🇸' }, { w: 'English', zh: '英国人', e: '🇬🇧' },
          { w: 'Mexican', zh: '墨西哥人', e: '🇲🇽' }, { w: 'Brazilian', zh: '巴西人', e: '🇧🇷' },
          { w: 'Korean', zh: '韩国人', e: '🇰🇷' }, { w: 'Chinese', zh: '中国人', e: '🇨🇳' },
        ],
        sentences: [
          { en: "Where are you from? I'm from Mexico. I'm Mexican.", zh: '你来自哪里？我来自墨西哥，我是墨西哥人。' },
          { en: 'He sometimes plays chess.', zh: '他有时候下棋。' },
        ] },
      { id: 'gs4-m01l2', mod: 1, kind: 'unit',
        title: 'M1-L2 · Free Time', zh: '课余活动',
        words: [
          { w: 'ice-skate', zh: '滑冰', e: '⛸️' }, { w: 'play chess', zh: '下国际象棋', e: '♟️' },
          { w: 'football', zh: '美式橄榄球', e: '🏈' }, { w: 'ice-skating rink', zh: '溜冰场', e: '🧊' },
          { w: 'always', zh: '总是', e: '💯' }, { w: 'usually', zh: '通常', e: '👍' },
          { w: 'sometimes', zh: '有时候', e: '🤔' }, { w: 'never', zh: '从不', e: '🚫' },
        ],
        sentences: [
          { en: 'I always skate before dinner.', zh: '我总是在晚饭前滑冰。' },
        ] },
      { id: 'gs4-m01r', mod: 1, kind: 'review', title: 'Module 1 复习闯关', zh: '国籍 · 课余活动',
        from: ['gs4-m01l1', 'gs4-m01l2'], count: 8 },
      { id: 'gs4-m02l1', mod: 2, modName: 'Module 2 · My week 我的一周', modEmoji: '📅', modTip: 'Phonics: 三单 -es · 品德: Believe in your dream', kind: 'unit',
        title: 'M2-L1 · Subjects', zh: '学校课程',
        words: [
          { w: 'Art', zh: '美术', e: '🎨' }, { w: 'Music', zh: '音乐', e: '🎼' },
          { w: 'Gym', zh: '体育', e: '🤾' }, { w: 'Math', zh: '数学', e: '➗' },
          { w: 'Science', zh: '科学', e: '🔬' }, { w: 'Social Studies', zh: '社会课', e: '🗺️' },
          { w: 'writing', zh: '写作', e: '✍️' },
        ],
        sentences: [
          { en: "What's your favorite subject?", zh: '你最喜欢的科目是什么？' },
          { en: 'How often do you have Gym? Twice a week.', zh: '你们几节体育课？每周两次。' },
        ] },
      { id: 'gs4-m02l2', mod: 2, kind: 'unit',
        title: 'M2-L2 · Chores', zh: '家务活',
        words: [
          { w: 'set the table', zh: '摆餐具', e: '🍽️' }, { w: 'clear the table', zh: '收桌子', e: '🧹' },
          { w: 'take out the trash', zh: '倒垃圾', e: '🗑️' }, { w: 'rake leaves', zh: '耙叶子', e: '🍂' },
          { w: 'shovel snow', zh: '铲雪', e: '❄️' }, { w: 'feed the dog', zh: '喂狗', e: '🐕' },
          { w: 'wash the car', zh: '洗车', e: '🚙' },
        ],
        sentences: [
          { en: 'I have to rake leaves.', zh: '我得去耙叶子。' },
          { en: 'She has to go shopping.', zh: '她得去买东西。' },
        ] },
      { id: 'gs4-m02r', mod: 2, kind: 'review', title: 'Module 2 复习闯关', zh: '课程 · 家务',
        from: ['gs4-m02l1', 'gs4-m02l2'], count: 8 },
      { id: 'gs4-m03l1', mod: 3, modName: 'Module 3 · In the past 回到过去', modEmoji: '🏺', modTip: 'Phonics: aw/au · 品德: 保护文物', kind: 'unit',
        title: 'M3-L1 · Egypt', zh: '古埃及',
        words: [
          { w: 'mummy', zh: '木乃伊', e: '🧟' }, { w: 'pyramid', zh: '金字塔', e: '🔺' },
          { w: 'treasure', zh: '财宝', e: '💰' }, { w: 'gold', zh: '黄金', e: '🥇' },
          { w: 'tomb', zh: '陵墓', e: '⚱️' }, { w: 'desert', zh: '沙漠', e: '🏜️' },
          { w: 'bandages', zh: '绷带', e: '🩹' },
        ],
        sentences: [
          { en: 'His name was Tutankhamun.', zh: '他的名字叫图坦卡蒙。' },
        ] },
      { id: 'gs4-m03l2', mod: 3, kind: 'unit',
        title: 'M3-L2 · Body & Verbs', zh: '身体与动作',
        words: [
          { w: 'stomach', zh: '胃', e: '🫃' }, { w: 'brain', zh: '大脑', e: '🧠' },
          { w: 'die', zh: '死亡', e: '💀' }, { w: 'bite', zh: '咬', e: '🦟' },
          { w: 'wake up', zh: '醒来', e: '⏰' }, { w: 'wrap', zh: '包裹', e: '🎁' },
          { w: 'dry', zh: '晾干', e: '☀️' },
        ],
        sentences: [
          { en: 'Did you wake up at ten oclock? Yes, I did.', zh: '你十点醒的吗？是的。' },
          { en: 'How did he die? A snake bit him.', zh: '他怎么死的？被蛇咬了。' },
        ] },
      { id: 'gs4-m03l3', mod: 3, kind: 'unit',
        title: 'M3-L3 · Desert Life', zh: '沙漠与生活',
        words: [
          { w: 'camel', zh: '骆驼', e: '🐫' }, { w: 'hump', zh: '驼峰', e: '🐫' },
          { w: 'mosquito', zh: '蚊子', e: '🦟' }, { w: 'wig', zh: '假发', e: '💇' },
          { w: 'teach', zh: '教', e: '👩‍🏫' }, { w: 'draw', zh: '画', e: '🖍️' },
        ],
        sentences: [
          { en: 'The camel has a hump.', zh: '骆驼有驼峰。' },
        ] },
      { id: 'gs4-m03r', mod: 3, kind: 'review', title: 'Module 3 复习闯关', zh: '古埃及 · 过去时',
        from: ['gs4-m03l1', 'gs4-m03l2', 'gs4-m03l3'], count: 8 },
      { id: 'gs4-m04l1', mod: 4, modName: 'Module 4 · Celebrations 节日庆典', modEmoji: '🎃', modTip: 'Phonics: oi/oy · 品德: Always do the right thing', kind: 'unit',
        title: 'M4-L1 · Dress Up', zh: '装扮起来',
        words: [
          { w: 'dress up as', zh: '装扮成', e: '🎭' }, { w: 'go trick-or-treating', zh: '挨家要糖果', e: '🍬' },
          { w: 'witch', zh: '女巫', e: '🧙' }, { w: 'pirate', zh: '海盗', e: '🏴‍☠️' },
          { w: 'ghost', zh: '鬼怪', e: '👻' }, { w: 'costume', zh: '戏服', e: '👘' },
          { w: 'fireworks', zh: '烟火', e: '🎆' },
        ],
        sentences: [
          { en: "What are you going to dress up as? I'm going to dress up as a ghost.", zh: '你要装扮成什么？我要装扮成幽灵。' },
        ] },
      { id: 'gs4-m04l2', mod: 4, kind: 'unit',
        title: 'M4-L2 · Celebrations', zh: '庆典与日期',
        words: [
          { w: 'decorate', zh: '装饰', e: '🎊' }, { w: 'stay up', zh: '熬夜', e: '🌙' },
          { w: 'pumpkin pie', zh: '南瓜派', e: '🥧' }, { w: 'turkey', zh: '火鸡', e: '🦃' },
          { w: 'first', zh: '第一', e: '🥇' }, { w: 'second', zh: '第二', e: '🥈' },
          { w: 'third', zh: '第三', e: '🥉' },
        ],
        sentences: [
          { en: "When's your birthday? It's on January fifth.", zh: '你的生日是什么时候？一月五日。' },
        ] },
      { id: 'gs4-m04r', mod: 4, kind: 'review', title: 'Module 4 复习闯关', zh: '节日 · 序数词 · 将来计划',
        from: ['gs4-m04l1', 'gs4-m04l2'], count: 8 },
      { id: 'gs4-m05l1', mod: 5, modName: 'Module 5 · Eating right 健康饮食', modEmoji: '🥗', modTip: 'Phonics: ow/ou · 品德: 写健康日志', kind: 'unit',
        title: 'M5-L1 · How Much?', zh: '食物容器',
        words: [
          { w: 'a bag of chips', zh: '一袋薯片', e: '🍟' }, { w: 'a carton of milk', zh: '一盒牛奶', e: '🥛' },
          { w: 'a piece of cake', zh: '一块蛋糕', e: '🍰' }, { w: 'a box of cereal', zh: '一盒麦片', e: '🥣' },
          { w: 'a bottle of water', zh: '一瓶水', e: '💧' }, { w: 'a cup of tea', zh: '一杯茶', e: '🍵' },
          { w: 'a bar of chocolate', zh: '一板巧克力', e: '🍫' }, { w: 'a glass of milk', zh: '一杯牛奶', e: '🥛' },
        ],
        sentences: [
          { en: 'We need some eggs, some milk, and some cheese.', zh: '我们需要一些鸡蛋、牛奶和奶酪。' },
        ] },
      { id: 'gs4-m05l2', mod: 5, kind: 'unit',
        title: 'M5-L2 · Fruit & Tableware', zh: '水果与餐具',
        words: [
          { w: 'pear', zh: '梨', e: '🍐' }, { w: 'peach', zh: '桃', e: '🍑' },
          { w: 'kiwi', zh: '猕猴桃', e: '🥝' }, { w: 'butter', zh: '黄油', e: '🧈' },
          { w: 'bowl', zh: '碗', e: '🥣' }, { w: 'spoon', zh: '勺子', e: '🥄' },
          { w: 'knife', zh: '刀', e: '🔪' },
        ],
        sentences: [
          { en: "Do you have any cereal? There isn't any juice.", zh: '你有麦片吗？没有果汁了。' },
          { en: 'How much water do you drink every day?', zh: '你每天喝多少水？' },
        ] },
      { id: 'gs4-m05r', mod: 5, kind: 'review', title: 'Module 5 复习闯关', zh: '容器 · 水果 · 餐具',
        from: ['gs4-m05l1', 'gs4-m05l2'], count: 8 },
      { id: 'gs4-m06l1', mod: 6, modName: 'Module 6 · Getting around 出行', modEmoji: '🚌', modTip: 'Phonics: ow 两种音 · 品德: 交通安全第一', kind: 'unit',
        title: 'M6-L1 · On the Road', zh: '路上安全',
        words: [
          { w: 'fasten your seatbelt', zh: '系安全带', e: '🚗' }, { w: 'helmet', zh: '头盔', e: '⛑️' },
          { w: 'crosswalk', zh: '斑马线', e: '🚸' }, { w: 'sidewalk', zh: '人行道', e: '🚶' },
          { w: 'motorcycle', zh: '摩托车', e: '🏍️' }, { w: 'ticket', zh: '票', e: '🎫' },
          { w: 'tourist', zh: '游客', e: '🧳' },
        ],
        sentences: [
          { en: 'How are we going to get there? By bus.', zh: '我们怎么去？坐公交。' },
          { en: 'How long does it take? Twenty minutes.', zh: '要多久？二十分钟。' },
        ] },
      { id: 'gs4-m06l2', mod: 6, kind: 'unit',
        title: 'M6-L2 · Money & Time', zh: '钱与时间',
        words: [
          { w: 'leave', zh: '出发', e: '🚏' }, { w: 'arrive', zh: '到达', e: '🏁' },
          { w: 'dollar', zh: '美元', e: '💵' }, { w: 'cent', zh: '美分', e: '🪙' },
          { w: 'comfortable', zh: '舒适的', e: '🛋️' }, { w: 'exciting', zh: '刺激的', e: '🎢' },
          { w: 'expensive', zh: '昂贵的', e: '💸' },
        ],
        sentences: [
          { en: 'How much is it? Two dollars and fifty cents.', zh: '多少钱？两美元五十美分。' },
        ] },
      { id: 'gs4-m06r', mod: 6, kind: 'review', title: 'Module 6 复习闯关', zh: '出行 · 价格 · 时间',
        from: ['gs4-m06l1', 'gs4-m06l2'], count: 8 },
      { id: 'gs4-m07l1', mod: 7, modName: 'Module 7 · Helping out 出一份力', modEmoji: '🤝', modTip: 'Phonics: oo 两种音 · 品德: Be helpful to others', kind: 'unit',
        title: 'M7-L1 · Help Out', zh: '帮忙与露营',
        words: [
          { w: 'help', zh: '帮助', e: '🤲' }, { w: 'carry bags', zh: '提袋子', e: '🛍️' },
          { w: 'pick up trash', zh: '捡垃圾', e: '🗑️' }, { w: 'hurt', zh: '弄伤', e: '🤕' },
          { w: 'sleeping bag', zh: '睡袋', e: '🛌' }, { w: 'flashlight', zh: '手电筒', e: '🔦' },
          { w: 'tent', zh: '帐篷', e: '⛺' },
        ],
        sentences: [
          { en: "Whose jacket is this? It's mine.", zh: '这是谁的夹克？是我的。' },
        ] },
      { id: 'gs4-m07l2', mod: 7, kind: 'unit',
        title: 'M7-L2 · Recycle', zh: '回收利用',
        words: [
          { w: 'recycle', zh: '回收', e: '♻️' }, { w: 'paper', zh: '纸', e: '📄' },
          { w: 'metal', zh: '金属', e: '🥫' }, { w: 'glass', zh: '玻璃', e: '🥃' },
          { w: 'plastic', zh: '塑料', e: '🧴' }, { w: 'jar', zh: '罐子', e: '🏺' },
          { w: 'squirrel', zh: '松鼠', e: '🐿️' },
        ],
        sentences: [
          { en: 'Everyone can recycle.', zh: '每个人都可以回收。' },
          { en: 'There is someone at the door.', zh: '门口有人。' },
        ] },
      { id: 'gs4-m07r', mod: 7, kind: 'review', title: 'Module 7 复习闯关', zh: '帮忙 · 回收',
        from: ['gs4-m07l1', 'gs4-m07l2'], count: 8 },
      { id: 'gs4-m08l1', mod: 8, modName: 'Module 8 · Amazing animals 神奇动物', modEmoji: '🦍', modTip: 'Phonics: ea 两种音 · 品德: 爱护动物', kind: 'unit',
        title: 'M8-L1 · Animals', zh: '动物（一）',
        words: [
          { w: 'gorilla', zh: '大猩猩', e: '🦍' }, { w: 'snail', zh: '蜗牛', e: '🐌' },
          { w: 'panda', zh: '熊猫', e: '🐼' }, { w: 'rhino', zh: '犀牛', e: '🦏' },
          { w: 'ostrich', zh: '鸵鸟', e: '🦤' }, { w: 'dinosaur', zh: '恐龙', e: '🦖' },
          { w: 'bone', zh: '骨头', e: '🦴' },
        ],
        sentences: [
          { en: 'Elephants are bigger than rhinos.', zh: '大象比犀牛大。' },
        ] },
      { id: 'gs4-m08l2', mod: 8, kind: 'unit',
        title: 'M8-L2 · Body Parts', zh: '动物的部位',
        words: [
          { w: 'beak', zh: '喙', e: '🦜' }, { w: 'horns', zh: '角', e: '🐏' },
          { w: 'claws', zh: '爪子', e: '🐾' }, { w: 'spots', zh: '斑点', e: '🐆' },
          { w: 'heavy', zh: '重的', e: '🏋️' }, { w: 'intelligent', zh: '聪明的', e: '🧠' },
          { w: 'dangerous', zh: '危险的', e: '⚠️' },
        ],
        sentences: [
          { en: "Why do you like giraffes? Because they're tall and pretty.", zh: '你为什么喜欢长颈鹿？因为它们又高又漂亮。' },
        ] },
      { id: 'gs4-m08l3', mod: 8, kind: 'unit',
        title: 'M8-L3 · Baby Animals', zh: '动物宝宝',
        words: [
          { w: 'puppy', zh: '小狗', e: '🐶' }, { w: 'kitten', zh: '小猫', e: '🐱' },
          { w: 'bunny', zh: '小兔', e: '🐰' }, { w: 'cub', zh: '幼崽', e: '🐻' },
          { w: 'chick', zh: '小鸡', e: '🐤' },
        ],
        sentences: [
          { en: 'Its head was as big as a small car.', zh: '它的头曾经像小汽车一样大。' },
        ] },
      { id: 'gs4-m08r', mod: 8, kind: 'review', title: 'Module 8 复习闯关', zh: '动物 · 比较',
        from: ['gs4-m08l1', 'gs4-m08l2', 'gs4-m08l3'], count: 10 },
      { id: 'gs4-m09l1', mod: 9, modName: 'Module 9 · Get active! 动起来', modEmoji: '🏅', modTip: 'Phonics: or/ar · 品德: 善行再小也不浪费', kind: 'unit',
        title: 'M9-L1 · Sports', zh: '运动会',
        words: [
          { w: 'cycling', zh: '骑行', e: '🚴' }, { w: 'race', zh: '赛跑', e: '🏁' },
          { w: 'javelin', zh: '标枪', e: '🎯' }, { w: 'high jump', zh: '跳高', e: '🦘' },
          { w: 'cricket', zh: '板球', e: '🏏' }, { w: 'ice hockey', zh: '冰球', e: '🏒' },
          { w: 'champion', zh: '冠军', e: '🏆' },
        ],
        sentences: [
          { en: 'This is the easiest race of all.', zh: '这是所有赛跑里最容易的。' },
        ] },
      { id: 'gs4-m09l2', mod: 9, kind: 'unit',
        title: 'M9-L2 · Gear & Words', zh: '装备与形容',
        words: [
          { w: 'paddle', zh: '球拍', e: '🏓' }, { w: 'net', zh: '网', e: '🥅' },
          { w: 'kneepad', zh: '护膝', e: '🦵' }, { w: 'easy', zh: '容易的', e: '😌' },
          { w: 'hard', zh: '难的', e: '😤' }, { w: 'popular', zh: '流行的', e: '⭐' },
        ],
        sentences: [
          { en: "I'm good at basketball.", zh: '我篮球打得好。' },
        ] },
      { id: 'gs4-m09r', mod: 9, kind: 'review', title: 'Module 9 复习闯关', zh: '运动 · 最高级',
        from: ['gs4-m09l1', 'gs4-m09l2'], count: 8 },
      { id: 'gs4-m10l1', mod: 10, modName: 'Module 10 · What is the matter? 你怎么了', modEmoji: '🩺', modTip: 'Phonics: ir/ur · 品德: 注意居家安全', kind: 'unit',
        title: 'M10-L1 · Illness', zh: '生病了',
        words: [
          { w: 'headache', zh: '头痛', e: '🤕' }, { w: 'stomachache', zh: '胃痛', e: '🤢' },
          { w: 'earache', zh: '耳痛', e: '👂' }, { w: 'toothache', zh: '牙痛', e: '🦷' },
          { w: 'sore throat', zh: '嗓子痛', e: '🗣️' }, { w: 'fever', zh: '发烧', e: '🌡️' },
          { w: 'medicine', zh: '药', e: '💊' },
        ],
        sentences: [
          { en: "What's the matter? I have a headache.", zh: '你怎么了？我头痛。' },
          { en: 'You should take some medicine.', zh: '你应该吃点药。' },
        ] },
      { id: 'gs4-m10l2', mod: 10, kind: 'unit',
        title: 'M10-L2 · Ouch!', zh: '受伤了',
        words: [
          { w: 'cough', zh: '咳嗽', e: '😷' }, { w: 'cut', zh: '伤口', e: '🩸' },
          { w: 'bleed', zh: '流血', e: '🩹' }, { w: 'cast', zh: '石膏', e: '🦴' },
          { w: 'Band-Aid', zh: '创可贴', e: '🩼' }, { w: 'burn', zh: '烧伤', e: '🔥' },
          { w: 'sunburn', zh: '晒伤', e: '🏖️' },
        ],
        sentences: [
          { en: "She shouldn't run on the stairs.", zh: '她不该在楼梯上跑。' },
        ] },
      { id: 'gs4-m10l3', mod: 10, kind: 'unit',
        title: 'M10-L3 · Safe at Home', zh: '居家安全',
        words: [
          { w: 'germs', zh: '细菌', e: '🦠' }, { w: 'soap', zh: '肥皂', e: '🧼' },
          { w: 'sunscreen', zh: '防晒霜', e: '🧴' }, { w: 'outlet', zh: '插座', e: '🔌' },
          { w: 'matches', zh: '火柴', e: '🔥' }, { w: 'stove', zh: '炉灶', e: '🍳' },
          { w: 'stairs', zh: '楼梯', e: '🪜' },
        ],
        sentences: [
          { en: 'Wash your hands with soap!', zh: '用肥皂洗手！' },
        ] },
      { id: 'gs4-m10r', mod: 10, kind: 'review', title: 'Module 10 复习闯关 · 毕业大闯关', zh: '健康 · 安全',
        from: ['gs4-m10l1', 'gs4-m10l2', 'gs4-m10l3'], count: 10 },
    ]
  },

  /* ============ Get Smart 5（官方 New Get Smart 5 Contents 逐字对齐） ============ */
  {
    id: 'gs5', name: 'Get Smart 5', zh: '第五册 · 官方目录对齐', emoji: '🐉', color: '#059669',
    desc: "与课本逐字对齐：10 个 Module（People → Don't panic!），词汇与句型全部来自官方目录。",
    units: [
      { id: 'gs5-m01l1', mod: 1, modName: 'Module 1 · People 人物', modEmoji: '🧑‍🎨', modTip: 'Phonics: /aɪ/ 与 /ɪ/ · 品德: 读名人故事', kind: 'unit',
        title: 'M1-L1 · Famous People', zh: '名人职业',
        words: [
          { w: 'author', zh: '作家', e: '✒️' }, { w: 'artist', zh: '画家', e: '🎨' },
          { w: 'reporter', zh: '记者', e: '🎤' }, { w: 'newspaper', zh: '报纸', e: '📰' },
          { w: 'interview', zh: '采访', e: '🎙️' }, { w: 'autograph', zh: '亲笔签名', e: '🖋️' },
          { w: 'award', zh: '奖项', e: '🏆' },
        ],
        sentences: [
          { en: 'She is a famous artist.', zh: '她是一位著名的画家。' },
          { en: 'He is going to write an article.', zh: '他打算写一篇文章。' },
        ] },
      { id: 'gs5-m01l2', mod: 1, kind: 'unit',
        title: 'M1-L2 · Describe', zh: '描述与作品',
        words: [
          { w: 'serious', zh: '严肃的', e: '🧐' }, { w: 'famous', zh: '著名的', e: '⭐' },
          { w: 'fantastic', zh: '极好的', e: '🤩' }, { w: 'drawing', zh: '图画', e: '🖼️' },
          { w: 'neighbour', zh: '邻居', e: '🏘️' }, { w: 'cartoon', zh: '卡通', e: '🐭' },
          { w: 'sell', zh: '卖', e: '🏷️' },
        ],
        sentences: [
          { en: 'The cartoon is fantastic!', zh: '这部卡通太棒了！' },
        ] },
      { id: 'gs5-m01l3', mod: 1, kind: 'unit',
        title: 'M1-L3 · Outdoor', zh: '户外活动',
        words: [
          { w: 'go hiking', zh: '徒步', e: '🥾' }, { w: 'go climbing', zh: '攀岩', e: '🧗' },
          { w: 'go camping', zh: '露营', e: '⛺' }, { w: 'buy souvenirs', zh: '买纪念品', e: '🎁' },
        ],
        sentences: [
          { en: 'I am going to go camping this summer.', zh: '今年夏天我打算去露营。' },
        ] },
      { id: 'gs5-m01r', mod: 1, kind: 'review', title: 'Module 1 复习闯关', zh: '名人 · 描述 · 户外',
        from: ['gs5-m01l1', 'gs5-m01l2', 'gs5-m01l3'], count: 8 },
      { id: 'gs5-m02l1', mod: 2, modName: 'Module 2 · Exploring 探险', modEmoji: '🗺️', modTip: 'Phonics: /aɪ/ /eɪ/ · 品德: 合作成就大事', kind: 'unit',
        title: 'M2-L1 · Skills', zh: '本领（过去会）',
        words: [
          { w: 'rollerblade', zh: '轮滑', e: '🛼' }, { w: 'type', zh: '打字', e: '⌨️' },
          { w: 'send an e-mail', zh: '发邮件', e: '📧' }, { w: 'count', zh: '数数', e: '🔢' },
          { w: 'play the drums', zh: '打鼓', e: '🥁' }, { w: 'fight', zh: '打架', e: '🥊' },
          { w: 'explore', zh: '探险', e: '🧭' },
        ],
        sentences: [
          { en: 'I could count when I was four.', zh: '我四岁时就会数数了。' },
          { en: 'He was exploring the island.', zh: '他那时正在岛上探险。' },
        ] },
      { id: 'gs5-m02l2', mod: 2, kind: 'unit',
        title: 'M2-L2 · Digging', zh: '寻宝动作',
        words: [
          { w: 'look for', zh: '寻找', e: '🔍' }, { w: 'dig', zh: '挖', e: '⛏️' },
          { w: 'relax', zh: '放松', e: '😌' }, { w: 'knock', zh: '敲', e: '🚪' },
          { w: 'hold', zh: '握', e: '✊' }, { w: 'hear', zh: '听见', e: '👂' },
          { w: 'picnic', zh: '野餐', e: '🧺' },
        ],
        sentences: [
          { en: 'While I was digging, I heard a noise.', zh: '我挖土的时候听到了声音。' },
        ] },
      { id: 'gs5-m02l3', mod: 2, kind: 'unit',
        title: 'M2-L3 · Voyage', zh: '航海探险',
        words: [
          { w: 'voyage', zh: '航海', e: '🚢' }, { w: 'captain', zh: '船长', e: '🧑‍✈️' },
          { w: 'iceberg', zh: '冰山', e: '🧊' }, { w: 'map', zh: '地图', e: '🗺️' },
          { w: 'palm tree', zh: '棕榈树', e: '🌴' }, { w: 'rock', zh: '岩石', e: '🪨' },
          { w: 'chest', zh: '箱子', e: '🧰' },
        ],
        sentences: [
          { en: 'The captain sailed the ship.', zh: '船长驾驶着船。' },
        ] },
      { id: 'gs5-m02r', mod: 2, kind: 'review', title: 'Module 2 复习闯关', zh: '本领 · 探险 · 航海',
        from: ['gs5-m02l1', 'gs5-m02l2', 'gs5-m02l3'], count: 10 },
      { id: 'gs5-m03l1', mod: 3, modName: 'Module 3 · Try hard 努力拼搏', modEmoji: '🏅', modTip: 'Phonics: /ʌ/ /uː/ · 品德: 奥运精神', kind: 'unit',
        title: 'M3-L1 · Extreme Sports', zh: '极限运动',
        words: [
          { w: 'bungee jumping', zh: '蹦极', e: '🪢' }, { w: 'scuba diving', zh: '深潜', e: '🤿' },
          { w: 'parasailing', zh: '帆伞', e: '🪂' }, { w: 'surfing', zh: '冲浪', e: '🏄' },
          { w: 'water-skiing', zh: '滑水', e: '🌊' }, { w: 'subway', zh: '地铁', e: '🚇' },
          { w: 'continent', zh: '大洲', e: '🗺️' },
        ],
        sentences: [
          { en: 'Surfing is exciting!', zh: '冲浪很刺激！' },
        ] },
      { id: 'gs5-m03l2', mod: 3, kind: 'unit',
        title: 'M3-L2 · Olympics', zh: '奥运会',
        words: [
          { w: 'athlete', zh: '运动员', e: '🏃' }, { w: 'medal', zh: '奖牌', e: '🏅' },
          { w: 'winner', zh: '胜者', e: '🏆' }, { w: 'ring', zh: '环', e: '⭕' },
          { w: 'mascot', zh: '吉祥物', e: '🐼' }, { w: 'practice', zh: '练习', e: '🔁' },
          { w: 'train', zh: '训练', e: '🏋️' },
        ],
        sentences: [
          { en: 'He trains hard.', zh: '他训练很刻苦。' },
        ] },
      { id: 'gs5-m03l3', mod: 3, kind: 'unit',
        title: 'M3-L3 · Measure', zh: '测量与方式',
        words: [
          { w: 'hard', zh: '刻苦地', e: '💪' }, { w: 'softly', zh: '轻柔地', e: '🌙' },
          { w: 'meters', zh: '米', e: '📏' }, { w: 'centimeters', zh: '厘米', e: '📐' },
          { w: 'minutes', zh: '分钟', e: '⏱️' }, { w: 'seconds', zh: '秒', e: '⏲️' },
          { w: 'wave', zh: '浪', e: '🌊' },
        ],
        sentences: [
          { en: 'She dances softly.', zh: '她跳舞很轻柔。' },
          { en: 'It is fifty meters long.', zh: '它有五十米长。' },
        ] },
      { id: 'gs5-m03r', mod: 3, kind: 'review', title: 'Module 3 复习闯关', zh: '极限运动 · 奥运 · 测量',
        from: ['gs5-m03l1', 'gs5-m03l2', 'gs5-m03l3'], count: 10 },
      { id: 'gs5-m04l1', mod: 4, modName: 'Module 4 · Up high 高高的', modEmoji: '🪽', modTip: 'Phonics: /eər/ /oʊ/ · 品德: 听从长辈', kind: 'unit',
        title: 'M4-L1 · Tiny Creatures', zh: '小生灵',
        words: [
          { w: 'hole', zh: '洞', e: '🕳️' }, { w: 'tiny', zh: '极小的', e: '🐜' },
          { w: 'mammals', zh: '哺乳动物', e: '🦇' }, { w: 'insect', zh: '昆虫', e: '🐝' },
          { w: 'hunt', zh: '狩猎', e: '🏹' }, { w: 'person', zh: '人', e: '🧑' },
          { w: 'thing', zh: '东西', e: '📦' },
        ],
        sentences: [
          { en: 'An insect is a tiny animal.', zh: '昆虫是一种极小的动物。' },
        ] },
      { id: 'gs5-m04l2', mod: 4, kind: 'unit',
        title: 'M4-L2 · Machines & Jobs', zh: '机器与职业',
        words: [
          { w: 'washing machine', zh: '洗衣机', e: '🧺' }, { w: 'machine', zh: '机器', e: '⚙️' },
          { w: 'inventor', zh: '发明家', e: '💡' }, { w: 'director', zh: '导演', e: '🎬' },
          { w: 'actress', zh: '女演员', e: '🎬' }, { w: 'stuntman', zh: '特技演员', e: '💥' },
          { w: 'window washer', zh: '擦窗工', e: '🪟' },
        ],
        sentences: [
          { en: 'She is an actress who is well known.', zh: '她是一位很有名的女演员。' },
        ] },
      { id: 'gs5-m04l3', mod: 4, kind: 'unit',
        title: 'M4-L3 · Icarus', zh: '伊卡洛斯',
        words: [
          { w: 'feather', zh: '羽毛', e: '🪶' }, { w: 'wax', zh: '蜡', e: '🕯️' },
          { w: 'melt', zh: '融化', e: '🔥' }, { w: 'drown', zh: '溺水', e: '🌊' },
          { w: 'pie', zh: '馅饼', e: '🥧' }, { w: 'pan', zh: '平底锅', e: '🍳' },
          { w: 'dirty', zh: '脏的', e: '🧹' },
        ],
        sentences: [
          { en: 'The wax melted in the sun.', zh: '蜡在太阳下融化了。' },
        ] },
      { id: 'gs5-m04r', mod: 4, kind: 'review', title: 'Module 4 复习闯关', zh: '动物 · 机器 · 故事',
        from: ['gs5-m04l1', 'gs5-m04l2', 'gs5-m04l3'], count: 10 },
      { id: 'gs5-m05l1', mod: 5, modName: 'Module 5 · Its natural 自然万物', modEmoji: '🌱', modTip: 'Phonics: /ʌ/ /ɑː/ · 品德: 爱护自然', kind: 'unit',
        title: 'M5-L1 · Plants', zh: '植物怎么长',
        words: [
          { w: 'soil', zh: '土壤', e: '🟤' }, { w: 'seed', zh: '种子', e: '🌰' },
          { w: 'greenhouse', zh: '温室', e: '🏠' }, { w: 'root', zh: '根', e: '🌿' },
          { w: 'sunlight', zh: '阳光', e: '☀️' }, { w: 'grow', zh: '生长', e: '📈' },
          { w: 'cut down', zh: '砍伐', e: '🪓' },
        ],
        sentences: [
          { en: 'Plants need sunlight and water.', zh: '植物需要阳光和水。' },
        ] },
      { id: 'gs5-m05l2', mod: 5, kind: 'unit',
        title: 'M5-L2 · Bees', zh: '蜜蜂',
        words: [
          { w: 'beekeeper', zh: '养蜂人', e: '🧑‍🌾' }, { w: 'beehive', zh: '蜂箱', e: '🍯' },
          { w: 'honey', zh: '蜂蜜', e: '🍯' }, { w: 'sting', zh: '蜇', e: '🐝' },
          { w: 'honeycomb', zh: '蜂巢', e: '🕳️' }, { w: 'nectar', zh: '花蜜', e: '🌸' },
          { w: 'add', zh: '添加', e: '➕' },
        ],
        sentences: [
          { en: 'Bees make honey from nectar.', zh: '蜜蜂用花蜜酿蜜。' },
        ] },
      { id: 'gs5-m05l3', mod: 5, kind: 'unit',
        title: 'M5-L3 · Protect Nature', zh: '保护自然',
        words: [
          { w: 'environment', zh: '环境', e: '🌍' }, { w: 'turn off', zh: '关掉', e: '🚰' },
          { w: 'faucet', zh: '水龙头', e: '🚿' }, { w: 'oxygen', zh: '氧气', e: '💨' },
          { w: 'wood', zh: '树木', e: '🪵' }, { w: 'endangered species', zh: '濒危物种', e: '🐾' },
          { w: 'extinct', zh: '灭绝的', e: '🦤' },
        ],
        sentences: [
          { en: "Don't cut down the trees!", zh: '不要砍树！' },
          { en: 'Turn off the faucet, please.', zh: '请关掉水龙头。' },
        ] },
      { id: 'gs5-m05r', mod: 5, kind: 'review', title: 'Module 5 复习闯关', zh: '植物 · 蜜蜂 · 环保',
        from: ['gs5-m05l1', 'gs5-m05l2', 'gs5-m05l3'], count: 10 },
      { id: 'gs5-m06l1', mod: 6, modName: 'Module 6 · One and all 人人都行', modEmoji: '🎭', modTip: 'Phonics: /g/ /dʒ/ · 品德: 任何年纪都能当英雄', kind: 'unit',
        title: 'M6-L1 · Compounds', zh: '复合不定代词',
        words: [
          { w: 'someone', zh: '某人', e: '🧍' }, { w: 'anyone', zh: '任何人', e: '❓' },
          { w: 'no one', zh: '没有人', e: '🚫' }, { w: 'everyone', zh: '每个人', e: '👨‍👩‍👧‍👦' },
          { w: 'something', zh: '某事', e: '❗' }, { w: 'anything', zh: '任何事', e: '❔' },
          { w: 'nothing', zh: '没什么', e: '⭕' }, { w: 'everything', zh: '一切', e: '✨' },
        ],
        sentences: [
          { en: 'There is something on the table.', zh: '桌子上有东西。' },
          { en: 'Everyone can enter the competition.', zh: '每个人都能参加比赛。' },
        ] },
      { id: 'gs5-m06l2', mod: 6, kind: 'unit',
        title: 'M6-L2 · On TV', zh: '电视与舞台',
        words: [
          { w: 'channel', zh: '频道', e: '📺' }, { w: 'remote control', zh: '遥控器', e: '🎛️' },
          { w: 'TV guide', zh: '节目单', e: '📋' }, { w: 'mechanic', zh: '机修工', e: '🔧' },
          { w: 'information', zh: '信息', e: 'ℹ️' }, { w: 'stage', zh: '舞台', e: '🎪' },
          { w: 'performance', zh: '演出', e: '🎤' },
        ],
        sentences: [
          { en: 'What is on at the theater tonight?', zh: '今晚剧院演什么？' },
        ] },
      { id: 'gs5-m06l3', mod: 6, kind: 'unit',
        title: 'M6-L3 · Talent Show', zh: '才艺比赛',
        words: [
          { w: 'talent', zh: '才艺', e: '🌟' }, { w: 'balance', zh: '平衡', e: '🤹' },
          { w: 'hide', zh: '躲藏', e: '🙈' }, { w: 'competition', zh: '竞赛', e: '🏅' },
        ],
        sentences: [
          { en: 'The talent show is on stage!', zh: '才艺比赛在舞台上！' },
        ] },
      { id: 'gs5-m06r', mod: 6, kind: 'review', title: 'Module 6 复习闯关', zh: '代词 · 舞台 · 才艺',
        from: ['gs5-m06l1', 'gs5-m06l2', 'gs5-m06l3'], count: 8 },
      { id: 'gs5-m07l1', mod: 7, modName: 'Module 7 · Lets help 一起帮忙', modEmoji: '💚', modTip: 'Phonics: /ts/ /ʃ/ /tʃ/ · 品德: 帮助他人', kind: 'unit',
        title: 'M7-L1 · Raise Money', zh: '募款与帮忙',
        words: [
          { w: 'raise money', zh: '募款', e: '💰' }, { w: 'reach', zh: '够到', e: '🤸' },
          { w: 'put away', zh: '收好', e: '🧹' }, { w: 'lift', zh: '举起', e: '🏋️' },
          { w: 'come true', zh: '实现', e: '🌟' }, { w: 'charity', zh: '慈善', e: '❤️' },
          { w: 'share', zh: '分享', e: '🤝' },
        ],
        sentences: [
          { en: 'Maybe they will raise money for charity.', zh: '也许他们会为慈善募款。' },
          { en: 'Your wish will come true.', zh: '你的愿望会实现。' },
        ] },
      { id: 'gs5-m07l2', mod: 7, kind: 'unit',
        title: 'M7-L2 · Fun & Health', zh: '玩乐与健康',
        words: [
          { w: 'karaoke', zh: '卡拉OK', e: '🎤' }, { w: 'go-carting', zh: '卡丁车', e: '🏎️' },
          { w: 'ferris wheel', zh: '摩天轮', e: '🎡' }, { w: 'raffle tickets', zh: '抽奖券', e: '🎟️' },
          { w: 'pills', zh: '药丸', e: '💊' }, { w: 'vitamins', zh: '维生素', e: '🍊' },
          { w: 'wish', zh: '愿望', e: '🌠' },
        ],
        sentences: [
          { en: 'The ferris wheel is huge!', zh: '摩天轮好大！' },
        ] },
      { id: 'gs5-m07l3', mod: 7, kind: 'unit',
        title: 'M7-L3 · Good Manners', zh: '好品格',
        words: [
          { w: 'cheat', zh: '欺骗', e: '🃏' }, { w: 'lie', zh: '说谎', e: '🤥' },
          { w: 'make fun of', zh: '取笑', e: '😝' }, { w: 'illness', zh: '疾病', e: '🤒' },
          { w: 'transportation', zh: '交通', e: '🚌' }, { w: 'chores', zh: '家务', e: '🧺' },
          { w: 'friendship', zh: '友谊', e: '🫂' },
        ],
        sentences: [
          { en: 'Never cheat in a game.', zh: '游戏中永远不要作弊。' },
        ] },
      { id: 'gs5-m07r', mod: 7, kind: 'review', title: 'Module 7 复习闯关', zh: '募款 · 健身 · 品格',
        from: ['gs5-m07l1', 'gs5-m07l2', 'gs5-m07l3'], count: 8 },
      { id: 'gs5-m08l1', mod: 8, modName: 'Module 8 · Whats up? 走走看看', modEmoji: '🧭', modTip: 'Phonics: /ɔːr/ /oʊ/ · 品德: 讲礼貌', kind: 'unit',
        title: 'M8-L1 · Around Town', zh: '城镇各处',
        words: [
          { w: 'bridge', zh: '桥', e: '🌉' }, { w: 'windmill', zh: '风车', e: '🌬️' },
          { w: 'tunnel', zh: '隧道', e: '🕳️' }, { w: 'hill', zh: '小山', e: '⛰️' },
          { w: 'drugstore', zh: '药房', e: '💊' }, { w: 'fire station', zh: '消防站', e: '🚒' },
          { w: 'post office', zh: '邮局', e: '📮' },
        ],
        sentences: [
          { en: 'Go across the bridge.', zh: '走过这座桥。' },
        ] },
      { id: 'gs5-m08l2', mod: 8, kind: 'unit',
        title: 'M8-L2 · Manners', zh: '礼仪',
        words: [
          { w: 'manners', zh: '礼仪', e: '🫱' }, { w: 'rules', zh: '规则', e: '📏' },
          { w: 'seat', zh: '座位', e: '💺' }, { w: 'feeling', zh: '感受', e: '💗' },
          { w: 'respect', zh: '尊重', e: '🤝' }, { w: 'borrow', zh: '借', e: '📗' },
          { w: 'line', zh: '队列', e: '🚶‍♂️' },
        ],
        sentences: [
          { en: 'May I borrow your pen?', zh: '我可以借你的笔吗？' },
        ] },
      { id: 'gs5-m08l3', mod: 8, kind: 'unit',
        title: 'M8-L3 · Hobbies', zh: '兴趣班',
        words: [
          { w: 'drama class', zh: '戏剧课', e: '🎭' }, { w: 'arts and crafts', zh: '手工', e: '✂️' },
          { w: 'play the violin', zh: '拉小提琴', e: '🎻' }, { w: 'backpacking', zh: '背包旅行', e: '🎒' },
          { w: 'wax model', zh: '蜡像', e: '🕯️' }, { w: 'amazed', zh: '惊叹的', e: '😲' },
          { w: 'fashion model', zh: '时装模特', e: '💄' },
        ],
        sentences: [
          { en: 'I love playing the violin.', zh: '我喜欢拉小提琴。' },
        ] },
      { id: 'gs5-m08r', mod: 8, kind: 'review', title: 'Module 8 复习闯关', zh: '场所 · 礼仪 · 爱好',
        from: ['gs5-m08l1', 'gs5-m08l2', 'gs5-m08l3'], count: 8 },
      { id: 'gs5-m09l1', mod: 9, modName: 'Module 9 · Looking ahead 展望未来', modEmoji: '🔮', modTip: 'Phonics: /oʊ/ /ʊ/ · 品德: 新年计划', kind: 'unit',
        title: 'M9-L1 · Plans', zh: '新年计划',
        words: [
          { w: 'save money', zh: '攒钱', e: '💰' }, { w: 'take care', zh: '照顾', e: '🤱' },
          { w: 'spend time', zh: '花时间', e: '⏳' }, { w: 'make decisions', zh: '做决定', e: '🤔' },
          { w: 'create', zh: '创造', e: '🎨' }, { w: 'engineer', zh: '工程师', e: '👩‍🔧' },
          { w: 'height', zh: '高度', e: '📐' },
        ],
        sentences: [
          { en: 'I want to save money to buy a globe.', zh: '我想攒钱买一个地球仪。' },
        ] },
      { id: 'gs5-m09l2', mod: 9, kind: 'unit',
        title: 'M9-L2 · Amusement Park', zh: '游乐园',
        words: [
          { w: 'ride', zh: '游乐项目', e: '🎠' }, { w: 'roller coaster', zh: '过山车', e: '🎢' },
          { w: 'bouncy', zh: '弹跳的', e: '🤸' }, { w: 'worm', zh: '蠕虫', e: '🪱' },
          { w: 'alarm clock', zh: '闹钟', e: '⏰' }, { w: 'button', zh: '按钮', e: '🔘' },
          { w: 'globe', zh: '地球仪', e: '🌐' },
        ],
        sentences: [
          { en: "Why don't we ride the roller coaster?", zh: '我们为什么不坐过山车呢？' },
        ] },
      { id: 'gs5-m09l3', mod: 9, kind: 'unit',
        title: 'M9-L3 · Daily Life', zh: '日常小事',
        words: [
          { w: 'cream', zh: '奶油', e: '🍦' }, { w: 'adult', zh: '成人', e: '🧑' },
          { w: 'bill', zh: '账单', e: '🧾' }, { w: 'activity', zh: '活动', e: '🎯' },
          { w: 'area', zh: '区域', e: '🗺️' }, { w: 'customs', zh: '习俗', e: '🎎' },
        ],
        sentences: [
          { en: 'Adults pay the bill.', zh: '成人来付账。' },
        ] },
      { id: 'gs5-m09r', mod: 9, kind: 'review', title: 'Module 9 复习闯关', zh: '计划 · 游乐园 · 日常',
        from: ['gs5-m09l1', 'gs5-m09l2', 'gs5-m09l3'], count: 8 },
      { id: 'gs5-m10l1', mod: 10, modName: "Module 10 · Don't panic! 别慌", modEmoji: '🧯', modTip: 'Phonics: /ə/ · 品德: 保护历史遗产', kind: 'unit',
        title: 'M10-L1 · Sports Gear', zh: '运动装备',
        words: [
          { w: 'boxing', zh: '拳击', e: '🥊' }, { w: 'canoeing', zh: '皮划艇', e: '🛶' },
          { w: 'golf', zh: '高尔夫', e: '⛳' }, { w: 'goggles', zh: '护目镜', e: '🥽' },
          { w: 'elbow pad', zh: '护肘', e: '🦾' }, { w: 'life jacket', zh: '救生衣', e: '🦺' },
          { w: 'coach', zh: '教练', e: '📣' },
        ],
        sentences: [
          { en: 'Put on your life jacket!', zh: '穿上救生衣！' },
        ] },
      { id: 'gs5-m10l2', mod: 10, kind: 'unit',
        title: 'M10-L2 · Disasters', zh: '自然灾害',
        words: [
          { w: 'earthquake', zh: '地震', e: '🏚️' }, { w: 'panic', zh: '恐慌', e: '😱' },
          { w: 'typhoon', zh: '台风', e: '🌀' }, { w: 'basement', zh: '地下室', e: '🚪' },
          { w: 'instructions', zh: '指示', e: '📋' }, { w: 'broken glass', zh: '碎玻璃', e: '🥃' },
          { w: 'roof tiles', zh: '屋瓦', e: '🏠' },
        ],
        sentences: [
          { en: 'The teacher told us not to panic.', zh: '老师告诉我们不要慌。' },
          { en: 'He asked me to follow him.', zh: '他叫我跟着他。' },
        ] },
      { id: 'gs5-m10l3', mod: 10, kind: 'unit',
        title: 'M10-L3 · Actions', zh: '动作短语',
        words: [
          { w: 'take off', zh: '脱下', e: '🧥' }, { w: 'chew gum', zh: '嚼口香糖', e: '🍬' },
          { w: 'drop', zh: '掉落', e: '⬇️' }, { w: 'destroy', zh: '毁坏', e: '💥' },
          { w: 'put on', zh: '穿上', e: '👕' }, { w: 'move away', zh: '移开', e: '↔️' },
          { w: 'shake', zh: '摇', e: '🤝' }, { w: 'follow', zh: '跟随', e: '👣' },
        ],
        sentences: [
          { en: 'Do not drop broken glass!', zh: '不要乱扔碎玻璃！' },
        ] },
      { id: 'gs5-m10r', mod: 10, kind: 'review', title: 'Module 10 复习闯关 · 毕业大闯关', zh: '装备 · 灾害 · 动作',
        from: ['gs5-m10l1', 'gs5-m10l2', 'gs5-m10l3'], count: 10 },
    ]
  },

  /* ============ Get Smart 6（官方 New Get Smart 6 Contents 逐字对齐） ============ */
  {
    id: 'gs6', name: 'Get Smart 6', zh: '第六册 · 官方目录对齐', emoji: '🦖', color: '#DC2626',
    desc: '与课本逐字对齐：10 个 Module（School and work → Healthy body, healthy mind），词汇与句型全部来自官方目录。',
    units: [
      { id: 'gs6-m01l1', mod: 1, modName: 'Module 1 · School and work 学业与工作', modEmoji: '🏫', modTip: 'Phonics: 三单词尾 · 品德: 做个好友谊', kind: 'unit',
        title: 'M1-L1 · Spare Time', zh: '业余时间',
        words: [
          { w: 'spare time', zh: '空闲时间', e: '🛋️' }, { w: 'hobby', zh: '爱好', e: '🎯' },
          { w: 'collect comic books', zh: '收集漫画', e: '📚' }, { w: 'make model', zh: '做模型', e: '🛩️' },
          { w: 'check e-mail', zh: '查邮件', e: '📧' }, { w: 'band', zh: '乐队', e: '🎸' },
          { w: 'team', zh: '队伍', e: '🧑‍🤝‍🧑' },
        ],
        sentences: [
          { en: 'In my spare time I collect comic books.', zh: '业余时间我收集漫画书。' },
        ] },
      { id: 'gs6-m01l2', mod: 1, kind: 'unit',
        title: 'M1-L2 · Chores', zh: '家务',
        words: [
          { w: 'dust', zh: '掸灰', e: '🧹' }, { w: 'mop', zh: '拖地', e: '🧽' },
          { w: 'iron', zh: '熨烫', e: '👔' }, { w: 'take the kids to school', zh: '送孩子上学', e: '🚸' },
          { w: 'deliver letters', zh: '送信', e: '✉️' }, { w: 'order', zh: '点单', e: '📋' },
          { w: 'look after', zh: '照顾', e: '🤱' },
        ],
        sentences: [
          { en: 'She has to look after her little brother.', zh: '她得照顾她的小弟弟。' },
        ] },
      { id: 'gs6-m01l3', mod: 1, kind: 'unit',
        title: 'M1-L3 · Work', zh: '工作场所',
        words: [
          { w: 'office', zh: '办公室', e: '🏢' }, { w: 'mailman', zh: '邮差', e: '📬' },
          { w: 'typist', zh: '打字员', e: '⌨️' }, { w: 'babysitter', zh: '保姆', e: '👶' },
          { w: 'factory', zh: '工厂', e: '🏭' }, { w: 'furniture', zh: '家具', e: '🪑' },
          { w: 'sew', zh: '缝纫', e: '🧵' },
        ],
        sentences: [
          { en: 'My mom works in a big office.', zh: '我妈妈在一个大办公室工作。' },
        ] },
      { id: 'gs6-m01l4', mod: 1, kind: 'unit',
        title: 'M1-L4 · People', zh: '性格形容词',
        words: [
          { w: 'naughty', zh: '调皮的', e: '😈' }, { w: 'strict', zh: '严格的', e: '📏' },
          { w: 'friendly', zh: '友好的', e: '😊' }, { w: 'early', zh: '早的', e: '🌅' },
        ],
        sentences: [
          { en: 'He is strict but friendly.', zh: '他严格但友好。' },
        ] },
      { id: 'gs6-m01r', mod: 1, kind: 'review', title: 'Module 1 复习闯关', zh: '业余 · 家务 · 工作',
        from: ['gs6-m01l1', 'gs6-m01l2', 'gs6-m01l3', 'gs6-m01l4'], count: 10 },
      { id: 'gs6-m02l1', mod: 2, modName: 'Module 2 · Faces and places 各地风情', modEmoji: '🌏', modTip: 'Phonics: /ʌ/ /ɑː/ /æ/ · 品德: 入乡随俗', kind: 'unit',
        title: 'M2-L1 · Materials', zh: '材料与服饰',
        words: [
          { w: 'cotton', zh: '棉', e: '🧵' }, { w: 'leather', zh: '皮革', e: '👟' },
          { w: 'straw', zh: '草编', e: '🌾' }, { w: 'sandals', zh: '凉鞋', e: '🩴' },
          { w: 'cloth', zh: '布', e: '🧶' }, { w: 'polite', zh: '礼貌的', e: '🙏' },
          { w: 'impolite', zh: '无礼的', e: '🙅' },
        ],
        sentences: [
          { en: 'Give him the gift, please.', zh: '请把这个礼物给他。' },
        ] },
      { id: 'gs6-m02l2', mod: 2, kind: 'unit',
        title: 'M2-L2 · Traditions', zh: '传统',
        words: [
          { w: 'tradition', zh: '传统', e: '🎏' }, { w: 'chopsticks', zh: '筷子', e: '🥢' },
          { w: 'gift', zh: '礼物', e: '🎁' }, { w: 'wrapping paper', zh: '包装纸', e: '🎀' },
          { w: 'napkin', zh: '餐巾', e: '🍽️' }, { w: 'statue', zh: '雕像', e: '🗿' },
          { w: 'tower', zh: '塔', e: '🗼' },
        ],
        sentences: [
          { en: 'Chopsticks are a tradition in China.', zh: '筷子是中国的传统。' },
        ] },
      { id: 'gs6-m02l3', mod: 2, kind: 'unit',
        title: 'M2-L3 · Greetings', zh: '打招呼的方式',
        words: [
          { w: 'shake hands', zh: '握手', e: '🤝' }, { w: 'hug', zh: '拥抱', e: '🫂' },
          { w: 'kiss on the cheek', zh: '贴面礼', e: '😘' }, { w: 'be on time', zh: '守时', e: '⏰' },
          { w: 'maze', zh: '迷宫', e: '🧩' }, { w: 'snow sculpture', zh: '雪雕', e: '⛄' },
          { w: 'classmates', zh: '同学', e: '🎒' },
        ],
        sentences: [
          { en: 'You should shake hands when you meet.', zh: '见面时你应该握手。' },
        ] },
      { id: 'gs6-m02r', mod: 2, kind: 'review', title: 'Module 2 复习闯关', zh: '材料 · 传统 · 礼仪',
        from: ['gs6-m02l1', 'gs6-m02l2', 'gs6-m02l3'], count: 10 },
      { id: 'gs6-m03l1', mod: 3, modName: 'Module 3 · Adventures 冒险', modEmoji: '🧗', modTip: 'Phonics: /aɪ/ /ɪ/ /ɜːr/ · 品德: 外表会骗人', kind: 'unit',
        title: 'M3-L1 · Outdoor Fun', zh: '户外冒险',
        words: [
          { w: 'rock climbing', zh: '攀岩', e: '🧗' }, { w: 'white-water rafting', zh: '激流漂流', e: '🛶' },
          { w: 'horseback riding', zh: '骑马', e: '🐎' }, { w: 'mountain', zh: '山', e: '⛰️' },
          { w: 'trip', zh: '旅程', e: '🚌' }, { w: 'eagle', zh: '鹰', e: '🦅' },
          { w: 'nest', zh: '巢', e: '🪹' },
        ],
        sentences: [
          { en: 'Have you ever tried rock climbing?', zh: '你试过攀岩吗？' },
        ] },
      { id: 'gs6-m03l2', mod: 3, kind: 'unit',
        title: 'M3-L2 · Boy Scouts', zh: '童子军',
        words: [
          { w: 'Boy Scout', zh: '童子军', e: '🏕️' }, { w: 'badge', zh: '徽章', e: '🎖️' },
          { w: 'uniform', zh: '制服', e: '🥋' }, { w: 'first aid', zh: '急救', e: '🩹' },
          { w: 'nature', zh: '自然', e: '🌳' }, { w: 'helmet', zh: '头盔', e: '⛑️' },
          { w: 'wild animals', zh: '野生动物', e: '🐅' },
        ],
        sentences: [
          { en: 'The Boy Scout learned first aid.', zh: '童子军学了急救。' },
        ] },
      { id: 'gs6-m03l3', mod: 3, kind: 'unit',
        title: 'M3-L3 · Experiences', zh: '经历',
        words: [
          { w: 'experience', zh: '经历', e: '🌟' }, { w: 'contest', zh: '竞赛', e: '🏆' },
          { w: 'try', zh: '尝试', e: '🤞' }, { w: 'win', zh: '赢', e: '🎉' },
          { w: 'remember', zh: '记得', e: '💭' }, { w: 'survive', zh: '幸存', e: '🛟' },
          { w: 'scream', zh: '尖叫', e: '😱' },
        ],
        sentences: [
          { en: 'I have never won a contest.', zh: '我从来没赢过比赛。' },
        ] },
      { id: 'gs6-m03r', mod: 3, kind: 'review', title: 'Module 3 复习闯关', zh: '冒险 · 童子军 · 经历',
        from: ['gs6-m03l1', 'gs6-m03l2', 'gs6-m03l3'], count: 10 },
      { id: 'gs6-m04l1', mod: 4, modName: 'Module 4 · Material world 材料世界', modEmoji: '💍', modTip: 'Phonics: /ʊ/ /uː/ /oʊ/ · 品德: 了解发明', kind: 'unit',
        title: 'M4-L1 · Materials', zh: '材料',
        words: [
          { w: 'silk', zh: '丝绸', e: '🧣' }, { w: 'wool', zh: '羊毛', e: '🐑' },
          { w: 'silver', zh: '银', e: '🥈' }, { w: 'stone', zh: '石头', e: '🪨' },
          { w: 'shapes', zh: '形状', e: '🔷' }, { w: 'amazing', zh: '惊人的', e: '🤯' },
          { w: 'round', zh: '圆的', e: '⭕' },
        ],
        sentences: [
          { en: 'The ring is made of silver.', zh: '这枚戒指是银做的。' },
        ] },
      { id: 'gs6-m04l2', mod: 4, kind: 'unit',
        title: 'M4-L2 · Accessories', zh: '饰品',
        words: [
          { w: 'belt', zh: '腰带', e: '📱' }, { w: 'chain', zh: '链子', e: '⛓️' },
          { w: 'ring', zh: '戒指', e: '💍' }, { w: 'watch', zh: '手表', e: '⌚' },
          { w: 'neck', zh: '脖子', e: '🦒' }, { w: 'credit card', zh: '信用卡', e: '💳' },
          { w: 'bill', zh: '账单', e: '🧾' },
        ],
        sentences: [
          { en: 'She wears a watch on her neck.', zh: '她脖子上戴着手表。' },
        ] },
      { id: 'gs6-m04l3', mod: 4, kind: 'unit',
        title: 'M4-L3 · Inventions', zh: '小发明',
        words: [
          { w: 'tea kettle', zh: '茶壶', e: '🫖' }, { w: 'headphones', zh: '耳机', e: '🎧' },
          { w: 'telescope', zh: '望远镜', e: '🔭' }, { w: 'sponge', zh: '海绵', e: '🧽' },
          { w: 'pot', zh: '锅', e: '🍲' }, { w: 'scissors', zh: '剪刀', e: '✂️' },
          { w: 'toothbrush', zh: '牙刷', e: '🪥' },
        ],
        sentences: [
          { en: 'These scissors are used for cutting.', zh: '这把剪刀是用来剪东西的。' },
        ] },
      { id: 'gs6-m04l4', mod: 4, kind: 'unit',
        title: 'M4-L4 · Process', zh: '制作过程',
        words: [
          { w: 'mix', zh: '混合', e: '🥣' }, { w: 'freeze', zh: '冷冻', e: '🧊' },
          { w: 'produce', zh: '生产', e: '🏭' }, { w: 'become', zh: '成为', e: '🦋' },
          { w: 'look like', zh: '看起来像', e: '👀' }, { w: 'coffee', zh: '咖啡', e: '☕' },
          { w: 'corn', zh: '玉米', e: '🌽' },
        ],
        sentences: [
          { en: 'Ice cream is made from milk.', zh: '冰淇淋是牛奶做的。' },
        ] },
      { id: 'gs6-m04r', mod: 4, kind: 'review', title: 'Module 4 复习闯关', zh: '材料 · 饰品 · 发明',
        from: ['gs6-m04l1', 'gs6-m04l2', 'gs6-m04l3', 'gs6-m04l4'], count: 10 },
      { id: 'gs6-m05l1', mod: 5, modName: 'Module 5 · Looking back 回望过去', modEmoji: '🏺', modTip: 'Phonics: /æ/ /ɑː/ /ə/ · 品德: 了解历史', kind: 'unit',
        title: 'M5-L1 · Prehistoric', zh: '史前时代',
        words: [
          { w: 'animal skin', zh: '兽皮', e: '🐅' }, { w: 'mammoth', zh: '猛犸', e: '🦣' },
          { w: 'spear', zh: '矛', e: '🔱' }, { w: 'barefoot', zh: '赤脚', e: '🦶' },
          { w: 'prehistoric', zh: '史前的', e: '🦕' }, { w: 'humans', zh: '人类', e: '🧑‍🤝‍🧑' },
          { w: 'thousand', zh: '千', e: '🔢' },
        ],
        sentences: [
          { en: 'Prehistoric humans used spears.', zh: '史前人类使用长矛。' },
        ] },
      { id: 'gs6-m05l2', mod: 5, kind: 'unit',
        title: 'M5-L2 · The Old Days', zh: '从前的日子',
        words: [
          { w: 'neighborhood', zh: '街区', e: '🏘️' }, { w: 'backyard', zh: '后院', e: '🏡' },
          { w: 'grocery store', zh: '杂货店', e: '🏪' }, { w: 'highway', zh: '公路', e: '🛣️' },
          { w: 'carriage', zh: '马车', e: '🎠' }, { w: 'streetcar', zh: '有轨电车', e: '🚋' },
          { w: 'apartment', zh: '公寓', e: '🏢' },
        ],
        sentences: [
          { en: 'People used to travel by streetcar.', zh: '人们过去坐有轨电车出行。' },
        ] },
      { id: 'gs6-m05l3', mod: 5, kind: 'unit',
        title: 'M5-L3 · Aztecs', zh: '阿兹特克',
        words: [
          { w: 'canal', zh: '运河', e: '🛶' }, { w: 'warrior', zh: '武士', e: '⚔️' },
          { w: 'jaguar', zh: '美洲豹', e: '🐆' }, { w: 'chili peppers', zh: '辣椒', e: '🌶️' },
          { w: 'century', zh: '世纪', e: '💯' }, { w: 'capital', zh: '首都', e: '🏛️' },
          { w: 'entertainment', zh: '娱乐', e: '🎪' },
        ],
        sentences: [
          { en: 'The capital existed hundreds of years ago.', zh: '这座首都存在于几百年前。' },
        ] },
      { id: 'gs6-m05l4', mod: 5, kind: 'unit',
        title: 'M5-L4 · Then and Now', zh: '今与昔',
        words: [
          { w: 'hang out', zh: '闲逛', e: '🚶' }, { w: 'cheer up', zh: '使振作', e: '😄' },
          { w: 'miss', zh: '想念', e: '💌' }, { w: 'surf the Net', zh: '上网', e: '💻' },
          { w: 'care', zh: '在意', e: '🤷' }, { w: 'show', zh: '展示', e: '📺' },
          { w: 'exist', zh: '存在', e: '❓' },
        ],
        sentences: [
          { en: 'There used to be a lake here.', zh: '这里以前有一个湖。' },
        ] },
      { id: 'gs6-m05r', mod: 5, kind: 'review', title: 'Module 5 复习闯关', zh: '史前 · 从前 · 阿兹特克',
        from: ['gs6-m05l1', 'gs6-m05l2', 'gs6-m05l3', 'gs6-m05l4'], count: 10 },
      { id: 'gs6-m06l1', mod: 6, modName: 'Module 6 · The four corners of the Earth 世界四方', modEmoji: '🧊', modTip: 'Phonics: 不发音元音 · 品德: 相信自己不言弃', kind: 'unit',
        title: 'M6-L1 · Poles', zh: '极地',
        words: [
          { w: 'polar bear', zh: '北极熊', e: '🐻‍❄️' }, { w: 'pole', zh: '极点', e: '📍' },
          { w: 'storm', zh: '风暴', e: '⛈️' }, { w: 'rope', zh: '绳子', e: '🪢' },
          { w: 'slippery', zh: '滑的', e: '🧊' }, { w: 'lonely', zh: '孤单的', e: '🧍' },
          { w: 'push', zh: '推', e: '💪' },
        ],
        sentences: [
          { en: 'The polar bear lives at the North Pole.', zh: '北极熊住在北极。' },
        ] },
      { id: 'gs6-m06l2', mod: 6, kind: 'unit',
        title: 'M6-L2 · Transport', zh: '奇特的交通',
        words: [
          { w: 'sailboat', zh: '帆船', e: '⛵' }, { w: 'hot-air balloon', zh: '热气球', e: '🎈' },
          { w: 'jeep', zh: '吉普车', e: '🚙' }, { w: 'mountain biking', zh: '山地骑行', e: '🚵' },
          { w: 'submarine', zh: '潜艇', e: '🌊' }, { w: 'fountain', zh: '喷泉', e: '⛲' },
          { w: 'temple', zh: '寺庙', e: '🛕' },
        ],
        sentences: [
          { en: 'They travelled by hot-air balloon.', zh: '他们坐热气球旅行。' },
        ] },
      { id: 'gs6-m06l3', mod: 6, kind: 'unit',
        title: 'M6-L3 · Rainforest', zh: '热带雨林',
        words: [
          { w: 'tropical rainforest', zh: '热带雨林', e: '🌴' }, { w: 'climate', zh: '气候', e: '🌦️' },
          { w: 'temperature', zh: '气温', e: '🌡️' }, { w: 'frog', zh: '青蛙', e: '🐸' },
          { w: 'poisonous', zh: '有毒的', e: '☠️' }, { w: 'safe', zh: '安全的', e: '🛡️' },
          { w: 'million', zh: '百万', e: '🔢' },
        ],
        sentences: [
          { en: 'Millions of insects live in the rainforest.', zh: '数百万昆虫住在雨林里。' },
        ] },
      { id: 'gs6-m06l4', mod: 6, kind: 'unit',
        title: 'M6-L4 · Feelings', zh: '位置与感受',
        words: [
          { w: 'top', zh: '顶', e: '🔼' }, { w: 'bottom', zh: '底', e: '🔽' },
          { w: 'middle', zh: '中间', e: '🎯' }, { w: 'search', zh: '搜寻', e: '🔍' },
          { w: 'shout', zh: '喊', e: '📣' }, { w: 'believe', zh: '相信', e: '🙏' },
          { w: 'alone', zh: '独自的', e: '🧍' },
        ],
        sentences: [
          { en: 'Climbing mountains is tiring.', zh: '爬山很累人。' },
        ] },
      { id: 'gs6-m06r', mod: 6, kind: 'review', title: 'Module 6 复习闯关', zh: '极地 · 交通 · 雨林',
        from: ['gs6-m06l1', 'gs6-m06l2', 'gs6-m06l3', 'gs6-m06l4'], count: 10 },
      { id: 'gs6-m07l1', mod: 7, modName: 'Module 7 · Fine arts 艺术之美', modEmoji: '🎨', modTip: 'Phonics: 不发音元辅音 · 品德: 待人以礼', kind: 'unit',
        title: 'M7-L1 · Art People', zh: '艺术行业',
        words: [
          { w: 'sculptor', zh: '雕塑家', e: '🗿' }, { w: 'architect', zh: '建筑师', e: '📐' },
          { w: 'acrobat', zh: '杂技演员', e: '🤸' }, { w: 'magician', zh: '魔术师', e: '🎩' },
          { w: 'clown', zh: '小丑', e: '🤡' }, { w: 'security guard', zh: '保安', e: '👮' },
          { w: 'guide', zh: '讲解员', e: '🧑‍🏫' },
        ],
        sentences: [
          { en: 'The magician can do tricks.', zh: '魔术师会变戏法。' },
        ] },
      { id: 'gs6-m07l2', mod: 7, kind: 'unit',
        title: 'M7-L2 · Art Things', zh: '艺术作品',
        words: [
          { w: 'circle', zh: '圆', e: '⭕' }, { w: 'square', zh: '方', e: '🟦' },
          { w: 'sphere', zh: '球体', e: '🔮' }, { w: 'steel', zh: '钢', e: '🏗️' },
          { w: 'brick', zh: '砖', e: '🧱' }, { w: 'pottery', zh: '陶艺', e: '🏺' },
          { w: 'art gallery', zh: '美术馆', e: '🖼️' },
        ],
        sentences: [
          { en: 'The sculpture is made of steel.', zh: '这座雕像是钢做的。' },
        ] },
      { id: 'gs6-m07l3', mod: 7, kind: 'unit',
        title: 'M7-L3 · Music', zh: '音乐类型',
        words: [
          { w: 'pop', zh: '流行', e: '🎤' }, { w: 'rock', zh: '摇滚', e: '🎸' },
          { w: 'jazz', zh: '爵士', e: '🎷' }, { w: 'hip hop', zh: '嘻哈', e: '🎧' },
          { w: 'classical', zh: '古典', e: '🎻' }, { w: 'exhibition', zh: '展览', e: '🏛️' },
          { w: 'talented', zh: '有才华的', e: '🌟' },
        ],
        sentences: [
          { en: 'She is a talented musician.', zh: '她是有才华的音乐家。' },
        ] },
      { id: 'gs6-m07l4', mod: 7, kind: 'unit',
        title: 'M7-L4 · Art Verbs', zh: '艺术动作',
        words: [
          { w: 'sculpt', zh: '雕刻', e: '🗿' }, { w: 'hold', zh: '持', e: '✊' },
          { w: 'sign', zh: '签', e: '✍️' }, { w: 'design', zh: '设计', e: '📐' },
          { w: 'heat', zh: '加热', e: '🔥' }, { w: 'connect', zh: '连接', e: '🔗' },
          { w: 'whisper', zh: '低语', e: '🤫' },
        ],
        sentences: [
          { en: 'The building which he designed is famous.', zh: '他设计的那栋楼很有名。' },
        ] },
      { id: 'gs6-m07r', mod: 7, kind: 'review', title: 'Module 7 复习闯关', zh: '艺术家 · 作品 · 音乐',
        from: ['gs6-m07l1', 'gs6-m07l2', 'gs6-m07l3', 'gs6-m07l4'], count: 10 },
      { id: 'gs6-m08l1', mod: 8, modName: 'Module 8 · Lets learn 一起学习', modEmoji: '🚀', modTip: 'Phonics: /aʊ/ /oʊ/ · 品德: 探索科学', kind: 'unit',
        title: 'M8-L1 · Space', zh: '太空',
        words: [
          { w: 'binoculars', zh: '双筒镜', e: '🔭' }, { w: 'astronaut', zh: '宇航员', e: '👨‍🚀' },
          { w: 'scientist', zh: '科学家', e: '🧑‍🔬' }, { w: 'spacecraft', zh: '航天器', e: '🛸' },
          { w: 'space suit', zh: '航天服', e: '🧑‍🚀' }, { w: 'Solar System', zh: '太阳系', e: '🪐' },
          { w: 'eclipse', zh: '日食', e: '🌑' },
        ],
        sentences: [
          { en: 'You have to wear a space suit.', zh: '你必须穿航天服。' },
        ] },
      { id: 'gs6-m08l2', mod: 8, kind: 'unit',
        title: 'M8-L2 · Computer Words', zh: '电脑动作',
        words: [
          { w: 'press', zh: '按', e: '🖱️' }, { w: 'download', zh: '下载', e: '⬇️' },
          { w: 'print', zh: '打印', e: '🖨️' }, { w: 'turn on', zh: '打开', e: '💡' },
          { w: 'take exams', zh: '考试', e: '📝' }, { w: 'rescue', zh: '营救', e: '🛟' },
          { w: 'cry', zh: '哭', e: '😢' },
        ],
        sentences: [
          { en: 'Press the button to download.', zh: '按按钮下载。' },
        ] },
      { id: 'gs6-m08l3', mod: 8, kind: 'unit',
        title: 'M8-L3 · Visit Places', zh: '场馆',
        words: [
          { w: 'planetarium', zh: '天文馆', e: '🌌' }, { w: 'aquarium', zh: '水族馆', e: '🐠' },
          { w: 'bowling alley', zh: '保龄球馆', e: '🎳' }, { w: 'skatepark', zh: '滑板场', e: '🛹' },
          { w: 'stadium', zh: '体育场', e: '🏟️' }, { w: 'keyboard', zh: '键盘', e: '⌨️' },
          { w: 'printer', zh: '打印机', e: '🖨️' },
        ],
        sentences: [
          { en: 'Would you like to visit the planetarium? I would love to.', zh: '你想去天文馆吗？非常想。' },
        ] },
      { id: 'gs6-m08l4', mod: 8, kind: 'unit',
        title: 'M8-L4 · Words', zh: '更多词汇',
        words: [
          { w: 'huge', zh: '巨大的', e: '🐳' }, { w: 'important', zh: '重要的', e: '❗' },
          { w: 'recipe', zh: '食谱', e: '🍳' }, { w: 'hero', zh: '英雄', e: '🦸' },
          { w: 'accident', zh: '事故', e: '🚑' }, { w: 'smoke', zh: '烟', e: '💨' },
          { w: 'flag', zh: '旗', e: '🚩' },
        ],
        sentences: [
          { en: 'The astronaut is my hero.', zh: '宇航员是我的英雄。' },
        ] },
      { id: 'gs6-m08r', mod: 8, kind: 'review', title: 'Module 8 复习闯关', zh: '太空 · 电脑 · 场馆',
        from: ['gs6-m08l1', 'gs6-m08l2', 'gs6-m08l3', 'gs6-m08l4'], count: 10 },
      { id: 'gs6-m09l1', mod: 9, modName: 'Module 9 · Go green! 环保行动', modEmoji: '♻️', modTip: 'Phonics: /ʌ/ /uː/ /ɜːr/ · 品德: 公平游戏', kind: 'unit',
        title: 'M9-L1 · Pollution', zh: '污染',
        words: [
          { w: 'destroy', zh: '破坏', e: '💥' }, { w: 'pollute', zh: '污染', e: '🏭' },
          { w: 'pollution', zh: '污染', e: '🌫️' }, { w: 'fumes', zh: '废气', e: '🚛' },
          { w: 'acid rain', zh: '酸雨', e: '🌧️' }, { w: 'protect', zh: '保护', e: '🛡️' },
          { w: 'breathe', zh: '呼吸', e: '🫁' },
        ],
        sentences: [
          { en: 'Cars pollute the air.', zh: '汽车污染空气。' },
        ] },
      { id: 'gs6-m09l2', mod: 9, kind: 'unit',
        title: 'M9-L2 · Green Actions', zh: '环保行动',
        words: [
          { w: 'plant trees', zh: '植树', e: '🌳' }, { w: 'save', zh: '节约', e: '💧' },
          { w: 'turn into', zh: '变成', e: '🔄' }, { w: 'kill', zh: '杀死', e: '☠️' },
          { w: 'hurry up', zh: '赶快', e: '⏰' }, { w: 'smile', zh: '微笑', e: '😄' },
          { w: 'copy', zh: '抄袭', e: '📄' },
        ],
        sentences: [
          { en: 'If we plant trees, the air will be cleaner.', zh: '如果我们植树，空气会更干净。' },
        ] },
      { id: 'gs6-m09l3', mod: 9, kind: 'unit',
        title: 'M9-L3 · Green City', zh: '绿色城市',
        words: [
          { w: 'public transportation', zh: '公共交通', e: '🚇' }, { w: 'bicycle lane', zh: '自行车道', e: '🚲' },
          { w: 'traffic', zh: '交通', e: '🚦' }, { w: 'solar panel', zh: '太阳能板', e: '🔆' },
          { w: 'government', zh: '政府', e: '🏛️' }, { w: 'energy', zh: '能源', e: '⚡' },
          { w: 'judge', zh: '评审', e: '🧑‍⚖️' },
        ],
        sentences: [
          { en: 'Solar panels make clean energy.', zh: '太阳能板制造清洁能源。' },
        ] },
      { id: 'gs6-m09l4', mod: 9, kind: 'unit',
        title: 'M9-L4 · Nature Words', zh: '自然词汇',
        words: [
          { w: 'land', zh: '陆地', e: '🏝️' }, { w: 'shore', zh: '岸', e: '🏖️' },
          { w: 'seal', zh: '海豹', e: '🦭' }, { w: 'fin', zh: '鳍', e: '🐬' },
          { w: 'garage', zh: '车库', e: '🏚️' }, { w: 'alive', zh: '活着的', e: '🌿' },
          { w: 'harmful', zh: '有害的', e: '☣️' },
        ],
        sentences: [
          { en: 'We may see seals on the shore.', zh: '我们可能在岸边看到海豹。' },
        ] },
      { id: 'gs6-m09r', mod: 9, kind: 'review', title: 'Module 9 复习闯关', zh: '污染 · 行动 · 绿色城市',
        from: ['gs6-m09l1', 'gs6-m09l2', 'gs6-m09l3', 'gs6-m09l4'], count: 10 },
      { id: 'gs6-m10l1', mod: 10, modName: 'Module 10 · Healthy body, healthy mind 健康身心', modEmoji: '🩹', modTip: 'Phonics: /eɪ/ /aɪ/ /oʊ/ · 品德: 欲得朋友先为朋友', kind: 'unit',
        title: 'M10-L1 · Injuries', zh: '运动受伤',
        words: [
          { w: 'sprain', zh: '扭伤', e: '🦶' }, { w: 'ankle', zh: '脚踝', e: '🦵' },
          { w: 'cast', zh: '石膏', e: '🦴' }, { w: 'ambulance', zh: '救护车', e: '🚑' },
          { w: 'crutches', zh: '拐杖', e: '🩼' }, { w: 'dizzy', zh: '眩晕的', e: '💫' },
          { w: 'bleed', zh: '流血', e: '🩸' },
        ],
        sentences: [
          { en: 'He sprained his ankle.', zh: '他扭伤了脚踝。' },
        ] },
      { id: 'gs6-m10l2', mod: 10, kind: 'unit',
        title: 'M10-L2 · Fitness', zh: '健身',
        words: [
          { w: 'marathon', zh: '马拉松', e: '🏃' }, { w: 'triathlon', zh: '铁人三项', e: '🏊' },
          { w: 'triathlete', zh: '铁三选手', e: '🏅' }, { w: 'treadmill', zh: '跑步机', e: '🏃‍♀️' },
          { w: 'rowing machine', zh: '划船机', e: '🚣' }, { w: 'yoga', zh: '瑜伽', e: '🧘' },
          { w: 'ramp', zh: '坡道', e: '🛹' },
        ],
        sentences: [
          { en: 'She takes part in triathlons.', zh: '她参加铁人三项比赛。' },
        ] },
      { id: 'gs6-m10l3', mod: 10, kind: 'unit',
        title: 'M10-L3 · Healthy Habits', zh: '健康习惯',
        words: [
          { w: 'junk food', zh: '垃圾食品', e: '🍔' }, { w: 'veggie burger', zh: '素汉堡', e: '🥬' },
          { w: 'vegetarian', zh: '素食者', e: '🥦' }, { w: 'unhealthy', zh: '不健康的', e: '🍟' },
          { w: 'on a diet', zh: '节食', e: '⚖️' }, { w: 'lift weights', zh: '举重', e: '🏋️' },
          { w: 'do aerobics', zh: '做有氧操', e: '🤸' },
        ],
        sentences: [
          { en: 'You should not eat too much junk food.', zh: '你不该吃太多垃圾食品。' },
        ] },
      { id: 'gs6-m10l4', mod: 10, kind: 'unit',
        title: 'M10-L4 · Reported', zh: '转述',
        words: [
          { w: 'advice', zh: '建议', e: '💡' }, { w: 'decide', zh: '决定', e: '🧠' },
          { w: 'rest', zh: '休息', e: '😴' }, { w: 'laugh', zh: '笑', e: '😂' },
          { w: 'patient', zh: '病人', e: '🤒' }, { w: 'afraid of', zh: '害怕', e: '😨' },
          { w: 'keep still', zh: '保持不动', e: '🧘' },
        ],
        sentences: [
          { en: 'The coach told him to rest.', zh: '教练叫他休息。' },
          { en: 'She said she was dizzy.', zh: '她说她头晕。' },
        ] },
      { id: 'gs6-m10r', mod: 10, kind: 'review', title: 'Module 10 复习闯关 · 毕业大闯关', zh: '受伤 · 健身 · 习惯 · 转述',
        from: ['gs6-m10l1', 'gs6-m10l2', 'gs6-m10l3', 'gs6-m10l4'], count: 12 },
    ]
  },
];

/* 把专栏单词注册进本地发音包索引（app.js 的 __LOCAL_AUDIO）：
   每个词的 audio/<词>.mp3 都已生成，本地离线直接响，不用等有道。
   ★ 注意：本块必须始终是文件最后一段——之前 GS6 拼接时被误删，
   导致 681 个词退回在线源（微信/弱网全哑），务必保留。 */
try {
  if (typeof __LOCAL_AUDIO !== 'undefined') {
    GS_LEVELS.forEach(l => l.units.forEach(u => (u.words || []).forEach(w => {
      const k = String(w.w).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
      if (k) __LOCAL_AUDIO.add(k);
    })));
  }
} catch (e) {}
