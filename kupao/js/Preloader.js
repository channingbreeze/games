MyGame.Preloader = function(game){
};

MyGame.Preloader.prototype = {
  create:function(){
    this.load.onFileComplete.add(this.fileComplete, this);
    this.load.onLoadComplete.add(this.loadComplete, this);
    this.text = this.add.text(this.world.width/2, this.world.height/2-50, '', { fill: '#fff' });
    this.text.anchor.set(0.5);
    this.start();
  },
  start:function(){
    game.load.image('MainMenu_bg', ''+config.baseURL+'MainMenu.jpg');
    game.load.image('pep', ''+config.baseURL+'pep.png');
    game.load.image('startBtn', ''+config.baseURL+'start_btn.png');
    game.load.image('mypoil_btn', ''+config.baseURL+'mypoil_btn.png');
    game.load.image('gameway', ''+config.baseURL+'game_way.png');
    game.load.image('go', ''+config.baseURL+'go.png');
    game.load.image('cloud', ''+config.baseURL+'cloud.jpg');
    game.load.image('city1', ''+config.baseURL+'city1.png');
    game.load.image('city2', ''+config.baseURL+'city2.png');
    
    game.load.tilemap('game_map',''+config.baseURL+'map.json',null,Phaser.Tilemap.TILED_JSON);
    game.load.image('map',''+config.baseURL+'map.png');
    game.load.image('poil_box',''+config.baseURL+'poil_box.png');
    game.load.image('lg_btn',''+config.baseURL+'lg_btn.png');
    game.load.image('replay_btn',''+config.baseURL+'replay_btn.png');
    game.load.image('share_btn',''+config.baseURL+'share_btn.png');
    game.load.image('backIndex_btn',''+config.baseURL+'backIndex_btn.png');
    game.load.image('shareImg',''+config.baseURL+'shareImg.png');
    game.load.image('invitation',''+config.baseURL+'invitation.jpg');
    game.load.audio('music',''+config.baseURL+'music.mp3?2');
    
    this.load.atlasJSONHash('player', ''+config.baseURL+'player_json.png', ''+config.baseURL+'player_json.json');
    
    this.load.start();
  },
  fileComplete:function(progress){
    this.text.setText( + progress + "%");
  },
  loadComplete:function(){
    this.state.start('MainMenu');
  }
};