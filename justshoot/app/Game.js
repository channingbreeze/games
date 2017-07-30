
var utils = require('./Utils.js');

MyGame.Game = function(game) {

    game.bulletTime = 0;

};


var self;



MyGame.Game.prototype = {
    create: function() {
        self = this;

        game.biu = game.add.audio('biu');


        game.kill1 = game.add.audio('kill_1');

        game.kill2 = game.add.audio('kill_2');
        game.kill3 = game.add.audio('kill_3');
        game.kill4 = game.add.audio('kill_4');
        game.kill5 = game.add.audio('kill_5');

        game.kill1_play = false;
        game.kill2_play = false;
        game.kill3_play = false;
        game.kill4_play = false;
        game.kill5_play = false;




        this.game.touchControl = this.game.plugins.add(Phaser.Plugin.TouchControl);
        this.game.touchControl.inputEnable();

        this.game.touchControl.speed.x = this.game.touchControl.speed.y = 0

        /*定义初始化*/
        game.levelState = {level : 1,sheaves : 1};
        game.score = 0;
        game.levelDataJson = game.cache.getJSON('level_data');
        game.playerDataJson = game.cache.getJSON('player_data');
        game.monsterDataJson = game.cache.getJSON('monster_data');
        game.propDataJson = game.cache.getJSON('prop_data');
        game.playerDataJson.life += friend;
        game.allLife = game.playerDataJson.life;



        /*添加战斗背景 & 设置世界大小*/
        this.add.tileSprite(0, 0, 1500, 1500, 'bg');
        this.world.setBounds(0, 0, 1500, 1500);

        /*添加怪物组*/
        game.monsters = game.add.group();


        /*添加分数显示*/

        game.socreBox = game.add.image(1020,20,'score_box');
        game.socreBox.anchor.set(0.5,0);
        game.socreBox.fixedToCamera = true;

        game.socreText = game.add.text(10, 38, '0', { font: "30px", fill: "#91d7ff" ,align: "center"});
        game.socreText.anchor.set(0.5)
        game.socreBox.addChild(game.socreText)


        /*添加生命显示*/

        game.lifeBox = game.add.image(700,20,'life_box');
        game.lifeBox.anchor.set(0.5,0);
        game.lifeBox.fixedToCamera = true;
        game.lifeText = game.add.text(10, 38, ""+game.playerDataJson.life+"/"+game.allLife+"",{ font: "30px", fill: "#91d7ff",align: "center" });
        game.lifeText.anchor.set(0.5);
        game.lifeBox.addChild(game.lifeText)


        /*添加道具组*/
        game.props = game.add.group();


        game.weapon = new Weapon(this.game);


        /*添加玩家*/
        game.player = new Player(game);
        game.add.existing(game.player);



        /*增加默认进场buff*/
        selectKard.forEach(function(i,idx){
            utils.defaultBuff(Number(i),idx)
        })



        /*创建初始怪物组*/
        this.createMonster(game.levelState.level,game.levelState.sheaves);


        utils.tip.init();
        utils.tip.show('敌军即将进入战场，请做好准备！');


        game.clearBtn = game.add.button(950,500,'clear_btn',function(){

            game.monsters.forEach(function(i){

                if(i.inCamera)
                {
                    i.dead()
                }

            })

            game.camera.flash(0xffffff, 1000);


            game.clearBtn.kill()


        },this)

        game.clearBtn.fixedToCamera = true;





    },
    update: function() {



        if(game.player.isDead) {

            game.player.body.velocity.x = game.player.body.velocity.y = 0;
            return;
        };



        game.player.body.velocity.x = -this.game.touchControl.speed.x * game.playerDataJson.move_speed/100;
        game.player.body.velocity.y = -this.game.touchControl.speed.y * game.playerDataJson.move_speed/100;



        game.monsters.children.sort(utils.sortBy('displayer'))


        if(game.monsters.children[0].inCamera && !game.end){

            game.player.rotation = game.physics.arcade.angleBetween(game.player, game.monsters.children[0]);

            if (game.time.time > game.bulletTime)
            {

                game.weapon.fire(game.player,game.player.angle,1500,game.playerDataJson.weapon_type); //multiple

                game.biu.play()

                game.bulletTime = game.time.time + (1000 - game.playerDataJson.attack_speed);
            }
        }



        game.physics.arcade.overlap(game.player,game.monsters , null, this.hitMonster, this);

        game.physics.arcade.overlap(game.weapon.children,game.monsters , null, this.shootMonster, this);

        game.physics.arcade.overlap(game.player,game.props , null, this.pickupProp, this);




    },

    createMonster : function(lv,sheaves){



        var cc = game.levelDataJson;


        cc[lv-1].enemy[sheaves-1].forEach(function(i){
            game.monster = new Monster(game,i,lv);
            game.monsterId +=1;
            game.monster.id = game.monsterId;
            game.add.existing(game.monster);
            game.monsters.add(game.monster);
        })

    },

    hitMonster : function(player){

        game.playerDataJson.life--;

        game.lifeText.setText(""+game.playerDataJson.life+"/"+game.allLife+"")

        player.dead(game.playerDataJson.life)

    },
    shootMonster : function(bullet,monster){

        bullet.kill()

        monster.cutHp(game.playerDataJson.power);

    },

    pickupProp : function(player,prop){
        game.player.pickupProp(player,prop)
    },


    render : function(){
        /*game.debug.body(game.player);

        game.monsters.forEach(function(i){
            game.debug.body(i);
        })*/
    }
};

