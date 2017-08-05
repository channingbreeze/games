"use strict";
//移动方向标志变量
var MOVE_NO=-1,MOVE_L=0,MOVE_LP=1,MOVE_LD=2,MOVE_R=3,MOVE_RP=4,MOVE_RD=5;
window.sjm.state.play = {
	preload: function(){
		//console.log("loading play state");
	},
	
	create: function(){
		//console.log("starting play state");
		//添加背景
		mt.create('bg');
		//添加点击区域
		this.pots=mt.create('pots');
		this.potsList=this.pots.mt.children;
		this.createMap();
		//添加神经猫
		this.resetPo=[27,28,35,36];
		this.creazeCat=mt.create('crazeCat');
		//随机设置猫的坐标
		this.setCatPo();
		this.catAni=this.creazeCat.animations;
		this.catAni.add('live',[0,1,2],5,true);
		this.catAni.add('dead',[3,4,5,6],5,true);
		this.catAni.play('live');
		
		//添加声音
		this.step=this.game.add.sound('step');
		this.laugh=this.game.add.sound('laugh');
		this.crazy=this.game.add.sound('crazy');
		//创建初始变量
		this.stepCount=0;
		this.name=['芙蓉姐称号','见人疯称号','凤姐夫称号','凤姐称号'];//随便定的4个等级
	},
	createMap:function(){
		for(var i=0;i<64;i++){
			//随机定不可称动区域
			var postNow=this.potsList['pot'+i];
			postNow.index=i;
			//随机生成神经猫不可以走的点，且保证猫随机的几个位置可以走
			if(Math.random()<0.2 & i!=27 && i!=28 && i!=35 & i!=36){
				postNow.frame=1;
			}
			//事件绑定
			postNow.inputEnabled=true;
			postNow.events.onInputDown.add(this.changeStep,this);
		}
	},
	setCatPo:function(){
		var catIndex=this.resetPo[parseInt(Math.random()*4)];
		this.creazeCat.index=catIndex;
		this.creazeCat.x=this.potsList['pot'+catIndex].x+32;
		this.creazeCat.y=this.potsList['pot'+catIndex].y+32;
		console.log(catIndex);
	},
	changeStep:function(e){
		//当前点击的元素的索引从0开始
		var index=e.index;
		//如果当前已经是不可走的点，则直接retrun
		if(e.frame==1 || index==this.creazeCat.index){
			return;
		}
		//让当前点击的点变成神经猫不可走的点
		e.frame=1;
		this.stepMove();
	},
	getXY:function(num){//根据当前位置寻找坐标
		var row=parseInt(num/8);
		var col=num%8;
		return {
			y:row,
			x:col
		};
	},
	getIndex:function(x,y){//根据坐标寻找位置
		return y*8+x;
	},
	getPot:function(x,y){//根据坐票元素
		return this.potsList['pot'+this.getIndex(x,y)];
	},
	stepMove:function(){
		var dir=this.stepMoveDir();
		var y=this.catXY.y;
		var x=this.catXY.x;
		console.log(dir,x,y);
		var wPo=null;
		switch (dir){
			case MOVE_L:
				console.log('MOVE_L',x-1,y);
				wPo=this.getPot(x-1,y);
				this.changeCatPo(wPo);
				break;
			case MOVE_LP:
				console.log('MOVE_LP',(y-1)%2==1 ? x-1 : x,y-1);
				wPo=this.getPot((y-1)%2==1 ? x-1 : x , y-1);
				this.changeCatPo(wPo);
				break;
			case MOVE_LD:
				console.log('MOVE_LD',(y+1)%2==1 ? x-1 : x,y+1);
				wPo=this.getPot((y+1)%2==1 ? x-1 : x , y+1);
				this.changeCatPo(wPo);
				break;
			case MOVE_R:
				console.log('MOVE_R',x+1,y);
				wPo=this.getPot(x+1,y);
				this.changeCatPo(wPo);
				break;
			case MOVE_RP:
				console.log('MOVE_RP',(y-1)%2===0 ? x+1 : x,y-1);
				wPo=this.getPot((y-1)%2===0 ? x+1 : x , y-1);
				this.changeCatPo(wPo);
				break;
			case MOVE_RD:
				console.log('MOVE_RD',(y+1)%2===0 ? x+1 : x,y+1);
				wPo=this.getPot((y+1)%2===0 ? x+1 : x , y+1);
				this.changeCatPo(wPo);
				break;
			default://猫无处可走了，捉到了
				this.crazy.play();
				this.creazeCat.animations.play('dead');
				this.gameOver(true);
				break;
		}
	},
	changeCatPo:function(obj){//设置猫的位置
		var pos=this.getXY(obj.index);
		this.creazeCat.x=obj.x+32;
		this.creazeCat.y=obj.y+32;
		this.creazeCat.index=obj.index;
		//如果猫到了边缘，证明没捉到猫，游戏结束
		if(pos.x===0 || pos.x==7 || pos.y===0 || pos.y===7){
			this.laugh.play();
			this.gameOver(false);
			return;
		}
		this.step.play();
		this.stepCount=this.stepCount+1;
	},
	stepMoveDir:function(){//拿到当前神经猫应该走的方向
		var posArr=[-1,-1,-1,-1,-1,-1];
		//当前猫的坐标
		this.catXY=this.getXY(this.creazeCat.index);
		var row=this.catXY.y;
		var col=this.catXY.x;
		var y=row;
		var x=col;
		var nowPot=null;
		
		//left
		var can=true;
		for(x=col ; x>=0 ; x--){
			nowPot=this.getPot(x,row);
			if(nowPot.frame==1){
				can=false;
				posArr[MOVE_L]=col-x-1;
				break;
			}
		}
		if(can){
			return MOVE_L;
		}
		//left-up
		can=true;
		x=col;
		y=row;
		while(true){
			y--;
			if(y%2==1){
				x--;
			}
			nowPot=this.getPot(x,y);
			if(nowPot.frame==1){
				can=false;
				posArr[MOVE_LP]=row-y-1;
				break;
			}
			if(x===0 || y===0){
				break;
			}
		}
		if(can){
			return MOVE_LP;
		}
		//left-down
		can=true;
		x=col;
		y=row;
		while(true){
			y++;
			if(y%2==1){
				x--;
			}
			nowPot=this.getPot(x,y);
			if(nowPot.frame==1){
				can=false;
				posArr[MOVE_LD]=y-row-1;
				break;
			}
			if(x===0 || y==7){
				break;
			}
		}
		if(can){
			return MOVE_LD;
		}
		//right
		can=true;
		for(x=col ; x<8 ; x++){
			nowPot=this.getPot(x,row);
			if(nowPot.frame==1){
				can=false;
				posArr[MOVE_R]=x-col-1;
				break;
			}
		}
		if(can){
			return MOVE_R;
		}
		//right-up
		can=true;
		x=col;
		y=row;
		while(true){
			y--;
			if(y%2===0){
				x++;
			}
			nowPot=this.getPot(x,y);
			if(nowPot.frame==1){
				can=false;
				posArr[MOVE_RP]=row-y-1;
				break;
			}
			if(x==7 || y===0){
				break;
			}
		}
		if(can){
			return MOVE_RP;
		}
		//right-down
		can=true;
		x=col;
		y=row;
		while(true){
			y++;
			if(y%2===0){
				x++;
			}
			nowPot=this.getPot(x,y);
			if(nowPot.frame==1){
				can=false;
				posArr[MOVE_RD]=y-row-1;
				break;
			}
			if(x==7 || y==7){
				break;
			}
		}
		if(can){
			return MOVE_RD;
		}
		//如果每个方向都有不可走的点时，再根据哪个方向可走的步数最多才决定走哪个方向
		var maxValue=-1,maxDir=-1;
		for(var i=0,len=posArr.length;i<len;i++){
			if(posArr[i]>maxValue){
				maxValue=posArr[i];
				maxDir=i;
			}
		}
		if(maxValue>0 && maxDir!=-1){
			return maxDir;
		}
		return MOVE_NO;
	},
	gameOver:function(bz){//游戏结束了
		this.mask=mt.create('mask');
		if(bz){//捉到猫了
			this.victory=mt.create('victorygp');
			this.victoryChild=this.victory.mt.children;
			this.victoryChild.stepCount.text=this.stepCount>9 ? this.stepCount : '0'+this.stepCount;
			this.victoryChild.nameshow.text=this.name[3-parseInt(this.stepCount/16)];
			
		}else{//未捉到猫
			this.failed=mt.create('failed');
		}
		this.replay=mt.create('replay');
		this.replay.inputEnabled=true;
		this.replay.events.onInputDown.add(this.replayfn,this);
	},
	replayfn:function(){//重新开始游戏
		this.laugh.pause();
		this.crazy.pause();
		this.game.state.start('play');
	},
	update: function(){
		
	}
};