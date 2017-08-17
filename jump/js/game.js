var MyGame = function() {
	this.isRun = false;
	this.atlasKey = [
		//普通地板
		{id: 0, key: 'platform0', velocity: 1400,score: 1},
		//只能碰一次的地板
		{id: 1, key: 'platform3', velocity: 1400,score:2},
		//会动的地板
		{id: 2, key: 'platform1', velocity: 1400,score:3},
		//会断裂的地板
		{id: 3, key: 'platform2', velocity: 1400,score:0},
		//弹簧
		{id: 4, key: 'bonus0', velocity: 2000,score:5}
	];
	this.atlasMap = [];
	for(var i = 0; i < 100; i++){
		if(i < 60){
		  //普通地板
		  this.atlasMap.push(this.atlasKey[0]);
		};
		if(i < 20){
		  //只能碰一次的地板
		  this.atlasMap.push(this.atlasKey[1]);
		};
		if(i < 15){
		  //会动的地板
		  this.atlasMap.push(this.atlasKey[2]);
		};
		if(i < 5){
		  //会断裂的地板
		  this.atlasMap.push(this.atlasKey[3]);
		};
	};
	//console.log(this.atlasMap)
};
MyGame.prototype = {
	setScale: function(val){
		val = val * gameScale * 2;
		return val;
	},
	create: function() {
		this.score = 0;
		this.atlasIndex = 0;
		this.atlasMap = this.atlasMap.sort(ranArr);
		this.stage.backgroundColor = '#edffd9';
		//开启物理引擎
		this.physics.startSystem(Phaser.Physics.ARCADE);
		//适应屏幕
		this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
		this.scale.setGameSize(gameWidth * 2, gameHeight * 2);
		this.scale.setMinMax(320,480,750,1366);
		this.scale.onSizeChange.add(function(){
			console.log('变化');

		},this)
		//失去焦点是否继续游戏
		this.stage.disableVisibilityChange = true;
		//开启鼠标事件
		this.input.mouse.capture = true;
		this.iniGame();
		this.isRun = true;
	},
	iniGame: function(){
		//背景图
		this.bg = this.add.sprite(0, 0,'bg');
		this.bg.width = gameWidth * 2;
		this.bg.height = gameHeight * 2;
		this.bg.fixedToCamera = true;
		this.world.setBounds(0, 0, gameWidth * 2,(gameHeight + 99999) * 2);
		this.camera.y = this.world.height;
		//地板
		this.atlas = this.add.group();
		//弹簧
		this.spring = this.add.group();
		//黑洞
		this.hole = this.add.sprite(this.world.randomX, 0, 'atlas','obstacle4');
		this.hole.visible = false;
		this.hole.anchor.set(0.5);
		this.hole.scale.set(gameScale);
		this.physics.arcade.enable(this.hole);
		//批量生成30个地板，状态是死的
		this.atlas.createMultiple(30, 'atlas', 0, false);
		this.atlasY = this.world.height - this.setScale(50)
		for(var i = 0; i < 5; i++){
			this.setAtlas(this.setScale(70 + 150 * i),this.atlasY, 'atlas', 'platform0', 0);
		};
		this.addAtlas(25);


		this.mouseSprite = this.add.sprite(0,0);
		this.mouseSprite.visible = false;
		this.physics.arcade.enable(this.mouseSprite);

		//主角
		this.play = this.add.sprite(this.atlas.getChildAt(2).x, this.atlas.getChildAt(2).y,"atlas");
		this.play.animations.add('go',Phaser.Animation.generateFrameNames('but', 1, 4, '', 0),15,true);
		this.play.play('go');
		this.play.isRun = true;
		//超出世界死
		this.play.outOfCameraBoundsKill = true;
		this.play.autoCull = true;
		this.play.events.onKilled.add(function(sprite){
			console.log('死了')
			music[4].play();
			this.gameEnd(false);
		},this);
		this.physics.arcade.enable(this.play);
		//设置重力
		this.play.body.gravity.y = this.setScale(3000);
		this.play.anchor.set(0.5);
		this.play.y -= (this.play.height / 2 + 100) * gameScale;
		this.play.scale.set(gameScale + this.setScale(0.4));

		//得分
		this.text = this.add.text(this.world.width - this.setScale(200), this.setScale(20), '得分：0', {font: this.setScale(30)+"px myFont", fill: '#6c6f3a'});
		this.text.fixedToCamera = true;
	},
	setAtlas: function(x, y, key, frame, type){
		var atlas = this.atlas.getFirstDead(true, x, y, key, frame);
			atlas.anchor.set(0.5);
			atlas.scale.set(gameScale + this.setScale(0.8));
			atlas.types = type;
			atlas.spring = this.atlasKey[type].velocity
			this.physics.arcade.enable(atlas);
			atlas.body.collideWorldBounds = false;
			atlas.body.velocity.x = l(0, 1) == 0 ? 200 : -200;
			atlas.body.moves = false;
			atlas.sprite = '';
			//是否能得分
			atlas.score = true;

			//随机生成弹簧
		if((type == 2 || type == 0) && l(0, 10) > 7){
			var spring = this.spring.create(l(x - this.setScale(40), x + this.setScale(40)), y - this.setScale(10), 'atlas', this.atlasKey[4].key);
				spring.anchor.set(0.5);
				spring.scale.set(gameScale + this.setScale(0.5));
				spring.types = 4;
				spring.spring = this.atlasKey[4].velocity
				this.physics.arcade.enable(spring);
				if(type == 2){
					spring.body.velocity.x = 0;
					spring.body.velocity.x = atlas.body.velocity.x;
				};
				atlas.sprite = spring;
				spring.score = true;
		};
		//会移动的地板
		if(type == 2){
			atlas.body.moves = true;
			atlas.body.collideWorldBounds = true;
			atlas.body.onWorldBounds = null;
			atlas.body.bounce.x = 1;

			if(typeof(atlas.sprite) == 'object'){
				atlas.body.onWorldBounds = new Phaser.Signal();
				atlas.body.onWorldBounds.add(function(){
					if(typeof(this.sprite) == 'object'){
						this.sprite.body.velocity.x = this.body.velocity.x;
					};
				},atlas);
			};

		};
		//会断的地板
		if(type == 3){
			var ani = atlas.animations.add('go',Phaser.Animation.generateFrameNames('platformSheet_0', 2, 4, '', 0),8);
			ani.onComplete.add(function(){
				this.kill();
			}, atlas);
		};

		//随机出现黑洞
		if(!this.hole.visible && l(0,2) == 0 && this.camera.y < this.world.height - gameHeight * 2){
			this.hole.y = l(y - this.setScale(800), y + this.setScale(100))
			this.hole.visible = true;
		};
	},
	addAtlas: function(num){
		for(var i = 0; i < num; i++){
			this.atlasY -= this.setScale(l(150,250));
			var x = this.world.randomX;
			this.setAtlas(x,this.atlasY, 'atlas', this.atlasMap[this.atlasIndex].key, this.atlasMap[this.atlasIndex].id);
			//随机新增多一块地板
			if((this.atlasMap[this.atlasIndex].id != 2 && l(0,1) == 0) || this.atlasMap[this.atlasIndex].id == 3){
				var index = l(0,1);
				if(x < gameWidth){
					x+=this.setScale(l(200, 450));
				}else{
					x-=this.setScale(l(200, 450));
				}
				this.setAtlas(x,this.atlasY, 'atlas', this.atlasKey[index].key, this.atlasKey[index].id);
			};

			this.atlasIndex++;
			this.setIndex();

		};
	},
	setIndex: function(){
		if (this.atlasIndex === 100){
			this.atlasIndex = 0;
			this.atlasMap = this.atlasMap.sort(ranArr);
		};
	},
	gameEnd: function(type){
		//console.log('Game Over !')
		if(type){
			var oTitle = '恭喜达到最高点，本次得分';
		}else{
			var oTitle = '还差一点点，本次得分';
		};
		this.over = this.add.group();
		this.over.fixedToCamera = true;
		this.overbg = this.add.graphics(0, 0);
		this.overbg.beginFill(0x000000,0.7);
		this.overbg.drawRect(0, 0, gameWidth * 2, gameHeight * 2);
		this.overbg.endFill();
		this.overBackground = this.over.create(0,0,this.overbg.generateTexture());
		this.overbg.destroy();

		this.overTitle = this.add.text(this.world.centerX, this.setScale(200), oTitle, {font: this.setScale(50)+"px myFont", fill: '#fff'});
		this.overTitle.anchor.set(0.5);

		this.overScore = this.add.text(this.world.centerX, this.setScale(400), this.score, {font: this.setScale(80)+"px myFont", fill: '#d9cc43'});
		this.overScore.anchor.set(0.5);

		this.overBtn = new this.addBtn(this.over,this.world.centerX - this.setScale(150), this.setScale(600),this.setScale(2.5),'platform0','重 新 游 戏','#d9cc43','#333',this.setScale(36),null);
		this.overBtn.Btn.events.onInputDown.add(function(){
			music[5].play();
			game.state.start('Game');
		},this);
		this.over.addMultiple([this.overTitle, this.overScore]);

		//game.state.start('Game');
	},
	update: function() {
		if(this.isRun){
			if(this.play.isRun){
				this.physics.arcade.overlap(this.hole, this.play,function(){
					console.log('吸入黑洞了')
					music[3].play();
					music[4].play();
					this.play.body.gravity.y = 0;
					this.play.body.velocity.y = 0;
					//黑洞吸人动画
					this.add.tween(this.play.scale).to( { x: 0, y: 0 }, 1000, "Linear", true);
					this.add.tween(this.play).to( { x: this.hole.x, y: this.hole.y }, 1000, "Linear", true).onComplete.addOnce(function(){
						console.log('被黑洞吸了')
						this.play.kill();
					},this);
					this.play.isRun = false;
				},null,this);
			};

			this.physics.arcade.overlap([this.atlas,this.spring], this.play,function(play,atlas){
				if(play.body.touching.down){
					if(this.camera.y == 0){
						this.gameEnd(true);
					};
					if(atlas.score){
						this.score += this.atlasKey[atlas.types].score;
						this.text.text = '得分：'+ this.score;
					};
					atlas.score = false;
					if (atlas.types != 4){
						music[1].play();
					}else{
						music[2].play();
					};

					//console.log(this.spring.children.length,this.atlas.children.length,(this.world.height - this.camera.y) / 100)
					if (atlas.types != 3){
						play.body.velocity.y = this.setScale(-atlas.spring);
					}else{
						//如果是会断的地板，播放断裂动画
						atlas.play('go');
					};
					//如果是只允许碰一次的地板，触碰后Kill
					if (atlas.types == 1){
						atlas.kill();
					};
					//弹簧
					if (atlas.types == 4){
						atlas.frameName = 'bonus01'
					};
					//移动镜头
					var cameraY = atlas.y - this.setScale(atlas.spring / 2);
					if(cameraY < this.camera.y && atlas.types != 3){
						//杀死超出镜头底部的地板
						this.atlas.forEachAlive(function(sprite){
							if(sprite.y > this.camera.y + gameHeight*2){
								sprite.kill();
								if(typeof(sprite.sprite) == 'object'){
									sprite.sprite.destroy();
								};
							};
						},this);
						//生成新的地板
						if(this.atlas.countLiving() < 20){
							this.addAtlas(10);
						};
						//镜头动画
						this.add.tween(this.camera).to( {y: cameraY}, 300, "Linear", true);
						//隐藏黑洞
						if(this.hole.visible && this.hole.y > this.camera.y + gameHeight*2){
							this.hole.visible = false;
						};
					};
				};
			},null,this);

			if(this.play.isRun){
				this.physics.arcade.moveToPointer(this.mouseSprite, 60, this.input.activePointer, 200);
				this.play.x = this.mouseSprite.x;
			};

		};
	},
	addBtn: function(group,x,y,scale,img,texts,color,stroke,fontSize){
		var typa = typa || null;
		var typb = typb || null;
		this.Btn = game.add.sprite(x,y, 'atlas', img);
		this.Btn.scale.set(scale);
		this.BtnText = game.add.text(0, 0, texts, {font: fontSize+"px myFont", fill: color, boundsAlignH: "center", boundsAlignV: "middle"});
		this.BtnText.setTextBounds(x, y, this.Btn.width, this.Btn.height);
		this.BtnText.stroke = stroke;
		this.BtnText.strokeThickness = 8;
		this.Btn.inputEnabled = true;
		group.addMultiple([this.Btn,this.BtnText]);
		return this
	}

};