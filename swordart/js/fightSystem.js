/**
 * Created by zhuo on 2017/9/13.
 */

var fightState = new ListBox();
fightState.enemies = [];
fightState.fightLog = [];
fightState.lastState = mainState;//上一个场景
fightState.selectWindow = new ListBox();
fightState.inited = false;
fightState.bgImg = null;
fightState.init = function () {
    fightState.list = [operItems.checkEnemies, operItems.use, operItems.skill, operItems.escape];
    fightState.bgGroup = game.add.group();//background image group
    fightState.fightWindowGroup = game.add.group();
    fightState.logWindowGroup = game.add.group();

    //选择窗初始化
    fightState.selectWindow.group = game.add.group();
    fightState.selectWindow.list = [];
    fightState.selectWindow.list.push({
        name: '观察敌人', aDown: function () {
            //观察敌人只弹窗就算了
            fightState.setVisible(false);
            selectEnemyDialog.reOpen(fightState.enemies, fightState, function cb(selectedItem) {
                var message = "名称:" + selectedItem.name +
                    "\n" + selectedItem.desc
                    + "\n物理抗性:" + selectedItem.pysicDefense +
                    "\n魔法抗性:" + selectedItem.magicDefense;
                myAlertDialog.reOpen(message, function () {
                    selectEnemyDialog.setVisible(true);
                    currentCustomState = selectEnemyDialog;
                }, {
                    font: "bold 20px Arial",
                    fill: "#FFAEB9",
                    boundsAlignH: "center",
                    boundsAlignV: "middle"
                }, selectEnemyDialog);
            });
        }
    }, {
        name: '使用道具', aDown: function () {
            fightState.setVisible(false);
            fightItemDialog.reOpen(player.getFightItems());
        }
    }, {
        name: '技能', aDown: function () {
            fightState.setVisible(false);
            skillDialog.reOpen(player.getSkills());
        }
    }, {
        name: '逃跑', aDown: function () {
            fightState.setVisible(false);
            myAlertDialog.reOpen('确定逃跑?\n\n需要计算成功率\n有失败可能', function cb() {
                currentCustomState = fightState;
                fightState.setVisible(true);
                fightState.escape();
            }, null, fightState);
        }
    });
    fightState.selectWindow.reset();

    //set bg img
    this.bgImg = game.add.image(0,0,'mahojin',null,this.bgGroup);
    this.bgImg.height = 500;
    this.bgImg.width = 500;
    this.bgGroup.visible = false;
    this.bgGroup.fixedToCamera = true;

    this.inited = true;
}

fightState.escape = function () {
    var escapeSpeed = player.speed;
    var enemiesSpeed = 0;
    for (var i = this.enemies.length - 1; i >= 0; i--) {
        enemiesSpeed += this.enemies[i].speed;
    }
    if (escapeSpeed > enemiesSpeed) {//脱离战斗
        this.setVisible(false);
        currentCustomState = mainState;
        mainState.setVisible(true);
    } else {
        this.addLog('逃跑失败!')
        this.playerTurnOver();
    }
}

fightState.reOpen = function (enemies, lastState) {
    if(!fightState.inited){
        this.init();
    }

    fightState.enemies = enemies || [];
    fightState.lastState = lastState || mainState;
    fightState.turnNum = 0;//回合数


    //清空log
    this.fightLog.splice(0, this.fightLog.length);

    this.addLog('进入战斗！ 遭遇' + enemies.length + '个敌人!');

    this.judgeFirstFight();
    this.newTurnStart();//新回合开始

    //change state
    fightState.lastState.setVisible(false);
    mainState.setVisible(false);
    currentCustomState = fightState;
    fightState.setVisible(true);
    fightState.reRender();
}
fightState.reRender = function () {
    // console.info("I want to re-render");
    this.renderFightWindow();


    this.renderLogWindow();
    //reset
    this.selectWindow.reset();
    this.renderSelectWindow();
}
//每次渲染调用
fightState.renderFightWindow = function () {
    // console.info("I want to render fight scene");

    fightState.fightWindowGroup.removeAll(true);

    var leftStyle = {font: "bold 20px Arial", fill: "#9AFF9A", boundsAlignH: "left", boundsAlignV: "middle"};
    var rightStyle = {font: "bold 20px Arial", fill: "#FFB5C5", boundsAlignH: "right", boundsAlignV: "middle"};
    var titleStyle = {font: "bold 22px Arial", fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "middle"};

    //场景名称
    var text = game.add.text(0, 0, "战斗场景", titleStyle);
    text.setTextBounds(0, 0, 500, 50);
    text.fixedToCamera = true;
    fightState.fightWindowGroup.add(text);

    //渲染玩家
    var text = game.add.text(0, 0, player.name + '\t HP:' + player.health + '/' + player.maxHealth, leftStyle);
    text.setTextBounds(10, 50, 230, 50);
    text.fixedToCamera = true;
    fightState.fightWindowGroup.add(text);

    //渲染怪物
    (function renderMonsterList() {
        var list = fightState.enemies;
        for (var i = 0; i < list.length; i++) {
            var the = list[i];
            var text = game.add.text(0, 0, 'HP:' + the.health + '/' + the.maxHealth + '\t' + the.name, rightStyle);
            text.setTextBounds(260, i * 50 + 50, 230, 50);
            text.fixedToCamera = true;
            fightState.fightWindowGroup.add(text);
        }
    })();

}
fightState.renderLogWindow = function () {
    var startX = 0;
    var startY = 250;


    fightState.logWindowGroup.removeAll(true);

    var style = {font: "bold 14px Arial", fill: "#9AFF9A", boundsAlignH: "left", boundsAlignV: "middle"};

    var logStart = fightState.fightLog.length - 8;
    if (logStart < 0) logStart = 0;
    var logList = fightState.fightLog.slice(logStart, fightState.fightLog.length);
    //渲染记录
    (function renderMonsterList() {
        var list = logList;
        for (var i = 0; i < logList.length; i++) {
            var text = game.add.text(0, 0, list[i].msg, style);
            text.setTextBounds(startX + 5, i * 30 + startY, 235, 30);
            text.fixedToCamera = true;
            fightState.logWindowGroup.add(text);
        }
    })();
}
fightState.renderSelectWindow = function () {
    var startX = 250;
    var startY = 250;

    var group = this.selectWindow.group;
    group.removeAll(true);

    var style = {font: "bold 14px Arial", fill: "#fff", boundsAlignH: "right", boundsAlignV: "middle"};

    var list = this.selectWindow.displayList;

    //渲染选项
    (function renderSelections() {
        for (var i = 0; i < list.length; i++) {
            var text = game.add.text(0, 0, list[i].name, style);
            text.setTextBounds(startX + 5, i * 50 + startY, 235, 50);
            text.fixedToCamera = true;
            group.add(text);
        }
    })();

    //渲染选择条
    var barY = startY + (this.selectWindow.thePointer - this.selectWindow.displayListStart) * 50;
    var bar = game.add.graphics();
    bar.beginFill(0x9AFF9A, 0.2);
    bar.drawRect(startX, barY, 235, 50);
    bar.fixedToCamera = true;
    group.add(bar);
}

