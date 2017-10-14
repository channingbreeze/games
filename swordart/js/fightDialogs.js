/**
 * Created by zhuo on 2017/9/16.
 */

/**
 * Created by zhuo on 2017/9/3.
 */

var selectEnemyDialog = new ListBox(5);
selectEnemyDialog.group = null;
selectEnemyDialog.lastState = null;
selectEnemyDialog.cb = null;//选择后需要做的事情
selectEnemyDialog.init = function () {
    selectEnemyDialog.group = game.add.group();
}
selectEnemyDialog.reOpen = function (itemList, lastState, cb) {
    if(!selectEnemyDialog.group){
        selectEnemyDialog.group = game.add.group();
    }

    selectEnemyDialog.list = itemList || player.itemList;
    selectEnemyDialog.lastState = lastState || fightState;
    selectEnemyDialog.cb = cb || function () {
            var selected = selectEnemyDialog.getSelectedItem();
            if (!selected)return;
            console.info('seleted item is:' + selectEnemyDialog.getSelectedItem().name);
        }

    selectEnemyDialog.reset();

    currentCustomState = selectEnemyDialog;
    selectEnemyDialog.lastState.setVisible(false);
    selectEnemyDialog.setVisible(true);
    selectEnemyDialog.render();
}
selectEnemyDialog.render = function () {
    this.group.removeAll(true);

    var style = {font: "bold 22px Arial", fill: "#FFB5C5", boundsAlignH: "right", boundsAlignV: "middle"};
    var titleStyle = {font: "bold 22px Arial", fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "middle"};

    //场景名称
    var text = game.add.text(0, 0, "选择目标敌人", titleStyle);
    text.setTextBounds(0, 0, 500, 50);
    text.fixedToCamera = true;
    this.group.add(text);

    //渲染怪物名称
    (function renderMonsterList() {
        var list = selectEnemyDialog.displayList;
        for (var i = 0; i < list.length; i++) {
            var text = game.add.text(0, 0, list[i].name, style);
            text.setTextBounds(50, i * 50 + 50, 400, 50);
            text.fixedToCamera = true;
            selectEnemyDialog.group.add(text);
        }
    })();

    //渲染选择条
    var barY = 50 + (this.thePointer - this.displayListStart) * 50;
    var bar = game.add.graphics();
    bar.beginFill(0x9AFF9A, 0.2);
    bar.drawRect(50, barY, 400, 50);
    bar.fixedToCamera = true;
    this.group.add(bar);
}
selectEnemyDialog.setVisible = function (visible) {
    selectEnemyDialog.group.visible = visible;
}
selectEnemyDialog.close = function () {
    //change current custom state
    currentCustomState = selectEnemyDialog.lastState;
    selectEnemyDialog.setVisible(false);
    selectEnemyDialog.lastState.setVisible(true);
}
selectEnemyDialog.goDown = function () {
    selectEnemyDialog.thePointer++;
    selectEnemyDialog.displayListUpdate();
    selectEnemyDialog.render();
}
selectEnemyDialog.goUp = function () {
    selectEnemyDialog.thePointer--;
    selectEnemyDialog.displayListUpdate();
    selectEnemyDialog.render();
}
selectEnemyDialog.aDown = function () {//为了可重用，可传入一个callback函数
    var selected = this.getSelectedItem();
    if (!selected) {
        console.warn('选择出错');
        return;
    }
    this.setVisible(false);
    this.cb(selected);
}
selectEnemyDialog.bDown = function () {
    selectEnemyDialog.close();
}

/**
 * 2017.9.16 战斗道具窗口
 */
