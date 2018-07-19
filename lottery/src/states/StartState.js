
/**
* StartState，主界面
*/

var Phaser = Phaser || {};
var BirdsAnimals = BirdsAnimals || {};

// 继承 Phaser.State
BirdsAnimals.StartState = function () {
  Phaser.State.call(this);
};

BirdsAnimals.StartState.prototype = Object.create(Phaser.State.prototype);
BirdsAnimals.StartState.prototype.constructor = BirdsAnimals.StartState;

BirdsAnimals.StartState.prototype.create = function () {
  
  // 背景
  var bg = game.add.image(game.width/2, game.height/2, 'bg');
  bg.anchor.setTo(0.5, 0.5);

  // 组们
  this.groups = [];
  var fishGroup = game.add.group();
  var blackMaskGroup = game.add.group();
  var itemGroup = game.add.group();
  var historyItemGroup = game.add.group();
  this.groups['fish'] = fishGroup;
  this.groups['blackMask'] = blackMaskGroup;
  this.groups['item'] = itemGroup;
  this.groups['historyItem'] = historyItemGroup;

  var fishes = [];
  fishes.push(new BirdsAnimals.Fish(this, {x: 0, y: 0}, 'fish1', 'fish', {initSide: 'left', frames: 3}));
  fishes.push(new BirdsAnimals.Fish(this, {x: 0, y: 0}, 'fish1', 'fish', {initSide: 'right', frames: 3}));
  fishes.push(new BirdsAnimals.Fish(this, {x: 0, y: 0}, 'fish2', 'fish', {initSide: 'up', frames: 2}));
  fishes.push(new BirdsAnimals.Fish(this, {x: 0, y: 0}, 'fish2', 'fish', {initSide: 'down', frames: 2}));
  fishes.push(new BirdsAnimals.Fish(this, {x: 0, y: 0}, 'fish3', 'fish', {initSide: 'left', frames: 2}));
  fishes.push(new BirdsAnimals.Fish(this, {x: 0, y: 0}, 'fish3', 'fish', {initSide: 'down', frames: 2}));

  for(var i=0; i<fishes.length; i++) {
    fishes[i].swim();
  }

  window.itemManager = this.itemManager = new BirdsAnimals.ItemManager(this);
  
  window.historyManager = this.historyManager = new BirdsAnimals.HistoryManager(this);
  
  this.soundBgSilent = game.add.audio('sound-bg-silent');
  this.soundBgSilent.loop = true;
  this.soundBgSilent.play();

  this.historyManager.load(PHASER_HISTORY);

  game.time.events.loop(Phaser.Timer.SECOND * 60, function() {
    this.itemManager.run(game.rnd.pick(PHASER_NUM));
  }, this);

};
















