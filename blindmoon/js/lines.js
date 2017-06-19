//作者:随我变 www.suiwobian.com
//技术支持: phaser小站 https://www.phaser-china.com/

/////////////////////
//公共函数
//获取文本显示字符高度
Phaser_GetlineHeight = function (Text) {
	var fontProperties = Text.determineFontProperties(Text.style.font);
	var lineHeight = fontProperties.fontSize + Text.style.strokeThickness + Text.padding.y;
	return lineHeight;
}

//////////////////////////////////
//对话事件管理
function ContextData(ttl, ctx, PerS, NextS, tclr, clr, clsB, pause) { //文本，每字延时，下一句延时(ms),字体颜色
	this.name = typeof(arguments[0]) != "undefined" ? arguments[0] : "黑面人";
	this.line = typeof(arguments[1]) != "undefined" ? arguments[1] : "";
	this.ps = typeof(arguments[2]) != "undefined" ? arguments[2] : 50;
	this.ns = typeof(arguments[3]) != "undefined" ? arguments[3] : 50;
	this.tclr = typeof(arguments[4]) != "undefined" ? arguments[4] : '#8e0';
	this.clr = typeof(arguments[5]) != "undefined" ? arguments[5] : '#fff';
	this.clsB = typeof(arguments[6]) != "undefined" ? arguments[6] : false; //需要清除之前的对话？
	this.pause = typeof(arguments[7]) != "undefined" ? arguments[7] : true; //下一句是否为自动
}

function ContextMana() {
	this.idx = 0;
	this.arrCtx = new Array();
}

ContextMana.prototype.GetNum = function () {
	return this.arrCtx.length;
}

ContextMana.prototype.addCtx = function (ttl, ctx, PerS, NextS, tclr, clr, clsB, pause) {
	var cd = new ContextData(ttl, ctx, PerS, NextS, tclr, clr, clsB, pause);
	this.arrCtx[this.GetNum()] = cd;
	return this.GetNum() - 1;
}

ContextMana.prototype.getCtxAt = function (Idx) {
	ret = null;
	if (Idx > -1 && Idx < this.GetNum()) {
		ret = this.arrCtx[Idx];
		this.idx = Idx;
	}
	return ret;
}
ContextMana.prototype.getCurIdx = function () {
	return this.idx;
}

/////////////////////////////////
//舞台事件管理
function SpriteData(name,spname,type,w,h,ccs1, ccs2, tm, yoyo,killflag,cb) {
    this.name   = typeof(name)!='undefined' ? name:"";
    this.spname = typeof(spname)!='undefined' ? spname:"";
    this.type   = typeof(type)!='undefined' ? type:1;//this.SPTYPE_ANY = 1;
	this.w      = typeof(w)!='undefined' ? w:"";
	this.h      = typeof(h)!='undefined' ? h:"";
	this.ccs1   = typeof(ccs1)!='undefined' ? ccs1:"";
	this.ccs2   = typeof(ccs2)!='undefined' ? ccs2:"";
	this.tm     = typeof(tm)!='undefined' ? tm:"";
	this.yoyo   = typeof(yoyo)!='undefined' ? yoyo:"";
    this.killflag = typeof(killflag)!='undefined' ? killflag:"";
    this.cb     = typeof(cb)!='undefined' ? cb:false;//默认立即执行
}
function SpriteMana() {
	this.idx = 0;
	this.arrSpr = new Array();
}
SpriteMana.prototype.GetNum = function () {
	return this.arrSpr.length;
}
SpriteMana.prototype.addSpr = function (name,spname,type,w,h,ccs1, ccs2, tm, yoyo,killflag,cb) {

    var sp = new SpriteData(name,spname,type,w,h,ccs1, ccs2, tm, yoyo,killflag,cb);
	this.arrSpr[this.GetNum()] = sp;
	return this.GetNum() - 1;
}
SpriteMana.prototype.getSprAt = function (Idx) {
	ret = null;
	if (Idx > -1 && Idx < this.GetNum()) {
		ret = this.arrSpr[Idx];
		this.idx = Idx;
	}
	return ret;
}
SpriteMana.prototype.getCurIdx = function () {
	return this.idx;
}


