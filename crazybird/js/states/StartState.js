
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

  // 使用 P2 物理系统
  game.physics.startSystem(Phaser.Physics.P2JS);
  
  game.physics.p2.setImpactEvents(true);
  game.physics.p2.restitution = 0;
  game.physics.p2.gravity.y = 1200;
  game.physics.p2.setBoundsToWorld(false, false, true, false, false);

  // 背景
  var background = game.add.tileSprite(0, 0, WIDTH, HEIGHT, 'background');
  background.fixedToCamera = true;

  // 移动的背景们
  new CrazyBird.BackgroundRepeater(this, 'cloud', 50, 2, 15000);
  new CrazyBird.BackgroundRepeater(this, 'mountain', 300, 10, 10000);
  new CrazyBird.BackgroundRepeater(this, 'tree', 500, 3, 8000);
  new CrazyBird.BackgroundRepeater(this, 'grass', 500, 20, 5000);

  // tilemap 封装
  this.mapManager = new CrazyBird.MapManager(this);
  this.mapManager.loadLevel('map', 'map1');

  // p2中的碰撞组
  this.collideGroups = {};
  this.collideGroups['bird'] = game.physics.p2.createCollisionGroup();
  this.collideGroups['fruit'] = game.physics.p2.createCollisionGroup();
  this.collideGroups['tiles'] = game.physics.p2.createCollisionGroup();
  this.collideGroups['cat'] = game.physics.p2.createCollisionGroup();
  this.collideGroups['bottom'] = game.physics.p2.createCollisionGroup();

  // 各种组，组的顺序决定层级的顺序
  this.groups = {};
  this.groups["bird"] = game.add.group();
  this.groups["kiwi"] = game.add.group();
  this.groups["cat1"] = game.add.group();
  this.groups["bottom"] = game.add.group();
  this.groups["button"] = game.add.group();

  this.bird = new CrazyBird.Bird(this, {x: 300, y: 100}, 'bird', 'bird');
  
  // 设置地图关于碰撞的一些属性
  this.mapManager.setMapProperty();

  this.jumpBtn = new CrazyBird.CircleButton(this, {x: 100, y: HEIGHT - 100}, 'jump-button', this.jump, this, 'button', {keyCode: Phaser.KeyCode.S});
  this.runBtn = new CrazyBird.CircleButton(this, {x: WIDTH - 100, y: HEIGHT - 100}, 'run-button', this.run, this, 'button', {keyCode: Phaser.KeyCode.K});

  var kiwifruits = this.mapManager.findObjectsByType("kiwifruit", this.map, "kiwifruit1");
  for(var i=0; i<kiwifruits.length; i++) {
    new CrazyBird.KiwiFruit(this, {x: kiwifruits[i].x, y: kiwifruits[i].y}, 'kiwifruit', 'kiwi');
  }

  var cat1s = this.mapManager.findObjectsByType("cat1", this.map, "cat1");
  for(var i=0; i<cat1s.length; i++) {
    new CrazyBird.Cat(this, {x: cat1s[i].x, y: cat1s[i].y}, 'cat1', 'cat1');
  }

  var bottomTexture = game.add.bitmapData(game.world.width, 1);
  bottomTexture.ctx.strokeStyle = "black";
  bottomTexture.ctx.strokeRect(0, 0, game.world.width, 1);
  new CrazyBird.Bottom(this, {x: game.world.width/2, y: HEIGHT+71}, bottomTexture, 'bottom');

  var bmpText = game.add.bitmapText(WIDTH - 90, 25, 'greenFont', '2800', 30);
  bmpText.fixedToCamera = true;
  bmpText.anchor.setTo(1, 0);

  var bmpText2 = game.add.bitmapText(20, 60, 'yellowFont', '8722', 20);
  bmpText2.fixedToCamera = true;

  var textUnit = game.add.sprite(bmpText2.x + bmpText2.width + 18, bmpText2.y + bmpText2.height - 12, 'm');
  textUnit.anchor.setTo(0.5, 0.5);
  textUnit.scale.setTo(1.5, 1.5);
  textUnit.fixedToCamera = true;

  var startButton = game.add.image(WIDTH - 45, 45, 'start_button');
  startButton.fixedToCamera = true;
  startButton.anchor.setTo(0.5, 0.5);
  startButton.scale.setTo(1.3, 1.3);

  var energy = game.add.graphics(0, 0);
  energy.beginFill(0xF1040A);
  energy.drawRoundedRect(20, 20, 100, 25, 25);
  energy.endFill();
  energy.fixedToCamera = true;

  var energy = game.add.graphics(0, 0);
  energy.beginFill(0xF1040A, 0);
  energy.lineStyle(5, 0x9C936F);
  energy.drawRoundedRect(20, 20, 200, 25, 25);
  energy.endFill();
  energy.fixedToCamera = true;

  var kiwiLogo = game.add.sprite(20, 100, 'kiwifruit');
  kiwiLogo.fixedToCamera = true;
  var bmpText2 = game.add.bitmapText(kiwiLogo.right + 8, kiwiLogo.top + 5, 'greenFont', '17', 20);
  bmpText2.fixedToCamera = true;

};

CrazyBird.StartState.prototype.jump = function() {
  this.bird.jump();
};

CrazyBird.StartState.prototype.run = function() {
  this.bird.run();
};



