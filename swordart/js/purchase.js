/**
 * Created by zhuo on 2017/9/21.
 * 售出
 */
var purchaseDialog = new ListBox(8);
purchaseDialog.group = null;
purchaseDialog.lastState = null;

purchaseDialog.reOpen = function (itemList, lastState) {
    if (!this.group) {
        this.group = game.add.group();
    }

    //复用道具菜单
    purchaseDialog.list = itemList || player.itemList;
    purchaseDialog.lastState = lastState || mainState;
    purchaseDialog.reset();

    currentCustomState = purchaseDialog;
    // lastState.setVisible(false);
    purchaseDialog.setVisible(true);
    purchaseDialog.render();
}
purchaseDialog.render = function () {
    var style = menuDialog.font;
    purchaseDialog.group.removeAll(true);

    var text = game.add.text(0, 0, '道具出售', style);
    text.setTextBounds(0, 5, 500, 25);
    text.fixedToCamera = true;
    purchaseDialog.group.add(text);

    (function updateTexts() {
        var list = purchaseDialog.displayList;
        for (var i = list.length - 1; i >= 0; i--) {
            var text = game.add.text(0, 0, list[i].item.name + '\t X' + list[i].num, style);
            text.setTextBounds(0, i * 55 + 35, 500, 55);
            text.fixedToCamera = true;
            purchaseDialog.group.add(text);
        }
    })();

    var barY = (purchaseDialog.thePointer - purchaseDialog.displayListStart) * 55 + 35;
    var bar = game.add.graphics();
    bar.beginFill(0xCAE1FF, 0.2);
    bar.drawRect(50, barY, 400, 55);
    bar.fixedToCamera = true;
    purchaseDialog.group.add(bar);
}
purchaseDialog.setVisible = function (visible) {
    purchaseDialog.group.visible = visible;
}
purchaseDialog.close = function () {
    //change current custom state
    currentCustomState = purchaseDialog.lastState;
    purchaseDialog.setVisible(false);
    purchaseDialog.lastState.setVisible(true);
}
purchaseDialog.goDown = function () {
    purchaseDialog.thePointer++;
    purchaseDialog.displayListUpdate();
    purchaseDialog.render();
}
purchaseDialog.goUp = function () {
    purchaseDialog.thePointer--;
    purchaseDialog.displayListUpdate();
    purchaseDialog.render();
}
purchaseDialog.aDown = function () {
    // console.info('seleted item is:'+purchaseDialog.getSelectedItem().name);
    var selected = purchaseDialog.getSelectedItem();
    if (!selected) return;

    this.setVisible(false);
    selectNumDialog.reOpen(function (num) {
        var haveNum = selected.num;
        if (num > haveNum) num = haveNum;

        var moneyGet = selected.item.price * num;
        var msg = '将要卖出' + selected.item.name + num + '个\n总共价值' + moneyGet + '\n确定吗?';

        myAlertDialog.reOpen(msg, function () {
            player.discardItem(selected.item, player, num);
            player.money = player.money + moneyGet;

            mainState.setVisible(true);
            myAlertDialog.bDown();
        }, null, mainState)
    }, this);
}
purchaseDialog.bDown = function () {
    purchaseDialog.close();
}
purchaseDialog.getMenuItem = function () {
    return {
        name: '道具',
        aDown: purchaseDialog.reOpen,
    }
}
/**
 * 买道具
 * */

var buyDialog = new ListBox(8);
buyDialog.group = null;
buyDialog.lastState = null;

