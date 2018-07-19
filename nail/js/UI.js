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
    
    mod.Game_element = function(){
    	
    	
    	//画圆
        game.circleGraphics = game.add.graphics(0,0);
        game.circleGraphics.beginFill(0xFFFFFF);
    	game.circleGraphics.drawCircle(0 , 0, 400);
    	game.circleGraphics.endFill();
        
        //画钉子(左右方向)
    	game.NailGraphicsA = game.add.graphics(0,0);
	    game.NailGraphicsA.beginFill('0x808080');
	    game.NailGraphicsA.moveTo(0,0);
	    game.NailGraphicsA.lineTo(30, -25);
	    game.NailGraphicsA.lineTo(30, 25);
	    game.NailGraphicsA.endFill();
	    
	    //画钉子(上下方向)
	    game.NailGraphics = game.add.graphics(0,0);
	    game.NailGraphics.beginFill('0x808080');
	    game.NailGraphics.moveTo(0,0);
	    game.NailGraphics.lineTo(80, 0);
	    game.NailGraphics.lineTo(40, 40);
	    game.NailGraphics.endFill();
    	
	    //画矩形
	    game.rectGraphics = game.add.graphics(0,0);
		game.rectGraphics.beginFill('0x808080');
    	game.rectGraphics.drawRect(0, 0, game.world.width, 80);
    	game.rectGraphics.endFill();
    	
    	
    };
   
    
    return mod;
})(window.GameUI || {});
