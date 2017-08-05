var MinerGame = MinerGame || {};

MinerGame.finaleState = function(){};

MinerGame.finaleState.prototype.create = function() {
  // stop music
  if (MinerGame.currentTrack) {
    MinerGame.currentTrack.stop();
  }
  MinerGame.currentTrack = null;

  // camera fade in
  this.game.camera.flash(0x000000, 250);

  // create tilemap
  this.map = this.game.add.tilemap('victory');
  this.map.addTilesetImage('stageTiles', 'outside-tiles');

  // create background and mountain
  this.backgroundLayer = this.map.createLayer('backgroundLayer');
  this.stageLayer = this.map.createLayer('stageLayer');

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

  // add robot
  this.robot = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'robot');
  this.robot.anchor.setTo(0.5, 0.5);
  this.robot.animations.add('hover');
  this.robot.animations.play('hover', 8, true);

  // add little explosions
  this.smokeTimer = 0;
  this.exploding = true;
  this.smokes = this.game.add.group();
  for (var i = 0; i < 50; i++) {
    var smoke = this.game.add.sprite(0, 0, 'dust');
    this.game.physics.arcade.enable(smoke);
    smoke.animations.add('float');
    smoke.anchor.setTo(0.5, 0.4);
    smoke.exists = false;
    this.smokes.add(smoke);
  }

  // add player
  this.player = this.game.add.sprite(this.game.world.centerX, this.game.world.height - 184, 'player-speedo');
  this.player.anchor.setTo(0.5, 0.5);
  this.player.frame = 5;
  this.player.animations.add('dance', [5,6,4,6]);

  // audio
  this.smokeSound = this.game.add.audio('dust');
  this.smokeSound.volume -= .4;
  this.blipSound = this.game.add.audio('blip');
  this.blipSound.volume -= 0.6;
  this.explodeSound = this.add.audio('player_die');
  this.explodeSound.volume -= 0.7;

  // init robot text
  // init tutorial text
  this.robotText = this.game.add.bitmapText(this.game.world.centerX, this.game.world.centerY + 200, 'carrier_command', '', 12);
  this.robotText.anchor.setTo(0.5, 0.5);

  this.charClock = 0;
  this.charTimer = 0;
  this.currCharIndex = 0;
  this.lineClock = 0;
  this.lineTimer = 0;
  this.currLineIndex = 0;
  this.lines = ['Why would you do this to me?', 'I thought we were going\n\nto grow old together.', '</3 </3 </3'];
  this.currLine = this.lines[0];
  this.drawText = true;
};

MinerGame.finaleState.prototype.update = function() {
  // animate smoking robot
  if (this.exploding) {
    this.robot.x = this.game.world.centerX + Math.random();
    this.robot.y = this.game.world.centerY + Math.random();
    this.smokeTimer++;
    if (this.smokeTimer % 15 === 0) {
      this.smokeBall();
    }
    if (this.smokeTimer % 24 === 0) {
      this.smokeBall();
    }
  }

  // draw robot's last words
  if (this.drawText && this.robotText) {
    this.robotText.x = this.game.world.centerX + Math.random() * 2;
    this.robotText.y = this.game.world.centerY + 200 + Math.random() * 2;
    // increment by chars
    this.charClock++;
    // update every 3 frames
    if (this.charClock > this.charTimer + 3 && !this.charsPaused) {
      // advance to next char and reset timer
      this.charTimer = this.charClock;
      this.robotText.text += this.currLine[this.currCharIndex];
      this.currCharIndex++;
      this.blipSound.play();
    }

    // at the end of a line, pause reading chars and advance to next line
    if (this.currCharIndex > this.currLine.length - 1) {
      this.charsPaused = true;
      // wait...
      this.lineClock++;
      if (this.lineClock > this.lineTimer + 80) { // 60 frames, 1 sec
        this.currLineIndex++;
        if (this.currLineIndex < this.lines.length) {
          // reset timers, advance to next line, unpause char parsing
          this.lineTimer = this.lineClock;
          this.currLine = this.lines[this.currLineIndex];
          this.charsPaused = false;
          // reset tut text and char ind pointer
          this.robotText.text = '';
          this.currCharIndex = 0;
        } else { // at end of lines, nothing more to read
          this.drawText = false;
          this.robotText.kill();
          this.charsPaused = false;
          this.explode();
        }
      }
    }
  }

  // shake victory text, stats, and start text
  this.shakeText(this.victoryText, this.game.world.centerX, this.game.world.centerY - 200);
  this.shakeText(this.statText, this.game.world.centerX, 125);
  this.shakeText(this.startText, this.game.world.centerX, this.game.height - 12);
};

MinerGame.finaleState.prototype.smokeBall = function() {
  // place smoke puff
  var smoke = this.smokes.getFirstExists(false);
  smoke.reset(this.robot.x + Math.random() * 24 - 12, this.robot.y + Math.random() * 32 - 16);
  smoke.animations.play('float', 10, false, true);
  smoke.body.velocity.y = -75;
  // play sound
  this.smokeSound.play();
};

MinerGame.finaleState.prototype.explode = function() {
  this.exploding = false;
  // destroy robot
  this.robot.pendingDestroy = true;

  // play noise
  this.explodeSound.play();

  // shiny particles
  for (i = 0; i < 8; i++) {
    var shine = this.game.add.sprite(this.robot.x, this.robot.y, 'particle');
    this.game.physics.arcade.enable(shine);
    shine.scale.set(3);
    shine.lifespan = 200;
    shine.anchor.setTo(0.5, 0.5);
    this.game.physics.arcade.velocityFromAngle(i*45, 400, shine.body.velocity);
    shine.angle = i*45;
    shine.lifespan = 200;
  }

  // make bigger explosion
  for (var i = 0; i < 10; i++) {
    var x = this.robot.x + Math.random() * 24 - 12;
    var y = this.robot.y + Math.random() * 32 - 16;
    var dust = this.game.add.sprite(x, y, 'block-dust');
    this.game.physics.arcade.enable(dust);
    dust.body.velocity.y = -30;
    dust.animations.add('float');
    dust.animations.play('float', 10, false, true);
  }

  // make player dance
  this.player.animations.play('dance', 8, true);

  // start happy music
  MinerGame.currentTrack = this.game.add.audio('victory');
  MinerGame.currentTrack.loopFull();

  // show stats, continue text, etc.
  // show VICTORY and stats
  this.victoryText = this.game.add.bitmapText(this.game.world.centerX, this.game.world.centerY - 200, 'carrier_command', '*** hard mode VICTORY ***', 20);
  this.victoryText.anchor.setTo(0.5, 0.5);

  // start new game text
  this.startText = this.game.add.bitmapText(this.game.world.centerX, this.game.height - 12, 'carrier_command', 'PRESS \'SPACE\' TO CONTINUE', 12);
  this.startText.anchor.setTo(0.5, 1);

  // stats text
  var stats = 'hard mode time: ' + MinerGame.hardModeTime + ' seconds\n\nhard mode Deaths: ' + MinerGame.hardModeDeaths + '\n\n\n\ntotal time: ' + (MinerGame.hardModeTime + MinerGame.totalTime).toString() + ' seconds\n\ntotal deaths: ' + (MinerGame.hardModeDeaths + MinerGame.deaths).toString();
  this.statText = this.game.add.bitmapText(this.game.world.centerX, 125, 'carrier_command', stats, 12);
  this.statText.anchor.setTo(0.5, 0.5);

  // start key
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
        this.game.state.start('thanks');
      }, this);
    }, this)
  }, this);
};

MinerGame.finaleState.prototype.shakeText = function(text, x, y) {
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
};
