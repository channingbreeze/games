/**
 * Created with JetBrains WebStorm.
 * User: vivek.d
 * Date: 4/10/14
 * Time: 3:17 PM
 * To change this template use File | Settings | File Templates.
 */
Game.MainMenu = function(){

};
Game.MainMenu.prototype = {

    preload : function(){
        this.charEyes = new Array();
        this.eyesPos = [{
                          x : configObj.percentOfWidth (0.347),
                          y : configObj.percentOfHeight(0.365)
                        },
                        {
                            x : configObj.percentOfWidth (0.645),
                            y : configObj.percentOfHeight(0.53)
                        },
                        {
                            x : configObj.percentOfWidth (0.468),
                            y : configObj.percentOfHeight(0.685)
                        }]
    },

    create : function(){
        var languageJSON = configObj.game.cache.getJSON('language');
        configObj.languageData = languageJSON["english"];
        // configObj.boosterAPI.analytics.menu();
        this.eyeAnimIndex = 0;
        this.gameTimeCounter = 0;
        this.bg_sound = configObj.game.add.audio("splash_screen_bg");
        configObj.playAudio(this.bg_sound);
        this.languageSelection =  "english";
        configObj.initFullscreen();

        configObj.boosterAPI = new BoosterApi();
        configObj.boosterAPI.event('menu');
        configObj.boosterAPI.event('screen','menu');

          this.languageSelection =  "english";
        if(!configObj.isDevice){
            configObj.addPanel();
            configObj.game.add.sprite(220, 0, "background");
            configObj.addFullscreenButton(982,745,true);
        }
        else{
            configObj.game.add.sprite(0, 0, "background");
        }
        this.playBtn = configObj.game.add.button(configObj.percentOfWidth (0.2735), configObj.percentOfHeight(0.84), "spriteAtlas", this.startGame, this, 0, 0, 0);
        this.playBtn.frameName = "button_play.png";
        this.handImg = configObj.game.add.sprite(configObj.percentOfWidth (0.228), configObj.percentOfHeight(0.5063), "spriteAtlas", "hand_img.png");
        this.charImg = configObj.game.add.image(configObj.percentOfWidth (0), configObj.percentOfHeight(0), "char_img");
        this.handImg.anchor.setTo(0.8, 0.9);
        var tween1 = configObj.game.add.tween(this.handImg).to({angle : 11}, 550,  Phaser.Easing.Sinusoidal.In)
                                                           .to({angle : -5}, 380,  Phaser.Easing.Sinusoidal.In)
                                                           .loop()
                                                           .start();
        for(var i = 0; i < 3; i++){
            this.charEyes[i] = configObj.game.add.sprite(this.eyesPos[i].x, this.eyesPos[i].y, "char_eyes"+i);
            this.charEyes[i].loadTexture('char_eyes'+i, 0);
            this.charEyes[i].animations.add('blinkEyes');
        }
        configObj.game.time.events.loop(Phaser.Timer.SECOND, this.animateTimer, this);
        configObj.addFullscreenButton(982,745);
    },
    animateTimer : function(){
          var index = Math.floor(Math.random() * 3);
          if(this.gameTimeCounter % 2 == 0){
              this.charEyes[this.eyeAnimIndex].animations.stop(true, false);
          }
          if(index != this.eyeAnimIndex && this.gameTimeCounter % 2 == 0){

              this.charEyes[index].play('blinkEyes', 1.5, true);
              this.eyeAnimIndex = index;
          }
        this.gameTimeCounter++;
    },

    startGame : function(){
        configObj.pauseAudio(this.bg_sound);
        configObj.button_clickAudio = this.game.add.audio('button_click');
        configObj.playAudio(configObj.button_clickAudio, false);
        configObj.game.state.start('LevelSelection');
    },

    update : function(){
    }
};