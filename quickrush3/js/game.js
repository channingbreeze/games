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
    update: update     //1
};

var overSceneConfig = {
    key: 'over',
    active: false,
    visible: false,
    create: gameoverState
};

var scale = {
    x: window.innerWidth/480,
    y: window.innerHeight/320,
}

var config = {
    type: Phaser.CANVAS,
    parent: 'phaser-example',
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: !true
        }
    },
    scene: [ loaderSceneConfig, demoSceneConfig, overSceneConfig ],
    title:'my second phaser3 project',
    audio: {
        disableWebAudio: true
    }
};

var game = new Phaser.Game(config);

var gameScore = 0;
var gameCase = 0;

function bootLoader ()
{
    this.load.image('scene1_bg', 'assets/images/rush-menu-scene.png');
    this.load.image('scene2_trees', 'assets/images/trees.png');
    this.load.image('scene2_landscape', 'assets/images/landscape.png');
    this.load.image('scene2_platform', 'assets/images/platform.png');
    this.load.image('scene2_hr', 'assets/images/hr.png');
    this.load.spritesheet('scene2_running', 'assets/images/running.png', { frameWidth: 64/4, frameHeight: 16 });
    this.load.atlas('scene2_coin', 'assets/images/coin.png', 'assets/images/coin.json');
    this.load.atlas('scene2_obstacle', 'assets/images/obstacle.png', 'assets/images/obstacle.json');
    this.load.image('scene3_bg', 'assets/images/rush-gameover-scene.png');
      
}

function bootCreate ()
{
    this.bg = this.add.image(0, 0, 'scene1_bg').setOrigin(0).setInteractive();
    this.bg.width = game.config.width;
    this.bg.height = game.config.height;
    this.bg.displayWidth = game.config.width;
    this.bg.displayHeight = game.config.height;

    this.bg.on('pointerdown',function(pointer){
        stateStart('demo',this);
    },this);
    
    
}

function create ()
{
    gameScore = 0;

    /* 背景 */
    this.bg = this.add.image(0, 0, 'scene2_trees').setOrigin(0).setInteractive();//加上setinteractive防止上一场景事件被触发
    this.bg.width = game.config.width;
    this.bg.height = game.config.height;
    this.bg.displayWidth = game.config.width;
    this.bg.displayHeight = game.config.height;

    /* 天空 */
    this.landscape = this.add.tileSprite(0, 0, window.innerWidth,window.innerHeight/2, 'scene2_landscape').setOrigin(0);

    /* 平台 */
    this.grounds = this.physics.add.group();
    a = this.grounds.create(0,0,'scene2_platform') //3
    .setOrigin(0)
    .setScale(3)
    .setPosition(Phaser.rnd.between(0,50),Phaser.rnd.between(window.innerHeight/2,window.innerHeight/3*1.5))//2
    .setIndex(0)
    .setOffset(60,6)
    .setFloatY(-50);
    b = this.grounds.create(0,0,'scene2_platform')
    .setOrigin(0)
    .setScale(3)
    .setPosition(a.x+a.width*a.scaleX*1.2,a.y)
    .setIndex(1)
    .setOffset(60,6)
    .setFloatY(50);
    c = this.grounds.create(0,0,'scene2_platform')
    .setOrigin(0)
    .setScale(3)
    .setPosition(b.x+b.width*b.scaleX*1.3,b.y)
    .setIndex(2)
    .setOffset(60,6)
    .setFloatY(-50);
    a.o = c;
    b.o = a;
    c.o = b;
    a.body.immovable = true;
    b.body.immovable = true;
    c.body.immovable = true;

    /* 角色动画 */ 
    var runningConfig = {//spritesheet
        key: 'running',
        frames: this.anims.generateFrameNumbers('scene2_running'),
        frameRate: 6,
        yoyo: true,
        repeat: -1
    };
    
    if (this.animsConfig_1) {
        
    } else{
        this.animsConfig_1 = this.anims.create(runningConfig);
    }
    

    this.running = this.physics.add.sprite(100,0,'scene2_running').setOrigin(0).setScale(4);
    this.running.anims.play('running');
    this.running.setSize(7,12);
    this.running.setOffset(10,10);
    this.running.setGravityY(600);


    /* 金币动画 */
    var textureFramesCoin = this.textures.get('scene2_coin').getFrameNames();//atlas
    var animFramesCoin = [];
    textureFramesCoin.forEach(function (frameName) {
        animFramesCoin.push({ key: 'scene2_coin', frame: frameName });
    });
    if (this.animsConfig_2) {
        
    } else{
        this.animsConfig_2 = this.anims.create({
            key: 'coin', 
            frames: animFramesCoin, 
            frameRate:6,
            yoyo: true,
            repeat: -1 
       });
    }
    

    this.coins = this.physics.add.group();
    a.c = this.coins.create(0,0,'scene2_coin').setIndex(0).setOrigin(0).setScale(3).play('coin');
    a.c.leftScale = 6.5;
    a.c.x = a.x + a.c.width*6.5;
    a.c.y = a.y - a.c.height*a.c.scaleY;

    b.c = this.coins.create(0,0,'scene2_coin').setIndex(1).setOrigin(0).setScale(3).play('coin');
    b.c.leftScale = 10;
    b.c.x = b.x + b.c.width*10;
    b.c.y = b.y - b.c.height*b.c.scaleY;
    
    c.c = {
        x: 0,
        y: 0,
        leftScale: 12,
        index: 2
    };

    /* 障碍动画 */
    var textureFramesObstacle = this.textures.get('scene2_obstacle').getFrameNames();//atlas
    var animFramesObstacle = [];
    textureFramesObstacle.forEach(function (frameName) {
        animFramesObstacle.push({ key: 'scene2_obstacle', frame: frameName });
    });

    if (this.animsConfig_3) {
        
    } else{
        this.animsConfig_3 = this.anims.create({
            key: 'obstacle', 
            frames: animFramesObstacle, 
            frameRate:6,
            repeat: -1 
       });
    }
    

    this.obstacle = this.physics.add.group();
    a.b = this.obstacle.create(0,0,'scene2_obstacle').setOrigin(0).setScale(3).play('obstacle');
    a.b.leftScale = 8.5;
    a.b.x = a.x + a.b.width*8.5;
    a.b.y = a.y - a.b.height*a.b.scaleY*0.8;

    b.b = this.obstacle.create(0,0,'scene2_obstacle').setOrigin(0).setScale(3).play('obstacle');
    b.b.leftScale = 12;
    b.b.x = b.x + b.b.width*12;
    b.b.y = b.y - b.b.height*a.b.scaleY*0.8;
    
    c.b = {
        x: 0,
        y: 0,
        leftScale: 12
    };

    this.scoreText = this.add.text(0,0,gameScore);
    this.scoreText.setColor('#fff');
    this.scoreText.setFontSize(window.innerWidth/20);


    this.scene2_hr = this.physics.add.sprite(0,0,'scene2_hr').setOrigin(0);
    this.scene2_hr.width = game.config.width;
    this.scene2_hr.displayWidth = this.scene2_hr.width;
    this.scene2_hr.y = this.bg.height*1.25;

    this.physics.add.collider(this.running, this.grounds);
    this.physics.add.collider(this.running, this.scene2_hr,function(player,hr){
        stateStart('over',player.scene);
    });

    this.physics.add.overlap(this.running, this.coins,function(player,coin){
        if (coin.active) {
            coin.active = false;
            coin.setAlpha(0);
            gameScore += 1;
            this.scoreText.setText(gameScore);
        }
    },null,this);
    this.physics.add.overlap(this.running, this.obstacle,function(player,coin){
        player.destroy();
        stateStart('over',this);
    },null,this);

}
 
