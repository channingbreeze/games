var game = new Phaser.Game(800,600, Phaser.AUTO, 'phaser-demo', {preload: preload, create: create, update: update, render: render});

var player;
var greenEnemies;
var blueEnemies;
var enemyBullets;
var starfield;
var cursors;
var bank;
var shipTrail;
var explosions;
var playerDeath;
var bullets;
var fireButton;
var bulletTimer = 0;
var shields;
var score = 0;
var scoreText;
var greenEnemyLaunchTimer;
var greenEnemySpacing = 1000;
var blueEnemyLaunchTimer;
var blueEnemyLaunched = false;
var blueEnemySpacing = 2500;
var bossLaunchTimer;
var bossLaunched = false;
var bossSpacing = 20000;
var bossBulletTimer = 0;
var bossYdirection = -1;
var gameOver;

var ACCLERATION = 600;
var DRAG = 400;
var MAXSPEED = 400;

function preload() {
    game.load.image('starfield', 'assets/starfield.png');
    game.load.image('ship', 'assets/player.png');
    game.load.image('bullet', 'assets/bullet.png');
    game.load.image('enemy-green', 'assets/enemy-green.png');
    game.load.image('enemy-blue', 'assets/enemy-blue.png');
    game.load.image('blueEnemyBullet', 'assets/enemy-blue-bullet.png');
    game.load.spritesheet('explosion', 'assets/explode.png', 128, 128);
    game.load.bitmapFont('spacefont', 'assets/spacefont/spacefont.png', 'assets/spacefont/spacefont.xml');  
    game.load.image('boss', 'assets/boss.png');
    game.load.image('deathRay', 'assets/death-ray.png');
}

