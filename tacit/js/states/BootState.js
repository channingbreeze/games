
var Phaser = Phaser || {};
var Tatic = Tatic || {};

Tatic.BootState = function () {
  "use strict";
  Tatic.BaseState.call(this);
};

Tatic.BootState.prototype = Object.create(Tatic.BaseState.prototype);
Tatic.BootState.prototype.constructor = Tatic.BootState;

Tatic.BootState.prototype.preload = function () {
  "use strict";
  game.load.image('loading', 'assets/loading.png');
  game.load.spritesheet('dian', 'assets/dian-sheet.png', 60, 12);
  game.load.image("background", "assets/background.png");
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
};

Tatic.BootState.prototype.create = function () {
  "use strict";
  //this.autoScreen();
  game.state.start('PreloadState');
};
