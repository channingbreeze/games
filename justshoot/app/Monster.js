/**
 * Created by 365 on 2017-07-11.
 */





Monster = function(_game,monsterId,lv){


    this.monster = game.monsterDataJson[monsterId-1];

    game.difficulty = game.levelDataJson[lv-1].difficulty;


    this.way = [
        {x:game.rnd.realInRange(-100, -500),y:game.rnd.realInRange(-100, game.world.height+500)},
        {x:game.rnd.realInRange(game.world.width+100, game.world.width+500),y:game.rnd.realInRange(-100, game.world.height+500)},
        {x:game.rnd.realInRange(-100, game.world.width+500),y:game.rnd.realInRange(-100, -500)},
        {x:game.rnd.realInRange(-100, game.world.width+500),y:game.rnd.realInRange(game.world.height+100, game.world.height+500)}
    ]

    var rnd = game.rnd.between(0, 3);


    Phaser.Sprite.call(this, _game, this.way[rnd].x,  this.way[rnd].y, 'monster_'+this.monster.resId+'');
    game.physics.enable(this, Phaser.Physics.ARCADE);

    this.body.setSize(this.width/2, this.height/2, this.width/4, this.height/4);

    this.animations.add('run', Phaser.Animation.generateFrameNames('monster'+this.monster.resId+'_run_', 0, 2, '', 4), 3, true);
    this.animations.play('run');
    this.anchor.set(0.5)



    this.x_dir = 1;
    this.y_dir = 1;

    this.displayer = null;



    this.isHit = false;



    this.speed = this.monster.SPEED * game.difficulty;
    this.hp = this.monster.HP * game.difficulty;
    this.score = parseInt(this.monster.SCORE * game.difficulty);
    this.drop = this.monster.Drop



}

Monster.prototype = Object.create(Phaser.Sprite.prototype);
Monster.prototype.constructor = Monster;

Monster.prototype.update = function(){



    if(game.player.isDead) return;


    this.displayer = Math.sqrt((Math.abs(game.player.x - this.x) * Math.abs(game.player.x - this.x)) + (Math.abs(game.player.y - this.y) * Math.abs(game.player.y - this.y)))



    this.isHit?this.tint = 0xff0000:this.tint = 0xffffff;

    this.isHit = false;


    if(parseInt(this.x)>=parseInt(game.player.x - game.player.width/2 + 20) && parseInt(this.x)<=parseInt(game.player.x + game.player.width/2 - 20))
    {
        this.body.velocity.x = 0
    }
    else {

        parseInt(this.x) > parseInt(game.player.x) ? this.x_dir = -1 : this.x_dir = 1;

        this.body.velocity.x = this.speed * this.x_dir;
    }


    if(parseInt(this.y)>=parseInt(game.player.y - game.player.height/2 + 50) && parseInt(this.y)<=parseInt(game.player.y + game.player.height/2 - 50))
    {
        this.body.velocity.y = 0
    }
    else {

        parseInt(this.y) > parseInt(game.player.y) ? this.y_dir = -1 : this.y_dir = 1;


        this.body.velocity.y = this.speed * this.y_dir
    }


    this.rotation =game.physics.arcade.angleBetween(this, game.player)



};

Monster.prototype.cutHp = function(power){

    this.isHit = true;

    if(this.inWorld)
    {
        this.hp -= power;
        if(this.hp<=0)
        {
            this.dead()
        }
    }



}


Monster.prototype.dead = function(){


    var _o = this;

    this.body.enable = false;

    game.score += Number(parseInt(this.score));



    if(game.score>10000 && !game.kill1_play)
    {
        game.kill1.play()
        game.kill1_play = true
    }else if(game.score>50000 && !game.kill2_play)
    {
        game.kill2.play()
        game.kill2_play = true
    }else if(game.score>100000 && !game.kill3_play)
    {
        game.kill3.play()
        game.kill3_play = true
    }else if(game.score>200000 && !game.kill4_play){
        game.kill4.play()
        game.kill4_play = true
    }else if(game.score>500000 && !game.kill5_play){
        game.kill5.play()
        game.kill5_play = true
    }







    game.socreText.setText(game.score);



    game.add.tween(_o).to({
        alpha: 0
    }, 500, Phaser.Easing.Linear.None, true, 500).onComplete.add(function(){
        _o.destroy();


        _o.currentRnd = Math.random() * 100;



        if(_o.currentRnd <= _o.drop)
        {

            game.prop = game.add.sprite(_o.x,_o.y);
            game.physics.enable(game.prop, Phaser.Physics.ARCADE);
            game.prop.anchor.set(0.5);
            game.props.add(game.prop)


            var propRnd = Math.random() * 100;

            if(propRnd<=game.propDataJson[0].odd)
            {
                game.prop.loadTexture('skill_0')
                game.prop.id = 0
            }
            else if(propRnd>game.propDataJson[0].odd && propRnd <= game.propDataJson[1].odd)
            {
                game.prop.loadTexture('skill_1')
                game.prop.id = 1
            }
            else
            {
                game.prop.loadTexture('skill_2')
                game.prop.id = 2
            }


        }


        if(game.monsters.countLiving() <= 0)
        {

            if(game.levelState.sheaves >= game.levelDataJson[game.levelState.level-1].enemy.length)
            {


                if(game.levelState.level >= game.levelDataJson.length)
                {


                    game.levelState = {level : 1,sheaves : 1};

                    game.levelDataJson.forEach(function(i){
                        i.difficulty *= 1.5
                    })

                    utils.tip.show('你激怒了大陆领主，怪物能力骤然提升！')

                }
                else {

                    game.levelState.level++;
                    game.levelState.sheaves = 1;




                }

                game.canAttack = false;


            }
            else {
                game.levelState.sheaves++
            }


            game.levelDataJson[game.levelState.level-1].enemy[game.levelState.sheaves-1].forEach(function(i){
                game.monster = new Monster(game,i,game.levelState.level);
                game.add.existing(game.monster);
                game.monsters.add(game.monster);
            })
        }


    })



}








