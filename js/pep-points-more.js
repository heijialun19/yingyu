/* ============================================================
   小鸟英语乐园 · 课本知识点「拓展篇」（2026-11-14.6 新增）
   ------------------------------------------------------------
   与 js/pep-lessons.js 的 PEP_POINTS 结构完全一致，按 pep3a~pep6b / u1~u6 分组，
   由 pepPointsOf() 做「基础条 → 拓展条」拼接，所以：
     · 不动原有 273 条一个字（零回归风险）
     · 本文件可单独升版本号，改坏了直接回退这一个文件
   每条字段：t 标题 / kid 讲解 / tip 口诀 / en 例句 / zh 翻译。
   ⚠ en 例句优先取课本词表能拼出的句；若 audio/sentences 没有预生成音频，
     播放会退回本机语音（与原有 20 条同样处理），不会 404。
   ⚠ 讲解视角统一为「中文这么说，英语为什么那么说」，不写作者名、不引原书例句。
   ============================================================ */

const PEP_POINTS_MORE = {

  /* ============================================================
     三年级上册
     ============================================================ */
  pep3a: {
    u1: [
      { t: '句子里必须先站一个「主人」', kid: '中文可以说「下雨了」「疼」，不说谁。英语几乎每个句子前面都要站一个主人：I smile.（我笑）He helps.（他帮忙）这个主人叫主语。没有主人，句子就像一张没人的照片，英语不认。唯一的例外是命令句，因为听话的人就站在你眼前。', tip: '句子先有主人', en: 'I can share.', zh: '我可以分享。' },
      { t: '中文靠意思连，英语靠「记号」', kid: '中文「我笑」和「他笑」，一个字都不用改。英语却要给动词做记号：I smile → He smiles，尾巴上多一个 s。英语不让你猜，它把「几个人」「什么时候」都写在词的样子上。看到词变了样，就是在提醒你：信息变了。', tip: '词变了样，信息就变了', en: 'He smiles.', zh: '他笑。' },
      { t: 'a 是「随便哪一个」', kid: 'a friend 说的不是某位特定的朋友，而是「一个朋友」，随口一提的语气。要说「那个朋友」，才用 the。中文的「一个」常常省掉，英语几乎每次都要报一声，因为它在告诉你：这个是新的，你可能还不知道是谁。', tip: 'a = 其中一个', en: 'I have a friend.', zh: '我有一个朋友。' },
      { t: 'listen 要牵着 to 才够得着人', kid: 'listen 本身只管「用耳朵」这个动作，要接听的对象，得加一个 to：Listen to me!（听我说）这个 to 像一根线，把耳朵牵到那个人身上。只说 listen 不加 to，后面就放不下人。同类还有 look at、wait for。', tip: 'listen 后面跟 to', en: 'Listen to me.', zh: '听我说。' },
      { t: 'good 夸本事，nice 夸感受', kid: 'good 是「好」，夸的是本事和表现：a good friend（靠得住的朋友）。nice 是「让人舒服」，夸的是感觉：a nice smile（让人心里暖的笑）。中文都翻成「好」，英语却分了工：一个看能力，一个看感受。', tip: 'good 看本事，nice 看感受', en: 'She has a nice smile.', zh: '她有一个让人舒服的笑容。' },
      { t: 'help 后面直接放人', kid: 'help me（帮我）、help him（帮他）——help 后面直接放「被帮的人」，不用加 to，也不用加 for。中文说「帮给我」，英语只说 help me，把人紧贴在动词后面。', tip: 'help 后面直接放人', en: 'Can you help me?', zh: '你能帮我吗？' },
    ],
    u2: [
      { t: 'my 一个词管到底', kid: 'my mother（我的妈妈）——my 一个人就管住了「我的」。中文「我的妈妈」有两个「的」，英语一个 my 就够，后面的名词不用跟着变。要注意 my 只标「归谁」，不标「有几个」：my books 里 my 不变，变的是名词。', tip: 'my 只管归谁，不管几个', en: 'This is my mother.', zh: '这是我妈妈。' },
      { t: '两个「有」分工不同', kid: 'I have a sister.（我有一个妹妹）——have 说的是「我这边有」，东西归我。中文的「有」还能表示「存在」（桌上有书），那种「有」英语不用 have，要用 there is。一个说「归谁」，一个说「那儿有」，别混着用。', tip: 'have 归我，there is 在那儿', en: 'I have a big family.', zh: '我有一个大家庭。' },
      { t: '一个 uncle 装下半个亲戚圈', kid: 'uncle 一个词包了叔叔、伯伯、舅舅、姑父；aunt 包了姑姑、姨、婶婶。英语不细分父系母系，也不分年纪大小，只分男（uncle）女（aunt）。中文一大家子的称呼，英语两个词就装下了。', tip: '英语不细分，只分男女', en: 'This is my uncle.', zh: '这是我叔叔。' },
      { t: 'grandma 和 grandmother 一样亲', kid: 'grandmother 是「正式版」，grandma 是「日常版」，意思完全相同，就像中文「祖母」和「奶奶」。跟外人说用长的那一个，抱着奶奶喊用短的那一个。英语很多词都有这样一大一小两副面孔。', tip: '一词两副面孔', en: 'This is my grandmother.', zh: '这是我奶奶。' },
      { t: 'brother 不分哥弟', kid: 'brother 既可以是哥哥，也可以是弟弟；sister 既可以是姐姐，也可以是妹妹。要说得清楚，得加 big（大）或 little（小）：big brother（哥哥）、little sister（妹妹）。英语只分男女，长幼要另说。', tip: 'brother 不分长幼', en: 'He is my big brother.', zh: '他是我哥哥。' },
      { t: '「一家人」抱成 we', kid: 'We are a family.（我们是一家人）——一家人在一起，英语用 we 抱成一团，动词配 are。要说「我家有四口人」，得换成 There are four people in my family.——这里的「有」是「存在」，归 there be 管。', tip: '一家人用 we', en: 'We are a big family.', zh: '我们是一个大家庭。' },
    ],
    u3: [
      { t: 'like 是喜欢，look like 才是像', kid: 'I like dogs. 是「我喜欢狗」。要表达「看起来像」，得加上 look：It looks like a cat.（它看起来像猫）同一个 like，前面有没有 look，意思完全不同。看它左边站着谁，就知道是哪个意思。', tip: 'like 喜欢，look like 像', en: 'I like dogs.', zh: '我喜欢狗。' },
      { t: 'fish 几条都不改样', kid: 'one fish, two fish——鱼不管几条，形状都不变。英语里有些动物名天生「不改样」，sheep（羊）也是这样。它们不是忘了加 s，而是本来就打算让你靠上下文去数。', tip: 'fish、sheep 不改样', en: 'I see two fish.', zh: '我看见两条鱼。' },
      { t: 'a 还是 an，看的是声音', kid: 'an elephant、an orange——用 an 不是因为后面是元音字母，而是因为开头那个音是元音。反过来 a university 虽然 u 打头，读起来却是「优」，所以用 a。英语看声音，不看字母，这一条最容易上当。', tip: '看声音，不看字母', en: 'I see an elephant.', zh: '我看见一头大象。' },
      { t: '形容词抢在名词前面', kid: 'a tall giraffe（一只高个子长颈鹿）——形容词永远抢在名词前面站好，先说它什么样，再说是谁。中文也说「高个子长颈鹿」，顺序一样，这一条中英正好合拍。', tip: '先样子，后是谁', en: 'The giraffe is tall.', zh: '长颈鹿很高。' },
      { t: 'the zoo 有 the，go to school 没有', kid: 'go to the zoo（去动物园）——the 指「你知道的那一家」，是去那个地方。说 go to school 却不加 the，因为那是「去上学」这件事，不是去那栋楼。去场所要 the，做事情不要。', tip: '去场所要 the，做事情不要', en: 'Let us go to the zoo.', zh: '我们去动物园吧。' },
      { t: '动物也分 he、she、it', kid: '宠物常被当成家里人，会说 he 或 she；野生动物、说不清性别的，就用 it。所以故事里的小狗是 he，动物园里的长颈鹿是 it。英语挑代词的时候，也在悄悄表达「亲不亲」。', tip: '亲的 he/she，远的 it', en: 'It is a panda.', zh: '它是一只熊猫。' },
    ],
    u4: [
      { t: 'need 是缺了不行', kid: 'Plants need water.（植物需要水）——need 说的不是「想要」，是「没有就活不下去」。want 只是想要。孩子说 I need water 是真渴了，说 I want water 只是嘴上想要。一个救命，一个撒娇。', tip: 'need 缺不了，want 只是想要', en: 'Plants need water and sun.', zh: '植物需要水和阳光。' },
      { t: '数不清的东西不加 s', kid: 'water、air、grass 都数不清，不能说 a water、two waters。要数就借个容器：a glass of water（一杯水）、a piece of paper。中文说「一杯水」得用「杯」，英语也一样，先装箱子再数。', tip: '数不清的，装箱子才数', en: 'I need some water.', zh: '我需要一些水。' },
      { t: 'give 天生要两份东西', kid: 'give 要两个对象：给谁（人）+ 给什么（东西）。Give me the book.（给我那本书）两个都得到场。只给一个，句子就缺一块，像话没说完。同类还有 pass、show、send。', tip: 'give 后面要两份', en: 'Give me the book, please.', zh: '请把书给我。' },
      { t: '介词画的是位置', kid: 'in the garden（在花园里）、on the farm（在农场上）、under the tree（在树下）——in 是「被包住」，on 是「贴着面」，under 是「正下方」。介词不是背出来的，是看画面看出来的。', tip: '介词是位置照片', en: 'The cat is under the tree.', zh: '猫在树下。' },
      { t: '一个 s 就是一堆', kid: 'apple → apples、flower → flowers——英语只动一个字母，就把「一个」变成「一堆」。中文得加上「很多」两个字，英语加个 s 就完事。看到 s，脑子里就该出现好几个。', tip: '一个 s，就是一堆', en: 'I see many flowers.', zh: '我看见许多花。' },
      { t: '第一次用 a，第二次用 the', kid: 'Look at the tree.（看那棵树）——说话的人知道是哪一棵，听的人也看得见，才用 the。第一次提到某样东西用 a tree，再提就说 the tree。中文的「那棵」常常省掉，英语的 the 省不掉。', tip: '第一次 a，第二次 the', en: 'Look at the tree.', zh: '看那棵树。' },
    ],
    u5: [
      { t: 'orange 既是水果又是颜色', kid: 'orange 是「橙子」，也是「橙色」。英语先有水果，再拿它当颜色——因为橙子本来就是那个颜色。这样的词还有 rose（玫瑰 / 玫瑰色）。一个词身兼两职，靠位置分辨：an orange 是水果，orange juice 是橙汁。', tip: '水果名借去当颜色', en: 'The orange is orange.', zh: '这个橙子是橙色的。' },
      { t: '黑色白色也算颜色', kid: 'black（黑）、white（白）——有人觉得黑白不算颜色，英语不这么想。它们和 red、blue 一样站在形容词的队伍里：a black cat、a white duck，位置照旧在名词前面。', tip: '黑白也是颜色', en: 'I see a black cat.', zh: '我看见一只黑猫。' },
      { t: 'draw 画线，colour 上色', kid: 'draw 是「画」这个动作：draw a duck（画一只鸭子）。上色才叫 colour。所以先 draw，再 colour。中文一个「画」字包了两个动作，英语把它们拆开说。', tip: 'draw 画线，colour 上色', en: 'I can draw a duck.', zh: '我会画鸭子。' },
      { t: '世上只有一个的，用 the', kid: 'the sea（大海）、the sun（太阳）、the sky（天空）——这样的东西只有一份，不用挑，所以直接 the。这叫「独一无二」。中文说「看海」，英语说 look at the sea，那个 the 跑不掉。', tip: '只有一份，就用 the', en: 'I can see the sea.', zh: '我能看见大海。' },
      { t: '几个形容词一起上，谁站前面', kid: 'a big brown bear（一只大棕熊）——两个形容词可以同时上场，顺序是先大后小、先整体后细节：大小 → 颜色 → 材料。a small red ball 听着自然，a red small ball 就拧巴。', tip: '大在前，色在后', en: 'I see a big brown bear.', zh: '我看见一只大棕熊。' },
      { t: 'some 模糊，many 数得清', kid: 'some ducks（几只鸭子）——some 是「一些」，数量说不清也不想说清。many 是「很多」，强调数量大。some 还能配数不清的东西（some water），many 只能配数得清的。', tip: 'some 模糊，many 数得清', en: 'I can see some birds.', zh: '我能看见一些鸟。' },
    ],
    u6: [
      { t: '年龄用 be，不用 have', kid: '中文说「我九岁」，英语说 I am nine.，不能说 I have nine.——年龄在英语里是「你是多少岁」，不是「你拥有多少年」。中文也没有「有」，这一点中英都不带 have，别照母语硬翻。', tip: '年龄用 be 不用 have', en: 'I am nine years old.', zh: '我九岁。' },
      { t: '中文靠量词，英语靠复数', kid: 'two apples（两个苹果）——中文必须加「个」，英语直接把名词变复数。中文的「个、只、条、张」是量词，英语没有量词这一说，数字直接放在名词前面，一个 s 顶掉一个量词。', tip: '中文量词，英语复数', en: 'I have two apples.', zh: '我有两个苹果。' },
      { t: '几十几，中间一小横', kid: 'twenty-one、thirty-five——二十几、三十几中间要加一条小横，读起来还是一次连着说完。另外 11 是 eleven、12 是 twelve，跟 ten 一点关系都没有，这两个得单独记。', tip: '几十几，中间一小横', en: 'I am eight years old.', zh: '我八岁了。' },
      { t: '数得清才加 s', kid: 'cake 可以说 a cake、two cakes（一块块数得清）；water 就不行，只能说 some water。要数水得装杯子：two glasses of water。同样是「东西」，能不能数，英语分得很清。', tip: '数得清才加 s', en: 'I want some cake.', zh: '我想要一些蛋糕。' },
      { t: 'at 是时间上的一个点', kid: 'at six o\'clock（在六点）——at 画的是一个点，几点几分就用它。上午下午是一大段，用 in the morning；具体哪一天，用 on Monday。三个介词，三种大小，画的是三种圈。', tip: 'at 一个点，in 一大段', en: 'I get up at six o\'clock.', zh: '我六点起床。' },
      { t: '数字也是形容词', kid: 'five books——数字放在名词前面，干的活和形容词一样，都是给名词「定量」。所以它永远不变样，也不加 s：不能说 fives books。英语里数字老老实实站在名词前头，一动不动。', tip: '数字站名词前，不变样', en: 'I have five books.', zh: '我有五本书。' },
    ],
  },

  /* ============================================================
     三年级下册
     ============================================================ */
  pep3b: {
    u1: [
      { t: 'man 变 men，woman 变 women', kid: 'one man、two men——man 的复数不加 s，而是把 a 换成 e；woman 也照样变 women。同类还有 foot → feet、tooth → teeth。这几个是英语里最老的「换元音」复数，靠换字母报数。', tip: 'man 变 men', en: 'Two men are in the room.', zh: '房间里有两个人。' },
      { t: 'Mr 后面跟姓，不跟名', kid: 'Mr Wang（王先生）——Mr 后面跟姓。女老师则分三种：Ms（女士，不问婚否）、Mrs（已婚）、Miss（未婚）。称呼是社交规矩，说错了比语法错更尴尬，宁可先问一句怎么称呼。', tip: 'Mr 后面跟姓', en: 'This is Mr Wang.', zh: '这是王先生。' },
      { t: '国名换条尾巴就成人', kid: 'China（中国）、Chinese（中国人 / 汉语）——同一个根，换个尾巴就当人、当语言。英语常这样：Japan → Japanese、America → American、Australia → Australian。认识国名，就认识了一家人。', tip: '国名换尾巴就成人', en: 'I am Chinese.', zh: '我是中国人。' },
      { t: 'English 两副身份', kid: 'English 是「英语」，也是「英国的」：an English teacher 可能指「英语老师」，也可能指「英国老师」。想说清楚就说 a teacher of English。一个词两副身份，靠上下文定。', tip: '一词两身份，看上下文', en: 'She is my English teacher.', zh: '她是我的英语老师。' },
      { t: 'mate 是「伙伴」', kid: 'mate 是伙伴，所以 classmate 是同班的伙伴、roommate 是同屋的伙伴、teammate 是同队的伙伴。英语把「一起做什么」加上「伙伴」一拼，就是一个新词，好记也好猜。', tip: 'mate = 伙伴', en: 'He is my classmate.', zh: '他是我的同学。' },
      { t: '国名带普通词才加 the', kid: 'China、Canada 光着身子；the UK、the USA 却要加 the。规律不在「国家」，在「名字里有没有普通词」：Kingdom（王国）、States（州）这些词本来就该带 the，国名跟着带。', tip: '名字里有普通词才加 the', en: 'I am from the UK.', zh: '我来自英国。' },
    ],
    u2: [
      { t: '横着 long，竖着 tall', kid: 'long 说的是「有多长」（横着量），tall 说的是「有多高」（竖着量）。所以 a long tail 用 long，a tall tree 用 tall。中文「长」「高」分得清，英语也不许混，选错了方向就错了。', tip: '横着 long，竖着 tall', en: 'It has a long tail.', zh: '它有一条长尾巴。' },
      { t: 'her 有两个身份', kid: 'her 既能是「她的」（her hair 她的头发），也能是「她」（I help her 我帮她）。中文「她的」和「她」是两个词，英语一个 her 全包。看后面跟不跟名词就知道是哪个：跟名词是「她的」，不跟是「她」。', tip: '后面有名词，就是「她的」', en: 'I help her.', zh: '我帮她。' },
      { t: 'and 都要，or 选一个', kid: 'a cat or a dog（猫还是狗）——or 让听的人挑一个，and 是「都要」。问句里常用 or 摆出选项：Is it a cat or a dog? 回答不能两个都说，必须挑一个。', tip: 'and 都要，or 选一个', en: 'Is it a cat or a dog?', zh: '它是猫还是狗？' },
      { t: 'much 管程度，many 管个数', kid: 'I love you so much.（我很爱你）——so much 说的是爱的程度深，不是数量多。much 专门配数不清的东西和程度，many 配数得清的个数。一个量深浅，一个数多少。', tip: 'much 管深浅，many 管个数', en: 'I love you so much.', zh: '我很爱你。' },
      { t: '有些动作自己就能成立', kid: 'She can sing.（她会唱歌）——sing、dance、talk 这些动作自己就站得住，后面不用硬塞宾语。要说唱什么，才加：sing a song。中文「唱歌」的「歌」是白送的，英语不白送。', tip: '动作自己成立，不用硬塞', en: 'She can sing and dance.', zh: '她会唱歌跳舞。' },
      { t: 'all 站在 the 前面', kid: 'all the children（所有孩子）——all 要站在 the 前面，不能站后面：没有 the all children 这种说法。它管的是「整堆」，所以后面的名词得用复数。中文「所有的」不讲位置，英语讲。', tip: 'all 站 the 前面', en: 'All the children can sing.', zh: '所有的孩子都会唱歌。' },
    ],
    u3: [
      { t: 'this 指近，that 指远', kid: 'this（这个，手边）、that（那个，稍远）——英语用两个词就把距离说清楚了。变成复数就换成 these（这些）、those（那些）。中文「这个」「那个」也分远近，正好对得上。', tip: '近 this，远 that', en: 'These are my books.', zh: '这些是我的书。' },
      { t: 'these 后面的动词也要跟着变', kid: 'These are pencils.（这些是铅笔）——these 是「好几个」，动词必须配 are，不能配 is。这一条最容易漏：名词改了复数，动词忘了跟着改，句子就一半新一半旧。', tip: 'these 配 are', en: 'These are my pencils.', zh: '这些是我的铅笔。' },
      { t: '工具用 with，语言用 in', kid: 'I write with a pen.（我用钢笔写字）——with 后面放工具。但「用英语说」是 in English，不用 with，因为语言不是工具，是「在……里面说」。中文两个都用「用」，英语分得很清。', tip: '工具 with，语言 in', en: 'I write with a pen.', zh: '我用钢笔写字。' },
      { t: '感官动词直接接东西', kid: 'I see a bird. I hear a song.——see、hear 后面直接放感受到的东西，不用加 to，也不用加 at。这些词本身就是「接收」，东西自然落进句子里，不用中间再搭桥。', tip: '感官动词，直接接东西', en: 'I can hear a song.', zh: '我能听见一首歌。' },
      { t: 'in class 说的是状态', kid: 'in class（在上课）不是「在教室里」，那是 in the classroom。in class 说的是「上课这件事正在进行」，像中文「上课中」。少一个 the，意思就从「地方」变成了「状态」。', tip: 'in class 是状态', en: 'Do not talk in class.', zh: '上课不要说话。' },
      { t: 'study 是过程，learn 是结果', kid: 'study 是「学」这个动作（坐在那儿看书），learn 是「学会」这个结果（真会了）。I study English 我在学英语；I learn English 我学会了英语。一个看过程，一个看成果。', tip: 'study 过程，learn 结果', en: 'I learn English at school.', zh: '我在学校学英语。' },
    ],
    u4: [
      { t: 'breakfast 是「打破禁食」', kid: 'break（打破）+ fast（禁食）——古人一天只吃两顿，早上那顿是「打破整夜的禁食」，所以叫 breakfast。知道这个词，就明白它为什么不能加 a：它说的是「开斋」这件事，不是「一顿饭」。', tip: 'breakfast = 打破禁食', en: 'I have breakfast at seven.', zh: '我七点吃早饭。' },
      { t: '数不清的，用 of 装起来', kid: 'bread（面包）、rice（米饭）、meat（肉）都数不清，不能说 a bread、two rices。要数就装起来：a piece of bread（一片面包）、a bowl of rice（一碗饭）。中文靠量词，英语靠「容器 + of」。', tip: '容器 + of，就能数', en: 'I have some bread and milk.', zh: '我吃了一些面包，喝了一些牛奶。' },
      { t: '蔬菜习惯用复数', kid: 'Vegetables are healthy.（蔬菜有益健康）——说「蔬菜」这一类，英语习惯用复数，因为一盘通常好几种。要说某一种，才用单数：a vegetable。中文「蔬菜」不分单复，英语默认一堆。', tip: '蔬菜常作复数', en: 'Vegetables are healthy.', zh: '蔬菜有益健康。' },
      { t: 'fruit 是总称，fruits 是种类', kid: 'fruit 通常不加 s，指「水果」这一整类；fruits 指「好几种水果」。I like fruit.（我喜欢水果）I like these fruits.（我喜欢这几种水果）中文也能这么分，只是不靠 s。', tip: 'fruit 总称，fruits 种类', en: 'I like fruit.', zh: '我喜欢水果。' },
      { t: 'time 是时间，也是次数', kid: 'Time is up.（时间到了）Three times a day.（一天三次）——time 既能说「时间」（数不清），也能说「次数」（可数）。中文「时间」和「次」是两个词，英语一个 time 全包。', tip: 'time 时间也次数', en: 'I brush my teeth three times a day.', zh: '我一天刷三次牙。' },
      { t: '容器词能数清一切', kid: 'a plate of vegetables（一盘蔬菜）——plate 是盘子，a plate of 就是「一盘」。这样的词英语有一大串：a cup of（一杯）、a bowl of（一碗）、a glass of（一杯液体）。数不清的东西，靠它们才数得动。', tip: '容器 + of，数不清也能数', en: 'I have a plate of vegetables.', zh: '我有一盘蔬菜。' },
    ],
    u5: [
      { t: 'on 说的是贴着面', kid: 'on the shelf（在架子上）、on the box（在盒子上）——on 不是「高处」，是「贴着表面」。所以墙上的画是 on the wall，天花板上的灯是 on the ceiling。只要有接触面，就用 on。', tip: 'on = 贴着面', en: 'The ball is on the box.', zh: '球在盒子上。' },
      { t: 'in 是被围起来', kid: 'in the box（在盒子里）——in 说的是「四面被围住」。所以 in the box、in the bag、in the room 都用 in。对比 on：on 贴在面上，in 装进里面。一个在外，一个在内。', tip: 'in = 装到里面', en: 'The doll is in the box.', zh: '娃娃在盒子里。' },
      { t: 'under 是正下方', kid: 'under the bed（在床下）——under 是「正对着的下方」，不是随便在下面。斜下方要说 below。椅子底下、桌子底下都用 under，因为东西正好在它正下方。', tip: 'under 正下方', en: 'The ball is under the bed.', zh: '球在床下。' },
      { t: 'here 近，there 远', kid: 'here（这儿，靠近说话人）、there（那儿，离得远）——两个词就把距离说清了。所以 Here it is.（给你）和 There it is.（在那儿）差的是远近，不是意思。中文「这儿」「那儿」也是这个分法。', tip: 'here 近，there 远', en: 'Put it here, please.', zh: '请放在这里。' },
      { t: 'keep 是一直不扔', kid: 'I keep my old toys.（我留着我的旧玩具）——keep 不是「拿着」，是「一直不扔」。所以它常和 still（还）一起出现：I still keep them.（我还留着它们）一个说动作，一个说时间。', tip: 'keep = 一直不扔', en: 'I still keep my old toys.', zh: '我还留着我的旧玩具。' },
      { t: 'put away 是收起来', kid: 'put（放）+ away（离开）——把东西放到看不见的地方，就是收起来。中文「收」一个动词，英语用 put 加方向词。同类：put on（穿上）、put down（放下）。', tip: 'put away = 收起来', en: 'Put away your toys, please.', zh: '请把玩具收起来。' },
    ],
    u6: [
      { t: '11 和 12 不守规矩', kid: '从 13 开始都是「几 + teen」（thirteen、fourteen），可 11 是 eleven、12 是 twelve，跟 ten 一点关系都没有。这两个是老词，得单独记——它们是英语数字里唯一不听话的两个。', tip: '11、12 单独记', en: 'I have eleven books.', zh: '我有十一本书。' },
      { t: '变数字，词根要剪一刀', kid: 'three → thirteen，少了一个 e；five → fifteen，ve 变成了 f。这不是拼错，是英语为了读起来顺口，故意把词根剪了一下。数字的拼写越不规则，越要单独记。', tip: '变数字，词根剪一刀', en: 'I am thirteen years old.', zh: '我十三岁。' },
      { t: 'How much 既能问钱也能问量', kid: 'How much is it?（多少钱）How much water?（多少水）——much 配数不清的东西，钱和水都数不清。要问数得清的个数，就换成 How many。两个问法，分的是「能不能数」。', tip: 'much 数不清，many 数得清', en: 'How much is it?', zh: '这个多少钱？' },
      { t: 'back 一加，方向掉头', kid: 'I pay ten yuan.（我付十元）——pay 是把钱给出去。加上 back 就掉头：pay back 是「还钱」。一个 back，方向就反了。英语里很多动词加个方向词，意思立刻拐弯。', tip: 'back 一加，方向掉头', en: 'I pay ten yuan.', zh: '我付十元。' },
      { t: '一个画面定下一个词', kid: 'piggy bank 字面是「小猪银行」——早年存钱罐做成小猪的样子，叫着叫着，piggy bank 就成了存钱罐的正式名字。英语很多词都是这样被一个画面定下来的，记住画面就记住了词。', tip: '记住画面，就记住词', en: 'I put money in my piggy bank.', zh: '我把钱放进存钱罐。' },
      { t: '数字后面要补单位', kid: 'It is twenty yuan.（二十元）——说价钱时，数字后面要带上钱单位；只说 twenty，听的人不知道是二十元、二十个还是二十岁。英语的数字本身不带单位，单位得自己补上去。', tip: '数字后面补单位', en: 'It is twenty yuan.', zh: '这个二十元。' },
    ],
  },

  /* ============================================================
     四年级上册
     ============================================================ */
  pep4a: {
    u1: [
      { t: 'job 数得清，work 数不清', kid: 'job 是「一份工作」，能数：a job、two jobs。work 是「活儿」，数不清：a lot of work，不能说 a work。中文都叫「工作」，英语一个数得清一个数不清。', tip: 'job 数得清，work 数不清', en: 'My mother has a new job.', zh: '我妈妈有了一份新工作。' },
      { t: '地点 + worker 就是职业', kid: 'office worker（办公室职员）、factory worker（工厂工人）——worker 都一样，前面的 office / factory 说明在哪儿干活。英语给职业命名，常是「地点 + worker」，一听就知道上班的地方。', tip: '地点 + worker', en: 'My aunt is an office worker.', zh: '我姑姑是办公室职员。' },
      { t: '说国籍不加 a，说职业要加', kid: 'He is Chinese.（他是中国人）——说国籍直接说形容词，不加 a。但职业要加：He is a doctor. 因为职业是「其中一个」，国籍是「属于哪一类」。一个要数，一个不数。', tip: '国籍不加 a，职业要加', en: 'She is Chinese.', zh: '她是中国人。' },
      { t: 'help 先人，with 接事', kid: 'I help Mum with the cooking.（我帮妈妈做饭）——help 后面先放「被帮的人」，再用 with 引出「帮忙做的事」。中文「帮妈妈做饭」也是这个顺序，中英正好合拍。', tip: 'help 人 with 事', en: 'I help my mum with the housework.', zh: '我帮妈妈做家务。' },
      { t: '大目标 clean，小动作 sweep', kid: 'clean 是「弄干净」这个大目标，sweep 是「扫」这个具体动作。所以 sweep the floor 是扫地，clean the room 是收拾房间。英语有时用大词收口，有时用具体动作，看你到底做了什么。', tip: '大目标 clean，小动作 sweep', en: 'I sweep the floor.', zh: '我扫地。' },
      { t: 'person 的复数是 people', kid: 'one person、two people——person 的复数不是加 s，而是换了一整个词。people 本身已经是复数，所以说 two people，不能说 two peoples（除非指多个民族）。这是英语少数「换词」的复数。', tip: 'person 复数是 people', en: 'Many people are busy.', zh: '很多人很忙。' },
    ],
    u2: [
      { t: 'strong 说的是力气大', kid: 'strong 说的是「力气大、身体结实」，不是「身体好」。身体好用 healthy。所以 He is strong.（他很有劲）和 He is healthy.（他很健康）不是一回事。中文「壮」和「健康」也分。', tip: 'strong 力气大', en: 'My father is strong.', zh: '我爸爸力气很大。' },
      { t: '一整头 hair 不加 s', kid: 'hair 指一整头头发时数不清：long hair、short hair。只有指「几根头发」才说 hairs。中文「头发」也不说「一个头发」，这一点中英一样。', tip: '一整头 hair，几根 hairs', en: 'She has long hair.', zh: '她有长头发。' },
      { t: 'kind 夸心，quiet 夸静', kid: 'kind 夸的是对人的态度（肯帮忙、说话温和）；quiet 说的是声音小、不爱说话。一个夸心，一个夸嘴。中文都能翻成「好」，英语却分了工，选错了夸的方向就变了。', tip: 'kind 夸心，quiet 夸静', en: 'He is kind and quiet.', zh: '他善良又安静。' },
      { t: '球名里藏着玩法', kid: 'basket（篮子）+ ball（球）——最早的篮球真是往篮子里投。英语的运动名常常就是一个画面：football 是脚踢的球、basketball 是往篮子里投的球。看懂拼法，就记住了玩法。', tip: '球名里藏着玩法', en: 'I play basketball after school.', zh: '我放学后打篮球。' },
      { t: '最高级前面站 the', kid: 'the best friend（最好的朋友）——「最」只有一个，独一无二，所以配 the。中文「最好的」不带「那个」，英语的 the 却省不掉。同理 the tallest、the first 都要带 the。', tip: '最高级配 the', en: 'He is my best friend.', zh: '他是我最好的朋友。' },
      { t: 'and 两边要同类', kid: 'kind and quiet（又善良又安静）——and 两边得是同类的东西：形容词配形容词、名词配名词。不能说 kind and quietly，形容词配了副词，两边不对等，句子就歪了。', tip: 'and 两边要同类', en: 'She is kind and quiet.', zh: '她善良又安静。' },
    ],
    u3: [
      { t: 'afternoon 是 after + noon', kid: 'after（之后）+ noon（正午）——中午之后就是下午。英语的时间词很多是这么拼的：afternoon、midnight、weekend 一看就懂，morning、evening 才是单个的老词。', tip: 'afternoon = 正午后', en: 'I play in the afternoon.', zh: '我下午玩。' },
      { t: 'near 是不远，next to 是紧挨', kid: 'near 的范围比较松；next to 才是「紧挨着」。near the school 可能隔一条街，next to the school 就是隔壁。中文都叫「旁边」，英语把远近分开了。', tip: 'near 不远，next to 紧挨', en: 'The shop is near the school.', zh: '商店在学校附近。' },
      { t: '一个 the，去的目的就变了', kid: 'go to the park（去公园）有 the，是「去那个地方」；go to school（去上学）没 the，是「去做那件事」。所以 go to bed 是睡觉，go to the bed 是走到床边。', tip: '有 the 去地方，没 the 做事情', en: 'I go to the park on Sunday.', zh: '我星期天去公园。' },
      { t: 'library 本来是「书的地方」', kid: 'library 来自拉丁语 liber（书）——放书的地方就是图书馆。英语很多场所名都带着「里面放什么」：library 放书、gallery 挂画。记住词根，词就有了画面。', tip: 'library 放书的地方', en: 'The library is near my home.', zh: '图书馆在我家附近。' },
      { t: 'walk 已经含「去」', kid: 'I walk to school.（我走路去学校）——walk 自己就是「走着去」，不用再加 go。说 I go to school by walk 是错的，要么 walk to，要么 go to... on foot。', tip: 'walk 已经含「去」', en: 'I walk to school every day.', zh: '我每天走路去学校。' },
      { t: 'over there 是「在那边」', kid: 'over（越过一段距离）+ there（那儿）——隔着一段的那头，就是「那边」。中文「那边」一个词，英语把「隔着一段」也说了出来。指远处的东西用它，比 there 更有距离感。', tip: 'over there 在那边', en: 'The park is over there.', zh: '公园在那边。' },
    ],
    u4: [
      { t: 'police officer 为什么不叫 policeman', kid: '英语现在多用 police officer，因为 officer 不分男女，谁都能当。以前的 policeman 把「man」写进了名字，女警察就没位置了。中文「警察」本来就不分，这一点正好对上。', tip: 'officer 不分男女', en: 'He is a police officer.', zh: '他是一名警察。' },
      { t: 'cleaner 能指人也能指物', kid: 'cleaner 既是「清洁工」（做清洁的人），也是「清洁剂」（用来清洁的东西）。同一个词，一个指人一个指物，靠上下文分。英语的 -er 造出来的词，常常人和工具都能指。', tip: 'cleaner 人也物也', en: 'The cleaner is cleaning the street.', zh: '清洁工在打扫街道。' },
      { t: 'old 是「老」，也是「旧」', kid: 'an old man（老人）、an old book（旧书）——old 既能说人年纪大，也能说东西用得久。中文「老」和「旧」分两个词，英语一个 old 全包，看它后面跟的是人还是物。', tip: '人老物旧都是 old', en: 'This is an old book.', zh: '这是一本旧书。' },
      { t: 'tell 先给人，say 直接说话', kid: 'tell me a story（给我讲个故事）——tell 后面先放「听的人」，再放「说的内容」。say 不一样，直接接话：say hello。所以 tell me、say to me，两个词脾气不同。', tip: 'tell 先给人', en: 'Tell me a story, please.', zh: '请给我讲个故事。' },
      { t: 'make 是把东西做成样子', kid: 'make the bed 是铺床——铺好的床像「做出来」的一件成品。英语常拿 make 表示「整理成该有的样子」：make tea（泡茶）、make a cake（做蛋糕）、make the bed（铺床）。', tip: 'make = 做成该有的样子', en: 'I make the bed every morning.', zh: '我每天早上铺床。' },
      { t: 'Ms 最稳妥', kid: 'Ms（女士）不透露已婚未婚，最稳妥；Mrs 是已婚，Miss 是未婚。现在正式场合几乎都用 Ms，因为婚姻状况不该写在称呼里。中文「女士」正好对应 Ms。', tip: 'Ms 不问婚否', en: 'Ms Li is our teacher.', zh: '李老师是我们的老师。' },
    ],
    u5: [
      { t: 'weather 数不清', kid: 'weather 不能加 s，也不能说 a weather。要说「好天气」是 good weather，「天气不好」是 bad weather。中文「天气」也不数，这一点中英一样，别被汉语的「一场雨」带跑。', tip: 'weather 不加 s', en: 'The weather is good today.', zh: '今天天气很好。' },
      { t: 'rain 名词动词一肩挑', kid: 'It is raining.（正在下雨）It rains a lot here.（这里常下雨）——rain 自己就能当动词，不必再借别的词。名词说「雨」，动词说「下雨」，一个词干两份活。', tip: 'rain 名词动词一肩挑', en: 'It is raining now.', zh: '现在正在下雨。' },
      { t: 'warm 舒服，hot 受不了', kid: 'warm 是「暖和」，让人舒服；hot 是「热」，有点受不了。所以春天是 warm，夏天是 hot。中文「暖和」「热」也分程度，英语同样分层，选词就等于报温度。', tip: 'warm 舒服，hot 难耐', en: 'It is warm in spring.', zh: '春天很暖和。' },
      { t: 'film 英式，movie 美式', kid: 'film 是英式说法，movie 是美式说法，都是「电影」。课文里用 film，美国孩子说 movie。英语很多日常词都有两套，听懂就行，不必纠结用哪个。', tip: 'film 英式，movie 美式', en: 'We watch a film today.', zh: '我们今天看电影。' },
      { t: '可数的名词要报数', kid: 'fly a kite（放风筝）——kite 是可数名词，放一只就得报个数，加 a。中文「放风筝」不带数量，英语非得说「放一只」，这个 a 省不掉。', tip: '可数的要报数', en: 'We can fly a kite in the park.', zh: '我们可以在公园放风筝。' },
      { t: 'close 是动作，closed 是状态', kid: 'The shop is closed.（店关着）——closed 是形容词，说状态；close 是动词，说动作。中文「关门」一个词包了两种，英语分成「去关」（close）和「关着」（closed）。', tip: 'close 动作，closed 状态', en: 'The shop is closed today.', zh: '这家店今天关门。' },
    ],
    u6: [
      { t: 'sweater 让你出汗的衣服', kid: 'sweat（出汗）+ er —— 穿上会让人出汗的衣服，就是毛衣。英语的衣物名常带着用途或画面：raincoat 是挡雨的 coat、T-shirt 是 T 形的 shirt。', tip: 'sweater 让你出汗', en: 'I wear a sweater in winter.', zh: '冬天我穿毛衣。' },
      { t: '成双的东西爱复数', kid: 'gloves（手套）、socks（袜子）、shoes（鞋）——这些东西天生一双，所以总用复数。要说「一双」得用 a pair of：a pair of gloves。中文「一只手套」英语很少这么说。', tip: '成双的用复数', en: 'I need a pair of gloves.', zh: '我需要一副手套。' },
      { t: 'T-shirt 的 T 是形状', kid: 'T-shirt 摊开就是字母 T 的形状——短袖、无领、像个 T。英语很多衣服名是看形状起的：V-neck 是 V 领。看懂了形状，这个词就忘不掉。', tip: 'T-shirt 是 T 形', en: 'He wears a T-shirt.', zh: '他穿一件 T 恤。' },
      { t: 'then 是「然后」，也是「那时」', kid: 'Then we went home.（然后我们回家了）I was young then.（那时我还小）——then 既能接下文的「然后」，也能指过去的「那时候」。中文「然后」「那时」是两个词，英语一个 then 全包。', tip: 'then 然后也那时', en: 'Then we went home.', zh: '然后我们回家了。' },
      { t: 'autumn 和 fall 是同一个秋天', kid: 'autumn 是英式说法，fall 是美式说法，指的都是秋天。fall 本义是「落下」——树叶落下的季节，画面感很强。英语很多词都有英美两套，意思完全一样。', tip: 'autumn 英式，fall 美式', en: 'Leaves fall in autumn.', zh: '秋天树叶落下。' },
      { t: '两个普通词凑出新意思', kid: 'We get together in winter.（冬天我们聚在一起）——get 在这里不是「得到」，是「变成、到达」，together 是「一起」。两个普通的词合起来，就是「聚到一块儿」。', tip: '两个普通词凑出新意思', en: 'We get together in winter.', zh: '冬天我们聚在一起。' },
    ],
  },

  /* ============================================================
     四年级下册
     ============================================================ */
  pep4b: {
    u1: [
      { t: 'must 是硬规定，should 是建议', kid: 'You must be quiet in class.（上课必须安静）——must 是墙上贴的规矩，没得商量；should 是「应该」，是心里觉得该这么做。中文「要」两种都能用，英语分得很清。', tip: 'must 硬规定，should 建议', en: 'You must be quiet in class.', zh: '上课必须安静。' },
      { t: 'up 不总向上，还表示「加劲」', kid: 'Hurry up!（快点！）——这里的 up 不是「向上」，是「把劲提上来」。英语里 up 常表示「加大、完成」：eat up（吃光）、wake up（醒过来）、hurry up（赶紧）。', tip: 'up 还能表示「加劲」', en: 'Hurry up, or you will be late.', zh: '快点，不然你要迟到了。' },
      { t: 'rule 是尺子，也是规则', kid: 'rule 本来是「尺子」——用尺子量，就有了标准，标准写下来就是规则。所以 class rules 是班规。中文「尺」和「规」也有这个味道（规矩），一个词从实物走到抽象。', tip: 'rule 尺子变规则', en: 'We have many class rules.', zh: '我们有很多班规。' },
      { t: 'newspaper 是 news + paper', kid: 'news（新闻）+ paper（纸）——印在纸上的新闻就是报纸。英语的复合词常这样直白：bedroom 是放床的房间、blackboard 是黑色的板。拆开一看，词就明白了。', tip: 'news + paper', en: 'My dad reads a newspaper.', zh: '我爸爸看报纸。' },
      { t: 'ready 是状态，prepare 是动作', kid: 'Are you ready?（你准备好了吗）——ready 是形容词，配 be，只表示「已经就绪」这个状态。要说「准备」这个动作，得用 prepare。中文「准备」身兼两职，英语分开走。', tip: 'ready 状态，prepare 动作', en: 'Are you ready for class?', zh: '你准备好上课了吗？' },
      { t: 'out 发下去，in 交上去', kid: 'hand 是「手」，out 是「往外」——用手往外发，就是分发。hand in 反过来，是「交上去」。一个 out 一个 in，方向正好反着。英语的方向词，常在悄悄改意思。', tip: 'out 发下去，in 交上去', en: 'Please hand out the workbooks.', zh: '请把练习册发下去。' },
    ],
    u2: [
      { t: '动的用 watch', kid: 'watch TV（看电视）——watch 是「盯着动的东西看」，所以看电视、看比赛都用它；看书用 read，看图片用 look at。中文一个「看」字，英语按看什么分了三个词。', tip: '动的用 watch', en: 'I watch TV after dinner.', zh: '我晚饭后看电视。' },
      { t: 'homework 不加 s', kid: 'homework 不能加 s，也不能说 a homework。要说「一些作业」：some homework；「很多作业」：a lot of homework。中文「作业」也不数个数，这一点中英一样。', tip: 'homework 不加 s', en: 'I do my homework after school.', zh: '我放学后做作业。' },
      { t: 'wet 和 dry 是一对', kid: 'wet 是「湿的」，dry 是「干的」——洗完手是 wet，擦干是 dry。中文「湿」「干」也是一对。英语里这种反义成对的形容词很多，一起记最省力。', tip: 'wet 湿，dry 干', en: 'My hands are wet.', zh: '我的手是湿的。' },
      { t: 'safe 是不出事', kid: 'It is not safe.（这不安全）——safe 说的是「不会受伤」，不是「很坚固」。所以过马路注意安全是 Be safe，在厨房跑不安全是 It is not safe to run. 中文「安全」范围宽，英语更具体。', tip: 'safe 是不出事', en: 'It is not safe to run in the kitchen.', zh: '在厨房跑不安全。' },
      { t: 'loud 说音量，noisy 惹人烦', kid: 'Do not be loud.（别大声）——loud 只形容声音大，说的是音量；noisy 是「吵」，带点让人心烦的意思。中文「大声」「吵」也分，英语同样分：一个说音量，一个说感受。', tip: 'loud 音量，noisy 惹人烦', en: 'Do not be loud in the study.', zh: '书房里不要大声。' },
      { t: 'hard 是努力，也是硬', kid: 'work hard（努力工作）a hard bed（硬床）——hard 既能说「使劲」，也能说「不软」。中文「努力」和「硬」是两个词，英语一个 hard 全包，形容词副词都用它。', tip: 'hard 努力也硬', en: 'He works hard at school.', zh: '他在学校很努力。' },
    ],
    u3: [
      { t: 'up 表示「起来」', kid: 'get up（起床）——up 表示「从躺到站」这个方向。所以 sit up 是坐直，stand up 是站起来。英语拿 up 表示「往上、起来」，一个方向词就把动作说清了。', tip: 'up = 起来', en: 'I get up at six thirty.', zh: '我六点半起床。' },
      { t: '科目小写，语言大写', kid: 'art、maths、music 这些科目名一般小写；只有语言名（English、Chinese）要大写。所以 I have art on Monday. 的 art 小写，English 大写。这条最容易在作文里被扣分。', tip: '科目小写，语言大写', en: 'I have art on Monday.', zh: '我星期一有美术课。' },
      { t: 'just 看上下文', kid: 'It is just six.（才六点）I just finished.（我刚做完）——just 站在时间上，可以是「刚刚」，也可以是「正好、才」。看句子说的是过去还是现在，意思自己会浮出来。', tip: 'just 看上下文', en: 'It is just six o\'clock.', zh: '才六点。' },
      { t: '时间词也能表示「一会儿」', kid: 'Wait a minute.（等一下）——minute 本义是一分钟，口语里常表示「一小会儿」，不真是一分钟。中文「等一会儿」也是这样，时间词被借去表示「短暂」。', tip: '时间词表示「一会儿」', en: 'Wait a minute, please.', zh: '请等一下。' },
      { t: 'clock 挂钟，watch 手表', kid: 'clock 是挂在墙上、摆在桌上的钟；watch 是戴在手腕上的表。中文「钟」「表」也分，英语分得更清楚。o\'clock 就是 of the clock 缩来的，所以只说整点。', tip: 'clock 挂钟，watch 手表', en: 'The clock is on the wall.', zh: '钟在墙上。' },
      { t: '越过之后就是完了', kid: 'School is over.（放学了）——over 本义是「在上方、越过」，越过之后就是「完了」。所以 game over 是游戏结束，class is over 是下课。一个空间词，被借去说时间。', tip: '越过之后就是完了', en: 'School is over at four.', zh: '四点放学。' },
    ],
    u4: [
      { t: 'clothes 永远是复数', kid: 'clothes（衣服）——它天生是复数，没有单数形式，也不能说 a clothes。要说「一套衣服」得说 a suit。中文「衣服」不分单复，英语把它当成一堆。', tip: 'clothes 永远复数', en: 'These clothes are beautiful.', zh: '这些衣服很漂亮。' },
      { t: 'expensive 说事实，dear 带心疼', kid: 'expensive 是客观的「价钱高」；dear 在英式英语里也说「贵」，但更带「贵得让人心疼」的味道。中文「贵」一个词，英语一个说事实，一个说感受。', tip: 'expensive 说事实', en: 'This jacket is too expensive.', zh: '这件夹克太贵了。' },
      { t: 'cheap 略带贬义', kid: 'cheap 是「便宜」，但有时暗示「便宜没好货」。想说「实惠」，用 good value 更稳妥。中文「便宜」是中性词，英语的 cheap 稍微带刺，夸东西时别乱用。', tip: 'cheap 略带贬义', en: 'This hat is cheap.', zh: '这顶帽子很便宜。' },
      { t: 'free 免费或有空', kid: 'free 既是「免费的」，也是「有空的」：It is free.（免费）Are you free?（你有空吗）一个说不用花钱，一个说没有束缚。同一个词，两种「自由」。', tip: 'free 免费或有空', en: 'The sunglasses are free.', zh: '这副墨镜是免费的。' },
      { t: '尺码用 size', kid: 'What size?（什么尺寸）Large, please.（大号）——英语的衣服尺码用 small / medium / large，不说「大中小」。买衣服先问 size，再说要哪个。', tip: '尺码用 size', en: 'What size do you want?', zh: '你要什么尺码？' },
      { t: 'take it = 我买了', kid: 'take 本来只是「拿」，但在商店里说 I will take it. 就是「我买了」。中文「买了」是专门的词，英语借「拿走」这个动作来说，画面很直接：我把它拿走。', tip: 'take it 我买了', en: 'It is nice. I will take it.', zh: '这个不错，我买了。' },
    ],
    u5: [
      { t: '动物一个词，肉一个词', kid: '活着的牛叫 cow，端上桌的牛肉叫 beef。英语很多肉有专门的名字：pig → pork（猪肉）、sheep → mutton（羊肉）。中文「猪」和「猪肉」只差一个字，英语换了整个词。', tip: '动物一个词，肉一个词', en: 'The cow is on the farm.', zh: '奶牛在农场上。' },
      { t: 'bee 采蜜，honey 是蜜', kid: 'bee（蜜蜂）采花酿出 honey（蜂蜜）。英语里动物和产物常常不同词：bee → honey、cow → milk。中文「蜜蜂」「蜂蜜」也分，这一点中英一致。', tip: 'bee 采蜜，honey 是蜜', en: 'Bees make honey.', zh: '蜜蜂酿蜜。' },
      { t: 'horse 加 s，别混 house', kid: 'horse → horses，直接加 s。注意别和 house（房子）混：house 的复数是 houses，读音也不同。英语里长得像的词，复数照样按自己的规矩来。', tip: 'horse 加 s', en: 'I see two horses.', zh: '我看见两匹马。' },
      { t: 'green bean 是绿豆角', kid: 'green（绿）+ bean（豆）——绿色的豆荚，就是绿豆角。英语的植物名常按颜色和形状拼：green bean、red pepper。看懂了，菜市场也认得。', tip: 'green bean 绿豆角', en: 'I like green beans.', zh: '我喜欢绿豆角。' },
      { t: 'can 是「能」，也是「罐头」', kid: 'I can swim.（我会游泳）a can of coke（一罐可乐）——can 既能当「能」，也能当「罐头」。同一个拼法，两种身份，看它在句子里干什么活就知道。', tip: 'can 能也罐头', en: 'I can swim.', zh: '我会游泳。' },
      { t: 'horse 的 h 要发音', kid: 'horse 的 h 要发音 /hɔːs/，但 hour（小时）的 h 不发音 /ˈaʊə/。同样是 h 开头，一个出声一个不出声。英语的 h 有时是哑的：hour、honest。', tip: 'horse 出声，hour 哑', en: 'I can ride a horse.', zh: '我会骑马。' },
    ],
    u6: [
      { t: 'feed 后面接被喂的', kid: 'feed 不是「喂」这个动作本身，是「给人或动物吃的」：feed the chickens（喂鸡）。所以它必须接「被喂的对象」。中文「喂鸡」也是这个结构，中英正好合拍。', tip: 'feed 后面接被喂的', en: 'I feed the chickens every morning.', zh: '我每天早上喂鸡。' },
      { t: 'pick 是摘，也是挑', kid: 'pick apples（摘苹果）pick one（挑一个）——pick 是手指挑拣的动作，摘果子是它，选东西也是它。一个动作，两种场景，都是「用手从一堆里取出来」。', tip: 'pick 摘也挑', en: 'We pick apples on the farm.', zh: '我们在农场摘苹果。' },
      { t: '名词当动词用', kid: 'milk the cow（挤牛奶）——milk 本来是名词「牛奶」，当动词就是「取奶」。英语常把「得到某个东西」直接说成那个东西当动词。同类：water the flowers（浇花）、book a room（订房）。', tip: '名词当动词用', en: 'I can milk the cow.', zh: '我会挤牛奶。' },
      { t: 'kn 的 k 不发音', kid: 'knife 的 k 不出声，读「奈夫」。英语里 k 在 n 前面常常是哑的：know、knee、knock、knife 都是这样。拼写里留着它，只是历史留下的痕。', tip: 'kn 的 k 不发音', en: 'I use a knife and fork.', zh: '我用刀和叉。' },
      { t: 'delicious 是夸到心里', kid: 'delicious 比 good、nice 都强，是「真好吃」。说 It is delicious，是夸到心里去了。中文「好吃」程度模糊，英语有专门的词表示「特别香」。', tip: 'delicious 夸到心里', en: 'The salad is delicious.', zh: '这沙拉真好吃。' },
      { t: 'waste 是白扔了', kid: 'Do not waste food.（别浪费食物）——waste 说的是「本来有用，却被丢掉」。所以它既能当动词（浪费），也能当名词（废物）。中文「浪费」也是这个意思，中英对得上。', tip: 'waste 是白扔了', en: 'Do not waste food.', zh: '不要浪费食物。' },
    ],
    num: [
      { t: '十几和几十，重音不一样', kid: 'thirteen 重音在后面（-teen 重读），thirty 重音在前面。所以听人说话时，重音落在后半就是「十几」，落在前面就是「几十」。这是分辨 13 和 30 最实用的办法。', tip: '重音在后是十几', en: 'I am thirteen years old.', zh: '我十三岁。' },
      { t: 'two 的 w 不发音', kid: 'two 读 /tuː/，那个 w 是不出声的。同类：write、wrong、answer 里的 w 也都是哑的。英语拼写里保留了很多「历史上发过、现在不发了」的字母。', tip: 'two 的 w 不发音', en: 'I have two books.', zh: '我有两本书。' },
      { t: '号码要一个一个念', kid: '电话号码、房间号这种一串数字，英语是一个一个念的，不读成「几百几十」，因为它们是编号，不是数量。中文也常这样念，英语一样。', tip: '号码一个一个念', en: 'My room number is two zero one.', zh: '我的房间号是 201。' },
      { t: 'st / nd / rd / th 有讲究', kid: '第一是 1st，第二是 2nd，第三是 3rd，第四开始都是 th（4th）；11、12、13 又回到 th（11th、12th、13th）。这几个尾巴来自 first、second、third 的最后两个字母。', tip: 'st / nd / rd / th', en: 'Today is May the first.', zh: '今天是五月一日。' },
      { t: '序数词前面要 the', kid: 'the first day（第一天）、the third one（第三个）——序数词前面几乎都配 the，因为「第几」只有一个，独一无二。中文「第一天」不带「那个」，英语的 the 省不掉。', tip: '序数词配 the', en: 'He is the first in line.', zh: '他排在第一个。' },
      { t: '几十 + 几，中间一小横', kid: 'twenty-one、twenty-two……九十九之后才是 one hundred。英语的数字是「几十 + 几」拼起来的，中间加一条小横。中文「二十一」也是这个结构，顺序完全一样。', tip: '几十 + 几，中间一小横', en: 'I can count to one hundred.', zh: '我能数到一百。' },
    ],
  },

  /* ============================================================
     五年级上册
     ============================================================ */
  pep5a: {
    u1: [
      { t: 'jump rope 是跳绳', kid: 'jump（跳）+ rope（绳）——跳的绳就是跳绳。英语把动作和东西一拼，就是这项运动的名字。同类：swimming pool 是游泳的池子、dining room 是吃饭的房间。', tip: 'jump rope 跳绳', en: 'I can jump rope.', zh: '我会跳绳。' },
      { t: '-er 万能，谁做谁是人', kid: 'play（打球）+ er（人）= player。打球的人是 player，弹琴的人可以是 piano player。英语的 -er 不挑场景，只要「做这件事的人」都能套，所以 team player 就是「团队里的人」。', tip: '-er 万能，谁做谁是人', en: 'He is a good player.', zh: '他是个好球员。' },
      { t: 'Australia 是「南方的大陆」', kid: 'Australia 来自拉丁语 australis（南方的）——南半球那块大陆，就叫「南方之地」。英语的地名常带着方向：Australia 是南、Norway 是「北边的路」。', tip: 'Australia 南方之地', en: 'He is from Australia.', zh: '他来自澳大利亚。' },
      { t: 'robot 本来是「苦工」', kid: 'robot 来自捷克语 robota，意思是「苦役、卖力气」——一百年前一出戏里，机器替人干苦活，就叫 robot。所以这个词天生带着「替人干活」的影子。', tip: 'robot 本来是苦工', en: 'This robot can walk.', zh: '这个机器人会走路。' },
      { t: '人用 young，东西用 new', kid: 'young 只指年纪：a young player。东西新要用 new。中文「年轻」「新」有时混着说「新来的老师」，英语分得很清：人看年纪用 young，物看新旧用 new。', tip: '人 young，物 new', en: 'He is young but clever.', zh: '他年纪小但很聪明。' },
      { t: 'easy 是形容词，easily 才是副词', kid: 'easy（容易）说的是「做起来不费劲」，是形容词，配 be 或贴名词。要修饰动作「轻松地做」，得用 easily。中文「容易」两种都能当，英语得看它修饰谁。', tip: 'easy 形容词，easily 副词', en: 'This game is easy.', zh: '这个游戏很简单。' },
    ],
    u2: [
      { t: 'worried 是状态，worry 是动作', kid: 'worry 是「担心」这个动作，worried 是「担心的」这个状态：I am worried. 而 be worried about 才是「担心某件事」。中文「担心」一个词，英语分成动作和状态两副样子。', tip: 'worried 是状态', en: 'I am worried about the test.', zh: '我担心这次考试。' },
      { t: 'afraid 后面要垫 of', kid: 'I am afraid of dogs.（我怕狗）——afraid 是形容词，怕什么得加 of。中文「怕狗」直接接，英语得垫一个词。同类：be afraid of heights（怕高）、be afraid to go（不敢去）。', tip: 'afraid 后面跟 of', en: 'She is afraid of dogs.', zh: '她怕狗。' },
      { t: 'angry with 人，angry at 事', kid: 'be angry with sb.（生某人的气）、be angry at sth.（对某件事生气）——介词不同，气对着谁就不同。中文「生气」不分对象，英语用 with / at 把对象分清了。', tip: 'angry with 人，at 事', en: 'He is angry with me.', zh: '他生我的气。' },
      { t: 'laugh 出声，smile 不出声', kid: 'laugh 是「笑出声」，smile 是「微笑」，可能一点声音都没有。中文「笑」「微笑」也分，英语分得更清：laugh 有声音，smile 只是嘴角。用错了，画面就变了。', tip: 'laugh 出声，smile 不出声', en: 'We laugh and smile.', zh: '我们又笑又微笑。' },
      { t: 'move 是移动，也是打动', kid: 'move 本义是「移动」：move the chair。但它也能说「打动」：The story moved me. 因为心里的位置也被移动了。英语爱用一个动作词，讲两层意思，靠上下文分。', tip: 'move 移动也打动', en: 'The story moved me.', zh: '这个故事打动了我。' },
      { t: 'ask 问，ask for 求', kid: 'ask a question（问问题）ask for help（请求帮助）——ask 后面直接跟问题，要请求什么得加 for。中文「问」和「求」是两个词，英语一个 ask 加不加 for 就分开了。', tip: 'ask 问，ask for 求', en: 'You can ask for help.', zh: '你可以请求帮助。' },
    ],
    u3: [
      { t: '星期名来自天体', kid: 'Monday 是「月亮日」，Sunday 是「太阳日」，Saturday 是「土星日」——古英语拿天体给一周七天命名。知道来路，拼写就有线索：Mon（月）、Sun（日）、Sat（土）。', tip: '星期名来自天体', en: 'We have PE on Monday.', zh: '我们星期一有体育课。' },
      { t: 'weekend 是 week + end', kid: 'week（周）+ end（末尾）——一周的末尾就是周末。英语的时间词常这么拼：weekend、afternoon、midnight。看懂了拼法，这个词就不用死记。', tip: 'weekend = 周末', en: 'I play on the weekend.', zh: '我周末玩。' },
      { t: 'evening 傍晚，night 夜里', kid: 'evening 是天刚黑、还没睡的那一段；night 是夜里、睡觉的那一段。所以 Good evening 是晚上见面问好，Good night 是道别去睡。中文「晚上」一个词，英语分两段。', tip: 'evening 傍晚，night 夜里', en: 'I read in the evening.', zh: '我傍晚看书。' },
      { t: 'ping-pong 是打球的声音', kid: 'ping-pong 是模仿球打在桌上的声音起的名字——「乒」「乓」。英语里这类象声词不少：buzz（嗡嗡）、splash（扑通）。声音一变，词就记住了。', tip: 'ping-pong 是声音', en: 'I play ping-pong on Friday.', zh: '我星期五打乒乓球。' },
      { t: 'start 口语，begin 书面', kid: 'start 和 begin 都表示「开始」，多数时候能换着用：start 更口语，begin 更书面。要说「开始做某事」，两个后面都接 to do 或 doing：start to read / start reading。', tip: 'start 口语，begin 书面', en: 'Class starts at eight.', zh: '八点开始上课。' },
      { t: 'answer 动词名词都行', kid: 'answer 既能当动词（answer the question 回答问题），也能当名词（the answer 答案）。中文「回答」和「答案」是两个词，英语一个词两用，靠它在句子里的位置分辨。', tip: 'answer 动词名词都行', en: 'Can you answer the question?', zh: '你能回答这个问题吗？' },
    ],
    u4: [
      { t: 'stay 是「一直保持」', kid: 'stay 不是「停留」，是「一直维持某种样子」：stay healthy（保持健康）、stay at home（待在家）。所以它后面常跟形容词或地点。中文「保持」也是这个意思。', tip: 'stay = 一直保持', en: 'We should stay healthy.', zh: '我们应该保持健康。' },
      { t: '锻炼不可数，练习可数', kid: 'exercise 指「锻炼」时数不清：do exercise、get enough exercise。指「一套练习题」时才可数：do exercises。中文「运动」和「练习」也分，英语靠一个 s 分。', tip: '锻炼不可数，练习可数', en: 'We should get enough exercise.', zh: '我们应该有足够的锻炼。' },
      { t: 'if 后面不用 will', kid: 'If you are tired, have a rest.（累了就休息）——if 说的是「条件」，条件句里不用 will，直接用现在时。中文「如果…就…」也是这个逻辑，英语只是把 will 挡在门外。', tip: 'if 后面不用 will', en: 'If you are tired, have a rest.', zh: '如果你累了，就休息一下。' },
      { t: 'take care of = 照看', kid: 'take care（当心）+ of（关于）——「对某样东西上心」，就是照看它。take care of your teeth 就是刷牙、少吃糖。英语的短语动词常把一个大动作拆成几个小词。', tip: 'take care of = 照看', en: 'We should take care of our teeth.', zh: '我们应该爱护牙齿。' },
      { t: 'brush 通用「刷」', kid: 'brush your teeth（刷牙）——brush 是「刷」这个动作，刷牙、刷头发、刷鞋都用它，中文「刷」也通用。注意 teeth 是 tooth 的复数，刷牙永远刷一片。', tip: 'brush 通用「刷」', en: 'I brush my teeth twice a day.', zh: '我一天刷两次牙。' },
      { t: 'an hour，h 不发音', kid: 'an hour（一小时）——hour 的 h 不发音，开头是元音，所以用 an。这是「看声音不看字母」最经典的例子。同类：an honest boy、an hour ago。', tip: 'an hour，h 不发音', en: 'I sleep for eight hours.', zh: '我睡八个小时。' },
    ],
    u5: [
      { t: 'hungry 是真饿，want 只是馋', kid: 'hungry 说的是身体空了的感受。想吃某样东西是 want。I am hungry 是真饿，I want ice cream 只是想吃冰淇淋。中文「饿」和「馋」也分，英语同样分得清。', tip: 'hungry 真饿，want 是馋', en: 'I am hungry.', zh: '我饿了。' },
      { t: '一个个数得清就加 s', kid: 'a dumpling、two dumplings——饺子一个个数得清，所以可数。中文「一个饺子」也是这个结构。食物里能一个个数的，都走这条路；数不清的（rice、meat）就不加。', tip: '数得清就加 s', en: 'I eat dumplings at the Spring Festival.', zh: '我春节吃饺子。' },
      { t: 'interesting 是「让人有兴趣」', kid: 'interest（兴趣）+ ing = interesting（让人有兴趣的）。-ing 结尾的形容词说的是「让人…的」，主语常是事物：The book is interesting. 人被引起兴趣则是 interested。', tip: 'interesting 是让人有兴趣', en: 'This book is interesting.', zh: '这本书很有意思。' },
      { t: 'round 又圆又围', kid: 'a round table（圆桌）——round 是形容词「圆的」。它也能当介词「围绕」：sit round the table（围桌而坐）。一个词，形状和方位都管，画面感很强。', tip: 'round 又圆又围', en: 'The moon is round.', zh: '月亮是圆的。' },
      { t: 'way 是路，也是办法', kid: 'on the way（在路上）a way to learn（一种学习方法）——way 本义是「路」，被借去说「办法」，因为办法也是一条走得通的路。中文「路子」也有这个味道。', tip: 'way 路也是办法', en: 'This is a good way to learn.', zh: '这是一个好的学习方法。' },
      { t: 'Mrs 跟着丈夫的姓', kid: 'Mrs Li（李太太）——Mrs 后面跟丈夫的姓，说明已婚。Ms 不问婚否，Miss 是未婚。中文「太太」「女士」也分，英语的称呼把婚姻状况写在了脸上。', tip: 'Mrs 跟丈夫的姓', en: 'Mrs Li makes good dumplings.', zh: '李太太包的饺子很好吃。' },
    ],
    u6: [
      { t: 'famous for 因…闻名', kid: 'be famous for（因…而闻名）：Hangzhou is famous for the West Lake.——famous 只说「有名」，因什么有名得用 for 引出来。中文「因…出名」也是这个结构。', tip: 'famous for 因…闻名', en: 'The city is famous for its lake.', zh: '这座城市因湖而闻名。' },
      { t: 'dangerous 说东西，in danger 说人', kid: 'danger（危险）+ ous（满是）= dangerous（充满危险的）。说某个东西危险用它：It is dangerous. 说人「处于危险中」用 in danger。一个说东西的性质，一个说人的处境。', tip: 'dangerous 说东西', en: 'It is dangerous to swim in the river.', zh: '在河里游泳很危险。' },
      { t: '雨大用 heavy', kid: 'heavy rain（大雨）、heavy snow（大雪）——中文说雨「大」，英语说雨「重」，因为雨下得猛，像压下来一样重。这类搭配不能直译，得整块记。', tip: '雨大用 heavy', en: 'There is heavy rain today.', zh: '今天雨很大。' },
      { t: 'waterfall 是 water + fall', kid: 'water（水）+ fall（落下）——水从高处落下来，就是瀑布。英语的景观名常这么直白：waterfall、rainbow（雨弓）、sunrise（日出）。拆开一看就懂。', tip: 'waterfall 水落下', en: 'We see a waterfall.', zh: '我们看见一条瀑布。' },
      { t: 'go + ing = 去做这项活动', kid: 'go hiking（去徒步）、go swimming（去游泳）——go 后面接动词 ing，表示「去做这项活动」。不能说 go hike。这个 ing 不是「正在」，是活动本身的名字。', tip: 'go + ing 去做活动', en: 'We go hiking in the forest.', zh: '我们去森林徒步。' },
      { t: 'fine 是「晴」，也是「好」', kid: 'It is fine today.（今天天气好）I am fine.（我很好）——fine 既能说天气晴朗，也能说人状态不错。中文「晴」和「好」是两个词，英语一个 fine 全包。', tip: 'fine 晴也好', en: 'It is fine today.', zh: '今天天气很好。' },
    ],
  },

  /* ============================================================
     五年级下册
     ============================================================ */
  pep5b: {
    u1: [
      { t: 'must 的过去是 had to', kid: 'must 只有现在这一副样子，没有 musted。要说过去「必须」，得换成 had to：I had to wait.（我不得不等）中文「必须」也不变形，但英语换的是整个词。', tip: 'must 的过去是 had to', en: 'I had to wait for an hour.', zh: '我不得不等了一个小时。' },
      { t: 'password 是 pass + word', kid: 'pass（通过）+ word（词）——能让你通过的词，就是密码。英语的复合词常这样直白：passport 是过关的证、password 是过关的词。懂了词根，词就有了逻辑。', tip: 'password 通过的话', en: 'I know the password.', zh: '我知道密码。' },
      { t: 'wait for 接等的对象', kid: 'wait for the bus（等公交）——wait 要等什么，得加 for：wait for me。只有 wait a minute（等一会儿）这种时间说法不加 for。中文「等」直接接，英语要垫词。', tip: 'wait for 接对象', en: 'We wait for the bus here.', zh: '我们在这里等公交。' },
      { t: 'open 状态动作都行', kid: 'The door is open.（门开着）Open the door.（把门打开）——同一个词，一个说状态，一个说动作。中文「开」也这样用，英语不用变形，靠句子结构分辨。', tip: 'open 状态动作都行', en: 'The door is open.', zh: '门开着。' },
      { t: 'line 是线，也是队', kid: 'a line 是一条线，stand in line 是站成一队——因为排队就是站成一条线。中文「线」和「队」也有关联（队伍排成线），英语干脆用一个词说两件事。', tip: 'line 线也队', en: 'Please stand in line.', zh: '请排好队。' },
      { t: 'smoke 是烟，也是抽烟', kid: 'smoke 是「烟」，当动词就是「抽烟」：No smoking（禁止吸烟）。英语常把「产生这个东西」直接说成这个东西当动词。同类：rain（下雨）、snow（下雪）。', tip: 'smoke 烟也抽烟', en: 'You must not smoke here.', zh: '你不能在这里抽烟。' },
    ],
    u2: [
      { t: 'next to 才是挨着', kid: 'next to the bank（紧挨着银行）——next 自己只是「下一个」，加了 to 才是「挨着」。中文「旁边」两种情况都能用，英语少一个 to，意思就飘了。', tip: 'next to 才是挨着', en: 'The shop is next to the bank.', zh: '商店紧挨着银行。' },
      { t: 'behind 有遮挡感', kid: 'behind the door（在门后）——behind 说的是「被挡在后面」，有遮挡的意思。中文「后面」范围更宽，英语的 behind 非要在背后不可。只说位置可用 at the back of。', tip: 'behind 有遮挡感', en: 'The cat is behind the door.', zh: '猫在门后。' },
      { t: 'across from 隔一条线', kid: 'across from the school（在学校对面）——across 是「横过去」，from 是「从…起算」，合起来是「隔着一条横线的那一边」。中文「对面」一个词，英语画了一条横线。', tip: 'across from 隔一条线', en: 'The hospital is across from the school.', zh: '医院在学校对面。' },
      { t: 're- = 再来一次', kid: 're- 这个前缀表示「再一次」：recycle（再循环）、reuse（再使用）、reread（再读一遍）。看到 re- 开头，先想「又来一遍」。中文「再」也是这个意思，只是位置不同。', tip: 're- = 再来一次', en: 'We recycle paper and bottles.', zh: '我们回收纸和瓶子。' },
      { t: 'litter 是散落的垃圾', kid: 'litter 指随手丢在地上的垃圾，也能当动词「乱扔」：Do not litter.（别乱扔）它说的是「散落一地」，和 rubbish（垃圾总称）不同。词选对了，画面才对。', tip: 'litter 是散的', en: 'Do not litter in the street.', zh: '不要在街上乱扔垃圾。' },
      { t: 'lost 是状态', kid: 'I am lost.（我迷路了）——lost 是 lose 的过去分词，当形容词用，表示「已经丢了、已经迷了」。中文「迷路」是动词，英语用「已经丢了」这个状态来说。', tip: 'lost 是状态', en: 'I am lost. Can you help me?', zh: '我迷路了。你能帮我吗？' },
    ],
    u3: [
      { t: 'turkey 火鸡，Turkey 土耳其', kid: 'turkey（火鸡）和 Turkey（土耳其）拼写一样，大写才是国家。火鸡原产美洲，据说因为商人绕道土耳其运来，才叫了这个名字。小写是鸟，大写是国家。', tip: '小写火鸡，大写国家', en: 'We eat turkey at Christmas.', zh: '圣诞节我们吃火鸡。' },
      { t: 'country 是国家，也是乡下', kid: 'country 既能说「国家」，也能说「乡下」：in the country 是「在乡下」。因为乡下就是「国家里没有城市的那些地方」。中文「乡下」「国家」是两个词，英语一个 country。', tip: 'country 国家也乡下', en: 'We live in the country.', zh: '我们住在乡下。' },
      { t: 'holiday 假日，vacation 假期', kid: 'holiday 在英国常指「放假的那几天」，vacation 在美国更常用，指一整段假期。中文「假期」一个词，英语两个词各有地盘。去度假是 on holiday / on vacation。', tip: 'holiday 假日，vacation 假期', en: 'We have a holiday in October.', zh: '十月我们有一个假期。' },
      { t: 'celebrate 后面要带事由', kid: 'celebrate 后面接「庆祝什么」：celebrate the New Year、celebrate a birthday。中文「庆祝」也带宾语，但常省略；英语的 celebrate 后面不能空着。', tip: 'celebrate 要带事由', en: 'We celebrate the Spring Festival.', zh: '我们庆祝春节。' },
      { t: 'catch = 及时抓住', kid: 'catch the ball（接住球）catch the bus（赶上公交）——catch 的核心是「及时抓住」。球要抓住，车也要「抓住」才上得去。一个动作，两种场景。', tip: 'catch 及时抓住', en: 'I catch the bus at seven.', zh: '我七点赶公交。' },
      { t: '方位词前面加 the', kid: 'in the west（在西边）——方位词前面加 the：in the west、to the north。中文「在西边」也是这个结构。注意 west 小写是方位，West 大写就是「西方国家」。', tip: '方位词前面加 the', en: 'The sun goes down in the west.', zh: '太阳从西边落下。' },
    ],
    u4: [
      { t: 'wish 幻想，hope 有把握', kid: 'wish 多半是「还没实现、可能难实现」的愿望；hope 是「觉得有希望成真」。I wish I could fly.（但愿我能飞）I hope you come.（希望你来）一个偏幻想，一个偏现实。', tip: 'wish 幻想，hope 有把握', en: 'I wish I could fly.', zh: '但愿我能飞。' },
      { t: 'desert 沙漠，dessert 甜点', kid: 'desert（沙漠）一个 s，dessert（甜点）两个 s，重音也不同：沙漠重音在前，甜点重音在后。这是英语最著名的「一字母之差」，先数 s 的个数，再听重音。', tip: 'desert 沙漠，dessert 甜点', en: 'The camel lives in the desert.', zh: '骆驼生活在沙漠里。' },
      { t: 'special 是与众不同', kid: 'special 是「和别的不同、值得单说」：a special day（特别的一天）。中文「特别」既能说「很」，也能说「与众不同」，英语的 special 只管后者。要说「特别大」，用 very big。', tip: 'special 与众不同', en: 'Today is a special day.', zh: '今天是特别的一天。' },
      { t: 'wild 是自己长的', kid: 'wild animals（野生动物）——wild 说的是「没人养、自己长」。所以野花是 wild flowers，wild 也能说「撒野」：The kids are wild. 从「野生」到「不受管」，是同一条线。', tip: 'wild 自己长的', en: 'We should protect wild animals.', zh: '我们应该保护野生动物。' },
      { t: 'ride 跨在上面走', kid: 'ride a bike、ride a horse、ride a camel——ride 的核心是「跨坐在上面让它带着走」。中文「骑」也是这个意思。注意 ride 的过去式是 rode，不是加 ed。', tip: 'ride 跨在上面走', en: 'I can ride a camel.', zh: '我会骑骆驼。' },
      { t: 'feel like 像，也可「想」', kid: 'It feels like home.（感觉像家一样）——feel like 后面接「像什么」。但 feel like doing 又是「想做某事」：I feel like sleeping.（我想睡）同一个短语，两种用法，看后面接什么。', tip: 'feel like 像，也可「想」', en: 'It feels like home.', zh: '感觉像家一样。' },
    ],
    u5: [
      { t: 'on foot，不用 by', kid: '走路去是 on foot，不能说 by foot。因为 foot 是身体的一部分，不是交通工具。by 后面跟车，on 后面跟「脚、马、自行车」这类「骑在上面」的。', tip: 'on foot，不用 by', en: 'I go to school on foot.', zh: '我走路去上学。' },
      { t: 'tip 是小费，也是提示', kid: 'tip 既能说「小费」（给服务员），也能说「提示、诀窍」（travel tips 旅行小贴士）。中文是两个词，英语一个。看它在什么场景出现，就知道是哪个意思。', tip: 'tip 小费也提示', en: 'Here are some travel tips.', zh: '这里有一些旅行小提示。' },
      { t: 'the environment', kid: 'the environment（环境）——世上只有一个环境，独一无二，所以配 the。同类还有 the sun、the sky。中文「环境」不带「那个」，英语的 the 少不了。', tip: 'the environment', en: 'We should protect the environment.', zh: '我们应该保护环境。' },
      { t: 'health 名词，healthy 形容词', kid: 'health（健康，名词）、healthy（健康的，形容词）。说「对身体好」是 good for your health，不能换成 healthy。中文「健康」一个词两种词性，英语靠词尾分。', tip: 'health 名词，healthy 形容词', en: 'Walking is good for your health.', zh: '走路对健康有好处。' },
      { t: 'carry 只管带着走', kid: 'carry 是「拿着、搬着走」：carry a bag。它和 bring、take 不同——carry 只说「手里拿着」，不管方向。中文「拿」「带」「搬」有点混，英语的 carry 专管「带着走」。', tip: 'carry 只管带着走', en: 'Can you carry this bag?', zh: '你能拿这个包吗？' },
      { t: 'ship 大船，boat 小船', kid: 'ship 是大轮船，boat 是小船——中文「船」一个词，英语按大小分两个。类似的分法还有 house（房子）/ home（家）。词分得细，画面就清楚。', tip: 'ship 大船，boat 小船', en: 'We go there by ship.', zh: '我们坐大船去那里。' },
    ],
    u6: [
      { t: 'maybe 一个词，may be 两个', kid: 'Maybe I will go.（也许我会去）——maybe 通常站句首，说「可能」。它和 may be 不一样：maybe 是一个词（也许），may be 是两个词（可能是）。少一个空格，结构就变了。', tip: 'maybe 一个词', en: 'Maybe we will go by train.', zh: '也许我们坐火车去。' },
      { t: 'join 人，join in 活动', kid: 'join us（加入我们）——join 后面直接接人或者组织：join the club。要说「参加某项活动」才用 join in。中文「加入」直接接，英语分得细。', tip: 'join 人，join in 活动', en: 'Come and join us!', zh: '来加入我们吧！' },
      { t: 'local 属于这个地方', kid: 'local food（当地食物）、a local person（本地人）——local 说的是「属于这个地方的」。中文「当地」也是这个意思。它常和 the 一起：the local people。', tip: 'local 属于这个地方', en: 'We want to try local food.', zh: '我们想尝尝当地食物。' },
      { t: 'explore 带探险味', kid: 'explore 不是普通的「看」，是「走进未知的地方去看个明白」：explore the old town。旅游用 explore，比 visit 更有探险的味道。中文「探索」也是这个劲。', tip: 'explore 带探险味', en: 'We will explore the old town.', zh: '我们要去探索老城。' },
      { t: 'tour = 绕一圈', kid: 'a tour（一次游览）、tour the city（游遍这座城）——tour 的核心是「绕一圈看」。所以旅行团叫 tour group，导游叫 tour guide。中文「旅游」也是这个意思。', tip: 'tour = 绕一圈', en: 'We will tour the city by bus.', zh: '我们要坐车游览这座城市。' },
      { t: 'blog 是 web + log', kid: 'web（网）+ log（日志）——网络上的日志，就是博客。log 本来是「航海日志」，一天一天记下来。英语的新词常是两个老词一拼，懂了老词就懂新词。', tip: 'blog = web + log', en: 'I read a travel blog.', zh: '我看一个旅行博客。' },
    ],
  },

  /* ============================================================
     六年级上册
     ============================================================ */
  pep6a: {
    u1: [
      { t: 'climb 的 b 不发音', kid: 'climb 读 /klaɪm/，b 是不出声的。同类：lamb、comb、thumb 的 b 也是哑的。英语拼写里留着这些字母，是因为几百年前它们还发音，后来音丢了，字母留下了。', tip: 'climb 的 b 不发音', en: 'I climb the hill.', zh: '我爬那座小山。' },
      { t: 'kilo 是「千」', kid: 'kilo（千）+ metre（米）——一千米。英语的单位常带前缀：kilo（千）、centi（百分之一）、milli（千分之一）。记住一个前缀，一串单位都通了。', tip: 'kilo 是「千」', en: 'It is five kilometres away.', zh: '它在五公里外。' },
      { t: 'take 还能说「花时间」', kid: 'It takes an hour.（要花一个小时）——take 除了「拿走」，还能说「需要（时间）」。中文「花时间」用「花」，英语用「拿走」：时间被这件事拿走了。', tip: 'take 拿走时间', en: 'It takes two hours by train.', zh: '坐火车要两个小时。' },
      { t: 'take 变 took', kid: 'take → took，take pictures（拍照）→ took pictures。同类还有 give → gave、make → made。它们各有各的样子，得按「一家子」记：都是「一次完成的动作」。', tip: 'take 变 took', en: 'We took many pictures.', zh: '我们拍了很多照片。' },
      { t: 'send 变 sent', kid: 'send → sent，只换了中间的元音。同类：spend → spent、lend → lent、build → built。这几个词的过去式都短一截，读起来干脆，说的都是「一次做完的事」。', tip: 'send 变 sent', en: 'I sent a card to my friend.', zh: '我给朋友寄了一张卡片。' },
      { t: 'bamboo 数不清', kid: 'bamboo（竹子）数不清，不能说 a bamboo、two bamboos。要说「一根竹子」得借量词：a piece of bamboo。中文「竹子」也不数根，说「一根」同样得加量词。', tip: 'bamboo 不加 s', en: 'Pandas eat bamboo.', zh: '熊猫吃竹子。' },
    ],
    u2: [
      { t: 'as 把两件事绑在一段里', kid: 'She sang as she walked.（她一边走一边唱）——as 把两件事绑在同一段时间里。中文「一边…一边…」要两个词，英语一个 as 就够。同类还有 while（在某段时间里）。', tip: 'as 绑两件事', en: 'He sang as he walked.', zh: '他一边走一边唱。' },
      { t: 'wake 变 woke', kid: 'wake → woke，wake up（醒来）→ woke up。同类还有 break → broke、speak → spoke。这一组都是把 o 换进去，读起来像「咦，变了」，正好提醒你时间变了。', tip: 'wake 变 woke', en: 'I woke up at seven.', zh: '我七点醒来。' },
      { t: 'count down 是倒着数', kid: 'count（数）+ down（往下）——从大数往小数数，就是倒计时。英语用 down 表示「递减」：count down 倒数、slow down 慢下来、turn down 调小。', tip: 'count down 倒着数', en: 'We count down together.', zh: '我们一起倒计时。' },
      { t: 'ever 问「曾经」', kid: 'Have you ever been there?（你去过那儿吗）——ever 说的是「到现在为止，曾经有过吗」。中文「曾经」也是这个时间感。它常站在疑问句和否定句里。', tip: 'ever 问曾经', en: 'Have you ever seen a gala?', zh: '你看过联欢会吗？' },
      { t: 'notice 是察觉，不是盯着看', kid: 'notice 不是「看」，是「无意中看到、察觉到」：I noticed a new student. 重点是「察觉」，不是「盯着看」。中文「注意到」正好对上这个意思。', tip: 'notice 是察觉', en: 'I noticed a new student in class.', zh: '我注意到班里来了个新同学。' },
      { t: 'race 专指比速度', kid: 'a race（一场比赛）、run a race（跑一场比赛）——race 说的是「比谁快」，所以赛车、赛跑都叫 race。中文「比赛」范围广，英语的 race 特指比速度。', tip: 'race 比速度', en: 'He won the race.', zh: '他赢了这场比赛。' },
    ],
    u3: [
      { t: 'ill 表语，sick 定语', kid: 'be ill、be sick 都能说「病了」。但放在名词前面说「病人」几乎只用 sick person。中文「病」一个词，英语两个词分工：表语都能用，定语挑 sick。', tip: 'ill 表语，sick 定语', en: 'He is ill today.', zh: '他今天病了。' },
      { t: 'headache 是 head + ache', kid: 'head（头）+ ache（疼）——头疼。ache 是「持续的隐痛」，所以 toothache 牙疼、stomachache 肚子疼都用它。中文「疼」一个词，英语用 ache 拼出一串。', tip: 'ache = 持续的疼', en: 'I have a headache.', zh: '我头疼。' },
      { t: 'runny nose 鼻子在流', kid: 'runny 是 run（流）加 ny，鼻子在「流」，就是流鼻涕。英语不说「鼻涕流」，说「鼻子是流着的」。中英在这里画面一样，只是主语换了。', tip: 'runny nose', en: 'I have a runny nose.', zh: '我流鼻涕。' },
      { t: 'soon 不久，right away 立刻', kid: 'soon 是「不久之后」，比 right now 松一些。I will be back soon.（我很快回来）中文「马上」有时是「立刻」，那种要用 right away。一个松，一个紧。', tip: 'soon 松，right away 紧', en: 'You will get better soon.', zh: '你很快就会好起来。' },
      { t: 'call 打电话也唤人', kid: 'call me（给我打电话 / 叫我）——call 的核心是「喊一声、唤一声」，所以打电话是它，叫人也是它。「叫某人做某事」是 call sb. to do。一个词，两种唤法。', tip: 'call 打电话也唤人', en: 'Please call me tomorrow.', zh: '请明天给我打电话。' },
      { t: 'unhappy 是 un + happy', kid: 'un-（不）+ happy（高兴）——不高兴就是 unhappy。un- 是最常用的否定前缀：unhappy、unfair、unlucky。中文「不」放前面，英语的 un- 也放前面。', tip: 'un- 表示「不」', en: 'She is unhappy today.', zh: '她今天不高兴。' },
    ],
    u4: [
      { t: 'microscope 是 micro + scope', kid: 'micro（微小）+ scope（看）= 显微镜。它和 telescope（看远）正好一对：一个看极小，一个看极远。记住 scope 是「看」，一串仪器名都通了。', tip: 'micro 小，tele 远', en: 'We look at the cells with a microscope.', zh: '我们用显微镜看细胞。' },
      { t: 'sell 动词，sale 名词', kid: 'sell 是动词「卖」，sale 是名词「销售、促销」：on sale（在打折）。一个说动作，一个说事情。中文「卖」和「打折」是两个词，英语靠词尾分。', tip: 'sell 动词，sale 名词', en: 'The toys are on sale.', zh: '这些玩具在打折。' },
      { t: 'manage 是驾驭', kid: 'manage 本义是「用手驾驭」，所以「管钱」是 manage money，「设法做到」是 manage to do。中文「管」和「设法」分开说，英语一个词包了「驾驭」这条线。', tip: 'manage 是驾驭', en: 'I can manage my money.', zh: '我能管好我的钱。' },
      { t: 'goods 永远复数', kid: 'goods（商品）——它天生复数，没有表示「商品」的单数 good（good 是「好的」）。所以商品要用 goods，配 are。中文「商品」不分单复，英语当成一堆货。', tip: 'goods 永远复数', en: 'The goods are in the shop.', zh: '商品在店里。' },
      { t: 'service 来自 serve', kid: 'service 是「被人提供的帮助」，来自 serve（服务）。中文「服务」也是这个意思。要说「一次服务」才加 a：a good service。数不清时它指「服务」这件事。', tip: 'service 来自 serve', en: 'The service is good here.', zh: '这里的服务很好。' },
      { t: 'haircut 是 hair + cut', kid: 'hair（头发）+ cut（剪）——剪头发就是 haircut。英语把「对象 + 动作」一拼就是一件事的名字：haircut、sunrise、rainfall。', tip: 'haircut 剪头发', en: 'I need a haircut.', zh: '我该剪头发了。' },
    ],
    u5: [
      { t: 'planet 是会走的星', kid: 'planet（行星）来自希腊语「游走者」——古人看它在星空里走来走去，和其他不动的星星不同。知道这个词根，planet 和 star（恒星）就分清了：一个走，一个不动。', tip: 'planet 会走的星', en: 'Mars is a planet.', zh: '火星是一颗行星。' },
      { t: '月亮太阳地球配 the', kid: 'the moon、the sun、the earth——这些天体都是独一份，所以配 the。但 Mars、Venus 这样的行星名不加 the，因为它们本来就是名字，不是「那一类中的一个」。', tip: '独一份的天体配 the', en: 'The moon goes around the earth.', zh: '月亮绕着地球转。' },
      { t: 'satellite 是随从', kid: 'satellite 来自拉丁语「随从」——绕着行星转的东西，不管是天然的月亮还是人造卫星，都叫 satellite。一个词，天然和人造都装得下。', tip: 'satellite 是随从', en: 'The satellite goes around the earth.', zh: '卫星绕着地球转。' },
      { t: 'tele- 表示远', kid: 'tele-（远）+ scope（看）= telescope（望远镜）。tele- 这个前缀表示「远」：telephone（远处的声音）、television（远处的画面）。记住 tele，一串词都通了。', tip: 'tele- 表示远', en: 'We look at Mars through a telescope.', zh: '我们用望远镜看火星。' },
      { t: 'rise 升，set 落', kid: 'sunrise（日出）、sunset（日落）——rise 是「升」，set 是「落」。set 本来是「放置」，太阳「把自己放下去」就是落山。英语用两个动作词，把一天的开始和结束画出来。', tip: 'rise 升，set 落', en: 'We watch the sunrise.', zh: '我们看日出。' },
      { t: '太空的 space 不加冠词', kid: 'in space（在太空）、in outer space（在外太空）——space 数不清，不加 a，也不加 the。要说「一个空间」才是 a space。同一个词，一个说宇宙，一个说地方。', tip: '太空的 space 不加冠词', en: 'There is no air in space.', zh: '太空中没有空气。' },
    ],
    u6: [
      { t: 'electricity 不可数', kid: 'electricity（电）数不清，不加 s，也不加 a。要说「用电」是 use electricity，「省电」是 save electricity。中文「电」也不数，这一点中英一样。', tip: 'electricity 不可数', en: 'We use electricity every day.', zh: '我们每天用电。' },
      { t: 'solar = 太阳的', kid: 'solar 来自拉丁语 sol（太阳）。所以 solar energy 是太阳能、solar panel 是太阳能板。英语里这类来自拉丁语的形容词不少：lunar（月亮的）、marine（海的）。', tip: 'solar = 太阳的', en: 'Solar energy is clean.', zh: '太阳能是清洁的。' },
      { t: 'power 是力量也是电力', kid: 'power 既能说「力量」（the power of nature），也能说「电」（power station 发电站）——因为电就是现代的力量。中文「力量」「电力」分两个词，英语一个 power。', tip: 'power 力量也电力', en: 'We need power for the lights.', zh: '灯需要电。' },
      { t: 'reduce 是一点点降', kid: 'reduce 是「把数量降下来」，比 make less 更正式：reduce waste（减少浪费）。它比 cut 温和，是「一点点降」，不是「一刀砍掉」。', tip: 'reduce 一点点降', en: 'We should reduce waste.', zh: '我们应该减少浪费。' },
      { t: 'make a difference 起作用', kid: 'different（不同的，形容词）→ difference（差别，名词）。make a difference 是「起作用、带来改变」：You can make a difference. 一个词，从「不同」走到「有用」。', tip: 'make a difference', en: 'Small things can make a difference.', zh: '小事也能带来改变。' },
      { t: '-ful 有，-less 没有', kid: 'use + ful（装满）= useful（装满用处的）。英语靠一对尾巴造反义词：useful / useless、careful / careless、helpful / helpless。一对尾巴，正好相反。', tip: '-ful 有，-less 没有', en: 'This bottle is useful.', zh: '这个瓶子很有用。' },
    ],
  },

  /* ============================================================
     六年级下册
     ============================================================ */
  pep6b: {
    u1: [
      { t: 'dinosaur 是「可怕的蜥蜴」', kid: 'dinosaur 来自希腊语 deinos（可怕的）+ sauros（蜥蜴）——可怕的蜥蜴。英语的科学词常这样拼，拆开就懂了：dinosaur、telescope、microscope。', tip: 'dinosaur 可怕的蜥蜴', en: 'The dinosaur is very tall.', zh: '这只恐龙很高。' },
      { t: 'countryside 是 country + side', kid: 'country（乡下）+ side（一边）——乡下的那一边，就是农村。英语的地名常用 side：countryside、seaside（海边）、riverside（河边）。', tip: '-side 是「那一边」', en: 'We live in the countryside.', zh: '我们住在乡下。' },
      { t: 'become 是「变成」', kid: 'become 后面接形容词或名词，说「变成了什么」：He became a teacher.（他成了老师）It is becoming cold.（天变冷了）中文「变成」也是这个结构。', tip: 'become 后面接结果', en: 'He wants to become a doctor.', zh: '他想成为一名医生。' },
      { t: '影子会跟着太阳变长变短', kid: 'shadow 是「影子」——太阳低的时候影子长，太阳高的时候影子短。课文用它讲比较级（My shadow is longer）。英语爱用具体的东西讲抽象的比较，画面一想就懂。', tip: '影子会变长变短', en: 'My shadow is longer in the evening.', zh: '傍晚我的影子更长。' },
      { t: '两个 both，三个 all', kid: 'both of them（他们两个都）——both 说的是「两个都」，三个以上要用 all。中文「都」不分几个，英语分得清：两个用 both，三个以上用 all。', tip: '两个 both，三个 all', en: 'Both of them are tall.', zh: '他们两个都很高。' },
      { t: '数字后面单位不加 s', kid: 'metre（米）、kilogram（千克）——英语的度量单位写在数字后面时常不加复数 s：two metre tall、three kilogram。中文「两米」「三公斤」也是这个写法。', tip: '数字后单位不加 s', en: 'He is one metre tall.', zh: '他一米高。' },
    ],
    u2: [
      { t: 'ed 有两种读法', kid: 'washed 读「哇什特」、watched 读「哇奇特」——ed 在清辅音后面读 /t/；在浊辅音和元音后面读 /d/：cleaned、stayed。拼写一样，读音有两种，这是最容易被忽略的一处。', tip: 'ed 有两种读法', en: 'I cleaned my room.', zh: '我打扫了房间。' },
      { t: 'have 变 had', kid: 'have → had、has → had。所以「我感冒了」是 I had a cold，不是 I haved。最常用的词，过去式往往最不守规矩，得单独记。', tip: 'have 变 had', en: 'I had a cold last week.', zh: '我上周感冒了。' },
      { t: 'sleep 变 slept', kid: 'sleep → slept，中间两个 e 变成一个 e。同类：keep → kept、feel → felt。它们都是「短一截」的过去式，读起来干脆，说的都是一次完成的事。', tip: 'sleep 变 slept', en: 'I slept for nine hours.', zh: '我睡了九个小时。' },
      { t: 'broken 是坏了的', kid: 'break（弄坏）→ broke → broken。broken 当形容词用，说「坏了的」：a broken lamp。中文「坏了」是动词加结果，英语一个词就说清了状态。', tip: 'broken 是坏了的', en: 'The lamp is broken.', zh: '灯坏了。' },
      { t: 'fix 固定住就是修好', kid: 'fix 本义是「固定」，把坏的东西固定回去就是「修」。所以 fix the lamp 是修灯，fix a problem 是解决问题。中文「修」和「解决」是两个词，英语一个词全包。', tip: 'fix 固定住就是修', en: 'My dad fixed the lamp.', zh: '我爸爸修好了灯。' },
      { t: '杂志原本是仓库', kid: 'magazine 现在指杂志，但它原本是「仓库」——因为杂志像仓库一样把各种文章收在一起。英语很多词的今义，都藏着一个旧画面。', tip: '杂志原本是仓库', en: 'I read a magazine.', zh: '我看了一本杂志。' },
    ],
    u3: [
      { t: 'go 变 went', kid: 'go → went，完全换了一个词。同类：eat → ate、buy → bought、ride → rode。这些最常用的动词，过去式往往最不守规矩，因为它们老得连「加 ed」都来不及。', tip: 'go 变 went', en: 'I went to Turpan last year.', zh: '我去年去了吐鲁番。' },
      { t: 'take pictures 是拍照', kid: 'take pictures（拍照）→ took pictures。take 是「拿」，拍照是「把画面拿下来」。中文「拍」一个动词，英语用「拿」。看懂了画面，这个搭配就记住了。', tip: 'take pictures 拍照', en: 'We took pictures on the beach.', zh: '我们在海滩上拍了照。' },
      { t: 'buy 变 bought', kid: 'buy → bought，读「波特」，gh 不发音。同类：bring → brought、think → thought。这一组都是 -ought / -aught 结尾，长得像，可以一起记。', tip: 'buy 变 bought', en: 'I bought a gift for my mum.', zh: '我给妈妈买了一件礼物。' },
      { t: 'part 是部分，也是角色', kid: 'a part of（一部分）、play a part（演一个角色）——part 既能说「一块」，也能说「戏里的角色」。因为它们都是「整体里的一份」。', tip: 'part 部分也角色', en: 'This is a part of the story.', zh: '这是故事的一部分。' },
      { t: 'ate 是 eat 的过去', kid: 'eat → ate，整个音换掉。同类：give → gave、take → took。吃、给、拿这三个最常用的动作，过去式全是换音，不靠加 ed。', tip: 'eat 变 ate', en: 'We ate lunch at noon.', zh: '我们中午吃了午饭。' },
      { t: '规则词老实加 ed', kid: 'licked、laughed——这两个是规则动词，直接加 ed。虽然句子说的是过去，但动词老实加 ed 就行。英语里「规则」和「不规则」并存，得看具体是哪个词。', tip: '规则词老实加 ed', en: 'The dog licked my hand.', zh: '狗舔了我的手。' },
    ],
    u4: [
      { t: 'grass 不加 s', kid: 'grass（草）数不清，不加 s，也不加 a。要说「一片草地」用 the grass 或 a piece of grass。中文「草」也不数根，这一点中英一样。', tip: 'grass 不加 s', en: 'The children play on the grass.', zh: '孩子们在草地上玩。' },
      { t: 'look up 抬头也查', kid: 'look up（抬头看）look it up（查一下）——查字典为什么叫 look up？因为以前字在书页上方，查的时候要往上看。一个动作，两个意思，中间连着同一个画面。', tip: 'look up 抬头也查', en: 'You can look it up on the Internet.', zh: '你可以在网上查一下。' },
      { t: 'active 是爱动的', kid: 'act（行动）+ ive（有…性质的）= active（爱动的、活跃的）。中文「活跃」正好对上。反义词是 quiet 或 lazy。它说的是「愿意动」，不是「动得快」。', tip: 'active 爱动的', en: 'I am active in class.', zh: '我在课堂上很活跃。' },
      { t: 'the Internet', kid: 'the Internet（互联网）——世上只有一个网，所以配 the，而且大写 I，因为它本来是专有名词。中文「上网」不带冠词，英语 on the Internet 的 the 少不了。', tip: 'the Internet', en: 'I look up words on the Internet.', zh: '我在网上查单词。' },
      { t: 'dream 梦也梦想', kid: 'I had a dream.（我做了一个梦）My dream is to fly.（我的梦想是飞）——同一个词，睡着时是梦，醒着时是梦想。中文也这么用，英语一样不分。', tip: 'dream 梦也梦想', en: 'I had a dream last night.', zh: '我昨晚做了一个梦。' },
      { t: 'cheetah 有斑点的那只', kid: 'cheetah（猎豹）读「奇塔」，ch 在这里读 /tʃ/。它是陆地上跑得最快的动物。英语里动物的名字常带着画面：cheetah 来自印地语「有斑点的」。', tip: 'cheetah 有斑点的那只', en: 'A cheetah can run fast.', zh: '猎豹跑得很快。' },
    ],
  },

};
