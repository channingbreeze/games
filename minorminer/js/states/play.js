var MinerGame = MinerGame || {};

MinerGame.secrets = 0;
MinerGame.totalSecrets = 153;
MinerGame.startTime = MinerGame.startTime || 0;
MinerGame.totalTime = 0;
MinerGame.deaths = 0;
MinerGame.hardModeDeaths = 0;

// GAMEPLAY STATE //
MinerGame.playState = function(){};

MinerGame.playState.prototype = {
  create: function() {
    // fade camera in
    this.game.camera.flash(0x000000, 250);

    // play music
    if (MinerGame.level === '6' && !MinerGame.drillEnabled) {
      if (MinerGame.currentTrack) {
        MinerGame.currentTrack.stop();
      }
    } else if (MinerGame.level === 'final' && MinerGame.newLevel) {
      if (MinerGame.currentTrack) {
        MinerGame.currentTrack.stop();
      }
      MinerGame.newLevel = false;
      MinerGame.currentTrack = this.game.add.audio('final-level');
      MinerGame.currentTrack.loopFull();
    } else if (!MinerGame.currentTrack) {
      var trackKey = 'field1';
      if (MinerGame.hardMode) {
        trackKey = 'hard-mode';
      }
      MinerGame.currentTrack = this.game.add.audio(trackKey);
      MinerGame.currentTrack.volume -= .2;
      MinerGame.currentTrack.loopFull();
    }

    // init sfx
    this.playerDieSound = this.add.audio('player_die');
    this.playerDieSound.volume -= .7;
    this.portalSound = this.add.audio('start_game');
    this.portalSound.volume -= .6;
    this.secretSound = this.add.audio('secret');
    this.secretSound.volume -= .85;
    this.breakBlockSound = this.add.audio('dust');
    this.breakBlockSound.volume -= .3;
    this.springSound = this.add.audio('spring');
    this.springSound.volume -= .5;
    this.drillBurstSound = this.game.add.audio('drill-burst');
    this.drillBurstSound.volume -= .65;
    this.drillBurstSoundClock = 0;
    this.powerupSound = this.game.add.audio('powerup');
    this.powerupSound.volume -= 0.5;
    this.blipSound = this.game.add.audio('blip');
    this.blipSound.volume -= 0.6;

    // init the tile map
    this.map = this.game.add.tilemap(MinerGame.level);
    if (MinerGame.hardMode) {
      this.map.addTilesetImage('stageTiles', 'outside-tiles');
    } else {
      this.map.addTilesetImage('stageTiles', 'tiles');
    }

    // create tilemap layers
    this.backgroundLayer = this.map.createLayer('backgroundLayer');
    this.stageLayer = this.map.createLayer('stageLayer');
    this.trapsLayer = this.map.createLayer('trapsLayer');
    this.fragileLayer = this.map.createLayer('fragileLayer');
    this.springLayer = this.map.createLayer('springLayer');
    this.drillLayer = this.map.createLayer('drillLayer');

    // set collisions on stageLayer, trapsLayer, fragileLayer and springLayer
    this.map.setCollisionBetween(1, 2000, true, 'stageLayer');
    this.map.setCollisionBetween(1, 2000, true, 'trapsLayer');
    this.map.setCollisionBetween(1, 2000, true, 'fragileLayer');
    this.map.setCollisionBetween(1, 2000, true, 'springLayer');
    this.map.setCollisionBetween(1, 2000, true, 'drillLayer');

    // resize game world to match layer dimensions
    this.backgroundLayer.resizeWorld();

    // create items on the stage
    this.createPowerups(); // powerups
    this.createPortal(); // end of level portal
    this.createSecrets(); // collectibles

    // actor/fx rendering layers
    this.game.layers = {
      player: this.game.add.group(),
      foreground: this.game.add.group(),
      effects: this.game.add.group(), // bullets and dust
      ui: this.game.add.group()
    };

    // create block dust effects
    this.blockDust = this.game.add.group();
    this.game.layers.effects.add(this.blockDust); // add to rendering layer
    var i;
    for (i = 0; i < 250; i++) {
      var dust = this.game.add.sprite(0, 0, 'block-dust');
      dust.animations.add('burst');
      dust.kill();
      this.blockDust.add(dust);
    }

    // create drill burst effects
    this.drillBurstGroup = this.game.add.group();
    this.game.layers.effects.add(this.drillBurstGroup);
    for (i = 0; i < 500; i++) {
      var burst = this.game.add.sprite(0, 0, 'drill-particle');
      this.game.physics.arcade.enable(burst);
      // scale up
      burst.scale.set(1.5);
      burst.lifespan = 200;
      burst.kill();
      this.drillBurstGroup.add(burst);
    }

    // create crystal burst effects
    this.crystalBurstGroup = this.game.add.group();
    this.game.layers.effects.add(this.crystalBurstGroup);
    for (i = 0; i < 500; i++) {
      var shine = this.game.add.sprite(0, 0, 'secret-particle');
      this.game.physics.arcade.enable(shine);
      // scale up
      // shine.scale.set(1.5);
      shine.lifespan = 200;
      shine.kill();
      this.crystalBurstGroup.add(shine);
    }

    //create player
    this.input = new MinerGame.Input(this.game);
    var objects = this.findObjectsByType('playerStart', this.map, 'objectsLayer');
    this.player = new MinerGame.Player(this.game, this.input, objects[0].x, objects[0].y);

    // spawn robot if exists
    var robots = this.findObjectsByType('robot', this.map, 'objectsLayer');
    if (robots.length > 0) {
      this.robot = this.game.add.sprite(robots[0].x, robots[0].y, 'robot');
      this.robot.anchor.setTo(0.5, 0.5);
      this.robot.animations.add('hover');
      this.robot.animations.play('hover', 8, true);
      this.game.physics.arcade.enable(this.robot);
      this.robot.body.immovable = true;
    } else {
      this.robot = null;
    }

    //the camera will follow the player in the world
    this.game.camera.follow(this.player);

    // if outside, make clouds
    var floatParticleKey = 'particle';
    if (MinerGame.hardMode) {
      this.clouds = this.game.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'mist');
      this.clouds.autoScroll(-8, 0);
      this.game.layers.foreground.add(this.clouds);
      floatParticleKey = 'cloud-particle';
    }
    // create floating lava/cloud particles
    this.lavaParticles = this.game.add.emitter(this.game.world.centerX, this.game.world.height, 400);
  	this.lavaParticles.width = this.game.world.width;
  	this.lavaParticles.makeParticles(floatParticleKey);
  	this.lavaParticles.minParticleScale = 0.3;
  	this.lavaParticles.maxParticleScale = 1.2;
    this.lavaParticles.alpha = 0.2;
  	this.lavaParticles.setYSpeed(-500, -325);
    this.lavaParticles.gravity = 0;
  	this.lavaParticles.setXSpeed(-5, 5);
  	this.lavaParticles.minRotation = 0;
  	this.lavaParticles.maxRotation = 0;
  	this.lavaParticles.start(false, 2200, 5, 0);
    this.game.layers.foreground.add(this.lavaParticles);

    // make lava splash emitter (for player deaths)
    this.lavaSplash = this.game.add.emitter(0, 0, 200);
    this.lavaSplash.makeParticles('particle');
    this.lavaSplash.minRotation = 0;
    this.lavaSplash.maxRotation = 0;
    this.lavaSplash.minParticleScale = 0.3;
    this.lavaSplash.maxParticleScale = 1.5;
    this.lavaSplash.setYSpeed(-280, -150);
    this.lavaSplash.gravity = 500;
    this.game.layers.foreground.add(this.lavaSplash);

    // make the UI
    // levels
    this.levelText = this.game.add.bitmapText(this.game.camera.width / 2, 12, 'carrier_command', 'lv ' + MinerGame.level, 8);
    this.levelText.anchor.setTo(0.5, 0);
    // secrets %
    var percentage = Math.floor(MinerGame.secrets / MinerGame.totalSecrets * 100).toString() + '%';
    this.secretText = this.game.add.bitmapText(this.game.camera.width - 12, 30, 'carrier_command', 'Crystals: ' + percentage, 8);
    this.secretText.anchor.x = 1;
    if (MinerGame.hardMode) {
      this.secretText.kill();
    }
    // timer
    var time = Math.floor(this.game.time.totalElapsedSeconds() - MinerGame.startTime);
    this.timerText = this.game.add.bitmapText(this.game.camera.width - 12, 12, 'carrier_command', 'time: ' + time, 8);
    this.timerText.anchor.setTo(1, 0);
    // keep HUD fixed to camera
    this.game.layers.ui.add(this.levelText);
    this.game.layers.ui.add(this.secretText);
    this.game.layers.ui.add(this.timerText);
    this.game.layers.ui.fixedToCamera = true;

    // tutorial text
    this.resetTutText();
    this.skipBtn = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.skipBtn.onDown.add(function() {
      if (this.drawTutText) {
        this.resetTutText();
      }
    }, this);

    if (MinerGame.newLevel) {
      MinerGame.newLevel = false;
      if (MinerGame.level === '1') {
        this.drawTutorialText(['WELCOME MINER!',
        'My name is A5IM0V-pr1m3.', 'clearly, I am a robot.',
        'I see that you are lost.',
        'That was my doing...','You see, my plan is to\n\nlead you mindlessly from\n\nroom to room with those\n\ngreen portals until you\n\neither give up or die!', 'HAHAHAHAHA!!1!*!!!1!!\n\nso evil!!', '...',  'You *might* get out alive\n\nif you run with the arrow\n\nkeys and jump with \'x\'.', '...so fun...', 'Try not to die, you\n\nmiserable yellow\n\ncreature.', '<3']);
      } else if (MinerGame.level === '1 hard') {
        this.drawTutorialText(['Ugh! You disgust me, human.',
        'But your tenacity is\n\nquite remarkable.', '...', 'I\'ve decided to keep\n\nyou as a pet!', 'A greasy, ugly,\n\nfascinating pet\n\nhuman.', 'Don\'t try to run\n\naway, biped.', 'You\'ll never make\n\nit out alive!!!1!', 'ahahahahaaha\n\nhahahahaheha\n\nshhnahf!!@!!\n\n@!@#!!#!', 'ha!']);
      }
    }
  },
  update: function() {
    // stage collisions
    this.game.physics.arcade.collide(this.player, this.stageLayer);
    // traps collisions
    this.game.physics.arcade.collide(this.player, this.trapsLayer, this.playerTrapHandler, null, this);
    // collision with fragile blocks
    this.game.physics.arcade.collide(this.player,
    this.fragileLayer, this.playerFragileHandler, null, this);
    // collision with spring blocks
    this.game.physics.arcade.collide(this.player,
    this.springLayer, this.playerSpringHandler, null, this);
    // collision with drill blocks
    this.game.physics.arcade.collide(this.player, this.drillLayer, this.drillBlockHandler, null, this);
    // portal to next level
    this.game.physics.arcade.collide(this.player, this.portals, this.playerPortalHandler, null, this);
    // secret collectible
    this.game.physics.arcade.overlap(this.player, this.secrets, this.playerSecretHandler, null, this);
    // powerup
    this.game.physics.arcade.overlap(this.player, this.powerups, this.playerPowerupHandler, null, this);
    // robot
    if (this.robot) {
      this.game.physics.arcade.overlap(this.player, this.robot, this.playerRobotHandler, null, this);
    }

    // timer
    this.updateTimerText();

    // tutText
    this.tutTextUpdate();

    // shake death text
    this.shakeText(this.tutText);
    this.shakeText(this.skipText, this.game.world.centerX, this.game.height - 12);
  }
  // debugging
  // render: function() {
  //   this.game.debug.body(this.player);
  // }
};

