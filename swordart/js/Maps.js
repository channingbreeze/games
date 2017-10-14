/**
 * Created by zhuo on 2017/9/13.
 */
function Map(name, stoneMap, playerPosition) {
    this.name = name || "无名地图";
    this.stoneMap = stoneMap || [0];
    this.playerPosition = playerPosition || {x: 0, y: 0};
    this.map = null;
}
Map.prototype.init = function () {
    console.info('Map:' + this.name + '准备初始化');
}
Map.prototype.initObjsTileMap = function (numMap, height, width, cb) {
    var obj_tile_map = [];
    for (var i = height - 1; i >= 0; i--) {
        obj_tile_map[i] = [];
    }

    for (var i = numMap.length - 1; i >= 0; i--) {
        var col = i % width;
        var row = Math.floor(i / width);
        obj_tile_map[col][row] = cb(numMap[i]);
    }

    return obj_tile_map;
}

var Maps = {
    plain1: new Map('安塔林斯平原', stonesMap.plain1, {x: 2, y: 0}),
    shop: new Map('商店', stonesMap.shop, {x: 2, y: 2}),
    floor3: new Map('命运坟场', stonesMap.floor3, {x: 2, y: 0}),
    mapInfo: {
        currentFloor: null,
        plain1: {
            item1BeUsed: false,//OSU是否被拿走
            bossKilledFlag: false,
        },
        floor3: {
            item0BeTook: false,//该隐的诅咒是否被拿走
            bossKilledFlag: false,
        }
    }//储存的地图信息
}
Maps.changeMap = function (name) {
    map.destroy();
    map = Maps[name];
    map.init();

    player.fixCamera();
}

