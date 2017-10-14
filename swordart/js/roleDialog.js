/**
 * Created by zhuo on 2017/9/11.
 */
var roleDialog = new ListBox(8);
roleDialog.group = null;
roleDialog.font = {font: "bold 22px Arial", fill: "#FFFFFF", boundsAlignH: "left", boundsAlignV: "middle"};
roleDialog.font2 = {font: "bold 22px Arial", fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "middle"};
roleDialog.init = function () {
    // roleDialog.group = game.add.group();
    // roleDialog.list.push(Items.stick,Items.egg);
    //从用户背包初始化
}
roleDialog.reOpen = function () {
    if (!roleDialog.group) {
        roleDialog.group = game.add.group();
    }

    //重新更新显示位置
    roleDialog.thePointer = 0;
    roleDialog.displayListStart = 0;
    roleDialog.list = player.equipmentList;
    roleDialog.displayList = roleDialog.list.slice(roleDialog.thePointer, roleDialog.maxDisplayLength);

    //state change
    currentCustomState = roleDialog;
    menuDialog.setVisible(false);
    roleDialog.setVisible(true);
    roleDialog.render();
}
roleDialog.render = function () {
    // var style = menuDialog.font;
    var style = this.font;
    roleDialog.group.removeAll(true);

    function showUICorrect(ui) {
        ui.fixedToCamera = true;
        roleDialog.group.add(ui);
    }

    (function renderPlayerStatus() {
        var padding = 50;
        var text = game.add.text(0, 0, '生命上限\t' + player.maxHealth, style);
        text.setTextBounds(0, 0 * padding, 250, padding);
        showUICorrect(text);
        text = game.add.text(0, 0, '生命值\t' + player.health, style);
        text.setTextBounds(0, 1 * padding, 250, padding);
        showUICorrect(text);
        text = game.add.text(0, 0, '力量\t' + player.pysicPower, style);
        text.setTextBounds(0, 2 * padding, 250, padding);
        showUICorrect(text);
        text = game.add.text(0, 0, '魔力\t' + player.magicPower, style);
        text.setTextBounds(0, 3 * padding, 250, padding);
        showUICorrect(text);
        text = game.add.text(0, 0, '物防\t' + player.pysicDefense, style);
        text.setTextBounds(0, 4 * padding, 250, padding);
        showUICorrect(text);
        text = game.add.text(0, 0, '魔防\t' + player.magicDefense, style);
        text.setTextBounds(0, 5 * padding, 250, padding);
        showUICorrect(text);
        text = game.add.text(0, 0, '速度\t' + player.speed, style);
        text.setTextBounds(0, 6 * padding, 250, padding);
        showUICorrect(text);
        text = game.add.text(0, 0, '装备上限\t' + player.equipmentMaxNum, style);
        text.setTextBounds(0, 7 * padding, 250, padding);
        showUICorrect(text);
        text = game.add.text(0, 0, '携带金钱\t' + player.money, style);
        text.setTextBounds(0, 8 * padding, 250, padding);
        showUICorrect(text);
    })();


    //右侧显示区
    var text = game.add.text(0, 0, "装备中道具", this.font2);
    text.setTextBounds(250, 0, 250, 100);
    showUICorrect(text);

    (function updateEquipments() {
        var list = roleDialog.displayList;
        for (var i = list.length - 1; i >= 0; i--) {
            var text = game.add.text(0, 0, list[i].name, style);
            text.setTextBounds(250, 100+i * 50, 250, 50);
            showUICorrect(text);
        }
    })();

    var barY = 100+(roleDialog.thePointer - roleDialog.displayListStart) * 50;
    var bar = game.add.image(180,barY,'gun',null,roleDialog.group);
    bar.height = 70;
    bar.width = 70;
    bar.fixedToCamera = true;
}
roleDialog.setVisible = function (visible) {
    roleDialog.group.visible = visible;
}
roleDialog.close = function () {
    //change current custom state
    currentCustomState = menuDialog;
    roleDialog.setVisible(false);
    menuDialog.setVisible(true);
}
roleDialog.goDown = function () {
    roleDialog.thePointer++;
    roleDialog.displayListUpdate();
    roleDialog.render();
}
roleDialog.goUp = function () {
    roleDialog.thePointer--;
    roleDialog.displayListUpdate();
    roleDialog.render();
}
roleDialog.aDown = function () {
    console.info('seleted item is:' + roleDialog.getSelectedItem().name);
    var selected = roleDialog.getSelectedItem();
    if (!selected) return;
    equipShowDialog.reOpen(selected);
}
roleDialog.bDown = function () {
    roleDialog.close();
}
roleDialog.getMenuItem = function () {
    return {
        name: '角色',
        aDown: roleDialog.reOpen,
    }
}