/////////////////////////
//选项事件管理
function OptionData(Option, EvJmp, EvRJmp) {
	this.Option = Option;
	this.EvJmp = EvJmp; //跳转桥段
	this.EvRJmp = EvRJmp; //相对跳转
}
function OptionMana() {
	this.idx = 0;
	this.arrOpt = new Array();
}
OptionMana.prototype.GetNum = function () {
	return this.arrOpt.length;
}
OptionMana.prototype.addOpt = function (Option, EvJmp, EvRJmp) {
	var ev = new OptionData(Option, EvJmp, EvRJmp);
	this.arrOpt[this.GetNum()] = ev;
	return this.GetNum() - 1;
}
OptionMana.prototype.getOptAt = function (Idx) {
	ret = null;
	if (Idx > -1 && Idx < this.GetNum()) {
		ret = this.arrOpt[Idx];
		this.idx = Idx;
	}
	return ret;
}
OptionMana.prototype.getCurIdx = function () {
	return this.idx;
}

/////////////////////////
//脚本事件管理
function ScriptData(func, args) {
	this.func = func; //函数
	this.args = args; //参数
}
function ScriptMana() {
	this.idx = 0;
	this.arrScr = new Array();
}
ScriptMana.prototype.GetNum = function () {
	return this.arrScr.length;
}
ScriptMana.prototype.addScr = function (func, args) {
	var ev = new ScriptData(func, args);
	this.arrScr[this.GetNum()] = ev;
	return this.GetNum() - 1;
}
ScriptMana.prototype.getScrAt = function (Idx) {
	ret = null;
	if (Idx > -1 && Idx < this.GetNum()) {
		ret = this.arrScr[Idx];
		this.idx = Idx;
	}
	return ret;
}
ScriptMana.prototype.getCurIdx = function () {
	return this.idx;
}


//////////////////
//桥段管理
function PlotMana() {
	//常量定义
	this.EVENTDLG = 0;
	this.EVENTSPR = 1;
	this.EVENTOPT = 2;
	this.EVENTSCR = 3;

	//图文资料管理
	this.DlgMana = new ContextMana();
	this.SprMana = new SpriteMana();
	this.OptMana = new OptionMana();
	this.ScrMana = new ScriptMana();

	this.eventidx = 0; //控制事件指针
	this.eventList = []; //控制事件列表,a-b,a:0表示驱动图像,1表示驱动对话,2表示驱动选项，3表示驱动脚本  // b当前驱动位置
}
PlotMana.prototype.GetEventNum = function () {
	return this.eventList.length;
}
PlotMana.prototype.GetCurEventId = function () {
	return this.eventidx;
}
PlotMana.prototype.SetCurEventId = function (idx) {
	this.eventidx = idx;
}
//获取桥段事件
PlotMana.prototype.GetEventAt = function (idx) {
	var Ret = null;
	var num = this.GetEventNum();
	if (idx > -1 && idx < num) {
		Ret = this.eventList[idx];
	}
	return Ret;
}
PlotMana.prototype.CheckShowOver = function () {
	var idx = this.GetCurEventId();
	return !(idx > -1 && idx < this.GetEventNum());
}
//增加桥段事件
PlotMana.prototype.addDlgEvent = function (ttl, ctx, PerS, NextS, tclr, clr, clsB, pause) { //添加对话框事件
	var idx = this.DlgMana.addCtx(ttl, ctx, PerS, NextS, tclr, clr, clsB, pause);
	var num = this.GetEventNum();
	this.eventList[num] = [this.EVENTDLG, idx];
}
PlotMana.prototype.addSprEvent = function (name,spname,type,w,h,ccs1, ccs2, tm, yoyo,killflag,cb) { //添加人物显示事件
	var idx = this.SprMana.addSpr(name,spname,type,w,h,ccs1, ccs2, tm, yoyo,killflag,cb);
	var num = this.GetEventNum();
	this.eventList[num] = [this.EVENTSPR, idx];
}
PlotMana.prototype.addOptEvent = function (opts, evjs, evrj) {
	var idx = this.OptMana.addOpt(opts, evjs, evrj);
	var num = this.GetEventNum();
	this.eventList[num] = [this.EVENTOPT, idx];
}
PlotMana.prototype.addScrEvent = function (func,args) {
	var idx = this.ScrMana.addScr(func, args);
	var num = this.GetEventNum();
	this.eventList[num] = [this.EVENTSCR, idx];
}

