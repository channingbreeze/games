
var Tacit = Tacit || {};

Tacit.Pointer = function(gameState, position, texture, group, properties) {
  "use strict";
  Tacit.Prefab.call(this, gameState, position, texture, group, properties);
  this.gameState = gameState;
  this.scale.x = -properties.dir;
  this.alpha = 0;
};

Tacit.Pointer.prototype = Object.create(Tacit.Prefab.prototype);
Tacit.Pointer.prototype.constructor = Tacit.Pointer;

Tacit.Pointer.prototype.update = function () {
  "use strict";
}
