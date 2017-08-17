var Phaser = Phaser || {};
var CrazyBird = CrazyBird || {};

CrazyBird.Cat = function(gameState, position, texture, group, properties) {
  "use strict";
  CrazyBird.Prefab.call(this, gameState, position, texture, group, properties);
  
  game.physics.p2.enable(this);

  this.body.setCollisionGroup(this.gameState.collideGroups['cat']);
  this.body.collides([this.gameState.collideGroups['bird']]);
  this.body.static = true;
  
};

CrazyBird.Cat.prototype = Object.create(CrazyBird.Prefab.prototype);
CrazyBird.Cat.prototype.constructor = CrazyBird.Cat;

CrazyBird.Cat.prototype.update = function () {
  "use strict";
}