//故事管理
function StoryMana() {
	this.CurPlot = ""; //当前桥段名称
	this.PlotList = []; //桥段列表
}
//增加桥段
StoryMana.prototype.addPlot = function (plotname) {
	if (typeof(this.PlotList[plotname]) == "undefined") {
		this.PlotList[plotname] = new PlotMana();
	}
}
StoryMana.prototype.getPlot = function (plotname) {
	if (typeof(this.PlotList[plotname]) == "undefined") {
		return null;
	} else
		return this.PlotList[plotname];
}
//添加指定桥段事件
StoryMana.prototype.addDlgEvent = function (plotname, ttl, ctx, PerS, NextS, tclr, clr, clsB, pause) { //添加对话框事件
	if (typeof(this.PlotList[plotname]) == "undefined") {
		this.addPlot(plotname);
	}
	this.PlotList[plotname].addDlgEvent(ttl, ctx, PerS, NextS, tclr, clr, clsB, pause);
}
StoryMana.prototype.addSprEvent = function (plotname, name,spname,type,w,h,ccs1, ccs2, tm, yoyo,killflag,cb) { //添加人物显示事件
	if (typeof(this.PlotList[plotname]) == "undefined") {
		this.addPlot(plotname);
	}
	this.PlotList[plotname].addSprEvent(name,spname,type,w,h,ccs1, ccs2, tm, yoyo,killflag,cb);
}
StoryMana.prototype.addOptEvent = function (plotname, opts, evjs, evrj) { //添加选项事件
	if (typeof(this.PlotList[plotname]) == "undefined") {
		this.addPlot(plotname);
	}
	this.PlotList[plotname].addOptEvent(opts, evjs, evrj);
}
StoryMana.prototype.addScrEvent = function (plotname, func,args) { //添加脚本事件
	if (typeof(this.PlotList[plotname]) == "undefined") {
		this.addPlot(plotname);
	}
	this.PlotList[plotname].addScrEvent(func,args);
}
//获取桥段剧本
StoryMana.prototype.GetPlotEvent = function (plotname) { //添加对话框事件
	if (this.PlotList[plotname] == 'undefined') {
		return null;
	} else
		return this.PlotList[plotname];
}
//获取指定桥段事件
StoryMana.prototype.GetPlotEventAt = function (plotname, idx) {
	var Ret = null;
	var plot = this.GetPlotEvent(plotname);
	if (plot != null) {
		var num = plot.GetEventNum();
		if (idx > -1 && idx < num) {
			Ret = plot.eventList[idx];
		}
	}
	return Ret;
}
//获取指定桥段事件个数
StoryMana.prototype.GetPlotEventNum = function (plotname) {
	var Ret = -1;
	var plot = this.GetPlotEvent(plotname);
	if (plot != null) {
		Ret = plot.GetEventNum();
	}
	return Ret;
}
//获取指定桥段当前事件id
StoryMana.prototype.GetPlotEventId = function (plotname) {
	var Ret = -1;
	var plot = this.GetPlotEvent(plotname);
	if (plot != null) {
		Ret = plot.GetCurEventId();
	}
	return Ret;
}
//设置指定桥段当前事件id
StoryMana.prototype.SetPlotEventId = function (plotname, idx) {
	var plot = this.GetPlotEvent(plotname);
	if (plot != null) {
		plot.SetCurEventId(idx);
	}
}
//////////////////////////////////////////////////////////////显示部分
////////////////////////////////////
//显示对话框控件
function ShowDialog(GAME, x, y, dlgW, dlgH) {
	this.game = GAME;
	this.group = this.game.add.group();

	//创建控件
	//wordWrap: true, wordWrapWidth: 300
	var styleTxt = {
		font : "20px Arial",
		fill : "#fff",
		align : "left",
		boundsAlignH : "left",
		boundsAlignV : "top"
	}; //backgroundColor: 'rgba(0,255,0,0.25)',
	var styleTtl = {
		font : "21px Arial",
		fill : "#8e9",
		align : "left"
	}; //backgroundColor: 'rgba(0,255,0,0.25)',

	this.Title = this.game.add.text(x + 3, y + 3, '测试标题', styleTtl);
	this.Text = this.game.add.text(x + 25, y + 28, '测试内容', styleTxt);
	this.Bg = this.game.add.graphics(0, 0);
    this.Bg.alpha = 0.76;
	this.Bg.lineStyle(5, 0x55A1C5C5);
	this.Bg.beginFill(0x308C8C);
	this.Bg.drawRoundedRect(x, y, dlgW, dlgH, 2);
	this.Bg.endFill();
	this.Bg.inputEnabled = true; //text.input.enableDrag();
	this.Continue = this.game.add.sprite(x + dlgW - 30, y + dlgH - 40, 'bird'); ;
	this.Continue.scale.setTo(-0.7, 0.7);
	this.Continue.animations.add('fly');
	this.Continue.animations.play('fly', 24, true); //12fps
	this.ShowDlg(false);
	//子控件入组
	this.group.addChild(this.Bg);
	this.group.addChild(this.Title);
	this.group.addChild(this.Text);
	this.group.addChild(this.Continue);
}
//显示/隐藏除继续按钮组件
ShowDialog.prototype.ShowDlgWithNoCnt = function (val) {
	if (val) {
		this.Bg.revive();
		this.Title.revive();
		this.Text.revive();
	} else {
		this.Bg.kill();
		this.Title.kill();
		this.Text.kill();
	}
}
//显示/隐藏全部组件
ShowDialog.prototype.ShowDlg = function (val) {
	this.ShowDlgWithNoCnt(val);
	this.ShowCtn(val);
}
//显示/隐藏继续组件
ShowDialog.prototype.ShowCtn = function (val) {
	if (val)
		this.Continue.revive();
	else
		this.Continue.kill();
}
//设置标题颜色
ShowDialog.prototype.SetTitleClr = function (clr, pos) {
	if (clr == null) {
		this.Title.clearColors();
	} else {
		this.Title.addColor(clr, pos);
	}
}
//设置文本颜色
ShowDialog.prototype.SetTextClr = function (clr, pos) {
	if (clr == null) {
		this.Text.clearColors();
	} else {
		this.Text.addColor(clr, pos);
	}
}
//设置标题内容
ShowDialog.prototype.SetTitle = function (text) {
	this.Title.text = text;
}
//设置文本内容
ShowDialog.prototype.SetText = function (text) {
	this.Text.text = text;
}
//获取文本内容
ShowDialog.prototype.GetText = function () {
	return this.Text.text;
}
//添加文本内容
ShowDialog.prototype.AddText = function (text) {
	this.Text.text = this.Text.text.concat(text); // 添加下一个字
}
//获取文本显示字符长度
ShowDialog.prototype.GetTextWidth = function (ch) {
	return this.Text.measureLine(ch);
}
//获取文本显示字符高度
ShowDialog.prototype.getlineHeight = function () {
	return Phaser_GetlineHeight(this.Text);
}
//设置点击回调
ShowDialog.prototype.SetInputDown = function (cb, ctx) {
	this.Bg.events.onInputDown.add(cb, ctx);
}

