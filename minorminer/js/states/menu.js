var MinerGame = MinerGame || {};

// MAIN MENU STATE //
MinerGame.menuState = function(){};

MinerGame.menuState.prototype = {
  create: function() {
    // play music
    var music = this.game.add.audio('intro');
    music.loopFull(0.8);

    // create background
    this.map = this.game.add.tilemap('menu');
    this.map.addTilesetImage('lavaTiles', 'tiles');
    this.map.createLayer('lavaLayer').resizeWorld();

    // create player image on background
    this.game.add.sprite(this.game.world.centerX - 8, this.game.world.centerY + 48, 'player').frame = 5;


    // create lava splasher and effects
    var lavaParticles = this.game.add.emitter(this.game.world.centerX, this.game.height, 400);
    lavaParticles.width = this.game.world.width;
    lavaParticles.makeParticles('particle');
    lavaParticles.minParticleScale = 0.3;
    lavaParticles.maxParticleScale = 1.2;
    lavaParticles.setYSpeed(-500, -325);
    lavaParticles.alpha = 0.2;
    lavaParticles.gravity = 0;
    lavaParticles.setXSpeed(-5, 5);
    lavaParticles.minRotation = 0;
    lavaParticles.maxRotation = 0;
    lavaParticles.start(false, 2200, 5, 0);

    this.lavaSplash = this.game.add.emitter(0, 0, 200);
    this.lavaSplash.y = this.game.height - 28;
    this.lavaSplash.makeParticles('particle');
    this.lavaSplash.minRotation = 0;
    this.lavaSplash.maxRotation = 0;
    this.lavaSplash.minParticleScale = 0.3;
    this.lavaSplash.maxParticleScale = 1.5;
    this.lavaSplash.setYSpeed(-280, -150);
    this.lavaSplash.gravity = 500;


    // create logo
    this.titleText = this.game.add.bitmapText(this.game.world.centerX, this.game.world.centerY, 'carrier_command', 'MINOR MINER', 32);
    this.titleText.anchor.setTo(0.5, 0.5);

    // create menu text
    this.startText = this.game.add.bitmapText(this.game.world.centerX, this.game.height - 150, 'carrier_command', 'PRESS \'X\' TO START', 12);
    this.startText.anchor.setTo(0.5, 0.5);

    // cred
    this.game.add.bitmapText(this.game.world.centerX, this.game.height - 12, 'carrier_command', 'A game by alex morris', 8).anchor.setTo(0.5, 0.5);

    // start button
    var startKey = this.game.input.keyboard.addKey(Phaser.Keyboard.X);
    startKey.onDown.add(function() {
      if (this.starting) {
        return;
      }
      this.starting = true;
      music.stop();
      var startSound = this.add.audio('start_game');
      startSound.volume -= .6;
      startSound.play();
      // menu text fade in and out for 1.5 sec
      var startTween = this.game.add.tween(this.startText).to({ alpha: 0 }, 100, "Linear", true, 0, -1, true);
      // after 1.5 sec, transition to next state
      this.game.time.events.add(700, function() {
        this.game.camera.fade(0x000000, 250);
        MinerGame.currentTrack = null;
        MinerGame.newLevel = true;
        MinerGame.hardModeTime = 0;
        MinerGame.hardModeDeaths = 0;
        // CHANGE FOR DEBUGGING/TESTING LEVELS //
        MinerGame.hardMode = false; // false
        MinerGame.level = '1'; // 1
        MinerGame.drillEnabled = false; // false
        // LEVEL TESTING //
        MinerGame.startTime = this.game.time.totalElapsedSeconds();
        MinerGame.deaths = 0;
        MinerGame.secrets = 0;
        this.game.camera.onFadeComplete.addOnce(function() {
          this.starting = false;
          this.game.state.start('play');
        }, this);
      }, this);
    }, this);
  },
  update: function() {
    if (Math.random() > 0.97 && !this.lavaSplash.on) {
      this.lavaSplash.x = Math.floor(Math.random() * this.game.width);
      this.lavaSplash.start(false, 5000, 20);
      this.game.time.events.add(700, function() {
        this.lavaSplash.on = false;
      }, this);
    }

    this.shakeText(this.titleText);
    this.shakeText(this.startText, null, this.game.world.height - 150);

  },
  shakeText: function(text, x, y) {
    if (text) {
      var randX = Math.random();
      var randY = Math.random();
      if (this.game.time.time % 2) {
        randX *= -1;
        randY *= -1;
      }

      x = x || this.game.camera.x + (this.game.camera.width / 2);
      y = y || this.game.camera.y + (this.game.camera.height / 2);
      text.x = x + randX;
      text.y = y + randY;
    }
  }
};
