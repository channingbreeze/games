MyGame.Result = function(game) {

};


MyGame.Result.prototype = {
    create: function() {


        game.add.image(0,0,'result_bg');

        game.resulScoreText = game.add.text(300, 230, "您获得了 "+game.score+" 分",{ font: "40px", fill: "#eab904",align: "center" });
        game.resulScoreText.anchor.set(0.5,0)


        utils.addBtn(game.replayBtn,'replay_btn',180,400,function(){
            game.state.start('Home')
        })

        utils.addBtn(game.myrankBtn,'myrank_btn',450,400,function(){
            alert('功能已屏蔽')
            // game.state.start('Rank')
        })

        utils.addBtn(game.xuanyaoBtn,'xuanyao_btn',300,560,function(){


            alert('功能已屏蔽')


           /* game.zhi.visible = true;


            window.shareData.type = 3;

            window.shareData.tfTitle = "缙者为王！看我分数秒杀全场";
            window.shareData.tTitle = window.shareData.tfTitle;
            window.shareData.share_url = ''+host+'/project/wx/2017/07/hygame/dist/share.html?toId='+user.openid+''
            share_data();*/
            //toId = ''+host+'/project/wx/2017/07/hygame/dist/share.html?toId='+user.openid+''


        })


        game.zhi = game.add.image(0,0,'zhi');

        game.zhi.visible = false;
        game.zhi.inputEnabled = true;
        game.zhi.input.priorityID = 1;
        game.zhi.input.useHandCursor = true;
        game.zhi.events.onInputDown.add(function(){
            game.zhi.visible = false;
        }, this);


    },
    update: function() {

    }

};