////////////////////////////////
//人物舞台显示控件
function SpriteCtrl(GAME) {
    this.SPTYPE_NIL = 0;
    this.SPTYPE_ANY = 1;
    this.SPTYPE_BGD = 2;
    
	this.game  = GAME;
    this.spLst = [];
	this.group = this.game.add.group();
    this.game.world.sendToBack(this.group);
}
SpriteCtrl.prototype.ShowSprite = function (name,spname,type,w,h,ccs1, ccs2, tm, yoyo,killflag,overcallback,cbcontext) {
	//this.game.world.sendToBack(this.group);
    if(name == "" && spname == ""){//消除所有
        switch(type){
            case this.SPTYPE_ANY:
                this.HideAll();
            break;
            case this.SPTYPE_BGD:
                this.HideNoBgd();
            break;
        }        
    }
    else{
        console.log(this.spLst);
        var sprite = null;
        if( typeof(this.spLst[name])=='undefined' || this.spLst[name] == null ){
            if( ccs1!=null ){
                sprite = this.game.add.sprite(0, 0, spname);//game.world.centerX
                sprite.kill();
                this.spLst[name] = sprite;
                sprite.name      = name;
                this.group.addChild(sprite);                
                sprite.anchor.set(0.5);
            }
        }else{
            sprite = this.spLst[name];
        }
        sprite.type      = type;
        sprite.yoyo      = yoyo;
        sprite.curTm     = tm;            
        sprite.curCcs1   = ccs1;
        sprite.curCcs2   = ccs2;
        sprite.killflag  = killflag;
        sprite.overcallback = overcallback;//下一个是否立即执行
        sprite.cbcontext = cbcontext;
        
        if( w>0 && h>0 ){
            sprite.width  = w;
            sprite.height = h;
        }
        if( ccs1 != null ){
            var curTw = this.game.add.tween(sprite).to( ccs1, 1,"Linear", true);
            curTw.onComplete.addOnce(this.tweenReset, this);             
        }
        else{
            sprite.curCcs2 = ccs2;
            console.log(sprite.curCcs1);
            var curTw = this.game.add.tween(sprite).to( ccs2, tm,"Linear", true);
            curTw.onComplete.addOnce(this.tweenOver, this);             
        }
    }
}
SpriteCtrl.prototype.tweenReset = function(curSp,curTw) {
    curTw.target.revive();//curSp
	curTw.to( curSp.curCcs2, curSp.curTm,"Linear", true);
	curTw.onComplete.addOnce(this.tweenOver, this);
}
SpriteCtrl.prototype.tweenOver = function(curSp,curTw) {
    curTw = null;
    if( typeof(this.spLst[curSp.name])=='undefined' || this.spLst[curSp.name] == null ){
        //this.spLst[curSp.name] = curSp;
        //this.group.addChild(curSp);
    }
    console.log(curSp.killflag);//前后顺序不能变
    if( typeof(curSp.killflag) != 'undefined' ){
        switch(curSp.killflag){
            case this.SPTYPE_ANY:
                this.KillSpr(curSp);
            break;
            case this.SPTYPE_BGD:
                this.HideNoBgd();//待修改
            break;
        }        
    }
    //over
    if( typeof(curSp.overcallback)!='undefined' && curSp.overcallback !=null ){
        curSp.overcallback(curSp.cbcontext);
    }
}
SpriteCtrl.prototype.HideNoBgd = function(){
    //待修改
	this.group.forEachAlive(function (item) {
		if(type.type!=this.SPTYPE_BGD ){
            this.spLst[item.name] = null;
            item.destroy();
        }
	},this);
}
SpriteCtrl.prototype.HideAll = function(){
	this.group.removeAll(true);
    this.spLst = [];
}
SpriteCtrl.prototype.KillSpr = function(sp){
	sp.destroy();
    this.spLst[sp.name] = null;
    console.log('kill'+sp.name);
}
///////////////////////////////////
//显示选项控件
function ShowOption(GAME) {
	this.game = GAME;
	this.groupText = this.game.add.group();
	this.groupAll = this.game.add.group();
	this.OldClr = "#fff";
	this.styleTxt = {
		font : "20px Arial",
		stroke : "#edc",
		fill : this.OldClr,
		align : "left",
		boundsAlignH : "left",
		boundsAlignV : "top",
		wordWrap : true,
		wordWrapWidth : 300
	};
	this.CurSel = -1; //当前选择
	this.selCallFun = null;
	this.selCallCtx = null;
	this.TextTool = this.game.add.text(0, 0, '', this.styleTxt); //用来测量文本长宽
	this.textHeight = Phaser_GetlineHeight(this.TextTool);
	//text.destroy();

	//选项背景
	this.Bg = this.game.add.graphics(0, 0);
	this.ResetBg(0, 0, 100, 100);
	//this.Bg.inputEnabled = true;//


	this.groupAll.addChild(this.Bg);
	this.groupAll.addChild(this.groupText);

	this.HideAll();
}
//获取文本显示字符长度
ShowOption.prototype.GetTextWidth = function (text) {
	if (typeof(text) == 'undefined')
		return 0;
	return this.TextTool.measureLine(text);
}
//重置背景
ShowOption.prototype.ResetBg = function (x, y, w, h) {
	this.Bg.clear();
	this.Bg.lineStyle(5, 0x55A1C5C5);
	this.Bg.beginFill(0x308C8C);
	this.Bg.drawRoundedRect(x, y, w, h, 2);
	this.Bg.endFill();
	this.Bg.revive();
}
//添加显示选项
ShowOption.prototype.ShowOpt = function (baseX, baseY, opts, selCallFun, selCallCtx) {
	var len = opts.length;
	var posx = baseX,
	posy = baseY;

	this.selCallFun = selCallFun;
	this.selCallCtx = selCallCtx;
	this.HideAll(); //kill all


	console.log(len);
	//获取最大长度
	var tmpWidth = 0;
	var maxWidth = 0;
	var maxHeight = len * this.textHeight;
	for (i = 0; i < len; i++) {
		tmpWidth = this.GetTextWidth(opts[i]);
		if (tmpWidth > maxWidth) {
			maxWidth = tmpWidth;
		}
	}
	console.log(maxWidth + "  " + maxHeight);
	this.ResetBg(posx - maxWidth - 2, posy - this.textHeight / 2 - 2, maxWidth * 2 + 4, maxHeight + 4);
	//添加选项
	for (i = 0; i < len; i++) {
		var text = this.groupText.getFirstDead(false);
		if (text == null) {
			text = this.game.add.text(posx, posy, '', this.styleTxt);
			text.inputEnabled = true;
			text.events.onInputOver.add(this.hover, this);
			text.events.onInputOut.add(this.out, this);
			text.events.onInputDown.add(this.down, this);
			text.anchor.set(0.5, 0.5);
			this.groupText.addChild(text); // add text to the groupText
		}
		text.text = opts[i];
		text.reset(posx, posy); //this will alive all
		posy += this.textHeight;
	}
}
ShowOption.prototype.HideAll = function () {
	this.CurSel = -1;
	this.groupText.forEachAlive(function (item) {
		item.kill();
	});
	this.Bg.kill();
}
ShowOption.prototype.hover = function (item) {
	item.fill = "#ffff44";
	item.fontWeight = "bold";
	item.strokeThickness = 1;
}
ShowOption.prototype.out = function (item) {
	item.fill = this.OldClr;
	item.fontWeight = "";
	item.strokeThickness = 0;
}
ShowOption.prototype.down = function (item) {
	var Idx = this.groupText.getChildIndex(item);
	this.CurSel = Idx;
	console.log(Idx);
	this.HideAll();
	this.selCallFun(Idx, this.selCallCtx);
}

