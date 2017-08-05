var MinerGame = MinerGame || {};

MinerGame.continueState = function(){};

MinerGame.continueState.prototype.create = function() {
  // FOR debugging
  // MinerGame.hardMode = false;

  // audio
  this.blipSound = this.game.add.audio('blip');
  this.blipSound.volume -= 0.6;

  // conditional text
  this.lines = ['To be continued...?', '>:D'];
  if (MinerGame.hardMode) {
    this.lines = ['Wait, what?!\n\nWhat\'s going on?!', '>:O'];
  }

  // robot text
  this.robotText = this.game.add.bitmapText(this.game.world.centerX, this.game.world.centerY, 'carrier_command', '', 12);
  this.robotText.anchor.setTo(0.5, 0.5);

  // robot text vars and timers
  this.charClock = 0;
  this.charTimer = 0;
  this.currCharIndex = 0;
  this.lineClock = 0;
  this.lineTimer = 0;
  this.currLineIndex = 0;
  this.currLine = this.lines[0];
  this.charsPaused = false;
};

MinerGame.continueState.prototype.update = function() {
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
    if (this.lineClock > this.lineTimer + 120) { // 60 frames == ~1 sec
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
        // move to next state
        if (MinerGame.hardMode) {
          // upgrade the playerrrrr
          this.game.state.start('upgrade');
        } else {
          this.game.state.start('thanks');
        }
      }
    }
  }

  this.shakeText(this.robotText);
};

// update function for shaking text
MinerGame.continueState.prototype.shakeText = function(text, x, y) {
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
