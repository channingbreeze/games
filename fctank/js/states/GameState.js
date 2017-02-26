
var Phaser = Phaser || {};
var GameTank = GameTank || {};

GameTank.GameState = function () {
  "use strict";
  GameTank.BaseState.call(this);
};

GameTank.GameState.prototype = Object.create(GameTank.BaseState.prototype);
GameTank.GameState.prototype.constructor = GameTank.GameState;

GameTank.GameState.prototype.create = function () {
  "use strict";
  // 分数管理
  this.scoreManager = new GameTank.ScoreManager(this);
  this.scoreManager.setLevel(game.level);
  
  this.groups = {};
  
  // 坦克
  this.groups["enemy"] = game.add.group();
  this.groups["player"] = game.add.group();
  
  // 地图相关组
  this.groups.map = [];
  ["brick", "iron", "grass", "waterv", "waterh"].forEach(function(key) {
    this.groups.map[key] = game.add.group();
    this.groups.map[key].enableBody = true;
    this.groups.map[key].createMultiple(676, key);
  }.bind(this));
  
  // 子弹，奖品
  this.groups["playerBullet"] = game.add.group();
  this.groups["enemyBullet"] = game.add.group();
  this.groups["enemyBorn"] = game.add.group();
  this.groups["nest"] = game.add.group();
  this.groups["bouns"] = game.add.group();
  
  // 坦克的出生地
  this.enemyBores = [];
  this.enemyBores[0] = {x: TILE_WIDTH, y: TILE_HEIGHT};
  this.enemyBores[1] = {x: 13 * TILE_WIDTH, y: TILE_HEIGHT};
  this.enemyBores[2] = {x: 25 * TILE_WIDTH, y: TILE_HEIGHT};
  
  // 玩家的出生地
  this.playerBores = [];
  this.playerBores[0] = {x: 9 * TILE_WIDTH, y: game.height - TILE_HEIGHT};
  this.playerBores[1] = {x: 17 * TILE_WIDTH, y: game.height - TILE_HEIGHT};
  
  // 老巢
  var nestPosition = {x: 13 * TILE_WIDTH, y: game.height - TILE_HEIGHT};
  this.nest = new GameTank.Nest(this, nestPosition, 'nest', 'nest');
  
  // 产生敌人
  this.enemyCount = 0;
  this.enemyTimer = game.time.events.loop(Phaser.Timer.SECOND * 2, this.generateOneEnemy, this);
  
  // 产生玩家
  this.player1 = this.groups["player"].getFirstExists(false);
  if(!this.player1) {
    this.player1 = new GameTank.Player1(this, this.playerBores[0], 'player1', 'player', {
      speed: 100
    });
  }
  this.player1.life = this.player1Life || 1;
  this.player1.changeAnim();
  if(game.playerNum == 2) {
    this.player2 = this.groups["player"].getFirstExists(false);
    if(!this.player2) {
      this.player2 = new GameTank.Player2(this, this.playerBores[1], 'player2', 'player', {
        speed: 100
      });
    }
    this.player2.life = this.player2Life || 1;
    this.player2.changeAnim();
  }
  
  // 加载关卡
  this.levelManager = new GameTank.LevelManager(this);
  this.levelManager.load('level' + game.level);
  
  // 奖品管理
  this.bounsManager = new GameTank.BounsManager(this);
  
  // 声音管理
  this.soundManager = new GameTank.SoundManager(this);
  this.soundManager.gameStart();
  
  // 敌人坦克复位
  game.player1NormalTank = 0;
  game.player1FastTank = 0;
  game.player1StrongTank = 0;
  game.player2NormalTank = 0;
  game.player2FastTank = 0;
  game.player2StrongTank = 0;
};

// 产生敌人的位置
GameTank.GameState.prototype.generateEnemyPosition = function() {
  var res = null; 
  while(res == null) {
    var randomIndex = Math.floor(Math.random() * this.enemyBores.length);
    var position = {
      x: this.enemyBores[randomIndex].x, 
      y: this.enemyBores[randomIndex].y
    };
    var find = false;
    this.groups["enemy"].forEachAlive(function(a) {
      if(a.x > position.x - TILE_WIDTH && a.x < position.x + TILE_WIDTH &&
         a.y > position.y - TILE_HEIGHT && a.y < position.y + TILE_HEIGHT) {
        find = true;
      }
    }, this);
    if(!find) {
      res = position;
    }
  }
  return res;
};

// 产生敌人逻辑
GameTank.GameState.prototype.generateOneEnemy = function() {
  // 是否有奖品
  var award = (Math.random() > (1 - BOUNS_PERCENT)) ? 1 : 0;
  // 敌人坦克种类
  var tankType = 0;
  var probability = Math.random();
  if(probability < 0.5) {
    tankType = 0;
  } else if(probability < 0.8) {
    tankType = 1;
  } else {
    tankType = 2;
  }
  if(this.groups["enemy"].countLiving() < 3) {
    this.enemyCount++;
    if(this.enemyCount >= ENEMY_NUMBER) {
      game.time.events.remove(this.enemyTimer);
    }
    var position = this.generateEnemyPosition();
    var enemy = this.groups["enemy"].getFirstExists(false);
    if(!enemy) {
      enemy = new GameTank.Enemy(this, position, 'enemy', 'enemy', {
        speed: (tankType == 1) ? 200 : 100,
        award: award,
        type: tankType
      });
    } else {
      enemy.rebirth(position, {
        speed: (tankType == 1) ? 200 : 100,
        award: award,
        type: tankType
      });
    }
  }
};

// 游戏结束
GameTank.GameState.prototype.gameOver = function() {
  if(game.gameover) {
    return;
  }
  game.gameover = true;
  var gameOverSprite = game.add.sprite((game.width - 96 - 235) / 2, game.height);
  // 绿色背景
  var greenBack = game.add.graphics(0, 0);
  greenBack.beginFill(0x00FF01);
  greenBack.drawRoundedRect(0, 0, 235, 125, 10);
  greenBack.endFill();
  gameOverSprite.addChild(greenBack);
  // 蓝色文字
  var style = { font: "bold 32px Arial", fill: "#090892", boundsAlignH: "center", boundsAlignV: "middle" };
  var gameText = game.add.text(0, 0, "G  A  M  E", style);
  gameText.setTextBounds(0, -20, greenBack.width, 125);
  gameOverSprite.addChild(gameText);
  var overText = game.add.text(0, 0, "O  V  E  R", style);
  overText.setTextBounds(0, 20, greenBack.width, 125);
  gameOverSprite.addChild(overText);
  game.add.tween(gameOverSprite).to({y:(game.height - 125) / 2}, 1000, "Linear", true);
  // 游戏结束声音
  this.soundManager.gameOver();
}

