
var Phaser = Phaser || {};
var AttackOnBall = AttackOnBall || {};

AttackOnBall.MenuState = function () {
  "use strict";
  Phaser.State.call(this);
};

AttackOnBall.MenuState.prototype = Object.create(Phaser.State.prototype);
AttackOnBall.MenuState.prototype.constructor = AttackOnBall.MenuState;

AttackOnBall.MenuState.prototype.preload = function () {
  "use strict";
  
};

AttackOnBall.MenuState.prototype.create = function () {
  "use strict";

  // 背景
  var bg = game.add.image(0, 0, 'bg');

  // 地
  var landIndex = game.rnd.integerInRange(0, 5);
  var land = game.add.image(0, HEIGHT - 204, 'land' + landIndex);
  
  // 提示
  var touchToPlay = game.add.image(WIDTH / 2, HEIGHT - 404, 'touchToPlay');
  touchToPlay.anchor.setTo(0.5, 0.5);
  game.add.tween(touchToPlay).to({alpha: 0}, 500, "Linear", true, 0, -1, true);

  // 标题
  var title = game.add.image(-400, 104, 'title');
  title.anchor.setTo(0.5, 0.5);
  game.add.tween(title).to({x: WIDTH / 2}, 500, Phaser.Easing.Bounce.Out, true);

  // 最高分
  var style = { font: "70px Arial", fill: "#ff0044", align: "center" };
  var text = game.add.text(200, 10, "39.40", style);
  text.anchor.set(0.5);
  game.time.events.loop(Phaser.Timer.SECOND * 0.1, this.updateScoreColor, text);

  var textBest = game.add.sprite(0, 0, 'wordBest');
  textBest.anchor.set(0.5);
  textBest.scale.setTo(1.3, 1.3);
  textBest.tint = 0xFF0A63;
  var textColon = game.add.sprite(100, 10, 'colon');
  textColon.anchor.set(0.5);
  textColon.tint = 0xFF0A63;

  var bestText = game.add.sprite(WIDTH / 2 - 100, HEIGHT / 2 - 100);
  bestText.addChild(textBest);
  bestText.addChild(textColon);
  bestText.addChild(text);

  // 左边按钮
  this.buttonGamecenter = game.add.sprite(120, HEIGHT + 304, 'buttonGamecenter0');
  this.buttonGamecenter.anchor.setTo(0.5, 0.5);
  this.buttonGamecenter.inputEnabled = true;
  this.buttonGamecenter.events.onInputDown.add(this.buttonDown, this);
  this.buttonGamecenter.events.onInputUp.add(this.buttonUp, this);
  game.add.tween(this.buttonGamecenter).to({y: HEIGHT - 304}, 500, Phaser.Easing.Bounce.Out, true);

  // 右边按钮
  this.buttonShare = game.add.image(WIDTH - 120, HEIGHT + 304, 'buttonShare0');
  this.buttonShare.anchor.setTo(0.5, 0.5);
  this.buttonShare.inputEnabled = true;
  this.buttonShare.events.onInputDown.add(this.buttonDown, this);
  this.buttonShare.events.onInputUp.add(this.buttonUp, this);
  game.add.tween(this.buttonShare).to({y: HEIGHT - 304}, 500, Phaser.Easing.Bounce.Out, true);

  // 小人 spine
  var stickman = game.add.spine(WIDTH / 2, HEIGHT - 204 + 20, 'stickman');
  stickman.scale.setTo(1.5, 1.5);

  stickman.setAnimationByName(0, 'Idle', true);

  game.input.onDown.add(this.tapStart, {
    title: title,
    text: bestText,
    buttonGamecenter: this.buttonGamecenter,
    buttonShare: this.buttonShare,
    landIndex: landIndex
  });

};

AttackOnBall.MenuState.prototype.buttonDown = function(button, point) {
  var len = button.key.length;
  var mainKey = button.key.substring(0, len-1);
  button.loadTexture(mainKey + '1');
  button.animTween = game.add.tween(button.scale).to({x: 1.1, y: 1.1}, 100, "Linear", true);
}

AttackOnBall.MenuState.prototype.buttonUp = function(button, point) {
  var len = button.key.length;
  var mainKey = button.key.substring(0, len-1);
  button.animTween.stop();
  button.loadTexture(mainKey + '0');
  button.scale.setTo(1, 1);

  if(mainKey === "buttonGamecenter") {
    this.onGamecenter();
  } else if(mainKey === "buttonShare") {
    this.onShare();
  }
}

AttackOnBall.MenuState.prototype.tapStart = function(point) {
  
  var boundsGamecenter = this.buttonGamecenter.getBounds();
  var isInGamecenter = Phaser.Rectangle.containsPoint(boundsGamecenter, point);

  var boundsShare = this.buttonShare.getBounds();
  var isInShare = Phaser.Rectangle.containsPoint(boundsShare, point);

  if(isInGamecenter || isInShare) {
    return false;
  }

  var title = this.title;
  var text = this.text;
  var buttonGamecenter = this.buttonGamecenter;
  var buttonShare = this.buttonShare;
  var landIndex = this.landIndex;

  game.add.tween(title).to({x: -400}, 500, Phaser.Easing.Bounce.In, true);
  game.add.tween(this.buttonGamecenter).to({y: HEIGHT + 304}, 500, Phaser.Easing.Bounce.In, true);
  game.add.tween(this.buttonShare).to({y: HEIGHT + 304}, 500, Phaser.Easing.Bounce.In, true);

  var tween = game.add.tween(text).to({alpha: 0}, 500, "Linear", true);
  tween.onComplete.add(function() {
    game.state.start("GameState", true, false, landIndex);
  });
}

AttackOnBall.MenuState.prototype.updateScoreColor = function() {
  var index = game.rnd.integerInRange(0, scoreColors.length - 1);
  this.addColor(scoreColors[index], 0);
}

AttackOnBall.MenuState.prototype.onGamecenter = function() {
  console.log('onGamecenter');
}

AttackOnBall.MenuState.prototype.onShare = function() {
  console.log('onShare');
}



