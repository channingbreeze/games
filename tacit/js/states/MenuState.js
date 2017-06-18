
var Phaser = Phaser || {};
var Tatic = Tatic || {};

Tatic.MenuState = function () {
  "use strict";
  Tatic.BaseState.call(this);
};

Tatic.MenuState.prototype = Object.create(Tatic.BaseState.prototype);
Tatic.MenuState.prototype.constructor = Tatic.MenuState;

Tatic.MenuState.prototype.create = function () {
  "use strict";
  //this.autoScreen();
  var background = this.game.add.tileSprite(0, 0, game.width, game.height, 'background');
  var mask = game.add.sprite(game.world.centerX, game.world.centerY, "mask");
  mask.anchor.setTo(0.5, 0.5);

  var menu_word = this.game.add.sprite(game.world.centerX, game.world.centerY + 200, 'menu_word');
  menu_word.anchor.setTo(0.5, 0.5);

  var theme = this.game.add.sprite(game.world.centerX, game.world.centerY - 200, 'theme');
  theme.anchor.setTo(0.5, 0.5);
  theme.animations.add('shake');
  theme.animations.play('shake', 3, true);

  this.LogoText = game.add.text(game.world.centerX, game.height * 0.88, "Touch Screen", {
      fontSize: "48px",
      fill: "#ffffff",
      fontWeight: '100'
  });
  this.LogoText.anchor.setTo(0.5, 0.5);
  this.LogoText.alpha = 0.5;

  this.spriteAll = game.add.sprite(0, 0);
  this.spriteAll.addChild(menu_word);
  this.spriteAll.addChild(theme);
  this.spriteAll.addChild(this.LogoText);
  this.spriteAll.y = -1080;
  var allTween = game.add.tween(this.spriteAll).to({y: 0}, 0, Phaser.Easing.Exponential.Out, true);
  allTween.onComplete.add(function() {
    var tween = game.add.tween(this.LogoText).to({alpha: 1}, 500, "Linear", true, 0, -1);
    tween.yoyo(true, 500);
    game.input.onTap.add(this.onTap, this);
  }, this);

  if(!game.soundMenu) {
    game.soundMenu = game.add.audio("sound-menu", 1, true);
  }

  if(!game.menuSoundPlay) {
    game.soundMenu.play();
    game.menuSoundPlay = true;
  }

  this.space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  this.space.onDown.add(this.onTap, this);
};

Tatic.MenuState.prototype.onTap = function() {
  var allTween = game.add.tween(this.spriteAll).to({y: -1080}, 0, Phaser.Easing.Exponential.Out, true);
  allTween.onComplete.add(function() {
    game.soundMenu.mute = false;
    game.soundMenu.stop();
    game.menuSoundPlay = false;
    game.state.start("StartState");
  }, this);
}
