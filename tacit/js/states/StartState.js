
var Phaser = Phaser || {};
var Tacit = Tacit || {};

Tacit.StartState = function () {
  "use strict";
  Tacit.BaseState.call(this);
};

Tacit.StartState.prototype = Object.create(Tacit.BaseState.prototype);
Tacit.StartState.prototype.constructor = Tacit.StartState;

Tacit.StartState.prototype.create = function () {
  "use strict";

  this.gOver = false;
  this.canButton = false;

  // 关卡
  this.levelNum = 0;

  this.missions = [];
  this.curLine = 0;
  this.curLineCount = 0;
  
  this.LevelTime = 0;
  this.blood = TOTAL_BLOOD;
  this.timeCount = 0;


  // 背景，遮罩，实现
  game.add.tileSprite(0, 0, WIDTH, HEIGHT, 'background');
  game.add.image(0, 0, 'mask');

  // 各种组，组的顺序决定层级的顺序
  this.groups = {};
  this.groups["circleMask"] = game.add.group();
  this.groups["mission"] = game.add.group();
  this.groups["pointer"] = game.add.group();
  this.groups["tree"] = game.add.group();
  this.groups["emitter"] = game.add.group();
  this.groups["error"] = game.add.group();
  this.groups["graphic"] = game.add.group();
  this.groups["button"] = game.add.group();
  
  // 中间的圆
  this.circleMask = new Tacit.CircleMask(this, {x: WIDTH/2, y: HEIGHT/2}, 'circleMask', 'circleMask');
  this.circleMask.show();

  // 黑色的圈
  this.blackCircle = new Tacit.BlackCircle(this, {x: WIDTH/2, y: HEIGHT/2}, 'graphic');
  this.blackCircle.show(function() {
    this.loadLevel(this.levelNum);
  });

  // 蓝色的虚线圈
  this.dashCircle = new Tacit.DashCircle(this, {x: WIDTH/2, y: HEIGHT/2}, 'graphic');

  // 代表时间的白色圈
  this.timeCircle = new Tacit.TimeCircle(this, {x: WIDTH/2, y: HEIGHT/2}, 'graphic');

  // 代表血条的圈
  this.bloodCircle = new Tacit.BloodCircle(this, {x: WIDTH/2, y: HEIGHT/2}, 'graphic');

  this.emitter = new Tacit.Emitter(this, {
    x: 0,
    y: 0
  }, 200, 'emitter');

  this.treeManager = new Tacit.TreeManager(this);
  this.pointerManager = new Tacit.PointerManager(this);
  this.scoreManager = new Tacit.ScoreManager(this);
  this.levelManager = new Tacit.LevelManager(this);

  // 错误
  this.leftError = new Tacit.Error(this, {x: 0, y: 0}, 'redError', 'error', {dir: 1});
  this.rightError = new Tacit.Error(this, {x: WIDTH, y: 0}, 'redError', 'error', {dir: -1});

  // 按钮的圈
  this.buttonCircleGroup = game.add.group();
  this.buttonCircleGroup.createMultiple(12, 'button_circle');

  // Mission的特效
  this.missionEffectGroup = game.add.group();

  // mission组
  this.missionGroup = game.add.group();

  // 左侧部分
  var leftDash = game.add.image(0, 138, 'dash');
  this.leftBtn1 = new Tacit.MissionButton(this, {x: 20+145/2, y: 230+145/2}, 'button_black', this.clickButton, {'side': 'left', 'index': 0, 'game': this, 'btn': 'leftBtn1'}, 'button', {keyCode: Phaser.KeyCode.Q});
  this.leftBtn2 = new Tacit.MissionButton(this, {x: 60+145/2, y: 480+145/2}, 'button_red', this.clickButton, {'side': 'left', 'index': 2, 'game': this, 'btn': 'leftBtn2'}, 'button', {keyCode: Phaser.KeyCode.A});
  this.leftBtn3 = new Tacit.MissionButton(this, {x: 20+145/2, y: 730+145/2}, 'button_yellow', this.clickButton, {'side': 'left', 'index': 4, 'game': this, 'btn': 'leftBtn3'}, 'button', {keyCode: Phaser.KeyCode.Z});
  this.leftScore = game.add.bitmapText(20, 10, 'TacitNum', game.leftScore + "", 64);

  this.leftPart = game.add.sprite(0, 0);
  this.leftPart.addChild(leftDash);
  this.leftPart.addChild(this.leftBtn1);
  this.leftPart.addChild(this.leftBtn2);
  this.leftPart.addChild(this.leftBtn3);
  this.leftAll = game.add.sprite(0, 0);
  this.leftAll.addChild(this.leftPart)
  this.leftAll.addChild(this.leftScore);

  this.leftAll.x = -300;
  game.add.tween(this.leftAll).to({x: 0}, 0, Phaser.Easing.Exponential.Out, true);

  // 右侧部分
  var rightDash = game.add.image(1920, 138, 'dash');
  rightDash.scale.x = -1;
  this.rightBtn1 = new Tacit.MissionButton(this, {x: 1770-20+145/2, y: 230+145/2}, 'button_blue', this.clickButton, {'side': 'right', 'index': 1, 'game': this, 'btn': 'rightBtn1'}, 'button', {keyCode: Phaser.KeyCode.O});
  this.rightBtn2 = new Tacit.MissionButton(this, {x: 1770-60+145/2, y: 480+145/2}, 'button_red', this.clickButton, {'side': 'right', 'index': 2, 'game': this, 'btn': 'rightBtn2'}, 'button', {keyCode: Phaser.KeyCode.K});
  this.rightBtn3 = new Tacit.MissionButton(this, {x: 1770-20+145/2, y: 730+145/2}, 'button_green', this.clickButton,{'side': 'right', 'index': 3, 'game': this, 'btn': 'rightBtn3'}, 'button', {keyCode: Phaser.KeyCode.M});
  this.rightScore = game.add.bitmapText(0, 10, 'TacitNum', game.rightScore + "", 64);
  this.rightScore.x = 1920 - this.rightScore.width - 20;

  this.rightPart = game.add.sprite(0, 0);
  this.rightPart.addChild(rightDash);
  this.rightPart.addChild(this.rightBtn1);
  this.rightPart.addChild(this.rightBtn2);
  this.rightPart.addChild(this.rightBtn3);
  this.rightAll = game.add.sprite(0, 0);
  this.rightAll.addChild(this.rightPart);
  this.rightAll.addChild(this.rightScore);

  this.rightAll.x = 300;
  game.add.tween(this.rightAll).to({x: 0}, 0, Phaser.Easing.Exponential.Out, true);

  // gameover
  var gameover = game.add.sprite(WIDTH/2, HEIGHT/2 - 100, 'gameover');
  gameover.anchor.setTo(0.5, 0.5);
  gameover.animations.add('shake');
  gameover.animations.play('shake', 3, true);
  this.totalScore = game.add.bitmapText(WIDTH/2, HEIGHT/2 + 100, 'TacitNum', "", 64);
  this.totalScore.x = WIDTH/2 - this.totalScore.width/2;
  this.gameoverAll = game.add.sprite(0, 0);
  this.gameoverAll.addChild(gameover);
  this.gameoverAll.addChild(this.totalScore);
  this.gameoverAll.y = -1080;

  // 通关
  this.brain = game.add.sprite(435 + 1043/2, 1041/2 + 10, 'brain');
  this.brain.anchor.setTo(0.5, 0.5);
  this.brain.alpha = 0;

  this.bloodCircle.setBlood(this.blood);

  this.levelManager.loadStage(1);

};