Maps.plain1.init = function (playerPosition) {
    //init obj map
    this.initObjsTileMap(this.stoneMap);

    this.map = game.add.tilemap('tile_map');

    // link loaded tileset image to map
    this.map.addTilesetImage('west_rpg', 'tiles1');
    this.map.addTilesetImage('the_man_set', 'tiles2');

    // create laye for said tileset and map now!
    this.layer_glass = this.map.createLayer('glass');
    this.layer_lava = this.map.createLayer('lava');
    this.layer_bridge = this.map.createLayer('bridge');
    this.layer_lives = game.add.group();//player in
    this.layer_objs = this.map.createLayer('objs');

    //set current map
    map = this;

    //resize world
    map.resizeWorld();


    this.playerPosition = playerPosition || this.playerPosition;
    //加载玩家砖块
    map.initPlayerTile();

    //fix camera
    game.camera.follow(player.tile.texture);

    //根据储存的地图信息来重置某些特性:比如只能刷一次的怪
    Maps.mapInfo.currentFloor = 'plain1';
    this.resetByArchive(Maps.mapInfo);
}
Maps.plain1.reOpen = function () {
    currentCustomState = mainState;
    this.setVisible(true);
}
Maps.plain1.close = function () {
    this.setVisible(false);
}
Maps.plain1.render = function () {

}
Maps.plain1.initPlayerTile = function () {
    //玩家出现位置
    var x = this.playerPosition.x;
    var y = this.playerPosition.y;
    var tile = this.map.getTile(x, y);

    //加载玩家图片
    var texture = game.add.image(tile.worldX, tile.worldY, 'GM', 1);
    this.layer_lives.removeAll(true);
    this.layer_lives.add(texture);

    //初始化玩家tile属性
    player.tile = {
        x: x,
        y: y,
        texture: texture,
        changeFrame: function (frame) {
            player.tile.texture.frame = frame;
        }
    };
    player.facing = 3;//0 1 2 3 up down left right
}
Maps.plain1.resizeWorld = function () {
    this.layer_bridge.resizeWorld();
}
Maps.plain1.initObjsTileMap = function (stoneMap) {
    var obj_tile_map = Map.prototype.initObjsTileMap.call(this, stoneMap, 25, 25, function (num) {
        var result = {isStone: false, encounterChance: 0};
        if (num == 1) {
            result.isStone = true;
        } else if (num == 2) {//浓密草地
            result = Maps.plain1.getDeepGlassTileObj(result);
        } else if (num == 0) {//浅草地
            result = Maps.plain1.getGlassTileObj(result);
        } else if (num == 10) {//石碑1
            result.isStone = true;
            //读取石碑内容
            result.beInterestedCallback = function () {
                var message = '欢迎来到\nSword Art Offline\n目前艾恩格朗特一共有3层\n\n'+Maps.plain1.name+
                    '\n主要掉落物: \n' +
                    '苹果,木剑,神之手,FaQ\n' + 'Tips:深草区是刷怪地点\n' + '打倒Boss进入第二层!';
                myAlertDialog.reOpen(message, function () {
                    myAlertDialog.bDown();
                }, null, mainState);
            }
        } else if (num == 11) {//植物
            result.isStone = true;
            result.beInterestedCallback = function () {
                var message = '爸爸送你一把神器\n' + '按A说谢谢爸爸\n' +
                    '按B拒绝\n' + '温馨提示:机会只有一次';
                myAlertDialog.reOpen(message, function () {
                    player.getItem(Items.OSUPlayer);
                    //清除这个效果
                    result.beInterestedCallback = function () {
                        myAlertDialog.reOpen('OSU玩家的头已经长不出来了');
                    }
                    //设置储存flag
                    Maps.mapInfo.plain1.item1BeUsed = true;
                    //关闭弹窗
                    myAlertDialog.bDown();
                }, null, mainState);
            }
        } else if (num == 12) {//植物
            result.isStone = true;
            result.beInterestedCallback = function () {
                var message = '看起来像是Boss的样子\n' + '按A进入战斗\n' +
                    '按B跑路\n';
                myAlertDialog.reOpen(message, function () {
                    var boss = Object.create(Monsters.bossOfOne);
                    boss.items = [Items.deathKiller];

                    fightState.reOpen([boss], mainState);
                }, null, mainState);
            }
        } else if (num == 14) {//楼梯
            result.isStone = true;
            result.beInterestedCallback = function () {
                var message = '进入下一层?'
                myAlertDialog.reOpen(message, function () {
                    Maps.changeMap('shop');

                    myAlertDialog.bDown();
                }, null, mainState);
            }
        } else if (num == 3) {//沙地
            //可以不遇到怪
        }
        return result;
    })
    this.obj_tile_map = obj_tile_map;
}
Maps.plain1.getDeepGlassTileObj = function (result) {
    result.encounterChance = 10;
    result.spawnEnemies = function () {
        //刷王和哲学家
        var seed = Math.floor(Math.random() * 2);
        if (seed == 0) {//0 的时候刷王
            var king = Object.create(Monsters.king);

            //算装备掉落率
            var godHandSeed = Math.floor(Math.random() * 10);

            king.items = [Items.apple];
            if (godHandSeed < 4) {
                // console.log('加上武器');
                king.items.push(Items.godHand);
            }

            return [king];
        } else {
            var king2 = Object.create(Monsters.king2);

            var godHandSeed = Math.floor(Math.random() * 10);
            king2.items = [Items.apple];
            if (godHandSeed < 4) {
                // console.log('加上武器');
                king2.items.push(Items.faQ);
            }

            return [king2];
        }
    }
    return result;
}
Maps.plain1.getGlassTileObj = function (result) {
    result.encounterChance = 10;

    //返回一只随机怪物
    function getRandomMonster() {
        var seed = Math.floor(Math.random() * 2);
        if (seed == 0) {//0 的时候刷史莱姆
            var slime = Object.create(Monsters.slime);
            //算装备掉落率
            slime.items = [Items.apple];
            return slime;
        } else {
            var goblin = Object.create(Monsters.goblin);
            goblin.items = [Items.stick];
            return goblin;
        }
    }

    //要先计算概率，然后调用
    result.spawnEnemies = function () {
        //计算刷几只
        var seed = Math.floor(Math.random() * 3);
        var monsters = [];
        while(seed -- > -1){
            monsters.push(getRandomMonster());
        }
        return monsters;
    }

    return result;
}
Maps.plain1.playerGoTo = function (offsetX, offsetY) {
    var nextX = player.tile.x + offsetX;
    if (nextX < 0 || nextX >= this.map.width)return false;

    var nextY = player.tile.y + offsetY;
    if (nextY < 0 || nextY >= this.map.height)return false;

    //check stone
    if (this.obj_tile_map[nextX][nextY] && this.obj_tile_map[nextX][nextY].isStone)return false;

    //move : set player tile xy and texture
    player.tile.x = nextX;
    player.tile.y = nextY;
    var nextTile = this.map.getTile(nextX, nextY);

    //加入动画效果，不能一步到位
    // player.tile.texture.x = nextTile.worldX;
    // player.tile.texture.y = nextTile.worldY;
    var tween = game.add.tween(player.tile.texture);
    tween.to({x: nextTile.worldX,y:nextTile.worldY},100)
    tween.start();

    //encounter enemies
    this.encounter(nextX, nextY);

    return true;
}
Maps.plain1.setVisible = function (visible) {
    this.layer_lives.visible = visible;
    this.layer_bridge.visible = visible;
    this.layer_glass.visible = visible;
    this.layer_lava.visible = visible;
    this.layer_objs.visible = visible;
}
Maps.plain1.playerInterestOn = function (x, y) {
    var obj = this.obj_tile_map[x][y];
    console.log(JSON.stringify(obj));
    if (obj.beInterestedCallback) {
        obj.beInterestedCallback();
    } else {
        console.warn('该方块没有事件可以触发');
    }
}
Maps.plain1.encounter = function (x, y) {
    var tile = this.obj_tile_map[x][y];
    if (tile.encounterChance <= 0)return;
    var rand = Math.floor(Math.random() * 100);
    // console.info('摇到概率为' + rand);

    if (rand < tile.encounterChance) {
        //切换场景
        mainState.setVisible(false);
        currentCustomState = fightState;

        // fightState.reOpen([Object.create(Monsters.king),Object.create(Monsters.king2)]);
        fightState.reOpen(tile.spawnEnemies(), mainState);
    }
}
Maps.plain1.reset = function () {
    //重置砖块对象
    this.initObjsTileMap(this.stoneMap);
}
Maps.plain1.resetByArchive = function (mapInfo) {
    mapInfo = mapInfo || Maps.mapInfo;

    if (!mapInfo.plain1)return;

    var osuUsedFlag = mapInfo.plain1.item1BeUsed;
    var bossKilledFlag = mapInfo.plain1.bossKilledFlag;

    if (osuUsedFlag) {
        this.obj_tile_map[11][23].beInterestedCallback = function () {
            myAlertDialog.reOpen('OSU玩家的头已经长不出来了', function () {
                myAlertDialog.bDown();
            }, null, mainState);
        };
    }
    if (bossKilledFlag) {
        var bossTile = this.obj_tile_map[20][21];
        bossTile.isStone = false;
        bossTile.beInterestedCallback = null;
        Maps.plain1.map.putTile(null,20,21,Maps.plain1.layer_objs);
        Maps.plain1.map.putTile(null,20,20,Maps.plain1.layer_objs);
    }
}
Maps.plain1.destroy = function () {
    // this.setVisible(false);
    this.layer_glass.destroy();
    this.layer_lava.destroy();
    this.layer_bridge.destroy();
    this.layer_lives.destroy();//player in
    this.layer_objs.destroy();
    this.map.destroy();
}

