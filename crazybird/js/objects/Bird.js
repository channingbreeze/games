var Phaser = Phaser || {};
var CrazyBird = CrazyBird || {};

CrazyBird.Bird = function(gameState, position, texture, group, properties) {
  "use strict";
  CrazyBird.Prefab.call(this, gameState, position, texture, group, properties);
  
  this.animations.add('run');
  this.animations.play('run', 12, true);

  // game.physics.p2.enable(this);
  // this.body.fixedRotation = true;
  // this.body.setCollisionGroup(this.gameState.collideGroups['bird']);
  // this.body.collides(this.gameState.collideGroups['fruit'], this.hitFruit, this.gameState);
  // this.body.collides(this.gameState.collideGroups['bottom'], this.hitBottom, this.gameState);
  // this.body.collides([this.gameState.collideGroups['tiles']]);
  // this.body.mass = 10000;
  
  // this.birdMaterial = game.physics.p2.createMaterial('birdMaterial', this.body);

  this.inputEnabled = true;
  this.input.enableDrag(true);

  // this.events.onDragStart.add(function(sprite, pointer) {
  //   console.log("start", pointer.x, pointer.y)
  // }, this);
  // this.events.onDragUpdate.add(function(sprite, pointer) {
  //   console.log("move", pointer.x, pointer.y)
  // }, this);
  // this.events.onDragStop.add(function(sprite, pointer) {
  //   console.log("stop", pointer.x, pointer.y)
  // }, this);

};

CrazyBird.Bird.prototype = Object.create(CrazyBird.Prefab.prototype);
CrazyBird.Bird.prototype.constructor = CrazyBird.Bird;

CrazyBird.Bird.prototype.update = function () {
  "use strict";
  //this.ownFollow();
  // if(this.runningTime && game.time.now < this.runningTime) {
  //   this.body.velocity.x = 200 * 10;
  // } else {
  //   this.body.velocity.x = 200;
  // }
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
    this.body.velocity.y = -700;
  }
}

CrazyBird.Bird.prototype.hitBottom = function() {
  console.log('hit bottom');
}

CrazyBird.Bird.prototype.hitFruit = function(birdBody, fruitBody) {
  fruitBody.sprite.eated();
}
