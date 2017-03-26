window.onload = function(){
	var game = new Phaser.Game(480, 320, Phaser.AUTO, "game-area");
	game.state.add("boot", Boot);
	game.state.add("loading", Loading);
	game.state.add("menu", Menu);
	game.state.add("main", Main);
	game.state.start("boot");
};

function Boot(game){
	this.preload = function() {
		game.load.spritesheet("loading", "assets/img/loading.png", 80, 24);  
	};
	this.create = function() {
		game.state.start("loading");
	}
}

function Loading(game){
	this.preload=function () {
		var loading = game.add.sprite(game.width/2, game.height/2, "loading");
		loading.anchor.setTo(0.5);
		loading.animations.add("loading", [0, 1, 2], 5, true);
		loading.animations.play("loading");

		game.load.audio("sound-start", "assets/sound/sound-start.mp3");
		game.load.audio("sound-fire", "assets/sound/sound-fire2.mp3");
		game.load.audio("sound-hit", "assets/sound/sound-fire.mp3");
		game.load.audio("sound-boom1", "assets/sound/sound-boom1.mp3");
		game.load.audio("sound-boom2", "assets/sound/sound-boom2.mp3");
		game.load.audio("sound-win", "assets/sound/sound-win.mp3");
		game.load.audio("sound-over", "assets/sound/sound-over.mp3");

		game.load.image("title", "assets/img/battlecity2.png");
		game.load.image("over", "assets/img/gameover.png");
		game.load.image("over-2", "assets/img/gameover2.png");

		game.load.spritesheet("tank", "assets/img/player1.png", 16, 16);  
		game.load.spritesheet("enemy", "assets/img/enemy.png", 16, 16); 
		game.load.spritesheet("button-arrow", "assets/img/button-arrow.png", 32, 32);  
		game.load.spritesheet("button-a", "assets/img/button-a.png", 48, 48);  
		
		game.load.spritesheet("bonus", "assets/img/bonus.png", 16, 15);  
		game.load.spritesheet("bore", "assets/img/bore.png", 16, 16);  
		game.load.spritesheet("bullet", "assets/img/bullet.png", 6, 6);  
		game.load.image("explode1", "assets/img/explode1.png");
		game.load.image("explode2", "assets/img/explode2.png");
		
		game.load.tilemap("levels", "assets/img/levels.json", null, Phaser.Tilemap.TILED_JSON);
		game.load.image("tile", "assets/img/tile.png");  
	};
	this.create=function () {
		game.state.start("menu");
	};
}

function Menu(game) {
	this.preload = function() {
		game.levelData = {
			current:0,
			levels:[
				[1,30,3],
				[2,50,5],
				[3,100,5]
			]};
		if(!game.device.desktop){
			this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
			this.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
			this.scale.startFullScreen();
		}
	};
	this.create = function() {
		game.add.sprite((game.width)/2, (game.height)/2, "title").anchor.setTo(0.5);
		game.add.text((game.width)/2, 300, "按空格键开始", {fontSize: "16px", fill: "#fff" }).anchor.setTo(0.5);  
		var enterKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		enterKey.onDown.add(function(){game.state.start("main");}, this);
		game.input.onTap.addOnce(function(){game.state.start("main");}, this);
	};
}

