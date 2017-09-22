/**
 * Created by zhuo on 2017/9/5.
 */
var operItems = {
    confirm: {name: '确认'},
    use: {
        name: '使用',
        confirm: function (item, src, target) {
            if(target.effectFrom(item, src)){
                myAlertDialog.reOpen('使用成功',function () {
                    myAlertDialog.bDown();
                },null,mainState);
            }
        }
    },
    wear: {
        name: '装备',
        confirm: function (item, src, target) {
            if(target.wearEquipment(item, src)){
                myAlertDialog.reOpen('装备成功',function () {
                    myAlertDialog.bDown();
                },null,mainState);
            }else{
                myAlertDialog.reOpen('装备失败\n超出可装备上限',function () {
                    myAlertDialog.bDown();
                },myAlertDialog.warnFont,mainState);
            }
        }
    },
    discard: {
        name: '丢弃',
        confirm: function (item, src, target) {
            console.info(target.name + "被丢弃了道具:" + item.name);
            target.discardItem(item, src);
        }
    },
    takeApart: {
        name: '卸下装备',
        confirm: function (item, src, target) {
            console.info(target.name + "被拆掉了装备:" + item.name);
            target.discardEquipment(item, src);
        }
    },
    save: {
        name: '存档',
        aDown: function () {
            console.info('存档!');
            myAlertDialog.reOpen('存档成功!', function () {
                MyAchiveManager.saveGame();
                myAlertDialog.bDown();
            }, null, mainState);
        }
    },
    sale: {name: '卖出'},
    buy: {name: '买入'},
    checkEnemies: {name: '观察敌人'},
    skill: {name: '技能'},
    escape: {name: '逃跑'},
}

/**Skills define**/
class Skill {
    constructor(name, desc, skillType, pysicDamageUp, magicDamageUp, realDamage) {
        this.name = name || "普通物理攻击";
        this.desc = desc || "很普通的物理攻击";
        this.skillType = skillType || 1;//1 2 3,物理，魔法，或者都有
        this.pysicDamageUp = pysicDamageUp || 0.0;
        this.magicDamageUp = magicDamageUp || 0.0;
        this.realDamage = realDamage || 1;

        //计数
        Skill.num++;
        this.order = Skill.num;
    }

    effective(target, src) {
        if (!target || !src)return;
        var pd = 0;
        var md = 0;
        if (this.skillType == 1) {
            pd = src.pysicPower + Math.floor(this.pysicDamageUp * src.pysicPower);
        } else if (this.skillType == 2) {
            md = src.magicPower + Math.floor(this.magicDamageUp * src.magicPower);
        } else {
            pd = src.pysicPower + Math.floor(this.pysicDamageUp * src.pysicPower);
            md = src.magicPower + Math.floor(this.magicDamageUp * src.magicPower);
        }
        // console.log('物理伤害结算前'+pd+' 魔法伤害结算前:'+md);
        target.damageFrom(pd, md,this.realDamage);
        // target.healthChange(Math.floor(-this.realDamage));
        // target.health = target.health + this.realDamage;
    }
}
Skill.num = 0;
var Skills = {
    normalPysicAttack: new Skill(),
    normalMagicAttack: new Skill('普通魔法攻击', '很普通的魔法攻击', 2, 0.0, 0.0, 1),
    frameDeathChop: new Skill('烈焰死亡镰刃', '很普通的烈焰死亡镰刃攻击', 3, 0.0, 0.0, 5)
}



/**Items define**/
class Item extends Entity {
    constructor(name, desc, mh, pp, mp, pd, md, pysicDamage, magicDamage, canUseInFight, price) {
        name = name || "你爸爸的圣剑";
        super(name);

        this.desc = desc || "GM专用咖喱棒";
        this.maxHealth = mh || 0;
        this.pysicPower = pp || 0;
        this.magicPower = mp || 0;
        this.pysicDefense = pd || 0;
        this.magicDefense = md || 0;
        this.pysicDamage = pysicDamage || 0;
        this.magicDamage = magicDamage || 0;

        this.canUseInFight = canUseInFight || false;

        this.price = price || 1;//价格

        //计数
        Item.num++;
        this.order = Item.num;
    }

    effective(target, src) {
        if (!target || !src)return;
        fightState.addLog(src.name + '对' + target.name + '使用了道具:' + this.name + ',可是好像没什么用');
    }
}
Item.num = 0;
var Items = {
    stick: new Item("木棍", "一根木棍", 0, 1, 0, 0, 0),
    egg: new Item('鸡蛋', '一个鸡蛋'),
    excalibur: new Item("Excalibur", "一刀999,点击就送", 999, 999, 999, 999, 999, 999, 999, true),
    godHand: new Item("神之手", "物理攻击力挺高的", 0, 5, 0, 0, 0, 0, 0, false,22),
    faQ: new Item("FaQ!", "emmm这是什么?", 0, 0, 5, 0, 0, 0, 0, false,22),
    apple: new Item("苹果", "HP + 20", 0, 0, 0, 0, 0, -20, 0, true,2),
    OSUPlayer: new Item("OSU玩家的头", "只是普通的OSU玩家的头而已", 20, 5, 5, 5, 5, 0, 0, false),
    deathKiller: new Item("死神杀戮者", "残忍杀害死神的证明\n装备后增加额外技能", 0, 9, 5, 0, 0, 0, 0, false),
    coin: new Item("金币", "交易用的金币\n可以卖出好价格"),
}
Items.egg.canUseInFight = true;
Items.apple.effective = function (target, src) {
    if (!target || !src)return;
    fightState.addLog(src.name + '对' + target.name + '使用了道具:' + this.name + ',生命回复了!');
    target.damageFrom(this.pysicDamage, this.magicDamage);
}

Items.coin.price = 10;
//武器技能
Items.deathKiller.skills = [Skills.frameDeathChop];


/** common functions **/
function getItemById(id) {
    for (var name in Items) {
        var item = Items[name];
        if (item.order == id) {
            return item;
        }
    }
}
function getSkillById(id) {
    for (var name in Skills) {
        var skill = Skills[name];
        if (skill.order == id) {
            return skill;
        }
    }
}
