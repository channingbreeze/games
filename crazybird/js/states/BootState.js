
var Phaser = Phaser || {};
var CrazyBird = CrazyBird || {};

CrazyBird.BootState = function () {
  "use strict";
  CrazyBird.BaseState.call(this);
};

Phaser.World.prototype.displayObjectUpdateTransform = function() {
  if(!game.scale.correct) {
    this.x = game.camera.y + game.width;
    this.y = -game.camera.x;
    this.rotation = Phaser.Math.degToRad(Phaser.Math.wrapAngle(90));
  } else {
    this.x = -game.camera.x;
    this.y = -game.camera.y;
    this.rotation = 0;
  }

  PIXI.DisplayObject.prototype.updateTransform.call(this);
}

/**
* Called by Pointer when drag starts on this Sprite. Should not usually be called directly.
*
* @method Phaser.InputHandler#startDrag
* @param {Phaser.Pointer} pointer
*/
Phaser.InputHandler.prototype.startDrag = function (pointer) {

  var x = this.sprite.x;
  var y = this.sprite.y;

  this.isDragged = true;
  this._draggedPointerID = pointer.id;

  this._pointerData[pointer.id].camX = this.game.camera.x;
  this._pointerData[pointer.id].camY = this.game.camera.y;

  this._pointerData[pointer.id].isDragged = true;

  if (this.sprite.fixedToCamera) {
    if (this.dragFromCenter) {
      var bounds = this.sprite.getBounds();

      this.sprite.cameraOffset.x = this.globalToLocalX(pointer.x) + (this.sprite.cameraOffset.x - bounds.centerX);
      this.sprite.cameraOffset.y = this.globalToLocalY(pointer.y) + (this.sprite.cameraOffset.y - bounds.centerY);
    }

    this._dragPoint.setTo(this.sprite.cameraOffset.x - pointer.x, this.sprite.cameraOffset.y - pointer.y);
  } else {
    if (this.dragFromCenter) {
        var bounds = this.sprite.getBounds();

        this.sprite.x = this.globalToLocalX(pointer.x) + (this.sprite.x - bounds.centerX);
        this.sprite.y = this.globalToLocalY(pointer.y) + (this.sprite.y - bounds.centerY);
    }

    if(game.scale.correct) {
      this._dragPoint.setTo(this.sprite.x - this.globalToLocalX(pointer.x), this.sprite.y - this.globalToLocalY(pointer.y));
    } else {
      this._dragPoint.setTo(-this.sprite.y - this.globalToLocalX(pointer.x), this.sprite.x - this.globalToLocalY(pointer.y));
    }
  }

  this.updateDrag(pointer, true);

  if (this.bringToTop) {
      this._dragPhase = true;
      this.sprite.bringToTop();
  }

  this.dragStartPoint.set(x, y);

  this.sprite.events.onDragStart$dispatch(this.sprite, pointer, x, y);

  this._pendingDrag = false;
};

/**
* Called as a Pointer actively drags this Game Object.
* 
* @method Phaser.InputHandler#updateDrag
* @private
* @param {Phaser.Pointer} pointer - The Pointer causing the drag update.
* @param {boolean} fromStart - True if this is the first update, immediately after the drag has started.
* @return {boolean}
*/
Phaser.InputHandler.prototype.updateDrag = function (pointer, fromStart) {

  if (fromStart === undefined) { fromStart = false; }

  if (pointer.isUp) {
    this.stopDrag(pointer);
    return false;
  }

  var px = this.globalToLocalX(pointer.x) + this._dragPoint.x + this.dragOffset.x;
  var py = this.globalToLocalY(pointer.y) + this._dragPoint.y + this.dragOffset.y;

  if (this.sprite.fixedToCamera) {
    if (this.allowHorizontalDrag) {
      this.sprite.cameraOffset.x = px;
    }

    if (this.allowVerticalDrag) {
      this.sprite.cameraOffset.y = py;
    }

    if (this.boundsRect) {
      this.checkBoundsRect();
    }

    if (this.boundsSprite) {
      this.checkBoundsSprite();
    }

    if (this.snapOnDrag) {
      this.sprite.cameraOffset.x = Math.round((this.sprite.cameraOffset.x - (this.snapOffsetX % this.snapX)) / this.snapX) * this.snapX + (this.snapOffsetX % this.snapX);
      this.sprite.cameraOffset.y = Math.round((this.sprite.cameraOffset.y - (this.snapOffsetY % this.snapY)) / this.snapY) * this.snapY + (this.snapOffsetY % this.snapY);
      this.snapPoint.set(this.sprite.cameraOffset.x, this.sprite.cameraOffset.y);
    }
  } else {
    var cx = this.game.camera.x - this._pointerData[pointer.id].camX;
    var cy = this.game.camera.y - this._pointerData[pointer.id].camY;

    if (this.allowHorizontalDrag) {
      if(game.scale.correct) {
        this.sprite.x = px + cx;
      } else {
        this.sprite.x = py + cy;
      }
    }

    if (this.allowVerticalDrag) {
      if(game.scale.correct) {
        this.sprite.y = py + cy;
      } else {
        this.sprite.y = -(px + cx);
      }
    }

    if (this.boundsRect) {
      this.checkBoundsRect();
    }

    if (this.boundsSprite) {
      this.checkBoundsSprite();
    }

    if (this.snapOnDrag) {
      this.sprite.x = Math.round((this.sprite.x - (this.snapOffsetX % this.snapX)) / this.snapX) * this.snapX + (this.snapOffsetX % this.snapX);
      this.sprite.y = Math.round((this.sprite.y - (this.snapOffsetY % this.snapY)) / this.snapY) * this.snapY + (this.snapOffsetY % this.snapY);
      this.snapPoint.set(this.sprite.x, this.sprite.y);
    }
  }

  this.sprite.events.onDragUpdate.dispatch(this.sprite, pointer, px, py, this.snapPoint, fromStart);

  return true;
}

CrazyBird.BootState.prototype = Object.create(CrazyBird.BaseState.prototype);
CrazyBird.BootState.prototype.constructor = CrazyBird.BootState;

CrazyBird.BootState.prototype.preload = function () {
  "use strict";
  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.load.image("background", "assets/background.jpg");
  if(game.scale.isLandscape) {
    game.scale.correct = true;
    game.scale.setGameSize(WIDTH, HEIGHT);
  } else {
    game.scale.correct = false;
    game.scale.setGameSize(HEIGHT, WIDTH);
  }
};

CrazyBird.BootState.prototype.create = function () {
  "use strict";
  game.scale.onOrientationChange.add(function() {
    if(game.scale.isLandscape) {
      game.scale.correct = true;
      game.scale.setGameSize(WIDTH, HEIGHT);
    } else {
      game.scale.correct = false;
      game.scale.setGameSize(HEIGHT, WIDTH);
    }
  }, this)

  game.state.start('PreloadState');
};
