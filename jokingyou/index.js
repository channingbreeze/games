onload=function(){
	
	var bootState = function(game){
		this.init=function(){ 										
			
		}
		this.preload=function(){
			Phaser.World.prototype.displayObjectUpdateTransform = function() {
				if(!game.scale.correct) {
				this.x = game.camera.y + game.width;
				this.y = -game.camera.x;
				this.rotation = Phaser.Math.degToRad(Phaser.Math.wrapAngle(90));
				} else {
				this.x = -game.camera.x;
				this.y = -game.camera.y;
				this.rotation = 0;
				}
			
				PIXI.DisplayObject.prototype.updateTransform.call(this);
			} 
			game.scale.pageAlignHorizontally = true;
			game.scale.pageAlignVertically = true;
			game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL//EXACT_FIT;//SHOW_ALL;
			if(game.scale.isLandscape) {
				game.scale.correct = true;
				game.scale.setGameSize(WIDTH, HEIGHT);
			} else {
				game.scale.correct = false;
				game.scale.setGameSize(HEIGHT, WIDTH);
			}			
			game.scale.onOrientationChange.add(function() {
				if(game.scale.isLandscape) {
				  game.scale.correct = true;
				  game.scale.setGameSize(WIDTH, HEIGHT);
				} else {
				  game.scale.correct = false;
				  game.scale.setGameSize(HEIGHT, WIDTH);
				}
			}, this)	
		};
		this.create=function(){
			game.state.start('loader'); 							
		}; 
	}

	var loaderState=function(game){
		var progressText;
		this.init=function(){
			Phaser.World.prototype.displayObjectUpdateTransform = function() {
				if(!game.scale.correct) {
				this.x = game.camera.y + game.width;
				this.y = -game.camera.x;
				this.rotation = Phaser.Math.degToRad(Phaser.Math.wrapAngle(90));
				} else {
				this.x = -game.camera.x;
				this.y = -game.camera.y;
				this.rotation = 0;
				}
			
				PIXI.DisplayObject.prototype.updateTransform.call(this);
			} 
			game.scale.pageAlignHorizontally = true;
			game.scale.pageAlignVertically = true;
			game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL//EXACT_FIT;//SHOW_ALL;	
			if(game.scale.isLandscape) {
				game.scale.correct = true;
				game.scale.setGameSize(WIDTH, HEIGHT);
			} else {
				game.scale.correct = false;
				game.scale.setGameSize(HEIGHT, WIDTH);
			}			
			game.scale.onOrientationChange.add(function() {
				if(game.scale.isLandscape) {
				  game.scale.correct = true;
				  game.scale.setGameSize(WIDTH, HEIGHT);
				} else {
				  game.scale.correct = false;
				  game.scale.setGameSize(HEIGHT, WIDTH);
				}
			}, this)

			progressText=game.add.text(game.world.centerX,game.world.centerY+30,'0%',{fill:'#fff',fontSize:'16px'});	
			progressText.anchor={x:0.5,y:0.5};
		};
		this.preload=function(){
			data.images.forEach(function(image){
				if(image.type=='sprite'){
					game.load.image(image.name,image.url);
				}
				if(image.type=='spritesheet'){
					game.load.spritesheet(image.name,image.url,image.w,image.h,image.f);
				}
			});
			
			
			game.load.spritesheet('guy','assets/sprites/player/guy.png',32,32,13);
			game.load.spritesheet('blood','assets/sprites/player/blood.png',32,32,13);
			game.load.image('gameover','assets/sprites/player/gameover.png');

/* 
			game.load.image('wall_0','assets/sprites/blocks/Block001.png');
			game.load.image('wall_1','assets/sprites/blocks/Block002.png');
			game.load.image('wall_2','assets/sprites/blocks/Block003.png');
			game.load.image('wall_3','assets/sprites/blocks/Block004.png');
			game.load.image('wall_4','assets/sprites/blocks/Block005.png');
			game.load.image('wall_5','assets/sprites/blocks/Block006.png');
			game.load.image('wall_6','assets/sprites/blocks/Block007.png'); */

			game.load.image('wall_0','assets/sprites/blocks/a_0.png');
			game.load.image('wall_1','assets/sprites/blocks/a_1.png');
			game.load.image('wall_2','assets/sprites/blocks/a_2.png');
			game.load.image('wall_3','assets/sprites/blocks/a_3.png');
			game.load.image('wall_4','assets/sprites/blocks/a_4.png');
			game.load.image('wall_5','assets/sprites/blocks/a_5.png');
			game.load.image('wall_6','assets/sprites/blocks/a_6.png');

			game.load.image('wall_7','assets/sprites/blocks/b_0.png');
			game.load.image('wall_8','assets/sprites/blocks/b_1.png');
			game.load.image('wall_9','assets/sprites/blocks/b_2.png');
			game.load.image('wall_10','assets/sprites/blocks/b_3.png');
			game.load.image('wall_11','assets/sprites/blocks/b_4.png');
			game.load.image('wall_12','assets/sprites/blocks/b_5.png');
			game.load.image('wall_13','assets/sprites/blocks/b_6.png');

			game.load.image('newYear','assets/sprites/blocks/newYear.png');
			game.load.image('ruhutianyi','assets/sprites/blocks/hunian3.png');
			game.load.image('thanks','assets/sprites/blocks/thanks.png');
			game.load.image('fudai','assets/sprites/blocks/fudai.png');
			game.load.image('fudao','assets/sprites/blocks/fudao.png');
			game.load.image('button','assets/sprites/blocks/button.png');

			game.load.audio('death','assets/sounds/death.wav');
			game.load.audio('jump','assets/sounds/jump.wav');
			game.load.audio('dJump','assets/sounds/djump.wav');
			game.load.audio('spikeTrap','assets/sounds/spiketrap.wav');
			game.load.audio('Megaman','assets/Music/Megaman.ogg');

			game.load.onFileComplete.add(function(progress){															
				progressText.text=progress+'%';
			});

		};
		this.create=function(){
			if (progressText.text=="100%") {																				
				game.state.start('main');
			}
		};
	}

	var score = 0;
	var thanksState = function(game){
		this.create=function(){
			var bgNewYear = this.bgNewYear = game.add.image(0,0,'ruhutianyi');
			bgNewYear.width = game.width;
			bgNewYear.height = game.height;
			var thanks = game.add.image(0,0,'thanks');
			thanks.width = game.width;
			thanks.height = game.height;
			thanks.y -= 80;
		};
        
		this.update=function(){

		}
		
	}
	
	
	var gameState = function(game){
		
		this.init = function(){
			this.stage.backgroundColor="#3C3C3C";
			var nil;
			this.spike = nil;
			//console.log(this.spike);
			game.world.setBounds(0, 0,data.wLength*data.gW,data.hLength*data.gH);
		}
		

		var bgMusic;
		this.create=function(){

			var bgNewYear = this.bgNewYear = game.add.tileSprite(0,0,WIDTH*4,HEIGHT,'newYear');
			bgNewYear.width = game.width;
			bgNewYear.height = game.height;
			bgNewYear.fixedToCamera = true;

			if(typeof(bgMusic)=='undefined'){
				bgMusic = game.add.audio('Megaman');
				bgMusic.loop = true;
				bgMusic.volume= 2;
				bgMusic.play();
			}


			game.physics.startSystem(Phaser.Physics.P2JS);
			game.physics.p2.defaultRestitution = 0.9;
			game.physics.p2.gravity.y = 350;//重力
			game.physics.p2.world.defaultContactMaterial.friction = 0.3;//摩擦力
			game.physics.p2.world.setGlobalStiffness(1e5);//设置全局刚度

			var player = this.player = game.add.sprite(320,  game.height-160, 'guy');//新春地图初始位置 320 -160
			player.name = 'guy';
    		game.physics.p2.enable(player, !true);//true为开启body调试
			player.body.fixedRotation = true;//固定方向
			player.body.damping = 0.7;//阻力系数1最大
			player.body.setRectangle(20,20,3,5);
			//player.body.setZeroDamping();阻力系数=0
			player.isOnFloor = false;
			player.isOnPlatform = false;
			player.jumpCount = 0;
			player.animations.add('fall',[0,1]);
			player.animations.add('idle',[2,3,4,5]);
			player.jumpaction = player.animations.add('jump',[6,7]);
			player.animations.add('run',[8,9,10,11,12]);
			player.animations.play('idle',7,true);
			game.camera.follow(player);
			
			
			var tileds = this.tileds = game.add.group();
			var that = this;
			
			data.tileds.forEach(function(tiled,i){
				if(tiled.name!==''){
					var tile = tileds.create(i%data.wLength*data.gW,Math.floor(i/data.wLength)*data.gH,tiled.name);
					tile.name = tiled.name;
					tile.kind = tiled.kind;
					game.physics.p2.enable(tile, !true);
					tile.body.fixedRotation = true;
					tile.body.data.gravityScale = 0;//相对于世界重力
					tile.body.kinematic = true;//运动体【不会受到物理影响如重力、碰撞，但仍可移动与触发碰撞事件】
					tile.body.static = true;//不可动的静态体
					player.body.createBodyCallback(tile, that.physicsCollider, this);
					game.physics.p2.setImpactEvents(true);
					//tile.body.data.gravityScale=0;//使物体不受世界重力影响
					//tile.body.setRectangle(16);tile.body.setCircle(16);
					if(tiled.type == 'spritesheet'){
						tile.frame = 0;
						tile.animations.add('action');
						tile.animations.play('action',7,true);
					}
					//console.log(tiled.index);
					if(typeof(tiled.index)!=='undefined'){
						tile.loadTexture('wall_' + tiled.index);
					}
					if(tiled.name=='spike'){
						tile.scale.setTo(0.9,0.8);
						tile.body.clearShapes();
						tile.body.addPolygon( {} ,    -tile.width/2, tile.height/2-1  ,  0, -tile.height/2-1  ,  tile.width/2, tile.height/2-1  );
					}
					if(tiled.name=='platform'){
						tile.scale.setTo(2,1);
						tile.body.setRectangle(64,16,0,0);
						tile.timerIndex = 0;
						game.time.events.loop(Phaser.Timer.SECOND * 3, function(){
							tile.timerIndex++;
							if(tile.timerIndex%2==0){
								tile.body.velocity.x = -100;
							}else{						
								tile.body.velocity.x = 100;
							}
						}, this);
					}
					if(tiled.name=='collider'){
						tile.visible = false;
					}
				}
			});


			//game.physics.p2.enable(tileds, true);
			
			//player.body.clearShapes();

			this.cursors = game.input.keyboard.createCursorKeys();
			//this.jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
			
			this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
			this.rKey = game.input.keyboard.addKey(Phaser.Keyboard.R);
			this.spaceKey.onDown.add(function(){
				if(this.player.jumpCount == 0){
					var audio = game.add.audio('jump');
					audio.play();
				}
				if(this.player.jumpCount == 1){
					var audio = game.add.audio('dJump');
					audio.play();
				}
				player.isOnPlatform = false;
				if (this.player.isOnFloor){
					this.player.body.moveUp(270);
					this.player.jumpCount++;
					player.jumpaction.play(7,false).onComplete.add(function(){
						player.animations.play('fall',7,true);
					},this);
				}
				if(this.player.jumpCount > 1){
					this.player.isOnFloor = false;
				}
			}, this);
			this.rKey.onDown.add(function(){
				game.state.start('main');
			},this);

			onkeydown = function(e){
				console.log(e.keyCode);
			}
			//fireKeyEvent(gg, 'keydown', 'ArrowUp', 82)//R 82
			/* var leftButton = game.add.image(game.width - 192,game.height-96,'button');
			var rightButton = game.add.image(game.width-96,game.height-96,'button');
			var upButton = game.add.image(32,game.height-96,'button');
			leftButton.fixedToCamera = true;
			rightButton.fixedToCamera = true;
			upButton.fixedToCamera = true;
			leftButton.alpha = 0.5;
			rightButton.alpha = 0.5;
			upButton.alpha = 0.5;
			leftButton.inputEnabled = true;
			rightButton.inputEnabled = true;
			upButton.inputEnabled = true;
			leftButton.events.onInputDown.add(function(){
				fireKeyEvent(gg, 'keydown', 'ArrowUp', 37);
			},this);
			rightButton.events.onInputDown.add(function(){
				fireKeyEvent(gg, 'keydown', 'ArrowUp', 39);
			},this);
			upButton.events.onInputDown.add(function(){
				fireKeyEvent(gg, 'keydown', 'ArrowUp', 32);
			},this);
			leftButton.events.onInputUp.add(function(){
				fireKeyEvent(gg, 'keyup', 'ArrowUp', 37);
			},this);
			rightButton.events.onInputUp.add(function(){
				fireKeyEvent(gg, 'keyup', 'ArrowUp', 39);
			},this);
			upButton.events.onInputUp.add(function(){
				fireKeyEvent(gg, 'keyup', 'ArrowUp', 32);
			},this);
			var rButton = game.add.image(32,game.height-192,'button');
			rButton.inputEnabled = true;
			rButton.alpha = 0.3;
			rButton.fixedToCamera = true;
			rButton.events.onInputDown.add(function(){
				fireKeyEvent(gg, 'keydown', 'ArrowUp', 82);
			},this); */
			
			
		};     
		
		this.update = function(){
			
			if (this.cursors.left.isDown)
			{
				this.player.body.moveLeft(90);
				this.player.scale.setTo(-1,1);
				this.player.body.setRectangle(20,20,0,5);
				
			}
			else if (this.cursors.right.isDown)
			{
				this.player.body.moveRight(90);//100==6spike 70 == 3 80==4 90==5
				this.player.scale.setTo(1,1);
				this.player.body.setRectangle(20,20,3,5);
				this.player.animations.play('run',7,true);
			}
			else
			{
				if(!this.player.isOnPlatform){
					this.player.body.velocity.x = 0;
				}
		
			}
			/* if (this.jumpButton.isDown && this.player.isOnFloor){
				if(this.player.jumpCount >= 2){
					this.player.isOnFloor = false;
				}
				this.player.body.moveUp(300);
				this.player.jumpCount++;
				console.log(this.player.isOnFloor);
			} */
			
		};

		
		this.render = function() {
			
			
			

		}
		var that = this;
		this.physicsCollider = function(body1,body2){
			//if(body1.sprite.alive){
				if(body1.y < body2.y){//当guy位于砖块上方则落地为真
					body1.sprite.isOnFloor = true;
					body1.sprite.jumpCount = 0;
				}
				if(body2.sprite.name == 'apple'){
					game.state.start('thanks');
				}
				if(body2.sprite.name == 'spike'){
					body1.sprite.body.clearShapes();
					body1.sprite.kill();
					death();
				}
				if(body2.sprite.name == 'bullet'){
					body1.sprite.body.clearShapes();
					body1.sprite.kill();
					body2.sprite.body.clearShapes();
					body2.sprite.kill();
					death();
				}
				if(body2.sprite.name == 'visibleSpike'){
					body1.sprite.body.clearShapes();
					body1.sprite.kill();
					death();
				}
				if(body2.sprite.name == 'platform'){//平台 当guy处于平台则随平台运动
					body1.sprite.isOnPlatform = true;
					body1.sprite.body.velocity.x = body2.sprite.body.velocity.x;
				}
				if(body2.sprite.name == 'collider'){//触发器
					body2.sprite.body.clearShapes();//移除触发器，通行
					
					//body2.sprite.body.setRectangle(32,32,0,0);
					if(typeof(that.spike)!=='undefined'){return false;}
					console.log(that.spike);
					switch (body2.sprite.kind) {
						case 'bullet':
							var audio = game.add.audio('spikeTrap');
							audio.play();
							that.spike = game.add.sprite(body1.sprite.x,body1.sprite.y-100,'fudai');//spike
							that.spike.scale.setTo(0.5,1);//fudai
							game.physics.p2.enable(that.spike, !true);
							body1.sprite.body.createBodyCallback(that.spike, that.physicsCollider, this);
							that.spike.name = body2.sprite.kind;
							var pos = {};
							pos.x = that.player.x;
							pos.y = that.player.y;
							that.accelerateToObject(that.spike,pos,180);
							game.time.events.add(Phaser.Timer.SECOND * 1, function(){
								that.spike.body.clearShapes();
								that.spike.kill();
								var nil;
								that.spike = nil;
							}, this);
							break;
							case 'visibleSpike'://需要共存的刺【不销毁】
								that.spike = game.add.sprite(body2.sprite.x,body2.sprite.y,'spike');
								game.world.sendToBack(that.spike);
								game.world.sendToBack(that.bgNewYear);
								game.physics.p2.enable(that.spike, !true);
								that.spike.body.static = true;
								that.spike.scale.setTo(0.9,0.8);
								that.spike.body.clearShapes();
								that.spike.body.addPolygon( {} ,    -that.spike.width/2, that.spike.height/2-1  ,  0, -that.spike.height/2-1  ,  that.spike.width/2, that.spike.height/2-1  );
								body1.sprite.body.createBodyCallback(that.spike, that.physicsCollider, this);
								that.spike.name = body2.sprite.kind;
								game.time.events.add(Phaser.Timer.SECOND * 1, function(){
									that.spike.body.clearShapes();
									that.spike.kill();
									var nil;
									that.spike = nil;
								}, this);
								break;
								case 'visibleWall':
									that.wall = game.add.sprite(body2.sprite.x,body2.sprite.y,'fudao');
									game.world.sendToBack(that.wall);
									game.world.sendToBack(that.bgNewYear);
									game.physics.p2.enable(that.wall, !true);
									that.wall.body.static = true;
									body1.sprite.body.createBodyCallback(that.wall, that.physicsCollider, this);
									that.wall.name = body2.sprite.kind;
									break;
									case 'reBackBullet':
										var audio = game.add.audio('spikeTrap');
										audio.play();
										that.bullet = game.add.sprite(body1.sprite.x,body1.sprite.y-100,'spike');
										game.physics.p2.enable(that.bullet, !true);
										body1.sprite.body.createBodyCallback(that.bullet, that.physicsCollider, this);
										that.bullet.name = body2.sprite.kind;
										that.bullet.body.clearShapes();//可以去掉 需要无遮障碍物
										//that.bullet.body.addPolygon( {} ,    -that.bullet.width/2, that.bullet.height/2  ,  0, -that.bullet.height/2-4  ,  that.bullet.width/2, that.bullet.height/2  );
										var pos = {};
										pos.x = that.player.x;
										pos.y = that.player.y;
										that.accelerateToObject(that.bullet,that.player,300);
										game.time.events.add(Phaser.Timer.SECOND * 1, function(){
											that.accelerateToObject(that.bullet,that.player,300);
										}, this);
										break;
					
						default:
							break;
					}
				}
			//}
			
			//body2.destroy(); 只删掉了物理刚体
		}
		//子弹自动追踪
		this.accelerateToObject = function (obj1, obj2, speed) {
			if (typeof speed === 'undefined') { speed = 300; }
			var angle = Math.atan2(obj2.y - obj1.y, obj2.x - obj1.x);
			obj1.body.rotation = angle + game.math.degToRad(90);
			//obj1.body.force.x = Math.cos(angle) * speed;
			obj1.body.velocity.x = Math.cos(angle) * speed;
			//obj1.body.force.y = Math.sin(angle) * speed;
			obj1.body.velocity.y = Math.sin(angle) * speed;
		}
		createEmitter = function(){
			var emitter=game.add.emitter(that.player.x,that.player.y,100);
			emitter.makeParticles('blood');
			//emitter.setXSpeed(min,max);//限制水平速度的方法  正右负左
			emitter.setXSpeed(-300,300);//正下负上
			emitter.setYSpeed(-300,300);//正下负上
			//emitter.setScale(minX,maxX,minY,maxY,rate);限定缩放 rate过渡时间
			//emitter.setAlpha(min,max,rate,ease);透明度 最小 最大 过渡 过渡的缓动
			//emitter.setRotation(min,max);角速度 发射出来的粒子的旋转速度 不旋转0，0
			emitter.start(true,300,100,500);//一次一个粒子  五十个粒子等待发射 
		}
		death = function(){
			var logo = game.add.image(game.width/2,game.height/2,'gameover');
			logo.anchor.setTo(0.5);
			logo.fixedToCamera = true;
			var audio = game.add.audio('death');
			audio.play();
			createEmitter(); 
		}
		
	}

	var WIDTH = data.wLength*data.gW/4,HEIGHT = data.hLength*data.gH;
	var game=new Phaser.Game(WIDTH,HEIGHT,Phaser.CANVAS,'container');		
	game.state.add('boot',bootState);								
	game.state.add('loader',loaderState);
	game.state.add('main',gameState);
	game.state.add('thanks',thanksState);
	game.state.start('loader');											

}



