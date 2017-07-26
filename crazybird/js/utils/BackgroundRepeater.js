var Phaser = Phaser || {};
var CrazyBird = CrazyBird || {};

CrazyBird.BackgroundRepeater = function(gameState, texture, y, number, speed, properties) {
  "use strict";
  Object.call(this);
  this.gameState = gameState;
  this.texture = texture;
  this.y = y;
  this.number = number;
  this.speed = speed;
  this.generate();
  this.run();
};

CrazyBird.BackgroundRepeater.prototype = Object.create(Object.prototype);
CrazyBird.BackgroundRepeater.prototype.constructor = CrazyBird.BackgroundRepeater;

CrazyBird.BackgroundRepeater.prototype.generate = function() {
  this.fixed = game.add.sprite(0, 0);
  this.fixed.fixedToCamera = true;
  this.bg = game.add.sprite(WIDTH, 0);
  this.fixed.addChild(this.bg);
  for(var i=0; i<this.number/2; i++) {
    var scalex, scaley;
    if(i % 2 == 0) {
      scalex = game.rnd.realInRange(0.8, 2);
    } else {
      scalex = game.rnd.realInRange(-2, -0.8);
    }
    var scaley = game.rnd.realInRange(0.5, 2);
    var obj1 = game.add.sprite(-WIDTH+50 + i*(2*WIDTH-100)/this.number, this.y, this.texture);
    obj1.anchor.setTo(0.5, 0.5);
    obj1.alpha = 0.5;
    obj1.scale.setTo(scalex, scaley);
    this.bg.addChild(obj1);
    var obj2 = game.add.sprite(-WIDTH+50 + i*(2*WIDTH-100)/this.number + WIDTH, this.y, this.texture);
    obj2.anchor.setTo(0.5, 0.5);
    obj2.alpha = 0.5;
    obj2.scale.setTo(scalex, scaley);
    this.bg.addChild(obj2);
    var obj3 = game.add.sprite(-WIDTH+50 + i*(2*WIDTH-100)/this.number + 2*WIDTH, this.y, this.texture);
    obj3.anchor.setTo(0.5, 0.5);
    obj3.alpha = 0.5;
    obj3.scale.setTo(scalex, scaley);
    this.bg.addChild(obj3);
  }

}

CrazyBird.BackgroundRepeater.prototype.run = function() {
  var tween = game.add.tween(this.bg).to({x: 0}, this.speed, Phaser.Easing.Linear.NONE, true, 0, -1);
}
