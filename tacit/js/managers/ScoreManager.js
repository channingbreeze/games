
var Phaser = Phaser || {};
var Tacit = Tacit || {};

Tacit.ScoreManager = function(gameState) {
  "use strict";
  Object.call(this);
  this.gameState = gameState;
  // 左右分数
  game.leftScore = 0;
  game.rightScore = 0;
};

Tacit.ScoreManager.prototype = Object.create(Object.prototype);
Tacit.ScoreManager.prototype.constructor = Tacit.ScoreManager;

Tacit.ScoreManager.prototype.levelScore = function() {
  this.updateScore('left', (this.gameState.levelManager.itemCount + this.gameState.LevelTime - this.gameState.timeCount) * 10);
  this.updateScore('right', (this.gameState.levelManager.itemCount + this.gameState.LevelTime - this.gameState.timeCount) * 10);
}

Tacit.ScoreManager.prototype.updateScore = function(side, score) {
  if(side == "left") {
    game.leftScore += score;
    if(game.leftScore < 0) {
      game.leftScore = 0;
    }
    this.gameState.leftScore.text = game.leftScore + "";
  } else {
    game.rightScore += score;
    if(game.rightScore < 0) {
      game.rightScore = 0;
    }
    this.gameState.rightScore.text = game.rightScore + "";
    this.gameState.rightScore.x = 1920 - this.gameState.rightScore.width - 20;
  }
}
