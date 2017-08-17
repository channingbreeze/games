var Phaser = Phaser || {};
var CrazyBird = CrazyBird || {};

CrazyBird.CircleButton = function(gameState, position, texture, callback, context, group, properties) {
  "use strict";
  Phaser.Button.call(this, gameState.game, position.x, position.y, texture, this.clicked, this, 0, 0, 0);
  
  this.gameState = gameState;
  this.callback = callback;
  this.context = context;
  if(group) {
    this.gameState.groups[group].add(this);
  }

  this.anchor.setTo(0.5, 0.5);
  this.fixedToCamera = true;

  var key = game.input.keyboard.addKey(properties.keyCode);
  key.onDown.add(this.clicked, this);
};

CrazyBird.CircleButton.prototype = Object.create(Phaser.Button.prototype);
CrazyBird.CircleButton.prototype.constructor = CrazyBird.CircleButton;

CrazyBird.CircleButton.prototype.update = function () {
  "use strict";
}

CrazyBird.CircleButton.prototype.big = function() {
  
}

CrazyBird.CircleButton.prototype.circle = function() {
  
}

CrazyBird.CircleButton.prototype.clicked = function() {
  this.callback.call(this.context);
}

