/* ============================================================
   小鸟英语乐园 · 小学 1000 词库
   覆盖 1-6 年级义务教育英语课程标准必背词汇
   按年级 → 主题分类，共 61 个主题、1000 词，全局无重复
   W(单词, 中文, 图解emoji, 记忆法)
   pos: 主题默认词性（个别词在 data.js 里覆盖）
   ============================================================ */
'use strict';
const W = (w, zh, e, dec) => dec ? { w, zh, e, dec } : (e ? { w, zh, e } : { w, zh });

const GRADES = [
{ id: 'g1', name: '一年级', emoji: '🌱', themes: [
  { id: 'greet', name: '打招呼', emoji: '👋', color: '#FF6B6B', pos: 'interj', words: [
    W('hello','你好','👋','h 举高高——挥着高高的小手打招呼'), W('hi','嗨','🙋','h 高高——把手举高高说嗨'), W('goodbye','再见','🤚','good 好 + bye 拜——"好·拜"再见'),
    W('bye','拜拜','🖐️','谐音"拜"——拜拜'), W('good','好的','👍','g 鸽子点头：好的好的'), W('good morning','早上好','🌅','morning 早上——早上的问候'),
    W('good afternoon','下午好','☀️','after 在后 + noon 中午：中午之后是下午'), W('good night','晚安','🌙','night 夜晚——夜晚说晚安'),
    W('thank','感谢','🙏','th 吐舌头——真诚地说谢谢'), W('thanks','谢谢','🙏','thank 加 s——谢了又谢'), W('please','请','🤲','p 手掌摊开——掌心向上说"请"'),
    W('sorry','对不起','😔','s 小蛇绕来绕去——不好意思地扭扭'), W('welcome','欢迎','🎊','wel + come 来——欢迎你来到'), W('yes','是的','✅','y 举手喊 yes！'),
    W('no','不','❌','n 摇头：不不不'), W('OK','好的','👌','画个圈圈 OK 啦') ]},
  { id: 'self', name: '我和你', emoji: '🧒', color: '#4EC5F1', pos: 'pron', words: [
    W('I','我','','i 小人站得直直的——就是我'), W('you','你','','指着对方：你'), W('he','他','','he——他'), W('she','她','','s 蛇盘发的小姑娘：她'),
    W('it','它','','i 小人 + t 话筒：它是小东西'), W('we','我们','','w 水波家族手拉手：我们'), W('they','他们','','th + ey：那边的他们'),
    W('my','我的','','m 山是我的'), W('your','你的','','你的那个'), W('his','他的','','h 高高的他'), W('her','她的','','her——她'),
    W('our','我们的','','我们的家'), W('their','他们的','','他们的队伍'), W('me','我(宾格)','','m 山窝里抱着我'),
    W('him','他(宾格)','','him——到他'), W('them','他们(宾格)','','them——到他们'),
    W('am','是(我)','','我 I 专用的小"是"'), W('is','是(他她它)','','s 小蛇说：is 是'), W('are','是(你/我们)','','r 小草排队说：are 是'),
    W('this','这','','近的用 this——手指眼前'), W('that','那','','远的用 that——指向那边') ]},
  { id: 'people', name: '人物', emoji: '👥', color: '#FF9F45', pos: 'n', words: [
    W('man','男人','👨','m 山一样可靠的男人'), W('woman','女人','👩','w 水 + man：似水的女人'), W('boy','男孩','👦','b 棒小伙子'), W('girl','女孩','👧','g 鸽子般蹦跳的女孩'),
    W('child','孩子','🧒','小小的 child'), W('children','孩子们','🧒','child 的复数变身 children'), W('kid','小孩','🧒','k 踢来踢去的小孩'),
    W('adult','大人','🧑','a 小鸟长成了大鸟：大人'), W('lady','女士','👩','l 长裙飘的女士'), W('sir','先生','🤵','sir——尊敬的先生'),
    W('Mr','先生','🤵','M+r：Mr 王、Mr 李'), W('Miss','小姐(未婚)','👩','Miss——小小姐'), W('twin','双胞胎','👯','tw 是"二"家族（two）：两个一起'), W('gentleman','绅士','🤵','gentle 温柔 + man 人：温柔的人') ]},
  { id: 'num1', name: '数字 1-10', emoji: '🔢', color: '#9B72FF', pos: 'num', words: [
    W('zero','零','0️⃣','z 闪电划出一个 0'), W('one','一','1️⃣','o 圆圆的一颗糖'), W('two','二','2️⃣','t 话筒——数到二喊一声'),
    W('three','三','3️⃣','th 吐舌说三'), W('four','四','4️⃣','f 四根手指头'), W('five','五','🖐️','f 小手——一只手正好五根手指！'),
    W('six','六','6️⃣','s 小蛇盘成 6'), W('seven','七','7️⃣','s 蛇爬上 7'), W('eight','八','8️⃣','ei 像汉字八的耳朵'),
    W('nine','九','9️⃣','n 摇头还差一（10-1=9）'), W('ten','十','🔟','t 话筒宣布：十！'), W('count','数数','🧮','c 小手抓着数'), W('number','数字','🔢','n 数字编号') ]},
  { id: 'color', name: '颜色', emoji: '🎨', color: '#FFD93D', pos: 'adj', words: [
    W('red','红色','🔴','r 小草开红花'), W('yellow','黄色','💛','y 举手抢答黄'),
    W('blue','蓝色','🔵','b 棒子撑起蓝天'), W('green','绿色','🟢','g 鸽子落在绿草地'),
    W('white','白色','⚪','w 水波翻白浪'), W('black','黑色','⚫','b 棒子烧黑了'),
    W('orange','橙色','🟠','o 圆嘴巴——圆圆的橙子'), W('pink','粉色','🌸','p 小手掌拍出粉手印'),
    W('purple','紫色','🟣','pur+ple：紫葡萄串串'), W('brown','棕色','🟤','br：棕熊 brown'), W('grey','灰色','🐈','grey 灰猫'), W('colour','颜色(英式)','🌈','colour 英国写法，color 美国写法') ]},
  { id: 'school', name: '学校文具', emoji: '🏫', color: '#4EC5F1', pos: 'n', words: [
    W('school','学校','🏫','sc 鱼群游进学校'), W('book','书','📖','b 板子——书是纸板做的'), W('pen','钢笔','🖊️','p 薄薄——笔尖薄薄的'),
    W('pencil','铅笔','✏️','pen 笔 + cil：铅笔'), W('ruler','尺子','📏','r 直直的尺'), W('bag','书包','🎒','b 背包——书包背在背上'),
    W('eraser','橡皮','🧽','e 眼睛盯着擦干净'), W('desk','课桌','🪑','d 桌板平平'), W('chair','椅子','💺','ch air：能坐的空气椅'), W('blackboard','黑板','⬛','black 黑 + board 板：黑板'),
    W('crayon','蜡笔','🖍️','c ray 光线——画出彩色光线'), W('pencil-box','铅笔盒','📦','pencil 铅笔 + box 盒'), W('card','卡片','🃏','c 手里的卡片'), W('picture','图片','🖼️','pi+c+ture：画出来的图'),
    W('teacher','老师','👩‍🏫','teach 教 + er 人：教书的人'), W('student','学生','🎓','s 学习的 dent？记住：study 学习 → student 学生'), W('class','班级','🧑‍🤝‍🧑','cl 手拉手成一个班'),
    W('classroom','教室','🚪','class 课 + room 房：上课的房间'), W('name','名字','🏷️','n 名字挂牌'), W('sticker','贴纸','⭐','s 闪闪的贴纸'),
    W('scissors','剪刀','✂️','scis + sors：两片 s 像刀刃，咔嚓咔嚓'), W('glue','胶水','🧴','gl 黏黏的胶'), W('bell','铃铛','🔔','b 摇响的铃铛'), W('schoolbag','书包','🎒','school 学 + bag 包'), W('paper','纸','📄','p 薄薄——薄薄的纸') ]},
  { id: 'animal1', name: '动物', emoji: '🐾', color: '#FF6B6B', pos: 'n', words: [
    W('cat','小猫','🐱','c 小手抓——小猫抓老鼠小能手！'), W('dog','小狗','🐶','d 往下——小狗低头闻呀闻'),
    W('bird','小鸟','🐦','b 棒子嘴 + i 唱歌：小鸟'), W('fish','鱼','🐟','f 小手——伸手抓鱼咯！'),
    W('duck','鸭子','🦆','d 往下——鸭子低头钻水里'), W('pig','小猪','🐷','p 小手掌——小蹄印像小手掌'),
    W('bear','熊','🐻','b 大棒熊 + ear 耳朵：熊耳朵'), W('monkey','猴子','🐵','m 大山——猴子在大山里翻跟头'),
    W('panda','熊猫','🐼','谐音"胖达"——圆滚滚的熊猫'), W('tiger','老虎','🐯','t 嗷呜——t 开头的大老虎'), W('lion','狮子','🦁','l 长鬃毛的 lion'),
    W('elephant','大象','🐘','e 小眼 + le + phant：大象甩鼻子'), W('rabbit','兔子','🐰','r 蹦蹦跳的长耳朵'), W('mouse','老鼠','🐭','m 山洞里的老鼠'), W('hen','母鸡','🐔','h 高高的鸡窝'),
    W('chick','小鸡','🐤','ch 啾啾叫的小鸡'), W('cow','奶牛','🐮','c 哞——奶牛'), W('sheep','绵羊','🐑','sh 咩——绵羊'),
    W('giraffe','长颈鹿','🦒','g 鸽子腿——长颈鹿也 g 开头'), W('goose','大鹅','🦢','g 嘎嘎——大鹅'),
    W('owl','猫头鹰','🦉','o 圆眼睛的猫头鹰'), W('eagle','老鹰','🦅','e 锐利的鹰眼'), W('koala','考拉','🐨','k 抱树的考拉'), W('zebra','斑马','🦓','z 闪电——斑马条纹像闪电 z') ]},
  { id: 'family', name: '家庭', emoji: '👨‍👩‍👧', color: '#FF9F45', pos: 'n', words: [
    W('dad','爸爸','👨','d 低头亲亲你的爸爸'), W('mom','妈妈','👩','m 大山——妈妈像大山一样可靠'),
    W('father','父亲','👨','fa + ther：正式版的爸爸'), W('mother','母亲','👩','mo + ther：正式版的妈妈'), W('brother','兄弟','👦','bro 哥 + ther：兄弟'), W('sister','姐妹','👧','sis 姐 + ter：姐妹'),
    W('grandpa','爷爷','👴','grand 大 + pa 爸：爸爸的爸爸'), W('grandma','奶奶','👵','grand 大 + ma 妈：妈妈的妈妈'), W('family','家','👨‍👩‍👧‍👦','fa + mi + ly：一家人'),
    W('baby','宝宝','👶','ba by：抱抱宝宝'), W('uncle','叔叔','🧔','un + cle：叔叔'), W('aunt','阿姨','👩‍🦰','au + nt：阿姨'), W('friend','朋友','🤝','fri + end：到哪都是朋友（end 到头）') ]},
  { id: 'body', name: '身体', emoji: '🧍', color: '#6BCB77', pos: 'n', words: [
    W('eye','眼睛','👁️','eye 开头就是小眼睛 e！'), W('ear','耳朵','👂','ear 长长的耳朵'), W('nose','鼻子','👃','n 鼻子哼气——闻闻味道'),
    W('mouth','嘴巴','👄','m 张大嘴巴 mmm'), W('hand','手','🖐️','h 高高——举起手来高高的'),
    W('head','头','🙂','h 高——头是身体最高的地方！'), W('hair','头发','💇','h 高高飘的头发'), W('face','脸','😊','f 手摸脸蛋'),
    W('arm','手臂','💪','a 小鸟挥翅膀：手臂'), W('leg','腿','🦵','l 长腿本腿！'), W('foot','脚','🦶','f 小手——小脚也像小手'),
    W('tooth','牙齿','🦷','t 话筒咬在牙上'), W('finger','手指','👆','f 小手 + inger：手指！'), W('neck','脖子','🦒','n 转动的长脖子'),
    W('knee','膝盖','🧎','kn 开头 k 不发音！读"泥"'), W('shoulder','肩膀','🧍','sh + oulder：肩膀扛东西') ]},
  { id: 'toy', name: '玩具', emoji: '🧸', color: '#FF8FAB', pos: 'n', words: [
    W('ball','球','⚽','用棒子打的球，b 开头！'), W('kite','风筝','🪁','k 踢腿放风筝，飞高高'),
    W('doll','娃娃','🎎','d 摆好的娃娃'), W('toy','玩具','🧸','t+oy：玩具'), W('teddy bear','泰迪熊','🐻','teddy 音译"泰迪"——泰迪熊'), W('yo-yo','悠悠球','🪀','y o y o，像球甩上甩下！'),
    W('bike','自行车','🚲','b 两个轮子 + ke：自行车'), W('robot','机器人','🤖','ro + bot：机器人'), W('puzzle','拼图','🧩','pu + zzle：拼图要琢磨'), W('plane','飞机','✈️','p 平稳飞行的 plane'),
    W('boat','小船','⛵','b 木板船'), W('car','小汽车','🚗','c 小手握住方向盘，嘀嘀！'), W('balloon','气球','🎈','b + alloon：气球鼓鼓'),
    W('game','游戏','🎮','g 哥俩做游戏'), W('swing','秋千','','s 蛇形摆动的秋千'), W('slide','滑梯','🛝','slide 就是"滑"——滑梯'), W('scooter','踏板车','🛴','sc 蹬地滑走的踏板车') ]},
]},

{ id: 'g2', name: '二年级', emoji: '🌿', themes: [
  { id: 'num2', name: '数字 11-20', emoji: '🔟', color: '#9B72FF', pos: 'num', tip: '💡 规律：13-19 都加 teen，20 用 ty！', words: [
    W('eleven','十一','1️⃣1️⃣','e + leven：11'), W('twelve','十二','1️⃣2️⃣','tw 二家族（two）：12'), W('thirteen','十三','1️⃣3️⃣','thir 三 + teen：3+teen=13'),
    W('fourteen','十四','1️⃣4️⃣','four 四 + teen：14'), W('fifteen','十五','1️⃣5️⃣','fif 五 + teen：15'), W('sixteen','十六','1️⃣6️⃣','six 六 + teen：16'),
    W('seventeen','十七','1️⃣7️⃣','seven 七 + teen：17'), W('eighteen','十八','1️⃣8️⃣','eight 八 + teen：18'), W('nineteen','十九','1️⃣9️⃣','nine 九 + teen：19'),
    W('twenty','二十','2️⃣0️⃣','twen 二 + ty：20'), W('hundred','百','💯','h + undred：一百'), W('thousand','千','🔢','th + ousand：一千') ]},
  { id: 'fruit', name: '水果', emoji: '🍎', color: '#6BCB77', pos: 'n', words: [
    W('apple','苹果','🍎','a 小鸟——小鸟最爱吃大苹果！'), W('banana','香蕉','🍌','ba + nana：一串 nana'),
    W('pear','梨','🍐','p 梨形的小肚子'), W('peach','桃子','🍑','p 小手掌捧蜜桃'), W('grape','葡萄','🍇','g 一串串葡萄'),
    W('watermelon','西瓜','🍉','water 水 + melon 瓜：水汪汪的大瓜'), W('strawberry','草莓','🍓','straw 稻草 + berry 莓：垫着稻草的莓'),
    W('pineapple','菠萝','🍍','pine 松 + apple 果：像松果的果'), W('lemon','柠檬','🍋','l 柠檬瓣瓣'), W('mango','芒果','🥭','m 山坡上的芒果'),
    W('cherry','樱桃','🍒','ch 成对的樱桃'), W('kiwi','猕猴桃','🥝','kiwi 几维鸟——猕猴桃像它的蛋'), W('coconut','椰子','🥥','coco + nut 坚果：椰子'),
    W('melon','甜瓜','🍈','m + elon：瓜'), W('blueberry','蓝莓','🫐','blue 蓝 + berry 莓：蓝色的莓'), W('fruit','水果','🍏','f + ruit：树上结的果') ]},
  { id: 'food', name: '食物', emoji: '🍽️', color: '#FF9F45', pos: 'n', words: [
    W('egg','鸡蛋','🥚','e 小眼睛开头的词'), W('rice','米饭','🍚','r 一粒一粒的米'), W('noodle','面条','🍜','n 面条打了个结'),
    W('bread','面包','🍞','br 烤面包的香味'), W('cake','蛋糕','🎂','c 小手捧来的蛋糕'), W('milk','牛奶','🥛','m 妈妈冲的牛奶'),
    W('water','水','💧','w 水波——"水"的单词就是 w 开头！'), W('juice','果汁','🧃','j 果汁 jumpty 跳'),
    W('tea','茶','🍵','谐音"替"——替你倒杯茶'), W('hamburger','汉堡包','🍔','ham 火腿 + burger 堡：夹火腿的堡'), W('hot dog','热狗','🌭','hot 热 + dog 狗：热狗'),
    W('French fries','薯条','🍟','French 法国 + fries 炸：法式炸薯条'), W('breakfast','早餐','🌅','break 打破 + fast 斋：打破一夜禁食的第一餐'), W('lunch','午餐','🌞','l + unch：午饭'),
    W('dinner','晚餐','🌃','d 桌子底下也藏着 dinner'), W('food','食物','🍽️','f 手捧食物'), W('chicken','鸡肉','🍗','chick 小鸡 + en：鸡'),
    W('beef','牛肉','🥩','谐音"必富"——吃牛肉必富'), W('pork','猪肉','🥓','p 圆滚滚的小猪 → 猪肉'), W('soup','汤','🥣','s 蛇形的热气：汤'),
    W('dumpling','饺子','🥟','d 揉面团包饺子'), W('mooncake','月饼','🥮','moon 月 + cake 饼：月亮饼'), W('candy','糖果','🍬','c 甜甜的糖罐'), W('sweet','甜的','🍯','s 蛇尝到甜头绕圈圈'),
    W('chocolate','巧克力','🍫','音译"巧克力"—— choc+o+late'), W('biscuit','饼干','🍪','bis + cuit：脆脆饼干'), W('porridge','粥','🍲','p 小勺搅呀搅的粥') ]},
  { id: 'clothes', name: '衣服', emoji: '👕', color: '#FF8FAB', pos: 'n', words: [
    W('shirt','衬衫','👔','sh + irt：衬衫'), W('T-shirt','T恤','👕','衣服摊开就是字母 T'), W('dress','连衣裙','👗','d 裙摆转圈圈'), W('skirt','短裙','👚','sk 旋转的短裙'),
    W('pants','裤子','👖','p 两条裤腿'), W('shorts','短裤','🩳','short 短 + s：短裤'), W('coat','大衣','🧥','c 裹紧的大衣'), W('sweater','毛衣','🧶','s + weater：暖暖毛衣'),
    W('jacket','夹克','🥼','音译"夹克"——ja+cket'), W('hat','帽子','🎩','h 高高的帽子 h 开头！'), W('cap','鸭舌帽','🧢','c 扣在头上的鸭舌帽'),
    W('shoe','鞋','👟','sh + oe：一双鞋'), W('sock','袜子','🧦','s 蛇形的长袜'), W('clothes','衣服','🧺','cl + othes：衣服'),
    W('scarf','围巾','🧣','sc 绕两圈的围巾'), W('glove','手套','🧤','glove 爱（love）戴手套：g+love'), W('belt','皮带','🪢','b 束紧的皮带'), W('button','纽扣','🔘','but + ton：小纽扣') ]},
  { id: 'home', name: '我的家', emoji: '🏠', color: '#4EC5F1', pos: 'n', words: [
    W('home','家','🏠','h 温暖的家'), W('house','房子','🏡','h + ouse：小房子'), W('door','门','🚪','d 推开的门'), W('window','窗户','🪟','wind 风 + ow：通风的窗'),
    W('bed','床','🛏️','b 和 d 像床两头的挡板，e 在中间睡大觉'), W('table','桌子','🪑','t 平平的桌面'),
    W('sofa','沙发','🛋️','音译"沙发"——so+fa'), W('lamp','台灯','💡','l 长长的灯杆'), W('kitchen','厨房','🍳','k 厨房里的锅碗'), W('bedroom','卧室','🛌','bed 床 + room 房：放床的房'),
    W('bathroom','浴室','🛁','bath 洗澡 + room 房：洗澡的房'), W('living room','客厅','📺','living 起居 + room 房：起居室'), W('garden','花园','🌷','g 花园里的鸽子'), W('garage','车库','🚗','gara + ge：车住的小屋'),
    W('floor','地板','🧹','fl 扫干净的地板'), W('wall','墙','🧱','w 靠墙站好') ]},
  { id: 'nature1', name: '大自然', emoji: '🌳', color: '#6BCB77', pos: 'n', words: [
    W('sun','太阳','☀️','s 小蛇晒太阳，暖和得咝咝叫'), W('moon','月亮','🌙','m 大山——两座山上挂着月亮'),
    W('star','星星','⭐','st + ar：一闪一闪'), W('sky','天空','🌤️','sk 高高的天空'), W('cloud','云','☁️','cl 棉花团云'), W('rain','雨','🌧️','r 小草——雨水浇得小草嗖嗖长'),
    W('snow','雪','❄️','sn + ow：雪花'), W('wind','风','🌬️','w 水波被吹成了风'), W('tree','树','🌳','t 像小树苗'), W('flower','花','🌸','fl 飞来的花香'),
    W('grass','草','🌱','r 小草往上长'), W('river','河','🏞️','r 弯弯的河流'), W('mountain','大山','⛰️','M 大山本山！'),
    W('sea','大海','🌊','s 大海蛇'), W('fire','火','🔥','f 小手——火苗像手指在跳舞'), W('leaf','树叶','🍃','l 长长的叶脉'),
    W('stone','石头','🪨','st 硬邦邦的石头') ]},
  { id: 'action1', name: '动作', emoji: '🤸', color: '#FFD93D', pos: 'v', words: [
    W('eat','吃','🍽️','e 张嘴吃'), W('drink','喝','🥤','d 低头喝'), W('sing','唱歌','🎤','s 唱歌像蛇摇摆'), W('dance','跳舞','💃','d 踢踏起舞'),
    W('read','读书','📚','r 翻页读书'), W('write','写','✍️','w 开头 w 不发音！write 写'), W('draw','画画','🎨','d 低头画画'), W('fly','飞','🕊️','f 小手变成翅膀——飞！'),
    W('walk','走路','🚶','w 走路像水波起伏'), W('run','跑','🏃','r 小草使劲长——跑起来！'), W('jump','跳','🤸','j 鱼钩甩出去——蹦！'),
    W('swim','游泳','🏊','s 小蛇扭扭——游泳像小蛇！'), W('sleep','睡觉','😴','s 蛇盘着睡'), W('cry','哭','😢','c 哭出的弯弯泪'),
    W('laugh','笑','😂','l 笑得直不起腰'), W('listen','听','👂','l 侧耳听'), W('look','看','👀','l 长腿站起来看'), W('open','打开','📂','o 打开圆嘴'),
    W('close','关上','📁','c 关门锁'), W('play','玩','🎾','p 手掌拍球玩'), W('wash','洗','🧼','w 水波——用水 wash 洗手手'), W('talk','说话','💬','t 话筒说话！') ]},
  { id: 'time1', name: '时间', emoji: '⏰', color: '#9B72FF', pos: 'n', words: [
    W('day','天','📅','d 一天天过去'), W('week','星期','🗓️','w 一周的水波'), W('today','今天','📍','to + day：到今天'), W('tomorrow','明天','➡️','to + morrow：到明天'),
    W('yesterday','昨天','⬅️','yester + day：昨天'), W('now','现在','⏱️','n + ow：此刻'), W('early','早','🌅','ear 耳朵起得早'), W('late','晚','🌙','l 拖到很晚'),
    W("o'clock","点钟","🕐","of the clock 缩成 o'clock：几点钟"), W('hour','小时','⏰','h 开头 h 不发音！读"傲儿"'), W('minute','分钟','⏲️','m in + ute：一分钟'), W('tonight','今晚','🌃','to + night：到今晚') ]},
  { id: 'weather1', name: '天气', emoji: '🌤️', color: '#4EC5F1', pos: 'adj', words: [
    W('hot','热','🥵','h 高——热气往上飘！'), W('cold','冷','🥶','c 冷得缩起来'), W('warm','温暖','🌞','w 暖暖的水波'), W('cool','凉爽','🍃','c 凉凉的风'),
    W('sunny','晴朗','☀️','sun 太阳 + ny：阳光的'), W('rainy','下雨','🌧️','rain 雨 + y：多雨的'), W('windy','刮风','💨','wind 风 + y：多风的'), W('snowy','下雪','🌨️','snow 雪 + y：下雪的'),
    W('cloudy','多云','⛅','cloud 云 + y：多云的'), W('fine','晴好','🙂','f 好天气'), W('raincoat','雨衣','🧥','rain 雨 + coat 外衣：挡雨的衣'), W('umbrella','雨伞','☂️','u 开头——圆圆的雨伞') ]},
  { id: 'shape', name: '形状', emoji: '🔷', color: '#FF6B6B', pos: 'n', words: [
    W('circle','圆形','⭕','cir + cle：圈圈'), W('square','正方形','🟥','squ + are：方方正正'), W('triangle','三角形','🔺','tri 三 + angle 角：三个角'),
    W('rectangle','长方形','📐','rect + angle 角：拉长的角'), W('heart','心形','💖','hear 听 + t：心里听着爱'), W('diamond','菱形','💎','dia + mond：钻石形'),
    W('oval','椭圆形','🥚','o 和 v 拼成椭圆脸'), W('line','线','➖','l 就是长长的线'), W('round','圆的','⚪','r + ound：滚圆'), W('shape','形状','🔷','sh + ape：形状') ]},
]},

{ id: 'g3', name: '三年级', emoji: '🍀', themes: [
  { id: 'vegetable', name: '蔬菜', emoji: '🥕', color: '#6BCB77', pos: 'n', words: [
    W('potato','土豆','🥔','po+ta+to 三个圆滚滚'), W('tomato','西红柿','🍅','和 potato 只差第一个字母！to+ma+to'), W('carrot','胡萝卜','🥕','c 胡萝卜的缨子'), W('cabbage','卷心菜','🥬','cabb 一层一层的菜'),
    W('onion','洋葱','🧅','on-i-on 层层叠叠'), W('pepper','辣椒','🌶️','p 辣椒尖尖'), W('cucumber','黄瓜','🥒','cu 黄瓜弯曲'), W('bean','豆子','🫘','b 豆荚板子'),
    W('pea','豌豆','🫛','pea 只有一个 p：小豌豆'), W('corn','玉米','🌽','c 玉米粒粒'), W('pumpkin','南瓜','🎃','p 圆滚滚南瓜'), W('eggplant','茄子','🍆','egg 蛋 + plant 植物：蛋形植物'),
    W('mushroom','蘑菇','🍄','m + ush + room：蘑菇的小房间'), W('vegetable','蔬菜','🥦','v 胜利地吃蔬菜') ]},
  { id: 'animal2', name: '更多动物', emoji: '🦊', color: '#FF9F45', pos: 'n', words: [
    W('horse','马','🐴','h 高大的马'), W('goat','山羊','🐐','g 咩——山羊'), W('fox','狐狸','🦊','结尾剪刀 x——狐狸尾巴'), W('wolf','狼','🐺','w 狼嚎'),
    W('deer','鹿','🦌','d 低头喝水的鹿'), W('snake','蛇','🐍','s 小蛇本蛇！'), W('frog','青蛙','🐸','fr 呱呱'),
    W('turtle','乌龟','🐢','t 缩头乌龟'), W('butterfly','蝴蝶','🦋','butter 黄油 + fly 飞：黄油翅膀的飞虫'), W('bee','蜜蜂','🐝','b 嗡嗡'), W('ant','蚂蚁','🐜','a 小小的蚂蚁'),
    W('spider','蜘蛛','🕷️','sp 织网的蜘蛛'), W('bat','蝙蝠','🦇','和球棒 bat 同一个词！'), W('parrot','鹦鹉','🦜','p 鹦鹉学舌'),
    W('hippo','河马','🦛','hip + po：胖河马'), W('camel','骆驼','🐫','c 驼峰像 c'), W('kangaroo','袋鼠','🦘','k 蹦跳的袋鼠'), W('penguin','企鹅','🐧','pen 笔 + guin：摇笔的企鹅') ]},
  { id: 'classroom', name: '课堂用语', emoji: '📖', color: '#9B72FF', pos: 'v', words: [
    W('word','单词','🔤','w 一个一个词'), W('sentence','句子','📝','sent + ence：句子'), W('question','问题','❓','qu 手拉手提问'), W('answer','回答','✅','an + swer：举手回答'),
    W('learn','学习','🧠','l 学到长长本领'), W('teach','教','👩‍🏫','t 话筒——老师 teach 教书'), W('say','说','💬','s 说句话'),
    W('speak','讲话','🗣️','sp 大声讲'), W('tell','告诉','📢','t 话筒告诉你'), W('ask','问','🙋','a 问一问'),
    W('understand','明白','💡','under 下面 + stand 站：站在下面听明白了'), W('remember','记住','💭','re 再 + member 成员：再次想起'), W('forget','忘记','🌀','for + get 拿：拿忘了'),
    W('know','知道','🤓','kn 开头 k 不发音！know 知道'), W('spell','拼写','🔍','sp 拼出来'),
    W('copy','抄写','✍️','c 抄一份'), W('mistake','错误','❌','mis 错 + take 拿：拿错了'), W('text','课文','📄','t 话筒读课文'), W('notebook','笔记本','📓','note 笔记 + book 本'),
    W('dictionary','词典','📕','dict 说 + ionary：说话的工具书') ]},
  { id: 'sport', name: '运动', emoji: '⚽', color: '#FFD93D', pos: 'n', words: [
    W('football','足球','⚽','foot 脚 + ball 球：用脚踢的球'), W('basketball','篮球','🏀','basket 篮 + ball 球：投进篮的球'), W('ping-pong','乒乓球','🏓','音译"乒乓"——ping+pong'),
    W('baseball','棒球','⚾','base 垒 + ball 球：跑垒的球'), W('skate','滑冰','⛸️','sk 滑起来'), W('ski','滑雪','🎿','s 蛇形滑道'),
    W('ride','骑','🚴','r 跨上去骑'), W('climb','爬','🧗','cl 手脚并用爬（b 不发音！）'), W('throw','扔','🤾','th 用力扔'),
    W('catch','接住','🥅','c 小手抓——catch 抓住！'), W('kick','踢','🦶','K 踢腿踢球！'), W('race','比赛','🏁','r 跑得飞快的比赛'),
    W('winner','获胜者','🏅','win 赢 + ner 人：赢的人'), W('hike','徒步','🥾','h 翻山徒步'), W('yoga','瑜伽','🧘','音译"瑜伽"——yo+ga'), W('golf','高尔夫','⛳','音译"高尔夫"——golf') ]},
  { id: 'transport', name: '交通', emoji: '🚌', color: '#4EC5F1', pos: 'n', words: [
    W('bus','公交车','🚌','大肚子的公交车，u 在唱歌'), W('taxi','出租车','🚕','谐音"的士"——taxi 出租车'), W('train','火车','🚂','t 铁轨说话：哐当'),
    W('subway','地铁','🚇','sub 地下 + way 路：地下铁路'), W('helicopter','直升机','🚁','heli 盘旋 + copter：直升机'), W('ship','轮船','🚢','sh 大轮船'),
    W('jeep','吉普车','🚙','音译"吉普"——jeep'), W('van','面包车','🚐','v 开头——v 胜利出发！'), W('truck','卡车','🚚','tr 大卡车'),
    W('ambulance','救护车','🚑','am + bu + lance：救护车呜哇'), W('traffic','交通','🚦','tr 车来车往'), W('road','马路','🛣️','r 长长的路'),
    W('street','街道','🏘️','str 街道直直'), W('bridge','桥','🌉','br 架起的桥'), W('station','车站','🚉','st 站台'), W('airport','机场','🛫','air 空气 + port 港：航空港') ]},
  { id: 'position', name: '方位', emoji: '🧭', color: '#FF6B6B', pos: 'prep', words: [
    W('in','在里面','','i 小人钻进里'), W('on','在上面','','o 在上面画圈'), W('under','在下面','','un + der：在下面'), W('behind','在后面','','be + hind：跟在后面'),
    W('beside','在旁边','','be + side 边：在旁边'), W('near','在附近','','n + ear 耳朵：近到听得见'), W('over','在上方','','o 从上方越过'), W('above','在上面','','ab + ove：在上方'),
    W('below','在下面','','be + low 低：在低处'), W('front','前面','⏩','fr 冲在前面'), W('back','后面','⏪','b 背后'), W('left','左边','⬅️','l 手的左边（left hand）'),
    W('right','右边','➡️','r 右手 right'), W('middle','中间','🎯','mid 中间 + dle：正中'), W('here','这里','📍','h 高高举这里'), W('there','那里','📌','th 指向那里') ]},
  { id: 'week', name: '星期', emoji: '📅', color: '#FF9F45', pos: 'n', words: [
    W('Monday','星期一','1️⃣','Mon + day：星期一（Moon 月亮日）'), W('Tuesday','星期二','2️⃣','Tues + day：星期二'), W('Wednesday','星期三','3️⃣','Wednes + day：星期三（拼最长！）'),
    W('Thursday','星期四','4️⃣','Thurs + day：星期四'), W('Friday','星期五','5️⃣','Fri + day：星期五（周末前！）'), W('Saturday','星期六','6️⃣','Satur + day：星期六'),
    W('Sunday','星期日','7️⃣','Sun 太阳 + day：太阳日'), W('weekend','周末','🎉','week 周 + end 尾：一周的尾巴'), W('weekday','工作日','💼','week 周 + day 天：上学的天'), W('birthday','生日','🎂','birth 出生 + day 日：出生的日子') ]},
  { id: 'adj1', name: '描述一', emoji: '🔍', color: '#9B72FF', pos: 'adj', words: [
    W('big','大的','🐘','b 大大的肚子'), W('small','小的','🐜','sm 小小的'), W('long','长的','🦒','l 长颈鹿的脖子'), W('short','短的/矮的','📏','sh + ort：短'),
    W('tall','高的','🏗️','t 高高的塔'), W('fast','快的','💨','f 飞快'), W('slow','慢的','🐢','sl 蜗牛慢慢'), W('new','新的','✨','n 崭新的'),
    W('young','年轻的','🌱','y 年轻的枝丫'), W('cute','可爱的','🥰','c 可爱 cute'), W('pretty','漂亮的','🌸','pr 漂亮'), W('beautiful','美丽的','💐','beau + ti + ful：美丽（beauty 美 + ful）'),
    W('happy','开心的','😄','h 高兴得跳高'), W('sad','难过的','😢','s 蔫了的小草'), W('angry','生气的','😠','angry 鼓着腮帮子'), W('glad','高兴的','😊','gl 发光的高兴') ]},
]},

{ id: 'g4', name: '四年级', emoji: '🌻', themes: [
  { id: 'job', name: '职业', emoji: '👩‍⚕️', color: '#FF6B6B', pos: 'n', tip: '💡 规律：动词 + er / ist = "…的人"！', words: [
    W('doctor','医生','👨‍⚕️','d 挂号的医生'), W('nurse','护士','👩‍⚕️','n 细心的护士'), W('driver','司机','🧑‍✈️','drive 开车 + er 人：开车的人'), W('cook','厨师','👩‍🍳','c 掌勺的厨师'),
    W('farmer','农民','👨‍🌾','farm 农场 + er 人：种田的人'), W('policeman','警察','👮','police 警 + man 人：警察'), W('worker','工人','👷','work 工作 + er 人：工作的人'), W('singer','歌手','🎤','sing 唱 + er 人：唱歌的人'),
    W('dancer','舞蹈家','💃','dance 跳 + er 人：跳舞的人'), W('writer','作家','✍️','write 写 + er 人：写作的人'), W('pilot','飞行员','👨‍✈️','p 飞行员'), W('scientist','科学家','🔬','science 科学 + ist 家：科学家'),
    W('dentist','牙医','🦷','dent 牙 + ist 家：牙医'), W('waiter','服务员','🍽️','wait 等候 + er 人：端菜的人'), W('vet','兽医','🐕','v 胜利守护小动物'), W('coach','教练','🥇','c 带队教练'),
    W('artist','画家','🎨','art 艺术 + ist 家：艺术家'), W('job','工作','💼','j 敲章上班') ]},
  { id: 'place', name: '场所', emoji: '🏢', color: '#4EC5F1', pos: 'n', words: [
    W('park','公园','🌳','p 散步的公园'), W('zoo','动物园','🦁','z 开头跑得快！'), W('shop','商店','🏪','sh 逛商店'), W('store','店铺','🏬','st 大商店'),
    W('supermarket','超市','🛒','super 超级 + market 市场：超级市场'), W('hospital','医院','🏥','h 医院高高'), W('farm','农场','🚜','f 农场干活'), W('library','图书馆','📚','libr + ary：图书馆（r 两个都要读）'),
    W('cinema','电影院','🎦','c 看电影'), W('museum','博物馆','🏛️','m + useum：博物馆'), W('hotel','旅馆','🏨','h 住旅馆'), W('restaurant','餐馆','🍽️','rest 休息 + aurant：吃饭休息的地方'),
    W('bank','银行','🏦','b 银行的柜台'), W('post office','邮局','📮','post 邮 + office 局：邮局'), W('playground','操场','🛝','play 玩 + ground 场：玩耍的场地'), W('city','城市','🏙️','c 大城市'),
    W('village','乡村','🏡','v 安静的村庄'), W('town','城镇','🏘️','t 小镇'), W('country','国家','🗺️','c 我们的 country'), W('world','世界','🌍','w 大大的世界') ]},
  { id: 'subject', name: '学科', emoji: '📚', color: '#9B72FF', pos: 'n', words: [
    W('Chinese','语文','🀄','Chin 中国 + ese 语：中国的语言'), W('English','英语','🔠','Engl + ish：英语'), W('math','数学','➗','m 算术'), W('music','音乐','🎵','m 音乐课'),
    W('art','美术','🖌️','a + r + t：三笔画画'), W('PE','体育','⚽','Physical Education 缩写：体育'), W('science','科学','🔬','sc 科学'), W('computer','电脑','💻','com + put + er：计算机'),
    W('lesson','课','📖','l 一课一课'), W('homework','作业','📝','home 家 + work 功课：带回家的功课'), W('subject','学科','📚','sub + ject：科目'), W('classmate','同学','🎒','class 班 + mate 伙伴：同班伙伴'),
    W('test','测验','✍️','t 测验'), W('grade','年级','🎖️','gr 年级') ]},
  { id: 'month', name: '月份', emoji: '🗓️', color: '#FF9F45', pos: 'n', tip: '💡 规律：九至十二月都以 -ber 结尾！', words: [
    W('January','一月','1️⃣','Jan 开头：一月'), W('February','二月','2️⃣','Feb：二月（天数最少的月！）'), W('March','三月','3️⃣','Mar：三月春行军'), W('April','四月','4️⃣','A + pril：四月'),
    W('May','五月','5️⃣','May 最短最好记：五月'), W('June','六月','6️⃣','June：六月'), W('July','七月','7️⃣','July：七月放暑假'), W('August','八月','8️⃣','Au + gust：八月酷暑'),
    W('September','九月','9️⃣','Septem + ber：九月开学'), W('October','十月','🔟','Octo + ber：十月'), W('November','十一月','1️⃣1️⃣','Novem + ber：十一月'), W('December','十二月','1️⃣2️⃣','Decem + ber：十二月年末'),
    W('month','月份','🗓️','m 一月月'), W('year','年','🎆','y 一年年') ]},
  { id: 'season', name: '季节', emoji: '🍂', color: '#FFD93D', pos: 'n', words: [
    W('spring','春天','🌸','spr 弹出嫩芽：春天'), W('summer','夏天','🌞','sum + mer：夏天'), W('autumn','秋天','🍁','au + tumn：秋天（n 不发音！）'), W('fall','秋天(美式)','🍂','fall 落叶：叶落的季节'),
    W('season','季节','🔄','sea + son：季节轮换'), W('weather','天气','🌤️','w 看天气'), W('storm','暴风雨','⛈️','st 风暴'), W('fog','雾','🌫️','f 雾像轻纱'),
    W('ice','冰','🧊','i 小冰晶'), W('dry','干的','🏜️','dr 干燥'), W('wet','湿的','💦','w 水波的 wet'), W('shower','阵雨','🌦️','show + er：说下就下的雨'),
    W('temperature','温度','🌡️','tempera + ture：温度'), W('degree','度数','🌡️','de + gree：几度') ]},
  { id: 'household', name: '生活用品', emoji: '🥢', color: '#6BCB77', pos: 'n', words: [
    W('cup','杯子','🥤','结尾藏着 u 小杯子——这个 u 只帮你联想记词'), W('plate','盘子','🍽️','pl 平盘'), W('bowl','碗','🥣','b 碗底'), W('chopsticks','筷子','🥢','chop 砍 + sticks 小棍：砍柴小棍当筷子'),
    W('spoon','勺子','🥄','sp 勺子舀'), W('fork','叉子','🍴','f 手拿叉'), W('knife','刀','🔪','kn 开头 k 不发音！knife 刀'),
    W('fridge','冰箱','🧊','fr + idge：冰箱'), W('clock','钟','🕰️','cl 滴答钟'), W('watch','手表','⌚','watch 看——看时间的手表'), W('mirror','镜子','🪞','mir + ror：照镜子'),
    W('towel','毛巾','🧻','tow + el：毛巾'), W('toothbrush','牙刷','🪥','tooth 牙 + brush 刷：刷牙的刷'), W('soap','香皂','🧼','s 滑滑的皂'), W('comb','梳子','💇','comb 梳子（b 不发音！）'), W('key','钥匙','🔑','y 举手接过钥匙') ]},
  { id: 'feeling', name: '感觉', emoji: '😊', color: '#FF8FAB', pos: 'adj', words: [
    W('tired','累的','😪','tir + ed：累了'), W('thirsty','渴的','🥵','th 渴得吐舌'), W('hungry','饿的','😋','h 肚子空空'), W('full','饱的','😐','f 吃得满满'),
    W('afraid','害怕的','😨','a + fraid：害怕'), W('worried','担心的','😟','wor + ried：担心'), W('excited','兴奋的','🤩','ex + cit + ed：兴奋'), W('bored','无聊的','🥱','bor + ed：好无聊'),
    W('surprised','惊讶的','😲','sur + prised：惊讶'), W('proud','自豪的','😎','pr + oud：自豪'), W('shy','害羞的','😳','sh 躲起来害羞'), W('lonely','孤单的','🥺','l 一个人的孤单'),
    W('feel','感觉','🫶','f 手摸心口感觉'), W('smile','微笑','😊','s + mile 一英里的微笑'), W('calm','平静的','😌','c + alm：平静（l 不发音！）'), W('tear','眼泪','💧','t + ear 耳边滑落的泪') ]},
  { id: 'verb2', name: '动词二', emoji: '🤝', color: '#FF6B6B', pos: 'v', tip: '💡 规律：give / take / like / make 里都藏着一对好搭档元音！', words: [
    W('help','帮助','🤝','h 高手帮忙'), W('give','给','🤲','g 递过去'), W('get','得到','🎁','g 接过来'), W('take','拿走','📦','t 拿走'),
    W('bring','带来','🫳','br 带来'), W('put','放','🫸','p 放下'), W('pick','捡','🤏','p 手指捏起'), W('find','找到','🔍','f 找到了'),
    W('lose','丢失','😵','l 遛丢了'), W('win','赢','🏆','w 胜利 win'), W('want','想要','🙋','w 想要'), W('need','需要','❗','n 需要它'),
    W('like','喜欢','❤️','l 心里喜欢'), W('love','爱','💖','l 满满的爱'), W('have','有','🫴','h 手里有'), W('do','做','🛠️','d 动手做'),
    W('make','制作','🔨','m 做出来'), W('go','去','🚶','g 走') ]},
  { id: 'adj2', name: '描述二', emoji: '⚖️', color: '#4EC5F1', pos: 'adj', words: [
    W('clean','干净的','🧼','cl 擦得亮'), W('dirty','脏的','🧽','d 脏脏的'), W('quiet','安静的','🤫','qui + et：嘘——安静'), W('loud','大声的','🔊','l 大声喊'),
    W('heavy','重的','🏋️','he + avy：重'), W('light','轻的','🪶','l 轻飘飘'), W('hard','难的','🧱','h 硬邦邦的难'), W('easy','容易的','😌','ea 容易'),
    W('strong','强壮的','💪','str 强壮'), W('weak','虚弱的','🍂','w 弱弱'), W('rich','富有的','💰','r 富有'), W('poor','贫穷的','🪙','p 穷'),
    W('famous','著名的','🌟','fam + ous：有名'), W('delicious','美味的','😋','de + licious：好吃'), W('favourite','最喜欢的','❤️','favour 喜爱 + ite 最：最爱'), W('wonderful','精彩的','🎉','wonder 奇妙 + ful：精彩'),
    W('busy','忙的','😤','b 忙忙'), W('free','空闲的','🆓','fr 自由空闲') ]},
]},

{ id: 'g5', name: '五年级', emoji: '🍁', themes: [
  { id: 'health', name: '健康', emoji: '💊', color: '#6BCB77', pos: 'n', words: [
    W('health','健康','💚','heal 治愈 + th：健康'), W('healthy','健康的','🥗','health 健康 + y：健康的'), W('exercise','锻炼','🏃','ex + er + cise：锻炼'), W('sick','生病的','🤒','s 蔫了生病'),
    W('ill','病的','🤒','i 小人躺下病了'), W('fever','发烧','🌡️','f 烫烫的发烧'), W('headache','头疼','🤕','head 头 + ache 痛：头痛'), W('medicine','药','💊','med + icine：药'),
    W('rest','休息','😴','r 歇一歇'), W('hurt','受伤','🩹','h 碰疼了'), W('pain','疼痛','😖','p 疼'), W('sweat','汗水','💧','盐+水是咸水，sweat 也是 w 水家族'),
    W('yawn','打哈欠','🥱','y 张大嘴打哈欠'), W('vitamin','维生素','🥕','v + ita + min：维他命（音译）'), W('body','身体','🧍','b 身体'), W('safe','安全的','🦺','s 平安') ]},
  { id: 'city2', name: '城市乡村', emoji: '🏙️', color: '#4EC5F1', pos: 'n', words: [
    W('building','大楼','🏢','build 建造 + ing：建起来的楼'), W('tower','塔','🗼','tow + er：高塔'), W('corner','角落','📐','corn 角 + er：角落'), W('block','街区','🏘️','bl 一块街区'),
    W('map','地图','🗺️','m 折叠的地图'), W('east','东方','➡️','ea 太阳从东方升起'), W('west','西方','⬅️','w 太阳落进西方'), W('north','北方','⬆️','n 指北针'),
    W('south','南方','⬇️','s 蛇往南爬'), W('direction','方向','🧭','direct 指引 + ion：方向'), W('capital','首都','🏛️','cap 首要 + ital：首要之城'), W('fountain','广场喷泉','⛲','fount 泉 + ain：喷泉'),
    W('hill','小山','⛰️','h 高高的小山'), W('lake','湖','🏞️','l 长长的湖'), W('field','田野','🌾','f 田野'), W('forest','森林','🌲','fore 前 + st 树：前面都是树') ]},
  { id: 'travel', name: '旅行', emoji: '🧳', color: '#FF9F45', pos: 'n', words: [
    W('travel','旅行','✈️','tr 走走的旅行'), W('trip','旅程','🚗','tr 短途 trip'), W('tour','观光','🗺️','t + our 我们的观光'), W('visit','参观','🚪','vis 看 + it：去看'),
    W('ticket','票','🎫','t 车票'), W('suitcase','行李箱','🧳','suit 西装 + case 箱：装衣服的箱'), W('passport','护照','🛂','pass 通行 + port 港：通行证'), W('luggage','行李','📦','lug 拖 + gage：拖着的行李'),
    W('beach','海滩','🏖️','b 海边沙滩'), W('island','岛','🏝️','is + land 陆地：岛（s 不发音！）'), W('camp','露营','⛺','c 扎营'), W('photo','照片','📷','ph 读 f！photo 照片'),
    W('vacation','度假','🌴','va + cation：假期'), W('journey','旅途','🛤️','j + our + ney：旅途'), W('pack','打包','🎒','p 收拾背包'), W('passport photo','证件照','🪪','passport 护照 + photo 照') ]},
  { id: 'nature2', name: '自然探索', emoji: '🌏', color: '#6BCB77', pos: 'n', words: [
    W('earth','地球','🌍','ear 耳朵形状的地球'), W('planet','行星','🪐','plan 计划 + et：行星按计划转'), W('space','太空','🌌','sp 太空'), W('rock','岩石','🪨','r 硬石头'),
    W('sand','沙子','🏖️','s 细细的沙'), W('plant','植物','🪴','pl 种植物'), W('wood','木头','🪵','w 木头'), W('air','空气','🌬️','a 空气'),
    W('smoke','烟','💨','sm 冒烟'), W('rose','玫瑰','🌹','r 玫瑰'), W('bamboo','竹子','🎍','bam + boo：竹节 boo'), W('cave','山洞','🕳️','c + ave：洞（v 藏在洞里）'),
    W('volcano','火山','🌋','vol + cano：火山'), W('desert','沙漠','🏜️','和甜点 dessert 只差一个 s！'), W('jungle','丛林','🌴','j 钩子藤蔓的丛林'), W('nature','大自然','🌿','n 大自然') ]},
  { id: 'ocean', name: '海洋世界', emoji: '🐬', color: '#4EC5F1', pos: 'n', words: [
    W('whale','鲸鱼','🐳','w 水波——海里最强壮的 w'), W('dolphin','海豚','🐬','d 跳跃的海豚'), W('shark','鲨鱼','🦈','sh 鲨鱼'),
    W('octopus','章鱼','🐙','oct 八 + pus 脚：八只脚'), W('crab','螃蟹','🦀','c 横着走的螃蟹'), W('shrimp','虾','🦐','sh 弯腰的小虾'), W('seal','海豹','🦭','seal 海里的豹'),
    W('shell','贝壳','🐚','sh 听海的贝壳'), W('seaweed','海草','🌿','sea 海 + weed 草：海里的草'), W('wave','波浪','🌊','W 就是波浪本浪！'),
    W('sail','航行','⛵','s 扬帆'), W('sailor','水手','⚓','sail 航行 + or 人：航行的人'), W('lighthouse','灯塔','🗼','light 灯 + house 房：灯的房子'), W('seaside','海边','🏖️','sea 海 + side 边：海边'),
    W('goldfish','金鱼','🐠','gold 金 + fish 鱼：金色的鱼'), W('starfish','海星','⭐','star 星 + fish 鱼：星星鱼') ]},
  { id: 'verb3', name: '动词三', emoji: '💭', color: '#9B72FF', pos: 'v', words: [
    W('think','思考','💭','th 想一想'), W('guess','猜','🤔','g 猜一猜'), W('decide','决定','🎯','de + cide：下定决心'), W('hope','希望','🌟','h 高高的希望'),
    W('wish','愿望','🌠','w 许愿'), W('dream','梦想','💫','dr 做梦'), W('plan','计划','📋','pl 计划'), W('try','尝试','💪','t 试一试'),
    W('begin','开始','🎬','be + gin：开始'), W('start','出发','🚦','st 出发'), W('finish','完成','🏁','fin 完成 + ish：做完'), W('stop','停止','✋','st 停'),
    W('continue','继续','⏭️','con + tin + ue：继续'), W('mix','混合','🥣','结尾剪刀 x——剪碎混合！'), W('fix','修理','🔧','结尾剪刀 x——修好它！'), W('build','建造','🏗️','b 板子搭建'),
    W('practice','练习','🔁','pr 练习'), W('improve','提高','📈','im + prove：变得更好') ]},
  { id: 'shop2', name: '购物', emoji: '🛒', color: '#FFD93D', pos: 'n', words: [
    W('money','钱','💰','m 揣着钱'), W('yuan','元(人民币)','💵','就是"元"的拼音！'), W('dollar','美元','💲','do + llar：美元'), W('price','价格','🏷️','pr 价签'),
    W('cheap','便宜的','🪙','ch 便宜'), W('expensive','昂贵的','💎','ex + pen + sive：贵到花光笔钱'), W('buy','买','🛒','b 掏钱买'), W('sell','卖','🛍️','s 卖出去'),
    W('pay','付款','💳','p 掌心付钱'), W('cost','花费','💸','c 花费'), W('market','市场','🏪','m 市场'), W('bill','账单','🧾','b 账单'),
    W('gift','礼物','🎁','g 举高礼物'), W('list','清单','📋','l 列清单'), W('size','尺码','📏','s 尺码'), W('customer','顾客','🧍','custom 习惯 + er 人：常来的客人') ]},
  { id: 'media', name: '媒体通讯', emoji: '📺', color: '#FF6B6B', pos: 'n', words: [
    W('TV','电视','📺','T + V：电视缩写'), W('phone','电话','📱','ph 读 f！phone 电话'), W('email','电子邮件','📧','e 电子 + mail 邮件'), W('message','消息','💬','mess + age：消息'),
    W('call','打电话','📞','c 打电话'), W('video','视频','📹','v 视频通话'), W('film','电影','🎬','f 胶片电影'), W('cartoon','动画片','🐭','音译"卡通"——car+toon'),
    W('story','故事','📖','st 讲故事'), W('news','新闻','📰','new 新 + s：新鲜事儿'), W('magazine','杂志','📔','maga + zine：杂志'), W('letter','信','✉️','letter 既是"字母"也是"信"'),
    W('radio','收音机','📻','r 圆圆的收音机'), W('program','节目','🎙️','pro + gram：节目'), W('screen','屏幕','🖥️','scr 屏幕'), W('channel','频道','📡','ch + annel：换频道') ]},
  { id: 'music2', name: '音乐艺术', emoji: '🎵', color: '#FF8FAB', pos: 'n', words: [
    W('piano','钢琴','🎹','p+i+a+n+o 四个键：钢琴'), W('guitar','吉他','🎸','音译"吉他"——gui+tar'), W('violin','小提琴','🎻','v 像琴弓'), W('drum','鼓','🥁','dr 咚咚'),
    W('song','歌曲','🎶','s 唱歌'), W('paint','绘画','🎨','p 拿笔画画'), W('brush','画笔','🖌️','br 画笔'), W('band','乐队','🎺','b 捆在一起的乐队'),
    W('concert','音乐会','🎤','con + cert：音乐会'), W('stage','舞台','🎭','st 站上舞台'), W('magic','魔法','✨','m 神奇魔法'), W('opera','歌剧','🎼','op + era：歌剧'),
    W('color','颜色(美式)','🌈','col + or：颜色'), W('statue','雕像','🗿','stat 站 + ue：站着不动') ]},
  { id: 'adj3', name: '描述三', emoji: '🔬', color: '#9B72FF', pos: 'adj', words: [
    W('correct','正确的','✅','cor + rect：正确'), W('wrong','错误的','❌','wr 开头 w 不发音！wrong 错'), W('true','真的','💯','tr 真的'), W('false','假的','🤥','fal + se：假'),
    W('same','相同的','🟰','s 相同'), W('different','不同的','🔀','diff + erent：不同'), W('tight','紧的','🪢','t 系紧'), W('far','远的','🚀','f 飞得很远'),
    W('deep','深的','🕳️','d 往下深'), W('high','高的','🏔️','h 高'), W('dangerous','危险的','⚠️','danger 危险 + ous：危险的'), W('important','重要的','❗','im + portant：重要'),
    W('interesting','有趣的','🤔','inter + est + ing：有趣'), W('boring','无聊的','😴','bor + ing：无聊'), W('useful','有用的','🛠️','use 用 + ful：有用'), W('special','特别的','🌟','spec + ial：特别') ]},
  { id: 'time2', name: '时间二', emoji: '⏳', color: '#FF9F45', pos: 'n', words: [
    W('age','年龄','🎂','a 年龄'), W('date','日期','📅','d 日期'), W('quarter','一刻钟','📍','qu + arter：四分之一（15分钟）'), W('half','一半','🌗','h 一半（l 不发音！）'),
    W('past','过去','⏪','p 过去'), W('term','学期','📚','t 学期'), W('moment','时刻','⏱️','mo + ment：此刻'), W('period','时期','🗓️','pe + riod：时期'),
    W('noon','正午','🌞','n + oo 两个太阳当空照'), W('midnight','午夜','🌃','mid 中间 + night 夜：夜的中间'), W('century','世纪','🏛️','cen + tury：一百年'), W('future','未来','🚀','f 未来'),
    W('end','结束','🔚','d 结尾就到 end'), W('history','历史','📜','hi + story 故事：历史是过去的故事！') ]},
]},

{ id: 'g6', name: '六年级', emoji: '🎓', themes: [
  { id: 'festival', name: '节日', emoji: '🎉', color: '#FF6B6B', pos: 'n', words: [
    W('festival','节日','🎉','f + e + stival：节日'), W('Christmas','圣诞节','🎄','谐音"克里斯马斯"——圣诞'), W('present','礼物','🎁','pre 提前 + sent 送：提前送来的礼物'), W('party','聚会','🥳','p 开派对'),
    W('candle','蜡烛','🕯️','c 蜡烛'), W('firework','烟花','🎆','fire 火 + work 作：火在工作的花'), W('lantern','灯笼','🏮','l 灯笼杆'), W('dragon','龙','🐉','dr 中国龙'),
    W('celebrate','庆祝','🎊','cele + brate：庆祝'), W('New Year','新年','🎇','new 新 + year 年'), W('Christmas tree','圣诞树','🎄','Christmas 圣诞 + tree 树'), W('firecracker','鞭炮','🧨','fire 火 + cracker 爆：火爆竹'),
    W('invite','邀请','💌','in 请进来 + vite：邀请'), W('prepare','准备','📋','pre 提前 + pare 备好：提前准备') ]},
  { id: 'country', name: '国家语言', emoji: '🗺️', color: '#4EC5F1', pos: 'n', words: [
    W('China','中国','🇨🇳','Chin 中国：我们的国家'), W('America','美国','🇺🇸','A + me + ri + ca：美国'), W('England','英国','🇬🇧','Eng + land 土地：英国'), W('Australia','澳大利亚','🇦🇺','Au + stralia：澳洲'),
    W('Canada','加拿大','🇨🇦','音译"加拿大"——Ca+na+da'), W('Japan','日本','🇯🇵','Ja + pan：日本'), W('France','法国','🇫🇷','Fr + ance：法国'), W('language','语言','🗣️','langu + age：语言'),
    W('flag','旗帜','🚩','fl 飘扬的旗'), W('people','人们','👥','p 一群人'), W('person','人','🧍','per 每 + son 人：每个人'), W('foreign','外国的','🌍','for 外 + eign：外国的'),
    W('abroad','国外','✈️','a + broad 宽广：去更宽的世界'), W('foreigner','外国人','🧑','foreign 外国 + er 人'), W('culture','文化','🏛️','cult + ure：文化'), W('friendship','友谊','🤝','friend 朋友 + ship 船：友谊之船！') ]},
  { id: 'verb4', name: '动词四', emoji: '🔄', color: '#9B72FF', pos: 'v', words: [
    W('become','变成','🦋','be + come 来：变成'), W('grow','生长','🌱','gr 生长'), W('change','改变','🔄','ch 改变'), W('move','移动','📦','m 移动'),
    W('arrive','到达','🏁','ar + rive：到达'), W('leave','离开','👋','leaf 叶子离开树 → leave 离开'), W('stay','停留','⏸️','st 停留'), W('live','居住','🏠','l 居住'),
    W('use','使用','🛠️','u 使用'), W('borrow','借入','📚','bor + row：借进来'), W('lend','借出','🤲','l + end：借出去（end 到头要还）'), W('keep','保持','🫳','k 一直拿着'),
    W('show','展示','👀','sh 给大家看'), W('follow','跟随','🚶','f 跟着走'), W('carry','搬运','🏋️','c 一路扛'), W('wait','等待','⏳','w 弯腰等'),
    W('spend','花费','💸','s + end 花到头：花费'), W('come','来','🙌','c 过来') ]},
  { id: 'adverb', name: '频率副词', emoji: '🔁', color: '#FFD93D', pos: 'adv', tip: '💡 规律：形容词 + ly = 副词！slow→slowly, quick→quickly', words: [
    W('very','非常','❗','v 非常'), W('too','也/太','','t + oo 也'), W('also','也','','al + so 也'), W('again','再一次','','a + gain 获得：再得一次'),
    W('always','总是','♾️','al + way + s：一直都是'), W('usually','通常','📶','usual 平常 + ly：平常地'), W('often','经常','','of + ten（t 常轻轻读）'), W('sometimes','有时','🎲','some 有些 + time 时候：有时候'),
    W('never','从不','🚫','not ever 从不 = never'), W('soon','很快','⏩','s + oo 跑得快'), W('still','仍然','⏸️','st 仍然'), W('just','刚刚','⏱️','j 刚刚'),
    W('only','仅仅','1️⃣','on + ly 只有一个'), W('almost','几乎','⚖️','al + most 最多：差不多'), W('maybe','也许','🤔','may 可以 + be 是：也许是'),
    W('already','已经','✔️','al + ready 准备好：已经'), W('then','然后','➡️','th 然后'), W('first','首先','🥇','f 最先'),
    W('slowly','慢慢地','🐢','slow 慢 + ly：慢慢地'), W('quickly','快快地','🐇','quick 快 + ly：快快地') ]},
  { id: 'question2', name: '疑问词', emoji: '❓', color: '#FF9F45', pos: 'qw', tip: '💡 规律：疑问词几乎都用 wh 开头（how 除外）！', words: [
    W('what','什么','','wh + at：什么'), W('who','谁','','wh + o：谁'), W('where','哪里','','wh + ere：哪里'), W('when','什么时候','','wh + en：何时'),
    W('why','为什么','','wh + y：为什么（y 举手问）'), W('which','哪一个','','wh + ich：哪个'), W('whose','谁的','','wh + ose：谁的'), W('how','怎样','','h + ow：怎样（唯一不用 wh 的）'),
    W('everyone','每个人','','every 每 + one 个：每个人'), W('anyone','任何人','','any 任何 + one 个：任何人') ]},
  { id: 'prep1', name: '常用虚词', emoji: '➡️', color: '#6BCB77', pos: 'prep', words: [
    W('at','在(时刻)','','a + t：在几点'), W('of','…的','','o + f：的'), W('for','为了','','f + or：为了'), W('with','和…一起','','w + ith：和'),
    W('about','关于','','a + bout：关于'), W('to','到/向','','t + o：到'), W('from','从','','fr + om：从'), W('into','进入','','in 里 + to 到：进到里面'),
    W('out','出去','','o + u + t：出去'), W('up','向上','','u 开头——向上 up！'), W('down','向下','','d 就是往下！'),
    W('off','离开','','o + ff：关掉离开'), W('and','和','','a + nd：和'), W('or','或者','','o + r：或者'), W('but','但是','','b + ut：但是'),
    W('so','所以','','s + o：所以'), W('because','因为','','be + cause 原因：因为'), W('if','如果','','i + f：如果') ]},
  { id: 'prep2', name: '进阶虚词', emoji: '🌉', color: '#4EC5F1', pos: 'prep', words: [
    W('between','在…之间','','be + tw 二：二者之间（tw 是"二"家族！）'), W('among','在…之中','','a + mong：在其中'), W('during','在…期间','','dur + ing：期间'), W('without','没有','','with 和 + out 出：不和一起=没有'),
    W('towards','朝向','','to + wards：朝着'), W('against','靠着/反对','','a + gainst：靠着'), W('through','穿过','','th + rough：穿过去'), W('across','横过','','a + cross 十字交叉：横穿'),
    W('along','沿着','','a + long 长：沿着长路'), W('around','围绕','','a + round 圆圈：绕圈'), W('beyond','超过','','be + yond：超过'), W('except','除了','','ex 出 + cept：拿出除外'),
    W('inside','在里面','','in 里 + side 边：里侧'), W('outside','在外面','','out 出 + side 边：外侧'), W('until','直到','','un + til：直到'), W('since','自从','','s + ince：自从'),
    W('although','虽然','','al + though：虽然'), W('however','然而','','how + ever：然而') ]},
  { id: 'communicate', name: '人际交流', emoji: '💬', color: '#FF8FAB', pos: 'v', words: [
    W('meet','遇见','🤝','m 见面'), W('introduce','介绍','🙋','in 往内 + duce 引导：引你进门'), W('agree','同意','🙆','a + gree：点头同意'), W('excuse','打扰一下','🙏','ex 出 + cuse：请出去一下→劳驾'),
    W('share','分享','🍰','sh 分一半'), W('care','关心','❤️','c 用心关心'), W('promise','承诺','🤙','pro + mise 交出：交出保证'), W('praise','表扬','👏','pr + aise：表扬'),
    W('argue','争论','😤','ar + gue：争起来'), W('cheer','欢呼','🎉','ch + eer：欢呼'), W('greet','问候','👋','gr + eet：问候'), W('discuss','讨论','💬','dis + cuss：讨论'),
    W('suggest','建议','💡','sug + gest 带来：带来主意'), W('explain','解释','📖','ex 出 + plain 清楚：说清楚') ]},
  { id: 'society', name: '社会生活', emoji: '🚦', color: '#FF6B6B', pos: 'n', words: [
    W('rule','规则','📏','r 规则'), W('law','法律','⚖️','l 法律'), W('police','警察','🚓','po + lice：警察'), W('protect','保护','🛡️','pro 提前 + tect 盖：提前盖住=保护'),
    W('save','拯救','🦸','s + ave：拯救'), W('danger','危险','⚠️','d + anger：危险'), W('accident','事故','🚑','ac + ci + dent：意外'), W('team','团队','🤾','t + eam：一队人'),
    W('group','小组','👥','gr + oup：一组'), W('neighbour','邻居','🏠','neigh + bour（bour 不发音）：邻居'), W('crowd','人群','🧍','cr + owd：挤满人'), W('volunteer','志愿者','🙋','vol + un + teer：志愿者'),
    W('activity','活动','🎪','act 做 + ivity：做的事'), W('event','大事','📅','e + vent 来到：来临的事') ]},
  { id: 'character', name: '性格品质', emoji: '💝', color: '#9B72FF', pos: 'adj', tip: '💡 规律：名词 + ful = "充满…的"！care+ful, help+ful', words: [
    W('kind','善良的','💞','k 善良'), W('brave','勇敢的','🦁','br 勇敢'), W('smart','聪明的','🧠','sm 聪明'), W('clever','机灵的','💡','cl + ever 机灵'),
    W('lazy','懒惰的','🦥','la + z 闪电都懒得躲：懒'), W('funny','滑稽的','🤡','fun 有趣 + ny：好笑'), W('strict','严格的','📏','str 严格'), W('friendly','友好的','😊','friend 朋友 + ly：像朋友一样'),
    W('honest','诚实的','🤞','h + onest：诚实'), W('polite','有礼貌的','🙏','po + lite：礼貌'), W('patient','耐心的','⏳','pa + tient：耐心等'), W('active','活跃的','⚡','act 行动 + ive：爱行动'),
    W('gentle','温柔的','🐑','gen + tle：温柔'), W('wild','野性的','🐯','w 野性'), W('careful','小心的','⚠️','care 关心 + ful：充满小心'), W('helpful','乐于助人的','🤝','help 帮助 + ful：充满帮助') ]},
  { id: 'future2', name: '学习与未来', emoji: '🚀', color: '#FF9F45', pos: 'n', words: [
    W('goal','目标','🎯','g + o + a + l：一球进目标'), W('work','工作','💼','w 工作'), W('success','成功','🏆','suc + cess：成功'), W('fail','失败','📉','f + ail：失败'),
    W('study','学习','📖','st 学习'), W('review','复习','🔁','re 再 + view 看：再看一遍！'), W('exam','考试','📝','e + x + am：考试'),
    W('believe','相信','🙏','be + lieve：相信'), W('effort','努力','💪','ef + fort：用力'), W('ideal','理想','🌟','i 小人抬头追的理想'), W('graduate','毕业','🎓','grad 级 + uate：读完这一级'), W('college','大学','🏛️','co + llege：大学'),
    W('knowledge','知识','📚','know 知道 + ledge：知识（kn 不发音！）'), W('choice','选择','🔀','ch + oice：选择'), W('chance','机会','🎲','ch + ance：机会') ]},
  { id: 'environment', name: '保护地球', emoji: '♻️', color: '#6BCB77', pos: 'n', words: [
    W('environment','环境','🌍','environ 围绕 + ment：围绕我们的环境'), W('pollution','污染','🏭','pollute 污染 + tion：污染'), W('rubbish','垃圾','🗑️','ru + bbish：垃圾'), W('recycle','回收利用','♻️','re 再 + cycle 循环：再循环'),
    W('energy','能源','⚡','en + ergy：能量'), W('power','力量','💪','pow + er：力量'), W('fresh','新鲜的','🥬','fr 新鲜'), W('silent','寂静的','🤫','si + lent：安静'),
    W('peace','和平','🕊️','pe + ace：和平'), W('land','陆地','🗺️','l 陆地'), W('ocean','海洋','🌊','o 大海洋'), W('reusable','可重复用的','♻️','re 再 + use 用 + able 能：能再用'),
    W('protect the earth','保护地球','🌍','protect 保护 + the earth 地球'), W('save water','节约用水','💧','save 节约 + water 水') ]},
  { id: 'magic', name: '高频魔法词', emoji: '✨', color: '#FFD93D', pos: 'adj', words: [
    W('see','看见','👀','s 看见'), W('not','不','','n + o + t：不'), W('well','好/井','👌','w + ell：好'), W('let','让','','l + et：让'),
    W('thing','东西','📦','th + ing：东西'), W('nothing','没有什么','','no 没 + thing 东西：没什么'), W('something','某事物','','some 某 + thing 物：某个东西'), W('everything','每件事','','every 每 + thing 物：每样东西'),
    W('everybody','每个人','','every 每 + body 人：每个人'), W('nobody','没有人','','no 没 + body 人：没有人'), W('somebody','某人','','some 某 + body 人：某人'), W('anybody','任何人','','any 任何 + body 人：任何人'),
    W('way','方法/路','🛤️','w 弯弯的路'), W('away','离开','🏃','a + way 路：上路离开'), W('own','自己的','','o + wn：自己的'), W('else','别的','','e + lse：别的'),
    W('another','另一个','','an + other 其他：另一个'), W('few','很少','','f + ew：一点点'), W('little','小的','','l + ittle：小小'), W('much','许多','','m + uch：许多'),
    W('many','许多','','m + any：许多'), W('each','每个','','ea + ch：每个'), W('every','每一个','','ev + ery：每一个'), W('all','全部','','a + l + l：全部'),
    W('some','一些','','s + ome：一些'), W('any','任何的','','a + ny：任何'), W('both','两个都','','b + oth：两个都'), W('other','其他的','','o + ther：其他'),
    W('next','下一个','','n + e + x 剪刀剪开现在：下一个'), W('last','最后的','','l + ast：最后'), W('once','一次','','on + ce：一次'), W('twice','两次','','tw 二家族（two, twin）+ ice：两次') ]},
]},
];