// COLLISION HANDLERS //

MinerGame.playState.prototype.playerPortalHandler = function(player, portal) {
  portal.body.velocity.x = 0;
  portal.body.velocity.y = 0;
  // flag to disable portalHandler (multiple portals)
  if (this.transporting) {
    return;
  }
  this.transporting = true;

  // flag that the state is resetting because of a new level (for tut text)
  MinerGame.newLevel = true;

  // stop following player with camera
  this.game.camera.unfollow();
  // destroy player drill
  player.drill.pendingDestroy = true;
  // make green particles
  this.drillBurst(portal.centerX, portal.centerY);
  // destroy player and portal
  portal.pendingDestroy = true;
  player.pendingDestroy = true;
  // save secrets collected
  MinerGame.secrets += player.secrets;
  // play warp sound
  this.portalSound.play();
  // add player warp sprite
  var key = 'player-warp';
  if (MinerGame.hardMode) {
    key = 'player-speedo-warp';
  }
  var playerWarp = this.game.add.sprite(portal.centerX, portal.centerY, key);
  playerWarp.anchor.setTo(0.5, 0.5);
  playerWarp.animations.add('warp');
  playerWarp.animations.play('warp', 25, false, true);
  // start next level on warp animation end
  playerWarp.events.onAnimationComplete.addOnce(function() {
    this.game.camera.fade(0x000000, 100);
    this.game.camera.onFadeComplete.addOnce(function() {
      MinerGame.level = portal.targetTilemap;
      this.lavaParticles = null;
      this.lavaSplash = null;
      this.transporting = false;
      if (MinerGame.level === 'end') {
        MinerGame.totalTime = Math.floor(this.game.time.totalElapsedSeconds() - MinerGame.startTime);
        this.game.state.start('victory');
      } else {
        this.game.state.start(this.game.state.current);
      }
    }, this);
  }, this);
};

