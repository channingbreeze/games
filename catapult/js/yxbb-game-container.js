/**
*Pahser弹弓游戏
* 作者：漫画_郎
*
*/
//游戏的配置会在yxbb-gameenter.js中获取
var game = new Phaser.Game(1680,1050, Phaser.AUTO, 'gameContainer');
var scratch = {
	init:function(){
		game.stage.disableVisibilityChange = true;
		this.life = this.configs.life;
	},
	preload:function(){
		game.load.image('prize1', 'assets/prize.png');
		game.load.image('prize2', 'assets/pig.png');
		game.load.image('prize3', 'assets/prize.png');
		game.load.image('prize4', 'assets/pig.png');
		game.load.image('prize', 'assets/pig.png');
		
		game.load.image('slingshot', 'assets/slingshot.png');
		game.load.image('slingshota', 'assets/slingshota.png');
		game.load.image('cloth', 'assets/cloth.png');
		game.load.image('bg', 'assets/bg.jpg');

		game.load.spritesheet('bullet', 'assets/bullet.png',196,205);
		game.load.spritesheet('player', 'assets/baddie.png', 32,32,4);
		game.load.spritesheet('man', 'assets/spaceman.png', 16,16);
		game.load.spritesheet('dude', 'assets/dude.png', 32,48);
		game.load.spritesheet('myexplode', 'assets/myexplode.png', 40,40,3);
		game.load.audio('attack', ['assets/audio/attack_boss.mp3']);
		game.load.audio('try_mp3', ['assets/audio/try.mp3']);
		game.load.audio('courtship_mask', ['assets/audio/courtship_mask.mp3']);
		game.load.audio('win_pig', ['assets/audio/win_pig.mp3']);

		//屏幕适配
		game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
	},
	create:function(){
		game.stage.backgroundColor = "#eee";
		game.physics.startSystem(Phaser.Physics.ARCADE); 
		//奖品随机区域
		this.prizeRangeGroup = game.add.group();
		//背景组
		this.bgGroup = game.add.group();
		//弹弓组
		this.slingshotGroup = game.add.group();
		//添加奖励随机的区域
		this.addPrizeRange();
		//奖品组
		this.prizeGroup = game.add.group();
		//炮弹组
		this.bulletGround = game.add.group();
		//弹弓布组
		this.clothGroup = game.add.group();


		this.attackAudio = game.add.audio('attack');
		this.attackAudio.allowMultiple = false;
		this.tryMp3Audio = game.add.audio('try_mp3');
		this.tryMp3Audio.allowMultiple = false;
		this.courtshipMaskAudio = game.add.audio('courtship_mask');
		this.courtshipMaskAudio.allowMultiple = false;
		this.winPigAudio = game.add.audio('win_pig');
		this.winPigAudio.allowMultiple = false;


		//添加背景
		this.addBg();
		//添加炮弹
		this.addBullet();
		//添加弹弓
		this.addSlingshot();
		//添加奖品
		this.addPrize();

		this.leftPointer = {x:this.slingshotaLeft.x,y:this.slingshotaLeft.y};
		this.rightPointer = {x:this.slingshotaRight.x,y:this.slingshotaRight.y};

    	

	},
	update:function(){

		//鼠标当前的位置
		var x = game.input.activePointer.x;
		var y = game.input.activePointer.y;
	
		if(this.bullet && this.bullet.stop){
			// this.myexplode.x = this.bullet.x;
			// this.myexplode.y = this.bullet.y;
		}

	},
	render:function(){
		

	},
	playTry:function(){
		this.courtshipMaskAudio.play();
	},
	onDragStop:function(){
		this.cloth.x = game.world.centerX;
		this.cloth.y = 896;
		//重新计算弹弓绳子的位置
		this.changeGraphicsPosition();


		this.bullet.stop = false;
		var centerX = this.leftPointer.x + (this.rightPointer.x - this.leftPointer.x)/2;
		//斜角边
		// var centerZ = this.rightPointer.y*his.rightPointer.y + centerX*centerX;

		var x = centerX - this.bullet.x;
		var y = this.bullet.y - this.rightPointer.y;
		var z = Math.sqrt(x*x + y*y);
		var sinA = x/z;
		var cosA = y/z;
		//延长线的长度
		var xz = z * 7;
		//延长线的x坐标=centerX + 水平直角边的长度
		var xx = centerX + (sinA * xz);
		//延长线的y坐标=centerY - 垂直直角边的长度
		var xy = this.rightPointer.y - (cosA * xz);

		var tweenUp = game.add.tween(this.bullet).to( { x:xx  ,y:xy}, 290, null);
		var tween1 = game.add.tween(this.bullet.scale).to( { x:0.2  ,y:0.2}, 400, null,true);

		var tweenDown = game.add.tween(this.bullet).to( { y: xy + 150 }, 225, null);

	    // 结束的时候回调此函数
	    tweenDown.onComplete.add(this.tweenDownComplete, this);
		tweenUp.chain(tween1);
		tween1.chain(tweenDown);
		tweenUp.start();
		this.attackAudio.play();

		//重置炮弹和弹弓的角度
    	this.cloth.rotation = 0;
		this.bullet.rotation = 0;


	},
	gotoOver:function(){
	    this.myexplode.alpha = 0;
	},
	tweenDownComplete:function(){
		var anm = this.bullet.animations.play('bullet');
		anm.onComplete.add(function(){
		    this.bullet.frame = 0; 
		    this.bullet.kill();
		}, this);
		// this.addQuake();

		this.bullet.stop = true;
		var currPrize = this.checkOverlap(this.prizeGroup, this.bulletGround);

		
		if(currPrize){
			console.log("获得奖励：" + ",ID:" + currPrize.yxbbPrizeId + "," + currPrize.yxbbPrizeName);
			currPrize.kill();
			this.gameSuccess();
		}else{
			this.gameFail();
		}
	},
	gameSuccess:function(){
		this.winPigAudio.play();
		alert("成功");
	},
	gameFail:function(){
		// goFail();
		console.log("失败");
		this.tryMp3Audio.play();
		//定时器跳转下一关
    	this.timer = game.time.create(false);
    	//生命减少
    	this.life--;
    	if(this.life <= 0){
	    	//3秒后跳转
	    	this.timer.add(2000, function(){
				alert('游戏介绍（10次机会全部用完）');
	    	}, this);
	    	this.timer.start();
    	}else{
    		//如果还有生命则继续游戏
    		//2秒后重新装弹
	    	this.timer.add(1000, function(){
    			this.addBullet();
	    	}, this);
	    	this.timer.start();
    	}
	},
	onDragUpdate:function(){
		this.cloth.x = this.bullet.x;
		this.cloth.y = this.bullet.y + 25;
		//this.cloth.angle = game.world.centerX - this.cloth.x; //旋转角度
		this.changeGraphicsPosition();
	},
	changeGraphicsPosition:function(){
		var centerX = this.slingshotaLeft.x + (this.slingshotaRight.x - this.slingshotaLeft.x)/2;
		var x = centerX - this.cloth.x;
		var y = this.cloth.y - this.slingshotaRight.y;
		var z = Math.sqrt(x*x + y*y);
		var sinA = x/z;

		var h = this.cloth.width/2;

		var p1 = {};
		p1.x = this.cloth.x;
		p1.y = this.cloth.y;
		var p2 = {};
		p2.x = centerX;
		p2.y = this.slingshotaRight.y;
		var p = getVerticalLineByP1(p1,p2,h);

		// var cosA = y/z;
		this.cloth.rotation = Math.asin(sinA);
		this.bullet.rotation = Math.asin(sinA);
		this.graphicsLeft.clear();
		// this.graphicsLeft.lineStyle(5,0x451c06,1);
		this.graphicsLeft.lineStyle(5,0x522000,1);
		this.graphicsLeft.moveTo(this.slingshotaLeft.x,this.slingshotaLeft.y + 9);
		
		this.graphicsLeft.lineTo(p.p1.x,p.p1.y);
		this.graphicsLeft.endFill();

		this.graphicsRight.clear();
		this.graphicsRight.lineStyle(5,0x522000,1);
		this.graphicsRight.moveTo(this.slingshotaRight.x + 3,this.slingshotaRight.y + 9);
		this.graphicsRight.lineTo(p.p2.x,p.p2.y);
		this.graphicsRight.endFill();
	},
	addBullet:function(){
		this.bullet = this.bulletGround.getFirstExists(false, true, game.world.centerX,890,"bullet");

		this.bullet.animations.add('bullet', [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17], 400, false);
		this.bullet.anchor.set(0.5);
		this.bullet.scale.set(0.4);
		this.bullet.inputEnabled = true;
		this.bullet.stop = false;
		this.bullet.input.enableDrag();
		this.bullet.outOfBoundsKill = true;

 
		this.bullet.events.onDragUpdate.add(this.onDragUpdate, this);
		this.bullet.events.onDragStop.add(this.onDragStop, this); 
		//graphics.drawCircle(this.circle1.x,this.circle1.y,this.circle1.diameter);
		//弹弓的拖拽范围
		//this.circleShp = new Phaser.Circle(game.world.centerX, 850,310);
		var boundsW = 300;
    	this.circleShp = new Phaser.Rectangle(this.world.centerX - boundsW/2, 850, boundsW, 200);
		//this.bullet.input.boundsSprite = this.circleShp;//边界
		this.bullet.input.boundsRect  = this.circleShp;//边界
		


	    //炮弹的入场动画
		var tweenUp = game.add.tween(this.bullet).from( {y:0,angle:720}, 500, null);
		var tween1 = game.add.tween(this.bullet.scale).from( { x:1.2  ,y:1.2}, 400, null,true);
		
		// 结束的时候回调此函数:playTry播放
	    tweenUp.onComplete.add(this.playTry, this);

		tweenUp.start();
		tween1.start();

	}
};

