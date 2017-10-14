Maps.floor3.init = function () {
    //init obj map
    this.initObjsTileMap(this.stoneMap);

    this.map = game.add.tilemap('floor3');
    this.map.addTilesetImage('west_rpg', 'tiles1');
    this.groundLayer = this.map.createLayer('\u5757\u5c42 1');
    this.secondLayer = this.map.createLayer('\u5757\u5c42 2');
    this.playerLayer = game.add.group();
    this.objLayer = this.map.createLayer('\u5757\u5c42 3');

    //set current map
    map = this;

    //resize world
    this.groundLayer.resizeWorld();

    //加载玩家砖块
    map.initPlayerTile();

    //fix camera
    game.camera.follow(player.tile.texture);

    //根据储存的地图信息来重置某些特性:比如只能刷一次的怪
    Maps.mapInfo.currentFloor = 'floor3';
    this.resetByArchive(Maps.mapInfo);
}
Maps.floor3.initPlayerTile = function () {
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
Maps.floor3.resetByArchive = function () {
    console.log('我想要通过存档改变一些特性');
    if (Maps.mapInfo.floor3.item0BeTook) {
        Maps.floor3.obj_tile_map[24][1].beInterestedCallback = function () {
            myAlertDialog.reOpen('"呵，人类"');
        };
    }
    if (Maps.mapInfo.floor3.bossKilledFlag) {
        Maps.floor3.obj_tile_map[20][22].beInterestedCallback = function () {
            myAlertDialog.reOpen('现在你可以通过这里', function () {
                myAlertDialog.bDown();
            });
        };
        //改变地图显示
        Maps.floor3.map.putTile(null, 20, 20, Maps.floor3.objLayer);
        Maps.floor3.map.putTile(null, 20, 21, Maps.floor3.objLayer);
        Maps.floor3.map.putTile(null, 20, 22, Maps.floor3.objLayer);
    }
}
Maps.floor3.initObjsTileMap = function () {
    console.log('我想要初始化砖块地图');
    var obj_tile_map = Map.prototype.initObjsTileMap.call(this, this.stoneMap, 25, 25, function (num) {
        var result = {isStone: false, encounterChance: 0};
        if (num == 6) {//河里的石碑
            result.isStone = true;
            result.beInterestedCallback = function () {
                var msg = '...';
                myAlertDialog.reOpen(msg);
            }
        } else if (num == 7) {//浅草地里的石碑
            result.isStone = true;
            result.beInterestedCallback = function () {
                var msg = '...'
                myAlertDialog.reOpen(msg);
            }
        } else if (num == 8) {//出口附近的石碑
            result.isStone = true;
            result.beInterestedCallback = function () {
                var msg = '---命运坟场---';
                myAlertDialog.reOpen(msg, function () {
                    myAlertDialog.bDown();
                }, null, mainState);
            }
        } else if (num == 9) {//boss点
            result.isStone = true;
            result.beInterestedCallback = function () {
                myAlertDialog.reOpen('"这就是给予我这个罪人的制裁吗?"', function () {
                    myAlertDialog.bDown();
                    fightState.reOpen([Object.create(Monsters.TheCain)]);
                }, null, mainState);
            }
        } else if (num == 3) {//石头墙壁
            result.isStone = true;
        } else if (num == 11) {//入口楼梯
            result.isStone = true;
            result.beInterestedCallback = function () {
                myAlertDialog.reOpen('确定返回上一层?', function () {
                    Maps.changeMap('shop');
                    myAlertDialog.bDown();
                }, null, mainState);
            }
        } else if (num == 12) {//出口楼梯
            result.isStone = true;
            result.beInterestedCallback = function () {
                myAlertDialog.reOpen('第四层施工中');
            }
        } else if (num == 5) {//土豆
            result.isStone = true;
            result.beInterestedCallback = function () {
                var msg = '"我为耶和华所眷顾\n我是万物的宠儿\n\n我要向世界控诉我的不公!"';
                myAlertDialog.reOpen(msg, function () {
                    //获得道具
                    player.getItem(Items.curseOfAbe);

                    //设置地图信息
                    Maps.mapInfo.floor3.item0BeTook = true;
                    result.beInterestedCallback = function () {
                        myAlertDialog.reOpen('"呵，人类"');
                    };

                    myAlertDialog.bDown();
                    myAlertDialog.reOpen("获得装备:亚伯的诅咒", function () {
                        myAlertDialog.bDown();
                    }, null, mainState);
                }, null, mainState);
            }
        } else if (num == 4) {//深草地
            result = Maps.floor3.getDeepGlassTileObj(result);
        } else if(num == 2){

        }
        return result;
    })
    this.obj_tile_map = obj_tile_map;
}
Maps.floor3.getDeepGlassTileObj = function (result) {
    var getRandomMonster = function () {
        var seed = Math.floor(Math.random() * 2);
        if (seed == 0) {
            var result = Object.create(Monsters.poet);
            //算装备掉落率
            result.items = [Items.coin];
            // return slime;
            return result;
        } else if (seed == 1) {
            var result = Object.create(Monsters.priest);
            //算装备掉落率
            result.items = [Items.coin];
            // return slime;
            return result;
        }
    }

    result.encounterChance = 30;
    result.spawnEnemies = function () {
        var seed = Math.floor(Math.random() * 2);
        var results = [];
        if (seed == 0) {
            results.push(getRandomMonster());
        } else if (seed == 1) {
            results.push(getRandomMonster());
            results.push(getRandomMonster());
        }
        return results;
    }

    return result;
}
Maps.floor3.getOceanTile = function (result) {
    var getRandomMonster = function () {
        var seed = Math.floor(Math.random() * 2);
        if (seed == 0) {
            var result = Object.create(Monsters.swimmer);
            //算装备掉落率
            result.items = [Items.coin];
            // return slime;
            return result;
        } else if (seed == 1) {
            var result = Object.create(Monsters.peopleFishing);
            //算装备掉落率
            result.items = [Items.coin];
            // return slime;
            return result;
        }
    }

    result.encounterChance = 20;
    result.spawnEnemies = function () {
        var seed = Math.floor(Math.random() * 2);
        var results = [];
        if (seed == 0) {
            results.push(getRandomMonster());
        } else if (seed == 1) {
            results.push(getRandomMonster());
            results.push(getRandomMonster());
        }
        return results;
    }

    return result;
}
Maps.floor3.playerGoTo = function (offsetX, offsetY) {
    return Maps.plain1.playerGoTo.call(this, offsetX, offsetY)
}
Maps.floor3.reOpen = function () {
    currentCustomState = mainState;
    this.setVisible(true);
}
Maps.floor3.encounter = function (x, y) {
    Maps.plain1.encounter.call(this, x, y);
}
Maps.floor3.playerInterestOn = function (x, y) {
    Maps.plain1.playerInterestOn.call(this, x, y);
}
Maps.floor3.setVisible = function (visible) {
    this.groundLayer.visible = visible;
    this.playerLayer.visible = visible;
    this.secondLayer.visible = visible;
    this.objLayer.visible = visible;
}
Maps.floor3.destroy = function () {
    this.groundLayer.destroy();
    this.objLayer.destroy();
    this.playerLayer.destroy();
    this.secondLayer.destroy();
    this.map.destroy();
}