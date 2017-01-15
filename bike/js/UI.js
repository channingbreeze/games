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
    	var scoreBar = game.add.sprite(game.world.width/2,game.world.height - 153,'ico');
    	scoreBar.anchor.set(0.5,0);
        scoreBar.frameName = 'score_bar.png';
        game.scoreText = game.add.text(50,70,'0',{font: "bold 32px Microsoft YaHei", fill: "#ffe082",align:'center'});
        scoreBar.addChild(game.scoreText);
        
        
        var sider = game.add.sprite(game.world.width/2,20,'ico');
    	sider.anchor.set(0.5,0);
        sider.frameName = 'sider.png';
        
    };
    
    mod.Sider = function(){
    	
    }
    
    return mod;
})(window.GameUI || {});
