

var winW = 414;
var winH = 736;
var score = 0;
var QingLvGroup;
var hitNum = 0;
var config = {
    selfPool:40,
    selfPic:'qinglvdog',
    rate:0.5,
    maxSpeed:500,
    minSpeed:100,
    max:95
}
var dogConfig = {
    selfPool:20,
    selfPic:'dog',
    rate:0.3,
    maxSpeed:300,
    minSpeed:50,
    punished:true
}
var time = 25;

var radio = winW/375;
function rfuc(n){
    return n*radio;
}

/***********************/
function QingLv(config){
    this.init = function(){
        this.config = config;
        QingLvGroup = game.add.group();
        QingLvGroup.enableBody = true;
        QingLvGroup.createMultiple(config.selfPool, config.selfPic);
        QingLvGroup.setAll('anchor.y',1)
        QingLvGroup.setAll('outOfBoundsKill', true);
        QingLvGroup.setAll('checkWorldBounds', true);
        this.maxWidth = game.width - 80;

        game.time.events.loop(Phaser.Timer.SECOND * config.rate, this.createQL, this);

    };
    this.createQL = function(){
        var e = QingLvGroup.getFirstExists(false);
        
        if(e) {
            if(hitNum >= config.max) {
                return;
            }
            hitNum++;
            e.events.onInputDown.removeAll();
            var ram= Math.random();
            ram =ram<0.5?ram+=0.5: ram;
            e.loadTexture(this.config.selfPic)
            e.alpha = 1;
            e.scale.setTo(rfuc(ram));
            e.reset(game.rnd.integerInRange(0, this.maxWidth), 0)
            e.body.velocity.y = game.rnd.integerInRange(config.minSpeed, config.maxSpeed);
            e.inputEnabled = true;
            e.events.onInputDown.add(this.hitted, this)
        }
    };
    this.hitted = function(sprite){
        score+=2;
        sprite.inputEnabled = false;
        var anim = sprite.animations.add('hitted');
        sprite.play('hitted', 100, false);
        anim.onComplete.add(this.fade, this, sprite)
    };
    this.fade = function(sprite){
        var tween = game.add.tween(sprite).to({alpha:0}, 300, 'Linear', true)
         tween.onComplete.add(this.killed, this, sprite);
    };
    this.killed = function(sprite){
        sprite.kill();
    }
}

function Dog(config){
    this.init = function(){
        this.config = config;
        this.DogGroup = game.add.group();
        this.DogGroup.enableBody = true;
        this.DogGroup.createMultiple(config.selfPool, config.selfPic);
        this.DogGroup.setAll('anchor.y',1)
        this.DogGroup.setAll('outOfBoundsKill', true);
        this.DogGroup.setAll('checkWorldBounds', true);
        this.maxWidth = game.width - 80;

        game.time.events.loop(Phaser.Timer.SECOND * config.rate, this.createDog, this);

    };
    this.createDog = function(){
        var e = this.DogGroup.getFirstExists(false);
        
        if(e) {
            var ram= Math.random();
            ram =ram<0.5?ram+=0.5: ram;
            e.loadTexture(this.config.selfPic)
            e.alpha = 1;
            e.scale.setTo(ram);
            e.reset(game.rnd.integerInRange(0, this.maxWidth), 0)
            e.body.velocity.y = game.rnd.integerInRange(config.minSpeed, config.maxSpeed);
        }
    };
}

/***********************/

var game = new Phaser.Game(winW, winH, Phaser.CANVAS, '');

game.States = {};


game.States.boot = function() {
    this.preload = function() {
        if (typeof(GAME) !== "undefined") {
            this.load.baseURL = GAME + "/";
        }
        if (!game.device.desktop) {
            this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
            this.scale.forcePortrait = true;
            this.scale.refresh();
        }
    };
    this.create = function() {
        game.stage.backgroundColor = '#F6DE8C';
        game.state.start('preload');
    };
};

