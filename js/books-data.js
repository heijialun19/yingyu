/* ============================================================
   小鸟英语乐园 · 读书馆（分级拼读小书）
   2026-11-14.16 新增，2026-11-15.1 第三轮复检修订（B1 Q1 题干、b13 视觉词 me、复数标注）。
   2026-11-15.6 扩至 100 本；2026-11-15.7 全量内容审查修订
   （15 处题意/语法/常识错误 + 答案位置打散）。
   对标 Starfall Learn to Read 与 Bob Books（每本 8-25 个不重复词、极简句式、幽默收尾）：

   编写铁律（_check_books.py 强制校验）：
   ① 每个词必须「规则可解码」——只用该书级别及以下已教音素
      （单字母 → sh/ch/th/ck/ng → 连缀 → ee/oo/ai/ay/oa → 魔法 e → ar/or/ir）
      或该书显式声明的视觉词（sight）；
   ② 每页 1-2 个短句，全书重复句式 + 一个荒诞小笑点收尾；
   ③ 生词量 8-25，生词表带中文；读后 3 道理解题（中文提问）。

   级别映射（100 本）：L2 短元音 · L3 双辅音 sh/ch/th/ck/ng · L4 连缀
             L5 元音组合 ee/oo/ai/ay/oa · L6 魔法 e · L7 卷舌音 ar/or/ir
             L8 视觉词扩展 · L9 综合收官；每级 12-13 本，逐级递进
   ============================================================ */
'use strict';

