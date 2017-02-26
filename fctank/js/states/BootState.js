
var Phaser = Phaser || {};
var GameTank = GameTank || {};

GameTank.BootState = function () {
  "use strict";
  GameTank.BaseState.call(this);
};

GameTank.BootState.prototype = Object.create(GameTank.BaseState.prototype);
GameTank.BootState.prototype.constructor = GameTank.BootState;

GameTank.BootState.prototype.preload = function () {
  "use strict";
  game.load.image('loading', 'assets/preloader.gif');
};

GameTank.BootState.prototype.create = function () {
  "use strict";
  game.state.start('PreloadState');
};
