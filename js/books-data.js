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
      { q: '下面哪个词在这一本里读到过？', opts: ['苹果', '鸭子', '帽子'], a: 2, kind: 'recall' },
      { q: '帽子最后在哪里？', opts: ['在猫身上', '在桌子下面', '在水里'], a: 0, kind: 'infer' },
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
      { q: '下面哪个词在这一本里读到过？', opts: ['盒子', '牛奶', '帽子'], a: 1, kind: 'recall' },
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
      { q: '下面哪个词在这一本里读到过？', opts: ['红色', '鸡蛋', '一'], a: 0, kind: 'recall' },
      { q: '这一本讲了哪两种颜色？', opts: ['红色和绿色', '红色和蓝色', '蓝色和黄色'], a: 1, kind: 'infer' },
      { q: '看到一样东西的颜色，你会怎么做？', opts: ['用英文说出它的颜色', '只看不说', '跳过去'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b4', lv: 'L1', tag: '吃饭', title: 'I Eat', zh: '我吃东西',
    emoji: '🍚', color: '#C6DEF6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 3 个新词（吃、米饭、苹果）。',
    trap: '这一级是整体认读：词不用拼，先听整句，再跟着说；别一个字母一个字母念。',
    summary: '《我吃东西》：这是一个完整的小故事。读前先看词卡（吃、米饭、苹果）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '指着分镜，用英文说出这一页的东西，再把整本连起来读一遍。',
    think: '说说你最喜欢吃的一样东西。',
    pre: [
      { art: '🏃', en: 'eat', zh: '吃' },
      { art: '🍚', en: 'rice', zh: '米饭' },
      { art: '🍎', en: 'apple', zh: '苹果' }
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
      { q: '下面哪个词在这一本里读到过？', opts: ['苹果', '帽子', '茶'], a: 0, kind: 'recall' },
      { q: '我吃了什么？', opts: ['米饭和苹果', '米饭和鸡蛋', '苹果和鱼'], a: 0, kind: 'infer' },
      { q: '吃东西时，你会怎么做？', opts: ['一口全吞下去', '慢慢吃，尝尝味道', '不吃了'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b5', lv: 'L1', tag: '上学', title: 'My Bag', zh: '我的书包',
    emoji: '🎒', color: '#E0CFF3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 2 个新词（书包、笔）。',
    trap: '这一级是整体认读：词不用拼，先听整句，再跟着说；别一个字母一个字母念。',
    summary: '《我的书包》：这是一个完整的小故事。读前先看词卡（书包、笔）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '指着分镜，用英文说出这一页的东西，再把整本连起来读一遍。',
    think: '说说你的书包里有什么。',
    pre: [
      { art: '🎒', en: 'bag', zh: '书包' },
      { art: '🖊️', en: 'pen', zh: '笔' },
      { art: '📖', en: 'book', zh: '书' }
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
      { q: '下面哪个词在这一本里读到过？', opts: ['球', '猪', '书包'], a: 2, kind: 'recall' },
      { q: '书包里有什么？', opts: ['笔和书', '书和苹果', '笔和帽子'], a: 0, kind: 'infer' },
      { q: '想找书包里的东西，你会怎么做？', opts: ['把东西全倒出来', '打开书包，一样一样看一看', '不找了'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b6', lv: 'L1', tag: '天气', title: 'The Sun', zh: '太阳',
    emoji: '☀️', color: '#F6C9E3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 5 个新词（太阳、天空、热、暖、手）。',
    trap: '这一级是整体认读：词不用拼，先听整句，再跟着说；别一个字母一个字母念。',
    summary: '《太阳》：这是一个完整的小故事。读前先看词卡（太阳、天空、热、暖、手）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '指着分镜，用英文说出这一页的东西，再把整本连起来读一遍。',
    think: '说说有太阳的时候，你会做什么。',
    pre: [
      { art: '☀️', en: 'sun', zh: '太阳' },
      { art: '🌿', en: 'sky', zh: '天空' },
      { art: '🔥', en: 'hot', zh: '热' },
      { art: '✨', en: 'warm', zh: '暖' },
      { art: '✋', en: 'hand', zh: '手' }
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
      { q: '下面哪个词在这一本里读到过？', opts: ['罐子', '手', '树'], a: 1, kind: 'recall' },
      { q: '太阳是什么样的？', opts: ['又小又冷', '又小又热', '又大又热'], a: 2, kind: 'infer' },
      { q: '太阳很晒的时候，你会怎么做？', opts: ['一直站在太阳下', '找阴凉的地方待着', '不管它'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b7', lv: 'L1', tag: '比一比', title: 'Big and Small', zh: '大和小',
    emoji: '🐘', color: '#BFE6DF',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 1 个新词（球）。',
    trap: '这一级是整体认读：词不用拼，先听整句，再跟着说；别一个字母一个字母念。',
    summary: '《大和小》：这是一个完整的小故事。读前先看词卡（球）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '指着分镜，用英文说出这一页的东西，再把整本连起来读一遍。',
    think: '找两样东西，说说哪个大、哪个小。',
    pre: [
      { art: '⚽', en: 'ball', zh: '球' }
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
      { q: '下面哪个词在这一本里读到过？', opts: ['宝宝', '鸡蛋', '球'], a: 2, kind: 'recall' },
      { q: '这一本讲了球的什么？', opts: ['大的和小的', '新的和旧的', '红的和蓝的'], a: 0, kind: 'infer' },
      { q: '要比两样东西的大小，你会怎么做？', opts: ['只看一个就说', '把它们放在一起比一比', '随便说一个'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b8', lv: 'L1', tag: '家里', title: 'My Cup', zh: '我的杯子',
    emoji: '🥛', color: '#F2E2A8',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 1 个新词（杯子）。',
    trap: '这一级是整体认读：词不用拼，先听整句，再跟着说；别一个字母一个字母念。',
    summary: '《我的杯子》：这是一个完整的小故事。读前先看词卡（杯子）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '指着分镜，用英文说出这一页的东西，再把整本连起来读一遍。',
    think: '说说你用什么杯子喝水。',
    pre: [
      { art: '🥛', en: 'cup', zh: '杯子' },
      { art: '🥛', en: 'milk', zh: '牛奶' }
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
      { q: '下面哪个词在这一本里读到过？', opts: ['猫', '丽丽', '红色'], a: 2, kind: 'recall' },
      { q: '杯子里有什么？', opts: ['水', '茶', '牛奶'], a: 2, kind: 'infer' },
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
      { art: '🎩', en: 'hat', zh: '帽子' },
      { art: '📦', en: 'can', zh: '罐子' }
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
      { q: '下面哪个词在这一本里读到过？', opts: ['朋友', '猪', '帽子'], a: 2, kind: 'recall' },
      { q: '这一本在练什么？', opts: ['说「书」这个词', '说「猫」这个词', '说「帽子」这个词'], a: 2, kind: 'infer' },
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
      { q: '下面哪个词在这一本里读到过？', opts: ['明明', '太阳', '水'], a: 1, kind: 'recall' },
      { q: '书里有什么？', opts: ['太阳和树', '猫和太阳', '猫和狗'], a: 1, kind: 'infer' },
      { q: '读书的时候，你会怎么做？', opts: ['不看', '随便翻翻就合上', '一页一页慢慢看'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b11', lv: 'L1', tag: '认物', title: 'Water and Rice', zh: '水和米饭',
    emoji: '💧', color: '#C8E7F0',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。认读 2 个新词（水、喝）。',
    trap: '这一级是整体认读：词不用拼，先听整句，再跟着说；别一个字母一个字母念。',
    summary: '《水和米饭》：这一本从一件小事讲起，说说为什么会这样。读前先看词卡（水、喝）；读的时候留意先看到什么、为什么会这样、后来怎么弄明白。',
    retell: '合上书，按「先看到什么 → 为什么会这样 → 后来怎么弄明白」讲一遍。',
    think: '说说你吃饭时会喝什么、吃什么。',
    pre: [
      { art: '💧', en: 'water', zh: '水' },
      { art: '🏃', en: 'drink', zh: '喝' },
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
      { q: '下面哪个词在这一本里读到过？', opts: ['水', '球', '笔'], a: 0, kind: 'recall' },
      { q: '我喝了什么、吃了什么？', opts: ['牛奶和鸡蛋', '茶和苹果', '水和米饭'], a: 2, kind: 'infer' },
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
      { q: '下面哪个词在这一本里读到过？', opts: ['鸭子', '杯子', '黄色'], a: 1, kind: 'recall' },
      { q: '盒子里有什么？', opts: ['帽子和杯子', '杯子和苹果', '帽子和书'], a: 0, kind: 'infer' },
      { q: '想记住几样东西，你会怎么做？', opts: ['不记了', '把它们放在一起，一起看', '随便乱放'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b13', lv: 'L2', tag: '农场', title: 'A Pig and a Hen', zh: '小猪和母鸡',
    emoji: '🐷', color: '#F6C6C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 2 个新词（母鸡、胖）。',
    trap: '短元音要收住韵尾：cap 的 p 是双唇轻轻一闭，不要加「呃」读成「卡普呃」。',
    summary: '《小猪和母鸡》：这是一个完整的小故事。读前先看词卡（母鸡、胖）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '指着分镜，用英文说出这一页的东西，再把整本连起来读一遍。',
    think: '说说两种小动物：它们长得一样吗？',
    pre: [
      { art: '🐔', en: 'hen', zh: '母鸡' },
      { art: '✨', en: 'fat', zh: '胖' },
      { art: '🐷', en: 'pig', zh: '猪' }
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
      { q: '下面哪个词在这一本里读到过？', opts: ['杯子', '猪', '蝙蝠'], a: 1, kind: 'recall' },
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
      { q: '下面哪个词在这一本里读到过？', opts: ['公交车', '鸭舌帽', '奶奶'], a: 1, kind: 'recall' },
      { q: '我的帽子是什么颜色的？', opts: ['蓝色', '黄色', '红色'], a: 2, kind: 'infer' },
      { q: '东西不见了，你会怎么做？', opts: ['马上哭', '不要了', '想一想可能在哪儿，再去找'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b15', lv: 'L2', tag: '天气', title: 'Mud and Fog', zh: '泥和雾',
    emoji: '🌫️', color: '#CDE7C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 5 个新词（干、雾、路、湿、泥）。',
    trap: '短元音要收住韵尾：cap 的 p 是双唇轻轻一闭，不要加「呃」读成「卡普呃」。',
    summary: '《泥和雾》：这是一个完整的小故事。读前先看词卡（干、雾、路、湿、泥）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '指着分镜，用英文说出这一页的东西，再把整本连起来读一遍。',
    think: '说说一个有雾或下雨的日子。',
    pre: [
      { art: '✨', en: 'dry', zh: '干' },
      { art: '🌫️', en: 'fog', zh: '雾' },
      { art: '🛣️', en: 'road', zh: '路' },
      { art: '✨', en: 'wet', zh: '湿' },
      { art: '🟤', en: 'mud', zh: '泥' }
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
      { q: '下面哪个词在这一本里读到过？', opts: ['泥', '帽子', '爸爸'], a: 0, kind: 'recall' },
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
      { q: '下面哪个词在这一本里读到过？', opts: ['小虫', '奶奶', '盖子'], a: 0, kind: 'recall' },
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
      { art: '📦', en: 'lid', zh: '盖子' }
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
      { q: '下面哪个词在这一本里读到过？', opts: ['头', '厨房', '妈妈'], a: 1, kind: 'recall' },
      { q: '锅在哪里？', opts: ['花园里', '卧室里', '厨房里'], a: 2, kind: 'infer' },
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
      { q: '下面哪个词在这一本里读到过？', opts: ['厨房', '坚果', '公交车'], a: 2, kind: 'recall' },
      { q: '我是怎么去的？', opts: ['坐公交车', '走路', '骑自行车'], a: 0, kind: 'infer' },
      { q: '等公交车的时候，你会怎么做？', opts: ['不等了', '跑到路中间去', '站在安全的地方等它来'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b19', lv: 'L2', tag: '找路', title: 'A Map for Ming', zh: '明明的地图',
    emoji: '🗺️', color: '#BFE6DF',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 2 个新词（地图、小山）。',
    trap: '短元音要收住韵尾：cap 的 p 是双唇轻轻一闭，不要加「呃」读成「卡普呃」。',
    summary: '《明明的地图》：这是一个完整的小故事。读前先看词卡（地图、小山）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '指着分镜，用英文说出这一页的东西，再把整本连起来读一遍。',
    think: '说说地图能帮你做什么。',
    pre: [
      { art: '🗺️', en: 'map', zh: '地图' },
      { art: '🌿', en: 'hill', zh: '小山' }
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
      { q: '下面哪个词在这一本里读到过？', opts: ['泥', '地图', '石头'], a: 1, kind: 'recall' },
      { q: '地图上有什么？', opts: ['一个杯子', '一只猫', '一座小山'], a: 2, kind: 'infer' },
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
      { art: '✋', en: 'hand', zh: '手' }
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
      { q: '下面哪个词在这一本里读到过？', opts: ['猪', '手', '树'], a: 1, kind: 'recall' },
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
      { q: '下面哪个词在这一本里读到过？', opts: ['黄色', '笔', '米饭'], a: 1, kind: 'recall' },
      { q: '这一本在比哪两个词？', opts: ['pen 和 pin', 'pin 和 pan', 'pen 和 pan'], a: 0, kind: 'infer' },
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
      { q: '下面哪个词在这一本里读到过？', opts: ['陀螺', '蝙蝠', '坚果'], a: 2, kind: 'recall' },
      { q: '蚂蚁有什么？', opts: ['一颗坚果', '一个面包', '一条虫'], a: 0, kind: 'infer' },
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
      { art: 'kitchen|mom,ming|pot|♪', en: 'I want it dry.', zh: '我想让它干。' },
      { art: 'kitchen|mom,ming|pot|👀', en: 'I put the pot in the sun.', zh: '我把锅放到太阳下。' },
      { art: 'kitchen|mom,ming|pot|?', en: 'The sun is hot.', zh: '太阳很热。' },
      { art: 'kitchen|mom,ming|pot|·', en: 'The pot is dry now!', zh: '锅现在干了！' },
      { art: 'kitchen|mom,ming|pot|!', en: 'Wet and dry.', zh: '湿的和干的。' },
      { art: 'kitchen|mom,ming|pot|♥', en: 'I like a dry pot.', zh: '我喜欢干干的锅。' }
    ],
    quiz: [
      { q: '下面哪个词在这一本里读到过？', opts: ['动物', '盒子', '锅'], a: 2, kind: 'recall' },
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
      { q: '下面哪个词在这一本里读到过？', opts: ['果酱', '蓝色', '扇子'], a: 0, kind: 'recall' },
      { q: '小店在哪儿？', opts: ['小河边', '小山上', '大树下'], a: 1, kind: 'infer' },
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
      { q: '下面哪个词在这一本里读到过？', opts: ['轮船', '陀螺', '锅'], a: 0, kind: 'recall' },
      { q: '船是怎么回来的？', opts: ['它自己开回来的', '风转了，把它带了回来', '明明游过去拿的'], a: 1, kind: 'infer' },
      { q: '东西被风吹跑了，你会怎么做？', opts: ['等风向变了，别硬追', '再买一个', '一直追着风跑'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b26', lv: 'L3', tag: '趣事', title: 'A Duck in the Shop', zh: '店里的一只鸭子',
    emoji: '🦆', color: '#F9DFB4',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 3 个新词（奶酪、害怕、拿）。',
    trap: 'sh 把嘴唇撅圆、th 把舌尖轻轻放在上下门牙中间；ck 只发一个 k，别读两遍。',
    summary: '《店里的一只鸭子》：这是一个完整的小故事。读前先看词卡（奶酪、害怕、拿）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，按「开头 → 后来 → 最后」把这件事讲一遍。',
    think: '说说你见过的一件好笑的事。',
    pre: [
      { art: '🧀', en: 'cheese', zh: '奶酪' },
      { art: '✨', en: 'afraid', zh: '害怕' },
      { art: '🏃', en: 'take', zh: '拿' },
      { art: '🦆', en: 'duck', zh: '鸭子' },
      { art: '🏪', en: 'shop', zh: '小店' }
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
      { q: '下面哪个词在这一本里读到过？', opts: ['动物', '鸭子', '袜子'], a: 1, kind: 'recall' },
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
      { q: '下面哪个词在这一本里读到过？', opts: ['盘子', '太阳', '蚂蚁'], a: 0, kind: 'recall' },
      { q: '我先吃了什么？', opts: ['薯条', '米饭', '鱼'], a: 2, kind: 'infer' },
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
      { q: '下面哪个词在这一本里读到过？', opts: ['沙滩', '水', '小鸡'], a: 2, kind: 'recall' },
      { q: '戒指最后在哪里？', opts: ['在一只小鸡那儿', '在桌子下面', '再也找不到了'], a: 0, kind: 'infer' },
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
      { q: '下面哪个词在这一本里读到过？', opts: ['蓝色', '动物', '飞蛾'], a: 2, kind: 'recall' },
      { q: '飞蛾最后怎么了？', opts: ['飞走了', '被抓住了', '停在我手上'], a: 0, kind: 'infer' },
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
      { art: '🏖️', en: 'beach', zh: '沙滩' },
      { art: '🌿', en: 'wind', zh: '风' }
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
      { q: '下面哪个词在这一本里读到过？', opts: ['鸟', '薯条', '沙子'], a: 2, kind: 'recall' },
      { q: '我们在海边做了什么？', opts: ['吃东西', '唱歌', '游泳'], a: 1, kind: 'infer' },
      { q: '在海边玩，你会怎么做？', opts: ['不玩了', '一个人跑得很远', '唱歌、玩沙，注意安全'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b31', lv: 'L3', tag: '家务', title: 'Wash the Dish', zh: '洗盘子',
    emoji: '🍽️', color: '#BFE6DF',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 3 个新词（打扫、洗、用）。',
    trap: 'sh 把嘴唇撅圆、th 把舌尖轻轻放在上下门牙中间；ck 只发一个 k，别读两遍。',
    summary: '《洗盘子》：这是一个完整的小故事。读前先看词卡（打扫、洗、用）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，按「开头 → 后来 → 最后」把这件事讲一遍。',
    think: '说说你做过的一件家务。',
    pre: [
      { art: '🏃', en: 'clean', zh: '打扫' },
      { art: '🏃', en: 'wash', zh: '洗' },
      { art: '🏃', en: 'use', zh: '用' },
      { art: '🍽️', en: 'dish', zh: '盘子' },
      { art: '💧', en: 'water', zh: '水' }
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
      { q: '下面哪个词在这一本里读到过？', opts: ['盘子', '书', '杯子'], a: 0, kind: 'recall' },
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
      { art: 'farm|lili,grandpa|chick|★', en: 'My wish is good.', zh: '我的心愿真好。' }
    ],
    quiz: [
      { q: '下面哪个词在这一本里读到过？', opts: ['扇子', '食物', '公交车'], a: 1, kind: 'recall' },
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
      { art: '🚢', en: 'ship', zh: '轮船' },
      { art: '📦', en: 'can', zh: '罐子' }
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
      { q: '下面哪个词在这一本里读到过？', opts: ['轮船', '鸡蛋', '帽子'], a: 0, kind: 'recall' },
      { q: '这一本在比哪两个词？', opts: ['chip 和 chop', 'ship 和 shop', 'ship 和 chip'], a: 2, kind: 'infer' },
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
      { q: '下面哪个词在这一本里读到过？', opts: ['水壶', '鸟', '朋友'], a: 1, kind: 'recall' },
      { q: '鸟用什么飞？', opts: ['长长的腿', '长长的翅膀', '长长的尾巴'], a: 1, kind: 'infer' },
      { q: '想做成一件难事，你会怎么做？', opts: ['一次就想学会', '不学了', '先看别人怎么做，再慢慢练'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b35', lv: 'L3', tag: '小知识', title: 'Fresh Cheese', zh: '新鲜的奶酪',
    emoji: '🧀', color: '#C8E7F0',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。认读 1 个新词（软）。',
    trap: 'sh 把嘴唇撅圆、th 把舌尖轻轻放在上下门牙中间；ck 只发一个 k，别读两遍。',
    summary: '《新鲜的奶酪》：这一本从一件小事讲起，说说为什么会这样。读前先看词卡（软）；读的时候留意先看到什么、为什么会这样、后来怎么弄明白。',
    retell: '合上书，按「先看到什么 → 为什么会这样 → 后来怎么弄明白」讲一遍。',
    think: '说说一种你喜欢的奶制品。',
    pre: [
      { art: '✨', en: 'soft', zh: '软' },
      { art: '🧀', en: 'cheese', zh: '奶酪' },
      { art: '🍽️', en: 'dish', zh: '盘子' }
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
      { q: '下面哪个词在这一本里读到过？', opts: ['嘴唇', '手', '奶酪'], a: 2, kind: 'recall' },
      { q: '奶酪是什么样的？', opts: ['又硬又咸', '新鲜、软软的', '又干又苦'], a: 1, kind: 'infer' },
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
      { q: '下面哪个词在这一本里读到过？', opts: ['家人', '一', '丽丽'], a: 0, kind: 'recall' },
      { q: '我在棚子边看到了什么？', opts: ['一只母鸡', '一条鱼', '一头猪'], a: 0, kind: 'infer' },
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
      { q: '下面哪个词在这一本里读到过？', opts: ['动物', '鸟', '石头'], a: 2, kind: 'recall' },
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
      { q: '下面哪个词在这一本里读到过？', opts: ['旗子', '盒子', '胳膊'], a: 0, kind: 'recall' },
      { q: '我有一面什么颜色的旗？', opts: ['绿色', '红色', '蓝色'], a: 2, kind: 'infer' },
      { q: '和别人一起做一件事，你会怎么做？', opts: ['自己全占', '不做了', '分一分，大家一起做'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b39', lv: 'L4', tag: '夜空', title: 'Stars in the Sky', zh: '天上的星星',
    emoji: '⭐', color: '#CDE7C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 1 个新词（星星）。',
    trap: '连缀中间不加元音：tree 是「tr-ee」一个词，不是「特-瑞」两个音。',
    summary: '《天上的星星》：这是一个完整的小故事。读前先看词卡（星星）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，按「开头 → 后来 → 最后」把这件事讲一遍。',
    think: '说说你在夜空里看到过什么。',
    pre: [
      { art: '⭐', en: 'star', zh: '星星' },
      { art: '🌿', en: 'sky', zh: '天空' }
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
      { q: '下面哪个词在这一本里读到过？', opts: ['天空', '罐子', '床'], a: 0, kind: 'recall' },
      { q: '我看到了什么？', opts: ['云', '太阳', '好多星星'], a: 2, kind: 'infer' },
      { q: '晚上看星星，你会怎么做？', opts: ['找个安静的地方，慢慢看', '不看', '大声喊'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b40', lv: 'L4', tag: '上学', title: 'The Clock at School', zh: '学校的钟',
    emoji: '🕐', color: '#C6DEF6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 2 个新词（钟、房间）。',
    trap: '连缀中间不加元音：tree 是「tr-ee」一个词，不是「特-瑞」两个音。',
    summary: '《学校的钟》：这是一个完整的小故事。读前先看词卡（钟、房间）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，按「开头 → 后来 → 最后」把这件事讲一遍。',
    think: '说说你家里的一口钟或一块表。',
    pre: [
      { art: '🕐', en: 'clock', zh: '钟' },
      { art: '📦', en: 'room', zh: '房间' },
      { art: '📖', en: 'book', zh: '书' },
      { art: '🏫', en: 'school', zh: '学校' }
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
      { q: '下面哪个词在这一本里读到过？', opts: ['房间', '螃蟹', '面包'], a: 0, kind: 'recall' },
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
      { q: '下面哪个词在这一本里读到过？', opts: ['草', '奶酪', '鸭子'], a: 0, kind: 'recall' },
      { q: '螃蟹躲到哪里去了？', opts: ['水里', '草里', '石头下面'], a: 1, kind: 'infer' },
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
      { q: '下面哪个词在这一本里读到过？', opts: ['旗子', '手', '云'], a: 1, kind: 'recall' },
      { q: '天鹅在哪里？', opts: ['树上', '岸上', '水上'], a: 2, kind: 'infer' },
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
      { q: '下面哪个词在这一本里读到过？', opts: ['鼓', '篮子', '奶奶'], a: 1, kind: 'recall' },
      { q: '礼物是给谁的？', opts: ['奶奶', '爸爸', '妈妈'], a: 2, kind: 'infer' },
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
      { art: '💡', en: 'fun', zh: '乐趣' }
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
      { q: '下面哪个词在这一本里读到过？', opts: ['朋友', '火腿', '旗子'], a: 0, kind: 'recall' },
      { q: '我用鼓做什么？', opts: ['敲出声音、玩', '装东西', '切菜'], a: 0, kind: 'infer' },
      { q: '玩一样喜欢的乐器，你会怎么做？', opts: ['不玩了', '乱敲一通', '按节奏来，好好享受'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b45', lv: 'L4', tag: '发音', title: 'Say It: Tree', zh: '说一说：tree',
    emoji: '🗣️', color: '#D9D2F5',
    track: 'drill',
    goal: '把本级难点音听准、说准，并能在整句里读对。不引入新词，全部是读过的词。',
    trap: '连缀中间不加元音：tree 是「tr-ee」一个词，不是「特-瑞」两个音。',
    summary: '《说一说：tree》：这一本练两个词的音和形。读前先看词卡，都是学过的词；读的时候先看清每个词，再连起来读一遍。',
    retell: '把这一本练的两个词再读一遍，说说它们的音哪里一样、哪里不一样。',
    think: '找一个带 tr 的词，读一读。',
    pre: [
      { art: '🌳', en: 'tree', zh: '树' },
      { art: '📦', en: 'can', zh: '罐子' }
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
      { q: '下面哪个词在这一本里读到过？', opts: ['水壶', '树', '奶奶'], a: 1, kind: 'recall' },
      { q: '这一本在练什么？', opts: ['说「草」这个词', '说「花」这个词', '说「树」这个词'], a: 2, kind: 'infer' },
      { q: '遇到带 tr 的单词，你会怎么读？', opts: ['跳过去', '把 tr 连成一个音读出来', '一个字母一个字母念'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b46', lv: 'L4', tag: '小知识', title: 'How a Stem Grows', zh: '茎怎么长',
    emoji: '🌱', color: '#FAD3B6',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。认读 2 个新词（茎、花）。',
    trap: '连缀中间不加元音：tree 是「tr-ee」一个词，不是「特-瑞」两个音。',
    summary: '《茎怎么长》：这一本从一件小事讲起，说说为什么会这样。读前先看词卡（茎、花）；读的时候留意先看到什么、为什么会这样、后来怎么弄明白。',
    retell: '合上书，按「先看到什么 → 为什么会这样 → 后来怎么弄明白」讲一遍。',
    think: '说说一株植物是怎么长大的。',
    pre: [
      { art: '🌿', en: 'stem', zh: '茎' },
      { art: '🌻', en: 'flower', zh: '花' }
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
      { q: '下面哪个词在这一本里读到过？', opts: ['茎', '厨房', '葡萄'], a: 0, kind: 'recall' },
      { q: '茎是怎么长的？', opts: ['从细小长到粗高，还长出叶子和花', '越长越小', '一直不变'], a: 0, kind: 'infer' },
      { q: '想看着一样东西长大，你会怎么做？', opts: ['每天看看，耐心等', '不看了', '一直拔它'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b47', lv: 'L4', tag: '小知识', title: 'Snow on the Street', zh: '街上的雪',
    emoji: '❄️', color: '#C8E7F0',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。认读 3 个新词（雪、街道、白色）。',
    trap: '连缀中间不加元音：tree 是「tr-ee」一个词，不是「特-瑞」两个音。',
    summary: '《街上的雪》：这一本从一件小事讲起，说说为什么会这样。读前先看词卡（雪、街道、白色）；读的时候留意先看到什么、为什么会这样、后来怎么弄明白。',
    retell: '合上书，按「先看到什么 → 为什么会这样 → 后来怎么弄明白」讲一遍。',
    think: '说说下雪天你会玩什么。',
    pre: [
      { art: '❄️', en: 'snow', zh: '雪' },
      { art: '🛣️', en: 'street', zh: '街道' },
      { art: '⚪', en: 'white', zh: '白色' },
      { art: '⚽', en: 'ball', zh: '球' }
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
      { q: '下面哪个词在这一本里读到过？', opts: ['国王', '街道', '拖把'], a: 1, kind: 'recall' },
      { q: '我为什么不冷了？', opts: ['玩雪球，动起来了', '进屋了', '太阳出来了'], a: 0, kind: 'infer' },
      { q: '下雪天在外面玩，你会怎么做？', opts: ['穿得很少', '穿暖和，玩一会儿就暖起来', '不出去'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b48', lv: 'L4', tag: '复习', title: 'Back to the Playground', zh: '回到操场',
    emoji: '🏫', color: '#E8D9B5',
    track: 'review',
    goal: '把本级和前面级别的词再读一遍、串成一个故事。认读 1 个新词（操场）。',
    trap: '连缀中间不加元音：tree 是「tr-ee」一个词，不是「特-瑞」两个音。',
    summary: '《回到操场》：这是一个完整的小故事。读前先看词卡（操场）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，按「开头 → 后来 → 最后」把这件事讲一遍。',
    think: '说说你在操场上最喜欢玩的东西。',
    pre: [
      { art: '🛝', en: 'playground', zh: '操场' },
      { art: '⚽', en: 'ball', zh: '球' },
      { art: '🚩', en: 'flag', zh: '旗子' }
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
      { q: '下面哪个词在这一本里读到过？', opts: ['人', '明明', '钟'], a: 2, kind: 'recall' },
      { q: '我们在操场上玩了什么？', opts: ['鼓', '书', '球'], a: 2, kind: 'infer' },
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
      { art: '🌳', en: 'tree', zh: '树' }
    ],
    sight: ['bright'],
    newWords: [
      { w: 'rain', zh: '雨' },
      { w: 'farm', zh: '农场' },
      { w: 'gray', zh: '灰色' },
      { w: 'quiet', zh: '安静' },
      { w: 'sheep', zh: '绵羊' }
    ],
    pages: [
      { art: 'night|ming,grandma|rain|·', en: 'Rain is on the farm. The sky is gray.', zh: '农场下雨了。天灰蒙蒙的。' },
      { art: 'night|ming,grandma|rain|♪', en: 'The rain is cold.', zh: '雨是凉的。' },
      { art: 'night|ming,grandma|rain|👀', en: 'The farm is quiet. The sheep stand by the tree.', zh: '农场静悄悄的。羊儿站在树边。' },
      { art: 'night|ming,grandma|rain|?', en: 'The rain falls and falls.', zh: '雨下个不停。' },
      { art: 'night|ming,grandma|rain|·', en: 'The farm is wet. The path is wet too.', zh: '农场湿了。小路也湿了。' },
      { art: 'night|ming,grandma|rain|!', en: 'The rain stops.', zh: '雨停了。' },
      { art: 'night|ming,grandma|rain|♥', en: 'The sun is here. The sky is bright again.', zh: '太阳出来了。天又亮了起来。' },
      { art: 'night|ming,grandma|rain|★', en: 'The farm is not wet now.', zh: '农场现在不湿了。' },
      { art: 'night|ming,grandma|rain|…', en: 'Rain is good for the farm. The seeds can grow.', zh: '雨对农场有好处。种子能长大。' },
      { art: 'night|ming,grandma|rain|·', en: 'I like the rain on the farm.', zh: '我喜欢农场上的雨。' }
    ],
    quiz: [
      { q: '下面哪个词在这一本里读到过？', opts: ['太阳', '朋友', '桌子'], a: 0, kind: 'recall' },
      { q: '雨停以后出现了什么？', opts: ['太阳', '月亮', '雪'], a: 0, kind: 'infer' },
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
      { art: '🌿', en: 'sand', zh: '沙子' }
    ],
    sight: ['blue', 'watch'],
    newWords: [
      { w: 'boat', zh: '小船' },
      { w: 'sea', zh: '海' }
    ],
    pages: [
      { art: 'beach|lili,grandpa|boat|·', en: 'A boat is on the sea. The sea is blue.', zh: '海上有一艘小船。海是蓝蓝的。' },
      { art: 'beach|lili,grandpa|boat|♪', en: 'The boat is small.', zh: '小船很小。' },
      { art: 'beach|lili,grandpa|boat|👀', en: 'The sea is big. I stand on the sand.', zh: '海很大。我站在沙滩上。' },
      { art: 'beach|lili,grandpa|boat|?', en: 'The boat goes on the sea.', zh: '小船在海上走。' },
      { art: 'beach|lili,grandpa|boat|·', en: 'The wind helps the boat. The wind is strong.', zh: '风帮着小船。风很大。' },
      { art: 'beach|lili,grandpa|boat|!', en: 'The boat goes far.', zh: '小船走远了。' },
      { art: 'beach|lili,grandpa|boat|♥', en: 'I watch the boat. I look for a long time.', zh: '我望着小船。我望了好久。' },
      { art: 'beach|lili,grandpa|boat|★', en: 'The boat comes back.', zh: '小船回来了。' },
      { art: 'beach|lili,grandpa|boat|…', en: 'A boat on the sea. The wind brings it home.', zh: '海上的小船。风把它送回家。' },
      { art: 'beach|lili,grandpa|boat|·', en: 'I like the boat.', zh: '我喜欢这艘小船。' }
    ],
    quiz: [
      { q: '下面哪个词在这一本里读到过？', opts: ['风', '礼物', '鸭子'], a: 0, kind: 'recall' },
      { q: '船在什么上面走？', opts: ['海', '河', '路'], a: 0, kind: 'infer' },
      { q: '在水边看船，你会怎么做？', opts: ['不管它', '站远一点，注意安全', '跑到水里去'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b51', lv: 'L5', tag: '夜空', title: 'The Moon and the Sheep', zh: '月亮和绵羊',
    emoji: '🌙', color: '#CDE7C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 2 个新词（月亮、睡觉）。',
    trap: '元音组合只读一个长音：ai / ay 都读 /eɪ/，oa 读 /əʊ/；别把两个字母分开念。',
    summary: '《月亮和绵羊》：这是一个完整的小故事。读前先看词卡（月亮、睡觉）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，讲讲这件事是怎么一步步发展的，中间卡在哪儿。',
    think: '说说月亮和绵羊：它们哪里有点像？',
    pre: [
      { art: '🌙', en: 'moon', zh: '月亮' },
      { art: '🏃', en: 'sleep', zh: '睡觉' },
      { art: '🐑', en: 'sheep', zh: '绵羊' },
      { art: '🌿', en: 'sky', zh: '天空' }
    ],
    sight: ['quiet'],
    newWords: [
      { w: 'moon', zh: '月亮' },
      { w: 'sleep', zh: '睡觉' }
    ],
    pages: [
      { art: 'night|grandma,mom|moon|·', en: 'The moon is in the sky. The sky is black.', zh: '月亮挂在天上。天是黑的。' },
      { art: 'night|grandma,mom|moon|♪', en: 'The moon is big.', zh: '月亮很大。' },
      { art: 'night|grandma,mom|moon|👀', en: 'Sheep are on the hill. They stand on the grass.', zh: '绵羊在小山上。它们站在草地上。' },
      { art: 'night|grandma,mom|moon|?', en: 'The sheep sleep at night.', zh: '绵羊夜里睡觉。' },
      { art: 'night|grandma,mom|moon|·', en: 'The moon looks at the sheep.', zh: '月亮看着绵羊。' },
      { art: 'night|grandma,mom|moon|!', en: 'The sheep are quiet.', zh: '绵羊安安静静。' },
      { art: 'night|grandma,mom|moon|♥', en: 'The moon is quiet too. The sky is big.', zh: '月亮也安安静静。天空很大。' },
      { art: 'night|grandma,mom|moon|★', en: 'The moon and the sheep.', zh: '月亮和绵羊。' },
      { art: 'night|grandma,mom|moon|…', en: 'I like the moon at night. I look up at the sky.', zh: '我喜欢夜里的月亮。我抬头看天。' },
      { art: 'night|grandma,mom|moon|·', en: 'The night is good.', zh: '夜晚真好。' }
    ],
    quiz: [
      { q: '下面哪个词在这一本里读到过？', opts: ['奶奶', '农场', '月亮'], a: 2, kind: 'recall' },
      { q: '绵羊在哪儿？', opts: ['小山上', '水里', '树上'], a: 0, kind: 'infer' },
      { q: '晚上睡不着，你会怎么做？', opts: ['看看安静的月亮，慢慢静下来', '一直翻身', '开很亮的灯'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b52', lv: 'L5', tag: '种植', title: 'A Seed in a Pot', zh: '盆里的种子',
    emoji: '🌱', color: '#C6DEF6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。不引入新词，全部是读过的词。',
    trap: '元音组合只读一个长音：ai / ay 都读 /eɪ/，oa 读 /əʊ/；别把两个字母分开念。',
    summary: '《盆里的种子》：这是一个完整的小故事。读前先看词卡，都是学过的词；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，讲讲这件事是怎么一步步发展的，中间卡在哪儿。',
    think: '说说一粒种子是怎么发芽的。',
    pre: [
      { art: '🍲', en: 'pot', zh: '锅' },
      { art: '🌱', en: 'seed', zh: '种子' }
    ],
    sight: ['grows', 'leaf', 'water'],
    newWords: [

    ],
    pages: [
      { art: 'garden|grandpa,dad|seed|·', en: 'I have a pot. The pot is small.', zh: '我有一个花盆。花盆很小。' },
      { art: 'garden|grandpa,dad|seed|♪', en: 'I put a seed in the pot.', zh: '我把一粒种子放进花盆。' },
      { art: 'garden|grandpa,dad|seed|👀', en: 'The seed is small. It looks like a stone.', zh: '种子很小。它看上去像一颗小石子。' },
      { art: 'garden|grandpa,dad|seed|?', en: 'I give the seed water. I put the pot in the sun.', zh: '我给种子浇水。我把花盆放到太阳下。' },
      { art: 'garden|grandpa,dad|seed|·', en: 'The seed is in the pot.', zh: '种子在花盆里。' },
      { art: 'garden|grandpa,dad|seed|!', en: 'I wait and wait. I wait for a week.', zh: '我等啊等。我等了一个星期。' },
      { art: 'garden|grandpa,dad|seed|♥', en: 'A stem comes up!', zh: '一根茎冒出来了！' },
      { art: 'garden|grandpa,dad|seed|★', en: 'A leaf is up too. The leaf is green.', zh: '一片叶子也长出来了。叶子是绿的。' },
      { art: 'garden|grandpa,dad|seed|…', en: 'The seed grows.', zh: '种子长大了。' },
      { art: 'garden|grandpa,dad|seed|·', en: 'I like my pot and seed.', zh: '我喜欢我的花盆和种子。' }
    ],
    quiz: [
      { q: '下面哪个词在这一本里读到过？', opts: ['国王', '奶奶', '水'], a: 2, kind: 'recall' },
      { q: '种子长出了什么？', opts: ['什么都没长', '花和果子', '茎和叶子'], a: 2, kind: 'infer' },
      { q: '种下一样东西，你会怎么做？', opts: ['每天挖出来看', '不管它', '浇水、耐心等它长'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b53', lv: 'L5', tag: '观察', title: 'A Tail and a Chain', zh: '尾巴和链子',
    emoji: '🐐', color: '#E0CFF3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 2 个新词（尾巴、链子）。',
    trap: '元音组合只读一个长音：ai / ay 都读 /eɪ/，oa 读 /əʊ/；别把两个字母分开念。',
    summary: '《尾巴和链子》：这是一个完整的小故事。读前先看词卡（尾巴、链子）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，讲讲这件事是怎么一步步发展的，中间卡在哪儿。',
    think: '说说狗的尾巴能做什么。',
    pre: [
      { art: '🐾', en: 'tail', zh: '尾巴' },
      { art: '⛓️', en: 'chain', zh: '链子' },
      { art: '🐶', en: 'dog', zh: '狗' }
    ],
    sight: ['watch'],
    newWords: [
      { w: 'tail', zh: '尾巴' },
      { w: 'chain', zh: '链子' }
    ],
    pages: [
      { art: 'library|mom,ming|tail|·', en: 'A dog has a tail. The dog is big.', zh: '一只狗有尾巴。这只狗很大。' },
      { art: 'library|mom,ming|tail|♪', en: 'The tail is long.', zh: '尾巴很长。' },
      { art: 'library|mom,ming|tail|👀', en: 'The tail goes up and down. The dog is glad to see me.', zh: '尾巴上下摆动。狗见到我很高兴。' },
      { art: 'library|mom,ming|tail|?', en: 'The dog has a chain too.', zh: '狗还戴着一条链子。' },
      { art: 'library|mom,ming|tail|·', en: 'The chain is on the dog. It is not long.', zh: '链子系在狗身上。它不长。' },
      { art: 'library|mom,ming|tail|!', en: 'The dog runs and the tail goes.', zh: '狗一跑，尾巴也跟着动。' },
      { art: 'library|mom,ming|tail|♥', en: 'I like the dog and the tail. I watch the dog from here.', zh: '我喜欢这只狗和它的尾巴。我在这儿静静看它。' },
      { art: 'library|mom,ming|tail|★', en: 'The tail and the chain.', zh: '尾巴和链子。' },
      { art: 'library|mom,ming|tail|…', en: 'The dog is happy.', zh: '狗很开心。' },
      { art: 'library|mom,ming|tail|·', en: 'I am happy too.', zh: '我也很开心。' }
    ],
    quiz: [
      { q: '下面哪个词在这一本里读到过？', opts: ['果酱', '尾巴', '山羊'], a: 1, kind: 'recall' },
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
    sight: ['warm', 'wear'],
    newWords: [
      { w: 'goat', zh: '山羊' },
      { w: 'coat', zh: '外套' }
    ],
    pages: [
      { art: 'home|dad,lili|coat|·', en: 'A goat is on the hill. The wind is cold.', zh: '一只山羊在小山上。风很冷。' },
      { art: 'home|dad,lili|coat|♪', en: 'The goat is small.', zh: '山羊很小。' },
      { art: 'home|dad,lili|coat|👀', en: 'I have a coat. The coat is thick.', zh: '我有一件外套。外套很厚。' },
      { art: 'home|dad,lili|coat|?', en: 'The coat is big.', zh: '外套很大。' },
      { art: 'home|dad,lili|coat|·', en: 'I wear the coat. I put my hands in it.', zh: '我穿上外套。我把手揣进去。' },
      { art: 'home|dad,lili|coat|!', en: 'The goat is on the hill.', zh: '山羊还在小山上。' },
      { art: 'home|dad,lili|coat|♥', en: 'I am warm with the coat. The goat has no coat.', zh: '穿着外套我很暖和。山羊没有外套。' },
      { art: 'home|dad,lili|coat|★', en: 'The goat and my coat.', zh: '山羊和我的外套。' },
      { art: 'home|dad,lili|coat|…', en: 'I like the goat.', zh: '我喜欢这只山羊。' },
      { art: 'home|dad,lili|coat|·', en: 'The goat likes the hill.', zh: '山羊喜欢这座小山。' }
    ],
    quiz: [
      { q: '下面哪个词在这一本里读到过？', opts: ['小山', '午饭', '头'], a: 0, kind: 'recall' },
      { q: '我穿了什么？', opts: ['鞋子', '帽子', '外套'], a: 2, kind: 'infer' },
      { q: '天冷的时候，你会怎么做？', opts: ['穿上暖和的衣服', '不出门', '穿得很少'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b55', lv: 'L5', tag: '美术', title: 'Paint a Green Leaf', zh: '画一片绿叶',
    emoji: '🍃', color: '#BFE6DF',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 1 个新词（涂色）。',
    trap: '元音组合只读一个长音：ai / ay 都读 /eɪ/，oa 读 /əʊ/；别把两个字母分开念。',
    summary: '《画一片绿叶》：这是一个完整的小故事。读前先看词卡（涂色）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，讲讲这件事是怎么一步步发展的，中间卡在哪儿。',
    think: '说说你画过的一样东西。',
    pre: [
      { art: '🎨', en: 'paint', zh: '涂色' },
      { art: '🍃', en: 'leaf', zh: '叶子' },
      { art: '🌿', en: 'stem', zh: '茎' }
    ],
    sight: ['leaf', 'leaves', 'paper'],
    newWords: [
      { w: 'paint', zh: '涂色' }
    ],
    pages: [
      { art: 'garden|ming,grandma|leaf|·', en: 'I paint a leaf. I take a green pen.', zh: '我画一片叶子。我拿起一支绿笔。' },
      { art: 'garden|ming,grandma|leaf|♪', en: 'The leaf is green.', zh: '叶子是绿的。' },
      { art: 'garden|ming,grandma|leaf|👀', en: 'I paint it green. I go slow.', zh: '我把它画成绿色。我慢慢画。' },
      { art: 'garden|ming,grandma|leaf|?', en: 'I paint the stem too. The stem is thin.', zh: '我把茎也画上。茎细细的。' },
      { art: 'garden|ming,grandma|leaf|·', en: 'The leaf is on my paper.', zh: '叶子在我的纸上。' },
      { art: 'garden|ming,grandma|leaf|!', en: 'I like green leaves.', zh: '我喜欢绿叶子。' },
      { art: 'garden|ming,grandma|leaf|♥', en: 'I paint and paint. My hands are green now.', zh: '我画了又画。我的手现在也绿了。' },
      { art: 'garden|ming,grandma|leaf|★', en: 'My leaf is good.', zh: '我画的叶子不错。' },
      { art: 'garden|ming,grandma|leaf|…', en: 'Green leaves are nice.', zh: '绿叶子真好看。' },
      { art: 'garden|ming,grandma|leaf|·', en: 'I like to paint.', zh: '我喜欢画画。' }
    ],
    quiz: [
      { q: '下面哪个词在这一本里读到过？', opts: ['腿', '飞蛾', '纸'], a: 2, kind: 'recall' },
      { q: '我把叶子画成了什么颜色？', opts: ['蓝色', '绿色', '红色'], a: 1, kind: 'infer' },
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
    sight: ['eat', 'eats', 'near', 'watch'],
    newWords: [
      { w: 'zoo', zh: '动物园' }
    ],
    pages: [
      { art: 'library|lili,grandpa|zoo|·', en: 'We go to the zoo. It is not far.', zh: '我们去动物园。动物园不远。' },
      { art: 'library|lili,grandpa|zoo|♪', en: 'The zoo has many animals.', zh: '动物园里有很多动物。' },
      { art: 'library|lili,grandpa|zoo|👀', en: 'We see a goat and a pig. The pig is fat.', zh: '我们看见一只山羊和一只猪。猪胖乎乎的。' },
      { art: 'library|lili,grandpa|zoo|?', en: 'The animals are hungry. They come near us.', zh: '动物们饿了。它们朝我们走过来。' },
      { art: 'library|lili,grandpa|zoo|·', en: 'We give the animals food.', zh: '我们给动物喂食。' },
      { art: 'library|lili,grandpa|zoo|!', en: 'The goat eats the food. It eats it all.', zh: '山羊吃掉了食物。它全吃光了。' },
      { art: 'library|lili,grandpa|zoo|♥', en: 'The pig eats too.', zh: '猪也吃了。' },
      { art: 'library|lili,grandpa|zoo|★', en: 'Food at the zoo. We watch them eat.', zh: '动物园里的食物。我们看着它们吃。' },
      { art: 'library|lili,grandpa|zoo|…', en: 'The animals are happy.', zh: '动物们很开心。' },
      { art: 'library|lili,grandpa|zoo|·', en: 'We like the zoo.', zh: '我们喜欢动物园。' }
    ],
    quiz: [
      { q: '下面哪个词在这一本里读到过？', opts: ['午饭', '平底锅', '食物'], a: 2, kind: 'recall' },
      { q: '我们给动物什么了？', opts: ['水', '吃的', '玩具'], a: 1, kind: 'infer' },
      { q: '在动物园里，你会怎么做？', opts: ['乱喂东西', '按规定喂食，轻轻看它们', '大声吓它们'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b57', lv: 'L5', tag: '发音', title: 'Say It: Rain, Day', zh: '说一说：rain day',
    emoji: '🗣️', color: '#D9D2F5',
    track: 'drill',
    goal: '把本级难点音听准、说准，并能在整句里读对。不引入新词，全部是读过的词。',
    trap: '元音组合只读一个长音：ai / ay 都读 /eɪ/，oa 读 /əʊ/；别把两个字母分开念。',
    summary: '《说一说：rain day》：这一本练两个词的音和形。读前先看词卡，都是学过的词；读的时候先看清每个词，再连起来读一遍。',
    retell: '把这一本练的两个词再读一遍，说说它们的音哪里一样、哪里不一样。',
    think: '找两个词，一个说天气、一个说时间，读一读。',
    pre: [
      { art: '🌧️', en: 'rain', zh: '雨' },
      { art: '📦', en: 'word', zh: '词' }
    ],
    sight: [],
    newWords: [

    ],
    pages: [
      { art: 'table|grandma,mom|rain|·', en: 'This is "rain". It is one word.', zh: '这是 rain。它是一个词。' },
      { art: 'table|grandma,mom|rain|♪', en: 'This is "day". It is one word too.', zh: '这是 day。它也是一个词。' },
      { art: 'table|grandma,mom|rain|👀', en: 'Rain and day.', zh: 'rain 和 day。' },
      { art: 'table|grandma,mom|rain|?', en: 'Say "rain". Say it slow.', zh: '读 rain。慢慢读。' },
      { art: 'table|grandma,mom|rain|·', en: 'Say "day". Say it again.', zh: '读 day。再读一遍。' },
      { art: 'table|grandma,mom|rain|!', en: 'Rain is not day.', zh: 'rain 不是 day。' },
      { art: 'table|grandma,mom|rain|♥', en: 'Rain can be in the day. Both words are good.', zh: '白天也可能下雨。两个词都好。' },
      { art: 'table|grandma,mom|rain|★', en: 'You can say both.', zh: '两个你都会读。' },
      { art: 'table|grandma,mom|rain|…', en: 'Good!', zh: '真棒！' },
      { art: 'table|grandma,mom|rain|·', en: 'Rain, day, rain, day.', zh: 'rain，day，rain，day。' }
    ],
    quiz: [
      { q: '下面哪个词在这一本里读到过？', opts: ['月亮', '雨', '猪'], a: 1, kind: 'recall' },
      { q: '这一本在练哪两个词？', opts: ['day 和 night', 'rain 和 day', 'rain 和 night'], a: 1, kind: 'infer' },
      { q: '两个词放在一起，你会怎么读？', opts: ['一个一个读，再连起来', '不读了', '混在一起读'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b58', lv: 'L5', tag: '小知识', title: 'Why a Seed Needs Rain', zh: '种子为什么需要雨',
    emoji: '🌾', color: '#FAD3B6',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。认读 1 个新词（地面）。',
    trap: '元音组合只读一个长音：ai / ay 都读 /eɪ/，oa 读 /əʊ/；别把两个字母分开念。',
    summary: '《种子为什么需要雨》：这一本从一件小事讲起，说说为什么会这样。读前先看词卡（地面）；读的时候留意先看到什么、为什么会这样、后来怎么弄明白。',
    retell: '合上书，按「先看到什么 → 为什么会这样 → 后来怎么弄明白」讲一遍。',
    think: '说说雨水是怎么帮植物长大的。',
    pre: [
      { art: '🌿', en: 'ground', zh: '地面' },
      { art: '🌱', en: 'seed', zh: '种子' },
      { art: '🌧️', en: 'rain', zh: '雨' }
    ],
    sight: ['grows', 'water'],
    newWords: [
      { w: 'ground', zh: '地面' }
    ],
    pages: [
      { art: 'garden|grandpa,dad|seed|·', en: 'A seed is in the pot. The pot is in the sun.', zh: '一粒种子在花盆里。花盆放在太阳下。' },
      { art: 'garden|grandpa,dad|seed|♪', en: 'The seed needs rain. It needs water too.', zh: '种子需要雨。它也需要水。' },
      { art: 'garden|grandpa,dad|seed|👀', en: 'Why does a seed need rain?', zh: '种子为什么需要雨？' },
      { art: 'garden|grandpa,dad|seed|?', en: 'Rain makes the ground wet. The water goes down.', zh: '雨把泥土弄湿。水往下渗。' },
      { art: 'garden|grandpa,dad|seed|·', en: 'The wet ground is good for the seed.', zh: '湿泥土对种子有好处。' },
      { art: 'garden|grandpa,dad|seed|!', en: 'The seed drinks the water. It drinks slowly.', zh: '种子喝到水。它慢慢喝。' },
      { art: 'garden|grandpa,dad|seed|♥', en: 'The seed grows up. A stem comes out.', zh: '种子往上长。一根茎冒出来。' },
      { art: 'garden|grandpa,dad|seed|★', en: 'Rain helps the seed.', zh: '雨帮了种子。' },
      { art: 'garden|grandpa,dad|seed|…', en: 'A seed needs rain. It needs the sun too.', zh: '种子需要雨。它也需要太阳。' },
      { art: 'garden|grandpa,dad|seed|·', en: 'Rain is good.', zh: '雨真好。' }
    ],
    quiz: [
      { q: '下面哪个词在这一本里读到过？', opts: ['小路', '米饭', '锅'], a: 2, kind: 'recall' },
      { q: '种子为什么需要雨？', opts: ['雨让种子睡着', '雨让土变湿，种子能喝到水', '雨让土变硬'], a: 1, kind: 'infer' },
      { q: '想知道一件事为什么发生，你会怎么做？', opts: ['不管它', '随便猜', '想一想、问一问、再看看'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b59', lv: 'L5', tag: '小知识', title: 'A Week on the Farm', zh: '农场的一周',
    emoji: '🚜', color: '#C8E7F0',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。认读 2 个新词（喂、玉米）。',
    trap: '元音组合只读一个长音：ai / ay 都读 /eɪ/，oa 读 /əʊ/；别把两个字母分开念。',
    summary: '《农场的一周》：这一本从一件小事讲起，说说为什么会这样。读前先看词卡（喂、玉米）；读的时候留意先看到什么、为什么会这样、后来怎么弄明白。',
    retell: '合上书，按「先看到什么 → 为什么会这样 → 后来怎么弄明白」讲一遍。',
    think: '说说你最想在农场做的一件事。',
    pre: [
      { art: '🏃', en: 'feed', zh: '喂' },
      { art: '🌽', en: 'corn', zh: '玉米' },
      { art: '🚜', en: 'farm', zh: '农场' },
      { art: '🐷', en: 'pig', zh: '猪' }
    ],
    sight: ['clean', 'farm', 'watch'],
    newWords: [
      { w: 'feed', zh: '喂' },
      { w: 'corn', zh: '玉米' }
    ],
    pages: [
      { art: 'farm|mom,ming|farm|·', en: 'I am on the farm for a week. The farm is big.', zh: '我在农场待一个星期。农场很大。' },
      { art: 'farm|mom,ming|farm|♪', en: 'One day I feed the pig. The pig is hungry.', zh: '有一天我喂猪。猪饿了。' },
      { art: 'farm|mom,ming|farm|👀', en: 'One day I wash the goat. The goat is clean now.', zh: '有一天我给山羊洗澡。山羊现在干净了。' },
      { art: 'farm|mom,ming|farm|?', en: 'One day I pick the corn. The corn is tall.', zh: '有一天我摘玉米。玉米长得很高。' },
      { art: 'farm|mom,ming|farm|·', en: 'One day I find an egg. The egg is small.', zh: '有一天我捡到一个鸡蛋。鸡蛋小小的。' },
      { art: 'farm|mom,ming|farm|!', en: 'One day I watch the rain. I stay at home.', zh: '有一天我看下雨。我待在屋里。' },
      { art: 'farm|mom,ming|farm|♥', en: 'One day I sit on the hill. I look at the farm.', zh: '有一天我坐在小山上。我望着农场。' },
      { art: 'farm|mom,ming|farm|★', en: 'A week on the farm.', zh: '农场上的一周。' },
      { art: 'farm|mom,ming|farm|…', en: 'The farm is good. I like the animals.', zh: '农场真好。我喜欢这些动物。' },
      { art: 'farm|mom,ming|farm|·', en: 'I want to come back.', zh: '我还想再来。' }
    ],
    quiz: [
      { q: '下面哪个词在这一本里读到过？', opts: ['山羊', '雪', '根'], a: 0, kind: 'recall' },
      { q: '我在农场做了什么？', opts: ['写作业、看书', '坐车、买东西', '喂猪、洗山羊、摘玉米'], a: 2, kind: 'infer' },
      { q: '在农场待几天，你会怎么做？', opts: ['每天做一点不一样的事', '什么都不做', '天天一样'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b60', lv: 'L5', tag: '复习', title: 'All the Way Home', zh: '一路回家',
    emoji: '🏡', color: '#E8D9B5',
    track: 'review',
    goal: '把本级和前面级别的词再读一遍、串成一个故事。认读 1 个新词（休息）。',
    trap: '元音组合只读一个长音：ai / ay 都读 /eɪ/，oa 读 /əʊ/；别把两个字母分开念。',
    summary: '《一路回家》：这是一个完整的小故事。读前先看词卡（休息）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，讲讲这件事是怎么一步步发展的，中间卡在哪儿。',
    think: '说说你走过的一条路：它通向哪里？',
    pre: [
      { art: '💡', en: 'rest', zh: '休息' },
      { art: '🛣️', en: 'road', zh: '路' },
      { art: '🏠', en: 'home', zh: '家' }
    ],
    sight: ['tired'],
    newWords: [
      { w: 'rest', zh: '休息' }
    ],
    pages: [
      { art: 'library|dad,lili|road|·', en: 'I walk and I walk. The sun is hot.', zh: '我走啊走。太阳很晒。' },
      { art: 'library|dad,lili|road|♪', en: 'I go down the road.', zh: '我顺着路往前走。' },
      { art: 'library|dad,lili|road|👀', en: 'The road is long.', zh: '这条路很长。' },
      { art: 'library|dad,lili|road|?', en: 'I am tired. My legs are tired too.', zh: '我累了。我的腿也累了。' },
      { art: 'library|dad,lili|road|·', en: 'I sit on a stone. I rest for a bit.', zh: '我坐在一块石头上。我歇一小会儿。' },
      { art: 'library|dad,lili|road|!', en: 'I look at the road. It goes up the hill.', zh: '我望着这条路。它通向小山。' },
      { art: 'library|dad,lili|road|♥', en: 'I get up and walk again.', zh: '我站起来接着走。' },
      { art: 'library|dad,lili|road|★', en: 'The road goes home. I can see my home.', zh: '这条路通到家。我能看见家了。' },
      { art: 'library|dad,lili|road|…', en: 'All the way home.', zh: '一路回家。' },
      { art: 'library|dad,lili|road|·', en: 'I am home! Mom is there.', zh: '我到家啦！妈妈在那儿。' }
    ],
    quiz: [
      { q: '下面哪个词在这一本里读到过？', opts: ['歌', '小山', '学校'], a: 1, kind: 'recall' },
      { q: '路的尽头是什么？', opts: ['学校', '商店', '家'], a: 2, kind: 'infer' },
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
      { art: '🥛', en: 'milk', zh: '牛奶' },
      { art: '📦', en: 'piece', zh: '一块' }
    ],
    sight: ['eats', 'piece'],
    newWords: [
      { w: 'cake', zh: '蛋糕' },
      { w: 'fine', zh: '好' }
    ],
    pages: [
      { art: 'kitchen|ming,grandma|cake|·', en: 'Ming wants to make a cake. He gets up early.', zh: '明明想做一个蛋糕。他早早起了床。' },
      { art: 'kitchen|ming,grandma|cake|♪', en: 'The cake is for Grandma. He does not tell her.', zh: '蛋糕是给奶奶的。他没告诉奶奶。' },
      { art: 'kitchen|ming,grandma|cake|👀', en: 'Ming gets the things ready. He puts eggs and milk on the table.', zh: '明明把东西备好。他把鸡蛋和牛奶放到桌上。' },
      { art: 'kitchen|ming,grandma|cake|?', en: 'Ming mixes and makes.', zh: '明明又搅又做。' },
      { art: 'kitchen|ming,grandma|cake|·', en: 'The cake is not right. It is thin and dry.', zh: '蛋糕没做好。它又薄又干。' },
      { art: 'kitchen|ming,grandma|cake|!', en: 'Ming is sad. He sits down.', zh: '明明很难过。他坐了下来。' },
      { art: 'kitchen|ming,grandma|cake|♥', en: 'Grandma comes and helps. She says it is fine.', zh: '奶奶过来帮忙。她说没关系。' },
      { art: 'kitchen|ming,grandma|cake|★', en: 'They make the cake again. This time Ming is careful.', zh: '他们重新做了一次。这回明明很仔细。' },
      { art: 'kitchen|ming,grandma|cake|…', en: 'This time the cake is good. It is soft and sweet.', zh: '这次蛋糕做好了。又软又甜。' },
      { art: 'kitchen|ming,grandma|cake|·', en: 'Grandma likes the cake. She eats a big piece.', zh: '奶奶很喜欢这个蛋糕。她吃了一大块。' },
      { art: 'kitchen|ming,grandma|cake|♥', en: 'A cake for Grandma.', zh: '给奶奶的蛋糕。' }
    ],
    quiz: [
      { q: '下面哪个词在这一本里读到过？', opts: ['叶子', '手', '蛋糕'], a: 2, kind: 'recall' },
      { q: '蛋糕是给谁的？', opts: ['爸爸', '妈妈', '奶奶'], a: 2, kind: 'infer' },
      { q: '做一件事第一次不成功，你会怎么做？', opts: ['怪别人', '找人帮帮忙，再做一次', '马上放弃'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b62', lv: 'L6', tag: '春天', title: 'The Kite by the Lake', zh: '湖边的风筝',
    emoji: '🪁', color: '#F9DFB4',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 3 个新词（风筝、湖、线）。',
    trap: '词尾不发音的 e 会让前面的元音「报自己的名字」：cap → cape，kit → kite。',
    summary: '《湖边的风筝》：这是一个完整的小故事。读前先看词卡（风筝、湖、线）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，讲讲这件事是怎么一步步发展的，中间卡在哪儿。',
    think: '说说你放风筝的一次经历。',
    pre: [
      { art: '🪁', en: 'kite', zh: '风筝' },
      { art: '🏞️', en: 'lake', zh: '湖' },
      { art: '📦', en: 'line', zh: '线' },
      { art: '🌿', en: 'grass', zh: '草' },
      { art: '🌿', en: 'wind', zh: '风' }
    ],
    sight: ['blue', 'high'],
    newWords: [
      { w: 'kite', zh: '风筝' },
      { w: 'lake', zh: '湖' },
      { w: 'line', zh: '线' }
    ],
    pages: [
      { art: 'playground|lili,grandpa|kite|·', en: 'A kite is by the lake. The lake is calm.', zh: '湖边有一只风筝。湖面很平静。' },
      { art: 'playground|lili,grandpa|kite|♪', en: 'The kite is red and blue.', zh: '风筝是红蓝相间的。' },
      { art: 'playground|lili,grandpa|kite|👀', en: 'Ming takes the kite. He runs to the grass.', zh: '明明拿起风筝。他跑到草地上。' },
      { art: 'playground|lili,grandpa|kite|?', en: 'The wind is strong by the lake.', zh: '湖边的风很大。' },
      { art: 'playground|lili,grandpa|kite|·', en: 'Ming runs with the kite. Dad runs behind him.', zh: '明明带着风筝跑。爸爸跟在后面跑。' },
      { art: 'playground|lili,grandpa|kite|!', en: 'The kite goes up! It goes up and up.', zh: '风筝飞起来了！它越飞越高。' },
      { art: 'playground|lili,grandpa|kite|♥', en: 'The kite is high in the sky.', zh: '风筝高高地在天上。' },
      { art: 'playground|lili,grandpa|kite|★', en: 'Ming holds the line. The line is thin.', zh: '明明攥着线。线细细的。' },
      { art: 'playground|lili,grandpa|kite|…', en: 'The kite is by the lake.', zh: '湖边的风筝。' },
      { art: 'playground|lili,grandpa|kite|·', en: 'Ming likes the kite. He does not want to stop.', zh: '明明喜欢这只风筝。他不想停下来。' },
      { art: 'playground|lili,grandpa|kite|♥', en: 'A kite by the lake.', zh: '湖边的风筝。' }
    ],
    quiz: [
      { q: '下面哪个词在这一本里读到过？', opts: ['风', '午饭', '纸条'], a: 0, kind: 'recall' },
      { q: '风筝在哪儿飞起来的？', opts: ['湖边', '山顶', '街上'], a: 0, kind: 'infer' },
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
      { art: '🏷️', en: 'name', zh: '名字' },
      { art: '📦', en: 'can', zh: '罐子' }
    ],
    sight: ['carries'],
    newWords: [
      { w: 'plate', zh: '盘子' }
    ],
    pages: [
      { art: 'home|grandma,mom|name|·', en: 'A plate is on the table. It is a small plate.', zh: '桌上有一只盘子。是只小盘子。' },
      { art: 'home|grandma,mom|name|♪', en: 'A name is on the plate. The name is in black.', zh: '盘子上有个名字。名字是黑色的。' },
      { art: 'home|grandma,mom|name|👀', en: 'Whose name is it?', zh: '这是谁的名字？' },
      { art: 'home|grandma,mom|name|?', en: 'Ming looks at the name. He reads it slowly.', zh: '明明看着这个名字。他慢慢读出来。' },
      { art: 'home|grandma,mom|name|·', en: 'The name is not Ming.', zh: '不是明明的名字。' },
      { art: 'home|grandma,mom|name|!', en: 'It is Grandma\'s name. Ming sees it now.', zh: '是奶奶的名字。明明这下看出来了。' },
      { art: 'home|grandma,mom|name|♥', en: 'Ming gives the plate to Grandma. He carries it with two hands.', zh: '明明把盘子递给奶奶。他用两只手捧着。' },
      { art: 'home|grandma,mom|name|★', en: 'Grandma is glad. She smiles at Ming.', zh: '奶奶很高兴。她朝明明笑了笑。' },
      { art: 'home|grandma,mom|name|…', en: 'A name on the plate.', zh: '盘子上的名字。' },
      { art: 'home|grandma,mom|name|·', en: 'Names can tell us things. They tell us who it is.', zh: '名字能告诉我们事情。它告诉我们这是谁的。' },
      { art: 'home|grandma,mom|name|♥', en: 'I like my name.', zh: '我喜欢我的名字。' }
    ],
    quiz: [
      { q: '下面哪个词在这一本里读到过？', opts: ['盘子', '光', '老鼠'], a: 0, kind: 'recall' },
      { q: '盘子上是谁的名字？', opts: ['妈妈的', '奶奶的', '明明的'], a: 1, kind: 'infer' },
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
      { art: '🛣️', en: 'road', zh: '路' },
      { art: '📦', en: 'can', zh: '罐子' }
    ],
    sight: [],
    newWords: [
      { w: 'bike', zh: '自行车' },
      { w: 'ride', zh: '骑' }
    ],
    pages: [
      { art: 'street|grandpa,dad|bike|·', en: 'Dad has a bike. It is red.', zh: '爸爸有一辆自行车。是红色的。' },
      { art: 'street|grandpa,dad|bike|♪', en: 'The bike is big. It is too big for Ming.', zh: '车很大。对明明来说太大了。' },
      { art: 'street|grandpa,dad|bike|👀', en: 'Ming wants to ride the bike.', zh: '明明想骑这辆车。' },
      { art: 'street|grandpa,dad|bike|?', en: 'Ming gets on the bike. Dad holds the back.', zh: '明明上了车。爸爸扶着后座。' },
      { art: 'street|grandpa,dad|bike|·', en: 'The bike goes. It goes slowly at first.', zh: '车动起来了。一开始走得很慢。' },
      { art: 'street|grandpa,dad|bike|!', en: 'Ming rides and rides. He looks at the road.', zh: '明明骑啊骑。他看着前面的路。' },
      { art: 'street|grandpa,dad|bike|♥', en: 'Ming does not fall. He is careful.', zh: '明明没有摔。他很小心。' },
      { art: 'street|grandpa,dad|bike|★', en: 'Dad runs with the bike.', zh: '爸爸跟着车跑。' },
      { art: 'street|grandpa,dad|bike|…', en: 'Ming can ride the bike! Dad lets go.', zh: '明明会骑车了！爸爸松开了手。' },
      { art: 'street|grandpa,dad|bike|·', en: 'Ride a bike.', zh: '骑自行车。' },
      { art: 'street|grandpa,dad|bike|♥', en: 'Ming likes the bike. He wants to ride again.', zh: '明明喜欢这辆车。他还想再骑一次。' }
    ],
    quiz: [
      { q: '下面哪个词在这一本里读到过？', opts: ['牛奶', '平底锅', '自行车'], a: 2, kind: 'recall' },
      { q: '谁跟着车跑？', opts: ['妈妈', '奶奶', '爸爸'], a: 2, kind: 'infer' },
      { q: '学骑车（学一样新本领），你会怎么做？', opts: ['一次就想学会', '不学了', '找人扶着，慢慢练'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b65', lv: 'L6', tag: '花园', title: 'A Rose at the Gate', zh: '门口的玫瑰',
    emoji: '🌹', color: '#E0CFF3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 2 个新词（玫瑰、大门）。',
    trap: '词尾不发音的 e 会让前面的元音「报自己的名字」：cap → cape，kit → kite。',
    summary: '《门口的玫瑰》：这是一个完整的小故事。读前先看词卡（玫瑰、大门）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，讲讲这件事是怎么一步步发展的，中间卡在哪儿。',
    think: '说说你见过的一种花。',
    pre: [
      { art: '🌹', en: 'rose', zh: '玫瑰' },
      { art: '📍', en: 'gate', zh: '大门' },
      { art: '💧', en: 'water', zh: '水' }
    ],
    sight: ['grows', 'water'],
    newWords: [
      { w: 'rose', zh: '玫瑰' },
      { w: 'gate', zh: '大门' }
    ],
    pages: [
      { art: 'garden|mom,ming|rose|·', en: 'A rose is at the gate. Ming sees it first.', zh: '门口有一朵玫瑰。明明先看见了它。' },
      { art: 'garden|mom,ming|rose|♪', en: 'The rose is red.', zh: '玫瑰是红的。' },
      { art: 'garden|mom,ming|rose|👀', en: 'The rose is nice. It smells sweet.', zh: '玫瑰很好看。闻起来香香的。' },
      { art: 'garden|mom,ming|rose|?', en: 'Ming looks at the rose. He looks for the best one.', zh: '明明看着玫瑰。他找最漂亮的那一朵。' },
      { art: 'garden|mom,ming|rose|·', en: 'The rose grows at the gate.', zh: '玫瑰长在门口。' },
      { art: 'garden|mom,ming|rose|!', en: 'Grandma likes the rose. She stops to look at it.', zh: '奶奶喜欢这朵玫瑰。她停下来看它。' },
      { art: 'garden|mom,ming|rose|♥', en: 'The rose is for Grandma. Ming picks it carefully.', zh: '玫瑰是给奶奶的。明明小心地把它摘下来。' },
      { art: 'garden|mom,ming|rose|★', en: 'Ming gives the rose to Grandma.', zh: '明明把玫瑰送给奶奶。' },
      { art: 'garden|mom,ming|rose|…', en: 'A rose at the gate.', zh: '门口的玫瑰。' },
      { art: 'garden|mom,ming|rose|·', en: 'The rose makes Grandma glad. She puts it in water.', zh: '玫瑰让奶奶很高兴。她把它插进水里。' },
      { art: 'garden|mom,ming|rose|♥', en: 'Roses are nice.', zh: '玫瑰真好看。' }
    ],
    quiz: [
      { q: '下面哪个词在这一本里读到过？', opts: ['玫瑰', '盘子', '网'], a: 0, kind: 'recall' },
      { q: '玫瑰长在哪里？', opts: ['花园深处', '窗台上', '门口'], a: 2, kind: 'infer' },
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
    sight: ['paper', 'writes', 'yellow'],
    newWords: [
      { w: 'note', zh: '纸条' }
    ],
    pages: [
      { art: 'home|dad,lili|note|·', en: 'A book is on the desk. It is an old book.', zh: '桌上有一本书。是本旧书。' },
      { art: 'home|dad,lili|note|♪', en: 'Ming opens the book. He wants to read.', zh: '明明翻开书。他想读一读。' },
      { art: 'home|dad,lili|note|👀', en: 'A note is in the book! It falls out.', zh: '书里有一张纸条！它掉了出来。' },
      { art: 'home|dad,lili|note|?', en: 'The note is small. The paper is yellow.', zh: '纸条很小。纸是黄色的。' },
      { art: 'home|dad,lili|note|·', en: 'Ming reads the note.', zh: '明明读纸条。' },
      { art: 'home|dad,lili|note|!', en: 'The note says "Hello". There is a name too.', zh: '纸条上写着「你好」。下面还有个名字。' },
      { art: 'home|dad,lili|note|♥', en: 'Who wrote the note?', zh: '是谁写的纸条？' },
      { art: 'home|dad,lili|note|★', en: 'It was Grandma. Ming sees her name.', zh: '是奶奶写的。明明看见了她的名字。' },
      { art: 'home|dad,lili|note|…', en: 'A note in a book.', zh: '书里的纸条。' },
      { art: 'home|dad,lili|note|·', en: 'Ming writes a note too. He puts it in the same book.', zh: '明明也写了一张纸条。他把它夹进同一本书里。' },
      { art: 'home|dad,lili|note|♥', en: 'Notes are fun. Grandma will find it.', zh: '纸条真有意思。奶奶会找到它的。' }
    ],
    quiz: [
      { q: '下面哪个词在这一本里读到过？', opts: ['纸条', '石头', '别针'], a: 0, kind: 'recall' },
      { q: '纸条上写了什么？', opts: ['「你好」', '「谢谢」', '「再见」'], a: 0, kind: 'infer' },
      { q: '在书里发现一张纸条，你会怎么做？', opts: ['不看', '读一读，想想是谁写的', '扔掉'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b67', lv: 'L6', tag: '玩耍', title: 'Make a Game', zh: '做个游戏',
    emoji: '🎲', color: '#BFE6DF',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 2 个新词（游戏、反正）。',
    trap: '词尾不发音的 e 会让前面的元音「报自己的名字」：cap → cape，kit → kite。',
    summary: '《做个游戏》：这是一个完整的小故事。读前先看词卡（游戏、反正）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，讲讲这件事是怎么一步步发展的，中间卡在哪儿。',
    think: '说说你最喜欢玩的一个游戏。',
    pre: [
      { art: '🎲', en: 'game', zh: '游戏' },
      { art: '💡', en: 'anyway', zh: '反正' },
      { art: '📦', en: 'paper', zh: '纸' },
      { art: '🏷️', en: 'name', zh: '名字' }
    ],
    sight: ['paper', 'writes'],
    newWords: [
      { w: 'game', zh: '游戏' },
      { w: 'anyway', zh: '反正' }
    ],
    pages: [
      { art: 'playground|ming,grandma|game|·', en: 'Ming wants to make a game. It is a wet day.', zh: '明明想做一个游戏。这天下着雨。' },
      { art: 'playground|ming,grandma|game|♪', en: 'The game is for the family. He writes it on paper.', zh: '游戏是给全家人玩的。他把它写在纸上。' },
      { art: 'playground|ming,grandma|game|👀', en: 'Ming makes the game. He uses paper and a pen.', zh: '明明做游戏。他用纸和笔。' },
      { art: 'playground|ming,grandma|game|?', en: 'The game has a name. They all like the name.', zh: '游戏有个名字。大家都喜欢这个名字。' },
      { art: 'playground|ming,grandma|game|·', en: 'They play the game. They sit around the table.', zh: '他们玩起游戏。围着桌子坐一圈。' },
      { art: 'playground|ming,grandma|game|!', en: 'The game is fun. Grandpa laughs first.', zh: '游戏很好玩。爷爷第一个笑出声。' },
      { art: 'playground|ming,grandma|game|♥', en: 'Grandma wins the game. Ming claps for her.', zh: '奶奶赢了。明明给她鼓掌。' },
      { art: 'playground|ming,grandma|game|★', en: 'Ming is glad anyway. He wants to play again.', zh: '明明照样很开心。他还想再玩一局。' },
      { art: 'playground|ming,grandma|game|…', en: 'Make a game.', zh: '做个游戏。' },
      { art: 'playground|ming,grandma|game|·', en: 'They play the game again.', zh: '他们又玩了一局。' },
      { art: 'playground|ming,grandma|game|♥', en: 'A game for the family.', zh: '给全家人的游戏。' }
    ],
    quiz: [
      { q: '下面哪个词在这一本里读到过？', opts: ['纸', '沙子', '水池'], a: 0, kind: 'recall' },
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
      { art: '🐱', en: 'cat', zh: '猫' }
    ],
    sight: ['bread', 'eats', 'kitchen', 'quiet'],
    newWords: [
      { w: 'mouse', zh: '老鼠' },
      { w: 'hole', zh: '洞' },
      { w: 'brave', zh: '勇敢' }
    ],
    pages: [
      { art: 'library|lili,grandpa|mouse|·', en: 'A little mouse is here. It is in the kitchen.', zh: '一只小老鼠在这儿。它在厨房里。' },
      { art: 'library|lili,grandpa|mouse|♪', en: 'The mouse is small. Its tail is long.', zh: '老鼠很小。它的尾巴很长。' },
      { art: 'library|lili,grandpa|mouse|👀', en: 'The mouse is not afraid.', zh: '小老鼠不害怕。' },
      { art: 'library|lili,grandpa|mouse|?', en: 'It looks for food. It smells the bread.', zh: '它找吃的。它闻到了面包。' },
      { art: 'library|lili,grandpa|mouse|·', en: 'A cat is here too! The cat comes in slowly.', zh: '一只猫也来了！猫慢慢走进来。' },
      { art: 'library|lili,grandpa|mouse|!', en: 'The mouse runs fast. It runs to the hole.', zh: '老鼠飞快地跑。它朝洞口跑。' },
      { art: 'library|lili,grandpa|mouse|♥', en: 'The mouse hides in a hole. It waits there.', zh: '老鼠躲进洞里。它在里面等着。' },
      { art: 'library|lili,grandpa|mouse|★', en: 'The cat goes away. The kitchen is quiet again.', zh: '猫走开了。厨房又安静下来。' },
      { art: 'library|lili,grandpa|mouse|…', en: 'The mouse comes out. It finds the bread.', zh: '老鼠钻出来。它找到了面包。' },
      { art: 'library|lili,grandpa|mouse|·', en: 'The brave little mouse.', zh: '勇敢的小老鼠。' },
      { art: 'library|lili,grandpa|mouse|♥', en: 'The mouse is safe. It eats the bread now.', zh: '老鼠安全了。它现在吃起了面包。' }
    ],
    quiz: [
      { q: '下面哪个词在这一本里读到过？', opts: ['贝壳', '面包', '米饭'], a: 1, kind: 'recall' },
      { q: '老鼠为什么躲进洞里？', opts: ['因为猫来了', '因为天黑了', '因为饿了'], a: 0, kind: 'infer' },
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
    sight: [],
    newWords: [
      { w: 'cape', zh: '斗篷' }
    ],
    pages: [
      { art: 'table|grandma,mom|cap|·', en: 'This is a cap. It is one word.', zh: '这是 cap。它是一个词。' },
      { art: 'table|grandma,mom|cap|♪', en: 'This is a cape. It is a longer word.', zh: '这是 cape。它是一个长一点的词。' },
      { art: 'table|grandma,mom|cap|👀', en: 'Cap and cape.', zh: 'cap 和 cape。' },
      { art: 'table|grandma,mom|cap|?', en: 'The "e" makes the "a" say its name. Listen to the two words.', zh: '这个 e 让 a 读出自己的名字。听听这两个词。' },
      { art: 'table|grandma,mom|cap|·', en: 'Say "cap". Say it slow.', zh: '读 cap。慢慢读。' },
      { art: 'table|grandma,mom|cap|!', en: 'Say "cape". Say it again.', zh: '读 cape。再读一遍。' },
      { art: 'table|grandma,mom|cap|♥', en: 'Cap is not cape.', zh: 'cap 不是 cape。' },
      { art: 'table|grandma,mom|cap|★', en: 'The "e" changes the sound. One little e does it.', zh: '这个 e 改变了读音。一个小小的 e 就做到了。' },
      { art: 'table|grandma,mom|cap|…', en: 'You can say both.', zh: '两个你都会读。' },
      { art: 'table|grandma,mom|cap|·', en: 'Cap, cape!', zh: 'cap，cape！' },
      { art: 'table|grandma,mom|cap|♥', en: 'Good!', zh: '真棒！' }
    ],
    quiz: [
      { q: '下面哪个词在这一本里读到过？', opts: ['玫瑰', '鸭舌帽', '蛇'], a: 1, kind: 'recall' },
      { q: '那个「e」做了什么？', opts: ['让「a」读出自己的名字，改变了发音', '让词变短', '没做什么'], a: 0, kind: 'infer' },
      { q: '两个词只差一个 e，你会怎么分清？', opts: ['看清楚有没有 e，读准音', '不读了', '随便读一个'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b70', lv: 'L6', tag: '小知识', title: 'Why a Cake Rises', zh: '蛋糕为什么会鼓起来',
    emoji: '🧁', color: '#FAD3B6',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。认读 2 个新词（升起、热）。',
    trap: '词尾不发音的 e 会让前面的元音「报自己的名字」：cap → cape，kit → kite。',
    summary: '《蛋糕为什么会鼓起来》：这一本从一件小事讲起，说说为什么会这样。读前先看词卡（升起、热）；读的时候留意先看到什么、为什么会这样、后来怎么弄明白。',
    retell: '合上书，按「先看到什么 → 为什么会这样 → 后来怎么弄明白」讲一遍。',
    think: '说说你见过的一种会「鼓起来」的东西。',
    pre: [
      { art: '🏃', en: 'rise', zh: '升起' },
      { art: '🌿', en: 'heat', zh: '热' },
      { art: '🎂', en: 'cake', zh: '蛋糕' },
      { art: '📦', en: 'pan', zh: '平底锅' }
    ],
    sight: ['bigger', 'high', 'piece', 'watches'],
    newWords: [
      { w: 'rise', zh: '升起' },
      { w: 'heat', zh: '热' }
    ],
    pages: [
      { art: 'kitchen|grandpa,dad|cake|·', en: 'Ming makes a cake. He puts it in a pan.', zh: '明明做蛋糕。他把它放进烤盘。' },
      { art: 'kitchen|grandpa,dad|cake|♪', en: 'The cake goes in the hot place. It is hot in there.', zh: '蛋糕进了热的地方。里面很热。' },
      { art: 'kitchen|grandpa,dad|cake|👀', en: 'Why does a cake rise?', zh: '蛋糕为什么会鼓起来？' },
      { art: 'kitchen|grandpa,dad|cake|?', en: 'The heat makes it rise.', zh: '热让它鼓起来。' },
      { art: 'kitchen|grandpa,dad|cake|·', en: 'The cake gets bigger. Ming watches it.', zh: '蛋糕变大了。明明看着它。' },
      { art: 'kitchen|grandpa,dad|cake|!', en: 'The cake is high now. It is soft too.', zh: '蛋糕现在鼓得高高的。还很松软。' },
      { art: 'kitchen|grandpa,dad|cake|♥', en: 'Ming looks at the cake.', zh: '明明看着蛋糕。' },
      { art: 'kitchen|grandpa,dad|cake|★', en: 'The cake is good. It smells sweet.', zh: '蛋糕做好了。闻起来甜甜的。' },
      { art: 'kitchen|grandpa,dad|cake|…', en: 'A cake rises with heat.', zh: '蛋糕靠热鼓起来。' },
      { art: 'kitchen|grandpa,dad|cake|·', en: 'Why a cake rises.', zh: '蛋糕为什么会鼓起来。' },
      { art: 'kitchen|grandpa,dad|cake|♥', en: 'Ming likes the cake. He cuts a piece for Grandma.', zh: '明明喜欢这个蛋糕。他切了一块给奶奶。' }
    ],
    quiz: [
      { q: '下面哪个词在这一本里读到过？', opts: ['平底锅', '海', '歌'], a: 0, kind: 'recall' },
      { q: '蛋糕为什么鼓起来？', opts: ['因为加了水', '因为热让它膨胀', '因为放凉了'], a: 1, kind: 'infer' },
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
      { art: '🌿', en: 'light', zh: '光' }
    ],
    sight: ['break', 'care', 'light'],
    newWords: [
      { w: 'rope', zh: '绳子' }
    ],
    pages: [
      { art: 'home|mom,ming|hole|·', en: 'A rope is here. It is thick.', zh: '这儿有一根绳子。它很粗。' },
      { art: 'home|mom,ming|hole|♪', en: 'The rope is long.', zh: '绳子很长。' },
      { art: 'home|mom,ming|hole|👀', en: 'There is a hole in the rope. Ming finds it.', zh: '绳子上有个破口。明明发现了它。' },
      { art: 'home|mom,ming|hole|?', en: 'The hole is small. But it is deep.', zh: '破口很小。可是很深。' },
      { art: 'home|mom,ming|hole|·', en: 'Ming looks at the hole. He holds it up to the light.', zh: '明明看着破口。他把它举到光下。' },
      { art: 'home|mom,ming|hole|!', en: 'The rope is not strong now. It may break.', zh: '绳子现在不结实了。它可能会断。' },
      { art: 'home|mom,ming|hole|♥', en: 'Ming fixes the hole. He mends it with care.', zh: '明明补好了破口。他补得很仔细。' },
      { art: 'home|mom,ming|hole|★', en: 'The rope is strong again. He uses it again.', zh: '绳子又结实了。他重新用上它。' },
      { art: 'home|mom,ming|hole|…', en: 'A hole in the rope.', zh: '绳子上的洞。' },
      { art: 'home|mom,ming|hole|·', en: 'Ming is careful with the rope.', zh: '明明用绳子很小心。' },
      { art: 'home|mom,ming|hole|♥', en: 'A good rope is strong. A broken one is not.', zh: '好绳子结实。断了的就不结实。' }
    ],
    quiz: [
      { q: '下面哪个词在这一本里读到过？', opts: ['洞', '天空', '天鹅'], a: 0, kind: 'recall' },
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
      { art: '📦', en: 'can', zh: '罐子' }
    ],
    sight: ['clean'],
    newWords: [

    ],
    pages: [
      { art: 'library|dad,lili|plate|·', en: 'Two plates are on the table. They are both clean.', zh: '桌上有两只盘子。两只都很干净。' },
      { art: 'library|dad,lili|plate|♪', en: 'One plate is big. It is for Ming.', zh: '一只盘子大。是给明明的。' },
      { art: 'library|dad,lili|plate|👀', en: 'One plate is small. It is for Grandma.', zh: '一只盘子小。是给奶奶的。' },
      { art: 'library|dad,lili|plate|?', en: 'They are not the same.', zh: '它们不一样。' },
      { art: 'library|dad,lili|plate|·', en: 'But they are both plates. Both can hold food.', zh: '可它们都是盘子。都能装吃的。' },
      { art: 'library|dad,lili|plate|!', en: 'Ming looks at the two plates. He puts them together.', zh: '明明看着两只盘子。他把它们放到一起。' },
      { art: 'library|dad,lili|plate|♥', en: 'One big, one small.', zh: '一大一小。' },
      { art: 'library|dad,lili|plate|★', en: 'Ming uses the big plate. He puts rice on it.', zh: '明明用大盘子。他盛了米饭。' },
      { art: 'library|dad,lili|plate|…', en: 'Grandma uses the small one. She puts a cake on it.', zh: '奶奶用小盘子。她放了一块蛋糕。' },
      { art: 'library|dad,lili|plate|·', en: 'The same plate.', zh: '同一个盘子。' },
      { art: 'library|dad,lili|plate|♥', en: 'Big and small, both are plates.', zh: '大的小的，都是盘子。' }
    ],
    quiz: [
      { q: '下面哪个词在这一本里读到过？', opts: ['陀螺', '蛋糕', '胳膊'], a: 1, kind: 'recall' },
      { q: '两个盘子哪里不一样？', opts: ['一个有一个没有', '颜色不一样', '大小不一样'], a: 2, kind: 'infer' },
      { q: '两样东西很像但有差别，你会怎么做？', opts: ['不管它', '只看一个', '看一看哪里不一样，再说一说'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b73', lv: 'L7', tag: '通信', title: 'The Letter from the Farm', zh: '农场来的信',
    emoji: '✉️', color: '#F6C6C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 1 个新词（夏天）。',
    trap: '美音里元音后的 r 一定要卷舌读出来：car、bird、water 都不能吞掉 r。',
    summary: '《农场来的信》：这是一个完整的小故事。读前先看词卡（夏天）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，按做事情的顺序讲一遍，至少用上三个本本词卡。',
    think: '说说你写过或收到过的一封信。',
    pre: [
      { art: '⏰', en: 'summer', zh: '夏天' },
      { art: '✉️', en: 'letter', zh: '信' },
      { art: '🚜', en: 'farm', zh: '农场' }
    ],
    sight: ['writes'],
    newWords: [
      { w: 'summer', zh: '夏天' }
    ],
    pages: [
      { art: 'home|ming,grandma|letter|·', en: 'Grandma is on the farm. She is there for a week.', zh: '奶奶在农场。她要在那儿待一个星期。' },
      { art: 'home|ming,grandma|letter|♪', en: 'Grandma writes a letter. She sits at the desk.', zh: '奶奶写一封信。她坐在桌前。' },
      { art: 'home|ming,grandma|letter|👀', en: 'The letter is for Ming. She writes his name on it.', zh: '信是写给明明的。她把他的名字写在上面。' },
      { art: 'home|ming,grandma|letter|?', en: 'The letter comes to Ming. Dad brings it home.', zh: '信到了明明手里。爸爸把它带回家。' },
      { art: 'home|ming,grandma|letter|·', en: 'Ming reads the letter. He reads it slowly.', zh: '明明读信。他慢慢读。' },
      { art: 'home|ming,grandma|letter|!', en: 'The letter says the farm is good. It says the rain came.', zh: '信上说农场很好。还说下过雨了。' },
      { art: 'home|ming,grandma|letter|♥', en: 'The letter says the goat is big now. Ming laughs at that.', zh: '信上说山羊现在长大了。明明看到这儿笑了。' },
      { art: 'home|ming,grandma|letter|★', en: 'Ming writes back to Grandma. He tells her about school.', zh: '明明给奶奶回信。他跟她讲学校的事。' },
      { art: 'home|ming,grandma|letter|…', en: 'Ming says he is happy. He asks her to come home.', zh: '明明说他很开心。他问奶奶什么时候回家。' },
      { art: 'home|ming,grandma|letter|·', en: 'A letter from the farm.', zh: '农场来的信。' },
      { art: 'home|ming,grandma|letter|♥', en: 'Letters carry good words. They go a long way.', zh: '信带着好话。它们走很远的路。' },
      { art: 'home|ming,grandma|letter|·', en: 'Ming wants to go to the farm. He will go in summer.', zh: '明明想去农场。夏天他要去。' }
    ],
    quiz: [
      { q: '下面哪个词在这一本里读到过？', opts: ['公园', '猪肉', '桌子'], a: 2, kind: 'recall' },
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
    sight: ['wears'],
    newWords: [
      { w: 'winter', zh: '冬天' },
      { w: 'scarf', zh: '围巾' },
      { w: 'purple', zh: '紫色' }
    ],
    pages: [
      { art: 'home|lili,grandpa|scarf|·', en: 'Winter is here. The days are short.', zh: '冬天到了。白天变短了。' },
      { art: 'home|lili,grandpa|scarf|♪', en: 'The wind is cold. Ming feels it on his face.', zh: '风很冷。明明觉得脸上凉飕飕的。' },
      { art: 'home|lili,grandpa|scarf|👀', en: 'Mom makes a scarf. She works at night.', zh: '妈妈织一条围巾。她晚上织。' },
      { art: 'home|lili,grandpa|scarf|?', en: 'The scarf is long. It is purple.', zh: '围巾很长。是紫色的。' },
      { art: 'home|lili,grandpa|scarf|·', en: 'Mom gives the scarf to Ming. She puts it on him.', zh: '妈妈把围巾给明明。她给他围上。' },
      { art: 'home|lili,grandpa|scarf|!', en: 'Ming wears the scarf. He goes out to play.', zh: '明明戴着围巾。他出去玩。' },
      { art: 'home|lili,grandpa|scarf|♥', en: 'Ming is warm now. His face is warm.', zh: '明明现在暖和了。脸也暖和了。' },
      { art: 'home|lili,grandpa|scarf|★', en: 'The wind is still cold. The sky is gray.', zh: '风还是很冷。天灰蒙蒙的。' },
      { art: 'home|lili,grandpa|scarf|…', en: 'But Ming is warm with the scarf.', zh: '可围着围巾的明明很暖和。' },
      { art: 'home|lili,grandpa|scarf|·', en: 'A scarf for winter.', zh: '冬天的围巾。' },
      { art: 'home|lili,grandpa|scarf|♥', en: 'Ming likes the scarf. He wears it to school.', zh: '明明喜欢这条围巾。他戴着它去上学。' },
      { art: 'home|lili,grandpa|scarf|·', en: 'The scarf is from Mom. He hugs her.', zh: '围巾是妈妈织的。他抱了抱妈妈。' }
    ],
    quiz: [
      { q: '下面哪个词在这一本里读到过？', opts: ['网', '猪', '脸'], a: 2, kind: 'recall' },
      { q: '围巾是谁做的？', opts: ['妈妈', '明明', '奶奶'], a: 0, kind: 'infer' },
      { q: '天冷的时候，你会怎么做？', opts: ['不管它', '戴上围巾帽子，穿得暖和', '不出门'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b75', lv: 'L7', tag: '观察', title: 'Morning in the Garden', zh: '清晨的花园',
    emoji: '🌻', color: '#CDE7C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 1 个新词（花园）。',
    trap: '美音里元音后的 r 一定要卷舌读出来：car、bird、water 都不能吞掉 r。',
    summary: '《清晨的花园》：这是一个完整的小故事。读前先看词卡（花园）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，按做事情的顺序讲一遍，至少用上三个本本词卡。',
    think: '说说清晨的花园里有什么。',
    pre: [
      { art: '🌻', en: 'garden', zh: '花园' },
      { art: '🐛', en: 'bug', zh: '小虫' },
      { art: '🌿', en: 'sky', zh: '天空' }
    ],
    sight: ['bright', 'flower', 'leaf', 'quiet'],
    newWords: [
      { w: 'garden', zh: '花园' }
    ],
    pages: [
      { art: 'garden|grandma,mom|garden|·', en: 'Morning is here. The sky is bright.', zh: '清晨到了。天亮起来了。' },
      { art: 'garden|grandma,mom|garden|♪', en: 'Ming goes to the garden. He goes out early.', zh: '明明去花园。他很早就出门。' },
      { art: 'garden|grandma,mom|garden|👀', en: 'The garden is wet. The path is wet.', zh: '花园湿湿的。小路也湿。' },
      { art: 'garden|grandma,mom|garden|?', en: 'The grass is green. It is long now.', zh: '草是绿的。现在长得很长。' },
      { art: 'garden|grandma,mom|garden|·', en: 'A bug is on a leaf. It is very small.', zh: '叶子上有只小虫。它特别小。' },
      { art: 'garden|grandma,mom|garden|!', en: 'Ming looks at the bug. He gets down close.', zh: '明明看着小虫。他蹲下来凑近看。' },
      { art: 'garden|grandma,mom|garden|♥', en: 'The sun comes up. The garden gets warm.', zh: '太阳升起来。花园暖起来了。' },
      { art: 'garden|grandma,mom|garden|★', en: 'The garden is nice now. A flower opens.', zh: '花园现在好看极了。一朵花开了。' },
      { art: 'garden|grandma,mom|garden|…', en: 'Morning in the garden.', zh: '清晨的花园。' },
      { art: 'garden|grandma,mom|garden|·', en: 'Ming likes the morning. It is quiet here.', zh: '明明喜欢清晨。这儿安安静静。' },
      { art: 'garden|grandma,mom|garden|♥', en: 'The garden is a good place.', zh: '花园是个好地方。' },
      { art: 'garden|grandma,mom|garden|·', en: 'Ming will come back tomorrow. He will bring Grandma.', zh: '明明明天还来。他要带奶奶一起来。' }
    ],
    quiz: [
      { q: '下面哪个词在这一本里读到过？', opts: ['沙子', '锅', '小路'], a: 2, kind: 'recall' },
      { q: '花园里有什么？', opts: ['书和笔', '车和船', '草、虫、花'], a: 2, kind: 'infer' },
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
      { art: '📦', en: 'can', zh: '罐子' },
      { art: '🌊', en: 'sea', zh: '海' }
    ],
    sight: ['sea'],
    newWords: [
      { w: 'turtle', zh: '乌龟' },
      { w: 'shark', zh: '鲨鱼' }
    ],
    pages: [
      { art: 'beach|grandpa,dad|turtle|·', en: 'A turtle is in the sea. The sea is deep.', zh: '一只海龟在海里。海很深。' },
      { art: 'beach|grandpa,dad|turtle|♪', en: 'The turtle swims slowly. It looks for food.', zh: '海龟游得很慢。它在找吃的。' },
      { art: 'beach|grandpa,dad|turtle|👀', en: 'A shark is in the sea too. It comes from the deep.', zh: '海里还有一条鲨鱼。它从深处游来。' },
      { art: 'beach|grandpa,dad|turtle|?', en: 'The shark swims fast. It is much bigger.', zh: '鲨鱼游得很快。它大得多。' },
      { art: 'beach|grandpa,dad|turtle|·', en: 'The shark is big.', zh: '鲨鱼很大。' },
      { art: 'beach|grandpa,dad|turtle|!', en: 'The turtle is not fast. It can not swim away.', zh: '海龟不快。它游不走。' },
      { art: 'beach|grandpa,dad|turtle|♥', en: 'But the turtle is not afraid. It has a hard shell.', zh: '可海龟不害怕。它有硬硬的壳。' },
      { art: 'beach|grandpa,dad|turtle|★', en: 'The turtle goes down. It hides in the rocks.', zh: '海龟沉下去。它躲进石头里。' },
      { art: 'beach|grandpa,dad|turtle|…', en: 'The shark swims away. It can not find the turtle.', zh: '鲨鱼游走了。它找不到海龟。' },
      { art: 'beach|grandpa,dad|turtle|·', en: 'The turtle is safe. It comes up slowly.', zh: '海龟安全了。它慢慢浮上来。' },
      { art: 'beach|grandpa,dad|turtle|♥', en: 'The turtle and the shark.', zh: '乌龟和鲨鱼。' },
      { art: 'beach|grandpa,dad|turtle|·', en: 'Slow can be good. Slow can be safe too.', zh: '慢也有慢的好处。慢也能保平安。' }
    ],
    quiz: [
      { q: '下面哪个词在这一本里读到过？', opts: ['图画', '雨', '乌龟'], a: 2, kind: 'recall' },
      { q: '海龟是怎么躲开鲨鱼的？', opts: ['咬鲨鱼', '游得更快', '沉下去躲起来'], a: 2, kind: 'infer' },
      { q: '遇到比你强、有危险的，你会怎么做？', opts: ['冷静，想办法躲开或求助', '站在原地哭', '硬拼'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b77', lv: 'L7', tag: '上学', title: 'A Picture for the Teacher', zh: '给老师的画',
    emoji: '🖼️', color: '#E0CFF3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 2 个新词（画、图画）。',
    trap: '美音里元音后的 r 一定要卷舌读出来：car、bird、water 都不能吞掉 r。',
    summary: '《给老师的画》：这是一个完整的小故事。读前先看词卡（画、图画）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，按做事情的顺序讲一遍，至少用上三个本本词卡。',
    think: '说说你画过送人的一幅画。',
    pre: [
      { art: '🏃', en: 'draw', zh: '画' },
      { art: '🖼️', en: 'picture', zh: '图画' },
      { art: '☀️', en: 'sun', zh: '太阳' },
      { art: '📦', en: 'can', zh: '罐子' }
    ],
    sight: ['draws', 'yellow'],
    newWords: [
      { w: 'draw', zh: '画' },
      { w: 'picture', zh: '图画' }
    ],
    pages: [
      { art: 'school|mom,ming|picture|·', en: 'Ming draws a picture. He uses a new pen.', zh: '明明画一幅画。他用一支新笔。' },
      { art: 'school|mom,ming|picture|♪', en: 'The picture is for the teacher. He does not tell her.', zh: '画是送给老师的。他没告诉她。' },
      { art: 'school|mom,ming|picture|👀', en: 'Ming draws the garden. He draws the green grass.', zh: '明明画花园。他画上绿草地。' },
      { art: 'school|mom,ming|picture|?', en: 'Ming draws the sun too. The sun is yellow.', zh: '明明还画了太阳。太阳是黄的。' },
      { art: 'school|mom,ming|picture|·', en: 'The picture is nice. He works a long time.', zh: '画很好看。他画了很久。' },
      { art: 'school|mom,ming|picture|!', en: 'Ming gives the picture to the teacher. He holds it with two hands.', zh: '明明把画递给老师。他用双手捧着。' },
      { art: 'school|mom,ming|picture|♥', en: 'The teacher likes the picture. She looks at it a long time.', zh: '老师很喜欢这幅画。她看了好久。' },
      { art: 'school|mom,ming|picture|★', en: 'The teacher puts it on the wall. All can see it.', zh: '老师把画贴在墙上。大家都能看见。' },
      { art: 'school|mom,ming|picture|…', en: 'A picture for the teacher.', zh: '给老师的画。' },
      { art: 'school|mom,ming|picture|·', en: 'Ming is proud. He smiles all day.', zh: '明明很自豪。他一整天都笑眯眯的。' },
      { art: 'school|mom,ming|picture|♥', en: 'Pictures can say things.', zh: '画能说出话来。' },
      { art: 'school|mom,ming|picture|·', en: 'Ming draws more pictures. One is for Grandma.', zh: '明明又画了好几幅。有一幅是给奶奶的。' }
    ],
    quiz: [
      { q: '下面哪个词在这一本里读到过？', opts: ['鲨鱼', '雪', '黄色'], a: 2, kind: 'recall' },
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
      { art: '📍', en: 'corner', zh: '角落' },
      { art: '🏠', en: 'home', zh: '家' }
    ],
    sight: ['bright', 'near'],
    newWords: [
      { w: 'market', zh: '市场' }
    ],
    pages: [
      { art: 'street|dad,lili|market|·', en: 'A market is at the corner. It is near Ming\'s home.', zh: '街角有个市场。就在明明家附近。' },
      { art: 'street|dad,lili|market|♪', en: 'The market has many things. There are apples and eggs.', zh: '市场里东西很多。有苹果，有鸡蛋。' },
      { art: 'street|dad,lili|market|👀', en: 'Ming and Mom go to the market. They take a basket.', zh: '明明和妈妈去市场。他们带上篮子。' },
      { art: 'street|dad,lili|market|?', en: 'They see apples and rice. Ming looks at the grapes.', zh: '他们看见苹果和米。明明盯着葡萄看。' },
      { art: 'street|dad,lili|market|·', en: 'Mom buys rice. She puts it in the basket.', zh: '妈妈买了米。她把米放进篮子。' },
      { art: 'street|dad,lili|market|!', en: 'Ming buys an apple. It is red and bright.', zh: '明明买了一个苹果。又红又亮。' },
      { art: 'street|dad,lili|market|♥', en: 'The market is big.', zh: '市场很大。' },
      { art: 'street|dad,lili|market|★', en: 'They carry the things home. Ming helps Mom carry it.', zh: '他们把东西提回家。明明帮妈妈提着。' },
      { art: 'street|dad,lili|market|…', en: 'The market at the corner.', zh: '街角的市场。' },
      { art: 'street|dad,lili|market|·', en: 'Ming likes the market. He likes to look around.', zh: '明明喜欢市场。他喜欢四处看看。' },
      { art: 'street|dad,lili|market|♥', en: 'They will come back. They come here every week.', zh: '他们还会再来。他们每个星期都来。' },
      { art: 'street|dad,lili|market|·', en: 'The market is good.', zh: '市场真好。' }
    ],
    quiz: [
      { q: '下面哪个词在这一本里读到过？', opts: ['绵羊', '市场', '歌'], a: 1, kind: 'recall' },
      { q: '妈妈买了什么？', opts: ['米', '苹果', '鱼'], a: 0, kind: 'infer' },
      { q: '去市场买东西，你会怎么做？', opts: ['不看就走', '乱拿一通', '想好买什么，一样一样看'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b79', lv: 'L7', tag: '种植', title: 'Corn in the Garden', zh: '花园里的玉米',
    emoji: '🌽', color: '#BFE6DF',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 1 个新词（年）。',
    trap: '美音里元音后的 r 一定要卷舌读出来：car、bird、water 都不能吞掉 r。',
    summary: '《花园里的玉米》：这是一个完整的小故事。读前先看词卡（年）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，按做事情的顺序讲一遍，至少用上三个本本词卡。',
    think: '说说一种长在花园里的吃的。',
    pre: [
      { art: '⏰', en: 'year', zh: '年' },
      { art: '🌽', en: 'corn', zh: '玉米' },
      { art: '🌻', en: 'garden', zh: '花园' }
    ],
    sight: ['eats', 'grows', 'leaves', 'yellow'],
    newWords: [
      { w: 'year', zh: '年' }
    ],
    pages: [
      { art: 'farm|ming,grandma|corn|·', en: 'Corn is in the garden. Ming put the seeds in.', zh: '花园里种着玉米。明明把种子种了下去。' },
      { art: 'farm|ming,grandma|corn|♪', en: 'The corn is tall. It is taller than Ming.', zh: '玉米长得很高。比明明还高。' },
      { art: 'farm|ming,grandma|corn|👀', en: 'The corn grows and grows. It needs water and sun.', zh: '玉米长啊长。它需要水和太阳。' },
      { art: 'farm|ming,grandma|corn|?', en: 'Ming looks at the corn. He looks at the leaves.', zh: '明明看着玉米。他看看叶子。' },
      { art: 'farm|ming,grandma|corn|·', en: 'The corn is not ready. It is green, not yellow.', zh: '玉米还没熟。是绿的，不是黄的。' },
      { art: 'farm|ming,grandma|corn|!', en: 'Ming waits. He waits many days.', zh: '明明等着。他等了好多天。' },
      { art: 'farm|ming,grandma|corn|♥', en: 'The corn is ready now! It is yellow and full.', zh: '玉米现在熟了！黄澄澄、颗粒饱满。' },
      { art: 'farm|ming,grandma|corn|★', en: 'Ming picks the corn. He takes three.', zh: '明明摘玉米。他摘了三根。' },
      { art: 'farm|ming,grandma|corn|…', en: 'Corn in the garden.', zh: '花园里的玉米。' },
      { art: 'farm|ming,grandma|corn|·', en: 'The corn is good. Mom cooks it in a pot.', zh: '玉米很好吃。妈妈用锅煮。' },
      { art: 'farm|ming,grandma|corn|♥', en: 'Ming likes corn. He eats it all.', zh: '明明喜欢玉米。他全吃光了。' },
      { art: 'farm|ming,grandma|corn|·', en: 'Ming will plant more corn. He will plant it next year.', zh: '明明还要种更多玉米。明年再种。' }
    ],
    quiz: [
      { q: '下面哪个词在这一本里读到过？', opts: ['茎', '花园', '衬衫'], a: 1, kind: 'recall' },
      { q: '玉米什么时候熟的？', opts: ['一直没熟', '等了一阵子以后', '马上就熟了'], a: 1, kind: 'infer' },
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
    sight: ['leaf'],
    newWords: [
      { w: 'search', zh: '寻找' }
    ],
    pages: [
      { art: 'library|lili,grandpa|park|·', en: 'Ming goes to the park. He takes his ball.', zh: '明明去公园。他带上球。' },
      { art: 'library|lili,grandpa|park|♪', en: 'Ming looks for a ball. He put it here this morning.', zh: '明明找一个球。今天早上他还放在这儿。' },
      { art: 'library|lili,grandpa|park|👀', en: 'The ball is not here. He looks at the grass.', zh: '球不在这儿。他看看草地上。' },
      { art: 'library|lili,grandpa|park|?', en: 'Ming looks all over the park. He walks a long way.', zh: '明明找遍了公园。他走了好远。' },
      { art: 'library|lili,grandpa|park|·', en: 'Ming looks under a tree. Only a bug is there.', zh: '明明往树下看。那儿只有一只小虫。' },
      { art: 'library|lili,grandpa|park|!', en: 'Ming looks by a stone. He finds an old leaf.', zh: '明明在石头边找。他找到一片枯叶。' },
      { art: 'library|lili,grandpa|park|♥', en: 'Ming does not find the ball. He sits down to think.', zh: '明明没找到球。他坐下来想。' },
      { art: 'library|lili,grandpa|park|★', en: 'Ming asks for help. He asks a man at the gate.', zh: '明明请人帮忙。他问了门口的一位叔叔。' },
      { art: 'library|lili,grandpa|park|…', en: 'Someone saw the ball. It went that way.', zh: '有人看见过球。它往那边去了。' },
      { art: 'library|lili,grandpa|park|·', en: 'The ball is by the gate! Ming runs to get it.', zh: '球在门边！明明跑过去捡。' },
      { art: 'library|lili,grandpa|park|♥', en: 'Search the park.', zh: '找遍公园。' },
      { art: 'library|lili,grandpa|park|·', en: 'Ming is glad to find the ball. He takes it home.', zh: '找到球明明很高兴。他把球带回家。' }
    ],
    quiz: [
      { q: '下面哪个词在这一本里读到过？', opts: ['星星', '男人', '二'], a: 1, kind: 'recall' },
      { q: '球最后在哪里？', opts: ['门边', '水里', '树下'], a: 0, kind: 'infer' },
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
      { art: '🐦', en: 'bird', zh: '鸟' },
      { art: '📦', en: 'can', zh: '罐子' }
    ],
    sight: [],
    newWords: [
      { w: 'car', zh: '小汽车' }
    ],
    pages: [
      { art: 'table|grandma,mom|car|·', en: 'This is a car. It has an r.', zh: '这是 car。里面有个 r。' },
      { art: 'table|grandma,mom|car|♪', en: 'This is a bird. It has an r too.', zh: '这是 bird。里面也有个 r。' },
      { art: 'table|grandma,mom|car|👀', en: 'Car and bird.', zh: 'car 和 bird。' },
      { art: 'table|grandma,mom|car|?', en: 'Both have an "r" sound. Listen for it.', zh: '两个词都有 r 的音。仔细听。' },
      { art: 'table|grandma,mom|car|·', en: 'Say "car". Say it slow.', zh: '读 car。慢慢读。' },
      { art: 'table|grandma,mom|car|!', en: 'Say "bird". Say it again.', zh: '读 bird。再读一遍。' },
      { art: 'table|grandma,mom|car|♥', en: 'Say the "r" well. Do not drop it.', zh: '把 r 读清楚。别把它吞掉。' },
      { art: 'table|grandma,mom|car|★', en: 'Car is not bird.', zh: 'car 不是 bird。' },
      { art: 'table|grandma,mom|car|…', en: 'You can say both. Both are short words.', zh: '两个你都会读。两个都是短词。' },
      { art: 'table|grandma,mom|car|·', en: 'Car, bird, car, bird.', zh: 'car，bird，car，bird。' },
      { art: 'table|grandma,mom|car|♥', en: 'Good!', zh: '真棒！' },
      { art: 'table|grandma,mom|car|·', en: 'Now say them fast. Say them one more time.', zh: '现在读快一点。再读一遍。' }
    ],
    quiz: [
      { q: '下面哪个词在这一本里读到过？', opts: ['小汽车', '衬衫', '茎'], a: 0, kind: 'recall' },
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
      { art: '🌿', en: 'light', zh: '光' }
    ],
    sight: ['high', 'leaves', 'light', 'wear'],
    newWords: [

    ],
    pages: [
      { art: 'night|grandpa,dad|winter|·', en: 'Winter is here. The trees have no leaves.', zh: '冬天到了。树上没有叶子了。' },
      { art: 'night|grandpa,dad|winter|♪', en: 'Why is winter cold?', zh: '冬天为什么冷？' },
      { art: 'night|grandpa,dad|winter|👀', en: 'The sun is not high. It is far away.', zh: '太阳不高。它离我们远。' },
      { art: 'night|grandpa,dad|winter|?', en: 'The days are not long. It gets dark early.', zh: '白天不长。天很早就黑了。' },
      { art: 'night|grandpa,dad|winter|·', en: 'The sun is not hot. The light is not strong.', zh: '太阳不热。光也不强。' },
      { art: 'night|grandpa,dad|winter|!', en: 'So winter is cold.', zh: '所以冬天冷。' },
      { art: 'night|grandpa,dad|winter|♥', en: 'The wind is cold too. We feel it on our face.', zh: '风也冷。我们脸上能感觉到。' },
      { art: 'night|grandpa,dad|winter|★', en: 'We wear coats. We wear scarves too.', zh: '我们穿外套。还围围巾。' },
      { art: 'night|grandpa,dad|winter|…', en: 'Winter is cold, but we are warm.', zh: '冬天很冷，可我们很暖和。' },
      { art: 'night|grandpa,dad|winter|·', en: 'Why winter is cold.', zh: '冬天为什么冷。' },
      { art: 'night|grandpa,dad|winter|♥', en: 'Winter will go. The days get long again.', zh: '冬天会过去。白天又变长。' },
      { art: 'night|grandpa,dad|winter|·', en: 'Warm days will come. We can play in the park.', zh: '暖和的日子会来。我们又能去公园玩。' }
    ],
    quiz: [
      { q: '下面哪个词在这一本里读到过？', opts: ['光', '勺子', '浴盆'], a: 0, kind: 'recall' },
      { q: '冬天为什么冷？', opts: ['太阳不高不热，白天也短', '因为下雪', '因为风大'], a: 0, kind: 'infer' },
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
      { art: 'farm|mom,ming|farmer|·', en: 'A farmer works on the farm. The farm is his work.', zh: '农民在农场干活。农场就是他的活计。' },
      { art: 'farm|mom,ming|farmer|♪', en: 'The farmer gets up early. It is still dark.', zh: '农民起得很早。天还没亮。' },
      { art: 'farm|mom,ming|farmer|👀', en: 'The farmer feeds the animals. He gives them corn.', zh: '农民喂动物。他给它们玉米。' },
      { art: 'farm|mom,ming|farmer|?', en: 'The farmer grows corn. He watches it grow.', zh: '农民种玉米。他看着它长。' },
      { art: 'farm|mom,ming|farmer|·', en: 'The farmer works all day. He does not rest much.', zh: '农民干一整天。他很少歇。' },
      { art: 'farm|mom,ming|farmer|!', en: 'The farmer is tired. His back hurts.', zh: '农民累了。他的背酸疼。' },
      { art: 'farm|mom,ming|farmer|♥', en: 'But the farm is good. The corn is tall.', zh: '可农场长得好。玉米高高的。' },
      { art: 'farm|mom,ming|farmer|★', en: 'How a farmer works.', zh: '农民怎么干活。' },
      { art: 'farm|mom,ming|farmer|…', en: 'The farmer likes the farm.', zh: '农民喜欢这个农场。' },
      { art: 'farm|mom,ming|farmer|·', en: 'The farmer is careful. He looks at the sky.', zh: '农民很仔细。他看看天色。' },
      { art: 'farm|mom,ming|farmer|♥', en: 'The farm helps many people. The food goes to the market.', zh: '农场养活很多人。粮食运到市场。' },
      { art: 'farm|mom,ming|farmer|·', en: 'We thank the farmer. We eat it all.', zh: '我们谢谢农民。我们把饭吃光。' }
    ],
    quiz: [
      { q: '下面哪个词在这一本里读到过？', opts: ['老师', '食物', '工人'], a: 1, kind: 'recall' },
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
      { art: '📍', en: 'corner', zh: '角落' },
      { art: '🌳', en: 'tree', zh: '树' }
    ],
    sight: ['knows', 'leaves'],
    newWords: [

    ],
    pages: [
      { art: 'library|dad,lili|corner|·', en: 'Ming walks to the corner. He walks alone.', zh: '明明走到街角。他一个人走。' },
      { art: 'library|dad,lili|corner|♪', en: 'The corner is the first place. He started here.', zh: '街角是最开始的地方。他从这儿出发。' },
      { art: 'library|dad,lili|corner|👀', en: 'Ming looks at the market. He sees the baskets.', zh: '明明望着市场。他看见了那些篮子。' },
      { art: 'library|dad,lili|corner|?', en: 'Ming looks at the park. The tree is big now.', zh: '明明望着公园。那棵树现在大了。' },
      { art: 'library|dad,lili|corner|·', en: 'Ming knows them all.', zh: '这些地方他全认得。' },
      { art: 'library|dad,lili|corner|!', en: 'Back to the first place.', zh: '回到最开始。' },
      { art: 'library|dad,lili|corner|♥', en: 'Ming sees the same tree. He pats it.', zh: '明明看见同一棵树。他拍了拍它。' },
      { art: 'library|dad,lili|corner|★', en: 'The tree is still there. It has more leaves.', zh: '树还在那儿。叶子更多了。' },
      { art: 'library|dad,lili|corner|…', en: 'Ming is glad to be back. He stands there a long time.', zh: '回来真好。他在那儿站了好久。' },
      { art: 'library|dad,lili|corner|·', en: 'The first place is good. It feels like home.', zh: '最开始的地方真好。感觉像家。' },
      { art: 'library|dad,lili|corner|♥', en: 'Ming will start again. He has a new plan.', zh: '明明要重新开始。他有了新计划。' },
      { art: 'library|dad,lili|corner|·', en: 'Ming likes the corner. He will come back.', zh: '明明喜欢这个街角。他还会再来。' }
    ],
    quiz: [
      { q: '下面哪个词在这一本里读到过？', opts: ['二', '胳膊', '树'], a: 2, kind: 'recall' },
      { q: '明明回到了哪里？', opts: ['学校', '家', '街角'], a: 2, kind: 'infer' },
      { q: '回到去过的地方，你会怎么做？', opts: ['看看有什么变化，重新感受一下', '不看', '随便看看'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b85', lv: 'L8', tag: '过年', title: 'Dumplings with Grandma', zh: '和奶奶包饺子',
    emoji: '🥟', color: '#F6C6C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 3 个新词（圆、饺子、好看）。',
    trap: 'ou / ow 读 /aʊ/，oi / oy 读 /ɔɪ/；长句按意思分组读，别逐词蹦。',
    summary: '《和奶奶包饺子》：这是一个完整的小故事。读前先看词卡（圆、饺子、好看）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，按做事情的顺序讲一遍，至少用上三个本本词卡。',
    think: '说说你和家人一起做过的一种吃的。',
    pre: [
      { art: '✨', en: 'round', zh: '圆' },
      { art: '🥟', en: 'dumpling', zh: '饺子' },
      { art: '✨', en: 'pretty', zh: '好看' },
      { art: '🍳', en: 'kitchen', zh: '厨房' },
      { art: '📦', en: 'piece', zh: '一块' }
    ],
    sight: ['kitchen', 'piece'],
    newWords: [
      { w: 'round', zh: '圆' },
      { w: 'dumpling', zh: '饺子' },
      { w: 'pretty', zh: '好看' }
    ],
    pages: [
      { art: 'kitchen|ming,grandma|dumpling|·', en: 'Grandma is in the kitchen. The kitchen is warm.', zh: '奶奶在厨房里。厨房暖融融的。' },
      { art: 'kitchen|ming,grandma|dumpling|♪', en: 'Grandma makes dumplings. She makes a round piece.', zh: '奶奶包饺子。她擀出一张圆面皮。' },
      { art: 'kitchen|ming,grandma|dumpling|👀', en: 'Ming helps Grandma. He washes his hands first.', zh: '明明帮奶奶。他先把手洗干净。' },
      { art: 'kitchen|ming,grandma|dumpling|?', en: 'They get the food ready. There is pork and green leaves.', zh: '他们把馅备好。有猪肉，有青菜。' },
      { art: 'kitchen|ming,grandma|dumpling|·', en: 'Grandma shows Ming how. She puts the food on the round piece.', zh: '奶奶教明明怎么做。她把馅放到圆面皮上。' },
      { art: 'kitchen|ming,grandma|dumpling|!', en: 'Ming makes one dumpling. He closes it with his hands.', zh: '明明包了一个饺子。他用两只手把它捏合。' },
      { art: 'kitchen|ming,grandma|dumpling|♥', en: 'The dumpling is not pretty. One side is open.', zh: '饺子不太好看。有一边没捏住。' },
      { art: 'kitchen|ming,grandma|dumpling|★', en: 'Grandma says it is fine. She shows him again.', zh: '奶奶说没关系。她又示范了一遍。' },
      { art: 'kitchen|ming,grandma|dumpling|…', en: 'They make many dumplings. The table is full.', zh: '他们包了好多饺子。桌上摆满了。' },
      { art: 'kitchen|ming,grandma|dumpling|·', en: 'The dumplings cook in the pot. The water boils.', zh: '饺子在锅里煮。水咕嘟咕嘟开了。' },
      { art: 'kitchen|ming,grandma|dumpling|♥', en: 'The dumplings are good! Ming tastes one.', zh: '饺子真好吃！明明尝了一个。' },
      { art: 'kitchen|ming,grandma|dumpling|·', en: 'Ming eats the dumplings. He eats more than Grandma.', zh: '明明吃饺子。他比奶奶吃得还多。' },
      { art: 'kitchen|ming,grandma|dumpling|…', en: 'Dumplings with Grandma. He wants to make them again.', zh: '和奶奶包饺子。他还想再包一次。' }
    ],
    quiz: [
      { q: '下面哪个词在这一本里读到过？', opts: ['绿色', '池塘', '玫瑰'], a: 0, kind: 'recall' },
      { q: '明明包的饺子怎么样？', opts: ['不能吃', '特别漂亮', '不太好看，但没关系'], a: 2, kind: 'infer' },
      { q: '和家人一起做吃的，你会怎么做？', opts: ['怕做不好就不做', '只吃不做', '跟着学，做不好也没关系'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b86', lv: 'L8', tag: '中秋', title: 'The Mid-Autumn Moon', zh: '中秋的月亮',
    emoji: '🌕', color: '#F9DFB4',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 4 个新词（中、秋天、窗户、月饼）。',
    trap: 'ou / ow 读 /aʊ/，oi / oy 读 /ɔɪ/；长句按意思分组读，别逐词蹦。',
    summary: '《中秋的月亮》：这是一个完整的小故事。读前先看词卡（中、秋天、窗户、月饼）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，按做事情的顺序讲一遍，至少用上三个本本词卡。',
    think: '说说中秋节你和家人做了什么。',
    pre: [
      { art: '⏰', en: 'mid', zh: '中' },
      { art: '⏰', en: 'autumn', zh: '秋天' },
      { art: '🪟', en: 'window', zh: '窗户' },
      { art: '🥮', en: 'mooncake', zh: '月饼' },
      { art: '🌙', en: 'moon', zh: '月亮' },
      { art: '🌿', en: 'night', zh: '夜晚' }
    ],
    sight: ['near', 'quiet'],
    newWords: [
      { w: 'mid', zh: '中' },
      { w: 'autumn', zh: '秋天' },
      { w: 'window', zh: '窗户' },
      { w: 'mooncake', zh: '月饼' }
    ],
    pages: [
      { art: 'kitchen|lili,grandpa|mooncake|·', en: 'The Mid-Autumn night is here. The sky is clear.', zh: '中秋的夜晚到了。天空很清朗。' },
      { art: 'kitchen|lili,grandpa|mooncake|♪', en: 'The moon is round. It looks like a plate.', zh: '月亮圆圆的。看上去像一只盘子。' },
      { art: 'kitchen|lili,grandpa|mooncake|👀', en: 'The moon is bright.', zh: '月亮很亮。' },
      { art: 'kitchen|lili,grandpa|mooncake|?', en: 'The family is together. They sit near the window.', zh: '全家人聚在一起。他们坐在窗边。' },
      { art: 'kitchen|lili,grandpa|mooncake|·', en: 'Grandma has mooncakes. There are many on the plate.', zh: '奶奶拿出了月饼。盘子里有好多个。' },
      { art: 'kitchen|lili,grandpa|mooncake|!', en: 'A mooncake is for Ming. It is round like the moon.', zh: '有一块月饼给明明。它像月亮一样圆。' },
      { art: 'kitchen|lili,grandpa|mooncake|♥', en: 'The mooncake is good. It is sweet and soft.', zh: '月饼很好吃。又甜又软。' },
      { art: 'kitchen|lili,grandpa|mooncake|★', en: 'They look at the moon. Grandpa talks about the moon.', zh: '大家看月亮。爷爷讲起月亮的事。' },
      { art: 'kitchen|lili,grandpa|mooncake|…', en: 'The moon looks back. Ming smiles at it.', zh: '月亮也看着我们。明明朝它笑。' },
      { art: 'kitchen|lili,grandpa|mooncake|·', en: 'The Mid-Autumn moon. The night is quiet.', zh: '中秋的月亮。夜里安安静静。' },
      { art: 'kitchen|lili,grandpa|mooncake|♥', en: 'They are happy together. They talk for a long time.', zh: '在一起真开心。他们聊了很久。' },
      { art: 'kitchen|lili,grandpa|mooncake|·', en: 'Mooncakes and the moon. Ming will remember this night.', zh: '月饼和月亮。明明会记住这个晚上。' },
      { art: 'kitchen|lili,grandpa|mooncake|…', en: 'A good night for the family. He keeps the last mooncake.', zh: '全家人的好夜晚。他留着最后一块月饼。' }
    ],
    quiz: [
      { q: '下面哪个词在这一本里读到过？', opts: ['月亮', '比赛', '学校'], a: 0, kind: 'recall' },
      { q: '中秋夜里大家做了什么？', opts: ['去看电影', '一起看月亮、吃月饼', '去上学'], a: 1, kind: 'infer' },
      { q: '过节和家人团聚，你会怎么做？', opts: ['不参加', '只顾自己玩', '和家人一起，珍惜在一起的时间'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b87', lv: 'L8', tag: '出行', title: 'A Long Train Ride', zh: '一趟长长的火车',
    emoji: '🚄', color: '#CDE7C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 2 个新词（火车、小镇）。',
    trap: 'ou / ow 读 /aʊ/，oi / oy 读 /ɔɪ/；长句按意思分组读，别逐词蹦。',
    summary: '《一趟长长的火车》：这是一个完整的小故事。读前先看词卡（火车、小镇）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，按做事情的顺序讲一遍，至少用上三个本本词卡。',
    think: '说说你坐火车或汽车时看到的风景。',
    pre: [
      { art: '📦', en: 'train', zh: '火车' },
      { art: '🏙️', en: 'town', zh: '小镇' },
      { art: '🪟', en: 'window', zh: '窗户' },
      { art: '🌿', en: 'grass', zh: '草' }
    ],
    sight: [],
    newWords: [
      { w: 'train', zh: '火车' },
      { w: 'town', zh: '小镇' }
    ],
    pages: [
      { art: 'home|grandma,mom|window|·', en: 'Ming is on a train. It is his first long trip.', zh: '明明在火车上。这是他第一次出远门。' },
      { art: 'home|grandma,mom|window|♪', en: 'The train ride is long. It will take many hours.', zh: '这趟车要走很久。得坐好几个小时。' },
      { art: 'home|grandma,mom|window|👀', en: 'Ming sits by the window. Mom sits with him.', zh: '明明坐在窗边。妈妈陪着他坐。' },
      { art: 'home|grandma,mom|window|?', en: 'Ming looks out the window. The houses go by.', zh: '明明往窗外看。一栋栋房子掠过去。' },
      { art: 'home|grandma,mom|window|·', en: 'The train goes and goes. It does not stop.', zh: '火车开啊开。一直不停。' },
      { art: 'home|grandma,mom|window|!', en: 'Ming sees hills and trees. He sees cows on the grass.', zh: '明明看见小山和树。还看见草地上的牛。' },
      { art: 'home|grandma,mom|window|♥', en: 'The train goes fast. The trees go by quickly.', zh: '火车开得很快。树飞快地往后退。' },
      { art: 'home|grandma,mom|window|★', en: 'Ming looks and looks. He counts the cows.', zh: '明明看了又看。他数起牛来。' },
      { art: 'home|grandma,mom|window|…', en: 'The window is nice. He can see the sky.', zh: '车窗真好。他能看见天空。' },
      { art: 'home|grandma,mom|window|·', en: 'A long train ride. Mom gives him a cake.', zh: '一趟长长的火车。妈妈给了他一块蛋糕。' },
      { art: 'home|grandma,mom|window|♥', en: 'Ming likes the window. He does not want to sleep.', zh: '明明喜欢这扇窗。他一点也不想睡。' },
      { art: 'home|grandma,mom|window|·', en: 'The train stops. They are in the town.', zh: '火车停了。他们到了镇上。' },
      { art: 'home|grandma,mom|window|…', en: 'Ming is glad. Grandma is there to meet them.', zh: '明明很高兴。奶奶在那儿接他们。' }
    ],
    quiz: [
      { q: '下面哪个词在这一本里读到过？', opts: ['绵羊', '草', '路'], a: 1, kind: 'recall' },
      { q: '明明坐在哪里？', opts: ['火车的窗边', '汽车里', '船上'], a: 0, kind: 'infer' },
      { q: '坐车旅行，你会怎么做？', opts: ['看看窗外的风景，注意安全', '一直睡觉', '乱跑'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b88', lv: 'L8', tag: '通信', title: 'A Letter to My Cousin', zh: '给表姐的信',
    emoji: '💌', color: '#C6DEF6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 3 个新词（表姐、生命、房子）。',
    trap: 'ou / ow 读 /aʊ/，oi / oy 读 /ɔɪ/；长句按意思分组读，别逐词蹦。',
    summary: '《给表姐的信》：这是一个完整的小故事。读前先看词卡（表姐、生命、房子）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，按做事情的顺序讲一遍，至少用上三个本本词卡。',
    think: '说说你想寄给远方亲人的一样东西。',
    pre: [
      { art: '🧑', en: 'cousin', zh: '表姐' },
      { art: '💡', en: 'life', zh: '生命' },
      { art: '🏠', en: 'house', zh: '房子' },
      { art: '🖼️', en: 'picture', zh: '图画' },
      { art: '✉️', en: 'letter', zh: '信' }
    ],
    sight: ['writes'],
    newWords: [
      { w: 'cousin', zh: '表姐' },
      { w: 'life', zh: '生命' },
      { w: 'house', zh: '房子' }
    ],
    pages: [
      { art: 'school|grandpa,dad|drawing|·', en: 'Ming draws a picture. He sits at the desk.', zh: '明明画一幅画。他坐在书桌前。' },
      { art: 'school|grandpa,dad|drawing|♪', en: 'The drawing is for Cousin. She lives in another town.', zh: '这幅画是给表姐的。她住在另一个镇上。' },
      { art: 'school|grandpa,dad|drawing|👀', en: 'Ming draws a house. He makes it big and warm.', zh: '明明画了一座房子。他画得又大又暖和。' },
      { art: 'school|grandpa,dad|drawing|?', en: 'Ming draws a window on it. He draws a small Ming in it.', zh: '他在房子上画了一扇窗。窗里画了个小小的明明。' },
      { art: 'school|grandpa,dad|drawing|·', en: 'The picture is nice. He paints the sky blue.', zh: '画很好看。他把天空涂成蓝色。' },
      { art: 'school|grandpa,dad|drawing|!', en: 'Ming writes a note too. He tells her about the garden.', zh: '明明还写了一张纸条。他跟她讲花园的事。' },
      { art: 'school|grandpa,dad|drawing|♥', en: 'The note says hello. It asks how she is.', zh: '纸条上写着你好。还问她近来好不好。' },
      { art: 'school|grandpa,dad|drawing|★', en: 'Ming puts the picture in a letter. He writes her name on it.', zh: '明明把画装进信里。他在信封上写好她的名字。' },
      { art: 'school|grandpa,dad|drawing|…', en: 'The letter goes to Cousin. It goes far away.', zh: '信寄给表姐。它要去很远的地方。' },
      { art: 'school|grandpa,dad|drawing|·', en: 'Cousin gets the letter. She opens it that day.', zh: '表姐收到了信。当天就拆开了。' },
      { art: 'school|grandpa,dad|drawing|♥', en: 'Cousin likes the picture. She writes back to Ming.', zh: '表姐很喜欢这幅画。她给明明回了信。' },
      { art: 'school|grandpa,dad|drawing|·', en: 'A picture for Cousin.', zh: '给表姐的画。' },
      { art: 'school|grandpa,dad|drawing|…', en: 'Letters and pictures. They can go a long way.', zh: '信和画。它们能走很远的路。' }
    ],
    quiz: [
      { q: '下面哪个词在这一本里读到过？', opts: ['尾巴', '雪', '表姐'], a: 2, kind: 'recall' },
      { q: '明明在信里放了什么？', opts: ['一个玩具', '一幅画和一张纸条', '一块月饼'], a: 1, kind: 'infer' },
      { q: '想让远方的家人开心，你会怎么做？', opts: ['画一幅画或写几句话寄给他', '只打电话', '什么也不做'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b89', lv: 'L8', tag: '农场', title: 'The Brown Cow', zh: '棕色的奶牛',
    emoji: '🐄', color: '#E0CFF3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 2 个新词（奶牛、棕色）。',
    trap: 'ou / ow 读 /aʊ/，oi / oy 读 /ɔɪ/；长句按意思分组读，别逐词蹦。',
    summary: '《棕色的奶牛》：这是一个完整的小故事。读前先看词卡（奶牛、棕色）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，按做事情的顺序讲一遍，至少用上三个本本词卡。',
    think: '说说你在农场见过的一种大动物。',
    pre: [
      { art: '🐄', en: 'cow', zh: '奶牛' },
      { art: '🟤', en: 'brown', zh: '棕色' },
      { art: '🌿', en: 'grass', zh: '草' },
      { art: '🚜', en: 'farm', zh: '农场' }
    ],
    sight: ['near'],
    newWords: [
      { w: 'cow', zh: '奶牛' },
      { w: 'brown', zh: '棕色' }
    ],
    pages: [
      { art: 'farm|mom,ming|cow|·', en: 'A cow is on the farm. It is the biggest animal here.', zh: '农场里有一头奶牛。它是这儿最大的动物。' },
      { art: 'farm|mom,ming|cow|♪', en: 'The cow is brown. Its nose is soft.', zh: '奶牛是棕色的。鼻子软软的。' },
      { art: 'farm|mom,ming|cow|👀', en: 'The cow is big. Ming looks up at it.', zh: '奶牛很大。明明得抬头看它。' },
      { art: 'farm|mom,ming|cow|?', en: 'The cow eats grass. It eats slowly.', zh: '奶牛吃草。它慢慢吃。' },
      { art: 'farm|mom,ming|cow|·', en: 'The cow eats and eats. It does not look at Ming.', zh: '奶牛吃个不停。它没看明明。' },
      { art: 'farm|mom,ming|cow|!', en: 'Ming looks at the cow. He stays near the gate.', zh: '明明看着奶牛。他站在门边不挪步。' },
      { art: 'farm|mom,ming|cow|♥', en: 'The cow is calm. Its tail goes slowly.', zh: '奶牛很安静。尾巴慢慢甩着。' },
      { art: 'farm|mom,ming|cow|★', en: 'Ming is not afraid. He takes one step closer.', zh: '明明不害怕。他往前迈了一小步。' },
      { art: 'farm|mom,ming|cow|…', en: 'Ming gives the cow grass. He puts it on the ground.', zh: '明明给奶牛喂草。他把草放到地上。' },
      { art: 'farm|mom,ming|cow|·', en: 'The brown cow. It takes the grass.', zh: '棕色的奶牛。它把草吃了。' },
      { art: 'farm|mom,ming|cow|♥', en: 'The cow likes Ming. It comes near him.', zh: '奶牛喜欢明明。它朝他走近。' },
      { art: 'farm|mom,ming|cow|·', en: 'Ming likes the cow. He pats its nose.', zh: '明明喜欢这头牛。他拍了拍它的鼻子。' },
      { art: 'farm|mom,ming|cow|…', en: 'A cow on the farm. He will come back.', zh: '农场里的奶牛。他还会再来。' }
    ],
    quiz: [
      { q: '下面哪个词在这一本里读到过？', opts: ['星星', '小店', '奶牛'], a: 2, kind: 'recall' },
      { q: '牛是什么颜色的？', opts: ['黑色', '白色', '棕色'], a: 2, kind: 'infer' },
      { q: '靠近大动物，你会怎么做？', opts: ['大声吓它', '追它', '轻轻的，让它不怕你'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b90', lv: 'L8', tag: '家里', title: 'A House with a Window', zh: '有窗的房子',
    emoji: '🏠', color: '#F6C9E3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。不引入新词，全部是读过的词。',
    trap: 'ou / ow 读 /aʊ/，oi / oy 读 /ɔɪ/；长句按意思分组读，别逐词蹦。',
    summary: '《有窗的房子》：这是一个完整的小故事。读前先看词卡，都是学过的词；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，按做事情的顺序讲一遍，至少用上三个本本词卡。',
    think: '说说你家的一扇窗户：从那里能看到什么？',
    pre: [
      { art: '🪟', en: 'window', zh: '窗户' },
      { art: '🏠', en: 'house', zh: '房子' }
    ],
    sight: ['floor', 'kitchen', 'near'],
    newWords: [

    ],
    pages: [
      { art: 'home|dad,lili|house|·', en: 'A house is on the hill. It is not big.', zh: '小山上有一座房子。房子不大。' },
      { art: 'home|dad,lili|house|♪', en: 'The house has a window. The window faces the town.', zh: '房子有一扇窗。窗子朝着镇子。' },
      { art: 'home|dad,lili|house|👀', en: 'The window is big. Ming can see out of it.', zh: '窗子很大。明明能从这儿往外看。' },
      { art: 'home|dad,lili|house|?', en: 'The sun comes in the window. It makes a bright line on the floor.', zh: '阳光从窗子照进来。地板上留下一道亮线。' },
      { art: 'home|dad,lili|house|·', en: 'The house is nice. It is warm in winter.', zh: '房子很好。冬天屋里很暖和。' },
      { art: 'home|dad,lili|house|!', en: 'Ming lives in the house. His room is near the window.', zh: '明明住在这座房子里。他的房间挨着窗。' },
      { art: 'home|dad,lili|house|♥', en: 'Ming looks out the window. He sees the hill and the road.', zh: '明明往窗外看。他看见小山和那条路。' },
      { art: 'home|dad,lili|house|★', en: 'Ming sees the hill. A tree stands on it.', zh: '明明看见小山。山上立着一棵树。' },
      { art: 'home|dad,lili|house|…', en: 'A house with a window. At night the window is dark.', zh: '有窗的房子。到了夜里窗子暗下来。' },
      { art: 'home|dad,lili|house|·', en: 'Ming likes the window. He sits there to read.', zh: '明明喜欢这扇窗。他坐在那儿读书。' },
      { art: 'home|dad,lili|house|♥', en: 'The house is warm. Mom is in the kitchen.', zh: '房子里暖暖的。妈妈在厨房。' },
      { art: 'home|dad,lili|house|·', en: 'Home is good. The light is on.', zh: '家真好。灯亮着。' },
      { art: 'home|dad,lili|house|…', en: 'Ming likes the house. He is glad to be home.', zh: '明明喜欢这座房子。回到家他很高兴。' }
    ],
    quiz: [
      { q: '下面哪个词在这一本里读到过？', opts: ['毛巾', '线', '黄色'], a: 1, kind: 'recall' },
      { q: '房子里有什么？', opts: ['一辆车', '一条河', '一扇大窗户'], a: 2, kind: 'infer' },
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
      { art: 'home|ming,grandma|coin|·', en: 'Ming has coins. They are in a small box.', zh: '明明有一些硬币。它们装在一只小盒子里。' },
      { art: 'home|ming,grandma|coin|♪', en: 'The coins are small. Some are brown, some are bright.', zh: '硬币小小的。有的发棕，有的亮亮的。' },
      { art: 'home|ming,grandma|coin|👀', en: 'Ming counts the coins. He puts them in a line.', zh: '明明数硬币。他把它们排成一排。' },
      { art: 'home|ming,grandma|coin|?', en: 'One coin, two coins, three coins. He points to each one.', zh: '一枚、两枚、三枚。他一个一个点过去。' },
      { art: 'home|ming,grandma|coin|·', en: 'Ming counts again. He starts from one again.', zh: '明明又数一遍。他从一开始重新数。' },
      { art: 'home|ming,grandma|coin|!', en: 'Now there are more coins. Grandma gives him two more.', zh: '现在硬币变多了。奶奶又给了他两枚。' },
      { art: 'home|ming,grandma|coin|♥', en: 'Ming counts them all. He goes slowly this time.', zh: '明明把硬币全数了一遍。这次他数得很慢。' },
      { art: 'home|ming,grandma|coin|★', en: 'The coins are here. He puts them back in the box.', zh: '硬币都在这儿。他把它们放回盒子里。' },
      { art: 'home|ming,grandma|coin|…', en: 'Count the coins. It takes care.', zh: '数硬币。得细心才行。' },
      { art: 'home|ming,grandma|coin|·', en: 'Ming likes to count. He counts the plates too.', zh: '明明喜欢数数。他连盘子也数。' },
      { art: 'home|ming,grandma|coin|♥', en: 'Ming keeps the coins. He will buy a small toy.', zh: '明明把硬币收好。他要买一个小玩具。' },
      { art: 'home|ming,grandma|coin|·', en: 'Counting is fun. He shows Grandma how many.', zh: '数数真好玩。他给奶奶看一共有多少。' },
      { art: 'home|ming,grandma|coin|…', en: 'Ming will count more tomorrow. He wants to get it right.', zh: '明天明明还要数更多。他想数得一点不差。' }
    ],
    quiz: [
      { q: '下面哪个词在这一本里读到过？', opts: ['老师', '线', '歌'], a: 1, kind: 'recall' },
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
      { art: '🪟', en: 'window', zh: '窗户' }
    ],
    sight: ['knows', 'quiet'],
    newWords: [
      { w: 'shout', zh: '喊' }
    ],
    pages: [
      { art: 'night|lili,grandpa|night|·', en: 'Night is here. The house is dark.', zh: '夜里了。屋子里黑黑的。' },
      { art: 'night|lili,grandpa|night|♪', en: 'All is quiet. Even the dog is quiet.', zh: '四下静悄悄的。连狗都不出声。' },
      { art: 'night|lili,grandpa|night|👀', en: 'Ming is in bed. The window is closed.', zh: '明明躺在床上。窗子关着。' },
      { art: 'night|lili,grandpa|night|?', en: 'A loud sound is outside. It comes again.', zh: '外面传来一声大响。它又响了一次。' },
      { art: 'night|lili,grandpa|night|·', en: 'Ming is up. He sits up in bed.', zh: '明明醒了。他在床上坐起来。' },
      { art: 'night|lili,grandpa|night|!', en: 'What was that sound? He listens hard.', zh: '那是什么声音？他仔细听。' },
      { art: 'night|lili,grandpa|night|♥', en: 'Ming looks out the window. He sees the trees.', zh: '明明往窗外看。他看见了那些树。' },
      { art: 'night|lili,grandpa|night|★', en: 'It was the wind. It pushes at the window.', zh: '原来是风。风在推窗子。' },
      { art: 'night|lili,grandpa|night|…', en: 'Ming is not afraid. He knows what it is now.', zh: '明明不害怕了。他现在知道是什么了。' },
      { art: 'night|lili,grandpa|night|·', en: 'Ming goes back to bed. He is warm again.', zh: '明明躺回去。身上又暖和了。' },
      { art: 'night|lili,grandpa|night|♥', en: 'A loud shout at night. It was only the wind.', zh: '夜里的一声喊。原来只是风。' },
      { art: 'night|lili,grandpa|night|·', en: 'The wind can be loud. But it can not come in.', zh: '风可以很响。可它进不来。' },
      { art: 'night|lili,grandpa|night|…', en: 'Ming sleeps well. In the morning he tells Mom.', zh: '明明睡得很好。早上他讲给妈妈听。' }
    ],
    quiz: [
      { q: '下面哪个词在这一本里读到过？', opts: ['街道', '狗', '树'], a: 1, kind: 'recall' },
      { q: '那个大声音是什么？', opts: ['风', '有人喊叫', '打雷'], a: 0, kind: 'infer' },
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
      { art: 'table|grandma,mom|house|·', en: 'This is a house. It has ow.', zh: '这是 house。里面有 ow。' },
      { art: 'table|grandma,mom|house|♪', en: 'This is a cow. It has ow too.', zh: '这是 cow。里面也有 ow。' },
      { art: 'table|grandma,mom|house|👀', en: 'House and cow.', zh: 'house 和 cow。' },
      { art: 'table|grandma,mom|house|?', en: 'Both have the "ow" sound. Listen to the two words.', zh: '两个词都有 ow 的音。听听这两个词。' },
      { art: 'table|grandma,mom|house|·', en: 'Say "house". Say it slow.', zh: '读 house。慢慢读。' },
      { art: 'table|grandma,mom|house|!', en: 'Say "cow". Say it again.', zh: '读 cow。再读一遍。' },
      { art: 'table|grandma,mom|house|♥', en: 'House is not cow. They are different things.', zh: 'house 不是 cow。它们是不同的东西。' },
      { art: 'table|grandma,mom|house|★', en: 'The "ow" sounds the same. The first sounds do not.', zh: 'ow 读音一样。开头的音不一样。' },
      { art: 'table|grandma,mom|house|…', en: 'You can say both. Say them together.', zh: '两个你都会读。连起来读一读。' },
      { art: 'table|grandma,mom|house|·', en: 'House, cow, house, cow.', zh: 'house，cow，house，cow。' },
      { art: 'table|grandma,mom|house|♥', en: 'Good!', zh: '真棒！' },
      { art: 'table|grandma,mom|house|·', en: 'A house and a cow. Now find two more.', zh: '一座房子和一头牛。再找两个这样的词。' },
      { art: 'table|grandma,mom|house|…', en: 'Now say them together. Say them one more time.', zh: '现在连起来读。再读一遍。' }
    ],
    quiz: [
      { q: '下面哪个词在这一本里读到过？', opts: ['房子', '星星', '毛巾'], a: 0, kind: 'recall' },
      { q: '这一本在练什么？', opts: ['「ou」的音', '「oi」的音', '「ow」的音'], a: 2, kind: 'infer' },
      { q: '遇到带 ow 的单词，你会怎么读？', opts: ['分开读两个字母', '把 ow 读成一个音', '跳过去'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b94', lv: 'L8', tag: '小知识', title: 'Why the Moon Looks Round', zh: '月亮为什么圆',
    emoji: '🔭', color: '#FAD3B6',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。认读 1 个新词（今晚）。',
    trap: 'ou / ow 读 /aʊ/，oi / oy 读 /ɔɪ/；长句按意思分组读，别逐词蹦。',
    summary: '《月亮为什么圆》：这一本从一件小事讲起，说说为什么会这样。读前先看词卡（今晚）；读的时候留意先看到什么、为什么会这样、后来怎么弄明白。',
    retell: '合上书，按「先看到什么 → 为什么会这样 → 后来怎么弄明白」讲一遍。',
    think: '说说月亮为什么有时候圆、有时候弯。',
    pre: [
      { art: '⏰', en: 'tonight', zh: '今晚' },
      { art: '🌙', en: 'moon', zh: '月亮' },
      { art: '☀️', en: 'sun', zh: '太阳' }
    ],
    sight: ['friend'],
    newWords: [
      { w: 'tonight', zh: '今晚' }
    ],
    pages: [
      { art: 'kitchen|grandpa,dad|mooncake|·', en: 'The moon looks round. It is far away in the sky.', zh: '月亮看起来圆圆的。它远在天上。' },
      { art: 'kitchen|grandpa,dad|mooncake|♪', en: 'Why does the moon look round?', zh: '月亮为什么看起来是圆的？' },
      { art: 'kitchen|grandpa,dad|mooncake|👀', en: 'We see one side of the moon. The sun lights that side.', zh: '我们只看见月亮的一面。太阳照亮了那一面。' },
      { art: 'kitchen|grandpa,dad|mooncake|?', en: 'The sun is bright on that side. The rest is dark.', zh: '太阳把那一面照得很亮。剩下的部分是暗的。' },
      { art: 'kitchen|grandpa,dad|mooncake|·', en: 'So we see a round moon, big like a mooncake. That is why it looks full.', zh: '所以我们看见圆圆的月亮，像月饼一样。这就是它看着圆满的缘故。' },
      { art: 'kitchen|grandpa,dad|mooncake|!', en: 'Sometimes the moon looks small. We see only a thin part.', zh: '有时候月亮看起来很小。我们只看见细细的一牙。' },
      { art: 'kitchen|grandpa,dad|mooncake|♥', en: 'But it is the same moon. Nothing about it changes.', zh: '可它还是同一个月亮。它本身并没有变。' },
      { art: 'kitchen|grandpa,dad|mooncake|★', en: 'We see a different part. The dark part grows.', zh: '我们看见的是不同的部分。暗的那部分在变大。' },
      { art: 'kitchen|grandpa,dad|mooncake|…', en: 'Why the moon looks round. Now you can tell a friend.', zh: '月亮为什么圆。现在你可以讲给朋友听。' },
      { art: 'kitchen|grandpa,dad|mooncake|·', en: 'The moon is far away. It is much bigger than it looks.', zh: '月亮离我们很远。它比看上去大得多。' },
      { art: 'kitchen|grandpa,dad|mooncake|♥', en: 'Look at the moon tonight. See which part is bright.', zh: '今晚看看月亮。看清哪一块是亮的。' },
      { art: 'kitchen|grandpa,dad|mooncake|·', en: 'The moon is always there. In the day it is hard to see.', zh: '月亮一直都在。白天不容易看见它。' },
      { art: 'kitchen|grandpa,dad|mooncake|…', en: 'Look at it night after night. You will see it change.', zh: '一夜一夜地看下去。你会看见它变化。' }
    ],
    quiz: [
      { q: '下面哪个词在这一本里读到过？', opts: ['酸奶', '树', '月饼'], a: 2, kind: 'recall' },
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
    sight: [],
    newWords: [
      { w: 'south', zh: '南方' },
      { w: 'noodle', zh: '面条' }
    ],
    pages: [
      { art: 'kitchen|mom,ming|noodle|·', en: 'Some people eat noodles. In the south, many do.', zh: '有些人吃面条。在南方，很多人都吃。' },
      { art: 'kitchen|mom,ming|noodle|♪', en: 'The noodles are long. They are thin and soft.', zh: '面条长长的。又细又软。' },
      { art: 'kitchen|mom,ming|noodle|👀', en: 'Noodles are good to eat. They are warm in winter.', zh: '面条很好吃。冬天吃着暖和。' },
      { art: 'kitchen|mom,ming|noodle|?', en: 'People make noodles. They make it into long lines.', zh: '人们做面条。把面团弄成细细的长条。' },
      { art: 'kitchen|mom,ming|noodle|·', en: 'The noodles go in the pot. The water boils.', zh: '面条下进锅里。水开了。' },
      { art: 'kitchen|mom,ming|noodle|!', en: 'The noodles are ready soon. They do not take long.', zh: '面条很快就熟。用不了多久。' },
      { art: 'kitchen|mom,ming|noodle|♥', en: 'People eat the noodles. They eat them hot.', zh: '人们吃面条。趁热吃。' },
      { art: 'kitchen|mom,ming|noodle|★', en: 'Long noodles are fun. They are hard to pick up.', zh: '长面条有意思。不太好夹起来。' },
      { art: 'kitchen|mom,ming|noodle|…', en: 'Noodles in the south. Each town has its own way.', zh: '南方的面条。每个镇子都有自己的做法。' },
      { art: 'kitchen|mom,ming|noodle|·', en: 'Ming likes noodles too. He eats them with Grandma.', zh: '明明也喜欢面条。他和奶奶一起吃。' },
      { art: 'kitchen|mom,ming|noodle|♥', en: 'Noodles are warm and good. They are best on a cold day.', zh: '面条又暖又香。天冷的时候最好吃。' },
      { art: 'kitchen|mom,ming|noodle|·', en: 'You can eat a noodle too. Take one and taste it.', zh: '你也可以尝一根。夹起来尝尝。' },
      { art: 'kitchen|mom,ming|noodle|…', en: 'Noodles are good food. Ming asks for more.', zh: '面条是好吃的。明明还要再来一碗。' }
    ],
    quiz: [
      { q: '下面哪个词在这一本里读到过？', opts: ['面条', '蜜蜂', '酸奶'], a: 0, kind: 'recall' },
      { q: '面条是什么样的？', opts: ['长长的', '圆圆的', '方方的'], a: 0, kind: 'infer' },
      { q: '吃一种新食物，你会怎么做？', opts: ['尝一尝，看看喜不喜欢', '一口不吃', '只吃一种'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b96', lv: 'L8', tag: '复习', title: 'All Together Tonight', zh: '今晚大家在一起',
    emoji: '🏮', color: '#E8D9B5',
    track: 'review',
    goal: '把本级和前面级别的词再读一遍、串成一个故事。认读 1 个新词（汤）。',
    trap: 'ou / ow 读 /aʊ/，oi / oy 读 /ɔɪ/；长句按意思分组读，别逐词蹦。',
    summary: '《今晚大家在一起》：这是一个完整的小故事。读前先看词卡（汤）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，按做事情的顺序讲一遍，至少用上三个本本词卡。',
    think: '说说你和家人在一起的一个晚上。',
    pre: [
      { art: '🍲', en: 'soup', zh: '汤' },
      { art: '🏙️', en: 'town', zh: '小镇' },
      { art: '🪟', en: 'window', zh: '窗户' }
    ],
    sight: ['knows', 'laugh', 'quiet'],
    newWords: [
      { w: 'soup', zh: '汤' }
    ],
    pages: [
      { art: 'library|dad,lili|town|·', en: 'The town is quiet. The shops are closed.', zh: '镇上安安静静。小店都关门了。' },
      { art: 'library|dad,lili|town|♪', en: 'Everyone is together. No one is away tonight.', zh: '大家都在一起。今晚没有人不在。' },
      { art: 'library|dad,lili|town|👀', en: 'The houses have lights. Each window is bright.', zh: '家家亮着灯。每扇窗都亮堂堂的。' },
      { art: 'library|dad,lili|town|?', en: 'Ming is with the family. Grandpa talks about the farm.', zh: '明明和家人在一起。爷爷讲起农场的事。' },
      { art: 'library|dad,lili|town|·', en: 'They eat together. There are dumplings and soup.', zh: '他们一起吃饭。有饺子，有汤。' },
      { art: 'library|dad,lili|town|!', en: 'They talk and laugh. Ming shows them his drawing.', zh: '大家有说有笑。明明把画拿给大家看。' },
      { art: 'library|dad,lili|town|♥', en: 'The town is warm tonight. The wind is cold.', zh: '今晚镇上很暖。风是凉的。' },
      { art: 'library|dad,lili|town|★', en: 'All together tonight. Grandma sits by Ming.', zh: '今晚大家在一起。奶奶坐在明明旁边。' },
      { art: 'library|dad,lili|town|…', en: 'The family is happy. Ming looks at them all.', zh: '一家人很开心。明明看着他们每一个人。' },
      { art: 'library|dad,lili|town|·', en: 'The town is a good place. He knows every street.', zh: '镇子是个好地方。每条街他都认得。' },
      { art: 'library|dad,lili|town|♥', en: 'Ming likes the town. He likes the market and the park.', zh: '明明喜欢这个镇子。他喜欢市场和公园。' },
      { art: 'library|dad,lili|town|·', en: 'Together is good. They will do this again.', zh: '在一起真好。他们以后还要这样。' },
      { art: 'library|dad,lili|town|…', en: 'A good night in the town. Ming does not want it to end.', zh: '镇上美好的一夜。明明不想让它结束。' }
    ],
    quiz: [
      { q: '下面哪个词在这一本里读到过？', opts: ['手推车', '底部', '图画'], a: 2, kind: 'recall' },
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
      { art: '🎒', en: 'bag', zh: '书包' },
      { art: '📦', en: 'train', zh: '火车' }
    ],
    sight: ['flies'],
    newWords: [
      { w: 'station', zh: '车站' },
      { w: 'photo', zh: '照片' }
    ],
    pages: [
      { art: 'home|ming,grandma|photo|·', en: 'Ming is at the station. The train comes late.', zh: '明明在车站。火车晚点了。' },
      { art: 'home|ming,grandma|photo|♪', en: 'Ming has a photo. He keeps it in his bag.', zh: '明明带着一张照片。他把它收在包里。' },
      { art: 'home|ming,grandma|photo|👀', en: 'The photo is of the family. It is from last autumn.', zh: '照片上是全家人。是去年秋天拍的。' },
      { art: 'home|ming,grandma|photo|?', en: 'Ming looks at the photo. He finds Grandma in it.', zh: '明明看着照片。他在里面找到了奶奶。' },
      { art: 'home|ming,grandma|photo|·', en: 'The family is in the photo. They stand in front of the house.', zh: '全家人都在照片里。他们站在房子前面。' },
      { art: 'home|ming,grandma|photo|!', en: 'Grandma is in the photo. She holds a big cake.', zh: '奶奶也在照片里。她捧着一个大蛋糕。' },
      { art: 'home|ming,grandma|photo|♥', en: 'Ming is in the photo too. He was much smaller then.', zh: '明明也在照片里。那时候他小得多。' },
      { art: 'home|ming,grandma|photo|★', en: 'Ming takes it out again. He wants one more look.', zh: '明明又把它拿出来。他想再看一眼。' },
      { art: 'home|ming,grandma|photo|…', en: 'The wind comes in. The photo flies up.', zh: '一阵风刮进来。照片飞了起来。' },
      { art: 'home|ming,grandma|photo|·', en: 'It falls by a bench. Ming runs after it.', zh: '它落在长椅边。明明追过去。' },
      { art: 'home|ming,grandma|photo|♥', en: 'A man picks it up. He gives it back.', zh: '一位叔叔替他捡起来。把照片还给他。' },
      { art: 'home|ming,grandma|photo|·', en: 'Ming says thank you. He checks the photo.', zh: '明明道了谢。他检查了一下照片。' },
      { art: 'home|ming,grandma|photo|…', en: 'It is clean. He puts it deep in his bag.', zh: '照片干干净净。他把它塞进包的最里面。' },
      { art: 'home|ming,grandma|photo|?', en: 'Ming likes the photo. At home he will show Grandma.', zh: '明明喜欢这张照片。回家要给奶奶看。' }
    ],
    quiz: [
      { q: '下面哪个词在这一本里读到过？', opts: ['蛋糕', '天空', '石头'], a: 0, kind: 'recall' },
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
      { art: 'library|lili,grandpa|question|·', en: 'A question is on the board. The teacher put it there.', zh: '黑板上有一道题。是老师写上去的。' },
      { art: 'library|lili,grandpa|question|♪', en: 'The question is hard. It has many words.', zh: '这道题很难。有好长一串词。' },
      { art: 'library|lili,grandpa|question|👀', en: 'The class looks at it. The class is quiet.', zh: '全班都看着它。教室里静悄悄的。' },
      { art: 'library|lili,grandpa|question|?', en: 'No one answers at first. Ming does not put up his hand.', zh: '一开始没人回答。明明也没举手。' },
      { art: 'library|lili,grandpa|question|·', en: 'Ming reads the question again. He reads it word by word.', zh: '明明把题目又读了一遍。他一个词一个词地读。' },
      { art: 'library|lili,grandpa|question|!', en: 'Ming finds a small part. It is one word he knows.', zh: '明明找到一小处。是一个他认识的词。' },
      { art: 'library|lili,grandpa|question|♥', en: 'Ming thinks about that part. He writes it on his paper.', zh: '明明就着这一小处想。他把它写在纸上。' },
      { art: 'library|lili,grandpa|question|★', en: 'Ming raises a hand. The teacher asks him to try.', zh: '明明举起手。老师请他试一试。' },
      { art: 'library|lili,grandpa|question|…', en: 'Ming gives an answer. He says it slowly.', zh: '明明说出了答案。他说得很慢。' },
      { art: 'library|lili,grandpa|question|·', en: 'The answer is right! The teacher smiles.', zh: '答案对了！老师笑了。' },
      { art: 'library|lili,grandpa|question|♥', en: 'Ming sits down again. He is glad.', zh: '明明重新坐下。心里很高兴。' },
      { art: 'library|lili,grandpa|question|·', en: 'A good answer starts small. He found one word first.', zh: '好答案从一小处开始。他先找到了一个词。' },
      { art: 'library|lili,grandpa|question|…', en: 'The class is glad. They clap for Ming.', zh: '全班都很高兴。大家给明明鼓掌。' },
      { art: 'library|lili,grandpa|question|?', en: 'Ming is glad too. He will try the next hard one.', zh: '明明也很高兴。下一道难题他还想试。' }
    ],
    quiz: [
      { q: '下面哪个词在这一本里读到过？', opts: ['影子', '班', '蛇'], a: 1, kind: 'recall' },
      { q: '明明是怎么答对的？', opts: ['别人告诉的', '找到一个小地方，慢慢想出来的', '随便猜的'], a: 1, kind: 'infer' },
      { q: '遇到一个很难的问题，你会怎么做？', opts: ['直接放弃', '随便猜', '先找一个小地方，一点点想'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b99', lv: 'L9', tag: '观察', title: 'The Shadow in the Field', zh: '田里的影子',
    emoji: '🌾', color: '#CDE7C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 4 个新词（田地、影子、穿过、中午）。',
    trap: 'kn / wr / ph 里的第一个字母不发音；读长句时先找主句，再读从句。',
    summary: '《田里的影子》：这是一个完整的小故事。读前先看词卡（田地、影子、穿过、中午）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '不看书写一段 5 句的口头小结，再说说这件事让你想到什么。',
    think: '说说你观察过的影子变化。',
    pre: [
      { art: '🌾', en: 'field', zh: '田地' },
      { art: '🌑', en: 'shadow', zh: '影子' },
      { art: '💡', en: 'across', zh: '穿过' },
      { art: '⏰', en: 'noon', zh: '中午' },
      { art: '☀️', en: 'sun', zh: '太阳' },
      { art: '🌿', en: 'grass', zh: '草' }
    ],
    sight: [],
    newWords: [
      { w: 'field', zh: '田地' },
      { w: 'shadow', zh: '影子' },
      { w: 'across', zh: '穿过' },
      { w: 'noon', zh: '中午' }
    ],
    pages: [
      { art: 'night|grandma,mom|shadow|·', en: 'Ming is in the field. It is a warm morning.', zh: '明明在田里。这是个暖和的早晨。' },
      { art: 'night|grandma,mom|shadow|♪', en: 'The sun is high. There are no clouds.', zh: '太阳高高挂着。天上没有云。' },
      { art: 'night|grandma,mom|shadow|👀', en: 'Ming sees a shadow. It is dark on the grass.', zh: '明明看见一个影子。草地上黑黑的一块。' },
      { art: 'night|grandma,mom|shadow|?', en: 'The shadow follows Ming. It stays right behind him.', zh: '影子跟着明明。就贴在他身后。' },
      { art: 'night|grandma,mom|shadow|·', en: 'When Ming moves, it moves. He takes a step and it takes one too.', zh: '明明一动，它也动。他迈一步，它也迈一步。' },
      { art: 'night|grandma,mom|shadow|!', en: 'The shadow is long in the morning. It goes far across the field.', zh: '早晨影子很长。一直伸到田的那头。' },
      { art: 'night|grandma,mom|shadow|♥', en: 'At noon the shadow is short. It sits right under him.', zh: '中午影子变短。就缩在脚底下。' },
      { art: 'night|grandma,mom|shadow|★', en: 'The shadow grows again. The sun is going down.', zh: '影子又长起来。太阳在往西落。' },
      { art: 'night|grandma,mom|shadow|…', en: 'Why does the shadow change? Ming asks Grandma.', zh: '影子为什么会变？明明问奶奶。' },
      { art: 'night|grandma,mom|shadow|·', en: 'The sun moves across the sky. It is not high now.', zh: '太阳在天上移动。现在它不高了。' },
      { art: 'night|grandma,mom|shadow|♥', en: 'The shadow changes with the sun. That is the answer.', zh: '影子跟着太阳变。这就是答案。' },
      { art: 'night|grandma,mom|shadow|·', en: 'Ming marks the two places. He will come back at noon.', zh: '明明把两个位置记下来。中午他要再来看。' },
      { art: 'night|grandma,mom|shadow|…', en: 'Ming watches the shadow. He wants to check his answer.', zh: '明明盯着影子看。他想验一验自己的答案。' },
      { art: 'night|grandma,mom|shadow|?', en: 'At noon it is short again. Grandma was right.', zh: '到了中午它又变短了。奶奶说得对。' }
    ],
    quiz: [
      { q: '下面哪个词在这一本里读到过？', opts: ['草', '衬衫', '楼梯'], a: 0, kind: 'recall' },
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
      { art: '📦', en: 'cart', zh: '手推车' },
      { art: '🍞', en: 'bread', zh: '面包' }
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
      { art: 'farm|grandpa,dad|wheat|·', en: 'Wheat grows in the field. It was planted in winter.', zh: '小麦长在田里。是冬天种下的。' },
      { art: 'farm|grandpa,dad|wheat|♪', en: 'The wheat is tall now. It is taller than Ming.', zh: '麦子现在很高。比明明还高。' },
      { art: 'farm|grandpa,dad|wheat|👀', en: 'The wheat is yellow. The green has gone.', zh: '麦子黄了。绿色不见了。' },
      { art: 'farm|grandpa,dad|wheat|?', en: 'It is time to harvest. The farmer comes early.', zh: '该收割了。农民一早就来了。' },
      { art: 'farm|grandpa,dad|wheat|·', en: 'The farmer cuts the wheat. He uses a sharp tool.', zh: '农民割麦子。他用一把锋利的工具。' },
      { art: 'farm|grandpa,dad|wheat|!', en: 'They gather the wheat. They put it in a cart.', zh: '他们把麦子收拢。装上手推车。' },
      { art: 'farm|grandpa,dad|wheat|♥', en: 'The wheat is dry now. The sun made it dry.', zh: '麦子现在干了。是太阳晒干的。' },
      { art: 'farm|grandpa,dad|wheat|★', en: 'The wheat is good. The heads are full.', zh: '麦子长得很好。麦穗都饱满了。' },
      { art: 'farm|grandpa,dad|wheat|…', en: 'The farmer looks at the cart. It is full too.', zh: '农民看着手推车。车也装满了。' },
      { art: 'farm|grandpa,dad|wheat|·', en: 'The harvest is big this year. He is glad.', zh: '今年收成很好。他很高兴。' },
      { art: 'farm|grandpa,dad|wheat|♥', en: 'They work hard for it. Their backs hurt.', zh: '他们为它辛苦了一整季。背都酸了。' },
      { art: 'farm|grandpa,dad|wheat|·', en: 'The wheat becomes food. It is made into bread.', zh: '麦子变成了食物。被做成面包。' },
      { art: 'farm|grandpa,dad|wheat|…', en: 'We eat the bread from wheat. Ming eats a piece.', zh: '我们吃麦子做的面包。明明吃了一块。' },
      { art: 'farm|grandpa,dad|wheat|?', en: 'The harvest feeds many. Now Ming knows why they work.', zh: '收成养活很多人。明明这下懂了他们为什么辛苦。' }
    ],
    quiz: [
      { q: '下面哪个词在这一本里读到过？', opts: ['火车', '绿色', '石头'], a: 1, kind: 'recall' },
      { q: '小麦什么时候收割？', opts: ['刚种下的时候', '长得又高又黄的时候', '下雨的时候'], a: 1, kind: 'infer' },
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
      { art: '📦', en: 'can', zh: '罐子' },
      { art: '📦', en: 'cart', zh: '手推车' }
    ],
    sight: ['carries'],
    newWords: [
      { w: 'knife', zh: '刀' },
      { w: 'wheel', zh: '轮子' },
      { w: 'touch', zh: '摸' }
    ],
    pages: [
      { art: 'library|mom,ming|knife|·', en: 'A knife and a wheel. Both are on the table.', zh: '一把刀和一个轮子。两样都放在桌上。' },
      { art: 'library|mom,ming|knife|♪', en: 'The knife is sharp. It can cut an apple.', zh: '刀很快。它能切苹果。' },
      { art: 'library|mom,ming|knife|👀', en: 'The wheel is round. It turns on a cart.', zh: '轮子是圆的。它装在手推车上转。' },
      { art: 'library|mom,ming|knife|?', en: 'The knife cuts things. Grandma uses it for the pork.', zh: '刀用来切东西。奶奶用它切猪肉。' },
      { art: 'library|mom,ming|knife|·', en: 'The wheel turns. The cart goes down the road.', zh: '轮子一转。手推车顺着路走。' },
      { art: 'library|mom,ming|knife|!', en: 'Both help people. But they help in different ways.', zh: '两样都帮人。可帮的方式不一样。' },
      { art: 'library|mom,ming|knife|♥', en: 'But the knife can hurt. Ming once cut his hand.', zh: '可刀会伤人。明明曾经割到过手。' },
      { art: 'library|mom,ming|knife|★', en: 'Be careful with the knife. Grandma keeps it high.', zh: '用刀要小心。奶奶把它放在高处。' },
      { art: 'library|mom,ming|knife|…', en: 'The wheel is safe to touch. Ming gives it a push.', zh: '轮子摸起来安全。明明推了它一下。' },
      { art: 'library|mom,ming|knife|·', en: 'One cuts, one carries. You can see the difference.', zh: '一个切，一个运。差别一眼就看得出。' },
      { art: 'library|mom,ming|knife|♥', en: 'Ming puts the wheel back on the cart. Grandma puts the knife away.', zh: '明明把轮子装回手推车。奶奶把刀收了起来。' },
      { art: 'library|mom,ming|knife|·', en: 'He watches her cut the pork. She does it slowly.', zh: '他看奶奶切猪肉。她切得很慢。' },
      { art: 'library|mom,ming|knife|…', en: 'Ming asks to try. Grandma says he can watch today.', zh: '明明想试一试。奶奶说今天先看着。' },
      { art: 'library|mom,ming|knife|?', en: 'A knife and a wheel. Ming pushes the cart to the gate.', zh: '一把刀和一个轮子。明明推着车到门口。' }
    ],
    quiz: [
      { q: '下面哪个词在这一本里读到过？', opts: ['二', '老师', '猪肉'], a: 2, kind: 'recall' },
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
      { art: 'library|dad,lili|answer|👀', en: 'The scientist looks for an answer. She puts seeds in three pots.', zh: '科学家自己找答案。她把种子种进三只花盆。' },
      { art: 'library|dad,lili|answer|?', en: 'The scientist tries many times. One pot gets no water.', zh: '她试了很多次。有一只盆不浇水。' },
      { art: 'library|dad,lili|answer|·', en: 'The answer is not easy. Two of the pots do not grow.', zh: '答案并不好找。两只盆里都没长出来。' },
      { art: 'library|dad,lili|answer|!', en: 'The scientist does not stop. She writes down what she sees.', zh: '科学家没有停。她把看到的都记下来。' },
      { art: 'library|dad,lili|answer|♥', en: 'The scientist writes it down. Each day she writes a note.', zh: '她天天记。每天都写一张小纸条。' },
      { art: 'library|dad,lili|answer|★', en: 'At last, the answer comes. The wet pot has a green stem.', zh: '最后答案来了。浇水的那只盆冒出了绿茎。' },
      { art: 'library|dad,lili|answer|…', en: 'The answer is good. Seeds need water to grow.', zh: '答案很清楚。种子需要水才能长。' },
      { art: 'library|dad,lili|answer|·', en: 'She tells the class what she found. They look at the three pots.', zh: '她把发现讲给班上的同学听。大家看那三只花盆。' },
      { art: 'library|dad,lili|answer|♥', en: 'The three weeks are on her notes. She counts them with the class.', zh: '三个星期都记在纸条上。她带着全班一起数。' },
      { art: 'library|dad,lili|answer|·', en: 'The two dry pots are there too. She tells the class why they did not grow.', zh: '两只干盆也摆在那儿。她讲给同学听它们为什么没长。' },
      { art: 'library|dad,lili|answer|…', en: 'Ming asks about the dry pots. She writes his question down.', zh: '明明问起那两只干盆。她把问题记了下来。' },
      { art: 'library|dad,lili|answer|?', en: 'Ming takes a pot home. He puts a seed in it that night.', zh: '明明带了一只盆回家。当晚就种下一粒种子。' }
    ],
    quiz: [
      { q: '下面哪个词在这一本里读到过？', opts: ['风', '绿色', '蚂蚁'], a: 1, kind: 'recall' },
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
      { art: 'street|ming,grandma|museum|·', en: 'Ming is in a museum. It is a big old house.', zh: '明明在博物馆里。这是一座很大的老房子。' },
      { art: 'street|ming,grandma|museum|♪', en: 'The museum is quiet. People do not shout.', zh: '博物馆很安静。没有人大声说话。' },
      { art: 'street|ming,grandma|museum|👀', en: 'Ming walks and looks. He stays close to Grandma.', zh: '明明边走边看。他紧跟着奶奶。' },
      { art: 'street|ming,grandma|museum|?', en: 'Old things are here. Some come from long ago.', zh: '这里摆着老东西。有些是很久以前的。' },
      { art: 'street|ming,grandma|museum|·', en: 'A very old pot is here. It has a broken side.', zh: '有一只很旧的锅。它的一边破了。' },
      { art: 'street|ming,grandma|museum|!', en: 'Ming looks at the pot. He can not touch it.', zh: '明明看着那只锅。他不能摸它。' },
      { art: 'street|ming,grandma|museum|♥', en: 'People used it long ago. They cooked rice in it.', zh: '很久以前的人用过它。他们用它煮米饭。' },
      { art: 'street|ming,grandma|museum|★', en: 'Ming thinks about them. He pictures a family at a table.', zh: '明明想着那些人。他想象一家人围在桌边。' },
      { art: 'street|ming,grandma|museum|…', en: 'The museum keeps old things. A case keeps them safe.', zh: '博物馆保存老东西。展柜让它们不受损。' },
      { art: 'street|ming,grandma|museum|·', en: 'Grandma tells him not to run. He walks slowly.', zh: '奶奶叫他别跑。他慢慢走。' },
      { art: 'street|ming,grandma|museum|♥', en: 'Old things tell stories. This pot tells one about food.', zh: '老东西会讲故事。这只锅讲的是吃饭的事。' },
      { art: 'street|ming,grandma|museum|·', en: 'Ming learns from them. He did not know people cooked like that.', zh: '明明从它们那儿学到东西。他不知道从前是那样做饭的。' },
      { art: 'street|ming,grandma|museum|…', en: 'Ming wants to come back. He asks Grandma to bring him again.', zh: '明明还想再来。他请奶奶再带他来一次。' },
      { art: 'street|ming,grandma|museum|?', en: 'The museum is a good place. He will look at the other rooms.', zh: '博物馆是个好地方。他还要去看别的展厅。' }
    ],
    quiz: [
      { q: '下面哪个词在这一本里读到过？', opts: ['翅膀', '博物馆', '树'], a: 1, kind: 'recall' },
      { q: '博物馆里的东西有什么特别？', opts: ['它们很老，是很久以前的人用过的', '它们会动', '它们很新'], a: 0, kind: 'infer' },
      { q: '在博物馆里，你会怎么做？', opts: ['安静看，想一想它背后的事', '大声喧哗', '乱摸乱碰'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b104', lv: 'L9', tag: '方法', title: 'Write It Down', zh: '把它记下来',
    emoji: '✏️', color: '#F2E2A8',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。不引入新词，全部是读过的词。',
    trap: 'kn / wr / ph 里的第一个字母不发音；读长句时先找主句，再读从句。',
    summary: '《把它记下来》：这是一个完整的小故事。读前先看词卡，都是学过的词；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '不看书写一段 5 句的口头小结，再说说这件事让你想到什么。',
    think: '说说你写下来记着的一件事。',
    pre: [
      { art: '📋', en: 'board', zh: '木板' },
      { art: '🎁', en: 'gift', zh: '礼物' }
    ],
    sight: [],
    newWords: [

    ],
    pages: [
      { art: 'school|lili,grandpa|board|·', en: 'A board is on the wall. Ming writes on it with a pen.', zh: '墙上挂着一块板。明明用笔在上面写。' },
      { art: 'school|lili,grandpa|board|♪', en: 'Ming has a good idea. He wants to make Grandpa a gift.', zh: '明明有个好主意。他想给爷爷做一件礼物。' },
      { art: 'school|lili,grandpa|board|👀', en: 'Ming writes it down. He puts three words on the board.', zh: '明明把它写下来。他在板上写了三个词。' },
      { art: 'school|lili,grandpa|board|?', en: 'Writing helps us remember. The idea will stay there.', zh: '写下来能帮我们记住。主意就留在那儿了。' },
      { art: 'school|lili,grandpa|board|·', en: 'Ming writes more. He adds what he needs to buy.', zh: '明明又写了一些。他添上要买的东西。' },
      { art: 'school|lili,grandpa|board|!', en: 'The board is full now. There is no room for more.', zh: '板子写满了。再没地方写了。' },
      { art: 'school|lili,grandpa|board|♥', en: 'Ming looks at the board. He reads each line again.', zh: '明明看着板子。他把每一行又读了一遍。' },
      { art: 'school|lili,grandpa|board|★', en: 'The ideas are there. Nothing has gone away.', zh: '主意都在。一样也没丢。' },
      { art: 'school|lili,grandpa|board|…', en: 'The next day he is not sure. One part has gone from his mind.', zh: '第二天他有点拿不准。有一处记不起来了。' },
      { art: 'school|lili,grandpa|board|·', en: 'He goes back to the board. The line is still there.', zh: '他回到板子前。那一行还在。' },
      { art: 'school|lili,grandpa|board|♥', en: 'Ming finds the line he lost. Now he knows what to buy.', zh: '明明找到了忘掉的那一行。这下知道要买什么了。' },
      { art: 'school|lili,grandpa|board|·', en: 'He makes the gift that day. He uses the things on the board.', zh: '他当天就把礼物做好了。用的都是板上写的东西。' },
      { art: 'school|lili,grandpa|board|…', en: 'Grandpa opens the gift at home. He puts it by his bed.', zh: '爷爷在家拆开礼物。把它放在床头。' },
      { art: 'school|lili,grandpa|board|?', en: 'Ming keeps the board by his desk. He writes the next plan on it.', zh: '明明把板子放在书桌旁。他在上面写下下一个打算。' }
    ],
    quiz: [
      { q: '下面哪个词在这一本里读到过？', opts: ['翅膀', '胳膊', '床'], a: 2, kind: 'recall' },
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
      { art: '📦', en: 'can', zh: '罐子' }
    ],
    sight: [],
    newWords: [
      { w: 'knee', zh: '膝盖' }
    ],
    pages: [
      { art: 'table|grandma,mom|knee|·', en: 'This is a knee. It starts with a quiet k.', zh: '这是 knee。开头是个不发音的 k。' },
      { art: 'table|grandma,mom|knee|♪', en: 'This is "write". It starts with a quiet w.', zh: '这是 write。开头是个不发音的 w。' },
      { art: 'table|grandma,mom|knee|👀', en: 'Knee and write.', zh: 'knee 和 write。' },
      { art: 'table|grandma,mom|knee|?', en: 'In "knee", the "k" is quiet. You do not say it.', zh: 'knee 里的 k 不发音。不要读它。' },
      { art: 'table|grandma,mom|knee|·', en: 'In "write", the "w" is quiet. It is there but you do not say it.', zh: 'write 里的 w 不发音。它写着，可你不读它。' },
      { art: 'table|grandma,mom|knee|!', en: 'Say "knee". Say it slow.', zh: '读 knee。慢慢读。' },
      { art: 'table|grandma,mom|knee|♥', en: 'Say "write". Say it again.', zh: '读 write。再读一遍。' },
      { art: 'table|grandma,mom|knee|★', en: 'Some letters are quiet. But they are still in the word.', zh: '有些字母不发音。可它们还在词里。' },
      { art: 'table|grandma,mom|knee|…', en: 'Knee, write, knee, write.', zh: 'knee，write，knee，write。' },
      { art: 'table|grandma,mom|knee|·', en: 'You can read both. Look at each word first.', zh: '两个你都会读。先看清楚每个词。' },
      { art: 'table|grandma,mom|knee|♥', en: 'Quiet letters can be there. They are part of the word.', zh: '词里可以有不发音的字母。它们也是词的一部分。' },
      { art: 'table|grandma,mom|knee|·', en: 'Just read the sound. Do not read every letter.', zh: '只读出声音就行。别把每个字母都念出来。' },
      { art: 'table|grandma,mom|knee|…', en: 'Good reading! Try two more words.', zh: '读得真好！再试两个词。' },
      { art: 'table|grandma,mom|knee|?', en: 'Knee and write. Now say them together.', zh: 'knee 和 write。现在连起来读。' }
    ],
    quiz: [
      { q: '下面哪个词在这一本里读到过？', opts: ['风', '小镇', '膝盖'], a: 2, kind: 'recall' },
      { q: '这两个词里什么特别？', opts: ['都很短', '都很长', '有些字母不发音'], a: 2, kind: 'infer' },
      { q: '遇到有不发音字母的单词，你会怎么读？', opts: ['每个字母都念', '读出发音的那部分，别念不发音的字母', '跳过去'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b106', lv: 'L9', tag: '小知识', title: 'Why Seasons Change', zh: '季节为什么变',
    emoji: '🍂', color: '#FAD3B6',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。认读 5 个新词（泥土、朝着、春天、季节、记下）。',
    trap: 'kn / wr / ph 里的第一个字母不发音；读长句时先找主句，再读从句。',
    summary: '《季节为什么变》：这一本从一件小事讲起，说说为什么会这样。读前先看词卡（泥土、朝着、春天、季节、记下）；读的时候留意先看到什么、为什么会这样、后来怎么弄明白。',
    retell: '合上书，按「先看到什么 → 为什么会这样 → 后来怎么弄明白」讲一遍。',
    think: '说说一年四季是怎么变的。',
    pre: [
      { art: '📦', en: 'earth', zh: '泥土' },
      { art: '💡', en: 'toward', zh: '朝着' },
      { art: '⏰', en: 'spring', zh: '春天' },
      { art: '🍂', en: 'season', zh: '季节' },
      { art: '🏃', en: 'mark', zh: '记下' },
      { art: '☀️', en: 'sun', zh: '太阳' },
      { art: '🌳', en: 'tree', zh: '树' }
    ],
    sight: [],
    newWords: [
      { w: 'earth', zh: '泥土' },
      { w: 'toward', zh: '朝着' },
      { w: 'spring', zh: '春天' },
      { w: 'season', zh: '季节' },
      { w: 'mark', zh: '记下' }
    ],
    pages: [
      { art: 'night|grandpa,dad|season|·', en: 'The seasons change. The trees tell us first.', zh: '季节在变。树最先告诉我们。' },
      { art: 'night|grandpa,dad|season|♪', en: 'Why do seasons change?', zh: '季节为什么会变？' },
      { art: 'night|grandpa,dad|season|👀', en: 'The earth goes around the sun. It takes a whole year.', zh: '地球绕着太阳转。转一圈要整整一年。' },
      { art: 'night|grandpa,dad|season|?', en: 'Sometimes our part is toward the sun. The sun is high then.', zh: '有时我们这一边朝着太阳。那时太阳很高。' },
      { art: 'night|grandpa,dad|season|·', en: 'Then it is warm. The days are long.', zh: '于是天气暖和。白天也长。' },
      { art: 'night|grandpa,dad|season|!', en: 'Sometimes our part turns away. The sun is not high.', zh: '有时我们这一边转开。太阳就不高了。' },
      { art: 'night|grandpa,dad|season|♥', en: 'Then it is cold. We wear thick coats.', zh: '于是天冷了。我们穿上厚外套。' },
      { art: 'night|grandpa,dad|season|★', en: 'So the seasons change. It happens every year.', zh: '季节就这样变。年年都是如此。' },
      { art: 'night|grandpa,dad|season|…', en: 'Spring, summer, fall, winter. Each one looks different.', zh: '春、夏、秋、冬。每一季看着都不一样。' },
      { art: 'night|grandpa,dad|season|·', en: 'Each season is different. The garden shows it.', zh: '每一季都不同。花园里看得最清楚。' },
      { art: 'night|grandpa,dad|season|♥', en: 'You can see it in one tree. Watch it all year.', zh: '盯住一棵树就能看出来。看它一整年。' },
      { art: 'night|grandpa,dad|season|·', en: 'The earth keeps going. It never stops.', zh: '地球一直转。从不停下。' },
      { art: 'night|grandpa,dad|season|…', en: 'The seasons keep changing. Watch the same tree all year.', zh: '季节不断更替。一整年都看着同一棵树。' },
      { art: 'night|grandpa,dad|season|?', en: 'Ming will mark it on a board. He wants to see the change.', zh: '明明要把变化记在板上。他想亲眼看见它。' }
    ],
    quiz: [
      { q: '下面哪个词在这一本里读到过？', opts: ['工人', '泥土', '书包'], a: 1, kind: 'recall' },
      { q: '季节为什么会变？', opts: ['因为月亮变', '地球绕太阳转，我们这边有时朝太阳有时转开', '因为风向变'], a: 1, kind: 'infer' },
      { q: '想知道自然的大变化，你会怎么做？', opts: ['观察、看书、问一问', '随便猜', '不管它'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b107', lv: 'L9', tag: '小知识', title: 'How We Measure Rain', zh: '我们怎么量雨',
    emoji: '🌧️', color: '#C8E7F0',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。认读 1 个新词（有用）。',
    trap: 'kn / wr / ph 里的第一个字母不发音；读长句时先找主句，再读从句。',
    summary: '《我们怎么量雨》：这一本从一件小事讲起，说说为什么会这样。读前先看词卡（有用）；读的时候留意先看到什么、为什么会这样、后来怎么弄明白。',
    retell: '合上书，按「先看到什么 → 为什么会这样 → 后来怎么弄明白」讲一遍。',
    think: '说说你想量一量的一样东西。',
    pre: [
      { art: '✨', en: 'useful', zh: '有用' },
      { art: '🌧️', en: 'rain', zh: '雨' },
      { art: '🥛', en: 'cup', zh: '杯子' }
    ],
    sight: [],
    newWords: [
      { w: 'useful', zh: '有用' }
    ],
    pages: [
      { art: 'night|mom,ming|rain|·', en: 'We want to measure the rain. Ming asks how much rain there was.', zh: '我们想量一量雨。明明问到底下了多少雨。' },
      { art: 'night|mom,ming|rain|♪', en: 'We need a way to measure. Grandma brings a cup.', zh: '得想个办法量。奶奶拿来一只杯子。' },
      { art: 'night|mom,ming|rain|👀', en: 'We put a cup outside. It stands on a stone.', zh: '我们把杯子放到屋外。它立在一块石头上。' },
      { art: 'night|mom,ming|rain|?', en: 'The rain falls in the cup. All night it fills.', zh: '雨落进杯子里。下了一夜，慢慢积起来。' },
      { art: 'night|mom,ming|rain|·', en: 'We look at the water in the cup. Ming marks the line.', zh: '我们看杯里的水。明明把水位记下来。' },
      { art: 'night|mom,ming|rain|!', en: 'More rain, more water. That is how we know.', zh: '雨越多，水越多。我们就是这样知道的。' },
      { art: 'night|mom,ming|rain|♥', en: 'We mark how much. He writes it in a note.', zh: '把多少记下来。他写在一张小纸条上。' },
      { art: 'night|mom,ming|rain|★', en: 'Now we can measure the rain. The cup is our tool.', zh: '现在能量雨了。杯子就是我们的工具。' },
      { art: 'night|mom,ming|rain|…', en: 'The next day it rains again. Ming runs outside.', zh: '第二天下雨了。明明跑到屋外。' },
      { art: 'night|mom,ming|rain|·', en: 'Measuring needs a way. This way is simple.', zh: '测量得有办法。这个办法很简单。' },
      { art: 'night|mom,ming|rain|♥', en: 'A cup can be a tool. It does not need to be new.', zh: '杯子也能当工具。不必是新的。' },
      { art: 'night|mom,ming|rain|·', en: 'We measure again tomorrow. Ming will compare the two marks.', zh: '明天再量一次。明明要比一比两个记号。' },
      { art: 'night|mom,ming|rain|…', en: 'Rain can be measured. So can many other things.', zh: '雨可以量。很多别的东西也可以量。' },
      { art: 'night|mom,ming|rain|?', en: 'Measuring is useful. He wants to measure the snow.', zh: '测量很有用。他还想量一量雪。' }
    ],
    quiz: [
      { q: '下面哪个词在这一本里读到过？', opts: ['垃圾桶', '公交车', '石头'], a: 2, kind: 'recall' },
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
      { art: 'library|dad,lili|story|·', en: 'Ming is at the station. He waits for Grandma.', zh: '明明在车站。他在等奶奶。' },
      { art: 'library|dad,lili|story|♪', en: 'Ming thinks about the whole story. He wants to tell it to Grandma.', zh: '明明想着整个故事。他想讲给奶奶听。' },
      { art: 'library|dad,lili|story|👀', en: 'First, there was a question. Ming could not find his ball.', zh: '开头是一个问题。明明找不到他的球了。' },
      { art: 'library|dad,lili|story|?', en: 'Then, there was work. He looked all over the park.', zh: '接着是一番寻找。他把公园找了个遍。' },
      { art: 'library|dad,lili|story|·', en: 'Then, there was an answer. The ball was by the gate.', zh: '最后是答案。球就在门边。' },
      { art: 'library|dad,lili|story|!', en: 'The story has three parts. He counts them one by one.', zh: '故事有三个部分。他一个一个数。' },
      { art: 'library|dad,lili|story|♥', en: 'Ming tells the whole story. Grandma listens all the way.', zh: '明明把整个故事讲了一遍。奶奶从头听到尾。' },
      { art: 'library|dad,lili|story|★', en: 'Grandma asks one more thing. She wants to hear about the ball.', zh: '奶奶又问了一处。她想听听球的事。' },
      { art: 'library|dad,lili|story|…', en: 'Grandma asks about the park. Ming tells that part again.', zh: '奶奶问起公园那一段。明明把那部分又讲了一遍。' },
      { art: 'library|dad,lili|story|·', en: 'So Ming starts at the beginning. He tells the park part too.', zh: '于是明明从头讲起。公园那段也讲了。' },
      { art: 'library|dad,lili|story|♥', en: 'Ming tells it again. This time nothing is missing.', zh: '明明又讲了一遍。这回一点没漏。' },
      { art: 'library|dad,lili|story|·', en: 'The whole story is clear now. Grandma smiles at him.', zh: '整个故事现在清楚了。奶奶朝他笑。' },
      { art: 'library|dad,lili|story|…', en: 'Grandma says she likes the end. Ming says he likes the gate part.', zh: '奶奶说她最喜欢结尾。明明说他喜欢门边那一段。' },
      { art: 'library|dad,lili|story|?', en: 'The whole story, start to end. He will tell Mom at home.', zh: '完整的故事，从头到尾。回家他要讲给妈妈听。' }
    ],
    quiz: [
      { q: '下面哪个词在这一本里读到过？', opts: ['罐子', '蓝色', '大门'], a: 2, kind: 'recall' },
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
      { art: '❓', en: 'question', zh: '问题' },
      { art: '📦', en: 'word', zh: '词' }
    ],
    sight: [],
    newWords: [

    ],
    pages: [
      { art: 'library|ming,grandma|idea|·', en: 'Ming reads a hard sentence. It is in his new book.', zh: '明明读到一个难句。它在一本新书里。' },
      { art: 'library|ming,grandma|idea|♪', en: 'The sentence does not make sense. He reads it three times.', zh: '这个句子讲不通。他读了三遍。' },
      { art: 'library|ming,grandma|idea|👀', en: 'Ming asks, "What does it mean?" Grandma comes to his desk.', zh: '明明问：「它是什么意思？」奶奶来到书桌旁。' },
      { art: 'library|ming,grandma|idea|?', en: 'Grandma answers. She explains the whole line.', zh: '奶奶回答了。她把整行都讲了一遍。' },
      { art: 'library|ming,grandma|idea|·', en: 'But Ming still does not get it. The words are all strange to him.', zh: '可明明还是没懂。这些词他都不熟。' },
      { art: 'library|ming,grandma|idea|!', en: 'Ming asks a better question. He stops and thinks first.', zh: '明明问了一个更好的问题。他先停下来想了想。' },
      { art: 'library|ming,grandma|idea|♥', en: '"Which word is hard?" asks Ming. Now the question is small.', zh: '「哪个词难懂？」明明问。这下问题变小了。' },
      { art: 'library|ming,grandma|idea|★', en: 'Grandma points to one word. It sits near the end.', zh: '奶奶指着一个词。它靠近句尾。' },
      { art: 'library|ming,grandma|idea|…', en: 'Now Ming knows where it is hard. It is just that one word.', zh: '现在明明知道难在哪儿了。就难在那一个词。' },
      { art: 'library|ming,grandma|idea|·', en: 'They talk about that one word. Grandma says it in a short sentence.', zh: '他们只谈那一个词。奶奶用一个短句把它说出来。' },
      { art: 'library|ming,grandma|idea|♥', en: 'The hard part gets clear. Ming says it out loud.', zh: '难的地方清楚了。明明把它大声念出来。' },
      { art: 'library|ming,grandma|idea|·', en: 'The whole sentence is clear now. He reads it again from the start.', zh: '整个句子现在清楚了。他从开头又读了一遍。' },
      { art: 'library|ming,grandma|idea|…', en: 'Ming looks back at his first question. It was too big to help.', zh: '明明回头看自己问的第一个问题。它太大了，帮不上忙。' },
      { art: 'library|ming,grandma|idea|?', en: 'Ming writes down the question. He puts it on a note by his desk.', zh: '明明把问题写下来。他把纸条放在书桌旁。' },
      { art: 'library|ming,grandma|idea|·', en: 'Next time he will ask a small one. He keeps the idea on a note.', zh: '下次他要问一个小问题。他把这个主意记在纸条上。' }
    ],
    quiz: [
      { q: '下面哪个词在这一本里读到过？', opts: ['黄色', '桌子', '蝙蝠'], a: 1, kind: 'recall' },
      { q: '明明问的「更好的问题」是什么？', opts: ['「这是什么意思？」', '「哪个词难懂？」', '「我该读吗？」'], a: 1, kind: 'infer' },
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
    sight: ['thought'],
    newWords: [
      { w: 'courage', zh: '勇气' }
    ],
    pages: [
      { art: 'library|lili,grandpa|change|·', en: 'Ming makes one small change. He will do it every day.', zh: '明明做了一个小小的改变。他打算天天都做。' },
      { art: 'library|lili,grandpa|change|♪', en: 'Ming changes one small thing. Each day he writes one new word.', zh: '明明改了一件小事。每天写下一个新词。' },
      { art: 'library|lili,grandpa|change|👀', en: 'At first, nothing seems different. The box has only three notes.', zh: '起初看不出什么不同。盒子里只有三张纸条。' },
      { art: 'library|lili,grandpa|change|?', en: 'Ming keeps going. He does not stop on tired days.', zh: '明明继续做。累了的日子也不停。' },
      { art: 'library|lili,grandpa|change|·', en: 'Day by day, it adds up. The notes fill the box.', zh: '一天天过去，越攒越多。纸条装满了盒子。' },
      { art: 'library|lili,grandpa|change|!', en: 'After a while, it is different. Now he can read a whole page.', zh: '过了一阵子，不一样了。现在他能读完整整一页。' },
      { art: 'library|lili,grandpa|change|♥', en: 'The small change did it. One word a day was enough.', zh: '是这个小变化起的效。一天一个词就够了。' },
      { art: 'library|lili,grandpa|change|★', en: 'Ming is glad to keep going. He shows Grandma the full box.', zh: '明明很愿意继续。他把满满的盒子给奶奶看。' },
      { art: 'library|lili,grandpa|change|…', en: 'Grandma counts the notes with him. There are more than he thought.', zh: '奶奶和他一起数纸条。比他以为的还多。' },
      { art: 'library|lili,grandpa|change|·', en: 'The first note is still in the box. It has one word on it.', zh: '第一张纸条还在盒子里。上面只有一个词。' },
      { art: 'library|lili,grandpa|change|♥', en: 'Ming makes another change. Now he reads one page each night.', zh: '明明又改了一处。现在每晚读一页。' },
      { art: 'library|lili,grandpa|change|·', en: 'It adds up again. By spring he finishes a whole book.', zh: '又慢慢攒起来了。到春天他读完了一整本。' },
      { art: 'library|lili,grandpa|change|…', en: 'Grandma says he has courage. Ming says one word is easy.', zh: '奶奶说他有勇气。明明说一天一个词很容易。' },
      { art: 'library|lili,grandpa|change|?', en: 'Ming sees how it works. He tells his class about the box.', zh: '明明看懂了它是怎么起作用的。他把盒子讲给班上听。' },
      { art: 'library|lili,grandpa|change|·', en: 'Tomorrow he will write one more word. He puts the box back on the desk.', zh: '明天他还要再写一个词。他把盒子放回桌上。' }
    ],
    quiz: [
      { q: '下面哪个词在这一本里读到过？', opts: ['面包', '班', '蝙蝠'], a: 1, kind: 'recall' },
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
      { art: 'library|grandma,mom|habit|·', en: 'A habit is doing it every day. Ming wants one of his own.', zh: '习惯就是天天都做。明明也想有一个。' },
      { art: 'library|grandma,mom|habit|♪', en: 'Ming puts his school things by the door. He does it before bed.', zh: '明明把上学要用的东西放在门边。睡前做。' },
      { art: 'library|grandma,mom|habit|👀', en: 'His bag goes there first. His cap goes on the bag.', zh: '先把书包放过去。帽子搁在书包上。' },
      { art: 'library|grandma,mom|habit|?', en: 'One night he is too tired. He puts the bag under the bed.', zh: '有天晚上他太累了。把书包塞到了床底下。' },
      { art: 'library|grandma,mom|habit|·', en: 'In the morning he cannot find it. His cap is under the bed too.', zh: '早上他找不到书包。帽子也在床底下。' },
      { art: 'library|grandma,mom|habit|!', en: 'Mom helps him look. They find the bag at last.', zh: '妈妈帮他一起找。最后总算找到了。' },
      { art: 'library|grandma,mom|habit|♥', en: 'Ming is late for school. He does not like being late.', zh: '明明上学迟到了。他不喜欢迟到。' },
      { art: 'library|grandma,mom|habit|★', en: 'That night he puts everything by the door again.', zh: '那天晚上他又把东西都放到了门边。' },
      { art: 'library|grandma,mom|habit|…', en: 'He does it the next night too. It takes a short time.', zh: '第二天晚上也这么做了。花不了多少工夫。' },
      { art: 'library|grandma,mom|habit|·', en: 'After a week it is easy. He does not have to think about it.', zh: '一周之后就顺了。不用再特意去想。' },
      { art: 'library|grandma,mom|habit|♥', en: 'Now his things are always there. He never looks for them.', zh: '现在东西总在那儿。他再也不用找。' },
      { art: 'library|grandma,mom|habit|·', en: 'Grandma asks how he does it. Ming points to the door.', zh: '奶奶问他怎么做到的。明明指了指门边。' },
      { art: 'library|grandma,mom|habit|…', en: 'Lili wants to try it too. She puts her bag next to his.', zh: '丽丽也想试试。她把书包放在他的旁边。' },
      { art: 'library|grandma,mom|habit|?', en: 'They both do it before bed. It is just part of the day.', zh: '两人睡前都这么做。这成了一天里的一小段。' },
      { art: 'library|grandma,mom|habit|·', en: 'Tomorrow he will do it again. He puts his cap on the bag.', zh: '明天他还会这么做。把帽子搁在书包上。' }
    ],
    quiz: [
      { q: '下面哪个词在这一本里读到过？', opts: ['鸭舌帽', '蜜蜂', '哥哥'], a: 0, kind: 'recall' },
      { q: '明明后来再也不用找书包了，为什么？', opts: ['妈妈每天帮他找', '他不再带书包了', '他每晚都把东西放到门边，成了习惯'], a: 2, kind: 'infer' },
      { q: '想养成一个好习惯，你会怎么做？', opts: ['做一次就够了', '等别人提醒', '每天固定做一点，忘了就补上'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b112', lv: 'L10', tag: '发现', title: 'What We Discovered', zh: '我们的发现',
    emoji: '💡', color: '#C6DEF6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 1 个新词（忘记）。',
    trap: '桥梁书按自然段读：一句里先找「谁 + 做什么」，再把修饰部分补进去。',
    summary: '《我们的发现》：这是一个完整的小故事。读前先看词卡（忘记）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '不看书写一段 5 句的口头小结，再说说这件事让你想到什么。',
    think: '说说你通过动手弄清楚的一件事。',
    pre: [
      { art: '🏃', en: 'forget', zh: '忘记' },
      { art: '🍲', en: 'pot', zh: '锅' },
      { art: '📋', en: 'board', zh: '木板' }
    ],
    sight: [],
    newWords: [
      { w: 'forget', zh: '忘记' }
    ],
    pages: [
      { art: 'library|grandpa,dad|plan|·', en: 'Ming wants to find out something. He wonders why one seed did not grow.', zh: '明明想弄清一件事。他纳闷有一粒种子为什么没长。' },
      { art: 'library|grandpa,dad|plan|♪', en: 'Ming makes a plan. He writes three steps on a board.', zh: '明明订了个计划。他在板上写了三步。' },
      { art: 'library|grandpa,dad|plan|👀', en: 'The plan says what to do. First, put seeds in two pots.', zh: '计划上写着怎么做。先往两只盆里种下种子。' },
      { art: 'library|grandpa,dad|plan|?', en: 'Ming follows the plan. One pot goes by the window.', zh: '明明按计划做。一盆放到窗边。' },
      { art: 'library|grandpa,dad|plan|·', en: 'Some things go well. The warm pot has a green stem.', zh: '有些地方很顺。暖和那盆冒出了绿茎。' },
      { art: 'library|grandpa,dad|plan|!', en: 'Some things do not. The other pot stays dark and dry.', zh: '有些地方不顺。另一盆还是又暗又干。' },
      { art: 'library|grandpa,dad|plan|♥', en: 'Ming changes the plan a little. He puts that pot in the sun.', zh: '明明把计划改了一点。他把那盆挪到太阳下。' },
      { art: 'library|grandpa,dad|plan|★', en: 'Ming goes on. Each morning he marks what he sees.', zh: '明明继续做。每天早上记下看到的。' },
      { art: 'library|grandpa,dad|plan|…', en: 'At last, Ming finds it out. The cold pot was too slow.', zh: '最后，明明弄清楚了。阴冷那盆长得太慢。' },
      { art: 'library|grandpa,dad|plan|·', en: 'He writes the answer in his note. Grandma reads it too.', zh: '他把答案写在纸条上。奶奶也看了。' },
      { art: 'library|grandpa,dad|plan|♥', en: 'He reads his first three steps again. He did not forget one.', zh: '他把开头三步又读了一遍。一步也没忘。' },
      { art: 'library|grandpa,dad|plan|·', en: 'He draws a line to the new step. The board still makes sense.', zh: '他画一条线连到新加的那步。板上仍然讲得通。' },
      { art: 'library|grandpa,dad|plan|…', en: 'Ming writes down what we found. He shows the two pots to Grandma.', zh: '明明把发现记下来。他把两盆指给奶奶看。' },
      { art: 'library|grandpa,dad|plan|?', en: 'Grandma looks at the two pots. She asks which one grew first.', zh: '奶奶看着两只盆。她问哪一盆先长出来。' },
      { art: 'library|grandpa,dad|plan|·', en: 'Ming writes the answer on the board. Tomorrow he will try three pots.', zh: '明明把答案写在板上。明天他要试三只盆。' }
    ],
    quiz: [
      { q: '下面哪个词在这一本里读到过？', opts: ['班', '蛋糕', '窗户'], a: 2, kind: 'recall' },
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
      { art: 'library|mom,ming|patience|·', en: 'Waiting can be hard. Ming finds that out today.', zh: '等待可能很难。明明今天体会到了。' },
      { art: 'library|mom,ming|patience|♪', en: 'Ming waits for a memory to come. He wants the name of an old song.', zh: '明明等一段记忆回来。他想记起一首老歌的名字。' },
      { art: 'library|mom,ming|patience|👀', en: 'It does not come at first. He sits and thinks hard.', zh: '一开始它不肯来。他坐着使劲想。' },
      { art: 'library|mom,ming|patience|?', en: 'Trying hard does not help. The word will not come.', zh: '越使劲越没用。那个词就是不出来。' },
      { art: 'library|mom,ming|patience|·', en: 'Ming lets go a little. He stops trying to remember.', zh: '明明放松了一点。他不再硬想。' },
      { art: 'library|mom,ming|patience|!', en: 'Ming thinks of something else. He helps Grandma in the kitchen.', zh: '明明去想别的事。他到厨房帮奶奶。' },
      { art: 'library|mom,ming|patience|♥', en: 'Then the memory comes back. It comes while he washes a plate.', zh: '然后记忆回来了。是他在洗盘子的时候回来的。' },
      { art: 'library|mom,ming|patience|★', en: 'It was there all along. He just could not find it.', zh: '它一直都在。他只是一时找不到。' },
      { art: 'library|mom,ming|patience|…', en: 'He runs to tell Grandma. She laughs and sings the song.', zh: '他跑去告诉奶奶。奶奶笑着把那首歌唱了一遍。' },
      { art: 'library|mom,ming|patience|·', en: 'Grandma says she does that too. She stops and sings.', zh: '奶奶说她也是这样。她停下来，去唱歌。' },
      { art: 'library|mom,ming|patience|♥', en: 'Ming is glad he waited. He did not try too hard.', zh: '明明庆幸自己等了。他没有逼自己。' },
      { art: 'library|mom,ming|patience|·', en: 'Grandma says it is patience. Ming says it is a quiet kind of strength.', zh: '奶奶说这就叫耐心。明明说它像一种安安静静的力量。' },
      { art: 'library|mom,ming|patience|…', en: 'Ming will remember this. He writes the song name down.', zh: '明明会记住这件事。他把歌名写下来。' },
      { art: 'library|mom,ming|patience|?', en: 'The memory is safe now. It is on a note by his bed.', zh: '这段记忆现在稳妥了。纸条就放在床头。' },
      { art: 'library|mom,ming|patience|·', en: 'That night Grandma sings it once more. Ming goes to sleep with the song.', zh: '那晚奶奶又唱了一遍。明明听着歌睡着了。' }
    ],
    quiz: [
      { q: '下面哪个词在这一本里读到过？', opts: ['厨房', '小面包', '城市'], a: 0, kind: 'recall' },
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
      { art: 'library|dad,lili|problem|·', en: 'A problem has two sides. Ming sees that at school today.', zh: '一个问题有两面。明明今天在学校明白了。' },
      { art: 'library|dad,lili|problem|♪', en: 'Ming looks at one side. Lili has the big board again.', zh: '明明先看自己这一面。丽丽又占着那块大板。' },
      { art: 'library|dad,lili|problem|👀', en: 'It looks hard. He thinks she will not share.', zh: '这事看着难办。他觉得她不肯让。' },
      { art: 'library|dad,lili|problem|?', en: 'Then Ming looks at the other side. He asks her why she needs it.', zh: '然后明明看另一面。他问她为什么要用。' },
      { art: 'library|dad,lili|problem|·', en: 'This side looks easier. She is drawing for the class.', zh: '这一面好懂得多。她在给班里画一幅画。' },
      { art: 'library|dad,lili|problem|!', en: 'Both sides are the same problem. There is only one board.', zh: '两面其实是同一个问题。板子只有一块。' },
      { art: 'library|dad,lili|problem|♥', en: 'The way you look matters. Ming is not sad now.', zh: '怎么看很要紧。明明现在不难过了。' },
      { art: 'library|dad,lili|problem|★', en: 'Ming looks from both sides. He tells her about his picture.', zh: '明明从两面都看了看。他讲起自己要画的画。' },
      { art: 'library|dad,lili|problem|…', en: 'Now the problem is clear. They can use the board in turn.', zh: '问题清楚了。他们可以轮流用这块板。' },
      { art: 'library|dad,lili|problem|·', en: 'Lili draws first, then Ming. He waits and watches her work.', zh: '丽丽先画，然后明明。他等着，看她画。' },
      { art: 'library|dad,lili|problem|♥', en: 'Ming knows what to do now. He has a plan of his own.', zh: '明明知道该怎么办了。他自己也有了打算。' },
      { art: 'library|dad,lili|problem|·', en: 'They move the board near the window. The light is better there.', zh: '他们把板子挪到窗边。那儿光线更好。' },
      { art: 'library|dad,lili|problem|…', en: 'Lili finishes her part. Ming picks up the pen.', zh: '丽丽画完她那部分。明明拿起了笔。' },
      { art: 'library|dad,lili|problem|?', en: 'A problem is not so hard now. It was one board and two people.', zh: '问题没那么难了。不过是一块板、两个人。' },
      { art: 'library|dad,lili|problem|·', en: 'They put the picture on the wall. It has both of their names.', zh: '他们把画贴在墙上。上面有两个人的名字。' }
    ],
    quiz: [
      { q: '下面哪个词在这一本里读到过？', opts: ['图画', '城市', '乌鸦'], a: 0, kind: 'recall' },
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
      { art: '🌿', en: 'wind', zh: '风' }
    ],
    sight: [],
    newWords: [
      { w: 'promise', zh: '约定' }
    ],
    pages: [
      { art: 'library|ming,grandma|promise|·', en: 'Today was a hard day. Nothing went the way Ming wanted.', zh: '今天很不顺。没有一件事按明明想的来。' },
      { art: 'library|ming,grandma|promise|♪', en: 'Some things did not work. His kite went into a tree.', zh: '好些事没成。风筝挂到树上去了。' },
      { art: 'library|ming,grandma|promise|👀', en: 'Ming feels tired. He also lost a page of his story.', zh: '明明觉得累。他还弄丢了故事里的一页。' },
      { art: 'library|ming,grandma|promise|?', en: 'But the day is over. The sky is dark now.', zh: '可这一天过去了。天已经黑了。' },
      { art: 'library|ming,grandma|promise|·', en: 'Tomorrow we begin again. Grandma says it to him.', zh: '明天重新开始。奶奶这么跟他说。' },
      { art: 'library|ming,grandma|promise|!', en: 'Ming makes a promise. He will try the kite once more.', zh: '明明许了个约定。他要再放一次风筝。' },
      { art: 'library|ming,grandma|promise|♥', en: 'The promise is to try again. He says it out loud.', zh: '约定就是再试一次。他大声说了出来。' },
      { art: 'library|ming,grandma|promise|★', en: 'Tomorrow is a new day. He puts the kite by the door.', zh: '明天是新的一天。他把风筝放在门边。' },
      { art: 'library|ming,grandma|promise|…', en: 'Ming rests now. He sleeps well that night.', zh: '明明现在休息。那晚他睡得很好。' },
      { art: 'library|ming,grandma|promise|·', en: 'Morning comes and the wind is calm. Ming takes the kite outside.', zh: '早晨来了，风很柔和。明明把风筝拿出去。' },
      { art: 'library|ming,grandma|promise|♥', en: 'Ming keeps his promise. He takes the kite outside again.', zh: '明明守住了约定。又把风筝拿了出去。' },
      { art: 'library|ming,grandma|promise|·', en: 'Ming will keep the promise. He takes the kite back to the park.', zh: '明明会守住约定。他把风筝带回公园。' },
      { art: 'library|ming,grandma|promise|…', en: 'The wind is just right. Ming holds the line with two hands.', zh: '风刚刚好。明明用两只手握着线。' },
      { art: 'library|ming,grandma|promise|?', en: 'New days come. The kite goes up on the first try.', zh: '新日子会来。风筝第一次就飞起来了。' },
      { art: 'library|ming,grandma|promise|·', en: 'The kite is high over the park. Grandma is at the gate.', zh: '风筝高高地飞在公园上空。奶奶站在门口。' }
    ],
    quiz: [
      { q: '下面哪个词在这一本里读到过？', opts: ['薯片', '天空', '奶牛'], a: 1, kind: 'recall' },
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
      { art: 'library|lili,grandpa|journey|·', en: 'Ming starts a journey to the old tree. It is up on the hill.', zh: '明明出发去老树那儿。树在山上。' },
      { art: 'library|lili,grandpa|journey|♪', en: 'Ming takes one small step. He wants to get to the old tree.', zh: '明明迈出一小步。他想走到那棵老树那儿。' },
      { art: 'library|lili,grandpa|journey|👀', en: 'It seems too small. The tree is still far away.', zh: '这一步看着太小了。树还远着呢。' },
      { art: 'library|lili,grandpa|journey|?', en: 'But Ming takes another. Then one more, and one more.', zh: '可明明又迈了一步。接着又一步，再一步。' },
      { art: 'library|lili,grandpa|journey|·', en: 'Step by step, Ming goes on. The path is long and hot.', zh: '一步一步，明明往前走。路又长又晒。' },
      { art: 'library|lili,grandpa|journey|!', en: 'The small steps add up. He stops for a drink.', zh: '小步子慢慢累加。他停下来喝口水。' },
      { art: 'library|lili,grandpa|journey|♥', en: 'After a while, Ming looks back. The house is small now.', zh: '过了一阵，明明回头看。房子已经变得很小。' },
      { art: 'library|lili,grandpa|journey|★', en: 'Ming has come far. He can see the whole town.', zh: '明明走了很远。他能看见整个镇子。' },
      { art: 'library|lili,grandpa|journey|…', en: 'He sits on a stone to rest. The wind feels good up here.', zh: '他坐在石头上歇脚。山上风吹着很舒服。' },
      { art: 'library|lili,grandpa|journey|·', en: 'He counts his steps on the path. There are many of them.', zh: '他数了数一路走过的步子。好多步呢。' },
      { art: 'library|lili,grandpa|journey|♥', en: 'Ming keeps walking. The path goes up again.', zh: '明明接着走。路又往上拐了一段。' },
      { art: 'library|lili,grandpa|journey|·', en: 'He looks up at the leaves. They are big and green.', zh: '他抬头看那些叶子。又大又绿。' },
      { art: 'library|lili,grandpa|journey|…', en: 'Small steps, long way. He gets to the tree at last.', zh: '小步子，长路。他终于走到了树下。' },
      { art: 'library|lili,grandpa|journey|?', en: 'Ming is proud of the way. He pats the old tree.', zh: '明明为这一路得意。他拍了拍那棵老树。' },
      { art: 'library|lili,grandpa|journey|·', en: 'He sits under the tree for a while. Then he walks home.', zh: '他在树下坐了一会儿。然后走回家。' }
    ],
    quiz: [
      { q: '下面哪个词在这一本里读到过？', opts: ['国家', '房子', '狗'], a: 1, kind: 'recall' },
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
      { art: '📍', en: 'front', zh: '前面' }
    ],
    sight: ['thought'],
    newWords: [
      { w: 'team', zh: '队伍' },
      { w: 'reason', zh: '原因' },
      { w: 'pace', zh: '节奏' }
    ],
    pages: [
      { art: 'table|grandma,mom|reason|·', en: 'A whole sentence has words. Count them.', zh: '一个完整的句子由词组成。数一数。' },
      { art: 'table|grandma,mom|reason|♪', en: 'But a sentence is not just words. The words work as a team.', zh: '可句子不只是词。这些词像一队人一起干活。' },
      { art: 'table|grandma,mom|reason|👀', en: 'The words work together. They say one thing.', zh: '词是合在一起干活的。它们说的是一件事。' },
      { art: 'table|grandma,mom|reason|?', en: 'Some words go in front. Some words go after.', zh: '有些词在前，有些词在后。' },
      { art: 'table|grandma,mom|reason|·', en: 'Together, they make sense. Alone, they are not enough.', zh: '合起来才讲得通。单独一个不够。' },
      { art: 'table|grandma,mom|reason|!', en: 'Read the whole sentence. Do not stop at each word.', zh: '读整个句子。别在每个词上停。' },
      { art: 'table|grandma,mom|reason|♥', en: 'Do not read word by word. That breaks the line.', zh: '别一个词一个词地读。那样会把句子读断。' },
      { art: 'table|grandma,mom|reason|★', en: 'Say the whole sentence. Say it from start to end.', zh: '把整句说出来。从头说到尾。' },
      { art: 'table|grandma,mom|reason|…', en: 'The reason is simple. A sentence is one idea.', zh: '道理很简单。一个句子就是一个意思。' },
      { art: 'table|grandma,mom|reason|·', en: 'A whole sentence is a whole thought. Keep the words together.', zh: '整句是一个完整的想法。把词连在一起。' },
      { art: 'table|grandma,mom|reason|♥', en: 'Read it as one. Then it is easy to understand.', zh: '把它当成一个整体读。这样就容易明白。' },
      { art: 'table|grandma,mom|reason|·', en: 'You can say it well. Try this long one.', zh: '你能读好。试试这个长句。' },
      { art: 'table|grandma,mom|reason|…', en: 'Good reading! Try it again, slower.', zh: '读得真好！再慢一点读一遍。' },
      { art: 'table|grandma,mom|reason|?', en: 'A whole sentence. Now listen to the pace.', zh: '一个完整的句子。现在听听它的节奏。' },
      { art: 'table|grandma,mom|reason|·', en: 'Read it all at once. It will make sense.', zh: '一口气读完。意思就出来了。' }
    ],
    quiz: [
      { q: '下面哪个词在这一本里读到过？', opts: ['薯片', '队伍', '奶牛'], a: 1, kind: 'recall' },
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
      { art: 'library|grandpa,dad|answer|·', en: 'Practice makes us better. Ming sees it with his pen.', zh: '练习让我们变好。明明用笔体会到了。' },
      { art: 'library|grandpa,dad|answer|♪', en: 'But why does practice work?', zh: '可练习为什么有用？' },
      { art: 'library|grandpa,dad|answer|👀', en: 'When we practice, the brain learns. It keeps what we do again and again.', zh: '练习时脑子在学。反复做的事它记住了。' },
      { art: 'library|grandpa,dad|answer|?', en: 'Doing it again makes a path. The path is in your brain.', zh: '反复做会走出一条路。这条路在脑子里。' },
      { art: 'library|grandpa,dad|answer|·', en: 'The path gets easy to follow. Your hand knows what comes next.', zh: '路越好走。手知道下一步该做什么。' },
      { art: 'library|grandpa,dad|answer|!', en: 'Practice is the answer. Ming practices writing his name.', zh: '练习就是答案。明明练习写自己的名字。' },
      { art: 'library|grandpa,dad|answer|♥', en: 'Ming practices every day. At first the letters are not even.', zh: '明明天天练。一开始字母歪歪扭扭。' },
      { art: 'library|grandpa,dad|answer|★', en: 'It gets easier and easier. By the end of the week they look good.', zh: '越来越容易。到周末已经写得像样了。' },
      { art: 'library|grandpa,dad|answer|…', en: 'He shows Grandma the two pages. She can see the change.', zh: '他把前后两页给奶奶看。奶奶看出了变化。' },
      { art: 'library|grandpa,dad|answer|·', en: 'Practice is not just doing. It is doing it again with care.', zh: '练习不只是做。是带着细心反复做。' },
      { art: 'library|grandpa,dad|answer|♥', en: 'Practice is making a path. A path you can use later.', zh: '练习是在铺一条路。一条以后能走的路。' },
      { art: 'library|grandpa,dad|answer|·', en: 'Ming keeps practicing. He writes three lines each day.', zh: '明明继续练。每天写三行。' },
      { art: 'library|grandpa,dad|answer|…', en: 'The path is strong now. He does not have to think hard.', zh: '这条路现在很结实。他不用使劲想了。' },
      { art: 'library|grandpa,dad|answer|?', en: 'Practice works. His name looks different now.', zh: '练习真的有用。他的名字现在不一样了。' },
      { art: 'library|grandpa,dad|answer|·', en: 'Keep practicing. Tomorrow he will try a new word.', zh: '继续练。明天他要试一个新词。' }
    ],
    quiz: [
      { q: '下面哪个词在这一本里读到过？', opts: ['医生', '脑子', '农民'], a: 1, kind: 'recall' },
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
      { art: 'library|mom,ming|future|·', en: 'Some work takes a long time. Ming thinks about the future.', zh: '有些事要花很长时间。明明想着往后。' },
      { art: 'library|mom,ming|future|♪', en: 'He wants to make a picture book. It will have many pages.', zh: '他想做一本图画册。会有好多页。' },
      { art: 'library|mom,ming|future|👀', en: 'He does not do it all in one day. He paints one page.', zh: '他不在一天里全做完。只画一页。' },
      { art: 'library|mom,ming|future|?', en: 'The next day he paints one more. He keeps the same pace.', zh: '第二天再画一页。节奏不变。' },
      { art: 'library|mom,ming|future|·', en: 'Each page takes a short time. He looks at it slowly.', zh: '每页花的时间都不长。他慢慢看一遍。' },
      { art: 'library|mom,ming|future|!', en: 'One day he paints too fast. The green leaf looks wrong.', zh: '有一天他画得太快。那片绿叶画歪了。' },
      { art: 'library|mom,ming|future|♥', en: 'He paints that page again. The slow one looks better.', zh: '他把那页重画了一遍。慢慢画的这页好看。' },
      { art: 'library|mom,ming|future|★', en: 'A fast page needs doing again. That takes more time.', zh: '画快的那页得重来。反倒多花时间。' },
      { art: 'library|mom,ming|future|…', en: 'Grandma comes in. She looks at the pages in order.', zh: '奶奶进来了。她按次序看那些画页。' },
      { art: 'library|mom,ming|future|·', en: 'The book gets thick. There are many pages now.', zh: '册子变厚了。现在有好多页了。' },
      { art: 'library|mom,ming|future|♥', en: 'Ming does not rush. He paints one page each day.', zh: '明明不赶。每天只画一页。' },
      { art: 'library|mom,ming|future|·', en: 'Each small page is part of the whole. Not one is lost.', zh: '每一小页都是整本的一部分。一页也没白费。' },
      { art: 'library|mom,ming|future|…', en: 'Ming paints the last page. He puts the book together.', zh: '明明画完最后一页。把册子订在一起。' },
      { art: 'library|mom,ming|future|?', en: 'He shows it to his class. They look at every page.', zh: '他拿给班上同学看。大家一页页翻过去。' },
      { art: 'library|mom,ming|future|·', en: 'Lili wants one of her own. Ming gives her a pen.', zh: '丽丽说也想要一本。明明递给她一支笔。' }
    ],
    quiz: [
      { q: '下面哪个词在这一本里读到过？', opts: ['鸭子', '地板', '班'], a: 2, kind: 'recall' },
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
      { art: '📋', en: 'board', zh: '木板' }
    ],
    sight: [],
    newWords: [
      { w: 'important', zh: '重要' }
    ],
    pages: [
      { art: 'library|dad,lili|idea|·', en: 'Ming has a big idea. He wants a reading corner in class.', zh: '明明有个大想法。他想在班里做一个读书角。' },
      { art: 'library|dad,lili|idea|♪', en: 'At first it is not clear. He can only say a few words.', zh: '一开始它不清楚。他只能说出几个词。' },
      { art: 'library|dad,lili|idea|👀', en: 'Ming tells Lili about it. They stand at the gate.', zh: '明明把这事讲给丽丽听。两人站在门口。' },
      { art: 'library|dad,lili|idea|?', en: 'The idea gets clearer. She asks where the books will go.', zh: '想法变清楚了。她问书要放在哪儿。' },
      { art: 'library|dad,lili|idea|·', en: 'Ming writes it down. He draws a small plan on paper.', zh: '明明写下来。他在纸上画了个小计划。' },
      { art: 'library|dad,lili|idea|!', en: 'The whole idea is there. A box, a board, and books.', zh: '整个想法都在那儿了。一个箱子、一块板、还有书。' },
      { art: 'library|dad,lili|idea|♥', en: 'It takes time to grow. Each day he adds one small part.', zh: '它需要时间长大。每天添上一小处。' },
      { art: 'library|dad,lili|idea|★', en: 'But the idea is whole. Nothing important is missing.', zh: '可这个想法是完整的。要紧的都没漏。' },
      { art: 'library|dad,lili|idea|…', en: 'He shows the plan to his teacher. She asks two questions.', zh: '他把计划拿给老师看。老师问了两个问题。' },
      { art: 'library|dad,lili|idea|·', en: 'She suggests one more thing. A small box for the little books.', zh: '她又提了一个建议。给小书加一只小箱子。' },
      { art: 'library|dad,lili|idea|♥', en: 'Ming keeps the idea safe. The paper stays in his bag.', zh: '明明把想法收好。那张纸一直放在包里。' },
      { art: 'library|dad,lili|idea|·', en: 'The idea will help others. The class can share the books.', zh: '这个想法会帮到别人。全班都能分享这些书。' },
      { art: 'library|dad,lili|idea|…', en: 'The whole idea, start to end. They build the corner that week.', zh: '完整的想法，从头到尾。那个星期他们把读书角做起来了。' },
      { art: 'library|dad,lili|idea|?', en: 'It began as three words on a board. Now the corner has a name.', zh: '它起初只是板上的三个词。现在读书角有了名字。' },
      { art: 'library|dad,lili|idea|·', en: 'Lili paints the name on the board. Ming puts the first book in.', zh: '丽丽把名字写到板上。明明放进第一本书。' }
    ],
    quiz: [
      { q: '下面哪个词在这一本里读到过？', opts: ['家', '书包', '草'], a: 1, kind: 'recall' },
      { q: '想法是怎么变清楚的？', opts: ['一下就想清楚了', '说着说着、写着写着，慢慢清楚了', '别人给的'], a: 1, kind: 'infer' },
      { q: '有一个想法但还很模糊，你会怎么做？', opts: ['马上丢掉', '不说', '说出来、写下来，让它慢慢清楚'], a: 2, kind: 'transfer' }
    ]
  }
];

window.BOOKS = BOOKS;
