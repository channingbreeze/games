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
    X: window.innerWidth/320,
    Y: window.innerHeight/480,
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
var gameCoins = 0;

function bootLoader ()
{
    this.load.image('btnStart', 'assets/images/btnStart.png');
    this.load.image('copper_coin', 'assets/images/1.png');
    this.load.image('silver_coin', 'assets/images/2.png');
    this.load.image('gold_coin', 'assets/images/3.png');
    this.load.image('bomb_coin', 'assets/images/4.png');
    this.load.image('background_image', 'assets/images/bj.jpg');
    this.load.image('player_role', 'assets/images/ren.png');
    this.load.image('information_gameProgress', 'assets/images/timeMoney.png');
    this.load.image('gold_bar', 'assets/images/gold_bar.png');
    this.load.image('time_bar', 'assets/images/time_bar.png');
    this.load.image('blackboard', 'assets/images/blackboard.png');
	// this.load.audio("click", "assets/click.ogg");
}

function bootCreate ()
{
    this.bg = this.add.image(0, 0, 'background_image').setOrigin(0);
    this.bg.width = game.config.width;
    this.bg.height = game.config.height;
    this.bg.displayWidth = game.config.width;
    this.bg.displayHeight = game.config.height;

    this.btnStart = this.add.image(0,0,'btnStart').setOrigin(0).setInteractive();
    Phaser.Display.Align.In.Center(this.btnStart,this.bg);

    this.btnStart.on("pointerdown",function(pointer){
        gameCase = 1;
        stateStart('demo',this)
    },this);
    
}

function create ()
{
    // console.log(new Date);
    this.bg = this.add.image(0, 0, 'background_image').setOrigin(0).setInteractive();
    this.bg.width = game.config.width;
    this.bg.height = game.config.height;
    this.bg.displayWidth = game.config.width;
    this.bg.displayHeight = game.config.height;

    this.player = this.add.sprite(0,0,'player_role').setOrigin(0.5,1).setScale(0.5);
    this.player.setScale(this.player.scaleX*scale.X,this.player.scaleY*scale.Y);
    Phaser.Display.Align.In.BottomCenter(this.player, this.bg);
    this.player.getCoins = 0;

    this.coins = this.physics.add.group();

    this.information_gameProgress = this.add.image(0,0,'information_gameProgress').setOrigin(0);
    this.information_gameProgress.setScale(scale.X/1.29,scale.Y/1.3);

    this.gold_bar = this.add.image(0,0,'gold_bar').setOrigin(0);
    this.gold_bar.setScale(scale.X/5.9,scale.Y/1.2);
    this.gold_bar.x=game.config.width/7;
    this.gold_bar.y = game.config.height*0.02900001;
    this.gold_bar.progress_all = this.gold_bar.scaleX;
    this.gold_bar.progress_percent = 0;
    this.gold_bar.setScale(this.gold_bar.progress_percent,this.gold_bar.scaleY);

    this.time_bar = this.add.image(0,0,'time_bar').setOrigin(1,0);
    this.time_bar.setScale(scale.X/3.6,scale.Y/1.3);
    this.time_bar.x = game.config.width/1.157;
    this.time_bar.y = game.config.height*0.03;
    this.time_bar.progress_all = this.time_bar.scaleX;
    this.time_bar.progress_percent = 0;
    this.time_bar.setScale(this.time_bar.progress_percent,this.time_bar.scaleY);

    this.dt = 0;
}

function update ()
{
    
    if (gameCase!==1) {
        return false;
    }


    this.dt++;
    if (this.dt%100==0) {
        for (let i = 0; i < 10; i++) {
            let coin = this.coins.create(0,0,'gold_coin').setOrigin(0).setScale(0.5);
            let rnd = Phaser.rnd.between(1,4);
            switch (rnd) {
                case 1:
                    coin.setTexture("copper_coin");
                    break;
                case 2:
                    coin.setTexture("silver_coin");
                    break;
                case 3:
                    coin.setTexture("gold_coin");
                    break;
                default:
                    coin.setTexture("bomb_coin");
                    break;
            }
            coin.setGravityY(50);
            coin.setX(Phaser.rnd.between(0,game.config.width-this.coins.children.entries[i].width*this.coins.children.entries[i].scaleX));
            coin.setY(Phaser.rnd.between(0,-10000));
            coin.setScale(coin.scaleX*scale.X,coin.scaleY*scale.Y);
        }
    }

    this.time_bar.progress_percent += 0.0001;
    if (this.time_bar.progress_percent >= this.time_bar.progress_all) {
        gameCase = 2;
        // console.log(new Date);
    }
    this.time_bar.setScale(this.time_bar.progress_percent,this.time_bar.scaleY);

    this.player.x = this.bg.input.localX * this.bg.scaleX;

    for (let i = 0; i < this.coins.children.entries.length; i++) {
        if (checkOverlap(this.player, this.coins.children.entries[i])) {
            let key = this.coins.children.entries[i].texture.key;
            switch (key) {
                case "copper_coin":
                    this.gold_bar.progress_percent += 0.001;
                    this.player.getCoins += 1;
                    // console.log('coin+1');
                    break;
                    case "silver_coin":
                    this.gold_bar.progress_percent += 0.005;
                    this.player.getCoins += 5;
                    // console.log('coin+5');
                        break;
                        case "gold_coin":
                        this.gold_bar.progress_percent += 0.01;
                        this.player.getCoins += 10;
                        // console.log('coin+10');
                            break;
                            case "bomb_coin":
                                gameCase = 3;
                                gameCoins = this.player.getCoins;
                                stateStart('over',this);
                                // console.log('u r lost!');
                                break;
                default:
                    break;
            }
            // console.log('playerCoins:'+this.player.getCoins);
            this.coins.children.entries[i].destroy();
            // this.gold_bar.progress_percent += 0.001;
            if (this.gold_bar.progress_percent >= this.gold_bar.progress_all) {
                gameCase = 2;
            }
            this.gold_bar.setScale(this.gold_bar.progress_percent,this.gold_bar.scaleY);
        }
        
    } 
    //     //this.sound.play('sklo2');
    //     // this.time.addEvent({ delay: 1000, callback: destroyParticles, callbackScope: this });
    
}

function gameoverState(){
    this.bg = this.add.image(0, 0, 'background_image').setOrigin(0);
    this.bg.width = game.config.width;
    this.bg.height = game.config.height;
    this.bg.displayWidth = game.config.width;
    this.bg.displayHeight = game.config.height;

    this.blackboard = this.add.image(0,0,'blackboard').setOrigin(0);
    this.blackboard.width = game.config.width;
    this.blackboard.displayWidth = game.config.width;
    this.blackboard.height = game.config.height/3.5;
    this.blackboard.displayHeight = this.blackboard.height;
    this.blackboard.y = game.config.height/3.5;

    this.overText = this.add.text(0,0,'Game Over');
    this.overText.setFontSize(108);
    this.overText.setColor('#000');
    Phaser.Display.Align.To.TopCenter(this.overText, this.blackboard);

    this.coinsText = this.add.text(0,0,'Coins:'+gameCoins);
    this.coinsText.setFontSize(72);
    this.coinsText.setColor('#fff');
    Phaser.Display.Align.In.Center(this.coinsText, this.blackboard);

    this.btnStart = this.add.image(0,0,'btnStart').setOrigin(0).setInteractive();
    Phaser.Display.Align.To.BottomCenter(this.btnStart,this.blackboard);
    this.btnStart.y += this.btnStart.height;
    this.btnStart.on("pointerdown",function(pointer){
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