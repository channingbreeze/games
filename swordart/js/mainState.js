/**
 * Created by zhuo on 2017/9/3.
 */
var mainState = {//the main dialog & the game
    preload: function () {
        console.log('call::preload()');
        // game.load.tilemap('tile_map', './js/assets/fuck.json', null, Phaser.Tilemap.TILED_JSON);
        // game.load.image('tiles1', './js/assets/west_rpg.png');
        // game.load.image('tiles2', './js/assets/the_man_set.png');
        //
        // game.load.tilemap('shop_map', './js/assets/home.json', null, Phaser.Tilemap.TILED_JSON);
        // game.load.image('poke_out', './js/assets/poke_out.png');
        //
        // game.load.spritesheet('GM', './js/assets/the_man_set.png', 32, 32);
    },
    create: function () {
        console.log('call::create()');

        //初始化玩家函数之类的
        initPlayer();


        //加载存档,地图初始化
        MyAchiveManager.loadArchives();


        currentCustomState = mainState;


        cursor = game.input.keyboard.createCursorKeys();

        //init dialogs
        // itemDialog.init();
        // roleDialog.init();
        // menuDialog.init();
        // fightState.init();
        // fightItemDialog.init();
        // selectEnemyDialog.init();
        // myAlertDialog.init();
        // itemShowDialog.init();
        // equipShowDialog.init();
    },
    render: function () {

    },
    update: function () {

    },
    init: function () {

    },
    initPlayer: function () {
        initPlayer();
    },
    goLeft: function () {
        player.goLeft();
    },
    goRight: function () {
        player.goRight();
    },
    goUp: function () {
        player.goUp();
    },
    goDown: function () {
        player.goDown();
    },
    aDown: function () {
        //触发感兴趣事件
        var x = player.tile.x;
        var y = player.tile.y;
        if (player.facing == 0) {
            y = y - 1;
        } else if (player.facing == 1) {
            y = y + 1;
        } else if (player.facing == 2) {
            x = x - 1;
        } else if (player.facing == 3) {
            x = x + 1;
        }

        map.playerInterestOn(x, y);
    },
    bDown: function () {
        player.bDown();
    },
    fixCameraTo: function (x, y) {
        // game.camera.focusOnXY(x, y);
    },
    reOpen: function () {
        map.reOpen();
    },
    close: function () {
        map.close();
    },
    setVisible: function (visible) {
        map.setVisible(visible);
    },
    gameReset: function () {
        map.destroy();//清空地图group
        game.state.restart(false);//保留group信息,不需要重新创建
    },
    update: function () {
        current_cold_down_time--;
        if (current_cold_down_time > 0)return;

        if (game.input.keyboard.isDown(Phaser.Keyboard.A)) {
            currentCustomState.goLeft();
        } else if (game.input.keyboard.isDown(Phaser.Keyboard.D)) {
            // console.log('D down');
            currentCustomState.goRight();
        } else if (game.input.keyboard.isDown(Phaser.Keyboard.W)) {
            currentCustomState.goUp();
        } else if (game.input.keyboard.isDown(Phaser.Keyboard.S)) {
            currentCustomState.goDown();
        } else if (game.input.keyboard.isDown(Phaser.Keyboard.J)) {
            currentCustomState.aDown();
        } else if (game.input.keyboard.isDown(Phaser.Keyboard.K)) {
            currentCustomState.bDown();
        } else return;

        current_cold_down_time = oper_cold_down_time;
    }
}
