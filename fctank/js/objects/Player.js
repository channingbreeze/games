
var GameTank = GameTank || {};

GameTank.Player = function(gameState, position, texture, group, properties) {
  "use strict";
  GameTank.Tank.call(this, gameState, position, texture, group, properties);
  
  this.rebirth(position);
};

GameTank.Player.prototype = Object.create(GameTank.Tank.prototype);
GameTank.Player.prototype.constructor = GameTank.Player;

GameTank.Player.prototype.playerUpdate = function () {
  "use strict";
  this.tankUpdate();
  this.gameState.game.physics.arcade.collide(this, this.gameState.groups["enemy"]);
  this.gameState.game.physics.arcade.overlap(this, this.gameState.groups["bouns"], this.getBouns, null, this);
};

GameTank.Player.prototype.fire = function() {
  if(game.gameover) {
    return;
  }
  
  if(this.gameState.groups["playerBullet"].countLiving() < this.life && this.alive) {
    var position = {x: this.x, y: this.y};
    var bullet = this.gameState.groups["playerBullet"].getFirstExists(false);
    if(!bullet) {
      bullet = new GameTank.PlayerBullet(this.gameState, position, 'bullet', 'playerBullet', {direction: this.direction});
    } else {
      bullet.rebirth(position, {direction: this.direction});
    }
    if(this.life >= 4) {
      bullet.canHitIron = true;
    }
    bullet.owner = this.key;
    this.gameState.soundManager.playerFire();
  }
};

GameTank.Player.prototype.hited = function() {
  if(!this.isHelmetted) {
    this.life--;
    if(this.life == 0) {
      this.dead();
    } else {
      this.changeAnim();
    }
  }
}

GameTank.Player.prototype.playerDead = function() {
  this.explode();
  this.gameState.soundManager.playerBoom();
};

GameTank.Player.prototype.rebirth = function(position) {
  // 出生自带头盔
  this.getHelmet();
  this.reset(position.x, position.y);
  this.direction = "up";
  this.angle = 0;
  this.life = 1;
  this.animations.add('run', [0, 1], 10, true);
  this.animations.play("run");
};

GameTank.Player.prototype.getBouns = function(player, bouns) {
  bouns.disappear();
  this.gameState.soundManager.getAward();
  this.gameState.bounsManager.bounsAward(bouns, player);
}

GameTank.Player.prototype.getStar = function() {
  if(this.life < 4) {
    this.life++;
    this.changeAnim();
  }
}

GameTank.Player.prototype.changeAnim = function() {
  if(this.life == 1) {
    this.animations.add('run', [0, 1], 10, true);
    this.animations.play("run");
  } else if(this.life == 2) {
    this.animations.add('run', [2, 3], 10, true);
    this.animations.play("run");
  } else if(this.life == 3) {
    this.animations.add('run', [4, 5], 10, true);
    this.animations.play("run");
  } else if(this.life == 4) {
    this.animations.add('run', [6, 7], 10, true);
    this.animations.play("run");
  }
}

GameTank.Player.prototype.getHelmet = function() {
  if(!this.isHelmetted) {
    this.isHelmetted = true;
    this.shield = game.add.sprite(0, 0, 'shield', 0);
    this.shield.anchor.setTo(0.5, 0.5);
    var anim = this.shield.animations.add('shield', [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1], 5);
    anim.play();
    anim.onComplete.add(function() {
      this.isHelmetted = false;
      this.shield.destroy();
    }, this);
    this.addChild(this.shield);
  // 接了又接
  } else {
    this.shield.animations.stop();
    var anim = this.shield.animations.add('shield', [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1], 5);
    anim.play();
    anim.onComplete.add(function() {
      this.isHelmetted = false;
      this.shield.destroy();
    }, this);
  }
}

