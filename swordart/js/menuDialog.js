/**
 * Created by zhuo on 2017/9/3.
 */
var menuDialog = new ListBox(5);
menuDialog.textGroup = null;
menuDialog.font = {font: "bold 25px Arial", fill: "#9AFF9A", boundsAlignH: "center", boundsAlignV: "middle"};
menuDialog.inited = false;
menuDialog.init = function () {
    menuDialog.textGroup = game.add.group();
    menuDialog.textGroup.visible = false;

    menuDialog.list = [];
    menuDialog.list.push(roleDialog.getMenuItem());
    menuDialog.list.push(itemDialog.getMenuItem());
    menuDialog.list.push(operItems.save);

    menuDialog.thePointer = 0;
    menuDialog.displayListStart = 0;
    menuDialog.maxDisplayLength = 5;

    //init display list
    menuDialog.displayList = menuDialog.list.slice(0, 5);

    this.inited = true;
};
menuDialog.render = function () {
    var style = menuDialog.font;

    menuDialog.textGroup.removeAll(true);
    (function updateTexts() {
        var list = menuDialog.displayList;
        for (var i = list.length - 1; i >= 0; i--) {
            var text = game.add.text(0, 0, list[i].name, style);
            text.setTextBounds(0, i * 100, 500, 100);
            text.fixedToCamera = true;
            menuDialog.textGroup.add(text);
        }
    })();

    var barY = (menuDialog.thePointer - menuDialog.displayListStart) * 100;
    var bar = game.add.image(50,barY+10,'gun',null,menuDialog.textGroup);
    bar.height = 100;
    bar.width = 100;
    bar.fixedToCamera = true;
};

menuDialog.reOpen = function () {
    if(!this.inited){
        this.init();
    }
    mainState.setVisible(false);
    currentCustomState = this;
    menuDialog.setVisible(true);
    menuDialog.render();
};
menuDialog.setVisible = function (visible) {
    menuDialog.textGroup.visible = visible;
};
menuDialog.goUp = function () {
    menuDialog.thePointer--;
    menuDialog.displayListUpdate();
    menuDialog.render();
};
menuDialog.goDown = function () {
    menuDialog.thePointer++;
    menuDialog.displayListUpdate();
    menuDialog.render();
};
menuDialog.aDown = function () {
    //click OK
    var selected = menuDialog.getSelectedItem();
    console.info('selected item=' + selected.name);
    this.setVisible(false);
    selected.aDown();
};
menuDialog.bDown = function () {
    menuDialog.dialogClose();
};
menuDialog.dialogClose = function () {
    menuDialog.setVisible(false);
    mainState.setVisible(true);
    currentCustomState = mainState;
};