function create() {
    //  The scrolling starfield background
    starfield = game.add.tileSprite(0, 0, 800, 600, 'starfield');

    //  Our bullet group
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(30, 'bullet');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 1);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);

    //  The hero!
    player = game.add.sprite(400, 500, 'ship');
    player.health = 100;
    player.anchor.setTo(0.5, 0.5);
    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.maxVelocity.setTo(MAXSPEED, MAXSPEED);
    player.body.drag.setTo(DRAG, DRAG);
    player.weaponLevel = 1
    player.events.onKilled.add(function(){
        shipTrail.kill();
    });
    player.events.onRevived.add(function(){
        shipTrail.start(false, 5000, 10);
    });

    //  The baddies!
    greenEnemies = game.add.group();
    greenEnemies.enableBody = true;
    greenEnemies.physicsBodyType = Phaser.Physics.ARCADE;
    greenEnemies.createMultiple(5, 'enemy-green');
    greenEnemies.setAll('anchor.x', 0.5);
    greenEnemies.setAll('anchor.y', 0.5);
    greenEnemies.setAll('scale.x', 0.5);
    greenEnemies.setAll('scale.y', 0.5);
    greenEnemies.setAll('angle', 180);
    greenEnemies.forEach(function(enemy){
        addEnemyEmitterTrail(enemy);
        enemy.body.setSize(enemy.width * 3 / 4, enemy.height * 3 / 4);
        enemy.damageAmount = 20;
        enemy.events.onKilled.add(function(){
            enemy.trail.kill();
        });
    });

    game.time.events.add(1000, launchGreenEnemy);

    //  Blue enemy's bullets
    blueEnemyBullets = game.add.group();
    blueEnemyBullets.enableBody = true;
    blueEnemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
    blueEnemyBullets.createMultiple(30, 'blueEnemyBullet');
    blueEnemyBullets.callAll('crop', null, {x: 90, y: 0, width: 90, height: 70});
    blueEnemyBullets.setAll('alpha', 0.9);
    blueEnemyBullets.setAll('anchor.x', 0.5);
    blueEnemyBullets.setAll('anchor.y', 0.5);
    blueEnemyBullets.setAll('outOfBoundsKill', true);
    blueEnemyBullets.setAll('checkWorldBounds', true);
    blueEnemyBullets.forEach(function(enemy){
        enemy.body.setSize(20, 20);
    });

    //  More baddies!
    blueEnemies = game.add.group();
    blueEnemies.enableBody = true;
    blueEnemies.physicsBodyType = Phaser.Physics.ARCADE;
    blueEnemies.createMultiple(30, 'enemy-blue');
    blueEnemies.setAll('anchor.x', 0.5);
    blueEnemies.setAll('anchor.y', 0.5);
    blueEnemies.setAll('scale.x', 0.5);
    blueEnemies.setAll('scale.y', 0.5);
    blueEnemies.setAll('angle', 180);
    blueEnemies.forEach(function(enemy){
        enemy.damageAmount = 40;
    });

    //  The boss
    boss = game.add.sprite(0, 0, 'boss');
    boss.exists = false;
    boss.alive = false;
    boss.anchor.setTo(0.5, 0.5);
    boss.damageAmount = 50;
    boss.angle = 180;
    boss.scale.x = 0.6;
    boss.scale.y = 0.6;
    game.physics.enable(boss, Phaser.Physics.ARCADE);
    boss.body.maxVelocity.setTo(100, 80);
    boss.dying = false;
    boss.finishOff = function() {
        if (!boss.dying) {
            boss.dying = true;
            bossDeath.x = boss.x;
            bossDeath.y = boss.y;
            bossDeath.start(false, 1000, 50, 20);
            //  kill boss after explotions
            game.time.events.add(1000, function(){
                var explosion = explosions.getFirstExists(false);
                var beforeScaleX = explosions.scale.x;
                var beforeScaleY = explosions.scale.y;
                var beforeAlpha = explosions.alpha;
                explosion.reset(boss.body.x + boss.body.halfWidth, boss.body.y + boss.body.halfHeight);
                explosion.alpha = 0.4;
                explosion.scale.x = 3;
                explosion.scale.y = 3;
                var animation = explosion.play('explosion', 30, false, true);
                animation.onComplete.addOnce(function(){
                    explosion.scale.x = beforeScaleX;
                    explosion.scale.y = beforeScaleY;
                    explosion.alpha = beforeAlpha;
                });
                boss.kill();
                booster.kill();
                boss.dying = false;
                bossDeath.on = false;
                //  queue next boss
                bossLaunchTimer = game.time.events.add(game.rnd.integerInRange(bossSpacing, bossSpacing + 5000), launchBoss);
            });

            //  reset pacing for other enemies
            blueEnemySpacing = 2500;
            greenEnemySpacing = 1000;

            //  give some bonus health
            player.health = Math.min(100, player.health + 40);
            shields.render();
        }
    };

    //  Boss death ray
    function addRay(leftRight) {
        var ray = game.add.sprite(leftRight * boss.width * 0.75, 0, 'deathRay');
        ray.alive = false;
        ray.visible = false;
        boss.addChild(ray);
        ray.crop({x: 0, y: 0, width: 40, height: 40});
        ray.anchor.x = 0.5;
        ray.anchor.y = 0.5;
        ray.scale.x = 2.5;
        ray.damageAmount = boss.damageAmount;
        game.physics.enable(ray, Phaser.Physics.ARCADE);
        ray.body.setSize(ray.width / 5, ray.height / 4);
        ray.update = function() {
            this.alpha = game.rnd.realInRange(0.6, 1);
        };
        boss['ray' + (leftRight > 0 ? 'Right' : 'Left')] = ray;
    }
    addRay(1);
    addRay(-1);
    //  need to add the ship texture to the group so it renders over the rays
    var ship = game.add.sprite(0, 0, 'boss');
    ship.anchor = {x: 0.5, y: 0.5};
    boss.addChild(ship);

    boss.fire = function() {
        if (game.time.now > bossBulletTimer) {
            var raySpacing = 3000;
            var chargeTime = 1500;
            var rayTime = 1500;

            function chargeAndShoot(side) {
                ray = boss['ray' + side];
                ray.name = side
                ray.revive();
                ray.y = 80;
                ray.alpha = 0;
                ray.scale.y = 13;
                game.add.tween(ray).to({alpha: 1}, chargeTime, Phaser.Easing.Linear.In, true).onComplete.add(function(ray){
                    ray.scale.y = 150;
                    game.add.tween(ray).to({y: -1500}, rayTime, Phaser.Easing.Linear.In, true).onComplete.add(function(ray){
                        ray.kill();
                    });
                });
            }
            chargeAndShoot('Right');
            chargeAndShoot('Left');

            bossBulletTimer = game.time.now + raySpacing;
        }
    };

    boss.update = function() {
      if (!boss.alive) return;

      boss.rayLeft.update();
      boss.rayRight.update();

      if (boss.y > 140) {
        boss.body.acceleration.y = -50;
      }
      if (boss.y < 140) {
        boss.body.acceleration.y = 50;
      }
      if (boss.x > player.x + 50) {
        boss.body.acceleration.x = -50;
      } else if (boss.x < player.x - 50) {
        boss.body.acceleration.x = 50;
      } else {
        boss.body.acceleration.x = 0;
      }

      //  Squish and rotate boss for illusion of "banking"
      var bank = boss.body.velocity.x / MAXSPEED;
      boss.scale.x = 0.6 - Math.abs(bank) / 3;
      boss.angle = 180 - bank * 20;

      booster.x = boss.x + -5 * bank;
      booster.y = boss.y + 10 * Math.abs(bank) - boss.height / 2;

      //  fire if player is in target
      var angleToPlayer = game.math.radToDeg(game.physics.arcade.angleBetween(boss, player)) - 90;
      var anglePointing = 180 - Math.abs(boss.angle);
      if (anglePointing - angleToPlayer < 18) {
          boss.fire();
      }
    }

    //  boss's boosters
    booster = game.add.emitter(boss.body.x, boss.body.y - boss.height / 2);
    booster.width = 0;
    booster.makeParticles('blueEnemyBullet');
    booster.forEach(function(p){
      p.crop({x: 120, y: 0, width: 45, height: 50});
      //  clever way of making 2 exhaust trails by shifing particles randomly left or right
      p.anchor.x = game.rnd.pick([1,-1]) * 0.95 + 0.5;
      p.anchor.y = 0.75;
    });
    booster.setXSpeed(0, 0);
    booster.setRotation(0,0);
    booster.setYSpeed(-30, -50);
    booster.gravity = 0;
    booster.setAlpha(1, 0.1, 400);
    booster.setScale(0.3, 0, 0.7, 0, 5000, Phaser.Easing.Quadratic.Out);
    boss.bringToTop();

    //  And some controls to play the game with
    cursors = game.input.keyboard.createCursorKeys();
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    //  Add an emitter for the ship's trail
    shipTrail = game.add.emitter(player.x, player.y + 10, 400);
    shipTrail.width = 10;
    shipTrail.makeParticles('bullet');
    shipTrail.setXSpeed(30, -30);
    shipTrail.setYSpeed(200, 180);
    shipTrail.setRotation(50,-50);
    shipTrail.setAlpha(1, 0.01, 800);
    shipTrail.setScale(0.05, 0.4, 0.05, 0.4, 2000, Phaser.Easing.Quintic.Out);
    shipTrail.start(false, 5000, 10);

    //  An explosion pool
    explosions = game.add.group();
    explosions.enableBody = true;
    explosions.physicsBodyType = Phaser.Physics.ARCADE;
    explosions.createMultiple(30, 'explosion');
    explosions.setAll('anchor.x', 0.5);
    explosions.setAll('anchor.y', 0.5);
    explosions.forEach( function(explosion) {
        explosion.animations.add('explosion');
    });

    //  Big explosion
    playerDeath = game.add.emitter(player.x, player.y);
    playerDeath.width = 50;
    playerDeath.height = 50;
    playerDeath.makeParticles('explosion', [0,1,2,3,4,5,6,7], 10);
    playerDeath.setAlpha(0.9, 0, 800);
    playerDeath.setScale(0.1, 0.6, 0.1, 0.6, 1000, Phaser.Easing.Quintic.Out);

    //  Big explosion for boss
    bossDeath = game.add.emitter(boss.x, boss.y);
    bossDeath.width = boss.width / 2;
    bossDeath.height = boss.height / 2;
    bossDeath.makeParticles('explosion', [0,1,2,3,4,5,6,7], 20);
    bossDeath.setAlpha(0.9, 0, 900);
    bossDeath.setScale(0.3, 1.0, 0.3, 1.0, 1000, Phaser.Easing.Quintic.Out);

    //  Shields stat
    shields = game.add.bitmapText(game.world.width - 250, 10, 'spacefont', '' + player.health +'%', 50);
    shields.render = function () {
        shields.text = 'Shields: ' + Math.max(player.health, 0) +'%';
    };
    shields.render();

    //  Score
    scoreText = game.add.bitmapText(10, 10, 'spacefont', '', 50);
    scoreText.render = function () {
        scoreText.text = 'Score: ' + score;
    };
    scoreText.render();

    //  Game over text
    gameOver = game.add.bitmapText(game.world.centerX, game.world.centerY, 'spacefont', 'GAME OVER!', 110);
    gameOver.x = gameOver.x - gameOver.textWidth / 2;
    gameOver.y = gameOver.y - gameOver.textHeight / 3;
    gameOver.visible = false;
}

