
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
  var text = game.add.text(WIDTH / 2, HEIGHT / 2 - 100, "best : 39.40", style);
  text.anchor.set(0.5);
  game.time.events.loop(Phaser.Timer.SECOND * 0.1, this.updateScoreColor, text);

  // 左边按钮
  var buttonGamecenter = game.add.sprite(120, HEIGHT + 304, 'buttonGamecenter0');
  buttonGamecenter.anchor.setTo(0.5, 0.5);
  buttonGamecenter.inputEnabled = true;
  buttonGamecenter.events.onInputDown.add(this.buttonDown, this);
  buttonGamecenter.events.onInputUp.add(this.buttonUp, this);
  game.add.tween(buttonGamecenter).to({y: HEIGHT - 304}, 500, Phaser.Easing.Bounce.Out, true);

  // 右边按钮
  var buttonShare = game.add.image(WIDTH - 120, HEIGHT + 304, 'buttonShare0');
  buttonShare.anchor.setTo(0.5, 0.5);
  buttonShare.inputEnabled = true;
  buttonShare.events.onInputDown.add(this.buttonDown, this);
  buttonShare.events.onInputUp.add(this.buttonUp, this);
  game.add.tween(buttonShare).to({y: HEIGHT - 304}, 500, Phaser.Easing.Bounce.Out, true);

  // 小人 spine
  var stickman = game.add.spine(WIDTH / 2, HEIGHT - 204 + 20, 'stickman');
  stickman.scale.setTo(1.5, 1.5);

  stickman.setAnimationByName(0, 'Idle', true);

  game.input.onDown.add(this.tapStart, {
    title: title,
    text: text,
    buttonGamecenter: buttonGamecenter,
    buttonShare: buttonShare,
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

AttackOnBall.MenuState.prototype.tapStart = function() {
  var title = this.title;
  var text = this.text;
  var buttonGamecenter = this.buttonGamecenter;
  var buttonShare = this.buttonShare;
  var landIndex = this.landIndex;

  game.add.tween(title).to({x: -400}, 500, Phaser.Easing.Bounce.In, true);
  game.add.tween(buttonGamecenter).to({y: HEIGHT + 304}, 500, Phaser.Easing.Bounce.In, true);
  game.add.tween(buttonShare).to({y: HEIGHT + 304}, 500, Phaser.Easing.Bounce.In, true);

  var tween = game.add.tween(text).to({alpha: 0}, 500, "Linear", true);
  tween.onComplete.add(function() {
    game.state.start("GameState", true, false, landIndex);
  });
}

AttackOnBall.MenuState.prototype.updateScoreColor = function() {
  var index = game.rnd.integerInRange(0, scoreColors.length - 1);
  this.addColor(scoreColors[index], 6);
}

AttackOnBall.MenuState.prototype.onGamecenter = function() {
  console.log('onGamecenter');
}

AttackOnBall.MenuState.prototype.onShare = function() {
  console.log('onShare');
}



