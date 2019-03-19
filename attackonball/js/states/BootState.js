
var Phaser = Phaser || {};
var AttackOnBall = AttackOnBall || {};

AttackOnBall.BootState = function () {
  "use strict";
  Phaser.State.call(this);
};

AttackOnBall.BootState.prototype = Object.create(Phaser.State.prototype);
AttackOnBall.BootState.prototype.constructor = AttackOnBall.BootState;

AttackOnBall.BootState.prototype.preload = function () {
  "use strict";
  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
};

AttackOnBall.BootState.prototype.create = function () {
  "use strict";
  game.state.start('PreloadState');
};
