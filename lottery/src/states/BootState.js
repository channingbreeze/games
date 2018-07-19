
/**
* BootState，加载加载页面的资源，设置全局属性
*/

var Phaser = Phaser || {};
var BirdsAnimals = BirdsAnimals || {};

// 继承 Phaser.State
BirdsAnimals.BootState = function () {
  Phaser.State.call(this);
};

BirdsAnimals.BootState.prototype = Object.create(Phaser.State.prototype);
BirdsAnimals.BootState.prototype.constructor = BirdsAnimals.BootState;

BirdsAnimals.BootState.prototype.preload = function () {
  // 水平垂直居中
  this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  this.scale.pageAlignHorizontally = true;
  this.scale.pageAlignVertically = true;
  // 页面失去焦点不暂停
  game.stage.disableVisibilityChange = true;
};

BirdsAnimals.BootState.prototype.create = function () {
  // 去资源加载页面
  game.state.start('PreloadState');
};
