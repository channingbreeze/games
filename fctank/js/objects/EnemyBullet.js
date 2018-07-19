
var GameTank = GameTank || {};

GameTank.EnemyBullet = function(gameState, position, texture, group, properties) {
  "use strict";
  GameTank.Bullet.call(this, gameState, position, texture, group, properties);
  
};

GameTank.EnemyBullet.prototype = Object.create(GameTank.Bullet.prototype);
GameTank.EnemyBullet.prototype.constructor = GameTank.EnemyBullet;

GameTank.EnemyBullet.prototype.update = function () {
  "use strict";
  this.bulletUpdate();
  this.gameState.game.physics.arcade.overlap(this, this.gameState.groups["player"], this.killPlayer);
};

GameTank.EnemyBullet.prototype.killPlayer = function (bullet, player) {
  "use strict";
  bullet.kill();
  player.hited();
};

