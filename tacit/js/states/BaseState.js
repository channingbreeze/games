
var Phaser = Phaser || {};
var Tacit = Tacit || {};

Tacit.BaseState = function () {
  "use strict";
  Phaser.State.call(this);
};

Tacit.BaseState.prototype = Object.create(Phaser.State.prototype);
Tacit.BaseState.prototype.constructor = Tacit.BaseState;