function update() {
    //  Scroll the background
    starfield.tilePosition.y += 2;

    //  Reset the player, then check for movement keys
    player.body.acceleration.x = 0;

    if (cursors.left.isDown)
    {
        player.body.acceleration.x = -ACCLERATION;
    }
    else if (cursors.right.isDown)
    {
        player.body.acceleration.x = ACCLERATION;
    }

    //  Stop at screen edges
    if (player.x > game.width - 50) {
        player.x = game.width - 50;
        player.body.acceleration.x = 0;
    }
    if (player.x < 50) {
        player.x = 50;
        player.body.acceleration.x = 0;
    }

    //  Fire bullet
    if (player.alive && (fireButton.isDown || game.input.activePointer.isDown)) {
        fireBullet();
    }

    //  Move ship towards mouse pointer
    if (game.input.x < game.width - 20 &&
        game.input.x > 20 &&
        game.input.y > 20 &&
        game.input.y < game.height - 20) {
        var minDist = 200;
        var dist = game.input.x - player.x;
        player.body.velocity.x = MAXSPEED * game.math.clamp(dist / minDist, -1, 1);
    }

    //  Squish and rotate ship for illusion of "banking"
    bank = player.body.velocity.x / MAXSPEED;
    player.scale.x = 1 - Math.abs(bank) / 2;
    player.angle = bank * 30;

    //  Keep the shipTrail lined up with the ship
    shipTrail.x = player.x;

    //  Check collisions
    game.physics.arcade.overlap(player, greenEnemies, shipCollide, null, this);
    game.physics.arcade.overlap(greenEnemies, bullets, hitEnemy, null, this);

    game.physics.arcade.overlap(player, blueEnemies, shipCollide, null, this);
    game.physics.arcade.overlap(blueEnemies, bullets, hitEnemy, null, this);

    game.physics.arcade.overlap(boss, bullets, hitEnemy, bossHitTest, this);
    game.physics.arcade.overlap(player, boss.rayLeft, enemyHitsPlayer, null, this);
    game.physics.arcade.overlap(player, boss.rayRight, enemyHitsPlayer, null, this);

    game.physics.arcade.overlap(blueEnemyBullets, player, enemyHitsPlayer, null, this);

    //  Game over?
    if (! player.alive && gameOver.visible === false) {
        gameOver.visible = true;
        gameOver.alpha = 0;
        var fadeInGameOver = game.add.tween(gameOver);
        fadeInGameOver.to({alpha: 1}, 1000, Phaser.Easing.Quintic.Out);
        fadeInGameOver.onComplete.add(setResetHandlers);
        fadeInGameOver.start();
        function setResetHandlers() {
            //  The "click to restart" handler
            tapRestart = game.input.onTap.addOnce(_restart,this);
            spaceRestart = fireButton.onDown.addOnce(_restart,this);
            function _restart() {
              tapRestart.detach();
              spaceRestart.detach();
              restart();
            }
        }
    }
}

