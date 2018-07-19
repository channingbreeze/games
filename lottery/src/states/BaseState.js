
/**
* BaseState，加载加载页面的资源，设置全局属性
*/

var Phaser = Phaser || {};
var BirdsAnimals = BirdsAnimals || {};

// 继承 Phaser.State
BirdsAnimals.BaseState = function () {
  Phaser.State.call(this);
};

BirdsAnimals.BaseState.prototype = Object.create(Phaser.State.prototype);
BirdsAnimals.BaseState.prototype.constructor = BirdsAnimals.BaseState;

BirdsAnimals.BaseState.prototype.create = function () {
  
};