game.States.preload = function() {
    this.preload = function() {
        game.load.spritesheet('daojishi', 'assets/img/daojishi.png', 200,200,3);
        game.load.image('bg', 'assets/img/bg.png');
        game.load.spritesheet('qinglvdog', 'assets/img/qinglvdog.png', 80,77,2);
        game.load.image('dog', 'assets/img/dog.png');
        // game.load.image('logo', 'assets/img/logo.png');
        game.load.image('shengyu', 'assets/img/shengyu.png');
        game.load.image('chaisan', 'assets/img/chaisan.png');
    };
    this.create = function() {
        game.state.start('main');
    };
};

game.States.main = function() {
    this.create = function() {
        // 剩余时间
        this.leftTime = time;

        // 物理系统
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // 背景图
        var bg = game.add.sprite(0, 0, 'bg');
        bg.width = game.width;
        bg.height = game.height;

        // logo
        // var logo =game.add.sprite(game.world.centerX - game.cache.getImage('logo').width/2*0.6, 0, 'logo')
        // logo.scale.setTo(0.6)

        // 开始游戏倒计时
        var daojishi = game.add.sprite(game.world.centerX -100, game.world.centerY - 100, 'daojishi');
        var anim = daojishi.animations.add('daojishi');
        daojishi.play('daojishi', 1, false);
        anim.onComplete.add(this.startGame, this, daojishi);

        // 游戏结束倒计时
        var shengyu = game.add.sprite(0,0,'shengyu');
        shengyu.fixedToCamera = true;
        shengyu.scale.setTo(rfuc(0.75))
        shengyu.cameraOffset.setTo(game.camera.width - rfuc(150), game.camera.height - rfuc(85));
        // 已拆散
        var chaisan = game.add.sprite(0,0,'chaisan');
        chaisan.fixedToCamera = true;
        chaisan.scale.setTo(rfuc(0.75))
        chaisan.cameraOffset.setTo(game.camera.width - rfuc(150), game.camera.height - rfuc(60));
        // 剩余时间
        this.leftTimeText = game.add.text(0, 0,  '00:'+this.leftTime,{ font: "22px Arial", fill: "#93502a"});
        this.leftTimeText.scale.setTo(rfuc(1))
        this.leftTimeText.fixedToCamera = true;
        this.leftTimeText.cameraOffset.setTo(game.camera.width - rfuc(80), game.camera.height - rfuc(88));
        // 拆散数
        this.chaiisanNum = game.add.text(0, 0,  score.toString(),{ font: "22px Arial", fill: "#93502a"});
        this.chaiisanNum.scale.setTo(rfuc(1))
        this.chaiisanNum.fixedToCamera = true;
        this.chaiisanNum.cameraOffset.setTo(game.camera.width - rfuc(80), game.camera.height - rfuc(64));
        
    };
    this.update = function(){
        this.chaiisanNum.text = score;
    }
    this.startGame = function(daojishi){
        daojishi.visible = false;
        this.createQingLv();
        game.time.events.repeat(Phaser.Timer.SECOND , this.leftTime, this.refreshTime, this)
    };
    this.createQingLv = function(){
        
        this.qinglv = new QingLv(config);
        this.qinglv.init();
        this.qinglv = new QingLv(config);
        this.qinglv.init();
        // this.qinglv = new QingLv(config);
        // this.qinglv.init();
        // this.qinglv = new QingLv(config);
        // this.qinglv.init();
        // this.dog = new Dog(dogConfig);
        // this.dog.init();
    };
    this.refreshTime = function(){
        this.leftTime--;
         var tem = this.leftTime;
        if(this.leftTime <10) {
            tem = '0' + this.leftTime;
        }
        this.leftTimeText.text = '00:'+tem;
        if(this.leftTime === 0) {
            game.paused = true;
            alert('恭喜您,得分'+score)
            // game.state.start('over');
        }
    }
};


game.States.over = function() {
    this.create = function() {
        
    };
}

game.state.add('boot', game.States.boot);
game.state.add('preload', game.States.preload);
game.state.add('main', game.States.main);
game.state.add('over', game.States.over);

game.state.start('boot');

