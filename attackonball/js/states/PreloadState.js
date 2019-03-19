
var Phaser = Phaser || {};
var AttackOnBall = AttackOnBall || {};

AttackOnBall.PreloadState = function () {
  "use strict";
  Phaser.State.call(this);
};

AttackOnBall.PreloadState.prototype = Object.create(Phaser.State.prototype);
AttackOnBall.PreloadState.prototype.constructor = AttackOnBall.PreloadState;

AttackOnBall.PreloadState.prototype.preload = function () {
  "use strict";
  game.plugins.add(Fabrique.Plugins.Spine);
  game.load.spine('stickman', 'assets/Stickman.json');
  game.load.image('bg', 'assets/Bg.png');
  game.load.image('blood', 'assets/Blood.png');
  game.load.image('colon', 'assets/Colon.png');
  game.load.image('dot', 'assets/Dot.png');
  game.load.image('effectHit', 'assets/EffectHit.png');
  game.load.image('empty', 'assets/Empty.png');
  game.load.image('gauge', 'assets/Gauge.png');
  game.load.image('gaugeHead', 'assets/GaugeHead.png');
  game.load.image('landWhite', 'assets/LandWhite.png');
  game.load.image('shadow', 'assets/Shadow.png');
  game.load.image('title', 'assets/Title.png');
  game.load.image('topSign', 'assets/TopSign.png');
  game.load.image('touchToPlay', 'assets/TouchToPlay.png');
  game.load.image('white4', 'assets/White4.png');
  game.load.image('wordBest', 'assets/WordBest.png');
  game.load.image('wordYour', 'assets/WordYour.png');
  game.load.bitmapFont('numberTime', 'assets/NumberTime.png', 'assets/NumberTime.xml');
  game.load.bitmapFont('numberScoreMain', 'assets/NumberScoreMain.png', 'assets/NumberScoreMain.xml');
  game.load.bitmapFont('numberScoreEnd', 'assets/NumberScoreEnd.png', 'assets/NumberScoreEnd.xml');
  for(var i=0; i<=1; i++) {
    game.load.image('buttonGamecenter' + i, 'assets/ButtonGamecenter' + i + '.png');
    game.load.image('buttonPlay' + i, 'assets/ButtonPlay' + i + '.png');
    game.load.image('buttonRate' + i, 'assets/ButtonRate' + i + '.png');
    game.load.image('buttonShare' + i, 'assets/ButtonShare' + i + '.png');
  }
  for(var i=1; i<=4; i++) {
    game.load.image('numberItem' + i, 'assets/NumberItem' + i + '.png');
  }
  for(var i=0; i<=4; i++) {
    game.load.image('ball' + i, 'assets/Ball' + i + '.png');
  }
  for(var i=0; i<=5; i++) {
    game.load.image('land' + i, 'assets/Land' + i + '.png');
  }
  for(var i=0; i<=7; i++) {
    game.load.image('deadParts' + i, 'assets/DeadParts' + i + '.png');
  }
  for(var i=0; i<=10; i++) {
    game.load.image('effectBlood' + i, 'assets/EffectBlood' + i + '.png');
  }

  // 界面提示
  var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
  var text = game.add.text(0, 0, "超好玩的游戏，请耐心等待加载(0%)", style);
  text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
  text.setTextBounds(0, 0, WIDTH, HEIGHT);

  game.load.onFileComplete.add(function(process) {
    text.text = "超好玩的游戏，请耐心等待加载(" + process + "%)";
  });

};

AttackOnBall.PreloadState.prototype.create = function () {
  "use strict";
  game.state.start('MenuState', true, false, 0);
};