//////////////////////////////////////////////////////////////////////////////////
//AVG游戏驱动Core
function ContextShow(GAME, x, y, w, h) {
	//常量定义
	this.EVENTDLG = 0;
	this.EVENTSPR = 1;
	this.EVENTOPT = 2;
	this.EVENTSCR = 3;

	this.game = GAME;
	//剧本管理
	this.StyMana = new StoryMana();
	this.CurPlotname = ''; //当前桥段名称
	//控件显控管理
	this.DlgCtrl = new ShowDialog(GAME, x, y, w, h);
	this.DlgCtrl.SetInputDown(this.InputDown, this); //设置点击回调
	this.SprCtrl = new SpriteCtrl(GAME);
	this.OptCtrl = new ShowOption(GAME);

	//控制内容变量
	//

	//对话框
	this.maxline = 3; //最大显示行数
	this.perline = w - 50; //换行长度
	this.CurNNum = 0; //换行个数
	this.CurLineLen = 0; //当前显示长度
	this.CurWordPos = 0; //当前位置
	this.IsReading = false; //是否正在显示文字
    this.IsShowing = 0; //是否正在显示图像
	this.IsNeedPause = true; //是否需要每句暂停状态
	//选择框
	this.CurEventJmp = []; //当前选择跳转桥段
	this.CurEventRJmp = -1; //当前选择跳转位置
	//显示信息变量
	this.Name = ""; //当前人物名称
	this.CurTclr = "#000"; //当前人物颜色
	this.CurLine = ""; //当前句子
	this.CurClr = "#fff"; //当前文字颜色
	this.Pdelay = 0; //当前字延时
	this.Ndelay = 0; //当前句延时
	this.NeedCls = 0; //当前显示之前是否要清屏


	//初始化清屏
	this.ClearShow();
}