Tacit.StartState.prototype.clickButton = function() {
  var clickIndex = this.index;
  var clickSide = this.side;
  var missions = this.game.missions;
  var curLine = this.game.curLine;
  var btn = this.game[this.btn];

  var correct = false;
  if(!missions[curLine]){return;}
  for(var i=0; i<missions[curLine].length; i++) {
    if(!missions[curLine][i].sprite.isDone && missions[curLine][i].index == clickIndex) {
      missions[curLine][i].sprite.done();
      correct = true;
      game.soundManager.playSoundRight();
      this.game.curLineCount++;
      if(this.game.curLineCount === missions[curLine].length) {
        this.game.curLineCount = 0;
        this.game.curLine++;
        this.game.pointerManager.posPointer(this.game.curLine);
        if(this.game.curLine == missions.length) {
          game.time.events.remove(this.game.timer);
          this.game.nextLevel();
        }
      }
      break;
    }
  }

  if(!correct) {
    this.game.blood = this.game.blood - TIME_RATIO * 2;
    this.game.bloodCircle.setBlood(this.game.blood);
    this.game.scoreManager.updateScore(clickSide, -10);
    game.soundManager.playSoundError();
    if(clickSide == "left") {
      this.game.leftError.blink();
    } else {
      this.game.rightError.blink();
    }
    if(this.game.blood <= 0) {
      this.game.gOver = true;
      this.game.gameOver();
      game.time.events.remove(this.game.timer);
    }
  }
}