buyDialog.reOpen = function (itemList, lastState) {
    if (!this.group) {
        this.group = game.add.group();
    }

    //复用道具菜单
    buyDialog.list = itemList || player.itemList;
    buyDialog.lastState = lastState || mainState;
    buyDialog.reset();

    currentCustomState = buyDialog;
    // lastState.setVisible(false);
    buyDialog.setVisible(true);
    buyDialog.render();
}
buyDialog.render = function () {
    var style = menuDialog.font;
    buyDialog.group.removeAll(true);

    var text = game.add.text(0, 0, '道具出售', style);
    text.setTextBounds(0, 5, 500, 25);
    text.fixedToCamera = true;
    buyDialog.group.add(text);

    (function updateTexts() {
        var list = buyDialog.displayList;
        for (var i = list.length - 1; i >= 0; i--) {
            var text = game.add.text(0, 0, list[i].item.name + '\t X' + list[i].num, style);
            text.setTextBounds(0, i * 55 + 35, 500, 55);
            text.fixedToCamera = true;
            buyDialog.group.add(text);
        }
    })();

    var barY = (buyDialog.thePointer - buyDialog.displayListStart) * 55 + 35;
    var bar = game.add.graphics();
    bar.beginFill(0xCAE1FF, 0.2);
    bar.drawRect(50, barY, 400, 55);
    bar.fixedToCamera = true;
    buyDialog.group.add(bar);
}
buyDialog.setVisible = function (visible) {
    buyDialog.group.visible = visible;
}
buyDialog.close = function () {
    //change current custom state
    currentCustomState = buyDialog.lastState;
    buyDialog.setVisible(false);
    buyDialog.lastState.setVisible(true);
}
buyDialog.goDown = function () {
    buyDialog.thePointer++;
    buyDialog.displayListUpdate();
    buyDialog.render();
}
buyDialog.goUp = function () {
    buyDialog.thePointer--;
    buyDialog.displayListUpdate();
    buyDialog.render();
}
buyDialog.aDown = function () {
    // console.info('seleted item is:'+buyDialog.getSelectedItem().name);
    var selected = buyDialog.getSelectedItem();
    if (!selected) return;

    this.setVisible(false);
    selectNumDialog.reOpen(function (num) {
        var haveNum = selected.num;
        if (num > haveNum) num = haveNum;

        var moneyGet = selected.item.price * num;
        var msg = '将要卖出' + selected.item.name + num + '个\n总共价值' + moneyGet + '\n确定吗?';

        myAlertDialog.reOpen(msg, function () {
            player.discardItem(selected.item, player, num);
            player.money = player.money + moneyGet;

            mainState.setVisible(true);
            myAlertDialog.bDown();
        }, null, mainState)
    }, this);
}
buyDialog.bDown = function () {
    buyDialog.close();
}


/**数字选择框**/
var selectNumDialog = {
    selecting: 0,//现在指针的位置,0 1 2 3分别是百十个位和确定
    nums: [0, 0, 0, "确定"],//用一个数组来对应位置
    lastState: null,
    group: null,
    style: {
        font: "bold 32px Arial",
        fill: "#4EEE94",
        boundsAlignH: "center",
        boundsAlignV: "middle"
    },
    cb: null
}
selectNumDialog.reOpen = function (cb, lastState) {//道具，A回调函数,上一个状态
    if (!this.group) {
        this.group = game.add.group();
    }

    this.setVisible(true);
    currentCustomState = this;
    this.lastState = lastState || purchaseDialog;
    this.selecting = 0;
    this.nums = [0, 0, 0, "确定"];
    this.cb = cb || function () {
        console.log('什么都不做');
    }
    this.render();
}
selectNumDialog.aDown = function () {
    if (this.selecting == 3) {
        var num = this.nums[0] * 100 + this.nums[1] * 10 + this.nums[2];
        this.setVisible(false);
        this.cb(num);
    }
}
selectNumDialog.render = function () {
    this.group.removeAll(true);

    function showUICorrect(ui) {
        ui.fixedToCamera = true;
        selectNumDialog.group.add(ui);
    }

    var bg = game.add.graphics();
    bg.beginFill(0x000000);
    bg.drawRect(0, 0, 500, 500);
    showUICorrect(bg);

    for (var i = 0; i < 4; i++) {
        var text = game.add.text(0, 0, this.nums[i], this.style);
        text.setTextBounds(i * 125, 100, 125, 300);
        showUICorrect(text);
    }

    var x = this.selecting * 125;
    var y = 100;
    var bar = game.add.graphics();
    bar.beginFill(0xE9967A, 0.2);
    bar.drawRect(x, y, 125, 300);
    showUICorrect(bar);
}
selectNumDialog.bDown = function () {
    this.setVisible(false);
    currentCustomState = this.lastState;
    this.lastState.reOpen();
}
selectNumDialog.goUp = function () {
    var selecting = this.selecting;
    if (selecting == 3) return;//确认键

    this.nums[selecting]++;
    if (this.nums[selecting] > 9) {
        this.nums[selecting] = 0;
    }
    this.render();
}
selectNumDialog.goDown = function () {
    var selecting = this.selecting;
    if (selecting == 3) return;//确认键

    this.nums[selecting]--;
    if (this.nums[selecting] < 0) {
        this.nums[selecting] = 9;
    }
    this.render();
}
selectNumDialog.goLeft = function () {
    this.selecting--;
    if (this.selecting < 0) this.selecting = 3;

    this.render();
}
selectNumDialog.goRight = function () {
    this.selecting++;
    if (this.selecting > 3) this.selecting = 0;

    this.render();
}
selectNumDialog.setVisible = function (visible) {
    this.group.visible = visible;
}
/**
 * Created by zhuo on 2017/9/21.
 * 买入
 */
