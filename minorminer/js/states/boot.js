var MinerGame = MinerGame || {};

// BOOT STATE //
MinerGame.bootState = function(){};

MinerGame.bootState.prototype = {
  preload: function() {
    // load the loader bar
    this.load.image('load-bar', 'assets/img/load-bar.png');
    // load font
    this.load.bitmapFont('carrier_command', 'assets/font/carrier_command.png', 'assets/font/carrier_command.xml');
  },
  create: function() {
    // set the background to dark blue
    this.game.stage.background = '#02171f';

    // scaling
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;

    // physics
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.state.start('preload');
  }
};