scratch.addSlingshot = function(){
		this.slingshot = this.slingshotGroup.create(game.world.centerX,900,"slingshot");
		this.slingshot.anchor.set(0.5);

		this.slingshotaLeft = this.slingshotGroup.create(game.world.centerX-76,836,"slingshota");
		this.slingshotaLeft.anchor.set(0.5);

		this.slingshotaRight = this.slingshotGroup.create(game.world.centerX+76,836,"slingshota");
		this.slingshotaRight.anchor.set(0.5);

		//弹弓布
		this.cloth = this.clothGroup.create(game.world.centerX,896,"cloth");
		this.cloth.anchor.set(0.5);

		//画弹弓的两条绳子
		this.graphicsLeft = game.add.graphics(0,0);
		// this.graphicsLeft.lineStyle(8,0xAE7000,1);
		this.graphicsLeft.lineStyle(8,0xffffff,1);
		this.graphicsRight = game.add.graphics(0,0);
		this.graphicsRight.lineStyle(8,0xffffff,1);

		this.changeGraphicsPosition();

}


scratch.addBg = function(){
	this.bgSprite = game.add.sprite(0,0,"bg");
	this.bgGroup.addChild(this.bgSprite);
}

scratch.addPrize = function(){
	//获得游戏奖品信息
	var prizes = [{ "id": 1,"name": "小猪1","isWin": true},
					{ "id": 2,"name": "小猪2","isWin": true},
					{ "id": 3,"name": "小猪3","isWin": true},
					{ "id": 4,"name": "小猪4","isWin": true}]
	//精灵的高度
	var prizesImage = game.cache.getImage('prize');
	if(prizes && prizes.length > 0){
		for(var i = 0; i < prizes.length; i ++){
			//getRandomPointByRect
			var currPrize = prizes[i];
			var bounds = this.graphicSprizeRange.getBounds();
			var p = this.getNextPrize(bounds.x,bounds.y,bounds.width - prizesImage.width,bounds.height - prizesImage.height*2,currPrize.id);

			p.yxbbPrizeId = currPrize.id;
			p.yxbbPrizeName = currPrize.name;
			this.prizeGroup.addChild(p);
		}
	}
};