MinerGame.playState.prototype.playerSecretHandler = function(player, secret) {
  // crystal particles
  this.crystalBurst(secret.centerX, secret.centerY);
  // destroy secret
  secret.pendingDestroy = true;
  // increment secrets (saves at end of level, resets if player dies)
  player.secrets++;
  this.updateSecretText(MinerGame.secrets + player.secrets);
};

MinerGame.playState.prototype.playerTrapHandler = function(player, trap) {
  // kill drill
  player.drill.pendingDestroy = true;
  //camera stops following player
  this.game.camera.unfollow();
  // player dies
  player.pendingDestroy = true;

  // increment death count
  if (MinerGame.hardMode) {
    MinerGame.hardModeDeaths++;
  } else {
    MinerGame.deaths++;
  }

  // shake camera
  // this.startCameraShake();

  // show some text, if not already showing any
  if (!this.drawTutText) {
    var text = '';
    var rand = Math.random();
    if (rand < 0.1) {
      text = 'HAHAHAHA';
    } else if (rand < 0.2) {
      text = 'OUCHIE :[';
    } else if (rand < 0.3) {
      text = 'Try again T.T';
    } else if (rand < 0.4){
      text = 'You win! JK you died.';
    } else if (rand < 0.5) {
      text = '*burp*';
    } else if (rand < 0.6) {
      text = 'come on now :[';
    } else if (rand < 0.7) {
      text = 'What is... feeling?';
    } else if (rand < 0.8) {
      text = 'Juicy';
    } else if (rand < 0.9) {
      text = 'nice try, you got this <3';
    } else {
      text = 'You\'re breaking my <3';
    }
    this.deathText = this.game.add.bitmapText(this.game.camera.x + (this.game.camera.width / 2), this.game.camera.y + (this.game.camera.height / 2), 'carrier_command', text, 12);
    this.deathText.anchor.setTo(0.5, 0.5);
  }

  // play death sound
  this.playerDieSound.play();


  // start lava splash
  this.lavaSplash.x = player.x;
  this.lavaSplash.y = player.bottom + 8;
  this.lavaSplash.start(false, 5000, 20);

  // shake the camera
  this.game.camera.shake(0.004, 1200);
  this.game.camera.onShakeComplete.addOnce(function() {
    // restart level after camera shake
    this.game.camera.fade(0x000000, 250);
    this.game.camera.onFadeComplete.addOnce(function() {
      this.game.state.start(this.game.state.current);
    }, this);
  }, this);
};