const BOOKS = [
  {
    id: 'b1', lv: 'L2', tag: '短元音 a', title: 'A Cat, a Hat', zh: '小猫和帽子',
    emoji: '🐱', color: '#FF6B6B',
    goal: '/æ/ 短促有力，嘴张大',
    trap: 'a 不要读成「阿」。发 /æ/ 时嘴角往两边拉、下巴放低，像被人轻拍一下那样短。cat 千万别读成「卡特」。',
    summary: '这一级练短元音 a。/æ/ 在中文里没有对应的音，最容易读成「阿」或者拖长。',
    pre: [
      { art: '🐱', en: 'cat', zh: '猫' },
      { art: '🎩', en: 'hat', zh: '帽子' },
      { art: '🐀', en: 'rat', zh: '老鼠' }
    ],
    sight: ['the', 'a', 'is', 'my'],
    newWords: [
      { w: 'cat', zh: '猫' },
      { w: 'hat', zh: '帽子' },
      { w: 'sat', zh: '坐（过去式）' },
      { w: 'mat', zh: '垫子' },
      { w: 'rat', zh: '老鼠' }
    ],
    pages: [
      { art: '🐱🎩', en: 'A cat. A hat.', zh: '一只猫。一顶帽子。' },
      { art: '🐱', en: 'My cat sat on the mat.', zh: '我的猫坐在垫子上。' },
      { art: '🎩🐱', en: 'The hat is on the cat.', zh: '帽子戴在猫头上。' },
      { art: '🐭', en: 'A rat! A rat!', zh: '一只老鼠！一只老鼠！' },
      { art: '🐭🎩', en: 'The rat sat on the hat.', zh: '老鼠坐在帽子上。' },
      { art: '🐱🐭', en: 'The cat sat on the rat!', zh: '猫坐在了老鼠身上！' }
    ],
    quiz: [
      { q: '猫坐在什么上面？', opts: ['垫子上', '帽子上', '箱子上'], a: 0 },
      { q: '谁坐在了帽子上？', opts: ['狗', '猫', '老鼠'], a: 2 },
      { q: '故事最后谁在最下面？', opts: ['老鼠', '猫', '帽子'], a: 0 }
    ]
  },
  {
    id: 'b2', lv: 'L2', tag: '短元音 e', title: 'My Red Hen', zh: '我的红母鸡',
    emoji: '🐔', color: '#E24B4A',
    goal: '/e/ 嘴形扁平',
    trap: 'e 不要读成「诶」。发 /e/ 时嘴唇向两边拉开、上下齿微开，bed 一口气收住，不要拖成「贝德」。',
    summary: '这一级练短元音 e。/e/ 的关键是短和扁，孩子容易读成双元音「诶」。',
    pre: [
      { art: '🐔', en: 'hen', zh: '母鸡' },
      { art: '🖊️', en: 'pen', zh: '围栏（养动物的）' },
      { art: '💧', en: 'wet', zh: '湿的' },
      { art: '🛏️', en: 'bed', zh: '床' }
    ],
    sight: ['the', 'a', 'is', 'my'],
    newWords: [
      { w: 'hen', zh: '母鸡' },
      { w: 'red', zh: '红色的' },
      { w: 'pen', zh: '围栏（养动物的）' },
      { w: 'wet', zh: '湿的' },
      { w: 'get', zh: '拿、取' },
      { w: 'eggs', zh: '鸡蛋（复数）' },
      { w: 'ten', zh: '十' },
      { w: 'bed', zh: '床' }
    ],
    pages: [
      { art: '🐔', en: 'My hen is red.', zh: '我的母鸡是红色的。' },
      { art: '🐔🚧', en: 'The hen is in the red pen.', zh: '母鸡在红色围栏里。' },
      { art: '🥚', en: 'Get the eggs! Get the eggs!', zh: '捡鸡蛋啦！捡鸡蛋啦！' },
      { art: '🥚🥚', en: 'Ten eggs in the pen.', zh: '围栏里有十个鸡蛋。' },
      { art: '🌧️🐔', en: 'The hen is wet!', zh: '母鸡淋湿啦！' },
      { art: '🛏️🐔', en: 'The red hen is on the bed.', zh: '红母鸡跑到床上去了！' }
    ],
    quiz: [
      { q: '母鸡是什么颜色的？', opts: ['红色', '白色', '黑色'], a: 0 },
      { q: '有几个鸡蛋？', opts: ['十个', '一个', '五个'], a: 0 },
      { q: '母鸡最后跑到哪里去了？', opts: ['床上', '围栏里', '垫子上'], a: 0 }
    ]
  },
  {
    id: 'b3', lv: 'L2', tag: '短元音 i', title: 'The Big Pig', zh: '大胖猪',
    emoji: '🐷', color: '#F4A7B9',
    goal: '/ɪ/ 短而松',
    trap: 'i 不要读成「衣」。发 /ɪ/ 时嘴比「衣」松、舌位靠后一点，pig 不要读成「皮格」。',
    summary: '这一级练短元音 i。/ɪ/ 和中文「衣」最大的差别是「松」，读紧了就变成另一个词。',
    pre: [
      { art: '🐷', en: 'pig', zh: '猪' },
      { art: '🐘', en: 'big', zh: '大的' },
      { art: '⛏️', en: 'dig', zh: '挖' },
      { art: '👱', en: 'wig', zh: '假发' }
    ],
    sight: ['the', 'a', 'is', 'my'],
    newWords: [
      { w: 'pig', zh: '猪' },
      { w: 'big', zh: '大的' },
      { w: 'it', zh: '它' },
      { w: 'dig', zh: '挖' },
      { w: 'pit', zh: '坑' },
      { w: 'wig', zh: '假发' }
    ],
    pages: [
      { art: '🐷', en: 'My pig is big.', zh: '我的猪很大。' },
      { art: '🐷', en: 'It is a big, big pig.', zh: '它是一只大大大胖猪。' },
      { art: '🐷⛏️', en: 'The pig can dig.', zh: '猪会挖土。' },
      { art: '🐷', en: 'Dig, pig, dig!', zh: '挖吧，猪，挖吧！' },
      { art: '🐷🕳️', en: 'The pig is in a pit.', zh: '猪掉进坑里啦。' },
      { art: '🐷', en: 'A wig on the pig!', zh: '假发戴在猪头上！' },
      { art: '🐷💇', en: 'The pig in the wig!', zh: '戴假发的猪！' }
    ],
    quiz: [
      { q: '猪会做什么？', opts: ['挖土', '飞', '游泳'], a: 0 },
      { q: '猪掉到哪里去了？', opts: ['坑里', '水里', '床上'], a: 0 },
      { q: '猪头上戴了什么？', opts: ['帽子', '围巾', '假发'], a: 2 }
    ]
  },
  {
    id: 'b4', lv: 'L2', tag: '短元音 o', title: 'Fox in a Box', zh: '盒子里的狐狸',
    emoji: '🦊', color: '#F0997B',
    goal: '/ɒ/ 嘴唇收圆',
    trap: 'o 不要读成「哦」。发 /ɒ/ 时嘴唇收圆、舌位低，dog 的尾音 /g/ 也要出来。',
    summary: '这一级练短元音 o。/ɒ/ 要比中文「哦」更短、嘴更圆。',
    pre: [
      { art: '🦊', en: 'fox', zh: '狐狸' },
      { art: '📦', en: 'box', zh: '盒子' },
      { art: '🔥', en: 'hot', zh: '热的' },
      { art: '🐰', en: 'hop', zh: '跳' }
    ],
    sight: ['the', 'a', 'is', 'my'],
    newWords: [
      { w: 'fox', zh: '狐狸' },
      { w: 'box', zh: '盒子' },
      { w: 'hot', zh: '热的' },
      { w: 'hop', zh: '跳' },
      { w: 'on', zh: '在……上' },
      { w: 'dog', zh: '狗' }
    ],
    pages: [
      { art: '🦊📦', en: 'A fox is in the box.', zh: '一只狐狸在盒子里。' },
      { art: '🦊☀️', en: 'The fox is hot.', zh: '狐狸好热呀。' },
      { art: '🦊', en: 'Hop, fox, hop!', zh: '跳吧，狐狸，跳吧！' },
      { art: '🦊📦', en: 'The fox is on the box.', zh: '狐狸跳到盒子上了。' },
      { art: '🦊', en: 'A hot fox in the box.', zh: '盒子里有只热乎乎的狐狸。' },
      { art: '🦊🐕', en: 'The fox is on the dog!', zh: '狐狸骑到狗头上啦！' }
    ],
    quiz: [
      { q: '狐狸一开始在哪里？', opts: ['盒子里', '狗头上', '围栏里'], a: 0 },
      { q: '狐狸觉得怎么样？', opts: ['饿', '热', '冷'], a: 1 },
      { q: '故事最后狐狸在哪里？', opts: ['狗头上', '盒子里', '坑里'], a: 0 }
    ]
  },
  {
    id: 'b5', lv: 'L2', tag: '短元音 u', title: 'Fun in the Sun', zh: '太阳底下真好玩',
    emoji: '🐶', color: '#4EC5F1',
    goal: '/ʌ/ 短促',
    trap: 'u 不要读成「啊」或「乌」。发 /ʌ/ 时嘴巴半开、舌头放平，sun 一口气收住。',
    summary: '这一级练短元音 u。/ʌ/ 介于「啊」和「呃」之间，孩子常读成两者之一。',
    pre: [
      { art: '🐶', en: 'pup', zh: '小狗' },
      { art: '☀️', en: 'sun', zh: '太阳' },
      { art: '🏃', en: 'run', zh: '跑' }
    ],
    sight: ['the', 'a', 'is', 'my'],
    newWords: [
      { w: 'pup', zh: '小狗' },
      { w: 'sun', zh: '太阳' },
      { w: 'run', zh: '跑' },
      { w: 'mud', zh: '泥巴' },
      { w: 'fun', zh: '好玩' },
      { w: 'up', zh: '起来' }
    ],
    pages: [
      { art: '🐶☀️', en: 'My pup is in the sun.', zh: '我的小狗在晒太阳。' },
      { art: '🐶', en: 'The pup can run.', zh: '小狗会跑。' },
      { art: '🐶', en: 'Run, pup, run!', zh: '跑吧，小狗，跑吧！' },
      { art: '🐶🟤', en: 'The pup is in the mud.', zh: '小狗在泥巴里打滚。' },
      { art: '🐶', en: 'Up, pup, up! Wet pup!', zh: '起来，小狗，起来！湿漉漉的小狗！' },
      { art: '🐶☀️', en: 'Fun in the sun!', zh: '太阳底下真好玩！' }
    ],
    quiz: [
      { q: '小狗在哪里打滚？', opts: ['水里', '床上', '泥巴里'], a: 2 },
      { q: '小狗会做什么？', opts: ['唱歌', '跑', '飞'], a: 1 },
      { q: '小狗最后怎么样了？', opts: ['睡着了', '干干净净', '湿漉漉'], a: 2 }
    ]
  },
  {
    id: 'b6', lv: 'L3', tag: 'sh · ch', title: 'The Big Fish', zh: '大鱼',
    emoji: '🐟', color: '#0EA5E9',
    goal: '/ʃ/ 像「嘘」',
    trap: 'sh 不要把舌头卷起来。嘴唇往前噘成小圆，像让人安静那样吹气。fish 的 sh 在词尾也要出来。',
    summary: '这一级练 sh。/ʃ/ 和中文「嘘」接近，但嘴唇要更往前。',
    pre: [
      { art: '🐟', en: 'fish', zh: '鱼' },
      { art: '🚢', en: 'ship', zh: '船' },
      { art: '🍽️', en: 'dish', zh: '盘子' },
      { art: '🏪', en: 'shop', zh: '商店' }
    ],
    sight: ['the', 'a', 'is', 'my', 'and'],
    newWords: [
      { w: 'fish', zh: '鱼' },
      { w: 'ship', zh: '船' },
      { w: 'dish', zh: '盘子' },
      { w: 'sit', zh: '坐' },
      { w: 'shop', zh: '商店' },
      { w: 'chips', zh: '薯条' }
    ],
    pages: [
      { art: '🐟', en: 'A big fish. A big fish.', zh: '一条大鱼。一条大鱼。' },
      { art: '🐟⛵', en: 'The fish is on the ship.', zh: '鱼在船上。' },
      { art: '🍽️', en: 'A dish on the ship!', zh: '船上还有个盘子！' },
      { art: '🐟🍽️', en: 'The fish can sit on the dish.', zh: '鱼坐在盘子上。' },
      { art: '🐟🏪', en: 'The fish is in the shop!', zh: '鱼跑到商店里啦！' },
      { art: '🐟🍟', en: 'Fish and chips!', zh: '鱼和薯条！（英国名菜）' }
    ],
    quiz: [
      { q: '鱼在哪里？', opts: ['盒子里', '车里', '船上'], a: 2 },
      { q: '鱼坐在什么上面？', opts: ['垫子', '帽子', '盘子'], a: 2 },
      { q: '故事最后鱼变成了什么？', opts: ['鱼和薯条', '鱼汤', '鱼骨头'], a: 0 }
    ]
  },
  {
    id: 'b7', lv: 'L3', tag: 'ck · ng · th', title: 'Duck Sings', zh: '鸭子唱歌',
    emoji: '🦆', color: '#F59E0B',
    goal: '/θ/ 舌尖放在齿间',
    trap: 'th 中文里没有。舌尖轻轻放在上下齿之间吹气，不要读成 s，也不要读成 f。think 不是「辛克」。',
    summary: '这一级练 th。这是中国学生最难的一个音，常见错误是读成 s（think→sink）或 f（three→free）。',
    pre: [
      { art: '🦆', en: 'duck', zh: '鸭子' },
      { art: '🪨', en: 'rock', zh: '石头' },
      { art: '🎤', en: 'sing', zh: '唱歌' },
      { art: '🐤', en: 'chick', zh: '小鸡' }
    ],
    sight: ['the', 'a', 'is', 'my', 'and'],
    newWords: [
      { w: 'duck', zh: '鸭子' },
      { w: 'rock', zh: '石头' },
      { w: 'thin', zh: '瘦的' },
      { w: 'sing', zh: '唱歌' },
      { w: 'chick', zh: '小鸡' },
      { w: 'song', zh: '歌' }
    ],
    pages: [
      { art: '🦆🪨', en: 'A duck is on the rock.', zh: '一只鸭子在石头上。' },
      { art: '🦆', en: 'The duck is thin.', zh: '鸭子瘦瘦的。' },
      { art: '🦆🎵', en: 'The duck can sing.', zh: '鸭子会唱歌。' },
      { art: '🦆', en: 'Sing, duck, sing!', zh: '唱吧，鸭子，唱吧！' },
      { art: '🐥🦆', en: 'A chick is on the duck.', zh: '小鸡骑在鸭子上。' },
      { art: '🐥', en: 'Sing, chick, sing!', zh: '唱吧，小鸡，唱吧！' },
      { art: '🦆🐥🎶', en: 'The duck and the chick sing and sing!', zh: '鸭子和小鸡唱啊唱！' }
    ],
    quiz: [
      { q: '鸭子站在什么上面？', opts: ['盘子', '石头', '盒子'], a: 1 },
      { q: '谁骑在鸭子上？', opts: ['小鸡', '猪', '猫'], a: 0 },
      { q: '最后谁在唱歌？', opts: ['只有鸭子', '鸭子和小鸡', '只有小鸡'], a: 1 }
    ]
  },
  {
    id: 'b8', lv: 'L4', tag: '辅音连缀', title: 'Frog and Crab', zh: '青蛙和螃蟹',
    emoji: '🐸', color: '#22C55E',
    goal: '两个辅音连着滑过去',
    trap: '两个辅音之间不能加「呃」。street 不要读成 si-te-ri-te，要一口气从 s 滑到 tr。',
    summary: '这一级练辅音连缀。中文没有辅音丛，孩子会本能地在中间加元音，这是最典型的「中国口音」。',
    pre: [
      { art: '🐸', en: 'frog', zh: '青蛙' },
      { art: '🌿', en: 'grass', zh: '草地' },
      { art: '🏊', en: 'swim', zh: '游泳' },
      { art: '🦀', en: 'crab', zh: '螃蟹' }
    ],
    sight: ['the', 'a', 'is', 'my', 'and'],
    newWords: [
      { w: 'frog', zh: '青蛙' },
      { w: 'grass', zh: '草地' },
      { w: 'swim', zh: '游泳' },
      { w: 'stop', zh: '停' },
      { w: 'crab', zh: '螃蟹' },
      { w: 'grab', zh: '抓住' }
    ],
    pages: [
      { art: '🐸🌿', en: 'A frog is in the grass.', zh: '青蛙在草地里。' },
      { art: '🐸', en: 'The frog can swim.', zh: '青蛙会游泳。' },
      { art: '🐸', en: 'Stop, frog, stop!', zh: '停下，青蛙，停下！' },
      { art: '🦀', en: 'A crab! A crab!', zh: '一只螃蟹！一只螃蟹！' },
      { art: '🦀🐸', en: 'The crab is on the frog.', zh: '螃蟹骑在青蛙上。' },
      { art: '🦀', en: 'Grab, crab, grab!', zh: '抓吧，螃蟹，抓吧！' },
      { art: '🐸🦀', en: 'The frog and the crab swim and grab!', zh: '青蛙和螃蟹一边游一边抓！' }
    ],
    quiz: [
      { q: '青蛙一开始在哪里？', opts: ['石头上', '水里', '草地里'], a: 2 },
      { q: '谁骑在青蛙上？', opts: ['鸭子', '小鸡', '螃蟹'], a: 2 },
      { q: '青蛙会做什么？', opts: ['唱歌', '游泳', '挖土'], a: 1 }
    ]
  },
  {
    id: 'b9', lv: 'L5', tag: 'ee · oo', title: 'Three Green Bees', zh: '三只绿蜜蜂',
    emoji: '🐝', color: '#FACC15',
    goal: '/iː/ 拉长',
    trap: 'ee 要拉长，像微笑时说「衣——」。sheep 比 ship 长一倍，长短不分就会说成另一个词。',
    summary: '这一级练 ee 的长音 /iː/。中文没有长短元音对立，孩子容易把 sheep 读成 ship。',
    pre: [
      { art: '🌳', en: 'tree', zh: '树' },
      { art: '🐝', en: 'bee', zh: '蜜蜂（复数 bees）' },
      { art: '🌙', en: 'moon', zh: '月亮' },
      { art: '😴', en: 'sleep', zh: '睡觉' }
    ],
    sight: ['the', 'a', 'is', 'my', 'and', 'we'],
    newWords: [
      { w: 'see', zh: '看见' },
      { w: 'tree', zh: '树' },
      { w: 'bee', zh: '蜜蜂（复数 bees）' },
      { w: 'three', zh: '三' },
      { w: 'green', zh: '绿色的' },
      { w: 'moon', zh: '月亮' },
      { w: 'sleep', zh: '睡觉' },
      { w: 'feet', zh: '脚' }
    ],
    pages: [
      { art: '🌳', en: 'We can see a tree.', zh: '我们能看见一棵树。' },
      { art: '🐝🌳', en: 'A bee is in the tree.', zh: '树上有一只蜜蜂。' },
      { art: '🐝🐝🐝', en: 'Three green bees!', zh: '三只绿蜜蜂！' },
      { art: '🌙', en: 'The bees can see the moon.', zh: '蜜蜂们能看见月亮。' },
      { art: '🐝🌙', en: 'The bees sleep on the moon.', zh: '蜜蜂在月亮上睡着了。' },
      { art: '🐝', en: 'Green feet on the moon!', zh: '三只绿色的小脚丫！' },
      { art: '🌙😴', en: 'Sleep, bees, sleep!', zh: '睡吧，蜜蜂，睡吧！' }
    ],
    quiz: [
      { q: '树上有什么？', opts: ['蜜蜂', '鸭子', '帽子'], a: 0 },
      { q: '有几只蜜蜂？', opts: ['三只', '两只', '一只'], a: 0 },
      { q: '蜜蜂睡在哪里？', opts: ['草地上', '月亮上', '树上'], a: 1 }
    ]
  },
  {
    id: 'b10', lv: 'L5', tag: 'ai · ay · oa', title: 'Rain, Train, Boat', zh: '雨、火车和船',
    emoji: '🚂', color: '#8B5CF6',
    goal: '/eɪ/ 就是字母 A 的名字',
    trap: 'ai 读 /eɪ/，跟字母 A 的名字一样。rain 不要读成「拉因」两个音。',
    summary: '这一级练 ai。/eɪ/ 是双元音，要滑动，不能读成一个平的元音。',
    pre: [
      { art: '🌧️', en: 'rain', zh: '雨' },
      { art: '🎈', en: 'play', zh: '玩' },
      { art: '🚂', en: 'train', zh: '火车' },
      { art: '🛤️', en: 'road', zh: '路' }
    ],
    sight: ['the', 'a', 'is', 'my', 'and', 'we', 'go'],
    newWords: [
      { w: 'rain', zh: '雨' },
      { w: 'play', zh: '玩' },
      { w: 'train', zh: '火车' },
      { w: 'road', zh: '路' },
      { w: 'goat', zh: '山羊' },
      { w: 'boat', zh: '船' },
      { w: 'away', zh: '离开（a 弱读 /ə/，整体认读）' },
      { w: 'today', zh: '今天（to 弱读，整体认读）' },
      { w: 'wait', zh: '等' },
      { w: 'track', zh: '轨道' }
    ],
    pages: [
      { art: '🌧️', en: 'We play in the rain today.', zh: '今天我们在雨里玩。' },
      { art: '🌧️', en: 'Rain, rain, go away!', zh: '雨呀雨呀，快走开！' },
      { art: '🚂', en: 'A train! A train on the track!', zh: '一列火车！路上有列火车！' },
      { art: '⛵🐐', en: 'A goat is on the boat.', zh: '一只山羊在船上。' },
      { art: '🌧️', en: 'The goat waits in the rain.', zh: '山羊和火车都在雨里。' },
      { art: '🐐🚂', en: 'Play, goat, play!', zh: '玩吧，山羊，玩吧！' },
      { art: '🌈', en: 'Go, train, go! Go, boat, go!', zh: '开吧，火车！开吧，船！' }
    ],
    quiz: [
      { q: '大家今天在哪里玩？', opts: ['泥巴里', '雨里', '月亮上'], a: 1 },
      { q: '谁在船上？', opts: ['山羊', '鸭子', '蜜蜂'], a: 0 },
      { q: '雨歌里雨要去哪里？', opts: ['快下来', '快走开', '快睡觉'], a: 1 }
    ]
  },
  {
    id: 'b11', lv: 'L6', tag: '魔法 e', title: 'Cake on a Lake', zh: '湖上的蛋糕',
    emoji: '🎂', color: '#D4537E',
    goal: '把这一级的拼读规则读顺',
    trap: '先看每个词的元音，判断是短音还是长音，再开口。',
    summary: '这一级继续巩固拼读规则。',
    pre: [
      { art: '🎂', en: 'cake', zh: '蛋糕' },
      { art: '🍽️', en: 'plate', zh: '盘子' },
      { art: '🍚', en: 'rice', zh: '米饭' }
    ],
    sight: ['the', 'a', 'is', 'my', 'and', 'we', 'by'],
    newWords: [
      { w: 'cake', zh: '蛋糕' },
      { w: 'plate', zh: '盘子' },
      { w: 'lake', zh: '湖' },
      { w: 'five', zh: '五' },
      { w: 'ducks', zh: '鸭子们' },
      { w: 'like', zh: '喜欢' },
      { w: 'rice', zh: '米饭' },
      { w: 'grapes', zh: '葡萄' }
    ],
    pages: [
      { art: '🎂', en: 'A cake on a plate.', zh: '盘子上有个蛋糕。' },
      { art: '🎂🏞️', en: 'The cake is by the lake!', zh: '蛋糕漂在湖上！' },
      { art: '🦆🦆', en: 'Five ducks in the lake.', zh: '湖里有五只鸭子。' },
      { art: '🦆🎂', en: 'The ducks like the cake.', zh: '鸭子们喜欢蛋糕。' },
      { art: '🍚🍇', en: 'Rice and grapes on the plate!', zh: '盘子上还有米饭和葡萄！' },
      { art: '🎂🏞️', en: 'Cake on the lake! Cake on the plate!', zh: '湖上有蛋糕！盘子上有蛋糕！' },
      { art: '🦆', en: 'The ducks like cake and grapes.', zh: '鸭子们喜欢蛋糕和葡萄。' }
    ],
    quiz: [
      { q: '蛋糕在哪儿？', opts: ['盒子里', '树上', '湖边'], a: 2 },
      { q: '湖里有几只鸭子？', opts: ['十只', '五只', '三只'], a: 1 },
      { q: '盘子上还有什么？', opts: ['鸡蛋', '米饭和葡萄', '薯条'], a: 1 }
    ]
  },
  {
    id: 'b12', lv: 'L7', tag: 'ar · or · ir', title: 'The Star Car', zh: '星星汽车',
    emoji: '🚗', color: '#D85A30',
    goal: '/ɑːr/ 卷舌',
    trap: 'ar 要卷舌，但舌尖不要顶到上颚。car 不要读成「卡」，结尾要有 r 的色彩。',
    summary: '这一级练 ar。中文的「儿化」和英语的 r 不一样，容易卷过头或完全不卷。',
    pre: [
      { art: '🚗', en: 'car', zh: '汽车' },
      { art: '🌾', en: 'farm', zh: '农场' },
      { art: '🐴', en: 'horse', zh: '马（词尾 e 不发音）' },
      { art: '🐦', en: 'bird', zh: '鸟' }
    ],
    sight: ['the', 'a', 'is', 'my', 'and', 'we'],
    newWords: [
      { w: 'car', zh: '汽车' },
      { w: 'farm', zh: '农场' },
      { w: 'horse', zh: '马（词尾 e 不发音）' },
      { w: 'bird', zh: '鸟' },
      { w: 'drive', zh: '开（车）' },
      { w: 'star', zh: '星星' },
      { w: 'dark', zh: '黑暗的' },
      { w: 'girl', zh: '女孩' }
    ],
    pages: [
      { art: '🚗🌾', en: 'A car is on the farm.', zh: '农场里有一辆汽车。' },
      { art: '🚗', en: 'The car is red. My car!', zh: '汽车是红色的。我的车！' },
      { art: '🐴🚗', en: 'A horse is in the car!', zh: '马坐进汽车里啦！' },
      { art: '🐦🚗', en: 'A bird is on the car!', zh: '鸟站在汽车上！' },
      { art: '🚗', en: 'Drive, car, drive!', zh: '开吧，汽车，开吧！' },
      { art: '⭐🚗', en: 'We see a star in the dark.', zh: '我们在黑暗里看见一颗星星。' },
      { art: '⭐🚗', en: 'The star is on the car!', zh: '星星落在汽车上啦！' }
    ],
    quiz: [
      { q: '汽车在哪里？', opts: ['商店', '湖里', '农场'], a: 2 },
      { q: '谁坐进汽车里了？', opts: ['猪', '鸭子', '马'], a: 2 },
      { q: '最后什么落在了汽车上？', opts: ['蛋糕', '假发', '星星'], a: 2 }
    ]
  },
  {
    id: 'b13', lv: 'L8', tag: '视觉词', title: 'Where Is the Duck?', zh: '鸭子去哪儿了',
    emoji: '🔍', color: '#6366F1',
    goal: '整体认读，不按规则拼',
    trap: '这些词不按拼读规则走，要整体记住形状和声音。看到就整词读出来，不要逐字母拆。',
    summary: '这一级练视觉词。它们出现频率极高但不合规则，只能整体认读，读多了就自动化了。',
    pre: [
      { art: '👉', en: 'it', zh: '它' },
      { art: '🦆', en: 'duck', zh: '鸭子（复数 ducks）' },
      { art: '3️⃣', en: 'three', zh: '三' },
      { art: '☀️', en: 'sun', zh: '太阳' }
    ],
    sight: ['the', 'a', 'is', 'my', 'and', 'we', 'what', 'where', 'out', 'now', 'come', 'one', 'two', 'you', 'are', 'all', 'me'],
    newWords: [
      { w: 'it', zh: '它' },
      { w: 'duck', zh: '鸭子（复数 ducks）' },
      { w: 'three', zh: '三' },
      { w: 'sun', zh: '太阳' }
    ],
    pages: [
      { art: '❓', en: 'What is it? What is it?', zh: '这是什么？这是什么？' },
      { art: '🦆', en: 'It is my duck!', zh: '是我的鸭子！' },
      { art: '🔍', en: 'Where is the duck? Where is the duck?', zh: '鸭子去哪儿了？鸭子去哪儿了？' },
      { art: '🚪', en: 'Come out, duck! Come out!', zh: '出来，鸭子！出来！' },
      { art: '☀️', en: 'The duck is out now.', zh: '鸭子出来啦。' },
      { art: '☀️', en: 'Out in the sun!', zh: '在太阳底下！' },
      { art: '🦆🦆🦆', en: 'One, two, three ducks!', zh: '一、二、三只鸭子！' },
      { art: '🦆', en: 'We are all out now. All out!', zh: '我们都出来啦。全都出来啦！' },
      { art: '🦆☀️', en: 'You and me and my duck.', zh: '你、我，还有我的鸭子。' }
    ],
    quiz: [
      { q: '“Where is the duck?” 是什么意思？', opts: ['鸭子会飞吗？', '鸭子几岁？', '鸭子在哪儿？'], a: 2 },
      { q: '一共有几只鸭子？', opts: ['两只', '三只', '一只'], a: 1 },
      { q: '“Come out” 是什么意思？', opts: ['坐下', '进去', '出来'], a: 2 }
    ]
  },
  {
    id: 'b14', lv: 'L9', tag: '综合复习', title: 'A Big Day', zh: '了不起的一天',
    emoji: '🌅', color: '#0F6E56',
    goal: '把学过的规则混起来用',
    trap: '读之前先看每个词的元音：是短音、长音，还是魔法 e？判断完再开口。',
    summary: '这一级是综合复习。句子里混了多种规则，要先判断再读，不能凭感觉。',
    pre: [
      { art: '🌾', en: 'farm', zh: '农场' },
      { art: '🐴', en: 'horse', zh: '马（词尾 e 不发音）' },
      { art: '🦆', en: 'duck', zh: '鸭子' },
      { art: '🐷', en: 'pig', zh: '猪' }
    ],
    sight: ['the', 'a', 'is', 'my', 'and', 'we', 'go', 'day', 'for'],
    newWords: [
      { w: 'farm', zh: '农场' },
      { w: 'horse', zh: '马（词尾 e 不发音）' },
      { w: 'duck', zh: '鸭子' },
      { w: 'pig', zh: '猪' },
      { w: 'run', zh: '跑' },
      { w: 'dig', zh: '挖' },
      { w: 'sing', zh: '唱歌' },
      { w: 'car', zh: '汽车' },
      { w: 'sun', zh: '太阳' }
    ],
    pages: [
      { art: '🌅', en: 'It is a big day.', zh: '今天是了不起的一天。' },
      { art: '🌾', en: 'We go to the farm.', zh: '我们去农场。' },
      { art: '🐴', en: 'A horse is on the farm.', zh: '农场里有一匹马。' },
      { art: '🦆🐷', en: 'A duck and a pig!', zh: '一只鸭子和一头猪！' },
      { art: '🦆', en: 'The duck can run and sing.', zh: '鸭子会跑又会唱。' },
      { art: '🐷', en: 'The pig can dig in the sun.', zh: '猪在太阳底下挖土。' },
      { art: '🐴🚗', en: 'The horse is in the car!', zh: '马坐进汽车里啦！' },
      { art: '🌅', en: 'A big day for my duck and pig!', zh: '我的鸭子和猪过了了不起的一天！' }
    ],
    quiz: [
      { q: '大家今天去哪里？', opts: ['商店', '学校', '农场'], a: 2 },
      { q: '鸭子会做什么？', opts: ['挖土', '跑和唱', '开车'], a: 1 },
      { q: '谁坐进了汽车里？', opts: ['猪', '鸭子', '马'], a: 2 }
    ]
  },
  {
    id: 'b15', lv: 'L9', tag: '毕业读物', title: 'We Can Read!', zh: '我们会读书啦！',
    emoji: '📖', color: '#534AB7',
    goal: '把这一级的拼读规则读顺',
    trap: '先看每个词的元音，判断是短音还是长音，再开口。',
    summary: '这一级继续巩固拼读规则。',
    pre: [
      { art: '🐱', en: 'cat', zh: '猫' },
      { art: '🐔', en: 'hen', zh: '母鸡' },
      { art: '🐷', en: 'pig', zh: '猪' },
      { art: '🐸', en: 'frog', zh: '青蛙' }
    ],
    sight: ['the', 'a', 'is', 'my', 'and', 'we', 'can', 'I', 'read'],
    newWords: [
      { w: 'see', zh: '看见' },
      { w: 'cat', zh: '猫' },
      { w: 'hen', zh: '母鸡' },
      { w: 'pig', zh: '猪' },
      { w: 'frog', zh: '青蛙' },
      { w: 'crab', zh: '螃蟹' },
      { w: 'book', zh: '书' },
      { w: 'big', zh: '大的' },
      { w: 'too', zh: '也' }
    ],
    pages: [
      { art: '📖', en: 'I can read!', zh: '我会读书啦！' },
      { art: '🐱', en: 'I can see my cat.', zh: '我能看见我的猫。' },
      { art: '🐔', en: 'I can see my red hen.', zh: '我能看见我的红母鸡。' },
      { art: '🐷', en: 'I can see the big pig.', zh: '我能看见大胖猪。' },
      { art: '🐸🦀', en: 'I can see the frog and the crab.', zh: '我能看见青蛙和螃蟹。' },
      { art: '📖', en: 'I can read a big book!', zh: '我能读一本大书啦！' },
      { art: '🐝', en: 'The bees can read too? No, no, no!', zh: '蜜蜂也会读书？不不不！' },
      { art: '🎉', en: 'We can read! We can read!', zh: '我们会读书啦！我们会读书啦！' }
    ],
    quiz: [
      { q: '“I can read” 是什么意思？', opts: ['我会读书', '我会唱歌', '我会跑'], a: 0 },
      { q: '故事里提到了哪些动物？', opts: ['猫、母鸡、猪、青蛙、螃蟹、蜜蜂', '狗和马', '只有猫'], a: 0 },
      { q: '蜜蜂会读书吗？', opts: ['不会', '故事里没说', '会'], a: 0 }
    ]
  },
  {
    id: 'b16', lv: 'L2', tag: '短元音 a', title: 'The Sad Cat', zh: '难过的小猫',
    emoji: '😿', color: '#8FB8DE',
    goal: '/æ/ 短促有力，嘴张大',
    trap: 'a 不要读成「阿」。发 /æ/ 时嘴角往两边拉、下巴放低，像被人轻拍一下那样短。cat 千万别读成「卡特」。',
    summary: '这一级练短元音 a。/æ/ 在中文里没有对应的音，最容易读成「阿」或者拖长。',
    pre: [
      { art: '😢', en: 'sad', zh: '难过的' },
      { art: '💧', en: 'wet', zh: '湿的' },
      { art: '😤', en: 'mad', zh: '生气的' },
      { art: '👨', en: 'Dad', zh: '爸爸' }
    ],
    sight: ['the', 'a', 'is', 'my', 'and', 'it', 'I', 'am'],
    newWords: [
      { w: 'sad', zh: '难过的' },
      { w: 'wet', zh: '湿的' },
      { w: 'lap', zh: '大腿（坐着时）' },
      { w: 'nap', zh: '小睡' },
      { w: 'mad', zh: '生气的' },
      { w: 'Dad', zh: '爸爸' }
    ],
    pages: [
      { art: '😿', en: 'A sad cat.', zh: '一只难过的小猫。' },
      { art: '🌧️😿', en: 'The cat is wet.', zh: '小猫淋湿了。' },
      { art: '😿💧', en: 'The wet cat is sad.', zh: '湿透的小猫很难过。' },
      { art: '🛋️😿', en: 'A nap on my lap.', zh: '在我腿上睡一觉吧。' },
      { art: '😴🐱', en: 'The cat is on my lap.', zh: '小猫趴在我腿上睡着了。' },
      { art: '😾💦', en: 'And I am wet!', zh: '结果我身上湿了一大片！' },
      { art: '😤💦', en: 'Dad is wet. Dad is mad!', zh: '爸爸也湿了，爸爸生气了！' }
    ],
    quiz: [
      { q: '小猫为什么难过？', opts: ['太热了', '太饿了', '淋湿了'], a: 2 },
      { q: '小猫在哪儿睡觉？', opts: ['我的腿上', '帽子里', '垫子上'], a: 0 },
      { q: '故事最后谁生气了？', opts: ['爸爸', '小猫', '我'], a: 0 }
    ]
  },
  {
    id: 'b17', lv: 'L2', tag: '短元音 e', title: 'Ten Men', zh: '十个人',
    emoji: '👨‍👨‍👦', color: '#F0A868',
    goal: '/e/ 嘴形扁平',
    trap: 'e 不要读成「诶」。发 /e/ 时嘴唇向两边拉开、上下齿微开，bed 一口气收住，不要拖成「贝德」。',
    summary: '这一级练短元音 e。/e/ 的关键是短和扁，孩子容易读成双元音「诶」。',
    pre: [
      { art: '🖊️', en: 'pen', zh: '围栏' },
      { art: '🐔', en: 'hen', zh: '母鸡' },
      { art: '🛏️', en: 'bed', zh: '床' },
      { art: '😊', en: 'glad', zh: '高兴的' }
    ],
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'am', 'not'],
    newWords: [
      { w: 'men', zh: '男人（复数）' },
      { w: 'ten', zh: '十' },
      { w: 'pen', zh: '围栏' },
      { w: 'hen', zh: '母鸡' },
      { w: 'bed', zh: '床' },
      { w: 'glad', zh: '高兴的' },
      { w: 'flat', zh: '扁的；平的' }
    ],
    pages: [
      { art: '👨‍👨‍👦👨‍👨‍👦', en: 'Ten men. Ten men!', zh: '十个人。十个人！' },
      { art: '👨🚧', en: 'The men are in a pen.', zh: '十个人挤在围栏里。' },
      { art: '🐔👨', en: 'A hen is in the pen.', zh: '围栏里还有一只母鸡。' },
      { art: '🐔😱', en: 'The hen is not glad.', zh: '母鸡一点也不高兴。' },
      { art: '🛏️👨', en: 'Ten men on a bed!', zh: '十个人挤到一张床上！' },
      { art: '💥🛏️', en: 'The bed is flat!', zh: '床也不乐意了——塌了！' }
    ],
    quiz: [
      { q: '围栏里挤了几个人？', opts: ['五个人', '十个人', '两个人'], a: 1 },
      { q: '谁在围栏里不高兴？', opts: ['男人', '母鸡', '床'], a: 1 },
      { q: '最后床怎么了？', opts: ['变红了', '飞走了', '被压平了'], a: 2 }
    ]
  },
  {
    id: 'b18', lv: 'L2', tag: '短元音 i', title: 'Dig a Pit', zh: '挖个坑',
    emoji: '⛏️', color: '#C89F6D',
    goal: '/ɪ/ 短而松',
    trap: 'i 不要读成「衣」。发 /ɪ/ 时嘴比「衣」松、舌位靠后一点，pig 不要读成「皮格」。',
    summary: '这一级练短元音 i。/ɪ/ 和中文「衣」最大的差别是「松」，读紧了就变成另一个词。',
    pre: [
      { art: '⛏️', en: 'dig', zh: '挖' },
      { art: '🐘', en: 'big', zh: '大的' },
      { art: '👱', en: 'wig', zh: '假发' },
      { art: '😊', en: 'glad', zh: '高兴的' }
    ],
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'can', 'not', 'no'],
    newWords: [
      { w: 'dig', zh: '挖' },
      { w: 'pit', zh: '坑' },
      { w: 'big', zh: '大的' },
      { w: 'wig', zh: '假发' },
      { w: 'kid', zh: '小孩' },
      { w: 'sit', zh: '坐' },
      { w: 'glad', zh: '高兴的' }
    ],
    pages: [
      { art: '⛏️👦', en: 'I can dig. Dig, dig!', zh: '我会挖。挖呀挖！' },
      { art: '🕳️', en: 'A big pit!', zh: '一个大坑！' },
      { art: '👦🕳️', en: 'I sit in the pit.', zh: '我坐在坑里。' },
      { art: '🎩👦', en: 'A wig is in the pit.', zh: '坑里居然有顶假发。' },
      { art: '👦🎩', en: 'The kid is in a wig!', zh: '小孩戴上了假发！' },
      { art: '😄🕳️', en: 'I am glad in my pit!', zh: '大坑里一点也不无聊。' }
    ],
    quiz: [
      { q: '小孩在挖什么？', opts: ['一个坑', '一条河', '一棵树'], a: 0 },
      { q: '坑里有什么？', opts: ['一只猫', '一顶假发', '一辆车'], a: 1 },
      { q: '最后小孩变成了什么样？', opts: ['跑回家了', '戴着假发坐在坑里', '睡着了'], a: 1 }
    ]
  },
  {
    id: 'b19', lv: 'L2', tag: '短元音 o', title: 'The Hot Pot', zh: '滚烫的锅',
    emoji: '🍲', color: '#E5707E',
    goal: '/ɒ/ 嘴唇收圆',
    trap: 'o 不要读成「哦」。发 /ɒ/ 时嘴唇收圆、舌位低，dog 的尾音 /g/ 也要出来。',
    summary: '这一级练短元音 o。/ɒ/ 要比中文「哦」更短、嘴更圆。',
    pre: [
      { art: '🔥', en: 'hot', zh: '烫的' },
      { art: '🍲', en: 'pot', zh: '锅' },
      { art: '🧹', en: 'mop', zh: '拖把' },
      { art: '🐰', en: 'hop', zh: '单脚跳' }
    ],
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'am', 'not', 'no', 'my', 'by'],
    newWords: [
      { w: 'hot', zh: '烫的' },
      { w: 'pot', zh: '锅' },
      { w: 'mop', zh: '拖把' },
      { w: 'hop', zh: '单脚跳' },
      { w: 'dog', zh: '狗' }
    ],
    pages: [
      { art: '🍲🔥', en: 'A hot pot.', zh: '一锅滚烫的东西。' },
      { art: '🍲👐', en: 'The pot is hot. Not for me!', zh: '锅很烫，我可不敢碰！' },
      { art: '🐶🍲', en: 'My dog is by the pot.', zh: '我的狗凑到锅边。' },
      { art: '🐶💨', en: 'Hop! Hop! The dog can hop!', zh: '跳！跳！狗被烫得直跳！' },
      { art: '🧹🍲', en: 'Get the mop!', zh: '快拿拖把来！' },
      { art: '🍲🧹😅', en: 'The pot is on the mop!', zh: '锅扣在拖把上了！' }
    ],
    quiz: [
      { q: '锅怎么了？', opts: ['很凉', '很烫', '是空的'], a: 1 },
      { q: '狗为什么跳起来？', opts: ['很高兴', '想睡觉', '被烫到了'], a: 2 },
      { q: '最后锅跑到哪儿了？', opts: ['树上', '拖把上', '床上'], a: 1 }
    ]
  },
  {
    id: 'b20', lv: 'L2', tag: '短元音 u', title: 'A Bug in a Mug', zh: '杯子里的虫子',
    emoji: '🐛', color: '#8CC084',
    goal: '/ʌ/ 短促',
    trap: 'u 不要读成「啊」或「乌」。发 /ʌ/ 时嘴巴半开、舌头放平，sun 一口气收住。',
    summary: '这一级练短元音 u。/ʌ/ 介于「啊」和「呃」之间，孩子常读成两者之一。',
    pre: [
      { art: '🐛', en: 'bug', zh: '小虫子' },
      { art: '☕', en: 'mug', zh: '马克杯' },
      { art: '🏃', en: 'run', zh: '跑' }
    ],
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'am', 'not', 'my', 'you', 'glad'],
    newWords: [
      { w: 'bug', zh: '小虫子' },
      { w: 'mug', zh: '马克杯' },
      { w: 'hug', zh: '抱' },
      { w: 'jug', zh: '壶' },
      { w: 'run', zh: '跑' }
    ],
    pages: [
      { art: '☕🐛', en: 'A bug in a mug!', zh: '杯子里有只虫子！' },
      { art: '🐛☕', en: 'The bug is in my mug.', zh: '虫子在我的杯子里。' },
      { art: '😱☕', en: 'I am not glad.', zh: '我可一点也不开心。' },
      { art: '🐛🫙', en: 'The bug is in the jug.', zh: '虫子又跑到水壶里。' },
      { art: '🤗🐛', en: 'A hug for the bug?', zh: '要给虫子一个拥抱吗？' },
      { art: '🏃🐛', en: 'No! Run, bug, run!', zh: '不要！快跑，虫子，快跑！' }
    ],
    quiz: [
      { q: '虫子在哪儿？', opts: ['鞋子里', '帽子里', '杯子里'], a: 2 },
      { q: '虫子后来又跑到哪儿？', opts: ['床上', '水壶里', '树上'], a: 1 },
      { q: '故事最后让虫子做什么？', opts: ['睡觉', '唱歌', '快跑'], a: 2 }
    ]
  },
  {
    id: 'b21', lv: 'L2', tag: '短元音 e / a', title: 'My Wet Pet', zh: '我的湿宠物',
    emoji: '🐹', color: '#B99BE0',
    goal: '/e/ 嘴形扁平',
    trap: 'e 不要读成「诶」。发 /e/ 时嘴唇向两边拉开、上下齿微开，bed 一口气收住，不要拖成「贝德」。',
    summary: '这一级练短元音 e。/e/ 的关键是短和扁，孩子容易读成双元音「诶」。',
    pre: [
      { art: '🐾', en: 'pet', zh: '宠物' },
      { art: '💧', en: 'wet', zh: '湿的' },
      { art: '🥅', en: 'net', zh: '网' },
      { art: '✋', en: 'get', zh: '抓住' }
    ],
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'am', 'not', 'my', 'no'],
    newWords: [
      { w: 'pet', zh: '宠物' },
      { w: 'wet', zh: '湿的' },
      { w: 'net', zh: '网' },
      { w: 'get', zh: '抓住' },
      { w: 'red', zh: '红色的' },
      { w: 'leg', zh: '腿' }
    ],
    pages: [
      { art: '🐹', en: 'My pet is a rat.', zh: '我的宠物是只小老鼠。' },
      { art: '🌧️🐹', en: 'My pet is wet.', zh: '它淋湿了。' },
      { art: '🕸️🐹', en: 'Get the net! Get the net!', zh: '快拿网来！快拿网来！' },
      { art: '🐹🕸️', en: 'The red net is on my pet.', zh: '红网罩住了我的宠物。' },
      { art: '🦵🐹', en: 'One leg. Two legs.', zh: '一条腿。两条腿。' },
      { art: '😆🐹', en: 'My wet pet is not sad!', zh: '我的湿宠物一点也不难过！' }
    ],
    quiz: [
      { q: '我的宠物是什么？', opts: ['小猫', '小老鼠', '小兔'], a: 1 },
      { q: '宠物为什么湿了？', opts: ['掉水里了', '洗澡了', '淋雨了'], a: 2 },
      { q: '我拿什么去罩它？', opts: ['帽子', '被子', '网'], a: 2 }
    ]
  },
  {
    id: 'b22', lv: 'L2', tag: '短元音 a / e', title: 'The Red Cap', zh: '红帽子',
    emoji: '🧢', color: '#F2A0A0',
    goal: '/æ/ 短促有力，嘴张大',
    trap: 'a 不要读成「阿」。发 /æ/ 时嘴角往两边拉、下巴放低，像被人轻拍一下那样短。cat 千万别读成「卡特」。',
    summary: '这一级练短元音 a。/æ/ 在中文里没有对应的音，最容易读成「阿」或者拖长。',
    pre: [
      { art: '🧢', en: 'cap', zh: '帽子（带帽檐）' },
      { art: '🗺️', en: 'map', zh: '地图' },
      { art: '👆', en: 'tap', zh: '轻敲' },
      { art: '↔️', en: 'gap', zh: '缝隙' }
    ],
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'am', 'not', 'my', 'no', 'can'],
    newWords: [
      { w: 'cap', zh: '帽子（带帽檐）' },
      { w: 'map', zh: '地图' },
      { w: 'tap', zh: '轻敲' },
      { w: 'gap', zh: '缝隙' },
      { w: 'van', zh: '面包车' }
    ],
    pages: [
      { art: '🧢', en: 'A red cap.', zh: '一顶红帽子。' },
      { art: '🗺️🧢', en: 'The cap is on the map.', zh: '帽子压在地图上。' },
      { art: '👆🗺️', en: 'Tap, tap, tap.', zh: '敲一敲，敲一敲。' },
      { art: '🚐', en: 'A van! A red van!', zh: '一辆面包车！红色的！' },
      { art: '🚐🧢', en: 'The cap is in the van.', zh: '帽子掉进了车里。' },
      { art: '😅🧢', en: 'The cap is in the gap!', zh: '帽子卡在车缝里了！' }
    ],
    quiz: [
      { q: '帽子是什么颜色？', opts: ['绿色', '红色', '蓝色'], a: 1 },
      { q: '帽子先压在什么东西上？', opts: ['书', '地图', '盘子'], a: 1 },
      { q: '最后帽子卡在哪儿？', opts: ['车的缝隙里', '水里', '树上'], a: 0 }
    ]
  },
  {
    id: 'b23', lv: 'L3', tag: 'sh', title: 'Fish in a Dish', zh: '盘子里的鱼',
    emoji: '🐟', color: '#6FB3D9',
    goal: '/ʃ/ 像「嘘」',
    trap: 'sh 不要把舌头卷起来。嘴唇往前噘成小圆，像让人安静那样吹气。fish 的 sh 在词尾也要出来。',
    summary: '这一级练 sh。/ʃ/ 和中文「嘘」接近，但嘴唇要更往前。',
    pre: [
      { art: '🐟', en: 'fish', zh: '鱼' },
      { art: '🍽️', en: 'dish', zh: '盘子' },
      { art: '🚢', en: 'ship', zh: '船' }
    ],
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'am', 'not', 'my', 'no', 'see', 'glad'],
    newWords: [
      { w: 'fish', zh: '鱼' },
      { w: 'dish', zh: '盘子' },
      { w: 'wish', zh: '愿望' },
      { w: 'ship', zh: '船' }
    ],
    pages: [
      { art: '🐟🍽️', en: 'A fish in a dish.', zh: '盘子里的鱼。' },
      { art: '🐟🍽️😮', en: 'The fish is not glad.', zh: '鱼并不高兴。' },
      { art: '🐟🛳️', en: 'The fish can see a ship.', zh: '鱼能看见一条船。' },
      { art: '🐟💭', en: 'A wish! A big wish!', zh: '它许了个愿！一个大愿！' },
      { art: '🛳️🌊', en: 'The fish is in the ship!', zh: '鱼跑到船上去了！' },
      { art: '🐟😄', en: 'The dish is not for a fish.', zh: '盘子本来就不该装鱼嘛。' }
    ],
    quiz: [
      { q: '鱼在哪儿？', opts: ['盘子里', '水里', '船上'], a: 0 },
      { q: '鱼许了什么愿？', opts: ['想去船上', '想吃东西', '想睡觉'], a: 0 },
      { q: '故事最后鱼在哪里？', opts: ['商店里', '船上', '盘子里'], a: 1 }
    ]
  },
  {
    id: 'b24', lv: 'L3', tag: 'sh / ck', title: 'The Big Ship', zh: '大船',
    emoji: '🚢', color: '#5B9BD5',
    goal: '/ʃ/ 像「嘘」',
    trap: 'sh 不要把舌头卷起来。嘴唇往前噘成小圆，像让人安静那样吹气。fish 的 sh 在词尾也要出来。',
    summary: '这一级练 sh。/ʃ/ 和中文「嘘」接近，但嘴唇要更往前。',
    pre: [
      { art: '🚢', en: 'ship', zh: '船' },
      { art: '🪨', en: 'rock', zh: '摇晃' },
      { art: '🧦', en: 'sock', zh: '袜子' },
      { art: '🌬️', en: 'wind', zh: '风' }
    ],
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'am', 'not', 'my', 'on', 'glad'],
    newWords: [
      { w: 'ship', zh: '船' },
      { w: 'deck', zh: '甲板' },
      { w: 'rock', zh: '摇晃' },
      { w: 'sock', zh: '袜子' },
      { w: 'black', zh: '黑色的' },
      { w: 'wind', zh: '风' }
    ],
    pages: [
      { art: '🚢', en: 'A big ship!', zh: '一条大船！' },
      { art: '🚢🌊', en: 'The ship can rock.', zh: '船会摇来摇去。' },
      { art: '🧦🚢', en: 'My sock is on the deck.', zh: '我的袜子落在甲板上。' },
      { art: '🧦💨', en: 'The sock is in the wind.', zh: '袜子被风吹跑了。' },
      { art: '🧦🐟', en: 'A fish in a black sock!', zh: '一条鱼钻进了黑袜子！' },
      { art: '😂🧦', en: 'The fish is not glad.', zh: '鱼可一点也不想穿袜子。' }
    ],
    quiz: [
      { q: '我的袜子掉在哪儿？', opts: ['海里', '甲板上', '床上'], a: 1 },
      { q: '袜子被什么吹跑了？', opts: ['船', '风', '鱼'], a: 1 },
      { q: '谁钻进了袜子里？', opts: ['一个人', '一只猫', '一条鱼'], a: 2 }
    ]
  },
  {
    id: 'b25', lv: 'L3', tag: 'th', title: 'This and That', zh: '这个和那个',
    emoji: '👐', color: '#E0A458',
    goal: '/θ/ 舌尖放在齿间',
    trap: 'th 中文里没有。舌尖轻轻放在上下齿之间吹气，不要读成 s，也不要读成 f。think 不是「辛克」。',
    summary: '这一级练 th。这是中国学生最难的一个音，常见错误是读成 s（think→sink）或 f（three→free）。',
    pre: [
      { art: '📏', en: 'thin', zh: '瘦的' },
      { art: '📏', en: 'thick', zh: '粗的；厚的' },
      { art: '➡️', en: 'then', zh: '然后' },
      { art: '🛁', en: 'bath', zh: '浴缸' }
    ],
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'am', 'not', 'my', 'this', 'that'],
    newWords: [
      { w: 'thin', zh: '瘦的' },
      { w: 'thick', zh: '粗的；厚的' },
      { w: 'then', zh: '然后' },
      { w: 'bath', zh: '浴缸' },
      { w: 'moth', zh: '飞蛾' },
      { w: 'jump', zh: '跳' },
      { w: 'lamp', zh: '台灯' }
    ],
    pages: [
      { art: '🐈🐈', en: 'This cat is thin.', zh: '这只猫很瘦。' },
      { art: '🐈🐈⬛', en: 'That cat is thick.', zh: '那只猫很胖。' },
      { art: '🦋🛁', en: 'A moth is in the bath.', zh: '一只飞蛾在浴缸里。' },
      { art: '🦋💡', en: 'Then it is on the lamp.', zh: '然后它飞到灯上。' },
      { art: '🐈🦋', en: 'The thin cat can jump.', zh: '瘦猫跳得上去。' },
      { art: '🐈‍⬛😤', en: 'The thick cat can not!', zh: '胖猫可跳不上去！' }
    ],
    quiz: [
      { q: '两只猫有什么不同？', opts: ['一只瘦一只胖', '一只大一只小', '一只黑一只白'], a: 0 },
      { q: '飞蛾先在哪儿？', opts: ['灯上', '床上', '浴缸里'], a: 2 },
      { q: '谁能跳到灯上？', opts: ['胖猫', '瘦猫', '两只都能'], a: 1 }
    ]
  },
  {
    id: 'b26', lv: 'L3', tag: 'ck', title: 'Duck in a Sock', zh: '穿袜子的鸭子',
    emoji: '🦆', color: '#F2C14E',
    goal: '/k/ 只发一个音',
    trap: 'ck 只发一个 /k/，不是「克」两拍。duck 的结尾要干净地停住。',
    summary: '这一级练 ck。ck 永远只发一个 /k/，孩子容易读成「克」多一拍。',
    pre: [
      { art: '🦆', en: 'duck', zh: '鸭子' },
      { art: '🧦', en: 'sock', zh: '袜子' },
      { art: '🪨', en: 'rock', zh: '石头' },
      { art: '👜', en: 'sack', zh: '麻袋' }
    ],
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'am', 'not', 'my', 'no', 'on'],
    newWords: [
      { w: 'duck', zh: '鸭子' },
      { w: 'sock', zh: '袜子' },
      { w: 'rock', zh: '石头' },
      { w: 'sack', zh: '麻袋' },
      { w: 'pick', zh: '捡；摘' }
    ],
    pages: [
      { art: '🦆🧦', en: 'A duck in a sock.', zh: '一只穿袜子的鸭子。' },
      { art: '🦆🪨', en: 'The duck is on a rock.', zh: '鸭子站在石头上。' },
      { art: '🧦🪨', en: 'One sock. Two socks!', zh: '一只袜子。两只袜子！' },
      { art: '👜🦆', en: 'Pick up the sack.', zh: '把麻袋捡起来。' },
      { art: '🦆👜', en: 'The duck is in the sack!', zh: '鸭子钻进麻袋里了！' },
      { art: '😂🧦', en: 'A duck in a sack of socks!', zh: '一袋袜子里有只鸭子！' }
    ],
    quiz: [
      { q: '鸭子穿着什么？', opts: ['袜子', '鞋子', '帽子'], a: 0 },
      { q: '鸭子站在哪儿？', opts: ['桌子上', '船上', '石头上'], a: 2 },
      { q: '最后鸭子在哪儿？', opts: ['装满袜子的麻袋里', '树上', '水里'], a: 0 }
    ]
  },
  {
    id: 'b27', lv: 'L3', tag: 'ng', title: 'The Singing King', zh: '爱唱歌的国王',
    emoji: '👑', color: '#C8A2E0',
    goal: '/ŋ/ 收在鼻腔',
    trap: 'ng 不要读成「恩格」。发 /ŋ/ 时舌根抬起、声音从鼻腔出来，sing 结尾不要加 g。',
    summary: '这一级练 ng。/ŋ/ 是鼻音收尾，加一个 /g/ 就变成 sing-g，很常见。',
    pre: [
      { art: '🎤', en: 'sing', zh: '唱歌' },
      { art: '👑', en: 'king', zh: '国王' },
      { art: '💍', en: 'ring', zh: '戒指；铃声' },
      { art: '🎵', en: 'song', zh: '歌曲' }
    ],
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'am', 'not', 'my', 'can', 'no', 'too'],
    newWords: [
      { w: 'sing', zh: '唱歌' },
      { w: 'king', zh: '国王' },
      { w: 'ring', zh: '戒指；铃声' },
      { w: 'song', zh: '歌曲' },
      { w: 'long', zh: '长的' },
      { w: 'gold', zh: '金的' },
      { w: 'asleep', zh: '睡着的' }
    ],
    pages: [
      { art: '👑🎤', en: 'The king can sing.', zh: '国王会唱歌。' },
      { art: '👑🎶', en: 'A long, long song!', zh: '一首好长好长的歌！' },
      { art: '💍👑', en: 'A ring! A gold ring!', zh: '一枚戒指！金戒指！' },
      { art: '👑💍🎶', en: 'The king sings for the ring.', zh: '国王对着戒指唱。' },
      { art: '😴👑', en: 'The song is too long.', zh: '这歌实在太长了。' },
      { art: '😴💤', en: 'The king is asleep!', zh: '连戒指都听睡着了。' }
    ],
    quiz: [
      { q: '国王在做什么？', opts: ['唱歌', '吃饭', '跳舞'], a: 0 },
      { q: '国王发现了什么？', opts: ['一顶帽子', '一枚戒指', '一本书'], a: 1 },
      { q: '为什么大家都困了？', opts: ['天黑了', '太累了', '歌太长了'], a: 2 }
    ]
  },
  {
    id: 'b28', lv: 'L3', tag: 'ch', title: 'Chop, Chop!', zh: '切切切',
    emoji: '🔪', color: '#E88C7D',
    goal: '/tʃ/ 像「阿嚏」的后半',
    trap: 'ch 不要读成「吃」。先堵住气流再放开，chip 听起来要像「齐普」的起音而不是「吃」。',
    summary: '这一级练 ch。/tʃ/ 是「塞 + 擦」两个动作，中文「吃」只有擦音，所以容易读软。',
    pre: [
      { art: '🔪', en: 'chop', zh: '切' },
      { art: '🍟', en: 'chip', zh: '薯片' },
      { art: '➕', en: 'much', zh: '许多' },
      { art: '❗', en: 'such', zh: '如此的' }
    ],
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'am', 'not', 'my', 'can', 'no', 'see'],
    newWords: [
      { w: 'chop', zh: '切' },
      { w: 'chip', zh: '薯片' },
      { w: 'much', zh: '许多' },
      { w: 'such', zh: '如此的' },
      { w: 'bench', zh: '长凳' }
    ],
    pages: [
      { art: '🔪🥔', en: 'Chop, chop, chop!', zh: '切切切！' },
      { art: '🍟', en: 'Chips! Chips! Chips!', zh: '好多薯片！' },
      { art: '🍟🍟🍟', en: 'Such a big chip!', zh: '好大一片薯片！' },
      { art: '🪑🍟', en: 'Chip on the bench.', zh: '薯片放在长凳上。' },
      { art: '🐦🍟', en: 'A chick can see the chip.', zh: '一只小鸡看见了薯片。' },
      { art: '🐦💨', en: 'Chop, chop! No chip!', zh: '叨叨叨！薯片没了！' }
    ],
    quiz: [
      { q: '这个动作在做什么？', opts: ['切东西', '煮东西', '洗东西'], a: 0 },
      { q: '薯片放在哪儿？', opts: ['长凳上', '地上', '桌上'], a: 0 },
      { q: '谁把薯片吃掉了？', opts: ['我', '小鸡', '小狗'], a: 1 }
    ]
  },
  {
    id: 'b29', lv: 'L3', tag: 'ng / sh', title: 'The Long Song', zh: '长长的歌',
    emoji: '🎵', color: '#7FC8A9',
    goal: '/ʃ/ 像「嘘」',
    trap: 'sh 不要把舌头卷起来。嘴唇往前噘成小圆，像让人安静那样吹气。fish 的 sh 在词尾也要出来。',
    summary: '这一级练 sh。/ʃ/ 和中文「嘘」接近，但嘴唇要更往前。',
    pre: [
      { art: '📏', en: 'long', zh: '长的' },
      { art: '🎵', en: 'song', zh: '歌曲' },
      { art: '🎤', en: 'sing', zh: '唱' },
      { art: '🐟', en: 'fish', zh: '鱼' }
    ],
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'am', 'not', 'my', 'can', 'no', 'we'],
    newWords: [
      { w: 'long', zh: '长的' },
      { w: 'song', zh: '歌曲' },
      { w: 'sing', zh: '唱' },
      { w: 'fish', zh: '鱼' },
      { w: 'along', zh: '一起（跟着）' }
    ],
    pages: [
      { art: '🎵🐟', en: 'A fish can sing.', zh: '一条鱼会唱歌。' },
      { art: '🎶🌊', en: 'Such a long song!', zh: '好长的一首歌！' },
      { art: '🐟🎶🐟', en: 'Two fish sing along.', zh: '两条鱼跟着唱。' },
      { art: '🐟🐟🐟', en: 'The song is so long!', zh: '这歌可真是件大事。' },
      { art: '🦈🎶', en: 'A big fish can sing!', zh: '一条大鱼也来唱！' },
      { art: '😱🎶', en: 'We can not sing that long!', zh: '我们可唱不了那么长！' }
    ],
    quiz: [
      { q: '谁在唱歌？', opts: ['猫', '鱼', '鸟'], a: 1 },
      { q: '有几条鱼跟着唱？', opts: ['两条', '一条', '三条'], a: 0 },
      { q: '最后谁来了？', opts: ['一只猫', '一个人', '一条大鱼'], a: 2 }
    ]
  },
  {
    id: 'b30', lv: 'L3', tag: 'th', title: 'Thick Fog', zh: '浓浓的大雾',
    emoji: '🌫️', color: '#A9B7C6',
    goal: '/θ/ 舌尖放在齿间',
    trap: 'th 中文里没有。舌尖轻轻放在上下齿之间吹气，不要读成 s，也不要读成 f。think 不是「辛克」。',
    summary: '这一级练 th。这是中国学生最难的一个音，常见错误是读成 s（think→sink）或 f（three→free）。',
    pre: [
      { art: '🌫️', en: 'fog', zh: '雾' },
      { art: '🛤️', en: 'path', zh: '小路' },
      { art: '💡', en: 'lamp', zh: '灯' }
    ],
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'am', 'not', 'my', 'can', 'no', 'this', 'see'],
    newWords: [
      { w: 'thick', zh: '浓的' },
      { w: 'fog', zh: '雾' },
      { w: 'path', zh: '小路' },
      { w: 'lamp', zh: '灯' },
      { w: 'thing', zh: '东西' }
    ],
    pages: [
      { art: '🌫️', en: 'Thick, thick fog.', zh: '浓浓的雾。' },
      { art: '🌫️🛤️', en: 'I can not see the path.', zh: '我看不见小路了。' },
      { art: '💡🌫️', en: 'A lamp! A big lamp!', zh: '一盏灯！好大的一盏灯！' },
      { art: '💡🛤️', en: 'The lamp is on the path.', zh: '灯就立在小路旁。' },
      { art: '🌫️💡👀', en: 'Then I can see a thing.', zh: '然后我看见了一个东西。' },
      { art: '🐈💡', en: 'It is my cat!', zh: '是我的猫！' }
    ],
    quiz: [
      { q: '雾怎么样？', opts: ['很淡', '没有雾', '很浓'], a: 2 },
      { q: '我为什么看不见小路？', opts: ['眼睛闭上了', '天太黑了', '雾太浓了'], a: 2 },
      { q: '最后看到的是谁？', opts: ['一只狗', '我的猫', '一个人'], a: 1 }
    ]
  },
  {
    id: 'b31', lv: 'L3', tag: 'sh / th', title: 'Wish, Wish, Wish', zh: '许愿许愿',
    emoji: '🌟', color: '#F5C26B',
    goal: '/ʃ/ 像「嘘」',
    trap: 'sh 不要把舌头卷起来。嘴唇往前噘成小圆，像让人安静那样吹气。fish 的 sh 在词尾也要出来。',
    summary: '这一级练 sh。/ʃ/ 和中文「嘘」接近，但嘴唇要更往前。',
    pre: [
      { art: '🌟', en: 'wish', zh: '愿望' },
      { art: '🐟', en: 'fish', zh: '鱼' },
      { art: '➡️', en: 'then', zh: '然后' },
      { art: '👥', en: 'them', zh: '它们' }
    ],
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'am', 'not', 'my', 'can', 'no', 'this', 'but', 'swim'],
    newWords: [
      { w: 'wish', zh: '愿望' },
      { w: 'fish', zh: '鱼' },
      { w: 'then', zh: '然后' },
      { w: 'them', zh: '它们' },
      { w: 'rush', zh: '冲；急忙' }
    ],
    pages: [
      { art: '🌟🐟', en: 'A fish can wish.', zh: '一条鱼会许愿。' },
      { art: '🐟💫', en: 'Wish, wish, wish!', zh: '许愿，许愿，许愿！' },
      { art: '🐟🦵', en: 'Then it can run!', zh: '然后它长出了腿！' },
      { art: '🐟🏃', en: 'It can rush and run.', zh: '它能跑能冲。' },
      { art: '🐟😅', en: 'But it can not swim.', zh: '可它游不了泳了。' },
      { art: '🐟💦', en: 'The fish wish to swim!', zh: '鱼儿们还是想游泳！' }
    ],
    quiz: [
      { q: '鱼许了什么愿？', opts: ['想吃东西', '想飞', '想长出腿'], a: 2 },
      { q: '长腿以后它不能做什么了？', opts: ['跑步', '跳', '游泳'], a: 2 },
      { q: '最后鱼还是想做什么？', opts: ['游泳', '跑步', '睡觉'], a: 0 }
    ]
  },
  {
    id: 'b32', lv: 'L3', tag: 'ng / ck', title: 'The Lost Ring', zh: '丢了的戒指',
    emoji: '💍', color: '#D9A5B3',
    goal: '/k/ 只发一个音',
    trap: 'ck 只发一个 /k/，不是「克」两拍。duck 的结尾要干净地停住。',
    summary: '这一级练 ck。ck 永远只发一个 /k/，孩子容易读成「克」多一拍。',
    pre: [
      { art: '💍', en: 'ring', zh: '戒指' },
      { art: '🧦', en: 'sock', zh: '袜子' },
      { art: '🪨', en: 'rock', zh: '石头' }
    ],
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'am', 'not', 'my', 'no', 'she', 'on'],
    newWords: [
      { w: 'ring', zh: '戒指' },
      { w: 'hand', zh: '手' },
      { w: 'sock', zh: '袜子' },
      { w: 'rock', zh: '石头' },
      { w: 'thing', zh: '东西' },
      { w: 'sink', zh: '水槽' },
      { w: 'has', zh: '有（第三人称）' },
      { w: 'yes', zh: '是的' }
    ],
    pages: [
      { art: '💍❌', en: 'My ring is not on my hand.', zh: '戒指不在我手上了。' },
      { art: '🧦', en: 'Is it in my sock?', zh: '在袜子里吗？' },
      { art: '🧦❌', en: 'No, not in the sock.', zh: '不在袜子里。' },
      { art: '🪨', en: 'Is it on the rock?', zh: '在石头上吗？' },
      { art: '🚰✨', en: 'A thing is in the sink!', zh: '水槽里有个东西！' },
      { art: '💍🚰', en: 'Yes! The ring is in the sink!', zh: '在！戒指就在水槽里！' },
      { art: '💍🐟', en: 'And a fish has the ring!', zh: '可是戒指套在一条鱼身上！' }
    ],
    quiz: [
      { q: '我丢了什么？', opts: ['帽子', '袜子', '戒指'], a: 2 },
      { q: '戒指最后在哪儿找到的？', opts: ['袜子里', '水槽里', '石头上'], a: 1 },
      { q: '戒指套在了谁身上？', opts: ['一只手', '一条鱼', '一只猫'], a: 1 }
    ]
  },
  {
    id: 'b33', lv: 'L4', tag: '连缀 fr / j', title: 'The Frog Jumps', zh: '青蛙跳跳',
    emoji: '🐸', color: '#7FC97F',
    goal: '两个辅音连着滑过去',
    trap: '两个辅音之间不能加「呃」。street 不要读成 si-te-ri-te，要一口气从 s 滑到 tr。',
    summary: '这一级练辅音连缀。中文没有辅音丛，孩子会本能地在中间加元音，这是最典型的「中国口音」。',
    pre: [
      { art: '🐸', en: 'frog', zh: '青蛙' },
      { art: '🤸', en: 'jump', zh: '跳' },
      { art: '💧', en: 'pond', zh: '池塘' },
      { art: '🪵', en: 'log', zh: '木头' }
    ],
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'can', 'not', 'my', 'no', 'in'],
    newWords: [
      { w: 'frog', zh: '青蛙' },
      { w: 'jump', zh: '跳' },
      { w: 'pond', zh: '池塘' },
      { w: 'plop', zh: '扑通' },
      { w: 'log', zh: '木头' }
    ],
    pages: [
      { art: '🐸', en: 'A frog can jump.', zh: '青蛙会跳。' },
      { art: '🐸🪨', en: 'The frog jumps on a rock.', zh: '青蛙跳到石头上。' },
      { art: '🐸🪵', en: 'Then on a log.', zh: '再跳到木头上。' },
      { art: '🐸💧', en: 'Then in the pond!', zh: '然后跳进池塘！' },
      { art: '💧🐸', en: 'Plop! Plop!', zh: '扑通！扑通！' },
      { art: '🐸😄', en: 'The frog is glad.', zh: '青蛙开心极了。' }
    ],
    quiz: [
      { q: '青蛙会做什么？', opts: ['游泳', '飞', '跳'], a: 2 },
      { q: '青蛙最后跳进哪儿？', opts: ['树林', '池塘', '房子'], a: 1 },
      { q: '扑通扑通是什么声音？', opts: ['唱歌的声音', '打雷的声音', '跳进水里的声音'], a: 2 }
    ]
  },
  {
    id: 'b34', lv: 'L4', tag: '连缀 st', title: 'Stop the Bus!', zh: '拦住公交车',
    emoji: '🚌', color: '#F2B04E',
    goal: '两个辅音连着滑过去',
    trap: '两个辅音之间不能加「呃」。street 不要读成 si-te-ri-te，要一口气从 s 滑到 tr。',
    summary: '这一级练辅音连缀。中文没有辅音丛，孩子会本能地在中间加元音，这是最典型的「中国口音」。',
    pre: [
      { art: '🛑', en: 'stop', zh: '停' },
      { art: '🚌', en: 'bus', zh: '公交车' },
      { art: '🏁', en: 'last', zh: '最后的' },
      { art: '✊', en: 'grab', zh: '抓住' }
    ],
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'can', 'not', 'my', 'no', 'we', 'road'],
    newWords: [
      { w: 'stop', zh: '停' },
      { w: 'bus', zh: '公交车' },
      { w: 'last', zh: '最后的' },
      { w: 'grab', zh: '抓住' }
    ],
    pages: [
      { art: '🚌💨', en: 'The bus is on the road.', zh: '公交车在路上跑。' },
      { art: '🏃🚌', en: 'Stop the bus! Stop!', zh: '拦住公交车！停下！' },
      { art: '🏃💨', en: 'We can not grab it.', zh: '我们抓不住它。' },
      { art: '🚌✋', en: 'The last stop!', zh: '到终点站了！' },
      { art: '😅🚌', en: 'The bus stops at last.', zh: '公交车终于停了。' },
      { art: '😄🚌', en: 'We can get on!', zh: '我们上得去了！' }
    ],
    quiz: [
      { q: '公交车在哪儿跑？', opts: ['路上', '天上', '河里'], a: 0 },
      { q: '我们想做什么？', opts: ['洗公交车', '拦住公交车', '推公交车'], a: 1 },
      { q: '公交车什么时候停的？', opts: ['一开始', '一直没停', '到终点站时'], a: 2 }
    ]
  },
  {
    id: 'b35', lv: 'L4', tag: '连缀 tr / nd', title: 'A Trip to the Pond', zh: '去池塘玩',
    emoji: '🎒', color: '#6FB1D9',
    goal: '两个辅音连着滑过去',
    trap: '两个辅音之间不能加「呃」。street 不要读成 si-te-ri-te，要一口气从 s 滑到 tr。',
    summary: '这一级练辅音连缀。中文没有辅音丛，孩子会本能地在中间加元音，这是最典型的「中国口音」。',
    pre: [
      { art: '🎒', en: 'trip', zh: '短途旅行' },
      { art: '💧', en: 'pond', zh: '池塘' },
      { art: '🐸', en: 'frog', zh: '青蛙' },
      { art: '✋', en: 'hand', zh: '手' }
    ],
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'can', 'not', 'my', 'no', 'we', 'to'],
    newWords: [
      { w: 'trip', zh: '短途旅行' },
      { w: 'pond', zh: '池塘' },
      { w: 'frog', zh: '青蛙' },
      { w: 'hand', zh: '手' }
    ],
    pages: [
      { art: '🎒👦', en: 'A trip to the pond!', zh: '去池塘玩一趟！' },
      { art: '🌿💧', en: 'The pond is big.', zh: '池塘很大。' },
      { art: '🐸👀', en: 'A frog is in my hand.', zh: '一只青蛙在我手上。' },
      { art: '🐸💨', en: 'The frog jumps in!', zh: '青蛙一下跳进水里！' },
      { art: '👦🖐️', en: 'My hand is wet.', zh: '我的手湿了。' },
      { art: '😄🐸', en: 'The frog is glad.', zh: '青蛙倒是很开心。' }
    ],
    quiz: [
      { q: '我们去了哪儿？', opts: ['学校', '商店', '池塘'], a: 2 },
      { q: '我手上有什么？', opts: ['一本书', '一条鱼', '一只青蛙'], a: 2 },
      { q: '青蛙最后做了什么？', opts: ['跳进水里', '睡着了', '飞走了'], a: 0 }
    ]
  },
  {
    id: 'b36', lv: 'L4', tag: '连缀 tw / mb', title: 'Twin Lambs', zh: '双胞胎小羊',
    emoji: '🐑', color: '#D9C7A7',
    goal: '两个辅音连着滑过去',
    trap: '两个辅音之间不能加「呃」。street 不要读成 si-te-ri-te，要一口气从 s 滑到 tr。',
    summary: '这一级练辅音连缀。中文没有辅音丛，孩子会本能地在中间加元音，这是最典型的「中国口音」。',
    pre: [
      { art: '🐑', en: 'lamb', zh: '小羊' },
      { art: '🌿', en: 'grass', zh: '草' },
      { art: '🤸', en: 'jump', zh: '跳' }
    ],
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'can', 'not', 'my', 'no', 'we', 'two', 'lambs'],
    newWords: [
      { w: 'twin', zh: '双胞胎' },
      { w: 'lamb', zh: '小羊' },
      { w: 'grass', zh: '草' },
      { w: 'jump', zh: '跳' },
      { w: 'well', zh: '好地' }
    ],
    pages: [
      { art: '🐑🐑', en: 'Two twin lambs.', zh: '两只双胞胎小羊。' },
      { art: '🐑🌱', en: 'A lamb is on the grass.', zh: '一只小羊在草地上。' },
      { art: '🐑🌱🐑', en: 'The twin is on the grass.', zh: '另一只也在草地上。' },
      { art: '🐑🦘', en: 'The lambs can jump!', zh: '小羊还会跳！' },
      { art: '🐑💨🐑', en: 'Jump, lamb, jump!', zh: '跳吧，小羊，跳吧！' },
      { art: '😄🐑', en: 'Twin lambs jump well.', zh: '双胞胎小羊跳得真好。' }
    ],
    quiz: [
      { q: '有几只小羊？', opts: ['一只', '三只', '两只'], a: 2 },
      { q: '小羊在哪儿？', opts: ['苹果树下', '水里', '草地上'], a: 2 },
      { q: '小羊会做什么？', opts: ['跳', '游泳', '飞'], a: 0 }
    ]
  },
  {
    id: 'b37', lv: 'L4', tag: '连缀 sp / gl', title: 'Milk on the Desk', zh: '牛奶洒了',
    emoji: '🥛', color: '#A8C8E8',
    goal: '两个辅音连着滑过去',
    trap: '两个辅音之间不能加「呃」。street 不要读成 si-te-ri-te，要一口气从 s 滑到 tr。',
    summary: '这一级练辅音连缀。中文没有辅音丛，孩子会本能地在中间加元音，这是最典型的「中国口音」。',
    pre: [
      { art: '🥛', en: 'milk', zh: '牛奶' },
      { art: '🥛', en: 'glass', zh: '玻璃杯' },
      { art: '🧹', en: 'mop', zh: '拖把' },
      { art: '🪑', en: 'desk', zh: '书桌' }
    ],
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'can', 'not', 'my', 'no', 'we'],
    newWords: [
      { w: 'milk', zh: '牛奶' },
      { w: 'glass', zh: '玻璃杯' },
      { w: 'spill', zh: '洒出' },
      { w: 'mop', zh: '拖把' },
      { w: 'desk', zh: '书桌' },
      { w: 'drink', zh: '喝' }
    ],
    pages: [
      { art: '🥛', en: 'Milk in a glass.', zh: '杯子里的牛奶。' },
      { art: '🥛💥', en: 'The glass spills!', zh: '杯子洒了！' },
      { art: '💧🧻', en: 'Milk on the desk.', zh: '牛奶洒在桌上。' },
      { art: '🧹💧', en: 'Get the mop!', zh: '快拿拖把！' },
      { art: '😅🧹', en: 'I mop and mop.', zh: '我拖了又拖。' },
      { art: '🐱🥛', en: 'My cat drinks it up!', zh: '我的猫全舔干净了！' }
    ],
    quiz: [
      { q: '杯子里装的是什么？', opts: ['果汁', '牛奶', '水'], a: 1 },
      { q: '牛奶洒到哪儿了？', opts: ['门外', '床上', '桌上'], a: 2 },
      { q: '最后谁把牛奶喝光了？', opts: ['我', '爸爸', '我的猫'], a: 2 }
    ]
  },
  {
    id: 'b38', lv: 'L4', tag: '连缀 sn / cr', title: 'Snap! Snap!', zh: '咔嚓咔嚓',
    emoji: '🦀', color: '#E88C7D',
    goal: '两个辅音连着滑过去',
    trap: '两个辅音之间不能加「呃」。street 不要读成 si-te-ri-te，要一口气从 s 滑到 tr。',
    summary: '这一级练辅音连缀。中文没有辅音丛，孩子会本能地在中间加元音，这是最典型的「中国口音」。',
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'can', 'not', 'my', 'no', 'we', 'too'],
    newWords: [
      { w: 'snap', zh: '咔嚓；夹' },
      { w: 'crab', zh: '螃蟹' },
      { w: 'clap', zh: '拍手' },
      { w: 'sand', zh: '沙子' }
    ],
    pages: [
      { art: '🦀', en: 'A crab can snap.', zh: '螃蟹会夹人。' },
      { art: '🦀🏖️', en: 'The crab is on the sand.', zh: '螃蟹在沙滩上。' },
      { art: '🦀✋', en: 'Snap! Snap! My hand!', zh: '咔嚓！咔嚓！夹到我的手！' },
      { art: '👏🦀', en: 'Clap, clap, clap!', zh: '拍手，拍手，拍手！' },
      { art: '🦀🕺', en: 'The crab can clap too.', zh: '螃蟹也会拍手。' },
      { art: '😂🦀', en: 'Snap and clap!', zh: '一边夹一边拍！' }
    ],
    quiz: [
      { q: '螃蟹会做什么？', opts: ['唱歌', '跑', '夹人'], a: 2 },
      { q: '螃蟹在哪儿？', opts: ['水里', '沙滩上', '树上'], a: 1 },
      { q: '我做了什么动作？', opts: ['拍手', '跑', '跳'], a: 0 }
    ]
  },
  {
    id: 'b39', lv: 'L4', tag: '连缀 dr / mp', title: 'The Big Drum', zh: '大鼓',
    emoji: '🥁', color: '#D98C6B',
    goal: '两个辅音连着滑过去',
    trap: '两个辅音之间不能加「呃」。street 不要读成 si-te-ri-te，要一口气从 s 滑到 tr。',
    summary: '这一级练辅音连缀。中文没有辅音丛，孩子会本能地在中间加元音，这是最典型的「中国口音」。',
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'can', 'not', 'my', 'no', 'we', 'too'],
    newWords: [
      { w: 'drum', zh: '鼓' },
      { w: 'stamp', zh: '跺脚' },
      { w: 'bang', zh: '砰的一声' },
      { w: 'loud', zh: '响亮的' }
    ],
    pages: [
      { art: '🥁', en: 'A big drum!', zh: '一面大鼓！' },
      { art: '🥁🥢', en: 'Bang, bang, bang!', zh: '砰！砰！砰！' },
      { art: '🥁🔊', en: 'The drum is loud.', zh: '鼓声很响。' },
      { art: '🦶🔊', en: 'I stamp and stamp.', zh: '我跺脚，再跺脚。' },
      { art: '😬🥁', en: 'The drum is too loud.', zh: '鼓实在太响了。' },
      { art: '😴🥁', en: 'But my dog can nap!', zh: '可我的狗照样睡得着！' }
    ],
    quiz: [
      { q: '这是什么乐器？', opts: ['喇叭', '琴', '鼓'], a: 2 },
      { q: '鼓声怎么样？', opts: ['很轻', '没有声音', '很响'], a: 2 },
      { q: '我的狗在做什么？', opts: ['跑', '叫', '睡觉'], a: 2 }
    ]
  },
  {
    id: 'b40', lv: 'L4', tag: '连缀 sk / sp', title: 'Skip and Spin', zh: '蹦蹦转圈',
    emoji: '🌀', color: '#B99BE0',
    goal: '两个辅音连着滑过去',
    trap: '两个辅音之间不能加「呃」。street 不要读成 si-te-ri-te，要一口气从 s 滑到 tr。',
    summary: '这一级练辅音连缀。中文没有辅音丛，孩子会本能地在中间加元音，这是最典型的「中国口音」。',
    pre: [
      { art: '🤸', en: 'skip', zh: '蹦跳' },
      { art: '🌀', en: 'spin', zh: '转圈' },
      { art: '🤸', en: 'flop', zh: '瘫倒' }
    ],
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'can', 'not', 'my', 'no', 'we'],
    newWords: [
      { w: 'skip', zh: '蹦跳' },
      { w: 'spin', zh: '转圈' },
      { w: 'slip', zh: '滑倒' },
      { w: 'flop', zh: '瘫倒' }
    ],
    pages: [
      { art: '👧', en: 'I can skip.', zh: '我会蹦蹦跳。' },
      { art: '👧🌀', en: 'I can spin and spin.', zh: '我还会转圈。' },
      { art: '😵👧', en: 'Spin, spin, spin!', zh: '转、转、转！' },
      { art: '🦶💦', en: 'Slip! I slip!', zh: '滑了！我滑倒了！' },
      { art: '😵💫', en: 'Flop on the grass.', zh: '一屁股瘫在草地上。' },
      { art: '😄🌱', en: 'Skip and spin is fun!', zh: '蹦蹦转圈真好玩！' }
    ],
    quiz: [
      { q: '我会做什么？', opts: ['蹦跳和转圈', '画画', '游泳'], a: 0 },
      { q: '我怎么摔倒的？', opts: ['跳太高', '被推的', '滑倒的'], a: 2 },
      { q: '最后我觉得好玩吗？', opts: ['很生气', '好玩', '不好玩'], a: 1 }
    ]
  },
  {
    id: 'b41', lv: 'L4', tag: '连缀 st / br', title: 'A Nest of Eggs', zh: '一窝蛋',
    emoji: '🪺', color: '#C8B58A',
    goal: '两个辅音连着滑过去',
    trap: '两个辅音之间不能加「呃」。street 不要读成 si-te-ri-te，要一口气从 s 滑到 tr。',
    summary: '这一级练辅音连缀。中文没有辅音丛，孩子会本能地在中间加元音，这是最典型的「中国口音」。',
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'can', 'not', 'my', 'no', 'we', 'bird'],
    newWords: [
      { w: 'nest', zh: '鸟窝' },
      { w: 'egg', zh: '蛋' },
      { w: 'branch', zh: '树枝' },
      { w: 'six', zh: '六' },
      { w: 'hatch', zh: '孵出' }
    ],
    pages: [
      { art: '🪺', en: 'A nest on a branch.', zh: '树枝上有个鸟窝。' },
      { art: '🥚🥚', en: 'Six eggs in the nest.', zh: '窝里有六个蛋。' },
      { art: '🥚👀', en: 'I can not get them.', zh: '我够不着它们。' },
      { art: '🐦🪺', en: 'A bird is on the nest.', zh: '一只鸟落在窝上。' },
      { art: '🐦🥚', en: 'The bird sits and sits.', zh: '鸟就那样一直孵着。' },
      { art: '🐣🐣', en: 'Six eggs hatch!', zh: '六个蛋全孵出来了！' }
    ],
    quiz: [
      { q: '鸟窝在哪儿？', opts: ['水里', '地上', '树枝上'], a: 2 },
      { q: '窝里有几个蛋？', opts: ['三个', '十个', '六个'], a: 2 },
      { q: '最后蛋怎么了？', opts: ['破了', '被拿走了', '孵出小鸟了'], a: 2 }
    ]
  },
  {
    id: 'b42', lv: 'L4', tag: '连缀 bl / tr', title: 'The Black Cat', zh: '黑猫',
    emoji: '🐈‍⬛', color: '#8E8E9A',
    goal: '两个辅音连着滑过去',
    trap: '两个辅音之间不能加「呃」。street 不要读成 si-te-ri-te，要一口气从 s 滑到 tr。',
    summary: '这一级练辅音连缀。中文没有辅音丛，孩子会本能地在中间加元音，这是最典型的「中国口音」。',
    pre: [
      { art: '⚫', en: 'spot', zh: '看见；斑点' },
      { art: '😊', en: 'glad', zh: '高兴的' },
      { art: '🧱', en: 'wall', zh: '墙' }
    ],
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'can', 'not', 'my', 'no', 'we', 'on', 'dark', 'see'],
    newWords: [
      { w: 'black', zh: '黑色的' },
      { w: 'track', zh: '足迹；小路' },
      { w: 'spot', zh: '看见；斑点' },
      { w: 'glad', zh: '高兴的' },
      { w: 'pal', zh: '伙伴' },
      { w: 'still', zh: '不动的' },
      { w: 'wall', zh: '墙' }
    ],
    pages: [
      { art: '🐈‍⬛', en: 'A black cat.', zh: '一只黑猫。' },
      { art: '🐾🌙', en: 'It can track in the dark.', zh: '它能在黑夜里追踪。' },
      { art: '👀🐈‍⬛', en: 'I spot it on the wall.', zh: '我在墙上看见了它。' },
      { art: '🐈‍⬛🧱', en: 'The black cat sits still.', zh: '黑猫一动不动地坐着。' },
      { art: '🐈‍⬛😺', en: 'It is glad to see me.', zh: '它见到我很高兴。' },
      { art: '😄🐈‍⬛', en: 'A black cat is my pal.', zh: '黑猫是我的好朋友。' }
    ],
    quiz: [
      { q: '猫是什么颜色？', opts: ['白色', '黄色', '黑色'], a: 2 },
      { q: '我在哪儿看见它？', opts: ['树上', '水里', '墙上'], a: 2 },
      { q: '猫见到我什么表情？', opts: ['很生气', '很高兴', '很害怕'], a: 1 }
    ]
  },
  {
    id: 'b43', lv: 'L4', tag: '连缀 gr / fl', title: 'Grab the Flag', zh: '抢旗子',
    emoji: '🚩', color: '#E5707E',
    goal: '两个辅音连着滑过去',
    trap: '两个辅音之间不能加「呃」。street 不要读成 si-te-ri-te，要一口气从 s 滑到 tr。',
    summary: '这一级练辅音连缀。中文没有辅音丛，孩子会本能地在中间加元音，这是最典型的「中国口音」。',
    pre: [
      { art: '🚩', en: 'flag', zh: '旗子' },
      { art: '🏃', en: 'run', zh: '跑' },
      { art: '💨', en: 'fast', zh: '快地' }
    ],
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'can', 'not', 'my', 'no', 'we'],
    newWords: [
      { w: 'grab', zh: '抓住' },
      { w: 'flag', zh: '旗子' },
      { w: 'run', zh: '跑' },
      { w: 'win', zh: '赢' },
      { w: 'fast', zh: '快地' }
    ],
    pages: [
      { art: '🚩', en: 'A red flag!', zh: '一面红旗！' },
      { art: '🏃🚩', en: 'Run and grab the flag!', zh: '跑去抢旗子！' },
      { art: '🏃💨🏃', en: 'We all run fast.', zh: '我们都跑得飞快。' },
      { art: '✋🚩', en: 'I grab it at last!', zh: '我终于抓住了！' },
      { art: '😄🚩', en: 'I win the flag!', zh: '我赢到了旗子！' },
      { art: '😂🚩', en: 'But it is my sock!', zh: '可那其实是只袜子！' }
    ],
    quiz: [
      { q: '旗子是什么颜色？', opts: ['绿色', '红色', '蓝色'], a: 1 },
      { q: '我们要做什么？', opts: ['洗旗子', '抢旗子', '扔旗子'], a: 1 },
      { q: '最后发现抓到的是什么？', opts: ['一只袜子', '一条毛巾', '一面旗'], a: 0 }
    ]
  },
  {
    id: 'b44', lv: 'L5', tag: 'ee', title: 'A Sheep in a Tree', zh: '树上的羊',
    emoji: '🐑', color: '#7FC8A9',
    goal: '/iː/ 拉长',
    trap: 'ee 要拉长，像微笑时说「衣——」。sheep 比 ship 长一倍，长短不分就会说成另一个词。',
    summary: '这一级练 ee 的长音 /iː/。中文没有长短元音对立，孩子容易把 sheep 读成 ship。',
    pre: [
      { art: '🐑', en: 'sheep', zh: '绵羊' },
      { art: '🌳', en: 'tree', zh: '树' },
      { art: '😴', en: 'sleep', zh: '睡觉' }
    ],
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'can', 'not', 'my', 'no', 'we', 'see'],
    newWords: [
      { w: 'sheep', zh: '绵羊' },
      { w: 'tree', zh: '树' },
      { w: 'sleep', zh: '睡觉' },
      { w: 'green', zh: '绿色的' },
      { w: 'down', zh: '向下' },
      { w: 'sleepy', zh: '困的' }
    ],
    pages: [
      { art: '🐑🌳', en: 'A sheep in a tree!', zh: '树上有一只羊！' },
      { art: '👀🌳', en: 'I can see it sleep.', zh: '我看见它在睡觉。' },
      { art: '🌳🍃', en: 'The tree is green.', zh: '这棵树绿油油的。' },
      { art: '🐑💤', en: 'The sheep sleeps and sleeps.', zh: '羊睡了又睡。' },
      { art: '😴🐑', en: 'Sheep, can you get down?', zh: '羊啊，你下得来吗？' },
      { art: '😂🐑', en: 'No. I am too sleepy!', zh: '下不来——这树太绿太舒服了！' }
    ],
    quiz: [
      { q: '羊在哪儿？', opts: ['树上', '水里', '草地上'], a: 0 },
      { q: '羊在做什么？', opts: ['吃草', '跑', '睡觉'], a: 2 },
      { q: '树是什么颜色？', opts: ['黄色', '绿色', '红色'], a: 1 }
    ]
  },
  {
    id: 'b45', lv: 'L5', tag: 'oo', title: 'The Moon in the Pool', zh: '池子里的月亮',
    emoji: '🌙', color: '#7B8FA8',
    goal: '/uː/ 圆唇长音',
    trap: 'oo 嘴唇收圆往前，像火车「呜——」。book 是短音 /ʊ/，moon 是长音 /uː/，两个不一样。',
    summary: '这一级练 oo。oo 有长 /uː/ 和短 /ʊ/ 两种读法，靠单词记，不靠规则。',
    pre: [
      { art: '🌙', en: 'moon', zh: '月亮' },
      { art: '🏊', en: 'pool', zh: '水池' },
      { art: '🔁', en: 'again', zh: '再一次' }
    ],
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'can', 'not', 'my', 'no', 'we', 'see'],
    newWords: [
      { w: 'moon', zh: '月亮' },
      { w: 'pool', zh: '水池' },
      { w: 'soon', zh: '很快' },
      { w: 'cool', zh: '凉的' },
      { w: 'again', zh: '再一次' },
      { w: 'there', zh: '那里' }
    ],
    pages: [
      { art: '🌙', en: 'The moon is up.', zh: '月亮升起来了。' },
      { art: '🌙🏊', en: 'The moon is in the pool!', zh: '月亮掉进水池里！' },
      { art: '👀💧', en: 'I can see it there.', zh: '我能看见它在水里。' },
      { art: '🌊🌙', en: 'The pool is cool.', zh: '池水凉凉的。' },
      { art: '✋🌙', en: 'I can not get it.', zh: '可我捞不到它。' },
      { art: '😌🌙', en: 'Soon it is up again!', zh: '很快它又回到天上了！' }
    ],
    quiz: [
      { q: '月亮在哪儿？', opts: ['水池里（倒影）', '树上', '屋顶上'], a: 0 },
      { q: '池水感觉怎么样？', opts: ['很烫', '凉凉的', '结冰了'], a: 1 },
      { q: '我捞到月亮了吗？', opts: ['捞到一半', '没有', '捞到了'], a: 1 }
    ]
  },
  {
    id: 'b46', lv: 'L5', tag: 'ai', title: 'Wait for the Train', zh: '等火车',
    emoji: '🚂', color: '#6FB1D9',
    goal: '/eɪ/ 就是字母 A 的名字',
    trap: 'ai 读 /eɪ/，跟字母 A 的名字一样。rain 不要读成「拉因」两个音。',
    summary: '这一级练 ai。/eɪ/ 是双元音，要滑动，不能读成一个平的元音。',
    pre: [
      { art: '🚂', en: 'train', zh: '火车' },
      { art: '🌧️', en: 'rain', zh: '雨' },
      { art: '🔁', en: 'again', zh: '再一次' }
    ],
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'can', 'not', 'my', 'no', 'we', 'for', 'are'],
    newWords: [
      { w: 'wait', zh: '等待' },
      { w: 'train', zh: '火车' },
      { w: 'rain', zh: '雨' },
      { w: 'again', zh: '再一次' }
    ],
    pages: [
      { art: '🚉👦', en: 'We wait for the train.', zh: '我们等火车。' },
      { art: '🌧️🚉', en: 'Then the rain comes.', zh: '然后下起雨来。' },
      { art: '🌧️😕', en: 'We wait and wait.', zh: '我们等了又等。' },
      { art: '🚂💨', en: 'The train is in!', zh: '火车进站了！' },
      { art: '🚂🌧️', en: 'We get on at last.', zh: '我们终于上去了。' },
      { art: '😄🚂', en: 'Rain, rain, we are on the train!', zh: '雨啊雨啊，你走吧！' }
    ],
    quiz: [
      { q: '我们在等什么？', opts: ['飞机', '公交车', '火车'], a: 2 },
      { q: '等的时候天气怎么了？', opts: ['下雪了', '下雨了', '出太阳'], a: 1 },
      { q: '最后我们上去了吗？', opts: ['上去了', '跑回家了', '没上去'], a: 0 }
    ]
  },
  {
    id: 'b47', lv: 'L5', tag: 'ai', title: 'A Snail on the Tail', zh: '尾巴上的蜗牛',
    emoji: '🐌', color: '#C8B58A',
    goal: '/eɪ/ 就是字母 A 的名字',
    trap: 'ai 读 /eɪ/，跟字母 A 的名字一样。rain 不要读成「拉因」两个音。',
    summary: '这一级练 ai。/eɪ/ 是双元音，要滑动，不能读成一个平的元音。',
    pre: [
      { art: '🐌', en: 'snail', zh: '蜗牛' },
      { art: '🐕', en: 'tail', zh: '尾巴' },
      { art: '🐢', en: 'slow', zh: '慢的' }
    ],
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'can', 'not', 'my', 'no', 'we', 'on', 'safe'],
    newWords: [
      { w: 'snail', zh: '蜗牛' },
      { w: 'tail', zh: '尾巴' },
      { w: 'slow', zh: '慢的' },
      { w: 'still', zh: '仍然' },
      { w: 'there', zh: '那里' }
    ],
    pages: [
      { art: '🐌', en: 'A snail is slow.', zh: '蜗牛很慢。' },
      { art: '🐌🐕', en: 'It is on my dog.', zh: '它趴在我的狗身上。' },
      { art: '🐌🦴', en: 'It is on the tail!', zh: '就在尾巴上！' },
      { art: '🐕💨', en: 'My dog runs and runs.', zh: '我的狗跑了又跑。' },
      { art: '🐌😌', en: 'The snail is still there.', zh: '蜗牛还稳稳待着。' },
      { art: '😂🐌', en: 'Slow and safe!', zh: '慢，但是稳！' }
    ],
    quiz: [
      { q: '蜗牛爬得怎么样？', opts: ['很快', '会飞', '很慢'], a: 2 },
      { q: '蜗牛趴在哪儿？', opts: ['墙上', '狗的尾巴上', '树上'], a: 1 },
      { q: '狗跑完以后蜗牛还在吗？', opts: ['飞了', '还在', '掉了'], a: 1 }
    ]
  },
  {
    id: 'b48', lv: 'L5', tag: 'ay', title: 'Play All Day', zh: '玩一整天',
    emoji: '🎈', color: '#F5C26B',
    goal: '/eɪ/ 词尾写法',
    trap: 'ay 和 ai 读音一样，都是 /eɪ/，只是 ay 出现在词尾。play 的结尾要收圆。',
    summary: '这一级练 ay。ay 出现在词尾（play、day），ai 出现在词中（rain），读音相同。',
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'can', 'not', 'my', 'no', 'we', 'all', 'now'],
    newWords: [
      { w: 'play', zh: '玩' },
      { w: 'day', zh: '白天' },
      { w: 'stay', zh: '待着' },
      { w: 'way', zh: '路；方式' }
    ],
    pages: [
      { art: '🎈👦', en: 'We play all day.', zh: '我们玩了一整天。' },
      { art: '🌞🎈', en: 'The day is long.', zh: '这一天很长。' },
      { art: '🏠😕', en: 'But we can not stay.', zh: '可我们不能一直待着。' },
      { art: '🚶🌇', en: 'We go the long way.', zh: '我们绕了条远路回家。' },
      { art: '😴🎈', en: 'We play and play.', zh: '我们玩了又玩。' },
      { art: '😂🌙', en: 'Now it is not day!', zh: '现在天都黑啦！' }
    ],
    quiz: [
      { q: '我们玩了多久？', opts: ['一小时', '一整天', '一分钟'], a: 1 },
      { q: '回家走的是哪条路？', opts: ['远路', '水路', '近路'], a: 0 },
      { q: '最后天怎么样了？', opts: ['还亮着', '黑了', '下雪了'], a: 1 }
    ]
  },
  {
    id: 'b49', lv: 'L5', tag: 'oa', title: 'The Goat and the Boat', zh: '山羊和船',
    emoji: '🐐', color: '#A8C8E8',
    goal: '/oʊ/ 就是字母 O 的名字',
    trap: 'oa 读 /oʊ/，跟字母 O 的名字一样。boat 不要读成「波阿特」。',
    summary: '这一级练 oa。/oʊ/ 要滑动，从 /o/ 滑到 /ʊ/。',
    pre: [
      { art: '🐐', en: 'goat', zh: '山羊' },
      { art: '⛵', en: 'boat', zh: '小船' },
      { art: '🛤️', en: 'road', zh: '路' },
      { art: '🧥', en: 'coat', zh: '外套' }
    ],
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'can', 'not', 'my', 'no', 'we', 'on', 'goes'],
    newWords: [
      { w: 'goat', zh: '山羊' },
      { w: 'boat', zh: '小船' },
      { w: 'road', zh: '路' },
      { w: 'coat', zh: '外套' },
      { w: 'want', zh: '想要' }
    ],
    pages: [
      { art: '🐐', en: 'A goat on the road.', zh: '路上有一只山羊。' },
      { art: '🐐⛵', en: 'It wants a boat.', zh: '它想要一条船。' },
      { art: '🧥⛵', en: 'A coat is in the boat.', zh: '船里有一件外套。' },
      { art: '🐐🧥', en: 'The goat gets the coat.', zh: '山羊叼走了外套。' },
      { art: '⛵🌊', en: 'The boat goes away.', zh: '小船漂走了。' },
      { art: '😂🐐', en: 'A goat in a coat!', zh: '一只穿外套的山羊！' }
    ],
    quiz: [
      { q: '山羊在哪儿？', opts: ['船上', '路上', '屋顶上'], a: 1 },
      { q: '山羊拿走了什么？', opts: ['船桨', '外套', '帽子'], a: 1 },
      { q: '最后山羊变成了什么样？', opts: ['穿着外套', '睡着了', '坐在船上'], a: 0 }
    ]
  },
  {
    id: 'b50', lv: 'L5', tag: 'ai / ay', title: 'Rain, Rain', zh: '下雨啦',
    emoji: '🌧️', color: '#8FB8DE',
    goal: '/eɪ/ 就是字母 A 的名字',
    trap: 'ai 读 /eɪ/，跟字母 A 的名字一样。rain 不要读成「拉因」两个音。',
    summary: '这一级练 ai。/eɪ/ 是双元音，要滑动，不能读成一个平的元音。',
    pre: [
      { art: '🌧️', en: 'rain', zh: '雨' },
      { art: '💧', en: 'wet', zh: '湿的' },
      { art: '🎈', en: 'play', zh: '玩' }
    ],
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'can', 'not', 'my', 'no', 'we', 'in'],
    newWords: [
      { w: 'rain', zh: '雨' },
      { w: 'wet', zh: '湿的' },
      { w: 'play', zh: '玩' },
      { w: 'stay', zh: '待' },
      { w: 'day', zh: '白天' }
    ],
    pages: [
      { art: '🌧️', en: 'Rain, rain, rain!', zh: '下雨，下雨，下雨！' },
      { art: '😕🪟', en: 'We can not play.', zh: '我们没法出去玩。' },
      { art: '🏠🧩', en: 'We stay in all day.', zh: '我们整天待在家里。' },
      { art: '💧🌱', en: 'The grass is wet.', zh: '外面的草湿透了。' },
      { art: '🌞🌈', en: 'Then the sun is out!', zh: '然后太阳出来了！' },
      { art: '😄💦', en: 'We can play in it!', zh: '我们可以在水洼里玩！' }
    ],
    quiz: [
      { q: '天气怎么样？', opts: ['刮风', '下雨', '下雪'], a: 1 },
      { q: '我们为什么待在家里？', opts: ['门坏了', '天太黑', '下雨不能出去'], a: 2 },
      { q: '雨停后我们做什么？', opts: ['出去玩', '吃饭', '继续睡'], a: 0 }
    ]
  },
  {
    id: 'b51', lv: 'L5', tag: 'ee', title: 'Sleep, Sheep!', zh: '睡吧，小羊',
    emoji: '😴', color: '#B9C7D9',
    goal: '/iː/ 拉长',
    trap: 'ee 要拉长，像微笑时说「衣——」。sheep 比 ship 长一倍，长短不分就会说成另一个词。',
    summary: '这一级练 ee 的长音 /iː/。中文没有长短元音对立，孩子容易把 sheep 读成 ship。',
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'can', 'not', 'my', 'no', 'we', 'all', 'eyes', 'night', 'now'],
    newWords: [
      { w: 'sheep', zh: '绵羊' },
      { w: 'sleep', zh: '睡觉' },
      { w: 'keep', zh: '保持' },
      { w: 'deep', zh: '深的' },
      { w: 'open', zh: '睁开的' }
    ],
    pages: [
      { art: '🐑💤', en: 'The sheep can not sleep.', zh: '这只羊睡不着。' },
      { art: '🐑👀', en: 'It keeps its eyes open.', zh: '它眼睛睁得大大的。' },
      { art: '🌙🐑', en: 'It is a deep night.', zh: '夜已经很深了。' },
      { art: '🎵🐑', en: 'I sing to the sheep.', zh: '我给羊唱歌。' },
      { art: '😴🐑', en: 'The sheep sleeps at last.', zh: '羊终于睡着了。' },
      { art: '😴👦', en: 'But now I can not sleep!', zh: '结果我睡不着了！' }
    ],
    quiz: [
      { q: '谁睡不着？', opts: ['我', '小羊', '狗'], a: 1 },
      { q: '我做了什么帮它？', opts: ['唱歌', '拍它', '讲故事'], a: 0 },
      { q: '最后谁睡不着了？', opts: ['两个都睡不好', '小羊', '我'], a: 2 }
    ]
  },
  {
    id: 'b52', lv: 'L5', tag: 'oo', title: 'Food at the Zoo', zh: '动物园的饭',
    emoji: '🦒', color: '#F2B04E',
    goal: '/uː/ 圆唇长音',
    trap: 'oo 嘴唇收圆往前，像火车「呜——」。book 是短音 /ʊ/，moon 是长音 /uː/，两个不一样。',
    summary: '这一级练 oo。oo 有长 /uː/ 和短 /ʊ/ 两种读法，靠单词记，不靠规则。',
    pre: [
      { art: '🍽️', en: 'food', zh: '食物' },
      { art: '🦁', en: 'zoo', zh: '动物园' },
      { art: '🍽️', en: 'eat', zh: '吃' },
      { art: '🦓', en: 'zebra', zh: '斑马' }
    ],
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'can', 'not', 'my', 'no', 'we', 'at', 'eats'],
    newWords: [
      { w: 'food', zh: '食物' },
      { w: 'zoo', zh: '动物园' },
      { w: 'too', zh: '也；太' },
      { w: 'room', zh: '房间；空间' },
      { w: 'eat', zh: '吃' },
      { w: 'small', zh: '小的' },
      { w: 'zebra', zh: '斑马' }
    ],
    pages: [
      { art: '🦓🍃', en: 'Food at the zoo!', zh: '动物园开饭啦！' },
      { art: '🐘🍎', en: 'The zoo has much food.', zh: '动物园里吃的多得很。' },
      { art: '🦓😋', en: 'The zebra eats and eats.', zh: '长颈鹿吃了又吃。' },
      { art: '🦓🤰', en: 'Too much food!', zh: '实在吃太多了！' },
      { art: '🦓😴', en: 'It wants a big room.', zh: '它需要一个更大的房间。' },
      { art: '😂🦓', en: 'The zoo is too small!', zh: '这动物园太小啦！' }
    ],
    quiz: [
      { q: '这是在哪儿？', opts: ['农场', '学校', '动物园'], a: 2 },
      { q: '斑马吃了多少？', opts: ['一点点', '没吃', '太多了'], a: 2 },
      { q: '为什么说动物园太小？', opts: ['门太窄', '动物太多', '斑马吃得太多了'], a: 2 }
    ]
  },
  {
    id: 'b53', lv: 'L5', tag: 'ee', title: 'A Green Seed', zh: '一颗绿种子',
    emoji: '🌱', color: '#7FC97F',
    goal: '/iː/ 拉长',
    trap: 'ee 要拉长，像微笑时说「衣——」。sheep 比 ship 长一倍，长短不分就会说成另一个词。',
    summary: '这一级练 ee 的长音 /iː/。中文没有长短元音对立，孩子容易把 sheep 读成 ship。',
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'can', 'not', 'my', 'no', 'we', 'in', 'from', 'now'],
    newWords: [
      { w: 'green', zh: '绿色的' },
      { w: 'seed', zh: '种子' },
      { w: 'tree', zh: '树' },
      { w: 'need', zh: '需要' },
      { w: 'put', zh: '放' }
    ],
    pages: [
      { art: '🌱', en: 'A green seed.', zh: '一颗绿绿的种子。' },
      { art: '🕳️🌱', en: 'I put it in the mud.', zh: '我把它埋进土里。' },
      { art: '💧🌱', en: 'It needs sun and rain.', zh: '它需要阳光和雨水。' },
      { art: '🌱📈', en: 'It can get big.', zh: '它会慢慢长大。' },
      { art: '🌳', en: 'Now it is a tree!', zh: '现在它是一棵树了！' },
      { art: '😄🌳', en: 'A tree from a seed!', zh: '一颗种子长成了一棵树！' }
    ],
    quiz: [
      { q: '我把种子放在哪儿？', opts: ['桌上', '土里', '水里'], a: 1 },
      { q: '种子需要什么？', opts: ['阳光和雨水', '风', '灯光'], a: 0 },
      { q: '最后种子长成了什么？', opts: ['一根草', '一朵花', '一棵树'], a: 2 }
    ]
  },
  {
    id: 'b54', lv: 'L5', tag: 'oa', title: 'The Long Road', zh: '长长的路',
    emoji: '🛤️', color: '#C8B58A',
    goal: '/oʊ/ 就是字母 O 的名字',
    trap: 'oa 读 /oʊ/，跟字母 O 的名字一样。boat 不要读成「波阿特」。',
    summary: '这一级练 oa。/oʊ/ 要滑动，从 /o/ 滑到 /ʊ/。',
    pre: [
      { art: '🛤️', en: 'road', zh: '路' },
      { art: '🐐', en: 'goat', zh: '山羊' },
      { art: '🐸', en: 'toad', zh: '蟾蜍' },
      { art: '🤸', en: 'jump', zh: '跳' }
    ],
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'can', 'not', 'my', 'no', 'we', 'on', 'they'],
    newWords: [
      { w: 'road', zh: '路' },
      { w: 'goat', zh: '山羊' },
      { w: 'load', zh: '货物' },
      { w: 'toad', zh: '蟾蜍' },
      { w: 'jump', zh: '跳' }
    ],
    pages: [
      { art: '🛤️', en: 'A long, long road.', zh: '一条长长长路。' },
      { art: '🐐🛤️', en: 'A goat on the road.', zh: '路上有只山羊。' },
      { art: '🐐📦', en: 'It has a big load.', zh: '它背着一大包东西。' },
      { art: '🐸🛤️', en: 'The load can jump!', zh: '路上还有一只蟾蜍。' },
      { art: '🐐🐸', en: 'They go down the road.', zh: '它们一起往前走。' },
      { art: '😂🐐', en: 'The load is a toad!', zh: '那包东西原来是只蟾蜍！' }
    ],
    quiz: [
      { q: '路上有谁？', opts: ['猫和狗', '牛和马', '山羊和蟾蜍'], a: 2 },
      { q: '山羊背着什么？', opts: ['一桶水', '一大包东西', '一捆草'], a: 1 },
      { q: '最后发现那包东西是什么？', opts: ['面包', '石头', '蟾蜍'], a: 2 }
    ]
  },
  {
    id: 'b55', lv: 'L6', tag: 'a_e', title: 'The Cake by the Lake', zh: '湖边的蛋糕',
    emoji: '🎂', color: '#F2A0A0',
    goal: '末尾 e 不发音，a 读字母名',
    trap: '末尾的 e 不发音，但它让前面的 a 读 /eɪ/。cake 不是「卡克」，是「凯克」。',
    summary: '这一级练魔法 e（a_e）。这是英语里最划算的规则：加一个不发音的 e，前面的元音就读字母名。',
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'can', 'not', 'my', 'no', 'we', 'on'],
    newWords: [
      { w: 'cake', zh: '蛋糕' },
      { w: 'lake', zh: '湖' },
      { w: 'make', zh: '做' },
      { w: 'take', zh: '拿' },
      { w: 'smell', zh: '闻到' }
    ],
    pages: [
      { art: '🎂', en: 'We make a cake.', zh: '我们做了一个蛋糕。' },
      { art: '🏞️🎂', en: 'We take it to the lake.', zh: '我们把它带到湖边。' },
      { art: '🦆🎂', en: 'A duck can smell it.', zh: '一只鸭子闻到了香味。' },
      { art: '🦆💨', en: 'It takes the cake!', zh: '它把蛋糕叼走了！' },
      { art: '🏃🦆', en: 'We run to the lake.', zh: '我们追到湖边。' },
      { art: '😂🎂', en: 'The duck is in the cake!', zh: '鸭子一头栽进蛋糕里！' }
    ],
    quiz: [
      { q: '我们做了什么？', opts: ['一条船', '一个蛋糕', '一顶帽子'], a: 1 },
      { q: '我们把蛋糕带到哪儿？', opts: ['湖边', '山上', '学校'], a: 0 },
      { q: '谁把蛋糕叼走了？', opts: ['猫', '鸭子', '狗'], a: 1 }
    ]
  },
  {
    id: 'b56', lv: 'L6', tag: 'i_e', title: 'Five Kites', zh: '五只风筝',
    emoji: '🪁', color: '#7FB8DE',
    goal: '末尾 e 不发音，i 读 /aɪ/',
    trap: 'i_e 里 i 读 /aɪ/，就是字母 I 的名字。bike 不是「比克」，是「拜克」。',
    summary: '这一级练魔法 e（i_e）。孩子容易把 i_e 还读成短音 /ɪ/，那样 bike 就变回 bick。',
    pre: [
      { art: '🪁', en: 'kite', zh: '风筝' },
      { art: '🚲', en: 'ride', zh: '骑' },
      { art: '🚲', en: 'bike', zh: '自行车' },
      { art: '🌌', en: 'sky', zh: '天空' }
    ],
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'can', 'not', 'my', 'no', 'we', 'in'],
    newWords: [
      { w: 'five', zh: '五' },
      { w: 'kite', zh: '风筝' },
      { w: 'like', zh: '喜欢' },
      { w: 'ride', zh: '骑' },
      { w: 'bike', zh: '自行车' },
      { w: 'sky', zh: '天空' }
    ],
    pages: [
      { art: '🪁🪁', en: 'Five kites in the sky.', zh: '天上有五只风筝。' },
      { art: '👦🪁', en: 'I like the red kite.', zh: '我喜欢那只红的。' },
      { art: '💨🪁', en: 'The wind takes it up.', zh: '风把它送得高高的。' },
      { art: '🏃🪁', en: 'I ride my bike and run.', zh: '我骑车追着跑。' },
      { art: '🌳🪁', en: 'It is in a tree!', zh: '它挂到树上了！' },
      { art: '😂🪁', en: 'Five kites, one tree!', zh: '五只风筝，一棵树！' }
    ],
    quiz: [
      { q: '天上有几只风筝？', opts: ['五只', '一只', '三只'], a: 0 },
      { q: '我喜欢哪只？', opts: ['绿色的', '蓝色的', '红色的'], a: 2 },
      { q: '风筝最后飞到哪儿？', opts: ['屋顶', '树上', '水里'], a: 1 }
    ]
  },
  {
    id: 'b57', lv: 'L6', tag: 'a_e', title: 'A Snake at the Gate', zh: '门口的蛇',
    emoji: '🐍', color: '#8CC084',
    goal: '末尾 e 不发音，a 读字母名',
    trap: '末尾的 e 不发音，但它让前面的 a 读 /eɪ/。cake 不是「卡克」，是「凯克」。',
    summary: '这一级练魔法 e（a_e）。这是英语里最划算的规则：加一个不发音的 e，前面的元音就读字母名。',
    pre: [
      { art: '🐍', en: 'snake', zh: '蛇' },
      { art: '🚪', en: 'gate', zh: '大门' },
      { art: '⏰', en: 'late', zh: '迟到' },
      { art: '🏷️', en: 'name', zh: '名字' }
    ],
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'can', 'not', 'my', 'no', 'we', 'at', 'our', 'teacher'],
    newWords: [
      { w: 'snake', zh: '蛇' },
      { w: 'gate', zh: '大门' },
      { w: 'late', zh: '迟到' },
      { w: 'name', zh: '名字' },
      { w: 'class', zh: '班级' },
      { w: 'let', zh: '让' },
      { w: 'say', zh: '说' }
    ],
    pages: [
      { art: '🐍🚪', en: 'A snake at the gate!', zh: '门口有一条蛇！' },
      { art: '👦😱', en: 'I can not get in.', zh: '我进不去了。' },
      { art: '🕐😰', en: 'I am late for class.', zh: '我上课要迟到了。' },
      { art: '🗣️🐍', en: 'I say my name.', zh: '我报上自己的名字。' },
      { art: '🐍😌', en: 'The snake lets me in.', zh: '蛇居然让我进去了。' },
      { art: '😂🐍', en: 'The snake is our teacher!', zh: '原来蛇是我们的老师！' }
    ],
    quiz: [
      { q: '门口有什么？', opts: ['一辆车', '一只狗', '一条蛇'], a: 2 },
      { q: '我为什么着急？', opts: ['天黑了', '要迟到了', '丢了东西'], a: 1 },
      { q: '蛇其实是？', opts: ['雕像', '一只宠物', '我们的老师'], a: 2 }
    ]
  },
  {
    id: 'b58', lv: 'L6', tag: 'i_e', title: 'Time to Ride', zh: '该骑车了',
    emoji: '🚲', color: '#F2B04E',
    goal: '末尾 e 不发音，i 读 /aɪ/',
    trap: 'i_e 里 i 读 /aɪ/，就是字母 I 的名字。bike 不是「比克」，是「拜克」。',
    summary: '这一级练魔法 e（i_e）。孩子容易把 i_e 还读成短音 /ɪ/，那样 bike 就变回 bick。',
    pre: [
      { art: '⏰', en: 'time', zh: '时间' },
      { art: '🚲', en: 'bike', zh: '自行车' },
      { art: '🚲', en: 'ride', zh: '骑' },
      { art: '➡️', en: 'side', zh: '一边' }
    ],
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'can', 'not', 'my', 'no', 'we', 'to'],
    newWords: [
      { w: 'time', zh: '时间' },
      { w: 'bike', zh: '自行车' },
      { w: 'ride', zh: '骑' },
      { w: 'side', zh: '一边' }
    ],
    pages: [
      { art: '🕐🚲', en: 'It is time to ride.', zh: '到骑车的时间了。' },
      { art: '🚲👦', en: 'I ride my bike.', zh: '我骑上自行车。' },
      { art: '🛤️🚲', en: 'I ride by the side.', zh: '我沿着路边骑。' },
      { art: '🐕🚲', en: 'My dog rides too!', zh: '我的狗也上车了！' },
      { art: '💨🐕', en: 'It likes the fast ride.', zh: '它喜欢这种飞快的感觉。' },
      { art: '😂🐕', en: 'But it can not stop!', zh: '可它不会刹车！' }
    ],
    quiz: [
      { q: '该做什么了？', opts: ['吃饭', '骑车', '睡觉'], a: 1 },
      { q: '谁跟我一起骑？', opts: ['我的狗', '我的朋友', '我爸爸'], a: 0 },
      { q: '狗不会做什么？', opts: ['叫', '坐着', '刹车'], a: 2 }
    ]
  },
  {
    id: 'b59', lv: 'L6', tag: 'o_e', title: 'The Bone in the Stone', zh: '石头里的骨头',
    emoji: '🦴', color: '#C8B58A',
    goal: '末尾 e 不发音，o 读 /oʊ/',
    trap: 'o_e 里 o 读 /oʊ/，就是字母 O 的名字。note 不是「诺特」，是「诺特」带滑动。',
    summary: '这一级练魔法 e（o_e）。o_e 的 /oʊ/ 要滑动，读平了就变成短音。',
    pre: [
      { art: '🦴', en: 'bone', zh: '骨头' },
      { art: '🪨', en: 'stone', zh: '石头' },
      { art: '🏠', en: 'home', zh: '家' }
    ],
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'can', 'not', 'my', 'no', 'we', 'in', 'now'],
    newWords: [
      { w: 'bone', zh: '骨头' },
      { w: 'stone', zh: '石头' },
      { w: 'home', zh: '家' },
      { w: 'hope', zh: '希望' },
      { w: 'back', zh: '回来' },
      { w: 'hide', zh: '藏' }
    ],
    pages: [
      { art: '🦴', en: 'My dog has a bone.', zh: '我的狗有一根骨头。' },
      { art: '🐕🪨', en: 'It hides it in a stone!', zh: '它把骨头藏进石头缝里！' },
      { art: '🐕😕', en: 'Now it can not get it.', zh: '现在它拿不出来了。' },
      { art: '🐕💭', en: 'It hopes to get it back.', zh: '它希望能拿回来。' },
      { art: '🏠🐕', en: 'We go home at last.', zh: '最后我们回了家。' },
      { art: '😂🦴', en: 'The bone is home too!', zh: '骨头也跟着回家了（叼在嘴里）！' }
    ],
    quiz: [
      { q: '狗把骨头藏在哪儿？', opts: ['床底', '石头缝里', '树下'], a: 1 },
      { q: '狗拿得出来吗？', opts: ['根本没藏', '立刻拿出来了', '一开始拿不出来'], a: 2 },
      { q: '最后骨头在哪儿？', opts: ['丢了', '留在石头里', '被狗带回家了'], a: 2 }
    ]
  },
  {
    id: 'b60', lv: 'L6', tag: 'u_e', title: 'A Cute Cube', zh: '可爱的小方块',
    emoji: '🧊', color: '#7FB8DE',
    goal: '末尾 e 不发音，u 读 /juː/',
    trap: 'u_e 里 u 读 /juː/，前面带一点「y」的音。cube 是「Q 布」，不是「库布」。',
    summary: '这一级练魔法 e（u_e）。/juː/ 前面有一个 /j/，孩子容易漏掉。',
    pre: [
      { art: '🐘', en: 'huge', zh: '巨大的' },
      { art: '📜', en: 'rule', zh: '规则' },
      { art: '➕', en: 'more', zh: '更多' }
    ],
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'can', 'not', 'my', 'no', 'we'],
    newWords: [
      { w: 'cute', zh: '可爱的' },
      { w: 'cube', zh: '方块' },
      { w: 'huge', zh: '巨大的' },
      { w: 'rule', zh: '规则' },
      { w: 'more', zh: '更多' }
    ],
    pages: [
      { art: '🧊', en: 'A cute cube!', zh: '一个可爱的小方块！' },
      { art: '🧊📏', en: 'It is not huge.', zh: '它一点也不大。' },
      { art: '🧊🧊', en: 'Two cubes make a box.', zh: '两个方块拼成一个盒子。' },
      { art: '🧊🧊🧊', en: 'Ten cubes! So huge!', zh: '十个方块！好大一个！' },
      { art: '📜🧊', en: 'My rule: no more cubes.', zh: '只有一条规则：不许再加了。' },
      { art: '😂🧊', en: 'But I like the huge one!', zh: '可我就喜欢那个大的！' }
    ],
    quiz: [
      { q: '小方块怎么样？', opts: ['巨大', '是圆的', '很小但可爱'], a: 2 },
      { q: '几个方块拼成盒子？', opts: ['五个', '十个', '两个'], a: 2 },
      { q: '规则是什么？', opts: ['不许再加方块', '要快点', '要安静'], a: 0 }
    ]
  },
  {
    id: 'b61', lv: 'L6', tag: 'a_e', title: 'Late for the Game', zh: '比赛迟到了',
    emoji: '⚽', color: '#7FC97F',
    goal: '末尾 e 不发音，a 读字母名',
    trap: '末尾的 e 不发音，但它让前面的 a 读 /eɪ/。cake 不是「卡克」，是「凯克」。',
    summary: '这一级练魔法 e（a_e）。这是英语里最划算的规则：加一个不发音的 e，前面的元音就读字母名。',
    pre: [
      { art: '⏰', en: 'late', zh: '迟到' },
      { art: '🏷️', en: 'name', zh: '名字' },
      { art: '🔨', en: 'make', zh: '赶；做' },
      { art: '⚽', en: 'ball', zh: '球' }
    ],
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'can', 'not', 'my', 'no', 'we', 'for'],
    newWords: [
      { w: 'late', zh: '迟到' },
      { w: 'game', zh: '比赛' },
      { w: 'name', zh: '名字' },
      { w: 'make', zh: '赶；做' },
      { w: 'ball', zh: '球' },
      { w: 'wrong', zh: '错的' }
    ],
    pages: [
      { art: '⚽🕐', en: 'We are late for the game.', zh: '我们比赛要迟到了。' },
      { art: '🏃💨', en: 'We run and run.', zh: '我们跑啊跑。' },
      { art: '🗣️📋', en: 'I say my name.', zh: '我报上名字。' },
      { art: '⚽😅', en: 'We make it at last!', zh: '我们终于赶上了！' },
      { art: '⚽🥅', en: 'I take the ball.', zh: '我抢到了球。' },
      { art: '😂⚽', en: 'It is the wrong game!', zh: '可这是另一场比赛！' }
    ],
    quiz: [
      { q: '我们为什么跑？', opts: ['下雨了', '比赛要迟到了', '狗追我们'], a: 1 },
      { q: '到了以后我做了什么？', opts: ['抢到球', '喝水', '坐下'], a: 0 },
      { q: '最后发现什么？', opts: ['走错了场地', '球丢了', '赢了'], a: 0 }
    ]
  },
  {
    id: 'b62', lv: 'L6', tag: 'o_e', title: 'The Rope and the Nose', zh: '绳子和鼻子',
    emoji: '🐘', color: '#B9C7D9',
    goal: '末尾 e 不发音，o 读 /oʊ/',
    trap: 'o_e 里 o 读 /oʊ/，就是字母 O 的名字。note 不是「诺特」，是「诺特」带滑动。',
    summary: '这一级练魔法 e（o_e）。o_e 的 /oʊ/ 要滑动，读平了就变成短音。',
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'can', 'not', 'my', 'no', 'we', 'on', 'now'],
    newWords: [
      { w: 'rope', zh: '绳子' },
      { w: 'nose', zh: '鼻子' },
      { w: 'close', zh: '近的；关' },
      { w: 'sneeze', zh: '喷嚏' },
      { w: 'move', zh: '移动' }
    ],
    pages: [
      { art: '🪢🐘', en: 'A rope on a nose.', zh: '鼻子上挂着根绳子。' },
      { art: '🐘👃', en: 'The nose is big.', zh: '这鼻子可真大。' },
      { art: '🐘📏', en: 'Come close. Not so close!', zh: '靠近一点。别太近！' },
      { art: '🪢💨', en: 'The rope moves!', zh: '绳子晃来晃去。' },
      { art: '🐘🤧', en: 'A big sneeze!', zh: '一个大喷嚏！' },
      { art: '😂🪢', en: 'Now the rope is on me!', zh: '绳子跑到我身上了！' }
    ],
    quiz: [
      { q: '绳子挂在哪儿？', opts: ['尾巴上', '鼻子上', '耳朵上'], a: 1 },
      { q: '鼻子怎么样？', opts: ['很短', '很小', '很大'], a: 2 },
      { q: '打喷嚏后绳子跑到哪儿？', opts: ['水里', '我身上', '树上'], a: 1 }
    ]
  },
  {
    id: 'b63', lv: 'L6', tag: 'i_e / a_e', title: 'Nine Pigs', zh: '九只小猪',
    emoji: '🐖', color: '#F2A0A0',
    goal: '末尾 e 不发音，a 读字母名',
    trap: '末尾的 e 不发音，但它让前面的 a 读 /eɪ/。cake 不是「卡克」，是「凯克」。',
    summary: '这一级练魔法 e（a_e）。这是英语里最划算的规则：加一个不发音的 e，前面的元音就读字母名。',
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'can', 'not', 'my', 'no', 'we', 'in'],
    newWords: [
      { w: 'nine', zh: '九' },
      { w: 'like', zh: '喜欢' },
      { w: 'ride', zh: '骑' },
      { w: 'side', zh: '一边' },
      { w: 'hit', zh: '撞' },
      { w: 'line', zh: '一排' },
      { w: 'pile', zh: '一堆' }
    ],
    pages: [
      { art: '🐖🐖', en: 'Nine pigs in a line.', zh: '九只小猪排成一排。' },
      { art: '🐖🚲', en: 'They like to ride.', zh: '它们喜欢骑车。' },
      { art: '🚲💨', en: 'One pig rides fast.', zh: '一只小猪骑得飞快。' },
      { art: '🐖🛤️', en: 'It rides by my side.', zh: '它骑在我旁边。' },
      { art: '🌳🚲', en: 'Then it hits a tree!', zh: '然后它撞到树上！' },
      { art: '😂🐖', en: 'Nine pigs in a pile!', zh: '九只小猪叠成一堆！' }
    ],
    quiz: [
      { q: '有几只小猪？', opts: ['三只', '九只', '五只'], a: 1 },
      { q: '小猪喜欢做什么？', opts: ['游泳', '骑车', '爬树'], a: 1 },
      { q: '最后小猪怎么了？', opts: ['睡着了', '飞走了', '撞树叠成一堆'], a: 2 }
    ]
  },
  {
    id: 'b64', lv: 'L6', tag: 'a_e / i_e', title: 'Wake Up!', zh: '快起床',
    emoji: '⏰', color: '#F5C26B',
    goal: '末尾 e 不发音，a 读字母名',
    trap: '末尾的 e 不发音，但它让前面的 a 读 /eɪ/。cake 不是「卡克」，是「凯克」。',
    summary: '这一级练魔法 e（a_e）。这是英语里最划算的规则：加一个不发音的 e，前面的元音就读字母名。',
    pre: [
      { art: '⏰', en: 'late', zh: '迟的' },
      { art: '⏰', en: 'time', zh: '时间' },
      { art: '🏠', en: 'home', zh: '家' },
      { art: '🏫', en: 'school', zh: '学校' }
    ],
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'can', 'not', 'my', 'no', 'we', 'to'],
    newWords: [
      { w: 'wake', zh: '醒来' },
      { w: 'late', zh: '迟的' },
      { w: 'time', zh: '时间' },
      { w: 'home', zh: '家' },
      { w: 'school', zh: '学校' }
    ],
    pages: [
      { art: '⏰😴', en: 'Wake up! It is late!', zh: '快起床！要迟到了！' },
      { art: '😴🛏️', en: 'I can not wake up.', zh: '我实在起不来。' },
      { art: '🕐😱', en: 'It is time to go!', zh: '该出发了！' },
      { art: '🏃💨', en: 'I run all the way home.', zh: '我一路跑回家。' },
      { art: '🏠😮', en: 'No one is home.', zh: '家里一个人也没有。' },
      { art: '😂📅', en: 'It is not a school day!', zh: '原来今天是休息日！' }
    ],
    quiz: [
      { q: '为什么被叫起床？', opts: ['以为迟到了', '要吃早饭', '有人来了'], a: 0 },
      { q: '我跑去了哪儿？', opts: ['公园', '学校', '家'], a: 2 },
      { q: '最后发现什么？', opts: ['今天不用上学', '家里没人', '走错了'], a: 0 }
    ]
  },
  {
    id: 'b65', lv: 'L6', tag: 'u_e / o_e', title: 'The Huge Stone', zh: '巨大的石头',
    emoji: '🪨', color: '#A9B7C6',
    goal: '末尾 e 不发音，o 读 /oʊ/',
    trap: 'o_e 里 o 读 /oʊ/，就是字母 O 的名字。note 不是「诺特」，是「诺特」带滑动。',
    summary: '这一级练魔法 e（o_e）。o_e 的 /oʊ/ 要滑动，读平了就变成短音。',
    pre: [
      { art: '🐘', en: 'huge', zh: '巨大的' },
      { art: '🪨', en: 'stone', zh: '石头' },
      { art: '📜', en: 'rule', zh: '规则' },
      { art: '➡️', en: 'move', zh: '移动' }
    ],
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'can', 'not', 'my', 'no', 'we', 'in', 'will', 'car'],
    newWords: [
      { w: 'huge', zh: '巨大的' },
      { w: 'stone', zh: '石头' },
      { w: 'rule', zh: '规则' },
      { w: 'hope', zh: '希望' },
      { w: 'move', zh: '移动' },
      { w: 'push', zh: '推' }
    ],
    pages: [
      { art: '🪨', en: 'A huge stone in the road.', zh: '路上有块巨大的石头。' },
      { art: '🚗🪨', en: 'No car can get by.', zh: '车子都过不去。' },
      { art: '👥🪨', en: 'We hope to move it.', zh: '我们希望能挪开它。' },
      { art: '💪🪨', en: 'Push! Push! It will not move.', zh: '推！推！它就是不动。' },
      { art: '📜🪨', en: 'The rule is: go by the side.', zh: '规则是：绕道走。' },
      { art: '😂🪨', en: 'The stone is still there!', zh: '石头还在那儿！' }
    ],
    quiz: [
      { q: '路上有什么？', opts: ['一棵树', '一块大石头', '一辆车'], a: 1 },
      { q: '我们想做什么？', opts: ['搬回家', '挪开石头', '坐上去'], a: 1 },
      { q: '石头挪开了吗？', opts: ['碎掉了', '挪开了', '没有'], a: 2 }
    ]
  },
  {
    id: 'b66', lv: 'L6', tag: 'o_e', title: 'Hope for the Bone', zh: '盼望的骨头',
    emoji: '🐕', color: '#C8B58A',
    goal: '末尾 e 不发音，o 读 /oʊ/',
    trap: 'o_e 里 o 读 /oʊ/，就是字母 O 的名字。note 不是「诺特」，是「诺特」带滑动。',
    summary: '这一级练魔法 e（o_e）。o_e 的 /oʊ/ 要滑动，读平了就变成短音。',
    pre: [
      { art: '🦴', en: 'bone', zh: '骨头' },
      { art: '🏠', en: 'home', zh: '家' },
      { art: '🚪', en: 'door', zh: '门' }
    ],
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'can', 'not', 'my', 'no', 'we', 'on'],
    newWords: [
      { w: 'hope', zh: '希望' },
      { w: 'bone', zh: '骨头' },
      { w: 'home', zh: '家' },
      { w: 'nose', zh: '鼻子' },
      { w: 'door', zh: '门' },
      { w: 'faster', zh: '更快' }
    ],
    pages: [
      { art: '🐕💭', en: 'My dog hopes for a bone.', zh: '我的狗盼着一根骨头。' },
      { art: '🐕💤', en: 'It sleeps by the door.', zh: '它睡在门口。' },
      { art: '🐈🐕', en: 'My cat has a bone!', zh: '我的猫居然有根骨头！' },
      { art: '🐕👃', en: 'The dog puts its nose up.', zh: '狗把鼻子凑过去。' },
      { art: '🐈😼', en: 'The cat runs home.', zh: '猫叼着骨头跑回家。' },
      { art: '😂🐕', en: 'The dog runs faster!', zh: '狗追得更快！' }
    ],
    quiz: [
      { q: '狗盼着什么？', opts: ['一根骨头', '一个球', '一顿饭'], a: 0 },
      { q: '谁先拿到骨头？', opts: ['我', '猫', '狗'], a: 1 },
      { q: '最后谁追谁？', opts: ['狗追猫', '猫追狗', '都在跑'], a: 0 }
    ]
  },
  {
    id: 'b67', lv: 'L7', tag: 'ar', title: 'The Star in the Jar', zh: '罐子里的星星',
    emoji: '⭐', color: '#F5C26B',
    goal: '/ɑːr/ 卷舌',
    trap: 'ar 要卷舌，但舌尖不要顶到上颚。car 不要读成「卡」，结尾要有 r 的色彩。',
    summary: '这一级练 ar。中文的「儿化」和英语的 r 不一样，容易卷过头或完全不卷。',
    pre: [
      { art: '⭐', en: 'star', zh: '星星' },
      { art: '🫙', en: 'jar', zh: '玻璃罐' },
      { art: '🌑', en: 'dark', zh: '黑的' }
    ],
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'can', 'not', 'my', 'no', 'we', 'in', 'just', 'now'],
    newWords: [
      { w: 'star', zh: '星星' },
      { w: 'jar', zh: '玻璃罐' },
      { w: 'dark', zh: '黑的' },
      { w: 'far', zh: '远的' }
    ],
    pages: [
      { art: '⭐🫙', en: 'A star in a jar!', zh: '罐子里装着一颗星星！' },
      { art: '🌙🫙', en: 'It is dark and far.', zh: '它又黑又远。' },
      { art: '✨🫙', en: 'The star is not far now.', zh: '现在星星不远了。' },
      { art: '😴⭐', en: 'It is my lamp now.', zh: '它把我的房间照亮了。' },
      { art: '🌅⭐', en: 'Then the sun comes up.', zh: '然后太阳升起来了。' },
      { art: '😂🫙', en: 'The star is just a bug!', zh: '原来是只萤火虫！' }
    ],
    quiz: [
      { q: '罐子里是什么？', opts: ['太阳', '月亮', '看起来像星星的东西'], a: 2 },
      { q: '它把哪儿照亮了？', opts: ['船上', '院子', '我的房间'], a: 2 },
      { q: '最后发现那是什么？', opts: ['真的星星', '一只小虫（萤火虫）', '一块糖'], a: 1 }
    ]
  },
  {
    id: 'b68', lv: 'L7', tag: 'ir / ar', title: 'A Bird in the Park', zh: '公园里的小鸟',
    emoji: '🐦', color: '#7FC97F',
    goal: '/ɑːr/ 卷舌',
    trap: 'ar 要卷舌，但舌尖不要顶到上颚。car 不要读成「卡」，结尾要有 r 的色彩。',
    summary: '这一级练 ar。中文的「儿化」和英语的 r 不一样，容易卷过头或完全不卷。',
    pre: [
      { art: '🐦', en: 'bird', zh: '小鸟' },
      { art: '🏞️', en: 'park', zh: '公园' },
      { art: '🐤', en: 'chirp', zh: '啁啾叫' },
      { art: '1️⃣', en: 'first', zh: '第一' }
    ],
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'can', 'not', 'my', 'no', 'we', 'in', 'now'],
    newWords: [
      { w: 'bird', zh: '小鸟' },
      { w: 'park', zh: '公园' },
      { w: 'chirp', zh: '啁啾叫' },
      { w: 'first', zh: '第一' },
      { w: 'give', zh: '给' },
      { w: 'listen', zh: '听' },
      { w: 'more', zh: '更多' }
    ],
    pages: [
      { art: '🐦🌳', en: 'A bird in the park.', zh: '公园里的一只小鸟。' },
      { art: '🎵🐦', en: 'It chirps and chirps.', zh: '它一直啁啾地叫。' },
      { art: '🌅🐦', en: 'It chirps first at sun up.', zh: '太阳一出来它最先叫。' },
      { art: '👦🐦', en: 'I sit and listen.', zh: '我坐着听它唱。' },
      { art: '🍞🐦', en: 'I give it my cake.', zh: '我把面包分给它。' },
      { art: '😂🐦', en: 'Now it chirps for more!', zh: '结果它叫得更欢了——还要！' }
    ],
    quiz: [
      { q: '公园里有什么？', opts: ['一只小鸟', '一只猫', '一条狗'], a: 0 },
      { q: '小鸟什么时候叫？', opts: ['不叫', '晚上叫', '太阳出来时最先叫'], a: 2 },
      { q: '我给了小鸟什么？', opts: ['帽子', '蛋糕', '水'], a: 1 }
    ]
  },
  {
    id: 'b69', lv: 'L7', tag: 'or', title: 'Corn on the Fork', zh: '叉子上的玉米',
    emoji: '🌽', color: '#F2B04E',
    goal: '/ɔːr/ 圆唇加卷舌',
    trap: 'or 先把嘴唇收圆，再卷舌。fork 不要读成「福克」。',
    summary: '这一级练 or。/ɔːr/ 是圆唇 + 卷舌两个动作叠在一起。',
    pre: [
      { art: '🌽', en: 'corn', zh: '玉米' },
      { art: '🍴', en: 'fork', zh: '叉子' },
      { art: '📏', en: 'short', zh: '短的' },
      { art: '🌪️', en: 'storm', zh: '暴风雨' }
    ],
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'can', 'not', 'my', 'no', 'we', 'on'],
    newWords: [
      { w: 'corn', zh: '玉米' },
      { w: 'fork', zh: '叉子' },
      { w: 'short', zh: '短的' },
      { w: 'storm', zh: '暴风雨' },
      { w: 'hard', zh: '猛烈的' },
      { w: 'left', zh: '剩下' }
    ],
    pages: [
      { art: '🌽🍴', en: 'Corn on a fork!', zh: '叉子上的玉米！' },
      { art: '🌽😋', en: 'I like hot corn.', zh: '我喜欢热乎乎的玉米。' },
      { art: '🌬️🌽', en: 'A storm is on the way.', zh: '暴风雨要来了。' },
      { art: '💨🌽', en: 'The wind is short and hard.', zh: '风一阵一阵地刮。' },
      { art: '🌽💨', en: 'My corn is in the storm!', zh: '我的玉米被吹走了！' },
      { art: '😂🍴', en: 'Just the fork is left.', zh: '只剩叉子还在手里。' }
    ],
    quiz: [
      { q: '叉子上有什么？', opts: ['苹果', '面包', '玉米'], a: 2 },
      { q: '什么要来了？', opts: ['雪', '暴风雨', '客人'], a: 1 },
      { q: '最后剩下什么？', opts: ['玉米', '什么也没有', '叉子'], a: 2 }
    ]
  },
  {
    id: 'b70', lv: 'L7', tag: 'ir', title: 'The First Day', zh: '第一天',
    emoji: '🎒', color: '#8FB8DE',
    goal: '/ɜːr/ 像「饿」加卷舌',
    trap: 'ir 读 /ɜːr/，像「饿」拖长再加卷舌。bird 不要读成「伯德」。',
    summary: '这一级练 ir。/ɜːr/ 在中文里没有，最接近的是「饿」加卷舌。',
    pre: [
      { art: '👧', en: 'girl', zh: '女孩' },
      { art: '👕', en: 'shirt', zh: '衬衫' },
      { art: '👗', en: 'skirt', zh: '裙子' },
      { art: '😊', en: 'smile', zh: '微笑' }
    ],
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'can', 'not', 'my', 'no', 'we', 'to', 'have', 'her'],
    newWords: [
      { w: 'first', zh: '第一' },
      { w: 'girl', zh: '女孩' },
      { w: 'shirt', zh: '衬衫' },
      { w: 'skirt', zh: '裙子' },
      { w: 'next', zh: '旁边' },
      { w: 'same', zh: '相同的' },
      { w: 'smile', zh: '微笑' },
      { w: 'talk', zh: '说话' }
    ],
    pages: [
      { art: '🎒👧', en: 'It is my first day.', zh: '这是我第一天上学。' },
      { art: '👕👗', en: 'I have a shirt and a skirt.', zh: '我有一件衬衫和一条裙子。' },
      { art: '👧🏫', en: 'The girl next to me smiles.', zh: '旁边的女孩对我笑。' },
      { art: '🤝👧', en: 'We sit and talk.', zh: '我们坐在一起聊天。' },
      { art: '📚👧', en: 'It is her first day too.', zh: '她也是第一天来。' },
      { art: '😂👗', en: 'We have the same skirt!', zh: '我们穿了一模一样的裙子！' }
    ],
    quiz: [
      { q: '这是谁的第一天？', opts: ['老师', '我', '只有我一个人'], a: 1 },
      { q: '我穿了什么？', opts: ['T 恤', '外套和裤子', '衬衫和裙子'], a: 2 },
      { q: '最后发现什么巧合？', opts: ['两人裙子一样', '住同一个楼', '同一天生日'], a: 0 }
    ]
  },
  {
    id: 'b71', lv: 'L7', tag: 'ar / or', title: 'A Dark Storm', zh: '黑沉沉的暴风雨',
    emoji: '⛈️', color: '#7B8FA8',
    goal: '/ɑːr/ 卷舌',
    trap: 'ar 要卷舌，但舌尖不要顶到上颚。car 不要读成「卡」，结尾要有 r 的色彩。',
    summary: '这一级练 ar。中文的「儿化」和英语的 r 不一样，容易卷过头或完全不卷。',
    pre: [
      { art: '🌑', en: 'dark', zh: '黑' },
      { art: '🌪️', en: 'storm', zh: '暴风雨' },
      { art: '💨', en: 'fast', zh: '快地' }
    ],
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'can', 'not', 'my', 'no', 'we', 'in', 'off'],
    newWords: [
      { w: 'dark', zh: '黑' },
      { w: 'storm', zh: '暴风雨' },
      { w: 'hard', zh: '猛烈的；困难的' },
      { w: 'far', zh: '远的' },
      { w: 'gone', zh: '不见了' },
      { w: 'fast', zh: '快地' }
    ],
    pages: [
      { art: '⛈️', en: 'A dark storm is far off.', zh: '远处来了一场黑色的暴风雨。' },
      { art: '🌬️🌧️', en: 'The wind hits hard.', zh: '风刮得很猛。' },
      { art: '🏠💡', en: 'We sit in the dark.', zh: '我们坐在黑漆漆的屋里。' },
      { art: '🕯️🏠', en: 'One small lamp is on.', zh: '只点着一盏小灯。' },
      { art: '🌧️💨', en: 'The storm is on and on.', zh: '风雨一直不停。' },
      { art: '😂☀️', en: 'Then it is gone. So fast!', zh: '然后它就走了——原来并不远！' }
    ],
    quiz: [
      { q: '天气怎么样？', opts: ['晴天', '暴风雨', '下雪'], a: 1 },
      { q: '我们坐在哪里？', opts: ['外面', '黑着灯的屋里', '车里'], a: 1 },
      { q: '最后天气怎么样？', opts: ['更大了', '下雪了', '雨停了'], a: 2 }
    ]
  },
  {
    id: 'b72', lv: 'L7', tag: 'or / ar', title: 'The Horse and the Cart', zh: '马和车',
    emoji: '🐴', color: '#C8B58A',
    goal: '/ɑːr/ 卷舌',
    trap: 'ar 要卷舌，但舌尖不要顶到上颚。car 不要读成「卡」，结尾要有 r 的色彩。',
    summary: '这一级练 ar。中文的「儿化」和英语的 r 不一样，容易卷过头或完全不卷。',
    pre: [
      { art: '🐴', en: 'horse', zh: '马' },
      { art: '🛒', en: 'cart', zh: '大车' },
      { art: '💪', en: 'hard', zh: '吃力' }
    ],
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'can', 'not', 'my', 'no', 'we', 'on'],
    newWords: [
      { w: 'horse', zh: '马' },
      { w: 'cart', zh: '大车' },
      { w: 'hard', zh: '吃力' },
      { w: 'far', zh: '远' },
      { w: 'full', zh: '满的' },
      { w: 'itself', zh: '它自己' },
      { w: 'pull', zh: '拉' },
      { w: 'rest', zh: '休息' },
      { w: 'roll', zh: '滚' }
    ],
    pages: [
      { art: '🐴🛒', en: 'A horse and a cart.', zh: '一匹马和一辆大车。' },
      { art: '🐴📦', en: 'The cart is full.', zh: '车上装得满满的。' },
      { art: '🐴💪', en: 'The horse pulls hard.', zh: '马使劲地拉。' },
      { art: '🛤️🐴', en: 'It is far, far off.', zh: '路还很远很远。' },
      { art: '😴🐴', en: 'The horse stops for a rest.', zh: '马停下来歇一会儿。' },
      { art: '😂🛒', en: 'The cart rolls on by itself!', zh: '大车自己滚下坡去了！' }
    ],
    quiz: [
      { q: '谁在拉车？', opts: ['人', '牛', '马'], a: 2 },
      { q: '车怎么样？', opts: ['坏了', '是空的', '装满了'], a: 2 },
      { q: '马休息时发生了什么？', opts: ['车自己滚走了', '车翻了', '什么也没发生'], a: 0 }
    ]
  },
  {
    id: 'b73', lv: 'L7', tag: 'ir', title: 'The Girl in the Red Skirt', zh: '红裙子女孩',
    emoji: '👗', color: '#E5707E',
    goal: '/ɜːr/ 像「饿」加卷舌',
    trap: 'ir 读 /ɜːr/，像「饿」拖长再加卷舌。bird 不要读成「伯德」。',
    summary: '这一级练 ir。/ɜːr/ 在中文里没有，最接近的是「饿」加卷舌。',
    pre: [
      { art: '👧', en: 'girl', zh: '女孩' },
      { art: '👗', en: 'skirt', zh: '裙子' },
      { art: '👕', en: 'shirt', zh: '衬衫' }
    ],
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'can', 'not', 'my', 'no', 'we', 'in', 'her', 'now'],
    newWords: [
      { w: 'girl', zh: '女孩' },
      { w: 'skirt', zh: '裙子' },
      { w: 'shirt', zh: '衬衫' },
      { w: 'third', zh: '第三' },
      { w: 'class', zh: '班级' },
      { w: 'paint', zh: '画画' }
    ],
    pages: [
      { art: '👗👧', en: 'A girl in a red skirt.', zh: '一个穿红裙子的女孩。' },
      { art: '🏫👧', en: 'She is in my class.', zh: '她在我班上。' },
      { art: '🪑👧', en: 'She is the third girl.', zh: '她坐在第三排。' },
      { art: '👕👗', en: 'Her shirt is red too.', zh: '她的衬衫也是红的。' },
      { art: '🎨👗', en: 'She likes to paint.', zh: '她喜欢画画。' },
      { art: '😂🎨', en: 'Now her skirt is red and green!', zh: '现在她的裙子红一块蓝一块！' }
    ],
    quiz: [
      { q: '女孩穿什么？', opts: ['蓝裤子', '红裙子', '黄外套'], a: 1 },
      { q: '她是第几个女孩？', opts: ['第三个', '最后一个', '第一个'], a: 0 },
      { q: '她喜欢做什么？', opts: ['唱歌', '画画', '跑步'], a: 1 }
    ]
  },
  {
    id: 'b74', lv: 'L7', tag: 'ar', title: 'A Hard Card', zh: '难做的卡片',
    emoji: '🎴', color: '#B99BE0',
    goal: '/ɑːr/ 卷舌',
    trap: 'ar 要卷舌，但舌尖不要顶到上颚。car 不要读成「卡」，结尾要有 r 的色彩。',
    summary: '这一级练 ar。中文的「儿化」和英语的 r 不一样，容易卷过头或完全不卷。',
    pre: [
      { art: '⭐', en: 'star', zh: '星星' },
      { art: '🏞️', en: 'park', zh: '公园' },
      { art: '👵', en: 'grandma', zh: '奶奶' }
    ],
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'can', 'not', 'my', 'no', 'we', 'for', 'her'],
    newWords: [
      { w: 'hard', zh: '难的' },
      { w: 'card', zh: '卡片' },
      { w: 'star', zh: '星星' },
      { w: 'park', zh: '公园' },
      { w: 'cut', zh: '剪' },
      { w: 'grandma', zh: '奶奶' },
      { w: 'hair', zh: '头发' }
    ],
    pages: [
      { art: '🎴✂️', en: 'I make a card.', zh: '我在做一张卡片。' },
      { art: '⭐🎴', en: 'A star on the card.', zh: '卡片上画一颗星星。' },
      { art: '😕🎴', en: 'It is hard to cut.', zh: '剪起来真不容易。' },
      { art: '🌳🎴', en: 'I take it to the park.', zh: '我把它带到公园。' },
      { art: '👵😊', en: 'I give it to my grandma.', zh: '我送给奶奶。' },
      { art: '😂🎴', en: 'She has a star in her hair!', zh: '她头上也戴着颗星星！' }
    ],
    quiz: [
      { q: '我在做什么？', opts: ['写信', '画画', '做卡片'], a: 2 },
      { q: '卡片上有什么？', opts: ['星星', '花', '月亮'], a: 0 },
      { q: '卡片送给谁？', opts: ['老师', '奶奶', '朋友'], a: 1 }
    ]
  },
  {
    id: 'b75', lv: 'L7', tag: 'or', title: 'Short and Tall', zh: '矮和高',
    emoji: '🦒', color: '#F2B04E',
    goal: '/ɔːr/ 圆唇加卷舌',
    trap: 'or 先把嘴唇收圆，再卷舌。fork 不要读成「福克」。',
    summary: '这一级练 or。/ɔːr/ 是圆唇 + 卷舌两个动作叠在一起。',
    pre: [
      { art: '📏', en: 'short', zh: '矮的；短的' },
      { art: '🐴', en: 'horse', zh: '马' },
      { art: '🌽', en: 'corn', zh: '玉米' },
      { art: '📏', en: 'tall', zh: '高的' }
    ],
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'can', 'not', 'my', 'no', 'we', 'in'],
    newWords: [
      { w: 'short', zh: '矮的；短的' },
      { w: 'horse', zh: '马' },
      { w: 'corn', zh: '玉米' },
      { w: 'bad', zh: '坏的' },
      { w: 'tall', zh: '高的' }
    ],
    pages: [
      { art: '🐴🐔', en: 'A horse and a hen.', zh: '一匹马和一只母鸡。' },
      { art: '📏🐴', en: 'The horse is tall.', zh: '马很高。' },
      { art: '📏🐔', en: 'The hen is short.', zh: '母鸡很矮。' },
      { art: '🌽🐔', en: 'The hen can get the corn.', zh: '母鸡能啄到玉米。' },
      { art: '🌽🐴', en: 'The horse can not get it.', zh: '马却够不着。' },
      { art: '😂🐔', en: 'Short is not bad at all!', zh: '矮一点也不吃亏！' }
    ],
    quiz: [
      { q: '谁高？', opts: ['母鸡', '一样高', '马'], a: 2 },
      { q: '谁能吃到玉米？', opts: ['母鸡', '马', '都吃不到'], a: 0 },
      { q: '故事告诉我们什么？', opts: ['要吃玉米', '高才好', '矮也有好处'], a: 2 }
    ]
  },
  {
    id: 'b76', lv: 'L7', tag: 'ir', title: 'Chirp, Chirp!', zh: '唧唧唧',
    emoji: '🐤', color: '#F5C26B',
    goal: '/ɜːr/ 像「饿」加卷舌',
    trap: 'ir 读 /ɜːr/，像「饿」拖长再加卷舌。bird 不要读成「伯德」。',
    summary: '这一级练 ir。/ɜːr/ 在中文里没有，最接近的是「饿」加卷舌。',
    pre: [
      { art: '🐤', en: 'chirp', zh: '唧唧叫' },
      { art: '🐦', en: 'bird', zh: '鸟' },
      { art: '1️⃣', en: 'first', zh: '先' }
    ],
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'can', 'not', 'my', 'no', 'we', 'in', 'now'],
    newWords: [
      { w: 'chirp', zh: '唧唧叫' },
      { w: 'bird', zh: '鸟' },
      { w: 'first', zh: '先' },
      { w: 'dirt', zh: '泥土' },
      { w: 'fall', zh: '掉' }
    ],
    pages: [
      { art: '🐤', en: 'Chirp, chirp, chirp!', zh: '唧唧，唧唧，唧唧！' },
      { art: '🐤🪺', en: 'A bird in a nest.', zh: '窝里有只小鸟。' },
      { art: '🐛🐤', en: 'It chirps for a bug.', zh: '它叫着要虫子吃。' },
      { art: '🐤🪱', en: 'First a big bug!', zh: '先来一条大虫子！' },
      { art: '🐤💧', en: 'Then it falls in the dirt.', zh: '然后它掉进泥里。' },
      { art: '😂🐤', en: 'Now it chirps for a bath!', zh: '这下它叫着要洗澡了！' }
    ],
    quiz: [
      { q: '小鸟在哪儿？', opts: ['树上', '地上', '窝里'], a: 2 },
      { q: '小鸟想吃什么？', opts: ['虫子', '玉米', '面包'], a: 0 },
      { q: '掉进泥里后它想要什么？', opts: ['洗澡', '玩耍', '睡觉'], a: 0 }
    ]
  },
  {
    id: 'b77', lv: 'L7', tag: 'ar', title: 'The Farm at Night', zh: '夜里的农场',
    emoji: '🌙', color: '#8FB8DE',
    goal: '/ɑːr/ 卷舌',
    trap: 'ar 要卷舌，但舌尖不要顶到上颚。car 不要读成「卡」，结尾要有 r 的色彩。',
    summary: '这一级练 ar。中文的「儿化」和英语的 r 不一样，容易卷过头或完全不卷。',
    pre: [
      { art: '🌾', en: 'farm', zh: '农场' },
      { art: '🌑', en: 'dark', zh: '黑' },
      { art: '⭐', en: 'star', zh: '星星' },
      { art: '🏞️', en: 'park', zh: '停放' }
    ],
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'can', 'not', 'my', 'no', 'we', 'at', 'night', 'by'],
    newWords: [
      { w: 'farm', zh: '农场' },
      { w: 'dark', zh: '黑' },
      { w: 'star', zh: '星星' },
      { w: 'park', zh: '停放' },
      { w: 'asleep', zh: '睡着的' },
      { w: 'half', zh: '一半' },
      { w: 'barn', zh: '谷仓' }
    ],
    pages: [
      { art: '🌙🚜', en: 'The farm is dark at night.', zh: '夜里农场黑漆漆的。' },
      { art: '⭐🌌', en: 'Stars are up in the dark.', zh: '星星挂在天上。' },
      { art: '🚜🌙', en: 'The cart is by the barn.', zh: '大车停在车棚里。' },
      { art: '🐴😴', en: 'The horse is half asleep.', zh: '马半睡着。' },
      { art: '🐔🌙', en: 'A hen is not asleep.', zh: '有只母鸡还醒着。' },
      { art: '😂🐔', en: 'It is first up in the dark!', zh: '它起得比谁都早——天还黑着呢！' }
    ],
    quiz: [
      { q: '夜里的农场怎么样？', opts: ['很吵', '很黑', '很亮'], a: 1 },
      { q: '大车停在哪儿？', opts: ['田里', '路上', '谷仓旁'], a: 2 },
      { q: '谁还没睡？', opts: ['马', '一只母鸡', '全部'], a: 1 }
    ]
  },
  {
    id: 'b78', lv: 'L7', tag: 'ir / th', title: 'Thirty Birds', zh: '三十只鸟',
    emoji: '🕊️', color: '#A9B7C6',
    goal: '/θ/ 舌尖放在齿间',
    trap: 'th 中文里没有。舌尖轻轻放在上下齿之间吹气，不要读成 s，也不要读成 f。think 不是「辛克」。',
    summary: '这一级练 th。这是中国学生最难的一个音，常见错误是读成 s（think→sink）或 f（three→free）。',
    pre: [
      { art: '🐦', en: 'bird', zh: '鸟' },
      { art: '1️⃣', en: 'first', zh: '第一' },
      { art: '🪰', en: 'fly', zh: '飞' }
    ],
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'can', 'not', 'my', 'no', 'we', 'in', 'loud'],
    newWords: [
      { w: 'thirty', zh: '三十' },
      { w: 'bird', zh: '鸟' },
      { w: 'first', zh: '第一' },
      { w: 'third', zh: '第三' },
      { w: 'fly', zh: '飞' },
      { w: 'come', zh: '来' }
    ],
    pages: [
      { art: '🕊️🕊️', en: 'Thirty birds in a tree.', zh: '树上三十只鸟。' },
      { art: '🎵🕊️', en: 'The first one sings.', zh: '第一只开始唱。' },
      { art: '🎶🕊️', en: 'The third one sings too!', zh: '第三只跟着唱。' },
      { art: '🎼🕊️', en: 'Soon all thirty sing!', zh: '很快三十只一起唱！' },
      { art: '👂🎶', en: 'Such a loud song!', zh: '好响亮的合唱！' },
      { art: '😂🕊️', en: 'Then they all fly off!', zh: '然后一哄而散！' }
    ],
    quiz: [
      { q: '树上有几只鸟？', opts: ['三只', '三十只', '十三只'], a: 1 },
      { q: '谁最先唱？', opts: ['全部一起', '第三只', '第一只'], a: 2 },
      { q: '最后鸟做了什么？', opts: ['睡着了', '继续唱', '全飞走了'], a: 2 }
    ]
  },
  {
    id: 'b79', lv: 'L8', tag: '视觉词 where', title: 'Where Is My Hat?', zh: '我的帽子在哪',
    emoji: '🎩', color: '#8FB8DE',
    goal: '整体认读，不按规则拼',
    trap: '这些词不按拼读规则走，要整体记住形状和声音。看到就整词读出来，不要逐字母拆。',
    summary: '这一级练视觉词。它们出现频率极高但不合规则，只能整体认读，读多了就自动化了。',
    pre: [
      { art: '🎩', en: 'hat', zh: '帽子' },
      { art: '👀', en: 'look', zh: '看' },
      { art: '🪑', en: 'chair', zh: '椅子' }
    ],
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'can', 'not', 'my', 'no', 'we', 'where', 'door'],
    newWords: [
      { w: 'hat', zh: '帽子' },
      { w: 'look', zh: '看' },
      { w: 'under', zh: '在……下面' },
      { w: 'chair', zh: '椅子' }
    ],
    pages: [
      { art: '🎩❌', en: 'Where is my hat?', zh: '我的帽子在哪？' },
      { art: '👀🛏️', en: 'I look on the bed.', zh: '我在床上找。' },
      { art: '👀🪑', en: 'I look under the chair.', zh: '我在椅子下面找。' },
      { art: '👀🚪', en: 'I look by the door.', zh: '我在门边找。' },
      { art: '😕🎩', en: 'It is not there.', zh: '哪儿都没有。' },
      { art: '😂🐱', en: 'My cat has it on!', zh: '原来我的猫戴着它！' }
    ],
    quiz: [
      { q: '我在找什么？', opts: ['我的书', '我的帽子', '我的鞋'], a: 1 },
      { q: '我找了哪些地方？', opts: ['床上、椅子下、门边', '厨房', '学校、公园'], a: 0 },
      { q: '帽子最后在哪儿？', opts: ['门外', '猫头上', '床下'], a: 1 }
    ]
  },
  {
    id: 'b80', lv: 'L8', tag: '视觉词 what / was', title: 'What Was That?', zh: '那是什么声音',
    emoji: '🌙', color: '#7B8FA8',
    goal: '整体认读，不按规则拼',
    trap: '这些词不按拼读规则走，要整体记住形状和声音。看到就整词读出来，不要逐字母拆。',
    summary: '这一级练视觉词。它们出现频率极高但不合规则，只能整体认读，读多了就自动化了。',
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'can', 'not', 'my', 'no', 'we', 'what', 'was', 'that', 'in', 'be', 'bit', 'with'],
    newWords: [
      { w: 'sound', zh: '声音' },
      { w: 'dark', zh: '黑' },
      { w: 'scared', zh: '害怕的' },
      { w: 'brave', zh: '勇敢的' }
    ],
    pages: [
      { art: '🌙🏠', en: 'It is dark in my room.', zh: '我的房间黑漆漆的。' },
      { art: '👂❓', en: 'What was that sound?', zh: '刚才那是什么声音？' },
      { art: '😨🛏️', en: 'I am a bit scared.', zh: '我有点害怕。' },
      { art: '💪😤', en: 'But I can be brave.', zh: '不过我可以勇敢一点。' },
      { art: '🔦🚪', en: 'I go out with a lamp.', zh: '我提着灯走出去。' },
      { art: '😂🐈', en: 'It was my cat!', zh: '原来一直是我的猫！' }
    ],
    quiz: [
      { q: '房间里怎么样？', opts: ['很亮', '很黑', '很吵'], a: 1 },
      { q: '我听到什么？', opts: ['有人叫我', '一个声音', '音乐'], a: 1 },
      { q: '最后发现是谁？', opts: ['风', '我的猫', '小偷'], a: 1 }
    ]
  },
  {
    id: 'b81', lv: 'L8', tag: '视觉词 they / come', title: 'They Come at Night', zh: '它们夜里来',
    emoji: '🦇', color: '#8E8E9A',
    goal: '整体认读，不按规则拼',
    trap: '这些词不按拼读规则走，要整体记住形状和声音。看到就整词读出来，不要逐字母拆。',
    summary: '这一级练视觉词。它们出现频率极高但不合规则，只能整体认读，读多了就自动化了。',
    pre: [
      { art: '🌑', en: 'dark', zh: '黑' },
      { art: '🪽', en: 'wing', zh: '翅膀' },
      { art: '🤫', en: 'quiet', zh: '安静的' },
      { art: '😴', en: 'sleep', zh: '睡' }
    ],
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'can', 'not', 'my', 'no', 'we', 'they', 'come', 'at', 'night', 'out', 'their', 'now'],
    newWords: [
      { w: 'dark', zh: '黑' },
      { w: 'wing', zh: '翅膀' },
      { w: 'quiet', zh: '安静的' },
      { w: 'sleep', zh: '睡' },
      { w: 'those', zh: '那些' },
      { w: 'very', zh: '非常' }
    ],
    pages: [
      { art: '🌙🦇', en: 'They come out at night.', zh: '它们夜里出来。' },
      { art: '🦇🌑', en: 'The dark is their time.', zh: '黑夜是它们的时间。' },
      { art: '🪽🦇', en: 'Look at those wings!', zh: '看那些翅膀！' },
      { art: '🤫🦇', en: 'They are very quiet.', zh: '它们非常安静。' },
      { art: '🌅🦇', en: 'Then the sun comes up.', zh: '然后太阳出来了。' },
      { art: '😂💤', en: 'Now they all sleep!', zh: '现在它们全睡了！' }
    ],
    quiz: [
      { q: '它们什么时候出来？', opts: ['早上', '中午', '夜里'], a: 2 },
      { q: '它们有什么？', opts: ['翅膀', '长尾巴', '角'], a: 0 },
      { q: '太阳出来后它们做什么？', opts: ['唱歌', '继续飞', '睡觉'], a: 2 }
    ]
  },
  {
    id: 'b82', lv: 'L8', tag: '视觉词 some', title: 'Some Cake and Jam', zh: '蛋糕和果酱',
    emoji: '🍰', color: '#F2A0A0',
    goal: '整体认读，不按规则拼',
    trap: '这些词不按拼读规则走，要整体记住形状和声音。看到就整词读出来，不要逐字母拆。',
    summary: '这一级练视觉词。它们出现频率极高但不合规则，只能整体认读，读多了就自动化了。',
    pre: [
      { art: '🎂', en: 'cake', zh: '蛋糕' },
      { art: '🍯', en: 'jam', zh: '果酱' },
      { art: '🍽️', en: 'plate', zh: '盘子' }
    ],
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'can', 'not', 'my', 'no', 'we', 'some', 'on', 'have', 'with', 'whole', 'now'],
    newWords: [
      { w: 'cake', zh: '蛋糕' },
      { w: 'jam', zh: '果酱' },
      { w: 'plate', zh: '盘子' },
      { w: 'share', zh: '分享' },
      { w: 'only', zh: '只' },
      { w: 'whole', zh: '整个' }
    ],
    pages: [
      { art: '🍰🍯', en: 'Some cake and jam!', zh: '一些蛋糕和果酱！' },
      { art: '🍽️🍰', en: 'I have it on a plate.', zh: '我把它放在盘子里。' },
      { art: '🐕👀', en: 'My dog wants some.', zh: '我的狗也想要。' },
      { art: '🤝🐕', en: 'I can share with it.', zh: '我可以和它分着吃。' },
      { art: '🐕💨', en: 'It takes the whole cake!', zh: '它把整个蛋糕叼走了！' },
      { art: '😂🍯', en: 'Now only jam is left.', zh: '现在只剩果酱了。' }
    ],
    quiz: [
      { q: '盘子里有什么？', opts: ['苹果', '面包和牛奶', '蛋糕和果酱'], a: 2 },
      { q: '谁想要一些？', opts: ['我的狗', '我朋友', '我的猫'], a: 0 },
      { q: '最后剩下什么？', opts: ['蛋糕', '果酱', '什么都没有'], a: 1 }
    ]
  },
  {
    id: 'b83', lv: 'L8', tag: '视觉词 here / there', title: 'Here and There', zh: '这里和那里',
    emoji: '🧭', color: '#7FC8A9',
    goal: '整体认读，不按规则拼',
    trap: '这些词不按拼读规则走，要整体记住形状和声音。看到就整词读出来，不要逐字母拆。',
    summary: '这一级练视觉词。它们出现频率极高但不合规则，只能整体认读，读多了就自动化了。',
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'can', 'not', 'my', 'no', 'we', 'here', 'there', 'look', 'with'],
    newWords: [
      { w: 'map', zh: '地图' },
      { w: 'mark', zh: '标记' },
      { w: 'path', zh: '小路' },
      { w: 'find', zh: '找到' }
    ],
    pages: [
      { art: '🗺️', en: 'A map with a mark.', zh: '一张画着标记的地图。' },
      { art: '📍🗺️', en: 'Here is the mark.', zh: '标记在这里。' },
      { art: '👀🛤️', en: 'There is a path.', zh: '那里有一条小路。' },
      { art: '🚶🌳', en: 'We look here and there.', zh: '我们到处找。' },
      { art: '💎🌿', en: 'We find it at last!', zh: '我们终于找到了！' },
      { art: '😂🪨', en: 'It is just a stone!', zh: '原来只是块石头！' }
    ],
    quiz: [
      { q: '地图上有什么？', opts: ['一棵树', '一只鸟', '一个标记'], a: 2 },
      { q: '小路在哪里？', opts: ['河边', '山顶', '标记旁边'], a: 2 },
      { q: '最后找到的是什么？', opts: ['宝石', '一块石头', '箱子'], a: 1 }
    ]
  },
  {
    id: 'b84', lv: 'L8', tag: '视觉词 look', title: 'Look at the Moon', zh: '看月亮',
    emoji: '🌕', color: '#8FB8DE',
    goal: '整体认读，不按规则拼',
    trap: '这些词不按拼读规则走，要整体记住形状和声音。看到就整词读出来，不要逐字母拆。',
    summary: '这一级练视觉词。它们出现频率极高但不合规则，只能整体认读，读多了就自动化了。',
    pre: [
      { art: '🌙', en: 'moon', zh: '月亮' },
      { art: '✨', en: 'bright', zh: '明亮的' },
      { art: '🌌', en: 'sky', zh: '天空' }
    ],
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'can', 'not', 'my', 'no', 'we', 'look', 'at', 'up', 'so', 'with'],
    newWords: [
      { w: 'moon', zh: '月亮' },
      { w: 'round', zh: '圆的' },
      { w: 'bright', zh: '明亮的' },
      { w: 'sky', zh: '天空' },
      { w: 'wide', zh: '宽的' }
    ],
    pages: [
      { art: '🌕', en: 'Look at the moon!', zh: '看那月亮！' },
      { art: '🌕✨', en: 'It is so round and bright.', zh: '它又圆又亮。' },
      { art: '🌌👦', en: 'The sky is dark and wide.', zh: '天空又黑又宽。' },
      { art: '🔭👦', en: 'I look up with my glass.', zh: '我举起望远镜看。' },
      { art: '🌕🔍', en: 'It has marks on it!', zh: '上面有好多斑纹！' },
      { art: '😂🐕', en: 'My dog looks up too!', zh: '我的狗也抬头看！' }
    ],
    quiz: [
      { q: '月亮什么样？', opts: ['又小又暗', '又圆又亮', '是方的'], a: 1 },
      { q: '我用什么看月亮？', opts: ['望远镜', '镜子', '眼镜'], a: 0 },
      { q: '谁也抬头看？', opts: ['我的猫', '我爸爸', '我的狗'], a: 2 }
    ]
  },
  {
    id: 'b85', lv: 'L8', tag: '视觉词 have', title: 'I Have a Wish', zh: '我有一个愿望',
    emoji: '🌟', color: '#F5C26B',
    goal: '整体认读，不按规则拼',
    trap: '这些词不按拼读规则走，要整体记住形状和声音。看到就整词读出来，不要逐字母拆。',
    summary: '这一级练视觉词。它们出现频率极高但不合规则，只能整体认读，读多了就自动化了。',
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'can', 'not', 'my', 'no', 'we', 'have', 'for', 'do', 'bright'],
    newWords: [
      { w: 'wish', zh: '愿望' },
      { w: 'star', zh: '星星' },
      { w: 'night', zh: '夜晚' }
    ],
    pages: [
      { art: '🌟👦', en: 'I have a wish for the star.', zh: '我向星星许了一个愿。' },
      { art: '🌙⭐', en: 'It is a bright night.', zh: '夜里星星很亮。' },
      { art: '🙏⭐', en: 'I wish and wish.', zh: '我许了又许。' },
      { art: '💭🐕', en: 'Do you have a wish too?', zh: '你也想要一个愿望吗？' },
      { art: '🐕🌟', en: 'My dog has one!', zh: '我的狗也有一个！' },
      { art: '😂🦴', en: 'Its wish is a big bone!', zh: '它的愿望是一根大骨头！' }
    ],
    quiz: [
      { q: '我向谁许愿？', opts: ['月亮', '星星', '太阳'], a: 1 },
      { q: '夜里怎么样？', opts: ['下雨', '星星很亮', '很冷'], a: 1 },
      { q: '狗的愿望是什么？', opts: ['睡觉', '一根大骨头', '一个球'], a: 1 }
    ]
  },
  {
    id: 'b86', lv: 'L8', tag: '视觉词 said', title: 'Said the Cat', zh: '猫说',
    emoji: '🐈', color: '#F2B04E',
    goal: '整体认读，不按规则拼',
    trap: '这些词不按拼读规则走，要整体记住形状和声音。看到就整词读出来，不要逐字母拆。',
    summary: '这一级练视觉词。它们出现频率极高但不合规则，只能整体认读，读多了就自动化了。',
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'can', 'not', 'my', 'no', 'we', 'said', 'to', 'me', 'you', 'with', 'now'],
    newWords: [
      { w: 'cat', zh: '猫' },
      { w: 'hat', zh: '帽子' },
      { w: 'sit', zh: '坐' },
      { w: 'nap', zh: '小睡' }
    ],
    pages: [
      { art: '🐈💬', en: '"Sit with me," said the cat.', zh: '“坐我旁边，”猫说。' },
      { art: '🪑🐈', en: 'I sit on the mat.', zh: '我坐在垫子上。' },
      { art: '🎩🐈', en: '"Not with that hat," said the cat.', zh: '“别戴那顶帽子，”猫说。' },
      { art: '😕🎩', en: 'I take my hat off.', zh: '我把帽子摘下来。' },
      { art: '😴🐈', en: '"Now a nap," said the cat.', zh: '“现在睡一觉，”猫说。' },
      { art: '😂🐈', en: 'It naps on my hat!', zh: '它睡在我的帽子上！' }
    ],
    quiz: [
      { q: '猫让我做什么？', opts: ['带它出去', '坐在它旁边', '喂它'], a: 1 },
      { q: '猫不喜欢什么？', opts: ['垫子', '我坐着', '我戴帽子'], a: 2 },
      { q: '最后猫睡在哪儿？', opts: ['床上', '我的帽子上', '垫子上'], a: 1 }
    ]
  },
  {
    id: 'b87', lv: 'L8', tag: '视觉词 one / two', title: 'One, Two, Three', zh: '一二三',
    emoji: '🔢', color: '#B99BE0',
    goal: '整体认读，不按规则拼',
    trap: '这些词不按拼读规则走，要整体记住形状和声音。看到就整词读出来，不要逐字母拆。',
    summary: '这一级练视觉词。它们出现频率极高但不合规则，只能整体认读，读多了就自动化了。',
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'can', 'not', 'my', 'no', 'we', 'one', 'two', 'three', 'then', 'counting'],
    newWords: [
      { w: 'count', zh: '数' },
      { w: 'step', zh: '步' },
      { w: 'jump', zh: '跳' },
      { w: 'spin', zh: '转' }
    ],
    pages: [
      { art: '🔢👦', en: 'I can count to three.', zh: '我能数到三。' },
      { art: '1️⃣🚶', en: 'One step. Two steps.', zh: '一步。两步。' },
      { art: '3️⃣🤸', en: 'Three! Then I jump.', zh: '三！然后我跳。' },
      { art: '🌀🤸', en: 'I jump and spin.', zh: '我边跳边转。' },
      { art: '😵🌀', en: 'One, two, three... flop!', zh: '一、二、三……扑通！' },
      { art: '😂🌱', en: 'Counting is hard on grass!', zh: '在草地上数数真难！' }
    ],
    quiz: [
      { q: '我能数到几？', opts: ['三', '一百', '十'], a: 0 },
      { q: '数完三我做什么？', opts: ['跳', '跑', '坐'], a: 0 },
      { q: '最后怎么了？', opts: ['摔在草地上', '赢了比赛', '睡着了'], a: 0 }
    ]
  },
  {
    id: 'b88', lv: 'L8', tag: '视觉词 come / see', title: 'Come and See', zh: '来看呀',
    emoji: '👀', color: '#7FC97F',
    goal: '整体认读，不按规则拼',
    trap: '这些词不按拼读规则走，要整体记住形状和声音。看到就整词读出来，不要逐字母拆。',
    summary: '这一级练视觉词。它们出现频率极高但不合规则，只能整体认读，读多了就自动化了。',
    pre: [
      { art: '🌻', en: 'garden', zh: '花园' },
      { art: '🌱', en: 'seed', zh: '种子' },
      { art: '📏', en: 'tall', zh: '高的' }
    ],
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'can', 'not', 'my', 'no', 'we', 'come', 'see', 'and', 'what', 'be', 'grows', 'now'],
    newWords: [
      { w: 'garden', zh: '花园' },
      { w: 'grow', zh: '生长' },
      { w: 'seed', zh: '种子' },
      { w: 'tall', zh: '高的' },
      { w: 'weed', zh: '野草' }
    ],
    pages: [
      { art: '🌱👦', en: 'Come and see my garden!', zh: '来看我的花园！' },
      { art: '🌱📏', en: 'My seed can grow.', zh: '我的种子会发芽。' },
      { art: '🌿📈', en: 'It grows and grows.', zh: '它长了又长。' },
      { art: '🌳😮', en: 'Now it is so tall!', zh: '现在它好高！' },
      { art: '❓🌳', en: 'What can it be?', zh: '它会是什么呢？' },
      { art: '😂🌻', en: 'Just a big weed!', zh: '原来是棵大野草！' }
    ],
    quiz: [
      { q: '我种了什么？', opts: ['一颗种子', '一朵花', '一棵树'], a: 0 },
      { q: '它长得怎么样？', opts: ['又高又大', '没长', '枯了'], a: 0 },
      { q: '最后发现是什么？', opts: ['大树', '一棵野草', '向日葵'], a: 1 }
    ]
  },
  {
    id: 'b89', lv: 'L8', tag: '视觉词 was', title: 'Was It a Bug?', zh: '那是只虫吗',
    emoji: '🐛', color: '#8CC084',
    goal: '整体认读，不按规则拼',
    trap: '这些词不按拼读规则走，要整体记住形状和声音。看到就整词读出来，不要逐字母拆。',
    summary: '这一级练视觉词。它们出现频率极高但不合规则，只能整体认读，读多了就自动化了。',
    pre: [
      { art: '🐛', en: 'bug', zh: '小虫' },
      { art: '🧱', en: 'wall', zh: '墙' },
      { art: '⚫', en: 'spot', zh: '斑点' }
    ],
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'can', 'not', 'my', 'no', 'we', 'was', 'what', 'on', 'so', 'now'],
    newWords: [
      { w: 'bug', zh: '小虫' },
      { w: 'wall', zh: '墙' },
      { w: 'small', zh: '小的' },
      { w: 'spot', zh: '斑点' },
      { w: 'moved', zh: '移动（过去式）' }
    ],
    pages: [
      { art: '🐛🧱', en: 'A spot was on the wall.', zh: '墙上有个小点。' },
      { art: '👀❓', en: 'What was it?', zh: '那是什么呢？' },
      { art: '🔍🧱', en: 'It was so small.', zh: '它太小了。' },
      { art: '👣🐛', en: 'Then it moved!', zh: '然后它动了！' },
      { art: '🐛😮', en: 'It was a bug!', zh: '原来是一只虫子！' },
      { art: '😂🧱', en: 'Now it is on me!', zh: '现在它爬到我身上了！' }
    ],
    quiz: [
      { q: '墙上有什么？', opts: ['一个小点', '一只猫', '一幅画'], a: 0 },
      { q: '那个小点怎么样？', opts: ['会发光', '很大', '非常小'], a: 2 },
      { q: '最后小虫在哪儿？', opts: ['墙上', '我身上', '地上'], a: 1 }
    ]
  },
  {
    id: 'b90', lv: 'L9', tag: '综合', title: 'The Best Day', zh: '最好的一天',
    emoji: '☀️', color: '#F5C26B',
    goal: '把学过的规则混起来用',
    trap: '读之前先看每个词的元音：是短音、长音，还是魔法 e？判断完再开口。',
    summary: '这一级是综合复习。句子里混了多种规则，要先判断再读，不能凭感觉。',
    pre: [
      { art: '🏞️', en: 'park', zh: '公园' },
      { art: '🪁', en: 'kite', zh: '风筝' },
      { art: '☀️', en: 'sun', zh: '太阳' }
    ],
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'can', 'not', 'my', 'no', 'we', 'was', 'day', 'all', 'with', 'high'],
    newWords: [
      { w: 'best', zh: '最好的' },
      { w: 'park', zh: '公园' },
      { w: 'kite', zh: '风筝' },
      { w: 'sun', zh: '太阳' },
      { w: 'had', zh: '有（过去式）' },
      { w: 'went', zh: '去（过去式）' },
      { w: 'rained', zh: '下雨（过去式）' },
      { w: 'once', zh: '一下子' },
      { w: 'lunch', zh: '午饭' },
      { w: 'warm', zh: '暖和的' }
    ],
    pages: [
      { art: '☀️👦', en: 'It was the best day.', zh: '那是最好的一个日子。' },
      { art: '🌳🏞️', en: 'We went to the park.', zh: '我们去了公园。' },
      { art: '🪁💨', en: 'My kite went up high.', zh: '我的风筝飞得很高。' },
      { art: '☀️😎', en: 'The sun was warm.', zh: '太阳暖暖的。' },
      { art: '🍎🥪', en: 'We had lunch on the grass.', zh: '我们在草地上吃午饭。' },
      { art: '🌧️😅', en: 'Then it rained all at once!', zh: '然后突然下起雨来！' },
      { art: '😂🏠', en: 'Still the best day!', zh: '不过还是最好的一天！' }
    ],
    quiz: [
      { q: '我们去了哪儿？', opts: ['公园', '学校', '海边'], a: 0 },
      { q: '风筝飞得怎么样？', opts: ['很高', '没飞起来', '很低'], a: 0 },
      { q: '后来天气怎么了？', opts: ['起风了', '下雨了', '下雪了'], a: 1 }
    ]
  },
  {
    id: 'b91', lv: 'L9', tag: '综合', title: 'A Wish for the King', zh: '给国王的愿望',
    emoji: '👑', color: '#C8A2E0',
    goal: '把学过的规则混起来用',
    trap: '读之前先看每个词的元音：是短音、长音，还是魔法 e？判断完再开口。',
    summary: '这一级是综合复习。句子里混了多种规则，要先判断再读，不能凭感觉。',
    pre: [
      { art: '👑', en: 'king', zh: '国王' },
      { art: '🌟', en: 'wish', zh: '愿望' },
      { art: '🏅', en: 'gold', zh: '金子' },
      { art: '✋', en: 'had', zh: '有（过去式）' }
    ],
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'can', 'not', 'my', 'no', 'we', 'for', 'said', 'was', 'so', 'bread', 'he', 'his'],
    newWords: [
      { w: 'king', zh: '国王' },
      { w: 'wish', zh: '愿望' },
      { w: 'gold', zh: '金子' },
      { w: 'share', zh: '分享' },
      { w: 'had', zh: '有（过去式）' },
      { w: 'went', zh: '去（过去式）' },
      { w: 'wished', zh: '许愿（过去式）' },
      { w: 'came', zh: '来（过去式）' },
      { w: 'once', zh: '一下子' },
      { w: 'warm', zh: '暖和的' }
    ],
    pages: [
      { art: '👑💭', en: 'The king had a wish.', zh: '国王有一个愿望。' },
      { art: '💰👑', en: 'He wished for gold.', zh: '他想要金子。' },
      { art: '🏰✨', en: 'Gold came all at once.', zh: '金子一下子全来了。' },
      { art: '😕👑', en: 'But gold is not warm.', zh: '可金子不暖和。' },
      { art: '🍞👑', en: 'He wished to share his bread.', zh: '他宁愿把面包分给大家。' },
      { art: '😂🍞', en: 'So the gold went away!', zh: '于是金子全没了！' }
    ],
    quiz: [
      { q: '国王许了什么愿？', opts: ['想要马', '想要面包', '想要金子'], a: 2 },
      { q: '得到金子后他觉得怎么样？', opts: ['很开心', '金子不暖和', '很富有'], a: 1 },
      { q: '最后金子怎么了？', opts: ['变多了', '被埋起来', '消失了'], a: 2 }
    ]
  },
  {
    id: 'b92', lv: 'L9', tag: '综合', title: 'The Lost Bone', zh: '丢了的骨头',
    emoji: '🦴', color: '#C8B58A',
    goal: '把学过的规则混起来用',
    trap: '读之前先看每个词的元音：是短音、长音，还是魔法 e？判断完再开口。',
    summary: '这一级是综合复习。句子里混了多种规则，要先判断再读，不能凭感觉。',
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'can', 'not', 'my', 'no', 'we', 'was', 'where', 'said', 'on'],
    newWords: [
      { w: 'bone', zh: '骨头' },
      { w: 'lost', zh: '丢的' },
      { w: 'dug', zh: '挖（过去式）' },
      { w: 'had', zh: '有（过去式）' }
    ],
    pages: [
      { art: '🐕😕', en: 'My dog lost its bone.', zh: '我的狗把骨头丢了。' },
      { art: '🐕🕳️', en: 'It dug and dug.', zh: '它挖了又挖。' },
      { art: '👀🌱', en: 'Where was the bone?', zh: '骨头到底在哪呢？' },
      { art: '🐈🦴', en: 'My cat had it!', zh: '原来被我的猫拿走了！' },
      { art: '🐕🐈', en: '"Give it back," said my dog.', zh: '“还给我，”我的狗说。' },
      { art: '😂🦴', en: 'The cat just sat on it!', zh: '猫干脆坐在骨头上不还！' }
    ],
    quiz: [
      { q: '狗丢了什么？', opts: ['球', '骨头', '项圈'], a: 1 },
      { q: '狗做了什么找骨头？', opts: ['挖土', '叫', '跑'], a: 0 },
      { q: '骨头最后在谁那儿？', opts: ['狗', '猫', '我'], a: 1 }
    ]
  },
  {
    id: 'b93', lv: 'L9', tag: '综合', title: 'Rain on the Roof', zh: '屋顶上的雨',
    emoji: '🌧️', color: '#8FB8DE',
    goal: '把学过的规则混起来用',
    trap: '读之前先看每个词的元音：是短音、长音，还是魔法 e？判断完再开口。',
    summary: '这一级是综合复习。句子里混了多种规则，要先判断再读，不能凭感觉。',
    pre: [
      { art: '🌧️', en: 'rain', zh: '雨' },
      { art: '🔊', en: 'sound', zh: '声音' },
      { art: '😴', en: 'sleep', zh: '睡' }
    ],
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'can', 'not', 'my', 'no', 'we', 'was', 'on', 'all', 'night', 'could', 'now', 'quiet'],
    newWords: [
      { w: 'rain', zh: '雨' },
      { w: 'roof', zh: '屋顶' },
      { w: 'sound', zh: '声音' },
      { w: 'sleep', zh: '睡' },
      { w: 'made', zh: '发出（过去式）' },
      { w: 'new', zh: '新的' },
      { w: 'soft', zh: '轻柔的' }
    ],
    pages: [
      { art: '🌧️🏠', en: 'Rain on the roof all night.', zh: '雨在屋顶上下了一整夜。' },
      { art: '👂💧', en: 'It was a soft sound.', zh: '那声音轻轻的。' },
      { art: '🛏️😴', en: 'I could sleep with it.', zh: '我听着它睡着了。' },
      { art: '🌅💧', en: 'Then the rain was gone.', zh: '然后雨停了。' },
      { art: '🤫😕', en: 'It was too quiet now.', zh: '现在又太安静了。' },
      { art: '😂🐈', en: 'My cat made a new sound!', zh: '我的猫弄出了新声音！' }
    ],
    quiz: [
      { q: '雨下在哪里？', opts: ['树上', '屋顶上', '窗户上'], a: 1 },
      { q: '雨声怎么样？', opts: ['没有声音', '轻轻的', '很响'], a: 1 },
      { q: '雨停后我觉得怎么样？', opts: ['太安静了', '很高兴', '很冷'], a: 0 }
    ]
  },
  {
    id: 'b94', lv: 'L9', tag: '综合', title: 'The Thirsty Crow', zh: '口渴的乌鸦',
    emoji: '🐦‍⬛', color: '#7B8FA8',
    goal: '把学过的规则混起来用',
    trap: '读之前先看每个词的元音：是短音、长音，还是魔法 e？判断完再开口。',
    summary: '这一级是综合复习。句子里混了多种规则，要先判断再读，不能凭感觉。',
    pre: [
      { art: '🐦‍⬛', en: 'crow', zh: '乌鸦' },
      { art: '🚶', en: 'came', zh: '来（过去式）' },
      { art: '✋', en: 'had', zh: '有（过去式）' },
      { art: '💧', en: 'water', zh: '水' }
    ],
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'can', 'not', 'my', 'no', 'we', 'was', 'but', 'so', 'then', 'found', 'low'],
    newWords: [
      { w: 'crow', zh: '乌鸦' },
      { w: 'thirsty', zh: '口渴的' },
      { w: 'clever', zh: '聪明的' },
      { w: 'came', zh: '来（过去式）' },
      { w: 'had', zh: '有（过去式）' },
      { w: 'dropped', zh: '丢下（过去式）' },
      { w: 'water', zh: '水' }
    ],
    pages: [
      { art: '🐦‍⬛☀️', en: 'A crow was thirsty.', zh: '一只乌鸦口渴了。' },
      { art: '🏺💧', en: 'It found a jar with water.', zh: '它找到一个装水的罐子。' },
      { art: '🐦‍⬛📏', en: 'But the water was too low.', zh: '可水面太低了。' },
      { art: '🪨💭', en: 'It had a clever wish.', zh: '它想出一个聪明的办法。' },
      { art: '🪨🏺', en: 'It dropped stones in.', zh: '它把石子一颗颗丢进去。' },
      { art: '💧🐦‍⬛', en: 'The water came up!', zh: '水升上来了！' },
      { art: '😂🐦‍⬛', en: 'Clever crow, full jar!', zh: '聪明的乌鸦，满满一罐水！' }
    ],
    quiz: [
      { q: '乌鸦为什么发愁？', opts: ['迷路了', '口渴', '饿了'], a: 1 },
      { q: '罐子里的水怎么样？', opts: ['很多', '是脏的', '太低了够不着'], a: 2 },
      { q: '乌鸦想了什么办法？', opts: ['把罐子推倒', '丢石子让水升高', '叫别的鸟'], a: 1 }
    ]
  },
  {
    id: 'b95', lv: 'L9', tag: '综合', title: 'My Little Seed', zh: '我的小种子',
    emoji: '🌱', color: '#7FC97F',
    goal: '把学过的规则混起来用',
    trap: '读之前先看每个词的元音：是短音、长音，还是魔法 e？判断完再开口。',
    summary: '这一级是综合复习。句子里混了多种规则，要先判断再读，不能凭感觉。',
    pre: [
      { art: '🌱', en: 'seed', zh: '种子' },
      { art: '💧', en: 'water', zh: '水' },
      { art: '📏', en: 'tall', zh: '高的' }
    ],
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'can', 'not', 'my', 'no', 'we', 'was', 'so', 'day', 'then', 'now'],
    newWords: [
      { w: 'seed', zh: '种子' },
      { w: 'water', zh: '水' },
      { w: 'mud', zh: '泥' },
      { w: 'tall', zh: '高的' },
      { w: 'got', zh: '变得（过去式）' },
      { w: 'gave', zh: '给（过去式）' }
    ],
    pages: [
      { art: '🌱🤲', en: 'A seed so small.', zh: '我的小种子小小的。' },
      { art: '🕳️🌱', en: 'I put it in the mud.', zh: '我把它放进泥里。' },
      { art: '💧🌱', en: 'I gave it water.', zh: '我每天给它浇水。' },
      { art: '🌱📈', en: 'Then it got tall.', zh: '然后它开始长大。' },
      { art: '🌿😮', en: 'It is tall now!', zh: '它长了又长！' },
      { art: '🌳😄', en: 'My seed is a tree!', zh: '现在它比我还高了！' }
    ],
    quiz: [
      { q: '种子一开始怎么样？', opts: ['很小', '是坏的', '很大'], a: 0 },
      { q: '我给了它什么？', opts: ['阳光', '水', '肥料'], a: 1 },
      { q: '最后它长成什么样？', opts: ['还是很小', '比我还高', '枯了'], a: 1 }
    ]
  },
  {
    id: 'b96', lv: 'L9', tag: '综合', title: 'The Night Train', zh: '夜里的火车',
    emoji: '🚂', color: '#6FB1D9',
    goal: '把学过的规则混起来用',
    trap: '读之前先看每个词的元音：是短音、长音，还是魔法 e？判断完再开口。',
    summary: '这一级是综合复习。句子里混了多种规则，要先判断再读，不能凭感觉。',
    pre: [
      { art: '🚂', en: 'train', zh: '火车' },
      { art: '🌑', en: 'dark', zh: '黑的' },
      { art: '⛰️', en: 'hill', zh: '小山' }
    ],
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'can', 'not', 'my', 'no', 'we', 'was', 'night', 'all', 'on', 'could', 'wheels', 'now'],
    newWords: [
      { w: 'train', zh: '火车' },
      { w: 'dark', zh: '黑的' },
      { w: 'hill', zh: '小山' },
      { w: 'still', zh: '仍然' },
      { w: 'ran', zh: '跑（过去式）' },
      { w: 'sang', zh: '唱（过去式）' }
    ],
    pages: [
      { art: '🚂🌙', en: 'The train ran all night.', zh: '火车跑了一整夜。' },
      { art: '🚂🌑', en: 'It was dark on the hill.', zh: '山上黑漆漆的。' },
      { art: '👀🪟', en: 'I could not sleep.', zh: '我一点也睡不着。' },
      { art: '🎵🚂', en: 'The wheels sang.', zh: '车轮唱起了歌。' },
      { art: '🌅🚂', en: 'Then the sun came up.', zh: '然后太阳升起来了。' },
      { art: '😴🚂', en: 'Now the train is still!', zh: '火车停了，我却睡着了！' }
    ],
    quiz: [
      { q: '火车跑了多久？', opts: ['一整天', '一整夜', '一小时'], a: 1 },
      { q: '我睡得着吗？', opts: ['睡了又醒', '睡得很好', '睡不着'], a: 2 },
      { q: '天亮后火车怎么样？', opts: ['开更快了', '坏了', '停了'], a: 2 }
    ]
  },
  {
    id: 'b97', lv: 'L9', tag: '综合', title: 'A Home for a Snail', zh: '蜗牛的家',
    emoji: '🐌', color: '#C8B58A',
    goal: '把学过的规则混起来用',
    trap: '读之前先看每个词的元音：是短音、长音，还是魔法 e？判断完再开口。',
    summary: '这一级是综合复习。句子里混了多种规则，要先判断再读，不能凭感觉。',
    pre: [
      { art: '🐌', en: 'snail', zh: '蜗牛' },
      { art: '🏠', en: 'home', zh: '家' },
      { art: '🐚', en: 'shell', zh: '壳' }
    ],
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'can', 'not', 'my', 'no', 'we', 'was', 'for', 'so', 'with', 'now'],
    newWords: [
      { w: 'snail', zh: '蜗牛' },
      { w: 'home', zh: '家' },
      { w: 'shell', zh: '壳' },
      { w: 'carry', zh: '背着' },
      { w: 'came', zh: '来（过去式）' },
      { w: 'had', zh: '有（过去式）' }
    ],
    pages: [
      { art: '🐌', en: 'A snail was on the path.', zh: '小路上有一只蜗牛。' },
      { art: '🏠🐌', en: 'It had a home with it.', zh: '它随身带着一个家。' },
      { art: '🐚👀', en: 'Its shell was so small.', zh: '它的壳那么小。' },
      { art: '🐌🚶', en: 'It had to carry it all day.', zh: '它整天都得背着它。' },
      { art: '🌧️🐌', en: 'Then the rain came.', zh: '然后下起雨来。' },
      { art: '😂🐌', en: 'Now it is glad for its shell!', zh: '这下它可庆幸有壳了！' }
    ],
    quiz: [
      { q: '蜗牛的家在哪儿？', opts: ['树下', '就在它身上', '石头下'], a: 1 },
      { q: '它的壳怎么样？', opts: ['很大', '是空的', '很小'], a: 2 },
      { q: '下雨后它为什么高兴？', opts: ['壳能挡雨', '可以喝水', '能跑得快'], a: 0 }
    ]
  },
  {
    id: 'b98', lv: 'L9', tag: '综合', title: 'The Big Storm', zh: '大风暴',
    emoji: '🌪️', color: '#7B8FA8',
    goal: '把学过的规则混起来用',
    trap: '读之前先看每个词的元音：是短音、长音，还是魔法 e？判断完再开口。',
    summary: '这一级是综合复习。句子里混了多种规则，要先判断再读，不能凭感觉。',
    pre: [
      { art: '🌪️', en: 'storm', zh: '风暴' },
      { art: '🌬️', en: 'wind', zh: '风' },
      { art: '💪', en: 'hard', zh: '猛烈' }
    ],
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'can', 'not', 'my', 'no', 'we', 'was', 'all', 'then', 'so', 'scared'],
    newWords: [
      { w: 'storm', zh: '风暴' },
      { w: 'wind', zh: '风' },
      { w: 'hard', zh: '猛烈' },
      { w: 'safe', zh: '安全的' },
      { w: 'bit', zh: '有点' },
      { w: 'done', zh: '结束' },
      { w: 'were', zh: '是（过去式）' }
    ],
    pages: [
      { art: '🌪️🏠', en: 'A big storm was on us.', zh: '一场大风暴来了。' },
      { art: '🌬️💨', en: 'The wind hit so hard.', zh: '风刮得太猛了。' },
      { art: '🏠🕯️', en: 'We sat in the dark.', zh: '我们坐在黑屋里。' },
      { art: '😨👦', en: 'I was a bit scared.', zh: '我有点害怕。' },
      { art: '🤗🏠', en: 'We were all safe here.', zh: '我们在这儿都很安全。' },
      { art: '🌅😄', en: 'Then it was all done!', zh: '然后风暴就过去了！' }
    ],
    quiz: [
      { q: '外面怎么了？', opts: ['很热', '下雪', '刮大风暴'], a: 2 },
      { q: '风暴里我们怎么样？', opts: ['跑出去了', '都安全', '很害怕地哭'], a: 1 },
      { q: '最后风暴怎么样？', opts: ['更大了', '一直不停', '过去了'], a: 2 }
    ]
  },
  {
    id: 'b99', lv: 'L9', tag: '综合', title: 'Three Little Bugs', zh: '三只小虫',
    emoji: '🐞', color: '#8CC084',
    goal: '把学过的规则混起来用',
    trap: '读之前先看每个词的元音：是短音、长音，还是魔法 e？判断完再开口。',
    summary: '这一级是综合复习。句子里混了多种规则，要先判断再读，不能凭感觉。',
    pre: [
      { art: '🐛', en: 'bug', zh: '小虫' },
      { art: '🍃', en: 'leaf', zh: '叶子' },
      { art: '🪰', en: 'fly', zh: '飞' },
      { art: '🚶', en: 'came', zh: '来（过去式）' }
    ],
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'can', 'not', 'my', 'no', 'we', 'three', 'on', 'was', 'then'],
    newWords: [
      { w: 'bug', zh: '小虫' },
      { w: 'leaf', zh: '叶子' },
      { w: 'crawl', zh: '爬' },
      { w: 'fly', zh: '飞' },
      { w: 'came', zh: '来（过去式）' },
      { w: 'over', zh: '到处' },
      { w: 'little', zh: '小小的' }
    ],
    pages: [
      { art: '🐞🐞🐞', en: 'Three little bugs on a leaf.', zh: '叶子上有三只小虫。' },
      { art: '🍃🐞', en: 'They crawl all over it.', zh: '它们在叶子上爬来爬去。' },
      { art: '🌧️🐞', en: 'Then the rain came.', zh: '然后下雨了。' },
      { art: '🍃💧', en: 'The leaf was so wet.', zh: '叶子全湿了。' },
      { art: '🪽🐞', en: 'It was time to fly!', zh: '该飞走了！' },
      { art: '😂🐞', en: 'Three bugs, one wet leaf!', zh: '三只小虫，一片湿叶子！' }
    ],
    quiz: [
      { q: '小虫在哪儿？', opts: ['叶子上', '水里', '树上'], a: 0 },
      { q: '下雨后叶子怎么样？', opts: ['干了', '湿了', '飞了'], a: 1 },
      { q: '最后小虫做什么？', opts: ['飞走', '睡觉', '继续爬'], a: 0 }
    ]
  },
  {
    id: 'b100', lv: 'L9', tag: '综合', title: 'A Book for Me', zh: '送给我的书',
    emoji: '📖', color: '#B99BE0',
    goal: '把学过的规则混起来用',
    trap: '读之前先看每个词的元音：是短音、长音，还是魔法 e？判断完再开口。',
    summary: '这一级是综合复习。句子里混了多种规则，要先判断再读，不能凭感觉。',
    sight: ['the', 'a', 'is', 'and', 'it', 'I', 'can', 'not', 'my', 'no', 'we', 'for', 'me', 'was', 'all'],
    newWords: [
      { w: 'book', zh: '书' },
      { w: 'read', zh: '读' },
      { w: 'page', zh: '页' },
      { w: 'word', zh: '字；单词' },
      { w: 'every', zh: '每一个' }
    ],
    pages: [
      { art: '📖👦', en: 'This book is for me!', zh: '这本书是给我的！' },
      { art: '👀📄', en: 'I can read it all.', zh: '我全都能读下来。' },
      { art: '📄🔤', en: 'Every word is on a page.', zh: '每个词都在页上。' },
      { art: '😄📚', en: 'I read and read.', zh: '我读了又读。' },
      { art: '🌙📖', en: 'It was dark and late.', zh: '天黑了，很晚了。' },
      { art: '😂🔦', en: 'But I still read on!', zh: '可我还想接着读！' }
    ],
    quiz: [
      { q: '这本书是给谁的？', opts: ['弟弟的', '老师的', '我的'], a: 2 },
      { q: '我能读吗？', opts: ['只能读一点', '读不了', '全都能读'], a: 2 },
      { q: '天黑了我在做什么？', opts: ['玩', '还在读书', '睡觉'], a: 1 }
    ]
  },
  {
    id: 'b101', lv: 'L2', tag: '短元音 a · 韵尾 /t/ /d/ /g/', title: 'Bad Cat!', zh: '坏猫！',
    emoji: '🐱', color: '#F5B7B1',
    track: 'drill',
    goal: '尾音 /t/ /d/ /g/ 都要读出来',
    trap: 'cat 不要读成「卡特」，也不要吞掉尾音读成「ca」。舌尖顶住上齿龈，轻轻放气就停。',
    pep: '人教三上 U3 动物',
    summary: '这本书每句话的最后一个词都带「尾音」：cat /t/、hid /d/、bag /g/。中文里没有这种收尾的辅音，孩子很容易读成「ca」「hi」「ba」——一到句尾就省掉，别人就听不懂了。读的时候让他把每个尾音都「点一下」。',
    pre: [
      { art: '🐱', en: 'cat', zh: '猫' },
      { art: '🐀', en: 'rat', zh: '老鼠' },
      { art: '👜', en: 'bag', zh: '袋子' },
      { art: '🟫', en: 'mat', zh: '垫子' }
    ],
    sight: ['the', 'a', 'on', 'in', 'at', 'said'],
    newWords: [
      { w: 'fat', zh: '胖的' },
      { w: 'cat', zh: '猫' },
      { w: 'sat', zh: '坐（过去式）' },
      { w: 'mat', zh: '垫子' },
      { w: 'rat', zh: '老鼠' },
      { w: 'ran', zh: '跑（过去式）' },
      { w: 'hid', zh: '藏（过去式）' },
      { w: 'bag', zh: '袋子' },
      { w: 'bad', zh: '坏的' }
    ],
    pages: [
      { art: '🐱🟫', en: 'A fat cat sat on a mat.', zh: '一只胖猫坐在垫子上。' },
      { art: '🐀', en: 'A rat ran in.', zh: '一只老鼠跑了进来。' },
      { art: '🐱💨🐀', en: 'The cat ran at the rat.', zh: '猫朝老鼠冲了过去。' },
      { art: '🐀👜', en: 'The rat hid in a bag.', zh: '老鼠躲进了一个袋子。' },
      { art: '🐱👜', en: 'The cat sat on the bag!', zh: '猫一屁股坐在了袋子上！' },
      { art: '🐀😤', en: '"Bad cat!" said the rat.', zh: '「坏猫！」老鼠说。' }
    ],
    quiz: [
      { q: '猫坐在什么上面？', opts: ['垫子上', '袋子上', '帽子上'], a: 0 },
      { q: '老鼠躲到哪里去了？', opts: ['床底下', '树上', '袋子里'], a: 2 },
      { q: '最后谁坐在了袋子上？', opts: ['猫', '老鼠', '奶奶'], a: 0 }
    ]
  },
  {
    id: 'b102', lv: 'L6', tag: '魔法 e · a_e / i_e / o_e', title: 'The Red Packet', zh: '红包',
    emoji: '🧧', color: '#E05B4B',
    track: 'story',
    goal: '魔法 e：cake / bike / note —— 末尾的 e 不发音，但让前面的元音「说出字母名」',
    trap: 'packet 是两拍「帕克-特」，不要读成「怕克」；note 的 /t/ 要轻轻送出来。',
    pep: '人教三下 U3 节日',
    summary: '魔法 e 是英语里最划算的一条规则：末尾加一个不发音的 e，前面的元音就读「字母名」——cake 的 a 读 /eɪ/、bike 的 i 读 /aɪ/、note 的 o 读 /oʊ/。中文没有「字母名」这个概念，所以要让孩子先记住 a-e-i-o-u 五个名字，再去看词尾有没有 e。',
    pre: [
      { art: '🧧', en: 'packet', zh: '红包' },
      { art: '📄', en: 'note', zh: '纸条' },
      { art: '🎂', en: 'cake', zh: '蛋糕' },
      { art: '🚲', en: 'bike', zh: '自行车' }
    ],
    sight: ['the', 'a', 'is', 'in', 'it', 'I', 'my', 'and', 'for', 'you', 'says', 'what', 'has', 'get', 'big', 'book', 'Ha', 'Grandma', 'she', 'her'],
    newWords: [
      { w: 'red', zh: '红色的' },
      { w: 'bed', zh: '床' },
      { w: 'packet', zh: '红包' },
      { w: 'shake', zh: '摇一摇' },
      { w: 'open', zh: '打开' },
      { w: 'note', zh: '纸条' },
      { w: 'bike', zh: '自行车' },
      { w: 'ride', zh: '骑' },
      { w: 'shop', zh: '商店' },
      { w: 'cake', zh: '蛋糕' },
      { w: 'smile', zh: '笑' },
      { w: 'fast', zh: '快地' },
      { w: 'top', zh: '顶部' }
    ],
    pages: [
      { art: '🧧🛏️', en: 'A red packet on my bed. It is for me!', zh: '床上有一个红包。是给我的！' },
      { art: '👵🧧', en: '"For you," says Grandma. She has a big smile.', zh: '「给你的。」奶奶说，笑得眼睛都弯了。' },
      { art: '🧧🤲', en: 'What is in it? I shake it. Shake, shake!', zh: '里面是什么？我摇了摇。摇啊摇！' },
      { art: '🧧📄', en: 'I open the packet. A note!', zh: '我打开红包。是一张纸条！' },
      { art: '📄✍️', en: 'The note says: "Get a book."', zh: '纸条上写着：「去买本书。」' },
      { art: '🚲', en: 'I get my bike and ride. I ride fast.', zh: '我骑上自行车出发，骑得飞快。' },
      { art: '🏪🎂', en: 'The shop has a big cake. The cake has a red top.', zh: '店里有一个大蛋糕，顶上红红的。' },
      { art: '🎂👵😂', en: 'I get the cake. "A book?" says Grandma. Ha!', zh: '我买回了蛋糕。「书呢？」奶奶问。哈！' }
    ],
    quiz: [
      { q: '红包是谁给的？', opts: ['奶奶', '老师', '同学'], a: 0 },
      { q: '纸条上写的是什么？', opts: ['去买个蛋糕', '早点睡觉', '去买本书'], a: 2 },
      { q: '我最后买回了什么？', opts: ['蛋糕', '书', '自行车'], a: 0 }
    ]
  },
  {
    id: 'b103', lv: 'L9', tag: '综合 · 非虚构', title: 'The Panda', zh: '大熊猫',
    emoji: '🐼', color: '#3A4A5A',
    track: 'info',
    goal: '长句阅读 · 科普类 · 复习 ar/or（hard、for）',
    trap: 'panda 重音在第一拍 PAN-da，不要读成 pan-DA；bamboo 重音在第二拍 bam-BOO。',
    pep: '人教五上 U4 动物',
    summary: '科普书和故事书不一样：它不靠笑点，靠「一个事实接一个事实」。这本书里 bamboo、mountain、baby 这些词会反复出现，读第二遍时孩子就认得了。读完可以问他：「熊猫为什么一天要吃那么久？」——让他用中文回答也算读懂。',
    pre: [
      { art: '🐼', en: 'panda', zh: '熊猫' },
      { art: '🎋', en: 'bamboo', zh: '竹子' },
      { art: '⛰️', en: 'mountain', zh: '山' },
      { art: '🍼', en: 'baby', zh: '宝宝' }
    ],
    sight: ['a', 'is', 'and', 'it', 'in', 'the', 'of', 'has', 'can', 'not', 'are', 'they', 'their', 'with', 'all', 'day', 'for', 'very', 'small', 'big', 'new', 'as', 'at', 'to', 'many', 'now', 'china'],
    newWords: [
      { w: 'panda', zh: '熊猫' },
      { w: 'black', zh: '黑色的' },
      { w: 'white', zh: '白色的' },
      { w: 'spots', zh: '斑点' },
      { w: 'lives', zh: '生活（第三人称）' },
      { w: 'mountains', zh: '群山' },
      { w: 'green', zh: '绿色的' },
      { w: 'eats', zh: '吃（第三人称）' },
      { w: 'bamboo', zh: '竹子' },
      { w: 'long', zh: '长的' },
      { w: 'tall', zh: '高的' },
      { w: 'grass', zh: '草' },
      { w: 'eat', zh: '吃' },
      { w: 'hours', zh: '小时' },
      { w: 'needs', zh: '需要（第三人称）' },
      { w: 'lot', zh: '许多' },
      { w: 'food', zh: '食物' },
      { w: 'baby', zh: '宝宝' },
      { w: 'pandas', zh: '熊猫（复数）' },
      { w: 'see', zh: '看见' },
      { w: 'first', zh: '最初' },
      { w: 'stay', zh: '待着' },
      { w: 'mother', zh: '妈妈' },
      { w: 'grow', zh: '长大' },
      { w: 'soon', zh: '很快' },
      { w: 'climb', zh: '爬' },
      { w: 'cup', zh: '杯子' },
      { w: 'play', zh: '玩' },
      { w: 'safe', zh: '安全的' },
      { w: 'sends', zh: '送去（第三人称）' },
      { w: 'zoos', zh: '动物园（复数）' }
    ],
    pages: [
      { art: '🐼', en: 'A panda is black and white. It has big black spots.', zh: '熊猫是黑白两色的。它有大大的黑斑点。' },
      { art: '⛰️🐼', en: 'It lives in the mountains of China. The mountains are green.', zh: '它住在中国的大山里。那些山是绿的。' },
      { art: '🎋🐼', en: 'A panda eats bamboo all day long. Bamboo is a tall grass.', zh: '熊猫一整天都在吃竹子。竹子是一种长得很高的草。' },
      { art: '🎋⏰', en: 'A big panda can eat for hours and hours. It needs a lot of food.', zh: '一只成年熊猫能一连吃好几个小时，它需要很多食物。' },
      { art: '🐼🍼', en: 'Baby pandas are very small. A new baby is as small as a cup.', zh: '熊猫宝宝非常小。刚出生的宝宝只有一只杯子那么大。' },
      { art: '🐼👀', en: 'They can not see at first. They stay with their mother.', zh: '它们刚出生时看不见，一直待在妈妈身边。' },
      { art: '📈🐼', en: 'They grow and grow. Soon they can climb trees and play.', zh: '它们长啊长，很快就能爬树、玩耍了。' },
      { art: '🐼🛡️', en: 'Now the panda is safe. China sends pandas to many zoos.', zh: '现在熊猫安全了。中国把熊猫送到很多动物园。' }
    ],
    quiz: [
      { q: '熊猫是什么颜色的？', opts: ['棕色', '黑白两色', '全身白色'], a: 1 },
      { q: '熊猫主要吃什么？', opts: ['竹子', '苹果', '小鱼'], a: 0 },
      { q: '刚出生的熊猫宝宝有多大？', opts: ['像一只杯子那么大', '像一只猫那么大', '像妈妈那么大'], a: 0 }
    ]
  },
  {
    id: 'b104', lv: 'L6', tag: '魔法 e · 长读', title: 'Grandma\'s Dumplings', zh: '奶奶包饺子',
    emoji: '🥟', color: '#E8C07D',
    track: 'story',
    goal: '魔法 e 在长句里也要读准（make / cake / plate / white）',
    trap: 'dumpling 的重音在第一拍 DUM-pling；plate 的 /t/ 要出来，别读成「普雷」。',
    summary: '长句里最容易丢掉的是尾音和魔法 e——dumpling、plate、make 这些词一快就糊。让孩子先慢读一遍，把每个词的末尾都读清楚，再提速。',
    pre: [
      { art: '🥟', en: 'dumpling', zh: '饺子' },
      { art: '👵', en: 'Grandma', zh: '奶奶' },
      { art: '🥩', en: 'meat', zh: '肉馅' },
      { art: '🍲', en: 'pot', zh: '锅' }
    ],
    sight: ['meat', 'soup', 'water', 'yours'],
    newWords: [
      { w: 'Grandma', zh: '奶奶' },
      { w: 'makes', zh: '做（第三人称）' },
      { w: 'dumplings', zh: '饺子' },
      { w: 'today', zh: '今天' },
      { w: 'help', zh: '帮忙' },
      { w: 'meat', zh: '肉馅' },
      { w: 'middle', zh: '中间' },
      { w: 'much', zh: '多' },
      { w: 'small', zh: '小的' },
      { w: 'good', zh: '好的' },
      { w: 'fat', zh: '胖的' },
      { w: 'smile', zh: '笑' },
      { w: 'ten', zh: '十个' },
      { w: 'biggest', zh: '最大的' },
      { w: 'water', zh: '水' },
      { w: 'hot', zh: '烫的' },
      { w: 'wait', zh: '等' },
      { w: 'opens', zh: '裂开（第三人称）' },
      { w: 'soup', zh: '汤' }
    ],
    pages: [
      { art: '👵🥟', en: 'Grandma makes dumplings today. It is my best day.', zh: '奶奶今天包饺子。这是我最喜欢的一天。' },
      { art: '👦🥟', en: 'I help her. I put meat in the middle.', zh: '我帮她。我把肉馅放在中间。' },
      { art: '👵🤏', en: '"Not too much," says Grandma. "Small is good."', zh: '「别放太多，」奶奶说，「小小的才好。」' },
      { art: '🥟😮', en: 'I put too much in. My dumpling is big and fat!', zh: '我放太多了。我的饺子又大又胖！' },
      { art: '👵😊', en: '"That one is yours," she says with a smile.', zh: '「那个是你的，」她笑着说。' },
      { art: '🥟🥟🥟', en: 'We make ten dumplings. Mine is the biggest of all.', zh: '我们包了十个饺子。我那个是最大的。' },
      { art: '🍲🔥', en: 'The water is hot. We wait and wait and wait.', zh: '水开了。我们等啊等啊等。' },
      { art: '🥟💥', en: 'Mine opens in the water. Now it is soup!', zh: '我那个在水里裂开了。它变成汤了！' }
    ],
    quiz: [
      { q: '今天奶奶在做什么？', opts: ['包饺子', '做蛋糕', '煮面条'], a: 0 },
      { q: '我的饺子为什么特别大？', opts: ['我放了太多肉馅', '奶奶帮我做的', '我用了两张皮'], a: 0 },
      { q: '最后我的饺子怎么了？', opts: ['在水里裂开了', '被奶奶吃掉了', '变得最好看'], a: 0 }
    ]
  },
  {
    id: 'b105', lv: 'L6', tag: '魔法 e / ee · 长读', title: 'Mimi at Night', zh: '夜里的咪咪',
    emoji: '🐈', color: '#8E9AAF',
    track: 'story',
    goal: 'i_e / ee 混在长句里：Mimi / night / sleep',
    trap: 'Mimi 两个音节都是「咪」，第二个不重读；night 的 gh 不发音，别读成「尼格特」。',
    summary: '这本书的长句里有好几个 ee / i_e 词（sleep / night / line）。孩子容易把 night 读成「尼特」，记住 gh 是不发音的。',
    pre: [
      { art: '🐈', en: 'cat', zh: '猫' },
      { art: '🌙', en: 'night', zh: '夜晚' },
      { art: '🧱', en: 'wall', zh: '墙' },
      { art: '😴', en: 'sleep', zh: '睡觉' }
    ],
    sight: ['know', 'window'],
    newWords: [
      { w: 'Mimi', zh: '咪咪（猫名）' },
      { w: 'cat', zh: '猫' },
      { w: 'sleeps', zh: '睡（第三人称）' },
      { w: 'day', zh: '白天' },
      { w: 'night', zh: '夜晚' },
      { w: 'sleepy', zh: '困的' },
      { w: 'goes', zh: '去（第三人称）' },
      { w: 'window', zh: '窗户' },
      { w: 'know', zh: '知道' },
      { w: 'get', zh: '起身' },
      { w: 'wall', zh: '墙' },
      { w: 'alone', zh: '独自' },
      { w: 'sit', zh: '坐' },
      { w: 'line', zh: '一排' },
      { w: 'moon', zh: '月亮' },
      { w: 'home', zh: '家' },
      { w: 'six', zh: '六点' }
    ],
    pages: [
      { art: '🐈💤', en: 'Mimi is my cat. She sleeps all day.', zh: '咪咪是我的猫。她白天一直睡。' },
      { art: '🐈🌙', en: 'At night she is not sleepy at all.', zh: '到了晚上她一点也不困。' },
      { art: '🪟🐈', en: 'She goes out by the window.', zh: '她从窗户出去。' },
      { art: '❓🐈', en: 'Where does she go? I do not know.', zh: '她去哪儿了？我不知道。' },
      { art: '👦🌙', en: 'One night I get up and look.', zh: '有一天夜里，我爬起来看。' },
      { art: '🐈🧱', en: 'Mimi is on the wall. She is not alone.', zh: '咪咪在墙上。她不是一个人。' },
      { art: '🐈🐈🐈🌕', en: 'Three cats sit in a line. They look at the moon.', zh: '三只猫排成一排，一起看着月亮。' },
      { art: '🐈😴', en: 'Mimi comes home at six. Now she is sleepy!', zh: '咪咪六点回家。这下她困了！' }
    ],
    quiz: [
      { q: '咪咪白天在做什么？', opts: ['一直睡觉', '一直跑', '一直叫'], a: 0 },
      { q: '夜里咪咪从哪里出去？', opts: ['窗户', '大门', '屋顶'], a: 0 },
      { q: '墙上有几只猫？', opts: ['三只', '一只', '五只'], a: 0 }
    ]
  },
  {
    id: 'b106', lv: 'L7', tag: 'ar / or · 长读 · 科普', title: 'The Fast Train', zh: '高铁',
    emoji: '🚄', color: '#5B8DEF',
    track: 'info',
    goal: 'ar / or 在长句里：far / car / station / short',
    trap: 'station 的重音在第一拍 STA-tion；hour 的 h 不发音，读「奥儿」。',
    summary: '科普类长句的特点是「一个事实接一个事实」。ar / or 在这本里反复出现（far / car / station / short），读顺了就是肌肉记忆。',
    pre: [
      { art: '🚄', en: 'train', zh: '火车' },
      { art: '🚉', en: 'station', zh: '车站' },
      { art: '👴', en: 'grandpa', zh: '爷爷' },
      { art: '🍊', en: 'oranges', zh: '橘子' }
    ],
    sight: ['hours', 'reads', 'rivers', 'station', 'town', 'white', 'window'],
    newWords: [
      { w: 'Grandpa', zh: '爷爷' },
      { w: 'lives', zh: '住（第三人称）' },
      { w: 'far', zh: '远的' },
      { w: 'away', zh: '离开' },
      { w: 'train', zh: '火车' },
      { w: 'white', zh: '白色的' },
      { w: 'long', zh: '长的' },
      { w: 'fast', zh: '快的' },
      { w: 'trees', zh: '树（复数）' },
      { w: 'wind', zh: '风' },
      { w: 'window', zh: '窗户' },
      { w: 'farms', zh: '农场（复数）' },
      { w: 'rivers', zh: '河（复数）' },
      { w: 'girl', zh: '女孩' },
      { w: 'next', zh: '旁边的' },
      { w: 'book', zh: '书' },
      { w: 'ask', zh: '问' },
      { w: 'hours', zh: '小时（复数）' },
      { w: 'town', zh: '小镇' },
      { w: 'stops', zh: '停（第三人称）' },
      { w: 'station', zh: '车站' },
      { w: 'bag', zh: '袋子' },
      { w: 'oranges', zh: '橘子（复数）' }
    ],
    pages: [
      { art: '👴🏠', en: 'My grandpa lives far away. We go to see him today.', zh: '爷爷住得很远。我们今天去看他。' },
      { art: '🚄', en: 'We take the fast train. It is white and long.', zh: '我们坐高铁。它又白又长。' },
      { art: '🌳💨', en: 'The train goes very fast. The trees go by like wind.', zh: '火车开得飞快。树像风一样往后退。' },
      { art: '🪟🌾', en: 'I look out of the window. I can see farms and rivers.', zh: '我往窗外看。我能看见农田和河流。' },
      { art: '👧📖', en: 'A girl next to me has a book. She reads it fast.', zh: '我旁边的女孩有一本书。她读得很快。' },
      { art: '👦👩', en: '"Is it far?" I ask. "Not far," says Mom. "Two hours."', zh: '「远吗？」我问。「不远，」妈妈说，「两个小时。」' },
      { art: '🏘️🚉', en: 'Grandpa lives in a small town. The train stops there.', zh: '爷爷住在一个小镇上。火车在那里停。' },
      { art: '👴🍊', en: 'Grandpa is at the station. He has a bag of oranges!', zh: '爷爷在车站。他有一袋橘子！' }
    ],
    quiz: [
      { q: '我们要去看谁？', opts: ['爷爷', '奶奶', '老师'], a: 0 },
      { q: '坐火车要多久？', opts: ['两个小时', '一整天', '十分钟'], a: 0 },
      { q: '爷爷带了什么来？', opts: ['一袋橘子', '一束花', '一本书'], a: 0 }
    ]
  },
  {
    id: 'b107', lv: 'L7', tag: 'ar / ir · 长读', title: 'The Lost Bag', zh: '书包丢了',
    emoji: '🎒', color: '#F0A868',
    track: 'story',
    goal: 'ar / ir 长句：bag / park / girl / first',
    trap: 'first 的 ir 要卷舌；park 的 /k/ 收住，别读成「帕克」拖长。',
    summary: '长故事里孩子容易只顾情节、忘了发音。建议第二遍读时专门盯 ar / ir 的词：park、dark、start、first、girl、shirt。',
    pre: [
      { art: '🎒', en: 'bag', zh: '书包' },
      { art: '🏞️', en: 'park', zh: '公园' },
      { art: '👧', en: 'girl', zh: '女孩' },
      { art: '🪑', en: 'bench', zh: '长椅' }
    ],
    sight: ['yours'],
    newWords: [
      { w: 'bag', zh: '书包' },
      { w: 'lost', zh: '丢了' },
      { w: 'park', zh: '公园' },
      { w: 'played', zh: '玩（过去式）' },
      { w: 'bench', zh: '长椅' },
      { w: 'first', zh: '第一个' },
      { w: 'girl', zh: '女孩' },
      { w: 'red', zh: '红色的' },
      { w: 'shirt', zh: '上衣' },
      { w: 'smiles', zh: '微笑（第三人称）' },
      { w: 'says', zh: '说（第三人称）' },
      { w: 'this', zh: '这个' },
      { w: 'yours', zh: '你的' },
      { w: 'thank', zh: '感谢' },
      { w: 'home', zh: '家' },
      { w: 'dark', zh: '黑的' },
      { w: 'start', zh: '开始' },
      { w: 'run', zh: '跑' }
    ],
    pages: [
      { art: '👦🎒', en: 'I lost my bag in the park. I am not glad.', zh: '我把书包丢在公园了。我一点也不高兴。' },
      { art: '🏞️🪑', en: 'We played by the bench. Then it was dark.', zh: '我们在长椅边玩。后来天黑了。' },
      { art: '🔍🎒', en: 'Where is my bag? I look and look.', zh: '我的书包在哪儿？我找啊找。' },
      { art: '👧🎒', en: 'A girl has a bag. It is red.', zh: '一个女孩拿着一个书包。是红色的。' },
      { art: '👧👕', en: 'She has a red shirt too. She smiles at me.', zh: '她也穿着红上衣。她朝我笑。' },
      { art: '👦❓', en: '"Is this yours?" she says. "It is!" I say.', zh: '「这是你的吗？」她问。「是我的！」我说。' },
      { art: '🙏👧', en: '"Thank you! You are the first to find it."', zh: '「谢谢你！你是第一个找到它的。」' },
      { art: '👦👧🏃', en: 'We run home at dark. Now I have my bag!', zh: '天黑了，我们一起跑回家。书包找回来了！' }
    ],
    quiz: [
      { q: '我把书包丢在哪儿了？', opts: ['公园', '学校', '家里'], a: 0 },
      { q: '谁捡到了书包？', opts: ['一个穿红上衣的女孩', '一位老师', '我的同学'], a: 0 },
      { q: '女孩是怎么找到书包的？', opts: ['书包就在长椅旁边', '她问了很多人', '她看见我丢的'], a: 0 }
    ]
  },
  {
    id: 'b108', lv: 'L8', tag: '视觉词 · 长读 · 科普', title: 'The Great Wall', zh: '长城',
    emoji: '🧱', color: '#8D7B68',
    track: 'info',
    goal: '长句里的视觉词：because / through / people / years',
    trap: 'wall 的 /w/ 要圆唇；through 读 /θruː/，th 要咬舌，不是「斯鲁」。',
    summary: '这篇句子长、信息密，适合练「一口气读一句」。视觉词 because / through / people / world 不按规则拼，反复见几次就记住了。',
    pre: [
      { art: '🧱', en: 'wall', zh: '城墙' },
      { art: '⛰️', en: 'mountain', zh: '山' },
      { art: '🧑‍🤝‍🧑', en: 'people', zh: '人们' },
      { art: '🏮', en: 'tower', zh: '城楼' }
    ],
    sight: ['built', 'climb', 'great', 'high', 'thousand', 'tired', 'tower', 'towers', 'years'],
    newWords: [
      { w: 'wall', zh: '城墙' },
      { w: 'Great', zh: '伟大的' },
      { w: 'mountains', zh: '群山' },
      { w: 'north', zh: '北方' },
      { w: 'kilometres', zh: '公里' },
      { w: 'built', zh: '建造（过去式）' },
      { w: 'long', zh: '长的' },
      { w: 'ago', zh: '以前' },
      { w: 'hands', zh: '手（复数）' },
      { w: 'stones', zh: '石头（复数）' },
      { w: 'carried', zh: '搬运（过去式）' },
      { w: 'towers', zh: '城楼（复数）' },
      { w: 'climb', zh: '爬' },
      { w: 'steps', zh: '台阶（复数）' },
      { w: 'tired', zh: '累的' },
      { w: 'wind', zh: '风' },
      { w: 'cold', zh: '冷的' },
      { w: 'visit', zh: '参观' },
      { w: 'world', zh: '世界' }
    ],
    pages: [
      { art: '🧱⛰️', en: 'The Great Wall is in the north of China. It is very long.', zh: '长城在中国北方。它非常长。' },
      { art: '📏🧱', en: 'It is more than twenty thousand kilometres. That is a lot!', zh: '它有两万多公里。那可太长了！' },
      { art: '👷🧱', en: 'People built it many years ago. It was very hard work.', zh: '很久以前人们建造了它。那是一件非常辛苦的活。' },
      { art: '✋🪨', en: 'They carried stones with their hands. No big machines then.', zh: '他们用手搬石头。那时候没有大机器。' },
      { art: '🏔️🧱', en: 'From a tower you can see far away. The wall runs like a long dragon.', zh: '从城楼上看得很远。城墙像一条长龙。' },
      { art: '🏮🧱', en: 'There are towers on the wall. People lived in them.', zh: '城墙上有城楼。人们住在里面。' },
      { art: '🧗', en: 'Today you can climb the steps. Some are very high.', zh: '今天你可以爬台阶。有些台阶非常高。' },
      { art: '😮‍💨🌬️', en: 'The wind is cold there. You will be tired but glad.', zh: '那里的风很冷。你会很累，但很开心。' },
      { art: '🌍🧱', en: 'People from all over the world come to visit it.', zh: '世界各地的人都来参观它。' }
    ],
    quiz: [
      { q: '长城在中国哪个方向？', opts: ['北方', '南方', '西边'], a: 0 },
      { q: '古时候人们怎么搬石头？', opts: ['用手搬', '用大机器', '用火车运'], a: 0 },
      { q: '城墙上的城楼是做什么用的？', opts: ['人们住在里面', '停放车辆', '种菜'], a: 0 }
    ]
  },
  {
    id: 'b109', lv: 'L8', tag: '视觉词 · 长读', title: 'Sports Day', zh: '运动会',
    emoji: '🏃', color: '#4EC5F1',
    track: 'story',
    goal: '长句里的视觉词：everyone / ready / again / thought',
    trap: 'thought 的 gh 不发音，读 /θɔːt/；race 的 c 是 /s/，不是 /k/。',
    summary: '这篇有情绪转折，适合让孩子读完用中文讲一遍「我为什么停下来」。视觉词 everyone / ready / thought / again 在这篇里反复出现。',
    pre: [
      { art: '🏃', en: 'race', zh: '赛跑' },
      { art: '🥇', en: 'first', zh: '第一名' },
      { art: '👟', en: 'shoes', zh: '鞋' },
      { art: '🎽', en: 'shirt', zh: '运动衣' }
    ],
    sight: ['everyone', 'heart', 'playground', 'ready', 'slower', 'teacher', 'tired'],
    newWords: [
      { w: 'sports', zh: '运动' },
      { w: 'day', zh: '日子' },
      { w: 'race', zh: '赛跑' },
      { w: 'shoes', zh: '鞋（复数）' },
      { w: 'fast', zh: '快的' },
      { w: 'start', zh: '开始' },
      { w: 'ran', zh: '跑（过去式）' },
      { w: 'first', zh: '第一' },
      { w: 'last', zh: '最后' },
      { w: 'slower', zh: '更慢的' },
      { w: 'tired', zh: '累的' },
      { w: 'fell', zh: '摔倒（过去式）' },
      { w: 'ground', zh: '地面' },
      { w: 'smiled', zh: '笑（过去式）' },
      { w: 'hand', zh: '手' },
      { w: 'helped', zh: '帮助（过去式）' },
      { w: 'finished', zh: '完成（过去式）' },
      { w: 'happy', zh: '开心的' }
    ],
    pages: [
      { art: '🏫🏃', en: 'It is Sports Day. Everyone is on the playground.', zh: '今天是运动会。大家都在操场上。' },
      { art: '☀️🏫', en: 'The sun is hot. We stand in a line and wait for the start.', zh: '太阳很晒。我们排成一排，等比赛开始。' },
      { art: '👟', en: 'I have new shoes. They are soft and very fast.', zh: '我有一双新鞋。又软又快。' },
      { art: '🏁', en: '"Ready, go!" The race starts. We all run fast.', zh: '「预备，跑！」比赛开始了。我们都跑得飞快。' },
      { art: '👦💨', en: 'I am first! But then I look back at my friend.', zh: '我是第一！可我回头看了看我的朋友。' },
      { art: '😣', en: 'He is slower. He looks tired. Then he falls down.', zh: '他跑得慢。他看起来很累。然后他摔倒了。' },
      { art: '🤝', en: 'I stop and go back. I give him my hand.', zh: '我停下来，跑回去，把手伸给他。' },
      { art: '👦👦🏁', en: 'We finish last, hand in hand. Everyone smiles at us.', zh: '我们手拉手最后到达。大家都朝我们笑。' },
      { art: '😊🎽', en: '"You are first in my heart," says my teacher.', zh: '「你在我心里是第一名。」老师说。' }
    ],
    quiz: [
      { q: '比赛开始后，我跑得怎么样？', opts: ['一开始是第一名', '一直最后', '没有参加'], a: 0 },
      { q: '我为什么停下来？', opts: ['朋友摔倒了，我去扶他', '我鞋带开了', '老师叫我'], a: 0 },
      { q: '最后我们得了第几名？', opts: ['最后一名，但大家为我们鼓掌', '第一名', '没有名次'], a: 0 }
    ]
  },
  {
    id: 'b110', lv: 'L9', tag: '综合 · 长读 · 科普', title: 'Rice', zh: '水稻',
    emoji: '🌾', color: '#D4A373',
    track: 'info',
    goal: '长段落阅读：一段两三个事实，靠连接词串起来',
    trap: 'rice 的 c 是 /s/；grown 的 ow 读 /oʊ/；south 的 ou 读 /aʊ/。',
    summary: '这篇是「信息型长文」：每页两三个事实，靠 where / then / for 这些连接词串起来。读完可以问孩子「米饭要经过哪几步」，练复述。',
    pre: [
      { art: '🌾', en: 'rice', zh: '水稻' },
      { art: '💧', en: 'water', zh: '水' },
      { art: '👨‍🌾', en: 'farmer', zh: '农民' },
      { art: '🍚', en: 'bowl', zh: '碗' }
    ],
    sight: ['autumn', 'bowl', 'eat', 'everything', 'farmers', 'hours', 'right', 'south', 'turns', 'water'],
    newWords: [
      { w: 'rice', zh: '水稻；米饭' },
      { w: 'plant', zh: '种植' },
      { w: 'south', zh: '南方' },
      { w: 'wet', zh: '湿的' },
      { w: 'fields', zh: '田地（复数）' },
      { w: 'farmers', zh: '农民（复数）' },
      { w: 'stand', zh: '站' },
      { w: 'water', zh: '水' },
      { w: 'knees', zh: '膝盖（复数）' },
      { w: 'green', zh: '绿色的' },
      { w: 'turns', zh: '变成（第三人称）' },
      { w: 'gold', zh: '金黄色' },
      { w: 'autumn', zh: '秋天' },
      { w: 'cut', zh: '收割' },
      { w: 'bowl', zh: '碗' },
      { w: 'hot', zh: '热的' },
      { w: 'soft', zh: '软的' },
      { w: 'taste', zh: '尝起来' },
      { w: 'grow', zh: '生长' },
      { w: 'months', zh: '月（复数）' },
      { w: 'heavy', zh: '重的' },
      { w: 'work', zh: '劳动' },
      { w: 'cook', zh: '煮' },
      { w: 'becomes', zh: '变成（第三人称）' }
    ],
    pages: [
      { art: '🌾🇨🇳', en: 'Rice is the most important food in China. People eat it every day.', zh: '米饭是中国最重要的食物。人们每天都吃。' },
      { art: '🌱💧', en: 'Farmers plant rice in the south, where it is warm and wet.', zh: '农民在南方种水稻，那里又暖和又潮湿。' },
      { art: '👨‍🌾💦', en: 'The fields are full of water. Farmers stand in it for hours.', zh: '田里全是水。农民在水里一站就是几个小时。' },
      { art: '🌾💧', en: 'The water must be just right. Too much rain is bad for rice.', zh: '水要刚刚好。雨太多对水稻不好。' },
      { art: '🌿', en: 'For many months the rice is green. Then it turns gold.', zh: '好几个月里水稻都是绿的。然后它变成金黄色。' },
      { art: '🍂🌾', en: 'In autumn farmers cut it and take it home.', zh: '到了秋天，农民收割，把它运回家。' },
      { art: '🍚🔥', en: 'We cook it with water. It becomes hot and soft.', zh: '我们用水煮它。它变得又热又软。' },
      { art: '🍚😋', en: 'A bowl of rice tastes good with almost everything.', zh: '一碗米饭几乎配什么都好吃。' },
      { art: '🌍🍚', en: 'Half the people in the world eat rice every day. It is a lot of work!', zh: '世界上有一半的人每天吃米饭。这背后是很多很多劳动。' }
    ],
    quiz: [
      { q: '水稻主要种在中国的哪里？', opts: ['南方', '北方', '西边'], a: 0 },
      { q: '水稻什么时候变成金黄色？', opts: ['秋天', '春天', '冬天'], a: 0 },
      { q: '一碗米饭是怎么来的？', opts: ['农民在水田里劳动好几个月', '超市里长出来的', '机器直接做出来的'], a: 0 }
    ]
  },
  {
    id: 'b111', lv: 'L9', tag: '综合 · 长读', title: 'The Mooncake Night', zh: '中秋夜',
    emoji: '🥮', color: '#C9A227',
    track: 'story',
    goal: '长故事阅读：对话 + 场景描写 + 情绪变化',
    trap: 'mooncake 重音在第一拍 MOON-cake；tonight 的 gh 不发音。',
    summary: '这篇有对话、有空椅子这样的细节，还有情绪变化。读的时候让孩子注意「我」从一开始不说话、到后来不难过，中间发生了什么。',
    pre: [
      { art: '🥮', en: 'mooncake', zh: '月饼' },
      { art: '🌕', en: 'moon', zh: '月亮' },
      { art: '🏮', en: 'lantern', zh: '灯笼' },
      { art: '👨‍👩‍👧', en: 'family', zh: '家人' }
    ],
    sight: ['bright', 'counted', 'door', 'everyone', 'round', 'seat', 'tonight', 'voice', 'year'],
    newWords: [
      { w: 'mooncake', zh: '月饼' },
      { w: 'moon', zh: '月亮' },
      { w: 'round', zh: '圆的' },
      { w: 'bright', zh: '明亮的' },
      { w: 'lantern', zh: '灯笼' },
      { w: 'garden', zh: '院子' },
      { w: 'table', zh: '桌子' },
      { w: 'counted', zh: '数（过去式）' },
      { w: 'pieces', zh: '块（复数）' },
      { w: 'share', zh: '分享' },
      { w: 'missing', zh: '缺失的' },
      { w: 'seat', zh: '座位' },
      { w: 'empty', zh: '空的' },
      { w: 'quiet', zh: '安静的' },
      { w: 'phone', zh: '电话' },
      { w: 'voice', zh: '声音' },
      { w: 'smiled', zh: '笑（过去式）' },
      { w: 'smell', zh: '气味' },
      { w: 'sweet', zh: '甜的' },
      { w: 'same', zh: '同一个' }
    ],
    pages: [
      { art: '🌕🏮', en: 'Tonight the moon is round and bright. Everyone in my family is here.', zh: '今晚的月亮又圆又亮。家里所有人都到齐了。' },
      { art: '👨‍👩‍👧🌕', en: 'We sit in the garden and look up. The moon is like a big plate.', zh: '我们坐在院子里抬头看。月亮像一只大盘子。' },
      { art: '🥮🪑', en: 'Grandma puts mooncakes on the table. She counted them three times.', zh: '奶奶把月饼摆在桌上。她数了三遍。' },
      { art: '👵❓', en: '"One is missing," she says. "Who took it?"', zh: '「少了一个，」她说，「谁拿走了？」' },
      { art: '👦🤫', en: 'Everyone looks at me. I do not say a word.', zh: '大家都看着我。我一句话也不说。' },
      { art: '🪑⚪', en: 'There is an empty seat by the door. My uncle is not here this year.', zh: '门边有一张空椅子。今年舅舅没能回来。' },
      { art: '📞', en: '"Save me a mooncake," he says. His voice is warm.', zh: '「给我留一块月饼，」他说。他的声音很暖。' },
      { art: '🥮📱', en: '"Save me a mooncake," he says. I put one in a box for him.', zh: '「给我留一块月饼，」他说。我把一块装进盒子里。' },
      { art: '🌕😊', en: 'The moon is the same for him and for us. I am not sad now.', zh: '他看到的月亮和我们看到的是同一个。我不难过了。' }
    ],
    quiz: [
      { q: '奶奶为什么数了三遍月饼？', opts: ['发现少了一块', '想知道够不够甜', '要分给邻居'], a: 0 },
      { q: '门边为什么有一张空椅子？', opts: ['舅舅今年没能回来', '椅子坏了', '要给客人坐'], a: 0 },
      { q: '我最后为舅舅做了什么？', opts: ['留了一块月饼', '打了电话给他', '画了一幅画'], a: 0 }
    ]
  }
];

window.BOOKS = BOOKS;
