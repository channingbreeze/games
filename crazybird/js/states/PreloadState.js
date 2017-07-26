
var Phaser = Phaser || {};
var CrazyBird = CrazyBird || {};

CrazyBird.PreloadState = function () {
  "use strict";
  CrazyBird.BaseState.call(this);
};

CrazyBird.PreloadState.prototype = Object.create(CrazyBird.BaseState.prototype);
CrazyBird.PreloadState.prototype.constructor = CrazyBird.PreloadState;

CrazyBird.PreloadState.prototype.preload = function () {
  "use strict";
  game.add.tileSprite(0, 0, WIDTH, HEIGHT, 'background');
  
  game.load.image('grass', 'assets/grass.png');
  game.load.image('cloud', 'assets/cloud.png');
  game.load.image('mountain', 'assets/mountain.png');
  game.load.image('tree', 'assets/tree.png');
  game.load.image('jump-button', 'assets/jump-button.png');
  game.load.image('run-button', 'assets/run-button.png');
  game.load.spritesheet('bird', 'assets/bird.png', 66, 71, 2);
  game.load.spritesheet('dirt', 'assets/dirt.png', 64, 23, 2);

  game.load.image('tiles', 'assets/map.png');
  game.load.tilemap('map', 'assets/map.json', null, Phaser.Tilemap.TILED_JSON);
};

CrazyBird.PreloadState.prototype.create = function () {
  "use strict";
  game.state.start('StartState');
};
