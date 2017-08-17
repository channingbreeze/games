var Phaser = Phaser || {};
var CrazyBird = CrazyBird || {};

CrazyBird.KiwiFruit = function(gameState, position, texture, group, properties) {
  "use strict";
  CrazyBird.Prefab.call(this, gameState, position, texture, group, properties);
  
  this.myTexture = texture;

  game.physics.p2.enable(this);
  this.body.setCollisionGroup(this.gameState.collideGroups['fruit']);
  this.body.collides([this.gameState.collideGroups['bird']]);
  this.body.static = true;

  game.physics.p2.enable(this);
  this.body.fixedRotation = true;
};

CrazyBird.KiwiFruit.prototype = Object.create(CrazyBird.Prefab.prototype);
CrazyBird.KiwiFruit.prototype.constructor = CrazyBird.KiwiFruit;

CrazyBird.KiwiFruit.prototype.update = function () {
  "use strict";
}

CrazyBird.KiwiFruit.prototype.eated = function () {
  "use strict";
  this.kill();
  var tmp = game.add.sprite(this.x, this.y, this.myTexture);
  tmp.anchor.setTo(0.5, 0.5);
  game.add.tween(tmp).to( { alpha: 0.0 }, 200, Phaser.Easing.Linear.None, true);
  game.add.tween(tmp.scale).to( { x: 2, y: 2 }, 200, Phaser.Easing.Linear.None, true);

}




