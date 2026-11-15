/* ============================================================
   小鸟英语乐园 · 读书馆 v4（面向中国学生的受控词汇分级阅读）
   2026-11-15：10 站 × 12 本 = 120 本，正文约 16 → 260 词/本

   为什么推翻 v3：v3 的校验器只保证「本级字素拼得出来」，不保证
   「这个词孩子见过」。实测 42/60 本新词率 >30%，1268 个词种里
   624 个只出现一次 —— 孩子每页都在见生词，读不顺、记不住。

   v4 的四条铁律（由 _v4_build.py + _v4_check.py 强制）：
   ① 词汇受控：正文每个词要么在此前任何一本出现过（TAUGHT），
      要么是本本读前页（pre）预教的词，要么是整体认读骨架词。
      零例外、零「拼得出来但没教过」。
   ② 连贯故事：每本选一整条 story arc（12 条弧，按主题类别分配），
      15 个 beat 按因果串成一件完整的事；低级别取前几拍 + 结尾，
      高级别讲全 —— 页数梯度来自「讲得多细」，不是灌水句。
   ③ 复现：骨架词全库复用，每级第 12 本为复习册；新词承载句
      接在观察页与临近结尾页作为「一页词卡」，不切断故事。
   ④ 输出：每本 3 题 = 1 检索（答案从本本正文抽）+ 1 推理
      （L1-L3 有文本依据的预测 / L4+ 本本因果）+ 1 迁移到生活；
      题干与选项都带本本槽位，120 本各不相同。另加 think 开放题
      与分档 retell；中文默认隐藏，先读英文再按需求助。

   每站 12 本 = 8 本故事 + 1 本发音专项 + 2 本小科普 + 1 本复习册。
   配图 art 是场景码「场景|人物|物件|情绪」，由 read.html 的
   drawScene() 渲染成分镜插画，不再是单个 emoji。

   字素仍按 L1 整体认读 → L2 短元音 → L3 sh/ch/th/ck/ng → L4 连缀
   → L5 元音组合 → L6 魔法 e → L7 卷舌 → L8 新元音 → L9 综合
   → L10 桥梁书 放行；不规则拼写诚实登记为整体认读词。
   生成：python _v4_build.py && python _v4_check.py
   ============================================================ */
'use strict';

const BOOKS = [
  {
    id: 'b1', lv: 'L1', tag: '穿戴', title: 'My Hat', zh: '我的帽子',
    emoji: '🎩', color: '#F6C6C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「找回来」这条线，认读 2 个新词。',
    trap: '这一级是整体认读：词不用拼，先听整句，再跟着说；别一个字母一个字母念。',
    summary: '《我的帽子》是「找回来」：明明和奶奶在家，围绕帽子把一件事读到底。本本词卡：帽子、猫。读前先看词卡，读完合上书说一说。',
    retell: '看图说词：指一指，用英文大声说出这一页的东西。（这一本是「找回来」。）',
    think: '说说你丢过的一样东西：最后是在哪里找到的？',
    pre: [
      { art: '🎩', en: 'hat', zh: '帽子' },
      { art: '🐱', en: 'cat', zh: '猫' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👦', en: 'ming', zh: '明明' }
    ],
    sight: [],
    newWords: [
      { w: 'hat', zh: '帽子' },
      { w: 'cat', zh: '猫' }
    ],
    pages: [
      { art: 'home|ming,grandma|hat|·', en: 'Ming has a hat.', zh: '明明有一顶帽子。' },
      { art: 'home|ming,grandma|hat|♪', en: 'Ming likes the hat.', zh: '明明喜欢这顶帽子。' },
      { art: 'home|ming,grandma|hat|👀', en: 'One day the hat is not here.', zh: '有一天，帽子不见了。' },
      { art: 'home|ming,grandma|hat|?', en: 'Ming looks and looks.', zh: '明明找了又找。' },
      { art: 'home|ming,grandma|hat|·', en: 'Look! The hat is on the cat!', zh: '看！帽子在猫身上！' },
      { art: 'home|ming,grandma|hat|!', en: 'Ming laughs. The hat is back.', zh: '明明笑了。帽子回来了。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['苹果', '鸭子', '帽子'], a: 2, kind: 'recall' },
      { q: '帽子最后在哪里？', opts: ['在猫身上', '在桌子下面', '在水里'], a: 0, kind: 'infer' },
      { q: '东西不见了，你会先做什么？', opts: ['想一想它可能在哪里，再找找', '不管它了', '马上哭一场'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b2', lv: 'L1', tag: '宠物', title: 'My Cat', zh: '我的猫',
    emoji: '🐱', color: '#F9DFB4',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「合上书讲一遍」这条线，认读 1 个新词。',
    trap: '这一级是整体认读：词不用拼，先听整句，再跟着说；别一个字母一个字母念。',
    summary: '《我的猫》是「合上书讲一遍」：丽丽和爷爷在图书馆，围绕猫把一件事读到底。本本词卡：牛奶。读前先看词卡，读完合上书说一说。',
    retell: '看图说词：指一指，用英文大声说出这一页的东西。（这一本是「合上书讲一遍」。）',
    think: '说说你见过的一只小动物：它喜欢做什么？',
    pre: [
      { art: '🥛', en: 'milk', zh: '牛奶' },
      { art: '🐱', en: 'cat', zh: '猫' },
      { art: '📦', en: 'the', zh: 'the' }
    ],
    sight: [],
    newWords: [
      { w: 'milk', zh: '牛奶' }
    ],
    pages: [
      { art: 'library|lili,grandpa|cat|·', en: 'I have a cat.', zh: '我有一只猫。' },
      { art: 'library|lili,grandpa|cat|♪', en: 'My cat is small.', zh: '我的猫很小。' },
      { art: 'library|lili,grandpa|cat|👀', en: 'The cat likes milk.', zh: '猫喜欢牛奶。' },
      { art: 'library|lili,grandpa|cat|?', en: 'The cat sits on the bed.', zh: '猫坐在床上。' },
      { art: 'library|lili,grandpa|cat|·', en: 'The cat looks at me.', zh: '猫看着我。' },
      { art: 'library|lili,grandpa|cat|!', en: 'I like my cat.', zh: '我喜欢我的猫。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['盒子', '牛奶', '帽子'], a: 1, kind: 'recall' },
      { q: '猫喜欢什么？', opts: ['水', '牛奶', '茶'], a: 1, kind: 'infer' },
      { q: '想知道小动物喜欢什么，你会怎么做？', opts: ['一直追它', '静静看它做什么、吃什么', '不理它'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b3', lv: 'L1', tag: '颜色', title: 'Red and Blue', zh: '红和蓝',
    emoji: '🎨', color: '#CDE7C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「猜一猜」这条线，认读 1 个新词。',
    trap: '这一级是整体认读：词不用拼，先听整句，再跟着说；别一个字母一个字母念。',
    summary: '《红和蓝》是「猜一猜」：奶奶和妈妈在图书馆，围绕红色把一件事读到底。本本词卡：蓝色。读前先看词卡，读完合上书说一说。',
    retell: '看图说词：指一指，用英文大声说出这一页的东西。（这一本是「猜一猜」。）',
    think: '用英文说出你身边的三种颜色。',
    pre: [
      { art: '🔵', en: 'blue', zh: '蓝色' },
      { art: '📦', en: 'i', zh: 'i' },
      { art: '🏃', en: 'like', zh: '喜欢' }
    ],
    sight: [],
    newWords: [
      { w: 'blue', zh: '蓝色' }
    ],
    pages: [
      { art: 'library|grandma,mom|red|·', en: 'I see red.', zh: '我看见红色。' },
      { art: 'library|grandma,mom|red|♪', en: 'I see blue.', zh: '我看见蓝色。' },
      { art: 'library|grandma,mom|red|👀', en: 'This is red and that is blue.', zh: '这个是红的，那个是蓝的。' },
      { art: 'library|grandma,mom|red|?', en: 'Red here, blue there.', zh: '这边红，那边蓝。' },
      { art: 'library|grandma,mom|red|·', en: 'I like red. Do you like blue?', zh: '我喜欢红色。你喜欢蓝色吗？' },
      { art: 'library|grandma,mom|red|!', en: 'We like red and blue.', zh: '我们喜欢红色和蓝色。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['红色', '鸡蛋', '一'], a: 0, kind: 'recall' },
      { q: '这一本讲了哪两种颜色？', opts: ['红色和绿色', '红色和蓝色', '蓝色和黄色'], a: 1, kind: 'infer' },
      { q: '看到一样东西的颜色，你会怎么做？', opts: ['用英文说出它的颜色', '只看不说', '跳过去'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b4', lv: 'L1', tag: '吃饭', title: 'I Eat', zh: '我吃东西',
    emoji: '🍚', color: '#C6DEF6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「留一份」这条线，认读 3 个新词。',
    trap: '这一级是整体认读：词不用拼，先听整句，再跟着说；别一个字母一个字母念。',
    summary: '《我吃东西》是「留一份」：爷爷和爸爸在家，围绕米饭把一件事读到底。本本词卡：吃、米饭、苹果。读前先看词卡，读完合上书说一说。',
    retell: '看图说词：指一指，用英文大声说出这一页的东西。（这一本是「留一份」。）',
    think: '说说你最喜欢吃的一样东西。',
    pre: [
      { art: '🏃', en: 'eat', zh: '吃' },
      { art: '🍚', en: 'rice', zh: '米饭' },
      { art: '🍎', en: 'apple', zh: '苹果' },
      { art: '📦', en: 'i', zh: 'i' },
      { art: '🏃', en: 'like', zh: '喜欢' }
    ],
    sight: [],
    newWords: [
      { w: 'eat', zh: '吃' },
      { w: 'rice', zh: '米饭' },
      { w: 'apple', zh: '苹果' }
    ],
    pages: [
      { art: 'kitchen|grandpa,dad|rice|·', en: 'I eat rice.', zh: '我吃米饭。' },
      { art: 'kitchen|grandpa,dad|rice|♪', en: 'I like rice.', zh: '我喜欢米饭。' },
      { art: 'kitchen|grandpa,dad|rice|👀', en: 'I eat an apple too.', zh: '我还吃了一个苹果。' },
      { art: 'kitchen|grandpa,dad|rice|?', en: 'The apple is good.', zh: '苹果很好吃。' },
      { art: 'kitchen|grandpa,dad|rice|·', en: 'I eat and eat.', zh: '我吃啊吃。' },
      { art: 'kitchen|grandpa,dad|rice|!', en: 'I am happy.', zh: '我很开心。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['苹果', '帽子', '茶'], a: 0, kind: 'recall' },
      { q: '我吃了什么？', opts: ['米饭和苹果', '米饭和鸡蛋', '苹果和鱼'], a: 0, kind: 'infer' },
      { q: '吃东西时，你会怎么做？', opts: ['一口全吞下去', '慢慢吃，尝尝味道', '不吃了'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b5', lv: 'L1', tag: '上学', title: 'My Bag', zh: '我的书包',
    emoji: '🎒', color: '#E0CFF3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「收拾整齐」这条线，认读 2 个新词。',
    trap: '这一级是整体认读：词不用拼，先听整句，再跟着说；别一个字母一个字母念。',
    summary: '《我的书包》是「收拾整齐」：妈妈和明明在家，围绕书包把一件事读到底。本本词卡：书包、笔。读前先看词卡，读完合上书说一说。',
    retell: '看图说词：指一指，用英文大声说出这一页的东西。（这一本是「收拾整齐」。）',
    think: '说说你的书包里有什么。',
    pre: [
      { art: '🎒', en: 'bag', zh: '书包' },
      { art: '🖊️', en: 'pen', zh: '笔' },
      { art: '📦', en: 'my', zh: 'my' },
      { art: '📦', en: 'is', zh: 'is' }
    ],
    sight: [],
    newWords: [
      { w: 'bag', zh: '书包' },
      { w: 'pen', zh: '笔' }
    ],
    pages: [
      { art: 'home|mom,ming|bag|·', en: 'I have a bag.', zh: '我有一个书包。' },
      { art: 'home|mom,ming|bag|♪', en: 'My bag is big.', zh: '我的书包很大。' },
      { art: 'home|mom,ming|bag|👀', en: 'What is in my bag?', zh: '我的书包里有什么？' },
      { art: 'home|mom,ming|bag|?', en: 'A pen is in my bag.', zh: '书包里有一支笔。' },
      { art: 'home|mom,ming|bag|·', en: 'A book is in my bag too.', zh: '书包里还有一本书。' },
      { art: 'home|mom,ming|bag|!', en: 'I like my bag.', zh: '我喜欢我的书包。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['球', '猪', '书包'], a: 2, kind: 'recall' },
      { q: '书包里有什么？', opts: ['笔和书', '书和苹果', '笔和帽子'], a: 0, kind: 'infer' },
      { q: '想找书包里的东西，你会怎么做？', opts: ['把东西全倒出来', '打开书包，一样一样看一看', '不找了'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b6', lv: 'L1', tag: '天气', title: 'The Sun', zh: '太阳',
    emoji: '☀️', color: '#F6C9E3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「睡不着」这条线，认读 5 个新词。',
    trap: '这一级是整体认读：词不用拼，先听整句，再跟着说；别一个字母一个字母念。',
    summary: '《太阳》是「睡不着」：爸爸和丽丽在家，围绕太阳把一件事读到底。本本词卡：太阳、天空、热、暖、手。读前先看词卡，读完合上书说一说。',
    retell: '看图说词：指一指，用英文大声说出这一页的东西。（这一本是「睡不着」。）',
    think: '说说有太阳的时候，你会做什么。',
    pre: [
      { art: '☀️', en: 'sun', zh: '太阳' },
      { art: '🌿', en: 'sky', zh: '天空' },
      { art: '🔥', en: 'hot', zh: '热' },
      { art: '✨', en: 'warm', zh: '暖' },
      { art: '✋', en: 'hand', zh: '手' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'is', zh: 'is' }
    ],
    sight: [],
    newWords: [
      { w: 'sun', zh: '太阳' },
      { w: 'sky', zh: '天空' },
      { w: 'hot', zh: '热' },
      { w: 'warm', zh: '暖' },
      { w: 'hand', zh: '手' }
    ],
    pages: [
      { art: 'night|dad,lili|sun|·', en: 'The sun is in the sky.', zh: '太阳在天上。' },
      { art: 'night|dad,lili|sun|♪', en: 'The sun is big and hot.', zh: '太阳又大又热。' },
      { art: 'night|dad,lili|sun|👀', en: 'The sun is up.', zh: '太阳升起来了。' },
      { art: 'night|dad,lili|sun|?', en: 'The sun is warm on my hand.', zh: '太阳照在手上，暖暖的。' },
      { art: 'night|dad,lili|sun|·', en: 'I like the sun.', zh: '我喜欢太阳。' },
      { art: 'night|dad,lili|sun|!', en: 'The sun is good.', zh: '太阳真好。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['罐子', '手', '树'], a: 1, kind: 'recall' },
      { q: '太阳是什么样的？', opts: ['又小又冷', '又小又热', '又大又热'], a: 2, kind: 'infer' },
      { q: '太阳很晒的时候，你会怎么做？', opts: ['一直站在太阳下', '找阴凉的地方待着', '不管它'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b7', lv: 'L1', tag: '比一比', title: 'Big and Small', zh: '大和小',
    emoji: '🐘', color: '#BFE6DF',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「比一比」这条线，认读 1 个新词。',
    trap: '这一级是整体认读：词不用拼，先听整句，再跟着说；别一个字母一个字母念。',
    summary: '《大和小》是「比一比」：明明和奶奶在操场，围绕球把一件事读到底。本本词卡：球。读前先看词卡，读完合上书说一说。',
    retell: '看图说词：指一指，用英文大声说出这一页的东西。（这一本是「比一比」。）',
    think: '找两样东西，说说哪个大、哪个小。',
    pre: [
      { art: '⚽', en: 'ball', zh: '球' },
      { art: '📦', en: 'i', zh: 'i' },
      { art: '📦', en: 'is', zh: 'is' }
    ],
    sight: [],
    newWords: [
      { w: 'ball', zh: '球' }
    ],
    pages: [
      { art: 'playground|ming,grandma|ball|·', en: 'I have a ball.', zh: '我有一个球。' },
      { art: 'playground|ming,grandma|ball|♪', en: 'This ball is big.', zh: '这个球很大。' },
      { art: 'playground|ming,grandma|ball|👀', en: 'That ball is small.', zh: '那个球很小。' },
      { art: 'playground|ming,grandma|ball|?', en: 'I like the big ball.', zh: '我喜欢大球。' },
      { art: 'playground|ming,grandma|ball|·', en: 'The small ball is good too.', zh: '小球也不错。' },
      { art: 'playground|ming,grandma|ball|!', en: 'Big and small, I like them all.', zh: '大的、小的，我都喜欢。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['宝宝', '鸡蛋', '球'], a: 2, kind: 'recall' },
      { q: '这一本讲了球的什么？', opts: ['大的和小的', '新的和旧的', '红的和蓝的'], a: 0, kind: 'infer' },
      { q: '要比两样东西的大小，你会怎么做？', opts: ['只看一个就说', '把它们放在一起比一比', '随便说一个'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b8', lv: 'L1', tag: '家里', title: 'My Cup', zh: '我的杯子',
    emoji: '🥛', color: '#F2E2A8',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「收好它」这条线，认读 1 个新词。',
    trap: '这一级是整体认读：词不用拼，先听整句，再跟着说；别一个字母一个字母念。',
    summary: '《我的杯子》是「收好它」：丽丽和爷爷在家，围绕杯子把一件事读到底。本本词卡：杯子。读前先看词卡，读完合上书说一说。',
    retell: '看图说词：指一指，用英文大声说出这一页的东西。（这一本是「收好它」。）',
    think: '说说你用什么杯子喝水。',
    pre: [
      { art: '🥛', en: 'cup', zh: '杯子' },
      { art: '📦', en: 'my', zh: 'my' },
      { art: '📦', en: 'is', zh: 'is' }
    ],
    sight: [],
    newWords: [
      { w: 'cup', zh: '杯子' }
    ],
    pages: [
      { art: 'home|lili,grandpa|cup|·', en: 'I have a cup.', zh: '我有一个杯子。' },
      { art: 'home|lili,grandpa|cup|♪', en: 'My cup is red.', zh: '我的杯子是红色的。' },
      { art: 'home|lili,grandpa|cup|👀', en: 'What is in my cup?', zh: '我的杯子里有什么？' },
      { art: 'home|lili,grandpa|cup|?', en: 'Milk is in my cup.', zh: '杯子里有牛奶。' },
      { art: 'home|lili,grandpa|cup|·', en: 'I like milk.', zh: '我喜欢牛奶。' },
      { art: 'home|lili,grandpa|cup|!', en: 'My cup is good.', zh: '我的杯子真好。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['猫', '丽丽', '红色'], a: 2, kind: 'recall' },
      { q: '杯子里有什么？', opts: ['水', '茶', '牛奶'], a: 2, kind: 'infer' },
      { q: '想知道杯子里装了什么，你会怎么做？', opts: ['不看', '打开盖子看一看', '猜一猜就算了'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b9', lv: 'L1', tag: '发音', title: 'Say It: Hat', zh: '说一说：帽子',
    emoji: '🗣️', color: '#D9D2F5',
    track: 'drill',
    goal: '把本级难点音听准、说准，并能在整句里读对。这一本走「跟读整句」这条线，不引入新词，全部是读过的词。',
    trap: '这一级是整体认读：词不用拼，先听整句，再跟着说；别一个字母一个字母念。',
    summary: '《说一说：帽子》是「跟读整句」：奶奶和妈妈在家，围绕帽子把一件事读到底。本本词卡：这一本不引入新词，全部是读过的词。读前先看词卡，读完合上书说一说。',
    retell: '看图说词：指一指，用英文大声说出这一页的东西。（这一本是「跟读整句」。）',
    think: '用英文说出三样你能看见的东西。',
    pre: [
      { art: '🎩', en: 'hat', zh: '帽子' },
      { art: '🏃', en: 'say', zh: '说' }
    ],
    sight: [],
    newWords: [

    ],
    pages: [
      { art: 'table|grandma,mom|hat|·', en: 'This is a hat.', zh: '这是一顶帽子。' },
      { art: 'table|grandma,mom|hat|♪', en: 'Say it: hat.', zh: '说一说：帽子。' },
      { art: 'table|grandma,mom|hat|👀', en: 'Hat, hat, hat.', zh: '帽子、帽子、帽子。' },
      { art: 'table|grandma,mom|hat|?', en: 'Now say it with me.', zh: '现在跟我一起说。' },
      { art: 'table|grandma,mom|hat|·', en: 'Hat!', zh: '帽子！' },
      { art: 'table|grandma,mom|hat|!', en: 'Good! You can say it.', zh: '真棒！你会说了。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['朋友', '猪', '帽子'], a: 2, kind: 'recall' },
      { q: '这一本在练什么？', opts: ['说「书」这个词', '说「猫」这个词', '说「帽子」这个词'], a: 2, kind: 'infer' },
      { q: '遇到一个新单词，你会怎么做？', opts: ['跳过去', '不敢说', '跟着大声说出来'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b10', lv: 'L1', tag: '认物', title: 'This Is a Book', zh: '这是一本书',
    emoji: '📖', color: '#FAD3B6',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。这一本走「数一数」这条线，不引入新词，全部是读过的词。',
    trap: '这一级是整体认读：词不用拼，先听整句，再跟着说；别一个字母一个字母念。',
    summary: '《这是一本书》是「数一数」：爷爷和爸爸在学校，围绕书把一件事读到底。本本词卡：这一本不引入新词，全部是读过的词。读前先看词卡，读完合上书说一说。',
    retell: '看图说词：指一指，用英文大声说出这一页的东西。（这一本是「数一数」。）',
    think: '说说你读过的一本书里有什么。',
    pre: [
      { art: '📖', en: 'book', zh: '书' },
      { art: '📦', en: 'is', zh: 'is' }
    ],
    sight: [],
    newWords: [

    ],
    pages: [
      { art: 'school|grandpa,dad|book|·', en: 'This is a book.', zh: '这是一本书。' },
      { art: 'school|grandpa,dad|book|♪', en: 'I like my book.', zh: '我喜欢我的书。' },
      { art: 'school|grandpa,dad|book|👀', en: 'What is in the book?', zh: '书里有什么？' },
      { art: 'school|grandpa,dad|book|?', en: 'A cat is in the book.', zh: '书里有一只猫。' },
      { art: 'school|grandpa,dad|book|·', en: 'The sun is in the book too.', zh: '书里还有太阳。' },
      { art: 'school|grandpa,dad|book|!', en: 'I like to read my book.', zh: '我喜欢读我的书。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['明明', '太阳', '水'], a: 1, kind: 'recall' },
      { q: '书里有什么？', opts: ['太阳和树', '猫和太阳', '猫和狗'], a: 1, kind: 'infer' },
      { q: '读书的时候，你会怎么做？', opts: ['不看', '随便翻翻就合上', '一页一页慢慢看'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b11', lv: 'L1', tag: '认物', title: 'Water and Rice', zh: '水和米饭',
    emoji: '💧', color: '#C8E7F0',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。这一本走「合上书讲一遍」这条线，认读 2 个新词。',
    trap: '这一级是整体认读：词不用拼，先听整句，再跟着说；别一个字母一个字母念。',
    summary: '《水和米饭》是「合上书讲一遍」：妈妈和明明在沙滩，围绕水把一件事读到底。本本词卡：水、喝。读前先看词卡，读完合上书说一说。',
    retell: '看图说词：指一指，用英文大声说出这一页的东西。（这一本是「合上书讲一遍」。）',
    think: '说说你吃饭时会喝什么、吃什么。',
    pre: [
      { art: '💧', en: 'water', zh: '水' },
      { art: '🏃', en: 'drink', zh: '喝' },
      { art: '📦', en: 'i', zh: 'i' },
      { art: '🍚', en: 'rice', zh: '米饭' }
    ],
    sight: ['eat'],
    newWords: [
      { w: 'water', zh: '水' },
      { w: 'drink', zh: '喝' }
    ],
    pages: [
      { art: 'beach|mom,ming|water|·', en: 'I see water.', zh: '我看见水。' },
      { art: 'beach|mom,ming|water|♪', en: 'I see rice.', zh: '我看见米饭。' },
      { art: 'beach|mom,ming|water|👀', en: 'Water and rice.', zh: '水和米饭。' },
      { art: 'beach|mom,ming|water|?', en: 'I drink the water.', zh: '我喝水。' },
      { art: 'beach|mom,ming|water|·', en: 'I eat the rice.', zh: '我吃米饭。' },
      { art: 'beach|mom,ming|water|!', en: 'Water and rice are good.', zh: '水和米饭都好。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['水', '球', '笔'], a: 0, kind: 'recall' },
      { q: '我喝了什么、吃了什么？', opts: ['牛奶和鸡蛋', '茶和苹果', '水和米饭'], a: 2, kind: 'infer' },
      { q: '吃饭的时候，你会怎么做？', opts: ['不吃了', '坐好，慢慢吃', '一边跑一边吃'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b12', lv: 'L1', tag: '复习', title: 'All Together', zh: '都在一起',
    emoji: '🌈', color: '#E8D9B5',
    track: 'review',
    goal: '把本级和前面级别的词再读一遍、串成一个故事。这一本走「猜一猜」这条线，不引入新词，全部是读过的词。',
    trap: '这一级是整体认读：词不用拼，先听整句，再跟着说；别一个字母一个字母念。',
    summary: '《都在一起》是「猜一猜」：爸爸和丽丽在图书馆，围绕盒子把一件事读到底。本本词卡：这一本不引入新词，全部是读过的词。读前先看词卡，读完合上书说一说。',
    retell: '看图说词：指一指，用英文大声说出这一页的东西。（这一本是「猜一猜」。）',
    think: '找三样东西，用英文说出它们的名字。',
    pre: [
      { art: '📦', en: 'box', zh: '盒子' },
      { art: '📦', en: 'is', zh: 'is' }
    ],
    sight: [],
    newWords: [

    ],
    pages: [
      { art: 'library|dad,lili|box|·', en: 'Here is a box.', zh: '这里有一个盒子。' },
      { art: 'library|dad,lili|box|♪', en: 'What is in the box?', zh: '盒子里有什么？' },
      { art: 'library|dad,lili|box|👀', en: 'A hat is in the box.', zh: '盒子里有一顶帽子。' },
      { art: 'library|dad,lili|box|?', en: 'A cup is in the box too.', zh: '盒子里还有一个杯子。' },
      { art: 'library|dad,lili|box|·', en: 'Hat, cup, box!', zh: '帽子、杯子、盒子！' },
      { art: 'library|dad,lili|box|!', en: 'They are all together.', zh: '它们都在一起。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['鸭子', '杯子', '黄色'], a: 1, kind: 'recall' },
      { q: '盒子里有什么？', opts: ['帽子和杯子', '杯子和苹果', '帽子和书'], a: 0, kind: 'infer' },
      { q: '想记住几样东西，你会怎么做？', opts: ['不记了', '把它们放在一起，一起看', '随便乱放'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b13', lv: 'L2', tag: '农场', title: 'A Pig and a Hen', zh: '小猪和母鸡',
    emoji: '🐷', color: '#F6C6C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「看着它」这条线，认读 2 个新词。',
    trap: '短元音要收住韵尾：cap 的 p 是双唇轻轻一闭，不要加「呃」读成「卡普呃」。',
    summary: '《小猪和母鸡》是「看着它」：明明和奶奶在农场，围绕猪把一件事读到底。本本词卡：母鸡、胖。读前先看词卡，读完合上书说一说。',
    retell: '看图说词：用 a pig / a bag 说两样东西，再听一遍整句。（这一本是「看着它」。）',
    think: '说说两种小动物：它们长得一样吗？',
    pre: [
      { art: '🐔', en: 'hen', zh: '母鸡' },
      { art: '✨', en: 'fat', zh: '胖' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'i', zh: 'i' }
    ],
    sight: ['friends'],
    newWords: [
      { w: 'hen', zh: '母鸡' },
      { w: 'fat', zh: '胖' }
    ],
    pages: [
      { art: 'farm|ming,grandma|pig|·', en: 'I see a pig.', zh: '我看见一头猪。' },
      { art: 'farm|ming,grandma|pig|♪', en: 'I see a hen too.', zh: '我还看见一只母鸡。' },
      { art: 'farm|ming,grandma|pig|👀', en: 'The pig is fat.', zh: '猪胖胖的。' },
      { art: 'farm|ming,grandma|pig|?', en: 'The hen is small.', zh: '母鸡小小的。' },
      { art: 'farm|ming,grandma|pig|·', en: 'The pig runs to the hen.', zh: '猪跑向母鸡。' },
      { art: 'farm|ming,grandma|pig|!', en: 'The hen runs to the pig.', zh: '母鸡跑向猪。' },
      { art: 'farm|ming,grandma|pig|♥', en: 'The pig and the hen are friends.', zh: '猪和母鸡成了朋友。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['杯子', '猪', '蝙蝠'], a: 1, kind: 'recall' },
      { q: '猪和母鸡最后怎么了？', opts: ['它们打了一架', '它们各自走了', '它们成了朋友'], a: 2, kind: 'infer' },
      { q: '想和小动物交朋友，你会怎么做？', opts: ['吓它一跳', '追着它跑', '轻轻靠近，对它好'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b14', lv: 'L2', tag: '穿戴', title: 'The Red Cap', zh: '红帽子',
    emoji: '🧢', color: '#F9DFB4',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「借了要还」这条线，认读 3 个新词。',
    trap: '短元音要收住韵尾：cap 的 p 是双唇轻轻一闭，不要加「呃」读成「卡普呃」。',
    summary: '《红帽子》是「借了要还」：丽丽和爷爷在家，围绕鸭舌帽把一件事读到底。本本词卡：鸭舌帽、穿、头。读前先看词卡，读完合上书说一说。',
    retell: '看图说词：用 a cap / a hat 说两样东西，再听一遍整句。（这一本是「借了要还」。）',
    think: '说说你的一顶帽子或一样穿戴。',
    pre: [
      { art: '🧢', en: 'cap', zh: '鸭舌帽' },
      { art: '🏃', en: 'wear', zh: '穿' },
      { art: '✋', en: 'head', zh: '头' },
      { art: '📦', en: 'my', zh: 'my' },
      { art: '📦', en: 'i', zh: 'i' }
    ],
    sight: [],
    newWords: [
      { w: 'cap', zh: '鸭舌帽' },
      { w: 'wear', zh: '穿' },
      { w: 'head', zh: '头' }
    ],
    pages: [
      { art: 'home|lili,grandpa|cap|·', en: 'I have a red cap.', zh: '我有一顶红色的帽子。' },
      { art: 'home|lili,grandpa|cap|♪', en: 'I wear my cap.', zh: '我戴上帽子。' },
      { art: 'home|lili,grandpa|cap|👀', en: 'My cap is on my head.', zh: '帽子戴在头上。' },
      { art: 'home|lili,grandpa|cap|?', en: 'I like my red cap.', zh: '我喜欢我的红帽子。' },
      { art: 'home|lili,grandpa|cap|·', en: 'One day my cap is not here.', zh: '有一天，帽子不见了。' },
      { art: 'home|lili,grandpa|cap|!', en: 'I look for my cap.', zh: '我找啊找。' },
      { art: 'home|lili,grandpa|cap|♥', en: 'I find my cap!', zh: '我找到帽子了！' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['公交车', '鸭舌帽', '奶奶'], a: 1, kind: 'recall' },
      { q: '我的帽子是什么颜色的？', opts: ['蓝色', '黄色', '红色'], a: 2, kind: 'infer' },
      { q: '东西不见了，你会怎么做？', opts: ['马上哭', '不要了', '想一想可能在哪儿，再去找'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b15', lv: 'L2', tag: '天气', title: 'Mud and Fog', zh: '泥和雾',
    emoji: '🌫️', color: '#CDE7C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「找回它们」这条线，认读 5 个新词。',
    trap: '短元音要收住韵尾：cap 的 p 是双唇轻轻一闭，不要加「呃」读成「卡普呃」。',
    summary: '《泥和雾》是「找回它们」：奶奶和妈妈在农场，围绕泥把一件事读到底。本本词卡：干、雾、路、湿、泥。读前先看词卡，读完合上书说一说。',
    retell: '看图说词：用 a mud / a cup 说两样东西，再听一遍整句。（这一本是「找回它们」。）',
    think: '说说一个有雾或下雨的日子。',
    pre: [
      { art: '✨', en: 'dry', zh: '干' },
      { art: '🌫️', en: 'fog', zh: '雾' },
      { art: '🛣️', en: 'road', zh: '路' },
      { art: '✨', en: 'wet', zh: '湿' },
      { art: '🟤', en: 'mud', zh: '泥' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'is', zh: 'is' }
    ],
    sight: [],
    newWords: [
      { w: 'dry', zh: '干' },
      { w: 'fog', zh: '雾' },
      { w: 'road', zh: '路' },
      { w: 'wet', zh: '湿' },
      { w: 'mud', zh: '泥' }
    ],
    pages: [
      { art: 'farm|grandma,mom|mud|·', en: 'The day is not dry.', zh: '这一天不干爽。' },
      { art: 'farm|grandma,mom|mud|♪', en: 'There is fog.', zh: '有雾。' },
      { art: 'farm|grandma,mom|mud|👀', en: 'The road is wet.', zh: '路是湿的。' },
      { art: 'farm|grandma,mom|mud|?', en: 'I see mud.', zh: '我看见泥。' },
      { art: 'farm|grandma,mom|mud|·', en: 'The mud is not dry.', zh: '泥还没干。' },
      { art: 'farm|grandma,mom|mud|!', en: 'I do not like the mud.', zh: '我不喜欢泥。' },
      { art: 'farm|grandma,mom|mud|♥', en: 'I wait for a dry day.', zh: '我等一个干爽的日子。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['泥', '帽子', '爸爸'], a: 0, kind: 'recall' },
      { q: '为什么路上有泥？', opts: ['因为太阳太大', '因为又湿又有雾', '因为太干了'], a: 1, kind: 'infer' },
      { q: '路又湿又滑，你会怎么做？', opts: ['不管它', '慢慢走，小心一点', '拔腿就跑'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b16', lv: 'L2', tag: '观察', title: 'My Little Bug', zh: '我的小虫',
    emoji: '🐛', color: '#C6DEF6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「等它长」这条线，认读 2 个新词。',
    trap: '短元音要收住韵尾：cap 的 p 是双唇轻轻一闭，不要加「呃」读成「卡普呃」。',
    summary: '《我的小虫》是「等它长」：爷爷和爸爸在花园，围绕小虫把一件事读到底。本本词卡：小虫、石头。读前先看词卡，读完合上书说一说。',
    retell: '看图说词：用 a bug / a ball 说两样东西，再听一遍整句。（这一本是「等它长」。）',
    think: '说说你见过的一只小虫：它当时在做什么？',
    pre: [
      { art: '🐛', en: 'bug', zh: '小虫' },
      { art: '🌿', en: 'rock', zh: '石头' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'i', zh: 'i' }
    ],
    sight: [],
    newWords: [
      { w: 'bug', zh: '小虫' },
      { w: 'rock', zh: '石头' }
    ],
    pages: [
      { art: 'garden|grandpa,dad|bug|·', en: 'I see a little bug.', zh: '我看见一只小虫。' },
      { art: 'garden|grandpa,dad|bug|♪', en: 'The bug is on a rock.', zh: '小虫在石头上。' },
      { art: 'garden|grandpa,dad|bug|👀', en: 'The bug is small.', zh: '小虫很小。' },
      { art: 'garden|grandpa,dad|bug|?', en: 'I look at the bug.', zh: '我看着小虫。' },
      { art: 'garden|grandpa,dad|bug|·', en: 'The bug hops to my hand.', zh: '小虫跳到我手上。' },
      { art: 'garden|grandpa,dad|bug|!', en: 'I like my little bug.', zh: '我喜欢这只小虫。' },
      { art: 'garden|grandpa,dad|bug|♥', en: 'The bug hops back to the rock.', zh: '小虫跳回石头上。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['小虫', '奶奶', '盖子'], a: 0, kind: 'recall' },
      { q: '小虫跳到了哪里？', opts: ['我的手上', '树叶上', '水里'], a: 0, kind: 'infer' },
      { q: '看到一只小虫，你会怎么做？', opts: ['轻轻看着它，别吓它', '踩它一脚', '伸手去抓它'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b17', lv: 'L2', tag: '厨房', title: 'A Big Pot', zh: '一口大锅',
    emoji: '🍲', color: '#E0CFF3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「一起做饭」这条线，认读 3 个新词。',
    trap: '短元音要收住韵尾：cap 的 p 是双唇轻轻一闭，不要加「呃」读成「卡普呃」。',
    summary: '《一口大锅》是「一起做饭」：妈妈和明明在家，围绕锅把一件事读到底。本本词卡：锅、厨房、盖子。读前先看词卡，读完合上书说一说。',
    retell: '看图说词：用 a pot / a ball 说两样东西，再听一遍整句。（这一本是「一起做饭」。）',
    think: '说说你家厨房里的一样东西。',
    pre: [
      { art: '🍲', en: 'pot', zh: '锅' },
      { art: '🍳', en: 'kitchen', zh: '厨房' },
      { art: '📦', en: 'lid', zh: '盖子' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'is', zh: 'is' }
    ],
    sight: [],
    newWords: [
      { w: 'pot', zh: '锅' },
      { w: 'kitchen', zh: '厨房' },
      { w: 'lid', zh: '盖子' }
    ],
    pages: [
      { art: 'kitchen|mom,ming|pot|·', en: 'I see a big pot.', zh: '我看见一口大锅。' },
      { art: 'kitchen|mom,ming|pot|♪', en: 'The pot is in the kitchen.', zh: '锅在厨房里。' },
      { art: 'kitchen|mom,ming|pot|👀', en: 'What is in the pot?', zh: '锅里有什么？' },
      { art: 'kitchen|mom,ming|pot|?', en: 'The pot is hot.', zh: '锅很热。' },
      { art: 'kitchen|mom,ming|pot|·', en: 'A lid is on the pot.', zh: '锅上有个盖子。' },
      { art: 'kitchen|mom,ming|pot|!', en: 'I like the pot.', zh: '我喜欢这口锅。' },
      { art: 'kitchen|mom,ming|pot|♥', en: 'The pot is for all of us.', zh: '这口锅是给我们大家用的。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['头', '厨房', '妈妈'], a: 1, kind: 'recall' },
      { q: '锅在哪里？', opts: ['花园里', '卧室里', '厨房里'], a: 2, kind: 'infer' },
      { q: '锅很烫的时候，你会怎么做？', opts: ['伸手摸一摸', '不管它', '离远一点，别碰它'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b18', lv: 'L2', tag: '出门', title: 'The Bus Is Here', zh: '公交车来了',
    emoji: '🚌', color: '#F6C9E3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「帮忙买」这条线，认读 1 个新词。',
    trap: '短元音要收住韵尾：cap 的 p 是双唇轻轻一闭，不要加「呃」读成「卡普呃」。',
    summary: '《公交车来了》是「帮忙买」：爸爸和丽丽在街道，围绕公交车把一件事读到底。本本词卡：公交车。读前先看词卡，读完合上书说一说。',
    retell: '看图说词：用 a bus / a school 说两样东西，再听一遍整句。（这一本是「帮忙买」。）',
    think: '说说你坐过的一种车。',
    pre: [
      { art: '🚌', en: 'bus', zh: '公交车' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'i', zh: 'i' }
    ],
    sight: [],
    newWords: [
      { w: 'bus', zh: '公交车' }
    ],
    pages: [
      { art: 'street|dad,lili|bus|·', en: 'I see a bus.', zh: '我看见一辆公交车。' },
      { art: 'street|dad,lili|bus|♪', en: 'The bus is big.', zh: '公交车很大。' },
      { art: 'street|dad,lili|bus|👀', en: 'The bus is here!', zh: '公交车来了！' },
      { art: 'street|dad,lili|bus|?', en: 'I get on the bus.', zh: '我上了车。' },
      { art: 'street|dad,lili|bus|·', en: 'The bus runs and runs.', zh: '公交车跑啊跑。' },
      { art: 'street|dad,lili|bus|!', en: 'The bus stops here.', zh: '公交车停在这里。' },
      { art: 'street|dad,lili|bus|♥', en: 'I like the bus.', zh: '我喜欢公交车。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['厨房', '坚果', '公交车'], a: 2, kind: 'recall' },
      { q: '我是怎么去的？', opts: ['坐公交车', '走路', '骑自行车'], a: 0, kind: 'infer' },
      { q: '等公交车的时候，你会怎么做？', opts: ['不等了', '跑到路中间去', '站在安全的地方等它来'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b19', lv: 'L2', tag: '找路', title: 'A Map for Ming', zh: '明明的地图',
    emoji: '🗺️', color: '#BFE6DF',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「找路」这条线，认读 2 个新词。',
    trap: '短元音要收住韵尾：cap 的 p 是双唇轻轻一闭，不要加「呃」读成「卡普呃」。',
    summary: '《明明的地图》是「找路」：明明和奶奶在街道，围绕地图把一件事读到底。本本词卡：地图、小山。读前先看词卡，读完合上书说一说。',
    retell: '看图说词：用 a map / a hat 说两样东西，再听一遍整句。（这一本是「找路」。）',
    think: '说说地图能帮你做什么。',
    pre: [
      { art: '🗺️', en: 'map', zh: '地图' },
      { art: '🌿', en: 'hill', zh: '小山' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👦', en: 'ming', zh: '明明' }
    ],
    sight: [],
    newWords: [
      { w: 'map', zh: '地图' },
      { w: 'hill', zh: '小山' }
    ],
    pages: [
      { art: 'street|ming,grandma|map|·', en: 'Ming has a map.', zh: '明明有一张地图。' },
      { art: 'street|ming,grandma|map|♪', en: 'The map is for Ming.', zh: '地图是给明明的。' },
      { art: 'street|ming,grandma|map|👀', en: 'What is on the map?', zh: '地图上有什么？' },
      { art: 'street|ming,grandma|map|?', en: 'A hill is on the map.', zh: '地图上有一座小山。' },
      { art: 'street|ming,grandma|map|·', en: 'Ming looks at the map.', zh: '明明看着地图。' },
      { art: 'street|ming,grandma|map|!', en: 'Ming finds the way.', zh: '明明找到了路。' },
      { art: 'street|ming,grandma|map|♥', en: 'The map is good!', zh: '地图真好！' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['泥', '地图', '石头'], a: 1, kind: 'recall' },
      { q: '地图上有什么？', opts: ['一个杯子', '一只猫', '一座小山'], a: 2, kind: 'infer' },
      { q: '找不到路的时候，你会怎么做？', opts: ['看看地图，找一找', '随便乱走', '不走了'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b20', lv: 'L2', tag: '早餐', title: 'Jam on a Bun', zh: '面包上的果酱',
    emoji: '🍞', color: '#F2E2A8',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「混一混」这条线，认读 2 个新词。',
    trap: '短元音要收住韵尾：cap 的 p 是双唇轻轻一闭，不要加「呃」读成「卡普呃」。',
    summary: '《面包上的果酱》是「混一混」：丽丽和爷爷在家，围绕果酱把一件事读到底。本本词卡：小面包、果酱。读前先看词卡，读完合上书说一说。',
    retell: '看图说词：用 a jam / a book 说两样东西，再听一遍整句。（这一本是「混一混」。）',
    think: '说说你最喜欢的一种吃的。',
    pre: [
      { art: '🍞', en: 'bun', zh: '小面包' },
      { art: '🍯', en: 'jam', zh: '果酱' },
      { art: '📦', en: 'i', zh: 'i' },
      { art: '📦', en: 'the', zh: 'the' }
    ],
    sight: ['eat'],
    newWords: [
      { w: 'bun', zh: '小面包' },
      { w: 'jam', zh: '果酱' }
    ],
    pages: [
      { art: 'kitchen|lili,grandpa|jam|·', en: 'I see a bun.', zh: '我看见一个面包。' },
      { art: 'kitchen|lili,grandpa|jam|♪', en: 'The bun is in my hand.', zh: '面包在我手上。' },
      { art: 'kitchen|lili,grandpa|jam|👀', en: 'I put jam on the bun.', zh: '我把果酱放在面包上。' },
      { art: 'kitchen|lili,grandpa|jam|?', en: 'The jam is good.', zh: '果酱很好吃。' },
      { art: 'kitchen|lili,grandpa|jam|·', en: 'I like jam on a bun.', zh: '我喜欢面包上的果酱。' },
      { art: 'kitchen|lili,grandpa|jam|!', en: 'I eat the bun.', zh: '我吃面包。' },
      { art: 'kitchen|lili,grandpa|jam|♥', en: 'I like jam!', zh: '我喜欢果酱！' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['猪', '手', '树'], a: 1, kind: 'recall' },
      { q: '我在面包上放了什么？', opts: ['果酱', '奶酪', '黄油'], a: 0, kind: 'infer' },
      { q: '自己做吃的，你会怎么做？', opts: ['乱放一通', '先看看有什么，放一点尝尝', '不做了'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b21', lv: 'L2', tag: '发音', title: 'Say It: Pen, Pin', zh: '说一说：pen pin',
    emoji: '🗣️', color: '#D9D2F5',
    track: 'drill',
    goal: '把本级难点音听准、说准，并能在整句里读对。这一本走「跟读整句」这条线，认读 1 个新词。',
    trap: '短元音要收住韵尾：cap 的 p 是双唇轻轻一闭，不要加「呃」读成「卡普呃」。',
    summary: '《说一说：pen pin》是「跟读整句」：奶奶和妈妈在家，围绕笔把一件事读到底。本本词卡：别针。读前先看词卡，读完合上书说一说。',
    retell: '看图说词：用 a pen / a ball 说两样东西，再听一遍整句。（这一本是「跟读整句」。）',
    think: '找两个听起来很像的词，读一读、比一比。',
    pre: [
      { art: '📦', en: 'pin', zh: '别针' },
      { art: '🖊️', en: 'pen', zh: '笔' },
      { art: '📦', en: 'is', zh: 'is' }
    ],
    sight: [],
    newWords: [
      { w: 'pin', zh: '别针' }
    ],
    pages: [
      { art: 'table|grandma,mom|pen|·', en: 'This is a pen.', zh: '这是一支笔。' },
      { art: 'table|grandma,mom|pen|♪', en: 'This is a pin.', zh: '这是一个别针。' },
      { art: 'table|grandma,mom|pen|👀', en: 'Pen and pin.', zh: '笔和别针。' },
      { art: 'table|grandma,mom|pen|?', en: 'Say "pen".', zh: '说「笔」。' },
      { art: 'table|grandma,mom|pen|·', en: 'Say "pin".', zh: '说「别针」。' },
      { art: 'table|grandma,mom|pen|!', en: 'Pen is not pin.', zh: '笔不是别针。' },
      { art: 'table|grandma,mom|pen|♥', en: 'Good!', zh: '真棒！' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['黄色', '笔', '米饭'], a: 1, kind: 'recall' },
      { q: '这一本在比哪两个词？', opts: ['pen 和 pin', 'pin 和 pan', 'pen 和 pan'], a: 0, kind: 'infer' },
      { q: '两个单词长得很像，你会怎么分清？', opts: ['随便读一个', '一个一个慢慢读，听清哪里不同', '不读了'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b22', lv: 'L2', tag: '小知识', title: 'A Nut for the Ant', zh: '给蚂蚁的坚果',
    emoji: '🐜', color: '#FAD3B6',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。这一本走「数一数」这条线，认读 2 个新词。',
    trap: '短元音要收住韵尾：cap 的 p 是双唇轻轻一闭，不要加「呃」读成「卡普呃」。',
    summary: '《给蚂蚁的坚果》是「数一数」：爷爷和爸爸在家，围绕坚果把一件事读到底。本本词卡：蚂蚁、坚果。读前先看词卡，读完合上书说一说。',
    retell: '看图说词：用 a nut / a milk 说两样东西，再听一遍整句。（这一本是「数一数」。）',
    think: '说说小蚂蚁搬东西的样子。',
    pre: [
      { art: '🐜', en: 'ant', zh: '蚂蚁' },
      { art: '🌰', en: 'nut', zh: '坚果' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'is', zh: 'is' }
    ],
    sight: [],
    newWords: [
      { w: 'ant', zh: '蚂蚁' },
      { w: 'nut', zh: '坚果' }
    ],
    pages: [
      { art: 'kitchen|grandpa,dad|nut|·', en: 'I see an ant.', zh: '我看见一只蚂蚁。' },
      { art: 'kitchen|grandpa,dad|nut|♪', en: 'The ant is small.', zh: '蚂蚁很小。' },
      { art: 'kitchen|grandpa,dad|nut|👀', en: 'The ant has a nut.', zh: '蚂蚁有一颗坚果。' },
      { art: 'kitchen|grandpa,dad|nut|?', en: 'The nut is big for the ant.', zh: '坚果对蚂蚁来说很大。' },
      { art: 'kitchen|grandpa,dad|nut|·', en: 'The ant gets the nut up.', zh: '蚂蚁把坚果弄了上去。' },
      { art: 'kitchen|grandpa,dad|nut|!', en: 'The ant is happy.', zh: '蚂蚁很开心。' },
      { art: 'kitchen|grandpa,dad|nut|♥', en: 'A nut for the ant!', zh: '给蚂蚁的坚果！' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['陀螺', '蝙蝠', '坚果'], a: 2, kind: 'recall' },
      { q: '蚂蚁有什么？', opts: ['一颗坚果', '一个面包', '一条虫'], a: 0, kind: 'infer' },
      { q: '东西很重、很难搬，你会怎么做？', opts: ['乱扔', '直接放弃', '一点一点搬，或者找人帮忙'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b23', lv: 'L2', tag: '小知识', title: 'Wet and Dry', zh: '湿和干',
    emoji: '💧', color: '#C8E7F0',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。这一本走「合上书讲一遍」这条线，不引入新词，全部是读过的词。',
    trap: '短元音要收住韵尾：cap 的 p 是双唇轻轻一闭，不要加「呃」读成「卡普呃」。',
    summary: '《湿和干》是「合上书讲一遍」：妈妈和明明在家，围绕锅把一件事读到底。本本词卡：这一本不引入新词，全部是读过的词。读前先看词卡，读完合上书说一说。',
    retell: '看图说词：用 a pot / a book 说两样东西，再听一遍整句。（这一本是「合上书讲一遍」。）',
    think: '说说一样湿了又变干的东西。',
    pre: [
      { art: '📦', en: 'the', zh: 'the' },
      { art: '🍲', en: 'pot', zh: '锅' }
    ],
    sight: ['dry'],
    newWords: [

    ],
    pages: [
      { art: 'kitchen|mom,ming|pot|·', en: 'The pot is wet.', zh: '锅是湿的。' },
      { art: 'kitchen|mom,ming|pot|♪', en: 'I want it dry.', zh: '我想让它干。' },
      { art: 'kitchen|mom,ming|pot|👀', en: 'I put the pot in the sun.', zh: '我把锅放到太阳下。' },
      { art: 'kitchen|mom,ming|pot|?', en: 'The sun is hot.', zh: '太阳很热。' },
      { art: 'kitchen|mom,ming|pot|·', en: 'The pot is dry now!', zh: '锅现在干了！' },
      { art: 'kitchen|mom,ming|pot|!', en: 'Wet and dry.', zh: '湿的和干的。' },
      { art: 'kitchen|mom,ming|pot|♥', en: 'I like a dry pot.', zh: '我喜欢干干的锅。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['动物', '盒子', '锅'], a: 2, kind: 'recall' },
      { q: '锅是怎么变干的？', opts: ['用水冲', '放到太阳下晒干', '放进柜子'], a: 1, kind: 'infer' },
      { q: '东西湿了，你会怎么做？', opts: ['不管它', '放到有太阳或通风的地方晾干', '塞进柜子里'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b24', lv: 'L2', tag: '复习', title: 'The Shop on the Hill', zh: '山上的小店',
    emoji: '🏪', color: '#E8D9B5',
    track: 'review',
    goal: '把本级和前面级别的词再读一遍、串成一个故事。这一本走「猜一猜」这条线，认读 1 个新词。',
    trap: '短元音要收住韵尾：cap 的 p 是双唇轻轻一闭，不要加「呃」读成「卡普呃」。',
    summary: '《山上的小店》是「猜一猜」：爸爸和丽丽在图书馆，围绕地图把一件事读到底。本本词卡：小店。读前先看词卡，读完合上书说一说。',
    retell: '看图说词：用 a map / a hat 说两样东西，再听一遍整句。（这一本是「猜一猜」。）',
    think: '说说你去过的一家小店：它卖什么？',
    pre: [
      { art: '🏪', en: 'shop', zh: '小店' },
      { art: '📦', en: 'i', zh: 'i' },
      { art: '📦', en: 'the', zh: 'the' }
    ],
    sight: [],
    newWords: [
      { w: 'shop', zh: '小店' }
    ],
    pages: [
      { art: 'library|dad,lili|shop|·', en: 'I see a shop.', zh: '我看见一家小店。' },
      { art: 'library|dad,lili|shop|♪', en: 'The shop is on a hill.', zh: '小店在小山上。' },
      { art: 'library|dad,lili|shop|👀', en: 'I go up the hill.', zh: '我走上小山。' },
      { art: 'library|dad,lili|shop|?', en: 'The shop has a bun and jam.', zh: '小店有面包和果酱。' },
      { art: 'library|dad,lili|shop|·', en: 'I get a bun.', zh: '我买了面包。' },
      { art: 'library|dad,lili|shop|!', en: 'I get jam too.', zh: '我也买了果酱。' },
      { art: 'library|dad,lili|shop|♥', en: 'I like the shop on the hill.', zh: '我喜欢小山上的小店。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['果酱', '蓝色', '扇子'], a: 0, kind: 'recall' },
      { q: '小店在哪儿？', opts: ['小河边', '小山上', '大树下'], a: 1, kind: 'infer' },
      { q: '去买东西，你会怎么做？', opts: ['先想好要什么，再去看', '随便乱拿', '不看就走'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b25', lv: 'L3', tag: '海边', title: 'The Big Ship', zh: '大轮船',
    emoji: '🚢', color: '#F6C6C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「小船出海」这条线，认读 4 个新词。',
    trap: 'sh 把嘴唇撅圆、th 把舌尖轻轻放在上下门牙中间；ck 只发一个 k，别读两遍。',
    summary: '《大轮船》是「小船出海」：明明和奶奶在沙滩，围绕轮船把一件事读到底。本本词卡：轮船、沙滩、风、强壮。读前先看词卡，读完合上书说一说。',
    retell: '三句话复述：先……、后来……、最后……（这一本是「小船出海」。）',
    think: '说说你在水边玩过的一次：风或水帮了什么忙？',
    pre: [
      { art: '🚢', en: 'ship', zh: '轮船' },
      { art: '🏖️', en: 'beach', zh: '沙滩' },
      { art: '🌿', en: 'wind', zh: '风' },
      { art: '✨', en: 'strong', zh: '强壮' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👦', en: 'ming', zh: '明明' }
    ],
    sight: ['water'],
    newWords: [
      { w: 'ship', zh: '轮船' },
      { w: 'beach', zh: '沙滩' },
      { w: 'wind', zh: '风' },
      { w: 'strong', zh: '强壮' }
    ],
    pages: [
      { art: 'beach|ming,grandma|ship|·', en: 'Ming has a little ship.', zh: '明明有一艘小船。' },
      { art: 'beach|ming,grandma|ship|♪', en: 'Ming takes it to the beach.', zh: '明明带它到海边。' },
      { art: 'beach|ming,grandma|ship|👀', en: 'The wind is strong.', zh: '风很大。' },
      { art: 'beach|ming,grandma|ship|?', en: 'Ming puts the ship on the water.', zh: '明明把船放到水上。' },
      { art: 'beach|ming,grandma|ship|·', en: 'The wind takes it far away!', zh: '风把船吹得很远！' },
      { art: 'beach|ming,grandma|ship|!', en: 'Ming runs to get it.', zh: '明明跑去追。' },
      { art: 'beach|ming,grandma|ship|♥', en: 'Grandma says, "Wait for the wind."', zh: '奶奶说：「等风转过来。」' },
      { art: 'beach|ming,grandma|ship|★', en: 'The wind turns and the ship comes back.', zh: '风一转，船回来了。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['轮船', '陀螺', '锅'], a: 0, kind: 'recall' },
      { q: '船是怎么回来的？', opts: ['它自己开回来的', '风转了，把它带了回来', '明明游过去拿的'], a: 1, kind: 'infer' },
      { q: '东西被风吹跑了，你会怎么做？', opts: ['等风向变了，别硬追', '再买一个', '一直追着风跑'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b26', lv: 'L3', tag: '趣事', title: 'A Duck in the Shop', zh: '店里的一只鸭子',
    emoji: '🦆', color: '#F9DFB4',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「等它长」这条线，认读 3 个新词。',
    trap: 'sh 把嘴唇撅圆、th 把舌尖轻轻放在上下门牙中间；ck 只发一个 k，别读两遍。',
    summary: '《店里的一只鸭子》是「等它长」：丽丽和爷爷在农场，围绕鸭子把一件事读到底。本本词卡：奶酪、害怕、拿。读前先看词卡，读完合上书说一说。',
    retell: '三句话复述：先……、后来……、最后……（这一本是「等它长」。）',
    think: '说说你见过的一件好笑的事。',
    pre: [
      { art: '🧀', en: 'cheese', zh: '奶酪' },
      { art: '✨', en: 'afraid', zh: '害怕' },
      { art: '🏃', en: 'take', zh: '拿' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'a', zh: 'a' }
    ],
    sight: [],
    newWords: [
      { w: 'cheese', zh: '奶酪' },
      { w: 'afraid', zh: '害怕' },
      { w: 'take', zh: '拿' }
    ],
    pages: [
      { art: 'farm|lili,grandpa|duck|·', en: 'A duck is in the shop.', zh: '一家店里有一只鸭子。' },
      { art: 'farm|lili,grandpa|duck|♪', en: 'The duck walks and walks.', zh: '鸭子走啊走。' },
      { art: 'farm|lili,grandpa|duck|👀', en: 'It looks at the chips.', zh: '它看看薯条。' },
      { art: 'farm|lili,grandpa|duck|?', en: 'It looks at the cheese.', zh: '它看看奶酪。' },
      { art: 'farm|lili,grandpa|duck|·', en: '"A duck in the shop!" says a man.', zh: '「店里有只鸭子！」一个人说。' },
      { art: 'farm|lili,grandpa|duck|!', en: 'The duck is not afraid.', zh: '鸭子一点也不怕。' },
      { art: 'farm|lili,grandpa|duck|♥', en: 'They take the duck to the door.', zh: '他们把鸭子带到门口。' },
      { art: 'farm|lili,grandpa|duck|★', en: 'The duck walks home.', zh: '鸭子走回家了。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['动物', '鸭子', '袜子'], a: 1, kind: 'recall' },
      { q: '鸭子在店里看了什么？', opts: ['薯条和奶酪', '鞋子和帽子', '鱼和肉'], a: 0, kind: 'infer' },
      { q: '看到不认识的小动物闯进来，你会怎么做？', opts: ['追着打它', '大声喊叫', '轻轻把它引到外面'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b27', lv: 'L3', tag: '吃饭', title: 'Fish and Chips', zh: '鱼和薯条',
    emoji: '🐟', color: '#CDE7C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「学游泳」这条线，认读 2 个新词。',
    trap: 'sh 把嘴唇撅圆、th 把舌尖轻轻放在上下门牙中间；ck 只发一个 k，别读两遍。',
    summary: '《鱼和薯条》是「学游泳」：奶奶和妈妈在沙滩，围绕鱼把一件事读到底。本本词卡：新鲜、盘子。读前先看词卡，读完合上书说一说。',
    retell: '三句话复述：先……、后来……、最后……（这一本是「学游泳」。）',
    think: '说说你爱吃的一顿饭。',
    pre: [
      { art: '✨', en: 'fresh', zh: '新鲜' },
      { art: '🍽️', en: 'dish', zh: '盘子' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '🍚', en: 'chips', zh: '薯片' }
    ],
    sight: ['eat'],
    newWords: [
      { w: 'fresh', zh: '新鲜' },
      { w: 'dish', zh: '盘子' }
    ],
    pages: [
      { art: 'beach|grandma,mom|fish|·', en: 'I want fish and chips.', zh: '我想吃鱼和薯条。' },
      { art: 'beach|grandma,mom|fish|♪', en: 'The fish is fresh.', zh: '鱼很新鲜。' },
      { art: 'beach|grandma,mom|fish|👀', en: 'The chips are hot.', zh: '薯条热乎乎的。' },
      { art: 'beach|grandma,mom|fish|?', en: 'I put the fish on the dish.', zh: '我把鱼放到盘子上。' },
      { art: 'beach|grandma,mom|fish|·', en: 'The chips go on the dish too.', zh: '薯条也放到盘子上。' },
      { art: 'beach|grandma,mom|fish|!', en: 'I eat the fish first.', zh: '我先吃鱼。' },
      { art: 'beach|grandma,mom|fish|♥', en: 'Then I eat the chips.', zh: '然后吃薯条。' },
      { art: 'beach|grandma,mom|fish|★', en: 'Fish and chips are good!', zh: '鱼和薯条真好吃！' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['盘子', '太阳', '蚂蚁'], a: 0, kind: 'recall' },
      { q: '我先吃了什么？', opts: ['薯条', '米饭', '鱼'], a: 2, kind: 'infer' },
      { q: '吃一顿饭，你会怎么做？', opts: ['不吃了', '全混在一起乱吃', '一样一样慢慢吃'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b28', lv: 'L3', tag: '故事', title: 'The King and a Ring', zh: '国王和戒指',
    emoji: '👑', color: '#C6DEF6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「帮个忙」这条线，认读 3 个新词。',
    trap: 'sh 把嘴唇撅圆、th 把舌尖轻轻放在上下门牙中间；ck 只发一个 k，别读两遍。',
    summary: '《国王和戒指》是「帮个忙」：爷爷和爸爸在家，围绕图画把一件事读到底。本本词卡：富、小鸡、安全。读前先看词卡，读完合上书说一说。',
    retell: '三句话复述：先……、后来……、最后……（这一本是「帮个忙」。）',
    think: '说说一件你觉得很珍贵的东西。',
    pre: [
      { art: '✨', en: 'rich', zh: '富' },
      { art: '📦', en: 'chick', zh: '小鸡' },
      { art: '✨', en: 'safe', zh: '安全' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'a', zh: 'a' }
    ],
    sight: ['keeps'],
    newWords: [
      { w: 'rich', zh: '富' },
      { w: 'chick', zh: '小鸡' },
      { w: 'safe', zh: '安全' }
    ],
    pages: [
      { art: 'home|grandpa,dad|ring|·', en: 'A king has a ring.', zh: '一位国王有一枚戒指。' },
      { art: 'home|grandpa,dad|ring|♪', en: 'The ring is rich.', zh: '戒指很珍贵。' },
      { art: 'home|grandpa,dad|ring|👀', en: 'The king likes the ring.', zh: '国王喜欢这枚戒指。' },
      { art: 'home|grandpa,dad|ring|?', en: 'One day the ring is not here.', zh: '有一天，戒指不见了。' },
      { art: 'home|grandpa,dad|ring|·', en: 'The king looks and looks.', zh: '国王找了又找。' },
      { art: 'home|grandpa,dad|ring|!', en: 'A little chick has it!', zh: '一只小鸡拿着它！' },
      { art: 'home|grandpa,dad|ring|♥', en: 'The king laughs.', zh: '国王笑了。' },
      { art: 'home|grandpa,dad|ring|★', en: 'The king keeps the ring safe.', zh: '国王把戒指收好了。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['沙滩', '水', '小鸡'], a: 2, kind: 'recall' },
      { q: '戒指最后在哪里？', opts: ['在一只小鸡那儿', '在桌子下面', '再也找不到了'], a: 0, kind: 'infer' },
      { q: '怕重要的东西丢掉，你会怎么做？', opts: ['随便乱放', '放在固定、安全的地方', '藏到自己也找不到'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b29', lv: 'L3', tag: '观察', title: 'A Moth on the Path', zh: '小路上的飞蛾',
    emoji: '🦋', color: '#E0CFF3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「叶子落了」这条线，认读 6 个新词。',
    trap: 'sh 把嘴唇撅圆、th 把舌尖轻轻放在上下门牙中间；ck 只发一个 k，别读两遍。',
    summary: '《小路上的飞蛾》是「叶子落了」：妈妈和明明在花园，围绕飞蛾把一件事读到底。本本词卡：小路、飞蛾、瘦、叶子、观察、飞。读前先看词卡，读完合上书说一说。',
    retell: '三句话复述：先……、后来……、最后……（这一本是「叶子落了」。）',
    think: '说说你在户外看到的一种小虫。',
    pre: [
      { art: '🛤️', en: 'path', zh: '小路' },
      { art: '🦋', en: 'moth', zh: '飞蛾' },
      { art: '✨', en: 'thin', zh: '瘦' },
      { art: '🍃', en: 'leaf', zh: '叶子' },
      { art: '🏃', en: 'watch', zh: '观察' },
      { art: '🏃', en: 'fly', zh: '飞' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'i', zh: 'i' }
    ],
    sight: ['flies'],
    newWords: [
      { w: 'path', zh: '小路' },
      { w: 'moth', zh: '飞蛾' },
      { w: 'thin', zh: '瘦' },
      { w: 'leaf', zh: '叶子' },
      { w: 'watch', zh: '观察' },
      { w: 'fly', zh: '飞' }
    ],
    pages: [
      { art: 'garden|mom,ming|moth|·', en: 'I walk on the path.', zh: '我走在小路上。' },
      { art: 'garden|mom,ming|moth|♪', en: 'I see a moth.', zh: '我看见一只飞蛾。' },
      { art: 'garden|mom,ming|moth|👀', en: 'The moth is small and thin.', zh: '飞蛾又小又薄。' },
      { art: 'garden|mom,ming|moth|?', en: 'The moth sits on a leaf.', zh: '飞蛾停在叶子上。' },
      { art: 'garden|mom,ming|moth|·', en: 'I watch the moth.', zh: '我看着飞蛾。' },
      { art: 'garden|mom,ming|moth|!', en: 'The moth flies away.', zh: '飞蛾飞走了。' },
      { art: 'garden|mom,ming|moth|♥', en: 'I look for it on the path.', zh: '我在小路上找它。' },
      { art: 'garden|mom,ming|moth|★', en: 'The moth is gone, but I am happy.', zh: '飞蛾飞走了，可我很开心。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['蓝色', '动物', '飞蛾'], a: 2, kind: 'recall' },
      { q: '飞蛾最后怎么了？', opts: ['飞走了', '被抓住了', '停在我手上'], a: 0, kind: 'infer' },
      { q: '小虫飞走了，你会怎么做？', opts: ['一直追它', '看着它飞走，不去追', '把它抓回来'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b30', lv: 'L3', tag: '海边', title: 'Sing at the Beach', zh: '在沙滩上唱歌',
    emoji: '🏖️', color: '#F6C9E3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「找贝壳」这条线，认读 2 个新词。',
    trap: 'sh 把嘴唇撅圆、th 把舌尖轻轻放在上下门牙中间；ck 只发一个 k，别读两遍。',
    summary: '《在沙滩上唱歌》是「找贝壳」：爸爸和丽丽在沙滩，围绕沙滩把一件事读到底。本本词卡：沙子、好。读前先看词卡，读完合上书说一说。',
    retell: '三句话复述：先……、后来……、最后……（这一本是「找贝壳」。）',
    think: '说说你在海边做过的事。',
    pre: [
      { art: '🌿', en: 'sand', zh: '沙子' },
      { art: '✨', en: 'nice', zh: '好' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'we', zh: 'we' }
    ],
    sight: ['beach', 'strong', 'water'],
    newWords: [
      { w: 'sand', zh: '沙子' },
      { w: 'nice', zh: '好' }
    ],
    pages: [
      { art: 'beach|dad,lili|beach|·', en: 'We go to the beach.', zh: '我们去海边。' },
      { art: 'beach|dad,lili|beach|♪', en: 'The sand is nice.', zh: '沙子很好。' },
      { art: 'beach|dad,lili|beach|👀', en: 'We sit on the sand.', zh: '我们坐在沙子上。' },
      { art: 'beach|dad,lili|beach|?', en: 'We sing and sing.', zh: '我们唱啊唱。' },
      { art: 'beach|dad,lili|beach|·', en: 'The wind is strong.', zh: '风很大。' },
      { art: 'beach|dad,lili|beach|!', en: 'The water is long.', zh: '海水长长的。' },
      { art: 'beach|dad,lili|beach|♥', en: 'We sing at the beach.', zh: '我们在海边唱歌。' },
      { art: 'beach|dad,lili|beach|★', en: 'We are happy at the beach.', zh: '我们在海边很开心。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['鸟', '薯条', '沙子'], a: 2, kind: 'recall' },
      { q: '我们在海边做了什么？', opts: ['吃东西', '唱歌', '游泳'], a: 1, kind: 'infer' },
      { q: '在海边玩，你会怎么做？', opts: ['不玩了', '一个人跑得很远', '唱歌、玩沙，注意安全'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b31', lv: 'L3', tag: '家务', title: 'Wash the Dish', zh: '洗盘子',
    emoji: '🍽️', color: '#BFE6DF',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「一起做」这条线，认读 3 个新词。',
    trap: 'sh 把嘴唇撅圆、th 把舌尖轻轻放在上下门牙中间；ck 只发一个 k，别读两遍。',
    summary: '《洗盘子》是「一起做」：明明和奶奶在家，围绕盘子把一件事读到底。本本词卡：打扫、洗、用。读前先看词卡，读完合上书说一说。',
    retell: '三句话复述：先……、后来……、最后……（这一本是「一起做」。）',
    think: '说说你做过的一件家务。',
    pre: [
      { art: '🏃', en: 'clean', zh: '打扫' },
      { art: '🏃', en: 'wash', zh: '洗' },
      { art: '🏃', en: 'use', zh: '用' },
      { art: '🍽️', en: 'dish', zh: '盘子' },
      { art: '📦', en: 'i', zh: 'i' }
    ],
    sight: ['water'],
    newWords: [
      { w: 'clean', zh: '打扫' },
      { w: 'wash', zh: '洗' },
      { w: 'use', zh: '用' }
    ],
    pages: [
      { art: 'kitchen|ming,grandma|dish|·', en: 'The dish is not clean.', zh: '盘子不干净。' },
      { art: 'kitchen|ming,grandma|dish|♪', en: 'I wash the dish.', zh: '我洗盘子。' },
      { art: 'kitchen|ming,grandma|dish|👀', en: 'I use water.', zh: '我用水。' },
      { art: 'kitchen|ming,grandma|dish|?', en: 'I wash and wash.', zh: '我洗啊洗。' },
      { art: 'kitchen|ming,grandma|dish|·', en: 'The dish is clean now!', zh: '盘子现在干净了！' },
      { art: 'kitchen|ming,grandma|dish|!', en: 'I put the dish away.', zh: '我把盘子放好。' },
      { art: 'kitchen|ming,grandma|dish|♥', en: 'A clean dish is good.', zh: '干净的盘子真好。' },
      { art: 'kitchen|ming,grandma|dish|★', en: 'I like a clean dish.', zh: '我喜欢干净的盘子。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['盘子', '书', '杯子'], a: 0, kind: 'recall' },
      { q: '我用什么洗盘子？', opts: ['水', '沙', '油'], a: 0, kind: 'infer' },
      { q: '东西脏了，你会怎么做？', opts: ['扔掉', '不管它', '用水把它洗干净'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b32', lv: 'L3', tag: '故事', title: 'A Wish for a Chick', zh: '给小鸡的愿望',
    emoji: '🐤', color: '#F2E2A8',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「喂小动物」这条线，认读 3 个新词。',
    trap: 'sh 把嘴唇撅圆、th 把舌尖轻轻放在上下门牙中间；ck 只发一个 k，别读两遍。',
    summary: '《给小鸡的愿望》是「喂小动物」：丽丽和爷爷在农场，围绕小鸡把一件事读到底。本本词卡：饿、许愿、食物。读前先看词卡，读完合上书说一说。',
    retell: '三句话复述：先……、后来……、最后……（这一本是「喂小动物」。）',
    think: '说说你想为一个小动物做的一件事。',
    pre: [
      { art: '✨', en: 'hungry', zh: '饿' },
      { art: '🏃', en: 'wish', zh: '许愿' },
      { art: '📦', en: 'food', zh: '食物' },
      { art: '📦', en: 'chick', zh: '小鸡' },
      { art: '📦', en: 'is', zh: 'is' }
    ],
    sight: ['eats'],
    newWords: [
      { w: 'hungry', zh: '饿' },
      { w: 'wish', zh: '许愿' },
      { w: 'food', zh: '食物' }
    ],
    pages: [
      { art: 'farm|lili,grandpa|chick|·', en: 'A little chick is here.', zh: '这里有一只小鸡。' },
      { art: 'farm|lili,grandpa|chick|♪', en: 'The chick is small and thin.', zh: '小鸡又小又瘦。' },
      { art: 'farm|lili,grandpa|chick|👀', en: 'It is hungry.', zh: '它饿了。' },
      { art: 'farm|lili,grandpa|chick|?', en: 'I have a wish for the chick.', zh: '我对小鸡有个心愿。' },
      { art: 'farm|lili,grandpa|chick|·', en: 'I give the chick food.', zh: '我给小鸡吃的。' },
      { art: 'farm|lili,grandpa|chick|!', en: 'The chick eats and eats.', zh: '小鸡吃啊吃。' },
      { art: 'farm|lili,grandpa|chick|♥', en: 'The chick is not thin now.', zh: '小鸡不瘦了。' },
      { art: 'farm|lili,grandpa|chick|★', en: 'My wish is good.', zh: '我的心愿真好。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['扇子', '食物', '公交车'], a: 1, kind: 'recall' },
      { q: '小鸡一开始怎么了？', opts: ['很胖，在睡觉', '在水里游', '又小又瘦，很饿'], a: 2, kind: 'infer' },
      { q: '看到小动物饿了，你会怎么做？', opts: ['给它合适的食物，照顾它', '吓它', '不理它'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b33', lv: 'L3', tag: '发音', title: 'Say It: Ship, Chip', zh: '说一说：ship chip',
    emoji: '🗣️', color: '#D9D2F5',
    track: 'drill',
    goal: '把本级难点音听准、说准，并能在整句里读对。这一本走「跟读整句」这条线，认读 1 个新词。',
    trap: 'sh 把嘴唇撅圆、th 把舌尖轻轻放在上下门牙中间；ck 只发一个 k，别读两遍。',
    summary: '《说一说：ship chip》是「跟读整句」：奶奶和妈妈在家，围绕轮船把一件事读到底。本本词卡：薯条。读前先看词卡，读完合上书说一说。',
    retell: '三句话复述：先……、后来……、最后……（这一本是「跟读整句」。）',
    think: '找两个都有 sh 的词，读一读、比一比。',
    pre: [
      { art: '🍚', en: 'chip', zh: '薯条' },
      { art: '🚢', en: 'ship', zh: '轮船' },
      { art: '📦', en: 'is', zh: 'is' }
    ],
    sight: [],
    newWords: [
      { w: 'chip', zh: '薯条' }
    ],
    pages: [
      { art: 'table|grandma,mom|ship|·', en: 'This is a ship.', zh: '这是一艘船。' },
      { art: 'table|grandma,mom|ship|♪', en: 'This is a chip.', zh: '这是一根薯条。' },
      { art: 'table|grandma,mom|ship|👀', en: 'Ship and chip.', zh: '船和薯条。' },
      { art: 'table|grandma,mom|ship|?', en: 'Both have "sh".', zh: '两个词都有「sh」。' },
      { art: 'table|grandma,mom|ship|·', en: 'Say "ship".', zh: '说「船」。' },
      { art: 'table|grandma,mom|ship|!', en: 'Say "chip".', zh: '说「薯条」。' },
      { art: 'table|grandma,mom|ship|♥', en: 'Ship is not chip.', zh: '船不是薯条。' },
      { art: 'table|grandma,mom|ship|★', en: 'Good! You can say both.', zh: '真棒！两个都会说了。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['轮船', '鸡蛋', '帽子'], a: 0, kind: 'recall' },
      { q: '这一本在比哪两个词？', opts: ['chip 和 chop', 'ship 和 shop', 'ship 和 chip'], a: 2, kind: 'infer' },
      { q: '两个词都有 sh，你会怎么分清？', opts: ['不读了', '听清后面的部分，一个一个读', '随便读一个'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b34', lv: 'L3', tag: '小知识', title: 'A Long Wing', zh: '长长的翅膀',
    emoji: '🕊️', color: '#FAD3B6',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。这一本走「问一问」这条线，认读 1 个新词。',
    trap: 'sh 把嘴唇撅圆、th 把舌尖轻轻放在上下门牙中间；ck 只发一个 k，别读两遍。',
    summary: '《长长的翅膀》是「问一问」：爷爷和爸爸在图书馆，围绕翅膀把一件事读到底。本本词卡：飞。读前先看词卡，读完合上书说一说。',
    retell: '三句话复述：先……、后来……、最后……（这一本是「问一问」。）',
    think: '说说鸟是怎么飞起来的。',
    pre: [
      { art: '🏃', en: 'fly', zh: '飞' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '✨', en: 'long', zh: '长' }
    ],
    sight: ['bird', 'flies', 'watch'],
    newWords: [
      { w: 'fly', zh: '飞' }
    ],
    pages: [
      { art: 'library|grandpa,dad|wing|·', en: 'A bird has a long wing.', zh: '一只鸟有一只长翅膀。' },
      { art: 'library|grandpa,dad|wing|♪', en: 'The wing is long and thin.', zh: '翅膀又长又薄。' },
      { art: 'library|grandpa,dad|wing|👀', en: 'The bird flies with the wing.', zh: '鸟用翅膀飞。' },
      { art: 'library|grandpa,dad|wing|?', en: 'Up and up it goes.', zh: '它飞啊飞。' },
      { art: 'library|grandpa,dad|wing|·', en: 'The wind helps the wing.', zh: '风帮着翅膀。' },
      { art: 'library|grandpa,dad|wing|!', en: 'The bird flies long and far.', zh: '鸟飞得又久又远。' },
      { art: 'library|grandpa,dad|wing|♥', en: 'I watch the long wing.', zh: '我看着长长的翅膀。' },
      { art: 'library|grandpa,dad|wing|★', en: 'I wish I could fly.', zh: '我真希望也能飞。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['水壶', '鸟', '朋友'], a: 1, kind: 'recall' },
      { q: '鸟用什么飞？', opts: ['长长的腿', '长长的翅膀', '长长的尾巴'], a: 1, kind: 'infer' },
      { q: '想做成一件难事，你会怎么做？', opts: ['一次就想学会', '不学了', '先看别人怎么做，再慢慢练'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b35', lv: 'L3', tag: '小知识', title: 'Fresh Cheese', zh: '新鲜的奶酪',
    emoji: '🧀', color: '#C8E7F0',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。这一本走「合上书讲一遍」这条线，认读 1 个新词。',
    trap: 'sh 把嘴唇撅圆、th 把舌尖轻轻放在上下门牙中间；ck 只发一个 k，别读两遍。',
    summary: '《新鲜的奶酪》是「合上书讲一遍」：妈妈和明明在家，围绕奶酪把一件事读到底。本本词卡：软。读前先看词卡，读完合上书说一说。',
    retell: '三句话复述：先……、后来……、最后……（这一本是「合上书讲一遍」。）',
    think: '说说一种你喜欢的奶制品。',
    pre: [
      { art: '✨', en: 'soft', zh: '软' },
      { art: '🧀', en: 'cheese', zh: '奶酪' },
      { art: '📦', en: 'is', zh: 'is' }
    ],
    sight: ['cheese', 'eat', 'fresh'],
    newWords: [
      { w: 'soft', zh: '软' }
    ],
    pages: [
      { art: 'kitchen|mom,ming|cheese|·', en: 'The cheese is fresh.', zh: '奶酪很新鲜。' },
      { art: 'kitchen|mom,ming|cheese|♪', en: 'It is on a dish.', zh: '它在盘子上。' },
      { art: 'kitchen|mom,ming|cheese|👀', en: 'I like fresh cheese.', zh: '我喜欢新鲜的奶酪。' },
      { art: 'kitchen|mom,ming|cheese|?', en: 'The cheese is soft.', zh: '奶酪软软的。' },
      { art: 'kitchen|mom,ming|cheese|·', en: 'I cut the cheese.', zh: '我切奶酪。' },
      { art: 'kitchen|mom,ming|cheese|!', en: 'I eat a little.', zh: '我吃了一点。' },
      { art: 'kitchen|mom,ming|cheese|♥', en: 'Fresh cheese is good.', zh: '新鲜的奶酪真好吃。' },
      { art: 'kitchen|mom,ming|cheese|★', en: 'I want more fresh cheese.', zh: '我还想再吃点。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['嘴唇', '手', '奶酪'], a: 2, kind: 'recall' },
      { q: '奶酪是什么样的？', opts: ['又硬又咸', '新鲜、软软的', '又干又苦'], a: 1, kind: 'infer' },
      { q: '想知道食物新不新鲜，你会怎么做？', opts: ['直接吃', '看一看、闻一闻', '不管它'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b36', lv: 'L3', tag: '复习', title: 'Down by the Shed', zh: '棚子边',
    emoji: '🛖', color: '#E8D9B5',
    track: 'review',
    goal: '把本级和前面级别的词再读一遍、串成一个故事。这一本走「合上书讲一遍」这条线，认读 2 个新词。',
    trap: 'sh 把嘴唇撅圆、th 把舌尖轻轻放在上下门牙中间；ck 只发一个 k，别读两遍。',
    summary: '《棚子边》是「合上书讲一遍」：爸爸和丽丽在图书馆，围绕图画把一件事读到底。本本词卡：摘、家人。读前先看词卡，读完合上书说一说。',
    retell: '三句话复述：先……、后来……、最后……（这一本是「合上书讲一遍」。）',
    think: '说说你家附近的一个地方：那里有什么？',
    pre: [
      { art: '🏃', en: 'pick', zh: '摘' },
      { art: '🧑', en: 'family', zh: '家人' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'i', zh: 'i' }
    ],
    sight: ['fresh'],
    newWords: [
      { w: 'pick', zh: '摘' },
      { w: 'family', zh: '家人' }
    ],
    pages: [
      { art: 'library|dad,lili|shed|·', en: 'Down by the shed, I see a hen.', zh: '在棚子边，我看见一只母鸡。' },
      { art: 'library|dad,lili|shed|♪', en: 'The hen is by the shed.', zh: '母鸡在棚子边。' },
      { art: 'library|dad,lili|shed|👀', en: 'I pick up a fresh egg.', zh: '我捡起一个新鲜的鸡蛋。' },
      { art: 'library|dad,lili|shed|?', en: 'The egg is for my family.', zh: '鸡蛋是给家人的。' },
      { art: 'library|dad,lili|shed|·', en: 'I leave the hen by the shed.', zh: '我把母鸡留在棚子边。' },
      { art: 'library|dad,lili|shed|!', en: 'I walk back home.', zh: '我走回家。' },
      { art: 'library|dad,lili|shed|♥', en: 'Down by the shed, all is well.', zh: '棚子边，一切都好。' },
      { art: 'library|dad,lili|shed|★', en: 'I like the shed and the hen.', zh: '我喜欢棚子和母鸡。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['家人', '一', '丽丽'], a: 0, kind: 'recall' },
      { q: '我在棚子边看到了什么？', opts: ['一只母鸡', '一条鱼', '一头猪'], a: 0, kind: 'infer' },
      { q: '捡到一样东西，你会怎么做？', opts: ['不管它', '自己拿走', '想一想它是谁的，再决定怎么办'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b37', lv: 'L4', tag: '池塘', title: 'The Frog on the Stone', zh: '石头上的青蛙',
    emoji: '🐸', color: '#F6C6C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「问一问」这条线，认读 3 个新词。',
    trap: '连缀中间不加元音：tree 是「tr-ee」一个词，不是「特-瑞」两个音。',
    summary: '《石头上的青蛙》是「问一问」：明明和奶奶在图书馆，围绕青蛙把一件事读到底。本本词卡：青蛙、石头、池塘。读前先看词卡，读完合上书说一说。',
    retell: '四句话复述：谁、在哪儿、遇到什么麻烦、怎么解决。（这一本是「问一问」。）',
    think: '说说青蛙抓虫的样子。',
    pre: [
      { art: '🐸', en: 'frog', zh: '青蛙' },
      { art: '🌿', en: 'stone', zh: '石头' },
      { art: '📍', en: 'pond', zh: '池塘' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'is', zh: 'is' }
    ],
    sight: ['flies', 'green', 'waits'],
    newWords: [
      { w: 'frog', zh: '青蛙' },
      { w: 'stone', zh: '石头' },
      { w: 'pond', zh: '池塘' }
    ],
    pages: [
      { art: 'library|ming,grandma|frog|·', en: 'A frog is on a stone.', zh: '一只青蛙在石头上。' },
      { art: 'library|ming,grandma|frog|♪', en: 'The stone is by the pond.', zh: '石头在池塘边。' },
      { art: 'library|ming,grandma|frog|👀', en: 'The frog is green.', zh: '青蛙是绿色的。' },
      { art: 'library|ming,grandma|frog|?', en: 'It sits and waits.', zh: '它坐着等。' },
      { art: 'library|ming,grandma|frog|·', en: 'A bug flies by.', zh: '一只虫飞过。' },
      { art: 'library|ming,grandma|frog|!', en: 'The frog jumps!', zh: '青蛙跳了起来！' },
      { art: 'library|ming,grandma|frog|♥', en: 'The frog gets the bug.', zh: '青蛙抓住了虫。' },
      { art: 'library|ming,grandma|frog|★', en: 'The frog is on the stone again.', zh: '青蛙又回到石头上。' },
      { art: 'library|ming,grandma|frog|…', en: 'The frog is happy.', zh: '青蛙很开心。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['动物', '鸟', '石头'], a: 2, kind: 'recall' },
      { q: '青蛙在等什么？', opts: ['小鸟', '飞过来的小虫', '小鱼'], a: 1, kind: 'infer' },
      { q: '想抓住机会（做成一件事），你会怎么做？', opts: ['不等了', '乱抓一气', '耐心等，看准了再动'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b38', lv: 'L4', tag: '运动会', title: 'A Blue Flag', zh: '蓝色的旗子',
    emoji: '🚩', color: '#F9DFB4',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「轮到谁」这条线，认读 2 个新词。',
    trap: '连缀中间不加元音：tree 是「tr-ee」一个词，不是「特-瑞」两个音。',
    summary: '《蓝色的旗子》是「轮到谁」：丽丽和爷爷在学校，围绕旗子把一件事读到底。本本词卡：旗子、高。读前先看词卡，读完合上书说一说。',
    retell: '四句话复述：谁、在哪儿、遇到什么麻烦、怎么解决。（这一本是「轮到谁」。）',
    think: '说说一面旗子：它是什么颜色的？',
    pre: [
      { art: '🚩', en: 'flag', zh: '旗子' },
      { art: '✨', en: 'high', zh: '高' },
      { art: '📦', en: 'i', zh: 'i' },
      { art: '🔵', en: 'blue', zh: '蓝色' }
    ],
    sight: ['blue'],
    newWords: [
      { w: 'flag', zh: '旗子' },
      { w: 'high', zh: '高' }
    ],
    pages: [
      { art: 'school|lili,grandpa|flag|·', en: 'I have a blue flag.', zh: '我有一面蓝色的旗。' },
      { art: 'school|lili,grandpa|flag|♪', en: 'I hold the flag.', zh: '我举着旗。' },
      { art: 'school|lili,grandpa|flag|👀', en: 'I hold it up high.', zh: '我把旗举得高高的。' },
      { art: 'school|lili,grandpa|flag|?', en: 'The flag is blue.', zh: '旗是蓝色的。' },
      { art: 'school|lili,grandpa|flag|·', en: 'A red flag is here too.', zh: '这里还有一面红旗。' },
      { art: 'school|lili,grandpa|flag|!', en: 'Blue and red flags.', zh: '蓝旗和红旗。' },
      { art: 'school|lili,grandpa|flag|♥', en: 'We hold the flags up.', zh: '我们把旗举起来。' },
      { art: 'school|lili,grandpa|flag|★', en: 'I like my blue flag.', zh: '我喜欢我的蓝旗。' },
      { art: 'school|lili,grandpa|flag|…', en: 'The flag is for all of us.', zh: '旗是给大家的。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['旗子', '盒子', '胳膊'], a: 0, kind: 'recall' },
      { q: '我有一面什么颜色的旗？', opts: ['绿色', '红色', '蓝色'], a: 2, kind: 'infer' },
      { q: '和别人一起做一件事，你会怎么做？', opts: ['自己全占', '不做了', '分一分，大家一起做'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b39', lv: 'L4', tag: '夜空', title: 'Stars in the Sky', zh: '天上的星星',
    emoji: '⭐', color: '#CDE7C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「睡不着」这条线，认读 1 个新词。',
    trap: '连缀中间不加元音：tree 是「tr-ee」一个词，不是「特-瑞」两个音。',
    summary: '《天上的星星》是「睡不着」：奶奶和妈妈在家，围绕星星把一件事读到底。本本词卡：星星。读前先看词卡，读完合上书说一说。',
    retell: '四句话复述：谁、在哪儿、遇到什么麻烦、怎么解决。（这一本是「睡不着」。）',
    think: '说说你在夜空里看到过什么。',
    pre: [
      { art: '⭐', en: 'star', zh: '星星' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'i', zh: 'i' }
    ],
    sight: ['stars'],
    newWords: [
      { w: 'star', zh: '星星' }
    ],
    pages: [
      { art: 'night|grandma,mom|star|·', en: 'The night is here.', zh: '夜晚来了。' },
      { art: 'night|grandma,mom|star|♪', en: 'I look at the sky.', zh: '我看着天空。' },
      { art: 'night|grandma,mom|star|👀', en: 'I see a star.', zh: '我看见一颗星星。' },
      { art: 'night|grandma,mom|star|?', en: 'I see two stars.', zh: '我看见两颗星星。' },
      { art: 'night|grandma,mom|star|·', en: 'I see many stars.', zh: '我看见好多星星。' },
      { art: 'night|grandma,mom|star|!', en: 'The stars are small.', zh: '星星小小的。' },
      { art: 'night|grandma,mom|star|♥', en: 'The stars are in the sky.', zh: '星星在天上。' },
      { art: 'night|grandma,mom|star|★', en: 'I like the stars.', zh: '我喜欢星星。' },
      { art: 'night|grandma,mom|star|…', en: 'The night is good.', zh: '这个夜晚真好。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['天空', '罐子', '床'], a: 0, kind: 'recall' },
      { q: '我看到了什么？', opts: ['云', '太阳', '好多星星'], a: 2, kind: 'infer' },
      { q: '晚上看星星，你会怎么做？', opts: ['找个安静的地方，慢慢看', '不看', '大声喊'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b40', lv: 'L4', tag: '上学', title: 'The Clock at School', zh: '学校的钟',
    emoji: '🕐', color: '#C6DEF6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「排好队」这条线，认读 2 个新词。',
    trap: '连缀中间不加元音：tree 是「tr-ee」一个词，不是「特-瑞」两个音。',
    summary: '《学校的钟》是「排好队」：爷爷和爸爸在学校，围绕钟把一件事读到底。本本词卡：钟、房间。读前先看词卡，读完合上书说一说。',
    retell: '四句话复述：谁、在哪儿、遇到什么麻烦、怎么解决。（这一本是「排好队」。）',
    think: '说说你家里的一口钟或一块表。',
    pre: [
      { art: '🕐', en: 'clock', zh: '钟' },
      { art: '📦', en: 'room', zh: '房间' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'is', zh: 'is' }
    ],
    sight: [],
    newWords: [
      { w: 'clock', zh: '钟' },
      { w: 'room', zh: '房间' }
    ],
    pages: [
      { art: 'school|grandpa,dad|clock|·', en: 'There is a clock at school.', zh: '学校里有一口钟。' },
      { art: 'school|grandpa,dad|clock|♪', en: 'The clock is on the wall.', zh: '钟在墙上。' },
      { art: 'school|grandpa,dad|clock|👀', en: 'I look at the clock.', zh: '我看着钟。' },
      { art: 'school|grandpa,dad|clock|?', en: 'It is early.', zh: '时间还早。' },
      { art: 'school|grandpa,dad|clock|·', en: 'I read my book.', zh: '我读我的书。' },
      { art: 'school|grandpa,dad|clock|!', en: 'The clock says it is time.', zh: '钟说时间到了。' },
      { art: 'school|grandpa,dad|clock|♥', en: 'I leave my book.', zh: '我放下书。' },
      { art: 'school|grandpa,dad|clock|★', en: 'I go to the room.', zh: '我去教室。' },
      { art: 'school|grandpa,dad|clock|…', en: 'The clock helps me.', zh: '钟帮了我。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['房间', '螃蟹', '面包'], a: 0, kind: 'recall' },
      { q: '钟帮我做了什么？', opts: ['写作业', '做饭', '知道时间，不迟到'], a: 2, kind: 'infer' },
      { q: '想知道现在几点，你会怎么做？', opts: ['不管它', '随便猜一猜', '看看钟表'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b41', lv: 'L4', tag: '观察', title: 'Grass and a Crab', zh: '草和螃蟹',
    emoji: '🦀', color: '#E0CFF3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「等它长」这条线，认读 2 个新词。',
    trap: '连缀中间不加元音：tree 是「tr-ee」一个词，不是「特-瑞」两个音。',
    summary: '《草和螃蟹》是「等它长」：妈妈和明明在农场，围绕草把一件事读到底。本本词卡：草、螃蟹。读前先看词卡，读完合上书说一说。',
    retell: '四句话复述：谁、在哪儿、遇到什么麻烦、怎么解决。（这一本是「等它长」。）',
    think: '说说你在水边看到的一种小动物。',
    pre: [
      { art: '🌿', en: 'grass', zh: '草' },
      { art: '🦀', en: 'crab', zh: '螃蟹' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'i', zh: 'i' }
    ],
    sight: ['water'],
    newWords: [
      { w: 'grass', zh: '草' },
      { w: 'crab', zh: '螃蟹' }
    ],
    pages: [
      { art: 'farm|mom,ming|grass|·', en: 'I see grass by the water.', zh: '我看见水边的草。' },
      { art: 'farm|mom,ming|grass|♪', en: 'I see a crab too.', zh: '我还看见一只螃蟹。' },
      { art: 'farm|mom,ming|grass|👀', en: 'The crab is small.', zh: '螃蟹很小。' },
      { art: 'farm|mom,ming|grass|?', en: 'It walks on the sand.', zh: '它在沙子上走。' },
      { art: 'farm|mom,ming|grass|·', en: 'The crab hides in the grass.', zh: '螃蟹躲进草里。' },
      { art: 'farm|mom,ming|grass|!', en: 'I look for the crab.', zh: '我找螃蟹。' },
      { art: 'farm|mom,ming|grass|♥', en: 'The crab comes out.', zh: '螃蟹出来了。' },
      { art: 'farm|mom,ming|grass|★', en: 'The crab and the grass.', zh: '螃蟹和草。' },
      { art: 'farm|mom,ming|grass|…', en: 'I like the crab.', zh: '我喜欢这只螃蟹。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['草', '奶酪', '鸭子'], a: 0, kind: 'recall' },
      { q: '螃蟹躲到哪里去了？', opts: ['水里', '草里', '石头下面'], a: 1, kind: 'infer' },
      { q: '小动物躲起来了，你会怎么做？', opts: ['耐心等它出来', '不管它', '一直翻找吓它'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b42', lv: 'L4', tag: '池塘', title: 'Swim with the Swan', zh: '和天鹅一起游',
    emoji: '🦢', color: '#F6C9E3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「找贝壳」这条线，认读 2 个新词。',
    trap: '连缀中间不加元音：tree 是「tr-ee」一个词，不是「特-瑞」两个音。',
    summary: '《和天鹅一起游》是「找贝壳」：爸爸和丽丽在沙滩，围绕天鹅把一件事读到底。本本词卡：天鹅、游泳。读前先看词卡，读完合上书说一说。',
    retell: '四句话复述：谁、在哪儿、遇到什么麻烦、怎么解决。（这一本是「找贝壳」。）',
    think: '说说天鹅在水里的样子。',
    pre: [
      { art: '🦢', en: 'swan', zh: '天鹅' },
      { art: '🏃', en: 'swim', zh: '游泳' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'i', zh: 'i' }
    ],
    sight: ['afraid', 'friends', 'watch', 'water'],
    newWords: [
      { w: 'swan', zh: '天鹅' },
      { w: 'swim', zh: '游泳' }
    ],
    pages: [
      { art: 'beach|dad,lili|swan|·', en: 'A swan is on the water.', zh: '一只天鹅在水上。' },
      { art: 'beach|dad,lili|swan|♪', en: 'The swan is big.', zh: '天鹅很大。' },
      { art: 'beach|dad,lili|swan|👀', en: 'The swan swims on the water.', zh: '天鹅在水上游。' },
      { art: 'beach|dad,lili|swan|?', en: 'I watch the swan.', zh: '我看着天鹅。' },
      { art: 'beach|dad,lili|swan|·', en: 'The swan swims to me.', zh: '天鹅向我游来。' },
      { art: 'beach|dad,lili|swan|!', en: 'I put my hand in the water.', zh: '我把手放进水里。' },
      { art: 'beach|dad,lili|swan|♥', en: 'The swan is not afraid.', zh: '天鹅不怕。' },
      { art: 'beach|dad,lili|swan|★', en: 'I swim with the swan.', zh: '我和天鹅一起游。' },
      { art: 'beach|dad,lili|swan|…', en: 'The swan and I are friends.', zh: '天鹅和我成了朋友。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['旗子', '手', '云'], a: 1, kind: 'recall' },
      { q: '天鹅在哪里？', opts: ['树上', '岸上', '水上'], a: 2, kind: 'infer' },
      { q: '想和小动物亲近，你会怎么做？', opts: ['大声吓它', '轻轻靠近，让它不怕你', '追它'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b43', lv: 'L4', tag: '送礼', title: 'A Gift in a Basket', zh: '篮子里的礼物',
    emoji: '🧺', color: '#BFE6DF',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「修好它」这条线，认读 3 个新词。',
    trap: '连缀中间不加元音：tree 是「tr-ee」一个词，不是「特-瑞」两个音。',
    summary: '《篮子里的礼物》是「修好它」：明明和奶奶在家，围绕礼物把一件事读到底。本本词卡：篮子、礼物、空。读前先看词卡，读完合上书说一说。',
    retell: '四句话复述：谁、在哪儿、遇到什么麻烦、怎么解决。（这一本是「修好它」。）',
    think: '说说你送过或收到的一份礼物。',
    pre: [
      { art: '📦', en: 'basket', zh: '篮子' },
      { art: '🎁', en: 'gift', zh: '礼物' },
      { art: '✨', en: 'empty', zh: '空' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'i', zh: 'i' }
    ],
    sight: ['carry'],
    newWords: [
      { w: 'basket', zh: '篮子' },
      { w: 'gift', zh: '礼物' },
      { w: 'empty', zh: '空' }
    ],
    pages: [
      { art: 'home|ming,grandma|gift|·', en: 'I have a basket.', zh: '我有一个篮子。' },
      { art: 'home|ming,grandma|gift|♪', en: 'A gift is in the basket.', zh: '篮子里有一份礼物。' },
      { art: 'home|ming,grandma|gift|👀', en: 'The gift is for Mom.', zh: '礼物是给妈妈的。' },
      { art: 'home|ming,grandma|gift|?', en: 'I carry the basket.', zh: '我提着篮子。' },
      { art: 'home|ming,grandma|gift|·', en: 'I am careful with the basket.', zh: '我小心地提着篮子。' },
      { art: 'home|ming,grandma|gift|!', en: 'I give the gift to Mom.', zh: '我把礼物给妈妈。' },
      { art: 'home|ming,grandma|gift|♥', en: 'Mom is happy.', zh: '妈妈很开心。' },
      { art: 'home|ming,grandma|gift|★', en: 'The basket is empty now.', zh: '篮子现在空了。' },
      { art: 'home|ming,grandma|gift|…', en: 'I like to give gifts.', zh: '我喜欢送礼物。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['鼓', '篮子', '奶奶'], a: 1, kind: 'recall' },
      { q: '礼物是给谁的？', opts: ['奶奶', '爸爸', '妈妈'], a: 2, kind: 'infer' },
      { q: '送别人礼物，你会怎么做？', opts: ['想一想他喜欢什么，再送', '不送了', '随便送一个'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b44', lv: 'L4', tag: '游戏', title: 'Clap and Spin', zh: '拍手转圈',
    emoji: '🌀', color: '#F2E2A8',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「一起玩」这条线，认读 5 个新词。',
    trap: '连缀中间不加元音：tree 是「tr-ee」一个词，不是「特-瑞」两个音。',
    summary: '《拍手转圈》是「一起玩」：丽丽和爷爷在操场，围绕鼓把一件事读到底。本本词卡：鼓、打、拍手、转圈、乐趣。读前先看词卡，读完合上书说一说。',
    retell: '四句话复述：谁、在哪儿、遇到什么麻烦、怎么解决。（这一本是「一起玩」。）',
    think: '说说你会玩的一种乐器或一种声音。',
    pre: [
      { art: '🥁', en: 'drum', zh: '鼓' },
      { art: '🏃', en: 'hit', zh: '打' },
      { art: '🏃', en: 'clap', zh: '拍手' },
      { art: '🏃', en: 'spin', zh: '转圈' },
      { art: '💡', en: 'fun', zh: '乐趣' },
      { art: '📦', en: 'i', zh: 'i' },
      { art: '📦', en: 'the', zh: 'the' }
    ],
    sight: ['friend'],
    newWords: [
      { w: 'drum', zh: '鼓' },
      { w: 'hit', zh: '打' },
      { w: 'clap', zh: '拍手' },
      { w: 'spin', zh: '转圈' },
      { w: 'fun', zh: '乐趣' }
    ],
    pages: [
      { art: 'playground|lili,grandpa|drum|·', en: 'I have a drum.', zh: '我有一面鼓。' },
      { art: 'playground|lili,grandpa|drum|♪', en: 'I hit the drum.', zh: '我敲鼓。' },
      { art: 'playground|lili,grandpa|drum|👀', en: 'The drum is loud.', zh: '鼓很响。' },
      { art: 'playground|lili,grandpa|drum|?', en: 'I hit and hit.', zh: '我敲啊敲。' },
      { art: 'playground|lili,grandpa|drum|·', en: 'My friend claps.', zh: '我的朋友拍手。' },
      { art: 'playground|lili,grandpa|drum|!', en: 'We clap and spin.', zh: '我们拍手、转圈。' },
      { art: 'playground|lili,grandpa|drum|♥', en: 'The drum is fun.', zh: '鼓真好玩。' },
      { art: 'playground|lili,grandpa|drum|★', en: 'I like my drum.', zh: '我喜欢我的鼓。' },
      { art: 'playground|lili,grandpa|drum|…', en: 'We play the drum all day.', zh: '我们敲了一整天的鼓。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['朋友', '火腿', '旗子'], a: 0, kind: 'recall' },
      { q: '我用鼓做什么？', opts: ['敲出声音、玩', '装东西', '切菜'], a: 0, kind: 'infer' },
      { q: '玩一样喜欢的乐器，你会怎么做？', opts: ['不玩了', '乱敲一通', '按节奏来，好好享受'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b45', lv: 'L4', tag: '发音', title: 'Say It: Tree', zh: '说一说：tree',
    emoji: '🗣️', color: '#D9D2F5',
    track: 'drill',
    goal: '把本级难点音听准、说准，并能在整句里读对。这一本走「跟读整句」这条线，不引入新词，全部是读过的词。',
    trap: '连缀中间不加元音：tree 是「tr-ee」一个词，不是「特-瑞」两个音。',
    summary: '《说一说：tree》是「跟读整句」：奶奶和妈妈在家，围绕树把一件事读到底。本本词卡：这一本不引入新词，全部是读过的词。读前先看词卡，读完合上书说一说。',
    retell: '四句话复述：谁、在哪儿、遇到什么麻烦、怎么解决。（这一本是「跟读整句」。）',
    think: '找一个带 tr 的词，读一读。',
    pre: [
      { art: '📦', en: 'is', zh: 'is' },
      { art: '📦', en: 'a', zh: 'a' }
    ],
    sight: ['tree'],
    newWords: [

    ],
    pages: [
      { art: 'table|grandma,mom|tree|·', en: 'This is a tree.', zh: '这是一棵树。' },
      { art: 'table|grandma,mom|tree|♪', en: 'Say "tree".', zh: '说「树」。' },
      { art: 'table|grandma,mom|tree|👀', en: 'The "tr" is one sound.', zh: '「tr」是一个音。' },
      { art: 'table|grandma,mom|tree|?', en: 'Say "tr-ee".', zh: '说「tr-ee」。' },
      { art: 'table|grandma,mom|tree|·', en: 'Tree, tree, tree.', zh: '树、树、树。' },
      { art: 'table|grandma,mom|tree|!', en: 'A tree is tall.', zh: '树很高。' },
      { art: 'table|grandma,mom|tree|♥', en: 'I see a tree.', zh: '我看见一棵树。' },
      { art: 'table|grandma,mom|tree|★', en: 'You can say "tree".', zh: '你会说「树」了。' },
      { art: 'table|grandma,mom|tree|…', en: 'Good!', zh: '真棒！' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['水壶', '树', '奶奶'], a: 1, kind: 'recall' },
      { q: '这一本在练什么？', opts: ['说「草」这个词', '说「花」这个词', '说「树」这个词'], a: 2, kind: 'infer' },
      { q: '遇到带 tr 的单词，你会怎么读？', opts: ['跳过去', '把 tr 连成一个音读出来', '一个字母一个字母念'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b46', lv: 'L4', tag: '小知识', title: 'How a Stem Grows', zh: '茎怎么长',
    emoji: '🌱', color: '#FAD3B6',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。这一本走「数一数」这条线，认读 2 个新词。',
    trap: '连缀中间不加元音：tree 是「tr-ee」一个词，不是「特-瑞」两个音。',
    summary: '《茎怎么长》是「数一数」：爷爷和爸爸在花园，围绕茎把一件事读到底。本本词卡：茎、花。读前先看词卡，读完合上书说一说。',
    retell: '四句话复述：谁、在哪儿、遇到什么麻烦、怎么解决。（这一本是「数一数」。）',
    think: '说说一株植物是怎么长大的。',
    pre: [
      { art: '🌿', en: 'stem', zh: '茎' },
      { art: '🌻', en: 'flower', zh: '花' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'a', zh: 'a' }
    ],
    sight: ['grows', 'leaf'],
    newWords: [
      { w: 'stem', zh: '茎' },
      { w: 'flower', zh: '花' }
    ],
    pages: [
      { art: 'garden|grandpa,dad|stem|·', en: 'A small stem is here.', zh: '这里有一根小茎。' },
      { art: 'garden|grandpa,dad|stem|♪', en: 'The stem is thin and small.', zh: '茎又细又小。' },
      { art: 'garden|grandpa,dad|stem|👀', en: 'It grows and grows.', zh: '它长啊长。' },
      { art: 'garden|grandpa,dad|stem|?', en: 'The stem gets big.', zh: '茎变粗了。' },
      { art: 'garden|grandpa,dad|stem|·', en: 'A leaf comes out.', zh: '叶子长出来了。' },
      { art: 'garden|grandpa,dad|stem|!', en: 'The stem grows up.', zh: '茎往上长。' },
      { art: 'garden|grandpa,dad|stem|♥', en: 'A flower is on the stem.', zh: '茎上开了花。' },
      { art: 'garden|grandpa,dad|stem|★', en: 'The stem is tall now.', zh: '茎现在很高了。' },
      { art: 'garden|grandpa,dad|stem|…', en: 'How a stem grows!', zh: '茎就是这样长大的！' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['茎', '厨房', '葡萄'], a: 0, kind: 'recall' },
      { q: '茎是怎么长的？', opts: ['从细小长到粗高，还长出叶子和花', '越长越小', '一直不变'], a: 0, kind: 'infer' },
      { q: '想看着一样东西长大，你会怎么做？', opts: ['每天看看，耐心等', '不看了', '一直拔它'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b47', lv: 'L4', tag: '小知识', title: 'Snow on the Street', zh: '街上的雪',
    emoji: '❄️', color: '#C8E7F0',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。这一本走「合上书讲一遍」这条线，认读 3 个新词。',
    trap: '连缀中间不加元音：tree 是「tr-ee」一个词，不是「特-瑞」两个音。',
    summary: '《街上的雪》是「合上书讲一遍」：妈妈和明明在家，围绕雪把一件事读到底。本本词卡：雪、街道、白色。读前先看词卡，读完合上书说一说。',
    retell: '四句话复述：谁、在哪儿、遇到什么麻烦、怎么解决。（这一本是「合上书讲一遍」。）',
    think: '说说下雪天你会玩什么。',
    pre: [
      { art: '❄️', en: 'snow', zh: '雪' },
      { art: '🛣️', en: 'street', zh: '街道' },
      { art: '⚪', en: 'white', zh: '白色' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'i', zh: 'i' }
    ],
    sight: [],
    newWords: [
      { w: 'snow', zh: '雪' },
      { w: 'street', zh: '街道' },
      { w: 'white', zh: '白色' }
    ],
    pages: [
      { art: 'night|mom,ming|snow|·', en: 'Snow is on the street.', zh: '街上有雪。' },
      { art: 'night|mom,ming|snow|♪', en: 'The snow is white and cold.', zh: '雪又白又冷。' },
      { art: 'night|mom,ming|snow|👀', en: 'I walk on the street.', zh: '我在街上走。' },
      { art: 'night|mom,ming|snow|?', en: 'I am cold.', zh: '我很冷。' },
      { art: 'night|mom,ming|snow|·', en: 'I make a ball of snow.', zh: '我堆了一个雪球。' },
      { art: 'night|mom,ming|snow|!', en: 'The snow ball is big.', zh: '雪球很大。' },
      { art: 'night|mom,ming|snow|♥', en: 'I am not cold now.', zh: '我现在不冷了。' },
      { art: 'night|mom,ming|snow|★', en: 'I like the snow.', zh: '我喜欢雪。' },
      { art: 'night|mom,ming|snow|…', en: 'Snow on the street is good.', zh: '街上的雪真好。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['国王', '街道', '拖把'], a: 1, kind: 'recall' },
      { q: '我为什么不冷了？', opts: ['玩雪球，动起来了', '进屋了', '太阳出来了'], a: 0, kind: 'infer' },
      { q: '下雪天在外面玩，你会怎么做？', opts: ['穿得很少', '穿暖和，玩一会儿就暖起来', '不出去'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b48', lv: 'L4', tag: '复习', title: 'Back to the Playground', zh: '回到操场',
    emoji: '🏫', color: '#E8D9B5',
    track: 'review',
    goal: '把本级和前面级别的词再读一遍、串成一个故事。这一本走「数一数」这条线，认读 1 个新词。',
    trap: '连缀中间不加元音：tree 是「tr-ee」一个词，不是「特-瑞」两个音。',
    summary: '《回到操场》是「数一数」：爸爸和丽丽在图书馆，围绕旗子把一件事读到底。本本词卡：操场。读前先看词卡，读完合上书说一说。',
    retell: '四句话复述：谁、在哪儿、遇到什么麻烦、怎么解决。（这一本是「数一数」。）',
    think: '说说你在操场上最喜欢玩的东西。',
    pre: [
      { art: '🛝', en: 'playground', zh: '操场' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'we', zh: 'we' }
    ],
    sight: [],
    newWords: [
      { w: 'playground', zh: '操场' }
    ],
    pages: [
      { art: 'library|dad,lili|playground|·', en: 'We go back to the playground.', zh: '我们回到操场。' },
      { art: 'library|dad,lili|playground|♪', en: 'The playground is big.', zh: '操场很大。' },
      { art: 'library|dad,lili|playground|👀', en: 'I see a ball and a flag.', zh: '我看见一个球和一面旗。' },
      { art: 'library|dad,lili|playground|?', en: 'We play with the ball.', zh: '我们玩球。' },
      { art: 'library|dad,lili|playground|·', en: 'We run and we clap.', zh: '我们跑、我们拍手。' },
      { art: 'library|dad,lili|playground|!', en: 'The clock says it is early.', zh: '钟说时间还早。' },
      { art: 'library|dad,lili|playground|♥', en: 'We play some more.', zh: '我们再玩一会儿。' },
      { art: 'library|dad,lili|playground|★', en: 'Back to the playground, all is well.', zh: '回到操场，一切都好。' },
      { art: 'library|dad,lili|playground|…', en: 'I like the playground.', zh: '我喜欢操场。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['人', '明明', '钟'], a: 2, kind: 'recall' },
      { q: '我们在操场上玩了什么？', opts: ['鼓', '书', '球'], a: 2, kind: 'infer' },
      { q: '和朋友一起玩，你会怎么做？', opts: ['轮流、一起玩，玩得开心', '不玩了', '自己霸占'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b49', lv: 'L5', tag: '天气', title: 'Rain on the Farm', zh: '农场上的雨',
    emoji: '🌧️', color: '#F6C6C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「看月亮」这条线，认读 3 个新词。',
    trap: '元音组合只读一个长音：ai / ay 都读 /eɪ/，oa 读 /əʊ/；别把两个字母分开念。',
    summary: '《农场上的雨》是「看月亮」：明明和奶奶在家，围绕雨把一件事读到底。本本词卡：雨、农场、安静。读前先看词卡，读完合上书说一说。',
    retell: '合上书，讲讲明明为什么等了那么久，结果学到了什么。（这一本是「看月亮」。）',
    think: '说说下雨对农场有什么好处。',
    pre: [
      { art: '🌧️', en: 'rain', zh: '雨' },
      { art: '🚜', en: 'farm', zh: '农场' },
      { art: '✨', en: 'quiet', zh: '安静' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'is', zh: 'is' }
    ],
    sight: [],
    newWords: [
      { w: 'rain', zh: '雨' },
      { w: 'farm', zh: '农场' },
      { w: 'quiet', zh: '安静' }
    ],
    pages: [
      { art: 'night|ming,grandma|rain|·', en: 'Rain is on the farm.', zh: '雨下在农场上。' },
      { art: 'night|ming,grandma|rain|♪', en: 'The rain is cold.', zh: '雨很冷。' },
      { art: 'night|ming,grandma|rain|👀', en: 'The farm is quiet.', zh: '农场很安静。' },
      { art: 'night|ming,grandma|rain|?', en: 'The rain falls and falls.', zh: '雨下啊下。' },
      { art: 'night|ming,grandma|rain|·', en: 'The farm is wet.', zh: '农场湿了。' },
      { art: 'night|ming,grandma|rain|!', en: 'The rain stops.', zh: '雨停了。' },
      { art: 'night|ming,grandma|rain|♥', en: 'The sun is here.', zh: '太阳出来了。' },
      { art: 'night|ming,grandma|rain|★', en: 'The farm is not wet now.', zh: '农场不湿了。' },
      { art: 'night|ming,grandma|rain|…', en: 'Rain is good for the farm.', zh: '雨对农场有好处。' },
      { art: 'night|ming,grandma|rain|·', en: 'I like the rain on the farm.', zh: '我喜欢农场上的雨。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['雨', '狗', '小鸡'], a: 0, kind: 'recall' },
      { q: '雨停以后出现了什么？', opts: ['太阳', '月亮', '雪'], a: 0, kind: 'infer' },
      { q: '下雨的时候，你会怎么做？', opts: ['一直在雨里跑', '找个地方躲雨，等它停', '不管它'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b50', lv: 'L5', tag: '海边', title: 'A Boat on the Sea', zh: '海上的小船',
    emoji: '⛵', color: '#F9DFB4',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「找贝壳」这条线，认读 2 个新词。',
    trap: '元音组合只读一个长音：ai / ay 都读 /eɪ/，oa 读 /əʊ/；别把两个字母分开念。',
    summary: '《海上的小船》是「找贝壳」：丽丽和爷爷在沙滩，围绕小船把一件事读到底。本本词卡：小船、海。读前先看词卡，读完合上书说一说。',
    retell: '合上书，讲讲丽丽为什么等了那么久，结果学到了什么。（这一本是「找贝壳」。）',
    think: '说说你见过的一艘船。',
    pre: [
      { art: '⛵', en: 'boat', zh: '小船' },
      { art: '🌊', en: 'sea', zh: '海' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'is', zh: 'is' }
    ],
    sight: ['watch'],
    newWords: [
      { w: 'boat', zh: '小船' },
      { w: 'sea', zh: '海' }
    ],
    pages: [
      { art: 'beach|lili,grandpa|boat|·', en: 'A boat is on the sea.', zh: '一艘船在海上。' },
      { art: 'beach|lili,grandpa|boat|♪', en: 'The boat is small.', zh: '船很小。' },
      { art: 'beach|lili,grandpa|boat|👀', en: 'The sea is big.', zh: '海很大。' },
      { art: 'beach|lili,grandpa|boat|?', en: 'The boat goes on the sea.', zh: '船在海上走。' },
      { art: 'beach|lili,grandpa|boat|·', en: 'The wind helps the boat.', zh: '风帮着船。' },
      { art: 'beach|lili,grandpa|boat|!', en: 'The boat goes far.', zh: '船走得很远。' },
      { art: 'beach|lili,grandpa|boat|♥', en: 'I watch the boat.', zh: '我看着船。' },
      { art: 'beach|lili,grandpa|boat|★', en: 'The boat comes back.', zh: '船回来了。' },
      { art: 'beach|lili,grandpa|boat|…', en: 'A boat on the sea.', zh: '海上的船。' },
      { art: 'beach|lili,grandpa|boat|·', en: 'I like the boat.', zh: '我喜欢这艘船。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['海', '地板', '乌鸦'], a: 0, kind: 'recall' },
      { q: '船在什么上面走？', opts: ['海', '河', '路'], a: 0, kind: 'infer' },
      { q: '在水边看船，你会怎么做？', opts: ['不管它', '站远一点，注意安全', '跑到水里去'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b51', lv: 'L5', tag: '夜空', title: 'The Moon and the Sheep', zh: '月亮和绵羊',
    emoji: '🌙', color: '#CDE7C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「睡不着」这条线，认读 3 个新词。',
    trap: '元音组合只读一个长音：ai / ay 都读 /eɪ/，oa 读 /əʊ/；别把两个字母分开念。',
    summary: '《月亮和绵羊》是「睡不着」：奶奶和妈妈在家，围绕月亮把一件事读到底。本本词卡：月亮、绵羊、睡觉。读前先看词卡，读完合上书说一说。',
    retell: '合上书，讲讲奶奶为什么等了那么久，结果学到了什么。（这一本是「睡不着」。）',
    think: '说说月亮和绵羊：它们哪里有点像？',
    pre: [
      { art: '🌙', en: 'moon', zh: '月亮' },
      { art: '🐑', en: 'sheep', zh: '绵羊' },
      { art: '🏃', en: 'sleep', zh: '睡觉' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'is', zh: 'is' }
    ],
    sight: ['quiet'],
    newWords: [
      { w: 'moon', zh: '月亮' },
      { w: 'sheep', zh: '绵羊' },
      { w: 'sleep', zh: '睡觉' }
    ],
    pages: [
      { art: 'night|grandma,mom|moon|·', en: 'The moon is in the sky.', zh: '月亮在天上。' },
      { art: 'night|grandma,mom|moon|♪', en: 'The moon is big.', zh: '月亮很大。' },
      { art: 'night|grandma,mom|moon|👀', en: 'Sheep are on the hill.', zh: '绵羊在小山上。' },
      { art: 'night|grandma,mom|moon|?', en: 'The sheep sleep at night.', zh: '绵羊晚上睡觉。' },
      { art: 'night|grandma,mom|moon|·', en: 'The moon looks at the sheep.', zh: '月亮看着绵羊。' },
      { art: 'night|grandma,mom|moon|!', en: 'The sheep are quiet.', zh: '绵羊很安静。' },
      { art: 'night|grandma,mom|moon|♥', en: 'The moon is quiet too.', zh: '月亮也很安静。' },
      { art: 'night|grandma,mom|moon|★', en: 'The moon and the sheep.', zh: '月亮和绵羊。' },
      { art: 'night|grandma,mom|moon|…', en: 'I like the moon at night.', zh: '我喜欢夜里的月亮。' },
      { art: 'night|grandma,mom|moon|·', en: 'The night is good.', zh: '这个夜晚真好。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['手套', '鸡蛋', '绵羊'], a: 2, kind: 'recall' },
      { q: '绵羊在哪儿？', opts: ['小山上', '水里', '树上'], a: 0, kind: 'infer' },
      { q: '晚上睡不着，你会怎么做？', opts: ['看看安静的月亮，慢慢静下来', '一直翻身', '开很亮的灯'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b52', lv: 'L5', tag: '种植', title: 'A Seed in a Pot', zh: '盆里的种子',
    emoji: '🌱', color: '#C6DEF6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「浇浇水」这条线，不引入新词，全部是读过的词。',
    trap: '元音组合只读一个长音：ai / ay 都读 /eɪ/，oa 读 /əʊ/；别把两个字母分开念。',
    summary: '《盆里的种子》是「浇浇水」：爷爷和爸爸在花园，围绕种子把一件事读到底。本本词卡：这一本不引入新词，全部是读过的词。读前先看词卡，读完合上书说一说。',
    retell: '合上书，讲讲爷爷为什么等了那么久，结果学到了什么。（这一本是「浇浇水」。）',
    think: '说说一粒种子是怎么发芽的。',
    pre: [
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'i', zh: 'i' }
    ],
    sight: ['grows', 'leaf', 'water'],
    newWords: [

    ],
    pages: [
      { art: 'garden|grandpa,dad|seed|·', en: 'I have a pot.', zh: '我有一个花盆。' },
      { art: 'garden|grandpa,dad|seed|♪', en: 'I put a seed in the pot.', zh: '我把种子放进花盆。' },
      { art: 'garden|grandpa,dad|seed|👀', en: 'The seed is small.', zh: '种子很小。' },
      { art: 'garden|grandpa,dad|seed|?', en: 'I give the seed water.', zh: '我给种子浇水。' },
      { art: 'garden|grandpa,dad|seed|·', en: 'The seed is in the pot.', zh: '种子在花盆里。' },
      { art: 'garden|grandpa,dad|seed|!', en: 'I wait and wait.', zh: '我等啊等。' },
      { art: 'garden|grandpa,dad|seed|♥', en: 'A stem comes up!', zh: '长出一根茎！' },
      { art: 'garden|grandpa,dad|seed|★', en: 'A leaf is up too.', zh: '叶子也长出来了。' },
      { art: 'garden|grandpa,dad|seed|…', en: 'The seed grows.', zh: '种子长大了。' },
      { art: 'garden|grandpa,dad|seed|·', en: 'I like my pot and seed.', zh: '我喜欢我的花盆和种子。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['帽子', '朋友', '种子'], a: 2, kind: 'recall' },
      { q: '种子长出了什么？', opts: ['什么都没长', '花和果子', '茎和叶子'], a: 2, kind: 'infer' },
      { q: '种下一样东西，你会怎么做？', opts: ['每天挖出来看', '不管它', '浇水、耐心等它长'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b53', lv: 'L5', tag: '观察', title: 'A Tail and a Chain', zh: '尾巴和链子',
    emoji: '🐐', color: '#E0CFF3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「排排顺序」这条线，认读 2 个新词。',
    trap: '元音组合只读一个长音：ai / ay 都读 /eɪ/，oa 读 /əʊ/；别把两个字母分开念。',
    summary: '《尾巴和链子》是「排排顺序」：妈妈和明明在图书馆，围绕尾巴把一件事读到底。本本词卡：尾巴、链子。读前先看词卡，读完合上书说一说。',
    retell: '合上书，讲讲妈妈为什么等了那么久，结果学到了什么。（这一本是「排排顺序」。）',
    think: '说说狗的尾巴能做什么。',
    pre: [
      { art: '🐾', en: 'tail', zh: '尾巴' },
      { art: '⛓️', en: 'chain', zh: '链子' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'and', zh: 'and' }
    ],
    sight: [],
    newWords: [
      { w: 'tail', zh: '尾巴' },
      { w: 'chain', zh: '链子' }
    ],
    pages: [
      { art: 'library|mom,ming|tail|·', en: 'A dog has a tail.', zh: '一条狗有一条尾巴。' },
      { art: 'library|mom,ming|tail|♪', en: 'The tail is long.', zh: '尾巴很长。' },
      { art: 'library|mom,ming|tail|👀', en: 'The tail goes up and down.', zh: '尾巴上下摆。' },
      { art: 'library|mom,ming|tail|?', en: 'The dog has a chain too.', zh: '狗还有一条链子。' },
      { art: 'library|mom,ming|tail|·', en: 'The chain is on the dog.', zh: '链子在狗身上。' },
      { art: 'library|mom,ming|tail|!', en: 'The dog runs and the tail goes.', zh: '狗跑，尾巴也动。' },
      { art: 'library|mom,ming|tail|♥', en: 'I like the dog and the tail.', zh: '我喜欢这条狗和它的尾巴。' },
      { art: 'library|mom,ming|tail|★', en: 'The tail and the chain.', zh: '尾巴和链子。' },
      { art: 'library|mom,ming|tail|…', en: 'The dog is happy.', zh: '狗很开心。' },
      { art: 'library|mom,ming|tail|·', en: 'I am happy too.', zh: '我也很开心。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['果酱', '尾巴', '山羊'], a: 1, kind: 'recall' },
      { q: '狗的尾巴怎么了？', opts: ['卷起来不动', '上下摆动', '掉了'], a: 1, kind: 'infer' },
      { q: '看到一只被链子拴着的狗，你会怎么做？', opts: ['去拉它的链子', '大声吓它', '轻轻看它，别靠近吓它'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b54', lv: 'L5', tag: '趣事', title: 'The Goat and a Coat', zh: '山羊和外套',
    emoji: '🧥', color: '#F6C9E3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「借了要还」这条线，认读 2 个新词。',
    trap: '元音组合只读一个长音：ai / ay 都读 /eɪ/，oa 读 /əʊ/；别把两个字母分开念。',
    summary: '《山羊和外套》是「借了要还」：爸爸和丽丽在家，围绕外套把一件事读到底。本本词卡：山羊、外套。读前先看词卡，读完合上书说一说。',
    retell: '合上书，讲讲爸爸为什么等了那么久，结果学到了什么。（这一本是「借了要还」。）',
    think: '说说一件让你觉得暖和的衣服。',
    pre: [
      { art: '🐐', en: 'goat', zh: '山羊' },
      { art: '🧥', en: 'coat', zh: '外套' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'is', zh: 'is' }
    ],
    sight: ['warm', 'wear'],
    newWords: [
      { w: 'goat', zh: '山羊' },
      { w: 'coat', zh: '外套' }
    ],
    pages: [
      { art: 'home|dad,lili|coat|·', en: 'A goat is on the hill.', zh: '一只山羊在小山上。' },
      { art: 'home|dad,lili|coat|♪', en: 'The goat is small.', zh: '山羊很小。' },
      { art: 'home|dad,lili|coat|👀', en: 'I have a coat.', zh: '我有一件外套。' },
      { art: 'home|dad,lili|coat|?', en: 'The coat is big.', zh: '外套很大。' },
      { art: 'home|dad,lili|coat|·', en: 'I wear the coat.', zh: '我穿上外套。' },
      { art: 'home|dad,lili|coat|!', en: 'The goat is on the hill.', zh: '山羊在小山上。' },
      { art: 'home|dad,lili|coat|♥', en: 'I am warm with the coat.', zh: '穿上外套，我很暖和。' },
      { art: 'home|dad,lili|coat|★', en: 'The goat and my coat.', zh: '山羊和我的外套。' },
      { art: 'home|dad,lili|coat|…', en: 'I like the goat.', zh: '我喜欢这只山羊。' },
      { art: 'home|dad,lili|coat|·', en: 'The goat likes the hill.', zh: '山羊喜欢小山。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['外套', '丽丽', '手'], a: 0, kind: 'recall' },
      { q: '我穿了什么？', opts: ['鞋子', '帽子', '外套'], a: 2, kind: 'infer' },
      { q: '天冷的时候，你会怎么做？', opts: ['穿上暖和的衣服', '不出门', '穿得很少'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b55', lv: 'L5', tag: '美术', title: 'Paint a Green Leaf', zh: '画一片绿叶',
    emoji: '🍃', color: '#BFE6DF',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「挖一挖」这条线，认读 1 个新词。',
    trap: '元音组合只读一个长音：ai / ay 都读 /eɪ/，oa 读 /əʊ/；别把两个字母分开念。',
    summary: '《画一片绿叶》是「挖一挖」：明明和奶奶在花园，围绕叶子把一件事读到底。本本词卡：涂色。读前先看词卡，读完合上书说一说。',
    retell: '合上书，讲讲明明为什么等了那么久，结果学到了什么。（这一本是「挖一挖」。）',
    think: '说说你画过的一样东西。',
    pre: [
      { art: '🎨', en: 'paint', zh: '涂色' },
      { art: '📦', en: 'i', zh: 'i' },
      { art: '🍃', en: 'leaf', zh: '叶子' }
    ],
    sight: ['leaf', 'leaves', 'paper'],
    newWords: [
      { w: 'paint', zh: '涂色' }
    ],
    pages: [
      { art: 'garden|ming,grandma|leaf|·', en: 'I paint a leaf.', zh: '我画一片叶子。' },
      { art: 'garden|ming,grandma|leaf|♪', en: 'The leaf is green.', zh: '叶子是绿色的。' },
      { art: 'garden|ming,grandma|leaf|👀', en: 'I paint it green.', zh: '我把它画成绿色。' },
      { art: 'garden|ming,grandma|leaf|?', en: 'I paint the stem too.', zh: '茎我也画了。' },
      { art: 'garden|ming,grandma|leaf|·', en: 'The leaf is on my paper.', zh: '叶子在我画的纸上。' },
      { art: 'garden|ming,grandma|leaf|!', en: 'I like green leaves.', zh: '我喜欢绿色的叶子。' },
      { art: 'garden|ming,grandma|leaf|♥', en: 'I paint and paint.', zh: '我画啊画。' },
      { art: 'garden|ming,grandma|leaf|★', en: 'My leaf is good.', zh: '我的叶子画得真好。' },
      { art: 'garden|ming,grandma|leaf|…', en: 'Green leaves are nice.', zh: '绿色的叶子真好看。' },
      { art: 'garden|ming,grandma|leaf|·', en: 'I like to paint.', zh: '我喜欢画画。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['国王', '月亮', '茎'], a: 2, kind: 'recall' },
      { q: '我把叶子画成了什么颜色？', opts: ['蓝色', '绿色', '红色'], a: 1, kind: 'infer' },
      { q: '画画时，你会怎么做？', opts: ['乱涂几下', '想好画什么，慢慢画', '不画了'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b56', lv: 'L5', tag: '动物', title: 'Food at the Zoo', zh: '动物园的食物',
    emoji: '🦒', color: '#F2E2A8',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「合上书讲一遍」这条线，认读 1 个新词。',
    trap: '元音组合只读一个长音：ai / ay 都读 /eɪ/，oa 读 /əʊ/；别把两个字母分开念。',
    summary: '《动物园的食物》是「合上书讲一遍」：丽丽和爷爷在图书馆，围绕动物园把一件事读到底。本本词卡：动物园。读前先看词卡，读完合上书说一说。',
    retell: '合上书，讲讲丽丽为什么等了那么久，结果学到了什么。（这一本是「合上书讲一遍」。）',
    think: '说说你在动物园看到的一种动物。',
    pre: [
      { art: '🦁', en: 'zoo', zh: '动物园' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'we', zh: 'we' }
    ],
    sight: ['eats'],
    newWords: [
      { w: 'zoo', zh: '动物园' }
    ],
    pages: [
      { art: 'library|lili,grandpa|zoo|·', en: 'We go to the zoo.', zh: '我们去动物园。' },
      { art: 'library|lili,grandpa|zoo|♪', en: 'The zoo has many animals.', zh: '动物园里有很多动物。' },
      { art: 'library|lili,grandpa|zoo|👀', en: 'We see a goat and a pig.', zh: '我们看见山羊和猪。' },
      { art: 'library|lili,grandpa|zoo|?', en: 'The animals are hungry.', zh: '动物们饿了。' },
      { art: 'library|lili,grandpa|zoo|·', en: 'We give the animals food.', zh: '我们给动物吃的。' },
      { art: 'library|lili,grandpa|zoo|!', en: 'The goat eats the food.', zh: '山羊吃了食物。' },
      { art: 'library|lili,grandpa|zoo|♥', en: 'The pig eats too.', zh: '猪也吃了。' },
      { art: 'library|lili,grandpa|zoo|★', en: 'Food at the zoo.', zh: '动物园里的食物。' },
      { art: 'library|lili,grandpa|zoo|…', en: 'The animals are happy.', zh: '动物们很开心。' },
      { art: 'library|lili,grandpa|zoo|·', en: 'We like the zoo.', zh: '我们喜欢动物园。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['午饭', '平底锅', '食物'], a: 2, kind: 'recall' },
      { q: '我们给动物什么了？', opts: ['水', '吃的', '玩具'], a: 1, kind: 'infer' },
      { q: '在动物园里，你会怎么做？', opts: ['乱喂东西', '按规定喂食，轻轻看它们', '大声吓它们'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b57', lv: 'L5', tag: '发音', title: 'Say It: Rain, Day', zh: '说一说：rain day',
    emoji: '🗣️', color: '#D9D2F5',
    track: 'drill',
    goal: '把本级难点音听准、说准，并能在整句里读对。这一本走「跟读整句」这条线，不引入新词，全部是读过的词。',
    trap: '元音组合只读一个长音：ai / ay 都读 /eɪ/，oa 读 /əʊ/；别把两个字母分开念。',
    summary: '《说一说：rain day》是「跟读整句」：奶奶和妈妈在家，围绕雨把一件事读到底。本本词卡：这一本不引入新词，全部是读过的词。读前先看词卡，读完合上书说一说。',
    retell: '合上书，讲讲奶奶为什么等了那么久，结果学到了什么。（这一本是「跟读整句」。）',
    think: '找两个词，一个说天气、一个说时间，读一读。',
    pre: [
      { art: '🌧️', en: 'rain', zh: '雨' },
      { art: '⏰', en: 'day', zh: '白天' }
    ],
    sight: [],
    newWords: [

    ],
    pages: [
      { art: 'table|grandma,mom|rain|·', en: 'This is "rain".', zh: '这是「雨」。' },
      { art: 'table|grandma,mom|rain|♪', en: 'This is "day".', zh: '这是「白天」。' },
      { art: 'table|grandma,mom|rain|👀', en: 'Rain and day.', zh: '雨和白天。' },
      { art: 'table|grandma,mom|rain|?', en: 'Say "rain".', zh: '说「雨」。' },
      { art: 'table|grandma,mom|rain|·', en: 'Say "day".', zh: '说「白天」。' },
      { art: 'table|grandma,mom|rain|!', en: 'Rain is not day.', zh: '雨不是白天。' },
      { art: 'table|grandma,mom|rain|♥', en: 'Rain can be in the day.', zh: '白天可以下雨。' },
      { art: 'table|grandma,mom|rain|★', en: 'You can say both.', zh: '两个你都会说了。' },
      { art: 'table|grandma,mom|rain|…', en: 'Good!', zh: '真棒！' },
      { art: 'table|grandma,mom|rain|·', en: 'Rain, day, rain, day.', zh: '雨、白天、雨、白天。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['地图', '雨', '公园'], a: 1, kind: 'recall' },
      { q: '这一本在练哪两个词？', opts: ['day 和 night', 'rain 和 day', 'rain 和 night'], a: 1, kind: 'infer' },
      { q: '两个词放在一起，你会怎么读？', opts: ['一个一个读，再连起来', '不读了', '混在一起读'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b58', lv: 'L5', tag: '小知识', title: 'Why a Seed Needs Rain', zh: '种子为什么需要雨',
    emoji: '🌾', color: '#FAD3B6',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。这一本走「数一数」这条线，认读 1 个新词。',
    trap: '元音组合只读一个长音：ai / ay 都读 /eɪ/，oa 读 /əʊ/；别把两个字母分开念。',
    summary: '《种子为什么需要雨》是「数一数」：爷爷和爸爸在花园，围绕种子把一件事读到底。本本词卡：地面。读前先看词卡，读完合上书说一说。',
    retell: '合上书，讲讲爷爷为什么等了那么久，结果学到了什么。（这一本是「数一数」。）',
    think: '说说雨水是怎么帮植物长大的。',
    pre: [
      { art: '🌿', en: 'ground', zh: '地面' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '🌱', en: 'seed', zh: '种子' }
    ],
    sight: ['grows', 'water'],
    newWords: [
      { w: 'ground', zh: '地面' }
    ],
    pages: [
      { art: 'garden|grandpa,dad|seed|·', en: 'A seed is in the pot.', zh: '种子在花盆里。' },
      { art: 'garden|grandpa,dad|seed|♪', en: 'The seed needs rain.', zh: '种子需要雨水。' },
      { art: 'garden|grandpa,dad|seed|👀', en: 'Why does a seed need rain?', zh: '为什么种子需要雨？' },
      { art: 'garden|grandpa,dad|seed|?', en: 'Rain makes the ground wet.', zh: '雨让泥土变湿。' },
      { art: 'garden|grandpa,dad|seed|·', en: 'The wet ground is good for the seed.', zh: '湿湿的土对种子好。' },
      { art: 'garden|grandpa,dad|seed|!', en: 'The seed drinks the water.', zh: '种子喝到水。' },
      { art: 'garden|grandpa,dad|seed|♥', en: 'The seed grows up.', zh: '种子长高了。' },
      { art: 'garden|grandpa,dad|seed|★', en: 'Rain helps the seed.', zh: '雨水帮了种子。' },
      { art: 'garden|grandpa,dad|seed|…', en: 'A seed needs rain.', zh: '种子需要雨。' },
      { art: 'garden|grandpa,dad|seed|·', en: 'Rain is good.', zh: '雨真好。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['一', '水池', '雨'], a: 2, kind: 'recall' },
      { q: '种子为什么需要雨？', opts: ['雨让种子睡着', '雨让土变湿，种子能喝到水', '雨让土变硬'], a: 1, kind: 'infer' },
      { q: '想知道一件事为什么发生，你会怎么做？', opts: ['不管它', '随便猜', '想一想、问一问、再看看'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b59', lv: 'L5', tag: '小知识', title: 'A Week on the Farm', zh: '农场的一周',
    emoji: '🚜', color: '#C8E7F0',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。这一本走「合上书讲一遍」这条线，认读 2 个新词。',
    trap: '元音组合只读一个长音：ai / ay 都读 /eɪ/，oa 读 /əʊ/；别把两个字母分开念。',
    summary: '《农场的一周》是「合上书讲一遍」：妈妈和明明在农场，围绕农场把一件事读到底。本本词卡：喂、玉米。读前先看词卡，读完合上书说一说。',
    retell: '合上书，讲讲妈妈为什么等了那么久，结果学到了什么。（这一本是「合上书讲一遍」。）',
    think: '说说你最想在农场做的一件事。',
    pre: [
      { art: '🏃', en: 'feed', zh: '喂' },
      { art: '🌽', en: 'corn', zh: '玉米' },
      { art: '📦', en: 'i', zh: 'i' },
      { art: '📦', en: 'the', zh: 'the' }
    ],
    sight: ['farm', 'watch'],
    newWords: [
      { w: 'feed', zh: '喂' },
      { w: 'corn', zh: '玉米' }
    ],
    pages: [
      { art: 'farm|mom,ming|farm|·', en: 'I am on the farm for a week.', zh: '我在农场待了一周。' },
      { art: 'farm|mom,ming|farm|♪', en: 'One day I feed the pig.', zh: '有一天我喂猪。' },
      { art: 'farm|mom,ming|farm|👀', en: 'One day I wash the goat.', zh: '有一天我洗山羊。' },
      { art: 'farm|mom,ming|farm|?', en: 'One day I pick the corn.', zh: '有一天我摘玉米。' },
      { art: 'farm|mom,ming|farm|·', en: 'One day I find an egg.', zh: '有一天我捡到一个蛋。' },
      { art: 'farm|mom,ming|farm|!', en: 'One day I watch the rain.', zh: '有一天我看雨。' },
      { art: 'farm|mom,ming|farm|♥', en: 'One day I sit on the hill.', zh: '有一天我坐在小山上。' },
      { art: 'farm|mom,ming|farm|★', en: 'A week on the farm.', zh: '农场的一周。' },
      { art: 'farm|mom,ming|farm|…', en: 'The farm is good.', zh: '农场真好。' },
      { art: 'farm|mom,ming|farm|·', en: 'I want to come back.', zh: '我还想再来。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['山羊', '天空', '路'], a: 0, kind: 'recall' },
      { q: '我在农场做了什么？', opts: ['写作业、看书', '坐车、买东西', '喂猪、洗山羊、摘玉米'], a: 2, kind: 'infer' },
      { q: '在农场待几天，你会怎么做？', opts: ['每天做一点不一样的事', '什么都不做', '天天一样'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b60', lv: 'L5', tag: '复习', title: 'All the Way Home', zh: '一路回家',
    emoji: '🏡', color: '#E8D9B5',
    track: 'review',
    goal: '把本级和前面级别的词再读一遍、串成一个故事。这一本走「猜一猜」这条线，不引入新词，全部是读过的词。',
    trap: '元音组合只读一个长音：ai / ay 都读 /eɪ/，oa 读 /əʊ/；别把两个字母分开念。',
    summary: '《一路回家》是「猜一猜」：爸爸和丽丽在图书馆，围绕路把一件事读到底。本本词卡：这一本不引入新词，全部是读过的词。读前先看词卡，读完合上书说一说。',
    retell: '合上书，讲讲爸爸为什么等了那么久，结果学到了什么。（这一本是「猜一猜」。）',
    think: '说说你走过的一条路：它通向哪里？',
    pre: [
      { art: '📦', en: 'i', zh: 'i' },
      { art: '📦', en: 'the', zh: 'the' }
    ],
    sight: ['tired'],
    newWords: [

    ],
    pages: [
      { art: 'library|dad,lili|road|·', en: 'I walk and I walk.', zh: '我走啊走。' },
      { art: 'library|dad,lili|road|♪', en: 'I go down the road.', zh: '我沿着路走。' },
      { art: 'library|dad,lili|road|👀', en: 'The road is long.', zh: '路很长。' },
      { art: 'library|dad,lili|road|?', en: 'I am tired.', zh: '我累了。' },
      { art: 'library|dad,lili|road|·', en: 'I sit on a stone.', zh: '我坐在石头上。' },
      { art: 'library|dad,lili|road|!', en: 'I look at the road.', zh: '我看着这条路。' },
      { art: 'library|dad,lili|road|♥', en: 'I get up and walk again.', zh: '我起来接着走。' },
      { art: 'library|dad,lili|road|★', en: 'The road goes home.', zh: '这条路通向家。' },
      { art: 'library|dad,lili|road|…', en: 'All the way home.', zh: '一路回家。' },
      { art: 'library|dad,lili|road|·', en: 'I am home!', zh: '我到家了！' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['种子', '石头', '水池'], a: 1, kind: 'recall' },
      { q: '路的尽头是什么？', opts: ['学校', '商店', '家'], a: 2, kind: 'infer' },
      { q: '走很长的路，你会怎么做？', opts: ['不走了', '累了就歇一歇，再接着走', '一直不停，累垮'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b61', lv: 'L6', tag: '生日', title: 'A Cake for Grandma', zh: '给奶奶的蛋糕',
    emoji: '🎂', color: '#F6C6C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「一起做」这条线，认读 1 个新词。',
    trap: '词尾不发音的 e 会让前面的元音「报自己的名字」：cap → cape，kit → kite。',
    summary: '《给奶奶的蛋糕》是「一起做」：明明和奶奶在家，围绕蛋糕把一件事读到底。本本词卡：蛋糕。读前先看词卡，读完合上书说一说。',
    retell: '按「计划 → 卡住 → 谁帮了忙 → 结果」讲一遍。（这一本是「一起做」。）',
    think: '说说你为家人做过的一件事。',
    pre: [
      { art: '🎂', en: 'cake', zh: '蛋糕' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👦', en: 'ming', zh: '明明' }
    ],
    sight: [],
    newWords: [
      { w: 'cake', zh: '蛋糕' }
    ],
    pages: [
      { art: 'kitchen|ming,grandma|cake|·', en: 'Ming wants to make a cake.', zh: '明明想做一个蛋糕。' },
      { art: 'kitchen|ming,grandma|cake|♪', en: 'The cake is for Grandma.', zh: '蛋糕是给奶奶的。' },
      { art: 'kitchen|ming,grandma|cake|👀', en: 'Ming gets the things ready.', zh: '明明把东西备好。' },
      { art: 'kitchen|ming,grandma|cake|?', en: 'Ming mixes and makes.', zh: '明明和啊和、做啊做。' },
      { art: 'kitchen|ming,grandma|cake|·', en: 'The cake is not right.', zh: '蛋糕做得不对。' },
      { art: 'kitchen|ming,grandma|cake|!', en: 'Ming is sad.', zh: '明明很难过。' },
      { art: 'kitchen|ming,grandma|cake|♥', en: 'Grandma comes and helps.', zh: '奶奶来帮忙。' },
      { art: 'kitchen|ming,grandma|cake|★', en: 'They make the cake again.', zh: '他们重新做蛋糕。' },
      { art: 'kitchen|ming,grandma|cake|…', en: 'This time the cake is good.', zh: '这次蛋糕做得好。' },
      { art: 'kitchen|ming,grandma|cake|·', en: 'Grandma likes the cake.', zh: '奶奶喜欢这个蛋糕。' },
      { art: 'kitchen|ming,grandma|cake|♥', en: 'A cake for Grandma.', zh: '给奶奶的蛋糕。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['国王', '葡萄', '蛋糕'], a: 2, kind: 'recall' },
      { q: '蛋糕是给谁的？', opts: ['爸爸', '妈妈', '奶奶'], a: 2, kind: 'infer' },
      { q: '做一件事第一次不成功，你会怎么做？', opts: ['怪别人', '找人帮帮忙，再做一次', '马上放弃'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b62', lv: 'L6', tag: '春天', title: 'The Kite by the Lake', zh: '湖边的风筝',
    emoji: '🪁', color: '#F9DFB4',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「搭高它」这条线，认读 3 个新词。',
    trap: '词尾不发音的 e 会让前面的元音「报自己的名字」：cap → cape，kit → kite。',
    summary: '《湖边的风筝》是「搭高它」：丽丽和爷爷在操场，围绕风筝把一件事读到底。本本词卡：风筝、湖、线。读前先看词卡，读完合上书说一说。',
    retell: '按「计划 → 卡住 → 谁帮了忙 → 结果」讲一遍。（这一本是「搭高它」。）',
    think: '说说你放风筝的一次经历。',
    pre: [
      { art: '🪁', en: 'kite', zh: '风筝' },
      { art: '🏞️', en: 'lake', zh: '湖' },
      { art: '📦', en: 'line', zh: '线' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'is', zh: 'is' }
    ],
    sight: ['blue', 'high'],
    newWords: [
      { w: 'kite', zh: '风筝' },
      { w: 'lake', zh: '湖' },
      { w: 'line', zh: '线' }
    ],
    pages: [
      { art: 'playground|lili,grandpa|kite|·', en: 'A kite is by the lake.', zh: '湖边有一只风筝。' },
      { art: 'playground|lili,grandpa|kite|♪', en: 'The kite is red and blue.', zh: '风筝是红蓝相间的。' },
      { art: 'playground|lili,grandpa|kite|👀', en: 'Ming takes the kite.', zh: '明明拿起风筝。' },
      { art: 'playground|lili,grandpa|kite|?', en: 'The wind is strong by the lake.', zh: '湖边风很大。' },
      { art: 'playground|lili,grandpa|kite|·', en: 'Ming runs with the kite.', zh: '明明带着风筝跑。' },
      { art: 'playground|lili,grandpa|kite|!', en: 'The kite goes up!', zh: '风筝飞起来了！' },
      { art: 'playground|lili,grandpa|kite|♥', en: 'The kite is high in the sky.', zh: '风筝高高地在天上。' },
      { art: 'playground|lili,grandpa|kite|★', en: 'Ming holds the line.', zh: '明明拉着线。' },
      { art: 'playground|lili,grandpa|kite|…', en: 'The kite is by the lake.', zh: '风筝在湖边。' },
      { art: 'playground|lili,grandpa|kite|·', en: 'Ming likes the kite.', zh: '明明喜欢这只风筝。' },
      { art: 'playground|lili,grandpa|kite|♥', en: 'A kite by the lake.', zh: '湖边的风筝。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['天空', '腿', '飞蛾'], a: 0, kind: 'recall' },
      { q: '风筝在哪儿飞起来的？', opts: ['湖边', '山顶', '街上'], a: 0, kind: 'infer' },
      { q: '想让风筝飞起来，你会怎么做？', opts: ['在屋里放', '找个有风的地方，边跑边放', '不放了'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b63', lv: 'L6', tag: '家里', title: 'A Name on the Plate', zh: '盘子上的名字',
    emoji: '🍽️', color: '#CDE7C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「补一补」这条线，认读 1 个新词。',
    trap: '词尾不发音的 e 会让前面的元音「报自己的名字」：cap → cape，kit → kite。',
    summary: '《盘子上的名字》是「补一补」：奶奶和妈妈在家，围绕名字把一件事读到底。本本词卡：盘子。读前先看词卡，读完合上书说一说。',
    retell: '按「计划 → 卡住 → 谁帮了忙 → 结果」讲一遍。（这一本是「补一补」。）',
    think: '说说你的名字：它有什么特别？',
    pre: [
      { art: '🍽️', en: 'plate', zh: '盘子' },
      { art: '🏷️', en: 'name', zh: '名字' },
      { art: '📦', en: 'is', zh: 'is' }
    ],
    sight: [],
    newWords: [
      { w: 'plate', zh: '盘子' }
    ],
    pages: [
      { art: 'home|grandma,mom|name|·', en: 'A plate is on the table.', zh: '桌上有一个盘子。' },
      { art: 'home|grandma,mom|name|♪', en: 'A name is on the plate.', zh: '盘子上有个名字。' },
      { art: 'home|grandma,mom|name|👀', en: 'Whose name is it?', zh: '这是谁的名字？' },
      { art: 'home|grandma,mom|name|?', en: 'Ming looks at the name.', zh: '明明看着这个名字。' },
      { art: 'home|grandma,mom|name|·', en: 'The name is not Ming.', zh: '名字不是明明。' },
      { art: 'home|grandma,mom|name|!', en: 'It is Grandma\'s name.', zh: '是奶奶的名字。' },
      { art: 'home|grandma,mom|name|♥', en: 'Ming gives the plate to Grandma.', zh: '明明把盘子给奶奶。' },
      { art: 'home|grandma,mom|name|★', en: 'Grandma is glad.', zh: '奶奶很高兴。' },
      { art: 'home|grandma,mom|name|…', en: 'A name on the plate.', zh: '盘子上的名字。' },
      { art: 'home|grandma,mom|name|·', en: 'Names can tell us things.', zh: '名字能告诉我们事情。' },
      { art: 'home|grandma,mom|name|♥', en: 'I like my name.', zh: '我喜欢我的名字。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['盘子', '腿', '拖把'], a: 0, kind: 'recall' },
      { q: '盘子上是谁的名字？', opts: ['妈妈的', '奶奶的', '明明的'], a: 1, kind: 'infer' },
      { q: '想知道一样东西是谁的，你会怎么做？', opts: ['自己拿走', '看看上面的名字，或问一问', '不管它'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b64', lv: 'L6', tag: '运动', title: 'Ride a Bike', zh: '骑自行车',
    emoji: '🚲', color: '#C6DEF6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「等一等」这条线，认读 2 个新词。',
    trap: '词尾不发音的 e 会让前面的元音「报自己的名字」：cap → cape，kit → kite。',
    summary: '《骑自行车》是「等一等」：爷爷和爸爸在街道，围绕自行车把一件事读到底。本本词卡：自行车、骑。读前先看词卡，读完合上书说一说。',
    retell: '按「计划 → 卡住 → 谁帮了忙 → 结果」讲一遍。（这一本是「等一等」。）',
    think: '说说你学会过的一样新本领。',
    pre: [
      { art: '🚲', en: 'bike', zh: '自行车' },
      { art: '🏃', en: 'ride', zh: '骑' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👦', en: 'ming', zh: '明明' }
    ],
    sight: [],
    newWords: [
      { w: 'bike', zh: '自行车' },
      { w: 'ride', zh: '骑' }
    ],
    pages: [
      { art: 'street|grandpa,dad|bike|·', en: 'Dad has a bike.', zh: '爸爸有一辆自行车。' },
      { art: 'street|grandpa,dad|bike|♪', en: 'The bike is big.', zh: '自行车很大。' },
      { art: 'street|grandpa,dad|bike|👀', en: 'Ming wants to ride the bike.', zh: '明明想骑自行车。' },
      { art: 'street|grandpa,dad|bike|?', en: 'Ming gets on the bike.', zh: '明明骑上车。' },
      { art: 'street|grandpa,dad|bike|·', en: 'The bike goes.', zh: '车动起来了。' },
      { art: 'street|grandpa,dad|bike|!', en: 'Ming rides and rides.', zh: '明明骑啊骑。' },
      { art: 'street|grandpa,dad|bike|♥', en: 'Ming does not fall.', zh: '明明没有摔倒。' },
      { art: 'street|grandpa,dad|bike|★', en: 'Dad runs with the bike.', zh: '爸爸跟着车跑。' },
      { art: 'street|grandpa,dad|bike|…', en: 'Ming can ride the bike!', zh: '明明会骑车了！' },
      { art: 'street|grandpa,dad|bike|·', en: 'Ride a bike.', zh: '骑自行车。' },
      { art: 'street|grandpa,dad|bike|♥', en: 'Ming likes the bike.', zh: '明明喜欢这辆自行车。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['嘴唇', '鼻子', '自行车'], a: 2, kind: 'recall' },
      { q: '谁跟着车跑？', opts: ['妈妈', '奶奶', '爸爸'], a: 2, kind: 'infer' },
      { q: '学骑车（学一样新本领），你会怎么做？', opts: ['一次就想学会', '不学了', '找人扶着，慢慢练'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b65', lv: 'L6', tag: '花园', title: 'A Rose at the Gate', zh: '门口的玫瑰',
    emoji: '🌹', color: '#E0CFF3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「挖一挖」这条线，认读 2 个新词。',
    trap: '词尾不发音的 e 会让前面的元音「报自己的名字」：cap → cape，kit → kite。',
    summary: '《门口的玫瑰》是「挖一挖」：妈妈和明明在花园，围绕玫瑰把一件事读到底。本本词卡：玫瑰、大门。读前先看词卡，读完合上书说一说。',
    retell: '按「计划 → 卡住 → 谁帮了忙 → 结果」讲一遍。（这一本是「挖一挖」。）',
    think: '说说你见过的一种花。',
    pre: [
      { art: '🌹', en: 'rose', zh: '玫瑰' },
      { art: '📍', en: 'gate', zh: '大门' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'is', zh: 'is' }
    ],
    sight: ['grows'],
    newWords: [
      { w: 'rose', zh: '玫瑰' },
      { w: 'gate', zh: '大门' }
    ],
    pages: [
      { art: 'garden|mom,ming|rose|·', en: 'A rose is at the gate.', zh: '门口有一朵玫瑰。' },
      { art: 'garden|mom,ming|rose|♪', en: 'The rose is red.', zh: '玫瑰是红色的。' },
      { art: 'garden|mom,ming|rose|👀', en: 'The rose is nice.', zh: '玫瑰很好看。' },
      { art: 'garden|mom,ming|rose|?', en: 'Ming looks at the rose.', zh: '明明看着这朵玫瑰。' },
      { art: 'garden|mom,ming|rose|·', en: 'The rose grows at the gate.', zh: '玫瑰长在门口。' },
      { art: 'garden|mom,ming|rose|!', en: 'Grandma likes the rose.', zh: '奶奶喜欢这朵玫瑰。' },
      { art: 'garden|mom,ming|rose|♥', en: 'The rose is for Grandma.', zh: '玫瑰是给奶奶的。' },
      { art: 'garden|mom,ming|rose|★', en: 'Ming gives the rose to Grandma.', zh: '明明把玫瑰送给奶奶。' },
      { art: 'garden|mom,ming|rose|…', en: 'A rose at the gate.', zh: '门口的玫瑰。' },
      { art: 'garden|mom,ming|rose|·', en: 'The rose makes Grandma glad.', zh: '玫瑰让奶奶很开心。' },
      { art: 'garden|mom,ming|rose|♥', en: 'Roses are nice.', zh: '玫瑰真好看。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['大门', '笔', '飞蛾'], a: 0, kind: 'recall' },
      { q: '玫瑰长在哪里？', opts: ['花园深处', '窗台上', '门口'], a: 2, kind: 'infer' },
      { q: '送一朵花给别人，你会怎么做？', opts: ['挑一朵好的，亲手送给他', '随便摘一朵', '不送了'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b66', lv: 'L6', tag: '发现', title: 'A Note in a Book', zh: '书里的纸条',
    emoji: '📝', color: '#F6C9E3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「分一分」这条线，认读 1 个新词。',
    trap: '词尾不发音的 e 会让前面的元音「报自己的名字」：cap → cape，kit → kite。',
    summary: '《书里的纸条》是「分一分」：爸爸和丽丽在家，围绕纸条把一件事读到底。本本词卡：纸条。读前先看词卡，读完合上书说一说。',
    retell: '按「计划 → 卡住 → 谁帮了忙 → 结果」讲一遍。（这一本是「分一分」。）',
    think: '说说你写过或收到过的一张小纸条。',
    pre: [
      { art: '📝', en: 'note', zh: '纸条' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'a', zh: 'a' }
    ],
    sight: ['writes'],
    newWords: [
      { w: 'note', zh: '纸条' }
    ],
    pages: [
      { art: 'home|dad,lili|note|·', en: 'A book is on the desk.', zh: '桌上有一本书。' },
      { art: 'home|dad,lili|note|♪', en: 'Ming opens the book.', zh: '明明打开书。' },
      { art: 'home|dad,lili|note|👀', en: 'A note is in the book!', zh: '书里有一张纸条！' },
      { art: 'home|dad,lili|note|?', en: 'The note is small.', zh: '纸条很小。' },
      { art: 'home|dad,lili|note|·', en: 'Ming reads the note.', zh: '明明读纸条。' },
      { art: 'home|dad,lili|note|!', en: 'The note says "Hello".', zh: '纸条上写着「你好」。' },
      { art: 'home|dad,lili|note|♥', en: 'Who wrote the note?', zh: '谁写的纸条？' },
      { art: 'home|dad,lili|note|★', en: 'It was Grandma.', zh: '是奶奶写的。' },
      { art: 'home|dad,lili|note|…', en: 'A note in a book.', zh: '书里的纸条。' },
      { art: 'home|dad,lili|note|·', en: 'Ming writes a note too.', zh: '明明也写了一张纸条。' },
      { art: 'home|dad,lili|note|♥', en: 'Notes are fun.', zh: '纸条真有趣。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['纸条', '水池', '平底锅'], a: 0, kind: 'recall' },
      { q: '纸条上写了什么？', opts: ['「你好」', '「谢谢」', '「再见」'], a: 0, kind: 'infer' },
      { q: '在书里发现一张纸条，你会怎么做？', opts: ['不看', '读一读，想想是谁写的', '扔掉'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b67', lv: 'L6', tag: '玩耍', title: 'Make a Game', zh: '做个游戏',
    emoji: '🎲', color: '#BFE6DF',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「比一比」这条线，认读 2 个新词。',
    trap: '词尾不发音的 e 会让前面的元音「报自己的名字」：cap → cape，kit → kite。',
    summary: '《做个游戏》是「比一比」：明明和奶奶在操场，围绕游戏把一件事读到底。本本词卡：游戏、反正。读前先看词卡，读完合上书说一说。',
    retell: '按「计划 → 卡住 → 谁帮了忙 → 结果」讲一遍。（这一本是「比一比」。）',
    think: '说说你最喜欢玩的一个游戏。',
    pre: [
      { art: '🎲', en: 'game', zh: '游戏' },
      { art: '💡', en: 'anyway', zh: '反正' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'a', zh: 'a' }
    ],
    sight: [],
    newWords: [
      { w: 'game', zh: '游戏' },
      { w: 'anyway', zh: '反正' }
    ],
    pages: [
      { art: 'playground|ming,grandma|game|·', en: 'Ming wants to make a game.', zh: '明明想做一个游戏。' },
      { art: 'playground|ming,grandma|game|♪', en: 'The game is for the family.', zh: '游戏是给全家的。' },
      { art: 'playground|ming,grandma|game|👀', en: 'Ming makes the game.', zh: '明明做起游戏。' },
      { art: 'playground|ming,grandma|game|?', en: 'The game has a name.', zh: '游戏有个名字。' },
      { art: 'playground|ming,grandma|game|·', en: 'They play the game.', zh: '他们玩这个游戏。' },
      { art: 'playground|ming,grandma|game|!', en: 'The game is fun.', zh: '游戏很好玩。' },
      { art: 'playground|ming,grandma|game|♥', en: 'Grandma wins the game.', zh: '奶奶赢了这局。' },
      { art: 'playground|ming,grandma|game|★', en: 'Ming is glad anyway.', zh: '明明还是很高兴。' },
      { art: 'playground|ming,grandma|game|…', en: 'Make a game.', zh: '做个游戏。' },
      { art: 'playground|ming,grandma|game|·', en: 'They play the game again.', zh: '他们又玩了一次。' },
      { art: 'playground|ming,grandma|game|♥', en: 'A game for the family.', zh: '给全家的游戏。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['游戏', '老鼠', '笔'], a: 0, kind: 'recall' },
      { q: '谁赢了这局游戏？', opts: ['奶奶', '明明', '爸爸'], a: 0, kind: 'infer' },
      { q: '自己做一样游戏，你会怎么做？', opts: ['只让自己赢', '想好规则，和大家一起玩', '不做了'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b68', lv: 'L6', tag: '故事', title: 'The Brave Little Mouse', zh: '勇敢的小老鼠',
    emoji: '🐭', color: '#F2E2A8',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「合上书讲一遍」这条线，认读 3 个新词。',
    trap: '词尾不发音的 e 会让前面的元音「报自己的名字」：cap → cape，kit → kite。',
    summary: '《勇敢的小老鼠》是「合上书讲一遍」：丽丽和爷爷在图书馆，围绕老鼠把一件事读到底。本本词卡：老鼠、洞、勇敢。读前先看词卡，读完合上书说一说。',
    retell: '按「计划 → 卡住 → 谁帮了忙 → 结果」讲一遍。（这一本是「合上书讲一遍」。）',
    think: '说说小老鼠是怎么躲开猫的。',
    pre: [
      { art: '🐭', en: 'mouse', zh: '老鼠' },
      { art: '🕳️', en: 'hole', zh: '洞' },
      { art: '✨', en: 'brave', zh: '勇敢' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'is', zh: 'is' }
    ],
    sight: [],
    newWords: [
      { w: 'mouse', zh: '老鼠' },
      { w: 'hole', zh: '洞' },
      { w: 'brave', zh: '勇敢' }
    ],
    pages: [
      { art: 'library|lili,grandpa|mouse|·', en: 'A little mouse is here.', zh: '这里有一只小老鼠。' },
      { art: 'library|lili,grandpa|mouse|♪', en: 'The mouse is small.', zh: '老鼠很小。' },
      { art: 'library|lili,grandpa|mouse|👀', en: 'The mouse is not afraid.', zh: '老鼠一点也不怕。' },
      { art: 'library|lili,grandpa|mouse|?', en: 'It looks for food.', zh: '它找吃的。' },
      { art: 'library|lili,grandpa|mouse|·', en: 'A cat is here too!', zh: '这里还有一只猫！' },
      { art: 'library|lili,grandpa|mouse|!', en: 'The mouse runs fast.', zh: '老鼠跑得很快。' },
      { art: 'library|lili,grandpa|mouse|♥', en: 'The mouse hides in a hole.', zh: '老鼠躲进洞里。' },
      { art: 'library|lili,grandpa|mouse|★', en: 'The cat goes away.', zh: '猫走了。' },
      { art: 'library|lili,grandpa|mouse|…', en: 'The mouse comes out.', zh: '老鼠出来了。' },
      { art: 'library|lili,grandpa|mouse|·', en: 'The brave little mouse.', zh: '勇敢的小老鼠。' },
      { art: 'library|lili,grandpa|mouse|♥', en: 'The mouse is safe.', zh: '老鼠安全了。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['绳子', '洞', '李子'], a: 1, kind: 'recall' },
      { q: '老鼠为什么躲进洞里？', opts: ['因为猫来了', '因为天黑了', '因为饿了'], a: 0, kind: 'infer' },
      { q: '遇到危险，你会怎么做？', opts: ['追上去', '站在原地', '快点躲到安全的地方，找大人帮忙'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b69', lv: 'L6', tag: '发音', title: 'Say It: Cap, Cape', zh: '说一说：cap cape',
    emoji: '🗣️', color: '#D9D2F5',
    track: 'drill',
    goal: '把本级难点音听准、说准，并能在整句里读对。这一本走「跟读整句」这条线，认读 1 个新词。',
    trap: '词尾不发音的 e 会让前面的元音「报自己的名字」：cap → cape，kit → kite。',
    summary: '《说一说：cap cape》是「跟读整句」：奶奶和妈妈在家，围绕鸭舌帽把一件事读到底。本本词卡：斗篷。读前先看词卡，读完合上书说一说。',
    retell: '按「计划 → 卡住 → 谁帮了忙 → 结果」讲一遍。（这一本是「跟读整句」。）',
    think: '找两个只差一个 e 的词，读一读、比一比。',
    pre: [
      { art: '📦', en: 'cape', zh: '斗篷' },
      { art: '🧢', en: 'cap', zh: '鸭舌帽' },
      { art: '📦', en: 'the', zh: 'the' }
    ],
    sight: [],
    newWords: [
      { w: 'cape', zh: '斗篷' }
    ],
    pages: [
      { art: 'table|grandma,mom|cap|·', en: 'This is a cap.', zh: '这是一顶帽子。' },
      { art: 'table|grandma,mom|cap|♪', en: 'This is a cape.', zh: '这是一件斗篷。' },
      { art: 'table|grandma,mom|cap|👀', en: 'Cap and cape.', zh: '帽子和斗篷。' },
      { art: 'table|grandma,mom|cap|?', en: 'The "e" makes the "a" say its name.', zh: '那个「e」让「a」读出自己的名字。' },
      { art: 'table|grandma,mom|cap|·', en: 'Say "cap".', zh: '说「帽子」。' },
      { art: 'table|grandma,mom|cap|!', en: 'Say "cape".', zh: '说「斗篷」。' },
      { art: 'table|grandma,mom|cap|♥', en: 'Cap is not cape.', zh: '帽子不是斗篷。' },
      { art: 'table|grandma,mom|cap|★', en: 'The "e" changes the sound.', zh: '那个「e」改变了声音。' },
      { art: 'table|grandma,mom|cap|…', en: 'You can say both.', zh: '两个你都会说了。' },
      { art: 'table|grandma,mom|cap|·', en: 'Cap, cape!', zh: '帽子、斗篷！' },
      { art: 'table|grandma,mom|cap|♥', en: 'Good!', zh: '真棒！' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['红色', '鸭舌帽', '绵羊'], a: 1, kind: 'recall' },
      { q: '那个「e」做了什么？', opts: ['让「a」读出自己的名字，改变了发音', '让词变短', '没做什么'], a: 0, kind: 'infer' },
      { q: '两个词只差一个 e，你会怎么分清？', opts: ['看清楚有没有 e，读准音', '不读了', '随便读一个'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b70', lv: 'L6', tag: '小知识', title: 'Why a Cake Rises', zh: '蛋糕为什么会鼓起来',
    emoji: '🧁', color: '#FAD3B6',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。这一本走「数一数」这条线，认读 2 个新词。',
    trap: '词尾不发音的 e 会让前面的元音「报自己的名字」：cap → cape，kit → kite。',
    summary: '《蛋糕为什么会鼓起来》是「数一数」：爷爷和爸爸在家，围绕蛋糕把一件事读到底。本本词卡：升起、热。读前先看词卡，读完合上书说一说。',
    retell: '按「计划 → 卡住 → 谁帮了忙 → 结果」讲一遍。（这一本是「数一数」。）',
    think: '说说你见过的一种会「鼓起来」的东西。',
    pre: [
      { art: '🏃', en: 'rise', zh: '升起' },
      { art: '🌿', en: 'heat', zh: '热' },
      { art: '🎂', en: 'cake', zh: '蛋糕' },
      { art: '📦', en: 'the', zh: 'the' }
    ],
    sight: ['bigger', 'high'],
    newWords: [
      { w: 'rise', zh: '升起' },
      { w: 'heat', zh: '热' }
    ],
    pages: [
      { art: 'kitchen|grandpa,dad|cake|·', en: 'Ming makes a cake.', zh: '明明做了个蛋糕。' },
      { art: 'kitchen|grandpa,dad|cake|♪', en: 'The cake goes in the hot place.', zh: '蛋糕放进热的地方。' },
      { art: 'kitchen|grandpa,dad|cake|👀', en: 'Why does a cake rise?', zh: '蛋糕为什么会鼓起来？' },
      { art: 'kitchen|grandpa,dad|cake|?', en: 'The heat makes it rise.', zh: '热让它鼓起来。' },
      { art: 'kitchen|grandpa,dad|cake|·', en: 'The cake gets bigger.', zh: '蛋糕变大了。' },
      { art: 'kitchen|grandpa,dad|cake|!', en: 'The cake is high now.', zh: '蛋糕高起来了。' },
      { art: 'kitchen|grandpa,dad|cake|♥', en: 'Ming looks at the cake.', zh: '明明看着蛋糕。' },
      { art: 'kitchen|grandpa,dad|cake|★', en: 'The cake is good.', zh: '蛋糕很好。' },
      { art: 'kitchen|grandpa,dad|cake|…', en: 'A cake rises with heat.', zh: '蛋糕遇热会鼓起来。' },
      { art: 'kitchen|grandpa,dad|cake|·', en: 'Why a cake rises.', zh: '蛋糕为什么鼓起来。' },
      { art: 'kitchen|grandpa,dad|cake|♥', en: 'Ming likes the cake.', zh: '明明喜欢这个蛋糕。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['热', '米饭', '贝壳'], a: 0, kind: 'recall' },
      { q: '蛋糕为什么鼓起来？', opts: ['因为加了水', '因为热让它膨胀', '因为放凉了'], a: 1, kind: 'infer' },
      { q: '想知道一件事为什么发生，你会怎么做？', opts: ['瞎猜', '不管它', '想一想、查一查、试一试'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b71', lv: 'L6', tag: '小知识', title: 'A Hole in the Rope', zh: '绳子上的洞',
    emoji: '🪢', color: '#C8E7F0',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。这一本走「合上书讲一遍」这条线，认读 1 个新词。',
    trap: '词尾不发音的 e 会让前面的元音「报自己的名字」：cap → cape，kit → kite。',
    summary: '《绳子上的洞》是「合上书讲一遍」：妈妈和明明在家，围绕洞把一件事读到底。本本词卡：绳子。读前先看词卡，读完合上书说一说。',
    retell: '按「计划 → 卡住 → 谁帮了忙 → 结果」讲一遍。（这一本是「合上书讲一遍」。）',
    think: '说说你修过或看过别人修的一样东西。',
    pre: [
      { art: '🪢', en: 'rope', zh: '绳子' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'is', zh: 'is' }
    ],
    sight: [],
    newWords: [
      { w: 'rope', zh: '绳子' }
    ],
    pages: [
      { art: 'home|mom,ming|hole|·', en: 'A rope is here.', zh: '这里有一根绳子。' },
      { art: 'home|mom,ming|hole|♪', en: 'The rope is long.', zh: '绳子很长。' },
      { art: 'home|mom,ming|hole|👀', en: 'There is a hole in the rope.', zh: '绳子上有一个洞。' },
      { art: 'home|mom,ming|hole|?', en: 'The hole is small.', zh: '洞很小。' },
      { art: 'home|mom,ming|hole|·', en: 'Ming looks at the hole.', zh: '明明看着那个洞。' },
      { art: 'home|mom,ming|hole|!', en: 'The rope is not strong now.', zh: '绳子不结实了。' },
      { art: 'home|mom,ming|hole|♥', en: 'Ming fixes the hole.', zh: '明明把洞补好。' },
      { art: 'home|mom,ming|hole|★', en: 'The rope is strong again.', zh: '绳子又结实了。' },
      { art: 'home|mom,ming|hole|…', en: 'A hole in the rope.', zh: '绳子上的洞。' },
      { art: 'home|mom,ming|hole|·', en: 'Ming is careful with the rope.', zh: '明明小心地用绳子。' },
      { art: 'home|mom,ming|hole|♥', en: 'A good rope is strong.', zh: '好绳子很结实。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['绳子', '种子', '勺子'], a: 0, kind: 'recall' },
      { q: '绳子怎么了？', opts: ['太长了', '太短了', '上面有个洞，不结实了'], a: 2, kind: 'infer' },
      { q: '东西坏了，你会怎么做？', opts: ['看看能不能修好，修不好再想别的办法', '不管它', '直接扔掉'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b72', lv: 'L6', tag: '复习', title: 'The Same Plate', zh: '同一个盘子',
    emoji: '🍽️', color: '#E8D9B5',
    track: 'review',
    goal: '把本级和前面级别的词再读一遍、串成一个故事。这一本走「猜一猜」这条线，不引入新词，全部是读过的词。',
    trap: '词尾不发音的 e 会让前面的元音「报自己的名字」：cap → cape，kit → kite。',
    summary: '《同一个盘子》是「猜一猜」：爸爸和丽丽在图书馆，围绕盘子把一件事读到底。本本词卡：这一本不引入新词，全部是读过的词。读前先看词卡，读完合上书说一说。',
    retell: '按「计划 → 卡住 → 谁帮了忙 → 结果」讲一遍。（这一本是「猜一猜」。）',
    think: '说说两样很像、但有大小差别的东西。',
    pre: [
      { art: '📦', en: 'the', zh: 'the' },
      { art: '🔢', en: 'one', zh: '一' }
    ],
    sight: [],
    newWords: [

    ],
    pages: [
      { art: 'library|dad,lili|plate|·', en: 'Two plates are on the table.', zh: '桌上有两个盘子。' },
      { art: 'library|dad,lili|plate|♪', en: 'One plate is big.', zh: '一个盘子很大。' },
      { art: 'library|dad,lili|plate|👀', en: 'One plate is small.', zh: '一个盘子很小。' },
      { art: 'library|dad,lili|plate|?', en: 'They are not the same.', zh: '它们不一样。' },
      { art: 'library|dad,lili|plate|·', en: 'But they are both plates.', zh: '但它们都是盘子。' },
      { art: 'library|dad,lili|plate|!', en: 'Ming looks at the two plates.', zh: '明明看着两个盘子。' },
      { art: 'library|dad,lili|plate|♥', en: 'One big, one small.', zh: '一大一小。' },
      { art: 'library|dad,lili|plate|★', en: 'Ming uses the big plate.', zh: '明明用大盘子。' },
      { art: 'library|dad,lili|plate|…', en: 'Grandma uses the small one.', zh: '奶奶用小盘子。' },
      { art: 'library|dad,lili|plate|·', en: 'The same plate.', zh: '同一个盘子。' },
      { art: 'library|dad,lili|plate|♥', en: 'Big and small, both are plates.', zh: '大的小的，都是盘子。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['歌', '盘子', '树'], a: 1, kind: 'recall' },
      { q: '两个盘子哪里不一样？', opts: ['一个有一个没有', '颜色不一样', '大小不一样'], a: 2, kind: 'infer' },
      { q: '两样东西很像但有差别，你会怎么做？', opts: ['不管它', '只看一个', '看一看哪里不一样，再说一说'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b73', lv: 'L7', tag: '通信', title: 'The Letter from the Farm', zh: '农场来的信',
    emoji: '✉️', color: '#F6C6C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「找回来」这条线，不引入新词，全部是读过的词。',
    trap: '美音里元音后的 r 一定要卷舌读出来：car、bird、water 都不能吞掉 r。',
    summary: '《农场来的信》是「找回来」：明明和奶奶在家，围绕信把一件事读到底。本本词卡：这一本不引入新词，全部是读过的词。读前先看词卡，读完合上书说一说。',
    retell: '倒着讲：先说结局，再说线索是怎么被漏掉的。（这一本是「找回来」。）',
    think: '说说你写过或收到过的一封信。',
    pre: [
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👦', en: 'ming', zh: '明明' }
    ],
    sight: ['writes'],
    newWords: [

    ],
    pages: [
      { art: 'home|ming,grandma|letter|·', en: 'Grandma is on the farm.', zh: '奶奶在农场。' },
      { art: 'home|ming,grandma|letter|♪', en: 'Grandma writes a letter.', zh: '奶奶写了一封信。' },
      { art: 'home|ming,grandma|letter|👀', en: 'The letter is for Ming.', zh: '信是写给明明的。' },
      { art: 'home|ming,grandma|letter|?', en: 'The letter comes to Ming.', zh: '信寄到了明明这儿。' },
      { art: 'home|ming,grandma|letter|·', en: 'Ming reads the letter.', zh: '明明读信。' },
      { art: 'home|ming,grandma|letter|!', en: 'The letter says the farm is good.', zh: '信上说农场很好。' },
      { art: 'home|ming,grandma|letter|♥', en: 'The letter says the goat is big now.', zh: '信上说山羊长大了。' },
      { art: 'home|ming,grandma|letter|★', en: 'Ming writes back to Grandma.', zh: '明明给奶奶写了回信。' },
      { art: 'home|ming,grandma|letter|…', en: 'Ming says he is happy.', zh: '明明说自己很好。' },
      { art: 'home|ming,grandma|letter|·', en: 'A letter from the farm.', zh: '农场来的信。' },
      { art: 'home|ming,grandma|letter|♥', en: 'Letters carry good words.', zh: '信里带着好话。' },
      { art: 'home|ming,grandma|letter|·', en: 'Ming wants to go to the farm.', zh: '明明想去农场。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['市场', '一', '农场'], a: 2, kind: 'recall' },
      { q: '谁给明明写了信？', opts: ['爸爸', '奶奶', '妈妈'], a: 1, kind: 'infer' },
      { q: '想给远方的人说句话，你会怎么做？', opts: ['写一封信或一句话给他', '只在心里想', '什么也不说'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b74', lv: 'L7', tag: '冬天', title: 'A Scarf for Winter', zh: '冬天的围巾',
    emoji: '🧣', color: '#F9DFB4',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「分一分」这条线，认读 2 个新词。',
    trap: '美音里元音后的 r 一定要卷舌读出来：car、bird、water 都不能吞掉 r。',
    summary: '《冬天的围巾》是「分一分」：丽丽和爷爷在家，围绕围巾把一件事读到底。本本词卡：冬天、围巾。读前先看词卡，读完合上书说一说。',
    retell: '倒着讲：先说结局，再说线索是怎么被漏掉的。（这一本是「分一分」。）',
    think: '说说一件冬天让你暖和的东西。',
    pre: [
      { art: '⏰', en: 'winter', zh: '冬天' },
      { art: '🧣', en: 'scarf', zh: '围巾' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'is', zh: 'is' }
    ],
    sight: ['wears'],
    newWords: [
      { w: 'winter', zh: '冬天' },
      { w: 'scarf', zh: '围巾' }
    ],
    pages: [
      { art: 'home|lili,grandpa|scarf|·', en: 'Winter is here.', zh: '冬天来了。' },
      { art: 'home|lili,grandpa|scarf|♪', en: 'The wind is cold.', zh: '风很冷。' },
      { art: 'home|lili,grandpa|scarf|👀', en: 'Mom makes a scarf.', zh: '妈妈织了一条围巾。' },
      { art: 'home|lili,grandpa|scarf|?', en: 'The scarf is long.', zh: '围巾很长。' },
      { art: 'home|lili,grandpa|scarf|·', en: 'Mom gives the scarf to Ming.', zh: '妈妈把围巾给明明。' },
      { art: 'home|lili,grandpa|scarf|!', en: 'Ming wears the scarf.', zh: '明明围上围巾。' },
      { art: 'home|lili,grandpa|scarf|♥', en: 'Ming is warm now.', zh: '明明现在暖和了。' },
      { art: 'home|lili,grandpa|scarf|★', en: 'The wind is still cold.', zh: '风还是很冷。' },
      { art: 'home|lili,grandpa|scarf|…', en: 'But Ming is warm with the scarf.', zh: '可明明围着围巾很暖和。' },
      { art: 'home|lili,grandpa|scarf|·', en: 'A scarf for winter.', zh: '冬天的围巾。' },
      { art: 'home|lili,grandpa|scarf|♥', en: 'Ming likes the scarf.', zh: '明明喜欢这条围巾。' },
      { art: 'home|lili,grandpa|scarf|·', en: 'The scarf is from Mom.', zh: '围巾是妈妈织的。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['牛奶', '纸', '围巾'], a: 2, kind: 'recall' },
      { q: '围巾是谁做的？', opts: ['妈妈', '明明', '奶奶'], a: 0, kind: 'infer' },
      { q: '天冷的时候，你会怎么做？', opts: ['不管它', '戴上围巾帽子，穿得暖和', '不出门'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b75', lv: 'L7', tag: '观察', title: 'Morning in the Garden', zh: '清晨的花园',
    emoji: '🌻', color: '#CDE7C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「挖一挖」这条线，认读 1 个新词。',
    trap: '美音里元音后的 r 一定要卷舌读出来：car、bird、water 都不能吞掉 r。',
    summary: '《清晨的花园》是「挖一挖」：奶奶和妈妈在花园，围绕花园把一件事读到底。本本词卡：花园。读前先看词卡，读完合上书说一说。',
    retell: '倒着讲：先说结局，再说线索是怎么被漏掉的。（这一本是「挖一挖」。）',
    think: '说说清晨的花园里有什么。',
    pre: [
      { art: '🌻', en: 'garden', zh: '花园' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'is', zh: 'is' }
    ],
    sight: ['leaf'],
    newWords: [
      { w: 'garden', zh: '花园' }
    ],
    pages: [
      { art: 'garden|grandma,mom|garden|·', en: 'Morning is here.', zh: '清晨来了。' },
      { art: 'garden|grandma,mom|garden|♪', en: 'Ming goes to the garden.', zh: '明明去花园。' },
      { art: 'garden|grandma,mom|garden|👀', en: 'The garden is wet.', zh: '花园湿湿的。' },
      { art: 'garden|grandma,mom|garden|?', en: 'The grass is green.', zh: '草是绿的。' },
      { art: 'garden|grandma,mom|garden|·', en: 'A bug is on a leaf.', zh: '叶子上有一只虫。' },
      { art: 'garden|grandma,mom|garden|!', en: 'Ming looks at the bug.', zh: '明明看着虫。' },
      { art: 'garden|grandma,mom|garden|♥', en: 'The sun comes up.', zh: '太阳升起来了。' },
      { art: 'garden|grandma,mom|garden|★', en: 'The garden is nice now.', zh: '花园现在很好看。' },
      { art: 'garden|grandma,mom|garden|…', en: 'Morning in the garden.', zh: '清晨的花园。' },
      { art: 'garden|grandma,mom|garden|·', en: 'Ming likes the morning.', zh: '明明喜欢清晨。' },
      { art: 'garden|grandma,mom|garden|♥', en: 'The garden is a good place.', zh: '花园是个好地方。' },
      { art: 'garden|grandma,mom|garden|·', en: 'Ming will come back tomorrow.', zh: '明明明天还会来。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['比赛', '人', '绿色'], a: 2, kind: 'recall' },
      { q: '花园里有什么？', opts: ['书和笔', '车和船', '草、虫、花'], a: 2, kind: 'infer' },
      { q: '早晨在户外，你会怎么做？', opts: ['只看屏幕', '看看花草小虫，感受清晨', '一直睡觉'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b76', lv: 'L7', tag: '故事', title: 'The Turtle and the Shark', zh: '乌龟和鲨鱼',
    emoji: '🐢', color: '#C6DEF6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「水涨了」这条线，认读 2 个新词。',
    trap: '美音里元音后的 r 一定要卷舌读出来：car、bird、water 都不能吞掉 r。',
    summary: '《乌龟和鲨鱼》是「水涨了」：爷爷和爸爸在沙滩，围绕乌龟把一件事读到底。本本词卡：乌龟、鲨鱼。读前先看词卡，读完合上书说一说。',
    retell: '倒着讲：先说结局，再说线索是怎么被漏掉的。（这一本是「水涨了」。）',
    think: '说说海龟和鲨鱼哪里不一样。',
    pre: [
      { art: '🐢', en: 'turtle', zh: '乌龟' },
      { art: '🦈', en: 'shark', zh: '鲨鱼' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'is', zh: 'is' }
    ],
    sight: ['sea'],
    newWords: [
      { w: 'turtle', zh: '乌龟' },
      { w: 'shark', zh: '鲨鱼' }
    ],
    pages: [
      { art: 'beach|grandpa,dad|turtle|·', en: 'A turtle is in the sea.', zh: '一只海龟在海里。' },
      { art: 'beach|grandpa,dad|turtle|♪', en: 'The turtle swims slowly.', zh: '海龟游得很慢。' },
      { art: 'beach|grandpa,dad|turtle|👀', en: 'A shark is in the sea too.', zh: '海里还有一条鲨鱼。' },
      { art: 'beach|grandpa,dad|turtle|?', en: 'The shark swims fast.', zh: '鲨鱼游得很快。' },
      { art: 'beach|grandpa,dad|turtle|·', en: 'The shark is big.', zh: '鲨鱼很大。' },
      { art: 'beach|grandpa,dad|turtle|!', en: 'The turtle is not fast.', zh: '海龟不快。' },
      { art: 'beach|grandpa,dad|turtle|♥', en: 'But the turtle is not afraid.', zh: '可海龟不怕。' },
      { art: 'beach|grandpa,dad|turtle|★', en: 'The turtle goes down.', zh: '海龟往下沉。' },
      { art: 'beach|grandpa,dad|turtle|…', en: 'The shark swims away.', zh: '鲨鱼游走了。' },
      { art: 'beach|grandpa,dad|turtle|·', en: 'The turtle is safe.', zh: '海龟安全了。' },
      { art: 'beach|grandpa,dad|turtle|♥', en: 'The turtle and the shark.', zh: '海龟和鲨鱼。' },
      { art: 'beach|grandpa,dad|turtle|·', en: 'Slow can be good.', zh: '慢也有慢的好。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['纸', '水池', '乌龟'], a: 2, kind: 'recall' },
      { q: '海龟是怎么躲开鲨鱼的？', opts: ['咬鲨鱼', '游得更快', '沉下去躲起来'], a: 2, kind: 'infer' },
      { q: '遇到比你强、有危险的，你会怎么做？', opts: ['冷静，想办法躲开或求助', '站在原地哭', '硬拼'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b77', lv: 'L7', tag: '上学', title: 'A Picture for the Teacher', zh: '给老师的画',
    emoji: '🖼️', color: '#E0CFF3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「写一写」这条线，认读 2 个新词。',
    trap: '美音里元音后的 r 一定要卷舌读出来：car、bird、water 都不能吞掉 r。',
    summary: '《给老师的画》是「写一写」：妈妈和明明在学校，围绕图画把一件事读到底。本本词卡：画、图画。读前先看词卡，读完合上书说一说。',
    retell: '倒着讲：先说结局，再说线索是怎么被漏掉的。（这一本是「写一写」。）',
    think: '说说你画过送人的一幅画。',
    pre: [
      { art: '🏃', en: 'draw', zh: '画' },
      { art: '🖼️', en: 'picture', zh: '图画' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👦', en: 'ming', zh: '明明' }
    ],
    sight: ['draws'],
    newWords: [
      { w: 'draw', zh: '画' },
      { w: 'picture', zh: '图画' }
    ],
    pages: [
      { art: 'school|mom,ming|picture|·', en: 'Ming draws a picture.', zh: '明明画了一幅画。' },
      { art: 'school|mom,ming|picture|♪', en: 'The picture is for the teacher.', zh: '画是给老师的。' },
      { art: 'school|mom,ming|picture|👀', en: 'Ming draws the garden.', zh: '明明画了花园。' },
      { art: 'school|mom,ming|picture|?', en: 'Ming draws the sun too.', zh: '明明也画了太阳。' },
      { art: 'school|mom,ming|picture|·', en: 'The picture is nice.', zh: '画很好看。' },
      { art: 'school|mom,ming|picture|!', en: 'Ming gives the picture to the teacher.', zh: '明明把画给老师。' },
      { art: 'school|mom,ming|picture|♥', en: 'The teacher likes the picture.', zh: '老师喜欢这幅画。' },
      { art: 'school|mom,ming|picture|★', en: 'The teacher puts it on the wall.', zh: '老师把它贴在墙上。' },
      { art: 'school|mom,ming|picture|…', en: 'A picture for the teacher.', zh: '给老师的画。' },
      { art: 'school|mom,ming|picture|·', en: 'Ming is proud.', zh: '明明很自豪。' },
      { art: 'school|mom,ming|picture|♥', en: 'Pictures can say things.', zh: '画能表达心意。' },
      { art: 'school|mom,ming|picture|·', en: 'Ming draws more pictures.', zh: '明明画了更多的画。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['猪肉', '玫瑰', '花园'], a: 2, kind: 'recall' },
      { q: '明明画了什么？', opts: ['花园和太阳', '车和船', '书和笔'], a: 0, kind: 'infer' },
      { q: '想送老师或长辈一样东西，你会怎么做？', opts: ['自己动手做，表达心意', '随便买一个', '不送'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b78', lv: 'L7', tag: '买菜', title: 'The Market at the Corner', zh: '街角的市场',
    emoji: '🥬', color: '#F6C9E3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「帮忙买」这条线，认读 1 个新词。',
    trap: '美音里元音后的 r 一定要卷舌读出来：car、bird、water 都不能吞掉 r。',
    summary: '《街角的市场》是「帮忙买」：爸爸和丽丽在街道，围绕市场把一件事读到底。本本词卡：市场。读前先看词卡，读完合上书说一说。',
    retell: '倒着讲：先说结局，再说线索是怎么被漏掉的。（这一本是「帮忙买」。）',
    think: '说说你去过的一个市场。',
    pre: [
      { art: '🥬', en: 'market', zh: '市场' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'is', zh: 'is' }
    ],
    sight: [],
    newWords: [
      { w: 'market', zh: '市场' }
    ],
    pages: [
      { art: 'street|dad,lili|market|·', en: 'A market is at the corner.', zh: '街角有一个市场。' },
      { art: 'street|dad,lili|market|♪', en: 'The market has many things.', zh: '市场里有很多东西。' },
      { art: 'street|dad,lili|market|👀', en: 'Ming and Mom go to the market.', zh: '明明和妈妈去市场。' },
      { art: 'street|dad,lili|market|?', en: 'They see apples and rice.', zh: '他们看到苹果和米饭。' },
      { art: 'street|dad,lili|market|·', en: 'Mom buys rice.', zh: '妈妈买了米。' },
      { art: 'street|dad,lili|market|!', en: 'Ming buys an apple.', zh: '明明买了苹果。' },
      { art: 'street|dad,lili|market|♥', en: 'The market is big.', zh: '市场很大。' },
      { art: 'street|dad,lili|market|★', en: 'They carry the things home.', zh: '他们把东西带回家。' },
      { art: 'street|dad,lili|market|…', en: 'The market at the corner.', zh: '街角的市场。' },
      { art: 'street|dad,lili|market|·', en: 'Ming likes the market.', zh: '明明喜欢这个市场。' },
      { art: 'street|dad,lili|market|♥', en: 'They will come back.', zh: '他们还会再来。' },
      { art: 'street|dad,lili|market|·', en: 'The market is good.', zh: '市场真好。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['绳子', '角落', '小店'], a: 1, kind: 'recall' },
      { q: '妈妈买了什么？', opts: ['米', '苹果', '鱼'], a: 0, kind: 'infer' },
      { q: '去市场买东西，你会怎么做？', opts: ['不看就走', '乱拿一通', '想好买什么，一样一样看'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b79', lv: 'L7', tag: '种植', title: 'Corn in the Garden', zh: '花园里的玉米',
    emoji: '🌽', color: '#BFE6DF',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「收一收」这条线，不引入新词，全部是读过的词。',
    trap: '美音里元音后的 r 一定要卷舌读出来：car、bird、water 都不能吞掉 r。',
    summary: '《花园里的玉米》是「收一收」：明明和奶奶在农场，围绕玉米把一件事读到底。本本词卡：这一本不引入新词，全部是读过的词。读前先看词卡，读完合上书说一说。',
    retell: '倒着讲：先说结局，再说线索是怎么被漏掉的。（这一本是「收一收」。）',
    think: '说说一种长在花园里的吃的。',
    pre: [
      { art: '🌽', en: 'corn', zh: '玉米' },
      { art: '📦', en: 'the', zh: 'the' }
    ],
    sight: ['grows'],
    newWords: [

    ],
    pages: [
      { art: 'farm|ming,grandma|corn|·', en: 'Corn is in the garden.', zh: '花园里有玉米。' },
      { art: 'farm|ming,grandma|corn|♪', en: 'The corn is tall.', zh: '玉米很高。' },
      { art: 'farm|ming,grandma|corn|👀', en: 'The corn grows and grows.', zh: '玉米长啊长。' },
      { art: 'farm|ming,grandma|corn|?', en: 'Ming looks at the corn.', zh: '明明看着玉米。' },
      { art: 'farm|ming,grandma|corn|·', en: 'The corn is not ready.', zh: '玉米还没熟。' },
      { art: 'farm|ming,grandma|corn|!', en: 'Ming waits.', zh: '明明等。' },
      { art: 'farm|ming,grandma|corn|♥', en: 'The corn is ready now!', zh: '玉米现在熟了！' },
      { art: 'farm|ming,grandma|corn|★', en: 'Ming picks the corn.', zh: '明明摘玉米。' },
      { art: 'farm|ming,grandma|corn|…', en: 'Corn in the garden.', zh: '花园里的玉米。' },
      { art: 'farm|ming,grandma|corn|·', en: 'The corn is good.', zh: '玉米很好。' },
      { art: 'farm|ming,grandma|corn|♥', en: 'Ming likes corn.', zh: '明明喜欢玉米。' },
      { art: 'farm|ming,grandma|corn|·', en: 'Ming will plant more corn.', zh: '明明还要种更多玉米。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['小棚', '玉米', '米饭'], a: 1, kind: 'recall' },
      { q: '玉米什么时候熟的？', opts: ['一直没熟', '等了一阵子以后', '马上就熟了'], a: 1, kind: 'infer' },
      { q: '想让植物长大，你会怎么做？', opts: ['不管它', '浇水、耐心等，不急着拔', '每天拔出来看'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b80', lv: 'L7', tag: '寻找', title: 'Search the Park', zh: '找遍公园',
    emoji: '🔍', color: '#F2E2A8',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「合上书讲一遍」这条线，认读 1 个新词。',
    trap: '美音里元音后的 r 一定要卷舌读出来：car、bird、water 都不能吞掉 r。',
    summary: '《找遍公园》是「合上书讲一遍」：丽丽和爷爷在图书馆，围绕公园把一件事读到底。本本词卡：寻找。读前先看词卡，读完合上书说一说。',
    retell: '倒着讲：先说结局，再说线索是怎么被漏掉的。（这一本是「合上书讲一遍」。）',
    think: '说说你找东西的一次经历。',
    pre: [
      { art: '🏃', en: 'search', zh: '寻找' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👦', en: 'ming', zh: '明明' }
    ],
    sight: [],
    newWords: [
      { w: 'search', zh: '寻找' }
    ],
    pages: [
      { art: 'library|lili,grandpa|park|·', en: 'Ming goes to the park.', zh: '明明去公园。' },
      { art: 'library|lili,grandpa|park|♪', en: 'Ming looks for a ball.', zh: '明明找一个球。' },
      { art: 'library|lili,grandpa|park|👀', en: 'The ball is not here.', zh: '球不在这里。' },
      { art: 'library|lili,grandpa|park|?', en: 'Ming looks all over the park.', zh: '明明找遍公园。' },
      { art: 'library|lili,grandpa|park|·', en: 'Ming looks under a tree.', zh: '明明看看树下。' },
      { art: 'library|lili,grandpa|park|!', en: 'Ming looks by a stone.', zh: '明明看看石头边。' },
      { art: 'library|lili,grandpa|park|♥', en: 'Ming does not find the ball.', zh: '明明没找到球。' },
      { art: 'library|lili,grandpa|park|★', en: 'Ming asks for help.', zh: '明明求助。' },
      { art: 'library|lili,grandpa|park|…', en: 'Someone saw the ball.', zh: '有人看到了球。' },
      { art: 'library|lili,grandpa|park|·', en: 'The ball is by the gate!', zh: '球在门边！' },
      { art: 'library|lili,grandpa|park|♥', en: 'Search the park.', zh: '找遍公园。' },
      { art: 'library|lili,grandpa|park|·', en: 'Ming is glad to find the ball.', zh: '明明找到球，很高兴。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['绵羊', '大门', '歌'], a: 1, kind: 'recall' },
      { q: '球最后在哪里？', opts: ['门边', '水里', '树下'], a: 0, kind: 'infer' },
      { q: '找东西找遍了还没找到，你会怎么做？', opts: ['问一问别人，或换个地方想', '不要了', '一直乱找'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b81', lv: 'L7', tag: '发音', title: 'Say It: Car, Bird', zh: '说一说：car bird',
    emoji: '🗣️', color: '#D9D2F5',
    track: 'drill',
    goal: '把本级难点音听准、说准，并能在整句里读对。这一本走「跟读整句」这条线，认读 1 个新词。',
    trap: '美音里元音后的 r 一定要卷舌读出来：car、bird、water 都不能吞掉 r。',
    summary: '《说一说：car bird》是「跟读整句」：奶奶和妈妈在家，围绕小汽车把一件事读到底。本本词卡：小汽车。读前先看词卡，读完合上书说一说。',
    retell: '倒着讲：先说结局，再说线索是怎么被漏掉的。（这一本是「跟读整句」。）',
    think: '找两个带 r 的词，读一读。',
    pre: [
      { art: '📦', en: 'car', zh: '小汽车' },
      { art: '🐦', en: 'bird', zh: '鸟' },
      { art: '🏃', en: 'say', zh: '说' }
    ],
    sight: [],
    newWords: [
      { w: 'car', zh: '小汽车' }
    ],
    pages: [
      { art: 'table|grandma,mom|car|·', en: 'This is a car.', zh: '这是一辆车。' },
      { art: 'table|grandma,mom|car|♪', en: 'This is a bird.', zh: '这是一只鸟。' },
      { art: 'table|grandma,mom|car|👀', en: 'Car and bird.', zh: '车和鸟。' },
      { art: 'table|grandma,mom|car|?', en: 'Both have an "r" sound.', zh: '两个词都有「r」的音。' },
      { art: 'table|grandma,mom|car|·', en: 'Say "car".', zh: '说「车」。' },
      { art: 'table|grandma,mom|car|!', en: 'Say "bird".', zh: '说「鸟」。' },
      { art: 'table|grandma,mom|car|♥', en: 'Say the "r" well.', zh: '把「r」读准。' },
      { art: 'table|grandma,mom|car|★', en: 'Car is not bird.', zh: '车不是鸟。' },
      { art: 'table|grandma,mom|car|…', en: 'You can say both.', zh: '两个你都会说了。' },
      { art: 'table|grandma,mom|car|·', en: 'Car, bird, car, bird.', zh: '车、鸟、车、鸟。' },
      { art: 'table|grandma,mom|car|♥', en: 'Good!', zh: '真棒！' },
      { art: 'table|grandma,mom|car|·', en: 'Now say them fast.', zh: '现在快快地说一遍。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['小汽车', '绵羊', '歌'], a: 0, kind: 'recall' },
      { q: '这一本在练哪个音？', opts: ['「s」的音', '「t」的音', '「r」的音'], a: 2, kind: 'infer' },
      { q: '单词里有 r，你会怎么读？', opts: ['把 r 读得清楚有力', '跳过去', '把 r 念没了'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b82', lv: 'L7', tag: '小知识', title: 'Why Winter Is Cold', zh: '冬天为什么冷',
    emoji: '☃️', color: '#FAD3B6',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。这一本走「数一数」这条线，不引入新词，全部是读过的词。',
    trap: '美音里元音后的 r 一定要卷舌读出来：car、bird、water 都不能吞掉 r。',
    summary: '《冬天为什么冷》是「数一数」：爷爷和爸爸在家，围绕信把一件事读到底。本本词卡：这一本不引入新词，全部是读过的词。读前先看词卡，读完合上书说一说。',
    retell: '倒着讲：先说结局，再说线索是怎么被漏掉的。（这一本是「数一数」。）',
    think: '说说冬天和夏天有什么不一样。',
    pre: [
      { art: '📦', en: 'is', zh: 'is' },
      { art: '⏰', en: 'winter', zh: '冬天' }
    ],
    sight: ['high', 'wear'],
    newWords: [

    ],
    pages: [
      { art: 'night|grandpa,dad|winter|·', en: 'Winter is here.', zh: '冬天来了。' },
      { art: 'night|grandpa,dad|winter|♪', en: 'Why is winter cold?', zh: '为什么冬天冷？' },
      { art: 'night|grandpa,dad|winter|👀', en: 'The sun is not high.', zh: '太阳不高。' },
      { art: 'night|grandpa,dad|winter|?', en: 'The days are not long.', zh: '白天不长。' },
      { art: 'night|grandpa,dad|winter|·', en: 'The sun is not hot.', zh: '太阳不热。' },
      { art: 'night|grandpa,dad|winter|!', en: 'So winter is cold.', zh: '所以冬天冷。' },
      { art: 'night|grandpa,dad|winter|♥', en: 'The wind is cold too.', zh: '风也很冷。' },
      { art: 'night|grandpa,dad|winter|★', en: 'We wear coats.', zh: '我们穿上外套。' },
      { art: 'night|grandpa,dad|winter|…', en: 'Winter is cold, but we are warm.', zh: '冬天冷，可我们暖和。' },
      { art: 'night|grandpa,dad|winter|·', en: 'Why winter is cold.', zh: '冬天为什么冷。' },
      { art: 'night|grandpa,dad|winter|♥', en: 'Winter will go.', zh: '冬天会过去的。' },
      { art: 'night|grandpa,dad|winter|·', en: 'Warm days will come.', zh: '暖和的日子会来的。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['风', '轮船', '星星'], a: 0, kind: 'recall' },
      { q: '冬天为什么冷？', opts: ['太阳不高不热，白天也短', '因为下雪', '因为风大'], a: 0, kind: 'infer' },
      { q: '想知道自然现象为什么发生，你会怎么做？', opts: ['观察、想一想、查一查', '随便猜', '不管它'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b83', lv: 'L7', tag: '小知识', title: 'How a Farmer Works', zh: '农民怎么干活',
    emoji: '👨‍🌾', color: '#C8E7F0',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。这一本走「合上书讲一遍」这条线，不引入新词，全部是读过的词。',
    trap: '美音里元音后的 r 一定要卷舌读出来：car、bird、water 都不能吞掉 r。',
    summary: '《农民怎么干活》是「合上书讲一遍」：妈妈和明明在农场，围绕农民把一件事读到底。本本词卡：这一本不引入新词，全部是读过的词。读前先看词卡，读完合上书说一说。',
    retell: '倒着讲：先说结局，再说线索是怎么被漏掉的。（这一本是「合上书讲一遍」。）',
    think: '说说农民一天都做些什么。',
    pre: [
      { art: '📦', en: 'the', zh: 'the' },
      { art: '🚜', en: 'farm', zh: '农场' }
    ],
    sight: ['grows', 'tired'],
    newWords: [

    ],
    pages: [
      { art: 'farm|mom,ming|farmer|·', en: 'A farmer works on the farm.', zh: '农民在农场干活。' },
      { art: 'farm|mom,ming|farmer|♪', en: 'The farmer gets up early.', zh: '农民起得很早。' },
      { art: 'farm|mom,ming|farmer|👀', en: 'The farmer feeds the animals.', zh: '农民喂动物。' },
      { art: 'farm|mom,ming|farmer|?', en: 'The farmer grows corn.', zh: '农民种玉米。' },
      { art: 'farm|mom,ming|farmer|·', en: 'The farmer works all day.', zh: '农民干一整天的活。' },
      { art: 'farm|mom,ming|farmer|!', en: 'The farmer is tired.', zh: '农民累了。' },
      { art: 'farm|mom,ming|farmer|♥', en: 'But the farm is good.', zh: '可农场很好。' },
      { art: 'farm|mom,ming|farmer|★', en: 'How a farmer works.', zh: '农民怎么干活。' },
      { art: 'farm|mom,ming|farmer|…', en: 'The farmer likes the farm.', zh: '农民喜欢农场。' },
      { art: 'farm|mom,ming|farmer|·', en: 'The farmer is careful.', zh: '农民很细心。' },
      { art: 'farm|mom,ming|farmer|♥', en: 'The farm helps many people.', zh: '农场养活很多人。' },
      { art: 'farm|mom,ming|farmer|·', en: 'We thank the farmer.', zh: '我们感谢农民。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['勺子', '农场', '树'], a: 1, kind: 'recall' },
      { q: '农民每天都做什么？', opts: ['坐车、玩', '喂动物、种玉米、干农活', '写作业、看书'], a: 1, kind: 'infer' },
      { q: '看到别人辛勤劳动，你会怎么做？', opts: ['珍惜成果，说声谢谢', '不管', '浪费'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b84', lv: 'L7', tag: '复习', title: 'Back to the First Place', zh: '回到最开始',
    emoji: '🏠', color: '#E8D9B5',
    track: 'review',
    goal: '把本级和前面级别的词再读一遍、串成一个故事。这一本走「猜一猜」这条线，不引入新词，全部是读过的词。',
    trap: '美音里元音后的 r 一定要卷舌读出来：car、bird、water 都不能吞掉 r。',
    summary: '《回到最开始》是「猜一猜」：爸爸和丽丽在图书馆，围绕角落把一件事读到底。本本词卡：这一本不引入新词，全部是读过的词。读前先看词卡，读完合上书说一说。',
    retell: '倒着讲：先说结局，再说线索是怎么被漏掉的。（这一本是「猜一猜」。）',
    think: '说说一个你常去、想回去看看的地方。',
    pre: [
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👦', en: 'ming', zh: '明明' }
    ],
    sight: ['knows'],
    newWords: [

    ],
    pages: [
      { art: 'library|dad,lili|corner|·', en: 'Ming walks to the corner.', zh: '明明走到街角。' },
      { art: 'library|dad,lili|corner|♪', en: 'The corner is the first place.', zh: '街角是第一个地方。' },
      { art: 'library|dad,lili|corner|👀', en: 'Ming looks at the market.', zh: '明明看看市场。' },
      { art: 'library|dad,lili|corner|?', en: 'Ming looks at the park.', zh: '明明看看公园。' },
      { art: 'library|dad,lili|corner|·', en: 'Ming knows them all.', zh: '明明都认识这些地方。' },
      { art: 'library|dad,lili|corner|!', en: 'Back to the first place.', zh: '回到最开始的地方。' },
      { art: 'library|dad,lili|corner|♥', en: 'Ming sees the same tree.', zh: '明明看到同一棵树。' },
      { art: 'library|dad,lili|corner|★', en: 'The tree is still there.', zh: '树还在那儿。' },
      { art: 'library|dad,lili|corner|…', en: 'Ming is glad to be back.', zh: '明明很高兴回来。' },
      { art: 'library|dad,lili|corner|·', en: 'The first place is good.', zh: '第一个地方真好。' },
      { art: 'library|dad,lili|corner|♥', en: 'Ming will start again.', zh: '明明要重新开始。' },
      { art: 'library|dad,lili|corner|·', en: 'Ming likes the corner.', zh: '明明喜欢这个街角。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['陀螺', '动物', '树'], a: 2, kind: 'recall' },
      { q: '明明回到了哪里？', opts: ['学校', '家', '街角'], a: 2, kind: 'infer' },
      { q: '回到去过的地方，你会怎么做？', opts: ['看看有什么变化，重新感受一下', '不看', '随便看看'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b85', lv: 'L8', tag: '过年', title: 'Dumplings with Grandma', zh: '和奶奶包饺子',
    emoji: '🥟', color: '#F6C6C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「混一混」这条线，认读 2 个新词。',
    trap: 'ou / ow 读 /aʊ/，oi / oy 读 /ɔɪ/；长句按意思分组读，别逐词蹦。',
    summary: '《和奶奶包饺子》是「混一混」：明明和奶奶在家，围绕饺子把一件事读到底。本本词卡：饺子、好看。读前先看词卡，读完合上书说一说。',
    retell: '按做事情的顺序讲一遍，至少用上三个新词。（这一本是「混一混」。）',
    think: '说说你和家人一起做过的一种吃的。',
    pre: [
      { art: '🥟', en: 'dumpling', zh: '饺子' },
      { art: '✨', en: 'pretty', zh: '好看' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👵', en: 'grandma', zh: '奶奶' }
    ],
    sight: ['kitchen'],
    newWords: [
      { w: 'dumpling', zh: '饺子' },
      { w: 'pretty', zh: '好看' }
    ],
    pages: [
      { art: 'kitchen|ming,grandma|dumpling|·', en: 'Grandma is in the kitchen.', zh: '奶奶在厨房。' },
      { art: 'kitchen|ming,grandma|dumpling|♪', en: 'Grandma makes dumplings.', zh: '奶奶包饺子。' },
      { art: 'kitchen|ming,grandma|dumpling|👀', en: 'Ming helps Grandma.', zh: '明明帮奶奶。' },
      { art: 'kitchen|ming,grandma|dumpling|?', en: 'They get the food ready.', zh: '他们把料备好。' },
      { art: 'kitchen|ming,grandma|dumpling|·', en: 'Grandma shows Ming how.', zh: '奶奶教明明怎么做。' },
      { art: 'kitchen|ming,grandma|dumpling|!', en: 'Ming makes one dumpling.', zh: '明明包了一个饺子。' },
      { art: 'kitchen|ming,grandma|dumpling|♥', en: 'The dumpling is not pretty.', zh: '饺子不太好看。' },
      { art: 'kitchen|ming,grandma|dumpling|★', en: 'Grandma says it is fine.', zh: '奶奶说没关系。' },
      { art: 'kitchen|ming,grandma|dumpling|…', en: 'They make many dumplings.', zh: '他们包了好多饺子。' },
      { art: 'kitchen|ming,grandma|dumpling|·', en: 'The dumplings cook in the pot.', zh: '饺子在锅里煮。' },
      { art: 'kitchen|ming,grandma|dumpling|♥', en: 'The dumplings are good!', zh: '饺子真好吃！' },
      { art: 'kitchen|ming,grandma|dumpling|·', en: 'Ming eats the dumplings.', zh: '明明吃饺子。' },
      { art: 'kitchen|ming,grandma|dumpling|…', en: 'Dumplings with Grandma.', zh: '和奶奶包饺子。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['厨房', '小路', '钱包'], a: 0, kind: 'recall' },
      { q: '明明包的饺子怎么样？', opts: ['不能吃', '特别漂亮', '不太好看，但没关系'], a: 2, kind: 'infer' },
      { q: '和家人一起做吃的，你会怎么做？', opts: ['怕做不好就不做', '只吃不做', '跟着学，做不好也没关系'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b86', lv: 'L8', tag: '中秋', title: 'The Mid-Autumn Moon', zh: '中秋的月亮',
    emoji: '🌕', color: '#F9DFB4',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「一起做」这条线，认读 4 个新词。',
    trap: 'ou / ow 读 /aʊ/，oi / oy 读 /ɔɪ/；长句按意思分组读，别逐词蹦。',
    summary: '《中秋的月亮》是「一起做」：丽丽和爷爷在家，围绕月饼把一件事读到底。本本词卡：中、秋天、圆、月饼。读前先看词卡，读完合上书说一说。',
    retell: '按做事情的顺序讲一遍，至少用上三个新词。（这一本是「一起做」。）',
    think: '说说中秋节你和家人做了什么。',
    pre: [
      { art: '⏰', en: 'mid', zh: '中' },
      { art: '⏰', en: 'autumn', zh: '秋天' },
      { art: '✨', en: 'round', zh: '圆' },
      { art: '🥮', en: 'mooncake', zh: '月饼' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'is', zh: 'is' }
    ],
    sight: [],
    newWords: [
      { w: 'mid', zh: '中' },
      { w: 'autumn', zh: '秋天' },
      { w: 'round', zh: '圆' },
      { w: 'mooncake', zh: '月饼' }
    ],
    pages: [
      { art: 'kitchen|lili,grandpa|mooncake|·', en: 'The Mid-Autumn night is here.', zh: '中秋的夜晚来了。' },
      { art: 'kitchen|lili,grandpa|mooncake|♪', en: 'The moon is round.', zh: '月亮圆圆的。' },
      { art: 'kitchen|lili,grandpa|mooncake|👀', en: 'The moon is bright.', zh: '月亮很亮。' },
      { art: 'kitchen|lili,grandpa|mooncake|?', en: 'The family is together.', zh: '一家人在一起。' },
      { art: 'kitchen|lili,grandpa|mooncake|·', en: 'Grandma has mooncakes.', zh: '奶奶有月饼。' },
      { art: 'kitchen|lili,grandpa|mooncake|!', en: 'A mooncake is for Ming.', zh: '有一块月饼是给明明的。' },
      { art: 'kitchen|lili,grandpa|mooncake|♥', en: 'The mooncake is good.', zh: '月饼很好吃。' },
      { art: 'kitchen|lili,grandpa|mooncake|★', en: 'They look at the moon.', zh: '他们看着月亮。' },
      { art: 'kitchen|lili,grandpa|mooncake|…', en: 'The moon looks back.', zh: '月亮也看着他们。' },
      { art: 'kitchen|lili,grandpa|mooncake|·', en: 'The Mid-Autumn moon.', zh: '中秋的月亮。' },
      { art: 'kitchen|lili,grandpa|mooncake|♥', en: 'They are happy together.', zh: '他们在一起很开心。' },
      { art: 'kitchen|lili,grandpa|mooncake|·', en: 'Mooncakes and the moon.', zh: '月饼和月亮。' },
      { art: 'kitchen|lili,grandpa|mooncake|…', en: 'A good night for the family.', zh: '全家团圆的好夜晚。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['家人', '猪', '红色'], a: 0, kind: 'recall' },
      { q: '中秋夜里大家做了什么？', opts: ['去看电影', '一起看月亮、吃月饼', '去上学'], a: 1, kind: 'infer' },
      { q: '过节和家人团聚，你会怎么做？', opts: ['不参加', '只顾自己玩', '和家人一起，珍惜在一起的时间'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b87', lv: 'L8', tag: '出行', title: 'A Long Train Ride', zh: '一趟长长的火车',
    emoji: '🚄', color: '#CDE7C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「补一补」这条线，认读 2 个新词。',
    trap: 'ou / ow 读 /aʊ/，oi / oy 读 /ɔɪ/；长句按意思分组读，别逐词蹦。',
    summary: '《一趟长长的火车》是「补一补」：奶奶和妈妈在家，围绕窗户把一件事读到底。本本词卡：火车、窗户。读前先看词卡，读完合上书说一说。',
    retell: '按做事情的顺序讲一遍，至少用上三个新词。（这一本是「补一补」。）',
    think: '说说你坐火车或汽车时看到的风景。',
    pre: [
      { art: '📦', en: 'train', zh: '火车' },
      { art: '🪟', en: 'window', zh: '窗户' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👦', en: 'ming', zh: '明明' }
    ],
    sight: [],
    newWords: [
      { w: 'train', zh: '火车' },
      { w: 'window', zh: '窗户' }
    ],
    pages: [
      { art: 'home|grandma,mom|window|·', en: 'Ming is on a train.', zh: '明明在火车上。' },
      { art: 'home|grandma,mom|window|♪', en: 'The train ride is long.', zh: '这趟火车很长。' },
      { art: 'home|grandma,mom|window|👀', en: 'Ming sits by the window.', zh: '明明坐在窗边。' },
      { art: 'home|grandma,mom|window|?', en: 'Ming looks out the window.', zh: '明明看着窗外。' },
      { art: 'home|grandma,mom|window|·', en: 'The train goes and goes.', zh: '火车开啊开。' },
      { art: 'home|grandma,mom|window|!', en: 'Ming sees hills and trees.', zh: '明明看到小山和树。' },
      { art: 'home|grandma,mom|window|♥', en: 'The train goes fast.', zh: '火车开得很快。' },
      { art: 'home|grandma,mom|window|★', en: 'Ming looks and looks.', zh: '明明看啊看。' },
      { art: 'home|grandma,mom|window|…', en: 'The window is nice.', zh: '窗子真好看。' },
      { art: 'home|grandma,mom|window|·', en: 'A long train ride.', zh: '一趟长长的火车。' },
      { art: 'home|grandma,mom|window|♥', en: 'Ming likes the window.', zh: '明明喜欢这个窗子。' },
      { art: 'home|grandma,mom|window|·', en: 'The train stops.', zh: '火车停了。' },
      { art: 'home|grandma,mom|window|…', en: 'Ming is glad.', zh: '明明很高兴。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['钱包', '火车', '笔'], a: 1, kind: 'recall' },
      { q: '明明坐在哪里？', opts: ['火车的窗边', '汽车里', '船上'], a: 0, kind: 'infer' },
      { q: '坐车旅行，你会怎么做？', opts: ['看看窗外的风景，注意安全', '一直睡觉', '乱跑'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b88', lv: 'L8', tag: '通信', title: 'A Letter to My Cousin', zh: '给表姐的信',
    emoji: '💌', color: '#C6DEF6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「排好队」这条线，认读 2 个新词。',
    trap: 'ou / ow 读 /aʊ/，oi / oy 读 /ɔɪ/；长句按意思分组读，别逐词蹦。',
    summary: '《给表姐的信》是「排好队」：爷爷和爸爸在学校，围绕图画把一件事读到底。本本词卡：表姐、房子。读前先看词卡，读完合上书说一说。',
    retell: '按做事情的顺序讲一遍，至少用上三个新词。（这一本是「排好队」。）',
    think: '说说你想寄给远方亲人的一样东西。',
    pre: [
      { art: '🧑', en: 'cousin', zh: '表姐' },
      { art: '🏠', en: 'house', zh: '房子' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'a', zh: 'a' }
    ],
    sight: ['writes'],
    newWords: [
      { w: 'cousin', zh: '表姐' },
      { w: 'house', zh: '房子' }
    ],
    pages: [
      { art: 'school|grandpa,dad|drawing|·', en: 'Ming draws a picture.', zh: '明明画了一幅画。' },
      { art: 'school|grandpa,dad|drawing|♪', en: 'The drawing is for Cousin.', zh: '这幅画是给表姐的。' },
      { art: 'school|grandpa,dad|drawing|👀', en: 'Ming draws a house.', zh: '明明画了一座房子。' },
      { art: 'school|grandpa,dad|drawing|?', en: 'Ming draws a window on it.', zh: '明明画了窗户。' },
      { art: 'school|grandpa,dad|drawing|·', en: 'The picture is nice.', zh: '画很好看。' },
      { art: 'school|grandpa,dad|drawing|!', en: 'Ming writes a note too.', zh: '明明还写了张纸条。' },
      { art: 'school|grandpa,dad|drawing|♥', en: 'The note says hello.', zh: '纸条上写着问好。' },
      { art: 'school|grandpa,dad|drawing|★', en: 'Ming puts the picture in a letter.', zh: '明明把画放进信里。' },
      { art: 'school|grandpa,dad|drawing|…', en: 'The letter goes to Cousin.', zh: '信寄给表姐。' },
      { art: 'school|grandpa,dad|drawing|·', en: 'Cousin gets the letter.', zh: '表姐收到了信。' },
      { art: 'school|grandpa,dad|drawing|♥', en: 'Cousin likes the picture.', zh: '表姐喜欢这幅画。' },
      { art: 'school|grandpa,dad|drawing|·', en: 'A picture for Cousin.', zh: '给表姐的画。' },
      { art: 'school|grandpa,dad|drawing|…', en: 'Letters and pictures.', zh: '信和画。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['小店', '绳子', '房子'], a: 2, kind: 'recall' },
      { q: '明明在信里放了什么？', opts: ['一个玩具', '一幅画和一张纸条', '一块月饼'], a: 1, kind: 'infer' },
      { q: '想让远方的家人开心，你会怎么做？', opts: ['画一幅画或写几句话寄给他', '只打电话', '什么也不做'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b89', lv: 'L8', tag: '农场', title: 'The Brown Cow', zh: '棕色的奶牛',
    emoji: '🐄', color: '#E0CFF3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「收一收」这条线，认读 2 个新词。',
    trap: 'ou / ow 读 /aʊ/，oi / oy 读 /ɔɪ/；长句按意思分组读，别逐词蹦。',
    summary: '《棕色的奶牛》是「收一收」：妈妈和明明在农场，围绕奶牛把一件事读到底。本本词卡：奶牛、棕色。读前先看词卡，读完合上书说一说。',
    retell: '按做事情的顺序讲一遍，至少用上三个新词。（这一本是「收一收」。）',
    think: '说说你在农场见过的一种大动物。',
    pre: [
      { art: '🐄', en: 'cow', zh: '奶牛' },
      { art: '🟤', en: 'brown', zh: '棕色' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'is', zh: 'is' }
    ],
    sight: [],
    newWords: [
      { w: 'cow', zh: '奶牛' },
      { w: 'brown', zh: '棕色' }
    ],
    pages: [
      { art: 'farm|mom,ming|cow|·', en: 'A cow is on the farm.', zh: '农场上有一头牛。' },
      { art: 'farm|mom,ming|cow|♪', en: 'The cow is brown.', zh: '牛是棕色的。' },
      { art: 'farm|mom,ming|cow|👀', en: 'The cow is big.', zh: '牛很大。' },
      { art: 'farm|mom,ming|cow|?', en: 'The cow eats grass.', zh: '牛吃草。' },
      { art: 'farm|mom,ming|cow|·', en: 'The cow eats and eats.', zh: '牛吃啊吃。' },
      { art: 'farm|mom,ming|cow|!', en: 'Ming looks at the cow.', zh: '明明看着牛。' },
      { art: 'farm|mom,ming|cow|♥', en: 'The cow is calm.', zh: '牛很安静。' },
      { art: 'farm|mom,ming|cow|★', en: 'Ming is not afraid.', zh: '明明不怕。' },
      { art: 'farm|mom,ming|cow|…', en: 'Ming gives the cow grass.', zh: '明明给牛草吃。' },
      { art: 'farm|mom,ming|cow|·', en: 'The brown cow.', zh: '棕色的奶牛。' },
      { art: 'farm|mom,ming|cow|♥', en: 'The cow likes Ming.', zh: '牛喜欢明明。' },
      { art: 'farm|mom,ming|cow|·', en: 'Ming likes the cow.', zh: '明明喜欢这头牛。' },
      { art: 'farm|mom,ming|cow|…', en: 'A cow on the farm.', zh: '农场上的牛。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['绵羊', '路', '农场'], a: 2, kind: 'recall' },
      { q: '牛是什么颜色的？', opts: ['黑色', '白色', '棕色'], a: 2, kind: 'infer' },
      { q: '靠近大动物，你会怎么做？', opts: ['大声吓它', '追它', '轻轻的，让它不怕你'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b90', lv: 'L8', tag: '家里', title: 'A House with a Window', zh: '有窗的房子',
    emoji: '🏠', color: '#F6C9E3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「分一分」这条线，认读 1 个新词。',
    trap: 'ou / ow 读 /aʊ/，oi / oy 读 /ɔɪ/；长句按意思分组读，别逐词蹦。',
    summary: '《有窗的房子》是「分一分」：爸爸和丽丽在家，围绕房子把一件事读到底。本本词卡：生命。读前先看词卡，读完合上书说一说。',
    retell: '按做事情的顺序讲一遍，至少用上三个新词。（这一本是「分一分」。）',
    think: '说说你家的一扇窗户：从那里能看到什么？',
    pre: [
      { art: '💡', en: 'life', zh: '生命' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '🏠', en: 'house', zh: '房子' }
    ],
    sight: [],
    newWords: [
      { w: 'life', zh: '生命' }
    ],
    pages: [
      { art: 'home|dad,lili|house|·', en: 'A house is on the hill.', zh: '小山上有一座房子。' },
      { art: 'home|dad,lili|house|♪', en: 'The house has a window.', zh: '房子有一扇窗户。' },
      { art: 'home|dad,lili|house|👀', en: 'The window is big.', zh: '窗户很大。' },
      { art: 'home|dad,lili|house|?', en: 'The sun comes in the window.', zh: '太阳从窗户照进来。' },
      { art: 'home|dad,lili|house|·', en: 'The house is nice.', zh: '房子里很亮。' },
      { art: 'home|dad,lili|house|!', en: 'Ming lives in the house.', zh: '明明住在房子里。' },
      { art: 'home|dad,lili|house|♥', en: 'Ming looks out the window.', zh: '明明看着窗外。' },
      { art: 'home|dad,lili|house|★', en: 'Ming sees the hill.', zh: '明明看到小山。' },
      { art: 'home|dad,lili|house|…', en: 'A house with a window.', zh: '有窗的房子。' },
      { art: 'home|dad,lili|house|·', en: 'Ming likes the window.', zh: '明明喜欢这扇窗。' },
      { art: 'home|dad,lili|house|♥', en: 'The house is warm.', zh: '房子很暖和。' },
      { art: 'home|dad,lili|house|·', en: 'Home is good.', zh: '家真好。' },
      { art: 'home|dad,lili|house|…', en: 'Ming likes the house.', zh: '明明喜欢这座房子。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['鲨鱼', '小山', '雪'], a: 1, kind: 'recall' },
      { q: '房子里有什么？', opts: ['一辆车', '一条河', '一扇大窗户'], a: 2, kind: 'infer' },
      { q: '住在有窗户的房子里，你会怎么做？', opts: ['一直拉着窗帘', '看看窗外，让阳光进来', '不看'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b91', lv: 'L8', tag: '数学', title: 'Count the Coins', zh: '数硬币',
    emoji: '🪙', color: '#BFE6DF',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「修好它」这条线，认读 1 个新词。',
    trap: 'ou / ow 读 /aʊ/，oi / oy 读 /ɔɪ/；长句按意思分组读，别逐词蹦。',
    summary: '《数硬币》是「修好它」：明明和奶奶在家，围绕硬币把一件事读到底。本本词卡：硬币。读前先看词卡，读完合上书说一说。',
    retell: '按做事情的顺序讲一遍，至少用上三个新词。（这一本是「修好它」。）',
    think: '说说你数过的一样东西。',
    pre: [
      { art: '🪙', en: 'coin', zh: '硬币' },
      { art: '👦', en: 'ming', zh: '明明' },
      { art: '📦', en: 'the', zh: 'the' }
    ],
    sight: [],
    newWords: [
      { w: 'coin', zh: '硬币' }
    ],
    pages: [
      { art: 'home|ming,grandma|coin|·', en: 'Ming has coins.', zh: '明明有硬币。' },
      { art: 'home|ming,grandma|coin|♪', en: 'The coins are small.', zh: '硬币很小。' },
      { art: 'home|ming,grandma|coin|👀', en: 'Ming counts the coins.', zh: '明明数硬币。' },
      { art: 'home|ming,grandma|coin|?', en: 'One coin, two coins, three coins.', zh: '一枚硬币、两枚、三枚。' },
      { art: 'home|ming,grandma|coin|·', en: 'Ming counts again.', zh: '明明又数了一遍。' },
      { art: 'home|ming,grandma|coin|!', en: 'Now there are more coins.', zh: '现在硬币更多了。' },
      { art: 'home|ming,grandma|coin|♥', en: 'Ming counts them all.', zh: '明明全数了一遍。' },
      { art: 'home|ming,grandma|coin|★', en: 'The coins are here.', zh: '硬币都在这儿。' },
      { art: 'home|ming,grandma|coin|…', en: 'Count the coins.', zh: '数硬币。' },
      { art: 'home|ming,grandma|coin|·', en: 'Ming likes to count.', zh: '明明喜欢数数。' },
      { art: 'home|ming,grandma|coin|♥', en: 'Ming keeps the coins.', zh: '明明把硬币收好。' },
      { art: 'home|ming,grandma|coin|·', en: 'Counting is fun.', zh: '数数真好玩。' },
      { art: 'home|ming,grandma|coin|…', en: 'Ming will count more tomorrow.', zh: '明明明天还要数。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['南方', '硬币', '轮船'], a: 1, kind: 'recall' },
      { q: '明明在数什么？', opts: ['硬币', '书', '苹果'], a: 0, kind: 'infer' },
      { q: '数数总是数错，你会怎么做？', opts: ['不数了', '随便说一个数', '从头按顺序数，一个一个来'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b92', lv: 'L8', tag: '趣事', title: 'A Loud Shout at Night', zh: '夜里的一声喊',
    emoji: '🌃', color: '#F2E2A8',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「不怕黑」这条线，认读 1 个新词。',
    trap: 'ou / ow 读 /aʊ/，oi / oy 读 /ɔɪ/；长句按意思分组读，别逐词蹦。',
    summary: '《夜里的一声喊》是「不怕黑」：丽丽和爷爷在家，围绕夜晚把一件事读到底。本本词卡：喊。读前先看词卡，读完合上书说一说。',
    retell: '按做事情的顺序讲一遍，至少用上三个新词。（这一本是「不怕黑」。）',
    think: '说说你夜里听到过的一种声音。',
    pre: [
      { art: '🏃', en: 'shout', zh: '喊' },
      { art: '📦', en: 'is', zh: 'is' },
      { art: '👦', en: 'ming', zh: '明明' }
    ],
    sight: ['quiet'],
    newWords: [
      { w: 'shout', zh: '喊' }
    ],
    pages: [
      { art: 'night|lili,grandpa|night|·', en: 'Night is here.', zh: '夜里。' },
      { art: 'night|lili,grandpa|night|♪', en: 'All is quiet.', zh: '一切都安静了。' },
      { art: 'night|lili,grandpa|night|👀', en: 'Ming is in bed.', zh: '明明在床上。' },
      { art: 'night|lili,grandpa|night|?', en: 'A loud sound is outside.', zh: '外面有一声大喊。' },
      { art: 'night|lili,grandpa|night|·', en: 'Ming is up.', zh: '明明坐起来。' },
      { art: 'night|lili,grandpa|night|!', en: 'What was that sound?', zh: '那是什么声音？' },
      { art: 'night|lili,grandpa|night|♥', en: 'Ming looks out the window.', zh: '明明看着窗外。' },
      { art: 'night|lili,grandpa|night|★', en: 'It was the wind.', zh: '原来是风。' },
      { art: 'night|lili,grandpa|night|…', en: 'Ming is not afraid.', zh: '明明不怕。' },
      { art: 'night|lili,grandpa|night|·', en: 'Ming goes back to bed.', zh: '明明回到床上。' },
      { art: 'night|lili,grandpa|night|♥', en: 'A loud shout at night.', zh: '夜里的一声喊。' },
      { art: 'night|lili,grandpa|night|·', en: 'The wind can be loud.', zh: '风也能很响。' },
      { art: 'night|lili,grandpa|night|…', en: 'Ming sleeps well.', zh: '明明睡得很好。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['袜子', '窗户', '茶'], a: 1, kind: 'recall' },
      { q: '那个大声音是什么？', opts: ['风', '有人喊叫', '打雷'], a: 0, kind: 'infer' },
      { q: '夜里听到奇怪的声音，你会怎么做？', opts: ['躲起来不出声', '看一看弄清楚是什么，别慌', '一直哭'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b93', lv: 'L8', tag: '发音', title: 'Say It: House, Cow', zh: '说一说：house cow',
    emoji: '🗣️', color: '#D9D2F5',
    track: 'drill',
    goal: '把本级难点音听准、说准，并能在整句里读对。这一本走「跟读整句」这条线，不引入新词，全部是读过的词。',
    trap: 'ou / ow 读 /aʊ/，oi / oy 读 /ɔɪ/；长句按意思分组读，别逐词蹦。',
    summary: '《说一说：house cow》是「跟读整句」：奶奶和妈妈在家，围绕房子把一件事读到底。本本词卡：这一本不引入新词，全部是读过的词。读前先看词卡，读完合上书说一说。',
    retell: '按做事情的顺序讲一遍，至少用上三个新词。（这一本是「跟读整句」。）',
    think: '找两个带 ow 的词，读一读、比一比。',
    pre: [
      { art: '🏠', en: 'house', zh: '房子' },
      { art: '🐄', en: 'cow', zh: '奶牛' }
    ],
    sight: [],
    newWords: [

    ],
    pages: [
      { art: 'table|grandma,mom|house|·', en: 'This is a house.', zh: '这是一座房子。' },
      { art: 'table|grandma,mom|house|♪', en: 'This is a cow.', zh: '这是一头牛。' },
      { art: 'table|grandma,mom|house|👀', en: 'House and cow.', zh: '房子和牛。' },
      { art: 'table|grandma,mom|house|?', en: 'Both have the "ow" sound.', zh: '两个词都有「ow」的音。' },
      { art: 'table|grandma,mom|house|·', en: 'Say "house".', zh: '说「房子」。' },
      { art: 'table|grandma,mom|house|!', en: 'Say "cow".', zh: '说「牛」。' },
      { art: 'table|grandma,mom|house|♥', en: 'House is not cow.', zh: '房子不是牛。' },
      { art: 'table|grandma,mom|house|★', en: 'The "ow" sounds the same.', zh: '「ow」的音一样。' },
      { art: 'table|grandma,mom|house|…', en: 'You can say both.', zh: '两个你都会说了。' },
      { art: 'table|grandma,mom|house|·', en: 'House, cow, house, cow.', zh: '房子、牛、房子、牛。' },
      { art: 'table|grandma,mom|house|♥', en: 'Good!', zh: '真棒！' },
      { art: 'table|grandma,mom|house|·', en: 'A house and a cow.', zh: '一座房子和一头牛。' },
      { art: 'table|grandma,mom|house|…', en: 'Now say them together.', zh: '现在一起说一遍。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['房子', '袜子', '茶'], a: 0, kind: 'recall' },
      { q: '这一本在练什么？', opts: ['「ou」的音', '「oi」的音', '「ow」的音'], a: 2, kind: 'infer' },
      { q: '遇到带 ow 的单词，你会怎么读？', opts: ['分开读两个字母', '把 ow 读成一个音', '跳过去'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b94', lv: 'L8', tag: '小知识', title: 'Why the Moon Looks Round', zh: '月亮为什么圆',
    emoji: '🔭', color: '#FAD3B6',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。这一本走「数一数」这条线，认读 1 个新词。',
    trap: 'ou / ow 读 /aʊ/，oi / oy 读 /ɔɪ/；长句按意思分组读，别逐词蹦。',
    summary: '《月亮为什么圆》是「数一数」：爷爷和爸爸在家，围绕月饼把一件事读到底。本本词卡：今晚。读前先看词卡，读完合上书说一说。',
    retell: '按做事情的顺序讲一遍，至少用上三个新词。（这一本是「数一数」。）',
    think: '说说月亮为什么有时候圆、有时候弯。',
    pre: [
      { art: '⏰', en: 'tonight', zh: '今晚' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '🌙', en: 'moon', zh: '月亮' }
    ],
    sight: ['friend'],
    newWords: [
      { w: 'tonight', zh: '今晚' }
    ],
    pages: [
      { art: 'kitchen|grandpa,dad|mooncake|·', en: 'The moon looks round.', zh: '月亮看起来圆圆的。' },
      { art: 'kitchen|grandpa,dad|mooncake|♪', en: 'Why does the moon look round?', zh: '为什么月亮看起来是圆的？' },
      { art: 'kitchen|grandpa,dad|mooncake|👀', en: 'We see one side of the moon.', zh: '我们看到月亮的一面。' },
      { art: 'kitchen|grandpa,dad|mooncake|?', en: 'The sun is bright on that side.', zh: '太阳把那面照亮。' },
      { art: 'kitchen|grandpa,dad|mooncake|·', en: 'So we see a round moon, big like a mooncake.', zh: '所以我们看到圆圆的月亮，像月饼一样。' },
      { art: 'kitchen|grandpa,dad|mooncake|!', en: 'Sometimes the moon looks small.', zh: '有时候月亮看起来很小。' },
      { art: 'kitchen|grandpa,dad|mooncake|♥', en: 'But it is the same moon.', zh: '可它是同一个月亮。' },
      { art: 'kitchen|grandpa,dad|mooncake|★', en: 'We see a different part.', zh: '我们看到的是不同的部分。' },
      { art: 'kitchen|grandpa,dad|mooncake|…', en: 'Why the moon looks round.', zh: '月亮为什么看起来是圆的。' },
      { art: 'kitchen|grandpa,dad|mooncake|·', en: 'The moon is far away.', zh: '月亮离我们很远。' },
      { art: 'kitchen|grandpa,dad|mooncake|♥', en: 'Look at the moon tonight.', zh: '今晚看看月亮吧。' },
      { art: 'kitchen|grandpa,dad|mooncake|·', en: 'The moon is always there.', zh: '月亮一直都在。' },
      { art: 'kitchen|grandpa,dad|mooncake|…', en: 'The moon is our friend.', zh: '月亮是我们的朋友。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['二', '茶', '太阳'], a: 2, kind: 'recall' },
      { q: '月亮为什么看起来是圆的？', opts: ['因为月亮是球', '太阳照亮了朝我们的一面', '因为天很黑'], a: 1, kind: 'infer' },
      { q: '想知道天象为什么这样，你会怎么做？', opts: ['不管它', '随便猜', '观察、问一问、查一查'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b95', lv: 'L8', tag: '小知识', title: 'Noodles in the South', zh: '南方的面条',
    emoji: '🍜', color: '#C8E7F0',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。这一本走「合上书讲一遍」这条线，认读 2 个新词。',
    trap: 'ou / ow 读 /aʊ/，oi / oy 读 /ɔɪ/；长句按意思分组读，别逐词蹦。',
    summary: '《南方的面条》是「合上书讲一遍」：妈妈和明明在家，围绕面条把一件事读到底。本本词卡：南方、面条。读前先看词卡，读完合上书说一说。',
    retell: '按做事情的顺序讲一遍，至少用上三个新词。（这一本是「合上书讲一遍」。）',
    think: '说说你喜欢的一种面食。',
    pre: [
      { art: '🌿', en: 'south', zh: '南方' },
      { art: '🍜', en: 'noodle', zh: '面条' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'are', zh: 'are' }
    ],
    sight: [],
    newWords: [
      { w: 'south', zh: '南方' },
      { w: 'noodle', zh: '面条' }
    ],
    pages: [
      { art: 'kitchen|mom,ming|noodle|·', en: 'Some people eat noodles.', zh: '有些人吃面条。' },
      { art: 'kitchen|mom,ming|noodle|♪', en: 'The noodles are long.', zh: '面条长长的。' },
      { art: 'kitchen|mom,ming|noodle|👀', en: 'Noodles are good to eat.', zh: '面条很好吃。' },
      { art: 'kitchen|mom,ming|noodle|?', en: 'People make noodles.', zh: '人们做面条。' },
      { art: 'kitchen|mom,ming|noodle|·', en: 'The noodles go in the pot.', zh: '面条放进锅里。' },
      { art: 'kitchen|mom,ming|noodle|!', en: 'The noodles are ready soon.', zh: '面条很快就熟。' },
      { art: 'kitchen|mom,ming|noodle|♥', en: 'People eat the noodles.', zh: '人们吃面条。' },
      { art: 'kitchen|mom,ming|noodle|★', en: 'Long noodles are fun.', zh: '长长的面条很好玩。' },
      { art: 'kitchen|mom,ming|noodle|…', en: 'Noodles in the south.', zh: '南方的面条。' },
      { art: 'kitchen|mom,ming|noodle|·', en: 'Ming likes noodles too.', zh: '明明也喜欢面条。' },
      { art: 'kitchen|mom,ming|noodle|♥', en: 'Noodles are warm and good.', zh: '面条又暖又好吃。' },
      { art: 'kitchen|mom,ming|noodle|·', en: 'You can eat a noodle too.', zh: '你也可以吃一根面条。' },
      { art: 'kitchen|mom,ming|noodle|…', en: 'Noodles are good food.', zh: '面条是好吃的东西。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['面条', '动物园', '鳟鱼'], a: 0, kind: 'recall' },
      { q: '面条是什么样的？', opts: ['长长的', '圆圆的', '方方的'], a: 0, kind: 'infer' },
      { q: '吃一种新食物，你会怎么做？', opts: ['尝一尝，看看喜不喜欢', '一口不吃', '只吃一种'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b96', lv: 'L8', tag: '复习', title: 'All Together Tonight', zh: '今晚大家在一起',
    emoji: '🏮', color: '#E8D9B5',
    track: 'review',
    goal: '把本级和前面级别的词再读一遍、串成一个故事。这一本走「猜一猜」这条线，认读 1 个新词。',
    trap: 'ou / ow 读 /aʊ/，oi / oy 读 /ɔɪ/；长句按意思分组读，别逐词蹦。',
    summary: '《今晚大家在一起》是「猜一猜」：爸爸和丽丽在图书馆，围绕路把一件事读到底。本本词卡：小镇。读前先看词卡，读完合上书说一说。',
    retell: '按做事情的顺序讲一遍，至少用上三个新词。（这一本是「猜一猜」。）',
    think: '说说你和家人在一起的一个晚上。',
    pre: [
      { art: '🏙️', en: 'town', zh: '小镇' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'is', zh: 'is' }
    ],
    sight: ['laugh', 'quiet'],
    newWords: [
      { w: 'town', zh: '小镇' }
    ],
    pages: [
      { art: 'library|dad,lili|town|·', en: 'The town is quiet.', zh: '小镇很安静。' },
      { art: 'library|dad,lili|town|♪', en: 'Everyone is together.', zh: '大家都在一起。' },
      { art: 'library|dad,lili|town|👀', en: 'The houses have lights.', zh: '房子里亮着灯。' },
      { art: 'library|dad,lili|town|?', en: 'Ming is with the family.', zh: '明明和家人在一起。' },
      { art: 'library|dad,lili|town|·', en: 'They eat together.', zh: '他们一起吃饭。' },
      { art: 'library|dad,lili|town|!', en: 'They talk and laugh.', zh: '他们说说笑笑。' },
      { art: 'library|dad,lili|town|♥', en: 'The town is warm tonight.', zh: '今晚小镇很暖。' },
      { art: 'library|dad,lili|town|★', en: 'All together tonight.', zh: '今晚大家在一起。' },
      { art: 'library|dad,lili|town|…', en: 'The family is happy.', zh: '一家人很开心。' },
      { art: 'library|dad,lili|town|·', en: 'The town is a good place.', zh: '小镇是个好地方。' },
      { art: 'library|dad,lili|town|♥', en: 'Ming likes the town.', zh: '明明喜欢这个小镇。' },
      { art: 'library|dad,lili|town|·', en: 'Together is good.', zh: '在一起真好。' },
      { art: 'library|dad,lili|town|…', en: 'A good night in the town.', zh: '小镇里的美好夜晚。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['动物', '浴盆', '家人'], a: 2, kind: 'recall' },
      { q: '今晚大家在做什么？', opts: ['各干各的', '一起吃饭、说笑', '都不在家'], a: 1, kind: 'infer' },
      { q: '和家人在一起的时光，你会怎么做？', opts: ['只顾自己', '不参加', '珍惜它，好好陪着家人'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b97', lv: 'L9', tag: '出行', title: 'The Photo at the Station', zh: '车站的照片',
    emoji: '📷', color: '#F6C6C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「找回来」这条线，认读 2 个新词。',
    trap: 'kn / wr / ph 里的第一个字母不发音；读长句时先找主句，再读从句。',
    summary: '《车站的照片》是「找回来」：明明和奶奶在家，围绕照片把一件事读到底。本本词卡：车站、照片。读前先看词卡，读完合上书说一说。',
    retell: '像小讲解员一样，把「现象 → 猜想 → 验证 → 结论」讲清楚。（这一本是「找回来」。）',
    think: '说说一张你觉得珍贵的照片。',
    pre: [
      { art: '🚉', en: 'station', zh: '车站' },
      { art: '📷', en: 'photo', zh: '照片' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👦', en: 'ming', zh: '明明' }
    ],
    sight: [],
    newWords: [
      { w: 'station', zh: '车站' },
      { w: 'photo', zh: '照片' }
    ],
    pages: [
      { art: 'home|ming,grandma|photo|·', en: 'Ming is at the station.', zh: '明明在车站。' },
      { art: 'home|ming,grandma|photo|♪', en: 'Ming has a photo.', zh: '明明有一张照片。' },
      { art: 'home|ming,grandma|photo|👀', en: 'The photo is of the family.', zh: '照片是全家人的。' },
      { art: 'home|ming,grandma|photo|?', en: 'Ming looks at the photo.', zh: '明明看着照片。' },
      { art: 'home|ming,grandma|photo|·', en: 'The family is in the photo.', zh: '全家人在照片里。' },
      { art: 'home|ming,grandma|photo|!', en: 'Grandma is in the photo.', zh: '奶奶在照片里。' },
      { art: 'home|ming,grandma|photo|♥', en: 'Ming is in the photo too.', zh: '明明也在照片里。' },
      { art: 'home|ming,grandma|photo|★', en: 'Ming keeps the photo safe.', zh: '明明把照片收好。' },
      { art: 'home|ming,grandma|photo|…', en: 'A photo at the station.', zh: '车站的照片。' },
      { art: 'home|ming,grandma|photo|·', en: 'The photo is a good thing.', zh: '照片是好东西。' },
      { art: 'home|ming,grandma|photo|♥', en: 'Ming looks at it again.', zh: '明明又看了看。' },
      { art: 'home|ming,grandma|photo|·', en: 'Ming will take more photos.', zh: '明明还要拍更多照片。' },
      { art: 'home|ming,grandma|photo|…', en: 'A photo says a lot.', zh: '一张照片能说好多。' },
      { art: 'home|ming,grandma|photo|?', en: 'Ming likes the photo.', zh: '明明喜欢这张照片。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['车站', '问题', '围巾'], a: 0, kind: 'recall' },
      { q: '照片里有谁？', opts: ['只有奶奶', '只有明明', '全家人'], a: 2, kind: 'infer' },
      { q: '想留住一个好的时刻，你会怎么做？', opts: ['拍张照片或写下来记着', '什么也不做', '马上忘掉'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b98', lv: 'L9', tag: '上课', title: 'A Question on the Board', zh: '黑板上的问题',
    emoji: '📋', color: '#F9DFB4',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「合上书讲一遍」这条线，认读 1 个新词。',
    trap: 'kn / wr / ph 里的第一个字母不发音；读长句时先找主句，再读从句。',
    summary: '《黑板上的问题》是「合上书讲一遍」：丽丽和爷爷在图书馆，围绕问题把一件事读到底。本本词卡：班。读前先看词卡，读完合上书说一说。',
    retell: '像小讲解员一样，把「现象 → 猜想 → 验证 → 结论」讲清楚。（这一本是「合上书讲一遍」。）',
    think: '说说你答对过的一道难题。',
    pre: [
      { art: '📦', en: 'class', zh: '班' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👦', en: 'ming', zh: '明明' }
    ],
    sight: [],
    newWords: [
      { w: 'class', zh: '班' }
    ],
    pages: [
      { art: 'library|lili,grandpa|question|·', en: 'A question is on the board.', zh: '黑板上有一个问题。' },
      { art: 'library|lili,grandpa|question|♪', en: 'The question is hard.', zh: '问题很难。' },
      { art: 'library|lili,grandpa|question|👀', en: 'The class looks at it.', zh: '全班看着它。' },
      { art: 'library|lili,grandpa|question|?', en: 'No one answers at first.', zh: '一开始没人答得上。' },
      { art: 'library|lili,grandpa|question|·', en: 'Ming reads the question again.', zh: '明明又读了一遍问题。' },
      { art: 'library|lili,grandpa|question|!', en: 'Ming finds a small part.', zh: '明明找到一个小地方。' },
      { art: 'library|lili,grandpa|question|♥', en: 'Ming thinks about that part.', zh: '明明想着那个小地方。' },
      { art: 'library|lili,grandpa|question|★', en: 'Ming raises a hand.', zh: '明明举手。' },
      { art: 'library|lili,grandpa|question|…', en: 'Ming gives an answer.', zh: '明明给了一个答案。' },
      { art: 'library|lili,grandpa|question|·', en: 'The answer is right!', zh: '答案对了！' },
      { art: 'library|lili,grandpa|question|♥', en: 'A question on the board.', zh: '黑板上的问题。' },
      { art: 'library|lili,grandpa|question|·', en: 'A good answer starts small.', zh: '好答案从小处开始。' },
      { art: 'library|lili,grandpa|question|…', en: 'The class is glad.', zh: '全班都很高兴。' },
      { art: 'library|lili,grandpa|question|?', en: 'Ming is glad too.', zh: '明明也很高兴。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['玫瑰', '班', '衬衫'], a: 1, kind: 'recall' },
      { q: '明明是怎么答对的？', opts: ['别人告诉的', '找到一个小地方，慢慢想出来的', '随便猜的'], a: 1, kind: 'infer' },
      { q: '遇到一个很难的问题，你会怎么做？', opts: ['直接放弃', '随便猜', '先找一个小地方，一点点想'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b99', lv: 'L9', tag: '观察', title: 'The Shadow in the Field', zh: '田里的影子',
    emoji: '🌾', color: '#CDE7C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「睡不着」这条线，认读 4 个新词。',
    trap: 'kn / wr / ph 里的第一个字母不发音；读长句时先找主句，再读从句。',
    summary: '《田里的影子》是「睡不着」：奶奶和妈妈在家，围绕影子把一件事读到底。本本词卡：田地、影子、中午、穿过。读前先看词卡，读完合上书说一说。',
    retell: '像小讲解员一样，把「现象 → 猜想 → 验证 → 结论」讲清楚。（这一本是「睡不着」。）',
    think: '说说你观察过的影子变化。',
    pre: [
      { art: '🌾', en: 'field', zh: '田地' },
      { art: '🌑', en: 'shadow', zh: '影子' },
      { art: '⏰', en: 'noon', zh: '中午' },
      { art: '💡', en: 'across', zh: '穿过' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👦', en: 'ming', zh: '明明' }
    ],
    sight: [],
    newWords: [
      { w: 'field', zh: '田地' },
      { w: 'shadow', zh: '影子' },
      { w: 'noon', zh: '中午' },
      { w: 'across', zh: '穿过' }
    ],
    pages: [
      { art: 'night|grandma,mom|shadow|·', en: 'Ming is in the field.', zh: '明明在田野里。' },
      { art: 'night|grandma,mom|shadow|♪', en: 'The sun is high.', zh: '太阳很高。' },
      { art: 'night|grandma,mom|shadow|👀', en: 'Ming sees a shadow.', zh: '明明看见一个影子。' },
      { art: 'night|grandma,mom|shadow|?', en: 'The shadow follows Ming.', zh: '影子跟着明明。' },
      { art: 'night|grandma,mom|shadow|·', en: 'When Ming moves, it moves.', zh: '明明动，它也动。' },
      { art: 'night|grandma,mom|shadow|!', en: 'The shadow is long in the morning.', zh: '早晨影子很长。' },
      { art: 'night|grandma,mom|shadow|♥', en: 'At noon the shadow is short.', zh: '中午影子很短。' },
      { art: 'night|grandma,mom|shadow|★', en: 'The shadow grows again.', zh: '影子又变长了。' },
      { art: 'night|grandma,mom|shadow|…', en: 'Why does the shadow change?', zh: '影子为什么会变？' },
      { art: 'night|grandma,mom|shadow|·', en: 'The sun moves across the sky.', zh: '太阳在天上移动。' },
      { art: 'night|grandma,mom|shadow|♥', en: 'The shadow changes with the sun.', zh: '影子随着太阳变。' },
      { art: 'night|grandma,mom|shadow|·', en: 'The shadow in the field.', zh: '田野里的影子。' },
      { art: 'night|grandma,mom|shadow|…', en: 'Ming watches the shadow.', zh: '明明看着影子。' },
      { art: 'night|grandma,mom|shadow|?', en: 'Shadows are fun to watch.', zh: '影子看着真好玩。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['影子', '沙子', '姐姐'], a: 0, kind: 'recall' },
      { q: '影子为什么会变？', opts: ['因为风大', '因为太阳在天上移动', '因为影子自己动'], a: 1, kind: 'infer' },
      { q: '想弄清影子的秘密，你会怎么做？', opts: ['只看一次', '不管它', '一天里多看几次，比一比'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b100', lv: 'L9', tag: '农事', title: 'Wheat and Harvest', zh: '小麦和收成',
    emoji: '🌾', color: '#C6DEF6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「找回它们」这条线，认读 3 个新词。',
    trap: 'kn / wr / ph 里的第一个字母不发音；读长句时先找主句，再读从句。',
    summary: '《小麦和收成》是「找回它们」：爷爷和爸爸在农场，围绕小麦把一件事读到底。本本词卡：小麦、收成、收集。读前先看词卡，读完合上书说一说。',
    retell: '像小讲解员一样，把「现象 → 猜想 → 验证 → 结论」讲清楚。（这一本是「找回它们」。）',
    think: '说说小麦是怎么变成食物的。',
    pre: [
      { art: '🌾', en: 'wheat', zh: '小麦' },
      { art: '🍚', en: 'harvest', zh: '收成' },
      { art: '🏃', en: 'gather', zh: '收集' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'is', zh: 'is' }
    ],
    sight: ['field'],
    newWords: [
      { w: 'wheat', zh: '小麦' },
      { w: 'harvest', zh: '收成' },
      { w: 'gather', zh: '收集' }
    ],
    pages: [
      { art: 'farm|grandpa,dad|wheat|·', en: 'Wheat grows in the field.', zh: '小麦长在田里。' },
      { art: 'farm|grandpa,dad|wheat|♪', en: 'The wheat is tall now.', zh: '小麦现在很高。' },
      { art: 'farm|grandpa,dad|wheat|👀', en: 'The wheat is yellow.', zh: '小麦是黄色的。' },
      { art: 'farm|grandpa,dad|wheat|?', en: 'It is time to harvest.', zh: '该收割了。' },
      { art: 'farm|grandpa,dad|wheat|·', en: 'The farmer cuts the wheat.', zh: '农民割小麦。' },
      { art: 'farm|grandpa,dad|wheat|!', en: 'They gather the wheat.', zh: '他们把小麦收起来。' },
      { art: 'farm|grandpa,dad|wheat|♥', en: 'The wheat is dry now.', zh: '小麦现在干了。' },
      { art: 'farm|grandpa,dad|wheat|★', en: 'The wheat is good.', zh: '小麦很好。' },
      { art: 'farm|grandpa,dad|wheat|…', en: 'Wheat and harvest.', zh: '小麦和收成。' },
      { art: 'farm|grandpa,dad|wheat|·', en: 'The harvest is big this year.', zh: '今年收成很好。' },
      { art: 'farm|grandpa,dad|wheat|♥', en: 'They work hard for it.', zh: '他们为此辛苦干活。' },
      { art: 'farm|grandpa,dad|wheat|·', en: 'The wheat becomes food.', zh: '小麦变成了食物。' },
      { art: 'farm|grandpa,dad|wheat|…', en: 'We eat the bread from wheat.', zh: '我们吃小麦做的面包。' },
      { art: 'farm|grandpa,dad|wheat|?', en: 'The harvest feeds many.', zh: '收成养活很多人。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['星星', '田地', '姐姐'], a: 1, kind: 'recall' },
      { q: '小麦什么时候收割？', opts: ['刚种下的时候', '长得又高又黄的时候', '下雨的时候'], a: 1, kind: 'infer' },
      { q: '辛苦种的东西有了收获，你会怎么做？', opts: ['不管它', '珍惜它，不浪费', '随便扔掉'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b101', lv: 'L9', tag: '工具', title: 'A Knife and a Wheel', zh: '刀和轮子',
    emoji: '⚙️', color: '#E0CFF3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「排排顺序」这条线，认读 5 个新词。',
    trap: 'kn / wr / ph 里的第一个字母不发音；读长句时先找主句，再读从句。',
    summary: '《刀和轮子》是「排排顺序」：妈妈和明明在图书馆，围绕刀把一件事读到底。本本词卡：刀、轮子、尖、摸、有用。读前先看词卡，读完合上书说一说。',
    retell: '像小讲解员一样，把「现象 → 猜想 → 验证 → 结论」讲清楚。（这一本是「排排顺序」。）',
    think: '说说两种用处不同的工具。',
    pre: [
      { art: '🔪', en: 'knife', zh: '刀' },
      { art: '⚙️', en: 'wheel', zh: '轮子' },
      { art: '✨', en: 'sharp', zh: '尖' },
      { art: '🏃', en: 'touch', zh: '摸' },
      { art: '✨', en: 'useful', zh: '有用' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'a', zh: 'a' }
    ],
    sight: [],
    newWords: [
      { w: 'knife', zh: '刀' },
      { w: 'wheel', zh: '轮子' },
      { w: 'sharp', zh: '尖' },
      { w: 'touch', zh: '摸' },
      { w: 'useful', zh: '有用' }
    ],
    pages: [
      { art: 'library|mom,ming|knife|·', en: 'A knife and a wheel.', zh: '一把刀和一个轮子。' },
      { art: 'library|mom,ming|knife|♪', en: 'The knife is sharp.', zh: '刀很快。' },
      { art: 'library|mom,ming|knife|👀', en: 'The wheel is round.', zh: '轮子是圆的。' },
      { art: 'library|mom,ming|knife|?', en: 'The knife cuts things.', zh: '刀切东西。' },
      { art: 'library|mom,ming|knife|·', en: 'The wheel turns.', zh: '轮子转动。' },
      { art: 'library|mom,ming|knife|!', en: 'Both help people.', zh: '两样都帮人。' },
      { art: 'library|mom,ming|knife|♥', en: 'But the knife can hurt.', zh: '可刀会伤人。' },
      { art: 'library|mom,ming|knife|★', en: 'Be careful with the knife.', zh: '用刀要小心。' },
      { art: 'library|mom,ming|knife|…', en: 'The wheel is safe to touch.', zh: '轮子摸起来安全。' },
      { art: 'library|mom,ming|knife|·', en: 'Two useful things.', zh: '两样有用的东西。' },
      { art: 'library|mom,ming|knife|♥', en: 'Different things, different uses.', zh: '不同的东西，不同的用处。' },
      { art: 'library|mom,ming|knife|·', en: 'Use each one well.', zh: '每样都好好用。' },
      { art: 'library|mom,ming|knife|…', en: 'Care keeps us safe.', zh: '小心让我们安全。' },
      { art: 'library|mom,ming|knife|?', en: 'A knife and a wheel.', zh: '一把刀和一个轮子。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['车站', '裙子', '刀'], a: 2, kind: 'recall' },
      { q: '用刀的时候要注意什么？', opts: ['越快越好', '不用注意', '要小心，别伤到自己'], a: 2, kind: 'infer' },
      { q: '用尖的、快的工具，你会怎么做？', opts: ['小心用，必要时请大人帮忙', '随便乱用', '不用了'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b102', lv: 'L9', tag: '提问', title: 'The Scientist and an Answer', zh: '科学家的答案',
    emoji: '🔬', color: '#F6C9E3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「多练一练」这条线，认读 2 个新词。',
    trap: 'kn / wr / ph 里的第一个字母不发音；读长句时先找主句，再读从句。',
    summary: '《科学家的答案》是「多练一练」：爸爸和丽丽在图书馆，围绕回答把一件事读到底。本本词卡：科学家、通向。读前先看词卡，读完合上书说一说。',
    retell: '像小讲解员一样，把「现象 → 猜想 → 验证 → 结论」讲清楚。（这一本是「多练一练」。）',
    think: '说说一个你想弄明白的难题。',
    pre: [
      { art: '🧑', en: 'scientist', zh: '科学家' },
      { art: '🏃', en: 'lead', zh: '通向' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '✅', en: 'answer', zh: '回答' }
    ],
    sight: [],
    newWords: [
      { w: 'scientist', zh: '科学家' },
      { w: 'lead', zh: '通向' }
    ],
    pages: [
      { art: 'library|dad,lili|answer|·', en: 'A scientist has a question.', zh: '科学家有一个问题。' },
      { art: 'library|dad,lili|answer|♪', en: 'The question is hard.', zh: '问题很难。' },
      { art: 'library|dad,lili|answer|👀', en: 'The scientist looks for an answer.', zh: '科学家找答案。' },
      { art: 'library|dad,lili|answer|?', en: 'The scientist tries many times.', zh: '科学家试了很多次。' },
      { art: 'library|dad,lili|answer|·', en: 'The answer is not easy.', zh: '答案不容易。' },
      { art: 'library|dad,lili|answer|!', en: 'The scientist does not stop.', zh: '科学家没有停。' },
      { art: 'library|dad,lili|answer|♥', en: 'The scientist writes it down.', zh: '科学家把过程记下来。' },
      { art: 'library|dad,lili|answer|★', en: 'At last, the answer comes.', zh: '最后，答案来了。' },
      { art: 'library|dad,lili|answer|…', en: 'The answer is good.', zh: '答案很好。' },
      { art: 'library|dad,lili|answer|·', en: 'The scientist and an answer.', zh: '科学家和答案。' },
      { art: 'library|dad,lili|answer|♥', en: 'Hard questions need time.', zh: '难问题需要时间。' },
      { art: 'library|dad,lili|answer|·', en: 'Trying again helps.', zh: '再试一次有帮助。' },
      { art: 'library|dad,lili|answer|…', en: 'The scientist is glad.', zh: '科学家很高兴。' },
      { art: 'library|dad,lili|answer|?', en: 'Questions lead to answers.', zh: '问题通向答案。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['裙子', '科学家', '车站'], a: 1, kind: 'recall' },
      { q: '科学家是怎么找到答案的？', opts: ['一次就找到了', '别人给的', '试了很多次，没有停'], a: 2, kind: 'infer' },
      { q: '一个难题很久解不开，你会怎么做？', opts: ['马上放弃', '记下来，慢慢试，不放弃', '不管它'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b103', lv: 'L9', tag: '参观', title: 'A Quiet Museum', zh: '安静的博物馆',
    emoji: '🏛️', color: '#BFE6DF',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「找路」这条线，认读 2 个新词。',
    trap: 'kn / wr / ph 里的第一个字母不发音；读长句时先找主句，再读从句。',
    summary: '《安静的博物馆》是「找路」：明明和奶奶在街道，围绕博物馆把一件事读到底。本本词卡：博物馆、以前。读前先看词卡，读完合上书说一说。',
    retell: '像小讲解员一样，把「现象 → 猜想 → 验证 → 结论」讲清楚。（这一本是「找路」。）',
    think: '说说你在博物馆或老房子里看到的一样老东西。',
    pre: [
      { art: '🏛️', en: 'museum', zh: '博物馆' },
      { art: '⏰', en: 'ago', zh: '以前' },
      { art: '👦', en: 'ming', zh: '明明' },
      { art: '📦', en: 'is', zh: 'is' }
    ],
    sight: ['stories'],
    newWords: [
      { w: 'museum', zh: '博物馆' },
      { w: 'ago', zh: '以前' }
    ],
    pages: [
      { art: 'street|ming,grandma|museum|·', en: 'Ming is in a museum.', zh: '明明在博物馆里。' },
      { art: 'street|ming,grandma|museum|♪', en: 'The museum is quiet.', zh: '博物馆很安静。' },
      { art: 'street|ming,grandma|museum|👀', en: 'Ming walks and looks.', zh: '明明走着看着。' },
      { art: 'street|ming,grandma|museum|?', en: 'Old things are here.', zh: '这里有老东西。' },
      { art: 'street|ming,grandma|museum|·', en: 'A very old pot is here.', zh: '这里有很老的锅。' },
      { art: 'street|ming,grandma|museum|!', en: 'Ming looks at the pot.', zh: '明明看着这口锅。' },
      { art: 'street|ming,grandma|museum|♥', en: 'People used it long ago.', zh: '很久以前的人用过它。' },
      { art: 'street|ming,grandma|museum|★', en: 'Ming thinks about them.', zh: '明明想着那些人。' },
      { art: 'street|ming,grandma|museum|…', en: 'The museum keeps old things.', zh: '博物馆保存老东西。' },
      { art: 'street|ming,grandma|museum|·', en: 'A quiet museum.', zh: '安静的博物馆。' },
      { art: 'street|ming,grandma|museum|♥', en: 'Old things tell stories.', zh: '老东西会讲过去的事。' },
      { art: 'street|ming,grandma|museum|·', en: 'Ming learns from them.', zh: '明明从中学到东西。' },
      { art: 'street|ming,grandma|museum|…', en: 'Ming wants to come back.', zh: '明明还想再来。' },
      { art: 'street|ming,grandma|museum|?', en: 'The museum is a good place.', zh: '博物馆是个好地方。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['三', '博物馆', '勺子'], a: 1, kind: 'recall' },
      { q: '博物馆里的东西有什么特别？', opts: ['它们很老，是很久以前的人用过的', '它们会动', '它们很新'], a: 0, kind: 'infer' },
      { q: '在博物馆里，你会怎么做？', opts: ['安静看，想一想它背后的事', '大声喧哗', '乱摸乱碰'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b104', lv: 'L9', tag: '方法', title: 'Write It Down', zh: '把它记下来',
    emoji: '✏️', color: '#F2E2A8',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「比一比」这条线，认读 2 个新词。',
    trap: 'kn / wr / ph 里的第一个字母不发音；读长句时先找主句，再读从句。',
    summary: '《把它记下来》是「比一比」：丽丽和爷爷在学校，围绕木板把一件事读到底。本本词卡：写、工具。读前先看词卡，读完合上书说一说。',
    retell: '像小讲解员一样，把「现象 → 猜想 → 验证 → 结论」讲清楚。（这一本是「比一比」。）',
    think: '说说你写下来记着的一件事。',
    pre: [
      { art: '🏃', en: 'written', zh: '写' },
      { art: '📦', en: 'tool', zh: '工具' },
      { art: '👦', en: 'ming', zh: '明明' },
      { art: '📦', en: 'the', zh: 'the' }
    ],
    sight: [],
    newWords: [
      { w: 'written', zh: '写' },
      { w: 'tool', zh: '工具' }
    ],
    pages: [
      { art: 'school|lili,grandpa|board|·', en: 'A board is on the wall.', zh: '墙上有一块板。' },
      { art: 'school|lili,grandpa|board|♪', en: 'Ming has a good idea.', zh: '明明有个好主意。' },
      { art: 'school|lili,grandpa|board|👀', en: 'Ming writes it down.', zh: '明明把它写下来。' },
      { art: 'school|lili,grandpa|board|?', en: 'Writing helps us remember.', zh: '写下来帮我们记住。' },
      { art: 'school|lili,grandpa|board|·', en: 'Ming writes more.', zh: '明明又写了一些。' },
      { art: 'school|lili,grandpa|board|!', en: 'The board is full now.', zh: '板子现在写满了。' },
      { art: 'school|lili,grandpa|board|♥', en: 'Ming looks at the board.', zh: '明明看着板子。' },
      { art: 'school|lili,grandpa|board|★', en: 'The ideas are there.', zh: '主意都在那儿。' },
      { art: 'school|lili,grandpa|board|…', en: 'Write it down.', zh: '把它记下来。' },
      { art: 'school|lili,grandpa|board|·', en: 'A written word is there.', zh: '写下的字留得住。' },
      { art: 'school|lili,grandpa|board|♥', en: 'Ming will write more.', zh: '明明还要多写。' },
      { art: 'school|lili,grandpa|board|·', en: 'Writing is a good tool.', zh: '写字是个好工具。' },
      { art: 'school|lili,grandpa|board|…', en: 'The board holds ideas.', zh: '板子装着主意。' },
      { art: 'school|lili,grandpa|board|?', en: 'Ming likes to write.', zh: '明明喜欢写字。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['太阳', '鳟鱼', '工具'], a: 2, kind: 'recall' },
      { q: '为什么要写下来？', opts: ['写下来能帮我们记住', '为了好看', '为了给别人看'], a: 0, kind: 'infer' },
      { q: '怕忘掉一个好主意，你会怎么做？', opts: ['不管它', '记在心里就行', '马上写下来或记下来'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b105', lv: 'L9', tag: '发音', title: 'Say It: Knee, Write', zh: '说一说：knee write',
    emoji: '🗣️', color: '#D9D2F5',
    track: 'drill',
    goal: '把本级难点音听准、说准，并能在整句里读对。这一本走「跟读整句」这条线，认读 1 个新词。',
    trap: 'kn / wr / ph 里的第一个字母不发音；读长句时先找主句，再读从句。',
    summary: '《说一说：knee write》是「跟读整句」：奶奶和妈妈在家，围绕膝盖把一件事读到底。本本词卡：膝盖。读前先看词卡，读完合上书说一说。',
    retell: '像小讲解员一样，把「现象 → 猜想 → 验证 → 结论」讲清楚。（这一本是「跟读整句」。）',
    think: '找一个有不发音字母的词，读一读。',
    pre: [
      { art: '🦵', en: 'knee', zh: '膝盖' },
      { art: '🏃', en: 'write', zh: '写' },
      { art: '📦', en: 'is', zh: 'is' }
    ],
    sight: [],
    newWords: [
      { w: 'knee', zh: '膝盖' }
    ],
    pages: [
      { art: 'table|grandma,mom|knee|·', en: 'This is a knee.', zh: '这是膝盖。' },
      { art: 'table|grandma,mom|knee|♪', en: 'This is "write".', zh: '这是「写」。' },
      { art: 'table|grandma,mom|knee|👀', en: 'Knee and write.', zh: '膝盖和写。' },
      { art: 'table|grandma,mom|knee|?', en: 'In "knee", the "k" is quiet.', zh: '在「knee」里，「k」不发音。' },
      { art: 'table|grandma,mom|knee|·', en: 'In "write", the "w" is quiet.', zh: '在「write」里，「w」不发音。' },
      { art: 'table|grandma,mom|knee|!', en: 'Say "knee".', zh: '说「膝盖」。' },
      { art: 'table|grandma,mom|knee|♥', en: 'Say "write".', zh: '说「写」。' },
      { art: 'table|grandma,mom|knee|★', en: 'Some letters are quiet.', zh: '有些字母不发音。' },
      { art: 'table|grandma,mom|knee|…', en: 'Knee, write, knee, write.', zh: '膝盖、写、膝盖、写。' },
      { art: 'table|grandma,mom|knee|·', en: 'You can read both.', zh: '两个你都会读了。' },
      { art: 'table|grandma,mom|knee|♥', en: 'Quiet letters can be there.', zh: '不发音的字母可以在那儿。' },
      { art: 'table|grandma,mom|knee|·', en: 'Just read the sound.', zh: '只读出发音的那部分。' },
      { art: 'table|grandma,mom|knee|…', en: 'Good reading!', zh: '读得真棒！' },
      { art: 'table|grandma,mom|knee|?', en: 'Knee and write.', zh: '膝盖和写。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['乌龟', '茶', '膝盖'], a: 2, kind: 'recall' },
      { q: '这两个词里什么特别？', opts: ['都很短', '都很长', '有些字母不发音'], a: 2, kind: 'infer' },
      { q: '遇到有不发音字母的单词，你会怎么读？', opts: ['每个字母都念', '读出发音的那部分，别念不发音的字母', '跳过去'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b106', lv: 'L9', tag: '小知识', title: 'Why Seasons Change', zh: '季节为什么变',
    emoji: '🍂', color: '#FAD3B6',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。这一本走「数一数」这条线，认读 4 个新词。',
    trap: 'kn / wr / ph 里的第一个字母不发音；读长句时先找主句，再读从句。',
    summary: '《季节为什么变》是「数一数」：爷爷和爸爸在家，围绕季节把一件事读到底。本本词卡：泥土、朝着、春天、季节。读前先看词卡，读完合上书说一说。',
    retell: '像小讲解员一样，把「现象 → 猜想 → 验证 → 结论」讲清楚。（这一本是「数一数」。）',
    think: '说说一年四季是怎么变的。',
    pre: [
      { art: '📦', en: 'earth', zh: '泥土' },
      { art: '💡', en: 'toward', zh: '朝着' },
      { art: '⏰', en: 'spring', zh: '春天' },
      { art: '🍂', en: 'season', zh: '季节' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '🔄', en: 'change', zh: '变化' }
    ],
    sight: [],
    newWords: [
      { w: 'earth', zh: '泥土' },
      { w: 'toward', zh: '朝着' },
      { w: 'spring', zh: '春天' },
      { w: 'season', zh: '季节' }
    ],
    pages: [
      { art: 'night|grandpa,dad|season|·', en: 'The seasons change.', zh: '季节会变。' },
      { art: 'night|grandpa,dad|season|♪', en: 'Why do seasons change?', zh: '为什么季节会变？' },
      { art: 'night|grandpa,dad|season|👀', en: 'The earth goes around the sun.', zh: '地球绕着太阳转。' },
      { art: 'night|grandpa,dad|season|?', en: 'Sometimes our part is toward the sun.', zh: '有时候我们这边朝着太阳。' },
      { art: 'night|grandpa,dad|season|·', en: 'Then it is warm.', zh: '那时就暖和。' },
      { art: 'night|grandpa,dad|season|!', en: 'Sometimes our part turns away.', zh: '有时候我们这边转开。' },
      { art: 'night|grandpa,dad|season|♥', en: 'Then it is cold.', zh: '那时就冷。' },
      { art: 'night|grandpa,dad|season|★', en: 'So the seasons change.', zh: '所以季节会变。' },
      { art: 'night|grandpa,dad|season|…', en: 'Spring, summer, fall, winter.', zh: '春、夏、秋、冬。' },
      { art: 'night|grandpa,dad|season|·', en: 'Each season is different.', zh: '每个季节都不一样。' },
      { art: 'night|grandpa,dad|season|♥', en: 'Why seasons change.', zh: '季节为什么变。' },
      { art: 'night|grandpa,dad|season|·', en: 'The earth keeps going.', zh: '地球一直转。' },
      { art: 'night|grandpa,dad|season|…', en: 'The seasons keep changing.', zh: '季节一直变。' },
      { art: 'night|grandpa,dad|season|?', en: 'Change is all around.', zh: '变化到处都是。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['小镇', '太阳', '轮子'], a: 1, kind: 'recall' },
      { q: '季节为什么会变？', opts: ['因为月亮变', '地球绕太阳转，我们这边有时朝太阳有时转开', '因为风向变'], a: 1, kind: 'infer' },
      { q: '想知道自然的大变化，你会怎么做？', opts: ['观察、看书、问一问', '随便猜', '不管它'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b107', lv: 'L9', tag: '小知识', title: 'How We Measure Rain', zh: '我们怎么量雨',
    emoji: '🌧️', color: '#C8E7F0',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。这一本走「合上书讲一遍」这条线，认读 1 个新词。',
    trap: 'kn / wr / ph 里的第一个字母不发音；读长句时先找主句，再读从句。',
    summary: '《我们怎么量雨》是「合上书讲一遍」：妈妈和明明在家，围绕雨把一件事读到底。本本词卡：记下。读前先看词卡，读完合上书说一说。',
    retell: '像小讲解员一样，把「现象 → 猜想 → 验证 → 结论」讲清楚。（这一本是「合上书讲一遍」。）',
    think: '说说你想量一量的一样东西。',
    pre: [
      { art: '🏃', en: 'mark', zh: '记下' },
      { art: '📦', en: 'we', zh: 'we' },
      { art: '📦', en: 'the', zh: 'the' }
    ],
    sight: [],
    newWords: [
      { w: 'mark', zh: '记下' }
    ],
    pages: [
      { art: 'night|mom,ming|rain|·', en: 'We want to measure the rain.', zh: '我们想量一量雨。' },
      { art: 'night|mom,ming|rain|♪', en: 'We need a way to measure.', zh: '我们需要一个量的办法。' },
      { art: 'night|mom,ming|rain|👀', en: 'We put a cup outside.', zh: '我们把杯子放在外面。' },
      { art: 'night|mom,ming|rain|?', en: 'The rain falls in the cup.', zh: '雨下进杯子里。' },
      { art: 'night|mom,ming|rain|·', en: 'We look at the water in the cup.', zh: '我们看看杯子里的水。' },
      { art: 'night|mom,ming|rain|!', en: 'More rain, more water.', zh: '雨越多，水越多。' },
      { art: 'night|mom,ming|rain|♥', en: 'We mark how much.', zh: '我们记下有多少。' },
      { art: 'night|mom,ming|rain|★', en: 'Now we can measure the rain.', zh: '现在我们能量雨了。' },
      { art: 'night|mom,ming|rain|…', en: 'How we measure rain.', zh: '我们怎么量雨。' },
      { art: 'night|mom,ming|rain|·', en: 'Measuring needs a way.', zh: '测量要有办法。' },
      { art: 'night|mom,ming|rain|♥', en: 'A cup can be a tool.', zh: '杯子也能当工具。' },
      { art: 'night|mom,ming|rain|·', en: 'We measure again tomorrow.', zh: '我们明天再量。' },
      { art: 'night|mom,ming|rain|…', en: 'Rain can be measured.', zh: '雨是可以量的。' },
      { art: 'night|mom,ming|rain|?', en: 'Measuring is useful.', zh: '测量很有用。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['翅膀', '胳膊', '水'], a: 2, kind: 'recall' },
      { q: '我们用什么量雨？', opts: ['放在外面的杯子', '尺子', '秤'], a: 0, kind: 'infer' },
      { q: '想测量一样东西，你会怎么做？', opts: ['想一个办法，用工具量一量', '不量了', '随便说一个数'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b108', lv: 'L9', tag: '复习', title: 'The Whole Story', zh: '整个故事',
    emoji: '📚', color: '#E8D9B5',
    track: 'review',
    goal: '把本级和前面级别的词再读一遍、串成一个故事。这一本走「记住它」这条线，不引入新词，全部是读过的词。',
    trap: 'kn / wr / ph 里的第一个字母不发音；读长句时先找主句，再读从句。',
    summary: '《整个故事》是「记住它」：爸爸和丽丽在图书馆，围绕故事把一件事读到底。本本词卡：这一本不引入新词，全部是读过的词。读前先看词卡，读完合上书说一说。',
    retell: '像小讲解员一样，把「现象 → 猜想 → 验证 → 结论」讲清楚。（这一本是「记住它」。）',
    think: '说说一件事的开头、中间和结尾。',
    pre: [
      { art: '📦', en: 'the', zh: 'the' },
      { art: '💡', en: 'story', zh: '故事' }
    ],
    sight: [],
    newWords: [

    ],
    pages: [
      { art: 'library|dad,lili|story|·', en: 'Ming is at the station.', zh: '明明在车站。' },
      { art: 'library|dad,lili|story|♪', en: 'Ming thinks about the whole story.', zh: '明明想着整个故事。' },
      { art: 'library|dad,lili|story|👀', en: 'First, there was a question.', zh: '一开始，有个问题。' },
      { art: 'library|dad,lili|story|?', en: 'Then, there was work.', zh: '然后，是努力。' },
      { art: 'library|dad,lili|story|·', en: 'Then, there was an answer.', zh: '再然后，是答案。' },
      { art: 'library|dad,lili|story|!', en: 'The story has three parts.', zh: '故事有三个部分。' },
      { art: 'library|dad,lili|story|♥', en: 'Ming tells the whole story.', zh: '明明讲了整个故事。' },
      { art: 'library|dad,lili|story|★', en: 'The parts make a whole.', zh: '部分合起来就是整体。' },
      { art: 'library|dad,lili|story|…', en: 'The whole story.', zh: '整个故事。' },
      { art: 'library|dad,lili|story|·', en: 'A story needs all its parts.', zh: '故事需要它的每一部分。' },
      { art: 'library|dad,lili|story|♥', en: 'Ming tells it again.', zh: '明明又讲了一遍。' },
      { art: 'library|dad,lili|story|·', en: 'The whole story is clear now.', zh: '整个故事现在很清楚了。' },
      { art: 'library|dad,lili|story|…', en: 'Ming likes a good story.', zh: '明明喜欢好故事。' },
      { art: 'library|dad,lili|story|?', en: 'The whole story, start to end.', zh: '整个故事，从头到尾。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['篮子', '手腕', '车站'], a: 2, kind: 'recall' },
      { q: '故事有哪三个部分？', opts: ['开头、中间、结尾', '问题、努力、答案', '人、地点、时间'], a: 1, kind: 'infer' },
      { q: '要把一件事讲完整，你会怎么做？', opts: ['只讲一句', '随便讲', '从头到尾按顺序讲，不漏部分'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b109', lv: 'L10', tag: '思考', title: 'A Better Question', zh: '更好的问题',
    emoji: '❓', color: '#F6C6C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「问一问」这条线，不引入新词，全部是读过的词。',
    trap: '桥梁书按自然段读：一句里先找「谁 + 做什么」，再把修饰部分补进去。',
    summary: '《更好的问题》是「问一问」：明明和奶奶在图书馆，围绕主意把一件事读到底。本本词卡：这一本不引入新词，全部是读过的词。读前先看词卡，读完合上书说一说。',
    retell: '不看书写一段 5 句的口头小结，再说说你同不同意。（这一本是「问一问」。）',
    think: '说说你问过的一个「更好的问题」。',
    pre: [
      { art: '👦', en: 'ming', zh: '明明' },
      { art: '📦', en: 'a', zh: 'a' }
    ],
    sight: [],
    newWords: [

    ],
    pages: [
      { art: 'library|ming,grandma|idea|·', en: 'Ming reads a hard sentence.', zh: '明明读到一个难句。' },
      { art: 'library|ming,grandma|idea|♪', en: 'The sentence does not make sense.', zh: '这个句子讲不通。' },
      { art: 'library|ming,grandma|idea|👀', en: 'Ming asks, "What does it mean?"', zh: '明明问：「它是什么意思？」' },
      { art: 'library|ming,grandma|idea|?', en: 'Grandma answers.', zh: '奶奶回答了。' },
      { art: 'library|ming,grandma|idea|·', en: 'But Ming still does not get it.', zh: '可明明还是没懂。' },
      { art: 'library|ming,grandma|idea|!', en: 'Ming asks a better question.', zh: '明明问了一个更好的问题。' },
      { art: 'library|ming,grandma|idea|♥', en: '"Which word is hard?" asks Ming.', zh: '「哪个词难懂？」明明问。' },
      { art: 'library|ming,grandma|idea|★', en: 'Grandma points to one word.', zh: '奶奶指着一个词。' },
      { art: 'library|ming,grandma|idea|…', en: 'Now Ming knows where it is hard.', zh: '现在明明知道难在哪儿了。' },
      { art: 'library|ming,grandma|idea|·', en: 'They talk about that one word.', zh: '他们只谈那一个词。' },
      { art: 'library|ming,grandma|idea|♥', en: 'The hard part gets clear.', zh: '难的地方清楚了。' },
      { art: 'library|ming,grandma|idea|·', en: 'The whole sentence is clear now.', zh: '整个句子现在清楚了。' },
      { art: 'library|ming,grandma|idea|…', en: 'A better question is a start.', zh: '更好的问题是个开始。' },
      { art: 'library|ming,grandma|idea|?', en: 'Ming writes down the question.', zh: '明明把问题写下来。' },
      { art: 'library|ming,grandma|idea|·', en: 'A better question is a better idea.', zh: '更好的问题是个更好的主意。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['乌龟', '开始', '世界'], a: 1, kind: 'recall' },
      { q: '明明问的「更好的问题」是什么？', opts: ['「这是什么意思？」', '「哪个词难懂？」', '「我该读吗？」'], a: 1, kind: 'infer' },
      { q: '看不懂一段话，你会怎么做？', opts: ['跳过去', '先找出具体哪个词或哪句卡住，再问', '整段问「这是什么意思」'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b110', lv: 'L10', tag: '观察', title: 'The Small Change', zh: '小小的变化',
    emoji: '🔍', color: '#F9DFB4',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「合上书讲一遍」这条线，不引入新词，全部是读过的词。',
    trap: '桥梁书按自然段读：一句里先找「谁 + 做什么」，再把修饰部分补进去。',
    summary: '《小小的变化》是「合上书讲一遍」：丽丽和爷爷在图书馆，围绕变化把一件事读到底。本本词卡：这一本不引入新词，全部是读过的词。读前先看词卡，读完合上书说一说。',
    retell: '不看书写一段 5 句的口头小结，再说说你同不同意。（这一本是「合上书讲一遍」。）',
    think: '说说你做过的一个小改变，它带来了什么。',
    pre: [
      { art: '🐭', en: 'small', zh: '小' },
      { art: '🔄', en: 'change', zh: '变化' }
    ],
    sight: [],
    newWords: [

    ],
    pages: [
      { art: 'library|lili,grandpa|change|·', en: 'A small change can do much.', zh: '一个小变化能起大作用。' },
      { art: 'library|lili,grandpa|change|♪', en: 'Ming changes one small thing.', zh: '明明改了一处小地方。' },
      { art: 'library|lili,grandpa|change|👀', en: 'At first, nothing seems different.', zh: '一开始，看着没什么不同。' },
      { art: 'library|lili,grandpa|change|?', en: 'Ming keeps going.', zh: '明明继续做。' },
      { art: 'library|lili,grandpa|change|·', en: 'Day by day, it adds up.', zh: '一天一天，慢慢累积。' },
      { art: 'library|lili,grandpa|change|!', en: 'After a while, it is different.', zh: '过了一阵子，就不一样了。' },
      { art: 'library|lili,grandpa|change|♥', en: 'The small change did it.', zh: '是那个小变化起的作用。' },
      { art: 'library|lili,grandpa|change|★', en: 'Ming is glad to keep going.', zh: '明明很高兴自己坚持了。' },
      { art: 'library|lili,grandpa|change|…', en: 'The small change.', zh: '小小的变化。' },
      { art: 'library|lili,grandpa|change|·', en: 'Big things can start small.', zh: '大事可以从小处开始。' },
      { art: 'library|lili,grandpa|change|♥', en: 'Ming makes another change.', zh: '明明又做了一处小改变。' },
      { art: 'library|lili,grandpa|change|·', en: 'It adds up again.', zh: '又在慢慢累积。' },
      { art: 'library|lili,grandpa|change|…', en: 'Small changes are strong.', zh: '小变化很有力量。' },
      { art: 'library|lili,grandpa|change|?', en: 'Ming sees how it works.', zh: '明明看到它是怎么起作用的。' },
      { art: 'library|lili,grandpa|change|·', en: 'A small change, a big day.', zh: '一个小变化，收获很大的一天。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['手腕', '第一', '村子'], a: 1, kind: 'recall' },
      { q: '小变化是怎么起作用的？', opts: ['一下就变了', '根本没用', '一天天累积，慢慢看出不同'], a: 2, kind: 'infer' },
      { q: '想让一件事慢慢变好，你会怎么做？', opts: ['每天改一点小地方，坚持下去', '一下全改', '不改了'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b111', lv: 'L10', tag: '习惯', title: 'A Habit Every Day', zh: '每天一个习惯',
    emoji: '📅', color: '#CDE7C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「猜一猜」这条线，认读 1 个新词。',
    trap: '桥梁书按自然段读：一句里先找「谁 + 做什么」，再把修饰部分补进去。',
    summary: '《每天一个习惯》是「猜一猜」：奶奶和妈妈在图书馆，围绕习惯把一件事读到底。本本词卡：习惯。读前先看词卡，读完合上书说一说。',
    retell: '不看书写一段 5 句的口头小结，再说说你同不同意。（这一本是「猜一猜」。）',
    think: '说说你正在养成的一个好习惯。',
    pre: [
      { art: '📅', en: 'habit', zh: '习惯' },
      { art: '📦', en: 'a', zh: 'a' },
      { art: '⏰', en: 'day', zh: '白天' }
    ],
    sight: ['friend'],
    newWords: [
      { w: 'habit', zh: '习惯' }
    ],
    pages: [
      { art: 'library|grandma,mom|habit|·', en: 'A habit is doing it every day.', zh: '习惯就是每天都做。' },
      { art: 'library|grandma,mom|habit|♪', en: 'Ming has a good habit.', zh: '明明有个好习惯。' },
      { art: 'library|grandma,mom|habit|👀', en: 'Every day, Ming reads.', zh: '每天，明明都读书。' },
      { art: 'library|grandma,mom|habit|?', en: 'Some days it is not easy.', zh: '有些天并不容易。' },
      { art: 'library|grandma,mom|habit|·', en: 'But Ming reads anyway.', zh: '可明明还是读。' },
      { art: 'library|grandma,mom|habit|!', en: 'Day after day, Ming reads.', zh: '一天又一天，明明读着。' },
      { art: 'library|grandma,mom|habit|♥', en: 'The habit gets strong.', zh: '习惯变强了。' },
      { art: 'library|grandma,mom|habit|★', en: 'Reading gets easier.', zh: '读书变得容易了。' },
      { art: 'library|grandma,mom|habit|…', en: 'A habit every day.', zh: '每天一个习惯。' },
      { art: 'library|grandma,mom|habit|·', en: 'Good habits help us grow.', zh: '好习惯帮我们成长。' },
      { art: 'library|grandma,mom|habit|♥', en: 'Ming is glad of the habit.', zh: '明明庆幸有这个习惯。' },
      { art: 'library|grandma,mom|habit|·', en: 'Ming will keep the habit.', zh: '明明会保持这个习惯。' },
      { art: 'library|grandma,mom|habit|…', en: 'A habit is a friend.', zh: '习惯是个朋友。' },
      { art: 'library|grandma,mom|habit|?', en: 'Small days make a big habit.', zh: '小小的每天，养成大习惯。' },
      { art: 'library|grandma,mom|habit|·', en: 'A habit every day.', zh: '每天一个习惯。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['朋友', '鲸', '行动'], a: 0, kind: 'recall' },
      { q: '习惯是怎么养成的？', opts: ['做一次就行', '想做就做', '每天都做，慢慢就强了'], a: 2, kind: 'infer' },
      { q: '想养成一个好习惯，你会怎么做？', opts: ['三天打鱼两天晒网', '不做', '每天做一点，坚持下去'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b112', lv: 'L10', tag: '发现', title: 'What We Discovered', zh: '我们的发现',
    emoji: '💡', color: '#C6DEF6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「记住它」这条线，不引入新词，全部是读过的词。',
    trap: '桥梁书按自然段读：一句里先找「谁 + 做什么」，再把修饰部分补进去。',
    summary: '《我们的发现》是「记住它」：爷爷和爸爸在图书馆，围绕计划把一件事读到底。本本词卡：这一本不引入新词，全部是读过的词。读前先看词卡，读完合上书说一说。',
    retell: '不看书写一段 5 句的口头小结，再说说你同不同意。（这一本是「记住它」。）',
    think: '说说你通过动手弄清楚的一件事。',
    pre: [
      { art: '👦', en: 'ming', zh: '明明' },
      { art: '📝', en: 'plan', zh: '计划' }
    ],
    sight: [],
    newWords: [

    ],
    pages: [
      { art: 'library|grandpa,dad|plan|·', en: 'Ming wants to find out something.', zh: '明明想弄清一件事。' },
      { art: 'library|grandpa,dad|plan|♪', en: 'Ming makes a plan.', zh: '明明订了个计划。' },
      { art: 'library|grandpa,dad|plan|👀', en: 'The plan says what to do.', zh: '计划上写着怎么做。' },
      { art: 'library|grandpa,dad|plan|?', en: 'Ming follows the plan.', zh: '明明按计划做。' },
      { art: 'library|grandpa,dad|plan|·', en: 'Some things go well.', zh: '有些地方很顺。' },
      { art: 'library|grandpa,dad|plan|!', en: 'Some things do not.', zh: '有些地方不顺。' },
      { art: 'library|grandpa,dad|plan|♥', en: 'Ming changes the plan a little.', zh: '明明把计划改了一点。' },
      { art: 'library|grandpa,dad|plan|★', en: 'Ming goes on.', zh: '明明继续做。' },
      { art: 'library|grandpa,dad|plan|…', en: 'At last, Ming finds it out.', zh: '最后，明明弄清楚了。' },
      { art: 'library|grandpa,dad|plan|·', en: 'What we discovered.', zh: '我们的发现。' },
      { art: 'library|grandpa,dad|plan|♥', en: 'The plan helped a lot.', zh: '计划帮了大忙。' },
      { art: 'library|grandpa,dad|plan|·', en: 'But changing it helped too.', zh: '但改一改也有帮助。' },
      { art: 'library|grandpa,dad|plan|…', en: 'Ming writes down what we found.', zh: '明明把发现写下来。' },
      { art: 'library|grandpa,dad|plan|?', en: 'A good plan can change.', zh: '好计划也可以改。' },
      { art: 'library|grandpa,dad|plan|·', en: 'We discovered much today.', zh: '今天我们发现了好多。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['书包', '工人', '变化'], a: 2, kind: 'recall' },
      { q: '明明是怎么弄清楚的？', opts: ['订了计划，做不通就改一改，继续做', '等别人告诉', '随便乱试'], a: 0, kind: 'infer' },
      { q: '想弄清一件事，你会怎么做？', opts: ['没有计划乱做', '订个计划，做不通就调整，坚持', '不弄了'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b113', lv: 'L10', tag: '耐心', title: 'The Patience to Wait', zh: '等待的耐心',
    emoji: '⏳', color: '#E0CFF3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「排排顺序」这条线，认读 3 个新词。',
    trap: '桥梁书按自然段读：一句里先找「谁 + 做什么」，再把修饰部分补进去。',
    summary: '《等待的耐心》是「排排顺序」：妈妈和明明在图书馆，围绕耐心把一件事读到底。本本词卡：记忆、耐心、力量。读前先看词卡，读完合上书说一说。',
    retell: '不看书写一段 5 句的口头小结，再说说你同不同意。（这一本是「排排顺序」。）',
    think: '说说一次「放松后反而想起来了」的经历。',
    pre: [
      { art: '🧠', en: 'memory', zh: '记忆' },
      { art: '💡', en: 'patience', zh: '耐心' },
      { art: '💡', en: 'strength', zh: '力量' },
      { art: '👦', en: 'ming', zh: '明明' },
      { art: '📦', en: 'a', zh: 'a' }
    ],
    sight: [],
    newWords: [
      { w: 'memory', zh: '记忆' },
      { w: 'patience', zh: '耐心' },
      { w: 'strength', zh: '力量' }
    ],
    pages: [
      { art: 'library|mom,ming|patience|·', en: 'Waiting can be hard.', zh: '等待有时很难。' },
      { art: 'library|mom,ming|patience|♪', en: 'Ming waits for a memory to come.', zh: '明明等一段记忆浮上来。' },
      { art: 'library|mom,ming|patience|👀', en: 'It does not come at first.', zh: '一开始它没来。' },
      { art: 'library|mom,ming|patience|?', en: 'Trying hard does not help.', zh: '使劲想反而想不起来。' },
      { art: 'library|mom,ming|patience|·', en: 'Ming lets go a little.', zh: '明明稍微放松一点。' },
      { art: 'library|mom,ming|patience|!', en: 'Ming thinks of something else.', zh: '明明想点别的。' },
      { art: 'library|mom,ming|patience|♥', en: 'Then the memory comes back.', zh: '然后，记忆回来了。' },
      { art: 'library|mom,ming|patience|★', en: 'It was there all along.', zh: '它一直都在。' },
      { art: 'library|mom,ming|patience|…', en: 'The patience to wait.', zh: '等待的耐心。' },
      { art: 'library|mom,ming|patience|·', en: 'Some things come when we wait.', zh: '有些东西，等一等就来了。' },
      { art: 'library|mom,ming|patience|♥', en: 'Ming is glad he waited.', zh: '明明庆幸自己等了。' },
      { art: 'library|mom,ming|patience|·', en: 'Patience is a kind of strength.', zh: '耐心是一种力量。' },
      { art: 'library|mom,ming|patience|…', en: 'Ming will remember this.', zh: '明明会记住这一点。' },
      { art: 'library|mom,ming|patience|?', en: 'The memory is safe now.', zh: '记忆现在回来了。' },
      { art: 'library|mom,ming|patience|·', en: 'Waiting has its own work.', zh: '等待也有等待的功夫。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['记忆', '空气', '长椅'], a: 0, kind: 'recall' },
      { q: '记忆是怎么回来的？', opts: ['放松、想点别的，它自己回来了', '永远不会回来', '使劲想就想起来了'], a: 0, kind: 'infer' },
      { q: '怎么想也想不起来，你会怎么做？', opts: ['一直使劲想', '先放松，做点别的，它会自己回来', '算了不管'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b114', lv: 'L10', tag: '思考', title: 'Two Sides of a Problem', zh: '问题的两面',
    emoji: '⚖️', color: '#F6C9E3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「多练一练」这条线，认读 1 个新词。',
    trap: '桥梁书按自然段读：一句里先找「谁 + 做什么」，再把修饰部分补进去。',
    summary: '《问题的两面》是「多练一练」：爸爸和丽丽在图书馆，围绕问题把一件事读到底。本本词卡：问题。读前先看词卡，读完合上书说一说。',
    retell: '不看书写一段 5 句的口头小结，再说说你同不同意。（这一本是「多练一练」。）',
    think: '说说你换个角度就看明白的一件事。',
    pre: [
      { art: '🧩', en: 'problem', zh: '问题' },
      { art: '👦', en: 'ming', zh: '明明' },
      { art: '📦', en: 'looks', zh: 'looks' }
    ],
    sight: [],
    newWords: [
      { w: 'problem', zh: '问题' }
    ],
    pages: [
      { art: 'library|dad,lili|problem|·', en: 'A problem has two sides.', zh: '一个问题有两面。' },
      { art: 'library|dad,lili|problem|♪', en: 'Ming looks at one side.', zh: '明明看着一面。' },
      { art: 'library|dad,lili|problem|👀', en: 'It looks hard.', zh: '看着很难。' },
      { art: 'library|dad,lili|problem|?', en: 'Then Ming looks at the other side.', zh: '然后明明看另一面。' },
      { art: 'library|dad,lili|problem|·', en: 'This side looks easier.', zh: '这一面看着容易些。' },
      { art: 'library|dad,lili|problem|!', en: 'Both sides are the same problem.', zh: '两面是同一个问题。' },
      { art: 'library|dad,lili|problem|♥', en: 'The way you look matters.', zh: '怎么看很重要。' },
      { art: 'library|dad,lili|problem|★', en: 'Ming looks from both sides.', zh: '明明两面都看了。' },
      { art: 'library|dad,lili|problem|…', en: 'Now the problem is clear.', zh: '现在问题清楚了。' },
      { art: 'library|dad,lili|problem|·', en: 'Two sides of a problem.', zh: '问题的两面。' },
      { art: 'library|dad,lili|problem|♥', en: 'Ming knows what to do now.', zh: '明明知道该怎么做了。' },
      { art: 'library|dad,lili|problem|·', en: 'Looking from two sides helps.', zh: '从两面看有帮助。' },
      { art: 'library|dad,lili|problem|…', en: 'Ming will look at both sides.', zh: '明明会两面都看。' },
      { art: 'library|dad,lili|problem|?', en: 'A problem is not so hard now.', zh: '问题现在没那么难了。' },
      { art: 'library|dad,lili|problem|·', en: 'Two sides, one answer.', zh: '两面，一个答案。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['看', '沙滩', '脑子'], a: 0, kind: 'recall' },
      { q: '为什么从两面看有帮助？', opts: ['因为问题变小了', '因为别人帮忙了', '换个角度看，问题会变清楚'], a: 2, kind: 'infer' },
      { q: '一个问题看着很难，你会怎么做？', opts: ['只盯着一面想', '换个角度、从另一面看看它', '不做了'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b115', lv: 'L10', tag: '坚持', title: 'Tomorrow We Begin Again', zh: '明天重新开始',
    emoji: '🌅', color: '#BFE6DF',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「问一问」这条线，认读 2 个新词。',
    trap: '桥梁书按自然段读：一句里先找「谁 + 做什么」，再把修饰部分补进去。',
    summary: '《明天重新开始》是「问一问」：明明和奶奶在图书馆，围绕约定把一件事读到底。本本词卡：约定、自己。读前先看词卡，读完合上书说一说。',
    retell: '不看书写一段 5 句的口头小结，再说说你同不同意。（这一本是「问一问」。）',
    think: '说说一次你「明天重新开始」的经历。',
    pre: [
      { art: '🤝', en: 'promise', zh: '约定' },
      { art: '💡', en: 'oneself', zh: '自己' },
      { art: '📦', en: 'a', zh: 'a' },
      { art: '👦', en: 'ming', zh: '明明' }
    ],
    sight: [],
    newWords: [
      { w: 'promise', zh: '约定' },
      { w: 'oneself', zh: '自己' }
    ],
    pages: [
      { art: 'library|ming,grandma|promise|·', en: 'Today was a hard day.', zh: '今天是很难的一天。' },
      { art: 'library|ming,grandma|promise|♪', en: 'Some things did not work.', zh: '有些事没做好。' },
      { art: 'library|ming,grandma|promise|👀', en: 'Ming feels tired.', zh: '明明觉得累。' },
      { art: 'library|ming,grandma|promise|?', en: 'But the day is over.', zh: '可这一天过去了。' },
      { art: 'library|ming,grandma|promise|·', en: 'Tomorrow we begin again.', zh: '明天我们重新开始。' },
      { art: 'library|ming,grandma|promise|!', en: 'Ming makes a promise.', zh: '明明许了个约定。' },
      { art: 'library|ming,grandma|promise|♥', en: 'The promise is to try again.', zh: '约定是再试一次。' },
      { art: 'library|ming,grandma|promise|★', en: 'Tomorrow is a new day.', zh: '明天是新的一天。' },
      { art: 'library|ming,grandma|promise|…', en: 'Ming rests now.', zh: '明明现在休息。' },
      { art: 'library|ming,grandma|promise|·', en: 'Tomorrow we begin again.', zh: '明天我们重新开始。' },
      { art: 'library|ming,grandma|promise|♥', en: 'A promise to oneself is strong.', zh: '给自己的约定很有力。' },
      { art: 'library|ming,grandma|promise|·', en: 'Ming will keep the promise.', zh: '明明会守住约定。' },
      { art: 'library|ming,grandma|promise|…', en: 'Hard days do not last.', zh: '难过的日子不会一直。' },
      { art: 'library|ming,grandma|promise|?', en: 'New days come.', zh: '新的日子会来。' },
      { art: 'library|ming,grandma|promise|·', en: 'Tomorrow, we begin again.', zh: '明天，我们重新开始。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['床', '约定', '面包'], a: 1, kind: 'recall' },
      { q: '明明许了什么约定？', opts: ['明天再试一次', '今天就放弃', '什么都不做'], a: 0, kind: 'infer' },
      { q: '今天做得很不顺，你会怎么做？', opts: ['休息一下，明天重新开始', '一直懊恼', '再也不做了'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b116', lv: 'L10', tag: '坚持', title: 'A Journey of Small Steps', zh: '一小步一小步',
    emoji: '👣', color: '#F2E2A8',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「合上书讲一遍」这条线，认读 1 个新词。',
    trap: '桥梁书按自然段读：一句里先找「谁 + 做什么」，再把修饰部分补进去。',
    summary: '《一小步一小步》是「合上书讲一遍」：丽丽和爷爷在图书馆，围绕旅程把一件事读到底。本本词卡：旅程。读前先看词卡，读完合上书说一说。',
    retell: '不看书写一段 5 句的口头小结，再说说你同不同意。（这一本是「合上书讲一遍」。）',
    think: '说说你一小步一小步做成的一件事。',
    pre: [
      { art: '🛤️', en: 'journey', zh: '旅程' },
      { art: '🐭', en: 'small', zh: '小' },
      { art: '👦', en: 'ming', zh: '明明' }
    ],
    sight: [],
    newWords: [
      { w: 'journey', zh: '旅程' }
    ],
    pages: [
      { art: 'library|lili,grandpa|journey|·', en: 'A long way starts with small steps.', zh: '长路从一小步一小步开始。' },
      { art: 'library|lili,grandpa|journey|♪', en: 'Ming takes one small step.', zh: '明明迈了一小步。' },
      { art: 'library|lili,grandpa|journey|👀', en: 'It seems too small.', zh: '这一步看着太小了。' },
      { art: 'library|lili,grandpa|journey|?', en: 'But Ming takes another.', zh: '可明明又迈了一步。' },
      { art: 'library|lili,grandpa|journey|·', en: 'Step by step, Ming goes on.', zh: '一步一步，明明走下去。' },
      { art: 'library|lili,grandpa|journey|!', en: 'The small steps add up.', zh: '小步子累积起来。' },
      { art: 'library|lili,grandpa|journey|♥', en: 'After a while, Ming looks back.', zh: '过了一阵子，明明回头看。' },
      { art: 'library|lili,grandpa|journey|★', en: 'Ming has come far.', zh: '明明已经走了很远。' },
      { art: 'library|lili,grandpa|journey|…', en: 'A journey of small steps.', zh: '一小步一小步的旅程。' },
      { art: 'library|lili,grandpa|journey|·', en: 'No step is too small.', zh: '没有哪一步是白费的。' },
      { art: 'library|lili,grandpa|journey|♥', en: 'Ming keeps walking.', zh: '明明继续走。' },
      { art: 'library|lili,grandpa|journey|·', en: 'The long way gets shorter.', zh: '长路变得短了些。' },
      { art: 'library|lili,grandpa|journey|…', en: 'Small steps, long way.', zh: '小步子，长路。' },
      { art: 'library|lili,grandpa|journey|?', en: 'Ming is proud of the way.', zh: '明明为这条路自豪。' },
      { art: 'library|lili,grandpa|journey|·', en: 'The journey goes on.', zh: '旅程继续着。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['底部', '迈步', '小汽车'], a: 1, kind: 'recall' },
      { q: '明明是怎么走完长路的？', opts: ['一小步一小步，慢慢累积', '一下就跳到终点', '别人背他走的'], a: 0, kind: 'infer' },
      { q: '一件很难很远的事，你会怎么做？', opts: ['等别人做', '看着太远就不做', '拆成小步子，一步一步做'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b117', lv: 'L10', tag: '发音', title: 'Say It: A Whole Sentence', zh: '说一说：整句的节奏',
    emoji: '🗣️', color: '#D9D2F5',
    track: 'drill',
    goal: '把本级难点音听准、说准，并能在整句里读对。这一本走「跟读整句」这条线，认读 1 个新词。',
    trap: '桥梁书按自然段读：一句里先找「谁 + 做什么」，再把修饰部分补进去。',
    summary: '《说一说：整句的节奏》是「跟读整句」：奶奶和妈妈在家，围绕原因把一件事读到底。本本词卡：原因。读前先看词卡，读完合上书说一说。',
    retell: '不看书写一段 5 句的口头小结，再说说你同不同意。（这一本是「跟读整句」。）',
    think: '说说你是怎么读一个长句子的。',
    pre: [
      { art: '🧩', en: 'reason', zh: '原因' },
      { art: '✨', en: 'whole', zh: '整个' },
      { art: '📦', en: 'sentence', zh: 'sentence' }
    ],
    sight: ['thought'],
    newWords: [
      { w: 'reason', zh: '原因' }
    ],
    pages: [
      { art: 'table|grandma,mom|reason|·', en: 'A whole sentence has words.', zh: '一个完整的句子有词。' },
      { art: 'table|grandma,mom|reason|♪', en: 'But a sentence is not just words.', zh: '可句子不只是词。' },
      { art: 'table|grandma,mom|reason|👀', en: 'The words work together.', zh: '词是合在一起的。' },
      { art: 'table|grandma,mom|reason|?', en: 'Some words go in front.', zh: '有些词在前面。' },
      { art: 'table|grandma,mom|reason|·', en: 'Some words go after.', zh: '有些词在后面。' },
      { art: 'table|grandma,mom|reason|!', en: 'Together, they make sense.', zh: '合在一起，才有意思。' },
      { art: 'table|grandma,mom|reason|♥', en: 'Read the whole sentence.', zh: '读整个句子。' },
      { art: 'table|grandma,mom|reason|★', en: 'Do not read word by word.', zh: '不要一个词一个词读。' },
      { art: 'table|grandma,mom|reason|…', en: 'Say the whole sentence.', zh: '说整个句子。' },
      { art: 'table|grandma,mom|reason|·', en: 'The reason is simple.', zh: '原因很简单。' },
      { art: 'table|grandma,mom|reason|♥', en: 'A whole sentence is a whole thought.', zh: '完整的句子是一个完整的想法。' },
      { art: 'table|grandma,mom|reason|·', en: 'Read it as one.', zh: '把它当一个整体读。' },
      { art: 'table|grandma,mom|reason|…', en: 'You can say it well.', zh: '你能读好它。' },
      { art: 'table|grandma,mom|reason|?', en: 'A whole sentence.', zh: '一个完整的句子。' },
      { art: 'table|grandma,mom|reason|·', en: 'Read it all at once.', zh: '一次读完整句。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['手推车', '原因', '外套'], a: 1, kind: 'recall' },
      { q: '为什么不该一个词一个词读？', opts: ['词是合在一起的，要当一个整体读', '因为词太长', '因为会读错'], a: 0, kind: 'infer' },
      { q: '读一个长句子，你会怎么读？', opts: ['只读一半', '把它当一个整体，连起来读', '一个词一个词蹦'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b118', lv: 'L10', tag: '小知识', title: 'Why Practice Works', zh: '练习为什么有用',
    emoji: '📈', color: '#FAD3B6',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。这一本走「问一问」这条线，认读 1 个新词。',
    trap: '桥梁书按自然段读：一句里先找「谁 + 做什么」，再把修饰部分补进去。',
    summary: '《练习为什么有用》是「问一问」：爷爷和爸爸在图书馆，围绕回答把一件事读到底。本本词卡：脑子。读前先看词卡，读完合上书说一说。',
    retell: '不看书写一段 5 句的口头小结，再说说你同不同意。（这一本是「问一问」。）',
    think: '说说练习是怎么让你变好的。',
    pre: [
      { art: '✋', en: 'brain', zh: '脑子' },
      { art: '🏃', en: 'practice', zh: '练习' },
      { art: '📦', en: 'the', zh: 'the' }
    ],
    sight: [],
    newWords: [
      { w: 'brain', zh: '脑子' }
    ],
    pages: [
      { art: 'library|grandpa,dad|answer|·', en: 'Practice makes us better.', zh: '练习让我们变好。' },
      { art: 'library|grandpa,dad|answer|♪', en: 'But why does practice work?', zh: '可为什么练习有用？' },
      { art: 'library|grandpa,dad|answer|👀', en: 'When we practice, the brain learns.', zh: '练习的时候，脑子在学。' },
      { art: 'library|grandpa,dad|answer|?', en: 'Doing it again makes a path.', zh: '再做一次，就走出一条路。' },
      { art: 'library|grandpa,dad|answer|·', en: 'The path gets easy to follow.', zh: '这条路越来越好走。' },
      { art: 'library|grandpa,dad|answer|!', en: 'Practice is the answer.', zh: '练习就是答案。' },
      { art: 'library|grandpa,dad|answer|♥', en: 'Ming practices every day.', zh: '明明每天练习。' },
      { art: 'library|grandpa,dad|answer|★', en: 'It gets easier and easier.', zh: '越来越容易。' },
      { art: 'library|grandpa,dad|answer|…', en: 'Why practice works.', zh: '练习为什么有用。' },
      { art: 'library|grandpa,dad|answer|·', en: 'Practice is not just doing.', zh: '练习不只是做。' },
      { art: 'library|grandpa,dad|answer|♥', en: 'Practice is making a path.', zh: '练习是在走出一条路。' },
      { art: 'library|grandpa,dad|answer|·', en: 'Ming keeps practicing.', zh: '明明继续练习。' },
      { art: 'library|grandpa,dad|answer|…', en: 'The path is strong now.', zh: '这条路现在很结实。' },
      { art: 'library|grandpa,dad|answer|?', en: 'Practice works.', zh: '练习有用。' },
      { art: 'library|grandpa,dad|answer|·', en: 'Keep practicing.', zh: '继续练下去。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['小鸡', '小路', '国家'], a: 1, kind: 'recall' },
      { q: '练习为什么有用？', opts: ['反复做，脑子会走出一条好走的路', '因为别人看着', '因为练习很快'], a: 0, kind: 'infer' },
      { q: '练一样东西觉得没进步，你会怎么做？', opts: ['不练了', '继续练，它在慢慢成路', '换一样'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b119', lv: 'L10', tag: '小知识', title: 'Small Steps, Long Way', zh: '小步子，长路',
    emoji: '🛤️', color: '#C8E7F0',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。这一本走「合上书讲一遍」这条线，认读 2 个新词。',
    trap: '桥梁书按自然段读：一句里先找「谁 + 做什么」，再把修饰部分补进去。',
    summary: '《小步子，长路》是「合上书讲一遍」：妈妈和明明在图书馆，围绕将来把一件事读到底。本本词卡：节奏、将来。读前先看词卡，读完合上书说一说。',
    retell: '不看书写一段 5 句的口头小结，再说说你同不同意。（这一本是「合上书讲一遍」。）',
    think: '说说你用「稳稳的小步子」做成的一件事。',
    pre: [
      { art: '💡', en: 'pace', zh: '节奏' },
      { art: '🔮', en: 'future', zh: '将来' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '🐭', en: 'small', zh: '小' }
    ],
    sight: [],
    newWords: [
      { w: 'pace', zh: '节奏' },
      { w: 'future', zh: '将来' }
    ],
    pages: [
      { art: 'library|mom,ming|future|·', en: 'Some steps are small.', zh: '有些步子很小。' },
      { art: 'library|mom,ming|future|♪', en: 'The way is long.', zh: '路很长。' },
      { art: 'library|mom,ming|future|👀', en: 'Ming takes a small step.', zh: '明明迈了一小步。' },
      { art: 'library|mom,ming|future|?', en: 'Then another small step.', zh: '又迈了一小步。' },
      { art: 'library|mom,ming|future|·', en: 'The small steps are steady.', zh: '小步子很稳。' },
      { art: 'library|mom,ming|future|!', en: 'The long way is fine.', zh: '长路也没那么可怕。' },
      { art: 'library|mom,ming|future|♥', en: 'Ming does not rush.', zh: '明明不着急。' },
      { art: 'library|mom,ming|future|★', en: 'Steady steps go far.', zh: '稳稳的步子走得远。' },
      { art: 'library|mom,ming|future|…', en: 'Small steps, long way.', zh: '小步子，长路。' },
      { art: 'library|mom,ming|future|·', en: 'Ming keeps the pace.', zh: '明明保持着节奏。' },
      { art: 'library|mom,ming|future|♥', en: 'The way goes to the future.', zh: '这条路通向未来。' },
      { art: 'library|mom,ming|future|·', en: 'Rushing is not the answer.', zh: '急着赶不是办法。' },
      { art: 'library|mom,ming|future|…', en: 'Steady is better.', zh: '稳一点更好。' },
      { art: 'library|mom,ming|future|?', en: 'Ming walks on.', zh: '明明继续走。' },
      { art: 'library|mom,ming|future|·', en: 'Small steps, long way.', zh: '小步子，长路。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['小鸡', '国家', '将来'], a: 2, kind: 'recall' },
      { q: '明明是怎么走完长路的？', opts: ['一路小跑', '坐车', '稳稳地、一小步一小步走'], a: 2, kind: 'infer' },
      { q: '路很长、任务很大，你会怎么做？', opts: ['不做', '急着一下做完', '稳住节奏，一小步一小步来'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b120', lv: 'L10', tag: '复习', title: 'The Whole Idea', zh: '完整的想法',
    emoji: '🧠', color: '#E8D9B5',
    track: 'review',
    goal: '把本级和前面级别的词再读一遍、串成一个故事。这一本走「猜一猜」这条线，不引入新词，全部是读过的词。',
    trap: '桥梁书按自然段读：一句里先找「谁 + 做什么」，再把修饰部分补进去。',
    summary: '《完整的想法》是「猜一猜」：爸爸和丽丽在图书馆，围绕主意把一件事读到底。本本词卡：这一本不引入新词，全部是读过的词。读前先看词卡，读完合上书说一说。',
    retell: '不看书写一段 5 句的口头小结，再说说你同不同意。（这一本是「猜一猜」。）',
    think: '说说你的一个想法是怎么变清楚的。',
    pre: [
      { art: '💡', en: 'idea', zh: '主意' },
      { art: '📦', en: 'the', zh: 'the' }
    ],
    sight: [],
    newWords: [

    ],
    pages: [
      { art: 'library|dad,lili|idea|·', en: 'Ming had a big idea.', zh: '明明有个大想法。' },
      { art: 'library|dad,lili|idea|♪', en: 'At first it was not clear.', zh: '一开始它不清楚。' },
      { art: 'library|dad,lili|idea|👀', en: 'Ming talked about it.', zh: '明明说起它。' },
      { art: 'library|dad,lili|idea|?', en: 'The idea got clearer.', zh: '想法变清楚了。' },
      { art: 'library|dad,lili|idea|·', en: 'Ming wrote it down.', zh: '明明写下来。' },
      { art: 'library|dad,lili|idea|!', en: 'The whole idea was there.', zh: '整个想法都在那儿了。' },
      { art: 'library|dad,lili|idea|♥', en: 'It took time to grow.', zh: '它需要时间长大。' },
      { art: 'library|dad,lili|idea|★', en: 'But the idea was whole.', zh: '可这个想法是完整的。' },
      { art: 'library|dad,lili|idea|…', en: 'The whole idea.', zh: '完整的想法。' },
      { art: 'library|dad,lili|idea|·', en: 'Good ideas need time.', zh: '好想法需要时间。' },
      { art: 'library|dad,lili|idea|♥', en: 'Ming keeps the idea safe.', zh: '明明把想法收好。' },
      { art: 'library|dad,lili|idea|·', en: 'The idea will help others.', zh: '这个想法会帮到别人。' },
      { art: 'library|dad,lili|idea|…', en: 'The whole idea, start to end.', zh: '完整的想法，从头到尾。' },
      { art: 'library|dad,lili|idea|?', en: 'Ming is glad of the idea.', zh: '明明庆幸有这个想法。' },
      { art: 'library|dad,lili|idea|·', en: 'Ideas can change things.', zh: '想法能改变事情。' }
    ],
    quiz: [
      { q: '这一本里出现了下面哪一样？', opts: ['盘子', '好', '玉米'], a: 1, kind: 'recall' },
      { q: '想法是怎么变清楚的？', opts: ['一下就想清楚了', '说着说着、写着写着，慢慢清楚了', '别人给的'], a: 1, kind: 'infer' },
      { q: '有一个想法但还很模糊，你会怎么做？', opts: ['马上丢掉', '不说', '说出来、写下来，让它慢慢清楚'], a: 2, kind: 'transfer' }
    ]
  }
];

window.BOOKS = BOOKS;
