/* ============================================================
   小鸟英语乐园 · 读书馆 v4.3（面向中国学生的受控词汇分级阅读）
   2026-11-16：10 站 × 12 本 = 120 本，1260 页 / 360 题
   篇幅 L1 27 → L10 163 词/本（每页 1 句 → 2-3 句）

   为什么做 v4.3：v4.2 的 120 本已是逐本手写、情节与题目绑定，
   但抽样精读发现两处仍不够一流 ——
   ① 十个级别每页都只有 1 句约 4.6 词，总词数只靠页数堆，
      没有「每页词数」梯度（RAZ A→J 是 4→15+ 词/页）；
   ② L9-L10 的抽象主题册写成了格言集：《小小的变化》通篇没说
      改了什么，《每天一个习惯》十五页没发生一件事。
      一流桥梁书讲道理，一定落在一件具体的事上。

   v4.3 的四条铁律（由 _v4_build.py + _v4_check.py 强制）：
   ① 词汇受控：正文每个词要么此前任何一本出现过，要么本本读前页
      预教，要么整体认读骨架词。零例外、零「拼得出但没教过」。
   ② 逐本手写独立故事：120 本各有开头、细节、情绪、结尾；
      L5-L10 共 72 本逐页深化，抽象主题由具体事件承载。
   ③ 篇幅梯度靠每页句数递增（1 → 2 → 2-3），不靠中性补充句灌水；
      L1-L4 起步册保持每页 1 短句（decodable reader 的正确形态）。
   ④ 复现：骨架词全库复用，每级第 12 本为复习册。

   输出：每本 3 题 = 检索（答案从本本正文抽）+ 推理（本本因果）
   + 迁移到生活，另加 think 开放题与分档 retell；中文默认隐藏，
   先读英文、看图猜意思，卡住了再点「看中文」。
   配图 art 是场景码「场景|人物|物件|情绪」，由 read.html 的
   drawScene() 渲染成分镜插画。

   生成：python _v4_build.py && python _v4_check.py
   ============================================================ */
'use strict';

const BOOKS = [
  {
    id: 'b1', lv: 'L1', tag: '穿戴', title: 'My Hat', zh: '我的帽子',
    emoji: '🎩', color: '#F6C6C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 2 个新词（帽子、猫）。',
    trap: '这一级是整体认读：词不用拼，先听整句，再跟着说；别一个字母一个字母念。',
    summary: '《我的帽子》：这是一个完整的小故事。读前先看词卡（帽子、猫）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '指着分镜，用英文说出这一页的东西，再把整本连起来读一遍。',
    think: '说说你丢过的一样东西：最后是在哪里找到的？',
    pre: [
      { art: '🎩', en: 'hat', zh: '帽子' },
      { art: '🐱', en: 'cat', zh: '猫' }
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
      { q: '明明的帽子最后在哪儿？', opts: ['床上', '书包里', '猫身上'], a: 2, kind: 'recall' },
      { q: '明明找到帽子时，心情怎么样？', opts: ['觉得好笑，笑了起来', '很生气', '很难过'], a: 0, kind: 'infer' },
      { q: '东西不见了，你会先做什么？', opts: ['想一想它可能在哪里，再找找', '不管它了', '马上哭一场'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b2', lv: 'L1', tag: '宠物', title: 'My Cat', zh: '我的猫',
    emoji: '🐱', color: '#F9DFB4',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 1 个新词（牛奶）。',
    trap: '这一级是整体认读：词不用拼，先听整句，再跟着说；别一个字母一个字母念。',
    summary: '《我的猫》：这是一个完整的小故事。读前先看词卡（牛奶）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '指着分镜，用英文说出这一页的东西，再把整本连起来读一遍。',
    think: '说说你见过的一只小动物：它喜欢做什么？',
    pre: [
      { art: '🥛', en: 'milk', zh: '牛奶' },
      { art: '🐱', en: 'cat', zh: '猫' },
      { art: '🛏️', en: 'bed', zh: '床' }
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
      { q: '这只猫喜欢喝什么？', opts: ['水', '牛奶', '茶'], a: 1, kind: 'recall' },
      { q: '猫喜欢什么？', opts: ['水', '牛奶', '茶'], a: 1, kind: 'infer' },
      { q: '想知道小动物喜欢什么，你会怎么做？', opts: ['一直追它', '静静看它做什么、吃什么', '不理它'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b3', lv: 'L1', tag: '颜色', title: 'Red and Blue', zh: '红和蓝',
    emoji: '🎨', color: '#CDE7C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 1 个新词（蓝色）。',
    trap: '这一级是整体认读：词不用拼，先听整句，再跟着说；别一个字母一个字母念。',
    summary: '《红和蓝》：这是一个完整的小故事。读前先看词卡（蓝色）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '指着分镜，用英文说出这一页的东西，再把整本连起来读一遍。',
    think: '用英文说出你身边的三种颜色。',
    pre: [
      { art: '🔵', en: 'blue', zh: '蓝色' }
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
      { q: '这一本里，明明说他喜欢哪个颜色？', opts: ['红色', '绿色', '黄色'], a: 0, kind: 'recall' },
      { q: '这一本讲了哪两种颜色？', opts: ['红色和绿色', '红色和蓝色', '蓝色和黄色'], a: 1, kind: 'infer' },
      { q: '看到一样东西的颜色，你会怎么做？', opts: ['用英文说出它的颜色', '只看不说', '跳过去'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b4', lv: 'L1', tag: '吃饭', title: 'I Eat', zh: '我吃东西',
    emoji: '🍚', color: '#C6DEF6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 4 个新词（米饭、热、吃、苹果）。',
    trap: '这一级是整体认读：词不用拼，先听整句，再跟着说；别一个字母一个字母念。',
    summary: '《我吃东西》：这是一个完整的小故事。读前先看词卡（米饭、热、吃、苹果）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '指着分镜，用英文说出这一页的东西，再把整本连起来读一遍。',
    think: '说说你最喜欢吃的一样东西。',
    pre: [
      { art: '🍚', en: 'rice', zh: '米饭' },
      { art: '🔥', en: 'hot', zh: '热' },
      { art: '🏃', en: 'eat', zh: '吃' },
      { art: '🍎', en: 'apple', zh: '苹果' }
    ],
    sight: [],
    newWords: [
      { w: 'rice', zh: '米饭' },
      { w: 'hot', zh: '热' },
      { w: 'eat', zh: '吃' },
      { w: 'apple', zh: '苹果' }
    ],
    pages: [
      { art: 'kitchen|grandpa,dad|rice|·', en: 'I have rice. I like rice.', zh: '我有米饭。我喜欢米饭。' },
      { art: 'kitchen|grandpa,dad|rice|♪', en: 'The rice is hot. It is too hot to eat.', zh: '米饭很烫。烫得没法吃。' },
      { art: 'kitchen|grandpa,dad|rice|👀', en: 'I have an apple too.', zh: '我还有一个苹果。' },
      { art: 'kitchen|grandpa,dad|rice|?', en: 'I eat the apple first.', zh: '我先吃苹果。' },
      { art: 'kitchen|grandpa,dad|rice|·', en: 'Now the rice is good.', zh: '现在米饭不烫了。' },
      { art: 'kitchen|grandpa,dad|rice|!', en: 'I eat and eat. I am happy.', zh: '我吃啊吃。我很开心。' }
    ],
    quiz: [
      { q: '米饭太烫的时候，明明先吃了什么？', opts: ['一个苹果', '一个鸡蛋', '一块面包'], a: 0, kind: 'recall' },
      { q: '明明为什么先吃苹果？', opts: ['米饭太烫，得等它凉一点', '因为他不喜欢米饭', '因为苹果更甜'], a: 0, kind: 'infer' },
      { q: '吃东西时，你会怎么做？', opts: ['一口全吞下去', '慢慢吃，尝尝味道', '不吃了'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b5', lv: 'L1', tag: '上学', title: 'My Bag', zh: '我的书包',
    emoji: '🎒', color: '#E0CFF3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 4 个新词（书包、笔、球、拿）。',
    trap: '这一级是整体认读：词不用拼，先听整句，再跟着说；别一个字母一个字母念。',
    summary: '《我的书包》：这是一个完整的小故事。读前先看词卡（书包、笔、球、拿）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '指着分镜，用英文说出这一页的东西，再把整本连起来读一遍。',
    think: '说说你的书包里有什么。',
    pre: [
      { art: '🎒', en: 'bag', zh: '书包' },
      { art: '🖊️', en: 'pen', zh: '笔' },
      { art: '⚽', en: 'ball', zh: '球' },
      { art: '🏃', en: 'take', zh: '拿' },
      { art: '📖', en: 'book', zh: '书' }
    ],
    sight: [],
    newWords: [
      { w: 'bag', zh: '书包' },
      { w: 'pen', zh: '笔' },
      { w: 'ball', zh: '球' },
      { w: 'take', zh: '拿' }
    ],
    pages: [
      { art: 'home|mom,ming|bag|·', en: 'I have a bag. My bag is big.', zh: '我有一个书包。我的书包很大。' },
      { art: 'home|mom,ming|bag|♪', en: 'I put a pen in my bag.', zh: '我把一支笔放进书包。' },
      { art: 'home|mom,ming|bag|👀', en: 'I put a book in my bag too.', zh: '我还把一本书放进书包。' },
      { art: 'home|mom,ming|bag|?', en: 'I put my ball in it. Now it is too big!', zh: '我把球也放进去。现在它太鼓了！' },
      { art: 'home|mom,ming|bag|·', en: 'I take the ball out.', zh: '我把球拿出来。' },
      { art: 'home|mom,ming|bag|!', en: 'My bag is just right now.', zh: '我的书包现在刚好。' }
    ],
    quiz: [
      { q: '书包太鼓了，明明把什么拿了出来？', opts: ['书', '笔', '球'], a: 2, kind: 'recall' },
      { q: '书包为什么变得太鼓了？', opts: ['因为明明把球也塞了进去', '因为装了太多书', '因为书包本来就小'], a: 0, kind: 'infer' },
      { q: '想找书包里的东西，你会怎么做？', opts: ['把东西全倒出来', '打开书包，一样一样看一看', '不找了'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b6', lv: 'L1', tag: '天气', title: 'The Sun', zh: '太阳',
    emoji: '☀️', color: '#F6C9E3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 5 个新词（太阳、天空、暖、手、树）。',
    trap: '这一级是整体认读：词不用拼，先听整句，再跟着说；别一个字母一个字母念。',
    summary: '《太阳》：这是一个完整的小故事。读前先看词卡（太阳、天空、暖、手、树）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '指着分镜，用英文说出这一页的东西，再把整本连起来读一遍。',
    think: '说说有太阳的时候，你会做什么。',
    pre: [
      { art: '☀️', en: 'sun', zh: '太阳' },
      { art: '🌿', en: 'sky', zh: '天空' },
      { art: '✨', en: 'warm', zh: '暖' },
      { art: '✋', en: 'hand', zh: '手' },
      { art: '🌳', en: 'tree', zh: '树' },
      { art: '🎩', en: 'hat', zh: '帽子' }
    ],
    sight: [],
    newWords: [
      { w: 'sun', zh: '太阳' },
      { w: 'sky', zh: '天空' },
      { w: 'warm', zh: '暖' },
      { w: 'hand', zh: '手' },
      { w: 'tree', zh: '树' }
    ],
    pages: [
      { art: 'night|dad,lili|sun|·', en: 'The sun is in the sky. It is big and hot.', zh: '太阳在天上。它又大又热。' },
      { art: 'night|dad,lili|sun|♪', en: 'The sun is warm on my hand.', zh: '太阳照在手上暖暖的。' },
      { art: 'night|dad,lili|sun|👀', en: 'I put my hat on and sit in the sun.', zh: '我戴上帽子坐在太阳下。' },
      { art: 'night|dad,lili|sun|?', en: 'Then it is too hot!', zh: '后来太热了！' },
      { art: 'night|dad,lili|sun|·', en: 'I go to the tree. The tree is good.', zh: '我走到树边。树下真凉快。' },
      { art: 'night|dad,lili|sun|!', en: 'I like the sun, but I like the tree too.', zh: '我喜欢太阳，可我也喜欢这棵树。' }
    ],
    quiz: [
      { q: '太阳太热的时候，明明去了哪儿？', opts: ['河边', '树下面', '家里'], a: 1, kind: 'recall' },
      { q: '明明后来为什么走到树那边去了？', opts: ['他要回家睡觉', '他要去找帽子', '太阳太热，树下凉快'], a: 2, kind: 'infer' },
      { q: '太阳很晒的时候，你会怎么做？', opts: ['一直站在太阳下', '找阴凉的地方待着', '不管它'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b7', lv: 'L1', tag: '比一比', title: 'Big and Small', zh: '大和小',
    emoji: '🐘', color: '#BFE6DF',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。不引入新词，全部是读过的词。',
    trap: '这一级是整体认读：词不用拼，先听整句，再跟着说；别一个字母一个字母念。',
    summary: '《大和小》：这是一个完整的小故事。读前先看词卡，都是学过的词；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '指着分镜，用英文说出这一页的东西，再把整本连起来读一遍。',
    think: '找两样东西，说说哪个大、哪个小。',
    pre: [
      { art: '⚽', en: 'ball', zh: '球' }
    ],
    sight: [],
    newWords: [

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
      { q: '这两个球有什么不一样？', opts: ['一个红一个蓝', '一个有洞', '一个大一个小'], a: 2, kind: 'recall' },
      { q: '这一本讲了球的什么？', opts: ['大的和小的', '新的和旧的', '红的和蓝的'], a: 0, kind: 'infer' },
      { q: '要比两样东西的大小，你会怎么做？', opts: ['只看一个就说', '把它们放在一起比一比', '随便说一个'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b8', lv: 'L1', tag: '家里', title: 'My Cup', zh: '我的杯子',
    emoji: '🥛', color: '#F2E2A8',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 3 个新词（杯子、喝、满）。',
    trap: '这一级是整体认读：词不用拼，先听整句，再跟着说；别一个字母一个字母念。',
    summary: '《我的杯子》：这是一个完整的小故事。读前先看词卡（杯子、喝、满）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '指着分镜，用英文说出这一页的东西，再把整本连起来读一遍。',
    think: '说说你用什么杯子喝水。',
    pre: [
      { art: '🥛', en: 'cup', zh: '杯子' },
      { art: '🏃', en: 'drink', zh: '喝' },
      { art: '✨', en: 'full', zh: '满' },
      { art: '🥛', en: 'milk', zh: '牛奶' }
    ],
    sight: [],
    newWords: [
      { w: 'cup', zh: '杯子' },
      { w: 'drink', zh: '喝' },
      { w: 'full', zh: '满' }
    ],
    pages: [
      { art: 'home|lili,grandpa|cup|·', en: 'I have a cup. My cup is red.', zh: '我有一个杯子。我的杯子是红的。' },
      { art: 'home|lili,grandpa|cup|♪', en: 'Milk is in my cup.', zh: '杯子里有牛奶。' },
      { art: 'home|lili,grandpa|cup|👀', en: 'I drink the milk. It is good.', zh: '我喝牛奶。很好喝。' },
      { art: 'home|lili,grandpa|cup|?', en: 'Now my cup is not full.', zh: '现在杯子空了。' },
      { art: 'home|lili,grandpa|cup|·', en: 'I want more milk. Mom gives me more.', zh: '我还想喝。妈妈又给我倒了。' },
      { art: 'home|lili,grandpa|cup|!', en: 'My cup is full again!', zh: '我的杯子又满了！' }
    ],
    quiz: [
      { q: '明明杯子里装的是什么？', opts: ['水', '果汁', '牛奶'], a: 2, kind: 'recall' },
      { q: '杯子空了以后，明明怎么样了？', opts: ['把杯子放下了', '去拿了一个新杯子', '请妈妈再给他倒一些'], a: 2, kind: 'infer' },
      { q: '想知道杯子里装了什么，你会怎么做？', opts: ['不看', '打开盖子看一看', '猜一猜就算了'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b9', lv: 'L1', tag: '发音', title: 'Say It: Hat', zh: '说一说：帽子',
    emoji: '🗣️', color: '#D9D2F5',
    track: 'drill',
    goal: '把本级难点音听准、说准，并能在整句里读对。不引入新词，全部是读过的词。',
    trap: '这一级是整体认读：词不用拼，先听整句，再跟着说；别一个字母一个字母念。',
    summary: '《说一说：帽子》：这一本练两个词的音和形。读前先看词卡，都是学过的词；读的时候先看清每个词，再连起来读一遍。',
    retell: '把这一本练的两个词再读一遍，说说它们的音哪里一样、哪里不一样。',
    think: '用英文说出三样你能看见的东西。',
    pre: [
      { art: '🎩', en: 'hat', zh: '帽子' }
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
      { q: '这一本在练哪个词？', opts: ['cat', 'bag', 'hat'], a: 2, kind: 'recall' },
      { q: 'hat 开头是哪个音？', opts: ['t 的音', 'a 的音', 'h 的音'], a: 2, kind: 'infer' },
      { q: '遇到一个新单词，你会怎么做？', opts: ['跳过去', '不敢说', '跟着大声说出来'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b10', lv: 'L1', tag: '认物', title: 'This Is a Book', zh: '这是一本书',
    emoji: '📖', color: '#FAD3B6',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。不引入新词，全部是读过的词。',
    trap: '这一级是整体认读：词不用拼，先听整句，再跟着说；别一个字母一个字母念。',
    summary: '《这是一本书》：这一本从一件小事讲起，说说为什么会这样。读前先看词卡，都是学过的词；读的时候留意先看到什么、为什么会这样、后来怎么弄明白。',
    retell: '合上书，按「先看到什么 → 为什么会这样 → 后来怎么弄明白」讲一遍。',
    think: '说说你读过的一本书里有什么。',
    pre: [
      { art: '📖', en: 'book', zh: '书' },
      { art: '🐱', en: 'cat', zh: '猫' }
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
      { q: '书里有什么？', opts: ['一辆车', '一只猫', '一棵树'], a: 1, kind: 'recall' },
      { q: '这本书里既有猫又有太阳，画的大概是什么时候？', opts: ['下雨天', '白天', '夜里'], a: 1, kind: 'infer' },
      { q: '读书的时候，你会怎么做？', opts: ['不看', '随便翻翻就合上', '一页一页慢慢看'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b11', lv: 'L1', tag: '认物', title: 'Water and Rice', zh: '水和米饭',
    emoji: '💧', color: '#C8E7F0',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。认读 1 个新词（水）。',
    trap: '这一级是整体认读：词不用拼，先听整句，再跟着说；别一个字母一个字母念。',
    summary: '《水和米饭》：这一本从一件小事讲起，说说为什么会这样。读前先看词卡（水）；读的时候留意先看到什么、为什么会这样、后来怎么弄明白。',
    retell: '合上书，按「先看到什么 → 为什么会这样 → 后来怎么弄明白」讲一遍。',
    think: '说说你吃饭时会喝什么、吃什么。',
    pre: [
      { art: '💧', en: 'water', zh: '水' },
      { art: '🍚', en: 'rice', zh: '米饭' },
      { art: '🥛', en: 'cup', zh: '杯子' }
    ],
    sight: ['drink', 'eat'],
    newWords: [
      { w: 'water', zh: '水' }
    ],
    pages: [
      { art: 'beach|mom,ming|water|·', en: 'I see water.', zh: '我看见水。' },
      { art: 'beach|mom,ming|water|♪', en: 'I see rice.', zh: '我看见米饭。' },
      { art: 'beach|mom,ming|water|👀', en: 'Water and rice.', zh: '水和米饭。' },
      { art: 'beach|mom,ming|water|?', en: 'I drink the water.', zh: '我喝水。' },
      { art: 'beach|mom,ming|water|·', en: 'I eat the rice.', zh: '我吃米饭。' },
      { art: 'beach|mom,ming|water|!', en: 'I eat and drink. Then I put my cup down.', zh: '我又吃又喝。然后把杯子放下。' }
    ],
    quiz: [
      { q: '明明先喝了什么？', opts: ['水', '汤', '米饭'], a: 0, kind: 'recall' },
      { q: '明明又喝水又吃饭，说明他当时怎么样？', opts: ['想睡觉', '已经很饱', '又渴又饿'], a: 2, kind: 'infer' },
      { q: '吃饭的时候，你会怎么做？', opts: ['不吃了', '坐好，慢慢吃', '一边跑一边吃'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b12', lv: 'L1', tag: '复习', title: 'All Together', zh: '都在一起',
    emoji: '🌈', color: '#E8D9B5',
    track: 'review',
    goal: '把本级和前面级别的词再读一遍、串成一个故事。不引入新词，全部是读过的词。',
    trap: '这一级是整体认读：词不用拼，先听整句，再跟着说；别一个字母一个字母念。',
    summary: '《都在一起》：这是一个完整的小故事。读前先看词卡，都是学过的词；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '指着分镜，用英文说出这一页的东西，再把整本连起来读一遍。',
    think: '找三样东西，用英文说出它们的名字。',
    pre: [
      { art: '📦', en: 'box', zh: '盒子' },
      { art: '🎩', en: 'hat', zh: '帽子' }
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
      { q: '盒子里有什么？', opts: ['球和盘子', '帽子和杯子', '书和笔'], a: 1, kind: 'recall' },
      { q: '帽子和杯子都放进盒子，盒子会怎么样？', opts: ['装得满满的', '不见了', '变轻了'], a: 0, kind: 'infer' },
      { q: '想记住几样东西，你会怎么做？', opts: ['不记了', '把它们放在一起，一起看', '随便乱放'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b13', lv: 'L2', tag: '农场', title: 'A Pig and a Hen', zh: '小猪和母鸡',
    emoji: '🐷', color: '#F6C6C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 3 个新词（母鸡、胖、害怕）。',
    trap: '短元音要收住韵尾：cap 的 p 是双唇轻轻一闭，不要加「呃」读成「卡普呃」。',
    summary: '《小猪和母鸡》：这是一个完整的小故事。读前先看词卡（母鸡、胖、害怕）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '指着分镜，用英文说出这一页的东西，再把整本连起来读一遍。',
    think: '说说两种小动物：它们长得一样吗？',
    pre: [
      { art: '🐔', en: 'hen', zh: '母鸡' },
      { art: '✨', en: 'fat', zh: '胖' },
      { art: '✨', en: 'afraid', zh: '害怕' },
      { art: '🐷', en: 'pig', zh: '猪' }
    ],
    sight: ['friends'],
    newWords: [
      { w: 'hen', zh: '母鸡' },
      { w: 'fat', zh: '胖' },
      { w: 'afraid', zh: '害怕' }
    ],
    pages: [
      { art: 'farm|ming,grandma|pig|·', en: 'I see a pig. I see a hen too.', zh: '我看见一头猪。还看见一只母鸡。' },
      { art: 'farm|ming,grandma|pig|♪', en: 'The pig is fat. The hen is small.', zh: '猪胖胖的。母鸡小小的。' },
      { art: 'farm|ming,grandma|pig|👀', en: 'The pig runs to the hen.', zh: '猪跑向母鸡。' },
      { art: 'farm|ming,grandma|pig|?', en: 'The hen runs away. She is afraid.', zh: '母鸡跑开了。她害怕。' },
      { art: 'farm|ming,grandma|pig|·', en: 'The pig stops. He sits down.', zh: '猪停下来。他坐下了。' },
      { art: 'farm|ming,grandma|pig|!', en: 'The hen looks at him. She comes back.', zh: '母鸡看看他，走了回来。' },
      { art: 'farm|ming,grandma|pig|♥', en: 'Now they are friends.', zh: '现在他们是朋友了。' }
    ],
    quiz: [
      { q: '母鸡为什么跑开了？', opts: ['她去找吃的', '她害怕猪', '她饿了'], a: 1, kind: 'recall' },
      { q: '猪和母鸡最后怎么了？', opts: ['它们打了一架', '它们各自走了', '它们成了朋友'], a: 2, kind: 'infer' },
      { q: '想和小动物交朋友，你会怎么做？', opts: ['吓它一跳', '追着它跑', '轻轻靠近，对它好'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b14', lv: 'L2', tag: '穿戴', title: 'The Red Cap', zh: '红帽子',
    emoji: '🧢', color: '#F9DFB4',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 3 个新词（鸭舌帽、穿、头）。',
    trap: '短元音要收住韵尾：cap 的 p 是双唇轻轻一闭，不要加「呃」读成「卡普呃」。',
    summary: '《红帽子》：这是一个完整的小故事。读前先看词卡（鸭舌帽、穿、头）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '指着分镜，用英文说出这一页的东西，再把整本连起来读一遍。',
    think: '说说你的一顶帽子或一样穿戴。',
    pre: [
      { art: '🧢', en: 'cap', zh: '鸭舌帽' },
      { art: '🏃', en: 'wear', zh: '穿' },
      { art: '✋', en: 'head', zh: '头' }
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
      { q: '明明的帽子是什么颜色的？', opts: ['蓝色', '红色', '黄色'], a: 1, kind: 'recall' },
      { q: '帽子不见了，明明是怎么做的？', opts: ['又去买了一顶', '不要了', '到处找，最后找到了'], a: 2, kind: 'infer' },
      { q: '东西不见了，你会怎么做？', opts: ['马上哭', '不要了', '想一想可能在哪儿，再去找'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b15', lv: 'L2', tag: '天气', title: 'Mud and Fog', zh: '泥和雾',
    emoji: '🌫️', color: '#CDE7C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 7 个新词（干、雾、路、湿、泥、腿）。',
    trap: '短元音要收住韵尾：cap 的 p 是双唇轻轻一闭，不要加「呃」读成「卡普呃」。',
    summary: '《泥和雾》：这是一个完整的小故事。读前先看词卡（干、雾、路、湿、泥、腿）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '指着分镜，用英文说出这一页的东西，再把整本连起来读一遍。',
    think: '说说一个有雾或下雨的日子。',
    pre: [
      { art: '✨', en: 'dry', zh: '干' },
      { art: '🌫️', en: 'fog', zh: '雾' },
      { art: '🛣️', en: 'road', zh: '路' },
      { art: '✨', en: 'wet', zh: '湿' },
      { art: '🟤', en: 'mud', zh: '泥' },
      { art: '✋', en: 'leg', zh: '腿' },
      { art: '🏃', en: 'clean', zh: '打扫' },
      { art: '🏠', en: 'home', zh: '家' },
      { art: '💧', en: 'water', zh: '水' }
    ],
    sight: ['water'],
    newWords: [
      { w: 'dry', zh: '干' },
      { w: 'fog', zh: '雾' },
      { w: 'road', zh: '路' },
      { w: 'wet', zh: '湿' },
      { w: 'mud', zh: '泥' },
      { w: 'leg', zh: '腿' },
      { w: 'clean', zh: '打扫' }
    ],
    pages: [
      { art: 'farm|grandma,mom|mud|·', en: 'The day is not dry. There is fog.', zh: '今天不干爽。有雾。' },
      { art: 'farm|grandma,mom|mud|♪', en: 'The road is wet. I see mud.', zh: '路上湿湿的。我看见泥。' },
      { art: 'farm|grandma,mom|mud|👀', en: 'My leg is in the mud!', zh: '我的腿踩进泥里了！' },
      { art: 'farm|grandma,mom|mud|?', en: 'I am not happy. The mud is cold.', zh: '我不高兴。泥是凉的。' },
      { art: 'farm|grandma,mom|mud|·', en: 'I go home and put water on my leg.', zh: '我回家用水冲腿。' },
      { art: 'farm|grandma,mom|mud|!', en: 'Now my leg is clean.', zh: '现在腿干净了。' },
      { art: 'farm|grandma,mom|mud|♥', en: 'I wait for a dry day.', zh: '我等一个干爽的日子。' }
    ],
    quiz: [
      { q: '明明的腿怎么了？', opts: ['踩进泥里了', '被雨淋湿了', '摔破了'], a: 0, kind: 'recall' },
      { q: '为什么路上有泥？', opts: ['因为太阳太大', '因为又湿又有雾', '因为太干了'], a: 1, kind: 'infer' },
      { q: '路又湿又滑，你会怎么做？', opts: ['不管它', '慢慢走，小心一点', '拔腿就跑'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b16', lv: 'L2', tag: '观察', title: 'My Little Bug', zh: '我的小虫',
    emoji: '🐛', color: '#C6DEF6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 2 个新词（小虫、石头）。',
    trap: '短元音要收住韵尾：cap 的 p 是双唇轻轻一闭，不要加「呃」读成「卡普呃」。',
    summary: '《我的小虫》：这是一个完整的小故事。读前先看词卡（小虫、石头）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '指着分镜，用英文说出这一页的东西，再把整本连起来读一遍。',
    think: '说说你见过的一只小虫：它当时在做什么？',
    pre: [
      { art: '🐛', en: 'bug', zh: '小虫' },
      { art: '🌿', en: 'rock', zh: '石头' },
      { art: '✋', en: 'hand', zh: '手' }
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
      { q: '小虫一开始在哪儿？', opts: ['石头上', '叶子上', '明明的手上'], a: 0, kind: 'recall' },
      { q: '小虫跳到了哪里？', opts: ['我的手上', '树叶上', '水里'], a: 0, kind: 'infer' },
      { q: '看到一只小虫，你会怎么做？', opts: ['轻轻看着它，别吓它', '踩它一脚', '伸手去抓它'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b17', lv: 'L2', tag: '厨房', title: 'A Big Pot', zh: '一口大锅',
    emoji: '🍲', color: '#E0CFF3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 3 个新词（锅、厨房、盖子）。',
    trap: '短元音要收住韵尾：cap 的 p 是双唇轻轻一闭，不要加「呃」读成「卡普呃」。',
    summary: '《一口大锅》：这是一个完整的小故事。读前先看词卡（锅、厨房、盖子）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '指着分镜，用英文说出这一页的东西，再把整本连起来读一遍。',
    think: '说说你家厨房里的一样东西。',
    pre: [
      { art: '🍲', en: 'pot', zh: '锅' },
      { art: '🍳', en: 'kitchen', zh: '厨房' },
      { art: '📦', en: 'lid', zh: '盖子' },
      { art: '✋', en: 'hand', zh: '手' }
    ],
    sight: [],
    newWords: [
      { w: 'pot', zh: '锅' },
      { w: 'kitchen', zh: '厨房' },
      { w: 'lid', zh: '盖子' }
    ],
    pages: [
      { art: 'kitchen|mom,ming|pot|·', en: 'I see a big pot. It is in the kitchen.', zh: '我看见一个大锅。它在厨房里。' },
      { art: 'kitchen|mom,ming|pot|♪', en: 'The pot is hot. A lid is on it.', zh: '锅很烫。上面盖着盖子。' },
      { art: 'kitchen|mom,ming|pot|👀', en: 'I want to look in the pot.', zh: '我想看看锅里。' },
      { art: 'kitchen|mom,ming|pot|?', en: 'I put my hand on the lid. It is hot!', zh: '我把手放在盖子上。好烫！' },
      { art: 'kitchen|mom,ming|pot|·', en: 'I do not put my hand there again.', zh: '我不再把手放上去了。' },
      { art: 'kitchen|mom,ming|pot|!', en: 'Mom comes in. She looks in the pot.', zh: '妈妈进来。她看了看锅里。' },
      { art: 'kitchen|mom,ming|pot|♥', en: 'The pot is for all of us.', zh: '这个锅是全家人用的。' }
    ],
    quiz: [
      { q: '明明的手为什么缩了回来？', opts: ['锅太高了', '盖子很烫', '妈妈不让他碰'], a: 1, kind: 'recall' },
      { q: '明明为什么不再把手放到盖子上了？', opts: ['锅太高了够不着', '妈妈不让他碰', '盖子很烫，会烫到手'], a: 2, kind: 'infer' },
      { q: '锅很烫的时候，你会怎么做？', opts: ['伸手摸一摸', '不管它', '离远一点，别碰它'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b18', lv: 'L2', tag: '出门', title: 'The Bus Is Here', zh: '公交车来了',
    emoji: '🚌', color: '#F6C9E3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 1 个新词（公交车）。',
    trap: '短元音要收住韵尾：cap 的 p 是双唇轻轻一闭，不要加「呃」读成「卡普呃」。',
    summary: '《公交车来了》：这是一个完整的小故事。读前先看词卡（公交车）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '指着分镜，用英文说出这一页的东西，再把整本连起来读一遍。',
    think: '说说你坐过的一种车。',
    pre: [
      { art: '🚌', en: 'bus', zh: '公交车' }
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
      { q: '明明上了什么？', opts: ['火车', '船', '公交车'], a: 2, kind: 'recall' },
      { q: '我是怎么去的？', opts: ['坐公交车', '走路', '骑自行车'], a: 0, kind: 'infer' },
      { q: '等公交车的时候，你会怎么做？', opts: ['不等了', '跑到路中间去', '站在安全的地方等它来'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b19', lv: 'L2', tag: '找路', title: 'A Map for Ming', zh: '明明的地图',
    emoji: '🗺️', color: '#BFE6DF',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 3 个新词（地图、小山、用）。',
    trap: '短元音要收住韵尾：cap 的 p 是双唇轻轻一闭，不要加「呃」读成「卡普呃」。',
    summary: '《明明的地图》：这是一个完整的小故事。读前先看词卡（地图、小山、用）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '指着分镜，用英文说出这一页的东西，再把整本连起来读一遍。',
    think: '说说地图能帮你做什么。',
    pre: [
      { art: '🗺️', en: 'map', zh: '地图' },
      { art: '🌿', en: 'hill', zh: '小山' },
      { art: '🏃', en: 'use', zh: '用' }
    ],
    sight: [],
    newWords: [
      { w: 'map', zh: '地图' },
      { w: 'hill', zh: '小山' },
      { w: 'use', zh: '用' }
    ],
    pages: [
      { art: 'street|ming,grandma|map|·', en: 'Ming has a map.', zh: '明明有一张地图。' },
      { art: 'street|ming,grandma|map|♪', en: 'The map is for Ming.', zh: '地图是给明明的。' },
      { art: 'street|ming,grandma|map|👀', en: 'What is on the map?', zh: '地图上有什么？' },
      { art: 'street|ming,grandma|map|?', en: 'A hill is on the map.', zh: '地图上有一座小山。' },
      { art: 'street|ming,grandma|map|·', en: 'Ming looks at the map.', zh: '明明看着地图。' },
      { art: 'street|ming,grandma|map|!', en: 'Ming finds the way.', zh: '明明找到了路。' },
      { art: 'street|ming,grandma|map|♥', en: 'Ming takes the map with him. He will use it again.', zh: '这张地图帮了大忙！' }
    ],
    quiz: [
      { q: '地图上画着什么？', opts: ['一条河', '一座小山', '一个公园'], a: 1, kind: 'recall' },
      { q: '明明看地图，是为了什么？', opts: ['为了画一座小山', '为了学写字', '为了找到路'], a: 2, kind: 'infer' },
      { q: '找不到路的时候，你会怎么做？', opts: ['看看地图，找一找', '随便乱走', '不走了'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b20', lv: 'L2', tag: '早餐', title: 'Jam on a Bun', zh: '面包上的果酱',
    emoji: '🍞', color: '#F2E2A8',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 2 个新词（小面包、果酱）。',
    trap: '短元音要收住韵尾：cap 的 p 是双唇轻轻一闭，不要加「呃」读成「卡普呃」。',
    summary: '《面包上的果酱》：这是一个完整的小故事。读前先看词卡（小面包、果酱）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '指着分镜，用英文说出这一页的东西，再把整本连起来读一遍。',
    think: '说说你最喜欢的一种吃的。',
    pre: [
      { art: '🍞', en: 'bun', zh: '小面包' },
      { art: '🍯', en: 'jam', zh: '果酱' },
      { art: '✋', en: 'hand', zh: '手' },
      { art: '💧', en: 'water', zh: '水' }
    ],
    sight: ['clean', 'eat', 'water'],
    newWords: [
      { w: 'bun', zh: '小面包' },
      { w: 'jam', zh: '果酱' }
    ],
    pages: [
      { art: 'kitchen|lili,grandpa|jam|·', en: 'I see a bun. I put jam on the bun.', zh: '我看见一个面包。我把果酱抹上去。' },
      { art: 'kitchen|lili,grandpa|jam|♪', en: 'The jam is good. I eat the bun.', zh: '果酱很好吃。我吃面包。' },
      { art: 'kitchen|lili,grandpa|jam|👀', en: 'Now jam is on my hand!', zh: '现在果酱弄到手上了！' },
      { art: 'kitchen|lili,grandpa|jam|?', en: 'I do not like that. My hand is red.', zh: '我不喜欢这样。手变红了。' },
      { art: 'kitchen|lili,grandpa|jam|·', en: 'I put my hand in water.', zh: '我把手放进水里。' },
      { art: 'kitchen|lili,grandpa|jam|!', en: 'Now my hand is clean.', zh: '现在手干净了。' },
      { art: 'kitchen|lili,grandpa|jam|♥', en: 'I like jam on a bun.', zh: '我喜欢面包上的果酱。' }
    ],
    quiz: [
      { q: '明明的手怎么了？', opts: ['被水弄湿了', '沾上了果酱', '弄上了泥'], a: 1, kind: 'recall' },
      { q: '我在面包上放了什么？', opts: ['果酱', '奶酪', '黄油'], a: 0, kind: 'infer' },
      { q: '自己做吃的，你会怎么做？', opts: ['乱放一通', '先看看有什么，放一点尝尝', '不做了'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b21', lv: 'L2', tag: '发音', title: 'Say It: Pen, Pin', zh: '说一说：pen pin',
    emoji: '🗣️', color: '#D9D2F5',
    track: 'drill',
    goal: '把本级难点音听准、说准，并能在整句里读对。认读 1 个新词（别针）。',
    trap: '短元音要收住韵尾：cap 的 p 是双唇轻轻一闭，不要加「呃」读成「卡普呃」。',
    summary: '《说一说：pen pin》：这一本练两个词的音和形。读前先看词卡（别针）；读的时候先看清每个词，再连起来读一遍。',
    retell: '把这一本练的两个词再读一遍，说说它们的音哪里一样、哪里不一样。',
    think: '找两个听起来很像的词，读一读、比一比。',
    pre: [
      { art: '📦', en: 'pin', zh: '别针' },
      { art: '🖊️', en: 'pen', zh: '笔' }
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
      { q: '这一本在比哪两个词？', opts: ['pin 和 pig', 'pen 和 pin', 'pen 和 pan'], a: 1, kind: 'recall' },
      { q: 'pen 和 pin 差在哪个音？', opts: ['中间的 e 和 i', '结尾的 n', '开头的 p'], a: 0, kind: 'infer' },
      { q: '两个单词长得很像，你会怎么分清？', opts: ['随便读一个', '一个一个慢慢读，听清哪里不同', '不读了'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b22', lv: 'L2', tag: '小知识', title: 'A Nut for the Ant', zh: '给蚂蚁的坚果',
    emoji: '🐜', color: '#FAD3B6',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。认读 2 个新词（蚂蚁、坚果）。',
    trap: '短元音要收住韵尾：cap 的 p 是双唇轻轻一闭，不要加「呃」读成「卡普呃」。',
    summary: '《给蚂蚁的坚果》：这一本从一件小事讲起，说说为什么会这样。读前先看词卡（蚂蚁、坚果）；读的时候留意先看到什么、为什么会这样、后来怎么弄明白。',
    retell: '合上书，按「先看到什么 → 为什么会这样 → 后来怎么弄明白」讲一遍。',
    think: '说说小蚂蚁搬东西的样子。',
    pre: [
      { art: '🐜', en: 'ant', zh: '蚂蚁' },
      { art: '🌰', en: 'nut', zh: '坚果' }
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
      { q: '蚂蚁找到了什么？', opts: ['一块面包', '一个苹果', '一颗坚果'], a: 2, kind: 'recall' },
      { q: '这颗坚果对蚂蚁来说怎么样？', opts: ['很大，搬起来不容易', '小得看不见', '一点也不好吃'], a: 0, kind: 'infer' },
      { q: '东西很重、很难搬，你会怎么做？', opts: ['乱扔', '直接放弃', '一点一点搬，或者找人帮忙'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b23', lv: 'L2', tag: '小知识', title: 'Wet and Dry', zh: '湿和干',
    emoji: '💧', color: '#C8E7F0',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。不引入新词，全部是读过的词。',
    trap: '短元音要收住韵尾：cap 的 p 是双唇轻轻一闭，不要加「呃」读成「卡普呃」。',
    summary: '《湿和干》：这一本从一件小事讲起，说说为什么会这样。读前先看词卡，都是学过的词；读的时候留意先看到什么、为什么会这样、后来怎么弄明白。',
    retell: '合上书，按「先看到什么 → 为什么会这样 → 后来怎么弄明白」讲一遍。',
    think: '说说一样湿了又变干的东西。',
    pre: [
      { art: '🍲', en: 'pot', zh: '锅' },
      { art: '☀️', en: 'sun', zh: '太阳' }
    ],
    sight: ['dry'],
    newWords: [

    ],
    pages: [
      { art: 'kitchen|mom,ming|pot|·', en: 'The pot is wet.', zh: '锅是湿的。' },
      { art: 'kitchen|mom,ming|pot|♪', en: 'I want it dry.', zh: '我想把它弄干。' },
      { art: 'kitchen|mom,ming|pot|👀', en: 'I put it out in the sun.', zh: '我把它放到外面的太阳下。' },
      { art: 'kitchen|mom,ming|pot|?', en: 'The sun is hot.', zh: '太阳很热。' },
      { art: 'kitchen|mom,ming|pot|·', en: 'The pot is dry now!', zh: '锅现在干了！' },
      { art: 'kitchen|mom,ming|pot|!', en: 'Wet and dry.', zh: '湿的和干的。' },
      { art: 'kitchen|mom,ming|pot|♥', en: 'I like a dry pot.', zh: '我喜欢干干的锅。' }
    ],
    quiz: [
      { q: '明明把湿锅放在哪儿了？', opts: ['水里', '桌子上', '太阳下面'], a: 2, kind: 'recall' },
      { q: '锅是怎么变干的？', opts: ['用水冲', '放到太阳下晒干', '放进柜子'], a: 1, kind: 'infer' },
      { q: '东西湿了，你会怎么做？', opts: ['不管它', '放到有太阳或通风的地方晾干', '塞进柜子里'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b24', lv: 'L2', tag: '复习', title: 'The Shop on the Hill', zh: '山上的小店',
    emoji: '🏪', color: '#E8D9B5',
    track: 'review',
    goal: '把本级和前面级别的词再读一遍、串成一个故事。认读 1 个新词（小店）。',
    trap: '短元音要收住韵尾：cap 的 p 是双唇轻轻一闭，不要加「呃」读成「卡普呃」。',
    summary: '《山上的小店》：这是一个完整的小故事。读前先看词卡（小店）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '指着分镜，用英文说出这一页的东西，再把整本连起来读一遍。',
    think: '说说你去过的一家小店：它卖什么？',
    pre: [
      { art: '🏪', en: 'shop', zh: '小店' },
      { art: '🌿', en: 'hill', zh: '小山' },
      { art: '🍞', en: 'bun', zh: '小面包' }
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
      { q: '明明在小店里买了什么？', opts: ['面包和果酱', '牛奶和鸡蛋', '鱼和薯条'], a: 0, kind: 'recall' },
      { q: '明明为什么要爬上山坡？', opts: ['他想看风景', '小店在山上，他要买东西', '他家在山上'], a: 1, kind: 'infer' },
      { q: '去买东西，你会怎么做？', opts: ['先想好要什么，再去看', '随便乱拿', '不看就走'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b25', lv: 'L3', tag: '海边', title: 'The Big Ship', zh: '大轮船',
    emoji: '🚢', color: '#F6C6C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 4 个新词（轮船、沙滩、风、强壮）。',
    trap: 'sh 把嘴唇撅圆、th 把舌尖轻轻放在上下门牙中间；ck 只发一个 k，别读两遍。',
    summary: '《大轮船》：这是一个完整的小故事。读前先看词卡（轮船、沙滩、风、强壮）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，按「开头 → 后来 → 最后」把这件事讲一遍。',
    think: '说说你在水边玩过的一次：风或水帮了什么忙？',
    pre: [
      { art: '🚢', en: 'ship', zh: '轮船' },
      { art: '🏖️', en: 'beach', zh: '沙滩' },
      { art: '🌿', en: 'wind', zh: '风' },
      { art: '✨', en: 'strong', zh: '强壮' },
      { art: '💧', en: 'water', zh: '水' }
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
      { q: '小船被风吹走了，奶奶让明明怎么做？', opts: ['等风转过来', '再买一只', '下水去追'], a: 0, kind: 'recall' },
      { q: '船是怎么回来的？', opts: ['它自己开回来的', '风转了，把它带了回来', '明明游过去拿的'], a: 1, kind: 'infer' },
      { q: '东西被风吹跑了，你会怎么做？', opts: ['等风向变了，别硬追', '再买一个', '一直追着风跑'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b26', lv: 'L3', tag: '趣事', title: 'A Duck in the Shop', zh: '店里的一只鸭子',
    emoji: '🦆', color: '#F9DFB4',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 1 个新词（奶酪）。',
    trap: 'sh 把嘴唇撅圆、th 把舌尖轻轻放在上下门牙中间；ck 只发一个 k，别读两遍。',
    summary: '《店里的一只鸭子》：这是一个完整的小故事。读前先看词卡（奶酪）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，按「开头 → 后来 → 最后」把这件事讲一遍。',
    think: '说说你见过的一件好笑的事。',
    pre: [
      { art: '🧀', en: 'cheese', zh: '奶酪' },
      { art: '🦆', en: 'duck', zh: '鸭子' },
      { art: '🏪', en: 'shop', zh: '小店' }
    ],
    sight: ['afraid'],
    newWords: [
      { w: 'cheese', zh: '奶酪' }
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
      { q: '商店里的鸭子最后去了哪儿？', opts: ['被带去了公园', '自己走回家了', '留在店里'], a: 1, kind: 'recall' },
      { q: '鸭子在店里看了什么？', opts: ['薯条和奶酪', '鞋子和帽子', '鱼和肉'], a: 0, kind: 'infer' },
      { q: '看到不认识的小动物闯进来，你会怎么做？', opts: ['追着打它', '大声喊叫', '轻轻把它引到外面'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b27', lv: 'L3', tag: '吃饭', title: 'Fish and Chips', zh: '鱼和薯条',
    emoji: '🐟', color: '#CDE7C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 2 个新词（新鲜、盘子）。',
    trap: 'sh 把嘴唇撅圆、th 把舌尖轻轻放在上下门牙中间；ck 只发一个 k，别读两遍。',
    summary: '《鱼和薯条》：这是一个完整的小故事。读前先看词卡（新鲜、盘子）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，按「开头 → 后来 → 最后」把这件事讲一遍。',
    think: '说说你爱吃的一顿饭。',
    pre: [
      { art: '✨', en: 'fresh', zh: '新鲜' },
      { art: '🍽️', en: 'dish', zh: '盘子' },
      { art: '🐟', en: 'fish', zh: '鱼' },
      { art: '🍚', en: 'chips', zh: '薯片' }
    ],
    sight: ['eat', 'water'],
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
      { art: 'beach|grandma,mom|fish|★', en: 'I eat it all. Then I put the dish in the water.', zh: '我全吃完了。然后把盘子放进水里。' }
    ],
    quiz: [
      { q: '明明先吃了什么？', opts: ['鱼', '薯条', '两样一起吃'], a: 0, kind: 'recall' },
      { q: '鱼是新鲜的、薯条是热的，说明这顿饭怎么样？', opts: ['放凉了', '是昨天剩的', '刚做好，很好吃'], a: 2, kind: 'infer' },
      { q: '吃一顿饭，你会怎么做？', opts: ['不吃了', '全混在一起乱吃', '一样一样慢慢吃'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b28', lv: 'L3', tag: '故事', title: 'The King and a Ring', zh: '国王和戒指',
    emoji: '👑', color: '#C6DEF6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 3 个新词（富、小鸡、安全）。',
    trap: 'sh 把嘴唇撅圆、th 把舌尖轻轻放在上下门牙中间；ck 只发一个 k，别读两遍。',
    summary: '《国王和戒指》：这是一个完整的小故事。读前先看词卡（富、小鸡、安全）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，按「开头 → 后来 → 最后」把这件事讲一遍。',
    think: '说说一件你觉得很珍贵的东西。',
    pre: [
      { art: '✨', en: 'rich', zh: '富' },
      { art: '📦', en: 'chick', zh: '小鸡' },
      { art: '✨', en: 'safe', zh: '安全' },
      { art: '👑', en: 'king', zh: '国王' }
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
      { q: '国王的戒指在谁那儿？', opts: ['一只猫', '一个小孩', '一只小鸡'], a: 2, kind: 'recall' },
      { q: '国王找到戒指以后，怎么样了？', opts: ['笑了，把戒指收好', '很生气地走了', '把小鸡赶走了'], a: 0, kind: 'infer' },
      { q: '怕重要的东西丢掉，你会怎么做？', opts: ['随便乱放', '放在固定、安全的地方', '藏到自己也找不到'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b29', lv: 'L3', tag: '观察', title: 'A Moth on the Path', zh: '小路上的飞蛾',
    emoji: '🦋', color: '#E0CFF3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 6 个新词（小路、飞蛾、瘦、叶子、观察、飞）。',
    trap: 'sh 把嘴唇撅圆、th 把舌尖轻轻放在上下门牙中间；ck 只发一个 k，别读两遍。',
    summary: '《小路上的飞蛾》：这是一个完整的小故事。读前先看词卡（小路、飞蛾、瘦、叶子、观察、飞）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，按「开头 → 后来 → 最后」把这件事讲一遍。',
    think: '说说你在户外看到的一种小虫。',
    pre: [
      { art: '🛤️', en: 'path', zh: '小路' },
      { art: '🦋', en: 'moth', zh: '飞蛾' },
      { art: '✨', en: 'thin', zh: '瘦' },
      { art: '🍃', en: 'leaf', zh: '叶子' },
      { art: '🏃', en: 'watch', zh: '观察' },
      { art: '🏃', en: 'fly', zh: '飞' }
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
      { q: '飞蛾最后怎么了？', opts: ['被明明抓住了', '停在叶子上不动', '飞走了'], a: 2, kind: 'recall' },
      { q: '飞蛾飞走了，明明为什么还是高兴的？', opts: ['因为他已经好好看过它了', '因为他抓住了它', '因为他不想再看'], a: 0, kind: 'infer' },
      { q: '小虫飞走了，你会怎么做？', opts: ['一直追它', '看着它飞走，不去追', '把它抓回来'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b30', lv: 'L3', tag: '海边', title: 'Sing at the Beach', zh: '在沙滩上唱歌',
    emoji: '🏖️', color: '#F6C9E3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 2 个新词（沙子、好）。',
    trap: 'sh 把嘴唇撅圆、th 把舌尖轻轻放在上下门牙中间；ck 只发一个 k，别读两遍。',
    summary: '《在沙滩上唱歌》：这是一个完整的小故事。读前先看词卡（沙子、好）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，按「开头 → 后来 → 最后」把这件事讲一遍。',
    think: '说说你在海边做过的事。',
    pre: [
      { art: '🌿', en: 'sand', zh: '沙子' },
      { art: '✨', en: 'nice', zh: '好' },
      { art: '🎩', en: 'hat', zh: '帽子' },
      { art: '🏖️', en: 'beach', zh: '沙滩' }
    ],
    sight: ['beach', 'strong'],
    newWords: [
      { w: 'sand', zh: '沙子' },
      { w: 'nice', zh: '好' }
    ],
    pages: [
      { art: 'beach|dad,lili|beach|·', en: 'We go to the beach. The sand is nice.', zh: '我们去海边。沙子软软的。' },
      { art: 'beach|dad,lili|beach|♪', en: 'We sit on the sand and sing.', zh: '我们坐在沙子上唱歌。' },
      { art: 'beach|dad,lili|beach|👀', en: 'The wind is strong. It takes my hat!', zh: '风很大。它把我的帽子吹走了！' },
      { art: 'beach|dad,lili|beach|?', en: 'The hat goes up and up.', zh: '帽子越飞越高。' },
      { art: 'beach|dad,lili|beach|·', en: 'I run after my hat.', zh: '我追我的帽子。' },
      { art: 'beach|dad,lili|beach|!', en: 'I get it back. The sand is on my hat.', zh: '我把它追回来了。帽子上全是沙。' },
      { art: 'beach|dad,lili|beach|♥', en: 'We sit down again.', zh: '我们又坐下来。' },
      { art: 'beach|dad,lili|beach|★', en: 'We sing at the beach. We are happy.', zh: '我们在海边唱歌。我们很开心。' }
    ],
    quiz: [
      { q: '风把什么吹走了？', opts: ['我们的鞋', '我们的伞', '我的帽子'], a: 2, kind: 'recall' },
      { q: '帽子被吹走以后我马上去追，说明什么？', opts: ['风停了', '我很在意这顶帽子', '我不喜欢海边'], a: 1, kind: 'infer' },
      { q: '在海边玩，你会怎么做？', opts: ['不玩了', '一个人跑得很远', '唱歌、玩沙，注意安全'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b31', lv: 'L3', tag: '家务', title: 'Wash the Dish', zh: '洗盘子',
    emoji: '🍽️', color: '#BFE6DF',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 1 个新词（洗）。',
    trap: 'sh 把嘴唇撅圆、th 把舌尖轻轻放在上下门牙中间；ck 只发一个 k，别读两遍。',
    summary: '《洗盘子》：这是一个完整的小故事。读前先看词卡（洗）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，按「开头 → 后来 → 最后」把这件事讲一遍。',
    think: '说说你做过的一件家务。',
    pre: [
      { art: '🏃', en: 'wash', zh: '洗' },
      { art: '🍽️', en: 'dish', zh: '盘子' },
      { art: '💧', en: 'water', zh: '水' }
    ],
    sight: ['clean', 'use', 'water'],
    newWords: [
      { w: 'wash', zh: '洗' }
    ],
    pages: [
      { art: 'kitchen|ming,grandma|dish|·', en: 'The dish is not clean.', zh: '盘子不干净。' },
      { art: 'kitchen|ming,grandma|dish|♪', en: 'I wash the dish.', zh: '我洗盘子。' },
      { art: 'kitchen|ming,grandma|dish|👀', en: 'I use water.', zh: '我用水。' },
      { art: 'kitchen|ming,grandma|dish|?', en: 'I wash and wash.', zh: '我洗啊洗。' },
      { art: 'kitchen|ming,grandma|dish|·', en: 'The dish is clean now!', zh: '盘子现在干净了！' },
      { art: 'kitchen|ming,grandma|dish|!', en: 'I put the dish away.', zh: '我把盘子放好。' },
      { art: 'kitchen|ming,grandma|dish|♥', en: 'A clean dish is good.', zh: '干净的盘子看着真舒服。' },
      { art: 'kitchen|ming,grandma|dish|★', en: 'I like a clean dish.', zh: '我喜欢干净的盘子。' }
    ],
    quiz: [
      { q: '盘子一开始是什么样？', opts: ['不干净', '破了', '太烫'], a: 0, kind: 'recall' },
      { q: '我用什么洗盘子？', opts: ['水', '沙', '油'], a: 0, kind: 'infer' },
      { q: '东西脏了，你会怎么做？', opts: ['扔掉', '不管它', '用水把它洗干净'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b32', lv: 'L3', tag: '故事', title: 'A Wish for a Chick', zh: '给小鸡的愿望',
    emoji: '🐤', color: '#F2E2A8',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 3 个新词（饿、许愿、食物）。',
    trap: 'sh 把嘴唇撅圆、th 把舌尖轻轻放在上下门牙中间；ck 只发一个 k，别读两遍。',
    summary: '《给小鸡的愿望》：这是一个完整的小故事。读前先看词卡（饿、许愿、食物）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，按「开头 → 后来 → 最后」把这件事讲一遍。',
    think: '说说你想为一个小动物做的一件事。',
    pre: [
      { art: '✨', en: 'hungry', zh: '饿' },
      { art: '🏃', en: 'wish', zh: '许愿' },
      { art: '📦', en: 'food', zh: '食物' },
      { art: '📦', en: 'chick', zh: '小鸡' }
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
      { art: 'farm|lili,grandpa|chick|★', en: 'The chick is not thin now. It runs to me.', zh: '小鸡现在不瘦了。它朝我跑过来。' }
    ],
    quiz: [
      { q: '小鸡原来怎么样？', opts: ['迷路了', '又小又瘦，还饿着', '生病了'], a: 1, kind: 'recall' },
      { q: '小鸡一开始怎么了？', opts: ['很胖，在睡觉', '在水里游', '又小又瘦，很饿'], a: 2, kind: 'infer' },
      { q: '看到小动物饿了，你会怎么做？', opts: ['给它合适的食物，照顾它', '吓它', '不理它'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b33', lv: 'L3', tag: '发音', title: 'Say It: Ship, Chip', zh: '说一说：ship chip',
    emoji: '🗣️', color: '#D9D2F5',
    track: 'drill',
    goal: '把本级难点音听准、说准，并能在整句里读对。认读 1 个新词（薯条）。',
    trap: 'sh 把嘴唇撅圆、th 把舌尖轻轻放在上下门牙中间；ck 只发一个 k，别读两遍。',
    summary: '《说一说：ship chip》：这一本练两个词的音和形。读前先看词卡（薯条）；读的时候先看清每个词，再连起来读一遍。',
    retell: '把这一本练的两个词再读一遍，说说它们的音哪里一样、哪里不一样。',
    think: '找两个都有 sh 的词，读一读、比一比。',
    pre: [
      { art: '🍚', en: 'chip', zh: '薯条' },
      { art: '🚢', en: 'ship', zh: '轮船' }
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
      { q: '这一本里，哪个词是吃的东西？', opts: ['chip', 'ship', 'shop'], a: 0, kind: 'recall' },
      { q: 'ship 和 chip 开头差在哪里？', opts: ['一个有一个没有', '一个长一个短', '一个 sh 一个 ch'], a: 2, kind: 'infer' },
      { q: '两个词都有 sh，你会怎么分清？', opts: ['不读了', '听清后面的部分，一个一个读', '随便读一个'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b34', lv: 'L3', tag: '小知识', title: 'A Long Wing', zh: '长长的翅膀',
    emoji: '🕊️', color: '#FAD3B6',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。认读 1 个新词（飞）。',
    trap: 'sh 把嘴唇撅圆、th 把舌尖轻轻放在上下门牙中间；ck 只发一个 k，别读两遍。',
    summary: '《长长的翅膀》：这一本从一件小事讲起，说说为什么会这样。读前先看词卡（飞）；读的时候留意先看到什么、为什么会这样、后来怎么弄明白。',
    retell: '合上书，按「先看到什么 → 为什么会这样 → 后来怎么弄明白」讲一遍。',
    think: '说说鸟是怎么飞起来的。',
    pre: [
      { art: '🏃', en: 'fly', zh: '飞' },
      { art: '🕊️', en: 'wing', zh: '翅膀' },
      { art: '🐦', en: 'bird', zh: '鸟' }
    ],
    sight: ['arms', 'bird', 'flies', 'watch'],
    newWords: [
      { w: 'fly', zh: '飞' }
    ],
    pages: [
      { art: 'library|grandpa,dad|wing|·', en: 'A bird has a long wing. It is long and thin.', zh: '一只鸟有长长的翅膀。又长又薄。' },
      { art: 'library|grandpa,dad|wing|♪', en: 'The bird flies with the wing. Up and up it goes.', zh: '鸟用翅膀飞。越飞越高。' },
      { art: 'library|grandpa,dad|wing|👀', en: 'The wind helps the wing. The bird flies far.', zh: '风托着翅膀。鸟飞得很远。' },
      { art: 'library|grandpa,dad|wing|?', en: 'I watch the long wing. I wish I could fly.', zh: '我看着那对长翅膀。我希望自己也能飞。' },
      { art: 'library|grandpa,dad|wing|·', en: 'I jump up, but I cannot fly.', zh: '我往上跳，可飞不起来。' },
      { art: 'library|grandpa,dad|wing|!', en: 'My arms are not wings.', zh: '我的胳膊不是翅膀。' },
      { art: 'library|grandpa,dad|wing|♥', en: 'I am not sad. I can run!', zh: '我不难过。我会跑！' },
      { art: 'library|grandpa,dad|wing|★', en: 'I run and run. I am not sad at all.', zh: '我跑啊跑。跑起来也很痛快。' }
    ],
    quiz: [
      { q: '「我」希望自己能做什么？', opts: ['游得很远', '飞起来', '跑得很快'], a: 1, kind: 'recall' },
      { q: '明明为什么飞不起来？', opts: ['因为没有风', '因为他的胳膊不是翅膀', '因为他太矮'], a: 1, kind: 'infer' },
      { q: '想做成一件难事，你会怎么做？', opts: ['一次就想学会', '不学了', '先看别人怎么做，再慢慢练'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b35', lv: 'L3', tag: '小知识', title: 'Fresh Cheese', zh: '新鲜的奶酪',
    emoji: '🧀', color: '#C8E7F0',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。认读 2 个新词（软、一块）。',
    trap: 'sh 把嘴唇撅圆、th 把舌尖轻轻放在上下门牙中间；ck 只发一个 k，别读两遍。',
    summary: '《新鲜的奶酪》：这一本从一件小事讲起，说说为什么会这样。读前先看词卡（软、一块）；读的时候留意先看到什么、为什么会这样、后来怎么弄明白。',
    retell: '合上书，按「先看到什么 → 为什么会这样 → 后来怎么弄明白」讲一遍。',
    think: '说说一种你喜欢的奶制品。',
    pre: [
      { art: '✨', en: 'soft', zh: '软' },
      { art: '📦', en: 'piece', zh: '一块' },
      { art: '🧀', en: 'cheese', zh: '奶酪' },
      { art: '🍽️', en: 'dish', zh: '盘子' }
    ],
    sight: ['cheese', 'clean', 'eat', 'fresh'],
    newWords: [
      { w: 'soft', zh: '软' },
      { w: 'piece', zh: '一块' }
    ],
    pages: [
      { art: 'kitchen|mom,ming|cheese|·', en: 'The cheese is fresh. It is on a dish.', zh: '奶酪很新鲜。它放在盘子上。' },
      { art: 'kitchen|mom,ming|cheese|♪', en: 'I like fresh cheese. It is soft.', zh: '我喜欢新鲜奶酪。它软软的。' },
      { art: 'kitchen|mom,ming|cheese|👀', en: 'I cut the cheese and eat a little.', zh: '我切下一块，尝了一点。' },
      { art: 'kitchen|mom,ming|cheese|?', en: 'It is good! I want more.', zh: '真好吃！我还想要。' },
      { art: 'kitchen|mom,ming|cheese|·', en: 'I cut more cheese.', zh: '我又切了一些。' },
      { art: 'kitchen|mom,ming|cheese|!', en: 'Mom wants some too.', zh: '妈妈也想要一点。' },
      { art: 'kitchen|mom,ming|cheese|♥', en: 'Now the dish is clean.', zh: '现在盘子空了。' },
      { art: 'kitchen|mom,ming|cheese|★', en: 'I eat the last piece. Then the dish is clean.', zh: '我吃下最后一块。盘子空了。' }
    ],
    quiz: [
      { q: '「我」切了多少奶酪？', opts: ['一点也没切', '只切了一小块', '越切越多，盘子空了'], a: 2, kind: 'recall' },
      { q: '明明觉得这奶酪怎么样？', opts: ['太硬了咬不动', '很好吃，还想要更多', '味道很奇怪'], a: 1, kind: 'infer' },
      { q: '想知道食物新不新鲜，你会怎么做？', opts: ['直接吃', '看一看、闻一闻', '不管它'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b36', lv: 'L3', tag: '复习', title: 'Down by the Shed', zh: '棚子边',
    emoji: '🛖', color: '#E8D9B5',
    track: 'review',
    goal: '把本级和前面级别的词再读一遍、串成一个故事。认读 2 个新词（摘、家人）。',
    trap: 'sh 把嘴唇撅圆、th 把舌尖轻轻放在上下门牙中间；ck 只发一个 k，别读两遍。',
    summary: '《棚子边》：这是一个完整的小故事。读前先看词卡（摘、家人）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，按「开头 → 后来 → 最后」把这件事讲一遍。',
    think: '说说你家附近的一个地方：那里有什么？',
    pre: [
      { art: '🏃', en: 'pick', zh: '摘' },
      { art: '🧑', en: 'family', zh: '家人' },
      { art: '📍', en: 'shed', zh: '小棚' },
      { art: '🐔', en: 'hen', zh: '母鸡' }
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
      { q: '我在棚子边捡到了什么？', opts: ['一个新鲜的蛋', '一块木头', '一根羽毛'], a: 0, kind: 'recall' },
      { q: '明明拿了蛋就走，为什么没有惊动母鸡？', opts: ['他动作轻，没吓到它', '母鸡不在棚子里', '母鸡睡着了'], a: 0, kind: 'infer' },
      { q: '捡到一样东西，你会怎么做？', opts: ['不管它', '自己拿走', '想一想它是谁的，再决定怎么办'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b37', lv: 'L4', tag: '池塘', title: 'The Frog on the Stone', zh: '石头上的青蛙',
    emoji: '🐸', color: '#F6C6C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 3 个新词（青蛙、石头、池塘）。',
    trap: '连缀中间不加元音：tree 是「tr-ee」一个词，不是「特-瑞」两个音。',
    summary: '《石头上的青蛙》：这是一个完整的小故事。读前先看词卡（青蛙、石头、池塘）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，按「开头 → 后来 → 最后」把这件事讲一遍。',
    think: '说说青蛙抓虫的样子。',
    pre: [
      { art: '🐸', en: 'frog', zh: '青蛙' },
      { art: '🌿', en: 'stone', zh: '石头' },
      { art: '📍', en: 'pond', zh: '池塘' },
      { art: '🐛', en: 'bug', zh: '小虫' }
    ],
    sight: ['flies', 'green', 'waits'],
    newWords: [
      { w: 'frog', zh: '青蛙' },
      { w: 'stone', zh: '石头' },
      { w: 'pond', zh: '池塘' }
    ],
    pages: [
      { art: 'library|ming,grandma|frog|·', en: 'A green frog sits on a stone.', zh: '一只绿青蛙坐在石头上。' },
      { art: 'library|ming,grandma|frog|♪', en: 'The stone is by the pond.', zh: '石头在池塘边。' },
      { art: 'library|ming,grandma|frog|👀', en: 'The frog waits. It does not move.', zh: '青蛙等着。它一动不动。' },
      { art: 'library|ming,grandma|frog|?', en: 'A bug flies by. The frog sees it.', zh: '一只小虫飞过。青蛙看见了。' },
      { art: 'library|ming,grandma|frog|·', en: 'It jumps up and gets the bug.', zh: '它跳起来，抓住了小虫。' },
      { art: 'library|ming,grandma|frog|!', en: 'It goes back to the stone.', zh: '它回到石头上。' },
      { art: 'library|ming,grandma|frog|♥', en: 'The frog sits and waits.', zh: '青蛙坐着等。' },
      { art: 'library|ming,grandma|frog|★', en: 'One more bug comes. The frog is glad.', zh: '又飞来一只小虫。青蛙已经很高兴了。' },
      { art: 'library|ming,grandma|frog|…', en: 'The frog is happy.', zh: '青蛙很快乐。' }
    ],
    quiz: [
      { q: '青蛙坐在什么地方等虫子？', opts: ['草里', '池塘里', '石头上'], a: 2, kind: 'recall' },
      { q: '青蛙在等什么？', opts: ['小鸟', '飞过来的小虫', '小鱼'], a: 1, kind: 'infer' },
      { q: '想抓住机会（做成一件事），你会怎么做？', opts: ['不等了', '乱抓一气', '耐心等，看准了再动'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b38', lv: 'L4', tag: '运动会', title: 'A Blue Flag', zh: '蓝色的旗子',
    emoji: '🚩', color: '#F9DFB4',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 2 个新词（旗子、高）。',
    trap: '连缀中间不加元音：tree 是「tr-ee」一个词，不是「特-瑞」两个音。',
    summary: '《蓝色的旗子》：这是一个完整的小故事。读前先看词卡（旗子、高）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，按「开头 → 后来 → 最后」把这件事讲一遍。',
    think: '说说一面旗子：它是什么颜色的？',
    pre: [
      { art: '🚩', en: 'flag', zh: '旗子' },
      { art: '✨', en: 'high', zh: '高' }
    ],
    sight: ['blue', 'friend'],
    newWords: [
      { w: 'flag', zh: '旗子' },
      { w: 'high', zh: '高' }
    ],
    pages: [
      { art: 'school|lili,grandpa|flag|·', en: 'I have a blue flag.', zh: '我有一面蓝旗。' },
      { art: 'school|lili,grandpa|flag|♪', en: 'I hold it up high.', zh: '我把它举得高高的。' },
      { art: 'school|lili,grandpa|flag|👀', en: 'The flag is blue. It is big and new.', zh: '旗子是蓝色的。它又大又新。' },
      { art: 'school|lili,grandpa|flag|?', en: 'A red flag is here too.', zh: '这儿还有一面红旗。' },
      { art: 'school|lili,grandpa|flag|·', en: 'Blue and red flags. We hold them up.', zh: '蓝旗和红旗。我们把它们举起来。' },
      { art: 'school|lili,grandpa|flag|!', en: 'My friend has a flag.', zh: '我的朋友也有一面旗。' },
      { art: 'school|lili,grandpa|flag|♥', en: 'We hold the flags and run.', zh: '我们举着旗跑。' },
      { art: 'school|lili,grandpa|flag|★', en: 'I like my blue flag.', zh: '我喜欢我的蓝旗。' },
      { art: 'school|lili,grandpa|flag|…', en: 'The flags are for all of us. We are glad.', zh: '这些旗是我们大家的。我们很高兴。' }
    ],
    quiz: [
      { q: '「我」举起来的旗是什么颜色的？', opts: ['蓝色', '绿色', '红色'], a: 0, kind: 'recall' },
      { q: '明明把旗举得高高的，是因为什么？', opts: ['风把旗吹起来了', '旗太重了', '他很喜欢这面旗，想让人看见'], a: 2, kind: 'infer' },
      { q: '和别人一起做一件事，你会怎么做？', opts: ['自己全占', '不做了', '分一分，大家一起做'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b39', lv: 'L4', tag: '夜空', title: 'Stars in the Sky', zh: '天上的星星',
    emoji: '⭐', color: '#CDE7C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 2 个新词（星星、白色）。',
    trap: '连缀中间不加元音：tree 是「tr-ee」一个词，不是「特-瑞」两个音。',
    summary: '《天上的星星》：这是一个完整的小故事。读前先看词卡（星星、白色）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，按「开头 → 后来 → 最后」把这件事讲一遍。',
    think: '说说你在夜空里看到过什么。',
    pre: [
      { art: '⭐', en: 'star', zh: '星星' },
      { art: '⚪', en: 'white', zh: '白色' },
      { art: '🌿', en: 'sky', zh: '天空' }
    ],
    sight: ['high', 'stars'],
    newWords: [
      { w: 'star', zh: '星星' },
      { w: 'white', zh: '白色' }
    ],
    pages: [
      { art: 'night|grandma,mom|star|·', en: 'The night is here.', zh: '夜晚到了。' },
      { art: 'night|grandma,mom|star|♪', en: 'I look up at the sky.', zh: '我抬头看天。' },
      { art: 'night|grandma,mom|star|👀', en: 'I see a star. Then I see two stars.', zh: '我看见一颗星星。然后又看见两颗。' },
      { art: 'night|grandma,mom|star|?', en: 'I see many stars in the sky.', zh: '我看见天上有好多星星。' },
      { art: 'night|grandma,mom|star|·', en: 'The stars are small and white.', zh: '星星又小又白。' },
      { art: 'night|grandma,mom|star|!', en: 'They are high in the sky.', zh: '它们高高地挂在天上。' },
      { art: 'night|grandma,mom|star|♥', en: 'I keep looking up.', zh: '我一直抬头看着。' },
      { art: 'night|grandma,mom|star|★', en: 'The sky is big. The stars are many.', zh: '天很大。星星很多。' },
      { art: 'night|grandma,mom|star|…', en: 'I like the stars at night.', zh: '我喜欢夜里的星星。' }
    ],
    quiz: [
      { q: '夜里「我」抬头在看什么？', opts: ['天上的星星', '云', '月亮'], a: 0, kind: 'recall' },
      { q: '我看到了什么？', opts: ['云', '太阳', '好多星星'], a: 2, kind: 'infer' },
      { q: '晚上看星星，你会怎么做？', opts: ['找个安静的地方，慢慢看', '不看', '大声喊'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b40', lv: 'L4', tag: '上学', title: 'The Clock at School', zh: '学校的钟',
    emoji: '🕐', color: '#C6DEF6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 3 个新词（钟、房间、晚）。',
    trap: '连缀中间不加元音：tree 是「tr-ee」一个词，不是「特-瑞」两个音。',
    summary: '《学校的钟》：这是一个完整的小故事。读前先看词卡（钟、房间、晚）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，按「开头 → 后来 → 最后」把这件事讲一遍。',
    think: '说说你家里的一口钟或一块表。',
    pre: [
      { art: '🕐', en: 'clock', zh: '钟' },
      { art: '📦', en: 'room', zh: '房间' },
      { art: '✨', en: 'late', zh: '晚' },
      { art: '📖', en: 'book', zh: '书' },
      { art: '🏫', en: 'school', zh: '学校' }
    ],
    sight: [],
    newWords: [
      { w: 'clock', zh: '钟' },
      { w: 'room', zh: '房间' },
      { w: 'late', zh: '晚' }
    ],
    pages: [
      { art: 'school|grandpa,dad|clock|·', en: 'There is a clock at school.', zh: '学校有一个钟。' },
      { art: 'school|grandpa,dad|clock|♪', en: 'The clock is on the wall.', zh: '钟挂在墙上。' },
      { art: 'school|grandpa,dad|clock|👀', en: 'I look at the clock. It is early.', zh: '我看看钟。时间还早。' },
      { art: 'school|grandpa,dad|clock|?', en: 'I read my book and wait.', zh: '我一边看书一边等。' },
      { art: 'school|grandpa,dad|clock|·', en: 'The clock says it is time.', zh: '钟说到时间了。' },
      { art: 'school|grandpa,dad|clock|!', en: 'I leave my book. I go to the room.', zh: '我放下书。我去教室。' },
      { art: 'school|grandpa,dad|clock|♥', en: 'I am not late.', zh: '我没有迟到。' },
      { art: 'school|grandpa,dad|clock|★', en: 'I am glad, and the clock is glad too.', zh: '我很高兴，钟也高兴。' },
      { art: 'school|grandpa,dad|clock|…', en: 'The clock helps me every day.', zh: '钟每天都帮我。' }
    ],
    quiz: [
      { q: '学校的钟帮「我」知道了什么？', opts: ['时间还早', '教室在哪儿', '天气怎么样'], a: 0, kind: 'recall' },
      { q: '钟帮我做了什么？', opts: ['写作业', '做饭', '知道时间，不迟到'], a: 2, kind: 'infer' },
      { q: '想知道现在几点，你会怎么做？', opts: ['不管它', '随便猜一猜', '看看钟表'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b41', lv: 'L4', tag: '观察', title: 'Grass and a Crab', zh: '草和螃蟹',
    emoji: '🦀', color: '#E0CFF3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 2 个新词（草、螃蟹）。',
    trap: '连缀中间不加元音：tree 是「tr-ee」一个词，不是「特-瑞」两个音。',
    summary: '《草和螃蟹》：这是一个完整的小故事。读前先看词卡（草、螃蟹）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，按「开头 → 后来 → 最后」把这件事讲一遍。',
    think: '说说你在水边看到的一种小动物。',
    pre: [
      { art: '🌿', en: 'grass', zh: '草' },
      { art: '🦀', en: 'crab', zh: '螃蟹' },
      { art: '💧', en: 'water', zh: '水' },
      { art: '🌿', en: 'sand', zh: '沙子' }
    ],
    sight: ['green', 'water'],
    newWords: [
      { w: 'grass', zh: '草' },
      { w: 'crab', zh: '螃蟹' }
    ],
    pages: [
      { art: 'farm|mom,ming|grass|·', en: 'I see grass by the water.', zh: '我看见水边有草。' },
      { art: 'farm|mom,ming|grass|♪', en: 'I see a crab too.', zh: '我还看见一只螃蟹。' },
      { art: 'farm|mom,ming|grass|👀', en: 'The crab is small. It walks on the sand.', zh: '螃蟹很小。它在沙子上走。' },
      { art: 'farm|mom,ming|grass|?', en: 'It hides in the grass.', zh: '它躲进草里。' },
      { art: 'farm|mom,ming|grass|·', en: 'I look for the crab.', zh: '我去找那只螃蟹。' },
      { art: 'farm|mom,ming|grass|!', en: 'I wait and do not move.', zh: '我等着，不动。' },
      { art: 'farm|mom,ming|grass|♥', en: 'The crab comes out. It walks to me.', zh: '螃蟹出来了。它朝我走过来。' },
      { art: 'farm|mom,ming|grass|★', en: 'The crab is green. The grass is green too.', zh: '螃蟹是绿的。草也是绿的。' },
      { art: 'farm|mom,ming|grass|…', en: 'I like the crab.', zh: '我喜欢这只螃蟹。' }
    ],
    quiz: [
      { q: '螃蟹躲到哪儿去了？', opts: ['草里', '沙子里', '石头下面'], a: 0, kind: 'recall' },
      { q: '螃蟹先躲进草里，后来为什么又出来了？', opts: ['草里太热', '明明没动，它觉得安全了', '明明叫了它'], a: 1, kind: 'infer' },
      { q: '小动物躲起来了，你会怎么做？', opts: ['耐心等它出来', '不管它', '一直翻找吓它'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b42', lv: 'L4', tag: '池塘', title: 'Swim with the Swan', zh: '和天鹅一起游',
    emoji: '🦢', color: '#F6C9E3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 2 个新词（天鹅、游泳）。',
    trap: '连缀中间不加元音：tree 是「tr-ee」一个词，不是「特-瑞」两个音。',
    summary: '《和天鹅一起游》：这是一个完整的小故事。读前先看词卡（天鹅、游泳）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，按「开头 → 后来 → 最后」把这件事讲一遍。',
    think: '说说天鹅在水里的样子。',
    pre: [
      { art: '🦢', en: 'swan', zh: '天鹅' },
      { art: '🏃', en: 'swim', zh: '游泳' },
      { art: '💧', en: 'water', zh: '水' },
      { art: '✋', en: 'hand', zh: '手' }
    ],
    sight: ['afraid', 'friends', 'watch', 'water', 'white'],
    newWords: [
      { w: 'swan', zh: '天鹅' },
      { w: 'swim', zh: '游泳' }
    ],
    pages: [
      { art: 'beach|dad,lili|swan|·', en: 'A swan is on the water.', zh: '水面上有一只天鹅。' },
      { art: 'beach|dad,lili|swan|♪', en: 'The swan is big. It is white.', zh: '天鹅很大。它是白的。' },
      { art: 'beach|dad,lili|swan|👀', en: 'It swims on the water. It comes to me.', zh: '它在水上游。它朝我游过来。' },
      { art: 'beach|dad,lili|swan|?', en: 'I watch the swan.', zh: '我看着天鹅。' },
      { art: 'beach|dad,lili|swan|·', en: 'I put my hand in the water.', zh: '我把手放进水里。' },
      { art: 'beach|dad,lili|swan|!', en: 'The swan is not afraid.', zh: '天鹅不怕。' },
      { art: 'beach|dad,lili|swan|♥', en: 'I swim with the swan.', zh: '我和天鹅一起游。' },
      { art: 'beach|dad,lili|swan|★', en: 'We swim and we are glad.', zh: '我们游着，很高兴。' },
      { art: 'beach|dad,lili|swan|…', en: 'The swan and I are friends.', zh: '天鹅和我是朋友。' }
    ],
    quiz: [
      { q: '天鹅在哪儿？', opts: ['树下', '水面上', '岸上'], a: 1, kind: 'recall' },
      { q: '天鹅愿意游到明明身边，是因为什么？', opts: ['明明手里有吃的', '天鹅认识明明', '明明很安静，它不怕他'], a: 2, kind: 'infer' },
      { q: '想和小动物亲近，你会怎么做？', opts: ['大声吓它', '轻轻靠近，让它不怕你', '追它'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b43', lv: 'L4', tag: '送礼', title: 'A Gift in a Basket', zh: '篮子里的礼物',
    emoji: '🧺', color: '#BFE6DF',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 3 个新词（篮子、礼物、空）。',
    trap: '连缀中间不加元音：tree 是「tr-ee」一个词，不是「特-瑞」两个音。',
    summary: '《篮子里的礼物》：这是一个完整的小故事。读前先看词卡（篮子、礼物、空）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，按「开头 → 后来 → 最后」把这件事讲一遍。',
    think: '说说你送过或收到的一份礼物。',
    pre: [
      { art: '📦', en: 'basket', zh: '篮子' },
      { art: '🎁', en: 'gift', zh: '礼物' },
      { art: '✨', en: 'empty', zh: '空' }
    ],
    sight: ['carry'],
    newWords: [
      { w: 'basket', zh: '篮子' },
      { w: 'gift', zh: '礼物' },
      { w: 'empty', zh: '空' }
    ],
    pages: [
      { art: 'home|ming,grandma|gift|·', en: 'I have a basket.', zh: '我有一个篮子。' },
      { art: 'home|ming,grandma|gift|♪', en: 'A gift is in the basket.', zh: '篮子里有一件礼物。' },
      { art: 'home|ming,grandma|gift|👀', en: 'The gift is for Mom. It is small.', zh: '礼物是给妈妈的。它很小。' },
      { art: 'home|ming,grandma|gift|?', en: 'I carry the basket.', zh: '我提着篮子。' },
      { art: 'home|ming,grandma|gift|·', en: 'I am careful with it.', zh: '我很小心。' },
      { art: 'home|ming,grandma|gift|!', en: 'I walk slowly and hold it up.', zh: '我慢慢走，把它提着。' },
      { art: 'home|ming,grandma|gift|♥', en: 'I give the gift to Mom.', zh: '我把礼物给妈妈。' },
      { art: 'home|ming,grandma|gift|★', en: 'Mom is happy. I am happy too.', zh: '妈妈很高兴。我也很高兴。' },
      { art: 'home|ming,grandma|gift|…', en: 'The basket is empty now.', zh: '篮子现在空了。' }
    ],
    quiz: [
      { q: '篮子里的礼物是给谁的？', opts: ['奶奶', '妈妈', '老师'], a: 1, kind: 'recall' },
      { q: '明明一路小心地提着篮子，是因为什么？', opts: ['篮子很贵', '篮子很重', '里面是给妈妈的礼物，怕碰坏'], a: 2, kind: 'infer' },
      { q: '送别人礼物，你会怎么做？', opts: ['想一想他喜欢什么，再送', '不送了', '随便送一个'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b44', lv: 'L4', tag: '游戏', title: 'Clap and Spin', zh: '拍手转圈',
    emoji: '🌀', color: '#F2E2A8',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 5 个新词（鼓、打、拍手、转圈、乐趣）。',
    trap: '连缀中间不加元音：tree 是「tr-ee」一个词，不是「特-瑞」两个音。',
    summary: '《拍手转圈》：这是一个完整的小故事。读前先看词卡（鼓、打、拍手、转圈、乐趣）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，按「开头 → 后来 → 最后」把这件事讲一遍。',
    think: '说说你会玩的一种乐器或一种声音。',
    pre: [
      { art: '🥁', en: 'drum', zh: '鼓' },
      { art: '🏃', en: 'hit', zh: '打' },
      { art: '🏃', en: 'clap', zh: '拍手' },
      { art: '🏃', en: 'spin', zh: '转圈' },
      { art: '💡', en: 'fun', zh: '乐趣' },
      { art: '✋', en: 'hand', zh: '手' }
    ],
    sight: ['friend', 'hears', 'laugh'],
    newWords: [
      { w: 'drum', zh: '鼓' },
      { w: 'hit', zh: '打' },
      { w: 'clap', zh: '拍手' },
      { w: 'spin', zh: '转圈' },
      { w: 'fun', zh: '乐趣' }
    ],
    pages: [
      { art: 'playground|lili,grandpa|drum|·', en: 'I have a drum.', zh: '我有一面鼓。' },
      { art: 'playground|lili,grandpa|drum|♪', en: 'I hit the drum with my hand.', zh: '我用手敲鼓。' },
      { art: 'playground|lili,grandpa|drum|👀', en: 'The drum is loud. My friend hears it.', zh: '鼓声很响。我的朋友听见了。' },
      { art: 'playground|lili,grandpa|drum|?', en: 'I hit and hit.', zh: '我敲啊敲。' },
      { art: 'playground|lili,grandpa|drum|·', en: 'My friend claps and jumps.', zh: '我的朋友拍手跳起来。' },
      { art: 'playground|lili,grandpa|drum|!', en: 'We clap and spin and laugh.', zh: '我们又拍手又转圈，还笑。' },
      { art: 'playground|lili,grandpa|drum|♥', en: 'The drum is fun, and we laugh.', zh: '鼓很好玩，我们笑了。' },
      { art: 'playground|lili,grandpa|drum|★', en: 'I like my drum. I like the sound.', zh: '我喜欢我的鼓。我也喜欢这个声音。' },
      { art: 'playground|lili,grandpa|drum|…', en: 'We play the drum all day, and we are glad.', zh: '我们敲了一整天鼓，高兴极了。' }
    ],
    quiz: [
      { q: '「我」用什么弄出很响的声音？', opts: ['一面鼓', '一只脚', '两只手'], a: 0, kind: 'recall' },
      { q: '我用鼓做什么？', opts: ['敲出声音、玩', '装东西', '切菜'], a: 0, kind: 'infer' },
      { q: '玩一样喜欢的乐器，你会怎么做？', opts: ['不玩了', '乱敲一通', '按节奏来，好好享受'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b45', lv: 'L4', tag: '发音', title: 'Say It: Tree', zh: '说一说：tree',
    emoji: '🗣️', color: '#D9D2F5',
    track: 'drill',
    goal: '把本级难点音听准、说准，并能在整句里读对。认读 1 个新词（大门）。',
    trap: '连缀中间不加元音：tree 是「tr-ee」一个词，不是「特-瑞」两个音。',
    summary: '《说一说：tree》：这一本练两个词的音和形。读前先看词卡（大门）；读的时候先看清每个词，再连起来读一遍。',
    retell: '把这一本练的两个词再读一遍，说说它们的音哪里一样、哪里不一样。',
    think: '找一个带 tr 的词，读一读。',
    pre: [
      { art: '📍', en: 'gate', zh: '大门' },
      { art: '🌳', en: 'tree', zh: '树' }
    ],
    sight: ['tree'],
    newWords: [
      { w: 'gate', zh: '大门' }
    ],
    pages: [
      { art: 'table|grandma,mom|tree|·', en: 'This is a tree.', zh: '这是一棵树。' },
      { art: 'table|grandma,mom|tree|♪', en: 'Say "tree".', zh: '说 tree。' },
      { art: 'table|grandma,mom|tree|👀', en: 'The "tr" is one sound. Say it together.', zh: 'tr 是一个音。连起来说。' },
      { art: 'table|grandma,mom|tree|?', en: 'Say "tr-ee".', zh: '说 tr-ee。' },
      { art: 'table|grandma,mom|tree|·', en: 'Tree, tree, tree.', zh: 'tree，tree，tree。' },
      { art: 'table|grandma,mom|tree|!', en: 'A tree is tall.', zh: '树很高。' },
      { art: 'table|grandma,mom|tree|♥', en: 'I see a tree by the gate.', zh: '我看见门口有一棵树。' },
      { art: 'table|grandma,mom|tree|★', en: 'You can say "tree".', zh: '你会说 tree 了。' },
      { art: 'table|grandma,mom|tree|…', en: 'Good! Say it again.', zh: '很好！再说一遍。' }
    ],
    quiz: [
      { q: '这一本在练哪个字母组合的音？', opts: ['sh', 'tr', 'th'], a: 1, kind: 'recall' },
      { q: 'tree 开头那两个字母该怎么读？', opts: ['分成两个音读', '只读 t', '连在一起读成一个音'], a: 2, kind: 'infer' },
      { q: '遇到带 tr 的单词，你会怎么读？', opts: ['跳过去', '把 tr 连成一个音读出来', '一个字母一个字母念'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b46', lv: 'L4', tag: '小知识', title: 'How a Stem Grows', zh: '茎怎么长',
    emoji: '🌱', color: '#FAD3B6',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。认读 3 个新词（茎、光、花）。',
    trap: '连缀中间不加元音：tree 是「tr-ee」一个词，不是「特-瑞」两个音。',
    summary: '《茎怎么长》：这一本从一件小事讲起，说说为什么会这样。读前先看词卡（茎、光、花）；读的时候留意先看到什么、为什么会这样、后来怎么弄明白。',
    retell: '合上书，按「先看到什么 → 为什么会这样 → 后来怎么弄明白」讲一遍。',
    think: '说说一株植物是怎么长大的。',
    pre: [
      { art: '🌿', en: 'stem', zh: '茎' },
      { art: '🌿', en: 'light', zh: '光' },
      { art: '🌻', en: 'flower', zh: '花' },
      { art: '☀️', en: 'sun', zh: '太阳' }
    ],
    sight: ['green', 'grows', 'leaf'],
    newWords: [
      { w: 'stem', zh: '茎' },
      { w: 'light', zh: '光' },
      { w: 'flower', zh: '花' }
    ],
    pages: [
      { art: 'garden|grandpa,dad|stem|·', en: 'A small stem is here.', zh: '这儿有一根小茎。' },
      { art: 'garden|grandpa,dad|stem|♪', en: 'The stem is thin and small in the sun.', zh: '太阳下，这根茎又细又小。' },
      { art: 'garden|grandpa,dad|stem|👀', en: 'It grows and grows every day.', zh: '它每天长啊长。' },
      { art: 'garden|grandpa,dad|stem|?', en: 'The stem gets big. A leaf comes out.', zh: '茎变粗了。还长出一片叶子。' },
      { art: 'garden|grandpa,dad|stem|·', en: 'The leaf is green and soft.', zh: '叶子又绿又软。' },
      { art: 'garden|grandpa,dad|stem|!', en: 'The stem grows up to the light.', zh: '茎朝着光往上长。' },
      { art: 'garden|grandpa,dad|stem|♥', en: 'A flower is on the stem.', zh: '茎上开了一朵花。' },
      { art: 'garden|grandpa,dad|stem|★', en: 'The stem is tall now.', zh: '茎现在很高了。' },
      { art: 'garden|grandpa,dad|stem|…', en: 'How a stem grows, and how it gets tall!', zh: '茎就是这样长的，越长越高！' }
    ],
    quiz: [
      { q: '茎往上长，最后上面开了什么？', opts: ['一朵花', '一个果子', '一片叶子'], a: 0, kind: 'recall' },
      { q: '茎是怎么长的？', opts: ['从细小长到粗高，还长出叶子和花', '越长越小', '一直不变'], a: 0, kind: 'infer' },
      { q: '想看着一样东西长大，你会怎么做？', opts: ['每天看看，耐心等', '不看了', '一直拔它'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b47', lv: 'L4', tag: '小知识', title: 'Snow on the Street', zh: '街上的雪',
    emoji: '❄️', color: '#C8E7F0',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。认读 2 个新词（雪、街道）。',
    trap: '连缀中间不加元音：tree 是「tr-ee」一个词，不是「特-瑞」两个音。',
    summary: '《街上的雪》：这一本从一件小事讲起，说说为什么会这样。读前先看词卡（雪、街道）；读的时候留意先看到什么、为什么会这样、后来怎么弄明白。',
    retell: '合上书，按「先看到什么 → 为什么会这样 → 后来怎么弄明白」讲一遍。',
    think: '说说下雪天你会玩什么。',
    pre: [
      { art: '❄️', en: 'snow', zh: '雪' },
      { art: '🛣️', en: 'street', zh: '街道' },
      { art: '⚽', en: 'ball', zh: '球' },
      { art: '🏠', en: 'home', zh: '家' }
    ],
    sight: ['white'],
    newWords: [
      { w: 'snow', zh: '雪' },
      { w: 'street', zh: '街道' }
    ],
    pages: [
      { art: 'night|mom,ming|snow|·', en: 'Snow is on the street.', zh: '街上有雪。' },
      { art: 'night|mom,ming|snow|♪', en: 'The snow is white and cold.', zh: '雪又白又冷。' },
      { art: 'night|mom,ming|snow|👀', en: 'I walk on the street.', zh: '我在街上走。' },
      { art: 'night|mom,ming|snow|?', en: 'I am cold, and my hands are cold too.', zh: '我冷，我的手也冷。' },
      { art: 'night|mom,ming|snow|·', en: 'I make a big ball of snow.', zh: '我做了一个大雪球。' },
      { art: 'night|mom,ming|snow|!', en: 'The snow ball is big and cold.', zh: '雪球又大又凉。' },
      { art: 'night|mom,ming|snow|♥', en: 'I am not cold now.', zh: '我现在不冷了。' },
      { art: 'night|mom,ming|snow|★', en: 'I like the snow. I like the street now.', zh: '我喜欢雪。现在也喜欢这条街。' },
      { art: 'night|mom,ming|snow|…', en: 'I make one more ball. Then I go home.', zh: '我又做了一个雪球。然后回家。' }
    ],
    quiz: [
      { q: '「我」在街上做了什么？', opts: ['堆了一个雪人', '做了一个大雪球', '把雪扫到一边'], a: 1, kind: 'recall' },
      { q: '明明玩了一会儿雪球就不冷了，为什么？', opts: ['动起来身上就暖和了', '太阳出来了', '雪变热了'], a: 0, kind: 'infer' },
      { q: '下雪天在外面玩，你会怎么做？', opts: ['穿得很少', '穿暖和，玩一会儿就暖起来', '不出去'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b48', lv: 'L4', tag: '复习', title: 'Back to the Playground', zh: '回到操场',
    emoji: '🏫', color: '#E8D9B5',
    track: 'review',
    goal: '把本级和前面级别的词再读一遍、串成一个故事。认读 2 个新词（操场、休息）。',
    trap: '连缀中间不加元音：tree 是「tr-ee」一个词，不是「特-瑞」两个音。',
    summary: '《回到操场》：这是一个完整的小故事。读前先看词卡（操场、休息）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，按「开头 → 后来 → 最后」把这件事讲一遍。',
    think: '说说你在操场上最喜欢玩的东西。',
    pre: [
      { art: '🛝', en: 'playground', zh: '操场' },
      { art: '💡', en: 'rest', zh: '休息' },
      { art: '⚽', en: 'ball', zh: '球' },
      { art: '🚩', en: 'flag', zh: '旗子' }
    ],
    sight: ['laugh'],
    newWords: [
      { w: 'playground', zh: '操场' },
      { w: 'rest', zh: '休息' }
    ],
    pages: [
      { art: 'library|dad,lili|playground|·', en: 'We go back to the playground.', zh: '我们回到操场。' },
      { art: 'library|dad,lili|playground|♪', en: 'The playground is big and new.', zh: '操场又大又新。' },
      { art: 'library|dad,lili|playground|👀', en: 'I see a ball and a flag.', zh: '我看见一个球和一面旗。' },
      { art: 'library|dad,lili|playground|?', en: 'We play with the ball and laugh.', zh: '我们玩球，笑得很开心。' },
      { art: 'library|dad,lili|playground|·', en: 'We run and we clap and we spin.', zh: '我们跑、拍手、转圈。' },
      { art: 'library|dad,lili|playground|!', en: 'The clock says it is early.', zh: '钟说时间还早。' },
      { art: 'library|dad,lili|playground|♥', en: 'We play some more. Then we rest.', zh: '我们又玩了一会儿。然后歇一歇。' },
      { art: 'library|dad,lili|playground|★', en: 'Back to the playground, all is well.', zh: '回到操场，一切都好。' },
      { art: 'library|dad,lili|playground|…', en: 'I like the playground.', zh: '我喜欢这个操场。' }
    ],
    quiz: [
      { q: '我们在操场上看见了什么？', opts: ['一只猫和一只狗', '一个钟和一个篮子', '一个球和一面旗'], a: 2, kind: 'recall' },
      { q: '钟说时间还早，所以他们怎么样了？', opts: ['马上回家了', '去上课了', '又玩了一会儿'], a: 2, kind: 'infer' },
      { q: '和朋友一起玩，你会怎么做？', opts: ['轮流、一起玩，玩得开心', '不玩了', '自己霸占'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b49', lv: 'L5', tag: '天气', title: 'Rain on the Farm', zh: '农场上的雨',
    emoji: '🌧️', color: '#F6C6C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 5 个新词（雨、农场、灰色、安静、绵羊）。',
    trap: '元音组合只读一个长音：ai / ay 都读 /eɪ/，oa 读 /əʊ/；别把两个字母分开念。',
    summary: '《农场上的雨》：这是一个完整的小故事。读前先看词卡（雨、农场、灰色、安静、绵羊）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，讲讲这件事是怎么一步步发展的，中间卡在哪儿。',
    think: '说说下雨对农场有什么好处。',
    pre: [
      { art: '🌧️', en: 'rain', zh: '雨' },
      { art: '🚜', en: 'farm', zh: '农场' },
      { art: '🩶', en: 'gray', zh: '灰色' },
      { art: '✨', en: 'quiet', zh: '安静' },
      { art: '🐑', en: 'sheep', zh: '绵羊' },
      { art: '🌿', en: 'sky', zh: '天空' },
      { art: '🌿', en: 'grass', zh: '草' }
    ],
    sight: ['bright', 'clouds', 'water'],
    newWords: [
      { w: 'rain', zh: '雨' },
      { w: 'farm', zh: '农场' },
      { w: 'gray', zh: '灰色' },
      { w: 'quiet', zh: '安静' },
      { w: 'sheep', zh: '绵羊' }
    ],
    pages: [
      { art: 'night|ming,grandma|rain|·', en: 'Rain is on the farm. The sky is gray.', zh: '农场上在下雨。天灰灰的。' },
      { art: 'night|ming,grandma|rain|♪', en: 'The rain is cold. It falls on the trees and the grass.', zh: '雨很冷。它落在树上，也落在草上。' },
      { art: 'night|ming,grandma|rain|👀', en: 'The farm is quiet. The sheep stand by the tree.', zh: '农场很安静。绵羊站在树旁。' },
      { art: 'night|ming,grandma|rain|?', en: 'The rain falls and falls. Water runs down the path.', zh: '雨下啊下。水顺着小路流下来。' },
      { art: 'night|ming,grandma|rain|·', en: 'The farm is wet. The path is wet too.', zh: '农场湿了。小路也湿了。' },
      { art: 'night|ming,grandma|rain|!', en: 'The rain stops. The clouds go away, and the sky is clear.', zh: '雨停了。云散开，天变清了。' },
      { art: 'night|ming,grandma|rain|♥', en: 'The sun is here. The sky is bright again.', zh: '太阳出来了。天又亮了。' },
      { art: 'night|ming,grandma|rain|★', en: 'The farm is not wet now. The grass is dry.', zh: '农场现在不湿了。草干了。' },
      { art: 'night|ming,grandma|rain|…', en: 'Rain is good for the farm. The seeds can grow now.', zh: '雨对农场有好处。种子现在能长了。' },
      { art: 'night|ming,grandma|rain|·', en: 'I like the rain on the farm. I like the sun after it too.', zh: '我喜欢农场上的雨。雨后的太阳我也喜欢。' }
    ],
    quiz: [
      { q: '雨停以后，天上怎么样了？', opts: ['出了太阳，天亮了', '起了大风', '又下起雨'], a: 0, kind: 'recall' },
      { q: '下过雨以后，农场的种子为什么能长？', opts: ['因为地湿了', '因为太阳出来了', '因为羊走开了'], a: 0, kind: 'infer' },
      { q: '下雨的时候，你会怎么做？', opts: ['一直在雨里跑', '找个地方躲雨，等它停', '不管它'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b50', lv: 'L5', tag: '海边', title: 'A Boat on the Sea', zh: '海上的小船',
    emoji: '⛵', color: '#F9DFB4',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 2 个新词（小船、海）。',
    trap: '元音组合只读一个长音：ai / ay 都读 /eɪ/，oa 读 /əʊ/；别把两个字母分开念。',
    summary: '《海上的小船》：这是一个完整的小故事。读前先看词卡（小船、海）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，讲讲这件事是怎么一步步发展的，中间卡在哪儿。',
    think: '说说你见过的一艘船。',
    pre: [
      { art: '⛵', en: 'boat', zh: '小船' },
      { art: '🌊', en: 'sea', zh: '海' },
      { art: '🌿', en: 'wind', zh: '风' },
      { art: '💧', en: 'water', zh: '水' }
    ],
    sight: ['blue', 'watch', 'water'],
    newWords: [
      { w: 'boat', zh: '小船' },
      { w: 'sea', zh: '海' }
    ],
    pages: [
      { art: 'beach|lili,grandpa|boat|·', en: 'A boat is on the sea. The sea is blue.', zh: '海上有一只小船。海是蓝的。' },
      { art: 'beach|lili,grandpa|boat|♪', en: 'The boat is small. It goes up and down on the water.', zh: '小船很小。它在水面上一起一落。' },
      { art: 'beach|lili,grandpa|boat|👀', en: 'The sea is big. I stand on the sand and look.', zh: '海很大。我站在沙子上看。' },
      { art: 'beach|lili,grandpa|boat|?', en: 'The boat goes on the sea. It goes far out.', zh: '小船在海上前行。它越走越远。' },
      { art: 'beach|lili,grandpa|boat|·', en: 'The wind helps the boat. The wind is strong, so it goes fast.', zh: '风推着小船。风很大，所以它走得快。' },
      { art: 'beach|lili,grandpa|boat|!', en: 'The boat goes far. It is very small now.', zh: '小船走远了。它现在很小。' },
      { art: 'beach|lili,grandpa|boat|♥', en: 'I watch the boat. I look for a long time.', zh: '我看着小船。我看了很久。' },
      { art: 'beach|lili,grandpa|boat|★', en: 'The boat comes back. The wind brings it home.', zh: '小船回来了。风把它送回来。' },
      { art: 'beach|lili,grandpa|boat|…', en: 'A boat on the sea. The wind moves it out and back.', zh: '海上的小船。风把它送出去，又送回来。' },
      { art: 'beach|lili,grandpa|boat|·', en: 'I like the boat. I want to go on it one day.', zh: '我喜欢这只船。总有一天我想坐上去。' }
    ],
    quiz: [
      { q: '是什么把小船送回来的？', opts: ['风', '「我」', '海浪'], a: 0, kind: 'recall' },
      { q: '船在什么上面走？', opts: ['海', '河', '路'], a: 0, kind: 'infer' },
      { q: '在水边看船，你会怎么做？', opts: ['不管它', '站远一点，注意安全', '跑到水里去'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b51', lv: 'L5', tag: '夜空', title: 'The Moon and the Sheep', zh: '月亮和绵羊',
    emoji: '🌙', color: '#CDE7C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 3 个新词（月亮、圆、睡觉）。',
    trap: '元音组合只读一个长音：ai / ay 都读 /eɪ/，oa 读 /əʊ/；别把两个字母分开念。',
    summary: '《月亮和绵羊》：这是一个完整的小故事。读前先看词卡（月亮、圆、睡觉）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，讲讲这件事是怎么一步步发展的，中间卡在哪儿。',
    think: '说说月亮和绵羊：它们哪里有点像？',
    pre: [
      { art: '🌙', en: 'moon', zh: '月亮' },
      { art: '✨', en: 'round', zh: '圆' },
      { art: '🏃', en: 'sleep', zh: '睡觉' },
      { art: '🐑', en: 'sheep', zh: '绵羊' },
      { art: '🌿', en: 'hill', zh: '小山' }
    ],
    sight: ['eat', 'eyes', 'high', 'quiet', 'white'],
    newWords: [
      { w: 'moon', zh: '月亮' },
      { w: 'round', zh: '圆' },
      { w: 'sleep', zh: '睡觉' }
    ],
    pages: [
      { art: 'night|grandma,mom|moon|·', en: 'The moon is in the sky. The sky is black.', zh: '月亮在天上。天黑黑的。' },
      { art: 'night|grandma,mom|moon|♪', en: 'The moon is big. It is white and round.', zh: '月亮很大。它又白又圆。' },
      { art: 'night|grandma,mom|moon|👀', en: 'Sheep are on the hill. They stand on the grass and eat.', zh: '小山上有绵羊。它们站在草地上吃东西。' },
      { art: 'night|grandma,mom|moon|?', en: 'The sheep sleep at night. They sleep on the hill.', zh: '绵羊夜里睡觉。它们在小山上睡。' },
      { art: 'night|grandma,mom|moon|·', en: 'The moon looks at the sheep. It is high over the hill.', zh: '月亮看着绵羊。它高高挂在小山上空。' },
      { art: 'night|grandma,mom|moon|!', en: 'The sheep are quiet. They make no sound.', zh: '绵羊很安静。它们一点声音也不出。' },
      { art: 'night|grandma,mom|moon|♥', en: 'The moon is quiet too. The night is long.', zh: '月亮也很安静。夜很长。' },
      { art: 'night|grandma,mom|moon|★', en: 'The moon and the sheep. One is up, and one is on the hill.', zh: '月亮和绵羊。一个在天上，一个在小山上。' },
      { art: 'night|grandma,mom|moon|…', en: 'I like the moon at night. I look up and wait.', zh: '我喜欢夜里的月亮。我抬头看着，等着。' },
      { art: 'night|grandma,mom|moon|·', en: 'I close my eyes. The moon is still there.', zh: '我闭上眼睛。月亮还在那儿。' }
    ],
    quiz: [
      { q: '绵羊睡在哪儿？', opts: ['羊圈里', '大树下', '小山上'], a: 2, kind: 'recall' },
      { q: '夜里绵羊为什么安安静静的？', opts: ['它们在睡觉，夜也很静', '它们被月亮吓到了', '它们在等天亮'], a: 0, kind: 'infer' },
      { q: '晚上睡不着，你会怎么做？', opts: ['看看安静的月亮，慢慢静下来', '一直翻身', '开很亮的灯'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b52', lv: 'L5', tag: '种植', title: 'A Seed in a Pot', zh: '盆里的种子',
    emoji: '🌱', color: '#C6DEF6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 2 个新词（棕色、地面）。',
    trap: '元音组合只读一个长音：ai / ay 都读 /eɪ/，oa 读 /əʊ/；别把两个字母分开念。',
    summary: '《盆里的种子》：这是一个完整的小故事。读前先看词卡（棕色、地面）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，讲讲这件事是怎么一步步发展的，中间卡在哪儿。',
    think: '说说一粒种子是怎么发芽的。',
    pre: [
      { art: '🟤', en: 'brown', zh: '棕色' },
      { art: '🌿', en: 'ground', zh: '地面' },
      { art: '🍲', en: 'pot', zh: '锅' },
      { art: '🌱', en: 'seed', zh: '种子' }
    ],
    sight: ['grows', 'leaf', 'water'],
    newWords: [
      { w: 'brown', zh: '棕色' },
      { w: 'ground', zh: '地面' }
    ],
    pages: [
      { art: 'garden|grandpa,dad|seed|·', en: 'I have a pot. The pot is small and brown.', zh: '我有一个盆。盆不大，是褐色的。' },
      { art: 'garden|grandpa,dad|seed|♪', en: 'I put a seed in the pot. It goes into the ground.', zh: '我把一粒种子放进盆里。它进了土里。' },
      { art: 'garden|grandpa,dad|seed|👀', en: 'The seed is small. It looks like a stone.', zh: '种子很小。它看着像块石头。' },
      { art: 'garden|grandpa,dad|seed|?', en: 'I give it water. I put the pot in the sun.', zh: '我给它浇水。我把盆放在太阳下。' },
      { art: 'garden|grandpa,dad|seed|·', en: 'The seed is in the pot. I look at it every day.', zh: '种子在盆里。我每天都看它。' },
      { art: 'garden|grandpa,dad|seed|!', en: 'I wait and wait. I wait for a week.', zh: '我等啊等。等了一个星期。' },
      { art: 'garden|grandpa,dad|seed|♥', en: 'A stem comes up! It is small and green.', zh: '一根茎冒出来了！它又小又绿。' },
      { art: 'garden|grandpa,dad|seed|★', en: 'A leaf is up too. It is green and turns to the sun.', zh: '一片叶子也长出来了。它绿绿的，朝着太阳。' },
      { art: 'garden|grandpa,dad|seed|…', en: 'The seed grows. The pot is full of green.', zh: '种子长起来了。盆里全是绿色。' },
      { art: 'garden|grandpa,dad|seed|·', en: 'I like my pot and seed. I will water them tomorrow.', zh: '我喜欢我的盆和种子。明天我还要浇水。' }
    ],
    quiz: [
      { q: '种子最后长出了什么？', opts: ['一个果子', '一朵花', '一根茎和一片叶子'], a: 2, kind: 'recall' },
      { q: '明明等了一个星期才看到茎，说明种子发芽要什么？', opts: ['要搬到屋里', '要更多的土', '要时间，急不来'], a: 2, kind: 'infer' },
      { q: '种下一样东西，你会怎么做？', opts: ['每天挖出来看', '不管它', '浇水、耐心等它长'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b53', lv: 'L5', tag: '观察', title: 'A Tail and a Chain', zh: '尾巴和链子',
    emoji: '🐐', color: '#E0CFF3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 3 个新词（尾巴、链子、房子）。',
    trap: '元音组合只读一个长音：ai / ay 都读 /eɪ/，oa 读 /əʊ/；别把两个字母分开念。',
    summary: '《尾巴和链子》：这是一个完整的小故事。读前先看词卡（尾巴、链子、房子）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，讲讲这件事是怎么一步步发展的，中间卡在哪儿。',
    think: '说说狗的尾巴能做什么。',
    pre: [
      { art: '🐾', en: 'tail', zh: '尾巴' },
      { art: '⛓️', en: 'chain', zh: '链子' },
      { art: '🏠', en: 'house', zh: '房子' },
      { art: '🐶', en: 'dog', zh: '狗' }
    ],
    sight: ['brown', 'watch'],
    newWords: [
      { w: 'tail', zh: '尾巴' },
      { w: 'chain', zh: '链子' },
      { w: 'house', zh: '房子' }
    ],
    pages: [
      { art: 'library|mom,ming|tail|·', en: 'A dog has a tail. The dog is big and brown.', zh: '狗有一条尾巴。这只狗又大又褐。' },
      { art: 'library|mom,ming|tail|♪', en: 'The tail is long. It moves when the dog runs.', zh: '尾巴很长。狗跑的时候它就动。' },
      { art: 'library|mom,ming|tail|👀', en: 'The tail goes up and down. The dog is glad to see me.', zh: '尾巴上下摆动。狗看见我很高兴。' },
      { art: 'library|mom,ming|tail|?', en: 'The dog has a chain too. It is on the dog.', zh: '狗还有一条链子。它拴在狗身上。' },
      { art: 'library|mom,ming|tail|·', en: 'The chain is short, so the dog stays by the house.', zh: '链子不长，所以狗待在房子边。' },
      { art: 'library|mom,ming|tail|!', en: 'The dog runs and the tail goes. The chain stops it at the gate.', zh: '狗一跑尾巴就动。链子把它拦在门口。' },
      { art: 'library|mom,ming|tail|♥', en: 'I like the dog and the tail. I watch it from here.', zh: '我喜欢这只狗和它的尾巴。我从这儿看着它。' },
      { art: 'library|mom,ming|tail|★', en: 'The tail and the chain. One is part of the dog.', zh: '尾巴和链子。一个是狗身上的。' },
      { art: 'library|mom,ming|tail|…', en: 'The dog is happy. It sits and waits for me.', zh: '狗很高兴。它坐着等我。' },
      { art: 'library|mom,ming|tail|·', en: 'I am happy too. I sit with the dog.', zh: '我也很高兴。我陪着狗坐。' }
    ],
    quiz: [
      { q: '狗脖子上的链子有什么用？', opts: ['给它玩', '把它拦在门口', '拉着它走'], a: 1, kind: 'recall' },
      { q: '狗的尾巴怎么了？', opts: ['卷起来不动', '上下摆动', '掉了'], a: 1, kind: 'infer' },
      { q: '看到一只被链子拴着的狗，你会怎么做？', opts: ['去拉它的链子', '大声吓它', '轻轻看它，别靠近吓它'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b54', lv: 'L5', tag: '趣事', title: 'The Goat and a Coat', zh: '山羊和外套',
    emoji: '🧥', color: '#F6C9E3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 2 个新词（山羊、外套）。',
    trap: '元音组合只读一个长音：ai / ay 都读 /eɪ/，oa 读 /əʊ/；别把两个字母分开念。',
    summary: '《山羊和外套》：这是一个完整的小故事。读前先看词卡（山羊、外套）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，讲讲这件事是怎么一步步发展的，中间卡在哪儿。',
    think: '说说一件让你觉得暖和的衣服。',
    pre: [
      { art: '🐐', en: 'goat', zh: '山羊' },
      { art: '🧥', en: 'coat', zh: '外套' },
      { art: '🌿', en: 'hill', zh: '小山' },
      { art: '🌿', en: 'wind', zh: '风' }
    ],
    sight: ['eats', 'warm', 'wear'],
    newWords: [
      { w: 'goat', zh: '山羊' },
      { w: 'coat', zh: '外套' }
    ],
    pages: [
      { art: 'home|dad,lili|coat|·', en: 'A goat is on the hill. The wind is cold.', zh: '小山上有一只山羊。风很冷。' },
      { art: 'home|dad,lili|coat|♪', en: 'The goat is small. It eats grass on the hill.', zh: '山羊不大。它在小山上吃草。' },
      { art: 'home|dad,lili|coat|👀', en: 'I have a coat. The coat is thick and red.', zh: '我有一件外套。外套又厚又红。' },
      { art: 'home|dad,lili|coat|?', en: 'The coat is big. It is too big for me.', zh: '外套很大。它对我太大了。' },
      { art: 'home|dad,lili|coat|·', en: 'I wear the coat. I put my hands in it.', zh: '我穿上外套。我把手放进去。' },
      { art: 'home|dad,lili|coat|!', en: 'The goat is on the hill. It does not move.', zh: '山羊在小山上。它一动不动。' },
      { art: 'home|dad,lili|coat|♥', en: 'I am warm with the coat. The goat has no coat.', zh: '我穿着外套很暖。山羊没有外套。' },
      { art: 'home|dad,lili|coat|★', en: 'The goat and my coat. Both of us are warm.', zh: '山羊和我的外套。我们俩都暖和。' },
      { art: 'home|dad,lili|coat|…', en: 'I like the goat. I go up the hill to see it.', zh: '我喜欢这只山羊。我走上小山去看它。' },
      { art: 'home|dad,lili|coat|·', en: 'The goat likes the hill. It stays there all day.', zh: '山羊喜欢这座小山。它整天待在那儿。' }
    ],
    quiz: [
      { q: '「我」穿上什么才暖和起来？', opts: ['厚厚的红外套', '一顶帽子', '一条围巾'], a: 0, kind: 'recall' },
      { q: '我穿了什么？', opts: ['鞋子', '帽子', '外套'], a: 2, kind: 'infer' },
      { q: '天冷的时候，你会怎么做？', opts: ['穿上暖和的衣服', '不出门', '穿得很少'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b55', lv: 'L5', tag: '美术', title: 'Paint a Green Leaf', zh: '画一片绿叶',
    emoji: '🍃', color: '#BFE6DF',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 2 个新词（涂色、线）。',
    trap: '元音组合只读一个长音：ai / ay 都读 /eɪ/，oa 读 /əʊ/；别把两个字母分开念。',
    summary: '《画一片绿叶》：这是一个完整的小故事。读前先看词卡（涂色、线）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，讲讲这件事是怎么一步步发展的，中间卡在哪儿。',
    think: '说说你画过的一样东西。',
    pre: [
      { art: '🎨', en: 'paint', zh: '涂色' },
      { art: '📦', en: 'line', zh: '线' },
      { art: '🍃', en: 'leaf', zh: '叶子' },
      { art: '🌳', en: 'tree', zh: '树' }
    ],
    sight: ['clean', 'leaf', 'leaves', 'paper'],
    newWords: [
      { w: 'paint', zh: '涂色' },
      { w: 'line', zh: '线' }
    ],
    pages: [
      { art: 'garden|ming,grandma|leaf|·', en: 'I paint a leaf. I take a green pen.', zh: '我画一片叶子。我拿了一支绿笔。' },
      { art: 'garden|ming,grandma|leaf|♪', en: 'The leaf is green. It is from the tree by the gate.', zh: '叶子是绿的，是从门口那棵树上摘的。' },
      { art: 'garden|ming,grandma|leaf|👀', en: 'I paint it green. I go slow, so the line is clean.', zh: '我把它涂成绿色。我画得慢，所以线条干净。' },
      { art: 'garden|ming,grandma|leaf|?', en: 'I paint the stem too. The stem is thin and green.', zh: '茎我也画了。茎又细又绿。' },
      { art: 'garden|ming,grandma|leaf|·', en: 'The leaf is on my paper. It looks like a real leaf.', zh: '叶子在我的纸上。它看着像一片真叶子。' },
      { art: 'garden|ming,grandma|leaf|!', en: 'I like green leaves. They are the best part of the tree.', zh: '我喜欢绿叶。它们是树上最好看的部分。' },
      { art: 'garden|ming,grandma|leaf|♥', en: 'I paint and paint. My hands are green now.', zh: '我画啊画。我的手现在绿了。' },
      { art: 'garden|ming,grandma|leaf|★', en: 'My leaf is good. I put it on the wall.', zh: '我的叶子画得好。我把它贴在墙上。' },
      { art: 'garden|ming,grandma|leaf|…', en: 'Green leaves are nice. I want to paint a red one.', zh: '绿叶很好看。我还想画一片红的。' },
      { art: 'garden|ming,grandma|leaf|·', en: 'I like to paint. I will paint again tomorrow.', zh: '我喜欢画画。明天我还要画。' }
    ],
    quiz: [
      { q: '「我」用什么颜色的笔画叶子？', opts: ['红色的笔', '黄色的笔', '绿色的笔'], a: 2, kind: 'recall' },
      { q: '明明画得很慢，是为了什么？', opts: ['因为纸太小', '让线条干净好看', '因为笔不好用'], a: 1, kind: 'infer' },
      { q: '画画时，你会怎么做？', opts: ['乱涂几下', '想好画什么，慢慢画', '不画了'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b56', lv: 'L5', tag: '动物', title: 'Food at the Zoo', zh: '动物园的食物',
    emoji: '🦒', color: '#F2E2A8',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 1 个新词（动物园）。',
    trap: '元音组合只读一个长音：ai / ay 都读 /eɪ/，oa 读 /əʊ/；别把两个字母分开念。',
    summary: '《动物园的食物》：这是一个完整的小故事。读前先看词卡（动物园）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，讲讲这件事是怎么一步步发展的，中间卡在哪儿。',
    think: '说说你在动物园看到的一种动物。',
    pre: [
      { art: '🦁', en: 'zoo', zh: '动物园' },
      { art: '🐷', en: 'pig', zh: '猪' },
      { art: '📦', en: 'food', zh: '食物' }
    ],
    sight: ['eat', 'eats', 'laugh', 'near', 'watch'],
    newWords: [
      { w: 'zoo', zh: '动物园' }
    ],
    pages: [
      { art: 'library|lili,grandpa|zoo|·', en: 'We go to the zoo. It is not far, so we walk.', zh: '我们去动物园。路不远，所以走过去。' },
      { art: 'library|lili,grandpa|zoo|♪', en: 'The zoo has many animals. Some are big.', zh: '动物园里动物很多。有的大。' },
      { art: 'library|lili,grandpa|zoo|👀', en: 'We see a goat and a pig. The pig sits in the mud.', zh: '我们看见一只山羊和一头猪。猪坐在泥里。' },
      { art: 'library|lili,grandpa|zoo|?', en: 'The animals are hungry. They come near us.', zh: '动物们饿了。它们走近我们。' },
      { art: 'library|lili,grandpa|zoo|·', en: 'We give them food. We put it down and step back.', zh: '我们给它们食物。我们放下，然后退开。' },
      { art: 'library|lili,grandpa|zoo|!', en: 'The goat eats the food. It eats it all.', zh: '山羊吃着食物。它全吃完了。' },
      { art: 'library|lili,grandpa|zoo|♥', en: 'The pig eats too. It eats fast, so we give it more.', zh: '猪也吃。它吃得快，于是我们又给了一些。' },
      { art: 'library|lili,grandpa|zoo|★', en: 'Food at the zoo. We watch them eat and we laugh.', zh: '动物园里的食物。我们看着它们吃，笑了起来。' },
      { art: 'library|lili,grandpa|zoo|…', en: 'The animals are happy. They sit in the sun and rest.', zh: '动物们很高兴。它们坐在太阳下歇着。' },
      { art: 'library|lili,grandpa|zoo|·', en: 'We like the zoo. We want to come back next week.', zh: '我们喜欢动物园。下周还想再来。' }
    ],
    quiz: [
      { q: '我们把食物怎么给动物？', opts: ['拿在手里喂', '扔给它们', '放下食物，然后退开'], a: 2, kind: 'recall' },
      { q: '我们给动物什么了？', opts: ['水', '吃的', '玩具'], a: 1, kind: 'infer' },
      { q: '在动物园里，你会怎么做？', opts: ['乱喂东西', '按规定喂食，轻轻看它们', '大声吓它们'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b57', lv: 'L5', tag: '发音', title: 'Say It: Rain, Day', zh: '说一说：rain day',
    emoji: '🗣️', color: '#D9D2F5',
    track: 'drill',
    goal: '把本级难点音听准、说准，并能在整句里读对。认读 1 个新词（混）。',
    trap: '元音组合只读一个长音：ai / ay 都读 /eɪ/，oa 读 /əʊ/；别把两个字母分开念。',
    summary: '《说一说：rain day》：这一本练两个词的音和形。读前先看词卡（混）；读的时候先看清每个词，再连起来读一遍。',
    retell: '把这一本练的两个词再读一遍，说说它们的音哪里一样、哪里不一样。',
    think: '找两个词，一个说天气、一个说时间，读一读。',
    pre: [
      { art: '🏃', en: 'mix', zh: '混' },
      { art: '🌧️', en: 'rain', zh: '雨' },
      { art: '📦', en: 'word', zh: '词' }
    ],
    sight: ['clearly', 'water'],
    newWords: [
      { w: 'mix', zh: '混' }
    ],
    pages: [
      { art: 'table|grandma,mom|rain|·', en: 'This is "rain". It is one short word.', zh: '这是 rain。它是一个短词。' },
      { art: 'table|grandma,mom|rain|♪', en: 'This is "day". It is one short word too.', zh: '这是 day。它也是一个短词。' },
      { art: 'table|grandma,mom|rain|👀', en: 'Rain and day. Both words are easy to say.', zh: 'rain 和 day。两个词都好说。' },
      { art: 'table|grandma,mom|rain|?', en: 'Say "rain". Say it slowly and clearly.', zh: '说 rain。慢慢说，说清楚。' },
      { art: 'table|grandma,mom|rain|·', en: 'Say "day". Say it again, and keep the "d" quick.', zh: '说 day。再说一遍，d 要短促。' },
      { art: 'table|grandma,mom|rain|!', en: 'Rain is not day. One is water, and one is time.', zh: 'rain 不是 day。一个是水，一个是日子。' },
      { art: 'table|grandma,mom|rain|♥', en: 'Rain can be in the day. Both words are good.', zh: '白天下雨也可以。两个词都好。' },
      { art: 'table|grandma,mom|rain|★', en: 'You can say both. Say them one after the other.', zh: '两个词你都能说。一个接一个地说。' },
      { art: 'table|grandma,mom|rain|…', en: 'Good! Now say them fast, and do not mix them.', zh: '很好！现在说快一点，别弄混。' },
      { art: 'table|grandma,mom|rain|·', en: 'Rain, day, rain, day. Now you can read both.', zh: 'rain，day，rain，day。现在两个你都读得了。' }
    ],
    quiz: [
      { q: '这一本在练哪两个词？', opts: ['rain 和 ray', 'rain 和 day', 'day 和 bay'], a: 1, kind: 'recall' },
      { q: 'rain 和 day 里相同的音是哪个？', opts: ['结尾的音一样', 'ai 和 ay 都读 /eɪ/', '开头的音一样'], a: 1, kind: 'infer' },
      { q: '两个词放在一起，你会怎么读？', opts: ['一个一个读，再连起来', '不读了', '混在一起读'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b58', lv: 'L5', tag: '小知识', title: 'Why a Seed Needs Rain', zh: '种子为什么需要雨',
    emoji: '🌾', color: '#FAD3B6',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。不引入新词，全部是读过的词。',
    trap: '元音组合只读一个长音：ai / ay 都读 /eɪ/，oa 读 /əʊ/；别把两个字母分开念。',
    summary: '《种子为什么需要雨》：这一本从一件小事讲起，说说为什么会这样。读前先看词卡，都是学过的词；读的时候留意先看到什么、为什么会这样、后来怎么弄明白。',
    retell: '合上书，按「先看到什么 → 为什么会这样 → 后来怎么弄明白」讲一遍。',
    think: '说说雨水是怎么帮植物长大的。',
    pre: [
      { art: '🌱', en: 'seed', zh: '种子' },
      { art: '🌧️', en: 'rain', zh: '雨' }
    ],
    sight: ['ground', 'grows', 'leaf', 'water'],
    newWords: [

    ],
    pages: [
      { art: 'garden|grandpa,dad|seed|·', en: 'A seed is in the pot. The pot is in the sun.', zh: '盆里有一粒种子。盆放在太阳下。' },
      { art: 'garden|grandpa,dad|seed|♪', en: 'The seed needs rain. It needs water too.', zh: '种子需要雨。它也需要水。' },
      { art: 'garden|grandpa,dad|seed|👀', en: 'Why does a seed need rain? We can find out.', zh: '种子为什么需要雨？我们能弄明白。' },
      { art: 'garden|grandpa,dad|seed|?', en: 'Rain makes the ground wet. The water goes down.', zh: '雨把地打湿。水渗下去。' },
      { art: 'garden|grandpa,dad|seed|·', en: 'The wet ground is good. The seed can drink there.', zh: '湿的地正合适。种子能在那里喝水。' },
      { art: 'garden|grandpa,dad|seed|!', en: 'The seed drinks the water. It gets big.', zh: '种子喝水。它变大了。' },
      { art: 'garden|grandpa,dad|seed|♥', en: 'The seed grows up. A stem and a leaf come out.', zh: '种子往上长。冒出一根茎和一片叶子。' },
      { art: 'garden|grandpa,dad|seed|★', en: 'Rain helps the seed. With no rain, it stays dry.', zh: '雨帮助种子。没有雨，它就一直是干的。' },
      { art: 'garden|grandpa,dad|seed|…', en: 'A seed needs rain. It needs the sun too.', zh: '种子需要雨。它也需要太阳。' },
      { art: 'garden|grandpa,dad|seed|·', en: 'Now we know why. We give the seed water and wait.', zh: '现在我们知道为什么了。我们给种子浇水，然后等着。' }
    ],
    quiz: [
      { q: '种子为什么需要雨？', opts: ['雨把种子冲走', '雨让种子变凉', '雨把地打湿，种子才喝到水'], a: 2, kind: 'recall' },
      { q: '如果一直不下雨，盆里的种子会怎么样？', opts: ['自己跑到水里', '地一直是干的，长不出来', '长得更快'], a: 1, kind: 'infer' },
      { q: '想知道一件事为什么发生，你会怎么做？', opts: ['不管它', '随便猜', '想一想、问一问、再看看'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b59', lv: 'L5', tag: '小知识', title: 'A Week on the Farm', zh: '农场的一周',
    emoji: '🚜', color: '#C8E7F0',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。认读 3 个新词（喂、玉米、年）。',
    trap: '元音组合只读一个长音：ai / ay 都读 /eɪ/，oa 读 /əʊ/；别把两个字母分开念。',
    summary: '《农场的一周》：这一本从一件小事讲起，说说为什么会这样。读前先看词卡（喂、玉米、年）；读的时候留意先看到什么、为什么会这样、后来怎么弄明白。',
    retell: '合上书，按「先看到什么 → 为什么会这样 → 后来怎么弄明白」讲一遍。',
    think: '说说你最想在农场做的一件事。',
    pre: [
      { art: '🏃', en: 'feed', zh: '喂' },
      { art: '🌽', en: 'corn', zh: '玉米' },
      { art: '⏰', en: 'year', zh: '年' },
      { art: '🚜', en: 'farm', zh: '农场' },
      { art: '🐷', en: 'pig', zh: '猪' }
    ],
    sight: ['clean', 'eats', 'farm', 'warm', 'watch'],
    newWords: [
      { w: 'feed', zh: '喂' },
      { w: 'corn', zh: '玉米' },
      { w: 'year', zh: '年' }
    ],
    pages: [
      { art: 'farm|mom,ming|farm|·', en: 'I am on the farm for a week. The farm is big.', zh: '我在农场待一周。农场很大。' },
      { art: 'farm|mom,ming|farm|♪', en: 'One day I feed the pig. It is hungry, so it eats it all.', zh: '有一天我喂猪。它饿了，所以全吃光了。' },
      { art: 'farm|mom,ming|farm|👀', en: 'One day I wash the goat. It is clean now.', zh: '有一天我给山羊洗澡。它现在干净了。' },
      { art: 'farm|mom,ming|farm|?', en: 'One day I pick the corn. The corn is tall.', zh: '有一天我摘玉米。玉米很高。' },
      { art: 'farm|mom,ming|farm|·', en: 'One day I find an egg. It is small and warm.', zh: '有一天我找到一个蛋。它又小又温。' },
      { art: 'farm|mom,ming|farm|!', en: 'One day I watch the rain. I stay at home.', zh: '有一天我看雨。我待在家里。' },
      { art: 'farm|mom,ming|farm|♥', en: 'One day I sit on the hill. I look at the farm.', zh: '有一天我坐在小山上。我看着农场。' },
      { art: 'farm|mom,ming|farm|★', en: 'A week on the farm. Every day is different.', zh: '农场的一周。每天都不同。' },
      { art: 'farm|mom,ming|farm|…', en: 'The farm is good. I like the animals and the work.', zh: '农场真不错。我喜欢这些动物，也喜欢这些活。' },
      { art: 'farm|mom,ming|farm|·', en: 'I want to come back. I will come again next year.', zh: '我想再来。明年我还要来。' }
    ],
    quiz: [
      { q: '在农场这一周，「我」做了什么？', opts: ['喂猪、洗山羊、摘玉米', '一直待在屋里', '只喂了猪'], a: 0, kind: 'recall' },
      { q: '明明每天做的事都不一样，这样的一周他觉得怎么样？', opts: ['太累了，不想再来', '每天都一样，很无聊', '每天都有新鲜事，很有意思'], a: 2, kind: 'infer' },
      { q: '在农场待几天，你会怎么做？', opts: ['每天做一点不一样的事', '什么都不做', '天天一样'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b60', lv: 'L5', tag: '复习', title: 'All the Way Home', zh: '一路回家',
    emoji: '🏡', color: '#E8D9B5',
    track: 'review',
    goal: '把本级和前面级别的词再读一遍、串成一个故事。不引入新词，全部是读过的词。',
    trap: '元音组合只读一个长音：ai / ay 都读 /eɪ/，oa 读 /əʊ/；别把两个字母分开念。',
    summary: '《一路回家》：这是一个完整的小故事。读前先看词卡，都是学过的词；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，讲讲这件事是怎么一步步发展的，中间卡在哪儿。',
    think: '说说你走过的一条路：它通向哪里？',
    pre: [
      { art: '🛣️', en: 'road', zh: '路' },
      { art: '🏠', en: 'home', zh: '家' }
    ],
    sight: ['farm', 'house', 'tired', 'water', 'white'],
    newWords: [

    ],
    pages: [
      { art: 'library|dad,lili|road|·', en: 'I walk and I walk. The sun is hot.', zh: '我走啊走。太阳很热。' },
      { art: 'library|dad,lili|road|♪', en: 'I go down the road. It is white and dry.', zh: '我沿着路走。路面又白又干。' },
      { art: 'library|dad,lili|road|👀', en: 'The road is long. It goes by the farm.', zh: '路很长。它经过农场。' },
      { art: 'library|dad,lili|road|?', en: 'I am tired. My legs are tired too, so I go slowly.', zh: '我累了。腿也酸了，所以我慢慢走。' },
      { art: 'library|dad,lili|road|·', en: 'I sit on a stone. I rest and drink some water.', zh: '我坐在一块石头上。我歇一会儿，喝了点水。' },
      { art: 'library|dad,lili|road|!', en: 'I look at the road. It goes up the hill.', zh: '我看着这条路。它往山上走。' },
      { art: 'library|dad,lili|road|♥', en: 'I get up and walk again. I want to be home.', zh: '我站起来接着走。我想回家。' },
      { art: 'library|dad,lili|road|★', en: 'The road goes home. I can see my house.', zh: '这条路通向家。我能看见我的房子。' },
      { art: 'library|dad,lili|road|…', en: 'All the way home. The road was long.', zh: '一路回家。路很长。' },
      { art: 'library|dad,lili|road|·', en: 'I am home! Mom is there with cold water.', zh: '我到家了！妈妈在那儿，准备了凉水。' }
    ],
    quiz: [
      { q: '走到最后，「我」看见了什么？', opts: ['一座桥', '家，妈妈在那儿', '一条河'], a: 1, kind: 'recall' },
      { q: '明明为什么在石头上坐下来？', opts: ['他在等人', '石头很凉快', '他走累了，要歇一歇'], a: 2, kind: 'infer' },
      { q: '走很长的路，你会怎么做？', opts: ['不走了', '累了就歇一歇，再接着走', '一直不停，累垮'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b61', lv: 'L6', tag: '生日', title: 'A Cake for Grandma', zh: '给奶奶的蛋糕',
    emoji: '🎂', color: '#F6C6C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 2 个新词（蛋糕、好）。',
    trap: '词尾不发音的 e 会让前面的元音「报自己的名字」：cap → cape，kit → kite。',
    summary: '《给奶奶的蛋糕》：这是一个完整的小故事。读前先看词卡（蛋糕、好）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，讲讲这件事是怎么一步步发展的，中间卡在哪儿。',
    think: '说说你为家人做过的一件事。',
    pre: [
      { art: '🎂', en: 'cake', zh: '蛋糕' },
      { art: '✨', en: 'fine', zh: '好' },
      { art: '☀️', en: 'sun', zh: '太阳' },
      { art: '🥛', en: 'milk', zh: '牛奶' }
    ],
    sight: ['eats', 'high', 'piece'],
    newWords: [
      { w: 'cake', zh: '蛋糕' },
      { w: 'fine', zh: '好' }
    ],
    pages: [
      { art: 'kitchen|ming,grandma|cake|·', en: 'Ming wants to make a cake. He gets up early, before the sun is high.', zh: '明明想做一个蛋糕。他起得很早，太阳还没升高。' },
      { art: 'kitchen|ming,grandma|cake|♪', en: 'The cake is for Grandma. He does not tell her.', zh: '蛋糕是给奶奶的。他没告诉她。' },
      { art: 'kitchen|ming,grandma|cake|👀', en: 'Ming gets the things ready. He puts eggs and milk on the table, and he finds a spoon.', zh: '明明把东西准备好。他把鸡蛋和牛奶放上桌，还找了一把勺子。' },
      { art: 'kitchen|ming,grandma|cake|?', en: 'Ming mixes and makes. He mixes fast and does not look at the book.', zh: '明明又搅又做。他搅得快，也不看书。' },
      { art: 'kitchen|ming,grandma|cake|·', en: 'The cake is not right. It is thin and dry.', zh: '蛋糕不对。它又薄又干。' },
      { art: 'kitchen|ming,grandma|cake|!', en: 'Ming is sad. He sits down and does not want to try again.', zh: '明明很难过。他坐下，不想再试。' },
      { art: 'kitchen|ming,grandma|cake|♥', en: 'Grandma comes and helps. She says it is fine.', zh: '奶奶过来帮忙。她说没关系。' },
      { art: 'kitchen|ming,grandma|cake|★', en: 'They make the cake again. This time Ming is careful, and he mixes slowly.', zh: '他们又做了一次。这次明明很小心，慢慢地搅。' },
      { art: 'kitchen|ming,grandma|cake|…', en: 'This time the cake is good. It is soft and sweet.', zh: '这次蛋糕成了。它又软又甜。' },
      { art: 'kitchen|ming,grandma|cake|·', en: 'Grandma likes the cake. She eats a big piece.', zh: '奶奶喜欢这个蛋糕。她吃了一大块。' },
      { art: 'kitchen|ming,grandma|cake|♥', en: 'A cake for Grandma. The second one was good.', zh: '给奶奶的蛋糕。第二个做成功了。' }
    ],
    quiz: [
      { q: '第一个蛋糕出了什么问题？', opts: ['烤糊了', '太甜了', '又薄又干，没做好'], a: 2, kind: 'recall' },
      { q: '蛋糕是给谁的？', opts: ['爸爸', '妈妈', '奶奶'], a: 2, kind: 'infer' },
      { q: '做一件事第一次不成功，你会怎么做？', opts: ['怪别人', '找人帮帮忙，再做一次', '马上放弃'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b62', lv: 'L6', tag: '春天', title: 'The Kite by the Lake', zh: '湖边的风筝',
    emoji: '🪁', color: '#F9DFB4',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 3 个新词（风筝、湖、穿过）。',
    trap: '词尾不发音的 e 会让前面的元音「报自己的名字」：cap → cape，kit → kite。',
    summary: '《湖边的风筝》：这是一个完整的小故事。读前先看词卡（风筝、湖、穿过）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，讲讲这件事是怎么一步步发展的，中间卡在哪儿。',
    think: '说说你放风筝的一次经历。',
    pre: [
      { art: '🪁', en: 'kite', zh: '风筝' },
      { art: '🏞️', en: 'lake', zh: '湖' },
      { art: '💡', en: 'across', zh: '穿过' },
      { art: '📦', en: 'line', zh: '线' },
      { art: '🐾', en: 'tail', zh: '尾巴' }
    ],
    sight: ['blue', 'high', 'water'],
    newWords: [
      { w: 'kite', zh: '风筝' },
      { w: 'lake', zh: '湖' },
      { w: 'across', zh: '穿过' }
    ],
    pages: [
      { art: 'playground|lili,grandpa|kite|·', en: 'A kite is by the lake. The lake is calm.', zh: '湖边有一只风筝。湖面很平静。' },
      { art: 'playground|lili,grandpa|kite|♪', en: 'The kite is red and blue. It has a long tail.', zh: '风筝是红蓝两色的。它有一条长尾巴。' },
      { art: 'playground|lili,grandpa|kite|👀', en: 'Ming takes the kite. He runs to the grass, and Dad goes with him.', zh: '明明拿上风筝。他跑到草地上，爸爸跟他一起。' },
      { art: 'playground|lili,grandpa|kite|?', en: 'The wind is strong by the lake. It comes across the water.', zh: '湖边的风很大。它从水面上吹过来。' },
      { art: 'playground|lili,grandpa|kite|·', en: 'Ming runs with the kite. Dad runs behind him.', zh: '明明带着风筝跑。爸爸在后面跑。' },
      { art: 'playground|lili,grandpa|kite|!', en: 'The kite goes up! It goes up and up, and the line goes with it.', zh: '风筝飞起来了！它越飞越高，线也跟着上去。' },
      { art: 'playground|lili,grandpa|kite|♥', en: 'The kite is high in the sky. It looks small from here.', zh: '风筝高高地在天上。从这儿看它很小。' },
      { art: 'playground|lili,grandpa|kite|★', en: 'Ming holds the line. The line is thin but strong.', zh: '明明握着线。线很细，可很结实。' },
      { art: 'playground|lili,grandpa|kite|…', en: 'The kite is by the lake. It goes up and down.', zh: '风筝在湖边。它一起一落。' },
      { art: 'playground|lili,grandpa|kite|·', en: 'Ming likes the kite. He does not want to stop.', zh: '明明喜欢这只风筝。他不想停下来。' },
      { art: 'playground|lili,grandpa|kite|♥', en: 'A kite by the lake. They stay there a long time, and Ming does not let go.', zh: '湖边的风筝。他们在那里待了很久，明明一直没松手。' }
    ],
    quiz: [
      { q: '明明拿着风筝跑的时候，谁跟在后面？', opts: ['爸爸', '妈妈', '奶奶'], a: 0, kind: 'recall' },
      { q: '风筝为什么能飞得那么高？', opts: ['湖边风大，明明边跑边放', '因为风筝很大', '因为爸爸帮他举着'], a: 0, kind: 'infer' },
      { q: '想让风筝飞起来，你会怎么做？', opts: ['在屋里放', '找个有风的地方，边跑边放', '不放了'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b63', lv: 'L6', tag: '家里', title: 'A Name on the Plate', zh: '盘子上的名字',
    emoji: '🍽️', color: '#CDE7C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 1 个新词（盘子）。',
    trap: '词尾不发音的 e 会让前面的元音「报自己的名字」：cap → cape，kit → kite。',
    summary: '《盘子上的名字》：这是一个完整的小故事。读前先看词卡（盘子）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，讲讲这件事是怎么一步步发展的，中间卡在哪儿。',
    think: '说说你的名字：它有什么特别？',
    pre: [
      { art: '🍽️', en: 'plate', zh: '盘子' },
      { art: '🏷️', en: 'name', zh: '名字' }
    ],
    sight: ['carries', 'white'],
    newWords: [
      { w: 'plate', zh: '盘子' }
    ],
    pages: [
      { art: 'home|grandma,mom|name|·', en: 'A plate is on the table. It is a small white plate.', zh: '桌上有一个盘子。它是一个白色的小盘子。' },
      { art: 'home|grandma,mom|name|♪', en: 'A name is on the plate. The name is in black.', zh: '盘子上有个名字。名字是黑色的。' },
      { art: 'home|grandma,mom|name|👀', en: 'Whose name is it? Ming does not know, so he looks again.', zh: '这是谁的名字？明明不知道，于是他又看了看。' },
      { art: 'home|grandma,mom|name|?', en: 'Ming looks at the name. He reads it slowly and says it out loud.', zh: '明明看着那个名字。他慢慢读，还念出声来。' },
      { art: 'home|grandma,mom|name|·', en: 'The name is not Ming. It is not Mom, and it is not Dad.', zh: '名字不是明明。不是妈妈，也不是爸爸。' },
      { art: 'home|grandma,mom|name|!', en: 'It is Grandma\'s name. Ming sees it now, and he smiles.', zh: '这是奶奶的名字。明明现在看出来了，他笑了。' },
      { art: 'home|grandma,mom|name|♥', en: 'Ming gives the plate to Grandma. He carries it with two hands.', zh: '明明把盘子给奶奶。他双手捧着。' },
      { art: 'home|grandma,mom|name|★', en: 'Grandma is glad. She smiles and says thank you.', zh: '奶奶很高兴。她笑着道谢。' },
      { art: 'home|grandma,mom|name|…', en: 'A name on the plate. It was there from the start.', zh: '盘子上的名字。它从一开始就在那儿。' },
      { art: 'home|grandma,mom|name|·', en: 'Names can tell us things. They tell us who it is.', zh: '名字能告诉我们事情。它告诉我们这是谁的。' },
      { art: 'home|grandma,mom|name|♥', en: 'I like my name. I can write it on a plate too.', zh: '我喜欢我的名字。我也能把它写在盘子上。' }
    ],
    quiz: [
      { q: '盘子上的名字是谁的？', opts: ['奶奶的', '明明的', '妈妈的'], a: 0, kind: 'recall' },
      { q: '明明看到名字以后，为什么笑了？', opts: ['因为盘子很好看', '那是奶奶的名字，他认出来了', '因为名字写错了'], a: 1, kind: 'infer' },
      { q: '想知道一样东西是谁的，你会怎么做？', opts: ['自己拿走', '看看上面的名字，或问一问', '不管它'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b64', lv: 'L6', tag: '运动', title: 'Ride a Bike', zh: '骑自行车',
    emoji: '🚲', color: '#C6DEF6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 2 个新词（自行车、骑）。',
    trap: '词尾不发音的 e 会让前面的元音「报自己的名字」：cap → cape，kit → kite。',
    summary: '《骑自行车》：这是一个完整的小故事。读前先看词卡（自行车、骑）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，讲讲这件事是怎么一步步发展的，中间卡在哪儿。',
    think: '说说你学会过的一样新本领。',
    pre: [
      { art: '🚲', en: 'bike', zh: '自行车' },
      { art: '🏃', en: 'ride', zh: '骑' },
      { art: '🧢', en: 'cap', zh: '鸭舌帽' },
      { art: '🛣️', en: 'road', zh: '路' }
    ],
    sight: [],
    newWords: [
      { w: 'bike', zh: '自行车' },
      { w: 'ride', zh: '骑' }
    ],
    pages: [
      { art: 'street|grandpa,dad|bike|·', en: 'Dad has a bike. It is red and new.', zh: '爸爸有一辆自行车。它是红色的，还很新。' },
      { art: 'street|grandpa,dad|bike|♪', en: 'The bike is big. It is too big for Ming, but he wants to try.', zh: '车很大。它对明明太大了，可他想试试。' },
      { art: 'street|grandpa,dad|bike|👀', en: 'Ming wants to ride it. He puts on his cap and goes out.', zh: '明明想骑。他戴上帽子出了门。' },
      { art: 'street|grandpa,dad|bike|?', en: 'Ming gets on the bike. Dad holds the back.', zh: '明明上了车。爸爸扶着后座。' },
      { art: 'street|grandpa,dad|bike|·', en: 'The bike goes. It goes slowly at first, and Ming holds on.', zh: '车走了。一开始很慢，明明紧紧抓着。' },
      { art: 'street|grandpa,dad|bike|!', en: 'Ming rides and rides. He looks at the road, and he does not look down.', zh: '明明骑啊骑。他看着路，不看脚。' },
      { art: 'street|grandpa,dad|bike|♥', en: 'Ming does not fall. He is careful, so the bike stays up.', zh: '明明没摔倒。他很小心，所以车稳稳的。' },
      { art: 'street|grandpa,dad|bike|★', en: 'Dad runs with the bike. He does not let go.', zh: '爸爸跟着车跑。他没有松手。' },
      { art: 'street|grandpa,dad|bike|…', en: 'Ming can ride the bike! Dad lets go, and Ming goes on.', zh: '明明会骑车了！爸爸松开手，明明继续往前。' },
      { art: 'street|grandpa,dad|bike|·', en: 'Ride a bike. It is hard at first, and then it is easy.', zh: '骑自行车。一开始难，后来就容易了。' },
      { art: 'street|grandpa,dad|bike|♥', en: 'Ming likes the bike. He wants to ride again tomorrow.', zh: '明明喜欢这辆车。明天他还想骑。' }
    ],
    quiz: [
      { q: '爸爸一直扶着自行车的哪儿？', opts: ['车把', '车轮', '车后面（后座）'], a: 2, kind: 'recall' },
      { q: '谁跟着车跑？', opts: ['妈妈', '奶奶', '爸爸'], a: 2, kind: 'infer' },
      { q: '学骑车（学一样新本领），你会怎么做？', opts: ['一次就想学会', '不学了', '找人扶着，慢慢练'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b65', lv: 'L6', tag: '花园', title: 'A Rose at the Gate', zh: '门口的玫瑰',
    emoji: '🌹', color: '#E0CFF3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 1 个新词（玫瑰）。',
    trap: '词尾不发音的 e 会让前面的元音「报自己的名字」：cap → cape，kit → kite。',
    summary: '《门口的玫瑰》：这是一个完整的小故事。读前先看词卡（玫瑰）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，讲讲这件事是怎么一步步发展的，中间卡在哪儿。',
    think: '说说你见过的一种花。',
    pre: [
      { art: '🌹', en: 'rose', zh: '玫瑰' },
      { art: '📍', en: 'gate', zh: '大门' },
      { art: '☀️', en: 'sun', zh: '太阳' }
    ],
    sight: ['bright', 'grows', 'water'],
    newWords: [
      { w: 'rose', zh: '玫瑰' }
    ],
    pages: [
      { art: 'garden|mom,ming|rose|·', en: 'A rose is at the gate. Ming sees it first.', zh: '门口有一朵玫瑰。明明最先看见它。' },
      { art: 'garden|mom,ming|rose|♪', en: 'The rose is red. It is small but very bright.', zh: '玫瑰是红的。它不大，可很亮眼。' },
      { art: 'garden|mom,ming|rose|👀', en: 'The rose is nice. It smells sweet, and the bees come.', zh: '玫瑰很好看。它闻着甜，蜜蜂也来了。' },
      { art: 'garden|mom,ming|rose|?', en: 'Ming looks at the rose. He looks for the best one.', zh: '明明看着玫瑰。他在找最好的一朵。' },
      { art: 'garden|mom,ming|rose|·', en: 'The rose grows at the gate. It gets the sun all day.', zh: '玫瑰长在门口。它整天都晒得到太阳。' },
      { art: 'garden|mom,ming|rose|!', en: 'Grandma likes the rose. She stops to look at it.', zh: '奶奶喜欢这朵玫瑰。她停下来看它。' },
      { art: 'garden|mom,ming|rose|♥', en: 'The rose is for Grandma. Ming picks it carefully.', zh: '这朵玫瑰是给奶奶的。明明小心地摘下来。' },
      { art: 'garden|mom,ming|rose|★', en: 'Ming gives the rose to Grandma. He puts it in her hand.', zh: '明明把玫瑰给奶奶。他放到她手里。' },
      { art: 'garden|mom,ming|rose|…', en: 'A rose at the gate. It was the best one there.', zh: '门口的玫瑰。那是那儿最好的一朵。' },
      { art: 'garden|mom,ming|rose|·', en: 'The rose makes Grandma glad. She puts it in water.', zh: '这朵玫瑰让奶奶很高兴。她把它插进水里。' },
      { art: 'garden|mom,ming|rose|♥', en: 'Ming looks at the rose one more time. Then he goes in.', zh: '明明又看了那朵玫瑰一眼。然后走进屋。' }
    ],
    quiz: [
      { q: '明明摘玫瑰是要给谁？', opts: ['奶奶', '老师', '妈妈'], a: 0, kind: 'recall' },
      { q: '明明为什么挑最好的一朵摘下来？', opts: ['因为那朵最便宜', '因为别的都枯了', '因为这朵要送给奶奶'], a: 2, kind: 'infer' },
      { q: '送一朵花给别人，你会怎么做？', opts: ['挑一朵好的，亲手送给他', '随便摘一朵', '不送了'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b66', lv: 'L6', tag: '发现', title: 'A Note in a Book', zh: '书里的纸条',
    emoji: '📝', color: '#F6C9E3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 1 个新词（纸条）。',
    trap: '词尾不发音的 e 会让前面的元音「报自己的名字」：cap → cape，kit → kite。',
    summary: '《书里的纸条》：这是一个完整的小故事。读前先看词卡（纸条）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，讲讲这件事是怎么一步步发展的，中间卡在哪儿。',
    think: '说说你写过或收到过的一张小纸条。',
    pre: [
      { art: '📝', en: 'note', zh: '纸条' },
      { art: '📖', en: 'book', zh: '书' },
      { art: '🏷️', en: 'name', zh: '名字' }
    ],
    sight: ['knows', 'paper', 'writes', 'yellow'],
    newWords: [
      { w: 'note', zh: '纸条' }
    ],
    pages: [
      { art: 'home|dad,lili|note|·', en: 'A book is on the desk. It is an old thick book.', zh: '桌上有一本书。它是一本又旧又厚的书。' },
      { art: 'home|dad,lili|note|♪', en: 'Ming opens the book. He wants to read.', zh: '明明打开书。他想读。' },
      { art: 'home|dad,lili|note|👀', en: 'A note is in the book! It falls out.', zh: '书里有一张纸条！它掉了出来。' },
      { art: 'home|dad,lili|note|?', en: 'The note is small. The paper is yellow and soft.', zh: '纸条很小。纸是黄的，软软的。' },
      { art: 'home|dad,lili|note|·', en: 'Ming reads the note. He says the words out loud.', zh: '明明读这张纸条。他把字念出声来。' },
      { art: 'home|dad,lili|note|!', en: 'The note says "Hello". There is a name too.', zh: '纸条上写着「你好」。还有一个名字。' },
      { art: 'home|dad,lili|note|♥', en: 'Who wrote the note? Ming reads the name.', zh: '这纸条是谁写的？明明读那个名字。' },
      { art: 'home|dad,lili|note|★', en: 'It was Grandma. Ming sees her name and knows.', zh: '是奶奶写的。明明看见她的名字就明白了。' },
      { art: 'home|dad,lili|note|…', en: 'A note in a book. It was there a long time.', zh: '书里的纸条。它在那儿放很久了。' },
      { art: 'home|dad,lili|note|·', en: 'Ming writes a note too. He puts it in the same book.', zh: '明明也写了一张纸条。他放进同一本书里。' },
      { art: 'home|dad,lili|note|♥', en: 'Notes are fun. Grandma will find it and write back.', zh: '纸条很好玩。奶奶会发现它，然后回一张。' }
    ],
    quiz: [
      { q: '书里那张纸条上写着什么？', opts: ['「你好」，还有一个名字', '一幅小画', '一串电话号码'], a: 0, kind: 'recall' },
      { q: '书里夹着一张写着「你好」的纸条，说明这本书怎么样？', opts: ['以前有人读过，还留了话', '不是明明的', '是刚买的新书'], a: 0, kind: 'infer' },
      { q: '在书里发现一张纸条，你会怎么做？', opts: ['不看', '读一读，想想是谁写的', '扔掉'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b67', lv: 'L6', tag: '玩耍', title: 'Make a Game', zh: '做个游戏',
    emoji: '🎲', color: '#BFE6DF',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 3 个新词（游戏、木板、反正）。',
    trap: '词尾不发音的 e 会让前面的元音「报自己的名字」：cap → cape，kit → kite。',
    summary: '《做个游戏》：这是一个完整的小故事。读前先看词卡（游戏、木板、反正）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，讲讲这件事是怎么一步步发展的，中间卡在哪儿。',
    think: '说说你最喜欢玩的一个游戏。',
    pre: [
      { art: '🎲', en: 'game', zh: '游戏' },
      { art: '📋', en: 'board', zh: '木板' },
      { art: '💡', en: 'anyway', zh: '反正' },
      { art: '🏷️', en: 'name', zh: '名字' },
      { art: '📦', en: 'paper', zh: '纸' }
    ],
    sight: ['laugh', 'paper', 'writes'],
    newWords: [
      { w: 'game', zh: '游戏' },
      { w: 'board', zh: '木板' },
      { w: 'anyway', zh: '反正' }
    ],
    pages: [
      { art: 'playground|ming,grandma|game|·', en: 'Ming wants to make a game. It is a wet day.', zh: '明明想做一个游戏。这天在下雨。' },
      { art: 'playground|ming,grandma|game|♪', en: 'The game is for the family. He writes it on paper, with a name at the top.', zh: '这个游戏是给全家的。他写在纸上，顶上还写了名字。' },
      { art: 'playground|ming,grandma|game|👀', en: 'Ming makes the game. He uses paper and a pen, and he makes a small board.', zh: '明明做起游戏来。他用纸和笔，还做了一块小木板。' },
      { art: 'playground|ming,grandma|game|?', en: 'The game has a name. They all like the name, and they say it out loud.', zh: '游戏有个名字。大家都喜欢，还一起念出来。' },
      { art: 'playground|ming,grandma|game|·', en: 'They play the game. They sit around the table, and Dad goes first.', zh: '他们玩起游戏。围着桌子坐，爸爸先来。' },
      { art: 'playground|ming,grandma|game|!', en: 'The game is fun. Grandpa laughs first, and then all of them laugh.', zh: '游戏很好玩。爷爷先笑，然后大家都笑了。' },
      { art: 'playground|ming,grandma|game|♥', en: 'Grandma wins the game. Ming claps for her.', zh: '奶奶赢了。明明为她鼓掌。' },
      { art: 'playground|ming,grandma|game|★', en: 'Ming is glad anyway. He wants to play again.', zh: '明明还是很高兴。他想再玩一次。' },
      { art: 'playground|ming,grandma|game|…', en: 'Make a game. It is not hard, and it is fun.', zh: '做个游戏。不难，还很好玩。' },
      { art: 'playground|ming,grandma|game|·', en: 'They play again. This time Ming wins, and he is glad.', zh: '他们又玩了一局。这次明明赢了，他很高兴。' },
      { art: 'playground|ming,grandma|game|♥', en: 'A game for the family. They will play it again next wet day.', zh: '全家的游戏。下一个雨天他们还要玩。' }
    ],
    quiz: [
      { q: '第一局游戏谁赢了？', opts: ['奶奶', '爸爸', '爷爷'], a: 0, kind: 'recall' },
      { q: '谁赢了这局游戏？', opts: ['奶奶', '明明', '爸爸'], a: 0, kind: 'infer' },
      { q: '自己做一样游戏，你会怎么做？', opts: ['只让自己赢', '想好规则，和大家一起玩', '不做了'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b68', lv: 'L6', tag: '故事', title: 'The Brave Little Mouse', zh: '勇敢的小老鼠',
    emoji: '🐭', color: '#F2E2A8',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 3 个新词（老鼠、洞、勇敢）。',
    trap: '词尾不发音的 e 会让前面的元音「报自己的名字」：cap → cape，kit → kite。',
    summary: '《勇敢的小老鼠》：这是一个完整的小故事。读前先看词卡（老鼠、洞、勇敢）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，讲讲这件事是怎么一步步发展的，中间卡在哪儿。',
    think: '说说小老鼠是怎么躲开猫的。',
    pre: [
      { art: '🐭', en: 'mouse', zh: '老鼠' },
      { art: '🕳️', en: 'hole', zh: '洞' },
      { art: '✨', en: 'brave', zh: '勇敢' },
      { art: '🍞', en: 'bread', zh: '面包' },
      { art: '🍳', en: 'kitchen', zh: '厨房' }
    ],
    sight: ['bread', 'eats', 'kitchen', 'near', 'quiet'],
    newWords: [
      { w: 'mouse', zh: '老鼠' },
      { w: 'hole', zh: '洞' },
      { w: 'brave', zh: '勇敢' }
    ],
    pages: [
      { art: 'library|lili,grandpa|mouse|·', en: 'A little mouse is here. It stands in the kitchen near the bread.', zh: '这儿有一只小老鼠。它站在厨房里，就在面包旁边。' },
      { art: 'library|lili,grandpa|mouse|♪', en: 'The mouse is small. Its tail is long.', zh: '老鼠很小。它的尾巴很长。' },
      { art: 'library|lili,grandpa|mouse|👀', en: 'The mouse is not afraid. It looks for food, and it goes here and there.', zh: '老鼠不怕。它找吃的，四处跑。' },
      { art: 'library|lili,grandpa|mouse|?', en: 'It smells the bread, so it comes near.', zh: '它闻到面包的味道，于是走近了。' },
      { art: 'library|lili,grandpa|mouse|·', en: 'A cat is here too! It comes in slowly.', zh: '这儿还有一只猫！它慢慢走进来。' },
      { art: 'library|lili,grandpa|mouse|!', en: 'The mouse runs fast. It runs to the hole and does not look back.', zh: '老鼠飞快地跑。它跑向洞口，头也不回。' },
      { art: 'library|lili,grandpa|mouse|♥', en: 'The mouse hides in the hole. It waits and does not move.', zh: '老鼠躲进洞里。它等着，一动不动。' },
      { art: 'library|lili,grandpa|mouse|★', en: 'The cat goes away. The kitchen is quiet again, and the bread is still there.', zh: '猫走了。厨房又安静了，面包还在那儿。' },
      { art: 'library|lili,grandpa|mouse|…', en: 'The mouse comes out. It finds the bread.', zh: '老鼠出来了。它找到了面包。' },
      { art: 'library|lili,grandpa|mouse|·', en: 'The brave little mouse. It was quick, and it was careful too.', zh: '勇敢的小老鼠。它跑得快，也很小心。' },
      { art: 'library|lili,grandpa|mouse|♥', en: 'The mouse is safe. It eats the bread now, and then it goes home.', zh: '老鼠安全了。它现在吃面包，吃完就回家。' }
    ],
    quiz: [
      { q: '老鼠躲进洞里，是因为谁来了？', opts: ['人', '猫', '狗'], a: 1, kind: 'recall' },
      { q: '老鼠跑得飞快、马上躲起来，说明它怎么样？', opts: ['不怕猫，但也很小心', '一点也不怕', '已经跑不动了'], a: 0, kind: 'infer' },
      { q: '遇到危险，你会怎么做？', opts: ['追上去', '站在原地', '快点躲到安全的地方，找大人帮忙'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b69', lv: 'L6', tag: '发音', title: 'Say It: Cap, Cape', zh: '说一说：cap cape',
    emoji: '🗣️', color: '#D9D2F5',
    track: 'drill',
    goal: '把本级难点音听准、说准，并能在整句里读对。认读 1 个新词（斗篷）。',
    trap: '词尾不发音的 e 会让前面的元音「报自己的名字」：cap → cape，kit → kite。',
    summary: '《说一说：cap cape》：这一本练两个词的音和形。读前先看词卡（斗篷）；读的时候先看清每个词，再连起来读一遍。',
    retell: '把这一本练的两个词再读一遍，说说它们的音哪里一样、哪里不一样。',
    think: '找两个只差一个 e 的词，读一读、比一比。',
    pre: [
      { art: '📦', en: 'cape', zh: '斗篷' },
      { art: '🧢', en: 'cap', zh: '鸭舌帽' },
      { art: '📦', en: 'word', zh: '词' }
    ],
    sight: ['quiet'],
    newWords: [
      { w: 'cape', zh: '斗篷' }
    ],
    pages: [
      { art: 'table|grandma,mom|cap|·', en: 'This is a cap. It is a short word.', zh: '这是 cap。它是一个短词。' },
      { art: 'table|grandma,mom|cap|♪', en: 'This is a cape. It is a longer word.', zh: '这是 cape。它是一个长一点的词。' },
      { art: 'table|grandma,mom|cap|👀', en: 'Cap and cape. The two words look almost the same.', zh: 'cap 和 cape。两个词看着差不多。' },
      { art: 'table|grandma,mom|cap|?', en: 'The "e" makes the "a" say its name. Listen to both words.', zh: '那个 e 让 a 读出自己的名字。听听这两个词。' },
      { art: 'table|grandma,mom|cap|·', en: 'Say "cap". Say it slowly, and keep the "a" short.', zh: '说 cap。慢慢说，a 要短。' },
      { art: 'table|grandma,mom|cap|!', en: 'Say "cape". Say it again, and hold the "a" longer.', zh: '说 cape。再说一遍，a 拖长一点。' },
      { art: 'table|grandma,mom|cap|♥', en: 'Cap is not cape. One is short and one is long.', zh: 'cap 不是 cape。一个短，一个长。' },
      { art: 'table|grandma,mom|cap|★', en: 'The "e" changes the sound. One little "e" does it.', zh: '那个 e 改变了读音。就一个小 e 就够了。' },
      { art: 'table|grandma,mom|cap|…', en: 'You can say both. Say cap, then cape, then cap.', zh: '两个你都能说。说 cap，再说 cape，再说 cap。' },
      { art: 'table|grandma,mom|cap|·', en: 'Cap, cape! Now you can hear the difference.', zh: 'cap，cape！现在你听得出不同了。' },
      { art: 'table|grandma,mom|cap|♥', en: 'Good! Find one more word with a quiet "e".', zh: '很好！再找一个结尾有不发音 e 的词。' }
    ],
    quiz: [
      { q: '结尾那个「e」做了什么？', opts: ['让词变短了', '让 a 读出自己的名字，读音变了', '什么也没做'], a: 1, kind: 'recall' },
      { q: '结尾加了一个 e，cap 变成了什么？', opts: ['cape，中间的 a 读本音', 'cap 的意思变了', '读音一点没变'], a: 0, kind: 'infer' },
      { q: '两个词只差一个 e，你会怎么分清？', opts: ['看清楚有没有 e，读准音', '不读了', '随便读一个'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b70', lv: 'L6', tag: '小知识', title: 'Why a Cake Rises', zh: '蛋糕为什么会鼓起来',
    emoji: '🧁', color: '#FAD3B6',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。认读 3 个新词（升起、热、空气）。',
    trap: '词尾不发音的 e 会让前面的元音「报自己的名字」：cap → cape，kit → kite。',
    summary: '《蛋糕为什么会鼓起来》：这一本从一件小事讲起，说说为什么会这样。读前先看词卡（升起、热、空气）；读的时候留意先看到什么、为什么会这样、后来怎么弄明白。',
    retell: '合上书，按「先看到什么 → 为什么会这样 → 后来怎么弄明白」讲一遍。',
    think: '说说你见过的一种会「鼓起来」的东西。',
    pre: [
      { art: '🏃', en: 'rise', zh: '升起' },
      { art: '🌿', en: 'heat', zh: '热' },
      { art: '🌿', en: 'air', zh: '空气' },
      { art: '🎂', en: 'cake', zh: '蛋糕' },
      { art: '📦', en: 'pan', zh: '平底锅' }
    ],
    sight: ['bigger', 'brown', 'high', 'piece', 'warm', 'watches'],
    newWords: [
      { w: 'rise', zh: '升起' },
      { w: 'heat', zh: '热' },
      { w: 'air', zh: '空气' }
    ],
    pages: [
      { art: 'kitchen|grandpa,dad|cake|·', en: 'Ming makes a cake. He puts it in a pan.', zh: '明明做蛋糕。他把它放进平底锅。' },
      { art: 'kitchen|grandpa,dad|cake|♪', en: 'The cake goes in the hot place. It is hot in there.', zh: '蛋糕进了热的地方。里面很热。' },
      { art: 'kitchen|grandpa,dad|cake|👀', en: 'Why does a cake rise? Ming wants to know.', zh: '蛋糕为什么会鼓起来？明明想知道。' },
      { art: 'kitchen|grandpa,dad|cake|?', en: 'The heat makes it rise. The hot air inside gets big.', zh: '热让它鼓起来。里面的热气变大了。' },
      { art: 'kitchen|grandpa,dad|cake|·', en: 'The cake gets bigger. Ming watches it and does not go away.', zh: '蛋糕变大了。明明看着它，没有走开。' },
      { art: 'kitchen|grandpa,dad|cake|!', en: 'The cake is high now. It is soft and brown on top.', zh: '蛋糕现在很高了。它很软，上面是褐色的。' },
      { art: 'kitchen|grandpa,dad|cake|♥', en: 'Ming looks at the cake. He is glad, and he tells Grandma.', zh: '明明看着蛋糕。他很高兴，叫来了奶奶。' },
      { art: 'kitchen|grandpa,dad|cake|★', en: 'The cake is good. It smells sweet and it is warm.', zh: '蛋糕烤得正好。它闻着甜，还热着。' },
      { art: 'kitchen|grandpa,dad|cake|…', en: 'A cake rises with heat. That is why we use the hot place.', zh: '蛋糕靠热鼓起来。所以我们才用那个热的地方。' },
      { art: 'kitchen|grandpa,dad|cake|·', en: 'Why a cake rises. Now Ming can tell Grandma.', zh: '蛋糕为什么会鼓。现在明明能讲给奶奶听了。' },
      { art: 'kitchen|grandpa,dad|cake|♥', en: 'Ming likes the cake. He cuts a piece for Grandma.', zh: '明明喜欢这个蛋糕。他给奶奶切了一块。' }
    ],
    quiz: [
      { q: '蛋糕为什么会鼓起来？', opts: ['里面的热气变大，把它顶起来', '因为放了糖', '因为锅很大'], a: 0, kind: 'recall' },
      { q: '蛋糕放进热的地方，会怎么样？', opts: ['变小变硬', '鼓起来，又高又软', '没有一点变化'], a: 1, kind: 'infer' },
      { q: '想知道一件事为什么发生，你会怎么做？', opts: ['瞎猜', '不管它', '想一想、查一查、试一试'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b71', lv: 'L6', tag: '小知识', title: 'A Hole in the Rope', zh: '绳子上的洞',
    emoji: '🪢', color: '#C8E7F0',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。认读 1 个新词（绳子）。',
    trap: '词尾不发音的 e 会让前面的元音「报自己的名字」：cap → cape，kit → kite。',
    summary: '《绳子上的洞》：这一本从一件小事讲起，说说为什么会这样。读前先看词卡（绳子）；读的时候留意先看到什么、为什么会这样、后来怎么弄明白。',
    retell: '合上书，按「先看到什么 → 为什么会这样 → 后来怎么弄明白」讲一遍。',
    think: '说说你修过或看过别人修的一样东西。',
    pre: [
      { art: '🪢', en: 'rope', zh: '绳子' },
      { art: '🕳️', en: 'hole', zh: '洞' },
      { art: '🌳', en: 'tree', zh: '树' }
    ],
    sight: ['break', 'care', 'light'],
    newWords: [
      { w: 'rope', zh: '绳子' }
    ],
    pages: [
      { art: 'home|mom,ming|hole|·', en: 'A rope is here. It is thick and long.', zh: '这儿有一根绳子。它又粗又长。' },
      { art: 'home|mom,ming|hole|♪', en: 'The rope is long. It goes from the wall to the tree.', zh: '绳子很长。它从墙那边一直拉到树上。' },
      { art: 'home|mom,ming|hole|👀', en: 'There is a hole in the rope. Ming finds it when he pulls.', zh: '绳子上有个洞。明明一拉就发现了。' },
      { art: 'home|mom,ming|hole|?', en: 'The hole is small. But it is deep.', zh: '洞很小。可它很深。' },
      { art: 'home|mom,ming|hole|·', en: 'Ming looks at the hole. He holds it up to the light.', zh: '明明看着这个洞。他把它举到光下。' },
      { art: 'home|mom,ming|hole|!', en: 'The rope is not strong now. It may break.', zh: '绳子现在不结实了。它可能会断。' },
      { art: 'home|mom,ming|hole|♥', en: 'Ming fixes the hole. He mends it with care.', zh: '明明把洞补好。他补得很小心。' },
      { art: 'home|mom,ming|hole|★', en: 'The rope is strong again. He uses it and it holds.', zh: '绳子又结实了。他用它，它撑得住。' },
      { art: 'home|mom,ming|hole|…', en: 'A hole in the rope. It made the rope not strong.', zh: '绳子上的洞。它让绳子变弱了。' },
      { art: 'home|mom,ming|hole|·', en: 'Ming is careful with the rope. He looks at it first.', zh: '明明对绳子很小心。他先看一看。' },
      { art: 'home|mom,ming|hole|♥', en: 'Ming puts the rope back on the wall. Now it will hold.', zh: '明明把绳子挂回墙上。这下它撑得住了。' }
    ],
    quiz: [
      { q: '绳子上的洞带来什么麻烦？', opts: ['绳子不结实了，可能会断', '绳子变长了', '绳子变短了'], a: 0, kind: 'recall' },
      { q: '绳子怎么了？', opts: ['太长了', '太短了', '上面有个洞，不结实了'], a: 2, kind: 'infer' },
      { q: '东西坏了，你会怎么做？', opts: ['看看能不能修好，修不好再想别的办法', '不管它', '直接扔掉'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b72', lv: 'L6', tag: '复习', title: 'The Same Plate', zh: '同一个盘子',
    emoji: '🍽️', color: '#E8D9B5',
    track: 'review',
    goal: '把本级和前面级别的词再读一遍、串成一个故事。不引入新词，全部是读过的词。',
    trap: '词尾不发音的 e 会让前面的元音「报自己的名字」：cap → cape，kit → kite。',
    summary: '《同一个盘子》：这是一个完整的小故事。读前先看词卡，都是学过的词；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，讲讲这件事是怎么一步步发展的，中间卡在哪儿。',
    think: '说说两样很像、但有大小差别的东西。',
    pre: [
      { art: '🍽️', en: 'plate', zh: '盘子' },
      { art: '📦', en: 'food', zh: '食物' }
    ],
    sight: ['clean'],
    newWords: [

    ],
    pages: [
      { art: 'library|dad,lili|plate|·', en: 'Two plates are on the table. They are both clean.', zh: '桌上有两个盘子。它们都干净。' },
      { art: 'library|dad,lili|plate|♪', en: 'One plate is big. It is for Ming.', zh: '一个盘子很大。是给明明的。' },
      { art: 'library|dad,lili|plate|👀', en: 'One plate is small. It is for Grandma.', zh: '一个盘子很小。是给奶奶的。' },
      { art: 'library|dad,lili|plate|?', en: 'They are not the same. One is big and one is small.', zh: '它们不一样。一个大，一个小。' },
      { art: 'library|dad,lili|plate|·', en: 'But they are both plates. Both can hold food.', zh: '可它们都是盘子。两个都能盛东西。' },
      { art: 'library|dad,lili|plate|!', en: 'Ming looks at the two plates. He puts them together.', zh: '明明看着这两个盘子。他把它们放在一起。' },
      { art: 'library|dad,lili|plate|♥', en: 'One big, one small. They look like a family.', zh: '一个大，一个小。它们像一家人。' },
      { art: 'library|dad,lili|plate|★', en: 'Ming uses the big plate. He puts rice on it.', zh: '明明用大盘子。他在里面盛了饭。' },
      { art: 'library|dad,lili|plate|…', en: 'Grandma uses the small one. She puts a cake on it.', zh: '奶奶用小盘子。她在里面放了一块蛋糕。' },
      { art: 'library|dad,lili|plate|·', en: 'The same plate. Two plates can be the same.', zh: '同一个盘子。两个盘子可以是一样的。' },
      { art: 'library|dad,lili|plate|♥', en: 'Big and small, both are plates. Both hold a good lunch.', zh: '大的小的都是盘子。两个都能盛一顿好午饭。' }
    ],
    quiz: [
      { q: '两个盘子哪里不一样？', opts: ['颜色不一样', '大小不一样', '一个是碗'], a: 1, kind: 'recall' },
      { q: '一个大盘子一个小盘子，为什么都能用？', opts: ['因为一个能装一个不能', '因为它们一样大', '都是盘子，都能盛东西'], a: 2, kind: 'infer' },
      { q: '两样东西很像但有差别，你会怎么做？', opts: ['不管它', '只看一个', '看一看哪里不一样，再说一说'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b73', lv: 'L7', tag: '通信', title: 'The Letter from the Farm', zh: '农场来的信',
    emoji: '✉️', color: '#F6C6C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 3 个新词（画、图画、夏天）。',
    trap: '美音里元音后的 r 一定要卷舌读出来：car、bird、water 都不能吞掉 r。',
    summary: '《农场来的信》：这是一个完整的小故事。读前先看词卡（画、图画、夏天）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，按做事情的顺序讲一遍，至少用上三个本本词卡。',
    think: '说说你写过或收到过的一封信。',
    pre: [
      { art: '🏃', en: 'draw', zh: '画' },
      { art: '🖼️', en: 'picture', zh: '图画' },
      { art: '⏰', en: 'summer', zh: '夏天' },
      { art: '✉️', en: 'letter', zh: '信' },
      { art: '🚜', en: 'farm', zh: '农场' }
    ],
    sight: ['draws', 'light', 'writes'],
    newWords: [
      { w: 'draw', zh: '画' },
      { w: 'picture', zh: '图画' },
      { w: 'summer', zh: '夏天' }
    ],
    pages: [
      { art: 'home|ming,grandma|letter|·', en: 'Grandma is on the farm. She is there for a week, so she has time to write.', zh: '奶奶在农场。她要在那儿待一周，所以有时间写信。' },
      { art: 'home|ming,grandma|letter|♪', en: 'Grandma writes a letter. She sits at the desk because the light is good.', zh: '奶奶写信。她坐在书桌前，因为光线好。' },
      { art: 'home|ming,grandma|letter|👀', en: 'The letter is for Ming. She writes his name on it.', zh: '信是写给明明的。她把他的名字写在上面。' },
      { art: 'home|ming,grandma|letter|?', en: 'The letter comes to Ming. Dad brings it home after work.', zh: '信到了明明手上。爸爸下班后把它带回家。' },
      { art: 'home|ming,grandma|letter|·', en: 'Ming reads the letter. He reads it slowly.', zh: '明明读信。他慢慢读。' },
      { art: 'home|ming,grandma|letter|!', en: 'The letter says the farm is good. It says the rain came, so the corn is tall.', zh: '信上说农场一切都好。信上说下了雨，所以玉米长得很高。' },
      { art: 'home|ming,grandma|letter|♥', en: 'Ming reads it out loud: "The goat is big now!" He laughs.', zh: '明明大声念出来：「山羊现在很大了！」他笑了。' },
      { art: 'home|ming,grandma|letter|★', en: 'Ming writes back to Grandma. He tells her about school, and he draws a small picture.', zh: '明明给奶奶回信。他讲学校的事，还画了一幅小画。' },
      { art: 'home|ming,grandma|letter|…', en: 'Ming says he is happy. He asks her to come home soon.', zh: '明明说自己一切都好。他请她早点回家。' },
      { art: 'home|ming,grandma|letter|·', en: 'A letter from the farm. It came a long way.', zh: '农场来的信。它走了很远的路。' },
      { art: 'home|ming,grandma|letter|♥', en: 'Letters carry good words. Ming will keep this one.', zh: '信里带着好话。这封明明要收好。' },
      { art: 'home|ming,grandma|letter|·', en: 'Ming wants to go to the farm. He will go in summer when school is out.', zh: '明明想去农场。放暑假的时候他要去。' }
    ],
    quiz: [
      { q: '信上说农场的什么长大了？', opts: ['玉米', '房子', '山羊'], a: 2, kind: 'recall' },
      { q: '谁给明明写了信？', opts: ['爸爸', '奶奶', '妈妈'], a: 1, kind: 'infer' },
      { q: '想给远方的人说句话，你会怎么做？', opts: ['写一封信或一句话给他', '只在心里想', '什么也不说'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b74', lv: 'L7', tag: '冬天', title: 'A Scarf for Winter', zh: '冬天的围巾',
    emoji: '🧣', color: '#F9DFB4',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 3 个新词（冬天、围巾、紫色）。',
    trap: '美音里元音后的 r 一定要卷舌读出来：car、bird、water 都不能吞掉 r。',
    summary: '《冬天的围巾》：这是一个完整的小故事。读前先看词卡（冬天、围巾、紫色）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，按做事情的顺序讲一遍，至少用上三个本本词卡。',
    think: '说说一件冬天让你暖和的东西。',
    pre: [
      { art: '⏰', en: 'winter', zh: '冬天' },
      { art: '🧣', en: 'scarf', zh: '围巾' },
      { art: '🟣', en: 'purple', zh: '紫色' },
      { art: '🌿', en: 'wind', zh: '风' },
      { art: '📦', en: 'face', zh: '脸' }
    ],
    sight: ['leaves', 'nights', 'wears'],
    newWords: [
      { w: 'winter', zh: '冬天' },
      { w: 'scarf', zh: '围巾' },
      { w: 'purple', zh: '紫色' }
    ],
    pages: [
      { art: 'home|lili,grandpa|scarf|·', en: 'Winter is here. The days are short, and the nights are long.', zh: '冬天到了。白天短，夜晚长。' },
      { art: 'home|lili,grandpa|scarf|♪', en: 'The wind is cold. Ming feels it on his face when he goes out.', zh: '风很冷。明明出门的时候，脸上能感觉到。' },
      { art: 'home|lili,grandpa|scarf|👀', en: 'Mom makes a scarf. She works at night after Ming sleeps.', zh: '妈妈织围巾。她在明明睡后的夜里织。' },
      { art: 'home|lili,grandpa|scarf|?', en: 'The scarf is long. It is purple.', zh: '围巾很长。是紫色的。' },
      { art: 'home|lili,grandpa|scarf|·', en: 'Mom gives the scarf to Ming. She puts it on him so he stays warm.', zh: '妈妈把围巾给明明。她给他围上，好让脖子暖和。' },
      { art: 'home|lili,grandpa|scarf|!', en: 'Ming wears the scarf. He goes out to play, and the wind cannot get in.', zh: '明明围上围巾。他出去玩，风进不来。' },
      { art: 'home|lili,grandpa|scarf|♥', en: 'Ming is warm now. His face is warm.', zh: '明明现在暖和了。脸也暖和了。' },
      { art: 'home|lili,grandpa|scarf|★', en: 'The wind is still cold. The sky is gray, and the trees have no leaves.', zh: '风还是冷。天灰灰的，树上没有叶子。' },
      { art: 'home|lili,grandpa|scarf|…', en: 'But Ming is warm with the scarf. It keeps the wind out.', zh: '可明明围着围巾很暖。它把风挡在外面。' },
      { art: 'home|lili,grandpa|scarf|·', en: 'A scarf for winter. It is long, and it is warm.', zh: '冬天的围巾。它很长，也很暖。' },
      { art: 'home|lili,grandpa|scarf|♥', en: 'Ming likes the scarf. He wears it to school.', zh: '明明喜欢这条围巾。他戴着它去上学。' },
      { art: 'home|lili,grandpa|scarf|·', en: '"Thank you, Mom," Ming says. He hugs her because he is glad.', zh: '「谢谢妈妈。」明明说。他抱住她，因为他很高兴。' }
    ],
    quiz: [
      { q: '明明的围巾是谁做的？', opts: ['奶奶', '姐姐', '妈妈'], a: 2, kind: 'recall' },
      { q: '妈妈等到晚上才织围巾，是因为什么？', opts: ['白天忙，等明明睡了才有空', '白天太亮了', '晚上的线更好用'], a: 0, kind: 'infer' },
      { q: '天冷的时候，你会怎么做？', opts: ['不管它', '戴上围巾帽子，穿得暖和', '不出门'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b75', lv: 'L7', tag: '观察', title: 'Morning in the Garden', zh: '清晨的花园',
    emoji: '🌻', color: '#CDE7C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 2 个新词（花园、小镇）。',
    trap: '美音里元音后的 r 一定要卷舌读出来：car、bird、water 都不能吞掉 r。',
    summary: '《清晨的花园》：这是一个完整的小故事。读前先看词卡（花园、小镇）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，按做事情的顺序讲一遍，至少用上三个本本词卡。',
    think: '说说清晨的花园里有什么。',
    pre: [
      { art: '🌻', en: 'garden', zh: '花园' },
      { art: '🏙️', en: 'town', zh: '小镇' },
      { art: '🐛', en: 'bug', zh: '小虫' },
      { art: '☀️', en: 'sun', zh: '太阳' }
    ],
    sight: ['air', 'bright', 'flower', 'leaf', 'quiet'],
    newWords: [
      { w: 'garden', zh: '花园' },
      { w: 'town', zh: '小镇' }
    ],
    pages: [
      { art: 'garden|grandma,mom|garden|·', en: 'Morning is here. The sky is bright, and the air is soft.', zh: '早晨到了。天亮亮的，空气凉凉的。' },
      { art: 'garden|grandma,mom|garden|♪', en: 'Ming goes to the garden. He goes out early because he wants to see it wake up.', zh: '明明去花园。他出去得早，因为想看看它醒来。' },
      { art: 'garden|grandma,mom|garden|👀', en: 'The garden is wet. The path is wet too, so Ming walks slowly.', zh: '花园是湿的。小路也是湿的，所以明明走得很慢。' },
      { art: 'garden|grandma,mom|garden|?', en: 'The grass is green. It is long now.', zh: '草是绿的。现在长得很长。' },
      { art: 'garden|grandma,mom|garden|·', en: 'A bug is on a leaf. "Look," Ming says. "It is very small."', zh: '叶子上有只虫子。「你看。」明明说，「它特别小。」' },
      { art: 'garden|grandma,mom|garden|!', en: 'Ming looks at the bug. He gets down close.', zh: '明明看着小虫。他蹲下来凑近看。' },
      { art: 'garden|grandma,mom|garden|♥', en: 'The sun comes up. The garden gets warm, and the bug moves.', zh: '太阳升起来。花园变暖了，虫子也动了。' },
      { art: 'garden|grandma,mom|garden|★', en: 'The garden is nice now. A flower opens when the sun hits it.', zh: '花园现在很好看。太阳照到的时候，一朵花开了。' },
      { art: 'garden|grandma,mom|garden|…', en: 'Morning in the garden. The air is fresh.', zh: '花园的早晨。空气很清新。' },
      { art: 'garden|grandma,mom|garden|·', en: 'Ming likes the morning. It is quiet here before the town wakes up.', zh: '明明喜欢早晨。镇子醒来之前，这儿很安静。' },
      { art: 'garden|grandma,mom|garden|♥', en: 'The garden is a good place. It is quiet and green.', zh: '花园是个好地方。又安静又绿。' },
      { art: 'garden|grandma,mom|garden|·', en: 'Ming will come back tomorrow. He will bring Grandma so she can see it too.', zh: '明明明天还会来。他要带奶奶来，让她也看看。' }
    ],
    quiz: [
      { q: '明明在早上的花园里看见了什么小东西？', opts: ['一只猫', '一只鸟', '叶子上的一只小虫'], a: 2, kind: 'recall' },
      { q: '明明为什么一大早就去花园？', opts: ['奶奶让他去的', '他要去浇水', '他想看看花园醒来的样子'], a: 2, kind: 'infer' },
      { q: '早晨在户外，你会怎么做？', opts: ['只看屏幕', '看看花草小虫，感受清晨', '一直睡觉'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b76', lv: 'L7', tag: '故事', title: 'The Turtle and the Shark', zh: '乌龟和鲨鱼',
    emoji: '🐢', color: '#C6DEF6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 2 个新词（乌龟、鲨鱼）。',
    trap: '美音里元音后的 r 一定要卷舌读出来：car、bird、water 都不能吞掉 r。',
    summary: '《乌龟和鲨鱼》：这是一个完整的小故事。读前先看词卡（乌龟、鲨鱼）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，按做事情的顺序讲一遍，至少用上三个本本词卡。',
    think: '说说海龟和鲨鱼哪里不一样。',
    pre: [
      { art: '🐢', en: 'turtle', zh: '乌龟' },
      { art: '🦈', en: 'shark', zh: '鲨鱼' },
      { art: '🌊', en: 'sea', zh: '海' },
      { art: '💧', en: 'water', zh: '水' }
    ],
    sight: ['blue', 'eats', 'near', 'sea'],
    newWords: [
      { w: 'turtle', zh: '乌龟' },
      { w: 'shark', zh: '鲨鱼' }
    ],
    pages: [
      { art: 'beach|grandpa,dad|turtle|·', en: 'A turtle is in the sea. The sea is deep, and the water is blue.', zh: '一只乌龟在海里。海很深，水蓝蓝的。' },
      { art: 'beach|grandpa,dad|turtle|♪', en: 'The turtle swims slowly. It looks for food, and it eats small things.', zh: '乌龟慢慢游。它找吃的，吃些小东西。' },
      { art: 'beach|grandpa,dad|turtle|👀', en: 'A shark is in the sea too. It comes from the deep when it is hungry.', zh: '海里还有一条鲨鱼。它饿的时候从深处游上来。' },
      { art: 'beach|grandpa,dad|turtle|?', en: 'The shark swims fast. It comes up from below.', zh: '鲨鱼游得很快。它从下面游上来。' },
      { art: 'beach|grandpa,dad|turtle|·', en: 'The shark is big. It is bigger than the turtle, and it swims fast.', zh: '鲨鱼很大。它比乌龟大，游得也快。' },
      { art: 'beach|grandpa,dad|turtle|!', en: 'The turtle is not fast. It cannot swim away, so it goes down.', zh: '乌龟不快。它游不掉，于是往下沉。' },
      { art: 'beach|grandpa,dad|turtle|♥', en: 'But the turtle is not afraid. It has a hard shell that keeps it safe.', zh: '可乌龟不怕。它有一个硬壳，能保护它。' },
      { art: 'beach|grandpa,dad|turtle|★', en: 'The turtle goes down. It hides in the rocks.', zh: '海龟沉下去。它躲进石头里。' },
      { art: 'beach|grandpa,dad|turtle|…', en: 'The shark swims away. It cannot find the turtle, so it looks in another place.', zh: '鲨鱼游走了。它找不到乌龟，就去别处找。' },
      { art: 'beach|grandpa,dad|turtle|·', en: 'The turtle is safe. It comes up slowly.', zh: '海龟安全了。它慢慢浮上来。' },
      { art: 'beach|grandpa,dad|turtle|♥', en: 'The turtle and the shark. One is slow, and one is fast.', zh: '乌龟和鲨鱼。一个慢，一个快。' },
      { art: 'beach|grandpa,dad|turtle|·', en: 'Slow can be good. Slow can be safe too when a big fish is near.', zh: '慢也有好处。危险靠近的时候，慢也能保命。' }
    ],
    quiz: [
      { q: '乌龟靠什么保护自己？', opts: ['游得快', '躲进沙子里', '硬硬的壳'], a: 2, kind: 'recall' },
      { q: '海龟是怎么躲开鲨鱼的？', opts: ['咬鲨鱼', '游得更快', '沉下去躲起来'], a: 2, kind: 'infer' },
      { q: '遇到比你强、有危险的，你会怎么做？', opts: ['冷静，想办法躲开或求助', '站在原地哭', '硬拼'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b77', lv: 'L7', tag: '上学', title: 'A Picture for the Teacher', zh: '给老师的画',
    emoji: '🖼️', color: '#E0CFF3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。不引入新词，全部是读过的词。',
    trap: '美音里元音后的 r 一定要卷舌读出来：car、bird、water 都不能吞掉 r。',
    summary: '《给老师的画》：这是一个完整的小故事。读前先看词卡，都是学过的词；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，按做事情的顺序讲一遍，至少用上三个本本词卡。',
    think: '说说你画过送人的一幅画。',
    pre: [
      { art: '🖼️', en: 'picture', zh: '图画' },
      { art: '☀️', en: 'sun', zh: '太阳' }
    ],
    sight: ['draws', 'yellow'],
    newWords: [

    ],
    pages: [
      { art: 'school|mom,ming|picture|·', en: 'Ming draws a picture. He uses a new pen that Grandma gave him.', zh: '明明画一幅画。他用奶奶给他的新笔画。' },
      { art: 'school|mom,ming|picture|♪', en: 'The picture is for the teacher. He does not tell her because she does not know.', zh: '这幅画是给老师的。他没告诉她，因为想给她一个惊喜。' },
      { art: 'school|mom,ming|picture|👀', en: 'Ming draws the garden. He draws the green grass, and he adds a small bug.', zh: '明明画花园。他画绿草地，还添了只小虫。' },
      { art: 'school|mom,ming|picture|?', en: 'Ming draws the sun too. The sun is yellow.', zh: '明明还画了太阳。太阳是黄的。' },
      { art: 'school|mom,ming|picture|·', en: 'The picture is nice. He works a long time because he wants it right.', zh: '这幅画很好看。他画了很久，因为他想画好。' },
      { art: 'school|mom,ming|picture|!', en: 'Ming gives the picture to the teacher. He holds it with two hands when he gives it.', zh: '明明把画送给老师。他递过去的时候，双手捧着。' },
      { art: 'school|mom,ming|picture|♥', en: '"Thank you, Ming," the teacher says. She looks at the picture a long time.', zh: '「谢谢你，明明。」老师说。她看了那幅画很久。' },
      { art: 'school|mom,ming|picture|★', en: 'The teacher puts it on the wall. All can see it when they come in.', zh: '老师把它贴在墙上。大家进来都能看见。' },
      { art: 'school|mom,ming|picture|…', en: 'A picture for the teacher. It took him all morning.', zh: '给老师的画。他画了一整个早上。' },
      { art: 'school|mom,ming|picture|·', en: 'Ming is proud. He smiles all day.', zh: '明明很自豪。他一整天都笑眯眯的。' },
      { art: 'school|mom,ming|picture|♥', en: 'Pictures can say things. They can tell a story.', zh: '画能表达意思。它们能讲一个故事。' },
      { art: 'school|mom,ming|picture|·', en: 'Ming draws more pictures. One is for Grandma, and one is for Mom.', zh: '明明又画了几幅。一幅给奶奶，一幅给妈妈。' }
    ],
    quiz: [
      { q: '老师把明明的画放在哪儿了？', opts: ['放进抽屉', '带回家', '挂在墙上'], a: 2, kind: 'recall' },
      { q: '明明画了什么？', opts: ['花园和太阳', '车和船', '书和笔'], a: 0, kind: 'infer' },
      { q: '想送老师或长辈一样东西，你会怎么做？', opts: ['自己动手做，表达心意', '随便买一个', '不送'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b78', lv: 'L7', tag: '买菜', title: 'The Market at the Corner', zh: '街角的市场',
    emoji: '🥬', color: '#F6C9E3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 1 个新词（市场）。',
    trap: '美音里元音后的 r 一定要卷舌读出来：car、bird、water 都不能吞掉 r。',
    summary: '《街角的市场》：这是一个完整的小故事。读前先看词卡（市场）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，按做事情的顺序讲一遍，至少用上三个本本词卡。',
    think: '说说你去过的一个市场。',
    pre: [
      { art: '🥬', en: 'market', zh: '市场' },
      { art: '🍚', en: 'rice', zh: '米饭' },
      { art: '📦', en: 'basket', zh: '篮子' }
    ],
    sight: ['bright', 'near'],
    newWords: [
      { w: 'market', zh: '市场' }
    ],
    pages: [
      { art: 'street|dad,lili|market|·', en: 'A market is at the corner. It is near Ming\'s home, so he goes there often.', zh: '街角有个市场。它离明明家近，所以他常去。' },
      { art: 'street|dad,lili|market|♪', en: 'The market has many things. There are apples and eggs, and there is rice too.', zh: '市场里东西很多。有苹果有鸡蛋，还有米。' },
      { art: 'street|dad,lili|market|👀', en: 'Ming and Mom go to the market. They take a basket because they will buy a lot.', zh: '明明和妈妈去市场。他们带了个篮子，因为要买不少。' },
      { art: 'street|dad,lili|market|?', en: 'They see apples and rice. Ming looks at the grapes because they are purple.', zh: '他们看见苹果和米。明明看葡萄，因为葡萄是紫的。' },
      { art: 'street|dad,lili|market|·', en: '"Hold the basket," Mom says. She puts the rice in, and it gets full.', zh: '「扶好篮子。」妈妈说。她把米放进去，篮子满了。' },
      { art: 'street|dad,lili|market|!', en: 'Ming buys an apple. It is red and bright.', zh: '明明买了一个苹果。又红又亮。' },
      { art: 'street|dad,lili|market|♥', en: 'The market is big. There are many people, and it is warm inside.', zh: '市场很大。人很多，里面暖暖的。' },
      { art: 'street|dad,lili|market|★', en: 'They carry the things home. Ming helps Mom carry it because there is a lot.', zh: '他们把东西提回家。明明帮妈妈提，因为太重了。' },
      { art: 'street|dad,lili|market|…', en: 'The market at the corner. It is always full.', zh: '街角的市场。里面总是满满当当。' },
      { art: 'street|dad,lili|market|·', en: 'Ming likes the market. He likes to look around when they go.', zh: '明明喜欢这个市场。他们去的时候，他喜欢到处看。' },
      { art: 'street|dad,lili|market|♥', en: 'The basket is full. Ming holds one side.', zh: '篮子装得满满的。明明扶着一边。' },
      { art: 'street|dad,lili|market|·', en: '"See you next week," Mom says to the man at the door.', zh: '「下周见。」妈妈对门口的叔叔说。' }
    ],
    quiz: [
      { q: '妈妈在街角的市场买了什么？', opts: ['苹果', '米', '葡萄'], a: 1, kind: 'recall' },
      { q: '他们带篮子去市场，是因为什么？', opts: ['要买的东西不少，得有个东西装', '篮子好看', '市场不给袋子'], a: 0, kind: 'infer' },
      { q: '去市场买东西，你会怎么做？', opts: ['不看就走', '乱拿一通', '想好买什么，一样一样看'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b79', lv: 'L7', tag: '种植', title: 'Corn in the Garden', zh: '花园里的玉米',
    emoji: '🌽', color: '#BFE6DF',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 1 个新词（春天）。',
    trap: '美音里元音后的 r 一定要卷舌读出来：car、bird、water 都不能吞掉 r。',
    summary: '《花园里的玉米》：这是一个完整的小故事。读前先看词卡（春天）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，按做事情的顺序讲一遍，至少用上三个本本词卡。',
    think: '说说一种长在花园里的吃的。',
    pre: [
      { art: '⏰', en: 'spring', zh: '春天' },
      { art: '🌽', en: 'corn', zh: '玉米' },
      { art: '🌻', en: 'garden', zh: '花园' }
    ],
    sight: ['eats', 'grows', 'kitchen', 'leaves', 'year', 'yellow'],
    newWords: [
      { w: 'spring', zh: '春天' }
    ],
    pages: [
      { art: 'farm|ming,grandma|corn|·', en: 'Corn is in the garden. Ming put the seeds in when spring came.', zh: '花园里种着玉米。春天来的时候，明明把种子种下。' },
      { art: 'farm|ming,grandma|corn|♪', en: 'The corn is tall. It is taller than Ming, and it moves in the wind.', zh: '玉米很高。它比明明还高，在风里摇。' },
      { art: 'farm|ming,grandma|corn|👀', en: 'The corn grows and grows. It needs water and sun, so Ming waters it.', zh: '玉米长啊长。它需要水和太阳，所以明明给它浇水。' },
      { art: 'farm|ming,grandma|corn|?', en: 'Ming looks at the corn. He looks at the leaves.', zh: '明明看着玉米。他看看叶子。' },
      { art: 'farm|ming,grandma|corn|·', en: 'The corn is not ready. It is green, not yellow, so Ming waits.', zh: '玉米还没熟。它是绿的，不是黄的，所以明明等着。' },
      { art: 'farm|ming,grandma|corn|!', en: 'Ming waits. He waits many days, and he looks at it each morning.', zh: '明明等着。他等了很多天，每天早上都去看。' },
      { art: 'farm|ming,grandma|corn|♥', en: '"The corn is ready!" Ming says. It is yellow and full.', zh: '「玉米熟了！」明明说。玉米又黄又饱满。' },
      { art: 'farm|ming,grandma|corn|★', en: 'Ming picks the corn. He takes three.', zh: '明明摘玉米。他摘了三根。' },
      { art: 'farm|ming,grandma|corn|…', en: 'Corn in the garden. It is tall and yellow.', zh: '花园里的玉米。它又高又黄。' },
      { art: 'farm|ming,grandma|corn|·', en: 'The corn is good. Mom cooks it in a pot, and the kitchen smells sweet.', zh: '玉米长得好。妈妈用锅煮，厨房里甜甜的香。' },
      { art: 'farm|ming,grandma|corn|♥', en: 'Ming likes corn. He eats it all.', zh: '明明喜欢玉米。他全吃光了。' },
      { art: 'farm|ming,grandma|corn|·', en: 'Ming will plant more corn. He will plant it next year when spring comes.', zh: '明明还要种玉米。明年春天他再种。' }
    ],
    quiz: [
      { q: '玉米熟的时候是什么颜色？', opts: ['红色', '黄色', '绿色'], a: 1, kind: 'recall' },
      { q: '明明为什么每天早上都去看玉米？', opts: ['他要给它浇水', '他在等它熟，想看它长大', '他怕别人摘走'], a: 1, kind: 'infer' },
      { q: '想让植物长大，你会怎么做？', opts: ['不管它', '浇水、耐心等，不急着拔', '每天拔出来看'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b80', lv: 'L7', tag: '寻找', title: 'Search the Park', zh: '找遍公园',
    emoji: '🔍', color: '#F2E2A8',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 1 个新词（寻找）。',
    trap: '美音里元音后的 r 一定要卷舌读出来：car、bird、water 都不能吞掉 r。',
    summary: '《找遍公园》：这是一个完整的小故事。读前先看词卡（寻找）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，按做事情的顺序讲一遍，至少用上三个本本词卡。',
    think: '说说你找东西的一次经历。',
    pre: [
      { art: '🏃', en: 'search', zh: '寻找' },
      { art: '⚽', en: 'ball', zh: '球' },
      { art: '🏞️', en: 'park', zh: '公园' }
    ],
    sight: ['leaf', 'tired'],
    newWords: [
      { w: 'search', zh: '寻找' }
    ],
    pages: [
      { art: 'library|lili,grandpa|park|·', en: 'Ming goes to the park. He takes his ball, and he plays by the tree.', zh: '明明去公园。他带着球，在树边玩。' },
      { art: 'library|lili,grandpa|park|♪', en: 'Ming looks for a ball. He put it here this morning before he went home.', zh: '明明找球。今天早上回家前，他就放在这儿。' },
      { art: 'library|lili,grandpa|park|👀', en: 'The ball is not here. He looks at the grass.', zh: '球不在这儿。他看看草地上。' },
      { art: 'library|lili,grandpa|park|?', en: 'Ming looks all over the park. He walks a long way, but he cannot find it.', zh: '明明找遍公园。他走了很远，可还是没找到。' },
      { art: 'library|lili,grandpa|park|·', en: 'Ming looks under a tree. Only a bug is there, so he looks in another place.', zh: '明明在树下看。那儿只有一只虫子，于是他换个地方找。' },
      { art: 'library|lili,grandpa|park|!', en: 'Ming looks by a stone. He finds an old leaf.', zh: '明明在石头边找。他找到一片枯叶。' },
      { art: 'library|lili,grandpa|park|♥', en: 'Ming does not find the ball. He sits down to think because he is tired.', zh: '明明没找到球。他坐下来想，因为他累了。' },
      { art: 'library|lili,grandpa|park|★', en: '"Did you see my ball?" Ming asks a man at the gate.', zh: '「您看见我的球了吗？」明明问门口的叔叔。' },
      { art: 'library|lili,grandpa|park|…', en: 'Someone saw the ball. It went that way when the wind pushed it.', zh: '有人看见过球。风把它吹走的时候，它往那边去了。' },
      { art: 'library|lili,grandpa|park|·', en: 'The ball is by the gate! Ming runs to get it, and he laughs.', zh: '球就在门边！明明跑过去拿，笑了。' },
      { art: 'library|lili,grandpa|park|♥', en: 'Search the park. It was there all the time.', zh: '找遍公园。球一直都在那儿。' },
      { art: 'library|lili,grandpa|park|·', en: 'Ming is glad to find the ball. He takes it home.', zh: '找到球明明很高兴。他把球带回家。' }
    ],
    quiz: [
      { q: '球最后在哪儿找到的？', opts: ['大树下', '大门边', '草丛里'], a: 1, kind: 'recall' },
      { q: '明明找了很久都没找到，后来是怎么找到的？', opts: ['问了门口的一位叔叔', '风把它吹过来了', '自己忽然看见了'], a: 0, kind: 'infer' },
      { q: '找东西找遍了还没找到，你会怎么做？', opts: ['问一问别人，或换个地方想', '不要了', '一直乱找'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b81', lv: 'L7', tag: '发音', title: 'Say It: Car, Bird', zh: '说一说：car bird',
    emoji: '🗣️', color: '#D9D2F5',
    track: 'drill',
    goal: '把本级难点音听准、说准，并能在整句里读对。认读 1 个新词（小汽车）。',
    trap: '美音里元音后的 r 一定要卷舌读出来：car、bird、water 都不能吞掉 r。',
    summary: '《说一说：car bird》：这一本练两个词的音和形。读前先看词卡（小汽车）；读的时候先看清每个词，再连起来读一遍。',
    retell: '把这一本练的两个词再读一遍，说说它们的音哪里一样、哪里不一样。',
    think: '找两个带 r 的词，读一读。',
    pre: [
      { art: '📦', en: 'car', zh: '小汽车' },
      { art: '🐦', en: 'bird', zh: '鸟' }
    ],
    sight: [],
    newWords: [
      { w: 'car', zh: '小汽车' }
    ],
    pages: [
      { art: 'table|grandma,mom|car|·', en: 'This is a car. It has an "r" at the end.', zh: '这是一辆汽车。结尾有个 r。' },
      { art: 'table|grandma,mom|car|♪', en: 'This is a bird. It has an "r" too.', zh: '这是一只鸟。也有 r。' },
      { art: 'table|grandma,mom|car|👀', en: 'Car and bird. Say both words.', zh: '汽车和鸟。两个词都说一说。' },
      { art: 'table|grandma,mom|car|?', en: 'Both have an "r" sound. Listen for it when you say them.', zh: '两个词都有 r 的音。说的时候注意听。' },
      { art: 'table|grandma,mom|car|·', en: 'Say "car". Say it slow.', zh: '读 car。慢慢读。' },
      { art: 'table|grandma,mom|car|!', en: 'Say "bird". Say it again.', zh: '读 bird。再读一遍。' },
      { art: 'table|grandma,mom|car|♥', en: 'Say the "r" well. Do not drop it when you talk fast.', zh: '把 r 读好。说快的时候也别丢掉。' },
      { art: 'table|grandma,mom|car|★', en: 'Car is not bird. They are different things, but both have "r".', zh: '汽车不是鸟。它们是不同的东西，可都有 r。' },
      { art: 'table|grandma,mom|car|…', en: 'You can say both. Both are short words, so they are easy.', zh: '两个词你都能说。都是短词，所以不难。' },
      { art: 'table|grandma,mom|car|·', en: 'Car, bird, car, bird. Now say them fast.', zh: '汽车，鸟，汽车，鸟。现在说快一点。' },
      { art: 'table|grandma,mom|car|♥', en: 'Good! Now say them again when you are ready.', zh: '很好！准备好了就再说一遍。' },
      { art: 'table|grandma,mom|car|·', en: 'Now say them fast. Say them one more time at the end.', zh: '现在说快一点。最后再说一遍。' }
    ],
    quiz: [
      { q: 'car 和 bird 结尾都有哪个音？', opts: ['r 的音', 'l 的音', 'n 的音'], a: 0, kind: 'recall' },
      { q: '这一本在练哪个音？', opts: ['「s」的音', '「t」的音', '「r」的音'], a: 2, kind: 'infer' },
      { q: '单词里有 r，你会怎么读？', opts: ['把 r 读得清楚有力', '跳过去', '把 r 念没了'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b82', lv: 'L7', tag: '小知识', title: 'Why Winter Is Cold', zh: '冬天为什么冷',
    emoji: '☃️', color: '#FAD3B6',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。不引入新词，全部是读过的词。',
    trap: '美音里元音后的 r 一定要卷舌读出来：car、bird、water 都不能吞掉 r。',
    summary: '《冬天为什么冷》：这一本从一件小事讲起，说说为什么会这样。读前先看词卡，都是学过的词；读的时候留意先看到什么、为什么会这样、后来怎么弄明白。',
    retell: '合上书，按「先看到什么 → 为什么会这样 → 后来怎么弄明白」讲一遍。',
    think: '说说冬天和夏天有什么不一样。',
    pre: [
      { art: '☀️', en: 'sun', zh: '太阳' },
      { art: '🌿', en: 'wind', zh: '风' }
    ],
    sight: ['air', 'high', 'leaves', 'light', 'wear'],
    newWords: [

    ],
    pages: [
      { art: 'night|grandpa,dad|winter|·', en: 'Winter is here. The trees have no leaves, and the wind is cold.', zh: '冬天到了。树上没有叶子，风很冷。' },
      { art: 'night|grandpa,dad|winter|♪', en: 'Why is winter cold? We can find out.', zh: '冬天为什么冷？我们能弄明白。' },
      { art: 'night|grandpa,dad|winter|👀', en: 'The sun is not high. It is far away, so its light is not strong.', zh: '太阳不高。它离得远，所以光很弱。' },
      { art: 'night|grandpa,dad|winter|?', en: 'The days are not long. It gets dark early because the sun goes down soon.', zh: '白天不长。天黑得早，因为太阳落得快。' },
      { art: 'night|grandpa,dad|winter|·', en: 'The sun is not hot. The light is not strong, so the air stays cold.', zh: '太阳不热。光不强，所以空气一直是冷的。' },
      { art: 'night|grandpa,dad|winter|!', en: 'So winter is cold. That is why we wear coats.', zh: '所以冬天冷。这就是我们要穿外套的原因。' },
      { art: 'night|grandpa,dad|winter|♥', en: 'The wind is cold too. We feel it on our face when we go out.', zh: '风也冷。我们出门的时候，脸上能感觉到。' },
      { art: 'night|grandpa,dad|winter|★', en: 'We wear coats. We wear scarves too.', zh: '我们穿外套。还围围巾。' },
      { art: 'night|grandpa,dad|winter|…', en: 'Winter is cold, but we are warm. Our coats and scarves keep it out.', zh: '冬天冷，可我们暖和。外套和围巾把冷挡在外面。' },
      { art: 'night|grandpa,dad|winter|·', en: 'Why winter is cold. Now we know.', zh: '冬天为什么冷。现在我知道了。' },
      { art: 'night|grandpa,dad|winter|♥', en: 'Winter will go. The days get long again when spring comes.', zh: '冬天会过去。春天来的时候，白天又变长了。' },
      { art: 'night|grandpa,dad|winter|·', en: 'Warm days will come. We can play in the park.', zh: '暖和的日子会来。我们又能去公园玩。' }
    ],
    quiz: [
      { q: '冬天为什么冷？', opts: ['太阳不高，光不强', '因为下雪', '因为风从海上来'], a: 0, kind: 'recall' },
      { q: '冬天太阳不高，所以地面上会怎么样？', opts: ['光和热都少，就冷了', '变得更亮', '一直下雨'], a: 0, kind: 'infer' },
      { q: '想知道自然现象为什么发生，你会怎么做？', opts: ['观察、想一想、查一查', '随便猜', '不管它'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b83', lv: 'L7', tag: '小知识', title: 'How a Farmer Works', zh: '农民怎么干活',
    emoji: '👨‍🌾', color: '#C8E7F0',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。不引入新词，全部是读过的词。',
    trap: '美音里元音后的 r 一定要卷舌读出来：car、bird、water 都不能吞掉 r。',
    summary: '《农民怎么干活》：这一本从一件小事讲起，说说为什么会这样。读前先看词卡，都是学过的词；读的时候留意先看到什么、为什么会这样、后来怎么弄明白。',
    retell: '合上书，按「先看到什么 → 为什么会这样 → 后来怎么弄明白」讲一遍。',
    think: '说说农民一天都做些什么。',
    pre: [
      { art: '🚜', en: 'farm', zh: '农场' },
      { art: '🌽', en: 'corn', zh: '玉米' }
    ],
    sight: ['eat', 'grows', 'tired', 'watches'],
    newWords: [

    ],
    pages: [
      { art: 'farm|mom,ming|farmer|·', en: 'A farmer works on the farm. The farm is his work, and he likes it.', zh: '农民在农场干活。农场就是他的工作，他喜欢它。' },
      { art: 'farm|mom,ming|farmer|♪', en: 'The farmer gets up early. It is still dark when he goes out.', zh: '农民起得很早。他出门的时候天还黑着。' },
      { art: 'farm|mom,ming|farmer|👀', en: 'The farmer feeds the animals. He gives them corn, and they eat it fast.', zh: '农民喂牲口。他给它们玉米，它们吃得很快。' },
      { art: 'farm|mom,ming|farmer|?', en: 'The farmer grows corn. He watches it grow, and he waters it.', zh: '农民种玉米。他看着它长，给它浇水。' },
      { art: 'farm|mom,ming|farmer|·', en: 'The farmer works all day. He does not rest much, but he is happy.', zh: '农民干一整天。他歇得不多，可他高兴。' },
      { art: 'farm|mom,ming|farmer|!', en: 'The farmer is tired. His back hurts, so he sits for a while.', zh: '农民累了。他背疼，所以坐了一会儿。' },
      { art: 'farm|mom,ming|farmer|♥', en: 'But the farm is good. The corn is tall.', zh: '可农场长得好。玉米高高的。' },
      { art: 'farm|mom,ming|farmer|★', en: 'How a farmer works. It is hard work.', zh: '农民怎么干活。这活很辛苦。' },
      { art: 'farm|mom,ming|farmer|…', en: 'The farmer likes the farm. He is glad to work there.', zh: '农民喜欢这个农场。他很高兴在那儿干活。' },
      { art: 'farm|mom,ming|farmer|·', en: 'The farmer is careful. He looks at the sky.', zh: '农民很仔细。他看看天色。' },
      { art: 'farm|mom,ming|farmer|♥', en: 'The farm helps many people. The food goes to the market when it is ready.', zh: '农场帮了很多人。食物收好了就运到市场。' },
      { art: 'farm|mom,ming|farmer|·', en: 'We thank the farmer. We eat it all, and we think of his work.', zh: '我们谢谢农民。我们把饭吃完，也想着他的辛苦。' }
    ],
    quiz: [
      { q: '农民一大早就去做什么？', opts: ['去市场卖菜', '喂牲口、下地干活', '送孩子上学'], a: 1, kind: 'recall' },
      { q: '农民每天都做什么？', opts: ['坐车、玩', '喂动物、种玉米、干农活', '写作业、看书'], a: 1, kind: 'infer' },
      { q: '看到别人辛勤劳动，你会怎么做？', opts: ['珍惜成果，说声谢谢', '不管', '浪费'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b84', lv: 'L7', tag: '复习', title: 'Back to the First Place', zh: '回到最开始',
    emoji: '🏠', color: '#E8D9B5',
    track: 'review',
    goal: '把本级和前面级别的词再读一遍、串成一个故事。不引入新词，全部是读过的词。',
    trap: '美音里元音后的 r 一定要卷舌读出来：car、bird、water 都不能吞掉 r。',
    summary: '《回到最开始》：这是一个完整的小故事。读前先看词卡，都是学过的词；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，按做事情的顺序讲一遍，至少用上三个本本词卡。',
    think: '说说一个你常去、想回去看看的地方。',
    pre: [
      { art: '🌳', en: 'tree', zh: '树' },
      { art: '📍', en: 'corner', zh: '角落' }
    ],
    sight: ['grew', 'knows', 'leaves', 'remembers'],
    newWords: [

    ],
    pages: [
      { art: 'library|dad,lili|corner|·', en: 'Ming walks to the corner. He walks alone, and he takes his time.', zh: '明明走到街角。他一个人走，不着急。' },
      { art: 'library|dad,lili|corner|♪', en: 'The corner is the first place. He started here when he was small.', zh: '这个街角是最初的地方。他小时候就从这儿开始。' },
      { art: 'library|dad,lili|corner|👀', en: 'Ming looks at the market. He sees the baskets, and he remembers.', zh: '明明看着市场。他看见那些篮子，想起来了。' },
      { art: 'library|dad,lili|corner|?', en: 'Ming looks at the park. The tree is big now, but it is the same tree.', zh: '明明看着公园。树现在很大了，可还是那棵树。' },
      { art: 'library|dad,lili|corner|·', en: 'Ming knows them all. He grew up here.', zh: '明明全都认得。他在这儿长大。' },
      { art: 'library|dad,lili|corner|!', en: 'Back to the first place. Nothing has moved.', zh: '回到最初的地方。什么都还是原样。' },
      { art: 'library|dad,lili|corner|♥', en: 'Ming sees the same tree. He pats it, and he stands under it.', zh: '明明看见那棵树。他拍拍它，站在树下。' },
      { art: 'library|dad,lili|corner|★', en: 'The tree is still there. It has more leaves.', zh: '树还在那儿。叶子更多了。' },
      { art: 'library|dad,lili|corner|…', en: 'Ming is glad to be back. He stands there a long time because he is thinking.', zh: '明明很高兴回来。他在那儿站了很久，因为他在想事情。' },
      { art: 'library|dad,lili|corner|·', en: 'The first place is good. It feels like home when he stands here.', zh: '最初的地方让人踏实。站在这儿，就像回到家一样。' },
      { art: 'library|dad,lili|corner|♥', en: 'Ming will start again. He has a new plan, and he will begin here.', zh: '明明要重新开始。他有了新计划，就从这儿开始。' },
      { art: 'library|dad,lili|corner|·', en: 'Ming likes the corner. He will come back.', zh: '明明喜欢这个街角。他还会再来。' }
    ],
    quiz: [
      { q: '明明回到街角，什么还是原来的样子？', opts: ['市场', '学校', '那棵树'], a: 2, kind: 'recall' },
      { q: '明明站在老树下很久，他在做什么？', opts: ['在等奶奶', '在数叶子', '在想以前的事'], a: 2, kind: 'infer' },
      { q: '回到去过的地方，你会怎么做？', opts: ['看看有什么变化，重新感受一下', '不看', '随便看看'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b85', lv: 'L8', tag: '过年', title: 'Dumplings with Grandma', zh: '和奶奶包饺子',
    emoji: '🥟', color: '#F6C6C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 1 个新词（饺子）。',
    trap: 'ou / ow 读 /aʊ/，oi / oy 读 /ɔɪ/；长句按意思分组读，别逐词蹦。',
    summary: '《和奶奶包饺子》：这是一个完整的小故事。读前先看词卡（饺子）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，按做事情的顺序讲一遍，至少用上三个本本词卡。',
    think: '说说你和家人一起做过的一种吃的。',
    pre: [
      { art: '🥟', en: 'dumpling', zh: '饺子' },
      { art: '🍳', en: 'kitchen', zh: '厨房' },
      { art: '🍲', en: 'pot', zh: '锅' }
    ],
    sight: ['kitchen', 'piece', 'watches'],
    newWords: [
      { w: 'dumpling', zh: '饺子' }
    ],
    pages: [
      { art: 'kitchen|ming,grandma|dumpling|·', en: 'Grandma is in the kitchen. The kitchen is warm because the pot is on.', zh: '奶奶在厨房。厨房暖暖的，因为灶上坐着锅。' },
      { art: 'kitchen|ming,grandma|dumpling|♪', en: 'Grandma makes dumplings. She makes a round piece that is thin and soft.', zh: '奶奶包饺子。她做了一张又薄又软的圆皮。' },
      { art: 'kitchen|ming,grandma|dumpling|👀', en: 'Ming helps Grandma. He washes his hands first.', zh: '明明帮奶奶。他先把手洗干净。' },
      { art: 'kitchen|ming,grandma|dumpling|?', en: 'They get the food ready. There is pork and green leaves, and Ming puts them on the table.', zh: '他们把馅料准备好。有猪肉和青菜，明明把它们摆上桌。' },
      { art: 'kitchen|ming,grandma|dumpling|·', en: 'Grandma shows Ming how. She puts the food on the round piece.', zh: '奶奶教明明怎么做。她把馅放到圆面皮上。' },
      { art: 'kitchen|ming,grandma|dumpling|!', en: 'Ming makes one dumpling. He closes it with his hands, but one side stays open.', zh: '明明包了一个饺子。他用手捏紧，可有一边没合上。' },
      { art: 'kitchen|ming,grandma|dumpling|♥', en: '"Try again," Grandma says. "I will help you."', zh: '「再试一次。」奶奶说，「我来帮你。」' },
      { art: 'kitchen|ming,grandma|dumpling|★', en: 'She shows him again, slowly. This time he watches her hands.', zh: '她又慢慢示范了一遍。这次他仔细看她的手。' },
      { art: 'kitchen|ming,grandma|dumpling|…', en: 'They make many dumplings. The table is full.', zh: '他们包了好多饺子。桌上摆满了。' },
      { art: 'kitchen|ming,grandma|dumpling|·', en: 'The dumplings cook in the pot. The water boils, and the kitchen smells good.', zh: '饺子在锅里煮。水开了，厨房里香起来。' },
      { art: 'kitchen|ming,grandma|dumpling|♥', en: 'The dumplings are good! Ming tastes one when it is still hot.', zh: '饺子很好吃！明明趁热尝了一个。' },
      { art: 'kitchen|ming,grandma|dumpling|·', en: 'Ming eats the dumplings. He eats more than Grandma.', zh: '明明吃饺子。他比奶奶吃得还多。' },
      { art: 'kitchen|ming,grandma|dumpling|…', en: 'Dumplings with Grandma. He wants to make them again because it was fun.', zh: '和奶奶包饺子。他还想再包，因为太有意思了。' }
    ],
    quiz: [
      { q: '明明包的饺子怎么了？', opts: ['有一边没捏上，开着口', '全破了', '太小了'], a: 0, kind: 'recall' },
      { q: '饺子有一边没捏上，下锅煮会怎么样？', opts: ['会浮得更高', '会变得更香', '馅可能会跑出来'], a: 2, kind: 'infer' },
      { q: '和家人一起做吃的，你会怎么做？', opts: ['怕做不好就不做', '只吃不做', '跟着学，做不好也没关系'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b86', lv: 'L8', tag: '中秋', title: 'The Mid-Autumn Moon', zh: '中秋的月亮',
    emoji: '🌕', color: '#F9DFB4',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 5 个新词（中、秋天、窗户、月饼、今晚）。',
    trap: 'ou / ow 读 /aʊ/，oi / oy 读 /ɔɪ/；长句按意思分组读，别逐词蹦。',
    summary: '《中秋的月亮》：这是一个完整的小故事。读前先看词卡（中、秋天、窗户、月饼、今晚）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，按做事情的顺序讲一遍，至少用上三个本本词卡。',
    think: '说说中秋节你和家人做了什么。',
    pre: [
      { art: '⏰', en: 'mid', zh: '中' },
      { art: '⏰', en: 'autumn', zh: '秋天' },
      { art: '🪟', en: 'window', zh: '窗户' },
      { art: '🥮', en: 'mooncake', zh: '月饼' },
      { art: '⏰', en: 'tonight', zh: '今晚' },
      { art: '🌙', en: 'moon', zh: '月亮' },
      { art: '🌿', en: 'night', zh: '夜晚' }
    ],
    sight: ['near', 'quiet'],
    newWords: [
      { w: 'mid', zh: '中' },
      { w: 'autumn', zh: '秋天' },
      { w: 'window', zh: '窗户' },
      { w: 'mooncake', zh: '月饼' },
      { w: 'tonight', zh: '今晚' }
    ],
    pages: [
      { art: 'kitchen|lili,grandpa|mooncake|·', en: 'The Mid-Autumn night is here. The sky is clear, so the moon is easy to see.', zh: '中秋的夜晚到了。天很晴，月亮看得很清楚。' },
      { art: 'kitchen|lili,grandpa|mooncake|♪', en: 'The moon is round. It looks like a plate up in the sky.', zh: '月亮圆圆的。像一只挂在天上的盘子。' },
      { art: 'kitchen|lili,grandpa|mooncake|👀', en: 'The moon is bright.', zh: '月亮很亮。' },
      { art: 'kitchen|lili,grandpa|mooncake|?', en: 'The family is together. They sit near the window so they can see the moon.', zh: '一家人在一起。他们坐在窗边，好看见月亮。' },
      { art: 'kitchen|lili,grandpa|mooncake|·', en: 'Grandma has mooncakes. There are many on the plate.', zh: '奶奶拿出了月饼。盘子里有好多个。' },
      { art: 'kitchen|lili,grandpa|mooncake|!', en: 'A mooncake is for Ming. It is round like the moon, and it smells sweet.', zh: '一块月饼是给明明的。它像月亮一样圆，闻着甜甜的。' },
      { art: 'kitchen|lili,grandpa|mooncake|♥', en: 'The mooncake is good. It is sweet and soft.', zh: '月饼很好吃。又甜又软。' },
      { art: 'kitchen|lili,grandpa|mooncake|★', en: '"Look up," Grandpa says. "The moon is very round tonight."', zh: '「抬头看。」爷爷说，「今晚的月亮真圆。」' },
      { art: 'kitchen|lili,grandpa|mooncake|…', en: 'The moon looks back. Ming smiles at it.', zh: '月亮也看着我们。明明朝它笑。' },
      { art: 'kitchen|lili,grandpa|mooncake|·', en: 'The Mid-Autumn moon. The night is quiet, and the moon is high.', zh: '中秋的月亮。夜很静，月亮高高的。' },
      { art: 'kitchen|lili,grandpa|mooncake|♥', en: 'They are happy together. They talk for a long time because no one wants to sleep.', zh: '他们在一起很快乐。他们聊了很久，因为谁都不想睡。' },
      { art: 'kitchen|lili,grandpa|mooncake|·', en: 'Mooncakes and the moon. Ming will remember this night when he is older.', zh: '月饼和月亮。明明长大了也会记得这个夜晚。' },
      { art: 'kitchen|lili,grandpa|mooncake|…', en: 'A good night for the family. He keeps the last mooncake.', zh: '全家人的好夜晚。他留着最后一块月饼。' }
    ],
    quiz: [
      { q: '月饼是什么样子的？', opts: ['像月亮一样圆', '方的', '三角形的'], a: 0, kind: 'recall' },
      { q: '中秋夜里大家做了什么？', opts: ['去看电影', '一起看月亮、吃月饼', '去上学'], a: 1, kind: 'infer' },
      { q: '过节和家人团聚，你会怎么做？', opts: ['不参加', '只顾自己玩', '和家人一起，珍惜在一起的时间'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b87', lv: 'L8', tag: '出行', title: 'A Long Train Ride', zh: '一趟长长的火车',
    emoji: '🚄', color: '#CDE7C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 1 个新词（火车）。',
    trap: 'ou / ow 读 /aʊ/，oi / oy 读 /ɔɪ/；长句按意思分组读，别逐词蹦。',
    summary: '《一趟长长的火车》：这是一个完整的小故事。读前先看词卡（火车）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，按做事情的顺序讲一遍，至少用上三个本本词卡。',
    think: '说说你坐火车或汽车时看到的风景。',
    pre: [
      { art: '📦', en: 'train', zh: '火车' },
      { art: '🪟', en: 'window', zh: '窗户' },
      { art: '🎒', en: 'bag', zh: '书包' }
    ],
    sight: [],
    newWords: [
      { w: 'train', zh: '火车' }
    ],
    pages: [
      { art: 'home|grandma,mom|window|·', en: 'Ming is on a train. It is his first long trip, so he looks at everything.', zh: '明明在火车上。这是他第一次长途旅行，所以他什么都看。' },
      { art: 'home|grandma,mom|window|♪', en: 'The train ride is long. It will take many hours.', zh: '这趟车要走很久。得坐好几个小时。' },
      { art: 'home|grandma,mom|window|👀', en: 'Ming sits by the window. Mom sits with him, and she has a bag of food.', zh: '明明坐在窗边。妈妈坐在他旁边，带着一袋吃的。' },
      { art: 'home|grandma,mom|window|?', en: 'Ming looks out the window. The houses go by, and the trees do too.', zh: '明明看着窗外。房子往后退，树也是。' },
      { art: 'home|grandma,mom|window|·', en: 'The train goes and goes. It does not stop.', zh: '火车开啊开。一直不停。' },
      { art: 'home|grandma,mom|window|!', en: 'Ming sees hills and trees. He sees cows that stand on the grass.', zh: '明明看见山和树。他看见站在草地上的牛。' },
      { art: 'home|grandma,mom|window|♥', en: 'The train goes fast. The trees go by quickly.', zh: '火车开得很快。树飞快地往后退。' },
      { art: 'home|grandma,mom|window|★', en: 'Ming looks and looks. He counts the cows because he has nothing else to do.', zh: '明明看啊看。他数牛，因为他没别的事做。' },
      { art: 'home|grandma,mom|window|…', en: 'The window is nice. He can see the sky.', zh: '靠窗的位置真好。他能看见天空。' },
      { art: 'home|grandma,mom|window|·', en: 'A long train ride. Mom gives him a cake when he is hungry.', zh: '一趟长长的火车。他饿的时候，妈妈给他一块蛋糕。' },
      { art: 'home|grandma,mom|window|♥', en: 'Ming likes the window. He does not want to sleep because he may miss something.', zh: '明明喜欢这个窗边。他不想睡，因为怕错过什么。' },
      { art: 'home|grandma,mom|window|·', en: 'The train stops. They are in the town.', zh: '火车停了。他们到了镇上。' },
      { art: 'home|grandma,mom|window|…', en: 'Ming is glad. Grandma is there to meet them, and she puts up her hand.', zh: '明明很高兴。奶奶来接他们，在门口招手。' }
    ],
    quiz: [
      { q: '明明坐火车的时候坐在哪儿？', opts: ['最后一排', '窗边', '过道边'], a: 1, kind: 'recall' },
      { q: '明明在火车上为什么不肯睡？', opts: ['他怕错过窗外的什么东西', '他一点也不困', '车上太吵了'], a: 0, kind: 'infer' },
      { q: '坐车旅行，你会怎么做？', opts: ['看看窗外的风景，注意安全', '一直睡觉', '乱跑'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b88', lv: 'L8', tag: '通信', title: 'A Letter to My Cousin', zh: '给表姐的信',
    emoji: '💌', color: '#C6DEF6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 2 个新词（表姐、生命）。',
    trap: 'ou / ow 读 /aʊ/，oi / oy 读 /ɔɪ/；长句按意思分组读，别逐词蹦。',
    summary: '《给表姐的信》：这是一个完整的小故事。读前先看词卡（表姐、生命）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，按做事情的顺序讲一遍，至少用上三个本本词卡。',
    think: '说说你想寄给远方亲人的一样东西。',
    pre: [
      { art: '🧑', en: 'cousin', zh: '表姐' },
      { art: '💡', en: 'life', zh: '生命' },
      { art: '🖼️', en: 'picture', zh: '图画' },
      { art: '✉️', en: 'letter', zh: '信' }
    ],
    sight: ['writes'],
    newWords: [
      { w: 'cousin', zh: '表姐' },
      { w: 'life', zh: '生命' }
    ],
    pages: [
      { art: 'school|grandpa,dad|drawing|·', en: 'Ming draws a picture. He sits at the desk because the light is good there.', zh: '明明画一幅画。他坐在书桌前，因为那儿光线好。' },
      { art: 'school|grandpa,dad|drawing|♪', en: 'The drawing is for Cousin. She lives in another town, far away.', zh: '这幅画是给表姐的。她住在另一个镇子，很远。' },
      { art: 'school|grandpa,dad|drawing|👀', en: 'Ming draws a house. He makes it big and warm.', zh: '明明画了一座房子。他画得又大又暖和。' },
      { art: 'school|grandpa,dad|drawing|?', en: 'Ming draws a window on it. He draws a small Ming that looks out of it.', zh: '他在上面画了一扇窗。他画了个小明明，正从窗里往外看。' },
      { art: 'school|grandpa,dad|drawing|·', en: 'The picture is nice. He paints the sky blue.', zh: '画很好看。他把天空涂成蓝色。' },
      { art: 'school|grandpa,dad|drawing|!', en: 'Ming adds a short note. He tells her about the garden that Grandpa keeps.', zh: '明明又添了张小纸条。他跟她讲爷爷打理的那个园子。' },
      { art: 'school|grandpa,dad|drawing|♥', en: 'The note says hello. It asks how she is.', zh: '纸条上写着你好。还问她近来好不好。' },
      { art: 'school|grandpa,dad|drawing|★', en: 'Ming puts the picture in a letter. He writes her name on it so it will get there.', zh: '明明把画装进信封。他在上面写上她的名字，好让信寄到。' },
      { art: 'school|grandpa,dad|drawing|…', en: 'The letter goes to Cousin. It goes far away.', zh: '信寄给表姐。要送到很远的地方。' },
      { art: 'school|grandpa,dad|drawing|·', en: 'Cousin gets the letter. She opens it that day because she sees Ming\'s name on it.', zh: '表姐收到了信。她当天就拆开，因为她看见上面有明明的名字。' },
      { art: 'school|grandpa,dad|drawing|♥', en: '"I like it very much," Cousin writes. She draws a small picture too.', zh: '「我非常喜欢。」表姐写道。她也画了一幅小画。' },
      { art: 'school|grandpa,dad|drawing|·', en: 'A picture for Cousin.', zh: '给表姐的画。' },
      { art: 'school|grandpa,dad|drawing|…', en: 'Letters and pictures. They can go a long way when someone waits for them.', zh: '信和画。有人在等的时候，它们能走很远。' }
    ],
    quiz: [
      { q: '信送到表姐手上，她当天做了什么？', opts: ['先收进抽屉', '放到第二天才拆', '当天就拆开看了'], a: 2, kind: 'recall' },
      { q: '明明在信里画了窗和往外看的小明明，是想告诉表姐什么？', opts: ['他很会画画', '他想她了，想见面', '他家的窗户很大'], a: 1, kind: 'infer' },
      { q: '想让远方的家人开心，你会怎么做？', opts: ['画一幅画或写几句话寄给他', '只打电话', '什么也不做'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b89', lv: 'L8', tag: '农场', title: 'The Brown Cow', zh: '棕色的奶牛',
    emoji: '🐄', color: '#E0CFF3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 1 个新词（奶牛）。',
    trap: 'ou / ow 读 /aʊ/，oi / oy 读 /ɔɪ/；长句按意思分组读，别逐词蹦。',
    summary: '《棕色的奶牛》：这是一个完整的小故事。读前先看词卡（奶牛）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，按做事情的顺序讲一遍，至少用上三个本本词卡。',
    think: '说说你在农场见过的一种大动物。',
    pre: [
      { art: '🐄', en: 'cow', zh: '奶牛' },
      { art: '🌿', en: 'grass', zh: '草' },
      { art: '🚜', en: 'farm', zh: '农场' }
    ],
    sight: ['friend', 'near'],
    newWords: [
      { w: 'cow', zh: '奶牛' }
    ],
    pages: [
      { art: 'farm|mom,ming|cow|·', en: 'A cow is on the farm. It is the biggest animal here, so Ming looks up at it.', zh: '农场里有一头牛。它是这儿最大的动物，所以明明仰头看它。' },
      { art: 'farm|mom,ming|cow|♪', en: 'The cow is brown. Its nose is soft.', zh: '奶牛是棕色的。鼻子软软的。' },
      { art: 'farm|mom,ming|cow|👀', en: 'The cow is big. Ming looks up at it, and he takes one step back.', zh: '牛很大。明明仰头看它，往后退了一步。' },
      { art: 'farm|mom,ming|cow|?', en: 'The cow eats grass. It eats slowly because it has all day.', zh: '牛吃草。它吃得很慢，因为它有一整天。' },
      { art: 'farm|mom,ming|cow|·', en: 'The cow eats and eats. It does not look at Ming.', zh: '奶牛吃个不停。它没看明明。' },
      { art: 'farm|mom,ming|cow|!', en: 'Ming looks at the cow. He stays near the gate so he can run if he needs to.', zh: '明明看着牛。他站在门边，需要时好跑开。' },
      { art: 'farm|mom,ming|cow|♥', en: 'The cow is calm. Its tail goes slowly.', zh: '奶牛很安静。尾巴慢慢甩着。' },
      { art: 'farm|mom,ming|cow|★', en: 'Ming is not afraid. He takes one step closer, and the cow does not move.', zh: '明明不怕。他往前迈了一步，牛没有动。' },
      { art: 'farm|mom,ming|cow|…', en: 'Ming gives the cow grass. He puts it on the ground because his hand is small.', zh: '明明给牛喂草。他把草放在地上，因为他的手太小。' },
      { art: 'farm|mom,ming|cow|·', en: 'The brown cow. It takes the grass.', zh: '棕色的奶牛。它把草吃了。' },
      { art: 'farm|mom,ming|cow|♥', en: 'The cow likes Ming. It comes near him when he holds out the grass.', zh: '牛喜欢明明。他递出草的时候，牛走近了。' },
      { art: 'farm|mom,ming|cow|·', en: 'Ming likes the cow. He pats its nose.', zh: '明明喜欢这头牛。他拍了拍它的鼻子。' },
      { art: 'farm|mom,ming|cow|…', en: 'A cow on the farm. He will come back because the cow is his friend now.', zh: '农场里的牛。他还会回来，因为这头牛现在是他的朋友了。' }
    ],
    quiz: [
      { q: '明明把草放在哪儿给牛吃？', opts: ['放进桶里', '拿在手里', '放在地上'], a: 2, kind: 'recall' },
      { q: '明明一开始为什么站在门边？', opts: ['奶奶让他在那儿等', '门边有草', '牛太大，他有点怕，好跑开'], a: 2, kind: 'infer' },
      { q: '靠近大动物，你会怎么做？', opts: ['大声吓它', '追它', '轻轻的，让它不怕你'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b90', lv: 'L8', tag: '家里', title: 'A House with a Window', zh: '有窗的房子',
    emoji: '🏠', color: '#F6C9E3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 1 个新词（汤）。',
    trap: 'ou / ow 读 /aʊ/，oi / oy 读 /ɔɪ/；长句按意思分组读，别逐词蹦。',
    summary: '《有窗的房子》：这是一个完整的小故事。读前先看词卡（汤）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，按做事情的顺序讲一遍，至少用上三个本本词卡。',
    think: '说说你家的一扇窗户：从那里能看到什么？',
    pre: [
      { art: '🍲', en: 'soup', zh: '汤' },
      { art: '🪟', en: 'window', zh: '窗户' },
      { art: '🏠', en: 'house', zh: '房子' }
    ],
    sight: ['floor', 'hears', 'kitchen', 'near'],
    newWords: [
      { w: 'soup', zh: '汤' }
    ],
    pages: [
      { art: 'home|dad,lili|house|·', en: 'A house is on the hill. It is not big, but it is warm.', zh: '山上有一座房子。它不大，但很暖和。' },
      { art: 'home|dad,lili|house|♪', en: 'The house has a window. The window faces the town, so Ming can see far.', zh: '房子有一扇窗。窗朝着镇子，所以明明能看很远。' },
      { art: 'home|dad,lili|house|👀', en: 'The window is big. Ming can see out of it.', zh: '窗子很大。明明能从这儿往外看。' },
      { art: 'home|dad,lili|house|?', en: 'The sun comes in the window. It makes a bright line that moves across the floor.', zh: '阳光从窗户照进来。它在地上画出一条会移动的亮线。' },
      { art: 'home|dad,lili|house|·', en: 'The house is nice. It is warm in winter.', zh: '房子很舒服。冬天屋里很暖和。' },
      { art: 'home|dad,lili|house|!', en: 'Ming lives in the house. His room is near the window, so he hears the birds.', zh: '明明住在这座房子里。他的房间挨着窗，所以能听见鸟叫。' },
      { art: 'home|dad,lili|house|♥', en: 'Ming opens the window. He sees the hill and the road.', zh: '明明打开窗户。他看见小山和那条路。' },
      { art: 'home|dad,lili|house|★', en: 'Ming sees the hill. A tree stands on it, and its leaves move in the wind.', zh: '明明看见那座山。山上立着一棵树，叶子在风里动。' },
      { art: 'home|dad,lili|house|…', en: 'A house with a window. At night the window is dark.', zh: '有窗的房子。到了夜里窗子暗下来。' },
      { art: 'home|dad,lili|house|·', en: 'Ming likes the window. He sits there to read when the sun is warm.', zh: '明明喜欢这扇窗。太阳暖和的时候，他坐在那儿看书。' },
      { art: 'home|dad,lili|house|♥', en: '"Soup is ready," Mom says. The kitchen smells good.', zh: '「汤好了。」妈妈说。厨房里香香的。' },
      { art: 'home|dad,lili|house|·', en: 'Home is good. The light is on.', zh: '家真让人安心。灯亮着。' },
      { art: 'home|dad,lili|house|…', en: 'Ming likes the house. He is glad to be home when the day is over.', zh: '明明喜欢这座房子。一天结束的时候，他很高兴回到家。' }
    ],
    quiz: [
      { q: '阳光从窗户进来，在地上留下了什么？', opts: ['一片影子', '一条会移动的亮线', '一些水'], a: 1, kind: 'recall' },
      { q: '明明为什么喜欢待在这扇窗边？', opts: ['窗边有他的床', '窗外有小朋友', '这里能看很远，太阳暖时还能看书'], a: 2, kind: 'infer' },
      { q: '住在有窗户的房子里，你会怎么做？', opts: ['一直拉着窗帘', '看看窗外，让阳光进来', '不看'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b91', lv: 'L8', tag: '数学', title: 'Count the Coins', zh: '数硬币',
    emoji: '🪙', color: '#BFE6DF',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 2 个新词（硬币、玩具）。',
    trap: 'ou / ow 读 /aʊ/，oi / oy 读 /ɔɪ/；长句按意思分组读，别逐词蹦。',
    summary: '《数硬币》：这是一个完整的小故事。读前先看词卡（硬币、玩具）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，按做事情的顺序讲一遍，至少用上三个本本词卡。',
    think: '说说你数过的一样东西。',
    pre: [
      { art: '🪙', en: 'coin', zh: '硬币' },
      { art: '🧸', en: 'toy', zh: '玩具' },
      { art: '📦', en: 'box', zh: '盒子' },
      { art: '📦', en: 'line', zh: '线' }
    ],
    sight: ['care'],
    newWords: [
      { w: 'coin', zh: '硬币' },
      { w: 'toy', zh: '玩具' }
    ],
    pages: [
      { art: 'home|ming,grandma|coin|·', en: 'Ming has coins. They are in a small box that Grandma gave him.', zh: '明明有硬币。它们放在奶奶给他的一个小盒子里。' },
      { art: 'home|ming,grandma|coin|♪', en: 'The coins are small. Some are brown, and some are bright.', zh: '硬币很小。有些是褐色的，有些亮亮的。' },
      { art: 'home|ming,grandma|coin|👀', en: 'Ming counts the coins. He puts them in a line so he will not miss one.', zh: '明明数硬币。他把它们排成一行，免得漏掉。' },
      { art: 'home|ming,grandma|coin|?', en: 'One coin, two coins, three coins. He points to each one.', zh: '一枚、两枚、三枚。他一个一个点过去。' },
      { art: 'home|ming,grandma|coin|·', en: 'Ming counts again. He starts from one again because he is not sure.', zh: '明明又数一遍。他从一重新开始，因为他不确定。' },
      { art: 'home|ming,grandma|coin|!', en: 'Now there are more coins. Grandma gives him two more when she comes in.', zh: '现在硬币多了。奶奶进来的时候又给了他两个。' },
      { art: 'home|ming,grandma|coin|♥', en: 'Ming counts them all. He goes slowly this time so he gets it right.', zh: '明明把它们全数了。这次他数得慢，好数对。' },
      { art: 'home|ming,grandma|coin|★', en: 'The coins are here. He puts them back in the box.', zh: '硬币都在这儿。他把它们放回盒子里。' },
      { art: 'home|ming,grandma|coin|…', en: 'Count the coins. It takes care.', zh: '数硬币。得细心才行。' },
      { art: 'home|ming,grandma|coin|·', en: 'Ming likes to count. He counts the plates too when he puts them out.', zh: '明明喜欢数数。摆桌子的时候，他连盘子也数。' },
      { art: 'home|ming,grandma|coin|♥', en: 'Ming keeps the coins. He will buy a small toy.', zh: '明明把硬币收好。他要买一个小玩具。' },
      { art: 'home|ming,grandma|coin|·', en: 'Counting is fun. He shows Grandma how many, and she says he is right.', zh: '数数很有趣。他告诉奶奶有多少，奶奶说他数对了。' },
      { art: 'home|ming,grandma|coin|…', en: 'Ming will count more tomorrow. He wants to get it right.', zh: '明天明明还要数更多。他想数得一点不差。' }
    ],
    quiz: [
      { q: '明明把硬币排成一行，是为了什么？', opts: ['送给奶奶', '数清楚，免得漏掉', '好看'], a: 1, kind: 'recall' },
      { q: '明明在数什么？', opts: ['硬币', '书', '苹果'], a: 0, kind: 'infer' },
      { q: '数数总是数错，你会怎么做？', opts: ['不数了', '随便说一个数', '从头按顺序数，一个一个来'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b92', lv: 'L8', tag: '趣事', title: 'A Loud Shout at Night', zh: '夜里的一声喊',
    emoji: '🌃', color: '#F2E2A8',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 1 个新词（喊）。',
    trap: 'ou / ow 读 /aʊ/，oi / oy 读 /ɔɪ/；长句按意思分组读，别逐词蹦。',
    summary: '《夜里的一声喊》：这是一个完整的小故事。读前先看词卡（喊）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，按做事情的顺序讲一遍，至少用上三个本本词卡。',
    think: '说说你夜里听到过的一种声音。',
    pre: [
      { art: '🏃', en: 'shout', zh: '喊' },
      { art: '🛏️', en: 'bed', zh: '床' },
      { art: '🌿', en: 'wind', zh: '风' }
    ],
    sight: ['knows', 'quiet'],
    newWords: [
      { w: 'shout', zh: '喊' }
    ],
    pages: [
      { art: 'night|lili,grandpa|night|·', en: 'Night is here. The house is dark, and the wind is up.', zh: '夜晚到了。屋子里黑黑的，风也起来了。' },
      { art: 'night|lili,grandpa|night|♪', en: 'All is quiet. Even the dog is quiet.', zh: '四下静悄悄的。连狗都不出声。' },
      { art: 'night|lili,grandpa|night|👀', en: 'Ming is in bed. The window is closed because the night is cold.', zh: '明明躺在床上。窗户关着，因为夜里冷。' },
      { art: 'night|lili,grandpa|night|?', en: 'A loud sound is outside. It comes again, and Ming sits up.', zh: '外面有一声响。它又响了一次，明明坐了起来。' },
      { art: 'night|lili,grandpa|night|·', en: 'Ming is up. He sits up in bed.', zh: '明明醒了。他在床上坐起来。' },
      { art: 'night|lili,grandpa|night|!', en: '"What was that?" Ming asks. He listens hard so he can hear it again.', zh: '「那是什么声音？」明明问。他使劲听，想再听见一次。' },
      { art: 'night|lili,grandpa|night|♥', en: 'Ming sits up in bed. He sees the trees.', zh: '明明在床上坐起来。他看见那些树。' },
      { art: 'night|lili,grandpa|night|★', en: 'It was the wind. It pushes at the window because it wants to come in.', zh: '是风。它推着窗户，因为它想进来。' },
      { art: 'night|lili,grandpa|night|…', en: 'Ming is not afraid. He knows what it is now, so he goes back to bed.', zh: '明明不怕。他现在知道那是什么了，所以又躺下了。' },
      { art: 'night|lili,grandpa|night|·', en: 'Ming goes back to bed. He is warm again.', zh: '明明躺回去。身上又暖和了。' },
      { art: 'night|lili,grandpa|night|♥', en: 'A loud shout at night. It was only the wind that pushed the window.', zh: '夜里的一声喊。那只是推窗户的风。' },
      { art: 'night|lili,grandpa|night|·', en: 'The wind can be loud. But it cannot come in because the window is closed.', zh: '风可以很响。但它进不来，因为窗户关着。' },
      { art: 'night|lili,grandpa|night|…', en: 'Ming sleeps well. In the morning he tells Mom.', zh: '明明睡得很好。早上他讲给妈妈听。' }
    ],
    quiz: [
      { q: '夜里是什么在推窗户？', opts: ['一只猫', '风', '一只鸟'], a: 1, kind: 'recall' },
      { q: '弄明白那声响是风以后，明明怎么样了？', opts: ['不怕了，又躺回去睡', '跑去找妈妈', '一直没睡着'], a: 0, kind: 'infer' },
      { q: '夜里听到奇怪的声音，你会怎么做？', opts: ['躲起来不出声', '看一看弄清楚是什么，别慌', '一直哭'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b93', lv: 'L8', tag: '发音', title: 'Say It: House, Cow', zh: '说一说：house cow',
    emoji: '🗣️', color: '#D9D2F5',
    track: 'drill',
    goal: '把本级难点音听准、说准，并能在整句里读对。不引入新词，全部是读过的词。',
    trap: 'ou / ow 读 /aʊ/，oi / oy 读 /ɔɪ/；长句按意思分组读，别逐词蹦。',
    summary: '《说一说：house cow》：这一本练两个词的音和形。读前先看词卡，都是学过的词；读的时候先看清每个词，再连起来读一遍。',
    retell: '把这一本练的两个词再读一遍，说说它们的音哪里一样、哪里不一样。',
    think: '找两个带 ow 的词，读一读、比一比。',
    pre: [
      { art: '🏠', en: 'house', zh: '房子' },
      { art: '🐄', en: 'cow', zh: '奶牛' }
    ],
    sight: [],
    newWords: [

    ],
    pages: [
      { art: 'table|grandma,mom|house|·', en: 'This is a house. It has "ow" at the end.', zh: '这是一座房子。结尾是 ow。' },
      { art: 'table|grandma,mom|house|♪', en: 'This is a cow. It has "ow" too.', zh: '这是一头牛。也有 ow。' },
      { art: 'table|grandma,mom|house|👀', en: 'House and cow.', zh: 'house 和 cow。' },
      { art: 'table|grandma,mom|house|?', en: 'Both have the "ow" sound. Listen to the two words, and say them slowly.', zh: '两个词都有 ow 的音。听听这两个词，慢慢说。' },
      { art: 'table|grandma,mom|house|·', en: 'Say "house". Say it slow.', zh: '读 house。慢慢读。' },
      { art: 'table|grandma,mom|house|!', en: 'Say "cow". Say it again.', zh: '读 cow。再读一遍。' },
      { art: 'table|grandma,mom|house|♥', en: 'House is not cow. They are different things, but the sound is the same.', zh: '房子不是牛。它们是不同的东西，可音是一样的。' },
      { art: 'table|grandma,mom|house|★', en: 'The "ow" sounds the same. The first sounds do not, so listen carefully.', zh: 'ow 的音一样。开头的音不一样，所以要仔细听。' },
      { art: 'table|grandma,mom|house|…', en: 'You can say both. Say them together, and keep the "ow" the same.', zh: '两个词你都能说。连起来说，ow 的音保持一样。' },
      { art: 'table|grandma,mom|house|·', en: 'House, cow, house, cow.', zh: 'house，cow，house，cow。' },
      { art: 'table|grandma,mom|house|♥', en: 'Good!', zh: '真棒！' },
      { art: 'table|grandma,mom|house|·', en: 'A house and a cow. Now find two more that have "ow".', zh: '一座房子和一头牛。现在再找两个带 ow 的词。' },
      { art: 'table|grandma,mom|house|…', en: 'Now say them together. Say them one more time when you are ready.', zh: '现在连起来说。准备好了再说一遍。' }
    ],
    quiz: [
      { q: 'house 和 cow 都有哪个音？', opts: ['ow 的音', 'ou 的音', 'oo 的音'], a: 0, kind: 'recall' },
      { q: '这一本在练什么？', opts: ['「ou」的音', '「oi」的音', '「ow」的音'], a: 2, kind: 'infer' },
      { q: '遇到带 ow 的单词，你会怎么读？', opts: ['分开读两个字母', '把 ow 读成一个音', '跳过去'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b94', lv: 'L8', tag: '小知识', title: 'Why the Moon Looks Round', zh: '月亮为什么圆',
    emoji: '🔭', color: '#FAD3B6',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。不引入新词，全部是读过的词。',
    trap: 'ou / ow 读 /aʊ/，oi / oy 读 /ɔɪ/；长句按意思分组读，别逐词蹦。',
    summary: '《月亮为什么圆》：这一本从一件小事讲起，说说为什么会这样。读前先看词卡，都是学过的词；读的时候留意先看到什么、为什么会这样、后来怎么弄明白。',
    retell: '合上书，按「先看到什么 → 为什么会这样 → 后来怎么弄明白」讲一遍。',
    think: '说说月亮为什么有时候圆、有时候弯。',
    pre: [
      { art: '🌙', en: 'moon', zh: '月亮' },
      { art: '☀️', en: 'sun', zh: '太阳' }
    ],
    sight: ['friend'],
    newWords: [

    ],
    pages: [
      { art: 'kitchen|grandpa,dad|mooncake|·', en: 'The moon looks round. It is far away in the sky, so it looks small.', zh: '月亮看起来是圆的。它在天上很远，所以看着小。' },
      { art: 'kitchen|grandpa,dad|mooncake|♪', en: 'Why does the moon look round?', zh: '月亮为什么看起来是圆的？' },
      { art: 'kitchen|grandpa,dad|mooncake|👀', en: 'We see one side of the moon. The sun lights that side, and the rest is dark.', zh: '我们看见月亮的一面。太阳照亮那一面，其余部分是暗的。' },
      { art: 'kitchen|grandpa,dad|mooncake|?', en: 'The sun is bright on that side. The rest is dark because no light gets to it.', zh: '那一面太阳很亮。其余部分暗，因为没有光照到。' },
      { art: 'kitchen|grandpa,dad|mooncake|·', en: 'So we see a round moon, big like a mooncake. That is why it looks full.', zh: '所以我们看见圆圆的月亮，像月饼一样。这就是它看着圆满的缘故。' },
      { art: 'kitchen|grandpa,dad|mooncake|!', en: 'Sometimes the moon looks small. We see only a thin part, and the rest is dark.', zh: '有时月亮看起来很小。我们只看见细细的一块，其余是暗的。' },
      { art: 'kitchen|grandpa,dad|mooncake|♥', en: 'But it is the same moon. Nothing about it changes, only what we see.', zh: '可它还是同一个月亮。它本身没变，变的是我们看见的部分。' },
      { art: 'kitchen|grandpa,dad|mooncake|★', en: 'We see a different part. The dark part grows.', zh: '我们看见的是不同的部分。暗的那部分在变大。' },
      { art: 'kitchen|grandpa,dad|mooncake|…', en: 'Why the moon looks round. Now you can tell a friend when you see it.', zh: '月亮为什么看起来圆。现在你看见它的时候，能讲给朋友听了。' },
      { art: 'kitchen|grandpa,dad|mooncake|·', en: 'The moon is far away. It is much bigger than it looks.', zh: '月亮离我们很远。它比看上去大得多。' },
      { art: 'kitchen|grandpa,dad|mooncake|♥', en: 'Look at the moon tonight. See which part is bright, and which part is dark.', zh: '今晚看看月亮。看看哪一部分亮，哪一部分暗。' },
      { art: 'kitchen|grandpa,dad|mooncake|·', en: 'The moon is always there. In the day it is hard to see.', zh: '月亮一直都在。白天不容易看见它。' },
      { art: 'kitchen|grandpa,dad|mooncake|…', en: 'Look at it night after night. You will see it change because we see different parts.', zh: '一夜一夜地看。你会看见它变化，因为我们看到的部分不同。' }
    ],
    quiz: [
      { q: '我们在地球上能看到月亮的几面？', opts: ['每天看到的都不一样', '两面都能看到', '只有一面'], a: 2, kind: 'recall' },
      { q: '月亮为什么看起来是圆的？', opts: ['因为月亮是球', '太阳照亮了朝我们的一面', '因为天很黑'], a: 1, kind: 'infer' },
      { q: '想知道天象为什么这样，你会怎么做？', opts: ['不管它', '随便猜', '观察、问一问、查一查'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b95', lv: 'L8', tag: '小知识', title: 'Noodles in the South', zh: '南方的面条',
    emoji: '🍜', color: '#C8E7F0',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。认读 2 个新词（南方、面条）。',
    trap: 'ou / ow 读 /aʊ/，oi / oy 读 /ɔɪ/；长句按意思分组读，别逐词蹦。',
    summary: '《南方的面条》：这一本从一件小事讲起，说说为什么会这样。读前先看词卡（南方、面条）；读的时候留意先看到什么、为什么会这样、后来怎么弄明白。',
    retell: '合上书，按「先看到什么 → 为什么会这样 → 后来怎么弄明白」讲一遍。',
    think: '说说你喜欢的一种面食。',
    pre: [
      { art: '🌿', en: 'south', zh: '南方' },
      { art: '🍜', en: 'noodle', zh: '面条' },
      { art: '🍲', en: 'pot', zh: '锅' },
      { art: '💧', en: 'water', zh: '水' }
    ],
    sight: ['air'],
    newWords: [
      { w: 'south', zh: '南方' },
      { w: 'noodle', zh: '面条' }
    ],
    pages: [
      { art: 'kitchen|mom,ming|noodle|·', en: 'Some people eat noodles. In the south, many do, and they eat them often.', zh: '有些人吃面条。在南方，很多人都吃，而且常吃。' },
      { art: 'kitchen|mom,ming|noodle|♪', en: 'The noodles are long. They are thin and soft, so they cook fast.', zh: '面条很长。它们又细又软，所以熟得快。' },
      { art: 'kitchen|mom,ming|noodle|👀', en: 'Noodles are good to eat. They are warm in winter when the air is cold.', zh: '面条很好吃。冬天空气冷的时候，吃下去暖暖的。' },
      { art: 'kitchen|mom,ming|noodle|?', en: 'People make noodles. They make it into long lines.', zh: '人们做面条。把面团弄成细细的长条。' },
      { art: 'kitchen|mom,ming|noodle|·', en: 'The noodles go in the pot. The water boils, and they move in it.', zh: '面条下到锅里。水开着，它们在锅里翻滚。' },
      { art: 'kitchen|mom,ming|noodle|!', en: 'The noodles are ready soon. They do not take long.', zh: '面条很快就熟。用不了多久。' },
      { art: 'kitchen|mom,ming|noodle|♥', en: 'People eat the noodles. They eat them hot because they taste best then.', zh: '人们吃面条。他们趁热吃，因为那时最好吃。' },
      { art: 'kitchen|mom,ming|noodle|★', en: 'Long noodles are fun. They are hard to pick up, so people eat them slowly.', zh: '长面条很好玩。它们不好夹，所以人们用两根棍子。' },
      { art: 'kitchen|mom,ming|noodle|…', en: 'Noodles in the south. Each town has its own way.', zh: '南方的面条。每个镇子都有自己的做法。' },
      { art: 'kitchen|mom,ming|noodle|·', en: 'Ming likes noodles too. He eats them with Grandma when she makes them.', zh: '明明也喜欢面条。奶奶做的时候，他跟她一起吃。' },
      { art: 'kitchen|mom,ming|noodle|♥', en: 'Noodles are warm and good. They are best on a cold day, so people eat them in winter.', zh: '面条又暖又好吃。冷天最合适，所以人们冬天吃。' },
      { art: 'kitchen|mom,ming|noodle|·', en: 'You can eat a noodle too. Take one and taste it.', zh: '你也可以尝一根。夹起来尝尝。' },
      { art: 'kitchen|mom,ming|noodle|…', en: '"More noodles," Ming says. Grandma gives him more.', zh: '「再来点面条。」明明说。奶奶又给了他一些。' }
    ],
    quiz: [
      { q: '面条什么时候最好吃？', opts: ['趁热吃', '泡在汤里', '凉了吃'], a: 0, kind: 'recall' },
      { q: '天冷的时候，人们为什么爱吃面条？', opts: ['热腾腾的，吃下去暖和', '因为面条便宜', '因为别的都卖完了'], a: 0, kind: 'infer' },
      { q: '吃一种新食物，你会怎么做？', opts: ['尝一尝，看看喜不喜欢', '一口不吃', '只吃一种'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b96', lv: 'L8', tag: '复习', title: 'All Together Tonight', zh: '今晚大家在一起',
    emoji: '🏮', color: '#E8D9B5',
    track: 'review',
    goal: '把本级和前面级别的词再读一遍、串成一个故事。不引入新词，全部是读过的词。',
    trap: 'ou / ow 读 /aʊ/，oi / oy 读 /ɔɪ/；长句按意思分组读，别逐词蹦。',
    summary: '《今晚大家在一起》：这是一个完整的小故事。读前先看词卡，都是学过的词；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，按做事情的顺序讲一遍，至少用上三个本本词卡。',
    think: '说说你和家人在一起的一个晚上。',
    pre: [
      { art: '🏙️', en: 'town', zh: '小镇' },
      { art: '🏠', en: 'house', zh: '房子' }
    ],
    sight: ['knows', 'laugh', 'quiet'],
    newWords: [

    ],
    pages: [
      { art: 'library|dad,lili|town|·', en: 'The town is quiet. The shops are closed, and the streets are empty.', zh: '镇子很安静。店铺关了，街上空空的。' },
      { art: 'library|dad,lili|town|♪', en: 'Everyone is together. No one is away tonight, so the house is full.', zh: '大家都在一起。今晚谁也没出门，所以屋里满满的。' },
      { art: 'library|dad,lili|town|👀', en: 'The houses have lights. Each window is bright because every family is home.', zh: '家家都亮着灯。每扇窗都亮，因为每家人都回来了。' },
      { art: 'library|dad,lili|town|?', en: 'Ming is with the family. Grandpa talks about the farm.', zh: '明明和家人在一起。爷爷讲起农场的事。' },
      { art: 'library|dad,lili|town|·', en: 'They eat together. There are dumplings and soup, and the table is full.', zh: '他们一起吃饭。有饺子有汤，桌子摆得满满的。' },
      { art: 'library|dad,lili|town|!', en: 'They talk and laugh. Ming shows them his drawing when they ask.', zh: '他们又说又笑。大家问起的时候，明明拿出自己的画。' },
      { art: 'library|dad,lili|town|♥', en: 'The town is warm tonight. The wind is cold.', zh: '今晚镇上很暖。风是凉的。' },
      { art: 'library|dad,lili|town|★', en: 'All together tonight. Grandma sits by Ming, and she holds his hand.', zh: '今晚大家在一起。奶奶坐在明明旁边，握着他的手。' },
      { art: 'library|dad,lili|town|…', en: 'The family is happy. Ming looks at them all.', zh: '一家人很开心。明明看着他们每一个人。' },
      { art: 'library|dad,lili|town|·', en: 'The town is a good place. He knows every street because he grew up here.', zh: '这个镇子他熟得很。每一条街他都知道，因为他在这儿长大。' },
      { art: 'library|dad,lili|town|♥', en: 'Ming likes the town. He likes the market and the park.', zh: '明明喜欢这个镇子。他喜欢市场和公园。' },
      { art: 'library|dad,lili|town|·', en: 'Together is good. They will do this again when the next big day comes.', zh: '在一起真好。下个节日来的时候，他们还会这样。' },
      { art: 'library|dad,lili|town|…', en: 'A good night in the town. Ming does not want it to end.', zh: '镇上美好的一夜。明明不想让它结束。' }
    ],
    quiz: [
      { q: '今晚屋里为什么满满的？', opts: ['房子很小', '来了很多客人', '谁也没出门，大家都在'], a: 2, kind: 'recall' },
      { q: '今晚大家在做什么？', opts: ['各干各的', '一起吃饭、说笑', '都不在家'], a: 1, kind: 'infer' },
      { q: '和家人在一起的时光，你会怎么做？', opts: ['只顾自己', '不参加', '珍惜它，好好陪着家人'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b97', lv: 'L9', tag: '出行', title: 'The Photo at the Station', zh: '车站的照片',
    emoji: '📷', color: '#F6C6C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 2 个新词（车站、照片）。',
    trap: 'kn / wr / ph 里的第一个字母不发音；读长句时先找主句，再读从句。',
    summary: '《车站的照片》：这是一个完整的小故事。读前先看词卡（车站、照片）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '不看书写一段 5 句的口头小结，再说说这件事让你想到什么。',
    think: '说说一张你觉得珍贵的照片。',
    pre: [
      { art: '🚉', en: 'station', zh: '车站' },
      { art: '📷', en: 'photo', zh: '照片' },
      { art: '🌿', en: 'wind', zh: '风' },
      { art: '📦', en: 'train', zh: '火车' }
    ],
    sight: ['flies'],
    newWords: [
      { w: 'station', zh: '车站' },
      { w: 'photo', zh: '照片' }
    ],
    pages: [
      { art: 'home|ming,grandma|photo|·', en: 'Ming is at the station. The train comes late, so he waits a long time.', zh: '明明在车站。火车晚点了，所以他等了很久。' },
      { art: 'home|ming,grandma|photo|♪', en: 'Ming has a photo. He keeps it in his bag so it will not get lost.', zh: '明明有一张照片。他把它放在书包里，免得弄丢。' },
      { art: 'home|ming,grandma|photo|👀', en: 'The photo is of the family. It is from an autumn day, when Ming was small.', zh: '照片上是全家人。那是秋天的一天，明明还很小。' },
      { art: 'home|ming,grandma|photo|?', en: 'Ming looks at the photo. He finds Grandma in it, and he smiles.', zh: '明明看着照片。他在里面找到了奶奶，笑了起来。' },
      { art: 'home|ming,grandma|photo|·', en: 'The family is in the photo. They stand in front of the house where Ming grew up.', zh: '一家人在照片里。他们站在明明长大的那座房子前。' },
      { art: 'home|ming,grandma|photo|!', en: 'Grandma is in the photo. She holds the big cake that she made that morning.', zh: '奶奶在照片里。她捧着那天早上做的大蛋糕。' },
      { art: 'home|ming,grandma|photo|♥', en: 'Ming is in the photo too. He was much smaller then, because he was only six.', zh: '明明也在照片里。那时他小得多，因为他才六岁。' },
      { art: 'home|ming,grandma|photo|★', en: 'Ming takes it out again. He wants one more look before the train comes.', zh: '明明又把它拿出来。他想在火车来之前再看一眼。' },
      { art: 'home|ming,grandma|photo|…', en: 'The wind comes in, and the photo flies up before Ming can catch it.', zh: '风灌进来，照片在明明抓住之前就飞了起来。' },
      { art: 'home|ming,grandma|photo|·', en: 'It falls by a bench. Ming runs after it because he wants it back.', zh: '照片掉在长椅旁。明明追了过去，因为他不想把它弄丢。' },
      { art: 'home|ming,grandma|photo|♥', en: '"Is this yours?" the man asks. He gives it back before the wind takes it.', zh: '「这是你的吗？」那位叔叔问。他在风再次刮走它之前还了回来。' },
      { art: 'home|ming,grandma|photo|·', en: 'Ming says thank you. He checks the photo because he wants to be sure it is whole.', zh: '明明道谢。他检查照片，因为他想确认它还是完整的。' },
      { art: 'home|ming,grandma|photo|…', en: 'It is clean. He puts it deep in his bag so the wind cannot get it again.', zh: '照片干净了。他把它放进书包深处，好让风再也吹不到。' },
      { art: 'home|ming,grandma|photo|?', en: 'Ming likes the photo. At home he will show it to Grandma, and she will smile.', zh: '明明喜欢这张照片。回家他要拿给奶奶看，她一定会笑。' }
    ],
    quiz: [
      { q: '照片被风刮走后，是谁捡回来的？', opts: ['一位叔叔', '奶奶', '列车员'], a: 0, kind: 'recall' },
      { q: '照片里有谁？', opts: ['只有奶奶', '只有明明', '全家人'], a: 2, kind: 'infer' },
      { q: '想留住一个好的时刻，你会怎么做？', opts: ['拍张照片或写下来记着', '什么也不做', '马上忘掉'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b98', lv: 'L9', tag: '上课', title: 'A Question on the Board', zh: '黑板上的问题',
    emoji: '📋', color: '#F9DFB4',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 1 个新词（班）。',
    trap: 'kn / wr / ph 里的第一个字母不发音；读长句时先找主句，再读从句。',
    summary: '《黑板上的问题》：这是一个完整的小故事。读前先看词卡（班）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '不看书写一段 5 句的口头小结，再说说这件事让你想到什么。',
    think: '说说你答对过的一道难题。',
    pre: [
      { art: '📦', en: 'class', zh: '班' },
      { art: '📦', en: 'word', zh: '词' },
      { art: '❓', en: 'question', zh: '问题' }
    ],
    sight: [],
    newWords: [
      { w: 'class', zh: '班' }
    ],
    pages: [
      { art: 'library|lili,grandpa|question|·', en: 'A question is on the board. The teacher put it there before the class came in.', zh: '黑板上有一个问题。老师在大家进教室之前就写上去了。' },
      { art: 'library|lili,grandpa|question|♪', en: 'The question is hard. It has many words that no one knows.', zh: '这个问题很难。里面有很多大家都不认识的词。' },
      { art: 'library|lili,grandpa|question|👀', en: 'The class looks at it. The class is quiet because no one is sure.', zh: '全班看着它。教室里很安静，因为谁都没把握。' },
      { art: 'library|lili,grandpa|question|?', en: 'No one answers at first. Ming does not put up his hand because he is not sure.', zh: '一开始没人回答。明明没举手，因为他没把握。' },
      { art: 'library|lili,grandpa|question|·', en: 'Ming reads the question again. He reads it word by word so he can find a part he knows.', zh: '明明又读了一遍。他一个词一个词地读，想找出自己认识的部分。' },
      { art: 'library|lili,grandpa|question|!', en: 'Ming finds a small part. It is one word that he knows well.', zh: '明明找到了一小部分。那是一个他很熟的词。' },
      { art: 'library|lili,grandpa|question|♥', en: 'Ming thinks about that part. He writes it on his paper.', zh: '明明就着这一小处想。他把它写在纸上。' },
      { art: 'library|lili,grandpa|question|★', en: 'Ming raises a hand. The teacher asks him to try, and the class turns to look.', zh: '明明举起手。老师让他试试，全班都转过头来看。' },
      { art: 'library|lili,grandpa|question|…', en: 'Ming gives an answer. He says it slowly because he wants to be clear.', zh: '明明给出了答案。他说得很慢，因为他想说得清楚。' },
      { art: 'library|lili,grandpa|question|·', en: 'The answer is right. The teacher smiles, and the class claps.', zh: '答案对了。老师笑了，全班鼓起掌来。' },
      { art: 'library|lili,grandpa|question|♥', en: 'Ming sits down again. He is glad that he tried.', zh: '明明又坐下。他很高兴自己试过了。' },
      { art: 'library|lili,grandpa|question|·', en: 'A good answer starts small. He found one word first.', zh: '好答案从一小处开始。他先找到了一个词。' },
      { art: 'library|lili,grandpa|question|…', en: 'The class is glad. They clap for Ming because he found the way.', zh: '全班都很高兴。他们为明明鼓掌，因为他找到了办法。' },
      { art: 'library|lili,grandpa|question|?', en: 'Ming is glad too. He will try the next hard one when it comes.', zh: '明明也很高兴。下一个难题来的时候，他还要试。' }
    ],
    quiz: [
      { q: '明明是怎么找到答案的？', opts: ['问了同桌', '先找出自己认识的那一个词', '翻了课本'], a: 1, kind: 'recall' },
      { q: '先把认识的一个词找出来，这个办法为什么管用？', opts: ['因为老师会提示', '大难题被拆小，就不那么难了', '因为那个词最简单'], a: 1, kind: 'infer' },
      { q: '遇到一个很难的问题，你会怎么做？', opts: ['直接放弃', '随便猜', '先找一个小地方，一点点想'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b99', lv: 'L9', tag: '观察', title: 'The Shadow in the Field', zh: '田里的影子',
    emoji: '🌾', color: '#CDE7C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 3 个新词（田地、影子、中午）。',
    trap: 'kn / wr / ph 里的第一个字母不发音；读长句时先找主句，再读从句。',
    summary: '《田里的影子》：这是一个完整的小故事。读前先看词卡（田地、影子、中午）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '不看书写一段 5 句的口头小结，再说说这件事让你想到什么。',
    think: '说说你观察过的影子变化。',
    pre: [
      { art: '🌾', en: 'field', zh: '田地' },
      { art: '🌑', en: 'shadow', zh: '影子' },
      { art: '⏰', en: 'noon', zh: '中午' },
      { art: '☀️', en: 'sun', zh: '太阳' },
      { art: '🌿', en: 'light', zh: '光' }
    ],
    sight: [],
    newWords: [
      { w: 'field', zh: '田地' },
      { w: 'shadow', zh: '影子' },
      { w: 'noon', zh: '中午' }
    ],
    pages: [
      { art: 'night|grandma,mom|shadow|·', en: 'Ming is in the field. It is a warm morning, and the sun is high.', zh: '明明在田里。这是个暖和的早晨，太阳很高。' },
      { art: 'night|grandma,mom|shadow|♪', en: 'The sun is high. There are no clouds, so the light is strong.', zh: '太阳很高。天上没有云，所以光很强。' },
      { art: 'night|grandma,mom|shadow|👀', en: 'Ming sees a shadow. It is dark on the grass, and it moves with him.', zh: '明明看见一个影子。它在草地上黑黑的，还跟着他动。' },
      { art: 'night|grandma,mom|shadow|?', en: 'The shadow follows Ming. It stays right behind him.', zh: '影子跟着明明。就贴在他身后。' },
      { art: 'night|grandma,mom|shadow|·', en: 'When Ming moves, it moves. He takes a step and it takes one too.', zh: '明明一动，它也动。他迈一步，它也迈一步。' },
      { art: 'night|grandma,mom|shadow|!', en: 'The shadow is long in the morning. It goes far across the field because the sun is not high.', zh: '早晨影子很长。它一直伸到田那头，因为太阳很低。' },
      { art: 'night|grandma,mom|shadow|♥', en: 'At noon the shadow is short. It sits right under him because the sun is high over him.', zh: '中午影子很短。它就在他脚底下，因为太阳在头顶上。' },
      { art: 'night|grandma,mom|shadow|★', en: 'The shadow grows again. The sun is going down, so the shadow gets longer.', zh: '影子又变长了。太阳在下山，所以影子越来越长。' },
      { art: 'night|grandma,mom|shadow|…', en: 'Why does the shadow change? Ming asks Grandma because he wants to know.', zh: '影子为什么会变？明明去问奶奶，因为他想知道。' },
      { art: 'night|grandma,mom|shadow|·', en: 'The sun moves across the sky. It is not high now, so the shadow grows again.', zh: '太阳在天上移过去。它现在不高了，于是影子又变长。' },
      { art: 'night|grandma,mom|shadow|♥', en: 'The shadow changes with the sun. That is the answer that Grandma gives him.', zh: '影子跟着太阳变。这就是奶奶给他的答案。' },
      { art: 'night|grandma,mom|shadow|·', en: 'Ming marks the two places. He will come back at noon.', zh: '明明把两个位置记下来。中午他要再来看。' },
      { art: 'night|grandma,mom|shadow|…', en: 'Ming watches the shadow. He wants to check his answer when the sun is high.', zh: '明明看着影子。他想等太阳升高时验证自己的答案。' },
      { art: 'night|grandma,mom|shadow|?', en: 'At noon it is short again. Grandma was right, and now Ming knows why.', zh: '中午它又变短了。奶奶说得对，现在明明知道为什么了。' }
    ],
    quiz: [
      { q: '中午的时候，影子是什么样？', opts: ['又短又小，就在脚底下', '拉得很长', '看不见了'], a: 0, kind: 'recall' },
      { q: '影子为什么会变？', opts: ['因为风大', '因为太阳在天上移动', '因为影子自己动'], a: 1, kind: 'infer' },
      { q: '想弄清影子的秘密，你会怎么做？', opts: ['只看一次', '不管它', '一天里多看几次，比一比'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b100', lv: 'L9', tag: '农事', title: 'Wheat and Harvest', zh: '小麦和收成',
    emoji: '🌾', color: '#C6DEF6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 5 个新词（小麦、收成、尖、工具、收集）。',
    trap: 'kn / wr / ph 里的第一个字母不发音；读长句时先找主句，再读从句。',
    summary: '《小麦和收成》：这是一个完整的小故事。读前先看词卡（小麦、收成、尖、工具、收集）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '不看书写一段 5 句的口头小结，再说说这件事让你想到什么。',
    think: '说说小麦是怎么变成食物的。',
    pre: [
      { art: '🌾', en: 'wheat', zh: '小麦' },
      { art: '🍚', en: 'harvest', zh: '收成' },
      { art: '✨', en: 'sharp', zh: '尖' },
      { art: '📦', en: 'tool', zh: '工具' },
      { art: '🏃', en: 'gather', zh: '收集' },
      { art: '☀️', en: 'sun', zh: '太阳' },
      { art: '📦', en: 'cart', zh: '手推车' }
    ],
    sight: ['field', 'piece'],
    newWords: [
      { w: 'wheat', zh: '小麦' },
      { w: 'harvest', zh: '收成' },
      { w: 'sharp', zh: '尖' },
      { w: 'tool', zh: '工具' },
      { w: 'gather', zh: '收集' }
    ],
    pages: [
      { art: 'farm|grandpa,dad|wheat|·', en: 'Wheat grows in the field. It was planted in winter, and it grows all spring.', zh: '小麦长在田里。它是冬天种下的，整个春天都在长。' },
      { art: 'farm|grandpa,dad|wheat|♪', en: 'The wheat is tall now. It is very tall, and the heads are full.', zh: '小麦现在很高。它长得非常高，穗子都饱满了。' },
      { art: 'farm|grandpa,dad|wheat|👀', en: 'The wheat is yellow. The green has gone because the sun has been strong.', zh: '小麦黄了。绿色退掉了，因为太阳一直很足。' },
      { art: 'farm|grandpa,dad|wheat|?', en: 'It is time to harvest. The farmer comes early because the day will be hot.', zh: '该收割了。农民来得很早，因为白天会热。' },
      { art: 'farm|grandpa,dad|wheat|·', en: 'The farmer cuts the wheat. He uses a sharp tool.', zh: '农民割麦子。他用一把锋利的工具。' },
      { art: 'farm|grandpa,dad|wheat|!', en: 'They gather the wheat. They put it in a cart so it can go home.', zh: '他们把小麦收起来。装进车里，好运到谷仓。' },
      { art: 'farm|grandpa,dad|wheat|♥', en: 'The wheat is dry now. The sun made it dry before the rain came.', zh: '小麦现在干了。雨来之前，太阳就把它晒干了。' },
      { art: 'farm|grandpa,dad|wheat|★', en: 'The wheat is good. The heads are full because the rain came at the right time.', zh: '小麦长得好。穗子饱满，因为雨下得正是时候。' },
      { art: 'farm|grandpa,dad|wheat|…', en: 'The farmer looks at the cart. It is full too.', zh: '农民看着手推车。车也装满了。' },
      { art: 'farm|grandpa,dad|wheat|·', en: 'The harvest is big this year. He is glad, and he thanks the workers.', zh: '今年收成很好。他很高兴，向帮工道谢。' },
      { art: 'farm|grandpa,dad|wheat|♥', en: 'They work hard for it. Their backs hurt, but no one stops.', zh: '他们为它辛苦。背都酸了，可谁也没停下。' },
      { art: 'farm|grandpa,dad|wheat|·', en: 'The wheat becomes food. It is made into bread that we eat every day.', zh: '小麦变成食物。做成我们每天吃的面包。' },
      { art: 'farm|grandpa,dad|wheat|…', en: 'We eat the bread from wheat. Ming eats a piece.', zh: '我们吃麦子做的面包。明明吃了一块。' },
      { art: 'farm|grandpa,dad|wheat|?', en: 'The harvest feeds many. Now Ming knows why they work.', zh: '收成养活很多人。明明这下懂了他们为什么辛苦。' }
    ],
    quiz: [
      { q: '收下来的小麦最后变成了什么？', opts: ['喂牲口的料', '我们每天吃的面包', '明年的种子'], a: 1, kind: 'recall' },
      { q: '农民为什么天没亮就下地？', opts: ['因为要赶火车', '白天会热，趁早干活', '因为麦子夜里长'], a: 1, kind: 'infer' },
      { q: '辛苦种的东西有了收获，你会怎么做？', opts: ['不管它', '珍惜它，不浪费', '随便扔掉'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b101', lv: 'L9', tag: '工具', title: 'A Knife and a Wheel', zh: '刀和轮子',
    emoji: '⚙️', color: '#E0CFF3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 3 个新词（刀、轮子、摸）。',
    trap: 'kn / wr / ph 里的第一个字母不发音；读长句时先找主句，再读从句。',
    summary: '《刀和轮子》：这是一个完整的小故事。读前先看词卡（刀、轮子、摸）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '不看书写一段 5 句的口头小结，再说说这件事让你想到什么。',
    think: '说说两种用处不同的工具。',
    pre: [
      { art: '🔪', en: 'knife', zh: '刀' },
      { art: '⚙️', en: 'wheel', zh: '轮子' },
      { art: '🏃', en: 'touch', zh: '摸' },
      { art: '📦', en: 'cart', zh: '手推车' },
      { art: '🍚', en: 'pork', zh: '猪肉' }
    ],
    sight: ['carries'],
    newWords: [
      { w: 'knife', zh: '刀' },
      { w: 'wheel', zh: '轮子' },
      { w: 'touch', zh: '摸' }
    ],
    pages: [
      { art: 'library|mom,ming|knife|·', en: 'A knife and a wheel are on the table. One cuts, and one turns.', zh: '桌上有一把刀和一个轮子。一个用来切，一个用来转。' },
      { art: 'library|mom,ming|knife|♪', en: 'The knife is sharp. It can cut an apple, but Ming must be careful.', zh: '刀很锋利。能切苹果，但明明要小心。' },
      { art: 'library|mom,ming|knife|👀', en: 'The wheel is round. It turns on a cart.', zh: '轮子是圆的。它装在手推车上转。' },
      { art: 'library|mom,ming|knife|?', en: 'The knife cuts things. Grandma uses it for the pork, and she cuts slowly.', zh: '刀能切东西。奶奶用它切猪肉，切得很慢。' },
      { art: 'library|mom,ming|knife|·', en: 'The wheel turns, and the cart goes down the road because of it.', zh: '轮子一转，车子就靠它往前走了。' },
      { art: 'library|mom,ming|knife|!', en: 'Both help people. But they help in different ways.', zh: '两样都帮人。可帮的方式不一样。' },
      { art: 'library|mom,ming|knife|♥', en: 'But the knife can hurt. Ming once cut his hand, so he learned to be careful.', zh: '可刀也会伤人。明明割过一次手，所以他学会了小心。' },
      { art: 'library|mom,ming|knife|★', en: 'Be careful with the knife. Grandma keeps it high so it is hard to get.', zh: '用刀要小心。奶奶把它放得很高，孩子们够不着。' },
      { art: 'library|mom,ming|knife|…', en: 'The wheel is safe to touch. Ming gives it a push.', zh: '轮子摸起来安全。明明推了它一下。' },
      { art: 'library|mom,ming|knife|·', en: 'One cuts, one carries. You can see the difference when you use them.', zh: '一个切，一个运。你用一用就能看出不同。' },
      { art: 'library|mom,ming|knife|♥', en: 'Ming puts the wheel back on the cart. Grandma puts the knife away because it is sharp.', zh: '明明把轮子装回车上。奶奶把刀收起来，因为它很锋利。' },
      { art: 'library|mom,ming|knife|·', en: 'He watches her cut the pork. She does it slowly because the knife is sharp.', zh: '他看她切肉。她切得慢，因为刀很锋利。' },
      { art: 'library|mom,ming|knife|…', en: 'Ming asks to try. Grandma says he can watch today, and he can try next year.', zh: '明明想试试。奶奶说今天先看，明年再试。' },
      { art: 'library|mom,ming|knife|?', en: 'A knife and a wheel. Ming pushes the cart to the gate.', zh: '一把刀和一个轮子。明明推着车到门口。' }
    ],
    quiz: [
      { q: '刀和轮子各自的本事是什么？', opts: ['两个都能转', '两个都能切', '一个切东西，一个让车子走'], a: 2, kind: 'recall' },
      { q: '用刀的时候要注意什么？', opts: ['越快越好', '不用注意', '要小心，别伤到自己'], a: 2, kind: 'infer' },
      { q: '用尖的、快的工具，你会怎么做？', opts: ['小心用，必要时请大人帮忙', '随便乱用', '不用了'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b102', lv: 'L9', tag: '提问', title: 'The Scientist and an Answer', zh: '科学家的答案',
    emoji: '🔬', color: '#F6C9E3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 1 个新词（科学家）。',
    trap: 'kn / wr / ph 里的第一个字母不发音；读长句时先找主句，再读从句。',
    summary: '《科学家的答案》：这是一个完整的小故事。读前先看词卡（科学家）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '不看书写一段 5 句的口头小结，再说说这件事让你想到什么。',
    think: '说说一个你想弄明白的难题。',
    pre: [
      { art: '🧑', en: 'scientist', zh: '科学家' },
      { art: '❓', en: 'question', zh: '问题' },
      { art: '🍲', en: 'pot', zh: '锅' }
    ],
    sight: [],
    newWords: [
      { w: 'scientist', zh: '科学家' }
    ],
    pages: [
      { art: 'library|dad,lili|answer|·', en: 'A scientist has a question. She wants to know why a seed grows.', zh: '一位科学家有个问题。她想知道种子为什么会长。' },
      { art: 'library|dad,lili|answer|♪', en: 'The question is hard. No book gives the answer.', zh: '这个问题很难。书上没有现成答案。' },
      { art: 'library|dad,lili|answer|👀', en: 'The scientist looks for an answer. She puts seeds in three pots so she can compare them.', zh: '科学家寻找答案。她把种子放进三个盆，好做比较。' },
      { art: 'library|dad,lili|answer|?', en: 'The scientist tries many times. One pot gets no water.', zh: '她试了很多次。有一只盆不浇水。' },
      { art: 'library|dad,lili|answer|·', en: 'The answer is not easy. Two of the pots do not grow, and she does not know why.', zh: '答案不容易。两个盆没发芽，她也不知道为什么。' },
      { art: 'library|dad,lili|answer|!', en: 'The scientist does not stop. She writes down what she sees.', zh: '科学家没有停。她把看到的都记下来。' },
      { art: 'library|dad,lili|answer|♥', en: 'The scientist writes it down. Each day she writes a note.', zh: '她天天记。每天都写一张小纸条。' },
      { art: 'library|dad,lili|answer|★', en: 'At last, the answer comes. The wet pot has a green stem, and the others stay dry.', zh: '最后答案来了。湿的那盆长出了绿芽，别的还是干的。' },
      { art: 'library|dad,lili|answer|…', en: 'The answer is good. Seeds need water to grow, and now she can show why.', zh: '这个答案站得住。种子需要水才能生长，现在她能说明为什么了。' },
      { art: 'library|dad,lili|answer|·', en: 'She tells the class what she found. They look at the three pots.', zh: '她把发现讲给班上的同学听。大家看那三只花盆。' },
      { art: 'library|dad,lili|answer|♥', en: 'The three weeks are on her notes. She counts them with the class so they can see the time.', zh: '三个星期都记在本子上。她和全班一起数，让大家看到时间。' },
      { art: 'library|dad,lili|answer|·', en: 'The two dry pots are there too. She tells the class why they did not grow.', zh: '两只干盆也摆在那儿。她讲给同学听它们为什么没长。' },
      { art: 'library|dad,lili|answer|…', en: 'Ming asks about the dry pots. She writes his question down because it is a good one.', zh: '明明问起那两盆干的。她把他的问题记下来，因为问得好。' },
      { art: 'library|dad,lili|answer|?', en: 'Ming takes a pot home. He puts a seed in it that night.', zh: '明明带了一只盆回家。当晚就种下一粒种子。' }
    ],
    quiz: [
      { q: '哪一盆种子长出来了？', opts: ['干的那两盆', '湿的那一盆', '三盆都长了'], a: 1, kind: 'recall' },
      { q: '科学家是怎么找到答案的？', opts: ['一次就找到了', '别人给的', '试了很多次，没有停'], a: 2, kind: 'infer' },
      { q: '一个难题很久解不开，你会怎么做？', opts: ['马上放弃', '记下来，慢慢试，不放弃', '不管它'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b103', lv: 'L9', tag: '参观', title: 'A Quiet Museum', zh: '安静的博物馆',
    emoji: '🏛️', color: '#BFE6DF',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 2 个新词（博物馆、以前）。',
    trap: 'kn / wr / ph 里的第一个字母不发音；读长句时先找主句，再读从句。',
    summary: '《安静的博物馆》：这是一个完整的小故事。读前先看词卡（博物馆、以前）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '不看书写一段 5 句的口头小结，再说说这件事让你想到什么。',
    think: '说说你在博物馆或老房子里看到的一样老东西。',
    pre: [
      { art: '🏛️', en: 'museum', zh: '博物馆' },
      { art: '⏰', en: 'ago', zh: '以前' },
      { art: '🍲', en: 'pot', zh: '锅' },
      { art: '🏠', en: 'house', zh: '房子' }
    ],
    sight: ['stories'],
    newWords: [
      { w: 'museum', zh: '博物馆' },
      { w: 'ago', zh: '以前' }
    ],
    pages: [
      { art: 'street|ming,grandma|museum|·', en: 'Ming is in a museum. It is a big old house that is quiet inside.', zh: '明明在博物馆里。那是一栋里面很安静的老房子。' },
      { art: 'street|ming,grandma|museum|♪', en: 'The museum is quiet. People do not shout because they want to keep it that way.', zh: '博物馆很安静。人们不大声说话，因为想保持这样。' },
      { art: 'street|ming,grandma|museum|👀', en: 'Ming walks and looks. He stays close to Grandma.', zh: '明明边走边看。他紧跟着奶奶。' },
      { art: 'street|ming,grandma|museum|?', en: 'Old things are here. Some come from long ago, and they are very different.', zh: '这里有旧东西。有些来自很久以前，和现在很不一样。' },
      { art: 'street|ming,grandma|museum|·', en: 'A very old pot is here. It has a broken side.', zh: '有一只很旧的锅。一边破了。' },
      { art: 'street|ming,grandma|museum|!', en: 'Ming looks at the pot. He cannot touch it, so he puts his hands behind his back.', zh: '明明看着那个盆。他不能摸，所以把手背在身后。' },
      { art: 'street|ming,grandma|museum|♥', en: 'People used it long ago. They cooked rice in it, and they ate together.', zh: '很久以前的人用它。他们在里面煮饭，一起吃。' },
      { art: 'street|ming,grandma|museum|★', en: 'Ming thinks about them. He pictures a family at a table.', zh: '明明想着那些人。他想象一家人围在桌边。' },
      { art: 'street|ming,grandma|museum|…', en: 'The museum keeps old things. A case keeps them safe so people can see them for years.', zh: '博物馆收藏旧东西。玻璃柜把它们保护好，让人们多年都能看到。' },
      { art: 'street|ming,grandma|museum|·', en: 'Grandma tells him not to run. He walks slowly because the floor is old.', zh: '奶奶叫他别跑。他慢慢走，因为地板很旧。' },
      { art: 'street|ming,grandma|museum|♥', en: 'Old things tell stories. This pot tells one about food and family.', zh: '旧东西会讲故事。这个盆讲的是食物和家人的故事。' },
      { art: 'street|ming,grandma|museum|·', en: 'Ming learns from them. He did not know people cooked like that.', zh: '明明从它们那儿学到东西。他不知道从前是那样做饭的。' },
      { art: 'street|ming,grandma|museum|…', en: 'Ming wants to come back. He asks Grandma if she will bring him again.', zh: '明明想再来。他问奶奶能不能再带他来。' },
      { art: 'street|ming,grandma|museum|?', en: 'The museum is a good place. He will look at the other rooms.', zh: '博物馆是个好地方。他还要去看别的展厅。' }
    ],
    quiz: [
      { q: '博物馆里那只旧盆，是什么样子？', opts: ['两边都破了', '有一边破了', '跟新的一样'], a: 1, kind: 'recall' },
      { q: '明明把手背在身后、慢慢走，是因为什么？', opts: ['这里的东西很老很珍贵，要小心', '奶奶让他别出声', '他怕黑'], a: 0, kind: 'infer' },
      { q: '在博物馆里，你会怎么做？', opts: ['安静看，想一想它背后的事', '大声喧哗', '乱摸乱碰'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b104', lv: 'L9', tag: '方法', title: 'Write It Down', zh: '把它记下来',
    emoji: '✏️', color: '#F2E2A8',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 1 个新词（忘记）。',
    trap: 'kn / wr / ph 里的第一个字母不发音；读长句时先找主句，再读从句。',
    summary: '《把它记下来》：这是一个完整的小故事。读前先看词卡（忘记）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '不看书写一段 5 句的口头小结，再说说这件事让你想到什么。',
    think: '说说你写下来记着的一件事。',
    pre: [
      { art: '🏃', en: 'forget', zh: '忘记' },
      { art: '📋', en: 'board', zh: '木板' },
      { art: '🎁', en: 'gift', zh: '礼物' }
    ],
    sight: [],
    newWords: [
      { w: 'forget', zh: '忘记' }
    ],
    pages: [
      { art: 'school|lili,grandpa|board|·', en: 'A board is on the wall. Ming writes on it with a pen.', zh: '墙上挂着一块板。明明用笔在上面写。' },
      { art: 'school|lili,grandpa|board|♪', en: 'Ming has a good idea. He wants to make Grandpa a gift, but he does not know what.', zh: '明明有个好主意。他想给爷爷做件礼物，但不知道做什么。' },
      { art: 'school|lili,grandpa|board|👀', en: 'Ming writes it down. He puts three words on the board.', zh: '明明把它写下来。他在板上写了三个词。' },
      { art: 'school|lili,grandpa|board|?', en: 'Writing helps us remember. The idea will stay there so he will not forget it.', zh: '写下来能帮我们记住。想法会留在板上，他就不会忘。' },
      { art: 'school|lili,grandpa|board|·', en: 'Ming writes more. He adds what he needs to buy, and he draws a small picture.', zh: '明明继续写。他加上要买的东西，还画了个小图。' },
      { art: 'school|lili,grandpa|board|!', en: 'The board is full now. There is no room for more.', zh: '板子写满了。再没地方写了。' },
      { art: 'school|lili,grandpa|board|♥', en: 'Ming looks at the board. He reads each line again.', zh: '明明看着板子。他把每一行又读了一遍。' },
      { art: 'school|lili,grandpa|board|★', en: 'The ideas are there. Nothing has gone away because the board keeps them.', zh: '想法都在那儿。什么都没丢，因为板子把它们留着。' },
      { art: 'school|lili,grandpa|board|…', en: 'The next day he is not sure. One part has gone from his mind, and he cannot find it.', zh: '第二天他有点拿不准。有一处记不起来了，怎么也想不出。' },
      { art: 'school|lili,grandpa|board|·', en: 'He goes back to the board. The line is still there, so he reads it again.', zh: '他回到板前。那行还在，所以他又读了一遍。' },
      { art: 'school|lili,grandpa|board|♥', en: 'Ming finds the line he lost. Now he knows what to buy.', zh: '明明找到了忘掉的那一行。这下知道要买什么了。' },
      { art: 'school|lili,grandpa|board|·', en: 'He makes the gift that day. He uses the things on the board so nothing is missing.', zh: '他那天就做好了礼物。他照着板上的东西做，一样也没漏。' },
      { art: 'school|lili,grandpa|board|…', en: '"Thank you," Grandpa says. He puts the gift by his bed.', zh: '「谢谢你。」爷爷说。他把礼物放在床边。' },
      { art: 'school|lili,grandpa|board|?', en: 'Ming keeps the board by his desk. He writes his next plan on it.', zh: '明明把板子放在书桌旁。他把下一个计划写在上面。' }
    ],
    quiz: [
      { q: '第二天明明忘了怎么做，他怎么办的？', opts: ['问了爷爷', '重新想了一遍', '回去看板子上写的'], a: 2, kind: 'recall' },
      { q: '为什么要写下来？', opts: ['写下来能帮我们记住', '为了好看', '为了给别人看'], a: 0, kind: 'infer' },
      { q: '怕忘掉一个好主意，你会怎么做？', opts: ['不管它', '记在心里就行', '马上写下来或记下来'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b105', lv: 'L9', tag: '发音', title: 'Say It: Knee, Write', zh: '说一说：knee write',
    emoji: '🗣️', color: '#D9D2F5',
    track: 'drill',
    goal: '把本级难点音听准、说准，并能在整句里读对。认读 1 个新词（膝盖）。',
    trap: 'kn / wr / ph 里的第一个字母不发音；读长句时先找主句，再读从句。',
    summary: '《说一说：knee write》：这一本练两个词的音和形。读前先看词卡（膝盖）；读的时候先看清每个词，再连起来读一遍。',
    retell: '把这一本练的两个词再读一遍，说说它们的音哪里一样、哪里不一样。',
    think: '找一个有不发音字母的词，读一读。',
    pre: [
      { art: '🦵', en: 'knee', zh: '膝盖' },
      { art: '📦', en: 'word', zh: '词' },
      { art: '✉️', en: 'letter', zh: '信' }
    ],
    sight: [],
    newWords: [
      { w: 'knee', zh: '膝盖' }
    ],
    pages: [
      { art: 'table|grandma,mom|knee|·', en: 'This is a knee. It starts with a quiet k.', zh: '这是 knee。开头是个不发音的 k。' },
      { art: 'table|grandma,mom|knee|♪', en: 'This is "write". It starts with a quiet w.', zh: '这是 write。开头是个不发音的 w。' },
      { art: 'table|grandma,mom|knee|👀', en: 'Knee and write.', zh: 'knee 和 write。' },
      { art: 'table|grandma,mom|knee|?', en: 'In "knee", the "k" is quiet. You do not say it, but it stays in the word.', zh: 'knee 里的 k 不发音。你不读它，可它还在词里。' },
      { art: 'table|grandma,mom|knee|·', en: 'In "write", the "w" is quiet. It is there but you do not say it.', zh: 'write 里的 w 不发音。它写着，可你不读它。' },
      { art: 'table|grandma,mom|knee|!', en: 'Say "knee". Say it slow.', zh: '读 knee。慢慢读。' },
      { art: 'table|grandma,mom|knee|♥', en: 'Say "write". Say it again.', zh: '读 write。再读一遍。' },
      { art: 'table|grandma,mom|knee|★', en: 'Some letters are quiet. But they are still in the word.', zh: '有些字母不发音。可它们还在词里。' },
      { art: 'table|grandma,mom|knee|…', en: 'Knee, write, knee, write.', zh: 'knee，write，knee，write。' },
      { art: 'table|grandma,mom|knee|·', en: 'You can read both. Look at each word first, and then say it.', zh: '两个词你都能读。先看整词，再读出来。' },
      { art: 'table|grandma,mom|knee|♥', en: 'Quiet letters can be there. They are part of the word, so do not drop them when you write.', zh: '不发音的字母也在那儿。它们是词的一部分，写的时候别丢了。' },
      { art: 'table|grandma,mom|knee|·', en: 'Just read the sound. Do not read every letter, because some are quiet.', zh: '只读音。别把每个字母都读出来，因为有些是不发音的。' },
      { art: 'table|grandma,mom|knee|…', en: 'Good reading! Try two more words, and listen for the quiet letters.', zh: '读得好！再试两个词，听听哪个字母不发音。' },
      { art: 'table|grandma,mom|knee|?', en: 'Knee and write. Now say them together, and keep the quiet letters in.', zh: 'knee 和 write。现在连起来说，别把不发音的字母读出来。' }
    ],
    quiz: [
      { q: 'knee 和 write 里各有哪个字母不发音？', opts: ['两个词都有 i 不发音', '两个词都有 e 不发音', 'knee 的 k 和 write 的 w'], a: 2, kind: 'recall' },
      { q: '这两个词里什么特别？', opts: ['都很短', '都很长', '有些字母不发音'], a: 2, kind: 'infer' },
      { q: '遇到有不发音字母的单词，你会怎么读？', opts: ['每个字母都念', '读出发音的那部分，别念不发音的字母', '跳过去'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b106', lv: 'L9', tag: '小知识', title: 'Why Seasons Change', zh: '季节为什么变',
    emoji: '🍂', color: '#FAD3B6',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。认读 4 个新词（泥土、朝着、季节、记下）。',
    trap: 'kn / wr / ph 里的第一个字母不发音；读长句时先找主句，再读从句。',
    summary: '《季节为什么变》：这一本从一件小事讲起，说说为什么会这样。读前先看词卡（泥土、朝着、季节、记下）；读的时候留意先看到什么、为什么会这样、后来怎么弄明白。',
    retell: '合上书，按「先看到什么 → 为什么会这样 → 后来怎么弄明白」讲一遍。',
    think: '说说一年四季是怎么变的。',
    pre: [
      { art: '📦', en: 'earth', zh: '泥土' },
      { art: '💡', en: 'toward', zh: '朝着' },
      { art: '🍂', en: 'season', zh: '季节' },
      { art: '🏃', en: 'mark', zh: '记下' },
      { art: '☀️', en: 'sun', zh: '太阳' },
      { art: '🌳', en: 'tree', zh: '树' }
    ],
    sight: [],
    newWords: [
      { w: 'earth', zh: '泥土' },
      { w: 'toward', zh: '朝着' },
      { w: 'season', zh: '季节' },
      { w: 'mark', zh: '记下' }
    ],
    pages: [
      { art: 'night|grandpa,dad|season|·', en: 'The seasons change. The trees tell us first, and we can see it in the leaves.', zh: '季节在变。树先告诉我们，从叶子上就能看出来。' },
      { art: 'night|grandpa,dad|season|♪', en: 'Why do seasons change?', zh: '季节为什么会变？' },
      { art: 'night|grandpa,dad|season|👀', en: 'The earth goes around the sun. It takes a whole year, so the seasons come back.', zh: '地球绕着太阳转。转一整年，所以季节会回来。' },
      { art: 'night|grandpa,dad|season|?', en: 'Sometimes our part is toward the sun. The sun is high then, and the days are long.', zh: '有时我们这一面朝着太阳。那时太阳高，白天长。' },
      { art: 'night|grandpa,dad|season|·', en: 'Then it is warm. The days are long.', zh: '于是天气暖和。白天也长。' },
      { art: 'night|grandpa,dad|season|!', en: 'Sometimes our part turns away. The sun is not high, so it is cold.', zh: '有时我们这一面转开了。太阳不高，所以就冷了。' },
      { art: 'night|grandpa,dad|season|♥', en: 'Then it is cold. We wear thick coats.', zh: '于是天冷了。我们穿上厚外套。' },
      { art: 'night|grandpa,dad|season|★', en: 'So the seasons change. It happens every year because the earth keeps going.', zh: '所以季节会变。每年都这样，因为地球一直在转。' },
      { art: 'night|grandpa,dad|season|…', en: 'Spring, summer, fall, winter. Each one looks different, and each one brings new things.', zh: '春、夏、秋、冬。每个季节看起来都不同，都带来新东西。' },
      { art: 'night|grandpa,dad|season|·', en: 'Each season is different. The garden shows it.', zh: '每一季都不同。花园里看得最清楚。' },
      { art: 'night|grandpa,dad|season|♥', en: 'You can see it in one tree. Watch it all year, and you will see the change.', zh: '在一棵树上就能看到。看它一整年，你就看见变化了。' },
      { art: 'night|grandpa,dad|season|·', en: 'The earth keeps going. It never stops.', zh: '地球一直转。从不停下。' },
      { art: 'night|grandpa,dad|season|…', en: 'The seasons keep changing. Watch the same tree all year so you can mark each change.', zh: '季节一直在变。看同一棵树一整年，好把每次变化都记下来。' },
      { art: 'night|grandpa,dad|season|?', en: 'Ming will mark it on a board. He wants to see the change.', zh: '明明要把变化记在板上。他想亲眼看见它。' }
    ],
    quiz: [
      { q: '季节为什么会变？', opts: ['太阳自己在动', '地球绕着太阳转，我们这一面有时朝着太阳', '风的方向在变'], a: 1, kind: 'recall' },
      { q: '地球转的时候，我们这一面有时朝着太阳、有时转开，所以会怎么样？', opts: ['太阳会变大变小', '有时热有时冷，有了四季', '有时白天有时黑夜'], a: 1, kind: 'infer' },
      { q: '想知道自然的大变化，你会怎么做？', opts: ['观察、看书、问一问', '随便猜', '不管它'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b107', lv: 'L9', tag: '小知识', title: 'How We Measure Rain', zh: '我们怎么量雨',
    emoji: '🌧️', color: '#C8E7F0',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。认读 2 个新词（敲、有用）。',
    trap: 'kn / wr / ph 里的第一个字母不发音；读长句时先找主句，再读从句。',
    summary: '《我们怎么量雨》：这一本从一件小事讲起，说说为什么会这样。读前先看词卡（敲、有用）；读的时候留意先看到什么、为什么会这样、后来怎么弄明白。',
    retell: '合上书，按「先看到什么 → 为什么会这样 → 后来怎么弄明白」讲一遍。',
    think: '说说你想量一量的一样东西。',
    pre: [
      { art: '🏃', en: 'knock', zh: '敲' },
      { art: '✨', en: 'useful', zh: '有用' },
      { art: '🌧️', en: 'rain', zh: '雨' },
      { art: '🥛', en: 'cup', zh: '杯子' }
    ],
    sight: [],
    newWords: [
      { w: 'knock', zh: '敲' },
      { w: 'useful', zh: '有用' }
    ],
    pages: [
      { art: 'night|mom,ming|rain|·', en: 'We want to measure the rain. Ming asks how much rain there was.', zh: '我们想量一量雨。明明问到底下了多少雨。' },
      { art: 'night|mom,ming|rain|♪', en: 'We need a way to measure. Grandma brings a cup, and she puts it on the table.', zh: '我们需要一个测量的办法。奶奶拿来一个杯子，放在桌上。' },
      { art: 'night|mom,ming|rain|👀', en: 'We put a cup outside. It stands on a stone so the wind will not knock it over.', zh: '我们把杯子放到外面。放在石头上，免得被风吹倒。' },
      { art: 'night|mom,ming|rain|?', en: 'The rain falls in the cup. All night it fills.', zh: '雨落进杯子里。下了一夜，慢慢积起来。' },
      { art: 'night|mom,ming|rain|·', en: 'We look at the water in the cup. Ming marks the line so we can compare later.', zh: '我们看杯里的水。明明画了条线，好以后比较。' },
      { art: 'night|mom,ming|rain|!', en: 'More rain, more water. That is how we know, and it is easy to see.', zh: '雨多，水就多。我们就这么知道，一眼就能看出。' },
      { art: 'night|mom,ming|rain|♥', en: 'We mark how much. He writes it in a note.', zh: '把多少记下来。他写在一张小纸条上。' },
      { art: 'night|mom,ming|rain|★', en: 'Now we can measure the rain. The cup is our tool because it shows how much rain came.', zh: '现在我们能量雨了。杯子就是我们的工具，因为它能显示下了多少。' },
      { art: 'night|mom,ming|rain|…', en: 'The next day it rains again. Ming runs outside.', zh: '第二天下雨了。明明跑到屋外。' },
      { art: 'night|mom,ming|rain|·', en: 'Measuring needs a way. This way is simple, and you can do it too.', zh: '测量要有办法。这个办法很简单，谁都能做。' },
      { art: 'night|mom,ming|rain|♥', en: 'A cup can be a tool. It does not need to be new.', zh: '杯子也能当工具。不必是新的。' },
      { art: 'night|mom,ming|rain|·', en: 'We measure again tomorrow. Ming will compare the two marks so he can see the change.', zh: '明天我们再量一次。明明会对比两条线，好看出变化。' },
      { art: 'night|mom,ming|rain|…', en: 'Rain can be measured. So can many other things.', zh: '雨可以量。很多别的东西也可以量。' },
      { art: 'night|mom,ming|rain|?', en: 'Measuring is useful. He wants to measure the snow, and he will use the same cup.', zh: '测量很有用。他想量雪，还用同一个杯子。' }
    ],
    quiz: [
      { q: '明明用什么来量雨？', opts: ['一把尺子', '一个盆', '一个杯子'], a: 2, kind: 'recall' },
      { q: '我们用什么量雨？', opts: ['放在外面的杯子', '尺子', '秤'], a: 0, kind: 'infer' },
      { q: '想测量一样东西，你会怎么做？', opts: ['想一个办法，用工具量一量', '不量了', '随便说一个数'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b108', lv: 'L9', tag: '复习', title: 'The Whole Story', zh: '整个故事',
    emoji: '📚', color: '#E8D9B5',
    track: 'review',
    goal: '把本级和前面级别的词再读一遍、串成一个故事。不引入新词，全部是读过的词。',
    trap: 'kn / wr / ph 里的第一个字母不发音；读长句时先找主句，再读从句。',
    summary: '《整个故事》：这是一个完整的小故事。读前先看词卡，都是学过的词；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '不看书写一段 5 句的口头小结，再说说这件事让你想到什么。',
    think: '说说一件事的开头、中间和结尾。',
    pre: [
      { art: '⚽', en: 'ball', zh: '球' },
      { art: '🏞️', en: 'park', zh: '公园' }
    ],
    sight: [],
    newWords: [

    ],
    pages: [
      { art: 'library|dad,lili|story|·', en: 'Ming stands at the station. He waits for Grandma.', zh: '明明站在车站。他等奶奶。' },
      { art: 'library|dad,lili|story|♪', en: 'Ming thinks about the whole story. He wants to tell it to Grandma, but he is not sure where to start.', zh: '明明想着整个故事。他想讲给奶奶听，但不知道从哪儿开始。' },
      { art: 'library|dad,lili|story|👀', en: 'First, there was a question. Ming could not find his ball, and he looked all over.', zh: '先是有一个问题。明明找不到球，到处都找了。' },
      { art: 'library|dad,lili|story|?', en: 'Then, there was work. He looked all over the park.', zh: '接着是一番寻找。他把公园找了个遍。' },
      { art: 'library|dad,lili|story|·', en: 'Then, there was an answer. The ball was by the gate, where he first played.', zh: '然后有了答案。球在门边，就是他一开始玩的地方。' },
      { art: 'library|dad,lili|story|!', en: 'The story has three parts. He counts them one by one.', zh: '故事有三个部分。他一个一个数。' },
      { art: 'library|dad,lili|story|♥', en: 'Ming tells the whole story. Grandma listens all the way, and she does not stop him.', zh: '明明讲整个故事。奶奶一直听着，没有打断他。' },
      { art: 'library|dad,lili|story|★', en: 'Grandma asks one more thing. She wants to hear about the ball.', zh: '奶奶又问了一处。她想听听球的事。' },
      { art: 'library|dad,lili|story|…', en: 'Grandma asks about the park. Ming tells that part again because she wants to hear it.', zh: '奶奶问起公园那段。明明又讲了一遍，因为她想听。' },
      { art: 'library|dad,lili|story|·', en: 'So Ming starts at the beginning. He tells the park part too, so nothing is missing.', zh: '于是明明从头讲起。公园那段也讲了，这样什么都没漏。' },
      { art: 'library|dad,lili|story|♥', en: 'Ming tells it again. This time nothing is missing.', zh: '明明又讲了一遍。这回一点没漏。' },
      { art: 'library|dad,lili|story|·', en: 'The whole story is clear now. Grandma smiles at him because he did it well.', zh: '整个故事清楚了。奶奶对他笑，因为他讲得好。' },
      { art: 'library|dad,lili|story|…', en: 'Grandma says she likes the end. Ming says he likes the gate part.', zh: '奶奶说她最喜欢结尾。明明说他喜欢门边那一段。' },
      { art: 'library|dad,lili|story|?', en: 'The whole story, start to end. He will tell Mom at home, and she will want to hear it too.', zh: '整个故事，从头到尾。回家他要讲给妈妈听，她也会想听。' }
    ],
    quiz: [
      { q: '奶奶说想再听哪一段？', opts: ['结尾的部分', '开头的部分', '公园那一段'], a: 2, kind: 'recall' },
      { q: '故事有哪三个部分？', opts: ['开头、中间、结尾', '问题、努力、答案', '人、地点、时间'], a: 1, kind: 'infer' },
      { q: '要把一件事讲完整，你会怎么做？', opts: ['只讲一句', '随便讲', '从头到尾按顺序讲，不漏部分'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b109', lv: 'L10', tag: '思考', title: 'A Better Question', zh: '更好的问题',
    emoji: '❓', color: '#F6C6C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。不引入新词，全部是读过的词。',
    trap: '桥梁书按自然段读：一句里先找「谁 + 做什么」，再把修饰部分补进去。',
    summary: '《更好的问题》：这是一个完整的小故事。读前先看词卡，都是学过的词；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '不看书写一段 5 句的口头小结，再说说这件事让你想到什么。',
    think: '说说你问过的一个「更好的问题」。',
    pre: [
      { art: '📦', en: 'word', zh: '词' },
      { art: '❓', en: 'question', zh: '问题' }
    ],
    sight: [],
    newWords: [

    ],
    pages: [
      { art: 'library|ming,grandma|question|·', en: 'Ming is reading a hard sentence. It is in his new book.', zh: '明明在读一个难句。这句话在一本新书里。' },
      { art: 'library|ming,grandma|question|♪', en: 'The sentence does not make sense. He reads it three times because he wants to get it.', zh: '这个句子讲不通。他读了三遍，因为他想弄懂。' },
      { art: 'library|ming,grandma|question|👀', en: '"What does it mean?" Ming asks, and Grandma comes over when she hears him.', zh: '「这是什么意思？」明明问，奶奶听见了就走了过来。' },
      { art: 'library|ming,grandma|question|?', en: 'Grandma answers. She explains the whole line because he cannot get it.', zh: '奶奶回答了。她把整行讲了一遍，因为他怎么也弄不懂。' },
      { art: 'library|ming,grandma|question|·', en: 'But Ming still does not get it. The words are all strange to him, because he has never seen them before.', zh: '可明明还是没懂。这些词对他都很陌生，因为他从没见过。' },
      { art: 'library|ming,grandma|question|!', en: 'Ming asks a better question. He stops and thinks first, before he says a word.', zh: '明明问了一个更好的问题。他先停下来想了想，才开口。' },
      { art: 'library|ming,grandma|question|♥', en: '"Which word is hard?" asks Ming. The question is small now, so Grandma can answer it.', zh: '「哪个词难？」明明问。问题现在变小了，奶奶答得上来。' },
      { art: 'library|ming,grandma|question|★', en: 'Grandma points to one word. It sits near the end of the line.', zh: '奶奶指着一个词。这个词靠近句尾。' },
      { art: 'library|ming,grandma|question|…', en: 'Now Ming knows where it is hard. It is just that one word, and he looks at it closely.', zh: '现在明明知道难在哪儿了。就难在那一个词，他凑近看着它。' },
      { art: 'library|ming,grandma|question|·', en: 'They talk about that one word. Grandma says it in a short sentence so he can hear it.', zh: '他们只谈那一个词。奶奶用一个短句把它说出来，好让他听清。' },
      { art: 'library|ming,grandma|question|♥', en: 'The hard part gets clear. Ming says it out loud so he can hear it.', zh: '难的那部分清楚了。明明大声说出来，好让自己听见。' },
      { art: 'library|ming,grandma|question|·', en: 'The whole sentence is clear now. He reads it again from the start, and this time it makes sense.', zh: '整个句子现在清楚了。他从头再读一遍，这次读得通了。' },
      { art: 'library|ming,grandma|question|…', en: 'Ming looks back at his first question. It was too big to help, and now he sees why.', zh: '明明回头看最初那个问题。那个问题太大，帮不上忙，现在他明白为什么了。' },
      { art: 'library|ming,grandma|question|?', en: 'Ming writes down the question. He puts it on a note by his desk so it stays where he can see it.', zh: '明明把问题记下来。他放在书桌旁的纸条上，免得丢了。' },
      { art: 'library|ming,grandma|question|·', en: 'Next time he will ask a small one. If he asks a small one, he can get an answer.', zh: '下次他要问一个小问题。问得小，才问得出答案。' }
    ],
    quiz: [
      { q: '明明把大问题换成了哪个小问题？', opts: ['「这句话什么意思？」', '「哪个词难？」', '「这是谁写的？」'], a: 1, kind: 'recall' },
      { q: '为什么把问题问小一点，反而更容易得到答案？', opts: ['因为大问题太难写', '小问题清楚，奶奶知道该讲哪儿', '因为小问题不重要'], a: 1, kind: 'infer' },
      { q: '看不懂一段话，你会怎么做？', opts: ['跳过去', '先找出具体哪个词或哪句卡住，再问', '整段问「这是什么意思」'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b110', lv: 'L10', tag: '观察', title: 'The Small Change', zh: '小小的变化',
    emoji: '🔍', color: '#F9DFB4',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 1 个新词（勇气）。',
    trap: '桥梁书按自然段读：一句里先找「谁 + 做什么」，再把修饰部分补进去。',
    summary: '《小小的变化》：这是一个完整的小故事。读前先看词卡（勇气）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '不看书写一段 5 句的口头小结，再说说这件事让你想到什么。',
    think: '说说你做过的一个小改变，它带来了什么。',
    pre: [
      { art: '🦁', en: 'courage', zh: '勇气' },
      { art: '📦', en: 'box', zh: '盒子' },
      { art: '📦', en: 'word', zh: '词' }
    ],
    sight: [],
    newWords: [
      { w: 'courage', zh: '勇气' }
    ],
    pages: [
      { art: 'library|lili,grandpa|change|·', en: 'Ming makes one small change. He will do it every day, and he will not miss one.', zh: '明明做了一个小改变。他要每天做，一天都不落。' },
      { art: 'library|lili,grandpa|change|♪', en: 'Ming changes one small thing. Each day he writes one new word before bed.', zh: '明明改了一个小地方。他每天睡前写一个新词。' },
      { art: 'library|lili,grandpa|change|👀', en: 'At first, nothing seems different. The box has only three notes, so it looks empty.', zh: '一开始好像没什么不同。盒子里只有三张纸条，看着空空的。' },
      { art: 'library|lili,grandpa|change|?', en: 'Ming keeps going. He does not stop, even on the days when he is tired.', zh: '明明一直坚持。连累的那些天他也没停。' },
      { art: 'library|lili,grandpa|change|·', en: 'Day by day, it adds up. The notes fill the box, and soon the box is full.', zh: '一天天过去，它攒起来了。纸条装满盒子，很快盒子就满了。' },
      { art: 'library|lili,grandpa|change|!', en: 'After a while, it is different. He finds that he can read a whole page.', zh: '过了一阵，不一样了。他发现自己能读一整页。' },
      { art: 'library|lili,grandpa|change|♥', en: 'The small change did it. One word a day was enough, and he could see it.', zh: '这个小改变奏效了。一天一个词就够了，这一点他看得出来。' },
      { art: 'library|lili,grandpa|change|★', en: 'Ming is glad that he kept going, and he shows Grandma the full box. If he stops, the box will stay empty.', zh: '明明庆幸自己坚持了下来，把装满的盒子拿给奶奶看。要是停下来，盒子就还是空的。' },
      { art: 'library|lili,grandpa|change|…', en: 'Grandma counts the notes with him because he wants to know.', zh: '奶奶和他一起数纸条，因为他想知道到底有多少。' },
      { art: 'library|lili,grandpa|change|·', en: 'The first note is still in the box. It has one word on it that he wrote long ago.', zh: '第一张纸条还在盒子里。上面有一个他很久以前写的词。' },
      { art: 'library|lili,grandpa|change|♥', en: 'Ming makes another change. Now he reads one page each night.', zh: '明明又做了一个改变。现在他每晚读一页。' },
      { art: 'library|lili,grandpa|change|·', en: 'It adds up again. By spring he finishes a whole book, and he reads the last page twice.', zh: '又攒起来了。到春天他读完一整本书，最后一页读了两遍。' },
      { art: 'library|lili,grandpa|change|…', en: 'Grandma says he has courage. Ming says one word is easy.', zh: '奶奶说他有勇气。明明说一天一个词很容易。' },
      { art: 'library|lili,grandpa|change|?', en: 'Ming sees how it works. He tells his class about the box.', zh: '明明明白了这是怎么回事。他把盒子的事讲给班里听。' },
      { art: 'library|lili,grandpa|change|·', en: 'Tomorrow he will write one more word. He puts the box back on the desk where he can see it.', zh: '明天他要再写一个词。他把盒子放回书桌上看得见的地方。' }
    ],
    quiz: [
      { q: '明明每天做的那件小事是什么？', opts: ['每天写一句话', '睡前在盒子里写一个新词', '每天读一页书'], a: 1, kind: 'recall' },
      { q: '小变化是怎么起作用的？', opts: ['一下就变了', '根本没用', '一天天累积，慢慢看出不同'], a: 2, kind: 'infer' },
      { q: '想让一件事慢慢变好，你会怎么做？', opts: ['每天改一点小地方，坚持下去', '一下全改', '不改了'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b111', lv: 'L10', tag: '习惯', title: 'A Habit Every Day', zh: '每天一个习惯',
    emoji: '📅', color: '#CDE7C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 1 个新词（习惯）。',
    trap: '桥梁书按自然段读：一句里先找「谁 + 做什么」，再把修饰部分补进去。',
    summary: '《每天一个习惯》：这是一个完整的小故事。读前先看词卡（习惯）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '不看书写一段 5 句的口头小结，再说说这件事让你想到什么。',
    think: '说说你每天都会做的一件小事。',
    pre: [
      { art: '📅', en: 'habit', zh: '习惯' },
      { art: '🎒', en: 'bag', zh: '书包' },
      { art: '🛏️', en: 'bed', zh: '床' }
    ],
    sight: [],
    newWords: [
      { w: 'habit', zh: '习惯' }
    ],
    pages: [
      { art: 'library|grandma,mom|habit|·', en: 'A habit is something you do every day. Ming wants one of his own.', zh: '习惯就是你每天都做的一件事。明明想养成一个自己的习惯。' },
      { art: 'library|grandma,mom|habit|♪', en: 'Ming puts his school things by the door. He does it before he goes to bed.', zh: '明明把上学的东西放到门边。他在睡前做这件事。' },
      { art: 'library|grandma,mom|habit|👀', en: 'His bag goes there first. His cap goes on the bag, and everything is ready.', zh: '他的书包先放过去。帽子放在书包上，这样什么都齐了。' },
      { art: 'library|grandma,mom|habit|?', en: 'One night he is too tired. He puts the bag under the bed, so he can rest.', zh: '有天晚上他太累了。他把书包放到床底下，好歇一歇。' },
      { art: 'library|grandma,mom|habit|·', en: 'In the morning he cannot find it. His cap is under the bed too.', zh: '早上他找不到书包。帽子也在床底下。' },
      { art: 'library|grandma,mom|habit|!', en: 'Mom helps him look. They find the bag at last because it was under a coat.', zh: '妈妈帮他找。他们终于找到了书包，因为它压在一件外套下面。' },
      { art: 'library|grandma,mom|habit|♥', en: 'Ming is late for school. He does not like being late because it feels bad.', zh: '明明上学迟到了。他不喜欢迟到，因为那感觉很难受。' },
      { art: 'library|grandma,mom|habit|★', en: 'That night he puts everything by the door again.', zh: '那天晚上他又把东西都放到了门边。' },
      { art: 'library|grandma,mom|habit|…', en: 'He does it the next night too. It takes a short time, and soon it takes no time at all.', zh: '第二天晚上他也这么做。花的时间不长，很快一点也不费时间了。' },
      { art: 'library|grandma,mom|habit|·', en: 'After a week it is easy. He does not have to think about it.', zh: '过了一个星期，这件事变容易了。他不用再想。' },
      { art: 'library|grandma,mom|habit|♥', en: 'Now his things are always there. He never looks for them, because they are by the door.', zh: '现在他的东西总在那儿。他再也不用找，因为它们就在门边。' },
      { art: 'library|grandma,mom|habit|·', en: 'Grandma asks how he does it. Ming points to the door.', zh: '奶奶问他怎么做到的。明明指了指门边。' },
      { art: 'library|grandma,mom|habit|…', en: 'Lili wants to try it too. She puts her bag next to his, so they can both do it.', zh: '丽丽也想试试。她把书包放在他的旁边，这样两人都能做。' },
      { art: 'library|grandma,mom|habit|?', en: 'They both do it before bed. It is just part of the day, and they do it without thinking.', zh: '两人睡前都这么做。这就成了日子的一部分，不用想就做了。' },
      { art: 'library|grandma,mom|habit|·', en: 'Tomorrow he will do it again. He puts his cap on the bag so it is ready.', zh: '明天他还要这么做。他把帽子放在书包上，这样就都齐了。' }
    ],
    quiz: [
      { q: '明明把书包和帽子放在哪儿，才不再找不着？', opts: ['门边', '床底下', '桌子上'], a: 0, kind: 'recall' },
      { q: '明明后来再也不用找书包了，为什么？', opts: ['妈妈每天帮他找', '他不再带书包了', '他每晚都把东西放到门边，成了习惯'], a: 2, kind: 'infer' },
      { q: '想养成一个好习惯，你会怎么做？', opts: ['做一次就够了', '等别人提醒', '每天固定做一点，忘了就补上'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b112', lv: 'L10', tag: '发现', title: 'What We Discovered', zh: '我们的发现',
    emoji: '💡', color: '#C6DEF6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。不引入新词，全部是读过的词。',
    trap: '桥梁书按自然段读：一句里先找「谁 + 做什么」，再把修饰部分补进去。',
    summary: '《我们的发现》：这是一个完整的小故事。读前先看词卡，都是学过的词；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '不看书写一段 5 句的口头小结，再说说这件事让你想到什么。',
    think: '说说你通过动手弄清楚的一件事。',
    pre: [
      { art: '📋', en: 'board', zh: '木板' },
      { art: '🍲', en: 'pot', zh: '锅' }
    ],
    sight: [],
    newWords: [

    ],
    pages: [
      { art: 'library|grandpa,dad|plan|·', en: 'Ming wants to find out something. He wonders why one seed did not grow.', zh: '明明想弄明白一件事。他想知道为什么有一颗种子没发芽。' },
      { art: 'library|grandpa,dad|plan|♪', en: 'Ming makes a plan. He writes three steps on a board so he will not forget them.', zh: '明明定了个计划。他把三个步骤写在板上，免得忘了。' },
      { art: 'library|grandpa,dad|plan|👀', en: 'The plan says what to do. First, put seeds in two pots that get the same sun.', zh: '计划写着该怎么做。先把种子放进两个晒到同样太阳的盆里。' },
      { art: 'library|grandpa,dad|plan|?', en: 'Ming follows the plan because he wants to know why.', zh: '明明照着计划做，因为他想知道为什么。' },
      { art: 'library|grandpa,dad|plan|·', en: 'Some things go well. The warm pot has a green stem.', zh: '有些事很顺利。暖和的那盆长出了绿芽。' },
      { art: 'library|grandpa,dad|plan|!', en: 'Some things do not. The other pot stays dark and dry, because it gets no sun.', zh: '有些事不顺利。另一盆一直又暗又干，因为它晒不到太阳。' },
      { art: 'library|grandpa,dad|plan|♥', en: 'Ming changes the plan a little. He puts that pot in the sun and marks the day on the board.', zh: '明明把计划改了一点。他把那盆搬到太阳下，并在板上记下这一天。' },
      { art: 'library|grandpa,dad|plan|★', en: 'Ming goes on. Each morning he marks what he sees.', zh: '明明继续做。每天早上记下看到的。' },
      { art: 'library|grandpa,dad|plan|…', en: 'At last, Ming finds it out. The cold pot was too slow.', zh: '最后明明弄明白了。那盆冷的只是太慢了。' },
      { art: 'library|grandpa,dad|plan|·', en: 'He writes the answer in his note. Grandma reads it too, and she says it is a good answer.', zh: '他把答案写在本子上。奶奶也读了，说这是个好答案。' },
      { art: 'library|grandpa,dad|plan|♥', en: 'He reads his first three steps again. He did not forget one, because they are on the board.', zh: '他把头三步又读了一遍。一步也没忘，因为都写在板上。' },
      { art: 'library|grandpa,dad|plan|·', en: 'He draws a line to the new step. The board still makes sense.', zh: '他画一条线连到新加的那步。板上仍然讲得通。' },
      { art: 'library|grandpa,dad|plan|…', en: 'Ming writes down what we found. He shows the two pots to Grandma.', zh: '明明把发现写下来。他把两盆拿给奶奶看。' },
      { art: 'library|grandpa,dad|plan|?', en: 'Grandma looks at the two pots. She asks which one grew first, and Ming shows her the marks.', zh: '奶奶看着两个盆。她问哪一个先长，明明把记号指给她看。' },
      { art: 'library|grandpa,dad|plan|·', en: 'Ming writes the answer on the board. Tomorrow he will try three pots, so he can compare them.', zh: '明明把答案写在板上。明天他要试三个盆，好做比较。' }
    ],
    quiz: [
      { q: '明明最后发现两个盆的差别是什么？', opts: ['种子不一样', '一个水多，一个水少', '一个有太阳，一个没有'], a: 2, kind: 'recall' },
      { q: '明明是怎么弄清楚的？', opts: ['订了计划，做不通就改一改，继续做', '等别人告诉', '随便乱试'], a: 0, kind: 'infer' },
      { q: '想弄清一件事，你会怎么做？', opts: ['没有计划乱做', '订个计划，做不通就调整，坚持', '不弄了'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b113', lv: 'L10', tag: '耐心', title: 'The Patience to Wait', zh: '等待的耐心',
    emoji: '⏳', color: '#E0CFF3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 3 个新词（记忆、耐心、力量）。',
    trap: '桥梁书按自然段读：一句里先找「谁 + 做什么」，再把修饰部分补进去。',
    summary: '《等待的耐心》：这是一个完整的小故事。读前先看词卡（记忆、耐心、力量）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '不看书写一段 5 句的口头小结，再说说这件事让你想到什么。',
    think: '说说一次「放松后反而想起来了」的经历。',
    pre: [
      { art: '🧠', en: 'memory', zh: '记忆' },
      { art: '💡', en: 'patience', zh: '耐心' },
      { art: '💡', en: 'strength', zh: '力量' },
      { art: '📦', en: 'song', zh: '歌' },
      { art: '🏷️', en: 'name', zh: '名字' }
    ],
    sight: [],
    newWords: [
      { w: 'memory', zh: '记忆' },
      { w: 'patience', zh: '耐心' },
      { w: 'strength', zh: '力量' }
    ],
    pages: [
      { art: 'library|mom,ming|patience|·', en: 'Waiting can be hard. Ming finds that out today.', zh: '等待可能很难。明明今天算是知道了。' },
      { art: 'library|mom,ming|patience|♪', en: 'Ming waits for a memory to come. He wants the name of an old song that Grandma sings.', zh: '明明等一段记忆回来。他想要一首奶奶常唱的老歌的名字。' },
      { art: 'library|mom,ming|patience|👀', en: 'It does not come at first. He sits and thinks hard, but nothing comes.', zh: '一开始它不来。他坐着使劲想，可什么也没来。' },
      { art: 'library|mom,ming|patience|?', en: 'Trying hard does not help. The word will not come, because it is not ready.', zh: '使劲想也没用。那个词就是不来，因为它还没准备好。' },
      { art: 'library|mom,ming|patience|·', en: 'Ming lets go a little because trying too hard does not help.', zh: '明明放松了一点，因为硬想也没用。' },
      { art: 'library|mom,ming|patience|!', en: 'Ming thinks of something else. He helps Grandma in the kitchen with the food.', zh: '明明想点别的。他去厨房帮奶奶弄吃的。' },
      { art: 'library|mom,ming|patience|♥', en: 'Then the memory comes back. It comes when he washes a plate.', zh: '后来那段记忆回来了。它是在他洗盘子的时候来的。' },
      { art: 'library|mom,ming|patience|★', en: 'It was there all along. He just could not find it.', zh: '它一直都在。只是他找不到。' },
      { art: 'library|mom,ming|patience|…', en: 'He runs to tell Grandma. She laughs and sings the song.', zh: '他跑去告诉奶奶。奶奶笑着唱起了那首歌。' },
      { art: 'library|mom,ming|patience|·', en: 'Grandma says she does that too. She stops and sings.', zh: '奶奶说她也是这样。她停下来，去唱歌。' },
      { art: 'library|mom,ming|patience|♥', en: 'Ming is glad that he waited. He did not try too hard.', zh: '明明庆幸自己等了。他没有太使劲逼自己。' },
      { art: 'library|mom,ming|patience|·', en: 'Grandma says it is patience. Ming says it is a quiet kind of strength that comes when you wait.', zh: '奶奶说这就叫耐心。明明说这是一种等一等才来的、安安静静的力量。' },
      { art: 'library|mom,ming|patience|…', en: 'Ming will remember this. He writes the song name down so it stays with him.', zh: '明明要记住这件事。他把歌名写下来，免得忘了。' },
      { art: 'library|mom,ming|patience|?', en: 'The memory is safe now. It is on a note that sits by his bed.', zh: '这段记忆安全了。它写在一张放在床边的纸条上。' },
      { art: 'library|mom,ming|patience|·', en: 'That night Grandma sings it once more. Ming goes to sleep with the song.', zh: '那晚奶奶又唱了一遍。明明听着歌睡着了。' }
    ],
    quiz: [
      { q: '明明想不起来的那首歌，是什么时候想起来的？', opts: ['洗盘子的时候', '睡觉的时候', '问奶奶的时候'], a: 0, kind: 'recall' },
      { q: '记忆是怎么回来的？', opts: ['放松、想点别的，它自己回来了', '永远不会回来', '使劲想就想起来了'], a: 0, kind: 'infer' },
      { q: '怎么想也想不起来，你会怎么做？', opts: ['一直使劲想', '先放松，做点别的，它会自己回来', '算了不管'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b114', lv: 'L10', tag: '思考', title: 'Two Sides of a Problem', zh: '问题的两面',
    emoji: '⚖️', color: '#F6C9E3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 1 个新词（问题）。',
    trap: '桥梁书按自然段读：一句里先找「谁 + 做什么」，再把修饰部分补进去。',
    summary: '《问题的两面》：这是一个完整的小故事。读前先看词卡（问题）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '不看书写一段 5 句的口头小结，再说说这件事让你想到什么。',
    think: '说说你换个角度就看明白的一件事。',
    pre: [
      { art: '🧩', en: 'problem', zh: '问题' },
      { art: '📋', en: 'board', zh: '木板' },
      { art: '🖼️', en: 'picture', zh: '图画' }
    ],
    sight: [],
    newWords: [
      { w: 'problem', zh: '问题' }
    ],
    pages: [
      { art: 'library|dad,lili|problem|·', en: 'A problem has two sides. Ming sees that at school today, when two hands want one board.', zh: '一件事总有两面。明明今天在学校就看见了：两只手都想要同一块板。' },
      { art: 'library|dad,lili|problem|♪', en: 'Ming looks at one side because he wants the board too.', zh: '明明先看一面，因为他也想用那块板。' },
      { art: 'library|dad,lili|problem|👀', en: 'It looks hard. He thinks she will not share, and he is not happy.', zh: '这一面看着很难。他觉得她不会让，心里不痛快。' },
      { art: 'library|dad,lili|problem|?', en: 'Then Ming looks at the other side. He asks her why she needs it.', zh: '接着明明看另一面。他问她为什么需要这块板。' },
      { art: 'library|dad,lili|problem|·', en: 'This side looks easier. She is drawing for the class.', zh: '这一面看着容易些。她是在为班里画画。' },
      { art: 'library|dad,lili|problem|!', en: 'Both sides are the same problem. There is only one board, and they both need it today.', zh: '两面其实是同一个问题。只有一块板，今天两人都要用。' },
      { art: 'library|dad,lili|problem|♥', en: 'Ming looks from both sides. Now he is not sad.', zh: '明明两面都看了。现在他不难过了。' },
      { art: 'library|dad,lili|problem|★', en: 'Ming tells her about his picture. She listens.', zh: '明明把自己的画讲给她听。她听着。' },
      { art: 'library|dad,lili|problem|…', en: 'Now the problem is clear. They can use the board in turn.', zh: '现在问题清楚了。他们可以轮流用这块板。' },
      { art: 'library|dad,lili|problem|·', en: 'Lili draws first, then Ming. He waits and watches her work, because that was the plan.', zh: '丽丽先画，然后明明。他等着看她画，因为计划就是这么定的。' },
      { art: 'library|dad,lili|problem|♥', en: 'Ming knows what to do now. He has a plan of his own.', zh: '明明知道该怎么办了。他自己也有了打算。' },
      { art: 'library|dad,lili|problem|·', en: 'They move the board near the window. The light is better there, so they can see the lines.', zh: '他们把板挪到窗边。那儿光线好，所以看得清那些线。' },
      { art: 'library|dad,lili|problem|…', en: 'Lili finishes her part. Ming picks up the pen.', zh: '丽丽画完她那部分。明明拿起了笔。' },
      { art: 'library|dad,lili|problem|?', en: 'A problem is not so hard now. It was one board and two people, and it had a simple answer.', zh: '这件事现在没那么难了。不过是一块板两个人，答案很简单。' },
      { art: 'library|dad,lili|problem|·', en: 'They put the picture on the wall. It has both of their names, because both of them made it.', zh: '他们把画挂在墙上。上面有两个人的名字，因为这是两人一起做的。' }
    ],
    quiz: [
      { q: '丽丽要那块板做什么？', opts: ['为班里画画', '自己玩', '写作业'], a: 0, kind: 'recall' },
      { q: '为什么从两面看有帮助？', opts: ['因为问题变小了', '因为别人帮忙了', '换个角度看，问题会变清楚'], a: 2, kind: 'infer' },
      { q: '一个问题看着很难，你会怎么做？', opts: ['只盯着一面想', '换个角度、从另一面看看它', '不做了'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b115', lv: 'L10', tag: '坚持', title: 'Tomorrow We Begin Again', zh: '明天重新开始',
    emoji: '🌅', color: '#BFE6DF',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 1 个新词（约定）。',
    trap: '桥梁书按自然段读：一句里先找「谁 + 做什么」，再把修饰部分补进去。',
    summary: '《明天重新开始》：这是一个完整的小故事。读前先看词卡（约定）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '不看书写一段 5 句的口头小结，再说说这件事让你想到什么。',
    think: '说说一次你「明天重新开始」的经历。',
    pre: [
      { art: '🤝', en: 'promise', zh: '约定' },
      { art: '🪁', en: 'kite', zh: '风筝' },
      { art: '🌳', en: 'tree', zh: '树' }
    ],
    sight: [],
    newWords: [
      { w: 'promise', zh: '约定' }
    ],
    pages: [
      { art: 'library|ming,grandma|promise|·', en: 'Today was a hard day. Nothing went the way Ming wanted.', zh: '今天很难。什么事都不顺明明的意。' },
      { art: 'library|ming,grandma|promise|♪', en: 'Some things did not work. His kite went into a tree.', zh: '有些事没成。他的风筝还挂到了树上。' },
      { art: 'library|ming,grandma|promise|👀', en: 'Ming feels tired. He also lost a page of his story, so he cannot finish it tonight.', zh: '明明觉得累。故事还丢了一页，所以今晚写不完了。' },
      { art: 'library|ming,grandma|promise|?', en: 'But the day is over. The sky is dark now, and the kite is still in the tree.', zh: '可这一天过去了。天黑了，风筝还在树上。' },
      { art: 'library|ming,grandma|promise|·', en: '"Tomorrow we begin again." Grandma says it to him.', zh: '「明天我们重新开始。」奶奶对他说。' },
      { art: 'library|ming,grandma|promise|!', en: 'Ming makes a promise because he wants to try again.', zh: '明明许下一个承诺，因为他想再试一次。' },
      { art: 'library|ming,grandma|promise|♥', en: 'The promise is to try again. He says it out loud so he will hear it.', zh: '这个承诺就是再试一次。他大声说出来，好让自己听见。' },
      { art: 'library|ming,grandma|promise|★', en: 'Tomorrow is a new day. He puts the kite by the door.', zh: '明天是新的一天。他把风筝放到门边。' },
      { art: 'library|ming,grandma|promise|…', en: 'Ming rests now. He sleeps well that night because he has a plan for tomorrow.', zh: '明明现在歇着了。那晚他睡得很香，因为他为明天做了打算。' },
      { art: 'library|ming,grandma|promise|·', en: 'Morning comes. The wind is calm.', zh: '早晨来了。风很平静。' },
      { art: 'library|ming,grandma|promise|♥', en: 'Ming keeps his promise. He takes the kite to the park.', zh: '明明守住了承诺。他把风筝带到公园。' },
      { art: 'library|ming,grandma|promise|·', en: 'The wind is just right. He holds the line with two hands.', zh: '风刚刚好。他两手握住线。' },
      { art: 'library|ming,grandma|promise|…', en: 'The kite goes up on the first try. Ming laughs, and he runs with the line.', zh: '风筝第一次就飞了起来。明明笑了，拽着线跑起来。' },
      { art: 'library|ming,grandma|promise|?', en: 'It is high over the park. Grandma is at the gate.', zh: '风筝高高地飞在公园上空。奶奶站在门口。' },
      { art: 'library|ming,grandma|promise|·', en: '"Tomorrow we begin again," Ming says. This time he means it.', zh: '「明天我们重新开始。」明明说。这次他是当真的。' }
    ],
    quiz: [
      { q: '明明第二天重新去放风筝，结果怎么样？', opts: ['又挂到树上', '第一次就飞起来了', '一点风也没有'], a: 1, kind: 'recall' },
      { q: '明明许了什么约定？', opts: ['明天再试一次', '今天就放弃', '什么都不做'], a: 0, kind: 'infer' },
      { q: '今天做得很不顺，你会怎么做？', opts: ['休息一下，明天重新开始', '一直懊恼', '再也不做了'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b116', lv: 'L10', tag: '坚持', title: 'A Journey of Small Steps', zh: '一小步一小步',
    emoji: '👣', color: '#F2E2A8',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 1 个新词（旅程）。',
    trap: '桥梁书按自然段读：一句里先找「谁 + 做什么」，再把修饰部分补进去。',
    summary: '《一小步一小步》：这是一个完整的小故事。读前先看词卡（旅程）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '不看书写一段 5 句的口头小结，再说说这件事让你想到什么。',
    think: '说说你一小步一小步做成的一件事。',
    pre: [
      { art: '🛤️', en: 'journey', zh: '旅程' },
      { art: '🌳', en: 'tree', zh: '树' },
      { art: '🛤️', en: 'path', zh: '小路' }
    ],
    sight: [],
    newWords: [
      { w: 'journey', zh: '旅程' }
    ],
    pages: [
      { art: 'library|lili,grandpa|journey|·', en: 'Ming starts a journey to the old tree. It is up on the hill.', zh: '明明出发去那棵老树。老树在山上。' },
      { art: 'library|lili,grandpa|journey|♪', en: 'Ming takes one small step because the tree is far away.', zh: '明明迈出一小步，因为树还很远。' },
      { art: 'library|lili,grandpa|journey|👀', en: 'It seems too small. The tree is still far away.', zh: '这一步好像太小了。树还那么远。' },
      { art: 'library|lili,grandpa|journey|?', en: 'But Ming takes another, and then one more. His legs feel tired, but he keeps going.', zh: '可明明又迈一步，再迈一步。他的腿发酸，可他还是往前走。' },
      { art: 'library|lili,grandpa|journey|·', en: 'Step by step, Ming goes on. The path is long and hot.', zh: '一步一步，明明往前走。路又长又热。' },
      { art: 'library|lili,grandpa|journey|!', en: 'The small steps add up. He stops for a drink when the sun is high.', zh: '小步子加起来也不少。太阳高了，他停下来喝水。' },
      { art: 'library|lili,grandpa|journey|♥', en: 'After a while, Ming looks back. The house is small now.', zh: '走了一阵，明明回头看。房子变小了。' },
      { art: 'library|lili,grandpa|journey|★', en: 'Ming has come far. He can see the whole town.', zh: '明明走了很远。他能看见整个镇子。' },
      { art: 'library|lili,grandpa|journey|…', en: 'He sits on a stone to rest because the wind feels good up here. He drinks some water too.', zh: '他坐在石头上歇脚，因为山上的风吹着舒服。他还喝了点水。' },
      { art: 'library|lili,grandpa|journey|·', en: 'He counts his steps on the path. There are many of them.', zh: '他数了数一路走过的步子。好多步呢。' },
      { art: 'library|lili,grandpa|journey|♥', en: 'Ming keeps walking. The path goes up again, and his legs feel it.', zh: '明明接着走。路又往上拐了一段，他的腿感觉得到。' },
      { art: 'library|lili,grandpa|journey|·', en: 'He looks up at the leaves. They are big and green, and they move in the wind.', zh: '他抬头看那些叶子。它们又大又绿，在风里摇。' },
      { art: 'library|lili,grandpa|journey|…', en: 'Small steps make a long way. He gets to the tree at last.', zh: '小步子也能走长路。他终于到了树旁。' },
      { art: 'library|lili,grandpa|journey|?', en: 'Ming is proud of the way. He pats the old tree that he came so far to see.', zh: '明明为这段路自豪。他拍拍那棵他走了这么远才见到的老树。' },
      { art: 'library|lili,grandpa|journey|·', en: 'He sits under the tree for a while. Then he walks home, and the way back feels short.', zh: '他在树下坐了一会儿。然后走回家，回去的路感觉很短。' }
    ],
    quiz: [
      { q: '明明走到半路回头看，看见了什么？', opts: ['老树就在眼前', '房子变小了，能看见整个镇子', '奶奶追了上来'], a: 1, kind: 'recall' },
      { q: '明明是怎么走完长路的？', opts: ['一小步一小步，慢慢累积', '一下就跳到终点', '别人背他走的'], a: 0, kind: 'infer' },
      { q: '一件很难很远的事，你会怎么做？', opts: ['等别人做', '看着太远就不做', '拆成小步子，一步一步做'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b117', lv: 'L10', tag: '发音', title: 'Say It: A Whole Sentence', zh: '说一说：整句的节奏',
    emoji: '🗣️', color: '#D9D2F5',
    track: 'drill',
    goal: '把本级难点音听准、说准，并能在整句里读对。认读 3 个新词（队伍、原因、节奏）。',
    trap: '桥梁书按自然段读：一句里先找「谁 + 做什么」，再把修饰部分补进去。',
    summary: '《说一说：整句的节奏》：这一本练两个词的音和形。读前先看词卡（队伍、原因、节奏）；读的时候先看清每个词，再连起来读一遍。',
    retell: '把这一本练的两个词再读一遍，说说它们的音哪里一样、哪里不一样。',
    think: '说说你是怎么读一个长句子的。',
    pre: [
      { art: '🧑', en: 'team', zh: '队伍' },
      { art: '🧩', en: 'reason', zh: '原因' },
      { art: '💡', en: 'pace', zh: '节奏' },
      { art: '📦', en: 'word', zh: '词' },
      { art: '📦', en: 'line', zh: '线' }
    ],
    sight: ['thought'],
    newWords: [
      { w: 'team', zh: '队伍' },
      { w: 'reason', zh: '原因' },
      { w: 'pace', zh: '节奏' }
    ],
    pages: [
      { art: 'table|grandma,mom|reason|·', en: 'A whole sentence has words. You can count them.', zh: '一个整句由词组成。你可以数一数。' },
      { art: 'table|grandma,mom|reason|♪', en: 'But a sentence is not just words. The words work as a team.', zh: '可句子不只是词。这些词是一个团队。' },
      { art: 'table|grandma,mom|reason|👀', en: 'The words work together. They say one thing.', zh: '这些词一起合作。它们说出一件事。' },
      { art: 'table|grandma,mom|reason|?', en: 'Some words go in front, and some go after. The order helps you read.', zh: '有些词在前，有些词在后。这个顺序帮你读下去。' },
      { art: 'table|grandma,mom|reason|·', en: 'Together, they make sense; alone, they are not enough. Try it both ways.', zh: '合起来才讲得通；单独一个词不够。两种都试试。' },
      { art: 'table|grandma,mom|reason|!', en: 'Read the whole sentence. Do not stop at each word, because that breaks the line.', zh: '读整个句子。不要在每一个词上停，因为那样会把句子拆断。' },
      { art: 'table|grandma,mom|reason|♥', en: 'Do not read word by word. That breaks the line.', zh: '不要一个词一个词地读。那样会把句子拆断。' },
      { art: 'table|grandma,mom|reason|★', en: 'Say the whole sentence. Say it from start to end, and keep the words together.', zh: '说整个句子。从头说到尾，把词连在一起。' },
      { art: 'table|grandma,mom|reason|…', en: 'The reason is simple. A sentence is one idea, so read it as one.', zh: '道理很简单。一个句子就是一个意思，所以要整句读。' },
      { art: 'table|grandma,mom|reason|·', en: 'A whole sentence is a whole thought. Keep the words together.', zh: '整句就是一个完整的想法。把词连在一起。' },
      { art: 'table|grandma,mom|reason|♥', en: 'Read it as one. Then it is easy to understand, because the words help each other.', zh: '把它当一个整体读。这样就容易懂，因为词与词互相帮衬。' },
      { art: 'table|grandma,mom|reason|·', en: 'You can say it well. Try this long one, and read it to the end.', zh: '你能说好。试试这个长句，中间别停。' },
      { art: 'table|grandma,mom|reason|…', en: 'Good reading! Try it again, slower.', zh: '读得真好！再慢一点读一遍。' },
      { art: 'table|grandma,mom|reason|?', en: 'A whole sentence. Now listen to the pace that the words make.', zh: '一个整句。现在听听这些词组成的节奏。' },
      { art: 'table|grandma,mom|reason|·', en: 'Read it all at once. It will make sense.', zh: '一口气读下来。就讲得通了。' }
    ],
    quiz: [
      { q: '这一本要你怎么读句子？', opts: ['读得越快越好', '整句连着读，不要一个词一个词读', '只读认识的词'], a: 1, kind: 'recall' },
      { q: '为什么不该一个词一个词读？', opts: ['词是合在一起的，要当一个整体读', '因为词太长', '因为会读错'], a: 0, kind: 'infer' },
      { q: '读一个长句子，你会怎么读？', opts: ['只读一半', '把它当一个整体，连起来读', '一个词一个词蹦'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b118', lv: 'L10', tag: '小知识', title: 'Why Practice Works', zh: '练习为什么有用',
    emoji: '📈', color: '#FAD3B6',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。认读 1 个新词（脑子）。',
    trap: '桥梁书按自然段读：一句里先找「谁 + 做什么」，再把修饰部分补进去。',
    summary: '《练习为什么有用》：这一本从一件小事讲起，说说为什么会这样。读前先看词卡（脑子）；读的时候留意先看到什么、为什么会这样、后来怎么弄明白。',
    retell: '合上书，按「先看到什么 → 为什么会这样 → 后来怎么弄明白」讲一遍。',
    think: '说说练习是怎么让你变好的。',
    pre: [
      { art: '✋', en: 'brain', zh: '脑子' },
      { art: '🛤️', en: 'path', zh: '小路' },
      { art: '🏷️', en: 'name', zh: '名字' }
    ],
    sight: [],
    newWords: [
      { w: 'brain', zh: '脑子' }
    ],
    pages: [
      { art: 'library|grandpa,dad|answer|·', en: 'Practice makes us better. Ming sees it with his pen.', zh: '练习让我们进步。明明用笔看到了这一点。' },
      { art: 'library|grandpa,dad|answer|♪', en: 'But why does practice work? Ming wants to know.', zh: '可练习为什么有用？ 明明想知道。' },
      { art: 'library|grandpa,dad|answer|👀', en: 'When we practice, the brain learns. It keeps what we do again and again.', zh: '我们练习的时候，大脑在学习。它把反复做的事记下来。' },
      { art: 'library|grandpa,dad|answer|?', en: 'Doing it again makes a path. The path is in your brain, and it gets strong with use.', zh: '反复做会走出一条路。这条路在你大脑里，越用越结实。' },
      { art: 'library|grandpa,dad|answer|·', en: 'The path gets easy to follow. Your hand knows what comes next, before you think.', zh: '这条路越来越好走。你的手在你思考之前就知道下一步。' },
      { art: 'library|grandpa,dad|answer|!', en: 'Practice is the answer. Ming practices writing his name because he wants it to look good.', zh: '练习就是答案。明明练写自己的名字，因为他想写好看。' },
      { art: 'library|grandpa,dad|answer|♥', en: 'Ming practices every day. At first the letters are not even.', zh: '明明每天练。一开始字母写得歪歪扭扭。' },
      { art: 'library|grandpa,dad|answer|★', en: 'It gets easier and easier. By the end of the week they look good.', zh: '写着写着就容易了。到周末已经写得好看了。' },
      { art: 'library|grandpa,dad|answer|…', en: 'He shows Grandma the two pages. She can see the change.', zh: '他把前后两页给奶奶看。奶奶看出了变化。' },
      { art: 'library|grandpa,dad|answer|·', en: 'Practice is not just doing. It is doing it again with care, and that is what makes it work.', zh: '练习不只是做。是用心地再做一遍，这才让它起作用。' },
      { art: 'library|grandpa,dad|answer|♥', en: 'Practice is making a path. It is a path you can use later.', zh: '练习就是修一条路。这条路以后能走。' },
      { art: 'library|grandpa,dad|answer|·', en: 'Ming keeps practicing. He writes three lines each day, and the lines look better.', zh: '明明继续练。他每天写三行，这些行看着好多了。' },
      { art: 'library|grandpa,dad|answer|…', en: 'The path is strong now. He does not have to think hard when he writes.', zh: '这条路现在很结实。他写的时候不用费劲想。' },
      { art: 'library|grandpa,dad|answer|?', en: 'Practice works. His name looks different now, and he can see the change.', zh: '练习有用。他的名字现在看起来不一样了，变化他看得见。' },
      { art: 'library|grandpa,dad|answer|·', en: 'Keep practicing. Tomorrow he will try a new word because the old one is easy now.', zh: '继续练。明天他要试一个新词，因为旧的现在很容易了。' }
    ],
    quiz: [
      { q: '明明练写名字，一个星期后怎么样？', opts: ['还是歪歪扭扭', '写得好看多了', '不想再练了'], a: 1, kind: 'recall' },
      { q: '练习为什么有用？', opts: ['反复做，脑子会走出一条好走的路', '因为别人看着', '因为练习很快'], a: 0, kind: 'infer' },
      { q: '练一样东西觉得没进步，你会怎么做？', opts: ['不练了', '继续练，它在慢慢成路', '换一样'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b119', lv: 'L10', tag: '小知识', title: 'Small Steps, Long Way', zh: '小步子，长路',
    emoji: '🛤️', color: '#C8E7F0',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。认读 1 个新词（将来）。',
    trap: '桥梁书按自然段读：一句里先找「谁 + 做什么」，再把修饰部分补进去。',
    summary: '《小步子，长路》：这一本从一件小事讲起，说说为什么会这样。读前先看词卡（将来）；读的时候留意先看到什么、为什么会这样、后来怎么弄明白。',
    retell: '合上书，按「先看到什么 → 为什么会这样 → 后来怎么弄明白」讲一遍。',
    think: '说说你把一件大事拆成小份做完的经历。',
    pre: [
      { art: '🔮', en: 'future', zh: '将来' },
      { art: '📖', en: 'book', zh: '书' },
      { art: '🖼️', en: 'picture', zh: '图画' }
    ],
    sight: [],
    newWords: [
      { w: 'future', zh: '将来' }
    ],
    pages: [
      { art: 'library|mom,ming|future|·', en: 'Some work takes a long time. Ming thinks about the future, when the book will be done.', zh: '有些事要花很长时间。明明想到了将来，书做完的那天。' },
      { art: 'library|mom,ming|future|♪', en: 'He wants to make a picture book because he has many pictures.', zh: '他想做一本图画书，因为他有很多画。' },
      { art: 'library|mom,ming|future|👀', en: 'He does not do it all in one day. He paints one page.', zh: '他不在一天里做完。他一天画一页。' },
      { art: 'library|mom,ming|future|?', en: 'The next day he paints one more and keeps the same pace. The book grows page by page.', zh: '第二天他再画一页，保持同样的节奏。书一页一页变厚。' },
      { art: 'library|mom,ming|future|·', en: 'Each page takes a short time. He looks at it slowly before he starts the next.', zh: '每页花的时间不长。他慢慢看一遍，再开始下一页。' },
      { art: 'library|mom,ming|future|!', en: 'One day he paints too fast. The green leaf looks wrong.', zh: '有一天他画得太快。绿叶画得不对。' },
      { art: 'library|mom,ming|future|♥', en: 'He paints that page again. The slow one looks better.', zh: '他把那页重画了一遍。慢工画出来的更好看。' },
      { art: 'library|mom,ming|future|★', en: 'A fast page needs doing again. That takes more time.', zh: '画快的页要返工。反而更费时间。' },
      { art: 'library|mom,ming|future|…', en: 'Grandma comes in. She looks at the pages in the order that he painted them.', zh: '奶奶走进来。她按他画画的顺序翻看这些页。' },
      { art: 'library|mom,ming|future|·', en: 'The book gets thick. There are many pages now, and he counts them.', zh: '书变厚了。现在已经有很多页，他数了数。' },
      { art: 'library|mom,ming|future|♥', en: 'Ming does not rush. He paints one page each day.', zh: '明明不赶。每天只画一页。' },
      { art: 'library|mom,ming|future|·', en: 'Each small page is part of the whole. Not one is lost.', zh: '每一小页都是整本的一部分。一页也没白费。' },
      { art: 'library|mom,ming|future|…', en: 'Ming paints the last page. He puts the book together, and it looks like a book from a shop.', zh: '明明画完最后一页。他把书装订起来，看起来像店里卖的书。' },
      { art: 'library|mom,ming|future|?', en: 'He shows it to his class. They look at every page, and they ask how long it took.', zh: '他拿给班里看。大家一页页翻，还问做了多久。' },
      { art: 'library|mom,ming|future|·', en: 'Lili wants one of her own. Ming gives her a pen.', zh: '丽丽也想要一本。明明递给她一支笔。' }
    ],
    quiz: [
      { q: '明明画得太快的那一页后来怎么了？', opts: ['大家都说好', '被丽丽拿走了', '画得不对，只好重画'], a: 2, kind: 'recall' },
      { q: '为什么赶着画反而更费时间？', opts: ['因为慢就不用画了', '因为笔不够好', '画快了容易出错，重画更费工夫'], a: 2, kind: 'infer' },
      { q: '有一件很大的事要做，你会怎么安排？', opts: ['放着不做', '一天全赶完', '分成小份，每天稳稳做一点'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b120', lv: 'L10', tag: '复习', title: 'The Whole Idea', zh: '完整的想法',
    emoji: '🧠', color: '#E8D9B5',
    track: 'review',
    goal: '把本级和前面级别的词再读一遍、串成一个故事。认读 1 个新词（重要）。',
    trap: '桥梁书按自然段读：一句里先找「谁 + 做什么」，再把修饰部分补进去。',
    summary: '《完整的想法》：这是一个完整的小故事。读前先看词卡（重要）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '不看书写一段 5 句的口头小结，再说说这件事让你想到什么。',
    think: '说说你的一个想法是怎么变清楚的。',
    pre: [
      { art: '✨', en: 'important', zh: '重要' },
      { art: '📍', en: 'corner', zh: '角落' },
      { art: '📦', en: 'paper', zh: '纸' }
    ],
    sight: [],
    newWords: [
      { w: 'important', zh: '重要' }
    ],
    pages: [
      { art: 'library|dad,lili|idea|·', en: 'Ming has a big idea. He wants a reading corner in class.', zh: '明明有个大想法。他想在班里做一个读书角。' },
      { art: 'library|dad,lili|idea|♪', en: 'At first it is not clear. He can only say a few words.', zh: '一开始它不清楚。他只能说出几个词。' },
      { art: 'library|dad,lili|idea|👀', en: 'Ming tells Lili about it. They stand at the gate, and he talks with his hands.', zh: '明明把这事讲给丽丽听。两人站在门口，他一边说一边比划。' },
      { art: 'library|dad,lili|idea|?', en: 'The idea gets clearer. She asks where the books will go.', zh: '想法变清楚了。她问书要放在哪儿。' },
      { art: 'library|dad,lili|idea|·', en: 'Ming writes it down and draws a small plan on paper. The paper is small, but it is clear.', zh: '明明写下来，在纸上画了个小计划。纸不大，可画得清楚。' },
      { art: 'library|dad,lili|idea|!', en: 'The whole idea is there: a box, a board, and books. He smiles at it.', zh: '整个想法都在那儿了：一个箱子、一块板、还有书。他看着它笑了。' },
      { art: 'library|dad,lili|idea|♥', en: 'It takes time to grow. Each day he adds one small part.', zh: '想法需要时间长大。每天添上一小处。' },
      { art: 'library|dad,lili|idea|★', en: 'But the idea is whole. Nothing important is missing, and he can explain it in three words.', zh: '可这个想法是完整的。要紧的都没漏，他三个词就能说清。' },
      { art: 'library|dad,lili|idea|…', en: 'He shows the plan to his teacher. She asks two questions.', zh: '他把计划拿给老师看。老师问了两个问题。' },
      { art: 'library|dad,lili|idea|·', en: 'She suggests one more thing. A small box that will hold the little books.', zh: '她建议再加一样。一个小盒子，用来装那些小书。' },
      { art: 'library|dad,lili|idea|♥', en: 'Ming keeps the idea safe. The paper stays in his bag.', zh: '明明把想法收好。那张纸一直放在包里。' },
      { art: 'library|dad,lili|idea|·', en: 'The idea will help others. The class can share the books, so everyone reads more.', zh: '这个想法能帮到别人。班里可以一起分享这些书，于是人人读得更多。' },
      { art: 'library|dad,lili|idea|…', en: 'The whole idea, start to end. They build the corner that week.', zh: '完整的想法，从头到尾。那个星期他们把读书角做起来了。' },
      { art: 'library|dad,lili|idea|?', en: 'It began as three words on a board. Now the corner has a name.', zh: '这一切从板上的三个词开始。现在读书角有了名字。' },
      { art: 'library|dad,lili|idea|·', en: 'Lili paints the name on the board. Ming puts the first book in, and the corner is ready.', zh: '丽丽把名字画在板上。明明放进第一本书，读书角就成了。' }
    ],
    quiz: [
      { q: '他们最后把读书角建在哪儿？', opts: ['家里', '班里', '图书馆'], a: 1, kind: 'recall' },
      { q: '想法是怎么变清楚的？', opts: ['一下就想清楚了', '说着说着、写着写着，慢慢清楚了', '别人给的'], a: 1, kind: 'infer' },
      { q: '有一个想法但还很模糊，你会怎么做？', opts: ['马上丢掉', '不说', '说出来、写下来，让它慢慢清楚'], a: 2, kind: 'transfer' }
    ]
  }
];

window.BOOKS = BOOKS;