ContextShow.prototype.ClearShow = function () {
	this.ClearShowWithOutTitle();
	this.DlgCtrl.SetTitle("");
}

ContextShow.prototype.ClearShowWithOutTitle = function () {
	this.CurNNum = 0; //清屏
	this.CurLineLen = 0;
	this.DlgCtrl.SetText("");
	this.DlgCtrl.SetTextClr(null, 0);
}

ContextMana.prototype.ClearDlgData = function () {
	//this.DlgMana.arrCtx = [];
	//this.DlgMana.idx    = 0;
	this.ClearShow();
}

//对话框显示驱动
ContextShow.prototype.nextDlg = function (evIdx, ctx) {
	//var ctx = this.DlgMana.getCtxAt(evIdx);
	if (ctx === null) {
		return;
	} // 结束
	this.DlgCtrl.ShowDlgWithNoCnt(true);
	if (!this.IsReading){ this.DlgCtrl.ShowCtn(false); }
	this.IsReading = true;
	this.CurLine = ctx.line;
	this.Name = ctx.name;
	this.Pdelay = ctx.ps;
	this.Ndelay = ctx.ns;
	this.CurTclr = ctx.tclr;
	this.CurClr = ctx.clr;
	this.NeedCls = ctx.clsB; //判断是否需要清屏
	if (this.NeedCls) {
		this.ClearShow();
	}
	this.IsNeedPause = ctx.pause; //本句结束后是否暂停

	this.DlgCtrl.SetTitleClr(null, 0);
	this.DlgCtrl.SetTitleClr(this.CurTclr, 0);
	if(this.Name!=""){ this.DlgCtrl.SetTitle('【' + this.Name + '】'); }
    else{ this.DlgCtrl.SetTitle("");  }
    if(this.CurLine.length<1){
        this.GoonDelay(this.Ndelay);
    }else{
        //启动逐字
        this.CurWordPos = 0;
        this.game.time.events.repeat(this.Pdelay, this.CurLine.length, this.nextWord, this);        
    }
}
ContextShow.prototype.nextWord = function () {
	if (this.CurNNum >= this.maxline) {
		this.ClearShowWithOutTitle();
		this.DlgCtrl.SetTextClr(this.CurClr, this.DlgCtrl.GetText().length - this.CurNNum);
	} //先清，后设置颜色
	if (this.CurWordPos == 0) {
		this.DlgCtrl.SetTextClr(this.CurClr, this.DlgCtrl.GetText().length - this.CurNNum);
	}
	var ch = this.CurLine[this.CurWordPos];
	this.CurLineLen += this.DlgCtrl.GetTextWidth(ch);
	this.DlgCtrl.AddText(ch); // 添加下一个字
	if (this.CurLineLen > this.perline) {
		this.DlgCtrl.AddText('\n');
		this.CurNNum++;
		this.CurLineLen = 0;
	}
	this.CurWordPos++; //下一个字
	if (this.CurWordPos >= this.CurLine.length) { //最后一个字
		if (this.IsNeedPause) {
			this.IsReading = false;
			this.DlgCtrl.ShowCtn(true);
		} else {
			if (this.Ndelay == 0) {
				this.GoonDelay(20);
			} //防堆栈溢出
			else {
				this.GoonDelay(this.Ndelay);
			} // 延迟一会儿添加下一行
			//else{ this.game.time.events.add(this.Ndelay, this.Goon, this); }// 延迟一会儿添加下一行
		}
	}
}

