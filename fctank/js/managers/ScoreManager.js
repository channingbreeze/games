
var Phaser = Phaser || {};
var GameTank = GameTank || {};

GameTank.ScoreManager = function(gameState) {
  "use strict";
  Object.call(this);
  this.gameState = gameState;
  // 分数版
  this.scoreSprite = game.add.sprite(416, 0);
  game.physics.arcade.enable(this.scoreSprite);
  this.scoreSprite.body.immovable = true;
  // 要进行碰撞检测，需要设置宽和高
  this.scoreSprite.body.width = 96;
  this.scoreSprite.body.height = 416;
  
  var scoreBack = game.add.graphics(0, 0);
  scoreBack.beginFill(0x999999);
  scoreBack.drawRect(0, 0, 96, 416);
  scoreBack.endFill();
  this.scoreSprite.addChild(scoreBack);
  
  this.enemyTankGroup = game.add.group();
  this.count = 0;
  this.player1Life = 3;
  if(game.playerNum == 2) {
    this.player2Life = 3;
  } else {
    this.player2Life = 0;
  }
  
  for(var i=0; i<20; i++) {
    var enemyTankLogo = game.add.image(30 + (i % 2) * 20, 20 + Math.floor(i / 2) * 20, 'enemyScoreTank');
    this.enemyTankGroup.add(enemyTankLogo);
  }
  this.scoreSprite.addChild(this.enemyTankGroup);
  
  var player1Logo = game.add.image(30, 250, 'player1Logo');
  this.scoreSprite.addChild(player1Logo);
  var player1Tank = game.add.image(30, 270, 'playerScoreTank');
  this.scoreSprite.addChild(player1Tank);
  this.player1LifeText = game.add.bitmapText(60, 272, 'tankNum', this.player1Life+"", 12);
  this.scoreSprite.addChild(this.player1LifeText);
  var player2Logo = game.add.image(30, 300, 'player2Logo');
  this.scoreSprite.addChild(player2Logo);
  var player2Tank = game.add.image(30, 320, 'playerScoreTank');
  this.scoreSprite.addChild(player2Tank);
  this.player2LifeText = game.add.bitmapText(60, 322, 'tankNum', this.player2Life+"", 12);
  this.scoreSprite.addChild(this.player2LifeText);
  
  var flag = game.add.image(30, 350, 'flag');
  this.scoreSprite.addChild(flag);

  this.levelText = game.add.bitmapText(55, 357, 'tankNum', "0", 12);
  this.scoreSprite.addChild(this.levelText);
};

GameTank.ScoreManager.prototype = Object.create(Object.prototype);
GameTank.ScoreManager.prototype.constructor = GameTank.ScoreManager;

GameTank.ScoreManager.prototype.setLevel = function(level) {
  this.levelText.text = level+"";
}

GameTank.ScoreManager.prototype.enemyKilled = function() {
  this.count++;
  var length = this.enemyTankGroup.length;
  this.enemyTankGroup.getChildAt(length-this.count).kill();

  if(this.count == ENEMY_NUMBER) {
    // 过关了，3s后进入OverState
    this.gameState.game.time.events.add(Phaser.Timer.SECOND * 3, function() {
      this.gameState.player1Life = this.gameState.player1.life;
      if(this.gameState.player2) {
        this.gameState.player2Life = this.gameState.player2.life;
      }
      this.gameState.game.state.start("OverState");
    }, this);
  }
}

// 返回值表示该player是否还有生命
GameTank.ScoreManager.prototype.playerKilled = function(which) {
  var checkGameOver = function() {
    if(this.player1Life == 0 && this.player2Life == 0) {
      this.gameState.gameOver();
    }
  }
  // 默认kill player1
  if(!which) {
    which = 1;
  }
  if(which == 1) {
    this.player1Life--;
    this.player1LifeText.text = this.player1Life+"";
    checkGameOver.call(this);
    return this.player1Life > 0;
  }
  if(which == 2) {
    this.player2Life--;
    this.player2LifeText.text = this.player2Life+"";
    checkGameOver.call(this);
    return this.player2Life > 0;
  }
}

GameTank.ScoreManager.prototype.playerLifeAdded = function(which) {
  if(!which) {
    which = 1;
  }
  if(which == 1) {
    this.player1Life++;
    this.player1LifeText.text = this.player1Life+"";
  } else if(which == 2) {
    this.player2Life++;
    this.player2LifeText.text = this.player2Life+"";
  }
}
