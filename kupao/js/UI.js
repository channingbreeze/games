var self;
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
  mod.showPoil = function(ispoil){
    var isShare = false;
    game.poilCover = game.add.graphics(0,0);
    game.poilCover.beginFill(0x000000,.7);
    game.poilCover.drawRect(0, 0, 784,game.world.height);
    game.poilCover.endFill();
    game.poilCover.fixedToCamera = true;
    
    game.poilBox = game.add.sprite(game.poilCover.width/2,80,'poil_box');
    game.poilBox.anchor.set(0.5,0)
    game.poilCover.addChild(game.poilBox);
    
    game.poilText = game.add.text(0,300,'',{font: "36px Microsoft YaHei", fill: "#ffffff",align:'center'});
    game.poilText.anchor.set(0.5);
    game.poilBox.addChild(game.poilText);
    
    game.poilBtn = game.add.button(game.poilCover.width/2,game.world.height - 200,'',function(){
      
      if(!isShare)
      {
        if(ispoil)
        {
          isShare = true;
          game.poilBox.destroy();
          game.invitationKard = game.add.sprite(game.poilCover.width/2,80,'invitation');
          game.invitationKard.anchor.set(0.5,0);
          game.add.tween(game.invitationKard).from({y:70,alpha:0},500,Phaser.Easing.Linear.None,true)
          game.poilCover.addChild(game.invitationKard);
          game.poilBtn.loadTexture('share_btn');
        }
        else
        {
          game.poilCover.destroy();
          self.gamerest();
        }
      }
      else
      {
        game.invitationKard.destroy();
        game.poilBtn.destroy();
        game.shareImg = game.add.sprite(game.poilCover.width/2,80,'shareImg');
        game.poilCover.addChild(game.shareImg);
        game.shareImg.anchor.set(0.5,0);
      }

    });
    game.poilBtn.anchor.set(0.5)
    game.poilCover.addChild(game.poilBtn);
    
    if(ispoil)
    {
      game.poilText.setText('恭喜你获得\n'+user.poil+'')
      game.poilBtn.loadTexture('lg_btn');
    }
    else
    {
      game.poilText.setText('您与大奖擦肩而过！\n再战一次吧！')
      game.poilBtn.loadTexture('replay_btn');
    }
  }
  return mod;
})(window.GameUI || {});
