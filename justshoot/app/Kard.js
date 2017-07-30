


MyGame.Kard = function(game) {
};




MyGame.Kard.prototype = {
    create: function() {

        game.buffDataJson = game.cache.getJSON('buff_data');

        game.add.image(0,0,'Kard_bg');


        utils.kards.init(this.fangda);

        utils.kards.showSelect(selectKard);



        game.selectOK = game.add.button(game.world.width - 110,game.world.height - 20,'select_ok',function(){
            game.state.start('Home')
        },this);
        game.selectOK.anchor.set(1,1);


        utils.bigKard.init();



    },
    update: function() {



    },
    fangda : function(item){


        utils.bigKard.show(item.id,game.buffDataJson[item.id].text)

    }

};

