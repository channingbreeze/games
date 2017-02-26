
var GameTank = GameTank || {};

GameTank.Bullet = function(gameState, position, texture, group, properties) {
  "use strict";
  GameTank.Prefab.call(this, gameState, position, texture, group);
  this.speed = 200;

  this.checkWorldBounds = true;
  this.outOfBoundsKill = true;
  
  this.rebirth(position, properties);
};

GameTank.Bullet.prototype = Object.create(GameTank.Prefab.prototype);
GameTank.Bullet.prototype.constructor = GameTank.Bullet;

GameTank.Bullet.prototype.bulletUpdate = function () {
  "use strict";
  this.gameState.game.physics.arcade.overlap(this, this.gameState.groups["nest"], this.hitNest, null, this);
  this.gameState.game.physics.arcade.overlap(this, this.gameState.groups.map["brick"], this.hitBrick, null, this);
  this.gameState.game.physics.arcade.overlap(this, this.gameState.groups.map["iron"], this.hitIron, null, this);
  this.gameState.game.physics.arcade.overlap(this, this.gameState.scoreManager.scoreSprite, this.hitScoreBoard, null, this);
};

GameTank.Bullet.prototype.rebirth = function(position, properties) {
  
  this.reset(position.x, position.y);
  this.direction = properties.direction;

  if(this.direction == "up") {
    this.angle = 0;
    this.body.velocity.y = -this.speed;
  } else if(this.direction == "down") {
    this.angle = 180;
    this.body.velocity.y = this.speed;
  } else if(this.direction == "left") {
    this.angle = 270;
    this.body.velocity.x = -this.speed;
  } else if(this.direction == "right") {
    this.angle = 90;
    this.body.velocity.x = this.speed;
  }
};

GameTank.Bullet.prototype.hitNest = function(bullet, nest) {
  bullet.kill();
  nest.dead();
}

GameTank.Bullet.prototype.hitBrick = function(bullet, brick) {
  bullet.kill();
  brick.kill();
  this.gameState.levelManager.updateMap(brick.xIndex, brick.yIndex);
  this.gameState.soundManager.hitBrick();
};

GameTank.Bullet.prototype.hitIron = function(bullet, iron) {
  bullet.kill();
  if(this.canHitIron) {
    iron.kill();
    this.gameState.levelManager.updateMap(iron.xIndex, iron.yIndex);
  }
  this.gameState.soundManager.hitIron();
};

GameTank.Bullet.prototype.hitScoreBoard = function(bullet, board) {
  bullet.kill();
};
