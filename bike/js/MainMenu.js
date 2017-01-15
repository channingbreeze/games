MyGame.MainMenu = function(game) {
};
MyGame.MainMenu.prototype = {
  create: function() {
    game.add.image(0,0,'MainMenu_bg');
    var title = this.add.sprite(20,0,'title');
    game.add.tween(title).from({x:game.world.width,y:-200}, 150, Phaser.Easing.Linear.None, true,100);
    var pep = this.add.sprite(100,430,'pep');
    game.add.tween(pep).from({x:-game.world.width,y:800}, 150, Phaser.Easing.Linear.None, true,200);
    var startBtn = game.add.button(game.world.width/2,850,'ico',function(){
      game.state.start('Game')
    },this);
    startBtn.anchor.set(0.5,0);
    startBtn.frameName = 'start_btn.png';
    var ruleBtn = game.add.button(70,720,'ico',function(){
      game.state.start('MyLotto')
    },this);
    ruleBtn.frameName = 'rule_btn.png';
    game.add.tween(ruleBtn).from({alpha:0}, 500, Phaser.Easing.Linear.None, true,500);
    
    var myLottoBtn = game.add.button(game.world.width/2,980,'ico',function(){
      game.state.start('MyLotto')
    },this);
    myLottoBtn.anchor.set(0.5,0);
    myLottoBtn.frameName = 'mylotto_btn.png';
    
    var rankBtn = game.add.button(game.world.width/2,1080,'ico',function(){
      game.state.start('Rank')
    },this);
    rankBtn.anchor.set(0.5,0);
    rankBtn.frameName = 'rankingBtn.png';

    GameUI.cutscenes();
  }
};