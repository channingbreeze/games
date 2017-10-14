/**
 * Created by zhuo on 2017/9/22.
 */

var loadState = {
    completeFlag: false,
    preload: function () {
        var progress = 0;
        var text = game.add.text(0, 0, 'loading... ' + progress + '%',
            {font: "bold 25px Arial", fill: "#9AFF9A", boundsAlignH: "center", boundsAlignV: "middle"}
        );
        text.setTextBounds(0, 0, 500, 500);
        game.load.onFileComplete.add(function (progress) {
            if (progress >= 100) {
                text.text = '加载完成\n\n' +
                    '游戏按键: WASD JK\n' + '请按下任意游戏按键进入游戏';
                loadState.completeFlag = true;
                return;
            }
            text.text = "loading... " + progress + '%';
        })

        game.load.image('titleBg0', './js/assets/TitleBg0.gif');
        game.load.image('selector', './js/assets/selector.png');
        game.load.image('mahojin', './js/assets/maho_bg0.png');
        game.load.image('menuBg', './js/assets/selecting.png');
        game.load.image('gun', './js/assets/gun.png');

        //floor 1
        game.load.tilemap('tile_map', './js/assets/fuck.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tiles1', './js/assets/west_rpg.png');
        game.load.image('tiles2', './js/assets/the_man_set.png');

        //floor 2
        game.load.tilemap('shop_map', './js/assets/home.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('poke_out', './js/assets/poke_out.png');

        //floor 3
        game.load.tilemap('floor3', './js/assets/fuck2.json', null, Phaser.Tilemap.TILED_JSON);

        game.load.spritesheet('GM', './js/assets/the_man_set.png', 32, 32);
        game.load.spritesheet('damage1', './js/assets/damage1.png', 192, 115, 13);
    },
    create: function () {
        // game.state.start('field');
    },
    update: function () {
        if (!this.completeFlag) return;

        if (game.input.keyboard.isDown(Phaser.Keyboard.A)) {
            this.toNextState();
        } else if (game.input.keyboard.isDown(Phaser.Keyboard.D)) {
            this.toNextState();
        } else if (game.input.keyboard.isDown(Phaser.Keyboard.W)) {
            this.toNextState();
        } else if (game.input.keyboard.isDown(Phaser.Keyboard.S)) {
            this.toNextState();
        } else if (game.input.keyboard.isDown(Phaser.Keyboard.J)) {
            this.toNextState();
        } else if (game.input.keyboard.isDown(Phaser.Keyboard.K)) {
            this.toNextState();
        } else return;
    },
    toNextState: function () {
        game.state.start('title');
    },
    goLeft: function () {
        this.toNextState();
    },
    goRight: function () {
        this.goLeft();
    },
    goUp: function () {
        this.goLeft();
    },
    goDown: function () {
        this.goLeft();
    },
    aDown: function () {
        this.goLeft();
    },
    bDown: function () {
        this.goLeft();
    }
}

var titleState = {
    group: null,
    selecting: 0,
    items: ['继续游戏', '重新开始'],
    create: function () {
        var bg = game.add.image(0, 0, 'titleBg0');
        bg.height = 500;
        bg.width = 500;
        this.group = game.add.group();
        this.reRender();
    },
    reRender: function () {
        this.group.removeAll(true);

        var font = {font: "bold 25px Arial", fill: "#9AFF9A", boundsAlignH: "center", boundsAlignV: "middle"};

        var text = game.add.text(0, 0, this.items[0], font, this.group);
        text.setTextBounds(50, 400, 200, 100);

        var text = game.add.text(0, 0, this.items[1], font, this.group);
        text.setTextBounds(250, 400, 200, 100);

        //选择框
        var x = 50 + this.selecting * 200;
        var y = 400;
        var selector = game.add.image(x, y, 'selector');
        selector.height = 100;
        selector.width = 200;
        this.group.add(selector);
    },
    update: function () {
        current_cold_down_time--;
        if (current_cold_down_time > 0) return;

        if (game.input.keyboard.isDown(Phaser.Keyboard.A)) {
            this.goLeft();
        } else if (game.input.keyboard.isDown(Phaser.Keyboard.D)) {
            this.goRight();
        } else if (game.input.keyboard.isDown(Phaser.Keyboard.W)) {
        } else if (game.input.keyboard.isDown(Phaser.Keyboard.S)) {
        } else if (game.input.keyboard.isDown(Phaser.Keyboard.J)) {
            this.aDown();
        } else if (game.input.keyboard.isDown(Phaser.Keyboard.K)) {
        } else return;

        current_cold_down_time = oper_cold_down_time;
    },
    toNextState: function () {
        game.state.start('field');
    },
    goLeft: function () {
        this.selecting--;
        if (this.selecting < 0) {
            this.selecting = 1;
        }
        this.reRender();
    },
    goRight: function () {
        this.selecting++;
        if (this.selecting > 1) {
            this.selecting = 0;
        }
        this.reRender();
    },
    aDown: function () {
        if (this.selecting == 0) {
            this.toNextState();
        } else if (this.selecting == 1) {
            localStorage.clear();
            this.toNextState();
        }
    },
    goUp: function () {
    },
    goDown: function () {
    },
    bDown: function () {
    }
}