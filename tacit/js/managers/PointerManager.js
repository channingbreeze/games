
var Phaser = Phaser || {};
var Tacit = Tacit || {};

Tacit.PointerManager = function(gameState) {
  "use strict";
  Object.call(this);
  this.gameState = gameState;
  
  this.leftPointer = new Tacit.Pointer(this.gameState, {x: 0, y: 0}, 'pointer', 'pointer', {dir: -1});
  this.rightPointer = new Tacit.Pointer(this.gameState, {x: 0, y: 0}, 'pointer', 'pointer', {dir: 1});
};

Tacit.PointerManager.prototype = Object.create(Object.prototype);
Tacit.PointerManager.prototype.constructor = Tacit.PointerManager;

Tacit.PointerManager.prototype.posPointer = function(curLine) {
  if(!this.gameState.missions[curLine]) return;
  var len = this.gameState.missions[curLine].length;
  var totalWidth = len * 85;
  var leftX = WIDTH / 2 - totalWidth / 2 - 80;
  var rightX = WIDTH / 2 - totalWidth / 2 + 85/2 + len * 85 + 35;
  var y = 190 + curLine * 85;
  this.leftPointer.reset(leftX, y);
  this.rightPointer.reset(rightX, y);
}

Tacit.PointerManager.prototype.killPointer = function() {
  this.leftPointer.kill();
  this.rightPointer.kill();
}

Tacit.PointerManager.prototype.showPointer = function() {
  this.leftPointer.alpha = 1;
  this.rightPointer.alpha = 1;
}

Tacit.PointerManager.prototype.hidePointer = function() {
  this.leftPointer.alpha = 0;
  this.rightPointer.alpha = 0;
}