Tacit.StartState.prototype.loadLevel = function(level) {

  this.levelManager.loadLevel(level);

  this.pointerManager.posPointer(this.curLine);

  this.LevelTime = Math.round(this.levelManager.itemCount * LEVEL_TIME_RATIO);

  game.soundManager.playSoundStartLevel();

  this.groups["mission"].y = -400;

  var spriteTween = game.add.tween(this.groups["mission"]).to( { y: 0 }, 500, Phaser.Easing.Bounce.Out, true);
  spriteTween.onComplete.add(function() {

    this.pointerManager.showPointer();

    if(level == 0) {
      this.dashCircle.show();
    }

    this.canButton = true;

    this.timeCount = 0;
    this.timer = game.time.events.loop(Phaser.Timer.SECOND * 0.1 / TIME_RATIO, function() {
      if(this.timeCount < this.LevelTime) {
        this.timeCount++;
        this.timeCircle.setTime(this.timeCount);
      } else if(this.blood > 0) {
        this.blood--;
        this.bloodCircle.setBlood(this.blood);
      } else {
        this.gOver = true;
        this.gameOver();
        game.time.events.remove(this.timer);
      }
    }, this);

  }, this);

}

Tacit.StartState.prototype.nextLevel = function() {
  var goNext = function() {
    this.curLine = 0;
    this.loadLevel(this.levelNum);
  }

  this.canButton = false;

  this.scoreManager.levelScore();

  this.levelManager.nextLevel();

  this.pointerManager.hidePointer();
  
  this.levelNum++;
  
  if(this.levelNum < this.levelManager.levelJSON.length) {
    game.soundManager.playSoundNextLevel();
    this.treeManager.winLevel(this.levelNum, function() {
      goNext.call(this);
    })
  } else {
    // 通关
    this.treeManager.through(this.levelNum);
    this.gOver = true;
    this.through();
  }
}

Tacit.StartState.prototype.allLeft = function(callback) {
  this.bloodCircle.kill();
  this.timeCircle.kill();
  this.dashCircle.kill();
  this.groups["mission"].destroy(true);
  this.pointerManager.killPointer();
  game.add.tween(this.leftPart).to({x: -300}, 0, Phaser.Easing.Exponential.Out, true);
  game.add.tween(this.rightPart).to({x: 300}, 0, Phaser.Easing.Exponential.Out, true);
  this.blackCircle.hide(callback);
}

Tacit.StartState.prototype.gameOver = function() {
  game.soundManager.playSoundGameOver();
  this.totalScore.text = (game.leftScore + game.rightScore) + "";
  this.totalScore.x = WIDTH/2 - this.totalScore.width/2;
  this.circleMask.disappear();

  this.allLeft(function() {
    game.add.tween(this.gameoverAll).to({y: 0}, 500, Phaser.Easing.Exponential.In, true);
    game.input.onTap.add(function() {
      game.state.start('MenuState');
    }, this);
    this.space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.space.onDown.add(function() {
      game.state.start('MenuState');
    }, this);
  });
}

Tacit.StartState.prototype.through = function() {
  game.soundManager.playSoundWin();
  this.timeCircle.kill();
  this.bloodCircle.kill();
  this.allLeft(function() {
    game.time.events.add(Phaser.Timer.SECOND * 0.5, function() {
      this.circleMask.big();
      var brainTween = game.add.tween(this.brain).to({alpha: 1}, 1000, Phaser.Easing.Exponential.In, true);
      brainTween.onComplete.add(function() {
        this.circleMask.small();
        game.add.tween(this.brain.scale).to({x: 0.5, y: 0.5}, 1500, Phaser.Easing.Exponential.In, true);
        this.treeManager.disappearCurrentTree(function() {
          var totalSc = game.add.bitmapText(20, 10, 'TacitNum', (game.leftScore + game.rightScore) + "", 64);
          totalSc.x = WIDTH / 2 - totalSc.width / 2;
          totalSc.y = 100;
          game.soundManager.playSoundMenu();
          game.input.onTap.addOnce(function() {
            game.state.start('WinState');
          }, this);

          this.space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
          this.space.onDown.addOnce(function() {
            game.state.start('WinState');
          }, this);
        });
        
      }, this);
    }, this);
  });
}

Tacit.StartState.prototype.update = function() {
  
}
