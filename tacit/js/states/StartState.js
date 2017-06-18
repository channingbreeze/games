
var Phaser = Phaser || {};
var Tatic = Tatic || {};

var TIME_RATIO = 5;
var WIDTH = 1920;
var HEIGHT = 1080;
var TOTAL_BLOOD = 60*TIME_RATIO;
var LEVEL_TIME_RATIO = 8*TIME_RATIO;

var MissionMap = {
  0: 'missonicon_black',
  1: 'missonicon_blue',
  2: 'missonicon_red',
  3: 'missonicon_green',
  4: 'missonicon_yellow',
}

var emitterMap = {
  0: 0x001322,
  1: 0x19B9FF,
  2: 0xFF7537,
  3: 0xB3FB48,
  4: 0xFFED60,
  5: 0xEDEBDA
}

Tatic.StartState = function () {
  "use strict";
  Tatic.BaseState.call(this);
};

Tatic.StartState.prototype = Object.create(Tatic.BaseState.prototype);
Tatic.StartState.prototype.constructor = Tatic.StartState;

Tatic.StartState.prototype.create = function () {
  "use strict";
  //this.autoScreen();

  this.gOver = false;
  this.canButton = false;

  // 左右分数
  game.leftScore = 0;
  game.rightScore = 0;

  // 音乐
  //game.soundMenu = game.add.audio("sound-menu", 1, true);
  this.soundWin = game.add.audio("sound-win");
  this.soundRight = game.add.audio("sound-right");
  this.soundNextLevel = game.add.audio("sound-nextlevel");
  this.soundGameOver = game.add.audio("sound-gameover");
  this.soundError = game.add.audio("sound-error");
  this.soundStartLevel = game.add.audio("sound-startlevel");

  // 背景，遮罩，实现
  game.add.tileSprite(0, 0, WIDTH, HEIGHT, 'background');
  game.add.image(0, 0, 'mask');

  // 错误
  this.leftError = game.add.tileSprite(0, 0, 98, HEIGHT, 'redError');
  this.leftError.alpha = 0;
  this.leftError.scale.x = 10;
  this.rightError = game.add.tileSprite(WIDTH, 0, 98, HEIGHT, 'redError');
  this.rightError.scale.x = -10;
  this.rightError.alpha = 0;

  // 中间的圆
  this.circleMask = game.add.sprite(0, 0, 'circleMask');
  this.circleMask.anchor.setTo(0.5, 0.5);
  this.circleMask.scale.setTo(0.1);
  this.circleMask.reset(WIDTH/2, HEIGHT/2);
  game.add.tween(this.circleMask.scale).to({x: 6.5, y: 6.5}, 0, Phaser.Easing.Exponential.Out, true);
  
  // 左侧部分
  var leftDash = game.add.image(0, 138, 'dash');
  this.leftBtn1 = game.add.button(20+145/2, 230+145/2, 'button_black', this.clickButton, {'side': 'left', 'index': 0, 'game': this, 'btn': 'leftBtn1'}, 0, 0, 0);
  this.leftBtn2 = game.add.button(60+145/2, 480+145/2, 'button_red', this.clickButton, {'side': 'left', 'index': 2, 'game': this, 'btn': 'leftBtn2'}, 0, 0, 0);
  this.leftBtn3 = game.add.button(20+145/2, 730+145/2, 'button_yellow', this.clickButton, {'side': 'left', 'index': 4, 'game': this, 'btn': 'leftBtn3'}, 0, 0, 0);
  this.leftBtn1.anchor.setTo(0.5, 0.5);
  this.leftBtn2.anchor.setTo(0.5, 0.5);
  this.leftBtn3.anchor.setTo(0.5, 0.5);
  this.leftScore = game.add.bitmapText(20, 10, 'taticNum', game.leftScore + "", 64);

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
  this.rightBtn1 = game.add.button(1770-20+145/2, 230+145/2, 'button_blue', this.clickButton, {'side': 'right', 'index': 1, 'game': this, 'btn': 'rightBtn1'}, 0, 0, 0);
  this.rightBtn2 = game.add.button(1770-60+145/2, 480+145/2, 'button_red', this.clickButton, {'side': 'right', 'index': 2, 'game': this, 'btn': 'rightBtn2'}, 0, 0, 0);
  this.rightBtn3 = game.add.button(1770-20+145/2, 730+145/2, 'button_green', this.clickButton, {'side': 'right', 'index': 3, 'game': this, 'btn': 'rightBtn3'}, 0, 0, 0);
  this.rightBtn1.anchor.setTo(0.5, 0.5);
  this.rightBtn2.anchor.setTo(0.5, 0.5);
  this.rightBtn3.anchor.setTo(0.5, 0.5);
  this.rightScore = game.add.bitmapText(0, 10, 'taticNum', game.rightScore + "", 64);
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

  this.blackGraphics = game.add.graphics(WIDTH/2, HEIGHT/2);
  this.blackGraphics.anchor.setTo(0.5, 0.5);
  this.blackGraphics.lineStyle(5, 0x001221);
  this.blackGraphics.arc(0, 0, 700, 0, 2*Math.PI);
  this.blackGraphics.scale.setTo(2, 2);

  var startTween = game.add.tween(this.blackGraphics.scale).to({x: 1, y: 1}, 0, Phaser.Easing.Exponential.Out, true);

  // gameover
  var gameover = game.add.sprite(WIDTH/2, HEIGHT/2 - 100, 'gameover');
  gameover.anchor.setTo(0.5, 0.5);
  gameover.animations.add('shake');
  gameover.animations.play('shake', 3, true);
  this.totalScore = game.add.bitmapText(WIDTH/2, HEIGHT/2 + 100, 'taticNum', "", 64);
  this.totalScore.x = WIDTH/2 - this.totalScore.width/2;
  this.gameoverAll = game.add.sprite(0, 0);
  this.gameoverAll.addChild(gameover);
  this.gameoverAll.addChild(this.totalScore);
  this.gameoverAll.y = -1080;

  // 通关
  this.brain = game.add.sprite(435 + 1043/2, 1041/2 + 10, 'brain');
  this.brain.anchor.setTo(0.5, 0.5);
  this.brain.alpha = 0;

  // 粒子发射器
  this.bitmap = game.add.bitmapData(60, 60);
  game.cache.addBitmapData('flameParticle', this.bitmap);
  // 粒子发射器
  this.emitter = game.add.emitter(0, 0, 200);
  // 设置粒子，使用我们自定义的粒子
  this.emitter.particleClass = FlameParticle;
  this.emitter.makeParticles();
  // 设置属性
  this.emitter.setScale(0.1, 0.1, 0.1, 0.1, 200);
  this.emitter.setAlpha(1, 0.1, 1500);
  this.emitter.minParticleSpeed.setTo(-600, -600);
  this.emitter.maxParticleSpeed.setTo(600, 600);
  this.emitter.gravity = 0;

  // 按键
  this.keyQ = game.input.keyboard.addKey(Phaser.KeyCode.Q);
  this.keyA = game.input.keyboard.addKey(Phaser.KeyCode.A);
  this.keyZ = game.input.keyboard.addKey(Phaser.KeyCode.Z);
  
  this.keyO = game.input.keyboard.addKey(Phaser.KeyCode.O);
  this.keyK = game.input.keyboard.addKey(Phaser.KeyCode.K);
  this.keyM = game.input.keyboard.addKey(Phaser.KeyCode.M);

  this.keyQ.onDown.add(this.clickButton, {'side': 'left', 'index': 0, 'game': this, 'btn': 'leftBtn1'});
  this.keyA.onDown.add(this.clickButton, {'side': 'left', 'index': 2, 'game': this, 'btn': 'leftBtn2'});
  this.keyZ.onDown.add(this.clickButton, {'side': 'left', 'index': 4, 'game': this, 'btn': 'leftBtn3'});
  this.keyO.onDown.add(this.clickButton, {'side': 'right', 'index': 1, 'game': this, 'btn': 'rightBtn1'});
  this.keyK.onDown.add(this.clickButton, {'side': 'right', 'index': 2, 'game': this, 'btn': 'rightBtn2'});
  this.keyM.onDown.add(this.clickButton, {'side': 'right', 'index': 3, 'game': this, 'btn': 'rightBtn3'});

  // 按钮的圈
  this.buttonCircleGroup = game.add.group();
  this.buttonCircleGroup.createMultiple(12, 'button_circle');

  // 树的特效
  this.treeAnimLray = game.add.sprite(0, 0, 'tree-anim-lray');
  this.treeAnimLray.anchor.setTo(0.5);
  this.treeAnimLray.kill();
  this.treeAnimSray = game.add.sprite(0, 0, 'tree-anim-sray');
  this.treeAnimSray.anchor.setTo(0.5);
  this.treeAnimSray.kill();
  this.treeAnimCircle = game.add.sprite(0, 0, 'tree-anim-circle');
  this.treeAnimCircle.anchor.setTo(0.5);
  this.treeAnimCircle.kill();
  
  

  // mission组
  this.groups = {};
  this.groups["mission"] = game.add.group();

  // 关卡数据
  this.levelJSON = game.cache.getJSON('level1');

  // 关卡
  this.levelNum = 0;

  this.missions = [];
  this.curLine = 0;
  this.curLineCount = 0;
  this.itemCount = 0;
  this.LevelTime = 0;
  this.blood = TOTAL_BLOOD;
  this.timeCount = 0;

  this.graphics = game.add.graphics(WIDTH/2, HEIGHT/2);
  this.graphics.anchor.setTo(0.5, 0.5);

  this.dashGraphics = game.add.graphics(WIDTH/2, HEIGHT/2);
  this.dashGraphics.anchor.setTo(0.5, 0.5);

  

  this.whiteGraphics = game.add.graphics(WIDTH/2, HEIGHT/2);
  this.whiteGraphics.anchor.setTo(0.5, 0.5);

  this.leftPointer = game.add.sprite(0, 0, 'pointer');
  this.leftPointer.anchor.setTo(0.5, 0.5);
  this.leftPointer.alpha = 0;
  this.rightPointer = game.add.sprite(0, 0, 'pointer');
  this.rightPointer.anchor.setTo(0.5, 0.5);
  this.rightPointer.scale.x = -1;
  this.rightPointer.alpha = 0;

  this.setBlood(this.blood);

  this.tree = game.add.sprite(435 + 1043/2, 1041/2 + 20, 'tree1');
  this.tree.anchor.setTo(0.5, 0.5);
  this.tree.frame = 0;
  this.tree.alpha = 0;
  this.lastTree = game.add.sprite(435 + 1043/2, 1041/2 + 20, 'tree1');
  this.lastTree.anchor.setTo(0.5, 0.5);
  this.lastTree.frame = 0;
  this.lastTree.alpha = 0;

  startTween.onComplete.add(function() {
    this.loadLevel(this.levelNum);
  }, this);

};