function render() {
    // for (var i = 0; i < greenEnemies.length; i++)
    // {
    //     game.debug.body(greenEnemies.children[i]);
    // }
    // game.debug.body(player);
}

function fireBullet() {
    switch (player.weaponLevel) {
        case 1:
        //  To avoid them being allowed to fire too fast we set a time limit
        if (game.time.now > bulletTimer)
        {
            var BULLET_SPEED = 400;
            var BULLET_SPACING = 250;
            //  Grab the first bullet we can from the pool
            var bullet = bullets.getFirstExists(false);

            if (bullet)
            {
                //  And fire it
                //  Make bullet come out of tip of ship with right angle
                var bulletOffset = 20 * Math.sin(game.math.degToRad(player.angle));
                bullet.reset(player.x + bulletOffset, player.y);
                bullet.angle = player.angle;
                game.physics.arcade.velocityFromAngle(bullet.angle - 90, BULLET_SPEED, bullet.body.velocity);
                bullet.body.velocity.x += player.body.velocity.x;

                bulletTimer = game.time.now + BULLET_SPACING;
            }
        }
        break;

        case 2:
        if (game.time.now > bulletTimer) {
            var BULLET_SPEED = 400;
            var BULLET_SPACING = 550;


            for (var i = 0; i < 3; i++) {
                var bullet = bullets.getFirstExists(false);
                if (bullet) {
                    //  Make bullet come out of tip of ship with right angle
                    var bulletOffset = 20 * Math.sin(game.math.degToRad(player.angle));
                    bullet.reset(player.x + bulletOffset, player.y);
                    //  "Spread" angle of 1st and 3rd bullets
                    var spreadAngle;
                    if (i === 0) spreadAngle = -20;
                    if (i === 1) spreadAngle = 0;
                    if (i === 2) spreadAngle = 20;
                    bullet.angle = player.angle + spreadAngle;
                    game.physics.arcade.velocityFromAngle(spreadAngle - 90, BULLET_SPEED, bullet.body.velocity);
                    bullet.body.velocity.x += player.body.velocity.x;
                }
                bulletTimer = game.time.now + BULLET_SPACING;
            }
        }
    }
}


