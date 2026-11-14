/* ============================================================
   小鸟英语乐园 · 读书馆（分级拼读小书）
   2026-11-14.16 新增。对标 Starfall Learn to Read（15 本序列拼读书）
   与 Bob Books（每本 8-25 个不重复词、极简句式、幽默收尾）：

   编写铁律（_check_books.py 强制校验）：
   ① 每个词必须「规则可解码」——只用该书级别及以下已教音素
      （单字母 → sh/ch/th/ck/ng → 连缀 → ee/oo/ai/ay/oa → 魔法 e → ar/or/ir）
      或该书显式声明的视觉词（sight）；
   ② 每页 1-2 个短句，全书重复句式 + 一个荒诞小笑点收尾；
   ③ 生词量 8-25，生词表带中文；读后 3 道理解题（中文提问）。

   级别映射：B1-B5=L2 短元音 · B6-B7=L3 双辅音 · B8=L4 连缀
             B9-B10=L5 元音组合 · B11=L6 魔法 e · B12=L7 卷舌音
             B13=L8 视觉词 · B14-B15=L9 综合收官
   ============================================================ */
'use strict';

const BOOKS = [
  {
    id: 'b1', lv: 'L2', tag: '短元音 a', title: 'A Cat, a Hat', zh: '小猫和帽子',
    emoji: '🐱', color: '#FF6B6B',
    sight: ['the', 'a', 'is', 'my'],
    newWords: [
      { w: 'cat', zh: '猫' }, { w: 'hat', zh: '帽子' }, { w: 'sat', zh: '坐（过去式）' },
      { w: 'mat', zh: '垫子' }, { w: 'rat', zh: '老鼠' }
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
      { q: '猫坐在哪里？', opts: ['垫子上', '帽子上', '箱子上'], a: 0 },
      { q: '谁坐在了帽子上？', opts: ['猫', '老鼠', '狗'], a: 1 },
      { q: '故事最后谁在最下面？', opts: ['猫', '帽子', '老鼠'], a: 2 }
    ]
  },
  {
    id: 'b2', lv: 'L2', tag: '短元音 e', title: 'My Red Hen', zh: '我的红母鸡',
    emoji: '🐔', color: '#E24B4A',
    sight: ['the', 'a', 'is', 'my'],
    newWords: [
      { w: 'hen', zh: '母鸡' }, { w: 'red', zh: '红色的' }, { w: 'pen', zh: '围栏' },
      { w: 'wet', zh: '湿的' }, { w: 'get', zh: '拿、取' }, { w: 'eggs', zh: '鸡蛋（复数）' },
      { w: 'ten', zh: '十' }, { w: 'bed', zh: '床' }
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
      { q: '有几个鸡蛋？', opts: ['一个', '十个', '五个'], a: 1 },
      { q: '母鸡最后跑到哪里去了？', opts: ['围栏里', '床上', '垫子上'], a: 1 }
    ]
  },
  {
    id: 'b3', lv: 'L2', tag: '短元音 i', title: 'The Big Pig', zh: '大胖猪',
    emoji: '🐷', color: '#F4A7B9',
    sight: ['the', 'a', 'is', 'my'],
    newWords: [
      { w: 'pig', zh: '猪' }, { w: 'big', zh: '大的' }, { w: 'it', zh: '它' },
      { w: 'dig', zh: '挖' }, { w: 'pit', zh: '坑' }, { w: 'wig', zh: '假发' }
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
      { q: '猪会做什么？', opts: ['挖土', '游泳', '飞'], a: 0 },
      { q: '猪掉到哪里去了？', opts: ['坑里', '水里', '床上'], a: 0 },
      { q: '猪头上戴了什么？', opts: ['帽子', '假发', '围巾'], a: 1 }
    ]
  },
  {
    id: 'b4', lv: 'L2', tag: '短元音 o', title: 'Fox in a Box', zh: '盒子里的狐狸',
    emoji: '🦊', color: '#F0997B',
    sight: ['the', 'a', 'is', 'my'],
    newWords: [
      { w: 'fox', zh: '狐狸' }, { w: 'box', zh: '盒子' }, { w: 'hot', zh: '热的' },
      { w: 'hop', zh: '跳' }, { w: 'on', zh: '在……上' }, { w: 'dog', zh: '狗' }
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
      { q: '狐狸觉得怎么样？', opts: ['冷', '热', '饿'], a: 1 },
      { q: '故事最后狐狸在哪里？', opts: ['盒子里', '坑里', '狗头上'], a: 2 }
    ]
  },
  {
    id: 'b5', lv: 'L2', tag: '短元音 u', title: 'Fun in the Sun', zh: '太阳底下真好玩',
    emoji: '🐶', color: '#4EC5F1',
    sight: ['the', 'a', 'is', 'my'],
    newWords: [
      { w: 'pup', zh: '小狗' }, { w: 'sun', zh: '太阳' }, { w: 'run', zh: '跑' },
      { w: 'mud', zh: '泥巴' }, { w: 'fun', zh: '好玩' }, { w: 'up', zh: '起来' }
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
      { q: '小狗在哪里打滚？', opts: ['泥巴里', '水里', '床上'], a: 0 },
      { q: '小狗会做什么？', opts: ['跑', '飞', '唱歌'], a: 0 },
      { q: '小狗最后怎么样了？', opts: ['湿漉漉', '干干净净', '睡着了'], a: 0 }
    ]
  },
  {
    id: 'b6', lv: 'L3', tag: 'sh · ch', title: 'The Big Fish', zh: '大鱼',
    emoji: '🐟', color: '#0EA5E9',
    sight: ['the', 'a', 'is', 'my', 'and'],
    newWords: [
      { w: 'fish', zh: '鱼' }, { w: 'ship', zh: '船' }, { w: 'dish', zh: '盘子' },
      { w: 'sit', zh: '坐' }, { w: 'shop', zh: '商店' }, { w: 'chips', zh: '薯条' }
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
      { q: '鱼在哪里？', opts: ['船上', '车里', '盒子里'], a: 0 },
      { q: '鱼坐在什么上面？', opts: ['盘子', '帽子', '垫子'], a: 0 },
      { q: '故事最后鱼变成了什么？', opts: ['鱼和薯条', '鱼汤', '鱼骨头'], a: 0 }
    ]
  },
  {
    id: 'b7', lv: 'L3', tag: 'ck · ng · th', title: 'Duck Sings', zh: '鸭子唱歌',
    emoji: '🦆', color: '#F59E0B',
    sight: ['the', 'a', 'is', 'my', 'and'],
    newWords: [
      { w: 'duck', zh: '鸭子' }, { w: 'rock', zh: '石头' }, { w: 'thin', zh: '瘦的' },
      { w: 'sing', zh: '唱歌' }, { w: 'chick', zh: '小鸡' }, { w: 'song', zh: '歌' }
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
      { q: '鸭子站在什么上面？', opts: ['石头', '盒子', '盘子'], a: 0 },
      { q: '谁骑在鸭子上？', opts: ['小鸡', '猫', '猪'], a: 0 },
      { q: '最后谁在唱歌？', opts: ['只有鸭子', '鸭子和小鸡', '只有小鸡'], a: 1 }
    ]
  },
  {
    id: 'b8', lv: 'L4', tag: '辅音连缀', title: 'Frog and Crab', zh: '青蛙和螃蟹',
    emoji: '🐸', color: '#22C55E',
    sight: ['the', 'a', 'is', 'my', 'and'],
    newWords: [
      { w: 'frog', zh: '青蛙' }, { w: 'grass', zh: '草地' }, { w: 'swim', zh: '游泳' },
      { w: 'stop', zh: '停' }, { w: 'crab', zh: '螃蟹' }, { w: 'grab', zh: '抓住' }
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
      { q: '青蛙一开始在哪里？', opts: ['草地里', '水里', '石头上'], a: 0 },
      { q: '谁骑在青蛙上？', opts: ['螃蟹', '鸭子', '小鸡'], a: 0 },
      { q: '青蛙会做什么？', opts: ['游泳', '唱歌', '挖土'], a: 0 }
    ]
  },
  {
    id: 'b9', lv: 'L5', tag: 'ee · oo', title: 'Three Green Bees', zh: '三只绿蜜蜂',
    emoji: '🐝', color: '#FACC15',
    sight: ['the', 'a', 'is', 'my', 'and', 'we'],
    newWords: [
      { w: 'see', zh: '看见' }, { w: 'tree', zh: '树' }, { w: 'bee', zh: '蜜蜂' },
      { w: 'three', zh: '三' }, { w: 'green', zh: '绿色的' }, { w: 'moon', zh: '月亮' },
      { w: 'sleep', zh: '睡觉' }, { w: 'feet', zh: '脚' }
    ],
    pages: [
      { art: '🌳', en: 'We can see a tree.', zh: '我们能看见一棵树。' },
      { art: '🐝🌳', en: 'A bee is in the tree.', zh: '树上有一只蜜蜂。' },
      { art: '🐝🐝🐝', en: 'Three green bees!', zh: '三只绿蜜蜂！' },
      { art: '🌙', en: 'The bees can see the moon.', zh: '蜜蜂们能看见月亮。' },
      { art: '🐝🌙', en: 'The bees sleep on the moon.', zh: '蜜蜂在月亮上睡着了。' },
      { art: '🐝', en: 'Three green feet!', zh: '三只绿色的小脚丫！' },
      { art: '🌙😴', en: 'Sleep, bees, sleep!', zh: '睡吧，蜜蜂，睡吧！' }
    ],
    quiz: [
      { q: '树上有什么？', opts: ['蜜蜂', '鸭子', '帽子'], a: 0 },
      { q: '有几只蜜蜂？', opts: ['一只', '三只', '两只'], a: 1 },
      { q: '蜜蜂睡在哪里？', opts: ['树上', '月亮上', '草地上'], a: 1 }
    ]
  },
  {
    id: 'b10', lv: 'L5', tag: 'ai · ay · oa', title: 'Rain, Train, Boat', zh: '雨、火车和船',
    emoji: '🚂', color: '#8B5CF6',
    sight: ['the', 'a', 'is', 'my', 'and', 'we', 'go'],
    newWords: [
      { w: 'rain', zh: '雨' }, { w: 'play', zh: '玩' }, { w: 'train', zh: '火车' },
      { w: 'road', zh: '路' }, { w: 'goat', zh: '山羊' }, { w: 'boat', zh: '船' },
      { w: 'away', zh: '离开' }, { w: 'today', zh: '今天' }
    ],
    pages: [
      { art: '🌧️', en: 'We play in the rain today.', zh: '今天我们在雨里玩。' },
      { art: '🌧️', en: 'Rain, rain, go away!', zh: '雨呀雨呀，快走开！' },
      { art: '🚂', en: 'A train! A train on the road!', zh: '一列火车！路上有列火车！' },
      { art: '⛵🐐', en: 'A goat is on the boat.', zh: '一只山羊在船上。' },
      { art: '🌧️', en: 'The goat and the train in the rain.', zh: '山羊和火车都在雨里。' },
      { art: '🐐🚂', en: 'Play, goat, play!', zh: '玩吧，山羊，玩吧！' },
      { art: '🌈', en: 'Go, train, go! Go, boat, go!', zh: '开吧，火车！开吧，船！' }
    ],
    quiz: [
      { q: '大家今天在哪里玩？', opts: ['雨里', '泥巴里', '月亮上'], a: 0 },
      { q: '谁在船上？', opts: ['山羊', '鸭子', '蜜蜂'], a: 0 },
      { q: '雨歌里雨要去哪里？', opts: ['快走开', '快下来', '快睡觉'], a: 0 }
    ]
  },
  {
    id: 'b11', lv: 'L6', tag: '魔法 e', title: 'Cake on a Lake', zh: '湖上的蛋糕',
    emoji: '🎂', color: '#D4537E',
    sight: ['the', 'a', 'is', 'my', 'and', 'we'],
    newWords: [
      { w: 'cake', zh: '蛋糕' }, { w: 'plate', zh: '盘子' }, { w: 'lake', zh: '湖' },
      { w: 'five', zh: '五' }, { w: 'ducks', zh: '鸭子们' }, { w: 'like', zh: '喜欢' },
      { w: 'rice', zh: '米饭' }, { w: 'grapes', zh: '葡萄' }
    ],
    pages: [
      { art: '🎂', en: 'A cake on a plate.', zh: '盘子上有个蛋糕。' },
      { art: '🎂🏞️', en: 'The cake is on the lake!', zh: '蛋糕漂在湖上！' },
      { art: '🦆🦆', en: 'Five ducks in the lake.', zh: '湖里有五只鸭子。' },
      { art: '🦆🎂', en: 'The ducks like the cake.', zh: '鸭子们喜欢蛋糕。' },
      { art: '🍚🍇', en: 'Rice and grapes on the plate!', zh: '盘子上还有米饭和葡萄！' },
      { art: '🎂🏞️', en: 'Cake on the lake! Cake on the plate!', zh: '湖上有蛋糕！盘子上有蛋糕！' },
      { art: '🦆', en: 'The ducks like cake and grapes.', zh: '鸭子们喜欢蛋糕和葡萄。' }
    ],
    quiz: [
      { q: '蛋糕在哪里？', opts: ['湖上', '树上', '盒子里'], a: 0 },
      { q: '湖里有几只鸭子？', opts: ['三只', '五只', '十只'], a: 1 },
      { q: '盘子上还有什么？', opts: ['米饭和葡萄', '薯条', '鸡蛋'], a: 0 }
    ]
  },
  {
    id: 'b12', lv: 'L7', tag: 'ar · or · ir', title: 'The Star Car', zh: '星星汽车',
    emoji: '🚗', color: '#D85A30',
    sight: ['the', 'a', 'is', 'my', 'and', 'we'],
    newWords: [
      { w: 'car', zh: '汽车' }, { w: 'farm', zh: '农场' }, { w: 'horse', zh: '马' },
      { w: 'bird', zh: '鸟' }, { w: 'drive', zh: '开（车）' }, { w: 'star', zh: '星星' },
      { w: 'dark', zh: '黑暗的' }, { w: 'girl', zh: '女孩' }
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
      { q: '汽车在哪里？', opts: ['农场', '湖里', '商店'], a: 0 },
      { q: '谁坐进汽车里了？', opts: ['马', '鸭子', '猪'], a: 0 },
      { q: '最后什么落在了汽车上？', opts: ['星星', '蛋糕', '假发'], a: 0 }
    ]
  },
  {
    id: 'b13', lv: 'L8', tag: '视觉词', title: 'Where Is the Duck?', zh: '鸭子去哪儿了',
    emoji: '🔍', color: '#6366F1',
    sight: ['the', 'a', 'is', 'my', 'and', 'we', 'what', 'where', 'out', 'now',
            'come', 'one', 'two', 'you', 'are', 'all'],
    newWords: [
      { w: 'it', zh: '它' }, { w: 'duck', zh: '鸭子' }, { w: 'three', zh: '三' },
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
      { q: '“Where is the duck?” 是什么意思？', opts: ['鸭子在哪儿？', '鸭子几岁？', '鸭子会飞吗？'], a: 0 },
      { q: '一共有几只鸭子？', opts: ['一只', '三只', '两只'], a: 1 },
      { q: '“Come out” 是什么意思？', opts: ['出来', '进去', '坐下'], a: 0 }
    ]
  },
  {
    id: 'b14', lv: 'L9', tag: '综合复习', title: 'A Big Day', zh: '了不起的一天',
    emoji: '🌅', color: '#0F6E56',
    sight: ['the', 'a', 'is', 'my', 'and', 'we', 'go', 'day', 'for'],
    newWords: [
      { w: 'farm', zh: '农场' }, { w: 'horse', zh: '马' }, { w: 'duck', zh: '鸭子' },
      { w: 'pig', zh: '猪' }, { w: 'run', zh: '跑' }, { w: 'dig', zh: '挖' },
      { w: 'sing', zh: '唱歌' }, { w: 'car', zh: '汽车' }, { w: 'sun', zh: '太阳' }
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
      { q: '大家今天去哪里？', opts: ['农场', '商店', '学校'], a: 0 },
      { q: '鸭子会做什么？', opts: ['跑和唱', '挖土', '开车'], a: 0 },
      { q: '谁坐进了汽车里？', opts: ['马', '猪', '鸭子'], a: 0 }
    ]
  },
  {
    id: 'b15', lv: 'L9', tag: '毕业读物', title: 'We Can Read!', zh: '我们会读书啦！',
    emoji: '📖', color: '#534AB7',
    sight: ['the', 'a', 'is', 'my', 'and', 'we', 'can', 'I', 'read'],
    newWords: [
      { w: 'see', zh: '看见' }, { w: 'cat', zh: '猫' }, { w: 'hen', zh: '母鸡' },
      { w: 'pig', zh: '猪' }, { w: 'frog', zh: '青蛙' }, { w: 'crab', zh: '螃蟹' },
      { w: 'book', zh: '书' }, { w: 'big', zh: '大的' }, { w: 'too', zh: '也' }
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
      { q: '故事里提到了哪些动物？', opts: ['猫、母鸡、猪、青蛙、螃蟹、蜜蜂', '只有猫', '狗和马'], a: 0 },
      { q: '蜜蜂会读书吗？', opts: ['不会', '会', '故事里没说'], a: 0 }
    ]
  }
];

window.BOOKS = BOOKS;
