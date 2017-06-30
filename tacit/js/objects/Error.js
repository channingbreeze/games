
var Tacit = Tacit || {};

Tacit.Error = function(gameState, position, texture, group, properties) {
  "use strict";
  Phaser.TileSprite.call(this, gameState, position.x, position.y, 98, HEIGHT, texture);
  this.gameState = gameState;
  if(group) {
    this.gameState.groups[group].add(this);
  }
  this.alpha = 0;
  this.scale.x = 10 * properties.dir;
};

Tacit.Error.prototype = Object.create(Phaser.TileSprite.prototype);
Tacit.Error.prototype.constructor = Tacit.Error;

Tacit.Error.prototype.update = function () {
  "use strict";
}

Tacit.Error.prototype.blink = function() {
  var tween = game.add.tween(this).to({alpha: 1}, 100, "Linear", true, 0, 0, true);
  tween.onComplete.add(function() {
    this.alpha = 0;
  }, this);
}


