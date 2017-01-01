Kiteflying.Preloader = function(game){

};

Kiteflying.Preloader.prototype = {
    preload: function() {
        this.stage.backgroundColor = '#02c4fc';
        this.loadBar = this.add.group();

        this.loadBar.create(0,0,'loadingBar_0');
        this.preloadBar = this.loadBar.create(2,2,'loadingBar_1');
        this.load.setPreloadSprite(this.preloadBar);

        this.loadBar.x = Kiteflying.GAME_WIDTH / 2 - 150;
        this.loadBar.y = Kiteflying.GAME_HEIGHT / 2;

        this.load.image('mainMenuBg','assets/mainMenuBg.jpg')

        this.load.image('button-start','assets/playBtn.png?2');

        this.load.spritesheet('kite', 'assets/kite.png', 78, 218, 2);
        this.load.image('gameBg','assets/gameBg.jpg'); //背景
        this.load.spritesheet('branchs','assets/branchs.png?2',640,150,2);
        this.load.bitmapFont('desyrel', 'assets/desyrel.png', 'assets/desyrel.xml');
        this.load.audio('gameMusic', 'assets/gameMusic.mp3?332'); //游戏背景音乐
        this.load.image('scoreBox','assets/scoreBox.png');
        this.load.image('button-rest','assets/restBtn.png');

        //载入插件方向控制插件资源
        this.load.image('compass', 'assets/compass_rose.png');
        this.load.image('touch_segment', 'assets/touch_segment.png');
        this.load.image('touch', 'assets/touch.png');

    },
    create: function() {
        this.state.start('MainMenu');
    }
};