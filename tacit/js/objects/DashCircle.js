
var Tacit = Tacit || {};

Tacit.DashCircle = function(gameState, position, group, properties) {
  "use strict";
  Phaser.Graphics.call(this, gameState.game, position.x, position.y);
  this.gameState = gameState;
  if(group) {
    this.gameState.groups[group].add(this);
  }
  this.anchor.setTo(0.5, 0.5);
  this.lineStyle(3, 0x37AFB7);
};

Tacit.DashCircle.prototype = Object.create(Phaser.Graphics.prototype);
Tacit.DashCircle.prototype.constructor = Tacit.DashCircle;

Tacit.DashCircle.prototype.update = function () {
  "use strict";
}

Tacit.DashCircle.prototype.show = function(callback) {
  for(var i=0; i<36; i++) {
    this.arc(0, 0, 460, i*2*Math.PI/36 + Math.PI/72, (i+1)*2*Math.PI/36);
  }
}
