
var GameTank = GameTank || {};

GameTank.Bouns = function(gameState, position, texture, group, properties) {
  "use strict";
  GameTank.Prefab.call(this, gameState, position, texture, group, properties);

  this.rebirth(position, properties);
};

GameTank.Bouns.prototype = Object.create(GameTank.Prefab.prototype);
GameTank.Bouns.prototype.constructor = GameTank.Bouns;

GameTank.Bouns.prototype.update = function () {
  "use strict";
};

GameTank.Bouns.prototype.rebirth = function (position, properties) {
  this.reset(position.x, position.y);
  this.properties = properties;
  this.frame = this.properties.type;
  this.twinkleCount = 0;
  this.alpha = 1;
  this.showTimer = this.gameState.game.time.events.add(Phaser.Timer.SECOND * 4, this.startTwinkle, this);
}

GameTank.Bouns.prototype.disappear = function() {
  if(this.showTimer) {
    game.time.events.remove(this.showTimer);
    this.showTimer = null;
  }
  if(this.twinkleTimer) {
    game.time.events.remove(this.twinkleTimer);
    this.twinkleTimer = null;
  }
  this.kill();
}

GameTank.Bouns.prototype.startTwinkle = function() {
  if(this.showTimer) {
    game.time.events.remove(this.showTimer);
    this.showTimer = null;
  }
  this.twinkleTimer = this.gameState.game.time.events.repeat(Phaser.Timer.SECOND * 0.5, 11, function() {
    if(this.alpha == 0) {
      this.alpha = 1;
    } else {
      this.alpha = 0;
    }
    this.twinkleCount++;
    if(this.twinkleCount == 11) {
      this.disappear();
    }
  }, this);
}