Maps.shop.init = function () {
    //init obj map
    this.initObjsTileMap(this.stoneMap);

    this.map = game.add.tilemap('shop_map');
    this.map.addTilesetImage('poke_out', 'poke_out');
    this.groundLayer = this.map.createLayer('\u5757\u5c42 1');
    this.playerLayer = game.add.group();
    this.objLayer = this.map.createLayer('shade_life');

    //set current map
    map = this;

    //resize world
    this.groundLayer.resizeWorld();

    //加载玩家砖块
    map.initPlayerTile();

    //fix camera
    game.camera.follow(player.tile.texture);

    //根据储存的地图信息来重置某些特性:比如只能刷一次的怪
    Maps.mapInfo.currentFloor = 'shop';
    this.resetByArchive(Maps.mapInfo);
}
Maps.shop.initPlayerTile = function () {
    console.log('我想要初始化玩家砖块');
    //玩家出现位置
    var x = this.playerPosition.x;
    var y = this.playerPosition.y;
    var tile = this.map.getTile(x, y);

    //加载玩家图片
    var texture = game.add.image(tile.worldX, tile.worldY, 'GM', 1);
    this.playerLayer.removeAll(true);
    this.playerLayer.add(texture);

    //初始化玩家tile属性
    player.tile = {
        x: x,
        y: y,
        texture: texture,
        changeFrame: function (frame) {
            player.tile.texture.frame = frame;
        }
    };
    player.facing = 3;//0 1 2 3 up down left right
}
Maps.shop.resetByArchive = function () {
    console.log('我想要通过存档改变一些特性');
}
Maps.shop.initObjsTileMap = function () {
    console.log('我想要初始化砖块地图');
    var obj_tile_map = Map.prototype.initObjsTileMap.call(this, this.stoneMap, 25, 25, function (num) {
        var result = {isStone: false, encounterChance: 0};
        if (num == 1) {
            result.isStone = true;
        } else if (num == 10) {//交易机器
            result.isStone = true;
            result.beInterestedCallback = function () {
                Maps.shop.setVisible(false);
                purchaseDialog.reOpen();
            }
        }else if (num == 11) {//买道具
            result.isStone = true;
            result.beInterestedCallback = function () {
                // myAlertDialog.reOpen('商店的电脑好像坏掉了\n\n(其实是这部分的代码没写好...)');
                Maps.shop.setVisible(false);
                saleDialog.reOpen();
            }
        }else if (num == 2) {//黑板
            result.isStone = true;
            result.beInterestedCallback = function () {
                myAlertDialog.reOpen('黑板上写着:\n啥也别说了,卢本伟牛逼!');
            }
        }else if (num == 14) {//楼梯
            result.isStone = true;
            result.beInterestedCallback = function () {
                myAlertDialog.reOpen('进入第三层?',function () {
                    Maps.changeMap('floor3');
                    myAlertDialog.bDown();
                });
            }
        } else if (num == 13) {//楼梯
            result.isStone = true;
            result.beInterestedCallback = function () {
                myAlertDialog.reOpen('确定返回第一层吗?',function () {
                    Maps.plain1.playerPosition = {x:22,y:24}
                    Maps.changeMap('plain1');
                    myAlertDialog.bDown();
                });
            }
        }
        return result;
    })
    this.obj_tile_map = obj_tile_map;
}
Maps.shop.playerGoTo = function (offsetX, offsetY) {
    return Maps.plain1.playerGoTo.call(this, offsetX, offsetY)
}
Maps.shop.encounter = function (x, y) {
}
Maps.shop.playerInterestOn = function (x, y) {
    Maps.plain1.playerInterestOn.call(this,x,y);
}
Maps.shop.setVisible = function (visible) {
    this.groundLayer.visible = visible;
    this.playerLayer.visible = visible;
    this.objLayer.visible = visible;
}
Maps.shop.destroy = function () {
    this.groundLayer.destroy();
    this.objLayer.destroy();
    this.playerLayer.destroy();
    this.map.destroy();
}