var fightItemDialog = new ListBox(5);
fightItemDialog.group = null;
fightItemDialog.lastState = null;
fightItemDialog.init = function () {
}
fightItemDialog.reOpen = function (itemList, lastState) {
    if(!this.group){
        fightItemDialog.group = game.add.group();
    }

    //复用道具菜单
    fightItemDialog.list = itemList || player.getFightItems();
    fightItemDialog.lastState = lastState || fightState;
    fightItemDialog.reset();

    currentCustomState = fightItemDialog;
    // lastState.setVisible(false);
    fightItemDialog.lastState.setVisible(false);
    fightItemDialog.setVisible(true);
    fightItemDialog.render();
}
fightItemDialog.render = function () {
    fightItemDialog.group.removeAll(true);
    var leftStyle = {font: "bold 22px Arial", fill: "#9AFF9A", boundsAlignH: "left", boundsAlignV: "top"};
    // var rightStyle = {font: "bold 22px Arial", fill: "#FFB5C5", boundsAlignH: "right", boundsAlignV: "middle"};
    var titleStyle = {font: "bold 22px Arial", fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "middle"};

    //左边展示部分
    var selected = this.getSelectedItem();
    if (!selected) {
        return
    }
    var text = game.add.text(0, 0, selected.desc, leftStyle);
    text.setTextBounds(25, 0, 200, 500);
    text.fixedToCamera = true;
    fightItemDialog.group.add(text);

    //右边选择框
    (function updateTexts() {
        var list = fightItemDialog.displayList;
        for (var i = list.length - 1; i >= 0; i--) {
            var text = game.add.text(0, 0, list[i].name, titleStyle);
            text.setTextBounds(250, i * 100, 250, 100);
            text.fixedToCamera = true;
            fightItemDialog.group.add(text);
        }
    })();

    var barY = (fightItemDialog.thePointer - fightItemDialog.displayListStart) * 100;
    var bar = game.add.graphics();
    bar.beginFill(0xFFAEB9, 0.2);
    bar.drawRect(250, barY, 250, 100);
    bar.fixedToCamera = true;
    fightItemDialog.group.add(bar);
}
fightItemDialog.setVisible = function (visible) {
    fightItemDialog.group.visible = visible;
}
fightItemDialog.close = function () {
    //change current custom state
    currentCustomState = fightItemDialog.lastState;
    fightItemDialog.setVisible(false);
    fightItemDialog.lastState.setVisible(true);
}
fightItemDialog.goDown = function () {
    fightItemDialog.thePointer++;
    fightItemDialog.displayListUpdate();
    fightItemDialog.render();
}
fightItemDialog.goUp = function () {
    fightItemDialog.thePointer--;
    fightItemDialog.displayListUpdate();
    fightItemDialog.render();
}
fightItemDialog.aDown = function () {
    //选择怪物窗口
    this.setVisible(false);
    selectEnemyDialog.reOpen(fightState.enemies, this, this.useItemCallBack);
}
fightItemDialog.useItemCallBack = function (selectedEnemy) {
    var selectedItem = fightItemDialog.getSelectedItem();
    if (!selectedItem)return;

    selectedEnemy.effectFromInFight(selectedItem, player);

    //从背包中删除
    player.discardItem(selectedItem);

    //state change
    currentCustomState = fightState;
    fightItemDialog.setVisible(false);
    fightState.setVisible(true);

    //结束该回合
    fightState.playerTurnOver();

}
fightItemDialog.bDown = function () {
    fightItemDialog.close();
}

/**
 * 2017.9.17 技能窗口
 */
var skillDialog = new ListBox(5);
skillDialog.group = null;
skillDialog.lastState = null;
skillDialog.reOpen = function (skillList, lastState) {
    if (!this.group) {//init
        skillDialog.group = game.add.group();
    }

    skillDialog.list = skillList || player.getSkills();
    skillDialog.lastState = lastState || fightState;
    skillDialog.reset();

    currentCustomState = skillDialog;
    // lastState.setVisible(false);
    skillDialog.lastState.setVisible(false);
    skillDialog.setVisible(true);
    skillDialog.render();
}
skillDialog.render = function () {
    skillDialog.group.removeAll(true);
    var leftStyle = {font: "bold 22px Arial", fill: "#9AFF9A", boundsAlignH: "left", boundsAlignV: "top"};
    // var rightStyle = {font: "bold 22px Arial", fill: "#FFB5C5", boundsAlignH: "right", boundsAlignV: "middle"};
    var titleStyle = {font: "bold 22px Arial", fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "middle"};

    //左边展示部分
    var text = game.add.text(0, 0, this.getSelectedItem().desc, leftStyle);
    text.setTextBounds(25, 0, 200, 500);
    text.fixedToCamera = true;
    skillDialog.group.add(text);

    //右边选择框
    (function updateTexts() {
        var list = skillDialog.displayList;
        for (var i = list.length - 1; i >= 0; i--) {
            var text = game.add.text(0, 0, list[i].name, titleStyle);
            text.setTextBounds(250, i * 100, 250, 100);
            text.fixedToCamera = true;
            skillDialog.group.add(text);
        }
    })();

    var barY = (skillDialog.thePointer - skillDialog.displayListStart) * 100;
    var bar = game.add.graphics();
    bar.beginFill(0xFFAEB9, 0.2);
    bar.drawRect(250, barY, 250, 100);
    bar.fixedToCamera = true;
    skillDialog.group.add(bar);
}
skillDialog.setVisible = function (visible) {
    skillDialog.group.visible = visible;
}
skillDialog.close = function () {
    //change current custom state
    currentCustomState = skillDialog.lastState;
    skillDialog.setVisible(false);
    skillDialog.lastState.setVisible(true);
}
skillDialog.goDown = function () {
    skillDialog.thePointer++;
    skillDialog.displayListUpdate();
    skillDialog.render();
}
skillDialog.goUp = function () {
    skillDialog.thePointer--;
    skillDialog.displayListUpdate();
    skillDialog.render();
}
skillDialog.aDown = function () {
    // console.info('seleted item is:'+skillDialog.getSelectedItem().name);
    var selectedItem = skillDialog.getSelectedItem();
    if (!selectedItem)return;

    function cb(selectedEnemy) {
        fightState.addLog(player.name + '对' + selectedEnemy.name + '释放了:' + selectedItem.name);
        selectedEnemy.effectFromSkill(selectedItem, player);

        //state change
        currentCustomState = fightState;
        skillDialog.setVisible(false);
        fightState.setVisible(true);
        //结束该回合
        fightState.playerTurnOver();

        //播放伤害动画
        fightState.damageAnimaOn(selectEnemyDialog.thePointer);
    }

    //选择怪物窗口
    this.setVisible(false);
    selectEnemyDialog.reOpen(fightState.enemies, this, cb);
}
skillDialog.bDown = function () {
    skillDialog.close();
}