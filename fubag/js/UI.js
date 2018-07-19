var GameUI = ( function (mod){
    mod.cutscenes = function(){
        game.graphics = game.add.graphics(0, 0);
        game.graphics.beginFill(0x000000);
        game.graphics.drawRect(0, 0, game.world.width,game.world.height);
        game.graphics.endFill();
        game.add.tween(game.graphics).to({alpha:0},500,Phaser.Easing.Cubic.Out,true).onComplete.add(function(){
            game.graphics.kill()
        },this);
    };
    
    mod.ico = function(o,x,y,key,_x,_y){
    	o = game.add.sprite(x,y,'ico');
        o.frameName = key;
        _x = 0 || _x;
        _y = 0 || _y;
        o.anchor.set(_x,_y);
        return o;
    }
    
    mod.btn = function(o,x,y,key,_x,_y,callback){
    	o = game.add.button(x,y,'ico',callback,this);
       	o.frameName = key;
		_x = 0 || _x;
        _y = 0 || _y;
        o.anchor.set(_x,_y);
        return o;
    }
    
    
    return mod;
})(window.GameUI || {});
