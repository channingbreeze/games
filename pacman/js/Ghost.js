var Ghost = function(game, key, name, startPos, startDir) {
    this.game = game;
    this.key  = key;
    this.name = name;
    
    this.ORIGINAL_OVERFLOW_ERROR_ON = this.game.ORIGINAL_OVERFLOW_ERROR_ON;
    
    this.gridsize = this.game.gridsize;
    this.safetiles = [this.game.safetile, 35, 36];
    this.startDir = startDir;
    this.startPos = startPos;
    this.threshold = 6;
    
    this.turnTimer = 0;
    this.TURNING_COOLDOWN = 150;
    this.RETURNING_COOLDOWN = 100;
    this.RANDOM     = "random";
    this.SCATTER    = "scatter";
    this.CHASE      = "chase";
    this.STOP       = "stop";
    this.AT_HOME    = "at_home";
    this.EXIT_HOME  = "leaving_home";
    this.RETURNING_HOME = "returning_home";
    this.isAttacking = false;
    
    this.mode = this.AT_HOME;
    this.scatterDestination = new Phaser.Point(27 * this.gridsize, 30 * this.gridsize);
    
    this.ghostSpeed = 150;
    this.ghostScatterSpeed = 125;
    this.ghostFrightenedSpeed = 75;
    this.cruiseElroySpeed = 160;
    this.directions = [ null, null, null, null, null ];
    this.opposites = [ Phaser.NONE, Phaser.RIGHT, Phaser.LEFT, Phaser.DOWN, Phaser.UP ];
    this.currentDir = startDir;
    
    this.turnPoint = new Phaser.Point();
    this.lastPosition = { x: -1, y: -1 };
    
    var offsetGhost = 0;
    switch (this.name) {
        case "clyde":
            offsetGhost = 4;
            this.scatterDestination = new Phaser.Point(0, 30 * this.gridsize);
            break;
        case "pinky":
            offsetGhost = 8;
            this.scatterDestination = new Phaser.Point(0, 0);
            break;
        case "blinky":
            offsetGhost = 12;
            this.scatterDestination = new Phaser.Point(27 * this.gridsize, 0); 
            this.safetiles = [this.game.safetile];
            this.mode = this.SCATTER;
            break;
            
        default:
            break;
    }
    
    this.ghost = this.game.add.sprite((startPos.x * 16) + 8, (startPos.y * 16) + 8, key, 0);
    this.ghost.name = this.name;
    this.ghost.anchor.set(0.5);
    this.ghost.animations.add(Phaser.LEFT, [offsetGhost], 0, false);
    this.ghost.animations.add(Phaser.UP, [offsetGhost+1], 0, false);
    this.ghost.animations.add(Phaser.DOWN, [offsetGhost+2], 0, false);
    this.ghost.animations.add(Phaser.RIGHT, [offsetGhost+3], 0, false);
    this.ghost.animations.add("frightened", [16, 17], 10, true);
    this.ghost.animations.add(Phaser.RIGHT+20, [20], 0, false);
    this.ghost.animations.add(Phaser.LEFT+20, [21], 0, false);
    this.ghost.animations.add(Phaser.UP+20, [22], 0, false);
    this.ghost.animations.add(Phaser.DOWN+20, [23], 0, false);
    
    this.ghost.play(startDir);
    
    this.game.physics.arcade.enable(this.ghost);
    this.ghost.body.setSize(16, 16, 0, 0);
    
    this.move(startDir);
};