Tatic.StartState.prototype.emit = function(index, sprite, quantity) {
  // 粒子效果
  var emitColor = emitterMap[index];
  this.generateFlame(this.bitmap, emitColor);
  // 粒子发射器
  // 5是树的粒子
  if(index != 5) {
    this.emitter.x = sprite.x + sprite.width/2 - 15;
    this.emitter.y = sprite.y + sprite.height/2;
  } else {
    this.emitter.x = sprite.x + 15;
    this.emitter.y = sprite.y;
  }
  // 发射
  this.emitter.start(true, 4000, null, quantity);
}

Tatic.StartState.prototype.generateFlame = function(bitmap, color) {
  var len = 10;
  bitmap.context.clearRect(0, 0, 2*len, 2*len);
  var radgrad = bitmap.ctx.createRadialGradient(len, len, 4, len, len, len);
  color = Phaser.Color.getRGB(color);
  radgrad.addColorStop(0, Phaser.Color.getWebRGB(color));
  color.a = 0;
  radgrad.addColorStop(1, Phaser.Color.getWebRGB(color));
  bitmap.context.fillStyle = radgrad;
  bitmap.context.fillRect(0, 0, 2*len, 2*len);
};

Tatic.StartState.prototype.clickButton = function() {
  if(this.game.gOver || !this.game.canButton) {
    return;
  }
  var clickIndex = this.index;
  var clickSide = this.side;
  var missions = this.game.missions;
  var curLine = this.game.curLine;
  var btn = this.game[this.btn];

  var buttonCircle = this.game.buttonCircleGroup.getFirstExists(false);
  if(buttonCircle) {
    buttonCircle.alpha = 1;
    buttonCircle.scale.setTo(1);
    buttonCircle.anchor.setTo(0.5);
    buttonCircle.reset(btn.x, btn.y);
    game.add.tween(buttonCircle).to({alpha: 0}, 600, "Linear", true, 0, 0);
    var tween = game.add.tween(buttonCircle.scale).to({x: 3.5, y: 3.5}, 600, "Linear", true, 0, 0);
    tween.onComplete.add(function() {
      buttonCircle.kill();
    }, this);
  }

  var tween = game.add.tween(btn.scale).to({x: 1.5, y: 1.5}, 50, "Linear", true, 0, 0, true);
  tween.onComplete.add(function() {
    btn.scale.setTo(1);
  }, this);
  var correct = false;
  if(!missions[curLine]){return;}
  for(var i=0; i<missions[curLine].length; i++) {
    if(!missions[curLine][i].sprite.isDone && missions[curLine][i].index == clickIndex) {
      missions[curLine][i].sprite.done();
      correct = true;
      this.game.soundRight.play();
      this.game.curLineCount++;
      if(this.game.curLineCount === missions[curLine].length) {
        this.game.curLineCount = 0;
        this.game.curLine++;
        this.game.calcPointer(this.game.curLine);
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
    this.game.setBlood(this.game.blood);
    this.game.updateScore(clickSide, -10);
    this.game.soundError.play();
    if(clickSide == "left") {
      var tween = game.add.tween(this.game.leftError).to({alpha: 1}, 100, "Linear", true, 0, 0, true);
      tween.onComplete.add(function() {
        this.game.leftError.alpha = 0;
      }, this);
    } else {
      var tween = game.add.tween(this.game.rightError).to({alpha: 1}, 100, "Linear", true, 0, 0, true);
      tween.onComplete.add(function() {
        this.game.rightError.alpha = 0;
      }, this);
    }
  }
}

Tatic.StartState.prototype.calcPointer = function(curLine) {
  if(!this.missions[curLine]) return;
  var len = this.missions[curLine].length;
  var totalWidth = len * 85;
  var leftX = WIDTH / 2 - totalWidth / 2 - 80;
  var rightX = WIDTH / 2 - totalWidth / 2 + 85/2 + len * 85 + 35;
  var y = 190 + curLine * 85;
  this.leftPointer.reset(leftX, y);
  this.rightPointer.reset(rightX, y);
}

var g_getColor_RGB = [160,207,48];
Tatic.StartState.prototype.getColor = function(sec) {
  //当前绿色160，207，048 黄 238，191，006 红 249，098，031
  function to16(csint){
    var txt = csint.toString(16);
    if(txt.length==1){return "0"+txt}
    return txt;
  }
  var r,g,b;
  if(sec <= 0){
    g_getColor_RGB = [160,207,48];
  }else if(sec < TOTAL_BLOOD/2){
      g_getColor_RGB[0]+=parseInt(70*sec/TOTAL_BLOOD);
  }else if(sec > parseInt(TOTAL_BLOOD/2)){
      g_getColor_RGB[1]-=parseInt(50*sec/TOTAL_BLOOD);

  }
  if(g_getColor_RGB[0]>255){g_getColor_RGB[0]=255}
  if(g_getColor_RGB[1]>255){g_getColor_RGB[1]=255}
  if(g_getColor_RGB[2]>255){g_getColor_RGB[2]=255}
  if(g_getColor_RGB[0]<0){g_getColor_RGB[0]=0}
  if(g_getColor_RGB[1]<0){g_getColor_RGB[1]=0}
  if(g_getColor_RGB[2]<0){g_getColor_RGB[2]=0}

  return "0x"+to16(g_getColor_RGB[0])+to16(g_getColor_RGB[1])+to16(g_getColor_RGB[2]);
}

Tatic.StartState.prototype.setTime = function(sec) {

  this.dashGraphics.clear();
  this.dashGraphics.lineStyle(3, 0x37AFB7);
  for(var i=0; i<36; i++) {
    this.dashGraphics.arc(0, 0, 460, i*2*Math.PI/36 + Math.PI/72, (i+1)*2*Math.PI/36);
  }

  this.whiteGraphics.clear();
  this.whiteGraphics.lineStyle(3, 0xFFFFFF);
  this.whiteGraphics.arc(0, 0, 460, -Math.PI/2 + sec * Math.PI/this.LevelTime, Math.PI/2);
  this.whiteGraphics.arc(0, 0, 460, Math.PI/2, Math.PI*3/2 - sec * Math.PI/this.LevelTime);

}

Tatic.StartState.prototype.setBlood = function(blood) {
  blood = TOTAL_BLOOD - blood;
  this.graphics.clear();
  this.graphics.lineStyle(8, this.getColor(blood));
  this.graphics.arc(0, 0, 490, -Math.PI/2 + blood * Math.PI/TOTAL_BLOOD, Math.PI/2);
  this.graphics.arc(0, 0, 490, Math.PI/2, Math.PI*3/2 - blood * Math.PI/TOTAL_BLOOD);
  if(blood >= TOTAL_BLOOD) {
    this.gOver = true;
    this.gameOver();
  }
}

Tatic.StartState.prototype.loadLevel = function(level) {

  var curLevelArr = this.levelJSON[level];
  this.missions.splice(0, this.missions.length);

  this.wrapSprite = game.add.sprite(0, -400);

  // 解析关卡数据
  for(var i=0; i<curLevelArr.length; i++) {
    var line = curLevelArr[i];
    var totalWidth = line.length * 85;
    var missionLine = [];
    this.itemCount += line.length;
    for(var j=0; j<line.length; j++) {
      var item = line[j];
      var position = {
        x: WIDTH / 2 - totalWidth / 2 + 85/2 + j * 85,
        y: 190 + i * 85
      }
      if(item.length == 1) {
        var mission = new Tatic.Mission(this, position, MissionMap[item[0]], 'mission', {
          index: item[0]
        });
        this.wrapSprite.addChild(mission);
        var missionObj = {
          index: item[0],
          sprite: mission
        }
        missionLine.push(missionObj);
      }
    }
    this.missions.push(missionLine);
  }

  this.calcPointer(this.curLine);

  this.LevelTime = Math.round(this.itemCount * LEVEL_TIME_RATIO);

  this.soundStartLevel.play();

  var spriteTween = game.add.tween(this.wrapSprite).to( { y: 0 }, 500, Phaser.Easing.Bounce.Out, true);
  spriteTween.onComplete.add(function() {

    this.leftPointer.alpha = 1;
    this.rightPointer.alpha = 1;

    this.canButton = true;

    this.timeCount = 0;
    this.timer = game.time.events.loop(Phaser.Timer.SECOND * 0.1 / TIME_RATIO, function() {
      if(this.timeCount < this.LevelTime) {
        this.timeCount++;
        this.setTime(this.timeCount);
      } else if(this.blood > 0) {
        this.blood--;
        this.setBlood(this.blood);
      } else {
        game.time.events.remove(this.timer);
      }
    }, this);

  }, this);

}

Tatic.StartState.prototype.nextLevel = function() {
  var goNext = function() {
    this.curLine = 0;
    this.itemCount = 0;

    this.loadLevel(this.levelNum);
  }

  var treeAnim = function() {
    this.emit(5, this.tree, 1000);
    this.treeAnimCircle.reset(this.tree.x, this.tree.y);
    this.treeAnimCircle.alpha = 0.7;
    this.treeAnimCircle.scale.setTo(1);
    this.treeAnimLray.reset(this.tree.x, this.tree.y);
    this.treeAnimLray.alpha = 0.7;
    this.treeAnimLray.scale.setTo(1);
    this.treeAnimSray.reset(this.tree.x, this.tree.y);
    this.treeAnimSray.alpha = 0.7;
    this.treeAnimSray.scale.setTo(1);

    var treeAninTime = 800;
    var treeAnimSize = 10;

    game.add.tween(this.treeAnimCircle).to( { alpha: 0 }, treeAninTime, Phaser.Easing.Linear.None, true);
    var tweenAnimCircle = game.add.tween(this.treeAnimCircle.scale).to( { x: treeAnimSize * 1.3, y: treeAnimSize * 1.3 }, treeAninTime, Phaser.Easing.Linear.None, true);
    tweenAnimCircle.onComplete.add(function() {
      this.treeAnimCircle.kill();
    }, this);

    game.add.tween(this.treeAnimLray).to( { angle: 180 }, treeAninTime, Phaser.Easing.Linear.None, true);
    game.add.tween(this.treeAnimLray).to( { alpha: 0 }, treeAninTime, Phaser.Easing.Linear.None, true);
    var tweenAnimLray = game.add.tween(this.treeAnimLray.scale).to( { x: treeAnimSize, y: treeAnimSize }, treeAninTime, Phaser.Easing.Linear.None, true);
    tweenAnimLray.onComplete.add(function() {
      this.treeAnimLray.kill();
    }, this);

    game.add.tween(this.treeAnimSray).to( { angle: -180 }, treeAninTime, Phaser.Easing.Linear.None, true);
    game.add.tween(this.treeAnimSray).to( { alpha: 0 }, treeAninTime, Phaser.Easing.Linear.None, true);
    var tweenAnimSray = game.add.tween(this.treeAnimSray.scale).to( { x: treeAnimSize, y: treeAnimSize }, treeAninTime, Phaser.Easing.Linear.None, true);
    tweenAnimSray.onComplete.add(function() {
      this.treeAnimSray.kill();
    }, this);

  }

  var tweenOut = function() {
    var tweenOut = game.add.tween(this.tree).to( { alpha: 0 }, 500, Phaser.Easing.Linear.None, true);
    tweenOut.onComplete.add(goNext, this);
  }

  var timeWait = function() {
    
    game.time.events.add(Phaser.Timer.SECOND * 1, tweenOut, this);
  }

  var tweenIn = function() {
    treeAnim.call(this);
    var tweenIn = game.add.tween(this.tree).to( { alpha: 1 }, 500, Phaser.Easing.Linear.None, true);
    tweenIn.onComplete.add(timeWait, this);
  }

  var tweenLastOut = function() {
    var tweenOut = game.add.tween(this.lastTree).to( { alpha: 0 }, 500, Phaser.Easing.Linear.None, true);
  }

  var tweenTimeWait = function() {
    game.time.events.add(Phaser.Timer.SECOND * 1, tweenLastOut, this);
  }

  var tweenLastIn = function() {
    var tweenIn = game.add.tween(this.lastTree).to( { alpha: 1 }, 500, Phaser.Easing.Linear.None, true);
    tweenIn.onComplete.add(timeWait, this);
  }

  var clearMissions = function() {
    for(var i=0; i<this.missions.length; i++) {
      for(var j=0; j<this.missions[i].length; j++) {
        this.missions[i][j].sprite.kill();
      }
    }
    this.leftPointer.alpha = 0;
    this.rightPointer.alpha = 0;
  }

  this.canButton = false;

  this.levelScore();

  clearMissions.call(this);
  this.tree.loadTexture('tree' + (this.levelNum+1));
  if(this.levelNum > 0) {
    this.lastTree.loadTexture('tree' + (this.levelNum));
  }
  //this.tree.frame = this.levelNum;
  //this.lastTree.frame = this.levelNum-1;
  this.levelNum++;
  if(this.levelNum < this.levelJSON.length) {
    this.soundNextLevel.play();
    if(this.levelNum == 1) {
      tweenIn.call(this);
    } else {
      this.lastTree.alpha = 1;
      tweenIn.call(this);
      tweenLastOut.call(this);
    }
  } else {
    // 通关
    this.tree.alpha = 1;
    this.gOver = true;
    this.through();
  }
}

Tatic.StartState.prototype.levelScore = function() {
  this.updateScore('left', (this.itemCount + this.LevelTime - this.timeCount) * 10);
  this.updateScore('right', (this.itemCount + this.LevelTime - this.timeCount) * 10);
}

Tatic.StartState.prototype.updateScore = function(side, score) {
  if(side == "left") {
    game.leftScore += score;
    if(game.leftScore < 0) {
      game.leftScore = 0;
    }
    this.leftScore.text = game.leftScore + "";
  } else {
    game.rightScore += score;
    if(game.rightScore < 0) {
      game.rightScore = 0;
    }
    this.rightScore.text = game.rightScore + "";
    this.rightScore.x = 1920 - this.rightScore.width - 20;
  }
}

Tatic.StartState.prototype.allLeft = function(callback) {
  this.graphics.kill();
  this.whiteGraphics.kill();
  this.wrapSprite.kill();
  this.dashGraphics.kill();
  this.leftPointer.kill();
  this.rightPointer.kill();
  game.add.tween(this.leftPart).to({x: -300}, 0, Phaser.Easing.Exponential.Out, true);
  game.add.tween(this.rightPart).to({x: 300}, 0, Phaser.Easing.Exponential.Out, true);
  var overTween = game.add.tween(this.blackGraphics.scale).to({x: 2, y: 2}, 500, Phaser.Easing.Exponential.Out, true);
  overTween.onComplete.add(callback, this);
}

Tatic.StartState.prototype.gameOver = function() {
  this.soundGameOver.play();
  this.totalScore.text = (game.leftScore + game.rightScore) + "";
  this.totalScore.x = WIDTH/2 - this.totalScore.width/2;
  game.add.tween(this.circleMask.scale).to({x: 0, y: 0}, 500, Phaser.Easing.Exponential.In, true);
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

Tatic.StartState.prototype.through = function() {
  this.soundWin.play();
  this.whiteGraphics.kill();
  this.graphics.kill();
  this.allLeft(function() {
    game.time.events.add(Phaser.Timer.SECOND * 0.5, function() {
      game.add.tween(this.circleMask.scale).to({x: 9, y: 9}, 1000, Phaser.Easing.Exponential.In, true);
      var brainTween = game.add.tween(this.brain).to({alpha: 1}, 1000, Phaser.Easing.Exponential.In, true);
      brainTween.onComplete.add(function() {
        game.add.tween(this.circleMask.scale).to({x: 4, y: 4}, 1500, Phaser.Easing.Exponential.In, true);
        game.add.tween(this.brain.scale).to({x: 0.5, y: 0.5}, 1500, Phaser.Easing.Exponential.In, true);
        game.add.tween(this.tree).to({alpha: 0}, 1500, Phaser.Easing.Exponential.In, true);
        var scoreTween = game.add.tween(this.tree.scale).to({x: 0.5, y: 0.5}, 1500, Phaser.Easing.Exponential.In, true);
        scoreTween.onComplete.add(function() {
          var totalSc = game.add.bitmapText(20, 10, 'taticNum', (game.leftScore + game.rightScore) + "", 64);
          totalSc.x = WIDTH / 2 - totalSc.width / 2;
          totalSc.y = 100;
          if(!game.menuSoundPlay) {
            game.soundMenu.play();
            game.menuSoundPlay = true;
          }
          // game.time.events.add(Phaser.Timer.SECOND, function() {
          //   game.state.start('WinState');
          // });
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

Tatic.StartState.prototype.update = function() {
  
}