//////////////////////////////////
//精灵显示驱动
ContextShow.prototype.nextSpr = function(evIdx, ev){
	if (ev === null) {
		return;
	} // 结束
    this.IsShowing++;
    console.log(ev.cb);
    if( ev.cb == true ){//等待执行
        this.SprCtrl.ShowSprite(ev.name,ev.spname,ev.type,ev.w,ev.h,ev.ccs1,ev.ccs2,ev.tm,ev.yoyo,ev.killflag,this.nextCallBacK,this);
    }else{
        this.SprCtrl.ShowSprite(ev.name,ev.spname,ev.type,ev.w,ev.h,ev.ccs1,ev.ccs2,ev.tm,ev.yoyo,ev.killflag);
        this.nextCallBacK(this);//立即执行
    }
}
ContextShow.prototype.nextCallBacK = function(ctx){
    ctx.GoonDelay(10);
    ctx.IsShowing--;
}
//////////////////////////////////
//选项显示驱动
ContextShow.prototype.nextOpt = function (evIdx, ev) {
	if (ev === null) {
		return;
	} // 结束
	this.CurEventRJmp = ev.EvRJmp;
	if (ev.Option.length == 0 && ev.EvJmp.length == 1) { //如果是特殊跳转
		if (typeof(this.CurEventRJmp) != 'undefined') {
			this.SetPlotEventId(ev.EvJmp[0], ev.EvRJmp[0]);
		}
		this.SetCurPlotName(ev.EvJmp[0]); //直接跳转
		this.GoonDelay(20); //防堆栈溢出
	} else {
		this.CurEventJmp = ev.EvJmp;
		this.IsReading = true;
		this.OptCtrl.ShowOpt(this.game.width / 2, this.game.height / 2 - 100, ev.Option, this.EventSel, this);
	}
}
ContextShow.prototype.EventSel = function (sel, context) {
	var plotnext = null;
    if (typeof(context.CurEventJmp) != 'undefined') {
		plotnext = context.CurEventJmp[sel];
	}
	if (typeof(context.CurEventRJmp) != 'undefined') {
		var relnext = context.CurEventRJmp[sel];
		context.SetPlotEventId(plotnext, relnext);
	}
	if(plotnext!=null){ context.SetCurPlotName(plotnext); }
	context.GoonDelay(20);
}

