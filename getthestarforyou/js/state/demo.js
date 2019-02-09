/*
 * This file is automatically loaded from state/load.js
 * to change default state - change state/load.js at line: 34
 */
"use strict";
var solider;
var spikes;
var redSpikes;
var stars;
var player;
var playerFlyTexture;
var cloud;
var okay = false;
var gameover = false;
var gamescore = 0;
//{}
window.getTheStarForYou.state.demo = {
	init: function(){
		okay = false;
		gameover = false;
		gamescore = 0;
	},
	create: function(){
    	this.physics.startSystem(Phaser.Physics.ARCADE);
		var menuScene = this.add.group();
		var bgMenu = mt.create('bgMenu');
		var lightMenu = mt.create('light');
		lightMenu.anchor.set(0.5);
		lightMenu.x = 0;
		lightMenu.y = 0;
		lightMenu.update = function(){
			this.angle++;
		};
		var btnMenu = mt.create('btnMenu');
		btnMenu.inputEnabled = true;
		btnMenu.events.onInputDown.addOnce(function(){
			var help = mt.create('help');
			menuScene.add(bgMenu);
			menuScene.add(lightMenu);
			menuScene.add(btnMenu);
			menuScene.add(help);
			help.inputEnabled = true;
			help.events.onInputDown.addOnce(function(){
				menuScene.destroy();
				this.world.setBounds(0, 0, 320, 2860);
				var bg = mt.create('bg');
				var bgBottom = mt.create('bgBottom');
				var bgBottom2 = mt.create('bgBottom2');
				var trees = mt.create('trees');
				var ground = mt.create('ground');
				cloud = mt.create('cloud');
				cloud.dt = 0;
				cloud.fixedToCamera = true;
				this.text = this.add.text(0, 0, '得分：'+gamescore, {font: 27+"px myFont", fill: 'white'});
				this.text.fixedToCamera = true;
				var helptext = mt.create('helptext');
				var tween = this.add.tween(helptext).to( { alpha: 0 }, 2000, 'Linear', true);
				tween.onComplete.add(function(){
					helptext.destroy();
				}, this);
				solider = mt.create('solider');
				solider.alpha = 0;
				spikes = this.add.group();
    			spikes.enableBody = true;
				for(var i=0;i<21;i++){
					var spike = this.game.add.sprite(
						this.rnd.between(0,this.world.width),
						this.rnd.between(this.world.height/10,this.world.height/10*8),
						'/images/spike1-sheet0.png'
					);
					spikes.add(spike);
				}
				redSpikes = this.add.group();
    			redSpikes.enableBody = true;
				for(var i=0;i<13;i++){
					var redSpike = this.game.add.sprite(
						this.rnd.between(0,this.world.width),
						this.rnd.between(this.world.height/10,this.world.height/10*8),
						'/images/spike2-sheet0.png'
					);
					redSpikes.add(redSpike);
				}
				stars = this.add.group();
    			stars.enableBody = true;
				for(var i=0;i<21;i++){
					var star = this.game.add.sprite(
						this.rnd.between(0,this.world.width),
						this.rnd.between(this.world.height/20,this.world.height/10*8),
						'/images/star-sheet0.png'
					);
					stars.add(star);
				}
				
				
				player = mt.create('player');
			    this.physics.arcade.enable(player);
				player.dt = 0;
				player.anchor.set(.5);
				player.standTexture = player.texture;
				playerFlyTexture = mt.create('playerFlyTexture');
				player.isDown = false;
				player.lives = 3;
				
				
				this.livesText = mt.create('Text');
				this.livesText.x = 320-this.livesText.width;
				this.livesText.fixedToCamera = true;
				this.livesText.text = 'lives:' + player.lives;
				
				this.input.onDown.add(function(){//鼠标按下
					okay = true;
					player.isDown = true;
				}, this);
				this.input.onUp.add(function(){//鼠标弹起
					player.isDown = false;
				}, this);
			    this.camera.follow(player);
			}, this);
		}, this);
	},
	update: function(){
		if(gameover){
// 			this.game.state.start('boot');
			var gameoverState = mt.create('gameoverState');
			gameoverState.getChildAt(2).text = gamescore;
			gameoverState.getChildAt(2).anchor.set(0.5,1);
			gameoverState.getChildAt(2).x = 160;
			var btn = mt.create('btn');
			btn.anchor.set(0.5,1);
			btn.x = 160;
			btn.inputEnabled = true;
			btn.events.onInputDown.addOnce(function(){
				player.isDown = false;
				gameoverState.destroy();
				btn.destroy();
				this.game.state.start('boot');
			},this);
			return false;
		}
		if (player) {
			if (player.y < 0) {
				gameover = true;
			}
		 	this.game.physics.arcade.collide(player, solider);
		 	this.game.physics.arcade.overlap(player, stars,function(player,star){
				star.destroy();
				gamescore += 100;
			},null,this);
		 	this.game.physics.arcade.overlap(player, redSpikes,function(player,self){
				self.destroy();
				player.lives--;
				if(player.lives==0){
					player.isDown = false;
					gameover = true;
				}
				this.livesText.text = 'lives:' + player.lives;
			},null,this);
		 	this.physics.arcade.overlap(player, spikes, function(player,self){
	    		self.destroy();
				gamescore -= 100;
	    	}, null, this);
			if (player.isDown) {
				cloud.dt++;
				player.dt = 0;
				if(cloud.dt>300) cloud.fixedToCamera = false;
					player.body.velocity.y = -150;
				player.texture = playerFlyTexture.texture;
				if (this.input.activePointer.isDown){						//鼠标触摸点按下
					if(this.input.activePointer.x < player.x){				//鼠标点击坐标位于人物左边
						player.scaleX = -1;
					} else {												//鼠标点击坐标位于人物右边
						this.x = this.rightX;
						player.scaleX = 1;
					}
					this.add.tween(player).to( { x: this.input.activePointer.x }, 100, "Linear", true);
				}
			} else {
				player.dt++;
				if(player.y >= 2700 + player.height && okay == true){
					gameover = true;
				}
				player.texture = player.standTexture;
			}
			
				this.text.setText('得分：' + gamescore);
		}
	},
};

