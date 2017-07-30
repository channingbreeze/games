/**
 * Created by 365 on 2017-07-11.
 */



UI = function(_game){};

UI.prototype = Object.create(Phaser.Sprite.prototype);
UI.prototype.constructor = UI;

UI.prototype.pop = function(){

    var pop = game.add.sprite(200,200,'player');
    pop.anchor.set(0.5);
    pop.fixedToCamera = true;

    game.add.tween(pop.scale).from( { y: 0 ,x:0}, 2000, Phaser.Easing.Bounce.In, true);

}









