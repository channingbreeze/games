
var Phaser = Phaser || {};
var Tacit = Tacit || {};

Tacit.BootState = function () {
  "use strict";
  Tacit.BaseState.call(this);
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

Tacit.BootState.prototype = Object.create(Tacit.BaseState.prototype);
Tacit.BootState.prototype.constructor = Tacit.BootState;

Tacit.BootState.prototype.preload = function () {
  "use strict";
  game.load.image('loading', 'assets/loading.png');
  game.load.spritesheet('dian', 'assets/dian-sheet.png', 60, 12);
  game.load.image("background", "assets/background.png");
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
};

Tacit.BootState.prototype.create = function () {
  "use strict";
  game.scale.forceOrientation(true, false);
  if(game.scale.isLandscape) {
    game.scale.correct = true;
    game.scale.setGameSize(WIDTH, HEIGHT);
  } else {
    game.scale.correct = false;
    game.scale.setGameSize(HEIGHT, WIDTH);
  }
  game.scale.onOrientationChange.add(function(scale, orientation, rightOrientation) {
    if(rightOrientation) {
      game.scale.correct = true;
      game.scale.setGameSize(WIDTH, HEIGHT);
    } else {
      game.scale.correct = false;
      game.scale.setGameSize(HEIGHT, WIDTH);
    }
  }, this)
  game.state.start('PreloadState');
};
