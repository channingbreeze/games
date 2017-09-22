/**
 * Created by zhuo on 2017/9/11.
 */

class Entity {
    constructor(name) {
        name = name || "你爸爸";
        this.name = name;
    }

    effectFrom(item, src) {
        console.info(this.name + ' effected from item ' + item.name + ' by ' + src.name);
    }

    wearEquipment(item, src) {
        console.info(this.name + ' wear equipment ' + item.name);
    }
}

class LiveObject extends Entity{
    constructor(name,mh,pp,mp,pd,md,speed){
        super(name);
        this.maxHealth = mh || 9999999;
        this.health = this.maxHealth;
        this.pysicPower = pp || 0;
        this.magicPower = mp || 0;
        this.pysicDefense = pd || 0;
        this.magicDefense = md || 0;
        this.speed = speed || 0;
    }

    subProperty(mh, pp, mp, pd, md) {
        this.maxHealth -= mh || 0;
        this.pysicPower -= pp || 0;
        this.magicPower -= mp || 0;
        this.pysicDefense -= pd || 0;
        this.magicDefense -= md || 0;
    }

    addProperty(mh, pp, mp, pd, md) {
        this.maxHealth += mh || 0;
        this.pysicPower += pp || 0;
        this.magicPower += mp || 0;
        this.pysicDefense += pd || 0;
        this.magicDefense += md || 0;
    }

    effectFromItem(item){
        // this.addProperty(item.maxHealth,item.pysicPower,item.magicPower,
        // item.pysicDefense,item.magicDamage);

        //道具生效
        if(item.effective){
            item.effective(this);
        }
    }

    healthChange(damage) {
        damage = damage || 0;
        this.health -= damage;

        if(this.health > this.maxHealth){
            this.health = this.maxHealth;
        }
        // console.info('Life health changed! ' + this.health);

        //log
        // fightState.addLog(this.name+'受到了'+damage+'点伤害');
    }

    damageFrom(pysicDamage,magicDamage,realDamage){
        pysicDamage = pysicDamage || 0;
        magicDamage = magicDamage || 0;
        realDamage = realDamage || 0;
        if (pysicDamage > 0) {//如果是伤害道具
            pysicDamage = pysicDamage - this.pysicDefense;
            if(pysicDamage < 0)pysicDamage = 0;
        }
        if (magicDamage > 0) {//如果是伤害道具
            magicDamage = magicDamage - this.magicDefense;
            if(magicDamage < 0)magicDamage =0;
        }

        // console.log('物理伤害结算后'+pysicDamage+' 魔法伤害结算后:'+magicDamage);
        var sum = pysicDamage+magicDamage+realDamage;
        fightState.addLog(this.name+'受到了'+sum+'点伤害');
        this.healthChange(sum);
    }
}



