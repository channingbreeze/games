
var Phaser = Phaser || {};
var AttackOnBall = AttackOnBall || {};

AttackOnBall.BootState = function () {
  "use strict";
  Phaser.State.call(this);
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

AttackOnBall.BootState.prototype = Object.create(Phaser.State.prototype);
AttackOnBall.BootState.prototype.constructor = AttackOnBall.BootState;

AttackOnBall.BootState.prototype.preload = function () {
  "use strict";
  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  if(game.scale.isLandscape) {
    game.scale.correct = true;
    game.scale.setGameSize(WIDTH, HEIGHT);
  } else {
    game.scale.correct = false;
    game.scale.setGameSize(HEIGHT, WIDTH);
  }
};

AttackOnBall.BootState.prototype.create = function () {
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
