var Phaser = Phaser || {};
var GameTank = GameTank || {};

// TODO: if no group, prefab will not display, for not added in world
GameTank.Prefab = function(gameState, position, texture, group, properties) {
  "use strict";
  Phaser.Sprite.call(this, gameState.game, position.x, position.y, texture);
  this.anchor.setTo(0.5, 0.5);
  game.physics.arcade.enable(this);
  this.gameState = gameState;
  if(group) {
    this.gameState.groups[group].add(this);
  }
};

GameTank.Prefab.prototype = Object.create(Phaser.Sprite.prototype);
GameTank.Prefab.prototype.constructor = GameTank.Prefab;