function launchGreenEnemy() {
    var ENEMY_SPEED = 300;

    var enemy = greenEnemies.getFirstExists(false);
    if (enemy) {
        enemy.reset(game.rnd.integerInRange(0, game.width), -20);
        enemy.body.velocity.x = game.rnd.integerInRange(-300, 300);
        enemy.body.velocity.y = ENEMY_SPEED;
        enemy.body.drag.x = 100;

        enemy.trail.start(false, 800, 1);

        //  Update function for each enemy ship to update rotation etc
        enemy.update = function(){
          enemy.angle = 180 - game.math.radToDeg(Math.atan2(enemy.body.velocity.x, enemy.body.velocity.y));

          enemy.trail.x = enemy.x;
          enemy.trail.y = enemy.y -10;

          //  Kill enemies once they go off screen
          if (enemy.y > game.height + 200) {
            enemy.kill();
            enemy.y = -20;
          }
        }
    }

    //  Send another enemy soon
    greenEnemyLaunchTimer = game.time.events.add(game.rnd.integerInRange(greenEnemySpacing, greenEnemySpacing + 1000), launchGreenEnemy);
}

function launchBlueEnemy() {
    var startingX = game.rnd.integerInRange(100, game.width - 100);
    var verticalSpeed = 180;
    var spread = 60;
    var frequency = 70;
    var verticalSpacing = 70;
    var numEnemiesInWave = 5;

    //  Launch wave
    for (var i =0; i < numEnemiesInWave; i++) {
        var enemy = blueEnemies.getFirstExists(false);
        if (enemy) {
            enemy.startingX = startingX;
            enemy.reset(game.width / 2, -verticalSpacing * i);
            enemy.body.velocity.y = verticalSpeed;

            //  Set up firing
            var bulletSpeed = 400;
            var firingDelay = 2000;
            enemy.bullets = 1;
            enemy.lastShot = 0;

            //  Update function for each enemy
            enemy.update = function(){
              //  Wave movement
              this.body.x = this.startingX + Math.sin((this.y) / frequency) * spread;

              //  Squish and rotate ship for illusion of "banking"
              bank = Math.cos((this.y + 60) / frequency)
              this.scale.x = 0.5 - Math.abs(bank) / 8;
              this.angle = 180 - bank * 2;

              //  Fire
              enemyBullet = blueEnemyBullets.getFirstExists(false);
              if (enemyBullet &&
                  this.alive &&
                  this.bullets &&
                  this.y > game.width / 8 &&
                  game.time.now > firingDelay + this.lastShot) {
                    this.lastShot = game.time.now;
                    this.bullets--;
                    enemyBullet.reset(this.x, this.y + this.height / 2);
                    enemyBullet.damageAmount = this.damageAmount;
                    var angle = game.physics.arcade.moveToObject(enemyBullet, player, bulletSpeed);
                    enemyBullet.angle = game.math.radToDeg(angle);
                }

              //  Kill enemies once they go off screen
              if (this.y > game.height + 200) {
                this.kill();
                this.y = -20;
              }
            };
        }
    }

    //  Send another wave soon
    blueEnemyLaunchTimer = game.time.events.add(game.rnd.integerInRange(blueEnemySpacing, blueEnemySpacing + 4000), launchBlueEnemy);
}

function launchBoss() {
    boss.reset(game.width / 2, -boss.height);
    booster.start(false, 1000, 10);
    boss.health = 501;
    bossBulletTimer = game.time.now + 5000;
}

