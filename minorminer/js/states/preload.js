var MinerGame = MinerGame || {};

// PRELOAD STATE //
MinerGame.preloadState = function(){};

MinerGame.preloadState.prototype = {
  preload: function() {
    // show loading text
    var loadingText = this.game.add.bitmapText(this.game.world.centerX, this.game.world.centerY - 64, 'carrier_command', 'LOADING', 14);
    loadingText.anchor.setTo(0.5, 0.5);
    // show loading bar
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'load-bar');
    this.preloadBar.anchor.setTo(0.5);
    this.load.setPreloadSprite(this.preloadBar);

    // load tilemaps
    this.load.tilemap('menu', 'assets/tilemaps/menu.json', null, Phaser.Tilemap.TILED_JSON);
    // level tilemaps
    for (var i = 1; i <= 17; i++) {
      this.load.tilemap(i.toString(), 'assets/tilemaps/' + i.toString() + '.json', null, Phaser.Tilemap.TILED_JSON);
    }
    // load hardMode levels
    for (var i = 1; i <= 2; i++) {
      this.load.tilemap(i.toString() + ' hard', 'assets/tilemaps/' + i.toString() + ' hard.json', null, Phaser.Tilemap.TILED_JSON);
    }
    // load last level
    this.load.tilemap('final', 'assets/tilemaps/final.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.tilemap('final hard', 'assets/tilemaps/final hard.json', null, Phaser.Tilemap.TILED_JSON);
    // load victory screen
    this.load.tilemap('victory', 'assets/tilemaps/victory.json', null, Phaser.Tilemap.TILED_JSON);


    // load tiles/sprites/images
    this.load.image('tiles', 'assets/img/tiles.png');
    this.load.image('outside-tiles', 'assets/img/outside-tiles.png');
    this.load.spritesheet('player', 'assets/img/player.png', 16, 16, 16);
    this.load.spritesheet('player-speedo', 'assets/img/player-speedo.png', 16, 16, 16);
    this.load.spritesheet('dust', 'assets/img/dust.png', 8, 8);
    this.load.image('particle', 'assets/img/particle.png');
    this.load.spritesheet('player-warp', 'assets/img/player-warp.png', 24, 24);
    this.load.spritesheet('player-speedo-warp', 'assets/img/player-speedo-warp.png', 24, 24);
    this.load.image('powerup', 'assets/img/item-gun.png');
    this.load.image('infinite-battery', 'assets/img/infinite-battery.png');
    this.load.spritesheet('portal', 'assets/img/portal.png', 16, 16);
    this.load.spritesheet('secret', 'assets/img/secret.png', 16, 16);
    this.load.image('secret-particle', 'assets/img/secret-particle.png');
    this.load.spritesheet('block-dust', 'assets/img/block-dust.png', 16, 16);
    this.load.spritesheet('drill', 'assets/img/drill.png', 16, 8);
    this.load.image('drill-particle', 'assets/img/drill-particle.png');
    this.load.image('mist', 'assets/img/mist.png');
    this.load.spritesheet('battery', 'assets/img/battery.png', 36, 16);
    this.load.image('cloud-particle', 'assets/img/cloud-particle.png');
    this.load.spritesheet('robot', 'assets/img/robot.png', 24, 32);


    // load audio assets
    this.load.audio('intro', 'assets/audio/intro.mp3');
    this.load.audio('start_game', 'assets/audio/start_game.wav');
    this.load.audio('field1', 'assets/audio/field1.mp3');
    this.load.audio('field2', 'assets/audio/field2.mp3');
    this.load.audio('jump', 'assets/audio/jump.wav');
    this.load.audio('player_die', 'assets/audio/player_die.wav');
    this.load.audio('secret', 'assets/audio/secret.wav');
    this.load.audio('footstep', 'assets/audio/footstep.wav');
    this.load.audio('dust', 'assets/audio/dust.wav');
    this.load.audio('spring', 'assets/audio/spring.wav');
    this.load.audio('drill', 'assets/audio/drill.wav');
    this.load.audio('drill-burst', 'assets/audio/drill_burst.wav');
    this.load.audio('powerup', 'assets/audio/powerup.wav');
    this.load.audio('blip', 'assets/audio/blip.wav');
    this.load.audio('dead-drill', 'assets/audio/dead-drill.wav');
    this.load.audio('final-level', 'assets/audio/final-level.mp3');
    this.load.audio('victory', 'assets/audio/victory.mp3');
    this.load.audio('hard-mode', 'assets/audio/hard-mode.mp3');
    this.load.audio('rumble', 'assets/audio/rumble.wav');
  },
  create: function() {
    this.state.start('menu');
    // this.state.start('finale');
  }
};
