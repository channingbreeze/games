// 添加自定义场景
var loadScene = {
    key:'loadScene',
    active:true,
    preload: loadPreload,
    create: loadCreate,
}
var gameStartScene = {
    key:'gameStartScene',
    create: gameCreate,
    update: update
}
var gameOverScene = {
    key:'gameOverScene',
    create:overCreate
}
// 游戏配置
var config = {
    type: Phaser.AUTO,
    width: 288,
    height: 505,
    // 设置重力
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 600 },
            debug: false,
        }
    },
    scene: [loadScene,gameStartScene,gameOverScene],
};
var platforms,play,ground,ground2,bg,scoreText = null
var OVER = false
var groundSpeed = 0
var bgSpeed = 0
var score = 0
var platformsSpeed = -200
var pipesW = 54
var pipesX = config.width
var rd,topY,bottomY;
var game = new Phaser.Game(config);
// loding函数
function loadFn(){
    var width = this.cameras.main.width;
    var height = this.cameras.main.height;
    var loadingText = this.make.text({
        x: width / 2,
        y: height / 2 - 50,
        text: 'Loading...',
        style: {
            font: '20px monospace',
            fill: '#ffffff'
        }
    });
    loadingText.setOrigin(0.5, 0.5);
    
    var percentText = this.make.text({
        x: width / 2,
        y: height / 2 - 5,
        text: '0%',
        style: {
            font: '18px monospace',
            fill: '#ffffff'
        }
    });
    percentText.setOrigin(0.5, 0.5);
       
    this.load.on('progress', function (value) {
        percentText.setText(parseInt(value * 100) + '%');
    });

    this.load.on('complete', function () {
        loadingText.destroy();
        percentText.destroy();
    }); 
}
// 预加载
function loadPreload() {
    // 加载图片资源
    this.load.image('title','assets/title.png')
    this.load.image('start-button','assets/start-button.png')
    this.load.image('instructions','assets/instructions.png')
    this.load.image('background','assets/background.png')
    this.load.image('ground','assets/ground.png')
    this.load.image('gameover','assets/gameover.png')
    //加载音效
    this.load.audio('score','assets/score.wav')
    this.load.audio('ground-hit','assets/ground-hit.wav')
    this.load.audio('pipe-hit','assets/pipe-hit.wav')
    //加载雪碧图资源
    this.load.spritesheet('pipes','assets/pipes.png',{frameWidth:pipesW,frameHeight:320})
    this.load.spritesheet('bird','assets/bird.png',{frameWidth:34,frameHeight:24})
    loadFn.call(this)    
}
// 游戏准备
function loadCreate(){
    // 添加背景进画布    
    bg = this.add.tileSprite(config.width/2, config.height/2, config.width, config.height, 'background')
    var title =  this.add.image(config.width/2,100,'title')
    var instructions =  this.add.image(config.width/2,config.height/2,'instructions')
    var startButton = this.add.image(config.width/2,config.height-100,'start-button').setInteractive()
    //添加动画
    this.anims.create({
        key:'fly',
        frames:this.anims.generateFrameNumbers('bird',{start : 0,end : 2}),
        frameRate:10,
        repeat:-1,
    })
    
    startButton.on('pointerdown', function (pointer) {
        title.destroy()
        startButton.destroy()
        instructions.destroy()   
        game.scene.start('gameStartScene');
    });
}
//创建水管
function createPipes(){
    /** 水管创建范围
     * x 100-135 y 上-30-30,下390-450 
     */
     rd = Phaser.Math.Between(100,135)
     topY = Phaser.Math.Between(-40,20)
     bottomY = Phaser.Math.Between(380,440)
     pipesX+=rd 
    //上水管
    platforms.create(pipesX,topY,"pipes")
    //下水管
    platforms.create(pipesX,bottomY,"pipes",1) 
    //循环子组件设置重力为false
    platforms.children.iterate(function(child){
        child.body.allowGravity = false;
    })
    if(platforms.children.size<4){
        createPipes()
    }
}
//更新水管位置
function updatePipes(that){
    platforms.children.iterate(function(child){
        if(child.body.x< -pipesW){
            topY = Phaser.Math.Between(-60,0)
            bottomY = Phaser.Math.Between(400,460)
            if(child.body.y<20){
                score++
                scoreText.setText(score)
                that.sound.play('score')
                child.body.reset(config.width,topY)
            }else{
                child.body.reset(config.width,bottomY)
            }          
        }
    })
}
// 游戏开始
function gameCreate() { 
    var that = this
    //添加物理物体组
    platforms = this.physics.add.group()
    // platforms.enableBody = true;
    createPipes()
    //添加静态物理精灵
    ground = this.add.tileSprite(config.width-335/2, config.height-112/2,335,112, 'ground')
    ground = this.physics.add.existing(ground, 'staticSprite')
    scoreText = this.add.text(10,10,score)
    scoreText.setFontSize(36);
    //添加有重力的游戏角色
    player = this.physics.add.sprite(100,100,'bird')
    //添加按下事件监听
    this.input.on('pointerdown', function(pointer, currentlyOver){
        if(OVER) return;
        that.tweens.add({
            targets: player,
            duration:50,
            angle:-30,
        })
        //设置角色Y轴速度
        player.setVelocityY(-200)     
    });
    // 角色飞行动画   
    player.anims.play('fly')
}
function overCreate() {
    var title = this.add.image(config.width/2,100,'gameover')
    var startButton = this.add.image(config.width/2,config.height-100,'start-button').setInteractive()
    var that = this
    startButton.on('pointerdown', function (pointer) {
        OVER = false
        title.destroy()
        startButton.destroy()    
        //1.有重力bug
        // platforms.clear(true)
        // player.destroy()
        // ground.destroy()
        // scoreText.destroy()
        // game.scene.start('gameStartScene');    
        // 2.临时补救方法
        restart()
    });
}
function restart(){
    rd = Phaser.Math.Between(100,135)
    pipesX+=rd 
    platforms.children.entries[0].body.reset(pipesX,Phaser.Math.Between(-40,30))
    platforms.children.entries[1].body.reset(pipesX,Phaser.Math.Between(390,440))
    platforms.children.entries[2].body.reset(pipesX+rd,Phaser.Math.Between(-40,30))
    platforms.children.entries[3].body.reset(pipesX+rd,Phaser.Math.Between(390,440))
    player.x = 100
    player.y = 100
    player.angle = 0
    player.anims.play('fly')
    scoreText.setText(score)
    game.scene.resume('gameStartScene');      
}
function gameOver(that){
    OVER = true
    score = 0
    bgSpeed = 0
    groundSpeed = 0
    pipesX = config.width
    player.anims.stop('fly')
    platforms.setVelocityX(0) 
    game.scene.start('gameOverScene');
}
//  更新函数
function update() {
    var that = this
    // 背景地面无限滚动
    if(!OVER){
        bgSpeed+=0.5
        groundSpeed+=5
        bg.tilePositionX =  bgSpeed
        ground.tilePositionX =  groundSpeed
        updatePipes(this)
        platforms.setVelocityX(platformsSpeed) 
        //判断角色下降角度
    if(player.angle < 90) player.angle += 2.5;
        this.physics.resume()
    }else{
        this.physics.pause()
    }
    //添加碰撞
    this.physics.add.overlap(player,platforms,function(){
        if(OVER) return;
        that.sound.play('pipe-hit')
        gameOver()
    })
    this.physics.add.collider(player,ground,function(){
        if(OVER) return;
        that.sound.play('ground-hit')
        gameOver()
    })
}