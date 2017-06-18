
var Tatic = Tatic || {};

Tatic.Mission = function(gameState, position, texture, group, properties) {
  "use strict";
  Tatic.Prefab.call(this, gameState, position, texture, group, properties);
  this.gameState = gameState;
  this.myTexture = texture;
  this.frame = 1;
  this.isDone = false;
  this.index = properties.index;
};

Tatic.Mission.prototype = Object.create(Tatic.Prefab.prototype);
Tatic.Mission.prototype.constructor = Tatic.Mission;

Tatic.Mission.prototype.update = function () {
  "use strict";
}

Tatic.Mission.prototype.done = function() {
  var tmp = game.add.sprite(this.x, this.y, this.myTexture);
  tmp.frame = 1;
  tmp.anchor.setTo(0.5);
  game.add.tween(tmp).to({alpha: 0}, 300, Phaser.Easing.Linear.None, true);
  var tween = game.add.tween(tmp.scale).to({x: 2, y:2}, 300, Phaser.Easing.Linear.None, true);
  tween.onComplete.add(function() {
    tmp.destroy();
  }, this);
  this.frame = 0;
  this.gameState.emit(this.index, this, 20);
  this.isDone = true;
}


