
var Phaser = Phaser || {};
var Tatic = Tatic || {};
/*
var WIDTH = 1920;
var HEIGHT = 1080;

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
*/
Tatic.BaseState = function () {
  "use strict";
  Phaser.State.call(this);
};

Tatic.BaseState.prototype = Object.create(Phaser.State.prototype);
Tatic.BaseState.prototype.constructor = Tatic.BaseState;
/*
Tatic.BaseState.prototype.autoScreen = function() {
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
}*/
