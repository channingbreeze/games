
var Phaser = Phaser || {};
var CrazyBird = CrazyBird || {};

CrazyBird.StartState = function () {
  "use strict";
  CrazyBird.BaseState.call(this);
};

CrazyBird.StartState.prototype = Object.create(CrazyBird.BaseState.prototype);
CrazyBird.StartState.prototype.constructor = CrazyBird.StartState;

CrazyBird.StartState.prototype.create = function () {
  "use strict";

  game.physics.startSystem(Phaser.Physics.P2JS);
  game.physics.p2.restitution = 0;
  game.physics.p2.gravity.y = 300;

  // 背景
  var background = game.add.tileSprite(0, 0, WIDTH, HEIGHT, 'background');
  background.fixedToCamera = true;

  // 移动的背景们
  new CrazyBird.BackgroundRepeater(this, 'cloud', 50, 2, 15000);
  new CrazyBird.BackgroundRepeater(this, 'mountain', 300, 10, 10000);
  new CrazyBird.BackgroundRepeater(this, 'tree', 500, 3, 8000);
  new CrazyBird.BackgroundRepeater(this, 'grass', 500, 20, 5000);

  // 各种组，组的顺序决定层级的顺序
  this.groups = {};
  this.groups["bird"] = game.add.group();

  this.bird = new CrazyBird.Bird(this, {x: 300, y: 100}, 'bird', 'bird');
  
  var jumpBtn = game.add.button(50, HEIGHT - 150, 'jump-button', this.jump, this, 0, 0, 0);
  var runBtn = game.add.button(WIDTH - 150, HEIGHT - 150, 'run-button', this.run, this, 0, 0, 0);

  jumpBtn.fixedToCamera = true;
  runBtn.fixedToCamera = true;

  var map = game.add.tilemap('map');
  map.addTilesetImage('floor', 'tiles');
  var layer = map.createLayer('map1');
  layer.resizeWorld();
  layer.resize(WIDTH, HEIGHT);
  layer.wrap = true;
  map.setCollisionBetween(1, 1);
  game.physics.p2.convertTilemap(map, layer);
  this.cursors = game.input.keyboard.createCursorKeys();
};

CrazyBird.StartState.prototype.update = function() {
  if (this.cursors.up.isDown)
  {
      game.camera.y -= 10
  }
  else if (this.cursors.down.isDown)
  {
      game.camera.y += 10
  }

  if (this.cursors.left.isDown)
  {
      game.camera.x -= 10
  }
  else if (this.cursors.right.isDown)
  {
      game.camera.x += 10
  }
};

CrazyBird.StartState.prototype.render = function() {
  game.debug.spriteCoords(this.bird, 32, 32);
  game.debug.cameraInfo(game.camera, 0, 322);
}

CrazyBird.StartState.prototype.jump = function() {
  this.bird.jump();
};

CrazyBird.StartState.prototype.run = function() {
  this.bird.run();
};