/**9.13 装备展示页面**/

var equipShowDialog = new ListBox(5);
equipShowDialog.group = null;
equipShowDialog.currentItem = null;

equipShowDialog.init = function () {
    // equipShowDialog.list.push(Items.stick,Items.egg);
    //从用户背包初始化
}
equipShowDialog.reOpen = function (item) {
    if (!this.group) {
        equipShowDialog.group = game.add.group();
    }

    equipShowDialog.currentItem = item || Items.excalibur;

    //重新更新显示位置
    equipShowDialog.thePointer = 0;
    equipShowDialog.displayListStart = 0;
    equipShowDialog.list = [operItems.takeApart];
    equipShowDialog.displayList = equipShowDialog.list.slice(equipShowDialog.thePointer, equipShowDialog.maxDisplayLength);

    //state change
    currentCustomState = equipShowDialog;
    roleDialog.setVisible(false);
    equipShowDialog.setVisible(true);
    equipShowDialog.render();
}
equipShowDialog.render = function () {
    var item = equipShowDialog.currentItem;

    var style = menuDialog.font;
    equipShowDialog.group.removeAll(true);

    function showUICorrect(ui) {
        ui.fixedToCamera = true;
        equipShowDialog.group.add(ui);
    }

    (function renderPlayerStatus() {
        var padding = 50;
        var text = game.add.text(0, 0, '生命提升\t' + item.maxHealth, style);
        text.setTextBounds(0, 0 * padding, 250, padding);
        showUICorrect(text);
        text = game.add.text(0, 0, '力量值\t' + item.pysicPower, style);
        text.setTextBounds(0, 1 * padding, 250, padding);
        showUICorrect(text);
        text = game.add.text(0, 0, '魔力值\t' + item.magicPower, style);
        text.setTextBounds(0, 2 * padding, 250, padding);
        showUICorrect(text);
        text = game.add.text(0, 0, '物防\t' + item.pysicDefense, style);
        text.setTextBounds(0, 3 * padding, 250, padding);
        showUICorrect(text);
        text = game.add.text(0, 0, '魔防\t' + item.magicDefense, style);
        text.setTextBounds(0, 4 * padding, 250, padding);
        showUICorrect(text);
    })();

    (function updateEquipments() {
        var list = equipShowDialog.displayList;
        for (var i = list.length - 1; i >= 0; i--) {
            var text = game.add.text(0, 0, list[i].name, style);
            text.setTextBounds(250, i * 100, 250, 100);
            showUICorrect(text);
        }
    })();

    var barY = (equipShowDialog.thePointer - equipShowDialog.displayListStart) * 100;
    var bar = game.add.graphics();
    bar.beginFill(0x836FFF, 0.2);
    bar.drawRect(250, barY, 250, 100);
    showUICorrect(bar);
}
equipShowDialog.setVisible = function (visible) {
    equipShowDialog.group.visible = visible;
}
equipShowDialog.close = function () {
    //change current custom state
    currentCustomState = roleDialog;
    equipShowDialog.setVisible(false);
    roleDialog.setVisible(true);
}
equipShowDialog.goDown = function () {
    equipShowDialog.thePointer++;
    equipShowDialog.displayListUpdate();
    equipShowDialog.render();
}
equipShowDialog.goUp = function () {
    equipShowDialog.thePointer--;
    equipShowDialog.displayListUpdate();
    equipShowDialog.render();
}
equipShowDialog.aDown = function () {
    // console.info('seleted item is:'+equipShowDialog.getSelectedItem().name);
    var selected = equipShowDialog.getSelectedItem();
    if (!selected) return;
    selected.confirm(equipShowDialog.currentItem, player, player);

    //重新渲染role菜单
    currentCustomState = roleDialog;
    equipShowDialog.setVisible(false);
    roleDialog.reOpen();
}
equipShowDialog.bDown = function () {
    equipShowDialog.close();
}