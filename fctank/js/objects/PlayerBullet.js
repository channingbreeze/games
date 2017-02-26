
var GameTank = GameTank || {};

GameTank.PlayerBullet = function(gameState, position, texture, group, properties) {
  "use strict";
  GameTank.Bullet.call(this, gameState, position, texture, group, properties);
};

GameTank.PlayerBullet.prototype = Object.create(GameTank.Bullet.prototype);
GameTank.PlayerBullet.prototype.constructor = GameTank.PlayerBullet;

GameTank.PlayerBullet.prototype.update = function () {
  "use strict";
  this.bulletUpdate();
  this.gameState.game.physics.arcade.overlap(this, this.gameState.groups["enemy"], this.killEnemy, null, this);
  this.gameState.game.physics.arcade.overlap(this, this.gameState.groups["enemyBullet"], this.killBullet);
};

GameTank.PlayerBullet.prototype.killEnemy = function (bullet, enemy) {
  "use strict";
  bullet.kill();
  enemy.hited(this.owner);
};

GameTank.PlayerBullet.prototype.killBullet = function (bullet1, bullet2) {
  bullet1.kill();
  bullet2.kill();
};
