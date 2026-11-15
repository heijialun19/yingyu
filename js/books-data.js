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
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「找回来」这条线，认读 3 个新词。',
    trap: '这一级是整体认读：词不用拼，先听整句，再跟着说；别一个字母一个字母念。',
    summary: '《我的帽子》是「找回来」：明明和奶奶在家，围绕帽子把一件事读到底。本本词卡：帽子、杯子、书包。读前先看词卡，读完合上书说一说。',
    retell: '看图说词：指一指，用英文大声说出这一页的东西。（这一本是「找回来」。）',
    think: '说一说你有没有把东西放忘了的时候：先说在哪儿丢的，再说最后在哪儿找到。',
    pre: [
      { art: '🎩', en: 'hat', zh: '帽子' },
      { art: '🥛', en: 'cup', zh: '杯子' },
      { art: '🎒', en: 'bag', zh: '书包' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'is', zh: 'is' }
    ],
    sight: [],
    newWords: [
      { w: 'hat', zh: '帽子' },
      { w: 'cup', zh: '杯子' },
      { w: 'bag', zh: '书包' }
    ],
    pages: [
      { art: 'home|ming,grandma|hat|·', en: 'Ming and Grandma are at home.', zh: '明明和奶奶在家。' },
      { art: 'home|ming,grandma|hat|♪', en: 'Ming wants a hat.', zh: '明明想要帽子。' },
      { art: 'home|ming,grandma|hat|👀', en: 'They look at the book and the box. We say hat, cup and bag.', zh: '他们看看书和盒子。我们说一说：帽子、杯子和书包。' },
      { art: 'home|ming,grandma|hat|?', en: '"Where is my hat?" asks Ming.', zh: '「我的帽子呢？」明明问。' },
      { art: 'home|ming,grandma|hat|★', en: 'There it is! The hat was at home all along. Here is a hat. Here is a cup.', zh: '在那儿！帽子一直在家。这是帽子，这是杯子。' },
      { art: 'home|ming,grandma|hat|·', en: 'They put the hat back where it belongs.', zh: '他们把帽子放回原处。' }
    ],
    quiz: [
      { q: '明明和奶奶的这一本里，出现了下面哪一样？', opts: ['苹果', '朋友', '帽子'], a: 2, kind: 'recall' },
      { q: '读到最后之前，你猜明明他们接下来会怎么样？', opts: ['回头再慢慢找一遍，就在家找到了', '把东西丢下不管了', '跳过中间那几页'], a: 0, kind: 'infer' },
      { q: '如果你的帽子找不到了，你会先做什么？', opts: ['先回到最开始的地方慢慢找一遍', '不找了，直接走开', '马上再买一个新的'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b2', lv: 'L1', tag: '宠物', title: 'My Cat', zh: '我的猫',
    emoji: '🐱', color: '#F9DFB4',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「合上书讲一遍」这条线，认读 2 个新词。',
    trap: '这一级是整体认读：词不用拼，先听整句，再跟着说；别一个字母一个字母念。',
    summary: '《我的猫》是「合上书讲一遍」：丽丽和爷爷在图书馆，围绕猫把一件事读到底。本本词卡：图书馆、猫。读前先看词卡，读完合上书说一说。',
    retell: '看图说词：指一指，用英文大声说出这一页的东西。（这一本是「合上书讲一遍」。）',
    think: '合上书，用「谁 → 在哪儿 → 出了什么事 → 结果」把猫这一本讲给家长听。',
    pre: [
      { art: '📚', en: 'library', zh: '图书馆' },
      { art: '🐱', en: 'cat', zh: '猫' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👧', en: 'lili', zh: '丽丽' }
    ],
    sight: [],
    newWords: [
      { w: 'library', zh: '图书馆' },
      { w: 'cat', zh: '猫' }
    ],
    pages: [
      { art: 'library|lili,grandpa|cat|·', en: 'Lili has just finished a book in the library.', zh: '丽丽刚在图书馆读完一本书。' },
      { art: 'library|lili,grandpa|cat|♪', en: 'Grandpa wants to hear all about it.', zh: '爷爷想听他讲讲。' },
      { art: 'library|lili,grandpa|cat|👀', en: 'Lili thinks about the cat in the book. We say cat, one and cup.', zh: '丽丽想着书里的猫。我们说一说：猫、一和杯子。' },
      { art: 'library|lili,grandpa|cat|?', en: '"Where do I start?" asks Lili.', zh: '「从哪儿讲起？」丽丽问。' },
      { art: 'library|lili,grandpa|cat|★', en: 'This time Grandpa can see the whole thing. Here is a cat. Here is an one.', zh: '这回爷爷全听明白了。这是猫，这是一。' },
      { art: 'library|lili,grandpa|cat|·', en: 'Tomorrow they will read about a box.', zh: '明天他们要读讲盒子的书。' }
    ],
    quiz: [
      { q: '在图书馆读的这一本里，有下面哪一样？', opts: ['爸爸', '猫', '妈妈'], a: 1, kind: 'recall' },
      { q: '读到最后之前，你猜丽丽他们接下来会怎么样？', opts: ['换一本书不读了', '按「谁 → 在哪儿 → 出了什么事」重讲一遍，别人就听懂了', '一直重复原来那个动作'], a: 1, kind: 'infer' },
      { q: '要把讲猫的这本读过的书讲给别人听，你会怎么开头？', opts: ['先报书名和生词表', '先说谁、在哪儿，再按顺序说出了什么事', '直接从最精彩的那句开始'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b3', lv: 'L1', tag: '颜色', title: 'Red and Blue', zh: '红和蓝',
    emoji: '🎨', color: '#CDE7C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「猜一猜」这条线，认读 2 个新词。',
    trap: '这一级是整体认读：词不用拼，先听整句，再跟着说；别一个字母一个字母念。',
    summary: '《红和蓝》是「猜一猜」：奶奶和妈妈在图书馆，围绕红色把一件事读到底。本本词卡：想、猜。读前先看词卡，读完合上书说一说。',
    retell: '看图说词：指一指，用英文大声说出这一页的东西。（这一本是「猜一猜」。）',
    think: '说说你猜过又查证的一件事：猜对了吗？',
    pre: [
      { art: '🏃', en: 'think', zh: '想' },
      { art: '🏃', en: 'guess', zh: '猜' },
      { art: '📦', en: 'they', zh: 'they' },
      { art: '📦', en: 'the', zh: 'the' }
    ],
    sight: [],
    newWords: [
      { w: 'think', zh: '想' },
      { w: 'guess', zh: '猜' }
    ],
    pages: [
      { art: 'library|grandma,mom|red|·', en: 'They do not know the answer.', zh: '他们不知道答案。' },
      { art: 'library|grandma,mom|red|♪', en: 'They want to find out about the red.', zh: '他们想弄清楚红色。' },
      { art: 'library|grandma,mom|red|👀', en: 'They look at the question. We say red, one and grandma.', zh: '他们看看这个问题。我们说一说：红色、一和奶奶。' },
      { art: 'library|grandma,mom|red|?', en: '"What do you think?" asks Mom.', zh: '「你怎么想？」妈妈问。' },
      { art: 'library|grandma,mom|red|★', en: 'This time the guess is right. Here is a red. Here is an one.', zh: '这次猜对了。这是红色，这是一。' },
      { art: 'library|grandma,mom|red|·', en: 'They have a new question now.', zh: '他们现在有了一个新的问题。' }
    ],
    quiz: [
      { q: '这一本里，奶奶看到了下面哪一样？', opts: ['红色', '鸭子', '笔'], a: 0, kind: 'recall' },
      { q: '读到最后之前，你猜奶奶他们接下来会怎么样？', opts: ['只把中文看一遍', '他们会再猜一次，然后查对了', '把东西丢下不管了'], a: 1, kind: 'infer' },
      { q: '不知道答案时，你会怎么做？', opts: ['先猜一个，再想办法查证', '等着别人告诉', '随便说一个就当答案'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b4', lv: 'L1', tag: '吃饭', title: 'I Eat', zh: '我吃东西',
    emoji: '🍚', color: '#C6DEF6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「留一份」这条线，认读 5 个新词。',
    trap: '这一级是整体认读：词不用拼，先听整句，再跟着说；别一个字母一个字母念。',
    summary: '《我吃东西》是「留一份」：爷爷和爸爸在家，围绕米饭把一件事读到底。本本词卡：米饭、牛奶、水、饿、救。读前先看词卡，读完合上书说一说。',
    retell: '看图说词：指一指，用英文大声说出这一页的东西。（这一本是「留一份」。）',
    think: '说一次你把好吃的留给别人的事：当时你是怎么想的？',
    pre: [
      { art: '🍚', en: 'rice', zh: '米饭' },
      { art: '🥛', en: 'milk', zh: '牛奶' },
      { art: '💧', en: 'water', zh: '水' },
      { art: '✨', en: 'hungry', zh: '饿' },
      { art: '🏃', en: 'save', zh: '救' },
      { art: '📦', en: 'is', zh: 'is' },
      { art: '📦', en: 'it', zh: 'it' }
    ],
    sight: ['think'],
    newWords: [
      { w: 'rice', zh: '米饭' },
      { w: 'milk', zh: '牛奶' },
      { w: 'water', zh: '水' },
      { w: 'hungry', zh: '饿' },
      { w: 'save', zh: '救' }
    ],
    pages: [
      { art: 'kitchen|grandpa,dad|rice|·', en: 'There is just enough rice for one.', zh: '米饭只够一个人。' },
      { art: 'kitchen|grandpa,dad|rice|♪', en: 'Grandpa wants it very much.', zh: '爷爷很想吃。' },
      { art: 'kitchen|grandpa,dad|rice|👀', en: 'They look at it and think. We say rice, milk and water.', zh: '他们看着它，想了想。我们说一说：米饭、牛奶和水。' },
      { art: 'kitchen|grandpa,dad|rice|?', en: '"Is someone else hungry?" asks Dad.', zh: '「还有别人饿吗？」爸爸问。' },
      { art: 'kitchen|grandpa,dad|rice|★', en: 'Both have a part of the rice. Here is some rice. Here is some milk.', zh: '两个人都有一份米饭。这是米饭，这是牛奶。' },
      { art: 'kitchen|grandpa,dad|rice|·', en: 'Next time they will save a part first.', zh: '下次他们会先留一份。' }
    ],
    quiz: [
      { q: '爷爷和爸爸的这一本里，出现了下面哪一样？', opts: ['米饭', '家', '二'], a: 0, kind: 'recall' },
      { q: '读到最后之前，你猜爷爷他们接下来会怎么样？', opts: ['他们会分成两份，两个人都有', '把东西丢下不管了', '换一本书不读了'], a: 0, kind: 'infer' },
      { q: '只够一份、你也很想吃，你会怎么做？', opts: ['自己全吃完', '留一半给可能需要的人', '藏起来'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b5', lv: 'L1', tag: '上学', title: 'My Bag', zh: '我的书包',
    emoji: '🎒', color: '#E0CFF3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「收拾整齐」这条线，认读 5 个新词。',
    trap: '这一级是整体认读：词不用拼，先听整句，再跟着说；别一个字母一个字母念。',
    summary: '《我的书包》是「收拾整齐」：妈妈和明明在家，围绕书包把一件事读到底。本本词卡：房间、收拾、地板、床、今晚。读前先看词卡，读完合上书说一说。',
    retell: '看图说词：指一指，用英文大声说出这一页的东西。（这一本是「收拾整齐」。）',
    think: '说说你家里最需要收拾的一个地方：你打算给每样东西定在哪儿？',
    pre: [
      { art: '📦', en: 'room', zh: '房间' },
      { art: '🏃', en: 'tidy', zh: '收拾' },
      { art: '📍', en: 'floor', zh: '地板' },
      { art: '🛏️', en: 'bed', zh: '床' },
      { art: '⏰', en: 'tonight', zh: '今晚' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'is', zh: 'is' }
    ],
    sight: [],
    newWords: [
      { w: 'room', zh: '房间' },
      { w: 'tidy', zh: '收拾' },
      { w: 'floor', zh: '地板' },
      { w: 'bed', zh: '床' },
      { w: 'tonight', zh: '今晚' }
    ],
    pages: [
      { art: 'home|mom,ming|bag|·', en: 'The room is not tidy.', zh: '房间不太整齐。' },
      { art: 'home|mom,ming|bag|♪', en: 'They want to make it tidy.', zh: '他们想把它收拾整齐。' },
      { art: 'home|mom,ming|bag|👀', en: 'They look at the floor and the book. We say bed, home and mom.', zh: '他们看看地板和书。我们说一说：床、家和妈妈。' },
      { art: 'home|mom,ming|bag|?', en: '"Where do we start?" asks Mom.', zh: '「从哪儿开始？」妈妈问。' },
      { art: 'home|mom,ming|bag|★', en: 'Now the room is tidy, and the bag is back. Here is a bed. Here is a home.', zh: '现在房间整齐了，书包也回来了。这是床，这是家。' },
      { art: 'home|mom,ming|bag|·', en: 'Tonight they will put things back again.', zh: '今晚他们还会把东西放回去。' }
    ],
    quiz: [
      { q: '在家读的这一本里，有下面哪一样？', opts: ['蓝色', '米饭', '房间'], a: 2, kind: 'recall' },
      { q: '读到最后之前，你猜妈妈他们接下来会怎么样？', opts: ['他们会一样一样收拾，房间就整齐了', '只把中文看一遍', '换一本书不读了'], a: 0, kind: 'infer' },
      { q: '你的东西总是找不到，你会怎么做？', opts: ['再买一个新的', '给每样东西定一个固定的位置', '不管它'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b6', lv: 'L1', tag: '天气', title: 'The Sun', zh: '太阳',
    emoji: '☀️', color: '#F6C9E3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「睡不着」这条线，认读 3 个新词。',
    trap: '这一级是整体认读：词不用拼，先听整句，再跟着说；别一个字母一个字母念。',
    summary: '《太阳》是「睡不着」：爸爸和丽丽在家，围绕太阳把一件事读到底。本本词卡：睡觉、太阳、安静。读前先看词卡，读完合上书说一说。',
    retell: '看图说词：指一指，用英文大声说出这一页的东西。（这一本是「睡不着」。）',
    think: '说说你睡不着的一个晚上：你是怎么睡着的？',
    pre: [
      { art: '🏃', en: 'sleep', zh: '睡觉' },
      { art: '☀️', en: 'sun', zh: '太阳' },
      { art: '✨', en: 'quiet', zh: '安静' },
      { art: '📦', en: 'they', zh: 'they' },
      { art: '📦', en: 'to', zh: 'to' }
    ],
    sight: ['room'],
    newWords: [
      { w: 'sleep', zh: '睡觉' },
      { w: 'sun', zh: '太阳' },
      { w: 'quiet', zh: '安静' }
    ],
    pages: [
      { art: 'night|dad,lili|sun|·', en: 'Dad is in bed at night.', zh: '夜里爸爸躺在床上。' },
      { art: 'night|dad,lili|sun|♪', en: 'They want to go to sleep.', zh: '他们想睡着。' },
      { art: 'night|dad,lili|sun|👀', en: 'They look at the sun in the dark room. We say sun, bag and can.', zh: '他们看看黑屋子里的太阳。我们说一说：太阳、书包和罐子。' },
      { art: 'night|dad,lili|sun|?', en: '"Why can I not sleep?" asks Dad.', zh: '「怎么睡不着？」爸爸问。' },
      { art: 'night|dad,lili|sun|★', en: 'Slowly, they go to sleep. Here is a sun. Here is a bag.', zh: '慢慢地，他们睡着了。这是太阳，这是书包。' },
      { art: 'night|dad,lili|sun|·', en: 'They will listen to quiet sounds again.', zh: '他们还会听安静的声音。' }
    ],
    quiz: [
      { q: '这一本里，爸爸看到了下面哪一样？', opts: ['鸡蛋', '太阳', '水'], a: 1, kind: 'recall' },
      { q: '读到最后之前，你猜爸爸他们接下来会怎么样？', opts: ['只把中文看一遍', '跳过中间那几页', '他们听听安静的声音，就睡着了'], a: 2, kind: 'infer' },
      { q: '睡不着的时候，你会怎么做？', opts: ['一直使劲闭眼', '听听安静的声音，让自己慢慢静下来', '爬起来玩'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b7', lv: 'L1', tag: '比一比', title: 'Big and Small', zh: '大和小',
    emoji: '🐘', color: '#BFE6DF',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「比一比」这条线，认读 3 个新词。',
    trap: '这一级是整体认读：词不用拼，先听整句，再跟着说；别一个字母一个字母念。',
    summary: '《大和小》是「比一比」：明明和奶奶在操场，围绕球把一件事读到底。本本词卡：比赛、球、路。读前先看词卡，读完合上书说一说。',
    retell: '看图说词：指一指，用英文大声说出这一页的东西。（这一本是「比一比」。）',
    think: '说说你比赛或比快的一次经历：你是怎么把握节奏的？',
    pre: [
      { art: '📦', en: 'race', zh: '比赛' },
      { art: '⚽', en: 'ball', zh: '球' },
      { art: '🛣️', en: 'road', zh: '路' },
      { art: '📦', en: 'they', zh: 'they' },
      { art: '📦', en: 'a', zh: 'a' }
    ],
    sight: [],
    newWords: [
      { w: 'race', zh: '比赛' },
      { w: 'ball', zh: '球' },
      { w: 'road', zh: '路' }
    ],
    pages: [
      { art: 'playground|ming,grandma|ball|·', en: 'They have a race with the ball.', zh: '他们用球比一场。' },
      { art: 'playground|ming,grandma|ball|♪', en: 'They both want to be first.', zh: '他们都想跑第一。' },
      { art: 'playground|ming,grandma|ball|👀', en: 'They look at the road in front. We say ball, three and two.', zh: '他们看看前面的路。我们说一说：球、三和二。' },
      { art: 'playground|ming,grandma|ball|?', en: '"Where do we start?" asks Grandma.', zh: '「从哪儿开始？」奶奶问。' },
      { art: 'playground|ming,grandma|ball|★', en: 'They both get to the end. Here is a ball. Here is a three.', zh: '两个人都跑到了终点。这是球，这是三。' },
      { art: 'playground|ming,grandma|ball|·', en: 'They will race again another day.', zh: '改天他们再比一次。' }
    ],
    quiz: [
      { q: '明明和奶奶的这一本里，出现了下面哪一样？', opts: ['鸟', '爷爷', '比赛'], a: 2, kind: 'recall' },
      { q: '读到最后之前，你猜明明他们接下来会怎么样？', opts: ['他们会按自己的节奏跑，就跑到了', '一直重复原来那个动作', '把东西丢下不管了'], a: 0, kind: 'infer' },
      { q: '比赛时你会怎么把握速度？', opts: ['一开始全力冲', '按自己的节奏来，不一味求快', '看别人快就跟着快'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b8', lv: 'L1', tag: '家里', title: 'My Cup', zh: '我的杯子',
    emoji: '🥛', color: '#F2E2A8',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「收好它」这条线，认读 2 个新词。',
    trap: '这一级是整体认读：词不用拼，先听整句，再跟着说；别一个字母一个字母念。',
    summary: '《我的杯子》是「收好它」：丽丽和爷爷在家，围绕杯子把一件事读到底。本本词卡：安全、绿色。读前先看词卡，读完合上书说一说。',
    retell: '看图说词：指一指，用英文大声说出这一页的东西。（这一本是「收好它」。）',
    think: '说说你收好一件重要东西的办法：你放在哪儿，为什么选那里？',
    pre: [
      { art: '✨', en: 'safe', zh: '安全' },
      { art: '🟢', en: 'green', zh: '绿色' },
      { art: '📦', en: 'a', zh: 'a' },
      { art: '👧', en: 'lili', zh: '丽丽' }
    ],
    sight: [],
    newWords: [
      { w: 'safe', zh: '安全' },
      { w: 'green', zh: '绿色' }
    ],
    pages: [
      { art: 'home|lili,grandpa|cup|·', en: 'Lili has a cup.', zh: '丽丽有一样杯子。' },
      { art: 'home|lili,grandpa|cup|♪', en: 'Lili wants to keep it safe.', zh: '丽丽想把它收好。' },
      { art: 'home|lili,grandpa|cup|👀', en: 'They look for a good place. We say two, box and green.', zh: '他们找个好地方。我们说一说：二、盒子和绿色。' },
      { art: 'home|lili,grandpa|cup|?', en: '"Where is a safe place?" asks Lili.', zh: '「哪里最安全？」丽丽问。' },
      { art: 'home|lili,grandpa|cup|★', en: 'Now both can find the cup. Here is a two. Here is a box.', zh: '现在两个人都能找到杯子。这是二，这是盒子。' },
      { art: 'home|lili,grandpa|cup|·', en: 'They will keep it in the same place.', zh: '他们会一直把它放在同一个地方。' }
    ],
    quiz: [
      { q: '在家读的这一本里，有下面哪一样？', opts: ['鱼', '猪', '绿色'], a: 2, kind: 'recall' },
      { q: '读到最后之前，你猜丽丽他们接下来会怎么样？', opts: ['换一本书不读了', '把东西丢下不管了', '他们会找一个既安全、又记得住的地方'], a: 2, kind: 'infer' },
      { q: '怕重要的东西丢掉，你会怎么做？', opts: ['随便放', '放在固定、自己一定记得的地方', '藏到谁都找不到的地方'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b9', lv: 'L1', tag: '发音', title: 'Say It: Hat', zh: '说一说：帽子',
    emoji: '🗣️', color: '#D9D2F5',
    track: 'drill',
    goal: '把本级难点音听准、说准，并能在整句里读对。这一本走「跟读整句」这条线，认读 1 个新词。',
    trap: '这一级是整体认读：词不用拼，先听整句，再跟着说；别一个字母一个字母念。',
    summary: '《说一说：帽子》是「跟读整句」：奶奶和妈妈在家，围绕帽子把一件事读到底。本本词卡：公园。读前先看词卡，读完合上书说一说。',
    retell: '看图说词：指一指，用英文大声说出这一页的东西。（这一本是「跟读整句」。）',
    think: '挑书里最长的一句英文，先听整句，再分成两段读给家长听。',
    pre: [
      { art: '🏞️', en: 'park', zh: '公园' },
      { art: '📦', en: 'a', zh: 'a' },
      { art: '👵', en: 'grandma', zh: '奶奶' }
    ],
    sight: ['green'],
    newWords: [
      { w: 'park', zh: '公园' }
    ],
    pages: [
      { art: 'table|grandma,mom|hat|·', en: 'Grandma opens a book at home.', zh: '奶奶在家翻开一本书。' },
      { art: 'table|grandma,mom|hat|♪', en: 'Grandma wants to read it out loud.', zh: '奶奶想把它读出来。' },
      { art: 'table|grandma,mom|hat|👀', en: 'The sentence with the word "hat" is long. We say green, three and park.', zh: '带着「hat」这个词的那一句很长。我们说一说：绿色、三和公园。' },
      { art: 'table|grandma,mom|hat|?', en: '"Where do I stop for breath?" asks Grandma.', zh: '「在哪里换气？」奶奶问。' },
      { art: 'table|grandma,mom|hat|★', en: 'Now it sounds like one sentence. Here is a green. Here is a three.', zh: '这下听起来像一整句了。这是绿色，这是三。' },
      { art: 'table|grandma,mom|hat|·', en: 'They try the next sentence about a race.', zh: '他们接着试讲比赛的下一句。' }
    ],
    quiz: [
      { q: '这一本里，奶奶看到了下面哪一样？', opts: ['妈妈', '宝宝', '帽子'], a: 2, kind: 'recall' },
      { q: '读到最后之前，你猜奶奶他们接下来会怎么样？', opts: ['换一本书不读了', '只把中文看一遍', '听完整句、分成两段读，就连贯了'], a: 2, kind: 'infer' },
      { q: '遇到像「hat」那一句这样很长的英文句子，你会怎么读？', opts: ['只看中文跳过英文', '一个词一个词慢慢拼', '先听整句，再按意思分成两三段读'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b10', lv: 'L1', tag: '认物', title: 'This Is a Book', zh: '这是一本书',
    emoji: '📖', color: '#FAD3B6',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。这一本走「数一数」这条线，认读 1 个新词。',
    trap: '这一级是整体认读：词不用拼，先听整句，再跟着说；别一个字母一个字母念。',
    summary: '《这是一本书》是「数一数」：爷爷和爸爸在学校，围绕书把一件事读到底。本本词卡：笔。读前先看词卡，读完合上书说一说。',
    retell: '看图说词：指一指，用英文大声说出这一页的东西。（这一本是「数一数」。）',
    think: '找家里三样能数的东西，用英文数一遍，说说你怎么保证不数重。',
    pre: [
      { art: '🖊️', en: 'pen', zh: '笔' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👴', en: 'grandpa', zh: '爷爷' }
    ],
    sight: ['park', 'room', 'water'],
    newWords: [
      { w: 'pen', zh: '笔' }
    ],
    pages: [
      { art: 'school|grandpa,dad|book|·', en: 'Grandpa sees a lot of things at school.', zh: '爷爷在学校看见好多东西。' },
      { art: 'school|grandpa,dad|book|♪', en: 'Grandpa wants to count them all.', zh: '爷爷想把它们数清楚。' },
      { art: 'school|grandpa,dad|book|👀', en: 'Dad points at the book and then the room. We say pen, park and water.', zh: '爸爸指着书，再指房间。我们说一说：笔、公园和水。' },
      { art: 'school|grandpa,dad|book|?', en: '"How many are there?" asks Grandpa.', zh: '「一共有几个？」爷爷问。' },
      { art: 'school|grandpa,dad|book|★', en: 'This time both get the same number. Here is a pen. Here is a park.', zh: '这次两个数对上了。这是笔，这是公园。' },
      { art: 'school|grandpa,dad|book|·', en: 'Next they will count the room and the cup.', zh: '接下来他们要数房间和杯子。' }
    ],
    quiz: [
      { q: '爷爷和爸爸的这一本里，出现了下面哪一样？', opts: ['天空', '杯子', '蓝色'], a: 1, kind: 'recall' },
      { q: '读到最后之前，你猜爷爷他们接下来会怎么样？', opts: ['只把中文看一遍', '每次都从同一头开始，数就对上了', '把东西丢下不管了'], a: 1, kind: 'infer' },
      { q: '数书总是数错，你会怎么做？', opts: ['不数了，猜一个', '随便换个起点重数', '定好从哪头开始，按同一顺序再数'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b11', lv: 'L1', tag: '认物', title: 'Water and Rice', zh: '水和米饭',
    emoji: '💧', color: '#C8E7F0',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。这一本走「合上书讲一遍」这条线，认读 2 个新词。',
    trap: '这一级是整体认读：词不用拼，先听整句，再跟着说；别一个字母一个字母念。',
    summary: '《水和米饭》是「合上书讲一遍」：妈妈和明明在沙滩，围绕水把一件事读到底。本本词卡：沙滩、鱼。读前先看词卡，读完合上书说一说。',
    retell: '看图说词：指一指，用英文大声说出这一页的东西。（这一本是「合上书讲一遍」。）',
    think: '合上书，用「谁 → 在哪儿 → 出了什么事 → 结果」把水这一本讲给家长听。',
    pre: [
      { art: '🏖️', en: 'beach', zh: '沙滩' },
      { art: '🐟', en: 'fish', zh: '鱼' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👩', en: 'mom', zh: '妈妈' }
    ],
    sight: ['water'],
    newWords: [
      { w: 'beach', zh: '沙滩' },
      { w: 'fish', zh: '鱼' }
    ],
    pages: [
      { art: 'beach|mom,ming|water|·', en: 'Mom has just finished a book at the beach.', zh: '妈妈刚在沙滩读完一本书。' },
      { art: 'beach|mom,ming|water|♪', en: 'Ming wants to hear all about it.', zh: '明明想听他讲讲。' },
      { art: 'beach|mom,ming|water|👀', en: 'Mom thinks about the water in the book. We say fish, water and milk.', zh: '妈妈想着书里的水。我们说一说：鱼、水和牛奶。' },
      { art: 'beach|mom,ming|water|?', en: '"Where do I start?" asks Mom.', zh: '「从哪儿讲起？」妈妈问。' },
      { art: 'beach|mom,ming|water|★', en: 'This time Ming can see the whole thing. Here is a fish. Here is some water.', zh: '这回明明全听明白了。这是鱼，这是水。' },
      { art: 'beach|mom,ming|water|·', en: 'Tomorrow they will read about a sun.', zh: '明天他们要读讲太阳的书。' }
    ],
    quiz: [
      { q: '在沙滩读的这一本里，有下面哪一样？', opts: ['沙滩', '奶奶', '书包'], a: 0, kind: 'recall' },
      { q: '读到最后之前，你猜妈妈他们接下来会怎么样？', opts: ['跳过中间那几页', '换一本书不读了', '按「谁 → 在哪儿 → 出了什么事」重讲一遍，别人就听懂了'], a: 2, kind: 'infer' },
      { q: '要把讲水的这本读过的书讲给别人听，你会怎么开头？', opts: ['直接从最精彩的那句开始', '先说谁、在哪儿，再按顺序说出了什么事', '先报书名和生词表'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b12', lv: 'L1', tag: '复习', title: 'All Together', zh: '都在一起',
    emoji: '🌈', color: '#E8D9B5',
    track: 'review',
    goal: '把本级和前面级别的词再读一遍、串成一个故事。这一本走「猜一猜」这条线，认读 1 个新词。',
    trap: '这一级是整体认读：词不用拼，先听整句，再跟着说；别一个字母一个字母念。',
    summary: '《都在一起》是「猜一猜」：爸爸和丽丽在图书馆，围绕盒子把一件事读到底。本本词卡：黄色。读前先看词卡，读完合上书说一说。',
    retell: '看图说词：指一指，用英文大声说出这一页的东西。（这一本是「猜一猜」。）',
    think: '说说你猜过又查证的一件事：猜对了吗？',
    pre: [
      { art: '🟡', en: 'yellow', zh: '黄色' },
      { art: '📦', en: 'they', zh: 'they' },
      { art: '📦', en: 'the', zh: 'the' }
    ],
    sight: ['fish', 'guess', 'think'],
    newWords: [
      { w: 'yellow', zh: '黄色' }
    ],
    pages: [
      { art: 'library|dad,lili|box|·', en: 'They do not know the answer.', zh: '他们不知道答案。' },
      { art: 'library|dad,lili|box|♪', en: 'They want to find out about the box.', zh: '他们想弄清楚盒子。' },
      { art: 'library|dad,lili|box|👀', en: 'They look at the question. We say pen, fish and yellow.', zh: '他们看看这个问题。我们说一说：笔、鱼和黄色。' },
      { art: 'library|dad,lili|box|?', en: '"What do you think?" asks Lili.', zh: '「你怎么想？」丽丽问。' },
      { art: 'library|dad,lili|box|★', en: 'This time the guess is right. Here is a pen. Here is a fish.', zh: '这次猜对了。这是笔，这是鱼。' },
      { art: 'library|dad,lili|box|·', en: 'They have a new question now.', zh: '他们现在有了一个新的问题。' }
    ],
    quiz: [
      { q: '这一本里，爸爸看到了下面哪一样？', opts: ['奶奶', '黄色', '球'], a: 1, kind: 'recall' },
      { q: '读到最后之前，你猜爸爸他们接下来会怎么样？', opts: ['他们会再猜一次，然后查对了', '一直重复原来那个动作', '只把中文看一遍'], a: 0, kind: 'infer' },
      { q: '不知道答案时，你会怎么做？', opts: ['随便说一个就当答案', '先猜一个，再想办法查证', '等着别人告诉'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b13', lv: 'L2', tag: '农场', title: 'A Pig and a Hen', zh: '小猪和母鸡',
    emoji: '🐷', color: '#F6C6C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「看着它」这条线，认读 3 个新词。',
    trap: '短元音要收住韵尾：cap 的 p 是双唇轻轻一闭，不要加「呃」读成「卡普呃」。',
    summary: '《小猪和母鸡》是「看着它」：明明和奶奶在农场，围绕猪把一件事读到底。本本词卡：泥、跑、观察。读前先看词卡，读完合上书说一说。',
    retell: '看图说词：用 a pig / a ball 说两样东西，再听一遍整句。（这一本是「看着它」。）',
    think: '说说你观察过的一种小动物或小虫：它当时在做什么？',
    pre: [
      { art: '🟤', en: 'mud', zh: '泥' },
      { art: '🏃', en: 'run', zh: '跑' },
      { art: '🏃', en: 'watch', zh: '观察' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'it', zh: 'it' }
    ],
    sight: ['duck'],
    newWords: [
      { w: 'mud', zh: '泥' },
      { w: 'run', zh: '跑' },
      { w: 'watch', zh: '观察' }
    ],
    pages: [
      { art: 'farm|ming,grandma|pig|·', en: 'The pig is doing something.', zh: '猪正在做什么。' },
      { art: 'farm|ming,grandma|pig|♪', en: 'Ming wants to see what it does.', zh: '明明想看它做什么。' },
      { art: 'farm|ming,grandma|pig|👀', en: 'They look at it from here. We say pig, duck and mud.', zh: '他们从这儿看着它。我们说一说：猪、鸭子和泥。' },
      { art: 'farm|ming,grandma|pig|?', en: '"Will it run away?" asks Ming.', zh: '「它会跑掉吗？」明明问。' },
      { art: 'farm|ming,grandma|pig|·', en: 'Ming moves closer to see.', zh: '明明走近一点看。' },
      { art: 'farm|ming,grandma|pig|★', en: 'The pig comes back and does it again. Look at the pig and the duck.', zh: '猪回来了，又做了同样的事。看看猪和鸭子。' },
      { art: 'farm|ming,grandma|pig|·', en: 'They will watch the pig again tomorrow.', zh: '明天他们还会来看猪。' }
    ],
    quiz: [
      { q: '明明和奶奶的这一本里，出现了下面哪一样？', opts: ['扇子', '猪', '蓝色'], a: 1, kind: 'recall' },
      { q: '读到最后之前，你猜明明他们接下来会怎么样？', opts: ['把东西丢下不管了', '把东西丢下不管了（书包）', '他们会站着不动地等，它就回来了'], a: 2, kind: 'infer' },
      { q: '想看清小动物在做什么，你会怎么做？', opts: ['大声叫它', '马上跑过去追', '站远一点、别动，耐心等它回来'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b14', lv: 'L2', tag: '穿戴', title: 'The Red Cap', zh: '红帽子',
    emoji: '🧢', color: '#F9DFB4',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「借了要还」这条线，认读 5 个新词。',
    trap: '短元音要收住韵尾：cap 的 p 是双唇轻轻一闭，不要加「呃」读成「卡普呃」。',
    summary: '《红帽子》是「借了要还」：丽丽和爷爷在家，围绕鸭舌帽把一件事读到底。本本词卡：借、鸭舌帽、用、微笑、回来。读前先看词卡，读完合上书说一说。',
    retell: '看图说词：用 a cap / a ball 说两样东西，再听一遍整句。（这一本是「借了要还」。）',
    think: '说一次你借东西或借给别人东西的经历：最后是怎么还的？',
    pre: [
      { art: '🏃', en: 'borrow', zh: '借' },
      { art: '🧢', en: 'cap', zh: '鸭舌帽' },
      { art: '🏃', en: 'use', zh: '用' },
      { art: '🏃', en: 'smile', zh: '微笑' },
      { art: '🏃', en: 'return', zh: '回来' },
      { art: '👧', en: 'lili', zh: '丽丽' },
      { art: '📦', en: 'it', zh: 'it' }
    ],
    sight: ['borrows'],
    newWords: [
      { w: 'borrow', zh: '借' },
      { w: 'cap', zh: '鸭舌帽' },
      { w: 'use', zh: '用' },
      { w: 'smile', zh: '微笑' },
      { w: 'return', zh: '回来' }
    ],
    pages: [
      { art: 'home|lili,grandpa|cap|·', en: 'Lili borrows a cap from Grandpa.', zh: '丽丽向爷爷借了鸭舌帽。' },
      { art: 'home|lili,grandpa|cap|♪', en: 'Lili wants to use it for a day.', zh: '丽丽想用一天。' },
      { art: 'home|lili,grandpa|cap|👀', en: 'They look at it and smile. We say cap, word and mud.', zh: '他们看看它，都笑了。我们说一说：鸭舌帽、词和泥。' },
      { art: 'home|lili,grandpa|cap|?', en: '"How do I look after it?" asks Lili.', zh: '「怎么照顾它？」丽丽问。' },
      { art: 'home|lili,grandpa|cap|·', en: 'Lili uses it well and looks after it.', zh: '丽丽用得很小心。' },
      { art: 'home|lili,grandpa|cap|★', en: 'Grandpa is glad to see the cap again. Look at the cap and the word.', zh: '爷爷很高兴又见到鸭舌帽。看看鸭舌帽和词。' },
      { art: 'home|lili,grandpa|cap|·', en: 'Lili will return what is not theirs.', zh: '丽丽会把不属于自己的东西还回去。' }
    ],
    quiz: [
      { q: '在家读的这一本里，有下面哪一样？', opts: ['杯子', '泥', '手'], a: 1, kind: 'recall' },
      { q: '读到最后之前，你猜丽丽他们接下来会怎么样？', opts: ['换一本书不读了', '换一本书不读了（房间）', '他们会把东西按时还回去'], a: 2, kind: 'infer' },
      { q: '借了别人的东西，你会怎么做？', opts: ['一直留着自己用', '弄丢了也不说', '用完就还回去，并说声谢谢'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b15', lv: 'L2', tag: '天气', title: 'Mud and Fog', zh: '泥和雾',
    emoji: '🌫️', color: '#CDE7C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「找回它们」这条线，认读 3 个新词。',
    trap: '短元音要收住韵尾：cap 的 p 是双唇轻轻一闭，不要加「呃」读成「卡普呃」。',
    summary: '《泥和雾》是「找回它们」：奶奶和妈妈在农场，围绕泥把一件事读到底。本本词卡：方向、农场、母鸡。读前先看词卡，读完合上书说一说。',
    retell: '看图说词：用 a mud / a book 说两样东西，再听一遍整句。（这一本是「找回它们」。）',
    think: '说说你遇到小动物乱跑时是怎么做的：有用吗？',
    pre: [
      { art: '💡', en: 'direction', zh: '方向' },
      { art: '🚜', en: 'farm', zh: '农场' },
      { art: '🐔', en: 'hen', zh: '母鸡' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '🟤', en: 'mud', zh: '泥' }
    ],
    sight: ['directions', 'duck', 'tree'],
    newWords: [
      { w: 'direction', zh: '方向' },
      { w: 'farm', zh: '农场' },
      { w: 'hen', zh: '母鸡' }
    ],
    pages: [
      { art: 'farm|grandma,mom|mud|·', en: 'The mud runs off in all directions.', zh: '泥四处跑散了。' },
      { art: 'farm|grandma,mom|mud|♪', en: 'Grandma wants to get them all back.', zh: '奶奶想把它们都找回来。' },
      { art: 'farm|grandma,mom|mud|👀', en: 'They look around the farm. We say tree, hen and duck.', zh: '他们看看农场四周。我们说一说：树、母鸡和鸭子。' },
      { art: 'farm|grandma,mom|mud|?', en: '"How do we get them back?" asks Grandma.', zh: '「怎么把它们叫回来？」奶奶问。' },
      { art: 'farm|grandma,mom|mud|·', en: 'Grandma runs after them.', zh: '奶奶在后面追。' },
      { art: 'farm|grandma,mom|mud|★', en: 'The mud comes back on its own. Look at the tree and the hen.', zh: '泥自己回来了。看看树和母鸡。' },
      { art: 'farm|grandma,mom|mud|·', en: 'They will keep a close eye on the mud.', zh: '他们会好好看着泥。' }
    ],
    quiz: [
      { q: '这一本里，奶奶看到了下面哪一样？', opts: ['鸭子', '腿', '雾'], a: 0, kind: 'recall' },
      { q: '读到最后之前，你猜奶奶他们接下来会怎么样？', opts: ['只把中文看一遍', '他们会停下来不追，它自己回来了', '只把中文看一遍（球）'], a: 1, kind: 'infer' },
      { q: '小动物跑散了，你会怎么做？', opts: ['不管了', '停下来别追，安静等它们回来', '一直追到它们停下'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b16', lv: 'L2', tag: '观察', title: 'My Little Bug', zh: '我的小虫',
    emoji: '🐛', color: '#C6DEF6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「等它长」这条线，认读 2 个新词。',
    trap: '短元音要收住韵尾：cap 的 p 是双唇轻轻一闭，不要加「呃」读成「卡普呃」。',
    summary: '《我的小虫》是「等它长」：爷爷和爸爸在花园，围绕小虫把一件事读到底。本本词卡：小虫、花园。读前先看词卡，读完合上书说一说。',
    retell: '看图说词：用 a bug / a box 说两样东西，再听一遍整句。（这一本是「等它长」。）',
    think: '说一件练了很久才看见进步的事，讲讲等待的时候你是怎么想的。',
    pre: [
      { art: '🐛', en: 'bug', zh: '小虫' },
      { art: '🌻', en: 'garden', zh: '花园' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👴', en: 'grandpa', zh: '爷爷' }
    ],
    sight: ['yellow'],
    newWords: [
      { w: 'bug', zh: '小虫' },
      { w: 'garden', zh: '花园' }
    ],
    pages: [
      { art: 'garden|grandpa,dad|bug|·', en: 'Grandpa puts a bug in the garden.', zh: '爷爷把小虫放在花园。' },
      { art: 'garden|grandpa,dad|bug|♪', en: 'Grandpa wants to see it change.', zh: '爷爷想看见它变样。' },
      { art: 'garden|grandpa,dad|bug|👀', en: 'On the first day, nothing looks different. We say bug, yellow and hen.', zh: '头一天，看不出什么变化。我们说一说：小虫、黄色和母鸡。' },
      { art: 'garden|grandpa,dad|bug|?', en: '"Is it working at all?" asks Grandpa.', zh: '「到底有没有在长？」爷爷问。' },
      { art: 'garden|grandpa,dad|bug|·', en: 'They look again the next morning.', zh: '第二天早上他们又去看。' },
      { art: 'garden|grandpa,dad|bug|★', en: 'One morning, there is a small change. Look at the bug and the yellow.', zh: '有一天早上，出现了一点小变化。看看小虫和黄色。' },
      { art: 'garden|grandpa,dad|bug|·', en: 'They will come back and look again tomorrow.', zh: '明天他们还会再来看。' }
    ],
    quiz: [
      { q: '爷爷和爸爸的这一本里，出现了下面哪一样？', opts: ['母鸡', '帽子', '妈妈'], a: 0, kind: 'recall' },
      { q: '读到最后之前，你猜爷爷他们接下来会怎么样？', opts: ['再耐心等一等，就看见变化了', '把东西丢下不管了', '跳过中间那几页'], a: 0, kind: 'infer' },
      { q: '学一样本领练了几天没进步（像等小虫那样），你会怎么做？', opts: ['按原来的方法接着练，过几天再看', '认定自己学不会', '立刻换一件别的事'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b17', lv: 'L2', tag: '厨房', title: 'A Big Pot', zh: '一口大锅',
    emoji: '🍲', color: '#E0CFF3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「一起做饭」这条线，认读 5 个新词。',
    trap: '短元音要收住韵尾：cap 的 p 是双唇轻轻一闭，不要加「呃」读成「卡普呃」。',
    summary: '《一口大锅》是「一起做饭」：妈妈和明明在家，围绕锅把一件事读到底。本本词卡：厨房、做饭、锅、果酱、坚果。读前先看词卡，读完合上书说一说。',
    retell: '看图说词：用 a pot / a hat 说两样东西，再听一遍整句。（这一本是「一起做饭」。）',
    think: '说说你做过的一样吃的或东西：哪一步最容易乱？',
    pre: [
      { art: '🍳', en: 'kitchen', zh: '厨房' },
      { art: '🏃', en: 'cook', zh: '做饭' },
      { art: '🍲', en: 'pot', zh: '锅' },
      { art: '🍯', en: 'jam', zh: '果酱' },
      { art: '🌰', en: 'nut', zh: '坚果' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'and', zh: 'and' }
    ],
    sight: [],
    newWords: [
      { w: 'kitchen', zh: '厨房' },
      { w: 'cook', zh: '做饭' },
      { w: 'pot', zh: '锅' },
      { w: 'jam', zh: '果酱' },
      { w: 'nut', zh: '坚果' }
    ],
    pages: [
      { art: 'kitchen|mom,ming|pot|·', en: 'Mom and Ming are in the kitchen.', zh: '妈妈和明明在厨房。' },
      { art: 'kitchen|mom,ming|pot|♪', en: 'They want to cook a pot.', zh: '他们想做锅。' },
      { art: 'kitchen|mom,ming|pot|👀', en: 'They look at the hat and the home. We say pot, jam and nut.', zh: '他们看看帽子和家。我们说一说：锅、果酱和坚果。' },
      { art: 'kitchen|mom,ming|pot|?', en: '"What goes in first?" asks Ming.', zh: '「先放什么？」明明问。' },
      { art: 'kitchen|mom,ming|pot|·', en: 'They cook it and wait.', zh: '他们做起来，然后等着。' },
      { art: 'kitchen|mom,ming|pot|★', en: 'This time the pot is just right. Look at the pot and the jam.', zh: '这次锅正好。看看锅和果酱。' },
      { art: 'kitchen|mom,ming|pot|·', en: 'They will cook it again for Ming.', zh: '他们要再做一次给明明吃。' }
    ],
    quiz: [
      { q: '在家读的这一本里，有下面哪一样？', opts: ['牛奶', '锅', '石头'], a: 1, kind: 'recall' },
      { q: '读到最后之前，你猜妈妈他们接下来会怎么样？', opts: ['一直重复原来那个动作', '换一本书不读了', '他们会按步骤重做一次，就做对了'], a: 2, kind: 'infer' },
      { q: '做饭/做东西总是不对，你会怎么做？', opts: ['把材料全换掉', '不做了', '按步骤一步一步重做一遍'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b18', lv: 'L2', tag: '出门', title: 'The Bus Is Here', zh: '公交车来了',
    emoji: '🚌', color: '#F6C9E3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「帮忙买」这条线，认读 4 个新词。',
    trap: '短元音要收住韵尾：cap 的 p 是双唇轻轻一闭，不要加「呃」读成「卡普呃」。',
    summary: '《公交车来了》是「帮忙买」：爸爸和丽丽在街道，围绕公交车把一件事读到底。本本词卡：街道、买、公交车、小店。读前先看词卡，读完合上书说一说。',
    retell: '看图说词：用 a bus / a cup 说两样东西，再听一遍整句。（这一本是「帮忙买」。）',
    think: '说说你帮忙买过或找过的一样东西：你是怎么找到它的？',
    pre: [
      { art: '🛣️', en: 'street', zh: '街道' },
      { art: '🏃', en: 'buy', zh: '买' },
      { art: '🚌', en: 'bus', zh: '公交车' },
      { art: '🏪', en: 'shop', zh: '小店' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'they', zh: 'they' }
    ],
    sight: [],
    newWords: [
      { w: 'street', zh: '街道' },
      { w: 'buy', zh: '买' },
      { w: 'bus', zh: '公交车' },
      { w: 'shop', zh: '小店' }
    ],
    pages: [
      { art: 'street|dad,lili|bus|·', en: 'Dad goes to the street for Lili.', zh: '爸爸去街道帮丽丽买。' },
      { art: 'street|dad,lili|bus|♪', en: 'They want to buy the right thing.', zh: '他们想买对东西。' },
      { art: 'street|dad,lili|bus|👀', en: 'They look at the list and the bus. We say shop, bus and nut.', zh: '他们看看单子和公交车。我们说一说：小店、公交车和坚果。' },
      { art: 'street|dad,lili|bus|?', en: '"What is on the list?" asks Dad.', zh: '「单子上有什么？」爸爸问。' },
      { art: 'street|dad,lili|bus|·', en: 'They get one thing and then another.', zh: '他们拿了一样，又拿一样。' },
      { art: 'street|dad,lili|bus|★', en: 'They find it and buy all the things. Look at the shop and the bus.', zh: '找到了，东西全买齐了。看看小店和公交车。' },
      { art: 'street|dad,lili|bus|·', en: 'They will help again next time.', zh: '下次他们还会帮忙。' }
    ],
    quiz: [
      { q: '这一本里，爸爸看到了下面哪一样？', opts: ['泥', '太阳', '公交车'], a: 2, kind: 'recall' },
      { q: '读到最后之前，你猜爸爸他们接下来会怎么样？', opts: ['他们会开口问人，就买齐了', '只把中文看一遍', '把东西丢下不管了'], a: 0, kind: 'infer' },
      { q: '买东西找不到，你会怎么做？', opts: ['空手回家', '自己一直找', '问问店里的人'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b19', lv: 'L2', tag: '找路', title: 'A Map for Ming', zh: '明明的地图',
    emoji: '🗺️', color: '#BFE6DF',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「找路」这条线，认读 3 个新词。',
    trap: '短元音要收住韵尾：cap 的 p 是双唇轻轻一闭，不要加「呃」读成「卡普呃」。',
    summary: '《明明的地图》是「找路」：明明和奶奶在街道，围绕地图把一件事读到底。本本词卡：地图、人、给看。读前先看词卡，读完合上书说一说。',
    retell: '看图说词：用 a map / a hat 说两样东西，再听一遍整句。（这一本是「找路」。）',
    think: '说一次你问路或给别人指路的经历：当时是怎么说的？',
    pre: [
      { art: '🗺️', en: 'map', zh: '地图' },
      { art: '🧑', en: 'person', zh: '人' },
      { art: '🏃', en: 'show', zh: '给看' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'they', zh: 'they' }
    ],
    sight: ['kitchen', 'road', 'shows', 'street'],
    newWords: [
      { w: 'map', zh: '地图' },
      { w: 'person', zh: '人' },
      { w: 'show', zh: '给看' }
    ],
    pages: [
      { art: 'street|ming,grandma|map|·', en: 'They do not know where the street is.', zh: '他们不知道街道在哪儿。' },
      { art: 'street|ming,grandma|map|♪', en: 'They want to find the way.', zh: '他们想找路。' },
      { art: 'street|ming,grandma|map|👀', en: 'They look at the map and the road. We say map, kitchen and nut.', zh: '他们看看地图和路。我们说一说：地图、厨房和坚果。' },
      { art: 'street|ming,grandma|map|?', en: '"Does the map help?" asks Ming.', zh: '「地图有用吗？」明明问。' },
      { art: 'street|ming,grandma|map|·', en: 'They follow the map.', zh: '他们照着地图走。' },
      { art: 'street|ming,grandma|map|★', en: 'The person shows them the way. Look at the map and the kitchen.', zh: '那个人给他们指了路。看看地图和厨房。' },
      { art: 'street|ming,grandma|map|·', en: 'They will help someone else next time.', zh: '下次他们也会给别人指路。' }
    ],
    quiz: [
      { q: '明明和奶奶的这一本里，出现了下面哪一样？', opts: ['笔', '街道', '陀螺'], a: 1, kind: 'recall' },
      { q: '读到最后之前，你猜明明他们接下来会怎么样？', opts: ['换一本书不读了', '把东西丢下不管了', '他们会问一个知道路的人，就找到了'], a: 2, kind: 'infer' },
      { q: '看不懂地图，你会怎么做？', opts: ['问一个知道路的人', '自己一直猜', '不去了'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b20', lv: 'L2', tag: '早餐', title: 'Jam on a Bun', zh: '面包上的果酱',
    emoji: '🍞', color: '#F2E2A8',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「混一混」这条线，认读 5 个新词。',
    trap: '短元音要收住韵尾：cap 的 p 是双唇轻轻一闭，不要加「呃」读成「卡普呃」。',
    summary: '《面包上的果酱》是「混一混」：丽丽和爷爷在家，围绕果酱把一件事读到底。本本词卡：混、陀螺、发生、给看、学。读前先看词卡，读完合上书说一说。',
    retell: '看图说词：用 a jam / a book 说两样东西，再听一遍整句。（这一本是「混一混」。）',
    think: '说说你试过把两样东西混在一起的事：结果怎么样？',
    pre: [
      { art: '🏃', en: 'mix', zh: '混' },
      { art: '📦', en: 'top', zh: '陀螺' },
      { art: '🏃', en: 'happen', zh: '发生' },
      { art: '🏃', en: 'show', zh: '给看' },
      { art: '🏃', en: 'learn', zh: '学' },
      { art: '📦', en: 'they', zh: 'they' },
      { art: '👧', en: 'lili', zh: '丽丽' }
    ],
    sight: ['learned', 'tree'],
    newWords: [
      { w: 'mix', zh: '混' },
      { w: 'top', zh: '陀螺' },
      { w: 'happen', zh: '发生' },
      { w: 'show', zh: '给看' },
      { w: 'learn', zh: '学' }
    ],
    pages: [
      { art: 'kitchen|lili,grandpa|jam|·', en: 'Lili has some jam and a book.', zh: '丽丽有果酱和书。' },
      { art: 'kitchen|lili,grandpa|jam|♪', en: 'Lili wants to mix them.', zh: '丽丽想把它们混在一起。' },
      { art: 'kitchen|lili,grandpa|jam|👀', en: 'They look at the two things. We say tree, jam and top.', zh: '他们看看这两样东西。我们说一说：树、果酱和陀螺。' },
      { art: 'kitchen|lili,grandpa|jam|?', en: '"What will happen?" asks Lili.', zh: '「会变成什么样？」丽丽问。' },
      { art: 'kitchen|lili,grandpa|jam|·', en: 'They mix them together.', zh: '他们把两样混在一起。' },
      { art: 'kitchen|lili,grandpa|jam|★', en: 'Both work well again. Look at the tree and the jam.', zh: '两样都好用了。看看树和果酱。' },
      { art: 'kitchen|lili,grandpa|jam|·', en: 'They will show Grandpa what they learned.', zh: '他们要把学到的讲给爷爷听。' }
    ],
    quiz: [
      { q: '在家读的这一本里，有下面哪一样？', opts: ['太阳', '树', '球'], a: 1, kind: 'recall' },
      { q: '读到最后之前，你猜丽丽他们接下来会怎么样？', opts: ['他们会把两样分开，各归各位', '换一本书不读了', '只把中文看一遍'], a: 0, kind: 'infer' },
      { q: '想把两样东西混在一起试试，你会怎么做？', opts: ['全部混进去', '先问一句，或先试一小点', '不试了'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b21', lv: 'L2', tag: '发音', title: 'Say It: Pen, Pin', zh: '说一说：pen pin',
    emoji: '🗣️', color: '#D9D2F5',
    track: 'drill',
    goal: '把本级难点音听准、说准，并能在整句里读对。这一本走「跟读整句」这条线，认读 1 个新词。',
    trap: '短元音要收住韵尾：cap 的 p 是双唇轻轻一闭，不要加「呃」读成「卡普呃」。',
    summary: '《说一说：pen pin》是「跟读整句」：奶奶和妈妈在家，围绕笔把一件事读到底。本本词卡：动物。读前先看词卡，读完合上书说一说。',
    retell: '看图说词：用 a pen / a hat 说两样东西，再听一遍整句。（这一本是「跟读整句」。）',
    think: '挑书里最长的一句英文，先听整句，再分成两段读给家长听。',
    pre: [
      { art: '🐾', en: 'animal', zh: '动物' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👵', en: 'grandma', zh: '奶奶' }
    ],
    sight: ['shop'],
    newWords: [
      { w: 'animal', zh: '动物' }
    ],
    pages: [
      { art: 'table|grandma,mom|pen|·', en: 'Grandma opens a book at home.', zh: '奶奶在家翻开一本书。' },
      { art: 'table|grandma,mom|pen|♪', en: 'Grandma wants to read it out loud.', zh: '奶奶想把它读出来。' },
      { art: 'table|grandma,mom|pen|👀', en: 'The sentence with the word "pen" is long. We say top, shop and animal.', zh: '带着「pen」这个词的那一句很长。我们说一说：陀螺、小店和动物。' },
      { art: 'table|grandma,mom|pen|?', en: '"Where do I stop for breath?" asks Grandma.', zh: '「在哪里换气？」奶奶问。' },
      { art: 'table|grandma,mom|pen|·', en: 'Grandma reads it one word at a time.', zh: '奶奶一个词一个词地读。' },
      { art: 'table|grandma,mom|pen|★', en: 'Now it sounds like one sentence. Look at the top and the shop.', zh: '这下听起来像一整句了。看看陀螺和小店。' },
      { art: 'table|grandma,mom|pen|·', en: 'They try the next sentence about a hat.', zh: '他们接着试讲帽子的下一句。' }
    ],
    quiz: [
      { q: '这一本里，奶奶看到了下面哪一样？', opts: ['爸爸', '笔', '蝙蝠'], a: 1, kind: 'recall' },
      { q: '读到最后之前，你猜奶奶他们接下来会怎么样？', opts: ['听完整句、分成两段读，就连贯了', '跳过中间那几页', '只把中文看一遍'], a: 0, kind: 'infer' },
      { q: '遇到像「pen」那一句这样很长的英文句子，你会怎么读？', opts: ['一个词一个词慢慢拼', '先听整句，再按意思分成两三段读', '只看中文跳过英文'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b22', lv: 'L2', tag: '小知识', title: 'A Nut for the Ant', zh: '给蚂蚁的坚果',
    emoji: '🐜', color: '#FAD3B6',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。这一本走「数一数」这条线，认读 1 个新词。',
    trap: '短元音要收住韵尾：cap 的 p 是双唇轻轻一闭，不要加「呃」读成「卡普呃」。',
    summary: '《给蚂蚁的坚果》是「数一数」：爷爷和爸爸在家，围绕坚果把一件事读到底。本本词卡：蝙蝠。读前先看词卡，读完合上书说一说。',
    retell: '看图说词：用 a nut / a pen 说两样东西，再听一遍整句。（这一本是「数一数」。）',
    think: '找家里三样能数的东西，用英文数一遍，说说你怎么保证不数重。',
    pre: [
      { art: '🦇', en: 'bat', zh: '蝙蝠' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👴', en: 'grandpa', zh: '爷爷' }
    ],
    sight: [],
    newWords: [
      { w: 'bat', zh: '蝙蝠' }
    ],
    pages: [
      { art: 'kitchen|grandpa,dad|nut|·', en: 'Grandpa sees a lot of things at home.', zh: '爷爷在家看见好多东西。' },
      { art: 'kitchen|grandpa,dad|nut|♪', en: 'Grandpa wants to count them all.', zh: '爷爷想把它们数清楚。' },
      { art: 'kitchen|grandpa,dad|nut|👀', en: 'Dad points at the nut and then the pen. We say animal, animal and bat.', zh: '爸爸指着坚果，再指笔。我们说一说：动物、动物和蝙蝠。' },
      { art: 'kitchen|grandpa,dad|nut|?', en: '"How many are there?" asks Grandpa.', zh: '「一共有几个？」爷爷问。' },
      { art: 'kitchen|grandpa,dad|nut|·', en: 'Grandpa counts: one, two, three.', zh: '爷爷数：一、二、三。' },
      { art: 'kitchen|grandpa,dad|nut|★', en: 'This time both get the same number. Look at the animal and the animal.', zh: '这次两个数对上了。看看动物和动物。' },
      { art: 'kitchen|grandpa,dad|nut|·', en: 'Next they will count the pen and the ball.', zh: '接下来他们要数笔和球。' }
    ],
    quiz: [
      { q: '爷爷和爸爸的这一本里，出现了下面哪一样？', opts: ['鸭舌帽', '火腿', '笔'], a: 2, kind: 'recall' },
      { q: '读到最后之前，你猜爷爷他们接下来会怎么样？', opts: ['每次都从同一头开始，数就对上了', '把东西丢下不管了', '一直重复原来那个动作'], a: 0, kind: 'infer' },
      { q: '数坚果总是数错，你会怎么做？', opts: ['不数了，猜一个', '随便换个起点重数', '定好从哪头开始，按同一顺序再数'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b23', lv: 'L2', tag: '小知识', title: 'Wet and Dry', zh: '湿和干',
    emoji: '💧', color: '#C8E7F0',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。这一本走「合上书讲一遍」这条线，认读 1 个新词。',
    trap: '短元音要收住韵尾：cap 的 p 是双唇轻轻一闭，不要加「呃」读成「卡普呃」。',
    summary: '《湿和干》是「合上书讲一遍」：妈妈和明明在家，围绕锅把一件事读到底。本本词卡：扇子。读前先看词卡，读完合上书说一说。',
    retell: '看图说词：用 a pot / a water 说两样东西，再听一遍整句。（这一本是「合上书讲一遍」。）',
    think: '合上书，用「谁 → 在哪儿 → 出了什么事 → 结果」把锅这一本讲给家长听。',
    pre: [
      { art: '📦', en: 'fan', zh: '扇子' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👩', en: 'mom', zh: '妈妈' }
    ],
    sight: ['water'],
    newWords: [
      { w: 'fan', zh: '扇子' }
    ],
    pages: [
      { art: 'kitchen|mom,ming|pot|·', en: 'Mom has just finished a book at home.', zh: '妈妈刚在家读完一本书。' },
      { art: 'kitchen|mom,ming|pot|♪', en: 'Ming wants to hear all about it.', zh: '明明想听他讲讲。' },
      { art: 'kitchen|mom,ming|pot|👀', en: 'Mom thinks about the pot in the book. We say bat, bat and fan.', zh: '妈妈想着书里的锅。我们说一说：蝙蝠、蝙蝠和扇子。' },
      { art: 'kitchen|mom,ming|pot|?', en: '"Where do I start?" asks Mom.', zh: '「从哪儿讲起？」妈妈问。' },
      { art: 'kitchen|mom,ming|pot|·', en: 'Mom tells the last part first.', zh: '妈妈先讲了结尾。' },
      { art: 'kitchen|mom,ming|pot|★', en: 'This time Ming can see the whole thing. Look at the bat and the bat.', zh: '这回明明全听明白了。看看蝙蝠和蝙蝠。' },
      { art: 'kitchen|mom,ming|pot|·', en: 'Tomorrow they will read about some water.', zh: '明天他们要读讲水的书。' }
    ],
    quiz: [
      { q: '在家读的这一本里，有下面哪一样？', opts: ['爸爸', '帽子', '扇子'], a: 2, kind: 'recall' },
      { q: '读到最后之前，你猜妈妈他们接下来会怎么样？', opts: ['换一本书不读了', '按「谁 → 在哪儿 → 出了什么事」重讲一遍，别人就听懂了', '把东西丢下不管了'], a: 1, kind: 'infer' },
      { q: '要把讲锅的这本读过的书讲给别人听，你会怎么开头？', opts: ['直接从最精彩的那句开始', '先说谁、在哪儿，再按顺序说出了什么事', '先报书名和生词表'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b24', lv: 'L2', tag: '复习', title: 'The Shop on the Hill', zh: '山上的小店',
    emoji: '🏪', color: '#E8D9B5',
    track: 'review',
    goal: '把本级和前面级别的词再读一遍、串成一个故事。这一本走「猜一猜」这条线，认读 1 个新词。',
    trap: '短元音要收住韵尾：cap 的 p 是双唇轻轻一闭，不要加「呃」读成「卡普呃」。',
    summary: '《山上的小店》是「猜一猜」：爸爸和丽丽在图书馆，围绕小店把一件事读到底。本本词卡：火腿。读前先看词卡，读完合上书说一说。',
    retell: '看图说词：用 a shop / a floor 说两样东西，再听一遍整句。（这一本是「猜一猜」。）',
    think: '说说你猜过又查证的一件事：猜对了吗？',
    pre: [
      { art: '🍖', en: 'ham', zh: '火腿' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'they', zh: 'they' }
    ],
    sight: ['guess', 'shop', 'think'],
    newWords: [
      { w: 'ham', zh: '火腿' }
    ],
    pages: [
      { art: 'library|dad,lili|shop|·', en: 'They do not know the answer.', zh: '他们不知道答案。' },
      { art: 'library|dad,lili|shop|♪', en: 'They want to find out about the shop.', zh: '他们想弄清楚小店。' },
      { art: 'library|dad,lili|shop|👀', en: 'They look at the question. We say fan, fan and ham.', zh: '他们看看这个问题。我们说一说：扇子、扇子和火腿。' },
      { art: 'library|dad,lili|shop|?', en: '"What do you think?" asks Lili.', zh: '「你怎么想？」丽丽问。' },
      { art: 'library|dad,lili|shop|·', en: 'Dad makes a guess.', zh: '爸爸猜了一个答案。' },
      { art: 'library|dad,lili|shop|★', en: 'This time the guess is right. Look at the fan and the fan.', zh: '这次猜对了。看看扇子和扇子。' },
      { art: 'library|dad,lili|shop|·', en: 'They have a new question now.', zh: '他们现在有了一个新的问题。' }
    ],
    quiz: [
      { q: '这一本里，爸爸看到了下面哪一样？', opts: ['火腿', '罐子', '绿色'], a: 0, kind: 'recall' },
      { q: '读到最后之前，你猜爸爸他们接下来会怎么样？', opts: ['只把中文看一遍', '他们会再猜一次，然后查对了', '换一本书不读了'], a: 1, kind: 'infer' },
      { q: '不知道答案时，你会怎么做？', opts: ['先猜一个，再想办法查证', '等着别人告诉', '随便说一个就当答案'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b25', lv: 'L3', tag: '海边', title: 'The Big Ship', zh: '大轮船',
    emoji: '🚢', color: '#F6C6C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「小船出海」这条线，认读 4 个新词。',
    trap: 'sh 把嘴唇撅圆、th 把舌尖轻轻放在上下门牙中间；ck 只发一个 k，别读两遍。',
    summary: '《大轮船》是「小船出海」：明明和奶奶在沙滩，围绕轮船把一件事读到底。本本词卡：轮船、航行、风、沙子。读前先看词卡，读完合上书说一说。',
    retell: '三句话复述：先……、后来……、最后……（这一本是「小船出海」。）',
    think: '说说你在水边玩过的游戏：风或水是怎么影响它的？',
    pre: [
      { art: '🚢', en: 'ship', zh: '轮船' },
      { art: '🏃', en: 'sail', zh: '航行' },
      { art: '🌿', en: 'wind', zh: '风' },
      { art: '🌿', en: 'sand', zh: '沙子' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'and', zh: 'and' }
    ],
    sight: ['beach', 'water'],
    newWords: [
      { w: 'ship', zh: '轮船' },
      { w: 'sail', zh: '航行' },
      { w: 'wind', zh: '风' },
      { w: 'sand', zh: '沙子' }
    ],
    pages: [
      { art: 'beach|ming,grandma|ship|·', en: 'Ming has a ship by the water.', zh: '明明在水边有轮船。' },
      { art: 'beach|ming,grandma|ship|♪', en: 'Ming wants to see it sail.', zh: '明明想看它开出去。' },
      { art: 'beach|ming,grandma|ship|👀', en: 'They look at the wind and the water. We say the words: ship, sand and beach.', zh: '他们看看风和水。我们念这三个词：轮船、沙子和沙滩。' },
      { art: 'beach|ming,grandma|ship|?', en: '"Is the wind right?" asks Grandma.', zh: '「风向对吗？」奶奶问。' },
      { art: 'beach|ming,grandma|ship|·', en: 'They put the ship on the water.', zh: '他们把轮船放到水上。' },
      { art: 'beach|ming,grandma|ship|!', en: 'The wind takes it far away.', zh: '风把它吹得很远。' },
      { art: 'beach|ming,grandma|ship|★', en: 'The wind turns and brings the ship back. We look at the ship and the sand.', zh: '风向一转，把轮船带了回来。我们看看轮船和沙子。' },
      { art: 'beach|ming,grandma|ship|·', en: 'They will sail it again when the wind is right.', zh: '等风对了，他们再放一次。' }
    ],
    quiz: [
      { q: '明明和奶奶的这一本里，出现了下面哪一样？', opts: ['沙滩', '胳膊', '太阳'], a: 0, kind: 'recall' },
      { q: '读到最后之前，你猜明明他们接下来会怎么样？', opts: ['只把中文看一遍', '风会转回来，把小船带回来', '把东西丢下不管了'], a: 1, kind: 'infer' },
      { q: '东西被风吹跑了，你会怎么做？', opts: ['先等风向变了再说，别硬追', '再买一个', '一直追着风跑'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b26', lv: 'L3', tag: '趣事', title: 'A Duck in the Shop', zh: '店里的一只鸭子',
    emoji: '🦆', color: '#F9DFB4',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「等它长」这条线，认读 1 个新词。',
    trap: 'sh 把嘴唇撅圆、th 把舌尖轻轻放在上下门牙中间；ck 只发一个 k，别读两遍。',
    summary: '《店里的一只鸭子》是「等它长」：丽丽和爷爷在农场，围绕鸭子把一件事读到底。本本词卡：小鸡。读前先看词卡，读完合上书说一说。',
    retell: '三句话复述：先……、后来……、最后……（这一本是「等它长」。）',
    think: '说一件练了很久才看见进步的事，讲讲等待的时候你是怎么想的。',
    pre: [
      { art: '📦', en: 'chick', zh: '小鸡' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👧', en: 'lili', zh: '丽丽' }
    ],
    sight: ['farm', 'floor'],
    newWords: [
      { w: 'chick', zh: '小鸡' }
    ],
    pages: [
      { art: 'farm|lili,grandpa|duck|·', en: 'Lili puts a duck on the farm.', zh: '丽丽把鸭子放在农场。' },
      { art: 'farm|lili,grandpa|duck|♪', en: 'Lili wants to see it change.', zh: '丽丽想看见它变样。' },
      { art: 'farm|lili,grandpa|duck|👀', en: 'On the first day, nothing looks different. We say the words: chick, floor and ham.', zh: '头一天，看不出什么变化。我们念这三个词：小鸡、地板和火腿。' },
      { art: 'farm|lili,grandpa|duck|?', en: '"Is it working at all?" asks Lili.', zh: '「到底有没有在长？」丽丽问。' },
      { art: 'farm|lili,grandpa|duck|·', en: 'They look again the next morning.', zh: '第二天早上他们又去看。' },
      { art: 'farm|lili,grandpa|duck|!', en: 'Still the same. Lili wants to give up.', zh: '还是老样子。丽丽想算了。' },
      { art: 'farm|lili,grandpa|duck|★', en: 'One morning, there is a small change. We look at the chick and the floor.', zh: '有一天早上，出现了一点小变化。我们看看小鸡和地板。' },
      { art: 'farm|lili,grandpa|duck|·', en: 'They will come back and look again tomorrow.', zh: '明天他们还会再来看。' }
    ],
    quiz: [
      { q: '在农场读的这一本里，有下面哪一样？', opts: ['沙滩', '鸭子', '水'], a: 1, kind: 'recall' },
      { q: '读到最后之前，你猜丽丽他们接下来会怎么样？', opts: ['再耐心等一等，就看见变化了', '换一本书不读了', '跳过中间那几页'], a: 0, kind: 'infer' },
      { q: '学一样本领练了几天没进步（像等鸭子那样），你会怎么做？', opts: ['立刻换一件别的事', '认定自己学不会', '按原来的方法接着练，过几天再看'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b27', lv: 'L3', tag: '吃饭', title: 'Fish and Chips', zh: '鱼和薯条',
    emoji: '🐟', color: '#CDE7C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「学游泳」这条线，认读 5 个新词。',
    trap: 'sh 把嘴唇撅圆、th 把舌尖轻轻放在上下门牙中间；ck 只发一个 k，别读两遍。',
    summary: '《鱼和薯条》是「学游泳」：奶奶和妈妈在沙滩，围绕鱼把一件事读到底。本本词卡：学、游泳、盘子、深、脸。读前先看词卡，读完合上书说一说。',
    retell: '三句话复述：先……、后来……、最后……（这一本是「学游泳」。）',
    think: '说说你学过的一件有点难的事：你是怎么一点点学会的？',
    pre: [
      { art: '🏃', en: 'learn', zh: '学' },
      { art: '🏃', en: 'swim', zh: '游泳' },
      { art: '🍽️', en: 'dish', zh: '盘子' },
      { art: '✨', en: 'deep', zh: '深' },
      { art: '📦', en: 'face', zh: '脸' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👵', en: 'grandma', zh: '奶奶' }
    ],
    sight: ['water'],
    newWords: [
      { w: 'learn', zh: '学' },
      { w: 'swim', zh: '游泳' },
      { w: 'dish', zh: '盘子' },
      { w: 'deep', zh: '深' },
      { w: 'face', zh: '脸' }
    ],
    pages: [
      { art: 'beach|grandma,mom|fish|·', en: 'Grandma is by the water with the fish.', zh: '奶奶带着鱼在水边。' },
      { art: 'beach|grandma,mom|fish|♪', en: 'Grandma wants to learn to swim.', zh: '奶奶想学游泳。' },
      { art: 'beach|grandma,mom|fish|👀', en: 'They look at the water first. We say the words: front, chick and dish.', zh: '他们先看看水。我们念这三个词：前面、小鸡和盘子。' },
      { art: 'beach|grandma,mom|fish|?', en: '"Is it deep?" asks Grandma.', zh: '「水深吗？」奶奶问。' },
      { art: 'beach|grandma,mom|fish|·', en: 'Grandma holds on and tries.', zh: '奶奶扶着，试着来。' },
      { art: 'beach|grandma,mom|fish|!', en: 'The water goes over Grandma\'s face.', zh: '水没过了奶奶的脸。' },
      { art: 'beach|grandma,mom|fish|★', en: 'Now Grandma can move in the water. We look at the front and the chick.', zh: '现在奶奶能在水里动了。我们看看前面和小鸡。' },
      { art: 'beach|grandma,mom|fish|·', en: 'They will practice again next time.', zh: '下次他们再练一次。' }
    ],
    quiz: [
      { q: '这一本里，奶奶看到了下面哪一样？', opts: ['鱼', '宝宝', '小虫'], a: 0, kind: 'recall' },
      { q: '读到最后之前，你猜奶奶他们接下来会怎么样？', opts: ['只把中文看一遍', '一直重复原来那个动作', '他们会扶着慢慢来，就学会了'], a: 2, kind: 'infer' },
      { q: '学一样新本领有点怕，你会怎么做？', opts: ['不学了', '一次就想学会', '扶着、慢慢来，一步一步试'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b28', lv: 'L3', tag: '故事', title: 'The King and a Ring', zh: '国王和戒指',
    emoji: '👑', color: '#C6DEF6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「帮个忙」这条线，认读 1 个新词。',
    trap: 'sh 把嘴唇撅圆、th 把舌尖轻轻放在上下门牙中间；ck 只发一个 k，别读两遍。',
    summary: '《国王和戒指》是「帮个忙」：爷爷和爸爸在家，围绕图画把一件事读到底。本本词卡：图画。读前先看词卡，读完合上书说一说。',
    retell: '三句话复述：先……、后来……、最后……（这一本是「帮个忙」。）',
    think: '说一次你请人帮忙的经历：开口之前你卡在哪儿？对方先看出了什么？',
    pre: [
      { art: '🖼️', en: 'picture', zh: '图画' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👴', en: 'grandpa', zh: '爷爷' }
    ],
    sight: [],
    newWords: [
      { w: 'picture', zh: '图画' }
    ],
    pages: [
      { art: 'home|grandpa,dad|picture|·', en: 'Grandpa is at home with a picture.', zh: '爷爷带着图画在家。' },
      { art: 'home|grandpa,dad|picture|♪', en: 'Grandpa wants to do it alone.', zh: '爷爷想自己一个人做。' },
      { art: 'home|grandpa,dad|picture|👀', en: 'The picture is too much for one pair of hands. We say the words: sand, ham and ring.', zh: '一个人搬不动这个图画。我们念这三个词：沙子、火腿和响。' },
      { art: 'home|grandpa,dad|picture|?', en: '"Can you help me?" asks Grandpa.', zh: '「能帮我一下吗？」爷爷问。' },
      { art: 'home|grandpa,dad|picture|·', en: 'They both pull, but it does not move.', zh: '两个人一起拉，还是不动。' },
      { art: 'home|grandpa,dad|picture|!', en: 'Pulling harder does not help.', zh: '再用力也没用。' },
      { art: 'home|grandpa,dad|picture|★', en: 'Now the picture moves easily. We look at the sand and the ham.', zh: '这下图画轻轻就动了。我们看看沙子和火腿。' },
      { art: 'home|grandpa,dad|picture|·', en: 'Next time they will look around first.', zh: '下次他们会先看看四周。' }
    ],
    quiz: [
      { q: '爷爷和爸爸的这一本里，出现了下面哪一样？', opts: ['奶酪', '床', '图画'], a: 2, kind: 'recall' },
      { q: '读到最后之前，你猜爷爷他们接下来会怎么样？', opts: ['先看看四周，挪开挡路的东西就成了', '把东西丢下不管了', '把东西丢下不管了（说）'], a: 0, kind: 'infer' },
      { q: '两个人一起使劲还是搬不动图画，你会怎么做？', opts: ['叫更多人一起使劲', '先停一下，看看是不是有别的东西挡着', '就这么算了'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b29', lv: 'L3', tag: '观察', title: 'A Moth on the Path', zh: '小路上的飞蛾',
    emoji: '🦋', color: '#E0CFF3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「叶子落了」这条线，认读 3 个新词。',
    trap: 'sh 把嘴唇撅圆、th 把舌尖轻轻放在上下门牙中间；ck 只发一个 k，别读两遍。',
    summary: '《小路上的飞蛾》是「叶子落了」：妈妈和明明在花园，围绕飞蛾把一件事读到底。本本词卡：飞蛾、摘、季节。读前先看词卡，读完合上书说一说。',
    retell: '三句话复述：先……、后来……、最后……（这一本是「叶子落了」。）',
    think: '说说你注意到的一个自然小变化：它说明了什么？',
    pre: [
      { art: '🦋', en: 'moth', zh: '飞蛾' },
      { art: '🏃', en: 'pick', zh: '摘' },
      { art: '🍂', en: 'season', zh: '季节' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'and', zh: 'and' }
    ],
    sight: ['beach', 'tree', 'watch'],
    newWords: [
      { w: 'moth', zh: '飞蛾' },
      { w: 'pick', zh: '摘' },
      { w: 'season', zh: '季节' }
    ],
    pages: [
      { art: 'garden|mom,ming|moth|·', en: 'The moth falls from the tree.', zh: '飞蛾从树上落下来。' },
      { art: 'garden|mom,ming|moth|♪', en: 'Mom wants to know why.', zh: '妈妈想知道为什么。' },
      { art: 'garden|mom,ming|moth|👀', en: 'They look at the tree and the moth. We say the words: moth, dish and beach.', zh: '他们看看树和飞蛾。我们念这三个词：飞蛾、盘子和沙滩。' },
      { art: 'garden|mom,ming|moth|?', en: '"Why does it fall?" asks Mom.', zh: '「它为什么会掉下来？」妈妈问。' },
      { art: 'garden|mom,ming|moth|·', en: 'They pick up the moth and look at it.', zh: '他们捡起飞蛾，仔细看。' },
      { art: 'garden|mom,ming|moth|!', en: 'The answer is not on the moth.', zh: '答案不在飞蛾上面。' },
      { art: 'garden|mom,ming|moth|★', en: 'Many moths are falling. It is the season. We look at the moth and the dish.', zh: '好多飞蛾都在落，是季节到了。我们看看飞蛾和盘子。' },
      { art: 'garden|mom,ming|moth|·', en: 'They will watch the tree change.', zh: '他们会看着这棵树变化。' }
    ],
    quiz: [
      { q: '在花园读的这一本里，有下面哪一样？', opts: ['狗', '盒子', '飞蛾'], a: 2, kind: 'recall' },
      { q: '读到最后之前，你猜妈妈他们接下来会怎么样？', opts: ['他们会看整棵树，明白是季节到了', '换一本书不读了（杯子）', '换一本书不读了'], a: 0, kind: 'infer' },
      { q: '看到一个小变化想弄清原因，你会怎么做？', opts: ['只盯着那一样看', '不只看那一样，看看周围更大的情况', '不管它'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b30', lv: 'L3', tag: '海边', title: 'Sing at the Beach', zh: '在沙滩上唱歌',
    emoji: '🏖️', color: '#F6C9E3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「找贝壳」这条线，认读 5 个新词。',
    trap: 'sh 把嘴唇撅圆、th 把舌尖轻轻放在上下门牙中间；ck 只发一个 k，别读两遍。',
    summary: '《在沙滩上唱歌》是「找贝壳」：爸爸和丽丽在沙滩，围绕沙滩把一件事读到底。本本词卡：贝壳、特别、翅膀、长椅、刷子。读前先看词卡，读完合上书说一说。',
    retell: '三句话复述：先……、后来……、最后……（这一本是「找贝壳」。）',
    think: '说说你收藏过的小东西：它是哪里特别？',
    pre: [
      { art: '📦', en: 'shell', zh: '贝壳' },
      { art: '✨', en: 'special', zh: '特别' },
      { art: '🕊️', en: 'wing', zh: '翅膀' },
      { art: '🪑', en: 'bench', zh: '长椅' },
      { art: '🖌️', en: 'brush', zh: '刷子' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'they', zh: 'they' }
    ],
    sight: ['beach', 'closely', 'water'],
    newWords: [
      { w: 'shell', zh: '贝壳' },
      { w: 'special', zh: '特别' },
      { w: 'wing', zh: '翅膀' },
      { w: 'bench', zh: '长椅' },
      { w: 'brush', zh: '刷子' }
    ],
    pages: [
      { art: 'beach|dad,lili|beach|·', en: 'They find a beach and many shells by the water.', zh: '他们在水边找到沙滩和好多贝壳。' },
      { art: 'beach|dad,lili|beach|♪', en: 'Dad wants to find one special shell.', zh: '爸爸想找一个特别的贝壳。' },
      { art: 'beach|dad,lili|beach|👀', en: 'They look at all the shells. We say the words: wing, bench and brush.', zh: '他们看看所有的贝壳。我们念这三个词：翅膀、长椅和刷子。' },
      { art: 'beach|dad,lili|beach|?', en: '"Which one is special?" asks Dad.', zh: '「哪一个特别？」爸爸问。' },
      { art: 'beach|dad,lili|beach|·', en: 'They pick up one and then another.', zh: '他们捡起一个，又捡起一个。' },
      { art: 'beach|dad,lili|beach|!', en: 'They all look the same.', zh: '看起来都差不多。' },
      { art: 'beach|dad,lili|beach|★', en: 'There! One shell is a little different. We look at the wing and the bench.', zh: '有了！有一个贝壳不太一样。我们看看翅膀和长椅。' },
      { art: 'beach|dad,lili|beach|·', en: 'They will look closely next time too.', zh: '下次他们也会仔细看。' }
    ],
    quiz: [
      { q: '这一本里，爸爸看到了下面哪一样？', opts: ['狗', '火腿', '刷子'], a: 2, kind: 'recall' },
      { q: '读到最后之前，你猜爸爸他们接下来会怎么样？', opts: ['只把中文看一遍（厨房）', '他们会仔细看，找到那个特别的', '只把中文看一遍'], a: 1, kind: 'infer' },
      { q: '想找出一样特别的东西，你会怎么做？', opts: ['看最大的', '随便挑一个', '一处一处仔细比，看细节'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b31', lv: 'L3', tag: '家务', title: 'Wash the Dish', zh: '洗盘子',
    emoji: '🍽️', color: '#BFE6DF',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「一起做」这条线，认读 1 个新词。',
    trap: 'sh 把嘴唇撅圆、th 把舌尖轻轻放在上下门牙中间；ck 只发一个 k，别读两遍。',
    summary: '《洗盘子》是「一起做」：明明和奶奶在家，围绕盘子把一件事读到底。本本词卡：奶酪。读前先看词卡，读完合上书说一说。',
    retell: '三句话复述：先……、后来……、最后……（这一本是「一起做」。）',
    think: '说一件你做过的、步骤很多的事：哪一步最容易漏？下次怎么提醒自己？',
    pre: [
      { art: '🧀', en: 'cheese', zh: '奶酪' },
      { art: '📦', en: 'they', zh: 'they' },
      { art: '📦', en: 'the', zh: 'the' }
    ],
    sight: ['brush'],
    newWords: [
      { w: 'cheese', zh: '奶酪' }
    ],
    pages: [
      { art: 'kitchen|ming,grandma|dish|·', en: 'Ming has an idea at home.', zh: '明明在家有了个主意。' },
      { art: 'kitchen|ming,grandma|dish|♪', en: '"Let us make a dish," says Ming.', zh: '「我们做盘子吧。」明明说。' },
      { art: 'kitchen|ming,grandma|dish|👀', en: 'They get everything ready. We say the words: cheese, brush and bench.', zh: '他们把要用的东西备齐。我们念这三个词：奶酪、刷子和长椅。' },
      { art: 'kitchen|ming,grandma|dish|?', en: '"What do we need first?" asks Grandma.', zh: '「先要什么？」奶奶问。' },
      { art: 'kitchen|ming,grandma|dish|·', en: 'They make a list, and they start.', zh: '他们列了个单子，就动手了。' },
      { art: 'kitchen|ming,grandma|dish|!', en: 'It does not look right. Something is wrong.', zh: '样子不对，哪里出了岔子。' },
      { art: 'kitchen|ming,grandma|dish|★', en: 'This time the dish is just right. We look at the cheese and the brush.', zh: '这次盘子正好。我们看看奶酪和刷子。' },
      { art: 'kitchen|ming,grandma|dish|·', en: 'They write down what they would do next time.', zh: '他们写下下次要怎么做。' }
    ],
    quiz: [
      { q: '明明和奶奶的这一本里，出现了下面哪一样？', opts: ['刷子', '狐狸', '厨房'], a: 0, kind: 'recall' },
      { q: '读到最后之前，你猜明明他们接下来会怎么样？', opts: ['把步骤按顺序重做一次，就做成了', '跳过中间那几页', '把东西丢下不管了'], a: 0, kind: 'infer' },
      { q: '做一件步骤很多的事（像做盘子那样），你会先做什么？', opts: ['直接跳过开头的步骤', '想到哪步做哪步', '先把步骤写下来，再一步一步做'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b32', lv: 'L3', tag: '故事', title: 'A Wish for a Chick', zh: '给小鸡的愿望',
    emoji: '🐤', color: '#F2E2A8',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「喂小动物」这条线，认读 3 个新词。',
    trap: 'sh 把嘴唇撅圆、th 把舌尖轻轻放在上下门牙中间；ck 只发一个 k，别读两遍。',
    summary: '《给小鸡的愿望》是「喂小动物」：丽丽和爷爷在农场，围绕小鸡把一件事读到底。本本词卡：喂、食物、小路。读前先看词卡，读完合上书说一说。',
    retell: '三句话复述：先……、后来……、最后……（这一本是「喂小动物」。）',
    think: '说说你知道的一种小动物吃什么：你是怎么知道的？',
    pre: [
      { art: '🏃', en: 'feed', zh: '喂' },
      { art: '📦', en: 'food', zh: '食物' },
      { art: '🛤️', en: 'path', zh: '小路' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'it', zh: 'it' }
    ],
    sight: ['cheese', 'eat', 'eats'],
    newWords: [
      { w: 'feed', zh: '喂' },
      { w: 'food', zh: '食物' },
      { w: 'path', zh: '小路' }
    ],
    pages: [
      { art: 'farm|lili,grandpa|chick|·', en: 'The chick looks hungry.', zh: '小鸡看起来饿了。' },
      { art: 'farm|lili,grandpa|chick|♪', en: 'Lili wants to feed it.', zh: '丽丽想喂它。' },
      { art: 'farm|lili,grandpa|chick|👀', en: 'They look at the food and the chick. We say the words: wing, cheese and path.', zh: '他们看看食物和小鸡。我们念这三个词：翅膀、奶酪和小路。' },
      { art: 'farm|lili,grandpa|chick|?', en: '"What does it eat?" asks Grandpa.', zh: '「它吃什么？」爷爷问。' },
      { art: 'farm|lili,grandpa|chick|·', en: 'Lili gives it some food.', zh: '丽丽给了它一些吃的。' },
      { art: 'farm|lili,grandpa|chick|!', en: 'The chick does not eat it.', zh: '小鸡不吃。' },
      { art: 'farm|lili,grandpa|chick|★', en: 'The chick eats it all up. We look at the wing and the cheese.', zh: '小鸡全都吃完了。我们看看翅膀和奶酪。' },
      { art: 'farm|lili,grandpa|chick|·', en: 'They will feed it again tomorrow.', zh: '明天他们还会来喂它。' }
    ],
    quiz: [
      { q: '在农场读的这一本里，有下面哪一样？', opts: ['盖子', '食物', '奶奶'], a: 1, kind: 'recall' },
      { q: '读到最后之前，你猜丽丽他们接下来会怎么样？', opts: ['换一本书不读了', '一直重复原来那个动作', '他们会换成对的食物，它就吃了'], a: 2, kind: 'infer' },
      { q: '想喂小动物，你会先做什么？', opts: ['先弄清楚它吃什么', '一直喂到它吃', '随便给点吃的'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b33', lv: 'L3', tag: '发音', title: 'Say It: Ship, Chip', zh: '说一说：ship chip',
    emoji: '🗣️', color: '#D9D2F5',
    track: 'drill',
    goal: '把本级难点音听准、说准，并能在整句里读对。这一本走「跟读整句」这条线，认读 1 个新词。',
    trap: 'sh 把嘴唇撅圆、th 把舌尖轻轻放在上下门牙中间；ck 只发一个 k，别读两遍。',
    summary: '《说一说：ship chip》是「跟读整句」：奶奶和妈妈在家，围绕轮船把一件事读到底。本本词卡：袜子。读前先看词卡，读完合上书说一说。',
    retell: '三句话复述：先……、后来……、最后……（这一本是「跟读整句」。）',
    think: '挑书里最长的一句英文，先听整句，再分成两段读给家长听。',
    pre: [
      { art: '🧦', en: 'sock', zh: '袜子' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👵', en: 'grandma', zh: '奶奶' }
    ],
    sight: ['picture'],
    newWords: [
      { w: 'sock', zh: '袜子' }
    ],
    pages: [
      { art: 'table|grandma,mom|ship|·', en: 'Grandma opens a book at home.', zh: '奶奶在家翻开一本书。' },
      { art: 'table|grandma,mom|ship|♪', en: 'Grandma wants to read it out loud.', zh: '奶奶想把它读出来。' },
      { art: 'table|grandma,mom|ship|👀', en: 'The sentence with the word "ship" is long. We say the words: path, path and sock.', zh: '带着「ship」这个词的那一句很长。我们念这三个词：小路、小路和袜子。' },
      { art: 'table|grandma,mom|ship|?', en: '"Where do I stop for breath?" asks Grandma.', zh: '「在哪里换气？」奶奶问。' },
      { art: 'table|grandma,mom|ship|·', en: 'Grandma reads it one word at a time.', zh: '奶奶一个词一个词地读。' },
      { art: 'table|grandma,mom|ship|!', en: 'It sounds broken, not like a sentence.', zh: '听着是碎的，不像一句话。' },
      { art: 'table|grandma,mom|ship|★', en: 'Now it sounds like one sentence. We look at the path and the path.', zh: '这下听起来像一整句了。我们看看小路和小路。' },
      { art: 'table|grandma,mom|ship|·', en: 'They try the next sentence about a picture.', zh: '他们接着试讲图画的下一句。' }
    ],
    quiz: [
      { q: '这一本里，奶奶看到了下面哪一样？', opts: ['轮船', '厨房', '网'], a: 0, kind: 'recall' },
      { q: '读到最后之前，你猜奶奶他们接下来会怎么样？', opts: ['把东西丢下不管了', '只把中文看一遍', '听完整句、分成两段读，就连贯了'], a: 2, kind: 'infer' },
      { q: '遇到像「ship」那一句这样很长的英文句子，你会怎么读？', opts: ['只看中文跳过英文', '先听整句，再按意思分成两三段读', '一个词一个词慢慢拼'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b34', lv: 'L3', tag: '小知识', title: 'A Long Wing', zh: '长长的翅膀',
    emoji: '🕊️', color: '#FAD3B6',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。这一本走「问一问」这条线，不引入新词，全部是读过的词。',
    trap: 'sh 把嘴唇撅圆、th 把舌尖轻轻放在上下门牙中间；ck 只发一个 k，别读两遍。',
    summary: '《长长的翅膀》是「问一问」：爷爷和爸爸在图书馆，围绕翅膀把一件事读到底。本本词卡：这一本不引入新词，全部是读过的词。读前先看词卡，读完合上书说一说。',
    retell: '三句话复述：先……、后来……、最后……（这一本是「问一问」。）',
    think: '回想一次「问了还是没懂」：把当时的问题改成一个更小的、指着某个词的问题。',
    pre: [
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👴', en: 'grandpa', zh: '爷爷' }
    ],
    sight: ['library'],
    newWords: [

    ],
    pages: [
      { art: 'library|grandpa,dad|wing|·', en: 'Grandpa is reading the word "wing" in the library.', zh: '爷爷在图书馆读「wing」这个词。' },
      { art: 'library|grandpa,dad|wing|♪', en: 'Grandpa wants to understand it.', zh: '爷爷想把它弄明白。' },
      { art: 'library|grandpa,dad|wing|👀', en: 'One sentence does not make sense. We say the words: sock, sock and shed.', zh: '有一句怎么也读不通。我们念这三个词：袜子、袜子和小棚。' },
      { art: 'library|grandpa,dad|wing|?', en: '"What does this part mean?" asks Grandpa.', zh: '「这一段什么意思？」爷爷问。' },
      { art: 'library|grandpa,dad|wing|·', en: 'Dad answers, but Grandpa still looks lost.', zh: '爸爸答了，爷爷还是没懂。' },
      { art: 'library|grandpa,dad|wing|!', en: 'The answer was right, but not the right answer.', zh: '答案没错，却不是问的那个。' },
      { art: 'library|grandpa,dad|wing|★', en: 'Now the whole sentence is clear. We look at the sock and the sock.', zh: '这下整句都清楚了。我们看看袜子和袜子。' },
      { art: 'library|grandpa,dad|wing|·', en: 'They write down one new question.', zh: '他们又写下一个新问题。' }
    ],
    quiz: [
      { q: '爷爷和爸爸的这一本里，出现了下面哪一样？', opts: ['小路', '图书馆', '嘴唇'], a: 1, kind: 'recall' },
      { q: '读到最后之前，你猜爷爷他们接下来会怎么样？', opts: ['把东西丢下不管了', '指着自己不懂的那个词再问一遍，就明白了', '换一本书不读了'], a: 1, kind: 'infer' },
      { q: '别人把「wing」解释完你还是没懂，你会怎么做？', opts: ['点点头装作懂了', '把整段跳过去', '指出具体哪个词不懂，再问一遍'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b35', lv: 'L3', tag: '小知识', title: 'Fresh Cheese', zh: '新鲜的奶酪',
    emoji: '🧀', color: '#C8E7F0',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。这一本走「合上书讲一遍」这条线，认读 1 个新词。',
    trap: 'sh 把嘴唇撅圆、th 把舌尖轻轻放在上下门牙中间；ck 只发一个 k，别读两遍。',
    summary: '《新鲜的奶酪》是「合上书讲一遍」：妈妈和明明在家，围绕奶酪把一件事读到底。本本词卡：薯片。读前先看词卡，读完合上书说一说。',
    retell: '三句话复述：先……、后来……、最后……（这一本是「合上书讲一遍」。）',
    think: '合上书，用「谁 → 在哪儿 → 出了什么事 → 结果」把奶酪这一本讲给家长听。',
    pre: [
      { art: '🍚', en: 'chips', zh: '薯片' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👩', en: 'mom', zh: '妈妈' }
    ],
    sight: ['cheese', 'water'],
    newWords: [
      { w: 'chips', zh: '薯片' }
    ],
    pages: [
      { art: 'kitchen|mom,ming|cheese|·', en: 'Mom has just finished a book at home.', zh: '妈妈刚在家读完一本书。' },
      { art: 'kitchen|mom,ming|cheese|♪', en: 'Ming wants to hear all about it.', zh: '明明想听他讲讲。' },
      { art: 'kitchen|mom,ming|cheese|👀', en: 'Mom thinks about the cheese in the book. We say the words: shed, shed and chips.', zh: '妈妈想着书里的奶酪。我们念这三个词：小棚、小棚和薯片。' },
      { art: 'kitchen|mom,ming|cheese|?', en: '"Where do I start?" asks Mom.', zh: '「从哪儿讲起？」妈妈问。' },
      { art: 'kitchen|mom,ming|cheese|·', en: 'Mom tells the last part first.', zh: '妈妈先讲了结尾。' },
      { art: 'kitchen|mom,ming|cheese|!', en: 'Ming cannot follow the story.', zh: '明明听不明白。' },
      { art: 'kitchen|mom,ming|cheese|★', en: 'This time Ming can see the whole thing. We look at the shed and the shed.', zh: '这回明明全听明白了。我们看看小棚和小棚。' },
      { art: 'kitchen|mom,ming|cheese|·', en: 'Tomorrow they will read about some water.', zh: '明天他们要读讲水的书。' }
    ],
    quiz: [
      { q: '在家读的这一本里，有下面哪一样？', opts: ['茶', '猪', '薯片'], a: 2, kind: 'recall' },
      { q: '读到最后之前，你猜妈妈他们接下来会怎么样？', opts: ['换一本书不读了', '按「谁 → 在哪儿 → 出了什么事」重讲一遍，别人就听懂了', '只把中文看一遍'], a: 1, kind: 'infer' },
      { q: '要把讲奶酪的这本读过的书讲给别人听，你会怎么开头？', opts: ['先报书名和生词表', '先说谁、在哪儿，再按顺序说出了什么事', '直接从最精彩的那句开始'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b36', lv: 'L3', tag: '复习', title: 'Down by the Shed', zh: '棚子边',
    emoji: '🛖', color: '#E8D9B5',
    track: 'review',
    goal: '把本级和前面级别的词再读一遍、串成一个故事。这一本走「合上书讲一遍」这条线，不引入新词，全部是读过的词。',
    trap: 'sh 把嘴唇撅圆、th 把舌尖轻轻放在上下门牙中间；ck 只发一个 k，别读两遍。',
    summary: '《棚子边》是「合上书讲一遍」：爸爸和丽丽在图书馆，围绕小棚把一件事读到底。本本词卡：这一本不引入新词，全部是读过的词。读前先看词卡，读完合上书说一说。',
    retell: '三句话复述：先……、后来……、最后……（这一本是「合上书讲一遍」。）',
    think: '合上书，用「谁 → 在哪儿 → 出了什么事 → 结果」把小棚这一本讲给家长听。',
    pre: [
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👨', en: 'dad', zh: '爸爸' }
    ],
    sight: ['library', 'park'],
    newWords: [

    ],
    pages: [
      { art: 'library|dad,lili|shed|·', en: 'Dad has just finished a book in the library.', zh: '爸爸刚在图书馆读完一本书。' },
      { art: 'library|dad,lili|shed|♪', en: 'Lili wants to hear all about it.', zh: '丽丽想听他讲讲。' },
      { art: 'library|dad,lili|shed|👀', en: 'Dad thinks about the shed in the book. We say the words: chips, chips and fog.', zh: '爸爸想着书里的小棚。我们念这三个词：薯片、薯片和雾。' },
      { art: 'library|dad,lili|shed|?', en: '"Where do I start?" asks Dad.', zh: '「从哪儿讲起？」爸爸问。' },
      { art: 'library|dad,lili|shed|·', en: 'Dad tells the last part first.', zh: '爸爸先讲了结尾。' },
      { art: 'library|dad,lili|shed|!', en: 'Lili cannot follow the story.', zh: '丽丽听不明白。' },
      { art: 'library|dad,lili|shed|★', en: 'This time Lili can see the whole thing. We look at the chips and the chips.', zh: '这回丽丽全听明白了。我们看看薯片和薯片。' },
      { art: 'library|dad,lili|shed|·', en: 'Tomorrow they will read about a park.', zh: '明天他们要读讲公园的书。' }
    ],
    quiz: [
      { q: '这一本里，爸爸看到了下面哪一样？', opts: ['图书馆', '二', '米饭'], a: 0, kind: 'recall' },
      { q: '读到最后之前，你猜爸爸他们接下来会怎么样？', opts: ['按「谁 → 在哪儿 → 出了什么事」重讲一遍，别人就听懂了', '跳过中间那几页', '只把中文看一遍'], a: 0, kind: 'infer' },
      { q: '要把讲小棚的这本读过的书讲给别人听，你会怎么开头？', opts: ['直接从最精彩的那句开始', '先报书名和生词表', '先说谁、在哪儿，再按顺序说出了什么事'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b37', lv: 'L4', tag: '池塘', title: 'The Frog on the Stone', zh: '石头上的青蛙',
    emoji: '🐸', color: '#F6C6C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「问一问」这条线，认读 1 个新词。',
    trap: '连缀中间不加元音：tree 是「tr-ee」一个词，不是「特-瑞」两个音。',
    summary: '《石头上的青蛙》是「问一问」：明明和奶奶在图书馆，围绕青蛙把一件事读到底。本本词卡：青蛙。读前先看词卡，读完合上书说一说。',
    retell: '四句话复述：谁、在哪儿、遇到什么麻烦、怎么解决。（这一本是「问一问」。）',
    think: '回想一次「问了还是没懂」：把当时的问题改成一个更小的、指着某个词的问题。',
    pre: [
      { art: '🐸', en: 'frog', zh: '青蛙' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👦', en: 'ming', zh: '明明' }
    ],
    sight: ['library'],
    newWords: [
      { w: 'frog', zh: '青蛙' }
    ],
    pages: [
      { art: 'library|ming,grandma|frog|·', en: 'Ming is reading the word "frog" in the library.', zh: '明明在图书馆读「frog」这个词。' },
      { art: 'library|ming,grandma|frog|♪', en: 'Ming wants to understand it.', zh: '明明想把它弄明白。' },
      { art: 'library|ming,grandma|frog|👀', en: 'One sentence does not make sense. They wrote down frog, song and fog.', zh: '有一句怎么也读不通。他们写下：青蛙、歌和雾。' },
      { art: 'library|ming,grandma|frog|?', en: '"What does this part mean?" asks Ming.', zh: '「这一段什么意思？」明明问。' },
      { art: 'library|ming,grandma|frog|·', en: 'Grandma answers, but Ming still looks lost.', zh: '奶奶答了，明明还是没懂。' },
      { art: 'library|ming,grandma|frog|!', en: 'The answer was right, but not the right answer.', zh: '答案没错，却不是问的那个。' },
      { art: 'library|ming,grandma|duck|♥', en: 'Grandma asks, "Which word is the hard one?"', zh: '奶奶反问：「难的是哪个词？」' },
      { art: 'library|ming,grandma|frog|★', en: 'Now the whole sentence is clear. We look at the frog and the song.', zh: '这下整句都清楚了。我们看看青蛙和歌。' },
      { art: 'library|ming,grandma|frog|·', en: 'They write down one new question.', zh: '他们又写下一个新问题。' }
    ],
    quiz: [
      { q: '明明和奶奶的这一本里，出现了下面哪一样？', opts: ['底部', '钟', '青蛙'], a: 2, kind: 'recall' },
      { q: '明明第一次为什么没听懂「frog」？', opts: ['因为读得太快', '问题太大，没指向真正卡住的那个词', '因为答案太短'], a: 1, kind: 'infer' },
      { q: '别人把「frog」解释完你还是没懂，你会怎么做？', opts: ['把整段跳过去', '点点头装作懂了', '指出具体哪个词不懂，再问一遍'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b38', lv: 'L4', tag: '运动会', title: 'A Blue Flag', zh: '蓝色的旗子',
    emoji: '🚩', color: '#F9DFB4',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「轮到谁」这条线，认读 3 个新词。',
    trap: '连缀中间不加元音：tree 是「tr-ee」一个词，不是「特-瑞」两个音。',
    summary: '《蓝色的旗子》是「轮到谁」：丽丽和爷爷在学校，围绕旗子把一件事读到底。本本词卡：旗子、钟、拿。读前先看词卡，读完合上书说一说。',
    retell: '四句话复述：谁、在哪儿、遇到什么麻烦、怎么解决。（这一本是「轮到谁」。）',
    think: '说一次你和别人轮流用东西的经历：你们是怎么定先后的？',
    pre: [
      { art: '🚩', en: 'flag', zh: '旗子' },
      { art: '🕐', en: 'clock', zh: '钟' },
      { art: '🏃', en: 'take', zh: '拿' },
      { art: '📦', en: 'they', zh: 'they' },
      { art: '📦', en: 'the', zh: 'the' }
    ],
    sight: ['street', 'use'],
    newWords: [
      { w: 'flag', zh: '旗子' },
      { w: 'clock', zh: '钟' },
      { w: 'take', zh: '拿' }
    ],
    pages: [
      { art: 'school|lili,grandpa|flag|·', en: 'They both want to use the flag.', zh: '两个人都想用旗子。' },
      { art: 'school|lili,grandpa|flag|♪', en: 'They both want it now.', zh: '他们都想现在用。' },
      { art: 'school|lili,grandpa|flag|👀', en: 'They look at each other. They wrote down flag, clock and street.', zh: '他们看看对方。他们写下：旗子、钟和街道。' },
      { art: 'school|lili,grandpa|flag|?', en: '"Who goes first?" asks Grandpa.', zh: '「谁先用？」爷爷问。' },
      { art: 'school|lili,grandpa|flag|·', en: 'They both hold the flag.', zh: '两个人都抓着旗子。' },
      { art: 'school|lili,grandpa|flag|!', en: 'Nobody can use it now.', zh: '现在谁都用不了。' },
      { art: 'school|lili,grandpa|ball|♥', en: 'Grandpa says, "We can take turns."', zh: '爷爷说：「我们可以轮流。」' },
      { art: 'school|lili,grandpa|flag|★', en: 'Both of them get to use the flag. We look at the flag and the clock.', zh: '两个人都用到了旗子。我们看看旗子和钟。' },
      { art: 'school|lili,grandpa|flag|·', en: 'They can both use the flag now.', zh: '现在两个人都能用旗子。' }
    ],
    quiz: [
      { q: '在学校读的这一本里，有下面哪一样？', opts: ['钟', '爸爸', '刷子'], a: 0, kind: 'recall' },
      { q: '为什么抓着不放反而谁都用不了？', opts: ['因为时间不够', '因为东西太少', '两个人抢，谁也用不成'], a: 2, kind: 'infer' },
      { q: '两个人都想用一样东西，你会怎么做？', opts: ['一直抓着不放', '把它弄坏', '商量轮流用，一个先一个后'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b39', lv: 'L4', tag: '夜空', title: 'Stars in the Sky', zh: '天上的星星',
    emoji: '⭐', color: '#CDE7C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「睡不着」这条线，认读 4 个新词。',
    trap: '连缀中间不加元音：tree 是「tr-ee」一个词，不是「特-瑞」两个音。',
    summary: '《天上的星星》是「睡不着」：奶奶和妈妈在家，围绕星星把一件事读到底。本本词卡：星星、光、云、醒着。读前先看词卡，读完合上书说一说。',
    retell: '四句话复述：谁、在哪儿、遇到什么麻烦、怎么解决。（这一本是「睡不着」。）',
    think: '说说你睡不着的一个晚上：你是怎么睡着的？',
    pre: [
      { art: '⭐', en: 'star', zh: '星星' },
      { art: '🌿', en: 'light', zh: '光' },
      { art: '☁️', en: 'cloud', zh: '云' },
      { art: '✨', en: 'awake', zh: '醒着' },
      { art: '📦', en: 'they', zh: 'they' },
      { art: '📦', en: 'to', zh: 'to' }
    ],
    sight: ['eyes', 'quiet', 'room', 'sleep'],
    newWords: [
      { w: 'star', zh: '星星' },
      { w: 'light', zh: '光' },
      { w: 'cloud', zh: '云' },
      { w: 'awake', zh: '醒着' }
    ],
    pages: [
      { art: 'night|grandma,mom|star|·', en: 'Grandma is in bed at night.', zh: '夜里奶奶躺在床上。' },
      { art: 'night|grandma,mom|star|♪', en: 'They want to go to sleep.', zh: '他们想睡着。' },
      { art: 'night|grandma,mom|star|👀', en: 'They look at the star in the dark room. They wrote down star, light and cloud.', zh: '他们看看黑屋子里的星星。他们写下：星星、光和云。' },
      { art: 'night|grandma,mom|star|?', en: '"Why can I not sleep?" asks Grandma.', zh: '「怎么睡不着？」奶奶问。' },
      { art: 'night|grandma,mom|star|·', en: 'They close their eyes and try.', zh: '他们闭上眼睛试。' },
      { art: 'night|grandma,mom|star|!', en: 'They are still awake.', zh: '还是醒着。' },
      { art: 'night|grandma,mom|cap|♥', en: 'Mom says, "Listen to the quiet sounds."', zh: '妈妈说：「听听安静的声音。」' },
      { art: 'night|grandma,mom|star|★', en: 'Slowly, they go to sleep. We look at the star and the light.', zh: '慢慢地，他们睡着了。我们看看星星和光。' },
      { art: 'night|grandma,mom|star|·', en: 'They will listen to quiet sounds again.', zh: '他们还会听安静的声音。' }
    ],
    quiz: [
      { q: '这一本里，奶奶看到了下面哪一样？', opts: ['光', '朋友', '杯子'], a: 0, kind: 'recall' },
      { q: '为什么使劲想睡反而睡不着？', opts: ['因为天太冷', '因为床太硬', '用力过头，人就静不下来'], a: 2, kind: 'infer' },
      { q: '睡不着的时候，你会怎么做？', opts: ['听听安静的声音，让自己慢慢静下来', '爬起来玩', '一直使劲闭眼'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b40', lv: 'L4', tag: '上学', title: 'The Clock at School', zh: '学校的钟',
    emoji: '🕐', color: '#C6DEF6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「排好队」这条线，认读 2 个新词。',
    trap: '连缀中间不加元音：tree 是「tr-ee」一个词，不是「特-瑞」两个音。',
    summary: '《学校的钟》是「排好队」：爷爷和爸爸在学校，围绕钟把一件事读到底。本本词卡：鼓、线。读前先看词卡，读完合上书说一说。',
    retell: '四句话复述：谁、在哪儿、遇到什么麻烦、怎么解决。（这一本是「排好队」。）',
    think: '说说你排队的一次经历：排好队以后是不是更快了？',
    pre: [
      { art: '🥁', en: 'drum', zh: '鼓' },
      { art: '📦', en: 'line', zh: '线' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'they', zh: 'they' }
    ],
    sight: [],
    newWords: [
      { w: 'drum', zh: '鼓' },
      { w: 'line', zh: '线' }
    ],
    pages: [
      { art: 'school|grandpa,dad|clock|·', en: 'They all want to go to the school for the clock.', zh: '大家都想去学校用钟。' },
      { art: 'school|grandpa,dad|clock|♪', en: 'They all want to go first.', zh: '大家都想先去。' },
      { art: 'school|grandpa,dad|clock|👀', en: 'They look at the door. They wrote down clock, school and drum.', zh: '他们看看门。他们写下：钟、学校和鼓。' },
      { art: 'school|grandpa,dad|clock|?', en: '"Who goes first?" asks Dad.', zh: '「谁先走？」爸爸问。' },
      { art: 'school|grandpa,dad|clock|·', en: 'They all go at the same time.', zh: '大家一起往前挤。' },
      { art: 'school|grandpa,dad|clock|!', en: 'Nobody can get through the door.', zh: '谁也过不去。' },
      { art: 'school|grandpa,dad|cap|♥', en: 'Dad says, "Make a line and wait."', zh: '爸爸说：「排好队，等一等。」' },
      { art: 'school|grandpa,dad|clock|★', en: 'Everyone gets through the door. We look at the clock and the school.', zh: '每个人都走过去了。我们看看钟和学校。' },
      { art: 'school|grandpa,dad|clock|·', en: 'They will make a line again next time.', zh: '下次他们还会排好队。' }
    ],
    quiz: [
      { q: '爷爷和爸爸的这一本里，出现了下面哪一样？', opts: ['钟', '手套', '狗'], a: 0, kind: 'recall' },
      { q: '为什么一起挤反而谁都过不去？', opts: ['因为大家太慢', '因为门太小', '挤在一起堵住了门'], a: 2, kind: 'infer' },
      { q: '大家都想先走，你会怎么做？', opts: ['等别人走完自己再走', '往前挤', '排好队，一个接一个'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b41', lv: 'L4', tag: '观察', title: 'Grass and a Crab', zh: '草和螃蟹',
    emoji: '🦀', color: '#E0CFF3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「等它长」这条线，认读 1 个新词。',
    trap: '连缀中间不加元音：tree 是「tr-ee」一个词，不是「特-瑞」两个音。',
    summary: '《草和螃蟹》是「等它长」：妈妈和明明在农场，围绕草把一件事读到底。本本词卡：草。读前先看词卡，读完合上书说一说。',
    retell: '四句话复述：谁、在哪儿、遇到什么麻烦、怎么解决。（这一本是「等它长」。）',
    think: '说一件练了很久才看见进步的事，讲讲等待的时候你是怎么想的。',
    pre: [
      { art: '🌿', en: 'grass', zh: '草' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👩', en: 'mom', zh: '妈妈' }
    ],
    sight: ['farm', 'light'],
    newWords: [
      { w: 'grass', zh: '草' }
    ],
    pages: [
      { art: 'farm|mom,ming|grass|·', en: 'Mom puts some grass on the farm.', zh: '妈妈把草放在农场。' },
      { art: 'farm|mom,ming|grass|♪', en: 'Mom wants to see it change.', zh: '妈妈想看见它变样。' },
      { art: 'farm|mom,ming|grass|👀', en: 'On the first day, nothing looks different. They wrote down grass, light and light.', zh: '头一天，看不出什么变化。他们写下：草、光和光。' },
      { art: 'farm|mom,ming|grass|?', en: '"Is it working at all?" asks Mom.', zh: '「到底有没有在长？」妈妈问。' },
      { art: 'farm|mom,ming|grass|·', en: 'They look again the next morning.', zh: '第二天早上他们又去看。' },
      { art: 'farm|mom,ming|grass|!', en: 'Still the same. Mom wants to give up.', zh: '还是老样子。妈妈想算了。' },
      { art: 'farm|mom,ming|brush|♥', en: 'Ming says, "Wait a little longer."', zh: '明明说：「再等一等。」' },
      { art: 'farm|mom,ming|grass|★', en: 'One morning, there is a small change. We look at the grass and the light.', zh: '有一天早上，出现了一点小变化。我们看看草和光。' },
      { art: 'farm|mom,ming|grass|·', en: 'They will come back and look again tomorrow.', zh: '明天他们还会再来看。' }
    ],
    quiz: [
      { q: '在农场读的这一本里，有下面哪一样？', opts: ['农场', '扇子', '葡萄'], a: 0, kind: 'recall' },
      { q: '为什么妈妈一开始以为没变化？', opts: ['因为把它搬走了', '变化太慢，一天里看不出来', '因为忘了去看'], a: 1, kind: 'infer' },
      { q: '学一样本领练了几天没进步（像等草那样），你会怎么做？', opts: ['按原来的方法接着练，过几天再看', '认定自己学不会', '立刻换一件别的事'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b42', lv: 'L4', tag: '池塘', title: 'Swim with the Swan', zh: '和天鹅一起游',
    emoji: '🦢', color: '#F6C9E3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「找贝壳」这条线，认读 3 个新词。',
    trap: '连缀中间不加元音：tree 是「tr-ee」一个词，不是「特-瑞」两个音。',
    summary: '《和天鹅一起游》是「找贝壳」：爸爸和丽丽在沙滩，围绕天鹅把一件事读到底。本本词卡：天鹅、螃蟹、细节。读前先看词卡，读完合上书说一说。',
    retell: '四句话复述：谁、在哪儿、遇到什么麻烦、怎么解决。（这一本是「找贝壳」。）',
    think: '说说你收藏过的小东西：它是哪里特别？',
    pre: [
      { art: '🦢', en: 'swan', zh: '天鹅' },
      { art: '🦀', en: 'crab', zh: '螃蟹' },
      { art: '💡', en: 'detail', zh: '细节' },
      { art: '📦', en: 'they', zh: 'they' },
      { art: '📦', en: 'the', zh: 'the' }
    ],
    sight: ['details', 'water'],
    newWords: [
      { w: 'swan', zh: '天鹅' },
      { w: 'crab', zh: '螃蟹' },
      { w: 'detail', zh: '细节' }
    ],
    pages: [
      { art: 'beach|dad,lili|swan|·', en: 'They find a swan and many shells by the water.', zh: '他们在水边找到天鹅和好多贝壳。' },
      { art: 'beach|dad,lili|swan|♪', en: 'Dad wants to find one special shell.', zh: '爸爸想找一个特别的贝壳。' },
      { art: 'beach|dad,lili|swan|👀', en: 'They look at all the shells. They wrote down crab, swan and drum.', zh: '他们看看所有的贝壳。他们写下：螃蟹、天鹅和鼓。' },
      { art: 'beach|dad,lili|swan|?', en: '"Which one is special?" asks Dad.', zh: '「哪一个特别？」爸爸问。' },
      { art: 'beach|dad,lili|swan|·', en: 'They pick up one and then another.', zh: '他们捡起一个，又捡起一个。' },
      { art: 'beach|dad,lili|swan|!', en: 'They all look the same.', zh: '看起来都差不多。' },
      { art: 'beach|dad,lili|duck|♥', en: 'Lili says, "Look at the small details."', zh: '丽丽说：「看看细小的地方。」' },
      { art: 'beach|dad,lili|swan|★', en: 'There! One shell is a little different. We look at the crab and the swan.', zh: '有了！有一个贝壳不太一样。我们看看螃蟹和天鹅。' },
      { art: 'beach|dad,lili|swan|·', en: 'They will look closely next time too.', zh: '下次他们也会仔细看。' }
    ],
    quiz: [
      { q: '这一本里，爸爸看到了下面哪一样？', opts: ['嘴唇', '水', '火腿'], a: 1, kind: 'recall' },
      { q: '为什么一开始觉得都一样？', opts: ['因为贝壳太小', '因为光线太暗', '没有仔细看细小的差别'], a: 2, kind: 'infer' },
      { q: '想找出一样特别的东西，你会怎么做？', opts: ['随便挑一个', '一处一处仔细比，看细节', '看最大的'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b43', lv: 'L4', tag: '送礼', title: 'A Gift in a Basket', zh: '篮子里的礼物',
    emoji: '🧺', color: '#BFE6DF',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「修好它」这条线，认读 1 个新词。',
    trap: '连缀中间不加元音：tree 是「tr-ee」一个词，不是「特-瑞」两个音。',
    summary: '《篮子里的礼物》是「修好它」：明明和奶奶在家，围绕礼物把一件事读到底。本本词卡：礼物。读前先看词卡，读完合上书说一说。',
    retell: '四句话复述：谁、在哪儿、遇到什么麻烦、怎么解决。（这一本是「修好它」。）',
    think: '说一样坏过的东西：你一开始反复试了什么？后来发现真正的问题在哪儿？',
    pre: [
      { art: '🎁', en: 'gift', zh: '礼物' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'they', zh: 'they' }
    ],
    sight: ['cloud', 'person'],
    newWords: [
      { w: 'gift', zh: '礼物' }
    ],
    pages: [
      { art: 'home|ming,grandma|gift|·', en: 'The gift does not work at home.', zh: '家的礼物不好使了。' },
      { art: 'home|ming,grandma|gift|♪', en: 'Ming wants to fix it.', zh: '明明想把它修好。' },
      { art: 'home|ming,grandma|gift|👀', en: 'They look at it from every side. They wrote down gift, cloud and person.', zh: '他们从各个面都看了一遍。他们写下：礼物、云和人。' },
      { art: 'home|ming,grandma|gift|?', en: '"What did we change?" asks Grandma.', zh: '「我们改过什么？」奶奶问。' },
      { art: 'home|ming,grandma|gift|·', en: 'Ming tries the same thing again.', zh: '明明照原样又试了一次。' },
      { art: 'home|ming,grandma|gift|!', en: 'It still does not work.', zh: '还是不行。' },
      { art: 'home|ming,grandma|race|♥', en: 'Grandma points to one small part.', zh: '奶奶指着一个小小的部位。' },
      { art: 'home|ming,grandma|gift|★', en: 'Now the gift works again. We look at the gift and the cloud.', zh: '礼物又能用了。我们看看礼物和云。' },
      { art: 'home|ming,grandma|gift|·', en: 'They remember to look before they try again.', zh: '他们记住了：再试之前，先看一看。' }
    ],
    quiz: [
      { q: '明明和奶奶的这一本里，出现了下面哪一样？', opts: ['果酱', '礼物', '拖把'], a: 1, kind: 'recall' },
      { q: '为什么试了很多次都没修好礼物？', opts: ['因为没人愿意帮忙', '因为工具不够', '一直重复同一个动作，没找对小毛病'], a: 2, kind: 'infer' },
      { q: '一件事反复做还是不行（像修礼物那样），你会怎么做？', opts: ['先停下来看看是不是漏了一处小的', '干脆换个人做', '把同样的动作再做十遍'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b44', lv: 'L4', tag: '游戏', title: 'Clap and Spin', zh: '拍手转圈',
    emoji: '🌀', color: '#F2E2A8',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「一起玩」这条线，认读 2 个新词。',
    trap: '连缀中间不加元音：tree 是「tr-ee」一个词，不是「特-瑞」两个音。',
    summary: '《拍手转圈》是「一起玩」：丽丽和爷爷在操场，围绕鼓把一件事读到底。本本词卡：操场、游戏。读前先看词卡，读完合上书说一说。',
    retell: '四句话复述：谁、在哪儿、遇到什么麻烦、怎么解决。（这一本是「一起玩」。）',
    think: '说说你和别人一起玩的一次经历：你们是怎么分工的？',
    pre: [
      { art: '🛝', en: 'playground', zh: '操场' },
      { art: '🎲', en: 'game', zh: '游戏' },
      { art: '📦', en: 'they', zh: 'they' },
      { art: '📦', en: 'the', zh: 'the' }
    ],
    sight: ['friend', 'playing'],
    newWords: [
      { w: 'playground', zh: '操场' },
      { w: 'game', zh: '游戏' }
    ],
    pages: [
      { art: 'playground|lili,grandpa|drum|·', en: 'Lili is playing alone with the drum.', zh: '丽丽一个人玩鼓。' },
      { art: 'playground|lili,grandpa|drum|♪', en: 'They want someone to play with.', zh: '他们想找人一起玩。' },
      { art: 'playground|lili,grandpa|drum|👀', en: 'They look around for a friend. They wrote down playground, crab and fog.', zh: '他们看看四周找朋友。他们写下：操场、螃蟹和雾。' },
      { art: 'playground|lili,grandpa|drum|?', en: '"Do you want to play?" asks Lili.', zh: '「一起玩吗？」丽丽问。' },
      { art: 'playground|lili,grandpa|drum|·', en: 'They play the game together.', zh: '他们一起玩起来。' },
      { art: 'playground|lili,grandpa|drum|!', en: 'They do not know who does what.', zh: '他们不知道谁该做什么。' },
      { art: 'playground|lili,grandpa|path|♥', en: 'Grandpa says, "We can each do one job."', zh: '爷爷说：「我们一人做一件事。」' },
      { art: 'playground|lili,grandpa|drum|★', en: 'Now the game goes well. We look at the playground and the crab.', zh: '现在游戏玩得很顺。我们看看操场和螃蟹。' },
      { art: 'playground|lili,grandpa|drum|·', en: 'They will ask another friend next time.', zh: '下次他们再叫一个朋友。' }
    ],
    quiz: [
      { q: '在操场读的这一本里，有下面哪一样？', opts: ['朋友', '李子', '拖把'], a: 0, kind: 'recall' },
      { q: '为什么一起玩要先分工？', opts: ['不知道谁做什么，游戏就乱了', '因为人太多了', '因为东西太少'], a: 0, kind: 'infer' },
      { q: '一个人玩没意思，你会怎么做？', opts: ['不玩了', '一直自己玩', '找人一起玩，并商量好分工'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b45', lv: 'L4', tag: '发音', title: 'Say It: Tree', zh: '说一说：tree',
    emoji: '🗣️', color: '#D9D2F5',
    track: 'drill',
    goal: '把本级难点音听准、说准，并能在整句里读对。这一本走「跟读整句」这条线，认读 2 个新词。',
    trap: '连缀中间不加元音：tree 是「tr-ee」一个词，不是「特-瑞」两个音。',
    summary: '《说一说：tree》是「跟读整句」：奶奶和妈妈在家，围绕树把一件事读到底。本本词卡：茎、雪。读前先看词卡，读完合上书说一说。',
    retell: '四句话复述：谁、在哪儿、遇到什么麻烦、怎么解决。（这一本是「跟读整句」。）',
    think: '挑书里最长的一句英文，先听整句，再分成两段读给家长听。',
    pre: [
      { art: '🌿', en: 'stem', zh: '茎' },
      { art: '❄️', en: 'snow', zh: '雪' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'sentence', zh: 'sentence' }
    ],
    sight: ['friend', 'light', 'tree'],
    newWords: [
      { w: 'stem', zh: '茎' },
      { w: 'snow', zh: '雪' }
    ],
    pages: [
      { art: 'table|grandma,mom|tree|·', en: 'Grandma opens a book at home.', zh: '奶奶在家翻开一本书。' },
      { art: 'table|grandma,mom|tree|♪', en: 'Grandma wants to read it out loud.', zh: '奶奶想把它读出来。' },
      { art: 'table|grandma,mom|tree|👀', en: 'The sentence with the word "tree" is long. They wrote down stem, snow and friend.', zh: '带着「tree」这个词的那一句很长。他们写下：茎、雪和朋友。' },
      { art: 'table|grandma,mom|tree|?', en: '"Where do I stop for breath?" asks Grandma.', zh: '「在哪里换气？」奶奶问。' },
      { art: 'table|grandma,mom|tree|·', en: 'Grandma reads it one word at a time.', zh: '奶奶一个词一个词地读。' },
      { art: 'table|grandma,mom|tree|!', en: 'It sounds broken, not like a sentence.', zh: '听着是碎的，不像一句话。' },
      { art: 'table|grandma,mom|light|♥', en: 'Mom plays the whole sentence.', zh: '妈妈把整句放了一遍。' },
      { art: 'table|grandma,mom|tree|★', en: 'Now it sounds like one sentence. We look at the stem and the snow.', zh: '这下听起来像一整句了。我们看看茎和雪。' },
      { art: 'table|grandma,mom|tree|·', en: 'They try the next sentence about a light.', zh: '他们接着试讲光的下一句。' }
    ],
    quiz: [
      { q: '这一本里，奶奶看到了下面哪一样？', opts: ['贝壳', '光', '一块'], a: 1, kind: 'recall' },
      { q: '奶奶读「tree」那一句时，为什么一个词一个词读听起来是碎的？', opts: ['因为词太难', '因为读得太慢', '句子里的词是成组的，不能逐个蹦'], a: 2, kind: 'infer' },
      { q: '遇到像「tree」那一句这样很长的英文句子，你会怎么读？', opts: ['只看中文跳过英文', '先听整句，再按意思分成两三段读', '一个词一个词慢慢拼'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b46', lv: 'L4', tag: '小知识', title: 'How a Stem Grows', zh: '茎怎么长',
    emoji: '🌱', color: '#FAD3B6',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。这一本走「数一数」这条线，认读 1 个新词。',
    trap: '连缀中间不加元音：tree 是「tr-ee」一个词，不是「特-瑞」两个音。',
    summary: '《茎怎么长》是「数一数」：爷爷和爸爸在花园，围绕茎把一件事读到底。本本词卡：李子。读前先看词卡，读完合上书说一说。',
    retell: '四句话复述：谁、在哪儿、遇到什么麻烦、怎么解决。（这一本是「数一数」。）',
    think: '找家里三样能数的东西，用英文数一遍，说说你怎么保证不数重。',
    pre: [
      { art: '🍚', en: 'plum', zh: '李子' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👴', en: 'grandpa', zh: '爷爷' }
    ],
    sight: ['garden', 'person', 'snow'],
    newWords: [
      { w: 'plum', zh: '李子' }
    ],
    pages: [
      { art: 'garden|grandpa,dad|stem|·', en: 'Grandpa sees a lot of things in the garden.', zh: '爷爷在花园看见好多东西。' },
      { art: 'garden|grandpa,dad|stem|♪', en: 'Grandpa wants to count them all.', zh: '爷爷想把它们数清楚。' },
      { art: 'garden|grandpa,dad|stem|👀', en: 'Dad points at the stem and then the clock. They wrote down person, snow and plum.', zh: '爸爸指着茎，再指钟。他们写下：人、雪和李子。' },
      { art: 'garden|grandpa,dad|stem|?', en: '"How many are there?" asks Grandpa.', zh: '「一共有几个？」爷爷问。' },
      { art: 'garden|grandpa,dad|stem|·', en: 'Grandpa counts: one, two, three.', zh: '爷爷数：一、二、三。' },
      { art: 'garden|grandpa,dad|stem|!', en: 'They get a different number each time.', zh: '每次数出来的数都不一样。' },
      { art: 'garden|grandpa,dad|clock|♥', en: 'Dad says, "Start from the same end."', zh: '爸爸说：「每次都从同一头开始。」' },
      { art: 'garden|grandpa,dad|stem|★', en: 'This time both get the same number. We look at the person and the snow.', zh: '这次两个数对上了。我们看看人和雪。' },
      { art: 'garden|grandpa,dad|stem|·', en: 'Next they will count the clock and the map.', zh: '接下来他们要数钟和地图。' }
    ],
    quiz: [
      { q: '爷爷和爸爸的这一本里，出现了下面哪一样？', opts: ['人', '星星', '红色'], a: 0, kind: 'recall' },
      { q: '爷爷两遍数出来的数为什么不一样？', opts: ['每次从不同的地方开始数', '因为东西变多了', '因为数得太慢'], a: 0, kind: 'infer' },
      { q: '数茎总是数错，你会怎么做？', opts: ['定好从哪头开始，按同一顺序再数', '不数了，猜一个', '随便换个起点重数'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b47', lv: 'L4', tag: '小知识', title: 'Snow on the Street', zh: '街上的雪',
    emoji: '❄️', color: '#C8E7F0',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。这一本走「合上书讲一遍」这条线，认读 1 个新词。',
    trap: '连缀中间不加元音：tree 是「tr-ee」一个词，不是「特-瑞」两个音。',
    summary: '《街上的雪》是「合上书讲一遍」：妈妈和明明在家，围绕雪把一件事读到底。本本词卡：乌鸦。读前先看词卡，读完合上书说一说。',
    retell: '四句话复述：谁、在哪儿、遇到什么麻烦、怎么解决。（这一本是「合上书讲一遍」。）',
    think: '合上书，用「谁 → 在哪儿 → 出了什么事 → 结果」把雪这一本讲给家长听。',
    pre: [
      { art: '🐦‍⬛', en: 'crow', zh: '乌鸦' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👩', en: 'mom', zh: '妈妈' }
    ],
    sight: ['snow'],
    newWords: [
      { w: 'crow', zh: '乌鸦' }
    ],
    pages: [
      { art: 'night|mom,ming|snow|·', en: 'Mom has just finished a book at home.', zh: '妈妈刚在家读完一本书。' },
      { art: 'night|mom,ming|snow|♪', en: 'Ming wants to hear all about it.', zh: '明明想听他讲讲。' },
      { art: 'night|mom,ming|snow|👀', en: 'Mom thinks about the snow in the book. They wrote down song, plum and crow.', zh: '妈妈想着书里的雪。他们写下：歌、李子和乌鸦。' },
      { art: 'night|mom,ming|snow|?', en: '"Where do I start?" asks Mom.', zh: '「从哪儿讲起？」妈妈问。' },
      { art: 'night|mom,ming|snow|·', en: 'Mom tells the last part first.', zh: '妈妈先讲了结尾。' },
      { art: 'night|mom,ming|snow|!', en: 'Ming cannot follow the story.', zh: '明明听不明白。' },
      { art: 'night|mom,ming|sun|♥', en: 'Ming says, "Tell me who, where, then what."', zh: '明明说：「先说谁、在哪儿、再说出什么事。」' },
      { art: 'night|mom,ming|snow|★', en: 'This time Ming can see the whole thing. We look at the song and the plum.', zh: '这回明明全听明白了。我们看看歌和李子。' },
      { art: 'night|mom,ming|snow|·', en: 'Tomorrow they will read about a sun.', zh: '明天他们要读讲太阳的书。' }
    ],
    quiz: [
      { q: '在家读的这一本里，有下面哪一样？', opts: ['小棚', '乌鸦', '三'], a: 1, kind: 'recall' },
      { q: '为什么明明第一遍没听明白？', opts: ['先讲了结尾，顺序乱了', '因为故事太短', '因为讲得太慢'], a: 0, kind: 'infer' },
      { q: '要把讲雪的这本读过的书讲给别人听，你会怎么开头？', opts: ['先报书名和生词表', '先说谁、在哪儿，再按顺序说出了什么事', '直接从最精彩的那句开始'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b48', lv: 'L4', tag: '复习', title: 'Back to the Playground', zh: '回到操场',
    emoji: '🏫', color: '#E8D9B5',
    track: 'review',
    goal: '把本级和前面级别的词再读一遍、串成一个故事。这一本走「猜一猜」这条线，认读 1 个新词。',
    trap: '连缀中间不加元音：tree 是「tr-ee」一个词，不是「特-瑞」两个音。',
    summary: '《回到操场》是「猜一猜」：爸爸和丽丽在图书馆，围绕操场把一件事读到底。本本词卡：石头。读前先看词卡，读完合上书说一说。',
    retell: '四句话复述：谁、在哪儿、遇到什么麻烦、怎么解决。（这一本是「猜一猜」。）',
    think: '说说你猜过又查证的一件事：猜对了吗？',
    pre: [
      { art: '🌿', en: 'stone', zh: '石头' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'they', zh: 'they' }
    ],
    sight: ['crow', 'guess', 'playground'],
    newWords: [
      { w: 'stone', zh: '石头' }
    ],
    pages: [
      { art: 'library|dad,lili|playground|·', en: 'They do not know the answer.', zh: '他们不知道答案。' },
      { art: 'library|dad,lili|playground|♪', en: 'They want to find out about the playground.', zh: '他们想弄清楚操场。' },
      { art: 'library|dad,lili|playground|👀', en: 'They look at the question. They wrote down playground, crow and stone.', zh: '他们看看这个问题。他们写下：操场、乌鸦和石头。' },
      { art: 'library|dad,lili|playground|?', en: '"What do you think?" asks Lili.', zh: '「你怎么想？」丽丽问。' },
      { art: 'library|dad,lili|playground|·', en: 'Dad makes a guess.', zh: '爸爸猜了一个答案。' },
      { art: 'library|dad,lili|playground|!', en: 'The guess is not right.', zh: '猜得不对。' },
      { art: 'library|dad,lili|beach|♥', en: 'Lili says, "Guess again and then check."', zh: '丽丽说：「再猜一次，然后查一查。」' },
      { art: 'library|dad,lili|playground|★', en: 'This time the guess is right. We look at the playground and the crow.', zh: '这次猜对了。我们看看操场和乌鸦。' },
      { art: 'library|dad,lili|playground|·', en: 'They have a new question now.', zh: '他们现在有了一个新的问题。' }
    ],
    quiz: [
      { q: '这一本里，爸爸看到了下面哪一样？', opts: ['袜子', '老鼠', '石头'], a: 2, kind: 'recall' },
      { q: '为什么猜了还要查一查？', opts: ['因为猜太慢', '因为答案太难', '查过以后，猜才变成真的知道'], a: 2, kind: 'infer' },
      { q: '不知道答案时，你会怎么做？', opts: ['先猜一个，再想办法查证', '随便说一个就当答案', '等着别人告诉'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b49', lv: 'L5', tag: '天气', title: 'Rain on the Farm', zh: '农场上的雨',
    emoji: '🌧️', color: '#F6C6C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「看月亮」这条线，认读 2 个新词。',
    trap: '元音组合只读一个长音：ai / ay 都读 /eɪ/，oa 读 /əʊ/；别把两个字母分开念。',
    summary: '《农场上的雨》是「看月亮」：明明和奶奶在家，围绕雨把一件事读到底。本本词卡：雨、月亮。读前先看词卡，读完合上书说一说。',
    retell: '合上书，讲讲明明为什么等了那么久，结果学到了什么。（这一本是「看月亮」。）',
    think: '说说你晚上看过天上的什么：你看到了什么？',
    pre: [
      { art: '🌧️', en: 'rain', zh: '雨' },
      { art: '🌙', en: 'moon', zh: '月亮' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'they', zh: 'they' }
    ],
    sight: ['clearly', 'clouds'],
    newWords: [
      { w: 'rain', zh: '雨' },
      { w: 'moon', zh: '月亮' }
    ],
    pages: [
      { art: 'night|ming,grandma|rain|·', en: 'They look at the rain at night.', zh: '夜里他们看着雨。' },
      { art: 'night|ming,grandma|rain|♪', en: 'They want to see it clearly.', zh: '他们想看清楚。' },
      { art: 'night|ming,grandma|rain|👀', en: 'They look up at the sky. We say moon, rain and stone again.', zh: '他们抬头看看天。我们再把这三个词说一遍：月亮、雨和石头。' },
      { art: 'night|ming,grandma|rain|?', en: '"Where is it?" asks Ming.', zh: '「它在哪儿？」明明问。' },
      { art: 'night|ming,grandma|rain|·', en: 'They look and look.', zh: '他们找了又找。' },
      { art: 'night|ming,grandma|rain|!', en: 'The clouds are in the way.', zh: '云挡住了。' },
      { art: 'night|ming,grandma|cap|♥', en: 'Grandma says, "The clouds will move."', zh: '奶奶说：「云会走开的。」' },
      { art: 'night|ming,grandma|rain|★', en: 'The clouds move, and the rain is there.', zh: '云走开了，雨出来了。' },
      { art: 'night|ming,grandma|rain|?', en: 'Waiting let the sky change. We say the words again: moon and rain.', zh: '等着，天就变了。我们把这两个词再说一遍：月亮和雨。' },
      { art: 'night|ming,grandma|rain|·', en: 'They say good night and go in.', zh: '他们说了晚安，回屋去。' }
    ],
    quiz: [
      { q: '明明和奶奶的这一本里，出现了下面哪一样？', opts: ['雨', '草', '旗子'], a: 0, kind: 'recall' },
      { q: '为什么一开始看不到？', opts: ['云把它挡住了', '因为天太黑', '因为它没出来'], a: 0, kind: 'infer' },
      { q: '想看天上的东西却被挡住，你会怎么做？', opts: ['马上不看了', '等一会儿，看看会不会变', '大声叫它出来'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b50', lv: 'L5', tag: '海边', title: 'A Boat on the Sea', zh: '海上的小船',
    emoji: '⛵', color: '#F9DFB4',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「找贝壳」这条线，认读 2 个新词。',
    trap: '元音组合只读一个长音：ai / ay 都读 /eɪ/，oa 读 /əʊ/；别把两个字母分开念。',
    summary: '《海上的小船》是「找贝壳」：丽丽和爷爷在沙滩，围绕小船把一件事读到底。本本词卡：小船、潮水。读前先看词卡，读完合上书说一说。',
    retell: '合上书，讲讲丽丽为什么等了那么久，结果学到了什么。（这一本是「找贝壳」。）',
    think: '说说你收藏过的小东西：它是哪里特别？',
    pre: [
      { art: '⛵', en: 'boat', zh: '小船' },
      { art: '🌿', en: 'tide', zh: '潮水' },
      { art: '📦', en: 'they', zh: 'they' },
      { art: '📦', en: 'the', zh: 'the' }
    ],
    sight: ['water'],
    newWords: [
      { w: 'boat', zh: '小船' },
      { w: 'tide', zh: '潮水' }
    ],
    pages: [
      { art: 'beach|lili,grandpa|boat|·', en: 'They find a boat and many shells by the water.', zh: '他们在水边找到小船和好多贝壳。' },
      { art: 'beach|lili,grandpa|boat|♪', en: 'Lili wants to find one special shell.', zh: '丽丽想找一个特别的贝壳。' },
      { art: 'beach|lili,grandpa|boat|👀', en: 'They look at all the shells. We say tide, boat and food again.', zh: '他们看看所有的贝壳。我们再把这三个词说一遍：潮水、小船和食物。' },
      { art: 'beach|lili,grandpa|boat|?', en: '"Which one is special?" asks Lili.', zh: '「哪一个特别？」丽丽问。' },
      { art: 'beach|lili,grandpa|boat|·', en: 'They pick up one and then another.', zh: '他们捡起一个，又捡起一个。' },
      { art: 'beach|lili,grandpa|boat|!', en: 'They all look the same.', zh: '看起来都差不多。' },
      { art: 'beach|lili,grandpa|pen|♥', en: 'Grandpa says, "Look at the small details."', zh: '爷爷说：「看看细小的地方。」' },
      { art: 'beach|lili,grandpa|boat|★', en: 'There! One shell is a little different.', zh: '有了！有一个贝壳不太一样。' },
      { art: 'beach|lili,grandpa|boat|?', en: 'Special things hide in small details. We say the words again: tide and boat.', zh: '特别的东西，藏在细小的差别里。我们把这两个词再说一遍：潮水和小船。' },
      { art: 'beach|lili,grandpa|boat|·', en: 'They will look closely next time too.', zh: '下次他们也会仔细看。' }
    ],
    quiz: [
      { q: '在沙滩读的这一本里，有下面哪一样？', opts: ['食物', '腿', '草'], a: 0, kind: 'recall' },
      { q: '为什么一开始觉得都一样？', opts: ['没有仔细看细小的差别', '因为贝壳太小', '因为光线太暗'], a: 0, kind: 'infer' },
      { q: '想找出一样特别的东西，你会怎么做？', opts: ['看最大的', '一处一处仔细比，看细节', '随便挑一个'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b51', lv: 'L5', tag: '夜空', title: 'The Moon and the Sheep', zh: '月亮和绵羊',
    emoji: '🌙', color: '#CDE7C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「睡不着」这条线，认读 1 个新词。',
    trap: '元音组合只读一个长音：ai / ay 都读 /eɪ/，oa 读 /əʊ/；别把两个字母分开念。',
    summary: '《月亮和绵羊》是「睡不着」：奶奶和妈妈在家，围绕月亮把一件事读到底。本本词卡：山羊。读前先看词卡，读完合上书说一说。',
    retell: '合上书，讲讲奶奶为什么等了那么久，结果学到了什么。（这一本是「睡不着」。）',
    think: '说说你睡不着的一个晚上：你是怎么睡着的？',
    pre: [
      { art: '🐐', en: 'goat', zh: '山羊' },
      { art: '📦', en: 'they', zh: 'they' },
      { art: '📦', en: 'to', zh: 'to' }
    ],
    sight: ['awake', 'eyes', 'quiet'],
    newWords: [
      { w: 'goat', zh: '山羊' }
    ],
    pages: [
      { art: 'night|grandma,mom|moon|·', en: 'Grandma is in bed at night.', zh: '夜里奶奶躺在床上。' },
      { art: 'night|grandma,mom|moon|♪', en: 'They want to go to sleep.', zh: '他们想睡着。' },
      { art: 'night|grandma,mom|moon|👀', en: 'They look at the moon in the dark room. We say moon, sky and goat again.', zh: '他们看看黑屋子里的月亮。我们再把这三个词说一遍：月亮、天空和山羊。' },
      { art: 'night|grandma,mom|moon|?', en: '"Why can I not sleep?" asks Grandma.', zh: '「怎么睡不着？」奶奶问。' },
      { art: 'night|grandma,mom|moon|·', en: 'They close their eyes and try.', zh: '他们闭上眼睛试。' },
      { art: 'night|grandma,mom|moon|!', en: 'They are still awake.', zh: '还是醒着。' },
      { art: 'night|grandma,mom|tree|♥', en: 'Mom says, "Listen to the quiet sounds."', zh: '妈妈说：「听听安静的声音。」' },
      { art: 'night|grandma,mom|moon|★', en: 'Slowly, they go to sleep.', zh: '慢慢地，他们睡着了。' },
      { art: 'night|grandma,mom|moon|?', en: 'Trying hard to sleep makes it hard. We say the words again: moon and sky.', zh: '使劲想睡，反而睡不着。我们把这两个词再说一遍：月亮和天空。' },
      { art: 'night|grandma,mom|moon|·', en: 'They will listen to quiet sounds again.', zh: '他们还会听安静的声音。' }
    ],
    quiz: [
      { q: '这一本里，奶奶看到了下面哪一样？', opts: ['明明', '果酱', '床'], a: 2, kind: 'recall' },
      { q: '为什么使劲想睡反而睡不着？', opts: ['用力过头，人就静不下来', '因为床太硬', '因为天太冷'], a: 0, kind: 'infer' },
      { q: '睡不着的时候，你会怎么做？', opts: ['听听安静的声音，让自己慢慢静下来', '一直使劲闭眼', '爬起来玩'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b52', lv: 'L5', tag: '种植', title: 'A Seed in a Pot', zh: '盆里的种子',
    emoji: '🌱', color: '#C6DEF6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「浇浇水」这条线，认读 2 个新词。',
    trap: '元音组合只读一个长音：ai / ay 都读 /eɪ/，oa 读 /əʊ/；别把两个字母分开念。',
    summary: '《盆里的种子》是「浇浇水」：爷爷和爸爸在花园，围绕种子把一件事读到底。本本词卡：地面、叶子。读前先看词卡，读完合上书说一说。',
    retell: '合上书，讲讲爷爷为什么等了那么久，结果学到了什么。（这一本是「浇浇水」。）',
    think: '说说你照顾过的一盆植物或一棵草：你是怎么知道它要不要水的？',
    pre: [
      { art: '🌿', en: 'ground', zh: '地面' },
      { art: '🍃', en: 'leaf', zh: '叶子' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '💧', en: 'water', zh: '水' }
    ],
    sight: ['garden', 'water'],
    newWords: [
      { w: 'ground', zh: '地面' },
      { w: 'leaf', zh: '叶子' }
    ],
    pages: [
      { art: 'garden|grandpa,dad|seed|·', en: 'The seed is in the garden.', zh: '种子长在花园。' },
      { art: 'garden|grandpa,dad|seed|♪', en: 'Grandpa wants it to grow well.', zh: '爷爷想让它长得好。' },
      { art: 'garden|grandpa,dad|seed|👀', en: 'They look at the ground and the seed. We say leaf, seed and tide again.', zh: '他们看看地面和种子。我们再把这三个词说一遍：叶子、种子和潮水。' },
      { art: 'garden|grandpa,dad|seed|?', en: '"Does it need water?" asks Grandpa.', zh: '「它需要浇水吗？」爷爷问。' },
      { art: 'garden|grandpa,dad|seed|·', en: 'Grandpa gives it a lot of water.', zh: '爷爷浇了很多水。' },
      { art: 'garden|grandpa,dad|seed|!', en: 'The ground is too wet now.', zh: '地太湿了。' },
      { art: 'garden|grandpa,dad|sun|♥', en: 'Dad says, "A little water is enough."', zh: '爸爸说：「一点水就够了。」' },
      { art: 'garden|grandpa,dad|seed|★', en: 'The seed looks happy and green.', zh: '种子看着又精神又绿。' },
      { art: 'garden|grandpa,dad|seed|?', en: 'Too much water is not good either. We say the words again: leaf and seed.', zh: '水太多，也不好。我们把这两个词再说一遍：叶子和种子。' },
      { art: 'garden|grandpa,dad|seed|·', en: 'They will water it again tomorrow.', zh: '明天他们还会浇。' }
    ],
    quiz: [
      { q: '爷爷和爸爸的这一本里，出现了下面哪一样？', opts: ['泥', '腿', '地面'], a: 2, kind: 'recall' },
      { q: '为什么浇太多水反而不好？', opts: ['因为天太热', '因为水太凉', '太湿了，对它也不好'], a: 2, kind: 'infer' },
      { q: '给植物浇水，你会怎么做？', opts: ['一次浇很多', '几天浇一次特别多', '先看看土干不干，一次少浇一点'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b53', lv: 'L5', tag: '观察', title: 'A Tail and a Chain', zh: '尾巴和链子',
    emoji: '🐐', color: '#E0CFF3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「排排顺序」这条线，认读 2 个新词。',
    trap: '元音组合只读一个长音：ai / ay 都读 /eɪ/，oa 读 /əʊ/；别把两个字母分开念。',
    summary: '《尾巴和链子》是「排排顺序」：妈妈和明明在图书馆，围绕尾巴把一件事读到底。本本词卡：尾巴、乱糟糟。读前先看词卡，读完合上书说一说。',
    retell: '合上书，讲讲妈妈为什么等了那么久，结果学到了什么。（这一本是「排排顺序」。）',
    think: '说说你排过顺序的一件事（做事、排队、讲故事）：顺序是什么？',
    pre: [
      { art: '🐾', en: 'tail', zh: '尾巴' },
      { art: '💡', en: 'mess', zh: '乱糟糟' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'in', zh: 'in' }
    ],
    sight: ['eyes'],
    newWords: [
      { w: 'tail', zh: '尾巴' },
      { w: 'mess', zh: '乱糟糟' }
    ],
    pages: [
      { art: 'library|mom,ming|tail|·', en: 'The tail is all in a mess.', zh: '尾巴全都乱了。' },
      { art: 'library|mom,ming|tail|♪', en: 'They want to put them in order.', zh: '他们想把它们排好顺序。' },
      { art: 'library|mom,ming|tail|👀', en: 'They look at all the things. We say tail, goat and stone again.', zh: '他们看看所有的东西。我们再把这三个词说一遍：尾巴、山羊和石头。' },
      { art: 'library|mom,ming|tail|?', en: '"What comes first?" asks Ming.', zh: '「哪一个排在最前？」明明问。' },
      { art: 'library|mom,ming|tail|·', en: 'They put one before another.', zh: '他们一个一个排。' },
      { art: 'library|mom,ming|tail|!', en: 'It does not look right.', zh: '看着还是不对。' },
      { art: 'library|mom,ming|pot|♥', en: 'Ming says, "Say them out loud in order."', zh: '明明说：「按顺序念出来。」' },
      { art: 'library|mom,ming|tail|★', en: 'Now they are all in order.', zh: '现在全都排好顺序了。' },
      { art: 'library|mom,ming|tail|?', en: 'Saying the order helps the eyes see it. We say the words again: tail and goat.', zh: '念出顺序，眼睛才看得出。我们把这两个词再说一遍：尾巴和山羊。' },
      { art: 'library|mom,ming|tail|·', en: 'They will keep them in order.', zh: '他们会一直保持顺序。' }
    ],
    quiz: [
      { q: '在图书馆读的这一本里，有下面哪一样？', opts: ['网', '山羊', '腿'], a: 1, kind: 'recall' },
      { q: '为什么要念出顺序？', opts: ['因为声音好听', '念出来，眼睛才看得出对不对', '因为别人在听'], a: 1, kind: 'infer' },
      { q: '东西乱了要理清，你会怎么做？', opts: ['随便排一排', '不排了', '先想清楚顺序，边念边排'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b54', lv: 'L5', tag: '趣事', title: 'The Goat and a Coat', zh: '山羊和外套',
    emoji: '🧥', color: '#F6C9E3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「借了要还」这条线，认读 2 个新词。',
    trap: '元音组合只读一个长音：ai / ay 都读 /eɪ/，oa 读 /əʊ/；别把两个字母分开念。',
    summary: '《山羊和外套》是「借了要还」：爸爸和丽丽在家，围绕外套把一件事读到底。本本词卡：外套、信任。读前先看词卡，读完合上书说一说。',
    retell: '合上书，讲讲爸爸为什么等了那么久，结果学到了什么。（这一本是「借了要还」。）',
    think: '说一次你借东西或借给别人东西的经历：最后是怎么还的？',
    pre: [
      { art: '🧥', en: 'coat', zh: '外套' },
      { art: '💡', en: 'trust', zh: '信任' },
      { art: '📦', en: 'it', zh: 'it' },
      { art: '👨', en: 'dad', zh: '爸爸' }
    ],
    sight: ['borrows', 'leaf', 'return', 'use'],
    newWords: [
      { w: 'coat', zh: '外套' },
      { w: 'trust', zh: '信任' }
    ],
    pages: [
      { art: 'home|dad,lili|coat|·', en: 'Dad borrows a coat from Lili.', zh: '爸爸向丽丽借了外套。' },
      { art: 'home|dad,lili|coat|♪', en: 'Dad wants to use it for a day.', zh: '爸爸想用一天。' },
      { art: 'home|dad,lili|coat|👀', en: 'They look at it and smile. We say coat, road and leaf again.', zh: '他们看看它，都笑了。我们再把这三个词说一遍：外套、路和叶子。' },
      { art: 'home|dad,lili|coat|?', en: '"How do I look after it?" asks Dad.', zh: '「怎么照顾它？」爸爸问。' },
      { art: 'home|dad,lili|coat|·', en: 'Dad uses it well and looks after it.', zh: '爸爸用得很小心。' },
      { art: 'home|dad,lili|coat|!', en: 'The day is over. It is time to give it back.', zh: '一天过去了，该还回去了。' },
      { art: 'home|dad,lili|brush|♥', en: 'Lili says, "Bring it back when you can."', zh: '丽丽说：「方便的时候还回来就行。」' },
      { art: 'home|dad,lili|coat|★', en: 'Lili is glad to see the coat again.', zh: '丽丽很高兴又见到外套。' },
      { art: 'home|dad,lili|coat|?', en: 'Giving things back is how we keep trust. We say the words again: coat and road.', zh: '把东西还回去，才能留住信任。我们把这两个词再说一遍：外套和路。' },
      { art: 'home|dad,lili|coat|·', en: 'Dad will return what is not theirs.', zh: '爸爸会把不属于自己的东西还回去。' }
    ],
    quiz: [
      { q: '这一本里，爸爸看到了下面哪一样？', opts: ['叶子', '李子', '泥'], a: 0, kind: 'recall' },
      { q: '为什么丽丽下次还愿意借？', opts: ['因为忘了这件事', '因为东西很便宜', '因为爸爸按时把东西还了回来'], a: 2, kind: 'infer' },
      { q: '借了别人的东西，你会怎么做？', opts: ['用完就还回去，并说声谢谢', '弄丢了也不说', '一直留着自己用'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b55', lv: 'L5', tag: '美术', title: 'Paint a Green Leaf', zh: '画一片绿叶',
    emoji: '🍃', color: '#BFE6DF',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「挖一挖」这条线，认读 4 个新词。',
    trap: '元音组合只读一个长音：ai / ay 都读 /eɪ/，oa 读 /əʊ/；别把两个字母分开念。',
    summary: '《画一片绿叶》是「挖一挖」：明明和奶奶在花园，围绕叶子把一件事读到底。本本词卡：动物园、蜜蜂、链子、洞。读前先看词卡，读完合上书说一说。',
    retell: '合上书，讲讲明明为什么等了那么久，结果学到了什么。（这一本是「挖一挖」。）',
    think: '说说你挖土或玩沙子时发现过的东西：当时你是怎么弄出来的？',
    pre: [
      { art: '🦁', en: 'zoo', zh: '动物园' },
      { art: '🐝', en: 'bee', zh: '蜜蜂' },
      { art: '⛓️', en: 'chain', zh: '链子' },
      { art: '🕳️', en: 'hole', zh: '洞' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'they', zh: 'they' }
    ],
    sight: ['break', 'garden', 'ground', 'leaf'],
    newWords: [
      { w: 'zoo', zh: '动物园' },
      { w: 'bee', zh: '蜜蜂' },
      { w: 'chain', zh: '链子' },
      { w: 'hole', zh: '洞' }
    ],
    pages: [
      { art: 'garden|ming,grandma|leaf|·', en: 'Ming wants to dig in the garden.', zh: '明明想在花园挖一挖。' },
      { art: 'garden|ming,grandma|leaf|♪', en: 'They want to see what is under the ground.', zh: '他们想看看地下有什么。' },
      { art: 'garden|ming,grandma|leaf|👀', en: 'They look at the leaf and the ground first. We say zoo, bee and chain again.', zh: '他们先看看叶子和地面。我们再把这三个词说一遍：动物园、蜜蜂和链子。' },
      { art: 'garden|ming,grandma|leaf|?', en: '"What will we find?" asks Grandma.', zh: '「会挖到什么？」奶奶问。' },
      { art: 'garden|ming,grandma|leaf|·', en: 'They dig a small hole.', zh: '他们挖了一个小坑。' },
      { art: 'garden|ming,grandma|leaf|!', en: 'They hit something hard.', zh: '他们碰到了硬东西。' },
      { art: 'garden|ming,grandma|wind|♥', en: 'Grandma says, "Dig around it, not at it."', zh: '奶奶说：「绕着挖，别硬挖。」' },
      { art: 'garden|ming,grandma|leaf|★', en: 'It is a big stone under the ground.', zh: '是一块大石头埋在地下。' },
      { art: 'garden|ming,grandma|leaf|?', en: 'Pushing hard could break something. We say the words again: zoo and bee.', zh: '硬挖可能会弄坏东西。我们把这两个词再说一遍：动物园和蜜蜂。' },
      { art: 'garden|ming,grandma|leaf|·', en: 'They will dig another day.', zh: '改天他们再挖。' }
    ],
    quiz: [
      { q: '明明和奶奶的这一本里，出现了下面哪一样？', opts: ['一块', '石头', '洞'], a: 2, kind: 'recall' },
      { q: '为什么要绕着挖而不是硬挖？', opts: ['因为坑太小', '硬挖可能会弄坏东西', '因为土太硬'], a: 1, kind: 'infer' },
      { q: '挖东西碰到硬的，你会怎么做？', opts: ['使劲往下挖', '绕着它慢慢挖，看清楚是什么', '换个地方不挖了'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b56', lv: 'L5', tag: '动物', title: 'Food at the Zoo', zh: '动物园的食物',
    emoji: '🦒', color: '#F2E2A8',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「合上书讲一遍」这条线，认读 1 个新词。',
    trap: '元音组合只读一个长音：ai / ay 都读 /eɪ/，oa 读 /əʊ/；别把两个字母分开念。',
    summary: '《动物园的食物》是「合上书讲一遍」：丽丽和爷爷在图书馆，围绕动物园把一件事读到底。本本词卡：水池。读前先看词卡，读完合上书说一说。',
    retell: '合上书，讲讲丽丽为什么等了那么久，结果学到了什么。（这一本是「合上书讲一遍」。）',
    think: '合上书，用「谁 → 在哪儿 → 出了什么事 → 结果」把动物园这一本讲给家长听。',
    pre: [
      { art: '🌿', en: 'pool', zh: '水池' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👧', en: 'lili', zh: '丽丽' }
    ],
    sight: ['library'],
    newWords: [
      { w: 'pool', zh: '水池' }
    ],
    pages: [
      { art: 'library|lili,grandpa|zoo|·', en: 'Lili has just finished a book in the library.', zh: '丽丽刚在图书馆读完一本书。' },
      { art: 'library|lili,grandpa|zoo|♪', en: 'Grandpa wants to hear all about it.', zh: '爷爷想听他讲讲。' },
      { art: 'library|lili,grandpa|zoo|👀', en: 'Lili thinks about the zoo in the book. We say zoo, chain and pool again.', zh: '丽丽想着书里的动物园。我们再把这三个词说一遍：动物园、链子和水池。' },
      { art: 'library|lili,grandpa|zoo|?', en: '"Where do I start?" asks Lili.', zh: '「从哪儿讲起？」丽丽问。' },
      { art: 'library|lili,grandpa|zoo|·', en: 'Lili tells the last part first.', zh: '丽丽先讲了结尾。' },
      { art: 'library|lili,grandpa|zoo|!', en: 'Grandpa cannot follow the story.', zh: '爷爷听不明白。' },
      { art: 'library|lili,grandpa|cap|♥', en: 'Grandpa says, "Tell me who, where, then what."', zh: '爷爷说：「先说谁、在哪儿、再说出什么事。」' },
      { art: 'library|lili,grandpa|zoo|★', en: 'This time Grandpa can see the whole thing.', zh: '这回爷爷全听明白了。' },
      { art: 'library|lili,grandpa|zoo|?', en: 'A story needs its order to make sense. We say the words again: zoo and chain.', zh: '故事要靠顺序才讲得通。我们把这两个词再说一遍：动物园和链子。' },
      { art: 'library|lili,grandpa|zoo|·', en: 'Tomorrow they will read about a cap. They could still tell it the next morning.', zh: '明天他们要读讲鸭舌帽的书。第二天早上，他们还能讲得出来。' }
    ],
    quiz: [
      { q: '在图书馆读的这一本里，有下面哪一样？', opts: ['米饭', '小店', '图书馆'], a: 2, kind: 'recall' },
      { q: '为什么爷爷第一遍没听明白？', opts: ['因为讲得太慢', '先讲了结尾，顺序乱了', '因为故事太短'], a: 1, kind: 'infer' },
      { q: '要把讲动物园的这本读过的书讲给别人听，你会怎么开头？', opts: ['先报书名和生词表', '先说谁、在哪儿，再按顺序说出了什么事', '直接从最精彩的那句开始'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b57', lv: 'L5', tag: '发音', title: 'Say It: Rain, Day', zh: '说一说：rain day',
    emoji: '🗣️', color: '#D9D2F5',
    track: 'drill',
    goal: '把本级难点音听准、说准，并能在整句里读对。这一本走「跟读整句」这条线，认读 1 个新词。',
    trap: '元音组合只读一个长音：ai / ay 都读 /eɪ/，oa 读 /əʊ/；别把两个字母分开念。',
    summary: '《说一说：rain day》是「跟读整句」：奶奶和妈妈在家，围绕雨把一件事读到底。本本词卡：海。读前先看词卡，读完合上书说一说。',
    retell: '合上书，讲讲奶奶为什么等了那么久，结果学到了什么。（这一本是「跟读整句」。）',
    think: '挑书里最长的一句英文，先听整句，再分成两段读给家长听。',
    pre: [
      { art: '🌊', en: 'sea', zh: '海' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'sentence', zh: 'sentence' }
    ],
    sight: [],
    newWords: [
      { w: 'sea', zh: '海' }
    ],
    pages: [
      { art: 'table|grandma,mom|rain|·', en: 'Grandma opens a book at home.', zh: '奶奶在家翻开一本书。' },
      { art: 'table|grandma,mom|rain|♪', en: 'Grandma wants to read it out loud.', zh: '奶奶想把它读出来。' },
      { art: 'table|grandma,mom|rain|👀', en: 'The sentence with the word "rain" is long. We say pool, bee and sea again.', zh: '带着「rain」这个词的那一句很长。我们再把这三个词说一遍：水池、蜜蜂和海。' },
      { art: 'table|grandma,mom|rain|?', en: '"Where do I stop for breath?" asks Grandma.', zh: '「在哪里换气？」奶奶问。' },
      { art: 'table|grandma,mom|rain|·', en: 'Grandma reads it one word at a time.', zh: '奶奶一个词一个词地读。' },
      { art: 'table|grandma,mom|rain|!', en: 'It sounds broken, not like a sentence.', zh: '听着是碎的，不像一句话。' },
      { art: 'table|grandma,mom|book|♥', en: 'Mom plays the whole sentence.', zh: '妈妈把整句放了一遍。' },
      { art: 'table|grandma,mom|rain|★', en: 'Now it sounds like one sentence.', zh: '这下听起来像一整句了。' },
      { art: 'table|grandma,mom|rain|?', en: 'The words belong to groups, not to themselves. We say the words again: pool and bee.', zh: '词是成组的，不是一个一个孤立的。我们把这两个词再说一遍：水池和蜜蜂。' },
      { art: 'table|grandma,mom|rain|·', en: 'They try the next sentence about a book. Reading out loud became easier after that.', zh: '他们接着试讲书的下一句。从那以后，读出声就不那么难了。' }
    ],
    quiz: [
      { q: '这一本里，奶奶看到了下面哪一样？', opts: ['小店', '雨', '天鹅'], a: 1, kind: 'recall' },
      { q: '奶奶读「rain」那一句时，为什么一个词一个词读听起来是碎的？', opts: ['因为读得太慢', '句子里的词是成组的，不能逐个蹦', '因为词太难'], a: 1, kind: 'infer' },
      { q: '遇到像「rain」那一句这样很长的英文句子，你会怎么读？', opts: ['先听整句，再按意思分成两三段读', '只看中文跳过英文', '一个词一个词慢慢拼'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b58', lv: 'L5', tag: '小知识', title: 'Why a Seed Needs Rain', zh: '种子为什么需要雨',
    emoji: '🌾', color: '#FAD3B6',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。这一本走「数一数」这条线，认读 1 个新词。',
    trap: '元音组合只读一个长音：ai / ay 都读 /eɪ/，oa 读 /əʊ/；别把两个字母分开念。',
    summary: '《种子为什么需要雨》是「数一数」：爷爷和爸爸在花园，围绕种子把一件事读到底。本本词卡：鲸。读前先看词卡，读完合上书说一说。',
    retell: '合上书，讲讲爷爷为什么等了那么久，结果学到了什么。（这一本是「数一数」。）',
    think: '找家里三样能数的东西，用英文数一遍，说说你怎么保证不数重。',
    pre: [
      { art: '🐳', en: 'whale', zh: '鲸' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'they', zh: 'they' }
    ],
    sight: ['garden', 'light', 'sea'],
    newWords: [
      { w: 'whale', zh: '鲸' }
    ],
    pages: [
      { art: 'garden|grandpa,dad|seed|·', en: 'Grandpa sees a lot of things in the garden.', zh: '爷爷在花园看见好多东西。' },
      { art: 'garden|grandpa,dad|seed|♪', en: 'Grandpa wants to count them all.', zh: '爷爷想把它们数清楚。' },
      { art: 'garden|grandpa,dad|seed|👀', en: 'Dad points at the seed and then the wing. We say sea, sea and whale again.', zh: '爸爸指着种子，再指翅膀。我们再把这三个词说一遍：海、海和鲸。' },
      { art: 'garden|grandpa,dad|seed|?', en: '"How many are there?" asks Grandpa.', zh: '「一共有几个？」爷爷问。' },
      { art: 'garden|grandpa,dad|seed|·', en: 'Grandpa counts: one, two, three.', zh: '爷爷数：一、二、三。' },
      { art: 'garden|grandpa,dad|seed|!', en: 'They get a different number each time.', zh: '每次数出来的数都不一样。' },
      { art: 'garden|grandpa,dad|wing|♥', en: 'Dad says, "Start from the same end."', zh: '爸爸说：「每次都从同一头开始。」' },
      { art: 'garden|grandpa,dad|seed|★', en: 'This time both get the same number.', zh: '这次两个数对上了。' },
      { art: 'garden|grandpa,dad|seed|?', en: 'They had started from a different place. We say the words again: sea and sea.', zh: '因为每次起点不一样。我们把这两个词再说一遍：海和海。' },
      { art: 'garden|grandpa,dad|seed|·', en: 'Next they will count the wing and the light. They wrote the number where they could see it.', zh: '接下来他们要数翅膀和光。他们把数字写在看得见的地方。' }
    ],
    quiz: [
      { q: '爷爷和爸爸的这一本里，出现了下面哪一样？', opts: ['雪', '陀螺', '海'], a: 2, kind: 'recall' },
      { q: '爷爷两遍数出来的数为什么不一样？', opts: ['因为东西变多了', '每次从不同的地方开始数', '因为数得太慢'], a: 1, kind: 'infer' },
      { q: '数种子总是数错，你会怎么做？', opts: ['随便换个起点重数', '不数了，猜一个', '定好从哪头开始，按同一顺序再数'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b59', lv: 'L5', tag: '小知识', title: 'A Week on the Farm', zh: '农场的一周',
    emoji: '🚜', color: '#C8E7F0',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。这一本走「合上书讲一遍」这条线，认读 1 个新词。',
    trap: '元音组合只读一个长音：ai / ay 都读 /eɪ/，oa 读 /əʊ/；别把两个字母分开念。',
    summary: '《农场的一周》是「合上书讲一遍」：妈妈和明明在农场，围绕农场把一件事读到底。本本词卡：教室。读前先看词卡，读完合上书说一说。',
    retell: '合上书，讲讲妈妈为什么等了那么久，结果学到了什么。（这一本是「合上书讲一遍」。）',
    think: '合上书，用「谁 → 在哪儿 → 出了什么事 → 结果」把农场这一本讲给家长听。',
    pre: [
      { art: '📋', en: 'classroom', zh: '教室' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👩', en: 'mom', zh: '妈妈' }
    ],
    sight: ['farm', 'park', 'whale'],
    newWords: [
      { w: 'classroom', zh: '教室' }
    ],
    pages: [
      { art: 'farm|mom,ming|farm|·', en: 'Mom has just finished a book on the farm.', zh: '妈妈刚在农场读完一本书。' },
      { art: 'farm|mom,ming|farm|♪', en: 'Ming wants to hear all about it.', zh: '明明想听他讲讲。' },
      { art: 'farm|mom,ming|farm|👀', en: 'Mom thinks about the farm in the book. We say whale, whale and classroom again.', zh: '妈妈想着书里的农场。我们再把这三个词说一遍：鲸、鲸和教室。' },
      { art: 'farm|mom,ming|farm|?', en: '"Where do I start?" asks Mom.', zh: '「从哪儿讲起？」妈妈问。' },
      { art: 'farm|mom,ming|farm|·', en: 'Mom tells the last part first.', zh: '妈妈先讲了结尾。' },
      { art: 'farm|mom,ming|farm|!', en: 'Ming cannot follow the story.', zh: '明明听不明白。' },
      { art: 'farm|mom,ming|park|♥', en: 'Ming says, "Tell me who, where, then what."', zh: '明明说：「先说谁、在哪儿、再说出什么事。」' },
      { art: 'farm|mom,ming|farm|★', en: 'This time Ming can see the whole thing.', zh: '这回明明全听明白了。' },
      { art: 'farm|mom,ming|farm|?', en: 'A story needs its order to make sense. We say the words again: whale and whale.', zh: '故事要靠顺序才讲得通。我们把这两个词再说一遍：鲸和鲸。' },
      { art: 'farm|mom,ming|farm|·', en: 'Tomorrow they will read about a park. They could still tell it the next morning.', zh: '明天他们要读讲公园的书。第二天早上，他们还能讲得出来。' }
    ],
    quiz: [
      { q: '在农场读的这一本里，有下面哪一样？', opts: ['教室', '二', '星星'], a: 0, kind: 'recall' },
      { q: '为什么明明第一遍没听明白？', opts: ['因为讲得太慢', '因为故事太短', '先讲了结尾，顺序乱了'], a: 2, kind: 'infer' },
      { q: '要把讲农场的这本读过的书讲给别人听，你会怎么开头？', opts: ['先说谁、在哪儿，再按顺序说出了什么事', '直接从最精彩的那句开始', '先报书名和生词表'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b60', lv: 'L5', tag: '复习', title: 'All the Way Home', zh: '一路回家',
    emoji: '🏡', color: '#E8D9B5',
    track: 'review',
    goal: '把本级和前面级别的词再读一遍、串成一个故事。这一本走「猜一猜」这条线，认读 1 个新词。',
    trap: '元音组合只读一个长音：ai / ay 都读 /eɪ/，oa 读 /əʊ/；别把两个字母分开念。',
    summary: '《一路回家》是「猜一猜」：爸爸和丽丽在图书馆，围绕路把一件事读到底。本本词卡：绵羊。读前先看词卡，读完合上书说一说。',
    retell: '合上书，讲讲爸爸为什么等了那么久，结果学到了什么。（这一本是「猜一猜」。）',
    think: '说说你猜过又查证的一件事：猜对了吗？',
    pre: [
      { art: '🐑', en: 'sheep', zh: '绵羊' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'they', zh: 'they' }
    ],
    sight: ['guess'],
    newWords: [
      { w: 'sheep', zh: '绵羊' }
    ],
    pages: [
      { art: 'library|dad,lili|road|·', en: 'They do not know the answer.', zh: '他们不知道答案。' },
      { art: 'library|dad,lili|road|♪', en: 'They want to find out about the road.', zh: '他们想弄清楚路。' },
      { art: 'library|dad,lili|road|👀', en: 'They look at the question. We say classroom, classroom and sheep again.', zh: '他们看看这个问题。我们再把这三个词说一遍：教室、教室和绵羊。' },
      { art: 'library|dad,lili|road|?', en: '"What do you think?" asks Lili.', zh: '「你怎么想？」丽丽问。' },
      { art: 'library|dad,lili|road|·', en: 'Dad makes a guess.', zh: '爸爸猜了一个答案。' },
      { art: 'library|dad,lili|road|!', en: 'The guess is not right.', zh: '猜得不对。' },
      { art: 'library|dad,lili|street|♥', en: 'Lili says, "Guess again and then check."', zh: '丽丽说：「再猜一次，然后查一查。」' },
      { art: 'library|dad,lili|road|★', en: 'This time the guess is right.', zh: '这次猜对了。' },
      { art: 'library|dad,lili|road|?', en: 'Guessing is how we start to find out. We say the words again: classroom and classroom.', zh: '猜，是我们弄清事情的开始。我们把这两个词再说一遍：教室和教室。' },
      { art: 'library|dad,lili|road|·', en: 'They have a new question now.', zh: '他们现在有了一个新的问题。' }
    ],
    quiz: [
      { q: '这一本里，爸爸看到了下面哪一样？', opts: ['浴盆', '绵羊', '勺子'], a: 1, kind: 'recall' },
      { q: '为什么猜了还要查一查？', opts: ['因为猜太慢', '因为答案太难', '查过以后，猜才变成真的知道'], a: 2, kind: 'infer' },
      { q: '不知道答案时，你会怎么做？', opts: ['随便说一个就当答案', '先猜一个，再想办法查证', '等着别人告诉'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b61', lv: 'L6', tag: '生日', title: 'A Cake for Grandma', zh: '给奶奶的蛋糕',
    emoji: '🎂', color: '#F6C6C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「一起做」这条线，认读 2 个新词。',
    trap: '词尾不发音的 e 会让前面的元音「报自己的名字」：cap → cape，kit → kite。',
    summary: '《给奶奶的蛋糕》是「一起做」：明明和奶奶在家，围绕蛋糕把一件事读到底。本本词卡：蛋糕、盘子。读前先看词卡，读完合上书说一说。',
    retell: '按「计划 → 卡住 → 谁帮了忙 → 结果」讲一遍。（这一本是「一起做」。）',
    think: '说一件你做过的、步骤很多的事：哪一步最容易漏？下次怎么提醒自己？',
    pre: [
      { art: '🎂', en: 'cake', zh: '蛋糕' },
      { art: '🍽️', en: 'plate', zh: '盘子' },
      { art: '📦', en: 'they', zh: 'they' },
      { art: '📦', en: 'the', zh: 'the' }
    ],
    sight: [],
    newWords: [
      { w: 'cake', zh: '蛋糕' },
      { w: 'plate', zh: '盘子' }
    ],
    pages: [
      { art: 'kitchen|ming,grandma|cake|·', en: 'Ming has an idea at home.', zh: '明明在家有了个主意。' },
      { art: 'kitchen|ming,grandma|cake|♪', en: '"Let us make a cake," says Ming.', zh: '「我们做蛋糕吧。」明明说。' },
      { art: 'kitchen|ming,grandma|cake|👀', en: 'They get everything ready. They made a list: cake, plate and spoon.', zh: '他们把要用的东西备齐。他们列了个单子：蛋糕、盘子和勺子。' },
      { art: 'kitchen|ming,grandma|cake|?', en: '"What do we need first?" asks Grandma.', zh: '「先要什么？」奶奶问。' },
      { art: 'kitchen|ming,grandma|cake|·', en: 'They make a list, and they start.', zh: '他们列了个单子，就动手了。' },
      { art: 'kitchen|ming,grandma|cake|!', en: 'It does not look right. Something is wrong.', zh: '样子不对，哪里出了岔子。' },
      { art: 'kitchen|ming,grandma|flag|♥', en: 'Grandma reads the list again, out loud.', zh: '奶奶把单子又大声念了一遍。' },
      { art: 'kitchen|ming,grandma|cake|★', en: 'This time the cake is just right.', zh: '这次蛋糕正好。' },
      { art: 'kitchen|ming,grandma|cake|?', en: 'The first time they did two steps at once.', zh: '第一遍两步并成一步做了。' },
      { art: 'kitchen|ming,grandma|cake|♥', en: 'They are proud of the cake. We say the words again: cake and plate.', zh: '他们为这个蛋糕挺得意。我们把这两个词再说一遍：蛋糕和盘子。' },
      { art: 'kitchen|ming,grandma|cake|·', en: 'They write down what they would do next time. The list went up on the wall.', zh: '他们写下下次要怎么做。那张单子后来贴在了墙上。' }
    ],
    quiz: [
      { q: '明明和奶奶的这一本里，出现了下面哪一样？', opts: ['平底锅', '牛奶', '蛋糕'], a: 2, kind: 'recall' },
      { q: '明明第一次为什么没做成蛋糕？', opts: ['因为没人帮忙', '因为材料不够', '两步并成一步，漏了顺序'], a: 2, kind: 'infer' },
      { q: '做一件步骤很多的事（像做蛋糕那样），你会先做什么？', opts: ['直接跳过开头的步骤', '先把步骤写下来，再一步一步做', '想到哪步做哪步'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b62', lv: 'L6', tag: '春天', title: 'The Kite by the Lake', zh: '湖边的风筝',
    emoji: '🪁', color: '#F9DFB4',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「搭高它」这条线，认读 3 个新词。',
    trap: '词尾不发音的 e 会让前面的元音「报自己的名字」：cap → cape，kit → kite。',
    summary: '《湖边的风筝》是「搭高它」：丽丽和爷爷在操场，围绕风筝把一件事读到底。本本词卡：风筝、高、自行车。读前先看词卡，读完合上书说一说。',
    retell: '按「计划 → 卡住 → 谁帮了忙 → 结果」讲一遍。（这一本是「搭高它」。）',
    think: '说说你搭过的东西：你是怎么让它不倒的？',
    pre: [
      { art: '🪁', en: 'kite', zh: '风筝' },
      { art: '✨', en: 'tall', zh: '高' },
      { art: '🚲', en: 'bike', zh: '自行车' },
      { art: '📦', en: 'they', zh: 'they' },
      { art: '📦', en: 'the', zh: 'the' }
    ],
    sight: ['build', 'piece', 'pieces', 'playground'],
    newWords: [
      { w: 'kite', zh: '风筝' },
      { w: 'tall', zh: '高' },
      { w: 'bike', zh: '自行车' }
    ],
    pages: [
      { art: 'playground|lili,grandpa|kite|·', en: 'They want to build a tall kite.', zh: '他们想搭一个高高的风筝。' },
      { art: 'playground|lili,grandpa|kite|♪', en: 'They want it to be the tallest.', zh: '他们想搭得最高。' },
      { art: 'playground|lili,grandpa|kite|👀', en: 'They look at the pieces in the playground. They made a list: bike, kite and face.', zh: '他们看看操场里的积木。他们列了个单子：自行车、风筝和脸。' },
      { art: 'playground|lili,grandpa|kite|?', en: '"How do we make it stand?" asks Lili.', zh: '「怎么让它站稳？」丽丽问。' },
      { art: 'playground|lili,grandpa|kite|·', en: 'They put one piece on another.', zh: '他们一块一块往上叠。' },
      { art: 'playground|lili,grandpa|kite|!', en: 'It falls down.', zh: '它倒了。' },
      { art: 'playground|lili,grandpa|plate|♥', en: 'Grandpa says, "Make the bottom wide first."', zh: '爷爷说：「先把底座搭宽。」' },
      { art: 'playground|lili,grandpa|kite|★', en: 'Now the kite stands tall.', zh: '现在风筝站得高高的。' },
      { art: 'playground|lili,grandpa|kite|?', en: 'A good bottom makes a tall top.', zh: '底座好，上面才高。' },
      { art: 'playground|lili,grandpa|kite|♥', en: 'They like the tall kite. We say the words again: bike and kite.', zh: '他们喜欢这个高高的风筝。我们把这两个词再说一遍：自行车和风筝。' },
      { art: 'playground|lili,grandpa|kite|·', en: 'They will build another one tomorrow.', zh: '明天他们再搭一个。' }
    ],
    quiz: [
      { q: '在操场读的这一本里，有下面哪一样？', opts: ['底部', '笔', '路'], a: 0, kind: 'recall' },
      { q: '为什么一开始会倒？', opts: ['底座不够宽、不够稳', '因为积木太少', '因为搭得不够快'], a: 0, kind: 'infer' },
      { q: '搭的东西总是倒，你会怎么做？', opts: ['一块块往上猛叠', '先把底座搭宽搭稳', '不搭了'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b63', lv: 'L6', tag: '家里', title: 'A Name on the Plate', zh: '盘子上的名字',
    emoji: '🍽️', color: '#CDE7C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「补一补」这条线，认读 3 个新词。',
    trap: '词尾不发音的 e 会让前面的元音「报自己的名字」：cap → cape，kit → kite。',
    summary: '《盘子上的名字》是「补一补」：奶奶和妈妈在家，围绕名字把一件事读到底。本本词卡：修补、纸条、奇怪。读前先看词卡，读完合上书说一说。',
    retell: '按「计划 → 卡住 → 谁帮了忙 → 结果」讲一遍。（这一本是「补一补」。）',
    think: '说说你补过或看别人补过的一样东西：是用什么办法补好的？',
    pre: [
      { art: '🏃', en: 'mend', zh: '修补' },
      { art: '📝', en: 'note', zh: '纸条' },
      { art: '✨', en: 'strange', zh: '奇怪' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'it', zh: 'it' }
    ],
    sight: ['bigger', 'break', 'care', 'light', 'piece'],
    newWords: [
      { w: 'mend', zh: '修补' },
      { w: 'note', zh: '纸条' },
      { w: 'strange', zh: '奇怪' }
    ],
    pages: [
      { art: 'home|grandma,mom|name|·', en: 'The name has a small break.', zh: '名字破了一个小口子。' },
      { art: 'home|grandma,mom|name|♪', en: 'Grandma wants to mend it.', zh: '奶奶想把它补好。' },
      { art: 'home|grandma,mom|name|👀', en: 'They look at the break in the light. They made a list: note, piece and line.', zh: '他们对着光看那个口子。他们列了个单子：纸条、一块和线。' },
      { art: 'home|grandma,mom|name|?', en: '"Can I do it myself?" asks Grandma.', zh: '「我自己能补吗？」奶奶问。' },
      { art: 'home|grandma,mom|name|·', en: 'Grandma tries to mend it, but it is not easy.', zh: '奶奶试着补，可是不容易。' },
      { art: 'home|grandma,mom|name|!', en: 'It looks a little strange now.', zh: '现在看着有点怪。' },
      { art: 'home|grandma,mom|box|♥', en: 'Mom says, "Let us do it slowly together."', zh: '妈妈说：「我们一起慢慢补。」' },
      { art: 'home|grandma,mom|name|★', en: 'The name is whole again.', zh: '名字又完整了。' },
      { art: 'home|grandma,mom|name|?', en: 'Rushing made the break bigger.', zh: '太着急，口子反而变大了。' },
      { art: 'home|grandma,mom|name|♥', en: 'They are proud of the name. We say the words again: note and piece.', zh: '他们为这个名字感到得意。我们把这两个词再说一遍：纸条和一块。' },
      { art: 'home|grandma,mom|name|·', en: 'They will take care of it from now on.', zh: '以后他们会好好照顾它。' }
    ],
    quiz: [
      { q: '这一本里，奶奶看到了下面哪一样？', opts: ['一块', '别针', '房间'], a: 0, kind: 'recall' },
      { q: '补的时候为什么一开始不顺利？', opts: ['因为光线太暗', '太着急，反而把口子弄大了', '因为针太细'], a: 1, kind: 'infer' },
      { q: '东西破了一点，你会怎么做？', opts: ['直接扔掉', '慢慢试着补，或者请人一起补', '装作没看见'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b64', lv: 'L6', tag: '运动', title: 'Ride a Bike', zh: '骑自行车',
    emoji: '🚲', color: '#C6DEF6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「等一等」这条线，认读 2 个新词。',
    trap: '词尾不发音的 e 会让前面的元音「报自己的名字」：cap → cape，kit → kite。',
    summary: '《骑自行车》是「等一等」：爷爷和爸爸在街道，围绕自行车把一件事读到底。本本词卡：大门、旅行。读前先看词卡，读完合上书说一说。',
    retell: '按「计划 → 卡住 → 谁帮了忙 → 结果」讲一遍。（这一本是「等一等」。）',
    think: '说说你等车或等人的一次经历：等的时候你做了什么？',
    pre: [
      { art: '📍', en: 'gate', zh: '大门' },
      { art: '💡', en: 'trip', zh: '旅行' },
      { art: '📦', en: 'they', zh: 'they' },
      { art: '📦', en: 'the', zh: 'the' }
    ],
    sight: ['leaving', 'means'],
    newWords: [
      { w: 'gate', zh: '大门' },
      { w: 'trip', zh: '旅行' }
    ],
    pages: [
      { art: 'street|grandpa,dad|bike|·', en: 'They wait at the street for the bike.', zh: '他们在街道等自行车。' },
      { art: 'street|grandpa,dad|bike|♪', en: 'They want it to come soon.', zh: '他们想让它快点来。' },
      { art: 'street|grandpa,dad|bike|👀', en: 'They look down the road. They made a list: gate, hole and note.', zh: '他们看看路的那头。他们列了个单子：大门、洞和纸条。' },
      { art: 'street|grandpa,dad|bike|?', en: '"Is it coming?" asks Grandpa.', zh: '「来了吗？」爷爷问。' },
      { art: 'street|grandpa,dad|bike|·', en: 'They wait and wait.', zh: '他们等啊等。' },
      { art: 'street|grandpa,dad|bike|!', en: 'It is still not here.', zh: '还是没来。' },
      { art: 'street|grandpa,dad|path|♥', en: 'Dad says, "Waiting is part of the trip.",', zh: '爸爸说：「等，也是这一趟的一部分。」' },
      { art: 'street|grandpa,dad|bike|★', en: 'There! The bike is coming.', zh: '来了！自行车来了。' },
      { art: 'street|grandpa,dad|bike|?', en: 'Leaving too early means missing it.', zh: '走太早，会正好错过。' },
      { art: 'street|grandpa,dad|bike|♥', en: 'They are glad to go on. We say the words again: gate and hole.', zh: '能继续走，他们很高兴。我们把这两个词再说一遍：大门和洞。' },
      { art: 'street|grandpa,dad|bike|·', en: 'They will wait together next time.', zh: '下次他们还会一起等。' }
    ],
    quiz: [
      { q: '爷爷和爸爸的这一本里，出现了下面哪一样？', opts: ['锅', '海', '大门'], a: 2, kind: 'recall' },
      { q: '为什么走开可能会错过？', opts: ['因为车开得快', '因为天黑了', '正好在那时候来了'], a: 2, kind: 'infer' },
      { q: '等的东西一直没来，你会怎么做？', opts: ['马上走开', '一直大声催', '再多等一会儿，或问问别人'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b65', lv: 'L6', tag: '花园', title: 'A Rose at the Gate', zh: '门口的玫瑰',
    emoji: '🌹', color: '#E0CFF3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「挖一挖」这条线，认读 1 个新词。',
    trap: '词尾不发音的 e 会让前面的元音「报自己的名字」：cap → cape，kit → kite。',
    summary: '《门口的玫瑰》是「挖一挖」：妈妈和明明在花园，围绕玫瑰把一件事读到底。本本词卡：玫瑰。读前先看词卡，读完合上书说一说。',
    retell: '按「计划 → 卡住 → 谁帮了忙 → 结果」讲一遍。（这一本是「挖一挖」。）',
    think: '说说你挖土或玩沙子时发现过的东西：当时你是怎么弄出来的？',
    pre: [
      { art: '🌹', en: 'rose', zh: '玫瑰' },
      { art: '📦', en: 'they', zh: 'they' },
      { art: '📦', en: 'the', zh: 'the' }
    ],
    sight: ['break', 'garden', 'ground'],
    newWords: [
      { w: 'rose', zh: '玫瑰' }
    ],
    pages: [
      { art: 'garden|mom,ming|rose|·', en: 'Mom wants to dig in the garden.', zh: '妈妈想在花园挖一挖。' },
      { art: 'garden|mom,ming|rose|♪', en: 'They want to see what is under the ground.', zh: '他们想看看地下有什么。' },
      { art: 'garden|mom,ming|rose|👀', en: 'They look at the rose and the ground first. They made a list: rose, gate and gate.', zh: '他们先看看玫瑰和地面。他们列了个单子：玫瑰、大门和大门。' },
      { art: 'garden|mom,ming|rose|?', en: '"What will we find?" asks Ming.', zh: '「会挖到什么？」明明问。' },
      { art: 'garden|mom,ming|rose|·', en: 'They dig a small hole.', zh: '他们挖了一个小坑。' },
      { art: 'garden|mom,ming|rose|!', en: 'They hit something hard.', zh: '他们碰到了硬东西。' },
      { art: 'garden|mom,ming|grass|♥', en: 'Ming says, "Dig around it, not at it."', zh: '明明说：「绕着挖，别硬挖。」' },
      { art: 'garden|mom,ming|rose|★', en: 'It is a big stone under the ground.', zh: '是一块大石头埋在地下。' },
      { art: 'garden|mom,ming|rose|?', en: 'Pushing hard could break something.', zh: '硬挖可能会弄坏东西。' },
      { art: 'garden|mom,ming|rose|♥', en: 'They like finding things out. We say the words again: rose and gate.', zh: '他们喜欢发现新东西。我们把这两个词再说一遍：玫瑰和大门。' },
      { art: 'garden|mom,ming|rose|·', en: 'They will dig another day.', zh: '改天他们再挖。' }
    ],
    quiz: [
      { q: '在花园读的这一本里，有下面哪一样？', opts: ['洞', '种子', '比赛'], a: 0, kind: 'recall' },
      { q: '为什么要绕着挖而不是硬挖？', opts: ['因为坑太小', '因为土太硬', '硬挖可能会弄坏东西'], a: 2, kind: 'infer' },
      { q: '挖东西碰到硬的，你会怎么做？', opts: ['绕着它慢慢挖，看清楚是什么', '使劲往下挖', '换个地方不挖了'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b66', lv: 'L6', tag: '发现', title: 'A Note in a Book', zh: '书里的纸条',
    emoji: '📝', color: '#F6C9E3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「分一分」这条线，认读 1 个新词。',
    trap: '词尾不发音的 e 会让前面的元音「报自己的名字」：cap → cape，kit → kite。',
    summary: '《书里的纸条》是「分一分」：爸爸和丽丽在家，围绕纸条把一件事读到底。本本词卡：青柠。读前先看词卡，读完合上书说一说。',
    retell: '按「计划 → 卡住 → 谁帮了忙 → 结果」讲一遍。（这一本是「分一分」。）',
    think: '说说家里只剩一份、两个人都想要的时候，你们是怎么商量的。',
    pre: [
      { art: '🍚', en: 'lime', zh: '青柠' },
      { art: '📦', en: 'they', zh: 'they' },
      { art: '📦', en: 'it', zh: 'it' }
    ],
    sight: [],
    newWords: [
      { w: 'lime', zh: '青柠' }
    ],
    pages: [
      { art: 'home|dad,lili|note|·', en: 'There is only one note at home.', zh: '家只有一个纸条。' },
      { art: 'home|dad,lili|note|♪', en: 'Dad wants it. Lili wants it too.', zh: '爸爸想要，丽丽也想要。' },
      { art: 'home|dad,lili|note|👀', en: 'They look at the note for a long time. They made a list: spoon, bottom and lime.', zh: '他们盯着纸条看了好久。他们列了个单子：勺子、底部和青柠。' },
      { art: 'home|dad,lili|note|?', en: '"How can we both have it?" asks Lili.', zh: '「怎么才能两个人都有？」丽丽问。' },
      { art: 'home|dad,lili|note|·', en: 'Dad says, "You can have it first."', zh: '爸爸说：「你先来吧。」' },
      { art: 'home|dad,lili|note|!', en: 'That is not fair to one of them.', zh: '这样对其中一个不公平。' },
      { art: 'home|dad,lili|pot|♥', en: 'Lili has a better idea.', zh: '丽丽想出个更好的办法。' },
      { art: 'home|dad,lili|note|★', en: 'Now each of them has a part.', zh: '现在两个人各有一份。' },
      { art: 'home|dad,lili|note|?', en: 'One thing can be enough for two people.', zh: '一样东西，也能让两个人都够。' },
      { art: 'home|dad,lili|note|♥', en: 'They sit together and they are happy. We say the words again: spoon and bottom.', zh: '他们坐在一起，都很开心。我们把这两个词再说一遍：勺子和底部。' },
      { art: 'home|dad,lili|note|·', en: 'Next time they will ask before they decide. They both remembered that day.', zh: '下次他们会先问一句，再做决定。那一天两个人都记着。' }
    ],
    quiz: [
      { q: '这一本里，爸爸看到了下面哪一样？', opts: ['勺子', '天鹅', '小店'], a: 0, kind: 'recall' },
      { q: '两个人是怎么都拿到纸条的？', opts: ['商量以后把它分成两份', '又买了一个', '谁力气大谁拿走'], a: 0, kind: 'infer' },
      { q: '只剩一份纸条、两个人都想要时，你会怎么做？', opts: ['谁也不给', '先问一句能不能分，再一起想办法', '先抢到手再说'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b67', lv: 'L6', tag: '玩耍', title: 'Make a Game', zh: '做个游戏',
    emoji: '🎲', color: '#BFE6DF',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「比一比」这条线，认读 2 个新词。',
    trap: '词尾不发音的 e 会让前面的元音「报自己的名字」：cap → cape，kit → kite。',
    summary: '《做个游戏》是「比一比」：明明和奶奶在操场，围绕游戏把一件事读到底。本本词卡：绳子、速度。读前先看词卡，读完合上书说一说。',
    retell: '按「计划 → 卡住 → 谁帮了忙 → 结果」讲一遍。（这一本是「比一比」。）',
    think: '说说你比赛或比快的一次经历：你是怎么把握节奏的？',
    pre: [
      { art: '🪢', en: 'rope', zh: '绳子' },
      { art: '💡', en: 'speed', zh: '速度' },
      { art: '📦', en: 'they', zh: 'they' },
      { art: '📦', en: 'the', zh: 'the' }
    ],
    sight: ['tired'],
    newWords: [
      { w: 'rope', zh: '绳子' },
      { w: 'speed', zh: '速度' }
    ],
    pages: [
      { art: 'playground|ming,grandma|game|·', en: 'They have a race with the game.', zh: '他们用游戏比一场。' },
      { art: 'playground|ming,grandma|game|♪', en: 'They both want to be first.', zh: '他们都想跑第一。' },
      { art: 'playground|ming,grandma|game|👀', en: 'They look at the road in front. They made a list: lime, face and rope.', zh: '他们看看前面的路。他们列了个单子：青柠、脸和绳子。' },
      { art: 'playground|ming,grandma|game|?', en: '"Where do we start?" asks Grandma.', zh: '「从哪儿开始？」奶奶问。' },
      { art: 'playground|ming,grandma|game|·', en: 'They go as fast as they can.', zh: '他们使劲跑。' },
      { art: 'playground|ming,grandma|game|!', en: 'Ming falls a little behind.', zh: '明明落在后面了。' },
      { art: 'playground|ming,grandma|cake|♥', en: 'Grandma says, "Go at your own speed."', zh: '奶奶说：「按你自己的节奏来。」' },
      { art: 'playground|ming,grandma|game|★', en: 'They both get to the end.', zh: '两个人都跑到了终点。' },
      { art: 'playground|ming,grandma|game|?', en: 'Going too fast made Ming tired.', zh: '跑太快，明明反而累了。' },
      { art: 'playground|ming,grandma|game|♥', en: 'They are glad they ran. We say the words again: lime and face.', zh: '他们为跑完感到高兴。我们把这两个词再说一遍：青柠和脸。' },
      { art: 'playground|ming,grandma|game|·', en: 'They will race again another day.', zh: '改天他们再比一次。' }
    ],
    quiz: [
      { q: '明明和奶奶的这一本里，出现了下面哪一样？', opts: ['比赛', '二', '星星'], a: 0, kind: 'recall' },
      { q: '为什么跑太快反而落后？', opts: ['太快累了，撑不到最后', '因为路太滑', '因为鞋太小'], a: 0, kind: 'infer' },
      { q: '比赛时你会怎么把握速度？', opts: ['一开始全力冲', '按自己的节奏来，不一味求快', '看别人快就跟着快'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b68', lv: 'L6', tag: '故事', title: 'The Brave Little Mouse', zh: '勇敢的小老鼠',
    emoji: '🐭', color: '#F2E2A8',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「合上书讲一遍」这条线，认读 1 个新词。',
    trap: '词尾不发音的 e 会让前面的元音「报自己的名字」：cap → cape，kit → kite。',
    summary: '《勇敢的小老鼠》是「合上书讲一遍」：丽丽和爷爷在图书馆，围绕老鼠把一件事读到底。本本词卡：老鼠。读前先看词卡，读完合上书说一说。',
    retell: '按「计划 → 卡住 → 谁帮了忙 → 结果」讲一遍。（这一本是「合上书讲一遍」。）',
    think: '合上书，用「谁 → 在哪儿 → 出了什么事 → 结果」把老鼠这一本讲给家长听。',
    pre: [
      { art: '🐭', en: 'mouse', zh: '老鼠' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👧', en: 'lili', zh: '丽丽' }
    ],
    sight: ['library'],
    newWords: [
      { w: 'mouse', zh: '老鼠' }
    ],
    pages: [
      { art: 'library|lili,grandpa|mouse|·', en: 'Lili has just finished a book in the library.', zh: '丽丽刚在图书馆读完一本书。' },
      { art: 'library|lili,grandpa|mouse|♪', en: 'Grandpa wants to hear all about it.', zh: '爷爷想听他讲讲。' },
      { art: 'library|lili,grandpa|mouse|👀', en: 'Lili thinks about the mouse in the book. They made a list: mouse, plate and rope.', zh: '丽丽想着书里的老鼠。他们列了个单子：老鼠、盘子和绳子。' },
      { art: 'library|lili,grandpa|mouse|?', en: '"Where do I start?" asks Lili.', zh: '「从哪儿讲起？」丽丽问。' },
      { art: 'library|lili,grandpa|mouse|·', en: 'Lili tells the last part first.', zh: '丽丽先讲了结尾。' },
      { art: 'library|lili,grandpa|mouse|!', en: 'Grandpa cannot follow the story.', zh: '爷爷听不明白。' },
      { art: 'library|lili,grandpa|dish|♥', en: 'Grandpa says, "Tell me who, where, then what."', zh: '爷爷说：「先说谁、在哪儿、再说出什么事。」' },
      { art: 'library|lili,grandpa|mouse|★', en: 'This time Grandpa can see the whole thing.', zh: '这回爷爷全听明白了。' },
      { art: 'library|lili,grandpa|mouse|?', en: 'A story needs its order to make sense.', zh: '故事要靠顺序才讲得通。' },
      { art: 'library|lili,grandpa|mouse|♥', en: 'Lili closes the book and tells it again. We say the words again: mouse and plate.', zh: '丽丽合上书，又讲了一遍。我们把这两个词再说一遍：老鼠和盘子。' },
      { art: 'library|lili,grandpa|mouse|·', en: 'Tomorrow they will read about a dish. They could still tell it the next morning.', zh: '明天他们要读讲盘子的书。第二天早上，他们还能讲得出来。' }
    ],
    quiz: [
      { q: '在图书馆读的这一本里，有下面哪一样？', opts: ['水', '盘子', '茎'], a: 1, kind: 'recall' },
      { q: '为什么爷爷第一遍没听明白？', opts: ['先讲了结尾，顺序乱了', '因为讲得太慢', '因为故事太短'], a: 0, kind: 'infer' },
      { q: '要把讲老鼠的这本读过的书讲给别人听，你会怎么开头？', opts: ['直接从最精彩的那句开始', '先报书名和生词表', '先说谁、在哪儿，再按顺序说出了什么事'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b69', lv: 'L6', tag: '发音', title: 'Say It: Cap, Cape', zh: '说一说：cap cape',
    emoji: '🗣️', color: '#D9D2F5',
    track: 'drill',
    goal: '把本级难点音听准、说准，并能在整句里读对。这一本走「跟读整句」这条线，认读 1 个新词。',
    trap: '词尾不发音的 e 会让前面的元音「报自己的名字」：cap → cape，kit → kite。',
    summary: '《说一说：cap cape》是「跟读整句」：奶奶和妈妈在家，围绕鸭舌帽把一件事读到底。本本词卡：鼻子。读前先看词卡，读完合上书说一说。',
    retell: '按「计划 → 卡住 → 谁帮了忙 → 结果」讲一遍。（这一本是「跟读整句」。）',
    think: '挑书里最长的一句英文，先听整句，再分成两段读给家长听。',
    pre: [
      { art: '👃', en: 'nose', zh: '鼻子' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👵', en: 'grandma', zh: '奶奶' }
    ],
    sight: [],
    newWords: [
      { w: 'nose', zh: '鼻子' }
    ],
    pages: [
      { art: 'table|grandma,mom|cap|·', en: 'Grandma opens a book at home.', zh: '奶奶在家翻开一本书。' },
      { art: 'table|grandma,mom|cap|♪', en: 'Grandma wants to read it out loud.', zh: '奶奶想把它读出来。' },
      { art: 'table|grandma,mom|cap|👀', en: 'The sentence with the word "cap" is long. They made a list: sheep, rope and nose.', zh: '带着「cap」这个词的那一句很长。他们列了个单子：绵羊、绳子和鼻子。' },
      { art: 'table|grandma,mom|cap|?', en: '"Where do I stop for breath?" asks Grandma.', zh: '「在哪里换气？」奶奶问。' },
      { art: 'table|grandma,mom|cap|·', en: 'Grandma reads it one word at a time.', zh: '奶奶一个词一个词地读。' },
      { art: 'table|grandma,mom|cap|!', en: 'It sounds broken, not like a sentence.', zh: '听着是碎的，不像一句话。' },
      { art: 'table|grandma,mom|chick|♥', en: 'Mom plays the whole sentence.', zh: '妈妈把整句放了一遍。' },
      { art: 'table|grandma,mom|cap|★', en: 'Now it sounds like one sentence.', zh: '这下听起来像一整句了。' },
      { art: 'table|grandma,mom|cap|?', en: 'The words belong to groups, not to themselves.', zh: '词是成组的，不是一个一个孤立的。' },
      { art: 'table|grandma,mom|cap|♥', en: 'Grandma reads it once more, smiling. We say the words again: sheep and rope.', zh: '奶奶笑着又读了一遍。我们把这两个词再说一遍：绵羊和绳子。' },
      { art: 'table|grandma,mom|cap|·', en: 'They try the next sentence about a chick. Reading out loud became easier after that.', zh: '他们接着试讲小鸡的下一句。从那以后，读出声就不那么难了。' }
    ],
    quiz: [
      { q: '这一本里，奶奶看到了下面哪一样？', opts: ['风', '鼻子', '沙滩'], a: 1, kind: 'recall' },
      { q: '奶奶读「cap」那一句时，为什么一个词一个词读听起来是碎的？', opts: ['句子里的词是成组的，不能逐个蹦', '因为词太难', '因为读得太慢'], a: 0, kind: 'infer' },
      { q: '遇到像「cap」那一句这样很长的英文句子，你会怎么读？', opts: ['先听整句，再按意思分成两三段读', '只看中文跳过英文', '一个词一个词慢慢拼'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b70', lv: 'L6', tag: '小知识', title: 'Why a Cake Rises', zh: '蛋糕为什么会鼓起来',
    emoji: '🧁', color: '#FAD3B6',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。这一本走「数一数」这条线，认读 1 个新词。',
    trap: '词尾不发音的 e 会让前面的元音「报自己的名字」：cap → cape，kit → kite。',
    summary: '《蛋糕为什么会鼓起来》是「数一数」：爷爷和爸爸在家，围绕蛋糕把一件事读到底。本本词卡：方块。读前先看词卡，读完合上书说一说。',
    retell: '按「计划 → 卡住 → 谁帮了忙 → 结果」讲一遍。（这一本是「数一数」。）',
    think: '找家里三样能数的东西，用英文数一遍，说说你怎么保证不数重。',
    pre: [
      { art: '📦', en: 'cube', zh: '方块' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'they', zh: 'they' }
    ],
    sight: [],
    newWords: [
      { w: 'cube', zh: '方块' }
    ],
    pages: [
      { art: 'kitchen|grandpa,dad|cake|·', en: 'Grandpa sees a lot of things at home.', zh: '爷爷在家看见好多东西。' },
      { art: 'kitchen|grandpa,dad|cake|♪', en: 'Grandpa wants to count them all.', zh: '爷爷想把它们数清楚。' },
      { art: 'kitchen|grandpa,dad|cake|👀', en: 'Dad points at the cake and then the brush. They made a list: nose, nose and cube.', zh: '爸爸指着蛋糕，再指刷子。他们列了个单子：鼻子、鼻子和方块。' },
      { art: 'kitchen|grandpa,dad|cake|?', en: '"How many are there?" asks Grandpa.', zh: '「一共有几个？」爷爷问。' },
      { art: 'kitchen|grandpa,dad|cake|·', en: 'Grandpa counts: one, two, three.', zh: '爷爷数：一、二、三。' },
      { art: 'kitchen|grandpa,dad|cake|!', en: 'They get a different number each time.', zh: '每次数出来的数都不一样。' },
      { art: 'kitchen|grandpa,dad|brush|♥', en: 'Dad says, "Start from the same end."', zh: '爸爸说：「每次都从同一头开始。」' },
      { art: 'kitchen|grandpa,dad|cake|★', en: 'This time both get the same number.', zh: '这次两个数对上了。' },
      { art: 'kitchen|grandpa,dad|cake|?', en: 'They had started from a different place.', zh: '因为每次起点不一样。' },
      { art: 'kitchen|grandpa,dad|cake|♥', en: 'They write the number down. We say the words again: nose and nose.', zh: '他们把数字记了下来。我们把这两个词再说一遍：鼻子和鼻子。' },
      { art: 'kitchen|grandpa,dad|cake|·', en: 'Next they will count the brush and the line. They wrote the number where they could see it.', zh: '接下来他们要数刷子和线。他们把数字写在看得见的地方。' }
    ],
    quiz: [
      { q: '爷爷和爸爸的这一本里，出现了下面哪一样？', opts: ['线', '胳膊', '蓝色'], a: 0, kind: 'recall' },
      { q: '爷爷两遍数出来的数为什么不一样？', opts: ['因为数得太慢', '每次从不同的地方开始数', '因为东西变多了'], a: 1, kind: 'infer' },
      { q: '数蛋糕总是数错，你会怎么做？', opts: ['不数了，猜一个', '随便换个起点重数', '定好从哪头开始，按同一顺序再数'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b71', lv: 'L6', tag: '小知识', title: 'A Hole in the Rope', zh: '绳子上的洞',
    emoji: '🪢', color: '#C8E7F0',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。这一本走「合上书讲一遍」这条线，认读 1 个新词。',
    trap: '词尾不发音的 e 会让前面的元音「报自己的名字」：cap → cape，kit → kite。',
    summary: '《绳子上的洞》是「合上书讲一遍」：妈妈和明明在家，围绕洞把一件事读到底。本本词卡：人群。读前先看词卡，读完合上书说一说。',
    retell: '按「计划 → 卡住 → 谁帮了忙 → 结果」讲一遍。（这一本是「合上书讲一遍」。）',
    think: '合上书，用「谁 → 在哪儿 → 出了什么事 → 结果」把洞这一本讲给家长听。',
    pre: [
      { art: '🧑', en: 'crowd', zh: '人群' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👩', en: 'mom', zh: '妈妈' }
    ],
    sight: [],
    newWords: [
      { w: 'crowd', zh: '人群' }
    ],
    pages: [
      { art: 'home|mom,ming|hole|·', en: 'Mom has just finished a book at home.', zh: '妈妈刚在家读完一本书。' },
      { art: 'home|mom,ming|hole|♪', en: 'Ming wants to hear all about it.', zh: '明明想听他讲讲。' },
      { art: 'home|mom,ming|hole|👀', en: 'Mom thinks about the hole in the book. They made a list: cube, cube and crowd.', zh: '妈妈想着书里的洞。他们列了个单子：方块、方块和人群。' },
      { art: 'home|mom,ming|hole|?', en: '"Where do I start?" asks Mom.', zh: '「从哪儿讲起？」妈妈问。' },
      { art: 'home|mom,ming|hole|·', en: 'Mom tells the last part first.', zh: '妈妈先讲了结尾。' },
      { art: 'home|mom,ming|hole|!', en: 'Ming cannot follow the story.', zh: '明明听不明白。' },
      { art: 'home|mom,ming|path|♥', en: 'Ming says, "Tell me who, where, then what."', zh: '明明说：「先说谁、在哪儿、再说出什么事。」' },
      { art: 'home|mom,ming|hole|★', en: 'This time Ming can see the whole thing.', zh: '这回明明全听明白了。' },
      { art: 'home|mom,ming|hole|?', en: 'A story needs its order to make sense.', zh: '故事要靠顺序才讲得通。' },
      { art: 'home|mom,ming|hole|♥', en: 'Mom closes the book and tells it again. We say the words again: cube and cube.', zh: '妈妈合上书，又讲了一遍。我们把这两个词再说一遍：方块和方块。' },
      { art: 'home|mom,ming|hole|·', en: 'Tomorrow they will read about a path. They could still tell it the next morning.', zh: '明天他们要读讲小路的书。第二天早上，他们还能讲得出来。' }
    ],
    quiz: [
      { q: '在家读的这一本里，有下面哪一样？', opts: ['人群', '宝宝', '小船'], a: 0, kind: 'recall' },
      { q: '为什么明明第一遍没听明白？', opts: ['因为讲得太慢', '因为故事太短', '先讲了结尾，顺序乱了'], a: 2, kind: 'infer' },
      { q: '要把讲洞的这本读过的书讲给别人听，你会怎么开头？', opts: ['先说谁、在哪儿，再按顺序说出了什么事', '直接从最精彩的那句开始', '先报书名和生词表'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b72', lv: 'L6', tag: '复习', title: 'The Same Plate', zh: '同一个盘子',
    emoji: '🍽️', color: '#E8D9B5',
    track: 'review',
    goal: '把本级和前面级别的词再读一遍、串成一个故事。这一本走「猜一猜」这条线，认读 1 个新词。',
    trap: '词尾不发音的 e 会让前面的元音「报自己的名字」：cap → cape，kit → kite。',
    summary: '《同一个盘子》是「猜一猜」：爸爸和丽丽在图书馆，围绕盘子把一件事读到底。本本词卡：湖。读前先看词卡，读完合上书说一说。',
    retell: '按「计划 → 卡住 → 谁帮了忙 → 结果」讲一遍。（这一本是「猜一猜」。）',
    think: '说说你猜过又查证的一件事：猜对了吗？',
    pre: [
      { art: '🏞️', en: 'lake', zh: '湖' },
      { art: '📦', en: 'they', zh: 'they' },
      { art: '📦', en: 'the', zh: 'the' }
    ],
    sight: ['crowd', 'guess'],
    newWords: [
      { w: 'lake', zh: '湖' }
    ],
    pages: [
      { art: 'library|dad,lili|plate|·', en: 'They do not know the answer.', zh: '他们不知道答案。' },
      { art: 'library|dad,lili|plate|♪', en: 'They want to find out about the plate.', zh: '他们想弄清楚盘子。' },
      { art: 'library|dad,lili|plate|👀', en: 'They look at the question. They made a list: crowd, crowd and lake.', zh: '他们看看这个问题。他们列了个单子：人群、人群和湖。' },
      { art: 'library|dad,lili|plate|?', en: '"What do you think?" asks Lili.', zh: '「你怎么想？」丽丽问。' },
      { art: 'library|dad,lili|plate|·', en: 'Dad makes a guess.', zh: '爸爸猜了一个答案。' },
      { art: 'library|dad,lili|plate|!', en: 'The guess is not right.', zh: '猜得不对。' },
      { art: 'library|dad,lili|ball|♥', en: 'Lili says, "Guess again and then check."', zh: '丽丽说：「再猜一次，然后查一查。」' },
      { art: 'library|dad,lili|plate|★', en: 'This time the guess is right.', zh: '这次猜对了。' },
      { art: 'library|dad,lili|plate|?', en: 'Guessing is how we start to find out.', zh: '猜，是我们弄清事情的开始。' },
      { art: 'library|dad,lili|plate|♥', en: 'They like finding out. We say the words again: crowd and crowd.', zh: '他们喜欢弄清楚事情。我们把这两个词再说一遍：人群和人群。' },
      { art: 'library|dad,lili|plate|·', en: 'They have a new question now.', zh: '他们现在有了一个新的问题。' }
    ],
    quiz: [
      { q: '这一本里，爸爸看到了下面哪一样？', opts: ['动物园', '湖', '长椅'], a: 1, kind: 'recall' },
      { q: '为什么猜了还要查一查？', opts: ['因为答案太难', '因为猜太慢', '查过以后，猜才变成真的知道'], a: 2, kind: 'infer' },
      { q: '不知道答案时，你会怎么做？', opts: ['随便说一个就当答案', '等着别人告诉', '先猜一个，再想办法查证'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b73', lv: 'L7', tag: '通信', title: 'The Letter from the Farm', zh: '农场来的信',
    emoji: '✉️', color: '#F6C6C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「找回来」这条线，认读 1 个新词。',
    trap: '美音里元音后的 r 一定要卷舌读出来：car、bird、water 都不能吞掉 r。',
    summary: '《农场来的信》是「找回来」：明明和奶奶在家，围绕信把一件事读到底。本本词卡：围巾。读前先看词卡，读完合上书说一说。',
    retell: '倒着讲：先说结局，再说线索是怎么被漏掉的。（这一本是「找回来」。）',
    think: '说一说你有没有把东西放忘了的时候：先说在哪儿丢的，再说最后在哪儿找到。',
    pre: [
      { art: '🧣', en: 'scarf', zh: '围巾' },
      { art: '📦', en: 'they', zh: 'they' },
      { art: '📦', en: 'the', zh: 'the' }
    ],
    sight: [],
    newWords: [
      { w: 'scarf', zh: '围巾' }
    ],
    pages: [
      { art: 'home|ming,grandma|letter|·', en: 'Ming and Grandma are at home. They had been here before.', zh: '明明和奶奶在家。他们以前来过这里。' },
      { art: 'home|ming,grandma|letter|♪', en: 'Ming wants a letter.', zh: '明明想要信。' },
      { art: 'home|ming,grandma|letter|👀', en: 'They look at the race and the bench. They wrote down three words: scarf, letter and teacher.', zh: '他们看看比赛和长椅。他们记下三个词：围巾、信和老师。' },
      { art: 'home|ming,grandma|letter|?', en: '"Where is my letter?" asks Ming.', zh: '「我的信呢？」明明问。' },
      { art: 'home|ming,grandma|letter|·', en: 'They look here, and they look there. They did their best at this step.', zh: '他们这儿看看，那儿看看。这一步他们尽力了。' },
      { art: 'home|ming,grandma|letter|!', en: 'No letter. Not here, not there.', zh: '没有信。这儿没有，那儿也没有。' },
      { art: 'home|ming,grandma|race|♥', en: 'Grandma says, "Let us go back and look again."', zh: '奶奶说：「我们回去再找一遍。」' },
      { art: 'home|ming,grandma|letter|★', en: 'There it is! The letter was at home all along.', zh: '在那儿！信一直在家。' },
      { art: 'home|ming,grandma|letter|?', en: 'They had been in a hurry the first time. It made more sense now.', zh: '第一遍太着急了。这样就说得通了。' },
      { art: 'home|ming,grandma|letter|…', en: 'The best place to look is often where you started.', zh: '最容易漏掉的，常常是最开始的地方。' },
      { art: 'home|ming,grandma|letter|♥', en: 'Ming is glad. Grandma is glad too. We say the words again: scarf and letter.', zh: '明明很高兴，奶奶也很高兴。我们把这两个词再说一遍：围巾和信。' },
      { art: 'home|ming,grandma|letter|·', en: 'They put the letter back where it belongs. From then on, they looked twice before they gave up.', zh: '他们把信放回原处。从那以后，他们会再看一遍才放弃。' }
    ],
    quiz: [
      { q: '明明和奶奶的这一本里，出现了下面哪一样？', opts: ['猪肉', '沙子', '信'], a: 2, kind: 'recall' },
      { q: '为什么第一遍没找到信？', opts: ['因为天黑了', '看得太快，漏掉了最开始的地方', '因为信不见了'], a: 1, kind: 'infer' },
      { q: '如果你的信找不到了，你会先做什么？', opts: ['先回到最开始的地方慢慢找一遍', '不找了，直接走开', '马上再买一个新的'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b74', lv: 'L7', tag: '冬天', title: 'A Scarf for Winter', zh: '冬天的围巾',
    emoji: '🧣', color: '#F9DFB4',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「分一分」这条线，认读 1 个新词。',
    trap: '美音里元音后的 r 一定要卷舌读出来：car、bird、water 都不能吞掉 r。',
    summary: '《冬天的围巾》是「分一分」：丽丽和爷爷在家，围绕围巾把一件事读到底。本本词卡：姐姐。读前先看词卡，读完合上书说一说。',
    retell: '倒着讲：先说结局，再说线索是怎么被漏掉的。（这一本是「分一分」。）',
    think: '说说家里只剩一份、两个人都想要的时候，你们是怎么商量的。',
    pre: [
      { art: '🧑', en: 'sister', zh: '姐姐' },
      { art: '📦', en: 'they', zh: 'they' },
      { art: '📦', en: 'it', zh: 'it' }
    ],
    sight: [],
    newWords: [
      { w: 'sister', zh: '姐姐' }
    ],
    pages: [
      { art: 'home|lili,grandpa|scarf|·', en: 'There is only one scarf at home. They had been here before.', zh: '家只有一个围巾。他们以前来过这里。' },
      { art: 'home|lili,grandpa|scarf|♪', en: 'Lili wants it. Grandpa wants it too.', zh: '丽丽想要，爷爷也想要。' },
      { art: 'home|lili,grandpa|scarf|👀', en: 'They look at the scarf for a long time. They wrote down three words: scarf, lake and sister.', zh: '他们盯着围巾看了好久。他们记下三个词：围巾、湖和姐姐。' },
      { art: 'home|lili,grandpa|scarf|?', en: '"How can we both have it?" asks Grandpa.', zh: '「怎么才能两个人都有？」爷爷问。' },
      { art: 'home|lili,grandpa|scarf|·', en: 'Lili says, "You can have it first." They did their best at this step.', zh: '丽丽说：「你先来吧。」这一步他们尽力了。' },
      { art: 'home|lili,grandpa|scarf|!', en: 'That is not fair to one of them.', zh: '这样对其中一个不公平。' },
      { art: 'home|lili,grandpa|brush|♥', en: 'Grandpa has a better idea.', zh: '爷爷想出个更好的办法。' },
      { art: 'home|lili,grandpa|scarf|★', en: 'Now each of them has a part.', zh: '现在两个人各有一份。' },
      { art: 'home|lili,grandpa|scarf|?', en: 'One thing can be enough for two people. It made more sense now.', zh: '一样东西，也能让两个人都够。这样就说得通了。' },
      { art: 'home|lili,grandpa|scarf|…', en: 'The best idea came after they talked.', zh: '最好的办法是聊出来以后才有的。' },
      { art: 'home|lili,grandpa|scarf|♥', en: 'They sit together and they are happy. We say the words again: scarf and lake.', zh: '他们坐在一起，都很开心。我们把这两个词再说一遍：围巾和湖。' },
      { art: 'home|lili,grandpa|scarf|·', en: 'Next time they will ask before they decide. They both remembered that day.', zh: '下次他们会先问一句，再做决定。那一天两个人都记着。' }
    ],
    quiz: [
      { q: '在家读的这一本里，有下面哪一样？', opts: ['房间', '衬衫', '湖'], a: 2, kind: 'recall' },
      { q: '两个人是怎么都拿到围巾的？', opts: ['商量以后把它分成两份', '又买了一个', '谁力气大谁拿走'], a: 0, kind: 'infer' },
      { q: '只剩一份围巾、两个人都想要时，你会怎么做？', opts: ['先抢到手再说', '先问一句能不能分，再一起想办法', '谁也不给'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b75', lv: 'L7', tag: '观察', title: 'Morning in the Garden', zh: '清晨的花园',
    emoji: '🌻', color: '#CDE7C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「挖一挖」这条线，认读 1 个新词。',
    trap: '美音里元音后的 r 一定要卷舌读出来：car、bird、water 都不能吞掉 r。',
    summary: '《清晨的花园》是「挖一挖」：奶奶和妈妈在花园，围绕花园把一件事读到底。本本词卡：花。读前先看词卡，读完合上书说一说。',
    retell: '倒着讲：先说结局，再说线索是怎么被漏掉的。（这一本是「挖一挖」。）',
    think: '说说你挖土或玩沙子时发现过的东西：当时你是怎么弄出来的？',
    pre: [
      { art: '🌻', en: 'flower', zh: '花' },
      { art: '📦', en: 'they', zh: 'they' },
      { art: '📦', en: 'the', zh: 'the' }
    ],
    sight: ['break', 'ground'],
    newWords: [
      { w: 'flower', zh: '花' }
    ],
    pages: [
      { art: 'garden|grandma,mom|garden|·', en: 'Grandma wants to dig in the garden. They had been here before.', zh: '奶奶想在花园挖一挖。他们以前来过这里。' },
      { art: 'garden|grandma,mom|garden|♪', en: 'They want to see what is under the ground.', zh: '他们想看看地下有什么。' },
      { art: 'garden|grandma,mom|garden|👀', en: 'They look at the garden and the ground first. They wrote down three words: flower, sister and teacher.', zh: '他们先看看花园和地面。他们记下三个词：花、姐姐和老师。' },
      { art: 'garden|grandma,mom|garden|?', en: '"What will we find?" asks Mom.', zh: '「会挖到什么？」妈妈问。' },
      { art: 'garden|grandma,mom|garden|·', en: 'They dig a small hole. They did their best at this step.', zh: '他们挖了一个小坑。这一步他们尽力了。' },
      { art: 'garden|grandma,mom|garden|!', en: 'They hit something hard.', zh: '他们碰到了硬东西。' },
      { art: 'garden|grandma,mom|clock|♥', en: 'Mom says, "Dig around it, not at it."', zh: '妈妈说：「绕着挖，别硬挖。」' },
      { art: 'garden|grandma,mom|garden|★', en: 'It is a big stone under the ground.', zh: '是一块大石头埋在地下。' },
      { art: 'garden|grandma,mom|garden|?', en: 'Pushing hard could break something. It made more sense now.', zh: '硬挖可能会弄坏东西。这样就说得通了。' },
      { art: 'garden|grandma,mom|garden|…', en: 'They fill the hole when they are done.', zh: '挖完，他们把坑填好。' },
      { art: 'garden|grandma,mom|garden|♥', en: 'They like finding things out. We say the words again: flower and sister.', zh: '他们喜欢发现新东西。我们把这两个词再说一遍：花和姐姐。' },
      { art: 'garden|grandma,mom|garden|·', en: 'They will dig another day.', zh: '改天他们再挖。' }
    ],
    quiz: [
      { q: '这一本里，奶奶看到了下面哪一样？', opts: ['天空', '沙子', '花'], a: 2, kind: 'recall' },
      { q: '为什么要绕着挖而不是硬挖？', opts: ['因为坑太小', '因为土太硬', '硬挖可能会弄坏东西'], a: 2, kind: 'infer' },
      { q: '挖东西碰到硬的，你会怎么做？', opts: ['换个地方不挖了', '绕着它慢慢挖，看清楚是什么', '使劲往下挖'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b76', lv: 'L7', tag: '故事', title: 'The Turtle and the Shark', zh: '乌龟和鲨鱼',
    emoji: '🐢', color: '#C6DEF6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「水涨了」这条线，认读 2 个新词。',
    trap: '美音里元音后的 r 一定要卷舌读出来：car、bird、water 都不能吞掉 r。',
    summary: '《乌龟和鲨鱼》是「水涨了」：爷爷和爸爸在沙滩，围绕乌龟把一件事读到底。本本词卡：乌龟、高。读前先看词卡，读完合上书说一说。',
    retell: '倒着讲：先说结局，再说线索是怎么被漏掉的。（这一本是「水涨了」。）',
    think: '说说你在水边玩的一次经历：有没有注意到水的变化？',
    pre: [
      { art: '🐢', en: 'turtle', zh: '乌龟' },
      { art: '✨', en: 'high', zh: '高' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'they', zh: 'they' }
    ],
    sight: ['flower', 'higher', 'near', 'watch'],
    newWords: [
      { w: 'turtle', zh: '乌龟' },
      { w: 'high', zh: '高' }
    ],
    pages: [
      { art: 'beach|grandpa,dad|turtle|·', en: 'They put the turtle near the water. They had been here before.', zh: '他们把乌龟放在水边。他们以前来过这里。' },
      { art: 'beach|grandpa,dad|turtle|♪', en: 'They want to play some more.', zh: '他们想再玩一会儿。' },
      { art: 'beach|grandpa,dad|turtle|👀', en: 'They look at the water. They wrote down three words: turtle, teacher and flower.', zh: '他们看看水。他们记下三个词：乌龟、老师和花。' },
      { art: 'beach|grandpa,dad|turtle|?', en: '"Is the water coming up?" asks Dad.', zh: '「水在涨吗？」爸爸问。' },
      { art: 'beach|grandpa,dad|turtle|·', en: 'They play and do not watch the water. They did their best at this step.', zh: '他们玩着，没注意水。这一步他们尽力了。' },
      { art: 'beach|grandpa,dad|turtle|!', en: 'The water comes up to the turtle.', zh: '水涨到了乌龟旁边。' },
      { art: 'beach|grandpa,dad|moth|♥', en: 'Dad says, "Move the turtle up higher."', zh: '爸爸说：「把乌龟挪高一点。」' },
      { art: 'beach|grandpa,dad|turtle|★', en: 'Now the turtle is safe from the water.', zh: '现在乌龟不会被水泡到了。' },
      { art: 'beach|grandpa,dad|turtle|?', en: 'The water does not stay in one place. It made more sense now.', zh: '水不会一直待在一个地方。这样就说得通了。' },
      { art: 'beach|grandpa,dad|turtle|…', en: 'They moved it just in time.', zh: '他们挪得正是时候。' },
      { art: 'beach|grandpa,dad|turtle|♥', en: 'They are glad the turtle is dry. We say the words again: turtle and teacher.', zh: '乌龟没湿，他们很高兴。我们把这两个词再说一遍：乌龟和老师。' },
      { art: 'beach|grandpa,dad|turtle|·', en: 'They will watch the water when they play.', zh: '以后玩的时候，他们会看着水。' }
    ],
    quiz: [
      { q: '爷爷和爸爸的这一本里，出现了下面哪一样？', opts: ['围巾', '天空', '乌龟'], a: 2, kind: 'recall' },
      { q: '为什么要把乌龟挪高？', opts: ['因为太阳晒', '因为风太大', '水在涨，会把东西泡到'], a: 2, kind: 'infer' },
      { q: '在水边玩，你会注意什么？', opts: ['时不时看看水有没有涨上来', '把东西扔水里', '只顾着玩'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b77', lv: 'L7', tag: '上学', title: 'A Picture for the Teacher', zh: '给老师的画',
    emoji: '🖼️', color: '#E0CFF3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「写一写」这条线，认读 3 个新词。',
    trap: '美音里元音后的 r 一定要卷舌读出来：car、bird、water 都不能吞掉 r。',
    summary: '《给老师的画》是「写一写」：妈妈和明明在学校，围绕图画把一件事读到底。本本词卡：马、市场、猪肉。读前先看词卡，读完合上书说一说。',
    retell: '倒着讲：先说结局，再说线索是怎么被漏掉的。（这一本是「写一写」。）',
    think: '说说你练写字或画画的办法：你是怎么让它变好的？',
    pre: [
      { art: '🐴', en: 'horse', zh: '马' },
      { art: '🥬', en: 'market', zh: '市场' },
      { art: '🍚', en: 'pork', zh: '猪肉' },
      { art: '📦', en: 'they', zh: 'they' },
      { art: '📦', en: 'the', zh: 'the' }
    ],
    sight: ['writes', 'writing'],
    newWords: [
      { w: 'horse', zh: '马' },
      { w: 'market', zh: '市场' },
      { w: 'pork', zh: '猪肉' }
    ],
    pages: [
      { art: 'school|mom,ming|picture|·', en: 'Mom wants to write the word. They had been here before.', zh: '妈妈想写下这个词。他们以前来过这里。' },
      { art: 'school|mom,ming|picture|♪', en: 'They want to write about the picture well.', zh: '他们想把图画写好。' },
      { art: 'school|mom,ming|picture|👀', en: 'They look at the word on the school. They wrote down three words: horse, market and pork.', zh: '他们看看学校上的这个词。他们记下三个词：马、市场和猪肉。' },
      { art: 'school|mom,ming|picture|?', en: '"Where do I start?" asks Mom.', zh: '「从哪一笔开始？」妈妈问。' },
      { art: 'school|mom,ming|picture|·', en: 'Mom writes it once. They did their best at this step.', zh: '妈妈写了一遍。这一步他们尽力了。' },
      { art: 'school|mom,ming|picture|!', en: 'It does not look right.', zh: '看起来不太对。' },
      { art: 'school|mom,ming|clock|♥', en: 'Ming says, "Look, then write, then look.",', zh: '明明说：「先看，再写，再看。」' },
      { art: 'school|mom,ming|picture|★', en: 'This time the word looks right.', zh: '这次这个词写对了。' },
      { art: 'school|mom,ming|picture|?', en: 'Writing needs looking as much as moving. It made more sense now.', zh: '写字，看和动笔一样重要。这样就说得通了。' },
      { art: 'school|mom,ming|picture|…', en: 'They will write it again tomorrow.', zh: '明天他们还会再写一遍。' },
      { art: 'school|mom,ming|picture|♥', en: 'They like the word they wrote. We say the words again: horse and market.', zh: '他们喜欢自己写的这个词。我们把这两个词再说一遍：马和市场。' },
      { art: 'school|mom,ming|picture|·', en: 'They will write one more word.', zh: '他们要再写一个词。' }
    ],
    quiz: [
      { q: '在学校读的这一本里，有下面哪一样？', opts: ['袜子', '陀螺', '图画'], a: 2, kind: 'recall' },
      { q: '为什么先看再写就写得好了？', opts: ['看清楚了，手才知道怎么写', '因为笔更好用', '因为纸更白'], a: 0, kind: 'infer' },
      { q: '字写得不像样，你会怎么做？', opts: ['先看清楚，再写，写完再看看', '一直不停地写', '不写了'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b78', lv: 'L7', tag: '买菜', title: 'The Market at the Corner', zh: '街角的市场',
    emoji: '🥬', color: '#F6C9E3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「帮忙买」这条线，认读 2 个新词。',
    trap: '美音里元音后的 r 一定要卷舌读出来：car、bird、water 都不能吞掉 r。',
    summary: '《街角的市场》是「帮忙买」：爸爸和丽丽在街道，围绕市场把一件事读到底。本本词卡：角落、小汽车。读前先看词卡，读完合上书说一说。',
    retell: '倒着讲：先说结局，再说线索是怎么被漏掉的。（这一本是「帮忙买」。）',
    think: '说说你帮忙买过或找过的一样东西：你是怎么找到它的？',
    pre: [
      { art: '📍', en: 'corner', zh: '角落' },
      { art: '📦', en: 'car', zh: '小汽车' },
      { art: '📦', en: 'they', zh: 'they' },
      { art: '📦', en: 'the', zh: 'the' }
    ],
    sight: [],
    newWords: [
      { w: 'corner', zh: '角落' },
      { w: 'car', zh: '小汽车' }
    ],
    pages: [
      { art: 'street|dad,lili|market|·', en: 'Dad goes to the street for Lili. They had been here before.', zh: '爸爸去街道帮丽丽买。他们以前来过这里。' },
      { art: 'street|dad,lili|market|♪', en: 'They want to buy the right thing.', zh: '他们想买对东西。' },
      { art: 'street|dad,lili|market|👀', en: 'They look at the list and the market. They wrote down three words: corner, car and horse.', zh: '他们看看单子和市场。他们记下三个词：角落、小汽车和马。' },
      { art: 'street|dad,lili|market|?', en: '"What is on the list?" asks Dad.', zh: '「单子上有什么？」爸爸问。' },
      { art: 'street|dad,lili|market|·', en: 'They get one thing and then another. They did their best at this step.', zh: '他们拿了一样，又拿一样。这一步他们尽力了。' },
      { art: 'street|dad,lili|market|!', en: 'They cannot find one thing on the list.', zh: '有一样东西找不到。' },
      { art: 'street|dad,lili|clock|♥', en: 'Lili says, "Ask someone who works here."', zh: '丽丽说：「问问这里的人。」' },
      { art: 'street|dad,lili|market|★', en: 'They find it and buy all the things.', zh: '找到了，东西全买齐了。' },
      { art: 'street|dad,lili|market|?', en: 'Asking is faster than looking alone. It made more sense now.', zh: '问一句，比一个人找快。这样就说得通了。' },
      { art: 'street|dad,lili|market|…', en: 'They check the list before they go now.', zh: '现在他们出门前先看单子。' },
      { art: 'street|dad,lili|market|♥', en: 'They are glad to help Lili. We say the words again: corner and car.', zh: '能帮上丽丽，他们很高兴。我们把这两个词再说一遍：角落和小汽车。' },
      { art: 'street|dad,lili|market|·', en: 'They will help again next time.', zh: '下次他们还会帮忙。' }
    ],
    quiz: [
      { q: '这一本里，爸爸看到了下面哪一样？', opts: ['茎', '角落', '水'], a: 1, kind: 'recall' },
      { q: '为什么最后要开口问人？', opts: ['自己找比问一句慢', '因为东西太贵', '因为单子丢了'], a: 0, kind: 'infer' },
      { q: '买东西找不到，你会怎么做？', opts: ['空手回家', '自己一直找', '问问店里的人'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b79', lv: 'L7', tag: '种植', title: 'Corn in the Garden', zh: '花园里的玉米',
    emoji: '🌽', color: '#BFE6DF',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「收一收」这条线，认读 1 个新词。',
    trap: '美音里元音后的 r 一定要卷舌读出来：car、bird、water 都不能吞掉 r。',
    summary: '《花园里的玉米》是「收一收」：明明和奶奶在农场，围绕玉米把一件事读到底。本本词卡：玉米。读前先看词卡，读完合上书说一说。',
    retell: '倒着讲：先说结局，再说线索是怎么被漏掉的。（这一本是「收一收」。）',
    think: '说一次你和别人一起干的活：你们是怎么分工的？',
    pre: [
      { art: '🌽', en: 'corn', zh: '玉米' },
      { art: '📦', en: 'they', zh: 'they' },
      { art: '📦', en: 'the', zh: 'the' }
    ],
    sight: [],
    newWords: [
      { w: 'corn', zh: '玉米' }
    ],
    pages: [
      { art: 'farm|ming,grandma|corn|·', en: 'The corn is ready to pick. They had been here before.', zh: '玉米可以收了。他们以前来过这里。' },
      { art: 'farm|ming,grandma|corn|♪', en: 'They want to pick it all.', zh: '他们想把它全收下来。' },
      { art: 'farm|ming,grandma|corn|👀', en: 'They look at how much there is. They wrote down three words: farmer, corn and pork.', zh: '他们看看一共有多少。他们记下三个词：农民、玉米和猪肉。' },
      { art: 'farm|ming,grandma|corn|?', en: '"Can we do it all today?" asks Ming.', zh: '「今天能收完吗？」明明问。' },
      { art: 'farm|ming,grandma|corn|·', en: 'They pick the corn one by one. They did their best at this step.', zh: '他们一个一个地收玉米。这一步他们尽力了。' },
      { art: 'farm|ming,grandma|corn|!', en: 'There is still a lot to do.', zh: '还有好多没收。' },
      { art: 'farm|ming,grandma|kite|♥', en: 'Grandma says, "We can each do one part."', zh: '奶奶说：「我们一人做一部分。」' },
      { art: 'farm|ming,grandma|corn|★', en: 'They finish before the sun goes down.', zh: '太阳下山前，他们收完了。' },
      { art: 'farm|ming,grandma|corn|?', en: 'Two people can do more than one. It made more sense now.', zh: '两个人，比一个人做得多。这样就说得通了。' },
      { art: 'farm|ming,grandma|corn|…', en: 'They are glad they did not stop.', zh: '他们庆幸没有半途停下。' },
      { art: 'farm|ming,grandma|corn|♥', en: 'They are proud of the corn. We say the words again: farmer and corn.', zh: '他们为这些玉米感到得意。我们把这两个词再说一遍：农民和玉米。' },
      { art: 'farm|ming,grandma|corn|·', en: 'They will pick the rest tomorrow.', zh: '剩下的明天再收。' }
    ],
    quiz: [
      { q: '明明和奶奶的这一本里，出现了下面哪一样？', opts: ['蚂蚁', '猪肉', '树'], a: 1, kind: 'recall' },
      { q: '为什么两个人一起收就来得及？', opts: ['因为东西变少了', '分工以后活儿变轻了', '因为收得更快'], a: 1, kind: 'infer' },
      { q: '活儿很多一个人做不完，你会怎么做？', opts: ['不做了', '找人一起分一分', '慢慢做到半夜'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b80', lv: 'L7', tag: '寻找', title: 'Search the Park', zh: '找遍公园',
    emoji: '🔍', color: '#F2E2A8',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「合上书讲一遍」这条线，认读 1 个新词。',
    trap: '美音里元音后的 r 一定要卷舌读出来：car、bird、water 都不能吞掉 r。',
    summary: '《找遍公园》是「合上书讲一遍」：丽丽和爷爷在图书馆，围绕公园把一件事读到底。本本词卡：手推车。读前先看词卡，读完合上书说一说。',
    retell: '倒着讲：先说结局，再说线索是怎么被漏掉的。（这一本是「合上书讲一遍」。）',
    think: '合上书，用「谁 → 在哪儿 → 出了什么事 → 结果」把公园这一本讲给家长听。',
    pre: [
      { art: '📦', en: 'cart', zh: '手推车' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'it', zh: 'it' }
    ],
    sight: [],
    newWords: [
      { w: 'cart', zh: '手推车' }
    ],
    pages: [
      { art: 'library|lili,grandpa|park|·', en: 'Lili has just finished a book in the library. They had been here before.', zh: '丽丽刚在图书馆读完一本书。他们以前来过这里。' },
      { art: 'library|lili,grandpa|park|♪', en: 'Grandpa wants to hear all about it.', zh: '爷爷想听他讲讲。' },
      { art: 'library|lili,grandpa|park|👀', en: 'Lili thinks about the park in the book. They wrote down three words: pork, farmer and cart.', zh: '丽丽想着书里的公园。他们记下三个词：猪肉、农民和手推车。' },
      { art: 'library|lili,grandpa|park|?', en: '"Where do I start?" asks Lili.', zh: '「从哪儿讲起？」丽丽问。' },
      { art: 'library|lili,grandpa|park|·', en: 'Lili tells the last part first. They did their best at this step.', zh: '丽丽先讲了结尾。这一步他们尽力了。' },
      { art: 'library|lili,grandpa|park|!', en: 'Grandpa cannot follow the story.', zh: '爷爷听不明白。' },
      { art: 'library|lili,grandpa|dish|♥', en: 'Grandpa says, "Tell me who, where, then what."', zh: '爷爷说：「先说谁、在哪儿、再说出什么事。」' },
      { art: 'library|lili,grandpa|park|★', en: 'This time Grandpa can see the whole thing.', zh: '这回爷爷全听明白了。' },
      { art: 'library|lili,grandpa|park|?', en: 'A story needs its order to make sense. It made more sense now.', zh: '故事要靠顺序才讲得通。这样就说得通了。' },
      { art: 'library|lili,grandpa|park|…', en: 'If you can tell it, you have read it.', zh: '讲得出来，才算真的读过。' },
      { art: 'library|lili,grandpa|park|♥', en: 'Lili closes the book and tells it again. We say the words again: pork and farmer.', zh: '丽丽合上书，又讲了一遍。我们把这两个词再说一遍：猪肉和农民。' },
      { art: 'library|lili,grandpa|park|·', en: 'Tomorrow they will read about a dish. They could still tell it the next morning.', zh: '明天他们要读讲盘子的书。第二天早上，他们还能讲得出来。' }
    ],
    quiz: [
      { q: '在图书馆读的这一本里，有下面哪一样？', opts: ['词', '公园', '蝙蝠'], a: 1, kind: 'recall' },
      { q: '为什么爷爷第一遍没听明白？', opts: ['先讲了结尾，顺序乱了', '因为故事太短', '因为讲得太慢'], a: 0, kind: 'infer' },
      { q: '要把讲公园的这本读过的书讲给别人听，你会怎么开头？', opts: ['先说谁、在哪儿，再按顺序说出了什么事', '直接从最精彩的那句开始', '先报书名和生词表'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b81', lv: 'L7', tag: '发音', title: 'Say It: Car, Bird', zh: '说一说：car bird',
    emoji: '🗣️', color: '#D9D2F5',
    track: 'drill',
    goal: '把本级难点音听准、说准，并能在整句里读对。这一本走「跟读整句」这条线，认读 1 个新词。',
    trap: '美音里元音后的 r 一定要卷舌读出来：car、bird、water 都不能吞掉 r。',
    summary: '《说一说：car bird》是「跟读整句」：奶奶和妈妈在家，围绕小汽车把一件事读到底。本本词卡：医生。读前先看词卡，读完合上书说一说。',
    retell: '倒着讲：先说结局，再说线索是怎么被漏掉的。（这一本是「跟读整句」。）',
    think: '挑书里最长的一句英文，先听整句，再分成两段读给家长听。',
    pre: [
      { art: '🧑', en: 'doctor', zh: '医生' },
      { art: '📦', en: 'it', zh: 'it' },
      { art: '📦', en: 'the', zh: 'the' }
    ],
    sight: [],
    newWords: [
      { w: 'doctor', zh: '医生' }
    ],
    pages: [
      { art: 'table|grandma,mom|car|·', en: 'Grandma opens a book at home. They had been here before.', zh: '奶奶在家翻开一本书。他们以前来过这里。' },
      { art: 'table|grandma,mom|car|♪', en: 'Grandma wants to read it out loud.', zh: '奶奶想把它读出来。' },
      { art: 'table|grandma,mom|car|👀', en: 'The sentence with the word "car" is long. They wrote down three words: car, corner and doctor.', zh: '带着「car」这个词的那一句很长。他们记下三个词：小汽车、角落和医生。' },
      { art: 'table|grandma,mom|car|?', en: '"Where do I stop for breath?" asks Grandma.', zh: '「在哪里换气？」奶奶问。' },
      { art: 'table|grandma,mom|car|·', en: 'Grandma reads it one word at a time. They did their best at this step.', zh: '奶奶一个词一个词地读。这一步他们尽力了。' },
      { art: 'table|grandma,mom|car|!', en: 'It sounds broken, not like a sentence.', zh: '听着是碎的，不像一句话。' },
      { art: 'table|grandma,mom|book|♥', en: 'Mom plays the whole sentence.', zh: '妈妈把整句放了一遍。' },
      { art: 'table|grandma,mom|car|★', en: 'Now it sounds like one sentence.', zh: '这下听起来像一整句了。' },
      { art: 'table|grandma,mom|car|?', en: 'The words belong to groups, not to themselves. It made more sense now.', zh: '词是成组的，不是一个一个孤立的。这样就说得通了。' },
      { art: 'table|grandma,mom|car|…', en: 'Reading is closer to speaking than to spelling.', zh: '读，更接近说，而不是拼。' },
      { art: 'table|grandma,mom|car|♥', en: 'Grandma reads it once more, smiling. We say the words again: car and corner.', zh: '奶奶笑着又读了一遍。我们把这两个词再说一遍：小汽车和角落。' },
      { art: 'table|grandma,mom|car|·', en: 'They try the next sentence about a book. Reading out loud became easier after that.', zh: '他们接着试讲书的下一句。从那以后，读出声就不那么难了。' }
    ],
    quiz: [
      { q: '这一本里，奶奶看到了下面哪一样？', opts: ['医生', '苹果', '鸟'], a: 0, kind: 'recall' },
      { q: '奶奶读「car」那一句时，为什么一个词一个词读听起来是碎的？', opts: ['因为词太难', '因为读得太慢', '句子里的词是成组的，不能逐个蹦'], a: 2, kind: 'infer' },
      { q: '遇到像「car」那一句这样很长的英文句子，你会怎么读？', opts: ['先听整句，再按意思分成两三段读', '只看中文跳过英文', '一个词一个词慢慢拼'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b82', lv: 'L7', tag: '小知识', title: 'Why Winter Is Cold', zh: '冬天为什么冷',
    emoji: '☃️', color: '#FAD3B6',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。这一本走「数一数」这条线，认读 1 个新词。',
    trap: '美音里元音后的 r 一定要卷舌读出来：car、bird、water 都不能吞掉 r。',
    summary: '《冬天为什么冷》是「数一数」：爷爷和爸爸在家，围绕信把一件事读到底。本本词卡：冬天。读前先看词卡，读完合上书说一说。',
    retell: '倒着讲：先说结局，再说线索是怎么被漏掉的。（这一本是「数一数」。）',
    think: '找家里三样能数的东西，用英文数一遍，说说你怎么保证不数重。',
    pre: [
      { art: '⏰', en: 'winter', zh: '冬天' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'they', zh: 'they' }
    ],
    sight: [],
    newWords: [
      { w: 'winter', zh: '冬天' }
    ],
    pages: [
      { art: 'night|grandpa,dad|letter|·', en: 'Grandpa sees a lot of things at home. They had been here before.', zh: '爷爷在家看见好多东西。他们以前来过这里。' },
      { art: 'night|grandpa,dad|letter|♪', en: 'Grandpa wants to count them all.', zh: '爷爷想把它们数清楚。' },
      { art: 'night|grandpa,dad|letter|👀', en: 'Dad points at the letter and then the morning. They wrote down three words: doctor, cart and winter.', zh: '爸爸指着信，再指早晨。他们记下三个词：医生、手推车和冬天。' },
      { art: 'night|grandpa,dad|letter|?', en: '"How many are there?" asks Grandpa.', zh: '「一共有几个？」爷爷问。' },
      { art: 'night|grandpa,dad|letter|·', en: 'Grandpa counts: one, two, three. They did their best at this step.', zh: '爷爷数：一、二、三。这一步他们尽力了。' },
      { art: 'night|grandpa,dad|letter|!', en: 'They get a different number each time.', zh: '每次数出来的数都不一样。' },
      { art: 'night|grandpa,dad|morning|♥', en: 'Dad says, "Start from the same end."', zh: '爸爸说：「每次都从同一头开始。」' },
      { art: 'night|grandpa,dad|letter|★', en: 'This time both get the same number.', zh: '这次两个数对上了。' },
      { art: 'night|grandpa,dad|letter|?', en: 'They had started from a different place. It made more sense now.', zh: '因为每次起点不一样。这样就说得通了。' },
      { art: 'night|grandpa,dad|letter|…', en: 'Being careful is not the same as being slow.', zh: '仔细，和慢不是一回事。' },
      { art: 'night|grandpa,dad|letter|♥', en: 'They write the number down. We say the words again: doctor and cart.', zh: '他们把数字记了下来。我们把这两个词再说一遍：医生和手推车。' },
      { art: 'night|grandpa,dad|letter|·', en: 'Next they will count the morning and the time. They wrote the number where they could see it.', zh: '接下来他们要数早晨和时间。他们把数字写在看得见的地方。' }
    ],
    quiz: [
      { q: '爷爷和爸爸的这一本里，出现了下面哪一样？', opts: ['信', '球', '底部'], a: 0, kind: 'recall' },
      { q: '爷爷两遍数出来的数为什么不一样？', opts: ['每次从不同的地方开始数', '因为数得太慢', '因为东西变多了'], a: 0, kind: 'infer' },
      { q: '数信总是数错，你会怎么做？', opts: ['定好从哪头开始，按同一顺序再数', '不数了，猜一个', '随便换个起点重数'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b83', lv: 'L7', tag: '小知识', title: 'How a Farmer Works', zh: '农民怎么干活',
    emoji: '👨‍🌾', color: '#C8E7F0',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。这一本走「合上书讲一遍」这条线，认读 3 个新词。',
    trap: '美音里元音后的 r 一定要卷舌读出来：car、bird、water 都不能吞掉 r。',
    summary: '《农民怎么干活》是「合上书讲一遍」：妈妈和明明在农场，围绕农民把一件事读到底。本本词卡：钱包、鲨鱼、衬衫。读前先看词卡，读完合上书说一说。',
    retell: '倒着讲：先说结局，再说线索是怎么被漏掉的。（这一本是「合上书讲一遍」。）',
    think: '合上书，用「谁 → 在哪儿 → 出了什么事 → 结果」把农民这一本讲给家长听。',
    pre: [
      { art: '📦', en: 'purse', zh: '钱包' },
      { art: '🦈', en: 'shark', zh: '鲨鱼' },
      { art: '👕', en: 'shirt', zh: '衬衫' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'it', zh: 'it' }
    ],
    sight: [],
    newWords: [
      { w: 'purse', zh: '钱包' },
      { w: 'shark', zh: '鲨鱼' },
      { w: 'shirt', zh: '衬衫' }
    ],
    pages: [
      { art: 'farm|mom,ming|farmer|·', en: 'Mom has just finished a book on the farm. They had been here before.', zh: '妈妈刚在农场读完一本书。他们以前来过这里。' },
      { art: 'farm|mom,ming|farmer|♪', en: 'Ming wants to hear all about it.', zh: '明明想听他讲讲。' },
      { art: 'farm|mom,ming|farmer|👀', en: 'Mom thinks about the farmer in the book. They wrote down three words: purse, shark and shirt.', zh: '妈妈想着书里的农民。他们记下三个词：钱包、鲨鱼和衬衫。' },
      { art: 'farm|mom,ming|farmer|?', en: '"Where do I start?" asks Mom.', zh: '「从哪儿讲起？」妈妈问。' },
      { art: 'farm|mom,ming|farmer|·', en: 'Mom tells the last part first. They did their best at this step.', zh: '妈妈先讲了结尾。这一步他们尽力了。' },
      { art: 'farm|mom,ming|farmer|!', en: 'Ming cannot follow the story.', zh: '明明听不明白。' },
      { art: 'farm|mom,ming|dad|♥', en: 'Ming says, "Tell me who, where, then what."', zh: '明明说：「先说谁、在哪儿、再说出什么事。」' },
      { art: 'farm|mom,ming|farmer|★', en: 'This time Ming can see the whole thing.', zh: '这回明明全听明白了。' },
      { art: 'farm|mom,ming|farmer|?', en: 'A story needs its order to make sense. It made more sense now.', zh: '故事要靠顺序才讲得通。这样就说得通了。' },
      { art: 'farm|mom,ming|farmer|…', en: 'If you can tell it, you have read it.', zh: '讲得出来，才算真的读过。' },
      { art: 'farm|mom,ming|farmer|♥', en: 'Mom closes the book and tells it again. We say the words again: purse and shark.', zh: '妈妈合上书，又讲了一遍。我们把这两个词再说一遍：钱包和鲨鱼。' },
      { art: 'farm|mom,ming|farmer|·', en: 'Tomorrow they will read about a dad. They could still tell it the next morning.', zh: '明天他们要读讲爸爸的书。第二天早上，他们还能讲得出来。' }
    ],
    quiz: [
      { q: '在农场读的这一本里，有下面哪一样？', opts: ['盒子', '钱包', '奶酪'], a: 1, kind: 'recall' },
      { q: '为什么明明第一遍没听明白？', opts: ['因为故事太短', '先讲了结尾，顺序乱了', '因为讲得太慢'], a: 1, kind: 'infer' },
      { q: '要把讲农民的这本读过的书讲给别人听，你会怎么开头？', opts: ['先说谁、在哪儿，再按顺序说出了什么事', '直接从最精彩的那句开始', '先报书名和生词表'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b84', lv: 'L7', tag: '复习', title: 'Back to the First Place', zh: '回到最开始',
    emoji: '🏠', color: '#E8D9B5',
    track: 'review',
    goal: '把本级和前面级别的词再读一遍、串成一个故事。这一本走「猜一猜」这条线，认读 1 个新词。',
    trap: '美音里元音后的 r 一定要卷舌读出来：car、bird、water 都不能吞掉 r。',
    summary: '《回到最开始》是「猜一猜」：爸爸和丽丽在图书馆，围绕角落把一件事读到底。本本词卡：哥哥。读前先看词卡，读完合上书说一说。',
    retell: '倒着讲：先说结局，再说线索是怎么被漏掉的。（这一本是「猜一猜」。）',
    think: '说说你猜过又查证的一件事：猜对了吗？',
    pre: [
      { art: '🧑', en: 'brother', zh: '哥哥' },
      { art: '📦', en: 'they', zh: 'they' },
      { art: '📦', en: 'the', zh: 'the' }
    ],
    sight: ['guess', 'guesses', 'taught'],
    newWords: [
      { w: 'brother', zh: '哥哥' }
    ],
    pages: [
      { art: 'library|dad,lili|corner|·', en: 'They do not know the answer. They had been here before.', zh: '他们不知道答案。他们以前来过这里。' },
      { art: 'library|dad,lili|corner|♪', en: 'They want to find out about the corner.', zh: '他们想弄清楚角落。' },
      { art: 'library|dad,lili|corner|👀', en: 'They look at the question. They wrote down three words: purse, shark and brother.', zh: '他们看看这个问题。他们记下三个词：钱包、鲨鱼和哥哥。' },
      { art: 'library|dad,lili|corner|?', en: '"What do you think?" asks Lili.', zh: '「你怎么想？」丽丽问。' },
      { art: 'library|dad,lili|corner|·', en: 'Dad makes a guess. They did their best at this step.', zh: '爸爸猜了一个答案。这一步他们尽力了。' },
      { art: 'library|dad,lili|corner|!', en: 'The guess is not right.', zh: '猜得不对。' },
      { art: 'library|dad,lili|plate|♥', en: 'Lili says, "Guess again and then check."', zh: '丽丽说：「再猜一次，然后查一查。」' },
      { art: 'library|dad,lili|corner|★', en: 'This time the guess is right.', zh: '这次猜对了。' },
      { art: 'library|dad,lili|corner|?', en: 'Guessing is how we start to find out. It made more sense now.', zh: '猜，是我们弄清事情的开始。这样就说得通了。' },
      { art: 'library|dad,lili|corner|…', en: 'Wrong guesses taught them something.', zh: '猜错的那些，也让他们学到了东西。' },
      { art: 'library|dad,lili|corner|♥', en: 'They like finding out. We say the words again: purse and shark.', zh: '他们喜欢弄清楚事情。我们把这两个词再说一遍：钱包和鲨鱼。' },
      { art: 'library|dad,lili|corner|·', en: 'They have a new question now.', zh: '他们现在有了一个新的问题。' }
    ],
    quiz: [
      { q: '这一本里，爸爸看到了下面哪一样？', opts: ['垃圾桶', '罐子', '哥哥'], a: 2, kind: 'recall' },
      { q: '为什么猜了还要查一查？', opts: ['因为猜太慢', '因为答案太难', '查过以后，猜才变成真的知道'], a: 2, kind: 'infer' },
      { q: '不知道答案时，你会怎么做？', opts: ['先猜一个，再想办法查证', '随便说一个就当答案', '等着别人告诉'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b85', lv: 'L8', tag: '过年', title: 'Dumplings with Grandma', zh: '和奶奶包饺子',
    emoji: '🥟', color: '#F6C6C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「混一混」这条线，认读 3 个新词。',
    trap: 'ou / ow 读 /aʊ/，oi / oy 读 /ɔɪ/；长句按意思分组读，别逐词蹦。',
    summary: '《和奶奶包饺子》是「混一混」：明明和奶奶在家，围绕饺子把一件事读到底。本本词卡：饺子、面条、月饼。读前先看词卡，读完合上书说一说。',
    retell: '按做事情的顺序讲一遍，至少用上三个新词。（这一本是「混一混」。）',
    think: '说说你试过把两样东西混在一起的事：结果怎么样？',
    pre: [
      { art: '🥟', en: 'dumpling', zh: '饺子' },
      { art: '🍜', en: 'noodle', zh: '面条' },
      { art: '🥮', en: 'mooncake', zh: '月饼' },
      { art: '📦', en: 'they', zh: 'they' },
      { art: '📦', en: 'to', zh: 'to' }
    ],
    sight: ['eyes', 'learned', 'pairs'],
    newWords: [
      { w: 'dumpling', zh: '饺子' },
      { w: 'noodle', zh: '面条' },
      { w: 'mooncake', zh: '月饼' }
    ],
    pages: [
      { art: 'kitchen|ming,grandma|dumpling|·', en: 'Ming has a dumpling and a nut. They had been here before.', zh: '明明有饺子和坚果。他们以前来过这里。' },
      { art: 'kitchen|ming,grandma|dumpling|♪', en: 'Ming wants to mix them.', zh: '明明想把它们混在一起。' },
      { art: 'kitchen|ming,grandma|dumpling|👀', en: 'They look at the two things. They looked more than once. Before they went on, they wrote down noodle, dumpling and mooncake.', zh: '他们看看这两样东西。他们看了不止一遍。继续之前，他们先记下面条、饺子和月饼。' },
      { art: 'kitchen|ming,grandma|dumpling|?', en: '"What will happen?" asks Ming.', zh: '「会变成什么样？」明明问。' },
      { art: 'kitchen|ming,grandma|dumpling|·', en: 'They mix them together. They did their best at this step.', zh: '他们把两样混在一起。这一步他们尽力了。' },
      { art: 'kitchen|ming,grandma|dumpling|!', en: 'Now it is hard to use.', zh: '现在不好用了。' },
      { art: 'kitchen|ming,grandma|nut|♥', en: 'Grandma says, "We can try to put them back." Two pairs of eyes see more.', zh: '奶奶说：「我们试试分开。」两双眼睛看得更多。' },
      { art: 'kitchen|ming,grandma|nut|·', en: 'They put them back in two places.', zh: '他们把两样分开放回两个地方。' },
      { art: 'kitchen|ming,grandma|dumpling|★', en: 'Both work well again. They were glad they kept looking.', zh: '两样都好用了。他们庆幸没放弃找。' },
      { art: 'kitchen|ming,grandma|dumpling|?', en: 'Some things work better by themselves.', zh: '有些东西，单独用更好。' },
      { art: 'kitchen|ming,grandma|dumpling|…', en: 'They learned what happens when they mix. It was worth thinking about.', zh: '他们知道了混在一起会怎样。值得想一想。' },
      { art: 'kitchen|ming,grandma|dumpling|♥', en: 'They like to try new things. We say the words again: noodle and dumpling.', zh: '他们喜欢试试新东西。我们把这两个词再说一遍：面条和饺子。' },
      { art: 'kitchen|ming,grandma|dumpling|·', en: 'They will show Grandma what they learned. That was not the last of it.', zh: '他们要把学到的讲给奶奶听。这还不是最后一次。' }
    ],
    quiz: [
      { q: '明明和奶奶的这一本里，出现了下面哪一样？', opts: ['饺子', '海', '蜗牛'], a: 0, kind: 'recall' },
      { q: '为什么最后把两样分开了？', opts: ['因为不够用', '因为太脏了', '混在一起后反而不好用了'], a: 2, kind: 'infer' },
      { q: '想把两样东西混在一起试试，你会怎么做？', opts: ['全部混进去', '不试了', '先问一句，或先试一小点'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b86', lv: 'L8', tag: '中秋', title: 'The Mid-Autumn Moon', zh: '中秋的月亮',
    emoji: '🌕', color: '#F9DFB4',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「一起做」这条线，认读 1 个新词。',
    trap: 'ou / ow 读 /aʊ/，oi / oy 读 /ɔɪ/；长句按意思分组读，别逐词蹦。',
    summary: '《中秋的月亮》是「一起做」：丽丽和爷爷在家，围绕月饼把一件事读到底。本本词卡：汤。读前先看词卡，读完合上书说一说。',
    retell: '按做事情的顺序讲一遍，至少用上三个新词。（这一本是「一起做」。）',
    think: '说一件你做过的、步骤很多的事：哪一步最容易漏？下次怎么提醒自己？',
    pre: [
      { art: '🍲', en: 'soup', zh: '汤' },
      { art: '📦', en: 'they', zh: 'they' },
      { art: '📦', en: 'the', zh: 'the' }
    ],
    sight: ['eyes', 'pairs'],
    newWords: [
      { w: 'soup', zh: '汤' }
    ],
    pages: [
      { art: 'kitchen|lili,grandpa|mooncake|·', en: 'Lili has an idea at home. They had been here before.', zh: '丽丽在家有了个主意。他们以前来过这里。' },
      { art: 'kitchen|lili,grandpa|mooncake|♪', en: '"Let us make a mooncake," says Lili.', zh: '「我们做月饼吧。」丽丽说。' },
      { art: 'kitchen|lili,grandpa|mooncake|👀', en: 'They get everything ready. They looked more than once. Before they went on, they wrote down soup, mooncake and brother.', zh: '他们把要用的东西备齐。他们看了不止一遍。继续之前，他们先记下汤、月饼和哥哥。' },
      { art: 'kitchen|lili,grandpa|mooncake|?', en: '"What do we need first?" asks Grandpa.', zh: '「先要什么？」爷爷问。' },
      { art: 'kitchen|lili,grandpa|mooncake|·', en: 'They make a list, and they start. They did their best at this step.', zh: '他们列了个单子，就动手了。这一步他们尽力了。' },
      { art: 'kitchen|lili,grandpa|mooncake|!', en: 'It does not look right. Something is wrong.', zh: '样子不对，哪里出了岔子。' },
      { art: 'kitchen|lili,grandpa|rice|♥', en: 'Grandpa reads the list again, out loud. Two pairs of eyes see more.', zh: '爷爷把单子又大声念了一遍。两双眼睛看得更多。' },
      { art: 'kitchen|lili,grandpa|rice|·', en: 'They start again, one step at a time.', zh: '他们重来，一步一步做。' },
      { art: 'kitchen|lili,grandpa|mooncake|★', en: 'This time the mooncake is just right. They were glad they kept looking.', zh: '这次月饼正好。他们庆幸没放弃找。' },
      { art: 'kitchen|lili,grandpa|mooncake|?', en: 'The first time they did two steps at once.', zh: '第一遍两步并成一步做了。' },
      { art: 'kitchen|lili,grandpa|mooncake|…', en: 'Slow is not always slower. It was worth thinking about.', zh: '慢，不一定就更慢。值得想一想。' },
      { art: 'kitchen|lili,grandpa|mooncake|♥', en: 'They are proud of the mooncake. We say the words again: soup and mooncake.', zh: '他们为这个月饼挺得意。我们把这两个词再说一遍：汤和月饼。' },
      { art: 'kitchen|lili,grandpa|mooncake|·', en: 'They write down what they would do next time. That was not the last of it. The list went up on the wall.', zh: '他们写下下次要怎么做。这还不是最后一次。那张单子后来贴在了墙上。' }
    ],
    quiz: [
      { q: '在家读的这一本里，有下面哪一样？', opts: ['汤', '轮船', '勺子'], a: 0, kind: 'recall' },
      { q: '丽丽第一次为什么没做成月饼？', opts: ['因为材料不够', '两步并成一步，漏了顺序', '因为没人帮忙'], a: 1, kind: 'infer' },
      { q: '做一件步骤很多的事（像做月饼那样），你会先做什么？', opts: ['直接跳过开头的步骤', '想到哪步做哪步', '先把步骤写下来，再一步一步做'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b87', lv: 'L8', tag: '出行', title: 'A Long Train Ride', zh: '一趟长长的火车',
    emoji: '🚄', color: '#CDE7C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「补一补」这条线，认读 2 个新词。',
    trap: 'ou / ow 读 /aʊ/，oi / oy 读 /ɔɪ/；长句按意思分组读，别逐词蹦。',
    summary: '《一趟长长的火车》是「补一补」：奶奶和妈妈在家，围绕窗户把一件事读到底。本本词卡：窗户、房子。读前先看词卡，读完合上书说一说。',
    retell: '按做事情的顺序讲一遍，至少用上三个新词。（这一本是「补一补」。）',
    think: '说说你补过或看别人补过的一样东西：是用什么办法补好的？',
    pre: [
      { art: '🪟', en: 'window', zh: '窗户' },
      { art: '🏠', en: 'house', zh: '房子' },
      { art: '📦', en: 'they', zh: 'they' },
      { art: '📦', en: 'it', zh: 'it' }
    ],
    sight: ['care', 'eyes', 'pairs'],
    newWords: [
      { w: 'window', zh: '窗户' },
      { w: 'house', zh: '房子' }
    ],
    pages: [
      { art: 'home|grandma,mom|window|·', en: 'The window has a small break. They had been here before.', zh: '窗户破了一个小口子。他们以前来过这里。' },
      { art: 'home|grandma,mom|window|♪', en: 'Grandma wants to mend it.', zh: '奶奶想把它补好。' },
      { art: 'home|grandma,mom|window|👀', en: 'They look at the break in the light. They looked more than once. Before they went on, they wrote down window, house and noodle.', zh: '他们对着光看那个口子。他们看了不止一遍。继续之前，他们先记下窗户、房子和面条。' },
      { art: 'home|grandma,mom|window|?', en: '"Can I do it myself?" asks Grandma.', zh: '「我自己能补吗？」奶奶问。' },
      { art: 'home|grandma,mom|window|·', en: 'Grandma tries to mend it, but it is not easy. They did their best at this step.', zh: '奶奶试着补，可是不容易。这一步他们尽力了。' },
      { art: 'home|grandma,mom|window|!', en: 'It looks a little strange now.', zh: '现在看着有点怪。' },
      { art: 'home|grandma,mom|flag|♥', en: 'Mom says, "Let us do it slowly together." Two pairs of eyes see more.', zh: '妈妈说：「我们一起慢慢补。」两双眼睛看得更多。' },
      { art: 'home|grandma,mom|flag|·', en: 'They do one small part at a time.', zh: '他们一次补一小处。' },
      { art: 'home|grandma,mom|window|★', en: 'The window is whole again. They were glad they kept looking.', zh: '窗户又完整了。他们庆幸没放弃找。' },
      { art: 'home|grandma,mom|window|?', en: 'Rushing made the break bigger.', zh: '太着急，口子反而变大了。' },
      { art: 'home|grandma,mom|window|…', en: 'They did not need a new window. It was worth thinking about.', zh: '他们不需要买新的窗户。值得想一想。' },
      { art: 'home|grandma,mom|window|♥', en: 'They are proud of the window. We say the words again: window and house.', zh: '他们为这个窗户感到得意。我们把这两个词再说一遍：窗户和房子。' },
      { art: 'home|grandma,mom|window|·', en: 'They will take care of it from now on. That was not the last of it.', zh: '以后他们会好好照顾它。这还不是最后一次。' }
    ],
    quiz: [
      { q: '这一本里，奶奶看到了下面哪一样？', opts: ['茶', '房子', '袜子'], a: 1, kind: 'recall' },
      { q: '补的时候为什么一开始不顺利？', opts: ['太着急，反而把口子弄大了', '因为针太细', '因为光线太暗'], a: 0, kind: 'infer' },
      { q: '东西破了一点，你会怎么做？', opts: ['慢慢试着补，或者请人一起补', '直接扔掉', '装作没看见'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b88', lv: 'L8', tag: '通信', title: 'A Letter to My Cousin', zh: '给表姐的信',
    emoji: '💌', color: '#C6DEF6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「排好队」这条线，认读 1 个新词。',
    trap: 'ou / ow 读 /aʊ/，oi / oy 读 /ɔɪ/；长句按意思分组读，别逐词蹦。',
    summary: '《给表姐的信》是「排好队」：爷爷和爸爸在学校，围绕图画把一件事读到底。本本词卡：木板。读前先看词卡，读完合上书说一说。',
    retell: '按做事情的顺序讲一遍，至少用上三个新词。（这一本是「排好队」。）',
    think: '说说你排队的一次经历：排好队以后是不是更快了？',
    pre: [
      { art: '📋', en: 'board', zh: '木板' },
      { art: '📦', en: 'they', zh: 'they' },
      { art: '📦', en: 'the', zh: 'the' }
    ],
    sight: ['eyes', 'pairs'],
    newWords: [
      { w: 'board', zh: '木板' }
    ],
    pages: [
      { art: 'school|grandpa,dad|drawing|·', en: 'They all want to go to the school for the drawing. They had been here before.', zh: '大家都想去学校用图画。他们以前来过这里。' },
      { art: 'school|grandpa,dad|drawing|♪', en: 'They all want to go first.', zh: '大家都想先去。' },
      { art: 'school|grandpa,dad|drawing|👀', en: 'They look at the door. They looked more than once. Before they went on, they wrote down drawing, board and soup.', zh: '他们看看门。他们看了不止一遍。继续之前，他们先记下图画、木板和汤。' },
      { art: 'school|grandpa,dad|drawing|?', en: '"Who goes first?" asks Dad.', zh: '「谁先走？」爸爸问。' },
      { art: 'school|grandpa,dad|drawing|·', en: 'They all go at the same time. They did their best at this step.', zh: '大家一起往前挤。这一步他们尽力了。' },
      { art: 'school|grandpa,dad|drawing|!', en: 'Nobody can get through the door.', zh: '谁也过不去。' },
      { art: 'school|grandpa,dad|room|♥', en: 'Dad says, "Make a line and wait." Two pairs of eyes see more.', zh: '爸爸说：「排好队，等一等。」两双眼睛看得更多。' },
      { art: 'school|grandpa,dad|room|·', en: 'They make a line and wait.', zh: '他们排好队，等着。' },
      { art: 'school|grandpa,dad|drawing|★', en: 'Everyone gets through the door. They were glad they kept looking.', zh: '每个人都走过去了。他们庆幸没放弃找。' },
      { art: 'school|grandpa,dad|drawing|?', en: 'A line is faster than a crowd.', zh: '排队，比挤在一起快。' },
      { art: 'school|grandpa,dad|drawing|…', en: 'They do not need to push. It was worth thinking about.', zh: '他们不用推挤。值得想一想。' },
      { art: 'school|grandpa,dad|drawing|♥', en: 'They are glad to go together. We say the words again: drawing and board.', zh: '他们为一起走感到高兴。我们把这两个词再说一遍：图画和木板。' },
      { art: 'school|grandpa,dad|drawing|·', en: 'They will make a line again next time. That was not the last of it.', zh: '下次他们还会排好队。这还不是最后一次。' }
    ],
    quiz: [
      { q: '爷爷和爸爸的这一本里，出现了下面哪一样？', opts: ['树', '吸管', '汤'], a: 2, kind: 'recall' },
      { q: '为什么一起挤反而谁都过不去？', opts: ['因为大家太慢', '挤在一起堵住了门', '因为门太小'], a: 1, kind: 'infer' },
      { q: '大家都想先走，你会怎么做？', opts: ['排好队，一个接一个', '等别人走完自己再走', '往前挤'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b89', lv: 'L8', tag: '农场', title: 'The Brown Cow', zh: '棕色的奶牛',
    emoji: '🐄', color: '#E0CFF3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「收一收」这条线，认读 1 个新词。',
    trap: 'ou / ow 读 /aʊ/，oi / oy 读 /ɔɪ/；长句按意思分组读，别逐词蹦。',
    summary: '《棕色的奶牛》是「收一收」：妈妈和明明在农场，围绕奶牛把一件事读到底。本本词卡：奶牛。读前先看词卡，读完合上书说一说。',
    retell: '按做事情的顺序讲一遍，至少用上三个新词。（这一本是「收一收」。）',
    think: '说一次你和别人一起干的活：你们是怎么分工的？',
    pre: [
      { art: '🐄', en: 'cow', zh: '奶牛' },
      { art: '📦', en: 'they', zh: 'they' },
      { art: '📦', en: 'the', zh: 'the' }
    ],
    sight: ['eyes', 'pairs'],
    newWords: [
      { w: 'cow', zh: '奶牛' }
    ],
    pages: [
      { art: 'farm|mom,ming|cow|·', en: 'The cow is ready to pick. They had been here before.', zh: '奶牛可以收了。他们以前来过这里。' },
      { art: 'farm|mom,ming|cow|♪', en: 'They want to pick it all.', zh: '他们想把它全收下来。' },
      { art: 'farm|mom,ming|cow|👀', en: 'They look at how much there is. They looked more than once. Before they went on, they wrote down cow, shirt and house.', zh: '他们看看一共有多少。他们看了不止一遍。继续之前，他们先记下奶牛、衬衫和房子。' },
      { art: 'farm|mom,ming|cow|?', en: '"Can we do it all today?" asks Mom.', zh: '「今天能收完吗？」妈妈问。' },
      { art: 'farm|mom,ming|cow|·', en: 'They pick the cow one by one. They did their best at this step.', zh: '他们一个一个地收奶牛。这一步他们尽力了。' },
      { art: 'farm|mom,ming|cow|!', en: 'There is still a lot to do.', zh: '还有好多没收。' },
      { art: 'farm|mom,ming|shark|♥', en: 'Ming says, "We can each do one part." Two pairs of eyes see more.', zh: '明明说：「我们一人做一部分。」两双眼睛看得更多。' },
      { art: 'farm|mom,ming|shark|·', en: 'They each do one part of the work.', zh: '他们一人做一部分。' },
      { art: 'farm|mom,ming|cow|★', en: 'They finish before the sun goes down. They were glad they kept looking.', zh: '太阳下山前，他们收完了。他们庆幸没放弃找。' },
      { art: 'farm|mom,ming|cow|?', en: 'Two people can do more than one.', zh: '两个人，比一个人做得多。' },
      { art: 'farm|mom,ming|cow|…', en: 'They are glad they did not stop. It was worth thinking about.', zh: '他们庆幸没有半途停下。值得想一想。' },
      { art: 'farm|mom,ming|cow|♥', en: 'They are proud of the cow. We say the words again: cow and shirt.', zh: '他们为这些奶牛感到得意。我们把这两个词再说一遍：奶牛和衬衫。' },
      { art: 'farm|mom,ming|cow|·', en: 'They will pick the rest tomorrow. That was not the last of it.', zh: '剩下的明天再收。这还不是最后一次。' }
    ],
    quiz: [
      { q: '在农场读的这一本里，有下面哪一样？', opts: ['窗户', '三', '奶牛'], a: 2, kind: 'recall' },
      { q: '为什么两个人一起收就来得及？', opts: ['因为收得更快', '因为东西变少了', '分工以后活儿变轻了'], a: 2, kind: 'infer' },
      { q: '活儿很多一个人做不完，你会怎么做？', opts: ['慢慢做到半夜', '不做了', '找人一起分一分'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b90', lv: 'L8', tag: '家里', title: 'A House with a Window', zh: '有窗的房子',
    emoji: '🏠', color: '#F6C9E3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「分一分」这条线，认读 1 个新词。',
    trap: 'ou / ow 读 /aʊ/，oi / oy 读 /ɔɪ/；长句按意思分组读，别逐词蹦。',
    summary: '《有窗的房子》是「分一分」：爸爸和丽丽在家，围绕房子把一件事读到底。本本词卡：硬币。读前先看词卡，读完合上书说一说。',
    retell: '按做事情的顺序讲一遍，至少用上三个新词。（这一本是「分一分」。）',
    think: '说说家里只剩一份、两个人都想要的时候，你们是怎么商量的。',
    pre: [
      { art: '🪙', en: 'coin', zh: '硬币' },
      { art: '📦', en: 'they', zh: 'they' },
      { art: '📦', en: 'it', zh: 'it' }
    ],
    sight: ['eyes', 'pairs'],
    newWords: [
      { w: 'coin', zh: '硬币' }
    ],
    pages: [
      { art: 'home|dad,lili|house|·', en: 'There is only one house at home. They had been here before.', zh: '家只有一个房子。他们以前来过这里。' },
      { art: 'home|dad,lili|house|♪', en: 'Dad wants it. Lili wants it too.', zh: '爸爸想要，丽丽也想要。' },
      { art: 'home|dad,lili|house|👀', en: 'They look at the house for a long time. They looked more than once. Before they went on, they wrote down coin, brother and board.', zh: '他们盯着房子看了好久。他们看了不止一遍。继续之前，他们先记下硬币、哥哥和木板。' },
      { art: 'home|dad,lili|house|?', en: '"How can we both have it?" asks Lili.', zh: '「怎么才能两个人都有？」丽丽问。' },
      { art: 'home|dad,lili|house|·', en: 'Dad says, "You can have it first." They did their best at this step.', zh: '爸爸说：「你先来吧。」这一步他们尽力了。' },
      { art: 'home|dad,lili|house|!', en: 'That is not fair to one of them.', zh: '这样对其中一个不公平。' },
      { art: 'home|dad,lili|drum|♥', en: 'Lili has a better idea. Two pairs of eyes see more.', zh: '丽丽想出个更好的办法。两双眼睛看得更多。' },
      { art: 'home|dad,lili|drum|·', en: 'They cut the house into two parts.', zh: '他们把房子分成两份。' },
      { art: 'home|dad,lili|house|★', en: 'Now each of them has a part. They were glad they kept looking.', zh: '现在两个人各有一份。他们庆幸没放弃找。' },
      { art: 'home|dad,lili|house|?', en: 'One thing can be enough for two people.', zh: '一样东西，也能让两个人都够。' },
      { art: 'home|dad,lili|house|…', en: 'The best idea came after they talked. It was worth thinking about.', zh: '最好的办法是聊出来以后才有的。值得想一想。' },
      { art: 'home|dad,lili|house|♥', en: 'They sit together and they are happy. We say the words again: coin and brother.', zh: '他们坐在一起，都很开心。我们把这两个词再说一遍：硬币和哥哥。' },
      { art: 'home|dad,lili|house|·', en: 'Next time they will ask before they decide. That was not the last of it. They both remembered that day.', zh: '下次他们会先问一句，再做决定。这还不是最后一次。那一天两个人都记着。' }
    ],
    quiz: [
      { q: '这一本里，爸爸看到了下面哪一样？', opts: ['水', '硬币', '胳膊'], a: 1, kind: 'recall' },
      { q: '两个人是怎么都拿到房子的？', opts: ['谁力气大谁拿走', '又买了一个', '商量以后把它分成两份'], a: 2, kind: 'infer' },
      { q: '只剩一份房子、两个人都想要时，你会怎么做？', opts: ['先抢到手再说', '先问一句能不能分，再一起想办法', '谁也不给'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b91', lv: 'L8', tag: '数学', title: 'Count the Coins', zh: '数硬币',
    emoji: '🪙', color: '#BFE6DF',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「修好它」这条线，认读 1 个新词。',
    trap: 'ou / ow 读 /aʊ/，oi / oy 读 /ɔɪ/；长句按意思分组读，别逐词蹦。',
    summary: '《数硬币》是「修好它」：明明和奶奶在家，围绕硬币把一件事读到底。本本词卡：毛巾。读前先看词卡，读完合上书说一说。',
    retell: '按做事情的顺序讲一遍，至少用上三个新词。（这一本是「修好它」。）',
    think: '说一样坏过的东西：你一开始反复试了什么？后来发现真正的问题在哪儿？',
    pre: [
      { art: '🧻', en: 'towel', zh: '毛巾' },
      { art: '📦', en: 'they', zh: 'they' },
      { art: '📦', en: 'the', zh: 'the' }
    ],
    sight: ['eyes', 'pairs'],
    newWords: [
      { w: 'towel', zh: '毛巾' }
    ],
    pages: [
      { art: 'home|ming,grandma|coin|·', en: 'The coin does not work at home. They had been here before.', zh: '家的硬币不好使了。他们以前来过这里。' },
      { art: 'home|ming,grandma|coin|♪', en: 'Ming wants to fix it.', zh: '明明想把它修好。' },
      { art: 'home|ming,grandma|coin|👀', en: 'They look at it from every side. They looked more than once. Before they went on, they wrote down coin, coin and towel.', zh: '他们从各个面都看了一遍。他们看了不止一遍。继续之前，他们先记下硬币、硬币和毛巾。' },
      { art: 'home|ming,grandma|coin|?', en: '"What did we change?" asks Grandma.', zh: '「我们改过什么？」奶奶问。' },
      { art: 'home|ming,grandma|coin|·', en: 'Ming tries the same thing again. They did their best at this step.', zh: '明明照原样又试了一次。这一步他们尽力了。' },
      { art: 'home|ming,grandma|coin|!', en: 'It still does not work.', zh: '还是不行。' },
      { art: 'home|ming,grandma|bench|♥', en: 'Grandma points to one small part. Two pairs of eyes see more.', zh: '奶奶指着一个小小的部位。两双眼睛看得更多。' },
      { art: 'home|ming,grandma|bench|·', en: 'They change only that one part.', zh: '他们只换了那一处。' },
      { art: 'home|ming,grandma|coin|★', en: 'Now the coin works again. They were glad they kept looking.', zh: '硬币又能用了。他们庆幸没放弃找。' },
      { art: 'home|ming,grandma|coin|?', en: 'The trouble was small, but it was hard to see.', zh: '毛病很小，可是不容易看见。' },
      { art: 'home|ming,grandma|coin|…', en: 'They almost missed the easy answer. It was worth thinking about.', zh: '他们差点错过了最简单的答案。值得想一想。' },
      { art: 'home|ming,grandma|coin|♥', en: 'Ming laughs. Grandma laughs too. We say the words again: coin and coin.', zh: '明明笑了，奶奶也笑了。我们把这两个词再说一遍：硬币和硬币。' },
      { art: 'home|ming,grandma|coin|·', en: 'They remember to look before they try again. That was not the last of it. They kept the small part in a box.', zh: '他们记住了：再试之前，先看一看。这还不是最后一次。他们把那个小零件收进了盒子。' }
    ],
    quiz: [
      { q: '明明和奶奶的这一本里，出现了下面哪一样？', opts: ['宝宝', '硬币', '鲸'], a: 1, kind: 'recall' },
      { q: '为什么试了很多次都没修好硬币？', opts: ['一直重复同一个动作，没找对小毛病', '因为没人愿意帮忙', '因为工具不够'], a: 0, kind: 'infer' },
      { q: '一件事反复做还是不行（像修硬币那样），你会怎么做？', opts: ['干脆换个人做', '把同样的动作再做十遍', '先停下来看看是不是漏了一处小的'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b92', lv: 'L8', tag: '趣事', title: 'A Loud Shout at Night', zh: '夜里的一声喊',
    emoji: '🌃', color: '#F2E2A8',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「不怕黑」这条线，认读 1 个新词。',
    trap: 'ou / ow 读 /aʊ/，oi / oy 读 /ɔɪ/；长句按意思分组读，别逐词蹦。',
    summary: '《夜里的一声喊》是「不怕黑」：丽丽和爷爷在家，围绕夜晚把一件事读到底。本本词卡：牡蛎。读前先看词卡，读完合上书说一说。',
    retell: '按做事情的顺序讲一遍，至少用上三个新词。（这一本是「不怕黑」。）',
    think: '说说你怕黑的一次经历：后来是怎么不怕的？',
    pre: [
      { art: '🐾', en: 'oyster', zh: '牡蛎' },
      { art: '📦', en: 'they', zh: 'they' },
      { art: '📦', en: 'the', zh: 'the' }
    ],
    sight: ['eyes', 'pairs'],
    newWords: [
      { w: 'oyster', zh: '牡蛎' }
    ],
    pages: [
      { art: 'night|lili,grandpa|night|·', en: 'It gets dark in the room. They had been here before.', zh: '屋里黑下来了。他们以前来过这里。' },
      { art: 'night|lili,grandpa|night|♪', en: 'Lili does not want to be afraid.', zh: '丽丽不想害怕。' },
      { art: 'night|lili,grandpa|night|👀', en: 'They look at the night around the dark room. They looked more than once. Before they went on, they wrote down towel, towel and oyster.', zh: '他们看看黑屋子里的夜晚。他们看了不止一遍。继续之前，他们先记下毛巾、毛巾和牡蛎。' },
      { art: 'night|lili,grandpa|night|?', en: '"What is that?" asks Lili.', zh: '「那是什么？」丽丽问。' },
      { art: 'night|lili,grandpa|night|·', en: 'Lili looks at it more closely. They did their best at this step.', zh: '丽丽更仔细地看了看。这一步他们尽力了。' },
      { art: 'night|lili,grandpa|night|!', en: 'It still looks strange in the dark.', zh: '在黑的地方，它看着还是怪。' },
      { art: 'night|lili,grandpa|book|♥', en: 'Grandpa says, "Turn on a little light." Two pairs of eyes see more.', zh: '爷爷说：「开一盏小灯。」两双眼睛看得更多。' },
      { art: 'night|lili,grandpa|book|·', en: 'They turn on a little light.', zh: '他们开了一盏小灯。' },
      { art: 'night|lili,grandpa|night|★', en: 'It is just the book in the room. They were glad they kept looking.', zh: '原来只是屋里的书。他们庆幸没放弃找。' },
      { art: 'night|lili,grandpa|night|?', en: 'Dark makes things look different.', zh: '黑，会让东西看着不一样。' },
      { art: 'night|lili,grandpa|night|…', en: 'They are not afraid now. It was worth thinking about.', zh: '他们现在不害怕了。值得想一想。' },
      { art: 'night|lili,grandpa|night|♥', en: 'They feel safe in the room. We say the words again: towel and towel.', zh: '他们在屋里觉得很安全。我们把这两个词再说一遍：毛巾和毛巾。' },
      { art: 'night|lili,grandpa|night|·', en: 'They will keep the little light on. That was not the last of it.', zh: '他们会让小灯亮着。这还不是最后一次。' }
    ],
    quiz: [
      { q: '在家读的这一本里，有下面哪一样？', opts: ['蚂蚁', '光', '垃圾桶'], a: 1, kind: 'recall' },
      { q: '为什么黑的时候看着像别的东西？', opts: ['黑会让东西的样子变了', '因为眼睛坏了', '因为东西真的动了'], a: 0, kind: 'infer' },
      { q: '黑的地方看着怪吓人，你会怎么做？', opts: ['跑开不管', '开一点光，看清楚是什么', '一直害怕地躲着'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b93', lv: 'L8', tag: '发音', title: 'Say It: House, Cow', zh: '说一说：house cow',
    emoji: '🗣️', color: '#D9D2F5',
    track: 'drill',
    goal: '把本级难点音听准、说准，并能在整句里读对。这一本走「跟读整句」这条线，认读 1 个新词。',
    trap: 'ou / ow 读 /aʊ/，oi / oy 读 /ɔɪ/；长句按意思分组读，别逐词蹦。',
    summary: '《说一说：house cow》是「跟读整句」：奶奶和妈妈在家，围绕房子把一件事读到底。本本词卡：猫头鹰。读前先看词卡，读完合上书说一说。',
    retell: '按做事情的顺序讲一遍，至少用上三个新词。（这一本是「跟读整句」。）',
    think: '挑书里最长的一句英文，先听整句，再分成两段读给家长听。',
    pre: [
      { art: '🦉', en: 'owl', zh: '猫头鹰' },
      { art: '📦', en: 'they', zh: 'they' },
      { art: '📦', en: 'it', zh: 'it' }
    ],
    sight: ['eyes', 'pairs'],
    newWords: [
      { w: 'owl', zh: '猫头鹰' }
    ],
    pages: [
      { art: 'table|grandma,mom|house|·', en: 'Grandma opens a book at home. They had been here before.', zh: '奶奶在家翻开一本书。他们以前来过这里。' },
      { art: 'table|grandma,mom|house|♪', en: 'Grandma wants to read it out loud.', zh: '奶奶想把它读出来。' },
      { art: 'table|grandma,mom|house|👀', en: 'The sentence with the word "house" is long. They looked more than once. Before they went on, they wrote down oyster, oyster and owl.', zh: '带着「house」这个词的那一句很长。他们看了不止一遍。继续之前，他们先记下牡蛎、牡蛎和猫头鹰。' },
      { art: 'table|grandma,mom|house|?', en: '"Where do I stop for breath?" asks Grandma.', zh: '「在哪里换气？」奶奶问。' },
      { art: 'table|grandma,mom|house|·', en: 'Grandma reads it one word at a time. They did their best at this step.', zh: '奶奶一个词一个词地读。这一步他们尽力了。' },
      { art: 'table|grandma,mom|house|!', en: 'It sounds broken, not like a sentence.', zh: '听着是碎的，不像一句话。' },
      { art: 'table|grandma,mom|hole|♥', en: 'Mom plays the whole sentence. Two pairs of eyes see more.', zh: '妈妈把整句放了一遍。两双眼睛看得更多。' },
      { art: 'table|grandma,mom|hole|·', en: 'Grandma listens, then reads it in two parts.', zh: '奶奶听完，分两段读。' },
      { art: 'table|grandma,mom|house|★', en: 'Now it sounds like one sentence. They were glad they kept looking.', zh: '这下听起来像一整句了。他们庆幸没放弃找。' },
      { art: 'table|grandma,mom|house|?', en: 'The words belong to groups, not to themselves.', zh: '词是成组的，不是一个一个孤立的。' },
      { art: 'table|grandma,mom|house|…', en: 'Reading is closer to speaking than to spelling. It was worth thinking about.', zh: '读，更接近说，而不是拼。值得想一想。' },
      { art: 'table|grandma,mom|house|♥', en: 'Grandma reads it once more, smiling. We say the words again: oyster and oyster.', zh: '奶奶笑着又读了一遍。我们把这两个词再说一遍：牡蛎和牡蛎。' },
      { art: 'table|grandma,mom|house|·', en: 'They try the next sentence about a hole. That was not the last of it. Reading out loud became easier after that.', zh: '他们接着试讲洞的下一句。这还不是最后一次。从那以后，读出声就不那么难了。' }
    ],
    quiz: [
      { q: '这一本里，奶奶看到了下面哪一样？', opts: ['房子', '垃圾桶', '蛋糕'], a: 0, kind: 'recall' },
      { q: '奶奶读「house」那一句时，为什么一个词一个词读听起来是碎的？', opts: ['因为词太难', '因为读得太慢', '句子里的词是成组的，不能逐个蹦'], a: 2, kind: 'infer' },
      { q: '遇到像「house」那一句这样很长的英文句子，你会怎么读？', opts: ['一个词一个词慢慢拼', '先听整句，再按意思分成两三段读', '只看中文跳过英文'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b94', lv: 'L8', tag: '小知识', title: 'Why the Moon Looks Round', zh: '月亮为什么圆',
    emoji: '🔭', color: '#FAD3B6',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。这一本走「数一数」这条线，认读 1 个新词。',
    trap: 'ou / ow 读 /aʊ/，oi / oy 读 /ɔɪ/；长句按意思分组读，别逐词蹦。',
    summary: '《月亮为什么圆》是「数一数」：爷爷和爸爸在家，围绕月饼把一件事读到底。本本词卡：吸管。读前先看词卡，读完合上书说一说。',
    retell: '按做事情的顺序讲一遍，至少用上三个新词。（这一本是「数一数」。）',
    think: '找家里三样能数的东西，用英文数一遍，说说你怎么保证不数重。',
    pre: [
      { art: '🥤', en: 'straw', zh: '吸管' },
      { art: '📦', en: 'they', zh: 'they' },
      { art: '📦', en: 'the', zh: 'the' }
    ],
    sight: ['eyes', 'pairs'],
    newWords: [
      { w: 'straw', zh: '吸管' }
    ],
    pages: [
      { art: 'kitchen|grandpa,dad|mooncake|·', en: 'Grandpa sees a lot of things at home. They had been here before.', zh: '爷爷在家看见好多东西。他们以前来过这里。' },
      { art: 'kitchen|grandpa,dad|mooncake|♪', en: 'Grandpa wants to count them all.', zh: '爷爷想把它们数清楚。' },
      { art: 'kitchen|grandpa,dad|mooncake|👀', en: 'Dad points at the mooncake and then the box. They looked more than once. Before they went on, they wrote down owl, owl and straw.', zh: '爸爸指着月饼，再指盒子。他们看了不止一遍。继续之前，他们先记下猫头鹰、猫头鹰和吸管。' },
      { art: 'kitchen|grandpa,dad|mooncake|?', en: '"How many are there?" asks Grandpa.', zh: '「一共有几个？」爷爷问。' },
      { art: 'kitchen|grandpa,dad|mooncake|·', en: 'Grandpa counts: one, two, three. They did their best at this step.', zh: '爷爷数：一、二、三。这一步他们尽力了。' },
      { art: 'kitchen|grandpa,dad|mooncake|!', en: 'They get a different number each time.', zh: '每次数出来的数都不一样。' },
      { art: 'kitchen|grandpa,dad|box|♥', en: 'Dad says, "Start from the same end." Two pairs of eyes see more.', zh: '爸爸说：「每次都从同一头开始。」两双眼睛看得更多。' },
      { art: 'kitchen|grandpa,dad|box|·', en: 'They count again, slowly and in order.', zh: '他们按着顺序，慢慢再数。' },
      { art: 'kitchen|grandpa,dad|mooncake|★', en: 'This time both get the same number. They were glad they kept looking.', zh: '这次两个数对上了。他们庆幸没放弃找。' },
      { art: 'kitchen|grandpa,dad|mooncake|?', en: 'They had started from a different place.', zh: '因为每次起点不一样。' },
      { art: 'kitchen|grandpa,dad|mooncake|…', en: 'Being careful is not the same as being slow. It was worth thinking about.', zh: '仔细，和慢不是一回事。值得想一想。' },
      { art: 'kitchen|grandpa,dad|mooncake|♥', en: 'They write the number down. We say the words again: owl and owl.', zh: '他们把数字记了下来。我们把这两个词再说一遍：猫头鹰和猫头鹰。' },
      { art: 'kitchen|grandpa,dad|mooncake|·', en: 'Next they will count the box and the cheese. That was not the last of it. They wrote the number where they could see it.', zh: '接下来他们要数盒子和奶酪。这还不是最后一次。他们把数字写在看得见的地方。' }
    ],
    quiz: [
      { q: '爷爷和爸爸的这一本里，出现了下面哪一样？', opts: ['小鸡', '面包', '猫头鹰'], a: 2, kind: 'recall' },
      { q: '爷爷两遍数出来的数为什么不一样？', opts: ['因为数得太慢', '每次从不同的地方开始数', '因为东西变多了'], a: 1, kind: 'infer' },
      { q: '数月饼总是数错，你会怎么做？', opts: ['随便换个起点重数', '不数了，猜一个', '定好从哪头开始，按同一顺序再数'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b95', lv: 'L8', tag: '小知识', title: 'Noodles in the South', zh: '南方的面条',
    emoji: '🍜', color: '#C8E7F0',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。这一本走「合上书讲一遍」这条线，认读 1 个新词。',
    trap: 'ou / ow 读 /aʊ/，oi / oy 读 /ɔɪ/；长句按意思分组读，别逐词蹦。',
    summary: '《南方的面条》是「合上书讲一遍」：妈妈和明明在家，围绕面条把一件事读到底。本本词卡：海岸。读前先看词卡，读完合上书说一说。',
    retell: '按做事情的顺序讲一遍，至少用上三个新词。（这一本是「合上书讲一遍」。）',
    think: '合上书，用「谁 → 在哪儿 → 出了什么事 → 结果」把面条这一本讲给家长听。',
    pre: [
      { art: '🌿', en: 'coast', zh: '海岸' },
      { art: '📦', en: 'they', zh: 'they' },
      { art: '📦', en: 'the', zh: 'the' }
    ],
    sight: ['eyes', 'pairs'],
    newWords: [
      { w: 'coast', zh: '海岸' }
    ],
    pages: [
      { art: 'kitchen|mom,ming|noodle|·', en: 'Mom has just finished a book at home. They had been here before.', zh: '妈妈刚在家读完一本书。他们以前来过这里。' },
      { art: 'kitchen|mom,ming|noodle|♪', en: 'Ming wants to hear all about it.', zh: '明明想听他讲讲。' },
      { art: 'kitchen|mom,ming|noodle|👀', en: 'Mom thinks about the noodle in the book. They looked more than once. Before they went on, they wrote down straw, straw and coast.', zh: '妈妈想着书里的面条。他们看了不止一遍。继续之前，他们先记下吸管、吸管和海岸。' },
      { art: 'kitchen|mom,ming|noodle|?', en: '"Where do I start?" asks Mom.', zh: '「从哪儿讲起？」妈妈问。' },
      { art: 'kitchen|mom,ming|noodle|·', en: 'Mom tells the last part first. They did their best at this step.', zh: '妈妈先讲了结尾。这一步他们尽力了。' },
      { art: 'kitchen|mom,ming|noodle|!', en: 'Ming cannot follow the story.', zh: '明明听不明白。' },
      { art: 'kitchen|mom,ming|board|♥', en: 'Ming says, "Tell me who, where, then what." Two pairs of eyes see more.', zh: '明明说：「先说谁、在哪儿、再说出什么事。」两双眼睛看得更多。' },
      { art: 'kitchen|mom,ming|board|·', en: 'Mom starts again, in order.', zh: '妈妈按顺序重新讲。' },
      { art: 'kitchen|mom,ming|noodle|★', en: 'This time Ming can see the whole thing. They were glad they kept looking.', zh: '这回明明全听明白了。他们庆幸没放弃找。' },
      { art: 'kitchen|mom,ming|noodle|?', en: 'A story needs its order to make sense.', zh: '故事要靠顺序才讲得通。' },
      { art: 'kitchen|mom,ming|noodle|…', en: 'If you can tell it, you have read it. It was worth thinking about.', zh: '讲得出来，才算真的读过。值得想一想。' },
      { art: 'kitchen|mom,ming|noodle|♥', en: 'Mom closes the book and tells it again. We say the words again: straw and straw.', zh: '妈妈合上书，又讲了一遍。我们把这两个词再说一遍：吸管和吸管。' },
      { art: 'kitchen|mom,ming|noodle|·', en: 'Tomorrow they will read about a board. That was not the last of it. They could still tell it the next morning.', zh: '明天他们要读讲木板的书。这还不是最后一次。第二天早上，他们还能讲得出来。' }
    ],
    quiz: [
      { q: '在家读的这一本里，有下面哪一样？', opts: ['海岸', '外套', '公交车'], a: 0, kind: 'recall' },
      { q: '为什么明明第一遍没听明白？', opts: ['先讲了结尾，顺序乱了', '因为讲得太慢', '因为故事太短'], a: 0, kind: 'infer' },
      { q: '要把讲面条的这本读过的书讲给别人听，你会怎么开头？', opts: ['先说谁、在哪儿，再按顺序说出了什么事', '先报书名和生词表', '直接从最精彩的那句开始'], a: 0, kind: 'transfer' }
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
    think: '说说你猜过又查证的一件事：猜对了吗？',
    pre: [
      { art: '🏙️', en: 'town', zh: '小镇' },
      { art: '📦', en: 'they', zh: 'they' },
      { art: '📦', en: 'the', zh: 'the' }
    ],
    sight: ['eyes', 'pairs', 'taught'],
    newWords: [
      { w: 'town', zh: '小镇' }
    ],
    pages: [
      { art: 'library|dad,lili|road|·', en: 'They do not know the answer. They had been here before.', zh: '他们不知道答案。他们以前来过这里。' },
      { art: 'library|dad,lili|road|♪', en: 'They want to find out about the road.', zh: '他们想弄清楚路。' },
      { art: 'library|dad,lili|road|👀', en: 'They look at the question. They looked more than once. Before they went on, they wrote down town, coast and coast.', zh: '他们看看这个问题。他们看了不止一遍。继续之前，他们先记下小镇、海岸和海岸。' },
      { art: 'library|dad,lili|road|?', en: '"What do you think?" asks Lili.', zh: '「你怎么想？」丽丽问。' },
      { art: 'library|dad,lili|road|·', en: 'Dad makes a guess. They did their best at this step.', zh: '爸爸猜了一个答案。这一步他们尽力了。' },
      { art: 'library|dad,lili|road|!', en: 'The guess is not right.', zh: '猜得不对。' },
      { art: 'library|dad,lili|rope|♥', en: 'Lili says, "Guess again and then check." Two pairs of eyes see more.', zh: '丽丽说：「再猜一次，然后查一查。」两双眼睛看得更多。' },
      { art: 'library|dad,lili|rope|·', en: 'They guess again and then check.', zh: '他们又猜一次，然后查了查。' },
      { art: 'library|dad,lili|road|★', en: 'This time the guess is right. They were glad they kept looking.', zh: '这次猜对了。他们庆幸没放弃找。' },
      { art: 'library|dad,lili|road|?', en: 'Guessing is how we start to find out.', zh: '猜，是我们弄清事情的开始。' },
      { art: 'library|dad,lili|road|…', en: 'Wrong guesses taught them something. It was worth thinking about.', zh: '猜错的那些，也让他们学到了东西。值得想一想。' },
      { art: 'library|dad,lili|road|♥', en: 'They like finding out. We say the words again: town and coast.', zh: '他们喜欢弄清楚事情。我们把这两个词再说一遍：小镇和海岸。' },
      { art: 'library|dad,lili|road|·', en: 'They have a new question now. That was not the last of it.', zh: '他们现在有了一个新的问题。这还不是最后一次。' }
    ],
    quiz: [
      { q: '这一本里，爸爸看到了下面哪一样？', opts: ['猫', '底部', '海岸'], a: 2, kind: 'recall' },
      { q: '为什么猜了还要查一查？', opts: ['因为猜太慢', '查过以后，猜才变成真的知道', '因为答案太难'], a: 1, kind: 'infer' },
      { q: '不知道答案时，你会怎么做？', opts: ['等着别人告诉', '随便说一个就当答案', '先猜一个，再想办法查证'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b97', lv: 'L9', tag: '出行', title: 'The Photo at the Station', zh: '车站的照片',
    emoji: '📷', color: '#F6C6C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「找回来」这条线，认读 2 个新词。',
    trap: 'kn / wr / ph 里的第一个字母不发音；读长句时先找主句，再读从句。',
    summary: '《车站的照片》是「找回来」：明明和奶奶在家，围绕照片把一件事读到底。本本词卡：照片、留意。读前先看词卡，读完合上书说一说。',
    retell: '像小讲解员一样，把「现象 → 猜想 → 验证 → 结论」讲清楚。（这一本是「找回来」。）',
    think: '说一说你有没有把东西放忘了的时候：先说在哪儿丢的，再说最后在哪儿找到。',
    pre: [
      { art: '📷', en: 'photo', zh: '照片' },
      { art: '🏃', en: 'notice', zh: '留意' },
      { art: '📦', en: 'they', zh: 'they' },
      { art: '📦', en: 'the', zh: 'the' }
    ],
    sight: ['eyes'],
    newWords: [
      { w: 'photo', zh: '照片' },
      { w: 'notice', zh: '留意' }
    ],
    pages: [
      { art: 'home|ming,grandma|photo|·', en: 'Ming and Grandma are at home. They had been here before.', zh: '明明和奶奶在家。他们以前来过这里。' },
      { art: 'home|ming,grandma|photo|♪', en: 'Ming wants a photo. They had talked about it.', zh: '明明想要照片。他们说起过这件事。' },
      { art: 'home|ming,grandma|photo|👀', en: 'They look at the rope and the game. They looked more than once. They wrote three words on the board: photo, pair and town.', zh: '他们看看绳子和游戏。他们看了不止一遍。他们在黑板上写下三个词：照片、一双和小镇。' },
      { art: 'home|ming,grandma|photo|?', en: '"Where is my photo?" asks Ming. A good question is a good start.', zh: '「我的照片呢？」明明问。问得好，就是好的开始。' },
      { art: 'home|ming,grandma|photo|·', en: 'They look here, and they look there. They did their best at this step.', zh: '他们这儿看看，那儿看看。这一步他们尽力了。' },
      { art: 'home|ming,grandma|photo|!', en: 'No photo. Not here, not there. It was a little disappointing.', zh: '没有照片。这儿没有，那儿也没有。有点让人失望。' },
      { art: 'home|ming,grandma|rope|♥', en: 'Grandma says, "Let us go back and look again." Two pairs of eyes see more.', zh: '奶奶说：「我们回去再找一遍。」两双眼睛看得更多。' },
      { art: 'home|ming,grandma|rope|·', en: 'So they go back and look more slowly. This time they went more slowly.', zh: '于是他们回去，看得慢一些。这次他们慢多了。' },
      { art: 'home|ming,grandma|photo|★', en: 'There it is! The photo was at home all along. They were glad they kept looking.', zh: '在那儿！照片一直在家。他们庆幸没放弃找。' },
      { art: 'home|ming,grandma|photo|?', en: 'They had been in a hurry the first time. Now they could see why.', zh: '第一遍太着急了。现在他们明白了为什么。' },
      { art: 'home|ming,grandma|photo|?', en: 'A quick look and a careful look are not the same. It was a good thing to notice.', zh: '匆匆一看和仔细一看，不是一回事。这一点值得留意。' },
      { art: 'home|ming,grandma|photo|…', en: 'The best place to look is often where you started. It was a good lesson.', zh: '最容易漏掉的，常常是最开始的地方。这是个好教训。' },
      { art: 'home|ming,grandma|photo|♥', en: 'Ming is glad. Grandma is glad too. Both of them felt the same way. We say the words again: photo and pair.', zh: '明明很高兴，奶奶也很高兴。两个人感觉一样。我们把这两个词再说一遍：照片和一双。' },
      { art: 'home|ming,grandma|photo|·', en: 'They put the photo back where it belongs. They would come back to this. From then on, they looked twice before they gave up.', zh: '他们把照片放回原处。他们还会回到这件事上。从那以后，他们会再看一遍才放弃。' }
    ],
    quiz: [
      { q: '明明和奶奶的这一本里，出现了下面哪一样？', opts: ['绳子', '潮水', '轮子'], a: 0, kind: 'recall' },
      { q: '为什么第一遍没找到照片？', opts: ['因为天黑了', '因为照片不见了', '看得太快，漏掉了最开始的地方'], a: 2, kind: 'infer' },
      { q: '如果你的照片找不到了，你会先做什么？', opts: ['先回到最开始的地方慢慢找一遍', '马上再买一个新的', '不找了，直接走开'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b98', lv: 'L9', tag: '上课', title: 'A Question on the Board', zh: '黑板上的问题',
    emoji: '📋', color: '#F9DFB4',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「合上书讲一遍」这条线，认读 3 个新词。',
    trap: 'kn / wr / ph 里的第一个字母不发音；读长句时先找主句，再读从句。',
    summary: '《黑板上的问题》是「合上书讲一遍」：丽丽和爷爷在图书馆，围绕问题把一件事读到底。本本词卡：轮子、世界、手腕。读前先看词卡，读完合上书说一说。',
    retell: '像小讲解员一样，把「现象 → 猜想 → 验证 → 结论」讲清楚。（这一本是「合上书讲一遍」。）',
    think: '合上书，用「谁 → 在哪儿 → 出了什么事 → 结果」把问题这一本讲给家长听。',
    pre: [
      { art: '⚙️', en: 'wheel', zh: '轮子' },
      { art: '🌍', en: 'world', zh: '世界' },
      { art: '📦', en: 'wrist', zh: '手腕' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'they', zh: 'they' }
    ],
    sight: ['eyes'],
    newWords: [
      { w: 'wheel', zh: '轮子' },
      { w: 'world', zh: '世界' },
      { w: 'wrist', zh: '手腕' }
    ],
    pages: [
      { art: 'library|lili,grandpa|question|·', en: 'Lili has just finished a book in the library. They had been here before.', zh: '丽丽刚在图书馆读完一本书。他们以前来过这里。' },
      { art: 'library|lili,grandpa|question|♪', en: 'Grandpa wants to hear all about it. They had talked about it.', zh: '爷爷想听他讲讲。他们说起过这件事。' },
      { art: 'library|lili,grandpa|question|👀', en: 'Lili thinks about the question in the book. They looked more than once. They wrote three words on the board: wheel, world and wrist.', zh: '丽丽想着书里的问题。他们看了不止一遍。他们在黑板上写下三个词：轮子、世界和手腕。' },
      { art: 'library|lili,grandpa|question|?', en: '"Where do I start?" asks Lili. A good question is a good start.', zh: '「从哪儿讲起？」丽丽问。问得好，就是好的开始。' },
      { art: 'library|lili,grandpa|question|·', en: 'Lili tells the last part first. They did their best at this step.', zh: '丽丽先讲了结尾。这一步他们尽力了。' },
      { art: 'library|lili,grandpa|question|!', en: 'Grandpa cannot follow the story. It was a little disappointing.', zh: '爷爷听不明白。有点让人失望。' },
      { art: 'library|lili,grandpa|path|♥', en: 'Grandpa says, "Tell me who, where, then what." Two pairs of eyes see more.', zh: '爷爷说：「先说谁、在哪儿、再说出什么事。」两双眼睛看得更多。' },
      { art: 'library|lili,grandpa|path|·', en: 'Lili starts again, in order. This time they went more slowly.', zh: '丽丽按顺序重新讲。这次他们慢多了。' },
      { art: 'library|lili,grandpa|question|★', en: 'This time Grandpa can see the whole thing. They were glad they kept looking.', zh: '这回爷爷全听明白了。他们庆幸没放弃找。' },
      { art: 'library|lili,grandpa|question|?', en: 'A story needs its order to make sense. Now they could see why.', zh: '故事要靠顺序才讲得通。现在他们明白了为什么。' },
      { art: 'library|lili,grandpa|question|?', en: 'Remembering is not the same as telling. It was a good thing to notice.', zh: '记住，和讲出来不是一回事。这一点值得留意。' },
      { art: 'library|lili,grandpa|question|…', en: 'If you can tell it, you have read it. It was a good lesson.', zh: '讲得出来，才算真的读过。这是个好教训。' },
      { art: 'library|lili,grandpa|question|♥', en: 'Lili closes the book and tells it again. Both of them felt the same way. We say the words again: wheel and world.', zh: '丽丽合上书，又讲了一遍。两个人感觉一样。我们把这两个词再说一遍：轮子和世界。' },
      { art: 'library|lili,grandpa|question|·', en: 'Tomorrow they will read about a path. They would come back to this. They could still tell it the next morning.', zh: '明天他们要读讲小路的书。他们还会回到这件事上。第二天早上，他们还能讲得出来。' }
    ],
    quiz: [
      { q: '在图书馆读的这一本里，有下面哪一样？', opts: ['乌龟', '木板', '动物园'], a: 1, kind: 'recall' },
      { q: '为什么爷爷第一遍没听明白？', opts: ['因为故事太短', '先讲了结尾，顺序乱了', '因为讲得太慢'], a: 1, kind: 'infer' },
      { q: '要把讲问题的这本读过的书讲给别人听，你会怎么开头？', opts: ['先报书名和生词表', '直接从最精彩的那句开始', '先说谁、在哪儿，再按顺序说出了什么事'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b99', lv: 'L9', tag: '观察', title: 'The Shadow in the Field', zh: '田里的影子',
    emoji: '🌾', color: '#CDE7C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「睡不着」这条线，认读 1 个新词。',
    trap: 'kn / wr / ph 里的第一个字母不发音；读长句时先找主句，再读从句。',
    summary: '《田里的影子》是「睡不着」：奶奶和妈妈在家，围绕影子把一件事读到底。本本词卡：影子。读前先看词卡，读完合上书说一说。',
    retell: '像小讲解员一样，把「现象 → 猜想 → 验证 → 结论」讲清楚。（这一本是「睡不着」。）',
    think: '说说你睡不着的一个晚上：你是怎么睡着的？',
    pre: [
      { art: '🌑', en: 'shadow', zh: '影子' },
      { art: '📦', en: 'they', zh: 'they' },
      { art: '📦', en: 'to', zh: 'to' }
    ],
    sight: ['eyes'],
    newWords: [
      { w: 'shadow', zh: '影子' }
    ],
    pages: [
      { art: 'night|grandma,mom|shadow|·', en: 'Grandma is in bed at night. They had been here before.', zh: '夜里奶奶躺在床上。他们以前来过这里。' },
      { art: 'night|grandma,mom|shadow|♪', en: 'They want to go to sleep. They had talked about it.', zh: '他们想睡着。他们说起过这件事。' },
      { art: 'night|grandma,mom|shadow|👀', en: 'They look at the shadow in the dark room. They looked more than once. They wrote three words on the board: shadow, wheel and world.', zh: '他们看看黑屋子里的影子。他们看了不止一遍。他们在黑板上写下三个词：影子、轮子和世界。' },
      { art: 'night|grandma,mom|shadow|?', en: '"Why can I not sleep?" asks Grandma. A good question is a good start.', zh: '「怎么睡不着？」奶奶问。问得好，就是好的开始。' },
      { art: 'night|grandma,mom|shadow|·', en: 'They close their eyes and try. They did their best at this step.', zh: '他们闭上眼睛试。这一步他们尽力了。' },
      { art: 'night|grandma,mom|shadow|!', en: 'They are still awake. It was a little disappointing.', zh: '还是醒着。有点让人失望。' },
      { art: 'night|grandma,mom|photo|♥', en: 'Mom says, "Listen to the quiet sounds." Two pairs of eyes see more.', zh: '妈妈说：「听听安静的声音。」两双眼睛看得更多。' },
      { art: 'night|grandma,mom|photo|·', en: 'They listen to the quiet sounds. This time they went more slowly.', zh: '他们听着安静的声音。这次他们慢多了。' },
      { art: 'night|grandma,mom|shadow|★', en: 'Slowly, they go to sleep. They were glad they kept looking.', zh: '慢慢地，他们睡着了。他们庆幸没放弃找。' },
      { art: 'night|grandma,mom|shadow|?', en: 'Trying hard to sleep makes it hard. Now they could see why.', zh: '使劲想睡，反而睡不着。现在他们明白了为什么。' },
      { art: 'night|grandma,mom|shadow|?', en: 'Being calm is how sleep comes. It was a good thing to notice.', zh: '安静下来，睡意才来。这一点值得留意。' },
      { art: 'night|grandma,mom|shadow|…', en: 'They do not need to try so hard. It was a good lesson.', zh: '他们不需要那么用力。这是个好教训。' },
      { art: 'night|grandma,mom|shadow|♥', en: 'They feel rested in the morning. Both of them felt the same way. We say the words again: shadow and wheel.', zh: '早上他们休息得很好。两个人感觉一样。我们把这两个词再说一遍：影子和轮子。' },
      { art: 'night|grandma,mom|shadow|·', en: 'They will listen to quiet sounds again. They would come back to this.', zh: '他们还会听安静的声音。他们还会回到这件事上。' }
    ],
    quiz: [
      { q: '这一本里，奶奶看到了下面哪一样？', opts: ['房间', '翅膀', '宝宝'], a: 0, kind: 'recall' },
      { q: '为什么使劲想睡反而睡不着？', opts: ['因为天太冷', '用力过头，人就静不下来', '因为床太硬'], a: 1, kind: 'infer' },
      { q: '睡不着的时候，你会怎么做？', opts: ['一直使劲闭眼', '爬起来玩', '听听安静的声音，让自己慢慢静下来'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b100', lv: 'L9', tag: '农事', title: 'Wheat and Harvest', zh: '小麦和收成',
    emoji: '🌾', color: '#C6DEF6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「找回它们」这条线，认读 2 个新词。',
    trap: 'kn / wr / ph 里的第一个字母不发音；读长句时先找主句，再读从句。',
    summary: '《小麦和收成》是「找回它们」：爷爷和爸爸在农场，围绕小麦把一件事读到底。本本词卡：小麦、田地。读前先看词卡，读完合上书说一说。',
    retell: '像小讲解员一样，把「现象 → 猜想 → 验证 → 结论」讲清楚。（这一本是「找回它们」。）',
    think: '说说你遇到小动物乱跑时是怎么做的：有用吗？',
    pre: [
      { art: '🌾', en: 'wheat', zh: '小麦' },
      { art: '🌾', en: 'field', zh: '田地' },
      { art: '📦', en: 'they', zh: 'they' },
      { art: '📦', en: 'the', zh: 'the' }
    ],
    sight: ['eyes'],
    newWords: [
      { w: 'wheat', zh: '小麦' },
      { w: 'field', zh: '田地' }
    ],
    pages: [
      { art: 'farm|grandpa,dad|wheat|·', en: 'The wheat runs off in all directions. They had been here before.', zh: '小麦四处跑散了。他们以前来过这里。' },
      { art: 'farm|grandpa,dad|wheat|♪', en: 'Grandpa wants to get them all back. They had talked about it.', zh: '爷爷想把它们都找回来。他们说起过这件事。' },
      { art: 'farm|grandpa,dad|wheat|👀', en: 'They look around the farm. They looked more than once. They wrote three words on the board: field, wheat and wrist.', zh: '他们看看农场四周。他们看了不止一遍。他们在黑板上写下三个词：田地、小麦和手腕。' },
      { art: 'farm|grandpa,dad|wheat|?', en: '"How do we get them back?" asks Grandpa. A good question is a good start.', zh: '「怎么把它们叫回来？」爷爷问。问得好，就是好的开始。' },
      { art: 'farm|grandpa,dad|wheat|·', en: 'Grandpa runs after them. They did their best at this step.', zh: '爷爷在后面追。这一步他们尽力了。' },
      { art: 'farm|grandpa,dad|wheat|!', en: 'They run even farther away. It was a little disappointing.', zh: '它们跑得更远了。有点让人失望。' },
      { art: 'farm|grandpa,dad|cow|♥', en: 'Dad says, "Do not chase. Stand still." Two pairs of eyes see more.', zh: '爸爸说：「别追，站着别动。」两双眼睛看得更多。' },
      { art: 'farm|grandpa,dad|cow|·', en: 'They stand still and wait. This time they went more slowly.', zh: '他们站着不动，等着。这次他们慢多了。' },
      { art: 'farm|grandpa,dad|wheat|★', en: 'The wheat comes back on its own. They were glad they kept looking.', zh: '小麦自己回来了。他们庆幸没放弃找。' },
      { art: 'farm|grandpa,dad|wheat|?', en: 'Chasing made them afraid. Now they could see why.', zh: '追，让它们害怕。现在他们明白了为什么。' },
      { art: 'farm|grandpa,dad|wheat|?', en: 'Being calm brings calm. It was a good thing to notice.', zh: '安静下来，它们也安静下来。这一点值得留意。' },
      { art: 'farm|grandpa,dad|wheat|…', en: 'Running was not the answer. It was a good lesson.', zh: '跑，不是解决问题的办法。这是个好教训。' },
      { art: 'farm|grandpa,dad|wheat|♥', en: 'They are glad to have them back. Both of them felt the same way. We say the words again: field and wheat.', zh: '它们回来了，他们很高兴。两个人感觉一样。我们把这两个词再说一遍：田地和小麦。' },
      { art: 'farm|grandpa,dad|wheat|·', en: 'They will keep a close eye on the wheat. They would come back to this.', zh: '他们会好好看着小麦。他们还会回到这件事上。' }
    ],
    quiz: [
      { q: '爷爷和爸爸的这一本里，出现了下面哪一样？', opts: ['苹果', '手腕', '风'], a: 1, kind: 'recall' },
      { q: '为什么追反而让它们跑得更远？', opts: ['因为跑得太慢', '追让它们害怕了', '因为地方太大'], a: 1, kind: 'infer' },
      { q: '小动物跑散了，你会怎么做？', opts: ['不管了', '停下来别追，安静等它们回来', '一直追到它们停下'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b101', lv: 'L9', tag: '工具', title: 'A Knife and a Wheel', zh: '刀和轮子',
    emoji: '⚙️', color: '#E0CFF3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「排排顺序」这条线，认读 1 个新词。',
    trap: 'kn / wr / ph 里的第一个字母不发音；读长句时先找主句，再读从句。',
    summary: '《刀和轮子》是「排排顺序」：妈妈和明明在图书馆，围绕刀把一件事读到底。本本词卡：刀。读前先看词卡，读完合上书说一说。',
    retell: '像小讲解员一样，把「现象 → 猜想 → 验证 → 结论」讲清楚。（这一本是「排排顺序」。）',
    think: '说说你排过顺序的一件事（做事、排队、讲故事）：顺序是什么？',
    pre: [
      { art: '🔪', en: 'knife', zh: '刀' },
      { art: '📦', en: 'they', zh: 'they' },
      { art: '📦', en: 'the', zh: 'the' }
    ],
    sight: ['eyes', 'field'],
    newWords: [
      { w: 'knife', zh: '刀' }
    ],
    pages: [
      { art: 'library|mom,ming|knife|·', en: 'The knife is all in a mess. They had been here before.', zh: '刀全都乱了。他们以前来过这里。' },
      { art: 'library|mom,ming|knife|♪', en: 'They want to put them in order. They had talked about it.', zh: '他们想把它们排好顺序。他们说起过这件事。' },
      { art: 'library|mom,ming|knife|👀', en: 'They look at all the things. They looked more than once. They wrote three words on the board: knife, field and wrist.', zh: '他们看看所有的东西。他们看了不止一遍。他们在黑板上写下三个词：刀、田地和手腕。' },
      { art: 'library|mom,ming|knife|?', en: '"What comes first?" asks Ming. A good question is a good start.', zh: '「哪一个排在最前？」明明问。问得好，就是好的开始。' },
      { art: 'library|mom,ming|knife|·', en: 'They put one before another. They did their best at this step.', zh: '他们一个一个排。这一步他们尽力了。' },
      { art: 'library|mom,ming|knife|!', en: 'It does not look right. It was a little disappointing.', zh: '看着还是不对。有点让人失望。' },
      { art: 'library|mom,ming|food|♥', en: 'Ming says, "Say them out loud in order." Two pairs of eyes see more.', zh: '明明说：「按顺序念出来。」两双眼睛看得更多。' },
      { art: 'library|mom,ming|food|·', en: 'They say them out loud and put them in order. This time they went more slowly.', zh: '他们按顺序念出来，再排好。这次他们慢多了。' },
      { art: 'library|mom,ming|knife|★', en: 'Now they are all in order. They were glad they kept looking.', zh: '现在全都排好顺序了。他们庆幸没放弃找。' },
      { art: 'library|mom,ming|knife|?', en: 'Saying the order helps the eyes see it. Now they could see why.', zh: '念出顺序，眼睛才看得出。现在他们明白了为什么。' },
      { art: 'library|mom,ming|knife|?', en: 'Order turns a mess into something clear. It was a good thing to notice.', zh: '顺序，能让乱变清楚。这一点值得留意。' },
      { art: 'library|mom,ming|knife|…', en: 'They can tell the order to someone now. It was a good lesson.', zh: '他们现在能给别人讲顺序了。这是个好教训。' },
      { art: 'library|mom,ming|knife|♥', en: 'They like the clear order. Both of them felt the same way. We say the words again: knife and field.', zh: '他们喜欢清清楚楚的顺序。两个人感觉一样。我们把这两个词再说一遍：刀和田地。' },
      { art: 'library|mom,ming|knife|·', en: 'They will keep them in order. They would come back to this.', zh: '他们会一直保持顺序。他们还会回到这件事上。' }
    ],
    quiz: [
      { q: '在图书馆读的这一本里，有下面哪一样？', opts: ['沙滩', '酸奶', '刀'], a: 2, kind: 'recall' },
      { q: '为什么要念出顺序？', opts: ['因为声音好听', '因为别人在听', '念出来，眼睛才看得出对不对'], a: 2, kind: 'infer' },
      { q: '东西乱了要理清，你会怎么做？', opts: ['先想清楚顺序，边念边排', '随便排一排', '不排了'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b102', lv: 'L9', tag: '提问', title: 'The Scientist and an Answer', zh: '科学家的答案',
    emoji: '🔬', color: '#F6C9E3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「多练一练」这条线，认读 3 个新词。',
    trap: 'kn / wr / ph 里的第一个字母不发音；读长句时先找主句，再读从句。',
    summary: '《科学家的答案》是「多练一练」：爸爸和丽丽在图书馆，围绕回答把一件事读到底。本本词卡：车站、村子、客人。读前先看词卡，读完合上书说一说。',
    retell: '像小讲解员一样，把「现象 → 猜想 → 验证 → 结论」讲清楚。（这一本是「多练一练」。）',
    think: '说说你练习过的一件事：你是怎么一点点进步的？',
    pre: [
      { art: '🚉', en: 'station', zh: '车站' },
      { art: '🏘️', en: 'village', zh: '村子' },
      { art: '🧑', en: 'visitor', zh: '客人' },
      { art: '📦', en: 'they', zh: 'they' },
      { art: '📦', en: 'it', zh: 'it' }
    ],
    sight: ['eyes'],
    newWords: [
      { w: 'station', zh: '车站' },
      { w: 'village', zh: '村子' },
      { w: 'visitor', zh: '客人' }
    ],
    pages: [
      { art: 'library|dad,lili|answer|·', en: 'Dad wants to practice the answer. They had been here before.', zh: '爸爸想练练回答。他们以前来过这里。' },
      { art: 'library|dad,lili|answer|♪', en: 'They want to get better. They had talked about it.', zh: '他们想做得好一些。他们说起过这件事。' },
      { art: 'library|dad,lili|answer|👀', en: 'They look at how it should be done. They looked more than once. They wrote three words on the board: station, village and visitor.', zh: '他们看看应该怎么做。他们看了不止一遍。他们在黑板上写下三个词：车站、村子和客人。' },
      { art: 'library|dad,lili|answer|?', en: '"How do I get better?" asks Dad. A good question is a good start.', zh: '「怎么才能做好？」爸爸问。问得好，就是好的开始。' },
      { art: 'library|dad,lili|answer|·', en: 'They do it again and again. They did their best at this step.', zh: '他们做了一遍又一遍。这一步他们尽力了。' },
      { art: 'library|dad,lili|answer|!', en: 'It is still not easy. It was a little disappointing.', zh: '还是不容易。有点让人失望。' },
      { art: 'library|dad,lili|show|♥', en: 'Lili says, "Go slow and do one small part." Two pairs of eyes see more.', zh: '丽丽说：「慢一点，做一小步。」两双眼睛看得更多。' },
      { art: 'library|dad,lili|show|·', en: 'They do one small part slowly. This time they went more slowly.', zh: '他们慢慢做一小步。这次他们慢多了。' },
      { art: 'library|dad,lili|answer|★', en: 'That small part is easy now. They were glad they kept looking.', zh: '那一小步现在容易了。他们庆幸没放弃找。' },
      { art: 'library|dad,lili|answer|?', en: 'Practicing everything at once is too much. Now they could see why.', zh: '一次全练，太多了。现在他们明白了为什么。' },
      { art: 'library|dad,lili|answer|?', en: 'Small parts add up to something big. It was a good thing to notice.', zh: '一小步一小步，就能攒成大事。这一点值得留意。' },
      { art: 'library|dad,lili|answer|…', en: 'They see that they are getting better. It was a good lesson.', zh: '他们看到自己在进步。这是个好教训。' },
      { art: 'library|dad,lili|answer|♥', en: 'They are proud of the work. Both of them felt the same way. We say the words again: station and village.', zh: '他们为自己的努力感到骄傲。两个人感觉一样。我们把这两个词再说一遍：车站和村子。' },
      { art: 'library|dad,lili|answer|·', en: 'They will practice the next small part. They would come back to this.', zh: '接下来练下一小步。他们还会回到这件事上。' }
    ],
    quiz: [
      { q: '这一本里，爸爸看到了下面哪一样？', opts: ['胳膊', '车站', '蓝色'], a: 1, kind: 'recall' },
      { q: '为什么只练一小步就有用？', opts: ['因为练得快', '因为老师说了', '一小步练好，慢慢就攒成了'], a: 2, kind: 'infer' },
      { q: '一样东西练了很久还不好，你会怎么做？', opts: ['一次全练很多遍', '拆成一小步，慢慢练', '不练了'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b103', lv: 'L9', tag: '参观', title: 'A Quiet Museum', zh: '安静的博物馆',
    emoji: '🏛️', color: '#BFE6DF',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「找路」这条线，认读 1 个新词。',
    trap: 'kn / wr / ph 里的第一个字母不发音；读长句时先找主句，再读从句。',
    summary: '《安静的博物馆》是「找路」：明明和奶奶在街道，围绕博物馆把一件事读到底。本本词卡：博物馆。读前先看词卡，读完合上书说一说。',
    retell: '像小讲解员一样，把「现象 → 猜想 → 验证 → 结论」讲清楚。（这一本是「找路」。）',
    think: '说一次你问路或给别人指路的经历：当时是怎么说的？',
    pre: [
      { art: '🏛️', en: 'museum', zh: '博物馆' },
      { art: '📦', en: 'they', zh: 'they' },
      { art: '📦', en: 'the', zh: 'the' }
    ],
    sight: ['eyes'],
    newWords: [
      { w: 'museum', zh: '博物馆' }
    ],
    pages: [
      { art: 'street|ming,grandma|museum|·', en: 'They do not know where the street is. They had been here before.', zh: '他们不知道街道在哪儿。他们以前来过这里。' },
      { art: 'street|ming,grandma|museum|♪', en: 'They want to find the way. They had talked about it.', zh: '他们想找路。他们说起过这件事。' },
      { art: 'street|ming,grandma|museum|👀', en: 'They look at the museum and the road. They looked more than once. They wrote three words on the board: museum, visitor and station.', zh: '他们看看博物馆和路。他们看了不止一遍。他们在黑板上写下三个词：博物馆、客人和车站。' },
      { art: 'street|ming,grandma|museum|?', en: '"Does the map help?" asks Ming. A good question is a good start.', zh: '「地图有用吗？」明明问。问得好，就是好的开始。' },
      { art: 'street|ming,grandma|museum|·', en: 'They follow the map. They did their best at this step.', zh: '他们照着地图走。这一步他们尽力了。' },
      { art: 'street|ming,grandma|museum|!', en: 'The map is hard to read. It was a little disappointing.', zh: '地图不太看得懂。有点让人失望。' },
      { art: 'street|ming,grandma|garden|♥', en: 'Grandma says, "Ask someone who knows." Two pairs of eyes see more.', zh: '奶奶说：「问问知道的人。」两双眼睛看得更多。' },
      { art: 'street|ming,grandma|garden|·', en: 'They ask a person on the road. This time they went more slowly.', zh: '他们问了路上的一个人。这次他们慢多了。' },
      { art: 'street|ming,grandma|museum|★', en: 'The person shows them the way. They were glad they kept looking.', zh: '那个人给他们指了路。他们庆幸没放弃找。' },
      { art: 'street|ming,grandma|museum|?', en: 'A map works best when we can read it. Now they could see why.', zh: '地图看得懂，才有用。现在他们明白了为什么。' },
      { art: 'street|ming,grandma|museum|?', en: 'People can help where maps cannot. It was a good thing to notice.', zh: '地图做不到的，人可以帮忙。这一点值得留意。' },
      { art: 'street|ming,grandma|museum|…', en: 'They say thank you to the person. It was a good lesson.', zh: '他们向那个人道了谢。这是个好教训。' },
      { art: 'street|ming,grandma|museum|♥', en: 'They are glad to find the way. Both of them felt the same way. We say the words again: museum and visitor.', zh: '找到路，他们很高兴。两个人感觉一样。我们把这两个词再说一遍：博物馆和客人。' },
      { art: 'street|ming,grandma|museum|·', en: 'They will help someone else next time. They would come back to this.', zh: '下次他们也会给别人指路。他们还会回到这件事上。' }
    ],
    quiz: [
      { q: '明明和奶奶的这一本里，出现了下面哪一样？', opts: ['薯片', '地图', '哥哥'], a: 1, kind: 'recall' },
      { q: '地图为什么一开始没帮上忙？', opts: ['他们不太看得懂那张地图', '因为路太远', '因为地图太旧'], a: 0, kind: 'infer' },
      { q: '看不懂地图，你会怎么做？', opts: ['问一个知道路的人', '自己一直猜', '不去了'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b104', lv: 'L9', tag: '方法', title: 'Write It Down', zh: '把它记下来',
    emoji: '✏️', color: '#F2E2A8',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「比一比」这条线，认读 1 个新词。',
    trap: 'kn / wr / ph 里的第一个字母不发音；读长句时先找主句，再读从句。',
    summary: '《把它记下来》是「比一比」：丽丽和爷爷在学校，围绕木板把一件事读到底。本本词卡：电话。读前先看词卡，读完合上书说一说。',
    retell: '像小讲解员一样，把「现象 → 猜想 → 验证 → 结论」讲清楚。（这一本是「比一比」。）',
    think: '找两样很像的东西，用英文说出至少两处不同，说说你是按什么顺序找的。',
    pre: [
      { art: '📱', en: 'phone', zh: '电话' },
      { art: '📦', en: 'they', zh: 'they' },
      { art: '📦', en: 'the', zh: 'the' }
    ],
    sight: ['eyes'],
    newWords: [
      { w: 'phone', zh: '电话' }
    ],
    pages: [
      { art: 'school|lili,grandpa|board|·', en: 'Lili looks at a board and a note. They had been here before.', zh: '丽丽看着木板和纸条。他们以前来过这里。' },
      { art: 'school|lili,grandpa|board|♪', en: 'They want to know how they are different. They had talked about it.', zh: '他们想知道两样有什么不一样。他们说起过这件事。' },
      { art: 'school|lili,grandpa|board|👀', en: 'At first the two look the same. They looked more than once. They wrote three words on the board: village, village and phone.', zh: '乍一看，两样挺像。他们看了不止一遍。他们在黑板上写下三个词：村子、村子和电话。' },
      { art: 'school|lili,grandpa|board|?', en: '"What is not the same?" asks Grandpa. A good question is a good start.', zh: '「哪里不一样？」爷爷问。问得好，就是好的开始。' },
      { art: 'school|lili,grandpa|board|·', en: 'They put them side by side. They did their best at this step.', zh: '他们把两样并排放。这一步他们尽力了。' },
      { art: 'school|lili,grandpa|board|!', en: 'Looking from far away does not help. It was a little disappointing.', zh: '远远地看，还是看不出。有点让人失望。' },
      { art: 'school|lili,grandpa|note|♥', en: 'Grandpa says, "Look at one part at a time." Two pairs of eyes see more.', zh: '爷爷说：「一处一处分开看。」两双眼睛看得更多。' },
      { art: 'school|lili,grandpa|note|·', en: 'They check one part, then another. This time they went more slowly.', zh: '他们先看一处，再看另一处。这次他们慢多了。' },
      { art: 'school|lili,grandpa|board|★', en: 'There! One small part is different. They were glad they kept looking.', zh: '有了！有一处小小的不同。他们庆幸没放弃找。' },
      { art: 'school|lili,grandpa|board|?', en: 'The difference was small, not missing. Now they could see why.', zh: '差别很小，不是没有。现在他们明白了为什么。' },
      { art: 'school|lili,grandpa|board|?', en: 'Same and almost the same are not the same. It was a good thing to notice.', zh: '「一样」和「差不多一样」不是一回事。这一点值得留意。' },
      { art: 'school|lili,grandpa|board|…', en: 'Comparing needs a plan, not just a look. It was a good lesson.', zh: '比一比要有章法，不能光瞄一眼。这是个好教训。' },
      { art: 'school|lili,grandpa|board|♥', en: 'They tell Lili what they found. Both of them felt the same way. We say the words again: village and village.', zh: '他们把自己发现的讲给丽丽听。两个人感觉一样。我们把这两个词再说一遍：村子和村子。' },
      { art: 'school|lili,grandpa|board|·', en: 'Next they will compare the note and the clock. They would come back to this. They made a list of all the small differences.', zh: '接着他们要比一比纸条和钟。他们还会回到这件事上。他们把所有细小的不同都列了下来。' }
    ],
    quiz: [
      { q: '在学校读的这一本里，有下面哪一样？', opts: ['盒子', '链子', '电话'], a: 2, kind: 'recall' },
      { q: '木板和纸条一开始为什么看着一样？', opts: ['只远远看了一眼，没一处一处分开比', '因为它们真的完全相同', '因为光线太暗'], a: 0, kind: 'infer' },
      { q: '要找出像木板和纸条这样很像的两样东西哪里不同，你会怎么做？', opts: ['只挑一个看', '隔很远扫一眼', '并排放好，一处一处分开看'], a: 2, kind: 'transfer' }
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
    think: '挑书里最长的一句英文，先听整句，再分成两段读给家长听。',
    pre: [
      { art: '🦵', en: 'knee', zh: '膝盖' },
      { art: '📦', en: 'they', zh: 'they' },
      { art: '📦', en: 'it', zh: 'it' }
    ],
    sight: ['eyes'],
    newWords: [
      { w: 'knee', zh: '膝盖' }
    ],
    pages: [
      { art: 'table|grandma,mom|knee|·', en: 'Grandma opens a book at home. They had been here before.', zh: '奶奶在家翻开一本书。他们以前来过这里。' },
      { art: 'table|grandma,mom|knee|♪', en: 'Grandma wants to read it out loud. They had talked about it.', zh: '奶奶想把它读出来。他们说起过这件事。' },
      { art: 'table|grandma,mom|knee|👀', en: 'The sentence with the word "knee" is long. They looked more than once. They wrote three words on the board: knee, phone and phone.', zh: '带着「knee」这个词的那一句很长。他们看了不止一遍。他们在黑板上写下三个词：膝盖、电话和电话。' },
      { art: 'table|grandma,mom|knee|?', en: '"Where do I stop for breath?" asks Grandma. A good question is a good start.', zh: '「在哪里换气？」奶奶问。问得好，就是好的开始。' },
      { art: 'table|grandma,mom|knee|·', en: 'Grandma reads it one word at a time. They did their best at this step.', zh: '奶奶一个词一个词地读。这一步他们尽力了。' },
      { art: 'table|grandma,mom|knee|!', en: 'It sounds broken, not like a sentence. It was a little disappointing.', zh: '听着是碎的，不像一句话。有点让人失望。' },
      { art: 'table|grandma,mom|kite|♥', en: 'Mom plays the whole sentence. Two pairs of eyes see more.', zh: '妈妈把整句放了一遍。两双眼睛看得更多。' },
      { art: 'table|grandma,mom|kite|·', en: 'Grandma listens, then reads it in two parts. This time they went more slowly.', zh: '奶奶听完，分两段读。这次他们慢多了。' },
      { art: 'table|grandma,mom|knee|★', en: 'Now it sounds like one sentence. They were glad they kept looking.', zh: '这下听起来像一整句了。他们庆幸没放弃找。' },
      { art: 'table|grandma,mom|knee|?', en: 'The words belong to groups, not to themselves. Now they could see why.', zh: '词是成组的，不是一个一个孤立的。现在他们明白了为什么。' },
      { art: 'table|grandma,mom|knee|?', en: 'Where you pause changes what you hear. It was a good thing to notice.', zh: '停在哪里，会改变听到的意思。这一点值得留意。' },
      { art: 'table|grandma,mom|knee|…', en: 'Reading is closer to speaking than to spelling. It was a good lesson.', zh: '读，更接近说，而不是拼。这是个好教训。' },
      { art: 'table|grandma,mom|knee|♥', en: 'Grandma reads it once more, smiling. Both of them felt the same way. We say the words again: knee and phone.', zh: '奶奶笑着又读了一遍。两个人感觉一样。我们把这两个词再说一遍：膝盖和电话。' },
      { art: 'table|grandma,mom|knee|·', en: 'They try the next sentence about a kite. They would come back to this. Reading out loud became easier after that.', zh: '他们接着试讲风筝的下一句。他们还会回到这件事上。从那以后，读出声就不那么难了。' }
    ],
    quiz: [
      { q: '这一本里，奶奶看到了下面哪一样？', opts: ['螃蟹', '奶酪', '膝盖'], a: 2, kind: 'recall' },
      { q: '奶奶读「knee」那一句时，为什么一个词一个词读听起来是碎的？', opts: ['因为词太难', '因为读得太慢', '句子里的词是成组的，不能逐个蹦'], a: 2, kind: 'infer' },
      { q: '遇到像「knee」那一句这样很长的英文句子，你会怎么读？', opts: ['一个词一个词慢慢拼', '先听整句，再按意思分成两三段读', '只看中文跳过英文'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b106', lv: 'L9', tag: '小知识', title: 'Why Seasons Change', zh: '季节为什么变',
    emoji: '🍂', color: '#FAD3B6',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。这一本走「数一数」这条线，认读 3 个新词。',
    trap: 'kn / wr / ph 里的第一个字母不发音；读长句时先找主句，再读从句。',
    summary: '《季节为什么变》是「数一数」：爷爷和爸爸在家，围绕季节把一件事读到底。本本词卡：行动、空气、泥土。读前先看词卡，读完合上书说一说。',
    retell: '像小讲解员一样，把「现象 → 猜想 → 验证 → 结论」讲清楚。（这一本是「数一数」。）',
    think: '找家里三样能数的东西，用英文数一遍，说说你怎么保证不数重。',
    pre: [
      { art: '📦', en: 'action', zh: '行动' },
      { art: '🌿', en: 'air', zh: '空气' },
      { art: '📦', en: 'earth', zh: '泥土' },
      { art: '📦', en: 'they', zh: 'they' },
      { art: '📦', en: 'the', zh: 'the' }
    ],
    sight: ['eyes'],
    newWords: [
      { w: 'action', zh: '行动' },
      { w: 'air', zh: '空气' },
      { w: 'earth', zh: '泥土' }
    ],
    pages: [
      { art: 'night|grandpa,dad|season|·', en: 'Grandpa sees a lot of things at home. They had been here before.', zh: '爷爷在家看见好多东西。他们以前来过这里。' },
      { art: 'night|grandpa,dad|season|♪', en: 'Grandpa wants to count them all. They had talked about it.', zh: '爷爷想把它们数清楚。他们说起过这件事。' },
      { art: 'night|grandpa,dad|season|👀', en: 'Dad points at the season and then the day. They looked more than once. They wrote three words on the board: action, air and earth.', zh: '爸爸指着季节，再指白天。他们看了不止一遍。他们在黑板上写下三个词：行动、空气和泥土。' },
      { art: 'night|grandpa,dad|season|?', en: '"How many are there?" asks Grandpa. A good question is a good start.', zh: '「一共有几个？」爷爷问。问得好，就是好的开始。' },
      { art: 'night|grandpa,dad|season|·', en: 'Grandpa counts: one, two, three. They did their best at this step.', zh: '爷爷数：一、二、三。这一步他们尽力了。' },
      { art: 'night|grandpa,dad|season|!', en: 'They get a different number each time. It was a little disappointing.', zh: '每次数出来的数都不一样。有点让人失望。' },
      { art: 'night|grandpa,dad|day|♥', en: 'Dad says, "Start from the same end." Two pairs of eyes see more.', zh: '爸爸说：「每次都从同一头开始。」两双眼睛看得更多。' },
      { art: 'night|grandpa,dad|day|·', en: 'They count again, slowly and in order. This time they went more slowly.', zh: '他们按着顺序，慢慢再数。这次他们慢多了。' },
      { art: 'night|grandpa,dad|season|★', en: 'This time both get the same number. They were glad they kept looking.', zh: '这次两个数对上了。他们庆幸没放弃找。' },
      { art: 'night|grandpa,dad|season|?', en: 'They had started from a different place. Now they could see why.', zh: '因为每次起点不一样。现在他们明白了为什么。' },
      { art: 'night|grandpa,dad|season|?', en: 'A fixed order turns guessing into counting. It was a good thing to notice.', zh: '有了固定顺序，猜才变成数。这一点值得留意。' },
      { art: 'night|grandpa,dad|season|…', en: 'Being careful is not the same as being slow. It was a good lesson.', zh: '仔细，和慢不是一回事。这是个好教训。' },
      { art: 'night|grandpa,dad|season|♥', en: 'They write the number down. Both of them felt the same way. We say the words again: action and air.', zh: '他们把数字记了下来。两个人感觉一样。我们把这两个词再说一遍：行动和空气。' },
      { art: 'night|grandpa,dad|season|·', en: 'Next they will count the day and the moon. They would come back to this. They wrote the number where they could see it.', zh: '接下来他们要数白天和月亮。他们还会回到这件事上。他们把数字写在看得见的地方。' }
    ],
    quiz: [
      { q: '爷爷和爸爸的这一本里，出现了下面哪一样？', opts: ['云', '木板', '杯子'], a: 1, kind: 'recall' },
      { q: '爷爷两遍数出来的数为什么不一样？', opts: ['因为东西变多了', '每次从不同的地方开始数', '因为数得太慢'], a: 1, kind: 'infer' },
      { q: '数季节总是数错，你会怎么做？', opts: ['定好从哪头开始，按同一顺序再数', '不数了，猜一个', '随便换个起点重数'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b107', lv: 'L9', tag: '小知识', title: 'How We Measure Rain', zh: '我们怎么量雨',
    emoji: '🌧️', color: '#C8E7F0',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。这一本走「合上书讲一遍」这条线，认读 1 个新词。',
    trap: 'kn / wr / ph 里的第一个字母不发音；读长句时先找主句，再读从句。',
    summary: '《我们怎么量雨》是「合上书讲一遍」：妈妈和明明在家，围绕雨把一件事读到底。本本词卡：头发。读前先看词卡，读完合上书说一说。',
    retell: '像小讲解员一样，把「现象 → 猜想 → 验证 → 结论」讲清楚。（这一本是「合上书讲一遍」。）',
    think: '合上书，用「谁 → 在哪儿 → 出了什么事 → 结果」把雨这一本讲给家长听。',
    pre: [
      { art: '📦', en: 'hair', zh: '头发' },
      { art: '📦', en: 'they', zh: 'they' },
      { art: '📦', en: 'the', zh: 'the' }
    ],
    sight: ['eyes'],
    newWords: [
      { w: 'hair', zh: '头发' }
    ],
    pages: [
      { art: 'night|mom,ming|rain|·', en: 'Mom has just finished a book at home. They had been here before.', zh: '妈妈刚在家读完一本书。他们以前来过这里。' },
      { art: 'night|mom,ming|rain|♪', en: 'Ming wants to hear all about it. They had talked about it.', zh: '明明想听他讲讲。他们说起过这件事。' },
      { art: 'night|mom,ming|rain|👀', en: 'Mom thinks about the rain in the book. They looked more than once. They wrote three words on the board: air, earth and hair.', zh: '妈妈想着书里的雨。他们看了不止一遍。他们在黑板上写下三个词：空气、泥土和头发。' },
      { art: 'night|mom,ming|rain|?', en: '"Where do I start?" asks Mom. A good question is a good start.', zh: '「从哪儿讲起？」妈妈问。问得好，就是好的开始。' },
      { art: 'night|mom,ming|rain|·', en: 'Mom tells the last part first. They did their best at this step.', zh: '妈妈先讲了结尾。这一步他们尽力了。' },
      { art: 'night|mom,ming|rain|!', en: 'Ming cannot follow the story. It was a little disappointing.', zh: '明明听不明白。有点让人失望。' },
      { art: 'night|mom,ming|stem|♥', en: 'Ming says, "Tell me who, where, then what." Two pairs of eyes see more.', zh: '明明说：「先说谁、在哪儿、再说出什么事。」两双眼睛看得更多。' },
      { art: 'night|mom,ming|stem|·', en: 'Mom starts again, in order. This time they went more slowly.', zh: '妈妈按顺序重新讲。这次他们慢多了。' },
      { art: 'night|mom,ming|rain|★', en: 'This time Ming can see the whole thing. They were glad they kept looking.', zh: '这回明明全听明白了。他们庆幸没放弃找。' },
      { art: 'night|mom,ming|rain|?', en: 'A story needs its order to make sense. Now they could see why.', zh: '故事要靠顺序才讲得通。现在他们明白了为什么。' },
      { art: 'night|mom,ming|rain|?', en: 'Remembering is not the same as telling. It was a good thing to notice.', zh: '记住，和讲出来不是一回事。这一点值得留意。' },
      { art: 'night|mom,ming|rain|…', en: 'If you can tell it, you have read it. It was a good lesson.', zh: '讲得出来，才算真的读过。这是个好教训。' },
      { art: 'night|mom,ming|rain|♥', en: 'Mom closes the book and tells it again. Both of them felt the same way. We say the words again: air and earth.', zh: '妈妈合上书，又讲了一遍。两个人感觉一样。我们把这两个词再说一遍：空气和泥土。' },
      { art: 'night|mom,ming|rain|·', en: 'Tomorrow they will read about a stem. They would come back to this. They could still tell it the next morning.', zh: '明天他们要读讲茎的书。他们还会回到这件事上。第二天早上，他们还能讲得出来。' }
    ],
    quiz: [
      { q: '在家读的这一本里，有下面哪一样？', opts: ['爸爸', '农民', '头发'], a: 2, kind: 'recall' },
      { q: '为什么明明第一遍没听明白？', opts: ['先讲了结尾，顺序乱了', '因为讲得太慢', '因为故事太短'], a: 0, kind: 'infer' },
      { q: '要把讲雨的这本读过的书讲给别人听，你会怎么开头？', opts: ['先说谁、在哪儿，再按顺序说出了什么事', '直接从最精彩的那句开始', '先报书名和生词表'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b108', lv: 'L9', tag: '复习', title: 'The Whole Story', zh: '整个故事',
    emoji: '📚', color: '#E8D9B5',
    track: 'review',
    goal: '把本级和前面级别的词再读一遍、串成一个故事。这一本走「记住它」这条线，认读 2 个新词。',
    trap: 'kn / wr / ph 里的第一个字母不发音；读长句时先找主句，再读从句。',
    summary: '《整个故事》是「记住它」：爸爸和丽丽在图书馆，围绕故事把一件事读到底。本本词卡：科学家、忘记。读前先看词卡，读完合上书说一说。',
    retell: '像小讲解员一样，把「现象 → 猜想 → 验证 → 结论」讲清楚。（这一本是「记住它」。）',
    think: '说说你记住一样难记的东西的办法：你是怎么记的？',
    pre: [
      { art: '🧑', en: 'scientist', zh: '科学家' },
      { art: '🏃', en: 'forget', zh: '忘记' },
      { art: '📦', en: 'they', zh: 'they' },
      { art: '📦', en: 'it', zh: 'it' }
    ],
    sight: ['eyes'],
    newWords: [
      { w: 'scientist', zh: '科学家' },
      { w: 'forget', zh: '忘记' }
    ],
    pages: [
      { art: 'library|dad,lili|story|·', en: 'They need to remember a story. They had been here before.', zh: '他们要记住故事。他们以前来过这里。' },
      { art: 'library|dad,lili|story|♪', en: 'They want to remember it well. They had talked about it.', zh: '他们想记得牢。他们说起过这件事。' },
      { art: 'library|dad,lili|story|👀', en: 'They look at it and think. They looked more than once. They wrote three words on the board: action, hair and scientist.', zh: '他们看着它，想了想。他们看了不止一遍。他们在黑板上写下三个词：行动、头发和科学家。' },
      { art: 'library|dad,lili|story|?', en: '"How can I remember this?" asks Dad. A good question is a good start.', zh: '「怎么才能记住？」爸爸问。问得好，就是好的开始。' },
      { art: 'library|dad,lili|story|·', en: 'They say it again and again. They did their best at this step.', zh: '他们一遍一遍地念。这一步他们尽力了。' },
      { art: 'library|dad,lili|story|!', en: 'They still forget it. It was a little disappointing.', zh: '还是忘了。有点让人失望。' },
      { art: 'library|dad,lili|clock|♥', en: 'Lili says, "Make a little song about it.", Two pairs of eyes see more.', zh: '丽丽说：「给它编个小调。」两双眼睛看得更多。' },
      { art: 'library|dad,lili|clock|·', en: 'They make a little song and sing it. This time they went more slowly.', zh: '他们编了个小调，唱出来。这次他们慢多了。' },
      { art: 'library|dad,lili|story|★', en: 'Now they remember it. They were glad they kept looking.', zh: '现在他们记住了。他们庆幸没放弃找。' },
      { art: 'library|dad,lili|story|?', en: 'Songs help the mind hold on. Now they could see why.', zh: '歌，能让脑子记牢。现在他们明白了为什么。' },
      { art: 'library|dad,lili|story|?', en: 'Finding a way to remember is a skill. It was a good thing to notice.', zh: '找到记住的办法，是一种本领。这一点值得留意。' },
      { art: 'library|dad,lili|story|…', en: 'They can use this way again. It was a good lesson.', zh: '这个办法他们还能再用。这是个好教训。' },
      { art: 'library|dad,lili|story|♥', en: 'They are glad they remember it. Both of them felt the same way. We say the words again: action and hair.', zh: '记住了，他们很高兴。两个人感觉一样。我们把这两个词再说一遍：行动和头发。' },
      { art: 'library|dad,lili|story|·', en: 'They will teach this way to someone. They would come back to this.', zh: '他们要把这个办法教给别人。他们还会回到这件事上。' }
    ],
    quiz: [
      { q: '这一本里，爸爸看到了下面哪一样？', opts: ['家人', '王冠', '科学家'], a: 2, kind: 'recall' },
      { q: '为什么编个小调就记住了？', opts: ['因为唱得很快', '歌能帮脑子记牢', '因为别人唱了'], a: 1, kind: 'infer' },
      { q: '总是记不住东西，你会怎么做？', opts: ['一遍一遍死记', '不管了', '想个办法，比如编个小调或画个图'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b109', lv: 'L10', tag: '思考', title: 'A Better Question', zh: '更好的问题',
    emoji: '❓', color: '#F6C6C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「问一问」这条线，认读 1 个新词。',
    trap: '桥梁书按自然段读：一句里先找「谁 + 做什么」，再把修饰部分补进去。',
    summary: '《更好的问题》是「问一问」：明明和奶奶在图书馆，围绕主意把一件事读到底。本本词卡：意识到。读前先看词卡，读完合上书说一说。',
    retell: '不看书写一段 5 句的口头小结，再说说你同不同意。（这一本是「问一问」。）',
    think: '回想一次「问了还是没懂」：把当时的问题改成一个更小的、指着某个词的问题。',
    pre: [
      { art: '🏃', en: 'realize', zh: '意识到' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'they', zh: 'they' }
    ],
    sight: ['eyes', 'scientist'],
    newWords: [
      { w: 'realize', zh: '意识到' }
    ],
    pages: [
      { art: 'library|ming,grandma|idea|·', en: 'Ming is reading the word "idea" in the library. They had been here before.', zh: '明明在图书馆读「idea」这个词。他们以前来过这里。' },
      { art: 'library|ming,grandma|idea|♪', en: 'Ming wants to understand it. They had talked about it.', zh: '明明想把它弄明白。他们说起过这件事。' },
      { art: 'library|ming,grandma|idea|👀', en: 'One sentence does not make sense. They looked more than once. Three words mattered that day: scientist, scientist and realize.', zh: '有一句怎么也读不通。他们看了不止一遍。那天有三个词很要紧：科学家、科学家和意识到。' },
      { art: 'library|ming,grandma|idea|?', en: '"What does this part mean?" asks Ming. A good question is a good start.', zh: '「这一段什么意思？」明明问。问得好，就是好的开始。' },
      { art: 'library|ming,grandma|idea|·', en: 'Grandma answers, but Ming still looks lost. They did their best at this step.', zh: '奶奶答了，明明还是没懂。这一步他们尽力了。' },
      { art: 'library|ming,grandma|idea|!', en: 'The answer was right, but not the right answer. It was a little disappointing.', zh: '答案没错，却不是问的那个。有点让人失望。' },
      { art: 'library|ming,grandma|cap|♥', en: 'Grandma asks, "Which word is the hard one?" Two pairs of eyes see more.', zh: '奶奶反问：「难的是哪个词？」两双眼睛看得更多。' },
      { art: 'library|ming,grandma|cap|·', en: 'Ming points to one word and asks again. This time they went more slowly.', zh: '明明指着一个词，又问了一遍。这次他们慢多了。' },
      { art: 'library|ming,grandma|idea|★', en: 'Now the whole sentence is clear. They were glad they kept looking.', zh: '这下整句都清楚了。他们庆幸没放弃找。' },
      { art: 'library|ming,grandma|idea|?', en: 'The real question had been a smaller one. Now they could see why.', zh: '真正该问的，是个更小的问题。现在他们明白了为什么。' },
      { art: 'library|ming,grandma|idea|?', en: 'A clear question is half of an answer. It was a good thing to notice.', zh: '问得清楚，答案就有了一半。这一点值得留意。' },
      { art: 'library|ming,grandma|idea|…', en: 'Asking again is not the same as not listening. It was a good lesson.', zh: '再问一遍，不等于没在听。这是个好教训。' },
      { art: 'library|ming,grandma|idea|…', en: 'Finding the hard word was the real work. Looking back, it seemed clear.', zh: '找出那个难词，才是真本事。回头看，就清楚了。' },
      { art: 'library|ming,grandma|idea|♥', en: 'Ming says the sentence out loud. It was a good moment. We say the words again: scientist and scientist.', zh: '明明把这句大声念了出来。这是个好时刻。我们把这两个词再说一遍：科学家和科学家。' },
      { art: 'library|ming,grandma|idea|·', en: 'They write down one new question. It was a good day. The smaller question stayed with them.', zh: '他们又写下一个新问题。这是不错的一天。那个更小的问题，他们一直记着。' }
    ],
    quiz: [
      { q: '明明和奶奶的这一本里，出现了下面哪一样？', opts: ['蛋糕', '图书馆', '云'], a: 1, kind: 'recall' },
      { q: '明明第一次为什么没听懂「idea」？', opts: ['因为答案太短', '问题太大，没指向真正卡住的那个词', '因为读得太快'], a: 1, kind: 'infer' },
      { q: '别人把「idea」解释完你还是没懂，你会怎么做？', opts: ['把整段跳过去', '指出具体哪个词不懂，再问一遍', '点点头装作懂了'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b110', lv: 'L10', tag: '观察', title: 'The Small Change', zh: '小小的变化',
    emoji: '🔍', color: '#F9DFB4',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「合上书讲一遍」这条线，认读 3 个新词。',
    trap: '桥梁书按自然段读：一句里先找「谁 + 做什么」，再把修饰部分补进去。',
    summary: '《小小的变化》是「合上书讲一遍」：丽丽和爷爷在图书馆，围绕变化把一件事读到底。本本词卡：建议、队伍、天气。读前先看词卡，读完合上书说一说。',
    retell: '不看书写一段 5 句的口头小结，再说说你同不同意。（这一本是「合上书讲一遍」。）',
    think: '合上书，用「谁 → 在哪儿 → 出了什么事 → 结果」把变化这一本讲给家长听。',
    pre: [
      { art: '🏃', en: 'suggest', zh: '建议' },
      { art: '🧑', en: 'team', zh: '队伍' },
      { art: '🌿', en: 'weather', zh: '天气' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'it', zh: 'it' }
    ],
    sight: ['eyes'],
    newWords: [
      { w: 'suggest', zh: '建议' },
      { w: 'team', zh: '队伍' },
      { w: 'weather', zh: '天气' }
    ],
    pages: [
      { art: 'library|lili,grandpa|change|·', en: 'Lili has just finished a book in the library. They had been here before.', zh: '丽丽刚在图书馆读完一本书。他们以前来过这里。' },
      { art: 'library|lili,grandpa|change|♪', en: 'Grandpa wants to hear all about it. They had talked about it.', zh: '爷爷想听他讲讲。他们说起过这件事。' },
      { art: 'library|lili,grandpa|change|👀', en: 'Lili thinks about the change in the book. They looked more than once. Three words mattered that day: suggest, team and weather.', zh: '丽丽想着书里的变化。他们看了不止一遍。那天有三个词很要紧：建议、队伍和天气。' },
      { art: 'library|lili,grandpa|change|?', en: '"Where do I start?" asks Lili. A good question is a good start.', zh: '「从哪儿讲起？」丽丽问。问得好，就是好的开始。' },
      { art: 'library|lili,grandpa|change|·', en: 'Lili tells the last part first. They did their best at this step.', zh: '丽丽先讲了结尾。这一步他们尽力了。' },
      { art: 'library|lili,grandpa|change|!', en: 'Grandpa cannot follow the story. It was a little disappointing.', zh: '爷爷听不明白。有点让人失望。' },
      { art: 'library|lili,grandpa|plate|♥', en: 'Grandpa says, "Tell me who, where, then what." Two pairs of eyes see more.', zh: '爷爷说：「先说谁、在哪儿、再说出什么事。」两双眼睛看得更多。' },
      { art: 'library|lili,grandpa|plate|·', en: 'Lili starts again, in order. This time they went more slowly.', zh: '丽丽按顺序重新讲。这次他们慢多了。' },
      { art: 'library|lili,grandpa|change|★', en: 'This time Grandpa can see the whole thing. They were glad they kept looking.', zh: '这回爷爷全听明白了。他们庆幸没放弃找。' },
      { art: 'library|lili,grandpa|change|?', en: 'A story needs its order to make sense. Now they could see why.', zh: '故事要靠顺序才讲得通。现在他们明白了为什么。' },
      { art: 'library|lili,grandpa|change|?', en: 'Remembering is not the same as telling. It was a good thing to notice.', zh: '记住，和讲出来不是一回事。这一点值得留意。' },
      { art: 'library|lili,grandpa|change|…', en: 'If you can tell it, you have read it. It was a good lesson.', zh: '讲得出来，才算真的读过。这是个好教训。' },
      { art: 'library|lili,grandpa|change|…', en: 'The order is the shape of the story. Looking back, it seemed clear.', zh: '顺序就是故事的骨架。回头看，就清楚了。' },
      { art: 'library|lili,grandpa|change|♥', en: 'Lili closes the book and tells it again. It was a good moment. We say the words again: suggest and team.', zh: '丽丽合上书，又讲了一遍。这是个好时刻。我们把这两个词再说一遍：建议和队伍。' },
      { art: 'library|lili,grandpa|change|·', en: 'Tomorrow they will read about a plate. It was a good day. They could still tell it the next morning.', zh: '明天他们要读讲盘子的书。这是不错的一天。第二天早上，他们还能讲得出来。' }
    ],
    quiz: [
      { q: '在图书馆读的这一本里，有下面哪一样？', opts: ['爸爸', '队伍', '外套'], a: 1, kind: 'recall' },
      { q: '为什么爷爷第一遍没听明白？', opts: ['因为讲得太慢', '因为故事太短', '先讲了结尾，顺序乱了'], a: 2, kind: 'infer' },
      { q: '要把讲变化的这本读过的书讲给别人听，你会怎么开头？', opts: ['先说谁、在哪儿，再按顺序说出了什么事', '先报书名和生词表', '直接从最精彩的那句开始'], a: 0, kind: 'transfer' }
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
    think: '说说你猜过又查证的一件事：猜对了吗？',
    pre: [
      { art: '📅', en: 'habit', zh: '习惯' },
      { art: '📦', en: 'they', zh: 'they' },
      { art: '📦', en: 'a', zh: 'a' }
    ],
    sight: ['eyes', 'taught'],
    newWords: [
      { w: 'habit', zh: '习惯' }
    ],
    pages: [
      { art: 'library|grandma,mom|habit|·', en: 'They do not know the answer. They had been here before.', zh: '他们不知道答案。他们以前来过这里。' },
      { art: 'library|grandma,mom|habit|♪', en: 'They want to find out about the habit. They had talked about it.', zh: '他们想弄清楚习惯。他们说起过这件事。' },
      { art: 'library|grandma,mom|habit|👀', en: 'They look at the question. They looked more than once. Three words mattered that day: weather, team and habit.', zh: '他们看看这个问题。他们看了不止一遍。那天有三个词很要紧：天气、队伍和习惯。' },
      { art: 'library|grandma,mom|habit|?', en: '"What do you think?" asks Mom. A good question is a good start.', zh: '「你怎么想？」妈妈问。问得好，就是好的开始。' },
      { art: 'library|grandma,mom|habit|·', en: 'Grandma makes a guess. They did their best at this step.', zh: '奶奶猜了一个答案。这一步他们尽力了。' },
      { art: 'library|grandma,mom|habit|!', en: 'The guess is not right. It was a little disappointing.', zh: '猜得不对。有点让人失望。' },
      { art: 'library|grandma,mom|kite|♥', en: 'Mom says, "Guess again and then check." Two pairs of eyes see more.', zh: '妈妈说：「再猜一次，然后查一查。」两双眼睛看得更多。' },
      { art: 'library|grandma,mom|kite|·', en: 'They guess again and then check. This time they went more slowly.', zh: '他们又猜一次，然后查了查。这次他们慢多了。' },
      { art: 'library|grandma,mom|habit|★', en: 'This time the guess is right. They were glad they kept looking.', zh: '这次猜对了。他们庆幸没放弃找。' },
      { art: 'library|grandma,mom|habit|?', en: 'Guessing is how we start to find out. Now they could see why.', zh: '猜，是我们弄清事情的开始。现在他们明白了为什么。' },
      { art: 'library|grandma,mom|habit|?', en: 'Checking turns a guess into knowledge. It was a good thing to notice.', zh: '查一查，猜就变成了知道。这一点值得留意。' },
      { art: 'library|grandma,mom|habit|…', en: 'Wrong guesses taught them something. It was a good lesson.', zh: '猜错的那些，也让他们学到了东西。这是个好教训。' },
      { art: 'library|grandma,mom|habit|…', en: 'They will guess and check again. Looking back, it seemed clear.', zh: '他们还会再猜一猜、查一查。回头看，就清楚了。' },
      { art: 'library|grandma,mom|habit|♥', en: 'They like finding out. It was a good moment. We say the words again: weather and team.', zh: '他们喜欢弄清楚事情。这是个好时刻。我们把这两个词再说一遍：天气和队伍。' },
      { art: 'library|grandma,mom|habit|·', en: 'They have a new question now. It was a good day.', zh: '他们现在有了一个新的问题。这是不错的一天。' }
    ],
    quiz: [
      { q: '这一本里，奶奶看到了下面哪一样？', opts: ['天气', '小鸡', '奶牛'], a: 0, kind: 'recall' },
      { q: '为什么猜了还要查一查？', opts: ['因为猜太慢', '因为答案太难', '查过以后，猜才变成真的知道'], a: 2, kind: 'infer' },
      { q: '不知道答案时，你会怎么做？', opts: ['等着别人告诉', '随便说一个就当答案', '先猜一个，再想办法查证'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b112', lv: 'L10', tag: '发现', title: 'What We Discovered', zh: '我们的发现',
    emoji: '💡', color: '#C6DEF6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「记住它」这条线，认读 3 个新词。',
    trap: '桥梁书按自然段读：一句里先找「谁 + 做什么」，再把修饰部分补进去。',
    summary: '《我们的发现》是「记住它」：爷爷和爸爸在图书馆，围绕计划把一件事读到底。本本词卡：想象、重要、进步。读前先看词卡，读完合上书说一说。',
    retell: '不看书写一段 5 句的口头小结，再说说你同不同意。（这一本是「记住它」。）',
    think: '说说你记住一样难记的东西的办法：你是怎么记的？',
    pre: [
      { art: '🏃', en: 'imagine', zh: '想象' },
      { art: '✨', en: 'important', zh: '重要' },
      { art: '🏃', en: 'improve', zh: '进步' },
      { art: '📦', en: 'they', zh: 'they' },
      { art: '📦', en: 'it', zh: 'it' }
    ],
    sight: ['eyes'],
    newWords: [
      { w: 'imagine', zh: '想象' },
      { w: 'important', zh: '重要' },
      { w: 'improve', zh: '进步' }
    ],
    pages: [
      { art: 'library|grandpa,dad|plan|·', en: 'They need to remember a plan. They had been here before.', zh: '他们要记住计划。他们以前来过这里。' },
      { art: 'library|grandpa,dad|plan|♪', en: 'They want to remember it well. They had talked about it.', zh: '他们想记得牢。他们说起过这件事。' },
      { art: 'library|grandpa,dad|plan|👀', en: 'They look at it and think. They looked more than once. Three words mattered that day: imagine, important and improve.', zh: '他们看着它，想了想。他们看了不止一遍。那天有三个词很要紧：想象、重要和进步。' },
      { art: 'library|grandpa,dad|plan|?', en: '"How can I remember this?" asks Grandpa. A good question is a good start.', zh: '「怎么才能记住？」爷爷问。问得好，就是好的开始。' },
      { art: 'library|grandpa,dad|plan|·', en: 'They say it again and again. They did their best at this step.', zh: '他们一遍一遍地念。这一步他们尽力了。' },
      { art: 'library|grandpa,dad|plan|!', en: 'They still forget it. It was a little disappointing.', zh: '还是忘了。有点让人失望。' },
      { art: 'library|grandpa,dad|pen|♥', en: 'Dad says, "Make a little song about it.", Two pairs of eyes see more.', zh: '爸爸说：「给它编个小调。」两双眼睛看得更多。' },
      { art: 'library|grandpa,dad|pen|·', en: 'They make a little song and sing it. This time they went more slowly.', zh: '他们编了个小调，唱出来。这次他们慢多了。' },
      { art: 'library|grandpa,dad|plan|★', en: 'Now they remember it. They were glad they kept looking.', zh: '现在他们记住了。他们庆幸没放弃找。' },
      { art: 'library|grandpa,dad|plan|?', en: 'Songs help the mind hold on. Now they could see why.', zh: '歌，能让脑子记牢。现在他们明白了为什么。' },
      { art: 'library|grandpa,dad|plan|?', en: 'Finding a way to remember is a skill. It was a good thing to notice.', zh: '找到记住的办法，是一种本领。这一点值得留意。' },
      { art: 'library|grandpa,dad|plan|…', en: 'They can use this way again. It was a good lesson.', zh: '这个办法他们还能再用。这是个好教训。' },
      { art: 'library|grandpa,dad|plan|…', en: 'Remembering is easier with a good way. Looking back, it seemed clear.', zh: '有了好办法，记住就容易了。回头看，就清楚了。' },
      { art: 'library|grandpa,dad|plan|♥', en: 'They are glad they remember it. It was a good moment. We say the words again: imagine and important.', zh: '记住了，他们很高兴。这是个好时刻。我们把这两个词再说一遍：想象和重要。' },
      { art: 'library|grandpa,dad|plan|·', en: 'They will teach this way to someone. It was a good day.', zh: '他们要把这个办法教给别人。这是不错的一天。' }
    ],
    quiz: [
      { q: '爷爷和爸爸的这一本里，出现了下面哪一样？', opts: ['医生', '硬币', '教'], a: 2, kind: 'recall' },
      { q: '为什么编个小调就记住了？', opts: ['歌能帮脑子记牢', '因为别人唱了', '因为唱得很快'], a: 0, kind: 'infer' },
      { q: '总是记不住东西，你会怎么做？', opts: ['一遍一遍死记', '想个办法，比如编个小调或画个图', '不管了'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b113', lv: 'L10', tag: '耐心', title: 'The Patience to Wait', zh: '等待的耐心',
    emoji: '⏳', color: '#E0CFF3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「排排顺序」这条线，认读 3 个新词。',
    trap: '桥梁书按自然段读：一句里先找「谁 + 做什么」，再把修饰部分补进去。',
    summary: '《等待的耐心》是「排排顺序」：妈妈和明明在图书馆，围绕耐心把一件事读到底。本本词卡：耐心、城市、继续。读前先看词卡，读完合上书说一说。',
    retell: '不看书写一段 5 句的口头小结，再说说你同不同意。（这一本是「排排顺序」。）',
    think: '说说你排过顺序的一件事（做事、排队、讲故事）：顺序是什么？',
    pre: [
      { art: '💡', en: 'patience', zh: '耐心' },
      { art: '📍', en: 'city', zh: '城市' },
      { art: '🏃', en: 'continue', zh: '继续' },
      { art: '📦', en: 'they', zh: 'they' },
      { art: '💡', en: 'order', zh: '顺序' }
    ],
    sight: ['eyes'],
    newWords: [
      { w: 'patience', zh: '耐心' },
      { w: 'city', zh: '城市' },
      { w: 'continue', zh: '继续' }
    ],
    pages: [
      { art: 'library|mom,ming|patience|·', en: 'The patience is all in a mess. They had been here before.', zh: '耐心全都乱了。他们以前来过这里。' },
      { art: 'library|mom,ming|patience|♪', en: 'They want to put them in order. They had talked about it.', zh: '他们想把它们排好顺序。他们说起过这件事。' },
      { art: 'library|mom,ming|patience|👀', en: 'They look at all the things. They looked more than once. Three words mattered that day: patience, city and continue.', zh: '他们看看所有的东西。他们看了不止一遍。那天有三个词很要紧：耐心、城市和继续。' },
      { art: 'library|mom,ming|patience|?', en: '"What comes first?" asks Ming. A good question is a good start.', zh: '「哪一个排在最前？」明明问。问得好，就是好的开始。' },
      { art: 'library|mom,ming|patience|·', en: 'They put one before another. They did their best at this step.', zh: '他们一个一个排。这一步他们尽力了。' },
      { art: 'library|mom,ming|patience|!', en: 'It does not look right. It was a little disappointing.', zh: '看着还是不对。有点让人失望。' },
      { art: 'library|mom,ming|photo|♥', en: 'Ming says, "Say them out loud in order." Two pairs of eyes see more.', zh: '明明说：「按顺序念出来。」两双眼睛看得更多。' },
      { art: 'library|mom,ming|photo|·', en: 'They say them out loud and put them in order. This time they went more slowly.', zh: '他们按顺序念出来，再排好。这次他们慢多了。' },
      { art: 'library|mom,ming|patience|★', en: 'Now they are all in order. They were glad they kept looking.', zh: '现在全都排好顺序了。他们庆幸没放弃找。' },
      { art: 'library|mom,ming|patience|?', en: 'Saying the order helps the eyes see it. Now they could see why.', zh: '念出顺序，眼睛才看得出。现在他们明白了为什么。' },
      { art: 'library|mom,ming|patience|?', en: 'Order turns a mess into something clear. It was a good thing to notice.', zh: '顺序，能让乱变清楚。这一点值得留意。' },
      { art: 'library|mom,ming|patience|…', en: 'They can tell the order to someone now. It was a good lesson.', zh: '他们现在能给别人讲顺序了。这是个好教训。' },
      { art: 'library|mom,ming|patience|…', en: 'Things in order are easy to find. Looking back, it seemed clear.', zh: '排好顺序的东西，好找。回头看，就清楚了。' },
      { art: 'library|mom,ming|patience|♥', en: 'They like the clear order. It was a good moment. We say the words again: patience and city.', zh: '他们喜欢清清楚楚的顺序。这是个好时刻。我们把这两个词再说一遍：耐心和城市。' },
      { art: 'library|mom,ming|patience|·', en: 'They will keep them in order. It was a good day.', zh: '他们会一直保持顺序。这是不错的一天。' }
    ],
    quiz: [
      { q: '在图书馆读的这一本里，有下面哪一样？', opts: ['城市', '人群', '鸡蛋'], a: 0, kind: 'recall' },
      { q: '为什么要念出顺序？', opts: ['念出来，眼睛才看得出对不对', '因为别人在听', '因为声音好听'], a: 0, kind: 'infer' },
      { q: '东西乱了要理清，你会怎么做？', opts: ['随便排一排', '先想清楚顺序，边念边排', '不排了'], a: 1, kind: 'transfer' }
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
    think: '说说你练习过的一件事：你是怎么一点点进步的？',
    pre: [
      { art: '🧩', en: 'problem', zh: '问题' },
      { art: '📦', en: 'they', zh: 'they' },
      { art: '📦', en: 'it', zh: 'it' }
    ],
    sight: ['eyes'],
    newWords: [
      { w: 'problem', zh: '问题' }
    ],
    pages: [
      { art: 'library|dad,lili|problem|·', en: 'Dad wants to practice the problem. They had been here before.', zh: '爸爸想练练问题。他们以前来过这里。' },
      { art: 'library|dad,lili|problem|♪', en: 'They want to get better. They had talked about it.', zh: '他们想做得好一些。他们说起过这件事。' },
      { art: 'library|dad,lili|problem|👀', en: 'They look at how it should be done. They looked more than once. Three words mattered that day: city, city and problem.', zh: '他们看看应该怎么做。他们看了不止一遍。那天有三个词很要紧：城市、城市和问题。' },
      { art: 'library|dad,lili|problem|?', en: '"How do I get better?" asks Dad. A good question is a good start.', zh: '「怎么才能做好？」爸爸问。问得好，就是好的开始。' },
      { art: 'library|dad,lili|problem|·', en: 'They do it again and again. They did their best at this step.', zh: '他们做了一遍又一遍。这一步他们尽力了。' },
      { art: 'library|dad,lili|problem|!', en: 'It is still not easy. It was a little disappointing.', zh: '还是不容易。有点让人失望。' },
      { art: 'library|dad,lili|mess|♥', en: 'Lili says, "Go slow and do one small part." Two pairs of eyes see more.', zh: '丽丽说：「慢一点，做一小步。」两双眼睛看得更多。' },
      { art: 'library|dad,lili|mess|·', en: 'They do one small part slowly. This time they went more slowly.', zh: '他们慢慢做一小步。这次他们慢多了。' },
      { art: 'library|dad,lili|problem|★', en: 'That small part is easy now. They were glad they kept looking.', zh: '那一小步现在容易了。他们庆幸没放弃找。' },
      { art: 'library|dad,lili|problem|?', en: 'Practicing everything at once is too much. Now they could see why.', zh: '一次全练，太多了。现在他们明白了为什么。' },
      { art: 'library|dad,lili|problem|?', en: 'Small parts add up to something big. It was a good thing to notice.', zh: '一小步一小步，就能攒成大事。这一点值得留意。' },
      { art: 'library|dad,lili|problem|…', en: 'They see that they are getting better. It was a good lesson.', zh: '他们看到自己在进步。这是个好教训。' },
      { art: 'library|dad,lili|problem|…', en: 'Practice makes the hard part easy. Looking back, it seemed clear.', zh: '练习，能让难的变容易。回头看，就清楚了。' },
      { art: 'library|dad,lili|problem|♥', en: 'They are proud of the work. It was a good moment. We say the words again: city and city.', zh: '他们为自己的努力感到骄傲。这是个好时刻。我们把这两个词再说一遍：城市和城市。' },
      { art: 'library|dad,lili|problem|·', en: 'They will practice the next small part. It was a good day.', zh: '接下来练下一小步。这是不错的一天。' }
    ],
    quiz: [
      { q: '这一本里，爸爸看到了下面哪一样？', opts: ['城市', '狗', '田地'], a: 0, kind: 'recall' },
      { q: '为什么只练一小步就有用？', opts: ['因为练得快', '因为老师说了', '一小步练好，慢慢就攒成了'], a: 2, kind: 'infer' },
      { q: '一样东西练了很久还不好，你会怎么做？', opts: ['一次全练很多遍', '拆成一小步，慢慢练', '不练了'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b115', lv: 'L10', tag: '坚持', title: 'Tomorrow We Begin Again', zh: '明天重新开始',
    emoji: '🌅', color: '#BFE6DF',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「问一问」这条线，认读 3 个新词。',
    trap: '桥梁书按自然段读：一句里先找「谁 + 做什么」，再把修饰部分补进去。',
    summary: '《明天重新开始》是「问一问」：明明和奶奶在图书馆，围绕约定把一件事读到底。本本词卡：约定、星球、保护。读前先看词卡，读完合上书说一说。',
    retell: '不看书写一段 5 句的口头小结，再说说你同不同意。（这一本是「问一问」。）',
    think: '回想一次「问了还是没懂」：把当时的问题改成一个更小的、指着某个词的问题。',
    pre: [
      { art: '🤝', en: 'promise', zh: '约定' },
      { art: '🌿', en: 'planet', zh: '星球' },
      { art: '🏃', en: 'protect', zh: '保护' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'they', zh: 'they' }
    ],
    sight: ['eyes'],
    newWords: [
      { w: 'promise', zh: '约定' },
      { w: 'planet', zh: '星球' },
      { w: 'protect', zh: '保护' }
    ],
    pages: [
      { art: 'library|ming,grandma|promise|·', en: 'Ming is reading the word "promise" in the library. They had been here before.', zh: '明明在图书馆读「promise」这个词。他们以前来过这里。' },
      { art: 'library|ming,grandma|promise|♪', en: 'Ming wants to understand it. They had talked about it.', zh: '明明想把它弄明白。他们说起过这件事。' },
      { art: 'library|ming,grandma|promise|👀', en: 'One sentence does not make sense. They looked more than once. Three words mattered that day: promise, planet and protect.', zh: '有一句怎么也读不通。他们看了不止一遍。那天有三个词很要紧：约定、星球和保护。' },
      { art: 'library|ming,grandma|promise|?', en: '"What does this part mean?" asks Ming. A good question is a good start.', zh: '「这一段什么意思？」明明问。问得好，就是好的开始。' },
      { art: 'library|ming,grandma|promise|·', en: 'Grandma answers, but Ming still looks lost. They did their best at this step.', zh: '奶奶答了，明明还是没懂。这一步他们尽力了。' },
      { art: 'library|ming,grandma|promise|!', en: 'The answer was right, but not the right answer. It was a little disappointing.', zh: '答案没错，却不是问的那个。有点让人失望。' },
      { art: 'library|ming,grandma|map|♥', en: 'Grandma asks, "Which word is the hard one?" Two pairs of eyes see more.', zh: '奶奶反问：「难的是哪个词？」两双眼睛看得更多。' },
      { art: 'library|ming,grandma|map|·', en: 'Ming points to one word and asks again. This time they went more slowly.', zh: '明明指着一个词，又问了一遍。这次他们慢多了。' },
      { art: 'library|ming,grandma|promise|★', en: 'Now the whole sentence is clear. They were glad they kept looking.', zh: '这下整句都清楚了。他们庆幸没放弃找。' },
      { art: 'library|ming,grandma|promise|?', en: 'The real question had been a smaller one. Now they could see why.', zh: '真正该问的，是个更小的问题。现在他们明白了为什么。' },
      { art: 'library|ming,grandma|promise|?', en: 'A clear question is half of an answer. It was a good thing to notice.', zh: '问得清楚，答案就有了一半。这一点值得留意。' },
      { art: 'library|ming,grandma|promise|…', en: 'Asking again is not the same as not listening. It was a good lesson.', zh: '再问一遍，不等于没在听。这是个好教训。' },
      { art: 'library|ming,grandma|promise|…', en: 'Finding the hard word was the real work. Looking back, it seemed clear.', zh: '找出那个难词，才是真本事。回头看，就清楚了。' },
      { art: 'library|ming,grandma|promise|♥', en: 'Ming says the sentence out loud. It was a good moment. We say the words again: promise and planet.', zh: '明明把这句大声念了出来。这是个好时刻。我们把这两个词再说一遍：约定和星球。' },
      { art: 'library|ming,grandma|promise|·', en: 'They write down one new question. It was a good day. The smaller question stayed with them.', zh: '他们又写下一个新问题。这是不错的一天。那个更小的问题，他们一直记着。' }
    ],
    quiz: [
      { q: '明明和奶奶的这一本里，出现了下面哪一样？', opts: ['农场', '图书馆', '游戏'], a: 1, kind: 'recall' },
      { q: '明明第一次为什么没听懂「promise」？', opts: ['问题太大，没指向真正卡住的那个词', '因为答案太短', '因为读得太快'], a: 0, kind: 'infer' },
      { q: '别人把「promise」解释完你还是没懂，你会怎么做？', opts: ['指出具体哪个词不懂，再问一遍', '点点头装作懂了', '把整段跳过去'], a: 0, kind: 'transfer' }
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
    think: '合上书，用「谁 → 在哪儿 → 出了什么事 → 结果」把旅程这一本讲给家长听。',
    pre: [
      { art: '🛤️', en: 'journey', zh: '旅程' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'it', zh: 'it' }
    ],
    sight: ['eyes'],
    newWords: [
      { w: 'journey', zh: '旅程' }
    ],
    pages: [
      { art: 'library|lili,grandpa|journey|·', en: 'Lili has just finished a book in the library. They had been here before.', zh: '丽丽刚在图书馆读完一本书。他们以前来过这里。' },
      { art: 'library|lili,grandpa|journey|♪', en: 'Grandpa wants to hear all about it. They had talked about it.', zh: '爷爷想听他讲讲。他们说起过这件事。' },
      { art: 'library|lili,grandpa|journey|👀', en: 'Lili thinks about the journey in the book. They looked more than once. Three words mattered that day: planet, planet and journey.', zh: '丽丽想着书里的旅程。他们看了不止一遍。那天有三个词很要紧：星球、星球和旅程。' },
      { art: 'library|lili,grandpa|journey|?', en: '"Where do I start?" asks Lili. A good question is a good start.', zh: '「从哪儿讲起？」丽丽问。问得好，就是好的开始。' },
      { art: 'library|lili,grandpa|journey|·', en: 'Lili tells the last part first. They did their best at this step.', zh: '丽丽先讲了结尾。这一步他们尽力了。' },
      { art: 'library|lili,grandpa|journey|!', en: 'Grandpa cannot follow the story. It was a little disappointing.', zh: '爷爷听不明白。有点让人失望。' },
      { art: 'library|lili,grandpa|mess|♥', en: 'Grandpa says, "Tell me who, where, then what." Two pairs of eyes see more.', zh: '爷爷说：「先说谁、在哪儿、再说出什么事。」两双眼睛看得更多。' },
      { art: 'library|lili,grandpa|mess|·', en: 'Lili starts again, in order. This time they went more slowly.', zh: '丽丽按顺序重新讲。这次他们慢多了。' },
      { art: 'library|lili,grandpa|journey|★', en: 'This time Grandpa can see the whole thing. They were glad they kept looking.', zh: '这回爷爷全听明白了。他们庆幸没放弃找。' },
      { art: 'library|lili,grandpa|journey|?', en: 'A story needs its order to make sense. Now they could see why.', zh: '故事要靠顺序才讲得通。现在他们明白了为什么。' },
      { art: 'library|lili,grandpa|journey|?', en: 'Remembering is not the same as telling. It was a good thing to notice.', zh: '记住，和讲出来不是一回事。这一点值得留意。' },
      { art: 'library|lili,grandpa|journey|…', en: 'If you can tell it, you have read it. It was a good lesson.', zh: '讲得出来，才算真的读过。这是个好教训。' },
      { art: 'library|lili,grandpa|journey|…', en: 'The order is the shape of the story. Looking back, it seemed clear.', zh: '顺序就是故事的骨架。回头看，就清楚了。' },
      { art: 'library|lili,grandpa|journey|♥', en: 'Lili closes the book and tells it again. It was a good moment. We say the words again: planet and planet.', zh: '丽丽合上书，又讲了一遍。这是个好时刻。我们把这两个词再说一遍：星球和星球。' },
      { art: 'library|lili,grandpa|journey|·', en: 'Tomorrow they will read about a mess. It was a good day. They could still tell it the next morning.', zh: '明天他们要读讲乱糟糟的书。这是不错的一天。第二天早上，他们还能讲得出来。' }
    ],
    quiz: [
      { q: '在图书馆读的这一本里，有下面哪一样？', opts: ['狐狸', '星球', '草'], a: 1, kind: 'recall' },
      { q: '为什么爷爷第一遍没听明白？', opts: ['先讲了结尾，顺序乱了', '因为讲得太慢', '因为故事太短'], a: 0, kind: 'infer' },
      { q: '要把讲旅程的这本读过的书讲给别人听，你会怎么开头？', opts: ['直接从最精彩的那句开始', '先报书名和生词表', '先说谁、在哪儿，再按顺序说出了什么事'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b117', lv: 'L10', tag: '发音', title: 'Say It: A Whole Sentence', zh: '说一说：整句的节奏',
    emoji: '🗣️', color: '#D9D2F5',
    track: 'drill',
    goal: '把本级难点音听准、说准，并能在整句里读对。这一本走「跟读整句」这条线，认读 2 个新词。',
    trap: '桥梁书按自然段读：一句里先找「谁 + 做什么」，再把修饰部分补进去。',
    summary: '《说一说：整句的节奏》是「跟读整句」：奶奶和妈妈在家，围绕原因把一件事读到底。本本词卡：原因、将来。读前先看词卡，读完合上书说一说。',
    retell: '不看书写一段 5 句的口头小结，再说说你同不同意。（这一本是「跟读整句」。）',
    think: '挑书里最长的一句英文，先听整句，再分成两段读给家长听。',
    pre: [
      { art: '🧩', en: 'reason', zh: '原因' },
      { art: '🔮', en: 'future', zh: '将来' },
      { art: '📦', en: 'it', zh: 'it' },
      { art: '📦', en: 'a', zh: 'a' }
    ],
    sight: ['eyes'],
    newWords: [
      { w: 'reason', zh: '原因' },
      { w: 'future', zh: '将来' }
    ],
    pages: [
      { art: 'table|grandma,mom|reason|·', en: 'Grandma opens a book at home. They had been here before.', zh: '奶奶在家翻开一本书。他们以前来过这里。' },
      { art: 'table|grandma,mom|reason|♪', en: 'Grandma wants to read it out loud. They had talked about it.', zh: '奶奶想把它读出来。他们说起过这件事。' },
      { art: 'table|grandma,mom|reason|👀', en: 'The sentence with the word "reason" is long. They looked more than once. Three words mattered that day: reason, reason and future.', zh: '带着「reason」这个词的那一句很长。他们看了不止一遍。那天有三个词很要紧：原因、原因和将来。' },
      { art: 'table|grandma,mom|reason|?', en: '"Where do I stop for breath?" asks Grandma. A good question is a good start.', zh: '「在哪里换气？」奶奶问。问得好，就是好的开始。' },
      { art: 'table|grandma,mom|reason|·', en: 'Grandma reads it one word at a time. They did their best at this step.', zh: '奶奶一个词一个词地读。这一步他们尽力了。' },
      { art: 'table|grandma,mom|reason|!', en: 'It sounds broken, not like a sentence. It was a little disappointing.', zh: '听着是碎的，不像一句话。有点让人失望。' },
      { art: 'table|grandma,mom|cap|♥', en: 'Mom plays the whole sentence. Two pairs of eyes see more.', zh: '妈妈把整句放了一遍。两双眼睛看得更多。' },
      { art: 'table|grandma,mom|cap|·', en: 'Grandma listens, then reads it in two parts. This time they went more slowly.', zh: '奶奶听完，分两段读。这次他们慢多了。' },
      { art: 'table|grandma,mom|reason|★', en: 'Now it sounds like one sentence. They were glad they kept looking.', zh: '这下听起来像一整句了。他们庆幸没放弃找。' },
      { art: 'table|grandma,mom|reason|?', en: 'The words belong to groups, not to themselves. Now they could see why.', zh: '词是成组的，不是一个一个孤立的。现在他们明白了为什么。' },
      { art: 'table|grandma,mom|reason|?', en: 'Where you pause changes what you hear. It was a good thing to notice.', zh: '停在哪里，会改变听到的意思。这一点值得留意。' },
      { art: 'table|grandma,mom|reason|…', en: 'Reading is closer to speaking than to spelling. It was a good lesson.', zh: '读，更接近说，而不是拼。这是个好教训。' },
      { art: 'table|grandma,mom|reason|…', en: 'The ear found what the eye had missed. Looking back, it seemed clear.', zh: '耳朵找到了眼睛漏掉的东西。回头看，就清楚了。' },
      { art: 'table|grandma,mom|reason|♥', en: 'Grandma reads it once more, smiling. It was a good moment. We say the words again: reason and reason.', zh: '奶奶笑着又读了一遍。这是个好时刻。我们把这两个词再说一遍：原因和原因。' },
      { art: 'table|grandma,mom|reason|·', en: 'They try the next sentence about a cap. It was a good day. Reading out loud became easier after that.', zh: '他们接着试讲鸭舌帽的下一句。这是不错的一天。从那以后，读出声就不那么难了。' }
    ],
    quiz: [
      { q: '这一本里，奶奶看到了下面哪一样？', opts: ['爷爷', '鸭舌帽', '洞'], a: 1, kind: 'recall' },
      { q: '奶奶读「reason」那一句时，为什么一个词一个词读听起来是碎的？', opts: ['句子里的词是成组的，不能逐个蹦', '因为词太难', '因为读得太慢'], a: 0, kind: 'infer' },
      { q: '遇到像「reason」那一句这样很长的英文句子，你会怎么读？', opts: ['只看中文跳过英文', '先听整句，再按意思分成两三段读', '一个词一个词慢慢拼'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b118', lv: 'L10', tag: '小知识', title: 'Why Practice Works', zh: '练习为什么有用',
    emoji: '📈', color: '#FAD3B6',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。这一本走「问一问」这条线，认读 2 个新词。',
    trap: '桥梁书按自然段读：一句里先找「谁 + 做什么」，再把修饰部分补进去。',
    summary: '《练习为什么有用》是「问一问」：爷爷和爸爸在图书馆，围绕回答把一件事读到底。本本词卡：后来、有耐心。读前先看词卡，读完合上书说一说。',
    retell: '不看书写一段 5 句的口头小结，再说说你同不同意。（这一本是「问一问」。）',
    think: '回想一次「问了还是没懂」：把当时的问题改成一个更小的、指着某个词的问题。',
    pre: [
      { art: '⏰', en: 'later', zh: '后来' },
      { art: '✨', en: 'patient', zh: '有耐心' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'they', zh: 'they' }
    ],
    sight: ['eyes'],
    newWords: [
      { w: 'later', zh: '后来' },
      { w: 'patient', zh: '有耐心' }
    ],
    pages: [
      { art: 'library|grandpa,dad|answer|·', en: 'Grandpa is reading the word "answer" in the library. They had been here before.', zh: '爷爷在图书馆读「answer」这个词。他们以前来过这里。' },
      { art: 'library|grandpa,dad|answer|♪', en: 'Grandpa wants to understand it. They had talked about it.', zh: '爷爷想把它弄明白。他们说起过这件事。' },
      { art: 'library|grandpa,dad|answer|👀', en: 'One sentence does not make sense. They looked more than once. Three words mattered that day: later, patient and stranger.', zh: '有一句怎么也读不通。他们看了不止一遍。那天有三个词很要紧：后来、有耐心和陌生人。' },
      { art: 'library|grandpa,dad|answer|?', en: '"What does this part mean?" asks Grandpa. A good question is a good start.', zh: '「这一段什么意思？」爷爷问。问得好，就是好的开始。' },
      { art: 'library|grandpa,dad|answer|·', en: 'Dad answers, but Grandpa still looks lost. They did their best at this step.', zh: '爸爸答了，爷爷还是没懂。这一步他们尽力了。' },
      { art: 'library|grandpa,dad|answer|!', en: 'The answer was right, but not the right answer. It was a little disappointing.', zh: '答案没错，却不是问的那个。有点让人失望。' },
      { art: 'library|grandpa,dad|run|♥', en: 'Dad asks, "Which word is the hard one?" Two pairs of eyes see more.', zh: '爸爸反问：「难的是哪个词？」两双眼睛看得更多。' },
      { art: 'library|grandpa,dad|run|·', en: 'Grandpa points to one word and asks again. This time they went more slowly.', zh: '爷爷指着一个词，又问了一遍。这次他们慢多了。' },
      { art: 'library|grandpa,dad|answer|★', en: 'Now the whole sentence is clear. They were glad they kept looking.', zh: '这下整句都清楚了。他们庆幸没放弃找。' },
      { art: 'library|grandpa,dad|answer|?', en: 'The real question had been a smaller one. Now they could see why.', zh: '真正该问的，是个更小的问题。现在他们明白了为什么。' },
      { art: 'library|grandpa,dad|answer|?', en: 'A clear question is half of an answer. It was a good thing to notice.', zh: '问得清楚，答案就有了一半。这一点值得留意。' },
      { art: 'library|grandpa,dad|answer|…', en: 'Asking again is not the same as not listening. It was a good lesson.', zh: '再问一遍，不等于没在听。这是个好教训。' },
      { art: 'library|grandpa,dad|answer|…', en: 'Finding the hard word was the real work. Looking back, it seemed clear.', zh: '找出那个难词，才是真本事。回头看，就清楚了。' },
      { art: 'library|grandpa,dad|answer|♥', en: 'Grandpa says the sentence out loud. It was a good moment. We say the words again: later and patient.', zh: '爷爷把这句大声念了出来。这是个好时刻。我们把这两个词再说一遍：后来和有耐心。' },
      { art: 'library|grandpa,dad|answer|·', en: 'They write down one new question. It was a good day. The smaller question stayed with them.', zh: '他们又写下一个新问题。这是不错的一天。那个更小的问题，他们一直记着。' }
    ],
    quiz: [
      { q: '爷爷和爸爸的这一本里，出现了下面哪一样？', opts: ['草', '陌生人', '房子'], a: 1, kind: 'recall' },
      { q: '爷爷第一次为什么没听懂「answer」？', opts: ['问题太大，没指向真正卡住的那个词', '因为读得太快', '因为答案太短'], a: 0, kind: 'infer' },
      { q: '别人把「answer」解释完你还是没懂，你会怎么做？', opts: ['把整段跳过去', '指出具体哪个词不懂，再问一遍', '点点头装作懂了'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b119', lv: 'L10', tag: '小知识', title: 'Small Steps, Long Way', zh: '小步子，长路',
    emoji: '🛤️', color: '#C8E7F0',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。这一本走「合上书讲一遍」这条线，认读 1 个新词。',
    trap: '桥梁书按自然段读：一句里先找「谁 + 做什么」，再把修饰部分补进去。',
    summary: '《小步子，长路》是「合上书讲一遍」：妈妈和明明在图书馆，围绕将来把一件事读到底。本本词卡：记忆。读前先看词卡，读完合上书说一说。',
    retell: '不看书写一段 5 句的口头小结，再说说你同不同意。（这一本是「合上书讲一遍」。）',
    think: '合上书，用「谁 → 在哪儿 → 出了什么事 → 结果」把将来这一本讲给家长听。',
    pre: [
      { art: '🧠', en: 'memory', zh: '记忆' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'it', zh: 'it' }
    ],
    sight: ['eyes'],
    newWords: [
      { w: 'memory', zh: '记忆' }
    ],
    pages: [
      { art: 'library|mom,ming|future|·', en: 'Mom has just finished a book in the library. They had been here before.', zh: '妈妈刚在图书馆读完一本书。他们以前来过这里。' },
      { art: 'library|mom,ming|future|♪', en: 'Ming wants to hear all about it. They had talked about it.', zh: '明明想听他讲讲。他们说起过这件事。' },
      { art: 'library|mom,ming|future|👀', en: 'Mom thinks about the future in the book. They looked more than once. Three words mattered that day: stranger, stranger and memory.', zh: '妈妈想着书里的将来。他们看了不止一遍。那天有三个词很要紧：陌生人、陌生人和记忆。' },
      { art: 'library|mom,ming|future|?', en: '"Where do I start?" asks Mom. A good question is a good start.', zh: '「从哪儿讲起？」妈妈问。问得好，就是好的开始。' },
      { art: 'library|mom,ming|future|·', en: 'Mom tells the last part first. They did their best at this step.', zh: '妈妈先讲了结尾。这一步他们尽力了。' },
      { art: 'library|mom,ming|future|!', en: 'Ming cannot follow the story. It was a little disappointing.', zh: '明明听不明白。有点让人失望。' },
      { art: 'library|mom,ming|photo|♥', en: 'Ming says, "Tell me who, where, then what." Two pairs of eyes see more.', zh: '明明说：「先说谁、在哪儿、再说出什么事。」两双眼睛看得更多。' },
      { art: 'library|mom,ming|photo|·', en: 'Mom starts again, in order. This time they went more slowly.', zh: '妈妈按顺序重新讲。这次他们慢多了。' },
      { art: 'library|mom,ming|future|★', en: 'This time Ming can see the whole thing. They were glad they kept looking.', zh: '这回明明全听明白了。他们庆幸没放弃找。' },
      { art: 'library|mom,ming|future|?', en: 'A story needs its order to make sense. Now they could see why.', zh: '故事要靠顺序才讲得通。现在他们明白了为什么。' },
      { art: 'library|mom,ming|future|?', en: 'Remembering is not the same as telling. It was a good thing to notice.', zh: '记住，和讲出来不是一回事。这一点值得留意。' },
      { art: 'library|mom,ming|future|…', en: 'If you can tell it, you have read it. It was a good lesson.', zh: '讲得出来，才算真的读过。这是个好教训。' },
      { art: 'library|mom,ming|future|…', en: 'The order is the shape of the story. Looking back, it seemed clear.', zh: '顺序就是故事的骨架。回头看，就清楚了。' },
      { art: 'library|mom,ming|future|♥', en: 'Mom closes the book and tells it again. It was a good moment. We say the words again: stranger and stranger.', zh: '妈妈合上书，又讲了一遍。这是个好时刻。我们把这两个词再说一遍：陌生人和陌生人。' },
      { art: 'library|mom,ming|future|·', en: 'Tomorrow they will read about a photo. It was a good day. They could still tell it the next morning.', zh: '明天他们要读讲照片的书。这是不错的一天。第二天早上，他们还能讲得出来。' }
    ],
    quiz: [
      { q: '在图书馆读的这一本里，有下面哪一样？', opts: ['洞', '腿', '陌生人'], a: 2, kind: 'recall' },
      { q: '为什么明明第一遍没听明白？', opts: ['因为讲得太慢', '因为故事太短', '先讲了结尾，顺序乱了'], a: 2, kind: 'infer' },
      { q: '要把讲将来的这本读过的书讲给别人听，你会怎么开头？', opts: ['直接从最精彩的那句开始', '先报书名和生词表', '先说谁、在哪儿，再按顺序说出了什么事'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b120', lv: 'L10', tag: '复习', title: 'The Whole Idea', zh: '完整的想法',
    emoji: '🧠', color: '#E8D9B5',
    track: 'review',
    goal: '把本级和前面级别的词再读一遍、串成一个故事。这一本走「猜一猜」这条线，认读 3 个新词。',
    trap: '桥梁书按自然段读：一句里先找「谁 + 做什么」，再把修饰部分补进去。',
    summary: '《完整的想法》是「猜一猜」：爸爸和丽丽在图书馆，围绕主意把一件事读到底。本本词卡：相信、国家、勇气。读前先看词卡，读完合上书说一说。',
    retell: '不看书写一段 5 句的口头小结，再说说你同不同意。（这一本是「猜一猜」。）',
    think: '说说你猜过又查证的一件事：猜对了吗？',
    pre: [
      { art: '🏃', en: 'believe', zh: '相信' },
      { art: '📍', en: 'country', zh: '国家' },
      { art: '🦁', en: 'courage', zh: '勇气' },
      { art: '📦', en: 'they', zh: 'they' },
      { art: '📦', en: 'a', zh: 'a' }
    ],
    sight: ['eyes', 'taught'],
    newWords: [
      { w: 'believe', zh: '相信' },
      { w: 'country', zh: '国家' },
      { w: 'courage', zh: '勇气' }
    ],
    pages: [
      { art: 'library|dad,lili|idea|·', en: 'They do not know the answer. They had been here before.', zh: '他们不知道答案。他们以前来过这里。' },
      { art: 'library|dad,lili|idea|♪', en: 'They want to find out about the idea. They had talked about it.', zh: '他们想弄清楚主意。他们说起过这件事。' },
      { art: 'library|dad,lili|idea|👀', en: 'They look at the question. They looked more than once. Three words mattered that day: believe, country and courage.', zh: '他们看看这个问题。他们看了不止一遍。那天有三个词很要紧：相信、国家和勇气。' },
      { art: 'library|dad,lili|idea|?', en: '"What do you think?" asks Lili. A good question is a good start.', zh: '「你怎么想？」丽丽问。问得好，就是好的开始。' },
      { art: 'library|dad,lili|idea|·', en: 'Dad makes a guess. They did their best at this step.', zh: '爸爸猜了一个答案。这一步他们尽力了。' },
      { art: 'library|dad,lili|idea|!', en: 'The guess is not right. It was a little disappointing.', zh: '猜得不对。有点让人失望。' },
      { art: 'library|dad,lili|patience|♥', en: 'Lili says, "Guess again and then check." Two pairs of eyes see more.', zh: '丽丽说：「再猜一次，然后查一查。」两双眼睛看得更多。' },
      { art: 'library|dad,lili|patience|·', en: 'They guess again and then check. This time they went more slowly.', zh: '他们又猜一次，然后查了查。这次他们慢多了。' },
      { art: 'library|dad,lili|idea|★', en: 'This time the guess is right. They were glad they kept looking.', zh: '这次猜对了。他们庆幸没放弃找。' },
      { art: 'library|dad,lili|idea|?', en: 'Guessing is how we start to find out. Now they could see why.', zh: '猜，是我们弄清事情的开始。现在他们明白了为什么。' },
      { art: 'library|dad,lili|idea|?', en: 'Checking turns a guess into knowledge. It was a good thing to notice.', zh: '查一查，猜就变成了知道。这一点值得留意。' },
      { art: 'library|dad,lili|idea|…', en: 'Wrong guesses taught them something. It was a good lesson.', zh: '猜错的那些，也让他们学到了东西。这是个好教训。' },
      { art: 'library|dad,lili|idea|…', en: 'They will guess and check again. Looking back, it seemed clear.', zh: '他们还会再猜一猜、查一查。回头看，就清楚了。' },
      { art: 'library|dad,lili|idea|♥', en: 'They like finding out. It was a good moment. We say the words again: believe and country.', zh: '他们喜欢弄清楚事情。这是个好时刻。我们把这两个词再说一遍：相信和国家。' },
      { art: 'library|dad,lili|idea|·', en: 'They have a new question now. It was a good day.', zh: '他们现在有了一个新的问题。这是不错的一天。' }
    ],
    quiz: [
      { q: '这一本里，爸爸看到了下面哪一样？', opts: ['风筝', '国家', '手'], a: 1, kind: 'recall' },
      { q: '为什么猜了还要查一查？', opts: ['因为猜太慢', '查过以后，猜才变成真的知道', '因为答案太难'], a: 1, kind: 'infer' },
      { q: '不知道答案时，你会怎么做？', opts: ['等着别人告诉', '随便说一个就当答案', '先猜一个，再想办法查证'], a: 2, kind: 'transfer' }
    ]
  }
];

window.BOOKS = BOOKS;
