MyGame.Rank = function(game) {

};


var self;


MyGame.Rank.prototype = {


    create: function() {

        self = this;




        game.add.image(0,0,'rank_bg');


        utils.addBtn(game.backBtn,'back_btn',70,37,function(){
            game.state.start('Home')
        })


        game.ranks = game.add.group();


        game.myTx = game.add.image(970, 40,'my_headImg');
        game.myTx.width = 200;
        game.myTx.height = 200;
        game.myTx.anchor.set(0.5,0);

        game.myName = game.add.text(960, 310, user.nick_name,{ font: "40px", fill: '#b89039',align: "center" });
        game.myName.anchor.set(0.5,0)

        game.myRank = game.add.text(820, 375, '',{ font: "26px", fill: '#ffffff',align: "left" });


        game.myscore = game.add.text(820, 430, '',{ font: "26px", fill: '#ffffff',align: "left" });


        game.jiangbei = game.add.image(970, 580,'jiangbei');
        game.jiangbei.anchor.set(0.5);
        game.jiangbei.inputEnabled = true;
        game.jiangbei.events.onInputDown.add(function(){
            game.quan.visible = true;
        }, this);

        game.add.tween(game.jiangbei.scale).to({
            x:.95,y:.95
        }, 1000, Phaser.Easing.Linear.None, true, 0,-1,true);



        utils.getData(api.url.rank,{openid:user.openid},function(data){

            if(data.status)
            {


                 game.myRank.setText('最高排行：'+data.rank);
                 game.myscore.setText('最高分数：'+data.topScore);


                self.createRank(data.data)


            }
            else
            {
                alert(data.msg)
            }

        })

        game.quan = game.add.image(game.world.centerX,game.world.centerY,'quan');
        game.quan.anchor.set(0.5);
        game.quan.visible = false;
        game.quan.inputEnabled = true;
        game.quan.events.onInputDown.add(function(){
            game.quan.visible = false;
        }, this);









    },
    update: function() {

    },

    createRank : function(rankjson){

        rankjson.forEach(function(i,idx){


            if(idx==0)
            {
                var rankWarpKey = 'rank_warp_1';
                var color = '#c7a45b'
            }
            else
            {
                var rankWarpKey = 'rank_warp_2';
                var color = '#bdbdbc'
            }


            game.rank = game.add.image(60,100+idx*125,rankWarpKey)
            game.rankName = game.add.text(160, 45, i.nick_name,{ font: "24px", fill: color,align: "left" });
            game.rankIco = game.add.image(75,58,'r_'+idx+'');
            game.rankIco.anchor.set(0.5);

            game.rankScore = game.add.text(600, 65, i.score,{ font: "34px", fill: color,align: "right" });
            game.rankScore.anchor.set(1,0.5)


            /*game.tx = game.add.image(145,23,'tx_'+idx+'');
            game.tx.width = 80;
            game.tx.height = 80;*/




            game.rank.addChild(game.rankName)
            game.rank.addChild(game.rankIco)
            game.rank.addChild(game.rankScore)
            /*game.rank.addChild(game.tx)*/
            game.ranks.add(game.rank)

        })

    }

};

