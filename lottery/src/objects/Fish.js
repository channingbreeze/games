
/**
* Fish，一条鱼，封装鱼的所有动作
*/

var Phaser = Phaser || {};
var BirdsAnimals = BirdsAnimals || {};

BirdsAnimals.Fish = function(gameState, position, texture, group, properties) {
  "use strict";
  // 精灵
  Phaser.Sprite.call(this, gameState.game, position.x, position.y, texture);
  this.anchor.setTo(0.5, 0.5);
  this.gameState = gameState;
  this.properties = properties;
  this.width = this.gameState.cache.getImage(texture).width / this.properties.frames;
  this.height = this.gameState.cache.getImage(texture).height;

  if(group) {
    this.gameState.groups[group].add(this);
  }

  this.adjustPos();
  this.animations.add('swim');

  game.physics.enable(this, Phaser.Physics.ARCADE);

  this.startSwim = false;
  this.speed = 0;

  this.count = 0;

}

BirdsAnimals.Fish.prototype = Object.create(Phaser.Sprite.prototype);
BirdsAnimals.Fish.prototype.constructor = BirdsAnimals.Fish;

BirdsAnimals.Fish.prototype.adjustPos = function() {
  if(this.properties.initSide == 'left') {
    this.reset(-this.width - 100, game.height / 2);
    this.angle = 0;
  } else if(this.properties.initSide == 'right') {
    this.reset(game.width + this.width + 100, game.height / 2);
    this.angle = -180;
  } else if(this.properties.initSide == 'up') {
    this.reset(game.width / 2, game.height + this.height + 100);
    this.angle = -90;
  } else if(this.properties.initSide == 'down') {
    this.reset(game.width / 2, -this.height - 100);
    this.angle = 90;
  }
}

// 游
BirdsAnimals.Fish.prototype.swim = function() {
  this.animations.play('swim', 8, true);
  this.startSwim = true;
  game.time.events.loop(Phaser.Timer.SECOND, this.updateDirOrSpeed, this);
}

BirdsAnimals.Fish.prototype.updateDirOrSpeed = function() {
  this.count++;
  if(this.count % 3 == 0) {
    this.speed = game.rnd.pick([60, 80, 100, 120]);
  }
  if(this.count % 4 == 0) {
    this.body.angularVelocity = game.rnd.pick([20, -20, 0, 10, -10]);
  }
}

BirdsAnimals.Fish.prototype.outBack = function() {
  if(this.x > game.width + this.width + 100) {
    this.x = - this.width - 100;
  } else if(this.x < -this.width - 100) {
    this.x = game.width + this.width + 100;
  }

  if(this.y > game.height + this.height + 100) {
    this.y = - this.height - 100;
  } else if(this.y < -this.height - 100) {
    this.y = game.height + this.height + 100;
  }
}

BirdsAnimals.Fish.prototype.update = function() {
  if(this.startSwim) {
    this.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(this.angle,this.speed));
  }

  this.outBack();
}



