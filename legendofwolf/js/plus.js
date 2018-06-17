Phaser.Display = {};
Phaser.Display.Align = {};
/*
	Display: 游戏对象
	Align: 位置
	In： 在目标对象内部显示
*/
Phaser.Display.Align.In = {
  Center: function (AlignObj, GameObj) {
    AlignObj.x = GameObj.x + (GameObj.width - AlignObj.width) / 2;
    AlignObj.y = GameObj.y + (GameObj.height - AlignObj.height) / 2;
    return AlignObj;
  },
  TopCenter: function (AlignObj, GameObj) {
    AlignObj.x = GameObj.x + (GameObj.width - AlignObj.width) / 2;
    AlignObj.y = GameObj.y;
    return AlignObj;
  },
  TopLeft: function (AlignObj, GameObj) {
    AlignObj.x = GameObj.x;
    AlignObj.y = GameObj.y;
    return AlignObj;
  },
  TopRight: function (AlignObj, GameObj) {
    AlignObj.x = GameObj.x + GameObj.width - AlignObj.width;
    AlignObj.y = GameObj.y;
    return AlignObj;
  },
  BottomCenter: function (AlignObj, GameObj) {
    AlignObj.x = GameObj.x + (GameObj.width - AlignObj.width) / 2;
    AlignObj.y = GameObj.y + GameObj.height - AlignObj.height;
    return AlignObj;
  },
  BottomLeft: function (AlignObj, GameObj) {
    AlignObj.x = GameObj.x;
    AlignObj.y = GameObj.y + GameObj.height - AlignObj.height;
    return AlignObj;
  },
  BottomRight: function (AlignObj, GameObj) {
    AlignObj.x = GameObj.x + GameObj.width - AlignObj.width;
    AlignObj.y = GameObj.y + GameObj.height - AlignObj.height;
    return AlignObj;
  },
  LeftCenter: function (AlignObj, GameObj) {
    AlignObj.x = GameObj.x;
    AlignObj.y = GameObj.y + (GameObj.height - AlignObj.height) / 2;
    return AlignObj;
  },
  RightCenter: function (AlignObj, GameObj) {
    AlignObj.x = GameObj.x + GameObj.width - AlignObj.width;
    AlignObj.y = GameObj.y + (GameObj.height - AlignObj.height) / 2;
    return AlignObj;
  }
};
/*
	Display: 游戏对象
	Align: 位置
	To： 在目标对象外部显示
*/
Phaser.Display.Align.To = {
  TopCenter: function (AlignObj, GameObj) {
    AlignObj.x = GameObj.x + (GameObj.width - AlignObj.width) / 2;
    AlignObj.y = GameObj.y - AlignObj.height;
    return AlignObj;
  },
  TopLeft: function (AlignObj, GameObj) {
    AlignObj.x = GameObj.x;
    AlignObj.y = GameObj.y - AlignObj.height;
    return AlignObj;
  },
  TopRight: function (AlignObj, GameObj) {
    AlignObj.x = GameObj.x + GameObj.width - AlignObj.width;
    AlignObj.y = GameObj.y - AlignObj.height;
    return AlignObj;
  },
  BottomCenter: function (AlignObj, GameObj) {
    AlignObj.x = GameObj.x + (GameObj.width - AlignObj.width) / 2;
    AlignObj.y = GameObj.y + GameObj.height;
    return AlignObj;
  },
  BottomLeft: function (AlignObj, GameObj) {
    AlignObj.x = GameObj.x;
    AlignObj.y = GameObj.y + GameObj.height;
    return AlignObj;
  },
  BottomRight: function (AlignObj, GameObj) {
    AlignObj.x = GameObj.x + GameObj.width - AlignObj.width;
    AlignObj.y = GameObj.y + GameObj.height;
    return AlignObj;
  },
  LeftCenter: function (AlignObj, GameObj) {
    AlignObj.x = GameObj.x - AlignObj.width;
    AlignObj.y = GameObj.y + (GameObj.height - AlignObj.height) / 2;
    return AlignObj;
  },
  RightCenter: function (AlignObj, GameObj) {
    AlignObj.x = GameObj.x + GameObj.width;
    AlignObj.y = GameObj.y + (GameObj.height - AlignObj.height) / 2;
    return AlignObj;
  },
  RightBottom: function (AlignObj, GameObj) {
    AlignObj.x = GameObj.x + GameObj.width;
    AlignObj.y = GameObj.y + GameObj.height - AlignObj.height;
    return AlignObj;
  },
  RightTop: function (AlignObj, GameObj) {
    AlignObj.x = GameObj.x + GameObj.width;
    AlignObj.y = GameObj.y;
    return AlignObj;
  },
  LeftBottom: function (AlignObj, GameObj) {
    AlignObj.x = GameObj.x - AlignObj.width;
    AlignObj.y = GameObj.y + GameObj.height - AlignObj.height;
    return AlignObj;
  },
  LeftTop: function (AlignObj, GameObj) {
    AlignObj.x = GameObj.x - AlignObj.width;
    AlignObj.y = GameObj.y;
    return AlignObj;
  }
};