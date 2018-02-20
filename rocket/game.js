onload=function(){
	var gameState = function(game){
		var gammadirection=0;
		var obstacles;//障碍物 0为背景
		var stars;//星星
		var ship;//飞船
		var emitter;
		var explosion;
		var btnHome;
		var isStart = false;
		var scaleX, scaleY;
		var topScore=0;
		this.init=function(){ 
			scaleX = document.body.offsetWidth / game.world.width;
			scaleY = window.innerHeight  / game.world.height;
			game.scale.scaleMode=Phaser.ScaleManager.USER_SCALE;
			game.scale.setUserScale(scaleX,scaleY);
			topScore = localStorage.getItem("topScore")==null?0:localStorage.getItem("topScore");
			console.log(topScore);
		}
		this.preload=function(){
			game.load.image('bg','assets/bg2.png');
			game.load.image('title','assets/title-sheet0.png');
			game.load.image('b_play','assets/b_play-sheet0.png');
			game.load.image('ship','assets/ship-sheet0.png');
			game.load.spritesheet('b_settings','assets/b_settings-sheet0.png',256,121);
			game.load.image('particles','assets/particles.png');
			game.load.spritesheet('b_set_part','assets/b_set_part.png',209,165);
			game.load.atlas('obstacles', 'assets/obstacles.png', 'assets/obstacles.json');
			game.load.atlas('explosion', 'assets/explosion.png', 'assets/explosion.json');
			game.load.image('star','assets/star-sheet0.png');
			game.load.image('b_rr-sheet0','assets/b_rr-sheet0.png');
		}
		this.create=function(){
 			game.physics.startSystem(Phaser.Physics.ARCADE);
 			var bg = game.add.group();
			obstacles = game.add.group();
			obstacles.enableBody = true;
			obstacles.setAll('outOfBoundsKill', true);
    		obstacles.setAll('checkWorldBounds', true);
			stars = game.add.group();
			stars.enableBody = true;
			stars.setAll('outOfBoundsKill', true);
    		stars.setAll('checkWorldBounds', true);
			var background = game.add.tileSprite(0, 0, game.world.width, game.world.height, 'bg');//±³¾°¶¯Ì¬
			background.autoScroll(0,12);
			bg.add(background);
			var title = game.add.image(0,0,'title');
			title.scale.setTo(.5);
			title.x = game.world.centerX - title.width/2;
			title.y = title.height;
			var b_play = game.add.image(0,0,'b_play');
			b_play.scale.setTo(.5);
			b_play.x = game.world.centerX - b_play.width/2;
			b_play.y = game.world.centerY - b_play.height/1.2;
			b_play.inputEnabled = true;
			var b_settings = game.add.image(0,0,'b_settings');
			b_settings.scale.setTo(.5);
			b_settings.x = game.world.centerX - b_settings.width/3.4;
			b_settings.y = game.world.centerY + b_settings.height * 1.2;
			b_settings.frame = 0;
			b_settings.inputEnabled = true;
			ship = game.add.sprite(0,0,'ship');
			game.physics.arcade.enable(ship);
			//ship.body.immovable = true;
			ship.score = 0;
			ship.scale.setTo(.7);
			ship.x = game.world.centerX - ship.width/2;
			ship.y = game.world.height - ship.height * 2.5;
		    emitter = game.add.emitter(ship.x + ship.width/2, ship.y + ship.height + 10, 250);
		    emitter.makeParticles('particles');
		    emitter.setXSpeed(0, 0);
		    emitter.setYSpeed(100, 100);
		    emitter.bringToTop = true;
		    emitter.setRotation(0, 0);
		    emitter.setAlpha(1, 0, 1000);
		    emitter.setScale(0.5, 0, 0.5, 0, 3000);
		    emitter.start(false, 5000, 50);
		    var b_set_part = game.add.image(0,0,'b_set_part'); 
		    b_set_part.scale.setTo(.5);
		    b_set_part.x = game.world.centerX - b_set_part.width/2;
			b_set_part.y = game.world.centerY - b_set_part.height/1.2;
			b_set_part.inputEnabled = true;
			var b_settings_back = game.add.image(0,0,'b_settings');
			b_settings_back.scale.setTo(.5);
			b_settings_back.x = game.world.centerX - b_settings_back.width/3.4;
			b_settings_back.y = game.world.centerY + b_settings_back.height * 1.2;
			b_settings_back.frame = 1;
			b_settings_back.inputEnabled = true;
			b_set_part.kill();
			b_settings_back.kill();
			b_settings.events.onInputDown.add(function(){
				//显示设置界面
				title.kill();
				b_play.kill();
				b_settings.kill();
				b_set_part.reset();
			    b_set_part.x = game.world.centerX - b_set_part.width/2;
				b_set_part.y = game.world.centerY - b_set_part.height/1.2;
				b_settings_back.reset();
				b_settings_back.x = game.world.centerX - b_settings_back.width/3.4;
				b_settings_back.y = game.world.centerY + b_settings_back.height * 1.2;
			});
			b_settings_back.events.onInputDown.add(function(){
				//返回菜单界面
				title.reset();
				title.x = game.world.centerX - title.width/2;
				title.y = title.height;
				b_play.reset();
				b_play.x = game.world.centerX - b_play.width/2;
				b_play.y = game.world.centerY - b_play.height/1.2;
				b_settings.reset();
				b_settings.x = game.world.centerX - b_settings.width/3.4;
				b_settings.y = game.world.centerY + b_settings.height * 1.2;
				b_set_part.kill();
				b_settings_back.kill();
			});
			b_set_part.events.onInputDown.add(function(){
				if (b_set_part.frame == 0) {
					b_set_part.frame = 1;
					emitter.alpha = 0;
				} else {
					b_set_part.frame = 0;
					emitter.alpha = 1;
				}
			});
			b_play.events.onInputDown.addOnce(function(){
				//Game Start
				title.destroy();
				b_play.destroy();
				b_settings.destroy();
				b_set_part.destroy();
				b_settings_back.destroy();
				game.add.tween(ship).to( { y: -ship.height }, 3000, "Linear", true);
				var tween = game.add.tween(emitter).to( { y: -emitter.height * 54 }, 3300, "Linear", true);
				//当tween完成时，设置角色坐标并创建游戏主程显示对象以及游戏逻辑
				tween.onComplete.add(function(){
					ship.y = game.world.height;
					tween = game.add.tween(ship).to( { y: game.world.height/4*3 }, 3000, "Linear", true);
					tween.onComplete.add(function(){
						twwen = game.add.tween(ship).to( { x: 0 }, 500, "Linear", true);
						if (emitter.alpha == 1){
							game.add.tween(emitter).to( { x: ship.width/2 }, 500, "Linear", true);
						}
						twwen.onComplete.add(function(){
							isStart = true;
							ship.scoreText = game.add.text(0,0,ship.score);
							ship.scoreText.fill = "white";
							ship.scoreText.scale.setTo(2);
							ship.scoreText.x = game.world.centerX - ship.scoreText.width / 2;
							ship.scoreText.y = game.world.centerY/2 - ship.scoreText.height/2;
							ship.scoreText.alpha = 0.3;
			    			btnHome = game.add.image(0,0,'b_rr-sheet0');
			    			btnHome.scale.setTo(.5);
			    			btnHome.x = game.world.centerX - btnHome.width / 2;
							//btnHome.y = game.world.centerY / 1.5;//作为高分榜
							btnHome.y = game.world.centerY * 1.25;
							btnHome.inputEnabled = true;
							btnHome.events.onInputDown.addOnce(function(){
								game.state.start('main');
							});
							btnHome.alpha = 0;
					    	explosion = game.add.image(-game.world.centerX,-game.world.centerY,'explosion');
					    	explosion.scale.setTo(0.5);
					    	explosion.animations.add('explode');
						});
					});
					if(emitter.alpha == 0){
						emitter.destroy();
					} else {
						emitter.y = ship.y + ship.height + 10;
						game.add.tween(emitter).to( { y: game.world.height/4*3 + ship.height + 10 }, 3300, "Linear", true);
					}
				});
			});
		}
		var dt = 0;
	    this.update = function(){									//游戏逻辑
	    	if (isStart == false) {return false;}					//限定游戏开始才执行
	    	if (gammadirection > 0) {
	    		//RIGHT
				game.add.tween(ship).to( { x: game.world.width - ship.width }, 100, "Linear", true);
				game.add.tween(emitter).to( { x: game.world.width - ship.width + ship.width/2 }, 100, "Linear", true);
				//ship.body.velocity.x = 300;
				//emitter.body.velocity.x = 300;
	    	} else{
	    		//LEFT
				game.add.tween(ship).to( { x: 0 }, 100, "Linear", true);
				game.add.tween(emitter).to( { x: ship.width/2 }, 100, "Linear", true);
				//ship.body.velocity.x = -300;
				//emitter.body.velocity.x = -300;
	    	}
	    	dt++;													//时间累计
	    	if (dt % 30 == 0) {										//大概500ms
	    		var obstacle = obstacles.create(0,0,'obstacles');	//创建障碍物
	    		obstacle.scale.setTo(.5);
	    		obstacle.frame = game.rnd.between(0,1);				//更改障碍物
	    		obstacle.body.velocity.y = 300;						//下坠速度
	    		if (game.rnd.between(0,1) == 0) {					//设置坐标
	    			obstacle.x = game.rnd.between(0,game.world.centerX);
	    			if (obstacle.frame == 1) {
	    				obstacle.x -= game.world.width / 4;
	    			}
	    		} else{
	    			obstacle.x = game.rnd.between(game.world.centerX,game.world.width - obstacle.width);
	    			if (obstacle.frame == 1) {
	    				obstacle.x += game.world.width / 4;
	    			}
	    		}
	    		var star = stars.create(0,-obstacle.height*1.5,'star');
		    	star.scale.setTo(.5);
		    	star.body.velocity.y = 300;
		    	star.x = game.rnd.between(0,game.world.width - star.width);
	    		
	    	}
	    	for (var i = 0; i < obstacles.length; i++) {
		    	if (checkOverlap(ship, obstacles.getChildAt(i))){//解决 atlas图集碰撞只按第一帧大小
		    		over(obstacles.getChildAt(i));
		    	}
	    	}
	    	game.physics.arcade.overlap(ship, stars, function(ship,self){
	    		ship.score++;
	    		self.destroy();
	    		ship.scoreText.text = ship.score;
	    	}, null, this);
	    } 
	    function deviceOrientationListener(event) {
			gammadirection = Math.round(event.gamma);
		}
		if (window.DeviceOrientationEvent) {
			window.addEventListener("deviceorientation", deviceOrientationListener);
		} else {
			alert("您使用的设备不支持Device Orientation特性");
		}
	    function checkOverlap(spriteA, spriteB) {
	        var boundsA = spriteA.getBounds();
	        var boundsB = spriteB.getBounds();
	        return Phaser.Rectangle.intersects(boundsA, boundsB);
	    }   
	    function over(self){
			localStorage.setItem("topScore",Math.max(ship.score,topScore));
			localStorage.setItem("score",ship.score);
			explosion.x = ship.x;
			explosion.y = ship.y;
			ship.kill();
			if (emitter.alpha == 1) {
			    emitter.destroy();
			}
			self.destroy();
			explosion.animations.play('explode',100);
			//结束界面
			topScore = localStorage.getItem("topScore")==null?0:localStorage.getItem("topScore");
			var text = game.add.text(0,0,"Top:" + topScore);
			text.fill = "white"
			text.fontSize = 64;
			text.x = game.world.centerX - text.width/2;
			text.y = game.world.centerY - text.height;
			game.add.tween(btnHome).from( { x: -game.world.width }, 3000, "Linear", true);
			game.add.tween(btnHome).to( { alpha: 1 }, 3000, "Linear", true);
			isStart = false;
	    }
    }
    var game=new Phaser.Game(420,640,Phaser.Canvas);
    game.state.add('main',gameState);
    game.state.start('main');
}