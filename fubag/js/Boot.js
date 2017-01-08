var MyGame = {};
MyGame.Boot = function(game) {
};
MyGame.Boot.prototype = {
	init : function(){
		this.input.maxPointers = 1;
		this.stage.disableVisibilityChange = true;
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally =  true;
        this.scale.pageAlignVertically = true;
	},
    preload: function() {
    },
    create: function() {
        this.state.start('Preloader');
    }
};