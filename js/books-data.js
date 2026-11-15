/* ============================================================
   小鸟英语乐园 · 读书馆 v3（面向中国学生的分级阅读体系）
   2026-11-15 重做：10 站 × 6 本 = 60 本，平均 16 → 256 词/本

   为什么推翻重做：旧版 8 个级别全部 27-34 词，等于没有梯度；
   而且照搬美国 decodable reader，只解决「把字母拼成音」，
   没解决中国孩子「拼出来也不知道是什么意思」。

   这套体系的六条原则：
   ① 先懂再读——每本正文前有「读前看图说词」，核心词先过一遍音和义；
   ② 长度真递进——L1 均 16 词 → L10 均 256 词，每站 +20% 以上；
   ③ 字素按级放行——本级没教的字素一律不进正文，必须用时
      登记为「整体认读词」并在读前页预教，不假装孩子会拼；
   ④ 难点单独成册——L1 六本看图说词，L2–L10 每站 4 故事 + 1 专项 + 1 科普；
   ⑤ 人物与场景固定——Ming、Lili、奶奶、爷爷、猫 Mimi、狗 Doudou，
      场景是包饺子、高铁、中秋、红包、小区、菜市场、熊猫、长城；
   ⑥ 家长不用会英语也能陪——goal / trap / summary 全中文，
      发音提示具体到「舌尖放哪儿」「中间不能加呃」。

   每本字段：track 故事/专项/科普 · goal 本课目标 · trap 中文发音提示
            · pre 读前看图说词 · summary 读后中文小结 · pep 课本对应（可选）
            · sight 整体认读词 · newWords 带中文的预教词

   校验（_check_books.py）：长度梯度 / 每级容量 / 字素可解码 /
   读前词必须在正文出现 / 题干不得无指代 / 感叹号比例 / 答案位置配平。
   ============================================================ */
'use strict';

