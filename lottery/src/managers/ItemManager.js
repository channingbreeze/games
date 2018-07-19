
/**
* Item管理器
*/

var Phaser = Phaser || {};
var BirdsAnimals = BirdsAnimals || {};

BirdsAnimals.ItemManager = function(gameState) {
  "use strict";
  Object.call(this);
  this.gameState = gameState;
  this.lastPos = 0;
  this.items = [];

  this.playSound = game.add.sound('sound-bg-play');
  this.playSound.loop = true;

  // 每个item高60宽70
  for(var i=0; i<ITEMS.length; i++) {

    var itemRaw = ITEMRAW[ITEMS[i].type];

    var pos = {
      x: 35 + 70 * (ITEMS[i].position.x - 1),
      y: 30 + 60 * (ITEMS[i].position.y - 1)
    }

    var item = new BirdsAnimals.Item(this.gameState, pos, itemRaw.texture, 'item', itemRaw);
    this.items.push(item);

  }
  
};

BirdsAnimals.ItemManager.prototype = Object.create(Object.prototype);
BirdsAnimals.ItemManager.prototype.constructor = BirdsAnimals.ItemManager;

// 计算跨度
BirdsAnimals.ItemManager.prototype.getSpan = function(lotteryNum) {
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

BirdsAnimals.ItemManager.prototype.getAnimal = function(span) {
  if(span == 3 || span == 4) {
    return HOUZI;
  } else if(span == 6 || span == 7) {
    return GEZI;
  } else if(span == 2) {
    return XIONGMAO;
  } else if(span == 8) {
    return KONGQUE;
  } else if(span == 9) {
    return SHIZI;
  } else if(span == 1) {
    return LAOYING;
  } else if(span == 5) {
    return YINSHAYU;
  } else if(span == 0) {
    return JINSHAYU;
  } else {
    return HOUZI;
  }
}

BirdsAnimals.ItemManager.prototype.getItemPos = function(animalType) {
  if(animalType == YINSHAYU) {
    return game.rnd.pick([0, 8, 14, 22]);
  } else if(animalType == JINSHAYU) {
    return game.rnd.pick([4, 11, 18, 25]);
  } else if(animalType == KONGQUE) {
    return game.rnd.pick([26, 27]);
  } else if(animalType == LAOYING) {
    return game.rnd.pick([1, 2, 3]);
  } else if(animalType == SHIZI) {
    return game.rnd.pick([5, 6, 7]);
  } else if(animalType == XIONGMAO) {
    return game.rnd.pick([9, 10]);
  } else if(animalType == GEZI) {
    return game.rnd.pick([23, 24]);
  } else if(animalType == YANZI) {
    return game.rnd.pick([19, 20, 21]);
  } else if(animalType == TUZI) {
    return game.rnd.pick([15, 16, 17]);
  } else if(animalType == HOUZI) {
    return game.rnd.pick([12, 13]);
  }
}

BirdsAnimals.ItemManager.prototype.getRunNum = function(itemPos, circleNum) {
  return (itemPos - this.lastPos + 28) % 28 + 28 * circleNum + 1;
}

// 跑起来
BirdsAnimals.ItemManager.prototype.run = function(lotteryNum) {
  var curPos = this.lastPos;
  var prePos = undefined;
  var preSum = this.getSpan(lotteryNum);
  var animalType = this.getAnimal(preSum);
  var itemPos = this.getItemPos(animalType);
  var runNum = this.getRunNum(itemPos, 5);
  var count = 0;
  var timeCount = 0;
  var shouldRun = false;

  this.gameState.soundBgSilent.stop();
  this.playSound.fadeIn(100);

  // 定时器
  var timer = game.time.events.loop(Phaser.Timer.SECOND * 0.04, function() {
    timeCount++;
    if(count < 2 || runNum - count < 2) {
      if(timeCount >= 10) {
        shouldRun = true;
      }
    } else if(count < 4 || runNum - count < 4) {
      if(timeCount >= 5) {
        shouldRun = true;
      }
    } else if(count < 7 || runNum - count < 7) {
      if(timeCount >= 3) {
        shouldRun = true;
      }
    } else {
      if(timeCount >= 1) {
        shouldRun = true;
      }
    }
    if(shouldRun) {
      shouldRun = false;
      timeCount = 0;
      if(prePos != undefined) {
        this.items[prePos].unBeYellow();
      }
      this.items[curPos].beYellow();
      prePos = curPos;
      curPos = (curPos + 1) % 28;
      count++;

      // 跑结束
      if(count == runNum) {
        game.time.events.remove(timer);
        this.lastPos = prePos;
        this.items[prePos].unBeYellow();
        this.items[prePos].runFrameAnim();
        game.time.events.add(Phaser.Timer.SECOND * 3, function() {
          this.items[prePos].runBigAnim();
        }, this);
        game.time.events.add(Phaser.Timer.SECOND * 8, function() {
          this.playSound.fadeOut(3000);
        }, this);
        game.time.events.add(Phaser.Timer.SECOND * 11, function() {
          this.gameState.soundBgSilent.play();
        }, this);
        this.gameState.historyManager.forward(this.items[prePos].type);
      }
    }
  }, this);
}







