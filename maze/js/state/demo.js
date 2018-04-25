/*
 * This file is automatically loaded from state/load.js
 * to change default state - change state/load.js at line: 34
 */
"use strict";
var isStart = true;
window.Maze.state.demo = {
	create: function(){
		this.background = mt.create("background");
		this.wall = mt.create("wall");
		this.wall.map.setCollision(0);
		this.player = mt.create("player");
		this.player.alpha = 0;
		this.player.key = false;
		this.player.coins = 0;
		this.player_skin = mt.create("player_skin");
		this.player_skin.animations.add("down", [0,1,2,3], 10, false);
		this.player_skin.animations.add("left", [4,5,6,7], 10, false);
		this.player_skin.animations.add("right", [8,9,10,11], 10, false);
		this.player_skin.animations.add("up", [12,13,14,15], 10, false);
		this.wolf_skin = mt.create("wolf_skin");
		for	(i = 0; i < this.wolf_skin.length; i++){
			this.wolf_skin.getChildAt(i).animations.add("left", [3,4,5], 10, false);
			this.wolf_skin.getChildAt(i).animations.add("right", [6,7,8], 10, false);
		}
		this.wolf__skin = mt.create("wolf__skin");
		for	(i = 0; i < this.wolf__skin.length; i++){
			this.wolf__skin.getChildAt(i).animations.add("down", [0,1,2], 10, false);
			this.wolf__skin.getChildAt(i).animations.add("up", [9,10,11], 10, false);
		}
		this.door = mt.create("door");
		this.door.animations.add("open", [0,4,8,12], 10, false);
		//this.door.animations.play("open");
		this.door.i = 0;
		
		this.key = mt.create("key");
		this.coins = mt.create("coins");
		
		this.enemy_wolf = mt.create("enemy_wolf");
		this.enemy_wolf.alpha = 0;
		for	(var i = 0; i < this.enemy_wolf.length; i++){
			this.enemy_wolf.getChildAt(i).speedX = 200;
		}
		this.enemy_wolf_ = mt.create("enemy_wolf_");
		this.enemy_wolf_.alpha = 0;
		for	(i = 0; i < this.enemy_wolf_.length; i++){
			this.enemy_wolf_.getChildAt(i).speedY = 200;
		}
		
		this.succeed = mt.create("succeed");
		this.succeed.alpha = 0;
		
		this.cursors = this.game.input.keyboard.createCursorKeys();
		this.W = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
		this.A = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
		this.S = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
		this.D = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
	},
	update: function(){
		if (isStart !== true) return false;
		var succeed = this.succeed;
		var game = this.game;
		this.game.physics.arcade.collide(this.player, this.wall);
		this.game.physics.arcade.collide(this.player, this.key, function(self,key){
			self.key = true;
			key.destroy();
		});
		this.game.physics.arcade.overlap(this.player, this.coins, function(self,coin){
			self.coins++;
			coin.destroy();
		});
		this.game.physics.arcade.collide(this.player, this.door, function(self,door){
			if (door.i > 0) {return false;}
			if (self.key === true){
				door.animations.play("open");
				door.i = 1;
				var tween = game.add.tween(succeed).to( { alpha: 1 }, 2000, "Linear", true, 0);
				tween.onComplete.add(function(){
					tween = game.add.tween(succeed).to( { alpha: 0 }, 2000, "Linear", true, 0);
					tween.onComplete.add(function(){
						isStart = false;
						//此处可添加选项 返回游戏 || 退出游戏
					});
				}, this);
			}
		});
		this.game.physics.arcade.collide(this.player, this.enemy_wolf, function(){game.state.start("demo");});
		this.game.physics.arcade.collide(this.player, this.enemy_wolf_, function(){game.state.start("demo");});
		this.game.physics.arcade.collide(this.enemy_wolf, this.wall, function(self){
			self.speedX = -self.speedX;
			console.log(self.speedX);
		});
		this.game.physics.arcade.collide(this.enemy_wolf_, this.wall, function(self){
			self.speedY = -self.speedY;
		});
		
		for	(var i = 0; i < this.enemy_wolf.length; i++){
			this.enemy_wolf.getChildAt(i).body.velocity.x = this.enemy_wolf.getChildAt(i).speedX;
			if (this.enemy_wolf.getChildAt(i).speedX > 0) this.wolf_skin.getChildAt(i).animations.play("right");
			if (this.enemy_wolf.getChildAt(i).speedX < 0) this.wolf_skin.getChildAt(i).animations.play("left");
		}
		for	(i = 0; i < this.enemy_wolf_.length; i++){
			this.enemy_wolf_.getChildAt(i).body.velocity.y = this.enemy_wolf_.getChildAt(i).speedY;
			if (this.enemy_wolf_.getChildAt(i).speedY < 0) this.wolf__skin.getChildAt(i).animations.play("up");
			if (this.enemy_wolf_.getChildAt(i).speedY > 0) this.wolf__skin.getChildAt(i).animations.play("down");
		}
		
		if (this.cursors.up.isDown || this.W.isDown){
            this.player.body.velocity.y = -200;
			this.player_skin.animations.play("up");
		}
        else if (this.cursors.down.isDown || this.S.isDown){
            this.player.body.velocity.y = 200;
			this.player_skin.animations.play("down");
		}
        else {
			this.player.body.velocity.y = 0;
		}

        if (this.cursors.right.isDown || this.D.isDown){
            this.player.body.velocity.x = 200;
			this.player_skin.animations.play("right");
		}
        else if (this.cursors.left.isDown || this.A.isDown){
            this.player.body.velocity.x = -200;
			this.player_skin.animations.play("left");
		}
        else {
			this.player.body.velocity.x = 0;
		}
		
		this.player_skin.x = this.player.x;
		this.player_skin.y = this.player.y;
		
		for	(i = 0; i < this.wolf__skin.length; i++){
			this.wolf__skin.getChildAt(i).x = this.enemy_wolf_.getChildAt(i).x;
			this.wolf__skin.getChildAt(i).y = this.enemy_wolf_.getChildAt(i).y;
		}
		for	(i = 0; i < this.wolf_skin.length; i++){
			this.wolf_skin.getChildAt(i).x = this.enemy_wolf.getChildAt(i).x;
			this.wolf_skin.getChildAt(i).y = this.enemy_wolf.getChildAt(i).y;
		}
	},
	render: function(){
		this.game.debug.text( "是否拥有通关钥匙:" + this.player.key, 100, 100 );
		this.game.debug.text( "目前拥有迷宫金币:" + this.player.coins, 100, 200 );
}
};
	

/*
		暂定后续思路
		定通关优良率
		设置游戏关卡
		添加怪物元素
		添加战斗场景
		添加游戏音效
		code by MngYou 
		有意向学习Phaserjs快速开发自己的2d游戏的小伙伴们可以进入Phaser小站QQ群519413640获得精神安慰与技术支持
*/