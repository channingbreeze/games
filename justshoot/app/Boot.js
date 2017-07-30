
utils = require('./Utils.js');
api = require('./Api.js');

WebFontConfig = {

    google: {
        families: ['Revalia']
    }

};


MyGame.Boot = function(game) {
};

MyGame.Boot.prototype = {
	init : function(){

        /*if(game.scale.isLandscape) {
            game.scale.correct = true;
            game.scale.setGameSize(WIDTH, HEIGHT);
        } else {
            game.scale.correct = false;
            game.scale.setGameSize(HEIGHT, WIDTH);
        }*/

		this.input.maxPointers = 2;
		this.stage.disableVisibilityChange = true;

        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        this.scale.pageAlignHorizontally =  true;
        this.scale.pageAlignVertically = true;


        game.physics.startSystem(Phaser.Physics.ARCADE);




	},
    preload: function() {

        this.load.image('loadingBar_1', '../assets/loadingBar_1.png');
        this.load.image('loadingBar_0', '../assets/loadingBar_0.png');

    },
    create: function() {

        game.state.start('Preloader');


       /* game.scale.onOrientationChange.add(function() {
            if(game.scale.isLandscape) {
                game.scale.correct = true;
                game.scale.setGameSize(WIDTH, HEIGHT);
            } else {
                game.scale.correct = false;
                game.scale.setGameSize(HEIGHT, WIDTH);
            }
        }, this)*/


        //this.state.start('Preloader');
    }
};


/*Phaser.World.prototype.displayObjectUpdateTransform = function() {
    if(!game.scale.correct) {
        this.x = game.camera.y + game.width;
        this.y = -game.camera.x;
        this.rotation = Phaser.Math.degToRad(Phaser.Math.wrapAngle(90));
    } else {
        this.x = -game.camera.x;
        this.y = -game.camera.y;
        this.rotation = 0;
    }

    PIXI.DisplayObject.prototype.updateTransform.call(this);
}*/


 
