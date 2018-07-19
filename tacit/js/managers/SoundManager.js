
var Phaser = Phaser || {};
var Tacit = Tacit || {};

Tacit.SoundManager = function() {
  "use strict";
  Object.call(this);
  this.soundMenu = game.add.audio("sound-menu", 1, true);
  this.soundWin = game.add.audio("sound-win");
  this.soundRight = game.add.audio("sound-right");
  this.soundNextLevel = game.add.audio("sound-nextlevel");
  this.soundGameOver = game.add.audio("sound-gameover");
  this.soundError = game.add.audio("sound-error");
  this.soundStartLevel = game.add.audio("sound-startlevel");
};

Tacit.SoundManager.prototype = Object.create(Object.prototype);
Tacit.SoundManager.prototype.constructor = Tacit.SoundManager;

Tacit.SoundManager.prototype.playSound = function(key) {
  try {
    this[key].play();
  } catch (e) {}
}

Tacit.SoundManager.prototype.playSoundMenu = function() {
  if(!this.soundMenu.isPlaying) {
    this.soundMenu.play();
  }
}

Tacit.SoundManager.prototype.stopSoundMenu = function() {
  this.soundMenu.stop();
}

Tacit.SoundManager.prototype.playSoundWin = function() {
  this.playSound('soundWin');
}

Tacit.SoundManager.prototype.playSoundRight = function() {
  this.playSound('soundRight');
}

Tacit.SoundManager.prototype.playSoundNextLevel = function() {
  this.playSound('soundNextLevel');
}

Tacit.SoundManager.prototype.playSoundGameOver = function() {
  this.playSound('soundGameOver');
}

Tacit.SoundManager.prototype.playSoundError = function() {
  this.playSound('soundError');
}

Tacit.SoundManager.prototype.playSoundStartLevel = function() {
  this.playSound('soundStartLevel');
}
