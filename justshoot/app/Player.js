/**
 * Created by 365 on 2017-07-11.
 */


Player = function(_game){



    Phaser.Sprite.call(this, _game, game.world.centerX, game.world.centerY, 'player');
    this.anchor.set(0.5);
    game.physics.enable(this, Phaser.Physics.ARCADE);

    this.body.setSize(this.width/2, this.height/2, this.width/4, this.height/4);

    this.scale.x = this.scale.y = 0.5

    this.body.immovable = true;
    this.body.collideWorldBounds = true;



    game.camera.follow(this);



    this.isDead = false;
    this.getprop = false;

    this.body.velocity.x = this.body.velocity.y = 0;



}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.dead = function(playerLife){

    var _o = this;

    this.isDead = true;

    this.body.enable = false;

    this.body.velocity.x = this.body.velocity.y = 0;


    this.deadAni = game.add.tween(this).to({
        alpha:0.3
    }, 800, Phaser.Easing.Linear.None, true, 0,-1,true)


    game.monsters.forEach(function(i){
        i.body.velocity.x = i.body.velocity.y = 0;
    });


    if(playerLife <= 0)
    {




        game.playerDataJson.life = 1;



        utils.tip.show('你死了！没有复活次数了！')


        game.time.events.add(Phaser.Timer.SECOND * 3, function(){
            game.world.setBounds(0, 0, 1206, 750);

            game.state.start('Result')




        }, this);





    }
    else {


        utils.tip.show('你死了！还有：'+playerLife+' 次复活,5秒钟后复活！')


        game.time.events.add(Phaser.Timer.SECOND * 5, function(){
            _o.revive()
        }, this);



    }


}

Player.prototype.update = function(){


}

Player.prototype.revive = function(){

    utils.tip.show('您复活了！加油吧，争取得到更高分数~')


    this.isDead = false;
    this.body.enable = true;

    this.alpha = 1;

    this.deadAni.pause();


    game.monsters.forEach(function(i){

        var rnd = game.rnd.between(0, 3);

        i.reset(i.way[rnd].x,i.way[rnd].y)
    })


}

Player.prototype.say = function(sayText){

    sayText = sayText || '默认文字'

    this.say = game.add.text(0, -this.x, sayText, { font: "60px Arial", fill: "#ff0044" });
    this.say.anchor.set(0.5,1)
    this.addChild(this.say)

}

Player.prototype.pickupProp = function(player,prop){

    prop.destroy();

    this.getprop = true;

    if(this.getprop)
    {
        this.useProp(prop.id)
    }


}

Player.prototype.useProp = function(propId){

    utils.tip.show('燕澜七缙为您 '+game.propDataJson[propId].text)

    switch(propId)
    {
        case 0: //多重箭

            if(game.playerDataJson.weapon_type + game.propDataJson[propId].eff >=5)
            {
                game.playerDataJson.weapon_type = 5;
                utils.tip.show('超过箭数量最大值，不能获得加成！')
            }
            else{
                game.playerDataJson.weapon_type += game.propDataJson[propId].eff;
            }


        break;
        case 1: //增加攻击速度

            if(game.playerDataJson.attack_speed + game.propDataJson[propId].eff >900)
            {
                game.playerDataJson.attack_speed = 900;

            }
            else {
                game.playerDataJson.attack_speed += game.propDataJson[propId].eff;
            }


        break;
        case 2: //增加移动速度

            if(game.playerDataJson.move_speed + game.propDataJson[propId].eff >500)
            {
                game.playerDataJson.move_speed = 500;

                utils.tip.show('超过移动速度最大值，不能获得加成！')

            }
            else {
                game.playerDataJson.move_speed += game.propDataJson[propId].eff;
            }


            break;
    }



    this.getprop = false;
}