//创建奖品随机区域
scratch.addPrizeRange = function(){
	this.graphicSprizeRange = game.make.graphics(0,0);
	this.graphicSprizeRange.beginFill(0xFF0000, 1);
	this.graphicSprizeRange.drawRect(this.world.centerX - 400,10,900,240);
	this.graphicSprizeRange.endFill();
	this.prizeRangeGroup.addChild(this.graphicSprizeRange);
};


//检测重叠
scratch.checkOverlap = function(group1, group2){
	for(var i = group1.length - 1; i >= 0; i --){
		var boundsA = group1.getChildAt(i).getBounds();
		for(var j = group2.length - 1; j >= 0; j --){
			var boundsB = group2.getChildAt(j).getBounds();
			if(Phaser.Rectangle.intersects(boundsA, boundsB)){
				return group1.getChildAt(i);
			}
		}
	}
	return null;
};
//获得一个位置随机的奖品，但是不能发生边缘重叠
scratch.getNextPrize = function(x,y,width,height,id){
	var currPoint = this.getRandomPointByRect(x,y,width,height);
	// console.log("x:" + x + ",y:" + y + ",width:" + width + ",height:" + height);
	var p = game.add.sprite(currPoint.x,currPoint.y,"prize"+id);
	p.anchor.set(0.5);
	var overSprite = this.checkOverlapSprite(this.prizeGroup, p);
	if(overSprite){
		p.destroy();
		return this.getNextPrize(x,y,width,height,id);
	}else{
		return p;
	}
}

//检测重叠
scratch.checkOverlapSprite = function(group1, sprite){
	sprite.updateTransform();
	var boundsB = sprite.getBounds();
	for(var i = group1.length - 1; i >= 0; i --){
		group1.getChildAt(i).updateTransform();
		var boundsA = group1.getChildAt(i).getBounds();
		group1.getChildAt(i).anchor.set(0.5);
		sprite.anchor.set(0.5);
		if(Phaser.Rectangle.intersects(boundsA, boundsB)){
			return true;
		}
	}
	return false;
};

//地震
scratch.addQuake = function(){
	//振幅
	var rumbleOffset = 10;
	//设置动画参数
	var properties = {x:game.camera.x + rumbleOffset};
	var duration = 100;
	var repeat = 4;
	var ease = Phaser.Easing.Bounce.InOut;
	var autoStart = false;
	var delay = 0.1;
	var yoyo = true;
	//动画
	var quake = game.add.tween(game.camera).to(properties, duration, ease,autoStart,delay,1,yoyo);
	
	// 开始动画
    quake.start();

}

/**
*求矩形内随机一点
* x：左上顶点x轴坐标
* y：左上顶点y轴坐标
* width: 宽度
* height: 高度
*
*/

scratch.getRandomPointByRect = function(x,y,width,height){
	var minX = x;
	var maxX = x + width;
	var minY = y + height;
	var maxY = y;

	var randomX = game.rnd.between(minX,maxX);
	var randomY = game.rnd.between(minY,maxY);
	return {x:randomX, y:randomY};
}


//游戏的配置
scratch.configs = {
	life:10
};

game.state.add('scratch', scratch);
game.state.start('scratch', true);