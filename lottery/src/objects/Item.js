
/**
* Item，一个项，封装项的所有动作
*/

var Phaser = Phaser || {};
var BirdsAnimals = BirdsAnimals || {};

BirdsAnimals.Item = function(gameState, position, texture, group, properties) {
  "use strict";
  // 精灵
  Phaser.Sprite.call(this, gameState.game, position.x, position.y, texture);
  this.anchor.setTo(0.5, 0.5);
  this.width = 70;
  this.height = 60;
  this.gameState = gameState;
  this.properties = properties;
  this.type = properties.type;
  if(group) {
    this.gameState.groups[group].add(this);
  }
  this.frame = this.properties.frame;

  // 声音
  this.sound = game.add.sound(this.properties.sound);

  // 黑色背景
  var blackMask = game.add.graphics(position.x, position.y);
  blackMask.anchor.setTo(0.5, 0.5);

  blackMask.beginFill(0x000000);
  blackMask.drawRect(-35, -30, 70, 60);
  blackMask.endFill();
  this.gameState.groups['blackMask'].add(blackMask);

  // 黄色遮罩
  this.yellowMask = game.add.graphics(position.x, position.y);
  this.yellowMask.anchor.setTo(0.5, 0.5);

  this.yellowMask.beginFill(0xffff00);
  this.yellowMask.drawRect(-35, -30, 70, 60);
  this.yellowMask.endFill();

  this.yellowMask.alpha = 0;

  // 框里的动画
  this.frameAnim = game.add.sprite(position.x, position.y, this.properties.runAnim);
  this.frameAnim.width = 70;
  this.frameAnim.anchor.setTo(0.5, 0.5);
  this.frameAnim.animations.add('run');
  this.frameAnim.alpha = 0;
}

BirdsAnimals.Item.prototype = Object.create(Phaser.Sprite.prototype);
BirdsAnimals.Item.prototype.constructor = BirdsAnimals.Item;

// 变黄色
BirdsAnimals.Item.prototype.beYellow = function() {
  this.yellowMask.alpha = 0.8;
}

// 黄色消失
BirdsAnimals.Item.prototype.unBeYellow = function() {
  game.add.tween(this.yellowMask).to({alpha: 0}, 400, Phaser.Easing.Linear.None, true);
}

// 跑框里的动画
BirdsAnimals.Item.prototype.runFrameAnim = function() {
  this.frameAnim.alpha = 1;
  this.frameAnim.animations.play('run', 8, true);

  // 8秒后停止
  game.time.events.add(Phaser.Timer.SECOND * 8, function() {
    this.frameAnim.animations.stop('run');
    this.frameAnim.alpha = 0;
  }, this);
}

// 跑外层动画
BirdsAnimals.Item.prototype.runBigAnim = function() {
  if(this.properties.type == 'YINSHAYU' || this.properties.type == 'JINSHAYU') {
    this.runBigAnimShayu();
  } else {
    this.runBigAnimFour();
  }
  this.sound.play();
}

// 跑鲨鱼动画
BirdsAnimals.Item.prototype.runBigAnimShayu = function() {
  var pos = [{x: game.width/4, y: game.height/2}, {x: game.width*3/4, y: game.height/2}];
  var animals = [];
  var fishes = [];
  for(var i=0; i<pos.length; i++) {
    var animal = game.add.sprite(pos[i].x, pos[i].y, this.properties.bigAnim[1]);
    animal.anchor.setTo(0.5, 0.5);
    animal.scale.setTo(0.5, 0.5);
    animal.animations.add('run');
    animal.animations.play('run', 8, true);
    animals.push(animal);

    var fish = game.add.sprite(pos[i].x, pos[i].y, this.properties.bigAnim[0]);
    fish.anchor.setTo(0.5, 0.5);
    fish.scale.setTo(0.5, 0.5);
    fishes.push(fish);

    game.add.tween(fish).to({angle: 1800}, 5000, Phaser.Easing.Linear.None, true);
  }

  // 5秒后停止
  game.time.events.add(Phaser.Timer.SECOND * 5, function() {
    for(var i=0; i<animals.length; i++) {
      animals[i].animations.stop('run');
      animals[i].destroy();
      fishes[i].destroy();
    }
  }, this);
}

// 跑其他动画
BirdsAnimals.Item.prototype.runBigAnimFour = function() {
  var pos = [{x: game.width/2, y: 100}, {x: game.width/2, y: game.height-100}, {x: game.width-150, y: game.height/2}, {x: 150, y: game.height/2}];
  var animals = [];
  for(var i=0; i<pos.length; i++) {
    var animal = game.add.sprite(pos[i].x, pos[i].y, this.properties.bigAnim[0]);
    animal.anchor.setTo(0.5, 0.5);
    animal.animations.add('run');
    animal.animations.play('run', 8, true);
    animals.push(animal);
  }

  // 5秒后停止
  game.time.events.add(Phaser.Timer.SECOND * 5, function() {
    for(var i=0; i<animals.length; i++) {
      animals[i].animations.stop('run');
      animals[i].destroy();
    }
  }, this);
}




