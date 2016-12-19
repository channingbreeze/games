function playState(){
    var layer;
    var player,bird;
    var iBox,lBox,oBox,tBox,xBox;
    var overGroup,gameOver=false;
    var point,playerPoint=0;
    var gameOverText;
    var keys;
    var xNumber,yNumber;
    this.init = function(){
        //获取当前可用分辨率
        if(!isPc){
            game.width = Math.floor(window.innerWidth/16)*16;
            game.height = Math.floor(window.innerHeight/16)*16;
        }
    }
    this.create = function () {
        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.gravity.y=150;
        //添加瓦片地图
        if(isPc){
            var map = game.add.tilemap('map_1');
            map.addTilesetImage('mario','mario');
            layer = map.createLayer('bg');
            layer.resizeWorld();//设置世界大小等于图层大小
            map.setCollision(40);
        }else{
            xNumber = width/16;
            yNumber = height/16;
            var map = game.add.tilemap();
            map.addTilesetImage('mario','mario',16,16);
            layer = map.create('layer',xNumber,yNumber,16,16);
            map.fill(0,0,0,xNumber,yNumber,layer);
            map.replace(0,39,Math.floor(xNumber/4),yNumber-Math.floor(yNumber/3),Math.floor(xNumber/2),Math.floor(yNumber/3)-1,layer)
            layer.resizeWorld();//设置世界大小等于图层大小
            map.setCollision(39);
        }
        game.physics.p2.convertTilemap(map, layer);

        //鸟
        bird = game.add.sprite(20,200,'bird');
        bird.anchor.setTo(0.5);
        game.physics.p2.enable(bird,false);
        bird.body.kinematic = true;
        bird.animations.add('fly',[1,2,3]);
        bird.animations.play('fly',12,true);
        bird.body.angle = 10;
        game.add.tween(bird.body).to({y:180,angle:-10},450,null,true,0,Number.MAX_VALUE,true);
        //随机产生box
        function createBox(){
            var random = Math.floor(Math.random()*7);
            switch (random){
                case 0:
                    player = game.add.sprite(width/2,50,'iBox');
                    game.physics.p2.enable(player,false);
                break;
                case 1:
                    player = game.add.sprite(width/2,50,'lBox');
                    game.physics.p2.enable(player,false);
                    player.body.clearShapes();
                    player.body.loadPolygon('physicsData','LBox');
                break;
                case 2:
                    player = game.add.sprite(width/2,50,'oBox');
                    game.physics.p2.enable(player,false);
                break;
                case 3:
                    player = game.add.sprite(width/2,50,'tBox');
                    game.physics.p2.enable(player,false);
                    player.body.clearShapes();
                    player.body.loadPolygon('physicsData','TBox');
                break;
                case 4:
                    player = game.add.sprite(width/2,50,'xBox');
                    game.physics.p2.enable(player,false);
                    player.body.clearShapes();
                    player.body.loadPolygon('physicsData','XBox');
                break;
                case 5:
                    player = game.add.sprite(width/2,50,'xBox_');
                    game.physics.p2.enable(player,false);
                    player.body.clearShapes();
                    player.body.loadPolygon('physicsData','XBox_');
                break;
                case 6:
                    player = game.add.sprite(width/2,50,'lBox_');
                    game.physics.p2.enable(player,false);
                    player.body.clearShapes();
                    player.body.loadPolygon('physicsData','LBox_');
                break;
            }
            player.body.damping=0.6;
            player.body.onBeginContact.addOnce(blockHit, this);
        }
        createBox();
        //碰撞檢測
        function blockHit(body, bodyB, shapeA, shapeB, equation){
            if(!gameOver){
                if(body){
                    groundSound.play();
                    if(body.sprite==null||body.sprite.key!='bird'){
                        getPoint();
                        createBox();
                    }else{
                        player.body.onBeginContact.removeAll();
                        player.body.onBeginContact.addOnce(blockHit, this);
                    }
                }
            }
        }
        //在底部添加碰撞的组.如果被碰撞游戏结束
        overGroup=game.add.group();
        overGroup.enableBody=true;
        overGroup.physicsBodyType=Phaser.Physics.P2JS;
        for (var i=0;i<width/16/2;i++){
            var over = overGroup.create(i*32+10,height-8,'down');
            over.body.kinematic = true;//保持固定
            over.body.onBeginContact.add(function(body, bodyB, shapeA, shapeB, equation){
                if(body){
                    gameOver=true;
                    game.input.onDown.add(
                        function(){
                            game.state.start('menu');
                            gameOver=false;
                            playerPoint = 0;
                            gameOverText=null;
                        }
                    );
                }
            },this);
        }
        //计分函数
        point = game.add.text(width-100,50,playerPoint);
        point.font = 'Arial Black';
        point.fontWeight = 'bold';
        point.fill = '#ec008c';
        point.fontSize = 50;
        point.setShadow(2, 2, 'rgba(0, 0, 0, 0.5)', 2);
        function getPoint(){
            playerPoint++;
            point.text=playerPoint;
        }

        //添加触屏按钮
        if(!isPc){
            var btn_change = game.add.button(width-150,height/3*2,'change',actionOnClick,this);
            btn_change.scale.setTo(1.2);
            btn_change.alpha=0.3;
            var btn_left = game.add.button(0,height/3*2,'fxj',left_go,this);
            var btn_right = game.add.button(200,height/3*2,'fxj',right_go,this);
            var btn_up = game.add.button(100,height/3*2-100,'fxj',up_go,this);
            var btn_down = game.add.button(100,height/3*2+100,'fxj',down_go,this);
            btn_left.alpha = 0.3;
            btn_left.scale.setTo(1.2);
            btn_right.alpha = 0.3;
            btn_right.scale.setTo(1.2);
            btn_up.alpha = 0.3;
            btn_up.scale.setTo(1.2);
            btn_down.alpha = 0.3;
            btn_down.scale.setTo(1.2);
            function actionOnClick(){
                btnSound.play();
                player.body.angle = player.body.angle + 90;
            }
            function left_go(key){
                btnSound.play();
                player.body.velocity.x = -120;
            }
            function right_go(key){
                btnSound.play();
                player.body.velocity.x = 120;
            }
            function up_go(key){
                btnSound.play();
                player.body.velocity.y = 0;
            }
            function down_go(key){
                btnSound.play();
                player.body.velocity.y += 100;
            }
        }else{
            //按键
            keys = game.input.keyboard.addKeys({ left: Phaser.Keyboard.LEFT, right: Phaser.Keyboard.RIGHT, up: Phaser.Keyboard.UP,down:Phaser.Keyboard.DOWN,spin: Phaser.Keyboard.SPACEBAR });
            keys.left.onDown.add(keyDown,this);
            keys.right.onDown.add(keyDown,this);
            keys.up.onDown.add(keyDown,this);
            keys.spin.onDown.add(keyDown,this);
            keys.down.onDown.add(keyDown,this);
            function keyDown(key){
                if(!gameOver){
                    switch (key.keyCode){
                        case Phaser.Keyboard.LEFT:
                            btnSound.play();
                            player.body.velocity.x = -80;
                            break;
                        case Phaser.Keyboard.RIGHT:
                            btnSound.play();
                            player.body.velocity.x = 80;
                            break;
                        case Phaser.Keyboard.UP:
                            btnSound.play();
                            player.body.velocity.y = 0;
                            break;
                        case Phaser.Keyboard.DOWN:
                            btnSound.play();
                            player.body.velocity.y +=100;
                            break;
                        case Phaser.Keyboard.SPACEBAR:
                            btnSound.play();
                            player.body.angle = player.body.angle + 90;
                            break;
                    }
                }
            }

        }

    }
    this.update = function () {
        bird.body.x+=3;
        if(bird.body.x > width+20){
            bird.body.x = 0;
        }
        if(gameOver){
            createGameOverText();
        }
    }
    function createGameOverText(){
        if(gameOverText==null){
            if(player.body.y==50){
                playerPoint--;
                player.kill();
                point.text=playerPoint;
            }
            scoreSound.play();
            gameOverText = game.add.text(game.width/2,game.height/2,'游戏结束 !!\n得分:' + playerPoint+'\n点击屏幕重新开始');
            gameOverText.anchor.setTo(0.5);
            gameOverText.font = 'Arial Black';
            gameOverText.fontWeight = 'bold';
            gameOverText.fill = '#ec008c';
            gameOverText.fontSize=40;
            gameOverText.setShadow(5, 5, 'rgba(0, 0, 0, 0.5)', 5);

        }
    }
}