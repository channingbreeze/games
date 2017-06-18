
var Phaser = Phaser || {};
var Tatic = Tatic || {};

var WIDTH = 1920;
var HEIGHT = 1080;

Tatic.WinState = function () {
  "use strict";
  Tatic.BaseState.call(this);
};

Tatic.WinState.prototype = Object.create(Tatic.BaseState.prototype);
Tatic.WinState.prototype.constructor = Tatic.WinState;

Tatic.WinState.prototype.create = function () {
  "use strict";
  //this.autoScreen();
  game.add.tileSprite(0, 0, WIDTH, HEIGHT, 'background');
  game.add.image(0, 0, 'mask');

  this.allPast = game.add.sprite(0, 0);

  this.leftScore = game.add.bitmapText(20, 10, 'taticNum', game.leftScore + "", 64);
  this.rightScore = game.add.bitmapText(0, 10, 'taticNum', game.rightScore + "", 64);
  this.rightScore.x = 1920 - this.rightScore.width - 20;
  var totalSc = game.add.bitmapText(20, 10, 'taticNum', (game.leftScore + game.rightScore) + "", 64);
  totalSc.x = WIDTH / 2 - totalSc.width / 2;
  totalSc.y = 100;
  this.circleMask = game.add.sprite(0, 0, 'circleMask');
  this.circleMask.anchor.setTo(0.5, 0.5);
  this.circleMask.scale.setTo(4);
  this.circleMask.reset(WIDTH/2, HEIGHT/2);

  this.brain = game.add.sprite(435 + 1043/2, 1041/2 + 10, 'brain');
  this.brain.anchor.setTo(0.5, 0.5);
  this.brain.scale.setTo(0.5, 0.5);

  this.allPast.addChild(this.leftScore);
  this.allPast.addChild(this.rightScore);
  this.allPast.addChild(totalSc);
  this.allPast.addChild(this.circleMask);
  this.allPast.addChild(this.brain);
  
  var pass_group = game.add.group();

  pass_group.addChild(this.allPast);

  var tree_left = pass_group.create(120, game.world.centerY - game.height, 'tree_left');

  tree_left.anchor.setTo(0.5, 0.5);

  var tree_right = pass_group.create(game.width - 120, game.world.centerY - game.height, 'tree_right');
  tree_right.anchor.setTo(0.5, 0.5);

  var name = pass_group.create(game.world.centerX, game.world.centerY - game.height, 'name');
  name.anchor.setTo(0.5, 0.5);

  var org = pass_group.create(game.world.centerX, game.world.centerY * 1.75 - game.height, 'org');
  org.anchor.setTo(0.5, 0.5);

  // over = pass_group.create(game.world.centerX, game.world.centerY * 0.75, 'tree_left');
  var theme = pass_group.create(game.world.centerX, game.world.centerY * 0.25 - game.height + 100, 'small_theme');
  theme.anchor.setTo(0.5, 0.5);

  var e = game.add.tween(pass_group).to({y: game.height}, 6000, Phaser.Easing.Linear.None, true);
  e.onComplete.add(this.restart, this);
};

Tatic.WinState.prototype.restart = function() {
  game.input.onTap.add(function () {
    game.state.start('MenuState');
  }, this);

  this.space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  this.space.onDown.add(function () {
    game.state.start('MenuState');
  }, this);
}