var saleDialog = new ListBox(8);
saleDialog.group = null;
saleDialog.lastState = null;

saleDialog.reOpen = function (itemList, lastState) {
    if (!this.group) {
        this.group = game.add.group();
    }

    //复用道具菜单
    saleDialog.list = itemList || [{item: Items.apple, num: 9999},{item: Items.excalibur, num: 9999}
    ,{item: Items.ironSword, num: 9999},{item: Items.ironArmour, num: 9999},{item: Items.steelSword, num: 9999}
    ,{item: Items.jewelSword, num: 9999},{item: Items.jewelArmour, num: 9999}];
    saleDialog.lastState = lastState || mainState;
    saleDialog.reset();

    currentCustomState = saleDialog;
    // lastState.setVisible(false);
    saleDialog.setVisible(true);
    saleDialog.render();
}
saleDialog.render = function () {
    var style = menuDialog.font;
    saleDialog.group.removeAll(true);

    var text = game.add.text(0, 0, '道具购入', style);
    text.setTextBounds(0, 5, 500, 25);
    text.fixedToCamera = true;
    saleDialog.group.add(text);

    (function updateTexts() {
        var list = saleDialog.displayList;
        for (var i = list.length - 1; i >= 0; i--) {
            // var text = game.add.text(0, 0, list[i].item.name + '\t X' + list[i].num, style);
            var text = game.add.text(0, 0, list[i].item.name + '\t $'+list[i].item.price*7, style);
            text.setTextBounds(0, i * 55 + 35, 500, 55);
            text.fixedToCamera = true;
            saleDialog.group.add(text);
        }
    })();

    var barY = (saleDialog.thePointer - saleDialog.displayListStart) * 55 + 35;
    var bar = game.add.graphics();
    bar.beginFill(0xCAE1FF, 0.2);
    bar.drawRect(50, barY, 400, 55);
    bar.fixedToCamera = true;
    saleDialog.group.add(bar);
}
saleDialog.setVisible = function (visible) {
    saleDialog.group.visible = visible;
}
saleDialog.close = function () {
    //change current custom state
    currentCustomState = saleDialog.lastState;
    saleDialog.setVisible(false);
    saleDialog.lastState.setVisible(true);
}
saleDialog.goDown = function () {
    saleDialog.thePointer++;
    saleDialog.displayListUpdate();
    saleDialog.render();
}
saleDialog.goUp = function () {
    saleDialog.thePointer--;
    saleDialog.displayListUpdate();
    saleDialog.render();
}
saleDialog.aDown = function () {
    // console.info('seleted item is:'+saleDialog.getSelectedItem().name);
    var selected = saleDialog.getSelectedItem();
    if (!selected) return;

    this.setVisible(false);
    selectNumDialog.reOpen(function (num) {
        var haveNum = selected.num;
        if (num > haveNum) num = haveNum;

        var moneyGet = selected.item.price * num * 7;

        //check money not enough
        if (moneyGet > player.money) {
            var msg = "金钱不足!\n购入"+num+"个需要花费:"+moneyGet;

            myAlertDialog.reOpen(msg, function () {
                mainState.setVisible(true);
                myAlertDialog.bDown();
            }, myAlertDialog.warnFont, mainState)
        } else {
            var msg = '将要买入' + selected.item.name + num + '个\n总共消耗' + moneyGet + '金钱\n确定吗?';

            myAlertDialog.reOpen(msg, function () {
                // player.discardItem(selected.item, player, num);
                player.getItem(selected.item,player,num);
                player.money = player.money - moneyGet;

                mainState.setVisible(true);
                myAlertDialog.bDown();
            }, null, mainState)
        }


    }, this);
}
saleDialog.bDown = function () {
    saleDialog.close();
}
saleDialog.getMenuItem = function () {
    return {
        name: '道具',
        aDown: saleDialog.reOpen,
    }
}
