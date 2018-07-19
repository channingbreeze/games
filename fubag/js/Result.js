MyGame.Result = function(game) {

};
MyGame.Result.prototype = {
    create: function() {
       game.add.image(0,0,'resultBg');
       
       game.scoreText = game.add.text(game.world.centerX, 300, "你已成功接到"+score+"个福袋", { font: "bold 40px Arial", fill: "#b81d19"});
	   game.scoreText.anchor.set(0.5,0)
	   
	   
	   if(score<=8)
	   {
	   		game.num = 't3'
	   }
	   else if(score>8 && score<=16)
	   {
	   		game.num = 't2'
	   }
	   else
	   {
	   	  game.num = 't1'
	   }
	   
	   game.zhufuText = GameUI.ico('game.zhufuText', game.world.centerX, 380, game.num, 0.5, 0);
       
       
     game.btn = GameUI.btn('game.btn', game.world.centerX, game.world.height - 370, 'btn', 0.5, 1, function() {
      window.location.reload();
		});
		
		
		
		
       
		GameUI.cutscenes()
    },
    update: function() {
    }
};

