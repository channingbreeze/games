var MinerGame = MinerGame || {};

MinerGame.upgradeState = function(){};
MinerGame.hardMode = true;

MinerGame.upgradeState.prototype.create = function() {
  // audio
  this.burstSound = this.game.add.audio('spring');
  this.burstSound.volume -= .7;
  this.upgradedSound = this.game.add.audio('drill-burst');
  this.upgradedSound.volume = .4;

  // create player animation
  this.player = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'player');
  this.player.anchor.setTo(0.5, 0.5);
  this.player.animations.add('upgrade', [5,6,4,6]);
  this.player.animations.play('upgrade', 8, true);

  // init particles
  this.crystalBurstGroup = this.game.add.group();
  for (i = 0; i < 1000; i++) {
    var shine = this.game.add.sprite(0, 0, 'secret-particle');
    this.game.physics.arcade.enable(shine);
    shine.scale.set(2);
    shine.lifespan = 200;
    shine.anchor.setTo(0.5, 0.5);
    shine.kill();
    this.crystalBurstGroup.add(shine);
  }
  this.crystalBurstTimer = 0;
  this.crystalBurstInterval = 30;

  this.upgrading = true
};

MinerGame.upgradeState.prototype.update = function() {
  if (this.upgrading) {
    this.crystalBurstTimer++;
    if (this.crystalBurstTimer > this.crystalBurstInterval) {
      this.particleBurst();
      this.crystalBurstInterval -= 2;
      this.crystalBurstTimer = 0;
    }

    if (this.crystalBurstInterval <= 0) {
      // stop player from dancing, play a sound, set a timeout to move to next game state
      this.upgrading = false;
      this.player.pendingDestroy = true;
      var speedo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'player-speedo')
      speedo.anchor.setTo(0.5, 0.5);
      speedo.frame = 6;

      // play music and audio
      this.upgradedSound.play();
      MinerGame.currentTrack = this.game.add.audio('hard-mode');
      MinerGame.currentTrack.volume -= 2;
      MinerGame.currentTrack.loopFull();

      // add hard-mode text
      // thanks text
      this.hardText = this.game.add.bitmapText(this.game.world.centerX, this.game.world.centerY - 150, 'carrier_command', 'HARD MODE UNLOCKED', 24);
      this.hardText.anchor.setTo(0.5, 1);

      // add instructions
      this.powerupText = this.game.add.bitmapText(this.game.world.centerX, this.game.world.centerY + 150, 'carrier_command', 'Your laser drill now has infinite charge', 12);
      this.powerupText.anchor.setTo(0.5, 0);

      // add battery sprite
      this.battery = this.game.add.image(12, 12, 'infinite-battery');
      this.battery.anchor.setTo(0, 0.5);

      this.game.time.events.add(4000, function() {
        this.game.camera.fade(0x000000, 100);
        this.game.camera.onFadeComplete.addOnce(function() {
          MinerGame.startTime = this.game.time.totalElapsedSeconds();
          MinerGame.hardModeDeaths = 0;
          MinerGame.secrets = 0;
          MinerGame.level = '1 hard';
          MinerGame.drillEnabled = true;
          this.game.state.start('play');
        }, this);
      }, this);
    }
  }

  if (this.powerupText) {
    var randX = Math.random();
    var randY = Math.random();
    if (Math.random() < 0.5) {
      randX *= -1;
      randY *= -1;
    }
    this.hardText.x = this.game.world.centerX + randX;
    this.hardText.y = this.game.world.centerY - 150 + randY;

    this.powerupText.x = this.game.world.centerX + randX;
    this.powerupText.y = this.game.world.centerY + 150 + randY;
  }
};

MinerGame.upgradeState.prototype.particleBurst = function() {
  // play sound
  this.burstSound.play();

  // revive 8 crystals and shoot them out
  for (var i = 0; i < 8; i++) {
    var part = this.crystalBurstGroup.getFirstDead();
    // revive and position
    part.revive();
    part.reset(this.game.world.centerX, this.game.world.centerY);
    // shoot out
    this.game.physics.arcade.velocityFromAngle(i*45, 300, part.body.velocity);
    part.angle = i*45;
    part.lifespan = 350;
  }
};
