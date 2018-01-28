/*
 * This file is automatically loaded from state/load.js
 * to change default state - change state/load.js at line: 34
 */
"use strict";
var isStart = 0;
window.Timberpig.state.demo = {
	create: function(){
		var game = this;
		var j = 0; //当第一次按下 不执行
		var tweenA,tweenB;
		this.background = mt.create("background");	//创建背景
		this.ground = mt.create("ground");			//创建地面
		this.cloud = mt.create("cloud");			//创建云层
		this.cloud.update = function(){				//云层动画
			for(var i = 0; i < this.length; i++){
				if(this.getChildAt(i).x + this.getChildAt(i).width < 0){
					this.getChildAt(i).x = game.world.width;
					this.getChildAt(i).y = game.rnd.between(game.world.centerY / 2,game.world.centerY / 1.5);
				}
				this.getChildAt(i).x--;
			}
		};
		this.tree = mt.create("tree");						//创建树木
		this.title = mt.create("title");					//创建标题
    	tweenA = game.add.tween(this.title).to( { y: this.title.y + 100 }, 2000, "Linear");
		tweenB = game.add.tween(this.title).to( { y: this.title.y }, 2000, "Linear");
		tweenA.chain(tweenB);								//缓动动画
		tweenB.chain(tweenA);								//动画链接
		tweenA.start();										//播放动画
		this.title.update = function(){
			if(isStart == 1){this.destroy();}
		};
		this.Score = mt.create("Score");
		this.Score.alpha = 0;
		var Score = this.Score;
		this.btnPlay = mt.create("btnPlay");				//开始按钮
		this.btnPlay.inputEnabled = true;					//接收事件
		this.btnPlay.events.onInputDown.addOnce(function(){	//鼠标点击事件
			j = 2;
			isStart = 1;
			Score.alpha = 1;
		});
		this.btnPlay.update = function(){
			if(isStart == 1){this.destroy();}
		};
		this.player = mt.create("player");
		var player = this.player;
		this.player.dt = 0;
		this.player.frameIndex = this.player.frame;
		var cutA = this.player.animations.add('cut', [0, 1, 2]);
		this.player.animations.add('gif', [0, 7]);
		this.player.animations.add('die',[12,11,10,4,3,8,9,6,5],10,false);
		cutA.onComplete.add(function(){
			player.animations.play('gif',5,true);
		}, this);
		this.player.anchor.set(0.5,0);
		this.player.leftX = 184;
		this.player.rightX = 354;
		this.player.x = this.player.leftX;
		this.player.update = function(){
// 			this.dt++;
// 			if(this.dt % 10 === 0){
// 				if(this.frameIndex === 0){
// 					//console.log("a");
// 					this.frameIndex = 7;
// 				} else {
// 					//console.log("b");
// 					this.frameIndex = 0;
// 				}
// 			}
// 			this.frame = this.frameIndex;//播放人物常态动画
			
			if(isStart == 1){
				if (j <= 1) return false;
				if (game.input.activePointer.isDown){//游戏内鼠标点击
					if(game.input.activePointer.x < game.world.centerX){
						this.x = this.leftX;
						this.scaleX = 1;
					} else {
						this.x = this.rightX;
						this.scaleX = -1;
					}
					//this.animations.play('cut');
					cutA.play(10,false);
				}
			}
		};
		this.gameOver = mt.create("gameOver");
		this.gameOver.alpha = 0;
		this.gameOver.getData().userData.score = 0;
		this.gameOver.update = function(){
			if(isStart !== 2) {return false}
			if(isStart == 2){
				Score.destroy();
				this.mt.children.gameCase.setText(this.getData().userData.case);
				this.mt.children.gameScore.setText(this.getData().userData.score);
				this.mt.children.gameCase.x = game.world.centerX;
				this.mt.children.gameScore.x = game.world.centerX;
				this.alpha = 0.9;
				if(this.getData().userData.case == "Lost"){
					//死亡动画
					player.scaleY = 1;
					//player.frame = 5;
					player.animations.play('die');
				}
				isStart = 3;
			}
		};
		this.gameOver.mt.children.btnRetry.inputEnabled = true;
		this.gameOver.mt.children.btnRetry.events.onInputDown.addOnce(function(){
			game.state.start("demo");
		},this);
		var gameOver = this.gameOver;
		this.time = mt.create("time");
		this.time.alpha = 0;
		this.time.update = function(){
			if(isStart == 1){
				this.alpha = 1;
				this.mt.children.top.width--;
				if(this.mt.children.top.width <= 0){
					this.alpha = 0;
					gameOver.getData().userData.case = "Lost";
					isStart = 2;
				}
			}
			if(isStart == 2){
				this.alpha = 0;
			}
		};
		var dx1 = 0,dx2 = 0;
		game.input.onDown.add(function(){
			if(isStart == 1){//游戏内鼠标点击
				if(game.input.activePointer.x < game.world.centerX){
					//left
					dx1 = 50;
					dx2 = 100;
				} else {
					//right
					dx1 = -50;
					dx2 = -100;
				}
				for(var i = 1;i < this.tree.length;i++){
					if(this.tree.getChildAt(i).y + this.tree.getChildAt(i).height >= this.tree.getChildAt(0).y){
						//创建动画
						var animation = game.add.image(this.tree.getChildAt(i).x,this.tree.getChildAt(i).y,"");
						animation.texture = this.tree.getChildAt(i).texture;
						tweenA = game.add.tween(animation).to( { x: animation.x + dx1,y: animation.y - 50  }, 300, "Linear");
						tweenB = game.add.tween(animation).to( { x: animation.x + dx2,y: animation.y + 50 }, 300, "Linear");								//缓动动画
						tweenB.onComplete.add(function(){
							animation.destroy();
						},this);
						tweenA.chain(tweenB);
						tweenA.start();										//播放动画
							
						//销毁树桩上的一段木头
						this.tree.getChildAt(i).destroy();
						
						//游戏得分递增
						this.gameOver.getData().userData.score++;
						this.time.mt.children.top.width += 5;
						if(this.gameOver.getData().userData.score == 49){
							this.gameOver.getData().userData.case = "Win";
							isStart = 2;
						}
					} 
				}
				for(var i = 1;i < this.tree.length;i++){//被砍往下掉
					this.tree.getChildAt(i).y += 57;
					if(this.tree.getChildAt(i).y + this.tree.getChildAt(i).height >= this.tree.getChildAt(0).y){//防止越界
						this.tree.getChildAt(i).y = this.tree.getChildAt(0).y - this.tree.getChildAt(i).height;
					}
				}
			}
		},this);
	},
	update:function(){
		if(isStart !== 1) return false;
		this.Score.text = this.gameOver.getData().userData.score;
		var gameOver = this.gameOver;
		this.game.physics.arcade.overlap(this.player,this.tree,function(){
			//console.log("游戏结束");
			gameOver.getData().userData.case = "Lost";
			isStart = 2;
		});
	}
};