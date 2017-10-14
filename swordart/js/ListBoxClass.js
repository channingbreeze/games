/**
 * 2017/9/13
 * 自定义状态原型类
 */
var CustomState = function (name) {
    this.name = name || '没有名字的自定义状态';
}
CustomState.prototype.goUp = function () {
    console.info(this.name + '想要往上走');
}
CustomState.prototype.goDown = function () {
    console.info(this.name + '想要往下走');
}
CustomState.prototype.goLeft = function () {
    console.info(this.name + '想要往左走');
}
CustomState.prototype.goRight = function () {
    console.info(this.name + '想要往右走');
}
CustomState.prototype.aDown = function () {
    console.info(this.name + '点了A键');
}
CustomState.prototype.bDown = function () {
    console.info(this.name + '点了B键');
}

/**
 * Created by zhuo on 2017/9/4.
 */
class ListBox {
    constructor(maxLength) {
        maxLength = maxLength || 5;
        this.list = [];
        this.displayList = [];
        this.thePointer = 0;
        this.displayListStart = 0;
        this.maxDisplayLength = maxLength;
    }

    reset() {
        this.thePointer = 0;
        this.displayListStart = 0;
        this.displayList = this.list.slice(this.thePointer, this.maxDisplayLength);
    }

    displayListUpdate() {
        var max = this.maxDisplayLength;
        var start = this.displayListStart;
        var end = start + max;

        //fix pointer
        if (this.list.length == 0) {
            this.thePointer = 0;
        } else if (this.thePointer < 0) {
            this.thePointer = 0;
        } else if (this.thePointer >= this.list.length) {
            this.thePointer = this.list.length - 1;
        }

        //fix display list
        if (this.thePointer < start) {
            this.displayListStart = this.thePointer;
        } else if (this.thePointer >= end) {
            this.displayListStart = this.thePointer - max + 1;
        } else {
            return;//display true
        }
        var newStart = this.displayListStart;
        this.displayList = this.list.slice(newStart, newStart + max);
    }

    init() {

    }

    goLeft() {
    };

    goRight() {
    };

    goUp() {
        this.thePointer--;
        this.displayListUpdate();
    };

    goDown() {
        this.thePointer++;
        this.displayListUpdate();
    };

    aDown() {
    };

    bDown() {
    };

    getSelectedItem() {
        var selected = this.list[this.thePointer];
        return selected;
    };
}
;

/**9.13 消息弹窗类**/
var myAlertDialog = new CustomState('消息弹窗');
myAlertDialog.group = null;
myAlertDialog.warnFont = {
        font: "bold 32px Arial",
        fill: "#FF3030",
        boundsAlignH: "center",
        boundsAlignV: "middle"
    };
myAlertDialog.successFont = {
        font: "bold 32px Arial",
        fill: "#4EEE94",
        boundsAlignH: "center",
        boundsAlignV: "middle"
    };

myAlertDialog.reOpen = function (msg, cb ,style, exitState) {
    if(!myAlertDialog.group){
        myAlertDialog.group = game.add.group();
    }

    this.style = style || this.successFont;
    this.exitState = exitState || mainState;

    if(this.exitState.setVisible)this.exitState.setVisible(false);
    mainState.setVisible(false);

    myAlertDialog.group.visible = true;
    currentCustomState = myAlertDialog;
    myAlertDialog.msg = msg || '没有信息';
    myAlertDialog.cb = cb || function () {
        myAlertDialog.bDown();
        };

    this.setVisible(true);
    myAlertDialog.render();
}
myAlertDialog.render = function () {
    myAlertDialog.group.removeAll(true);
    myAlertDialog.group.visible = true;

    function showUICorrect(ui) {
        ui.fixedToCamera = true;
        myAlertDialog.group.add(ui);
    }

    var bg = game.add.graphics();
    bg.beginFill(0x000000);
    bg.drawRect(0, 0, 500, 500);
    showUICorrect(bg);

    var text = game.add.text(0, 0, myAlertDialog.msg, this.style);
    text.setTextBounds(100, 100, 300, 300);
    showUICorrect(text);
}
myAlertDialog.aDown = function () {
    myAlertDialog.group.visible = false;
    myAlertDialog.cb();
}
myAlertDialog.bDown = function () {
    myAlertDialog.group.visible = false;
    currentCustomState = this.exitState;
    this.exitState.setVisible(true);
};
myAlertDialog.setVisible = function (visible) {
    this.group.visible = visible;
}

