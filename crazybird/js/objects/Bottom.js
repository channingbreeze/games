var Phaser = Phaser || {};
var CrazyBird = CrazyBird || {};

CrazyBird.Bottom = function(gameState, position, texture, group, properties) {
  "use strict";
  CrazyBird.Prefab.call(this, gameState, position, texture, group, properties);
  
  game.physics.p2.enable(this, true);
  this.fixedToCamera = true;

  this.body.setRectangle(game.world.width, 1);
  this.body.static = true;
  this.body.setCollisionGroup(this.gameState.collideGroups['bottom']);
  this.body.collides([this.gameState.collideGroups['bird']]);

};

CrazyBird.Bottom.prototype = Object.create(CrazyBird.Prefab.prototype);
CrazyBird.Bottom.prototype.constructor = CrazyBird.Bottom;

CrazyBird.Bottom.prototype.update = function () {
  "use strict";
}




