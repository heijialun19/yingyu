/* ============================================================
   小鸟英语乐园 · 读书馆 v4.4（面向中国学生的受控词汇分级阅读）
   2026-11-16：10 站 × 12 本 = 120 本，1260 页 / 360 题
   篇幅 L1 33 → L10 211 词/本（每页 1 句 → 2 句，L5 起平均 2 句）

   为什么做 v4.3：v4.2 的 120 本已是逐本手写、情节与题目绑定，
   但抽样精读发现两处仍不够一流 ——
   ① 十个级别每页都只有 1 句约 4.6 词，总词数只靠页数堆，
      没有「每页词数」梯度（RAZ A→J 是 4→15+ 词/页）；
   ② L9-L10 的抽象主题册写成了格言集：《小小的变化》通篇没说
      改了什么，《每天一个习惯》十五页没发生一件事。
      一流桥梁书讲道理，一定落在一件具体的事上。

   v4.4 加了第五条铁律（由 _v4_polish.py 落、_verify_v17_static.py 断言）：
   ⑤ 不许自相矛盾、不许讲错科学、不许同一句在相邻页重复出现。
      指标全绿不等于没有错 —— v4.3 的 120 本被从头读到尾时，仍抓出
      「书包在床底下却压在外套下面」「两盆晒同样的太阳却一盆没晒到」
      「蛋糕鼓起来是热气变大」「冬天冷是离太阳远」这类硬伤。

   v4.3 的四条铁律（由 _v4_build.py + _v4_check.py 强制）：
   ① 词汇受控：正文每个词要么此前任何一本出现过，要么本本读前页
      预教，要么是整体认读的骨架词（the / has 这类功能词与本书人名）。
      校验脚本 _v4_check.py 只存在于工作区、不随站发布，所以这条
      在运行时数据上无法复算 —— 改正文后必须回工作区重跑校验。
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
      { q: '东西不见了，你会先做什么？', opts: ['想一想它可能在哪里，再找找', '马上哭一场', '不管它了'], a: 0, kind: 'transfer' }
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
      { q: '猫坐在床上、看着「我」，说明它怎么样？', opts: ['想出去玩', '很安心，不怕人', '饿了'], a: 1, kind: 'infer' },
      { q: '想知道小动物喜欢什么，你会怎么做？', opts: ['一直追它', '静静看它做什么、吃什么', '不理它'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b3', lv: 'L1', tag: '吃饭', title: 'I Eat', zh: '我吃东西',
    emoji: '🍚', color: '#CDE7C6',
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
      { art: 'kitchen|grandma,mom|rice|·', en: 'I have rice. I like rice.', zh: '我有米饭。我喜欢米饭。' },
      { art: 'kitchen|grandma,mom|rice|♪', en: 'The rice is hot. It is too hot to eat.', zh: '米饭很烫。烫得没法吃。' },
      { art: 'kitchen|grandma,mom|rice|👀', en: 'I have an apple too.', zh: '我还有一个苹果。' },
      { art: 'kitchen|grandma,mom|rice|?', en: 'I eat the apple first.', zh: '我先吃苹果。' },
      { art: 'kitchen|grandma,mom|rice|·', en: 'Now the rice is not too hot.', zh: '现在米饭不烫了。' },
      { art: 'kitchen|grandma,mom|rice|!', en: 'I eat and eat. I am happy.', zh: '我吃啊吃。我很开心。' }
    ],
    quiz: [
      { q: '米饭太烫的时候，明明先吃了什么？', opts: ['一个苹果', '一个鸡蛋', '一块面包'], a: 0, kind: 'recall' },
      { q: '明明为什么先吃苹果？', opts: ['因为他不喜欢米饭', '米饭太烫，得等它凉一点', '因为苹果更甜'], a: 1, kind: 'infer' },
      { q: '吃东西时，你会怎么做？', opts: ['慢慢吃，尝尝味道', '一口全吞下去', '不吃了'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b4', lv: 'L1', tag: '上学', title: 'My Bag', zh: '我的书包',
    emoji: '🎒', color: '#C6DEF6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 5 个新词（书包、笔、球、满、拿）。',
    trap: '这一级是整体认读：词不用拼，先听整句，再跟着说；别一个字母一个字母念。',
    summary: '《我的书包》：这是一个完整的小故事。读前先看词卡（书包、笔、球、满、拿）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '指着分镜，用英文说出这一页的东西，再把整本连起来读一遍。',
    think: '说说你的书包里有什么。',
    pre: [
      { art: '🎒', en: 'bag', zh: '书包' },
      { art: '🖊️', en: 'pen', zh: '笔' },
      { art: '⚽', en: 'ball', zh: '球' },
      { art: '✨', en: 'full', zh: '满' },
      { art: '🏃', en: 'take', zh: '拿' },
      { art: '📖', en: 'book', zh: '书' }
    ],
    sight: [],
    newWords: [
      { w: 'bag', zh: '书包' },
      { w: 'pen', zh: '笔' },
      { w: 'ball', zh: '球' },
      { w: 'full', zh: '满' },
      { w: 'take', zh: '拿' }
    ],
    pages: [
      { art: 'home|grandpa,dad|bag|·', en: 'I have a bag. My bag is big.', zh: '我有一个书包。我的书包很大。' },
      { art: 'home|grandpa,dad|bag|♪', en: 'I put a pen in my bag.', zh: '我把一支笔放进书包。' },
      { art: 'home|grandpa,dad|bag|👀', en: 'I put a book in my bag too.', zh: '我还把一本书放进书包。' },
      { art: 'home|grandpa,dad|bag|?', en: 'I put my ball in it. Now the bag is too full!', zh: '我把球也放进去。现在包太满了！' },
      { art: 'home|grandpa,dad|bag|·', en: 'I take the ball out.', zh: '我把球拿出来。' },
      { art: 'home|grandpa,dad|bag|!', en: 'My bag is just right now.', zh: '我的书包现在刚好。' }
    ],
    quiz: [
      { q: '书包太满了，明明把什么拿了出来？', opts: ['球', '书', '笔'], a: 0, kind: 'recall' },
      { q: '书包为什么变得太鼓了？', opts: ['因为明明把球也塞了进去', '因为装了太多书', '因为书包本来就小'], a: 0, kind: 'infer' },
      { q: '想找书包里的东西，你会怎么做？', opts: ['把东西全倒出来', '打开书包，一样一样看一看', '不找了'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b5', lv: 'L1', tag: '想象', title: 'The Cat Can Talk', zh: '会说话的猫',
    emoji: '🐱', color: '#E0CFF3',
    track: 'fantasy',
    goal: '跟着一个想象出来的故事，把来龙去脉读顺。认读 3 个新词（说、你好、鱼）。',
    trap: '这一级是整体认读：词不用拼，先听整句，再跟着说；别一个字母一个字母念。',
    summary: '《会说话的猫》：这是一个完整的小故事。读前先看词卡（说、你好、鱼）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '指着分镜，用英文说出这一页的东西，再把整本连起来读一遍。',
    think: '如果你的玩具会说话，你想跟它聊什么？',
    pre: [
      { art: '🏃', en: 'talk', zh: '说' },
      { art: '💡', en: 'hello', zh: '你好' },
      { art: '🐟', en: 'fish', zh: '鱼' },
      { art: '🐱', en: 'cat', zh: '猫' }
    ],
    sight: ['birds', 'talking'],
    newWords: [
      { w: 'talk', zh: '说' },
      { w: 'hello', zh: '你好' },
      { w: 'fish', zh: '鱼' }
    ],
    pages: [
      { art: 'library|mom,ming|talk|·', en: 'Ming has a cat.', zh: '明明有一只猫。' },
      { art: 'library|mom,ming|talk|♪', en: 'The cat is small and happy.', zh: '这只猫小小的，很开心。' },
      { art: 'library|mom,ming|talk|👀', en: 'One day, the cat talks.', zh: '有一天，猫开口说话了。' },
      { art: 'library|mom,ming|talk|?', en: 'The cat says hello to Ming.', zh: '猫跟明明打了个招呼。' },
      { art: 'library|mom,ming|talk|·', en: 'They talk about fish and birds.', zh: '他们聊起了鱼和小鸟。' },
      { art: 'library|mom,ming|talk|!', en: 'Ming likes his talking cat.', zh: '明明喜欢这只爱说话的猫。' }
    ],
    quiz: [
      { q: '猫和明明聊了什么？', opts: ['帽子和书包', '米饭和苹果', '鱼和小鸟'], a: 2, kind: 'recall' },
      { q: '明明为什么喜欢这只猫？', opts: ['因为猫会跟他说话', '很生气', '很害怕'], a: 0, kind: 'infer' },
      { q: '听到一件让人吃惊的事，你会怎么做？', opts: ['捂住耳朵不听', '先听一听，再想一想', '马上跑开'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b6', lv: 'L1', tag: '韵文', title: 'Big Pig', zh: '大大的猪',
    emoji: '🐷', color: '#F6C9E3',
    track: 'rhyme',
    goal: '读一首小韵文，听清每一句句末的韵脚。认读 2 个新词（猪、难过）。',
    trap: '这一级是整体认读：词不用拼，先听整句，再跟着说；别一个字母一个字母念。',
    summary: '《大大的猪》：这是一个完整的小故事。读前先看词卡（猪、难过）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '指着分镜，用英文说出这一页的东西，再把整本连起来读一遍。',
    think: '如果小猪会说话，你想对它说什么？',
    pre: [
      { art: '🐷', en: 'pig', zh: '猪' },
      { art: '😢', en: 'sad', zh: '难过' },
      { art: '⚽', en: 'ball', zh: '球' }
    ],
    sight: [],
    newWords: [
      { w: 'pig', zh: '猪' },
      { w: 'sad', zh: '难过' }
    ],
    pages: [
      { art: 'farm|dad,lili|pig|·', en: 'The pig is big.', zh: '这头猪大大的。' },
      { art: 'farm|dad,lili|pig|♪', en: 'I can see a big pig.', zh: '我看见了一头大大的猪。' },
      { art: 'farm|dad,lili|pig|👀', en: 'The pig has a ball.', zh: '大猪有一个球。' },
      { art: 'farm|dad,lili|pig|?', en: 'It is a very small ball.', zh: '这是个小小的球。' },
      { art: 'farm|dad,lili|pig|·', en: 'The ball is too small, and he is sad.', zh: '球太小了，他难过起来。' },
      { art: 'farm|dad,lili|pig|!', en: 'Dad has a big ball, and the pig is glad!', zh: '爸爸有个大球，大猪开心极了！' }
    ],
    quiz: [
      { q: '小猪的球怎么样？', opts: ['是红色的', '很小', '很大'], a: 1, kind: 'recall' },
      { q: '小猪后来为什么开心起来了？', opts: ['他不想要球了', '球自己变大了', '爸爸有个大球'], a: 2, kind: 'infer' },
      { q: '心里难过的时候，你会怎么做？', opts: ['一个人躲起来不说', '找爸爸妈妈说一说', '把东西乱扔'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b7', lv: 'L1', tag: '身体', title: 'My Hands', zh: '我的手',
    emoji: '🤲', color: '#BFE6DF',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。认读 4 个新词（拍手、握着、洗、水）。',
    trap: '这一级是整体认读：词不用拼，先听整句，再跟着说；别一个字母一个字母念。',
    summary: '《我的手》：这一本从一件小事讲起，说说为什么会这样。读前先看词卡（拍手、握着、洗、水）；读的时候留意先看到什么、为什么会这样、后来怎么弄明白。',
    retell: '合上书，按「先看到什么 → 为什么会这样 → 后来怎么弄明白」讲一遍。',
    think: '说说你的手今天帮你做了什么。',
    pre: [
      { art: '🏃', en: 'clap', zh: '拍手' },
      { art: '🏃', en: 'hold', zh: '握着' },
      { art: '🏃', en: 'wash', zh: '洗' },
      { art: '💧', en: 'water', zh: '水' },
      { art: '⚽', en: 'ball', zh: '球' }
    ],
    sight: ['eat'],
    newWords: [
      { w: 'clap', zh: '拍手' },
      { w: 'hold', zh: '握着' },
      { w: 'wash', zh: '洗' },
      { w: 'water', zh: '水' }
    ],
    pages: [
      { art: 'library|ming,grandma|hand|·', en: 'I have two hands.', zh: '我有两只手。' },
      { art: 'library|ming,grandma|hand|♪', en: 'I can clap my hands.', zh: '我会拍手。' },
      { art: 'library|ming,grandma|hand|👀', en: 'My hands can hold a ball.', zh: '我的手能拿住球。' },
      { art: 'library|ming,grandma|hand|?', en: 'I wash my hands with water.', zh: '我用水洗手。' },
      { art: 'library|ming,grandma|hand|·', en: 'My hands help me eat.', zh: '吃饭也离不开手。' },
      { art: 'library|ming,grandma|hand|!', en: 'I like my two hands.', zh: '我很喜欢我的手。' }
    ],
    quiz: [
      { q: '「我」用什么洗手？', opts: ['牛奶', '汤', '水'], a: 2, kind: 'recall' },
      { q: '手能拍手、拿球、洗手，说明手怎么样？', opts: ['手能帮我们做很多事', '手是用来走路的', '手只能吃东西'], a: 0, kind: 'infer' },
      { q: '吃饭前，你会先做什么？', opts: ['先去玩一会儿', '把手洗干净', '什么都不用做'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b8', lv: 'L1', tag: '动物', title: 'Where Animals Live', zh: '动物住在哪里',
    emoji: '🏠', color: '#F2E2A8',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。认读 4 个新词（动物、蚂蚁、地面、农场）。',
    trap: '这一级是整体认读：词不用拼，先听整句，再跟着说；别一个字母一个字母念。',
    summary: '《动物住在哪里》：这一本从一件小事讲起，说说为什么会这样。读前先看词卡（动物、蚂蚁、地面、农场）；读的时候留意先看到什么、为什么会这样、后来怎么弄明白。',
    retell: '合上书，按「先看到什么 → 为什么会这样 → 后来怎么弄明白」讲一遍。',
    think: '说说你知道的一种小动物：它住在哪里？',
    pre: [
      { art: '🐾', en: 'animal', zh: '动物' },
      { art: '🐜', en: 'ant', zh: '蚂蚁' },
      { art: '🌿', en: 'ground', zh: '地面' },
      { art: '🚜', en: 'farm', zh: '农场' },
      { art: '🏠', en: 'home', zh: '家' },
      { art: '🐟', en: 'fish', zh: '鱼' }
    ],
    sight: ['birds', 'farms', 'fish', 'trees', 'water'],
    newWords: [
      { w: 'animal', zh: '动物' },
      { w: 'ant', zh: '蚂蚁' },
      { w: 'ground', zh: '地面' },
      { w: 'farm', zh: '农场' }
    ],
    pages: [
      { art: 'library|lili,grandpa|home|·', en: 'Every animal has a home.', zh: '每种动物都有自己的家。' },
      { art: 'library|lili,grandpa|home|♪', en: 'Birds are at home in the trees.', zh: '鸟儿的家在树上。' },
      { art: 'library|lili,grandpa|home|👀', en: 'Fish are at home in the water.', zh: '鱼儿的家在水里。' },
      { art: 'library|lili,grandpa|home|?', en: 'Ants are at home in the ground.', zh: '蚂蚁的家在地下。' },
      { art: 'library|lili,grandpa|home|·', en: 'Pigs are at home on farms.', zh: '猪的家在农场上。' },
      { art: 'library|lili,grandpa|home|!', en: 'I am happy at home.', zh: '在家里，我很开心。' }
    ],
    quiz: [
      { q: '蚂蚁的家在哪里？', opts: ['树上', '水里', '地下'], a: 2, kind: 'recall' },
      { q: '鸟儿住树上，鱼儿住水里，这说明什么？', opts: ['动物都没有自己的家', '动物都住在树上', '不同的动物住在不同的地方'], a: 2, kind: 'infer' },
      { q: '看到一只小鸟，你会怎么对它？', opts: ['追着它跑', '让它留在自己的家里', '把它抓回家'], a: 1, kind: 'transfer' }
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
      { q: 'hat 开头是哪个音？', opts: ['a 的音', 't 的音', 'h 的音'], a: 2, kind: 'infer' },
      { q: '遇到一个新单词，你会怎么做？', opts: ['不敢说', '跳过去', '跟着大声说出来'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b10', lv: 'L1', tag: '认物', title: 'This Is a Book', zh: '这是一本书',
    emoji: '📖', color: '#FAD3B6',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。认读 1 个新词（太阳）。',
    trap: '这一级是整体认读：词不用拼，先听整句，再跟着说；别一个字母一个字母念。',
    summary: '《这是一本书》：这一本从一件小事讲起，说说为什么会这样。读前先看词卡（太阳）；读的时候留意先看到什么、为什么会这样、后来怎么弄明白。',
    retell: '合上书，按「先看到什么 → 为什么会这样 → 后来怎么弄明白」讲一遍。',
    think: '说说你读过的一本书里有什么。',
    pre: [
      { art: '☀️', en: 'sun', zh: '太阳' },
      { art: '📖', en: 'book', zh: '书' },
      { art: '🐱', en: 'cat', zh: '猫' }
    ],
    sight: [],
    newWords: [
      { w: 'sun', zh: '太阳' }
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
      { q: '这本书里既有猫又有太阳，画的大概是什么时候？', opts: ['夜里', '白天', '下雨天'], a: 1, kind: 'infer' },
      { q: '读书的时候，你会怎么做？', opts: ['随便翻翻就合上', '不看', '一页一页慢慢看'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b11', lv: 'L1', tag: '认物', title: 'Water and Rice', zh: '水和米饭',
    emoji: '💧', color: '#C8E7F0',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。认读 2 个新词（喝、杯子）。',
    trap: '这一级是整体认读：词不用拼，先听整句，再跟着说；别一个字母一个字母念。',
    summary: '《水和米饭》：这一本从一件小事讲起，说说为什么会这样。读前先看词卡（喝、杯子）；读的时候留意先看到什么、为什么会这样、后来怎么弄明白。',
    retell: '合上书，按「先看到什么 → 为什么会这样 → 后来怎么弄明白」讲一遍。',
    think: '说说你吃饭时会喝什么、吃什么。',
    pre: [
      { art: '🏃', en: 'drink', zh: '喝' },
      { art: '🥛', en: 'cup', zh: '杯子' },
      { art: '💧', en: 'water', zh: '水' },
      { art: '🍚', en: 'rice', zh: '米饭' }
    ],
    sight: ['eat', 'water'],
    newWords: [
      { w: 'drink', zh: '喝' },
      { w: 'cup', zh: '杯子' }
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
      { q: '明明先喝了什么？', opts: ['水', '米饭', '汤'], a: 0, kind: 'recall' },
      { q: '明明又喝水又吃饭，说明他当时怎么样？', opts: ['已经很饱', '想睡觉', '又渴又饿'], a: 2, kind: 'infer' },
      { q: '吃饭的时候，你会怎么做？', opts: ['一边跑一边吃', '坐好，慢慢吃', '不吃了'], a: 1, kind: 'transfer' }
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
      { q: '盒子里有什么？', opts: ['书和笔', '帽子和杯子', '球和盘子'], a: 1, kind: 'recall' },
      { q: '帽子和杯子都放进盒子，盒子会怎么样？', opts: ['装得满满的', '变轻了', '不见了'], a: 0, kind: 'infer' },
      { q: '想记住几样东西，你会怎么做？', opts: ['随便乱放', '把它们放在一起，一起看', '不记了'], a: 1, kind: 'transfer' }
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
      { art: '🐷', en: 'pig', zh: '猪' },
      { art: '☀️', en: 'sun', zh: '太阳' }
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
      { art: 'farm|ming,grandma|pig|♥', en: 'They sit in the sun together. Now they are friends.', zh: '它们一起坐在太阳下。现在他们是朋友了。' }
    ],
    quiz: [
      { q: '母鸡为什么跑开了？', opts: ['她饿了', '她害怕猪', '她去找吃的'], a: 1, kind: 'recall' },
      { q: '猪和母鸡最后怎么了？', opts: ['它们打了一架', '它们各自走了', '它们成了朋友'], a: 2, kind: 'infer' },
      { q: '想和小动物交朋友，你会怎么做？', opts: ['追着它跑', '吓它一跳', '轻轻靠近，对它好'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b14', lv: 'L2', tag: '天气', title: 'Mud and Fog', zh: '泥和雾',
    emoji: '🌫️', color: '#F9DFB4',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 7 个新词（雾、路、湿、泥、腿、打扫）。',
    trap: '短元音要收住韵尾：cap 的 p 是双唇轻轻一闭，不要加「呃」读成「卡普呃」。',
    summary: '《泥和雾》：这是一个完整的小故事。读前先看词卡（雾、路、湿、泥、腿、打扫）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '指着分镜，用英文说出这一页的东西，再把整本连起来读一遍。',
    think: '说说一个有雾或下雨的日子。',
    pre: [
      { art: '🌫️', en: 'fog', zh: '雾' },
      { art: '🛣️', en: 'road', zh: '路' },
      { art: '✨', en: 'wet', zh: '湿' },
      { art: '🟤', en: 'mud', zh: '泥' },
      { art: '✋', en: 'leg', zh: '腿' },
      { art: '🏃', en: 'clean', zh: '打扫' },
      { art: '✨', en: 'dry', zh: '干' },
      { art: '🏠', en: 'home', zh: '家' }
    ],
    sight: ['wash'],
    newWords: [
      { w: 'fog', zh: '雾' },
      { w: 'road', zh: '路' },
      { w: 'wet', zh: '湿' },
      { w: 'mud', zh: '泥' },
      { w: 'leg', zh: '腿' },
      { w: 'clean', zh: '打扫' },
      { w: 'dry', zh: '干' }
    ],
    pages: [
      { art: 'farm|lili,grandpa|mud|·', en: 'There is fog. The day is cold.', zh: '有雾。天冷冷的。' },
      { art: 'farm|lili,grandpa|mud|♪', en: 'The road is wet. I see mud.', zh: '路上湿湿的。我看见泥。' },
      { art: 'farm|lili,grandpa|mud|👀', en: 'My leg is in the mud!', zh: '我的腿踩进泥里了！' },
      { art: 'farm|lili,grandpa|mud|?', en: 'I am not happy. The mud is cold.', zh: '我不高兴。泥是凉的。' },
      { art: 'farm|lili,grandpa|mud|·', en: 'I go home and wash my leg.', zh: '我回家用水冲腿。' },
      { art: 'farm|lili,grandpa|mud|!', en: 'Now my leg is clean.', zh: '现在腿干净了。' },
      { art: 'farm|lili,grandpa|mud|♥', en: 'I wait for a dry day.', zh: '我等着干燥的一天。' }
    ],
    quiz: [
      { q: '明明的腿怎么了？', opts: ['被雨淋湿了', '踩进泥里了', '摔破了'], a: 1, kind: 'recall' },
      { q: '为什么路上有泥？', opts: ['因为天上有雾', '因为太阳很大', '因为路上是湿的'], a: 2, kind: 'infer' },
      { q: '路又湿又滑，你会怎么做？', opts: ['不管它', '拔腿就跑', '慢慢走，小心一点'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b15', lv: 'L2', tag: '厨房', title: 'A Big Pot', zh: '一口大锅',
    emoji: '🍲', color: '#CDE7C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 4 个新词（锅、厨房、盖子、微笑）。',
    trap: '短元音要收住韵尾：cap 的 p 是双唇轻轻一闭，不要加「呃」读成「卡普呃」。',
    summary: '《一口大锅》：这是一个完整的小故事。读前先看词卡（锅、厨房、盖子、微笑）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '指着分镜，用英文说出这一页的东西，再把整本连起来读一遍。',
    think: '说说你家厨房里的一样东西。',
    pre: [
      { art: '🍲', en: 'pot', zh: '锅' },
      { art: '🍳', en: 'kitchen', zh: '厨房' },
      { art: '📦', en: 'lid', zh: '盖子' },
      { art: '🏃', en: 'smile', zh: '微笑' },
      { art: '✋', en: 'hand', zh: '手' }
    ],
    sight: ['smiles'],
    newWords: [
      { w: 'pot', zh: '锅' },
      { w: 'kitchen', zh: '厨房' },
      { w: 'lid', zh: '盖子' },
      { w: 'smile', zh: '微笑' }
    ],
    pages: [
      { art: 'kitchen|grandma,mom|pot|·', en: 'I see a big pot. It is in the kitchen.', zh: '我看见一个大锅。它在厨房里。' },
      { art: 'kitchen|grandma,mom|pot|♪', en: 'The pot is hot. A lid is on it.', zh: '锅很烫。上面盖着盖子。' },
      { art: 'kitchen|grandma,mom|pot|👀', en: 'I want to look in the pot.', zh: '我想看看锅里。' },
      { art: 'kitchen|grandma,mom|pot|?', en: 'I put my hand on the lid. It is hot!', zh: '我把手放在盖子上。好烫！' },
      { art: 'kitchen|grandma,mom|pot|·', en: 'I do not put my hand there again.', zh: '我不再把手放上去了。' },
      { art: 'kitchen|grandma,mom|pot|!', en: 'Mom comes in. She looks in the pot.', zh: '妈妈进来。她看了看锅里。' },
      { art: 'kitchen|grandma,mom|pot|♥', en: 'Mom puts the lid back on. She smiles at me.', zh: '妈妈把盖子盖回去。她朝我笑了笑。' }
    ],
    quiz: [
      { q: '明明的手为什么缩了回来？', opts: ['盖子很烫', '妈妈不让他碰', '锅太高了'], a: 0, kind: 'recall' },
      { q: '明明为什么不再把手放到盖子上了？', opts: ['锅太高了够不着', '盖子很烫，会烫到手', '妈妈不让他碰'], a: 1, kind: 'infer' },
      { q: '锅很烫的时候，你会怎么做？', opts: ['不管它', '离远一点，别碰它', '伸手摸一摸'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b16', lv: 'L2', tag: '早餐', title: 'Jam on a Bun', zh: '面包上的果酱',
    emoji: '🍞', color: '#C6DEF6',
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
      { art: 'kitchen|grandpa,dad|jam|·', en: 'I see a bun. I put jam on the bun.', zh: '我看见一个面包。我把果酱抹上去。' },
      { art: 'kitchen|grandpa,dad|jam|♪', en: 'The jam is good. I eat the bun.', zh: '果酱很好吃。我吃面包。' },
      { art: 'kitchen|grandpa,dad|jam|👀', en: 'Now I have jam on my hand!', zh: '现在果酱弄到手上了！' },
      { art: 'kitchen|grandpa,dad|jam|?', en: 'I do not like that. My hand is red.', zh: '我不喜欢这样。手变红了。' },
      { art: 'kitchen|grandpa,dad|jam|·', en: 'I put my hand in water.', zh: '我把手放进水里。' },
      { art: 'kitchen|grandpa,dad|jam|!', en: 'Now my hand is clean.', zh: '现在手干净了。' },
      { art: 'kitchen|grandpa,dad|jam|♥', en: 'I like jam on a bun.', zh: '我喜欢面包上的果酱。' }
    ],
    quiz: [
      { q: '明明的手怎么了？', opts: ['沾上了果酱', '被水弄湿了', '弄上了泥'], a: 0, kind: 'recall' },
      { q: '果酱弄到手上，「我」为什么不喜欢？', opts: ['手黏黏的，弄脏了', '果酱不好吃', '手很疼'], a: 0, kind: 'infer' },
      { q: '自己做吃的，你会怎么做？', opts: ['先看看有什么，放一点尝尝', '不做了', '乱放一通'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b17', lv: 'L2', tag: '好笑', title: 'The Hat in the Soup', zh: '汤里的帽子',
    emoji: '🍲', color: '#E0CFF3',
    track: 'humor',
    goal: '跟着一个好笑的故事读到最后，看看笑点在哪儿。认读 2 个新词（汤、笑）。',
    trap: '短元音要收住韵尾：cap 的 p 是双唇轻轻一闭，不要加「呃」读成「卡普呃」。',
    summary: '《汤里的帽子》：这是一个完整的小故事。读前先看词卡（汤、笑）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '指着分镜，用英文说出这一页的东西，再把整本连起来读一遍。',
    think: '说说你遇到过的一件好笑的事。',
    pre: [
      { art: '🍲', en: 'soup', zh: '汤' },
      { art: '🏃', en: 'laugh', zh: '笑' },
      { art: '🎩', en: 'hat', zh: '帽子' }
    ],
    sight: [],
    newWords: [
      { w: 'soup', zh: '汤' },
      { w: 'laugh', zh: '笑' }
    ],
    pages: [
      { art: 'home|mom,ming|hat|·', en: 'Dad has a big hat.', zh: '爸爸有一顶大帽子。' },
      { art: 'home|mom,ming|hat|♪', en: 'It is time for soup.', zh: '该喝汤啦。' },
      { art: 'home|mom,ming|hat|👀', en: 'Mom puts the soup on the table.', zh: '妈妈把汤端上了桌。' },
      { art: 'home|mom,ming|hat|?', en: 'Dad puts his hat on the table.', zh: '爸爸把帽子放在桌上。' },
      { art: 'home|mom,ming|hat|·', en: 'The hat falls into the soup.', zh: '帽子掉进了汤里。' },
      { art: 'home|mom,ming|hat|!', en: 'We laugh and laugh at the hat.', zh: '我们看着帽子，笑个不停。' },
      { art: 'home|mom,ming|hat|♥', en: 'Dad laughs and puts the wet hat on.', zh: '爸爸也笑了，把湿帽子戴了回去。' }
    ],
    quiz: [
      { q: '帽子掉进了什么里？', opts: ['水', '汤', '牛奶'], a: 1, kind: 'recall' },
      { q: '爸爸笑着把湿帽子戴回去，说明他怎么样？', opts: ['他找不到别的帽子', '他想把汤带回家', '他一点也不生气'], a: 2, kind: 'infer' },
      { q: '吃饭时有东西掉进碗里，你会怎么做？', opts: ['大叫一声', '不管它接着吃', '先拿开，再想想怎么办'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b18', lv: 'L2', tag: '想象', title: 'The Bag Walks to School', zh: '书包自己去上学',
    emoji: '🎒', color: '#F6C9E3',
    track: 'fantasy',
    goal: '跟着一个想象出来的故事，把来龙去脉读顺。认读 3 个新词（街道、桌子、走）。',
    trap: '短元音要收住韵尾：cap 的 p 是双唇轻轻一闭，不要加「呃」读成「卡普呃」。',
    summary: '《书包自己去上学》：这是一个完整的小故事。读前先看词卡（街道、桌子、走）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '指着分镜，用英文说出这一页的东西，再把整本连起来读一遍。',
    think: '如果你的书包会走路，你想让它去哪里？',
    pre: [
      { art: '🛣️', en: 'street', zh: '街道' },
      { art: '📦', en: 'desk', zh: '桌子' },
      { art: '🏃', en: 'walk', zh: '走' },
      { art: '🎒', en: 'bag', zh: '书包' },
      { art: '🏠', en: 'home', zh: '家' }
    ],
    sight: [],
    newWords: [
      { w: 'street', zh: '街道' },
      { w: 'desk', zh: '桌子' },
      { w: 'walk', zh: '走' }
    ],
    pages: [
      { art: 'home|dad,lili|bag|·', en: 'Ming has a big red bag.', zh: '明明有一个又大又红的书包。' },
      { art: 'home|dad,lili|bag|♪', en: 'The bag likes school.', zh: '书包喜欢上学。' },
      { art: 'home|dad,lili|bag|👀', en: 'One morning the bag walks to school.', zh: '一天早上，书包自己走去学校。' },
      { art: 'home|dad,lili|bag|?', en: 'The bag goes down the street.', zh: '书包沿着街道往前走。' },
      { art: 'home|dad,lili|bag|·', en: 'The bag sits under a desk.', zh: '书包在一张课桌下坐好了。' },
      { art: 'home|dad,lili|bag|!', en: 'Ming sees the bag at school.', zh: '明明在学校看到了书包。' },
      { art: 'home|dad,lili|bag|♥', en: 'They walk home together.', zh: '他们一起走回家。' }
    ],
    quiz: [
      { q: '书包早上自己去了哪里？', opts: ['公园', '商店', '学校'], a: 2, kind: 'recall' },
      { q: '书包为什么坐在课桌下？', opts: ['它像小学生一样来上课了', '有人把它放在那儿', '它想躲在桌子下面'], a: 0, kind: 'infer' },
      { q: '上学前发现书包不见了，你会怎么做？', opts: ['不管它了', '哭一场', '想一想它可能在哪里，再去找'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b19', lv: 'L2', tag: '自然', title: 'Day and Night', zh: '白天和黑夜',
    emoji: '🌙', color: '#BFE6DF',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。认读 4 个新词（高、月亮、星星、睡觉）。',
    trap: '短元音要收住韵尾：cap 的 p 是双唇轻轻一闭，不要加「呃」读成「卡普呃」。',
    summary: '《白天和黑夜》：这一本从一件小事讲起，说说为什么会这样。读前先看词卡（高、月亮、星星、睡觉）；读的时候留意先看到什么、为什么会这样、后来怎么弄明白。',
    retell: '合上书，按「先看到什么 → 为什么会这样 → 后来怎么弄明白」讲一遍。',
    think: '白天和黑夜，你更喜欢哪一个？说说为什么。',
    pre: [
      { art: '✨', en: 'high', zh: '高' },
      { art: '🌙', en: 'moon', zh: '月亮' },
      { art: '⭐', en: 'star', zh: '星星' },
      { art: '🏃', en: 'sleep', zh: '睡觉' },
      { art: '☀️', en: 'sun', zh: '太阳' },
      { art: '🌿', en: 'sky', zh: '天空' }
    ],
    sight: ['sky', 'stars'],
    newWords: [
      { w: 'high', zh: '高' },
      { w: 'moon', zh: '月亮' },
      { w: 'star', zh: '星星' },
      { w: 'sleep', zh: '睡觉' }
    ],
    pages: [
      { art: 'night|ming,grandma|night|·', en: 'The sun comes up in the morning.', zh: '太阳早晨升起来。' },
      { art: 'night|ming,grandma|night|♪', en: 'Now it is day.', zh: '现在是白天。' },
      { art: 'night|ming,grandma|night|👀', en: 'The sun is high in the sky.', zh: '太阳高高地挂在天上。' },
      { art: 'night|ming,grandma|night|?', en: 'Then the sun goes down.', zh: '接着，太阳落下去了。' },
      { art: 'night|ming,grandma|night|·', en: 'Now it is night.', zh: '现在是黑夜。' },
      { art: 'night|ming,grandma|night|!', en: 'The moon comes up and stars come out.', zh: '月亮升起来，星星也出来了。' },
      { art: 'night|ming,grandma|night|♥', en: 'We sleep at night.', zh: '我们在夜里睡觉。' }
    ],
    quiz: [
      { q: '早晨升起来的是什么？', opts: ['月亮', '太阳', '星星'], a: 1, kind: 'recall' },
      { q: '月亮出来的时候，太阳在哪儿？', opts: ['太阳刚刚升出来', '太阳还高高地挂在天上', '太阳早就不在天上了'], a: 2, kind: 'infer' },
      { q: '天黑了，你会怎么做？', opts: ['准备洗漱，按时睡觉', '出去跑步', '再吃一顿饭'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b20', lv: 'L2', tag: '食物', title: 'An Egg', zh: '一个鸡蛋',
    emoji: '🥚', color: '#F2E2A8',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。认读 3 个新词（圆、小鸡、做饭）。',
    trap: '短元音要收住韵尾：cap 的 p 是双唇轻轻一闭，不要加「呃」读成「卡普呃」。',
    summary: '《一个鸡蛋》：这一本从一件小事讲起，说说为什么会这样。读前先看词卡（圆、小鸡、做饭）；读的时候留意先看到什么、为什么会这样、后来怎么弄明白。',
    retell: '合上书，按「先看到什么 → 为什么会这样 → 后来怎么弄明白」讲一遍。',
    think: '说说你吃过的鸡蛋：它是怎么做的？',
    pre: [
      { art: '✨', en: 'round', zh: '圆' },
      { art: '📦', en: 'chick', zh: '小鸡' },
      { art: '🏃', en: 'cook', zh: '做饭' },
      { art: '🥚', en: 'egg', zh: '鸡蛋' },
      { art: '🐔', en: 'hen', zh: '母鸡' }
    ],
    sight: ['cooks', 'eat'],
    newWords: [
      { w: 'round', zh: '圆' },
      { w: 'chick', zh: '小鸡' },
      { w: 'cook', zh: '做饭' }
    ],
    pages: [
      { art: 'library|lili,grandpa|egg|·', en: 'This egg is from a hen.', zh: '这颗鸡蛋是母鸡下的。' },
      { art: 'library|lili,grandpa|egg|♪', en: 'The egg is small and round.', zh: '鸡蛋小小的、圆圆的。' },
      { art: 'library|lili,grandpa|egg|👀', en: 'Some eggs have a baby chick inside.', zh: '有的鸡蛋里住着鸡宝宝。' },
      { art: 'library|lili,grandpa|egg|?', en: 'The chick comes out of the egg.', zh: '小鸡从蛋里孵出来了。' },
      { art: 'library|lili,grandpa|egg|·', en: 'We can eat eggs too.', zh: '鸡蛋也可以吃。' },
      { art: 'library|lili,grandpa|egg|!', en: 'Mom cooks eggs for me.', zh: '妈妈给我做鸡蛋。' },
      { art: 'library|lili,grandpa|egg|♥', en: 'I like eggs very much.', zh: '我很喜欢吃鸡蛋。' }
    ],
    quiz: [
      { q: '小鸡是从哪儿出来的？', opts: ['从石头里', '从鸡蛋里', '从口袋里'], a: 1, kind: 'recall' },
      { q: '有的蛋能吃，有的蛋能孵出小鸡，这是为什么？', opts: ['有鸡宝宝的蛋孵小鸡，没鸡宝宝的可以吃', '因为蛋有大有小', '因为蛋有白的也有棕的'], a: 0, kind: 'infer' },
      { q: '看到没见过的东西，你会怎么做？', opts: ['直接尝一口', '先问问大人它是什么', '马上扔掉'], a: 1, kind: 'transfer' }
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
      { art: 'table|grandma,mom|pen|!', en: 'A pen is not a pin.', zh: '笔不是别针。' },
      { art: 'table|grandma,mom|pen|♥', en: 'Good!', zh: '真棒！' }
    ],
    quiz: [
      { q: '这一本在比哪两个词？', opts: ['pen 和 pan', 'pen 和 pin', 'pin 和 pig'], a: 1, kind: 'recall' },
      { q: 'pen 和 pin 差在哪个音？', opts: ['中间的 e 和 i', '开头的 p', '结尾的 n'], a: 0, kind: 'infer' },
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
      { art: '🌰', en: 'nut', zh: '坚果' },
      { art: '🏠', en: 'home', zh: '家' }
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
      { art: 'kitchen|grandpa,dad|nut|·', en: 'The ant pulls the nut to its home.', zh: '蚂蚁把坚果拉回家。' },
      { art: 'kitchen|grandpa,dad|nut|!', en: 'The ant is happy.', zh: '蚂蚁很开心。' },
      { art: 'kitchen|grandpa,dad|nut|♥', en: 'A nut for the ant!', zh: '给蚂蚁的坚果！' }
    ],
    quiz: [
      { q: '蚂蚁找到了什么？', opts: ['一块面包', '一个苹果', '一颗坚果'], a: 2, kind: 'recall' },
      { q: '这颗坚果对蚂蚁来说怎么样？', opts: ['很大，搬起来不容易', '小得看不见', '一点也不好吃'], a: 0, kind: 'infer' },
      { q: '东西很重、很难搬，你会怎么做？', opts: ['直接放弃', '乱扔', '一点一点搬，或者找人帮忙'], a: 2, kind: 'transfer' }
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
      { q: '东西湿了，你会怎么做？', opts: ['塞进柜子里', '放到有太阳或通风的地方晾干', '不管它'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b24', lv: 'L2', tag: '复习', title: 'The Shop on the Hill', zh: '山上的小店',
    emoji: '🏪', color: '#E8D9B5',
    track: 'review',
    goal: '把本级和前面级别的词再读一遍、串成一个故事。认读 2 个新词（小店、小山）。',
    trap: '短元音要收住韵尾：cap 的 p 是双唇轻轻一闭，不要加「呃」读成「卡普呃」。',
    summary: '《山上的小店》：这是一个完整的小故事。读前先看词卡（小店、小山）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '指着分镜，用英文说出这一页的东西，再把整本连起来读一遍。',
    think: '说说你去过的一家小店：它卖什么？',
    pre: [
      { art: '🏪', en: 'shop', zh: '小店' },
      { art: '🌿', en: 'hill', zh: '小山' },
      { art: '🍞', en: 'bun', zh: '小面包' },
      { art: '🍯', en: 'jam', zh: '果酱' }
    ],
    sight: [],
    newWords: [
      { w: 'shop', zh: '小店' },
      { w: 'hill', zh: '小山' }
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
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 5 个新词（轮船、沙滩、风、强壮、转）。',
    trap: 'sh 把嘴唇撅圆、th 把舌尖轻轻放在上下门牙中间；ck 只发一个 k，别读两遍。',
    summary: '《大轮船》：这是一个完整的小故事。读前先看词卡（轮船、沙滩、风、强壮、转）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，按「开头 → 后来 → 最后」把这件事讲一遍。',
    think: '说说你在水边玩过的一次：风或水帮了什么忙？',
    pre: [
      { art: '🚢', en: 'ship', zh: '轮船' },
      { art: '🏖️', en: 'beach', zh: '沙滩' },
      { art: '🌿', en: 'wind', zh: '风' },
      { art: '✨', en: 'strong', zh: '强壮' },
      { art: '🏃', en: 'turn', zh: '转' },
      { art: '💧', en: 'water', zh: '水' }
    ],
    sight: ['water'],
    newWords: [
      { w: 'ship', zh: '轮船' },
      { w: 'beach', zh: '沙滩' },
      { w: 'wind', zh: '风' },
      { w: 'strong', zh: '强壮' },
      { w: 'turn', zh: '转' }
    ],
    pages: [
      { art: 'beach|ming,grandma|ship|·', en: 'Ming has a little ship.', zh: '明明有一艘小船。' },
      { art: 'beach|ming,grandma|ship|♪', en: 'Ming takes it to the beach.', zh: '明明带它到海边。' },
      { art: 'beach|ming,grandma|ship|👀', en: 'The wind is strong.', zh: '风很大。' },
      { art: 'beach|ming,grandma|ship|?', en: 'Ming puts the ship on the water.', zh: '明明把船放到水上。' },
      { art: 'beach|ming,grandma|ship|·', en: 'The wind takes it far away!', zh: '风把船吹得很远！' },
      { art: 'beach|ming,grandma|ship|!', en: 'Ming runs to get it.', zh: '明明跑去追。' },
      { art: 'beach|ming,grandma|ship|♥', en: 'Grandma says, "Wait for the wind to turn."', zh: '奶奶说：「等风转向。」' },
      { art: 'beach|ming,grandma|ship|★', en: 'The wind turns, and the ship comes back.', zh: '风一转，船回来了。' }
    ],
    quiz: [
      { q: '小船被风吹走了，奶奶让明明怎么做？', opts: ['等风转过来', '下水去追', '再买一只'], a: 0, kind: 'recall' },
      { q: '船是怎么回来的？', opts: ['明明游过去拿的', '风转了，把它带了回来', '它自己开回来的'], a: 1, kind: 'infer' },
      { q: '东西被风吹跑了，你会怎么做？', opts: ['等风向变了，别硬追', '一直追着风跑', '再买一个'], a: 0, kind: 'transfer' }
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
      { art: 'farm|lili,grandpa|duck|♥', en: 'The man takes the duck to the door.', zh: '那个人把鸭子带到门口。' },
      { art: 'farm|lili,grandpa|duck|★', en: 'The duck walks home.', zh: '鸭子走回家了。' }
    ],
    quiz: [
      { q: '商店里的鸭子最后去了哪儿？', opts: ['留在店里', '自己走回家了', '被带去了公园'], a: 1, kind: 'recall' },
      { q: '鸭子一点也不怕，说明它怎么样？', opts: ['它很自在，不怕人', '它生病了', '它很凶'], a: 0, kind: 'infer' },
      { q: '看到不认识的小动物闯进来，你会怎么做？', opts: ['追着打它', '大声喊叫', '轻轻把它引到外面'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b27', lv: 'L3', tag: '故事', title: 'The King and a Ring', zh: '国王和戒指',
    emoji: '👑', color: '#CDE7C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 1 个新词（安全）。',
    trap: 'sh 把嘴唇撅圆、th 把舌尖轻轻放在上下门牙中间；ck 只发一个 k，别读两遍。',
    summary: '《国王和戒指》：这是一个完整的小故事。读前先看词卡（安全）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，按「开头 → 后来 → 最后」把这件事讲一遍。',
    think: '说说一件你觉得很珍贵的东西。',
    pre: [
      { art: '✨', en: 'safe', zh: '安全' },
      { art: '👑', en: 'king', zh: '国王' },
      { art: '📦', en: 'chick', zh: '小鸡' }
    ],
    sight: ['keeps'],
    newWords: [
      { w: 'safe', zh: '安全' }
    ],
    pages: [
      { art: 'home|grandma,mom|ring|·', en: 'A king has a ring.', zh: '一位国王有一枚戒指。' },
      { art: 'home|grandma,mom|ring|♪', en: 'The ring is old.', zh: '这枚戒指很老了。' },
      { art: 'home|grandma,mom|ring|👀', en: 'The king likes the ring.', zh: '国王喜欢这枚戒指。' },
      { art: 'home|grandma,mom|ring|?', en: 'One day the king cannot find the ring.', zh: '有一天，国王找不到戒指了。' },
      { art: 'home|grandma,mom|ring|·', en: 'The king looks and looks.', zh: '国王找了又找。' },
      { art: 'home|grandma,mom|ring|!', en: 'A little chick has it!', zh: '一只小鸡拿着它！' },
      { art: 'home|grandma,mom|ring|♥', en: 'The king laughs.', zh: '国王笑了。' },
      { art: 'home|grandma,mom|ring|★', en: 'The king keeps the ring safe.', zh: '国王把戒指收好了。' }
    ],
    quiz: [
      { q: '国王的戒指在谁那儿？', opts: ['一只小鸡', '一只猫', '一个小孩'], a: 0, kind: 'recall' },
      { q: '国王找到戒指以后，怎么样了？', opts: ['很生气地走了', '把小鸡赶走了', '笑了，把戒指收好'], a: 2, kind: 'infer' },
      { q: '怕重要的东西丢掉，你会怎么做？', opts: ['藏到自己也找不到', '随便乱放', '放在固定、安全的地方'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b28', lv: 'L3', tag: '故事', title: 'A Wish for a Chick', zh: '给小鸡的愿望',
    emoji: '🐤', color: '#C6DEF6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 4 个新词（瘦、饿、许愿、食物）。',
    trap: 'sh 把嘴唇撅圆、th 把舌尖轻轻放在上下门牙中间；ck 只发一个 k，别读两遍。',
    summary: '《给小鸡的愿望》：这是一个完整的小故事。读前先看词卡（瘦、饿、许愿、食物）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，按「开头 → 后来 → 最后」把这件事讲一遍。',
    think: '说说你想为一个小动物做的一件事。',
    pre: [
      { art: '✨', en: 'thin', zh: '瘦' },
      { art: '✨', en: 'hungry', zh: '饿' },
      { art: '🏃', en: 'wish', zh: '许愿' },
      { art: '📦', en: 'food', zh: '食物' },
      { art: '📦', en: 'chick', zh: '小鸡' }
    ],
    sight: ['eats'],
    newWords: [
      { w: 'thin', zh: '瘦' },
      { w: 'hungry', zh: '饿' },
      { w: 'wish', zh: '许愿' },
      { w: 'food', zh: '食物' }
    ],
    pages: [
      { art: 'farm|grandpa,dad|chick|·', en: 'A little chick is here.', zh: '这里有一只小鸡。' },
      { art: 'farm|grandpa,dad|chick|♪', en: 'The chick is small and thin.', zh: '小鸡又小又瘦。' },
      { art: 'farm|grandpa,dad|chick|👀', en: 'It is hungry.', zh: '它饿了。' },
      { art: 'farm|grandpa,dad|chick|?', en: 'I make a wish for the chick.', zh: '我为小鸡许了个愿。' },
      { art: 'farm|grandpa,dad|chick|·', en: 'I give the chick food.', zh: '我给小鸡吃的。' },
      { art: 'farm|grandpa,dad|chick|!', en: 'The chick eats and eats.', zh: '小鸡吃啊吃。' },
      { art: 'farm|grandpa,dad|chick|♥', en: 'The chick is fat now.', zh: '小鸡胖了。' },
      { art: 'farm|grandpa,dad|chick|★', en: 'It runs to me. The chick is big now.', zh: '它朝我跑过来。小鸡现在胖了。' }
    ],
    quiz: [
      { q: '小鸡原来怎么样？', opts: ['生病了', '迷路了', '又小又瘦，还饿着'], a: 2, kind: 'recall' },
      { q: '小鸡吃饱了、不瘦了，说明「我」给的食物怎么样？', opts: ['合适，它吃了就长好了', '太少，它没吃饱', '它不爱吃'], a: 0, kind: 'infer' },
      { q: '看到小动物饿了，你会怎么做？', opts: ['吓它', '给它合适的食物，照顾它', '不理它'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b29', lv: 'L3', tag: '韵文', title: 'Down on the Farm', zh: '在农场',
    emoji: '🌾', color: '#E0CFF3',
    track: 'rhyme',
    goal: '读一首小韵文，听清每一句句末的韵脚。认读 2 个新词（农场、农民）。',
    trap: 'sh 把嘴唇撅圆、th 把舌尖轻轻放在上下门牙中间；ck 只发一个 k，别读两遍。',
    summary: '《在农场》：这是一个完整的小故事。读前先看词卡（农场、农民）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，按「开头 → 后来 → 最后」把这件事讲一遍。',
    think: '说说你最想在农场看的一种动物。',
    pre: [
      { art: '🚜', en: 'farm', zh: '农场' },
      { art: '🧑', en: 'farmer', zh: '农民' },
      { art: '✋', en: 'arm', zh: '胳膊' },
      { art: '☀️', en: 'sun', zh: '太阳' }
    ],
    sight: ['arm', 'strong', 'tree'],
    newWords: [
      { w: 'farm', zh: '农场' },
      { w: 'farmer', zh: '农民' }
    ],
    pages: [
      { art: 'farm|mom,ming|farm|·', en: 'We walk on the farm.', zh: '我们走在农场里。' },
      { art: 'farm|mom,ming|farm|♪', en: 'The farmer works with his strong arm.', zh: '农夫用有力的胳膊干活。' },
      { art: 'farm|mom,ming|farm|👀', en: 'Look at the big hot sun.', zh: '看看又大又热的太阳。' },
      { art: 'farm|mom,ming|farm|?', en: 'The little pigs run and run.', zh: '小猪们跑个不停。' },
      { art: 'farm|mom,ming|farm|·', en: 'The farm dog is very big.', zh: '农场的狗好大呀。' },
      { art: 'farm|mom,ming|farm|!', en: 'We see a fat little pig.', zh: '我们看见一头胖胖的小猪。' },
      { art: 'farm|mom,ming|farm|♥', en: 'The little hen is by the tree.', zh: '小母鸡在树旁边。' },
      { art: 'farm|mom,ming|farm|★', en: 'Come to the farm and see.', zh: '来农场看看吧。' }
    ],
    quiz: [
      { q: '书里的太阳是什么样的？', opts: ['躲在云后面', '又小又冷', '又大又热'], a: 2, kind: 'recall' },
      { q: '农夫的胳膊很有力，他可能常常做什么？', opts: ['干农活', '什么也不用拿', '一直躺着不动'], a: 0, kind: 'infer' },
      { q: '在农场看到小动物，你会怎么做？', opts: ['追着抓它们', '远远地看着，不打扰它们', '大声吓唬它们'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b30', lv: 'L3', tag: '好笑', title: 'The Duck Wears the Hat', zh: '戴帽子的鸭子',
    emoji: '🦆', color: '#F6C9E3',
    track: 'humor',
    goal: '跟着一个好笑的故事读到最后，看看笑点在哪儿。认读 1 个新词（小路）。',
    trap: 'sh 把嘴唇撅圆、th 把舌尖轻轻放在上下门牙中间；ck 只发一个 k，别读两遍。',
    summary: '《戴帽子的鸭子》：这是一个完整的小故事。读前先看词卡（小路）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，按「开头 → 后来 → 最后」把这件事讲一遍。',
    think: '说说你见过的一件特别好笑的事。',
    pre: [
      { art: '🛤️', en: 'path', zh: '小路' },
      { art: '🦆', en: 'duck', zh: '鸭子' },
      { art: '🎩', en: 'hat', zh: '帽子' }
    ],
    sight: ['head', 'high'],
    newWords: [
      { w: 'path', zh: '小路' }
    ],
    pages: [
      { art: 'farm|dad,lili|duck|·', en: 'A duck is on the path.', zh: '一只鸭子走在小路上。' },
      { art: 'farm|dad,lili|duck|♪', en: 'A man puts his hat on a box.', zh: '一个男人把帽子放在盒子上。' },
      { art: 'farm|dad,lili|duck|👀', en: 'The duck puts the hat on.', zh: '鸭子把帽子戴上了。' },
      { art: 'farm|dad,lili|duck|?', en: 'It walks like a little man.', zh: '它走起路来像个小大人。' },
      { art: 'farm|dad,lili|duck|·', en: 'It holds its head up high.', zh: '它把头抬得高高的。' },
      { art: 'farm|dad,lili|duck|!', en: 'A dog looks at the duck.', zh: '一只小狗盯着鸭子看。' },
      { art: 'farm|dad,lili|duck|♥', en: 'The man sees the duck and laughs.', zh: '那个男人看见鸭子，哈哈大笑。' },
      { art: 'farm|dad,lili|duck|★', en: 'The duck walks home like a man.', zh: '鸭子像人一样走回家去了。' }
    ],
    quiz: [
      { q: '帽子原来放在哪里？', opts: ['桌子上', '小狗头上', '盒子上'], a: 2, kind: 'recall' },
      { q: '小狗为什么盯着鸭子看？', opts: ['它在等吃饭', '它没见过戴帽子、走路像人的鸭子', '它想吃盒子里的东西'], a: 1, kind: 'infer' },
      { q: '小动物做了好笑的事，你会怎么做？', opts: ['大声喊人来赶它', '追着它跑', '看着它笑，不去吓它'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b31', lv: 'L3', tag: '动物', title: 'How Bugs Move', zh: '虫子怎么走',
    emoji: '🐛', color: '#BFE6DF',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。认读 3 个新词（蜜蜂、飞、蜗牛）。',
    trap: 'sh 把嘴唇撅圆、th 把舌尖轻轻放在上下门牙中间；ck 只发一个 k，别读两遍。',
    summary: '《虫子怎么走》：这一本从一件小事讲起，说说为什么会这样。读前先看词卡（蜜蜂、飞、蜗牛）；读的时候留意先看到什么、为什么会这样、后来怎么弄明白。',
    retell: '合上书，按「先看到什么 → 为什么会这样 → 后来怎么弄明白」讲一遍。',
    think: '说说你见过的一种小虫子，它是怎么移动的？',
    pre: [
      { art: '🐝', en: 'bee', zh: '蜜蜂' },
      { art: '🏃', en: 'fly', zh: '飞' },
      { art: '🐌', en: 'snail', zh: '蜗牛' },
      { art: '🐛', en: 'bug', zh: '小虫' },
      { art: '🐜', en: 'ant', zh: '蚂蚁' }
    ],
    sight: ['high'],
    newWords: [
      { w: 'bee', zh: '蜜蜂' },
      { w: 'fly', zh: '飞' },
      { w: 'snail', zh: '蜗牛' }
    ],
    pages: [
      { art: 'garden|ming,grandma|bug|·', en: 'A bug can move fast or slow.', zh: '虫子有的跑得快，有的走得慢。' },
      { art: 'garden|ming,grandma|bug|♪', en: 'Some bugs walk on six legs.', zh: '有些虫子用六条腿走路。' },
      { art: 'garden|ming,grandma|bug|👀', en: 'The ant walks all day long.', zh: '蚂蚁整天走来走去。' },
      { art: 'garden|ming,grandma|bug|?', en: 'A bee can fly up high.', zh: '蜜蜂能飞得很高。' },
      { art: 'garden|ming,grandma|bug|·', en: 'Some bugs have wings and fly.', zh: '有些虫子长着翅膀，会飞。' },
      { art: 'garden|ming,grandma|bug|!', en: 'A snail moves very slowly.', zh: '蜗牛爬得很慢很慢。' },
      { art: 'garden|ming,grandma|bug|♥', en: 'Some bugs jump up and down.', zh: '有些虫子能跳上跳下。' },
      { art: 'garden|ming,grandma|bug|★', en: 'Now you know how these bugs move.', zh: '现在你知道这些虫子怎么走了。' }
    ],
    quiz: [
      { q: '有些虫子用几条腿走路？', opts: ['六条', '四条', '八条'], a: 0, kind: 'recall' },
      { q: '小蚂蚁整天走来走去，它可能在做什么？', opts: ['到处找吃的', '在等下雨', '在睡觉'], a: 0, kind: 'infer' },
      { q: '在草地上看到小虫子，你会怎么做？', opts: ['抓起来玩', '一脚踩下去', '蹲下来看看，不去踩它'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b32', lv: 'L3', tag: '自然', title: 'Stones and Sand', zh: '石头和沙',
    emoji: '🪨', color: '#F2E2A8',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。认读 5 个新词（石头、沙子、软、一块、打破）。',
    trap: 'sh 把嘴唇撅圆、th 把舌尖轻轻放在上下门牙中间；ck 只发一个 k，别读两遍。',
    summary: '《石头和沙》：这一本从一件小事讲起，说说为什么会这样。读前先看词卡（石头、沙子、软、一块、打破）；读的时候留意先看到什么、为什么会这样、后来怎么弄明白。',
    retell: '合上书，按「先看到什么 → 为什么会这样 → 后来怎么弄明白」讲一遍。',
    think: '说说你在哪儿见过石头和沙子。',
    pre: [
      { art: '🌿', en: 'stone', zh: '石头' },
      { art: '🌿', en: 'sand', zh: '沙子' },
      { art: '✨', en: 'soft', zh: '软' },
      { art: '📦', en: 'piece', zh: '一块' },
      { art: '🏃', en: 'break', zh: '打破' },
      { art: '🌿', en: 'rock', zh: '石头' },
      { art: '🌿', en: 'wind', zh: '风' }
    ],
    sight: ['pieces', 'stones', 'turn', 'water'],
    newWords: [
      { w: 'stone', zh: '石头' },
      { w: 'sand', zh: '沙子' },
      { w: 'soft', zh: '软' },
      { w: 'piece', zh: '一块' },
      { w: 'break', zh: '打破' }
    ],
    pages: [
      { art: 'library|lili,grandpa|stone|·', en: 'Look at this big stone.', zh: '看看这块大石头。' },
      { art: 'library|lili,grandpa|stone|♪', en: 'The stone is big and hard.', zh: '石头又大又硬。' },
      { art: 'library|lili,grandpa|stone|👀', en: 'Now look at the sand.', zh: '现在来看看沙子。' },
      { art: 'library|lili,grandpa|stone|?', en: 'The sand is small and soft.', zh: '沙子又小又软。' },
      { art: 'library|lili,grandpa|stone|·', en: 'Sand is little pieces of rock.', zh: '沙子就是碎掉的小石头。' },
      { art: 'library|lili,grandpa|stone|!', en: 'Wind and water break the rock.', zh: '风和水会把石头弄碎。' },
      { art: 'library|lili,grandpa|stone|♥', en: 'It takes a very long, long time.', zh: '这要花很长很长的时间。' },
      { art: 'library|lili,grandpa|stone|★', en: 'Big stones can turn into sand.', zh: '大石头能变成小沙子。' }
    ],
    quiz: [
      { q: '沙子是什么变成的？', opts: ['小水滴', '小小的石头块', '小贝壳'], a: 1, kind: 'recall' },
      { q: '把石头放在风和水里很久很久，会怎么样？', opts: ['它会变得更大', '它会飞起来', '它会慢慢碎成小沙子'], a: 2, kind: 'infer' },
      { q: '玩沙子的时候，你会注意什么？', opts: ['不把沙子扬起来', '用石头砸人', '往别人身上扬沙子'], a: 0, kind: 'transfer' }
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
    think: '找两个一个带 sh、一个带 ch 的词，读一读、比一比。',
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
      { art: 'table|grandma,mom|ship|?', en: 'One has "sh". One has "ch".', zh: '一个带 sh，一个带 ch。' },
      { art: 'table|grandma,mom|ship|·', en: 'Say "ship".', zh: '说「船」。' },
      { art: 'table|grandma,mom|ship|!', en: 'Say "chip".', zh: '说「薯条」。' },
      { art: 'table|grandma,mom|ship|♥', en: '"Ship" is not "chip".', zh: '「ship」不是「chip」。' },
      { art: 'table|grandma,mom|ship|★', en: 'Good! You can say both.', zh: '真棒！两个都会说了。' }
    ],
    quiz: [
      { q: '这一本里，哪个词是吃的东西？', opts: ['chip', 'ship', 'shop'], a: 0, kind: 'recall' },
      { q: 'ship 和 chip 开头差在哪里？', opts: ['一个长一个短', '一个有一个没有', '一个 sh 一个 ch'], a: 2, kind: 'infer' },
      { q: 'ship 和 chip 只差开头，你会怎么分清？', opts: ['随便读一个', '听清开头是 sh 还是 ch，再读整个词', '不读了'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b34', lv: 'L3', tag: '小知识', title: 'A Long Wing', zh: '长长的翅膀',
    emoji: '🕊️', color: '#FAD3B6',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。认读 2 个新词（观察、乐趣）。',
    trap: 'sh 把嘴唇撅圆、th 把舌尖轻轻放在上下门牙中间；ck 只发一个 k，别读两遍。',
    summary: '《长长的翅膀》：这一本从一件小事讲起，说说为什么会这样。读前先看词卡（观察、乐趣）；读的时候留意先看到什么、为什么会这样、后来怎么弄明白。',
    retell: '合上书，按「先看到什么 → 为什么会这样 → 后来怎么弄明白」讲一遍。',
    think: '说说鸟是怎么飞起来的。',
    pre: [
      { art: '🏃', en: 'watch', zh: '观察' },
      { art: '💡', en: 'fun', zh: '乐趣' },
      { art: '🐦', en: 'bird', zh: '鸟' },
      { art: '🌿', en: 'wind', zh: '风' }
    ],
    sight: ['arms', 'bird', 'flies', 'fly'],
    newWords: [
      { w: 'watch', zh: '观察' },
      { w: 'fun', zh: '乐趣' }
    ],
    pages: [
      { art: 'library|grandpa,dad|wing|·', en: 'A bird has long wings. They are long and thin.', zh: '鸟儿有一对长翅膀。翅膀又长又细。' },
      { art: 'library|grandpa,dad|wing|♪', en: 'The bird flies with its wings. Up and up it goes.', zh: '鸟儿用翅膀飞。它越飞越高。' },
      { art: 'library|grandpa,dad|wing|👀', en: 'The wind helps the bird. The bird flies far.', zh: '风托着鸟儿。鸟儿飞得很远。' },
      { art: 'library|grandpa,dad|wing|?', en: 'I watch the long wings. I wish I could fly.', zh: '我看着那对长翅膀。我真希望能飞。' },
      { art: 'library|grandpa,dad|wing|·', en: 'I jump up, but I cannot fly.', zh: '我往上跳，可飞不起来。' },
      { art: 'library|grandpa,dad|wing|!', en: 'My arms are not wings.', zh: '我的胳膊不是翅膀。' },
      { art: 'library|grandpa,dad|wing|♥', en: 'I am not sad. I can run!', zh: '我不难过。我会跑！' },
      { art: 'library|grandpa,dad|wing|★', en: 'I run and run. It is fun to run.', zh: '我跑啊跑。跑起来真痛快。' }
    ],
    quiz: [
      { q: '「我」希望自己能做什么？', opts: ['跑得很快', '飞起来', '游得很远'], a: 1, kind: 'recall' },
      { q: '明明为什么飞不起来？', opts: ['因为没有风', '因为他的胳膊不是翅膀', '因为他太矮'], a: 1, kind: 'infer' },
      { q: '想做成一件难事，你会怎么做？', opts: ['一次就想学会', '不学了', '先看别人怎么做，再慢慢练'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b35', lv: 'L3', tag: '小知识', title: 'Fresh Cheese', zh: '新鲜的奶酪',
    emoji: '🧀', color: '#C8E7F0',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。认读 3 个新词（新鲜、盘子、一块）。',
    trap: 'sh 把嘴唇撅圆、th 把舌尖轻轻放在上下门牙中间；ck 只发一个 k，别读两遍。',
    summary: '《新鲜的奶酪》：这一本从一件小事讲起，说说为什么会这样。读前先看词卡（新鲜、盘子、一块）；读的时候留意先看到什么、为什么会这样、后来怎么弄明白。',
    retell: '合上书，按「先看到什么 → 为什么会这样 → 后来怎么弄明白」讲一遍。',
    think: '说说一种你喜欢的奶制品。',
    pre: [
      { art: '✨', en: 'fresh', zh: '新鲜' },
      { art: '🍽️', en: 'dish', zh: '盘子' },
      { art: '📦', en: 'piece', zh: '一块' },
      { art: '🧀', en: 'cheese', zh: '奶酪' }
    ],
    sight: ['cheese', 'clean', 'eat'],
    newWords: [
      { w: 'fresh', zh: '新鲜' },
      { w: 'dish', zh: '盘子' },
      { w: 'piece', zh: '一块' }
    ],
    pages: [
      { art: 'kitchen|mom,ming|cheese|·', en: 'The cheese is fresh. It is on a dish.', zh: '奶酪很新鲜。它放在盘子上。' },
      { art: 'kitchen|mom,ming|cheese|♪', en: 'I like fresh cheese. It is soft.', zh: '我喜欢新鲜奶酪。它软软的。' },
      { art: 'kitchen|mom,ming|cheese|👀', en: 'I cut a little piece and eat it.', zh: '我切下一小块吃了。' },
      { art: 'kitchen|mom,ming|cheese|?', en: 'It is good! I want more.', zh: '真好吃！我还想要。' },
      { art: 'kitchen|mom,ming|cheese|·', en: 'I cut more cheese.', zh: '我又切了一些。' },
      { art: 'kitchen|mom,ming|cheese|!', en: 'Mom wants some too.', zh: '妈妈也想要一点。' },
      { art: 'kitchen|mom,ming|cheese|♥', en: 'I cut a piece for her.', zh: '我切了一块给她。' },
      { art: 'kitchen|mom,ming|cheese|★', en: 'We eat it all. Now the dish is clean.', zh: '我们全吃完了。现在盘子空了。' }
    ],
    quiz: [
      { q: '奶酪最后怎么样了？', opts: ['剩了一大块', '放回了冰箱', '全吃完了，盘子空了'], a: 2, kind: 'recall' },
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
    sight: ['afraid', 'fresh'],
    newWords: [
      { w: 'pick', zh: '摘' },
      { w: 'family', zh: '家人' }
    ],
    pages: [
      { art: 'library|dad,lili|shed|·', en: 'Down by the shed, I see a hen.', zh: '在棚子边，我看见一只母鸡。' },
      { art: 'library|dad,lili|shed|♪', en: 'She is not afraid of me.', zh: '她不怕我。' },
      { art: 'library|dad,lili|shed|👀', en: 'I pick up a fresh egg.', zh: '我捡起一个新鲜的鸡蛋。' },
      { art: 'library|dad,lili|shed|?', en: 'The egg is for my family.', zh: '鸡蛋是给家人的。' },
      { art: 'library|dad,lili|shed|·', en: 'I leave the hen by the shed.', zh: '我把母鸡留在棚子边。' },
      { art: 'library|dad,lili|shed|!', en: 'I walk back home.', zh: '我走回家。' },
      { art: 'library|dad,lili|shed|♥', en: 'Down by the shed, all is well.', zh: '棚子边，一切都好。' },
      { art: 'library|dad,lili|shed|★', en: 'I like the shed and the hen.', zh: '我喜欢棚子和母鸡。' }
    ],
    quiz: [
      { q: '我在棚子边捡到了什么？', opts: ['一个新鲜的蛋', '一根羽毛', '一块木头'], a: 0, kind: 'recall' },
      { q: '明明拿了蛋就走，为什么没有惊动母鸡？', opts: ['他动作轻，没吓到它', '母鸡睡着了', '母鸡不在棚子里'], a: 0, kind: 'infer' },
      { q: '捡到一样东西，你会怎么做？', opts: ['自己拿走', '不管它', '想一想它是谁的，再决定怎么办'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b37', lv: 'L4', tag: '池塘', title: 'The Frog on the Stone', zh: '石头上的青蛙',
    emoji: '🐸', color: '#F6C6C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 2 个新词（青蛙、池塘）。',
    trap: '连缀中间不加元音：tree 是「tr-ee」一个词，不是「特-瑞」两个音。',
    summary: '《石头上的青蛙》：这是一个完整的小故事。读前先看词卡（青蛙、池塘）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，按「开头 → 后来 → 最后」把这件事讲一遍。',
    think: '说说青蛙抓虫的样子。',
    pre: [
      { art: '🐸', en: 'frog', zh: '青蛙' },
      { art: '📍', en: 'pond', zh: '池塘' },
      { art: '🌿', en: 'stone', zh: '石头' },
      { art: '🐛', en: 'bug', zh: '小虫' }
    ],
    sight: ['flies', 'green', 'waits'],
    newWords: [
      { w: 'frog', zh: '青蛙' },
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
      { art: 'library|ming,grandma|frog|★', en: 'One more bug comes. The frog jumps again.', zh: '又飞来一只小虫。青蛙又跳了一次。' },
      { art: 'library|ming,grandma|frog|…', en: 'The frog is happy.', zh: '青蛙很快乐。' }
    ],
    quiz: [
      { q: '青蛙坐在什么地方等虫子？', opts: ['草里', '池塘里', '石头上'], a: 2, kind: 'recall' },
      { q: '青蛙在等什么？', opts: ['小鱼', '飞过来的小虫', '小鸟'], a: 1, kind: 'infer' },
      { q: '想抓住机会（做成一件事），你会怎么做？', opts: ['乱抓一气', '不等了', '耐心等，看准了再动'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b38', lv: 'L4', tag: '上学', title: 'The Clock at School', zh: '学校的钟',
    emoji: '🕐', color: '#F9DFB4',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 4 个新词（钟、教室、晚、微笑）。',
    trap: '连缀中间不加元音：tree 是「tr-ee」一个词，不是「特-瑞」两个音。',
    summary: '《学校的钟》：这是一个完整的小故事。读前先看词卡（钟、教室、晚、微笑）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，按「开头 → 后来 → 最后」把这件事讲一遍。',
    think: '说说你家里的一口钟或一块表。',
    pre: [
      { art: '🕐', en: 'clock', zh: '钟' },
      { art: '📋', en: 'classroom', zh: '教室' },
      { art: '✨', en: 'late', zh: '晚' },
      { art: '🏃', en: 'smile', zh: '微笑' },
      { art: '📖', en: 'book', zh: '书' },
      { art: '🏫', en: 'school', zh: '学校' }
    ],
    sight: [],
    newWords: [
      { w: 'clock', zh: '钟' },
      { w: 'classroom', zh: '教室' },
      { w: 'late', zh: '晚' },
      { w: 'smile', zh: '微笑' }
    ],
    pages: [
      { art: 'school|lili,grandpa|clock|·', en: 'There is a clock at school.', zh: '学校有一个钟。' },
      { art: 'school|lili,grandpa|clock|♪', en: 'The clock is on the wall.', zh: '钟挂在墙上。' },
      { art: 'school|lili,grandpa|clock|👀', en: 'I look at the clock. It is early.', zh: '我看看钟。时间还早。' },
      { art: 'school|lili,grandpa|clock|?', en: 'I read my book and wait.', zh: '我一边看书一边等。' },
      { art: 'school|lili,grandpa|clock|·', en: 'The clock says it is time.', zh: '钟说到时间了。' },
      { art: 'school|lili,grandpa|clock|!', en: 'I leave my book. I go to the classroom.', zh: '我把书放下。我走去教室。' },
      { art: 'school|lili,grandpa|clock|♥', en: 'I am not late.', zh: '我没有迟到。' },
      { art: 'school|lili,grandpa|clock|★', en: 'I am glad. I look at the clock and smile.', zh: '我很高兴。我看看钟，笑了。' },
      { art: 'school|lili,grandpa|clock|…', en: 'It helps me every day.', zh: '它每天都帮我。' }
    ],
    quiz: [
      { q: '学校的钟帮「我」知道了什么？', opts: ['时间还早', '天气怎么样', '教室在哪儿'], a: 0, kind: 'recall' },
      { q: '钟帮我做了什么？', opts: ['做饭', '写作业', '知道时间，不迟到'], a: 2, kind: 'infer' },
      { q: '想知道现在几点，你会怎么做？', opts: ['不管它', '随便猜一猜', '看看钟表'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b39', lv: 'L4', tag: '观察', title: 'Grass and a Crab', zh: '草和螃蟹',
    emoji: '🦀', color: '#CDE7C6',
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
      { art: 'farm|grandma,mom|grass|·', en: 'I see grass by the water.', zh: '我看见水边有草。' },
      { art: 'farm|grandma,mom|grass|♪', en: 'I see a crab too.', zh: '我还看见一只螃蟹。' },
      { art: 'farm|grandma,mom|grass|👀', en: 'The crab is small. It walks on the sand.', zh: '螃蟹很小。它在沙子上走。' },
      { art: 'farm|grandma,mom|grass|?', en: 'It hides in the grass.', zh: '它躲进草里。' },
      { art: 'farm|grandma,mom|grass|·', en: 'I look for the crab.', zh: '我去找那只螃蟹。' },
      { art: 'farm|grandma,mom|grass|!', en: 'I wait and do not move.', zh: '我等着，不动。' },
      { art: 'farm|grandma,mom|grass|♥', en: 'The crab comes out. It walks to me.', zh: '螃蟹出来了。它朝我走过来。' },
      { art: 'farm|grandma,mom|grass|★', en: 'The crab is green. The grass is green too.', zh: '螃蟹是绿的。草也是绿的。' },
      { art: 'farm|grandma,mom|grass|…', en: 'I like the crab.', zh: '我喜欢这只螃蟹。' }
    ],
    quiz: [
      { q: '螃蟹躲到哪儿去了？', opts: ['草里', '石头下面', '沙子里'], a: 0, kind: 'recall' },
      { q: '螃蟹先躲进草里，后来为什么又出来了？', opts: ['明明叫了它', '草里太热', '明明没动，它觉得安全了'], a: 2, kind: 'infer' },
      { q: '小动物躲起来了，你会怎么做？', opts: ['耐心等它出来', '一直翻找吓它', '不管它'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b40', lv: 'L4', tag: '送礼', title: 'A Gift in a Basket', zh: '篮子里的礼物',
    emoji: '🧺', color: '#C6DEF6',
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
      { art: 'home|grandpa,dad|gift|·', en: 'I have a basket.', zh: '我有一个篮子。' },
      { art: 'home|grandpa,dad|gift|♪', en: 'A gift is in the basket.', zh: '篮子里有一件礼物。' },
      { art: 'home|grandpa,dad|gift|👀', en: 'The gift is for Mom. It is small.', zh: '礼物是给妈妈的。它很小。' },
      { art: 'home|grandpa,dad|gift|?', en: 'I carry the basket.', zh: '我提着篮子。' },
      { art: 'home|grandpa,dad|gift|·', en: 'I am careful with it.', zh: '我很小心。' },
      { art: 'home|grandpa,dad|gift|!', en: 'I walk slowly and hold it in my hands.', zh: '我慢慢走，把它拿在手里。' },
      { art: 'home|grandpa,dad|gift|♥', en: 'I give the gift to Mom.', zh: '我把礼物给妈妈。' },
      { art: 'home|grandpa,dad|gift|★', en: 'Mom is happy. I am happy too.', zh: '妈妈很高兴。我也很高兴。' },
      { art: 'home|grandpa,dad|gift|…', en: 'The basket is empty now.', zh: '篮子现在空了。' }
    ],
    quiz: [
      { q: '篮子里的礼物是给谁的？', opts: ['妈妈', '老师', '奶奶'], a: 0, kind: 'recall' },
      { q: '明明一路小心地提着篮子，是因为什么？', opts: ['篮子很重', '篮子很贵', '里面是给妈妈的礼物，怕碰坏'], a: 2, kind: 'infer' },
      { q: '送别人礼物，你会怎么做？', opts: ['随便送一个', '不送了', '想一想他喜欢什么，再送'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b41', lv: 'L4', tag: '想象', title: 'The Star Comes Down', zh: '星星落下来',
    emoji: '⭐', color: '#E0CFF3',
    track: 'fantasy',
    goal: '跟着一个想象出来的故事，把来龙去脉读顺。认读 2 个新词（星星、暖）。',
    trap: '连缀中间不加元音：tree 是「tr-ee」一个词，不是「特-瑞」两个音。',
    summary: '《星星落下来》：这是一个完整的小故事。读前先看词卡（星星、暖）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，按「开头 → 后来 → 最后」把这件事讲一遍。',
    think: '如果一颗星星来你家玩，你会带它做什么？',
    pre: [
      { art: '⭐', en: 'star', zh: '星星' },
      { art: '✨', en: 'warm', zh: '暖' },
      { art: '🐱', en: 'cat', zh: '猫' },
      { art: '🌿', en: 'grass', zh: '草' }
    ],
    sight: ['feels', 'moon'],
    newWords: [
      { w: 'star', zh: '星星' },
      { w: 'warm', zh: '暖' }
    ],
    pages: [
      { art: 'night|mom,ming|star|·', en: 'One star comes down at night.', zh: '夜里，一颗星星落了下来。' },
      { art: 'night|mom,ming|star|♪', en: 'It is small, and it feels warm.', zh: '它小小的，摸起来暖暖的。' },
      { art: 'night|mom,ming|star|👀', en: 'The star wants to play with us.', zh: '它想和我们一起玩。' },
      { art: 'night|mom,ming|star|?', en: 'It plays with the little cat.', zh: '它和小猫一块儿玩。' },
      { art: 'night|mom,ming|star|·', en: 'They sit on the soft grass.', zh: '它们坐在软软的草地上。' },
      { art: 'night|mom,ming|star|!', en: 'The cat and the star play ball.', zh: '小猫和星星玩起了球。' },
      { art: 'night|mom,ming|star|♥', en: 'They are happy under the big moon.', zh: '大月亮下，它们玩得真开心。' },
      { art: 'night|mom,ming|star|★', en: 'Then the star goes back to the sky.', zh: '然后星星回到了天上。' },
      { art: 'night|mom,ming|star|…', en: 'It looks down at us and smiles.', zh: '它从天上看着我们微笑。' }
    ],
    quiz: [
      { q: '落下来的星星是什么样的？', opts: ['小小的、暖暖的', '又大又冷', '亮得刺眼'], a: 0, kind: 'recall' },
      { q: '星星回到天上以后，为什么还往下看？', opts: ['它在找东西', '它惦记着新朋友', '它下不来了'], a: 1, kind: 'infer' },
      { q: '想和新朋友一起玩，你会怎么做？', opts: ['主动走过去，友好地打招呼', '自己玩，不理他', '等他先来找你'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b42', lv: 'L4', tag: '韵文', title: 'Run in the Sun', zh: '在太阳下跑',
    emoji: '🏃', color: '#F6C9E3',
    track: 'rhyme',
    goal: '读一首小韵文，听清每一句句末的韵脚。不引入新词，全部是读过的词。',
    trap: '连缀中间不加元音：tree 是「tr-ee」一个词，不是「特-瑞」两个音。',
    summary: '《在太阳下跑》：这是一个完整的小故事。读前先看词卡，都是学过的词；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，按「开头 → 后来 → 最后」把这件事讲一遍。',
    think: '说说你最喜欢和谁一起跑步或玩游戏。',
    pre: [
      { art: '☀️', en: 'sun', zh: '太阳' },
      { art: '🌿', en: 'sky', zh: '天空' }
    ],
    sight: ['high'],
    newWords: [

    ],
    pages: [
      { art: 'library|dad,lili|run|·', en: 'Come out and run, run, run.', zh: '快出来跑啊跑。' },
      { art: 'library|dad,lili|run|♪', en: 'We run and run in the sun.', zh: '我们在太阳底下跑啊跑。' },
      { art: 'library|dad,lili|run|👀', en: 'I run so fast, fast, fast.', zh: '我跑得飞快，飞快，飞快。' },
      { art: 'library|dad,lili|run|?', en: 'I want this day to last.', zh: '我真希望这一天长一点。' },
      { art: 'library|dad,lili|run|·', en: 'We run and jump up high.', zh: '我们又跑又跳，跳得高高的。' },
      { art: 'library|dad,lili|run|!', en: 'We look up at the sky.', zh: '我们抬头看看天空。' },
      { art: 'library|dad,lili|run|♥', en: 'We run and play all day.', zh: '我们跑啊玩啊，玩了一整天。' },
      { art: 'library|dad,lili|run|★', en: 'I like to play this way.', zh: '我喜欢这样玩。' },
      { art: 'library|dad,lili|run|…', en: 'Come and run outside with me.', zh: '出来跟我一起跑吧。' }
    ],
    quiz: [
      { q: '书里的我们在什么地方跑？', opts: ['在雪地上', '在太阳底下', '在雨里'], a: 1, kind: 'recall' },
      { q: '为什么说「我真希望这一天长一点」？', opts: ['因为天快黑了要回家', '因为跑步太累了', '因为跑着玩太开心了'], a: 2, kind: 'infer' },
      { q: '想让自己每天跑步，你会怎么做？', opts: ['想起来才跑', '每天固定时间出去跑一跑', '跑一天歇十天'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b43', lv: 'L4', tag: '动物', title: 'A Chick Grows', zh: '小鸡长大了',
    emoji: '🐤', color: '#BFE6DF',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。不引入新词，全部是读过的词。',
    trap: '连缀中间不加元音：tree 是「tr-ee」一个词，不是「特-瑞」两个音。',
    summary: '《小鸡长大了》：这一本从一件小事讲起，说说为什么会这样。读前先看词卡，都是学过的词；读的时候留意先看到什么、为什么会这样、后来怎么弄明白。',
    retell: '合上书，按「先看到什么 → 为什么会这样 → 后来怎么弄明白」讲一遍。',
    think: '说说你还知道哪些小动物是从蛋里出来的。',
    pre: [
      { art: '📦', en: 'chick', zh: '小鸡' },
      { art: '🐔', en: 'hen', zh: '母鸡' }
    ],
    sight: ['eats', 'food', 'grows', 'warm', 'water'],
    newWords: [

    ],
    pages: [
      { art: 'farm|ming,grandma|chick|·', en: 'A chick grows inside an egg.', zh: '小鸡在蛋里慢慢长大。' },
      { art: 'farm|ming,grandma|chick|♪', en: 'The hen sits on the egg to keep it warm.', zh: '母鸡坐在蛋上，把蛋捂得暖暖的。' },
      { art: 'farm|ming,grandma|chick|👀', en: 'One day the little chick comes out.', zh: '有一天，小鸡从蛋里出来了。' },
      { art: 'farm|ming,grandma|chick|?', en: 'The chick is wet at first.', zh: '刚出壳的小鸡身上湿湿的。' },
      { art: 'farm|ming,grandma|chick|·', en: 'It eats food and drinks water.', zh: '它吃东西，也喝水。' },
      { art: 'farm|ming,grandma|chick|!', en: 'The chick grows day by day.', zh: '小鸡一天天长大。' },
      { art: 'farm|ming,grandma|chick|♥', en: 'When it grows up, it is a hen.', zh: '它长大了，就是一只母鸡。' },
      { art: 'farm|ming,grandma|chick|★', en: 'One day the hen has eggs too.', zh: '有一天，母鸡也有了自己的蛋。' },
      { art: 'farm|ming,grandma|chick|…', en: 'A chick grows from egg to hen.', zh: '小鸡从蛋里长成母鸡。' }
    ],
    quiz: [
      { q: '小鸡刚从蛋里出来时是什么样子？', opts: ['又大又干', '又小又湿', '和大鸡一样'], a: 1, kind: 'recall' },
      { q: '母鸡为什么要坐在蛋上？', opts: ['它喜欢蛋的样子', '它想在蛋上休息', '给蛋保暖，让小鸡在蛋里长大'], a: 2, kind: 'infer' },
      { q: '照顾小动物，最重要的是做什么？', opts: ['按时给它吃的和水', '什么都不管它', '天天抱着它玩'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b44', lv: 'L4', tag: '自然', title: 'Wind', zh: '风',
    emoji: '🌬️', color: '#F2E2A8',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。认读 4 个新词（空气、脸、小船、光）。',
    trap: '连缀中间不加元音：tree 是「tr-ee」一个词，不是「特-瑞」两个音。',
    summary: '《风》：这一本从一件小事讲起，说说为什么会这样。读前先看词卡（空气、脸、小船、光）；读的时候留意先看到什么、为什么会这样、后来怎么弄明白。',
    retell: '合上书，按「先看到什么 → 为什么会这样 → 后来怎么弄明白」讲一遍。',
    think: '说说风帮过你做的一件事。',
    pre: [
      { art: '🌿', en: 'air', zh: '空气' },
      { art: '📦', en: 'face', zh: '脸' },
      { art: '⛵', en: 'boat', zh: '小船' },
      { art: '🌿', en: 'light', zh: '光' },
      { art: '🌿', en: 'wind', zh: '风' },
      { art: '💧', en: 'water', zh: '水' }
    ],
    sight: ['feel', 'leaves', 'water'],
    newWords: [
      { w: 'air', zh: '空气' },
      { w: 'face', zh: '脸' },
      { w: 'boat', zh: '小船' },
      { w: 'light', zh: '光' }
    ],
    pages: [
      { art: 'library|lili,grandpa|wind|·', en: 'The wind is air that moves.', zh: '风就是会流动的空气。' },
      { art: 'library|lili,grandpa|wind|♪', en: 'We cannot see the wind.', zh: '我们看不见风。' },
      { art: 'library|lili,grandpa|wind|👀', en: 'We can feel it on our face.', zh: '我们能感觉到它吹在脸上。' },
      { art: 'library|lili,grandpa|wind|?', en: 'The wind can move the leaves.', zh: '风能吹动树叶。' },
      { art: 'library|lili,grandpa|wind|·', en: 'It can push a boat on the water.', zh: '它能推着水上的小船走。' },
      { art: 'library|lili,grandpa|wind|!', en: 'The wind can dry our wet socks.', zh: '风还能把湿袜子吹干。' },
      { art: 'library|lili,grandpa|wind|♥', en: 'Sometimes the wind is very strong.', zh: '有时候风很大。' },
      { art: 'library|lili,grandpa|wind|★', en: 'Sometimes it is soft and light.', zh: '有时候风又轻又柔。' },
      { art: 'library|lili,grandpa|wind|…', en: 'We like to feel the wind.', zh: '我们喜欢风吹在身上的感觉。' }
    ],
    quiz: [
      { q: '风是什么？', opts: ['会流动的空气', '看不见的水', '天上的云'], a: 0, kind: 'recall' },
      { q: '我们看不见风，怎么知道风来了？', opts: ['感觉它吹在脸上、看树叶动起来', '听别人说的', '看日历知道的'], a: 0, kind: 'infer' },
      { q: '洗好的袜子想快点干，你会怎么做？', opts: ['叠好放在椅子上', '塞进书包里', '挂在有风的地方'], a: 2, kind: 'transfer' }
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
      { q: '这一本在练哪个字母组合的音？', opts: ['th', 'tr', 'sh'], a: 1, kind: 'recall' },
      { q: 'tree 开头那两个字母该怎么读？', opts: ['分成两个音读', '只读 t', '连在一起读成一个音'], a: 2, kind: 'infer' },
      { q: '遇到带 tr 的单词，你会怎么读？', opts: ['一个字母一个字母念', '把 tr 连成一个音读出来', '跳过去'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b46', lv: 'L4', tag: '小知识', title: 'How a Stem Grows', zh: '茎怎么长',
    emoji: '🌱', color: '#FAD3B6',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。认读 3 个新词（茎、叶子、花）。',
    trap: '连缀中间不加元音：tree 是「tr-ee」一个词，不是「特-瑞」两个音。',
    summary: '《茎怎么长》：这一本从一件小事讲起，说说为什么会这样。读前先看词卡（茎、叶子、花）；读的时候留意先看到什么、为什么会这样、后来怎么弄明白。',
    retell: '合上书，按「先看到什么 → 为什么会这样 → 后来怎么弄明白」讲一遍。',
    think: '说说一株植物是怎么长大的。',
    pre: [
      { art: '🌿', en: 'stem', zh: '茎' },
      { art: '🍃', en: 'leaf', zh: '叶子' },
      { art: '🌻', en: 'flower', zh: '花' },
      { art: '☀️', en: 'sun', zh: '太阳' },
      { art: '🌿', en: 'light', zh: '光' }
    ],
    sight: ['green', 'grows', 'light'],
    newWords: [
      { w: 'stem', zh: '茎' },
      { w: 'leaf', zh: '叶子' },
      { w: 'flower', zh: '花' }
    ],
    pages: [
      { art: 'garden|grandpa,dad|stem|·', en: 'Here is a small stem.', zh: '这儿有一根小小的茎。' },
      { art: 'garden|grandpa,dad|stem|♪', en: 'In the sun, the stem is thin and small.', zh: '太阳下，这根茎又细又小。' },
      { art: 'garden|grandpa,dad|stem|👀', en: 'It grows and grows every day.', zh: '它每天长啊长。' },
      { art: 'garden|grandpa,dad|stem|?', en: 'The stem gets thick. A leaf comes out.', zh: '茎变粗了。冒出一片叶子。' },
      { art: 'garden|grandpa,dad|stem|·', en: 'The leaf is green and soft.', zh: '叶子又绿又软。' },
      { art: 'garden|grandpa,dad|stem|!', en: 'The stem grows up to the light.', zh: '茎朝着光往上长。' },
      { art: 'garden|grandpa,dad|stem|♥', en: 'A flower is on the stem.', zh: '茎上开了一朵花。' },
      { art: 'garden|grandpa,dad|stem|★', en: 'The stem is tall now.', zh: '茎现在很高了。' },
      { art: 'garden|grandpa,dad|stem|…', en: 'It was small at first. Look at it now!', zh: '它一开始很小。现在你看看它！' }
    ],
    quiz: [
      { q: '茎往上长，最后上面开了什么？', opts: ['一朵花', '一片叶子', '一个果子'], a: 0, kind: 'recall' },
      { q: '茎是怎么长的？', opts: ['从细小长到粗高，还长出叶子和花', '一直不变', '越长越小'], a: 0, kind: 'infer' },
      { q: '想看着一样东西长大，你会怎么做？', opts: ['每天看看，耐心等', '一直拔它', '不看了'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b47', lv: 'L4', tag: '小知识', title: 'Snow on the Street', zh: '街上的雪',
    emoji: '❄️', color: '#C8E7F0',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。认读 2 个新词（雪、白色）。',
    trap: '连缀中间不加元音：tree 是「tr-ee」一个词，不是「特-瑞」两个音。',
    summary: '《街上的雪》：这一本从一件小事讲起，说说为什么会这样。读前先看词卡（雪、白色）；读的时候留意先看到什么、为什么会这样、后来怎么弄明白。',
    retell: '合上书，按「先看到什么 → 为什么会这样 → 后来怎么弄明白」讲一遍。',
    think: '说说下雪天你会玩什么。',
    pre: [
      { art: '❄️', en: 'snow', zh: '雪' },
      { art: '⚪', en: 'white', zh: '白色' },
      { art: '🛣️', en: 'street', zh: '街道' },
      { art: '⚽', en: 'ball', zh: '球' }
    ],
    sight: ['street'],
    newWords: [
      { w: 'snow', zh: '雪' },
      { w: 'white', zh: '白色' }
    ],
    pages: [
      { art: 'night|mom,ming|snow|·', en: 'Snow is on the street.', zh: '街上有雪。' },
      { art: 'night|mom,ming|snow|♪', en: 'The snow is white and cold.', zh: '雪又白又冷。' },
      { art: 'night|mom,ming|snow|👀', en: 'I walk on the street.', zh: '我在街上走。' },
      { art: 'night|mom,ming|snow|?', en: 'I am cold, and my hands are cold too.', zh: '我冷，我的手也冷。' },
      { art: 'night|mom,ming|snow|·', en: 'I make a big ball of snow.', zh: '我做了一个大雪球。' },
      { art: 'night|mom,ming|snow|!', en: 'The ball of snow is big and cold.', zh: '这个雪球又大又冷。' },
      { art: 'night|mom,ming|snow|♥', en: 'I am not cold now.', zh: '我现在不冷了。' },
      { art: 'night|mom,ming|snow|★', en: 'I like the snow. I like the street now.', zh: '我喜欢雪。现在也喜欢这条街。' },
      { art: 'night|mom,ming|snow|…', en: 'I make one more ball. Then I go home.', zh: '我又做了一个雪球。然后回家。' }
    ],
    quiz: [
      { q: '「我」在街上做了什么？', opts: ['堆了一个雪人', '做了一个大雪球', '把雪扫到一边'], a: 1, kind: 'recall' },
      { q: '明明玩了一会儿雪球就不冷了，为什么？', opts: ['动起来身上就暖和了', '雪变热了', '太阳出来了'], a: 0, kind: 'infer' },
      { q: '下雪天在外面玩，你会怎么做？', opts: ['穿得很少', '穿暖和，玩一会儿就暖起来', '不出去'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b48', lv: 'L4', tag: '复习', title: 'Back to the Playground', zh: '回到操场',
    emoji: '🏫', color: '#E8D9B5',
    track: 'review',
    goal: '把本级和前面级别的词再读一遍、串成一个故事。认读 4 个新词（操场、旗子、转圈、休息）。',
    trap: '连缀中间不加元音：tree 是「tr-ee」一个词，不是「特-瑞」两个音。',
    summary: '《回到操场》：这是一个完整的小故事。读前先看词卡（操场、旗子、转圈、休息）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，按「开头 → 后来 → 最后」把这件事讲一遍。',
    think: '说说你在操场上最喜欢玩的东西。',
    pre: [
      { art: '🛝', en: 'playground', zh: '操场' },
      { art: '🚩', en: 'flag', zh: '旗子' },
      { art: '🏃', en: 'spin', zh: '转圈' },
      { art: '💡', en: 'rest', zh: '休息' },
      { art: '⚽', en: 'ball', zh: '球' },
      { art: '🕐', en: 'clock', zh: '钟' }
    ],
    sight: ['laugh'],
    newWords: [
      { w: 'playground', zh: '操场' },
      { w: 'flag', zh: '旗子' },
      { w: 'spin', zh: '转圈' },
      { w: 'rest', zh: '休息' }
    ],
    pages: [
      { art: 'library|dad,lili|playground|·', en: 'We go back to the playground.', zh: '我们回到操场。' },
      { art: 'library|dad,lili|playground|♪', en: 'The playground is big and new.', zh: '操场又大又新。' },
      { art: 'library|dad,lili|playground|👀', en: 'I see a ball and a flag.', zh: '我看见一个球和一面旗。' },
      { art: 'library|dad,lili|playground|?', en: 'We play with the ball and laugh.', zh: '我们玩球，笑得很开心。' },
      { art: 'library|dad,lili|playground|·', en: 'We run and we clap and we spin.', zh: '我们跑、拍手、转圈。' },
      { art: 'library|dad,lili|playground|!', en: 'A clock says it is early.', zh: '有个钟说，时间还早。' },
      { art: 'library|dad,lili|playground|♥', en: 'We play some more. Then we rest.', zh: '我们又玩了一会儿。然后歇一歇。' },
      { art: 'library|dad,lili|playground|★', en: 'Back to the playground, all is well.', zh: '回到操场，一切都好。' },
      { art: 'library|dad,lili|playground|…', en: 'I like the playground.', zh: '我喜欢这个操场。' }
    ],
    quiz: [
      { q: '我们在操场上看见了什么？', opts: ['一个钟和一个篮子', '一只猫和一只狗', '一个球和一面旗'], a: 2, kind: 'recall' },
      { q: '他们又玩了一会儿才休息，说明什么？', opts: ['他们不想回家吃饭', '操场要关门了', '他们玩得很尽兴'], a: 2, kind: 'infer' },
      { q: '和朋友一起玩，你会怎么做？', opts: ['轮流、一起玩，玩得开心', '自己霸占', '不玩了'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b49', lv: 'L5', tag: '种植', title: 'A Seed in a Pot', zh: '盆里的种子',
    emoji: '🌱', color: '#F6C6C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 1 个新词（棕色）。',
    trap: '元音组合只读一个长音：ai / ay 都读 /eɪ/，oa 读 /əʊ/；别把两个字母分开念。',
    summary: '《盆里的种子》：这是一个完整的小故事。读前先看词卡（棕色）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，讲讲这件事是怎么一步步发展的，中间卡在哪儿。',
    think: '说说一粒种子是怎么发芽的。',
    pre: [
      { art: '🟤', en: 'brown', zh: '棕色' },
      { art: '🍲', en: 'pot', zh: '锅' },
      { art: '🌱', en: 'seed', zh: '种子' }
    ],
    sight: ['ground', 'grows', 'leaf', 'water'],
    newWords: [
      { w: 'brown', zh: '棕色' }
    ],
    pages: [
      { art: 'garden|ming,grandma|seed|·', en: 'I have a pot. The pot is small and brown.', zh: '我有一个盆。盆不大，是褐色的。' },
      { art: 'garden|ming,grandma|seed|♪', en: 'I put a seed in the pot. It goes into the ground.', zh: '我把一粒种子放进盆里。它进了土里。' },
      { art: 'garden|ming,grandma|seed|👀', en: 'The seed is small. It looks like a stone.', zh: '种子很小。它看着像块石头。' },
      { art: 'garden|ming,grandma|seed|?', en: 'I give it water. I put the pot in the sun.', zh: '我给它浇水。我把盆放在太阳下。' },
      { art: 'garden|ming,grandma|seed|·', en: 'The seed is in the pot. I look at it every day.', zh: '种子在盆里。我每天都看它。' },
      { art: 'garden|ming,grandma|seed|!', en: 'I wait and wait. I wait for a week.', zh: '我等啊等。等了一个星期。' },
      { art: 'garden|ming,grandma|seed|♥', en: 'A stem comes up! It is small and green.', zh: '一根茎冒出来了！它又小又绿。' },
      { art: 'garden|ming,grandma|seed|★', en: 'A leaf is up too. It is green and turns to the sun.', zh: '一片叶子也长出来了。它绿绿的，朝着太阳。' },
      { art: 'garden|ming,grandma|seed|…', en: 'The seed grows. The pot is full of green.', zh: '种子长起来了。盆里全是绿色。' },
      { art: 'garden|ming,grandma|seed|·', en: 'I like my pot and seed. I will water them tomorrow.', zh: '我喜欢我的盆和种子。明天我还要浇水。' }
    ],
    quiz: [
      { q: '种子最后长出了什么？', opts: ['一根茎和一片叶子', '一朵花', '一个果子'], a: 0, kind: 'recall' },
      { q: '明明等了一个星期才看到茎，说明种子发芽要什么？', opts: ['要时间，急不来', '要更多的土', '要搬到屋里'], a: 0, kind: 'infer' },
      { q: '种下一样东西，你会怎么做？', opts: ['每天挖出来看', '浇水、耐心等它长', '不管它'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b50', lv: 'L5', tag: '观察', title: 'A Tail and a Chain', zh: '尾巴和链子',
    emoji: '🐐', color: '#F9DFB4',
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
      { art: 'library|lili,grandpa|tail|·', en: 'A dog has a tail. The dog is big and brown.', zh: '狗有一条尾巴。这只狗又大又褐。' },
      { art: 'library|lili,grandpa|tail|♪', en: 'The tail is long. It moves when the dog runs.', zh: '尾巴很长。狗跑的时候它就动。' },
      { art: 'library|lili,grandpa|tail|👀', en: 'The tail goes up and down. The dog is glad to see me.', zh: '尾巴上下摆动。狗看见我很高兴。' },
      { art: 'library|lili,grandpa|tail|?', en: 'The dog has a chain too. It is on the dog.', zh: '狗还有一条链子。链子套在狗身上。' },
      { art: 'library|lili,grandpa|tail|·', en: 'The chain is short, so the dog stays by the house.', zh: '链子不长，所以狗待在房子边。' },
      { art: 'library|lili,grandpa|tail|!', en: 'The dog runs and the tail goes too. The chain stops the dog at the gate.', zh: '狗一跑，尾巴也跟着动。链子把狗拦在门口。' },
      { art: 'library|lili,grandpa|tail|♥', en: 'I like the dog and the tail. I watch them from here.', zh: '我喜欢这只狗和它的尾巴。我从这儿看着它们。' },
      { art: 'library|lili,grandpa|tail|★', en: 'The tail is part of the dog. The chain is not.', zh: '尾巴是狗的一部分。链子不是。' },
      { art: 'library|lili,grandpa|tail|…', en: 'The dog is happy. It sits and waits for me.', zh: '狗很高兴。它坐着等我。' },
      { art: 'library|lili,grandpa|tail|·', en: 'I am happy too. I sit with the dog.', zh: '我也很高兴。我陪着狗坐。' }
    ],
    quiz: [
      { q: '狗脖子上的链子有什么用？', opts: ['把它拦在门口', '拉着它走', '给它玩'], a: 0, kind: 'recall' },
      { q: '狗看见「我」就摇尾巴，说明什么？', opts: ['它高兴，喜欢我', '它害怕我', '它生气了'], a: 0, kind: 'infer' },
      { q: '看到一只被链子拴着的狗，你会怎么做？', opts: ['大声吓它', '轻轻看它，别靠近吓它', '去拉它的链子'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b51', lv: 'L5', tag: '趣事', title: 'The Goat and a Coat', zh: '山羊和外套',
    emoji: '🧥', color: '#CDE7C6',
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
    sight: ['eats', 'grows', 'warm', 'wear'],
    newWords: [
      { w: 'goat', zh: '山羊' },
      { w: 'coat', zh: '外套' }
    ],
    pages: [
      { art: 'home|grandma,mom|coat|·', en: 'A goat is on the hill. The wind is cold.', zh: '小山上有一只山羊。风很冷。' },
      { art: 'home|grandma,mom|coat|♪', en: 'The goat is small. It eats grass on the hill.', zh: '山羊不大。它在小山上吃草。' },
      { art: 'home|grandma,mom|coat|👀', en: 'I have a coat. The coat is thick and red.', zh: '我有一件外套。外套又厚又红。' },
      { art: 'home|grandma,mom|coat|?', en: 'The coat is big. It is too big for me.', zh: '外套很大。它对我太大了。' },
      { art: 'home|grandma,mom|coat|·', en: 'I wear the coat. I put my hands in it.', zh: '我穿上外套。我把手放进去。' },
      { art: 'home|grandma,mom|coat|!', en: 'The goat is on the hill. It does not move.', zh: '山羊在小山上。它一动不动。' },
      { art: 'home|grandma,mom|coat|♥', en: 'I am warm with the coat. The goat has no coat.', zh: '我穿着外套很暖。山羊没有外套。' },
      { art: 'home|grandma,mom|coat|★', en: 'The goat is warm too. Its coat grows on its back.', zh: '山羊也暖和。它的「外套」长在背上。' },
      { art: 'home|grandma,mom|coat|…', en: 'I like the goat. I go up the hill to see it.', zh: '我喜欢这只山羊。我走上小山去看它。' },
      { art: 'home|grandma,mom|coat|·', en: 'The goat likes the hill. It stays there all day.', zh: '山羊喜欢这座小山。它整天待在那儿。' }
    ],
    quiz: [
      { q: '「我」穿上什么才暖和起来？', opts: ['一条围巾', '一顶帽子', '厚厚的红外套'], a: 2, kind: 'recall' },
      { q: '「我」有大外套，山羊没有，为什么它也暖和？', opts: ['它自己长着厚毛', '风停了', '它跑起来就不冷'], a: 0, kind: 'infer' },
      { q: '天冷的时候，你会怎么做？', opts: ['穿上暖和的衣服', '不出门', '穿得很少'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b52', lv: 'L5', tag: '动物', title: 'Food at the Zoo', zh: '动物园的食物',
    emoji: '🦒', color: '#C6DEF6',
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
      { art: 'library|grandpa,dad|zoo|·', en: 'We go to the zoo. It is not far, so we walk.', zh: '我们去动物园。路不远，所以走过去。' },
      { art: 'library|grandpa,dad|zoo|♪', en: 'The zoo has many animals. Some are big.', zh: '动物园里动物很多。有的大。' },
      { art: 'library|grandpa,dad|zoo|👀', en: 'We see a goat and a pig. The pig sits in the mud.', zh: '我们看见一只山羊和一头猪。猪坐在泥里。' },
      { art: 'library|grandpa,dad|zoo|?', en: 'The animals are hungry. They come near us.', zh: '动物们饿了。它们走近我们。' },
      { art: 'library|grandpa,dad|zoo|·', en: 'We give them food. We put it down and step back.', zh: '我们给它们食物。我们放下，然后退开。' },
      { art: 'library|grandpa,dad|zoo|!', en: 'The goat eats the food. It eats it all.', zh: '山羊吃着食物。它全吃完了。' },
      { art: 'library|grandpa,dad|zoo|♥', en: 'The pig eats too. It eats fast, so we give it more.', zh: '猪也吃。它吃得快，于是我们又给了一些。' },
      { art: 'library|grandpa,dad|zoo|★', en: 'Food at the zoo. We watch them eat and we laugh.', zh: '动物园里的食物。我们看着它们吃，笑了起来。' },
      { art: 'library|grandpa,dad|zoo|…', en: 'The animals are happy. They sit in the sun and rest.', zh: '动物们很高兴。它们坐在太阳下歇着。' },
      { art: 'library|grandpa,dad|zoo|·', en: 'We like the zoo. We want to come back next week.', zh: '我们喜欢动物园。下周还想再来。' }
    ],
    quiz: [
      { q: '我们把食物怎么给动物？', opts: ['扔给它们', '拿在手里喂', '放下食物，然后退开'], a: 2, kind: 'recall' },
      { q: '喂完动物，我们为什么要退开？', opts: ['要让它们自己来拿', '食物太烫', '不想吓到它们'], a: 2, kind: 'infer' },
      { q: '在动物园里，你会怎么做？', opts: ['乱喂东西', '大声吓它们', '按规定喂食，轻轻看它们'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b53', lv: 'L5', tag: '好笑', title: 'The Cake on the Wall', zh: '墙上的蛋糕',
    emoji: '🎂', color: '#E0CFF3',
    track: 'humor',
    goal: '跟着一个好笑的故事读到最后，看看笑点在哪儿。认读 4 个新词（蛋糕、甜、好、房间）。',
    trap: '元音组合只读一个长音：ai / ay 都读 /eɪ/，oa 读 /əʊ/；别把两个字母分开念。',
    summary: '《墙上的蛋糕》：这是一个完整的小故事。读前先看词卡（蛋糕、甜、好、房间）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，讲讲这件事是怎么一步步发展的，中间卡在哪儿。',
    think: '如果是你，你会把蛋糕放在哪儿？说说你的理由。',
    pre: [
      { art: '🎂', en: 'cake', zh: '蛋糕' },
      { art: '✨', en: 'sweet', zh: '甜' },
      { art: '✨', en: 'nice', zh: '好' },
      { art: '📦', en: 'room', zh: '房间' },
      { art: '🐶', en: 'dog', zh: '狗' }
    ],
    sight: ['clean', 'laugh', 'white'],
    newWords: [
      { w: 'cake', zh: '蛋糕' },
      { w: 'sweet', zh: '甜' },
      { w: 'nice', zh: '好' },
      { w: 'room', zh: '房间' }
    ],
    pages: [
      { art: 'kitchen|mom,ming|cake|·', en: 'Ming makes a cake for Grandma. It is big and very sweet.', zh: '明明给奶奶做了一个蛋糕。它又大又甜。' },
      { art: 'kitchen|mom,ming|cake|♪', en: 'Grandma will come today. Ming wants to put the cake in a good place.', zh: '奶奶今天要来。明明想把蛋糕放个好地方。' },
      { art: 'kitchen|mom,ming|cake|👀', en: 'He looks at the table first. The table is small, and it is full of things.', zh: '他先看了看桌子。桌子又小，上面还放满了东西。' },
      { art: 'kitchen|mom,ming|cake|?', en: 'Then Ming looks at the white wall. It is clean and white by the door.', zh: '然后明明看了看那面白墙。墙就在门边，又干净又白。' },
      { art: 'kitchen|mom,ming|cake|·', en: 'Ming has a very good idea. He puts the cake on the wall.', zh: '明明想到了一个好主意。他把蛋糕放到了墙上。' },
      { art: 'kitchen|mom,ming|cake|!', en: 'Now the cake is up on the wall. It looks nice there, and everyone can see it.', zh: '现在，蛋糕高高地待在墙上。它在那儿挺好看，谁都能看见。' },
      { art: 'kitchen|mom,ming|cake|♥', en: 'Mom comes into the room with some cups. She looks at the table and stops.', zh: '妈妈端着几个杯子进屋来。她看了看桌子，愣住了。' },
      { art: 'kitchen|mom,ming|cake|★', en: 'Mom asks where the big cake is. Nobody in the room can find it.', zh: '妈妈问那个大蛋糕在哪儿。屋里的人都找不到它。' },
      { art: 'kitchen|mom,ming|cake|…', en: 'Then the little dog looks up at the wall. He sees the cake up there and runs to it.', zh: '小狗抬起头看了看墙。它看见蛋糕在上面，就跑了过去。' },
      { art: 'kitchen|mom,ming|cake|·', en: 'Everyone looks up and starts to laugh. The cake is on the wall, not on the table!', zh: '大家抬头一看，都笑了起来。蛋糕在墙上，不在桌子上！' }
    ],
    quiz: [
      { q: '明明把蛋糕放到哪儿了？', opts: ['门外', '墙上', '桌子下面'], a: 1, kind: 'recall' },
      { q: '大家看到蛋糕在墙上，为什么都笑了？', opts: ['蛋糕坏掉了，不能吃', '蛋糕放到墙上，太奇怪了', '他们本来就不爱吃蛋糕'], a: 1, kind: 'infer' },
      { q: '家里有好吃的，你会把它放在哪儿？', opts: ['挂到墙上', '扔在地上', '放在餐桌上'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b54', lv: 'L5', tag: '想象', title: 'The Moon Wants a Scarf', zh: '想要围巾的月亮',
    emoji: '🌙', color: '#F6C9E3',
    track: 'fantasy',
    goal: '跟着一个想象出来的故事，把来龙去脉读顺。认读 1 个新词（围巾）。',
    trap: '元音组合只读一个长音：ai / ay 都读 /eɪ/，oa 读 /əʊ/；别把两个字母分开念。',
    summary: '《想要围巾的月亮》：这是一个完整的小故事。读前先看词卡（围巾）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，讲讲这件事是怎么一步步发展的，中间卡在哪儿。',
    think: '如果你想送月亮一样东西，你想送什么？为什么？',
    pre: [
      { art: '🧣', en: 'scarf', zh: '围巾' },
      { art: '🌙', en: 'moon', zh: '月亮' },
      { art: '🌿', en: 'sky', zh: '天空' }
    ],
    sight: ['bright', 'friend', 'near', 'stars', 'warm', 'wears'],
    newWords: [
      { w: 'scarf', zh: '围巾' }
    ],
    pages: [
      { art: 'night|dad,lili|moon|·', en: 'The moon is up in the night sky. It is cold up there every night.', zh: '月亮挂在夜空里。它每天晚上在上面都很冷。' },
      { art: 'night|dad,lili|moon|♪', en: 'One night the moon talks to Ming. The moon says it wants a warm scarf.', zh: '一天夜里，月亮和明明说话。月亮说，它想要一条暖和的围巾。' },
      { art: 'night|dad,lili|moon|👀', en: 'Ming has a red scarf in his room. It is long, warm, and very soft.', zh: '明明的房间里有一条红围巾。它又长又暖和，还特别软。' },
      { art: 'night|dad,lili|moon|?', en: 'He takes the scarf outside to a tree. The night wind can find it there.', zh: '他把围巾拿到外面的一棵树上。夜里的风能在那儿找到它。' },
      { art: 'night|dad,lili|moon|·', en: 'The wind takes the scarf up and up. It goes all the way to the moon.', zh: '风带着围巾越飞越高。它一直飞到月亮那儿。' },
      { art: 'night|dad,lili|moon|!', en: 'The moon puts the scarf on and smiles. Now it is warm all night long.', zh: '月亮围上围巾，笑了。现在它一整夜都是暖和的。' },
      { art: 'night|dad,lili|moon|♥', en: 'The red scarf is bright in the sky. The stars come near to look at it.', zh: '红围巾在空中亮亮的。星星们都凑过来看它。' },
      { art: 'night|dad,lili|moon|★', en: 'The moon tells the stars about Ming. The moon says he is a good friend.', zh: '月亮给星星们讲明明的事。它说明明是个好朋友。' },
      { art: 'night|dad,lili|moon|…', en: 'When the sun comes up, the moon goes down. The scarf comes back to the tree for the day.', zh: '太阳升起来，月亮就落下去。白天，围巾又回到树上。' },
      { art: 'night|dad,lili|moon|·', en: 'At night the moon wears the scarf again. Ming looks up, and the moon looks back.', zh: '到了夜里，月亮又围上了围巾。明明抬头看，月亮也看着他。' }
    ],
    quiz: [
      { q: '明明把围巾放在了哪儿？', opts: ['外面的一棵树上', '水里', '窗台上'], a: 0, kind: 'recall' },
      { q: '他为什么把围巾挂到外面的树上？', opts: ['他想让树也暖和暖和', '他不想要这条围巾了', '他想让风把围巾带给月亮'], a: 2, kind: 'infer' },
      { q: '天冷的时候，你会怎么让自己暖和？', opts: ['多穿衣服，戴上围巾和帽子', '一直站在风口不动', '少穿一点，出门吹风'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b55', lv: 'L5', tag: '自然', title: 'Clouds', zh: '天上的云',
    emoji: '☁️', color: '#BFE6DF',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。认读 2 个新词（雨、海）。',
    trap: '元音组合只读一个长音：ai / ay 都读 /eɪ/，oa 读 /əʊ/；别把两个字母分开念。',
    summary: '《天上的云》：这一本从一件小事讲起，说说为什么会这样。读前先看词卡（雨、海）；读的时候留意先看到什么、为什么会这样、后来怎么弄明白。',
    retell: '合上书，按「先看到什么 → 为什么会这样 → 后来怎么弄明白」讲一遍。',
    think: '你见过什么样的云？说说它像什么。',
    pre: [
      { art: '🌧️', en: 'rain', zh: '雨' },
      { art: '🌊', en: 'sea', zh: '海' },
      { art: '🌿', en: 'sky', zh: '天空' },
      { art: '💧', en: 'water', zh: '水' }
    ],
    sight: ['cloud', 'clouds', 'ground', 'high', 'light', 'warms', 'water', 'white'],
    newWords: [
      { w: 'rain', zh: '雨' },
      { w: 'sea', zh: '海' }
    ],
    pages: [
      { art: 'library|ming,grandma|cloud|·', en: 'Look up at the sky in the day. You can see many white clouds.', zh: '白天抬头看看天空。你能看见好多白云。' },
      { art: 'library|ming,grandma|cloud|♪', en: 'A cloud is made of many small drops. Each drop is only a little water.', zh: '云是许多小水滴聚成的。每一滴只是一点点水。' },
      { art: 'library|ming,grandma|cloud|👀', en: 'The drops are small and light. They stay up in the sky.', zh: '这些水滴又小又轻。它们就待在天上，掉不下来。' },
      { art: 'library|ming,grandma|cloud|?', en: 'When many drops get together, they get big. Then they fall down to us as rain.', zh: '许多水滴聚到一起，就会变大。然后它们落下来，就成了雨。' },
      { art: 'library|ming,grandma|cloud|·', en: 'Dark clouds have more water in them. They often bring us rain.', zh: '乌云里的水更多。它们常常会带来雨。' },
      { art: 'library|ming,grandma|cloud|!', en: 'White clouds are light and small. They often just sit in the sky.', zh: '白云又轻又小。它们常常就静静地待在天上。' },
      { art: 'library|ming,grandma|cloud|♥', en: 'Where do clouds come from? Water goes up from the sea and the ground.', zh: '云是从哪儿来的呢？水从大海和地面升上去。' },
      { art: 'library|ming,grandma|cloud|★', en: 'High up in the sky it is cold. The water makes very small drops there.', zh: '天上很高很高的地方很冷。水在那里变成了很小的水滴。' },
      { art: 'library|ming,grandma|cloud|…', en: 'The sun can make a cloud go away. It warms the drops, and they go up.', zh: '太阳能让云散开。它把水滴晒暖，水滴就升上去了。' },
      { art: 'library|ming,grandma|cloud|·', en: 'Now we know what a cloud is. Look up and see the water in the sky!', zh: '现在我们知道云是什么了。抬头看看天上的水吧！' }
    ],
    quiz: [
      { q: '云是由什么变成的？', opts: ['棉花和糖', '小石头', '很多很小的水滴'], a: 2, kind: 'recall' },
      { q: '看到黑黑的乌云，我们可以猜到什么？', opts: ['今天肯定一点儿风也没有', '快要下雨了', '太阳马上要出来了'], a: 1, kind: 'infer' },
      { q: '洗过的湿衣服想快点干，你会怎么做？', opts: ['把衣服泡进水里', '把衣服晒到太阳底下', '把衣服叠好收进柜子'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b56', lv: 'L5', tag: '动物', title: 'Ants at Work', zh: '蚂蚁在干活',
    emoji: '🐜', color: '#F2E2A8',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。认读 2 个新词（闻、遇见）。',
    trap: '元音组合只读一个长音：ai / ay 都读 /eɪ/，oa 读 /əʊ/；别把两个字母分开念。',
    summary: '《蚂蚁在干活》：这一本从一件小事讲起，说说为什么会这样。读前先看词卡（闻、遇见）；读的时候留意先看到什么、为什么会这样、后来怎么弄明白。',
    retell: '合上书，按「先看到什么 → 为什么会这样 → 后来怎么弄明白」讲一遍。',
    think: '小蚂蚁还能一起做什么事？说一说。',
    pre: [
      { art: '🏃', en: 'smell', zh: '闻' },
      { art: '🏃', en: 'meet', zh: '遇见' },
      { art: '🐜', en: 'ant', zh: '蚂蚁' },
      { art: '📦', en: 'food', zh: '食物' }
    ],
    sight: ['carry', 'ground', 'leaves', 'watch'],
    newWords: [
      { w: 'smell', zh: '闻' },
      { w: 'meet', zh: '遇见' }
    ],
    pages: [
      { art: 'library|lili,grandpa|ant|·', en: 'You can see ants on the grass. They are small, but they are always at work.', zh: '你能在草地上看见蚂蚁。它们个子小，却总在干活。' },
      { art: 'library|lili,grandpa|ant|♪', en: 'One ant cannot carry much food alone. Many ants can carry big things together.', zh: '一只蚂蚁搬不动多少食物。许多蚂蚁一起，就能搬动大东西。' },
      { art: 'library|lili,grandpa|ant|👀', en: 'Ants stay under the ground. They dig little rooms down there.', zh: '蚂蚁住在地下。它们在下面挖出一个个小房间。' },
      { art: 'library|lili,grandpa|ant|?', en: 'Many ants have one home. They work and work there all day.', zh: '许多蚂蚁住在一个家里。它们整天在家里忙个不停。' },
      { art: 'library|lili,grandpa|ant|·', en: 'One ant goes out to find food. When it finds some, it goes back.', zh: '一只蚂蚁出门去找食物。找到以后，它就回家去。' },
      { art: 'library|lili,grandpa|ant|!', en: 'It leaves a smell on the way. The other ants follow the smell.', zh: '它在路上留下一股味道。别的蚂蚁就顺着味道找过来。' },
      { art: 'library|lili,grandpa|ant|♥', en: 'Then many ants come to carry the food. They take it home together.', zh: '然后许多蚂蚁过来搬食物。它们一起把食物搬回家。' },
      { art: 'library|lili,grandpa|ant|★', en: 'Two ants meet on a little path. They make room for each other.', zh: '两只蚂蚁在小路上碰了面。它们互相让一让，让对方先走。' },
      { art: 'library|lili,grandpa|ant|…', en: 'Ants do not stop when they work. They are small, but their work is big.', zh: '蚂蚁干起活来就不停手。它们小小的，干的活却不小。' },
      { art: 'library|lili,grandpa|ant|·', en: 'Next time you see an ant, watch it. See how small ants work together.', zh: '下次看见蚂蚁，就好好看看它。瞧，小小的蚂蚁一起干大活。' }
    ],
    quiz: [
      { q: '蚂蚁住在什么地方？', opts: ['高高的树上', '水里', '地下的家里'], a: 2, kind: 'recall' },
      { q: '蚂蚁在路上留下味道，是为了什么？', opts: ['把小路弄得香香的', '让别的蚂蚁找到食物和回家的路', '只是走路时不小心弄的'], a: 1, kind: 'infer' },
      { q: '和同学一起搬又重又大的东西，你会怎么做？', opts: ['自己一个人硬搬', '大家一起用力，互相帮忙', '站在旁边看别人搬'], a: 1, kind: 'transfer' }
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
      { art: 'table|grandma,mom|rain|♥', en: 'Rain can be in the day. Both words are good to know.', zh: '白天下雨也可以。两个词都很好记。' },
      { art: 'table|grandma,mom|rain|★', en: 'You can say both. Say them one after the other.', zh: '两个词你都能说。一个接一个地说。' },
      { art: 'table|grandma,mom|rain|…', en: 'Good! Now say them fast, and do not mix them.', zh: '很好！现在说快一点，别弄混。' },
      { art: 'table|grandma,mom|rain|·', en: 'Rain, day, rain, day. Now you can read both.', zh: 'rain，day，rain，day。现在两个你都读得了。' }
    ],
    quiz: [
      { q: '这一本在练哪两个词？', opts: ['rain 和 ray', 'rain 和 day', 'day 和 bay'], a: 1, kind: 'recall' },
      { q: 'rain 和 day 里相同的音是哪个？', opts: ['开头的音一样', 'ai 和 ay 都读 /eɪ/', '结尾的音一样'], a: 1, kind: 'infer' },
      { q: '两个词放在一起，你会怎么读？', opts: ['一个一个读，再连起来', '混在一起读', '不读了'], a: 0, kind: 'transfer' }
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
      { art: 'garden|grandpa,dad|seed|♪', en: 'The seed needs rain. Rain is water for the seed.', zh: '种子需要雨。雨水就是种子的水。' },
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
      { q: '如果一直不下雨，盆里的种子会怎么样？', opts: ['长得更快', '地一直是干的，长不出来', '自己跑到水里'], a: 1, kind: 'infer' },
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
      { art: 'farm|mom,ming|farm|♪', en: 'One day I feed the pig. It is hungry, so it eats and eats.', zh: '有一天我喂猪。它饿了，吃啊吃。' },
      { art: 'farm|mom,ming|farm|👀', en: 'One day I wash the goat. It is clean now.', zh: '有一天我给山羊洗澡。它现在干净了。' },
      { art: 'farm|mom,ming|farm|?', en: 'One day I pick the corn. The corn is tall.', zh: '有一天我摘玉米。玉米很高。' },
      { art: 'farm|mom,ming|farm|·', en: 'One day I find an egg. It is small and warm.', zh: '有一天我找到一个蛋。它又小又暖。' },
      { art: 'farm|mom,ming|farm|!', en: 'One day I watch the rain. I stay at home.', zh: '有一天我看雨。我待在家里。' },
      { art: 'farm|mom,ming|farm|♥', en: 'One day I sit on the hill. I look at the farm.', zh: '有一天我坐在小山上。我看着农场。' },
      { art: 'farm|mom,ming|farm|★', en: 'A week on the farm. Every day is different.', zh: '农场的一周。每天都不同。' },
      { art: 'farm|mom,ming|farm|…', en: 'The farm is good. I like the animals and the work.', zh: '农场真不错。我喜欢这些动物，也喜欢这些活。' },
      { art: 'farm|mom,ming|farm|·', en: 'I want to come back. I will come again next year.', zh: '我想再来。明年我还要来。' }
    ],
    quiz: [
      { q: '在农场这一周，「我」做了什么？', opts: ['喂猪、洗山羊、摘玉米', '只喂了猪', '一直待在屋里'], a: 0, kind: 'recall' },
      { q: '明明每天做的事都不一样，这样的一周他觉得怎么样？', opts: ['太累了，不想再来', '每天都一样，很无聊', '每天都有新鲜事，很有意思'], a: 2, kind: 'infer' },
      { q: '在农场待几天，你会怎么做？', opts: ['每天做一点不一样的事', '天天一样', '什么都不做'], a: 0, kind: 'transfer' }
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
      { art: 'library|dad,lili|road|…', en: 'All the way home, the road feels long.', zh: '一路回家，路真长。' },
      { art: 'library|dad,lili|road|·', en: 'I am home! Mom is there with cold water.', zh: '我到家了！妈妈在那儿，准备了凉水。' }
    ],
    quiz: [
      { q: '走到最后，「我」看见了什么？', opts: ['一条河', '家，妈妈在那儿', '一座桥'], a: 1, kind: 'recall' },
      { q: '明明为什么在石头上坐下来？', opts: ['他在等人', '石头很凉快', '他走累了，要歇一歇'], a: 2, kind: 'infer' },
      { q: '走很长的路，你会怎么做？', opts: ['一直不停，累垮', '累了就歇一歇，再接着走', '不走了'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b61', lv: 'L6', tag: '生日', title: 'A Cake for Grandma', zh: '给奶奶的蛋糕',
    emoji: '🎂', color: '#F6C6C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 1 个新词（好）。',
    trap: '词尾不发音的 e 会让前面的元音「报自己的名字」：cap → cape，kit → kite。',
    summary: '《给奶奶的蛋糕》：这是一个完整的小故事。读前先看词卡（好）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，讲讲这件事是怎么一步步发展的，中间卡在哪儿。',
    think: '说说你为家人做过的一件事。',
    pre: [
      { art: '✨', en: 'fine', zh: '好' },
      { art: '🎂', en: 'cake', zh: '蛋糕' },
      { art: '🥛', en: 'milk', zh: '牛奶' }
    ],
    sight: ['eats', 'high', 'piece'],
    newWords: [
      { w: 'fine', zh: '好' }
    ],
    pages: [
      { art: 'kitchen|ming,grandma|cake|·', en: 'Ming wants to make a cake. He gets up early, before the sun is high.', zh: '明明想做一个蛋糕。他起得很早，太阳还没升高。' },
      { art: 'kitchen|ming,grandma|cake|♪', en: 'The cake is for Grandma. He does not tell her.', zh: '蛋糕是给奶奶的。他没告诉她。' },
      { art: 'kitchen|ming,grandma|cake|👀', en: 'Ming gets the things ready. He puts eggs and milk on the table, and he finds a spoon.', zh: '明明把东西准备好。他把鸡蛋和牛奶放上桌，还找了一把勺子。' },
      { art: 'kitchen|ming,grandma|cake|?', en: 'Ming mixes the eggs and milk. He mixes fast because he wants to finish.', zh: '明明搅着鸡蛋和牛奶。他搅得很快，想赶紧做完。' },
      { art: 'kitchen|ming,grandma|cake|·', en: 'The cake is not right. It is thin and dry.', zh: '蛋糕不对。它又薄又干。' },
      { art: 'kitchen|ming,grandma|cake|!', en: 'Ming is sad. He sits down and does not want to try again.', zh: '明明很难过。他坐下，不想再试。' },
      { art: 'kitchen|ming,grandma|cake|♥', en: 'Grandma comes and helps. "It is fine," she says. "We will try again together."', zh: '奶奶过来帮忙。「没关系。」她说，「我们再一起试一次。」' },
      { art: 'kitchen|ming,grandma|cake|★', en: 'They make the cake again. This time Ming is careful, and he mixes slowly.', zh: '他们又做了一次。这次明明很小心，慢慢地搅。' },
      { art: 'kitchen|ming,grandma|cake|…', en: 'This time the cake is good. It is soft and sweet.', zh: '这次蛋糕成了。它又软又甜。' },
      { art: 'kitchen|ming,grandma|cake|·', en: 'Grandma likes the cake. She eats a big piece.', zh: '奶奶喜欢这个蛋糕。她吃了一大块。' },
      { art: 'kitchen|ming,grandma|cake|♥', en: 'A cake for Grandma. The second one is good.', zh: '给奶奶的蛋糕。第二个做成功了。' }
    ],
    quiz: [
      { q: '第一个蛋糕出了什么问题？', opts: ['太甜了', '烤糊了', '又薄又干，没做好'], a: 2, kind: 'recall' },
      { q: '明明坐下不想再试，是因为什么？', opts: ['他不喜欢吃蛋糕', '奶奶不让他做', '他有点灰心'], a: 2, kind: 'infer' },
      { q: '做一件事第一次不成功，你会怎么做？', opts: ['马上放弃', '找人帮帮忙，再做一次', '怪别人'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b62', lv: 'L6', tag: '运动', title: 'Ride a Bike', zh: '骑自行车',
    emoji: '🚲', color: '#F9DFB4',
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
      { art: 'street|lili,grandpa|bike|·', en: 'Dad has a bike. It is red and new.', zh: '爸爸有一辆自行车。它是红色的，还很新。' },
      { art: 'street|lili,grandpa|bike|♪', en: 'The bike is big. It is too big for Ming, but he wants to try.', zh: '车很大。它对明明太大了，可他想试试。' },
      { art: 'street|lili,grandpa|bike|👀', en: 'Ming wants to ride it. He puts on his cap and goes out.', zh: '明明想骑。他戴上帽子出了门。' },
      { art: 'street|lili,grandpa|bike|?', en: 'Ming gets on the bike. Dad holds the back.', zh: '明明上了车。爸爸扶着后座。' },
      { art: 'street|lili,grandpa|bike|·', en: 'The bike goes. It goes slowly at first, and Ming holds on.', zh: '车走了。一开始很慢，明明紧紧抓着。' },
      { art: 'street|lili,grandpa|bike|!', en: 'Ming rides and rides. He looks at the road, and he does not look down.', zh: '明明骑啊骑。他看着前面的路，不往下看。' },
      { art: 'street|lili,grandpa|bike|♥', en: 'Ming does not fall. He is careful, so the bike stays up.', zh: '明明没摔倒。他很小心，所以车稳稳的。' },
      { art: 'street|lili,grandpa|bike|★', en: 'Dad runs with the bike. He does not let go.', zh: '爸爸跟着车跑。他没有松手。' },
      { art: 'street|lili,grandpa|bike|…', en: 'Ming can ride the bike! "You can do it," Dad says, and he lets go.', zh: '明明会骑车了！「你能行。」爸爸说着，松开了手。' },
      { art: 'street|lili,grandpa|bike|·', en: 'Ride a bike. It is hard at first, and then it is easy.', zh: '骑自行车。一开始难，后来就容易了。' },
      { art: 'street|lili,grandpa|bike|♥', en: 'Ming likes the bike. He wants to ride again tomorrow.', zh: '明明喜欢这辆车。明天他还想骑。' }
    ],
    quiz: [
      { q: '爸爸一直扶着自行车的哪儿？', opts: ['车后面（后座）', '车把', '车轮'], a: 0, kind: 'recall' },
      { q: '爸爸跟在车后跑个不停，说明什么？', opts: ['他怕明明摔倒', '他自己想骑', '车坏了'], a: 0, kind: 'infer' },
      { q: '学骑车（学一样新本领），你会怎么做？', opts: ['一次就想学会', '找人扶着，慢慢练', '不学了'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b63', lv: 'L6', tag: '发现', title: 'A Note in a Book', zh: '书里的纸条',
    emoji: '📝', color: '#CDE7C6',
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
      { art: 'home|grandma,mom|note|·', en: 'A book is on the desk. It is an old thick book.', zh: '桌上有一本书。它是一本又旧又厚的书。' },
      { art: 'home|grandma,mom|note|♪', en: 'Ming opens the book. He wants to read.', zh: '明明打开书。他想读。' },
      { art: 'home|grandma,mom|note|👀', en: 'A note is in the book! It falls out.', zh: '书里有一张纸条！它掉了出来。' },
      { art: 'home|grandma,mom|note|?', en: 'The note is small. The paper is yellow and soft.', zh: '纸条很小。纸是黄的，软软的。' },
      { art: 'home|grandma,mom|note|·', en: 'Ming reads the note. He says the words out loud.', zh: '明明读这张纸条。他把字念出声来。' },
      { art: 'home|grandma,mom|note|!', en: 'The note says "Hello". There is a name too.', zh: '纸条上写着「你好」。还有一个名字。' },
      { art: 'home|grandma,mom|note|♥', en: 'Who wrote the note? Ming reads the name.', zh: '这纸条是谁写的？明明读那个名字。' },
      { art: 'home|grandma,mom|note|★', en: 'It was Grandma. Ming sees her name and knows.', zh: '是奶奶写的。明明看见她的名字就明白了。' },
      { art: 'home|grandma,mom|note|…', en: 'A note in a book. It has been there a long time.', zh: '书里的一张纸条。它在那儿放了很久了。' },
      { art: 'home|grandma,mom|note|·', en: 'Ming writes a note too. He puts it in the same book.', zh: '明明也写了一张纸条。他放进同一本书里。' },
      { art: 'home|grandma,mom|note|♥', en: 'Notes are fun. Grandma will find it and write back.', zh: '纸条很好玩。奶奶会发现它，然后回一张。' }
    ],
    quiz: [
      { q: '书里那张纸条上写着什么？', opts: ['「你好」，还有一个名字', '一幅小画', '一串电话号码'], a: 0, kind: 'recall' },
      { q: '书里夹着一张写着「你好」的纸条，说明这本书怎么样？', opts: ['是刚买的新书', '以前有人读过，还留了话', '不是明明的'], a: 1, kind: 'infer' },
      { q: '在书里发现一张纸条，你会怎么做？', opts: ['不看', '读一读，想想是谁写的', '扔掉'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b64', lv: 'L6', tag: '故事', title: 'The Brave Little Mouse', zh: '勇敢的小老鼠',
    emoji: '🐭', color: '#C6DEF6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 4 个新词（老鼠、洞、安静、勇敢）。',
    trap: '词尾不发音的 e 会让前面的元音「报自己的名字」：cap → cape，kit → kite。',
    summary: '《勇敢的小老鼠》：这是一个完整的小故事。读前先看词卡（老鼠、洞、安静、勇敢）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，讲讲这件事是怎么一步步发展的，中间卡在哪儿。',
    think: '说说小老鼠是怎么躲开猫的。',
    pre: [
      { art: '🐭', en: 'mouse', zh: '老鼠' },
      { art: '🕳️', en: 'hole', zh: '洞' },
      { art: '✨', en: 'quiet', zh: '安静' },
      { art: '✨', en: 'brave', zh: '勇敢' },
      { art: '🍞', en: 'bread', zh: '面包' },
      { art: '🍳', en: 'kitchen', zh: '厨房' }
    ],
    sight: ['bread', 'eats', 'kitchen', 'near'],
    newWords: [
      { w: 'mouse', zh: '老鼠' },
      { w: 'hole', zh: '洞' },
      { w: 'quiet', zh: '安静' },
      { w: 'brave', zh: '勇敢' }
    ],
    pages: [
      { art: 'library|grandpa,dad|mouse|·', en: 'A little mouse is here. It stands in the kitchen near the bread.', zh: '这儿有一只小老鼠。它站在厨房里，就在面包旁边。' },
      { art: 'library|grandpa,dad|mouse|♪', en: 'The mouse is small. Its tail is long.', zh: '老鼠很小。它的尾巴很长。' },
      { art: 'library|grandpa,dad|mouse|👀', en: 'The mouse is not afraid. It looks for food, and it goes here and there.', zh: '老鼠不怕。它找吃的，四处跑。' },
      { art: 'library|grandpa,dad|mouse|?', en: 'It smells the bread, so it comes near.', zh: '它闻到面包的味道，于是走近了。' },
      { art: 'library|grandpa,dad|mouse|·', en: 'A cat is here too! It comes in slowly.', zh: '这儿还有一只猫！它慢慢走进来。' },
      { art: 'library|grandpa,dad|mouse|!', en: 'The mouse runs fast. It runs to the hole and does not look back.', zh: '老鼠飞快地跑。它跑向洞口，头也不回。' },
      { art: 'library|grandpa,dad|mouse|♥', en: 'The mouse hides in the hole. It waits and does not move.', zh: '老鼠躲进洞里。它等着，一动不动。' },
      { art: 'library|grandpa,dad|mouse|★', en: 'The cat goes away. The kitchen is quiet again, and the bread is still there.', zh: '猫走了。厨房又安静了，面包还在那儿。' },
      { art: 'library|grandpa,dad|mouse|…', en: 'The mouse comes out. It finds the bread.', zh: '老鼠出来了。它找到了面包。' },
      { art: 'library|grandpa,dad|mouse|·', en: 'The brave little mouse. It is quick, and it is careful too.', zh: '勇敢的小老鼠。它跑得快，也很小心。' },
      { art: 'library|grandpa,dad|mouse|♥', en: 'The mouse is safe. It eats the bread now, and then it sleeps.', zh: '老鼠安全了。它吃了面包，然后睡了。' }
    ],
    quiz: [
      { q: '老鼠躲进洞里，是因为谁来了？', opts: ['人', '狗', '猫'], a: 2, kind: 'recall' },
      { q: '老鼠跑得飞快、马上躲起来，说明它怎么样？', opts: ['一点也不怕', '已经跑不动了', '不怕猫，但也很小心'], a: 2, kind: 'infer' },
      { q: '遇到危险，你会怎么做？', opts: ['追上去', '站在原地', '快点躲到安全的地方，找大人帮忙'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b65', lv: 'L6', tag: '韵文', title: 'By the Lake', zh: '在湖边',
    emoji: '🏞️', color: '#E0CFF3',
    track: 'rhyme',
    goal: '读一首小韵文，听清每一句句末的韵脚。认读 1 个新词（湖）。',
    trap: '词尾不发音的 e 会让前面的元音「报自己的名字」：cap → cape，kit → kite。',
    summary: '《在湖边》：这是一个完整的小故事。读前先看词卡（湖）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，讲讲这件事是怎么一步步发展的，中间卡在哪儿。',
    think: '在湖边还能看到什么、做什么？说一说。',
    pre: [
      { art: '🏞️', en: 'lake', zh: '湖' },
      { art: '💧', en: 'water', zh: '水' },
      { art: '⭐', en: 'star', zh: '星星' }
    ],
    sight: ['blue', 'bright', 'clouds', 'eat', 'high', 'leaves', 'star', 'warm'],
    newWords: [
      { w: 'lake', zh: '湖' }
    ],
    pages: [
      { art: 'library|mom,ming|lake|·', en: 'We all go down to the lake. We bring a big and sweet cake.', zh: '我们一起到湖边去。我们带了一块甜甜的大蛋糕。' },
      { art: 'library|mom,ming|lake|♪', en: 'We get in the little boat. Dad puts on his warm old coat.', zh: '我们坐上那条小船。爸爸穿上他那件暖和的旧外套。' },
      { art: 'library|mom,ming|lake|👀', en: 'We see a big fish. Then we eat from a dish.', zh: '我们看见一条大鱼。然后我们从盘子里拿东西吃。' },
      { art: 'library|mom,ming|lake|?', en: 'This is a fine day. At the lake we run and play.', zh: '今天天气真好。我们在湖边又跑又玩。' },
      { art: 'library|mom,ming|lake|·', en: 'It is nice to sit in the sun. Then we get up and have a run.', zh: '晒着太阳坐一坐真舒服。然后我们站起来跑一跑。' },
      { art: 'library|mom,ming|lake|!', en: 'We sit down under a tall green tree. It is nice here, as you can see.', zh: '我们坐在一棵高高的绿树下。这儿真不错，你瞧。' },
      { art: 'library|mom,ming|lake|♥', en: 'The white clouds go up so high. They sit up in the blue sky.', zh: '白云升得那么高。它们就待在蓝蓝的天上。' },
      { art: 'library|mom,ming|lake|★', en: 'When the wind comes, the leaves fall. The trees by the water are tall.', zh: '风一吹，树叶就落下来。水边的树长得高高的。' },
      { art: 'library|mom,ming|lake|…', en: 'We have fun with a red ball. It is very small.', zh: '我们玩一个红球，玩得很开心。这球个头小小的。' },
      { art: 'library|mom,ming|lake|·', en: 'The first star comes out, and it is far. We look up and see a star.', zh: '天上出来第一颗星星，离我们很远。我们抬头，就看见了它。' },
      { art: 'library|mom,ming|lake|♥', en: 'Then it is time to say good night. The moon is big, and the water is bright.', zh: '然后到了说晚安的时候。月亮大大的，水面亮亮的。' }
    ],
    quiz: [
      { q: '我们带了什么好吃的去湖边？', opts: ['一块大蛋糕', '一篮苹果', '一条大鱼'], a: 0, kind: 'recall' },
      { q: '天黑以后，水面为什么会亮亮的？', opts: ['水面结了一层冰', '水里开着灯', '月亮照在水面上'], a: 2, kind: 'infer' },
      { q: '去湖边玩一天，你会带上什么？', opts: ['带点吃的，再带一件外套', '什么都不带', '把家里的玩具全带上'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b66', lv: 'L6', tag: '好笑', title: 'The Pig in the Bed', zh: '床上的猪',
    emoji: '🐷', color: '#F6C9E3',
    track: 'humor',
    goal: '跟着一个好笑的故事读到最后，看看笑点在哪儿。不引入新词，全部是读过的词。',
    trap: '词尾不发音的 e 会让前面的元音「报自己的名字」：cap → cape，kit → kite。',
    summary: '《床上的猪》：这是一个完整的小故事。读前先看词卡，都是学过的词；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，讲讲这件事是怎么一步步发展的，中间卡在哪儿。',
    think: '如果是你，你会让小猪睡床吗？说说你的理由。',
    pre: [
      { art: '🐷', en: 'pig', zh: '猪' },
      { art: '🛏️', en: 'bed', zh: '床' }
    ],
    sight: ['eat', 'farm', 'house', 'laugh', 'quiet', 'warm'],
    newWords: [

    ],
    pages: [
      { art: 'farm|dad,lili|pig|·', en: 'Ming is at the farm for the night. He is going to sleep in a big bed.', zh: '明明晚上住在农场。他要睡在一张大床上。' },
      { art: 'farm|dad,lili|pig|♪', en: 'There is a little pig on the farm. It is fat, and it likes to eat.', zh: '农场里有一只小猪。它胖胖的，最喜欢吃东西。' },
      { art: 'farm|dad,lili|pig|👀', en: 'At night, it gets cold outside. The pig wants to find a warm place.', zh: '到了夜里，外面很冷。小猪想找个暖和的地方。' },
      { art: 'farm|dad,lili|pig|?', en: 'The pig sees the door is open. It goes inside to look for a bed.', zh: '小猪看见门开着。它进屋去找床。' },
      { art: 'farm|dad,lili|pig|·', en: 'Everyone is sleeping in a bed. The house is quiet and dark.', zh: '大家都在床上睡着了。屋子里又安静又黑。' },
      { art: 'farm|dad,lili|pig|!', en: 'The pig walks and walks to a room. There is a big bed in it.', zh: '小猪走啊走，来到一间屋子。屋里有一张大床。' },
      { art: 'farm|dad,lili|pig|♥', en: 'Ming is sleeping in the big bed. A warm coat is on the bed.', zh: '明明正在大床上睡觉。床上还放着一件暖和的外套。' },
      { art: 'farm|dad,lili|pig|★', en: 'The pig gets up on the bed. It sleeps there under the warm coat.', zh: '小猪爬上了床。它盖着那件暖和的外套，就在那儿睡了。' },
      { art: 'farm|dad,lili|pig|…', en: 'In the morning Ming wakes up in the big bed. He sees the pig next to him.', zh: '早上，明明在床上醒来了。他看见小猪就在自己旁边。' },
      { art: 'farm|dad,lili|pig|·', en: 'Ming looks at the pig and starts to laugh. The pig is sleeping and does not move.', zh: '明明看着小猪，哈哈大笑。小猪还在睡，一动不动。' },
      { art: 'farm|dad,lili|pig|♥', en: 'Now the pig sleeps on the bed every night. Ming laughs and makes room for the pig.', zh: '现在，小猪每天晚上都睡在床上。明明笑着，给小猪腾地方。' }
    ],
    quiz: [
      { q: '小猪睡到哪儿去了？', opts: ['明明的床上', '桌子底下', '猪圈里'], a: 0, kind: 'recall' },
      { q: '小猪为什么选了这张床？', opts: ['床上有暖和的外套', '这张床离门口最近', '床上放着好吃的'], a: 0, kind: 'infer' },
      { q: '冬天小动物怕冷，你可以怎么做？', opts: ['装作没有看见', '给它铺一个暖和的小窝', '把它赶到外面去'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b67', lv: 'L6', tag: '食物', title: 'How Bread Is Made', zh: '面包是怎么做的',
    emoji: '🍞', color: '#BFE6DF',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。认读 3 个新词（小麦、烤箱、烤）。',
    trap: '词尾不发音的 e 会让前面的元音「报自己的名字」：cap → cape，kit → kite。',
    summary: '《面包是怎么做的》：这一本从一件小事讲起，说说为什么会这样。读前先看词卡（小麦、烤箱、烤）；读的时候留意先看到什么、为什么会这样、后来怎么弄明白。',
    retell: '合上书，按「先看到什么 → 为什么会这样 → 后来怎么弄明白」讲一遍。',
    think: '你还知道什么食物是用粮食做出来的？说一说。',
    pre: [
      { art: '🌾', en: 'wheat', zh: '小麦' },
      { art: '📦', en: 'oven', zh: '烤箱' },
      { art: '🏃', en: 'bake', zh: '烤' },
      { art: '🍞', en: 'bread', zh: '面包' },
      { art: '⚽', en: 'ball', zh: '球' }
    ],
    sight: ['bread', 'break', 'brown', 'eat', 'farm', 'grows', 'pieces', 'warm'],
    newWords: [
      { w: 'wheat', zh: '小麦' },
      { w: 'oven', zh: '烤箱' },
      { w: 'bake', zh: '烤' }
    ],
    pages: [
      { art: 'library|ming,grandma|bread|·', en: 'We eat bread in the morning. Bread is good food for every day.', zh: '我们早上吃面包。面包是每天都吃的好食物。' },
      { art: 'library|ming,grandma|bread|♪', en: 'Bread is made from wheat. Wheat grows on the farm.', zh: '面包是用麦子做的。麦子长在农场里。' },
      { art: 'library|ming,grandma|bread|👀', en: 'People take the wheat and make it dry. Then they break it into very small pieces.', zh: '人们把麦子收下来晒干。然后把它们弄成很小很小的碎粒。' },
      { art: 'library|ming,grandma|bread|?', en: 'The small wheat is white and soft. We mix it with water in a bowl.', zh: '磨碎的麦子又白又软。我们在碗里把它和水拌在一起。' },
      { art: 'library|ming,grandma|bread|·', en: 'We use our hands to make a ball. We push it and work it again and again.', zh: '我们用手把它揉成一个面团。我们一遍一遍地揉它、按它。' },
      { art: 'library|ming,grandma|bread|!', en: 'The ball is soft and wet. Now it is ready for the oven.', zh: '面团又软又湿。现在可以放进烤箱了。' },
      { art: 'library|ming,grandma|bread|♥', en: 'Then we put the ball in the oven. The oven is very hot inside.', zh: '然后我们把面团放进烤箱。烤箱里面非常热。' },
      { art: 'library|ming,grandma|bread|★', en: 'We bake the bread for some time. It gets brown and smells very good.', zh: '我们把面包烤上一段时间。它变成棕色，闻起来很香。' },
      { art: 'library|ming,grandma|bread|…', en: 'Then we take the bread out. We cannot eat it when it is too hot.', zh: '然后我们把面包取出来。太烫的时候还不能吃。' },
      { art: 'library|ming,grandma|bread|·', en: 'We cut the bread and eat it. It is warm and soft and good.', zh: '我们把面包切开来吃。它又暖又软，真好吃。' },
      { art: 'library|ming,grandma|bread|♥', en: 'From wheat to bread takes many steps. Now we know how bread is made.', zh: '从麦子到面包，要经过好多步骤。现在我们知道面包是怎么做的了。' }
    ],
    quiz: [
      { q: '做面包最先要有哪种东西？', opts: ['麦子', '鸡蛋', '牛奶'], a: 0, kind: 'recall' },
      { q: '面团放进烤箱前，为什么是一个软软的球？', opts: ['麦子粉加了水，用手揉成了团', '面包本来就是圆圆的', '把面团做成球是为了好玩'], a: 0, kind: 'infer' },
      { q: '想自己动手做一样吃的，你会先做什么？', opts: ['什么都不想就开始做', '先把材料和步骤想清楚', '让别人猜自己要做什么'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b68', lv: 'L6', tag: '科学', title: 'Why Boats Float', zh: '船为什么浮着',
    emoji: '⛵', color: '#F2E2A8',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。认读 1 个新词（木板）。',
    trap: '词尾不发音的 e 会让前面的元音「报自己的名字」：cap → cape，kit → kite。',
    summary: '《船为什么浮着》：这一本从一件小事讲起，说说为什么会这样。读前先看词卡（木板）；读的时候留意先看到什么、为什么会这样、后来怎么弄明白。',
    retell: '合上书，按「先看到什么 → 为什么会这样 → 后来怎么弄明白」讲一遍。',
    think: '什么东西会浮在水上？什么会沉到水底？说说看。',
    pre: [
      { art: '📋', en: 'board', zh: '木板' },
      { art: '⛵', en: 'boat', zh: '小船' },
      { art: '🌿', en: 'light', zh: '光' }
    ],
    sight: ['air', 'light', 'sea', 'water'],
    newWords: [
      { w: 'board', zh: '木板' }
    ],
    pages: [
      { art: 'beach|lili,grandpa|boat|·', en: 'Boats go on the water every day. They stay up and do not go down.', zh: '船每天在水上走。它们浮在上面，不会沉下去。' },
      { art: 'beach|lili,grandpa|boat|♪', en: 'A stone is small, but it goes down. A board is light, and it stays up.', zh: '石头小小的，可它会沉下去。木板很轻，就浮在上面。' },
      { art: 'beach|lili,grandpa|boat|👀', en: 'Why does a boat stay up on the water? The boat is big, but it does not go down.', zh: '船为什么能浮在水上呢？船那么大，却不会沉下去。' },
      { art: 'beach|lili,grandpa|boat|?', en: 'Inside the boat there is a lot of room. That room is full of air.', zh: '船的里面有很大的空间。里面满满都是空气。' },
      { art: 'beach|lili,grandpa|boat|·', en: 'The air inside is very light. Light air helps the boat stay up.', zh: '里面的空气很轻很轻。轻空气帮着把船托起来。' },
      { art: 'beach|lili,grandpa|boat|!', en: 'The water holds the boat up. It pushes up on the boat all the time.', zh: '水把船托着。它一直在下面向上托船。' },
      { art: 'beach|lili,grandpa|boat|♥', en: 'A stone has no room inside. It is not light, so it goes down.', zh: '石头里面没有空间，也不够轻，所以会沉下去。' },
      { art: 'beach|lili,grandpa|boat|★', en: 'A big ship has much room inside too. That is why the ship stays up on the water.', zh: '大轮船里面也有很多空间。所以大船也能浮在水上。' },
      { art: 'beach|lili,grandpa|boat|…', en: 'Even a very big ship can go on the sea. The air inside keeps it light enough.', zh: '很大的轮船也能在海上开。里面的空气让它够轻。' },
      { art: 'beach|lili,grandpa|boat|·', en: 'Look at a boat on the water next time. Its shape and the room inside keep it up.', zh: '下次看到水上的船，仔细看看它。它的样子和里面的空间，让它浮着。' },
      { art: 'beach|lili,grandpa|boat|♥', en: 'Now we know why boats stay up. It is the room full of light air.', zh: '现在我们知道船为什么浮着了。答案就是里面轻飘飘的空气。' }
    ],
    quiz: [
      { q: '船的里面有很多什么？', opts: ['沙子', '空气', '石头'], a: 1, kind: 'recall' },
      { q: '如果水灌进了船里，你猜会怎么样？', opts: ['船会往下沉', '船会变得更高', '船会飞起来'], a: 0, kind: 'infer' },
      { q: '自己做一艘小船模型，你会注意什么？', opts: ['做得越重越好', '把里面塞满石头', '让里面空着，能装下空气'], a: 2, kind: 'transfer' }
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
      { art: 'table|grandma,mom|cap|·', en: 'This is "cap". It is a short word.', zh: '这是 cap。它是一个短词。' },
      { art: 'table|grandma,mom|cap|♪', en: 'This is "cape". It is a longer word.', zh: '这是 cape。它是一个长一点的词。' },
      { art: 'table|grandma,mom|cap|👀', en: 'Cap and cape. The two words look almost the same.', zh: 'cap 和 cape。两个词看着差不多。' },
      { art: 'table|grandma,mom|cap|?', en: 'The "e" makes the "a" say its name. Listen to both words.', zh: '那个 e 让 a 读出自己的名字。听听这两个词。' },
      { art: 'table|grandma,mom|cap|·', en: 'Say "cap". Say it slowly, and keep the "a" short.', zh: '说 cap。慢慢说，a 要短。' },
      { art: 'table|grandma,mom|cap|!', en: 'Say "cape". Say it again, and let the "a" say its name.', zh: '说「cape」。再说一遍，让 a 读出它自己的名字。' },
      { art: 'table|grandma,mom|cap|♥', en: '"Cap" is not "cape". One is short and one is long.', zh: 'cap 不是 cape。一个短，一个长。' },
      { art: 'table|grandma,mom|cap|★', en: 'The "e" changes the sound. One little "e" does it.', zh: '那个 e 改变了读音。就一个小 e 就够了。' },
      { art: 'table|grandma,mom|cap|…', en: 'You can say both. Say cap, then cape, then cap.', zh: '两个你都能说。说 cap，再说 cape，再说 cap。' },
      { art: 'table|grandma,mom|cap|·', en: 'Cap, cape! Now you can hear the difference.', zh: 'cap，cape！现在你听得出不同了。' },
      { art: 'table|grandma,mom|cap|♥', en: 'Good! Find one more word with a quiet "e".', zh: '很好！再找一个结尾有不发音 e 的词。' }
    ],
    quiz: [
      { q: '结尾那个「e」做了什么？', opts: ['让词变短了', '让 a 读出自己的名字，读音变了', '什么也没做'], a: 1, kind: 'recall' },
      { q: '结尾加了一个 e，cap 变成了什么？', opts: ['cape，中间的 a 读本音', 'cap 的意思变了', '读音一点没变'], a: 0, kind: 'infer' },
      { q: '两个词只差一个 e，你会怎么分清？', opts: ['看清楚有没有 e，读准音', '随便读一个', '不读了'], a: 0, kind: 'transfer' }
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
      { art: '📦', en: 'oven', zh: '烤箱' }
    ],
    sight: ['bigger', 'brown', 'high', 'piece', 'warm', 'watches'],
    newWords: [
      { w: 'rise', zh: '升起' },
      { w: 'heat', zh: '热' }
    ],
    pages: [
      { art: 'kitchen|grandpa,dad|cake|·', en: 'Ming makes a cake. He puts it in a pan.', zh: '明明做蛋糕。他把它放进平底锅。' },
      { art: 'kitchen|grandpa,dad|cake|♪', en: 'The cake goes in the oven. It is hot in there.', zh: '蛋糕进了烤箱。里面很热。' },
      { art: 'kitchen|grandpa,dad|cake|👀', en: 'Why does a cake rise? Ming wants to know.', zh: '蛋糕为什么会鼓起来？明明想知道。' },
      { art: 'kitchen|grandpa,dad|cake|?', en: 'The cake has little holes inside. The heat makes them big, and they push it up.', zh: '蛋糕里面本来有小孔。热气把它们撑大，把蛋糕顶起来。' },
      { art: 'kitchen|grandpa,dad|cake|·', en: 'The cake gets bigger. Ming stays and watches it.', zh: '蛋糕鼓起来了。明明守在旁边看。' },
      { art: 'kitchen|grandpa,dad|cake|!', en: 'The cake is high now. It is soft and brown on top.', zh: '蛋糕现在很高了。它很软，上面是褐色的。' },
      { art: 'kitchen|grandpa,dad|cake|♥', en: 'Ming looks at the cake. He is glad, and he tells Grandma.', zh: '明明看着蛋糕。他很高兴，叫来了奶奶。' },
      { art: 'kitchen|grandpa,dad|cake|★', en: 'The cake is good. It smells sweet and it is warm.', zh: '蛋糕烤得正好。它闻着甜，还热着。' },
      { art: 'kitchen|grandpa,dad|cake|…', en: 'A cake rises in the heat. That is why we use the oven.', zh: '蛋糕遇热就鼓起来。所以我们才用烤箱。' },
      { art: 'kitchen|grandpa,dad|cake|·', en: 'Why a cake rises. Now Ming can tell Grandma.', zh: '蛋糕为什么会鼓。现在明明能讲给奶奶听了。' },
      { art: 'kitchen|grandpa,dad|cake|♥', en: 'Ming likes the cake. He cuts a piece for Grandma.', zh: '明明喜欢这个蛋糕。他给奶奶切了一块。' }
    ],
    quiz: [
      { q: '蛋糕为什么会鼓起来？', opts: ['受热以后，里面的小孔变大，把它顶起来', '里面的热气变大，把它顶起来', '面粉自己长高了'], a: 0, kind: 'recall' },
      { q: '蛋糕放进热的地方，会怎么样？', opts: ['变小变硬', '鼓起来，又高又软', '没有一点变化'], a: 1, kind: 'infer' },
      { q: '想知道一件事为什么发生，你会怎么做？', opts: ['不管它', '瞎猜', '想一想、查一查、试一试'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b71', lv: 'L6', tag: '小知识', title: 'A Hole in the Sock', zh: '袜子上的洞',
    emoji: '🧦', color: '#C8E7F0',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。不引入新词，全部是读过的词。',
    trap: '词尾不发音的 e 会让前面的元音「报自己的名字」：cap → cape，kit → kite。',
    summary: '《袜子上的洞》：这一本从一件小事讲起，说说为什么会这样。读前先看词卡，都是学过的词；读的时候留意先看到什么、为什么会这样、后来怎么弄明白。',
    retell: '合上书，按「先看到什么 → 为什么会这样 → 后来怎么弄明白」讲一遍。',
    think: '说说你修过或看过别人修的一样东西。',
    pre: [
      { art: '🧦', en: 'sock', zh: '袜子' },
      { art: '🕳️', en: 'hole', zh: '洞' }
    ],
    sight: ['care', 'light', 'warm', 'wear'],
    newWords: [

    ],
    pages: [
      { art: 'home|mom,ming|hole|·', en: 'A sock is here. It is soft and warm.', zh: '这里有一只袜子。它又软又暖。' },
      { art: 'home|mom,ming|hole|♪', en: 'Ming puts the sock on. He pulls it up.', zh: '明明穿上袜子。他往上拉。' },
      { art: 'home|mom,ming|hole|👀', en: 'There is a hole in the sock. Ming finds it when he pulls.', zh: '袜子上有一个洞。明明一拉就发现了。' },
      { art: 'home|mom,ming|hole|?', en: 'The hole is small. But it gets big.', zh: '洞很小。可它越拉越大。' },
      { art: 'home|mom,ming|hole|·', en: 'Ming looks at the hole. He holds it up to the light.', zh: '明明看着这个洞。他把它举到光下。' },
      { art: 'home|mom,ming|hole|!', en: 'The sock is not good now. The hole is too big.', zh: '袜子现在不能穿了。洞太大了。' },
      { art: 'home|mom,ming|hole|♥', en: 'Ming fixes the hole. He mends it with care.', zh: '明明把洞补好。他补得很小心。' },
      { art: 'home|mom,ming|hole|★', en: 'The sock is good again. It holds together now.', zh: '袜子又好了。现在很结实。' },
      { art: 'home|mom,ming|hole|…', en: 'One small hole. The sock was no good.', zh: '一个小小的洞。整只袜子就不能穿了。' },
      { art: 'home|mom,ming|hole|·', en: 'Ming is careful with his socks. He looks at them first.', zh: '明明对自己的袜子很小心。穿之前先看一看。' },
      { art: 'home|mom,ming|hole|♥', en: 'Ming puts the sock away. Now he can wear it again.', zh: '明明把袜子收好。现在又能穿了。' }
    ],
    quiz: [
      { q: '袜子上的洞带来什么麻烦？', opts: ['洞越拉越大，袜子不能穿了', '袜子变脏了', '袜子找不到了'], a: 0, kind: 'recall' },
      { q: '袜子怎么了？', opts: ['被水弄湿了', '找不到了', '上面有个洞，不能穿了'], a: 2, kind: 'infer' },
      { q: '东西坏了，你会怎么做？', opts: ['看看能不能修好，修不好再想别的办法', '直接扔掉', '不管它'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b72', lv: 'L6', tag: '复习', title: 'The Same Plate', zh: '同一个盘子',
    emoji: '🍽️', color: '#E8D9B5',
    track: 'review',
    goal: '把本级和前面级别的词再读一遍、串成一个故事。认读 1 个新词（盘子）。',
    trap: '词尾不发音的 e 会让前面的元音「报自己的名字」：cap → cape，kit → kite。',
    summary: '《同一个盘子》：这是一个完整的小故事。读前先看词卡（盘子）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，讲讲这件事是怎么一步步发展的，中间卡在哪儿。',
    think: '说说两样很像、但有大小差别的东西。',
    pre: [
      { art: '🍽️', en: 'plate', zh: '盘子' },
      { art: '📦', en: 'food', zh: '食物' },
      { art: '🍚', en: 'rice', zh: '米饭' }
    ],
    sight: ['clean'],
    newWords: [
      { w: 'plate', zh: '盘子' }
    ],
    pages: [
      { art: 'library|dad,lili|plate|·', en: 'Two plates are on the table. They are both clean.', zh: '桌上有两个盘子。它们都干净。' },
      { art: 'library|dad,lili|plate|♪', en: 'One plate is big. It is for Ming.', zh: '一个盘子很大。是给明明的。' },
      { art: 'library|dad,lili|plate|👀', en: 'One plate is small. It is for Grandma.', zh: '一个盘子很小。是给奶奶的。' },
      { art: 'library|dad,lili|plate|?', en: 'They are not the same. One holds more food than the other.', zh: '它们不一样。一个装得多，一个装得少。' },
      { art: 'library|dad,lili|plate|·', en: 'But they are both plates. Both can hold food.', zh: '可它们都是盘子。两个都能盛东西。' },
      { art: 'library|dad,lili|plate|!', en: 'Ming looks at the two plates. He puts them together.', zh: '明明看着这两个盘子。他把它们放在一起。' },
      { art: 'library|dad,lili|plate|♥', en: 'One big, one small. They look like a family.', zh: '一个大，一个小。它们像一家人。' },
      { art: 'library|dad,lili|plate|★', en: 'Ming uses the big plate. He puts rice on it.', zh: '明明用大盘子。他在里面盛了饭。' },
      { art: 'library|dad,lili|plate|…', en: 'Grandma uses the small one. She puts a cake on it.', zh: '奶奶用小盘子。她在里面放了一块蛋糕。' },
      { art: 'library|dad,lili|plate|·', en: 'Not the same plate. Two plates, big and small.', zh: '不是同一个盘子。两个盘子，一大一小。' },
      { art: 'library|dad,lili|plate|♥', en: 'Both are plates. Both hold good food.', zh: '两个都是盘子。都能盛好吃的。' }
    ],
    quiz: [
      { q: '两个盘子哪里不一样？', opts: ['颜色不一样', '大小不一样', '一个是碗'], a: 1, kind: 'recall' },
      { q: '一个大盘子一个小盘子，为什么都能用？', opts: ['因为它们一样大', '因为一个能装一个不能', '都是盘子，都能盛东西'], a: 2, kind: 'infer' },
      { q: '两样东西很像但有差别，你会怎么做？', opts: ['只看一个', '不管它', '看一看哪里不一样，再说一说'], a: 2, kind: 'transfer' }
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
      { art: 'home|ming,grandma|letter|…', en: 'Ming says he is happy. He asks her to come home soon.', zh: '明明说自己过得很好。他请她早点回家。' },
      { art: 'home|ming,grandma|letter|·', en: 'A letter from the farm. It came a long way.', zh: '农场来的信。它走了很远的路。' },
      { art: 'home|ming,grandma|letter|♥', en: 'Ming will keep this letter. He puts it in a safe place.', zh: '这封信明明要收好。他把它放在稳妥的地方。' },
      { art: 'home|ming,grandma|letter|·', en: 'Ming wants to go to the farm. He will go in summer when school is out.', zh: '明明想去农场。放暑假的时候他要去。' }
    ],
    quiz: [
      { q: '信上说农场的什么「现在很大了」？', opts: ['玉米', '房子', '山羊'], a: 2, kind: 'recall' },
      { q: '明明读完信就笑了，说明什么？', opts: ['信上写错了字', '他喜欢奶奶的信，心里高兴', '他不认识奶奶'], a: 1, kind: 'infer' },
      { q: '想给远方的人说句话，你会怎么做？', opts: ['写一封信或一句话给他', '什么也不说', '只在心里想'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b74', lv: 'L7', tag: '故事', title: 'The Turtle and the Shark', zh: '乌龟和鲨鱼',
    emoji: '🐢', color: '#F9DFB4',
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
      { art: 'beach|lili,grandpa|turtle|·', en: 'A turtle is in the sea. The sea is deep, and the water is blue.', zh: '一只乌龟在海里。海很深，水蓝蓝的。' },
      { art: 'beach|lili,grandpa|turtle|♪', en: 'The turtle swims slowly. It looks for food, and it eats small things.', zh: '乌龟慢慢游。它找吃的，吃些小东西。' },
      { art: 'beach|lili,grandpa|turtle|👀', en: 'A shark is in the sea too. It comes from the deep when it is hungry.', zh: '海里还有一条鲨鱼。它饿的时候从深处游上来。' },
      { art: 'beach|lili,grandpa|turtle|?', en: 'The shark swims fast. It comes up from below.', zh: '鲨鱼游得很快。它从下面游上来。' },
      { art: 'beach|lili,grandpa|turtle|·', en: 'The shark is big. It is bigger than the turtle, and it swims fast.', zh: '鲨鱼很大。它比乌龟大，游得也快。' },
      { art: 'beach|lili,grandpa|turtle|!', en: 'The turtle is not fast. It cannot swim away, so it goes down.', zh: '乌龟不快。它游不掉，于是往下沉。' },
      { art: 'beach|lili,grandpa|turtle|♥', en: 'But the turtle is not afraid. It has a hard shell that keeps it safe.', zh: '可乌龟不怕。它有一个硬壳，能保护它。' },
      { art: 'beach|lili,grandpa|turtle|★', en: 'It hides in the rocks below.', zh: '它躲到下面的岩石里。' },
      { art: 'beach|lili,grandpa|turtle|…', en: 'The shark swims away. It cannot find the turtle, so it looks in another place.', zh: '鲨鱼游走了。它找不到乌龟，就去别处找。' },
      { art: 'beach|lili,grandpa|turtle|·', en: 'The turtle is safe. It comes up slowly.', zh: '乌龟安全了。它慢慢浮上来。' },
      { art: 'beach|lili,grandpa|turtle|♥', en: 'The turtle and the shark. One is slow, and one is fast.', zh: '乌龟和鲨鱼。一个慢，一个快。' },
      { art: 'beach|lili,grandpa|turtle|·', en: 'Slow can be good. Slow can be safe too when a big fish is near.', zh: '慢也有好处。危险靠近的时候，慢也能保命。' }
    ],
    quiz: [
      { q: '乌龟靠什么保护自己？', opts: ['游得快', '躲进沙子里', '硬硬的壳'], a: 2, kind: 'recall' },
      { q: '海龟是怎么躲开鲨鱼的？', opts: ['沉下去躲起来', '游得更快', '咬鲨鱼'], a: 0, kind: 'infer' },
      { q: '遇到比你强、有危险的，你会怎么做？', opts: ['站在原地哭', '冷静，想办法躲开或求助', '硬拼'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b75', lv: 'L7', tag: '买菜', title: 'The Market at the Corner', zh: '街角的市场',
    emoji: '🥬', color: '#CDE7C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 2 个新词（市场、紫色）。',
    trap: '美音里元音后的 r 一定要卷舌读出来：car、bird、water 都不能吞掉 r。',
    summary: '《街角的市场》：这是一个完整的小故事。读前先看词卡（市场、紫色）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，按做事情的顺序讲一遍，至少用上三个本本词卡。',
    think: '说说你去过的一个市场。',
    pre: [
      { art: '🥬', en: 'market', zh: '市场' },
      { art: '🟣', en: 'purple', zh: '紫色' },
      { art: '📦', en: 'basket', zh: '篮子' },
      { art: '🏠', en: 'home', zh: '家' }
    ],
    sight: ['bright', 'near'],
    newWords: [
      { w: 'market', zh: '市场' },
      { w: 'purple', zh: '紫色' }
    ],
    pages: [
      { art: 'street|grandma,mom|market|·', en: 'A market is at the corner. It is near Ming\'s home, so he goes there often.', zh: '街角有个市场。它离明明家近，所以他常去。' },
      { art: 'street|grandma,mom|market|♪', en: 'The market has many things. There are apples and eggs, and there is rice too.', zh: '市场里东西很多。有苹果有鸡蛋，还有米。' },
      { art: 'street|grandma,mom|market|👀', en: 'Ming and Mom go to the market. They take a basket because they will buy a lot.', zh: '明明和妈妈去市场。他们带了个篮子，因为要买不少。' },
      { art: 'street|grandma,mom|market|?', en: 'They see apples and rice. Ming looks at the grapes because they are purple.', zh: '他们看见苹果和米。明明看葡萄，因为葡萄是紫的。' },
      { art: 'street|grandma,mom|market|·', en: '"Hold the basket," Mom says. She puts the rice in, and it gets full.', zh: '「扶好篮子。」妈妈说。她把米放进去，篮子满了。' },
      { art: 'street|grandma,mom|market|!', en: 'Ming buys an apple. It is red and bright.', zh: '明明买了一个苹果。又红又亮。' },
      { art: 'street|grandma,mom|market|♥', en: 'The market is big. There are many people, and it is warm inside.', zh: '市场很大。人很多，里面暖暖的。' },
      { art: 'street|grandma,mom|market|★', en: 'They carry the things home. Ming helps Mom carry them because there is a lot.', zh: '他们把东西提回家。明明帮妈妈一起提，因为东西不少。' },
      { art: 'street|grandma,mom|market|…', en: 'The market at the corner. It is always full.', zh: '街角的市场。里面总是满满当当。' },
      { art: 'street|grandma,mom|market|·', en: 'Ming likes the market. He likes to look around when they go.', zh: '明明喜欢这个市场。他们去的时候，他喜欢到处看。' },
      { art: 'street|grandma,mom|market|♥', en: 'The basket is full. Ming holds one side.', zh: '篮子装得满满的。明明扶着一边。' },
      { art: 'street|grandma,mom|market|·', en: '"See you next week," Mom says. They walk home with the full basket.', zh: '「下周见。」妈妈说。他们提着满满的篮子回家。' }
    ],
    quiz: [
      { q: '妈妈在街角的市场买了什么？', opts: ['葡萄', '苹果', '米'], a: 2, kind: 'recall' },
      { q: '他们带篮子去市场，是因为什么？', opts: ['市场不给袋子', '篮子好看', '要买的东西不少，得有个东西装'], a: 2, kind: 'infer' },
      { q: '去市场买东西，你会怎么做？', opts: ['乱拿一通', '想好买什么，一样一样看', '不看就走'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b76', lv: 'L7', tag: '寻找', title: 'Search the Park', zh: '找遍公园',
    emoji: '🔍', color: '#C6DEF6',
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
      { art: 'library|grandpa,dad|park|·', en: 'Ming is in the park. He played with his ball by the tree this morning.', zh: '明明在公园里。今天早上他在树边玩过球。' },
      { art: 'library|grandpa,dad|park|♪', en: 'Now he looks for the ball. He put it here before he went home.', zh: '现在他来找球。回家前他把它放在这儿。' },
      { art: 'library|grandpa,dad|park|👀', en: 'The ball is not here. He looks at the grass.', zh: '球不在这儿。他看看草地。' },
      { art: 'library|grandpa,dad|park|?', en: 'Ming looks all over the park. He walks a long way, but he cannot find it.', zh: '明明找遍公园。他走了很远，可还是没找到。' },
      { art: 'library|grandpa,dad|park|·', en: 'Ming looks under a tree. Only a bug is there, so he looks in another place.', zh: '明明在树下看。那儿只有一只虫子，于是他换个地方找。' },
      { art: 'library|grandpa,dad|park|!', en: 'Ming looks by a stone. He finds an old leaf.', zh: '明明在石头边找。他找到一片枯叶。' },
      { art: 'library|grandpa,dad|park|♥', en: 'Ming does not find the ball. He sits down to think because he is tired.', zh: '明明没找到球。他坐下来想，因为他累了。' },
      { art: 'library|grandpa,dad|park|★', en: '"Did you see my ball?" Ming asks a man at the gate.', zh: '「您看见我的球了吗？」明明问门口的叔叔。' },
      { art: 'library|grandpa,dad|park|…', en: 'The man at the gate saw it. It went that way when the wind pushed it.', zh: '门口的叔叔看见了。风一吹，球就往那边去了。' },
      { art: 'library|grandpa,dad|park|·', en: 'The ball is by the gate! Ming runs to get it, and he laughs.', zh: '球就在门边！明明跑过去拿，笑了。' },
      { art: 'library|grandpa,dad|park|♥', en: 'Search the park. It was there all the time.', zh: '找遍公园。球一直都在那儿。' },
      { art: 'library|grandpa,dad|park|·', en: 'Ming is glad to find the ball. He takes it home.', zh: '找到球，明明很高兴。他把球带回家。' }
    ],
    quiz: [
      { q: '球最后在哪儿找到的？', opts: ['大树下', '草丛里', '大门边'], a: 2, kind: 'recall' },
      { q: '明明找了很久都没找到，后来是怎么找到的？', opts: ['自己忽然看见了', '风把它吹过来了', '问了门口的一位叔叔'], a: 2, kind: 'infer' },
      { q: '找东西找遍了还没找到，你会怎么做？', opts: ['问一问别人，或换个地方想', '一直乱找', '不要了'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b77', lv: 'L7', tag: '想象', title: 'A Door in the Tree', zh: '树里的门',
    emoji: '🚪', color: '#E0CFF3',
    track: 'fantasy',
    goal: '跟着一个想象出来的故事，把来龙去脉读顺。不引入新词，全部是读过的词。',
    trap: '美音里元音后的 r 一定要卷舌读出来：car、bird、water 都不能吞掉 r。',
    summary: '《树里的门》：这是一个完整的小故事。读前先看词卡，都是学过的词；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，按做事情的顺序讲一遍，至少用上三个本本词卡。',
    think: '如果你能走进树里的那扇小门，你最想做什么？',
    pre: [
      { art: '🌳', en: 'tree', zh: '树' },
      { art: '🍎', en: 'apple', zh: '苹果' }
    ],
    sight: ['flower', 'friends', 'house'],
    newWords: [

    ],
    pages: [
      { art: 'garden|mom,ming|tree|·', en: 'Ming walks in the park after school. He sees a big tree with a small door.', zh: '明明放学后在公园散步。他看见一棵大树，树上有一扇小门。' },
      { art: 'garden|mom,ming|tree|♪', en: 'It is a very little door. Ming looks at it for a long time.', zh: '这扇门很小很小。明明看了它好一会儿。' },
      { art: 'garden|mom,ming|tree|👀', en: 'Ming opens the little door and looks inside. There is a small house in the tree.', zh: '明明推开小门往里看。树里面有一座小房子。' },
      { art: 'garden|mom,ming|tree|?', en: 'A little family is in the little house. There is a dad, a mom, and a baby.', zh: '小房子里住着小小的一家。有爸爸、妈妈，还有一个小宝宝。' },
      { art: 'garden|mom,ming|tree|·', en: 'When Ming looks in, the family sees him. They smile and say hello to Ming.', zh: '明明往里看的时候，这一家也看见了他。他们朝明明笑，跟他打招呼。' },
      { art: 'garden|mom,ming|tree|!', en: 'The house has little beds and little cups. Everything in the house is very small.', zh: '房子里有小小的床、小小的杯子。里面的东西全都很小。' },
      { art: 'garden|mom,ming|tree|♥', en: 'Ming brings an apple for the little family. The apple is big for them, but they are happy.', zh: '明明给这一家带来一个苹果。苹果对他们来说很大，可他们很开心。' },
      { art: 'garden|mom,ming|tree|★', en: 'The little dad is happy because Ming is kind. He asks Ming to sit by the tree.', zh: '小小的爸爸很开心，因为明明很友善。他请明明坐在树边。' },
      { art: 'garden|mom,ming|tree|…', en: 'Ming sits with the little family outside. They give him a little flower from the tree.', zh: '明明和小小的一家坐在外面。他们送给他一朵树上的小花。' },
      { art: 'garden|mom,ming|tree|·', en: 'The sun goes down, and the sky is dark. The little family goes back into their house.', zh: '太阳落山了，天黑了下来。小小的一家回到自己的小房子里。' },
      { art: 'garden|mom,ming|tree|♥', en: 'The little door closes for the night. Ming puts his hand on the tree.', zh: '小小的门在夜里关上了。明明把手放在树干上。' },
      { art: 'garden|mom,ming|tree|·', en: 'Ming will come back when the door is open. He wants to see his little friends again.', zh: '等门再开的时候，明明还会回来。他想再见到他的小朋友。' }
    ],
    quiz: [
      { q: '明明给小小的一家带了什么？', opts: ['一块蛋糕', '一个球', '一个苹果'], a: 2, kind: 'recall' },
      { q: '小房子里的床和杯子为什么那么小？', opts: ['因为住在里面的一家个子很小', '因为那些都是小玩具', '因为东西被树压小了'], a: 0, kind: 'infer' },
      { q: '发现了没见过的小地方，你会怎么做？', opts: ['轻轻看一看，不打扰里面', '大声喊别人来看', '动手把它拆开'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b78', lv: 'L7', tag: '韵文', title: 'The Wind and the Tree', zh: '风和树',
    emoji: '🌳', color: '#F6C9E3',
    track: 'rhyme',
    goal: '读一首小韵文，听清每一句句末的韵脚。不引入新词，全部是读过的词。',
    trap: '美音里元音后的 r 一定要卷舌读出来：car、bird、water 都不能吞掉 r。',
    summary: '《风和树》：这是一个完整的小故事。读前先看词卡，都是学过的词；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，按做事情的顺序讲一遍，至少用上三个本本词卡。',
    think: '诗里的风会睡觉、很温柔。你觉得风还像什么？',
    pre: [
      { art: '🌿', en: 'wind', zh: '风' },
      { art: '🌳', en: 'tree', zh: '树' }
    ],
    sight: ['blue', 'high', 'leaves', 'light', 'quiet', 'yellow'],
    newWords: [

    ],
    pages: [
      { art: 'library|dad,lili|wind|·', en: 'The wind is high in the tall green tree. It pushes the leaves for you and me to see.', zh: '风高高地吹过绿绿的大树。它把叶子吹起来，给你和我看。' },
      { art: 'library|dad,lili|wind|♪', en: 'It is fun to run in the wind. The wind is good to us because it is kind.', zh: '在风里跑一跑，真好玩。风对我们很好，因为它很温柔。' },
      { art: 'library|dad,lili|wind|👀', en: 'We all like a fine warm day. When the sun is out, we run and play.', zh: '我们都喜欢这样的好日子。太阳一出来，我们就跑出去玩。' },
      { art: 'library|dad,lili|wind|?', en: 'The wind is not strong under the warm sun. Ming and Grandpa like to run.', zh: '太阳暖暖的，风就不那么大了。明明和爷爷喜欢去跑步。' },
      { art: 'library|dad,lili|wind|·', en: 'Look at the birds that fly up so high. They fly in the wide blue sky.', zh: '看那些小鸟，飞得多高呀。它们飞过又宽又蓝的天空。' },
      { art: 'library|dad,lili|wind|!', en: 'The green and yellow leaves fall. But the tree is still very tall.', zh: '绿的、黄的叶子落下来。可是树还是那么高。' },
      { art: 'library|dad,lili|wind|♥', en: 'The wind goes to sleep at night. Then the moon gives us its light.', zh: '风到了夜里就去睡觉。月亮把它的光给了我们。' },
      { art: 'library|dad,lili|wind|★', en: 'When the night is quiet, we see the moon. Then the wind will come back again soon.', zh: '夜里静下来的时候，我们看见月亮。风很快又会回来。' },
      { art: 'library|dad,lili|wind|…', en: 'The wind says hello to a little bee. The bee goes home to the tall tree.', zh: '风跟小蜜蜂打了个招呼。蜜蜂飞回高高的大树，那儿是它的家。' },
      { art: 'library|dad,lili|wind|·', en: 'The wind and the leaves like to play. They play together on a fine summer day.', zh: '风和叶子喜欢一起玩。整个夏天，它们都在一起玩。' },
      { art: 'library|dad,lili|wind|♥', en: 'The wind is playing with the tree. Ming and Grandpa stop to see.', zh: '风和树一起玩。明明和爷爷停下来看。' },
      { art: 'library|dad,lili|wind|·', en: 'The wind is good to us and kind. We like the tree and we like the wind.', zh: '风很好，也很温柔。我们喜欢树，也喜欢风。' }
    ],
    quiz: [
      { q: '风把树上的什么吹了起来？', opts: ['果子', '叶子', '小鸟'], a: 1, kind: 'recall' },
      { q: '要是夜里没有月亮，还能看清那棵大树吗？', opts: ['很难看清，因为没有了月光', '能看清，因为夜里更亮', '能看清，因为风会发光'], a: 0, kind: 'infer' },
      { q: '大风天在外面，你会怎么做？', opts: ['爬到高高的树上去', '迎着风使劲跑', '站稳扶好，找安全的地方躲一躲'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b79', lv: 'L7', tag: '动物', title: 'Bees and Flowers', zh: '蜜蜂和花',
    emoji: '🐝', color: '#BFE6DF',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。不引入新词，全部是读过的词。',
    trap: '美音里元音后的 r 一定要卷舌读出来：car、bird、water 都不能吞掉 r。',
    summary: '《蜜蜂和花》：这一本从一件小事讲起，说说为什么会这样。读前先看词卡，都是学过的词；读的时候留意先看到什么、为什么会这样、后来怎么弄明白。',
    retell: '合上书，按「先看到什么 → 为什么会这样 → 后来怎么弄明白」讲一遍。',
    think: '蜜蜂和花互相帮忙。你还知道谁和谁在互相帮忙吗？',
    pre: [
      { art: '🌻', en: 'flower', zh: '花' },
      { art: '🐝', en: 'bee', zh: '蜜蜂' }
    ],
    sight: ['blue', 'bright', 'flower', 'flowers', 'friends', 'ground', 'head', 'knows'],
    newWords: [

    ],
    pages: [
      { art: 'library|ming,grandma|bee|·', en: 'On a warm summer day, bees fly out. They fly from flower to flower in the sun.', zh: '暖和的夏天，蜜蜂飞出来了。太阳底下，它们从一朵花飞到另一朵花。' },
      { art: 'library|ming,grandma|bee|♪', en: 'A bee looks for sweet food in a flower. The sweet food is deep inside the flower.', zh: '蜜蜂在花里找甜甜的花蜜。花蜜藏在花的深处。' },
      { art: 'library|ming,grandma|bee|👀', en: 'When the bee goes in, yellow bits get on it. The bits are on its head and legs.', zh: '蜜蜂飞进花里的时候，黄色的花粉就沾在它身上。花粉沾在它的头上、腿上。' },
      { art: 'library|ming,grandma|bee|?', en: 'Then the bee goes to the next flower. The yellow bits fall off on the new flower.', zh: '然后蜜蜂飞到下一朵花上。黄色的花粉就掉在新的花上。' },
      { art: 'library|ming,grandma|bee|·', en: 'This helps the flower because it can make seeds. With the yellow bits, the flower makes seeds for next year.', zh: '这样对花有好处，因为它能结出种子了。有了花粉，花就能结出种子。' },
      { art: 'library|ming,grandma|bee|!', en: 'The seeds fall down to the ground. Then new flowers grow in the warm sun.', zh: '种子落进土里。暖暖的太阳一照，新的花就长出来了。' },
      { art: 'library|ming,grandma|bee|♥', en: 'Bees and flowers help each other every day. The bee gets food, and the flower gets help.', zh: '蜜蜂和花天天互相帮忙。蜜蜂得到食物，花得到帮助。' },
      { art: 'library|ming,grandma|bee|★', en: 'Many bees are together in one home. There is one mom bee and many worker bees.', zh: '蜜蜂住在一起，一个家里有很多蜜蜂。有一只蜂妈妈，还有很多工蜂。' },
      { art: 'library|ming,grandma|bee|…', en: 'Worker bees are the bees who fly out and get food. They work all day and come home at night.', zh: '工蜂就是飞出去找食物的蜜蜂。它们忙上一整天，晚上才回家。' },
      { art: 'library|ming,grandma|bee|·', en: 'Bees can see yellow and blue very well. Bright flowers are easy for them to find.', zh: '蜜蜂能看清黄色和蓝色。亮亮的花，它们一眼就能找到。' },
      { art: 'library|ming,grandma|bee|♥', en: 'Ming knows that bees help flowers make seeds. He is happy to see a little bee.', zh: '明明知道，蜜蜂帮花结出种子。看到小蜜蜂，他很开心。' },
      { art: 'library|ming,grandma|bee|·', en: 'Bees and flowers are good friends in the sun. They help each other, day after day.', zh: '蜜蜂和花是好朋友。一天又一天，它们互相帮忙。' }
    ],
    quiz: [
      { q: '蜜蜂在花里找什么？', opts: ['绿绿的叶子', '甜甜的花蜜', '干净的水'], a: 1, kind: 'recall' },
      { q: '要是蜜蜂再也不去花那儿，花会怎么样？', opts: ['当天就会全部枯死', '不容易结出种子', '反而长得更高'], a: 1, kind: 'infer' },
      { q: '在公园里看到蜜蜂正在采花，你会怎么做？', opts: ['挥手把它赶走', '轻轻看，不打扰它', '伸手去抓它'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b80', lv: 'L7', tag: '身体', title: 'How We Grow', zh: '我们怎么长大',
    emoji: '📏', color: '#F2E2A8',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。不引入新词，全部是读过的词。',
    trap: '美音里元音后的 r 一定要卷舌读出来：car、bird、water 都不能吞掉 r。',
    summary: '《我们怎么长大》：这一本从一件小事讲起，说说为什么会这样。读前先看词卡，都是学过的词；读的时候留意先看到什么、为什么会这样、后来怎么弄明白。',
    retell: '合上书，按「先看到什么 → 为什么会这样 → 后来怎么弄明白」讲一遍。',
    think: '说说你是怎么知道自己长高了的。',
    pre: [
      { art: '📦', en: 'food', zh: '食物' },
      { art: '🍚', en: 'rice', zh: '米饭' }
    ],
    sight: ['eat', 'eats', 'friends', 'grows', 'leaves', 'playground', 'year'],
    newWords: [

    ],
    pages: [
      { art: 'library|lili,grandpa|grow|·', en: 'Ming grows a little more every year. His mom says he is tall now.', zh: '明明一年比一年长得高。妈妈说，他现在挺高了。' },
      { art: 'library|lili,grandpa|grow|♪', en: 'When we eat good food, we grow tall and strong. Food gives us what we need to grow.', zh: '吃好东西，我们就会长高长壮。食物给我们长身体需要的养分。' },
      { art: 'library|lili,grandpa|grow|👀', en: 'Rice, eggs, and milk are good food. Apples and green leaves are good food too.', zh: '米饭、鸡蛋、牛奶，都是好食物。苹果和绿叶菜也是好食物。' },
      { art: 'library|lili,grandpa|grow|?', en: 'We must eat every day, but not too much. We eat rice in the morning and at night.', zh: '每天都要吃饭，可不能吃太多。我们早上、晚上都吃饭。' },
      { art: 'library|lili,grandpa|grow|·', en: 'Water and milk are good to drink. We need water when we run and play.', zh: '水和牛奶，喝了都好。跑跑跳跳的时候，我们需要喝水。' },
      { art: 'library|lili,grandpa|grow|!', en: 'Sleep helps us grow, just like good food. We must sleep well at night.', zh: '睡觉也能帮我们长大，就像好好吃饭一样。晚上要睡个好觉。' },
      { art: 'library|lili,grandpa|grow|♥', en: 'We need a lot of sleep because we grow fast. Ming sleeps for a long time every night.', zh: '我们要睡得多，因为长得快。明明每天晚上都睡很久。' },
      { art: 'library|lili,grandpa|grow|★', en: 'In the morning, Ming wakes up and eats. Then he runs and jumps with his friends.', zh: '早上，明明醒来，先吃饭。然后他和小伙伴跑跑跳跳。' },
      { art: 'library|lili,grandpa|grow|…', en: 'We run and jump to grow big and strong. Ming plays in the playground after school.', zh: '跑一跑、跳一跳，我们会长得又高又壮。明明放学后在操场上玩。' },
      { art: 'library|lili,grandpa|grow|·', en: 'Ming can see that he grows fast. The line on the wall goes up and up.', zh: '明明看得出来，自己长得很快。墙上量身高的那条线，也一点点往上去了。' },
      { art: 'library|lili,grandpa|grow|♥', en: 'Good food, good sleep, and play help us grow. This is the way we grow.', zh: '吃得好、睡得好、多玩多动，我们就会长大。我们就是这样长大的。' },
      { art: 'library|lili,grandpa|grow|·', en: 'Ming will grow more and more. He wants to be tall and strong one day.', zh: '明明还会长得更高。他想有一天又高又壮。' }
    ],
    quiz: [
      { q: '明明早上醒来以后做了什么？', opts: ['接着又睡觉', '吃饭，然后跑跑跳跳', '什么都不吃'], a: 1, kind: 'recall' },
      { q: '墙上量身高的线为什么一点点往上走？', opts: ['明明长高了，个子越来越高', '线被别人画高了', '墙变矮了'], a: 0, kind: 'infer' },
      { q: '想长得又高又壮，你会怎么做？', opts: ['好好吃饭、早睡早起、多运动', '天天很晚才睡', '只吃零食不吃饭'], a: 0, kind: 'transfer' }
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
      { art: 'table|grandma,mom|car|·', en: 'Say "car". Say it slowly.', zh: '说 car。慢慢说。' },
      { art: 'table|grandma,mom|car|!', en: 'Say "bird". Say it again.', zh: '读 bird。再读一遍。' },
      { art: 'table|grandma,mom|car|♥', en: 'Say the "r" well. Do not drop it when you talk fast.', zh: '把 r 读好。说快的时候也别丢掉。' },
      { art: 'table|grandma,mom|car|★', en: 'A car is not a bird. They are different things, but both have "r".', zh: 'car 不是 bird。两样东西不一样，可都有 r。' },
      { art: 'table|grandma,mom|car|…', en: 'You can say both. Both are short words, so they are easy.', zh: '两个词你都能说。都是短词，所以不难。' },
      { art: 'table|grandma,mom|car|·', en: 'Car, bird, car, bird. Now say them fast.', zh: '汽车，鸟，汽车，鸟。现在说快一点。' },
      { art: 'table|grandma,mom|car|♥', en: 'Good! Now say them slowly.', zh: '很好！现在慢慢说一遍。' },
      { art: 'table|grandma,mom|car|·', en: 'Fast and slow. You can say both.', zh: '快的、慢的，你都会说了。' }
    ],
    quiz: [
      { q: 'car 和 bird 结尾都有哪个音？', opts: ['r 的音', 'l 的音', 'n 的音'], a: 0, kind: 'recall' },
      { q: '这一本在练哪个音？', opts: ['「s」的音', '「t」的音', '「r」的音'], a: 2, kind: 'infer' },
      { q: '单词里有 r，你会怎么读？', opts: ['把 r 读得清楚有力', '把 r 念没了', '跳过去'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b82', lv: 'L7', tag: '小知识', title: 'Why Winter Is Cold', zh: '冬天为什么冷',
    emoji: '☃️', color: '#FAD3B6',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。认读 3 个新词（冬天、摸、春天）。',
    trap: '美音里元音后的 r 一定要卷舌读出来：car、bird、water 都不能吞掉 r。',
    summary: '《冬天为什么冷》：这一本从一件小事讲起，说说为什么会这样。读前先看词卡（冬天、摸、春天）；读的时候留意先看到什么、为什么会这样、后来怎么弄明白。',
    retell: '合上书，按「先看到什么 → 为什么会这样 → 后来怎么弄明白」讲一遍。',
    think: '说说冬天和夏天有什么不一样。',
    pre: [
      { art: '⏰', en: 'winter', zh: '冬天' },
      { art: '🏃', en: 'touch', zh: '摸' },
      { art: '⏰', en: 'spring', zh: '春天' },
      { art: '☀️', en: 'sun', zh: '太阳' },
      { art: '🌿', en: 'wind', zh: '风' }
    ],
    sight: ['air', 'high', 'leaves', 'light', 'touches', 'wear'],
    newWords: [
      { w: 'winter', zh: '冬天' },
      { w: 'touch', zh: '摸' },
      { w: 'spring', zh: '春天' }
    ],
    pages: [
      { art: 'night|grandpa,dad|winter|·', en: 'Winter is here. The trees have no leaves, and the wind is cold.', zh: '冬天到了。树上没有叶子，风很冷。' },
      { art: 'night|grandpa,dad|winter|♪', en: 'Why is winter cold? We can find out.', zh: '冬天为什么冷？我们能弄明白。' },
      { art: 'night|grandpa,dad|winter|👀', en: 'The sun is not high. Its light comes in from the side, so it is not strong.', zh: '太阳不高。光从旁边斜着照过来，就不那么强了。' },
      { art: 'night|grandpa,dad|winter|?', en: 'The days are not long. It gets dark early because the sun goes down soon.', zh: '白天不长。天黑得早，因为太阳落得快。' },
      { art: 'night|grandpa,dad|winter|·', en: 'The sun is not hot. The light is not strong, so the air stays cold.', zh: '太阳不热。光不强，所以空气一直是冷的。' },
      { art: 'night|grandpa,dad|winter|!', en: 'So winter is cold. That is why we wear coats.', zh: '所以冬天冷。这就是我们要穿外套的原因。' },
      { art: 'night|grandpa,dad|winter|♥', en: 'The wind is cold too. It touches our face when we go out.', zh: '风也冷。我们出门的时候，脸上能感觉到。' },
      { art: 'night|grandpa,dad|winter|★', en: 'We wear coats. We wear scarves too.', zh: '我们穿外套。还围围巾。' },
      { art: 'night|grandpa,dad|winter|…', en: 'Our coats and scarves keep the cold out.', zh: '我们的外套和围巾把冷风挡在外面。' },
      { art: 'night|grandpa,dad|winter|·', en: 'Why winter is cold. Now we know.', zh: '冬天为什么冷。现在我知道了。' },
      { art: 'night|grandpa,dad|winter|♥', en: 'The days get longer again when spring comes.', zh: '春天一到，白天又变长了。' },
      { art: 'night|grandpa,dad|winter|·', en: 'Warm days will come. We can play in the park.', zh: '暖和的日子会来。我们又能去公园玩。' }
    ],
    quiz: [
      { q: '冬天为什么冷？', opts: ['太阳不高，光不强', '因为下雪', '因为风从海上来'], a: 0, kind: 'recall' },
      { q: '冬天太阳不高，所以地面上会怎么样？', opts: ['光和热都少，就冷了', '变得更亮', '一直下雨'], a: 0, kind: 'infer' },
      { q: '想知道自然现象为什么发生，你会怎么做？', opts: ['观察、想一想、查一查', '不管它', '随便猜'], a: 0, kind: 'transfer' }
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
      { art: '🌽', en: 'corn', zh: '玉米' },
      { art: '🚜', en: 'farm', zh: '农场' }
    ],
    sight: ['eat', 'grows', 'tired', 'watches'],
    newWords: [

    ],
    pages: [
      { art: 'farm|mom,ming|farmer|·', en: 'He works hard, and he likes it.', zh: '他干活很辛苦，可他喜欢这份工作。' },
      { art: 'farm|mom,ming|farmer|♪', en: 'The farmer gets up early. It is still dark when he goes out.', zh: '农民起得很早。他出门的时候天还黑着。' },
      { art: 'farm|mom,ming|farmer|👀', en: 'The farmer feeds the animals. He gives them corn, and they eat it fast.', zh: '农民喂牲口。他给它们玉米，它们吃得很快。' },
      { art: 'farm|mom,ming|farmer|?', en: 'The farmer grows corn. He watches it grow, and he waters it.', zh: '农民种玉米。他看着它长，给它浇水。' },
      { art: 'farm|mom,ming|farmer|·', en: 'The farmer works all day. He does not rest much, but he is happy.', zh: '农民干一整天。他歇得不多，可他高兴。' },
      { art: 'farm|mom,ming|farmer|!', en: 'The farmer is tired. His back hurts, so he sits for a while.', zh: '农民累了。他背疼，所以坐了一会儿。' },
      { art: 'farm|mom,ming|farmer|♥', en: 'But the farm is good. The corn is tall.', zh: '可农场很好。玉米高高的。' },
      { art: 'farm|mom,ming|farmer|★', en: 'How a farmer works. It is hard work.', zh: '农民怎么干活。这活很辛苦。' },
      { art: 'farm|mom,ming|farmer|…', en: 'The farmer likes the farm. He is glad to work there.', zh: '农民喜欢这个农场。他很高兴在那儿干活。' },
      { art: 'farm|mom,ming|farmer|·', en: 'The farmer is careful. He looks at the sky.', zh: '农民很仔细。他看看天色。' },
      { art: 'farm|mom,ming|farmer|♥', en: 'The farm helps many people. The food goes to the market when it is ready.', zh: '农场帮了很多人。食物收好了就运到市场。' },
      { art: 'farm|mom,ming|farmer|·', en: 'We thank the farmer. We eat the food, and we think of his work.', zh: '我们谢谢农夫。我们吃着这些食物，也想着他的辛苦。' }
    ],
    quiz: [
      { q: '农民一大早就去做什么？', opts: ['去市场卖菜', '喂牲口、下地干活', '送孩子上学'], a: 1, kind: 'recall' },
      { q: '农民每天都做什么？', opts: ['写作业、看书', '喂动物、种玉米、干农活', '坐车、玩'], a: 1, kind: 'infer' },
      { q: '看到别人辛勤劳动，你会怎么做？', opts: ['珍惜成果，说声谢谢', '浪费', '不管'], a: 0, kind: 'transfer' }
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
      { art: 'library|dad,lili|corner|·', en: 'Ming knows this place. He grew up here.', zh: '明明对这里很熟。他在这儿长大。' },
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
      { q: '回到去过的地方，你会怎么做？', opts: ['看看有什么变化，重新感受一下', '随便看看', '不看'], a: 0, kind: 'transfer' }
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
      { art: '📦', en: 'piece', zh: '一块' }
    ],
    sight: ['kitchen', 'piece', 'watches'],
    newWords: [
      { w: 'dumpling', zh: '饺子' }
    ],
    pages: [
      { art: 'kitchen|ming,grandma|dumpling|·', en: 'Grandma is in the kitchen. The kitchen is warm because she is cooking.', zh: '奶奶在厨房。厨房暖暖的，因为她正在做饭。' },
      { art: 'kitchen|ming,grandma|dumpling|♪', en: 'Grandma makes dumplings. She makes a round piece that is thin and soft.', zh: '奶奶包饺子。她做了一张又薄又软的圆皮。' },
      { art: 'kitchen|ming,grandma|dumpling|👀', en: 'Ming helps Grandma. He washes his hands first.', zh: '明明帮奶奶。他先把手洗干净。' },
      { art: 'kitchen|ming,grandma|dumpling|?', en: 'They get the food ready. There is pork, and there are green leaves, and Ming puts them on the table.', zh: '他们把馅备好。有猪肉，也有青菜，明明把它们放到桌上。' },
      { art: 'kitchen|ming,grandma|dumpling|·', en: 'Grandma shows Ming how. She puts the food on the round piece.', zh: '奶奶教明明怎么做。她把馅放到圆面皮上。' },
      { art: 'kitchen|ming,grandma|dumpling|!', en: 'Ming makes one dumpling. He closes it with his hands, but one side stays open.', zh: '明明包了一个饺子。他用手捏紧，可有一边没合上。' },
      { art: 'kitchen|ming,grandma|dumpling|♥', en: '"Try again," Grandma says. "I will help you."', zh: '「再试一次。」奶奶说，「我来帮你。」' },
      { art: 'kitchen|ming,grandma|dumpling|★', en: 'She shows him again, slowly. This time he watches her hands.', zh: '她又慢慢示范了一遍。这次他仔细看她的手。' },
      { art: 'kitchen|ming,grandma|dumpling|…', en: 'They make many dumplings. The table is full.', zh: '他们包了好多饺子。桌上摆满了。' },
      { art: 'kitchen|ming,grandma|dumpling|·', en: 'Then the dumplings cook in the pot. The water boils, and the kitchen smells good.', zh: '饺子在锅里煮。水开了，厨房里香起来。' },
      { art: 'kitchen|ming,grandma|dumpling|♥', en: 'The dumplings are good! Ming tastes one when it is still hot.', zh: '饺子很好吃！明明趁热尝了一个。' },
      { art: 'kitchen|ming,grandma|dumpling|·', en: 'Ming eats the dumplings. He eats more than Grandma.', zh: '明明吃饺子。他比奶奶吃得还多。' },
      { art: 'kitchen|ming,grandma|dumpling|…', en: 'Dumplings with Grandma. He wants to make them again because it was fun.', zh: '和奶奶包饺子。他还想再包，因为太有意思了。' }
    ],
    quiz: [
      { q: '明明包的饺子怎么了？', opts: ['有一边没捏上，开着口', '全破了', '太小了'], a: 0, kind: 'recall' },
      { q: '饺子有一边没捏上，下锅煮会怎么样？', opts: ['会变得更香', '会浮得更高', '馅可能会跑出来'], a: 2, kind: 'infer' },
      { q: '和家人一起做吃的，你会怎么做？', opts: ['怕做不好就不做', '只吃不做', '跟着学，做不好也没关系'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b86', lv: 'L8', tag: '中秋', title: 'The Mid-Autumn Moon', zh: '中秋的月亮',
    emoji: '🌕', color: '#F9DFB4',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 5 个新词（中、秋天、今晚、窗户、月饼）。',
    trap: 'ou / ow 读 /aʊ/，oi / oy 读 /ɔɪ/；长句按意思分组读，别逐词蹦。',
    summary: '《中秋的月亮》：这是一个完整的小故事。读前先看词卡（中、秋天、今晚、窗户、月饼）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，按做事情的顺序讲一遍，至少用上三个本本词卡。',
    think: '说说中秋节你和家人做了什么。',
    pre: [
      { art: '⏰', en: 'mid', zh: '中' },
      { art: '⏰', en: 'autumn', zh: '秋天' },
      { art: '⏰', en: 'tonight', zh: '今晚' },
      { art: '🪟', en: 'window', zh: '窗户' },
      { art: '🥮', en: 'mooncake', zh: '月饼' },
      { art: '🌙', en: 'moon', zh: '月亮' },
      { art: '🌿', en: 'night', zh: '夜晚' }
    ],
    sight: ['near', 'quiet'],
    newWords: [
      { w: 'mid', zh: '中' },
      { w: 'autumn', zh: '秋天' },
      { w: 'tonight', zh: '今晚' },
      { w: 'window', zh: '窗户' },
      { w: 'mooncake', zh: '月饼' }
    ],
    pages: [
      { art: 'kitchen|lili,grandpa|mooncake|·', en: 'The Mid-Autumn night is here. The sky is clear, so the moon is easy to see.', zh: '中秋的夜晚到了。天很晴，月亮看得很清楚。' },
      { art: 'kitchen|lili,grandpa|mooncake|♪', en: 'Up in the sky, the moon is round. It looks like a plate.', zh: '月亮圆圆的。像一只挂在天上的盘子。' },
      { art: 'kitchen|lili,grandpa|mooncake|👀', en: 'The moon is very bright tonight.', zh: '今晚的月亮很亮。' },
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
      { q: '过节和家人团聚，你会怎么做？', opts: ['只顾自己玩', '不参加', '和家人一起，珍惜在一起的时间'], a: 2, kind: 'transfer' }
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
      { art: '🎒', en: 'bag', zh: '书包' }
    ],
    sight: [],
    newWords: [
      { w: 'train', zh: '火车' },
      { w: 'town', zh: '小镇' }
    ],
    pages: [
      { art: 'home|grandma,mom|window|·', en: 'Ming is on a train. It is his first long trip, so he looks at everything.', zh: '明明在火车上。这是他第一次长途旅行，所以他什么都看。' },
      { art: 'home|grandma,mom|window|♪', en: 'The train ride is long. It will take many hours.', zh: '这趟车要走很久。得坐好几个小时。' },
      { art: 'home|grandma,mom|window|👀', en: 'Ming sits by the window. Mom sits with him, and she has a bag of food.', zh: '明明坐在窗边。妈妈坐在他旁边，带着一袋吃的。' },
      { art: 'home|grandma,mom|window|?', en: 'Ming looks out the window. The houses go by, and the trees do too.', zh: '明明看着窗外。房子往后退，树也是。' },
      { art: 'home|grandma,mom|window|·', en: 'The train goes and goes. It does not stop at all.', zh: '火车开啊开。一直不停。' },
      { art: 'home|grandma,mom|window|!', en: 'Ming sees hills and trees. He sees cows that stand on the grass.', zh: '明明看见山和树。他看见站在草地上的牛。' },
      { art: 'home|grandma,mom|window|♥', en: 'The train goes fast. The trees go by quickly.', zh: '火车开得很快。树飞快地往后退。' },
      { art: 'home|grandma,mom|window|★', en: 'Ming looks and looks. He counts the cows because he has nothing else to do.', zh: '明明看啊看。他数牛，因为他没别的事做。' },
      { art: 'home|grandma,mom|window|…', en: 'It is nice by the window. He can see the sky.', zh: '窗边真好。他能看见天空。' },
      { art: 'home|grandma,mom|window|·', en: 'A long train ride. Mom gives him a cake when he is hungry.', zh: '一趟长长的火车。他饿的时候，妈妈给他一块蛋糕。' },
      { art: 'home|grandma,mom|window|♥', en: 'Ming keeps looking out the window. He does not want to sleep because he may miss something.', zh: '明明一直望着窗外。他不想睡，因为怕错过什么。' },
      { art: 'home|grandma,mom|window|·', en: 'The train stops. They are in the town.', zh: '火车停了。他们到了镇上。' },
      { art: 'home|grandma,mom|window|…', en: 'Ming is glad. Grandma is there to meet them. "You are here!" Grandma says, and she puts up her hand.', zh: '明明很高兴。奶奶来接他们。「你们到了！」奶奶说着，招了招手。' }
    ],
    quiz: [
      { q: '明明坐火车的时候坐在哪儿？', opts: ['过道边', '窗边', '最后一排'], a: 1, kind: 'recall' },
      { q: '明明在火车上为什么不肯睡？', opts: ['他怕错过窗外的什么东西', '他一点也不困', '车上太吵了'], a: 0, kind: 'infer' },
      { q: '坐车旅行，你会怎么做？', opts: ['看看窗外的风景，注意安全', '一直睡觉', '乱跑'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b88', lv: 'L8', tag: '趣事', title: 'A Loud Shout at Night', zh: '夜里的一声喊',
    emoji: '🌃', color: '#C6DEF6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 1 个新词（喊）。',
    trap: 'ou / ow 读 /aʊ/，oi / oy 读 /ɔɪ/；长句按意思分组读，别逐词蹦。',
    summary: '《夜里的一声喊》：这是一个完整的小故事。读前先看词卡（喊）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，按做事情的顺序讲一遍，至少用上三个本本词卡。',
    think: '说说你夜里听到过的一种声音。',
    pre: [
      { art: '🏃', en: 'shout', zh: '喊' },
      { art: '🪟', en: 'window', zh: '窗户' },
      { art: '🌿', en: 'wind', zh: '风' }
    ],
    sight: ['knows', 'quiet'],
    newWords: [
      { w: 'shout', zh: '喊' }
    ],
    pages: [
      { art: 'night|grandpa,dad|night|·', en: 'Night is here. The house is dark, and the wind is up.', zh: '夜晚到了。屋子里黑黑的，风也起来了。' },
      { art: 'night|grandpa,dad|night|♪', en: 'Everything is quiet. Even the dog makes no sound.', zh: '四下静悄悄的。今晚连狗都不出声。' },
      { art: 'night|grandpa,dad|night|👀', en: 'Ming is in bed. The window is closed because the night is cold.', zh: '明明躺在床上。窗户关着，因为夜里冷。' },
      { art: 'night|grandpa,dad|night|?', en: 'There is a loud sound outside. It comes again, and Ming sits up.', zh: '外面有个很响的声音。它又响了一次，明明坐了起来。' },
      { art: 'night|grandpa,dad|night|·', en: 'He listens. The house is quiet again.', zh: '他听着。屋里又静下来了。' },
      { art: 'night|grandpa,dad|night|!', en: '"What was that?" Ming asks. He listens hard so he can hear it again.', zh: '「那是什么声音？」明明问。他使劲听，想再听见一次。' },
      { art: 'night|grandpa,dad|night|♥', en: 'He looks at the trees by the window.', zh: '他看窗外的树。' },
      { art: 'night|grandpa,dad|night|★', en: 'It is the wind. It pushes at the window because it wants to come in.', zh: '是风。它推着窗户，因为它想进来。' },
      { art: 'night|grandpa,dad|night|…', en: 'Ming is not afraid. He knows what it is now, so he goes back to bed.', zh: '明明不怕。他现在知道那是什么了，所以又躺下了。' },
      { art: 'night|grandpa,dad|night|·', en: 'He gets into bed again. It is warm.', zh: '他又钻进被窝。被窝里暖暖的。' },
      { art: 'night|grandpa,dad|night|♥', en: 'A loud shout at night. It is only the wind at the window.', zh: '夜里的一声响。不过是窗外的风。' },
      { art: 'night|grandpa,dad|night|·', en: 'The wind can be loud. But it cannot come in because the window is closed.', zh: '风可以很响。但它进不来，因为窗户关着。' },
      { art: 'night|grandpa,dad|night|…', en: 'Ming sleeps well. In the morning he tells Mom.', zh: '明明睡得很好。早上他讲给妈妈听。' }
    ],
    quiz: [
      { q: '夜里是什么在推窗户？', opts: ['一只鸟', '一只猫', '风'], a: 2, kind: 'recall' },
      { q: '弄明白那声响是风以后，明明怎么样了？', opts: ['一直没睡着', '不怕了，又躺回去睡', '跑去找妈妈'], a: 1, kind: 'infer' },
      { q: '夜里听到奇怪的声音，你会怎么做？', opts: ['看一看弄清楚是什么，别慌', '一直哭', '躲起来不出声'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b89', lv: 'L8', tag: '好笑', title: 'Grandpa\'s Big Hat', zh: '爷爷的大帽子',
    emoji: '🎩', color: '#E0CFF3',
    track: 'humor',
    goal: '跟着一个好笑的故事读到最后，看看笑点在哪儿。不引入新词，全部是读过的词。',
    trap: 'ou / ow 读 /aʊ/，oi / oy 读 /ɔɪ/；长句按意思分组读，别逐词蹦。',
    summary: '《爷爷的大帽子》：这是一个完整的小故事。读前先看词卡，都是学过的词；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，按做事情的顺序讲一遍，至少用上三个本本词卡。',
    think: '说说你见过的一顶特别的帽子，或者一件特别大的东西。',
    pre: [
      { art: '🎩', en: 'hat', zh: '帽子' },
      { art: '🐱', en: 'cat', zh: '猫' }
    ],
    sight: ['laugh', 'wears'],
    newWords: [

    ],
    pages: [
      { art: 'home|mom,ming|hat|·', en: 'Grandpa has a new hat today. It is a very big brown hat.', zh: '爷爷今天有了一顶新帽子。那是一顶好大好大的棕色帽子。' },
      { art: 'home|mom,ming|hat|♪', en: 'Grandpa puts the hat on his head. The hat is too big for him.', zh: '爷爷把帽子戴到头上。帽子对他来说太大了。' },
      { art: 'home|mom,ming|hat|👀', en: 'When he puts it on, it comes down over his face. Now Grandpa cannot see a thing.', zh: '一戴上去，帽子就往下掉，盖住了他的脸。现在他什么也看不见了。' },
      { art: 'home|mom,ming|hat|?', en: 'Grandpa walks to the door, but he walks into a wall. He puts up his hands and stops.', zh: '爷爷往门口走，却一头撞到墙上。他举起双手，停了下来。' },
      { art: 'home|mom,ming|hat|·', en: 'The big hat is still over his face. He cannot find the door at all because he cannot see anything.', zh: '大帽子还盖着他的脸。他怎么也找不到门。' },
      { art: 'home|mom,ming|hat|!', en: 'Ming looks at Grandpa and laughs. Grandpa laughs too, but he cannot see.', zh: '明明看着爷爷，笑了。爷爷也笑了，可他还是看不见。' },
      { art: 'home|mom,ming|hat|♥', en: 'Ming laughs because the hat is very big. It is like a big box on his head.', zh: '明明笑，是因为帽子太大了。它像一个大盒子扣在爷爷头上。' },
      { art: 'home|mom,ming|hat|★', en: 'Then the hat starts to move. It moves up and down when Grandpa walks to the door.', zh: '这时候，帽子动了起来。它在爷爷头上一上一下地动。' },
      { art: 'home|mom,ming|hat|…', en: 'Grandpa says that something is in his hat. He takes the hat off his head.', zh: '「帽子里有东西。」爷爷把帽子从头上拿下来。' },
      { art: 'home|mom,ming|hat|·', en: 'A little cat jumps out of the hat! The cat was in the hat all the time.', zh: '一只小猫从帽子里跳了出来！原来小猫一直都在帽子里。' },
      { art: 'home|mom,ming|hat|♥', en: 'Ming and Grandpa laugh and laugh. The cat is happy, but Grandpa is not.', zh: '明明和爷爷笑个不停。小猫开心得很，爷爷却高兴不起来。' },
      { art: 'home|mom,ming|hat|·', en: 'Grandpa looks at the big hat on the table. He says that the hat is for the cat now.', zh: '爷爷看着桌上的大帽子。他说，这顶帽子就给小猫吧。' },
      { art: 'home|mom,ming|hat|…', en: 'The cat wears the big hat. When it does, the hat is just right for the little cat.', zh: '小猫戴上了大帽子。它戴着正合适。' }
    ],
    quiz: [
      { q: '帽子戴上去以后，盖住了爷爷的什么？', opts: ['他的脚', '他的手', '他的脸'], a: 2, kind: 'recall' },
      { q: '帽子为什么会一上一下地动？', opts: ['因为风把帽子吹动了', '因为帽子自己会动', '因为里面有只小猫'], a: 2, kind: 'infer' },
      { q: '帽子盖住眼睛看不见路，你会怎么做？', opts: ['闭着眼睛往前走', '让别人抱着自己走', '把帽子抬高，或者摘下来再走'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b90', lv: 'L8', tag: '想象', title: 'The Moon in the Lake', zh: '湖里的月亮',
    emoji: '🌙', color: '#F6C9E3',
    track: 'fantasy',
    goal: '跟着一个想象出来的故事，把来龙去脉读顺。不引入新词，全部是读过的词。',
    trap: 'ou / ow 读 /aʊ/，oi / oy 读 /ɔɪ/；长句按意思分组读，别逐词蹦。',
    summary: '《湖里的月亮》：这是一个完整的小故事。读前先看词卡，都是学过的词；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '合上书，按做事情的顺序讲一遍，至少用上三个本本词卡。',
    think: '如果你是湖里的一条小鱼，你想对月亮说什么？',
    pre: [
      { art: '🌙', en: 'moon', zh: '月亮' },
      { art: '🏞️', en: 'lake', zh: '湖' }
    ],
    sight: ['quiet'],
    newWords: [

    ],
    pages: [
      { art: 'night|dad,lili|moon|·', en: 'It is a quiet night by the lake. The moon is round and bright in the sky.', zh: '夜里，湖边静静的。月亮圆圆的、亮亮的，挂在天上。' },
      { art: 'night|dad,lili|moon|♪', en: 'Then the moon comes down to the lake. It goes into the dark water to swim.', zh: '这时候，月亮下到湖边来。它钻进黑黑的水里游泳。' },
      { art: 'night|dad,lili|moon|👀', en: 'The moon swims and swims in the lake. It is happy when the water is warm.', zh: '月亮在湖里游啊游。水暖暖的时候，它开心极了。' },
      { art: 'night|dad,lili|moon|?', en: 'Little fish see the moon in the water. They swim up to say hello to it.', zh: '小鱼看见了水里的月亮。它们游过来，跟月亮打招呼。' },
      { art: 'night|dad,lili|moon|·', en: 'The moon plays with the little fish. They swim all over the lake together.', zh: '月亮和小鱼一起玩。它们在湖里到处游来游去。' },
      { art: 'night|dad,lili|moon|!', en: 'The lake is bright when the moon is in it. All the water has light from the moon.', zh: '月亮在湖里的时候，湖水亮亮的。满湖的水都有了月光。' },
      { art: 'night|dad,lili|moon|♥', en: 'A duck on the lake looks at the moon that is down in the water. The duck thinks the moon is a big ball.', zh: '湖上的一只鸭子看着月亮。鸭子以为月亮是个大球。' },
      { art: 'night|dad,lili|moon|★', en: 'The moon tells the fish that it is nice here. The fish say the lake is nice too.', zh: '月亮告诉小鱼，这里真好。小鱼说，湖里也很好。' },
      { art: 'night|dad,lili|moon|…', en: 'The moon likes the lake because it is quiet. It swims for a long time.', zh: '月亮喜欢这个湖，因为这里很安静。它游了好长时间。' },
      { art: 'night|dad,lili|moon|·', en: 'Soon the sky is a little bright. The moon must go back up to the sky.', zh: '天边有一点点亮了。月亮该回到天上去了。' },
      { art: 'night|dad,lili|moon|♥', en: 'The moon says good night to the fish that swam with it. It goes up and up into the sky.', zh: '月亮跟小鱼道了晚安。它升啊升，回到了天上。' },
      { art: 'night|dad,lili|moon|·', en: 'Now the moon is high in the sky again. The moon is still down in the lake too.', zh: '现在，月亮又高高地挂在天上。湖里呢，也还有一轮月亮。' },
      { art: 'night|dad,lili|moon|…', en: 'The night is quiet again by the lake. The moon will come down to swim again when it is dark.', zh: '湖边又安静下来。过不了多久，月亮还会来游泳。' }
    ],
    quiz: [
      { q: '月亮下到湖里做什么？', opts: ['找好吃的东西', '游泳，和小鱼一起玩', '在水底睡觉'], a: 1, kind: 'recall' },
      { q: '天边发亮的时候，月亮为什么要回到天上？', opts: ['因为湖水变冷了', '因为小鱼们都回家了', '它要回到天上去，白天待在那儿'], a: 2, kind: 'infer' },
      { q: '晚上在湖边玩，你会怎么做？', opts: ['一个人下水游泳', '和大人待在一起，注意安全', '往湖里扔石头'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b91', lv: 'L8', tag: '交通', title: 'Trains and Rails', zh: '火车和铁轨',
    emoji: '🚂', color: '#BFE6DF',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。认读 2 个新词（轮子、城市）。',
    trap: 'ou / ow 读 /aʊ/，oi / oy 读 /ɔɪ/；长句按意思分组读，别逐词蹦。',
    summary: '《火车和铁轨》：这一本从一件小事讲起，说说为什么会这样。读前先看词卡（轮子、城市）；读的时候留意先看到什么、为什么会这样、后来怎么弄明白。',
    retell: '合上书，按「先看到什么 → 为什么会这样 → 后来怎么弄明白」讲一遍。',
    think: '说说你坐火车（或者汽车）的时候，窗外看到过什么。',
    pre: [
      { art: '⚙️', en: 'wheel', zh: '轮子' },
      { art: '📍', en: 'city', zh: '城市' },
      { art: '📦', en: 'train', zh: '火车' },
      { art: '📦', en: 'car', zh: '小汽车' }
    ],
    sight: ['watch', 'wheels'],
    newWords: [
      { w: 'wheel', zh: '轮子' },
      { w: 'city', zh: '城市' }
    ],
    pages: [
      { art: 'library|ming,grandma|train|·', en: 'A train is long and very strong. It runs on two long lines all day.', zh: '火车长长的，也很有力气。它整天在两条长长的铁轨上跑。' },
      { art: 'library|ming,grandma|train|♪', en: 'The lines are hard and do not move. The wheels of the train run on the lines.', zh: '铁轨硬硬的，不会动。火车的轮子，就在铁轨上跑。' },
      { art: 'library|ming,grandma|train|👀', en: 'The train takes people who go to work. It takes things too, like food and boxes.', zh: '火车拉着去上班的人。它也拉东西，像食物和箱子。' },
      { art: 'library|ming,grandma|train|?', en: 'A train can go very fast. It goes faster than a car on the road.', zh: '火车跑得很快。它比马路上的汽车还快。' },
      { art: 'library|ming,grandma|train|·', en: 'A train has many cars that go together. All the cars are joined from front to back.', zh: '一列火车有很多节车厢，连在一起。车厢从头到尾都接得好好的。' },
      { art: 'library|ming,grandma|train|!', en: 'The train stops in a town to let people get on. Then it starts again and goes on.', zh: '火车到了镇上就停下，让人上车。然后它又接着往前开。' },
      { art: 'library|ming,grandma|train|♥', en: 'Ming likes to watch the trains go by. He counts the cars of every train.', zh: '明明喜欢看火车开过。他数一数，每列火车有几节车厢。' },
      { art: 'library|ming,grandma|train|★', en: 'Some trains run under the ground in a big city. Some trains run high over the ground.', zh: '有些火车在大城市的地下跑。有些火车在半空中跑。' },
      { art: 'library|ming,grandma|train|…', en: 'When the train comes, people stand back. The train is big and very strong.', zh: '火车开过来的时候，人们要站远一点。火车又大，又有力气。' },
      { art: 'library|ming,grandma|train|·', en: 'A train can take many people at one time because it has many cars. It can take more people than a car.', zh: '一列火车能一下子拉很多人。它比一辆汽车拉得多。' },
      { art: 'library|ming,grandma|train|♥', en: 'Trains are good for long trips. People can sit and look out the window.', zh: '出远门，坐火车很好。人们坐着，还能看看窗外。' },
      { art: 'library|ming,grandma|train|·', en: 'The lines go all the way to the town, so the train can go very far.', zh: '铁轨一直通到镇上。火车可以跑得很远。' },
      { art: 'library|ming,grandma|train|…', en: 'Ming says he wants to ride a train again. He likes the trains that go fast and far.', zh: '明明说，他还想再坐一次火车。他喜欢又快又远的火车。' }
    ],
    quiz: [
      { q: '火车在什么上面跑？', opts: ['软软的草地', '两条长长的铁轨', '平平的马路'], a: 1, kind: 'recall' },
      { q: '如果铁轨在半路断了，你猜会怎么样？', opts: ['火车就到不了镇上了', '火车会自己拐弯', '火车会飞起来'], a: 0, kind: 'infer' },
      { q: '在车站等火车，你会怎么做？', opts: ['把头伸出窗外看', '跑到铁轨上去等', '站在安全线外等，车停稳了再上'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b92', lv: 'L8', tag: '科学', title: 'Light', zh: '光',
    emoji: '💡', color: '#F2E2A8',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。认读 1 个新词（世界）。',
    trap: 'ou / ow 读 /aʊ/，oi / oy 读 /ɔɪ/；长句按意思分组读，别逐词蹦。',
    summary: '《光》：这一本从一件小事讲起，说说为什么会这样。读前先看词卡（世界）；读的时候留意先看到什么、为什么会这样、后来怎么弄明白。',
    retell: '合上书，按「先看到什么 → 为什么会这样 → 后来怎么弄明白」讲一遍。',
    think: '找一找：你的身边有哪些会发光的东西？',
    pre: [
      { art: '🌍', en: 'world', zh: '世界' },
      { art: '🌿', en: 'light', zh: '光' },
      { art: '🌿', en: 'night', zh: '夜晚' }
    ],
    sight: [],
    newWords: [
      { w: 'world', zh: '世界' }
    ],
    pages: [
      { art: 'library|lili,grandpa|light|·', en: 'We can see light all around us. The sun gives us light in the day.', zh: '光就在我们身边。白天，太阳给我们光。' },
      { art: 'library|lili,grandpa|light|♪', en: 'When there is light, we can see everything. We can see the tree and the little bird.', zh: '有了光，我们什么都能看见。能看见树，也能看见小鸟。' },
      { art: 'library|lili,grandpa|light|👀', en: 'At night, the sun is not in the sky. Then it is dark, and we cannot see well.', zh: '到了夜里，太阳不在天上了。天一黑，我们就看不清了。' },
      { art: 'library|lili,grandpa|light|?', en: 'We make lights for the night. Lights in the house help us see at night.', zh: '夜里，我们自己造出光来。家里的灯，帮我们在夜里看清东西。' },
      { art: 'library|lili,grandpa|light|·', en: 'When things burn, they give light and heat. We can see a bright light from far away.', zh: '东西烧起来的时候，会发光，也会发热。远远的，我们就能看见亮光。' },
      { art: 'library|lili,grandpa|light|!', en: 'The sun gives the most light of all. It lights up the sky and the ground.', zh: '太阳给我们的光最多。它把天空和大地都照亮了。' },
      { art: 'library|lili,grandpa|light|♥', en: 'The moon looks bright at night. But we know that the sun lights the moon.', zh: '月亮夜里看起来很亮。可我们知道，是太阳把月亮照亮的。' },
      { art: 'library|lili,grandpa|light|★', en: 'Light helps us see red and blue. In the dark, all things look the same.', zh: '有了光，我们能看见红色和蓝色。黑乎乎的时候，什么都长得一样。' },
      { art: 'library|lili,grandpa|light|…', en: 'Some light is bright, and some light is dim. We read and write in bright light.', zh: '有的光很亮，有的光暗暗的。我们要在亮光下看书、写字。' },
      { art: 'library|lili,grandpa|light|·', en: 'We need light because without it, we cannot see. We see things when light falls on them.', zh: '我们需要光，因为没有光就什么也看不见。光照到东西上，我们才看得见它们。' },
      { art: 'library|lili,grandpa|light|♥', en: 'Light can come from far away. The light of the sun comes a long way before it gets to us.', zh: '光能从很远很远的地方来。太阳的光走了好远，才到我们身边。' },
      { art: 'library|lili,grandpa|light|·', en: 'When you look around at night, you can see many lights. Some are big and some are small.', zh: '夜里看看四周的灯。有的大，有的小。' },
      { art: 'library|lili,grandpa|light|…', en: 'Light is in the day and in the night. With light, we can see the world.', zh: '白天有光，夜里也有光。有了光，我们才能看见这个世界。' }
    ],
    quiz: [
      { q: '白天的光是从哪儿来的？', opts: ['月亮', '太阳', '星星'], a: 1, kind: 'recall' },
      { q: '为什么关了灯就看不见东西了？', opts: ['因为没有光进到眼睛里', '因为眼睛要睡觉了', '因为东西都不见了'], a: 0, kind: 'infer' },
      { q: '晚上要看书，你会怎么做？', opts: ['闭着眼睛看', '开一盏亮亮的灯再看', '摸黑看'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b93', lv: 'L8', tag: '发音', title: 'Say It: House, Cow', zh: '说一说：house cow',
    emoji: '🗣️', color: '#D9D2F5',
    track: 'drill',
    goal: '把本级难点音听准、说准，并能在整句里读对。认读 1 个新词（奶牛）。',
    trap: 'ou / ow 读 /aʊ/，oi / oy 读 /ɔɪ/；长句按意思分组读，别逐词蹦。',
    summary: '《说一说：house cow》：这一本练两个词的音和形。读前先看词卡（奶牛）；读的时候先看清每个词，再连起来读一遍。',
    retell: '把这一本练的两个词再读一遍，说说它们的音哪里一样、哪里不一样。',
    think: '找两个带 ow 的词，读一读、比一比。',
    pre: [
      { art: '🐄', en: 'cow', zh: '奶牛' },
      { art: '🏠', en: 'house', zh: '房子' }
    ],
    sight: [],
    newWords: [
      { w: 'cow', zh: '奶牛' }
    ],
    pages: [
      { art: 'table|grandma,mom|house|·', en: 'This is a house. It has "ow" at the end.', zh: '这是一座房子。结尾是 ow。' },
      { art: 'table|grandma,mom|house|♪', en: 'This is a cow. It has "ow" too.', zh: '这是一头牛。也有 ow。' },
      { art: 'table|grandma,mom|house|👀', en: 'House and cow. Two short words.', zh: 'house 和 cow。两个短词。' },
      { art: 'table|grandma,mom|house|?', en: 'Both have the "ow" sound. Listen to the two words, and say them slowly.', zh: '两个词都有 ow 的音。听听这两个词，慢慢说。' },
      { art: 'table|grandma,mom|house|·', en: 'Say "house". Say it slowly.', zh: '说 house。慢慢说。' },
      { art: 'table|grandma,mom|house|!', en: 'Say "cow". Say it again.', zh: '读 cow。再读一遍。' },
      { art: 'table|grandma,mom|house|♥', en: 'A house is not a cow. They are different things, but the sound is the same.', zh: 'house 不是 cow。两样东西不一样，可声音一样。' },
      { art: 'table|grandma,mom|house|★', en: 'The "ow" sounds the same. The first sounds are different, so listen carefully.', zh: 'ow 的音一样。开头的音不同，所以要仔细听。' },
      { art: 'table|grandma,mom|house|…', en: 'You can say both. Say them together, and keep the "ow" the same.', zh: '两个词你都能说。连起来说，ow 的音保持一样。' },
      { art: 'table|grandma,mom|house|·', en: 'House, cow, house, cow.', zh: 'house，cow，house，cow。' },
      { art: 'table|grandma,mom|house|♥', en: 'Good!', zh: '真棒！' },
      { art: 'table|grandma,mom|house|·', en: 'A house and a cow. Now find two more words that have "ow".', zh: '一个 house，一个 cow。再找两个带 ow 的词。' },
      { art: 'table|grandma,mom|house|…', en: 'Say each one slowly, and check the "ow" sound.', zh: '一个一个慢慢说，看看 ow 的音读得对不对。' }
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
      { art: '🌿', en: 'night', zh: '夜晚' }
    ],
    sight: ['friend'],
    newWords: [

    ],
    pages: [
      { art: 'kitchen|grandpa,dad|mooncake|·', en: 'The moon looks round. It is a big ball of rock far away.', zh: '月亮看起来圆圆的。它是很远的一颗大石头球。' },
      { art: 'kitchen|grandpa,dad|mooncake|♪', en: 'Why does the moon look round?', zh: '月亮为什么看起来是圆的？' },
      { art: 'kitchen|grandpa,dad|mooncake|👀', en: 'The moon does not make light. The sun lights it.', zh: '月亮自己不发光。是太阳照亮了它。' },
      { art: 'kitchen|grandpa,dad|mooncake|?', en: 'Half of the moon is always bright. The other half is dark.', zh: '月亮总有一半是亮的，另一半是暗的。' },
      { art: 'kitchen|grandpa,dad|mooncake|·', en: 'When we see the bright half, the moon looks round, like a mooncake.', zh: '我们看到亮的那一半时，月亮就圆圆的，像月饼。' },
      { art: 'kitchen|grandpa,dad|mooncake|!', en: 'Sometimes we see only a thin part of it. Then the moon looks thin.', zh: '有时我们只看到它细细的一条。那时月亮就变细了。' },
      { art: 'kitchen|grandpa,dad|mooncake|♥', en: 'But it is the same moon. Nothing about it changes. Only what we see is different.', zh: '可月亮还是同一个月亮。它一点没变。变的是我们看到的样子。' },
      { art: 'kitchen|grandpa,dad|mooncake|★', en: 'The bright part we see grows, and then it gets small again, night after night.', zh: '我们看到的亮部一夜夜变大，又一夜夜变小。' },
      { art: 'kitchen|grandpa,dad|mooncake|…', en: 'Why the moon looks round. Now you can tell a friend when you see it.', zh: '月亮为什么看起来圆。现在你看见它的时候，能讲给朋友听了。' },
      { art: 'kitchen|grandpa,dad|mooncake|·', en: 'The moon is far away. It is much bigger than it looks.', zh: '月亮离我们很远。它比看上去大得多。' },
      { art: 'kitchen|grandpa,dad|mooncake|♥', en: 'Look at the moon tonight. See which part is bright, and which part is dark.', zh: '今晚看看月亮。看看哪一部分亮，哪一部分暗。' },
      { art: 'kitchen|grandpa,dad|mooncake|·', en: 'The moon is always there. In the day it is hard to see.', zh: '月亮一直都在。白天不容易看见它。' },
      { art: 'kitchen|grandpa,dad|mooncake|…', en: 'Look at it night after night. You will see it change because we see different parts.', zh: '一夜一夜地看。你会看见它变化，因为我们看到的部分不同。' }
    ],
    quiz: [
      { q: '月亮的光是从哪儿来的？', opts: ['它自己会发光', '星星照亮的', '太阳照亮的'], a: 2, kind: 'recall' },
      { q: '月亮为什么看起来圆圆的？', opts: ['它本来就是圆的饼', '我们看到了它被照亮的那一半', '有人把它点亮了'], a: 1, kind: 'infer' },
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
      { art: 'kitchen|mom,ming|noodle|👀', en: 'Noodles are good to eat. They keep you warm in winter when the air is cold.', zh: '面条很好吃。天冷的时候，吃碗面能让你暖和起来。' },
      { art: 'kitchen|mom,ming|noodle|?', en: 'People make noodles. They pull them into long lines.', zh: '人们做面条。他们把面拉成长长的条。' },
      { art: 'kitchen|mom,ming|noodle|·', en: 'The noodles go in the pot. The water boils, and they move in it.', zh: '面条下到锅里。水开着，它们在锅里翻滚。' },
      { art: 'kitchen|mom,ming|noodle|!', en: 'The noodles are ready soon. They do not take long at all.', zh: '面条很快就熟。一点也不用等。' },
      { art: 'kitchen|mom,ming|noodle|♥', en: 'People eat the noodles. They eat them hot because they taste best then.', zh: '人们吃面条。他们趁热吃，因为那时最好吃。' },
      { art: 'kitchen|mom,ming|noodle|★', en: 'Long noodles are fun. They are hard to pick up, so people eat them slowly.', zh: '长面条很好玩。它们不好夹，所以人们吃得很慢。' },
      { art: 'kitchen|mom,ming|noodle|…', en: 'Noodles in the south. Each town has its own way.', zh: '南方的面条。每个镇子都有自己的做法。' },
      { art: 'kitchen|mom,ming|noodle|·', en: 'Ming likes noodles too. He eats them with Grandma when she makes them.', zh: '明明也喜欢面条。奶奶做的时候，他跟她一起吃。' },
      { art: 'kitchen|mom,ming|noodle|♥', en: 'Noodles are easy to make. That is why people eat them so often.', zh: '面条好做。所以人们常吃。' },
      { art: 'kitchen|mom,ming|noodle|·', en: 'You can eat a noodle too. Take one and taste it.', zh: '你也可以尝一根。夹起来尝尝。' },
      { art: 'kitchen|mom,ming|noodle|…', en: '"More noodles," Ming says. Grandma gives him more.', zh: '「再来点面条。」明明说。奶奶又给了他一些。' }
    ],
    quiz: [
      { q: '面条什么时候最好吃？', opts: ['趁热吃', '凉了吃', '泡在汤里'], a: 0, kind: 'recall' },
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
      { art: 'library|dad,lili|town|♥', en: 'The town is warm tonight. The wind is cold outside.', zh: '今晚镇上暖暖的。外面的风很冷。' },
      { art: 'library|dad,lili|town|★', en: 'All together tonight. Grandma sits by Ming, and she holds his hand.', zh: '今晚大家在一起。奶奶坐在明明旁边，握着他的手。' },
      { art: 'library|dad,lili|town|…', en: 'The family is happy. Ming looks at them all and smiles.', zh: '一家人很开心。明明看着他们每一个人，笑了。' },
      { art: 'library|dad,lili|town|·', en: 'The town is a good place. He knows every street because he grew up here.', zh: '这个镇子他熟得很。每一条街他都知道，因为他在这儿长大。' },
      { art: 'library|dad,lili|town|♥', en: 'Ming likes the town. He likes the market and the park.', zh: '明明喜欢这个镇子。他喜欢市场和公园。' },
      { art: 'library|dad,lili|town|·', en: 'It is good to be together. They will do this again when the next big day comes.', zh: '在一起真好。下个节日来的时候，他们还会这样。' },
      { art: 'library|dad,lili|town|…', en: 'A good night in the town. Ming does not want it to end.', zh: '镇上美好的一夜。明明不想让它结束。' }
    ],
    quiz: [
      { q: '今晚屋里为什么满满的？', opts: ['来了很多客人', '房子很小', '谁也没出门，大家都在'], a: 2, kind: 'recall' },
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
      { art: 'home|ming,grandma|photo|👀', en: 'The photo is of his family. It is from an autumn day, when Ming was small.', zh: '照片上是他的家人。那是一个秋日，明明还小。' },
      { art: 'home|ming,grandma|photo|?', en: 'Ming looks at the photo. He finds Grandma in it, and he smiles.', zh: '明明看着照片。他在里面找到了奶奶，笑了起来。' },
      { art: 'home|ming,grandma|photo|·', en: 'The family stands together. They are in front of the house where Ming grew up.', zh: '一家人站在一起。他们站在明明长大的那座房子前。' },
      { art: 'home|ming,grandma|photo|!', en: 'Grandma is in the photo. She holds the big cake that she made that morning.', zh: '奶奶在照片里。她捧着那天早上做的大蛋糕。' },
      { art: 'home|ming,grandma|photo|♥', en: 'Ming is in the photo too. He was much smaller then, because he was only six.', zh: '明明也在照片里。那时他小得多，因为他才六岁。' },
      { art: 'home|ming,grandma|photo|★', en: 'Ming takes it out again. He wants one more look before the train comes.', zh: '明明又把它拿出来。他想在火车来之前再看一眼。' },
      { art: 'home|ming,grandma|photo|…', en: 'The wind comes in, and the photo flies up before Ming can catch it.', zh: '风灌进来，照片在明明抓住之前就飞了起来。' },
      { art: 'home|ming,grandma|photo|·', en: 'It falls by a bench. Ming runs after it because he wants it back.', zh: '照片掉在长椅旁。明明追了过去，因为他想把它拿回来。' },
      { art: 'home|ming,grandma|photo|♥', en: '"Is this yours?" the man asks. He gives it back before the wind takes it.', zh: '「这是你的吗？」那位叔叔问。他赶在风再吹走它之前还了回来。' },
      { art: 'home|ming,grandma|photo|·', en: 'Ming says thank you. He checks the photo because he wants to be sure it is not broken.', zh: '明明道了谢。他检查了一下照片，想确认它没有弄破。' },
      { art: 'home|ming,grandma|photo|…', en: 'It is clean. He puts it deep in his bag, so the wind cannot get it again.', zh: '照片干净了。他把它放进书包深处，好让风再也吹不到。' },
      { art: 'home|ming,grandma|photo|?', en: 'Ming likes the photo. At home, he will show it to Grandma, and she will smile.', zh: '明明喜欢这张照片。回家他要拿给奶奶看，她一定会笑。' }
    ],
    quiz: [
      { q: '照片被风刮走后，是谁捡回来的？', opts: ['一位叔叔', '奶奶', '列车员'], a: 0, kind: 'recall' },
      { q: '明明把照片看得那么紧，说明什么？', opts: ['照片很贵', '他要卖掉照片', '这张照片对他很重要'], a: 2, kind: 'infer' },
      { q: '想留住一个好的时刻，你会怎么做？', opts: ['拍张照片或写下来记着', '什么也不做', '马上忘掉'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b98', lv: 'L9', tag: '观察', title: 'The Shadow in the Field', zh: '田里的影子',
    emoji: '🌾', color: '#F9DFB4',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 5 个新词（田地、影子、穿过、中午、记下）。',
    trap: 'kn / wr / ph 里的第一个字母不发音；读长句时先找主句，再读从句。',
    summary: '《田里的影子》：这是一个完整的小故事。读前先看词卡（田地、影子、穿过、中午、记下）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '不看书写一段 5 句的口头小结，再说说这件事让你想到什么。',
    think: '说说你观察过的影子变化。',
    pre: [
      { art: '🌾', en: 'field', zh: '田地' },
      { art: '🌑', en: 'shadow', zh: '影子' },
      { art: '💡', en: 'across', zh: '穿过' },
      { art: '⏰', en: 'noon', zh: '中午' },
      { art: '🏃', en: 'mark', zh: '记下' },
      { art: '☀️', en: 'sun', zh: '太阳' },
      { art: '🌿', en: 'sky', zh: '天空' }
    ],
    sight: [],
    newWords: [
      { w: 'field', zh: '田地' },
      { w: 'shadow', zh: '影子' },
      { w: 'across', zh: '穿过' },
      { w: 'noon', zh: '中午' },
      { w: 'mark', zh: '记下' }
    ],
    pages: [
      { art: 'night|lili,grandpa|shadow|·', en: 'Ming is in the field. It is a warm morning, and the sun is not high yet.', zh: '明明在田野里。这是一个暖和的早晨，太阳还没升高。' },
      { art: 'night|lili,grandpa|shadow|♪', en: 'There are no clouds in the sky, so the light is strong.', zh: '天上没有云，光很亮。' },
      { art: 'night|lili,grandpa|shadow|👀', en: 'Ming sees a shadow. It is dark on the grass, and it moves with him.', zh: '明明看见一个影子。它在草地上黑黑的，还跟着他动。' },
      { art: 'night|lili,grandpa|shadow|?', en: 'The shadow follows Ming. It stays right behind him.', zh: '影子跟着明明。就贴在他身后。' },
      { art: 'night|lili,grandpa|shadow|·', en: 'When Ming moves, it moves. He takes a step and it takes one too.', zh: '明明一动，它也动。他迈一步，它也迈一步。' },
      { art: 'night|lili,grandpa|shadow|!', en: 'The shadow is long in the morning. It goes far across the field because the sun is not high.', zh: '早晨影子很长。它一直伸到田那头，因为太阳很低。' },
      { art: 'night|lili,grandpa|shadow|♥', en: 'At noon the shadow is short. It sits right under him because the sun is high over him.', zh: '中午影子很短。它就在他脚底下，因为太阳在头顶上。' },
      { art: 'night|lili,grandpa|shadow|★', en: 'The sun is going down. The shadow grows longer again.', zh: '太阳下山了。影子又开始变长。' },
      { art: 'night|lili,grandpa|shadow|…', en: '"Why does the shadow change?" Ming asks Grandma.', zh: '「影子为什么会变？」明明问奶奶。' },
      { art: 'night|lili,grandpa|shadow|·', en: '"The sun moves," Grandma says. "The shadow goes with it."', zh: '「太阳在动，」奶奶说，「影子就跟着动。」' },
      { art: 'night|lili,grandpa|shadow|♥', en: 'Ming looks at the shadow again. Now he can see how it changes.', zh: '明明又看了看影子。现在他看明白它是怎么变的了。' },
      { art: 'night|lili,grandpa|shadow|·', en: 'Ming marks the long shadow with a stone.', zh: '明明用一块石头标出长长的影子。' },
      { art: 'night|lili,grandpa|shadow|…', en: 'Tomorrow at noon he will mark the short one.', zh: '明天中午，他再来标出短短的影子。' },
      { art: 'night|lili,grandpa|shadow|?', en: 'Then he can see both, and he will know the answer.', zh: '那时两个影子都能看见，他就明白答案了。' }
    ],
    quiz: [
      { q: '中午的时候，影子是什么样？', opts: ['拉得很长', '又短又小，就在脚底下', '看不见了'], a: 1, kind: 'recall' },
      { q: '影子为什么会变？', opts: ['因为影子自己动', '因为太阳在天上移动', '因为风大'], a: 1, kind: 'infer' },
      { q: '想弄清影子的秘密，你会怎么做？', opts: ['只看一次', '不管它', '一天里多看几次，比一比'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b99', lv: 'L9', tag: '提问', title: 'The Scientist and an Answer', zh: '科学家的答案',
    emoji: '🔬', color: '#CDE7C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 2 个新词（科学家、班）。',
    trap: 'kn / wr / ph 里的第一个字母不发音；读长句时先找主句，再读从句。',
    summary: '《科学家的答案》：这是一个完整的小故事。读前先看词卡（科学家、班）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '不看书写一段 5 句的口头小结，再说说这件事让你想到什么。',
    think: '说说一个你想弄明白的难题。',
    pre: [
      { art: '🧑', en: 'scientist', zh: '科学家' },
      { art: '📦', en: 'class', zh: '班' },
      { art: '❓', en: 'question', zh: '问题' },
      { art: '📖', en: 'book', zh: '书' }
    ],
    sight: [],
    newWords: [
      { w: 'scientist', zh: '科学家' },
      { w: 'class', zh: '班' }
    ],
    pages: [
      { art: 'library|grandma,mom|answer|·', en: 'A scientist has a question. She wants to know why a seed grows.', zh: '一位科学家有个问题。她想知道种子为什么会长。' },
      { art: 'library|grandma,mom|answer|♪', en: 'The question is hard. No book gives the answer.', zh: '这个问题很难。书上没有现成答案。' },
      { art: 'library|grandma,mom|answer|👀', en: 'The scientist looks for an answer. She puts seeds in three pots so she can compare them.', zh: '科学家寻找答案。她把种子放进三个盆，好做比较。' },
      { art: 'library|grandma,mom|answer|?', en: 'The scientist tries many times. Two pots get no water.', zh: '科学家试了很多次。有两盆没有浇水。' },
      { art: 'library|grandma,mom|answer|·', en: 'The answer is not easy. Nothing grows in two of the pots.', zh: '答案不容易。有两盆什么也没长出来。' },
      { art: 'library|grandma,mom|answer|!', en: 'The scientist does not stop. She writes down what she sees because she wants to remember.', zh: '科学家没有停。她把看到的都记下来，因为她想记住。' },
      { art: 'library|grandma,mom|answer|♥', en: 'Each day she writes a note. She keeps them all in her book.', zh: '每天都写一张纸条。她把它们都收在本子里。' },
      { art: 'library|grandma,mom|answer|★', en: 'At last, the answer comes. The wet pot has a green stem, and the others stay dry.', zh: '最后答案来了。湿的那盆长出了绿芽，别的还是干的。' },
      { art: 'library|grandma,mom|answer|…', en: 'The answer is good. Seeds need water to grow, and now she can show why.', zh: '这个答案站得住。种子需要水才能生长，现在她能说明为什么了。' },
      { art: 'library|grandma,mom|answer|·', en: 'She tells the class what she found. They look at the three pots.', zh: '她把发现讲给班上的同学听。大家看那三只花盆。' },
      { art: 'library|grandma,mom|answer|♥', en: 'Her book has three weeks of notes. She counts them with the class so they can see how long it took.', zh: '她的本子上记了三个星期。她和全班一起数，好让大家看出用了多久。' },
      { art: 'library|grandma,mom|answer|·', en: 'The two dry pots are there too. She tells the class why nothing grew in them.', zh: '两个干盆也在那儿。她告诉大家，里面为什么什么也没长。' },
      { art: 'library|grandma,mom|answer|…', en: 'Ming asks about the dry pots. She writes his question down because it is a good one.', zh: '明明问起那两盆干的。她把他的问题记下来，因为问得好。' },
      { art: 'library|grandma,mom|answer|?', en: 'Ming takes a pot home. He puts a seed in it that night.', zh: '明明带了一只盆回家。当晚就种下一粒种子。' }
    ],
    quiz: [
      { q: '哪一盆种子长出来了？', opts: ['湿的那一盆', '干的那两盆', '三盆都长了'], a: 0, kind: 'recall' },
      { q: '科学家是怎么找到答案的？', opts: ['别人给的', '试了很多次，没有停', '一次就找到了'], a: 1, kind: 'infer' },
      { q: '一个难题很久解不开，你会怎么做？', opts: ['马上放弃', '不管它', '记下来，慢慢试，不放弃'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b100', lv: 'L9', tag: '参观', title: 'A Quiet Museum', zh: '安静的博物馆',
    emoji: '🏛️', color: '#C6DEF6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 3 个新词（博物馆、以前、摸）。',
    trap: 'kn / wr / ph 里的第一个字母不发音；读长句时先找主句，再读从句。',
    summary: '《安静的博物馆》：这是一个完整的小故事。读前先看词卡（博物馆、以前、摸）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '不看书写一段 5 句的口头小结，再说说这件事让你想到什么。',
    think: '说说你在博物馆或老房子里看到的一样老东西。',
    pre: [
      { art: '🏛️', en: 'museum', zh: '博物馆' },
      { art: '⏰', en: 'ago', zh: '以前' },
      { art: '🏃', en: 'touch', zh: '摸' },
      { art: '🍲', en: 'pot', zh: '锅' },
      { art: '🏠', en: 'house', zh: '房子' }
    ],
    sight: ['stories'],
    newWords: [
      { w: 'museum', zh: '博物馆' },
      { w: 'ago', zh: '以前' },
      { w: 'touch', zh: '摸' }
    ],
    pages: [
      { art: 'street|grandpa,dad|museum|·', en: 'Ming is in a museum. It is a big old house that is quiet inside.', zh: '明明在博物馆里。那是一栋里面很安静的老房子。' },
      { art: 'street|grandpa,dad|museum|♪', en: 'The museum is quiet. People do not shout because they want to keep it that way.', zh: '博物馆很安静。人们不大声说话，因为想保持这样。' },
      { art: 'street|grandpa,dad|museum|👀', en: 'Ming walks and looks. He stays close to Grandma.', zh: '明明边走边看。他紧跟着奶奶。' },
      { art: 'street|grandpa,dad|museum|?', en: 'Old things are here. Some come from long ago, and they are very different.', zh: '这里有旧东西。有些来自很久以前，和现在很不一样。' },
      { art: 'street|grandpa,dad|museum|·', en: 'A very old pot is here. One side is broken.', zh: '这儿有一口很旧的锅。一边破了。' },
      { art: 'street|grandpa,dad|museum|!', en: 'Ming looks at the pot. He cannot touch it, so he puts his hands behind his back.', zh: '明明看着那口锅。他不能摸，所以把手背在身后。' },
      { art: 'street|grandpa,dad|museum|♥', en: 'People used it long ago. They cooked rice in it, and they ate together.', zh: '很久以前的人用它。他们在里面煮饭，一起吃。' },
      { art: 'street|grandpa,dad|museum|★', en: 'Ming thinks about them. He pictures a family at a table.', zh: '明明想着那些人。他想象一家人围在桌边。' },
      { art: 'street|grandpa,dad|museum|…', en: 'The museum keeps old things. A case keeps them safe, so people can see them for years.', zh: '博物馆收藏旧东西。玻璃柜把它们保护好，让人们多年都能看到。' },
      { art: 'street|grandpa,dad|museum|·', en: 'Grandma tells him not to run. He walks slowly because the floor is old.', zh: '奶奶叫他别跑。他慢慢走，因为地板很旧。' },
      { art: 'street|grandpa,dad|museum|♥', en: 'Old things tell stories. This pot tells one about food and family.', zh: '旧东西会讲故事。这口锅讲的是食物和家人的故事。' },
      { art: 'street|grandpa,dad|museum|·', en: 'Ming learns from them. He did not know people cooked like that.', zh: '明明从它们那儿学到东西。他不知道从前是那样做饭的。' },
      { art: 'street|grandpa,dad|museum|…', en: 'Ming wants to come back. He asks Grandma if she will bring him back again.', zh: '明明还想再来。他问奶奶，下次还能不能再带他来。' },
      { art: 'street|grandpa,dad|museum|?', en: 'The museum is a good place. He will look at the other rooms.', zh: '博物馆是个好地方。他还要去看别的展厅。' }
    ],
    quiz: [
      { q: '博物馆里那只旧盆，是什么样子？', opts: ['跟新的一样', '有一边破了', '两边都破了'], a: 1, kind: 'recall' },
      { q: '明明把手背在身后、慢慢走，是因为什么？', opts: ['奶奶让他别出声', '这里的东西很老很珍贵，要小心', '他怕黑'], a: 1, kind: 'infer' },
      { q: '在博物馆里，你会怎么做？', opts: ['乱摸乱碰', '安静看，想一想它背后的事', '大声喧哗'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b101', lv: 'L9', tag: '韵文', title: 'When the Wind Blows', zh: '风吹的时候',
    emoji: '🍃', color: '#E0CFF3',
    track: 'rhyme',
    goal: '读一首小韵文，听清每一句句末的韵脚。不引入新词，全部是读过的词。',
    trap: 'kn / wr / ph 里的第一个字母不发音；读长句时先找主句，再读从句。',
    summary: '《风吹的时候》：这是一个完整的小故事。读前先看词卡，都是学过的词；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '不看书写一段 5 句的口头小结，再说说这件事让你想到什么。',
    think: '说说风吹过你身边时的样子。',
    pre: [
      { art: '🌿', en: 'wind', zh: '风' },
      { art: '🌿', en: 'night', zh: '夜晚' }
    ],
    sight: ['eyes'],
    newWords: [

    ],
    pages: [
      { art: 'library|mom,ming|wind|·', en: 'The wind comes out to play. Ming runs with it all day.', zh: '风跑出来玩了。明明跟着它跑了一整天。' },
      { art: 'library|mom,ming|wind|♪', en: 'When the wind comes up, a leaf goes high. It rides the air up to the sky.', zh: '风一起，叶子就飞得好高。它乘着空气飞上了天。' },
      { art: 'library|mom,ming|wind|👀', en: 'Ming stops to thank the wind. He thinks the wind is good and kind.', zh: '明明停下来谢谢风。他觉得风又好又温柔。' },
      { art: 'library|mom,ming|wind|?', en: 'Ming and the wind like to run. They run together under the sun.', zh: '明明和风都爱跑。他们一起在太阳底下跑。' },
      { art: 'library|mom,ming|wind|·', en: 'Ming can see the stars at night. The moon gives just enough soft light.', zh: '夜里能看见星星。月亮洒下刚刚好的柔光。' },
      { art: 'library|mom,ming|wind|!', en: 'When night comes, the moon comes up soon. Ming looks up to find the big round moon.', zh: '夜一到，月亮很快就升起来。明明抬头找那轮又大又圆的月亮。' },
      { art: 'library|mom,ming|wind|♥', en: 'A yellow leaf starts to fall. It falls down by the trees that stand so tall.', zh: '一片黄叶子开始往下掉。它飘啊飘，飘到高高的树旁。' },
      { art: 'library|mom,ming|wind|★', en: 'The wind pushes a little ball. Across the park it looks so small.', zh: '风推着一颗小球。滚到公园那头，看着好小。' },
      { art: 'library|mom,ming|wind|…', en: 'The wind takes hold of the big old hat. It comes down just next to a black cat.', zh: '风一下子卷走了那顶大旧帽子。帽子落下来，正好掉在一只黑猫旁边。' },
      { art: 'library|mom,ming|wind|·', en: 'The wind goes through the tall green tree. Ming looks up there because he wants to see.', zh: '风穿过高高的绿树。明明抬头看，因为他想看个仔细。' },
      { art: 'library|mom,ming|wind|♥', en: 'Ming walks across the park with the wind. It goes along beside him in the dark.', zh: '明明和风一起穿过公园回家。黑夜里，风还陪在他身边。' },
      { art: 'library|mom,ming|wind|·', en: 'The wind sleeps after a long, long day. Tomorrow it will come again to play.', zh: '风睡了，长长的一天过去了。明天它还会来玩。' },
      { art: 'library|mom,ming|wind|…', en: 'The wind goes down to the ground. The whole town is quiet, without a sound.', zh: '风落到地面上。整个小镇安安静静，一点声音都没有。' },
      { art: 'library|mom,ming|wind|?', en: 'Ming closes his eyes and goes to sleep. The wind is quiet, and the night is deep.', zh: '明明闭上眼睛，睡着了。风也安静下来，夜色正浓。' }
    ],
    quiz: [
      { q: '风把什么东西吹到了黑猫旁边？', opts: ['一片黄叶子', '明明的小球', '爷爷的大旧帽子'], a: 2, kind: 'recall' },
      { q: '明明为什么觉得风又温柔又好？', opts: ['因为风把他的帽子吹走了', '因为风很大很吵', '风陪他玩了一天，又没闯祸'], a: 2, kind: 'infer' },
      { q: '大风天出门，你会先做什么准备？', opts: ['戴好帽子，把小东西拿稳', '什么都不准备', '把东西都扔到风口去'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b102', lv: 'L9', tag: '好笑', title: 'The Very Long Noodle', zh: '超长的面条',
    emoji: '🍜', color: '#F6C9E3',
    track: 'humor',
    goal: '跟着一个好笑的故事读到最后，看看笑点在哪儿。不引入新词，全部是读过的词。',
    trap: 'kn / wr / ph 里的第一个字母不发音；读长句时先找主句，再读从句。',
    summary: '《超长的面条》：这是一个完整的小故事。读前先看词卡，都是学过的词；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '不看书写一段 5 句的口头小结，再说说这件事让你想到什么。',
    think: '说说你见过的长得特别离谱的东西。',
    pre: [
      { art: '🍜', en: 'noodle', zh: '面条' },
      { art: '🍳', en: 'kitchen', zh: '厨房' }
    ],
    sight: ['laugh'],
    newWords: [

    ],
    pages: [
      { art: 'kitchen|dad,lili|noodle|·', en: 'Ming is in the kitchen with Grandma. They make noodles together on a cold day.', zh: '明明和奶奶在厨房里。天有点冷，他们一起做面条。' },
      { art: 'kitchen|dad,lili|noodle|♪', en: 'She takes one noodle and gives it a big pull. It comes out long, and she sees that it keeps going.', zh: '她拿起一根面条，使劲一拉。面条拉得老长，她发现它还没到头。' },
      { art: 'kitchen|dad,lili|noodle|👀', en: 'The noodle goes across the kitchen floor. It goes by the table and to the door.', zh: '这根面条拖过厨房的地板。它经过桌子，一直拖到门口。' },
      { art: 'kitchen|dad,lili|noodle|?', en: 'Ming takes one end of the long noodle. He cannot see Grandma, because she is way back in the kitchen.', zh: '明明抓住长面条的一头。他都看不见厨房那头的奶奶了。' },
      { art: 'kitchen|dad,lili|noodle|·', en: 'Grandma holds the noodle up high. She starts to laugh.', zh: '奶奶在厨房那头。她把面条拎起来，笑了起来。' },
      { art: 'kitchen|dad,lili|noodle|!', en: 'The cat comes to look at the noodle. She walks on it because it looks like a line.', zh: '猫咪咪过来看面条。它在面条上走来走去，因为面条像一条线。' },
      { art: 'kitchen|dad,lili|noodle|♥', en: 'Grandpa comes to the door and sees it. He laughs when he steps over the long noodle.', zh: '爷爷走到门口，看见了它。他笑着从长面条上跨过去。' },
      { art: 'kitchen|dad,lili|noodle|★', en: 'They try to put it in the pot. But the pot is too small when the noodle is this long.', zh: '他们想把面条放进锅里。可面条这么长，锅怎么装得下。' },
      { art: 'kitchen|dad,lili|noodle|…', en: 'Ming holds his end near the door. Grandma holds the other end in the kitchen.', zh: '明明拿着自己这一头，站在门口。奶奶拿着另一头，站在厨房。' },
      { art: 'kitchen|dad,lili|noodle|·', en: 'Now the noodle goes from room to room. Nothing else in the house is this long.', zh: '现在面条从一个房间拖到另一个房间。房子里再没有这么长的东西了。' },
      { art: 'kitchen|dad,lili|noodle|♥', en: 'They cannot cook it in the small pot. So they eat it where it is, end to end.', zh: '小锅煮不下它了。他们就站在原地吃，一人一头。' },
      { art: 'kitchen|dad,lili|noodle|·', en: 'Ming eats at the door on this end. Grandma eats in the kitchen at that end.', zh: '明明在门口吃这一头。奶奶在厨房吃那一头。' },
      { art: 'kitchen|dad,lili|noodle|…', en: 'Grandpa stands by the table and laughs. He says that a noodle this long is a good one.', zh: '爷爷站在桌边笑个不停。他说这么长的面条，真是好面条。' },
      { art: 'kitchen|dad,lili|noodle|?', en: 'Tomorrow Grandma will try to make a short one. Ming says the long one is more fun.', zh: '明天奶奶要做根短的试试。明明说，还是长的好玩。' }
    ],
    quiz: [
      { q: '这根面条长到什么程度？', opts: ['只有碗那么长', '从厨房一直拖到门口', '跟筷子一样长'], a: 1, kind: 'recall' },
      { q: '大家为什么笑个不停？', opts: ['因为面条很难吃', '因为锅坏掉了', '面条长得离谱，一家人还一人一头吃'], a: 2, kind: 'infer' },
      { q: '做出了一个样子怪怪的东西，你会怎么办？', opts: ['马上扔掉', '叫大家一起来看看、笑一笑', '藏起来不让别人看见'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b103', lv: 'L9', tag: '工具', title: 'How to Use a Map', zh: '怎么用地图',
    emoji: '🗺️', color: '#BFE6DF',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。认读 1 个新词（工具）。',
    trap: 'kn / wr / ph 里的第一个字母不发音；读长句时先找主句，再读从句。',
    summary: '《怎么用地图》：这一本从一件小事讲起，说说为什么会这样。读前先看词卡（工具）；读的时候留意先看到什么、为什么会这样、后来怎么弄明白。',
    retell: '合上书，按「先看到什么 → 为什么会这样 → 后来怎么弄明白」讲一遍。',
    think: '说说地图还能帮你做什么。',
    pre: [
      { art: '📦', en: 'tool', zh: '工具' },
      { art: '🗺️', en: 'map', zh: '地图' },
      { art: '🏙️', en: 'town', zh: '小镇' }
    ],
    sight: [],
    newWords: [
      { w: 'tool', zh: '工具' }
    ],
    pages: [
      { art: 'street|ming,grandma|map|·', en: 'Ming and Lili walk in a new town. They do not know the way to the park.', zh: '明明和丽丽走在一个陌生的小镇。他们不知道去公园的路。' },
      { art: 'street|ming,grandma|map|♪', en: 'Lili takes a map out of her bag. A map shows the whole town on paper.', zh: '丽丽从书包里拿出一张地图。小小一张纸，就画下了整个小镇。' },
      { art: 'street|ming,grandma|map|👀', en: 'The lines on a map are roads. A long line is a long road in the town.', zh: '地图上的线就是一条条路。长长的线，就是镇上长长的路。' },
      { art: 'street|ming,grandma|map|?', en: 'A small mark shows where you are. You can look at it before you walk.', zh: '一个小记号标出你现在的位置。走路之前，可以先看看它。' },
      { art: 'street|ming,grandma|map|·', en: 'You can follow the line to a place. If the line turns, you turn too.', zh: '顺着线走，就能走到一个地方。线拐弯，你也跟着拐弯。' },
      { art: 'street|ming,grandma|map|!', en: 'The park is far from the station. But the map shows them close together.', zh: '公园离车站很远。可在地图上，它们挨得很近。' },
      { art: 'street|ming,grandma|map|♥', en: 'Ming and Lili look at the map. They find the road that goes to the park.', zh: '明明和丽丽看着地图。他们找到了通往公园的那条路。' },
      { art: 'street|ming,grandma|map|★', en: 'They follow the road that the map shows. At the corner, they make a turn.', zh: '他们沿着地图上的那条路走。到了拐角，就转个弯。' },
      { art: 'street|ming,grandma|map|…', en: 'Sometimes they look at the map again. They look because they want to be sure of the way.', zh: '他们时不时再看看地图。看地图，是想确认没有走错。' },
      { art: 'street|ming,grandma|map|·', en: 'A map helps when the town is new to you. It helps you find a place you do not know.', zh: '去一个陌生的小镇，地图就帮上忙了。它能带你找到不认识的地方。' },
      { art: 'street|ming,grandma|map|♥', en: 'The map is small, but the town is big. You can hold the whole town in two hands.', zh: '地图小小的，小镇却大大的。整个小镇都能捧在手心里。' },
      { art: 'street|ming,grandma|map|·', en: 'At last, they see the park gate. It is just where the map shows it.', zh: '他们终于看到了公园的大门。它就在地图上那个记号的位置。' },
      { art: 'street|ming,grandma|map|…', en: 'Ming puts the map back in his bag. He keeps it there, because they will use it again.', zh: '明明把地图放回书包。他把地图收好，因为还要再用。' },
      { art: 'street|ming,grandma|map|?', en: 'A map is a good tool to have. With it, you can find any place in a new town.', zh: '地图是个好工具。带着它，陌生小镇上哪儿都找得到。' }
    ],
    quiz: [
      { q: '地图上的线代表什么？', opts: ['一根根绳子', '一条条路', '一条条河'], a: 1, kind: 'recall' },
      { q: '为什么说整个小镇能「捧在手里」？', opts: ['地图小小的，却画得下整个小镇', '因为地图是纸做的', '因为小镇本来就不大'], a: 0, kind: 'infer' },
      { q: '去一个不认识的地方，你会怎么找路？', opts: ['先看地图，顺着线慢慢走', '闭着眼睛乱走', '站在原地等别人带路'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b104', lv: 'L9', tag: '自然', title: 'Seeds Travel', zh: '种子去旅行',
    emoji: '🌰', color: '#F2E2A8',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。不引入新词，全部是读过的词。',
    trap: 'kn / wr / ph 里的第一个字母不发音；读长句时先找主句，再读从句。',
    summary: '《种子去旅行》：这一本从一件小事讲起，说说为什么会这样。读前先看词卡，都是学过的词；读的时候留意先看到什么、为什么会这样、后来怎么弄明白。',
    retell: '合上书，按「先看到什么 → 为什么会这样 → 后来怎么弄明白」讲一遍。',
    think: '说说一粒种子最想去的地方。',
    pre: [
      { art: '🌱', en: 'seed', zh: '种子' },
      { art: '🌿', en: 'ground', zh: '地面' }
    ],
    sight: ['fields'],
    newWords: [

    ],
    pages: [
      { art: 'garden|lili,grandpa|seed|·', en: 'A seed is small, but a plant can grow from it. First the seed must get to a new place.', zh: '种子小小的，却能长成一株植物。种子得先去一个新的地方。' },
      { art: 'garden|lili,grandpa|seed|♪', en: 'When a seed comes to a good place, it grows. It needs wet ground and enough sun.', zh: '种子落到好地方，就会发芽。它需要湿湿的泥土和足够的阳光。' },
      { art: 'garden|lili,grandpa|seed|👀', en: 'Some seeds are very small and light. The wind can take them a long way.', zh: '有些种子又小又轻。风能把它们带到很远的地方。' },
      { art: 'garden|lili,grandpa|seed|?', en: 'They go up high into the air. They come down after they go a long way.', zh: '它们飞上高高的天空。飞了好长一段路，才落下来。' },
      { art: 'garden|lili,grandpa|seed|·', en: 'Birds pick up seeds and drop them far away. A bird can fly all day before it drops one.', zh: '鸟儿叼起种子，又把它们丢在远处。鸟能飞上一整天，才丢下一粒。' },
      { art: 'garden|lili,grandpa|seed|!', en: 'Some seeds ride on the water. The water takes them down to a new place.', zh: '有些种子搭水的便车。水流把它们带到新的地方。' },
      { art: 'garden|lili,grandpa|seed|♥', en: 'Some seeds just fall near the big plant. Most seeds do not go very far at all.', zh: '有些种子就落在大植物旁边。大多数种子其实走不了多远。' },
      { art: 'garden|lili,grandpa|seed|★', en: 'If the ground is wet, the seed can grow. A root goes down, and a stem comes up.', zh: '土是湿的，种子就能发芽。根往下钻，茎往上冒。' },
      { art: 'garden|lili,grandpa|seed|…', en: 'A stem comes up to look for the sun. Small leaves open up over the ground.', zh: '茎冒上来，朝着太阳找。小叶子在地面上张开。' },
      { art: 'garden|lili,grandpa|seed|·', en: 'The new plant grows day by day. In time, it makes seeds of its own.', zh: '新植物一天天长。慢慢地，它也结出自己的种子。' },
      { art: 'garden|lili,grandpa|seed|♥', en: 'Then the seeds start the trip again. Some go with the wind, and some go with birds.', zh: '于是，种子又开始上路。有的跟风走，有的跟鸟走。' },
      { art: 'garden|lili,grandpa|seed|·', en: 'Seeds go far because plants need new ground. That is how plants get across the fields.', zh: '种子去远方，植物才能在新的地方扎根。绿色的生命就是这样穿过田野的。' },
      { art: 'garden|lili,grandpa|seed|…', en: 'Ming puts a seed in the garden. He wants to see it start its own trip.', zh: '明明把一粒种子种进花园。他想看着它开始自己的旅行。' },
      { art: 'garden|lili,grandpa|seed|?', en: 'Seeds are small, but they go a long way. Wind, birds, and water all help them along.', zh: '种子小小的，却能走很远的路。风、鸟和水都会帮它们的忙。' }
    ],
    quiz: [
      { q: '种子能靠什么去远方？', opts: ['只靠太阳', '只靠人', '风、鸟和水'], a: 2, kind: 'recall' },
      { q: '为什么大多数种子走不了多远？', opts: ['没有风、鸟和水带它们走', '因为它们不想离开', '因为大植物不让它们走'], a: 0, kind: 'infer' },
      { q: '想让一粒种子去远一点的地方，你可以怎么做？', opts: ['一直攥在手心里', '把它锁进盒子里', '把它种在花园边上，请风和鸟帮忙'], a: 2, kind: 'transfer' }
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
      { art: 'table|grandma,mom|knee|!', en: 'Say "knee". Say it slowly.', zh: '说 knee。慢慢说。' },
      { art: 'table|grandma,mom|knee|♥', en: 'Say "write". Say it again.', zh: '读 write。再读一遍。' },
      { art: 'table|grandma,mom|knee|★', en: 'Some letters are quiet. But they are still in the word.', zh: '有些字母不发音。可它们还在词里。' },
      { art: 'table|grandma,mom|knee|…', en: 'Knee, write, knee, write.', zh: 'knee，write，knee，write。' },
      { art: 'table|grandma,mom|knee|·', en: 'You can read both. Look at each word first, and then say it.', zh: '两个词你都能读。先看整词，再读出来。' },
      { art: 'table|grandma,mom|knee|♥', en: 'Quiet letters can be there. They are part of the word, so do not drop them when you write.', zh: '不发音的字母也在那儿。它们是词的一部分，写的时候别丢了。' },
      { art: 'table|grandma,mom|knee|·', en: 'Just read the sound. Do not read every letter, because some are quiet.', zh: '只读音。别把每个字母都读出来，因为有些是不发音的。' },
      { art: 'table|grandma,mom|knee|…', en: 'Good reading! Now you know the quiet letters.', zh: '读得好！现在你认得这些不发音的字母了。' },
      { art: 'table|grandma,mom|knee|?', en: 'Knee and write. Now say them together, and keep the quiet letters in.', zh: 'knee 和 write。现在连起来说，别把不发音的字母读出来。' }
    ],
    quiz: [
      { q: 'knee 和 write 里各有哪个字母不发音？', opts: ['两个词都有 e 不发音', '两个词都有 i 不发音', 'knee 的 k 和 write 的 w'], a: 2, kind: 'recall' },
      { q: '这两个词里什么特别？', opts: ['都很短', '都很长', '有些字母不发音'], a: 2, kind: 'infer' },
      { q: '遇到有不发音字母的单词，你会怎么读？', opts: ['每个字母都念', '读出发音的那部分，别念不发音的字母', '跳过去'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b106', lv: 'L9', tag: '小知识', title: 'Why Seasons Change', zh: '季节为什么变',
    emoji: '🍂', color: '#FAD3B6',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。认读 2 个新词（地球、朝着）。',
    trap: 'kn / wr / ph 里的第一个字母不发音；读长句时先找主句，再读从句。',
    summary: '《季节为什么变》：这一本从一件小事讲起，说说为什么会这样。读前先看词卡（地球、朝着）；读的时候留意先看到什么、为什么会这样、后来怎么弄明白。',
    retell: '合上书，按「先看到什么 → 为什么会这样 → 后来怎么弄明白」讲一遍。',
    think: '说说一年四季是怎么变的。',
    pre: [
      { art: '📦', en: 'earth', zh: '地球' },
      { art: '💡', en: 'toward', zh: '朝着' },
      { art: '☀️', en: 'sun', zh: '太阳' },
      { art: '🌻', en: 'garden', zh: '花园' }
    ],
    sight: [],
    newWords: [
      { w: 'earth', zh: '地球' },
      { w: 'toward', zh: '朝着' }
    ],
    pages: [
      { art: 'night|grandpa,dad|season|·', en: 'The seasons change. The trees tell us first, and we can see it in the leaves.', zh: '季节在变。树先告诉我们，从叶子上就能看出来。' },
      { art: 'night|grandpa,dad|season|♪', en: 'Why do seasons change?', zh: '季节为什么会变？' },
      { art: 'night|grandpa,dad|season|👀', en: 'The earth goes around the sun. It takes a whole year, so the seasons come back.', zh: '地球绕着太阳转。转一整年，所以季节会回来。' },
      { art: 'night|grandpa,dad|season|?', en: 'The earth is a little on its side. It is not up and down.', zh: '地球有一点斜。它不是直立着的。' },
      { art: 'night|grandpa,dad|season|·', en: 'So sometimes our part of the earth is toward the sun. The sun is high then, and the days are long.', zh: '所以有时我们这一面朝着太阳。那时太阳高，白天也长。' },
      { art: 'night|grandpa,dad|season|!', en: 'Sometimes our part of the earth is away from the sun. The sun is not high, so it is cold.', zh: '有时我们这一面偏开太阳。太阳不高，天就冷了。' },
      { art: 'night|grandpa,dad|season|♥', en: 'We wear thick coats then. They keep us warm.', zh: '那时我们穿上厚外套。它们让我们暖和。' },
      { art: 'night|grandpa,dad|season|★', en: 'So the seasons change. It happens every year because the earth keeps going.', zh: '所以季节会变。每年都这样，因为地球一直在转。' },
      { art: 'night|grandpa,dad|season|…', en: 'Spring, summer, fall, winter. Each one looks different, and each one brings new things.', zh: '春、夏、秋、冬。每个季节看起来都不同，都带来新东西。' },
      { art: 'night|grandpa,dad|season|·', en: 'The change is slow. The garden shows it.', zh: '变化很慢。花园里看得出来。' },
      { art: 'night|grandpa,dad|season|♥', en: 'You can see it in one tree. Watch it all year, and you will see the change.', zh: '在一棵树上就能看到。看它一整年，你就看见变化了。' },
      { art: 'night|grandpa,dad|season|·', en: 'The earth keeps going. It never stops.', zh: '地球一直转。从不停下。' },
      { art: 'night|grandpa,dad|season|…', en: 'The seasons keep changing. Next year they will come back again.', zh: '季节一直在变。明年它们还会再来。' },
      { art: 'night|grandpa,dad|season|?', en: 'Ming will mark the seasons on a board. He wants to see the change.', zh: '明明要把四季记在板上。他想亲眼看着变化。' }
    ],
    quiz: [
      { q: '季节为什么会变？', opts: ['太阳自己在动', '地球绕着太阳转，我们这一面有时朝着太阳', '风的方向在变'], a: 1, kind: 'recall' },
      { q: '我们这一面有时朝着太阳、有时偏开，所以会怎么样？', opts: ['每天都是夏天', '有时热有时冷，有了四季', '一年只有两季'], a: 1, kind: 'infer' },
      { q: '想知道自然的大变化，你会怎么做？', opts: ['观察、看书、问一问', '不管它', '随便猜'], a: 0, kind: 'transfer' }
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
      { art: '🥛', en: 'cup', zh: '杯子' },
      { art: '🌧️', en: 'rain', zh: '雨' }
    ],
    sight: [],
    newWords: [
      { w: 'knock', zh: '敲' },
      { w: 'useful', zh: '有用' }
    ],
    pages: [
      { art: 'night|mom,ming|rain|·', en: 'We want to measure the rain. Ming asks how much rain there was.', zh: '我们想量一量雨。明明问到底下了多少雨。' },
      { art: 'night|mom,ming|rain|♪', en: 'We need a way to measure. Grandma brings a cup, and she puts it on the table.', zh: '我们需要一个测量的办法。奶奶拿来一个杯子，放在桌上。' },
      { art: 'night|mom,ming|rain|👀', en: 'We put a cup outside. It stands on a stone, so the wind will not knock it over.', zh: '我们把杯子放到外面。放在石头上，免得被风吹倒。' },
      { art: 'night|mom,ming|rain|?', en: 'The rain falls in the cup. It fills up all night.', zh: '雨落进杯子里。一整夜，它慢慢积起来。' },
      { art: 'night|mom,ming|rain|·', en: 'We look at the water in the cup. Ming marks the line so we can compare later.', zh: '我们看杯里的水。明明画了条线，好以后比较。' },
      { art: 'night|mom,ming|rain|!', en: 'More rain, more water. That is how we know, and it is easy to see.', zh: '雨多，水就多。我们就这么知道，一眼就能看出。' },
      { art: 'night|mom,ming|rain|♥', en: 'Ming marks how much. He writes it down.', zh: '明明记下有多少。他把数字写下来。' },
      { art: 'night|mom,ming|rain|★', en: 'Now we can measure the rain. The cup is our tool because it shows how much rain came.', zh: '现在我们能量雨了。杯子就是我们的工具，因为它能显示下了多少。' },
      { art: 'night|mom,ming|rain|…', en: 'The next day it rains again. Ming runs outside.', zh: '第二天下雨了。明明跑到屋外。' },
      { art: 'night|mom,ming|rain|·', en: 'You need a way to measure. This way is simple, and you can do it too.', zh: '测量要有办法。这个办法很简单，你也能做。' },
      { art: 'night|mom,ming|rain|♥', en: 'A cup can be a tool. Any cup will do.', zh: '杯子也能当工具。随便哪只杯子都行。' },
      { art: 'night|mom,ming|rain|·', en: 'We will measure again tomorrow. Ming will compare the two marks so he can see the change.', zh: '明天我们再量一次。明明会比一比两道记号，看看变化。' },
      { art: 'night|mom,ming|rain|…', en: 'Rain can be measured. So can many other things.', zh: '雨可以量。很多别的东西也可以量。' },
      { art: 'night|mom,ming|rain|?', en: 'Measuring is useful. He wants to measure the snow, and he will use the same cup.', zh: '测量很有用。他想量雪，还用同一个杯子。' }
    ],
    quiz: [
      { q: '明明用什么来量雨？', opts: ['一把尺子', '一个盆', '一个杯子'], a: 2, kind: 'recall' },
      { q: '为什么把杯子放在石头上？', opts: ['放稳一点，风不容易吹倒', '石头上雨多', '杯子怕冷'], a: 0, kind: 'infer' },
      { q: '想测量一样东西，你会怎么做？', opts: ['想一个办法，用工具量一量', '随便说一个数', '不量了'], a: 0, kind: 'transfer' }
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
      { art: 'library|dad,lili|story|?', en: 'Then, there was work. He looked in every part of the park.', zh: '然后是下功夫。他找遍了公园的每个角落。' },
      { art: 'library|dad,lili|story|·', en: 'Then, there was an answer. The ball was by the gate, where he first played.', zh: '然后有了答案。球在门边，就是他一开始玩的地方。' },
      { art: 'library|dad,lili|story|!', en: 'The story has three parts. He counts them one by one.', zh: '故事有三个部分。他一个一个数。' },
      { art: 'library|dad,lili|story|♥', en: 'Ming tells the whole story. Grandma listens all the way, and she does not stop him.', zh: '明明讲整个故事。奶奶一直听着，没有打断他。' },
      { art: 'library|dad,lili|story|★', en: 'Grandma asks one more thing. She wants to hear about the ball.', zh: '奶奶又问了一处。她想听听球的事。' },
      { art: 'library|dad,lili|story|…', en: 'Ming tells the ball part again. Then Grandma asks about the park.', zh: '明明又把球的事讲了一遍。然后奶奶问起公园。' },
      { art: 'library|dad,lili|story|·', en: 'So he starts at the beginning and tells it once more.', zh: '于是他从头讲，又讲了一遍。' },
      { art: 'library|dad,lili|story|♥', en: 'This time nothing is missing.', zh: '这一次，什么都不缺了。' },
      { art: 'library|dad,lili|story|·', en: 'The whole story is clear now. Grandma smiles at him because he did it well.', zh: '整个故事清楚了。奶奶对他笑，因为他讲得好。' },
      { art: 'library|dad,lili|story|…', en: 'Grandma says she likes the end. Ming says he likes the gate part.', zh: '奶奶说她最喜欢结尾。明明说他喜欢门边那一段。' },
      { art: 'library|dad,lili|story|?', en: 'The whole story, start to end. He will tell Mom at home, and she will want to hear it too.', zh: '整个故事，从头到尾。回家他要讲给妈妈听，她也会想听。' }
    ],
    quiz: [
      { q: '奶奶后来又问起哪一段？', opts: ['球那一段', '开头那一段', '公园那一段'], a: 2, kind: 'recall' },
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
      { art: 'library|ming,grandma|question|·', en: 'But Ming still does not get it. Some of the words are strange to him, because he has never seen them before.', zh: '可明明还是不懂。有些词对他很陌生，因为他从没见过。' },
      { art: 'library|ming,grandma|question|!', en: 'Ming asks a better question. He stops and thinks first, before he says a word.', zh: '明明问了一个更好的问题。他先停下来想了想，才开口。' },
      { art: 'library|ming,grandma|question|♥', en: '"Which word is hard?" asks Ming. The question is small now, so Grandma can answer it.', zh: '「哪个词难？」明明问。问题现在变小了，奶奶答得上来。' },
      { art: 'library|ming,grandma|question|★', en: 'Grandma points to one word. It sits near the end of the line.', zh: '奶奶指着一个词。这个词靠近句尾。' },
      { art: 'library|ming,grandma|question|…', en: 'Now Ming knows where it is hard. It is just that one word, and he looks at it closely.', zh: '现在明明知道难在哪儿了。就难在那一个词，他凑近看着它。' },
      { art: 'library|ming,grandma|question|·', en: 'They talk about that one word. Grandma says it in a short sentence so he can hear it.', zh: '他们只谈那一个词。奶奶用一个短句把它说出来，好让他听清。' },
      { art: 'library|ming,grandma|question|♥', en: 'The hard part gets clear. Ming says the word out loud.', zh: '难的地方清楚了。明明把那个词念出声。' },
      { art: 'library|ming,grandma|question|·', en: 'The whole sentence is clear now. He reads it again from the start, and this time it makes sense.', zh: '整个句子现在清楚了。他从头再读一遍，这次读得通了。' },
      { art: 'library|ming,grandma|question|…', en: 'Ming looks back at his first question. It was too big to answer, and now he sees why.', zh: '明明回头看他最先问的问题。那个问题太大了，答不上来，现在他明白为什么了。' },
      { art: 'library|ming,grandma|question|?', en: 'Ming writes down the question. He puts it on a note by his desk so it stays where he can see it.', zh: '明明把问题记下来。他写在一张纸条上，放在书桌旁，免得丢了。' },
      { art: 'library|ming,grandma|question|·', en: 'Next time he will ask a small one. Then he can get an answer.', zh: '下次他会问一个小一点的问题。那样就能得到答案。' }
    ],
    quiz: [
      { q: '明明把大问题换成了哪个小问题？', opts: ['「这句话什么意思？」', '「哪个词难？」', '「这是谁写的？」'], a: 1, kind: 'recall' },
      { q: '为什么把问题问小一点，反而更容易得到答案？', opts: ['因为大问题太难写', '小问题清楚，奶奶知道该讲哪儿', '因为小问题不重要'], a: 1, kind: 'infer' },
      { q: '看不懂一段话，你会怎么做？', opts: ['整段问「这是什么意思」', '先找出具体哪个词或哪句卡住，再问', '跳过去'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b110', lv: 'L10', tag: '发现', title: 'What We Discovered', zh: '我们的发现',
    emoji: '💡', color: '#F9DFB4',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。认读 1 个新词（忘记）。',
    trap: '桥梁书按自然段读：一句里先找「谁 + 做什么」，再把修饰部分补进去。',
    summary: '《我们的发现》：这是一个完整的小故事。读前先看词卡（忘记）；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '不看书写一段 5 句的口头小结，再说说这件事让你想到什么。',
    think: '说说你通过动手弄清楚的一件事。',
    pre: [
      { art: '🏃', en: 'forget', zh: '忘记' },
      { art: '📋', en: 'board', zh: '木板' },
      { art: '☀️', en: 'sun', zh: '太阳' }
    ],
    sight: [],
    newWords: [
      { w: 'forget', zh: '忘记' }
    ],
    pages: [
      { art: 'library|lili,grandpa|plan|·', en: 'Ming wants to find out something. He wonders why one seed did not grow.', zh: '明明想弄明白一件事。他想知道为什么有一颗种子没发芽。' },
      { art: 'library|lili,grandpa|plan|♪', en: 'Ming makes a plan. He writes three steps on a board so he will not forget them.', zh: '明明定了个计划。他把三个步骤写在板上，免得忘了。' },
      { art: 'library|lili,grandpa|plan|👀', en: 'The plan says what to do. First, put seeds in two pots. One gets sun, and one does not.', zh: '计划写着该怎么做。先把种子放进两个盆。一盆晒太阳，一盆不晒。' },
      { art: 'library|lili,grandpa|plan|?', en: 'Ming follows the plan because he wants to know why.', zh: '明明照着计划做，因为他想知道为什么。' },
      { art: 'library|lili,grandpa|plan|·', en: 'Some things go well. The warm pot has a green stem.', zh: '有些事很顺利。暖和的那盆长出了绿芽。' },
      { art: 'library|lili,grandpa|plan|!', en: 'Some things do not. The other pot stays dark, because it gets no sun.', zh: '有的却不行。另一盆一直很暗，因为它晒不到太阳。' },
      { art: 'library|lili,grandpa|plan|♥', en: 'Ming does not move the pots. He wants to see what will happen.', zh: '明明不去动那两个盆。他想看看会怎么样。' },
      { art: 'library|lili,grandpa|plan|★', en: 'Ming goes on. Each morning he marks what he sees.', zh: '明明继续做。每天早上记下看到的。' },
      { art: 'library|lili,grandpa|plan|…', en: 'At last, Ming finds it out. Nothing grew in the pot with no sun.', zh: '最后，明明弄明白了。晒不到太阳的那盆里什么也没长。' },
      { art: 'library|lili,grandpa|plan|·', en: 'He writes the answer in his note. Grandma reads it. "That is a good answer," she says.', zh: '他把答案写在本子上。奶奶读了读。「这个答案很好。」她说。' },
      { art: 'library|lili,grandpa|plan|♥', en: 'He reads his first three steps again. Not one is missing, because he wrote them on the board.', zh: '他把最早写下的三步又读了一遍。一步也没忘，因为都写在板上。' },
      { art: 'library|lili,grandpa|plan|·', en: 'He draws the pot with no sun on the board. The board still makes sense.', zh: '他把晒不到太阳的那盆画在板上。板上仍然讲得通。' },
      { art: 'library|lili,grandpa|plan|…', en: 'Ming shows the two pots to Grandma.', zh: '明明把两个盆拿给奶奶看。' },
      { art: 'library|lili,grandpa|plan|?', en: 'She asks how tall the plant grew, and Ming shows her the marks.', zh: '她问这株长了多高，明明把记号指给她看。' },
      { art: 'library|lili,grandpa|plan|·', en: 'Ming writes the answer on the board. Tomorrow he will try three pots, so he can compare them.', zh: '明明把答案写在板上。明天他要试三个盆，好做比较。' }
    ],
    quiz: [
      { q: '明明最后发现两个盆的差别是什么？', opts: ['一个水多，一个水少', '一个有太阳，一个没有', '种子不一样'], a: 1, kind: 'recall' },
      { q: '明明是怎么弄清楚的？', opts: ['等别人告诉他答案', '做不通就马上换一个做法', '定了计划就照着做，每天记下看到的变化'], a: 2, kind: 'infer' },
      { q: '想弄清一件事，你会怎么做？', opts: ['订个计划，一步一步做，坚持下去', '没有计划乱做', '不弄了'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b111', lv: 'L10', tag: '思考', title: 'Two Sides of a Problem', zh: '问题的两面',
    emoji: '⚖️', color: '#CDE7C6',
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
      { art: 'library|grandma,mom|problem|·', en: 'A problem has two sides. Ming sees that at school today, when two people want one board.', zh: '一个问题有两面。今天在学校他就看见了：两个人都想要同一块板。' },
      { art: 'library|grandma,mom|problem|♪', en: 'Ming looks at one side because he wants the board too.', zh: '明明先看一面，因为他也想用那块板。' },
      { art: 'library|grandma,mom|problem|👀', en: 'It looks hard. He thinks she will not share, and he is not happy.', zh: '这一面看着很难。他觉得她不会让，心里不痛快。' },
      { art: 'library|grandma,mom|problem|?', en: 'Then Ming looks at the other side. "Why do you need it?" he asks.', zh: '接着明明看另一面。「你为什么需要它？」他问。' },
      { art: 'library|grandma,mom|problem|·', en: 'This side looks easier. "It is for our class," she says.', zh: '这一面看着容易些。「这是给我们班画的。」她说。' },
      { art: 'library|grandma,mom|problem|!', en: 'Both sides are the same problem. There is only one board, and they both need it today.', zh: '两面其实是同一个问题。只有一块板，今天两人都要用。' },
      { art: 'library|grandma,mom|problem|♥', en: 'Ming looks at the problem from both sides. Now he is not sad.', zh: '明明把这个问题的两面都看了。现在他不难过了。' },
      { art: 'library|grandma,mom|problem|★', en: 'Ming tells her about his picture. She listens.', zh: '明明把自己的画讲给她听。她听着。' },
      { art: 'library|grandma,mom|problem|…', en: 'Now the problem is clear. They can use the board in turn.', zh: '现在问题清楚了。他们可以轮流用这块板。' },
      { art: 'library|grandma,mom|problem|·', en: 'Lili draws first, then Ming. He waits and watches her work, because that was the plan.', zh: '丽丽先画，然后明明。他等着看她画，因为计划就是这么定的。' },
      { art: 'library|grandma,mom|problem|♥', en: 'Ming holds one side of the board. Lili holds the other.', zh: '明明扶住板的一边。丽丽扶住另一边。' },
      { art: 'library|grandma,mom|problem|·', en: 'They move the board near the window. The light is better there, so they can see the lines.', zh: '他们把板挪到窗边。那儿光线好，所以看得清那些线。' },
      { art: 'library|grandma,mom|problem|…', en: 'Lili finishes her part. Ming picks up the pen.', zh: '丽丽画完她那部分。明明拿起了笔。' },
      { art: 'library|grandma,mom|problem|?', en: 'The problem was not so hard. It was one board and two people, and it had a simple answer.', zh: '问题其实没那么难。一块板，两个人，答案很简单。' },
      { art: 'library|grandma,mom|problem|·', en: 'They put the picture on the wall. It has both of their names, because both of them made it.', zh: '他们把画挂在墙上。上面有两个人的名字，因为这是两人一起做的。' }
    ],
    quiz: [
      { q: '丽丽要那块板做什么？', opts: ['为班里画画', '自己玩', '写作业'], a: 0, kind: 'recall' },
      { q: '为什么从两面看有帮助？', opts: ['因为问题变小了', '因为别人帮忙了', '换个角度看，问题会变清楚'], a: 2, kind: 'infer' },
      { q: '一个问题看着很难，你会怎么做？', opts: ['只盯着一面想', '不做了', '换个角度、从另一面看看它'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b112', lv: 'L10', tag: '坚持', title: 'Tomorrow We Begin Again', zh: '明天重新开始',
    emoji: '🌅', color: '#C6DEF6',
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
      { art: 'library|grandpa,dad|promise|·', en: 'Today was a hard day. It did not go the way Ming wanted.', zh: '今天很难。这一天不顺明明的意。' },
      { art: 'library|grandpa,dad|promise|♪', en: 'Some things did not work. His kite went into a tree.', zh: '有些事没成。他的风筝还挂到了树上。' },
      { art: 'library|grandpa,dad|promise|👀', en: 'Ming feels tired. He also lost a page of his story. He will write it again tomorrow.', zh: '明明觉得累。故事还丢了一页。明天他要重写那一页。' },
      { art: 'library|grandpa,dad|promise|?', en: 'But the day is over. The sky is dark now, and the kite is still in the tree.', zh: '可这一天过去了。天黑了，风筝还在树上。' },
      { art: 'library|grandpa,dad|promise|·', en: '"Tomorrow we begin again." Grandma says it to him.', zh: '「明天我们重新开始。」奶奶对他说。' },
      { art: 'library|grandpa,dad|promise|!', en: 'Ming makes a promise before bed. He wants to try again.', zh: '睡前，明明许下一个承诺。他想再试一次。' },
      { art: 'library|grandpa,dad|promise|♥', en: 'The promise is to try again. He says it out loud so he will hear it.', zh: '这个承诺就是再试一次。他大声说出来，好让自己听见。' },
      { art: 'library|grandpa,dad|promise|★', en: 'Tomorrow is a new day. He is ready to try again.', zh: '明天是新的一天。他已经准备好再试一次。' },
      { art: 'library|grandpa,dad|promise|…', en: 'Ming rests now. He sleeps well that night because he has a plan for tomorrow.', zh: '明明现在歇着了。那晚他睡得很香，因为他为明天做了打算。' },
      { art: 'library|grandpa,dad|promise|·', en: 'Morning comes. The wind is calm.', zh: '早晨来了。风停了。' },
      { art: 'library|grandpa,dad|promise|♥', en: 'Ming keeps his promise. He gets the kite down and takes it to the park.', zh: '明明守住了承诺。他把风筝取下来，带到公园。' },
      { art: 'library|grandpa,dad|promise|·', en: 'The wind is just right. He holds the line with two hands.', zh: '风刚刚好。他两手握住线。' },
      { art: 'library|grandpa,dad|promise|…', en: 'The kite goes up on the first try. Ming laughs, and he runs with the line.', zh: '风筝第一次就飞了起来。明明笑了，拽着线跑起来。' },
      { art: 'library|grandpa,dad|promise|?', en: 'It is high over the park. Grandma is at the gate.', zh: '风筝高高地飞在公园上空。奶奶站在门口。' },
      { art: 'library|grandpa,dad|promise|·', en: '"Tomorrow we begin again," Ming says. This time he means it.', zh: '「明天我们重新开始。」明明说。这次他是当真的。' }
    ],
    quiz: [
      { q: '明明第二天重新去放风筝，结果怎么样？', opts: ['一点风也没有', '又挂到树上', '第一次就飞起来了'], a: 2, kind: 'recall' },
      { q: '明明许了什么约定？', opts: ['明天再试一次', '什么都不做', '今天就放弃'], a: 0, kind: 'infer' },
      { q: '今天做得很不顺，你会怎么做？', opts: ['一直懊恼', '休息一下，明天重新开始', '再也不做了'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b113', lv: 'L10', tag: '想象', title: 'The Book That Reads Itself', zh: '自己读书的书',
    emoji: '📖', color: '#E0CFF3',
    track: 'fantasy',
    goal: '跟着一个想象出来的故事，把来龙去脉读顺。不引入新词，全部是读过的词。',
    trap: '桥梁书按自然段读：一句里先找「谁 + 做什么」，再把修饰部分补进去。',
    summary: '《自己读书的书》：这是一个完整的小故事。读前先看词卡，都是学过的词；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '不看书写一段 5 句的口头小结，再说说这件事让你想到什么。',
    think: '说说你最想让什么东西自己做事。',
    pre: [
      { art: '📖', en: 'book', zh: '书' },
      { art: '🌿', en: 'night', zh: '夜晚' }
    ],
    sight: [],
    newWords: [

    ],
    pages: [
      { art: 'school|mom,ming|book|·', en: 'Ming keeps a book on the desk by his bed. He likes the story in it very much.', zh: '明明床边的书桌上放着一本书。他很喜欢书里的那个故事。' },
      { art: 'school|mom,ming|book|♪', en: 'When night comes, the room gets dark. The book starts to read out loud.', zh: '夜里，房间暗下来。书就开始读出声来。' },
      { art: 'school|mom,ming|book|👀', en: 'It reads word by word, nice and slow. Nobody sits by the desk at that hour.', zh: '它一个词一个词地读，不快不慢。那个点儿，书桌边没有别人。' },
      { art: 'school|mom,ming|book|?', en: 'The book turns one page and keeps reading. It reads on, because the story is not done.', zh: '书翻过一页，接着往下读。它一直读，因为故事还没完。' },
      { art: 'school|mom,ming|book|·', en: 'Mimi the cat is on the bed. She listens hard and does not move.', zh: '猫咪咪在床上。它在黑暗里竖着耳朵，一动不动。' },
      { art: 'school|mom,ming|book|!', en: 'Ming is in bed too, and he listens. He can hear every word the book says.', zh: '明明也在床上听着。书说的每一个字，他都听得见。' },
      { art: 'school|mom,ming|book|♥', en: 'The book reads the same story every night. Ming knows it well, because he listens every night.', zh: '这本书每晚读的都是同一个故事。明明早就熟了，可他每晚都听。' },
      { art: 'school|mom,ming|book|★', en: 'Sometimes it reads slowly when Ming wants to sleep. Its sound is soft, so the room stays quiet.', zh: '明明想睡觉的时候，它就慢慢读。它读得很轻，房间里安安静静。' },
      { art: 'school|mom,ming|book|…', en: 'Grandma can hear the book at night too. She thinks the story is a good one.', zh: '奶奶夜里也听得见这本书。她觉得这个故事很好。' },
      { art: 'school|mom,ming|book|·', en: 'Then she comes and stands at the door. She listens with Ming until the story is done.', zh: '她走过来，站在门口。她和明明一起，把故事听完。' },
      { art: 'school|mom,ming|book|♥', en: 'Nobody opens the book at night. It opens when the room gets dark.', zh: '夜里没有人翻开这本书。房间一暗，它自己就打开了。' },
      { art: 'school|mom,ming|book|·', en: 'One night the book reads a new story. Ming sits up after the first word.', zh: '一天夜里，书读了一个新故事。第一个字一出来，明明就坐了起来。' },
      { art: 'school|mom,ming|book|…', en: 'The new story is about a small cat. Mimi listens, and her tail goes soft and still.', zh: '新故事讲的是一只小猫。咪咪听着听着，尾巴都软软的不动了。' },
      { art: 'school|mom,ming|book|?', en: 'In the morning the book is quiet again. It sits on the desk like any other book.', zh: '早晨，书又安静下来。它放在桌上，和别的书没什么两样。' },
      { art: 'school|mom,ming|book|·', en: 'Ming does not read to the book at night. At night the book reads to him.', zh: '夜里，不是明明读书给书听。是书读给明明听。' }
    ],
    quiz: [
      { q: '这本书在什么时候读出声？', opts: ['夜里房间暗下来的时候', '早晨吃早饭的时候', '中午在教室的时候'], a: 0, kind: 'recall' },
      { q: '明明为什么不把这本书收进书包？', opts: ['夜里书还要读给他听', '因为他不喜欢这个故事', '因为这本书太重了'], a: 0, kind: 'infer' },
      { q: '如果身边的东西会自己做事，你会怎么对它？', opts: ['吓得赶紧扔掉', '轻轻放好，看看它要做什么', '装作什么都没看见'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b114', lv: 'L10', tag: '好笑', title: 'Two Hats on One Head', zh: '一个脑袋两顶帽子',
    emoji: '🎩', color: '#F6C9E3',
    track: 'humor',
    goal: '跟着一个好笑的故事读到最后，看看笑点在哪儿。不引入新词，全部是读过的词。',
    trap: '桥梁书按自然段读：一句里先找「谁 + 做什么」，再把修饰部分补进去。',
    summary: '《一个脑袋两顶帽子》：这是一个完整的小故事。读前先看词卡，都是学过的词；读的时候留意开头发生了什么、后来怎么变化、最后怎样收尾。',
    retell: '不看书写一段 5 句的口头小结，再说说这件事让你想到什么。',
    think: '说说你见过的最逗的一身穿戴。',
    pre: [
      { art: '🎩', en: 'hat', zh: '帽子' },
      { art: '✋', en: 'head', zh: '头' }
    ],
    sight: ['friends', 'laugh'],
    newWords: [

    ],
    pages: [
      { art: 'home|dad,lili|hat|·', en: 'Ming finds two hats on the bed. One is big and brown, and one is red.', zh: '明明在床上找到两顶帽子。一顶又大又是棕色的，一顶是红的。' },
      { art: 'home|dad,lili|hat|♪', en: 'He puts the red hat on his head first. Then he puts the big one on top.', zh: '他先戴上那顶红帽子。再把那顶大的摞在上面。' },
      { art: 'home|dad,lili|hat|👀', en: 'Now there are two hats on one head. They sit tall, and they will not stay still.', zh: '现在，一个脑袋上摞着两顶帽子。它们摞得老高，还老是歪来歪去。' },
      { art: 'home|dad,lili|hat|?', en: 'Ming looks in the window. He can see the hats, but not his face.', zh: '明明对着窗户看这两顶帽子。帽子看得见，脸都看不见了。' },
      { art: 'home|dad,lili|hat|·', en: 'He walks to the door with the two hats. The hat on top goes this way and that way when he walks.', zh: '他顶着两顶帽子往门口走。他一走，顶上那顶就晃来晃去。' },
      { art: 'home|dad,lili|hat|!', en: 'Grandma sees him and starts to laugh. She asks if his head is a hat shop.', zh: '奶奶一看见他就笑了。她问：「你的脑袋是家帽子店吗？」' },
      { art: 'home|dad,lili|hat|♥', en: 'Ming says one hat is for the sun. He says the other one is just for fun.', zh: '明明说，一顶是遮太阳的。另一顶嘛，就是好玩。' },
      { art: 'home|dad,lili|hat|★', en: 'Then he goes out to the street. He walks slowly, because the hats are high.', zh: '他出门走到街上。他走得很慢，因为帽子摞得高。' },
      { art: 'home|dad,lili|hat|…', en: 'A little wind comes down the street. Ming jumps and catches the hat on top with one hand.', zh: '街上吹来一阵小风。明明跳起来，一把抓住顶上那顶帽子。' },
      { art: 'home|dad,lili|hat|·', en: 'He holds the big hat in one hand. The red one stays on his head all the way.', zh: '他一手拿一顶帽子。红帽子一路都稳稳地待在头上。' },
      { art: 'home|dad,lili|hat|♥', en: 'His friends see him and laugh with him. They say that he is carrying a very big hat.', zh: '小伙伴们看见他，都跟着笑起来。他们说，他戴了好高好高的帽子。' },
      { art: 'home|dad,lili|hat|·', en: 'Ming puts both hats back on one head. He likes the way it feels to wear two hats.', zh: '明明把两顶帽子又戴回一个脑袋上。他喜欢顶着两顶帽子走路的感觉。' },
      { art: 'home|dad,lili|hat|…', en: 'At the gate, Grandpa sees the two hats that sit on one head. He says the big one is his hat.', zh: '到了大门口，爷爷看见一个脑袋上的两顶帽子。他说那顶大的是他的。' },
      { art: 'home|dad,lili|hat|?', en: 'Ming gives the big hat back to Grandpa. Grandpa wears the big hat and laughs.', zh: '明明把大帽子还给爷爷。爷爷戴上它，笑个不停。' },
      { art: 'home|dad,lili|hat|·', en: 'Grandma asks how many hats he will wear tomorrow. Ming says three, because two is never enough.', zh: '奶奶问，明天他要戴几顶帽子。明明说三顶，因为两顶怎么够。' }
    ],
    quiz: [
      { q: '明明的脑袋上戴了几顶帽子？', opts: ['两顶', '一顶', '三顶'], a: 0, kind: 'recall' },
      { q: '奶奶一见明明就笑，是为什么？', opts: ['因为帽子破了个洞', '因为他上学迟到了', '一个脑袋摞两顶帽子，样子太滑稽'], a: 2, kind: 'infer' },
      { q: '穿得和别人很不一样时，你会怎么办？', opts: ['当场就哭', '开个玩笑，自己开心就好', '把穿戴的东西全扔了'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b115', lv: 'L10', tag: '科学', title: 'Hot and Cold', zh: '热和冷',
    emoji: '🔥', color: '#BFE6DF',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。不引入新词，全部是读过的词。',
    trap: '桥梁书按自然段读：一句里先找「谁 + 做什么」，再把修饰部分补进去。',
    summary: '《热和冷》：这一本从一件小事讲起，说说为什么会这样。读前先看词卡，都是学过的词；读的时候留意先看到什么、为什么会这样、后来怎么弄明白。',
    retell: '合上书，按「先看到什么 → 为什么会这样 → 后来怎么弄明白」讲一遍。',
    think: '说说你身边摸得到的热和冷。',
    pre: [
      { art: '🌿', en: 'heat', zh: '热' },
      { art: '🌿', en: 'air', zh: '空气' }
    ],
    sight: [],
    newWords: [

    ],
    pages: [
      { art: 'library|ming,grandma|heat|·', en: 'Some things are hot, and some things are cold. You can feel hot and cold with your hands.', zh: '有些东西是热的，有些是冷的。用手就能感觉到热和冷。' },
      { art: 'library|ming,grandma|heat|♪', en: 'The sun is a big, hot thing in the sky. It gives us heat and light every day.', zh: '太阳是天上又大又热的东西。它每天都给我们热和光。' },
      { art: 'library|ming,grandma|heat|👀', en: 'Heat also comes from things that burn. When they burn, the air near them gets hot.', zh: '热也来自会烧起来的东西。它们烧起来的时候，旁边空气都变热了。' },
      { art: 'library|ming,grandma|heat|?', en: 'You can feel heat without touching a thing. Hold your hand near hot tea, and you feel it.', zh: '不碰到东西，也能感觉到热。把手放在热茶旁边，就能感觉到。' },
      { art: 'library|ming,grandma|heat|·', en: 'Grandma makes hot tea in a cup. At first the cup is too hot to hold.', zh: '奶奶泡了一杯热茶。刚开始，杯子烫得拿不住。' },
      { art: 'library|ming,grandma|heat|!', en: 'If the tea stands a long time, it gets cold. The heat goes away little by little.', zh: '茶放上很久，就慢慢凉了。热一点一点地跑掉了。' },
      { art: 'library|ming,grandma|heat|♥', en: 'Heat does not stay in one place. It goes out into the air around the cup.', zh: '热不会一直待在一个地方。它跑到杯子周围的空气里去了。' },
      { art: 'library|ming,grandma|heat|★', en: 'In winter the air is cold outside. People wear coats and a scarf to keep warm.', zh: '冬天外面的空气是冷的。人们穿上外套、围上围巾来保暖。' },
      { art: 'library|ming,grandma|heat|…', en: 'When winter comes, the sun is not so strong. The days are short, and the nights are long.', zh: '冬天一来，太阳就不那么猛了。白天变冷，黑夜变长。' },
      { art: 'library|ming,grandma|heat|·', en: 'In summer the sun is strong and high. The air is hot, and people feel it all day.', zh: '夏天的太阳又高又猛。空气热烘烘的，一整天都感觉得到。' },
      { art: 'library|ming,grandma|heat|♥', en: 'Snow is cold, and it comes in winter. When you hold snow, your hand gets cold fast.', zh: '雪是冷的，冬天才有。手一捧雪，很快就冷了。' },
      { art: 'library|ming,grandma|heat|·', en: 'Heat can go from your hand to a cold cup. The cold cup gets a little warm that way.', zh: '热能从你的手传到冷杯子上。冷杯子就这样变得有一点暖。' },
      { art: 'library|ming,grandma|heat|…', en: 'Ming likes hot soup when the air is cold. He likes cold water when summer is hot.', zh: '空气冷的时候，明明爱喝热汤。夏天热的时候，他爱喝凉水。' },
      { art: 'library|ming,grandma|heat|?', en: 'Hot and cold change all the time. Heat always goes from hot things to cold things.', zh: '热和冷总在换来换去。热总是从热的东西，往冷的东西跑。' },
      { art: 'library|ming,grandma|heat|·', en: 'Tomorrow may be hot or cold. Ming will know what to wear, because he feels the air.', zh: '明天也许热，也许冷。明明先感觉一下空气，就知道该穿什么。' }
    ],
    quiz: [
      { q: '热是从哪里来的？', opts: ['冰箱和雪', '太阳和会烧起来的东西', '冷风和冷水'], a: 1, kind: 'recall' },
      { q: '热茶放上很久为什么会变凉？', opts: ['热慢慢跑到周围的空气里去了', '因为茶越放越少', '因为杯子把热喝掉了'], a: 0, kind: 'infer' },
      { q: '冬天想让手暖起来，你会怎么做？', opts: ['穿上外套，捧一杯热的东西', '一直站在风口里', '把手插进雪堆里'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b116', lv: 'L10', tag: '科学', title: 'Sounds All Around', zh: '身边的声音',
    emoji: '🔔', color: '#F2E2A8',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。不引入新词，全部是读过的词。',
    trap: '桥梁书按自然段读：一句里先找「谁 + 做什么」，再把修饰部分补进去。',
    summary: '《身边的声音》：这一本从一件小事讲起，说说为什么会这样。读前先看词卡，都是学过的词；读的时候留意先看到什么、为什么会这样、后来怎么弄明白。',
    retell: '合上书，按「先看到什么 → 为什么会这样 → 后来怎么弄明白」讲一遍。',
    think: '说说你现在能听到的声音。',
    pre: [
      { art: '🥁', en: 'drum', zh: '鼓' },
      { art: '📦', en: 'room', zh: '房间' }
    ],
    sight: [],
    newWords: [

    ],
    pages: [
      { art: 'library|lili,grandpa|sound|·', en: 'Sounds are all around you every day. You hear them at home, at school, and in the park.', zh: '声音每天都在你身边。在家里、在学校、在公园，你都听得见。' },
      { art: 'library|lili,grandpa|sound|♪', en: 'A bird sings in the tall green tree. A bus goes by, and it makes a sound.', zh: '鸟儿在高高的绿树上唱歌。公交车开过去，也发出声音。' },
      { art: 'library|lili,grandpa|sound|👀', en: 'Where does a sound come from? It comes when something starts to move.', zh: '声音是从哪儿来的？东西一开始动，声音就来了。' },
      { art: 'library|lili,grandpa|sound|?', en: 'Hit a drum with your hand. The drum moves very fast when you hit it.', zh: '用手敲一敲鼓。你一敲，鼓面就动得飞快。' },
      { art: 'library|lili,grandpa|sound|·', en: 'The drum moves and makes a sound. When it stops, the sound stops too.', zh: '鼓一动，就发出声音。鼓一停，声音也停了。' },
      { art: 'library|lili,grandpa|sound|!', en: 'Every sound comes from something that moves. A quiet room is quiet because nothing moves.', zh: '每个声音背后，都有东西在动。房间安静，是因为什么都没动。' },
      { art: 'library|lili,grandpa|sound|♥', en: 'Sounds can be loud, and sounds can be quiet. A shout is loud, and a soft song is quiet.', zh: '声音有大有小。大声喊是响的，轻轻唱歌是轻的。' },
      { art: 'library|lili,grandpa|sound|★', en: 'Ming can hear the loud sounds across the street. He can hear the quiet ones when he is close.', zh: '响的声音，明明隔着街都听得到。轻的声音，要走近了才听得见。' },
      { art: 'library|lili,grandpa|sound|…', en: 'Sound goes through the air to your ears. You can hear a thing far away in this way.', zh: '声音穿过空气，传到你耳朵里。远处的东西，你就是这样听见的。' },
      { art: 'library|lili,grandpa|sound|·', en: 'A small bird makes a small, high sound. A big drum makes a deep and loud sound.', zh: '小鸟的声音又小又高。大鼓的声音又低又响。' },
      { art: 'library|lili,grandpa|sound|♥', en: 'When night comes, the town gets quiet. You can hear sounds from far away then.', zh: '夜里，小镇安静下来。那时，远处的声音都听得见。' },
      { art: 'library|lili,grandpa|sound|·', en: 'Ming can hear the clock in his room at night. The little sound goes on all night.', zh: '夜里，明明听得见屋里的钟。钟一下一下，小声音响个不停。' },
      { art: 'library|lili,grandpa|sound|…', en: 'Put your hands on the loud drum. You can feel the drum move under your hands.', zh: '把手放在响着的鼓上。你能感觉到鼓在手下动。' },
      { art: 'library|lili,grandpa|sound|?', en: 'All sounds, big and small, work in this way. Something moves, and you hear it.', zh: '大大小小的声音，都是这么来的。有东西在动，你就听见了。' },
      { art: 'library|lili,grandpa|sound|·', en: 'Stop and listen to the room you are in. How many sounds can you hear right now?', zh: '停下来，听听你所在的房间。现在你能听到几种声音？' }
    ],
    quiz: [
      { q: '声音是怎么来的？', opts: ['太阳一照就有了', '东西一动，声音就来了', '风一吹就有了'], a: 1, kind: 'recall' },
      { q: '为什么鼓一停，声音就跟着没了？', opts: ['鼓不动了，就没有声音', '因为鼓面破掉了', '因为耳朵被捂住了'], a: 0, kind: 'infer' },
      { q: '想听清远处很轻的声音，你会怎么做？', opts: ['不停地说说笑笑', '大声唱歌', '安安静静，仔细听'], a: 2, kind: 'transfer' }
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
    sight: ['eyes', 'thought'],
    newWords: [
      { w: 'team', zh: '队伍' },
      { w: 'reason', zh: '原因' },
      { w: 'pace', zh: '节奏' }
    ],
    pages: [
      { art: 'table|grandma,mom|reason|·', en: 'A whole sentence has words. You can count them.', zh: '一个整句由词组成。你可以数一数。' },
      { art: 'table|grandma,mom|reason|♪', en: 'But a sentence is not just words. The words work as a team.', zh: '可句子不只是词。这些词是一个团队。' },
      { art: 'table|grandma,mom|reason|👀', en: 'Each word has its place. Together they say one thing.', zh: '每个词都有自己的位置。合起来，它们说出一件事。' },
      { art: 'table|grandma,mom|reason|?', en: 'Some words come first, and others come after. The order helps you read.', zh: '有的词在前，有的词在后。顺序能帮你读好。' },
      { art: 'table|grandma,mom|reason|·', en: 'Together, they make sense; alone, they are not enough. Try it both ways.', zh: '合起来才讲得通；单独一个词不够。两种都试试。' },
      { art: 'table|grandma,mom|reason|!', en: 'Read the whole sentence. Do not stop at each word, because that breaks the thought.', zh: '读完整的句子。不要一个词一停，那会把意思拆断。' },
      { art: 'table|grandma,mom|reason|♥', en: 'Let your eyes go on to the end of the line.', zh: '让眼睛一直看到这一行的末尾。' },
      { art: 'table|grandma,mom|reason|★', en: 'Say the whole sentence. Say it from start to end, and keep the words together.', zh: '说整个句子。从头说到尾，把词连在一起。' },
      { art: 'table|grandma,mom|reason|…', en: 'The reason is simple. A sentence is one idea, so read it as one.', zh: '道理很简单。一个句子就是一个意思，所以要整句读。' },
      { art: 'table|grandma,mom|reason|·', en: 'When the words stay together, the thought stays whole.', zh: '词连在一起，意思才完整。' },
      { art: 'table|grandma,mom|reason|♥', en: 'Read it as one. Then it is easy to understand, because the words help each other.', zh: '把它当一个整体读。这样就容易懂，因为词与词互相帮衬。' },
      { art: 'table|grandma,mom|reason|·', en: 'You can say it well. Try this long one, and read it to the end.', zh: '你能说好。试试这个长句，中间别停。' },
      { art: 'table|grandma,mom|reason|…', en: 'Good reading! Try it again, slower.', zh: '读得真好！再慢一点读一遍。' },
      { art: 'table|grandma,mom|reason|?', en: 'A whole sentence. Now listen to the pace of the words.', zh: '一整句。现在听听词的节奏。' },
      { art: 'table|grandma,mom|reason|·', en: 'Read it all at once, and keep the words together.', zh: '一口气读下来，把词连在一起。' }
    ],
    quiz: [
      { q: '这一本要你怎么读句子？', opts: ['读得越快越好', '整句连着读，不要一个词一个词读', '只读认识的词'], a: 1, kind: 'recall' },
      { q: '为什么不该一个词一个词读？', opts: ['词是合在一起的，要当一个整体读', '因为词太长', '因为会读错'], a: 0, kind: 'infer' },
      { q: '读一个长句子，你会怎么读？', opts: ['一个词一个词蹦', '把它当一个整体，连起来读', '只读一半'], a: 1, kind: 'transfer' }
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
      { art: 'library|grandpa,dad|answer|·', en: 'Practice makes us better. Ming sees it when he writes.', zh: '练习让我们进步。明明写字的时候就看见了。' },
      { art: 'library|grandpa,dad|answer|♪', en: 'But why does practice work? Ming wants to know.', zh: '可练习为什么有用？明明想知道。' },
      { art: 'library|grandpa,dad|answer|👀', en: 'When we practice, the brain learns. It remembers what we do again and again.', zh: '我们一练习，脑子就在学。它把我们反复做的事记下来。' },
      { art: 'library|grandpa,dad|answer|?', en: 'Doing it again makes a path. The path is in your brain, and it gets strong with use.', zh: '反复做会走出一条路。这条路在你大脑里，越用越结实。' },
      { art: 'library|grandpa,dad|answer|·', en: 'The path gets easy to follow. Your hand knows what comes next, before you think.', zh: '这条路越来越好走。你的手在你思考之前就知道下一步。' },
      { art: 'library|grandpa,dad|answer|!', en: 'Practice is the answer. Ming practices writing his name because he wants it to look good.', zh: '练习就是答案。明明练写自己的名字，因为他想写好看。' },
      { art: 'library|grandpa,dad|answer|♥', en: 'Ming practices every day. At first the letters are not even.', zh: '明明每天练。一开始字母写得歪歪扭扭。' },
      { art: 'library|grandpa,dad|answer|★', en: 'It gets easier and easier. By the end of the week they look good.', zh: '写着写着就容易了。到周末已经写得好看了。' },
      { art: 'library|grandpa,dad|answer|…', en: 'He shows Grandma the two pages. She can see the change.', zh: '他把前后两页给奶奶看。奶奶看出了变化。' },
      { art: 'library|grandpa,dad|answer|·', en: 'Practice is not just doing. It is doing it again with care, and that is what makes it work.', zh: '练习不只是做。是用心地再做一遍，这才让它起作用。' },
      { art: 'library|grandpa,dad|answer|♥', en: 'That is why practice works. The path is there when he needs it.', zh: '所以练习才有用。需要的时候，这条路就在那儿。' },
      { art: 'library|grandpa,dad|answer|·', en: 'Ming keeps practicing. He writes three lines each day, and the lines look better.', zh: '明明继续练。他每天写三行，这些行看着好多了。' },
      { art: 'library|grandpa,dad|answer|…', en: 'The path is strong now. He does not have to think hard when he writes.', zh: '这条路现在很结实。他写的时候不用费劲想。' },
      { art: 'library|grandpa,dad|answer|?', en: 'Practice works. His name looks different now, and he can see the change.', zh: '练习有用。他的名字现在看起来不一样了，变化他看得见。' },
      { art: 'library|grandpa,dad|answer|·', en: 'Keep practicing. Tomorrow he will try a new word because the old one is easy now.', zh: '继续练。明天他要试一个新词，因为旧的现在很容易了。' }
    ],
    quiz: [
      { q: '明明练写名字，一个星期后怎么样？', opts: ['还是歪歪扭扭', '写得好看多了', '不想再练了'], a: 1, kind: 'recall' },
      { q: '练习为什么有用？', opts: ['反复做，脑子会走出一条好走的路', '因为练习很快', '因为别人看着'], a: 0, kind: 'infer' },
      { q: '练一样东西觉得没进步，你会怎么做？', opts: ['换一样', '继续练，它在慢慢成路', '不练了'], a: 1, kind: 'transfer' }
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
      { art: 'library|mom,ming|future|·', en: 'Some work takes a long time. Ming thinks about the future, when the book will be done.', zh: '有些事要花很长时间。明明想到了将来——书做完的那天。' },
      { art: 'library|mom,ming|future|♪', en: 'He wants to make a picture book because he likes to paint.', zh: '他想做一本图画书，因为他喜欢画画。' },
      { art: 'library|mom,ming|future|👀', en: 'One day is not enough for all of it. He paints one page.', zh: '他不在一天里做完。他一天画一页。' },
      { art: 'library|mom,ming|future|?', en: 'The next day he paints one more and keeps the same pace. The book grows page by page.', zh: '第二天他再画一页，保持同样的节奏。书一页一页变厚。' },
      { art: 'library|mom,ming|future|·', en: 'Each page takes a short time. He looks at it slowly before he starts the next.', zh: '每页花的时间不长。他慢慢看一遍，再开始下一页。' },
      { art: 'library|mom,ming|future|!', en: 'One day he paints too fast. The green leaf looks wrong.', zh: '有一天他画得太快。绿叶画得不对。' },
      { art: 'library|mom,ming|future|♥', en: 'He paints that page again. The slow one looks better.', zh: '他把那页重画了一遍。慢工画出来的更好看。' },
      { art: 'library|mom,ming|future|★', en: 'Painting it again takes more time. But he does not mind.', zh: '重画更费时间。可他不在乎。' },
      { art: 'library|mom,ming|future|…', en: 'Grandma comes in. She looks at the pages in the order he painted them.', zh: '奶奶走进来。她按他画画的顺序翻看这些页。' },
      { art: 'library|mom,ming|future|·', en: 'The book gets thick. There are many pages now, and he counts them.', zh: '书变厚了。现在已经有很多页，他数了数。' },
      { art: 'library|mom,ming|future|♥', en: 'Ming does not rush. He paints one page each day.', zh: '明明不赶。每天只画一页。' },
      { art: 'library|mom,ming|future|·', en: 'Each small page is part of the whole. Each one has its place.', zh: '每一小页都是整本的一部分。每一页都有自己的位置。' },
      { art: 'library|mom,ming|future|…', en: 'Ming paints the last page. He puts the book together, and it looks like a book from a shop.', zh: '明明画完最后一页。他把书装订起来，看起来像店里卖的书。' },
      { art: 'library|mom,ming|future|?', en: 'He shows it to his class. They look at every page, and they ask how long it took.', zh: '他拿给班里看。大家一页页翻，还问做了多久。' },
      { art: 'library|mom,ming|future|·', en: 'Lili wants one of her own. Ming gives her a pen.', zh: '丽丽也想要一本。明明递给她一支笔。' }
    ],
    quiz: [
      { q: '明明画得太快的那一页后来怎么了？', opts: ['大家都说好', '被丽丽拿走了', '画得不对，只好重画'], a: 2, kind: 'recall' },
      { q: '为什么赶着画反而更费时间？', opts: ['因为慢就不用画了', '因为笔不够好', '画快了容易出错，重画更费工夫'], a: 2, kind: 'infer' },
      { q: '有一件很大的事要做，你会怎么安排？', opts: ['一天全赶完', '放着不做', '分成小份，每天稳稳做一点'], a: 2, kind: 'transfer' }
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
      { art: 'library|dad,lili|idea|♪', en: 'At first, it is not clear. He can only say a few words.', zh: '一开始它不清楚。他只能说出几个词。' },
      { art: 'library|dad,lili|idea|👀', en: 'Ming tells Lili about it. They stand at the gate, and he talks with his hands.', zh: '明明把这事讲给丽丽听。两人站在门口，他一边说一边比划。' },
      { art: 'library|dad,lili|idea|?', en: 'The idea gets clearer. She asks where the books will go.', zh: '想法变清楚了。她问书要放在哪儿。' },
      { art: 'library|dad,lili|idea|·', en: 'Ming writes it down and draws a small plan on paper. The paper is small, but it is clear.', zh: '明明写下来，在纸上画了个小计划。纸不大，可画得清楚。' },
      { art: 'library|dad,lili|idea|!', en: 'The whole idea is there: a box, a board, and books. He smiles at it.', zh: '整个想法都在那儿了：一个箱子、一块板、还有书。他看着它笑了。' },
      { art: 'library|dad,lili|idea|♥', en: 'It takes time to grow. Each day he adds one small part.', zh: '想法需要时间长大。每天添上一小处。' },
      { art: 'library|dad,lili|idea|★', en: 'But the idea is whole. Nothing important is missing, and he can explain it in three words.', zh: '可这个想法是完整的。要紧的都没漏，他三个词就能说清。' },
      { art: 'library|dad,lili|idea|…', en: 'He shows the plan to his teacher. She asks two questions.', zh: '他把计划拿给老师看。老师问了两个问题。' },
      { art: 'library|dad,lili|idea|·', en: 'She suggests one more thing. A small light, so people can read when it is dark.', zh: '她又提了一条。装一盏小灯，光线暗的时候也能看书。' },
      { art: 'library|dad,lili|idea|♥', en: 'Ming keeps the paper safe. His idea is on it.', zh: '明明把那张纸收好。他的想法就画在上面。' },
      { art: 'library|dad,lili|idea|·', en: 'The idea will help others. The class can share the books, so everyone reads more.', zh: '这个想法能帮到别人。班里可以一起分享这些书，于是人人读得更多。' },
      { art: 'library|dad,lili|idea|…', en: 'The whole idea, start to end. They build the corner that week.', zh: '完整的想法，从头到尾。那个星期他们把读书角做起来了。' },
      { art: 'library|dad,lili|idea|?', en: 'It began as just three words. Now the corner has a name.', zh: '这一切从短短三个词开始。现在那个角落有了名字。' },
      { art: 'library|dad,lili|idea|·', en: 'Lili paints the name on the board. Ming puts the first book in, and the corner is ready.', zh: '丽丽把名字画在板上。明明放进第一本书，读书角就成了。' }
    ],
    quiz: [
      { q: '他们最后把读书角建在哪儿？', opts: ['图书馆', '班里', '家里'], a: 1, kind: 'recall' },
      { q: '想法是怎么变清楚的？', opts: ['一下就想清楚了', '说着说着、写着写着，慢慢清楚了', '别人给的'], a: 1, kind: 'infer' },
      { q: '有一个想法但还很模糊，你会怎么做？', opts: ['马上丢掉', '不说', '说出来、写下来，让它慢慢清楚'], a: 2, kind: 'transfer' }
    ]
  }
];

window.BOOKS = BOOKS;
