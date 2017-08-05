var MinerGame = MinerGame || {};

MinerGame.victoryState = function(){};

MinerGame.victoryState.prototype.create = function() {
  // fade in
  this.game.camera.flash(0x000000, 250);

  // stop any currently-playing music
  if (MinerGame.currentTrack) {
    MinerGame.currentTrack.stop();
  }

  // create tilemap
  this.map = this.game.add.tilemap('victory');
  this.map.addTilesetImage('stageTiles', 'outside-tiles');

  // create background and mountain
  this.backgroundLayer = this.map.createLayer('backgroundLayer');
  this.stageLayer = this.map.createLayer('stageLayer');

  // set collisions on stageLayer
  this.map.setCollisionBetween(1, 2000, true, 'stageLayer');

  //  resize game world to match layer dimensions
  this.backgroundLayer.resizeWorld();

  // foreground mist and clouds
  this.clouds = this.game.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'mist');
  this.clouds.autoScroll(-8, 0);
  // particles
  this.cloudParticles = this.game.add.emitter(this.game.world.centerX, this.game.world.height, 400);
  this.cloudParticles.width = this.game.world.width;
  this.cloudParticles.makeParticles('cloud-particle');
  this.cloudParticles.minParticleScale = 0.3;
  this.cloudParticles.maxParticleScale = 1.2;
  this.cloudParticles.alpha = 0.2;
  this.cloudParticles.setYSpeed(-500, -325);
  this.cloudParticles.gravity = 0;
  this.cloudParticles.setXSpeed(-5, 5);
  this.cloudParticles.minRotation = 0;
  this.cloudParticles.maxRotation = 0;
  this.cloudParticles.start(false, 2200, 5, 0);

  // lava splashing
  this.lavaSplash = this.game.add.emitter(this.game.world.centerX, this.game.world.height - 176, 200);
  this.lavaSplash.makeParticles('particle');
  this.lavaSplash.minRotation = 0;
  this.lavaSplash.maxRotation = 0;
  this.lavaSplash.minParticleScale = 0.3;
  this.lavaSplash.maxParticleScale = 1.5;
  this.lavaSplash.setYSpeed(-280, -150);
  this.lavaSplash.gravity = 500;
  this.lavaSplash.start(false, 5000, 20);

  // rumbling noise
  this.rumbling = true;
  this.rumbleSound = this.game.add.audio('rumble');
  this.rumbleSound.play();
  this.rumbleTimer = 0;

  // shaking camera
  this.game.camera.shake(0.01, 3000);
  // after camera is done shaking, volcano erupts and player pops out
  this.game.camera.onShakeComplete.addOnce(this.erupt, this);
};

MinerGame.victoryState.prototype.update = function() {
  if (this.dancer) {
    this.game.physics.arcade.collide(this.dancer, this.stageLayer);
    if (this.dancer.body.velocity.y === 0) {
      // facing right, go left
      if (this.dancer.facing === 'right') {
        this.dancer.animations.play('dance-left', 5, true);
        this.dancer.body.velocity.x = -20;
      } else {
        // facing left, go right
        this.dancer.animations.play('dance-right', 5, true);
        this.dancer.body.velocity.x = 20;
      }
    }

    // switch directions if coming up on the edge
    if (this.dancer.x < this.game.world.centerX - 50) {
      this.dancer.facing = 'left';
    } else if (this.dancer.x > this.game.world.centerX + 50) {
      this.dancer.facing = 'right';
    }
  }

  if (this.rumbling) {
    this.rumbleTimer++;
    if (this.rumbleTimer >= 60) {
      this.rumbleTimer = 0;
      this.rumbleSound.play();
    }
  }

  // show stats and start text
  if (this.victoryText) {
    this.shakeText(this.victoryText, this.game.world.centerX, this.game.world.centerY - 200);
  }
  if (this.startText) {
    this.shakeText(this.startText, this.game.world.centerX, this.game.world.height - 12);
  }
  if (this.statText) {
    this.shakeText(this.statText, this.game.world.centerX, 125);
  }
};

MinerGame.victoryState.prototype.erupt = function() {
  // create dancing player
  this.dancer = this.game.add.sprite(this.game.world.centerX, this.game.world.height - 170, 'player');
  this.dancer.anchor.setTo(0.5, 1);
  this.game.physics.arcade.enable(this.dancer);
  this.dancer.body.gravity.y = 350;
  this.dancer.body.velocity.y = -200;
  this.dancer.frame = 4;
  this.dancer.animations.add('dance-left', [1,3]);
  this.dancer.animations.add('dance-right', [8,10]);
  this.dancer.facing = 'right';

  // play jump sound
  var jumpSound = this.game.add.audio('jump');
  jumpSound.volume -= .5;
  jumpSound.play();

  // start music
  MinerGame.currentTrack = this.game.add.audio('victory');
  MinerGame.currentTrack.loopFull();

  // stop rumbling noise
  this.rumbling = false;
  this.rumbleSound.stop();


  // show VICTORY and stats
  this.victoryText = this.game.add.bitmapText(this.game.world.centerX, this.game.world.centerY - 200, 'carrier_command', '*** VICTORY ***', 32);
  this.victoryText.anchor.setTo(0.5, 0.5);

  // start new game text
  this.startText = this.game.add.bitmapText(this.game.world.centerX, this.game.height - 12, 'carrier_command', 'PRESS \'SPACE\' TO CONTINUE', 12);
  this.startText.anchor.setTo(0.5, 1);

  // stats text
  var crystalPercent = Math.floor(MinerGame.secrets / MinerGame.totalSecrets * 100).toString() + '%';
  if (crystalPercent === '100%' && MinerGame.totalSecrets > MinerGame.secrets) {
    crystalPercent = '99%';
  } else if (crystalPercent === '100%') {
    MinerGame.hardMode = true;
  }
  var stats = 'time: ' + MinerGame.totalTime + ' seconds\n\nDeaths: ' + MinerGame.deaths + '\n\nCrystals: ' + crystalPercent;
  this.statText = this.game.add.bitmapText(this.game.world.centerX, 125, 'carrier_command', stats, 12);
  this.statText.anchor.setTo(0.5, 0.5);

  this.startKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  this.startKey.onDown.add(function() {
    if (this.starting) {
      return;
    }
    this.starting = true;
    MinerGame.currentTrack.stop();
    var startSound = this.add.audio('start_game');
    startSound.volume -= 0.6;
    startSound.play();
    var startTween = this.game.add.tween(this.startText).to({ alpha: 0 }, 100, "Linear", true, 0, -1, true);
    this.game.time.events.add(700, function() {
      this.game.camera.fade(0x000000, 250);
      this.game.camera.onFadeComplete.addOnce(function() {
        this.dancer = null;
        this.starting = false;
        this.game.state.start('continue');
      }, this);
    }, this)
  }, this);

};

MinerGame.victoryState.prototype.shakeText = function(text, x, y) {
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