MinerGame.playState.prototype.playerFragileHandler = function(player, block) {
  // block disappears after .25 seconds
  this.game.time.events.add(250, function() {
    // play block breaking sound
    if (!this.breakBlockSound.isPlaying) {
      this.breakBlockSound.play();
    }
    // make block dust
    var dust = this.blockDust.getFirstDead();
    dust.reset(block.worldX, block.worldY);
    dust.animations.play('burst', 20, false, true);
    // store block index so we can replace it later
    var index = block.index;
    this.map.removeTile(block.x, block.y, 'fragileLayer');
    // replace block 1.5s after it disappears
    this.game.time.events.add(1500, function() {
      // make dust when block comes back
      var dust = this.blockDust.getFirstDead();
      dust.reset(block.worldX, block.worldY);
      dust.animations.play('burst', 20, false, true);
      // play dust sound again
      if (!this.breakBlockSound.isPlaying) {
        this.breakBlockSound.play();
      }
      // place the block
      this.map.putTile(index, block.x, block.y, 'fragileLayer');
    }, this);
  }, this);
};

MinerGame.playState.prototype.drillBlockHandler = function(player, block) {
  if(!player.drilling) {
    return;
  }
  // recharge player's drill
  player.drillCharge = player.maxDrillCharge;

  // play breaking block sound
  if (!this.breakBlockSound.isPlaying) {
    this.breakBlockSound.play();
  }
  // make block dust
  var dust = this.blockDust.getFirstDead();
  dust.reset(block.worldX, block.worldY);
  dust.animations.play('burst', 20, false, true);
  // make drill particle effect
  this.drillBurst(block.worldX + block.width / 2, block.worldY + block.height / 2);
  // remove block
  this.map.removeTile(block.x, block.y, 'drillLayer');
};

