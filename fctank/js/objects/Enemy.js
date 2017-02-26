
var GameTank = GameTank || {};

GameTank.Enemy = function(gameState, position, texture, group, properties) {
  "use strict";
  GameTank.Tank.call(this, gameState, position, texture, group, properties);
  
  this.dirs = ["up", "down", "left", "right"];
  this.rebirth(position, properties);
};

GameTank.Enemy.prototype = Object.create(GameTank.Tank.prototype);
GameTank.Enemy.prototype.constructor = GameTank.Enemy;

GameTank.Enemy.prototype.update = function() {
  this.tankUpdate();
  this.gameState.game.physics.arcade.collide(this, this.gameState.groups["player"]);
  this.gameState.game.physics.arcade.collide(this, this.gameState.groups["enemy"]);
}

GameTank.Enemy.prototype.hited = function(who) {
  // 处理奖品
  if(this.properties.award) {
    this.properties.award = 0;
    this.gameState.soundManager.generateAward();
    this.gameState.bounsManager.generateOneBouns();
  }
  this.life--;
  if(this.life == 0) {
    this.dead(who);
  } else {
    // strong tank change animation
    if(this.properties.type == 2 && this.life == 2) {
      this.animations.add('run', [10, 11], 10, true);
      this.animations.play("run");
    } else if(this.properties.type == 2 && this.life == 1) {
      this.animations.add('run', [12, 13], 10, true);
      this.animations.play("run");
    }
  }
}

GameTank.Enemy.prototype.dead = function(who) {
  game.time.events.remove(this.turnTimer);
  game.time.events.remove(this.fireTimer);
  this.explode();
  this.kill();
  this.gameState.scoreManager.enemyKilled();
  if(this.properties.type == 0) {
    this.gameState.game[who+"NormalTank"]++;
  } else if(this.properties.type == 1) {
    this.gameState.game[who+"FastTank"]++;
  } else if(this.properties.type == 2) {
    this.gameState.game[who+"StrongTank"]++;
  }
  this.gameState.soundManager.enemyBoom();
}

GameTank.Enemy.prototype.shouldTurn = function() {
  var randomIndex = Math.floor(Math.random() * this.dirs.length);
  var direction = this.dirs[randomIndex];
  if(this.gameState.enemyPause) {
    this.stopMove();
  } else {
    this.move(direction);
  }
}

GameTank.Enemy.prototype.fire = function() {
  if(!this.gameState.enemyPause) {
    var position = {x: this.x, y: this.y};
    var bullet = this.gameState.groups["enemyBullet"].getFirstExists(false);
    if(!bullet) {
      bullet = new GameTank.EnemyBullet(this.gameState, position, 'bullet', 'enemyBullet', {direction: this.direction});
    } else {
      bullet.rebirth(position, {direction: this.direction});
    }
    this.gameState.soundManager.enemyFire();
  }
}

GameTank.Enemy.prototype.rebirth = function(position, properties) {
  this.properties = properties;
  
  // type 0 is smallest tank
  if(this.properties.type == 0 && this.properties.award == 0) {
    this.animations.add('run', [0, 1], 10, true);
    this.life = 1;
  } else if(this.properties.type == 0 && this.properties.award == 1) {
    this.animations.add('run', [2, 3], 10, true);
    this.life = 1;
  // type 1 is fast tank
  } else if(this.properties.type == 1 && this.properties.award == 0) {
    this.animations.add('run', [4, 5], 10, true);
    this.life = 1;
  } else if(this.properties.type == 1 && this.properties.award == 1) {
    this.animations.add('run', [6, 7], 10, true);
    this.life = 1;
  // type 2 is strong tank
  } else if(this.properties.type == 2 && this.properties.award == 0) {
    this.animations.add('run', [8, 9], 10, true);
    this.life = 3;
  } else if(this.properties.type == 2 && this.properties.award == 1) {
    this.animations.add('run', [14, 15], 10, true);
    this.life = 3;
  }
  this.animations.play("run");
  
  this.dirs = ["up", "down", "left", "right"];
  this.alpha = 0;

  // 出生的动画
  var born = game.add.sprite(0, 0, 'bore');
  born.anchor.setTo(0.5, 0.5);
  born.reset(position.x, position.y);
  var anim = born.animations.add('born', [0, 1, 2, 3, 2, 1, 0, 1, 2, 3], 10);
  anim.play('born');
  anim.onComplete.add(function() {
    born.kill();
    this.reset(position.x, position.y);
    this.shouldTurn();
    this.turnTimer = game.time.events.loop(Phaser.Timer.SECOND * 1.3, this.shouldTurn, this);
    this.fireTimer = game.time.events.loop(Phaser.Timer.SECOND * 1.7, this.fire, this);
    this.alpha = 1;
  }, this);
}

GameTank.Enemy.prototype.stopMove = function() {
  this.body.velocity.x = 0;
  this.body.velocity.y = 0;
}