//////////////////////////////////////
//脚本驱动
ContextShow.prototype.nextScr = function (evIdx, ev) {
	if (ev === null) {
		return;
	} // 结束
	var fun = ev.func;
	if( typeof(fun) == 'string' ){
		eval(fun);
	}else if( typeof(ev.args)!="undefined" ){
		fun(ev.args);
	}else{
		fun();
	}
	
	this.GoonDelay(20); //防堆栈溢出
}

//////////////////////////////////
//总驱动
ContextShow.prototype.SetCurPlotName = function (plotname) {
	this.CurPlotname = plotname;
}
ContextShow.prototype.GetCurPlotMana = function () {
	return this.StyMana.getPlot(this.CurPlotname);
}
ContextShow.prototype.GetCurEventId = function () {
	return this.StyMana.GetPlotEventId(this.CurPlotname);
}
ContextShow.prototype.SetPlotEventId = function (plotname, Idx) {
	return this.StyMana.SetPlotEventId(plotname, Idx);
}
ContextShow.prototype.GetCurPlotEventNum = function () {
	return this.GetPlotEventNum(this.CurPlotname);
}
ContextShow.prototype.GetPlotEventNum = function (plotname) {
	return this.StyMana.GetPlotEventNum(plotname);
}
ContextShow.prototype.SetCurEventId = function (Idx) {
	return this.StyMana.SetPlotEventId(this.CurPlotname, Idx);
}
ContextShow.prototype.GetCurEvent = function () {
	return this.StyMana.GetPlotEventAt(this.CurPlotname, this.GetCurEventId());
}
ContextShow.prototype.addCurDlgEvent = function (ttl, ctx, PerS, NextS, tclr, clr, clsB, pause) {
	return this.StyMana.addDlgEvent(this.CurPlotname, ttl, ctx, PerS, NextS, tclr, clr, clsB, pause);
}
ContextShow.prototype.addCurSprEvent = function (name,spname,type,w,h,ccs1, ccs2, tm, yoyo,killflag,cb) {
	return this.StyMana.addSprEvent(this.CurPlotname, name,spname,type,w,h,ccs1, ccs2, tm, yoyo,killflag,cb);
}
ContextShow.prototype.addCurOptEvent = function (opts, evjs, evrj) {
	return this.StyMana.addOptEvent(this.CurPlotname, opts, evjs, evrj);
}
ContextShow.prototype.addCurScrEvent = function (func,args) {
	return this.StyMana.addScrEvent(this.CurPlotname, func,args);
}

ContextShow.prototype.addCurJmpEvent = function (jmpplotname, jmppos) {
	var opts = [];
	var evjs = [jmpplotname];
	var evrj = [jmppos];
	return this.StyMana.addOptEvent(this.CurPlotname, opts, evjs, evrj);
}
ContextShow.prototype.GoonDelay = function (delay) {
	this.game.time.events.add(delay, this.Goon, this);
}
ContextShow.prototype.Goon = function () {
	//var ev =  this.GetEventAt(this.GetCurEventId());
	//console.log(this.CurPlotname + "   " + this.GetCurEventId());
	var ev = this.GetCurEvent();
	if (ev != null) {
		var evType = ev[0];
		var evIdx = ev[1];
		this.SetCurEventId(1 + this.GetCurEventId());
		switch (evType) {
		case this.EVENTDLG:
			var ctx = this.GetCurPlotMana().DlgMana.getCtxAt(evIdx);
			this.nextDlg(evIdx, ctx);
			break;
		case this.EVENTSPR:
            var spr = this.GetCurPlotMana().SprMana.getSprAt(evIdx);
            //console.log(spr);
            this.nextSpr(evIdx, spr);
			break;
		case this.EVENTOPT:
			var opt = this.GetCurPlotMana().OptMana.getOptAt(evIdx);
			this.nextOpt(evIdx, opt);
			break;
		case this.EVENTSCR:
			var scr = this.GetCurPlotMana().ScrMana.getScrAt(evIdx);
			console.log(scr);
			this.nextScr(evIdx, scr);
			break;			
		}
	}
}
ContextShow.prototype.InputDown = function () {
	console.log(this.IsShowing);
    if (this.IsReading == true || this.IsShowing != 0 ) {//
		return;
	}
	this.GoonDelay(20);
	return;

	console.log(this.CheckShowOver());
	if (this.CheckShowOver()) {
		this.ClearShow();
		this.DlgCtrl.ShowDlg(false);
	}
}

