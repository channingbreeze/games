/**
 * Created by zhuo on 2017/9/3.
 */

var itemDialog = new ListBox(8);
itemDialog.group = null;
itemDialog.lastState = null;
itemDialog.init = function () {
    // itemDialog.list.push(Items.stick,Items.egg);
    //从用户背包初始化
    // itemDialog.list = player.itemList;
    // itemDialog.displayList = itemDialog.list.slice(itemDialog.thePointer, itemDialog.maxDisplayLength);
}
itemDialog.reOpen = function (itemList,lastState) {
    if(!itemDialog.group){
        itemDialog.group = game.add.group();
    }

    //复用道具菜单
    itemDialog.list = itemList || player.itemList;
    itemDialog.lastState = lastState || menuDialog;
    itemDialog.reset();

    currentCustomState = itemDialog;
    // lastState.setVisible(false);
    itemDialog.lastState.setVisible(false);
    itemDialog.setVisible(true);
    itemDialog.render();
}
itemDialog.render = function () {
    var style = menuDialog.font;

    itemDialog.group.removeAll(true);
    (function updateTexts() {
        var list = itemDialog.displayList;
        for (var i = list.length - 1; i >= 0; i--) {
            var text = game.add.text(0, 0, list[i].item.name + '\t X' +list[i].num, style);
            text.setTextBounds(0, i * 62, 500, 62);
            text.fixedToCamera = true;
            itemDialog.group.add(text);
        }
    })();

    var barY = (itemDialog.thePointer - itemDialog.displayListStart) * 62;
    var bar = game.add.graphics();
    bar.beginFill(0xB3EE3A, 0.2);
    bar.drawRect(50, barY, 400, 62);
    bar.fixedToCamera = true;
    itemDialog.group.add(bar);
}
itemDialog.setVisible = function (visible) {
    itemDialog.group.visible = visible;
}
itemDialog.close = function () {
    //change current custom state
    currentCustomState = itemDialog.lastState;
    itemDialog.setVisible(false);
    itemDialog.lastState.setVisible(true);
}
itemDialog.goDown = function () {
    itemDialog.thePointer++;
    itemDialog.displayListUpdate();
    itemDialog.render();
}
itemDialog.goUp = function () {
    itemDialog.thePointer--;
    itemDialog.displayListUpdate();
    itemDialog.render();
}
itemDialog.aDown = function () {
    // console.info('seleted item is:'+itemDialog.getSelectedItem().name);
    var selected = itemDialog.getSelectedItem();
    if (!selected)return;
    itemShowDialog.reSetItem(selected.item);
    itemShowDialog.reOpen();
}
itemDialog.bDown = function () {
    itemDialog.close();
}
itemDialog.getMenuItem = function () {
    return {
        name: '道具',
        aDown: itemDialog.reOpen,
    }
}

/**
 * Created by zhuo on 2017/9/5.
 */
var itemShowDialog = new ListBox(5);
itemShowDialog.group = null;
itemShowDialog.currentItem = Items.excalibur;
itemShowDialog.descFont = {font: "bold 22px Arial", fill: "#fff", boundsAlignH: "left", boundsAlignV: "top"};
itemShowDialog.rightFont = {font: "bold 22px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle"};
itemShowDialog.inited = false;

itemShowDialog.init = function () {
    itemShowDialog.group = game.add.group();
    // itemShowDialog.list = itemShowDialog.currentItem.opers.slice();
    itemShowDialog.list = [operItems.use, operItems.wear, operItems.discard];
    itemShowDialog.displayList = itemShowDialog.list.slice(itemShowDialog.thePointer, itemShowDialog.maxDisplayLength);

    this.inited = true;
}
itemShowDialog.reSetItem = function (item) {
    itemShowDialog.currentItem = item || Items.excalibur;
    // itemShowDialog.list = itemShowDialog.currentItem.opers.slice();
    itemShowDialog.list = [operItems.use, operItems.wear, operItems.discard];
    itemShowDialog.thePointer = 0;
    itemShowDialog.displayListStart = 0;
    itemShowDialog.displayList = itemShowDialog.list.slice(itemShowDialog.thePointer, itemShowDialog.maxDisplayLength);
}
itemShowDialog.reOpen = function (item) {
    if(!this.inited){
        itemShowDialog.init();
    }

    currentCustomState = itemShowDialog;
    itemDialog.setVisible(false);
    itemShowDialog.setVisible(true);
    itemShowDialog.render();
}
itemShowDialog.render = function () {
    itemShowDialog.group.removeAll(true);

    var leftStyle = itemShowDialog.descFont;
    var rightStyle = itemShowDialog.rightFont;

    //黑框
    // game.add.graphics().beginFill(0x000000,1).drawRect(0,0,500,500);

    //左边描述栏
    var desc = game.add.text(0, 0, itemShowDialog.currentItem.desc, leftStyle);
    desc.setTextBounds(0, 0, 250, 250);
    desc.fixedToCamera = true;
    itemShowDialog.group.add(desc);

    //右边选择栏
    (function updateTexts() {
        var list = itemShowDialog.displayList;
        for (var i = list.length - 1; i >= 0; i--) {
            var text = game.add.text(0, 0, list[i].name, rightStyle);
            text.setTextBounds(250, i * 100, 250, 100);
            text.fixedToCamera = true;
            itemShowDialog.group.add(text);
        }
    })();

    var barY = (itemShowDialog.thePointer - itemShowDialog.displayListStart) * 100;
    var bar = game.add.graphics();
    bar.beginFill(0xFFFFFF, 0.2);
    bar.drawRect(250, barY, 250, 100);
    bar.fixedToCamera = true;
    itemShowDialog.group.add(bar);
}
itemShowDialog.setVisible = function (visible) {
    itemShowDialog.group.visible = visible;
}
itemShowDialog.close = function () {
    //change current custom state
    currentCustomState = itemDialog;
    itemShowDialog.setVisible(false);
    itemDialog.setVisible(true);
}
itemShowDialog.goDown = function () {
    itemShowDialog.thePointer++;
    itemShowDialog.displayListUpdate();
    itemShowDialog.render();
}
itemShowDialog.goUp = function () {
    itemShowDialog.thePointer--;
    itemShowDialog.displayListUpdate();
    itemShowDialog.render();
}
itemShowDialog.aDown = function () {
    var selected = itemShowDialog.getSelectedItem();
    if (!selected)return;
    itemShowDialog.setVisible(false);
    myAlertDialog.reOpen('确认?',function cb() {
        myAlertDialog.bDown();
        selected.confirm(itemShowDialog.currentItem, player, player);
    })
}
itemShowDialog.bDown = function () {
    itemShowDialog.close();
}
