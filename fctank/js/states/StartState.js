
var Phaser = Phaser || {};
var GameTank = GameTank || {};

GameTank.StartState = function () {
  "use strict";
  GameTank.BaseState.call(this);
};

GameTank.StartState.prototype = Object.create(GameTank.BaseState.prototype);
GameTank.StartState.prototype.constructor = GameTank.StartState;

GameTank.StartState.prototype.create = function () {
  "use strict";
  var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
  var title = game.add.text(0, 0, "Tank powered by Phaser", style);
  title.setTextBounds(0, 0, game.width, 100);
  style = { font: "bold 14px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
  var bottomText = game.add.text(0, 0, "copyright©2016 Phaser小站 All Rights Reserved", style);
  bottomText.setTextBounds(0, game.height - 100, game.width, 100);
  var logo = game.add.image(game.width/2, 150, 'logo');
  logo.anchor.setTo(0.5, 0.5);
  logo.scale.setTo(1.7, 1.7);
  style = { font: "bold 20px Arial", fill: "#fff" };
  var player1 = game.add.text(210, 240, "1   P L A Y E R", style);
  var player2 = game.add.text(210, 280, "2   P L A Y E R S", style);
  this.tank = game.add.sprite(170, 251, 'player1');
  this.tank.animations.add('run', [0, 1], 10, true);
  this.tank.animations.play("run");
  this.tank.anchor.setTo(0.5, 0.5);
  this.tank.angle = 90;
  this.upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
  this.downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
  this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
};

GameTank.StartState.prototype.update = function() {
  if (this.upKey.isDown) {
    this.tank.y = 251;
  } else if (this.downKey.isDown) {
    this.tank.y = 291;
  } else if (this.spaceKey.isDown) {
    if(this.tank.y == 291) {
      game.playerNum = 2;
    } else {
      game.playerNum = 1;
    }
    // 从第几关开始
    game.level = START_LEVEL;
    game.state.start('GameState');
  }
}
