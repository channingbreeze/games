
var Phaser = Phaser || {};
var AttackOnBall = AttackOnBall || {};

AttackOnBall.GameState = function () {
  "use strict";
  Phaser.State.call(this);
};

AttackOnBall.GameState.prototype = Object.create(Phaser.State.prototype);
AttackOnBall.GameState.prototype.constructor = AttackOnBall.GameState;

AttackOnBall.GameState.prototype.init = function (landIndex) {
  "use strict";
  this.landIndex = landIndex;
};

AttackOnBall.GameState.prototype.preload = function () {
  "use strict";
  
};

AttackOnBall.GameState.prototype.create = function () {
  "use strict";
  
  game.physics.startSystem(Phaser.Physics.ARCADE);

  // 背景
  var bg = game.add.image(0, 0, 'bg');

  // 地
  this.land = game.add.sprite(0, HEIGHT - 204, 'land' + this.landIndex);
  game.physics.arcade.enable(this.land);
  this.land.body.setSize(1216, 184, 0, 20);
  this.land.body.immovable = true;

  // 小人
  this.hero = game.add.sprite(WIDTH / 2, HEIGHT - 204 + 20);

  // 小人 spine
  var stickman = game.add.spine(0, 0, 'stickman');
  stickman.scale.setTo(1.5, 1.5);

  stickman.setAnimationByName(0, 'Idle', true);

  this.hero.stickman = stickman;
  this.hero.addChild(stickman);

  this.hero.dir = 0;
  game.physics.arcade.enable(this.hero);
  this.hero.anchor.setTo(0.5, 0.5);
  this.hero.body.setSize(80, 80, -40, -80);
  this.hero.body.collideWorldBounds = true;

  game.input.onDown.add(this.tapDown, this);
  game.input.onUp.add(this.tapUp, this);

  var rate = 2;
  this.ball = game.add.sprite(0, 0, 'ball0');
  this.ball.scale.setTo(rate, rate);
  game.physics.arcade.enable(this.ball);
  this.ball.body.moves = true;
  this.ball.body.velocity.x = 100;
  this.ball.body.bounce.y = 1;
  this.ball.body.gravity.y = 950;
  this.ball.body.setSize(100 * 0.75, 98, 100 * 0.25 / 2, 0);

};

AttackOnBall.GameState.prototype.update = function () {
  "use strict";
  game.physics.arcade.collide(this.land, this.ball);
  game.physics.arcade.collide(this.land, this.bloodEmitter);
  game.physics.arcade.collide(this.land, this.deadPartsEmitter);
  game.physics.arcade.overlap(this.hero, this.ball, this.dead, null, this);
};

AttackOnBall.GameState.prototype.render = function () {
  "use strict";
  game.debug.body(this.land);
  game.debug.body(this.hero);
  game.debug.body(this.ball);
};

AttackOnBall.GameState.prototype.tapDown = function(point) {
  if(point.x > WIDTH / 2) {
    this.hero.dir = 1;
    this.hero.scale.x = 1;
    this.hero.body.velocity.x = heroSpeed;
  } else {
    this.hero.dir = -1;
    this.hero.scale.x = -1;
    this.hero.body.velocity.x = -heroSpeed;
  }
  var randomIndex = game.rnd.integerInRange(0, 4);
  if(randomIndex == 0) {
    this.hero.stickman.setAnimationByName(0, 'Run0', true);
  } else if(randomIndex == 1) {
    this.hero.stickman.setAnimationByName(0, 'Run1', true);
  } else if(randomIndex == 2) {
    this.hero.stickman.setAnimationByName(0, 'Run2', true);
  } else if(randomIndex == 3) {
    this.hero.stickman.setAnimationByName(0, 'Run3', true);
  } else if(randomIndex == 4) {
    this.hero.stickman.setAnimationByName(0, 'RunSmile', true);
  }
}

AttackOnBall.GameState.prototype.tapUp = function() {
  this.hero.dir = 0;
  this.hero.body.velocity.x = 0;
  var randomIndex = game.rnd.integerInRange(0, 1);
  if(randomIndex == 0) {
    this.hero.stickman.setAnimationByName(0, 'Idle', true);
  } else {
    this.hero.stickman.setAnimationByName(0, 'IdleSmile', true);
  }
}

AttackOnBall.GameState.prototype.dead = function(hero, ball) {

  // 血块序列帧动画，单张图片形式播放
  this.playEffectBlood(hero);

  // 粒子血滴效果
  this.playParticleBlood(hero);

  // 身体部分分裂效果
  this.playDeadParts(hero);

  // 地震效果
  this.earthQuake();

  hero.kill();

}

AttackOnBall.GameState.prototype.playEffectBlood = function(hero) {
  
  var count = 0;
  var effectBlood = game.add.sprite(hero.x, hero.y - 45, 'effectBlood' + count);
  effectBlood.anchor.setTo(0.5, 0.5);

  var timer = game.time.events.loop(Phaser.Timer.SECOND * 0.05, function() {
    if(count < 10) {
      count++;
      effectBlood.loadTexture('effectBlood' + count);
    } else {
      game.time.events.remove(timer);
    }
  }, this);

}

AttackOnBall.GameState.prototype.playParticleBlood = function(hero) {
  
  this.bloodEmitter = game.add.emitter(0, 0, 50);

  this.bloodEmitter.makeParticles('blood', 0, 50, true);
  // 重力
  this.bloodEmitter.gravity = 1000;
  // 弹性
  this.bloodEmitter.bounce.setTo(0, 0.2);
  // 速度
  this.bloodEmitter.setXSpeed(-300, 300);
  this.bloodEmitter.setYSpeed(-1000, 0);
  // 缩放
  this.bloodEmitter.minParticleScale = 0.2;
  this.bloodEmitter.maxParticleScale = 1.5;
  // x方向阻力
  this.bloodEmitter.particleDrag.x = 100;

  this.bloodEmitter.x = hero.x;
  this.bloodEmitter.y = hero.y - 45;

  this.bloodEmitter.start(true, -1, null, 50);

}

AttackOnBall.GameState.prototype.playDeadParts = function(hero) {

  this.deadPartsEmitter = game.add.emitter(0, 0, 8);

  this.deadPartsEmitter.makeParticles(deadPartsKeys, 0, 8, true, true);
  // 重力
  this.deadPartsEmitter.gravity = 1000;
  // 弹性
  this.deadPartsEmitter.bounce.setTo(0, 0.2);
  // 速度
  this.deadPartsEmitter.setXSpeed(-800, 800);
  this.deadPartsEmitter.setYSpeed(-1000, 0);
  // x方向阻力
  this.deadPartsEmitter.particleDrag.x = 100;

  this.deadPartsEmitter.x = hero.x;
  this.deadPartsEmitter.y = hero.y - 45;

  this.deadPartsEmitter.start(true, -1, null, 8);

}

AttackOnBall.GameState.prototype.earthQuake = function() {

}