MinerGame.playState.prototype.playerSpringHandler = function(player, block) {
  // player has to hit from the top of the block
  if (player.bottom > block.top) {
    return;
  }

  // player bounces high
  player.body.velocity.y = -400;
  player.spring = true; // disable player jump...
  // play spring noise
  if (!this.springSound.isPlaying) {
    this.springSound.play();
  }
};

MinerGame.playState.prototype.playerPowerupHandler = function(player, powerup) {
  this.drillBurst(powerup.x, powerup.y);
  powerup.pendingDestroy = true;
  MinerGame.drillEnabled = true;
  player.battery.revive();
  // play powerup sound
  this.powerupSound.play();
  // change music
  MinerGame.currentTrack = this.game.add.audio('field2');
  MinerGame.currentTrack.volume -= .3;
  MinerGame.currentTrack.loopFull();

  // freeze player
  this.player.paused = true;

  // show drill tutorial
  this.drawTutorialText(['wowee, You got the laser drill...', '>:[',
  'I\'m so depresse--I mean happy\n\nyou made it this far.',
  'OK, more advice.',
  'Hold \'z\' to use the drill.\n\nBut be aware That it will \n\nrun out of charge if you\n\nuse it in air for too\n\nlong.',
  'So touch the ground or drill\n\ngreen blocks to recharge it,\n\nand keep an eye on your\n\nbattery in the top-left, ok?',
  'be careful!  It has the\n\nworst battery invented...\n\nReally, though.  It sucks.',
  '...',
  '>:D',
  'So long, ugly humanoid!\n\nmay we never meet again!'
  ]);
};

MinerGame.playState.prototype.playerRobotHandler = function(player, robot) {
  console.log('player robot collisions');
  if (player.currentState != player.drillState) {
    return;
  }
  MinerGame.hardModeTime = Math.floor(this.game.time.totalElapsedSeconds() - MinerGame.startTime);
  this.game.state.start('finale');
};

// GAMEPLAY STATE UTILITIES //

/* map creation */
MinerGame.playState.prototype.findObjectsByType = function(type, map, layer) {
  var result = new Array();

  map.objects[layer].forEach(function(element){
    if(element.type === type) {
      //Phaser uses top left, Tiled bottom left so we have to adjust the y position
      element.y -= map.tileHeight;
      result.push(element);
    }
  });
  return result;
};

MinerGame.playState.prototype.createFromTiledObject = function(element, group) {
  var sprite = group.create(element.x, element.y, element.properties.sprite);
  //copy all properties to the sprite
  Object.keys(element.properties).forEach(function(key){
    sprite[key] = element.properties[key];
  });

  // play animation
  if (sprite.animated) {
    sprite.animations.add('default');
    sprite.animations.play('default', 10, true);
  }
};

MinerGame.playState.prototype.createPowerups = function() {
  // create items
  if (MinerGame.drillEnabled) {
    return;
  }
  this.powerups = this.game.add.group();
  this.powerups.enableBody = true;
  var result = this.findObjectsByType('powerup', this.map, 'objectsLayer');
  result.forEach(function(element){
    this.createFromTiledObject(element, this.powerups);
  }, this);
};

