
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

};

AttackOnBall.PreloadState.prototype.create = function () {
  "use strict";
  
  game.state.start('GameState', true, false, 1);
};
