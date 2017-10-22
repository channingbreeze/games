
/**
* HistoryHistoryItem，一个历史项，封装历史项的所有动作
*/

var Phaser = Phaser || {};
var BirdsAnimals = BirdsAnimals || {};

BirdsAnimals.HistoryItem = function(gameState, position, texture, group, properties) {
  "use strict";
  // 精灵
  Phaser.Sprite.call(this, gameState.game, position.x, position.y, texture);
  this.anchor.setTo(0.5, 0.5);
  this.gameState = gameState;
  this.properties = properties;
  if(group) {
    this.gameState.groups[group].add(this);
  }
  this.frame = this.properties.frame;

}

BirdsAnimals.HistoryItem.prototype = Object.create(Phaser.Sprite.prototype);
BirdsAnimals.HistoryItem.prototype.constructor = BirdsAnimals.HistoryItem;




