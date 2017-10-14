/**
 * Created by zhuo on 2017/9/17.
 */
class Enemy extends LiveObject {
    constructor(name, mh, pp, mp, pd, md, speed, exp,desc) {
        super(name, mh, pp, mp, pd, md, speed);
        this.exp = exp || 1;
        this.isLiving = true;
        this.items = [];//携带道具
        this.desc = desc || '管理员忘记描述了';
    }

    effectFromInFight(item, src) {
        if (item.effective) {
            item.effective(this, src);
        }
        this.checkDeath();
    }

    effectFromSkill(skill, src) {
        if (skill.effective) {
            skill.effective(this, src);
        }
        this.checkDeath();
    }

    checkDeath() {
        if (this.health < 1) {
            this.isLiving = false;
        }
    }

    fuckPlayer() {//AI逻辑
        var skill = Skills.normalPysicAttack;
        player.effectFromSkill(skill);
        fightState.addLog(this.name + '对' + player.name + '释放了:' + skill.name);
    }
}

var Monsters = {
    king: new Enemy('开挂哥布林', 20, 9, 3, 3, 3, 1, 10,"不是哥布林，是开挂的哥布林"),
    king2: new Enemy('会念诗的史莱姆', 20, 3, 9, 3, 3, 14, 10,"不是史莱姆，是会念诗的史莱姆"),
    poet: new Enemy('吟游诗人的灵魂', 50, 3, 12, 8, 5, 18, 10,'被诅咒囚禁的亡者灵魂'),
    priest: new Enemy('圣堂牧师的灵魂', 50, 12, 3, 5, 8, 18, 10,'被诅咒囚禁的亡者灵魂'),
    swimmer: new Enemy('穿泳衣的灵魂', 70, 9, 5, 0, 6, 18, 10,'被诅咒囚禁的亡者灵魂'),
    peopleFishing: new Enemy('钓鱼的人', 70, 5, 9, 6, 10, 18, 10,'只是钓鱼的人而已'),
    king2: new Enemy('会念诗的史莱姆', 20, 3, 9, 3, 3, 14, 10,"不是史莱姆，是会念诗的史莱姆"),
    goblin: new Enemy('哥布林', 10, 3, 3, 3, 3, 2, 2,"普通的哥布林"),
    slime: new Enemy('史莱姆', 10, 3, 3, 3, 3, 2, 2,"普通的史莱姆"),
    bossOfOne: new Enemy('卡在墙里的死神', 99, 12, 12, 5, 5, 4, 100,"不是死神，是卡在墙里的死神"),
    TheCain: new Enemy('该隐', 9999, 0, 0, 0, 0, 0, 100,'"永远与须臾的罪人"'),
}

//第一层
Monsters.king.fuckPlayer = function () {
    var skill = Skills.normalPysicAttack;
    // player.effectFromSkill(skill);
    fightState.addLog(this.name + '对' + player.name + '释放了:' + skill.name);
    skill.effective(player, this);
}
Monsters.king2.fuckPlayer = function () {
    var skill = Skills.normalMagicAttack;
    fightState.addLog(this.name + '对' + player.name + '释放了:' + skill.name);
    skill.effective(player, this);
}
Monsters.goblin.fuckPlayer = function () {
    var skill = Skills.normalPysicAttack;
    fightState.addLog(this.name  + '释放了:' + skill.name);
    skill.effective(player, this);
}
Monsters.slime.fuckPlayer = function () {
    var skill = Skills.normalMagicAttack;
    fightState.addLog(this.name + '释放了:' + skill.name);
    skill.effective(player, this);
}
Monsters.bossOfOne.fuckPlayer = function () {
    var skill = Skills.frameDeathChop;
    fightState.addLog(this.name + '释放了:' + skill.name);
    skill.effective(player, this);
}
Monsters.bossOfOne.checkDeath = function () {
    Enemy.prototype.checkDeath.call(this);
    if (!this.isLiving) {
        var theBossTile = Maps.plain1.obj_tile_map[20][21];
        theBossTile.isStone = false;
        theBossTile.beInterestedCallback = function () {
            myAlertDialog.reOpen('现在你可以通过这里',function () {
                myAlertDialog.bDown();
            });
        };
        Maps.mapInfo.plain1.bossKilledFlag = true;
        //改变地图显示
        Maps.plain1.map.putTile(null,20,21,Maps.plain1.layer_objs);
        Maps.plain1.map.putTile(null,20,20,Maps.plain1.layer_objs);
    }
}
Monsters.TheCain.fuckPlayer = function () {
    fightState.addLog('审判者对伤害来源施加了审判');
    var damageSuffered = this.maxHealth - this.health;
    console.log('收到伤害: '+damageSuffered* 7);
    player.damageFrom(0,0,damageSuffered * 7);
}
Monsters.TheCain.checkDeath = function () {
    Enemy.prototype.checkDeath.call(this);
    if (!this.isLiving) {
        var theBossTile = Maps.floor3.obj_tile_map[20][22];
        theBossTile.isStone = false;
        theBossTile.beInterestedCallback = function () {
            myAlertDialog.reOpen('现在你可以通过这里',function () {
                myAlertDialog.bDown();
            });
        };
        Maps.mapInfo.plain1.bossKilledFlag = true;
        //改变地图显示
        Maps.floor3.map.putTile(null,20,20,Maps.floor3.objLayer);
        Maps.floor3.map.putTile(null,20,21,Maps.floor3.objLayer);
        Maps.floor3.map.putTile(null,20,22,Maps.floor3.objLayer);
        //摘除玩家装备
        player.discardEquipment(Items.curseOfAbe);
        player.discardItem(Items.curseOfAbe);
    }
}
Monsters.poet.fuckPlayer = function () {
    var skill = Skills.normalMagicAttack;
    fightState.addLog(this.name + '释放了:' + skill.name);
    skill.effective(player, this);
}
Monsters.priest.fuckPlayer = function () {
    var skill = Skills.normalPysicAttack;
    fightState.addLog(this.name + '释放了:' + skill.name);
    skill.effective(player, this);
}
Monsters.swimmer.fuckPlayer = function () {
    var skill = Skills.normalPysicAttack;
    fightState.addLog(this.name + '释放了:' + skill.name);
    skill.effective(player, this);
}
Monsters.peopleFishing.fuckPlayer = function () {
    var skill = Skills.normalMagicAttack;
    fightState.addLog(this.name + '释放了:' + skill.name);
    skill.effective(player, this);
}