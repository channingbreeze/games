var gameWidth = 0;

setGameWidth();

var loaderSceneConfig = {
    key: 'loader',
    active: true,
    preload: bootLoader,
    create: bootCreate
};

var demoSceneConfig = {
    key: 'demo',
    active: false,
    visible: false,
    create: create,
    update: update
};

var overSceneConfig = {
    key: 'over',
    active: false,
    visible: false,
    create: gameoverState
};

var scale = {
    x: gameWidth/320,
    y: window.innerHeight/480,
}

var config = {
    type: Phaser.CANVAS,
    parent: 'phaser-example',
    width: gameWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: !!false
        }
    },
    scene: [ loaderSceneConfig, demoSceneConfig, overSceneConfig ],
    title:'my second phaser3 project',
    audio: {
        disableWebAudio: true
    }
};

var game = new Phaser.Game(config);

var gameCase = 0;
var itemRandom = 0;
var gameScore = 0;

function bootLoader ()
{
    this.load.image('bg', 'assets/images/game_bg.jpg');
    this.load.image('progress', 'assets/images/progress.png');
    this.load.spritesheet('htl', 'assets/images/h.png', { frameWidth: 1080/10, frameHeight: 101 });
    this.load.spritesheet('xhh', 'assets/images/x.png', { frameWidth: 1080/10, frameHeight: 101 });
    this.load.spritesheet('down_htl', 'assets/images/down_htl.png', { frameWidth: 648/6, frameHeight: 101 });
    this.load.spritesheet('down_xhh', 'assets/images/down_xhh.png', { frameWidth: 648/6, frameHeight: 101 });
}

function bootCreate ()
{
    this.bg = this.add.image(0, 0, 'bg').setOrigin(0);
    this.bg.width = game.config.width;
    this.bg.height = game.config.height;
    this.bg.displayWidth = game.config.width;
    this.bg.displayHeight = game.config.height;

    this.progress = this.add.image(0,0,'progress').setOrigin(0).setInteractive();
    this.progress.width = game.config.width/2.5;
    this.progress.displayWidth = this.progress.width;
    this.progress.height = game.config.height/15;
    this.progress.displayHeight = this.progress.height;
    Phaser.Display.Align.In.Center(this.progress,this.bg);
    this.progress.y += this.progress.height*4;

    this.startText = this.add.text(0,0,'开始游戏');
    this.startText.setFontSize(36);
    this.startText.setColor('#fff');
    Phaser.Display.Align.In.Center(this.startText, this.progress);
    this.progress.on("pointerdown",function(pointer){
        gameCase = 1;
        stateStart('demo',this)
    },this);
    
}

function create ()
{
    this.bg = this.add.image(0, 0, 'bg').setOrigin(0);
    this.bg.width = game.config.width;
    this.bg.height = game.config.height;
    this.bg.displayWidth = game.config.width;
    this.bg.displayHeight = game.config.height;
    this.wolfs = this.add.group(); 
    this.wolfs.create(0,0,'htl').setOrigin(0).setFrame(0);
    this.wolfs.create(0,0,'htl').setOrigin(0).setFrame(0);
    this.wolfs.create(0,0,'htl').setOrigin(0).setFrame(0);
    this.wolfs.create(0,0,'htl').setOrigin(0).setFrame(0);
    this.wolfs.create(0,0,'htl').setOrigin(0).setFrame(0);
    this.wolfs.create(0,0,'htl').setOrigin(0).setFrame(0);
    this.wolfs.create(0,0,'htl').setOrigin(0).setFrame(0);
    this.wolfs.create(0,0,'htl').setOrigin(0).setFrame(0);
    this.wolfs.create(0,0,'htl').setOrigin(0).setFrame(0);
    for (let i = 0; i < this.wolfs.children.entries.length; i++) {
        this.wolfs.children.entries[i].width *= scale.x;
        this.wolfs.children.entries[i].height *= scale.y;
        this.wolfs.children.entries[i].displayWidth = this.wolfs.children.entries[i].width;
        this.wolfs.children.entries[i].displayHeight = this.wolfs.children.entries[i].height;
        this.wolfs.children.entries[i].setInteractive();
        this.wolfs.children.entries[i].setAlpha(0);
    }
    this.wolfs.children.entries[0].x = game.config.width/3.2;
    this.wolfs.children.entries[0].y = game.config.height/4.2;
    
    this.wolfs.children.entries[1].x = game.config.width/15;
    this.wolfs.children.entries[1].y = game.config.height/3;
    
    this.wolfs.children.entries[2].x = game.config.width/1.7;
    this.wolfs.children.entries[2].y = game.config.height/3.4;
    
    this.wolfs.children.entries[3].x = game.config.width/3.2;
    this.wolfs.children.entries[3].y = game.config.height/2.5;
    
    this.wolfs.children.entries[4].x = game.config.width/15.9;
    this.wolfs.children.entries[4].y = game.config.height/2.17;
    
    this.wolfs.children.entries[5].x = game.config.width/1.6;
    this.wolfs.children.entries[5].y = game.config.height/2.25;
    
    this.wolfs.children.entries[6].x = game.config.width/2.6;
    this.wolfs.children.entries[6].y = game.config.height/1.75;
    
    this.wolfs.children.entries[7].x = game.config.width/10;
    this.wolfs.children.entries[7].y = game.config.height/1.63;
    
    this.wolfs.children.entries[8].x = game.config.width/1.55;
    this.wolfs.children.entries[8].y = game.config.height/1.62;

    var config = {
        key: 'up_htl',
        frames: this.anims.generateFrameNumbers('htl',{ start: 0,end: 5}),
        frameRate: 18,//速率
        // yoyo: true,//yoyo 往复
        // repeat: -1//循环
    };
    
    this.anims.create(config);
    this.anims.create({
        key: 'hit_htl',
        frames: this.anims.generateFrameNumbers('htl',{ start: 6,end: 9}),
        frameRate: 18,
    });
    this.anims.create({
        key: 'down_htl',
        frames: this.anims.generateFrameNumbers('down_htl'),
        frameRate: 18,
    });

    itemRandom = Phaser.rnd.between(0,8);
    for (let i = 0; i < this.wolfs.children.entries.length; i++) {
        this.wolfs.children.entries[itemRandom].play('up_htl');
        this.wolfs.children.entries[itemRandom].setAlpha(1);
        this.wolfs.children.entries[i].on("pointerdown",function(pointer){
            if (this.wolfs.children.entries[i].anims.currentAnim.key=="up_htl") {
                this.wolfs.children.entries[i].anims.play('hit_htl');
                gameScore += 100;
            }
            if (this.wolfs.children.entries[i].anims.currentAnim.key=="down_htl") {
                if (this.wolfs.children.entries[i].anims.currentFrame.isLast) {
                    return false;
                }
                this.wolfs.children.entries[i].anims.play('hit_htl');
                gameScore += 100;
            }
        },this);
        this.wolfs.children.entries[i].on('animationcomplete', function(){
            if (this.wolfs.children.entries[i].anims.currentAnim.key=="up_htl") {
                this.wolfs.children.entries[i].anims.play('down_htl');
            }
            if (this.wolfs.children.entries[i].anims.currentAnim.key=="hit_htl") {
                this.wolfs.children.entries[i].anims.play('down_htl');
            }
            if (this.wolfs.children.entries[i].anims.currentAnim.key=="down_htl") {
                if (this.wolfs.children.entries[i].anims.currentFrame.isLast) {
                    this.wolfs.children.entries[itemRandom].setAlpha(0);
                }
            }
        }, this); 
    }
    
    gameScore = 0;

    this.scoreText = this.add.text(0,0,gameScore);
    this.scoreText.setFontSize(game.config.width/15);
    this.scoreText.setColor('#fff');
    this.scoreText.x = game.config.width/5;
    this.scoreText.y = game.config.height/35;

    this.progress_bar = this.add.image(0,0,'progress').setOrigin(0);
    this.progress_bar.setScale(1.38,scale.y-0.2);
    this.progress_bar.x += game.config.width/5;
    this.progress_bar.y += game.config.height/7.2;
    this.progress_bar.progress_all = this.progress_bar.scaleX;
    this.progress_bar.progress = 0;
    this.progress_bar.setScale(this.progress_bar.progress,scale.y-0.2);

    
    this.dt = 0;

}

