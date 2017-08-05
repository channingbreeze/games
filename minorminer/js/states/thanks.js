var MinerGame = MinerGame || {};

// THANKS FOR PLAYING DEMO STATE //
MinerGame.thanksState = function(){};

MinerGame.thanksState.prototype = {
  create: function() {
    // thanks text
    this.thanksText = this.game.add.bitmapText(this.game.world.centerX, 56, 'carrier_command', 'Thanks for playing', 24);
    this.thanksText.anchor.setTo(0.5, 1);

    // credits
    var startY = 100;
    var interval = 20;
    var credits = ['Code, design, and SFx', 'Alex Morris * @ramorris_3\n', 'Tile and character art', 'Luis Zuno * @ansimuz', 'soundtrack', 'Eric Skiff * @ericskiff', 'Made with Phaser.js by @photonstorm'];

    for (var i = 0; i < credits.length; i++) {
      if (i % 2 == 0) {
        startY += interval;
      }
      this.game.add.bitmapText(this.game.world.centerX, startY + (i*interval), 'carrier_command', credits[i], 11).anchor.setTo(0.5, 0.5);
    }

    // animation for fun time
    this.playerSprite = this.game.add.sprite(this.game.world.centerX, this.game.world.height - 110, 'player');
    this.playerSprite.anchor.setTo(0.5, 0.5);
    this.playerSprite.animations.add('run', [0,1,2,1]);
    this.playerSprite.animations.play('run', 10, true);
    this.footstepSound = this.game.add.audio('footstep');
    this.footstepSound.volume = 0.4;

    // create menu text
    this.startText = this.game.add.bitmapText(this.game.camera.x + (this.game.camera.width / 2), this.game.camera.height - 14, 'carrier_command', 'PRESS \'SPACE\' TO CONTINUE', 12);
    this.startText.anchor.setTo(0.5, 1);

    // start button
    var startKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    startKey.onDown.add(function() {
      if (this.resetting) {
        return;
      }
      this.resetting = true;
      if (MinerGame.currentTrack) {
        MinerGame.currentTrack.stop();
        // REPLACE THESE WITH A RESET FUNCTION
        MinerGame.currentTrack = null;
      }
      var startSound = this.add.audio('start_game');
      startSound.volume -= .5;
      startSound.play();
      // menu text fade in and out for 1.5 sec
      var startTween = this.game.add.tween(this.startText).to({ alpha: 0 }, 100, "Linear", true, 0, -1, true);
      // after 1.5 sec, transition to next state
      this.game.time.events.add(700, function() {
        this.resetting = false;
        this.game.state.start('menu');
      }, this);
    }, this);
  },
  update: function() {
    // shake starting text and thanks text
    var randX = Math.random();
    var randY = Math.random();
    if (this.game.time.time % 2) {
      randX *= -1;
      randY *= -1;
    }
    var x = this.game.camera.x + (this.game.camera.width / 2);
    var y = this.game.camera.height - 32;
    this.startText.x = x + randX;
    this.startText.y = y + randY;

    this.thanksText.x = this.game.world.centerX + randX;
    this.thanksText.y = 56 + randY;

    // player sprite footstep sound
    if (this.playerSprite.frame === 0 || this.playerSprite.frame === 2) {
      if (!this.footstepSound.isPlaying) {
        this.footstepSound.play();
      }
    }
  }
}
