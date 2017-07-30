

MyGame.MainMenu = function() {


};


MyGame.MainMenu.prototype = {

    init : function(){

    },

    preload: function() {


    },


    create: function() {

        game.add.image(0,0,'MainMenu_bg');


        game.ruleBtn = game.add.button(game.world.width-50,50,'rule_btn',function(){

            game.rule.visible = true;

        },this);

        game.ruleBtn.anchor.set(1,0)


        game.pep = game.add.sprite(game.world.centerX+30,game.world.height+10,'MainMenu_pep');
        game.pep.anchor.set(0.5,1);

        game.add.tween(game.pep).to({
            y:game.world.height
        }, 1500, Phaser.Easing.Linear.None, true, 0,-1,true);

        game.logo = game.add.sprite(game.world.centerX,30,'MainMenu_logo');
        game.logo.anchor.set(0.5,0);

        game.add.tween(game.logo.scale).from({
            x:7,y:7
        }, 800, Phaser.Easing.Cubic.In, true, 300).onComplete.add(function(){
            game.add.tween(game.logo.scale).to({
                x:-1
            }, 200, Phaser.Easing.Linear.None, true, 0,0,true)
        });

        game.add.tween(game.logo).from({
            alpha : 0
        }, 800, Phaser.Easing.Cubic.In, true, 300);


        utils.addBtn(game.startBtn,'MainMenu_startBtn',game.world.centerX,game.world.height-100,function(){


            game.state.start('Home')


        })


        game.rule = game.add.image(0,0,'rule');


        game.rule.visible = false;
        game.rule.inputEnabled = true;
        game.rule.input.priorityID = 1;
        game.rule.input.useHandCursor = true;
        game.rule.events.onInputDown.add(function(){
            game.rule.visible = false;
        }, this);



    },
    update: function() {


    }

};

