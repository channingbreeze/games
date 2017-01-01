var MyGame = {};
MyGame.Boot = function(game) {
};
MyGame.Boot.prototype = {
    preload: function() {
    },
    create: function() {
        this.stage.backgroundColor = '#d4d8d3';
        this.input.maxPointers = 1;
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.state.start('Preloader');
    }
};