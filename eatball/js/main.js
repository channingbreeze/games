/*
 * @name: 大鱼吃小鱼
 * @author: 沐峰(artskin@163.com)
 * @date: 2018-3-20
 */

(function(){
    var DPR = window.devicePixelRatio,
        gameW = document.body.clientWidth * DPR,
        gameH = document.body.clientHeight * DPR,
        fontSize = 16*DPR,
        aspect = gameW / gameH;
    var topBar = window.screen.height - document.body.clientHeight;

    var game = new Phaser.Game(gameW,gameH,Phaser.CANVAS,'game');
    
    var loading,loadText;
    var bgm,destroy,lose,win;
    var gameTitle,gameTips,scoreText,overTxt,resultInfo;
    var enemy,player,dragArea,sBall,ball,size;
    var button,button2;
    var score = 0;
    
    //生成随机颜色
    function RandomColor() {
        this.highlight = 88;
        this.r=Math.floor(Math.random()*256);
        this.g=Math.floor(Math.random()*(256-this.highlight));
        this.b=Math.floor(Math.random()*256);
        this.g2 = this.g + this.highlight;
        //所有方法的拼接都可以用ES6新特性`其他字符串{$变量名}`替换
        return{
            color1:"#" + ((1 << 24) + (this.r << 16) + (this.g << 8) + this.b).toString(16).slice(1),
            color2:"#" + ((1 << 24) + (this.r << 16) + (this.g2 << 8) + this.b).toString(16).slice(1)
        };
    }

    //绘制球形
    function ShapeBall(color1,color2,size) {
        this.bmd = game.make.bitmapData(size*2, size*2);
        this.ballStyle = this.bmd.context.createRadialGradient(
            size*0.6,
            size*0.6,
            size*0.1,
            size,
            size,
            size * 1.2
        );
        this.ballStyle.addColorStop(0, color1);
        this.ballStyle.addColorStop(1, color2);
        this.bmd.circle(size, size, size, this.ballStyle);

        return this.bmd;
    }

    //游戏加载
    var bootState = function (game) {
        this.init = function () {
            //缩放设置
            game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
            game.stage.backgroundColor = "#1b2436";
            
            //loading文字
            var loadStyle = {font:fontSize+"px",fill:"#fff"};
            loadText = game.add.text(gameW/2,gameH/2-60,'游戏加中...',loadStyle);
            loadText.anchor.setTo(0.5, 0.5);
            loadText.alpha =0.6;
        };
        this.preload = function(){
            //资源加载
            game.load.image('playerArea', 'assets/opa.png');
            game.load.image("loading","./assets/loading.gif");
            game.load.image("loadbg","assets/loadbg.png");
            game.load.image('title', './assets/title.png');
            game.load.image('btn_start', './assets/btn_start.png');
            game.load.spritesheet('button', './assets/button_sprite_sheet.png', 361, 124);
            game.load.spritesheet('button2', './assets/button_sprite_sheet.png', 361, 118);
            game.load.audio('bgm', 'assets/audio/bgm.mp3', true);
            game.load.audio('destroy', 'assets/audio/destroy.mp3', true);
            game.load.audio('lose', 'assets/audio/lose.mp3', true);
            game.load.audio('win', 'assets/audio/win.mp3', true);

            game.load.onFileComplete.add(function(progress) {
                loadText.text ='游戏加中...' + progress + '%';
                if(progress == 100) {
                    game.state.start('start');
                }
            });
        };
        this.create =function(){
            loading = game.add.sprite(gameW/2,gameH/2,"loading");
            loading.anchor.setTo(0.5, 0.5);
            loading.scale.setTo(0.6*DPR);
        };
    };

    //游戏开始画面
    var startState = function (game) {
        this.create = function(){
            console.log("开始游戏");
            bgm = game.add.sound('bgm', 0.5, true);
            bgm.play();

            game.bg = game.add.sprite(0, 0, 'loadbg');
            game.bg.width = gameW;
            game.bg.height= gameH;

            //游戏名称
            if(topBar < 30){
                var titleStyle = {font: "bold "+fontSize*2+"px",fill:"#fff"};
                // gameTitle = game.add.text(gameW/2,gameH/5,'大球吃小球',titleStyle);
                // gameTitle.anchor.setTo(0.5, 0.5);
            }

            var tipStyle = {font:fontSize/2+"px",fill:"#394e76"};
            gameTips = game.add.text(gameW/2,gameH-100,'小提示：吃掉比你小的球',tipStyle);
            gameTips.anchor.setTo(0.5, 0.5);
            gameTips.alpha =1;

            //启动动画
            var circle1 = new ShapeBall("#8ED6FF","#003BA2",60*DPR);
            var circle2 = new ShapeBall("#94ff6f","#2aa200",20*DPR);

            player = game.add.sprite(gameW/2+40*DPR,gameH/2,circle2);
            ball = game.add.sprite(gameW/2 -80*DPR,gameH/4+100,circle1);

            game.add.tween(ball).to(
                {
                    y: gameH / 2 - 50*DPR,
                    radius: 1
                },
                1000,
                Phaser.Easing.Bounce.Out,
                true,
                100 + 400 *2
            );

            //开始按钮
            button = game.add.button(gameW/2, gameH*0.78, 'btn_start', actionOnClick, this, 2, 1, 0);
            button.anchor.setTo(0.5, 0.5);
            button.scale.setTo(0.5*DPR);
            function actionOnClick () {
                game.state.start('main');
                bgm.stop();
            }

        };
        this.render = function () {
            //game.debug.geom(ball,'#cfffff');
        };
    };

    var mainState = function (game) {
        this.addBall = function () {
            //球的颜色
            var colorObj = new RandomColor();

            //球的位置
            var edge = 200;
            var ballX = game.world.randomX,
                ballY = game.world.randomY;
            if(ballX < gameW/2){
                ballX = -ballX-edge;
            }else{
                ballX = ballX+gameW+edge;
            }
            if(ballY < gameH/2){
                ballY = -ballY-edge;
            }else{
                ballY = ballY+edge;
            }
            //球的大小
            function randomSize(level){
                var randomNum = Math.floor(Math.random()*level +1);//1~10随机数
                var size = randomNum * 5*DPR;
                return size;
            }
            //当前场上球
            var sizes = [];
            for (var i=0;i<enemy.children.length;i++){
                if(enemy.children[i].visible){
                    sizes.push(enemy.children[i].width);
                }
            }
            function compare(val1,val2){
                return val1-val2;
            }
            function playerRank(arr,num){
                for(var i=0;i<arr.length;i++){
                    if(arr[i]>num){
                        return i-1;
                    }
                }
            }
            
            sizes.sort(compare);
            var userRank=playerRank(sizes,player.width);
            if(userRank < 1){
                size = randomSize(Math.ceil(player.width/20));
            }else{
                size = randomSize(10);
            }
            //绘制球
            var circle = new ShapeBall(colorObj.color2,colorObj.color1,size);
            sBall = enemy.create(ballX,ballY,circle);
            sBall.body.collideWorldBounds = true;
            sBall.body.setCircle(size/2);
            sBall.body.bounce.set(1);
            sBall.body.gravity.set(0,0);
            sBall.body.velocity.set((180 - size)*DPR,(140 - size)*DPR);
        };
        this.create = function(){
            game.physics.startSystem(Phaser.Physics.ARCADE);
            //设置游戏标准重力为100
            game.physics.arcade.gravity.y = 0;
            //game.enableBody = true;

            enemy = game.add.group();
            enemy.enableBody = true;
            enemy.physicsBodyType = Phaser.Physics.ARCADE;

            //玩家设置
            var Shape = new ShapeBall("#ff5757","#aa0101",10*DPR);
            player = game.add.sprite(gameW/2,gameH/2,Shape);
            player.anchor.setTo(0.5, 0.5);

            for(var c=0;c<4;c++) {
                this.addBall();
            }

            //拖动设置
            dragArea = game.add.sprite(-gameW,-gameH, 'playerArea');
            dragArea.width = gameW*3;
            dragArea.height = gameH*3;
            dragArea.inputEnabled = true; //sprite to input
            dragArea.input.enableDrag(); //input set drag
            //dragArea.hitArea = new Phaser.Circle(gameW / 2, gameH / 2, 90); //input set drag

            dragArea.events.onDragStart.add(dragStart);
            dragArea.events.onDragUpdate.add(dragUpdate);
            //dragArea.events.onDragStop.add(dragStop);

            function dragStart(e) {
                return {
                    moveX:gameW + e.position.x + gameW*aspect-51,
                    moveY:gameH + e.position.y + gameH*aspect-83
                };
            }
            function dragUpdate(e) {
                player.position.x = dragStart(e).moveX;
                player.position.y = dragStart(e).moveY;
            }
            function dragStop() {

            }
            //得分
            scoreText = game.add.text(24,24,'分数：0', { fontSize: fontSize+'px', fill: '#fff' });

            game.time.events.loop(2800/DPR, this.addBall, this);
            game.physics.arcade.enable([enemy,player], Phaser.Physics.ARCADE);
            //game.add.tween(player).to( { angle: 360 }, 2000, Phaser.Easing.Linear.None, true);
        };

        this.update = function(){
            game.physics.arcade.overlap(enemy,player,collectStar,null,this);
        };
        this.render = function(){
            //game.debug.pointer(game.input.mousePointer);
            //game.debug.circle(player.hitArea);
            //game.debug.spriteBounds(dragArea);
        };
        function collectStar(player,sBall) {
            console.log("player:"+player.width+"--"+sBall.width);
            destroy = game.add.sound('destroy', 0.5, false);
            win = game.add.sound('win', 0.5, false);
            lose = game.add.sound('lose', 0.5, false);

            // 吃球
            if(player.width>sBall.width){
                score +=5;
                scoreText.text = '分数：'+ score;
                destroy.play();
                sBall.kill();
                if(player.width <40*DPR){
                    player.width+=2*DPR;
                    player.height+=2*DPR;
                }else if(player.width < 50*DPR){
                    player.width+=1.23*DPR;
                    player.height+=1.23*DPR;
                }else{
                    win.play();
                    alert("恭喜你过关，分享战绩");
                    game.state.start('start');
                    score =0;
                }
            }else{
                setTimeout(function(){
                    lose.play()
                },350);
                console.log("游戏结束，你被吃掉了！");
                game.state.start('end');
            }
            return player.width;
        }
    };

    var endState = function (game) {
        this.create = function(){
            function toPercent(point){
                var str=Number(point*100).toFixed(1);
                if (str>100){
                    str = 100;
                }
                str+="%";
                return str;
            }
            var per = toPercent(score/220);

            //本场成绩
            overTxt =  game.add.text(gameW/2 ,gameH/5,'Game Over', { fontSize: fontSize*2+'px', fill: '#c00'});
            overTxt.anchor.setTo(0.5, 0.5);

            var resultTxt = '我的战绩：'+score+"\n击败了全国"+per+"的选手";
            var resultStyle = {
                fontSize: fontSize+'px',
                fill: '#fff',
                wordWrap: true,
                wordWrapWidth: 60,
                align:'center',
                boundsAlignH:'center',
                boundsAlignV:"middle"
            };
            resultInfo = game.add.text(gameW/2,gameH/3,resultTxt,resultStyle);
            resultInfo.anchor.setTo(0.5, 0.5);

            //重新开始
            button2 = game.add.button(gameW/2, gameH*0.72, 'button2', actionOnClick, this, 2, 1, 0);
            button2.anchor.setTo(0.5, 0.5);
            function actionOnClick () {
                score = 0;
                game.state.start('start');
            }
        };
        this.render = function(){

        };
    };

    game.state.add('boot',bootState);
    game.state.add('start',startState);
    game.state.add('main',mainState);
    game.state.add('end',endState);

    //游戏初始化
    game.state.start('boot');
})();