function play_2State(game) {
    var layer, bird, playerOne, playerTwo, gameOver = false, WhoLose=null, gameOverText=null;
    this.create = function () {
        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.gravity.y = 120;
        var map = game.add.tilemap('map_2');
        map.addTilesetImage('mario', 'mario');
        layer = map.createLayer('bg');
        layer.resizeWorld();//设置世界大小等于图层大小
        map.setCollision(40);
        game.physics.p2.convertTilemap(map, layer);

        //鸟
        bird = game.add.sprite(20, 200, 'bird');
        bird.anchor.setTo(0.5);
        game.physics.p2.enable(bird, false);
        bird.body.kinematic = true;
        bird.animations.add('fly', [1, 2, 3]);
        bird.animations.play('fly', 12, true);
        bird.body.angle = 10;
        game.add.tween(bird.body).to({y: 180, angle: -10}, 450, null, true, 0, Number.MAX_VALUE, true);

        //随机产生box
        function createBox(who) {
            var x, y = 50, player;
            if (who == "one") {
                x = width / 4;
            } else {
                x = width / 4 * 3;
            }
            var random = Math.floor(Math.random() * 7);
            switch (random) {
                case 0:
                    player = game.add.sprite(x, y, 'iBox');
                    game.physics.p2.enable(player, false);
                    break;
                case 1:
                    player = game.add.sprite(x, y, 'lBox');
                    game.physics.p2.enable(player, false);
                    player.body.clearShapes();
                    player.body.loadPolygon('physicsData', 'LBox');
                    break;
                case 2:
                    player = game.add.sprite(x, y, 'oBox');
                    game.physics.p2.enable(player, false);
                    break;
                case 3:
                    player = game.add.sprite(x, y, 'tBox');
                    game.physics.p2.enable(player, false);
                    player.body.clearShapes();
                    player.body.loadPolygon('physicsData', 'TBox');
                    break;
                case 4:
                    player = game.add.sprite(x, y, 'xBox');
                    game.physics.p2.enable(player, false);
                    player.body.clearShapes();
                    player.body.loadPolygon('physicsData', 'XBox');
                    break;
                case 5:
                    player = game.add.sprite(x, y, 'xBox_');
                    game.physics.p2.enable(player, false);
                    player.body.clearShapes();
                    player.body.loadPolygon('physicsData', 'XBox_');
                    break;
                case 6:
                    player = game.add.sprite(x, y, 'lBox_');
                    game.physics.p2.enable(player, false);
                    player.body.clearShapes();
                    player.body.loadPolygon('physicsData', 'LBox_');
                    break;
            }
            player.body.damping = 0.6;
            if (who == "one") {
                playerOne = player;
                playerOne.body.onBeginContact.addOnce(blockHitOne, this);
            } else {
                playerTwo = player;
                playerTwo.body.onBeginContact.addOnce(blockHitTwo, this);
            }
        }

        createBox("one");
        createBox("two");
        //碰撞檢測
        function blockHitOne(body, bodyB, shapeA, shapeB, equation) {
            if (!gameOver) {
                if (body) {
                    groundSound.play();
                    if (body.sprite == null || (body.sprite.key != 'bird' && body.sprite.key != 'line')) {
                        createBox("one");
                    } else {
                        playerOne.body.onBeginContact.removeAll();
                        playerOne.body.onBeginContact.addOnce(blockHitOne, this);
                    }
                }
            }
        }

        function blockHitTwo(body, bodyB, shapeA, shapeB, equation) {
            if (!gameOver) {
                if (body) {
                    groundSound.play();
                    if (body.sprite == null || (body.sprite.key != 'bird' && body.sprite.key != 'line')) {
                        createBox("two");
                    } else {
                        playerTwo.body.onBeginContact.removeAll();
                        playerTwo.body.onBeginContact.addOnce(blockHitTwo, this);
                    }
                }
            }
        }

        //添加界限
        var lineGroup = game.add.group();
        lineGroup.enableBody = true;
        lineGroup.physicsBodyType = Phaser.Physics.P2JS;
        for (var i = 0; i < height / 15 / 2 - 1; i++) {
            var line1 = lineGroup.create(width / 2, i * 30 + 10, 'line');
            var line2 = lineGroup.create(2, i * 30 + 10, 'line');
            var line3 = lineGroup.create(width - 5, i * 30 + 10, 'line');
            line1.body.kinematic = true;//保持固定
            line2.body.kinematic = true;//保持固定
            line3.body.kinematic = true;//保持固定
        }


        //在底部添加碰撞的组.如果被碰撞游戏结束
        var overGroupOne = game.add.group();
        overGroupOne.enableBody = true;
        overGroupOne.physicsBodyType = Phaser.Physics.P2JS;
        for (var i = 0; i < width / 16 / 4 - 1; i++) {
            var over = overGroupOne.create(i * 32 + 15, height - 8, 'down');
            over.body.kinematic = true;//保持固定
            over.body.onBeginContact.add(function (body, bodyB, shapeA, shapeB, equation) {
                if (body) {
                    gameOver = true;
                    if (WhoLose == null) {
                        WhoLose = "One";
                    }
                    game.input.onDown.add(
                        function () {
                            game.state.start('menu');
                            gameOverText=null;
                            gameOver = false;
                            WhoLose=null;
                        }
                    );
                }
            }, this);
        }
        var overGroupTwo = game.add.group();
        overGroupTwo.enableBody = true;
        overGroupTwo.physicsBodyType = Phaser.Physics.P2JS;
        for (var i = 0; i < width / 16 / 4 - 1; i++) {
            var over = overGroupTwo.create(i * 32 + width / 2 + 20, height - 8, 'down');
            over.body.kinematic = true;//保持固定
            over.body.onBeginContact.add(function (body, bodyB, shapeA, shapeB, equation) {
                if (body) {
                    gameOver = true;
                    if (WhoLose == null) {
                        WhoLose = "Two";
                    }
                    game.input.onDown.add(
                        function () {
                            game.state.start('menu');
                            gameOverText=null;
                            gameOver = false;
                            WhoLose=null;
                        }
                    );
                }
            }, this);
        }

        //按键
        var keysTwo = game.input.keyboard.addKeys({
            left: Phaser.Keyboard.A,
            right: Phaser.Keyboard.D,
            up: Phaser.Keyboard.W,
            down: Phaser.Keyboard.S
        });
        keysTwo.left.onDown.add(keyDownOne, this);
        keysTwo.right.onDown.add(keyDownOne, this);
        keysTwo.up.onDown.add(keyDownOne, this);
        keysTwo.down.onDown.add(keyDownOne, this);
        function keyDownOne(key) {
            if (!gameOver) {
                switch (key.keyCode) {
                    case Phaser.Keyboard.A:
                        btnSound.play();
                        playerOne.body.velocity.x = -80;
                        break;
                    case Phaser.Keyboard.D:
                        btnSound.play();
                        playerOne.body.velocity.x = 80;
                        break;
                    case Phaser.Keyboard.W:
                        btnSound.play();
                        playerOne.body.angle = playerOne.body.angle + 90;
                        break;
                    case Phaser.Keyboard.S:
                        btnSound.play();
                        playerOne.body.velocity.y += 100;
                        break;
                }
            }
        }

        //按键
        var keysTwo = game.input.keyboard.addKeys({
            left: Phaser.Keyboard.LEFT,
            right: Phaser.Keyboard.RIGHT,
            up: Phaser.Keyboard.UP,
            down: Phaser.Keyboard.DOWN
        });
        keysTwo.left.onDown.add(keyDownTwo, this);
        keysTwo.right.onDown.add(keyDownTwo, this);
        keysTwo.up.onDown.add(keyDownTwo, this);
        keysTwo.down.onDown.add(keyDownTwo, this);
        function keyDownTwo(key) {
            if (!gameOver) {
                switch (key.keyCode) {
                    case Phaser.Keyboard.LEFT:
                        btnSound.play();
                        playerTwo.body.velocity.x = -80;
                        break;
                    case Phaser.Keyboard.RIGHT:
                        btnSound.play();
                        playerTwo.body.velocity.x = 80;
                        break;
                    case Phaser.Keyboard.UP:
                        btnSound.play();
                        playerTwo.body.angle = playerTwo.body.angle + 90;
                        break;
                    case Phaser.Keyboard.DOWN:
                        btnSound.play();
                        playerTwo.body.velocity.y += 100;
                        break;
                }
            }
        }
    }
    this.update = function () {
        bird.body.x += 3;
        if (bird.body.x > width + 20) {
            bird.body.x = 0;
        }
        if (gameOver) {
            if (gameOverText == null) {
                scoreSound.play();
                if (WhoLose == "One") {
                    gameOverText = game.add.text(game.width / 2, game.height / 2, 'lose !!                         win !!\n         点击屏幕重新开始');
                    gameOverText.anchor.setTo(0.5);
                    gameOverText.font = 'Arial Black';
                    gameOverText.fontWeight = 'bold';
                    gameOverText.fill = '#ec008c';
                    gameOverText.fontSize = 40;
                    gameOverText.setShadow(5, 5, 'rgba(0, 0, 0, 0.5)', 5);
                } else if(WhoLose=="Two"){
                    gameOverText = game.add.text(game.width / 2, game.height / 2, 'win !!                         lose !!\n         点击屏幕重新开始');
                    gameOverText.anchor.setTo(0.5);
                    gameOverText.font = 'Arial Black';
                    gameOverText.fontWeight = 'bold';
                    gameOverText.fill = '#ec008c';
                    gameOverText.fontSize = 40;
                    gameOverText.setShadow(5, 5, 'rgba(0, 0, 0, 0.5)', 5);
                }
            }

        }

    }
}