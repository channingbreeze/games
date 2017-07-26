var Phaser = Phaser || {};
var CrazyBird = CrazyBird || {};

CrazyBird.Bird = function(gameState, position, texture, group, properties) {
  "use strict";
  CrazyBird.Prefab.call(this, gameState, position, texture, group, properties);
  
  this.animations.add('run');
  this.animations.play('run', 12, true);

  game.physics.p2.enable(this);
  this.body.fixedRotation = true;

};

CrazyBird.Bird.prototype = Object.create(CrazyBird.Prefab.prototype);
CrazyBird.Bird.prototype.constructor = CrazyBird.Bird;

CrazyBird.Bird.prototype.update = function () {
  "use strict";
  this.ownFollow();
  if(this.runningTime && game.time.now < this.runningTime) {
    this.body.moveRight(200 * 10);
  } else {
    this.body.moveRight(200);
  }
}

CrazyBird.Bird.prototype.ownFollow = function() {
  game.camera.x = this.x - WIDTH/2;
  game.camera.y = this.y;
  if(game.camera.x > game.world.width - WIDTH) {
    game.camera.x = game.world.width - WIDTH;
  }
}

CrazyBird.Bird.prototype.checkIfCanJump = function() {

  var yAxis = p2.vec2.fromValues(0, 1);

  var result = false;

  for (var i = 0; i < game.physics.p2.world.narrowphase.contactEquations.length; i++) {
    var c = game.physics.p2.world.narrowphase.contactEquations[i];

    if (c.bodyA === this.body.data || c.bodyB === this.body.data) {
      var d = p2.vec2.dot(c.normalA, yAxis); // Normal dot Y-axis
      if (c.bodyA === this.body.data) d *= -1;
      if (d > 0.5) result = true;
    }
  }
  
  return result;

}

CrazyBird.Bird.prototype.walk = function () {
  "use strict";
  this.scale.setTo(1, 1);
}

CrazyBird.Bird.prototype.run = function () {
  "use strict";
  if(!this.runningTime || game.time.now > this.runningTime) {
    this.runningTime = game.time.now + 200;
  }
}

CrazyBird.Bird.prototype.jump = function() {
  "use strict";
  if(this.checkIfCanJump()) {
    this.body.moveUp(300);
  }
}
