
var GameTank = GameTank || {};

GameTank.Nest = function(gameState, position, texture, group, properties) {
  "use strict";
  GameTank.Prefab.call(this, gameState, position, texture, group, properties);
  this.body.immovable = true;
};

GameTank.Nest.prototype = Object.create(GameTank.Prefab.prototype);
GameTank.Nest.prototype.constructor = GameTank.Nest;

GameTank.Nest.prototype.update = function () {
  "use strict";
}

GameTank.Nest.prototype.dead = function() {
  this.loadTexture('nest_dead');
  this.gameState.gameOver();
}

