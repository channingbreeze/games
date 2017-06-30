
var Tacit = Tacit || {};

Tacit.BloodCircle = function(gameState, position, group, properties) {
  "use strict";
  Phaser.Graphics.call(this, gameState.game, position.x, position.y);
  this.gameState = gameState;
  if(group) {
    this.gameState.groups[group].add(this);
  }
  this.anchor.setTo(0.5, 0.5);
};

Tacit.BloodCircle.prototype = Object.create(Phaser.Graphics.prototype);
Tacit.BloodCircle.prototype.constructor = Tacit.BloodCircle;

Tacit.BloodCircle.prototype.update = function () {
  "use strict";
}

Tacit.BloodCircle.prototype.getColor = function(sec) {
  var green = 0xA0CF30, yellow = 0xEEBF06, red = 0xF92672;
  var den = TOTAL_BLOOD/2;
  if(sec < den) {
    var r = (green >> 16) + ((yellow >> 16) - (green >> 16)) * sec / den;
    var g = ((green >> 8) & 255) + (((yellow >> 8) & 255) - ((green >> 8) & 255)) * sec / den;
    var b = (green & 255) + ((yellow & 255) - (green & 255)) * sec / den;
  } else {
    var r = (yellow >> 16) + ((red >> 16) - (yellow >> 16)) * (sec - den) / den;
    var g = ((yellow >> 8) & 255) + (((red >> 8) & 255) - ((yellow >> 8) & 255)) * (sec - den) / den;
    var b = (yellow & 255) + ((red & 255) - (yellow & 255)) * (sec - den) / den;
  }
  return (Math.round(r) << 16) + (Math.round(g) << 8) + Math.round(b);
}

Tacit.BloodCircle.prototype.setBlood = function(blood) {
  blood = TOTAL_BLOOD - blood;
  this.clear();
  this.lineStyle(8, this.getColor(blood));
  this.arc(0, 0, 490, -Math.PI/2 + blood * Math.PI/TOTAL_BLOOD, Math.PI/2);
  this.arc(0, 0, 490, Math.PI/2, Math.PI*3/2 - blood * Math.PI/TOTAL_BLOOD);
}

