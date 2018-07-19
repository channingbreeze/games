
var Phaser = Phaser || {};
var GameTank = GameTank || {};

GameTank.BaseState = function () {
  "use strict";
  Phaser.State.call(this);
};

GameTank.BaseState.prototype = Object.create(Phaser.State.prototype);
GameTank.BaseState.prototype.constructor = GameTank.BaseState;
