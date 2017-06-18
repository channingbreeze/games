
var Phaser = Phaser || {};
var Tatic = Tatic || {};

var WIDTH = 1920;
var HEIGHT = 1080;

Tatic.PreloadState = function () {
  "use strict";
  Tatic.BaseState.call(this);
};

Tatic.PreloadState.prototype = Object.create(Tatic.BaseState.prototype);
Tatic.PreloadState.prototype.constructor = Tatic.PreloadState;

Tatic.PreloadState.prototype.preload = function () {
  "use strict";
  game.stage.backgroundColor = "#ffffff";
  
  game.add.tileSprite(0, 0, WIDTH, HEIGHT, 'background');
  var preloadSprite = this.game.add.sprite(game.world.centerX, game.world.centerY, 'loading');
  preloadSprite.anchor.setTo(0.5, 0.5);
  var dian = this.game.add.sprite(game.world.centerX + 170, game.world.centerY - 230, 'dian');
  dian.anchor.setTo(0.5, 0.5);
  dian.animations.add('loading');
  dian.animations.play('loading', 3, true);
  var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
  var text = game.add.text(game.world.centerX - 30, game.world.centerY - 200, "0%", style);
  text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
  
  game.load.image('menu_word', 'assets/menu_word.png');
  game.load.image('brain', 'assets/brain.png');
  game.load.spritesheet('theme', 'assets/theme.png', 658, 200);
  game.load.image('mask', 'assets/mask.png');
  game.load.image('redError', 'assets/redError.png');
  game.load.image('dash', 'assets/dash.png');
  game.load.image('pointer', 'assets/pointer.png');
  game.load.image('circleMask', 'assets/circle_mask.png');
  game.load.bitmapFont('taticNum', 'assets/num.png', 'assets/num.xml');
  game.load.image('button_black', 'assets/button_black.png');
  game.load.image('button_blue', 'assets/button_blue.png');
  game.load.image('button_green', 'assets/button_green.png');
  game.load.image('button_red', 'assets/button_red.png');
  game.load.image('button_yellow', 'assets/button_yellow.png');
  game.load.image('button_circle', 'assets/button_circle.png');

  game.load.image('tree-anim-lray', 'assets/tree-anim-lray.png');
  game.load.image('tree-anim-sray', 'assets/tree-anim-sray.png');
  game.load.image('tree-anim-circle', 'assets/tree-anim-circle.png');

  game.load.spritesheet('missonicon_black', 'assets/icons/missonicon_black.png', 77, 76);
  game.load.spritesheet('missonicon_blue', 'assets/icons/missonicon_blue.png', 77, 76);
  game.load.spritesheet('missonicon_red', 'assets/icons/missonicon_red.png', 77, 76);
  game.load.spritesheet('missonicon_green', 'assets/icons/missonicon_green.png', 77, 76);
  game.load.spritesheet('missonicon_yellow', 'assets/icons/missonicon_yellow.png', 77, 76);

  //game.load.spritesheet('tree', 'assets/tree-sheet.png', 1043, 1041);
  for(var i=1; i<=12; i++) {
    game.load.image("tree" + i, "assets/tree/tree" + i + ".png");
  }
  game.load.spritesheet('gameover', 'assets/gameover.png', 743, 112);

  game.load.image("tree_left", "assets/tree_left.png");
  game.load.image("tree_right", "assets/tree_right.png");
  game.load.image("name", "assets/name.png");
  game.load.image("org", "assets/org.png");
  game.load.image("small_theme", "assets/small_theme.png");

  game.load.audio("sound-menu", ["assets/sound/menu.mp3", "assets/sound/menu.ogg", "assets/sound/menu.wav"]);
  game.load.audio("sound-win", ["assets/sound/win.wav"]);
  game.load.audio("sound-right", ["assets/sound/right.wav"]);
  game.load.audio("sound-nextlevel", ["assets/sound/nextlevel.wav"]);
  game.load.audio("sound-gameover", ["assets/sound/gameover.wav"]);
  game.load.audio("sound-error", ["assets/sound/error.mp3"], ["assets/sound/error.wav"]);
  game.load.audio("sound-startlevel", ["assets/sound/startlevel.wav"]);

  game.load.json('level1', 'js/levels/level1.json');

  game.load.onFileComplete.add(function(process) {
    text.text = process + "%";
  });
};

Tatic.PreloadState.prototype.create = function () {
  "use strict";
  //this.autoScreen();
  game.state.start('MenuState');
};