fightState.setVisible = function (visible) {
    fightState.fightWindowGroup.visible = visible;
    fightState.logWindowGroup.visible = visible;
    fightState.selectWindow.group.visible = visible;

    fightState.bgGroup.visible = visible;
}
fightState.close = function () {
    //change current custom state
    fightState.setVisible(false);
    currentCustomState = this.lastState;
    this.lastState.reOpen();
}
fightState.goDown = function () {
    fightState.selectWindow.thePointer++;
    fightState.selectWindow.displayListUpdate();
    fightState.renderSelectWindow();
}
fightState.goUp = function () {
    fightState.selectWindow.thePointer--;
    fightState.selectWindow.displayListUpdate();
    fightState.renderSelectWindow();
}
fightState.aDown = function () {
    var selected = fightState.selectWindow.getSelectedItem();
    if (!selected)return;
    this.setVisible(false);
    selected.aDown();
    // console.info('I selected: '+selected.name);
}
fightState.bDown = function () {
    // fightState.close();
    return;
}

fightState.newTurnStart = function () {
    this.turnNum++;
    this.addLog('------回合' + this.turnNum + '开始------');

    this.enemyFight(this.fastThanPlayer);//先手怪物

    this.renderLogWindow();
    this.renderFightWindow();

    if (player.health < 1) {
        this.close();
        mainState.gameReset();
    }
}

fightState.clear = function () {

}

fightState.playerTurnOver = function () {
    //check fight over
    if (fightState.checkFightOver()) {
        return;
    }

    this.enemyFight(this.slowThanPlayer);
    this.renderFightWindow();
    this.renderLogWindow();


    if (player.health < 1) {
        console.log('你死了,health:'+player.health);
        this.close();
        mainState.gameReset();
        // myAlertDialog.reOpen('你死了', function () {
        //     myAlertDialog.bDown();
        // }, null, mainState);

        return;
    }

    // this.addLog('-------回合结束-------');


    this.newTurnStart();
}

fightState.checkFightOver = function () {
    for (var i = this.enemies.length - 1; i >= 0; i--) {
        if (this.enemies[i].health > 0)return false;
    }

    //counter exp
    var exp = 0;
    var items = [];
    for (var i = this.enemies.length - 1; i >= 0; i--) {
        exp += this.enemies[i].exp;
        items = items.concat(this.enemies[i].items);
    }

    //掉落道具
    var itemsLog = '获得道具:';
    for (var i = items.length - 1; i >= 0; i--) {
        itemsLog = itemsLog + items[i].name + ' ';
        player.getItem(items[i]);
    }

    this.close();
    // myAlertDialog.reOpen('获得经验:' + exp + '\n' + itemsLog, function () {
    myAlertDialog.reOpen(itemsLog, function () {
        myAlertDialog.bDown();
    }, null, mainState);

    return true;
}

fightState.judgeFirstFight = function () {
    var fastThanPlayer = [];
    var slowThanPlayer = [];
    var speed = player.speed;
    var enemies = this.enemies;

    for (var i = enemies.length - 1; i >= 0; i--) {
        if (enemies[i].speed < speed) {
            slowThanPlayer.push(enemies[i]);
        } else {
            fastThanPlayer.push(enemies[i]);
        }
    }
    this.fastThanPlayer = fastThanPlayer;
    this.slowThanPlayer = slowThanPlayer;
}

fightState.enemyFight = function (enemies) {
    for (var i = enemies.length - 1; i >= 0; i--) {
        if (enemies[i].isLiving) enemies[i].fuckPlayer();
    }
}

fightState.addLog = function (msg) {
    this.fightLog.push({msg: msg});
}

fightState.damageAnimaOn = function (num) {
    console.log('开始播放动画');

    //创建一个短时动画
    var damageAnima = game.add.sprite(350,50+50*num-10,'damage1',null,fightState.fightWindowGroup);
    damageAnima.fixedToCamera = true;
    damageAnima.animations.add('fuck',[1,2,3,4,5]);
    damageAnima.play('fuck',null,true);
    damageAnima.height = 60;
    damageAnima.width = 60;
    game.time.events.add(Phaser.Timer.HALF * 1, function () {
        damageAnima.destroy();
    }, this);
}
