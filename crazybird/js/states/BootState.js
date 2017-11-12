
var Phaser = Phaser || {};
var CrazyBird = CrazyBird || {};

CrazyBird.BootState = function () {
  "use strict";
  CrazyBird.BaseState.call(this);
};

Phaser.World.prototype.displayObjectUpdateTransform = function() {
  if(!game.scale.correct) {
    this.x = game.camera.y + game.width;
    this.y = -game.camera.x;
    this.rotation = Phaser.Math.degToRad(Phaser.Math.wrapAngle(90));
  } else {
    this.x = -game.camera.x;
    this.y = -game.camera.y;
    this.rotation = 0;
  }

  PIXI.DisplayObject.prototype.updateTransform.call(this);
}

CrazyBird.BootState.prototype = Object.create(CrazyBird.BaseState.prototype);
CrazyBird.BootState.prototype.constructor = CrazyBird.BootState;

CrazyBird.BootState.prototype.preload = function () {
  "use strict";
  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.load.image("background", "assets/background.jpg");
  if(game.scale.isLandscape) {
    game.scale.correct = true;
    game.scale.setGameSize(WIDTH, HEIGHT);
  } else {
    game.scale.correct = false;
    game.scale.setGameSize(HEIGHT, WIDTH);
  }
};

CrazyBird.BootState.prototype.create = function () {
  "use strict";
  game.scale.onOrientationChange.add(function() {
    if(game.scale.isLandscape) {
      game.scale.correct = true;
      game.scale.setGameSize(WIDTH, HEIGHT);
    } else {
      game.scale.correct = false;
      game.scale.setGameSize(HEIGHT, WIDTH);
    }
  }, this)

  game.state.start('PreloadState');
};