MinerGame.playState.prototype.createPortal = function() {
  // create end-of-level portal
  this.portals = this.game.add.group();
  this.portals.enableBody = true;
  var result = this.findObjectsByType('portal', this.map, 'objectsLayer');
  result.forEach(function(element){
    this.createFromTiledObject(element, this.portals);
  }, this);
};

MinerGame.playState.prototype.createSecrets = function() {
  // create secret pickups for unlocking content
  this.secrets = this.game.add.group();
  this.secrets.enableBody = true;
  var result = this.findObjectsByType('secret', this.map, 'objectsLayer');
  result.forEach(function(element) {
    this.createFromTiledObject(element, this.secrets);
  }, this);
};

MinerGame.playState.prototype.updateSecretText = function(numSecrets) {
  var percentage = Math.floor(numSecrets / MinerGame.totalSecrets * 100).toString() + '%';
  // edge case
  if (MinerGame.totalSecrets > numSecrets && percentage === '100%') {
    percentage = '99%';
  }
  this.secretText.text = 'crystals: ' + percentage;
};

MinerGame.playState.prototype.updateTimerText = function() {
  var time = Math.floor(this.game.time.totalElapsedSeconds() - MinerGame.startTime);
  this.timerText.text = 'time: ' + time;
};

MinerGame.playState.prototype.drawTutorialText = function(lines) {
  // pause player
  this.player.currentState = this.player.pausedState;

  // init tutorial text
  this.tutText = this.game.add.bitmapText(this.game.camera.x + (this.game.camera.width / 2), this.game.camera.y + (this.game.camera.height / 2), 'carrier_command', '', 12);
  this.tutText.anchor.setTo(0.5, 0.5);

  // show skip text
  this.skipText =
  this.game.add.bitmapText(this.game.camera.x + (this.game.camera.width / 2),
  this.game.camera.height - 12, 'carrier_command', 'press \'space\' to skip tutorial', 12);
  this.skipText.anchor.setTo(0.5, 1);

  // tutorial text vars and timers
  this.charClock = 0;
  this.charTimer = 0;
  this.currCharIndex = 0;
  this.lineClock = 0;
  this.lineTimer = 0;
  this.currLineIndex = 0;
  this.lines = lines;
  this.currLine = lines[0];
  this.drawTutText = true; // flag for update loop
};

MinerGame.playState.prototype.tutTextUpdate = function() {
  if (!this.drawTutText) {
    return;
  }

  // increment by chars
  this.charClock++;
  // update every 3 frames
  if (this.charClock > this.charTimer + 3 && !this.charsPaused) {
    // advance to next char and reset timer
    this.charTimer = this.charClock;
    this.tutText.text += this.currLine[this.currCharIndex];
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
        this.tutText.text = '';
        this.currCharIndex = 0;
      } else { // at end of lines, nothing more to read
        this.resetTutText();
      }
    }
  }
};

MinerGame.playState.prototype.resetTutText = function() {
  if (this.tutText) {
    this.tutText.pendingDestroy = true;
  }
  if (this.skipText) {
    this.skipText.pendingDestroy = true;
  }
  this.player.currentState = this.player.groundState;
  this.drawTutText = false;
  this.charsPaused = false;
}

// shoot a radius of drill particles
MinerGame.playState.prototype.drillBurst = function(x, y) {
  // play sound
  if (this.game.time.time > this.drillBurstSoundClock + 50) {
    this.drillBurstSound.play();
    this.drillBurstSoundClock = this.game.time.time;
  }
  for (var i = 0; i < 8; i++) {
    var part = this.drillBurstGroup.getFirstDead();
    // revive and position
    part.revive();
    part.reset(x, y);
    // shoot out
    this.game.physics.arcade.velocityFromAngle(i*45, 300, part.body.velocity);
    part.angle = i*45;
    part.lifespan = 150;
  }
};

MinerGame.playState.prototype.crystalBurst = function(x, y) {
  // play sound
  this.secretSound.play();
  for (var i = 0; i < 8; i++) {
    var part = this.crystalBurstGroup.getFirstDead();
    // revive and position
    part.revive();
    part.reset(x, y);
    // shoot out
    this.game.physics.arcade.velocityFromAngle(i*45, 150, part.body.velocity);
    part.angle = i*45;
    part.lifespan = 50;
  }
}

// update function for shaking text
MinerGame.playState.prototype.shakeText = function(text, x, y) {
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