function Main(game){
	var _levelInfo;
	var isOver;

	var map;
	var levelLayer;
	var player;  
	var facing;
	var enemyGroup;
	var enemyNum;  

	var cursors;  
	var actKey;
	var touchLeft  = false;
	var touchRight = false;
	var touchUp    = false;
	var touchDown  = false;

	var myFires;  
	var enemyFires;  
	var explodes;  

	var scoreText;
	var score;
	
	var soundStart;
	var soundWin;
	var soundOver;
	var soundFire;
	var soundHit;
	var soundBoom1;
	var soundBoom2;

	this.preload = function() {
		_levelInfo = game.levelData.levels[game.levelData.current];
		enemyNum = _levelInfo[1];
		facing = 0;
		score = enemyNum;
		isOver = false;
	}
	this.create = function(){
		game.physics.startSystem(Phaser.Physics.ARCADE); 

		soundStart = game.add.audio("sound-start");
		soundFire  = game.add.audio("sound-fire");
		soundHit = game.add.audio("sound-hit");
		soundBoom1 = game.add.audio("sound-boom1");
		soundBoom2 = game.add.audio("sound-boom2");
		soundWin = game.add.audio("sound-win");
		soundOver = game.add.audio("sound-over");
		soundStart.play();

		map = game.add.tilemap("levels");
		map.addTilesetImage("tile");
		map.playTimer = 0;
		map.playIndex = 0;
		
		enemies = game.add.group();
		enemies.enableBody = true;
		for (var i=0; i<8; i++){
			var imgID=parseInt(i/4)*32+(i%4)*2;
			var enemy = enemies.create(0, 0, "enemy",imgID).kill();  
			enemy.animations.add("up",[imgID, imgID + 1], 5, true); 
			enemy.animations.add("right",[imgID + 8, imgID + 9], 5, true); 
			enemy.animations.add("down",[imgID + 16, imgID + 17], 5, true);
			enemy.animations.add("left",[imgID + 24, imgID + 25], 5, true);
			enemy.body.collideWorldBounds = true;
			enemy.timeToMove = 0;
		}
		//创建主角
		player = game.add.sprite(26*8,38*8, "tank",0);  
		game.physics.arcade.enable(player,Phaser.Physics.ARCADE);  
		player.body.collideWorldBounds = true;
		player.animations.add("up", [0, 1], 5, true); 
		player.animations.add("right",[8, 9], 5, true); 
		player.animations.add("down",[16, 17], 5, true);
		player.animations.add("left", [24, 25], 5, true);

		levelLayer = map.createLayer("level-"+_levelInfo[0]);
		map.setCollisionByExclusion([5,6],true,levelLayer);
		levelLayer.resizeWorld();

		//按键
		cursors = game.input.keyboard.createCursorKeys();
		actKey  = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		actKey.onDown.add(this.actKeyDown, this);

		myFires = game.add.group();  
		myFires.enableBody = true;
		for (var i=0;i<2;i++){  //这里限制发弹数量
			var fire = myFires.create(0,0,"bullet",0).kill();
			fire.checkWorldBounds = true;
			fire.outOfBoundsKill = true;
		}
		enemyFires = game.add.group();
		enemyFires.enableBody = true;
		explodes = game.add.group(); //爆炸效果
		explodes.enableBody = true;

		bores = game.add.group();//这个就叫它敌机生成器吧
		bores.enableBody = true;
		bores.create(0,0,"bore",0).kill();

		if(!game.device.desktop){
			this.addTouchKey(); //移动端显示虚拟按键
		}
		scoreText = game.add.text(16, 16, "Enemy: " + score, { fontSize: "16px", fill: "#fff" });  
		scoreText.fixedToCamera=true;  
	};
	this.update = function(){
		game.physics.arcade.collide(player, levelLayer, this.bossHit, null, this); 
		game.physics.arcade.collide(enemies, levelLayer, this.bossHit, null, this); 
		game.physics.arcade.overlap(player, enemies, this.tankHit, null, this); 

		game.physics.arcade.overlap(player, enemyFires, this.fireHit, null, this); 
		game.physics.arcade.overlap(enemies, myFires, this.fireHit, null, this);

		game.physics.arcade.overlap(myFires, levelLayer, this.tileHit, null, this); 
		game.physics.arcade.overlap(enemyFires, levelLayer, this.tileHit, null, this); 

		player.body.velocity.setTo(0,0);
		if(!isOver){
			if(cursors.right.isDown || touchRight){ 
				this.playerMove(8,0);
				player.animations.play("right");
				facing=1;
			}else if(cursors.left.isDown || touchLeft){
				this.playerMove(-8,0);
				player.animations.play("left");
				facing=3;
			}else if(cursors.up.isDown || touchUp){
				this.playerMove(0,-8);
				player.animations.play("up");
				facing=0;
			}else if(cursors.down.isDown || touchDown){
				this.playerMove(0,8);
				player.animations.play("down");
				facing=2;
			}else{
				player.animations.stop();
			}
			enemies.forEachAlive(this.enemyMove,this);
			//this.mapTilePlay(); // 水的动画效果
			this.enemyMake();
		}
	};
	this.playerMove = function(xx,yy){
		player.x = (yy!=0) ? Math.round(player.x/8)*8 : player.x;
		player.y = (xx!=0) ? Math.round(player.y/8)*8 : player.y;
		player.body.velocity.setTo(xx*8,yy*8);
	};
	this.enemyMove = function(enemy){
		if(game.time.now>=enemy.timeToMove){
			var go = parseInt(Math.random()*7);
			go = go>3 ? go-3 : go; // 减少几率往上
			enemy.body.velocity.setTo((go==1?8:go==3?-8:0)*5,(go==0?-8:go==2?8:0)*5);
			enemy.animations.play(["up","right","down","left"][go]);
			enemy.timeToMove=game.time.now+Math.random()*2000;
			if(Math.random() < 0.5){  // 随机开炮...
				var xx = enemy.x+(go==3?0:go==1?10:5);
				var yy = enemy.y+(go==0?0:go==2?10:5);
				soundFire.play();
				var fire = enemyFires.getFirstDead(true, xx, yy,"bullet",go);
				fire.body.velocity.setTo((go==1?8:go==3?-8:0)*20,(go==2?8:go==0?-8:0)*20);
				fire.checkWorldBounds = true;
				fire.outOfBoundsKill = true;
			}
		}
	};
	this.explodePlay = function(xx,yy,imageKey,soundKey,timer){
		if(timer==undefined){timer=100;}
		if(soundKey=="hit"){
			soundHit.play();
		}else if(soundKey=="boom1"){
			soundBoom1.play();
		}else if(soundKey=="boom2"){
			soundBoom2.play();
		}
		var boom = explodes.getFirstDead(true,xx,yy,imageKey);
		boom.anchor.setTo(0.5);
		boom.scale.setTo(0.5);
		game.add.tween(boom.scale).to({x:1,y:1},timer,"Linear",true).onComplete.add(function(){boom.kill();},this);
	};

	this.fireHit = function(tank, fire){
		this.explodePlay(fire.x+(fire.frame==3?0:fire.frame==1?6:3),fire.y+(fire.frame==0?0:fire.frame==2?6:3),"explode1");
		fire.kill();
		// 这里可以增加生命值判断，再决定是否要Kill
		this.explodePlay(tank.x+8,tank.y+8,"explode2","boom1");
		tank.kill();
		if(player.alive){ // 因为这个方法是共用的，先判断一下死的是谁
			score--;
			scoreText.text = "Enemy: " + score;
			if(score==0){
				this.gameWin();
			}
		}else{
			this.gameOver();
		}
	}; 
	this.tankHit = function(tank, tank2){
		this.explodePlay(tank.x+8,tank.y+8,"explode2","boom1");
		tank.kill();
		this.gameOver();
	}; 
	this.tileHit = function(fire, tile){
		if([1,2,3,4].indexOf(tile.index) > -1){  //可以打掉的地图块
			if(tile.life==undefined){
				tile.life = (tile.index==3 || tile.index==4) ? 5 : 2; //地图块生命：铁块5、砖块2
			}
			tile.life--;
			if((tile.life<=0)){
				map.removeTile(tile.x,tile.y,levelLayer);
			}
			this.explodePlay(fire.x+(fire.frame==3?0:fire.frame==1?6:3),fire.y+(fire.frame==0?0:fire.frame==2?6:3),"explode1","hit");
			fire.kill();
		}
		if([11,12,25,26].indexOf(tile.index) > -1){  //打到Boss
			map.swap(11,13,tile.x-1,tile.y-1,3,3);
			map.swap(12,14,tile.x-1,tile.y-1,3,3);
			map.swap(25,27,tile.x-1,tile.y-1,3,3);
			map.swap(26,28,tile.x-1,tile.y-1,3,3);
			this.explodePlay(fire.x+(fire.frame==3?0:fire.frame==1?6:3),fire.y+(fire.frame==0?0:fire.frame==2?6:3),"explode2","boom2",300);
			fire.kill();
			player.kill();
			this.gameOver();
		}
	}; 
	this.bossHit = function(tank, tile){
		if([11,12,25,26].indexOf(tile.index) > -1){
			map.swap(11,13,tile.x-1,tile.y-1,3,3);
			map.swap(12,14,tile.x-1,tile.y-1,3,3);
			map.swap(25,27,tile.x-1,tile.y-1,3,3);
			map.swap(26,28,tile.x-1,tile.y-1,3,3);
			this.explodePlay(tile.worldx,tile.worldy,"explode2","boom2",300);
			player.kill();
			this.gameOver();
		}
	}; 
	this.mapTilePlay = function(){
		if(game.time.now>=map.playTimer){
			map.replace(map.playIndex + 7,(map.playIndex+1)%4 + 7);//对性能有一定影响(也许还有其他方法可以实现)
			map.playIndex = (map.playIndex+1)%4;
			map.playTimer = game.time.now + 500;
		}
	};
	this.actKeyDown = function(){
		if(isOver){
			if(player.alive){ //活着？下一关
				if(game.levelData.current < game.levelData.levels.length){
					game.state.start("main");
				}else{
					game.state.start("menu");
				}
			}else{
				game.state.start("menu");
			}
		}
		if(!player.alive){return;}
		var fire = myFires.getFirstDead(false,player.x+(facing==3?0:facing==1?10:5), player.y+(facing==0?0:facing==2?10:5),"bullet",facing);
		if(fire!=null){
			soundFire.play();
			fire.body.velocity.setTo((facing==1?8:facing==3?-8:0)*20,(facing==2?8:facing==0?-8:0)*20);
		}
	};
	this.enemyMake = function(){
		if(enemyNum==0){return;}
		if(enemies.countDead()>0 && bores.countDead()>0){
			var xx = parseInt(Math.random()*4)*152;
			var bore = bores.getFirstDead(true,xx,0,"bore",0);
			var anim = bore.animations.add("go", [0,1,2,3,2,1,0,1,2,3,2,1,0]);
			anim.onComplete.add(function(sprite){
				enemies.getFirstDead(false,sprite.x,sprite.y);
				enemyNum--;
				sprite.kill();
			}, this);
			anim.play(10, false);
		}
	};

	this.gameOver = function(){
		soundOver.play();
		enemyFires.setAll('alive',false);
		myFires.setAll('alive',false);
		var over = myFires.getFirstDead(true,(game.width-32)/2, 320, "over-2");
		game.add.tween(over).to({y:304},1000,"Linear",true).onComplete.add(function(){
			game.add.sprite((game.width)/2, (game.height)/2, "over").anchor.setTo(0.5);
			game.add.text((game.width)/2, (game.height)/2, "按空格键返回", {fontSize: "16px", fill: "#fff" }).anchor.setTo(0.5);
			isOver = true;
		},this);
	}; 
	this.gameWin = function(fire, tile){
		soundWin.play();
		enemyFires.setAll('alive',false);
		myFires.setAll('alive',false);
		game.add.sprite((game.width)/2, (game.height)/2, "over").anchor.setTo(0.5);
		game.add.text((game.width)/2, (game.height)/2, "按空格键进入下一关", {fontSize: "16px", fill: "#fff" }).anchor.setTo(0.5);
		game.levelData.current++;
		isOver = true;
	}; 
	this.addTouchKey = function(){
		var buttonfire = game.add.button(game.width-50, game.height-50, 'button-a', null, this, 0, 1, 0, 1);
		buttonfire.fixedToCamera = true;
		buttonfire.events.onInputDown.add(this.actKeyDown,this);

		var buttonleft = game.add.button(0, game.height-55, 'button-arrow', null, this, 0, 1, 0, 1);
		buttonleft.fixedToCamera = true;
		buttonleft.events.onInputOver.add(function(){touchLeft=true;});
		buttonleft.events.onInputDown.add(function(){touchLeft=true;});
		buttonleft.events.onInputOut.add(function(){touchLeft=false;});
		buttonleft.events.onInputUp.add(function(){touchLeft=false;});

		var buttonright = game.add.button(98, game.height-55, 'button-arrow', null, this, 0, 1, 0, 1);
		buttonright.fixedToCamera = true;
		buttonright.scale.setTo(-1,1);
		buttonright.events.onInputOver.add(function(){touchRight=true;});
		buttonright.events.onInputDown.add(function(){touchRight=true;});
		buttonright.events.onInputOut.add(function(){touchRight=false;});
		buttonright.events.onInputUp.add(function(){touchRight=false;});

		var buttonup = game.add.button(65, game.height-65-14, 'button-arrow', null, this, 0, 1, 0, 1);
		buttonup.angle = 90;
		buttonup.scale.x = 1.2;
		buttonup.fixedToCamera = true;
		buttonup.events.onInputOver.add(function(){touchUp=true;});
		buttonup.events.onInputDown.add(function(){touchUp=true;});
		buttonup.events.onInputOut.add(function(){touchUp=false;});
		buttonup.events.onInputUp.add(function(){touchUp=false;});

		var buttondown = game.add.button(33, game.height, 'button-arrow', null, this, 0, 1, 0, 1);
		buttondown.angle = 270;
		buttondown.scale.x = 1.2;
		buttondown.fixedToCamera = true;
		buttondown.events.onInputOver.add(function(){touchDown=true;});
		buttondown.events.onInputDown.add(function(){touchDown=true;});
		buttondown.events.onInputOut.add(function(){touchDown=false;});
		buttondown.events.onInputUp.add(function(){touchDown=false;});
	};

}
