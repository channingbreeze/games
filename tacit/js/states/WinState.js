
var Phaser = Phaser || {};
var Tacit = Tacit || {};

Tacit.WinState = function () {
  "use strict";
  Tacit.BaseState.call(this);
};

Tacit.WinState.prototype = Object.create(Tacit.BaseState.prototype);
Tacit.WinState.prototype.constructor = Tacit.WinState;

Tacit.WinState.prototype.create = function () {
  "use strict";
  game.add.tileSprite(0, 0, WIDTH, HEIGHT, 'background');
  game.add.image(0, 0, 'mask');

  // 上一个场景的元素全部搬过来
  this.leftScore = game.add.bitmapText(20, 10, 'TacitNum', game.leftScore + "", 64);
  this.rightScore = game.add.bitmapText(0, 10, 'TacitNum', game.rightScore + "", 64);
  this.rightScore.x = WIDTH - this.rightScore.width - 20;
  var totalSc = game.add.bitmapText(20, 10, 'TacitNum', (game.leftScore + game.rightScore) + "", 64);
  totalSc.x = WIDTH / 2 - totalSc.width / 2;
  totalSc.y = 100;
  this.circleMask = game.add.sprite(0, 0, 'circleMask');
  this.circleMask.anchor.setTo(0.5, 0.5);
  this.circleMask.scale.setTo(4);
  this.circleMask.reset(WIDTH/2, HEIGHT/2);

  this.brain = game.add.sprite(435 + 1043/2, 1041/2 + 10, 'brain');
  this.brain.anchor.setTo(0.5, 0.5);
  this.brain.scale.setTo(0.5, 0.5);

  this.allPast = game.add.sprite(0, 0);
  this.allPast.addChild(this.leftScore);
  this.allPast.addChild(this.rightScore);
  this.allPast.addChild(totalSc);
  this.allPast.addChild(this.circleMask);
  this.allPast.addChild(this.brain);
  
  var pass_group = game.add.group();

  pass_group.addChild(this.allPast);

  var tree_left = pass_group.create(120, -HEIGHT/2, 'tree_left');
  tree_left.anchor.setTo(0.5, 0.5);

  var tree_right = pass_group.create(WIDTH - 120, -HEIGHT/2, 'tree_right');
  tree_right.anchor.setTo(0.5, 0.5);

  var name = pass_group.create(WIDTH/2, -HEIGHT/2, 'name');
  name.anchor.setTo(0.5, 0.5);

  var org = pass_group.create(WIDTH/2, -HEIGHT/8, 'org');
  org.anchor.setTo(0.5, 0.5);

  var theme = pass_group.create(WIDTH/2, -HEIGHT*7/8 + 100, 'small_theme');
  theme.anchor.setTo(0.5, 0.5);

  var e = game.add.tween(pass_group).to({y: HEIGHT}, 6000, Phaser.Easing.Linear.None, true);
  e.onComplete.add(this.restart, this);
};

Tacit.WinState.prototype.restart = function() {
  game.input.onTap.add(function () {
    game.state.start('MenuState');
  }, this);

  this.space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  this.space.onDown.add(function () {
    game.state.start('MenuState');
  }, this);
}

