MyGame.Home = function(game) {


};



friend = 0;

var self;



MyGame.Home.prototype = {



    create: function() {

        self = this;

        game.add.image(0,0,'Home_bg');

        /*game.myTx = game.add.image(100, 30,'my_headImg');
        game.myTx.width = 100;
        game.myTx.height = 100;
        game.myTx.anchor.set(0.5,0);
        game.myName = game.add.text(95, 135, user.nick_name,{ font: "24px", fill: '#b89039',align: "center" });
        game.myName.anchor.set(0.5,0)*/



        game.startBtnBg = game.add.image(200,40,'Home_startBtn_bg');
        game.HomePep = game.add.image(315,game.startBtnBg.height-7,'Home_pep');
        game.HomePep.anchor.set(0.5,1);
        game.startBtnBg.addChild(game.HomePep)



        game.add.tween(game.HomePep.scale).to({
            y:.98
        }, 1000, Phaser.Easing.Linear.None, true, 0,-1,true);




        for(var i=0;i<selectKard.length;i++)
        {
            game.kard = game.add.image(212+225*i,210,'k_'+selectKard[i]+'');
            game.kard.scale.x = game.kard.scale.y = 0.6;
        }


        utils.addBtn(game.rankBtn,'Home_startBtn',546,630,function(){

            game.state.start('Game')

        })


        utils.addBtn(game.rankBtn,'ranking_btn',game.world.width-170,game.world.height-172,function(){

            alert('单机版排行榜功能已经屏蔽')

            //game.state.start('Rank')
        })

        utils.addBtn(game.rankBtn,'buff_btn',game.world.width-170,242,function(){
            game.state.start('Kard')
        })


        game.helps = game.add.group();

        for(var i=0;i<3;i++)
        {
            game.helper = game.add.image(50,280+145*i,'add');
            game.helps.add(game.helper)
        }

        for(var i=0;i<3;i++)
        {
            game.kuang = game.add.image(50,280+145*i,'Home_kuang');
        }



        game.helps.setAll('inputEnabled', true);
        game.helps.callAll('events.onInputDown.add', 'events.onInputDown', function(){

            /*game.zhi.visible = true;

            window.shareData.type = 2;



            window.shareData.tfTitle = "快来帮我助战，一起缙级获得荣耀";
            window.shareData.tTitle = window.shareData.tfTitle;
            window.shareData.share_url = ''+host+'/project/wx/2017/07/hygame/dist/help.html?toId='+user.openid+''
            share_data();*/

            alert('单机版助战功能已经屏蔽')




            //toId = ''+host+'/project/wx/2017/07/hygame/dist/help.html?toId='+user.openid+''
        });



        /*game.time.events.loop(Phaser.Timer.SECOND * 0.1, function(){

            if($.fn.cookie(''+user.openid+'_helps'))
            {
                for(var i=0;i<JSON.parse($.fn.cookie(''+user.openid+'_helps')).length;i++)
                {
                    game.load.image('helper_'+i+'',JSON.parse($.fn.cookie(''+user.openid+'_helps'))[i].head_img)
                }

                game.load.start()
            }

        }, this);*/

/*
        game.load.onLoadComplete.add(function(){

            if($.fn.cookie(''+user.openid+'_helps'))
            {



                for(var i=0;i<JSON.parse($.fn.cookie(''+user.openid+'_helps')).length;i++)
                {
                    game.helps.children[i].loadTexture('helper_'+i+'')
                }

            }

            friend = JSON.parse($.fn.cookie(''+user.openid+'_helps')).length;


        }, this);

        var nowDate = new Date()


        game.timer = game.time.events.loop(Phaser.Timer.SECOND * 3, function(){

            utils.getData(api.url.help,{openid:user.openid},function(data){


                if(data.status)
                {
                    if(data.data.length >=3)
                    {
                        game.time.events.remove(game.timer);
                    }

                    $.fn.cookie(''+user.openid+'_helps',JSON.stringify(data.data),{ expires : new Date('2017/'+(nowDate.getMonth() + 1)+'/'+nowDate.getDate()+' 23:59:59') });

                }
                else
                {
                    alert(data.msg)
                }


            })

        }, this);*/



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