const BOOKS = [
  {
    id: 'b1', lv: 'L1', tag: '家人 · 我的', title: 'My Family', zh: '我的家人',
    emoji: '👨‍👩‍👧‍👦', color: '#F6C6C6',
    track: 'story',
    goal: '6 个家人称呼，听到词能指对图',
    trap: 'grandma 的重音在第一拍 GRAND-ma，中间的 d 不发音；grandpa 同理。别一个字母一个字母地念。',
    summary: '第一本不要求拼读，只要「听到词能指对图」。grandma / grandpa 里的 d 都不发音，读成「格兰玛」「格兰帕」。读完可以让孩子指着家里人再说一遍。',
    pre: [
      { art: '👵', en: 'grandma', zh: '奶奶' },
      { art: '👴', en: 'grandpa', zh: '爷爷' },
      { art: '👩', en: 'mom', zh: '妈妈' },
      { art: '👨', en: 'dad', zh: '爸爸' }
    ],
    sight: ['my', 'is', 'in'],
    newWords: [
      { w: 'grandma', zh: '奶奶' },
      { w: 'grandpa', zh: '爷爷' },
      { w: 'mom', zh: '妈妈' },
      { w: 'dad', zh: '爸爸' },
      { w: 'cat', zh: '猫' },
      { w: 'dog', zh: '狗' },
      { w: 'hat', zh: '帽子' }
    ],
    pages: [
      { art: '👵', en: 'My grandma.', zh: '我的奶奶。' },
      { art: '👴', en: 'My grandpa.', zh: '我的爷爷。' },
      { art: '👩', en: 'My mom.', zh: '我的妈妈。' },
      { art: '👨', en: 'My dad.', zh: '我的爸爸。' },
      { art: '🐱', en: 'My cat.', zh: '我的猫。' },
      { art: '🐶🎩', en: 'My dog is in my hat!', zh: '我的狗在我的帽子里！' }
    ],
    quiz: [
      { q: '第一页是谁？', opts: ['妈妈', '姐姐', '奶奶'], a: 2 },
      { q: '最后谁在帽子里？', opts: ['狗', '猫', '爷爷'], a: 0 },
      { q: '书里一共提到了几位家人？', opts: ['四位', '六位', '两位'], a: 0 }
    ]
  },
  {
    id: 'b2', lv: 'L1', tag: '身边的东西', title: 'My Things', zh: '我的东西',
    emoji: '🎒', color: '#BFD7EA',
    track: 'story',
    goal: '4 个日常物品 + in 的位置关系',
    trap: 'bag 结尾的 /g/ 要出来；cup 结尾的 /p/ 轻轻收住，别读成「卡普」，也别在后面加「呃」。',
    summary: '这一本把「听到的音」和「看到的物」连起来。in 是最基础的方位词，可以拿孩子的玩具真的放进包里，一边做一边说 My cat is in my bag.',
    pre: [
      { art: '🎩', en: 'hat', zh: '帽子' },
      { art: '👜', en: 'bag', zh: '包' },
      { art: '☕', en: 'cup', zh: '杯子' },
      { art: '📖', en: 'book', zh: '书' }
    ],
    sight: ['my', 'is', 'in'],
    newWords: [
      { w: 'hat', zh: '帽子' },
      { w: 'bag', zh: '包' },
      { w: 'cup', zh: '杯子' },
      { w: 'book', zh: '书' },
      { w: 'cat', zh: '猫' }
    ],
    pages: [
      { art: '🎩', en: 'My hat.', zh: '我的帽子。' },
      { art: '👜', en: 'My bag.', zh: '我的包。' },
      { art: '☕', en: 'My cup.', zh: '我的杯子。' },
      { art: '📖', en: 'My book.', zh: '我的书。' },
      { art: '🐱👜', en: 'My cat is in my bag!', zh: '我的猫在我的包里！' }
    ],
    quiz: [
      { q: '我的猫躲到哪儿去了？', opts: ['床下', '包里', '帽子里'], a: 1 },
      { q: '谁钻进了包里？', opts: ['狗', '猫', '妈妈'], a: 1 },
      { q: '书里没有提到哪样东西？', opts: ['帽子', '鞋子', '杯子'], a: 1 }
    ]
  },
  {
    id: 'b3', lv: 'L1', tag: '大和小', title: 'Big and Small', zh: '大和小',
    emoji: '🐕', color: '#C9E4C5',
    track: 'story',
    goal: 'big / small 这对反义词，配合动物名词',
    trap: 'big 结尾的 /g/、small 结尾的 /l/ 都要收住；small 不要读成「斯莫」，/sm/ 中间别加元音。',
    summary: 'big / small 是孩子最早能理解的一对反义词。最后一页把「小老鼠」变成「大老鼠」是这本书的笑点，可以让孩子指出来哪里不对劲。',
    pre: [
      { art: '🐕', en: 'dog', zh: '狗' },
      { art: '🐱', en: 'cat', zh: '猫' },
      { art: '🐘', en: 'big', zh: '大的' },
      { art: '🐭', en: 'small', zh: '小的' },
      { art: '🐁', en: 'mouse', zh: '老鼠' }
    ],
    sight: ['a', 'and'],
    newWords: [
      { w: 'dog', zh: '狗' },
      { w: 'cat', zh: '猫' },
      { w: 'big', zh: '大的' },
      { w: 'small', zh: '小的' },
      { w: 'mouse', zh: '老鼠' },
      { w: 'run', zh: '跑' }
    ],
    pages: [
      { art: '🐕', en: 'A big dog.', zh: '一只大狗。' },
      { art: '🐶', en: 'A small dog.', zh: '一只小狗。' },
      { art: '🐈', en: 'A big cat.', zh: '一只大猫。' },
      { art: '🐱', en: 'A small cat.', zh: '一只小猫。' },
      { art: '🐭', en: 'A small mouse.', zh: '一只小老鼠。' },
      { art: '🙀🐭', en: 'A BIG mouse! Run!', zh: '一只好大的老鼠！快跑！' }
    ],
    quiz: [
      { q: '最后出现的是一只什么样的老鼠？', opts: ['很大的', '很小的', '灰色的'], a: 0 },
      { q: '书里拿哪两种动物作比较？', opts: ['猫和老鼠', '狗和猫', '狗和马'], a: 1 },
      { q: '最后一页让大家做什么？', opts: ['快跑', '睡觉', '吃饭'], a: 0 }
    ]
  },
  {
    id: 'b4', lv: 'L1', tag: '颜色 · 帽子', title: 'Red Hat, Green Hat', zh: '红帽子绿帽子',
    emoji: '🎩', color: '#F2B5D4',
    track: 'story',
    goal: '4 个颜色词 + hat，建立「颜色 + 名词」的搭配',
    trap: 'green 的 /gr/ 要连着滑过去；white 的 /w/ 要圆唇，h 不发音；red 结尾的 /d/ 别丢。',
    summary: '中文说「红帽子」，英语也是「颜色 + 名词」，顺序一样，但要把两个词连起来读，不要中间停顿。可以让孩子找出家里同样颜色的东西，套用 A red ... 来说。',
    pre: [
      { art: '🔴', en: 'red', zh: '红色' },
      { art: '🟢', en: 'green', zh: '绿色' },
      { art: '⚫', en: 'black', zh: '黑色' },
      { art: '⚪', en: 'white', zh: '白色' }
    ],
    sight: ['a', 'my', 'is', 'in'],
    newWords: [
      { w: 'red', zh: '红色' },
      { w: 'green', zh: '绿色' },
      { w: 'black', zh: '黑色' },
      { w: 'white', zh: '白色' },
      { w: 'hat', zh: '帽子' }
    ],
    pages: [
      { art: '🔴🎩', en: 'A red hat.', zh: '一顶红帽子。' },
      { art: '🟢🎩', en: 'A green hat.', zh: '一顶绿帽子。' },
      { art: '⚫🎩', en: 'A black hat.', zh: '一顶黑帽子。' },
      { art: '⚪🎩', en: 'A white hat.', zh: '一顶白帽子。' },
      { art: '🎩', en: 'My hat!', zh: '我的帽子！' },
      { art: '🐱🎩', en: 'A cat is in my hat!', zh: '一只猫在我的帽子里！' }
    ],
    quiz: [
      { q: '书里没有出现哪种颜色？', opts: ['蓝色', '红色', '黑色'], a: 0 },
      { q: '最后谁在帽子里？', opts: ['猫', '狗', '老鼠'], a: 0 },
      { q: '最后那顶帽子是谁的？', opts: ['奶奶的', '我的', '老师的'], a: 1 }
    ]
  },
  {
    id: 'b5', lv: 'L1', tag: '数数 1-5', title: 'One, Two, Three', zh: '一二三四五',
    emoji: '🐱', color: '#FFD9A0',
    track: 'story',
    goal: '数字 1-5，配合可数名词',
    trap: 'three 的 th 要把舌尖轻轻放在上下齿中间；five 的 /v/ 是上齿碰下唇，不要读成 /w/。',
    summary: '数字配合可数名词，顺便听出英语的复数：one cat 但 two cats，多了一只就要加 -s。这一本不要求记拼写，只要能听出数量。读完可以数一数家里的椅子。',
    pre: [
      { art: '1️⃣', en: 'one', zh: '一' },
      { art: '2️⃣', en: 'two', zh: '二' },
      { art: '3️⃣', en: 'three', zh: '三' },
      { art: '5️⃣', en: 'five', zh: '五' }
    ],
    sight: ['too', 'many'],
    newWords: [
      { w: 'one', zh: '一' },
      { w: 'two', zh: '二' },
      { w: 'three', zh: '三' },
      { w: 'four', zh: '四' },
      { w: 'five', zh: '五' },
      { w: 'cat', zh: '猫' }
    ],
    pages: [
      { art: '🐱', en: 'One cat.', zh: '一只猫。' },
      { art: '🐱🐱', en: 'Two cats.', zh: '两只猫。' },
      { art: '🐱🐱🐱', en: 'Three cats.', zh: '三只猫。' },
      { art: '🐱🐱🐱🐱', en: 'Four cats!', zh: '四只猫！' },
      { art: '🐱🐱🐱🐱🐱', en: 'Five cats!', zh: '五只猫！' },
      { art: '😹', en: 'Too many cats!', zh: '猫太多啦！' }
    ],
    quiz: [
      { q: '最后一共有几只猫？', opts: ['十只', '三只', '五只'], a: 2 },
      { q: '书里的数字是怎么变化的？', opts: ['一只一只变多', '一直都是一只', '一只一只变少'], a: 0 },
      { q: '最后一页说「太多」，是什么太多？', opts: ['狗', '猫', '帽子'], a: 1 }
    ]
  },
  {
    id: 'b6', lv: 'L1', tag: '公园 · 动作', title: 'In the Park', zh: '公园里',
    emoji: '🌳', color: '#A8D8B9',
    track: 'story',
    goal: '公园里的 5 个名词 + 一个追逐的小情节',
    trap: 'tree 的 /tr/ 要连着滑；kite 结尾的 /t/ 要出来，中间的 i 是长音，别读成「kit」。',
    summary: '前四页都是「A + 名词」，第五页出现我的狗，最后一页突然有了动作。可以让孩子猜猜狗为什么追鸭子。run 是后面很多故事的高频词，这里先听熟。',
    pre: [
      { art: '🌳', en: 'tree', zh: '树' },
      { art: '🪁', en: 'kite', zh: '风筝' },
      { art: '⚽', en: 'ball', zh: '球' },
      { art: '🦆', en: 'duck', zh: '鸭子' }
    ],
    sight: ['a', 'my'],
    newWords: [
      { w: 'tree', zh: '树' },
      { w: 'kite', zh: '风筝' },
      { w: 'ball', zh: '球' },
      { w: 'duck', zh: '鸭子' },
      { w: 'dog', zh: '狗' },
      { w: 'run', zh: '跑' }
    ],
    pages: [
      { art: '🌳', en: 'A tree.', zh: '一棵树。' },
      { art: '🪁', en: 'A kite.', zh: '一只风筝。' },
      { art: '⚽', en: 'A ball.', zh: '一个球。' },
      { art: '🦆', en: 'A duck.', zh: '一只鸭子。' },
      { art: '🐕', en: 'My dog!', zh: '我的狗！' },
      { art: '🐕🦆💨', en: 'Run, duck, run!', zh: '快跑，鸭子，快跑！' }
    ],
    quiz: [
      { q: '狗在追谁？', opts: ['球', '鸭子', '风筝'], a: 1 },
      { q: '书里没有提到什么？', opts: ['树', '球', '秋千'], a: 2 },
      { q: '最后一页让大家做什么？', opts: ['坐下', '快跑', '唱歌'], a: 1 }
    ]
  },
  {
    id: 'b7', lv: 'L2', tag: '书包 · 找一找', title: 'Ming\'s Bag', zh: '小明的书包',
    emoji: '🎒', color: '#BFD7EA',
    track: 'story',
    goal: '4 个 CVC 物品词 + 「in」的位置说法',
    trap: 'bag 的 /g/、cap 的 /p/、map 的 /p/ 都要轻轻收住，不能在后面加「呃」；a 的 /æ/ 嘴要横着张大，别读成「诶」。',
    summary: '这本书把四个短词放进同一个句型 A ... is in the bag，孩子读起来有节奏，又能反复练 /æ/。最后一页 Mimi 钻进包里是小包袱，读完可以让孩子拿真书包把东西一件件放进去，边放边说英文。',
    pre: [
      { art: '🖊️', en: 'pen', zh: '笔' },
      { art: '🧢', en: 'cap', zh: '帽子' },
      { art: '🗺️', en: 'map', zh: '地图' },
      { art: '👜', en: 'bag', zh: '书包' }
    ],
    sight: ['my', 'is', 'in', 'the', 'has', 'too'],
    newWords: [
      { w: 'bag', zh: '书包' },
      { w: 'pen', zh: '笔' },
      { w: 'cap', zh: '帽子' },
      { w: 'map', zh: '地图' }
    ],
    pages: [
      { art: '🎒', en: 'Ming has a bag.', zh: '小明有一个书包。' },
      { art: '🖊️', en: 'A pen is in the bag.', zh: '一支笔在书包里。' },
      { art: '🧢', en: 'A cap is in the bag.', zh: '一顶帽子在书包里。' },
      { art: '🗺️', en: 'A map is in the bag.', zh: '一张地图在书包里。' },
      { art: '🐱👜', en: 'Mimi is in the bag, too!', zh: '咪咪也在书包里！' },
      { art: '😸🎒', en: 'Ming has a big, big bag!', zh: '小明有一个好大好大的书包！' }
    ],
    quiz: [
      { q: '最后谁钻进了书包？', opts: ['小明', '爷爷', '咪咪'], a: 2 },
      { q: '书包里没有哪样东西？', opts: ['鞋子', '地图', '笔'], a: 0 },
      { q: '这是一个什么样的书包？', opts: ['很小', '很大', '很新'], a: 1 }
    ]
  },
  {
    id: 'b8', lv: 'L2', tag: '母鸡 · 短元音', title: 'A Hen and a Bun', zh: '母鸡和馒头',
    emoji: '🐔', color: '#FFE0A3',
    track: 'story',
    goal: 'e / u 两个短元音，配合 hen / egg / bun / sun',
    trap: 'hen 的 /e/ 嘴角略开，别读成 /æ/ 的 hen→han；bun / sun 的 /ʌ/ 是短促的「啊」，不要拖成「帮」。',
    summary: 'e 和 u 是中国孩子最容易混的两个短元音。这本书把 hen、egg 和 bun、sun 分开排在前后两半，孩子能听出「嘴型不一样」。最后母鸡叼走馒头，可以让孩子猜 Ming 会不会追上去。',
    pre: [
      { art: '🐔', en: 'hen', zh: '母鸡' },
      { art: '🥚', en: 'egg', zh: '蛋' },
      { art: '🍞', en: 'bun', zh: '馒头' },
      { art: '☀️', en: 'sun', zh: '太阳' }
    ],
    sight: ['a', 'an', 'the', 'is', 'on', 'up', 'has', 'and'],
    newWords: [
      { w: 'hen', zh: '母鸡' },
      { w: 'egg', zh: '蛋' },
      { w: 'bun', zh: '馒头' },
      { w: 'sun', zh: '太阳' },
      { w: 'mat', zh: '垫子' },
      { w: 'run', zh: '跑' }
    ],
    pages: [
      { art: '🐔', en: 'A hen is on a mat.', zh: '一只母鸡在垫子上。' },
      { art: '🥚', en: 'The hen has an egg.', zh: '母鸡有一个蛋。' },
      { art: '🍞', en: 'Ming has a bun.', zh: '小明有一个馒头。' },
      { art: '☀️', en: 'The sun is up.', zh: '太阳出来了。' },
      { art: '🐔🍞', en: 'The hen has the bun!', zh: '母鸡把馒头叼走了！' },
      { art: '🏃🐔', en: 'Ming and the hen run.', zh: '小明和母鸡跑了起来。' }
    ],
    quiz: [
      { q: '母鸡最后叼走了什么？', opts: ['蛋', '帽子', '馒头'], a: 2 },
      { q: '书里说太阳怎么样了？', opts: ['落下去了', '被云挡住了', '升起来了'], a: 2 },
      { q: '谁和母鸡一起跑？', opts: ['咪咪', '小明', '奶奶'], a: 1 }
    ]
  },
  {
    id: 'b9', lv: 'L2', tag: '小猫 · 心情', title: 'Mimi the Cat', zh: '小猫咪咪',
    emoji: '🐱', color: '#F6C6C6',
    track: 'story',
    goal: 'a 短元音 + -t/-p/-d 收尾，配合心情词',
    trap: 'cat / mat / hat 的 /æ/ 要横着张嘴；结尾的 -t、-p、-d 只做口型不喷气，但绝不能省掉，也不能读成「卡特」「帽特」。',
    summary: '这本用一个很小的情绪故事把五个 /æ/ 词串起来：咪咪先是难过，扣上帽子又开心了。读的时候可以让孩子跟着做表情，「sad」和「run and jump」用不同语气读，比单纯跟读更容易记住。',
    pre: [
      { art: '🐱', en: 'cat', zh: '猫' },
      { art: '🧶', en: 'nap', zh: '打盹' },
      { art: '🟫', en: 'mat', zh: '垫子' },
      { art: '🎩', en: 'hat', zh: '帽子' }
    ],
    sight: ['a', 'is', 'can', 'on', 'not', 'now', 'and'],
    newWords: [
      { w: 'cat', zh: '猫' },
      { w: 'nap', zh: '打盹' },
      { w: 'mat', zh: '垫子' },
      { w: 'hat', zh: '帽子' },
      { w: 'sad', zh: '难过' },
      { w: 'jump', zh: '跳' }
    ],
    pages: [
      { art: '🐱', en: 'Mimi is a cat.', zh: '咪咪是一只猫。' },
      { art: '🧶', en: 'Mimi can nap on a mat.', zh: '咪咪会在垫子上打盹。' },
      { art: '😿', en: 'Mimi is sad.', zh: '咪咪有点难过。' },
      { art: '🐱🧢', en: 'A hat is on Mimi!', zh: '一顶帽子扣在咪咪头上！' },
      { art: '😸', en: 'Mimi is not sad now.', zh: '咪咪现在不难过了。' },
      { art: '🐈', en: 'Mimi can run and jump.', zh: '咪咪会跑会跳了。' }
    ],
    quiz: [
      { q: '咪咪一开始怎么了？', opts: ['很生气', '睡着了', '有点难过'], a: 2 },
      { q: '什么扣在咪咪头上？', opts: ['帽子', '书包', '杯子'], a: 0 },
      { q: '最后咪咪做了什么？', opts: ['回窝睡觉', '吃东西', '跑和跳'], a: 2 }
    ]
  },
  {
    id: 'b10', lv: 'L2', tag: '小狗 · 泥地', title: 'Doudou Can Run', zh: '豆豆会跑',
    emoji: '🐕', color: '#C9E4C5',
    track: 'story',
    goal: 'o / u 短元音 + 动作词，练 -g/-d 韵尾',
    trap: 'log 的 /g/、mud 的 /d/ 都要收住；dog 不是「多格」，hot 的 /h/ 要送气，别读成「奥特」。',
    summary: '豆豆是后面几十本书里一直出现的狗。这一本先把它介绍给孩子：会跳、会跑、爱在泥里打滚、最后晒着太阳睡着。五个动作词都是 CVC，可以边做动作边读，特别适合坐不住的孩子。',
    pre: [
      { art: '🐕', en: 'dog', zh: '狗' },
      { art: '🪵', en: 'log', zh: '木头' },
      { art: '💦', en: 'mud', zh: '泥' },
      { art: '☀️', en: 'sun', zh: '太阳' }
    ],
    sight: ['a', 'is', 'can', 'on', 'in', 'the', 'and'],
    newWords: [
      { w: 'dog', zh: '狗' },
      { w: 'log', zh: '木头' },
      { w: 'mud', zh: '泥' },
      { w: 'hot', zh: '热的' },
      { w: 'jump', zh: '跳' },
      { w: 'run', zh: '跑' }
    ],
    pages: [
      { art: '🐕', en: 'Doudou is a dog.', zh: '豆豆是一只狗。' },
      { art: '🪵', en: 'Doudou can jump on a log.', zh: '豆豆能跳到一根木头上。' },
      { art: '💦', en: 'Doudou is in the mud.', zh: '豆豆在泥地里。' },
      { art: '🏃', en: 'Doudou can run and run.', zh: '豆豆跑呀跑呀。' },
      { art: '☀️', en: 'The sun is hot.', zh: '太阳晒得热热的。' },
      { art: '🐶💤', en: 'Doudou naps in the sun.', zh: '豆豆在太阳底下打盹。' }
    ],
    quiz: [
      { q: '豆豆在哪儿打滚？', opts: ['沙发上', '泥地里', '水里'], a: 1 },
      { q: '豆豆跳上了什么？', opts: ['一块石头', '一根木头', '一张桌子'], a: 1 },
      { q: '最后豆豆在做什么？', opts: ['吃骨头', '追猫', '晒太阳打盹'], a: 2 }
    ]
  },
  {
    id: 'b11', lv: 'L2', tag: '🔬 辨音专项', title: 'Cat or Cap?', zh: '猫还是帽子',
    emoji: '🔬', color: '#D8C7F0',
    track: 'drill',
    goal: '听清 a / e / i / u 四个短元音，用最小对立词对比',
    trap: '/æ/ 嘴横着张大；/e/ 嘴角略开；/ɪ/ 短而松，不是长音「衣」；/ʌ/ 短促。中文里没有 /æ/，最容易把 cat 读成「凯特」。',
    summary: '这一册不讲故事，专门练耳朵。每一页两个词只差中间一个元音：cat / cap、pen / pin、pan / pen、bun / sun。家长可以念一个词让孩子指，念错也没关系，重点是听出「不一样」。第 3 站之后还会再练一次长元音，那时就能对比 ship / sheep 了。',
    pre: [
      { art: '🐱', en: 'cat', zh: '猫' },
      { art: '🧢', en: 'cap', zh: '帽子' },
      { art: '✏️', en: 'pen', zh: '笔' },
      { art: '📌', en: 'pin', zh: '别针' }
    ],
    sight: ['a', 'two', 'say', 'them'],
    newWords: [
      { w: 'cap', zh: '帽子' },
      { w: 'pen', zh: '笔' },
      { w: 'pin', zh: '别针' },
      { w: 'pan', zh: '平底锅' },
      { w: 'bun', zh: '馒头' },
      { w: 'sun', zh: '太阳' },
      { w: 'bad', zh: '坏的' },
      { w: 'sad', zh: '难过的' }
    ],
    pages: [
      { art: '🐱🧢', en: 'A cat. A cap. Two words.', zh: '一只猫。一顶帽子。两个词。' },
      { art: '😿', en: 'A bad cat. A sad cat.', zh: '一只坏猫。一只难过的猫。' },
      { art: '✏️📌', en: 'A pen. A pin. Two words.', zh: '一支笔。一枚别针。两个词。' },
      { art: '🍳✏️', en: 'A pan. A pen. Two words.', zh: '一口锅。一支笔。两个词。' },
      { art: '🍞☀️', en: 'A bun. A sun. Two words.', zh: '一个馒头。一个太阳。两个词。' },
      { art: '🔤', en: 'Cat, cap, pen, pin, bun, sun. Say them!', zh: '猫、帽子、笔、别针、馒头、太阳。把它们念一遍！' }
    ],
    quiz: [
      { q: 'cat 和 cap 只差哪个音？', opts: ['最后一个音', '中间的音', '第一个音'], a: 0 },
      { q: 'pen 和 pin 的中间那个音一样吗？', opts: ['两个词完全同音', '一样', '不一样'], a: 2 },
      { q: '这一册主要在练什么？', opts: ['学造句', '听清短元音', '记单词拼写'], a: 1 }
    ]
  },
  {
    id: 'b12', lv: 'L2', tag: '🌍 米饭从哪来', title: 'Rice and Buns', zh: '米饭和馒头',
    emoji: '🍚', color: '#F7E2B8',
    track: 'info',
    goal: '用最少的词读懂「米要煮才成饭」，认识一个整体认读词',
    trap: 'pot / hot / cup 结尾的 -t、-p 只做口型；rice 现在先整体认读，结尾的 e 不发音，第 6 站「魔法 e」会专门讲它为什么让 i 读长音。',
    summary: '这是一本小小的科普：米放进锅、锅变热、饭盛进碗，馒头和米饭不是一回事。rice 是本站唯一提前出现的「不规则词」，我们把它标成整体认读，不假装孩子能拼。读完可以让孩子说说家里晚饭吃的是米饭还是馒头。',
    pre: [
      { art: '🌾', en: 'rice', zh: '米／米饭' },
      { art: '🍲', en: 'pot', zh: '锅' },
      { art: '🥣', en: 'cup', zh: '碗／杯' },
      { art: '🍞', en: 'bun', zh: '馒头' }
    ],
    sight: ['rice', 'are', 'this', 'not'],
    newWords: [
      { w: 'pot', zh: '锅' },
      { w: 'cup', zh: '碗' },
      { w: 'bun', zh: '馒头' },
      { w: 'hot', zh: '热的' }
    ],
    pages: [
      { art: '🌾', en: 'This is rice.', zh: '这是米。' },
      { art: '🍚🍲', en: 'Rice is in a pot.', zh: '米在锅里。' },
      { art: '🔥', en: 'The pot is hot.', zh: '锅热了。' },
      { art: '🥣', en: 'Rice is in my cup.', zh: '饭盛到了我的碗里。' },
      { art: '🍞', en: 'A bun is not rice.', zh: '馒头不是米饭。' },
      { art: '😋', en: 'Rice and buns are fun.', zh: '米饭和馒头都好吃。' }
    ],
    quiz: [
      { q: '米放在哪里煮？', opts: ['书包里', '锅里', '杯子里'], a: 1 },
      { q: '书里说锅怎么样了？', opts: ['热了', '空了', '破了'], a: 0 },
      { q: '书里说什么不是米饭？', opts: ['饭', '馒头', '米'], a: 1 }
    ]
  },
  {
    id: 'b13', lv: 'L3', tag: '菜市场 · sh', title: 'The Fish Shop', zh: '鱼店',
    emoji: '🐟', color: '#BFD7EA',
    track: 'story',
    goal: 'sh 一个音，配上逛菜市场的日常',
    trap: 'sh 要把舌头抬起来、嘴唇略圆，气流从中间走；不能读成「西」，也不能读成 s 的「丝」。fish 结尾的 /ʃ/ 不要再加一个「呃」。',
    summary: '小明和妹妹去鱼店买鱼，奶奶晚上做鱼。这是孩子熟悉的场景，所以即使英文是新词，意思一下子就对上了。sh 在同一页出现 fish、shop、shell、fresh，读几遍就能听出共同点。可以让孩子找一找这一本里还有哪个词带 sh。',
    pre: [
      { art: '🐟', en: 'fish', zh: '鱼' },
      { art: '🏪', en: 'shop', zh: '店' },
      { art: '💰', en: 'cash', zh: '钱' },
      { art: '🐚', en: 'shell', zh: '贝壳' }
    ],
    sight: ['and', 'a', 'is', 'in', 'the', 'has', 'to', 'go', 'now'],
    newWords: [
      { w: 'fish', zh: '鱼' },
      { w: 'shop', zh: '店' },
      { w: 'cash', zh: '钱' },
      { w: 'shell', zh: '贝壳' },
      { w: 'fresh', zh: '新鲜的' }
    ],
    pages: [
      { art: '🐟🏪', en: 'Ming and Lili go to a fish shop.', zh: '小明和莉莉去鱼店。' },
      { art: '🐠', en: 'A big fish is in the shop.', zh: '店里有一条大鱼。' },
      { art: '💰', en: 'Ming has the cash.', zh: '小明拿着钱。' },
      { art: '🐟🐚', en: 'Ming picks a fish. Lili picks a shell.', zh: '小明挑了条鱼，莉莉捡了个贝壳。' },
      { art: '✨🐟', en: 'The fish is fresh!', zh: '这鱼很新鲜！' },
      { art: '👵🐟', en: 'Grandma has it now.', zh: '现在鱼到了奶奶手里。' },
      { art: '😋', en: 'Ming and Lili nod.', zh: '小明和莉莉直点头。' }
    ],
    quiz: [
      { q: '小明和莉莉去了什么店？', opts: ['鞋店', '鱼店', '书店'], a: 1 },
      { q: '莉莉捡了什么？', opts: ['石头', '帽子', '贝壳'], a: 2 },
      { q: '鱼最后到了谁手里？', opts: ['豆豆', '爷爷', '奶奶'], a: 2 }
    ]
  },
  {
    id: 'b14', lv: 'L3', tag: '小鸡 · ch', title: 'Mimi and the Chick', zh: '咪咪和小鸡',
    emoji: '🐥', color: '#FFE0A3',
    track: 'story',
    goal: 'ch /tʃ/ 与 ck /k/ 分开，练「一个字母组合只发一个音」',
    trap: 'ch 是 /tʃ/，像「七」但要卷舌送气；ck 只发一个 /k/，不是「克克」。much / munch / checks 三个词的尾音都别吞。',
    summary: '一只小鸡蹲在垫子上吃碎屑，咪咪凑过来一起吃，最后奶奶来数了数。这一本把 ch 和 ck 放在同一页对比：chick 开头是 ch、结尾是 ck，正好可以让孩子指出来「同一个词里有两种组合」。',
    pre: [
      { art: '🐥', en: 'chick', zh: '小鸡' },
      { art: '🌽', en: 'chip', zh: '碎屑' },
      { art: '😋', en: 'munch', zh: '嚼' },
      { art: '🔍', en: 'checks', zh: '查看' }
    ],
    sight: ['a', 'the', 'is', 'on', 'by', 'has', 'too', 'and', 'not'],
    newWords: [
      { w: 'chick', zh: '小鸡' },
      { w: 'chip', zh: '碎屑' },
      { w: 'munch', zh: '嚼' },
      { w: 'much', zh: '许多' },
      { w: 'checks', zh: '查看' }
    ],
    pages: [
      { art: '🐥', en: 'A chick is on a mat.', zh: '一只小鸡在垫子上。' },
      { art: '🐱🐥', en: 'Mimi sits by the chick.', zh: '咪咪坐在小鸡旁边。' },
      { art: '🌽', en: 'The chick has a chip.', zh: '小鸡有一小块碎屑。' },
      { art: '🐱🌽', en: 'Mimi has a chip, too.', zh: '咪咪也有一小块。' },
      { art: '🐥🐱', en: 'The chick and Mimi munch.', zh: '小鸡和咪咪一起嚼。' },
      { art: '👵', en: 'Much too much! Grandma checks.', zh: '太多啦！奶奶来查看。' },
      { art: '😺', en: 'The chick is not sad.', zh: '小鸡一点也不难过。' }
    ],
    quiz: [
      { q: '小鸡在吃什么？', opts: ['米饭', '碎屑', '虫子'], a: 1 },
      { q: '谁和小鸡一起吃？', opts: ['豆豆', '莉莉', '咪咪'], a: 2 },
      { q: '最后谁过来看它们？', opts: ['爷爷', '小明', '奶奶'], a: 2 }
    ]
  },
  {
    id: 'b15', lv: 'L3', tag: '鸭子 · ck', title: 'The Duck and the Sock', zh: '鸭子和袜子',
    emoji: '🦆', color: '#C9E4C5',
    track: 'story',
    goal: 'ck 只发 /k/，且前面的元音一定读短音',
    trap: '-ck 里的 c 和 k 合起来只发一个 /k/，千万别读成「达克-克」；duck / rock / sock / back / pick 的元音都要短促收住。',
    summary: '鸭子叼走了莉莉的红袜子，最后孩子们把袜子拿了回来。这本书把五个 -ck 词放进一条完整的小情节里，孩子读完能记住「ck 是一个音」，而不是背一条规则。',
    pre: [
      { art: '🦆', en: 'duck', zh: '鸭子' },
      { art: '🪨', en: 'rock', zh: '石头' },
      { art: '🧦', en: 'sock', zh: '袜子' },
      { art: '⬅️', en: 'back', zh: '回来／背部' }
    ],
    sight: ['a', 'is', 'on', 'the', 'has', 'up', 'it', 'and'],
    newWords: [
      { w: 'duck', zh: '鸭子' },
      { w: 'rock', zh: '石头' },
      { w: 'sock', zh: '袜子' },
      { w: 'back', zh: '背部' },
      { w: 'picks', zh: '捡起' }
    ],
    pages: [
      { art: '🦆🪨', en: 'A duck is on a rock.', zh: '一只鸭子站在石头上。' },
      { art: '🦆', en: 'The duck has a wet back.', zh: '鸭子的背湿湿的。' },
      { art: '🧦', en: 'Lili has a red sock.', zh: '莉莉有一只红袜子。' },
      { art: '🪨', en: 'Ming picks up a rock.', zh: '小明捡起一块石头。' },
      { art: '🦆🧦', en: 'The duck picks up the sock!', zh: '鸭子把袜子叼起来了！' },
      { art: '🦆🧦', en: 'The duck sits on the sock.', zh: '鸭子坐在袜子上。' },
      { art: '👦👧', en: 'Ming and Lili get it back.', zh: '小明和莉莉把袜子拿了回来。' }
    ],
    quiz: [
      { q: '鸭子叼走了什么？', opts: ['红袜子', '帽子', '石头'], a: 0 },
      { q: '谁捡起了一块石头？', opts: ['莉莉', '小明', '奶奶'], a: 1 },
      { q: '最后袜子被谁拿回来了？', opts: ['爷爷', '两个孩子', '鸭子'], a: 1 }
    ]
  },
  {
    id: 'b16', lv: 'L3', tag: '唱歌 · ng', title: 'The Long Song', zh: '长长的歌',
    emoji: '🎶', color: '#D8C7F0',
    track: 'story',
    goal: 'ng 后舌抵软腭，一个音；不要在后面加 /g/',
    trap: 'sing / song / long / ring / king 的 ng 是鼻音 /ŋ/，舌根抬起来碰软腭，声音从鼻子走；不能读成「sing-格」，也不能读成「森」。',
    summary: '奶奶唱一首很长的老歌，莉莉跟着唱，咪咪的铃铛叮当作响，豆豆跑进来当「国王」。整本都是 ng 词，读起来像绕口令，适合亲子一起拍着手念。中文里「唱歌」的「歌」不带鼻音，所以这一站要多听几遍。',
    pre: [
      { art: '🎵', en: 'sing', zh: '唱' },
      { art: '📜', en: 'long', zh: '长的' },
      { art: '🔔', en: 'ring', zh: '铃铛' },
      { art: '👑', en: 'king', zh: '国王' }
    ],
    sight: ['a', 'the', 'is', 'has', 'too', 'for', 'we', 'at', 'night'],
    newWords: [
      { w: 'long', zh: '长的' },
      { w: 'song', zh: '歌' },
      { w: 'ring', zh: '铃铛' },
      { w: 'king', zh: '国王' },
      { w: 'sings', zh: '唱' }
    ],
    pages: [
      { art: '👵🎵', en: 'Grandma sings a long, long song.', zh: '奶奶唱了一首好长好长的歌。' },
      { art: '👧🎵', en: 'Lili sings the song, too.', zh: '莉莉也跟着唱。' },
      { art: '🐱🔔', en: 'Mimi has a ring.', zh: '咪咪有一个铃铛。' },
      { art: '🔔', en: 'The ring goes ding!', zh: '铃铛叮的一响！' },
      { art: '🐕👑', en: 'Doudou runs in. He is the king!', zh: '豆豆跑进来，他当国王！' },
      { art: '🎶', en: 'A long song for us.', zh: '一首长长的歌送给我们。' },
      { art: '🌙', en: 'We sing it at night.', zh: '晚上我们又唱了一遍。' }
    ],
    quiz: [
      { q: '谁唱了那首很长很长的歌？', opts: ['奶奶', '莉莉', '小明'], a: 0 },
      { q: '什么东西叮的一响？', opts: ['铃铛', '鼓', '门铃'], a: 0 },
      { q: '豆豆跑进来当了什么？', opts: ['国王', '小狗', '歌手'], a: 0 }
    ]
  },
  {
    id: 'b17', lv: 'L3', tag: '🔬 咬舌专项', title: 'Thin and Thick', zh: '薄和厚',
    emoji: '🔬', color: '#F2B5D4',
    track: 'drill',
    goal: 'th /θ/ 的舌头位置，用最小对立词练耳朵',
    trap: '把舌尖轻轻放在上下门牙中间，让气流从缝里擦出来：thin / three / thank。不能读成 s（thin→sin），也不能读成 t（three→tree）；thick 结尾的 ck 只发一个 /k/。',
    summary: '这是全套书里最需要「看口型」的一册。中文没有咬舌音，孩子几乎一定会用 s 或 t 代替，所以不要急着纠正拼写，先让他看着大人的舌尖位置模仿。this / that / the 里的 th 是浊音 /ð/，声带要振动，和 thin 的清音 /θ/ 不完全一样，本站先整体认读。',
    pre: [
      { art: '📏', en: 'thin', zh: '薄的' },
      { art: '📕', en: 'thick', zh: '厚的' },
      { art: '3️⃣', en: 'three', zh: '三' },
      { art: '🙏', en: 'thank', zh: '谢谢' }
    ],
    sight: ['this', 'that', 'one', 'say', 'them'],
    newWords: [
      { w: 'thin', zh: '薄的' },
      { w: 'thick', zh: '厚的' },
      { w: 'thank', zh: '谢谢' }
    ],
    pages: [
      { art: '📏📕', en: 'This is thin. That is thick.', zh: '这个是薄的，那个是厚的。' },
      { art: '🔢', en: 'Three thin things. Three thick things.', zh: '三样薄的东西，三样厚的东西。' },
      { art: '📖', en: 'A thick book. A thin book.', zh: '一本厚书，一本薄书。' },
      { art: '🐱', en: 'The thin one is Mimi\'s.', zh: '薄的那本是咪咪的。' },
      { art: '👦', en: 'The thick one is Ming\'s.', zh: '厚的那本是小明的。' },
      { art: '🗣️', en: 'Say them: thin, thick, three, thank.', zh: '念一念：薄、厚、三、谢谢。' },
      { art: '✅', en: 'Now we can say them all.', zh: '现在我们都会说了。' }
    ],
    quiz: [
      { q: '这一册主要练哪个音？', opts: ['sh', '咬舌的 th', 'ng'], a: 1 },
      { q: 'thin 和 thick 的意思一样吗？', opts: ['都是数字', '一样', '相反'], a: 2 },
      { q: '发 th 时舌尖放在哪里？', opts: ['抵住上颚', '卷起来', '上下门牙中间'], a: 2 }
    ]
  },
  {
    id: 'b18', lv: 'L3', tag: '🌍 小鸡出壳', title: 'How a Chick Grows', zh: '小鸡怎么长大',
    emoji: '🐣', color: '#F7E2B8',
    track: 'info',
    goal: '读懂「蛋 → 出壳 → 长羽毛 → 会啄食」的顺序',
    trap: 'chick 的 ch 和结尾的 ck 是两个不同的组合；wings / sing 的 ng 从鼻子出声。别把 chick 读成「奇克克」。',
    summary: '这本小科普讲一件孩子能亲眼看见的事：小鸡在蛋里，啄开壳出来时身上是湿的，晒干后长出翅膀，会自己啄小虫，长大就是一只母鸡。中文补充一点：蛋要一直保持暖和，大约二十一天才会出壳。读完可以让孩子把四幅图按顺序排一遍。',
    pre: [
      { art: '🥚', en: 'egg', zh: '蛋' },
      { art: '🐥', en: 'chick', zh: '小鸡' },
      { art: '🐚', en: 'shell', zh: '蛋壳' },
      { art: '🪽', en: 'wings', zh: '翅膀' }
    ],
    sight: ['a', 'an', 'the', 'is', 'in', 'at', 'it', 'can', 'out', 'now'],
    newWords: [
      { w: 'egg', zh: '蛋' },
      { w: 'shell', zh: '壳' },
      { w: 'wings', zh: '翅膀' },
      { w: 'bug', zh: '小虫' }
    ],
    pages: [
      { art: '🥚', en: 'A chick is in an egg.', zh: '一只小鸡在蛋里。' },
      { art: '🐣', en: 'The chick picks at the shell.', zh: '小鸡啄着蛋壳。' },
      { art: '💦', en: 'It comes out. It is wet.', zh: '它出来了，身上湿湿的。' },
      { art: '☀️', en: 'The sun is up. It is hot.', zh: '太阳出来了，暖洋洋的。' },
      { art: '🐥', en: 'A chick has wings. It can sing.', zh: '小鸡有翅膀，会叽叽叫。' },
      { art: '🐛', en: 'It can pick up a bug.', zh: '它会啄起一只小虫。' },
      { art: '🐔', en: 'The chick is a hen now.', zh: '小鸡长成了一只母鸡。' }
    ],
    quiz: [
      { q: '小鸡是从哪里出来的？', opts: ['水里', '泥里', '蛋里'], a: 2 },
      { q: '刚出壳时身上怎么样？', opts: ['湿湿的', '干干的', '脏脏的'], a: 0 },
      { q: '小鸡长大以后是什么？', opts: ['小鸟', '鸭子', '母鸡'], a: 2 }
    ]
  },
  {
    id: 'b19', lv: 'L4', tag: '爷爷 · 鼓点', title: 'Grandpa\'s Drum', zh: '爷爷的鼓',
    emoji: '🥁', color: '#F6C6C6',
    track: 'story',
    goal: 'dr / cl / st / gr 连缀，配合一段鼓点游戏',
    trap: 'drum 不是「得–拉姆」，/d/ 和 /r/ 之间不能有元音；stop / step 开头的 /st/ 也不要读成「伊斯–托普」。整段连缀要一口气滑过去，像说一个字。',
    summary: '爷爷敲鼓，两个孩子拍手，豆豆跑进来停在鼓前，最后大家一起玩「拍两下、踏两步、停」。这本书把连缀放进有节奏的鼓点里，孩子会不自觉地跟着念快，一念快就不容易塞进多余的「呃」——比单独纠正口型有效。',
    pre: [
      { art: '🥁', en: 'drum', zh: '鼓' },
      { art: '👏', en: 'clap', zh: '拍手' },
      { art: '👣', en: 'step', zh: '踏步' },
      { art: '🛑', en: 'stop', zh: '停' }
    ],
    sight: ['a', 'the', 'in', 'he', 'it', 'his', 'and', 'at', 'too', 'again'],
    newWords: [
      { w: 'drum', zh: '鼓' },
      { w: 'clap', zh: '拍手' },
      { w: 'step', zh: '踏步' },
      { w: 'stop', zh: '停' },
      { w: 'drop', zh: '水滴' }
    ],
    pages: [
      { art: '🥁', en: 'Grandpa has a big drum in the shed.', zh: '爷爷在小棚子里放着一面大鼓。' },
      { art: '👴🥁', en: 'He taps it. Tap, tap, clap!', zh: '他轻轻敲：嗒、嗒、啪！' },
      { art: '👦👧', en: 'Ming claps his hands. Lili claps, too.', zh: '小明拍手，莉莉也拍手。' },
      { art: '🐕', en: 'Doudou runs in and stops at the drum.', zh: '豆豆跑进来，在鼓前停住。' },
      { art: '🛑', en: 'Grandpa stops. Step, step, stop.', zh: '爷爷停了。踏、踏、停。' },
      { art: '💧', en: 'A drop hits the big drum.', zh: '一滴水落在大鼓面上。' },
      { art: '😄', en: 'Grandpa grins at Ming and Lili.', zh: '爷爷冲两个孩子咧嘴一笑。' },
      { art: '🎵', en: 'Clap, clap, step, step, stop. Again!', zh: '拍、拍、踏、踏、停。再来一次！' }
    ],
    quiz: [
      { q: '爷爷在小棚子里放着什么？', opts: ['一把琴', '一面鼓', '一个球'], a: 1 },
      { q: '豆豆跑进来以后做了什么？', opts: ['睡着了', '把鼓叼走', '在鼓前停住'], a: 2 },
      { q: '最后大家一起玩的是什么？', opts: ['拍手踏步再停住', '唱歌', '数数'], a: 0 }
    ]
  },
  {
    id: 'b20', lv: 'L4', tag: '台阶 · 小猫', title: 'Mimi on the Steps', zh: '台阶上的咪咪',
    emoji: '🪜', color: '#BFD7EA',
    track: 'story',
    goal: 'st / sl / gr / fl 连缀，配合一个「差点滑倒」的小情节',
    trap: 'steps / slips / grabs / flat 都要一口气读完；尤其 s 开头的连缀，前面不能补一个「伊」，不是「伊–斯–戴普斯」。',
    summary: '咪咪坐在晒热的台阶上，脚下一滑，赶紧抓住台阶，最后稳稳落在平平的台面上。这一本用同一个 /st/ 串起 sits / steps / step / still，孩子会在重复里自然把连缀说顺。',
    pre: [
      { art: '🪜', en: 'steps', zh: '台阶' },
      { art: '🐾', en: 'slips', zh: '打滑' },
      { art: '✋', en: 'grabs', zh: '抓住' },
      { art: '⬜', en: 'flat', zh: '平的' }
    ],
    sight: ['a', 'the', 'on', 'is', 'up', 'are', 'and', 'she', 'in', 'it', 'no', 'at'],
    newWords: [
      { w: 'steps', zh: '台阶' },
      { w: 'slips', zh: '打滑' },
      { w: 'grabs', zh: '抓住' },
      { w: 'flat', zh: '平的' },
      { w: 'string', zh: '线' }
    ],
    pages: [
      { art: '🪜🐱', en: 'Mimi sits on the steps.', zh: '咪咪坐在台阶上。' },
      { art: '☀️', en: 'The sun is up. The steps are hot and dry.', zh: '太阳出来了，台阶又热又干。' },
      { art: '🐾', en: 'Mimi slips. She grabs the step.', zh: '咪咪一滑，赶紧抓住台阶。' },
      { art: '🧶', en: 'A string is on the step.', zh: '台阶上有一根线。' },
      { art: '👧', en: 'Lili picks it up and claps.', zh: '莉莉把线捡起来，拍了拍手。' },
      { art: '🐱', en: 'Mimi jumps and lands on the flat step.', zh: '咪咪一跳，落在平平的台阶上。' },
      { art: '😸', en: 'No slip, no fall. Mimi is glad.', zh: '没滑倒，也没摔着，咪咪挺得意。' },
      { art: '👵👏', en: 'Grandma claps at the steps.', zh: '奶奶在台阶边拍手。' }
    ],
    quiz: [
      { q: '咪咪一开始坐在哪里？', opts: ['窗台上', '台阶上', '沙发上'], a: 1 },
      { q: '台阶上有一根什么？', opts: ['线', '树枝', '羽毛'], a: 0 },
      { q: '最后咪咪怎么样了？', opts: ['摔了一跤', '稳稳落在台阶上', '跑回家了'], a: 1 }
    ]
  },
  {
    id: 'b21', lv: 'L4', tag: '池塘 · 青蛙', title: 'The Frog and the Crab', zh: '青蛙和螃蟹',
    emoji: '🐸', color: '#C9E4C5',
    track: 'story',
    goal: 'fr / cr / sw / spl 连缀，含三个辅音的 splash',
    trap: 'frog 的 /fr/、crab 的 /kr/ 中间不加元音；splash 一口气有 s-p-l 三个辅音，是全站最难的一个开头，先慢慢连，再提速，别拆成「斯–普–拉什」。',
    summary: '青蛙蹲在湿木头上，螃蟹过来约它一起游，两个在池塘里扑腾，最后并排休息。三个辅音的 splash 只在第 5 页出现一次，前面几页先把两个辅音的连缀读熟，孩子不会一上来就卡住。',
    pre: [
      { art: '🐸', en: 'frog', zh: '青蛙' },
      { art: '🦀', en: 'crab', zh: '螃蟹' },
      { art: '🏊', en: 'swim', zh: '游泳' },
      { art: '💦', en: 'splash', zh: '扑腾水' }
    ],
    sight: ['a', 'on', 'in', 'the', 'and', 'by', 'to', 'too', 'they', 'it', 'is', 'quick'],
    newWords: [
      { w: 'frog', zh: '青蛙' },
      { w: 'crab', zh: '螃蟹' },
      { w: 'swim', zh: '游泳' },
      { w: 'splash', zh: '扑腾水' },
      { w: 'branch', zh: '树枝' }
    ],
    pages: [
      { art: '🐸🪵', en: 'A frog sits on a wet log in the sun.', zh: '一只青蛙蹲在晒得到的湿木头上。' },
      { art: '🦀', en: 'A crab stops by the log and blinks.', zh: '一只螃蟹在木头边停下来，眨眨眼。' },
      { art: '💬', en: 'The crab asks the frog to swim.', zh: '螃蟹约青蛙一起游泳。' },
      { art: '🏊', en: 'The frog swims. The crab swims, too.', zh: '青蛙游起来，螃蟹也游起来。' },
      { art: '💦', en: 'They splash in the pond. It is fun.', zh: '它们在池塘里扑腾，真好玩。' },
      { art: '🐟', en: 'A fish swims by. It is quick.', zh: '一条鱼游过，快得很。' },
      { art: '🌿', en: 'The frog rests on a branch.', zh: '青蛙趴到一根树枝上歇着。' },
      { art: '😌', en: 'The crab and the frog rest.', zh: '螃蟹和青蛙一起休息。' }
    ],
    quiz: [
      { q: '一开始谁蹲在湿木头上？', opts: ['鱼', '青蛙', '螃蟹'], a: 1 },
      { q: '螃蟹约青蛙去做什么？', opts: ['游泳', '找虫子', '跳高'], a: 0 },
      { q: '最后两个在做什么？', opts: ['追鱼', '一起休息', '回家'], a: 1 }
    ]
  },
  {
    id: 'b22', lv: 'L4', tag: '春游 · 大巴', title: 'The Class Trip', zh: '全班去春游',
    emoji: '🚌', color: '#FFD9A0',
    track: 'story',
    goal: 'tr / st / gr / dr 连缀，配合校园生活',
    trap: 'trip 的 /tr/ 别读成「吃–瑞普」或「特儿–瑞普」；stand / still 的 /st/ 前面不要补元音；grass 的 /gr/ 连着滑。',
    summary: '全班坐大巴出去春游：在大树下停一停、坐在草地上拍手、站好唱一首歌，莉莉的包掉了小明帮她接住。场景是中国孩子每学期都有的集体活动，所以即使句子变长了，意思仍然靠画面就能猜到。',
    pre: [
      { art: '🚌', en: 'trip', zh: '出行' },
      { art: '🧍', en: 'stand', zh: '站' },
      { art: '🌿', en: 'grass', zh: '草地' },
      { art: '✋', en: 'grabs', zh: '接住' }
    ],
    sight: ['our', 'a', 'on', 'we', 'by', 'and', 'at', 'it', 'go', 'back', 'what'],
    newWords: [
      { w: 'trip', zh: '出行' },
      { w: 'stand', zh: '站' },
      { w: 'still', zh: '不动' },
      { w: 'grass', zh: '草地' },
      { w: 'grabs', zh: '接住' }
    ],
    pages: [
      { art: '🚌', en: 'Our class goes on a big trip.', zh: '我们全班去春游。' },
      { art: '🚌', en: 'We get on a big red bus.', zh: '我们上了一辆红色大巴。' },
      { art: '👦👧', en: 'Ming sits by Lili and grins.', zh: '小明坐在莉莉旁边，笑得合不拢嘴。' },
      { art: '🌳', en: 'We stop at a big tree.', zh: '我们在一棵大树下停下来。' },
      { art: '🌿', en: 'We sit on the grass and clap.', zh: '我们坐在草地上拍手。' },
      { art: '🎶', en: 'We stand still and sing.', zh: '我们站得直直的，唱了一首歌。' },
      { art: '🎒', en: 'Lili drops her bag. Ming grabs it.', zh: '莉莉的包掉了，小明一把接住。' },
      { art: '🏫', en: 'We go back. What a grand day!', zh: '我们回学校了。多棒的一天！' }
    ],
    quiz: [
      { q: '全班坐什么出门？', opts: ['火车', '自行车', '大巴'], a: 2 },
      { q: '谁的包掉了？', opts: ['莉莉', '小明', '老师'], a: 0 },
      { q: '站好以后大家做了什么？', opts: ['吃点心', '拍照', '唱歌'], a: 2 }
    ]
  },
  {
    id: 'b23', lv: 'L4', tag: '🔬 连缀专项', title: 'Stop! Clap! Swim!', zh: '别加「呃」',
    emoji: '🔬', color: '#D8C7F0',
    track: 'drill',
    goal: '把「辅音 + 辅音」读成一个整体，中间不塞元音',
    trap: '中文每个字都是「辅音 + 元音」，孩子会本能地给每个辅音配一个「呃」。练的时候先把手放在桌上一滑：stop 是一下，不是三下。s 开头的连缀尤其不要在前面加「伊」。',
    summary: '这一册把「错读法」直接写在页面上对照：suh-top / kuh-lap / fuh-rog。让孩子先故意按错的读一遍，再按对的读一遍，耳朵立刻能听出差别——这比大人反复说「别加音」有用得多。第 6 页把六个词连起来念，能做到没有一个「呃」就很棒了。',
    pre: [
      { art: '🛑', en: 'stop', zh: '停' },
      { art: '👏', en: 'clap', zh: '拍手' },
      { art: '🏊', en: 'swim', zh: '游泳' },
      { art: '🐸', en: 'frog', zh: '青蛙' }
    ],
    sight: ['not', 'one', 'two', 'then', 'a', 'say', 'them', 'no', 'now', 'you', 'can', 'sound', 'sounds'],
    newWords: [
      { w: 'stop', zh: '停' },
      { w: 'clap', zh: '拍手' },
      { w: 'swim', zh: '游泳' },
      { w: 'frog', zh: '青蛙' }
    ],
    pages: [
      { art: '🛑', en: 'Stop. Not suh-top. Just one word, stop.', zh: '停。不是「斯呃–托普」。就一个词，stop。' },
      { art: '👏', en: 'Clap. Not kuh-lap. Clap, clap, clap.', zh: '拍。不是「克呃–拉普」。拍、拍、拍。' },
      { art: '🐸', en: 'Frog. Not fuh-rog. One word, frog.', zh: '青蛙。不是「弗呃–罗格」。一个词，frog。' },
      { art: '🏊', en: 'Swim. Two lips, then a hum. Swim.', zh: '游泳。两片嘴唇先合上，再哼一下。swim。' },
      { art: '🌳', en: 'Tree. One sound, not two sounds. Tree, tree, tree.', zh: '树。是一个音，不是两个音。tree、tree、tree。' },
      { art: '🔤', en: 'Step, stop, clap, swim, frog, tree. Say them!', zh: '踏、停、拍、游、蛙、树。把它们念一遍！' },
      { art: '✅', en: 'No extra uh. Now you can say them.', zh: '不多加一个「呃」。现在你都会说了。' }
    ],
    quiz: [
      { q: '读 stop 时中间能加一个「呃」吗？', opts: ['能', '加两个更好', '不能'], a: 2 },
      { q: '这一册主要在练什么？', opts: ['记字母', '辅音连着读', '学标点'], a: 1 },
      { q: 'frog 一共有几个音节？', opts: ['三个', '一个', '两个'], a: 1 }
    ]
  },
  {
    id: 'b24', lv: 'L4', tag: '🌍 青蛙长大', title: 'How a Frog Grows', zh: '青蛙怎么长大',
    emoji: '🐸', color: '#F7E2B8',
    track: 'info',
    goal: '读懂「蛋 → 会游 → 长腿 → 能跳上岸」的顺序',
    trap: 'frog / swim / still / splash 都是本站的连缀词；legs 结尾的 -gs 要连着收住，别读成「累格思」。',
    summary: '这本小科普讲青蛙的一生：蛋在水里，刚孵出来的小家伙没有腿、只会游，后来长出腿，会跳也能游，最后蹲在木头上。中文可以补一句：它小时候用鳃呼吸，长大后主要用肺和皮肤呼吸，所以既离不开水，也能上岸。这本没有用 tadpole 这个难词，等第 9 站再学。',
    pre: [
      { art: '🥚', en: 'eggs', zh: '蛋' },
      { art: '💧', en: 'pond', zh: '池塘' },
      { art: '🏊', en: 'swim', zh: '游泳' },
      { art: '🦵', en: 'legs', zh: '腿' }
    ],
    sight: ['the', 'are', 'and', 'it', 'can', 'no', 'then', 'but', 'now', 'not'],
    newWords: [
      { w: 'pond', zh: '池塘' },
      { w: 'eggs', zh: '蛋' },
      { w: 'legs', zh: '腿' },
      { w: 'swim', zh: '游泳' },
      { w: 'hop', zh: '跳' }
    ],
    pages: [
      { art: '🥚', en: 'A frog has eggs in a pond.', zh: '青蛙把蛋产在池塘里。' },
      { art: '⚫', en: 'The eggs are small and black.', zh: '蛋小小的、黑黑的。' },
      { art: '💧', en: 'A little fish comes out. It can swim.', zh: '一个像小鱼的小家伙出来，会游。' },
      { art: '🏊', en: 'It has no legs. It can swim fast.', zh: '它没有腿，但游得很快。' },
      { art: '🦵', en: 'Then it has legs. It can jump.', zh: '后来它长出了腿，会跳了。' },
      { art: '🐸', en: 'It still swims, but it can hop, too.', zh: '它照样会游，还能跳。' },
      { art: '🪵', en: 'Now it is a frog. It sits on a log.', zh: '现在它是一只青蛙，蹲在木头上。' },
      { art: '🌿', en: 'A frog is not a fish. It can hop on land.', zh: '青蛙不是鱼，它能在陆地上跳。' }
    ],
    quiz: [
      { q: '青蛙把蛋产在哪里？', opts: ['池塘里', '树上', '沙子里'], a: 0 },
      { q: '刚孵出来时它没有什么？', opts: ['尾巴', '腿', '眼睛'], a: 1 },
      { q: '长大后的青蛙和鱼有什么不同？', opts: ['能上岸跳', '会游泳', '住在水里'], a: 0 }
    ]
  },
  {
    id: 'b25', lv: 'L5', tag: '小区 · 种树', title: 'The Green Tree', zh: '那棵绿树',
    emoji: '🌳', color: '#C9E4C5',
    track: 'story',
    goal: 'ee 长音 + ai/ay，读懂一棵小树怎么长大',
    trap: 'ee 是长音 /iː/，嘴角向两边拉平、时间拖长；短 i 短促松弛。see 不是 sit，green 不是 grin。ai 在词中间、ay 在词尾，都读 /eɪ/。',
    summary: '小明和莉莉在小区里种下一棵小树：要阳光、要雨水，一天天长高，长出绿芽，咪咪还爬上去坐了坐。这是本套书第一次出现「连续好几天」的时间线，Day by day 这个短语可以让孩子体会英文怎么说「一天天」。',
    pre: [
      { art: '🌳', en: 'tree', zh: '树' },
      { art: '🟢', en: 'green', zh: '绿色' },
      { art: '🌧️', en: 'rain', zh: '雨' },
      { art: '🪣', en: 'pail', zh: '水桶' }
    ],
    sight: ['a', 'the', 'is', 'but', 'it', 'not', 'we', 'for', 'by', 'on', 'she', 'now', 'our'],
    newWords: [
      { w: 'green', zh: '绿色' },
      { w: 'tree', zh: '树' },
      { w: 'need', zh: '需要' },
      { w: 'rain', zh: '雨' },
      { w: 'pail', zh: '水桶' },
      { w: 'see', zh: '看见' }
    ],
    pages: [
      { art: '🌱', en: 'Ming and Lili plant a small green tree today.', zh: '小明和莉莉今天种下一棵小绿树。' },
      { art: '🌳', en: 'The tree is green, but it is not big.', zh: '树是绿的，可是还不大。' },
      { art: '☀️', en: 'We need sun and rain for the tree.', zh: '这棵树需要阳光和雨水。' },
      { art: '🪣', en: 'Lili gets a pail. Ming gets a pot.', zh: '莉莉拿来水桶，小明拿来花盆。' },
      { art: '🌿', en: 'Day by day, the tree gets tall.', zh: '一天天过去，树长高了。' },
      { art: '🍃', en: 'We see three green buds on it.', zh: '我们看见树上冒出三个绿芽。' },
      { art: '🐱🌳', en: 'Mimi sits in the tree. She sees us.', zh: '咪咪坐在树上，看着我们。' },
      { art: '😊', en: 'Now the tree is tall and green. We are glad.', zh: '现在树又高又绿，我们真高兴。' },
      { art: '🏡', en: 'Our home has a green tree. We feel glad.', zh: '我们家门口有一棵绿树，心里美滋滋的。' }
    ],
    quiz: [
      { q: '两个孩子种下了什么？', opts: ['一棵小树', '一片草', '一盆花'], a: 0 },
      { q: '小树需要哪两样东西？', opts: ['风和雪', '阳光和雨水', '肥料和剪刀'], a: 1 },
      { q: '咪咪最后坐在哪里？', opts: ['树上', '水桶里', '花盆里'], a: 0 }
    ]
  },
  {
    id: 'b26', lv: 'L5', tag: '高铁 · 等车', title: 'Waiting for the Train', zh: '等高铁',
    emoji: '🚄', color: '#BFD7EA',
    track: 'story',
    goal: 'ai / ay 与「等待」的时间线，练 wait 和 wet 的对比',
    trap: 'wait 里 ai 读 /eɪ/，是长音；wet 是短 e。中文没有这一对，孩子常把 wait 说成 wet。train 开头 /tr/ 连缀后面紧跟 ai，别拆成「特–瑞–因」。',
    summary: '一家人站在站台上等高铁：先下雨、外套湿了，来了一趟不是我们的车，最后我们的车才进站。这本用「等了又等」把 wait 重复了四次，孩子读完自然能把这个长元音说稳。',
    pre: [
      { art: '🚄', en: 'train', zh: '火车' },
      { art: '⏳', en: 'wait', zh: '等待' },
      { art: '🌧️', en: 'rain', zh: '雨' },
      { art: '🧥', en: 'coat', zh: '外套' }
    ],
    sight: ['the', 'is', 'not', 'and', 'my', 'has', 'with', 'us', 'she', 'it', 'our', 'in', 'are'],
    newWords: [
      { w: 'wait', zh: '等待' },
      { w: 'train', zh: '火车' },
      { w: 'rain', zh: '雨' },
      { w: 'coat', zh: '外套' },
      { w: 'way', zh: '路／方向' }
    ],
    pages: [
      { art: '🚉', en: 'We wait for the train on a hot day.', zh: '大热天，我们等高铁。' },
      { art: '🕐', en: 'The train is not here. We wait and wait.', zh: '车还没来，我们等呀等。' },
      { art: '🌧️', en: 'Rain falls on my coat and on my bag.', zh: '雨落在我的外套和包上。' },
      { art: '🧥', en: 'Lili has a coat, too.', zh: '莉莉也穿着外套。' },
      { art: '👵', en: 'Grandma waits with us. She has a big bag.', zh: '奶奶和我们一起等，背着个大包。' },
      { art: '🚆', en: 'A train comes. It is not our train.', zh: '来了一趟车，不是我们要坐的。' },
      { art: '🚄', en: 'Then our train comes. It is big and fast.', zh: '接着我们的车来了，又大又快。' },
      { art: '🪟', en: 'We get in. We see the rain go by.', zh: '我们上了车，看雨从窗外掠过。' },
      { art: '🏡', en: 'The train goes fast. We are on our way!', zh: '车开得飞快，我们上路啦！' }
    ],
    quiz: [
      { q: '一家人在等什么？', opts: ['奶奶', '高铁', '公交'], a: 1 },
      { q: '下雨时什么被打湿了？', opts: ['外套和包', '车票', '鞋子'], a: 0 },
      { q: '最后他们上了哪趟车？', opts: ['先来的那趟', '货运列车', '自己要坐的那趟'], a: 2 }
    ]
  },
  {
    id: 'b27', lv: 'L5', tag: '公园 · 划船', title: 'A Boat in the Rain', zh: '雨里的小船',
    emoji: '🛶', color: '#BFD7EA',
    track: 'story',
    goal: 'oa 长音 /oʊ/，配合「下雨—躲雨—雨停」的顺序',
    trap: 'oa 只读一个 /oʊ/，boat 不是「波–阿特」，coat 不是「扣–阿特」。嘴唇从圆到更圆，中间不要断开。对比第 2 站的 cot，第 6 站会解释为什么加了 e 元音就变长。',
    summary: '去公园看小船，忽然下雨，穿上外套跑回家喝口热的，等雨停了太阳出来，再回去看那条船。这本书故意用同一个 oa 串起 boat / coat / floats / home，场景也是中国孩子熟悉的公园湖边。',
    pre: [
      { art: '🛶', en: 'boat', zh: '小船' },
      { art: '🧥', en: 'coat', zh: '外套' },
      { art: '🌧️', en: 'rain', zh: '雨' },
      { art: '⏳', en: 'waits', zh: '停着等' }
    ],
    sight: ['we', 'to', 'the', 'a', 'by', 'it', 'on', 'my', 'is', 'not', 'and', 'at', 'starts'],
    newWords: [
      { w: 'boat', zh: '小船' },
      { w: 'coat', zh: '外套' },
      { w: 'rain', zh: '雨' },
      { w: 'rocks', zh: '摇晃' },
      { w: 'waits', zh: '等待' }
    ],
    pages: [
      { art: '🛶', en: 'We go to the pond to see a boat.', zh: '我们去池塘边看小船。' },
      { art: '🌿', en: 'A small boat waits by the green grass.', zh: '一条小船停在绿草边。' },
      { art: '🌧️', en: 'It starts to rain. We put on a coat.', zh: '下起雨来，我们穿上外套。' },
      { art: '🧥', en: 'My coat is red. Lili\'s coat is green.', zh: '我的外套是红的，莉莉的是绿的。' },
      { art: '🌊', en: 'The rain falls. The pond is not still.', zh: '雨一直下，池塘不再平静。' },
      { art: '🛶', en: 'The boat rocks on the pond.', zh: '小船在池塘里轻轻晃。' },
      { art: '🏠', en: 'We run home. Grandma has a hot pot.', zh: '我们跑回家，奶奶烧好了热锅。' },
      { art: '☕', en: 'We sit and wait. The rain stops at last.', zh: '我们坐着等，雨终于停了。' },
      { art: '🌈', en: 'The sun comes out. We go back to the boat.', zh: '太阳出来了，我们回去看小船。' }
    ],
    quiz: [
      { q: '小船停在哪里？', opts: ['池塘边的草旁', '大海上', '桥洞里'], a: 0 },
      { q: '下雨时孩子们穿上了什么？', opts: ['雨鞋', '帽子', '外套'], a: 2 },
      { q: '什么时候回到小船边？', opts: ['第二天早上', '当天晚上', '雨停太阳出来后'], a: 2 }
    ]
  },
  {
    id: 'b28', lv: 'L5', tag: '风筝 · 起风', title: 'Lili\'s Green Kite', zh: '莉莉的绿风筝',
    emoji: '🪁', color: '#FFD9A0',
    track: 'story',
    goal: 'ee / ay 与动作串，读懂一段有起伏的小事',
    trap: 'green 的 ee 要拖长，day / play / say 的 ay 在词尾读 /eɪ/；别把 say 读成「赛」的短音。kite 的结尾 e 不发音，第 6 站会正式学这条规则。',
    summary: '起风了，莉莉的绿风筝飞过树梢，咪咪扑尾巴，风筝挂到树上，小明站上台阶把它取下来，最后玩了一整天。这本第一次出现「出问题—想办法—解决」的完整三段，读完可以让孩子用中文复述一遍顺序。',
    pre: [
      { art: '🪁', en: 'kite', zh: '风筝' },
      { art: '🟢', en: 'green', zh: '绿色' },
      { art: '🎗️', en: 'tail', zh: '尾巴' },
      { art: '🌬️', en: 'wind', zh: '风' }
    ],
    sight: ['the', 'is', 'up', 'we', 'to', 'it', 'she', 'at', 'no', 'in', 'on', 'all', 'that'],
    newWords: [
      { w: 'kite', zh: '风筝' },
      { w: 'green', zh: '绿色' },
      { w: 'tail', zh: '尾巴' },
      { w: 'wind', zh: '风' },
      { w: 'floats', zh: '飘' }
    ],
    pages: [
      { art: '🪁', en: 'Lili has a green kite and a long tail.', zh: '莉莉有一只绿风筝，尾巴长长的。' },
      { art: '🌬️', en: 'The wind is up. We run to the green grass.', zh: '起风了，我们跑到草地上。' },
      { art: '🏃', en: 'Run, Lili, run! The kite goes up.', zh: '快跑，莉莉，快跑！风筝升起来了。' },
      { art: '☁️', en: 'It floats up over the green tree.', zh: '它飘过了那棵绿树。' },
      { art: '🐱', en: 'Mimi sees it. She jumps at the tail.', zh: '咪咪看见了，扑向风筝尾巴。' },
      { art: '😿', en: 'Oh no! The kite is in the tree.', zh: '哎呀！风筝挂到树上了。' },
      { art: '🪜', en: 'Ming stands on a step and gets it.', zh: '小明站上台阶，把它取了下来。' },
      { art: '😄', en: 'We play all day. The kite is green.', zh: '我们玩了一整天，风筝还是绿绿的。' },
      { art: '🌇', en: 'At home we say, that was a good day!', zh: '回到家我们说：今天真不错！' }
    ],
    quiz: [
      { q: '风筝是什么颜色的？', opts: ['白色', '红色', '绿色'], a: 2 },
      { q: '风筝最后挂到了哪里？', opts: ['树上', '屋顶上', '栏杆上'], a: 0 },
      { q: '谁站上台阶取下了风筝？', opts: ['莉莉', '小明', '奶奶'], a: 1 }
    ]
  },
  {
    id: 'b29', lv: 'L5', tag: '🔬 长短元音专项', title: 'Sheep or Ship?', zh: '绵羊还是轮船',
    emoji: '🔬', color: '#D8C7F0',
    track: 'drill',
    goal: '用最小对立词听出长元音与短元音的差别',
    trap: '/iː/ 嘴角拉平、时间拖长；/ɪ/ 短促松弛。中文「衣」接近长音，所以孩子几乎都会把 ship 读成 sheep。练的时候用手比一下：短音一点、长音一划。',
    summary: '这一册把五组只差元音长度的词摆在一起：sheep/ship、feet/fit、pool/pull、coat/cot、wait/wet。先让孩子听大人念、指出是哪一个，再自己念。oo 有个小例外：food 里长、cook 里短，本站先按词整体认读，不急着总结规律。',
    pre: [
      { art: '🐑', en: 'sheep', zh: '绵羊' },
      { art: '🚢', en: 'ship', zh: '轮船' },
      { art: '🦶', en: 'feet', zh: '脚' },
      { art: '🧥', en: 'coat', zh: '外套' }
    ],
    sight: ['two', 'is', 'for', 'not', 'and', 'now', 'all', 'to', 'one', 'you', 'can', 'it', 'point'],
    newWords: [
      { w: 'sheep', zh: '绵羊' },
      { w: 'ship', zh: '轮船' },
      { w: 'feet', zh: '脚' },
      { w: 'coat', zh: '外套' },
      { w: 'pool', zh: '水池' }
    ],
    pages: [
      { art: '🐑🚢', en: 'A sheep. A ship. Two words.', zh: '一只绵羊，一艘轮船，两个词。' },
      { art: '🦶', en: 'Feet on the mat. Fit in the hat.', zh: '脚踩垫子，帽子正合适。' },
      { art: '🌊', en: 'A pool is deep. A pull is quick.', zh: '池子很深，拉一下很快。' },
      { art: '🧥', en: 'A coat is long. A cot is small.', zh: '外套长长的，小床小小的。' },
      { art: '⏳', en: 'We wait for rain. A wet coat is not dry.', zh: '我们等雨。湿外套可不干。' },
      { art: '🗣️', en: 'See, sit. Feet, fit. Coat, cot. Say them!', zh: '看／坐、脚／合适、外套／小床。念一念！' },
      { art: '🔤', en: 'Long and short. Now say them all again.', zh: '长的和短的，再把它们念一遍。' },
      { art: '👂', en: 'Listen to the two words. Point to the long one.', zh: '听这两个词，指出长的那一个。' },
      { art: '✅', en: 'Now you can say it. Try them all.', zh: '现在你会说了，都试一遍。' }
    ],
    quiz: [
      { q: 'sheep 和 ship 是同一个词吗？', opts: ['只是拼写不同', '是', '不是'], a: 2 },
      { q: '哪个词的元音要拖长？', opts: ['sheep', 'sit', 'ship'], a: 0 },
      { q: '这一册主要在练什么？', opts: ['辅音连缀', '长短元音', '句子标点'], a: 1 }
    ]
  },
  {
    id: 'b30', lv: 'L5', tag: '🌍 一碗米饭', title: 'Rice and Rain', zh: '一碗米饭',
    emoji: '🍚', color: '#F7E2B8',
    track: 'info',
    goal: '读懂「稻种 → 秧苗 → 收割 → 米饭」的过程',
    trap: 'oo 有两种读法：food 里拖长，cook 里短促，这一册两个都出现，先整体认读。ee 的 need / seed / sleeps 都是长音，别读成短 i。',
    summary: '从湿田里的一粒种子，到绿秧、到稻子长高，再到收割、晒干、下锅，最后成为我们每天吃的那碗饭。中文可以补一句：中国南方种水稻已有几千年，所以书里写的「阳光、雨水、泥、双手」一件都不能少。rice 早在第 2 站就整体认读过，这里再见到就顺了。',
    pre: [
      { art: '🍚', en: 'rice', zh: '米饭' },
      { art: '🌧️', en: 'rain', zh: '雨' },
      { art: '🌱', en: 'seed', zh: '种子' },
      { art: '🍲', en: 'cook', zh: '煮' }
    ],
    sight: ['a', 'and', 'the', 'is', 'in', 'up', 'by', 'we', 'it', 'for', 'us', 'that'],
    newWords: [
      { w: 'seed', zh: '种子' },
      { w: 'shoots', zh: '秧苗' },
      { w: 'cook', zh: '煮' },
      { w: 'food', zh: '食物' },
      { w: 'field', zh: '田地' }
    ],
    pages: [
      { art: '🌾', en: 'Rice needs a wet field and sun.', zh: '稻子需要湿田和阳光。' },
      { art: '💧', en: 'Rain falls. The field is wet and soft.', zh: '雨落下来，田又湿又软。' },
      { art: '🌱', en: 'A seed sleeps in the wet mud.', zh: '一粒种子睡在湿泥里。' },
      { art: '🌿', en: 'Green shoots come up in the sun.', zh: '绿秧苗在太阳下冒出来。' },
      { art: '👴', en: 'Grandpa stands in the rain and mud.', zh: '爷爷站在雨水和泥地里。' },
      { art: '🌾', en: 'Day by day, the rice gets tall.', zh: '一天天过去，稻子长高了。' },
      { art: '✂️', en: 'We cut it, dry it, and cook it.', zh: '我们割下、晒干、下锅。' },
      { art: '🍲', en: 'Rice is food for us every day.', zh: '米饭是我们每天的食物。' },
      { art: '🙏', en: 'Sun, rain, mud, and hands. That is rice.', zh: '阳光、雨水、泥，还有一双手，才有米饭。' }
    ],
    quiz: [
      { q: '稻子最需要哪两样？', opts: ['风和雪', '沙子和石头', '阳光和雨水'], a: 2 },
      { q: '种子一开始在哪里？', opts: ['篮子里', '湿泥里', '锅里'], a: 1 },
      { q: '最后稻子变成了什么？', opts: ['一件衣服', '一根木头', '我们的食物'], a: 2 }
    ]
  },
  {
    id: 'b31', lv: 'L6', tag: '春节 · 红包', title: 'The Red Packet', zh: '那个红包',
    emoji: '🧧', color: '#F6C6C6',
    track: 'story',
    goal: 'a_e / i_e 词族，读懂「想买玩具 → 想到奶奶」的转折',
    trap: 'cake / kite / game / note / smile 结尾的 e 都不发音，但让前面的元音读字母本音；cap 与 cape 只差一个不发音的字母，意思和读音全变了。',
    summary: '春节奶奶给小明一个红包。他本来想去买风筝和蛋糕，临到店里却想起奶奶的手，于是只买了一块小蛋糕给她，还写了张字条。这是本套书第一次出现「心里改了主意」的转折，读完可以让孩子说说自己收到红包时会怎么花。',
    pre: [
      { art: '🧧', en: 'packet', zh: '红包' },
      { art: '🍰', en: 'cake', zh: '蛋糕' },
      { art: '🪁', en: 'kite', zh: '风筝' },
      { art: '📝', en: 'note', zh: '字条' }
    ],
    sight: ['a', 'the', 'in', 'it', 'is', 'at', 'to', 'with', 'his', 'of', 'her', 'for', 'money', 'paper', 'warm', 'writes'],
    newWords: [
      { w: 'packet', zh: '红包' },
      { w: 'cake', zh: '蛋糕' },
      { w: 'kite', zh: '风筝' },
      { w: 'note', zh: '字条' },
      { w: 'game', zh: '游戏' },
      { w: 'smiles', zh: '笑' }
    ],
    pages: [
      { art: '🧧', en: 'At Spring Festival, Grandma gives Ming a red packet.', zh: '过年时，奶奶给了小明一个红包。' },
      { art: '💰', en: 'Inside it is money. Ming smiles at the thick red paper.', zh: '里面是钱。小明捏着厚厚的红纸笑了。' },
      { art: '🏮', en: 'Lili gets one, too. She hides it in a pocket.', zh: '莉莉也有一个，她把它藏进了口袋。' },
      { art: '🍬', en: 'Ming wants to buy cakes with his money.', zh: '小明想用这钱买蛋糕。' },
      { art: '🛒', en: 'At the shop he sees a kite, a game, and a cake.', zh: '在店里，他看见风筝、游戏和蛋糕。' },
      { art: '👵', en: 'Then he thinks of Grandma and her warm hands.', zh: '这时他想起奶奶，还有她那双暖暖的手。' },
      { art: '🎁', en: 'He buys a small cake for her, not a kite.', zh: '他给她买了一块小蛋糕，没买风筝。' },
      { art: '😊', en: 'Grandma smiles. The cake is sweet. The note is nice.', zh: '奶奶笑了。蛋糕很甜，字条写得真好。' },
      { art: '✍️', en: 'Ming writes: for the best grandma. She keeps it.', zh: '小明写着：给最好的奶奶。她把字条收了起来。' },
      { art: '🏮', en: 'The red packet is small. The smile is big.', zh: '红包小小的，笑容大大的。' }
    ],
    quiz: [
      { q: '奶奶给了小明什么？', opts: ['一个红包', '一只风筝', '一顶帽子'], a: 0 },
      { q: '小明最后买了什么？', opts: ['一块小蛋糕', '游戏', '风筝'], a: 0 },
      { q: '他为什么没买风筝？', opts: ['店关门了', '钱不够', '想起了奶奶'], a: 2 }
    ]
  },
  {
    id: 'b32', lv: 'L6', tag: '生日 · 蛋糕', title: 'The Big Cake', zh: '大蛋糕',
    emoji: '🎂', color: '#FFE0A3',
    track: 'story',
    goal: 'a_e 词族密集复现，读懂「一起做蛋糕」的步骤',
    trap: 'make / cake / bake / shape / plate / same 全是 a_e，读作 /eɪ/；别再读成第 2 站的短 a。have 和 give 是例外，词尾 e 不让元音变长。',
    summary: '全家给爷爷做生日蛋糕：打蛋、进炉、摆盘子、点蜡烛、分着吃。这一本把一个字素家族放进同一件事里，孩子不用背规则也能感觉到「这些词长得像、读得也像」。最后爷爷说这是最棒的蛋糕，因为是一起做的。',
    pre: [
      { art: '🍰', en: 'cake', zh: '蛋糕' },
      { art: '🍽️', en: 'plate', zh: '盘子' },
      { art: '⭐', en: 'shape', zh: '形状' },
      { art: '🤝', en: 'share', zh: '分享' }
    ],
    sight: ['a', 'the', 'in', 'is', 'of', 'we', 'with', 'and', 'he', 'it', 'not', 'but', 'for'],
    newWords: [
      { w: 'cake', zh: '蛋糕' },
      { w: 'plate', zh: '盘子' },
      { w: 'shape', zh: '形状' },
      { w: 'share', zh: '分享' },
      { w: 'fine', zh: '美好的' }
    ],
    pages: [
      { art: '🏠', en: 'Today is a big day at our home.', zh: '今天家里有个大日子。' },
      { art: '👵🥣', en: 'Grandma makes a cake. Ming makes the shape.', zh: '奶奶做蛋糕，小明负责做造型。' },
      { art: '🥚', en: 'Lili puts in five eggs and a cup of milk.', zh: '莉莉放进五个蛋和一杯牛奶。' },
      { art: '🔥', en: 'The cake bakes in the hot stove. The home smells sweet.', zh: '蛋糕在炉子里烤着，满屋都是甜味。' },
      { art: '🍽️', en: 'We wait. We set the table with a white plate and a cup.', zh: '我们等着，摆好白盘子和杯子。' },
      { art: '🎁', en: 'Grandpa comes in. He has a wide smile.', zh: '爷爷进来了，笑得合不拢嘴。' },
      { art: '🎶', en: 'We sing. We clap. We cut the same cake.', zh: '我们唱歌、拍手，一起切开这个蛋糕。' },
      { art: '🍰', en: 'The cake is not big, but we share it.', zh: '蛋糕不大，可是大家一起分。' },
      { art: '😋', en: 'Grandpa says this is the best cake he has had.', zh: '爷爷说这是他吃过最棒的蛋糕。' },
      { art: '🏡', en: 'A small home, a big cake, and a fine day for us.', zh: '小小的家，大大的蛋糕，美好的一天。' }
    ],
    quiz: [
      { q: '蛋糕是谁做的？', opts: ['邻居送的', '全家一起', '买来的'], a: 1 },
      { q: '蛋糕里放了什么？', opts: ['米饭', '水果', '五个蛋和一杯奶'], a: 2 },
      { q: '爷爷说了什么？', opts: ['这是最棒的蛋糕', '他想再要一块', '蛋糕太小了'], a: 0 }
    ]
  },
  {
    id: 'b33', lv: 'L6', tag: '风筝 · 修好它', title: 'A Kite for Lili', zh: '给莉莉做风筝',
    emoji: '🪁', color: '#FFD9A0',
    track: 'story',
    goal: 'i_e 词族，读懂「旧了 → 动手修 → 飞起来」的完整过程',
    trap: 'kite / ride / slide / line / wide / fine 的 i 都读 /aɪ/，因为词尾有个不发音的 e；对照第 5 站的 kit、bit、fin。',
    summary: '莉莉的旧风筝掉了尾巴，两个孩子找来一大幅白布，剪出尾巴、写上名字，起风那天风筝一路往上滑，咪咪扑上来挂在尾巴上，最后稳稳收线回家。这本第一次连续好几页写同一件事的进程，适合练「按页复述」。',
    pre: [
      { art: '🪁', en: 'kite', zh: '风筝' },
      { art: '🎗️', en: 'tail', zh: '尾巴' },
      { art: '✍️', en: 'name', zh: '名字' },
      { art: '🧵', en: 'line', zh: '线' }
    ],
    sight: ['a', 'the', 'it', 'is', 'and', 'we', 'to', 'on', 'she', 'but', 'not', 'write'],
    newWords: [
      { w: 'kite', zh: '风筝' },
      { w: 'name', zh: '名字' },
      { w: 'line', zh: '线' },
      { w: 'wide', zh: '宽的' },
      { w: 'rides', zh: '乘着' }
    ],
    pages: [
      { art: '🪁', en: 'Lili\'s kite is old and small. It has no tail.', zh: '莉莉的风筝又旧又小，尾巴也没了。' },
      { art: '🧵', en: 'Ming has a plan. He takes a wide white sheet.', zh: '小明有了主意，找来一大块白布。' },
      { art: '✂️', en: 'He cuts a fine tail. Lili cuts a red stripe.', zh: '他剪出一条细尾巴，莉莉剪了一条红条子。' },
      { art: '🖍️', en: 'They write a name on it: Lili and Ming.', zh: '他们在上面写上名字：莉莉和小明。' },
      { art: '🌬️', en: 'The wind is strong. We run to the hill.', zh: '风很大，我们跑到小坡上。' },
      { art: '🏃', en: 'The kite rides the wind. It slides up fast.', zh: '风筝乘着风，飞快地往上滑。' },
      { art: '☁️', en: 'It goes up and up. We can not see the line.', zh: '它越飞越高，连线都快看不见了。' },
      { art: '🐱', en: 'Mimi jumps. She grips the tail and hangs on.', zh: '咪咪一跳，抓住尾巴挂在上头。' },
      { art: '😄', en: 'The kite dips, but Lili holds on to the line.', zh: '风筝往下栽，莉莉紧紧抓住线。' },
      { art: '🌇', en: 'We go home late. The kite is safe.', zh: '我们很晚才回家，风筝好好的。' }
    ],
    quiz: [
      { q: '旧风筝少了什么？', opts: ['尾巴', '线', '骨架'], a: 0 },
      { q: '谁剪出了那条细尾巴？', opts: ['奶奶', '莉莉', '小明'], a: 2 },
      { q: '最后风筝怎么样了？', opts: ['被风吹走了', '完好地带回家了', '挂在树上'], a: 1 }
    ]
  },
  {
    id: 'b34', lv: 'L6', tag: '村口 · 石桥', title: 'The Stone Bridge', zh: '老石桥',
    emoji: '🌉', color: '#C9E4C5',
    track: 'story',
    goal: 'o_e / a_e 词族，读懂「一座桥的年纪」',
    trap: 'stone / made / side / tale 都是魔法 e；bridge 里的 dge 只发一个 /j/，是本站唯一的整体认读词，不按规则拼。',
    summary: '爷爷家门口有一座上百年的老石桥，是当年一块一块用手垒起来的。孩子们踩过光滑的石头、趴在桥边看鱼、放树叶，回家后爷爷又把这段老故事讲了一遍。中国孩子对「老桥、老手艺」有生活经验，英文再长也能靠画面猜出意思。',
    pre: [
      { art: '🌉', en: 'bridge', zh: '桥' },
      { art: '🪨', en: 'stone', zh: '石头' },
      { art: '↔️', en: 'wide', zh: '宽的' },
      { art: '👐', en: 'made', zh: '造' }
    ],
    sight: ['a', 'the', 'is', 'it', 'by', 'on', 'and', 'we', 'at', 'too', 'years', 'stream', 'lean', 'leaf'],
    newWords: [
      { w: 'stone', zh: '石头' },
      { w: 'bridge', zh: '桥' },
      { w: 'made', zh: '造' },
      { w: 'side', zh: '边' },
      { w: 'tale', zh: '故事' }
    ],
    pages: [
      { art: '🏞️', en: 'By Grandpa\'s home is a long, old stone bridge.', zh: '爷爷家旁边有一座又长又老的石桥。' },
      { art: '🧱', en: 'The bridge is old. Its stones are wide.', zh: '桥很老了，石头很宽。' },
      { art: '👴', en: 'Grandpa says the bridge is a hundred years old and still here.', zh: '爷爷说这桥有一百多年了，如今还在。' },
      { art: '👐', en: 'Men made it by hand, stone by stone.', zh: '当年人们一块石头一块石头，用手垒起来的。' },
      { art: '🚶', en: 'We step on it. The old stones are smooth and cool.', zh: '我们踩上去，老石头又滑又凉。' },
      { art: '🌊', en: 'A stream runs under the bridge all day.', zh: '桥下一天到晚流着小溪。' },
      { art: '🐟', en: 'We lean on the side and see five small fish.', zh: '我们靠在桥边，看见五条小鱼。' },
      { art: '🍃', en: 'Lili drops a leaf. It floats away.', zh: '莉莉丢下一片叶子，它飘走了。' },
      { art: '🌇', en: 'At home Grandpa tells us the same tale again.', zh: '回到家，爷爷又给我们讲了一遍。' },
      { art: '🧓', en: 'We like the old stones. We like the tale, too.', zh: '我们喜欢这些老石头，也喜欢这故事。' }
    ],
    quiz: [
      { q: '这座桥是用什么造的？', opts: ['砖', '石头', '木头'], a: 1 },
      { q: '爷爷说这桥有多老了？', opts: ['十几年', '一百多年', '三年'], a: 1 },
      { q: '回家后爷爷做了什么？', opts: ['去修桥', '睡着了', '又讲了一遍老故事'], a: 2 }
    ]
  },
  {
    id: 'b35', lv: 'L6', tag: '🔬 魔法 e 专项', title: 'Cake or Kite?', zh: '加个 e 会怎样',
    emoji: '🔬', color: '#D8C7F0',
    track: 'drill',
    goal: '用词族最小对立，看懂「不发音的 e 改变元音」',
    trap: '规则：元音 + 一个辅音 + 词尾 e，e 自己不出声，却让前面的元音读成字母本音。cap→cape、kit→kite、not→note、cut→cute。例外：have、give 的 e 不改变元音，先整体记住。',
    summary: '这一册不讲新故事，专门把六组「加 e 前后」摆在一起：孩子能亲眼看到只多了一个不出声的字母，读音和意思就全变了。第 8 页特意点了两个例外，免得孩子把规则套到 have / give 上。家长只要问一句「这个 e 出声吗」，孩子自己就能推。',
    pre: [
      { art: '🧢', en: 'cap', zh: '帽子' },
      { art: '🧣', en: 'cape', zh: '披风' },
      { art: '🧰', en: 'kit', zh: '工具' },
      { art: '🪁', en: 'kite', zh: '风筝' }
    ],
    sight: ['a', 'the', 'one', 'is', 'not', 'two', 'has', 'and', 'we', 'now', 'read', 'vowel', 'exceptions', 'know', 'letter'],
    newWords: [
      { w: 'cape', zh: '披风' },
      { w: 'kite', zh: '风筝' },
      { w: 'note', zh: '便条' },
      { w: 'hope', zh: '希望' },
      { w: 'cute', zh: '可爱的' }
    ],
    pages: [
      { art: '🧢🧣', en: 'A cap. A cape. One e makes a new word.', zh: '一顶帽子，一件披风。多一个 e，就是一个新词。' },
      { art: '🪁', en: 'A kit. A kite. The e at the end is not read.', zh: '一套工具，一只风筝。词尾那个 e 不读出来。' },
      { art: '📝', en: 'A not. A note. A hop. A hope.', zh: '不、便条；单脚跳、希望。' },
      { art: '🐶🍰', en: 'A mad dog. A made cake. Two words.', zh: '一只生气的狗，一个做好的蛋糕。' },
      { art: '✂️🐱', en: 'A cut. A cute cat. The e changes the sound.', zh: '一个切口，一只可爱的猫。e 改变了那个音。' },
      { art: '🗣️', en: 'Cap, cape. Kit, kite. Not, note. Say them!', zh: '帽子／披风，工具／风筝，不／便条。念一念！' },
      { art: '✍️', en: 'The e has no sound. It gives the vowel a name.', zh: 'e 自己没有声音，却让元音读自己的名字。' },
      { art: '⚠️', en: 'Have and give are exceptions. We just know them.', zh: 'have 和 give 是例外，先记住就好。' },
      { art: '🔤', en: 'Now try: fin, fine. Cub, cube. Us, use.', zh: '再试试：鳍／好，幼兽／方块，我们／使用。' },
      { art: '✅', en: 'One small letter, one big change. That is magic e.', zh: '一个小小的字母，一个大大的变化。这就是魔法 e。' }
    ],
    quiz: [
      { q: '词尾的 e 自己出声吗？', opts: ['有时读两遍', '出声', '不出声'], a: 2 },
      { q: 'cap 加上 e 之后读什么？', opts: ['cap', 'cape', 'cup'], a: 1 },
      { q: '哪两个词不遵守这条规则？', opts: ['cake 和 kite', 'have 和 give', 'note 和 hope'], a: 1 }
    ]
  },
  {
    id: 'b36', lv: 'L6', tag: '🌍 从稻田到饭碗', title: 'How We Make Rice', zh: '米是怎么来的',
    emoji: '🌾', color: '#F7E2B8',
    track: 'info',
    goal: '用 a_e / i_e 词读懂「种 → 收 → 晒 → 脱壳 → 煮」',
    trap: 'place / make / case / take / rise 都是魔法 e；dries、each、steam、bowl 这几个词本站先整体认读，后面几站会陆续解释它们的字素。',
    summary: '这本把第 5 站那本小科普扩成完整流程：春天把种子放进软泥，靠雨水和太阳长高，夏天末割下、晒干、抖出谷粒，再去掉硬壳，洗净下锅，最后才是一碗白米饭。中文可以补一句：一粒米要过好几道手，所以「粒粒皆辛苦」不是一句空话。',
    pre: [
      { art: '🌱', en: 'seed', zh: '种子' },
      { art: '🌾', en: 'stems', zh: '稻秆' },
      { art: '🌾', en: 'grains', zh: '谷粒' },
      { art: '🥣', en: 'case', zh: '外壳' }
    ],
    sight: ['a', 'the', 'in', 'is', 'we', 'and', 'then', 'it', 'by', 'to', 'grows', 'summer', 'dries', 'hard', 'steam', 'bowl'],
    newWords: [
      { w: 'seed', zh: '种子' },
      { w: 'stems', zh: '稻秆' },
      { w: 'grains', zh: '谷粒' },
      { w: 'case', zh: '壳' },
      { w: 'rise', zh: '升起' }
    ],
    pages: [
      { art: '🌾', en: 'Rice is a small seed. It grows in a wet field.', zh: '米其实是一粒小种子，长在湿田里。' },
      { art: '👴', en: 'In spring, Grandpa places each seed in soft mud.', zh: '春天，爷爷把种子一粒粒放进软泥。' },
      { art: '🌿', en: 'Rain and sun make the green shoots rise.', zh: '雨水和太阳让绿秧苗往上长。' },
      { art: '🌾', en: 'By late summer the plants are tall and gold.', zh: '到了夏末，稻子长得又高又黄。' },
      { art: '✂️', en: 'We cut the stems and lay them in the sun.', zh: '我们割下稻秆，摊在太阳底下。' },
      { art: '🌞', en: 'The sun dries them. Then we shake out the grains.', zh: '太阳把它们晒干，再抖出谷粒。' },
      { art: '👐', en: 'We take off the hard case by hand.', zh: '我们用手去掉那层硬壳。' },
      { art: '🍚', en: 'Inside is white rice. We wash it, then cook it.', zh: '里面就是白米。洗干净，再下锅。' },
      { art: '♨️', en: 'Steam rises. The rice is soft and warm.', zh: '热气升起来，米饭又软又暖。' },
      { art: '🙏', en: 'From a wet field to a bowl at home.', zh: '从一块湿田，到家里的一只碗。' }
    ],
    quiz: [
      { q: '稻子什么时候长得又高又黄？', opts: ['夏末', '冬天', '初春'], a: 0 },
      { q: '晒干以后要去掉什么？', opts: ['硬壳', '根', '叶子'], a: 0 },
      { q: '米饭最后到了哪里？', opts: ['锅里就不动了', '田里', '家里的碗里'], a: 2 }
    ]
  },
  {
    id: 'b37', lv: 'L7', tag: '长城 · 登高', title: 'The Great Wall', zh: '爬长城',
    emoji: '🧱', color: '#F6C6C6',
    track: 'story',
    goal: 'ar 家族密集复现，读懂「爬一段长城」的一天',
    trap: 'ar 读 /ɑr/：嘴张大，舌尖向上卷但不碰到上颚。hard / part / start / far / sharp / scarf 都是同一类。中文「啊儿」是两个音，英语要连成一个。',
    summary: '一家人和爷爷去爬长城：石头台阶、山风、远处的城楼，爷爷一路讲这些砖是怎么被一块块背上山的。腿酸了也没往回走，最后在夕阳下看山。这本用 ar 词写出「远」和「长」的感觉，读的时候可以让孩子在每一页找出带 ar 的词。',
    pre: [
      { art: '🧱', en: 'wall', zh: '城墙' },
      { art: '⛰️', en: 'hard', zh: '费劲的' },
      { art: '🔭', en: 'far', zh: '远的' },
      { art: '↩️', en: 'turn', zh: '拐弯' },
      { art: '🧣', en: 'scarf', zh: '围巾' }
    ],
    sight: ['a', 'the', 'is', 'and', 'in', 'we', 'to', 'at', 'climb', 'great', 'built', 'carried', 'tower', 'flies', 'air', 'remember'],
    newWords: [
      { w: 'wall', zh: '城墙' },
      { w: 'hard', zh: '费劲的' },
      { w: 'far', zh: '远的' },
      { w: 'turn', zh: '拐弯' },
      { w: 'part', zh: '部分' },
      { w: 'bird', zh: '鸟' }
    ],
    pages: [
      { art: '🧱', en: 'Today we climb the Great Wall with Grandpa and Lili.', zh: '今天我和爷爷去爬长城。' },
      { art: '⛰️', en: 'The wall is long and hard to climb in the hot sun.', zh: '长城很长，顶着太阳爬起来不轻松。' },
      { art: '👴', en: 'Grandpa tells us the first part was built long ago.', zh: '爷爷说最早的那一段是很久以前修的。' },
      { art: '🪨', en: 'Men carried big stones up the hill by hand.', zh: '当年人们把大石头一块块背上山。' },
      { art: '🏯', en: 'We start at a tall tower and walk far.', zh: '我们从高高的城楼出发，走了很远。' },
      { art: '🌬️', en: 'The wind is sharp. My scarf flies in the air.', zh: '风很扎脸，我的围巾在空中飘。' },
      { art: '📷', en: 'Lili stops to take a picture of a green bird.', zh: '莉莉停下来给一只绿色的鸟拍照。' },
      { art: '🍱', en: 'We sit on a step and share oranges and water.', zh: '我们坐在台阶上分橘子和水。' },
      { art: '🌇', en: 'At the far turn Grandpa points to the hills.', zh: '在远处的拐角，爷爷指着群山。' },
      { art: '🏡', en: 'He says the wall is part of our story. We nod.', zh: '他说这城墙是我们故事的一部分，我们点头。' },
      { art: '🦶', en: 'Our legs hurt, but we do not turn back.', zh: '腿都酸了，可谁也不想回头。' },
      { art: '⭐', en: 'The sun sets far away. It is a day to remember.', zh: '太阳在远处落下，这是值得记住的一天。' }
    ],
    quiz: [
      { q: '长城主要是用什么砌的？', opts: ['木头', '砖坯', '大石头'], a: 2 },
      { q: '一路上谁在讲老故事？', opts: ['小明', '爷爷', '莉莉'], a: 1 },
      { q: '腿酸以后他们做了什么？', opts: ['原地休息到天黑', '坐车回去', '接着往前走'], a: 2 }
    ]
  },
  {
    id: 'b38', lv: 'L7', tag: '菜园 · 一年四季', title: 'Grandpa\'s Garden', zh: '爷爷的菜园',
    emoji: '🌱', color: '#C9E4C5',
    track: 'story',
    goal: 'er/ir/ur 三种拼写同一个音，读懂菜园从春到晚',
    trap: 'her / bird / turn / dirt / first / water / dinner 里的 r 都卷舌；ir、er、ur 三种写法读音一样，别一种拼法一个读法。or 又是另一类，口型要圆一点。',
    summary: '春天爷爷翻土下种，莉莉提水，玉米靠墙长、豆子爬杆，篱笆上落着小鸟，夏天开出第一朵红花，傍晚收了菜下锅，饭后坐着看星星转。这本把「一年」压进一天的叙述里，是中国孩子很熟悉的院子生活。',
    pre: [
      { art: '🌱', en: 'garden', zh: '菜园' },
      { art: '🟤', en: 'dirt', zh: '泥土' },
      { art: '🌽', en: 'corn', zh: '玉米' },
      { art: '🐦', en: 'bird', zh: '鸟' },
      { art: '🌻', en: 'first', zh: '第一' },
      { art: '💧', en: 'water', zh: '水' }
    ],
    sight: ['a', 'the', 'in', 'and', 'on', 'we', 'for', 'at', 'house', 'carries', 'beans', 'flower', 'watch'],
    newWords: [
      { w: 'garden', zh: '菜园' },
      { w: 'dirt', zh: '泥土' },
      { w: 'corn', zh: '玉米' },
      { w: 'bird', zh: '鸟' },
      { w: 'turn', zh: '翻／转' },
      { w: 'first', zh: '第一' }
    ],
    pages: [
      { art: '🏠', en: 'Behind the old house Grandpa has a small green garden.', zh: '老屋后面，爷爷有一小块菜园。' },
      { art: '🌱', en: 'In spring he turns the dirt and plants the seeds.', zh: '春天他翻土、下种。' },
      { art: '💧', en: 'Lili carries water in a small pail for the seeds.', zh: '莉莉用小桶提水。' },
      { art: '🌽', en: 'Corn grows by the wall. Beans climb the sticks.', zh: '玉米靠着墙长，豆子往杆上爬。' },
      { art: '🐦', en: 'A bird sits on the fence and sings in the morning.', zh: '一只鸟落在篱笆上，早晨唱个不停。' },
      { art: '🌻', en: 'The first red flower opens in the warm sun.', zh: '第一朵红花在暖阳里开了。' },
      { art: '🐛', en: 'Ming finds a worm under a green leaf and calls Lili.', zh: '小明在叶子下发现一条虫，喊莉莉来看。' },
      { art: '🧺', en: 'We pick corn and beans for Grandma\'s big pot.', zh: '我们摘了玉米和豆子，给奶奶的大锅备着。' },
      { art: '🍲', en: 'At dinner Grandpa says the garden is our little farm.', zh: '吃饭时爷爷说，这菜园就是我们的小农场。' },
      { art: '🌙', en: 'After dinner we sit still and watch the stars turn.', zh: '饭后我们坐着，看星星慢慢转。' },
      { art: '🙏', en: 'Hard work, warm sun, and water make a good garden.', zh: '肯出力、有太阳、有水，才有菜园。' },
      { art: '🌱', en: 'Next spring we will turn the dirt all over again, Grandpa says.', zh: '爷爷说明年春天还要再翻一遍土。' }
    ],
    quiz: [
      { q: '春天爷爷最先做什么？', opts: ['翻土下种', '搭篱笆', '摘玉米'], a: 0 },
      { q: '篱笆上坐着什么？', opts: ['一只虫', '一只猫', '一只小鸟'], a: 2 },
      { q: '晚饭的菜是从哪里来的？', opts: ['菜市场', '邻居家', '自家的菜园'], a: 2 }
    ]
  },
  {
    id: 'b39', lv: 'L7', tag: '夜晚 · 看星星', title: 'A Star for Lili', zh: '给莉莉一颗星',
    emoji: '⭐', color: '#D8C7F0',
    track: 'story',
    goal: 'ar / or / ur 对比，读懂「看星星 → 画星星」',
    trap: 'star / dark / far 是 ar，north / morning 是 or，burn / turn 是 ur。三类别混：ar 嘴大，or 嘴圆，ur 舌头卷得最紧。',
    summary: '晚饭后莉莉抬头看见星星，爷爷拿来星图，指了北极星和北斗，说星星也像太阳一样在燃烧，只是太远。大家数了七颗又数三十颗，天冷了被奶奶叫进屋，第二天早上莉莉把它画在纸上送给爷爷。科普事实放在中文小结里，英文只写孩子看得见的部分。',
    pre: [
      { art: '⭐', en: 'star', zh: '星星' },
      { art: '🌃', en: 'dark', zh: '黑的' },
      { art: '🧭', en: 'north', zh: '北' },
      { art: '🔥', en: 'burn', zh: '燃烧' },
      { art: '🗺️', en: 'points', zh: '指' }
    ],
    sight: ['a', 'the', 'at', 'of', 'are', 'so', 'we', 'our', 'in', 'bright', 'count', 'tight', 'dreams', 'draws', 'showed'],
    newWords: [
      { w: 'star', zh: '星星' },
      { w: 'dark', zh: '黑的' },
      { w: 'north', zh: '北' },
      { w: 'burn', zh: '燃烧' },
      { w: 'chart', zh: '图' },
      { w: 'thirty', zh: '三十' }
    ],
    pages: [
      { art: '🌃', en: 'After dinner Lili looks up at the dark, dark sky.', zh: '晚饭后，莉莉抬头望着黑黑的夜空。' },
      { art: '⭐', en: 'A bright star shines over the far, dark hills.', zh: '一颗星照在远处的山头上。' },
      { art: '🔭', en: 'Grandpa brings a small old chart of the stars to us.', zh: '爷爷拿来一张小小的星图。' },
      { art: '🗺️', en: 'He points to the North Star and the Big Dipper.', zh: '他指了指北极星和北斗。' },
      { art: '👧', en: 'Lili asks Grandpa why the stars are so far away.', zh: '莉莉问爷爷，星星为什么那么远。' },
      { art: '👴', en: 'Grandpa says they burn far away, like our sun.', zh: '爷爷说它们也在燃烧，只是远，像我们的太阳。' },
      { art: '🌌', en: 'We count seven stars, then thirty more far away.', zh: '我们数了七颗，又数了三十颗。' },
      { art: '🌬️', en: 'The night air is cold. We pull our scarves tight.', zh: '夜里冷，我们把围巾拢紧。' },
      { art: '🏠', en: 'Grandma calls us in. We take one last long look.', zh: '奶奶喊我们进屋，我们又看了好久。' },
      { art: '🛏️', en: 'Lili dreams of a bright star over the hills.', zh: '莉莉梦见一颗亮星挂在山那边。' },
      { art: '🖍️', en: 'In the morning she draws it on a big sheet of paper.', zh: '早上她把它画在一大张纸上。' },
      { art: '✍️', en: 'She writes: for Grandpa, who showed me the stars at night.', zh: '她写上：给爷爷，是他带我看了夜里的星星。' }
    ],
    quiz: [
      { q: '爷爷用什么指星星？', opts: ['一张星图', '手电筒', '望远镜'], a: 0 },
      { q: '爷爷说星星为什么看着小？', opts: ['被云挡住', '它们很小', '离得太远'], a: 2 },
      { q: '第二天早上莉莉做了什么？', opts: ['把星星画下来', '把星图收起来', '又去数星星'], a: 0 }
    ]
  },
  {
    id: 'b40', lv: 'L7', tag: '校园 · 运动会', title: 'The Sports Day', zh: '运动会',
    emoji: '🏃', color: '#FFD9A0',
    track: 'story',
    goal: 'or / ir 对比，读懂「摔倒了还是继续跑」',
    trap: 'sport / short / morning 是 or，first / third / shirt 是 ir。中文没有词尾卷舌，孩子常把 sport 读成「斯波特」；收尾的 r 要卷，但不能多带出一个「呃」。',
    summary: '学校秋季运动会：小明第一场被衣服挂了一下摔倒，爬起来接着跑；莉莉的接力队少一个人，喊他补上，最后一棒反超拿了第一。老师说最棒的不是分数。这是本套书第一次写「失败之后怎么继续」，也是第一次出现同学之间互相补位。',
    pre: [
      { art: '🏃', en: 'sports', zh: '运动' },
      { art: '🥇', en: 'first', zh: '第一' },
      { art: '🥉', en: 'third', zh: '第三' },
      { art: '📏', en: 'short', zh: '短／缺' },
      { art: '🏅', en: 'score', zh: '分数' }
    ],
    sight: ['a', 'the', 'in', 'and', 'for', 'we', 'by', 'is', 'not', 'autumn', 'shout', 'catches', 'fourth', 'team', 'joins', 'teacher', 'score', 'tired'],
    newWords: [
      { w: 'sports', zh: '运动' },
      { w: 'first', zh: '第一' },
      { w: 'third', zh: '第三' },
      { w: 'short', zh: '短／缺' },
      { w: 'turn', zh: '一棒' },
      { w: 'part', zh: '部分' }
    ],
    pages: [
      { art: '🏫', en: 'Our school holds a sports day every autumn.', zh: '我们学校每年秋天开运动会。' },
      { art: '🏃', en: 'Ming runs in the first race. Lili runs in the third.', zh: '小明跑第一场，莉莉跑第三场。' },
      { art: '📣', en: 'We clap and shout for our class by the track.', zh: '我们在跑道边给班里加油。' },
      { art: '🎽', en: 'Ming starts fast, but his shirt catches on a small post.', zh: '小明起跑很快，衣服却挂在一根小柱子上。' },
      { art: '😟', en: 'He falls, gets up, and runs on. He is fourth.', zh: '他摔了一跤，爬起来接着跑，落到第四。' },
      { art: '🤝', en: 'Lili\'s team is short of one runner. She calls Ming.', zh: '莉莉的队少一个人，她喊小明来。' },
      { art: '🏅', en: 'Ming joins the relay. He takes the last turn.', zh: '小明加入接力，跑最后一棒。' },
      { art: '🏁', en: 'They pass the stick and win by a short step.', zh: '他们交了棒，领先一点点赢了。' },
      { art: '👏', en: 'No cup for Ming, but the class sings his name.', zh: '小明没拿到奖杯，全班却喊他的名字。' },
      { art: '👩‍🏫', en: 'Our teacher says the best part is not the score.', zh: '老师说最棒的地方不是分数。' },
      { art: '🌇', en: 'We walk home in the warm evening, tired and glad.', zh: '傍晚暖暖的，我们累着、也高兴着走回家。' },
      { art: '💛', en: 'Third or first, we are a team. That is sports day.', zh: '第三也好第一也好，我们是一个队。这就是运动会。' }
    ],
    quiz: [
      { q: '小明第一场出了什么事？', opts: ['衣服挂住摔了一跤', '鞋掉了', '跑错道'], a: 0 },
      { q: '莉莉的接力队缺什么？', opts: ['一双鞋', '一根接力棒', '一个人'], a: 2 },
      { q: '老师说最棒的是什么？', opts: ['跑得最快', '奖杯', '不是分数'], a: 2 }
    ]
  },
  {
    id: 'b41', lv: 'L7', tag: '🔬 卷舌音专项', title: 'Car, Corn, Curl', zh: '卷起舌头',
    emoji: '🔬', color: '#BFD7EA',
    track: 'drill',
    goal: 'ar / or / ir-er-ur 三类口型对比，统一用美音',
    trap: '把舌尖向上卷起，但不要碰到上颚，也不要贴住牙齿。ar 下巴张大（car），or 嘴唇收圆（corn），ir / er / ur 是同一个中间音（her / bird / turn）。词尾的 r 一定要卷，别丢成「卡」「扣恩」。',
    summary: '这一册专门解决中国孩子最顽固的一个音。第 6、7 页讲清一个常被忽略的事实：美音里 car 的 r 要发出来，英音里常常不发；本站全部音频统一用美音，所以我们也按美音练。同一组 r 音有三种拼写，不必一种拼法一个读法。',
    pre: [
      { art: '🚗', en: 'car', zh: '汽车' },
      { art: '🌽', en: 'corn', zh: '玉米' },
      { art: '🌀', en: 'curl', zh: '卷' },
      { art: '⭐', en: 'star', zh: '星星' },
      { art: '🟣', en: 'purple', zh: '紫色' }
    ],
    sight: ['a', 'the', 'is', 'for', 'up', 'do', 'not', 'we', 'on', 'mouth', 'round', 'tongue', 'touch', 'sounded', 'hear'],
    newWords: [
      { w: 'car', zh: '汽车' },
      { w: 'corn', zh: '玉米' },
      { w: 'curl', zh: '卷' },
      { w: 'star', zh: '星星' },
      { w: 'turn', zh: '转' }
    ],
    pages: [
      { art: '🚗🌽', en: 'A car. Some corn. A curl. Three sounds here today: ar, or, ur.', zh: '汽车、玉米、卷发，这里有 ar、or、ur 三个音。' },
      { art: '🗣️', en: 'For ar, open the mouth wide: car, star, far, hard, part.', zh: 'ar：把嘴张大，car、star、far、hard。' },
      { art: '🌽', en: 'For or, round the lips: corn, short, morning, north, sport.', zh: 'or：嘴唇收圆，corn、short、morning、north。' },
      { art: '👧', en: 'For ir, er, ur, the sound is the same: her, bird, turn, first, girl.', zh: 'ir、er、ur 读起来一样：her、bird、turn。' },
      { art: '🪞', en: 'Curl your tongue up, but do not touch the roof.', zh: '舌尖卷起来，别碰到上颚。' },
      { art: '🇺🇸', en: 'In American English the r is always sounded after a vowel.', zh: '美音里，元音后面的 r 都要读出来。' },
      { art: '🇬🇧', en: 'In British English a car may sound like cah.', zh: '英音里 car 有时听着像 cah。' },
      { art: '🔤', en: 'We use the American way on this site, every single time.', zh: '本站从头到尾都用美音。' },
      { art: '🗣️', en: 'Car, corn, curl. Far, short, turn. Now say them all.', zh: 'car、corn、curl；far、short、turn。都念一遍。' },
      { art: '🔤', en: 'Now try: star, north, girl, water, first, purple, her, bird.', zh: '再试试：star、north、girl、water、first、purple。' },
      { art: '👏', en: 'One tongue, three spellings, and you can hear them all today.', zh: '一条舌头，三种拼写，你都能听出来了。' }
    ],
    quiz: [
      { q: 'ar 和 or 的口型一样吗？', opts: ['不一样', '一样', '只有长短不同'], a: 0 },
      { q: '哪三种拼写读同一个卷舌音？', opts: ['ar、or、ur', 'ir、er、ur', 'a、o、u'], a: 1 },
      { q: '本站的发音按哪种口音？', opts: ['美音', '澳音', '英音'], a: 0 }
    ]
  },
  {
    id: 'b42', lv: 'L7', tag: '🌍 玉米的一生', title: 'How Corn Grows', zh: '玉米怎么长大',
    emoji: '🌽', color: '#F7E2B8',
    track: 'info',
    goal: '用卷舌音词读懂「种子 → 花粉 → 玉米粒」',
    trap: 'corn / dirt / turn / kernels / firm 都是本站的卷舌音；kernel 重音在第一拍 KER-nel，别把两个音节读得一样重。',
    summary: '这本讲一件容易被忽略的事：玉米顶上那撮「天花」落下花粉，落到下面细细的玉米须上，每一根须才长成一粒玉米。绿皮包着棒子，夏末粒变金黄变硬，就可以掰下来煮着吃。中文可以补一句：所以玉米粒的行数通常是偶数，这是它从小花成对长出来的结果。',
    pre: [
      { art: '🌽', en: 'corn', zh: '玉米' },
      { art: '🟤', en: 'dirt', zh: '泥土' },
      { art: '🌱', en: 'seed', zh: '种子' },
      { art: '🌽', en: 'kernels', zh: '玉米粒' },
      { art: '🛡️', en: 'husks', zh: '外皮' }
    ],
    sight: ['a', 'the', 'as', 'in', 'and', 'of', 'on', 'it', 'we', 'yellow', 'earth', 'leaves', 'young', 'ear', 'wrap', 'ears', 'boil', 'bread', 'whole'],
    newWords: [
      { w: 'corn', zh: '玉米' },
      { w: 'dirt', zh: '泥土' },
      { w: 'seed', zh: '种子' },
      { w: 'kernels', zh: '玉米粒' },
      { w: 'firm', zh: '结实的' }
    ],
    pages: [
      { art: '🌽', en: 'Corn starts as a small hard yellow seed in the dirt.', zh: '玉米起初是泥里一粒又小又硬的黄种子。' },
      { art: '🌧️', en: 'Warm sun and spring rain wake the small seed up.', zh: '暖阳和春雨把种子唤醒。' },
      { art: '🌱', en: 'First a small green shoot pushes through the soft, wet earth.', zh: '先有一根绿芽顶出松软的土。' },
      { art: '🌿', en: 'The stalk grows taller. Long leaves curl around it.', zh: '秆子越长越高，长叶卷在四周。' },
      { art: '🌾', en: 'At the very top a tassel drops fine yellow dust.', zh: '顶上的天花撒下细细的黄粉。' },
      { art: '🌽', en: 'The fine dust falls on the silk of the young ear.', zh: '花粉落在嫩棒子的玉米须上。' },
      { art: '🌱', en: 'Each silk grows into one small soft kernel of corn.', zh: '每一根须长成一粒软软的玉米。' },
      { art: '🛡️', en: 'Green husks wrap the young ear and keep it safe and warm.', zh: '绿皮把棒子裹住，护着它。' },
      { art: '🌞', en: 'By late summer the soft kernels turn gold and firm.', zh: '夏末，玉米粒变金黄、变结实。' },
      { art: '🧺', en: 'Grandpa pulls the ears and carries them home.', zh: '爷爷把棒子掰下来带回家。' },
      { art: '🍲', en: 'We boil them in a big pot, or we make corn bread.', zh: '我们或煮着吃，或做成玉米饼。' },
      { art: '🙏', en: 'From one small seed, a whole field of corn.', zh: '一粒小种子，可以长出整整一地玉米。' }
    ],
    quiz: [
      { q: '玉米是从什么开始的？', opts: ['一片叶子', '一粒硬种子', '一根须'], a: 1 },
      { q: '顶上的花粉落在哪里？', opts: ['绿皮上', '泥土里', '玉米须上'], a: 2 },
      { q: '什么时候可以收玉米？', opts: ['刚出芽时', '夏末粒变金黄', '开花当天'], a: 1 }
    ]
  },
  {
    id: 'b43', lv: 'L8', tag: '冬至 · 包饺子', title: 'Grandma\'s Dumplings', zh: '奶奶的饺子',
    emoji: '🥟', color: '#F6C6C6',
    track: 'story',
    goal: 'ou/ow/au/ew 新字素，读懂包饺子的完整过程',
    trap: 'ou、ow 常读 /aʊ/（flour、brown），au、aw 读 /ɔː/（sauce、straw），ew 读 /juː/ 或 /uː/（new、chew）。别把 flour 读成「floor」——这两个词同音但意思完全不同。',
    summary: '冬天天冷，全家围在一起包饺子：和面、擀皮、拌馅、捏边，小明的第一个露了馅，奶奶说多试一个就好。水开了，饺子浮起来就熟。这本每一个步骤都能在家照着做，中文小结里还写了「为什么冬至要吃饺子」。孩子读英文时脑子里有画面，不需要逐词翻译。',
    pre: [
      { art: '🥟', en: 'dumplings', zh: '饺子' },
      { art: '🥣', en: 'flour', zh: '面粉' },
      { art: '🌀', en: 'dough', zh: '面团' },
      { art: '🥄', en: 'filling', zh: '馅' },
      { art: '🫓', en: 'wrapper', zh: '饺子皮' },
      { art: '♨️', en: 'boils', zh: '沸腾' }
    ],
    sight: ['a', 'the', 'in', 'and', 'on', 'we', 'of', 'with', 'are', 'when', 'pieces', 'piece', 'edge', 'laughs', 'tries', 'year'],
    newWords: [
      { w: 'dumplings', zh: '饺子' },
      { w: 'dough', zh: '面团' },
      { w: 'flour', zh: '面粉' },
      { w: 'filling', zh: '馅' },
      { w: 'wrapper', zh: '皮' },
      { w: 'boils', zh: '沸腾' }
    ],
    pages: [
      { art: '🥟', en: 'On a cold winter day, Grandma says we will make dumplings together.', zh: '天冷的那天，奶奶说我们一起包饺子。' },
      { art: '🥣', en: 'She mixes flour and water in a big bowl until the dough is smooth.', zh: '她在大盆里把面粉和水和成光溜溜的面团。' },
      { art: '🪵', en: 'Ming rolls the dough into a long rope and cuts it into small pieces.', zh: '小明把面团搓成长条，切成小块。' },
      { art: '🫓', en: 'Lili presses each piece flat with her palm. Some are round, some are not.', zh: '莉莉把小块一个个压扁，有的圆，有的不圆。' },
      { art: '🥬', en: 'Grandma chops cabbage and meat, then adds a little salt and oil.', zh: '奶奶剁好白菜和肉，加一点盐和油。' },
      { art: '🥄', en: 'We put a spoon of filling in the middle and fold the wrapper over.', zh: '我们舀一勺馅放在中间，把皮对折。' },
      { art: '🤏', en: 'Grandma pinches the edge. Her dumplings stand up like little boats.', zh: '奶奶捏紧边，她的饺子像小船一样立着。' },
      { art: '😅', en: 'Ming\'s first dumpling leaks. He laughs and tries another one.', zh: '小明的第一个漏了馅，他笑着又试了一个。' },
      { art: '♨️', en: 'Water boils in the pot. The dumplings float up when they are done.', zh: '锅里的水开了，饺子浮起来就熟了。' },
      { art: '🍽️', en: 'We eat them with vinegar. Grandpa says these are the best this year.', zh: '我们蘸着醋吃，爷爷说这是今年最好的一顿。' },
      { art: '🌙', en: 'After dinner we sit by the window and count the stars again.', zh: '饭后我们坐在窗边，又数起星星。' },
      { art: '💛', en: 'The room is warm. Our hands are tired, but nobody wants to leave.', zh: '屋里暖暖的，手都累了，可谁也不想走。' }
    ],
    quiz: [
      { q: '面团是用哪两样和出来的？', opts: ['米和水', '面粉和水', '牛奶和糖'], a: 1 },
      { q: '谁的饺子露了馅？', opts: ['爷爷', '莉莉', '小明'], a: 2 },
      { q: '怎么知道饺子煮好了？', opts: ['浮起来了', '数到十', '水变色了'], a: 0 }
    ]
  },
  {
    id: 'b44', lv: 'L8', tag: '中秋 · 月儿圆', title: 'The Mooncake Night', zh: '月饼那一晚',
    emoji: '🌕', color: '#FFE0A3',
    track: 'story',
    goal: 'ou/ow/igh 与「圆」的意象，读懂一家人怎么过节',
    trap: 'round 的 ou、brown 的 ow 都读 /aʊ/；bright / night 的 igh 读 /aɪ/，gh 完全不出声。中文「圆」在英语里是 round，既说月亮，也说一家人坐成一圈。',
    summary: '中秋夜，院子里摆一张圆桌：切月饼、听嫦娥的故事、找玉兔、提灯笼、给远方的叔叔打电话，奶奶说月圆就是人团圆。最后莉莉把一块月饼放在窗边，梦见月亮上的兔子。这本故意不用神话里的专有名词，孩子先把「团圆」的意思读懂，以后再学那些名字。',
    pre: [
      { art: '🥮', en: 'mooncake', zh: '月饼' },
      { art: '⭕', en: 'round', zh: '圆的' },
      { art: '✨', en: 'bright', zh: '亮的' },
      { art: '🏮', en: 'lanterns', zh: '灯笼' },
      { art: '☁️', en: 'cloud', zh: '云' },
      { art: '🐇', en: 'rabbit', zh: '兔子' }
    ],
    sight: ['a', 'the', 'and', 'in', 'on', 'we', 'of', 'for', 'it', 'is', 'while', 'quiet'],
    newWords: [
      { w: 'mooncake', zh: '月饼' },
      { w: 'round', zh: '圆的' },
      { w: 'bright', zh: '亮的' },
      { w: 'lanterns', zh: '灯笼' },
      { w: 'cloud', zh: '云' },
      { w: 'rabbit', zh: '兔子' }
    ],
    pages: [
      { art: '🌕', en: 'The full moon is round and bright above our small courtyard tonight.', zh: '今晚月亮又圆又亮，照着我家的小院。' },
      { art: '👨‍👩‍👧‍👦', en: 'All our family sits down around one round table in the yard.', zh: '全家人围着院里一张圆桌坐下。' },
      { art: '🥮', en: 'Grandma puts a mooncake on a plate and cuts it into four pieces.', zh: '奶奶把月饼放在盘里，切成四块。' },
      { art: '🌰', en: 'Inside is sweet bean paste and a golden egg yolk, Lili says.', zh: '莉莉说里面是甜豆沙，还有一颗金黄的蛋黄。' },
      { art: '🍵', en: 'Grandpa pours tea and tells the old story of the lady on the moon.', zh: '爷爷倒上茶，讲起月亮上那位仙子的老故事。' },
      { art: '🐇', en: 'Lili looks up for the rabbit. Ming says he can see its long ears.', zh: '莉莉找玉兔，小明说他看见兔耳朵了。' },
      { art: '🏮', en: 'We carry paper lanterns down the lane and count the bright ones.', zh: '我们提着纸灯沿巷子走，数哪盏最亮。' },
      { art: '🌥️', en: 'A cloud hides the moon for a while, then it comes out again.', zh: '云把月亮遮了一会儿，它又出来了。' },
      { art: '📞', en: 'We call Uncle in another city. He says the same moon shines there.', zh: '我们给另一座城市的叔叔打电话，他说那边也是同一轮月亮。' },
      { art: '🤝', en: 'Grandma says a round moon means the whole family is together.', zh: '奶奶说月圆，就是说全家人在一起。' },
      { art: '🌙', en: 'Before bed we put one mooncake by the window for good luck.', zh: '睡前我们把一块月饼放在窗边，讨个好彩头。' },
      { art: '💤', en: 'The night is quiet. Lili dreams of a rabbit on the moon.', zh: '夜很静，莉莉梦见月亮上的兔子。' }
    ],
    quiz: [
      { q: '奶奶把月饼切成了几块？', opts: ['四块', '八块', '两块'], a: 0 },
      { q: '爷爷讲了什么？', opts: ['月亮上的老故事', '高铁的故事', '种玉米的事'], a: 0 },
      { q: '奶奶说圆圆的月亮代表什么？', opts: ['该睡觉了', '要下雨了', '一家人团圆'], a: 2 }
    ]
  },
  {
    id: 'b45', lv: 'L8', tag: '高铁 · 回奶奶家', title: 'The Fast Train', zh: '回奶奶家',
    emoji: '🚄', color: '#BFD7EA',
    track: 'story',
    goal: '长句按意群读，读懂一段真实的旅程',
    trap: '超过 12 词的句子要在介词短语前轻轻换气：「We find our seats / by the window / and put the bags above us.」不要一口气冲到底，也不要一个词一个词蹦。',
    summary: '清早到新车站、爸爸手机上的车票、靠窗的座位、悄悄开动的列车、掠过的楼房和稻田、盒饭、过江大桥、莉莉画路线图，最后看见熟悉的房子，奶奶在门口等着。这本按真实时间顺序写，可以让孩子读完用中文把「先…然后…最后…」讲一遍。',
    pre: [
      { art: '🚉', en: 'station', zh: '车站' },
      { art: '💺', en: 'seats', zh: '座位' },
      { art: '🪟', en: 'window', zh: '车窗' },
      { art: '🌉', en: 'bridge', zh: '桥' },
      { art: '🗺️', en: 'route', zh: '路线' },
      { art: '🏘️', en: 'village', zh: '村子' }
    ],
    sight: ['a', 'the', 'at', 'in', 'we', 'on', 'and', 'of', 'with', 'is', 'early', 'phone', 'clear', 'grey', 'buildings', 'fruit', 'door'],
    newWords: [
      { w: 'station', zh: '车站' },
      { w: 'seats', zh: '座位' },
      { w: 'window', zh: '窗户' },
      { w: 'bridge', zh: '桥' },
      { w: 'route', zh: '路线' },
      { w: 'village', zh: '村子' }
    ],
    pages: [
      { art: '🚄', en: 'At seven in the early morning we arrive at the big new station.', zh: '早上七点，我们到了崭新的大车站。' },
      { art: '🎫', en: 'Dad shows the tickets on his phone. The screen is bright and clear.', zh: '爸爸在手机上亮出车票，屏幕又亮又清楚。' },
      { art: '🧳', en: 'We find our seats by the wide window and put the bags up above us.', zh: '我们找到靠窗的座位，把包放到上面。' },
      { art: '🚉', en: 'The train starts so smoothly that Lili does not notice at first.', zh: '车开得太平稳，莉莉一开始都没发觉。' },
      { art: '🏙️', en: 'Houses and tall grey buildings slide past, then wide fields of green rice.', zh: '房屋和高楼掠过，接着是一片片绿稻田。' },
      { art: '⏱️', en: 'Ming counts the minutes. One hundred and twenty, Grandma says.', zh: '小明数着分钟，奶奶说过要一百二十分钟。' },
      { art: '🍱', en: 'We eat lunch from a small box: rice, chicken, and a piece of fruit.', zh: '我们吃小盒饭：米饭、鸡肉，还有一块水果。' },
      { art: '🌉', en: 'The train crosses a long bridge over a wide brown river.', zh: '列车驶过一座长桥，桥下是宽宽的黄河。' },
      { art: '🌾', en: 'Through the window we can see water buffalo standing in the wet fields.', zh: '透过车窗，我们看见水牛站在田里。' },
      { art: '🗺️', en: 'Lili draws a map of our route and marks every stop with a dot.', zh: '莉莉画了路线图，每站点一个点。' },
      { art: '🏘️', en: 'At last the houses look familiar. That is Grandma\'s village.', zh: '终于，房子看着眼熟了，那是奶奶的村子。' },
      { art: '👵', en: 'She waits at the door with a warm smile and hot soup.', zh: '她端着热汤，笑盈盈地在门口等。' }
    ],
    quiz: [
      { q: '车票放在哪里？', opts: ['奶奶家', '爸爸的手机上', '书包里'], a: 1 },
      { q: '奶奶说这趟车要坐多久？', opts: ['二十分钟', '一整天', '一百二十分钟'], a: 2 },
      { q: '谁在门口等他们？', opts: ['叔叔', '奶奶', '爷爷'], a: 1 }
    ]
  },
  {
    id: 'b46', lv: 'L8', tag: '🔬 新元音专项', title: 'Doudou\'s Loud Day', zh: '豆豆的热闹一天',
    emoji: '🔬', color: '#D8C7F0',
    track: 'drill',
    goal: 'ou/ow/oi/oy/au/aw/ew 六个组合，四类读音',
    trap: 'ou、ow 常读 /aʊ/（cloud、cow），oi、oy 读 /ɔɪ/（coin、toy），au、aw 读 /ɔː/（sauce、straw），ew 读 /uː/（chew）。一个提醒：ow 在 snow 里读 /oʊ/，所以看字素不是死记，遇到不确定的词先听音频。',
    summary: '这一册让豆豆带着孩子把六个新组合走一遍：云、奶牛、硬币、玩具、酱汁、稻草帽。第 9 页把「六个拼写、四类读音」摆在一起，第 11 页专门说一句要紧的：不要拿中文谐音去猜英文，要看字母组合，再听一遍站里的发音。',
    pre: [
      { art: '☁️', en: 'cloud', zh: '云' },
      { art: '🐄', en: 'cow', zh: '奶牛' },
      { art: '🪙', en: 'coin', zh: '硬币' },
      { art: '🧸', en: 'toy', zh: '玩具' },
      { art: '🥫', en: 'sauce', zh: '酱汁' },
      { art: '👒', en: 'straw', zh: '稻草' }
    ],
    sight: ['a', 'the', 'on', 'it', 'with', 'to', 'but', 'he', 'is', 'and', 'tried'],
    newWords: [
      { w: 'cloud', zh: '云' },
      { w: 'cow', zh: '奶牛' },
      { w: 'coin', zh: '硬币' },
      { w: 'toy', zh: '玩具' },
      { w: 'sauce', zh: '酱汁' },
      { w: 'straw', zh: '稻草' }
    ],
    pages: [
      { art: '🐕', en: 'Doudou has a loud day. He finds a lot to shout about.', zh: '豆豆今天可热闹了，样样都想叫两声。' },
      { art: '🌧️', en: 'A cloud drops rain on his nose. He shakes it off with a growl.', zh: '云把雨滴到他鼻子上，他一甩头，低低吼了一声。' },
      { art: '🐄', en: 'A brown cow looks over the fence. Doudou bounds to the gate.', zh: '一头棕牛从篱笆外看过来，豆豆窜到门口。' },
      { art: '🧸', en: 'Lili has a new toy. Doudou wants that toy, but he must not take it.', zh: '莉莉有了新玩具，豆豆想要，可不能拿。' },
      { art: '🪙', en: 'Ming drops a coin. It rolls under the couch with a small sound.', zh: '小明掉了一枚硬币，它咕噜滚到沙发底下。' },
      { art: '🫖', en: 'Grandma boils water for tea. The pot lets out a loud hiss.', zh: '奶奶烧水泡茶，壶嘴嘶嘶响。' },
      { art: '🖍️', en: 'Lili draws a big yellow sun. Doudou puts a paw on the paper.', zh: '莉莉画了个大黄太阳，豆豆一爪子按上去。' },
      { art: '👒', en: 'He saw a small straw hat and tried to chew it.', zh: '他看见一顶小草帽，想咬一口。' },
      { art: '🔤', en: 'Ou, ow, oi, oy, au, aw. Six spellings, four sounds. Say them.', zh: 'ou、ow、oi、oy、au、aw：六种写法，四类音，念一念。' },
      { art: '🗣️', en: 'Cloud, cow, coin, toy, sauce, straw. Now you can read them all.', zh: '云、牛、硬币、玩具、酱、稻草，现在你都能读了。' },
      { art: '👀', en: 'Do not guess from Chinese. Look at the letters and say the sound.', zh: '别拿中文谐音猜，看清字母，再读出那个音。' },
      { art: '💤', en: 'Doudou is tired now. His loud day is over at last.', zh: '豆豆累了，热闹的一天总算过去了。' }
    ],
    quiz: [
      { q: 'ou 和 ow 在这册里读什么？', opts: ['/aʊ/', '/iː/', '/ɔɪ/'], a: 0 },
      { q: '哪两个组合读 /ɔɪ/？', opts: ['oi 和 oy', 'ou 和 ow', 'au 和 aw'], a: 0 },
      { q: '碰到不会读的新词该怎么做？', opts: ['看字素再听音频', '跳过不读', '按中文猜'], a: 0 }
    ]
  },
  {
    id: 'b47', lv: 'L8', tag: '写信 · 慢慢说', title: 'A Letter to Grandma', zh: '给奶奶的信',
    emoji: '✉️', color: '#F2B5D4',
    track: 'story',
    goal: '长句里的从句与逗号，读懂「写信—等信—回信」',
    trap: '这一站开始有两三个从句叠在一句里，逗号处停半拍：She answers every question / and sends a photo / of her garden。wh / ph / wr 这几个组合下一站才正式教，这本里的 photo、handwriting 先整体认读。',
    summary: '奶奶住村里，孩子们住城里。小明写信讲新老师和校园剧，画了长尾巴的咪咪；莉莉添了花和星星；爸爸投进街角的邮筒。等了三天，回信来了，奶奶把每个问题都答了，还寄来菜园的照片。这本写的是「慢慢说话」这件事，也让孩子第一次体会纸质信件的等待。',
    pre: [
      { art: '✉️', en: 'letter', zh: '信' },
      { art: '📬', en: 'envelope', zh: '信封' },
      { art: '🖋️', en: 'handwriting', zh: '字迹' },
      { art: '📷', en: 'photo', zh: '照片' },
      { art: '❓', en: 'question', zh: '问题' },
      { art: '✅', en: 'answers', zh: '回答' }
    ],
    sight: ['a', 'the', 'in', 'we', 'on', 'of', 'and', 'it', 'with', 'her', 'pears'],
    newWords: [
      { w: 'letter', zh: '信' },
      { w: 'envelope', zh: '信封' },
      { w: 'handwriting', zh: '字迹' },
      { w: 'photo', zh: '照片' },
      { w: 'question', zh: '问题' }
    ],
    pages: [
      { art: '🏘️', en: 'Grandma lives in the small village. We live in the big city, far away from her.', zh: '奶奶住在村里，我们住在城里，离她很远。' },
      { art: '📝', en: 'Tonight Ming writes her a long letter on a clean sheet of white paper.', zh: '今晚小明在一张白纸上给她写信。' },
      { art: '🖊️', en: 'He tells her all about his new teacher and the new school play.', zh: '他跟她讲新老师，还有学校的演出。' },
      { art: '🐱', en: 'He draws Mimi at the bottom of the page with a very long tail.', zh: '他在末尾画了咪咪，尾巴画得特别长。' },
      { art: '🌸', en: 'Lili adds a small red flower and three bright yellow stars at the top.', zh: '莉莉添了一朵小红花和三颗亮黄的星星。' },
      { art: '📮', en: 'Dad takes the letter to the post box on the corner.', zh: '爸爸把信投进街角的邮筒。' },
      { art: '⏳', en: 'We wait three long days. Lili checks the box early every morning.', zh: '我们等了三天，莉莉每天早上都去看信箱。' },
      { art: '📬', en: 'Then a thin envelope arrives with Grandma\'s round handwriting.', zh: '后来来了一个薄薄的信封，是奶奶圆圆的字。' },
      { art: '📖', en: 'She answers every question and sends a photo of her green garden.', zh: '她把每个问题都答了，还寄来菜园的照片。' },
      { art: '🌽', en: 'The corn is tall now, she writes, and the pears are sweet.', zh: '她写着：玉米长高了，梨也甜了。' },
      { art: '💛', en: 'Ming reads it twice, then puts it in his small special box.', zh: '小明读了两遍，把它收进自己的小盒子里。' },
      { art: '✍️', en: 'Tonight we will write back. A letter is a slow, warm talk.', zh: '今晚我们就回信。一封信，是一场慢慢的、暖暖的聊天。' }
    ],
    quiz: [
      { q: '小明在信的末尾画了什么？', opts: ['一列火车', '长尾巴的咪咪', '一只熊猫'], a: 1 },
      { q: '信寄出后等了几天才有回信？', opts: ['三天', '一个月', '一天'], a: 0 },
      { q: '奶奶在回信里寄来了什么？', opts: ['一张车票', '菜园的照片', '一包饺子'], a: 1 }
    ]
  },
  {
    id: 'b48', lv: 'L8', tag: '🌍 熊猫宝宝', title: 'How Pandas Grow', zh: '熊猫怎么长大',
    emoji: '🐼', color: '#C9E4C5',
    track: 'info',
    goal: '读懂「新生幼崽 → 吃竹子 → 保护与回归野外」',
    trap: 'giant、centre、habitat 这类多音节词，重音只落在一个音节上：GI-ant、CEN-tre、HA-bi-tat，其余轻声带过。中文每个字都重，孩子容易把每个音节读得一样重。',
    summary: '刚出生的大熊猫幼崽只有一百克左右，粉红色、没毛、看不见，比一个苹果还轻；妈妈抱着喂奶好几个月，黑眼圈慢慢长出来，半岁左右开始啃竹笋。成年熊猫一天要吃十几个小时的竹子，前爪有一根「伪拇指」专门用来抓竹秆。中文补一句：野生种群现在约一千八百多只，仍属易危，保护竹林和繁育中心让它比三十年前多了。',
    pre: [
      { art: '🐼', en: 'panda', zh: '熊猫' },
      { art: '👶', en: 'cub', zh: '幼崽' },
      { art: '🎋', en: 'bamboo', zh: '竹子' },
      { art: '🌲', en: 'forest', zh: '森林' },
      { art: '🖐️', en: 'thumb', zh: '拇指' },
      { art: '🏥', en: 'centres', zh: '中心' }
    ],
    sight: ['a', 'the', 'and', 'it', 'is', 'in', 'of', 'for', 'than', 'are', 'weighs', 'patches', 'appear', 'eyes'],
    newWords: [
      { w: 'panda', zh: '熊猫' },
      { w: 'cub', zh: '幼崽' },
      { w: 'bamboo', zh: '竹子' },
      { w: 'forest', zh: '森林' },
      { w: 'thumb', zh: '拇指' },
      { w: 'habitat', zh: '栖息地' }
    ],
    pages: [
      { art: '🐼', en: 'A giant panda is black and white, and it lives in the mountains of China.', zh: '大熊猫黑白相间，生活在中国的高山里。' },
      { art: '👶', en: 'A newborn cub is tiny. It is pink, blind, and has no fur.', zh: '刚出生的宝宝很小，粉红色，看不见，也没有毛。' },
      { art: '⚖️', en: 'It weighs about one hundred grams, less than a small apple.', zh: '它大约一百克，比一个小苹果还轻。' },
      { art: '🤱', en: 'The mother holds it close and feeds it milk for many months.', zh: '妈妈把它紧紧抱着，喂好几个月奶。' },
      { art: '🐾', en: 'Slowly the black patches appear around its eyes and ears.', zh: '慢慢地，眼睛和耳朵周围长出黑斑。' },
      { art: '🎋', en: 'At about six months the cub starts to chew bamboo shoots.', zh: '大约半岁时，宝宝开始啃竹笋。' },
      { art: '🌿', en: 'An adult panda eats bamboo for more than twelve hours a day.', zh: '成年熊猫一天吃竹子超过十二个小时。' },
      { art: '🖐️', en: 'Its front paws have a special thumb that helps it grip the stems.', zh: '它的前爪有一根特别的「拇指」，帮它抓住竹秆。' },
      { art: '🏔️', en: 'Pandas live high in cool, wet forests where bamboo grows all year.', zh: '熊猫住在又凉又湿的高山竹林里，那里竹子常年生长。' },
      { art: '🌱', en: 'Because their habitat is shrinking, people plant more bamboo and protect the forest.', zh: '因为栖息地在缩小，人们种下更多竹子，也把林子护起来。' },
      { art: '🏥', en: 'Breeding centres help cubs survive, then return them to the wild when they are ready.', zh: '繁育中心帮幼崽活下来，等它们能独立了再放回野外。' },
      { art: '💚', en: 'Today there are more pandas than thirty years ago. That is good news.', zh: '今天的熊猫比三十年前多了，这是个好消息。' }
    ],
    quiz: [
      { q: '刚出生的熊猫宝宝是什么样？', opts: ['已经会吃竹子', '黑白分明、会跑', '粉红、没毛、看不见'], a: 2 },
      { q: '成年熊猫一天吃竹子多久？', opts: ['一小时', '一整天不吃', '十二小时以上'], a: 2 },
      { q: '熊猫数量为什么变多了？', opts: ['保护竹林和繁育中心', '竹子自己变多了', '天气变冷'], a: 0 }
    ]
  },
  {
    id: 'b49', lv: 'L9', tag: '过年 · 一整家', title: 'The Spring Festival', zh: '过年',
    emoji: '🧨', color: '#F6C6C6',
    track: 'story',
    goal: '读懂从腊月扫除到年初一拜年的完整时间线',
    trap: '长句里逗号是换气点，不是随便点的：Two days before New Year, / we clean every room / from top to bottom。一句里三处意群，读成三口气就顺了。',
    summary: '过年前两天大扫除、贴春联、赶集、包饺子；年夜饭上爷爷讲为什么今晚不扫地，饭后发红包，守岁到半夜，初一穿新衣给街坊拜年。中文小结里补了「鱼」和「年年有余」的谐音，以及现在很多人不放鞭炮、改看晚会的原因。这本是全套书里中国生活细节最密的一本。',
    pre: [
      { art: '🖌️', en: 'couplets', zh: '对联' },
      { art: '🧧', en: 'packets', zh: '红包' },
      { art: '📺', en: 'gala', zh: '晚会' },
      { art: '🕛', en: 'midnight', zh: '半夜' },
      { art: '🏘️', en: 'neighbours', zh: '邻居' },
      { art: '🍡', en: 'balls', zh: '汤圆' }
    ],
    sight: ['a', 'the', 'we', 'and', 'of', 'at', 'in', 'on', 'it', 'is', 'though', 'auntie'],
    newWords: [
      { w: 'couplets', zh: '对联' },
      { w: 'packets', zh: '红包' },
      { w: 'gala', zh: '晚会' },
      { w: 'midnight', zh: '半夜' },
      { w: 'neighbours', zh: '邻居' },
      { w: 'characters', zh: '字' }
    ],
    pages: [
      { art: '🧹', en: 'Two days before New Year, we clean every room in the house from top to bottom, Grandma says.', zh: '奶奶说，过年前两天要把每间屋从上到下扫一遍。' },
      { art: '🖌️', en: 'Dad puts up red couplets by the door while Ming holds the ladder steady.', zh: '爸爸在门边贴红对联，小明扶稳梯子。' },
      { art: '🖍️', en: 'The characters mean good luck and a long life. Lili traces one with her finger.', zh: '字的意思是好运和长寿，莉莉用手指描了一个。' },
      { art: '🛒', en: 'We walk to the market for fish, oranges, and a big bag of white rice.', zh: '我们去集市买鱼、橘子，还有一大袋米。' },
      { art: '🥟', en: 'At home we wrap dumplings again, and this time Ming\'s do not leak.', zh: '回家又包饺子，这回小明的没露馅。' },
      { art: '🍲', en: 'The table fills up: fish, chicken, hot soup, and a plate of green vegetables.', zh: '桌上摆满了：鱼、鸡、热汤，还有一盘青菜。' },
      { art: '👴', en: 'Grandpa sits at the head of the table. He tells us why we must not sweep tonight.', zh: '爷爷坐上首，讲为什么今晚不能扫地。' },
      { art: '🧧', en: 'After dinner the red packets come out. Each one has a few crisp notes.', zh: '饭后红包拿出来，每个里都装着几张新票子。' },
      { art: '📺', en: 'We watch the spring gala until midnight, though Lili falls asleep first.', zh: '我们看晚会到半夜，莉莉倒是先睡着了。' },
      { art: '🎆', en: 'At midnight the sky lights up far away, but we stay warm indoors.', zh: '半夜远处天空亮起来，我们待在暖和的屋里。' },
      { art: '🌅', en: 'Next morning we put on our new clothes and greet the neighbours in the lane.', zh: '第二天早上换上新衣，给巷子里的邻居拜年。' },
      { art: '🍡', en: 'Auntie brings sweet rice balls. Cousin Bo shows us his new kite.', zh: '阿姨送来甜汤圆，表哥波波给我们看他的新风筝。' },
      { art: '💛', en: 'Grandma says the new year is not the noise. It is being together again.', zh: '奶奶说，过年不是热闹，是一家人又在一起。' }
    ],
    quiz: [
      { q: '过年前两天全家先做什么？', opts: ['大扫除', '买新衣', '放鞭炮'], a: 0 },
      { q: '大门两边贴的是什么？', opts: ['红对联', '窗花', '灯笼'], a: 0 },
      { q: '奶奶说过年最要紧的是什么？', opts: ['声音大', '一家人在一起', '吃得丰盛'], a: 1 }
    ]
  },
  {
    id: 'b50', lv: 'L9', tag: '找猫 · 小侦探', title: 'Mimi Is Missing', zh: '咪咪不见了',
    emoji: '🔍', color: '#BFD7EA',
    track: 'story',
    goal: '读懂线索推理：先问「最后一次见到是什么时候」',
    trap: '疑问句和陈述句语调不同：Where did you see her? 句尾往上，We looked under the bed. 句尾往下。中文靠「吗」，英文靠声音，别在句尾加一个汉字。',
    summary: '下雨的周六下午，咪咪不在垫子上。全屋找遍没有，莉莉急得掉眼泪，奶奶却先问「最后一次见到它是什么时候、窗户当时是什么样」。顺着窗台上的湿爪印，一路找到后院竹枝上。这本第一次把「观察—提问—推理」写进故事，中文小结里点了这套方法，家长可以直接照着问孩子。',
    pre: [
      { art: '🐾', en: 'prints', zh: '爪印' },
      { art: '🌿', en: 'branch', zh: '树枝' },
      { art: '🪜', en: 'ladder', zh: '梯子' },
      { art: '🧣', en: 'towel', zh: '毛巾' },
      { art: '📓', en: 'diary', zh: '日记本' },
      { art: '🪟', en: 'sill', zh: '窗台' }
    ],
    sight: ['a', 'the', 'on', 'in', 'and', 'we', 'her', 'is', 'not', 'at'],
    newWords: [
      { w: 'prints', zh: '爪印' },
      { w: 'branch', zh: '树枝' },
      { w: 'ladder', zh: '梯子' },
      { w: 'towel', zh: '毛巾' },
      { w: 'diary', zh: '日记本' },
      { w: 'sill', zh: '窗台' }
    ],
    pages: [
      { art: '🌧️', en: 'On a rainy Saturday afternoon, Lili notices that Mimi is not on the mat.', zh: '下雨的周六下午，莉莉发现咪咪不在垫子上。' },
      { art: '🚪', en: 'We call her name in the hall, then look under the bed and behind the door.', zh: '我们在走廊喊它，又看了床底和门后。' },
      { art: '🧺', en: 'Ming checks the laundry basket. Grandpa looks in the shed and the old box.', zh: '小明翻了脏衣篮，爷爷看了小棚子和旧箱子。' },
      { art: '😟', en: 'Nobody has seen her yet. Lili\'s eyes fill with tears, but Grandma stays calm.', zh: '谁也没见着。莉莉眼里全是泪，奶奶却很镇定。' },
      { art: '🔍', en: 'Grandma asks when we last saw her and what the window looked like then.', zh: '奶奶问最后一次见它是几时、那时窗户什么样。' },
      { art: '🪟', en: 'The kitchen window is open a little. A small paw print sits on the sill.', zh: '厨房窗开了一条缝，窗台上有个小爪印。' },
      { art: '🌿', en: 'We follow the wet prints across the yard to the bamboo at the back.', zh: '我们顺着湿印子穿过院子，找到后头的竹子。' },
      { art: '🐾', en: 'There is a rustle above us. Mimi is on the low branch, wet and shivering.', zh: '头顶一阵响，咪咪在矮枝上，湿透了，直发抖。' },
      { art: '🪜', en: 'Ming holds the ladder. Grandpa reaches up slowly and speaks in a soft voice.', zh: '小明扶着梯子，爷爷慢慢伸手，轻声跟它说话。' },
      { art: '🤗', en: 'Mimi comes down at last. Lili wraps her in a towel and holds her close.', zh: '咪咪终于下来了，莉莉用毛巾裹住，紧紧抱着。' },
      { art: '🥛', en: 'We give her warm milk. She eats, then sleeps for the whole long evening.', zh: '我们给它温牛奶，它吃完睡了一整个晚上。' },
      { art: '🔒', en: 'Before bed Dad closes every window. We check them all twice, just to be sure.', zh: '睡前爸爸关好每扇窗，我们还检查了两遍。' },
      { art: '📓', en: 'Lili writes one line in her diary: ask where, not just who.', zh: '莉莉在日记本上写了一句：要问在哪里，不只是问谁。' }
    ],
    quiz: [
      { q: '谁最先发现咪咪不见了？', opts: ['莉莉', '爷爷', '小明'], a: 0 },
      { q: '他们是靠什么找到咪咪的？', opts: ['窗台上的湿爪印', '听见叫声', '邻居告诉的'], a: 0 },
      { q: '睡前爸爸做了什么？', opts: ['给猫洗澡', '关好所有窗并检查两遍', '把门锁上'], a: 1 }
    ]
  },
  {
    id: 'b51', lv: 'L9', tag: '校园剧 · 上台', title: 'The School Play', zh: '班级演出',
    emoji: '🎭', color: '#FFD9A0',
    track: 'story',
    goal: '读懂「排练出问题 → 正式演出顺利」的对照结构',
    trap: '台词里的重音落在「新信息」上：Ming is the OLD OAK，不是把每个词都读得一样重。中文每个字都清楚，英语会把不重要的词轻轻带过。',
    summary: '班里排一出「不敢发芽的小种子」：发剧本、画布景、小明第一次忘词，大家在幕布后善意地笑，他重来一遍就成了。正式演出那晚礼堂坐满家长，莉莉一动不动地演种子，小明最长那句台词一个字没错。这本把「出错」和「再来一次」写在同一条线上，不把失误当成结局。',
    pre: [
      { art: '📝', en: 'scripts', zh: '剧本' },
      { art: '🎭', en: 'curtain', zh: '幕布' },
      { art: '👏', en: 'audience', zh: '观众' },
      { art: '👗', en: 'costumes', zh: '戏服' },
      { art: '🎪', en: 'stage', zh: '舞台' },
      { art: '🗣️', en: 'lines', zh: '台词' }
    ],
    sight: ['a', 'the', 'is', 'on', 'and', 'we', 'of', 'at', 'in', 'his'],
    newWords: [
      { w: 'scripts', zh: '剧本' },
      { w: 'curtain', zh: '幕布' },
      { w: 'audience', zh: '观众' },
      { w: 'costumes', zh: '戏服' },
      { w: 'stage', zh: '舞台' },
      { w: 'lines', zh: '台词' }
    ],
    pages: [
      { art: '🎭', en: 'Our class puts on a short play about a little seed that is afraid to grow.', zh: '我们班要演一出戏，讲一粒不敢长大的小种子。' },
      { art: '📝', en: 'Miss Lin gives out the scripts. Lili is the seed, Ming is the old oak.', zh: '林老师发剧本：莉莉演种子，小明演老橡树。' },
      { art: '🎨', en: 'We paint a green hill on a big sheet and cut out clouds from white paper.', zh: '我们在大布上画绿山坡，又用白纸剪出云。' },
      { art: '🗣️', en: 'At first Ming forgets his lines and whispers them to Lili behind the curtain.', zh: '一开始小明忘词，躲在幕布后小声问莉莉。' },
      { art: '😅', en: 'Everyone laughs kindly. He tries it again, and this time all the words come out.', zh: '大家善意地笑了，他又试一次，这回词顺了。' },
      { art: '🎪', en: 'On the night of the play the hall is full of parents and younger children.', zh: '演出那晚，礼堂坐满了家长和低年级同学。' },
      { art: '💡', en: 'The lights go up. Lili stays very still on the stage, because a seed must not move.', zh: '灯亮了，莉莉一动不动，因为种子不能动。' },
      { art: '🌱', en: 'Then the music starts, and she slowly lifts both arms toward the light.', zh: '音乐响起，她慢慢把两只手臂朝光举起。' },
      { art: '👏', en: 'Ming speaks his longest line without a mistake. The audience claps at the end.', zh: '小明把最长那句一字不差地说完，台下鼓起掌来。' },
      { art: '🌳', en: 'Grandpa says the little oak looked prouder than any tree in the park.', zh: '爷爷说这棵小橡树，比公园里哪棵树都神气。' },
      { art: '📷', en: 'We take a photo together, with the painted hill leaning against the wall.', zh: '我们一起合影，画的山坡还靠在墙上。' },
      { art: '🧹', en: 'Afterwards we sweep the stage and fold the costumes into a cardboard box.', zh: '之后我们扫了舞台，把戏服叠进纸箱。' },
      { art: '💛', en: 'Lili says being a seed was hard. Ming says forgetting was harder.', zh: '莉莉说演种子难，小明说忘词更难。' }
    ],
    quiz: [
      { q: '莉莉在剧里演什么？', opts: ['一位老师', '一朵云', '一粒种子'], a: 2 },
      { q: '排练时小明出了什么问题？', opts: ['忘词', '迟到', '弄坏布景'], a: 0 },
      { q: '演出结束后大家做了什么？', opts: ['扫舞台、叠戏服', '直接回家', '又演了一遍'], a: 0 }
    ]
  },
  {
    id: 'b52', lv: 'L9', tag: '端午 · 赛龙舟', title: 'The Dragon Boat Race', zh: '赛龙舟',
    emoji: '🐉', color: '#C9E4C5',
    track: 'story',
    goal: '读懂「节奏、配合、反超」的比赛叙述',
    trap: '序数词 first / second / third 的 th 要咬舌；数字后面别加「个」。长句里 and then 连着出现时，在 and 前停半拍，孩子才不会读到喘不过气。',
    summary: '初夏清晨河岸边，六条龙舟排成一行，每条船中间一个鼓手，桨手跟着鼓点一起下桨。红队从第三追到第二，再和第一条船并齐，最后以半个船身赢了。吃粽子时爷爷讲起那位诗人和往河里投米的旧事，莉莉却说最好的不是赢，是二十个人像一个人。',
    pre: [
      { art: '🏁', en: 'race', zh: '比赛' },
      { art: '🐉', en: 'dragon', zh: '龙' },
      { art: '🥁', en: 'drummer', zh: '鼓手' },
      { art: '💪', en: 'rowers', zh: '桨手' },
      { art: '🍙', en: 'zongzi', zh: '粽子' },
      { art: '📖', en: 'poet', zh: '诗人' }
    ],
    sight: ['a', 'the', 'in', 'of', 'and', 'at', 'we', 'is', 'with', 'not'],
    newWords: [
      { w: 'race', zh: '比赛' },
      { w: 'dragon', zh: '龙' },
      { w: 'drummer', zh: '鼓手' },
      { w: 'rowers', zh: '桨手' },
      { w: 'zongzi', zh: '粽子' },
      { w: 'poet', zh: '诗人' }
    ],
    pages: [
      { art: '🐉', en: 'Every year in early summer our town holds a dragon boat race on the river.', zh: '每年初夏，我们镇上都会在河里赛龙舟。' },
      { art: '🌫️', en: 'Grandpa takes us to the bank before sunrise, when the mist still hangs low.', zh: '天没亮爷爷就带我们到岸边，雾还压得很低。' },
      { art: '🛶', en: 'Six long boats wait in a row, each with a carved dragon head at the front.', zh: '六条长船排成一排，船头各有一个雕出来的龙头。' },
      { art: '🥁', en: 'A drummer sits in the middle of each boat and beats a steady, loud rhythm.', zh: '每条船中间坐着一名鼓手，敲出又稳又响的点子。' },
      { art: '💪', en: 'The rowers pull together. If one is early, the whole boat slows down.', zh: '桨手一起下桨，只要有人抢半拍，整条船就慢下来。' },
      { art: '🔴', en: 'Our team wears red. Ming shouts until his voice is almost gone.', zh: '我们队穿红的，小明喊到嗓子都快哑了。' },
      { art: '🌊', en: 'At the turn the red boat is third, then second, then level with the first.', zh: '转弯时红船还是第三，后来第二，再和第一齐平。' },
      { art: '🎋', en: 'Grandma points to the bamboo pole at the far end and says, watch that flag.', zh: '奶奶指着远处的竹竿说：盯着那面旗。' },
      { art: '🏁', en: 'The drum gets faster. Twenty strokes, ten strokes, then the flag comes down.', zh: '鼓点越来越快，二十桨、十桨，旗子落下来了。' },
      { art: '🎉', en: 'Red wins by half a boat. The bank erupts, and Lili jumps up and down.', zh: '红队赢了半个船身，岸上炸开了锅，莉莉直蹦。' },
      { art: '🍙', en: 'We eat zongzi wrapped in green leaves, some sweet and some with meat.', zh: '我们吃绿叶包的粽子，有甜的，也有带肉的。' },
      { art: '📖', en: 'Grandpa tells the old story of the poet and why people throw rice in the water.', zh: '爷爷讲起那位诗人的老故事，还有为什么往河里投米。' },
      { art: '💛', en: 'Lili says the best part is not winning. It is twenty people moving as one.', zh: '莉莉说最棒的不是赢，是二十个人动作像一个。' }
    ],
    quiz: [
      { q: '每条船中间坐着谁？', opts: ['舵手', '裁判', '鼓手'], a: 2 },
      { q: '红队最后赢了多少？', opts: ['一个桨位', '一整条船', '半个船身'], a: 2 },
      { q: '端午这天大家吃什么？', opts: ['月饼', '饺子', '粽子'], a: 2 }
    ]
  },
  {
    id: 'b53', lv: 'L9', tag: '🔬 问句专项', title: 'Questions and Answers', zh: '会问才会读',
    emoji: '🔬', color: '#D8C7F0',
    track: 'drill',
    goal: '疑问句语调与完整回答，把「问」变成阅读工具',
    trap: '一般疑问句句尾上扬：Are you ready? 特殊疑问句通常下降：Where is Mimi? 中文用「吗」表示疑问，英文不加字，只改声音。这一条不练，孩子读疑问句永远像在背陈述句。',
    summary: '这一册不讲故事，专门练「问」。前面几页把 who / what / where / when / why / how 各自问什么列清楚，中间对比升调与降调，后面要求先用完整句回答，再慢慢学会简答。最后让孩子自己就这本书问三个问题——会提问的孩子，读书时才知道自己哪一句没懂。',
    pre: [
      { art: '❓', en: 'question', zh: '问题' },
      { art: '✅', en: 'answer', zh: '回答' },
      { art: '🔁', en: 'difference', zh: '差别' },
      { art: '💡', en: 'reason', zh: '原因' },
      { art: '🙋', en: 'ready', zh: '准备好' },
      { art: '🗣️', en: 'voice', zh: '嗓音' }
    ],
    sight: ['a', 'the', 'is', 'it', 'at', 'in', 'not', 'we', 'you', 'about'],
    newWords: [
      { w: 'question', zh: '问题' },
      { w: 'answer', zh: '回答' },
      { w: 'difference', zh: '差别' },
      { w: 'reason', zh: '原因' },
      { w: 'ready', zh: '准备好' },
      { w: 'voice', zh: '嗓音' }
    ],
    pages: [
      { art: '❓', en: 'A real question is not just a statement with a question mark at the end.', zh: '问句不是陈述句末尾加个问号就行。' },
      { art: '🗣️', en: 'Who asks about a person. What asks about a thing. Where asks about a place.', zh: 'who 问人，what 问东西，where 问地方。' },
      { art: '⏰', en: 'When asks about time. Why asks for a reason. How asks about the way.', zh: 'when 问时间，why 问原因，how 问方式。' },
      { art: '📈', en: 'Yes-or-no questions go up at the end: Are you ready? Is it hot?', zh: '是不是的问题，句尾往上扬：你准备好了吗？热吗？' },
      { art: '📉', en: 'Wh-questions usually go down: Where is Mimi? Why is she there?', zh: '带 wh 的问题句尾通常往下：咪咪在哪？她为什么在那儿？' },
      { art: '🔁', en: 'Listen to the small difference here: You are coming. You are coming?', zh: '听一听差别：你要来。／你要来吗？' },
      { art: '📝', en: 'Always answer in a full sentence at first, then you may shorten it much later.', zh: '先用完整句回答，熟练以后再简答。' },
      { art: '👂', en: 'Where is Mimi? She is on the low branch. Not just one word: Branch.', zh: '咪咪在哪？她在树枝上。别只答「树枝」。' },
      { art: '🧩', en: 'Which one, whose turn, how many, how much: they each ask a different thing.', zh: '哪一个、轮到谁、多少、多少钱，问的都不是一回事。' },
      { art: '🗯️', en: 'Do not add a Chinese particle at the end. English uses your voice, not a final word.', zh: '别在句尾加中文语气词，英文靠语调，不靠那个字。' },
      { art: '🔤', en: 'Read these aloud: What is that? Who said so? When do we go?', zh: '大声读：那是什么？谁说的？我们什么时候走？' },
      { art: '🙋', en: 'Now ask me three questions about this book. I will answer every one.', zh: '现在就这本书问我三个问题，我每一个都答。' },
      { art: '✅', en: 'A good question is a useful tool. It gets you all the words that you really need.', zh: '好问题是一件工具，它能帮你拿到需要的词。' }
    ],
    quiz: [
      { q: '一般疑问句的句尾语调怎么走？', opts: ['保持平的', '往上扬', '往下降'], a: 1 },
      { q: '带 wh 的特殊疑问句通常怎么收尾？', opts: ['往上扬', '往下降', '拖长两倍'], a: 1 },
      { q: '刚开始练习时最好怎么回答？', opts: ['只说一个词', '不回答', '用完整句'], a: 2 }
    ]
  },
  {
    id: 'b54', lv: 'L9', tag: '🌍 月亮为什么会变', title: 'Why Does the Moon Change?', zh: '月亮为什么变脸',
    emoji: '🌗', color: '#BFD7EA',
    track: 'info',
    goal: '读懂月相的真正原因，并分清月相与月食',
    trap: '科普长句里常有插入语和从句：Half of the moon is always lit, / but we do not always see / all of that half。在 but 前断一下，句子就不绕了。',
    summary: '这本讲清一件很多人误会的事：月亮自己不发光，只反射太阳光；任何时刻都有半个球面被照亮，我们看到的只是「被照亮的那一半」中朝向地球的部分。月球绕地球转，这部分就一点点变多又变少，一个周期约二十九天半。★ 地球影子造成的不是月相，是月食 —— 中文小结里专门点出来。读完可以让孩子连续一个月、每晚同一时间画一次月亮。',
    pre: [
      { art: '🌙', en: 'moon', zh: '月亮' },
      { art: '💡', en: 'light', zh: '光' },
      { art: '🌒', en: 'crescent', zh: '月牙' },
      { art: '🌗', en: 'phases', zh: '月相' },
      { art: '🌍', en: 'eclipse', zh: '月食' },
      { art: '📓', en: 'diary', zh: '日记' }
    ],
    sight: ['a', 'the', 'is', 'it', 'of', 'we', 'not', 'at', 'in', 'and'],
    newWords: [
      { w: 'moon', zh: '月亮' },
      { w: 'crescent', zh: '月牙' },
      { w: 'phases', zh: '月相' },
      { w: 'eclipse', zh: '月食' },
      { w: 'diary', zh: '日记' },
      { w: 'reflects', zh: '反射' }
    ],
    pages: [
      { art: '🌙', en: 'The moon does not make its own light. It reflects light from the sun.', zh: '月亮自己不发光，它反射的是太阳光。' },
      { art: '🌗', en: 'Half of the moon is always lit, but we do not always see all of that half.', zh: '月亮总有一半被照亮，只是我们未必看得全。' },
      { art: '🔄', en: 'As the moon travels around the earth, the lit part we can see grows and shrinks.', zh: '月亮绕着地球转，我们能看见的亮面就一点点增减。' },
      { art: '🌑', en: 'At new moon the lit side faces away from us, so the sky looks dark.', zh: '新月时亮面背着我们，天空看起来很暗。' },
      { art: '🌒', en: 'A few nights later a thin crescent appears low in the west after sunset.', zh: '过几晚，日落后西边低处出现一道细细的月牙。' },
      { art: '🌓', en: 'Each evening the bright part gets wider. We call this the waxing moon.', zh: '每晚亮的部分更宽一点，这叫盈月。' },
      { art: '🌕', en: 'About two weeks after new moon, we see a full round disc all night.', zh: '新月后约两周，整夜都能看见一轮圆月。' },
      { art: '🌖', en: 'Then the light seems to shrink again, night after night, from the right.', zh: '之后亮面又一晚一晚地收窄，从右边开始。' },
      { art: '🌘', en: 'Before long it is a thin crescent once more, this time just before dawn.', zh: '不多久又成了细月牙，这回是在天亮之前。' },
      { art: '🔁', en: 'The whole cycle takes about twenty-nine and a half days, not one day.', zh: '一整个周期大约二十九天半，不是一天。' },
      { art: '🌍', en: 'Important: the earth\'s shadow is not what makes the phases. That is an eclipse.', zh: '要紧的一条：地球的影子造成的不是月相，那是月食。' },
      { art: '🔭', en: 'You can keep a moon diary. Draw what you see at the same hour each night.', zh: '你可以记一本月亮日记，每晚同一时刻画下所见。' },
      { art: '📓', en: 'After one month your drawings will tell the whole story by themselves.', zh: '一个月后，你的画自己就把整个过程讲完了。' }
    ],
    quiz: [
      { q: '月亮自己会发光吗？', opts: ['不会，反射太阳光', '只有满月时会', '会'], a: 0 },
      { q: '月相变化真正的原因是什么？', opts: ['云在移动', '地球挡住了光', '看到的亮面角度在变'], a: 2 },
      { q: '地球的影子造成的是什么？', opts: ['月食', '新月', '月相'], a: 0 }
    ]
  },
  {
    id: 'b55', lv: 'L10', tag: '雨天 · 绕远路', title: 'The Long Way Home', zh: '绕远的路',
    emoji: '🌧️', color: '#BFD7EA',
    track: 'story',
    goal: '读懂「意外 → 决定 → 结果」的整条因果链',
    trap: '这一站每页是一个自然段，不是单个句子。逗号、分号、破折号都是换气点；遇到 so / but / because 时停半拍，前后两半的意思才分得清。',
    summary: '周五放学下大雨，短路积水，两个孩子第一次拐进 bakery 后面的小巷。帮一位老奶奶捡回滚进水里的苹果，按她指的桥走，一路担心奶奶等着急，最后看见熟悉的红屋顶。奶奶早已备好干毛巾和姜汤——原来老奶奶打过电话。中文小结里点了这本书的骨架：一个偶然的选择，如何被善意接住。',
    pre: [
      { art: '☂️', en: 'umbrella', zh: '伞' },
      { art: '🛤️', en: 'lane', zh: '小巷' },
      { art: '🌉', en: 'bridge', zh: '桥' },
      { art: '🧺', en: 'basket', zh: '篮子' },
      { art: '🍎', en: 'gather', zh: '捡拢' },
      { art: '🚰', en: 'drain', zh: '下水道' }
    ],
    sight: ['a', 'the', 'and', 'was', 'of', 'on', 'in', 'they', 'to', 'with', 'neither'],
    newWords: [
      { w: 'umbrella', zh: '伞' },
      { w: 'lane', zh: '小巷' },
      { w: 'flooded', zh: '积水的' },
      { w: 'basket', zh: '篮子' },
      { w: 'gather', zh: '捡拢' },
      { w: 'drain', zh: '下水道' }
    ],
    pages: [
      { art: '🌧️', en: 'School ended early that Friday, and the sky was already dark when Ming and Lili stepped outside the gate.', zh: '那个周五放学早，小明和莉莉出校门时，天已经黑了。' },
      { art: '☂️', en: 'Ming had forgotten his umbrella again. Lili shared hers, though it was much too small for two people.', zh: '小明又忘带伞，莉莉把伞分他一半，可那把伞两个人撑实在太小。' },
      { art: '🌊', en: 'The short road home was flooded, so they turned down the narrow lane behind the old bakery.', zh: '回家近的那条路积了水，他们拐进老面包房后面的窄巷。' },
      { art: '🏘️', en: 'Neither of them had walked that way before. The shops gave way to small grey houses and a wet garden.', zh: '这条路两人都没走过。店铺渐渐换成灰扑扑的小屋和湿漉漉的园子。' },
      { art: '🧺', en: 'At the corner an old woman stood beside a fallen basket. Apples had rolled into the shallow water.', zh: '拐角处，一位老奶奶站在翻倒的篮子旁，苹果滚进了浅水里。' },
      { art: '🍎', en: 'Lili put down the umbrella and helped gather them. Ming chased one that was floating toward a drain.', zh: '莉莉放下伞帮忙捡，小明去追一只正漂向下水道的苹果。' },
      { art: '👵', en: 'The woman thanked them and pointed to a low bridge. That way is dry, she said, and a little longer.', zh: '老奶奶道了谢，指了指一座矮桥，说那边不积水，只是稍远些。' },
      { art: '🍃', en: 'They walked on. Rain tapped on the leaves above them, and the lane smelled of wet earth and bread.', zh: '他们继续走。雨打在头顶的树叶上，巷子里是湿土和面包的味道。' },
      { art: '😟', en: 'Ming began to worry. Grandma would be waiting, and nobody knew where they were.', zh: '小明有点慌：奶奶一定在等，可谁也不知道他们在哪儿。' },
      { art: '🚶', en: 'Lili said they could turn back, but the flooded road would be worse now. So they kept going.', zh: '莉莉说可以折回去，可积水这会儿只会更深，于是接着往前。' },
      { art: '🏠', en: 'At the bridge they saw the familiar red roof of their building across the street.', zh: '到了桥上，他们看见街对面自家楼那熟悉的红屋顶。' },
      { art: '🍲', en: 'Grandma was standing at the door with two dry towels and a pot of hot ginger soup.', zh: '奶奶站在门口，手里两条干毛巾，灶上一锅热姜汤。' },
      { art: '🗣️', en: 'We took the long way, Ming said, and started to explain about the basket and the apples.', zh: '「我们走了远路。」小明开口，想讲篮子和苹果的事。' },
      { art: '📞', en: 'Grandma smiled. I know, she said. The old woman telephoned. She said two kind children helped her.', zh: '奶奶笑了：「我知道，那位奶奶来过电话，说有两个好心的孩子帮了她。」' },
      { art: '💛', en: 'That night the rain kept falling, but the long way home felt like the right way after all.', zh: '那晚雨一直下，可那条远路，反倒像是该走的路。' }
    ],
    quiz: [
      { q: '两个孩子为什么没走平常那条路？', opts: ['修路', '想看小巷', '积水了'], a: 2 },
      { q: '老奶奶的篮子出了什么事？', opts: ['忘在店里', '翻了，苹果滚进水里', '被狗叼走'], a: 1 },
      { q: '奶奶怎么知道他们帮了人？', opts: ['看见他们了', '老奶奶打了电话', '小明写了字条'], a: 1 }
    ]
  },
  {
    id: 'b56', lv: 'L10', tag: '老自行车', title: 'Grandpa\'s Old Bicycle', zh: '爷爷的旧自行车',
    emoji: '🚲', color: '#C9E4C5',
    track: 'story',
    goal: '读懂插叙：一边修车，一边讲三十年前',
    trap: '直接引语里的 said 可以放在句尾，也可以插在句子中间，读的时候引语前后各停半拍。过去式 -ed 有三种读法（/t/ /d/ /ɪd/），本站先整体认读，不必在这里背规则。',
    summary: '棚子角落里那辆黑自行车，爷爷骑了三十年去上班。一个周六，祖孙三人把它推到院子里：擦车架、洗辐条、调刹车、紧链条，最麻烦的是后胎，试了三回才不漏气。修车时爷爷讲起当年没有公交、下雨光脚骑车的日子。最后小明歪歪扭扭骑过院子，车铃还是三十年前那么脆。爷爷在车架上写下一个日期：自行车也该有记性。',
    pre: [
      { art: '🚲', en: 'bicycle', zh: '自行车' },
      { art: '🛞', en: 'tyres', zh: '车胎' },
      { art: '🛑', en: 'brakes', zh: '刹车' },
      { art: '⛓️', en: 'chain', zh: '链条' },
      { art: '🔧', en: 'spanner', zh: '扳手' },
      { art: '🔔', en: 'bell', zh: '车铃' }
    ],
    sight: ['a', 'the', 'and', 'of', 'in', 'it', 'to', 'was', 'with', 'his', 'brought', 'beyond', 'laughed'],
    newWords: [
      { w: 'bicycle', zh: '自行车' },
      { w: 'tyres', zh: '车胎' },
      { w: 'brakes', zh: '刹车' },
      { w: 'chain', zh: '链条' },
      { w: 'spanner', zh: '扳手' },
      { w: 'bell', zh: '车铃' }
    ],
    pages: [
      { art: '🚲', en: 'In the corner of the shed stood an old black bicycle with a dusty seat and two flat tyres.', zh: '棚子角落立着一辆旧黑自行车，座上全是灰，两条胎都瘪了。' },
      { art: '👴', en: 'Grandpa had ridden it to work for thirty years, long before Ming was born.', zh: '爷爷骑它上了三十年班，那还是小明出生以前的事。' },
      { art: '🛠️', en: 'One Saturday he wheeled it into the yard and said, Today we shall make it run again.', zh: '一个周六，他把它推进院子说：今天让它重新跑起来。' },
      { art: '🪣', en: 'Ming brought a basin of water. Lili found a rag, a small brush, and an old tin of oil.', zh: '小明端来一盆水，莉莉找来抹布、小刷子和一罐旧机油。' },
      { art: '✨', en: 'They wiped the frame until the black paint shone, then cleaned every spoke of both wheels.', zh: '他们把车架擦得发亮，又把两个轮子的辐条一根根洗净。' },
      { art: '🔧', en: 'Grandpa showed them how to test the brakes and how to tighten a loose chain with a spanner.', zh: '爷爷教他们怎么试刹车，怎么用扳手把松链条上紧。' },
      { art: '🛞', en: 'The hardest part was the back tyre. It took three tries before the air stayed in.', zh: '最难弄的是后胎，试了三回，气才不再漏。' },
      { art: '🛤️', en: 'While they worked, Grandpa talked about the road to his first school and the hills beyond it.', zh: '一边干活，爷爷一边讲他小时候上学那条路，还有山那边。' },
      { art: '🌧️', en: 'There were no buses then, he said. If it rained, we carried our shoes and rode barefoot.', zh: '「那时没有公交，」他说，「下雨就拎着鞋，光脚骑。」' },
      { art: '👧', en: 'Lili could not picture that. She asked whether the bicycle had ever carried the whole family.', zh: '莉莉想象不出来，就问这车有没有载过全家人。' },
      { art: '🍚', en: 'Grandpa laughed. Not the whole family, he said, but once it carried your dad and two big bags of rice.', zh: '爷爷笑了：全家倒没有，可有一回载过你爸和两大袋米。' },
      { art: '🔔', en: 'At last he lifted the bike upright, rang the small bell, and asked Ming to try it.', zh: '最后他把车扶正，按了按小铃，让小明试试。' },
      { art: '🏃', en: 'Ming wobbled across the yard, with Lili running beside him and Doudou barking behind.', zh: '小明歪歪扭扭骑过院子，莉莉跟着跑，豆豆在后头叫。' },
      { art: '🎵', en: 'The bell still rang clearly, as bright as it must have sounded thirty years before.', zh: '铃声还是那么清脆，和三十年前该是一样。' },
      { art: '✍️', en: 'That evening Grandpa wrote a date on the frame. A bicycle, he said, should have a memory.', zh: '那天晚上爷爷在车架上写了个日期，说：自行车也该有记性。' }
    ],
    quiz: [
      { q: '爷爷骑这辆车上班骑了多久？', opts: ['三年', '十年', '三十年'], a: 2 },
      { q: '修车时最难弄的是哪一部分？', opts: ['车铃', '后胎', '前轮'], a: 1 },
      { q: '爷爷最后在车架上写了什么？', opts: ['自己的名字', '一个日期', '一行诗'], a: 1 }
    ]
  },
  {
    id: 'b57', lv: 'L10', tag: '做月饼的约定', title: 'The Mooncake Promise', zh: '月饼约定',
    emoji: '🥮', color: '#F6C6C6',
    track: 'story',
    goal: '读懂「失败三次 → 找到方法 → 兑现承诺」',
    trap: '这一本有大量表示顺序的词：first、then、while、at last、by the sixth one。它们是路标，读的时候稍微重一点，孩子就知道故事走到哪一步了。',
    summary: '节前一周，莉莉答应奶奶自己做一个月饼。第一团面太干，一压就碎；第二团太湿，粘手粘桌还粘了猫；她不肯让哥哥帮忙，说答应了就得自己来。于是擦桌子、把奶奶的笔记一行行读完、让第三团面醒半小时，到第六个时手已经记住了动作。烤得比奶奶的深一点，奶奶却说：不是深，是第一批。',
    pre: [
      { art: '🤝', en: 'promise', zh: '约定' },
      { art: '🫓', en: 'mould', zh: '模子' },
      { art: '🌀', en: 'dough', zh: '面团' },
      { art: '🍯', en: 'syrup', zh: '糖浆' },
      { art: '🔥', en: 'oven', zh: '烤箱' },
      { art: '🍽️', en: 'batch', zh: '一批' }
    ],
    sight: ['a', 'the', 'and', 'of', 'it', 'was', 'to', 'in', 'she', 'her'],
    newWords: [
      { w: 'promise', zh: '约定' },
      { w: 'mould', zh: '模子' },
      { w: 'dough', zh: '面团' },
      { w: 'syrup', zh: '糖浆' },
      { w: 'batch', zh: '一批' },
      { w: 'oven', zh: '烤箱' }
    ],
    pages: [
      { art: '🤝', en: 'A week before the festival, Lili promised Grandma a mooncake made entirely by herself at home.', zh: '节前一周，莉莉答应奶奶，要自己做一个完整的月饼。' },
      { art: '👀', en: 'She had watched Grandma do it many times, and it looked simple: dough, filling, a mould, and an oven.', zh: '她看奶奶做过好多回，看着挺简单：面团、馅、模子、烤箱。' },
      { art: '🥣', en: 'On Saturday morning she borrowed the big bowl and carefully measured the flour, the oil, and the syrup.', zh: '周六早上她借来大盆，量好面粉、油和糖浆。' },
      { art: '🍞', en: 'The first dough was much too dry and broke into dry crumbs as soon as she pressed it down.', zh: '第一团面太干，手一压就碎成渣。' },
      { art: '💧', en: 'The second was too wet. It stuck to her fingers, the table, and eventually the cat.', zh: '第二团又太湿，粘手指、粘桌子，最后连猫也粘上了。' },
      { art: '🙅', en: 'Ming offered to help her. Lili shook her head. A promise, she said, means I do it all myself.', zh: '小明要帮忙，莉莉摇头：答应了，就得我自己来。' },
      { art: '📖', en: 'She sat down, wiped the table, and read Grandma\'s notes one line at a time.', zh: '她坐下来擦净桌子，把奶奶的笔记一行行读过去。' },
      { art: '⏳', en: 'The third dough rested under a cloth for half an hour, just as the notes said.', zh: '第三团面照着笔记，盖布醒上半个钟头。' },
      { art: '🥄', en: 'While she waited, she mashed the sweet bean paste and counted out twelve equal pieces of filling.', zh: '等的时候，她把豆沙压细，数出十二份一样大的馅。' },
      { art: '🫓', en: 'Her first mooncake came out of the old mould with a crooked edge, but it still held together.', zh: '第一个脱模时边有点歪，好歹没散。' },
      { art: '✋', en: 'By the sixth one her hands knew the motion, and the pattern on top was clear.', zh: '做到第六个，手已经记住了动作，面上的花纹也清楚了。' },
      { art: '🔥', en: 'The oven made the whole kitchen smell of toasted sugar. Grandma came in but said nothing.', zh: '烤箱把整间厨房熏得焦甜，奶奶进来却什么也没说。' },
      { art: '😕', en: 'They were a little darker than hers, Lili said, looking at the tray.', zh: '「比您的深了点。」莉莉看着烤盘说。' },
      { art: '😊', en: 'Grandma tasted one slowly. They are not darker, she said. They are just the first batch.', zh: '奶奶慢慢尝了一口：「不是深，是第一批呀。」' },
      { art: '🌕', en: 'On the festival night Lili put her own mooncake in the middle of the round table.', zh: '中秋那晚，莉莉把自己做的月饼摆在圆桌正中。' }
    ],
    quiz: [
      { q: '莉莉答应了奶奶什么？', opts: ['帮忙包饺子', '自己做一个月饼', '考一百分'], a: 1 },
      { q: '前两团面各出了什么问题？', opts: ['都太甜', '一个太干、一个太湿', '都太干'], a: 1 },
      { q: '奶奶怎么评价颜色深？', opts: ['说这是第一批', '什么也没说', '说烤糊了'], a: 0 }
    ]
  },
  {
    id: 'b58', lv: 'L10', tag: '村里的一年', title: 'A Year in the Village', zh: '村里的一年',
    emoji: '🌾', color: '#FFE0A3',
    track: 'story',
    goal: '读懂按月份推进的时间线，以及「经验 vs 手机」的对照',
    trap: '这一本几乎每页都有时间状语：in early spring、by late summer、after the harvest。先读时间状语，再读发生了什么，顺序就不会乱。',
    summary: '爷爷每年冬天在牛皮纸上画一张日历，格子里写的不是日期，是那个月田里要做的活。柳芽开了才下种、初夏插秧、夏天扎稻草人、秋天收割晒谷、全村聚餐，冬天修农具、卷起旧日历。莉莉把十二年的旧纸收在盒里；小明问手机是不是更好，爷爷说手机感觉不到风。',
    pre: [
      { art: '🗓️', en: 'calendar', zh: '日历' },
      { art: '🌱', en: 'sow', zh: '播种' },
      { art: '🌾', en: 'transplants', zh: '插秧' },
      { art: '🎉', en: 'harvest', zh: '收成' },
      { art: '🎩', en: 'sheaves', zh: '稻把' },
      { art: '🪵', en: 'rake', zh: '耙子' }
    ],
    sight: ['a', 'the', 'and', 'it', 'is', 'in', 'of', 'to', 'he', 'with', 'enough', 'busiest', 'stories'],
    newWords: [
      { w: 'calendar', zh: '日历' },
      { w: 'sow', zh: '播种' },
      { w: 'transplants', zh: '插秧' },
      { w: 'harvest', zh: '收成' },
      { w: 'sheaves', zh: '稻把' },
      { w: 'rake', zh: '耙子' }
    ],
    pages: [
      { art: '📜', en: 'Every winter Grandpa draws a calendar on a sheet of brown paper and hangs it by the door.', zh: '每年冬天，爷爷在一张牛皮纸上画好日历，挂在门边。' },
      { art: '🗓️', en: 'It is not a normal calendar. Each square holds one job that the fields will need that month.', zh: '这不是普通日历，每格写的是那个月田里要做的一件活。' },
      { art: '🌱', en: 'In early spring he repairs the tools, soaks the rice seed, and watches the willow buds by the ditch.', zh: '初春他修农具、浸稻种，还盯着水沟边的柳芽。' },
      { art: '🌿', en: 'When the buds open, he says the water is warm enough. That is how he knows when to sow.', zh: '柳芽一开，他就说水够暖了——播种的时候到了。' },
      { art: '👧', en: 'Lili once asked why he did not just look at the date. Grandpa said the trees are never late.', zh: '莉莉问干嘛不直接看日子，爷爷说树从来不误时。' },
      { art: '👨‍🌾', en: 'In late spring the whole family transplants the young shoots, standing knee deep in cold mud.', zh: '暮春全家下田插秧，站在没膝的冷泥里。' },
      { art: '🌞', en: 'Summer means weeding, watching the water level, and chasing birds away from the ripening grain.', zh: '夏天是除草、看水、把鸟从将熟的谷子边赶开。' },
      { art: '🎩', en: 'Ming\'s job is the scarecrow. He rebuilds it every June with an old hat and two bamboo arms.', zh: '小明的活儿是稻草人，每年六月用旧帽和两根竹竿重扎一个。' },
      { art: '🌾', en: 'Autumn is the busiest. Everyone cuts, bundles, and carries the sheaves to the flat stone yard.', zh: '秋天最忙，人人割稻、捆好，把稻把挑到平石场。' },
      { art: '☀️', en: 'The grain is spread to dry in the sun, and Grandma turns it with a wooden rake each noon.', zh: '谷子摊开晒着，奶奶每天正午用木耙翻一遍。' },
      { art: '🍲', en: 'After the harvest the village holds a shared meal, and every household brings one dish.', zh: '收完稻，全村摆一顿饭，每家端来一道菜。' },
      { art: '🧰', en: 'Winter is for repairs, stories, and the next calendar. Grandpa rolls the old one up carefully.', zh: '冬天修农具、讲故事、画新日历，旧的那张被仔细卷起。' },
      { art: '📦', en: 'Lili keeps the old sheets in a box. Twelve years of weather, she says, written in Grandpa\'s hand.', zh: '莉莉把旧纸收在盒里，说这是爷爷手写的十二年天气。' },
      { art: '📱', en: 'Ming asks whether a phone could do it better. Grandpa smiles and says a phone never feels the wind.', zh: '小明问手机是不是更准，爷爷笑着说：手机感觉不到风。' },
      { art: '🖊️', en: 'The new sheet goes up by the door. In the first square he writes one word again: sow.', zh: '新纸又挂上门边，第一格他照旧写下一个字：种。' }
    ],
    quiz: [
      { q: '爷爷靠什么决定什么时候播种？', opts: ['手机上的节气', '日历上的数字', '柳芽开了没有'], a: 2 },
      { q: '夏天小明的活儿是什么？', opts: ['翻晒谷子', '重扎稻草人', '看水位'], a: 1 },
      { q: '爷爷为什么说手机不如树？', opts: ['手机没电', '手机太贵', '手机感觉不到风'], a: 2 }
    ]
  },
  {
    id: 'b59', lv: 'L10', tag: '🔬 长文阅读策略', title: 'Reading a Long Book', zh: '怎么读厚书',
    emoji: '📖', color: '#D8C7F0',
    track: 'drill',
    goal: '按意群断句、猜词、回读、三句话复述',
    trap: '英文长句靠结构，不靠一口气：先找主句，再把介词短语和从句挂上去。示范页上的句子请听整句音频，不要在逗号处真的断开成几个字——停顿只在心里。',
    summary: '这一册不讲故事，教的是「怎么读」。分块读、遇到生词先读到句尾、让后面的从句替你解释、走神时只回翻一页、脑子里带一个问题、读完用 first / then / finally 三句话讲给别人听。第 11 页直接拿《月饼约定》做例子：面团变了三次，莉莉的耐心也变了三次，十五页就被收成一条线。',
    pre: [
      { art: '🧩', en: 'chunk', zh: '意群' },
      { art: '📎', en: 'clause', zh: '从句' },
      { art: '↩️', en: 'reread', zh: '重读' },
      { art: '📑', en: 'chapter', zh: '章节' },
      { art: '🧵', en: 'thread', zh: '思路' },
      { art: '📝', en: 'sentence', zh: '句子' }
    ],
    sight: ['a', 'the', 'is', 'of', 'in', 'to', 'it', 'you', 'when', 'and', 'patience'],
    newWords: [
      { w: 'chunk', zh: '意群' },
      { w: 'clause', zh: '从句' },
      { w: 'reread', zh: '重读' },
      { w: 'chapter', zh: '章节' },
      { w: 'thread', zh: '思路' },
      { w: 'sentence', zh: '句子' }
    ],
    pages: [
      { art: '📖', en: 'A long book is not just a long list of hard words. It is a few big ideas joined by smaller ones.', zh: '厚书不是一长串单词，是几个大想法被小想法连起来。' },
      { art: '✂️', en: 'When a sentence runs past fifteen words, stop at the comma and ask what came before it.', zh: '一句超过十五个词，就在逗号处停一下，想想前面说了什么。' },
      { art: '🔔', en: 'Read this: In the corner of the shed, beside the old wooden box, a small bell rang.', zh: '读这一句：棚子角落里，旧木箱旁边，一只小铃响了。' },
      { art: '🧩', en: 'Three chunks, one picture. You do not need to hold all twenty words in your head at once.', zh: '三块，一幅画。不必把二十个词一次全塞进脑子。' },
      { art: '🔍', en: 'If a word is new, read to the end of the sentence before you stop to guess its meaning.', zh: '碰到生词，先读到句尾，再停下来猜意思。' },
      { art: '💡', en: 'Often the next clause explains it: the mould, a wooden shape that presses patterns into dough.', zh: '后面那个从句常常就在解释它：模子，就是把花纹压进面团的木器。' },
      { art: '✅', en: 'You already know that word mould now, because the clause after it did all the teaching.', zh: '现在你已经懂 mould 了，因为是后面那句教会你的。' },
      { art: '↩️', en: 'When you lose the thread, go back one page, not to the beginning. Rereading is not failure.', zh: '读丢了就回翻一页，别从头来。重读不算失败。' },
      { art: '🗣️', en: 'Good readers reread constantly. They also say a sentence aloud when the words feel tangled.', zh: '会读书的人常重读；觉得句子绕，就把它念出声。' },
      { art: '❓', en: 'Keep one question in your head as you read: what has changed since the last page?', zh: '读的时候心里留一个问题：和上一页比，什么变了？' },
      { art: '🥮', en: 'In The Mooncake Promise, the dough changes three times, and so does Lili\'s patience.', zh: '《月饼约定》里，面团变了三次，莉莉的耐心也变了三次。' },
      { art: '➡️', en: 'That is the whole story. A question like this turns fifteen pages into one clear line.', zh: '整本书就是这条线。这样一个问题，把十五页收成一句。' },
      { art: '🗂️', en: 'After a chapter, tell someone the story in three sentences: first, then, finally.', zh: '读完一章，用三句话讲给别人：先、然后、最后。' },
      { art: '🎯', en: 'If you cannot, you know exactly which page to open again. That is a useful feeling.', zh: '讲不出来，你就知道该翻回哪一页了，这种感觉很有用。' },
      { art: '🚀', en: 'Now take the last book on this shelf. Read slowly, chunk by chunk, and enjoy being lost sometimes.', zh: '现在拿起书架最后一本，慢慢读，一块一块读，偶尔迷路也没关系。' }
    ],
    quiz: [
      { q: '遇到长句时应该怎么读？', opts: ['按意群分块', '每个词都停下来', '一口气冲到底'], a: 0 },
      { q: '碰到生词先做什么？', opts: ['马上查字典', '直接跳过整段', '读到句尾再猜'], a: 2 },
      { q: '读完一章用什么检验自己？', opts: ['三句话复述', '数一共多少页', '背下所有生词'], a: 0 }
    ]
  },
  {
    id: 'b60', lv: 'L10', tag: '🌍 从稻种到饭碗', title: 'From Rice to the Table', zh: '从稻种到饭碗',
    emoji: '🍚', color: '#F7E2B8',
    track: 'info',
    goal: '读懂一年农事 + 加工链条，注意被动语态',
    trap: '科普里常用被动：The grain is spread / The seeds are scattered。谁做的不重要，重要的是「东西被怎样处理」。先找出被说明的那个名词，句子就好懂了。',
    summary: '这本把前面三本里出现过的水稻串成完整一年：春天浸种、秧田、一个月后移栽、留出行距让阳光照到每株；夏天天天看水；秋末等晴天收割、晾晒、脱粒；碾去谷壳是糙米，再碾一层才是我们常吃的白米，每碾一次都少一点外层，也就少一点纤维。中文补一句：从种子到饭碗，可能经手四十多双手。',
    pre: [
      { art: '🌱', en: 'nursery', zh: '秧田' },
      { art: '🌾', en: 'transplanting', zh: '插秧' },
      { art: '🌾', en: 'threshing', zh: '脱粒' },
      { art: '🍚', en: 'husk', zh: '谷壳' },
      { art: '🥣', en: 'fibre', zh: '纤维' },
      { art: '⚙️', en: 'mill', zh: '碾米机' }
    ],
    sight: ['a', 'the', 'is', 'in', 'of', 'and', 'to', 'it', 'are', 'for', 'lies', 'straight', 'weight', 'tied', 'families'],
    newWords: [
      { w: 'nursery', zh: '秧田' },
      { w: 'transplanting', zh: '插秧' },
      { w: 'threshing', zh: '脱粒' },
      { w: 'husk', zh: '谷壳' },
      { w: 'fibre', zh: '纤维' },
      { w: 'mill', zh: '碾米机' }
    ],
    pages: [
      { art: '🍚', en: 'A bowl of rice looks simple, but behind it lies a whole year of careful, repeated work.', zh: '一碗饭看着简单，背后是整整一年反复的细致活。' },
      { art: '💧', en: 'It begins in early spring, when the seed is soaked in water for two days and then kept warm.', zh: '初春开始：稻种先在水里浸两天，再保温催芽。' },
      { art: '🌱', en: 'The swollen seeds are scattered thinly on a nursery bed, a small field protected from the wind.', zh: '鼓起的种子薄薄撒在秧田里，那是一小块挡风的地。' },
      { art: '🌿', en: 'After about a month the shoots are tall enough to move. This is called transplanting.', zh: '约一个月后秧苗够高，可以移走，这一步叫插秧。' },
      { art: '👨‍🌾', en: 'Farmers stand in shallow water and place each bunch by hand, in straight rows with even gaps.', zh: '农人站在浅水里，一丛丛手插，行要直、间距要匀。' },
      { art: '☀️', en: 'The gaps matter. They let sunlight reach every plant and make it harder for weeds to spread.', zh: '间距有讲究：阳光照得到每株，杂草也不容易铺开。' },
      { art: '🌊', en: 'Through summer the water level is checked almost daily, because rice needs wet roots but not deep flooding.', zh: '整个夏天几乎天天看水：根要湿，却不能深淹。' },
      { art: '🌾', en: 'By late summer the plants turn gold and bend under the weight of the grain heads.', zh: '夏末稻子转黄，被沉甸甸的稻穗压弯。' },
      { art: '🌤️', en: 'Harvest must wait for a dry day. Wet grain stored in a pile would heat up and spoil.', zh: '收割要等晴天，湿谷堆在一起会发热、会坏。' },
      { art: '🌞', en: 'The cut stalks are tied, carried to a flat yard, and spread in the sun to dry.', zh: '割下的稻秆捆好，挑到平场，摊开晒干。' },
      { art: '🌾', en: 'Threshing separates the grains from the stalks. A mill then removes the hard outer husk.', zh: '脱粒把谷粒和稻秆分开，再用碾米机去掉硬谷壳。' },
      { art: '🍚', en: 'What remains is brown rice. Polish it further and you get the white rice most families cook.', zh: '留下的就是糙米，再碾一层，才是多数人家煮的白米。' },
      { art: '🥣', en: 'Each step loses a little of the outer layer, which is why brown rice keeps more fibre.', zh: '每多碾一步就少一点外层，所以糙米留住的纤维更多。' },
      { art: '♨️', en: 'At home we wash the grains, add water, and let them steam until each one is soft and separate.', zh: '到家淘米、加水，蒸到每一粒都软而不黏。' },
      { art: '🙏', en: 'From seed to bowl, more than forty hands may have touched those grains. That is worth remembering.', zh: '从种子到碗里，这些米也许经过四十多双手，值得记着。' }
    ],
    quiz: [
      { q: '秧苗大约长多久可以移栽？', opts: ['半年', '一个月', '一周'], a: 1 },
      { q: '收割为什么要等晴天？', opts: ['机器怕雨', '田里太滑', '湿谷堆放会发热变质'], a: 2 },
      { q: '糙米和白米的差别在哪？', opts: ['白米多碾掉一层，纤维更少', '只是颜色不同', '两种米来自不同植物'], a: 0 }
    ]
  }
];

window.BOOKS = BOOKS;
