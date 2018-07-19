var Kiteflying = {};
Kiteflying.Boot = function(game) {
    Kiteflying.GAME_WIDTH = 640;
    Kiteflying.GAME_HEIGHT = 1036;
};
Kiteflying.Boot.prototype = {
    preload: function() {
        this.load.image('loadingBar_1', 'assets/loadingBar_1.png');
        this.load.image('loadingBar_0', 'assets/loadingBar_0.png');
    },
    create: function() {
        this.input.maxPointers = 1;
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.state.start('Preloader');
    }
};