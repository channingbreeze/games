var MyGame = {};
MyGame.Boot = function(game) {
};
MyGame.Boot.prototype = {
    preload: function() {
    },
    create: function() {
        this.stage.backgroundColor = '#2d2d2d';
        this.input.maxPointers = 1;
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.state.start('Preloader');
    }
};