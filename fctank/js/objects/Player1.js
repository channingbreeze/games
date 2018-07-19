
var GameTank = GameTank || {};

GameTank.Player1 = function(gameState, position, texture, group, properties) {
  "use strict";
  GameTank.Player.call(this, gameState, position, texture, group, properties);
  
  this.cursors = gameState.game.input.keyboard.createCursorKeys();
  this.space = gameState.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  this.space.onDown.add(this.fire, this);
};

GameTank.Player1.prototype = Object.create(GameTank.Player.prototype);
GameTank.Player1.prototype.constructor = GameTank.Player1;

GameTank.Player1.prototype.update = function () {
  "use strict";
  if(game.gameover) {
    return;
  }
  
  this.playerUpdate();
  
  if (this.cursors.right.isDown) {
    this.move("right");
  } else if (this.cursors.left.isDown) {
    this.move("left");
  } else if(this.cursors.up.isDown) {
    this.move("up");
  } else if(this.cursors.down.isDown) {
    this.move("down");
  } else {
    // stop
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
  }
};

GameTank.Player1.prototype.dead = function() {
  this.playerDead();
  if(this.gameState.scoreManager.playerKilled(1)) {
    // 还有命，就重生
    this.rebirth(this.gameState.playerBores[0]);
  } else {
    // 否则，死亡
    this.destroy();
  }
};

