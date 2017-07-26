
var Phaser = Phaser || {};
var CrazyBird = CrazyBird || {};

CrazyBird.BaseState = function () {
  "use strict";
  Phaser.State.call(this);
};

CrazyBird.BaseState.prototype = Object.create(Phaser.State.prototype);
CrazyBird.BaseState.prototype.constructor = CrazyBird.BaseState;
