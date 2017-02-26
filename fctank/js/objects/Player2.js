
var GameTank = GameTank || {};

GameTank.Player2 = function(gameState, position, texture, group, properties) {
  "use strict";
  GameTank.Player.call(this, gameState, position, texture, group, properties);
  
  this.keyW = gameState.game.input.keyboard.addKey(Phaser.KeyCode.W);
  this.keyS = gameState.game.input.keyboard.addKey(Phaser.KeyCode.S);
  this.keyA = gameState.game.input.keyboard.addKey(Phaser.KeyCode.A);
  this.keyD = gameState.game.input.keyboard.addKey(Phaser.KeyCode.D);
  
  this.keyJ = gameState.game.input.keyboard.addKey(Phaser.KeyCode.J);
  this.keyJ.onDown.add(this.fire, this);
  
};

GameTank.Player2.prototype = Object.create(GameTank.Player.prototype);
GameTank.Player2.prototype.constructor = GameTank.Player2;

GameTank.Player2.prototype.update = function () {
  "use strict";
  if(game.gameover) {
    return;
  }
  
  this.playerUpdate();
  
  if (this.keyD.isDown) {
    this.move("right");
  } else if (this.keyA.isDown) {
    this.move("left");
  } else if(this.keyW.isDown) {
    this.move("up");
  } else if(this.keyS.isDown) {
    this.move("down");
  } else {
    // stop
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
  }
};

GameTank.Player2.prototype.dead = function() {
  this.playerDead();
  if(this.gameState.scoreManager.playerKilled(2)) {
    // 还有命，就重生
    this.rebirth(this.gameState.playerBores[1]);
  } else {
    // 否则，死亡
    this.destroy();
  }
};

