/**
 * Created with JetBrains WebStorm.
 * User: vivek.d
 * Date: 6/6/14
 * Time: 11:37 AM
 * To change this template use File | Settings | File Templates.
 */
Game.LevelUp = function(){

};
Game.LevelUp.prototype = {

    preload : function(){

    },

    create : function(){
        configObj.boosterAPI.event('screen','win');
        this.level_start = configObj.game.add.audio('level_start');
        this.backGroundImg1 = configObj.game.add.sprite(configObj.percentOfWidth(0), 0, "bg_Img");
        // configObj.boosterAPI.addSense();
        var levelData = configObj.getLevelInfo(configObj.levelNo - 1);
        this.checkForLifeUpdate();
        this.lifeCount  = configObj.getLifeCount();
        if(this.lifeCount < 10){
            this.loopEvent = configObj.game.time.events.loop(Phaser.Timer.SECOND, this.gameTimer, this);
        }
        var audioRef = configObj.levelClear ? "level_up" : "level_fail";
        this.bg_soundLevelUp = configObj.game.add.audio(""+audioRef);
        configObj.playAudio(this.bg_soundLevelUp, false);
        if(!configObj.isDevice){
            configObj.addPanel();
            configObj.addFullscreenButton(982,745);
        }
        if(configObj.levelClear){
            configObj.community.submitScore({score: levelData.score, callback: function () {
            }});
            var starCount = Math.floor(configObj.currentLevelScore / configObj.levelData[configObj.levelNo].targetScore);
            if(starCount > 3)
                starCount = 3;
            configObj.boosterAPI.event('stars', starCount);
            switch(starCount){
                case 1:
                    this.coins = 100;
                    break;
                case 2:
                    this.coins = 250;
                    break;
                case 3 :
                    this.coins = 500;
                    break;
            }
            configObj.localDataModelObj.setCoins(this.coins);
            // configObj.boosterAPI.analytics.level(1);
            localStorage.removeItem('currLevelStatus');         
            this.backGroundImg1 = configObj.game.add.sprite(configObj.percentOfWidth(0), 0, "win");
            configObj.game.add.sprite(configObj.percentOfWidth(0.3), 177, "spriteAtlas", "level_upGrapics.png");
            configObj.game.add.sprite(configObj.percentOfWidth(0), 685, "levelup_footer");
            var retryLevel = configObj.game.add.button(configObj.percentOfWidth(0.032) ,734, "spriteAtlas", this.restartLevel, this);
            retryLevel.frameName = "retry_level.png";
            var nextLevelBtn = configObj.game.add.button(configObj.percentOfWidth(0.223) ,735, "spriteAtlas", this.loadNextLevel, this);
            nextLevelBtn.frameName = "nxt_level.png";
            var levelSelection = configObj.game.add.button(configObj.percentOfWidth(0.4155) ,735, "spriteAtlas", this.loadLevelSelectionScreen, this);
            levelSelection.frameName = "level_selc_btn.png";

            configObj.game.add.sprite(configObj.percentOfWidth(0.41), 30, "spriteAtlas", "blank_star.png");
            this.starImg = configObj.game.add.sprite(configObj.percentOfWidth(0.522), 108, "spriteAtlas", "starLevelUp.png");
            this.starImg.anchor.setTo(0.5, 0.5);
            configObj.game.add.sprite(configObj.percentOfWidth(0.20), 270, "spriteAtlas", "level_score.png");
            this.score = configObj.game.add.text(configObj.percentOfWidth(0.51), 310 + configObj.textMarginForBrowser, configObj.languageData["levelUp"]["levelScore"] + ": " + configObj.currentLevelScore , {font : "50px londrina", fill : "#fffeff", align : "center"});
            this.score.anchor.setTo(0.5, 0.5);
            configObj.game.add.sprite(configObj.percentOfWidth(0.265), 357, "spriteAtlas", "highest_score.png");
            this.highScore = configObj.game.add.text(configObj.percentOfWidth(0.51), 375 + configObj.textMarginForBrowser, configObj.languageData["levelUp"]["highScore"] + ": " + levelData.score , {font : "30px londrina", fill : "#ACF1F3", align : "center"});
            this.highScore.anchor.setTo(0.5, 0.5);

            configObj.game.add.sprite(configObj.percentOfWidth(0.265), 412, "spriteAtlas", "coinCount.png");
            this.coins = configObj.game.add.text(configObj.percentOfWidth(0.51), 438 + configObj.textMarginForBrowser, configObj.languageData["levelUp"]["levelCoins"] + ": " + configObj.localDataModelObj.getCoins() , {font : "31px londrina", fill : "#fffeff", align : "center"});
            this.coins.anchor.setTo(0.5, 0.5);

            configObj.game.add.text(configObj.percentOfWidth(0.51), 70 + configObj.textMarginForBrowser, ""+levelData.stars, {font : "60px londrina", fill : "#a06626", align : "center"});
            this.charImg = configObj.game.add.sprite(configObj.percentOfWidth(0.53), 400, 'char_anim');
            this.charImg.loadTexture('char_anim', 0);
            this.charImg.animations.add('charDance');
            this.charImg.play('charDance', 30, true);
        }
        else{
            configObj.updateLife(-1);
            configObj.game.add.sprite(configObj.percentOfWidth(0.28), 130, "spriteAtlas", "try_againGraphics.png");
            configObj.game.add.sprite(configObj.percentOfWidth(0), 685, "try_again_footer");
            configObj.game.add.sprite(configObj.percentOfWidth(0.2), 255, "spriteAtlas", "level_score.png");
            this.score = configObj.game.add.text(configObj.percentOfWidth(0.5), 295 + configObj.textMarginForBrowser,configObj.languageData["levelUp"]["levelScore"] + ": " + configObj.currentLevelScore , {font : "50px londrina", fill : "#fffeff", align : "center"});
            this.score.anchor.setTo(0.5, 0.5);
            configObj.game.add.sprite(configObj.percentOfWidth(0.257), 345, "spriteAtlas", "highest_score.png");
            this.highScore = configObj.game.add.text(configObj.percentOfWidth(0.5), 365 + configObj.textMarginForBrowser, configObj.languageData["levelUp"]["highScore"] + ": " + levelData.score , {font : "30px londrina", fill : "#ACF1F3", align : "center"});
            this.highScore.anchor.setTo(0.5, 0.5);
            configObj.game.add.sprite(configObj.percentOfWidth(0.263), 400, "spriteAtlas", "coinCount.png");
            this.coins = configObj.game.add.text(configObj.percentOfWidth(0.51), 425 + configObj.textMarginForBrowser, configObj.languageData["levelUp"]["levelCoins"] + ": " + configObj.localDataModelObj.getCoins() , {font : "31px londrina", fill : "#fffeff", align : "center"});
            this.coins.anchor.setTo(0.5, 0.5);
            this.charImg = configObj.game.add.sprite(configObj.percentOfWidth(0.58), 503, 'retry_ch');
            this.charImg.loadTexture('retry_ch', 0);
            this.charImg.animations.add('charCry');
            this.charImg.play('charCry', 16, true);
            var retryLevel = configObj.game.add.button(configObj.percentOfWidth(0.12) ,734, "spriteAtlas", this.restartLevel, this);
            retryLevel.frameName = "retry_level.png";
            var levelSelection = configObj.game.add.button(configObj.percentOfWidth(0.31) ,735, "spriteAtlas", this.loadLevelSelectionScreen, this);
            levelSelection.frameName = "level_selc_btn.png"
        }
        configObj.game.add.sprite(configObj.percentOfWidth(0.85), 8, "spriteAtlas", "life.png");
        this.lifeText = configObj.game.add.text(configObj.percentOfWidth(0.905), 36 + configObj.textMarginForBrowser, ""+configObj.getLifeCount(), {font : "30px londrina", fill : "#580101", align : "center"});
        this.lifeText.anchor.setTo(0.5, 0.5);
        //configObj.game.add.sprite(configObj.percentOfWidth(0.03), 470, "ad_container");
        this.displayAdd();
    },

    displayAdd : function(){
        configObj.boosterAPI.addSense();
//        googletag.cmd.push(function() { googletag.display('div-gpt-ad-1409063445073-0'); });
//        document.getElementById("div-gpt-ad-1409063445073-0").style.display = "block";
    },
    checkForLifeUpdate : function(){
        var totalElapsedTime = configObj.attempTimerObj.updateTime();

        if(totalElapsedTime != null){
            var totalLifeToUpdate = Math.floor(totalElapsedTime.m / configObj.attempTimeCounter);
            configObj.localDataModelObj.incrementLife(totalLifeToUpdate);
        }
    },
    gameTimer : function(){
        this.lifeCount  = configObj.getLifeCount();
        if(this.lifeCount < 10){
            this.totalElapsedTime = configObj.attempTimerObj.updateTime();
            if(this.totalElapsedTime.m > 0 && this.totalElapsedTime.m % configObj.attempTimeCounter == 0){
                configObj.attempTimeCounter += configObj.attempTimeCounter;
                configObj.localDataModelObj.incrementLife(1);
                this.lifeText.text = ""+configObj.getLifeCount();
            }
        }
        else{
            configObj.attempTimeCounter = 2;
            configObj.game.time.events.remove(this.loopEvent);
        }
    },

    restartLevel : function(){
        configObj.boosterAPI.event('restartLevel');
        //document.getElementById("div-gpt-ad-1409063445073-0").style.display = "none";
        if(this.bg_soundLevelUp)
            this.bg_soundLevelUp.stop();
        this.bg_soundLevelUp = null;
        configObj.playAudio(configObj.button_clickAudio, false);
        configObj.playAudio(this.level_start, false);
        if(configObj.getLifeCount() > 0){
            configObj.game.tweens.removeAll();
            configObj.game.state.start('MagicMonsters');
        }
        else{
            var popUpContainer = configObj.game.add.group();
            var bg = configObj.game.add.sprite(configObj.percentOfWidth(0.07), 200, "buy_popup");
            popUpContainer.add(bg);
            var buyBtn = configObj.game.add.button(configObj.percentOfWidth(0.318), 520, "spriteAtlas1", this.buyAttempts, this);
            buyBtn.frameName = "buy_attempts_btn.png";
            popUpContainer.add(buyBtn);
            popUpContainer.add(configObj.game.add.text(configObj.percentOfWidth(0.255), 280, configObj.languageData["warning"]["noAttempts"]["heading"],{font :"45px londrina", fill : "red", align : "center"}));
            popUpContainer.add(configObj.game.add.text(configObj.percentOfWidth(0.19), 450, configObj.languageData["warning"]["noAttempts"]["suggestionMsg"], {font :"30px londrina", fill : "#a06626", align : "center"}));
            popUpContainer.scale.x = 0.5;
            popUpContainer.scale.y = 0.5;
            this.close_click = configObj.game.add.button(configObj.percentOfWidth(0.85), 170, "spriteAtlas", this.closePopUp.bind(this, popUpContainer), this);
            this.close_click.frameName = "close_btn.png";
            popUpContainer.add(this.close_click);
            popUpContainer.pivot.x = -configObj.percentOfWidth(0.36);
            popUpContainer.pivot.y = -420;
            configObj.game.add.tween(popUpContainer.scale).to({ x: 1, y: 1}, 450, Phaser.Easing.Back.Out, true);
            configObj.game.add.tween(popUpContainer.position).to({ x: -configObj.percentOfWidth(0.36), y: -420}, 450, Phaser.Easing.Back.Out, true);
        }
    },
    closePopUp : function(popUpContainer){
        var anim = configObj.game.add.tween(popUpContainer.scale).to({ x: 0.5, y: 0.5}, 450, Phaser.Easing.Back.In, true);
        var anim1 = configObj.game.add.tween(popUpContainer.position).to({ x: 0, y: 0}, 450, Phaser.Easing.Back.In, true);
        var self = this;
        anim.onComplete.add(function(){
                self.popUp = false;
                popUpContainer.destroy();
        });
    },
    buyAttempts : function(){
        configObj.game.tweens.removeAll();
        configObj.game.state.start('LevelSelection');
    },

    loadNextLevel: function(){
        //document.getElementById("div-gpt-ad-1409063445073-0").style.display = "none";
        this.bg_soundLevelUp.stop();
        this.bg_soundLevelUp = null;
        configObj.playAudio(configObj.button_clickAudio, false);
        configObj.playAudio(this.level_start, false);
        if(configObj.levelClear)
            configObj.levelNo += 1;
        if(configObj.levelNo <= 50)
            configObj.game.state.start('MagicMonsters');
    },

    // shareonFB : function(){
    //     configObj.playAudio(configObj.button_clickAudio);
    //     console.log("fb");
    // },

    // shareonTWT : function(){
    //     configObj.playAudio(configObj.button_clickAudio);
    //     console.log("twt");
    // },

    loadLevelSelectionScreen: function(){
        //document.getElementById("div-gpt-ad-1409063445073-0").style.display = "none";
        configObj.playAudio(configObj.button_clickAudio, false);
        configObj.game.tweens.removeAll();
        configObj.game.state.start('LevelSelection');
    },

    update : function(){

    }
};