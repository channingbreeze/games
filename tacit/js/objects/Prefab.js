var Phaser = Phaser || {};
var Tatic = Tatic || {};

// TODO: if no group, prefab will not display, for not added in world
Tatic.Prefab = function(gameState, position, texture, group, properties) {
  "use strict";
  Phaser.Sprite.call(this, gameState.game, position.x, position.y, texture);
  this.anchor.setTo(0.5, 0.5);
  this.gameState = gameState;
  if(group) {
    this.gameState.groups[group].add(this);
  }
};

Tatic.Prefab.prototype = Object.create(Phaser.Sprite.prototype);
Tatic.Prefab.prototype.constructor = Tatic.Prefab;