function update ()
{

    if (this.running.active) {
        if (this.input.activePointer.isDown && this.running.body.touching.down)
        {
            this.running.setVelocityY(-350);
        }
    }
    

    this.landscape.tilePositionX += 2;

    for (let i = 0; i < this.grounds.children.entries.length; i++) {
        this.grounds.children.entries[i].x -= 3;
        this.grounds.children.entries[i].c.x = this.grounds.children.entries[i].x + this.grounds.children.entries[i].c.width*this.grounds.children.entries[i].c.leftScale;
        this.grounds.children.entries[i].c.y = this.grounds.children.entries[i].y - this.grounds.children.entries[i].c.height*this.grounds.children.entries[i].c.scaleY;
        this.grounds.children.entries[i].b.x = this.grounds.children.entries[i].x + this.grounds.children.entries[i].b.width*this.grounds.children.entries[i].b.leftScale;
        this.grounds.children.entries[i].b.y = this.grounds.children.entries[i].y - this.grounds.children.entries[i].b.height*this.grounds.children.entries[i].b.scaleY*0.8;
        if (this.grounds.children.entries[i].x + this.grounds.children.entries[i].width * this.grounds.children.entries[i].scaleX <= 0) {
            this.grounds.children.entries[i].setPosition(this.grounds.children.entries[i].o.x+this.grounds.children.entries[i].o.width*this.grounds.children.entries[i].o.scaleX*1.3,this.grounds.children.entries[i].o.y);
            let rnd = Phaser.rnd.between(1,2);
            var r = Phaser.rnd.between(50,100); 
            if (rnd==1) {
                this.grounds.children.entries[i].setFloatY(r);
            }else{
                this.grounds.children.entries[i].setFloatY(-r);
            }
            if (this.grounds.children.entries[i].y<=window.innerHeight/3) {
                this.grounds.children.entries[i].setFloatY(100);
            } else if (this.grounds.children.entries[i].y>=window.innerHeight/2) {
                this.grounds.children.entries[i].setFloatY(-100);
            }
            if (this.grounds.children.entries[i].c.index!==2) {
                this.grounds.children.entries[i].c.setAlpha(1).active = true;
            }
        }        
    }

}

function gameoverState(){
    this.bg = this.add.image(0, 0, 'scene3_bg').setOrigin(0).setInteractive();
    this.bg.width = game.config.width;
    this.bg.height = game.config.height;
    this.bg.displayWidth = game.config.width;
    this.bg.displayHeight = game.config.height;

    this.bg.on('pointerdown',function(pointer){
        stateStart('demo',this);
    },this);


    this.scoreText = this.add.text(0,0,'Your score is '+gameScore+'.');
    this.scoreText.setColor('#fff');
    this.scoreText.setFontSize(window.innerWidth/20);
    Phaser.Display.Align.In.Center(this.scoreText,this.bg);
}

function stateStart(state,stateOld){
    stateOld.scene.setVisible(false);
    stateOld.scene.stop();
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

Phaser.GameObjects.Sprite.prototype.setIndex = function(value){
    this.index = value;
	return this;
}
Phaser.GameObjects.Sprite.prototype.setFloatY = function(value){
    this.y += value;
	return this;
}