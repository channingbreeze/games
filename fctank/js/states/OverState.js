
var Phaser = Phaser || {};
var GameTank = GameTank || {};

GameTank.OverState = function () {
  "use strict";
  GameTank.BaseState.call(this);
};

GameTank.OverState.prototype = Object.create(GameTank.BaseState.prototype);
GameTank.OverState.prototype.constructor = GameTank.OverState;

GameTank.OverState.prototype.create = function () {

  "use strict";
  // 画界面
  var background = game.add.graphics(0, 0);
  background.beginFill(0x000099);
  background.drawRect(10, 10, game.width - 20, game.height - 20);
  background.endFill();
  background.lineStyle(3, 0xF2F8FF);
  background.moveTo(game.width / 2, 60);
  background.lineTo(game.width / 2, game.height - 60);
  background.lineStyle(1, 0x6C40CB);
  background.moveTo(15, 15);
  background.lineTo(game.width - 15, 15);
  background.lineTo(game.width - 15, game.height - 15);
  background.lineTo(15, game.height - 15);
  background.lineTo(15, 15);
  
  var style = { font: "bold 20px Arial", fill: "#11E92E" };
  var player1Title = game.add.text(85, 25, "player  I", style);
  var enemy11 = game.add.sprite(40, 100, 'enemy');
  enemy11.animations.add('run', [0, 1], 10, true);
  enemy11.animations.play("run");
  this.enemy11Text = game.add.text(100, 106, "X  0    =    0", style);
  var enemy12 = game.add.sprite(39, 190, 'enemy');
  enemy12.animations.add('run', [4, 5], 10, true);
  enemy12.animations.play("run");
  this.enemy12Text = game.add.text(100, 196, "X  0    =    0", style);
  var enemy13 = game.add.sprite(39, 280, 'enemy');
  enemy13.animations.add('run', [12, 13], 10, true);
  enemy13.animations.play("run");
  this.enemy13Text = game.add.text(100, 286, "X  0    =    0", style);
  this.player1Text = game.add.text(50, 356, "total  0    =    0", style);
  
  var style = { font: "bold 20px Arial", fill: "#FEFF1E" };
  var player2Title = game.add.text(325, 25, "player  I I", style);
  var enemy21 = game.add.sprite(280, 100, 'enemy');
  enemy21.animations.add('run', [0, 1], 10, true);
  enemy21.animations.play("run");
  this.enemy21Text = game.add.text(340, 106, "X  0    =    0", style);
  var enemy22 = game.add.sprite(279, 190, 'enemy');
  enemy22.animations.add('run', [4, 5], 10, true);
  enemy22.animations.play("run");
  this.enemy22Text = game.add.text(340, 196, "X  0    =    0", style);
  var enemy23 = game.add.sprite(279, 280, 'enemy');
  enemy23.animations.add('run', [12, 13], 10, true);
  enemy23.animations.play("run");
  this.enemy23Text = game.add.text(340, 286, "X  0    =    0", style);
  this.player2Text = game.add.text(290, 356, "total  0    =    0", style);
  
  // 开始计数
  var player1Total = game.player1NormalTank + game.player1FastTank + game.player1StrongTank;
  var player2Total = game.player2NormalTank + game.player2FastTank + game.player2StrongTank;
  var maxTotal = player1Total;
  if(player2Total > player1Total) {
    maxTotal = player2Total;
  }
  
  game.time.events.repeat(Phaser.Timer.SECOND * 0.3, maxTotal+1, this.countTank, this);
  this.player1Count = 1;
  this.player2Count = 1;
  this.player1TotalScore = 0;
  this.player2TotalScore = 0;
  
  // 声音管理
  this.soundManager = new GameTank.SoundManager(this);
};

GameTank.OverState.prototype.countTank = function() {
  var NORMALSCORE = 100;
  var FASTSCORE = 200;
  var STRONGSCORE = 400;
  
  if(this.player1Count > game.player1NormalTank + game.player1FastTank + game.player1StrongTank
  && this.player2Count > game.player2NormalTank + game.player2FastTank + game.player2StrongTank) {
    this.player1Text.text = "total  " + (this.player1Count - 1) + "    =    " + this.player1TotalScore;
    this.player2Text.text = "total  " + (this.player2Count - 1) + "    =    " + this.player2TotalScore;
    game.time.events.add(Phaser.Timer.SECOND * 3, this.gotoNextLevel, this);
  }
  
  if(this.player1Count <= game.player1NormalTank) {
    this.enemy11Text.text = "X  " + this.player1Count + "    =    " + (this.player1Count * NORMALSCORE);
    this.player1Count++;
    this.player1TotalScore += NORMALSCORE;
  } else if(this.player1Count <= game.player1NormalTank + game.player1FastTank) {
    this.enemy12Text.text = "X  " + (this.player1Count - game.player1NormalTank) + "    =    " + ((this.player1Count - game.player1NormalTank) * FASTSCORE);
    this.player1Count++;
    this.player1TotalScore += FASTSCORE;
  } else if(this.player1Count <= game.player1NormalTank + game.player1FastTank + game.player1StrongTank) {
    this.enemy13Text.text = "X  " + (this.player1Count - game.player1NormalTank - game.player1FastTank) + "    =    " + ((this.player1Count - game.player1NormalTank - game.player1FastTank) * STRONGSCORE);
    this.player1Count++;
    this.player1TotalScore += STRONGSCORE;
  }
  
  if(this.player2Count <= game.player2NormalTank) {
    this.enemy21Text.text = "X  " + this.player2Count + "    =    " + (this.player2Count * NORMALSCORE);
    this.player2Count++;
    this.player2TotalScore += NORMALSCORE;
  } else if(this.player2Count <= game.player2NormalTank + game.player2FastTank) {
    this.enemy22Text.text = "X  " + (this.player2Count - game.player2NormalTank) + "    =    " + ((this.player2Count - game.player2NormalTank) * FASTSCORE);
    this.player2Count++;
    this.player2TotalScore += FASTSCORE;
  } else if(this.player2Count <= game.player2NormalTank + game.player2FastTank + game.player2StrongTank) {
    this.enemy23Text.text = "X  " + (this.player2Count - game.player2NormalTank - game.player2FastTank) + "    =    " + ((this.player2Count - game.player2NormalTank - game.player2FastTank) * STRONGSCORE);
    this.player2Count++;
    this.player2TotalScore += STRONGSCORE;
  }

  this.soundManager.countScore();
}

GameTank.OverState.prototype.gotoNextLevel = function() {
  this.game.level++;
  if(this.game.level > TOTAL_LEVEL) {
    this.game.level = 1;
  }
  this.game.state.start('GameState');
}
