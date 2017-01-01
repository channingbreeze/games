Kiteflying.Game = function(game) {

};
Kiteflying.Game.prototype = {
    create: function() {

        this.game.touchControl = this.game.plugins.add(Phaser.Plugin.TouchControl);
        this.game.touchControl.settings.singleDirection = false; //控制方式 false:360°控制 true:上下左右控制

        this.bg = this.add.tileSprite(0,0,Kiteflying.GAME_WIDTH,Kiteflying.GAME_HEIGHT,'gameBg');

        this.branchGroup = this.add.group();
        this.branchGroup.enableBody = true;

        this.kite = this.add.sprite(Kiteflying.GAME_WIDTH/2-30,Kiteflying.GAME_HEIGHT/2,'kite');
        this.kite.animations.add('fly');
        this.kite.animations.play('fly', 10, true);
        this.physics.enable(this.kite,Phaser.Physics.ARCADE);
        this.kite.body.setSize(55, 120, 10, 20);
        this.kite.body.collideWorldBounds = true;

        this.bmpText = this.add.bitmapText(30, 10, 'desyrel','0', 64);

        this.scoreBox = this.add.group();
        
        this.hasStarted = false;
        this.time.events.loop(2500, this.createBranch, this);
        this.time.events.stop(false);

        this.startGame();
    },
    easeInSpeed : function(x){
        return x * Math.abs(x) / 1500;
    },
    update: function() {
        if(!this.hasStarted) return;
        this.physics.arcade.overlap(this.kite, this.branchGroup, this.hitBranch, null, this);
        if(!this.gameIsover)
        {
            this.checkScore();
            this.speed = this.game.touchControl.speed;
            this.bg.tilePosition.x += this.easeInSpeed(this.speed.x/3);
            this.kite.x -= this.easeInSpeed(this.speed.x);
            this.kite.y -= this.easeInSpeed(this.speed.y);
        }
    },
    rd : function(n,m){
        var c = m-n+1;
        return Math.floor(Math.random() * c + n);
    },
    startGame : function(){
        this.gameSpeed = 200;
        this.hasStarted = true;
        this.gameIsover = false;
        this.score = 0;
        this.bg.autoScroll(0,this.gameSpeed/5);
        this.time.events.start();
        this.game.touchControl.inputEnable();
    },
    gameover : function(){
        this.gameIsover = true;
        this.bg.stopScroll();
        this.branchGroup.forEachExists(function(kite){
            kite.body.velocity.y = 0;
        }, this);
        this.time.events.stop(true);
        this.bmpText.destroy();
        this.branchGroup.destroy();
        this.kite.destroy();
        this.showGameOverTxt();
    },
    showGameOverTxt : function(){
        this.scoreBox.create(0,0,'scoreBox');
        this.scoreBox.x = 30;
        this.scoreBox.y = 70;
        this.style = { font: "38px Microsoft Yahei", fill: "#774b16", wordWrap: true, wordWrapWidth: this.scoreBox.width, align: "center" };
        this.scoreTxt = this.add.text(150, 118, "恭喜你\n你的最终得分是" + this.bmpText.text);
        this.add.button(Kiteflying.GAME_WIDTH/2-160, Kiteflying.GAME_HEIGHT/2 - 180,'button-rest', this.gameReset, this);
    },
    gameReset : function(){
        this.state.start('Game');
    },
    createBranch : function(){
        this.gap = this.gap || 150;
        var leftBranch = -(100 + this.rd(150,450));
        var rightBranch = leftBranch + this.gap + 640;
        if(this.resetBranch(leftBranch,rightBranch)) return;
        var leftBranch = this.add.sprite(leftBranch, -150, 'branchs', 0, this.branchGroup);
        var rightBranch = this.add.sprite(rightBranch, -150, 'branchs', 1, this.branchGroup);
        this.branchGroup.setAll('checkWorldBounds',true);
        this.branchGroup.setAll('outOfBoundsKill',true);
        this.branchGroup.setAll('body.velocity.y', this.gameSpeed);
    },
    resetBranch : function(leftBranch,rightBranch){
        var i = 0;
        this.branchGroup.forEachDead(function(kite){
            if(kite.x<=0){
                kite.reset(leftBranch, -150);
            }else{
                kite.reset(rightBranch, -150);
            }
            kite.body.velocity.y = this.gameSpeed;
            i++;
        },this)
        return i == 2;
    },
    hitBranch : function(){
        if(this.gameIsover) return;
        this.gameover();
    },
    checkScore : function(){
        this.bmpText.text = ++this.score / 10;
        this.gameSpeed+=0.1;
    }
};

