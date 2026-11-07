/* 人教版课本 · 单元知识点讲解
   讲法借鉴《英语思维是这样炼成的》的核心观点（英语重框架、先主语后动词、
   时态是时间轴、词形跟着角色变），全部换成小学生能听懂的话。
   每条：t 一句话标题 / kid 讲解 / tip 口诀 / en 课本例句 / zh 例句翻译 */
const PEP_POINTS = {
  pep3a: {
    u1: [
      { t: '英语的"我是"不能拆', kid: '中文说"我叫小明"，英语要先说"我"，再说"是"：I am Xiaoming。I 就是你自己——英语的句子几乎都要先有 I / you / he / she 这样的小主人，说完主人再说什么事。', tip: '英语先报主人，再说话', en: 'I am your friend.', zh: '我是你的朋友。' },
      { t: '问名字 = 名字"是什么"', kid: '问名字用 What is your name?（你的名字是什么？）——英语爱把问题变成"是什么"。回答时直接 My name is...（我的名字是……），不用再绕弯。', tip: '问名字 = 名字是什么', en: 'What is your name?', zh: '你叫什么名字？' },
      { t: '小命令不用主语', kid: 'Share!（分享）Listen!（听）Help!（帮帮忙）——让别人做事时，英语把主语"你"藏起来，直接说动词，像喊口号一样干脆有力。', tip: '命令句，动词打头阵', en: 'Listen and share.', zh: '倾听并分享。' },
    ],
    u2: [
      { t: 'This is... 万能介绍法', kid: '介绍家里人，英语一律 This is...（这是……），不用管他是谁。This 就是"往这一指"，指到谁介绍谁。', tip: '伸手一指 This is', en: 'This is my mother.', zh: '这是我妈妈。' },
      { t: 'grand = 跳一代', kid: 'grandfather = grand（隔一代的）+ father（爸爸）= 爷爷或外公。grand 就像"跳了一级"，grandma、grandpa 都是这样变出来的。', tip: 'grand = 跳一代', en: 'This is my grandfather.', zh: '这是我爷爷。' },
      { t: 'family 藏着一句情话', kid: 'f-a-m-i-l-y = Father And Mother I Love You（爸爸妈妈我爱你们）——这是最有名的单词记忆法，把全家装进一个词里。', tip: 'family 藏着一句情话', en: 'I have a big family.', zh: '我有一个大家庭。' },
    ],
    u3: [
      { t: '一个用 is，一群用 are', kid: '一只猫 It is a cat. 一群猫 They are cats.——英语管"几个"管得很严：一个 is，两个以上 are，而且名字后面要加 s 变复数。', tip: '单数 is，复数 are 加 s', en: 'They are cute animals.', zh: '它们是可爱的动物。' },
      { t: 'like 是个小钩子', kid: '我喜欢狗：I like dogs.——like 后面直接挂喜欢的东西，不需要加"是"。喜欢一类东西时，狗要变成 dogs（复数）。', tip: 'like 一勾，挂上名词', en: 'I like dogs and cats.', zh: '我喜欢狗和猫。' },
      { t: '形容词是名词的标签', kid: 'giraffe is tall（长颈鹿高），rabbit is fast（兔子快）——这类词叫形容词，专门给名词"贴标签"，告诉你它长什么样。', tip: '形容词 = 名词的标签', en: 'The giraffe is tall.', zh: '长颈鹿很高。' },
    ],
    u4: [
      { t: 'can 罩住的动词不变身', kid: 'I can water the flowers.——can（能）后面接的动词永远是原样，不能加 s 也不能变形。can 像一个保护罩，罩住动词。', tip: 'can 罩住的动词不变身', en: 'I can water the flowers.', zh: '我会浇花。' },
      { t: '动词后面换宾格', kid: 'give them sun（给它们阳光）——them 是"它们"站在动词后面时的样子。人称有两个站位：干活的位子用 they，被动作够到的位子用 them。', tip: '动词后面换宾格', en: 'I can give them sun.', zh: '我可以给它们阳光。' },
      { t: '名词动词一肩挑', kid: 'water 既是"水"也是"浇水"——英语爱让一个词身兼两职。浇花 = water the flowers，直接把"水"当动词用！', tip: '名词动词一肩挑', en: 'We can water the grass.', zh: '我们可以浇草。' },
    ],
    u5: [
      { t: '颜色是名词的外衣', kid: 'a red apple（一个红苹果）——颜色词放在名词前面，像给苹果穿衣服。英语的顺序：先穿衣服（颜色），再说是谁（名词）。', tip: '颜色衣，穿在名词前', en: 'I see a yellow duck.', zh: '我看见一只黄鸭子。' },
      { t: 'make = 变出来', kid: 'red and yellow make orange（红 + 黄 = 橙）——make 在这里是"变成、做出"。颜色混合是 make 的经典用法。', tip: 'make = 变出来', en: 'Red and yellow make orange.', zh: '红色和黄色变成橙色。' },
      { t: 'some 不挑食', kid: 'some water（一些水）、some ducks（几只鸭子）——some 表示"一些"，可数的、不可数的都能带，是个万能词。', tip: 'some 不挑可数不可数', en: 'I can see some birds at sea.', zh: '我能在海上看见一些鸟。' },
    ],
    u6: [
      { t: '问年龄 = 你多"老"', kid: 'How old are you?——英语问年龄不问"多大"，问"多老"。回答 I am six (years old).，years old 平时可以省略。', tip: '问年龄 = 你多老', en: 'I am six years old.', zh: '我六岁。' },
      { t: '超过 1 就加 s', kid: 'six years old 里 year 加了 s——因为六岁要一年一年数好多次。但如果正好 1 岁：one year old，就不加 s！', tip: '超过 1 就加 s', en: 'My brother is one year old.', zh: '我弟弟一岁。' },
      { t: "o'clock 只管整点", kid: "seven o'clock（七点整）——o'clock 是 of the clock 的缩写，只报整点。几点半、几点几分就不能用它了。", tip: "o'clock 只管整点", en: "It is seven o'clock.", zh: '七点了。' },
    ],
  },
  pep3b: {
    u1: [
      { t: '来自哪里 = be from', kid: 'I am from China.——英语说"来自"用 be from，意思是"是……地方的人"。问别人：Where are you from?', tip: '来自 = be from', en: 'I am from China.', zh: '我来自中国。' },
      { t: '男 he 女 she', kid: 'he 他 / she 她——男生用 he，女生用 she，绝不能混。它们的搭档也固定：he is / she is。', tip: '男 he 女 she，配 is', en: 'She is my teacher.', zh: '她是我的老师。' },
      { t: '国家名首字母要大写', kid: 'China 中国、Canada 加拿大、UK 英国——国家名字的首字母永远大写，这是英语的礼貌规矩。', tip: '国家名，抬头写', en: 'She is from Canada.', zh: '她来自加拿大。' },
    ],
    u2: [
      { t: '他她它，用 has', kid: 'I have a dog. 但 He has a dog.——第三人称单数（他/她/它）用 has，其他用 have。就像 he/she 要配 is 一样，has 是它的专属搭档。', tip: '他她它，用 has', en: 'He has a long tail.', zh: '它有一条长尾巴。' },
      { t: '反义词手拉手', kid: 'long 长 / short 短，fat 胖 / thin 瘦——反义词成对记，记一个送一个，单词量悄悄翻倍！', tip: '反义词，手拉手', en: 'The monkey has a long tail.', zh: '猴子有长尾巴。' },
      { t: 'for you = 给你', kid: '送礼物说 This gift is for you.——for 就是"给"的意思，比 give 更轻巧，不用动词就把"给"说了。', tip: 'for you = 给你', en: 'This card is for you.', zh: '这张卡片给你。' },
    ],
    u3: [
      { t: '五官自带动词', kid: 'see 看见（眼）、hear 听见（耳）、smell 闻（鼻）、taste 尝（舌）、touch 摸（手）——英语把五官直接变成了五个动词！', tip: '五官自带动词', en: 'I can see with my eyes.', zh: '我可以用眼睛看。' },
      { t: '多个 this 变 these', kid: 'this 这一个 / these 这些——复数版长出尾巴 s，读音也从"迪斯"变"迪兹"。指着一排书说：These are my books.', tip: '多个 this 变 these', en: 'These are my books.', zh: '这些是我的书。' },
      { t: '固定搭配整块记', kid: 'in class（在课堂上）不加 the——固定搭配像成语，说的时候整块拿出来用，不要自己改。', tip: '固定搭配整块记', en: 'We learn in class.', zh: '我们在课堂上学习。' },
    ],
    u4: [
      { t: '三餐交给 have', kid: 'have breakfast（吃早餐）——英语吃三餐固定用 have。have 是英语里最忙的词：有、吃、喝都归它管。', tip: '三餐交给 have', en: 'I have milk and bread for breakfast.', zh: '我早餐喝牛奶吃面包。' },
      { t: 'health + y = 健康的', kid: 'healthy food（健康食物）——healthy 是形容词，贴在 food 前面。它的老家是 health（健康）+ y。', tip: 'health + y = 健康的', en: 'Vegetables are healthy food.', zh: '蔬菜是健康食物。' },
      { t: '面条筷子爱复数', kid: 'noodles（面条）常用复数——一根太少，我们吃的总是"许多根"！chopsticks 筷子也是一双两根一起。', tip: '面条筷子爱复数', en: 'I like noodles.', zh: '我喜欢面条。' },
    ],
    u5: [
      { t: '介词是位置照片', kid: 'in 在里面 / on 在上面 / under 在下面——介词就像给物品拍位置照片：in the box 是在盒子里面。', tip: 'in 里 on 上 under 下', en: 'The ball is under the box.', zh: '球在盒子下面。' },
      { t: 'put 完说地点', kid: 'put it on the shelf（把它放到架子上）——put 后面要交代"放到哪"，介词短语要跟上，不然句子没说完。', tip: 'put 完说地点', en: 'Put the cap on the box.', zh: '把帽子放盒子上。' },
      { t: 'still 藏在句中', kid: 'still（还是、仍然）——它常躲在句子中间：It is still here.（它还在这里。）找它去句子中间找。', tip: 'still 藏句中', en: 'It is still here.', zh: '它还在这里。' },
    ],
    u6: [
      { t: '-teen 就是"十几"', kid: 'thirteen 十三 = three + teen，fourteen = four + teen……13 到 19 都带 -teen 尾巴，看到 teen 就是"十几"。', tip: '-teen = 十几', en: 'I am thirteen.', zh: '我十三岁。' },
      { t: '-teen 13，-ty 30', kid: 'twenty 二十、thirty 三十……整十数都以 -ty 结尾。thirteen 13 / thirty 30 长得像，千万别混！', tip: '-teen 13，-ty 30', en: 'There are twenty students.', zh: '有二十个学生。' },
      { t: 'pay = 付钱', kid: 'pay（付费）——买东西付钱用 pay。piggy bank 猪形储钱罐，把零钱一枚一枚存进去。', tip: 'pay = 付钱', en: 'I pay with my pocket money.', zh: '我用零花钱付。' },
    ],
  },
  pep4a: {
    u1: [
      { t: '职业必戴 a/an', kid: 'She is a doctor.——英语说职业必须戴 a 或 an 的"帽子"：a doctor、an office worker。中文可以不戴，英语必须戴！', tip: '职业必戴 a/an', en: 'My mother is a nurse.', zh: '我妈妈是护士。' },
      { t: '忙完就 tired', kid: 'busy 忙碌的、tired 累的——忙碌之后就是累。be busy（很忙）、be tired（累了），中间的 be 是"是"。', tip: '忙完就 tired', en: 'Dad is busy today.', zh: '爸爸今天很忙。' },
      { t: '看在后面 = 照顾', kid: 'look after my grandmother（照顾我奶奶）——look 是看，after 是在后面，"看在后面" = 照看、照顾。', tip: '看在后面 = 照顾', en: 'I look after my sister.', zh: '我照顾妹妹。' },
    ],
    u2: [
      { t: 'his 一个词两个活', kid: 'his hair（他的头发）——his 放在名词前是"他的"；That book is his.（那本书是他的）单独用就代表"他的东西"。', tip: '名词前 = 他的', en: 'His hair is short.', zh: '他的头发很短。' },
      { t: '频度词贴着动词', kid: 'He always reads.——always（总是）这类频率词住在动词前面，像贴身小跟班：always / usually / sometimes。', tip: '频度词贴着动词', en: 'He always plays football.', zh: '他总是踢足球。' },
      { t: 'best 是冠军版', kid: 'best 最好的——my best friend 我最好的朋友。best 是 good 比赛出来的冠军，前面通常有 my/his 这类词陪着。', tip: 'best = 最好的', en: 'He is my best friend.', zh: '他是我最好的朋友。' },
    ],
    u3: [
      { t: '存在用 there be', kid: 'There is a park.——英语说"有"分两种：拥有用 have（我有），某地存在用 there be（那里有）。there 就是"那里"。', tip: '存在用 there be', en: 'There is a library in my community.', zh: '我们社区有一个图书馆。' },
      { t: '看后面定 is/are', kid: 'There is a shop. / There are two parks.——there be 的单复数由后面的东西决定：一个 is，多个 are。', tip: '看后面定 is/are', en: 'There are two hospitals.', zh: '有两家医院。' },
      { t: 'favourite 前置', kid: 'My favourite place is the park.——favourite（最喜欢的）直接放名词前面，不用再加 most，一个词顶三个词。', tip: 'favourite 一个顶仨', en: 'My favourite place is the library.', zh: '我最喜欢的地方是图书馆。' },
    ],
    u4: [
      { t: 'why 问 because 答', kid: 'Why?（为什么）→ Because...（因为……）——why 和 because 是一对好朋友，一个负责问，一个负责答，成对出现。', tip: 'why 问 because 答', en: 'Why? Because they help us.', zh: '为什么？因为他们帮助我们。' },
      { t: 'a lot of = 大量', kid: 'a lot of people（很多人）——a lot of 表示"大量"，可数不可数都能带，比 many/much 更常用。', tip: 'a lot of 大概很多', en: 'There are a lot of people.', zh: '有许多人。' },
      { t: '长职业拆开记', kid: 'police officer 警察 = police（警方）+ officer（官员）——英语职业名有的很长，拆成两半记就不怕了。firefighter = fire（火）+ fighter（战士）。', tip: '长职业拆开记', en: 'The police officer helps me.', zh: '警察帮助我。' },
    ],
    u5: [
      { t: '天气让 it 开头', kid: 'It is sunny.——说天气时英语让 it 打头阵。这个 it 不指任何东西，就是个"万能开头"，相当于中文的"今天"。', tip: '天气 it 开头', en: 'It is windy today.', zh: '今天多风。' },
      { t: '天气词多半带 y', kid: 'sun→sunny 晴、rain→rainy 雨、wind→windy 风、snow→snowy 雪、cloud→cloudy 阴——天气名词加 y 就变成形容词！', tip: '天气词多半带 y', en: 'It is rainy in Sydney.', zh: '悉尼在下雨。' },
      { t: '位置变，意思变', kid: 'cold 冷的（形容词）/ a cold 感冒（名词）——have a cold 感冒了。同一个词，站的位置不同，意思就不同。', tip: '位置变，意思变', en: 'It is cold. I have a cold.', zh: '天很冷。我感冒了。' },
    ],
    u6: [
      { t: 'whose 问主人', kid: 'Whose sweater is it?——whose 专门问"属于谁"。回答：It is mine.（我的）/ It is his.（他的）。', tip: 'whose 问主人', en: 'Whose coat is it?', zh: '这是谁的大衣？' },
      { t: 'mine = my + 东西', kid: 'mine = my + 名词的合体，后面不再跟名词：This sweater is mine.（毛衣是我的）对比 my sweater（我的毛衣）。', tip: 'mine 后面不跟名词', en: 'The blue sweater is mine.', zh: '那件蓝毛衣是我的。' },
      { t: '春夏秋冬转圈圈', kid: 'spring 春 → summer 夏 → autumn 秋 → winter 冬——四季是个循环，转完再来一轮。get together 聚在一起，冬天家人团聚。', tip: '春夏秋冬转圈圈', en: 'We get together in winter.', zh: '我们冬天团聚。' },
    ],
  },
  pep4b: {
    u1: [
      { t: '规则句动词开头', kid: 'Turn off the light. Tidy the classroom.——规则、命令用祈使句，动词打头，不用主语。要否定就在最前面加 Don\'t！', tip: '规则句动词开头', en: 'Turn off the light, please.', zh: '请关灯。' },
      { t: 'late for + 地点', kid: 'be late for class（上课迟到）——late 后面用 for 接迟到的地方。hurry up 快点，就是怕 be late！', tip: 'late for + 地点', en: 'Don\'t be late for class.', zh: '上课别迟到。' },
      { t: 'when = 什么时候', kid: 'When do we go home?——when 专门问时间。回答用时间点：At five.（五点。）', tip: 'when = 什么时候', en: 'When do we hand out the newspapers?', zh: '我们什么时候发报纸？' },
    ],
    u2: [
      { t: 'first 先 then 后', kid: 'First do homework, then watch TV.——first（首先）、then（然后），把事情按顺序串起来，讲故事、排流程都用它。', tip: 'first 先 then 后', en: 'First do homework, then watch TV.', zh: '先写作业，再看电视。' },
      { t: '-ful = 充满', kid: 'helpful 乐于助人的 = help（帮助）+ ful（充满）= 充满帮助的。-ful 结尾的形容词一大帮：careful 小心的、useful 有用的。', tip: '-ful = 充满', en: 'My sister is helpful.', zh: '我妹妹乐于助人。' },
      { t: 'follow = 跟着', kid: 'follow the rules（遵守规则）——follow 是"跟随"，规则要"跟"着走，很形象吧！', tip: 'follow = 跟着', en: 'We follow the family rules.', zh: '我们遵守家规。' },
    ],
    u3: [
      { t: '时间前面戴 at', kid: 'at seven o\'clock（在七点）——具体时刻前面用 at。at six / at seven thirty。', tip: '时间前面戴 at', en: 'I get up at six o\'clock.', zh: '我六点起床。' },
      { t: '三餐不戴帽子', kid: 'have breakfast / have lunch / have dinner——三餐名字前面一般不加 a/the，它们"裸奔"。', tip: '三餐裸奔不加冠词', en: 'We have lunch at school.', zh: '我们在学校吃午饭。' },
      { t: 'go home 不加 to', kid: 'go to school 上学 / go home 回家 / go to bed 睡觉——注意 go home 不加 to！home 是副词，直接跟在 go 后面。', tip: 'go home 不加 to', en: 'I go home at five.', zh: '我五点回家。' },
    ],
    u4: [
      { t: 'that 单 those 群', kid: 'this→these，that→those——"这"和"那"都有单复数两套：that 一个，those 一群。Those shoes are nice!（那些鞋真好看）', tip: 'that 单 those 群', en: 'Those trousers are large.', zh: '那些裤子是大号的。' },
      { t: '贵 exp 便 cheap', kid: 'expensive 昂贵的 / cheap 便宜的——购物最常用的一对反义词。问价：How much is it?', tip: '贵 exp 便 cheap', en: 'This hat is cheap.', zh: '这顶帽子便宜。' },
      { t: '代词夹中间', kid: 'try on the shoes / try them on——代词 them 要夹在短语中间！try it on ✓ / try on it ✗。这是英语短语的小脾气。', tip: '代词夹中间', en: 'Can I try them on?', zh: '我能试穿吗？' },
    ],
    u5: [
      { t: 'sheep 永远不变', kid: 'cow→cows、horse→horses 直接加 s；sheep→sheep 绵羊单复数一样！mouse→mice 老鼠大变身。英语复数有规矩也有例外。', tip: 'sheep 永远不变', en: 'There are ten sheep on the farm.', zh: '农场有十只羊。' },
      { t: '动物肉类一个词', kid: 'chicken 鸡 / chicken 鸡肉——动物和它的肉常常同一个词，fish 也一样！靠句子判断说的是"活的"还是"吃的"。', tip: '动物肉类一个词', en: 'The chicken is on the farm. We eat chicken.', zh: '鸡在农场。我们吃鸡肉。' },
      { t: 'a ... of 计量', kid: 'a box of milk（一盒牛奶）、a pair of（一双）——英语量东西用 "a + 量词 + of + 名词"。', tip: 'a ... of 计量', en: 'I want a box of milk.', zh: '我要一盒牛奶。' },
    ],
    u6: [
      { t: 'feed = 给 food', kid: 'feed 喂 = food（食物）的动词版——给食物就是喂养。词形长得像，意思就连着。', tip: 'feed = 给 food', en: 'I feed the cow.', zh: '我喂奶牛。' },
      { t: '筷子复数两根齐', kid: 'chopstick 常用复数 chopsticks——筷子一双两根！knife 刀 / fork 叉，西餐一人一套刀叉。', tip: '筷子复数两根齐', en: 'Pass me the chopsticks, please.', zh: '请递给我筷子。' },
      { t: 'from 起点to 终点', kid: 'From farm to table（从农场到餐桌）——from A to B 描述起点和终点，空间、时间都能用。', tip: 'from 起点to 终点', en: 'From farm to table.', zh: '从农场到餐桌。' },
    ],
    num: [
      { t: '数词是拼读的拼图', kid: 'thirteen = three + teen，fifteen = five + teen——数字词是最好拼的词！thirty、forty、fifty 是整十，hundred 是一百。', tip: '数词 = 拼图游戏', en: 'One hundred!', zh: '一百！' },
      { t: '数词不用复数', kid: 'three hundred（三百）——hundred 前面有数字时不加 s！只有 hundreds of（成百上千的）才加。', tip: '有数字，hundred 裸奔', en: 'There are three hundred students.', zh: '有三百个学生。' },
    ],
  },
  pep5a: {
    u1: [
      { t: 'be + 性格标签', kid: 'He is clever.——描述人的样子，永远 be 动词打头：is/am/are + clever/lovely/young。先说"是"，再说是什么样的。', tip: 'be + 性格标签', en: 'My robot is clever.', zh: '我的机器人很聪明。' },
      { t: '两词拉手要连字符', kid: 'hard-working 努力的 = hard（努力）+ working（工作）——两个词手拉手变形容词，中间用连字符"-"牵手。', tip: '两词拉手要连字符', en: 'She is hard-working.', zh: '她很努力。' },
      { t: '球不 the，琴要 the', kid: 'play chess 下棋 / play the piano 弹钢琴——球类运动不加 the，乐器前面必须加 the！这是英语的怪规矩。', tip: '球不 the，琴要 the', en: 'I play the piano and he plays chess.', zh: '我弹钢琴他下棋。' },
    ],
    u2: [
      { t: '情绪 = be + 心情词', kid: 'I am sad. / She is worried.——情绪表达永远是 be + sad/happy/angry/excited/afraid。你的情绪，英语用"是"来连接。', tip: '情绪 = be + 词', en: 'Don\'t be sad.', zh: '别难过。' },
      { t: '怎么了问 matter', kid: 'What is the matter?（怎么了？）——问别人遇到什么麻烦的固定句型。回答：I am worried about my test.（我担心考试。）', tip: '怎么了问 matter', en: 'What is the matter?', zh: '你怎么了？' },
      { t: 'both 二 all 多', kid: 'both 两个都 / all 全都——both 只管两个，三个以上交给 all：We are both excited.（我们俩都很兴奋。）', tip: 'both 二 all 多', en: 'We are both excited.', zh: '我们俩都很兴奋。' },
    ],
    u3: [
      { t: '星期名，抬头写', kid: 'Monday 周一 ... Sunday 周日——星期名首字母大写。Sunday = sun（太阳）+ day（日），星期天是太阳日！', tip: '星期名，抬头写', en: 'We have a science lesson on Monday.', zh: '我们周一上科学课。' },
      { t: '实前 be 后', kid: 'He usually starts at nine.（实义动词前）/ He is usually free.（be 动词后）——频率词 usually/sometimes 的站位口诀：实前 be 后。', tip: '实前 be 后', en: 'He usually visits grandparents.', zh: '他通常看望祖父母。' },
      { t: 'because 交理由', kid: 'I like Friday because we have a PE lesson.——because 后面交出完整的理由，和 why 一问一答。', tip: 'because 交理由', en: 'I like Monday because I have a maths lesson.', zh: '我喜欢周一因为有数学课。' },
    ],
    u4: [
      { t: 'should 该，劝人好', kid: 'You should drink water.——should 该/应该，给建议不用命令，用 should 更礼貌。否定 shouldn\'t = 不该。', tip: 'should 该，劝人好', en: 'You should exercise every day.', zh: '你该每天锻炼。' },
      { t: 'once 一 twice 二', kid: 'twice a day（一天两次）——once 一次、twice 两次、三次起用 three times。刷牙要 brush teeth twice a day！', tip: 'once 一 twice 二', en: 'Brush your teeth twice a day.', zh: '一天刷两次牙。' },
      { t: '名前形后', kid: 'enough sleep 足够的睡眠（enough 在名词前）/ old enough（enough 在形容词后）——enough 的位置口诀：名前形后。', tip: '名前形后', en: 'Get enough sleep every night.', zh: '每晚睡够觉。' },
    ],
    u5: [
      { t: '饥饿 + y = 饿的', kid: 'hungry 饿的 = hunger（饥饿）+ y。I am hungry.——身体的感觉也用 be + 形容词表达。', tip: '饥饿 + y = 饿的', en: 'I am hungry.', zh: '我饿了。' },
      { t: 'little 管不可数', kid: 'a little tea 一点茶——little 修饰不可数名词。tea / water / rice / money 都不可数，没有复数！', tip: 'little 管不可数', en: 'I drink a little tea.', zh: '我喝一点茶。' },
      { t: 'different = 不一样', kid: 'different ways 不同的方式——different（不同的）来自 differ（不同）。世界各地的食物 different foods。', tip: 'different = 不一样', en: 'The world has different foods.', zh: '世界有不同的食物。' },
    ],
    u6: [
      { t: '-ous = 充满', kid: 'famous 著名的 = fame（名声）+ ous；dangerous 危险的 = danger + ous。-ous 后缀 = 充满……的。', tip: '-ous = 充满', en: 'The mountain is famous.', zh: '这座山很有名。' },
      { t: '山高 high 人高 tall', kid: 'high 用于山、建筑；tall 用于人、树这类细高的——英语连"高"都分两种！', tip: '山高 high 人高 tall', en: 'The mountain is high.', zh: '山很高。' },
      { t: 'before 前 after 后', kid: 'before dinner 晚饭前——before + 名词 = 在……之前，反义词 after 在……之后。时间顺序全靠它们。', tip: 'before 前 after 后', en: 'Wash hands before dinner.', zh: '晚饭前洗手。' },
    ],
  },
  pep5b: {
    u1: [
      { t: 'must 必须别商量', kid: 'You must wait in line.——must 比 should 更强硬，是"必须"。否定 mustn\'t = 千万不要（禁止）！', tip: 'must 必须别商量', en: 'You must return the book.', zh: '你必须归还书。' },
      { t: 'borrow 借入 lend 借出', kid: 'borrow a book from the library（从图书馆借书）——borrow 借入、lend 借出，方向相反用词不同！', tip: 'borrow 借入 lend 借出', en: 'I borrow books from the library.', zh: '我从图书馆借书。' },
      { t: '排队 stand in line', kid: 'stand in line 站队排队——stand（站）+ in line（成一排）。wait for your turn 等轮到你。', tip: '排队 stand in line', en: 'Please stand in line.', zh: '请排队。' },
    ],
    u2: [
      { t: 'between 夹中间', kid: 'next to 紧挨着 / between 在两者之间 / behind 在后面——方位介词全家福，描述位置它们最常用！', tip: 'between 夹中间', en: 'The cinema is next to the park.', zh: '电影院紧挨着公园。' },
      { t: 'far 后必跟 from', kid: 'My home is far from the school.——far（远）后面必须跟 from，距离感全靠它撑着。', tip: 'far 后必跟 from', en: 'The station is far from here.', zh: '车站离这儿远。' },
      { t: 'turn 转弯 on 在边', kid: 'turn left 向左转 / on the left 在左边——turn 管"转向"，on the left 管"在左侧的位置"，分工明确。', tip: 'turn 转弯 on 在边', en: 'Turn left at the station.', zh: '在车站左转。' },
    ],
    u3: [
      { t: '月份抬头写', kid: 'January 一月来自双面门神 Janus（一张脸看旧年，一张脸看新年）；March 三月来自战神 Mars。月份首字母大写！', tip: '月份抬头写', en: 'My birthday is in May.', zh: '我的生日在五月。' },
      { t: 'in 大 on 具体天', kid: 'in May（在五月）/ on May 1st（在五月一日）——大时间用 in（月、季、年），具体某一天用 on。', tip: 'in 大 on 具体天', en: 'The party is in June.', zh: '聚会在六月。' },
      { t: 'festival 节 day 日', kid: 'Dragon Boat Festival 端午节 / National Day 国庆节——festival 是"节"，day 是"日/纪念日"。', tip: 'festival 节 day 日', en: 'We eat zongzi at the Dragon Boat Festival.', zh: '端午节我们吃粽子。' },
    ],
    u4: [
      { t: 'home + town = 家乡', kid: 'hometown 家乡 = home（家）+ town（镇）——家所在的城镇就是家乡。', tip: 'home+town=家乡', en: 'My hometown is by the sea.', zh: '我的家乡在海边。' },
      { t: 'wish + to do', kid: 'I wish to travel.——wish（希望）+ to do，希望做某事。hope 和 wish 是一对兄弟。', tip: 'wish + to do', en: 'I wish to see the pyramids.', zh: '我希望看金字塔。' },
      { t: 'even 加强语气', kid: 'even 甚至——Even the camel can run.（连骆驼都能跑。）even 用来加强语气，"连……都"。', tip: 'even = 连…都', en: 'Even the kangaroo can jump far.', zh: '连袋鼠都跳得远。' },
    ],
    u5: [
      { t: 'by 车 on foot 走', kid: 'by plane 坐飞机 / by bike 骑车 / by underground 坐地铁——交通方式用 by。但步行特立独行：on foot！', tip: 'by 车 on foot 走', en: 'We go by plane.', zh: '我们坐飞机去。' },
      { t: 'hurt 三态不变', kid: 'My leg hurts.——hurt 的过去式还是 hurt（hurt-hurt-hurt），变不变都一样，是"懒词"。', tip: 'hurt 三态不变', en: 'My foot hurts.', zh: '我的脚疼。' },
      { t: 'health 名 healthy 形', kid: 'health 健康（名词）/ healthy 健康的（形容词）——词性变了拼写也变：keep healthy 保持健康。', tip: 'health 名 healthy 形', en: 'Walking is good for health.', zh: '散步有益健康。' },
    ],
    u6: [
      { t: 'plan 名动两用', kid: 'make a travel plan 制定旅行计划——plan 既是名词（计划）也是动词（计划）。plan to do 计划做某事。', tip: 'plan 名动两用', en: 'We plan to visit Beijing.', zh: '我们计划去北京。' },
      { t: 'history = 他的故事', kid: 'history 历史 = his + story（故事）——历史就是人类的故事！这个拆法最好记。', tip: 'history = 他的故事', en: 'Beijing has a long history.', zh: '北京历史悠久。' },
      { t: 'information 不可数', kid: 'information 信息——不可数！一条信息 = a piece of information，不能加 s。', tip: 'information 不可数', en: 'We get information on the internet.', zh: '我们从互联网获取信息。' },
    ],
  },
  pep6a: {
    u1: [
      { t: '过去 is/am 变 was', kid: 'I was in Paris last year.——说过去的事，is/am 变 was，are 变 were。时间旅行，动词跟着换装！', tip: '过去 is/am 变 was', en: 'I was in Paris last year.', zh: '去年我在巴黎。' },
      { t: '规则加 ed 不规则换脸', kid: '规则队加 -ed：climb→climbed；不规则队整个换脸：go→went、eat→ate、see→saw。不规则队要单独记！', tip: '规则加 ed 不规则换脸', en: 'I climbed the mountain.', zh: '我爬了山。' },
      { t: 'take 拍 send 发', kid: 'take pictures 拍照 / send pictures 发照片——take 负责拍，send 负责发，两个动作接力把美景分享出去！', tip: 'take 拍 send 发', en: 'I took pictures and sent them.', zh: '我拍了照片并发送了。' },
    ],
    u2: [
      { t: 'yesterday = 过去式信号灯', kid: '看到 yesterday，动词立刻变过去式：sing→sang、wear→wore、win→won。时间词就是时态的信号灯！', tip: 'yesterday = 过去式信号灯', en: 'We sang and danced yesterday.', zh: '我们昨天唱歌跳舞了。' },
      { t: 'cheer for 加油', kid: 'Cheer up!（振作！）cheer for...（为……加油）——比赛时为队伍欢呼就是 cheer for them。', tip: 'cheer for 加油', en: 'We cheered for the winner.', zh: '我们为获胜者欢呼。' },
      { t: 'begin 过去式 began', kid: 'begin 开始 = start 开始，一对双胞胎。begin 的过去式是不规则的 began。', tip: 'begin 过去式 began', en: 'The race began at nine.', zh: '比赛九点开始。' },
    ],
    u3: [
      { t: 'have + 症状 = 生病', kid: 'have a fever 发烧 / have a cough 咳嗽 / have a runny nose 流鼻涕——"生病"都套 have + 症状，跟 have breakfast 一个套路。', tip: 'have + 症状 = 生病', en: 'I have a fever.', zh: '我发烧了。' },
      { t: 'stay up 站着不睡', kid: 'stay up late 熬到很晚——stay（待着）+ up（不躺下）= 熬夜。You shouldn\'t stay up late!', tip: 'stay up = 熬夜', en: 'You shouldn\'t stay up late.', zh: '你不该熬夜。' },
      { t: 'better = 更好', kid: 'better = good/well 的比较级。I feel better now.（我现在好多了。）——生病好转就用 better。', tip: 'better = 更好', en: 'I feel better today.', zh: '我今天感觉好多了。' },
    ],
    u4: [
      { t: 'manage = 管理好', kid: 'manage money well 管好钱——manage（管理）+ 名词。钱要管，时间也要管：manage your time。', tip: 'manage = 管理好', en: 'We should manage money well.', zh: '我们该管好钱。' },
      { t: 'save 攒钱又救人', kid: 'save up 攒钱 = save（节省）+ up（向上积累）。save 还有"拯救"的意思——save the earth 拯救地球！', tip: 'save 攒钱又救人', en: 'I save up for a ticket.', zh: '我为买票攒钱。' },
      { t: 'for example 举个例子', kid: 'for example 例如——举例子时用，缩写是 e.g.。后面直接跟例子。', tip: 'for example 举个例子', en: 'I save money, for example, in a jar.', zh: '我攒钱，比如存在罐子里。' },
    ],
    u5: [
      { t: 'space 太空也空隙', kid: 'space 太空 / 空间 / 空隙——outer space 外太空，space station 空间站。一个词管好几层意思。', tip: 'space 太空也空隙', en: 'The space station is in outer space.', zh: '空间站在外太空。' },
      { t: 'moon 走一圈 = month', kid: 'month 月 = moon（月亮）+ th——月份本来跟着月亮走，月亮圆缺一圈就是一个月！', tip: 'moon 走一圈 = month', en: 'The moon is bright tonight.', zh: '今晚月亮很亮。' },
      { t: 'astro 星星水手', kid: 'astronaut 宇航员 = astro（星星）+ naut（水手）——在星星间航行的人！中国的宇航员叫 taikonaut（太空 + naut）。', tip: 'astro 星星水手', en: 'The astronaut works in a spaceship.', zh: '宇航员在飞船里工作。' },
    ],
    u6: [
      { t: 'energy 不可数', kid: 'energy 能源——不可数名词！save energy 节约能源。electricity 电也是不可数，都不加 s。', tip: 'energy 不可数', en: 'We should save energy.', zh: '我们应该节约能源。' },
      { t: 'run out 跑光 = 用完', kid: 'run out 用完——run（跑）+ out（出去）= 跑光了 = 用完了。Energy will run out.（能源会用完。）', tip: 'run out 跑光 = 用完', en: 'Energy will run out.', zh: '能源会用完。' },
      { t: '三个 R 保护地球', kid: 'reduce 减少 / reuse 再利用 / recycle 回收——re- 前缀 = 再、又。环保三兄弟，首字母都是 R！', tip: '三个 R 保护地球', en: 'We reduce, reuse and recycle.', zh: '我们减少使用、重复利用和回收。' },
    ],
  },
  pep6b: {
    u1: [
      { t: 'er + than 比一比', kid: 'taller than 更高——比较两个东西，形容词加 er，再用 than（比）引出对象。big 要双写 g：bigger。', tip: 'er + than 比一比', en: 'I am taller than my brother.', zh: '我比哥哥高。' },
      { t: 'y 变 i 加 er', kid: 'heavy→heavier、happy→happier——辅音字母 + y 结尾的，变 y 为 i 再加 er。', tip: 'y 变 i 加 er', en: 'The elephant is heavier.', zh: '大象更重。' },
      { t: 'than 后接宾格', kid: 'I am taller than him.——than 后面的人用宾格 him。比较是"我"和"他"的公平对决！', tip: 'than 后接宾格', en: 'She is smarter than him.', zh: '她比他聪明。' },
    ],
    u2: [
      { t: '上周的事加 ed', kid: 'clean→cleaned、wash→washed、watch→watched——上周末做的事，动词全部加 ed。last weekend 是过去时的信号灯。', tip: '上周的事加 ed', en: 'I cleaned my room last weekend.', zh: '上周末我打扫了房间。' },
      { t: '不规则队见一个记一个', kid: 'do→did、have→had、sleep→slept、see→saw、drink→drank——不规则队没有公式，read 拼写不变但读音变（红→瑞德）！', tip: '不规则队见一个记一个', en: 'I had a cold and slept at home.', zh: '我感冒了在家睡觉。' },
      { t: 'last + 时间 = 过去', kid: 'last weekend 上周末 / last year 去年——last（上一个的）站在时间词前面，是过去时的好搭档。', tip: 'last + 时间 = 过去', en: 'Last weekend I watched TV.', zh: '上周末我看电视了。' },
    ],
    u3: [
      { t: 'did 扛过去，动词还原', kid: 'Where did you go?——疑问句里 did（do 的过去式）负责扛"过去"这个时间，后面的动词 go 就回原形！', tip: 'did 扛过去，动词还原', en: 'Where did you go?', zh: '你去了哪里？' },
      { t: 'go + ing 去活动', kid: 'go camping 去露营 / go fishing 去钓鱼 / go cycling 去骑行——go + 动词 ing = 去做某项活动。', tip: 'go + ing 去活动', en: 'We went fishing last Sunday.', zh: '上周日我们去钓鱼了。' },
      { t: 'take 拿走画面 = 拍照', kid: 'take pictures 拍照 = take（拿）+ pictures——把画面"拿"下来就是拍照！took 是 take 的过去式。', tip: 'take 拿走画面 = 拍照', en: 'I took many pictures.', zh: '我拍了很多照片。' },
    ],
    u4: [
      { t: 'then 那时 now 现在', kid: 'then 那时 / now 现在——对比过去和现在，动词用两套：过去式说从前，现在时说如今。', tip: 'then 那时 now 现在', en: 'Before, there was no gym. Now there is one.', zh: '以前没有体育馆。现在有了。' },
      { t: 'ago 站时间后面', kid: 'three years ago 三年前——ago（以前）站在时间词后面；before 站前面。位置别搞反！', tip: 'ago 站时间后面', en: 'There was a small school three years ago.', zh: '三年前有一所小学校。' },
      { t: 'nothing = 没有东西', kid: 'nothing = no + thing（没有东西）——Nothing is faster than the cheetah.（没有比猎豹更快的了。）', tip: 'nothing = 没有东西', en: 'Nothing is faster than the cheetah.', zh: '没有比猎豹更快的了。' },
    ],
  },
};
/* ---- 自然拼读拆块（全站统一：词卡展示、拼词游戏、单元拼读地图共用这套） ----
   常见字母组合：3 字母 → 2 字母 → 单字母，贪心切分。
   ear 的发音分两派：ear/hear/year 读 /ɪə/（整块科学），
   bear/wear/pear 读 /eə/、learn/early/earth 读 /ɜː/ —— 这些词整块 ear 会教错，
   例外表让它们退回 ea+r 切分（ea 在这些词里恰好读对应音）。 */
