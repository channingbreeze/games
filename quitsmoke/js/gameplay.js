/*
 *                       /\_/\
 *                      / - - \
 *                     <_  X  _>  /\_/\
 *                     /       \ <_o_o_>
 *                    <_)_U_U_(_> 
 */
var lungsMatrix =[ 
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 2
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 3
    [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0], // 5
    [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0], // 6
    [0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0], // 7
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0], // 8
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0], // 9
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0], // 10
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // 11
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1], // 12
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1], // 14
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1], // 15
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1], // 16
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1], // 17
    [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1], // 18
    [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1], // 19
    [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1], // 20
    [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1], // 21
    [0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0], // 22
];


var gameplay = function(game){}

gameplay.prototype = {

    init: function(){
        this.isGameRunning = false;
        this.isGameOver = false;
        this.count = 0;
        this.playCount = 1;
        this.extentCigar = 1;

        if(this.game.config.enableDebug){
            this.time.advancedTiming = true;
        } else{
            this.time.advancedTiming = false;
        }
    },

    create: function(){

        this.game.allAudios.play('menu');

        // create blocks
        this.targets = this.add.group(this.game.world, 'targets', false, true, Phaser.Physics.ARCADE);
        for(var i=0; i<lungsMatrix[0].length; i++){
           
            for(j=0; j<lungsMatrix.length; j++){
                if(lungsMatrix[j][i] == 1){
                    var block = this.game.add.sprite(i * 14 + 110, j*14 + 150, 'defaultRes', 'block_on.png');                                   
                    this.game.physics.enable(block, Phaser.Physics.ARCADE);
                    block.body.immovable = true;
                    this.targets.add(block);
                } 
            }
        }

        // create cigarette
        this.cigarette = this.add.sprite(140, 600, 'defaultRes','cigarette.png');
        this.cigarette.anchor.set(0.5);
        this.game.physics.enable(this.cigarette, Phaser.Physics.ARCADE);
        this.cigarette.body.immovable = true;


        // create bullet
        this.bullet = this.game.add.sprite(90, 440,'defaultRes', 'bullet.png');
        this.game.physics.enable(this.bullet, Phaser.Physics.ARCADE);
        this.bullet.body.collideWorldBounds = true;
        this.bullet.body.bounce.set(1);
        this.bullet.body.onCollide = new Phaser.Signal();
        this.bullet.body.onCollide.add(this.hit, this);

        // set bullet bounce area
        this.bound_top = this.customBoundLine( 70, 80, 'limit_top.png', 3.8, 1, true);
        this.bound_left = this.customBoundLine( 70, 70, 'limit_v.png', 1, 5.8);
        this.bound_right = this.customBoundLine( 450, 70, 'limit_v.png', 1, 5.8);
        this.bound_bottom = this.customBoundLine( 70, 650, 'limit_bottom.png', 3.8, 1, true);

        // add extra text
        this.text = addText(this.game, this.game.world.centerX, 45, 
            "Killed 0 Lungs Cells","25px Arial");

        this.roundInfo();
        this.warmup();
    },

    customBoundLine: function(x, y, key, widthScale, heightScale, visible = false){
        var spritObj = this.add.sprite(x, y, 'defaultRes', key);
        this.game.physics.enable(spritObj, Phaser.Physics.ARCADE);
        spritObj.body.immovable = true;
        spritObj.visible = visible;
        spritObj.scale.setTo(widthScale,heightScale);

        return spritObj;
    },

    bulletCollide: function(){
        for(var i=0; i <arguments.length; i++){
            this.physics.arcade.collide(this.bullet, arguments[i]);     
        } 
    },

    warmup:function(){
        if(this.isGameOver) return;
        this.game.time.events.add(Phaser.Timer.SECOND * 2, this.startGame, this);

        this.roundText.setText("Round\n" + this.playCount);
        this.roundInfoGroup.visible = true;
    },

    startGame: function(){
        this.roundInfoGroup.visible = false;
        this.isGameRunning = true;
        this.extentCigar = 1;
        this.cigarette.scale.setTo(1, 1);
        this.bullet.body.velocity.setTo( this.game.rnd.integerInRange(0,1) == 0? 200: -200,200);
    },

    update: function(){
        if(!this.isGameRunning) return;

        this.bulletCollide(this.cigarette, this.targets, this.bound_top, this.bound_left, this.bound_bottom, this.bound_right);

        if(this.game.input.x > 100 && this.game.input.x <= this.world.width - 100){
            this.cigarette.position.x = this.game.input.x;
        }
    },


    gameOverMenu: function(){
        this.restartMenuGroup = this.game.add.group();
        
        var panel = this.add.sprite(this.world.centerX - 175, this.world.centerY - 125, 'defaultRes', 'panel.png');
        this.restartMenuGroup.add(panel);

        this.skull = this.add.sprite(this.world.centerX-45, this.world.centerY - 100, 'defaultRes', 'skull.png');
        this.restartMenuGroup.add(this.skull);

        this.gameInfo = addText(this.game, 
                this.game.world.centerX, 
                this.game.world.centerY, 
                "You killed by " + this.playCount + " cigarettes", "20px Arial", this.restartMenuGroup);

        var btn_restart = this.game.add.sprite(this.world.centerX, 
             this.world.centerY+70, 'defaultRes', 'btn_restart.png');

        btn_restart.anchor.set(0.5);
        btn_restart.inputEnabled = true;
        btn_restart.events.onInputUp.add(this.gameOver, this);
        this.restartMenuGroup.add(btn_restart);
    },

    gameOver: function(){
        this.game.state.start('Gameplay');
    },

    roundInfo: function(){
        this.roundInfoGroup = this.game.add.group();
        var panel = this.add.sprite(this.world.centerX, this.world.centerY, 'defaultRes', 'cd_bg.png');
        panel.anchor.setTo(0.5);
        this.roundInfoGroup.add(panel);

        this.roundText = this.game.add.text(this.game.world.centerX, this.game.world.centerY + 10, "Round\n" + this.playCount,{
            font: "40px Arial",
            fill: "#ffffff",
            align: "center"
        }, this.roundInfoGroup);

        this.roundText.anchor.setTo(0.5, 0.5);
        this.roundInfoGroup.visible = false;
    },

    hit: function (bullet, hitObject){
        if(!this.isGameRunning) return;

        if(hitObject.frameName === "cigarette.png"){
            this.bullet.body.velocity.y -= 8 ;
            this.bullet.body.velocity.x -= 8 ;
            this.game.allAudios.play('bounce'); 
            this.extentCigar = this.extentCigar + 0.05 >= 1.5 ? 1.5: this.extentCigar+ 0.05;
            this.cigarette.scale.setTo(this.extentCigar ,1);
        } else if(hitObject.frameName === "limit_bottom.png"){
            this.isGameRunning = false;
            this.bullet.body.velocity.setTo(0,0);

            this.game.allAudios.play('death');
            this.bullet.position.setTo(this.game.rnd.integerInRange(100, this.world.width - 100), 410);
            this.playCount ++;
            this.warmup();

        }else if(hitObject.frameName === "block_on.png"){
            hitObject.loadTexture('defaultRes', 'block_off.png');
            this.game.allAudios.play('hit');
            hitObject.body.destroy();
            this.count ++;
            this.text.setText("Killed "+this.count+" Lungs Cells");

            var allclear = true;
            // check remamining blocks
            this.targets.forEach(function(item){
                if(item.frameName === "block_on.png"){
                    allclear = false;
                }
            });

            if(allclear){
                this.isGameOver = true;
                this.isGameRunning = false;
                this.bullet.body.velocity.setTo(0,0);
                this.gameOverMenu();
            }
        }
    },

    render: function(){
        if(this.game.config.enableDebug){
            this.game.debug.text("FPS:" + this.game.time.fps, 10, 20, "#ffffff");
        }
    }
}