//作者:随我变 www.suiwobian.com
//技术支持: phaser小站 https://www.phaser-china.com/
//主游戏
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', {
		preload : preload,
		create : create
	});
function preload() {
	game.load.spritesheet('bird', 'assets/bird.png', 34, 24, 3);
    game.load.spritesheet('闪烁', 'assets/shanshuo.png');
    game.load.spritesheet('第一章背景', 'assets/p1.png');
    game.load.spritesheet('北乔峰', 'assets/qiaofeng.png');
    game.load.spritesheet('南慕容', 'assets/murong.png');
    //第一幕资源
    game.load.spritesheet('昏暗客厅1', 'assets/keting.png');
    game.load.spritesheet('生气', 'assets/shengqi.png');
    game.load.spritesheet('餐桌', 'assets/canzhuo.png');
    game.load.spritesheet('白菜', 'assets/baicai.png');
    game.load.spritesheet('土豆丝', 'assets/tudousi.png');
    //第二幕资源
    game.load.spritesheet('家门', 'assets/jiamen.png');
}
function create() {
	var abc = new ContextShow(game, 50, 450, 700, 140);
    var W = game.width;
    var H = game.height;
	//参数解释：addCtx共8个参数
	//1 人物名字，2 说话内容，
	//3 当前语速延时，4 切换到下句对白的延时，
	//5 人物名字颜色，6 文字颜色
	//7 显示前是否清屏(不清屏则会接着显示), 8 本句说完是否停顿
	//abc.StyMana.addCurOptEvent(['你是傻子啊啊啊啊啊？','你是二货？'],[0,1]);
	abc.SetCurPlotName("开启桥段");
	abc.addCurDlgEvent("盲月引擎V0.5", "作者_随我变：http://www.suiwobian.com", 0, 1000, '#fff', '#fff', true, true);	
	abc.addCurDlgEvent("剧本", "郭强", 50, 1000, '#fff', '#fff', true, true);
	abc.addCurDlgEvent("技术支持", "phaser小站 https://www.phaser-china.com/", 0, 1000, '#fff', '#fff', true, true);
    abc.addCurSprEvent("第一章背景",'第一章背景',1,W,H*0.8,{x:W/2,y:H/2,alpha:0.1},{alpha:1},3000,false,-1);//(name,spname,type,w,h,ccs1, ccs2, tm, yoyo,killflag) {
	abc.addCurDlgEvent("序", "话说在五代末期，慕容龙城独创“斗转星移”绝技，纵横江湖，当世无敌，之后慕容氏其世代传承的“以彼之道，还施彼身”的斗转星移武功绝技，威震江湖。。。", 50, 1000, '#fff', '#fff', true, true);
    abc.addCurSprEvent("北乔峰",'北乔峰',1,200,100,{x:0,y:H/2-80,alpha:0},{x:(W/3)-5,alpha:0.86},6000,false,-1);
    abc.addCurSprEvent("南慕容",'南慕容',1,200,100,{x:W,y:H/2-20,alpha:0},{x:(2*W/3)+5,alpha:0.86},6000,false,-1);
    abc.addCurDlgEvent("序", "北宋年间，姑苏慕容成为江南第一大世家，其后世传人慕容博更为顶级武功高手。现任庄主【慕容复】年少有为，学武有成，在江湖上闯出一番名头，与丐帮帮主乔峰并称中原武林两大高手，名满江湖。", 65, 1000, '#fff', '#fff', true, true);
    abc.addCurDlgEvent("序", "人称", 80, 0, '#fff', '#fff', true, false);
    abc.addCurDlgEvent("序", "【北乔峰，南慕容】", 80, 0, '#fff', '#fc6', false, false);
    abc.addCurDlgEvent("序", "。所谓“中原英杰，首推此二人”......", 80, 1500, '#fff', '#fff', false, true);
    abc.addCurDlgEvent("", "请选择追随者...", 30, 0, '#fff', '#fff', true, false);
    abc.addCurOptEvent(["丐帮乔峰","姑苏慕容","郭强","随我变","Phaser小站"],["第一幕选项1","第一幕选项2","第一幕选项3","第一幕选项4","第一幕选项5"],[0,0,0,0,0]);
	{
		var gobackpos = abc.GetCurPlotEventNum();
		console.log(gobackpos);
		abc.SetCurPlotName("第一幕选项1");//
		abc.addCurScrEvent(alert,'选择了乔峰');
		abc.addCurOptEvent([], ["开启桥段"], [gobackpos]);//事件跳转，gobackpos表示 开启桥段的第gobackpos个事件

		abc.SetCurPlotName("第一幕选项2");//
		abc.addCurScrEvent(alert,'选择了慕容');
		abc.addCurOptEvent([], ["开启桥段"], [gobackpos]);
		
		abc.SetCurPlotName("第一幕选项3");//
		abc.addCurScrEvent(alert,'剧本:郭强');
		abc.addCurOptEvent([], ["开启桥段"], [gobackpos]);
		
		abc.SetCurPlotName("第一幕选项4");//
		abc.addCurScrEvent('window.location.href="http://www.suiwobian.com"; ');
		abc.addCurOptEvent([], ["开启桥段"], [gobackpos]);			

		abc.SetCurPlotName("第一幕选项5");//
		abc.addCurScrEvent('window.location.href="https://www.phaser-china.com/"; ');
		abc.addCurOptEvent([], ["开启桥段"], [gobackpos]);	
	}
	abc.SetCurPlotName("开启桥段");//返回
    abc.addCurDlgEvent("", "", 30, 0, '#fff', '#fff', true, false);
    abc.addCurSprEvent("第一章背景",null,1,0,0,null,{alpha:0},1000,false,1);
    abc.addCurSprEvent("北乔峰",null,1,0,0,null,{alpha:0},1500,false,1);
    abc.addCurSprEvent("南慕容",null,1,0,0,null,{alpha:0},1500,false,1,true);
    abc.addCurOptEvent([], ["第一幕"], [0]);

	abc.SetCurPlotName("第一幕");
    abc.addCurSprEvent("昏暗客厅1",'昏暗客厅1',1,W*0.8,H*0.7,{x:W/2,y:H/2-20,alpha:0},{alpha:0.96},2000,false,-1);
	abc.addCurDlgEvent("", "昏暗的客厅里，躺在摇椅上听小说的【慕芒】忽然间感觉一股掌风袭来....", 80, 1000, '#fff', '#fff', true, true);
    abc.addCurDlgEvent("", "说时迟那时快，躲是来不及了，没办法，只能选择硬接.....", 30, 1000, '#fff', '#fff', true, false);
    abc.addCurSprEvent("闪烁",'闪烁',1,W,H,{x:W/2,y:H/2,alpha:1},{alpha:0},300,false,1);
    abc.addCurDlgEvent("", "只听【叭】地一声，脑门瞬间挨了一巴掌", 30, 800, '#fff', '#fff', true, true);
    abc.addCurSprEvent("生气1",'生气',1,90,90,{x:W/2-100,y:H/2-100,alpha:0.3},{alpha:0.6},1000,false,-1);
    abc.addCurSprEvent("生气2",'生气',1,130,130,{x:W/2-30,y:H/2-40,alpha:0.2},{alpha:0.8},2000,false,-1);
    abc.addCurSprEvent("生气3",'生气',1,170,170,{x:W/2+100,y:H/2-40,alpha:0.1},{alpha:1},4000,false,-1);
    abc.addCurDlgEvent("慕芒", "何！方！妖....", 300, 800, '#ff0', '#ff0', true, true);
    abc.addCurSprEvent("闪烁",'闪烁',1,W,H,{x:W/2,y:H/2,alpha:1},{alpha:0},300,false,1);
    abc.addCurDlgEvent("...", "在孽字还没出口的瞬间....后脑勺又是一巴掌...", 30, 800, '#fff', '#fff', true, true);
    abc.addCurSprEvent("生气1",null,1,0,0,null,{alpha:0},1500,false,1);
    abc.addCurSprEvent("生气2",null,1,0,0,null,{alpha:0},1500,false,1);
    abc.addCurSprEvent("生气3",null,1,0,0,null,{alpha:0},1500,false,1);
    abc.addCurDlgEvent("奶奶", "小王八蛋，再不吃饭，我就拿去喂狗了...", 100, 0, '#ec6', '#fff', true, true);
    abc.addCurSprEvent("昏暗客厅1",null,1,0,0,null,{alpha:0},1500,false,1);
    abc.addCurDlgEvent("慕芒", "别别...马上去吃...", 50, 1000, '#ff0', '#ff0', true, false);
    abc.addCurSprEvent("餐桌",'餐桌',1,W*0.8,H*0.7,{x:W/2,y:H/2-20,alpha:0},{alpha:0.96},2000,false,-1);
    abc.addCurDlgEvent("", "说话间略显猥琐的慕芒凭着感觉跟着奶奶赶紧摸着墙走到饭桌前赶紧坐下开始接受新一轮的考验....", 60, 0, '#fff', '#fff', true, true);
    abc.addCurSprEvent("土豆丝",'土豆丝',1,90,50,{x:W/2+70,y:H/2-150,alpha:0},{alpha:0.96},2000,false,-1);
    abc.addCurDlgEvent("慕芒", "(小声嘀咕)  这土豆丝炒的太咸了....", 70, 1000, '#ff0', '#ff0', true, false);
    abc.addCurSprEvent("白菜",'白菜',1,100,60,{x:W/2+30,y:H/2-100,alpha:0},{alpha:0.96},2000,false,-1);
    abc.addCurDlgEvent("慕芒", "还有这个水煮白菜...真的只有白菜啊！呸呸....您老是把卖盐的打死了吧....这白菜汤有毒.....", 70, 0, '#ff0', '#ff0', true, true);
    abc.addCurDlgEvent("", "突然间！慕芒感觉室内气温降了好几度！危险！！！", 30, 0, '#fff', '#fff', true, true);
    abc.addCurDlgEvent("", "凭着多年经验慕芒使出了最拿手的铁头功迅速用后脑勺迎着一股掌风而去。", 30, 800, '#fff', '#fff', true, false);
    abc.addCurDlgEvent("慕芒", "借力打力!!!斗转星移!!!", 70, 1000, '#ff0', '#ff0', true, false);
    abc.addCurSprEvent("闪烁",'闪烁',1,W,H,{x:W/2,y:H/2,alpha:1},{alpha:0},300,false,1);
    abc.addCurDlgEvent("", "在慕芒的期待中他又一次看到一片小星星......", 50, 0, '#fff', '#fff', true, true);
    abc.addCurDlgEvent("奶奶", "赶紧吃饭，一会隔壁你王叔叔带你去上班，记得好好跟你王叔叔学...学会了按摩...等我哪天不能养活你...你也能有口饭吃...", 100, 0, '#ec6', '#fff', true, true);
    abc.addCurDlgEvent("慕芒", "奶奶....我......", 50, 0, '#ff0', '#ff0', true, true);
    abc.addCurDlgEvent("奶奶", "好孩子....别说了....奶奶知道...乖..赶紧吃饭...", 100, 0, '#ec6', '#fff', true, true);
    abc.addCurDlgEvent("慕芒", "不是....奶奶....王叔叔他.....", 50, 500, '#ff0', '#ff0', true, false);
    abc.addCurSprEvent("餐桌",null,1,0,0,null,{alpha:0},1500,false,1);
    abc.addCurSprEvent("土豆丝",null,1,0,0,null,{alpha:0},1000,false,1);
    abc.addCurSprEvent("白菜",null,1,0,0,null,{alpha:0},1000,false,1,true);    
    abc.addCurOptEvent([], ["第二幕"], [0]);
    
	abc.SetCurPlotName("第二幕");
    abc.addCurSprEvent("家门",'家门',1,260,480,{x:W/2,y:H/2-40,alpha:0.3},{alpha:0.96},100,false,-1);
	abc.addCurDlgEvent("", "噔噔..", 100, 0, '#fff', '#ddd', true, false);
    abc.addCurDlgEvent("", "噔噔瞪...", 50, 0, '#fff', '#eee', false, true);
    abc.addCurSprEvent("家门",null,1,0,0,null,{alpha:0},500,false,1,true);
    abc.addCurOptEvent([], ["开启桥段"], [0]);
    
    
	abc.SetCurPlotName("开启桥段");
	abc.Goon(); //启动剧本
}