Ghost.prototype = {
    update: function() {
        if (this.mode !== this.RETURNING_HOME) {
            this.game.physics.arcade.collide(this.ghost, this.game.layer);
        }
        
        var x = this.game.math.snapToFloor(Math.floor(this.ghost.x), this.gridsize) / this.gridsize;
        var y = this.game.math.snapToFloor(Math.floor(this.ghost.y), this.gridsize) / this.gridsize;

        if (this.ghost.x < 0) {
            this.ghost.x = this.game.map.widthInPixels - 2;
        }
        if (this.ghost.x >= this.game.map.widthInPixels - 1) {
            this.ghost.x = 1;
        }
        
        if (this.isAttacking && (this.mode === this.SCATTER || this.mode === this.CHASE)) {
            this.ghostDestination = this.getGhostDestination();
            this.mode = this.CHASE;
        }
        
        if (this.game.math.fuzzyEqual((x * this.gridsize) + (this.gridsize /2), this.ghost.x, this.threshold) &&
           this.game.math.fuzzyEqual((y * this.gridsize) + (this.gridsize /2), this.ghost.y, this.threshold)) {
            //  Update our grid sensors
            this.directions[0] = this.game.map.getTile(x, y, this.game.layer);
            this.directions[1] = this.game.map.getTileLeft(this.game.layer.index, x, y) || this.directions[1];
            this.directions[2] = this.game.map.getTileRight(this.game.layer.index, x, y) || this.directions[2];
            this.directions[3] = this.game.map.getTileAbove(this.game.layer.index, x, y) || this.directions[3];
            this.directions[4] = this.game.map.getTileBelow(this.game.layer.index, x, y) || this.directions[4];
            
            var canContinue = this.checkSafetile(this.directions[this.currentDir].index);
            var possibleExits = [];
            for (var q=1; q<this.directions.length; q++) {
                if (this.checkSafetile(this.directions[q].index) && q !== this.opposites[this.currentDir]) {
                    possibleExits.push(q);
                }
            }
            switch (this.mode) {
                case this.RANDOM:
                    if (this.turnTimer < this.game.time.time && (possibleExits.length > 1 || !canContinue)) {
                        var select = Math.floor(Math.random() * possibleExits.length);
                        var newDirection = possibleExits[select];

                        this.turnPoint.x = (x * this.gridsize) + (this.gridsize / 2);
                        this.turnPoint.y = (y * this.gridsize) + (this.gridsize / 2);

                        // snap to grid exact position before turning
                        this.ghost.x = this.turnPoint.x;
                        this.ghost.y = this.turnPoint.y;

                        this.lastPosition = { x: x, y: y };
                        this.ghost.body.reset(this.turnPoint.x, this.turnPoint.y);
                        this.move(newDirection);

                        this.turnTimer = this.game.time.time + this.TURNING_COOLDOWN;
                    }
                    break;
                    
                case this.RETURNING_HOME:
                    if (this.turnTimer < this.game.time.time) {
                        this.ghost.body.reset(this.ghost.x, this.ghost.y);
                        if (this.flag = this.flag ? false : true) {
                            this.ghost.body.velocity.x = 0;
                            if (this.ghost.y < 14 * this.gridsize) {
                                this.ghost.body.velocity.y = this.cruiseElroySpeed;
                                this.ghost.animations.play(23);
                            }
                            if (this.ghost.y > 15 * this.gridsize) {
                                this.ghost.body.velocity.y  = -this.cruiseElroySpeed;
                                this.ghost.animations.play(22);
                            }
                        } else {
                            this.ghost.body.velocity.y = 0;
                            if (this.ghost.x < 13 * this.gridsize) {
                                this.ghost.body.velocity.x = this.cruiseElroySpeed;
                                this.ghost.animations.play(20);
                            }
                            if (this.ghost.x > 16 * this.gridsize) {
                                this.ghost.body.velocity.x = -this.cruiseElroySpeed;
                                this.ghost.animations.play(21);
                            }
                        }
                        this.turnTimer = this.game.time.time + this.RETURNING_COOLDOWN;
                    }
                    if (this.hasReachedHome()) {
                        this.turnPoint.x = (x * this.gridsize) + (this.gridsize / 2);
                        this.turnPoint.y = (y * this.gridsize) + (this.gridsize / 2);
                        this.ghost.x = this.turnPoint.x;
                        this.ghost.y = this.turnPoint.y;
                        this.ghost.body.reset(this.turnPoint.x, this.turnPoint.y);
                        this.mode = this.AT_HOME;
                        this.game.gimeMeExitOrder(this);
                    }
                    break;
                    
                case this.CHASE:
                    if (this.turnTimer < this.game.time.time) {
                        var distanceToObj = 999999;
                        var direction, decision, bestDecision;
                        for (q=0; q<possibleExits.length; q++) {
                            direction = possibleExits[q];
                            switch (direction) {
                                case Phaser.LEFT:
                                    decision = new Phaser.Point((x-1)*this.gridsize + (this.gridsize/2), 
                                                                (y * this.gridsize) + (this.gridsize / 2));
                                    break;
                                case Phaser.RIGHT:
                                    decision = new Phaser.Point((x+1)*this.gridsize + (this.gridsize/2), 
                                                                (y * this.gridsize) + (this.gridsize / 2));
                                    break;
                                case Phaser.UP:
                                    decision = new Phaser.Point(x * this.gridsize + (this.gridsize/2), 
                                                                ((y-1)*this.gridsize) + (this.gridsize / 2));
                                    break;
                                case Phaser.DOWN:
                                    decision = new Phaser.Point(x * this.gridsize + (this.gridsize/2), 
                                                                ((y+1)*this.gridsize) + (this.gridsize / 2));
                                    break;
                                default:
                                    break;
                            }
                            var dist = this.ghostDestination.distance(decision);
                            if (dist < distanceToObj) {
                                bestDecision = direction;
                                distanceToObj = dist;
                            }
                        }
                        
                        if (this.game.isSpecialTile({x: x, y: y}) && bestDecision === Phaser.UP) {
                            bestDecision = this.currentDir;
                        }

                        this.turnPoint.x = (x * this.gridsize) + (this.gridsize / 2);
                        this.turnPoint.y = (y * this.gridsize) + (this.gridsize / 2);

                        // snap to grid exact position before turning
                        this.ghost.x = this.turnPoint.x;
                        this.ghost.y = this.turnPoint.y;

                        this.lastPosition = { x: x, y: y };
                        
                        this.ghost.body.reset(this.turnPoint.x, this.turnPoint.y);
                        this.move(bestDecision);

                        this.turnTimer = this.game.time.time + this.TURNING_COOLDOWN;
                    }
                    break;
                    
                case this.AT_HOME:
                    if (!canContinue) {
                        this.turnPoint.x = (x * this.gridsize) + (this.gridsize / 2);
                        this.turnPoint.y = (14 * this.gridsize) + (this.gridsize / 2);
                        this.ghost.x = this.turnPoint.x;
                        this.ghost.y = this.turnPoint.y;
                        this.ghost.body.reset(this.turnPoint.x, this.turnPoint.y);
                        var dir = (this.currentDir === Phaser.LEFT) ? Phaser.RIGHT : Phaser.LEFT;
                        this.move(dir);
                    } else {
                        this.move(this.currentDir);
                    }
                    break;
                    
                case this.EXIT_HOME:
                    if (this.currentDir !== Phaser.UP && (x >= 13 || x <= 14)) {
                        this.turnPoint.x = (13 * this.gridsize) + (this.gridsize / 2);
                        this.turnPoint.y = (y * this.gridsize) + (this.gridsize / 2);
                        this.ghost.x = this.turnPoint.x;
                        this.ghost.y = this.turnPoint.y;
                        this.ghost.body.reset(this.turnPoint.x, this.turnPoint.y);                        
                        this.move(Phaser.UP);
                    } else if (this.currentDir === Phaser.UP && y == 11) {
                        this.turnPoint.x = (x * this.gridsize) + (this.gridsize / 2);
                        this.turnPoint.y = (y * this.gridsize) + (this.gridsize / 2);
                        this.ghost.x = this.turnPoint.x;
                        this.ghost.y = this.turnPoint.y;
                        this.ghost.body.reset(this.turnPoint.x, this.turnPoint.y);  
                        this.safetiles = [this.game.safetile];
                        this.mode = this.game.getCurrentMode();
                        return;
                    } else if (!canContinue) {
                        this.turnPoint.x = (x * this.gridsize) + (this.gridsize / 2);
                        this.turnPoint.y = (y * this.gridsize) + (this.gridsize / 2);
                        this.ghost.x = this.turnPoint.x;
                        this.ghost.y = this.turnPoint.y;
                        this.ghost.body.reset(this.turnPoint.x, this.turnPoint.y);
                        var dir = (this.currentDir === Phaser.LEFT) ? Phaser.RIGHT : Phaser.LEFT;
                        this.move(dir);
                    } 
                    break;
                    
                case this.SCATTER:
                    this.ghostDestination = new Phaser.Point(this.scatterDestination.x, this.scatterDestination.y);
                    this.mode = this.CHASE;
                    break;
                    
                case this.STOP:
                    this.move(Phaser.NONE);
                    break;
            }
        }
    },
    
    attack: function() {
        if (this.mode !== this.RETURNING_HOME) {
            this.isAttacking = true;
            this.ghost.animations.play(this.currentDir);
            if (this.mode !== this.AT_HOME && this.mode != this.EXIT_HOME) {
                this.currentDir = this.opposites[this.currentDir];
            }
        }
    },
    
    checkSafetile: function(tileIndex) {
        for (var q=0; q<this.safetiles.length; q++) {
            if (this.safetiles[q] == tileIndex) {
                return true;
            }
        }
        return false;
    },
    
    enterFrightenedMode: function() {
        if (this.mode !== this.AT_HOME && this.mode !== this.EXIT_HOME && this.mode !== this.RETURNING_HOME) {
            this.ghost.play("frightened");
            this.mode = this.RANDOM;
            this.isAttacking = false;
        }
    },
    
    getGhostDestination: function() {
        switch (this.name) {
            case "blinky":
                return this.game.pacman.getPosition();
                
            case "pinky":
                var dest = this.game.pacman.getPosition();
                var dir = this.game.pacman.getCurrentDirection();
                var offsetX = 0, offsetY = 0;
                if (dir === Phaser.LEFT || dir === Phaser.RIGHT) {
                    offsetX = (dir === Phaser.RIGHT) ? -4 : 4;
                }
                if (dir === Phaser.UP || dir === Phaser.DOWN) {
                    offsetY = (dir === Phaser.DOWN) ? -4 : 4;
                    if (dir === Phaser.UP && this.ORIGINAL_OVERFLOW_ERROR_ON) {
                        offsetX = 4;
                    }
                }
                offsetX *= this.gridsize;
                offsetY *= this.gridsize;
                dest.x -= offsetX;
                dest.y -= offsetY;
                if (dest.x < this.gridsize/2) dest.x = this.gridsize/2;
                if (dest.x > this.game.map.widthInPixels - this.gridsize/2) dest.x = this.game.map.widthInPixels - this.gridsize/2;
                if (dest.y < this.gridsize/2) dest.y = this.gridsize/2;
                if (dest.y > this.game.map.heightInPixels - this.gridsize/2) dest.y = this.game.map.heightInPixels - this.gridsize/2;
                return dest;
                
            case "inky":
                var pacmanPos = this.game.pacman.getPosition();
                var blinkyPos = this.game.blinky.getPosition();
                var diff = Phaser.Point.subtract(pacmanPos, blinkyPos);
                var dest = Phaser.Point.add(pacmanPos, diff);
                if (dest.x < this.gridsize/2) dest.x = this.gridsize/2;
                if (dest.x > this.game.map.widthInPixels - this.gridsize/2) dest.x = this.game.map.widthInPixels - this.gridsize/2;
                if (dest.y < this.gridsize/2) dest.y = this.gridsize/2;
                if (dest.y > this.game.map.heightInPixels - this.gridsize/2) dest.y = this.game.map.heightInPixels - this.gridsize/2;
                return dest;
                
            case "clyde":
                var pacmanPos = this.game.pacman.getPosition();
                var clydePos = this.getPosition();
                if (clydePos.distance(pacmanPos) > 8 * this.gridsize) {
                    return pacmanPos;
                } else {
                    return new Phaser.Point(this.scatterDestination.x, this.scatterDestination.y);
                }
                
            default:
                return new Phaser.Point(this.scatterDestination.x, this.scatterDestination.y);
        }
    },
    
    getPosition: function() {
        var x = this.game.math.snapToFloor(Math.floor(this.ghost.x), this.gridsize) / this.gridsize;
        var y = this.game.math.snapToFloor(Math.floor(this.ghost.y), this.gridsize) / this.gridsize;
        return new Phaser.Point((x * this.gridsize) + (this.gridsize / 2), (y * this.gridsize) + (this.gridsize / 2));
    },
    
    hasReachedHome: function() {
        if (this.ghost.x < 11*this.gridsize || this.ghost.x > 16*this.gridsize || 
            this.ghost.y < 13*this.gridsize || this.ghost.y > 15*this.gridsize) {
            return false;
        }
        return true;
    },
    
    move: function(dir) {
        this.currentDir = dir;
        
        var speed = this.ghostSpeed;
        if (this.game.getCurrentMode() === this.SCATTER) {
            speed = this.ghostScatterSpeed;
        }
        if (this.mode === this.RANDOM) {
            speed = this.ghostFrightenedSpeed;
        } else if (this.mode === this.RETURNING_HOME) {
            speed = this.cruiseElroySpeed;
            this.ghost.animations.play(dir+20);
        } else {
            this.ghost.animations.play(dir);
            if (this.name === "blinky" && this.game.numDots < 20) {
                speed = this.cruiseElroySpeed;
                this.mode = this.CHASE;   
            }
        }
        
        if (this.currentDir === Phaser.NONE) {
            this.ghost.body.velocity.x = this.ghost.body.velocity.y = 0;
            return;
        }
        
        if (dir === Phaser.LEFT || dir === Phaser.UP) {
            speed = -speed;
        }
        if (dir === Phaser.LEFT || dir === Phaser.RIGHT) {
            this.ghost.body.velocity.x = speed;
        } else {
            this.ghost.body.velocity.y = speed;
        }
    },
    
    resetSafeTiles: function() {
        this.safetiles = [this.game.safetile, 35, 36];
    },
    
    scatter: function() {
        if (this.mode !== this.RETURNING_HOME) {
            this.ghost.animations.play(this.currentDir);
            this.isAttacking = false;
            if (this.mode !== this.AT_HOME && this.mode != this.EXIT_HOME) {
                this.mode = this.SCATTER;
            }
        }
    }
};
