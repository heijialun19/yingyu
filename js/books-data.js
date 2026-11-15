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
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「找回来」这条线，认读 5 个新词。',
    trap: '这一级是整体认读：词不用拼，先听整句，再跟着说；别一个字母一个字母念。',
    summary: '《我的帽子》是「找回来」：明明和奶奶在家，围绕帽子把一件事读到底。本本词卡：帽子、笔、图画、苹果、宝宝。读前先看词卡，读完合上书说一说。',
    retell: '看图说词：指一指，用英文大声说出这一页的东西。（这一本是「找回来」。）',
    think: '说一说你有没有把东西放忘了的时候：先说在哪儿丢的，再说最后在哪儿找到。',
    pre: [
      { art: '🎩', en: 'hat', zh: '帽子' },
      { art: '🖊️', en: 'pen', zh: '笔' },
      { art: '🖼️', en: 'picture', zh: '图画' },
      { art: '🍎', en: 'apple', zh: '苹果' },
      { art: '👶', en: 'baby', zh: '宝宝' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'is', zh: 'is' }
    ],
    sight: [],
    newWords: [
      { w: 'hat', zh: '帽子' },
      { w: 'pen', zh: '笔' },
      { w: 'picture', zh: '图画' },
      { w: 'apple', zh: '苹果' },
      { w: 'baby', zh: '宝宝' }
    ],
    pages: [
      { art: 'home|ming,grandma|hat|·', en: 'Ming and Grandma are at home.', zh: '明明和奶奶在家。' },
      { art: 'home|ming,grandma|hat|♪', en: 'Ming wants a hat.', zh: '明明想要帽子。' },
      { art: 'home|ming,grandma|hat|👀', en: 'They look at the pen and the picture. We say hat, apple and baby.', zh: '他们看看笔和图画。我们说一说：帽子、苹果和宝宝。' },
      { art: 'home|ming,grandma|hat|?', en: '"Where is my hat?" asks Ming.', zh: '「我的帽子呢？」明明问。' },
      { art: 'home|ming,grandma|hat|★', en: 'There it is! The hat was at home all along. Here is a hat. Here is an apple.', zh: '在那儿！帽子一直在家。这是帽子，这是苹果。' },
      { art: 'home|ming,grandma|hat|·', en: 'They put the hat back where it belongs.', zh: '他们把帽子放回原处。' }
    ],
    quiz: [
      { q: '明明和奶奶的这一本里，出现了下面哪一样？', opts: ['书包', '鸡蛋', '帽子'], a: 2, kind: 'recall' },
      { q: '读到最后之前，你猜明明他们接下来会怎么样？', opts: ['回头再慢慢找一遍，就在家找到了', '把东西丢下不管了', '跳过中间那几页'], a: 0, kind: 'infer' },
      { q: '如果你的帽子找不到了，你会先做什么？', opts: ['先回到最开始的地方慢慢找一遍', '不找了，直接走开', '马上再买一个新的'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b2', lv: 'L1', tag: '宠物', title: 'My Cat', zh: '我的猫',
    emoji: '🐱', color: '#F9DFB4',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「帮个忙」这条线，认读 3 个新词。',
    trap: '这一级是整体认读：词不用拼，先听整句，再跟着说；别一个字母一个字母念。',
    summary: '《我的猫》是「帮个忙」：丽丽和爷爷在家，围绕猫把一件事读到底。本本词卡：猫、鸟、蓝色。读前先看词卡，读完合上书说一说。',
    retell: '看图说词：指一指，用英文大声说出这一页的东西。（这一本是「帮个忙」。）',
    think: '说一次你请人帮忙的经历：开口之前你卡在哪儿？对方先看出了什么？',
    pre: [
      { art: '🐱', en: 'cat', zh: '猫' },
      { art: '🐦', en: 'bird', zh: '鸟' },
      { art: '🔵', en: 'blue', zh: '蓝色' },
      { art: '📦', en: 'is', zh: 'is' },
      { art: '👧', en: 'lili', zh: '丽丽' }
    ],
    sight: [],
    newWords: [
      { w: 'cat', zh: '猫' },
      { w: 'bird', zh: '鸟' },
      { w: 'blue', zh: '蓝色' }
    ],
    pages: [
      { art: 'home|lili,grandpa|cat|·', en: 'Lili is at home with a cat.', zh: '丽丽带着猫在家。' },
      { art: 'home|lili,grandpa|cat|♪', en: 'Lili wants to do it alone.', zh: '丽丽想自己一个人做。' },
      { art: 'home|lili,grandpa|cat|👀', en: 'The cat is too much for one pair of hands. We say bird, blue and cat.', zh: '一个人搬不动这个猫。我们说一说：鸟、蓝色和猫。' },
      { art: 'home|lili,grandpa|cat|?', en: '"Can you help me?" asks Lili.', zh: '「能帮我一下吗？」丽丽问。' },
      { art: 'home|lili,grandpa|cat|★', en: 'Now the cat moves easily. Here is a bird. Here is a blue.', zh: '这下猫轻轻就动了。这是鸟，这是蓝色。' },
      { art: 'home|lili,grandpa|cat|·', en: 'Next time they will look around first.', zh: '下次他们会先看看四周。' }
    ],
    quiz: [
      { q: '在家读的这一本里，有下面哪一样？', opts: ['杯子', '鸟', '妈妈'], a: 1, kind: 'recall' },
      { q: '读到最后之前，你猜丽丽他们接下来会怎么样？', opts: ['换一本书不读了', '先看看四周，挪开挡路的东西就成了', '一直重复原来那个动作'], a: 1, kind: 'infer' },
      { q: '两个人一起使劲还是搬不动猫，你会怎么做？', opts: ['叫更多人一起使劲', '先停一下，看看是不是有别的东西挡着', '就这么算了'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b3', lv: 'L1', tag: '颜色', title: 'Red and Blue', zh: '红和蓝',
    emoji: '🎨', color: '#CDE7C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「问一问」这条线，认读 2 个新词。',
    trap: '这一级是整体认读：词不用拼，先听整句，再跟着说；别一个字母一个字母念。',
    summary: '《红和蓝》是「问一问」：奶奶和妈妈在家，围绕红色把一件事读到底。本本词卡：鸡蛋、鱼。读前先看词卡，读完合上书说一说。',
    retell: '看图说词：指一指，用英文大声说出这一页的东西。（这一本是「问一问」。）',
    think: '回想一次「问了还是没懂」：把当时的问题改成一个更小的、指着某个词的问题。',
    pre: [
      { art: '🥚', en: 'egg', zh: '鸡蛋' },
      { art: '🐟', en: 'fish', zh: '鱼' },
      { art: '📦', en: 'is', zh: 'is' },
      { art: '👵', en: 'grandma', zh: '奶奶' }
    ],
    sight: [],
    newWords: [
      { w: 'egg', zh: '鸡蛋' },
      { w: 'fish', zh: '鱼' }
    ],
    pages: [
      { art: 'home|grandma,mom|red|·', en: 'Grandma is reading the word "red" at home.', zh: '奶奶在家读「red」这个词。' },
      { art: 'home|grandma,mom|red|♪', en: 'Grandma wants to understand it.', zh: '奶奶想把它弄明白。' },
      { art: 'home|grandma,mom|red|👀', en: 'One sentence does not make sense. We say red, egg and fish.', zh: '有一句怎么也读不通。我们说一说：红色、鸡蛋和鱼。' },
      { art: 'home|grandma,mom|red|?', en: '"What does this part mean?" asks Grandma.', zh: '「这一段什么意思？」奶奶问。' },
      { art: 'home|grandma,mom|red|★', en: 'Now the whole sentence is clear. Here is a red. Here is an egg.', zh: '这下整句都清楚了。这是红色，这是鸡蛋。' },
      { art: 'home|grandma,mom|red|·', en: 'They write down one new question.', zh: '他们又写下一个新问题。' }
    ],
    quiz: [
      { q: '这一本里，奶奶看到了下面哪一样？', opts: ['鱼', '鸭子', '天空'], a: 0, kind: 'recall' },
      { q: '读到最后之前，你猜奶奶他们接下来会怎么样？', opts: ['只把中文看一遍', '指着自己不懂的那个词再问一遍，就明白了', '把东西丢下不管了'], a: 1, kind: 'infer' },
      { q: '别人把「red」解释完你还是没懂，你会怎么做？', opts: ['指出具体哪个词不懂，再问一遍', '点点头装作懂了', '把整段跳过去'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b4', lv: 'L1', tag: '吃饭', title: 'I Eat', zh: '我吃东西',
    emoji: '🍚', color: '#C6DEF6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「说出名字」这条线，认读 3 个新词。',
    trap: '这一级是整体认读：词不用拼，先听整句，再跟着说；别一个字母一个字母念。',
    summary: '《我吃东西》是「说出名字」：爷爷和爸爸在家，围绕米饭把一件事读到底。本本词卡：米饭、公园、猪。读前先看词卡，读完合上书说一说。',
    retell: '看图说词：指一指，用英文大声说出这一页的东西。（这一本是「说出名字」。）',
    think: '挑米饭和书，各说一个英文词，再各说一句完整的话把它们放进去。',
    pre: [
      { art: '🍚', en: 'rice', zh: '米饭' },
      { art: '🏞️', en: 'park', zh: '公园' },
      { art: '🐷', en: 'pig', zh: '猪' },
      { art: '📦', en: 'and', zh: 'and' },
      { art: '📦', en: 'at', zh: 'at' }
    ],
    sight: [],
    newWords: [
      { w: 'rice', zh: '米饭' },
      { w: 'park', zh: '公园' },
      { w: 'pig', zh: '猪' }
    ],
    pages: [
      { art: 'home|grandpa,dad|rice|·', en: 'Grandpa and Dad are at home.', zh: '爷爷和爸爸在家。' },
      { art: 'home|grandpa,dad|rice|♪', en: 'They want to name what they see.', zh: '他们想把看见的东西说出名字。' },
      { art: 'home|grandpa,dad|rice|👀', en: 'Grandpa points at some rice. We say park, pig and rice.', zh: '爷爷指着米饭。我们说一说：公园、猪和米饭。' },
      { art: 'home|grandpa,dad|rice|?', en: '"What is the English word?" asks Dad.', zh: '「英文怎么说？」爸爸问。' },
      { art: 'home|grandpa,dad|rice|★', en: 'Now "rice" sounds right. Here is a park. Here is a pig.', zh: '这下「rice」说对了。这是公园，这是猪。' },
      { art: 'home|grandpa,dad|rice|·', en: 'They point at a book and start again.', zh: '他们指着书，又从头来。' }
    ],
    quiz: [
      { q: '爷爷和爸爸的这一本里，出现了下面哪一样？', opts: ['米饭', '明明', '苹果'], a: 0, kind: 'recall' },
      { q: '读到最后之前，你猜爷爷他们接下来会怎么样？', opts: ['先听整句，再跟着说一遍就说顺了', '把东西丢下不管了', '换一本书不读了'], a: 0, kind: 'infer' },
      { q: '遇到像「rice」这样会说但说不顺的英文词，你会怎么做？', opts: ['只看中文意思', '先听整句，再跟着把整句说一遍', '把这个词跳过去'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b5', lv: 'L1', tag: '上学', title: 'My Bag', zh: '我的书包',
    emoji: '🎒', color: '#E0CFF3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「帮个忙」这条线，认读 3 个新词。',
    trap: '这一级是整体认读：词不用拼，先听整句，再跟着说；别一个字母一个字母念。',
    summary: '《我的书包》是「帮个忙」：妈妈和明明在学校，围绕书包把一件事读到底。本本词卡：书包、树、水。读前先看词卡，读完合上书说一说。',
    retell: '看图说词：指一指，用英文大声说出这一页的东西。（这一本是「帮个忙」。）',
    think: '说一次你请人帮忙的经历：开口之前你卡在哪儿？对方先看出了什么？',
    pre: [
      { art: '🎒', en: 'bag', zh: '书包' },
      { art: '🌳', en: 'tree', zh: '树' },
      { art: '💧', en: 'water', zh: '水' },
      { art: '📦', en: 'is', zh: 'is' },
      { art: '👩', en: 'mom', zh: '妈妈' }
    ],
    sight: [],
    newWords: [
      { w: 'bag', zh: '书包' },
      { w: 'tree', zh: '树' },
      { w: 'water', zh: '水' }
    ],
    pages: [
      { art: 'school|mom,ming|bag|·', en: 'Mom is at school with a bag.', zh: '妈妈带着书包在学校。' },
      { art: 'school|mom,ming|bag|♪', en: 'Mom wants to do it alone.', zh: '妈妈想自己一个人做。' },
      { art: 'school|mom,ming|bag|👀', en: 'The bag is too much for one pair of hands. We say bag, tree and water.', zh: '一个人搬不动这个书包。我们说一说：书包、树和水。' },
      { art: 'school|mom,ming|bag|?', en: '"Can you help me?" asks Mom.', zh: '「能帮我一下吗？」妈妈问。' },
      { art: 'school|mom,ming|bag|★', en: 'Now the bag moves easily. Here is a bag. Here is a tree.', zh: '这下书包轻轻就动了。这是书包，这是树。' },
      { art: 'school|mom,ming|bag|·', en: 'Next time they will look around first.', zh: '下次他们会先看看四周。' }
    ],
    quiz: [
      { q: '在学校读的这一本里，有下面哪一样？', opts: ['书', '米饭', '树'], a: 2, kind: 'recall' },
      { q: '读到最后之前，你猜妈妈他们接下来会怎么样？', opts: ['先看看四周，挪开挡路的东西就成了', '只把中文看一遍', '换一本书不读了'], a: 0, kind: 'infer' },
      { q: '两个人一起使劲还是搬不动书包，你会怎么做？', opts: ['叫更多人一起使劲', '先停一下，看看是不是有别的东西挡着', '就这么算了'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b6', lv: 'L1', tag: '天气', title: 'The Sun', zh: '太阳',
    emoji: '☀️', color: '#F6C9E3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「跟读整句」这条线，认读 4 个新词。',
    trap: '这一级是整体认读：词不用拼，先听整句，再跟着说；别一个字母一个字母念。',
    summary: '《太阳》是「跟读整句」：爸爸和丽丽在公园，围绕太阳把一件事读到底。本本词卡：太阳、狗、鸭子、风筝。读前先看词卡，读完合上书说一说。',
    retell: '看图说词：指一指，用英文大声说出这一页的东西。（这一本是「跟读整句」。）',
    think: '挑书里最长的一句英文，先听整句，再分成两段读给家长听。',
    pre: [
      { art: '☀️', en: 'sun', zh: '太阳' },
      { art: '🐶', en: 'dog', zh: '狗' },
      { art: '🦆', en: 'duck', zh: '鸭子' },
      { art: '🪁', en: 'kite', zh: '风筝' },
      { art: '📦', en: 'a', zh: 'a' },
      { art: '📦', en: 'the', zh: 'the' }
    ],
    sight: ['park'],
    newWords: [
      { w: 'sun', zh: '太阳' },
      { w: 'dog', zh: '狗' },
      { w: 'duck', zh: '鸭子' },
      { w: 'kite', zh: '风筝' }
    ],
    pages: [
      { art: 'park|dad,lili|sun|·', en: 'Dad opens a book in the park.', zh: '爸爸在公园翻开一本书。' },
      { art: 'park|dad,lili|sun|♪', en: 'Dad wants to read it out loud.', zh: '爸爸想把它读出来。' },
      { art: 'park|dad,lili|sun|👀', en: 'The sentence with the word "sun" is long. We say sun, dog and duck.', zh: '带着「sun」这个词的那一句很长。我们说一说：太阳、狗和鸭子。' },
      { art: 'park|dad,lili|sun|?', en: '"Where do I stop for breath?" asks Dad.', zh: '「在哪里换气？」爸爸问。' },
      { art: 'park|dad,lili|sun|★', en: 'Now it sounds like one sentence. Here is a sun. Here is a dog.', zh: '这下听起来像一整句了。这是太阳，这是狗。' },
      { art: 'park|dad,lili|sun|·', en: 'They try the next sentence about a kite.', zh: '他们接着试讲风筝的下一句。' }
    ],
    quiz: [
      { q: '这一本里，爸爸看到了下面哪一样？', opts: ['奶奶', '公园', '宝宝'], a: 1, kind: 'recall' },
      { q: '读到最后之前，你猜爸爸他们接下来会怎么样？', opts: ['只把中文看一遍', '跳过中间那几页', '听完整句、分成两段读，就连贯了'], a: 2, kind: 'infer' },
      { q: '遇到像「sun」那一句这样很长的英文句子，你会怎么读？', opts: ['一个词一个词慢慢拼', '先听整句，再按意思分成两三段读', '只看中文跳过英文'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b7', lv: 'L1', tag: '比一比', title: 'Big and Small', zh: '大和小',
    emoji: '🐘', color: '#BFE6DF',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「修好它」这条线，认读 4 个新词。',
    trap: '这一级是整体认读：词不用拼，先听整句，再跟着说；别一个字母一个字母念。',
    summary: '《大和小》是「修好它」：明明和奶奶在操场，围绕球把一件事读到底。本本词卡：球、操场、床、杯子。读前先看词卡，读完合上书说一说。',
    retell: '看图说词：指一指，用英文大声说出这一页的东西。（这一本是「修好它」。）',
    think: '说一样坏过的东西：你一开始反复试了什么？后来发现真正的问题在哪儿？',
    pre: [
      { art: '⚽', en: 'ball', zh: '球' },
      { art: '🛝', en: 'playground', zh: '操场' },
      { art: '🛏️', en: 'bed', zh: '床' },
      { art: '🥛', en: 'cup', zh: '杯子' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'they', zh: 'they' }
    ],
    sight: [],
    newWords: [
      { w: 'ball', zh: '球' },
      { w: 'playground', zh: '操场' },
      { w: 'bed', zh: '床' },
      { w: 'cup', zh: '杯子' }
    ],
    pages: [
      { art: 'playground|ming,grandma|ball|·', en: 'The ball does not work on the playground.', zh: '操场的球不好使了。' },
      { art: 'playground|ming,grandma|ball|♪', en: 'Ming wants to fix it.', zh: '明明想把它修好。' },
      { art: 'playground|ming,grandma|ball|👀', en: 'They look at it from every side. We say ball, bed and cup.', zh: '他们从各个面都看了一遍。我们说一说：球、床和杯子。' },
      { art: 'playground|ming,grandma|ball|?', en: '"What did we change?" asks Grandma.', zh: '「我们改过什么？」奶奶问。' },
      { art: 'playground|ming,grandma|ball|★', en: 'Now the ball works again. Here is a ball. Here is a bed.', zh: '球又能用了。这是球，这是床。' },
      { art: 'playground|ming,grandma|ball|·', en: 'They remember to look before they try again.', zh: '他们记住了：再试之前，先看一看。' }
    ],
    quiz: [
      { q: '明明和奶奶的这一本里，出现了下面哪一样？', opts: ['盒子', '丽丽', '床'], a: 2, kind: 'recall' },
      { q: '读到最后之前，你猜明明他们接下来会怎么样？', opts: ['停下来找出那个小毛病，就修好了', '一直重复原来那个动作', '把东西丢下不管了'], a: 0, kind: 'infer' },
      { q: '一件事反复做还是不行（像修球那样），你会怎么做？', opts: ['把同样的动作再做十遍', '先停下来看看是不是漏了一处小的', '干脆换个人做'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b8', lv: 'L1', tag: '家里', title: 'My Cup', zh: '我的杯子',
    emoji: '🥛', color: '#F2E2A8',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「一起做」这条线，认读 3 个新词。',
    trap: '这一级是整体认读：词不用拼，先听整句，再跟着说；别一个字母一个字母念。',
    summary: '《我的杯子》是「一起做」：丽丽和爷爷在家，围绕杯子把一件事读到底。本本词卡：天空、茶、黄色。读前先看词卡，读完合上书说一说。',
    retell: '看图说词：指一指，用英文大声说出这一页的东西。（这一本是「一起做」。）',
    think: '说一件你做过的、步骤很多的事：哪一步最容易漏？下次怎么提醒自己？',
    pre: [
      { art: '🌿', en: 'sky', zh: '天空' },
      { art: '🍵', en: 'tea', zh: '茶' },
      { art: '🟡', en: 'yellow', zh: '黄色' },
      { art: '📦', en: 'a', zh: 'a' },
      { art: '📦', en: 'they', zh: 'they' }
    ],
    sight: [],
    newWords: [
      { w: 'sky', zh: '天空' },
      { w: 'tea', zh: '茶' },
      { w: 'yellow', zh: '黄色' }
    ],
    pages: [
      { art: 'home|lili,grandpa|cup|·', en: 'Lili has an idea at home.', zh: '丽丽在家有了个主意。' },
      { art: 'home|lili,grandpa|cup|♪', en: '"Let us make a cup," says Lili.', zh: '「我们做杯子吧。」丽丽说。' },
      { art: 'home|lili,grandpa|cup|👀', en: 'They get everything ready. We say sky, tea and yellow.', zh: '他们把要用的东西备齐。我们说一说：天空、茶和黄色。' },
      { art: 'home|lili,grandpa|cup|?', en: '"What do we need first?" asks Grandpa.', zh: '「先要什么？」爷爷问。' },
      { art: 'home|lili,grandpa|cup|★', en: 'This time the cup is just right. Here is a sky. Here is a tea.', zh: '这次杯子正好。这是天空，这是茶。' },
      { art: 'home|lili,grandpa|cup|·', en: 'They write down what they would do next time.', zh: '他们写下下次要怎么做。' }
    ],
    quiz: [
      { q: '在家读的这一本里，有下面哪一样？', opts: ['鱼', '米饭', '黄色'], a: 2, kind: 'recall' },
      { q: '读到最后之前，你猜丽丽他们接下来会怎么样？', opts: ['换一本书不读了', '把东西丢下不管了', '把步骤按顺序重做一次，就做成了'], a: 2, kind: 'infer' },
      { q: '做一件步骤很多的事（像做杯子那样），你会先做什么？', opts: ['直接跳过开头的步骤', '先把步骤写下来，再一步一步做', '想到哪步做哪步'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b9', lv: 'L1', tag: '发音', title: 'Say It: Hat', zh: '说一说：帽子',
    emoji: '🗣️', color: '#D9D2F5',
    track: 'drill',
    goal: '把本级难点音听准、说准，并能在整句里读对。这一本走「问一问」这条线，认读 3 个新词。',
    trap: '这一级是整体认读：词不用拼，先听整句，再跟着说；别一个字母一个字母念。',
    summary: '《说一说：帽子》是「问一问」：奶奶和妈妈在家，围绕帽子把一件事读到底。本本词卡：朋友、绿色、牛奶。读前先看词卡，读完合上书说一说。',
    retell: '看图说词：指一指，用英文大声说出这一页的东西。（这一本是「问一问」。）',
    think: '回想一次「问了还是没懂」：把当时的问题改成一个更小的、指着某个词的问题。',
    pre: [
      { art: '🧒', en: 'friend', zh: '朋友' },
      { art: '🟢', en: 'green', zh: '绿色' },
      { art: '🥛', en: 'milk', zh: '牛奶' },
      { art: '📦', en: 'is', zh: 'is' },
      { art: '👵', en: 'grandma', zh: '奶奶' }
    ],
    sight: [],
    newWords: [
      { w: 'friend', zh: '朋友' },
      { w: 'green', zh: '绿色' },
      { w: 'milk', zh: '牛奶' }
    ],
    pages: [
      { art: 'home|grandma,mom|hat|·', en: 'Grandma is reading the word "hat" at home.', zh: '奶奶在家读「hat」这个词。' },
      { art: 'home|grandma,mom|hat|♪', en: 'Grandma wants to understand it.', zh: '奶奶想把它弄明白。' },
      { art: 'home|grandma,mom|hat|👀', en: 'One sentence does not make sense. We say friend, green and milk.', zh: '有一句怎么也读不通。我们说一说：朋友、绿色和牛奶。' },
      { art: 'home|grandma,mom|hat|?', en: '"What does this part mean?" asks Grandma.', zh: '「这一段什么意思？」奶奶问。' },
      { art: 'home|grandma,mom|hat|★', en: 'Now the whole sentence is clear. Here is a friend. Here is a green.', zh: '这下整句都清楚了。这是朋友，这是绿色。' },
      { art: 'home|grandma,mom|hat|·', en: 'They write down one new question.', zh: '他们又写下一个新问题。' }
    ],
    quiz: [
      { q: '这一本里，奶奶看到了下面哪一样？', opts: ['笔', '宝宝', '帽子'], a: 2, kind: 'recall' },
      { q: '读到最后之前，你猜奶奶他们接下来会怎么样？', opts: ['换一本书不读了', '只把中文看一遍', '指着自己不懂的那个词再问一遍，就明白了'], a: 2, kind: 'infer' },
      { q: '别人把「hat」解释完你还是没懂，你会怎么做？', opts: ['把整段跳过去', '点点头装作懂了', '指出具体哪个词不懂，再问一遍'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b10', lv: 'L1', tag: '认物', title: 'This Is a Book', zh: '这是一本书',
    emoji: '📖', color: '#FAD3B6',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。这一本走「问一问」这条线，认读 1 个新词。',
    trap: '这一级是整体认读：词不用拼，先听整句，再跟着说；别一个字母一个字母念。',
    summary: '《这是一本书》是「问一问」：爷爷和爸爸在图书馆，围绕书把一件事读到底。本本词卡：图书馆。读前先看词卡，读完合上书说一说。',
    retell: '看图说词：指一指，用英文大声说出这一页的东西。（这一本是「问一问」。）',
    think: '回想一次「问了还是没懂」：把当时的问题改成一个更小的、指着某个词的问题。',
    pre: [
      { art: '📚', en: 'library', zh: '图书馆' },
      { art: '📦', en: 'is', zh: 'is' },
      { art: '👴', en: 'grandpa', zh: '爷爷' }
    ],
    sight: [],
    newWords: [
      { w: 'library', zh: '图书馆' }
    ],
    pages: [
      { art: 'library|grandpa,dad|book|·', en: 'Grandpa is reading the word "book" in the library.', zh: '爷爷在图书馆读「book」这个词。' },
      { art: 'library|grandpa,dad|book|♪', en: 'Grandpa wants to understand it.', zh: '爷爷想把它弄明白。' },
      { art: 'library|grandpa,dad|book|👀', en: 'One sentence does not make sense. We say can, cat and cup.', zh: '有一句怎么也读不通。我们说一说：罐子、猫和杯子。' },
      { art: 'library|grandpa,dad|book|?', en: '"What does this part mean?" asks Grandpa.', zh: '「这一段什么意思？」爷爷问。' },
      { art: 'library|grandpa,dad|book|★', en: 'Now the whole sentence is clear. Here is a can. Here is a cat.', zh: '这下整句都清楚了。这是罐子，这是猫。' },
      { art: 'library|grandpa,dad|book|·', en: 'They write down one new question.', zh: '他们又写下一个新问题。' }
    ],
    quiz: [
      { q: '爷爷和爸爸的这一本里，出现了下面哪一样？', opts: ['太阳', '图书馆', '蓝色'], a: 1, kind: 'recall' },
      { q: '读到最后之前，你猜爷爷他们接下来会怎么样？', opts: ['只把中文看一遍', '指着自己不懂的那个词再问一遍，就明白了', '把东西丢下不管了'], a: 1, kind: 'infer' },
      { q: '别人把「book」解释完你还是没懂，你会怎么做？', opts: ['把整段跳过去', '点点头装作懂了', '指出具体哪个词不懂，再问一遍'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b11', lv: 'L1', tag: '认物', title: 'Water and Rice', zh: '水和米饭',
    emoji: '💧', color: '#C8E7F0',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。这一本走「合上书讲一遍」这条线，不引入新词，全部是读过的词。',
    trap: '这一级是整体认读：词不用拼，先听整句，再跟着说；别一个字母一个字母念。',
    summary: '《水和米饭》是「合上书讲一遍」：妈妈和明明在家，围绕水把一件事读到底。本本词卡：这一本不引入新词，全部是读过的词。读前先看词卡，读完合上书说一说。',
    retell: '看图说词：指一指，用英文大声说出这一页的东西。（这一本是「合上书讲一遍」。）',
    think: '合上书，用「谁 → 在哪儿 → 出了什么事 → 结果」把水这一本讲给家长听。',
    pre: [
      { art: '📦', en: 'a', zh: 'a' },
      { art: '👩', en: 'mom', zh: '妈妈' }
    ],
    sight: ['sky', 'water'],
    newWords: [

    ],
    pages: [
      { art: 'home|mom,ming|water|·', en: 'Mom has just finished a book at home.', zh: '妈妈刚在家读完一本书。' },
      { art: 'home|mom,ming|water|♪', en: 'Ming wants to hear all about it.', zh: '明明想听他讲讲。' },
      { art: 'home|mom,ming|water|👀', en: 'Mom thinks about the water in the book. We say cat, cup and dad.', zh: '妈妈想着书里的水。我们说一说：猫、杯子和爸爸。' },
      { art: 'home|mom,ming|water|?', en: '"Where do I start?" asks Mom.', zh: '「从哪儿讲起？」妈妈问。' },
      { art: 'home|mom,ming|water|★', en: 'This time Ming can see the whole thing. Here is a cat. Here is a cup.', zh: '这回明明全听明白了。这是猫，这是杯子。' },
      { art: 'home|mom,ming|water|·', en: 'Tomorrow they will read about a sky.', zh: '明天他们要读讲天空的书。' }
    ],
    quiz: [
      { q: '在家读的这一本里，有下面哪一样？', opts: ['杯子', '笔', '狗'], a: 0, kind: 'recall' },
      { q: '读到最后之前，你猜妈妈他们接下来会怎么样？', opts: ['跳过中间那几页', '换一本书不读了', '按「谁 → 在哪儿 → 出了什么事」重讲一遍，别人就听懂了'], a: 2, kind: 'infer' },
      { q: '要把讲水的这本读过的书讲给别人听，你会怎么开头？', opts: ['直接从最精彩的那句开始', '先说谁、在哪儿，再按顺序说出了什么事', '先报书名和生词表'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b12', lv: 'L1', tag: '复习', title: 'All Together', zh: '都在一起',
    emoji: '🌈', color: '#E8D9B5',
    track: 'review',
    goal: '把本级和前面级别的词再读一遍、串成一个故事。这一本走「比一比」这条线，认读 2 个新词。',
    trap: '这一级是整体认读：词不用拼，先听整句，再跟着说；别一个字母一个字母念。',
    summary: '《都在一起》是「比一比」：爸爸和丽丽在图书馆，围绕盒子把一件事读到底。本本词卡：锅、盘子。读前先看词卡，读完合上书说一说。',
    retell: '看图说词：指一指，用英文大声说出这一页的东西。（这一本是「比一比」。）',
    think: '找两样很像的东西，用英文说出至少两处不同，说说你是按什么顺序找的。',
    pre: [
      { art: '🍲', en: 'pot', zh: '锅' },
      { art: '🍽️', en: 'dish', zh: '盘子' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'a', zh: 'a' }
    ],
    sight: [],
    newWords: [
      { w: 'pot', zh: '锅' },
      { w: 'dish', zh: '盘子' }
    ],
    pages: [
      { art: 'library|dad,lili|box|·', en: 'Dad looks at a box and a pot.', zh: '爸爸看着盒子和锅。' },
      { art: 'library|dad,lili|box|♪', en: 'They want to know how they are different.', zh: '他们想知道两样有什么不一样。' },
      { art: 'library|dad,lili|box|👀', en: 'At first the two look the same. We say cup, dad and dog.', zh: '乍一看，两样挺像。我们说一说：杯子、爸爸和狗。' },
      { art: 'library|dad,lili|box|?', en: '"What is not the same?" asks Lili.', zh: '「哪里不一样？」丽丽问。' },
      { art: 'library|dad,lili|box|★', en: 'There! One small part is different. Here is a cup. Here is a dad.', zh: '有了！有一处小小的不同。这是杯子，这是爸爸。' },
      { art: 'library|dad,lili|box|·', en: 'Next they will compare the pot and the dish.', zh: '接着他们要比一比锅和盘子。' }
    ],
    quiz: [
      { q: '这一本里，爸爸看到了下面哪一样？', opts: ['公园', '盘子', '猫'], a: 1, kind: 'recall' },
      { q: '读到最后之前，你猜爸爸他们接下来会怎么样？', opts: ['并排放好一处一处看，就找出不同了', '一直重复原来那个动作', '只把中文看一遍'], a: 0, kind: 'infer' },
      { q: '要找出像盒子和锅这样很像的两样东西哪里不同，你会怎么做？', opts: ['只挑一个看', '并排放好，一处一处分开看', '隔很远扫一眼'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b13', lv: 'L2', tag: '农场', title: 'A Pig and a Hen', zh: '小猪和母鸡',
    emoji: '🐷', color: '#F6C6C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「找回来」这条线，认读 5 个新词。',
    trap: '短元音要收住韵尾：cap 的 p 是双唇轻轻一闭，不要加「呃」读成「卡普呃」。',
    summary: '《小猪和母鸡》是「找回来」：明明和奶奶在农场，围绕猪把一件事读到底。本本词卡：农场、木板、小面包、公交车、鸭舌帽。读前先看词卡，读完合上书说一说。',
    retell: '看图说词：用 a pig / a kite 说两样东西，再听一遍整句。（这一本是「找回来」。）',
    think: '说一说你有没有把东西放忘了的时候：先说在哪儿丢的，再说最后在哪儿找到。',
    pre: [
      { art: '🚜', en: 'farm', zh: '农场' },
      { art: '📋', en: 'board', zh: '木板' },
      { art: '🍞', en: 'bun', zh: '小面包' },
      { art: '🚌', en: 'bus', zh: '公交车' },
      { art: '🧢', en: 'cap', zh: '鸭舌帽' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'and', zh: 'and' }
    ],
    sight: [],
    newWords: [
      { w: 'farm', zh: '农场' },
      { w: 'board', zh: '木板' },
      { w: 'bun', zh: '小面包' },
      { w: 'bus', zh: '公交车' },
      { w: 'cap', zh: '鸭舌帽' }
    ],
    pages: [
      { art: 'farm|ming,grandma|pig|·', en: 'Ming and Grandma are on the farm.', zh: '明明和奶奶在农场。' },
      { art: 'farm|ming,grandma|pig|♪', en: 'Ming wants a pig.', zh: '明明想要猪。' },
      { art: 'farm|ming,grandma|pig|👀', en: 'They look at the kite and the board. We say bun, bus and cap.', zh: '他们看看风筝和木板。我们说一说：小面包、公交车和鸭舌帽。' },
      { art: 'farm|ming,grandma|pig|?', en: '"Where is my pig?" asks Ming.', zh: '「我的猪呢？」明明问。' },
      { art: 'farm|ming,grandma|pig|·', en: 'They look here, and they look there.', zh: '他们这儿看看，那儿看看。' },
      { art: 'farm|ming,grandma|pig|★', en: 'There it is! The pig was on the farm all along. Look at the bun and the bus.', zh: '在那儿！猪一直在农场。看看小面包和公交车。' },
      { art: 'farm|ming,grandma|pig|·', en: 'They put the pig back where it belongs.', zh: '他们把猪放回原处。' }
    ],
    quiz: [
      { q: '明明和奶奶的这一本里，出现了下面哪一样？', opts: ['母鸡', '公交车', '爸爸'], a: 1, kind: 'recall' },
      { q: '读到最后之前，你猜明明他们接下来会怎么样？', opts: ['把东西丢下不管了', '把东西丢下不管了（木板）', '回头再慢慢找一遍，就在农场找到了'], a: 2, kind: 'infer' },
      { q: '如果你的猪找不到了，你会先做什么？', opts: ['不找了，直接走开', '马上再买一个新的', '先回到最开始的地方慢慢找一遍'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b14', lv: 'L2', tag: '穿戴', title: 'The Red Cap', zh: '红帽子',
    emoji: '🧢', color: '#F9DFB4',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「分一分」这条线，认读 3 个新词。',
    trap: '短元音要收住韵尾：cap 的 p 是双唇轻轻一闭，不要加「呃」读成「卡普呃」。',
    summary: '《红帽子》是「分一分」：丽丽和爷爷在家，围绕鸭舌帽把一件事读到底。本本词卡：果酱、水壶、腿。读前先看词卡，读完合上书说一说。',
    retell: '看图说词：用 a cap / a pen 说两样东西，再听一遍整句。（这一本是「分一分」。）',
    think: '说说家里只剩一份、两个人都想要的时候，你们是怎么商量的。',
    pre: [
      { art: '🍯', en: 'jam', zh: '果酱' },
      { art: '📦', en: 'jug', zh: '水壶' },
      { art: '✋', en: 'leg', zh: '腿' },
      { art: '📦', en: 'it', zh: 'it' },
      { art: '📦', en: 'at', zh: 'at' }
    ],
    sight: [],
    newWords: [
      { w: 'jam', zh: '果酱' },
      { w: 'jug', zh: '水壶' },
      { w: 'leg', zh: '腿' }
    ],
    pages: [
      { art: 'home|lili,grandpa|cap|·', en: 'There is only one cap at home.', zh: '家只有一个鸭舌帽。' },
      { art: 'home|lili,grandpa|cap|♪', en: 'Lili wants it. Grandpa wants it too.', zh: '丽丽想要，爷爷也想要。' },
      { art: 'home|lili,grandpa|cap|👀', en: 'They look at the cap for a long time. We say jam, jug and leg.', zh: '他们盯着鸭舌帽看了好久。我们说一说：果酱、水壶和腿。' },
      { art: 'home|lili,grandpa|cap|?', en: '"How can we both have it?" asks Grandpa.', zh: '「怎么才能两个人都有？」爷爷问。' },
      { art: 'home|lili,grandpa|cap|·', en: 'Lili says, "You can have it first."', zh: '丽丽说：「你先来吧。」' },
      { art: 'home|lili,grandpa|cap|★', en: 'Now each of them has a part. Look at the jam and the jug.', zh: '现在两个人各有一份。看看果酱和水壶。' },
      { art: 'home|lili,grandpa|cap|·', en: 'Next time they will ask before they decide.', zh: '下次他们会先问一句，再做决定。' }
    ],
    quiz: [
      { q: '在家读的这一本里，有下面哪一样？', opts: ['奶奶', '果酱', '泥'], a: 1, kind: 'recall' },
      { q: '读到最后之前，你猜丽丽他们接下来会怎么样？', opts: ['换一本书不读了', '换一本书不读了（照片）', '商量以后分成两份，两个人都有了'], a: 2, kind: 'infer' },
      { q: '只剩一份鸭舌帽、两个人都想要时，你会怎么做？', opts: ['先抢到手再说', '谁也不给', '先问一句能不能分，再一起想办法'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b15', lv: 'L2', tag: '天气', title: 'Mud and Fog', zh: '泥和雾',
    emoji: '🌫️', color: '#CDE7C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「问一问」这条线，认读 4 个新词。',
    trap: '短元音要收住韵尾：cap 的 p 是双唇轻轻一闭，不要加「呃」读成「卡普呃」。',
    summary: '《泥和雾》是「问一问」：奶奶和妈妈在花园，围绕泥把一件事读到底。本本词卡：泥、花园、坚果、平底锅。读前先看词卡，读完合上书说一说。',
    retell: '看图说词：用 a mud / a sky 说两样东西，再听一遍整句。（这一本是「问一问」。）',
    think: '回想一次「问了还是没懂」：把当时的问题改成一个更小的、指着某个词的问题。',
    pre: [
      { art: '🟤', en: 'mud', zh: '泥' },
      { art: '🌻', en: 'garden', zh: '花园' },
      { art: '🌰', en: 'nut', zh: '坚果' },
      { art: '📦', en: 'pan', zh: '平底锅' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👵', en: 'grandma', zh: '奶奶' }
    ],
    sight: [],
    newWords: [
      { w: 'mud', zh: '泥' },
      { w: 'garden', zh: '花园' },
      { w: 'nut', zh: '坚果' },
      { w: 'pan', zh: '平底锅' }
    ],
    pages: [
      { art: 'garden|grandma,mom|mud|·', en: 'Grandma is reading the word "mud" in the garden.', zh: '奶奶在花园读「mud」这个词。' },
      { art: 'garden|grandma,mom|mud|♪', en: 'Grandma wants to understand it.', zh: '奶奶想把它弄明白。' },
      { art: 'garden|grandma,mom|mud|👀', en: 'One sentence does not make sense. We say mud, nut and pan.', zh: '有一句怎么也读不通。我们说一说：泥、坚果和平底锅。' },
      { art: 'garden|grandma,mom|mud|?', en: '"What does this part mean?" asks Grandma.', zh: '「这一段什么意思？」奶奶问。' },
      { art: 'garden|grandma,mom|mud|·', en: 'Mom answers, but Grandma still looks lost.', zh: '妈妈答了，奶奶还是没懂。' },
      { art: 'garden|grandma,mom|mud|★', en: 'Now the whole sentence is clear. Look at the mud and the nut.', zh: '这下整句都清楚了。看看泥和坚果。' },
      { art: 'garden|grandma,mom|mud|·', en: 'They write down one new question.', zh: '他们又写下一个新问题。' }
    ],
    quiz: [
      { q: '这一本里，奶奶看到了下面哪一样？', opts: ['坚果', '明明', '火腿'], a: 0, kind: 'recall' },
      { q: '读到最后之前，你猜奶奶他们接下来会怎么样？', opts: ['只把中文看一遍', '指着自己不懂的那个词再问一遍，就明白了', '只把中文看一遍（图画）'], a: 1, kind: 'infer' },
      { q: '别人把「mud」解释完你还是没懂，你会怎么做？', opts: ['把整段跳过去', '指出具体哪个词不懂，再问一遍', '点点头装作懂了'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b16', lv: 'L2', tag: '观察', title: 'My Little Bug', zh: '我的小虫',
    emoji: '🐛', color: '#C6DEF6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「比一比」这条线，认读 4 个新词。',
    trap: '短元音要收住韵尾：cap 的 p 是双唇轻轻一闭，不要加「呃」读成「卡普呃」。',
    summary: '《我的小虫》是「比一比」：爷爷和爸爸在花园，围绕小虫把一件事读到底。本本词卡：小虫、胳膊、蝙蝠、盘子。读前先看词卡，读完合上书说一说。',
    retell: '看图说词：用 a bug / a fish 说两样东西，再听一遍整句。（这一本是「比一比」。）',
    think: '找两样很像的东西，用英文说出至少两处不同，说说你是按什么顺序找的。',
    pre: [
      { art: '🐛', en: 'bug', zh: '小虫' },
      { art: '✋', en: 'arm', zh: '胳膊' },
      { art: '🦇', en: 'bat', zh: '蝙蝠' },
      { art: '🍽️', en: 'plate', zh: '盘子' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'and', zh: 'and' }
    ],
    sight: ['fish'],
    newWords: [
      { w: 'bug', zh: '小虫' },
      { w: 'arm', zh: '胳膊' },
      { w: 'bat', zh: '蝙蝠' },
      { w: 'plate', zh: '盘子' }
    ],
    pages: [
      { art: 'garden|grandpa,dad|bug|·', en: 'Grandpa looks at a bug and a fish.', zh: '爷爷看着小虫和鱼。' },
      { art: 'garden|grandpa,dad|bug|♪', en: 'They want to know how they are different.', zh: '他们想知道两样有什么不一样。' },
      { art: 'garden|grandpa,dad|bug|👀', en: 'At first the two look the same. We say bug, arm and bat.', zh: '乍一看，两样挺像。我们说一说：小虫、胳膊和蝙蝠。' },
      { art: 'garden|grandpa,dad|bug|?', en: '"What is not the same?" asks Dad.', zh: '「哪里不一样？」爸爸问。' },
      { art: 'garden|grandpa,dad|bug|·', en: 'They put them side by side.', zh: '他们把两样并排放。' },
      { art: 'garden|grandpa,dad|bug|★', en: 'There! One small part is different. Look at the bug and the arm.', zh: '有了！有一处小小的不同。看看小虫和胳膊。' },
      { art: 'garden|grandpa,dad|bug|·', en: 'Next they will compare the fish and the plate.', zh: '接着他们要比一比鱼和盘子。' }
    ],
    quiz: [
      { q: '爷爷和爸爸的这一本里，出现了下面哪一样？', opts: ['小虫', '妈妈', '米饭'], a: 0, kind: 'recall' },
      { q: '读到最后之前，你猜爷爷他们接下来会怎么样？', opts: ['并排放好一处一处看，就找出不同了', '把东西丢下不管了', '跳过中间那几页'], a: 0, kind: 'infer' },
      { q: '要找出像小虫和鱼这样很像的两样东西哪里不同，你会怎么做？', opts: ['并排放好，一处一处分开看', '只挑一个看', '隔很远扫一眼'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b17', lv: 'L2', tag: '厨房', title: 'A Big Pot', zh: '一口大锅',
    emoji: '🍲', color: '#E0CFF3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「一起做」这条线，认读 3 个新词。',
    trap: '短元音要收住韵尾：cap 的 p 是双唇轻轻一闭，不要加「呃」读成「卡普呃」。',
    summary: '《一口大锅》是「一起做」：妈妈和明明在家，围绕锅把一件事读到底。本本词卡：地图、拖把、网。读前先看词卡，读完合上书说一说。',
    retell: '看图说词：用 a pot / a cap 说两样东西，再听一遍整句。（这一本是「一起做」。）',
    think: '说一件你做过的、步骤很多的事：哪一步最容易漏？下次怎么提醒自己？',
    pre: [
      { art: '🗺️', en: 'map', zh: '地图' },
      { art: '📦', en: 'mop', zh: '拖把' },
      { art: '📦', en: 'net', zh: '网' },
      { art: '📦', en: 'they', zh: 'they' },
      { art: '📦', en: 'and', zh: 'and' }
    ],
    sight: [],
    newWords: [
      { w: 'map', zh: '地图' },
      { w: 'mop', zh: '拖把' },
      { w: 'net', zh: '网' }
    ],
    pages: [
      { art: 'home|mom,ming|pot|·', en: 'Mom has an idea at home.', zh: '妈妈在家有了个主意。' },
      { art: 'home|mom,ming|pot|♪', en: '"Let us make a pot," says Mom.', zh: '「我们做锅吧。」妈妈说。' },
      { art: 'home|mom,ming|pot|👀', en: 'They get everything ready. We say map, mop and net.', zh: '他们把要用的东西备齐。我们说一说：地图、拖把和网。' },
      { art: 'home|mom,ming|pot|?', en: '"What do we need first?" asks Ming.', zh: '「先要什么？」明明问。' },
      { art: 'home|mom,ming|pot|·', en: 'They make a list, and they start.', zh: '他们列了个单子，就动手了。' },
      { art: 'home|mom,ming|pot|★', en: 'This time the pot is just right. Look at the map and the mop.', zh: '这次锅正好。看看地图和拖把。' },
      { art: 'home|mom,ming|pot|·', en: 'They write down what they would do next time.', zh: '他们写下下次要怎么做。' }
    ],
    quiz: [
      { q: '在家读的这一本里，有下面哪一样？', opts: ['平底锅', '锅', '三'], a: 1, kind: 'recall' },
      { q: '读到最后之前，你猜妈妈他们接下来会怎么样？', opts: ['一直重复原来那个动作', '换一本书不读了', '把步骤按顺序重做一次，就做成了'], a: 2, kind: 'infer' },
      { q: '做一件步骤很多的事（像做锅那样），你会先做什么？', opts: ['想到哪步做哪步', '直接跳过开头的步骤', '先把步骤写下来，再一步一步做'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b18', lv: 'L2', tag: '出门', title: 'The Bus Is Here', zh: '公交车来了',
    emoji: '🚌', color: '#F6C9E3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「跟读整句」这条线，认读 4 个新词。',
    trap: '短元音要收住韵尾：cap 的 p 是双唇轻轻一闭，不要加「呃」读成「卡普呃」。',
    summary: '《公交车来了》是「跟读整句」：爸爸和丽丽在街道，围绕公交车把一件事读到底。本本词卡：街道、雾、狐狸、火腿。读前先看词卡，读完合上书说一说。',
    retell: '看图说词：用 a bus / a picture 说两样东西，再听一遍整句。（这一本是「跟读整句」。）',
    think: '挑书里最长的一句英文，先听整句，再分成两段读给家长听。',
    pre: [
      { art: '🛣️', en: 'street', zh: '街道' },
      { art: '🌫️', en: 'fog', zh: '雾' },
      { art: '🦊', en: 'fox', zh: '狐狸' },
      { art: '🍖', en: 'ham', zh: '火腿' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👨', en: 'dad', zh: '爸爸' }
    ],
    sight: ['picture'],
    newWords: [
      { w: 'street', zh: '街道' },
      { w: 'fog', zh: '雾' },
      { w: 'fox', zh: '狐狸' },
      { w: 'ham', zh: '火腿' }
    ],
    pages: [
      { art: 'street|dad,lili|bus|·', en: 'Dad opens a book on the street.', zh: '爸爸在街道翻开一本书。' },
      { art: 'street|dad,lili|bus|♪', en: 'Dad wants to read it out loud.', zh: '爸爸想把它读出来。' },
      { art: 'street|dad,lili|bus|👀', en: 'The sentence with the word "bus" is long. We say fog, fox and ham.', zh: '带着「bus」这个词的那一句很长。我们说一说：雾、狐狸和火腿。' },
      { art: 'street|dad,lili|bus|?', en: '"Where do I stop for breath?" asks Dad.', zh: '「在哪里换气？」爸爸问。' },
      { art: 'street|dad,lili|bus|·', en: 'Dad reads it one word at a time.', zh: '爸爸一个词一个词地读。' },
      { art: 'street|dad,lili|bus|★', en: 'Now it sounds like one sentence. Look at the fog and the fox.', zh: '这下听起来像一整句了。看看雾和狐狸。' },
      { art: 'street|dad,lili|bus|·', en: 'They try the next sentence about a picture.', zh: '他们接着试讲图画的下一句。' }
    ],
    quiz: [
      { q: '这一本里，爸爸看到了下面哪一样？', opts: ['米饭', '蚂蚁', '图画'], a: 2, kind: 'recall' },
      { q: '读到最后之前，你猜爸爸他们接下来会怎么样？', opts: ['听完整句、分成两段读，就连贯了', '只把中文看一遍', '把东西丢下不管了'], a: 0, kind: 'infer' },
      { q: '遇到像「bus」那一句这样很长的英文句子，你会怎么读？', opts: ['只看中文跳过英文', '一个词一个词慢慢拼', '先听整句，再按意思分成两三段读'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b19', lv: 'L2', tag: '找路', title: 'A Map for Ming', zh: '明明的地图',
    emoji: '🗺️', color: '#BFE6DF',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「分一分」这条线，认读 3 个新词。',
    trap: '短元音要收住韵尾：cap 的 p 是双唇轻轻一闭，不要加「呃」读成「卡普呃」。',
    summary: '《明明的地图》是「分一分」：明明和奶奶在街道，围绕地图把一件事读到底。本本词卡：扇子、母鸡、小山。读前先看词卡，读完合上书说一说。',
    retell: '看图说词：用 a map / a picture 说两样东西，再听一遍整句。（这一本是「分一分」。）',
    think: '说说家里只剩一份、两个人都想要的时候，你们是怎么商量的。',
    pre: [
      { art: '📦', en: 'fan', zh: '扇子' },
      { art: '🐔', en: 'hen', zh: '母鸡' },
      { art: '🌿', en: 'hill', zh: '小山' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'it', zh: 'it' }
    ],
    sight: ['street'],
    newWords: [
      { w: 'fan', zh: '扇子' },
      { w: 'hen', zh: '母鸡' },
      { w: 'hill', zh: '小山' }
    ],
    pages: [
      { art: 'street|ming,grandma|map|·', en: 'There is only one map on the street.', zh: '街道只有一个地图。' },
      { art: 'street|ming,grandma|map|♪', en: 'Ming wants it. Grandma wants it too.', zh: '明明想要，奶奶也想要。' },
      { art: 'street|ming,grandma|map|👀', en: 'They look at the map for a long time. We say fan, hen and hill.', zh: '他们盯着地图看了好久。我们说一说：扇子、母鸡和小山。' },
      { art: 'street|ming,grandma|map|?', en: '"How can we both have it?" asks Grandma.', zh: '「怎么才能两个人都有？」奶奶问。' },
      { art: 'street|ming,grandma|map|·', en: 'Ming says, "You can have it first."', zh: '明明说：「你先来吧。」' },
      { art: 'street|ming,grandma|map|★', en: 'Now each of them has a part. Look at the fan and the hen.', zh: '现在两个人各有一份。看看扇子和母鸡。' },
      { art: 'street|ming,grandma|map|·', en: 'Next time they will ask before they decide.', zh: '下次他们会先问一句，再做决定。' }
    ],
    quiz: [
      { q: '明明和奶奶的这一本里，出现了下面哪一样？', opts: ['浴盆', '母鸡', '鸟'], a: 1, kind: 'recall' },
      { q: '读到最后之前，你猜明明他们接下来会怎么样？', opts: ['换一本书不读了', '把东西丢下不管了', '商量以后分成两份，两个人都有了'], a: 2, kind: 'infer' },
      { q: '只剩一份地图、两个人都想要时，你会怎么做？', opts: ['先问一句能不能分，再一起想办法', '先抢到手再说', '谁也不给'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b20', lv: 'L2', tag: '早餐', title: 'Jam on a Bun', zh: '面包上的果酱',
    emoji: '🍞', color: '#F2E2A8',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「合上书讲一遍」这条线，认读 4 个新词。',
    trap: '短元音要收住韵尾：cap 的 p 是双唇轻轻一闭，不要加「呃」读成「卡普呃」。',
    summary: '《面包上的果酱》是「合上书讲一遍」：丽丽和爷爷在家，围绕果酱把一件事读到底。本本词卡：小店、陀螺、浴盆、钟。读前先看词卡，读完合上书说一说。',
    retell: '看图说词：用 a jam / a clock 说两样东西，再听一遍整句。（这一本是「合上书讲一遍」。）',
    think: '合上书，用「谁 → 在哪儿 → 出了什么事 → 结果」把果酱这一本讲给家长听。',
    pre: [
      { art: '🏪', en: 'shop', zh: '小店' },
      { art: '📦', en: 'top', zh: '陀螺' },
      { art: '📦', en: 'tub', zh: '浴盆' },
      { art: '🕐', en: 'clock', zh: '钟' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👧', en: 'lili', zh: '丽丽' }
    ],
    sight: [],
    newWords: [
      { w: 'shop', zh: '小店' },
      { w: 'top', zh: '陀螺' },
      { w: 'tub', zh: '浴盆' },
      { w: 'clock', zh: '钟' }
    ],
    pages: [
      { art: 'home|lili,grandpa|jam|·', en: 'Lili has just finished a book at home.', zh: '丽丽刚在家读完一本书。' },
      { art: 'home|lili,grandpa|jam|♪', en: 'Grandpa wants to hear all about it.', zh: '爷爷想听他讲讲。' },
      { art: 'home|lili,grandpa|jam|👀', en: 'Lili thinks about the jam in the book. We say shop, top and tub.', zh: '丽丽想着书里的果酱。我们说一说：小店、陀螺和浴盆。' },
      { art: 'home|lili,grandpa|jam|?', en: '"Where do I start?" asks Lili.', zh: '「从哪儿讲起？」丽丽问。' },
      { art: 'home|lili,grandpa|jam|·', en: 'Lili tells the last part first.', zh: '丽丽先讲了结尾。' },
      { art: 'home|lili,grandpa|jam|★', en: 'This time Grandpa can see the whole thing. Look at the shop and the top.', zh: '这回爷爷全听明白了。看看小店和陀螺。' },
      { art: 'home|lili,grandpa|jam|·', en: 'Tomorrow they will read about a clock.', zh: '明天他们要读讲钟的书。' }
    ],
    quiz: [
      { q: '在家读的这一本里，有下面哪一样？', opts: ['球', '钟', '爸爸'], a: 1, kind: 'recall' },
      { q: '读到最后之前，你猜丽丽他们接下来会怎么样？', opts: ['按「谁 → 在哪儿 → 出了什么事」重讲一遍，别人就听懂了', '换一本书不读了', '只把中文看一遍'], a: 0, kind: 'infer' },
      { q: '要把讲果酱的这本读过的书讲给别人听，你会怎么开头？', opts: ['先报书名和生词表', '先说谁、在哪儿，再按顺序说出了什么事', '直接从最精彩的那句开始'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b21', lv: 'L2', tag: '发音', title: 'Say It: Pen, Pin', zh: '说一说：pen pin',
    emoji: '🗣️', color: '#D9D2F5',
    track: 'drill',
    goal: '把本级难点音听准、说准，并能在整句里读对。这一本走「问一问」这条线，认读 3 个新词。',
    trap: '短元音要收住韵尾：cap 的 p 是双唇轻轻一闭，不要加「呃」读成「卡普呃」。',
    summary: '《说一说：pen pin》是「问一问」：奶奶和妈妈在家，围绕笔把一件事读到底。本本词卡：别针、老鼠、石头。读前先看词卡，读完合上书说一说。',
    retell: '看图说词：用 a pen / a toy 说两样东西，再听一遍整句。（这一本是「问一问」。）',
    think: '回想一次「问了还是没懂」：把当时的问题改成一个更小的、指着某个词的问题。',
    pre: [
      { art: '📦', en: 'pin', zh: '别针' },
      { art: '🐭', en: 'rat', zh: '老鼠' },
      { art: '🌿', en: 'rock', zh: '石头' },
      { art: '👵', en: 'grandma', zh: '奶奶' },
      { art: '📦', en: 'the', zh: 'the' }
    ],
    sight: [],
    newWords: [
      { w: 'pin', zh: '别针' },
      { w: 'rat', zh: '老鼠' },
      { w: 'rock', zh: '石头' }
    ],
    pages: [
      { art: 'home|grandma,mom|pen|·', en: 'Grandma is reading the word "pen" at home.', zh: '奶奶在家读「pen」这个词。' },
      { art: 'home|grandma,mom|pen|♪', en: 'Grandma wants to understand it.', zh: '奶奶想把它弄明白。' },
      { art: 'home|grandma,mom|pen|👀', en: 'One sentence does not make sense. We say pin, rat and rock.', zh: '有一句怎么也读不通。我们说一说：别针、老鼠和石头。' },
      { art: 'home|grandma,mom|pen|?', en: '"What does this part mean?" asks Grandma.', zh: '「这一段什么意思？」奶奶问。' },
      { art: 'home|grandma,mom|pen|·', en: 'Mom answers, but Grandma still looks lost.', zh: '妈妈答了，奶奶还是没懂。' },
      { art: 'home|grandma,mom|pen|★', en: 'Now the whole sentence is clear. Look at the pin and the rat.', zh: '这下整句都清楚了。看看别针和老鼠。' },
      { art: 'home|grandma,mom|pen|·', en: 'They write down one new question.', zh: '他们又写下一个新问题。' }
    ],
    quiz: [
      { q: '这一本里，奶奶看到了下面哪一样？', opts: ['鸡蛋', '笔', '蓝色'], a: 1, kind: 'recall' },
      { q: '读到最后之前，你猜奶奶他们接下来会怎么样？', opts: ['指着自己不懂的那个词再问一遍，就明白了', '跳过中间那几页', '只把中文看一遍'], a: 0, kind: 'infer' },
      { q: '别人把「pen」解释完你还是没懂，你会怎么做？', opts: ['点点头装作懂了', '指出具体哪个词不懂，再问一遍', '把整段跳过去'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b22', lv: 'L2', tag: '小知识', title: 'A Nut for the Ant', zh: '给蚂蚁的坚果',
    emoji: '🐜', color: '#FAD3B6',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。这一本走「问一问」这条线，认读 3 个新词。',
    trap: '短元音要收住韵尾：cap 的 p 是双唇轻轻一闭，不要加「呃」读成「卡普呃」。',
    summary: '《给蚂蚁的坚果》是「问一问」：爷爷和爸爸在家，围绕坚果把一件事读到底。本本词卡：嘴唇、蚂蚁、垃圾桶。读前先看词卡，读完合上书说一说。',
    retell: '看图说词：用 a nut / a bag 说两样东西，再听一遍整句。（这一本是「问一问」。）',
    think: '回想一次「问了还是没懂」：把当时的问题改成一个更小的、指着某个词的问题。',
    pre: [
      { art: '✋', en: 'lip', zh: '嘴唇' },
      { art: '🐜', en: 'ant', zh: '蚂蚁' },
      { art: '📦', en: 'bin', zh: '垃圾桶' },
      { art: '👴', en: 'grandpa', zh: '爷爷' },
      { art: '📦', en: 'the', zh: 'the' }
    ],
    sight: [],
    newWords: [
      { w: 'lip', zh: '嘴唇' },
      { w: 'ant', zh: '蚂蚁' },
      { w: 'bin', zh: '垃圾桶' }
    ],
    pages: [
      { art: 'home|grandpa,dad|nut|·', en: 'Grandpa is reading the word "nut" at home.', zh: '爷爷在家读「nut」这个词。' },
      { art: 'home|grandpa,dad|nut|♪', en: 'Grandpa wants to understand it.', zh: '爷爷想把它弄明白。' },
      { art: 'home|grandpa,dad|nut|👀', en: 'One sentence does not make sense. We say lip, ant and bin.', zh: '有一句怎么也读不通。我们说一说：嘴唇、蚂蚁和垃圾桶。' },
      { art: 'home|grandpa,dad|nut|?', en: '"What does this part mean?" asks Grandpa.', zh: '「这一段什么意思？」爷爷问。' },
      { art: 'home|grandpa,dad|nut|·', en: 'Dad answers, but Grandpa still looks lost.', zh: '爸爸答了，爷爷还是没懂。' },
      { art: 'home|grandpa,dad|nut|★', en: 'Now the whole sentence is clear. Look at the lip and the ant.', zh: '这下整句都清楚了。看看嘴唇和蚂蚁。' },
      { art: 'home|grandpa,dad|nut|·', en: 'They write down one new question.', zh: '他们又写下一个新问题。' }
    ],
    quiz: [
      { q: '爷爷和爸爸的这一本里，出现了下面哪一样？', opts: ['杯子', '母鸡', '嘴唇'], a: 2, kind: 'recall' },
      { q: '读到最后之前，你猜爷爷他们接下来会怎么样？', opts: ['指着自己不懂的那个词再问一遍，就明白了', '把东西丢下不管了', '一直重复原来那个动作'], a: 0, kind: 'infer' },
      { q: '别人把「nut」解释完你还是没懂，你会怎么做？', opts: ['把整段跳过去', '点点头装作懂了', '指出具体哪个词不懂，再问一遍'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b23', lv: 'L2', tag: '小知识', title: 'Wet and Dry', zh: '湿和干',
    emoji: '💧', color: '#C8E7F0',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。这一本走「合上书讲一遍」这条线，认读 1 个新词。',
    trap: '短元音要收住韵尾：cap 的 p 是双唇轻轻一闭，不要加「呃」读成「卡普呃」。',
    summary: '《湿和干》是「合上书讲一遍」：妈妈和明明在家，围绕锅把一件事读到底。本本词卡：盖子。读前先看词卡，读完合上书说一说。',
    retell: '看图说词：用 a pot / a ball 说两样东西，再听一遍整句。（这一本是「合上书讲一遍」。）',
    think: '合上书，用「谁 → 在哪儿 → 出了什么事 → 结果」把锅这一本讲给家长听。',
    pre: [
      { art: '📦', en: 'lid', zh: '盖子' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👩', en: 'mom', zh: '妈妈' }
    ],
    sight: ['duck'],
    newWords: [
      { w: 'lid', zh: '盖子' }
    ],
    pages: [
      { art: 'home|mom,ming|pot|·', en: 'Mom has just finished a book at home.', zh: '妈妈刚在家读完一本书。' },
      { art: 'home|mom,ming|pot|♪', en: 'Ming wants to hear all about it.', zh: '明明想听他讲讲。' },
      { art: 'home|mom,ming|pot|👀', en: 'Mom thinks about the pot in the book. We say lid, duck and egg.', zh: '妈妈想着书里的锅。我们说一说：盖子、鸭子和鸡蛋。' },
      { art: 'home|mom,ming|pot|?', en: '"Where do I start?" asks Mom.', zh: '「从哪儿讲起？」妈妈问。' },
      { art: 'home|mom,ming|pot|·', en: 'Mom tells the last part first.', zh: '妈妈先讲了结尾。' },
      { art: 'home|mom,ming|pot|★', en: 'This time Ming can see the whole thing. Look at the lid and the duck.', zh: '这回明明全听明白了。看看盖子和鸭子。' },
      { art: 'home|mom,ming|pot|·', en: 'Tomorrow they will read about a ball.', zh: '明天他们要读讲球的书。' }
    ],
    quiz: [
      { q: '在家读的这一本里，有下面哪一样？', opts: ['帽子', '坚果', '鸭子'], a: 2, kind: 'recall' },
      { q: '读到最后之前，你猜妈妈他们接下来会怎么样？', opts: ['换一本书不读了', '按「谁 → 在哪儿 → 出了什么事」重讲一遍，别人就听懂了', '把东西丢下不管了'], a: 1, kind: 'infer' },
      { q: '要把讲锅的这本读过的书讲给别人听，你会怎么开头？', opts: ['直接从最精彩的那句开始', '先说谁、在哪儿，再按顺序说出了什么事', '先报书名和生词表'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b24', lv: 'L2', tag: '复习', title: 'The Shop on the Hill', zh: '山上的小店',
    emoji: '🏪', color: '#E8D9B5',
    track: 'review',
    goal: '把本级和前面级别的词再读一遍、串成一个故事。这一本走「比一比」这条线，认读 1 个新词。',
    trap: '短元音要收住韵尾：cap 的 p 是双唇轻轻一闭，不要加「呃」读成「卡普呃」。',
    summary: '《山上的小店》是「比一比」：爸爸和丽丽在图书馆，围绕小店把一件事读到底。本本词卡：照片。读前先看词卡，读完合上书说一说。',
    retell: '看图说词：用 a shop / a photo 说两样东西，再听一遍整句。（这一本是「比一比」。）',
    think: '找两样很像的东西，用英文说出至少两处不同，说说你是按什么顺序找的。',
    pre: [
      { art: '📷', en: 'photo', zh: '照片' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'and', zh: 'and' }
    ],
    sight: ['fish', 'shop'],
    newWords: [
      { w: 'photo', zh: '照片' }
    ],
    pages: [
      { art: 'library|dad,lili|shop|·', en: 'Dad looks at a shop and a photo.', zh: '爸爸看着小店和照片。' },
      { art: 'library|dad,lili|shop|♪', en: 'They want to know how they are different.', zh: '他们想知道两样有什么不一样。' },
      { art: 'library|dad,lili|shop|👀', en: 'At first the two look the same. We say egg, fan and fish.', zh: '乍一看，两样挺像。我们说一说：鸡蛋、扇子和鱼。' },
      { art: 'library|dad,lili|shop|?', en: '"What is not the same?" asks Lili.', zh: '「哪里不一样？」丽丽问。' },
      { art: 'library|dad,lili|shop|·', en: 'They put them side by side.', zh: '他们把两样并排放。' },
      { art: 'library|dad,lili|shop|★', en: 'There! One small part is different. Look at the egg and the fan.', zh: '有了！有一处小小的不同。看看鸡蛋和扇子。' },
      { art: 'library|dad,lili|shop|·', en: 'Next they will compare the photo and the cup.', zh: '接着他们要比一比照片和杯子。' }
    ],
    quiz: [
      { q: '这一本里，爸爸看到了下面哪一样？', opts: ['杯子', '水壶', '公园'], a: 0, kind: 'recall' },
      { q: '读到最后之前，你猜爸爸他们接下来会怎么样？', opts: ['只把中文看一遍', '并排放好一处一处看，就找出不同了', '换一本书不读了'], a: 1, kind: 'infer' },
      { q: '要找出像小店和照片这样很像的两样东西哪里不同，你会怎么做？', opts: ['并排放好，一处一处分开看', '隔很远扫一眼', '只挑一个看'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b25', lv: 'L3', tag: '海边', title: 'The Big Ship', zh: '大轮船',
    emoji: '🚢', color: '#F6C6C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「比一比」这条线，认读 3 个新词。',
    trap: 'sh 把嘴唇撅圆、th 把舌尖轻轻放在上下门牙中间；ck 只发一个 k，别读两遍。',
    summary: '《大轮船》是「比一比」：明明和奶奶在沙滩，围绕轮船把一件事读到底。本本词卡：轮船、飞蛾、小路。读前先看词卡，读完合上书说一说。',
    retell: '三句话复述：先……、后来……、最后……（这一本是「比一比」。）',
    think: '找两样很像的东西，用英文说出至少两处不同，说说你是按什么顺序找的。',
    pre: [
      { art: '🚢', en: 'ship', zh: '轮船' },
      { art: '🦋', en: 'moth', zh: '飞蛾' },
      { art: '🛤️', en: 'path', zh: '小路' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'and', zh: 'and' }
    ],
    sight: ['board'],
    newWords: [
      { w: 'ship', zh: '轮船' },
      { w: 'moth', zh: '飞蛾' },
      { w: 'path', zh: '小路' }
    ],
    pages: [
      { art: 'beach|ming,grandma|ship|·', en: 'Ming looks at a ship and a board.', zh: '明明看着轮船和木板。' },
      { art: 'beach|ming,grandma|ship|♪', en: 'They want to know how they are different.', zh: '他们想知道两样有什么不一样。' },
      { art: 'beach|ming,grandma|ship|👀', en: 'At first the two look the same. We say the words: ship, moth and path.', zh: '乍一看，两样挺像。我们念这三个词：轮船、飞蛾和小路。' },
      { art: 'beach|ming,grandma|ship|?', en: '"What is not the same?" asks Grandma.', zh: '「哪里不一样？」奶奶问。' },
      { art: 'beach|ming,grandma|ship|·', en: 'They put them side by side.', zh: '他们把两样并排放。' },
      { art: 'beach|ming,grandma|ship|!', en: 'Looking from far away does not help.', zh: '远远地看，还是看不出。' },
      { art: 'beach|ming,grandma|ship|★', en: 'There! One small part is different. We look at the ship and the moth.', zh: '有了！有一处小小的不同。我们看看轮船和飞蛾。' },
      { art: 'beach|ming,grandma|ship|·', en: 'Next they will compare the board and the box.', zh: '接着他们要比一比木板和盒子。' }
    ],
    quiz: [
      { q: '明明和奶奶的这一本里，出现了下面哪一样？', opts: ['轮船', '公交车', '书包'], a: 0, kind: 'recall' },
      { q: '读到最后之前，你猜明明他们接下来会怎么样？', opts: ['只把中文看一遍', '并排放好一处一处看，就找出不同了', '把东西丢下不管了'], a: 1, kind: 'infer' },
      { q: '要找出像轮船和木板这样很像的两样东西哪里不同，你会怎么做？', opts: ['并排放好，一处一处分开看', '只挑一个看', '隔很远扫一眼'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b26', lv: 'L3', tag: '趣事', title: 'A Duck in the Shop', zh: '店里的一只鸭子',
    emoji: '🦆', color: '#F9DFB4',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「帮个忙」这条线，认读 3 个新词。',
    trap: 'sh 把嘴唇撅圆、th 把舌尖轻轻放在上下门牙中间；ck 只发一个 k，别读两遍。',
    summary: '《店里的一只鸭子》是「帮个忙」：丽丽和爷爷在农场，围绕鸭子把一件事读到底。本本词卡：袜子、风、翅膀。读前先看词卡，读完合上书说一说。',
    retell: '三句话复述：先……、后来……、最后……（这一本是「帮个忙」。）',
    think: '说一次你请人帮忙的经历：开口之前你卡在哪儿？对方先看出了什么？',
    pre: [
      { art: '🧦', en: 'sock', zh: '袜子' },
      { art: '🌿', en: 'wind', zh: '风' },
      { art: '🕊️', en: 'wing', zh: '翅膀' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👧', en: 'lili', zh: '丽丽' }
    ],
    sight: ['farm'],
    newWords: [
      { w: 'sock', zh: '袜子' },
      { w: 'wind', zh: '风' },
      { w: 'wing', zh: '翅膀' }
    ],
    pages: [
      { art: 'farm|lili,grandpa|duck|·', en: 'Lili is on the farm with a duck.', zh: '丽丽带着鸭子在农场。' },
      { art: 'farm|lili,grandpa|duck|♪', en: 'Lili wants to do it alone.', zh: '丽丽想自己一个人做。' },
      { art: 'farm|lili,grandpa|duck|👀', en: 'The duck is too much for one pair of hands. We say the words: sock, wind and wing.', zh: '一个人搬不动这个鸭子。我们念这三个词：袜子、风和翅膀。' },
      { art: 'farm|lili,grandpa|duck|?', en: '"Can you help me?" asks Lili.', zh: '「能帮我一下吗？」丽丽问。' },
      { art: 'farm|lili,grandpa|duck|·', en: 'They both pull, but it does not move.', zh: '两个人一起拉，还是不动。' },
      { art: 'farm|lili,grandpa|duck|!', en: 'Pulling harder does not help.', zh: '再用力也没用。' },
      { art: 'farm|lili,grandpa|duck|★', en: 'Now the duck moves easily. We look at the sock and the wind.', zh: '这下鸭子轻轻就动了。我们看看袜子和风。' },
      { art: 'farm|lili,grandpa|duck|·', en: 'Next time they will look around first.', zh: '下次他们会先看看四周。' }
    ],
    quiz: [
      { q: '在农场读的这一本里，有下面哪一样？', opts: ['小鸡', '农场', '长椅'], a: 1, kind: 'recall' },
      { q: '读到最后之前，你猜丽丽他们接下来会怎么样？', opts: ['先看看四周，挪开挡路的东西就成了', '换一本书不读了', '跳过中间那几页'], a: 0, kind: 'infer' },
      { q: '两个人一起使劲还是搬不动鸭子，你会怎么做？', opts: ['叫更多人一起使劲', '就这么算了', '先停一下，看看是不是有别的东西挡着'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b27', lv: 'L3', tag: '吃饭', title: 'Fish and Chips', zh: '鱼和薯条',
    emoji: '🐟', color: '#CDE7C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「等它长」这条线，认读 3 个新词。',
    trap: 'sh 把嘴唇撅圆、th 把舌尖轻轻放在上下门牙中间；ck 只发一个 k，别读两遍。',
    summary: '《鱼和薯条》是「等它长」：奶奶和妈妈在沙滩，围绕鱼把一件事读到底。本本词卡：沙滩、沙子、小棚。读前先看词卡，读完合上书说一说。',
    retell: '三句话复述：先……、后来……、最后……（这一本是「等它长」。）',
    think: '说一件练了很久才看见进步的事，讲讲等待的时候你是怎么想的。',
    pre: [
      { art: '🏖️', en: 'beach', zh: '沙滩' },
      { art: '🌿', en: 'sand', zh: '沙子' },
      { art: '📍', en: 'shed', zh: '小棚' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👵', en: 'grandma', zh: '奶奶' }
    ],
    sight: [],
    newWords: [
      { w: 'beach', zh: '沙滩' },
      { w: 'sand', zh: '沙子' },
      { w: 'shed', zh: '小棚' }
    ],
    pages: [
      { art: 'beach|grandma,mom|fish|·', en: 'Grandma puts a fish at the beach.', zh: '奶奶把鱼放在沙滩。' },
      { art: 'beach|grandma,mom|fish|♪', en: 'Grandma wants to see it change.', zh: '奶奶想看见它变样。' },
      { art: 'beach|grandma,mom|fish|👀', en: 'On the first day, nothing looks different. We say the words: sand, shed and beach.', zh: '头一天，看不出什么变化。我们念这三个词：沙子、小棚和沙滩。' },
      { art: 'beach|grandma,mom|fish|?', en: '"Is it working at all?" asks Grandma.', zh: '「到底有没有在长？」奶奶问。' },
      { art: 'beach|grandma,mom|fish|·', en: 'They look again the next morning.', zh: '第二天早上他们又去看。' },
      { art: 'beach|grandma,mom|fish|!', en: 'Still the same. Grandma wants to give up.', zh: '还是老样子。奶奶想算了。' },
      { art: 'beach|grandma,mom|fish|★', en: 'One morning, there is a small change. We look at the sand and the shed.', zh: '有一天早上，出现了一点小变化。我们看看沙子和小棚。' },
      { art: 'beach|grandma,mom|fish|·', en: 'They will come back and look again tomorrow.', zh: '明天他们还会再来看。' }
    ],
    quiz: [
      { q: '这一本里，奶奶看到了下面哪一样？', opts: ['沙子', '刷子', '狗'], a: 0, kind: 'recall' },
      { q: '读到最后之前，你猜奶奶他们接下来会怎么样？', opts: ['只把中文看一遍', '一直重复原来那个动作', '再耐心等一等，就看见变化了'], a: 2, kind: 'infer' },
      { q: '学一样本领练了几天没进步（像等鱼那样），你会怎么做？', opts: ['认定自己学不会', '立刻换一件别的事', '按原来的方法接着练，过几天再看'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b28', lv: 'L3', tag: '故事', title: 'The King and a Ring', zh: '国王和戒指',
    emoji: '👑', color: '#C6DEF6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「跟读整句」这条线，认读 3 个新词。',
    trap: 'sh 把嘴唇撅圆、th 把舌尖轻轻放在上下门牙中间；ck 只发一个 k，别读两遍。',
    summary: '《国王和戒指》是「跟读整句」：爷爷和爸爸在操场，围绕图画把一件事读到底。本本词卡：薯片、国王、午饭。读前先看词卡，读完合上书说一说。',
    retell: '三句话复述：先……、后来……、最后……（这一本是「跟读整句」。）',
    think: '挑书里最长的一句英文，先听整句，再分成两段读给家长听。',
    pre: [
      { art: '🍚', en: 'chips', zh: '薯片' },
      { art: '👑', en: 'king', zh: '国王' },
      { art: '📦', en: 'lunch', zh: '午饭' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👴', en: 'grandpa', zh: '爷爷' }
    ],
    sight: ['photo', 'picture', 'playground'],
    newWords: [
      { w: 'chips', zh: '薯片' },
      { w: 'king', zh: '国王' },
      { w: 'lunch', zh: '午饭' }
    ],
    pages: [
      { art: 'playground|grandpa,dad|picture|·', en: 'Grandpa opens a book on the playground.', zh: '爷爷在操场翻开一本书。' },
      { art: 'playground|grandpa,dad|picture|♪', en: 'Grandpa wants to read it out loud.', zh: '爷爷想把它读出来。' },
      { art: 'playground|grandpa,dad|picture|👀', en: 'The sentence with the word "picture" is long. We say the words: chips, king and lunch.', zh: '带着「picture」这个词的那一句很长。我们念这三个词：薯片、国王和午饭。' },
      { art: 'playground|grandpa,dad|picture|?', en: '"Where do I stop for breath?" asks Grandpa.', zh: '「在哪里换气？」爷爷问。' },
      { art: 'playground|grandpa,dad|picture|·', en: 'Grandpa reads it one word at a time.', zh: '爷爷一个词一个词地读。' },
      { art: 'playground|grandpa,dad|picture|!', en: 'It sounds broken, not like a sentence.', zh: '听着是碎的，不像一句话。' },
      { art: 'playground|grandpa,dad|picture|★', en: 'Now it sounds like one sentence. We look at the chips and the king.', zh: '这下听起来像一整句了。我们看看薯片和国王。' },
      { art: 'playground|grandpa,dad|picture|·', en: 'They try the next sentence about a photo.', zh: '他们接着试讲照片的下一句。' }
    ],
    quiz: [
      { q: '爷爷和爸爸的这一本里，出现了下面哪一样？', opts: ['奶奶', '奶酪', '国王'], a: 2, kind: 'recall' },
      { q: '读到最后之前，你猜爷爷他们接下来会怎么样？', opts: ['听完整句、分成两段读，就连贯了', '把东西丢下不管了', '把东西丢下不管了（放）'], a: 0, kind: 'infer' },
      { q: '遇到像「picture」那一句这样很长的英文句子，你会怎么读？', opts: ['一个词一个词慢慢拼', '先听整句，再按意思分成两三段读', '只看中文跳过英文'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b29', lv: 'L3', tag: '观察', title: 'A Moth on the Path', zh: '小路上的飞蛾',
    emoji: '🦋', color: '#E0CFF3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「找回来」这条线，认读 3 个新词。',
    trap: 'sh 把嘴唇撅圆、th 把舌尖轻轻放在上下门牙中间；ck 只发一个 k，别读两遍。',
    summary: '《小路上的飞蛾》是「找回来」：妈妈和明明在公园，围绕飞蛾把一件事读到底。本本词卡：长椅、刷子、奶酪。读前先看词卡，读完合上书说一说。',
    retell: '三句话复述：先……、后来……、最后……（这一本是「找回来」。）',
    think: '说一说你有没有把东西放忘了的时候：先说在哪儿丢的，再说最后在哪儿找到。',
    pre: [
      { art: '🪑', en: 'bench', zh: '长椅' },
      { art: '🖌️', en: 'brush', zh: '刷子' },
      { art: '🧀', en: 'cheese', zh: '奶酪' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'and', zh: 'and' }
    ],
    sight: ['park'],
    newWords: [
      { w: 'bench', zh: '长椅' },
      { w: 'brush', zh: '刷子' },
      { w: 'cheese', zh: '奶酪' }
    ],
    pages: [
      { art: 'park|mom,ming|moth|·', en: 'Mom and Ming are in the park.', zh: '妈妈和明明在公园。' },
      { art: 'park|mom,ming|moth|♪', en: 'Mom wants a moth.', zh: '妈妈想要飞蛾。' },
      { art: 'park|mom,ming|moth|👀', en: 'They look at the fish and the pen. We say the words: bench, brush and cheese.', zh: '他们看看鱼和笔。我们念这三个词：长椅、刷子和奶酪。' },
      { art: 'park|mom,ming|moth|?', en: '"Where is my moth?" asks Mom.', zh: '「我的飞蛾呢？」妈妈问。' },
      { art: 'park|mom,ming|moth|·', en: 'They look here, and they look there.', zh: '他们这儿看看，那儿看看。' },
      { art: 'park|mom,ming|moth|!', en: 'No moth. Not here, not there.', zh: '没有飞蛾。这儿没有，那儿也没有。' },
      { art: 'park|mom,ming|moth|★', en: 'There it is! The moth was in the park all along. We look at the bench and the brush.', zh: '在那儿！飞蛾一直在公园。我们看看长椅和刷子。' },
      { art: 'park|mom,ming|moth|·', en: 'They put the moth back where it belongs.', zh: '他们把飞蛾放回原处。' }
    ],
    quiz: [
      { q: '在公园读的这一本里，有下面哪一样？', opts: ['午饭', '绿色', '公园'], a: 2, kind: 'recall' },
      { q: '读到最后之前，你猜妈妈他们接下来会怎么样？', opts: ['回头再慢慢找一遍，就在公园找到了', '换一本书不读了（笔）', '换一本书不读了'], a: 0, kind: 'infer' },
      { q: '如果你的飞蛾找不到了，你会先做什么？', opts: ['马上再买一个新的', '先回到最开始的地方慢慢找一遍', '不找了，直接走开'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b30', lv: 'L3', tag: '海边', title: 'Sing at the Beach', zh: '在沙滩上唱歌',
    emoji: '🏖️', color: '#F6C9E3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「跟读整句」这条线，认读 1 个新词。',
    trap: 'sh 把嘴唇撅圆、th 把舌尖轻轻放在上下门牙中间；ck 只发一个 k，别读两遍。',
    summary: '《在沙滩上唱歌》是「跟读整句」：爸爸和丽丽在沙滩，围绕沙滩把一件事读到底。本本词卡：小鸡。读前先看词卡，读完合上书说一说。',
    retell: '三句话复述：先……、后来……、最后……（这一本是「跟读整句」。）',
    think: '挑书里最长的一句英文，先听整句，再分成两段读给家长听。',
    pre: [
      { art: '📦', en: 'chick', zh: '小鸡' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👨', en: 'dad', zh: '爸爸' }
    ],
    sight: ['beach', 'clock'],
    newWords: [
      { w: 'chick', zh: '小鸡' }
    ],
    pages: [
      { art: 'beach|dad,lili|beach|·', en: 'Dad opens a book at the beach.', zh: '爸爸在沙滩翻开一本书。' },
      { art: 'beach|dad,lili|beach|♪', en: 'Dad wants to read it out loud.', zh: '爸爸想把它读出来。' },
      { art: 'beach|dad,lili|beach|👀', en: 'The sentence with the word "beach" is long. We say the words: chick, egg and fan.', zh: '带着「beach」这个词的那一句很长。我们念这三个词：小鸡、鸡蛋和扇子。' },
      { art: 'beach|dad,lili|beach|?', en: '"Where do I stop for breath?" asks Dad.', zh: '「在哪里换气？」爸爸问。' },
      { art: 'beach|dad,lili|beach|·', en: 'Dad reads it one word at a time.', zh: '爸爸一个词一个词地读。' },
      { art: 'beach|dad,lili|beach|!', en: 'It sounds broken, not like a sentence.', zh: '听着是碎的，不像一句话。' },
      { art: 'beach|dad,lili|beach|★', en: 'Now it sounds like one sentence. We look at the chick and the egg.', zh: '这下听起来像一整句了。我们看看小鸡和鸡蛋。' },
      { art: 'beach|dad,lili|beach|·', en: 'They try the next sentence about a clock.', zh: '他们接着试讲钟的下一句。' }
    ],
    quiz: [
      { q: '这一本里，爸爸看到了下面哪一样？', opts: ['家', '拖把', '钟'], a: 2, kind: 'recall' },
      { q: '读到最后之前，你猜爸爸他们接下来会怎么样？', opts: ['只把中文看一遍（旗子）', '听完整句、分成两段读，就连贯了', '只把中文看一遍'], a: 1, kind: 'infer' },
      { q: '遇到像「beach」那一句这样很长的英文句子，你会怎么读？', opts: ['只看中文跳过英文', '一个词一个词慢慢拼', '先听整句，再按意思分成两三段读'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b31', lv: 'L3', tag: '家务', title: 'Wash the Dish', zh: '洗盘子',
    emoji: '🍽️', color: '#BFE6DF',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「等它长」这条线，不引入新词，全部是读过的词。',
    trap: 'sh 把嘴唇撅圆、th 把舌尖轻轻放在上下门牙中间；ck 只发一个 k，别读两遍。',
    summary: '《洗盘子》是「等它长」：明明和奶奶在家，围绕盘子把一件事读到底。本本词卡：这一本不引入新词，全部是读过的词。读前先看词卡，读完合上书说一说。',
    retell: '三句话复述：先……、后来……、最后……（这一本是「等它长」。）',
    think: '说一件练了很久才看见进步的事，讲讲等待的时候你是怎么想的。',
    pre: [
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👦', en: 'ming', zh: '明明' }
    ],
    sight: [],
    newWords: [

    ],
    pages: [
      { art: 'home|ming,grandma|dish|·', en: 'Ming puts a dish at home.', zh: '明明把盘子放在家。' },
      { art: 'home|ming,grandma|dish|♪', en: 'Ming wants to see it change.', zh: '明明想看见它变样。' },
      { art: 'home|ming,grandma|dish|👀', en: 'On the first day, nothing looks different. We say the words: egg, fan and fish.', zh: '头一天，看不出什么变化。我们念这三个词：鸡蛋、扇子和鱼。' },
      { art: 'home|ming,grandma|dish|?', en: '"Is it working at all?" asks Ming.', zh: '「到底有没有在长？」明明问。' },
      { art: 'home|ming,grandma|dish|·', en: 'They look again the next morning.', zh: '第二天早上他们又去看。' },
      { art: 'home|ming,grandma|dish|!', en: 'Still the same. Ming wants to give up.', zh: '还是老样子。明明想算了。' },
      { art: 'home|ming,grandma|dish|★', en: 'One morning, there is a small change. We look at the egg and the fan.', zh: '有一天早上，出现了一点小变化。我们看看鸡蛋和扇子。' },
      { art: 'home|ming,grandma|dish|·', en: 'They will come back and look again tomorrow.', zh: '明天他们还会再来看。' }
    ],
    quiz: [
      { q: '明明和奶奶的这一本里，出现了下面哪一样？', opts: ['扇子', '丽丽', '小路'], a: 0, kind: 'recall' },
      { q: '读到最后之前，你猜明明他们接下来会怎么样？', opts: ['再耐心等一等，就看见变化了', '跳过中间那几页', '把东西丢下不管了'], a: 0, kind: 'infer' },
      { q: '学一样本领练了几天没进步（像等盘子那样），你会怎么做？', opts: ['认定自己学不会', '立刻换一件别的事', '按原来的方法接着练，过几天再看'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b32', lv: 'L3', tag: '故事', title: 'A Wish for a Chick', zh: '给小鸡的愿望',
    emoji: '🐤', color: '#F2E2A8',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「修好它」这条线，不引入新词，全部是读过的词。',
    trap: 'sh 把嘴唇撅圆、th 把舌尖轻轻放在上下门牙中间；ck 只发一个 k，别读两遍。',
    summary: '《给小鸡的愿望》是「修好它」：丽丽和爷爷在家，围绕小鸡把一件事读到底。本本词卡：这一本不引入新词，全部是读过的词。读前先看词卡，读完合上书说一说。',
    retell: '三句话复述：先……、后来……、最后……（这一本是「修好它」。）',
    think: '说一样坏过的东西：你一开始反复试了什么？后来发现真正的问题在哪儿？',
    pre: [
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'at', zh: 'at' }
    ],
    sight: [],
    newWords: [

    ],
    pages: [
      { art: 'home|lili,grandpa|chick|·', en: 'The chick does not work at home.', zh: '家的小鸡不好使了。' },
      { art: 'home|lili,grandpa|chick|♪', en: 'Lili wants to fix it.', zh: '丽丽想把它修好。' },
      { art: 'home|lili,grandpa|chick|👀', en: 'They look at it from every side. We say the words: fan, fish and fog.', zh: '他们从各个面都看了一遍。我们念这三个词：扇子、鱼和雾。' },
      { art: 'home|lili,grandpa|chick|?', en: '"What did we change?" asks Grandpa.', zh: '「我们改过什么？」爷爷问。' },
      { art: 'home|lili,grandpa|chick|·', en: 'Lili tries the same thing again.', zh: '丽丽照原样又试了一次。' },
      { art: 'home|lili,grandpa|chick|!', en: 'It still does not work.', zh: '还是不行。' },
      { art: 'home|lili,grandpa|chick|★', en: 'Now the chick works again. We look at the fan and the fish.', zh: '小鸡又能用了。我们看看扇子和鱼。' },
      { art: 'home|lili,grandpa|chick|·', en: 'They remember to look before they try again.', zh: '他们记住了：再试之前，先看一看。' }
    ],
    quiz: [
      { q: '在家读的这一本里，有下面哪一样？', opts: ['米饭', '雾', '泥'], a: 1, kind: 'recall' },
      { q: '读到最后之前，你猜丽丽他们接下来会怎么样？', opts: ['换一本书不读了', '一直重复原来那个动作', '停下来找出那个小毛病，就修好了'], a: 2, kind: 'infer' },
      { q: '一件事反复做还是不行（像修小鸡那样），你会怎么做？', opts: ['先停下来看看是不是漏了一处小的', '干脆换个人做', '把同样的动作再做十遍'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b33', lv: 'L3', tag: '发音', title: 'Say It: Ship, Chip', zh: '说一说：ship chip',
    emoji: '🗣️', color: '#D9D2F5',
    track: 'drill',
    goal: '把本级难点音听准、说准，并能在整句里读对。这一本走「问一问」这条线，不引入新词，全部是读过的词。',
    trap: 'sh 把嘴唇撅圆、th 把舌尖轻轻放在上下门牙中间；ck 只发一个 k，别读两遍。',
    summary: '《说一说：ship chip》是「问一问」：奶奶和妈妈在家，围绕轮船把一件事读到底。本本词卡：这一本不引入新词，全部是读过的词。读前先看词卡，读完合上书说一说。',
    retell: '三句话复述：先……、后来……、最后……（这一本是「问一问」。）',
    think: '回想一次「问了还是没懂」：把当时的问题改成一个更小的、指着某个词的问题。',
    pre: [
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👵', en: 'grandma', zh: '奶奶' }
    ],
    sight: [],
    newWords: [

    ],
    pages: [
      { art: 'home|grandma,mom|ship|·', en: 'Grandma is reading the word "ship" at home.', zh: '奶奶在家读「ship」这个词。' },
      { art: 'home|grandma,mom|ship|♪', en: 'Grandma wants to understand it.', zh: '奶奶想把它弄明白。' },
      { art: 'home|grandma,mom|ship|👀', en: 'One sentence does not make sense. We say the words: fish, fog and fox.', zh: '有一句怎么也读不通。我们念这三个词：鱼、雾和狐狸。' },
      { art: 'home|grandma,mom|ship|?', en: '"What does this part mean?" asks Grandma.', zh: '「这一段什么意思？」奶奶问。' },
      { art: 'home|grandma,mom|ship|·', en: 'Mom answers, but Grandma still looks lost.', zh: '妈妈答了，奶奶还是没懂。' },
      { art: 'home|grandma,mom|ship|!', en: 'The answer was right, but not the right answer.', zh: '答案没错，却不是问的那个。' },
      { art: 'home|grandma,mom|ship|★', en: 'Now the whole sentence is clear. We look at the fish and the fog.', zh: '这下整句都清楚了。我们看看鱼和雾。' },
      { art: 'home|grandma,mom|ship|·', en: 'They write down one new question.', zh: '他们又写下一个新问题。' }
    ],
    quiz: [
      { q: '这一本里，奶奶看到了下面哪一样？', opts: ['轮船', '别针', '三'], a: 0, kind: 'recall' },
      { q: '读到最后之前，你猜奶奶他们接下来会怎么样？', opts: ['把东西丢下不管了', '只把中文看一遍', '指着自己不懂的那个词再问一遍，就明白了'], a: 2, kind: 'infer' },
      { q: '别人把「ship」解释完你还是没懂，你会怎么做？', opts: ['把整段跳过去', '指出具体哪个词不懂，再问一遍', '点点头装作懂了'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b34', lv: 'L3', tag: '小知识', title: 'A Long Wing', zh: '长长的翅膀',
    emoji: '🕊️', color: '#FAD3B6',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。这一本走「问一问」这条线，不引入新词，全部是读过的词。',
    trap: 'sh 把嘴唇撅圆、th 把舌尖轻轻放在上下门牙中间；ck 只发一个 k，别读两遍。',
    summary: '《长长的翅膀》是「问一问」：爷爷和爸爸在花园，围绕翅膀把一件事读到底。本本词卡：这一本不引入新词，全部是读过的词。读前先看词卡，读完合上书说一说。',
    retell: '三句话复述：先……、后来……、最后……（这一本是「问一问」。）',
    think: '回想一次「问了还是没懂」：把当时的问题改成一个更小的、指着某个词的问题。',
    pre: [
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👴', en: 'grandpa', zh: '爷爷' }
    ],
    sight: ['friend', 'garden'],
    newWords: [

    ],
    pages: [
      { art: 'garden|grandpa,dad|wing|·', en: 'Grandpa is reading the word "wing" in the garden.', zh: '爷爷在花园读「wing」这个词。' },
      { art: 'garden|grandpa,dad|wing|♪', en: 'Grandpa wants to understand it.', zh: '爷爷想把它弄明白。' },
      { art: 'garden|grandpa,dad|wing|👀', en: 'One sentence does not make sense. We say the words: fog, fox and friend.', zh: '有一句怎么也读不通。我们念这三个词：雾、狐狸和朋友。' },
      { art: 'garden|grandpa,dad|wing|?', en: '"What does this part mean?" asks Grandpa.', zh: '「这一段什么意思？」爷爷问。' },
      { art: 'garden|grandpa,dad|wing|·', en: 'Dad answers, but Grandpa still looks lost.', zh: '爸爸答了，爷爷还是没懂。' },
      { art: 'garden|grandpa,dad|wing|!', en: 'The answer was right, but not the right answer.', zh: '答案没错，却不是问的那个。' },
      { art: 'garden|grandpa,dad|wing|★', en: 'Now the whole sentence is clear. We look at the fog and the fox.', zh: '这下整句都清楚了。我们看看雾和狐狸。' },
      { art: 'garden|grandpa,dad|wing|·', en: 'They write down one new question.', zh: '他们又写下一个新问题。' }
    ],
    quiz: [
      { q: '爷爷和爸爸的这一本里，出现了下面哪一样？', opts: ['浴盆', '狐狸', '米饭'], a: 1, kind: 'recall' },
      { q: '读到最后之前，你猜爷爷他们接下来会怎么样？', opts: ['把东西丢下不管了', '指着自己不懂的那个词再问一遍，就明白了', '换一本书不读了'], a: 1, kind: 'infer' },
      { q: '别人把「wing」解释完你还是没懂，你会怎么做？', opts: ['点点头装作懂了', '把整段跳过去', '指出具体哪个词不懂，再问一遍'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b35', lv: 'L3', tag: '小知识', title: 'Fresh Cheese', zh: '新鲜的奶酪',
    emoji: '🧀', color: '#C8E7F0',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。这一本走「合上书讲一遍」这条线，不引入新词，全部是读过的词。',
    trap: 'sh 把嘴唇撅圆、th 把舌尖轻轻放在上下门牙中间；ck 只发一个 k，别读两遍。',
    summary: '《新鲜的奶酪》是「合上书讲一遍」：妈妈和明明在家，围绕奶酪把一件事读到底。本本词卡：这一本不引入新词，全部是读过的词。读前先看词卡，读完合上书说一说。',
    retell: '三句话复述：先……、后来……、最后……（这一本是「合上书讲一遍」。）',
    think: '合上书，用「谁 → 在哪儿 → 出了什么事 → 结果」把奶酪这一本讲给家长听。',
    pre: [
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👩', en: 'mom', zh: '妈妈' }
    ],
    sight: ['cheese', 'friend'],
    newWords: [

    ],
    pages: [
      { art: 'home|mom,ming|cheese|·', en: 'Mom has just finished a book at home.', zh: '妈妈刚在家读完一本书。' },
      { art: 'home|mom,ming|cheese|♪', en: 'Ming wants to hear all about it.', zh: '明明想听他讲讲。' },
      { art: 'home|mom,ming|cheese|👀', en: 'Mom thinks about the cheese in the book. We say the words: fox, friend and grandma.', zh: '妈妈想着书里的奶酪。我们念这三个词：狐狸、朋友和奶奶。' },
      { art: 'home|mom,ming|cheese|?', en: '"Where do I start?" asks Mom.', zh: '「从哪儿讲起？」妈妈问。' },
      { art: 'home|mom,ming|cheese|·', en: 'Mom tells the last part first.', zh: '妈妈先讲了结尾。' },
      { art: 'home|mom,ming|cheese|!', en: 'Ming cannot follow the story.', zh: '明明听不明白。' },
      { art: 'home|mom,ming|cheese|★', en: 'This time Ming can see the whole thing. We look at the fox and the friend.', zh: '这回明明全听明白了。我们看看狐狸和朋友。' },
      { art: 'home|mom,ming|cheese|·', en: 'Tomorrow they will read about a bun.', zh: '明天他们要读讲小面包的书。' }
    ],
    quiz: [
      { q: '在家读的这一本里，有下面哪一样？', opts: ['鸟', '翅膀', '朋友'], a: 2, kind: 'recall' },
      { q: '读到最后之前，你猜妈妈他们接下来会怎么样？', opts: ['换一本书不读了', '按「谁 → 在哪儿 → 出了什么事」重讲一遍，别人就听懂了', '只把中文看一遍'], a: 1, kind: 'infer' },
      { q: '要把讲奶酪的这本读过的书讲给别人听，你会怎么开头？', opts: ['先报书名和生词表', '先说谁、在哪儿，再按顺序说出了什么事', '直接从最精彩的那句开始'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b36', lv: 'L3', tag: '复习', title: 'Down by the Shed', zh: '棚子边',
    emoji: '🛖', color: '#E8D9B5',
    track: 'review',
    goal: '把本级和前面级别的词再读一遍、串成一个故事。这一本走「比一比」这条线，不引入新词，全部是读过的词。',
    trap: 'sh 把嘴唇撅圆、th 把舌尖轻轻放在上下门牙中间；ck 只发一个 k，别读两遍。',
    summary: '《棚子边》是「比一比」：爸爸和丽丽在图书馆，围绕小棚把一件事读到底。本本词卡：这一本不引入新词，全部是读过的词。读前先看词卡，读完合上书说一说。',
    retell: '三句话复述：先……、后来……、最后……（这一本是「比一比」。）',
    think: '找两样很像的东西，用英文说出至少两处不同，说说你是按什么顺序找的。',
    pre: [
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'and', zh: 'and' }
    ],
    sight: ['friend', 'park'],
    newWords: [

    ],
    pages: [
      { art: 'library|dad,lili|shed|·', en: 'Dad looks at a shed and a shop.', zh: '爸爸看着小棚和小店。' },
      { art: 'library|dad,lili|shed|♪', en: 'They want to know how they are different.', zh: '他们想知道两样有什么不一样。' },
      { art: 'library|dad,lili|shed|👀', en: 'At first the two look the same. We say the words: friend, grandma and grandpa.', zh: '乍一看，两样挺像。我们念这三个词：朋友、奶奶和爷爷。' },
      { art: 'library|dad,lili|shed|?', en: '"What is not the same?" asks Lili.', zh: '「哪里不一样？」丽丽问。' },
      { art: 'library|dad,lili|shed|·', en: 'They put them side by side.', zh: '他们把两样并排放。' },
      { art: 'library|dad,lili|shed|!', en: 'Looking from far away does not help.', zh: '远远地看，还是看不出。' },
      { art: 'library|dad,lili|shed|★', en: 'There! One small part is different. We look at the friend and the grandma.', zh: '有了！有一处小小的不同。我们看看朋友和奶奶。' },
      { art: 'library|dad,lili|shed|·', en: 'Next they will compare the shop and the park.', zh: '接着他们要比一比小店和公园。' }
    ],
    quiz: [
      { q: '这一本里，爸爸看到了下面哪一样？', opts: ['公园', '公交车', '球'], a: 0, kind: 'recall' },
      { q: '读到最后之前，你猜爸爸他们接下来会怎么样？', opts: ['并排放好一处一处看，就找出不同了', '跳过中间那几页', '只把中文看一遍'], a: 0, kind: 'infer' },
      { q: '要找出像小棚和小店这样很像的两样东西哪里不同，你会怎么做？', opts: ['只挑一个看', '隔很远扫一眼', '并排放好，一处一处分开看'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b37', lv: 'L4', tag: '池塘', title: 'The Frog on the Stone', zh: '石头上的青蛙',
    emoji: '🐸', color: '#F6C6C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「找回来」这条线，认读 3 个新词。',
    trap: '连缀中间不加元音：tree 是「tr-ee」一个词，不是「特-瑞」两个音。',
    summary: '《石头上的青蛙》是「找回来」：明明和奶奶在公园，围绕青蛙把一件事读到底。本本词卡：青蛙、礼物、手套。读前先看词卡，读完合上书说一说。',
    retell: '四句话复述：谁、在哪儿、遇到什么麻烦、怎么解决。（这一本是「找回来」。）',
    think: '说一说你有没有把东西放忘了的时候：先说在哪儿丢的，再说最后在哪儿找到。',
    pre: [
      { art: '🐸', en: 'frog', zh: '青蛙' },
      { art: '🎁', en: 'gift', zh: '礼物' },
      { art: '📦', en: 'glove', zh: '手套' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'and', zh: 'and' }
    ],
    sight: ['park'],
    newWords: [
      { w: 'frog', zh: '青蛙' },
      { w: 'gift', zh: '礼物' },
      { w: 'glove', zh: '手套' }
    ],
    pages: [
      { art: 'park|ming,grandma|frog|·', en: 'Ming and Grandma are in the park.', zh: '明明和奶奶在公园。' },
      { art: 'park|ming,grandma|frog|♪', en: 'Ming wants a frog.', zh: '明明想要青蛙。' },
      { art: 'park|ming,grandma|frog|👀', en: 'They look at the kite and the map. They wrote down frog, gift and glove.', zh: '他们看看风筝和地图。他们写下：青蛙、礼物和手套。' },
      { art: 'park|ming,grandma|frog|?', en: '"Where is my frog?" asks Ming.', zh: '「我的青蛙呢？」明明问。' },
      { art: 'park|ming,grandma|frog|·', en: 'They look here, and they look there.', zh: '他们这儿看看，那儿看看。' },
      { art: 'park|ming,grandma|frog|!', en: 'No frog. Not here, not there.', zh: '没有青蛙。这儿没有，那儿也没有。' },
      { art: 'park|ming,grandma|kite|♥', en: 'Grandma says, "Let us go back and look again."', zh: '奶奶说：「我们回去再找一遍。」' },
      { art: 'park|ming,grandma|frog|★', en: 'There it is! The frog was in the park all along. We look at the frog and the gift.', zh: '在那儿！青蛙一直在公园。我们看看青蛙和礼物。' },
      { art: 'park|ming,grandma|frog|·', en: 'They put the frog back where it belongs.', zh: '他们把青蛙放回原处。' }
    ],
    quiz: [
      { q: '明明和奶奶的这一本里，出现了下面哪一样？', opts: ['扇子', '小山', '公园'], a: 2, kind: 'recall' },
      { q: '为什么第一遍没找到青蛙？', opts: ['因为天黑了', '看得太快，漏掉了最开始的地方', '因为青蛙不见了'], a: 1, kind: 'infer' },
      { q: '如果你的青蛙找不到了，你会先做什么？', opts: ['不找了，直接走开', '马上再买一个新的', '先回到最开始的地方慢慢找一遍'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b38', lv: 'L4', tag: '运动会', title: 'A Blue Flag', zh: '蓝色的旗子',
    emoji: '🚩', color: '#F9DFB4',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「一起做」这条线，认读 3 个新词。',
    trap: '连缀中间不加元音：tree 是「tr-ee」一个词，不是「特-瑞」两个音。',
    summary: '《蓝色的旗子》是「一起做」：丽丽和爷爷在操场，围绕旗子把一件事读到底。本本词卡：旗子、光、李子。读前先看词卡，读完合上书说一说。',
    retell: '四句话复述：谁、在哪儿、遇到什么麻烦、怎么解决。（这一本是「一起做」。）',
    think: '说一件你做过的、步骤很多的事：哪一步最容易漏？下次怎么提醒自己？',
    pre: [
      { art: '🚩', en: 'flag', zh: '旗子' },
      { art: '🌿', en: 'light', zh: '光' },
      { art: '🍚', en: 'plum', zh: '李子' },
      { art: '📦', en: 'they', zh: 'they' },
      { art: '📦', en: 'the', zh: 'the' }
    ],
    sight: ['playground'],
    newWords: [
      { w: 'flag', zh: '旗子' },
      { w: 'light', zh: '光' },
      { w: 'plum', zh: '李子' }
    ],
    pages: [
      { art: 'playground|lili,grandpa|flag|·', en: 'Lili has an idea on the playground.', zh: '丽丽在操场有了个主意。' },
      { art: 'playground|lili,grandpa|flag|♪', en: '"Let us make a flag," says Lili.', zh: '「我们做旗子吧。」丽丽说。' },
      { art: 'playground|lili,grandpa|flag|👀', en: 'They get everything ready. They wrote down flag, light and plum.', zh: '他们把要用的东西备齐。他们写下：旗子、光和李子。' },
      { art: 'playground|lili,grandpa|flag|?', en: '"What do we need first?" asks Grandpa.', zh: '「先要什么？」爷爷问。' },
      { art: 'playground|lili,grandpa|flag|·', en: 'They make a list, and they start.', zh: '他们列了个单子，就动手了。' },
      { art: 'playground|lili,grandpa|flag|!', en: 'It does not look right. Something is wrong.', zh: '样子不对，哪里出了岔子。' },
      { art: 'playground|lili,grandpa|box|♥', en: 'Grandpa reads the list again, out loud.', zh: '爷爷把单子又大声念了一遍。' },
      { art: 'playground|lili,grandpa|flag|★', en: 'This time the flag is just right. We look at the flag and the light.', zh: '这次旗子正好。我们看看旗子和光。' },
      { art: 'playground|lili,grandpa|flag|·', en: 'They write down what they would do next time.', zh: '他们写下下次要怎么做。' }
    ],
    quiz: [
      { q: '在操场读的这一本里，有下面哪一样？', opts: ['旗子', '水壶', '青蛙'], a: 0, kind: 'recall' },
      { q: '丽丽第一次为什么没做成旗子？', opts: ['因为没人帮忙', '因为材料不够', '两步并成一步，漏了顺序'], a: 2, kind: 'infer' },
      { q: '做一件步骤很多的事（像做旗子那样），你会先做什么？', opts: ['想到哪步做哪步', '直接跳过开头的步骤', '先把步骤写下来，再一步一步做'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b39', lv: 'L4', tag: '夜空', title: 'Stars in the Sky', zh: '天上的星星',
    emoji: '⭐', color: '#CDE7C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「问一问」这条线，认读 3 个新词。',
    trap: '连缀中间不加元音：tree 是「tr-ee」一个词，不是「特-瑞」两个音。',
    summary: '《天上的星星》是「问一问」：奶奶和妈妈在家，围绕星星把一件事读到底。本本词卡：星星、云、螃蟹。读前先看词卡，读完合上书说一说。',
    retell: '四句话复述：谁、在哪儿、遇到什么麻烦、怎么解决。（这一本是「问一问」。）',
    think: '回想一次「问了还是没懂」：把当时的问题改成一个更小的、指着某个词的问题。',
    pre: [
      { art: '⭐', en: 'star', zh: '星星' },
      { art: '☁️', en: 'cloud', zh: '云' },
      { art: '🦀', en: 'crab', zh: '螃蟹' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👵', en: 'grandma', zh: '奶奶' }
    ],
    sight: [],
    newWords: [
      { w: 'star', zh: '星星' },
      { w: 'cloud', zh: '云' },
      { w: 'crab', zh: '螃蟹' }
    ],
    pages: [
      { art: 'home|grandma,mom|star|·', en: 'Grandma is reading the word "star" at home.', zh: '奶奶在家读「star」这个词。' },
      { art: 'home|grandma,mom|star|♪', en: 'Grandma wants to understand it.', zh: '奶奶想把它弄明白。' },
      { art: 'home|grandma,mom|star|👀', en: 'One sentence does not make sense. They wrote down star, cloud and crab.', zh: '有一句怎么也读不通。他们写下：星星、云和螃蟹。' },
      { art: 'home|grandma,mom|star|?', en: '"What does this part mean?" asks Grandma.', zh: '「这一段什么意思？」奶奶问。' },
      { art: 'home|grandma,mom|star|·', en: 'Mom answers, but Grandma still looks lost.', zh: '妈妈答了，奶奶还是没懂。' },
      { art: 'home|grandma,mom|star|!', en: 'The answer was right, but not the right answer.', zh: '答案没错，却不是问的那个。' },
      { art: 'home|grandma,mom|rock|♥', en: 'Mom asks, "Which word is the hard one?"', zh: '妈妈反问：「难的是哪个词？」' },
      { art: 'home|grandma,mom|star|★', en: 'Now the whole sentence is clear. We look at the star and the cloud.', zh: '这下整句都清楚了。我们看看星星和云。' },
      { art: 'home|grandma,mom|star|·', en: 'They write down one new question.', zh: '他们又写下一个新问题。' }
    ],
    quiz: [
      { q: '这一本里，奶奶看到了下面哪一样？', opts: ['螃蟹', '拖把', '小山'], a: 0, kind: 'recall' },
      { q: '奶奶第一次为什么没听懂「star」？', opts: ['因为读得太快', '因为答案太短', '问题太大，没指向真正卡住的那个词'], a: 2, kind: 'infer' },
      { q: '别人把「star」解释完你还是没懂，你会怎么做？', opts: ['指出具体哪个词不懂，再问一遍', '把整段跳过去', '点点头装作懂了'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b40', lv: 'L4', tag: '上学', title: 'The Clock at School', zh: '学校的钟',
    emoji: '🕐', color: '#C6DEF6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「帮个忙」这条线，认读 3 个新词。',
    trap: '连缀中间不加元音：tree 是「tr-ee」一个词，不是「特-瑞」两个音。',
    summary: '《学校的钟》是「帮个忙」：爷爷和爸爸在学校，围绕钟把一件事读到底。本本词卡：雪、茎、石头。读前先看词卡，读完合上书说一说。',
    retell: '四句话复述：谁、在哪儿、遇到什么麻烦、怎么解决。（这一本是「帮个忙」。）',
    think: '说一次你请人帮忙的经历：开口之前你卡在哪儿？对方先看出了什么？',
    pre: [
      { art: '❄️', en: 'snow', zh: '雪' },
      { art: '🌿', en: 'stem', zh: '茎' },
      { art: '🌿', en: 'stone', zh: '石头' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👴', en: 'grandpa', zh: '爷爷' }
    ],
    sight: [],
    newWords: [
      { w: 'snow', zh: '雪' },
      { w: 'stem', zh: '茎' },
      { w: 'stone', zh: '石头' }
    ],
    pages: [
      { art: 'school|grandpa,dad|clock|·', en: 'Grandpa is at school with a clock.', zh: '爷爷带着钟在学校。' },
      { art: 'school|grandpa,dad|clock|♪', en: 'Grandpa wants to do it alone.', zh: '爷爷想自己一个人做。' },
      { art: 'school|grandpa,dad|clock|👀', en: 'The clock is too much for one pair of hands. They wrote down snow, stem and stone.', zh: '一个人搬不动这个钟。他们写下：雪、茎和石头。' },
      { art: 'school|grandpa,dad|clock|?', en: '"Can you help me?" asks Grandpa.', zh: '「能帮我一下吗？」爷爷问。' },
      { art: 'school|grandpa,dad|clock|·', en: 'They both pull, but it does not move.', zh: '两个人一起拉，还是不动。' },
      { art: 'school|grandpa,dad|clock|!', en: 'Pulling harder does not help.', zh: '再用力也没用。' },
      { art: 'school|grandpa,dad|mop|♥', en: 'Dad stops and thinks.', zh: '爸爸停下来想了想。' },
      { art: 'school|grandpa,dad|clock|★', en: 'Now the clock moves easily. We look at the snow and the stem.', zh: '这下钟轻轻就动了。我们看看雪和茎。' },
      { art: 'school|grandpa,dad|clock|·', en: 'Next time they will look around first.', zh: '下次他们会先看看四周。' }
    ],
    quiz: [
      { q: '爷爷和爸爸的这一本里，出现了下面哪一样？', opts: ['石头', '别针', '牛奶'], a: 0, kind: 'recall' },
      { q: '搬钟时，真正挡路的是什么？', opts: ['两个人力气太小', '钟太重了', '拖把，不是钟'], a: 2, kind: 'infer' },
      { q: '两个人一起使劲还是搬不动钟，你会怎么做？', opts: ['就这么算了', '叫更多人一起使劲', '先停一下，看看是不是有别的东西挡着'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b41', lv: 'L4', tag: '观察', title: 'Grass and a Crab', zh: '草和螃蟹',
    emoji: '🦀', color: '#E0CFF3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「数一数」这条线，认读 3 个新词。',
    trap: '连缀中间不加元音：tree 是「tr-ee」一个词，不是「特-瑞」两个音。',
    summary: '《草和螃蟹》是「数一数」：妈妈和明明在花园，围绕草把一件事读到底。本本词卡：草、篮子、面包。读前先看词卡，读完合上书说一说。',
    retell: '四句话复述：谁、在哪儿、遇到什么麻烦、怎么解决。（这一本是「数一数」。）',
    think: '找家里三样能数的东西，用英文数一遍，说说你怎么保证不数重。',
    pre: [
      { art: '🌿', en: 'grass', zh: '草' },
      { art: '📦', en: 'basket', zh: '篮子' },
      { art: '🍞', en: 'bread', zh: '面包' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👩', en: 'mom', zh: '妈妈' }
    ],
    sight: ['garden'],
    newWords: [
      { w: 'grass', zh: '草' },
      { w: 'basket', zh: '篮子' },
      { w: 'bread', zh: '面包' }
    ],
    pages: [
      { art: 'garden|mom,ming|grass|·', en: 'Mom sees a lot of things in the garden.', zh: '妈妈在花园看见好多东西。' },
      { art: 'garden|mom,ming|grass|♪', en: 'Mom wants to count them all.', zh: '妈妈想把它们数清楚。' },
      { art: 'garden|mom,ming|grass|👀', en: 'Ming points at them one by one. They wrote down grass, basket and bread.', zh: '明明一个一个指过去。他们写下：草、篮子和面包。' },
      { art: 'garden|mom,ming|grass|?', en: '"How many are there?" asks Mom.', zh: '「一共有几个？」妈妈问。' },
      { art: 'garden|mom,ming|grass|·', en: 'Mom counts: one, two, three.', zh: '妈妈数：一、二、三。' },
      { art: 'garden|mom,ming|grass|!', en: 'They get a different number each time.', zh: '每次数出来的数都不一样。' },
      { art: 'garden|mom,ming|wing|♥', en: 'Ming says, "Start from the same end."', zh: '明明说：「每次都从同一头开始。」' },
      { art: 'garden|mom,ming|grass|★', en: 'This time both get the same number. We look at the grass and the basket.', zh: '这次两个数对上了。我们看看草和篮子。' },
      { art: 'garden|mom,ming|grass|·', en: 'Next they will count the wing and the flag.', zh: '接下来他们要数翅膀和旗子。' }
    ],
    quiz: [
      { q: '在花园读的这一本里，有下面哪一样？', opts: ['翅膀', '笔', '轮船'], a: 0, kind: 'recall' },
      { q: '妈妈两遍数出来的数为什么不一样？', opts: ['因为数得太慢', '每次从不同的地方开始数', '因为东西变多了'], a: 1, kind: 'infer' },
      { q: '数草总是数错，你会怎么做？', opts: ['定好从哪头开始，按同一顺序再数', '不数了，猜一个', '随便换个起点重数'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b42', lv: 'L4', tag: '池塘', title: 'Swim with the Swan', zh: '和天鹅一起游',
    emoji: '🦢', color: '#F6C9E3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「帮个忙」这条线，认读 3 个新词。',
    trap: '连缀中间不加元音：tree 是「tr-ee」一个词，不是「特-瑞」两个音。',
    summary: '《和天鹅一起游》是「帮个忙」：爸爸和丽丽在公园，围绕天鹅把一件事读到底。本本词卡：天鹅、鼻涕虫、乌鸦。读前先看词卡，读完合上书说一说。',
    retell: '四句话复述：谁、在哪儿、遇到什么麻烦、怎么解决。（这一本是「帮个忙」。）',
    think: '说一次你请人帮忙的经历：开口之前你卡在哪儿？对方先看出了什么？',
    pre: [
      { art: '🦢', en: 'swan', zh: '天鹅' },
      { art: '🐾', en: 'slug', zh: '鼻涕虫' },
      { art: '🐦‍⬛', en: 'crow', zh: '乌鸦' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👨', en: 'dad', zh: '爸爸' }
    ],
    sight: ['park'],
    newWords: [
      { w: 'swan', zh: '天鹅' },
      { w: 'slug', zh: '鼻涕虫' },
      { w: 'crow', zh: '乌鸦' }
    ],
    pages: [
      { art: 'park|dad,lili|swan|·', en: 'Dad is in the park with a swan.', zh: '爸爸带着天鹅在公园。' },
      { art: 'park|dad,lili|swan|♪', en: 'Dad wants to do it alone.', zh: '爸爸想自己一个人做。' },
      { art: 'park|dad,lili|swan|👀', en: 'The swan is too much for one pair of hands. They wrote down slug, swan and crow.', zh: '一个人搬不动这个天鹅。他们写下：鼻涕虫、天鹅和乌鸦。' },
      { art: 'park|dad,lili|swan|?', en: '"Can you help me?" asks Dad.', zh: '「能帮我一下吗？」爸爸问。' },
      { art: 'park|dad,lili|swan|·', en: 'They both pull, but it does not move.', zh: '两个人一起拉，还是不动。' },
      { art: 'park|dad,lili|swan|!', en: 'Pulling harder does not help.', zh: '再用力也没用。' },
      { art: 'park|dad,lili|frog|♥', en: 'Lili stops and thinks.', zh: '丽丽停下来想了想。' },
      { art: 'park|dad,lili|swan|★', en: 'Now the swan moves easily. We look at the slug and the swan.', zh: '这下天鹅轻轻就动了。我们看看鼻涕虫和天鹅。' },
      { art: 'park|dad,lili|swan|·', en: 'Next time they will look around first.', zh: '下次他们会先看看四周。' }
    ],
    quiz: [
      { q: '这一本里，爸爸看到了下面哪一样？', opts: ['天空', '天鹅', '别针'], a: 1, kind: 'recall' },
      { q: '搬天鹅时，真正挡路的是什么？', opts: ['天鹅太重了', '两个人力气太小', '青蛙，不是天鹅'], a: 2, kind: 'infer' },
      { q: '两个人一起使劲还是搬不动天鹅，你会怎么做？', opts: ['叫更多人一起使劲', '先停一下，看看是不是有别的东西挡着', '就这么算了'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b43', lv: 'L4', tag: '送礼', title: 'A Gift in a Basket', zh: '篮子里的礼物',
    emoji: '🧺', color: '#BFE6DF',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「一起做」这条线，认读 2 个新词。',
    trap: '连缀中间不加元音：tree 是「tr-ee」一个词，不是「特-瑞」两个音。',
    summary: '《篮子里的礼物》是「一起做」：明明和奶奶在家，围绕礼物把一件事读到底。本本词卡：鼓、葡萄。读前先看词卡，读完合上书说一说。',
    retell: '四句话复述：谁、在哪儿、遇到什么麻烦、怎么解决。（这一本是「一起做」。）',
    think: '说一件你做过的、步骤很多的事：哪一步最容易漏？下次怎么提醒自己？',
    pre: [
      { art: '🥁', en: 'drum', zh: '鼓' },
      { art: '🍚', en: 'grapes', zh: '葡萄' },
      { art: '📦', en: 'they', zh: 'they' },
      { art: '📦', en: 'the', zh: 'the' }
    ],
    sight: ['friend'],
    newWords: [
      { w: 'drum', zh: '鼓' },
      { w: 'grapes', zh: '葡萄' }
    ],
    pages: [
      { art: 'home|ming,grandma|gift|·', en: 'Ming has an idea at home.', zh: '明明在家有了个主意。' },
      { art: 'home|ming,grandma|gift|♪', en: '"Let us make a gift," says Ming.', zh: '「我们做礼物吧。」明明说。' },
      { art: 'home|ming,grandma|gift|👀', en: 'They get everything ready. They wrote down drum, grapes and friend.', zh: '他们把要用的东西备齐。他们写下：鼓、葡萄和朋友。' },
      { art: 'home|ming,grandma|gift|?', en: '"What do we need first?" asks Grandma.', zh: '「先要什么？」奶奶问。' },
      { art: 'home|ming,grandma|gift|·', en: 'They make a list, and they start.', zh: '他们列了个单子，就动手了。' },
      { art: 'home|ming,grandma|gift|!', en: 'It does not look right. Something is wrong.', zh: '样子不对，哪里出了岔子。' },
      { art: 'home|ming,grandma|chick|♥', en: 'Grandma reads the list again, out loud.', zh: '奶奶把单子又大声念了一遍。' },
      { art: 'home|ming,grandma|gift|★', en: 'This time the gift is just right. We look at the drum and the grapes.', zh: '这次礼物正好。我们看看鼓和葡萄。' },
      { art: 'home|ming,grandma|gift|·', en: 'They write down what they would do next time.', zh: '他们写下下次要怎么做。' }
    ],
    quiz: [
      { q: '明明和奶奶的这一本里，出现了下面哪一样？', opts: ['米饭', '葡萄', '石头'], a: 1, kind: 'recall' },
      { q: '明明第一次为什么没做成礼物？', opts: ['因为没人帮忙', '因为材料不够', '两步并成一步，漏了顺序'], a: 2, kind: 'infer' },
      { q: '做一件步骤很多的事（像做礼物那样），你会先做什么？', opts: ['先把步骤写下来，再一步一步做', '直接跳过开头的步骤', '想到哪步做哪步'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b44', lv: 'L4', tag: '游戏', title: 'Clap and Spin', zh: '拍手转圈',
    emoji: '🌀', color: '#F2E2A8',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「分一分」这条线，不引入新词，全部是读过的词。',
    trap: '连缀中间不加元音：tree 是「tr-ee」一个词，不是「特-瑞」两个音。',
    summary: '《拍手转圈》是「分一分」：丽丽和爷爷在家，围绕鼓把一件事读到底。本本词卡：这一本不引入新词，全部是读过的词。读前先看词卡，读完合上书说一说。',
    retell: '四句话复述：谁、在哪儿、遇到什么麻烦、怎么解决。（这一本是「分一分」。）',
    think: '说说家里只剩一份、两个人都想要的时候，你们是怎么商量的。',
    pre: [
      { art: '📦', en: 'it', zh: 'it' },
      { art: '📦', en: 'they', zh: 'they' }
    ],
    sight: ['friend'],
    newWords: [

    ],
    pages: [
      { art: 'home|lili,grandpa|drum|·', en: 'There is only one drum at home.', zh: '家只有一个鼓。' },
      { art: 'home|lili,grandpa|drum|♪', en: 'Lili wants it. Grandpa wants it too.', zh: '丽丽想要，爷爷也想要。' },
      { art: 'home|lili,grandpa|drum|👀', en: 'They look at the drum for a long time. They wrote down friend, frog and gift.', zh: '他们盯着鼓看了好久。他们写下：朋友、青蛙和礼物。' },
      { art: 'home|lili,grandpa|drum|?', en: '"How can we both have it?" asks Grandpa.', zh: '「怎么才能两个人都有？」爷爷问。' },
      { art: 'home|lili,grandpa|drum|·', en: 'Lili says, "You can have it first."', zh: '丽丽说：「你先来吧。」' },
      { art: 'home|lili,grandpa|drum|!', en: 'That is not fair to one of them.', zh: '这样对其中一个不公平。' },
      { art: 'home|lili,grandpa|brush|♥', en: 'Grandpa has a better idea.', zh: '爷爷想出个更好的办法。' },
      { art: 'home|lili,grandpa|drum|★', en: 'Now each of them has a part. We look at the friend and the frog.', zh: '现在两个人各有一份。我们看看朋友和青蛙。' },
      { art: 'home|lili,grandpa|drum|·', en: 'Next time they will ask before they decide.', zh: '下次他们会先问一句，再做决定。' }
    ],
    quiz: [
      { q: '在家读的这一本里，有下面哪一样？', opts: ['礼物', '黄色', '石头'], a: 0, kind: 'recall' },
      { q: '两个人是怎么都拿到鼓的？', opts: ['商量以后把它分成两份', '谁力气大谁拿走', '又买了一个'], a: 0, kind: 'infer' },
      { q: '只剩一份鼓、两个人都想要时，你会怎么做？', opts: ['谁也不给', '先抢到手再说', '先问一句能不能分，再一起想办法'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b45', lv: 'L4', tag: '发音', title: 'Say It: Tree', zh: '说一说：tree',
    emoji: '🗣️', color: '#D9D2F5',
    track: 'drill',
    goal: '把本级难点音听准、说准，并能在整句里读对。这一本走「问一问」这条线，不引入新词，全部是读过的词。',
    trap: '连缀中间不加元音：tree 是「tr-ee」一个词，不是「特-瑞」两个音。',
    summary: '《说一说：tree》是「问一问」：奶奶和妈妈在家，围绕树把一件事读到底。本本词卡：这一本不引入新词，全部是读过的词。读前先看词卡，读完合上书说一说。',
    retell: '四句话复述：谁、在哪儿、遇到什么麻烦、怎么解决。（这一本是「问一问」。）',
    think: '回想一次「问了还是没懂」：把当时的问题改成一个更小的、指着某个词的问题。',
    pre: [
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👵', en: 'grandma', zh: '奶奶' }
    ],
    sight: ['tree'],
    newWords: [

    ],
    pages: [
      { art: 'home|grandma,mom|tree|·', en: 'Grandma is reading the word "tree" at home.', zh: '奶奶在家读「tree」这个词。' },
      { art: 'home|grandma,mom|tree|♪', en: 'Grandma wants to understand it.', zh: '奶奶想把它弄明白。' },
      { art: 'home|grandma,mom|tree|👀', en: 'One sentence does not make sense. They wrote down frog, gift and glove.', zh: '有一句怎么也读不通。他们写下：青蛙、礼物和手套。' },
      { art: 'home|grandma,mom|tree|?', en: '"What does this part mean?" asks Grandma.', zh: '「这一段什么意思？」奶奶问。' },
      { art: 'home|grandma,mom|tree|·', en: 'Mom answers, but Grandma still looks lost.', zh: '妈妈答了，奶奶还是没懂。' },
      { art: 'home|grandma,mom|tree|!', en: 'The answer was right, but not the right answer.', zh: '答案没错，却不是问的那个。' },
      { art: 'home|grandma,mom|rock|♥', en: 'Mom asks, "Which word is the hard one?"', zh: '妈妈反问：「难的是哪个词？」' },
      { art: 'home|grandma,mom|tree|★', en: 'Now the whole sentence is clear. We look at the frog and the gift.', zh: '这下整句都清楚了。我们看看青蛙和礼物。' },
      { art: 'home|grandma,mom|tree|·', en: 'They write down one new question.', zh: '他们又写下一个新问题。' }
    ],
    quiz: [
      { q: '这一本里，奶奶看到了下面哪一样？', opts: ['宝宝', '树', '天鹅'], a: 1, kind: 'recall' },
      { q: '奶奶第一次为什么没听懂「tree」？', opts: ['因为答案太短', '因为读得太快', '问题太大，没指向真正卡住的那个词'], a: 2, kind: 'infer' },
      { q: '别人把「tree」解释完你还是没懂，你会怎么做？', opts: ['把整段跳过去', '指出具体哪个词不懂，再问一遍', '点点头装作懂了'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b46', lv: 'L4', tag: '小知识', title: 'How a Stem Grows', zh: '茎怎么长',
    emoji: '🌱', color: '#FAD3B6',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。这一本走「问一问」这条线，不引入新词，全部是读过的词。',
    trap: '连缀中间不加元音：tree 是「tr-ee」一个词，不是「特-瑞」两个音。',
    summary: '《茎怎么长》是「问一问」：爷爷和爸爸在花园，围绕茎把一件事读到底。本本词卡：这一本不引入新词，全部是读过的词。读前先看词卡，读完合上书说一说。',
    retell: '四句话复述：谁、在哪儿、遇到什么麻烦、怎么解决。（这一本是「问一问」。）',
    think: '回想一次「问了还是没懂」：把当时的问题改成一个更小的、指着某个词的问题。',
    pre: [
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👴', en: 'grandpa', zh: '爷爷' }
    ],
    sight: ['garden'],
    newWords: [

    ],
    pages: [
      { art: 'garden|grandpa,dad|stem|·', en: 'Grandpa is reading the word "stem" in the garden.', zh: '爷爷在花园读「stem」这个词。' },
      { art: 'garden|grandpa,dad|stem|♪', en: 'Grandpa wants to understand it.', zh: '爷爷想把它弄明白。' },
      { art: 'garden|grandpa,dad|stem|👀', en: 'One sentence does not make sense. They wrote down gift, glove and grandma.', zh: '有一句怎么也读不通。他们写下：礼物、手套和奶奶。' },
      { art: 'garden|grandpa,dad|stem|?', en: '"What does this part mean?" asks Grandpa.', zh: '「这一段什么意思？」爷爷问。' },
      { art: 'garden|grandpa,dad|stem|·', en: 'Dad answers, but Grandpa still looks lost.', zh: '爸爸答了，爷爷还是没懂。' },
      { art: 'garden|grandpa,dad|stem|!', en: 'The answer was right, but not the right answer.', zh: '答案没错，却不是问的那个。' },
      { art: 'garden|grandpa,dad|tree|♥', en: 'Dad asks, "Which word is the hard one?"', zh: '爸爸反问：「难的是哪个词？」' },
      { art: 'garden|grandpa,dad|stem|★', en: 'Now the whole sentence is clear. We look at the gift and the glove.', zh: '这下整句都清楚了。我们看看礼物和手套。' },
      { art: 'garden|grandpa,dad|stem|·', en: 'They write down one new question.', zh: '他们又写下一个新问题。' }
    ],
    quiz: [
      { q: '爷爷和爸爸的这一本里，出现了下面哪一样？', opts: ['花园', '蝙蝠', '浴盆'], a: 0, kind: 'recall' },
      { q: '爷爷第一次为什么没听懂「stem」？', opts: ['问题太大，没指向真正卡住的那个词', '因为读得太快', '因为答案太短'], a: 0, kind: 'infer' },
      { q: '别人把「stem」解释完你还是没懂，你会怎么做？', opts: ['指出具体哪个词不懂，再问一遍', '把整段跳过去', '点点头装作懂了'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b47', lv: 'L4', tag: '小知识', title: 'Snow on the Street', zh: '街上的雪',
    emoji: '❄️', color: '#C8E7F0',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。这一本走「合上书讲一遍」这条线，不引入新词，全部是读过的词。',
    trap: '连缀中间不加元音：tree 是「tr-ee」一个词，不是「特-瑞」两个音。',
    summary: '《街上的雪》是「合上书讲一遍」：妈妈和明明在公园，围绕雪把一件事读到底。本本词卡：这一本不引入新词，全部是读过的词。读前先看词卡，读完合上书说一说。',
    retell: '四句话复述：谁、在哪儿、遇到什么麻烦、怎么解决。（这一本是「合上书讲一遍」。）',
    think: '合上书，用「谁 → 在哪儿 → 出了什么事 → 结果」把雪这一本讲给家长听。',
    pre: [
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👩', en: 'mom', zh: '妈妈' }
    ],
    sight: ['park', 'snow'],
    newWords: [

    ],
    pages: [
      { art: 'park|mom,ming|snow|·', en: 'Mom has just finished a book in the park.', zh: '妈妈刚在公园读完一本书。' },
      { art: 'park|mom,ming|snow|♪', en: 'Ming wants to hear all about it.', zh: '明明想听他讲讲。' },
      { art: 'park|mom,ming|snow|👀', en: 'Mom thinks about the snow in the book. They wrote down glove, grandma and grandpa.', zh: '妈妈想着书里的雪。他们写下：手套、奶奶和爷爷。' },
      { art: 'park|mom,ming|snow|?', en: '"Where do I start?" asks Mom.', zh: '「从哪儿讲起？」妈妈问。' },
      { art: 'park|mom,ming|snow|·', en: 'Mom tells the last part first.', zh: '妈妈先讲了结尾。' },
      { art: 'park|mom,ming|snow|!', en: 'Ming cannot follow the story.', zh: '明明听不明白。' },
      { art: 'park|mom,ming|box|♥', en: 'Ming says, "Tell me who, where, then what."', zh: '明明说：「先说谁、在哪儿、再说出什么事。」' },
      { art: 'park|mom,ming|snow|★', en: 'This time Ming can see the whole thing. We look at the glove and the grandma.', zh: '这回明明全听明白了。我们看看手套和奶奶。' },
      { art: 'park|mom,ming|snow|·', en: 'Tomorrow they will read about a box.', zh: '明天他们要读讲盒子的书。' }
    ],
    quiz: [
      { q: '在公园读的这一本里，有下面哪一样？', opts: ['长椅', '雪', '薯片'], a: 1, kind: 'recall' },
      { q: '为什么明明第一遍没听明白？', opts: ['先讲了结尾，顺序乱了', '因为故事太短', '因为讲得太慢'], a: 0, kind: 'infer' },
      { q: '要把讲雪的这本读过的书讲给别人听，你会怎么开头？', opts: ['先报书名和生词表', '先说谁、在哪儿，再按顺序说出了什么事', '直接从最精彩的那句开始'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b48', lv: 'L4', tag: '复习', title: 'Back to the Playground', zh: '回到操场',
    emoji: '🏫', color: '#E8D9B5',
    track: 'review',
    goal: '把本级和前面级别的词再读一遍、串成一个故事。这一本走「比一比」这条线，不引入新词，全部是读过的词。',
    trap: '连缀中间不加元音：tree 是「tr-ee」一个词，不是「特-瑞」两个音。',
    summary: '《回到操场》是「比一比」：爸爸和丽丽在图书馆，围绕操场把一件事读到底。本本词卡：这一本不引入新词，全部是读过的词。读前先看词卡，读完合上书说一说。',
    retell: '四句话复述：谁、在哪儿、遇到什么麻烦、怎么解决。（这一本是「比一比」。）',
    think: '找两样很像的东西，用英文说出至少两处不同，说说你是按什么顺序找的。',
    pre: [
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'at', zh: 'at' }
    ],
    sight: ['farm', 'garden', 'playground'],
    newWords: [

    ],
    pages: [
      { art: 'library|dad,lili|playground|·', en: 'Dad looks at a playground and a garden.', zh: '爸爸看着操场和花园。' },
      { art: 'library|dad,lili|playground|♪', en: 'They want to know how they are different.', zh: '他们想知道两样有什么不一样。' },
      { art: 'library|dad,lili|playground|👀', en: 'At first the two look the same. They wrote down grandma, grandpa and grapes.', zh: '乍一看，两样挺像。他们写下：奶奶、爷爷和葡萄。' },
      { art: 'library|dad,lili|playground|?', en: '"What is not the same?" asks Lili.', zh: '「哪里不一样？」丽丽问。' },
      { art: 'library|dad,lili|playground|·', en: 'They put them side by side.', zh: '他们把两样并排放。' },
      { art: 'library|dad,lili|playground|!', en: 'Looking from far away does not help.', zh: '远远地看，还是看不出。' },
      { art: 'library|dad,lili|garden|♥', en: 'Lili says, "Look at one part at a time."', zh: '丽丽说：「一处一处分开看。」' },
      { art: 'library|dad,lili|playground|★', en: 'There! One small part is different. We look at the grandma and the grandpa.', zh: '有了！有一处小小的不同。我们看看奶奶和爷爷。' },
      { art: 'library|dad,lili|playground|·', en: 'Next they will compare the garden and the farm.', zh: '接着他们要比一比花园和农场。' }
    ],
    quiz: [
      { q: '这一本里，爸爸看到了下面哪一样？', opts: ['奶酪', '垃圾桶', '农场'], a: 2, kind: 'recall' },
      { q: '操场和花园一开始为什么看着一样？', opts: ['因为它们真的完全相同', '因为光线太暗', '只远远看了一眼，没一处一处分开比'], a: 2, kind: 'infer' },
      { q: '要找出像操场和花园这样很像的两样东西哪里不同，你会怎么做？', opts: ['并排放好，一处一处分开看', '只挑一个看', '隔很远扫一眼'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b49', lv: 'L5', tag: '天气', title: 'Rain on the Farm', zh: '农场上的雨',
    emoji: '🌧️', color: '#F6C6C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「比一比」这条线，认读 3 个新词。',
    trap: '元音组合只读一个长音：ai / ay 都读 /eɪ/，oa 读 /əʊ/；别把两个字母分开念。',
    summary: '《农场上的雨》是「比一比」：明明和奶奶在公园，围绕雨把一件事读到底。本本词卡：雨、房间、根。读前先看词卡，读完合上书说一说。',
    retell: '合上书，讲讲明明为什么等了那么久，结果学到了什么。（这一本是「比一比」。）',
    think: '找两样很像的东西，用英文说出至少两处不同，说说你是按什么顺序找的。',
    pre: [
      { art: '🌧️', en: 'rain', zh: '雨' },
      { art: '📦', en: 'room', zh: '房间' },
      { art: '🌿', en: 'root', zh: '根' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'they', zh: 'they' }
    ],
    sight: ['photo'],
    newWords: [
      { w: 'rain', zh: '雨' },
      { w: 'room', zh: '房间' },
      { w: 'root', zh: '根' }
    ],
    pages: [
      { art: 'park|ming,grandma|rain|·', en: 'Ming looks at some rain and a photo.', zh: '明明看着雨和照片。' },
      { art: 'park|ming,grandma|rain|♪', en: 'They want to know how they are different.', zh: '他们想知道两样有什么不一样。' },
      { art: 'park|ming,grandma|rain|👀', en: 'At first the two look the same. We say rain, room and root again.', zh: '乍一看，两样挺像。我们再把这三个词说一遍：雨、房间和根。' },
      { art: 'park|ming,grandma|rain|?', en: '"What is not the same?" asks Grandma.', zh: '「哪里不一样？」奶奶问。' },
      { art: 'park|ming,grandma|rain|·', en: 'They put them side by side.', zh: '他们把两样并排放。' },
      { art: 'park|ming,grandma|rain|!', en: 'Looking from far away does not help.', zh: '远远地看，还是看不出。' },
      { art: 'park|ming,grandma|photo|♥', en: 'Grandma says, "Look at one part at a time."', zh: '奶奶说：「一处一处分开看。」' },
      { art: 'park|ming,grandma|rain|★', en: 'There! One small part is different.', zh: '有了！有一处小小的不同。' },
      { art: 'park|ming,grandma|rain|?', en: 'The difference was small, not missing. We say the words again: rain and room.', zh: '差别很小，不是没有。我们把这两个词再说一遍：雨和房间。' },
      { art: 'park|ming,grandma|rain|·', en: 'Next they will compare the photo and the rock. They made a list of all the small differences.', zh: '接着他们要比一比照片和石头。他们把所有细小的不同都列了下来。' }
    ],
    quiz: [
      { q: '明明和奶奶的这一本里，出现了下面哪一样？', opts: ['根', '水池', '拖把'], a: 0, kind: 'recall' },
      { q: '雨和照片一开始为什么看着一样？', opts: ['只远远看了一眼，没一处一处分开比', '因为光线太暗', '因为它们真的完全相同'], a: 0, kind: 'infer' },
      { q: '要找出像雨和照片这样很像的两样东西哪里不同，你会怎么做？', opts: ['隔很远扫一眼', '并排放好，一处一处分开看', '只挑一个看'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b50', lv: 'L5', tag: '海边', title: 'A Boat on the Sea', zh: '海上的小船',
    emoji: '⛵', color: '#F9DFB4',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「合上书讲一遍」这条线，认读 3 个新词。',
    trap: '元音组合只读一个长音：ai / ay 都读 /eɪ/，oa 读 /əʊ/；别把两个字母分开念。',
    summary: '《海上的小船》是「合上书讲一遍」：丽丽和爷爷在沙滩，围绕小船把一件事读到底。本本词卡：小船、蜗牛、勺子。读前先看词卡，读完合上书说一说。',
    retell: '合上书，讲讲丽丽为什么等了那么久，结果学到了什么。（这一本是「合上书讲一遍」。）',
    think: '合上书，用「谁 → 在哪儿 → 出了什么事 → 结果」把小船这一本讲给家长听。',
    pre: [
      { art: '⛵', en: 'boat', zh: '小船' },
      { art: '🐌', en: 'snail', zh: '蜗牛' },
      { art: '📦', en: 'spoon', zh: '勺子' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👧', en: 'lili', zh: '丽丽' }
    ],
    sight: ['beach'],
    newWords: [
      { w: 'boat', zh: '小船' },
      { w: 'snail', zh: '蜗牛' },
      { w: 'spoon', zh: '勺子' }
    ],
    pages: [
      { art: 'beach|lili,grandpa|boat|·', en: 'Lili has just finished a book at the beach.', zh: '丽丽刚在沙滩读完一本书。' },
      { art: 'beach|lili,grandpa|boat|♪', en: 'Grandpa wants to hear all about it.', zh: '爷爷想听他讲讲。' },
      { art: 'beach|lili,grandpa|boat|👀', en: 'Lili thinks about the boat in the book. We say boat, snail and spoon again.', zh: '丽丽想着书里的小船。我们再把这三个词说一遍：小船、蜗牛和勺子。' },
      { art: 'beach|lili,grandpa|boat|?', en: '"Where do I start?" asks Lili.', zh: '「从哪儿讲起？」丽丽问。' },
      { art: 'beach|lili,grandpa|boat|·', en: 'Lili tells the last part first.', zh: '丽丽先讲了结尾。' },
      { art: 'beach|lili,grandpa|boat|!', en: 'Grandpa cannot follow the story.', zh: '爷爷听不明白。' },
      { art: 'beach|lili,grandpa|room|♥', en: 'Grandpa says, "Tell me who, where, then what."', zh: '爷爷说：「先说谁、在哪儿、再说出什么事。」' },
      { art: 'beach|lili,grandpa|boat|★', en: 'This time Grandpa can see the whole thing.', zh: '这回爷爷全听明白了。' },
      { art: 'beach|lili,grandpa|boat|?', en: 'A story needs its order to make sense. We say the words again: boat and snail.', zh: '故事要靠顺序才讲得通。我们把这两个词再说一遍：小船和蜗牛。' },
      { art: 'beach|lili,grandpa|boat|·', en: 'Tomorrow they will read about a room. They could still tell it the next morning.', zh: '明天他们要读讲房间的书。第二天早上，他们还能讲得出来。' }
    ],
    quiz: [
      { q: '在沙滩读的这一本里，有下面哪一样？', opts: ['房间', '种子', '李子'], a: 0, kind: 'recall' },
      { q: '为什么爷爷第一遍没听明白？', opts: ['先讲了结尾，顺序乱了', '因为讲得太慢', '因为故事太短'], a: 0, kind: 'infer' },
      { q: '要把讲小船的这本读过的书讲给别人听，你会怎么开头？', opts: ['直接从最精彩的那句开始', '先说谁、在哪儿，再按顺序说出了什么事', '先报书名和生词表'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b51', lv: 'L5', tag: '夜空', title: 'The Moon and the Sheep', zh: '月亮和绵羊',
    emoji: '🌙', color: '#CDE7C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「问一问」这条线，认读 3 个新词。',
    trap: '元音组合只读一个长音：ai / ay 都读 /eɪ/，oa 读 /əʊ/；别把两个字母分开念。',
    summary: '《月亮和绵羊》是「问一问」：奶奶和妈妈在家，围绕月亮把一件事读到底。本本词卡：月亮、叶子、水池。读前先看词卡，读完合上书说一说。',
    retell: '合上书，讲讲奶奶为什么等了那么久，结果学到了什么。（这一本是「问一问」。）',
    think: '回想一次「问了还是没懂」：把当时的问题改成一个更小的、指着某个词的问题。',
    pre: [
      { art: '🌙', en: 'moon', zh: '月亮' },
      { art: '🍃', en: 'leaf', zh: '叶子' },
      { art: '🌿', en: 'pool', zh: '水池' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👵', en: 'grandma', zh: '奶奶' }
    ],
    sight: [],
    newWords: [
      { w: 'moon', zh: '月亮' },
      { w: 'leaf', zh: '叶子' },
      { w: 'pool', zh: '水池' }
    ],
    pages: [
      { art: 'home|grandma,mom|moon|·', en: 'Grandma is reading the word "moon" at home.', zh: '奶奶在家读「moon」这个词。' },
      { art: 'home|grandma,mom|moon|♪', en: 'Grandma wants to understand it.', zh: '奶奶想把它弄明白。' },
      { art: 'home|grandma,mom|moon|👀', en: 'One sentence does not make sense. We say leaf, moon and pool again.', zh: '有一句怎么也读不通。我们再把这三个词说一遍：叶子、月亮和水池。' },
      { art: 'home|grandma,mom|moon|?', en: '"What does this part mean?" asks Grandma.', zh: '「这一段什么意思？」奶奶问。' },
      { art: 'home|grandma,mom|moon|·', en: 'Mom answers, but Grandma still looks lost.', zh: '妈妈答了，奶奶还是没懂。' },
      { art: 'home|grandma,mom|moon|!', en: 'The answer was right, but not the right answer.', zh: '答案没错，却不是问的那个。' },
      { art: 'home|grandma,mom|cup|♥', en: 'Mom asks, "Which word is the hard one?"', zh: '妈妈反问：「难的是哪个词？」' },
      { art: 'home|grandma,mom|moon|★', en: 'Now the whole sentence is clear.', zh: '这下整句都清楚了。' },
      { art: 'home|grandma,mom|moon|?', en: 'The real question had been a smaller one. We say the words again: leaf and moon.', zh: '真正该问的，是个更小的问题。我们把这两个词再说一遍：叶子和月亮。' },
      { art: 'home|grandma,mom|moon|·', en: 'They write down one new question. The smaller question stayed with them.', zh: '他们又写下一个新问题。那个更小的问题，他们一直记着。' }
    ],
    quiz: [
      { q: '这一本里，奶奶看到了下面哪一样？', opts: ['轮船', '老鼠', '水池'], a: 2, kind: 'recall' },
      { q: '奶奶第一次为什么没听懂「moon」？', opts: ['问题太大，没指向真正卡住的那个词', '因为答案太短', '因为读得太快'], a: 0, kind: 'infer' },
      { q: '别人把「moon」解释完你还是没懂，你会怎么做？', opts: ['指出具体哪个词不懂，再问一遍', '点点头装作懂了', '把整段跳过去'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b52', lv: 'L5', tag: '种植', title: 'A Seed in a Pot', zh: '盆里的种子',
    emoji: '🌱', color: '#C6DEF6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「等它长」这条线，认读 2 个新词。',
    trap: '元音组合只读一个长音：ai / ay 都读 /eɪ/，oa 读 /əʊ/；别把两个字母分开念。',
    summary: '《盆里的种子》是「等它长」：爷爷和爸爸在花园，围绕种子把一件事读到底。本本词卡：尾巴、鲸。读前先看词卡，读完合上书说一说。',
    retell: '合上书，讲讲爷爷为什么等了那么久，结果学到了什么。（这一本是「等它长」。）',
    think: '说一件练了很久才看见进步的事，讲讲等待的时候你是怎么想的。',
    pre: [
      { art: '🐾', en: 'tail', zh: '尾巴' },
      { art: '🐳', en: 'whale', zh: '鲸' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'again', zh: 'again' }
    ],
    sight: ['garden'],
    newWords: [
      { w: 'tail', zh: '尾巴' },
      { w: 'whale', zh: '鲸' }
    ],
    pages: [
      { art: 'garden|grandpa,dad|seed|·', en: 'Grandpa puts a seed in the garden.', zh: '爷爷把种子放在花园。' },
      { art: 'garden|grandpa,dad|seed|♪', en: 'Grandpa wants to see it change.', zh: '爷爷想看见它变样。' },
      { art: 'garden|grandpa,dad|seed|👀', en: 'On the first day, nothing looks different. We say seed, tail and whale again.', zh: '头一天，看不出什么变化。我们再把这三个词说一遍：种子、尾巴和鲸。' },
      { art: 'garden|grandpa,dad|seed|?', en: '"Is it working at all?" asks Grandpa.', zh: '「到底有没有在长？」爷爷问。' },
      { art: 'garden|grandpa,dad|seed|·', en: 'They look again the next morning.', zh: '第二天早上他们又去看。' },
      { art: 'garden|grandpa,dad|seed|!', en: 'Still the same. Grandpa wants to give up.', zh: '还是老样子。爷爷想算了。' },
      { art: 'garden|grandpa,dad|night|♥', en: 'Dad says, "Wait a little longer."', zh: '爸爸说：「再等一等。」' },
      { art: 'garden|grandpa,dad|seed|★', en: 'One morning, there is a small change.', zh: '有一天早上，出现了一点小变化。' },
      { art: 'garden|grandpa,dad|seed|?', en: 'The change had been happening all along. We say the words again: seed and tail.', zh: '变化其实一直都在发生。我们把这两个词再说一遍：种子和尾巴。' },
      { art: 'garden|grandpa,dad|seed|·', en: 'They will come back and look again tomorrow. By the end of the week, it had changed again.', zh: '明天他们还会再来看。到那周结束，它又变了一次。' }
    ],
    quiz: [
      { q: '爷爷和爸爸的这一本里，出现了下面哪一样？', opts: ['天空', '红色', '鲸'], a: 2, kind: 'recall' },
      { q: '为什么爷爷一开始以为没变化？', opts: ['因为忘了去看', '因为把它搬走了', '变化太慢，一天里看不出来'], a: 2, kind: 'infer' },
      { q: '学一样本领练了几天没进步（像等种子那样），你会怎么做？', opts: ['立刻换一件别的事', '认定自己学不会', '按原来的方法接着练，过几天再看'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b53', lv: 'L5', tag: '观察', title: 'A Tail and a Chain', zh: '尾巴和链子',
    emoji: '🐐', color: '#E0CFF3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「一起做」这条线，认读 3 个新词。',
    trap: '元音组合只读一个长音：ai / ay 都读 /eɪ/，oa 读 /əʊ/；别把两个字母分开念。',
    summary: '《尾巴和链子》是「一起做」：妈妈和明明在家，围绕尾巴把一件事读到底。本本词卡：路、海、绵羊。读前先看词卡，读完合上书说一说。',
    retell: '合上书，讲讲妈妈为什么等了那么久，结果学到了什么。（这一本是「一起做」。）',
    think: '说一件你做过的、步骤很多的事：哪一步最容易漏？下次怎么提醒自己？',
    pre: [
      { art: '🛣️', en: 'road', zh: '路' },
      { art: '🌊', en: 'sea', zh: '海' },
      { art: '🐑', en: 'sheep', zh: '绵羊' },
      { art: '📦', en: 'they', zh: 'they' },
      { art: '📦', en: 'the', zh: 'the' }
    ],
    sight: [],
    newWords: [
      { w: 'road', zh: '路' },
      { w: 'sea', zh: '海' },
      { w: 'sheep', zh: '绵羊' }
    ],
    pages: [
      { art: 'home|mom,ming|tail|·', en: 'Mom has an idea at home.', zh: '妈妈在家有了个主意。' },
      { art: 'home|mom,ming|tail|♪', en: '"Let us make a tail," says Mom.', zh: '「我们做尾巴吧。」妈妈说。' },
      { art: 'home|mom,ming|tail|👀', en: 'They get everything ready. We say road, sea and sheep again.', zh: '他们把要用的东西备齐。我们再把这三个词说一遍：路、海和绵羊。' },
      { art: 'home|mom,ming|tail|?', en: '"What do we need first?" asks Ming.', zh: '「先要什么？」明明问。' },
      { art: 'home|mom,ming|tail|·', en: 'They make a list, and they start.', zh: '他们列了个单子，就动手了。' },
      { art: 'home|mom,ming|tail|!', en: 'It does not look right. Something is wrong.', zh: '样子不对，哪里出了岔子。' },
      { art: 'home|mom,ming|brush|♥', en: 'Ming reads the list again, out loud.', zh: '明明把单子又大声念了一遍。' },
      { art: 'home|mom,ming|tail|★', en: 'This time the tail is just right.', zh: '这次尾巴正好。' },
      { art: 'home|mom,ming|tail|?', en: 'The first time they did two steps at once. We say the words again: road and sea.', zh: '第一遍两步并成一步做了。我们把这两个词再说一遍：路和海。' },
      { art: 'home|mom,ming|tail|·', en: 'They write down what they would do next time. The list went up on the wall.', zh: '他们写下下次要怎么做。那张单子后来贴在了墙上。' }
    ],
    quiz: [
      { q: '在家读的这一本里，有下面哪一样？', opts: ['三', '尾巴', '天空'], a: 1, kind: 'recall' },
      { q: '妈妈第一次为什么没做成尾巴？', opts: ['因为材料不够', '两步并成一步，漏了顺序', '因为没人帮忙'], a: 1, kind: 'infer' },
      { q: '做一件步骤很多的事（像做尾巴那样），你会先做什么？', opts: ['想到哪步做哪步', '直接跳过开头的步骤', '先把步骤写下来，再一步一步做'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b54', lv: 'L5', tag: '趣事', title: 'The Goat and a Coat', zh: '山羊和外套',
    emoji: '🧥', color: '#F6C9E3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「分一分」这条线，认读 3 个新词。',
    trap: '元音组合只读一个长音：ai / ay 都读 /eɪ/，oa 读 /əʊ/；别把两个字母分开念。',
    summary: '《山羊和外套》是「分一分」：爸爸和丽丽在家，围绕外套把一件事读到底。本本词卡：外套、山羊、动物园。读前先看词卡，读完合上书说一说。',
    retell: '合上书，讲讲爸爸为什么等了那么久，结果学到了什么。（这一本是「分一分」。）',
    think: '说说家里只剩一份、两个人都想要的时候，你们是怎么商量的。',
    pre: [
      { art: '🧥', en: 'coat', zh: '外套' },
      { art: '🐐', en: 'goat', zh: '山羊' },
      { art: '🦁', en: 'zoo', zh: '动物园' },
      { art: '📦', en: 'it', zh: 'it' },
      { art: '📦', en: 'they', zh: 'they' }
    ],
    sight: [],
    newWords: [
      { w: 'coat', zh: '外套' },
      { w: 'goat', zh: '山羊' },
      { w: 'zoo', zh: '动物园' }
    ],
    pages: [
      { art: 'home|dad,lili|coat|·', en: 'There is only one coat at home.', zh: '家只有一个外套。' },
      { art: 'home|dad,lili|coat|♪', en: 'Dad wants it. Lili wants it too.', zh: '爸爸想要，丽丽也想要。' },
      { art: 'home|dad,lili|coat|👀', en: 'They look at the coat for a long time. We say coat, goat and zoo again.', zh: '他们盯着外套看了好久。我们再把这三个词说一遍：外套、山羊和动物园。' },
      { art: 'home|dad,lili|coat|?', en: '"How can we both have it?" asks Lili.', zh: '「怎么才能两个人都有？」丽丽问。' },
      { art: 'home|dad,lili|coat|·', en: 'Dad says, "You can have it first."', zh: '爸爸说：「你先来吧。」' },
      { art: 'home|dad,lili|coat|!', en: 'That is not fair to one of them.', zh: '这样对其中一个不公平。' },
      { art: 'home|dad,lili|flag|♥', en: 'Lili has a better idea.', zh: '丽丽想出个更好的办法。' },
      { art: 'home|dad,lili|coat|★', en: 'Now each of them has a part.', zh: '现在两个人各有一份。' },
      { art: 'home|dad,lili|coat|?', en: 'One thing can be enough for two people. We say the words again: coat and goat.', zh: '一样东西，也能让两个人都够。我们把这两个词再说一遍：外套和山羊。' },
      { art: 'home|dad,lili|coat|·', en: 'Next time they will ask before they decide. They both remembered that day.', zh: '下次他们会先问一句，再做决定。那一天两个人都记着。' }
    ],
    quiz: [
      { q: '这一本里，爸爸看到了下面哪一样？', opts: ['动物园', '蚂蚁', '太阳'], a: 0, kind: 'recall' },
      { q: '两个人是怎么都拿到外套的？', opts: ['又买了一个', '谁力气大谁拿走', '商量以后把它分成两份'], a: 2, kind: 'infer' },
      { q: '只剩一份外套、两个人都想要时，你会怎么做？', opts: ['先问一句能不能分，再一起想办法', '谁也不给', '先抢到手再说'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b55', lv: 'L5', tag: '美术', title: 'Paint a Green Leaf', zh: '画一片绿叶',
    emoji: '🍃', color: '#BFE6DF',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「等它长」这条线，认读 3 个新词。',
    trap: '元音组合只读一个长音：ai / ay 都读 /eɪ/，oa 读 /əʊ/；别把两个字母分开念。',
    summary: '《画一片绿叶》是「等它长」：明明和奶奶在花园，围绕叶子把一件事读到底。本本词卡：教室、食物、蜜蜂。读前先看词卡，读完合上书说一说。',
    retell: '合上书，讲讲明明为什么等了那么久，结果学到了什么。（这一本是「等它长」。）',
    think: '说一件练了很久才看见进步的事，讲讲等待的时候你是怎么想的。',
    pre: [
      { art: '📋', en: 'classroom', zh: '教室' },
      { art: '📦', en: 'food', zh: '食物' },
      { art: '🐝', en: 'bee', zh: '蜜蜂' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'again', zh: 'again' }
    ],
    sight: ['garden', 'leaf'],
    newWords: [
      { w: 'classroom', zh: '教室' },
      { w: 'food', zh: '食物' },
      { w: 'bee', zh: '蜜蜂' }
    ],
    pages: [
      { art: 'garden|ming,grandma|leaf|·', en: 'Ming puts a leaf in the garden.', zh: '明明把叶子放在花园。' },
      { art: 'garden|ming,grandma|leaf|♪', en: 'Ming wants to see it change.', zh: '明明想看见它变样。' },
      { art: 'garden|ming,grandma|leaf|👀', en: 'On the first day, nothing looks different. We say classroom, food and bee again.', zh: '头一天，看不出什么变化。我们再把这三个词说一遍：教室、食物和蜜蜂。' },
      { art: 'garden|ming,grandma|leaf|?', en: '"Is it working at all?" asks Ming.', zh: '「到底有没有在长？」明明问。' },
      { art: 'garden|ming,grandma|leaf|·', en: 'They look again the next morning.', zh: '第二天早上他们又去看。' },
      { art: 'garden|ming,grandma|leaf|!', en: 'Still the same. Ming wants to give up.', zh: '还是老样子。明明想算了。' },
      { art: 'garden|ming,grandma|tree|♥', en: 'Grandma says, "Wait a little longer."', zh: '奶奶说：「再等一等。」' },
      { art: 'garden|ming,grandma|leaf|★', en: 'One morning, there is a small change.', zh: '有一天早上，出现了一点小变化。' },
      { art: 'garden|ming,grandma|leaf|?', en: 'The change had been happening all along. We say the words again: classroom and food.', zh: '变化其实一直都在发生。我们把这两个词再说一遍：教室和食物。' },
      { art: 'garden|ming,grandma|leaf|·', en: 'They will come back and look again tomorrow. By the end of the week, it had changed again.', zh: '明天他们还会再来看。到那周结束，它又变了一次。' }
    ],
    quiz: [
      { q: '明明和奶奶的这一本里，出现了下面哪一样？', opts: ['茶', '苹果', '蜜蜂'], a: 2, kind: 'recall' },
      { q: '为什么明明一开始以为没变化？', opts: ['因为忘了去看', '变化太慢，一天里看不出来', '因为把它搬走了'], a: 1, kind: 'infer' },
      { q: '学一样本领练了几天没进步（像等叶子那样），你会怎么做？', opts: ['立刻换一件别的事', '按原来的方法接着练，过几天再看', '认定自己学不会'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b56', lv: 'L5', tag: '动物', title: 'Food at the Zoo', zh: '动物园的食物',
    emoji: '🦒', color: '#F2E2A8',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「合上书讲一遍」这条线，认读 1 个新词。',
    trap: '元音组合只读一个长音：ai / ay 都读 /eɪ/，oa 读 /əʊ/；别把两个字母分开念。',
    summary: '《动物园的食物》是「合上书讲一遍」：丽丽和爷爷在家，围绕动物园把一件事读到底。本本词卡：链子。读前先看词卡，读完合上书说一说。',
    retell: '合上书，讲讲丽丽为什么等了那么久，结果学到了什么。（这一本是「合上书讲一遍」。）',
    think: '合上书，用「谁 → 在哪儿 → 出了什么事 → 结果」把动物园这一本讲给家长听。',
    pre: [
      { art: '⛓️', en: 'chain', zh: '链子' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👴', en: 'grandpa', zh: '爷爷' }
    ],
    sight: [],
    newWords: [
      { w: 'chain', zh: '链子' }
    ],
    pages: [
      { art: 'home|lili,grandpa|zoo|·', en: 'Lili has just finished a book at home.', zh: '丽丽刚在家读完一本书。' },
      { art: 'home|lili,grandpa|zoo|♪', en: 'Grandpa wants to hear all about it.', zh: '爷爷想听他讲讲。' },
      { art: 'home|lili,grandpa|zoo|👀', en: 'Lili thinks about the zoo in the book. We say chain, grandpa and grapes again.', zh: '丽丽想着书里的动物园。我们再把这三个词说一遍：链子、爷爷和葡萄。' },
      { art: 'home|lili,grandpa|zoo|?', en: '"Where do I start?" asks Lili.', zh: '「从哪儿讲起？」丽丽问。' },
      { art: 'home|lili,grandpa|zoo|·', en: 'Lili tells the last part first.', zh: '丽丽先讲了结尾。' },
      { art: 'home|lili,grandpa|zoo|!', en: 'Grandpa cannot follow the story.', zh: '爷爷听不明白。' },
      { art: 'home|lili,grandpa|cap|♥', en: 'Grandpa says, "Tell me who, where, then what."', zh: '爷爷说：「先说谁、在哪儿、再说出什么事。」' },
      { art: 'home|lili,grandpa|zoo|★', en: 'This time Grandpa can see the whole thing.', zh: '这回爷爷全听明白了。' },
      { art: 'home|lili,grandpa|zoo|?', en: 'A story needs its order to make sense. We say the words again: chain and grandpa.', zh: '故事要靠顺序才讲得通。我们把这两个词再说一遍：链子和爷爷。' },
      { art: 'home|lili,grandpa|zoo|·', en: 'Tomorrow they will read about a cap. They could still tell it the next morning.', zh: '明天他们要读讲鸭舌帽的书。第二天早上，他们还能讲得出来。' }
    ],
    quiz: [
      { q: '在家读的这一本里，有下面哪一样？', opts: ['苹果', '蓝色', '鸭舌帽'], a: 2, kind: 'recall' },
      { q: '为什么爷爷第一遍没听明白？', opts: ['因为讲得太慢', '先讲了结尾，顺序乱了', '因为故事太短'], a: 1, kind: 'infer' },
      { q: '要把讲动物园的这本读过的书讲给别人听，你会怎么开头？', opts: ['先报书名和生词表', '先说谁、在哪儿，再按顺序说出了什么事', '直接从最精彩的那句开始'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b57', lv: 'L5', tag: '发音', title: 'Say It: Rain, Day', zh: '说一说：rain day',
    emoji: '🗣️', color: '#D9D2F5',
    track: 'drill',
    goal: '把本级难点音听准、说准，并能在整句里读对。这一本走「问一问」这条线，不引入新词，全部是读过的词。',
    trap: '元音组合只读一个长音：ai / ay 都读 /eɪ/，oa 读 /əʊ/；别把两个字母分开念。',
    summary: '《说一说：rain day》是「问一问」：奶奶和妈妈在家，围绕雨把一件事读到底。本本词卡：这一本不引入新词，全部是读过的词。读前先看词卡，读完合上书说一说。',
    retell: '合上书，讲讲奶奶为什么等了那么久，结果学到了什么。（这一本是「问一问」。）',
    think: '回想一次「问了还是没懂」：把当时的问题改成一个更小的、指着某个词的问题。',
    pre: [
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👵', en: 'grandma', zh: '奶奶' }
    ],
    sight: [],
    newWords: [

    ],
    pages: [
      { art: 'home|grandma,mom|rain|·', en: 'Grandma is reading the word "rain" at home.', zh: '奶奶在家读「rain」这个词。' },
      { art: 'home|grandma,mom|rain|♪', en: 'Grandma wants to understand it.', zh: '奶奶想把它弄明白。' },
      { art: 'home|grandma,mom|rain|👀', en: 'One sentence does not make sense. We say grandpa, grapes and grass again.', zh: '有一句怎么也读不通。我们再把这三个词说一遍：爷爷、葡萄和草。' },
      { art: 'home|grandma,mom|rain|?', en: '"What does this part mean?" asks Grandma.', zh: '「这一段什么意思？」奶奶问。' },
      { art: 'home|grandma,mom|rain|·', en: 'Mom answers, but Grandma still looks lost.', zh: '妈妈答了，奶奶还是没懂。' },
      { art: 'home|grandma,mom|rain|!', en: 'The answer was right, but not the right answer.', zh: '答案没错，却不是问的那个。' },
      { art: 'home|grandma,mom|flag|♥', en: 'Mom asks, "Which word is the hard one?"', zh: '妈妈反问：「难的是哪个词？」' },
      { art: 'home|grandma,mom|rain|★', en: 'Now the whole sentence is clear.', zh: '这下整句都清楚了。' },
      { art: 'home|grandma,mom|rain|?', en: 'The real question had been a smaller one. We say the words again: grandpa and grapes.', zh: '真正该问的，是个更小的问题。我们把这两个词再说一遍：爷爷和葡萄。' },
      { art: 'home|grandma,mom|rain|·', en: 'They write down one new question. The smaller question stayed with them.', zh: '他们又写下一个新问题。那个更小的问题，他们一直记着。' }
    ],
    quiz: [
      { q: '这一本里，奶奶看到了下面哪一样？', opts: ['球', '草', '面包'], a: 1, kind: 'recall' },
      { q: '奶奶第一次为什么没听懂「rain」？', opts: ['因为读得太快', '问题太大，没指向真正卡住的那个词', '因为答案太短'], a: 1, kind: 'infer' },
      { q: '别人把「rain」解释完你还是没懂，你会怎么做？', opts: ['指出具体哪个词不懂，再问一遍', '把整段跳过去', '点点头装作懂了'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b58', lv: 'L5', tag: '小知识', title: 'Why a Seed Needs Rain', zh: '种子为什么需要雨',
    emoji: '🌾', color: '#FAD3B6',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。这一本走「问一问」这条线，不引入新词，全部是读过的词。',
    trap: '元音组合只读一个长音：ai / ay 都读 /eɪ/，oa 读 /əʊ/；别把两个字母分开念。',
    summary: '《种子为什么需要雨》是「问一问」：爷爷和爸爸在花园，围绕种子把一件事读到底。本本词卡：这一本不引入新词，全部是读过的词。读前先看词卡，读完合上书说一说。',
    retell: '合上书，讲讲爷爷为什么等了那么久，结果学到了什么。（这一本是「问一问」。）',
    think: '回想一次「问了还是没懂」：把当时的问题改成一个更小的、指着某个词的问题。',
    pre: [
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👴', en: 'grandpa', zh: '爷爷' }
    ],
    sight: ['garden'],
    newWords: [

    ],
    pages: [
      { art: 'garden|grandpa,dad|seed|·', en: 'Grandpa is reading the word "seed" in the garden.', zh: '爷爷在花园读「seed」这个词。' },
      { art: 'garden|grandpa,dad|seed|♪', en: 'Grandpa wants to understand it.', zh: '爷爷想把它弄明白。' },
      { art: 'garden|grandpa,dad|seed|👀', en: 'One sentence does not make sense. We say grapes, grass and green again.', zh: '有一句怎么也读不通。我们再把这三个词说一遍：葡萄、草和绿色。' },
      { art: 'garden|grandpa,dad|seed|?', en: '"What does this part mean?" asks Grandpa.', zh: '「这一段什么意思？」爷爷问。' },
      { art: 'garden|grandpa,dad|seed|·', en: 'Dad answers, but Grandpa still looks lost.', zh: '爸爸答了，爷爷还是没懂。' },
      { art: 'garden|grandpa,dad|seed|!', en: 'The answer was right, but not the right answer.', zh: '答案没错，却不是问的那个。' },
      { art: 'garden|grandpa,dad|clock|♥', en: 'Dad asks, "Which word is the hard one?"', zh: '爸爸反问：「难的是哪个词？」' },
      { art: 'garden|grandpa,dad|seed|★', en: 'Now the whole sentence is clear.', zh: '这下整句都清楚了。' },
      { art: 'garden|grandpa,dad|seed|?', en: 'The real question had been a smaller one. We say the words again: grapes and grass.', zh: '真正该问的，是个更小的问题。我们把这两个词再说一遍：葡萄和草。' },
      { art: 'garden|grandpa,dad|seed|·', en: 'They write down one new question. The smaller question stayed with them.', zh: '他们又写下一个新问题。那个更小的问题，他们一直记着。' }
    ],
    quiz: [
      { q: '爷爷和爸爸的这一本里，出现了下面哪一样？', opts: ['床', '公交车', '葡萄'], a: 2, kind: 'recall' },
      { q: '爷爷第一次为什么没听懂「seed」？', opts: ['因为读得太快', '问题太大，没指向真正卡住的那个词', '因为答案太短'], a: 1, kind: 'infer' },
      { q: '别人把「seed」解释完你还是没懂，你会怎么做？', opts: ['点点头装作懂了', '把整段跳过去', '指出具体哪个词不懂，再问一遍'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b59', lv: 'L5', tag: '小知识', title: 'A Week on the Farm', zh: '农场的一周',
    emoji: '🚜', color: '#C8E7F0',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。这一本走「合上书讲一遍」这条线，不引入新词，全部是读过的词。',
    trap: '元音组合只读一个长音：ai / ay 都读 /eɪ/，oa 读 /əʊ/；别把两个字母分开念。',
    summary: '《农场的一周》是「合上书讲一遍」：妈妈和明明在农场，围绕农场把一件事读到底。本本词卡：这一本不引入新词，全部是读过的词。读前先看词卡，读完合上书说一说。',
    retell: '合上书，讲讲妈妈为什么等了那么久，结果学到了什么。（这一本是「合上书讲一遍」。）',
    think: '合上书，用「谁 → 在哪儿 → 出了什么事 → 结果」把农场这一本讲给家长听。',
    pre: [
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👩', en: 'mom', zh: '妈妈' }
    ],
    sight: ['farm', 'playground'],
    newWords: [

    ],
    pages: [
      { art: 'farm|mom,ming|farm|·', en: 'Mom has just finished a book on the farm.', zh: '妈妈刚在农场读完一本书。' },
      { art: 'farm|mom,ming|farm|♪', en: 'Ming wants to hear all about it.', zh: '明明想听他讲讲。' },
      { art: 'farm|mom,ming|farm|👀', en: 'Mom thinks about the farm in the book. We say grass, green and ham again.', zh: '妈妈想着书里的农场。我们再把这三个词说一遍：草、绿色和火腿。' },
      { art: 'farm|mom,ming|farm|?', en: '"Where do I start?" asks Mom.', zh: '「从哪儿讲起？」妈妈问。' },
      { art: 'farm|mom,ming|farm|·', en: 'Mom tells the last part first.', zh: '妈妈先讲了结尾。' },
      { art: 'farm|mom,ming|farm|!', en: 'Ming cannot follow the story.', zh: '明明听不明白。' },
      { art: 'farm|mom,ming|playground|♥', en: 'Ming says, "Tell me who, where, then what."', zh: '明明说：「先说谁、在哪儿、再说出什么事。」' },
      { art: 'farm|mom,ming|farm|★', en: 'This time Ming can see the whole thing.', zh: '这回明明全听明白了。' },
      { art: 'farm|mom,ming|farm|?', en: 'A story needs its order to make sense. We say the words again: grass and green.', zh: '故事要靠顺序才讲得通。我们把这两个词再说一遍：草和绿色。' },
      { art: 'farm|mom,ming|farm|·', en: 'Tomorrow they will read about a playground. They could still tell it the next morning.', zh: '明天他们要读讲操场的书。第二天早上，他们还能讲得出来。' }
    ],
    quiz: [
      { q: '在农场读的这一本里，有下面哪一样？', opts: ['火腿', '爸爸', '鸭舌帽'], a: 0, kind: 'recall' },
      { q: '为什么明明第一遍没听明白？', opts: ['因为讲得太慢', '因为故事太短', '先讲了结尾，顺序乱了'], a: 2, kind: 'infer' },
      { q: '要把讲农场的这本读过的书讲给别人听，你会怎么开头？', opts: ['先说谁、在哪儿，再按顺序说出了什么事', '直接从最精彩的那句开始', '先报书名和生词表'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b60', lv: 'L5', tag: '复习', title: 'All the Way Home', zh: '一路回家',
    emoji: '🏡', color: '#E8D9B5',
    track: 'review',
    goal: '把本级和前面级别的词再读一遍、串成一个故事。这一本走「比一比」这条线，不引入新词，全部是读过的词。',
    trap: '元音组合只读一个长音：ai / ay 都读 /eɪ/，oa 读 /əʊ/；别把两个字母分开念。',
    summary: '《一路回家》是「比一比」：爸爸和丽丽在图书馆，围绕路把一件事读到底。本本词卡：这一本不引入新词，全部是读过的词。读前先看词卡，读完合上书说一说。',
    retell: '合上书，讲讲爸爸为什么等了那么久，结果学到了什么。（这一本是「比一比」。）',
    think: '找两样很像的东西，用英文说出至少两处不同，说说你是按什么顺序找的。',
    pre: [
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'they', zh: 'they' }
    ],
    sight: [],
    newWords: [

    ],
    pages: [
      { art: 'library|dad,lili|road|·', en: 'Dad looks at a road and a path.', zh: '爸爸看着路和小路。' },
      { art: 'library|dad,lili|road|♪', en: 'They want to know how they are different.', zh: '他们想知道两样有什么不一样。' },
      { art: 'library|dad,lili|road|👀', en: 'At first the two look the same. We say green, ham and hat again.', zh: '乍一看，两样挺像。我们再把这三个词说一遍：绿色、火腿和帽子。' },
      { art: 'library|dad,lili|road|?', en: '"What is not the same?" asks Lili.', zh: '「哪里不一样？」丽丽问。' },
      { art: 'library|dad,lili|road|·', en: 'They put them side by side.', zh: '他们把两样并排放。' },
      { art: 'library|dad,lili|road|!', en: 'Looking from far away does not help.', zh: '远远地看，还是看不出。' },
      { art: 'library|dad,lili|path|♥', en: 'Lili says, "Look at one part at a time."', zh: '丽丽说：「一处一处分开看。」' },
      { art: 'library|dad,lili|road|★', en: 'There! One small part is different.', zh: '有了！有一处小小的不同。' },
      { art: 'library|dad,lili|road|?', en: 'The difference was small, not missing. We say the words again: green and ham.', zh: '差别很小，不是没有。我们把这两个词再说一遍：绿色和火腿。' },
      { art: 'library|dad,lili|road|·', en: 'Next they will compare the path and the pen. They made a list of all the small differences.', zh: '接着他们要比一比小路和笔。他们把所有细小的不同都列了下来。' }
    ],
    quiz: [
      { q: '这一本里，爸爸看到了下面哪一样？', opts: ['旗子', '笔', '云'], a: 1, kind: 'recall' },
      { q: '路和小路一开始为什么看着一样？', opts: ['因为它们真的完全相同', '因为光线太暗', '只远远看了一眼，没一处一处分开比'], a: 2, kind: 'infer' },
      { q: '要找出像路和小路这样很像的两样东西哪里不同，你会怎么做？', opts: ['只挑一个看', '并排放好，一处一处分开看', '隔很远扫一眼'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b61', lv: 'L6', tag: '生日', title: 'A Cake for Grandma', zh: '给奶奶的蛋糕',
    emoji: '🎂', color: '#F6C6C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「一起做」这条线，认读 3 个新词。',
    trap: '词尾不发音的 e 会让前面的元音「报自己的名字」：cap → cape，kit → kite。',
    summary: '《给奶奶的蛋糕》是「一起做」：明明和奶奶在家，围绕蛋糕把一件事读到底。本本词卡：蛋糕、线、老鼠。读前先看词卡，读完合上书说一说。',
    retell: '按「计划 → 卡住 → 谁帮了忙 → 结果」讲一遍。（这一本是「一起做」。）',
    think: '说一件你做过的、步骤很多的事：哪一步最容易漏？下次怎么提醒自己？',
    pre: [
      { art: '🎂', en: 'cake', zh: '蛋糕' },
      { art: '📦', en: 'line', zh: '线' },
      { art: '🐭', en: 'mouse', zh: '老鼠' },
      { art: '📦', en: 'they', zh: 'they' },
      { art: '📦', en: 'the', zh: 'the' }
    ],
    sight: [],
    newWords: [
      { w: 'cake', zh: '蛋糕' },
      { w: 'line', zh: '线' },
      { w: 'mouse', zh: '老鼠' }
    ],
    pages: [
      { art: 'home|ming,grandma|cake|·', en: 'Ming has an idea at home.', zh: '明明在家有了个主意。' },
      { art: 'home|ming,grandma|cake|♪', en: '"Let us make a cake," says Ming.', zh: '「我们做蛋糕吧。」明明说。' },
      { art: 'home|ming,grandma|cake|👀', en: 'They get everything ready. They made a list: cake, line and mouse.', zh: '他们把要用的东西备齐。他们列了个单子：蛋糕、线和老鼠。' },
      { art: 'home|ming,grandma|cake|?', en: '"What do we need first?" asks Grandma.', zh: '「先要什么？」奶奶问。' },
      { art: 'home|ming,grandma|cake|·', en: 'They make a list, and they start.', zh: '他们列了个单子，就动手了。' },
      { art: 'home|ming,grandma|cake|!', en: 'It does not look right. Something is wrong.', zh: '样子不对，哪里出了岔子。' },
      { art: 'home|ming,grandma|room|♥', en: 'Grandma reads the list again, out loud.', zh: '奶奶把单子又大声念了一遍。' },
      { art: 'home|ming,grandma|cake|★', en: 'This time the cake is just right.', zh: '这次蛋糕正好。' },
      { art: 'home|ming,grandma|cake|?', en: 'The first time they did two steps at once.', zh: '第一遍两步并成一步做了。' },
      { art: 'home|ming,grandma|cake|♥', en: 'They are proud of the cake. We say the words again: cake and line.', zh: '他们为这个蛋糕挺得意。我们把这两个词再说一遍：蛋糕和线。' },
      { art: 'home|ming,grandma|cake|·', en: 'They write down what they would do next time. The list went up on the wall.', zh: '他们写下下次要怎么做。那张单子后来贴在了墙上。' }
    ],
    quiz: [
      { q: '明明和奶奶的这一本里，出现了下面哪一样？', opts: ['茎', '种子', '蛋糕'], a: 2, kind: 'recall' },
      { q: '明明第一次为什么没做成蛋糕？', opts: ['因为没人帮忙', '因为材料不够', '两步并成一步，漏了顺序'], a: 2, kind: 'infer' },
      { q: '做一件步骤很多的事（像做蛋糕那样），你会先做什么？', opts: ['直接跳过开头的步骤', '先把步骤写下来，再一步一步做', '想到哪步做哪步'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b62', lv: 'L6', tag: '春天', title: 'The Kite by the Lake', zh: '湖边的风筝',
    emoji: '🪁', color: '#F9DFB4',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「修好它」这条线，认读 3 个新词。',
    trap: '词尾不发音的 e 会让前面的元音「报自己的名字」：cap → cape，kit → kite。',
    summary: '《湖边的风筝》是「修好它」：丽丽和爷爷在公园，围绕风筝把一件事读到底。本本词卡：方块、脸、游戏。读前先看词卡，读完合上书说一说。',
    retell: '按「计划 → 卡住 → 谁帮了忙 → 结果」讲一遍。（这一本是「修好它」。）',
    think: '说一样坏过的东西：你一开始反复试了什么？后来发现真正的问题在哪儿？',
    pre: [
      { art: '📦', en: 'cube', zh: '方块' },
      { art: '📦', en: 'face', zh: '脸' },
      { art: '🎲', en: 'game', zh: '游戏' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'they', zh: 'they' }
    ],
    sight: ['park'],
    newWords: [
      { w: 'cube', zh: '方块' },
      { w: 'face', zh: '脸' },
      { w: 'game', zh: '游戏' }
    ],
    pages: [
      { art: 'park|lili,grandpa|kite|·', en: 'The kite does not work in the park.', zh: '公园的风筝不好使了。' },
      { art: 'park|lili,grandpa|kite|♪', en: 'Lili wants to fix it.', zh: '丽丽想把它修好。' },
      { art: 'park|lili,grandpa|kite|👀', en: 'They look at it from every side. They made a list: cube, face and game.', zh: '他们从各个面都看了一遍。他们列了个单子：方块、脸和游戏。' },
      { art: 'park|lili,grandpa|kite|?', en: '"What did we change?" asks Grandpa.', zh: '「我们改过什么？」爷爷问。' },
      { art: 'park|lili,grandpa|kite|·', en: 'Lili tries the same thing again.', zh: '丽丽照原样又试了一次。' },
      { art: 'park|lili,grandpa|kite|!', en: 'It still does not work.', zh: '还是不行。' },
      { art: 'park|lili,grandpa|picture|♥', en: 'Grandpa points to one small part.', zh: '爷爷指着一个小小的部位。' },
      { art: 'park|lili,grandpa|kite|★', en: 'Now the kite works again.', zh: '风筝又能用了。' },
      { art: 'park|lili,grandpa|kite|?', en: 'The trouble was small, but it was hard to see.', zh: '毛病很小，可是不容易看见。' },
      { art: 'park|lili,grandpa|kite|♥', en: 'Lili laughs. Grandpa laughs too. We say the words again: cube and face.', zh: '丽丽笑了，爷爷也笑了。我们把这两个词再说一遍：方块和脸。' },
      { art: 'park|lili,grandpa|kite|·', en: 'They remember to look before they try again. They kept the small part in a box.', zh: '他们记住了：再试之前，先看一看。他们把那个小零件收进了盒子。' }
    ],
    quiz: [
      { q: '在公园读的这一本里，有下面哪一样？', opts: ['公园', '石头', '风'], a: 0, kind: 'recall' },
      { q: '为什么试了很多次都没修好风筝？', opts: ['一直重复同一个动作，没找对小毛病', '因为工具不够', '因为没人愿意帮忙'], a: 0, kind: 'infer' },
      { q: '一件事反复做还是不行（像修风筝那样），你会怎么做？', opts: ['把同样的动作再做十遍', '先停下来看看是不是漏了一处小的', '干脆换个人做'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b63', lv: 'L6', tag: '家里', title: 'A Name on the Plate', zh: '盘子上的名字',
    emoji: '🍽️', color: '#CDE7C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「问一问」这条线，认读 3 个新词。',
    trap: '词尾不发音的 e 会让前面的元音「报自己的名字」：cap → cape，kit → kite。',
    summary: '《盘子上的名字》是「问一问」：奶奶和妈妈在家，围绕名字把一件事读到底。本本词卡：蛇、自行车、大门。读前先看词卡，读完合上书说一说。',
    retell: '按「计划 → 卡住 → 谁帮了忙 → 结果」讲一遍。（这一本是「问一问」。）',
    think: '回想一次「问了还是没懂」：把当时的问题改成一个更小的、指着某个词的问题。',
    pre: [
      { art: '🐍', en: 'snake', zh: '蛇' },
      { art: '🚲', en: 'bike', zh: '自行车' },
      { art: '📍', en: 'gate', zh: '大门' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👵', en: 'grandma', zh: '奶奶' }
    ],
    sight: [],
    newWords: [
      { w: 'snake', zh: '蛇' },
      { w: 'bike', zh: '自行车' },
      { w: 'gate', zh: '大门' }
    ],
    pages: [
      { art: 'home|grandma,mom|name|·', en: 'Grandma is reading the word "name" at home.', zh: '奶奶在家读「name」这个词。' },
      { art: 'home|grandma,mom|name|♪', en: 'Grandma wants to understand it.', zh: '奶奶想把它弄明白。' },
      { art: 'home|grandma,mom|name|👀', en: 'One sentence does not make sense. They made a list: snake, bike and gate.', zh: '有一句怎么也读不通。他们列了个单子：蛇、自行车和大门。' },
      { art: 'home|grandma,mom|name|?', en: '"What does this part mean?" asks Grandma.', zh: '「这一段什么意思？」奶奶问。' },
      { art: 'home|grandma,mom|name|·', en: 'Mom answers, but Grandma still looks lost.', zh: '妈妈答了，奶奶还是没懂。' },
      { art: 'home|grandma,mom|name|!', en: 'The answer was right, but not the right answer.', zh: '答案没错，却不是问的那个。' },
      { art: 'home|grandma,mom|brush|♥', en: 'Mom asks, "Which word is the hard one?"', zh: '妈妈反问：「难的是哪个词？」' },
      { art: 'home|grandma,mom|name|★', en: 'Now the whole sentence is clear.', zh: '这下整句都清楚了。' },
      { art: 'home|grandma,mom|name|?', en: 'The real question had been a smaller one.', zh: '真正该问的，是个更小的问题。' },
      { art: 'home|grandma,mom|name|♥', en: 'Grandma says the sentence out loud. We say the words again: snake and bike.', zh: '奶奶把这句大声念了出来。我们把这两个词再说一遍：蛇和自行车。' },
      { art: 'home|grandma,mom|name|·', en: 'They write down one new question. The smaller question stayed with them.', zh: '他们又写下一个新问题。那个更小的问题，他们一直记着。' }
    ],
    quiz: [
      { q: '这一本里，奶奶看到了下面哪一样？', opts: ['大门', '尾巴', '蚂蚁'], a: 0, kind: 'recall' },
      { q: '奶奶第一次为什么没听懂「name」？', opts: ['因为读得太快', '问题太大，没指向真正卡住的那个词', '因为答案太短'], a: 1, kind: 'infer' },
      { q: '别人把「name」解释完你还是没懂，你会怎么做？', opts: ['点点头装作懂了', '指出具体哪个词不懂，再问一遍', '把整段跳过去'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b64', lv: 'L6', tag: '运动', title: 'Ride a Bike', zh: '骑自行车',
    emoji: '🚲', color: '#C6DEF6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「说出名字」这条线，认读 3 个新词。',
    trap: '词尾不发音的 e 会让前面的元音「报自己的名字」：cap → cape，kit → kite。',
    summary: '《骑自行车》是「说出名字」：爷爷和爸爸在街道，围绕自行车把一件事读到底。本本词卡：纸条、绳子、玫瑰。读前先看词卡，读完合上书说一说。',
    retell: '按「计划 → 卡住 → 谁帮了忙 → 结果」讲一遍。（这一本是「说出名字」。）',
    think: '挑自行车和杯子，各说一个英文词，再各说一句完整的话把它们放进去。',
    pre: [
      { art: '📝', en: 'note', zh: '纸条' },
      { art: '🪢', en: 'rope', zh: '绳子' },
      { art: '🌹', en: 'rose', zh: '玫瑰' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'a', zh: 'a' }
    ],
    sight: [],
    newWords: [
      { w: 'note', zh: '纸条' },
      { w: 'rope', zh: '绳子' },
      { w: 'rose', zh: '玫瑰' }
    ],
    pages: [
      { art: 'street|grandpa,dad|bike|·', en: 'Grandpa and Dad are on the street.', zh: '爷爷和爸爸在街道。' },
      { art: 'street|grandpa,dad|bike|♪', en: 'They want to name what they see.', zh: '他们想把看见的东西说出名字。' },
      { art: 'street|grandpa,dad|bike|👀', en: 'Grandpa points at a bike. They made a list: note, rope and rose.', zh: '爷爷指着自行车。他们列了个单子：纸条、绳子和玫瑰。' },
      { art: 'street|grandpa,dad|bike|?', en: '"What is the English word?" asks Dad.', zh: '「英文怎么说？」爸爸问。' },
      { art: 'street|grandpa,dad|bike|·', en: 'Grandpa says it, but it does not sound right.', zh: '爷爷说了一遍，听着不太对。' },
      { art: 'street|grandpa,dad|bike|!', en: 'The word is there, but the sound is not.', zh: '词想起来了，音没对准。' },
      { art: 'street|grandpa,dad|cup|♥', en: 'Dad says the whole sentence slowly.', zh: '爸爸把整句慢慢说了一遍。' },
      { art: 'street|grandpa,dad|bike|★', en: 'Now "bike" sounds right.', zh: '这下「bike」说对了。' },
      { art: 'street|grandpa,dad|bike|?', en: 'A word changes a little inside a sentence.', zh: '词放进句子里，声音会有点变。' },
      { art: 'street|grandpa,dad|bike|♥', en: 'Grandpa says it once more, all alone. We say the words again: note and rope.', zh: '爷爷又自己说了一遍。我们把这两个词再说一遍：纸条和绳子。' },
      { art: 'street|grandpa,dad|bike|·', en: 'They point at a cup and start again. By the end of the page, the word felt easy.', zh: '他们指着杯子，又从头来。读到这一页末尾，那个词已经不难了。' }
    ],
    quiz: [
      { q: '爷爷和爸爸的这一本里，出现了下面哪一样？', opts: ['翅膀', '蜜蜂', '绳子'], a: 2, kind: 'recall' },
      { q: '为什么爷爷第一遍说得不太对？', opts: ['因为不认识这个词', '因为说得太快', '把一个词一个词分开念，没听整句'], a: 2, kind: 'infer' },
      { q: '遇到像「bike」这样会说但说不顺的英文词，你会怎么做？', opts: ['只看中文意思', '把这个词跳过去', '先听整句，再跟着把整句说一遍'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b65', lv: 'L6', tag: '花园', title: 'A Rose at the Gate', zh: '门口的玫瑰',
    emoji: '🌹', color: '#E0CFF3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「合上书讲一遍」这条线，认读 3 个新词。',
    trap: '词尾不发音的 e 会让前面的元音「报自己的名字」：cap → cape，kit → kite。',
    summary: '《门口的玫瑰》是「合上书讲一遍」：妈妈和明明在花园，围绕玫瑰把一件事读到底。本本词卡：湖、青柠、鼻子。读前先看词卡，读完合上书说一说。',
    retell: '按「计划 → 卡住 → 谁帮了忙 → 结果」讲一遍。（这一本是「合上书讲一遍」。）',
    think: '合上书，用「谁 → 在哪儿 → 出了什么事 → 结果」把玫瑰这一本讲给家长听。',
    pre: [
      { art: '🏞️', en: 'lake', zh: '湖' },
      { art: '🍚', en: 'lime', zh: '青柠' },
      { art: '👃', en: 'nose', zh: '鼻子' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👩', en: 'mom', zh: '妈妈' }
    ],
    sight: ['garden'],
    newWords: [
      { w: 'lake', zh: '湖' },
      { w: 'lime', zh: '青柠' },
      { w: 'nose', zh: '鼻子' }
    ],
    pages: [
      { art: 'garden|mom,ming|rose|·', en: 'Mom has just finished a book in the garden.', zh: '妈妈刚在花园读完一本书。' },
      { art: 'garden|mom,ming|rose|♪', en: 'Ming wants to hear all about it.', zh: '明明想听他讲讲。' },
      { art: 'garden|mom,ming|rose|👀', en: 'Mom thinks about the rose in the book. They made a list: lake, lime and nose.', zh: '妈妈想着书里的玫瑰。他们列了个单子：湖、青柠和鼻子。' },
      { art: 'garden|mom,ming|rose|?', en: '"Where do I start?" asks Mom.', zh: '「从哪儿讲起？」妈妈问。' },
      { art: 'garden|mom,ming|rose|·', en: 'Mom tells the last part first.', zh: '妈妈先讲了结尾。' },
      { art: 'garden|mom,ming|rose|!', en: 'Ming cannot follow the story.', zh: '明明听不明白。' },
      { art: 'garden|mom,ming|clock|♥', en: 'Ming says, "Tell me who, where, then what."', zh: '明明说：「先说谁、在哪儿、再说出什么事。」' },
      { art: 'garden|mom,ming|rose|★', en: 'This time Ming can see the whole thing.', zh: '这回明明全听明白了。' },
      { art: 'garden|mom,ming|rose|?', en: 'A story needs its order to make sense.', zh: '故事要靠顺序才讲得通。' },
      { art: 'garden|mom,ming|rose|♥', en: 'Mom closes the book and tells it again. We say the words again: lake and lime.', zh: '妈妈合上书，又讲了一遍。我们把这两个词再说一遍：湖和青柠。' },
      { art: 'garden|mom,ming|rose|·', en: 'Tomorrow they will read about a clock. They could still tell it the next morning.', zh: '明天他们要读讲钟的书。第二天早上，他们还能讲得出来。' }
    ],
    quiz: [
      { q: '在花园读的这一本里，有下面哪一样？', opts: ['鼻子', '盒子', '书包'], a: 0, kind: 'recall' },
      { q: '为什么明明第一遍没听明白？', opts: ['因为故事太短', '因为讲得太慢', '先讲了结尾，顺序乱了'], a: 2, kind: 'infer' },
      { q: '要把讲玫瑰的这本读过的书讲给别人听，你会怎么开头？', opts: ['先说谁、在哪儿，再按顺序说出了什么事', '先报书名和生词表', '直接从最精彩的那句开始'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b66', lv: 'L6', tag: '发现', title: 'A Note in a Book', zh: '书里的纸条',
    emoji: '📝', color: '#F6C9E3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「找回来」这条线，认读 2 个新词。',
    trap: '词尾不发音的 e 会让前面的元音「报自己的名字」：cap → cape，kit → kite。',
    summary: '《书里的纸条》是「找回来」：爸爸和丽丽在家，围绕纸条把一件事读到底。本本词卡：葡萄、洞。读前先看词卡，读完合上书说一说。',
    retell: '按「计划 → 卡住 → 谁帮了忙 → 结果」讲一遍。（这一本是「找回来」。）',
    think: '说一说你有没有把东西放忘了的时候：先说在哪儿丢的，再说最后在哪儿找到。',
    pre: [
      { art: '🍇', en: 'grape', zh: '葡萄' },
      { art: '🕳️', en: 'hole', zh: '洞' },
      { art: '📦', en: 'they', zh: 'they' },
      { art: '📦', en: 'and', zh: 'and' }
    ],
    sight: [],
    newWords: [
      { w: 'grape', zh: '葡萄' },
      { w: 'hole', zh: '洞' }
    ],
    pages: [
      { art: 'home|dad,lili|note|·', en: 'Dad and Lili are at home.', zh: '爸爸和丽丽在家。' },
      { art: 'home|dad,lili|note|♪', en: 'Dad wants a note.', zh: '爸爸想要纸条。' },
      { art: 'home|dad,lili|note|👀', en: 'They look at the cake and the clock. They made a list: grape, hole and green.', zh: '他们看看蛋糕和钟。他们列了个单子：葡萄、洞和绿色。' },
      { art: 'home|dad,lili|note|?', en: '"Where is my note?" asks Dad.', zh: '「我的纸条呢？」爸爸问。' },
      { art: 'home|dad,lili|note|·', en: 'They look here, and they look there.', zh: '他们这儿看看，那儿看看。' },
      { art: 'home|dad,lili|note|!', en: 'No note. Not here, not there.', zh: '没有纸条。这儿没有，那儿也没有。' },
      { art: 'home|dad,lili|cake|♥', en: 'Lili says, "Let us go back and look again."', zh: '丽丽说：「我们回去再找一遍。」' },
      { art: 'home|dad,lili|note|★', en: 'There it is! The note was at home all along.', zh: '在那儿！纸条一直在家。' },
      { art: 'home|dad,lili|note|?', en: 'They had been in a hurry the first time.', zh: '第一遍太着急了。' },
      { art: 'home|dad,lili|note|♥', en: 'Dad is glad. Lili is glad too. We say the words again: grape and hole.', zh: '爸爸很高兴，丽丽也很高兴。我们把这两个词再说一遍：葡萄和洞。' },
      { art: 'home|dad,lili|note|·', en: 'They put the note back where it belongs. From then on, they looked twice before they gave up.', zh: '他们把纸条放回原处。从那以后，他们会再看一遍才放弃。' }
    ],
    quiz: [
      { q: '这一本里，爸爸看到了下面哪一样？', opts: ['绿色', '罐子', '长椅'], a: 0, kind: 'recall' },
      { q: '为什么第一遍没找到纸条？', opts: ['看得太快，漏掉了最开始的地方', '因为天黑了', '因为纸条不见了'], a: 0, kind: 'infer' },
      { q: '如果你的纸条找不到了，你会先做什么？', opts: ['不找了，直接走开', '先回到最开始的地方慢慢找一遍', '马上再买一个新的'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b67', lv: 'L6', tag: '玩耍', title: 'Make a Game', zh: '做个游戏',
    emoji: '🎲', color: '#BFE6DF',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「比一比」这条线，不引入新词，全部是读过的词。',
    trap: '词尾不发音的 e 会让前面的元音「报自己的名字」：cap → cape，kit → kite。',
    summary: '《做个游戏》是「比一比」：明明和奶奶在操场，围绕游戏把一件事读到底。本本词卡：这一本不引入新词，全部是读过的词。读前先看词卡，读完合上书说一说。',
    retell: '按「计划 → 卡住 → 谁帮了忙 → 结果」讲一遍。（这一本是「比一比」。）',
    think: '找两样很像的东西，用英文说出至少两处不同，说说你是按什么顺序找的。',
    pre: [
      { art: '📦', en: 'they', zh: 'they' },
      { art: '📦', en: 'the', zh: 'the' }
    ],
    sight: [],
    newWords: [

    ],
    pages: [
      { art: 'playground|ming,grandma|game|·', en: 'Ming looks at a game and a book.', zh: '明明看着游戏和书。' },
      { art: 'playground|ming,grandma|game|♪', en: 'They want to know how they are different.', zh: '他们想知道两样有什么不一样。' },
      { art: 'playground|ming,grandma|game|👀', en: 'At first the two look the same. They made a list: green, ham and hat.', zh: '乍一看，两样挺像。他们列了个单子：绿色、火腿和帽子。' },
      { art: 'playground|ming,grandma|game|?', en: '"What is not the same?" asks Grandma.', zh: '「哪里不一样？」奶奶问。' },
      { art: 'playground|ming,grandma|game|·', en: 'They put them side by side.', zh: '他们把两样并排放。' },
      { art: 'playground|ming,grandma|game|!', en: 'Looking from far away does not help.', zh: '远远地看，还是看不出。' },
      { art: 'playground|ming,grandma|book|♥', en: 'Grandma says, "Look at one part at a time."', zh: '奶奶说：「一处一处分开看。」' },
      { art: 'playground|ming,grandma|game|★', en: 'There! One small part is different.', zh: '有了！有一处小小的不同。' },
      { art: 'playground|ming,grandma|game|?', en: 'The difference was small, not missing.', zh: '差别很小，不是没有。' },
      { art: 'playground|ming,grandma|game|♥', en: 'They tell Ming what they found. We say the words again: green and ham.', zh: '他们把自己发现的讲给明明听。我们把这两个词再说一遍：绿色和火腿。' },
      { art: 'playground|ming,grandma|game|·', en: 'Next they will compare the book and the ball. They made a list of all the small differences.', zh: '接着他们要比一比书和球。他们把所有细小的不同都列了下来。' }
    ],
    quiz: [
      { q: '明明和奶奶的这一本里，出现了下面哪一样？', opts: ['绿色', '螃蟹', '公交车'], a: 0, kind: 'recall' },
      { q: '游戏和书一开始为什么看着一样？', opts: ['只远远看了一眼，没一处一处分开比', '因为它们真的完全相同', '因为光线太暗'], a: 0, kind: 'infer' },
      { q: '要找出像游戏和书这样很像的两样东西哪里不同，你会怎么做？', opts: ['隔很远扫一眼', '并排放好，一处一处分开看', '只挑一个看'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b68', lv: 'L6', tag: '故事', title: 'The Brave Little Mouse', zh: '勇敢的小老鼠',
    emoji: '🐭', color: '#F2E2A8',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「比一比」这条线，不引入新词，全部是读过的词。',
    trap: '词尾不发音的 e 会让前面的元音「报自己的名字」：cap → cape，kit → kite。',
    summary: '《勇敢的小老鼠》是「比一比」：丽丽和爷爷在公园，围绕老鼠把一件事读到底。本本词卡：这一本不引入新词，全部是读过的词。读前先看词卡，读完合上书说一说。',
    retell: '按「计划 → 卡住 → 谁帮了忙 → 结果」讲一遍。（这一本是「比一比」。）',
    think: '找两样很像的东西，用英文说出至少两处不同，说说你是按什么顺序找的。',
    pre: [
      { art: '📦', en: 'they', zh: 'they' },
      { art: '📦', en: 'the', zh: 'the' }
    ],
    sight: ['mouse', 'photo'],
    newWords: [

    ],
    pages: [
      { art: 'park|lili,grandpa|mouse|·', en: 'Lili looks at a mouse and a photo.', zh: '丽丽看着老鼠和照片。' },
      { art: 'park|lili,grandpa|mouse|♪', en: 'They want to know how they are different.', zh: '他们想知道两样有什么不一样。' },
      { art: 'park|lili,grandpa|mouse|👀', en: 'At first the two look the same. They made a list: ham, hat and hen.', zh: '乍一看，两样挺像。他们列了个单子：火腿、帽子和母鸡。' },
      { art: 'park|lili,grandpa|mouse|?', en: '"What is not the same?" asks Grandpa.', zh: '「哪里不一样？」爷爷问。' },
      { art: 'park|lili,grandpa|mouse|·', en: 'They put them side by side.', zh: '他们把两样并排放。' },
      { art: 'park|lili,grandpa|mouse|!', en: 'Looking from far away does not help.', zh: '远远地看，还是看不出。' },
      { art: 'park|lili,grandpa|photo|♥', en: 'Grandpa says, "Look at one part at a time."', zh: '爷爷说：「一处一处分开看。」' },
      { art: 'park|lili,grandpa|mouse|★', en: 'There! One small part is different.', zh: '有了！有一处小小的不同。' },
      { art: 'park|lili,grandpa|mouse|?', en: 'The difference was small, not missing.', zh: '差别很小，不是没有。' },
      { art: 'park|lili,grandpa|mouse|♥', en: 'They tell Lili what they found. We say the words again: ham and hat.', zh: '他们把自己发现的讲给丽丽听。我们把这两个词再说一遍：火腿和帽子。' },
      { art: 'park|lili,grandpa|mouse|·', en: 'Next they will compare the photo and the flag. They made a list of all the small differences.', zh: '接着他们要比一比照片和旗子。他们把所有细小的不同都列了下来。' }
    ],
    quiz: [
      { q: '在公园读的这一本里，有下面哪一样？', opts: ['方块', '照片', '罐子'], a: 1, kind: 'recall' },
      { q: '老鼠和照片一开始为什么看着一样？', opts: ['只远远看了一眼，没一处一处分开比', '因为它们真的完全相同', '因为光线太暗'], a: 0, kind: 'infer' },
      { q: '要找出像老鼠和照片这样很像的两样东西哪里不同，你会怎么做？', opts: ['只挑一个看', '隔很远扫一眼', '并排放好，一处一处分开看'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b69', lv: 'L6', tag: '发音', title: 'Say It: Cap, Cape', zh: '说一说：cap cape',
    emoji: '🗣️', color: '#D9D2F5',
    track: 'drill',
    goal: '把本级难点音听准、说准，并能在整句里读对。这一本走「问一问」这条线，不引入新词，全部是读过的词。',
    trap: '词尾不发音的 e 会让前面的元音「报自己的名字」：cap → cape，kit → kite。',
    summary: '《说一说：cap cape》是「问一问」：奶奶和妈妈在家，围绕鸭舌帽把一件事读到底。本本词卡：这一本不引入新词，全部是读过的词。读前先看词卡，读完合上书说一说。',
    retell: '按「计划 → 卡住 → 谁帮了忙 → 结果」讲一遍。（这一本是「问一问」。）',
    think: '回想一次「问了还是没懂」：把当时的问题改成一个更小的、指着某个词的问题。',
    pre: [
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👵', en: 'grandma', zh: '奶奶' }
    ],
    sight: [],
    newWords: [

    ],
    pages: [
      { art: 'home|grandma,mom|cap|·', en: 'Grandma is reading the word "cap" at home.', zh: '奶奶在家读「cap」这个词。' },
      { art: 'home|grandma,mom|cap|♪', en: 'Grandma wants to understand it.', zh: '奶奶想把它弄明白。' },
      { art: 'home|grandma,mom|cap|👀', en: 'One sentence does not make sense. They made a list: hat, hen and hill.', zh: '有一句怎么也读不通。他们列了个单子：帽子、母鸡和小山。' },
      { art: 'home|grandma,mom|cap|?', en: '"What does this part mean?" asks Grandma.', zh: '「这一段什么意思？」奶奶问。' },
      { art: 'home|grandma,mom|cap|·', en: 'Mom answers, but Grandma still looks lost.', zh: '妈妈答了，奶奶还是没懂。' },
      { art: 'home|grandma,mom|cap|!', en: 'The answer was right, but not the right answer.', zh: '答案没错，却不是问的那个。' },
      { art: 'home|grandma,mom|gift|♥', en: 'Mom asks, "Which word is the hard one?"', zh: '妈妈反问：「难的是哪个词？」' },
      { art: 'home|grandma,mom|cap|★', en: 'Now the whole sentence is clear.', zh: '这下整句都清楚了。' },
      { art: 'home|grandma,mom|cap|?', en: 'The real question had been a smaller one.', zh: '真正该问的，是个更小的问题。' },
      { art: 'home|grandma,mom|cap|♥', en: 'Grandma says the sentence out loud. We say the words again: hat and hen.', zh: '奶奶把这句大声念了出来。我们把这两个词再说一遍：帽子和母鸡。' },
      { art: 'home|grandma,mom|cap|·', en: 'They write down one new question. The smaller question stayed with them.', zh: '他们又写下一个新问题。那个更小的问题，他们一直记着。' }
    ],
    quiz: [
      { q: '这一本里，奶奶看到了下面哪一样？', opts: ['小鸡', '鸭舌帽', '鼓'], a: 1, kind: 'recall' },
      { q: '奶奶第一次为什么没听懂「cap」？', opts: ['问题太大，没指向真正卡住的那个词', '因为答案太短', '因为读得太快'], a: 0, kind: 'infer' },
      { q: '别人把「cap」解释完你还是没懂，你会怎么做？', opts: ['指出具体哪个词不懂，再问一遍', '把整段跳过去', '点点头装作懂了'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b70', lv: 'L6', tag: '小知识', title: 'Why a Cake Rises', zh: '蛋糕为什么会鼓起来',
    emoji: '🧁', color: '#FAD3B6',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。这一本走「问一问」这条线，不引入新词，全部是读过的词。',
    trap: '词尾不发音的 e 会让前面的元音「报自己的名字」：cap → cape，kit → kite。',
    summary: '《蛋糕为什么会鼓起来》是「问一问」：爷爷和爸爸在家，围绕蛋糕把一件事读到底。本本词卡：这一本不引入新词，全部是读过的词。读前先看词卡，读完合上书说一说。',
    retell: '按「计划 → 卡住 → 谁帮了忙 → 结果」讲一遍。（这一本是「问一问」。）',
    think: '回想一次「问了还是没懂」：把当时的问题改成一个更小的、指着某个词的问题。',
    pre: [
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👴', en: 'grandpa', zh: '爷爷' }
    ],
    sight: [],
    newWords: [

    ],
    pages: [
      { art: 'home|grandpa,dad|cake|·', en: 'Grandpa is reading the word "cake" at home.', zh: '爷爷在家读「cake」这个词。' },
      { art: 'home|grandpa,dad|cake|♪', en: 'Grandpa wants to understand it.', zh: '爷爷想把它弄明白。' },
      { art: 'home|grandpa,dad|cake|👀', en: 'One sentence does not make sense. They made a list: hen, hill and hole.', zh: '有一句怎么也读不通。他们列了个单子：母鸡、小山和洞。' },
      { art: 'home|grandpa,dad|cake|?', en: '"What does this part mean?" asks Grandpa.', zh: '「这一段什么意思？」爷爷问。' },
      { art: 'home|grandpa,dad|cake|·', en: 'Dad answers, but Grandpa still looks lost.', zh: '爸爸答了，爷爷还是没懂。' },
      { art: 'home|grandpa,dad|cake|!', en: 'The answer was right, but not the right answer.', zh: '答案没错，却不是问的那个。' },
      { art: 'home|grandpa,dad|lunch|♥', en: 'Dad asks, "Which word is the hard one?"', zh: '爸爸反问：「难的是哪个词？」' },
      { art: 'home|grandpa,dad|cake|★', en: 'Now the whole sentence is clear.', zh: '这下整句都清楚了。' },
      { art: 'home|grandpa,dad|cake|?', en: 'The real question had been a smaller one.', zh: '真正该问的，是个更小的问题。' },
      { art: 'home|grandpa,dad|cake|♥', en: 'Grandpa says the sentence out loud. We say the words again: hen and hill.', zh: '爷爷把这句大声念了出来。我们把这两个词再说一遍：母鸡和小山。' },
      { art: 'home|grandpa,dad|cake|·', en: 'They write down one new question. The smaller question stayed with them.', zh: '他们又写下一个新问题。那个更小的问题，他们一直记着。' }
    ],
    quiz: [
      { q: '爷爷和爸爸的这一本里，出现了下面哪一样？', opts: ['母鸡', '乌鸦', '雾'], a: 0, kind: 'recall' },
      { q: '爷爷第一次为什么没听懂「cake」？', opts: ['因为答案太短', '问题太大，没指向真正卡住的那个词', '因为读得太快'], a: 1, kind: 'infer' },
      { q: '别人把「cake」解释完你还是没懂，你会怎么做？', opts: ['把整段跳过去', '点点头装作懂了', '指出具体哪个词不懂，再问一遍'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b71', lv: 'L6', tag: '小知识', title: 'A Hole in the Rope', zh: '绳子上的洞',
    emoji: '🪢', color: '#C8E7F0',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。这一本走「合上书讲一遍」这条线，不引入新词，全部是读过的词。',
    trap: '词尾不发音的 e 会让前面的元音「报自己的名字」：cap → cape，kit → kite。',
    summary: '《绳子上的洞》是「合上书讲一遍」：妈妈和明明在家，围绕洞把一件事读到底。本本词卡：这一本不引入新词，全部是读过的词。读前先看词卡，读完合上书说一说。',
    retell: '按「计划 → 卡住 → 谁帮了忙 → 结果」讲一遍。（这一本是「合上书讲一遍」。）',
    think: '合上书，用「谁 → 在哪儿 → 出了什么事 → 结果」把洞这一本讲给家长听。',
    pre: [
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👩', en: 'mom', zh: '妈妈' }
    ],
    sight: [],
    newWords: [

    ],
    pages: [
      { art: 'home|mom,ming|hole|·', en: 'Mom has just finished a book at home.', zh: '妈妈刚在家读完一本书。' },
      { art: 'home|mom,ming|hole|♪', en: 'Ming wants to hear all about it.', zh: '明明想听他讲讲。' },
      { art: 'home|mom,ming|hole|👀', en: 'Mom thinks about the hole in the book. They made a list: hill, hole and home.', zh: '妈妈想着书里的洞。他们列了个单子：小山、洞和家。' },
      { art: 'home|mom,ming|hole|?', en: '"Where do I start?" asks Mom.', zh: '「从哪儿讲起？」妈妈问。' },
      { art: 'home|mom,ming|hole|·', en: 'Mom tells the last part first.', zh: '妈妈先讲了结尾。' },
      { art: 'home|mom,ming|hole|!', en: 'Ming cannot follow the story.', zh: '明明听不明白。' },
      { art: 'home|mom,ming|pen|♥', en: 'Ming says, "Tell me who, where, then what."', zh: '明明说：「先说谁、在哪儿、再说出什么事。」' },
      { art: 'home|mom,ming|hole|★', en: 'This time Ming can see the whole thing.', zh: '这回明明全听明白了。' },
      { art: 'home|mom,ming|hole|?', en: 'A story needs its order to make sense.', zh: '故事要靠顺序才讲得通。' },
      { art: 'home|mom,ming|hole|♥', en: 'Mom closes the book and tells it again. We say the words again: hill and hole.', zh: '妈妈合上书，又讲了一遍。我们把这两个词再说一遍：小山和洞。' },
      { art: 'home|mom,ming|hole|·', en: 'Tomorrow they will read about a pen. They could still tell it the next morning.', zh: '明天他们要读讲笔的书。第二天早上，他们还能讲得出来。' }
    ],
    quiz: [
      { q: '在家读的这一本里，有下面哪一样？', opts: ['小山', '鸡蛋', '礼物'], a: 0, kind: 'recall' },
      { q: '为什么明明第一遍没听明白？', opts: ['因为讲得太慢', '因为故事太短', '先讲了结尾，顺序乱了'], a: 2, kind: 'infer' },
      { q: '要把讲洞的这本读过的书讲给别人听，你会怎么开头？', opts: ['先说谁、在哪儿，再按顺序说出了什么事', '直接从最精彩的那句开始', '先报书名和生词表'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b72', lv: 'L6', tag: '复习', title: 'The Same Plate', zh: '同一个盘子',
    emoji: '🍽️', color: '#E8D9B5',
    track: 'review',
    goal: '把本级和前面级别的词再读一遍、串成一个故事。这一本走「比一比」这条线，不引入新词，全部是读过的词。',
    trap: '词尾不发音的 e 会让前面的元音「报自己的名字」：cap → cape，kit → kite。',
    summary: '《同一个盘子》是「比一比」：爸爸和丽丽在图书馆，围绕盘子把一件事读到底。本本词卡：这一本不引入新词，全部是读过的词。读前先看词卡，读完合上书说一说。',
    retell: '按「计划 → 卡住 → 谁帮了忙 → 结果」讲一遍。（这一本是「比一比」。）',
    think: '找两样很像的东西，用英文说出至少两处不同，说说你是按什么顺序找的。',
    pre: [
      { art: '📦', en: 'they', zh: 'they' },
      { art: '📦', en: 'the', zh: 'the' }
    ],
    sight: [],
    newWords: [

    ],
    pages: [
      { art: 'library|dad,lili|plate|·', en: 'Dad looks at a plate and a rope.', zh: '爸爸看着盘子和绳子。' },
      { art: 'library|dad,lili|plate|♪', en: 'They want to know how they are different.', zh: '他们想知道两样有什么不一样。' },
      { art: 'library|dad,lili|plate|👀', en: 'At first the two look the same. They made a list: hole, home and jam.', zh: '乍一看，两样挺像。他们列了个单子：洞、家和果酱。' },
      { art: 'library|dad,lili|plate|?', en: '"What is not the same?" asks Lili.', zh: '「哪里不一样？」丽丽问。' },
      { art: 'library|dad,lili|plate|·', en: 'They put them side by side.', zh: '他们把两样并排放。' },
      { art: 'library|dad,lili|plate|!', en: 'Looking from far away does not help.', zh: '远远地看，还是看不出。' },
      { art: 'library|dad,lili|rope|♥', en: 'Lili says, "Look at one part at a time."', zh: '丽丽说：「一处一处分开看。」' },
      { art: 'library|dad,lili|plate|★', en: 'There! One small part is different.', zh: '有了！有一处小小的不同。' },
      { art: 'library|dad,lili|plate|?', en: 'The difference was small, not missing.', zh: '差别很小，不是没有。' },
      { art: 'library|dad,lili|plate|♥', en: 'They tell Dad what they found. We say the words again: hole and home.', zh: '他们把自己发现的讲给爸爸听。我们把这两个词再说一遍：洞和家。' },
      { art: 'library|dad,lili|plate|·', en: 'Next they will compare the rope and the box. They made a list of all the small differences.', zh: '接着他们要比一比绳子和盒子。他们把所有细小的不同都列了下来。' }
    ],
    quiz: [
      { q: '这一本里，爸爸看到了下面哪一样？', opts: ['礼物', '果酱', '水壶'], a: 1, kind: 'recall' },
      { q: '盘子和绳子一开始为什么看着一样？', opts: ['因为光线太暗', '因为它们真的完全相同', '只远远看了一眼，没一处一处分开比'], a: 2, kind: 'infer' },
      { q: '要找出像盘子和绳子这样很像的两样东西哪里不同，你会怎么做？', opts: ['只挑一个看', '隔很远扫一眼', '并排放好，一处一处分开看'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b73', lv: 'L7', tag: '通信', title: 'The Letter from the Farm', zh: '农场来的信',
    emoji: '✉️', color: '#F6C6C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「一起做」这条线，认读 3 个新词。',
    trap: '美音里元音后的 r 一定要卷舌读出来：car、bird、water 都不能吞掉 r。',
    summary: '《农场来的信》是「一起做」：明明和奶奶在家，围绕信把一件事读到底。本本词卡：信、裙子、乌龟。读前先看词卡，读完合上书说一说。',
    retell: '倒着讲：先说结局，再说线索是怎么被漏掉的。（这一本是「一起做」。）',
    think: '说一件你做过的、步骤很多的事：哪一步最容易漏？下次怎么提醒自己？',
    pre: [
      { art: '✉️', en: 'letter', zh: '信' },
      { art: '👕', en: 'skirt', zh: '裙子' },
      { art: '🐢', en: 'turtle', zh: '乌龟' },
      { art: '📦', en: 'they', zh: 'they' },
      { art: '📦', en: 'the', zh: 'the' }
    ],
    sight: [],
    newWords: [
      { w: 'letter', zh: '信' },
      { w: 'skirt', zh: '裙子' },
      { w: 'turtle', zh: '乌龟' }
    ],
    pages: [
      { art: 'home|ming,grandma|letter|·', en: 'Ming has an idea at home.', zh: '明明在家有了个主意。' },
      { art: 'home|ming,grandma|letter|♪', en: '"Let us make a letter," says Ming.', zh: '「我们做信吧。」明明说。' },
      { art: 'home|ming,grandma|letter|👀', en: 'They get everything ready. They wrote down three words: letter, skirt and turtle.', zh: '他们把要用的东西备齐。他们记下三个词：信、裙子和乌龟。' },
      { art: 'home|ming,grandma|letter|?', en: '"What do we need first?" asks Grandma.', zh: '「先要什么？」奶奶问。' },
      { art: 'home|ming,grandma|letter|·', en: 'They make a list, and they start.', zh: '他们列了个单子，就动手了。' },
      { art: 'home|ming,grandma|letter|!', en: 'It does not look right. Something is wrong.', zh: '样子不对，哪里出了岔子。' },
      { art: 'home|ming,grandma|pin|♥', en: 'Grandma reads the list again, out loud.', zh: '奶奶把单子又大声念了一遍。' },
      { art: 'home|ming,grandma|letter|★', en: 'This time the letter is just right.', zh: '这次信正好。' },
      { art: 'home|ming,grandma|letter|?', en: 'The first time they did two steps at once.', zh: '第一遍两步并成一步做了。' },
      { art: 'home|ming,grandma|letter|…', en: 'Slow is not always slower.', zh: '慢，不一定就更慢。' },
      { art: 'home|ming,grandma|letter|♥', en: 'They are proud of the letter. We say the words again: letter and skirt.', zh: '他们为这个信挺得意。我们把这两个词再说一遍：信和裙子。' },
      { art: 'home|ming,grandma|letter|·', en: 'They write down what they would do next time. The list went up on the wall.', zh: '他们写下下次要怎么做。那张单子后来贴在了墙上。' }
    ],
    quiz: [
      { q: '明明和奶奶的这一本里，出现了下面哪一样？', opts: ['石头', '翅膀', '信'], a: 2, kind: 'recall' },
      { q: '明明第一次为什么没做成信？', opts: ['因为没人帮忙', '两步并成一步，漏了顺序', '因为材料不够'], a: 1, kind: 'infer' },
      { q: '做一件步骤很多的事（像做信那样），你会先做什么？', opts: ['先把步骤写下来，再一步一步做', '直接跳过开头的步骤', '想到哪步做哪步'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b74', lv: 'L7', tag: '冬天', title: 'A Scarf for Winter', zh: '冬天的围巾',
    emoji: '🧣', color: '#F9DFB4',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「分一分」这条线，认读 3 个新词。',
    trap: '美音里元音后的 r 一定要卷舌读出来：car、bird、water 都不能吞掉 r。',
    summary: '《冬天的围巾》是「分一分」：丽丽和爷爷在家，围绕围巾把一件事读到底。本本词卡：围巾、市场、猪肉。读前先看词卡，读完合上书说一说。',
    retell: '倒着讲：先说结局，再说线索是怎么被漏掉的。（这一本是「分一分」。）',
    think: '说说家里只剩一份、两个人都想要的时候，你们是怎么商量的。',
    pre: [
      { art: '🧣', en: 'scarf', zh: '围巾' },
      { art: '🥬', en: 'market', zh: '市场' },
      { art: '🍚', en: 'pork', zh: '猪肉' },
      { art: '📦', en: 'they', zh: 'they' },
      { art: '📦', en: 'it', zh: 'it' }
    ],
    sight: [],
    newWords: [
      { w: 'scarf', zh: '围巾' },
      { w: 'market', zh: '市场' },
      { w: 'pork', zh: '猪肉' }
    ],
    pages: [
      { art: 'home|lili,grandpa|scarf|·', en: 'There is only one scarf at home.', zh: '家只有一个围巾。' },
      { art: 'home|lili,grandpa|scarf|♪', en: 'Lili wants it. Grandpa wants it too.', zh: '丽丽想要，爷爷也想要。' },
      { art: 'home|lili,grandpa|scarf|👀', en: 'They look at the scarf for a long time. They wrote down three words: scarf, market and pork.', zh: '他们盯着围巾看了好久。他们记下三个词：围巾、市场和猪肉。' },
      { art: 'home|lili,grandpa|scarf|?', en: '"How can we both have it?" asks Grandpa.', zh: '「怎么才能两个人都有？」爷爷问。' },
      { art: 'home|lili,grandpa|scarf|·', en: 'Lili says, "You can have it first."', zh: '丽丽说：「你先来吧。」' },
      { art: 'home|lili,grandpa|scarf|!', en: 'That is not fair to one of them.', zh: '这样对其中一个不公平。' },
      { art: 'home|lili,grandpa|path|♥', en: 'Grandpa has a better idea.', zh: '爷爷想出个更好的办法。' },
      { art: 'home|lili,grandpa|scarf|★', en: 'Now each of them has a part.', zh: '现在两个人各有一份。' },
      { art: 'home|lili,grandpa|scarf|?', en: 'One thing can be enough for two people.', zh: '一样东西，也能让两个人都够。' },
      { art: 'home|lili,grandpa|scarf|…', en: 'The best idea came after they talked.', zh: '最好的办法是聊出来以后才有的。' },
      { art: 'home|lili,grandpa|scarf|♥', en: 'They sit together and they are happy. We say the words again: scarf and market.', zh: '他们坐在一起，都很开心。我们把这两个词再说一遍：围巾和市场。' },
      { art: 'home|lili,grandpa|scarf|·', en: 'Next time they will ask before they decide. They both remembered that day.', zh: '下次他们会先问一句，再做决定。那一天两个人都记着。' }
    ],
    quiz: [
      { q: '在家读的这一本里，有下面哪一样？', opts: ['翅膀', '沙滩', '市场'], a: 2, kind: 'recall' },
      { q: '两个人是怎么都拿到围巾的？', opts: ['商量以后把它分成两份', '又买了一个', '谁力气大谁拿走'], a: 0, kind: 'infer' },
      { q: '只剩一份围巾、两个人都想要时，你会怎么做？', opts: ['先抢到手再说', '先问一句能不能分，再一起想办法', '谁也不给'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b75', lv: 'L7', tag: '观察', title: 'Morning in the Garden', zh: '清晨的花园',
    emoji: '🌻', color: '#CDE7C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「问一问」这条线，认读 3 个新词。',
    trap: '美音里元音后的 r 一定要卷舌读出来：car、bird、water 都不能吞掉 r。',
    summary: '《清晨的花园》是「问一问」：奶奶和妈妈在花园，围绕花园把一件事读到底。本本词卡：工人、酸奶、哥哥。读前先看词卡，读完合上书说一说。',
    retell: '倒着讲：先说结局，再说线索是怎么被漏掉的。（这一本是「问一问」。）',
    think: '回想一次「问了还是没懂」：把当时的问题改成一个更小的、指着某个词的问题。',
    pre: [
      { art: '🧑', en: 'worker', zh: '工人' },
      { art: '🍚', en: 'yogurt', zh: '酸奶' },
      { art: '🧑', en: 'brother', zh: '哥哥' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👵', en: 'grandma', zh: '奶奶' }
    ],
    sight: [],
    newWords: [
      { w: 'worker', zh: '工人' },
      { w: 'yogurt', zh: '酸奶' },
      { w: 'brother', zh: '哥哥' }
    ],
    pages: [
      { art: 'garden|grandma,mom|garden|·', en: 'Grandma is reading the word "garden" in the garden.', zh: '奶奶在花园读「garden」这个词。' },
      { art: 'garden|grandma,mom|garden|♪', en: 'Grandma wants to understand it.', zh: '奶奶想把它弄明白。' },
      { art: 'garden|grandma,mom|garden|👀', en: 'One sentence does not make sense. They wrote down three words: worker, yogurt and brother.', zh: '有一句怎么也读不通。他们记下三个词：工人、酸奶和哥哥。' },
      { art: 'garden|grandma,mom|garden|?', en: '"What does this part mean?" asks Grandma.', zh: '「这一段什么意思？」奶奶问。' },
      { art: 'garden|grandma,mom|garden|·', en: 'Mom answers, but Grandma still looks lost.', zh: '妈妈答了，奶奶还是没懂。' },
      { art: 'garden|grandma,mom|garden|!', en: 'The answer was right, but not the right answer.', zh: '答案没错，却不是问的那个。' },
      { art: 'garden|grandma,mom|shed|♥', en: 'Mom asks, "Which word is the hard one?"', zh: '妈妈反问：「难的是哪个词？」' },
      { art: 'garden|grandma,mom|garden|★', en: 'Now the whole sentence is clear.', zh: '这下整句都清楚了。' },
      { art: 'garden|grandma,mom|garden|?', en: 'The real question had been a smaller one.', zh: '真正该问的，是个更小的问题。' },
      { art: 'garden|grandma,mom|garden|…', en: 'Asking again is not the same as not listening.', zh: '再问一遍，不等于没在听。' },
      { art: 'garden|grandma,mom|garden|♥', en: 'Grandma says the sentence out loud. We say the words again: worker and yogurt.', zh: '奶奶把这句大声念了出来。我们把这两个词再说一遍：工人和酸奶。' },
      { art: 'garden|grandma,mom|garden|·', en: 'They write down one new question. The smaller question stayed with them.', zh: '他们又写下一个新问题。那个更小的问题，他们一直记着。' }
    ],
    quiz: [
      { q: '这一本里，奶奶看到了下面哪一样？', opts: ['床', '风', '酸奶'], a: 2, kind: 'recall' },
      { q: '奶奶第一次为什么没听懂「garden」？', opts: ['因为读得太快', '因为答案太短', '问题太大，没指向真正卡住的那个词'], a: 2, kind: 'infer' },
      { q: '别人把「garden」解释完你还是没懂，你会怎么做？', opts: ['把整段跳过去', '指出具体哪个词不懂，再问一遍', '点点头装作懂了'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b76', lv: 'L7', tag: '故事', title: 'The Turtle and the Shark', zh: '乌龟和鲨鱼',
    emoji: '🐢', color: '#C6DEF6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「比一比」这条线，认读 3 个新词。',
    trap: '美音里元音后的 r 一定要卷舌读出来：car、bird、water 都不能吞掉 r。',
    summary: '《乌龟和鲨鱼》是「比一比」：爷爷和爸爸在公园，围绕乌龟把一件事读到底。本本词卡：医生、家人、农民。读前先看词卡，读完合上书说一说。',
    retell: '倒着讲：先说结局，再说线索是怎么被漏掉的。（这一本是「比一比」。）',
    think: '找两样很像的东西，用英文说出至少两处不同，说说你是按什么顺序找的。',
    pre: [
      { art: '🧑', en: 'doctor', zh: '医生' },
      { art: '🧑', en: 'family', zh: '家人' },
      { art: '🧑', en: 'farmer', zh: '农民' },
      { art: '📦', en: 'they', zh: 'they' },
      { art: '📦', en: 'the', zh: 'the' }
    ],
    sight: ['photo', 'whale'],
    newWords: [
      { w: 'doctor', zh: '医生' },
      { w: 'family', zh: '家人' },
      { w: 'farmer', zh: '农民' }
    ],
    pages: [
      { art: 'park|grandpa,dad|turtle|·', en: 'Grandpa looks at a turtle and a photo.', zh: '爷爷看着乌龟和照片。' },
      { art: 'park|grandpa,dad|turtle|♪', en: 'They want to know how they are different.', zh: '他们想知道两样有什么不一样。' },
      { art: 'park|grandpa,dad|turtle|👀', en: 'At first the two look the same. They wrote down three words: doctor, family and farmer.', zh: '乍一看，两样挺像。他们记下三个词：医生、家人和农民。' },
      { art: 'park|grandpa,dad|turtle|?', en: '"What is not the same?" asks Dad.', zh: '「哪里不一样？」爸爸问。' },
      { art: 'park|grandpa,dad|turtle|·', en: 'They put them side by side.', zh: '他们把两样并排放。' },
      { art: 'park|grandpa,dad|turtle|!', en: 'Looking from far away does not help.', zh: '远远地看，还是看不出。' },
      { art: 'park|grandpa,dad|photo|♥', en: 'Dad says, "Look at one part at a time."', zh: '爸爸说：「一处一处分开看。」' },
      { art: 'park|grandpa,dad|turtle|★', en: 'There! One small part is different.', zh: '有了！有一处小小的不同。' },
      { art: 'park|grandpa,dad|turtle|?', en: 'The difference was small, not missing.', zh: '差别很小，不是没有。' },
      { art: 'park|grandpa,dad|turtle|…', en: 'Comparing needs a plan, not just a look.', zh: '比一比要有章法，不能光瞄一眼。' },
      { art: 'park|grandpa,dad|turtle|♥', en: 'They tell Grandpa what they found. We say the words again: doctor and family.', zh: '他们把自己发现的讲给爷爷听。我们把这两个词再说一遍：医生和家人。' },
      { art: 'park|grandpa,dad|turtle|·', en: 'Next they will compare the photo and the whale. They made a list of all the small differences.', zh: '接着他们要比一比照片和鲸。他们把所有细小的不同都列了下来。' }
    ],
    quiz: [
      { q: '爷爷和爸爸的这一本里，出现了下面哪一样？', opts: ['床', '小虫', '家人'], a: 2, kind: 'recall' },
      { q: '乌龟和照片一开始为什么看着一样？', opts: ['因为光线太暗', '因为它们真的完全相同', '只远远看了一眼，没一处一处分开比'], a: 2, kind: 'infer' },
      { q: '要找出像乌龟和照片这样很像的两样东西哪里不同，你会怎么做？', opts: ['并排放好，一处一处分开看', '只挑一个看', '隔很远扫一眼'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b77', lv: 'L7', tag: '上学', title: 'A Picture for the Teacher', zh: '给老师的画',
    emoji: '🖼️', color: '#E0CFF3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「修好它」这条线，认读 3 个新词。',
    trap: '美音里元音后的 r 一定要卷舌读出来：car、bird、water 都不能吞掉 r。',
    summary: '《给老师的画》是「修好它」：妈妈和明明在教室，围绕图画把一件事读到底。本本词卡：衬衫、姐姐、小汽车。读前先看词卡，读完合上书说一说。',
    retell: '倒着讲：先说结局，再说线索是怎么被漏掉的。（这一本是「修好它」。）',
    think: '说一样坏过的东西：你一开始反复试了什么？后来发现真正的问题在哪儿？',
    pre: [
      { art: '👕', en: 'shirt', zh: '衬衫' },
      { art: '🧑', en: 'sister', zh: '姐姐' },
      { art: '📦', en: 'car', zh: '小汽车' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'they', zh: 'they' }
    ],
    sight: [],
    newWords: [
      { w: 'shirt', zh: '衬衫' },
      { w: 'sister', zh: '姐姐' },
      { w: 'car', zh: '小汽车' }
    ],
    pages: [
      { art: 'classroom|mom,ming|picture|·', en: 'The picture does not work in the classroom.', zh: '教室的图画不好使了。' },
      { art: 'classroom|mom,ming|picture|♪', en: 'Mom wants to fix it.', zh: '妈妈想把它修好。' },
      { art: 'classroom|mom,ming|picture|👀', en: 'They look at it from every side. They wrote down three words: shirt, sister and car.', zh: '他们从各个面都看了一遍。他们记下三个词：衬衫、姐姐和小汽车。' },
      { art: 'classroom|mom,ming|picture|?', en: '"What did we change?" asks Ming.', zh: '「我们改过什么？」明明问。' },
      { art: 'classroom|mom,ming|picture|·', en: 'Mom tries the same thing again.', zh: '妈妈照原样又试了一次。' },
      { art: 'classroom|mom,ming|picture|!', en: 'It still does not work.', zh: '还是不行。' },
      { art: 'classroom|mom,ming|brush|♥', en: 'Ming points to one small part.', zh: '明明指着一个小小的部位。' },
      { art: 'classroom|mom,ming|picture|★', en: 'Now the picture works again.', zh: '图画又能用了。' },
      { art: 'classroom|mom,ming|picture|?', en: 'The trouble was small, but it was hard to see.', zh: '毛病很小，可是不容易看见。' },
      { art: 'classroom|mom,ming|picture|…', en: 'They almost missed the easy answer.', zh: '他们差点错过了最简单的答案。' },
      { art: 'classroom|mom,ming|picture|♥', en: 'Mom laughs. Ming laughs too. We say the words again: shirt and sister.', zh: '妈妈笑了，明明也笑了。我们把这两个词再说一遍：衬衫和姐姐。' },
      { art: 'classroom|mom,ming|picture|·', en: 'They remember to look before they try again. They kept the small part in a box.', zh: '他们记住了：再试之前，先看一看。他们把那个小零件收进了盒子。' }
    ],
    quiz: [
      { q: '在教室读的这一本里，有下面哪一样？', opts: ['小船', '链子', '教室'], a: 2, kind: 'recall' },
      { q: '为什么试了很多次都没修好图画？', opts: ['一直重复同一个动作，没找对小毛病', '因为工具不够', '因为没人愿意帮忙'], a: 0, kind: 'infer' },
      { q: '一件事反复做还是不行（像修图画那样），你会怎么做？', opts: ['先停下来看看是不是漏了一处小的', '把同样的动作再做十遍', '干脆换个人做'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b78', lv: 'L7', tag: '买菜', title: 'The Market at the Corner', zh: '街角的市场',
    emoji: '🥬', color: '#F6C9E3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「跟读整句」这条线，认读 3 个新词。',
    trap: '美音里元音后的 r 一定要卷舌读出来：car、bird、water 都不能吞掉 r。',
    summary: '《街角的市场》是「跟读整句」：爸爸和丽丽在街道，围绕市场把一件事读到底。本本词卡：手推车、玉米、角落。读前先看词卡，读完合上书说一说。',
    retell: '倒着讲：先说结局，再说线索是怎么被漏掉的。（这一本是「跟读整句」。）',
    think: '挑书里最长的一句英文，先听整句，再分成两段读给家长听。',
    pre: [
      { art: '📦', en: 'cart', zh: '手推车' },
      { art: '🌽', en: 'corn', zh: '玉米' },
      { art: '📍', en: 'corner', zh: '角落' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👨', en: 'dad', zh: '爸爸' }
    ],
    sight: [],
    newWords: [
      { w: 'cart', zh: '手推车' },
      { w: 'corn', zh: '玉米' },
      { w: 'corner', zh: '角落' }
    ],
    pages: [
      { art: 'street|dad,lili|market|·', en: 'Dad opens a book on the street.', zh: '爸爸在街道翻开一本书。' },
      { art: 'street|dad,lili|market|♪', en: 'Dad wants to read it out loud.', zh: '爸爸想把它读出来。' },
      { art: 'street|dad,lili|market|👀', en: 'The sentence with the word "market" is long. They wrote down three words: cart, corn and corner.', zh: '带着「market」这个词的那一句很长。他们记下三个词：手推车、玉米和角落。' },
      { art: 'street|dad,lili|market|?', en: '"Where do I stop for breath?" asks Dad.', zh: '「在哪里换气？」爸爸问。' },
      { art: 'street|dad,lili|market|·', en: 'Dad reads it one word at a time.', zh: '爸爸一个词一个词地读。' },
      { art: 'street|dad,lili|market|!', en: 'It sounds broken, not like a sentence.', zh: '听着是碎的，不像一句话。' },
      { art: 'street|dad,lili|cap|♥', en: 'Lili plays the whole sentence.', zh: '丽丽把整句放了一遍。' },
      { art: 'street|dad,lili|market|★', en: 'Now it sounds like one sentence.', zh: '这下听起来像一整句了。' },
      { art: 'street|dad,lili|market|?', en: 'The words belong to groups, not to themselves.', zh: '词是成组的，不是一个一个孤立的。' },
      { art: 'street|dad,lili|market|…', en: 'Reading is closer to speaking than to spelling.', zh: '读，更接近说，而不是拼。' },
      { art: 'street|dad,lili|market|♥', en: 'Dad reads it once more, smiling. We say the words again: cart and corn.', zh: '爸爸笑着又读了一遍。我们把这两个词再说一遍：手推车和玉米。' },
      { art: 'street|dad,lili|market|·', en: 'They try the next sentence about a cap. Reading out loud became easier after that.', zh: '他们接着试讲鸭舌帽的下一句。从那以后，读出声就不那么难了。' }
    ],
    quiz: [
      { q: '这一本里，爸爸看到了下面哪一样？', opts: ['小汽车', '鸭舌帽', '杯子'], a: 1, kind: 'recall' },
      { q: '爸爸读「market」那一句时，为什么一个词一个词读听起来是碎的？', opts: ['句子里的词是成组的，不能逐个蹦', '因为词太难', '因为读得太慢'], a: 0, kind: 'infer' },
      { q: '遇到像「market」那一句这样很长的英文句子，你会怎么读？', opts: ['只看中文跳过英文', '一个词一个词慢慢拼', '先听整句，再按意思分成两三段读'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b79', lv: 'L7', tag: '种植', title: 'Corn in the Garden', zh: '花园里的玉米',
    emoji: '🌽', color: '#BFE6DF',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「比一比」这条线，认读 3 个新词。',
    trap: '美音里元音后的 r 一定要卷舌读出来：car、bird、water 都不能吞掉 r。',
    summary: '《花园里的玉米》是「比一比」：明明和奶奶在农场，围绕玉米把一件事读到底。本本词卡：钱包、鲨鱼、花。读前先看词卡，读完合上书说一说。',
    retell: '倒着讲：先说结局，再说线索是怎么被漏掉的。（这一本是「比一比」。）',
    think: '找两样很像的东西，用英文说出至少两处不同，说说你是按什么顺序找的。',
    pre: [
      { art: '📦', en: 'purse', zh: '钱包' },
      { art: '🦈', en: 'shark', zh: '鲨鱼' },
      { art: '🌻', en: 'flower', zh: '花' },
      { art: '📦', en: 'they', zh: 'they' },
      { art: '📦', en: 'the', zh: 'the' }
    ],
    sight: [],
    newWords: [
      { w: 'purse', zh: '钱包' },
      { w: 'shark', zh: '鲨鱼' },
      { w: 'flower', zh: '花' }
    ],
    pages: [
      { art: 'farm|ming,grandma|corn|·', en: 'Ming looks at some corn and a yogurt.', zh: '明明看着玉米和酸奶。' },
      { art: 'farm|ming,grandma|corn|♪', en: 'They want to know how they are different.', zh: '他们想知道两样有什么不一样。' },
      { art: 'farm|ming,grandma|corn|👀', en: 'At first the two look the same. They wrote down three words: purse, shark and flower.', zh: '乍一看，两样挺像。他们记下三个词：钱包、鲨鱼和花。' },
      { art: 'farm|ming,grandma|corn|?', en: '"What is not the same?" asks Grandma.', zh: '「哪里不一样？」奶奶问。' },
      { art: 'farm|ming,grandma|corn|·', en: 'They put them side by side.', zh: '他们把两样并排放。' },
      { art: 'farm|ming,grandma|corn|!', en: 'Looking from far away does not help.', zh: '远远地看，还是看不出。' },
      { art: 'farm|ming,grandma|yogurt|♥', en: 'Grandma says, "Look at one part at a time."', zh: '奶奶说：「一处一处分开看。」' },
      { art: 'farm|ming,grandma|corn|★', en: 'There! One small part is different.', zh: '有了！有一处小小的不同。' },
      { art: 'farm|ming,grandma|corn|?', en: 'The difference was small, not missing.', zh: '差别很小，不是没有。' },
      { art: 'farm|ming,grandma|corn|…', en: 'Comparing needs a plan, not just a look.', zh: '比一比要有章法，不能光瞄一眼。' },
      { art: 'farm|ming,grandma|corn|♥', en: 'They tell Ming what they found. We say the words again: purse and shark.', zh: '他们把自己发现的讲给明明听。我们把这两个词再说一遍：钱包和鲨鱼。' },
      { art: 'farm|ming,grandma|corn|·', en: 'Next they will compare the yogurt and the jam. They made a list of all the small differences.', zh: '接着他们要比一比酸奶和果酱。他们把所有细小的不同都列了下来。' }
    ],
    quiz: [
      { q: '明明和奶奶的这一本里，出现了下面哪一样？', opts: ['医生', '玉米', '小鸡'], a: 1, kind: 'recall' },
      { q: '玉米和酸奶一开始为什么看着一样？', opts: ['因为光线太暗', '只远远看了一眼，没一处一处分开比', '因为它们真的完全相同'], a: 1, kind: 'infer' },
      { q: '要找出像玉米和酸奶这样很像的两样东西哪里不同，你会怎么做？', opts: ['只挑一个看', '并排放好，一处一处分开看', '隔很远扫一眼'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b80', lv: 'L7', tag: '寻找', title: 'Search the Park', zh: '找遍公园',
    emoji: '🔍', color: '#F2E2A8',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「合上书讲一遍」这条线，认读 1 个新词。',
    trap: '美音里元音后的 r 一定要卷舌读出来：car、bird、water 都不能吞掉 r。',
    summary: '《找遍公园》是「合上书讲一遍」：丽丽和爷爷在公园，围绕公园把一件事读到底。本本词卡：马。读前先看词卡，读完合上书说一说。',
    retell: '倒着讲：先说结局，再说线索是怎么被漏掉的。（这一本是「合上书讲一遍」。）',
    think: '合上书，用「谁 → 在哪儿 → 出了什么事 → 结果」把公园这一本讲给家长听。',
    pre: [
      { art: '🐴', en: 'horse', zh: '马' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👧', en: 'lili', zh: '丽丽' }
    ],
    sight: [],
    newWords: [
      { w: 'horse', zh: '马' }
    ],
    pages: [
      { art: 'park|lili,grandpa|park|·', en: 'Lili has just finished a book in the park.', zh: '丽丽刚在公园读完一本书。' },
      { art: 'park|lili,grandpa|park|♪', en: 'Grandpa wants to hear all about it.', zh: '爷爷想听他讲讲。' },
      { art: 'park|lili,grandpa|park|👀', en: 'Lili thinks about the park in the book. They wrote down three words: horse, hen and hill.', zh: '丽丽想着书里的公园。他们记下三个词：马、母鸡和小山。' },
      { art: 'park|lili,grandpa|park|?', en: '"Where do I start?" asks Lili.', zh: '「从哪儿讲起？」丽丽问。' },
      { art: 'park|lili,grandpa|park|·', en: 'Lili tells the last part first.', zh: '丽丽先讲了结尾。' },
      { art: 'park|lili,grandpa|park|!', en: 'Grandpa cannot follow the story.', zh: '爷爷听不明白。' },
      { art: 'park|lili,grandpa|pot|♥', en: 'Grandpa says, "Tell me who, where, then what."', zh: '爷爷说：「先说谁、在哪儿、再说出什么事。」' },
      { art: 'park|lili,grandpa|park|★', en: 'This time Grandpa can see the whole thing.', zh: '这回爷爷全听明白了。' },
      { art: 'park|lili,grandpa|park|?', en: 'A story needs its order to make sense.', zh: '故事要靠顺序才讲得通。' },
      { art: 'park|lili,grandpa|park|…', en: 'If you can tell it, you have read it.', zh: '讲得出来，才算真的读过。' },
      { art: 'park|lili,grandpa|park|♥', en: 'Lili closes the book and tells it again. We say the words again: horse and hen.', zh: '丽丽合上书，又讲了一遍。我们把这两个词再说一遍：马和母鸡。' },
      { art: 'park|lili,grandpa|park|·', en: 'Tomorrow they will read about a pot. They could still tell it the next morning.', zh: '明天他们要读讲锅的书。第二天早上，他们还能讲得出来。' }
    ],
    quiz: [
      { q: '在公园读的这一本里，有下面哪一样？', opts: ['玉米', '锅', '脸'], a: 1, kind: 'recall' },
      { q: '为什么爷爷第一遍没听明白？', opts: ['先讲了结尾，顺序乱了', '因为故事太短', '因为讲得太慢'], a: 0, kind: 'infer' },
      { q: '要把讲公园的这本读过的书讲给别人听，你会怎么开头？', opts: ['先说谁、在哪儿，再按顺序说出了什么事', '直接从最精彩的那句开始', '先报书名和生词表'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b81', lv: 'L7', tag: '发音', title: 'Say It: Car, Bird', zh: '说一说：car bird',
    emoji: '🗣️', color: '#D9D2F5',
    track: 'drill',
    goal: '把本级难点音听准、说准，并能在整句里读对。这一本走「问一问」这条线，不引入新词，全部是读过的词。',
    trap: '美音里元音后的 r 一定要卷舌读出来：car、bird、water 都不能吞掉 r。',
    summary: '《说一说：car bird》是「问一问」：奶奶和妈妈在家，围绕小汽车把一件事读到底。本本词卡：这一本不引入新词，全部是读过的词。读前先看词卡，读完合上书说一说。',
    retell: '倒着讲：先说结局，再说线索是怎么被漏掉的。（这一本是「问一问」。）',
    think: '回想一次「问了还是没懂」：把当时的问题改成一个更小的、指着某个词的问题。',
    pre: [
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👵', en: 'grandma', zh: '奶奶' }
    ],
    sight: [],
    newWords: [

    ],
    pages: [
      { art: 'home|grandma,mom|car|·', en: 'Grandma is reading the word "car" at home.', zh: '奶奶在家读「car」这个词。' },
      { art: 'home|grandma,mom|car|♪', en: 'Grandma wants to understand it.', zh: '奶奶想把它弄明白。' },
      { art: 'home|grandma,mom|car|👀', en: 'One sentence does not make sense. They wrote down three words: hill, hole and home.', zh: '有一句怎么也读不通。他们记下三个词：小山、洞和家。' },
      { art: 'home|grandma,mom|car|?', en: '"What does this part mean?" asks Grandma.', zh: '「这一段什么意思？」奶奶问。' },
      { art: 'home|grandma,mom|car|·', en: 'Mom answers, but Grandma still looks lost.', zh: '妈妈答了，奶奶还是没懂。' },
      { art: 'home|grandma,mom|car|!', en: 'The answer was right, but not the right answer.', zh: '答案没错，却不是问的那个。' },
      { art: 'home|grandma,mom|bench|♥', en: 'Mom asks, "Which word is the hard one?"', zh: '妈妈反问：「难的是哪个词？」' },
      { art: 'home|grandma,mom|car|★', en: 'Now the whole sentence is clear.', zh: '这下整句都清楚了。' },
      { art: 'home|grandma,mom|car|?', en: 'The real question had been a smaller one.', zh: '真正该问的，是个更小的问题。' },
      { art: 'home|grandma,mom|car|…', en: 'Asking again is not the same as not listening.', zh: '再问一遍，不等于没在听。' },
      { art: 'home|grandma,mom|car|♥', en: 'Grandma says the sentence out loud. We say the words again: hill and hole.', zh: '奶奶把这句大声念了出来。我们把这两个词再说一遍：小山和洞。' },
      { art: 'home|grandma,mom|car|·', en: 'They write down one new question. The smaller question stayed with them.', zh: '他们又写下一个新问题。那个更小的问题，他们一直记着。' }
    ],
    quiz: [
      { q: '这一本里，奶奶看到了下面哪一样？', opts: ['洞', '玉米', '脸'], a: 0, kind: 'recall' },
      { q: '奶奶第一次为什么没听懂「car」？', opts: ['因为答案太短', '因为读得太快', '问题太大，没指向真正卡住的那个词'], a: 2, kind: 'infer' },
      { q: '别人把「car」解释完你还是没懂，你会怎么做？', opts: ['指出具体哪个词不懂，再问一遍', '把整段跳过去', '点点头装作懂了'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b82', lv: 'L7', tag: '小知识', title: 'Why Winter Is Cold', zh: '冬天为什么冷',
    emoji: '☃️', color: '#FAD3B6',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。这一本走「问一问」这条线，认读 1 个新词。',
    trap: '美音里元音后的 r 一定要卷舌读出来：car、bird、water 都不能吞掉 r。',
    summary: '《冬天为什么冷》是「问一问」：爷爷和爸爸在家，围绕信把一件事读到底。本本词卡：冬天。读前先看词卡，读完合上书说一说。',
    retell: '倒着讲：先说结局，再说线索是怎么被漏掉的。（这一本是「问一问」。）',
    think: '回想一次「问了还是没懂」：把当时的问题改成一个更小的、指着某个词的问题。',
    pre: [
      { art: '⏰', en: 'winter', zh: '冬天' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👴', en: 'grandpa', zh: '爷爷' }
    ],
    sight: [],
    newWords: [
      { w: 'winter', zh: '冬天' }
    ],
    pages: [
      { art: 'home|grandpa,dad|letter|·', en: 'Grandpa is reading the word "letter" at home.', zh: '爷爷在家读「letter」这个词。' },
      { art: 'home|grandpa,dad|letter|♪', en: 'Grandpa wants to understand it.', zh: '爷爷想把它弄明白。' },
      { art: 'home|grandpa,dad|letter|👀', en: 'One sentence does not make sense. They wrote down three words: winter, home and horse.', zh: '有一句怎么也读不通。他们记下三个词：冬天、家和马。' },
      { art: 'home|grandpa,dad|letter|?', en: '"What does this part mean?" asks Grandpa.', zh: '「这一段什么意思？」爷爷问。' },
      { art: 'home|grandpa,dad|letter|·', en: 'Dad answers, but Grandpa still looks lost.', zh: '爸爸答了，爷爷还是没懂。' },
      { art: 'home|grandpa,dad|letter|!', en: 'The answer was right, but not the right answer.', zh: '答案没错，却不是问的那个。' },
      { art: 'home|grandpa,dad|cap|♥', en: 'Dad asks, "Which word is the hard one?"', zh: '爸爸反问：「难的是哪个词？」' },
      { art: 'home|grandpa,dad|letter|★', en: 'Now the whole sentence is clear.', zh: '这下整句都清楚了。' },
      { art: 'home|grandpa,dad|letter|?', en: 'The real question had been a smaller one.', zh: '真正该问的，是个更小的问题。' },
      { art: 'home|grandpa,dad|letter|…', en: 'Asking again is not the same as not listening.', zh: '再问一遍，不等于没在听。' },
      { art: 'home|grandpa,dad|letter|♥', en: 'Grandpa says the sentence out loud. We say the words again: winter and home.', zh: '爷爷把这句大声念了出来。我们把这两个词再说一遍：冬天和家。' },
      { art: 'home|grandpa,dad|letter|·', en: 'They write down one new question. The smaller question stayed with them.', zh: '他们又写下一个新问题。那个更小的问题，他们一直记着。' }
    ],
    quiz: [
      { q: '爷爷和爸爸的这一本里，出现了下面哪一样？', opts: ['马', '乌鸦', '农民'], a: 0, kind: 'recall' },
      { q: '爷爷第一次为什么没听懂「letter」？', opts: ['问题太大，没指向真正卡住的那个词', '因为答案太短', '因为读得太快'], a: 0, kind: 'infer' },
      { q: '别人把「letter」解释完你还是没懂，你会怎么做？', opts: ['指出具体哪个词不懂，再问一遍', '把整段跳过去', '点点头装作懂了'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b83', lv: 'L7', tag: '小知识', title: 'How a Farmer Works', zh: '农民怎么干活',
    emoji: '👨‍🌾', color: '#C8E7F0',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。这一本走「合上书讲一遍」这条线，认读 1 个新词。',
    trap: '美音里元音后的 r 一定要卷舌读出来：car、bird、water 都不能吞掉 r。',
    summary: '《农民怎么干活》是「合上书讲一遍」：妈妈和明明在家，围绕农民把一件事读到底。本本词卡：玩具。读前先看词卡，读完合上书说一说。',
    retell: '倒着讲：先说结局，再说线索是怎么被漏掉的。（这一本是「合上书讲一遍」。）',
    think: '合上书，用「谁 → 在哪儿 → 出了什么事 → 结果」把农民这一本讲给家长听。',
    pre: [
      { art: '🧸', en: 'toy', zh: '玩具' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👩', en: 'mom', zh: '妈妈' }
    ],
    sight: [],
    newWords: [
      { w: 'toy', zh: '玩具' }
    ],
    pages: [
      { art: 'home|mom,ming|farmer|·', en: 'Mom has just finished a book at home.', zh: '妈妈刚在家读完一本书。' },
      { art: 'home|mom,ming|farmer|♪', en: 'Ming wants to hear all about it.', zh: '明明想听他讲讲。' },
      { art: 'home|mom,ming|farmer|👀', en: 'Mom thinks about the farmer in the book. They wrote down three words: home, horse and jam.', zh: '妈妈想着书里的农民。他们记下三个词：家、马和果酱。' },
      { art: 'home|mom,ming|farmer|?', en: '"Where do I start?" asks Mom.', zh: '「从哪儿讲起？」妈妈问。' },
      { art: 'home|mom,ming|farmer|·', en: 'Mom tells the last part first.', zh: '妈妈先讲了结尾。' },
      { art: 'home|mom,ming|farmer|!', en: 'Ming cannot follow the story.', zh: '明明听不明白。' },
      { art: 'home|mom,ming|toy|♥', en: 'Ming says, "Tell me who, where, then what."', zh: '明明说：「先说谁、在哪儿、再说出什么事。」' },
      { art: 'home|mom,ming|farmer|★', en: 'This time Ming can see the whole thing.', zh: '这回明明全听明白了。' },
      { art: 'home|mom,ming|farmer|?', en: 'A story needs its order to make sense.', zh: '故事要靠顺序才讲得通。' },
      { art: 'home|mom,ming|farmer|…', en: 'If you can tell it, you have read it.', zh: '讲得出来，才算真的读过。' },
      { art: 'home|mom,ming|farmer|♥', en: 'Mom closes the book and tells it again. We say the words again: home and horse.', zh: '妈妈合上书，又讲了一遍。我们把这两个词再说一遍：家和马。' },
      { art: 'home|mom,ming|farmer|·', en: 'Tomorrow they will read about a toy. They could still tell it the next morning.', zh: '明天他们要读讲玩具的书。第二天早上，他们还能讲得出来。' }
    ],
    quiz: [
      { q: '在家读的这一本里，有下面哪一样？', opts: ['旗子', '果酱', '奶奶'], a: 1, kind: 'recall' },
      { q: '为什么明明第一遍没听明白？', opts: ['因为故事太短', '先讲了结尾，顺序乱了', '因为讲得太慢'], a: 1, kind: 'infer' },
      { q: '要把讲农民的这本读过的书讲给别人听，你会怎么开头？', opts: ['先说谁、在哪儿，再按顺序说出了什么事', '直接从最精彩的那句开始', '先报书名和生词表'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b84', lv: 'L7', tag: '复习', title: 'Back to the First Place', zh: '回到最开始',
    emoji: '🏠', color: '#E8D9B5',
    track: 'review',
    goal: '把本级和前面级别的词再读一遍、串成一个故事。这一本走「比一比」这条线，不引入新词，全部是读过的词。',
    trap: '美音里元音后的 r 一定要卷舌读出来：car、bird、water 都不能吞掉 r。',
    summary: '《回到最开始》是「比一比」：爸爸和丽丽在图书馆，围绕角落把一件事读到底。本本词卡：这一本不引入新词，全部是读过的词。读前先看词卡，读完合上书说一说。',
    retell: '倒着讲：先说结局，再说线索是怎么被漏掉的。（这一本是「比一比」。）',
    think: '找两样很像的东西，用英文说出至少两处不同，说说你是按什么顺序找的。',
    pre: [
      { art: '📦', en: 'they', zh: 'they' },
      { art: '📦', en: 'the', zh: 'the' }
    ],
    sight: [],
    newWords: [

    ],
    pages: [
      { art: 'library|dad,lili|corner|·', en: 'Dad looks at a corner and a ball.', zh: '爸爸看着角落和球。' },
      { art: 'library|dad,lili|corner|♪', en: 'They want to know how they are different.', zh: '他们想知道两样有什么不一样。' },
      { art: 'library|dad,lili|corner|👀', en: 'At first the two look the same. They wrote down three words: horse, jam and jug.', zh: '乍一看，两样挺像。他们记下三个词：马、果酱和水壶。' },
      { art: 'library|dad,lili|corner|?', en: '"What is not the same?" asks Lili.', zh: '「哪里不一样？」丽丽问。' },
      { art: 'library|dad,lili|corner|·', en: 'They put them side by side.', zh: '他们把两样并排放。' },
      { art: 'library|dad,lili|corner|!', en: 'Looking from far away does not help.', zh: '远远地看，还是看不出。' },
      { art: 'library|dad,lili|ball|♥', en: 'Lili says, "Look at one part at a time."', zh: '丽丽说：「一处一处分开看。」' },
      { art: 'library|dad,lili|corner|★', en: 'There! One small part is different.', zh: '有了！有一处小小的不同。' },
      { art: 'library|dad,lili|corner|?', en: 'The difference was small, not missing.', zh: '差别很小，不是没有。' },
      { art: 'library|dad,lili|corner|…', en: 'Comparing needs a plan, not just a look.', zh: '比一比要有章法，不能光瞄一眼。' },
      { art: 'library|dad,lili|corner|♥', en: 'They tell Dad what they found. We say the words again: horse and jam.', zh: '他们把自己发现的讲给爸爸听。我们把这两个词再说一遍：马和果酱。' },
      { art: 'library|dad,lili|corner|·', en: 'Next they will compare the ball and the plate. They made a list of all the small differences.', zh: '接着他们要比一比球和盘子。他们把所有细小的不同都列了下来。' }
    ],
    quiz: [
      { q: '这一本里，爸爸看到了下面哪一样？', opts: ['奶奶', '风筝', '盘子'], a: 2, kind: 'recall' },
      { q: '角落和球一开始为什么看着一样？', opts: ['因为它们真的完全相同', '因为光线太暗', '只远远看了一眼，没一处一处分开比'], a: 2, kind: 'infer' },
      { q: '要找出像角落和球这样很像的两样东西哪里不同，你会怎么做？', opts: ['并排放好，一处一处分开看', '只挑一个看', '隔很远扫一眼'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b85', lv: 'L8', tag: '过年', title: 'Dumplings with Grandma', zh: '和奶奶包饺子',
    emoji: '🥟', color: '#F6C6C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「一起做」这条线，认读 3 个新词。',
    trap: 'ou / ow 读 /aʊ/，oi / oy 读 /ɔɪ/；长句按意思分组读，别逐词蹦。',
    summary: '《和奶奶包饺子》是「一起做」：明明和奶奶在家，围绕饺子把一件事读到底。本本词卡：饺子、海岸、硬币。读前先看词卡，读完合上书说一说。',
    retell: '按做事情的顺序讲一遍，至少用上三个新词。（这一本是「一起做」。）',
    think: '说一件你做过的、步骤很多的事：哪一步最容易漏？下次怎么提醒自己？',
    pre: [
      { art: '🥟', en: 'dumpling', zh: '饺子' },
      { art: '🌿', en: 'coast', zh: '海岸' },
      { art: '🪙', en: 'coin', zh: '硬币' },
      { art: '📦', en: 'they', zh: 'they' },
      { art: '📦', en: 'the', zh: 'the' }
    ],
    sight: [],
    newWords: [
      { w: 'dumpling', zh: '饺子' },
      { w: 'coast', zh: '海岸' },
      { w: 'coin', zh: '硬币' }
    ],
    pages: [
      { art: 'home|ming,grandma|dumpling|·', en: 'Ming has an idea at home.', zh: '明明在家有了个主意。' },
      { art: 'home|ming,grandma|dumpling|♪', en: '"Let us make a dumpling," says Ming.', zh: '「我们做饺子吧。」明明说。' },
      { art: 'home|ming,grandma|dumpling|👀', en: 'They get everything ready. Before they went on, they wrote down dumpling, coast and coin.', zh: '他们把要用的东西备齐。继续之前，他们先记下饺子、海岸和硬币。' },
      { art: 'home|ming,grandma|dumpling|?', en: '"What do we need first?" asks Grandma.', zh: '「先要什么？」奶奶问。' },
      { art: 'home|ming,grandma|dumpling|·', en: 'They make a list, and they start.', zh: '他们列了个单子，就动手了。' },
      { art: 'home|ming,grandma|dumpling|!', en: 'It does not look right. Something is wrong.', zh: '样子不对，哪里出了岔子。' },
      { art: 'home|ming,grandma|egg|♥', en: 'Grandma reads the list again, out loud.', zh: '奶奶把单子又大声念了一遍。' },
      { art: 'home|ming,grandma|egg|·', en: 'They start again, one step at a time.', zh: '他们重来，一步一步做。' },
      { art: 'home|ming,grandma|dumpling|★', en: 'This time the dumpling is just right.', zh: '这次饺子正好。' },
      { art: 'home|ming,grandma|dumpling|?', en: 'The first time they did two steps at once.', zh: '第一遍两步并成一步做了。' },
      { art: 'home|ming,grandma|dumpling|…', en: 'Slow is not always slower.', zh: '慢，不一定就更慢。' },
      { art: 'home|ming,grandma|dumpling|♥', en: 'They are proud of the dumpling. We say the words again: dumpling and coast.', zh: '他们为这个饺子挺得意。我们把这两个词再说一遍：饺子和海岸。' },
      { art: 'home|ming,grandma|dumpling|·', en: 'They write down what they would do next time. The list went up on the wall.', zh: '他们写下下次要怎么做。那张单子后来贴在了墙上。' }
    ],
    quiz: [
      { q: '明明和奶奶的这一本里，出现了下面哪一样？', opts: ['饺子', '水', '书包'], a: 0, kind: 'recall' },
      { q: '明明第一次为什么没做成饺子？', opts: ['因为没人帮忙', '因为材料不够', '两步并成一步，漏了顺序'], a: 2, kind: 'infer' },
      { q: '做一件步骤很多的事（像做饺子那样），你会先做什么？', opts: ['想到哪步做哪步', '直接跳过开头的步骤', '先把步骤写下来，再一步一步做'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b86', lv: 'L8', tag: '中秋', title: 'The Mid-Autumn Moon', zh: '中秋的月亮',
    emoji: '🌕', color: '#F9DFB4',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「分一分」这条线，认读 2 个新词。',
    trap: 'ou / ow 读 /aʊ/，oi / oy 读 /ɔɪ/；长句按意思分组读，别逐词蹦。',
    summary: '《中秋的月亮》是「分一分」：丽丽和爷爷在家，围绕月饼把一件事读到底。本本词卡：月饼、地面。读前先看词卡，读完合上书说一说。',
    retell: '按做事情的顺序讲一遍，至少用上三个新词。（这一本是「分一分」。）',
    think: '说说家里只剩一份、两个人都想要的时候，你们是怎么商量的。',
    pre: [
      { art: '🥮', en: 'mooncake', zh: '月饼' },
      { art: '🌿', en: 'ground', zh: '地面' },
      { art: '📦', en: 'they', zh: 'they' },
      { art: '📦', en: 'it', zh: 'it' }
    ],
    sight: [],
    newWords: [
      { w: 'mooncake', zh: '月饼' },
      { w: 'ground', zh: '地面' }
    ],
    pages: [
      { art: 'home|lili,grandpa|mooncake|·', en: 'There is only one mooncake at home.', zh: '家只有一个月饼。' },
      { art: 'home|lili,grandpa|mooncake|♪', en: 'Lili wants it. Grandpa wants it too.', zh: '丽丽想要，爷爷也想要。' },
      { art: 'home|lili,grandpa|mooncake|👀', en: 'They look at the mooncake for a long time. Before they went on, they wrote down mooncake, drawing and ground.', zh: '他们盯着月饼看了好久。继续之前，他们先记下月饼、图画和地面。' },
      { art: 'home|lili,grandpa|mooncake|?', en: '"How can we both have it?" asks Grandpa.', zh: '「怎么才能两个人都有？」爷爷问。' },
      { art: 'home|lili,grandpa|mooncake|·', en: 'Lili says, "You can have it first."', zh: '丽丽说：「你先来吧。」' },
      { art: 'home|lili,grandpa|mooncake|!', en: 'That is not fair to one of them.', zh: '这样对其中一个不公平。' },
      { art: 'home|lili,grandpa|clock|♥', en: 'Grandpa has a better idea.', zh: '爷爷想出个更好的办法。' },
      { art: 'home|lili,grandpa|clock|·', en: 'They cut the mooncake into two parts.', zh: '他们把月饼分成两份。' },
      { art: 'home|lili,grandpa|mooncake|★', en: 'Now each of them has a part.', zh: '现在两个人各有一份。' },
      { art: 'home|lili,grandpa|mooncake|?', en: 'One thing can be enough for two people.', zh: '一样东西，也能让两个人都够。' },
      { art: 'home|lili,grandpa|mooncake|…', en: 'The best idea came after they talked.', zh: '最好的办法是聊出来以后才有的。' },
      { art: 'home|lili,grandpa|mooncake|♥', en: 'They sit together and they are happy. We say the words again: mooncake and drawing.', zh: '他们坐在一起，都很开心。我们把这两个词再说一遍：月饼和图画。' },
      { art: 'home|lili,grandpa|mooncake|·', en: 'Next time they will ask before they decide. They both remembered that day.', zh: '下次他们会先问一句，再做决定。那一天两个人都记着。' }
    ],
    quiz: [
      { q: '在家读的这一本里，有下面哪一样？', opts: ['图画', '苹果', '鸟'], a: 0, kind: 'recall' },
      { q: '两个人是怎么都拿到月饼的？', opts: ['谁力气大谁拿走', '商量以后把它分成两份', '又买了一个'], a: 1, kind: 'infer' },
      { q: '只剩一份月饼、两个人都想要时，你会怎么做？', opts: ['谁也不给', '先抢到手再说', '先问一句能不能分，再一起想办法'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b87', lv: 'L8', tag: '出行', title: 'A Long Train Ride', zh: '一趟长长的火车',
    emoji: '🚄', color: '#CDE7C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「问一问」这条线，认读 3 个新词。',
    trap: 'ou / ow 读 /aʊ/，oi / oy 读 /ɔɪ/；长句按意思分组读，别逐词蹦。',
    summary: '《一趟长长的火车》是「问一问」：奶奶和妈妈在家，围绕窗户把一件事读到底。本本词卡：窗户、房子、邻居。读前先看词卡，读完合上书说一说。',
    retell: '按做事情的顺序讲一遍，至少用上三个新词。（这一本是「问一问」。）',
    think: '回想一次「问了还是没懂」：把当时的问题改成一个更小的、指着某个词的问题。',
    pre: [
      { art: '🪟', en: 'window', zh: '窗户' },
      { art: '🏠', en: 'house', zh: '房子' },
      { art: '🧑', en: 'neighbor', zh: '邻居' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👵', en: 'grandma', zh: '奶奶' }
    ],
    sight: [],
    newWords: [
      { w: 'window', zh: '窗户' },
      { w: 'house', zh: '房子' },
      { w: 'neighbor', zh: '邻居' }
    ],
    pages: [
      { art: 'home|grandma,mom|window|·', en: 'Grandma is reading the word "window" at home.', zh: '奶奶在家读「window」这个词。' },
      { art: 'home|grandma,mom|window|♪', en: 'Grandma wants to understand it.', zh: '奶奶想把它弄明白。' },
      { art: 'home|grandma,mom|window|👀', en: 'One sentence does not make sense. Before they went on, they wrote down window, house and neighbor.', zh: '有一句怎么也读不通。继续之前，他们先记下窗户、房子和邻居。' },
      { art: 'home|grandma,mom|window|?', en: '"What does this part mean?" asks Grandma.', zh: '「这一段什么意思？」奶奶问。' },
      { art: 'home|grandma,mom|window|·', en: 'Mom answers, but Grandma still looks lost.', zh: '妈妈答了，奶奶还是没懂。' },
      { art: 'home|grandma,mom|window|!', en: 'The answer was right, but not the right answer.', zh: '答案没错，却不是问的那个。' },
      { art: 'home|grandma,mom|game|♥', en: 'Mom asks, "Which word is the hard one?"', zh: '妈妈反问：「难的是哪个词？」' },
      { art: 'home|grandma,mom|game|·', en: 'Grandma points to one word and asks again.', zh: '奶奶指着一个词，又问了一遍。' },
      { art: 'home|grandma,mom|window|★', en: 'Now the whole sentence is clear.', zh: '这下整句都清楚了。' },
      { art: 'home|grandma,mom|window|?', en: 'The real question had been a smaller one.', zh: '真正该问的，是个更小的问题。' },
      { art: 'home|grandma,mom|window|…', en: 'Asking again is not the same as not listening.', zh: '再问一遍，不等于没在听。' },
      { art: 'home|grandma,mom|window|♥', en: 'Grandma says the sentence out loud. We say the words again: window and house.', zh: '奶奶把这句大声念了出来。我们把这两个词再说一遍：窗户和房子。' },
      { art: 'home|grandma,mom|window|·', en: 'They write down one new question. The smaller question stayed with them.', zh: '他们又写下一个新问题。那个更小的问题，他们一直记着。' }
    ],
    quiz: [
      { q: '这一本里，奶奶看到了下面哪一样？', opts: ['蓝色', '邻居', '胳膊'], a: 1, kind: 'recall' },
      { q: '奶奶第一次为什么没听懂「window」？', opts: ['问题太大，没指向真正卡住的那个词', '因为答案太短', '因为读得太快'], a: 0, kind: 'infer' },
      { q: '别人把「window」解释完你还是没懂，你会怎么做？', opts: ['指出具体哪个词不懂，再问一遍', '点点头装作懂了', '把整段跳过去'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b88', lv: 'L8', tag: '通信', title: 'A Letter to My Cousin', zh: '给表姐的信',
    emoji: '💌', color: '#C6DEF6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「一起做」这条线，认读 3 个新词。',
    trap: 'ou / ow 读 /aʊ/，oi / oy 读 /ɔɪ/；长句按意思分组读，别逐词蹦。',
    summary: '《给表姐的信》是「一起做」：爷爷和爸爸在家，围绕图画把一件事读到底。本本词卡：毛巾、小镇、鳟鱼。读前先看词卡，读完合上书说一说。',
    retell: '按做事情的顺序讲一遍，至少用上三个新词。（这一本是「一起做」。）',
    think: '说一件你做过的、步骤很多的事：哪一步最容易漏？下次怎么提醒自己？',
    pre: [
      { art: '🧻', en: 'towel', zh: '毛巾' },
      { art: '🏙️', en: 'town', zh: '小镇' },
      { art: '🐾', en: 'trout', zh: '鳟鱼' },
      { art: '📦', en: 'they', zh: 'they' },
      { art: '📦', en: 'the', zh: 'the' }
    ],
    sight: [],
    newWords: [
      { w: 'towel', zh: '毛巾' },
      { w: 'town', zh: '小镇' },
      { w: 'trout', zh: '鳟鱼' }
    ],
    pages: [
      { art: 'home|grandpa,dad|drawing|·', en: 'Grandpa has an idea at home.', zh: '爷爷在家有了个主意。' },
      { art: 'home|grandpa,dad|drawing|♪', en: '"Let us make a drawing," says Grandpa.', zh: '「我们做图画吧。」爷爷说。' },
      { art: 'home|grandpa,dad|drawing|👀', en: 'They get everything ready. Before they went on, they wrote down towel, town and trout.', zh: '他们把要用的东西备齐。继续之前，他们先记下毛巾、小镇和鳟鱼。' },
      { art: 'home|grandpa,dad|drawing|?', en: '"What do we need first?" asks Dad.', zh: '「先要什么？」爸爸问。' },
      { art: 'home|grandpa,dad|drawing|·', en: 'They make a list, and they start.', zh: '他们列了个单子，就动手了。' },
      { art: 'home|grandpa,dad|drawing|!', en: 'It does not look right. Something is wrong.', zh: '样子不对，哪里出了岔子。' },
      { art: 'home|grandpa,dad|line|♥', en: 'Dad reads the list again, out loud.', zh: '爸爸把单子又大声念了一遍。' },
      { art: 'home|grandpa,dad|line|·', en: 'They start again, one step at a time.', zh: '他们重来，一步一步做。' },
      { art: 'home|grandpa,dad|drawing|★', en: 'This time the drawing is just right.', zh: '这次图画正好。' },
      { art: 'home|grandpa,dad|drawing|?', en: 'The first time they did two steps at once.', zh: '第一遍两步并成一步做了。' },
      { art: 'home|grandpa,dad|drawing|…', en: 'Slow is not always slower.', zh: '慢，不一定就更慢。' },
      { art: 'home|grandpa,dad|drawing|♥', en: 'They are proud of the drawing. We say the words again: towel and town.', zh: '他们为这个图画挺得意。我们把这两个词再说一遍：毛巾和小镇。' },
      { art: 'home|grandpa,dad|drawing|·', en: 'They write down what they would do next time. The list went up on the wall.', zh: '他们写下下次要怎么做。那张单子后来贴在了墙上。' }
    ],
    quiz: [
      { q: '爷爷和爸爸的这一本里，出现了下面哪一样？', opts: ['鸭舌帽', '蓝色', '鳟鱼'], a: 2, kind: 'recall' },
      { q: '爷爷第一次为什么没做成图画？', opts: ['因为没人帮忙', '两步并成一步，漏了顺序', '因为材料不够'], a: 1, kind: 'infer' },
      { q: '做一件步骤很多的事（像做图画那样），你会先做什么？', opts: ['先把步骤写下来，再一步一步做', '直接跳过开头的步骤', '想到哪步做哪步'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b89', lv: 'L8', tag: '农场', title: 'The Brown Cow', zh: '棕色的奶牛',
    emoji: '🐄', color: '#E0CFF3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「找回来」这条线，认读 3 个新词。',
    trap: 'ou / ow 读 /aʊ/，oi / oy 读 /ɔɪ/；长句按意思分组读，别逐词蹦。',
    summary: '《棕色的奶牛》是「找回来」：妈妈和明明在农场，围绕奶牛把一件事读到底。本本词卡：奶牛、面条、猫头鹰。读前先看词卡，读完合上书说一说。',
    retell: '按做事情的顺序讲一遍，至少用上三个新词。（这一本是「找回来」。）',
    think: '说一说你有没有把东西放忘了的时候：先说在哪儿丢的，再说最后在哪儿找到。',
    pre: [
      { art: '🐄', en: 'cow', zh: '奶牛' },
      { art: '🍜', en: 'noodle', zh: '面条' },
      { art: '🦉', en: 'owl', zh: '猫头鹰' },
      { art: '📦', en: 'they', zh: 'they' },
      { art: '📦', en: 'the', zh: 'the' }
    ],
    sight: [],
    newWords: [
      { w: 'cow', zh: '奶牛' },
      { w: 'noodle', zh: '面条' },
      { w: 'owl', zh: '猫头鹰' }
    ],
    pages: [
      { art: 'farm|mom,ming|cow|·', en: 'Mom and Ming are on the farm.', zh: '妈妈和明明在农场。' },
      { art: 'farm|mom,ming|cow|♪', en: 'Mom wants a cow.', zh: '妈妈想要奶牛。' },
      { art: 'farm|mom,ming|cow|👀', en: 'They look at the bag and the cap. Before they went on, they wrote down cow, noodle and owl.', zh: '他们看看书包和鸭舌帽。继续之前，他们先记下奶牛、面条和猫头鹰。' },
      { art: 'farm|mom,ming|cow|?', en: '"Where is my cow?" asks Mom.', zh: '「我的奶牛呢？」妈妈问。' },
      { art: 'farm|mom,ming|cow|·', en: 'They look here, and they look there.', zh: '他们这儿看看，那儿看看。' },
      { art: 'farm|mom,ming|cow|!', en: 'No cow. Not here, not there.', zh: '没有奶牛。这儿没有，那儿也没有。' },
      { art: 'farm|mom,ming|bag|♥', en: 'Ming says, "Let us go back and look again."', zh: '明明说：「我们回去再找一遍。」' },
      { art: 'farm|mom,ming|bag|·', en: 'So they go back and look more slowly.', zh: '于是他们回去，看得慢一些。' },
      { art: 'farm|mom,ming|cow|★', en: 'There it is! The cow was on the farm all along.', zh: '在那儿！奶牛一直在农场。' },
      { art: 'farm|mom,ming|cow|?', en: 'They had been in a hurry the first time.', zh: '第一遍太着急了。' },
      { art: 'farm|mom,ming|cow|…', en: 'The best place to look is often where you started.', zh: '最容易漏掉的，常常是最开始的地方。' },
      { art: 'farm|mom,ming|cow|♥', en: 'Mom is glad. Ming is glad too. We say the words again: cow and noodle.', zh: '妈妈很高兴，明明也很高兴。我们把这两个词再说一遍：奶牛和面条。' },
      { art: 'farm|mom,ming|cow|·', en: 'They put the cow back where it belongs. From then on, they looked twice before they gave up.', zh: '他们把奶牛放回原处。从那以后，他们会再看一遍才放弃。' }
    ],
    quiz: [
      { q: '在农场读的这一本里，有下面哪一样？', opts: ['小鸡', '面包', '面条'], a: 2, kind: 'recall' },
      { q: '为什么第一遍没找到奶牛？', opts: ['因为奶牛不见了', '因为天黑了', '看得太快，漏掉了最开始的地方'], a: 2, kind: 'infer' },
      { q: '如果你的奶牛找不到了，你会先做什么？', opts: ['马上再买一个新的', '不找了，直接走开', '先回到最开始的地方慢慢找一遍'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b90', lv: 'L8', tag: '家里', title: 'A House with a Window', zh: '有窗的房子',
    emoji: '🏠', color: '#F6C9E3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「跟读整句」这条线，认读 3 个新词。',
    trap: 'ou / ow 读 /aʊ/，oi / oy 读 /ɔɪ/；长句按意思分组读，别逐词蹦。',
    summary: '《有窗的房子》是「跟读整句」：爸爸和丽丽在家，围绕房子把一件事读到底。本本词卡：汤、南方、吸管。读前先看词卡，读完合上书说一说。',
    retell: '按做事情的顺序讲一遍，至少用上三个新词。（这一本是「跟读整句」。）',
    think: '挑书里最长的一句英文，先听整句，再分成两段读给家长听。',
    pre: [
      { art: '🍲', en: 'soup', zh: '汤' },
      { art: '🌿', en: 'south', zh: '南方' },
      { art: '🥤', en: 'straw', zh: '吸管' },
      { art: '👨', en: 'dad', zh: '爸爸' },
      { art: '📦', en: 'it', zh: 'it' }
    ],
    sight: [],
    newWords: [
      { w: 'soup', zh: '汤' },
      { w: 'south', zh: '南方' },
      { w: 'straw', zh: '吸管' }
    ],
    pages: [
      { art: 'home|dad,lili|house|·', en: 'Dad opens a book at home.', zh: '爸爸在家翻开一本书。' },
      { art: 'home|dad,lili|house|♪', en: 'Dad wants to read it out loud.', zh: '爸爸想把它读出来。' },
      { art: 'home|dad,lili|house|👀', en: 'The sentence with the word "house" is long. Before they went on, they wrote down soup, south and straw.', zh: '带着「house」这个词的那一句很长。继续之前，他们先记下汤、南方和吸管。' },
      { art: 'home|dad,lili|house|?', en: '"Where do I stop for breath?" asks Dad.', zh: '「在哪里换气？」爸爸问。' },
      { art: 'home|dad,lili|house|·', en: 'Dad reads it one word at a time.', zh: '爸爸一个词一个词地读。' },
      { art: 'home|dad,lili|house|!', en: 'It sounds broken, not like a sentence.', zh: '听着是碎的，不像一句话。' },
      { art: 'home|dad,lili|food|♥', en: 'Lili plays the whole sentence.', zh: '丽丽把整句放了一遍。' },
      { art: 'home|dad,lili|food|·', en: 'Dad listens, then reads it in two parts.', zh: '爸爸听完，分两段读。' },
      { art: 'home|dad,lili|house|★', en: 'Now it sounds like one sentence.', zh: '这下听起来像一整句了。' },
      { art: 'home|dad,lili|house|?', en: 'The words belong to groups, not to themselves.', zh: '词是成组的，不是一个一个孤立的。' },
      { art: 'home|dad,lili|house|…', en: 'Reading is closer to speaking than to spelling.', zh: '读，更接近说，而不是拼。' },
      { art: 'home|dad,lili|house|♥', en: 'Dad reads it once more, smiling. We say the words again: soup and south.', zh: '爸爸笑着又读了一遍。我们把这两个词再说一遍：汤和南方。' },
      { art: 'home|dad,lili|house|·', en: 'They try the next sentence about some food. Reading out loud became easier after that.', zh: '他们接着试讲食物的下一句。从那以后，读出声就不那么难了。' }
    ],
    quiz: [
      { q: '这一本里，爸爸看到了下面哪一样？', opts: ['教室', '食物', '方块'], a: 1, kind: 'recall' },
      { q: '爸爸读「house」那一句时，为什么一个词一个词读听起来是碎的？', opts: ['因为词太难', '因为读得太慢', '句子里的词是成组的，不能逐个蹦'], a: 2, kind: 'infer' },
      { q: '遇到像「house」那一句这样很长的英文句子，你会怎么读？', opts: ['一个词一个词慢慢拼', '先听整句，再按意思分成两三段读', '只看中文跳过英文'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b91', lv: 'L8', tag: '数学', title: 'Count the Coins', zh: '数硬币',
    emoji: '🪙', color: '#BFE6DF',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「找回来」这条线，认读 3 个新词。',
    trap: 'ou / ow 读 /aʊ/，oi / oy 读 /ɔɪ/；长句按意思分组读，别逐词蹦。',
    summary: '《数硬币》是「找回来」：明明和奶奶在家，围绕硬币把一件事读到底。本本词卡：表姐、王冠、牡蛎。读前先看词卡，读完合上书说一说。',
    retell: '按做事情的顺序讲一遍，至少用上三个新词。（这一本是「找回来」。）',
    think: '说一说你有没有把东西放忘了的时候：先说在哪儿丢的，再说最后在哪儿找到。',
    pre: [
      { art: '🧑', en: 'cousin', zh: '表姐' },
      { art: '👑', en: 'crown', zh: '王冠' },
      { art: '🐾', en: 'oyster', zh: '牡蛎' },
      { art: '📦', en: 'they', zh: 'they' },
      { art: '📦', en: 'and', zh: 'and' }
    ],
    sight: [],
    newWords: [
      { w: 'cousin', zh: '表姐' },
      { w: 'crown', zh: '王冠' },
      { w: 'oyster', zh: '牡蛎' }
    ],
    pages: [
      { art: 'home|ming,grandma|coin|·', en: 'Ming and Grandma are at home.', zh: '明明和奶奶在家。' },
      { art: 'home|ming,grandma|coin|♪', en: 'Ming wants a coin.', zh: '明明想要硬币。' },
      { art: 'home|ming,grandma|coin|👀', en: 'They look at the lid and the rope. Before they went on, they wrote down cousin, crown and oyster.', zh: '他们看看盖子和绳子。继续之前，他们先记下表姐、王冠和牡蛎。' },
      { art: 'home|ming,grandma|coin|?', en: '"Where is my coin?" asks Ming.', zh: '「我的硬币呢？」明明问。' },
      { art: 'home|ming,grandma|coin|·', en: 'They look here, and they look there.', zh: '他们这儿看看，那儿看看。' },
      { art: 'home|ming,grandma|coin|!', en: 'No coin. Not here, not there.', zh: '没有硬币。这儿没有，那儿也没有。' },
      { art: 'home|ming,grandma|lid|♥', en: 'Grandma says, "Let us go back and look again."', zh: '奶奶说：「我们回去再找一遍。」' },
      { art: 'home|ming,grandma|lid|·', en: 'So they go back and look more slowly.', zh: '于是他们回去，看得慢一些。' },
      { art: 'home|ming,grandma|coin|★', en: 'There it is! The coin was at home all along.', zh: '在那儿！硬币一直在家。' },
      { art: 'home|ming,grandma|coin|?', en: 'They had been in a hurry the first time.', zh: '第一遍太着急了。' },
      { art: 'home|ming,grandma|coin|…', en: 'The best place to look is often where you started.', zh: '最容易漏掉的，常常是最开始的地方。' },
      { art: 'home|ming,grandma|coin|♥', en: 'Ming is glad. Grandma is glad too. We say the words again: cousin and crown.', zh: '明明很高兴，奶奶也很高兴。我们把这两个词再说一遍：表姐和王冠。' },
      { art: 'home|ming,grandma|coin|·', en: 'They put the coin back where it belongs. From then on, they looked twice before they gave up.', zh: '他们把硬币放回原处。从那以后，他们会再看一遍才放弃。' }
    ],
    quiz: [
      { q: '明明和奶奶的这一本里，出现了下面哪一样？', opts: ['盘子', '硬币', '教室'], a: 1, kind: 'recall' },
      { q: '为什么第一遍没找到硬币？', opts: ['看得太快，漏掉了最开始的地方', '因为天黑了', '因为硬币不见了'], a: 0, kind: 'infer' },
      { q: '如果你的硬币找不到了，你会先做什么？', opts: ['不找了，直接走开', '马上再买一个新的', '先回到最开始的地方慢慢找一遍'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b92', lv: 'L8', tag: '趣事', title: 'A Loud Shout at Night', zh: '夜里的一声喊',
    emoji: '🌃', color: '#F2E2A8',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「合上书讲一遍」这条线，不引入新词，全部是读过的词。',
    trap: 'ou / ow 读 /aʊ/，oi / oy 读 /ɔɪ/；长句按意思分组读，别逐词蹦。',
    summary: '《夜里的一声喊》是「合上书讲一遍」：丽丽和爷爷在家，围绕夜晚把一件事读到底。本本词卡：这一本不引入新词，全部是读过的词。读前先看词卡，读完合上书说一说。',
    retell: '按做事情的顺序讲一遍，至少用上三个新词。（这一本是「合上书讲一遍」。）',
    think: '合上书，用「谁 → 在哪儿 → 出了什么事 → 结果」把夜晚这一本讲给家长听。',
    pre: [
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👧', en: 'lili', zh: '丽丽' }
    ],
    sight: [],
    newWords: [

    ],
    pages: [
      { art: 'home|lili,grandpa|night|·', en: 'Lili has just finished a book at home.', zh: '丽丽刚在家读完一本书。' },
      { art: 'home|lili,grandpa|night|♪', en: 'Grandpa wants to hear all about it.', zh: '爷爷想听他讲讲。' },
      { art: 'home|lili,grandpa|night|👀', en: 'Lili thinks about the night in the book. Before they went on, they wrote down home, horse and house.', zh: '丽丽想着书里的夜晚。继续之前，他们先记下家、马和房子。' },
      { art: 'home|lili,grandpa|night|?', en: '"Where do I start?" asks Lili.', zh: '「从哪儿讲起？」丽丽问。' },
      { art: 'home|lili,grandpa|night|·', en: 'Lili tells the last part first.', zh: '丽丽先讲了结尾。' },
      { art: 'home|lili,grandpa|night|!', en: 'Grandpa cannot follow the story.', zh: '爷爷听不明白。' },
      { art: 'home|lili,grandpa|grass|♥', en: 'Grandpa says, "Tell me who, where, then what."', zh: '爷爷说：「先说谁、在哪儿、再说出什么事。」' },
      { art: 'home|lili,grandpa|grass|·', en: 'Lili starts again, in order.', zh: '丽丽按顺序重新讲。' },
      { art: 'home|lili,grandpa|night|★', en: 'This time Grandpa can see the whole thing.', zh: '这回爷爷全听明白了。' },
      { art: 'home|lili,grandpa|night|?', en: 'A story needs its order to make sense.', zh: '故事要靠顺序才讲得通。' },
      { art: 'home|lili,grandpa|night|…', en: 'If you can tell it, you have read it.', zh: '讲得出来，才算真的读过。' },
      { art: 'home|lili,grandpa|night|♥', en: 'Lili closes the book and tells it again. We say the words again: home and horse.', zh: '丽丽合上书，又讲了一遍。我们把这两个词再说一遍：家和马。' },
      { art: 'home|lili,grandpa|night|·', en: 'Tomorrow they will read about some grass. They could still tell it the next morning.', zh: '明天他们要读讲草的书。第二天早上，他们还能讲得出来。' }
    ],
    quiz: [
      { q: '在家读的这一本里，有下面哪一样？', opts: ['奶牛', '房子', '饺子'], a: 1, kind: 'recall' },
      { q: '为什么爷爷第一遍没听明白？', opts: ['先讲了结尾，顺序乱了', '因为讲得太慢', '因为故事太短'], a: 0, kind: 'infer' },
      { q: '要把讲夜晚的这本读过的书讲给别人听，你会怎么开头？', opts: ['直接从最精彩的那句开始', '先说谁、在哪儿，再按顺序说出了什么事', '先报书名和生词表'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b93', lv: 'L8', tag: '发音', title: 'Say It: House, Cow', zh: '说一说：house cow',
    emoji: '🗣️', color: '#D9D2F5',
    track: 'drill',
    goal: '把本级难点音听准、说准，并能在整句里读对。这一本走「问一问」这条线，不引入新词，全部是读过的词。',
    trap: 'ou / ow 读 /aʊ/，oi / oy 读 /ɔɪ/；长句按意思分组读，别逐词蹦。',
    summary: '《说一说：house cow》是「问一问」：奶奶和妈妈在家，围绕房子把一件事读到底。本本词卡：这一本不引入新词，全部是读过的词。读前先看词卡，读完合上书说一说。',
    retell: '按做事情的顺序讲一遍，至少用上三个新词。（这一本是「问一问」。）',
    think: '回想一次「问了还是没懂」：把当时的问题改成一个更小的、指着某个词的问题。',
    pre: [
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👵', en: 'grandma', zh: '奶奶' }
    ],
    sight: [],
    newWords: [

    ],
    pages: [
      { art: 'home|grandma,mom|house|·', en: 'Grandma is reading the word "house" at home.', zh: '奶奶在家读「house」这个词。' },
      { art: 'home|grandma,mom|house|♪', en: 'Grandma wants to understand it.', zh: '奶奶想把它弄明白。' },
      { art: 'home|grandma,mom|house|👀', en: 'One sentence does not make sense. Before they went on, they wrote down horse, house and jam.', zh: '有一句怎么也读不通。继续之前，他们先记下马、房子和果酱。' },
      { art: 'home|grandma,mom|house|?', en: '"What does this part mean?" asks Grandma.', zh: '「这一段什么意思？」奶奶问。' },
      { art: 'home|grandma,mom|house|·', en: 'Mom answers, but Grandma still looks lost.', zh: '妈妈答了，奶奶还是没懂。' },
      { art: 'home|grandma,mom|house|!', en: 'The answer was right, but not the right answer.', zh: '答案没错，却不是问的那个。' },
      { art: 'home|grandma,mom|lunch|♥', en: 'Mom asks, "Which word is the hard one?"', zh: '妈妈反问：「难的是哪个词？」' },
      { art: 'home|grandma,mom|lunch|·', en: 'Grandma points to one word and asks again.', zh: '奶奶指着一个词，又问了一遍。' },
      { art: 'home|grandma,mom|house|★', en: 'Now the whole sentence is clear.', zh: '这下整句都清楚了。' },
      { art: 'home|grandma,mom|house|?', en: 'The real question had been a smaller one.', zh: '真正该问的，是个更小的问题。' },
      { art: 'home|grandma,mom|house|…', en: 'Asking again is not the same as not listening.', zh: '再问一遍，不等于没在听。' },
      { art: 'home|grandma,mom|house|♥', en: 'Grandma says the sentence out loud. We say the words again: horse and house.', zh: '奶奶把这句大声念了出来。我们把这两个词再说一遍：马和房子。' },
      { art: 'home|grandma,mom|house|·', en: 'They write down one new question. The smaller question stayed with them.', zh: '他们又写下一个新问题。那个更小的问题，他们一直记着。' }
    ],
    quiz: [
      { q: '这一本里，奶奶看到了下面哪一样？', opts: ['果酱', '表姐', '鸭子'], a: 0, kind: 'recall' },
      { q: '奶奶第一次为什么没听懂「house」？', opts: ['因为答案太短', '因为读得太快', '问题太大，没指向真正卡住的那个词'], a: 2, kind: 'infer' },
      { q: '别人把「house」解释完你还是没懂，你会怎么做？', opts: ['点点头装作懂了', '指出具体哪个词不懂，再问一遍', '把整段跳过去'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b94', lv: 'L8', tag: '小知识', title: 'Why the Moon Looks Round', zh: '月亮为什么圆',
    emoji: '🔭', color: '#FAD3B6',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。这一本走「问一问」这条线，不引入新词，全部是读过的词。',
    trap: 'ou / ow 读 /aʊ/，oi / oy 读 /ɔɪ/；长句按意思分组读，别逐词蹦。',
    summary: '《月亮为什么圆》是「问一问」：爷爷和爸爸在家，围绕月饼把一件事读到底。本本词卡：这一本不引入新词，全部是读过的词。读前先看词卡，读完合上书说一说。',
    retell: '按做事情的顺序讲一遍，至少用上三个新词。（这一本是「问一问」。）',
    think: '回想一次「问了还是没懂」：把当时的问题改成一个更小的、指着某个词的问题。',
    pre: [
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👴', en: 'grandpa', zh: '爷爷' }
    ],
    sight: [],
    newWords: [

    ],
    pages: [
      { art: 'home|grandpa,dad|mooncake|·', en: 'Grandpa is reading the word "mooncake" at home.', zh: '爷爷在家读「mooncake」这个词。' },
      { art: 'home|grandpa,dad|mooncake|♪', en: 'Grandpa wants to understand it.', zh: '爷爷想把它弄明白。' },
      { art: 'home|grandpa,dad|mooncake|👀', en: 'One sentence does not make sense. Before they went on, they wrote down house, jam and jug.', zh: '有一句怎么也读不通。继续之前，他们先记下房子、果酱和水壶。' },
      { art: 'home|grandpa,dad|mooncake|?', en: '"What does this part mean?" asks Grandpa.', zh: '「这一段什么意思？」爷爷问。' },
      { art: 'home|grandpa,dad|mooncake|·', en: 'Dad answers, but Grandpa still looks lost.', zh: '爸爸答了，爷爷还是没懂。' },
      { art: 'home|grandpa,dad|mooncake|!', en: 'The answer was right, but not the right answer.', zh: '答案没错，却不是问的那个。' },
      { art: 'home|grandpa,dad|bag|♥', en: 'Dad asks, "Which word is the hard one?"', zh: '爸爸反问：「难的是哪个词？」' },
      { art: 'home|grandpa,dad|bag|·', en: 'Grandpa points to one word and asks again.', zh: '爷爷指着一个词，又问了一遍。' },
      { art: 'home|grandpa,dad|mooncake|★', en: 'Now the whole sentence is clear.', zh: '这下整句都清楚了。' },
      { art: 'home|grandpa,dad|mooncake|?', en: 'The real question had been a smaller one.', zh: '真正该问的，是个更小的问题。' },
      { art: 'home|grandpa,dad|mooncake|…', en: 'Asking again is not the same as not listening.', zh: '再问一遍，不等于没在听。' },
      { art: 'home|grandpa,dad|mooncake|♥', en: 'Grandpa says the sentence out loud. We say the words again: house and jam.', zh: '爷爷把这句大声念了出来。我们把这两个词再说一遍：房子和果酱。' },
      { art: 'home|grandpa,dad|mooncake|·', en: 'They write down one new question. The smaller question stayed with them.', zh: '他们又写下一个新问题。那个更小的问题，他们一直记着。' }
    ],
    quiz: [
      { q: '爷爷和爸爸的这一本里，出现了下面哪一样？', opts: ['雾', '图画', '房子'], a: 2, kind: 'recall' },
      { q: '爷爷第一次为什么没听懂「mooncake」？', opts: ['因为答案太短', '问题太大，没指向真正卡住的那个词', '因为读得太快'], a: 1, kind: 'infer' },
      { q: '别人把「mooncake」解释完你还是没懂，你会怎么做？', opts: ['点点头装作懂了', '把整段跳过去', '指出具体哪个词不懂，再问一遍'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b95', lv: 'L8', tag: '小知识', title: 'Noodles in the South', zh: '南方的面条',
    emoji: '🍜', color: '#C8E7F0',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。这一本走「合上书讲一遍」这条线，不引入新词，全部是读过的词。',
    trap: 'ou / ow 读 /aʊ/，oi / oy 读 /ɔɪ/；长句按意思分组读，别逐词蹦。',
    summary: '《南方的面条》是「合上书讲一遍」：妈妈和明明在家，围绕面条把一件事读到底。本本词卡：这一本不引入新词，全部是读过的词。读前先看词卡，读完合上书说一说。',
    retell: '按做事情的顺序讲一遍，至少用上三个新词。（这一本是「合上书讲一遍」。）',
    think: '合上书，用「谁 → 在哪儿 → 出了什么事 → 结果」把面条这一本讲给家长听。',
    pre: [
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👩', en: 'mom', zh: '妈妈' }
    ],
    sight: [],
    newWords: [

    ],
    pages: [
      { art: 'home|mom,ming|noodle|·', en: 'Mom has just finished a book at home.', zh: '妈妈刚在家读完一本书。' },
      { art: 'home|mom,ming|noodle|♪', en: 'Ming wants to hear all about it.', zh: '明明想听他讲讲。' },
      { art: 'home|mom,ming|noodle|👀', en: 'Mom thinks about the noodle in the book. Before they went on, they wrote down jam, jug and king.', zh: '妈妈想着书里的面条。继续之前，他们先记下果酱、水壶和国王。' },
      { art: 'home|mom,ming|noodle|?', en: '"Where do I start?" asks Mom.', zh: '「从哪儿讲起？」妈妈问。' },
      { art: 'home|mom,ming|noodle|·', en: 'Mom tells the last part first.', zh: '妈妈先讲了结尾。' },
      { art: 'home|mom,ming|noodle|!', en: 'Ming cannot follow the story.', zh: '明明听不明白。' },
      { art: 'home|mom,ming|ball|♥', en: 'Ming says, "Tell me who, where, then what."', zh: '明明说：「先说谁、在哪儿、再说出什么事。」' },
      { art: 'home|mom,ming|ball|·', en: 'Mom starts again, in order.', zh: '妈妈按顺序重新讲。' },
      { art: 'home|mom,ming|noodle|★', en: 'This time Ming can see the whole thing.', zh: '这回明明全听明白了。' },
      { art: 'home|mom,ming|noodle|?', en: 'A story needs its order to make sense.', zh: '故事要靠顺序才讲得通。' },
      { art: 'home|mom,ming|noodle|…', en: 'If you can tell it, you have read it.', zh: '讲得出来，才算真的读过。' },
      { art: 'home|mom,ming|noodle|♥', en: 'Mom closes the book and tells it again. We say the words again: jam and jug.', zh: '妈妈合上书，又讲了一遍。我们把这两个词再说一遍：果酱和水壶。' },
      { art: 'home|mom,ming|noodle|·', en: 'Tomorrow they will read about a ball. They could still tell it the next morning.', zh: '明天他们要读讲球的书。第二天早上，他们还能讲得出来。' }
    ],
    quiz: [
      { q: '在家读的这一本里，有下面哪一样？', opts: ['球', '草', '狐狸'], a: 0, kind: 'recall' },
      { q: '为什么明明第一遍没听明白？', opts: ['先讲了结尾，顺序乱了', '因为讲得太慢', '因为故事太短'], a: 0, kind: 'infer' },
      { q: '要把讲面条的这本读过的书讲给别人听，你会怎么开头？', opts: ['先说谁、在哪儿，再按顺序说出了什么事', '先报书名和生词表', '直接从最精彩的那句开始'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b96', lv: 'L8', tag: '复习', title: 'All Together Tonight', zh: '今晚大家在一起',
    emoji: '🏮', color: '#E8D9B5',
    track: 'review',
    goal: '把本级和前面级别的词再读一遍、串成一个故事。这一本走「比一比」这条线，不引入新词，全部是读过的词。',
    trap: 'ou / ow 读 /aʊ/，oi / oy 读 /ɔɪ/；长句按意思分组读，别逐词蹦。',
    summary: '《今晚大家在一起》是「比一比」：爸爸和丽丽在图书馆，围绕小镇把一件事读到底。本本词卡：这一本不引入新词，全部是读过的词。读前先看词卡，读完合上书说一说。',
    retell: '按做事情的顺序讲一遍，至少用上三个新词。（这一本是「比一比」。）',
    think: '找两样很像的东西，用英文说出至少两处不同，说说你是按什么顺序找的。',
    pre: [
      { art: '📦', en: 'they', zh: 'they' },
      { art: '📦', en: 'the', zh: 'the' }
    ],
    sight: [],
    newWords: [

    ],
    pages: [
      { art: 'library|dad,lili|town|·', en: 'Dad looks at a town and a cup.', zh: '爸爸看着小镇和杯子。' },
      { art: 'library|dad,lili|town|♪', en: 'They want to know how they are different.', zh: '他们想知道两样有什么不一样。' },
      { art: 'library|dad,lili|town|👀', en: 'At first the two look the same. Before they went on, they wrote down jug, king and kite.', zh: '乍一看，两样挺像。继续之前，他们先记下水壶、国王和风筝。' },
      { art: 'library|dad,lili|town|?', en: '"What is not the same?" asks Lili.', zh: '「哪里不一样？」丽丽问。' },
      { art: 'library|dad,lili|town|·', en: 'They put them side by side.', zh: '他们把两样并排放。' },
      { art: 'library|dad,lili|town|!', en: 'Looking from far away does not help.', zh: '远远地看，还是看不出。' },
      { art: 'library|dad,lili|cup|♥', en: 'Lili says, "Look at one part at a time."', zh: '丽丽说：「一处一处分开看。」' },
      { art: 'library|dad,lili|cup|·', en: 'They check one part, then another.', zh: '他们先看一处，再看另一处。' },
      { art: 'library|dad,lili|town|★', en: 'There! One small part is different.', zh: '有了！有一处小小的不同。' },
      { art: 'library|dad,lili|town|?', en: 'The difference was small, not missing.', zh: '差别很小，不是没有。' },
      { art: 'library|dad,lili|town|…', en: 'Comparing needs a plan, not just a look.', zh: '比一比要有章法，不能光瞄一眼。' },
      { art: 'library|dad,lili|town|♥', en: 'They tell Dad what they found. We say the words again: jug and king.', zh: '他们把自己发现的讲给爸爸听。我们把这两个词再说一遍：水壶和国王。' },
      { art: 'library|dad,lili|town|·', en: 'Next they will compare the cup and the kite. They made a list of all the small differences.', zh: '接着他们要比一比杯子和风筝。他们把所有细小的不同都列了下来。' }
    ],
    quiz: [
      { q: '这一本里，爸爸看到了下面哪一样？', opts: ['火腿', '游戏', '小镇'], a: 2, kind: 'recall' },
      { q: '小镇和杯子一开始为什么看着一样？', opts: ['因为它们真的完全相同', '只远远看了一眼，没一处一处分开比', '因为光线太暗'], a: 1, kind: 'infer' },
      { q: '要找出像小镇和杯子这样很像的两样东西哪里不同，你会怎么做？', opts: ['隔很远扫一眼', '只挑一个看', '并排放好，一处一处分开看'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b97', lv: 'L9', tag: '出行', title: 'The Photo at the Station', zh: '车站的照片',
    emoji: '📷', color: '#F6C6C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「修好它」这条线，认读 4 个新词。',
    trap: 'kn / wr / ph 里的第一个字母不发音；读长句时先找主句，再读从句。',
    summary: '《车站的照片》是「修好它」：明明和奶奶在车站，围绕照片把一件事读到底。本本词卡：车站、博物馆、电话、科学家。读前先看词卡，读完合上书说一说。',
    retell: '像小讲解员一样，把「现象 → 猜想 → 验证 → 结论」讲清楚。（这一本是「修好它」。）',
    think: '说一样坏过的东西：你一开始反复试了什么？后来发现真正的问题在哪儿？',
    pre: [
      { art: '🚉', en: 'station', zh: '车站' },
      { art: '🏛️', en: 'museum', zh: '博物馆' },
      { art: '📱', en: 'phone', zh: '电话' },
      { art: '🧑', en: 'scientist', zh: '科学家' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'they', zh: 'they' }
    ],
    sight: [],
    newWords: [
      { w: 'station', zh: '车站' },
      { w: 'museum', zh: '博物馆' },
      { w: 'phone', zh: '电话' },
      { w: 'scientist', zh: '科学家' }
    ],
    pages: [
      { art: 'station|ming,grandma|photo|·', en: 'The photo does not work at the station.', zh: '车站的照片不好使了。' },
      { art: 'station|ming,grandma|photo|♪', en: 'Ming wants to fix it.', zh: '明明想把它修好。' },
      { art: 'station|ming,grandma|photo|👀', en: 'They look at it from every side. They wrote three words on the board: museum, phone and scientist.', zh: '他们从各个面都看了一遍。他们在黑板上写下三个词：博物馆、电话和科学家。' },
      { art: 'station|ming,grandma|photo|?', en: '"What did we change?" asks Grandma.', zh: '「我们改过什么？」奶奶问。' },
      { art: 'station|ming,grandma|photo|·', en: 'Ming tries the same thing again.', zh: '明明照原样又试了一次。' },
      { art: 'station|ming,grandma|photo|!', en: 'It still does not work.', zh: '还是不行。' },
      { art: 'station|ming,grandma|cup|♥', en: 'Grandma points to one small part.', zh: '奶奶指着一个小小的部位。' },
      { art: 'station|ming,grandma|cup|·', en: 'They change only that one part.', zh: '他们只换了那一处。' },
      { art: 'station|ming,grandma|photo|★', en: 'Now the photo works again.', zh: '照片又能用了。' },
      { art: 'station|ming,grandma|photo|?', en: 'The trouble was small, but it was hard to see.', zh: '毛病很小，可是不容易看见。' },
      { art: 'station|ming,grandma|photo|?', en: 'Trying harder is not the same as looking closer.', zh: '更用力地试，不等于更仔细地看。' },
      { art: 'station|ming,grandma|photo|…', en: 'They almost missed the easy answer.', zh: '他们差点错过了最简单的答案。' },
      { art: 'station|ming,grandma|photo|♥', en: 'Ming laughs. Grandma laughs too. We say the words again: museum and phone.', zh: '明明笑了，奶奶也笑了。我们把这两个词再说一遍：博物馆和电话。' },
      { art: 'station|ming,grandma|photo|·', en: 'They remember to look before they try again. They kept the small part in a box.', zh: '他们记住了：再试之前，先看一看。他们把那个小零件收进了盒子。' }
    ],
    quiz: [
      { q: '明明和奶奶的这一本里，出现了下面哪一样？', opts: ['照片', '垃圾桶', '鸭舌帽'], a: 0, kind: 'recall' },
      { q: '为什么试了很多次都没修好照片？', opts: ['因为没人愿意帮忙', '因为工具不够', '一直重复同一个动作，没找对小毛病'], a: 2, kind: 'infer' },
      { q: '一件事反复做还是不行（像修照片那样），你会怎么做？', opts: ['先停下来看看是不是漏了一处小的', '把同样的动作再做十遍', '干脆换个人做'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b98', lv: 'L9', tag: '上课', title: 'A Question on the Board', zh: '黑板上的问题',
    emoji: '📋', color: '#F9DFB4',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「合上书讲一遍」这条线，认读 3 个新词。',
    trap: 'kn / wr / ph 里的第一个字母不发音；读长句时先找主句，再读从句。',
    summary: '《黑板上的问题》是「合上书讲一遍」：丽丽和爷爷在教室，围绕问题把一件事读到底。本本词卡：田地、头发、收成。读前先看词卡，读完合上书说一说。',
    retell: '像小讲解员一样，把「现象 → 猜想 → 验证 → 结论」讲清楚。（这一本是「合上书讲一遍」。）',
    think: '合上书，用「谁 → 在哪儿 → 出了什么事 → 结果」把问题这一本讲给家长听。',
    pre: [
      { art: '🌾', en: 'field', zh: '田地' },
      { art: '📦', en: 'hair', zh: '头发' },
      { art: '🍚', en: 'harvest', zh: '收成' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👧', en: 'lili', zh: '丽丽' }
    ],
    sight: [],
    newWords: [
      { w: 'field', zh: '田地' },
      { w: 'hair', zh: '头发' },
      { w: 'harvest', zh: '收成' }
    ],
    pages: [
      { art: 'classroom|lili,grandpa|question|·', en: 'Lili has just finished a book in the classroom.', zh: '丽丽刚在教室读完一本书。' },
      { art: 'classroom|lili,grandpa|question|♪', en: 'Grandpa wants to hear all about it.', zh: '爷爷想听他讲讲。' },
      { art: 'classroom|lili,grandpa|question|👀', en: 'Lili thinks about the question in the book. They wrote three words on the board: field, hair and harvest.', zh: '丽丽想着书里的问题。他们在黑板上写下三个词：田地、头发和收成。' },
      { art: 'classroom|lili,grandpa|question|?', en: '"Where do I start?" asks Lili.', zh: '「从哪儿讲起？」丽丽问。' },
      { art: 'classroom|lili,grandpa|question|·', en: 'Lili tells the last part first.', zh: '丽丽先讲了结尾。' },
      { art: 'classroom|lili,grandpa|question|!', en: 'Grandpa cannot follow the story.', zh: '爷爷听不明白。' },
      { art: 'classroom|lili,grandpa|chick|♥', en: 'Grandpa says, "Tell me who, where, then what."', zh: '爷爷说：「先说谁、在哪儿、再说出什么事。」' },
      { art: 'classroom|lili,grandpa|chick|·', en: 'Lili starts again, in order.', zh: '丽丽按顺序重新讲。' },
      { art: 'classroom|lili,grandpa|question|★', en: 'This time Grandpa can see the whole thing.', zh: '这回爷爷全听明白了。' },
      { art: 'classroom|lili,grandpa|question|?', en: 'A story needs its order to make sense.', zh: '故事要靠顺序才讲得通。' },
      { art: 'classroom|lili,grandpa|question|?', en: 'Remembering is not the same as telling.', zh: '记住，和讲出来不是一回事。' },
      { art: 'classroom|lili,grandpa|question|…', en: 'If you can tell it, you have read it.', zh: '讲得出来，才算真的读过。' },
      { art: 'classroom|lili,grandpa|question|♥', en: 'Lili closes the book and tells it again. We say the words again: field and hair.', zh: '丽丽合上书，又讲了一遍。我们把这两个词再说一遍：田地和头发。' },
      { art: 'classroom|lili,grandpa|question|·', en: 'Tomorrow they will read about a chick. They could still tell it the next morning.', zh: '明天他们要读讲小鸡的书。第二天早上，他们还能讲得出来。' }
    ],
    quiz: [
      { q: '在教室读的这一本里，有下面哪一样？', opts: ['公交车', '木板', '硬币'], a: 1, kind: 'recall' },
      { q: '为什么爷爷第一遍没听明白？', opts: ['因为故事太短', '先讲了结尾，顺序乱了', '因为讲得太慢'], a: 1, kind: 'infer' },
      { q: '要把讲问题的这本读过的书讲给别人听，你会怎么开头？', opts: ['先报书名和生词表', '直接从最精彩的那句开始', '先说谁、在哪儿，再按顺序说出了什么事'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b99', lv: 'L9', tag: '观察', title: 'The Shadow in the Field', zh: '田里的影子',
    emoji: '🌾', color: '#CDE7C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「问一问」这条线，认读 3 个新词。',
    trap: 'kn / wr / ph 里的第一个字母不发音；读长句时先找主句，再读从句。',
    summary: '《田里的影子》是「问一问」：奶奶和妈妈在田地，围绕影子把一件事读到底。本本词卡：影子、客人、小麦。读前先看词卡，读完合上书说一说。',
    retell: '像小讲解员一样，把「现象 → 猜想 → 验证 → 结论」讲清楚。（这一本是「问一问」。）',
    think: '回想一次「问了还是没懂」：把当时的问题改成一个更小的、指着某个词的问题。',
    pre: [
      { art: '🌑', en: 'shadow', zh: '影子' },
      { art: '🧑', en: 'visitor', zh: '客人' },
      { art: '🌾', en: 'wheat', zh: '小麦' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👵', en: 'grandma', zh: '奶奶' }
    ],
    sight: ['field'],
    newWords: [
      { w: 'shadow', zh: '影子' },
      { w: 'visitor', zh: '客人' },
      { w: 'wheat', zh: '小麦' }
    ],
    pages: [
      { art: 'field|grandma,mom|shadow|·', en: 'Grandma is reading the word "shadow" in the field.', zh: '奶奶在田地读「shadow」这个词。' },
      { art: 'field|grandma,mom|shadow|♪', en: 'Grandma wants to understand it.', zh: '奶奶想把它弄明白。' },
      { art: 'field|grandma,mom|shadow|👀', en: 'One sentence does not make sense. They wrote three words on the board: shadow, visitor and wheat.', zh: '有一句怎么也读不通。他们在黑板上写下三个词：影子、客人和小麦。' },
      { art: 'field|grandma,mom|shadow|?', en: '"What does this part mean?" asks Grandma.', zh: '「这一段什么意思？」奶奶问。' },
      { art: 'field|grandma,mom|shadow|·', en: 'Mom answers, but Grandma still looks lost.', zh: '妈妈答了，奶奶还是没懂。' },
      { art: 'field|grandma,mom|shadow|!', en: 'The answer was right, but not the right answer.', zh: '答案没错，却不是问的那个。' },
      { art: 'field|grandma,mom|sun|♥', en: 'Mom asks, "Which word is the hard one?"', zh: '妈妈反问：「难的是哪个词？」' },
      { art: 'field|grandma,mom|sun|·', en: 'Grandma points to one word and asks again.', zh: '奶奶指着一个词，又问了一遍。' },
      { art: 'field|grandma,mom|shadow|★', en: 'Now the whole sentence is clear.', zh: '这下整句都清楚了。' },
      { art: 'field|grandma,mom|shadow|?', en: 'The real question had been a smaller one.', zh: '真正该问的，是个更小的问题。' },
      { art: 'field|grandma,mom|shadow|?', en: 'A clear question is half of an answer.', zh: '问得清楚，答案就有了一半。' },
      { art: 'field|grandma,mom|shadow|…', en: 'Asking again is not the same as not listening.', zh: '再问一遍，不等于没在听。' },
      { art: 'field|grandma,mom|shadow|♥', en: 'Grandma says the sentence out loud. We say the words again: shadow and visitor.', zh: '奶奶把这句大声念了出来。我们把这两个词再说一遍：影子和客人。' },
      { art: 'field|grandma,mom|shadow|·', en: 'They write down one new question. The smaller question stayed with them.', zh: '他们又写下一个新问题。那个更小的问题，他们一直记着。' }
    ],
    quiz: [
      { q: '这一本里，奶奶看到了下面哪一样？', opts: ['客人', '公交车', '云'], a: 0, kind: 'recall' },
      { q: '奶奶第一次为什么没听懂「shadow」？', opts: ['因为读得太快', '问题太大，没指向真正卡住的那个词', '因为答案太短'], a: 1, kind: 'infer' },
      { q: '别人把「shadow」解释完你还是没懂，你会怎么做？', opts: ['点点头装作懂了', '把整段跳过去', '指出具体哪个词不懂，再问一遍'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b100', lv: 'L9', tag: '农事', title: 'Wheat and Harvest', zh: '小麦和收成',
    emoji: '🌾', color: '#C6DEF6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「说出名字」这条线，认读 3 个新词。',
    trap: 'kn / wr / ph 里的第一个字母不发音；读长句时先找主句，再读从句。',
    summary: '《小麦和收成》是「说出名字」：爷爷和爸爸在田地，围绕小麦把一件事读到底。本本词卡：轮子、世界、手腕。读前先看词卡，读完合上书说一说。',
    retell: '像小讲解员一样，把「现象 → 猜想 → 验证 → 结论」讲清楚。（这一本是「说出名字」。）',
    think: '挑小麦和风筝，各说一个英文词，再各说一句完整的话把它们放进去。',
    pre: [
      { art: '⚙️', en: 'wheel', zh: '轮子' },
      { art: '🌍', en: 'world', zh: '世界' },
      { art: '📦', en: 'wrist', zh: '手腕' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'a', zh: 'a' }
    ],
    sight: ['field'],
    newWords: [
      { w: 'wheel', zh: '轮子' },
      { w: 'world', zh: '世界' },
      { w: 'wrist', zh: '手腕' }
    ],
    pages: [
      { art: 'field|grandpa,dad|wheat|·', en: 'Grandpa and Dad are in the field.', zh: '爷爷和爸爸在田地。' },
      { art: 'field|grandpa,dad|wheat|♪', en: 'They want to name what they see.', zh: '他们想把看见的东西说出名字。' },
      { art: 'field|grandpa,dad|wheat|👀', en: 'Grandpa points at some wheat. They wrote three words on the board: wheel, world and wrist.', zh: '爷爷指着小麦。他们在黑板上写下三个词：轮子、世界和手腕。' },
      { art: 'field|grandpa,dad|wheat|?', en: '"What is the English word?" asks Dad.', zh: '「英文怎么说？」爸爸问。' },
      { art: 'field|grandpa,dad|wheat|·', en: 'Grandpa says it, but it does not sound right.', zh: '爷爷说了一遍，听着不太对。' },
      { art: 'field|grandpa,dad|wheat|!', en: 'The word is there, but the sound is not.', zh: '词想起来了，音没对准。' },
      { art: 'field|grandpa,dad|kite|♥', en: 'Dad says the whole sentence slowly.', zh: '爸爸把整句慢慢说了一遍。' },
      { art: 'field|grandpa,dad|kite|·', en: 'Grandpa listens, then says it again.', zh: '爷爷听一遍，再说一遍。' },
      { art: 'field|grandpa,dad|wheat|★', en: 'Now "wheat" sounds right.', zh: '这下「wheat」说对了。' },
      { art: 'field|grandpa,dad|wheat|?', en: 'A word changes a little inside a sentence.', zh: '词放进句子里，声音会有点变。' },
      { art: 'field|grandpa,dad|wheat|?', en: 'One word at a time is not how a sentence goes.', zh: '句子不是一个词一个词蹦出来的。' },
      { art: 'field|grandpa,dad|wheat|…', en: 'Listening first made saying easier.', zh: '先听，再说就顺了。' },
      { art: 'field|grandpa,dad|wheat|♥', en: 'Grandpa says it once more, all alone. We say the words again: wheel and world.', zh: '爷爷又自己说了一遍。我们把这两个词再说一遍：轮子和世界。' },
      { art: 'field|grandpa,dad|wheat|·', en: 'They point at a kite and start again. By the end of the page, the word felt easy.', zh: '他们指着风筝，又从头来。读到这一页末尾，那个词已经不难了。' }
    ],
    quiz: [
      { q: '爷爷和爸爸的这一本里，出现了下面哪一样？', opts: ['盘子', '小麦', '云'], a: 1, kind: 'recall' },
      { q: '为什么爷爷第一遍说得不太对？', opts: ['因为不认识这个词', '把一个词一个词分开念，没听整句', '因为说得太快'], a: 1, kind: 'infer' },
      { q: '遇到像「wheat」这样会说但说不顺的英文词，你会怎么做？', opts: ['把这个词跳过去', '先听整句，再跟着把整句说一遍', '只看中文意思'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b101', lv: 'L9', tag: '工具', title: 'A Knife and a Wheel', zh: '刀和轮子',
    emoji: '⚙️', color: '#E0CFF3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「找回来」这条线，认读 3 个新词。',
    trap: 'kn / wr / ph 里的第一个字母不发音；读长句时先找主句，再读从句。',
    summary: '《刀和轮子》是「找回来」：妈妈和明明在家，围绕刀把一件事读到底。本本词卡：刀、村子、行动。读前先看词卡，读完合上书说一说。',
    retell: '像小讲解员一样，把「现象 → 猜想 → 验证 → 结论」讲清楚。（这一本是「找回来」。）',
    think: '说一说你有没有把东西放忘了的时候：先说在哪儿丢的，再说最后在哪儿找到。',
    pre: [
      { art: '🔪', en: 'knife', zh: '刀' },
      { art: '🏘️', en: 'village', zh: '村子' },
      { art: '📦', en: 'action', zh: '行动' },
      { art: '📦', en: 'they', zh: 'they' },
      { art: '📦', en: 'the', zh: 'the' }
    ],
    sight: [],
    newWords: [
      { w: 'knife', zh: '刀' },
      { w: 'village', zh: '村子' },
      { w: 'action', zh: '行动' }
    ],
    pages: [
      { art: 'home|mom,ming|knife|·', en: 'Mom and Ming are at home.', zh: '妈妈和明明在家。' },
      { art: 'home|mom,ming|knife|♪', en: 'Mom wants a knife.', zh: '妈妈想要刀。' },
      { art: 'home|mom,ming|knife|👀', en: 'They look at the flag and the bin. They wrote three words on the board: knife, village and action.', zh: '他们看看旗子和垃圾桶。他们在黑板上写下三个词：刀、村子和行动。' },
      { art: 'home|mom,ming|knife|?', en: '"Where is my knife?" asks Mom.', zh: '「我的刀呢？」妈妈问。' },
      { art: 'home|mom,ming|knife|·', en: 'They look here, and they look there.', zh: '他们这儿看看，那儿看看。' },
      { art: 'home|mom,ming|knife|!', en: 'No knife. Not here, not there.', zh: '没有刀。这儿没有，那儿也没有。' },
      { art: 'home|mom,ming|flag|♥', en: 'Ming says, "Let us go back and look again."', zh: '明明说：「我们回去再找一遍。」' },
      { art: 'home|mom,ming|flag|·', en: 'So they go back and look more slowly.', zh: '于是他们回去，看得慢一些。' },
      { art: 'home|mom,ming|knife|★', en: 'There it is! The knife was at home all along.', zh: '在那儿！刀一直在家。' },
      { art: 'home|mom,ming|knife|?', en: 'They had been in a hurry the first time.', zh: '第一遍太着急了。' },
      { art: 'home|mom,ming|knife|?', en: 'A quick look and a careful look are not the same.', zh: '匆匆一看和仔细一看，不是一回事。' },
      { art: 'home|mom,ming|knife|…', en: 'The best place to look is often where you started.', zh: '最容易漏掉的，常常是最开始的地方。' },
      { art: 'home|mom,ming|knife|♥', en: 'Mom is glad. Ming is glad too. We say the words again: knife and village.', zh: '妈妈很高兴，明明也很高兴。我们把这两个词再说一遍：刀和村子。' },
      { art: 'home|mom,ming|knife|·', en: 'They put the knife back where it belongs. From then on, they looked twice before they gave up.', zh: '他们把刀放回原处。从那以后，他们会再看一遍才放弃。' }
    ],
    quiz: [
      { q: '在家读的这一本里，有下面哪一样？', opts: ['狗', '硬币', '村子'], a: 2, kind: 'recall' },
      { q: '为什么第一遍没找到刀？', opts: ['因为刀不见了', '因为天黑了', '看得太快，漏掉了最开始的地方'], a: 2, kind: 'infer' },
      { q: '如果你的刀找不到了，你会先做什么？', opts: ['先回到最开始的地方慢慢找一遍', '马上再买一个新的', '不找了，直接走开'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b102', lv: 'L9', tag: '提问', title: 'The Scientist and an Answer', zh: '科学家的答案',
    emoji: '🔬', color: '#F6C9E3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「合上书讲一遍」这条线，认读 3 个新词。',
    trap: 'kn / wr / ph 里的第一个字母不发音；读长句时先找主句，再读从句。',
    summary: '《科学家的答案》是「合上书讲一遍」：爸爸和丽丽在教室，围绕回答把一件事读到底。本本词卡：楼梯、空气、泥土。读前先看词卡，读完合上书说一说。',
    retell: '像小讲解员一样，把「现象 → 猜想 → 验证 → 结论」讲清楚。（这一本是「合上书讲一遍」。）',
    think: '合上书，用「谁 → 在哪儿 → 出了什么事 → 结果」把回答这一本讲给家长听。',
    pre: [
      { art: '🪜', en: 'stair', zh: '楼梯' },
      { art: '🌿', en: 'air', zh: '空气' },
      { art: '📦', en: 'earth', zh: '泥土' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👨', en: 'dad', zh: '爸爸' }
    ],
    sight: [],
    newWords: [
      { w: 'stair', zh: '楼梯' },
      { w: 'air', zh: '空气' },
      { w: 'earth', zh: '泥土' }
    ],
    pages: [
      { art: 'classroom|dad,lili|answer|·', en: 'Dad has just finished a book in the classroom.', zh: '爸爸刚在教室读完一本书。' },
      { art: 'classroom|dad,lili|answer|♪', en: 'Lili wants to hear all about it.', zh: '丽丽想听他讲讲。' },
      { art: 'classroom|dad,lili|answer|👀', en: 'Dad thinks about the answer in the book. They wrote three words on the board: stair, air and earth.', zh: '爸爸想着书里的回答。他们在黑板上写下三个词：楼梯、空气和泥土。' },
      { art: 'classroom|dad,lili|answer|?', en: '"Where do I start?" asks Dad.', zh: '「从哪儿讲起？」爸爸问。' },
      { art: 'classroom|dad,lili|answer|·', en: 'Dad tells the last part first.', zh: '爸爸先讲了结尾。' },
      { art: 'classroom|dad,lili|answer|!', en: 'Lili cannot follow the story.', zh: '丽丽听不明白。' },
      { art: 'classroom|dad,lili|bag|♥', en: 'Lili says, "Tell me who, where, then what."', zh: '丽丽说：「先说谁、在哪儿、再说出什么事。」' },
      { art: 'classroom|dad,lili|bag|·', en: 'Dad starts again, in order.', zh: '爸爸按顺序重新讲。' },
      { art: 'classroom|dad,lili|answer|★', en: 'This time Lili can see the whole thing.', zh: '这回丽丽全听明白了。' },
      { art: 'classroom|dad,lili|answer|?', en: 'A story needs its order to make sense.', zh: '故事要靠顺序才讲得通。' },
      { art: 'classroom|dad,lili|answer|?', en: 'Remembering is not the same as telling.', zh: '记住，和讲出来不是一回事。' },
      { art: 'classroom|dad,lili|answer|…', en: 'If you can tell it, you have read it.', zh: '讲得出来，才算真的读过。' },
      { art: 'classroom|dad,lili|answer|♥', en: 'Dad closes the book and tells it again. We say the words again: stair and air.', zh: '爸爸合上书，又讲了一遍。我们把这两个词再说一遍：楼梯和空气。' },
      { art: 'classroom|dad,lili|answer|·', en: 'Tomorrow they will read about a bag. They could still tell it the next morning.', zh: '明天他们要读讲书包的书。第二天早上，他们还能讲得出来。' }
    ],
    quiz: [
      { q: '这一本里，爸爸看到了下面哪一样？', opts: ['图画', '书包', '花'], a: 1, kind: 'recall' },
      { q: '为什么丽丽第一遍没听明白？', opts: ['因为讲得太慢', '因为故事太短', '先讲了结尾，顺序乱了'], a: 2, kind: 'infer' },
      { q: '要把讲回答的这本读过的书讲给别人听，你会怎么开头？', opts: ['先报书名和生词表', '先说谁、在哪儿，再按顺序说出了什么事', '直接从最精彩的那句开始'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b103', lv: 'L9', tag: '参观', title: 'A Quiet Museum', zh: '安静的博物馆',
    emoji: '🏛️', color: '#BFE6DF',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「比一比」这条线，认读 1 个新词。',
    trap: 'kn / wr / ph 里的第一个字母不发音；读长句时先找主句，再读从句。',
    summary: '《安静的博物馆》是「比一比」：明明和奶奶在博物馆，围绕博物馆把一件事读到底。本本词卡：膝盖。读前先看词卡，读完合上书说一说。',
    retell: '像小讲解员一样，把「现象 → 猜想 → 验证 → 结论」讲清楚。（这一本是「比一比」。）',
    think: '找两样很像的东西，用英文说出至少两处不同，说说你是按什么顺序找的。',
    pre: [
      { art: '🦵', en: 'knee', zh: '膝盖' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'they', zh: 'they' }
    ],
    sight: [],
    newWords: [
      { w: 'knee', zh: '膝盖' }
    ],
    pages: [
      { art: 'museum|ming,grandma|museum|·', en: 'Ming looks at a museum and a station.', zh: '明明看着博物馆和车站。' },
      { art: 'museum|ming,grandma|museum|♪', en: 'They want to know how they are different.', zh: '他们想知道两样有什么不一样。' },
      { art: 'museum|ming,grandma|museum|👀', en: 'At first the two look the same. They wrote three words on the board: knee, king and kite.', zh: '乍一看，两样挺像。他们在黑板上写下三个词：膝盖、国王和风筝。' },
      { art: 'museum|ming,grandma|museum|?', en: '"What is not the same?" asks Grandma.', zh: '「哪里不一样？」奶奶问。' },
      { art: 'museum|ming,grandma|museum|·', en: 'They put them side by side.', zh: '他们把两样并排放。' },
      { art: 'museum|ming,grandma|museum|!', en: 'Looking from far away does not help.', zh: '远远地看，还是看不出。' },
      { art: 'museum|ming,grandma|station|♥', en: 'Grandma says, "Look at one part at a time."', zh: '奶奶说：「一处一处分开看。」' },
      { art: 'museum|ming,grandma|station|·', en: 'They check one part, then another.', zh: '他们先看一处，再看另一处。' },
      { art: 'museum|ming,grandma|museum|★', en: 'There! One small part is different.', zh: '有了！有一处小小的不同。' },
      { art: 'museum|ming,grandma|museum|?', en: 'The difference was small, not missing.', zh: '差别很小，不是没有。' },
      { art: 'museum|ming,grandma|museum|?', en: 'Same and almost the same are not the same.', zh: '「一样」和「差不多一样」不是一回事。' },
      { art: 'museum|ming,grandma|museum|…', en: 'Comparing needs a plan, not just a look.', zh: '比一比要有章法，不能光瞄一眼。' },
      { art: 'museum|ming,grandma|museum|♥', en: 'They tell Ming what they found. We say the words again: knee and king.', zh: '他们把自己发现的讲给明明听。我们把这两个词再说一遍：膝盖和国王。' },
      { art: 'museum|ming,grandma|museum|·', en: 'Next they will compare the station and the lake. They made a list of all the small differences.', zh: '接着他们要比一比车站和湖。他们把所有细小的不同都列了下来。' }
    ],
    quiz: [
      { q: '明明和奶奶的这一本里，出现了下面哪一样？', opts: ['狐狸', '国王', '泥土'], a: 1, kind: 'recall' },
      { q: '博物馆和车站一开始为什么看着一样？', opts: ['只远远看了一眼，没一处一处分开比', '因为光线太暗', '因为它们真的完全相同'], a: 0, kind: 'infer' },
      { q: '要找出像博物馆和车站这样很像的两样东西哪里不同，你会怎么做？', opts: ['并排放好，一处一处分开看', '隔很远扫一眼', '只挑一个看'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b104', lv: 'L9', tag: '方法', title: 'Write It Down', zh: '把它记下来',
    emoji: '✏️', color: '#F2E2A8',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「合上书讲一遍」这条线，不引入新词，全部是读过的词。',
    trap: 'kn / wr / ph 里的第一个字母不发音；读长句时先找主句，再读从句。',
    summary: '《把它记下来》是「合上书讲一遍」：丽丽和爷爷在教室，围绕木板把一件事读到底。本本词卡：这一本不引入新词，全部是读过的词。读前先看词卡，读完合上书说一说。',
    retell: '像小讲解员一样，把「现象 → 猜想 → 验证 → 结论」讲清楚。（这一本是「合上书讲一遍」。）',
    think: '合上书，用「谁 → 在哪儿 → 出了什么事 → 结果」把木板这一本讲给家长听。',
    pre: [
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👧', en: 'lili', zh: '丽丽' }
    ],
    sight: [],
    newWords: [

    ],
    pages: [
      { art: 'classroom|lili,grandpa|board|·', en: 'Lili has just finished a book in the classroom.', zh: '丽丽刚在教室读完一本书。' },
      { art: 'classroom|lili,grandpa|board|♪', en: 'Grandpa wants to hear all about it.', zh: '爷爷想听他讲讲。' },
      { art: 'classroom|lili,grandpa|board|👀', en: 'Lili thinks about the board in the book. They wrote three words on the board: kite, knee and knife.', zh: '丽丽想着书里的木板。他们在黑板上写下三个词：风筝、膝盖和刀。' },
      { art: 'classroom|lili,grandpa|board|?', en: '"Where do I start?" asks Lili.', zh: '「从哪儿讲起？」丽丽问。' },
      { art: 'classroom|lili,grandpa|board|·', en: 'Lili tells the last part first.', zh: '丽丽先讲了结尾。' },
      { art: 'classroom|lili,grandpa|board|!', en: 'Grandpa cannot follow the story.', zh: '爷爷听不明白。' },
      { art: 'classroom|lili,grandpa|knife|♥', en: 'Grandpa says, "Tell me who, where, then what."', zh: '爷爷说：「先说谁、在哪儿、再说出什么事。」' },
      { art: 'classroom|lili,grandpa|knife|·', en: 'Lili starts again, in order.', zh: '丽丽按顺序重新讲。' },
      { art: 'classroom|lili,grandpa|board|★', en: 'This time Grandpa can see the whole thing.', zh: '这回爷爷全听明白了。' },
      { art: 'classroom|lili,grandpa|board|?', en: 'A story needs its order to make sense.', zh: '故事要靠顺序才讲得通。' },
      { art: 'classroom|lili,grandpa|board|?', en: 'Remembering is not the same as telling.', zh: '记住，和讲出来不是一回事。' },
      { art: 'classroom|lili,grandpa|board|…', en: 'If you can tell it, you have read it.', zh: '讲得出来，才算真的读过。' },
      { art: 'classroom|lili,grandpa|board|♥', en: 'Lili closes the book and tells it again. We say the words again: kite and knee.', zh: '丽丽合上书，又讲了一遍。我们把这两个词再说一遍：风筝和膝盖。' },
      { art: 'classroom|lili,grandpa|board|·', en: 'Tomorrow they will read about a knife. They could still tell it the next morning.', zh: '明天他们要读讲刀的书。第二天早上，他们还能讲得出来。' }
    ],
    quiz: [
      { q: '在教室读的这一本里，有下面哪一样？', opts: ['扇子', '花园', '膝盖'], a: 2, kind: 'recall' },
      { q: '为什么爷爷第一遍没听明白？', opts: ['先讲了结尾，顺序乱了', '因为讲得太慢', '因为故事太短'], a: 0, kind: 'infer' },
      { q: '要把讲木板的这本读过的书讲给别人听，你会怎么开头？', opts: ['直接从最精彩的那句开始', '先报书名和生词表', '先说谁、在哪儿，再按顺序说出了什么事'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b105', lv: 'L9', tag: '发音', title: 'Say It: Knee, Write', zh: '说一说：knee write',
    emoji: '🗣️', color: '#D9D2F5',
    track: 'drill',
    goal: '把本级难点音听准、说准，并能在整句里读对。这一本走「问一问」这条线，不引入新词，全部是读过的词。',
    trap: 'kn / wr / ph 里的第一个字母不发音；读长句时先找主句，再读从句。',
    summary: '《说一说：knee write》是「问一问」：奶奶和妈妈在家，围绕膝盖把一件事读到底。本本词卡：这一本不引入新词，全部是读过的词。读前先看词卡，读完合上书说一说。',
    retell: '像小讲解员一样，把「现象 → 猜想 → 验证 → 结论」讲清楚。（这一本是「问一问」。）',
    think: '回想一次「问了还是没懂」：把当时的问题改成一个更小的、指着某个词的问题。',
    pre: [
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👵', en: 'grandma', zh: '奶奶' }
    ],
    sight: [],
    newWords: [

    ],
    pages: [
      { art: 'home|grandma,mom|knee|·', en: 'Grandma is reading the word "knee" at home.', zh: '奶奶在家读「knee」这个词。' },
      { art: 'home|grandma,mom|knee|♪', en: 'Grandma wants to understand it.', zh: '奶奶想把它弄明白。' },
      { art: 'home|grandma,mom|knee|👀', en: 'One sentence does not make sense. They wrote three words on the board: knee, knife and lake.', zh: '有一句怎么也读不通。他们在黑板上写下三个词：膝盖、刀和湖。' },
      { art: 'home|grandma,mom|knee|?', en: '"What does this part mean?" asks Grandma.', zh: '「这一段什么意思？」奶奶问。' },
      { art: 'home|grandma,mom|knee|·', en: 'Mom answers, but Grandma still looks lost.', zh: '妈妈答了，奶奶还是没懂。' },
      { art: 'home|grandma,mom|knee|!', en: 'The answer was right, but not the right answer.', zh: '答案没错，却不是问的那个。' },
      { art: 'home|grandma,mom|gift|♥', en: 'Mom asks, "Which word is the hard one?"', zh: '妈妈反问：「难的是哪个词？」' },
      { art: 'home|grandma,mom|gift|·', en: 'Grandma points to one word and asks again.', zh: '奶奶指着一个词，又问了一遍。' },
      { art: 'home|grandma,mom|knee|★', en: 'Now the whole sentence is clear.', zh: '这下整句都清楚了。' },
      { art: 'home|grandma,mom|knee|?', en: 'The real question had been a smaller one.', zh: '真正该问的，是个更小的问题。' },
      { art: 'home|grandma,mom|knee|?', en: 'A clear question is half of an answer.', zh: '问得清楚，答案就有了一半。' },
      { art: 'home|grandma,mom|knee|…', en: 'Asking again is not the same as not listening.', zh: '再问一遍，不等于没在听。' },
      { art: 'home|grandma,mom|knee|♥', en: 'Grandma says the sentence out loud. We say the words again: knee and knife.', zh: '奶奶把这句大声念了出来。我们把这两个词再说一遍：膝盖和刀。' },
      { art: 'home|grandma,mom|knee|·', en: 'They write down one new question. The smaller question stayed with them.', zh: '他们又写下一个新问题。那个更小的问题，他们一直记着。' }
    ],
    quiz: [
      { q: '这一本里，奶奶看到了下面哪一样？', opts: ['山羊', '鱼', '膝盖'], a: 2, kind: 'recall' },
      { q: '奶奶第一次为什么没听懂「knee」？', opts: ['因为答案太短', '因为读得太快', '问题太大，没指向真正卡住的那个词'], a: 2, kind: 'infer' },
      { q: '别人把「knee」解释完你还是没懂，你会怎么做？', opts: ['点点头装作懂了', '指出具体哪个词不懂，再问一遍', '把整段跳过去'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b106', lv: 'L9', tag: '小知识', title: 'Why Seasons Change', zh: '季节为什么变',
    emoji: '🍂', color: '#FAD3B6',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。这一本走「问一问」这条线，认读 1 个新词。',
    trap: 'kn / wr / ph 里的第一个字母不发音；读长句时先找主句，再读从句。',
    summary: '《季节为什么变》是「问一问」：爷爷和爸爸在田地，围绕季节把一件事读到底。本本词卡：季节。读前先看词卡，读完合上书说一说。',
    retell: '像小讲解员一样，把「现象 → 猜想 → 验证 → 结论」讲清楚。（这一本是「问一问」。）',
    think: '回想一次「问了还是没懂」：把当时的问题改成一个更小的、指着某个词的问题。',
    pre: [
      { art: '🍂', en: 'season', zh: '季节' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👴', en: 'grandpa', zh: '爷爷' }
    ],
    sight: ['field'],
    newWords: [
      { w: 'season', zh: '季节' }
    ],
    pages: [
      { art: 'field|grandpa,dad|season|·', en: 'Grandpa is reading the word "season" in the field.', zh: '爷爷在田地读「season」这个词。' },
      { art: 'field|grandpa,dad|season|♪', en: 'Grandpa wants to understand it.', zh: '爷爷想把它弄明白。' },
      { art: 'field|grandpa,dad|season|👀', en: 'One sentence does not make sense. They wrote three words on the board: season, lake and leaf.', zh: '有一句怎么也读不通。他们在黑板上写下三个词：季节、湖和叶子。' },
      { art: 'field|grandpa,dad|season|?', en: '"What does this part mean?" asks Grandpa.', zh: '「这一段什么意思？」爷爷问。' },
      { art: 'field|grandpa,dad|season|·', en: 'Dad answers, but Grandpa still looks lost.', zh: '爸爸答了，爷爷还是没懂。' },
      { art: 'field|grandpa,dad|season|!', en: 'The answer was right, but not the right answer.', zh: '答案没错，却不是问的那个。' },
      { art: 'field|grandpa,dad|bag|♥', en: 'Dad asks, "Which word is the hard one?"', zh: '爸爸反问：「难的是哪个词？」' },
      { art: 'field|grandpa,dad|bag|·', en: 'Grandpa points to one word and asks again.', zh: '爷爷指着一个词，又问了一遍。' },
      { art: 'field|grandpa,dad|season|★', en: 'Now the whole sentence is clear.', zh: '这下整句都清楚了。' },
      { art: 'field|grandpa,dad|season|?', en: 'The real question had been a smaller one.', zh: '真正该问的，是个更小的问题。' },
      { art: 'field|grandpa,dad|season|?', en: 'A clear question is half of an answer.', zh: '问得清楚，答案就有了一半。' },
      { art: 'field|grandpa,dad|season|…', en: 'Asking again is not the same as not listening.', zh: '再问一遍，不等于没在听。' },
      { art: 'field|grandpa,dad|season|♥', en: 'Grandpa says the sentence out loud. We say the words again: season and lake.', zh: '爷爷把这句大声念了出来。我们把这两个词再说一遍：季节和湖。' },
      { art: 'field|grandpa,dad|season|·', en: 'They write down one new question. The smaller question stayed with them.', zh: '他们又写下一个新问题。那个更小的问题，他们一直记着。' }
    ],
    quiz: [
      { q: '爷爷和爸爸的这一本里，出现了下面哪一样？', opts: ['朋友', '木板', '地面'], a: 1, kind: 'recall' },
      { q: '爷爷第一次为什么没听懂「season」？', opts: ['因为读得太快', '问题太大，没指向真正卡住的那个词', '因为答案太短'], a: 1, kind: 'infer' },
      { q: '别人把「season」解释完你还是没懂，你会怎么做？', opts: ['指出具体哪个词不懂，再问一遍', '把整段跳过去', '点点头装作懂了'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b107', lv: 'L9', tag: '小知识', title: 'How We Measure Rain', zh: '我们怎么量雨',
    emoji: '🌧️', color: '#C8E7F0',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。这一本走「合上书讲一遍」这条线，不引入新词，全部是读过的词。',
    trap: 'kn / wr / ph 里的第一个字母不发音；读长句时先找主句，再读从句。',
    summary: '《我们怎么量雨》是「合上书讲一遍」：妈妈和明明在公园，围绕雨把一件事读到底。本本词卡：这一本不引入新词，全部是读过的词。读前先看词卡，读完合上书说一说。',
    retell: '像小讲解员一样，把「现象 → 猜想 → 验证 → 结论」讲清楚。（这一本是「合上书讲一遍」。）',
    think: '合上书，用「谁 → 在哪儿 → 出了什么事 → 结果」把雨这一本讲给家长听。',
    pre: [
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👩', en: 'mom', zh: '妈妈' }
    ],
    sight: [],
    newWords: [

    ],
    pages: [
      { art: 'park|mom,ming|rain|·', en: 'Mom has just finished a book in the park.', zh: '妈妈刚在公园读完一本书。' },
      { art: 'park|mom,ming|rain|♪', en: 'Ming wants to hear all about it.', zh: '明明想听他讲讲。' },
      { art: 'park|mom,ming|rain|👀', en: 'Mom thinks about the rain in the book. They wrote three words on the board: lake, leaf and leg.', zh: '妈妈想着书里的雨。他们在黑板上写下三个词：湖、叶子和腿。' },
      { art: 'park|mom,ming|rain|?', en: '"Where do I start?" asks Mom.', zh: '「从哪儿讲起？」妈妈问。' },
      { art: 'park|mom,ming|rain|·', en: 'Mom tells the last part first.', zh: '妈妈先讲了结尾。' },
      { art: 'park|mom,ming|rain|!', en: 'Ming cannot follow the story.', zh: '明明听不明白。' },
      { art: 'park|mom,ming|sand|♥', en: 'Ming says, "Tell me who, where, then what."', zh: '明明说：「先说谁、在哪儿、再说出什么事。」' },
      { art: 'park|mom,ming|sand|·', en: 'Mom starts again, in order.', zh: '妈妈按顺序重新讲。' },
      { art: 'park|mom,ming|rain|★', en: 'This time Ming can see the whole thing.', zh: '这回明明全听明白了。' },
      { art: 'park|mom,ming|rain|?', en: 'A story needs its order to make sense.', zh: '故事要靠顺序才讲得通。' },
      { art: 'park|mom,ming|rain|?', en: 'Remembering is not the same as telling.', zh: '记住，和讲出来不是一回事。' },
      { art: 'park|mom,ming|rain|…', en: 'If you can tell it, you have read it.', zh: '讲得出来，才算真的读过。' },
      { art: 'park|mom,ming|rain|♥', en: 'Mom closes the book and tells it again. We say the words again: lake and leaf.', zh: '妈妈合上书，又讲了一遍。我们把这两个词再说一遍：湖和叶子。' },
      { art: 'park|mom,ming|rain|·', en: 'Tomorrow they will read about some sand. They could still tell it the next morning.', zh: '明天他们要读讲沙子的书。第二天早上，他们还能讲得出来。' }
    ],
    quiz: [
      { q: '在公园读的这一本里，有下面哪一样？', opts: ['火腿', '膝盖', '雨'], a: 2, kind: 'recall' },
      { q: '为什么明明第一遍没听明白？', opts: ['先讲了结尾，顺序乱了', '因为讲得太慢', '因为故事太短'], a: 0, kind: 'infer' },
      { q: '要把讲雨的这本读过的书讲给别人听，你会怎么开头？', opts: ['先说谁、在哪儿，再按顺序说出了什么事', '直接从最精彩的那句开始', '先报书名和生词表'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b108', lv: 'L9', tag: '复习', title: 'The Whole Story', zh: '整个故事',
    emoji: '📚', color: '#E8D9B5',
    track: 'review',
    goal: '把本级和前面级别的词再读一遍、串成一个故事。这一本走「比一比」这条线，不引入新词，全部是读过的词。',
    trap: 'kn / wr / ph 里的第一个字母不发音；读长句时先找主句，再读从句。',
    summary: '《整个故事》是「比一比」：爸爸和丽丽在图书馆，围绕故事把一件事读到底。本本词卡：这一本不引入新词，全部是读过的词。读前先看词卡，读完合上书说一说。',
    retell: '像小讲解员一样，把「现象 → 猜想 → 验证 → 结论」讲清楚。（这一本是「比一比」。）',
    think: '找两样很像的东西，用英文说出至少两处不同，说说你是按什么顺序找的。',
    pre: [
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'they', zh: 'they' }
    ],
    sight: [],
    newWords: [

    ],
    pages: [
      { art: 'library|dad,lili|story|·', en: 'Dad looks at a story and a kite.', zh: '爸爸看着故事和风筝。' },
      { art: 'library|dad,lili|story|♪', en: 'They want to know how they are different.', zh: '他们想知道两样有什么不一样。' },
      { art: 'library|dad,lili|story|👀', en: 'At first the two look the same. They wrote three words on the board: leaf, leg and letter.', zh: '乍一看，两样挺像。他们在黑板上写下三个词：叶子、腿和信。' },
      { art: 'library|dad,lili|story|?', en: '"What is not the same?" asks Lili.', zh: '「哪里不一样？」丽丽问。' },
      { art: 'library|dad,lili|story|·', en: 'They put them side by side.', zh: '他们把两样并排放。' },
      { art: 'library|dad,lili|story|!', en: 'Looking from far away does not help.', zh: '远远地看，还是看不出。' },
      { art: 'library|dad,lili|kite|♥', en: 'Lili says, "Look at one part at a time."', zh: '丽丽说：「一处一处分开看。」' },
      { art: 'library|dad,lili|kite|·', en: 'They check one part, then another.', zh: '他们先看一处，再看另一处。' },
      { art: 'library|dad,lili|story|★', en: 'There! One small part is different.', zh: '有了！有一处小小的不同。' },
      { art: 'library|dad,lili|story|?', en: 'The difference was small, not missing.', zh: '差别很小，不是没有。' },
      { art: 'library|dad,lili|story|?', en: 'Same and almost the same are not the same.', zh: '「一样」和「差不多一样」不是一回事。' },
      { art: 'library|dad,lili|story|…', en: 'Comparing needs a plan, not just a look.', zh: '比一比要有章法，不能光瞄一眼。' },
      { art: 'library|dad,lili|story|♥', en: 'They tell Dad what they found. We say the words again: leaf and leg.', zh: '他们把自己发现的讲给爸爸听。我们把这两个词再说一遍：叶子和腿。' },
      { art: 'library|dad,lili|story|·', en: 'Next they will compare the kite and the picture. They made a list of all the small differences.', zh: '接着他们要比一比风筝和图画。他们把所有细小的不同都列了下来。' }
    ],
    quiz: [
      { q: '这一本里，爸爸看到了下面哪一样？', opts: ['盖子', '母鸡', '图画'], a: 2, kind: 'recall' },
      { q: '故事和风筝一开始为什么看着一样？', opts: ['因为它们真的完全相同', '只远远看了一眼，没一处一处分开比', '因为光线太暗'], a: 1, kind: 'infer' },
      { q: '要找出像故事和风筝这样很像的两样东西哪里不同，你会怎么做？', opts: ['隔很远扫一眼', '只挑一个看', '并排放好，一处一处分开看'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b109', lv: 'L10', tag: '思考', title: 'A Better Question', zh: '更好的问题',
    emoji: '❓', color: '#F6C6C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「问一问」这条线，认读 3 个新词。',
    trap: '桥梁书按自然段读：一句里先找「谁 + 做什么」，再把修饰部分补进去。',
    summary: '《更好的问题》是「问一问」：明明和奶奶在图书馆，围绕主意把一件事读到底。本本词卡：原因、陌生人、突然。读前先看词卡，读完合上书说一说。',
    retell: '不看书写一段 5 句的口头小结，再说说你同不同意。（这一本是「问一问」。）',
    think: '回想一次「问了还是没懂」：把当时的问题改成一个更小的、指着某个词的问题。',
    pre: [
      { art: '🧩', en: 'reason', zh: '原因' },
      { art: '🧑', en: 'stranger', zh: '陌生人' },
      { art: '✨', en: 'sudden', zh: '突然' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👦', en: 'ming', zh: '明明' }
    ],
    sight: [],
    newWords: [
      { w: 'reason', zh: '原因' },
      { w: 'stranger', zh: '陌生人' },
      { w: 'sudden', zh: '突然' }
    ],
    pages: [
      { art: 'library|ming,grandma|idea|·', en: 'Ming is reading the word "idea" in the library.', zh: '明明在图书馆读「idea」这个词。' },
      { art: 'library|ming,grandma|idea|♪', en: 'Ming wants to understand it.', zh: '明明想把它弄明白。' },
      { art: 'library|ming,grandma|idea|👀', en: 'One sentence does not make sense. Three words mattered that day: reason, stranger and sudden.', zh: '有一句怎么也读不通。那天有三个词很要紧：原因、陌生人和突然。' },
      { art: 'library|ming,grandma|idea|?', en: '"What does this part mean?" asks Ming.', zh: '「这一段什么意思？」明明问。' },
      { art: 'library|ming,grandma|idea|·', en: 'Grandma answers, but Ming still looks lost.', zh: '奶奶答了，明明还是没懂。' },
      { art: 'library|ming,grandma|idea|!', en: 'The answer was right, but not the right answer.', zh: '答案没错，却不是问的那个。' },
      { art: 'library|ming,grandma|cap|♥', en: 'Grandma asks, "Which word is the hard one?"', zh: '奶奶反问：「难的是哪个词？」' },
      { art: 'library|ming,grandma|cap|·', en: 'Ming points to one word and asks again.', zh: '明明指着一个词，又问了一遍。' },
      { art: 'library|ming,grandma|idea|★', en: 'Now the whole sentence is clear.', zh: '这下整句都清楚了。' },
      { art: 'library|ming,grandma|idea|?', en: 'The real question had been a smaller one.', zh: '真正该问的，是个更小的问题。' },
      { art: 'library|ming,grandma|idea|?', en: 'A clear question is half of an answer.', zh: '问得清楚，答案就有了一半。' },
      { art: 'library|ming,grandma|idea|…', en: 'Asking again is not the same as not listening.', zh: '再问一遍，不等于没在听。' },
      { art: 'library|ming,grandma|idea|…', en: 'Finding the hard word was the real work.', zh: '找出那个难词，才是真本事。' },
      { art: 'library|ming,grandma|idea|♥', en: 'Ming says the sentence out loud. We say the words again: reason and stranger.', zh: '明明把这句大声念了出来。我们把这两个词再说一遍：原因和陌生人。' },
      { art: 'library|ming,grandma|idea|·', en: 'They write down one new question. The smaller question stayed with them.', zh: '他们又写下一个新问题。那个更小的问题，他们一直记着。' }
    ],
    quiz: [
      { q: '明明和奶奶的这一本里，出现了下面哪一样？', opts: ['脸', '图书馆', '青蛙'], a: 1, kind: 'recall' },
      { q: '明明第一次为什么没听懂「idea」？', opts: ['因为答案太短', '问题太大，没指向真正卡住的那个词', '因为读得太快'], a: 1, kind: 'infer' },
      { q: '别人把「idea」解释完你还是没懂，你会怎么做？', opts: ['把整段跳过去', '指出具体哪个词不懂，再问一遍', '点点头装作懂了'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b110', lv: 'L10', tag: '观察', title: 'The Small Change', zh: '小小的变化',
    emoji: '🔍', color: '#F9DFB4',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「跟读整句」这条线，认读 3 个新词。',
    trap: '桥梁书按自然段读：一句里先找「谁 + 做什么」，再把修饰部分补进去。',
    summary: '《小小的变化》是「跟读整句」：丽丽和爷爷在田地，围绕变化把一件事读到底。本本词卡：国家、勇气、困难。读前先看词卡，读完合上书说一说。',
    retell: '不看书写一段 5 句的口头小结，再说说你同不同意。（这一本是「跟读整句」。）',
    think: '挑书里最长的一句英文，先听整句，再分成两段读给家长听。',
    pre: [
      { art: '📍', en: 'country', zh: '国家' },
      { art: '🦁', en: 'courage', zh: '勇气' },
      { art: '✨', en: 'difficult', zh: '困难' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👧', en: 'lili', zh: '丽丽' }
    ],
    sight: ['field'],
    newWords: [
      { w: 'country', zh: '国家' },
      { w: 'courage', zh: '勇气' },
      { w: 'difficult', zh: '困难' }
    ],
    pages: [
      { art: 'field|lili,grandpa|change|·', en: 'Lili opens a book in the field.', zh: '丽丽在田地翻开一本书。' },
      { art: 'field|lili,grandpa|change|♪', en: 'Lili wants to read it out loud.', zh: '丽丽想把它读出来。' },
      { art: 'field|lili,grandpa|change|👀', en: 'The sentence with the word "change" is long. Three words mattered that day: country, courage and difficult.', zh: '带着「change」这个词的那一句很长。那天有三个词很要紧：国家、勇气和困难。' },
      { art: 'field|lili,grandpa|change|?', en: '"Where do I stop for breath?" asks Lili.', zh: '「在哪里换气？」丽丽问。' },
      { art: 'field|lili,grandpa|change|·', en: 'Lili reads it one word at a time.', zh: '丽丽一个词一个词地读。' },
      { art: 'field|lili,grandpa|change|!', en: 'It sounds broken, not like a sentence.', zh: '听着是碎的，不像一句话。' },
      { art: 'field|lili,grandpa|map|♥', en: 'Grandpa plays the whole sentence.', zh: '爷爷把整句放了一遍。' },
      { art: 'field|lili,grandpa|map|·', en: 'Lili listens, then reads it in two parts.', zh: '丽丽听完，分两段读。' },
      { art: 'field|lili,grandpa|change|★', en: 'Now it sounds like one sentence.', zh: '这下听起来像一整句了。' },
      { art: 'field|lili,grandpa|change|?', en: 'The words belong to groups, not to themselves.', zh: '词是成组的，不是一个一个孤立的。' },
      { art: 'field|lili,grandpa|change|?', en: 'Where you pause changes what you hear.', zh: '停在哪里，会改变听到的意思。' },
      { art: 'field|lili,grandpa|change|…', en: 'Reading is closer to speaking than to spelling.', zh: '读，更接近说，而不是拼。' },
      { art: 'field|lili,grandpa|change|…', en: 'The ear found what the eye had missed.', zh: '耳朵找到了眼睛漏掉的东西。' },
      { art: 'field|lili,grandpa|change|♥', en: 'Lili reads it once more, smiling. We say the words again: country and courage.', zh: '丽丽笑着又读了一遍。我们把这两个词再说一遍：国家和勇气。' },
      { art: 'field|lili,grandpa|change|·', en: 'They try the next sentence about a map. Reading out loud became easier after that.', zh: '他们接着试讲地图的下一句。从那以后，读出声就不那么难了。' }
    ],
    quiz: [
      { q: '在田地读的这一本里，有下面哪一样？', opts: ['帽子', '国家', '大门'], a: 1, kind: 'recall' },
      { q: '丽丽读「change」那一句时，为什么一个词一个词读听起来是碎的？', opts: ['因为词太难', '因为读得太慢', '句子里的词是成组的，不能逐个蹦'], a: 2, kind: 'infer' },
      { q: '遇到像「change」那一句这样很长的英文句子，你会怎么读？', opts: ['先听整句，再按意思分成两三段读', '一个词一个词慢慢拼', '只看中文跳过英文'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b111', lv: 'L10', tag: '习惯', title: 'A Habit Every Day', zh: '每天一个习惯',
    emoji: '📅', color: '#CDE7C6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「合上书讲一遍」这条线，认读 4 个新词。',
    trap: '桥梁书按自然段读：一句里先找「谁 + 做什么」，再把修饰部分补进去。',
    summary: '《每天一个习惯》是「合上书讲一遍」：奶奶和妈妈在家，围绕习惯把一件事读到底。本本词卡：习惯、约定、保护、意识到。读前先看词卡，读完合上书说一说。',
    retell: '不看书写一段 5 句的口头小结，再说说你同不同意。（这一本是「合上书讲一遍」。）',
    think: '合上书，用「谁 → 在哪儿 → 出了什么事 → 结果」把习惯这一本讲给家长听。',
    pre: [
      { art: '📅', en: 'habit', zh: '习惯' },
      { art: '🤝', en: 'promise', zh: '约定' },
      { art: '🏃', en: 'protect', zh: '保护' },
      { art: '🏃', en: 'realize', zh: '意识到' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👵', en: 'grandma', zh: '奶奶' }
    ],
    sight: [],
    newWords: [
      { w: 'habit', zh: '习惯' },
      { w: 'promise', zh: '约定' },
      { w: 'protect', zh: '保护' },
      { w: 'realize', zh: '意识到' }
    ],
    pages: [
      { art: 'home|grandma,mom|habit|·', en: 'Grandma has just finished a book at home.', zh: '奶奶刚在家读完一本书。' },
      { art: 'home|grandma,mom|habit|♪', en: 'Mom wants to hear all about it.', zh: '妈妈想听他讲讲。' },
      { art: 'home|grandma,mom|habit|👀', en: 'Grandma thinks about the habit in the book. Three words mattered that day: promise, protect and realize.', zh: '奶奶想着书里的习惯。那天有三个词很要紧：约定、保护和意识到。' },
      { art: 'home|grandma,mom|habit|?', en: '"Where do I start?" asks Grandma.', zh: '「从哪儿讲起？」奶奶问。' },
      { art: 'home|grandma,mom|habit|·', en: 'Grandma tells the last part first.', zh: '奶奶先讲了结尾。' },
      { art: 'home|grandma,mom|habit|!', en: 'Mom cannot follow the story.', zh: '妈妈听不明白。' },
      { art: 'home|grandma,mom|pot|♥', en: 'Mom says, "Tell me who, where, then what."', zh: '妈妈说：「先说谁、在哪儿、再说出什么事。」' },
      { art: 'home|grandma,mom|pot|·', en: 'Grandma starts again, in order.', zh: '奶奶按顺序重新讲。' },
      { art: 'home|grandma,mom|habit|★', en: 'This time Mom can see the whole thing.', zh: '这回妈妈全听明白了。' },
      { art: 'home|grandma,mom|habit|?', en: 'A story needs its order to make sense.', zh: '故事要靠顺序才讲得通。' },
      { art: 'home|grandma,mom|habit|?', en: 'Remembering is not the same as telling.', zh: '记住，和讲出来不是一回事。' },
      { art: 'home|grandma,mom|habit|…', en: 'If you can tell it, you have read it.', zh: '讲得出来，才算真的读过。' },
      { art: 'home|grandma,mom|habit|…', en: 'The order is the shape of the story.', zh: '顺序就是故事的骨架。' },
      { art: 'home|grandma,mom|habit|♥', en: 'Grandma closes the book and tells it again. We say the words again: promise and protect.', zh: '奶奶合上书，又讲了一遍。我们把这两个词再说一遍：约定和保护。' },
      { art: 'home|grandma,mom|habit|·', en: 'Tomorrow they will read about a pot. They could still tell it the next morning.', zh: '明天他们要读讲锅的书。第二天早上，他们还能讲得出来。' }
    ],
    quiz: [
      { q: '这一本里，奶奶看到了下面哪一样？', opts: ['锅', '大门', '帽子'], a: 0, kind: 'recall' },
      { q: '为什么妈妈第一遍没听明白？', opts: ['因为讲得太慢', '因为故事太短', '先讲了结尾，顺序乱了'], a: 2, kind: 'infer' },
      { q: '要把讲习惯的这本读过的书讲给别人听，你会怎么开头？', opts: ['先报书名和生词表', '直接从最精彩的那句开始', '先说谁、在哪儿，再按顺序说出了什么事'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b112', lv: 'L10', tag: '发现', title: 'What We Discovered', zh: '我们的发现',
    emoji: '💡', color: '#C6DEF6',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「问一问」这条线，认读 3 个新词。',
    trap: '桥梁书按自然段读：一句里先找「谁 + 做什么」，再把修饰部分补进去。',
    summary: '《我们的发现》是「问一问」：爷爷和爸爸在教室，围绕计划把一件事读到底。本本词卡：耐心、有耐心、星球。读前先看词卡，读完合上书说一说。',
    retell: '不看书写一段 5 句的口头小结，再说说你同不同意。（这一本是「问一问」。）',
    think: '回想一次「问了还是没懂」：把当时的问题改成一个更小的、指着某个词的问题。',
    pre: [
      { art: '💡', en: 'patience', zh: '耐心' },
      { art: '✨', en: 'patient', zh: '有耐心' },
      { art: '🌿', en: 'planet', zh: '星球' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👴', en: 'grandpa', zh: '爷爷' }
    ],
    sight: [],
    newWords: [
      { w: 'patience', zh: '耐心' },
      { w: 'patient', zh: '有耐心' },
      { w: 'planet', zh: '星球' }
    ],
    pages: [
      { art: 'classroom|grandpa,dad|plan|·', en: 'Grandpa is reading the word "plan" in the classroom.', zh: '爷爷在教室读「plan」这个词。' },
      { art: 'classroom|grandpa,dad|plan|♪', en: 'Grandpa wants to understand it.', zh: '爷爷想把它弄明白。' },
      { art: 'classroom|grandpa,dad|plan|👀', en: 'One sentence does not make sense. Three words mattered that day: patience, patient and planet.', zh: '有一句怎么也读不通。那天有三个词很要紧：耐心、有耐心和星球。' },
      { art: 'classroom|grandpa,dad|plan|?', en: '"What does this part mean?" asks Grandpa.', zh: '「这一段什么意思？」爷爷问。' },
      { art: 'classroom|grandpa,dad|plan|·', en: 'Dad answers, but Grandpa still looks lost.', zh: '爸爸答了，爷爷还是没懂。' },
      { art: 'classroom|grandpa,dad|plan|!', en: 'The answer was right, but not the right answer.', zh: '答案没错，却不是问的那个。' },
      { art: 'classroom|grandpa,dad|clock|♥', en: 'Dad asks, "Which word is the hard one?"', zh: '爸爸反问：「难的是哪个词？」' },
      { art: 'classroom|grandpa,dad|clock|·', en: 'Grandpa points to one word and asks again.', zh: '爷爷指着一个词，又问了一遍。' },
      { art: 'classroom|grandpa,dad|plan|★', en: 'Now the whole sentence is clear.', zh: '这下整句都清楚了。' },
      { art: 'classroom|grandpa,dad|plan|?', en: 'The real question had been a smaller one.', zh: '真正该问的，是个更小的问题。' },
      { art: 'classroom|grandpa,dad|plan|?', en: 'A clear question is half of an answer.', zh: '问得清楚，答案就有了一半。' },
      { art: 'classroom|grandpa,dad|plan|…', en: 'Asking again is not the same as not listening.', zh: '再问一遍，不等于没在听。' },
      { art: 'classroom|grandpa,dad|plan|…', en: 'Finding the hard word was the real work.', zh: '找出那个难词，才是真本事。' },
      { art: 'classroom|grandpa,dad|plan|♥', en: 'Grandpa says the sentence out loud. We say the words again: patience and patient.', zh: '爷爷把这句大声念了出来。我们把这两个词再说一遍：耐心和有耐心。' },
      { art: 'classroom|grandpa,dad|plan|·', en: 'They write down one new question. The smaller question stayed with them.', zh: '他们又写下一个新问题。那个更小的问题，他们一直记着。' }
    ],
    quiz: [
      { q: '爷爷和爸爸的这一本里，出现了下面哪一样？', opts: ['果酱', '草', '星球'], a: 2, kind: 'recall' },
      { q: '爷爷第一次为什么没听懂「plan」？', opts: ['问题太大，没指向真正卡住的那个词', '因为读得太快', '因为答案太短'], a: 0, kind: 'infer' },
      { q: '别人把「plan」解释完你还是没懂，你会怎么做？', opts: ['点点头装作懂了', '指出具体哪个词不懂，再问一遍', '把整段跳过去'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b113', lv: 'L10', tag: '耐心', title: 'The Patience to Wait', zh: '等待的耐心',
    emoji: '⏳', color: '#E0CFF3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「跟读整句」这条线，认读 3 个新词。',
    trap: '桥梁书按自然段读：一句里先找「谁 + 做什么」，再把修饰部分补进去。',
    summary: '《等待的耐心》是「跟读整句」：妈妈和明明在图书馆，围绕耐心把一件事读到底。本本词卡：问题、建议、队伍。读前先看词卡，读完合上书说一说。',
    retell: '不看书写一段 5 句的口头小结，再说说你同不同意。（这一本是「跟读整句」。）',
    think: '挑书里最长的一句英文，先听整句，再分成两段读给家长听。',
    pre: [
      { art: '🧩', en: 'problem', zh: '问题' },
      { art: '🏃', en: 'suggest', zh: '建议' },
      { art: '🧑', en: 'team', zh: '队伍' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👩', en: 'mom', zh: '妈妈' }
    ],
    sight: ['patience'],
    newWords: [
      { w: 'problem', zh: '问题' },
      { w: 'suggest', zh: '建议' },
      { w: 'team', zh: '队伍' }
    ],
    pages: [
      { art: 'library|mom,ming|patience|·', en: 'Mom opens a book in the library.', zh: '妈妈在图书馆翻开一本书。' },
      { art: 'library|mom,ming|patience|♪', en: 'Mom wants to read it out loud.', zh: '妈妈想把它读出来。' },
      { art: 'library|mom,ming|patience|👀', en: 'The sentence with the word "patience" is long. Three words mattered that day: problem, suggest and team.', zh: '带着「patience」这个词的那一句很长。那天有三个词很要紧：问题、建议和队伍。' },
      { art: 'library|mom,ming|patience|?', en: '"Where do I stop for breath?" asks Mom.', zh: '「在哪里换气？」妈妈问。' },
      { art: 'library|mom,ming|patience|·', en: 'Mom reads it one word at a time.', zh: '妈妈一个词一个词地读。' },
      { art: 'library|mom,ming|patience|!', en: 'It sounds broken, not like a sentence.', zh: '听着是碎的，不像一句话。' },
      { art: 'library|mom,ming|bag|♥', en: 'Ming plays the whole sentence.', zh: '明明把整句放了一遍。' },
      { art: 'library|mom,ming|bag|·', en: 'Mom listens, then reads it in two parts.', zh: '妈妈听完，分两段读。' },
      { art: 'library|mom,ming|patience|★', en: 'Now it sounds like one sentence.', zh: '这下听起来像一整句了。' },
      { art: 'library|mom,ming|patience|?', en: 'The words belong to groups, not to themselves.', zh: '词是成组的，不是一个一个孤立的。' },
      { art: 'library|mom,ming|patience|?', en: 'Where you pause changes what you hear.', zh: '停在哪里，会改变听到的意思。' },
      { art: 'library|mom,ming|patience|…', en: 'Reading is closer to speaking than to spelling.', zh: '读，更接近说，而不是拼。' },
      { art: 'library|mom,ming|patience|…', en: 'The ear found what the eye had missed.', zh: '耳朵找到了眼睛漏掉的东西。' },
      { art: 'library|mom,ming|patience|♥', en: 'Mom reads it once more, smiling. We say the words again: problem and suggest.', zh: '妈妈笑着又读了一遍。我们把这两个词再说一遍：问题和建议。' },
      { art: 'library|mom,ming|patience|·', en: 'They try the next sentence about a bag. Reading out loud became easier after that.', zh: '他们接着试讲书包的下一句。从那以后，读出声就不那么难了。' }
    ],
    quiz: [
      { q: '在图书馆读的这一本里，有下面哪一样？', opts: ['队伍', '房子', '丽丽'], a: 0, kind: 'recall' },
      { q: '妈妈读「patience」那一句时，为什么一个词一个词读听起来是碎的？', opts: ['句子里的词是成组的，不能逐个蹦', '因为读得太慢', '因为词太难'], a: 0, kind: 'infer' },
      { q: '遇到像「patience」那一句这样很长的英文句子，你会怎么读？', opts: ['一个词一个词慢慢拼', '先听整句，再按意思分成两三段读', '只看中文跳过英文'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b114', lv: 'L10', tag: '思考', title: 'Two Sides of a Problem', zh: '问题的两面',
    emoji: '⚖️', color: '#F6C9E3',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「合上书讲一遍」这条线，认读 3 个新词。',
    trap: '桥梁书按自然段读：一句里先找「谁 + 做什么」，再把修饰部分补进去。',
    summary: '《问题的两面》是「合上书讲一遍」：爸爸和丽丽在教室，围绕问题把一件事读到底。本本词卡：发现、能量、忘记。读前先看词卡，读完合上书说一说。',
    retell: '不看书写一段 5 句的口头小结，再说说你同不同意。（这一本是「合上书讲一遍」。）',
    think: '合上书，用「谁 → 在哪儿 → 出了什么事 → 结果」把问题这一本讲给家长听。',
    pre: [
      { art: '🏃', en: 'discover', zh: '发现' },
      { art: '🌿', en: 'energy', zh: '能量' },
      { art: '🏃', en: 'forget', zh: '忘记' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👨', en: 'dad', zh: '爸爸' }
    ],
    sight: ['patience'],
    newWords: [
      { w: 'discover', zh: '发现' },
      { w: 'energy', zh: '能量' },
      { w: 'forget', zh: '忘记' }
    ],
    pages: [
      { art: 'classroom|dad,lili|problem|·', en: 'Dad has just finished a book in the classroom.', zh: '爸爸刚在教室读完一本书。' },
      { art: 'classroom|dad,lili|problem|♪', en: 'Lili wants to hear all about it.', zh: '丽丽想听他讲讲。' },
      { art: 'classroom|dad,lili|problem|👀', en: 'Dad thinks about the problem in the book. Three words mattered that day: discover, energy and forget.', zh: '爸爸想着书里的问题。那天有三个词很要紧：发现、能量和忘记。' },
      { art: 'classroom|dad,lili|problem|?', en: '"Where do I start?" asks Dad.', zh: '「从哪儿讲起？」爸爸问。' },
      { art: 'classroom|dad,lili|problem|·', en: 'Dad tells the last part first.', zh: '爸爸先讲了结尾。' },
      { art: 'classroom|dad,lili|problem|!', en: 'Lili cannot follow the story.', zh: '丽丽听不明白。' },
      { art: 'classroom|dad,lili|patience|♥', en: 'Lili says, "Tell me who, where, then what."', zh: '丽丽说：「先说谁、在哪儿、再说出什么事。」' },
      { art: 'classroom|dad,lili|patience|·', en: 'Dad starts again, in order.', zh: '爸爸按顺序重新讲。' },
      { art: 'classroom|dad,lili|problem|★', en: 'This time Lili can see the whole thing.', zh: '这回丽丽全听明白了。' },
      { art: 'classroom|dad,lili|problem|?', en: 'A story needs its order to make sense.', zh: '故事要靠顺序才讲得通。' },
      { art: 'classroom|dad,lili|problem|?', en: 'Remembering is not the same as telling.', zh: '记住，和讲出来不是一回事。' },
      { art: 'classroom|dad,lili|problem|…', en: 'If you can tell it, you have read it.', zh: '讲得出来，才算真的读过。' },
      { art: 'classroom|dad,lili|problem|…', en: 'The order is the shape of the story.', zh: '顺序就是故事的骨架。' },
      { art: 'classroom|dad,lili|problem|♥', en: 'Dad closes the book and tells it again. We say the words again: discover and energy.', zh: '爸爸合上书，又讲了一遍。我们把这两个词再说一遍：发现和能量。' },
      { art: 'classroom|dad,lili|problem|·', en: 'Tomorrow they will read about some patience. They could still tell it the next morning.', zh: '明天他们要读讲耐心的书。第二天早上，他们还能讲得出来。' }
    ],
    quiz: [
      { q: '这一本里，爸爸看到了下面哪一样？', opts: ['能量', '风筝', '午饭'], a: 0, kind: 'recall' },
      { q: '为什么丽丽第一遍没听明白？', opts: ['因为讲得太慢', '因为故事太短', '先讲了结尾，顺序乱了'], a: 2, kind: 'infer' },
      { q: '要把讲问题的这本读过的书讲给别人听，你会怎么开头？', opts: ['先报书名和生词表', '先说谁、在哪儿，再按顺序说出了什么事', '直接从最精彩的那句开始'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b115', lv: 'L10', tag: '坚持', title: 'Tomorrow We Begin Again', zh: '明天重新开始',
    emoji: '🌅', color: '#BFE6DF',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「问一问」这条线，认读 3 个新词。',
    trap: '桥梁书按自然段读：一句里先找「谁 + 做什么」，再把修饰部分补进去。',
    summary: '《明天重新开始》是「问一问」：明明和奶奶在家，围绕约定把一件事读到底。本本词卡：城市、继续、将来。读前先看词卡，读完合上书说一说。',
    retell: '不看书写一段 5 句的口头小结，再说说你同不同意。（这一本是「问一问」。）',
    think: '回想一次「问了还是没懂」：把当时的问题改成一个更小的、指着某个词的问题。',
    pre: [
      { art: '📍', en: 'city', zh: '城市' },
      { art: '🏃', en: 'continue', zh: '继续' },
      { art: '🔮', en: 'future', zh: '将来' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👦', en: 'ming', zh: '明明' }
    ],
    sight: [],
    newWords: [
      { w: 'city', zh: '城市' },
      { w: 'continue', zh: '继续' },
      { w: 'future', zh: '将来' }
    ],
    pages: [
      { art: 'home|ming,grandma|promise|·', en: 'Ming is reading the word "promise" at home.', zh: '明明在家读「promise」这个词。' },
      { art: 'home|ming,grandma|promise|♪', en: 'Ming wants to understand it.', zh: '明明想把它弄明白。' },
      { art: 'home|ming,grandma|promise|👀', en: 'One sentence does not make sense. Three words mattered that day: city, continue and future.', zh: '有一句怎么也读不通。那天有三个词很要紧：城市、继续和将来。' },
      { art: 'home|ming,grandma|promise|?', en: '"What does this part mean?" asks Ming.', zh: '「这一段什么意思？」明明问。' },
      { art: 'home|ming,grandma|promise|·', en: 'Grandma answers, but Ming still looks lost.', zh: '奶奶答了，明明还是没懂。' },
      { art: 'home|ming,grandma|promise|!', en: 'The answer was right, but not the right answer.', zh: '答案没错，却不是问的那个。' },
      { art: 'home|ming,grandma|pot|♥', en: 'Grandma asks, "Which word is the hard one?"', zh: '奶奶反问：「难的是哪个词？」' },
      { art: 'home|ming,grandma|pot|·', en: 'Ming points to one word and asks again.', zh: '明明指着一个词，又问了一遍。' },
      { art: 'home|ming,grandma|promise|★', en: 'Now the whole sentence is clear.', zh: '这下整句都清楚了。' },
      { art: 'home|ming,grandma|promise|?', en: 'The real question had been a smaller one.', zh: '真正该问的，是个更小的问题。' },
      { art: 'home|ming,grandma|promise|?', en: 'A clear question is half of an answer.', zh: '问得清楚，答案就有了一半。' },
      { art: 'home|ming,grandma|promise|…', en: 'Asking again is not the same as not listening.', zh: '再问一遍，不等于没在听。' },
      { art: 'home|ming,grandma|promise|…', en: 'Finding the hard word was the real work.', zh: '找出那个难词，才是真本事。' },
      { art: 'home|ming,grandma|promise|♥', en: 'Ming says the sentence out loud. We say the words again: city and continue.', zh: '明明把这句大声念了出来。我们把这两个词再说一遍：城市和继续。' },
      { art: 'home|ming,grandma|promise|·', en: 'They write down one new question. The smaller question stayed with them.', zh: '他们又写下一个新问题。那个更小的问题，他们一直记着。' }
    ],
    quiz: [
      { q: '明明和奶奶的这一本里，出现了下面哪一样？', opts: ['腿', '城市', '妈妈'], a: 1, kind: 'recall' },
      { q: '明明第一次为什么没听懂「promise」？', opts: ['问题太大，没指向真正卡住的那个词', '因为答案太短', '因为读得太快'], a: 0, kind: 'infer' },
      { q: '别人把「promise」解释完你还是没懂，你会怎么做？', opts: ['指出具体哪个词不懂，再问一遍', '点点头装作懂了', '把整段跳过去'], a: 0, kind: 'transfer' }
    ]
  },
  {
    id: 'b116', lv: 'L10', tag: '坚持', title: 'A Journey of Small Steps', zh: '一小步一小步',
    emoji: '👣', color: '#F2E2A8',
    track: 'story',
    goal: '顺着一条完整的小故事，把起因、卡住、解决读顺。这一本走「跟读整句」这条线，认读 4 个新词。',
    trap: '桥梁书按自然段读：一句里先找「谁 + 做什么」，再把修饰部分补进去。',
    summary: '《一小步一小步》是「跟读整句」：丽丽和爷爷在车站，围绕旅程把一件事读到底。本本词卡：旅程、想象、重要、进步。读前先看词卡，读完合上书说一说。',
    retell: '不看书写一段 5 句的口头小结，再说说你同不同意。（这一本是「跟读整句」。）',
    think: '挑书里最长的一句英文，先听整句，再分成两段读给家长听。',
    pre: [
      { art: '🛤️', en: 'journey', zh: '旅程' },
      { art: '🏃', en: 'imagine', zh: '想象' },
      { art: '✨', en: 'important', zh: '重要' },
      { art: '🏃', en: 'improve', zh: '进步' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👧', en: 'lili', zh: '丽丽' }
    ],
    sight: [],
    newWords: [
      { w: 'journey', zh: '旅程' },
      { w: 'imagine', zh: '想象' },
      { w: 'important', zh: '重要' },
      { w: 'improve', zh: '进步' }
    ],
    pages: [
      { art: 'station|lili,grandpa|journey|·', en: 'Lili opens a book at the station.', zh: '丽丽在车站翻开一本书。' },
      { art: 'station|lili,grandpa|journey|♪', en: 'Lili wants to read it out loud.', zh: '丽丽想把它读出来。' },
      { art: 'station|lili,grandpa|journey|👀', en: 'The sentence with the word "journey" is long. Three words mattered that day: imagine, important and improve.', zh: '带着「journey」这个词的那一句很长。那天有三个词很要紧：想象、重要和进步。' },
      { art: 'station|lili,grandpa|journey|?', en: '"Where do I stop for breath?" asks Lili.', zh: '「在哪里换气？」丽丽问。' },
      { art: 'station|lili,grandpa|journey|·', en: 'Lili reads it one word at a time.', zh: '丽丽一个词一个词地读。' },
      { art: 'station|lili,grandpa|journey|!', en: 'It sounds broken, not like a sentence.', zh: '听着是碎的，不像一句话。' },
      { art: 'station|lili,grandpa|box|♥', en: 'Grandpa plays the whole sentence.', zh: '爷爷把整句放了一遍。' },
      { art: 'station|lili,grandpa|box|·', en: 'Lili listens, then reads it in two parts.', zh: '丽丽听完，分两段读。' },
      { art: 'station|lili,grandpa|journey|★', en: 'Now it sounds like one sentence.', zh: '这下听起来像一整句了。' },
      { art: 'station|lili,grandpa|journey|?', en: 'The words belong to groups, not to themselves.', zh: '词是成组的，不是一个一个孤立的。' },
      { art: 'station|lili,grandpa|journey|?', en: 'Where you pause changes what you hear.', zh: '停在哪里，会改变听到的意思。' },
      { art: 'station|lili,grandpa|journey|…', en: 'Reading is closer to speaking than to spelling.', zh: '读，更接近说，而不是拼。' },
      { art: 'station|lili,grandpa|journey|…', en: 'The ear found what the eye had missed.', zh: '耳朵找到了眼睛漏掉的东西。' },
      { art: 'station|lili,grandpa|journey|♥', en: 'Lili reads it once more, smiling. We say the words again: imagine and important.', zh: '丽丽笑着又读了一遍。我们把这两个词再说一遍：想象和重要。' },
      { art: 'station|lili,grandpa|journey|·', en: 'They try the next sentence about a box. Reading out loud became easier after that.', zh: '他们接着试讲盒子的下一句。从那以后，读出声就不那么难了。' }
    ],
    quiz: [
      { q: '在车站读的这一本里，有下面哪一样？', opts: ['市场', '车站', '网'], a: 1, kind: 'recall' },
      { q: '丽丽读「journey」那一句时，为什么一个词一个词读听起来是碎的？', opts: ['句子里的词是成组的，不能逐个蹦', '因为词太难', '因为读得太慢'], a: 0, kind: 'infer' },
      { q: '遇到像「journey」那一句这样很长的英文句子，你会怎么读？', opts: ['只看中文跳过英文', '一个词一个词慢慢拼', '先听整句，再按意思分成两三段读'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b117', lv: 'L10', tag: '发音', title: 'Say It: A Whole Sentence', zh: '说一说：整句的节奏',
    emoji: '🗣️', color: '#D9D2F5',
    track: 'drill',
    goal: '把本级难点音听准、说准，并能在整句里读对。这一本走「问一问」这条线，认读 3 个新词。',
    trap: '桥梁书按自然段读：一句里先找「谁 + 做什么」，再把修饰部分补进去。',
    summary: '《说一说：整句的节奏》是「问一问」：奶奶和妈妈在家，围绕原因把一件事读到底。本本词卡：相信、后来、记忆。读前先看词卡，读完合上书说一说。',
    retell: '不看书写一段 5 句的口头小结，再说说你同不同意。（这一本是「问一问」。）',
    think: '回想一次「问了还是没懂」：把当时的问题改成一个更小的、指着某个词的问题。',
    pre: [
      { art: '🏃', en: 'believe', zh: '相信' },
      { art: '⏰', en: 'later', zh: '后来' },
      { art: '🧠', en: 'memory', zh: '记忆' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👵', en: 'grandma', zh: '奶奶' }
    ],
    sight: [],
    newWords: [
      { w: 'believe', zh: '相信' },
      { w: 'later', zh: '后来' },
      { w: 'memory', zh: '记忆' }
    ],
    pages: [
      { art: 'home|grandma,mom|reason|·', en: 'Grandma is reading the word "reason" at home.', zh: '奶奶在家读「reason」这个词。' },
      { art: 'home|grandma,mom|reason|♪', en: 'Grandma wants to understand it.', zh: '奶奶想把它弄明白。' },
      { art: 'home|grandma,mom|reason|👀', en: 'One sentence does not make sense. Three words mattered that day: believe, later and memory.', zh: '有一句怎么也读不通。那天有三个词很要紧：相信、后来和记忆。' },
      { art: 'home|grandma,mom|reason|?', en: '"What does this part mean?" asks Grandma.', zh: '「这一段什么意思？」奶奶问。' },
      { art: 'home|grandma,mom|reason|·', en: 'Mom answers, but Grandma still looks lost.', zh: '妈妈答了，奶奶还是没懂。' },
      { art: 'home|grandma,mom|reason|!', en: 'The answer was right, but not the right answer.', zh: '答案没错，却不是问的那个。' },
      { art: 'home|grandma,mom|box|♥', en: 'Mom asks, "Which word is the hard one?"', zh: '妈妈反问：「难的是哪个词？」' },
      { art: 'home|grandma,mom|box|·', en: 'Grandma points to one word and asks again.', zh: '奶奶指着一个词，又问了一遍。' },
      { art: 'home|grandma,mom|reason|★', en: 'Now the whole sentence is clear.', zh: '这下整句都清楚了。' },
      { art: 'home|grandma,mom|reason|?', en: 'The real question had been a smaller one.', zh: '真正该问的，是个更小的问题。' },
      { art: 'home|grandma,mom|reason|?', en: 'A clear question is half of an answer.', zh: '问得清楚，答案就有了一半。' },
      { art: 'home|grandma,mom|reason|…', en: 'Asking again is not the same as not listening.', zh: '再问一遍，不等于没在听。' },
      { art: 'home|grandma,mom|reason|…', en: 'Finding the hard word was the real work.', zh: '找出那个难词，才是真本事。' },
      { art: 'home|grandma,mom|reason|♥', en: 'Grandma says the sentence out loud. We say the words again: believe and later.', zh: '奶奶把这句大声念了出来。我们把这两个词再说一遍：相信和后来。' },
      { art: 'home|grandma,mom|reason|·', en: 'They write down one new question. The smaller question stayed with them.', zh: '他们又写下一个新问题。那个更小的问题，他们一直记着。' }
    ],
    quiz: [
      { q: '《原因》这一本主要在讲哪一样东西？', opts: ['盒子', '原因', '地图'], a: 1, kind: 'recall' },
      { q: '奶奶第一次为什么没听懂「reason」？', opts: ['问题太大，没指向真正卡住的那个词', '因为答案太短', '因为读得太快'], a: 0, kind: 'infer' },
      { q: '别人把「reason」解释完你还是没懂，你会怎么做？', opts: ['把整段跳过去', '指出具体哪个词不懂，再问一遍', '点点头装作懂了'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b118', lv: 'L10', tag: '小知识', title: 'Why Practice Works', zh: '练习为什么有用',
    emoji: '📈', color: '#FAD3B6',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。这一本走「问一问」这条线，认读 1 个新词。',
    trap: '桥梁书按自然段读：一句里先找「谁 + 做什么」，再把修饰部分补进去。',
    summary: '《练习为什么有用》是「问一问」：爷爷和爸爸在教室，围绕回答把一件事读到底。本本词卡：天气。读前先看词卡，读完合上书说一说。',
    retell: '不看书写一段 5 句的口头小结，再说说你同不同意。（这一本是「问一问」。）',
    think: '回想一次「问了还是没懂」：把当时的问题改成一个更小的、指着某个词的问题。',
    pre: [
      { art: '🌿', en: 'weather', zh: '天气' },
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👴', en: 'grandpa', zh: '爷爷' }
    ],
    sight: [],
    newWords: [
      { w: 'weather', zh: '天气' }
    ],
    pages: [
      { art: 'classroom|grandpa,dad|answer|·', en: 'Grandpa is reading the word "answer" in the classroom.', zh: '爷爷在教室读「answer」这个词。' },
      { art: 'classroom|grandpa,dad|answer|♪', en: 'Grandpa wants to understand it.', zh: '爷爷想把它弄明白。' },
      { art: 'classroom|grandpa,dad|answer|👀', en: 'One sentence does not make sense. Three words mattered that day: weather, weather and weather.', zh: '有一句怎么也读不通。那天有三个词很要紧：天气、天气和天气。' },
      { art: 'classroom|grandpa,dad|answer|?', en: '"What does this part mean?" asks Grandpa.', zh: '「这一段什么意思？」爷爷问。' },
      { art: 'classroom|grandpa,dad|answer|·', en: 'Dad answers, but Grandpa still looks lost.', zh: '爸爸答了，爷爷还是没懂。' },
      { art: 'classroom|grandpa,dad|answer|!', en: 'The answer was right, but not the right answer.', zh: '答案没错，却不是问的那个。' },
      { art: 'classroom|grandpa,dad|realize|♥', en: 'Dad asks, "Which word is the hard one?"', zh: '爸爸反问：「难的是哪个词？」' },
      { art: 'classroom|grandpa,dad|realize|·', en: 'Grandpa points to one word and asks again.', zh: '爷爷指着一个词，又问了一遍。' },
      { art: 'classroom|grandpa,dad|answer|★', en: 'Now the whole sentence is clear.', zh: '这下整句都清楚了。' },
      { art: 'classroom|grandpa,dad|answer|?', en: 'The real question had been a smaller one.', zh: '真正该问的，是个更小的问题。' },
      { art: 'classroom|grandpa,dad|answer|?', en: 'A clear question is half of an answer.', zh: '问得清楚，答案就有了一半。' },
      { art: 'classroom|grandpa,dad|answer|…', en: 'Asking again is not the same as not listening.', zh: '再问一遍，不等于没在听。' },
      { art: 'classroom|grandpa,dad|answer|…', en: 'Finding the hard word was the real work.', zh: '找出那个难词，才是真本事。' },
      { art: 'classroom|grandpa,dad|answer|♥', en: 'Grandpa says the sentence out loud. We say the words again: weather and weather.', zh: '爷爷把这句大声念了出来。我们把这两个词再说一遍：天气和天气。' },
      { art: 'classroom|grandpa,dad|answer|·', en: 'They write down one new question. The smaller question stayed with them.', zh: '他们又写下一个新问题。那个更小的问题，他们一直记着。' }
    ],
    quiz: [
      { q: '爷爷和爸爸的这一本里，出现了下面哪一样？', opts: ['博物馆', '天气', '公园'], a: 1, kind: 'recall' },
      { q: '爷爷第一次为什么没听懂「answer」？', opts: ['问题太大，没指向真正卡住的那个词', '因为读得太快', '因为答案太短'], a: 0, kind: 'infer' },
      { q: '别人把「answer」解释完你还是没懂，你会怎么做？', opts: ['把整段跳过去', '指出具体哪个词不懂，再问一遍', '点点头装作懂了'], a: 1, kind: 'transfer' }
    ]
  },
  {
    id: 'b119', lv: 'L10', tag: '小知识', title: 'Small Steps, Long Way', zh: '小步子，长路',
    emoji: '🛤️', color: '#C8E7F0',
    track: 'info',
    goal: '读懂一个真实的小知识，能说出「为什么会这样」。这一本走「合上书讲一遍」这条线，不引入新词，全部是读过的词。',
    trap: '桥梁书按自然段读：一句里先找「谁 + 做什么」，再把修饰部分补进去。',
    summary: '《小步子，长路》是「合上书讲一遍」：妈妈和明明在图书馆，围绕将来把一件事读到底。本本词卡：这一本不引入新词，全部是读过的词。读前先看词卡，读完合上书说一说。',
    retell: '不看书写一段 5 句的口头小结，再说说你同不同意。（这一本是「合上书讲一遍」。）',
    think: '合上书，用「谁 → 在哪儿 → 出了什么事 → 结果」把将来这一本讲给家长听。',
    pre: [
      { art: '📦', en: 'the', zh: 'the' },
      { art: '👩', en: 'mom', zh: '妈妈' }
    ],
    sight: [],
    newWords: [

    ],
    pages: [
      { art: 'library|mom,ming|future|·', en: 'Mom has just finished a book in the library.', zh: '妈妈刚在图书馆读完一本书。' },
      { art: 'library|mom,ming|future|♪', en: 'Ming wants to hear all about it.', zh: '明明想听他讲讲。' },
      { art: 'library|mom,ming|future|👀', en: 'Mom thinks about the future in the book. Three words mattered that day: planet, practice and problem.', zh: '妈妈想着书里的将来。那天有三个词很要紧：星球、练习和问题。' },
      { art: 'library|mom,ming|future|?', en: '"Where do I start?" asks Mom.', zh: '「从哪儿讲起？」妈妈问。' },
      { art: 'library|mom,ming|future|·', en: 'Mom tells the last part first.', zh: '妈妈先讲了结尾。' },
      { art: 'library|mom,ming|future|!', en: 'Ming cannot follow the story.', zh: '明明听不明白。' },
      { art: 'library|mom,ming|toy|♥', en: 'Ming says, "Tell me who, where, then what."', zh: '明明说：「先说谁、在哪儿、再说出什么事。」' },
      { art: 'library|mom,ming|toy|·', en: 'Mom starts again, in order.', zh: '妈妈按顺序重新讲。' },
      { art: 'library|mom,ming|future|★', en: 'This time Ming can see the whole thing.', zh: '这回明明全听明白了。' },
      { art: 'library|mom,ming|future|?', en: 'A story needs its order to make sense.', zh: '故事要靠顺序才讲得通。' },
      { art: 'library|mom,ming|future|?', en: 'Remembering is not the same as telling.', zh: '记住，和讲出来不是一回事。' },
      { art: 'library|mom,ming|future|…', en: 'If you can tell it, you have read it.', zh: '讲得出来，才算真的读过。' },
      { art: 'library|mom,ming|future|…', en: 'The order is the shape of the story.', zh: '顺序就是故事的骨架。' },
      { art: 'library|mom,ming|future|♥', en: 'Mom closes the book and tells it again. We say the words again: planet and practice.', zh: '妈妈合上书，又讲了一遍。我们把这两个词再说一遍：星球和练习。' },
      { art: 'library|mom,ming|future|·', en: 'Tomorrow they will read about a toy. They could still tell it the next morning.', zh: '明天他们要读讲玩具的书。第二天早上，他们还能讲得出来。' }
    ],
    quiz: [
      { q: '在图书馆读的这一本里，有下面哪一样？', opts: ['一双', '水池', '星球'], a: 2, kind: 'recall' },
      { q: '为什么明明第一遍没听明白？', opts: ['因为讲得太慢', '因为故事太短', '先讲了结尾，顺序乱了'], a: 2, kind: 'infer' },
      { q: '要把讲将来的这本读过的书讲给别人听，你会怎么开头？', opts: ['直接从最精彩的那句开始', '先报书名和生词表', '先说谁、在哪儿，再按顺序说出了什么事'], a: 2, kind: 'transfer' }
    ]
  },
  {
    id: 'b120', lv: 'L10', tag: '复习', title: 'The Whole Idea', zh: '完整的想法',
    emoji: '🧠', color: '#E8D9B5',
    track: 'review',
    goal: '把本级和前面级别的词再读一遍、串成一个故事。这一本走「比一比」这条线，不引入新词，全部是读过的词。',
    trap: '桥梁书按自然段读：一句里先找「谁 + 做什么」，再把修饰部分补进去。',
    summary: '《完整的想法》是「比一比」：爸爸和丽丽在图书馆，围绕主意把一件事读到底。本本词卡：这一本不引入新词，全部是读过的词。读前先看词卡，读完合上书说一说。',
    retell: '不看书写一段 5 句的口头小结，再说说你同不同意。（这一本是「比一比」。）',
    think: '找两样很像的东西，用英文说出至少两处不同，说说你是按什么顺序找的。',
    pre: [
      { art: '📦', en: 'the', zh: 'the' },
      { art: '📦', en: 'they', zh: 'they' }
    ],
    sight: [],
    newWords: [

    ],
    pages: [
      { art: 'library|dad,lili|idea|·', en: 'Dad looks at an idea and a cap.', zh: '爸爸看着主意和鸭舌帽。' },
      { art: 'library|dad,lili|idea|♪', en: 'They want to know how they are different.', zh: '他们想知道两样有什么不一样。' },
      { art: 'library|dad,lili|idea|👀', en: 'At first the two look the same. Three words mattered that day: practice, problem and promise.', zh: '乍一看，两样挺像。那天有三个词很要紧：练习、问题和约定。' },
      { art: 'library|dad,lili|idea|?', en: '"What is not the same?" asks Lili.', zh: '「哪里不一样？」丽丽问。' },
      { art: 'library|dad,lili|idea|·', en: 'They put them side by side.', zh: '他们把两样并排放。' },
      { art: 'library|dad,lili|idea|!', en: 'Looking from far away does not help.', zh: '远远地看，还是看不出。' },
      { art: 'library|dad,lili|cap|♥', en: 'Lili says, "Look at one part at a time."', zh: '丽丽说：「一处一处分开看。」' },
      { art: 'library|dad,lili|cap|·', en: 'They check one part, then another.', zh: '他们先看一处，再看另一处。' },
      { art: 'library|dad,lili|idea|★', en: 'There! One small part is different.', zh: '有了！有一处小小的不同。' },
      { art: 'library|dad,lili|idea|?', en: 'The difference was small, not missing.', zh: '差别很小，不是没有。' },
      { art: 'library|dad,lili|idea|?', en: 'Same and almost the same are not the same.', zh: '「一样」和「差不多一样」不是一回事。' },
      { art: 'library|dad,lili|idea|…', en: 'Comparing needs a plan, not just a look.', zh: '比一比要有章法，不能光瞄一眼。' },
      { art: 'library|dad,lili|idea|…', en: 'Naming the parts made the difference visible.', zh: '把部位说出来，差别才看得见。' },
      { art: 'library|dad,lili|idea|♥', en: 'They tell Dad what they found. We say the words again: practice and problem.', zh: '他们把自己发现的讲给爸爸听。我们把这两个词再说一遍：练习和问题。' },
      { art: 'library|dad,lili|idea|·', en: 'Next they will compare the cap and the promise. They made a list of all the small differences.', zh: '接着他们要比一比鸭舌帽和约定。他们把所有细小的不同都列了下来。' }
    ],
    quiz: [
      { q: '这一本里，爸爸看到了下面哪一样？', opts: ['李子', '鸭舌帽', '一双'], a: 1, kind: 'recall' },
      { q: '主意和鸭舌帽一开始为什么看着一样？', opts: ['因为它们真的完全相同', '只远远看了一眼，没一处一处分开比', '因为光线太暗'], a: 1, kind: 'infer' },
      { q: '要找出像主意和鸭舌帽这样很像的两样东西哪里不同，你会怎么做？', opts: ['隔很远扫一眼', '只挑一个看', '并排放好，一处一处分开看'], a: 2, kind: 'transfer' }
    ]
  }
];

window.BOOKS = BOOKS;
