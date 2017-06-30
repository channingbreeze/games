
var Phaser = Phaser || {};
var Tacit = Tacit || {};

Tacit.MenuState = function () {
  "use strict";
  Tacit.BaseState.call(this);
};

Tacit.MenuState.prototype = Object.create(Tacit.BaseState.prototype);
Tacit.MenuState.prototype.constructor = Tacit.MenuState;

Tacit.MenuState.prototype.create = function () {
  "use strict";
  var background = this.game.add.tileSprite(0, 0, WIDTH, HEIGHT, 'background');
  var mask = game.add.sprite(WIDTH/2, HEIGHT/2, "mask");
  mask.anchor.setTo(0.5, 0.5);

  var menuWord = this.game.add.sprite(WIDTH/2, HEIGHT/2 + 200, 'menu_word');
  menuWord.anchor.setTo(0.5, 0.5);

  var theme = this.game.add.sprite(WIDTH/2, HEIGHT/2 - 200, 'theme');
  theme.anchor.setTo(0.5, 0.5);
  theme.animations.add('shake');
  theme.animations.play('shake', 3, true);

  var logoText = game.add.text(WIDTH/2, HEIGHT * 0.88, "Touch Screen", {
      fontSize: "48px",
      fill: "#ffffff",
      fontWeight: '100'
  });
  logoText.anchor.setTo(0.5, 0.5);
  logoText.alpha = 0.5;

  game.soundManager.playSoundMenu();

  // 动画完毕之后添加事件
  this.spriteAll = game.add.sprite(0, 0);
  this.spriteAll.addChild(menuWord);
  this.spriteAll.addChild(theme);
  this.spriteAll.addChild(logoText);
  this.spriteAll.y = -1080;
  var allTween = game.add.tween(this.spriteAll).to({y: 0}, 0, Phaser.Easing.Exponential.Out, true);
  allTween.onComplete.add(function() {
    var tween = game.add.tween(logoText).to({alpha: 1}, 500, "Linear", true, 0, -1);
    tween.yoyo(true, 500);
    game.input.onTap.add(this.onNextState, this);
    var space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    space.onDown.add(this.onNextState, this);
  }, this);

};

Tacit.MenuState.prototype.onNextState = function() {
  var allTween = game.add.tween(this.spriteAll).to({y: -1080}, 0, Phaser.Easing.Exponential.Out, true);
  allTween.onComplete.add(function() {
    game.soundManager.stopSoundMenu();
    game.state.start("StartState");
  }, this);
}