const PEP_TRIGRAPHS = ['old', 'air', 'ear', 'all', 'ell', 'ill', 'ing', 'ang', 'ong', 'ung', 'tion'];
const PEP_DIGRAPHS = ['ch', 'sh', 'th', 'ph', 'wh', 'ck', 'ng', 'qu', 'oo', 'ee', 'ea', 'ai', 'ay', 'oa', 'ow', 'ou', 'oi', 'oy', 'ar', 'or', 'er', 'ir', 'ur', 'll', 'ss', 'tt', 'ff', 'pp', 'rr', 'dd', 'st', 'sp', 'sk', 'tr', 'dr', 'cr', 'fr', 'gr', 'pr', 'br', 'pl', 'bl', 'cl', 'fl', 'gl', 'sl', 'sw', 'tw', 'sm', 'sn', 'nd', 'nk', 'nt', 'mp', 'ld', 'lt', 'ft', 'pt', 'lk', 'ei', 'eo'];
const EAR_NOT_IER = { bear: 1, wear: 1, pear: 1, learn: 1, early: 1, earth: 1, search: 1, heart: 1, swear: 1 };
function splitBlocks(w) {
  const s = String(w).toLowerCase().replace(/[^a-z]/g, '');
  const trigs = EAR_NOT_IER[s] ? PEP_TRIGRAPHS.filter(d => d !== 'ear') : PEP_TRIGRAPHS;
  const parts = [];
  let i = 0;
  while (i < s.length) {
    let hit = null;
    if (i + 4 <= s.length && s.startsWith('tion', i)) hit = 'tion';
    if (!hit && i + 3 <= s.length) hit = trigs.find(d => d !== 'tion' && s.startsWith(d, i)) || null;
    if (!hit) hit = PEP_DIGRAPHS.find(d => s.startsWith(d, i)) || null;
    parts.push(hit || s[i]);
    i += (hit || s[i]).length;
  }
  return parts;
}
/* 短语/连字符词分段：'look after'→['look','after']，'o'clock'→['o','clock'] */
function splitPhrase(w) { return String(w).toLowerCase().split(/[\s'’\-]+/).filter(Boolean); }
/* 词 → 拼读拆分展示串：look after → l · oo · k ／ a · ft · er */
function phonicsLine(w) { return splitPhrase(w).map(p => splitBlocks(p).join(' · ')).join(' ／ '); }

/* ---- 复合词趣味记（自动拆分高置信复合词，补齐 PEP 特有词的记忆法） ---- */
const PEP_COMPOUNDS = {
  classmate: ['class 班级', 'mate 伙伴'], grandfather: ['grand 隔一代', 'father 爸爸'], grandmother: ['grand 隔一代', 'mother 妈妈'],
  grandparent: ['grand 隔一代', 'parent 父母'], 'red panda': ['red 红色', 'panda 熊猫'], classroom: ['class 班级', 'room 房间'],
  workbook: ['work 作业', 'book 本子'], homework: ['home 家', 'work 功课'], notebook: ['note 笔记', 'book 本子'],
  newspaper: ['news 新闻', 'paper 纸'], blackboard: ['black 黑色', 'board 板子'], football: ['foot 脚', 'ball 球'],
  basketball: ['basket 篮', 'ball 球'], 'bus stop': ['bus 公交', 'stop 站'], 'office worker': ['office 办公室', 'worker 工作者'],
  'factory worker': ['factory 工厂', 'worker 工作者'], 'delivery worker': ['delivery 快递', 'worker 工作者'],
  'police officer': ['police 警方', 'officer 官员'], firefighter: ['fire 火', 'fighter 战士'], snowman: ['snow 雪', 'man 人'],
  raincoat: ['rain 雨', 'coat 外衣'], sunglasses: ['sun 太阳', 'glasses 眼镜'], 'T-shirt': ['T 字形', 'shirt 衬衫'],
  'living room': ['living 起居', 'room 房间'], bedroom: ['bed 床', 'room 房间'], bathroom: ['bath 洗澡', 'room 房间'],
  supermarket: ['super 超级', 'market 市场'], 'green bean': ['green 绿色', 'bean 豆'], chopstick: ['chop 戳', 'stick 棍'],
  hamburger: ['ham 火腿', 'burger 包'], 'ice cream': ['ice 冰', 'cream 奶油'], 'pocket money': ['pocket 口袋', 'money 钱'],
  schoolbag: ['school 学校', 'bag 包'], 'space station': ['space 太空', 'station 站'], 'outer space': ['outer 外面', 'space 太空'],
  'air conditioner': ['air 空气', 'conditioner 调节器'], 'runny nose': ['runny 流水的', 'nose 鼻子'],
  'dining hall': ['dining 用餐', 'hall 大厅'], 'gingerbread house': ['ginger 姜', 'bread 面包', 'house 房子'],
  'book fair': ['book 书', 'fair 集市'], 'count down': ['count 数', 'down 向下'], 'save up': ['save 存', 'up 起来'],
  'stay up': ['stay 待着', 'up 不躺'], 'run out': ['run 跑', 'out 光了'], 'make the bed': ['make 铺', 'bed 床'],
  'look after': ['look 看', 'after 后面'], 'look up': ['look 查', 'up 向上'], 'turn off': ['turn 拧', 'off 关掉'],
  'hand out': ['hand 递', 'out 出去'], 'get together': ['get 聚', 'together 在一起'],
  'hard-working': ['hard 努力', 'working 工作'], hometown: ['home 家', 'town 镇'], sunshine: ['sun 太阳', 'shine 照耀'],
  waterfall: ['water 水', 'fall 落下'], 'piggy bank': ['piggy 小猪', 'bank 罐'], 'go hiking': ['go 去', 'hiking 徒步'],
  'go cycling': ['go 去', 'cycling 骑行'], 'went camping': ['went 去（过去式）', 'camping 露营'], 'went fishing': ['went 去（过去式）', 'fishing 钓鱼'],
  'took pictures': ['took 拍（过去式）', 'pictures 照片'], 'had a cold': ['had 得了（过去式）', 'a cold 感冒'],
  month: ['moon 月亮', 'th 名词后缀'], astronaut: ['astro 星星', 'naut 航行者'], taikonaut: ['taikong 太空', 'naut 航行者'],
  underground: ['under 地下', 'ground 地面'], 'ping-pong': ['乒 ping', 'pong 乓'], 'ice-skate': ['ice 冰', 'skate 滑'],
  'Eiffel Tower': ['Eiffel 埃菲尔（人名）', 'Tower 塔'], 'Beijing opera': ['Beijing 北京', 'opera 戏剧'],
  'Mount Taishan': ['Mount 山峰', 'Taishan 泰山'], 'Dragon Boat Festival': ['Dragon 龙', 'Boat 船', 'Festival 节'],
  'Labour Day': ['Labour 劳动', 'Day 节日'], 'National Day': ['National 国家', 'Day 节日'], maybe: ['may 可能', 'be 是'],
  everyday: ['every 每个', 'day 天'], today: ['to = 今（古义）', 'day 天'], weekend: ['week 周', 'end 末尾'],
  birthday: ['birth 诞生', 'day 日子'], sometimes: ['some 有些', 'times 次'], seafood: ['sea 海', 'food 食物'],
  hotpot: ['hot 热的', 'pot 锅'], toothpaste: ['tooth 牙齿', 'paste 膏'], toothbrush: ['tooth 牙齿', 'brush 刷子'],
  someone: ['some 某个', 'one 人'], anything: ['any 任何', 'thing 东西'], everything: ['every 每个', 'thing 东西'],
  nothing: ['no 没有', 'thing 东西'], internet: ['inter 互相', 'net 网'],
};
/* ---- PEP 特有词精写记忆法（词源故事 / 拆分联想 / 规律口诀，全孩子语言） ---- */
const PEP_MEM = {
  nice: 'nice（奈斯）：对人和和气气，别人就会夸你「奈斯」',
  can: 'can 是万能钥匙：能、可以，后面跟的动词不变身',
  mum: 'm 和 o 像两张门——mum：妈妈守在家门口',
  cousin: 'cou（靠）+ sin：靠得近的兄弟姐妹——堂（表）亲',
  pet: '要拍拍（p）哄哄的小动物——宠物。pet 还有「最爱」的意思：pet dog 宠物狗',
  Miss: 'Miss 是「老师/小姐」；它还有个反义兄弟 miss「错过」——miss the bus 没赶上公交',
  animal: 'ani 在拉丁语里是「会呼吸、会动」——会动的就是动物',
  old: 'How old are you 直译是「你多老」——英语问年龄就这么问',
  cut: 'c 像剪刀张开的口，t 是剪下去那一刀——切块',
  after: 'a + fter：跟在后面——after class 下课后',
  Mr: 'Mister 的缩写——先生，加在姓前面',
  English: 'England（英国）人的语言——English 英语',
  UK: 'United Kingdom（联合王国）的首字母缩写——英国',
  China: 'china 小写是「瓷器」——中国瓷器世界闻名，所以中国叫 China',
  Canada: 'Can（能）+ ada：加拿大国旗上的枫叶红得像能燃烧',
  USA: 'United States of America 三个词首字母——美国',
  has: 'have 的三单变装：他她它（he/she/it）专属用 has',
  fat: 'f 像鼓起的肚子 + at：吃得太饱就 fat',
  thin: 'thin 细得像根针——瘦',
  tail: 't 立着像翘起的尾巴——tail 尾巴',
  these: 'this 这一个长出 s 变 these——这些（读音也变「迪兹」）',
  smell: 'smell：闻——s（嗅）+ mell，闻起来香香的',
  taste: 'taste：尝——用舌头（tongue）试味道',
  hear: 'h + ear（耳朵）——用耳朵听见。hear 和 here 同音：在这「听」',
  touch: 'touch：摸——伸出手指 tou（逗）一 ch',
  tongue: 'tongue 舌头——尝尽 ton（吨）的味道，拼写要记住 gue',
  time: 'time：时间——时针 ti 走到 me（我）这里，就是我做事的时间',
  meat: 'meat 和 meet（见面）同音——朋友见面一起吃肉',
  colourful: 'colour（颜色）+ ful（充满）——充满颜色 = 五彩缤纷',
  yummy: 'yum~ 是吃到好吃的声音——yummy 很好吃的',
  shelf: 'sh + elf（小精灵）——书架上像住着帮你拿书的小精灵',
  box: 'b + ox——方方的箱子',
  PE: 'Physical Education（身体教育）的缩写——体育课',
  chore: 'chore 家庭杂务——cho（吵）re（闹）的家务活',
  room: 'r + oo（两个圆窗）+ m——有个 oo 窗的房间',
  sweep: 'sweep：扫——sw（唰唰）两下 eep 地就干净',
  together: 'to（去）+ get（聚）+ her——去聚在一起 = 一起',
  best: 'best 是 good 比出来的冠军——最好的',
  Chinese: 'China（中国）+ nese——中文；中国人的',
  afternoon: 'after（之后）+ noon（中午）——中午之后 = 下午',
  toilet: 'toilet 厕所——go to the toilet 去洗手间',
  sport: 's（速度）+ p（力量）+ ort——体育运动',
  community: 'com（一起）+ unit（团结）+ y——大家聚在一起住 = 社区',
  place: 'pl + ace（王牌）——每个地方都有自己的王牌景点',
  cleaner: 'clean（打扫）+ er（的人）——打扫的人 = 清洁工',
  'a lot of': 'a lot（一大堆）+ of——大量的、许多',
  Ms: 'Miss 的「婚否保密版」——女士（Mrs 太太、Miss 小姐、Ms 都行）',
  bad: 'b + ad：bad 坏的——good 的反义词',
  closed: 'close（关）+ d——关着的（开放反义词 open）',
  idea: 'i（我）脑子里 dea 冒出火花——主意',
  fun: 'f（飞）u（你）n（呢）——玩得飞起 = 乐趣',
  Sydney: 'Sydney 悉尼——歌剧院像白色帆船的城市',
  mine: 'my + ne = mine：我的（东西），后面不再跟名词',
  wear: 'w（我）在 ear（耳朵）旁戴耳环——穿戴',
  winter: 'win（赢）+ ter——冬天赢了雪花',
  'T-shirt': '字母 T 形状的衣服——T 恤衫',
  'hurry up': 'hurry（急忙）+ up（起来）——赶紧的！',
  ready: 'read（读）+ y——把书读完就「准备好了」',
  tidy: 'tid + y——整洁的；使整洁',
  fan: 'fan 风扇——f 形扇叶 an 转圈圈（fan 还有「粉丝」的意思！）',
  TV: 'television 的缩写——电视',
  maths: 'math + s：英式说法带 s——数学（mathematics 的缩写）',
  'get up': 'get（让）+ up（起来）——把身体从床上弄起来 = 起床',
  'go to school': 'go（去）+ school（学校）——上学',
  'go home': 'home 是副词，前面不加 to！——回家',
  'go to bed': 'go（去）+ bed（床）——上床睡觉',
  trousers: 'tr-ou-s-er-s 两条裤腿——裤子（常用复数）',
  pair: 'p + air（空气里的一对）——一条/一副，成双的东西',
  those: 'that（那）长出 s 变 those——那些',
  dear: 'dear 亲爱的——说进 ear（耳朵）里的贴心话',
  large: 'l + arge——大型号的（比 big 更「尺寸大」）',
  'try on': 'try（尝试）+ on（穿上）——试穿；代词要夹中间：try it on',
  can: '小写 can 罐头——金属罐「能」装东西',
  'a box of': 'a box（一盒）+ of——计量单位：一盒、一箱',
  feed: 'feed 喂 = food（食物）的动词版——把食物给出去',
  pass: 'pass 传——pass the ball 传球；pass 还有「通过」的意思',
  waste: 'wa + ste——浪费：别 waste 粮食！',
  'clear the table': 'clear（清空）+ the table（餐桌）——收拾餐桌',
  'set the table': 'set（摆放）+ the table——摆放餐具',
  herself: 'her（她）+ self（自己）——她自己',
  salad: 'sal（盐）+ ad——古罗马人用盐水拌菜 = 蔬菜沙拉',
  thirty: 'three（三）变 thir + ty（整十）——三十；记住 -teen 13、-ty 30',
  forty: 'four 变 for + ty——四十（唯一少 u 的，特殊记！）',
  fifty: 'five 变 fif + ty——五十',
  sixty: 'six + ty——六十',
  seventy: 'seven 变 seven + ty——七十',
  eighty: 'eight 变 eigh + ty——八十',
  ninety: 'nine 变 nine（去 e）+ ty——九十',
  player: 'play（比赛）+ er（的人）——运动员',
  lovely: 'love（爱）+ ly——可爱的、美丽的',
  rope: 'r 绕 + ope 圈——绳；jump rope 跳绳',
  chess: 'ch（车）+ ess（王后）——国际象棋里的角色',
  Australia: 'Australia 澳大利亚——袋鼠和考拉的家',
  matter: 'What is the matter? 怎么了——matter 事情/麻烦',
  project: 'pro（向前）+ ject（投）——向前推进的事 = 项目',
  centre: 'c + entre——中心（英式拼写，美式是 center）',
  parent: '生你的人——parent 父亲或母亲（parents 父母双亲）',
  yours: 'your（你的）+ s——你的（东西）；信末 Your friend 你的朋友',
  Monday: 'Moon（月亮）日——周一，月亮开新一周',
  Tuesday: '北欧战神 Tiw 日——周二',
  Wednesday: 'Wodin（主神）日——周三，wed-nes-day 分三段记',
  Thursday: '雷神 Thor 日——周四',
  Friday: '爱神 Frigg 日——周五',
  Saturday: '土星 Saturn 日——周六',
  Sunday: 'sun（太阳）日——周日，太阳休息日',
  evening: 'even（平）+ ing——夜色平平压下来 = 晚上',
  night: 'night 夜——中间的 i 像一支蜡烛照亮夜',
  should: 'should 该——比 must 温柔的建议；shouldn\'t 不该',
  flu: 'influenza 的昵称——流感，飞沫传染 flu（飞流）',
  enough: 'enough 足够——口诀「名前形后」：enough sleep / old enough',
  habit: 'hab（哈）+ it——每天哈一点，就成了 habit 习惯',
  'take care of': 'take care（当心）+ of——照顾、爱护',
  check: 'check 查看——下棋「将军」也是这个词！',
  less: 'less 更少——more（更多）的反义词',
  Mrs: 'Mistress 的缩写——太太（已婚女士）',
  seed: 'see（看）+ d——种下去才看得见发芽 = 种子',
  pull: 'pull 拔——两个 l 像两根绳子一起拉',
  stem: 'stem 茎——tem 像十字支架撑起花',
  root: 'root 根——oot 顺着 o 往下扎',
  lotus: 'lotus 莲——出淤泥而不染（佛的宝座）',
  worry: 'wo（我）+ rry（惹事）——怕惹事所以担心',
  flood: 'fl（水花四溅）+ ood（涌出来）——洪水',
  before: 'be + fore（前面）——在……之前；after 的反义词',
  must: 'must 必须——四个字母个个顶用，没得商量',
  scare: 's + care（关心）——吓一跳，赶紧 care 一下',
  password: 'pass（通行）+ word（词）——能通行的词 = 密码',
  guard: 'guard 门卫——gu（故） ard（守）在门口',
  stand: 'st（站直）+ and（并腿）——站立',
  shout: 'sh + out（出来）——喊声冲出来 = 大声说',
  flash: 'fl（一闪）+ ash——闪光灯咔嚓',
  return: 're（回）+ turn（转）——转回去 = 归还；返回',
  litter: 'litter 垃圾——和 little（小）像：小垃圾也别乱扔',
  direct: 'di + rect——直接给你指路 = 指挥、指方向',
  lost: 'lose（丢失）的过去式——迷路的',
  sign: 'sign 指示牌——s（视）ign（认）：看见认得',
  note: 'not + e——笔记；note 还有「注意到」的意思',
  visitor: 'visit（参观）+ or（的人）——参观的人 = 游客',
  January: '门神 Janus 有两张脸，一张看旧年一张看新年——一月',
  February: 'February 二月——一年里最短的月份',
  holiday: 'holi（神圣）+ day（日子）——神圣的休息日 = 假期',
  March: '战神 Mars 之月——三月，万物开战式生长',
  April: 'April 四月——April showers 四月阵雨',
  May: 'May 五月——五月花开（May Day 五一劳动节）',
  June: 'June 六月——Juno 神后之月，结婚月',
  December: 'decem 是「十」——古罗马历第十月，排到今天成了十二月',
  Christmas: 'Christ（基督）+ mas（弥撒）——圣诞节 Xmas 的 X 是希腊字母 Chi',
  turkey: 'turkey 火鸡——曾被误认来自 Turkey（土耳其）而得名',
  sit: 's + it——坐下',
  ago: 'a + go（走）——时间走掉了 = 以前（放在时间词后面）',
  'Labour Day': 'Labour（劳动）+ Day（节日）——劳动者的节日',
  'Dragon Boat Festival': 'Dragon（龙）+ Boat（舟）+ Festival（节）——端午节赛龙舟',
  'National Day': 'National（国家的）+ Day——国庆节',
  its: 'it 的所有格——它的（没有撇号！it\'s 是 it is）',
  common: 'com（一起）+ mon——大家都有 = 共同的',
  grassland: 'grass（草）+ land（地）——长满草的地 = 草原',
  could: 'can 的过去式，也用来客气地问——Could you...? 你能……吗',
  'feel like': 'feel（感觉）+ like（像）——感觉像是……',
  painting: 'paint（颜料/涂）+ ing——油画、绘画',
  pyramid: 'pyramid 金字塔——pyra（角）+ mid（中间）立起来',
  even: 'even 甚至——连……都，用来加强语气',
  Confucius: '「孔夫子」的拉丁文音译——孔子',
  'Beijing opera': 'Beijing（北京）+ opera（歌剧）——京剧',
  'Mount Taishan': 'Mount（山峰）+ Taishan——泰山（五岳之首）',
  India: 'India 印度——India 河（印度河）得名',
  Italy: 'Italy 意大利——靴子形的国家',
  Britain: 'Britain 不列颠——UK 的主岛',
  Cairo: 'Cairo 开罗——金字塔旁的埃及首都',
  Hawaii: 'Hawaii 夏威夷——hula 草裙舞的故乡',
  'on foot': 'on（用）+ foot（脚）——用脚走 = 步行',
  tip: 'tip 小贴士——tip 还有「尖端」的意思：指尖 = fingertip',
  finally: 'final（最终）+ ly——最后；终于',
  join: 'join 加入——j（接）oin（合）进来',
  explore: 'ex（向外）+ plore（找）——向外找 = 探索',
  local: 'loc（地方）+ al——当地的',
  app: 'application 的缩写——手机应用',
  information: 'inform（告知）+ ation——告知你的东西 = 信息（不可数）',
  blog: 'web（网）+ log（日志）→ blog——博客',
  northeast: 'north（北）+ east（东）——东北方',
  palace: 'palace 王宫——比朋友（pal）家大得多才叫宫',
  was: 'is/am 的过去式——过去的事用 was：I was...',
  kilometre: 'kilo（千）+ metre（米）——千米；km 就是它的缩写',
  send: 'send 发送——send 发到 end（终点）',
  clay: 'clay 黏土——lay（铺）：黏土能铺能捏',
  view: 'view 景色——v 像山谷，站在山头看 V 形谷',
  inspiring: 'in（进）+ spire（呼吸）——把勇气吹进心里 = 鼓舞人心',
  'New Zealand': 'New（新）+ Zealand（泽兰地）——新西兰（荷兰航海者纪念家乡）',
  'Hong Kong-Zhuhai-Macao Bridge': 'Hong Kong 香港 + Zhuhai 珠海 + Macao 澳门 + Bridge 桥——港珠澳大桥',
  Paris: 'Paris 巴黎——铁塔之城',
  marathon: 'Marathon 平原——希腊士兵跑回雅典报捷，从此长跑叫马拉松',
  as: 'as 作为——as a student 作为一名学生',
  notice: 'not（让大家知道）+ ice——通知',
  wake: 'wake 醒——ake 睁开眼',
  later: 'late（晚）+ r——后来、稍后',
  judge: 'judge 裁判——jud（公正）+ dge，公平判决',
  ever: 'ever 曾经——比以往任何时候都……',
  exciting: 'excite（使激动）+ ing——令人激动的（人感到激动用 excited）',
  cough: 'cough 咳嗽——ou 咳嗽声 + gh',
  diet: 'diet 日常饮食——你天天吃什么就是你的 diet',
  unhappy: 'un（不）+ happy（开心）——不快乐的',
  glass: 'gl（玻璃光泽）+ ass——玻璃；一杯（的量）',
  may: 'may 也许/可以——May I...? 我可以……吗',
  add: 'add 增加——dd 像两个加号 +=',
  better: 'good/well 的比较级——更好；feel better 好多了',
  goods: 'good（好）+ s——好东西拿去卖 = 商品',
  service: 'serv（服务）+ ice——service 服务',
  haircut: 'hair（头发）+ cut（剪）——理发',
  microscope: 'micro（微小）+ scope（看）——看微小东西 = 显微镜',
  lucky: 'luck（运气）+ y——幸运的；lucky dog 幸运儿',
  sale: 'sale 特价——sell（卖）的名词；on sale 打折中',
  manage: 'man（手）+ age——亲手打理 = 管理',
  jar: 'jar 罐子——存钱罐 jar',
  'for example': 'for（拿）+ example（样本）——举个例子',
  daytime: 'day（白天）+ time（时间）——白天',
  marble: 'marble 弹子——和大理石（marble）一样圆亮',
  satellite: 'satellite 卫星——陪着行星转的天体',
  soil: 'soil 土壤——肥得像 oil（油）',
  alien: 'ali + en——外星生物（alien 还有「外国人」的意思）',
  sunrise: 'sun（太阳）+ rise（升起）——日出',
  rover: 'rove（漫游）+ er——到处漫游的车 = 探测器',
  telescope: 'tele（远）+ scope（看）——看远处的镜 = 望远镜',
  spaceship: 'space（太空）+ ship（船）——太空里的船 = 宇宙飞船',
  cloth: 'cloth 布——clothes（衣服）的兄弟，一块 cloth 裁成 clothes',
  sunset: 'sun（太阳）+ set（落下）——日落',
  Mars: 'Mars 火星——红色像战神的血，所以是战星',
  electricity: 'electric（电的）+ ity——电（不可数）',
  solar: 'sol（太阳）+ ar——太阳的：solar energy 太阳能',
  type: 'type 类型——还有「打字」的意思：type on the keyboard',
  heat: 'heat 加热/热量——eat（吃）前加 h，热菜端上桌',
  resource: 're（再）+ source（源泉）——能再生的源泉 = 资源',
  quick: 'quick 快——qu 是「快速问答」组合（quick question）',
  unplug: 'un（相反动作）+ plug（插头）——拔插头',
  difference: 'differ（不同）+ ence——差别（different 的名词）',
  reduce: 're（往回）+ duce（引导）——往回收 = 减少',
  drive: 'drive 驾驶——driver（司机）就是「开车的人」',
  reuse: 're（再）+ use（用）——重复使用',
  bottle: 'bott + le——瓶子（bottle 和 water：bottle water 一瓶水）',
  top: 'top 顶部——op 往上顶到头',
  side: 'side 一面——left side 左边 / right side 右边',
  younger: 'young（年轻）+ er（更）——更年轻的',
  older: 'old（老）+ er——更老的；old 的比较级',
  taller: 'tall（高）+ er——更高的',
  shorter: 'short（矮/短）+ er——更矮的；更短的',
  longer: 'long（长）+ er——更长的',
  thinner: 'thin（瘦）双写 n + er——更瘦的',
  heavier: 'heavy（重）y 变 i + er——更重的',
  bigger: 'big（大）双写 g + er——更大的',
  smaller: 'small（小）+ er——更小的',
  stronger: 'strong（强壮）+ er——更强壮的',
  dinosaur: 'dino（可怕）+ saur（蜥蜴）——可怕的蜥蜴 = 恐龙',
  hall: 'hall 大厅——all（全都）装得下',
  metre: 'met + re——米（美式 meter）；kilometre 千米',
  than: 'than 比——比较级的固定搭档：taller than',
  kilogram: 'kilo（千）+ gram（克）——千克；kg 缩写',
  countryside: 'country（乡村）+ side（边）——城市边上 = 乡下',
  shadow: 'shad（阴凉）+ ow——影子跟着你走',
  smarter: 'smart（聪明）+ er——更聪明的',
  cleaned: 'clean（打扫）+ ed——昨天的事加 ed',
  stayed: 'stay（待）+ ed——待在家的过去式',
  washed: 'wash（洗）+ ed——洗了的过去式',
  watched: 'watch（看）+ ed——看过的过去式',
  had: 'have 的过去式——had：had a cold 感冒了',
  slept: 'sleep 的过去式——sleep→slept 不规则',
  saw: 'see 的过去式——see→saw 不规则',
  drank: 'drink 的过去式——drink→drank 不规则',
  better: 'well/good 的比较级——better 更好',
  faster: 'fast（快）+ er——更快',
  fixed: 'fix（修理）+ ed——修好的',
  broken: 'break（打破）的过去分词——破损的：a broken lamp 坏灯',
  enjoy: 'en（使）+ joy（快乐）——享受快乐',
  went: 'go 的过去式——go→went：went to...',
  rode: 'ride 的过去式——ride→rode：rode a horse 骑马',
  ate: 'eat 的过去式——eat→ate：ate bread',
  took: 'take 的过去式——take→took：took pictures 拍照',
  bought: 'buy 的过去式——buy→bought：bought gifts 买礼物',
  fell: 'fall 的过去式——fall→fell：fell off 摔下来',
  mule: 'mule 骡子——马和驴的宝宝，特别能干活',
  Turpan: 'Turpan 吐鲁番——新疆的葡萄沟，中国最热的地方之一',
  could: 'can 的过去式——过去「能」，也用来客气请求',
  till: 'till = until 的短版——直到……为止',
  basket: 'b + ask + et——篮；筐（basketball 篮球由此得名）',
  part: 'part 角色——play the part 扮演角色；part 也是「部分」',
  licked: 'lick（舔）+ ed——舔了的过去式',
  laughed: 'laugh（笑）+ ed——笑了的过去式',
  gym: 'gymnasium 的缩写——体育馆',
  cycling: 'cycle（自行车）+ ing——骑自行车运动',
  badminton: 'badminton 羽毛球——用英国 Badminton 庄园的名字命名',
  thought: 'think 的过去式——think→thought：想过的',
  felt: 'feel 的过去式——feel→felt：felt happy 感到开心',
  cheetah: 'cheetah 猎豹——印地语「有斑点的」：陆地上跑得最快',
  woke: 'wake 的过去式——wake→woke：woke up 醒了',
  dream: 'dream 梦——dr（睡）+ eam：睡觉时放的电影',
  'in class': 'in（在……里）+ class（课堂）——固定搭配整块记：在课堂上',
  July: 'July 七月——凯撒大帝（Julius Caesar）出生的月份',
  August: 'August 八月——奥古斯都大帝（Augustus）的月份',
  September: 'septem 是「七」——罗马旧历第七月，排到今天成了九月',
  October: 'octo 是「八」——旧历第八月，现在十月（octopus 八爪鱼也八条腿）',
  November: 'novem 是「九」——旧历第九月，现在十一月',
  'CPC Founding Day': 'CPC（中国共产党）+ Founding（创建）+ Day——建党日',
  'PLA Day': 'PLA（人民解放军）+ Day——建军节',
  'Terracotta Warriors': 'Terracotta（陶土烧制）+ Warriors（战士）——陶土战士 = 兵马俑',
  'Jinggangshan Revolution Museum': 'Jinggangshan（井冈山）+ Revolution（革命）+ Museum（博物馆）——井冈山革命博物馆',
  'the Red Army': 'the Red（红色）+ Army（军队）——红军',
  paste: 'paste 粘贴——p 像刷子蘸着胶水（paste 也是「面团」）',
  gala: 'gala 庆典——ga（歌）la（啦）：唱起来庆祝',
  lower: 'low（低）+ er（更）——更低的（比较级）',
};
function pepPointsOf(unitId) {
  const dash = unitId.lastIndexOf('-');
  if (dash < 0) return [];
  const lv = PEP_POINTS[unitId.slice(0, dash)];
  return lv ? (lv[unitId.slice(dash + 1)] || []) : [];
}

/* ---- 词性表：非名词词全部显式标注；没查到的按名词兜底 ---- */
const PEP_POS = {
  v: ['like', 'share', 'smile', 'listen', 'help', 'say', 'have', 'has', 'go', 'give', 'water', 'plant', 'draw', 'make', 'eat', 'cut', 'find', 'see', 'smell', 'taste', 'hear', 'touch', 'learn', 'sing', 'dance', 'talk', 'keep', 'put', 'buy', 'walk', 'speak', 'swim', 'fly', 'feed', 'pass', 'pick', 'waste', 'jump', 'agree', 'finish', 'ask', 'laugh', 'move', 'stay', 'exercise', 'brush', 'check', 'know', 'bring', 'pull', 'climb', 'send', 'dress', 'paste', 'run', 'cheer', 'read', 'sing', 'wear', 'wake', 'begin', 'win', 'add', 'call', 'cry', 'discuss', 'manage', 'sell', 'light', 'heat', 'cool', 'change', 'close', 'drive', 'reduce', 'reuse', 'worry', 'scare', 'shout', 'smoke', 'open', 'return', 'borrow', 'write', 'wait', 'stand', 'direct', 'teach', 'live', 'recycle', 'litter', 'skate', 'celebrate', 'sit', 'catch', 'ride', 'travel', 'hurt', 'carry', 'suggest', 'explore', 'join', 'hurry up', 'look after', 'look up', 'turn off', 'hand out', 'tidy', 'make the bed', 'take care of', 'get up', 'go to school', 'go home', 'go to bed', 'go hiking', 'go cycling', 'on foot', 'try on', 'clear the table', 'set the table', 'take', 'watch', 'run out', 'stay up', 'save up', 'count down', 'dress', 'clean', 'sweep', 'cook', 'love', 'need', 'want', 'think', 'feel', 'work', 'follow', 'wash', 'sleep', 'study', 'play', 'tell', 'may', 'should', 'must', 'wish', 'answer', 'start', 'visit', 'show', 'rest', 'pull', 'smell', 'milk', 'explore', 'paste', 'dry', 'send', 'see', 'eat', 'was', 'ate', 'took', 'went', 'camp', 'rode', 'hurt', 'bought', 'fell', 'licked', 'laughed', 'woke', 'thought', 'felt', 'cleaned', 'stayed', 'washed', 'watched', 'had', 'slept', 'read', 'saw', 'drank', 'fixed', 'enjoy', 'licked'],
  adj: ['nice', 'good', 'big', 'small', 'cute', 'tall', 'fast', 'new', 'green', 'red', 'blue', 'purple', 'brown', 'yellow', 'pink', 'white', 'black', 'orange', 'colourful', 'healthy', 'yummy', 'cool', 'busy', 'tired', 'strong', 'kind', 'quiet', 'best', 'favourite', 'sunny', 'hot', 'bad', 'cold', 'windy', 'cloudy', 'rainy', 'snowy', 'warm', 'closed', 'dear', 'expensive', 'cheap', 'beautiful', 'large', 'free', 'delicious', 'late', 'ready', 'tidy', 'wet', 'safe', 'helpful', 'loud', 'hard', 'sad', 'worried', 'excited', 'wrong', 'angry', 'afraid', 'lovely', 'clever', 'young', 'hard-working', 'easy', 'wonderful', 'enough', 'less', 'hungry', 'little', 'interesting', 'round', 'different', 'famous', 'dangerous', 'heavy', 'fine', 'far', 'lost', 'foreign', 'common', 'special', 'wild', 'high', 'early', 'everyday', 'local', 'inspiring', 'dry', 'quick', 'useful', 'dirty', 'own', 'younger', 'older', 'taller', 'shorter', 'longer', 'thinner', 'heavier', 'bigger', 'smaller', 'stronger', 'lower', 'smarter', 'broken', 'loud', 'easy', 'different', 'active', 'exciting', 'interesting', 'lucky', 'old', 'small', 'both', 'ill', 'better', 'faster', 'still', 'right', 'fat', 'thin', 'slow', 'long', 'short', 'sorry'],
  pron: ['me', 'he', 'she', 'her', 'him', 'these', 'those', 'mine', 'yours', 'who', 'whose', 'we', 'they', 'them', 'it', 'its', 'their', 'its', 'I', 'you', 'everyone', 'herself', 'them', 'another', 'nothing', 'something', 'herself', 'its', 'all', 'some', 'both', 'each'],
  prep: ['in', 'on', 'under', 'at', 'from', 'after', 'between', 'behind', 'along', 'inside', 'before', 'into', 'as', 'off', 'for', 'to', 'with', 'about', 'of', 'by', 'beside', 'next', 'over', 'till', 'against'],
  adv: ['where', 'today', 'also', 'very', 'there', 'here', 'now', 'tomorrow', 'always', 'usually', 'sometimes', 'often', 'then', 'first', 'ago', 'early', 'again', 'back', 'still', 'just', 'together', 'west', 'finally', 'maybe', 'later', 'ever', 'even', 'soon', 'well', 'away', 'yours'],
  num: ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety', 'hundred', 'thousand', 'half'],
  interj: ['hello', 'hi', 'goodbye', 'bye', 'sorry', 'OK', 'well'],
  phrase: ['in class', 'piggy bank', 'a lot of', 'make the bed', 'bus stop', 'office worker', 'factory worker', 'delivery worker', 'police officer', 'get together', 'living room', 'green bean', 'a box of', 'turn off', 'hand out', 'try on', 'green bean', 'look after', 'get up', 'go to school', 'go home', 'go to bed', 'hurry up', 'turn off', 'ice cream', 'take care of', 'run out', 'stay up', 'save up', 'count down', 'for example', 'outer space', 'space station', 'air conditioner', 'runny nose', 'had a cold', 'went camping', 'went fishing', 'took pictures', 'go cycling', 'ice-skate', 'look up', 'dining hall', 'feel like', 'on foot', 'in class', 'each other'],
};
function pepPosKey(w) {
  /* 词性查询：显式表 → 词库借用 → 词形规则 → 名词兜底 */
  const s = String(w.w || w).toLowerCase();
  for (const k in PEP_POS) { if (PEP_POS[k].indexOf(s) >= 0) return k; }
  if (typeof GRADES !== 'undefined') {
    for (const g of GRADES) for (const t of g.themes) for (const x of t.words) {
      if (x.w.toLowerCase() === s) return (x.pos || t.pos || 'n');
    }
  }
  if (/ed$/.test(s) && s.length > 4) return 'v';
  if (/ing$/.test(s) && s.length > 5) return 'v';
  return 'n';
}

/* ---- 音标补充表：PEP 特有、ipa.js 大概率没有的词（英式） ---- */
const PEP_IPA = {
  'grandma': 'ɡrænmɑː', 'grandpa': 'ɡrænpɑː', 'grandfather': 'ɡrænfɑːðə', 'grandmother': 'ɡrænmʌðə',
  'cousin': 'kʌzn', 'uncle': 'ʌŋkl', 'aunt': 'ɑːnt', 'neighbour': 'neɪbə', 'classmate': 'klɑːsmeɪt',
  'giraffe': 'dʒərɑːf', 'panda': 'pændə', 'rabbit': 'ræbɪt', 'animal': 'ænɪml', 'elephant': 'elɪfənt',
  'monkey': 'mʌŋki', 'tiger': 'taɪɡə', 'lion': 'laɪən', 'fox': 'fɒks', 'zoo': 'zuː',
  'garden': 'ɡɑːdn', 'flower': 'flaʊə', 'grass': 'ɡrɑːs', 'plant': 'plɑːnt', 'tree': 'triː',
  'colour': 'kʌlə', 'purple': 'pɜːpl', 'brown': 'braʊn', 'pink': 'pɪŋk', 'white': 'waɪt',
  'orange': 'ɒrɪndʒ', 'banana': 'bənɑːnə', 'grape': 'ɡreɪp', 'duck': 'dʌk',
  'cake': 'keɪk', 'breakfast': 'brekfəst', 'noodle': 'nuːdl', 'juice': 'dʒuːs', 'rice': 'raɪs',
  'vegetable': 'vedʒtəbl', 'plate': 'pleɪt', 'candy': 'kændi', 'healthy': 'helθi',
  'boat': 'bəʊt', 'doll': 'dɒl', 'shelf': 'ʃelf', 'box': 'bɒks', 'cap': 'kæp', 'map': 'mæp',
  'piggy bank': 'pɪɡi bæŋk', 'teacher': 'tiːtʃə', 'student': 'stjuːdnt', 'neighbour': 'neɪbə',
  'woman': 'wʊmən', 'man': 'mæn', 'girl': 'ɡɜːl', 'boy': 'bɔɪ', 'China': 'tʃaɪnə',
  'Canada': 'kænədə', 'body': 'bɒdi', 'leg': 'leɡ', 'tail': 'teɪl', 'gift': 'ɡɪft',
  'picture': 'pɪktʃə', 'card': 'kɑːd', 'song': 'sɒŋ', 'face': 'feɪs', 'eraser': 'ɪreɪzə',
  'ruler': 'ruːlə', 'pencil': 'pensl', 'paper': 'peɪpə', 'computer': 'kəmpjuːtə',
  'bread': 'bred', 'egg': 'eɡ', 'meat': 'miːt', 'soup': 'suːp', 'fruit': 'fruːt',
  'boat': 'bəʊt', 'ball': 'bɔːl', 'car': 'kɑː', 'shelf': 'ʃelf',
  'job': 'dʒɒb', 'doctor': 'dɒktə', 'farmer': 'fɑːmə', 'nurse': 'nɜːs', 'chore': 'tʃɔː',
  'sweep': 'swiːp', 'floor': 'flɔː', 'people': 'piːpl', 'hair': 'heə', 'quiet': 'kwaɪət',
  'game': 'ɡeɪm', 'football': 'fʊtbɔːl', 'basketball': 'bɑːskɪtbɔːl', 'playground': 'pleɪɡraʊnd',
  'hospital': 'hɒspɪtl', 'toilet': 'tɔɪlət', 'library': 'laɪbrəri', 'community': 'kəmjuːnəti',
  'photo': 'fəʊtə', 'story': 'stɔːri', 'firefighter': 'faɪəfaɪtə', 'driver': 'draɪvə',
  'cleaner': 'kliːnə', 'weather': 'weðə', 'snowman': 'snəʊmæn', 'Sydney': 'sɪdni',
  'sweater': 'swetə', 'glove': 'ɡlʌv', 'autumn': 'ɔːtəm', 'season': 'siːzn',
  'blackboard': 'blækbɔːd', 'window': 'wɪndəʊ', 'newspaper': 'njuːzpeɪpə', 'workbook': 'wɜːkbʊk',
  'homework': 'həʊmwɜːk', 'bedroom': 'bedruːm', 'kitchen': 'kɪtʃɪn', 'bathroom': 'bɑːθruːm',
  'trousers': 'traʊzəz', 'jacket': 'dʒækɪt', 'sunglasses': 'sʌnɡlɑːsɪz', 'supermarket': 'suːpəmɑːkɪt',
  'horse': 'hɔːs', 'sheep': 'ʃiːp', 'tomato': 'təmɑːtəʊ', 'carrot': 'kærət', 'potato': 'pəteɪtəʊ',
  'knife': 'naɪf', 'fork': 'fɔːk', 'chopstick': 'tʃɒpstɪk', 'bowl': 'bəʊl', 'spoon': 'spuːn',
  'salad': 'sæləd', 'robot': 'rəʊbɒt', 'piano': 'piænəʊ', 'chess': 'tʃes', 'science': 'saɪəns',
  'player': 'pleɪə', 'clever': 'klevə', 'Australia': 'ɒstreɪliə', 'matter': 'mætə',
  'centre': 'sentə', 'project': 'prɒdʒekt', 'excited': 'ɪksaɪtɪd', 'parent': 'peərənt',
  'Wednesday': 'wenzdeɪ', 'Tuesday': 'tjuːzdeɪ', 'Thursday': 'θɜːzdeɪ', 'Saturday': 'sætədeɪ',
  'Sunday': 'sʌndeɪ', 'Monday': 'mʌndeɪ', 'Friday': 'fraɪdeɪ', 'weekend': 'wiːkend',
  'evening': 'iːvnɪŋ', 'lesson': 'lesn', 'grandparent': 'ɡrænpeərənt', 'exercise': 'eksəsaɪz',
  'habit': 'hæbɪt', 'tooth': 'tuːθ', 'hour': 'aʊə', 'beef': 'biːf', 'dumpling': 'dʌmplɪŋ',
  'hamburger': 'hæmbɜːɡə', 'coconut': 'kəʊkənʌt', 'seed': 'siːd', 'lotus': 'ləʊtəs',
  'lake': 'leɪk', 'world': 'wɜːld', 'river': 'rɪvə', 'nature': 'neɪtʃə', 'waterfall': 'wɔːtəfɔːl',
  'forest': 'fɒrɪst', 'mountain': 'maʊntɪn', 'umbrella': 'ʌmbrelə', 'raincoat': 'reɪnkəʊt',
  'fog': 'fɒɡ', 'flood': 'flʌd', 'hotel': 'həʊtel', 'sir': 'sɜː', 'password': 'pɑːswɜːd',
  'guard': 'ɡɑːd', 'flash': 'flæʃ', 'return': 'rɪtɜːn', 'borrow': 'bɒrəʊ', 'street': 'striːt',
  'station': 'steɪʃn', 'cinema': 'sɪnəmə', 'city': 'sɪti', 'traffic': 'træfɪk',
  'artist': 'ɑːtɪst', 'scientist': 'saɪəntɪst', 'volunteer': 'vɒləntɪə', 'taxi': 'tæksi',
  'train': 'treɪn', 'sign': 'saɪn', 'visitor': 'vɪzɪtə', 'January': 'dʒænjuəri',
  'February': 'februəri', 'March': 'mɑːtʃ', 'April': 'eɪprəl', 'August': 'ɔːɡəst',
  'September': 'sepbembə', 'October': 'ɒktəʊbə', 'November': 'nəʊvembə', 'December': 'disembə',
  'Christmas': 'krɪsməs', 'turkey': 'tɜːki', 'country': 'kʌntri', 'sunshine': 'sʌnʃaɪn',
  'beach': 'biːtʃ', 'desert': 'dezət', 'grassland': 'ɡrɑːslænd', 'kangaroo': 'kæŋɡəruː',
  'koala': 'kəʊɑːlə', 'island': 'aɪlənd', 'camel': 'kæml', 'pyramid': 'pɪrəmɪd',
  'underground': 'ʌndəɡraʊnd', 'plane': 'pleɪn', 'ship': 'ʃɪp', 'environment': 'ɪnvaɪrənmənt',
  'health': 'helθ', 'internet': 'ɪntənet', 'seafood': 'siːfuːd', 'culture': 'kʌltʃə',
  'history': 'hɪstri', 'information': 'ɪnfəmeɪʃn', 'magazine': 'mæɡəziːn', 'building': 'bɪldɪŋ',
  'palace': 'pælɪs', 'stone': 'stəʊn', 'kilometre': 'kɪləmiːtə', 'village': 'vɪlɪdʒ',
  'bamboo': 'bæmbuː', 'pumpkin': 'pʌmpkɪn', 'restaurant': 'restrɒnt', 'airport': 'eəpɔːt',
  'Paris': 'pærɪs', 'marathon': 'mærəθən', 'writer': 'raɪtə', 'notice': 'nəʊtɪs',
  'judge': 'dʒʌdʒ', 'winner': 'wɪnə', 'fever': 'fiːvə', 'cough': 'kɒf', 'diet': 'daɪət',
  'email': 'iːmeɪl', 'video': 'vɪdiəʊ', 'money': 'mʌni', 'goods': 'ɡʊdz', 'service': 'sɜːvɪs',
  'haircut': 'heəkʌt', 'microscope': 'maɪkrəskəʊp', 'ticket': 'tɪkɪt', 'jar': 'dʒɑː',
  'planet': 'plænɪt', 'earth': 'ɜːθ', 'cloud': 'klaʊd', 'moon': 'muːn', 'space': 'speɪs',
  'ocean': 'əʊʃn', 'satellite': 'sætəlaɪt', 'soil': 'sɔɪl', 'alien': 'eɪliən',
  'telescope': 'telɪskəʊp', 'astronaut': 'æstrənɔːt', 'spaceship': 'speɪsʃɪp',
  'toothpaste': 'tuːθpeɪst', 'question': 'kwestʃən', 'Mars': 'mɑːz', 'power': 'paʊə',
  'electricity': 'ɪlektrɪsəti', 'energy': 'enədʒi', 'resource': 'rɪzɔːs', 'shower': 'ʃaʊə',
  'market': 'mɑːkɪt', 'bottle': 'bɒtl', 'dinosaur': 'daɪnəsɔː', 'metre': 'miːtə',
  'kilogram': 'kɪləɡræm', 'countryside': 'kʌntrisaɪd', 'shadow': 'ʃædəʊ',
  'hotel': 'həʊtel', 'magazine': 'mæɡəziːn', 'camp': 'kæmp', 'basket': 'bɑːskɪt',
  'mule': 'mjuːl', 'badminton': 'bædmɪntən', 'cheetah': 'tʃiːtə', 'dream': 'driːm',
};
/* 音标查询：补充表 → ipa.js 借用（返回裸音标，不含斜杠） */
function pepIpaOf(w) {
  const s = String(w.w || w).toLowerCase();
  if (PEP_IPA[s]) return PEP_IPA[s];
  if (typeof ipaOf === 'function') {
    try {
      let v = String(ipaOf(s) || '');
      return v ? v.replace(/^\/+|\/+$/g, '') : '';
    } catch (e) { return ''; }
  }
  return '';
}

/* ---- 记忆法借用：单词镇 1000 词库同名词的 dec（记法） ---- */
let __wordDecMap = null;
function pepDecOf(w) {
  const s = String(w.w || w).toLowerCase();
  if (!__wordDecMap) {
    __wordDecMap = {};
    try { GRADES.forEach(g => g.themes.forEach(t => t.words.forEach(x => { if (x.dec) __wordDecMap[x.w] = x.dec; }))); } catch (e) {}
  }
  return __wordDecMap[s] || '';
}

/* 记忆法查询链：词库 dec 借用 → PEP_MEM 精写 → 复合词自动拆 → 无
   （大小写双查：Wednesday 这类首字母大写的词表词也能命中） */
function pepMemOf(w) {
  const raw = String(w.w || w);
  const key = raw.toLowerCase();
  const borrowed = pepDecOf(w);
  if (borrowed) return borrowed;
  if (PEP_MEM[key]) return PEP_MEM[key];
  if (PEP_MEM[raw]) return PEP_MEM[raw];
  const parts = PEP_COMPOUNDS[key] || PEP_COMPOUNDS[raw];
  if (Array.isArray(parts) && parts.length >= 2) {
    return parts.join(' + ') + ' = ' + (w.zh || '');
  }
  return '';
}
