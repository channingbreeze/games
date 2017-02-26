
var Phaser = Phaser || {};
var GameTank = GameTank || {};

GameTank.BounsManager = function(gameState) {
  "use strict";
  Object.call(this);
  this.gameState = gameState;
  
};

GameTank.BounsManager.prototype = Object.create(Object.prototype);
GameTank.BounsManager.prototype.constructor = GameTank.BounsManager;

// 生成一个奖品
GameTank.BounsManager.prototype.generateOneBouns = function() {
  var x = Math.floor(Math.random() * 24) + 1;
  var y = Math.floor(Math.random() * 24) + 1;
  var type = Math.floor(Math.random() * 6);

  var bouns = this.gameState.groups["bouns"].getFirstExists(false);
  var position = {x: x * TILE_WIDTH, y: y * TILE_HEIGHT};
  if(!bouns) {
    bouns = new GameTank.Bouns(this.gameState, position, 'bouns', 'bouns', {
      type: type
    });
  } else {
    bouns.rebirth(position, {
      type: type
    });
  }
}

// 接到一个奖品
GameTank.BounsManager.prototype.bounsAward = function(bouns, player) {
  var type = bouns.properties.type;
  // 奖励一条命
  if(type == 0) {
    if(player.key == 'player1') {
      this.gameState.scoreManager.playerLifeAdded(1);
    } else if(player.key == 'player2') {
      this.gameState.scoreManager.playerLifeAdded(2);
    }
  // 定时
  } else if(type == 1) {
    // 定时还没结束，又定时
    if(this.gameState.enemyPauseTimer) {
      this.gameState.game.time.events.remove(this.gameState.enemyPauseTimer);
      this.gameState.enemyPauseTimer = null;
    }
    this.gameState.enemyPause = 1;
    this.gameState.enemyPauseTimer = this.gameState.game.time.events.add(Phaser.Timer.SECOND * 6, function() {
      this.gameState.enemyPause = 0;
      this.gameState.game.time.events.remove(this.gameState.enemyPauseTimer);
      this.gameState.enemyPauseTimer = null;
    }, this);
  // 铲子
  } else if(type == 2) {
    this.gameState.levelManager.getShovel();
  // 炸弹
  } else if(type == 3) {
    this.gameState.groups["enemy"].forEachAlive(function(enemy) {
      enemy.dead();
    });
  // 五角星
  } else if(type == 4) {
    player.getStar();
  // 头盔
  } else if(type == 5) {
    player.getHelmet();
  }
}
