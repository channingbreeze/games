
/**
* 历史管理器
*/

var Phaser = Phaser || {};
var BirdsAnimals = BirdsAnimals || {};

BirdsAnimals.HistoryManager = function(gameState) {
  "use strict";
  Object.call(this);
  this.gameState = gameState;
  
  this.items = [];
};

BirdsAnimals.HistoryManager.prototype = Object.create(Object.prototype);
BirdsAnimals.HistoryManager.prototype.constructor = BirdsAnimals.HistoryManager;

// 计算跨度
BirdsAnimals.HistoryManager.prototype.getSpan = function(lotteryNum) {
  var digits = [];
  for(var i=0; i<lotteryNum.length; i++) {
    digits.push(parseInt(lotteryNum[i]));
  }
  var max = digits[0], min = digits[0];
  if(max < digits[1]) {
    max = digits[1];
  }
  if(min > digits[1]) {
    min = digits[1];
  }
  if(max < digits[2]) {
    max = digits[2];
  }
  if(min > digits[2]) {
    min = digits[2];
  }
  return max - min;
}

BirdsAnimals.HistoryManager.prototype.getAnimal = function(span) {
  if(span == 3 || span == 4) {
    return 'HOUZI';
  } else if(span == 6 || span == 7) {
    return 'GEZI';
  } else if(span == 2) {
    return 'XIONGMAO';
  } else if(span == 8) {
    return 'KONGQUE';
  } else if(span == 9) {
    return 'SHIZI';
  } else if(span == 1) {
    return 'LAOYING';
  } else if(span == 5) {
    return 'YINSHAYU';
  } else if(span == 0) {
    return 'JINSHAYU';
  } else {
    return 'HOUZI';
  }
}

BirdsAnimals.HistoryManager.prototype.load = function(arr) {
  for(var i=0; i<arr.length; i++) {
    var preNum = this.getSpan(arr[i]);
    var animalType = this.getAnimal(preNum);

    var itemRaw = HISTORYRAW[animalType];

    var pos = {
      x: 158 + 45 * (i - 1),
      y: game.height - 100
    }

    var item = new BirdsAnimals.HistoryItem(this.gameState, pos, itemRaw.texture, 'item', itemRaw);
    this.items.push(item);
  }
}

BirdsAnimals.HistoryManager.prototype.forward = function(animalType) {
  var itemRaw = ITEMRAW[animalType];
  for(var i=0; i<this.items.length-1; i++) {
    this.items[i].frame = this.items[i+1].frame;
  }
  this.items[this.items.length-1].frame = itemRaw.frame;
}