function update ()
{

    if (gameCase!==1) {
        return false;
    }

    this.dt++;
    if (this.dt%113==0) {
        itemRandom = Phaser.rnd.between(0,8);
        for (let i = 0; i < this.wolfs.children.entries.length; i++) {
            this.wolfs.children.entries[i].play('up_htl');
            this.wolfs.children.entries[itemRandom].setAlpha(1);
        }
    }

    this.scoreText.setText(gameScore);

    this.progress_bar.progress += 0.001;
    if (this.progress_bar.progress>=this.progress_bar.progress_all) {
        gameCase = 2;
        stateStart('over',this);
        this.scene.setVisible(true);
    }
    this.progress_bar.setScale(this.progress_bar.progress,scale.y-0.2);
}

function gameoverState(){
    
    this.bg = this.add.image(0, 0, 'bg').setOrigin(0);
    this.bg.width = game.config.width;
    this.bg.height = game.config.height;
    this.bg.displayWidth = game.config.width;
    this.bg.displayHeight = game.config.height;
    this.bg.setAlpha(0);

    this.progress = this.add.image(0,0,'progress').setOrigin(0).setInteractive();
    this.progress.width = game.config.width/2.5;
    this.progress.displayWidth = this.progress.width;
    this.progress.height = game.config.height/15;
    this.progress.displayHeight = this.progress.height;
    Phaser.Display.Align.In.Center(this.progress,this.bg);
    this.progress.y += this.progress.height*4;

    this.startText = this.add.text(0,0,'重新开始');
    this.startText.setFontSize(36);
    this.startText.setColor('#fff');
    Phaser.Display.Align.In.Center(this.startText, this.progress);

    this.progress.on("pointerdown",function(pointer){
        gameCase = 1;
        stateStart('demo',this)
    },this);


}

function stateStart(state,stateOld){
    stateOld.scene.setVisible(false)
    game.scene.start(state);
}

function checkOverlap(spriteA, spriteB) {

        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();
        return IsRectCross(boundsA,boundsB);

    }
function IsRectCross(rect1, rect2)
{
    if(rect1.right <= rect2.left) return false;
    if(rect1.left >= rect2.right ) return false;

    if(rect1.bottom <= rect2.top ) return false;
    if(rect1.top >= rect2.bottom ) return false;

    return true;
}
Phaser.rnd = {};
Phaser.rnd.between = function (min,max){
    return Math.floor(Math.random()*(max + 1 - min) + min);
}

function setGameWidth(){
    var target = navigator.userAgent.toLowerCase();	
    if (/iphone|ipad|ipod/.test(target)) {
        //iphone	
        gameWidth = window.innerWidth;
    } else if (/android/.test(target)) {
        //android
        gameWidth = window.innerWidth;
    } else if (/window|macintosh/.test(target)) {
        //window
        gameWidth = 445;
    }
}