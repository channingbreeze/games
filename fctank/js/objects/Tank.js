
var GameTank = GameTank || {};

GameTank.Tank = function(gameState, position, texture, group, properties) {
  "use strict";
  GameTank.Prefab.call(this, gameState, position, texture, group, properties);
  
  this.properties = properties;
  this.body.collideWorldBounds = true;

  // 减小碰撞范围
  this.body.setSize(24, 32, 4, 0);
  
};

GameTank.Tank.prototype = Object.create(GameTank.Prefab.prototype);
GameTank.Tank.prototype.constructor = GameTank.Tank;

GameTank.Tank.prototype.tankUpdate = function () {
  "use strict";
  this.gameState.game.physics.arcade.collide(this, this.gameState.groups.map["brick"]);
  this.gameState.game.physics.arcade.collide(this, this.gameState.groups.map["iron"]);
  this.gameState.game.physics.arcade.collide(this, this.gameState.groups.map["waterv"]);
  this.gameState.game.physics.arcade.collide(this, this.gameState.groups.map["waterh"]);
  this.gameState.game.physics.arcade.collide(this, this.gameState.groups["nest"]);
  this.gameState.game.physics.arcade.collide(this, this.gameState.scoreManager.scoreSprite);
};

GameTank.Tank.prototype.move = function(direction) {
  if(direction == "up") {
    // move up
    this.direction = "up";
    this.body.velocity.x = 0;
    this.body.velocity.y = -this.properties.speed;
    this.angle = 0;
    this.body.setSize(24, 32, 4, 0);
    if(Math.round(this.y) % TILE_HEIGHT != 0) {
      this.x = this.gameState.game.math.snapTo(this.x, TILE_WIDTH, 0);
    }
  } else if(direction == "down") {
    // move down
    this.direction = "down";
    this.body.velocity.x = 0;
    this.body.velocity.y = this.properties.speed;
    this.angle = 180;
    this.body.setSize(24, 32, 4, 0);
    if(Math.round(this.y) % TILE_HEIGHT != 0) {
      this.x = this.gameState.game.math.snapTo(this.x, TILE_WIDTH, 0);
    }
  } else if(direction == "left") {
    // move left
    this.direction = "left";
    this.body.velocity.x = -this.properties.speed;
    this.body.velocity.y = 0;
    this.angle = -90;
    this.body.setSize(32, 24, 0, 4);
    if(Math.round(this.x) % TILE_WIDTH != 0) {
      this.y = this.gameState.game.math.snapTo(this.y, TILE_HEIGHT, 0);
    }
  } else if(direction == "right") {
    // move right
    this.direction = "right";
    this.body.velocity.x = this.properties.speed;
    this.body.velocity.y = 0;
    this.angle = 90;
    this.body.setSize(32, 24, 0, 4);
    if(Math.round(this.x) % TILE_WIDTH != 0) {
      this.y = this.gameState.game.math.snapTo(this.y, TILE_HEIGHT, 0);
    }
  }
}

GameTank.Tank.prototype.explode = function() {
  var boom = game.add.sprite(this.x, this.y, 'explode', 0);
  boom.anchor.setTo(0.5, 0.5);
  var anim = boom.animations.add('boom', [0, 1, 2], 20);
  anim.play();
  anim.onComplete.add(function() {
    boom.destroy();
  });
};
