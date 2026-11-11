/* ============================================================
   小鸟英语乐园 · 小学 999 词库
   覆盖 1-6 年级义务教育英语课程标准必背词汇
   按年级 → 主题分类，共 61 个主题、999 词，全局无重复
   W(单词, 中文, 图解emoji, 记忆法)
   pos: 主题默认词性（个别词在 data.js 里覆盖）
   ============================================================ */
'use strict';
const W = (w, zh, e, dec, pos) => {
  /* ★ 2026-11-08：主题只能给一个默认词性，但同一主题里词性并不统一
     （课堂用语里 word/sentence 是名词，learnteach 是动词）。
     第 5 个参数 pos 用来逐词纠正，不写就沿用主题默认。 */
  const o = dec ? { w, zh, e, dec } : (e ? { w, zh, e } : { w, zh });
  if (pos) o.pos = pos;
  return o;
};

const GRADES = [
{ id: 'g1', name: '一年级', emoji: '🌱', themes: [
  { id: 'greet', name: '打招呼', emoji: '👋', color: '#FF6B6B', pos: 'interj', words: [
    W('hello','你好','👋','hello 原是喊人的『喂喽！』，和 hi 一样都是招呼声'), W('hi','嗨','🙋','hi 是短促一声『嗨！』——招呼就喊它'), W('goodbye','再见','🤚','goodbye 原是 God be with ye（愿上帝与你同行）缩成的'),
    W('bye','拜拜','🖐️','bye 是 goodbye 的尾巴，再见的简称'), W('good','好的','👍','good 和 well 是亲兄弟（元音降级 o↔e）：好 / 很好','adj'), W('good morning','早上好','🌅','morning 的 morn 就是『早晨』，morrow（明日）同根'),
    W('good afternoon','下午好','','noon 原指中午的祷告时刻；after noon = 午后'), W('good night','晚安','','night 一家：knight 骑士同根——古时骑士是夜里守卫的人'),
    W('thank','感谢','🙏','thank 来自 think（th↔k 音变）：心里想着你的好，才开口道谢','v'), W('thanks','谢谢','🙇','thanks = thank + s：谢意一串串'), W('please','请','🤲','please 来自拉丁『取悦』：说 please 是想让你高兴；pleasant（愉快的）同根','adv'),
    W('sorry','对不起','😞','sorry 和 sore（疼）同根：弄疼了别人，才说对不起'), W('welcome','欢迎','🎊','welcome = well(好) + come(来)：好，来吧'), W('yes','是的','✅','yes 是——点头说「yes！」'),
    W('no','不','❌','no 不——用力摇头'), W('OK','好的','👌','OK 原是 1839 年美国人把 all correct 玩笑写成 oll korrect，缩成 OK') ]},
  { id: 'self', name: '我和你', emoji: '🧒', color: '#4EC5F1', pos: 'pron', words: [
    W('I','我','','I 像个站立的小人（一竖是身子，上下两横是手脚）：站着指自己'), W('you','你','','you 你 → your 你的 → yours 你的（东西），一家三口'), W('he','他','','he 他 → him 他（宾格）→ his 他的，一家三口'), W('she','她','','she 里的 he 就是『他』，前面加 s 变成『她』'),
    W('it','它','','i 小点 + t 小尾巴：指着小猫小狗的小尾巴'), W('we','我们','','we 我们 → us 我们（宾格）→ our 我们的'), W('they','他们','','they 他们 → them 他们（宾格）→ their 他们的'),
    W('my','我的','','my = I 的所有格；mine（我的东西）同一家'), W('your','你的','','your = you 的所有格：你们的'), W('his','他的','','his 就是 he 的所有格：他的'), W('her','她的','','her 既是『她』也是『她的』，看后面跟什么'),
    W('our','我们的','','our 是 we 变来的所有格：我们的'), W('their','他们的','','their 是 they 的所有格：他们的'), W('me','我(宾格)','','me 是 I 的宾格：把球传给『我』就用 me'),
    W('him','他(宾格)','','him 是 he 的宾格：把书递给『他』就用 him'), W('them','他们(宾格)','','them 是 they 的宾格：分给他们用 them'),
    W('am','是(我)','','am/is/are/was/were/be 是一家——英语里『是』有七副面孔','be'), W('is','是(他她它)','','am/is/are/was/were/be 是一家——英语里『是』有七副面孔','be'), W('are','是(你/我们)','','am/is/are/was/were/be 是一家——英语里『是』有七副面孔','be'),
    W('this','这','','this 这 / that 那，一对反义；变复数 these / those'), W('that','那','','this 这 / that 那，一对反义；变复数 these / those') ]},
  { id: 'people', name: '人物', emoji: '👥', color: '#FF9F45', pos: 'n', words: [
    W('man','男人','🧍‍♂️','man 原意就是「人」——woman 是 wif（古语：女人）+ man 拼成'), W('woman','女人','🧍‍♀️','woman = wif(古语：女人) + man(人)：女人也是人'), W('boy','男孩','👦','boy 像蹦跳的小男孩：boy 一喊就跑'), W('girl','女孩','👧','girl 原本指『小孩』不分男女，后来才专指女孩'),
    W('child','孩子','🧒','child 孩子 → children 孩子们（-ren 是古复数尾巴）'), W('children','孩子们','🧒','children 的 -ren 是古时候的复数尾巴，就像 ox→oxen'), W('kid','小孩','','kid 原本是『小山羊』，后来才指小孩'),
    W('adult','大人','🧑','adult 来自拉丁语『长大』；adolescent（青少年）同根'), W('lady','女士','','lady 原义是『揉面包的人』——一家之主'), W('sir','先生','','sir 来自 sire（大人/父亲），对长辈的尊称'),
    W('Mr','先生','','Mr = Mister 的缩写：对男士的称呼'), W('Miss','小姐(未婚)','','Miss 指未婚女士，Mrs 才是已婚'), W('twin','双胞胎','','tw- 是『二』：two、twice、twelve、between、twin 双胞胎'), W('gentleman','绅士','','gentle(温柔/出身好) + man：gentleman 温柔有礼的男人') ]},
  { id: 'num1', name: '数字 1-10', emoji: '🔢', color: '#9B72FF', pos: 'num', words: [
    W('zero','零','0️⃣','zero 来自阿拉伯语『空』；cipher（密码）同根'), W('one','一','1️⃣','one 的亲戚：once 一次、alone 独自、only 唯一、none 没有一个'), W('two','二','2️⃣','tw- 是『二』：twice 两次、twelve 十二、twenty 二十、twin 双胞胎'),
    W('three','三','3️⃣','three 三 → third 第三 → thirteen 十三 → thirty 三十'), W('four','四','4️⃣','four 四 → fourth 第四 → fourteen 十四 → forty 四十'), W('five','五','5️⃣','five 五 → fifth 第五 → fifteen 十五 → fifty 五十'),
    W('six','六','6️⃣','six 六 → sixth 第六 → sixteen 十六 → sixty 六十'), W('seven','七','7️⃣','seven 七 → seventh 第七 → seventeen 十七 → seventy 七十'), W('eight','八','8️⃣','eight 和拉丁 oct- 是亲戚（音变）：octopus 八爪鱼、October 原是八月'),
    W('nine','九','9️⃣','nine 和拉丁 nov- 同源：November 原本是九月'), W('ten','十','🔟','ten 和拉丁 dec- 同源：decade 十年、December 原是十月'), W('count','数数','🧮','count 和 computer 同根（拉丁『算』）：都是算数','v'), W('number','数字','🔢','number 的 numer- 就是『数』：numerous（众多的）同根','n') ]},
  { id: 'color', name: '颜色', emoji: '🎨', color: '#FFD93D', pos: 'adj', words: [
    W('red','红色','','red 和 rust（铁锈）同根：铁锈就是红的','n'), W('yellow','黄色','','yellow 和 gold 同根：金子是黄的','n'),
    W('blue','蓝色','','blue 蓝天 blue sky；blew（吹过）和它同音不同义','n'), W('green','绿色','','grow（生长）元音降级成 green：草木一生长就是绿的；grass 草同根','n'),
    W('white','白色','','white 和 wheat（小麦白面）同根；w 开头常与水有关（wave/wash），水花是白的','n'), W('black','黑色','','bl- 词族带『暗/空』：blind 瞎、blank 空白、bleak 阴沉、blot 污点','n'),
    W('orange','橙色','','orange 橙子——先有橙子这个水果，才有橙色','n'), W('pink','粉色','','pink 原本是一种小花（石竹）的名字，后来成了粉色','n'),
    W('purple','紫色','','紫色染料古代取自海螺，极珍贵，只有帝王穿得起——帝王紫','n'), W('brown','棕色','','brown 和 bruise（瘀青）同根：瘀青是棕黑色的','n'), W('grey','灰色','','grey 是黑白之间；grizzle（灰白头发）同根','n'),
    /* ★ 2026-11-09.15：colour / color 原来是两条独立词条（释义「颜色(英式)」「颜色(美式)」、
       同一张 🌈），同一个意思占两个词位，看图题里也难分。家长拍板合并成一条：
       只留 colour，记忆法里说明美式写作 color。词库 1000 → 999 词。 */
    W('colour','颜色','🌈','colour（英式拼写）＝ 美式 color；colourful 多彩的，两种写法读音相同','n') ]},
  { id: 'school', name: '学校文具', emoji: '🏫', color: '#4EC5F1', pos: 'n', words: [
    W('school','学校','🏫','school 学校——来自希腊语「闲暇」：古人只有闲下来才读书'), W('book','书','📖','book 书——原来是「山毛榉树皮」，古人把字写在树皮上'), W('pen','钢笔','🖊️','pen 钢笔——原来是「羽毛」，古人用羽毛蘸墨写字'),
    W('pencil','铅笔','✏️','pencil 铅笔——来自拉丁「小毛笔」，和 pen 一家'), W('ruler','尺子','📏','ruler 尺子——rule 规则 + -er：画直线的东西'), W('bag','包','🎒','bag 包——鼓鼓的包'),
    W('eraser','橡皮','','eraser 橡皮——erase 擦掉 + -r'), W('desk','课桌','','desk 书桌——和 disc/dish 同根：都来自「圆盘」'), W('chair','椅子','💺','chair 椅子——来自拉丁「座」'), W('blackboard','黑板','','black 黑 + board 板：黑色的板 = 黑板'),
    W('crayon','蜡笔','🖍️','crayon 蜡笔——来自法语「粉笔」（craie），蜡笔就是彩色的粉笔'), W('pencil-box','铅笔盒','📦','pencil 铅笔 + box 盒：装铅笔的盒子'), W('card','卡片','🃏','card / chart / cartoon 一家：都来自『纸』'), W('picture','图片','🖼️','picture 和 paint 同根（拉丁『画』）：都是画'),
    W('teacher','老师','👩‍🏫','teacher 老师——teach 教 + -er 人'), W('student','学生','🎓','student 学生——来自拉丁「努力的人」'), W('class','班级','','class 和 classic 同根：class 是班级，classic 是经典'),
    W('classroom','教室','','class 班级 + room 房间：班级的房间 = 教室'), W('name','名字','','name 和 nominate（提名）同根（音变 n↔nom）'), W('sticker','贴纸','','stick 粘 + er：粘上去的东西 = 贴纸'),
    W('scissors','剪刀','✂️','sc- 常与『切/剪』有关：scissors 剪刀、scrape 刮、scratch 抓'), W('glue','胶水','🧴','gl- 带『黏滑』：glue 胶水、glide 滑行、gluey 黏糊糊的'), W('bell','铃铛','🔔','bell 是拟声词：铃声『叮铃 bell』'), W('schoolbag','书包','🎒','school 学校 + bag 包：上学背的书包'), W('paper','纸','📄','paper 纸——来自 papyrus（纸莎草）：古埃及人用它当纸') ]},
  { id: 'animal1', name: '动物', emoji: '🐾', color: '#FF6B6B', pos: 'n', words: [
    W('cat','小猫','🐱','c 像蜷缩的小猫 + at 在：蜷在角落的猫'), W('dog','小狗','🐶','dog 拟声『汪』：dog 一叫就汪汪'),
    W('bird','小鸟','🐦','bird 像展翅的小鸟：b 是身，ird 是飞'), W('fish','鱼','🐟','fish 像鱼划水『嘘——』；fisher 渔夫一家'),
    W('duck','鸭子','🦆','duck 原义是『潜水的鸟』——鸭子爱扎猛子'), W('pig','小猪','🐷','p 像猪鼻子 + ig 像『哼』：猪鼻哼哼'),
    W('bear','熊','🐻','bear 有两个意思：熊 / 承受；生孩子也叫 bear（承受生命）'), W('monkey','猴子','🐵','monkey 可能来自 monk（僧人）——中世纪人觉得猴子像穿袍的僧人'),
    W('panda','熊猫','🐼','panda 谐音『胖达』：圆滚滚的胖达'), W('tiger','老虎','🐯','tiger 来自希腊语『箭』——老虎扑得像箭一样快'), W('lion','狮子','🦁','lion 狮；lioness 母狮（-ess 表女性）'),
    W('elephant','大象','🐘','elephant 来自希腊语『象牙』——大象最出名的就是象牙'), W('rabbit','兔子','🐰','rabbit 像长耳爱蹦的小兔：r 是长耳朵'), W('mouse','老鼠','🐭','mouse 老鼠；复数 mice；mouse 也是『鼠标』'), W('hen','母鸡','🐔','hen 母鸡；cock 公鸡；chick 小鸡——鸡的一家'),
    W('chick','小鸡','🐤','chick 小鸡，拟声『啾啾』；chicken 是鸡（也指鸡肉）'), W('cow','奶牛','🐮','cow 奶牛，拟声『哞 moo』；ox 公牛'), W('sheep','绵羊','🐑','sheep 绵羊，拟声『咩』；复数还是 sheep（不加 s）'),
    W('giraffe','长颈鹿','🦒','giraffe 来自阿拉伯语；长颈鹿 giraffe 脖子最长'), W('goose','大鹅','🦢','goose 鹅；复数 geese（oo→ee）；swan 天鹅'),
    W('owl','猫头鹰','🦉','owl 猫头鹰，拟声『呜呜』；owl 的 o 像圆眼睛'), W('eagle','老鹰','🦅','eagle 老鹰；eaglet 小鹰（-et 表小）'), W('koala','考拉','🐨','koala 来自澳洲土著语『不喝水』——考拉从桉树叶取水'), W('zebra','斑马','🦓','zebra 斑马，z 像黑白相间的条纹') ]},
  { id: 'family', name: '家庭', emoji: '👨‍👩‍👧', color: '#FF9F45', pos: 'n', words: [
    W('dad','爸爸','👨‍👦','dad 是最简单的叫法：d 张嘴喊『大！』'), W('mom','妈妈','👩‍👦','mom 是最简单的叫法：m 闭嘴哼『妈——』'),
    W('father','父亲','👨','father 和拉丁 pater 是亲戚（f↔p 音变）：papa、paternal 同根'), W('mother','母亲','👩','mother 和拉丁 mater 是亲戚：mama、maternal 同根'), W('brother','兄弟','','brother 和拉丁 frater 是亲戚：fraternity（兄弟会）同根'), W('sister','姐妹','','sister 和拉丁 soror 是亲戚：sorority（姐妹会）同根'),
    W('grandpa','爷爷','👴','grand 大 + pa 爸：大爸爸 = 爷爷/外公'), W('grandma','奶奶','👵','grand 大 + ma 妈：大妈妈 = 奶奶/外婆'), W('family','家','👨‍👩‍👧‍👦','family 家庭——来自拉丁「仆人/家眷」，后来指一家人'),
    W('baby','宝宝','👶','baby 像『哇哇』哭的宝宝：b 像襁褓'), W('uncle','叔叔','🧔','uncle 叔叔/舅舅；aunt 阿姨——一对'), W('aunt','阿姨','👩‍🦰','aunt 阿姨；uncle 叔叔——一对'), W('friend','朋友','🤝','friend 和 free 同根：自由人才能做朋友') ]},
  { id: 'body', name: '身体', emoji: '🧍', color: '#6BCB77', pos: 'n', words: [
    W('eye','眼睛','👁️','eye 眼睛——两只 e 是眼睛，y 是鼻梁'), W('ear','耳朵','👂','ear 耳朵——和 hear 同根（用耳朵听）'), W('nose','鼻子','👃','nose 鼻子——鼻子尖尖'),
    W('mouth','嘴巴','👄','mouth 嘴——嘴巴'), W('hand','手','✋','hand 手——伸出手'),
    W('head','头','','head 头——脑袋'), W('hair','头发','','hair 头发——丝丝头发'), W('face','脸','😊','face 脸——脸面'),
    W('arm','手臂','','arm 手臂——手臂（也有「武装」的意思）'), W('leg','腿','🦵','leg 腿——桌椅的腿也叫 leg'), W('foot','脚','🦶','foot 脚——脚（复数 feet）'),
    W('tooth','牙齿','🦷','tooth 牙——牙（复数 teeth）'), W('finger','手指','👆','finger 手指；从 thumb 大拇指到 little finger 小指'), W('neck','脖子','','neck 脖子；necklace 项链（lace 带子）'),
    W('knee','膝盖','','knee 膝盖；k 不发音，读 /niː/；kneel 跪下'), W('shoulder','肩膀','','shoulder 肩膀；should（应该）长得像但不同源') ]},
  { id: 'toy', name: '玩具', emoji: '🧸', color: '#FF8FAB', pos: 'n', words: [
    W('ball','球','','ball 球家族：basketball、football、volleyball'), W('kite','风筝','🪁','kite 风筝；kite 也是『鸢』（一种鹰）'),
    W('doll','娃娃','','doll 娃娃；doll 原指玩偶'), W('toy','玩具','','toy 玩具；像个小玩意儿'), W('teddy bear','泰迪熊','🧸','teddy 来自美国总统罗斯福（Teddy）的昵称 + bear 熊'), W('yo-yo','悠悠球','🪀','yo-yo 是拟声：悠悠球甩上甩下『yo——yo』'),
    W('bike','自行车','🚲','bike 自行车——bicycle 的缩写：bi（二）+ cycle（轮）'), W('robot','机器人','🤖','robot 机器人——来自捷克语「苦工」，1920 年一出话剧造的词'), W('puzzle','拼图','🧩','puzzle 拼图/谜；puzzling 令人费解的'), W('plane','飞机','✈️','plane 飞机——来自拉丁「平的」：平平的翅膀'),
    W('boat','小船','⛵','boat 小船；boat 和 ship 一对：小船 / 大船'), W('car','小汽车','🚗','car 车——来自拉丁 carrus（马车）'), W('balloon','气球','🎈','ball 球 + -oon 表『大』：balloon 大球 = 气球'),
    W('game','游戏','🎮','game 游戏；game 也是『比赛』（ball game 球赛）'), W('swing','秋千','','swing 秋千/摇摆；swim 游泳（sw- 常与『动』有关）'), W('slide','滑梯','🛝','slide 滑梯/滑；sl- 常与『滑』有关：slip 滑倒、slippery 滑的'), W('scooter','踏板车','🛴','scooter 来自 scoot（飞奔）：踏板车飞奔') ]},
]},

{ id: 'g2', name: '二年级', emoji: '🌿', themes: [
  { id: 'num2', name: '数字 11-20', emoji: '🔟', color: '#9B72FF', pos: 'num', tip: '💡 规律：13-19 都加 teen，20 用 ty！', words: [
    W('eleven','十一','1️⃣1️⃣','eleven 十一；eleven 和 leave（离开）不同源'), W('twelve','十二','1️⃣2️⃣','twelve = tw-(二) + elf(余)：二加十 = 十二'), W('thirteen','十三','1️⃣3️⃣','three 三 + teen 十：三加十 = 十三'),
    W('fourteen','十四','1️⃣4️⃣','four 四 + teen 十：四加十 = 十四'), W('fifteen','十五','1️⃣5️⃣','fif- 是 five 的变音 + teen 十：五加十 = 十五'), W('sixteen','十六','1️⃣6️⃣','six 六 + teen 十：六加十 = 十六'),
    W('seventeen','十七','1️⃣7️⃣','seven 七 + teen 十：七加十 = 十七'), W('eighteen','十八','1️⃣8️⃣','eight 八 + teen 十（只留一个 t）：八加十 = 十八'), W('nineteen','十九','1️⃣9️⃣','nine 九 + teen 十：九加十 = 十九'),
    W('twenty','二十','2️⃣0️⃣','tw- 二 + -enty 表十：二乘十 = 二十'), W('hundred','百','💯','hundred 百；century 世纪（一百年）同根（h↔c 音变）'), W('thousand','千','','thousand 千——hundred 百、thousand 千、million 百万，一级一级往上翻') ]},
  { id: 'fruit', name: '水果', emoji: '🍎', color: '#6BCB77', pos: 'n', words: [
    W('apple','苹果','🍎','apple 苹果——苹果公司的名字就是它'), W('banana','香蕉','🍌','banana 香蕉——弯弯像月牙'),
    W('pear','梨','🍐','pear 梨——和 pair（一对）同音不同义'), W('peach','桃子','🍑','peach 桃——来自波斯语（Persia）'), W('grape','葡萄','🍇','grape 葡萄——和 grab 同源：一串串「抓」着长'),
    W('watermelon','西瓜','🍉','water 水 + melon 瓜：水汪汪的瓜 = 西瓜'), W('strawberry','草莓','🍓','straw 稻草 + berry 莓：垫着稻草长的莓 = 草莓'),
    W('pineapple','菠萝','🍍','pine 松树 + apple 果：外形像松果 + 苹果'), W('lemon','柠檬','🍋','lemon 柠檬——酸酸的'), W('mango','芒果','🥭','mango 芒果——来自印度语，弯弯的'),
    W('cherry','樱桃','🍒','cherry 樱桃；cherries 常成对长（-y→-ies）'), W('kiwi','猕猴桃','🥝','kiwi 猕猴桃，原指新西兰的几维鸟（像毛茸茸的蛋）'), W('coconut','椰子','🥥','coco 椰 + nut 坚果：椰子是坚果'),
    W('melon','甜瓜','🍈','melon 瓜；watermelon 西瓜、muskmelon 甜瓜'), W('blueberry','蓝莓','🫐','blue 蓝 + berry 莓：蓝莓'), W('fruit','水果','🍏','fruit 水果——来自拉丁 frui（享受）') ]},
  { id: 'food', name: '食物', emoji: '🍽️', color: '#FF9F45', pos: 'n', words: [
    W('egg','鸡蛋','🥚','egg 鸡蛋——圆圆的蛋'), W('rice', '米饭', '🍚', 'rice 米饭——来自拉丁 oryza（稻米）：跟着稻米传到欧洲'), W('noodle', '面条', '🍜', 'noodle 来自德语 Nudel——一团面搓成的细长条'),
    W('bread', '面包', '🍞', 'bread 面包——和 brew 同源：谷物发酵做面包/啤酒'), W('cake', '蛋糕', '🍰', 'cake 来自古北欧语 kaka——烤出来的扁扁甜饼'), W('milk', '牛奶', '🥛', 'milk 牛奶——和拉丁「挤」同源：挤出来的奶'),
    W('water', '水', '💧', 'water 水——w- 水（wave/wash/wet）'), W('juice', '果汁', '🧃', 'juice 果汁——来自拉丁「汁液」：挤出来的东西'),
    W('tea', '茶', '🍵', 'tea 茶——读音来自中国闽南语「茶」'), W('hamburger', '汉堡包', '🍔', 'hamburger = Hamburg（德国汉堡城）+ -er：汉堡城传出来的肉饼（跟火腿 ham 无关）'), W('hot dog', '热狗', '🌭', 'hot dog 的来历：面包夹香肠像一只腊肠狗（dachshund），美国人给它起外号叫 hot dog'),
    W('French fries', '薯条', '🍟', 'French 法式的 + fries 炸的东西（fry 炸的复数）：法式炸薯条'), W('breakfast', '早餐', '', 'break 打破 + fast 禁食：打破一夜禁食'), W('lunch', '午餐', '', 'lunch 原来是 lump（一大块）：午饭就是「一大块」吃下去'),
    W('dinner', '晚餐', '', 'dinner 来自拉丁「打破禁食」——和 breakfast 是同一个意思，古人一天的主餐'), W('food', '食物', '🍱', 'food 食物——和 feed 是亲兄弟（oo→ee）'), W('chicken', '鸡肉', '🍗', 'chick 小鸡 + -en 表小：chicken 原指小鸡，后来鸡肉也叫 chicken'),
    W('beef', '牛肉', '🥩', 'beef 来自拉丁 bōs（牛），和 bull（公牛）是亲戚。贵族吃肉说法语，农民养牛说英语——所以「牛」和「牛肉」长得不像'), W('pork', '猪肉', '🥓', 'pork 来自法语 porc（猪）——同样，贵族吃肉说法语（pork），农民养猪说英语（pig）'), W('soup', '汤', '', 'soup 来自「吸/啜」的声音：sup（啜）、sorb（吸）、soup（汤）同一族'),
    W('dumpling', '饺子', '🥟', 'dumpling = dumpl（面团）+ -ling（小东西）：一小团面'), W('mooncake', '月饼', '🥮', 'moon 月亮 + cake 饼：中秋圆月的饼'), W('candy', '糖果', '🍬', 'candy 来自阿拉伯语 qand（糖块），和 cane（甘蔗）同根——糖是从甘蔗里熬出来的'), W('sweet', '甜的', '🍯', 'sweet 甜——和 sweat（汗）只差一个字母，别拼错','adj'),
    W('chocolate', '巧克力', '🍫', 'chocolate 来自墨西哥阿兹特克语 xocolātl（苦的水）——可可豆本来是苦的，加了糖才变甜'), W('biscuit', '饼干', '🍪', 'biscuit = bis（两次）+ cook（烤）：烤两次的饼干，古代保存食物的方法'), W('porridge', '粥', '🍲', 'porridge 和 pot（锅）有关：锅里煮出来的稠粥') ]},
  { id: 'clothes', name: '衣服', emoji: '👕', color: '#FF8FAB', pos: 'n', words: [
    W('shirt', '衬衫', '👔', 'shirt 和 skirt 是亲兄弟（sh↔sk 音变）：shirt 衬衫穿上面，skirt 短裙穿下面'), W('T-shirt', 'T恤', '👕', 'T 字形的 T 恤，像字母 T 一样展开两只袖子'), W('dress', '连衣裙', '👗', 'dress 原意是「整理、穿戴」——dress up 就是打扮'), W('skirt', '短裙', '👚', 'skirt 和 shirt 是亲兄弟（sk↔sh 音变）：shirt 上衣、skirt 下裙'),
    W('pants', '裤子', '👖', 'pants 来自意大利喜剧角色 Pantalone（穿长裤的老头）——从戏服变成裤子的名字'), W('shorts', '短裤', '🩳', 'short 短 + s 复数：短裤'), W('coat', '大衣', '🧥', 'coat 和 cot（小屋）同源：都是「外面包一层」——大衣是身体的小屋'), W('sweater', '毛衣', '🧶', 'sweat 汗 + -er：sweater 原指「让人出汗的厚衣服」，后来指毛衣'),
    W('jacket', '夹克', '🥼', 'jacket 来自 Jack（人名）的昵称——本来是「Jack 穿的小外套」'), W('hat', '帽子', '🎩', 'hat 和 hut（小屋）同源：都是「顶上盖一层」——帽子是脑袋的小屋'), W('cap', '鸭舌帽', '🧢', 'cap 来自拉丁 cappa（头巾），和 cape（披肩）同源——都是「盖在头上/肩上」'),
    W('shoe', '鞋', '👟', 'shoe 的 sh- 像鞋帮的弧线（象形），sh- 词族常与「覆盖」有关'), W('sock', '袜子', '🧦', 'sock 来自拉丁 soccus（古罗马的轻便鞋）'), W('clothes', '衣服', '🧺', 'cloth 布 + -es 复数：布做成的衣服。cloth 和 clothe（穿衣）同源'),
    W('scarf', '围巾', '🧣', 'scarf 来自法语 escharpe（肩带）——绕在肩上的东西'), W('glove', '手套', '🧤', 'glove 手套——戴上它才好「握住」东西'), W('belt', '皮带', '', 'belt 来自拉丁 balteus（剑带/腰带）'), W('button', '纽扣', '', 'button 和 bud（花蕾）同源：纽扣像一个小花蕾突出来') ]},
  { id: 'home', name: '我的家', emoji: '🏠', color: '#4EC5F1', pos: 'n', words: [
    W('home', '家', '🏠', 'home 家——和 hamlet 同源：小小的家的聚落'), W('house', '房子', '🏡', 'house 房子——和 hide 同源：让人藏身的地方'), W('door', '门', '🚪', 'door 门——推开门'), W('window', '窗户', '🪟', 'window 窗户——wind 风 + eye 眼：风的眼睛'),
    W('bed', '床', '🛏️', 'bed 床——b 像床头、d 像床尾'), W('table', '桌子', '', 'table 桌子——来自拉丁「木板」：桌子就是一块板'),
    W('sofa', '沙发', '🛋️', 'sofa 来自阿拉伯语 soffah（铺垫的长凳）——坐上去软软的'), W('lamp', '台灯', '💡', 'lamp 来自希腊语「发光」——lamp 灯、lantern 灯笼同根'), W('kitchen', '厨房', '🍳', 'kitchen 和 cook 同根（拉丁 coquere 烹调）：做饭的地方'), W('bedroom', '卧室', '🛌', 'bed 床 + room 房：放床的房间'),
    W('bathroom', '浴室', '🛁', 'bath 洗澡 + room 房：洗澡的房间'), W('living room', '客厅', '', 'living 起居 + room 房：起居的房间'), W('garden', '花园', '🌷', 'garden 和 yard 是亲兄弟（g↔y 音变）：garden 花园、yard 院子'), W('garage', '车库', '', 'garage 来自法语 garer（停放、遮蔽）——停车的地方'),
    W('floor', '地板', '', 'floor 地板——fl- 常与「平铺」有关'), W('wall', '墙', '🧱', 'wall 墙——来自拉丁「栅栏」：interval 就是「两墙之间」') ]},
  { id: 'nature1', name: '大自然', emoji: '🌳', color: '#6BCB77', pos: 'n', words: [
    W('sun', '太阳', '☀️', 'sun 太阳——和拉丁 sōl 同源：solar 太阳的'), W('moon', '月亮', '🌙', 'moon 月亮——和 month 同源：月亮圆缺一次 = 一个月'),
    W('star', '星星', '⭐', 'star 星星——和拉丁 stella 同源：stellar 星球的'), W('sky', '天空', '', 'sky 天空——来自古北欧语「云」'), W('cloud', '云', '☁️', 'cloud 云——和 clot 同源：天上的一团'), W('rain', '雨', '🌧️', 'rain 雨——和拉丁「灌溉」同源：irrigate 引来雨水'),
    W('snow', '雪', '❄️', 'snow 雪——雪花飘飘'), W('wind', '风', '🌬️', 'wind 风——和 vent 同源：ventilate 通风'), W('tree', '树', '🌳', 'tree 树——和 true 同源：树木坚实可靠'), W('flower', '花', '🌸', 'flower 花——和 flour 亲兄弟：面粉是「花朵的精华」'),
    W('grass', '草', '🌱', 'grass 草——和 grow 同源：草是长出来的'), W('river', '河', '🏞️', 'river 河——来自拉丁「河岸」：河岸在哪河就在哪'), W('mountain', '大山', '⛰️', 'mountain 大山——和 mount 同根：mount 登山'),
    W('sea', '大海', '🌊', 'sea 大海——和 see（看见）同音不同义：大海一眼望不到边'), W('fire', '火', '🔥', 'fire 火——和希腊 pyr 同源：pyro- 火的'), W('leaf', '树叶', '🍃', 'leaf 叶——复数 leaves（f 变 v）：一片片薄薄的叶子'),
    W('stone', '石头', '🪨', 'stone 石头——和 stand 同源：石头站那不动') ]},
  { id: 'action1', name: '动作', emoji: '🤸', color: '#FFD93D', pos: 'v', words: [
    W('eat', '吃', '🍽️', 'eat 和拉丁 ed-（吃）是亲戚：edible（可吃的）就来自 ed-'), W('drink', '喝', '🥤', 'drink 喝——dr- 开头，drip（滴）、drain（排水）也都是「水往下」'), W('sing', '唱歌', '🎤', 'sing 唱歌——歌声唱唱'), W('dance', '跳舞', '💃', 'dance 跳舞——舞转圈'),
    W('read', '读书', '📚', 'read 读——眼睛扫过字'), W('write', '写', '✍️', 'write 写——笔写写'), W('draw', '画画', '🎨', 'draw 画画——握笔拉出线条'), W('fly', '飞', '🕊️', 'fly 飞——翅膀飞'),
    W('walk', '走路', '🚶', 'walk 走路——腿走走'), W('run', '跑', '🏃', 'run 跑——冲出去'), W('jump', '跳', '🤸', 'jump 跳——蹦蹦跳'),
    W('swim', '游泳', '🏊', 'swim 游泳——划划水'), W('sleep', '睡觉', '😴', 'sleep 睡觉——闭眼'), W('cry', '哭', '😢', 'cry 原意是「喊叫」——不只是哭，高兴了也 cry（cry with joy）'),
    W('laugh', '笑', '😂', 'laugh 是拟声词——「哈-哈」的声音就是 laugh'), W('listen', '听', '🎧', 'listen 听——耳朵听听'), W('look', '看', '👀', 'look 看——眼睛看看'), W('open', '打开', '📂', 'open 打开——和 up 同源：向上掀开'),
    W('close', '关上', '📁', 'close 关上——来自拉丁「关」：把话「封」死'), W('play', '玩', '🎾', 'play 玩——玩乐乐'), W('wash', '洗', '🚿', 'wash 洗——用水洗（w- 水）'), W('talk', '说话', '💬', 'talk 说话——嘴说说') ]},
  { id: 'time1', name: '时间', emoji: '⏰', color: '#9B72FF', pos: 'n', words: [
    W('day', '天', '📅', 'day 天——和拉丁 diēs 同源：diary 日记'), W('week', '星期', '🗓️', 'week 星期——来自「转一圈」：七天转完一周'), W('today', '今天', '', 'today 今天——to + day'), W('tomorrow', '明天', '', 'tomorrow = to + morn（早晨）：到明天早晨。morrow 就是「早晨」'),
    W('yesterday', '昨天', '', 'yester- 是「从前/前一日」的前缀，yesterday = yester + day = 前一天'), W('now', '现在', '', 'now 现在——就是此刻'), W('early', '早', '🌄', 'early 和 ere（在…之前）同源：early 就是「在之前」','adj'), W('late', '晚', '🌜', 'late 和 last 同源——都带「最迟」的意思','adj'),
    W("o'clock","点钟","🕐","of the clock 缩成 o'clock：几点钟"), W('hour', '小时', '⏰', 'hour 小时——来自希腊语「时辰」'), W('minute', '分钟', '⏲️', 'minute 分钟——来自拉丁「小的」：小小的时刻'), W('tonight', '今晚', '', 'to 到 + night 夜：到今夜') ]},
  { id: 'weather1', name: '天气', emoji: '🌤️', color: '#4EC5F1', pos: 'adj', words: [
    W('hot', '热', '🥵', 'hot 热——「h-ot」像火辣辣的'), W('cold', '冷', '🥶', 'cold 和拉丁 gel-（冷）是亲戚：gel（果冻）、congeal（凝固）都来自「冷」'), W('warm', '温暖', '', 'warm 温暖——晒太阳暖洋洋'), W('cool', '凉爽', '', 'cool 凉爽——秋风凉丝丝'),
    W('sunny', '晴朗的', '🔆', 'sun 太阳 + -y（双写 n）表「有…的」：有太阳的 = 晴朗的','adj'), W('rainy', '下雨的', '', 'rain 雨 + -y 表「有…的」：有雨的 = 下雨的','adj'), W('windy', '刮风的', '💨', 'wind 风 + -y 表「有…的」：有风的 = 刮风的','adj'), W('snowy', '下雪的', '🌨️', 'snow 雪 + -y 表「有…的」：有雪的 = 下雪的','adj'),
    W('cloudy', '多云的', '⛅', 'cloud 云 + -y 表「有…的」：有云的 = 多云的','adj'), W('fine', '晴好', '', 'fine 和 finish 同根（拉丁 finis）：fine 原意是「做到完美」——天气「完美」就是晴好'), W('raincoat', '雨衣', '', 'rain 雨 + coat 衣：下雨穿的雨衣','n'), W('umbrella', '雨伞', '☂️', 'umbrella = umbra（拉丁语「阴影」）+ -ella（小）：小阴影——雨伞就是给你一片小阴影','n') ]},
  { id: 'shape', name: '形状', emoji: '🔷', color: '#FF6B6B', pos: 'n', words: [
    W('circle', '圆形', '⭕', 'circle 的词根 circ- = 圆：circle 圆、circus 马戏场（圆形场地）、circulate 循环'), W('square', '正方形', '🟥', 'square = ex-（完全）+ quadr-（四）：完全四四方方。quadr- = 四：quarter 四分之一'), W('triangle', '三角形', '🔺', 'tri- = 三：triangle 三角、tricycle 三轮车、triple 三倍'),
    W('rectangle', '长方形', '', 'rect- = 直/正：rectangle 长方形（直角）、correct 正确的'), W('heart', '心形', '💖', 'heart 心——和拉丁 cor 同源：core 核心'), W('diamond', '菱形', '', 'diamond 来自希腊语 adamas（不可征服的）——钻石是「不可征服」的最硬的石头'),
    W('oval', '椭圆形', '', 'oval 来自拉丁 ovum（蛋）：椭圆就是「蛋形」'), W('line', '线', '➖', 'line 来自拉丁 līnea（亚麻线）——古人用亚麻线画直线。linen（亚麻布）同根'), W('round', '圆的', '', 'round 和 rotate（旋转）同源：转一圈就是圆的','adj'), W('shape', '形状', '🔷', 'shape 原意是「造出来」——你造出什么形状就是什么形状') ]},
]},

{ id: 'g3', name: '三年级', emoji: '🍀', themes: [
  { id: 'vegetable', name: '蔬菜', emoji: '🥕', color: '#6BCB77', pos: 'n', words: [
    W('potato', '土豆', '🥔', 'potato 来自西班牙语 batata——土豆从南美传到欧洲时名字也跟着来了'), W('tomato', '西红柿', '🍅', 'tomato 来自墨西哥阿兹特克语 tomatl——和土豆一样，从美洲传来的名字'), W('carrot', '胡萝卜', '🥕', 'carrot 来自希腊语「角」——胡萝卜的根尖尖的像角'), W('cabbage', '卷心菜', '🥬', 'cabbage 来自法语 caboche（头）：卷心菜圆圆的像一颗脑袋'),
    W('onion', '洋葱', '🧅', 'onion 和 one 同根（拉丁 unio）：洋葱一层层裹成「一颗」'), W('pepper', '辣椒', '🌶️', 'pepper 来自梵语 pippalī（胡椒粒）——这个词跟着香料走遍了全世界'), W('cucumber', '黄瓜', '🥒', 'cucumber 来自拉丁 cucumis（黄瓜）——这个词本身就是古老的蔬菜名'), W('bean', '豆子', '🫘', 'bean 和拉丁 faba（豆）是亲戚：fava（蚕豆）就来自 faba'),
    W('pea', '豌豆', '🫛', 'pea 是从 pease（豌豆）缩写来的——古人以为 pease 是复数，就造了单数 pea'), W('corn', '玉米', '🌽', 'corn 和拉丁 grānum（谷粒）是亲戚（c↔g 音变）：grain（谷物）就来自 grānum。corn 原指「谷粒」，到了美洲才专指玉米'), W('pumpkin', '南瓜', '🎃', 'pumpkin = pepon（希腊语「大甜瓜」）+ -kin（小）：小大瓜——南瓜圆滚滚的'), W('eggplant', '茄子', '🍆', 'egg 蛋 + plant 植物：形状像蛋的植物'),
    W('mushroom', '蘑菇', '🍄', 'mushroom 来自法语 mousse（苔藓）：蘑菇长在苔藓里'), W('vegetable', '蔬菜', '🥦', 'vegetable 来自拉丁「使有生气」——吃蔬菜让你有活力。vigour（活力）同根') ]},
  { id: 'animal2', name: '更多动物', emoji: '🦊', color: '#FF9F45', pos: 'n', words: [
    W('horse', '马', '🐴', 'horse 和 course（跑道）同源——都来自「跑」这个词根'), W('goat', '山羊', '🐐', 'goat 和拉丁 haedus（小山羊）是亲戚'), W('fox', '狐狸', '🦊', 'fox 和 fug-（逃/溜）同源：狐狸最会溜走'), W('wolf', '狼', '🐺', 'wolf 和拉丁 lupus（狼）是亲戚（w↔l 音变）：lupine（狼的）就来自 lupus'),
    W('deer', '鹿', '🦌', 'deer 原来是「野兽」的统称——后来专指鹿'), W('snake', '蛇', '🐍', 'snake 和 sn- 词族有关：sn- 常与「扭/鼻」有关——蛇是扭着爬的'), W('frog', '青蛙', '🐸', 'frog 是拟声词——模拟青蛙「呱呱」的叫声'),
    W('turtle', '乌龟', '🐢', 'turtle 和 tort-（扭）同源——tortoise（陆龟）来自「扭着走」'), W('butterfly', '蝴蝶', '🦋', 'butterfly = butter（黄油）+ fly（飞）——有人说蝴蝶爱落在黄油上'), W('bee', '蜜蜂', '🐝', 'bee 是拟声词——模拟蜜蜂「嗡嗡」的声音'), W('ant', '蚂蚁', '🐜', 'ant 来自古英语「æmette」（小东西）——蚂蚁就是「小小的东西」'),
    W('spider', '蜘蛛', '🕷️', 'spider 来自「纺纱者」——蜘蛛纺出一张网'), W('bat', '蝙蝠', '🦇', 'bat 作「球棒」来自「击打」（beat 同源）；作「蝙蝠」可能因为翅膀像拍打'), W('parrot', '鹦鹉', '🦜', 'parrot 来自人名 Perrot（Pierre 的昵称）——鹦鹉爱「学人说话」，就用人名来叫它'),
    W('hippo', '河马', '🦛', 'hippo = hippos（希腊语「马」）+ potamos（河）：河里的马 = 河马'), W('camel', '骆驼', '🐫', 'camel 来自阿拉伯语 jamal（骆驼）——这个词跟着沙漠商队走遍了世界'), W('kangaroo', '袋鼠', '🦘', 'kangaroo 来自澳大利亚原住民语 gangurru——原住民给这种「大跳的动物」起的名字'), W('penguin', '企鹅', '🐧', 'penguin 来自威尔士语 pen gwyn（白头）——最早指北极的白头海鸟，后来给了南极的企鹅') ]},
  { id: 'classroom', name: '课堂用语', emoji: '📖', color: '#9B72FF', pos: 'n', words: [
    W('word', '单词', '🔤', 'word 和拉丁 verbum（词）是亲戚：verb（动词）就来自 verbum'), W('sentence', '句子', '📝', 'sentence 和 sense（感觉）同源：句子表达你的「意思」'), W('question', '问题', '❓', 'question 和 quest（探索）同根：问问题就是「寻找答案」'), W('answer', '回答', '', 'answer = and-（对着）+ swear（发誓）：古人回答问题要「对着发誓」说真话'),
    W('learn', '学习', '🧠', 'learn 和 lore（知识）同源：学到的就是 lore','v'), W('teach', '教', '', 'teach 原意是「展示」——teacher 就是「展示给你看的人」','v'), W('say', '说', '', 'say 说——嘴说出话','v'),
    W('speak', '讲话', '🗣️', 'speak 和 speech 是亲兄弟：speak 讲、speech 讲话','v'), W('tell', '告诉', '📢', 'tell 和 talk 同源：tell 告诉、talk 说话','v'), W('ask', '问', '', 'ask 的 a- 像张大的嘴（象形）——问问题要「张嘴」','v'),
    W('understand', '明白', '', 'understand = under + stand（置身其中）——「钻进去」才能理解','v'), W('remember', '记住', '', 'remember = re-（再）+ member（= memor 记忆）：再回到记忆里。memory 同根','v'), W('forget', '忘记', '', 'forget = for-（离开）+ get（得到）：从脑子里「扔掉」了','v'),
    W('know', '知道', '', 'know 知道——点头「嗯，知道了」（k 不发音）','v'), W('spell', '拼写', '', 'spell 原意是「讲故事/咒语」——一个字母一个字母「讲」出来就是拼写','v'),
    W('copy', '抄写', '', 'copy 来自拉丁 copia（丰富/多份）——副本就是「多出来的那一份」','v'), W('mistake', '错误', '', 'mis-（错）+ take（拿）：拿错了犯的错。mis- = 错：misspell 拼错、misunderstand 误解','v'), W('text', '课文', '', 'text 和 texture（纹理）同根（拉丁 texere 编织）：课文是「编」在一起的文字'), W('notebook', '笔记本', '📓', 'note 笔记 + book 本：记笔记的本子'),
    W('dictionary', '词典', '📕', 'dict- = 说（拉丁 dicere）：dictionary 说单词的书、dictation 听写、predict 预言') ]},
  { id: 'sport', name: '运动', emoji: '⚽', color: '#FFD93D', pos: 'n', words: [
    W('football', '足球', '⚽', 'foot 脚 + ball 球：用脚踢的球'), W('basketball', '篮球', '🏀', 'basket 篮 + ball 球：投进篮的球'), W('ping-pong', '乒乓球', '🏓', 'ping-pong 是拟声词——乒乒乓乓就是球来回打的声音'),
    W('baseball', '棒球', '⚾', 'base 垒 + ball 球：棒球打垒'), W('skate', '滑冰', '⛸️', 'skate 来自荷兰语 schaats（冰刀）——荷兰人发明的滑冰工具','v'), W('ski', '滑雪', '🎿', 'ski 来自挪威语「木板」——踩着木板滑下雪坡','v'),
    W('ride', '骑', '🚴', 'ride 和 road 同源：骑马走的就是 road','v'), W('climb', '爬', '🧗', 'climb 和 cl- 词族有关：cl- 常与「抓紧」有关——claw 爪子、cling 紧贴、climb 爬（抓着往上）','v'), W('throw', '扔', '🤾', 'throw 原意是「转动」——扔东西手臂要转一圈甩出去','v'),
    W('catch', '接住', '🥅', 'catch 来自法语「追逐」——先追上才能接住','v'), W('kick', '踢', '', 'kick 是拟声词——「咔」一声踢出去','v'), W('race', '比赛', '🏁', 'race 来自古挪威语 rās（跑）——比赛就是「跑」'),
    W('winner', '获胜者', '🏅', 'win 赢 + -er 表「人」：赢的人'), W('hike', '徒步', '🥾', 'hike 来自方言「使劲走」——徒步就是用力走','v'), W('yoga', '瑜伽', '🧘', 'yoga 来自梵语 yuj（结合）：瑜伽就是让身心「合一」'), W('golf', '高尔夫', '⛳', 'golf 来自荷兰语 kolf（球棒）——这项运动的工具成了它的名字') ]},
  { id: 'transport', name: '交通', emoji: '🚌', color: '#4EC5F1', pos: 'n', words: [
    W('bus', '公交车', '🚌', 'bus 公交车——来自拉丁「给所有人的车」'), W('taxi', '出租车', '🚕', 'taxi 是 taximeter cabriolet 的缩写：taximeter 是「计价器」，按价钱走的车'), W('train', '火车', '🚂', 'train 火车——来自拉丁「拉」：拉着一串车厢'),
    W('subway', '地铁', '🚇', 'sub（下）+ way（路）：地下铁路'), W('helicopter', '直升机', '🚁', 'helico（螺旋）+ pter（翼）：螺旋翼飞机。pter- = 翼：pterodactyl 翼龙'), W('ship', '轮船', '🚢', 'ship 轮船——和 skipper 船长同源'),
    W('jeep', '吉普车', '🚙', 'jeep 来自「GP」（General Purpose 通用）的读音——通用型军车'), W('van', '面包车', '🚐', 'van 是 caravan（大篷车）的缩写'), W('truck', '卡车', '🚚', 'truck 来自希腊语 trochos（轮子）——有轮子的运货车'),
    W('ambulance', '救护车', '🚑', 'ambulance 来自拉丁 ambulare（走动）——「流动的医院」，跟着伤员走'), W('traffic', '交通', '🚥', 'traffic 来自拉丁 transigere（穿过、做完）——车「穿过」街道'), W('road', '马路', '🛣️', 'road 路——和 ride 同源：骑马走的就是 road'),
    W('street', '街道', '', 'street 街——来自拉丁「铺好的路」'), W('bridge', '桥', '🌉', 'bridge 来自古英语 brycg，和 balk（横梁）同源——桥就是一根「横梁」'), W('station', '车站', '🚉', 'station 来自拉丁 stare（站）——stand 同根：车停靠的「站」'), W('airport', '机场', '🛫', 'air 空气 + port 港口：飞机的港口') ]},
  { id: 'position', name: '方位', emoji: '🧭', color: '#FF6B6B', pos: 'prep', words: [
    W('in', '在里面', '', 'in 的 i 像小球、n 像盒子：小球跳进盒子关上门'), W('on', '在上面', '', 'o 圆球 + n 桌面：球稳稳坐在桌面上'), W('under', '在下面', '', 'under 和 undergo（经历）同源——「在下面承受」'), W('behind', '在后面', '', 'be + hind（后面的）：藏在门背后。hind = 后面的'),
    W('beside', '在旁边', '', 'be + side 边：并肩坐在旁边'), W('near', '在附近', '', 'near 和 nigh（近的）同源：near 近、nigh 更古的「近」'), W('over', '在上方', '', 'over 和拉丁 super（在上）同源：over 在上方、super 超级'), W('above', '在上面', '', 'a-（在）+ bove（= up）：挂在上面'),
    W('below', '在下面', '', 'be + low 低：鱼儿游在水面之下'), W('front', '前面', '⏩', 'front 来自拉丁 frons（前额）——脸的最前面'), W('back', '后面', '⏪', 'back 来自古英语 bæc，就是「脊背」——back 原指后背'), W('left', '左边', '⬅️', 'left 原意是「弱的」——左手是「弱手」（大多数人右手有力）'),
    W('right', '右边', '➡️', 'right 原意是「直的/对的」——右手是「正手」，所以 right 也表示「对」'), W('middle', '中间', '🎯', 'middle 和 mid（中间）同源：mid- 表「中」——midnight 午夜、midway 中途'), W('here', '这里', '📍', 'here 这里——就在这里'), W('there', '那里', '📌', 'there 那里——就在那里') ]},
  { id: 'week', name: '星期', emoji: '📅', color: '#FF9F45', pos: 'n', words: [
    W('Monday', '星期一', '1️⃣', 'Monday = Moon 月亮 + day：月亮日（北欧月亮神 Mani）'), W('Tuesday', '星期二', '2️⃣', 'Tuesday = Tyr 战神 + day：战神日（北欧战神提尔）'), W('Wednesday', '星期三', '3️⃣', 'Wednesday = Woden 主神 + day：主神日（w 不发音）'),
    W('Thursday', '星期四', '4️⃣', 'Thursday = Thor 雷神 + day：雷神日（拿锤子的雷神）'), W('Friday', '星期五', '5️⃣', 'Friday = Frigg 爱神 + day：爱神日（周末前最后一天）'), W('Saturday', '星期六', '6️⃣', 'Saturday = Saturn 土星神 + day：土星日'),
    W('Sunday', '星期日', '7️⃣', 'Sunday = Sun 太阳 + day：太阳日'), W('weekend', '周末', '', 'week 周 + end 末：一周的末尾'), W('weekday', '工作日', '💼', 'week 周 + day 日：一周里的工作日'), W('birthday', '生日', '🎂', 'birth 出生 + day 日：出生那天') ]},
  { id: 'adj1', name: '描述一', emoji: '🔍', color: '#9B72FF', pos: 'adj', words: [
    W('big', '大的', '', 'big 大——张开双臂抱个大圈'), W('small', '小的', '', 'small 来自古英语 smæl（细的）——small 原指「细小」'), W('long', '长的', '', 'long 长——和拉丁 longus 同源：longitude 经度'), W('short', '短的/矮的', '', 'short 短——小矮凳 vs 高桌子'),
    W('tall', '高的', '', 'tall 原意是「快的/敏捷的」——后来才指「高」'), W('fast', '快的', '⚡', 'fast 快——嗖一下跑没影（原意「紧的」）'), W('slow', '慢的', '', 'slow 慢——乌龟慢慢爬（和 slack「松」同源）'), W('new', '新的', '🆕', 'new 新——拆开新包装'),
    W('young', '年轻的', '', 'young 和拉丁 juvenis（年轻）同源：juvenile（青少年的）就来自 juvenis'), W('cute', '可爱的', '🥰', 'cute 是 acute（尖锐/聪明）的缩写——cute 原指「机灵」'), W('pretty', '漂亮的', '', 'pretty 原意是「灵巧的/好的」——后来才指漂亮'), W('beautiful', '美丽的', '💐', 'beauty 美 + -ful 满：满是美丽'),
    W('happy', '开心的', '😄', 'happy 开心——咧嘴笑开了花（来自 hap 运气）'), W('sad', '难过的', '😔', 'sad 难过——眼泪啪嗒掉'), W('angry', '生气的', '😠', 'angry 生气——气得头顶冒烟'), W('glad', '高兴的', '', 'glad 高兴——心里乐开了花（gl- 发光）') ]},
]},

{ id: 'g4', name: '四年级', emoji: '🌻', themes: [
  { id: 'job', name: '职业', emoji: '👩‍⚕️', color: '#FF6B6B', pos: 'n', tip: '💡 规律：动词 + er / ist = "…的人"！', words: [
    W('doctor', '医生', '👨‍⚕️', 'doct- = 教（拉丁 docere）：doctor 原是「教书的学者」，后来才专指看病的医生。document 同根'), W('nurse', '护士', '👩‍⚕️', 'nurse 来自拉丁 nutrire（喂养）——nurse 原是「奶妈」'), W('driver', '司机', '', 'drive 开车 + -er 表「人」：开车的人'), W('cook', '厨师', '👩‍🍳', 'cook 来自拉丁 coquere（烹调）——cook 做、kitchen 厨房同根'),
    W('farmer', '农民', '👨‍🌾', 'farm 农场 + -er 表「人」：种地的人'), W('policeman', '警察', '👮', 'police 警察 + man 人'), W('worker', '工人', '👷', 'work 工作 + -er 表「人」'), W('singer', '歌手', '', 'sing 唱 + -er 表「人」：唱歌的人'),
    W('dancer', '舞蹈家', '', 'dance 跳 + -er 表「人」'), W('writer', '作家', '', 'write 写 + -er 表「人」：写作的人'), W('pilot', '飞行员', '👨‍✈️', 'pilot 来自希腊语 pedotes（舵手）——飞行员就是飞机的「舵手」'), W('scientist', '科学家', '🔬', 'science 科学 + -ist 表「人」'),
    W('dentist', '牙医', '', 'dent- = 牙（拉丁 dens）：dentist 牙医、dental 牙科的'), W('waiter', '服务员', '', 'wait 等 + -er 表「人」：端盘子等上菜的人'), W('vet', '兽医', '🐕', 'vet 是 veterinary surgeon（兽医）的缩写'), W('coach', '教练', '🥇', 'coach 来自匈牙利 Kocs 村（造马车的地方）——马车→教练车→教练'),
    W('artist', '画家', '', 'art 艺术 + -ist 表「人」'), W('job', '工作', '', 'job 的原意是「一块/一项工作」——job 就是「一件活儿」') ]},
  { id: 'place', name: '场所', emoji: '🏢', color: '#4EC5F1', pos: 'n', words: [
    W('park', '公园', '', 'park 公园——来自法语「围起来的猎场」'), W('zoo', '动物园', '', 'zoo 动物园——zoological garden 的缩写'), W('shop', '商店', '🏪', 'shop 商店——来自古英语「摊位」'), W('store', '店铺', '🏬', 'store 商店——来自拉丁「存货的地方」'),
    W('supermarket', '超市', '🛒', 'super 超级 + market 市场'), W('hospital', '医院', '🏥', 'hospit- = 客人：hospital 原是「收留客人的地方」。host、hotel 同根'), W('farm', '农场', '🚜', 'farm 来自拉丁 firma（固定付款）——farm 原是「固定的租金」，后来指租的地'), W('library', '图书馆', '', 'libr- = 书（拉丁 liber）：library = 书的屋子。librarian 图书管理员同根'),
    W('cinema', '电影院', '🎦', 'cinema 来自希腊语 kinema（运动）——电影就是「动的画面」。kinetic（运动的）同根'), W('museum', '博物馆', '🏛️', 'museum 来自希腊语 Mouseion（缪斯女神的庙）——艺术女神住的地方'), W('hotel', '旅馆', '🏨', 'hotel 和 host（主人）同根（hospit- 客人）：旅馆是「待客」的地方'), W('restaurant', '餐馆', '', 'restaurant 来自法语 restaurer（恢复）——吃饭「恢复」体力'),
    W('bank', '银行', '🏦', 'bank 来自意大利语 banca（长凳）——钱庄的长凳。bench（长凳）同源'), W('post office', '邮局', '📮', 'post 来自拉丁 ponere（放置）——驿站「放」信的地方'), W('playground', '操场', '', 'play 玩 + ground 场：玩耍的场地'), W('city', '城市', '🏙️', 'city 来自拉丁 civis（公民）——civil（文明的）同根：有公民的地方才叫城市'),
    W('village', '乡村', '', 'village 来自拉丁 villa（农庄）——villa（别墅）同根'), W('town', '城镇', '🏘️', 'town 来自古英语 tūn（围起来的院落）——town 原是「围栏/院子」'), W('country', '国家', '', 'country = contra（对面）+ -ry：「对面的那片地」，和 contrast（对比）同根'), W('world', '世界', '🌍', 'world = wer（人）+ old（时代）：「人的时代」就是世界') ]},
  { id: 'subject', name: '学科', emoji: '📚', color: '#9B72FF', pos: 'n', words: [
    W('Chinese', '语文', '🀄', 'China 中国 + -ese 表「某国的」'), W('English', '英语', '🔠', 'England 英格兰 + -ish 表「某国的」'), W('math', '数学', '➗', 'math 是 mathematics 的缩写，来自希腊语 manthanein（学习）——数学就是「学习」的学问'), W('music', '音乐', '🎵', 'music 来自希腊语 Mousa（缪斯）——和 museum（缪斯的庙）同源！艺术一家'),
    W('art', '美术', '', 'art 来自拉丁 ars（技能）——art 原是「手艺/技能」'), W('PE', '体育', '', 'PE 是 Physical Education（体育教育）的缩写'), W('science', '科学', '', 'science 来自拉丁 scire（知道）——science 就是「知道的东西」。conscious（有意识的）同根'), W('computer', '电脑', '💻', 'computer = compute（计算）+ -er（机器）：计算的机器。compute = com + putare'),
    W('lesson', '课', '', 'lesson 来自拉丁 lectio（读的东西）——lecture（讲座）同根'), W('homework', '作业', '', 'home 家 + work 工作：回家做的作业'), W('subject', '学科', '', 'subject = sub-（下）+ ject（扔）：「扔在下面」让你学的科目'), W('classmate', '同学', '', 'class 班 + mate 伴：同班同伴'),
    W('test', '测验', '', 'test 来自拉丁 testum（陶片）——古人用陶片投票表决'), W('grade', '年级', '🎖️', 'grade 来自拉丁 gradus（步）——gradual（渐进的）同根：一步一步升年级') ]},
  { id: 'month', name: '月份', emoji: '🗓️', color: '#FF9F45', pos: 'n', tip: '💡 规律：九至十二月都以 -ber 结尾！', words: [
    W('January', '一月', '1️⃣', 'January = Janus（双面神，一张脸看过去一张看未来）——一年的开头'), W('February', '二月', '2️⃣', 'February = Februa（古罗马净化节）——净化身心的月份'), W('March', '三月', '3️⃣', 'March = Mars（战神）——古罗马打仗的月份'), W('April', '四月', '4️⃣', 'April = aperire（拉丁「打开」）——花儿「打开」的月份'),
    W('May', '五月', '5️⃣', 'May = Maia（生长女神）——万物生长的月份'), W('June', '六月', '6️⃣', 'June = Juno（天后赫拉）——天后的月份'), W('July', '七月', '7️⃣', 'July = Julius Caesar（凯撒大帝）——以他命名的月份'), W('August', '八月', '8️⃣', 'August = Augustus（奥古斯都皇帝）——以他命名的月份'),
    W('September', '九月', '9️⃣', 'September = septem（拉丁「七」）——古罗马历法里真的是第 7 个月！'), W('October', '十月', '🔟', 'October = octo（拉丁「八」）——古罗马历法里真的是第 8 个月！octopus 八爪鱼同根'), W('November', '十一月', '', 'November = novem（拉丁「九」）——古罗马历法里真的是第 9 个月！'), W('December', '十二月', '', 'December = decem（拉丁「十」）——古罗马历法里真的是第 10 个月！decade 十年同根'),
    W('month', '月份', '📆', 'month 月——和 moon 同源：月亮圆缺一次'), W('year', '年', '', 'year 年——来自「转一圈的时节」') ]},
  { id: 'season', name: '季节', emoji: '🍂', color: '#FFD93D', pos: 'n', words: [
    W('spring', '春天', '🌼', 'spring 原意是「跳/涌出」——草木从土里「跳」出来'), W('summer', '夏天', '🌞', 'summer 夏天——太热了，太阳在头顶猛晒'), W('autumn', '秋天', '🍁', 'autumn 来自拉丁 autumnus（n 不发音）'), W('fall', '秋天(美式)', '🍂', 'fall 是美式说法：树叶「落下」的季节'),
    W('season', '季节', '🔄', 'season 来自拉丁 satio（播种）——season 原是「播种的时节」'), W('weather', '天气', '🌤️', 'weather 和 wind 同族：都是天上的「气」'), W('storm', '暴风雨', '⛈️', 'storm 和 stir（搅动）同源：暴风雨就是「搅得天翻地覆」'), W('fog', '雾', '🌫️', 'fog 的 f 像蒙住眼睛的雾（象形）'),
    W('ice', '冰', '🧊', 'ice 来自古英语 is，和拉丁 glacies（冰）无关'), W('dry', '干的', '🏜️', 'dry 干——晒干的毛巾','adj'), W('wet', '湿的', '💦', 'wet 湿——刚淋过雨湿漉漉','adj'), W('shower', '阵雨', '🌦️', 'shower 来自古英语 scūr（阵雨），和 shoot 同源——「射下来」的雨'),
    W('temperature', '温度', '', 'temperature 来自 temper（调和）——温度是冷热「调和」出来的'), W('degree', '度数', '', 'degree 和 grade 同根（拉丁 gradus 步）——一度就是「一小步」') ]},
  { id: 'household', name: '生活用品', emoji: '🥢', color: '#6BCB77', pos: 'n', words: [
    W('cup', '杯子', '☕', 'cup 来自拉丁 cupa（桶/杯）'), W('plate', '盘子', '', 'plate 来自希腊语 platus（平的）——plate 就是「平的」盘子'), W('bowl', '碗', '🥣', 'bowl 和 ball 同源：碗就是「圆的」东西'), W('chopsticks', '筷子', '🥢', 'chop 砍/剁 + sticks 棍：两根小棍子夹菜'),
    W('spoon', '勺子', '🥄', 'spoon 来自古英语 spōn（木片）——古人用木片当勺'), W('fork', '叉子', '🍴', 'fork 来自拉丁 furca（叉/岔）——fork 也指「岔路」'), W('knife', '刀', '🔪', 'knife 的 k 不发音；knife 来自古英语 cnīf（刀）'),
    W('fridge', '冰箱', '', 'fridge 是 refrigerator 的缩写：re-（再）+ friger（冷）——「再冷下来」的箱子'), W('clock', '钟', '🕰️', 'clock 来自法语 cloche（钟/铃）——clock 和 bell 同源'), W('watch', '手表', '⌚', 'watch 原意是「守望/看」——手表就是「看时间」的东西'), W('mirror', '镜子', '🪞', 'mirror 来自拉丁 mirari（惊奇）——照镜子惊叹自己'),
    W('towel', '毛巾', '', 'towel 来自法语 toaille（布）'), W('toothbrush', '牙刷', '🪥', 'tooth 牙 + brush 刷'), W('soap', '香皂', '🧼', 'soap 来自拉丁 sapo（肥皂）'), W('comb', '梳子', '💇', 'comb 来自古英语 camb（梳子/鸡冠）——梳子和鸡冠是同一个词！'), W('key', '钥匙', '🔑', 'key 来自古英语 cǣg，key 的 k 像钥匙的齿（象形）') ]},
  { id: 'feeling', name: '感觉', emoji: '😊', color: '#FF8FAB', pos: 'adj', words: [
    W('tired', '累的', '😪', 'tired 累——累得瘫在沙发上'), W('thirsty', '渴的', '', 'thirsty 渴——嘴巴干得冒烟'), W('hungry', '饿的', '', 'hungry 饿——肚子咕咕叫（和 hunt 同源）'), W('full', '饱的', '', 'full 和拉丁 plenus（满）同源：plenty（丰富）就来自 plenus'),
    W('afraid', '害怕的', '😨', 'afraid 害怕——心里害怕发抖'), W('worried', '担心的', '😟', 'worry 原意是「勒住/咬住」——担心像被勒住喘不过气'), W('excited', '兴奋的', '🤩', 'excited = ex-（向外）+ cite（叫）：被「叫」得心向外跳'), W('bored', '感到无聊的（人）', '', 'bored 来自 bore（钻孔）——无聊像被「钻孔」一样难熬；-ed 说的是「人」的感受'),
    W('surprised', '惊讶的', '😲', 'surprised = sur-（上面）+ prise（抓）：从上面「抓」你一把 = 吓一跳'), W('proud', '自豪的', '😎', 'proud 来自拉丁 prod-（向前）——骄傲地「向前」挺起胸'), W('shy', '害羞的', '😳', 'shy 害羞——躲在妈妈身后'), W('lonely', '孤单的', '🥺', 'lone（独自）+ -ly'),
    W('feel', '感觉', '🫶', 'feel 来自古英语 fēlan（触摸）——feeling 原是「摸到的」感觉','v'), W('smile', '微笑', '', 'smile 和 smirk（假笑）同源：都是嘴角的「小动作」','v'), W('calm', '平静的', '😌', 'calm 来自希腊语 kauma（炎热的中午）——中午热得万物「静止」下来'), W('tear', '眼泪', '', 'tear 的 t 像眼泪（象形）：一滴落下来','n') ]},
  { id: 'verb2', name: '动词二', emoji: '🤝', color: '#FF6B6B', pos: 'v', tip: '💡 规律：give / take / like / make 里都藏着一对好搭档元音！', words: [
    W('help', '帮助', '🆘', 'help 帮助——伸出手帮一把'), W('give', '给', '', 'give 给——双手递出去'), W('get', '得到', '', 'get 得到——伸手接过来'), W('take', '拿走', '', 'take 拿——伸手拿过来'),
    W('bring', '带来', '', 'bring 带来——伸手递东西给你'), W('put', '放', '', 'put 放——轻轻放下摆好'), W('pick', '捡', '🤏', 'pick 原意是「刺/啄」——pick 就是「戳一下拿起来」'), W('find', '找到', '🔍', 'find 找到——终于找到了'),
    W('lose', '丢失', '😵', 'lose 和 loose（松）同源——「松手」就丢了'), W('win', '赢', '🏆', 'win 来自古英语 winnan（战斗/努力）——win 原意是「努力争来的」'), W('want', '想要', '', 'want 想要——眼睛亮亮地渴望'), W('need', '需要', '❗', 'need 需要——指着说我需要'),
    W('like', '喜欢', '💗', 'like 喜欢——心里很喜欢'), W('love', '爱', '❤️', 'love 爱——比个大大的心'), W('have', '有', '', 'have 有——手里攥着拥有'), W('do', '做', '🛠️', 'do 做——两只手动起来'),
    W('make', '制作', '🔨', 'make 做——动手捏出来'), W('go', '去', '', 'go 去——推开门大步走') ]},
  { id: 'adj2', name: '描述二', emoji: '⚖️', color: '#4EC5F1', pos: 'adj', words: [
    W('clean', '干净的', '', 'clean 干净——擦得干干净净（和 clear 同源）'), W('dirty', '脏的', '', 'dirty 脏——小手沾满泥巴'), W('quiet', '安静的', '🤫', 'quiet 安静——安静得针掉都听得见'), W('loud', '大声的', '🔊', 'loud 大声——大喇叭轰隆隆'),
    W('heavy', '重的', '🏋️', 'heavy 重——搬得满头大汗（和 heave 举起同源）'), W('light', '轻的', '🪶', 'light 轻/光——两个同形词：轻的↔亮的'), W('hard', '难的', '', 'hard 难/硬——石头硬邦邦'), W('easy', '容易的', '', 'easy 容易——小菜一碟（和 ease 舒适同源）'),
    W('strong', '强壮的', '💪', 'strong 强壮——举起大石头'), W('weak', '虚弱的', '', 'weak 虚弱——连瓶盖都拧不开（原意「软的」）'), W('rich', '富有的', '🤑', 'rich 富有——钱袋鼓鼓的（和拉丁 rex 国王同源）'), W('poor', '贫穷的', '🪙', 'poor 贫穷——口袋空空的'),
    W('famous', '著名的', '🌟', 'fame 名声 + -ous。fame 来自拉丁 fama（说出来的）——名声是「说出来的」'), W('delicious', '美味的', '😋', 'delicious 和 lure（诱惑）同源——delicious 就是「诱惑人的好味道」'), W('favourite', '最喜欢的', '', 'favor 偏爱 + -ite：心里排第一的最爱'), W('wonderful', '精彩的', '', 'wonder 惊奇 + -ful 满：满是惊奇'),
    W('busy', '忙的', '', 'busy 忙——忙得团团转'), W('free', '空闲的', '🆓', 'free 空闲/自由——小鸟飞出笼子') ]},
]},

{ id: 'g5', name: '五年级', emoji: '🍁', themes: [
  { id: 'health', name: '健康', emoji: '💊', color: '#6BCB77', pos: 'n', words: [
    W('health', '健康', '💚', 'health 和 heal（治愈）同根：健康就是「被治愈」的状态'), W('healthy', '健康的', '🥗', 'health 健康 + -y','adj'), W('exercise', '锻炼', '', 'exercise = ex-（出）+ arcere（阻止）：「去除惰性」→锻炼'), W('sick', '生病的', '🤒', 'sick 生病——躺在床上量体温','adj'),
    W('ill', '病的', '', 'ill 病——蔫蔫的没精神','adj'), W('fever', '发烧', '🌡️', 'fever 和 ferv-（沸腾）同源：ferment（发酵）就来自「沸腾」'), W('headache', '头疼', '🤕', 'head 头 + ache 痛。ache 来自古英语 æce（痛）'), W('medicine', '药', '💊', 'medic- = 治疗（拉丁 mederi）：medicine 药、medical 医疗的'),
    W('rest', '休息', '', 'rest 来自古英语 ræst（休息/床）'), W('hurt', '受伤', '🩹', 'hurt 来自法语 hurter（碰撞）——hurt 原是「撞疼的」','v'), W('pain', '疼痛', '😖', 'pain 来自拉丁 poena（惩罚）——pain 原意是「惩罚」'), W('sweat', '汗水', '', 'sweat 来自古英语 swǣtan（出汗）'),
    W('yawn', '打哈欠', '🥱', 'yawn 是拟声词——打哈欠「啊——」的声音'), W('vitamin', '维生素', '', 'vitamin = vita（拉丁「生命」）+ amine（胺）：生命胺'), W('body', '身体', '', 'body 身体——整个人的身体'), W('safe', '安全的', '🦺', 'safe 和 save 同源（拉丁 salvus）：safe 安全、save 救','adj') ]},
  { id: 'city2', name: '城市乡村', emoji: '🏙️', color: '#4EC5F1', pos: 'n', words: [
    W('building', '大楼', '🏢', 'build 建 + -ing'), W('tower', '塔', '🗼', 'tower 来自法语 turris（塔）'), W('corner', '角落', '📐', 'corner 来自拉丁 cornu（角）——拐角就是一个「角」'), W('block', '街区', '', 'block 来自古法语 bloc（大木头）——block 原是「一大块木头」'),
    W('map', '地图', '🗺️', 'map 是 mappa（布）的缩写——古人把世界画在布上'), W('east', '东方', '', 'east 的 e- 表「出」——太阳「出来」的方向'), W('west', '西方', '', 'west 就是太阳「落」的方向'), W('north', '北方', '⬆️', 'north 的 n- 表「左」——面向太阳升起时，左边是北'),
    W('south', '南方', '⬇️', 'south 和 sun 同源——南边是太阳多、暖和的方向'), W('direction', '方向', '🧭', 'direction = di-（分开）+ reg（直）+ -ion：「指引着直走」。reg- = 直/王：correct 正确、regal 帝王的'), W('capital', '首都', '', 'cap- = 头：capital 首都（首要之城）、captain 队长'), W('fountain', '广场喷泉', '⛲', 'fountain 来自拉丁 fons（泉）——font（字体/泉）同源'),
    W('hill', '小山', '', 'hill 小山——「h-ill」像矮矮的山包'), W('lake', '湖', '', 'lake 来自拉丁 lacus（湖/盆）'), W('field', '田野', '🌾', 'field 来自古英语 feld（开阔地）'), W('forest', '森林', '🌲', 'forest 来自拉丁 foris（外面的）——forest 原是「外面的野地」') ]},
  { id: 'travel', name: '旅行', emoji: '🧳', color: '#FF9F45', pos: 'n', words: [
    W('travel', '旅行', '', 'travel 来自法语 travail（辛苦的工作）——travel 原意是「辛苦的旅程」！'), W('trip', '旅程', '', 'trip 来自法语 tripper（绊倒/快走）——trip 原是「快步走」'), W('tour', '观光', '', 'tour 来自拉丁 tornare（转一圈）——tour 就是「转一圈」。tournament 锦标赛同根'), W('visit', '参观', '', 'vis- = 看：visit 参观、vision 视觉、television 电视'),
    W('ticket', '票', '🎫', 'ticket 来自法语 estiquet（贴上的纸条）'), W('suitcase', '行李箱', '🧳', 'suit 一套 + case 箱：装一套衣服的箱'), W('passport', '护照', '🛂', 'pass 通过 + port 港口'), W('luggage', '行李', '', 'lug（拉）+ -age：拉的东西'),
    W('beach', '海滩', '🏖️', 'beach 来自古英语 bǣce（溪流的岸）'), W('island', '岛', '🏝️', 'island 的 s 不发音；island 来自古英语「水 + 地」，和 isle（小岛）同源'), W('camp', '露营', '⛺', 'camp 来自拉丁 campus（平原）——campus（校园）同根！camp 原是「平原上的营地」'), W('photo', '照片', '📷', 'photo 是 photograph 的缩写：photo-（光）+ graph（写）：「用光写字」的照片'),
    W('vacation', '度假', '🌴', 'vacation 来自拉丁 vacare（空出来）——vacation 就是「空出来的日子」'), W('journey', '旅途', '', 'journey 来自法语 journée（一天的行程）——journey 原是「一天的路」'), W('pack', '打包', '', 'pack 来自低地德语 pak（包裹）','v'), W('passport photo', '证件照', '🪪', 'passport 护照 + photo 照：证件照') ]},
  { id: 'nature2', name: '自然探索', emoji: '🌏', color: '#6BCB77', pos: 'n', words: [
    W('earth', '地球', '🌍', 'earth 地球——泥土/大地'), W('planet', '行星', '🪐', 'planet 来自希腊语「游荡的」——行星是「游荡的星」'), W('space', '太空', '🌌', 'space 来自拉丁 spatium（空间）'), W('rock', '岩石', '🪨', 'rock 岩石——大块岩石，硬邦邦'),
    W('sand', '沙子', '', 'sand 沙——「s-and」像细细的沙粒'), W('plant', '植物', '🪴', 'plant 来自拉丁 planta（脚掌/插枝）——plant 原是「插进土里的枝」'), W('wood', '木头', '🪵', 'wood 原是「树林」（古英语 wudu），后来才指木头'), W('air', '空气', '', 'air 来自希腊语 aer（空气）'),
    W('smoke', '烟', '', 'smoke 和 smog（烟雾）同源'), W('rose', '玫瑰', '🌹', 'rose 玫瑰——红红的玫瑰'), W('bamboo', '竹子', '🎍', 'bamboo 竹子——一节节的竹子'), W('cave', '山洞', '🕳️', 'cave 来自拉丁 cavus（空的）——cave 就是「空的」洞'),
    W('volcano', '火山', '🌋', 'volcano 来自罗马火神 Vulcan（伏尔甘）——火山是「火神的山」！'), W('desert', '沙漠', '', 'desert = de-（离开）+ sert（连接）：「离开连接」= 荒芜之地'), W('jungle', '丛林', '', 'jungle 来自梵语 jangala（荒地/丛林）'), W('nature', '大自然', '🌿', 'nature 来自拉丁 nasci（出生）——nature 就是「生出来的一切」') ]},
  { id: 'ocean', name: '海洋世界', emoji: '🐬', color: '#4EC5F1', pos: 'n', words: [
    W('whale', '鲸鱼', '🐳', 'whale 鲸鱼——海里最大的鲸'), W('dolphin', '海豚', '🐬', 'dolphin 来自希腊语 delphis（海豚）'), W('shark', '鲨鱼', '🦈', 'shark 来自古英语 scieran（切）——鲨鱼是「切开水面的」'),
    W('octopus', '章鱼', '🐙', 'octo- = 八（拉丁 octo）：octopus 八爪鱼、October 十月（古第八月）、octave 八度'), W('crab', '螃蟹', '🦀', 'crab 是拟声词——横着爬的声音'), W('shrimp', '虾', '🦐', 'shrimp 来自古英语 scrimman（收缩）——虾是「弯弯缩缩」的'), W('seal', '海豹', '🦭', 'seal 海豹——海边的海豹'),
    W('shell', '贝壳', '🐚', 'shell 和 scale（鳞）同源：都是「外面的壳」'), W('seaweed', '海草', '', 'sea 海 + weed 草'), W('wave', '波浪', '', 'wave 来自古英语 wafian（摇摆）——wave 就是「一起一伏」'),
    W('sail', '航行', '', 'sail 航行——扬帆起航'), W('sailor', '水手', '⚓', 'sail 航行 + -or 表「人」'), W('lighthouse', '灯塔', '', 'light 灯 + house 房'), W('seaside', '海边', '', 'sea 海 + side 边'),
    W('goldfish', '金鱼', '🐠', 'gold 金 + fish 鱼'), W('starfish', '海星', '', 'star 星星 + fish 鱼') ]},
  { id: 'verb3', name: '动词三', emoji: '💭', color: '#9B72FF', pos: 'v', words: [
    W('think', '思考', '💭', 'think 思考——摸着下巴想一想'), W('guess', '猜', '🤔', 'guess 和 get 同源：「猜到」就是「得到」线索'), W('decide', '决定', '', 'decide = de-（完全）+ cide（切）：「一刀切下去」= 决定。cide = 切：suicide 自杀'), W('hope', '希望', '', 'hope 希望——心里的期盼'),
    W('wish', '愿望', '🌠', 'wish 来自古英语 wȳscan（希望）'), W('dream', '梦想', '💫', 'dream 原意是「欢乐/音乐」——后来才指「梦」'), W('plan', '计划', '', 'plan 来自法语 plan（平面图）——plan 原是「画的图」'), W('try', '尝试', '', 'try 尝试——努力试一试'),
    W('begin', '开始', '', 'begin 开始——故事开始了'), W('start', '出发', '🚦', 'start 开始——按下启动键（原意「吓一跳跳起来」）'), W('finish', '完成', '', 'finish 来自拉丁 finis（结束）——和 fine 同根'), W('stop', '停止', '', 'stop 停——红灯停'),
    W('continue', '继续', '⏭️', 'continue 来自拉丁 continuare（连在一起）——continue 就是「连着」'), W('mix', '混合', '', 'mix 来自拉丁 miscere（混合）'), W('fix', '修理', '🔧', 'fix 来自拉丁 figere（钉住）——fix 原是「钉牢」'), W('build', '建造', '🏗️', 'build 来自古英语 byldan（建造）'),
    W('practice', '练习', '🔁', 'practice 来自希腊语 praktikos（做的）——practice 就是「做」'), W('improve', '提高', '📈', 'improve = im-（使）+ prove（好）：使变好') ]},
  { id: 'shop2', name: '购物', emoji: '🛒', color: '#FFD93D', pos: 'n', words: [
    W('money', '钱', '💰', 'money 钱——来自拉丁 Moneta（铸钱女神）！'), W('yuan', '元(人民币)', '💵', '元（音译）'), W('dollar', '美元', '💲', 'dollar 美元——来自德语 Thaler 银币'), W('price', '价格', '', 'price 来自拉丁 pretium（价值）——precious（珍贵的）同根'),
    W('cheap', '便宜的', '', 'cheap 来自古英语 cēap（交易/买卖）——cheap 原意是「能买到的」','adj'), W('expensive', '昂贵的', '💎', 'expensive = ex-（出）+ pens（付）+ -ive：要「付出去」很多的','adj'), W('buy', '买', '🛍️', 'buy 买——掏钱包递出去','v'), W('sell', '卖', '🏷️', 'sell 卖——摆摊卖东西','v'),
    W('pay', '付款', '💳', 'pay 来自拉丁 pacare（安抚）——pay 原意是「用钱安抚」','v'), W('cost', '花费', '💸', 'cost 来自拉丁 constare（站在旁边/花费）'), W('market', '市场', '', 'market 来自拉丁 mercari（交易）——merchant（商人）同根'), W('bill', '账单', '🧾', 'bill 来自拉丁 bulla（印/封条）——bill 原是「盖了印的单子」'),
    W('gift', '礼物', '🎁', 'gift 和 give 同源：give 给、gift 礼物'), W('list', '清单', '📋', 'list 来自古英语 liste（边条/布条）——list 原是「一条条」'), W('size', '尺码', '', 'size 来自法语 assise（坐/测量）'), W('customer', '顾客', '', 'custom 习惯 + -er：习惯来店里的顾客') ]},
  { id: 'media', name: '媒体通讯', emoji: '📺', color: '#FF6B6B', pos: 'n', words: [
    W('TV', '电视', '📺', 'TV 是 television 的缩写：tele-（远）+ vis（看）：「看远处的东西」'), W('phone', '电话', '📱', 'phone 来自希腊语 phone（声音）——telephone = tele（远）+ phone（声）：远处的声音'), W('email', '电子邮件', '📧', 'e-（电子）+ mail（邮件）'), W('message', '消息', '', 'message 来自拉丁 mittere（送）——message 就是「送出去的话」。missile 导弹同根'),
    W('call', '打电话', '📞', 'call 打电话——打电话呼叫','v'), W('video', '视频', '📹', 'video 来自拉丁 videre（看）——video 就是「看的」'), W('film', '电影', '🎬', 'film 来自古英语 filmen（薄膜）——film 原是「薄薄一层」'), W('cartoon', '动画片', '', 'cartoon 来自意大利语 cartone（厚纸）——卡通原是「画在厚纸上的草图」'),
    W('story', '故事', '', 'story 和 history 同源（拉丁 historia）——story 就是「讲出来的故事」'), W('news', '新闻', '📰', 'news = new（新）+ s（复数）：新消息们'), W('magazine', '杂志', '📔', 'magazine 来自阿拉伯语 makhazin（仓库）——杂志是「知识的仓库」！'), W('letter', '信', '✉️', 'letter 来自拉丁 littera（字）——letter 原是「一个字」，也指信'),
    W('radio', '收音机', '📻', 'radio 来自拉丁 radius（射线）——radio 就是「电波射出去」'), W('program', '节目', '🎙️', 'program = pro-（前）+ gram（写）：「事先写好的」节目'), W('screen', '屏幕', '🖥️', 'screen 来自法语 escren（屏风）'), W('channel', '频道', '📡', 'channel 来自拉丁 canalis（水道）——channel 原是「水道」，后来才指频道') ]},
  { id: 'music2', name: '音乐艺术', emoji: '🎵', color: '#FF8FAB', pos: 'n', words: [
    W('piano', '钢琴', '🎹', 'piano 来自意大利语 pianoforte（轻和响）——钢琴能「轻能响」！'), W('guitar', '吉他', '🎸', 'guitar 来自希腊语 kithara（琴）'), W('violin', '小提琴', '🎻', 'violin 来自意大利语 viola 的「小」版——violin 小提琴'), W('drum', '鼓', '🥁', 'drum 是拟声词——「咚咚」敲的鼓'),
    W('song', '歌曲', '🎶', 'song 和 sing 是亲兄弟（o↔i 元音降级）'), W('paint', '绘画', '', 'paint 来自拉丁 pingere（画/染）——paint 原是「涂颜色」'), W('brush', '画笔', '🖌️', 'brush 刷子——刷子刷一刷'), W('band', '乐队', '🎺', 'band 来自古法语 bande（一队人）'),
    W('concert', '音乐会', '', 'concert = con-（一起）+ cert（确定）：「一起确定」→合奏'), W('stage', '舞台', '🎭', 'stage 来自拉丁 stare（站）——stage 就是「站的地方」'), W('magic', '魔法', '✨', 'magic 来自希腊语 magos（术士）——magic 和 magi（东方三贤士）同源'), W('opera', '歌剧', '🎼', 'opera 来自拉丁 opus（作品）——opera 就是「作品」'),
    W('statue', '雕像', '🗿', 'statue 来自拉丁 statua（立着的东西）——statue 就是「立着的」像') ]},
  { id: 'adj3', name: '描述三', emoji: '🔬', color: '#9B72FF', pos: 'adj', words: [
    W('correct', '正确的', '', 'correct = cor-（完全）+ rect（直）：完全「弄直」= 改对。rect- = 直：rectangle 长方形'), W('wrong', '错误的', '', 'wrong 来自古英语 wrang（扭歪的）——wrong 原是「歪的」！'), W('true', '真的', '', 'true 原意是「忠实的/可靠的」——true 真、trust 信任'), W('false', '假的', '🤥', 'false 来自拉丁 falsus（欺骗的）——false 原是「骗人的」'),
    W('same', '相同的', '🟰', 'same 相同——「s-ame」像双胞胎穿一样的'), W('different', '不同的', '🔀', 'different = dif-（分开）+ fer（拿）+ -ent：「分开拿」= 不同'), W('tight', '紧的', '🪢', 'tight 来自古英语 tyht（紧的）'), W('far', '远的', '', 'far 远——「f-ar」像越走越远'),
    W('deep', '深的', '', 'deep 和 dip（蘸）同源——deep 就是「往下蘸」到底'), W('high', '高的', '🏔️', 'high 高——高高的山顶'), W('dangerous', '危险的', '⚠️', 'danger 危险 + -ous。danger 来自法语 dangier（威胁）'), W('important', '重要的', '', 'important = im-（入）+ port（拿）+ -ant：「拿进去」= 重要'),
    W('interesting', '有趣的', '', 'interest = inter-（之间）+ est（在）：「在其中」才有趣'), W('boring', '令人无聊的（事/物）', '', 'boring = bore（钻孔）+ -ing：这东西「让人」像被钻孔一样难熬；-ing 修饰事/物，不说人'), W('useful', '有用的', '', 'use 用 + -ful 满'), W('special', '特别的', '', 'special 来自拉丁 species（种类）——special 就是「特别一种」') ]},
  { id: 'time2', name: '时间二', emoji: '⏳', color: '#FF9F45', pos: 'n', words: [
    W('age', '年龄', '', 'age 来自拉丁 aetas（年龄）'), W('date', '日期', '', 'date 来自拉丁 dare（给）——date 原是「给出的时间」'), W('quarter', '一刻钟', '', 'quarter = quart-（四）+ -er：四分之一。quart 夸脱 = 四分之一加仑'), W('half', '一半', '🌗', 'half 一半——一半一半'),
    W('past', '过去', '', 'past 来自拉丁 passus（步）——past 就是「走过去的」'), W('term', '学期', '', 'term 来自拉丁 terminus（界限）——term 原是「一段的界限」'), W('moment', '时刻', '⏱️', 'moment 来自拉丁 momentum（运动/瞬间）——moment 就是「一动之间」'), W('period', '时期', '', 'period = peri-（周围）+ od（路）：「走一圈」的时间'),
    W('noon', '正午', '', 'noon 来自拉丁 nona（第九个时辰）——noon 原是「第九个小时」（下午三点）！后来才指正午'), W('midnight', '午夜', '🌃', 'mid 中间 + night 夜'), W('century', '世纪', '', 'cent- = 百（拉丁 centum）：century 世纪（一百年）、cent 分（百分之一元）'), W('future', '未来', '🚀', 'future 来自拉丁 futurus（将要来的）'),
    W('end', '结束', '🔚', 'end 结束——「e-nd」像到头了'), W('history', '历史', '📜', 'history 和 story 同源（拉丁 historia）——history 就是「讲出来的故事」') ]},
]},

{ id: 'g6', name: '六年级', emoji: '🎓', themes: [
  { id: 'festival', name: '节日', emoji: '🎉', color: '#FF6B6B', pos: 'n', words: [
    W('festival', '节日', '🎉', 'festival 来自拉丁 festum（节日）'), W('Christmas', '圣诞节', '🎄', 'Christ 基督 + mas 弥撒：基督的弥撒'), W('present', '礼物', '🎁', 'present = pre-（前）+ sent（在）：「放在前面」的东西 = 礼物'), W('party', '聚会', '🥳', 'party 来自拉丁 partire（分开）——party 原是「分成一伙人」'),
    W('candle', '蜡烛', '🕯️', 'candle 来自拉丁 candere（发光）——candle 就是「发光的」'), W('firework', '烟花', '🎆', 'fire 火 + work 作'), W('lantern', '灯笼', '🏮', 'lantern 来自希腊语「发光」——和 lamp（灯）同根'), W('dragon', '龙', '🐉', 'dragon 来自希腊语 drakon（大蛇）——dragon 原是「大蛇」！'),
    W('celebrate', '庆祝', '', 'celebrate 来自拉丁 celebrare（常去/庆祝）','v'), W('New Year', '新年', '🎇', 'new 新 + year 年'), W('Christmas tree', '圣诞树', '', 'Christmas 圣诞 + tree 树'), W('firecracker', '鞭炮', '🧨', 'fire 火 + cracker（爆裂的东西）'),
    W('invite', '邀请', '💌', 'invite = in-（入）+ vite（来）：「请进来」','v'), W('prepare', '准备', '', 'prepare = pre-（前）+ pare（安排）：提前安排好','v') ]},
  { id: 'country', name: '国家语言', emoji: '🗺️', color: '#4EC5F1', pos: 'n', words: [
    W('China', '中国', '🇨🇳', 'China 来自梵语 Cina（秦）——中国的名字来自「秦」朝！'), W('America', '美国', '🇺🇸', 'America 来自探险家 Amerigo Vespucci 的名字'), W('England', '英国', '🇬🇧', 'England = Angl-（盎格鲁人）+ land（地）：盎格鲁人的土地'), W('Australia', '澳大利亚', '🇦🇺', 'Australia 来自拉丁 australis（南方的）——南方的大陆'),
    W('Canada', '加拿大', '🇨🇦', 'Canada 来自原住民语 kanata（村庄）'), W('Japan', '日本', '🇯🇵', 'Japan 日本——来自中文「日本」的读音'), W('France', '法国', '🇫🇷', 'France 来自法兰克人（Franks）——法兰克人的土地'), W('language', '语言', '', 'lingu- = 舌/语言：language 语言、linguistics 语言学、bilingual 双语'),
    W('flag', '旗帜', '🚩', 'flag 来自古英语 flagg（飘动的东西）——旗帜就是「迎风飘」的'), W('people', '人们', '👥', 'people 来自拉丁 populus（人民）——popular（流行的）同根'), W('person', '人', '🧍', 'person 来自拉丁 persona（面具）——person 原是「面具/角色」！'), W('foreign', '外国的', '', 'for-（外面的）+ eign：门外的。door/foreign 同根','adj'),
    W('abroad', '国外', '', 'abroad 原是 on broad（在广阔处）——走到广阔的天地去 = 国外','adv'), W('foreigner', '外国人', '', 'foreign 外国 + -er 表「人」'), W('culture', '文化', '', 'culture 来自拉丁 colere（耕种/照料）——culture 原是「耕种」，后来才指文化！'), W('friendship', '友谊', '🤝', 'friend 朋友 + -ship（表关系）：friendship 友谊、relationship 关系') ]},
  { id: 'verb4', name: '动词四', emoji: '🔄', color: '#9B72FF', pos: 'v', words: [
    W('become', '变成', '', 'be + come 来'), W('grow', '生长', '', 'grow 和 green/grass 同源：草木一生长就是绿的'), W('change', '改变', '', 'change 来自拉丁 cambiare（交换）'), W('move', '移动', '', 'move 移动——挪个位置'),
    W('arrive', '到达', '', 'arrive = ar-（到）+ rive（岸）：「到岸」= 到达'), W('leave', '离开', '', 'leave 原意是「留下」（古英语 lǣfan）——leave a note 留个条'), W('stay', '停留', '⏸️', 'stay 来自拉丁 stare（站）——stay 就是「站在那里」'), W('live', '居住', '', 'live 和 life 同源'),
    W('use', '使用', '', 'use 使用——拿起来用'), W('borrow', '借入', '', 'borrow 来自古英语 borgian（担保）——borrow 原是「拿担保借东西」'), W('lend', '借出', '', 'lend 借出——「l-end」像递出去'), W('keep', '保持', '🫳', 'keep 保持——紧紧握住不放'),
    W('show', '展示', '', 'show 展示——拿出来展示'), W('follow', '跟随', '', 'follow 跟随——跟在后面走'), W('carry', '搬运', '', 'carry 来自法语 carre（车）——carry 原是「用车运」！car 同根'), W('wait', '等待', '⏳', 'wait 等待——耐心排队等'),
    W('spend', '花费', '', 'spend 来自拉丁 expendere（付出）——expend（花费）同根'), W('come', '来', '🙌', 'come 来——朝你走来') ]},
  { id: 'adverb', name: '频率副词', emoji: '🔁', color: '#FFD93D', pos: 'adv', tip: '💡 规律：形容词 + ly = 副词！slow→slowly, quick→quickly', words: [
    W('very', '非常', '', 'very 非常——来自拉丁「真的」，very 原意是真的'), W('too', '也/太', '', 'too 也/太——「我也要！太好了！」'), W('also', '也', '', 'also 也——all + so：也是这样'), W('again', '再一次', '', 'again 再一次——再来一次'),
    W('always', '总是', '♾️', 'always 总是——all + ways：一直都是这样'), W('usually', '通常', '📶', 'usual + -ly'), W('often', '经常', '', 'often 经常——常常这样做'), W('sometimes', '有时', '🎲', 'some 一些 + times 时'),
    W('never', '从不', '🚫', 'never 从不——ne-（不）+ ever（曾经）：从来不'), W('soon', '很快', '', 'soon 很快——很快就来了'), W('still', '仍然', '', 'still 仍然——站着不动「还是这样」'), W('just', '刚刚', '', 'just 刚刚——刚刚好'),
    W('only', '仅仅', '', 'only 仅仅——one + -ly：只有这一个'), W('almost', '几乎', '', 'almost 几乎——all + most：差一点点'), W('maybe', '也许', '', 'maybe 也许——may + be：可能吧'),
    W('already', '已经', '✔️', 'all + ready：已经完成'), W('then', '然后', '', 'then 然后——接下去'), W('first', '首先', '', 'first 首先——fore（前）+ -est：最前面的'),
    W('slowly', '慢慢地', '', 'slow 慢 + -ly 地'), W('quickly', '快快地', '🐇', 'quick 快 + -ly 地') ]},
  { id: 'question2', name: '疑问词', emoji: '❓', color: '#FF9F45', pos: 'qw', tip: '💡 规律：疑问词几乎都用 wh 开头（how 除外）！', words: [
    W('what', '什么', '', 'wh- 问题词族来自古英语 hw-：what/who/where/when/why/which/whose/how 一家'), W('who', '谁', '', 'wh- 问题词族（古英语 hw-）'), W('where', '哪里', '', 'wh- 问题词族（古英语 hw-）'), W('when', '什么时候', '', 'wh- 问题词族（古英语 hw-）'),
    W('why', '为什么', '', 'wh- 问题词族（古英语 hw-）'), W('which', '哪一个', '', 'wh- 问题词族（古英语 hw-）'), W('whose', '谁的', '', 'who 谁 + -se 的'), W('how', '怎样', '', 'wh- 问题词族（古英语 hw-）'),
    W('everyone', '每个人', '', 'every（每）+ one（一）：每个人','pron'), W('anyone', '任何人', '', 'any（任何）+ one（一）：任何人','pron') ]},
  { id: 'prep1', name: '常用虚词', emoji: '➡️', color: '#6BCB77', pos: 'prep', words: [
    W('at', '在(时刻)', '', 'at 在——箭头指着那个点'), W('of', '…的', '', 'of 的——像果子的把儿连着果'), W('for', '为了', '', 'for 为了——像捧着东西递出去'), W('with', '和…一起', '', 'with 原意是「对着/against」——with 原是「对着」，后来才变「和」'),
    W('about', '关于', '', 'about = a-（在）+ bout（弯曲）：「转来转去」关于某事'), W('to', '到/向', '', 'to 到——箭头奔向终点'), W('from', '从', '', 'from 从——小鸟从树上飞出来'), W('into', '进入', '', 'in 里 + to 到'),
    W('out', '出去', '', 'out 出去——跑出门外'), W('up', '向上', '', 'up 向上——电梯朝上'), W('down', '向下', '', 'down 原是「从山上下来」（古英语 dūne）'),
    W('off', '离开', '', 'off 离开——开关「咔哒」关掉'), W('and', '和', '', 'and 和——两个字母手拉手站一起','conj'), W('or', '或者', '', 'or 或者——两条路选一条','conj'), W('but', '但是', '', 'but 原意是「除了/在外」（古英语 būtan）','conj'),
    W('so', '所以', '', 'so 所以——点头「所以嘛」','conj'), W('because', '因为', '', 'be + cause 原因','conj'), W('if', '如果', '', 'if 如果——歪头想「万一呢？」','conj') ]},
  { id: 'prep2', name: '进阶虚词', emoji: '🌉', color: '#4EC5F1', pos: 'prep', words: [
    W('between', '在…之间', '', 'be + tween（二）：在两者之间。tween = 二！twenty 二十同根（两个十）！'), W('among', '在…之中', '', 'a-（在）+ mong（人群）：在人群之中'), W('during', '在…期间', '', 'dur-（持续）+ -ing：持续期间'), W('without', '没有', '', 'with + out 外：两手空空'),
    W('towards', '朝向', '', 'to + wards'), W('against', '靠着/反对', '', 'again + st（对着）：对着来'), W('through', '穿过', '', 'through 穿过——火车穿过长长的山洞'), W('across', '横过', '', 'a + cross 横过'),
    W('along', '沿着', '', 'a + long 沿着'), W('around', '围绕', '', 'a + round 圈'), W('beyond', '超过', '', 'be + yond（那边）：到更那边'), W('except', '除了', '', 'ex-（出）+ cept（拿）：拿出去 = 除外。cept = 拿：accept 接受'),
    W('inside', '在里面', '', 'in 里 + side 边'), W('outside', '在外面', '', 'out 外 + side 边'), W('until', '直到', '', 'un- + till 直到'), W('since', '自从', '', 'since 来自古英语 siððan（之后）'),
    W('although', '虽然', '', 'all + though 虽然'), W('however', '然而', '', 'how + ever 然而') ]},
  { id: 'communicate', name: '人际交流', emoji: '💬', color: '#FF8FAB', pos: 'v', words: [
    W('meet', '遇见', '', 'meet 遇见——在门口碰面'), W('introduce', '介绍', '', 'intro-（向内）+ duc（引导）：「引见」。duc = 引导：produce 生产、educate 教育'), W('agree', '同意', '🙆', 'a-（向）+ gree（高兴）：意见一致就高兴'), W('excuse', '打扰一下', '', 'ex-（出）+ cuse（原因）：说出原因 = 借口/打扰'),
    W('share', '分享', '', 'share 原是「切开分」（古英语 scearu 切）——share 就是「分」'), W('care', '关心', '', 'care 原意是「忧虑」（古英语 caru）——care 就是「放在心上」'), W('promise', '承诺', '🤙', 'pro-（前）+ mise（送）：「提前说出去」= 承诺'), W('praise', '表扬', '👏', 'praise 来自拉丁 pretium（价值）——praise 就是「说你有价值」！price 同根'),
    W('argue', '争论', '😤', 'argue 来自拉丁 arguere（使明亮/证明）——argue 原是「说清楚」'), W('cheer', '欢呼', '', 'cheer 来自法语 chere（脸/表情）——cheer 原是「好脸色」！'), W('greet', '问候', '', 'greet 来自古英语 grētan（走近问候）'), W('discuss', '讨论', '', 'dis-（分开）+ cuss（摇动）：「摇开来谈」。percussion 敲击同根'),
    W('suggest', '建议', '', 'suggest = sug-（在下）+ gest（带）：「从下面带上来」= 建议'), W('explain', '解释', '', 'explain = ex-（出）+ plain（平）：「摊平讲出来」= 解释') ]},
  { id: 'society', name: '社会生活', emoji: '🚦', color: '#FF6B6B', pos: 'n', words: [
    W('rule', '规则', '', 'rule 来自拉丁 regula（直尺）——reg- = 直！rule 原是「直尺/规矩」'), W('law', '法律', '⚖️', 'law 来自北欧语 lag（放好的东西）——law 原是「定好的规矩」'), W('police', '警察', '🚓', 'police 来自拉丁 polis（城市）——police 就是「城市管理」。politics 政治同根！'), W('protect', '保护', '🛡️', 'pro-（前）+ tect（盖）：「挡在前面」= 保护。detect 侦查同根（拿掉盖子）'),
    W('save', '拯救', '🦸', 'save 和 safe 同源（拉丁 salvus）：safe 安全、save 救'), W('danger', '危险', '', 'danger 来自法语 dangier（威胁）'), W('accident', '事故', '', 'ac-（向）+ cid（落）+ -ent：「落下来」= 意外。incident 事件同根'), W('team', '团队', '', 'team 原是「一队拉车的动物」（古英语 tēam）'),
    W('group', '小组', '', 'group 来自法语 groupe（一团）'), W('neighbour', '邻居', '', 'neigh-（近）+ bour（家）：住在附近的人'), W('crowd', '人群', '', 'crowd 来自古英语 crūdan（挤）'), W('volunteer', '志愿者', '', 'volunt-（意愿）+ -eer：凭意愿来的人。voluntary 自愿的同根'),
    W('activity', '活动', '🎪', 'activ-（活动的）+ -ity。act 来自拉丁 agere（做）'), W('event', '大事', '', 'e-（出）+ vent（来）：「出来的」= 发生的事。adventure 冒险同根') ]},
  { id: 'character', name: '性格品质', emoji: '💝', color: '#9B72FF', pos: 'adj', tip: '💡 规律：名词 + ful = "充满…的"！care+ful, help+ful', words: [
    W('kind', '善良的', '💞', 'kind 善良——对人好（原意「天性」）'), W('brave', '勇敢的', '', 'brave 勇敢——小英雄挺身而出'), W('smart', '聪明的', '', 'smart 聪明——小脑瓜聪明（原意「刺痛」）'), W('clever', '机灵的', '', 'clever 机灵——小脑瓜一转想出好点子'),
    W('lazy', '懒惰的', '🦥', 'lazy 懒——太阳晒屁股还不起'), W('funny', '滑稽的', '🤡', 'funny 滑稽——笑得肚子疼'), W('strict', '严格的', '', 'strict 来自拉丁 stringere（拉紧）——strict 原是「拉紧的」。restrict 限制同根'), W('friendly', '友好的', '', 'friend + -ly（形容词，像朋友一样）'),
    W('honest', '诚实的', '🤞', 'honest 来自拉丁 honestus（体面的）——honor 荣誉同根'), W('polite', '有礼貌的', '', 'polite 来自拉丁 polire（打磨）——polite 原是「打磨得很光滑」！'), W('patient', '耐心的', '', 'patient 来自拉丁 pati（承受）——patient 原是「能承受的」。passion 热情同根'), W('active', '活跃的', '', 'act（做）+ -ive：做着的'),
    W('gentle', '温柔的', '', 'gentle 原是「出身好→文雅」（拉丁 gentilis 同族的）'), W('wild', '野性的', '', 'wild 野性——野马在草原狂奔'), W('careful', '小心的', '', 'care 关心 + -ful 满'), W('helpful', '乐于助人的', '', 'help 帮 + -ful 满') ]},
  { id: 'future2', name: '学习与未来', emoji: '🚀', color: '#FF9F45', pos: 'n', words: [
    W('goal', '目标', '', 'goal 原是「终点线」（古英语 gal 界限）'), W('work', '工作', '', 'work 工作——认真干活'), W('success', '成功', '', 'suc-（下面）+ cess（走）：「一路走下去」= 成功。cess = 走：process 过程'), W('fail', '失败', '📉', 'fail 来自拉丁 fallere（欺骗）——fail 原是「辜负/欺骗」'),
    W('study', '学习', '', 'study 来自拉丁 studium（热心/努力）'), W('review', '复习', '', 're-（再）+ view（看）：再看一遍'), W('exam', '考试', '', 'exam 是 examination 的缩写：ex-（出）+ 做：「做出来」给你看'),
    W('believe', '相信', '', 'be- + lieve（爱/信任）——believe 原是「信任」'), W('effort', '努力', '', 'ef-（出）+ fort（力量）：使出力气。fort 要塞同根'), W('ideal', '理想', '', 'ideal 来自希腊语 idea（想法/形式）——ideal 就是「理想的形态」'), W('graduate', '毕业', '', 'grad-（步）+ -uate：「走完一步」= 毕业。grad- = 步：grade 年级'), W('college', '大学', '', 'college 来自拉丁 collegium（一起读书的团体）'),
    W('knowledge', '知识', '', 'know 知 + -ledge（表状态）'), W('choice', '选择', '', 'choice 和 choose 同根：choose 选、choice 选择'), W('chance', '机会', '', 'chance 来自法语 cheoir（落下）——chance 原是「碰巧落下来的」！') ]},
  { id: 'environment', name: '保护地球', emoji: '♻️', color: '#6BCB77', pos: 'n', words: [
    W('environment', '环境', '', 'environ（围绕）+ -ment：围绕我们的环境'), W('pollution', '污染', '🏭', 'pollute（弄脏）+ -ion。pollute 来自拉丁 polluere'), W('rubbish', '垃圾', '🗑️', 'rubbish 来自古法语 robbe（破布）——rubbish 原是「破烂」'), W('recycle', '回收利用', '♻️', 're-（再）+ cycle（循环）：回收再用'),
    W('energy', '能源', '', 'energy 来自希腊语「活力」：en-（内）+ erg（工作）：内在的「工作力」！'), W('power', '力量', '', 'power 来自法语 poir（能力）'), W('fresh', '新鲜的', '', 'fresh 来自古英语 fersc（新鲜的/淡的）'), W('silent', '寂静的', '', 'silent 来自拉丁 silere（安静）'),
    W('peace', '和平', '', 'peace 来自拉丁 pax（和平）——pacific 太平的同根！Pacific Ocean 太平洋'), W('land', '陆地', '', 'land 陆地——脚踩的陆地'), W('ocean', '海洋', '🌊', 'ocean 来自希腊语 Okeanos（大洋神）'), W('reusable', '可重复用的', '', 're- 再 + use 用 + -able 能'),
    W('protect the earth', '保护地球', '', 'protect 保护 + the earth 地球'), W('save water', '节约用水', '', 'save 节约 + water 水') ]},
  { id: 'magic', name: '高频魔法词', emoji: '✨', color: '#FFD93D', pos: 'adj', words: [
    W('see', '看见', '', 'see 看见——两只眼睛睁大'), W('not', '不', '', 'not 不——摇头「不是」'), W('well', '好/井', '', 'well 好——做得好！'), W('let', '让', '', 'let 让——点头说「你来」'),
    W('thing', '东西', '', 'thing 原是「集会上讨论的东西」（古英语 þing 集会）！'), W('nothing', '没有什么', '', 'no（没）+ thing（东西）：什么都没有'), W('something', '某事物', '', 'some（某）+ thing（东西）：某样东西'), W('everything', '每件事', '', 'every（每）+ thing（东西）：每样东西'),
    W('everybody', '每个人', '', 'every（每）+ body（人）：每个人'), W('nobody', '没有人', '', 'no（没）+ body（人）：没有人'), W('somebody', '某人', '', 'some（某）+ body（人）：某个人'), W('anybody', '任何人', '', 'any（任何）+ body（人）：任何人'),
    W('way', '方法/路', '🛤️', 'way 方法/路——走的路 / 方法'), W('away', '离开', '', 'a + way 路'), W('own', '自己的', '', 'own 来自古英语 āgen（拥有的）'), W('else', '别的', '', 'else 来自古英语 elles（别的）'),
    W('another', '另一个', '', 'an 一 + other 另'), W('few', '很少', '', 'few 很少——只有两三颗'), W('little', '小的', '', 'little 小的——小不点儿一点点'), W('much', '许多', '', 'much 许多——堆成小山（不可数）'),
    W('many', '许多', '', 'many 许多——满天星星数不清'), W('each', '每个', '', 'each 每个——一个一个点名'), W('every', '每一个', '', 'ever + y'), W('all', '全部', '', 'all 全部——a-l-l 三个字母排排站，一个不落'),
    W('some', '一些', '', 'some 一些——「s-ome」像抓一把'), W('any', '任何的', '', 'any 任何——「a-ny」像随便哪个都行'), W('both', '两个都', '', 'both 两个都——来自古英语「那两个」：左手右手各一个'), W('other', '其他的', '', 'other 其他的——转头看另一边'),
    W('next', '下一个', '', 'next 和 nigh（近）同源——next 就是「最近的」'), W('last', '最后的', '', 'last 和 late 同源——last 就是「最迟的」'), W('once', '一次', '', 'one + -s：只做一次'), W('twice', '两次', '', 'tw-（二）+ -ice：两次。tw- = 二：two、twelve、twenty、twice') ]},
]},
];