function addEnemyEmitterTrail(enemy) {
    var enemyTrail = game.add.emitter(enemy.x, player.y - 10, 100);
    enemyTrail.width = 10;
    enemyTrail.makeParticles('explosion', [1,2,3,4,5]);
    enemyTrail.setXSpeed(20, -20);
    enemyTrail.setRotation(50,-50);
    enemyTrail.setAlpha(0.4, 0, 800);
    enemyTrail.setScale(0.01, 0.1, 0.01, 0.1, 1000, Phaser.Easing.Quintic.Out);
    enemy.trail = enemyTrail;
}


function shipCollide(player, enemy) {
    enemy.kill();

    player.damage(enemy.damageAmount);
    shields.render();

    if (player.alive) {
        var explosion = explosions.getFirstExists(false);
        explosion.reset(player.body.x + player.body.halfWidth, player.body.y + player.body.halfHeight);
        explosion.alpha = 0.7;
        explosion.play('explosion', 30, false, true);
    } else {
        playerDeath.x = player.x;
        playerDeath.y = player.y;
        playerDeath.start(false, 1000, 10, 10);
    }
}


function hitEnemy(enemy, bullet) {
    var explosion = explosions.getFirstExists(false);
    explosion.reset(bullet.body.x + bullet.body.halfWidth, bullet.body.y + bullet.body.halfHeight);
    explosion.body.velocity.y = enemy.body.velocity.y;
    explosion.alpha = 0.7;
    explosion.play('explosion', 30, false, true);
    if (enemy.finishOff && enemy.health < 5) {
      enemy.finishOff();
    } else {
        enemy.damage(enemy.damageAmount);
    }
    bullet.kill();

    // Increase score
    score += enemy.damageAmount * 10;
    scoreText.render();

    //  Pacing

    //  Enemies come quicker as score increases
    greenEnemySpacing *= 0.9;

    //  Blue enemies come in after a score of 1000
    if (!blueEnemyLaunched && score > 1000) {
      blueEnemyLaunched = true;
      launchBlueEnemy();
      //  Slow green enemies down now that there are other enemies
      greenEnemySpacing *= 2;
    }

    //  Launch boss
    if (!bossLaunched && score > 15000) {
        greenEnemySpacing = 5000;
        blueEnemySpacing = 12000;
        //  dramatic pause before boss
        game.time.events.add(2000, function(){
          bossLaunched = true;
          launchBoss();
        });
    }

    //  Weapon upgrade
    if (score > 5000 && player.weaponLevel < 2) {
      player.weaponLevel = 2;
    }
}

//  Don't count a hit in the lower right and left quarants to aproximate better collisions
function bossHitTest(boss, bullet) {
    if ((bullet.x > boss.x + boss.width / 5 &&
        bullet.y > boss.y) ||
        (bullet.x < boss.x - boss.width / 5 &&
        bullet.y > boss.y)) {
      return false;
    } else {
      return true;
    }
}

function enemyHitsPlayer (player, bullet) {
    bullet.kill();

    player.damage(bullet.damageAmount);
    shields.render()

    if (player.alive) {
        var explosion = explosions.getFirstExists(false);
        explosion.reset(player.body.x + player.body.halfWidth, player.body.y + player.body.halfHeight);
        explosion.alpha = 0.7;
        explosion.play('explosion', 30, false, true);
    } else {
        playerDeath.x = player.x;
        playerDeath.y = player.y;
        playerDeath.start(false, 1000, 10, 10);
    }
}


function restart () {
    //  Reset the enemies
    greenEnemies.callAll('kill');
    game.time.events.remove(greenEnemyLaunchTimer);
    game.time.events.add(1000, launchGreenEnemy);
    blueEnemies.callAll('kill');
    blueEnemyBullets.callAll('kill');
    game.time.events.remove(blueEnemyLaunchTimer);
    boss.kill();
    booster.kill();
    game.time.events.remove(bossLaunchTimer);

    blueEnemies.callAll('kill');
    game.time.events.remove(blueEnemyLaunchTimer);
    //  Revive the player
    player.weaponLevel = 1;
    player.revive();
    player.health = 100;
    shields.render();
    score = 0;
    scoreText.render();

    //  Hide the text
    gameOver.visible = false;

    //  Reset pacing
    greenEnemySpacing = 1000;
    blueEnemyLaunched = false;
    bossLaunched = false;
}
