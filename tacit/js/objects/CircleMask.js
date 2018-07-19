
var Tacit = Tacit || {};

Tacit.CircleMask = function(gameState, position, texture, group, properties) {
  "use strict";
  Tacit.Prefab.call(this, gameState, position, texture, group, properties);
  this.gameState = gameState;
  this.scale.setTo(0.1);
};

Tacit.CircleMask.prototype = Object.create(Tacit.Prefab.prototype);
Tacit.CircleMask.prototype.constructor = Tacit.CircleMask;

Tacit.CircleMask.prototype.update = function () {
  "use strict";
}

Tacit.CircleMask.prototype.show = function() {
  game.add.tween(this.scale).to({x: 6.5, y: 6.5}, 0, Phaser.Easing.Exponential.Out, true);
}

Tacit.CircleMask.prototype.disappear = function() {
  game.add.tween(this.scale).to({x: 0, y: 0}, 500, Phaser.Easing.Exponential.In, true);
}

Tacit.CircleMask.prototype.big = function() {
  game.add.tween(this.scale).to({x: 9, y: 9}, 1000, Phaser.Easing.Exponential.In, true);
}

Tacit.CircleMask.prototype.small = function() {
  game.add.tween(this.scale).to({x: 4, y: 4}, 1500, Phaser.Easing.Exponential.In, true);
}
