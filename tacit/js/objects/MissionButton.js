
var Tacit = Tacit || {};

Tacit.MissionButton = function(gameState, position, texture, callback, context, group, properties) {
  "use strict";
  Phaser.Button.call(this, gameState.game, position.x, position.y, texture, this.clicked, this, 0, 0, 0);
  this.gameState = gameState;
  this.callback = callback;
  this.context = context;
  if(group) {
    this.gameState.groups[group].add(this);
  }
  this.anchor.setTo(0.5, 0.5);
  var key = game.input.keyboard.addKey(properties.keyCode);
  key.onDown.add(this.clicked, this);
};

Tacit.MissionButton.prototype = Object.create(Phaser.Button.prototype);
Tacit.MissionButton.prototype.constructor = Tacit.MissionButton;

Tacit.MissionButton.prototype.update = function () {
  "use strict";
}

Tacit.MissionButton.prototype.big = function() {
  var tween = game.add.tween(this.scale).to({x: 1.5, y: 1.5}, 50, "Linear", true, 0, 0, true);
  tween.onComplete.add(function() {
    this.scale.setTo(1);
  }, this);
}

Tacit.MissionButton.prototype.circle = function() {
  var buttonCircle = this.gameState.buttonCircleGroup.getFirstExists(false);
  if(buttonCircle) {
    buttonCircle.alpha = 1;
    buttonCircle.scale.setTo(1);
    buttonCircle.anchor.setTo(0.5);
    buttonCircle.reset(this.x, this.y);
    game.add.tween(buttonCircle).to({alpha: 0}, 600, "Linear", true, 0, 0);
    var tween = game.add.tween(buttonCircle.scale).to({x: 3.5, y: 3.5}, 600, "Linear", true, 0, 0);
    tween.onComplete.add(function() {
      buttonCircle.kill();
    }, this);
  }
}

Tacit.MissionButton.prototype.clicked = function() {
  if(this.gameState.gOver || !this.gameState.canButton) {
    return;
  }
  this.big();
  this.circle();
  this.callback.call(this.context);
}

