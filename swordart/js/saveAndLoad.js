/**
 * Created by zhuo on 2017/9/21.
 */
var MyAchiveManager = {
    //加载存档
    loadArchives: function () {
        //加载地图
        var mapInfo = localStorage.getItem('map');
        if (!mapInfo) {
            Maps['plain1'].init();
        } else {
            mapInfo = JSON.parse(mapInfo)

            //同步存档数据
            if(!mapInfo.floor3){//没有同步第三层
                mapInfo.floor3 = {
                    item0BeTook: false,//该隐的诅咒是否被拿走
                    bossKilledFlag: false,
                }
            }

            Maps.mapInfo = mapInfo;
            Maps[mapInfo.currentFloor].init();
        }

        this.loadPlayerInfo();
    },

    loadPlayerInfo: function () {
        //加载玩家
        var playerMetaData = JSON.parse(localStorage.getItem('player'));
        if (!playerMetaData) {
            //玩家初始状态
            player.itemList = [{item: Items.egg, num: 1}, {item: Items.stick, num: 1}];
            player.equipmentList = [];
            player.equipmentMaxNum = 5;//最多五件装备
            player.skills = [Skills.normalMagicAttack, Skills.normalPysicAttack];
            player.money = 1;
        } else {
            player.health = playerMetaData.health;
            player.maxHealth = playerMetaData.maxHealth;
            player.pysicPower = playerMetaData.pysicPower;
            player.magicPower = playerMetaData.magicPower;
            player.pysicDefense = playerMetaData.pysicDefense;
            player.magicDefense = playerMetaData.magicDefense;
            player.speed = playerMetaData.speed;
            player.equipmentMaxNum = playerMetaData.equipmentMaxNum;
            player.money = playerMetaData.money;

            // player.itemList = [{item: Items.egg, num: 1}, {item: Items.stick, num: 1}];
            //load items
            var itemList = playerMetaData.itemList;
            player.itemList = [];
            for (var i = itemList.length - 1; i >= 0; i--) {
                var item = itemList[i];
                var itemOfItem = getItemById(item.order);
                player.itemList.push({
                    num: item.num,
                    item: itemOfItem
                })
            }

            var equips = playerMetaData.equipmentList;
            player.equipmentList = [];
            for (var i = equips.length - 1; i >= 0; i--) {
                var equipId = equips[i].order;
                var equip = getItemById(equipId);
                player.equipmentList.push(equip);
            }

            // player.equipmentList = [];
            // player.skills = [Skills.normalMagicAttack, Skills.normalPysicAttack];
            var skills = playerMetaData.skills;
            player.skills = [];
            for (var i = skills.length - 1; i >= 0; i--) {
                var skillId = skills[i].order;
                var skill = getSkillById(skillId);
                player.skills.push(skill);
            }

            console.info('读取成功');
        }
    },

    saveGame: function () {
        var playerMetaData = {};
        playerMetaData.health = player.health;
        playerMetaData.maxHealth = player.maxHealth;
        playerMetaData.pysicPower = player.pysicPower;
        playerMetaData.magicPower = player.magicPower;
        playerMetaData.pysicDefense = player.pysicDefense;
        playerMetaData.magicDefense = player.magicDefense;
        playerMetaData.speed = player.speed;
        playerMetaData.equipmentMaxNum = player.equipmentMaxNum;
        playerMetaData.money = player.money;

        playerMetaData.skills = [];
        //储存技能编号
        for (var i = player.skills.length - 1; i >= 0; i--) {
            playerMetaData.skills.push({
                order: player.skills[i].order
            });
        }

        playerMetaData.itemList = [];
        for (var i = player.itemList.length - 1; i >= 0; i--) {
            var item = player.itemList[i];
            playerMetaData.itemList.push({
                num: item.num,
                order: item.item.order
            });
        }

        playerMetaData.equipmentList = [];
        for (var i = player.equipmentList.length - 1; i >= 0; i--) {
            var item = player.equipmentList[i];
            playerMetaData.equipmentList.push({
                order: item.order
            });
        }

        // console.info(JSON.stringify(playerMetaData));
        localStorage.setItem('player', JSON.stringify(playerMetaData));


        //储存地图
        var mapInfo = Maps.mapInfo;
        localStorage.setItem('map', JSON.stringify(mapInfo));
    }
}