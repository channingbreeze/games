/**
 * Created with JetBrains WebStorm.
 * User: vivek.d
 * Date: 4/23/14
 * Time: 10:54 AM
 * To change this template use File | Settings | File Templates.
 */
Game.LevelSelection = function(){
};
Game.LevelSelection.prototype = {

    preload : function(){
        this.timerPopUp = false;
        this.popUp = false;
        this.infoPopUp = false;
        this.unlockMonsterText = ["Play 5 levels to unlock",
                                  "Play 10 levels to unlock",
                                  "Play 15 levels to unlock",
                                  "Play 25 levels to unlock",
                                  "Play 35 levels to unlock",
                                  "Play 45 levels to unlock"
                                 ];
        this.badgesRewards = [[{"count" : 2, "powerUp" : "powerUpRing"}],
                              [{"count" : 1, "powerUp" : "universal"}],
                              [{"count" : 2, "powerUp" : "addMoreMoves"},{"count" : 2, "powerUp" : "powerUpRing"}],
                              [{"count" : 1, "powerUp" : "universal"}, {"count" : 1, "powerUp" : "addMoreMoves"},{"count" : 1, "powerUp" : "powerUpRing"}],
                              [{"count" : 1, "powerUp" : "universal"}, {"count" : 1, "powerUp" : "powerUpRing"}],
                              [{"count" : 2, "powerUp" : "universal"}, {"count" : 1, "powerUp" : "addMoreMoves"}, {"count" : 1, "powerUp" : "powerUpRing"}]];

        this.monsterRewards = [[{"count" : 2, "powerUp" : "addMoreMoves"}, {"count" : 2, "powerUp" : "powerUpRing"}],
                               [{"count" : 1, "powerUp" : "universal"}, {"count" : 3, "powerUp" : "powerUpRing"} ],
                               [{"count" : 1, "powerUp" : "universal"},{"count" : 2, "powerUp" : "addMoreMoves"}, {"count" : 4, "powerUp" : "powerUpRing"}],
                               [{"count" : 2, "powerUp" : "universal"}, {"count" : 1, "powerUp" : "addMoreMoves"},{"count" : 5, "powerUp" : "powerUpRing"}],
                               [{"count" : 3, "powerUp" : "universal"}, {"count" : 4, "powerUp" : "addMoreMoves"}, {"count" : 4, "powerUp" : "powerUpRing"}],
                               [{"count" : 6, "powerUp" : "universal"}, {"count" : 4, "powerUp" : "addMoreMoves"}, {"count" : 6, "powerUp" : "powerUpRing"}]];
        this.unlocableSoundId = [0, 2, 4, 3, 5, 1];

    },
    create : function(){
        configObj.boosterAPI.event('screen','level_select');
        var lastLevelInfo =   JSON.parse(localStorage.getItem('currLevelStatus'));
        if(lastLevelInfo != null && lastLevelInfo["levelCleared"] == false){
            configObj.updateLife(-1);
        }
        this.punch = configObj.game.add.audio("punch");
        if(!configObj.isDevice){
            configObj.game.add.sprite(0 ,0, "leftBar");
            configObj.game.add.sprite(860 ,0, "rightBarLevelUp");
            configObj.addFullscreenButton(982,745);
            /*configObj.fullScreenBtn = configObj.closefullScreenBtn = null;
            configObj.fullScreenBtn = configObj.game.add.button(982 ,745, "fullscreen_icon", configObj.goFullscreen, this);
            configObj.closefullScreenBtn = configObj.game.add.button(982 ,745, "spriteAtlas1", configObj.goFullscreen, this);
            configObj.closefullScreenBtn.frameName = "closefullscreen_icon.png";
            configObj.closefullScreenBtn.visible = false;*/
        }
        this.bg = configObj.game.add.sprite(configObj.percentOfWidth(0.065),15, "level_select_bg1");
        this.checkForLifeUpdate();
        this.lifeCount  = configObj.getLifeCount();
        if(this.lifeCount < 1){
            this.loopEvent = configObj.game.time.events.loop(Phaser.Timer.SECOND, this.gameTimer, this);
        }        

        this.badgesArr = new Array();
        this.unlockMonsterArr = new Array();

        this.lockArr = new Array();
        this.container = configObj.game.add.group();
        var startXpos = xPos = configObj.percentOfWidth (0.263);
        var startYpos = configObj.percentOfHeight (0.23);
        var levelBtn, levelText = 1, diff = 165, starDiff = 35, Leveltext;
        var temp = 0, blankStar, starCount, star, levelData;
        var style = { font: "35px londrina", fill: "#004300", align: "center" };
        for(var i = 1; i < 51; i ++){
            levelData = configObj.getLevelInfo(i - 1);
            if(temp == 3 ){
                temp = 0;
                startYpos += diff;
                startXpos = xPos;
                starYPos = startYpos;
            }
            if(i == 1){
                levelBtn = configObj.game.add.button(startXpos, startYpos, "spriteAtlas", this.OnLevelButtonClick.bind(this, i,levelData.stars ), this);
                levelBtn.frameName = "unlocked_a.png";
                Leveltext = configObj.game.add.text(levelBtn.x , levelBtn.y + configObj.textMarginForBrowser, ""+levelText, style);
                Leveltext.anchor.setTo(0.5, 0.5);
            }
            else if(configObj.oldLevelData[i - 2] != undefined && configObj.oldLevelData[i - 2].levelCleared)
            {
                levelBtn = configObj.game.add.button(startXpos, startYpos, "spriteAtlas", this.OnLevelButtonClick.bind(this, i), this);
                levelBtn.frameName = "unlocked_a.png";
                if(i == configObj.oldLevelData.length + 1){
                    configObj.game.add.tween(levelBtn).to({alpha : 0.5}, 600, null, true, 0 , 200, true);
                }
                Leveltext = configObj.game.add.text(levelBtn.x, levelBtn.y + configObj.textMarginForBrowser, ""+levelText, style);
                Leveltext.anchor.setTo(0.5, 0.5);
            }
            else{
                levelBtn = configObj.game.add.button(startXpos, startYpos, "spriteAtlas", null, this);
                levelBtn.frameName = "locked_b.png";
                Leveltext = configObj.game.add.text(levelBtn.x , levelBtn.y + configObj.textMarginForBrowser, ""+levelText, { font: "35px londrina", fill: "#52432B", align: "center" });
                Leveltext.anchor.setTo(0.5, 0.5);
            }
            levelBtn.anchor.setTo(0.5, 0.5);
            starXpos = startXpos  - 50;
            starYPos = startYpos - 35;
            if(levelData != null)
                starCount = levelData.stars;                
            for(var j = 0; j < 3; j++){
                blankStar = configObj.game.add.sprite(starXpos, starYPos + 80, "spriteAtlas", "star_blank.png");
                this.container.add(blankStar);
                if(starCount > 0){
                    star = configObj.game.add.sprite(starXpos, starYPos + 80, "spriteAtlas", "star.png");
                    this.container.add(star);
                    starCount--;  
                }
                starXpos += starDiff;
            }
            this.container.add(levelBtn);
            this.container.add(Leveltext);
            temp++;
            levelText++;
            startXpos += diff;
        }
        CWScroller.to(this.container, 640, 832, 640, 3100, {bouncing: false, scrollingX: false});
        configObj.game.add.sprite(configObj.percentOfWidth(0),0, "overlay");

        this.handAnim = configObj.game.add.sprite(configObj.percentOfWidth(0.55) , 680, 'hand_anim');
        this.handAnim.anchor.setTo(0.5, 0.5);
        this.handAnim.loadTexture('hand_anim');
        this.handAnim.animations.add('hand_anim');
        this.handAnim.play('hand_anim', 13, false);

        var handAnim = configObj.game.add.tween(this.handAnim).to({y : 600}, 650, Phaser.Easing.Sinusoidal.In, false, 450);
        handAnim.start();
        var self = this;
        handAnim.onComplete.add(function(){
            var reverseAnim = configObj.game.add.tween(self.handAnim ).to({y : 680}, 700, Phaser.Easing.Sinusoidal.In, true, 300);
            self.handAnim.frame = 1;
            reverseAnim.onComplete.add(function(){
                self.handAnim.play('hand_anim', 13, false);
                configObj.game.tweens.remove(reverseAnim);
                handAnim.start();
            });
        });

        this.timerText = configObj.game.add.text(configObj.percentOfWidth(0.88), 60 + configObj.textMarginForBrowser, "", { font: "30px londrina", fill: "#580101", align: "center" });
        this.ach_butn = configObj.game.add.button(configObj.percentOfWidth(0.05),710, "spriteAtlas", this.OnAchievementClick, this);
        this.ach_butn.frameName = "achievement_sc.png";
        this.shop_butn = configObj.game.add.button(configObj.percentOfWidth(0.3),710, "spriteAtlas", this.OnShopClick, this);
        this.shop_butn.frameName = "shop_sc.png";
        this.unlock_butn = configObj.game.add.button(configObj.percentOfWidth(0.55),710, "spriteAtlas", this.OnUnlockClick, this);
        this.unlock_butn.frameName = "unlock_sc.png"
        this.moreGames_butn = configObj.game.add.button(configObj.percentOfWidth(0.8),710, "spriteAtlas", this.redirectToMoreGames, this);
        this.moreGames_butn.frameName = "moregames sc.png";
        this.backLayer = configObj.game.add.group();
        configObj.game.add.sprite(configObj.percentOfWidth(0.01), 2, "spriteAtlas", "Coin1.png");
        this.coinsText = configObj.game.add.text(configObj.percentOfWidth(0.22), 37 + configObj.textMarginForBrowser, ""+configObj.localDataModelObj.getCoins(), {font : "30px londrina", fill : "#FFEBCE", align : "center"});
        this.coinsText.anchor.setTo(0.5, 0.5);
        configObj.game.add.sprite(configObj.percentOfWidth(0.5), 2, "spriteAtlas", "Life1.png");
        this.lifeText = configObj.game.add.text(configObj.percentOfWidth(0.945), 32.5 + configObj.textMarginForBrowser, ""+this.lifeCount, {font : "30px londrina", fill : "#580101", align : "center"});
        this.lifeText.anchor.setTo(0.5, 0.5);
        this.tint_Bg = configObj.game.add.sprite(configObj.percentOfWidth(0),0, "tint_background");
        this.tint_Bg.visible = false;
    },
    checkForLifeUpdate : function(){
        var totalElapsedTime = configObj.attempTimerObj.updateTime();
        if(totalElapsedTime != null){
            var totalLifeToUpdate = Math.floor(totalElapsedTime.m / configObj.attempTimeCounter);
            configObj.localDataModelObj.incrementLife(totalLifeToUpdate);
        }
    },
    redirectToMoreGames : function(){
        if(!this.popUp && !this.timerPopUp){
            if(configObj && configObj.boosterAPI && configObj.boosterAPI.analytics && configObj.boosterAPI.analytics.customEvent)
            {
                 configObj.boosterAPI.analytics.customEvent('moreGames_WinLosePp', 1);
            }

            if(window.location.search.indexOf('bm.source') > -1)
            {
                configObj.boosterAPI.moreGames();
            }else{
                window.top.location = "http://www.coolgames.com";
            }
        }

    },

    OnAchievementClick : function()
    {
        if(!this.popUp && !this.timerPopUp){
            this.popUp = true;
            this.buttonState(false);
            configObj.playAudio(configObj.button_clickAudio);
            var startXpos = configObj.percentOfWidth(0.23), startYPos = 210;
            this.tint_Bg.visible = true;
            var popUpContainer = configObj.game.add.group();
            var game_setting_back = popUpContainer.create(configObj.percentOfWidth(0.12),70, "game_setting");
            game_setting_back.scale.y = 1.08;
            popUpContainer.add(game_setting_back);
            var  achievement_txt = configObj.game.add.text(configObj.percentOfWidth(0.28), 130, ""+configObj.languageData["unlockedBadgeData"].heading, {font : "50px londrina", fill : "#a06626", align : "center"});
            popUpContainer.add(achievement_txt);
            var temp = 0;
            for(var i = 0; i < 6; i++){
                if(temp == 2){
                    temp = 0;
                    startXpos = configObj.percentOfWidth(0.23);
                    startYPos += 180;
                }
                this.badgesArr.push(configObj.game.add.button(startXpos,startYPos, "spriteAtlas", this.achievementClick.bind(this,configObj.languageData["unlockedBadgeData"].subHeading, "badge_"+(i + 1), popUpContainer, configObj.languageData["unlockedBadgeData"].unlockBadgeText, i, this.badgesRewards[i]), this));
                this.badgesArr[this.badgesArr.length - 1].frameName = "badge_"+(i + 1)+".png";
                popUpContainer.add(this.badgesArr[i]);
                if(configObj.unlockedBadgeArr.indexOf("badge"+(i + 1)) == -1){
                    this.lockArr.push(configObj.game.add.sprite(startXpos + 80, startYPos + 75, "spriteAtlas", "lock.png"));
                    popUpContainer.add(this.lockArr[this.lockArr.length - 1]);
                }
                startXpos += 230;
                temp++;
            }
            this.close_click = null;
            this.close_click = configObj.game.add.button(configObj.percentOfWidth(0.78), 55, "spriteAtlas", this.closePopUp.bind(this, popUpContainer), this);
            this.close_click.frameName = "close_btn.png";
            popUpContainer.add(this.close_click);
            popUpContainer.scale.x = 0.5;
            popUpContainer.scale.y = 0.5;
            this.animatePopUp(popUpContainer);
        }

    },

    achievementClick : function(heading, img, container, textContainer, number, rewards){
        if(!this.infoPopUp && !this.timerPopUp){
            this.tint_Bg1 = configObj.game.add.sprite(configObj.percentOfWidth(0),0, "tint_background");
            this.close_click.inputEnabled = false;
            this.infoPopUp = true;
            this.tint_Bg.visible = true;
            var popUpContainer = configObj.game.add.group();
            var game_setting_back = popUpContainer.create(configObj.percentOfWidth(0.15), 155, "game_setting");
            game_setting_back.scale.x = 0.92;
            game_setting_back.scale.y = 0.9;
            popUpContainer.add(game_setting_back);
            var  heading = configObj.game.add.text(configObj.percentOfWidth(0.34), 220, ""+heading, {font : "40px londrina", fill : "#a06626", align : "center"});
            popUpContainer.add(heading);
            var badge = configObj.game.add.sprite(configObj.percentOfWidth(0.42), 280, "spriteAtlas");
            badge.frameName = img+".png";
            popUpContainer.add(badge);
            var  achievement_txt = configObj.game.add.text(configObj.percentOfWidth(0.5), 450, ""+textContainer[number], {font : "28px londrina", fill : "#a06626", align : "center"});
            achievement_txt.anchor.setTo(0.5, 0.5);
            popUpContainer.add(achievement_txt);
            this.rewards_txt = configObj.game.add.text(configObj.percentOfWidth(0.25), 520, configObj.languageData["unlockedBadgeData"].rewards + ": ", {font : "30px londrina", fill : "#a06626", align : "center"});
            popUpContainer.add(this.rewards_txt);
            startX = configObj.percentOfWidth(0.45);
            startY = 520;
            for(var i = 0; i < rewards.length; i++){
                var rtext = configObj.game.add.text(startX, startY, ""+rewards[i].count, {font : "30px londrina", fill : "#a06626", align : "center"});

                popUpContainer.add(rtext);
                var rImg = configObj.game.add.sprite(startX + 70, startY + 20, "spriteAtlas", ""+rewards[i].powerUp+".png");
                rImg.anchor.setTo(0.5, 0.5);
                popUpContainer.add(rImg);
                startY += 65;
            }
            this.close_click1 = null;
            this.close_click1 = configObj.game.add.button(configObj.percentOfWidth(0.74), 130, "spriteAtlas", this.closeInfoPopUp.bind(this, popUpContainer), this);
            this.close_click1.frameName = "close_btn.png";
            popUpContainer.add(this.close_click1);
            popUpContainer.scale.x = 0.5;
            popUpContainer.scale.y = 0.5;
            this.animatePopUp(popUpContainer);
        }
    },
    unlockableClick : function(heading, img, container, textContainer, number, rewards){

        if(!this.infoPopUp){
            this.tint_Bg1 = configObj.game.add.sprite(configObj.percentOfWidth(0),0, "tint_background");
            this.close_click.inputEnabled = false;
            this.infoPopUp = true;
            this.tint_Bg.visible = true;
            var popUpContainer = configObj.game.add.group();
            var game_setting_back = popUpContainer.create(configObj.percentOfWidth(0.15), 155, "game_setting");
            game_setting_back.scale.x = 0.92;
            game_setting_back.scale.y = 0.9;
            popUpContainer.add(game_setting_back);
            var heading = configObj.game.add.text(configObj.percentOfWidth(0.52), 240, ""+heading, {font : "40px londrina", fill : "#a06626", align : "center"});
            heading.anchor.setTo(0.5, 0.5);
            popUpContainer.add(heading);
            var badge = configObj.game.add.sprite(configObj.percentOfWidth(0.49), 360, "spriteAtlas1");
            badge.frameName = img+".png";
            badge.anchor.setTo(0.5, 0.5);
            popUpContainer.add(badge);
            var achievement_txt = configObj.game.add.text(configObj.percentOfWidth(0.28), 463, ""+textContainer[number], {font : "30px londrina", fill : "#a06626", align : "center"});
            popUpContainer.add(achievement_txt);
            var  rewards_txt = configObj.game.add.text(configObj.percentOfWidth(0.29), 520, configObj.languageData["unlockedPetData"].rewards +" : ", {font : "30px londrina", fill : "#a06626", align : "center"});
            popUpContainer.add(rewards_txt);

            startX = configObj.percentOfWidth(0.5);
            startY = 520;
            for(var i = 0; i < rewards.length; i++){
                var rtext = configObj.game.add.text(startX, startY, ""+rewards[i].count, {font : "30px londrina", fill : "#a06626", align : "center"});
                popUpContainer.add(rtext);
                var rImg = configObj.game.add.sprite(startX + 70, startY + 20, "spriteAtlas", ""+rewards[i].powerUp+".png");
                rImg.anchor.setTo(0.5, 0.5);
                popUpContainer.add(rImg);
                startY += 65;
            }
            this.close_click1 = null;
            this.close_click1 = configObj.game.add.button(configObj.percentOfWidth(0.73), 130, "spriteAtlas", this.closeInfoPopUp.bind(this, popUpContainer), this);
            this.close_click1.frameName = "close_btn.png";
            popUpContainer.add(this.close_click1);
            popUpContainer.scale.x = 0.5;
            popUpContainer.scale.y = 0.5;
            this.monster_audio = null;
            this.monster_audio = configObj.game.add.audio("monster"+this.unlocableSoundId[number]);
            configObj.playAudio(this.monster_audio, false);
            this.animatePopUp(popUpContainer);
        }
    },

    animatePopUp : function(container){
        this.buttonState(false);
        container.pivot.x = -configObj.percentOfWidth(0.36);
        container.pivot.y = -420;
        var tween1 = configObj.game.add.tween(container.scale).to({ x: 1, y: 1}, 450, Phaser.Easing.Back.Out, true);
        var tween2 = configObj.game.add.tween(container.position).to({ x: -configObj.percentOfWidth(0.36), y: -420}, 450, Phaser.Easing.Back.Out, true);
        tween2.onComplete.add(function(){
            configObj.game.tweens.remove(container);
            configObj.game.tweens.remove(container);
        });
        CWScroller.Enable(false);
    },
    closeInfoPopUp : function(container)
    {
        this.close_click.inputEnabled = true;
        this.close_click1.inputEnabled = false;
        configObj.playAudio(configObj.button_clickAudio);
        var anim = configObj.game.add.tween(container.scale).to({ x: 0.5, y: 0.5}, 450, Phaser.Easing.Back.In, true);
        var anim1 = configObj.game.add.tween(container.position).to({ x: 0, y: 0}, 450, Phaser.Easing.Back.In, true);
        var self = this;
        anim.onComplete.add(function(){
            configObj.game.tweens.remove(anim);
            configObj.game.tweens.remove(anim1);
            container.destroy(true);
            if(self.tint_Bg1)
                self.tint_Bg1.destroy();
            self.tint_Bg1 = null;
            self.infoPopUp = false;
            self.badgesArr.splice(0, self.badgesArr.length);
            self.lockArr.splice(0, self.lockArr.length);
        });
    },

    closeTimerPopUp : function(container){
        this.close_clickAlert.inputEnabled = false;
        configObj.playAudio(configObj.button_clickAudio);
        var anim = configObj.game.add.tween(container.scale).to({ x: 0.5, y: 0.5}, 450, Phaser.Easing.Back.In, true);
        var anim1 = configObj.game.add.tween(container.position).to({ x: 0, y: 0}, 450, Phaser.Easing.Back.In, true);
        var self = this;
        anim.onComplete.add(function(){
            self.tint_BgTimer.destroy();
            configObj.game.tweens.remove(anim);
            configObj.game.tweens.remove(anim1);
            container.destroy(true);
            self.buttonState(true);
            self.tint_Bg.visible = false;
            self.timerPopUp = false;
        });
        CWScroller.Enable(true);
    },
    closePopUp : function(container)
    {
        if(this.close_click)
            this.close_click.inputEnabled = false;
        if(this.timerPopUp){
            this.close_clickAlert.inputEnabled = true;
        }
        configObj.playAudio(configObj.button_clickAudio);
        var anim = configObj.game.add.tween(container.scale).to({ x: 0.5, y: 0.5}, 450, Phaser.Easing.Back.In, true);
        var anim1 = configObj.game.add.tween(container.position).to({ x: 0, y: 0}, 450, Phaser.Easing.Back.In, true);
        var self = this;
        anim.onComplete.add(function(){
            configObj.game.tweens.remove(anim);
            configObj.game.tweens.remove(anim1);
            container.destroy(true);
            self.buttonState(true);
            if(self.tint_Bg2)
               self.tint_Bg2.visible = false; 
            self.tint_Bg.visible = false;
            self.badgesArr.splice(0, self.badgesArr.length);
            self.lockArr.splice(0, self.lockArr.length);
            self.unlockMonsterArr.splice(0, self.unlockMonsterArr.length);
            self.popUp = false;
        });
        CWScroller.Enable(true);
    },
    OnShopClick : function()
    {
        if(!this.popUp){
            if(this.close_clickAlert)
                this.close_clickAlert.inputEnabled = false;
            configObj.playAudio(configObj.button_clickAudio);
            this.popUp = true;
            this.buttonState(false);
            this.tint_Bg2 = configObj.game.add.sprite(configObj.percentOfWidth(0),0, "tint_background");
            this.backLayer.add(this.tint_Bg2);

            var popUpContainer = configObj.game.add.group();
            var unlock_screen = configObj.game.add.sprite(configObj.percentOfWidth(0.075), 70, "game_setting");
            unlock_screen.scale.x = 1.155;
            unlock_screen.scale.y = 1.12;
            popUpContainer.add(unlock_screen);
            var lifeBtnBg = configObj.game.add.sprite(configObj.percentOfWidth(0.147), 135, "spriteAtlas1", "attempts_bg.png");
            popUpContainer.add(lifeBtnBg);
            var lifeBtn = configObj.game.add.button(configObj.percentOfWidth(0.162), 260, "spriteAtlas1", this.shopSelected.bind(this, "addLife"), this);
            lifeBtn.frameName = "btn_5000.png";
            popUpContainer.add(lifeBtn);
            var style = { font: "28px londrina", fill: "#D5F3FF", align: "center" };
            var cText = configObj.game.add.text(configObj.percentOfWidth(0.393), 165, "1x", style);
            popUpContainer.add(cText);
            var movesBtnBg = configObj.game.add.sprite(configObj.percentOfWidth(0.52), 135, "spriteAtlas1", "moves_bg.png");
            popUpContainer.add(movesBtnBg);
            var movesBtn = configObj.game.add.button(configObj.percentOfWidth(0.535), 260, "spriteAtlas1", this.shopSelected.bind(this, "addMoves"), this);
            movesBtn.frameName = "btn_1500.png";
            popUpContainer.add(movesBtn);
            var cText = configObj.game.add.text(configObj.percentOfWidth(0.768), 165, "1x", style);
            popUpContainer.add(cText)
            var singleCandyBg = configObj.game.add.sprite(configObj.percentOfWidth(0.147), 340, "spriteAtlas1", "hoop1_bg.png");
            popUpContainer.add(singleCandyBg);
            var singleCandyBtn = configObj.game.add.button(configObj.percentOfWidth(0.162), 465, "spriteAtlas1", this.shopSelected.bind(this, "addSingleCandy"), this);
            singleCandyBtn.frameName = "btn_500.png";
            popUpContainer.add(singleCandyBtn);
            var cText = configObj.game.add.text(configObj.percentOfWidth(0.393), 370, "1x", style);
            popUpContainer.add(cText)
            var CandyBg = configObj.game.add.sprite(configObj.percentOfWidth(0.52), 340, "spriteAtlas1", "hoop3_bg.png");
            popUpContainer.add(CandyBg);
            var CandyBtn = configObj.game.add.button(configObj.percentOfWidth(0.535), 465, "spriteAtlas1", this.shopSelected.bind(this, "addMultipleCandies"), this);
            CandyBtn.frameName = "btn_1200.png";
            popUpContainer.add(CandyBtn);
            var cText = configObj.game.add.text(configObj.percentOfWidth(0.768), 370, "3x", style);
            popUpContainer.add(cText);
            var singleWandBg = configObj.game.add.sprite(configObj.percentOfWidth(0.147), 545, "spriteAtlas1", "wand1_bg.png");
            popUpContainer.add(singleWandBg);
            var singleWandBtn = configObj.game.add.button(configObj.percentOfWidth(0.162), 670, "spriteAtlas1", this.shopSelected.bind(this, "singleWand"), this);
            singleWandBtn.frameName = "btn_1000.png";
            popUpContainer.add(singleWandBtn);
            var cText = configObj.game.add.text(configObj.percentOfWidth(0.393), 575, "1x", style);
            popUpContainer.add(cText);
            var  WandBg = configObj.game.add.sprite(configObj.percentOfWidth(0.52), 540, "spriteAtlas1", "candy_bg.png");
            popUpContainer.add(WandBg);
            var WandBtn = configObj.game.add.button(configObj.percentOfWidth(0.535), 670, "spriteAtlas1", this.shopSelected.bind(this, "Wand"), this);
            WandBtn.frameName = "btn_2500.png";
            popUpContainer.add(WandBtn);
            var cText = configObj.game.add.text(configObj.percentOfWidth(0.768), 580, "3x", style);
            popUpContainer.add(cText);

            popUpContainer.scale.x = 0.5;
            popUpContainer.scale.y = 0.5;
            this.close_click = configObj.game.add.button(configObj.percentOfWidth(0.84),53, "spriteAtlas", this.closePopUp.bind(this,popUpContainer), this);
            this.close_click.frameName = "close_btn.png";
            popUpContainer.add(this.close_click);
            this.animatePopUp(popUpContainer);
        }
    },
    shopSelected : function(item){
        switch(item){
            case "addLife":
                if(configObj.localDataModelObj.getCoins() >= 5000){
                    configObj.localDataModelObj.incrementLife(5);
                    this.addShopStatusPopUp(true, "attempts_icon");
                    configObj.localDataModelObj.setCoins(-5000);
                    this.lifeText.text = ""+configObj.getLifeCount();
                    this.coinsText.text = "" + configObj.localDataModelObj.getCoins();
                }
                else{
                    this.addShopStatusPopUp(false, null);
                }
                break;
            case "addMoves":
                if(configObj.localDataModelObj.getCoins() >= 1500){
                    configObj.localDataModelObj.setPowerUp("addMoreMoves", 1);
                    this.addShopStatusPopUp(true, "addMoreMoves");
                    configObj.localDataModelObj.setCoins(-1500);
                    this.coinsText.text = "" + configObj.localDataModelObj.getCoins();
                }
                else{
                    this.addShopStatusPopUp(false, null);
                }
                break;
            case "addSingleCandy":
                if(configObj.localDataModelObj.getCoins() >= 500){
                    configObj.localDataModelObj.setPowerUp("powerUpRing", 1);
                    configObj.localDataModelObj.setCoins(-500);
                    this.addShopStatusPopUp(true, "powerUpRing");
                    this.coinsText.text = "" + configObj.localDataModelObj.getCoins();
                }
                else{
                    this.addShopStatusPopUp(false, null);
                }
                break;
            case "addMultipleCandies" :
                if(configObj.localDataModelObj.getCoins() >= 1200){
                    configObj.localDataModelObj.setPowerUp("powerUpRing", 3);
                    configObj.localDataModelObj.setCoins(-1200);
                    this.addShopStatusPopUp(true, "hoop_3_icon");
                    this.coinsText.text = "" + configObj.localDataModelObj.getCoins();
                }
                else{
                    this.addShopStatusPopUp(false, null);
                }
                break;
            case "singleWand":
                if(configObj.localDataModelObj.getCoins() >= 1000){
                    configObj.localDataModelObj.setPowerUp("universal", 1);
                    configObj.localDataModelObj.setCoins(-1000);
                    this.addShopStatusPopUp(true, "universal");
                    this.coinsText.text = "" + configObj.localDataModelObj.getCoins();
                }
                else{
                    this.addShopStatusPopUp(false, null);
                }
                break;
            case "Wand" :
                if(configObj.localDataModelObj.getCoins() >= 2500){
                    configObj.localDataModelObj.setPowerUp("universal", 3);
                    configObj.localDataModelObj.setCoins(-2500);
                    this.addShopStatusPopUp(true, "wand_3_icon");
                    this.coinsText.text = "" + configObj.localDataModelObj.getCoins();
                }
                else{
                    this.addShopStatusPopUp(false, null);
                }
                break;
        }

    },
    addShopStatusPopUp : function(status, img){
        if(!this.infoPopUp){
            this.close_click.inputEnabled = false;
            this.infoPopUp = true;
            this.tint_Bg1 = configObj.game.add.sprite(configObj.percentOfWidth(0),0, "tint_background");
//            this.backLayer.add(this.tint_Bg1);
            var msg;
            var popUpContainer = configObj.game.add.group();
            var bg = configObj.game.add.sprite(configObj.percentOfWidth(0.06), 300, "spriteAtlas", "coin_success.png");
            popUpContainer.add(bg);

            if(status){
                configObj.boosterAPI.event('itemBought', img);
                this.coinsText.text = ""+configObj.localDataModelObj.getCoins();
                msg = configObj.languageData["shop"]["successMessage"];
                var beams = configObj.game.add.sprite(configObj.percentOfWidth(0), 250, "spriteAtlas", "beams.png");
                popUpContainer.add(beams);
                var item = configObj.game.add.sprite(configObj.percentOfWidth(0.21), 385, "spriteAtlas", img+".png");
                popUpContainer.add(item);
                item.anchor.setTo(0.5, 0.5);
                var heading = configObj.game.add.text(configObj.percentOfWidth(0.555), 390, configObj.languageData["shop"]["successHeading"], {font : "42px londrina", fill : "#00436A", align : "center"});
                heading.anchor.setTo(0.5, 0.5);
                popUpContainer.add(heading);
            }
            else{
                msg = configObj.languageData["shop"]["failMessage"];;
                var heading = configObj.game.add.text(configObj.percentOfWidth(0.5), 390, configObj.languageData["shop"]["failHeading"], {font : "42px londrina", fill : "#00436A", align : "center"});
                heading.anchor.setTo(0.5, 0.5);
                popUpContainer.add(heading);
            }
            var message = configObj.game.add.text(configObj.percentOfWidth(0.5), 480, ""+msg, {font : "28px londrina", fill : "#a06626", align : "center"});
            message.anchor.setTo(0.5, 0.5);
            popUpContainer.add(message);
            this.close_click1 = configObj.game.add.button(configObj.percentOfWidth(0.84),270, "spriteAtlas", this.closeInfoPopUp.bind(this,popUpContainer), this);
            this.close_click1.frameName = "close_btn.png";
            popUpContainer.add(this.close_click1);
            popUpContainer.scale.x = 0.5;
            popUpContainer.scale.y = 0.5;
            this.animatePopUp(popUpContainer);
        }

    },

    OnUnlockClick : function()
    {
        if(!this.popUp && !this.timerPopUp){
            this.popUp = true;
            this.buttonState(false);
            configObj.playAudio(configObj.button_clickAudio);
            this.tint_Bg.visible = true;
            var popUpContainer = configObj.game.add.group();
            var unlock_screen = configObj.game.add.sprite(configObj.percentOfWidth(0.12), 70, "game_setting");
            unlock_screen.scale.y = 1.08;
            popUpContainer.add(unlock_screen);
            var startX = configObj.percentOfWidth(0.18);
            var startY = 145;
            var temp = 0;

            for(var i = 0; i < 6; i++){
                if(temp == 2){
                    temp = 0;
                    startX = configObj.percentOfWidth(0.18);
                    startY += 200;
                }
                if(configObj.unlockedMonsterArr.indexOf("char_"+(i + 1)) == -1){
                    this.unlockMonsterArr[i] =  configObj.game.add.button(startX, startY, "spriteAtlas1", this.unlockableClick.bind(this,configObj.languageData["unlockedPetData"].subHeading2, "char_"+(i + 1), popUpContainer, configObj.languageData["unlockedPetData"].unlockPetText, i, this.monsterRewards[i]), this);
                    this.unlockMonsterArr[i].frameName = "char_"+(i + 1)+".png";
                }
                else{
                    this.unlockMonsterArr[i] =  configObj.game.add.button(startX, startY, "spriteAtlas1", this.unlockableClick.bind(this,configObj.languageData["unlockedPetData"].subHeading1, "char_unlocked"+(i + 1), popUpContainer, configObj.languageData["unlockedPetData"].unlockPetText, i, this.monsterRewards[i]), this);
                    this.unlockMonsterArr[i].frameName = "char_unlocked"+(i + 1)+".png";
                }

                startX += 200;
                popUpContainer.add(this.unlockMonsterArr[i]);
                temp++;
            }
            popUpContainer.scale.x = 0.5;
            popUpContainer.scale.y = 0.5;
            this.close_click = configObj.game.add.button(configObj.percentOfWidth(0.76),60, "spriteAtlas", this.closePopUp.bind(this,popUpContainer), this);
            this.close_click.frameName = "close_btn.png";
            popUpContainer.add(this.close_click);
            this.animatePopUp(popUpContainer);
        }

    },
    OnLevelButtonClick : function(levelNo)
    {
        if(!this.popUp && this.lifeCount > 0 && !this.timerPopUp)
        {
            this.buttonState(false);
            this.popUp = true;
            var score, stars;
            var levelInfo = configObj.getLevelInfo(levelNo - 1);
            if(levelInfo != null){
                score  = levelInfo.score;
            }
            else{
                score = 0;
            }

            configObj.playAudio(configObj.button_clickAudio);
            this.tint_Bg.visible = true;
            var popUpContainer = configObj.game.add.group();
            var game_setting_back = configObj.game.add.sprite(configObj.percentOfWidth(0.072), 55, "level_info_Bg");
            popUpContainer.add(game_setting_back);
            this.Level = configObj.game.add.text(configObj.percentOfWidth(0.345),115,configObj.languageData["levelInfo"].title + " :"+levelNo, { font: "65px londrina", fill: "#a06626", align: "center" });
            popUpContainer.add(this.Level);
            this.Score = configObj.game.add.text(configObj.percentOfWidth(0.36),370,configObj.languageData["levelInfo"].levelScore + "\t: "+score, { font: "35px londrina", fill: "#a26829", align: "center" });
            popUpContainer.add(this.Score);
            this.Target = configObj.game.add.text(configObj.percentOfWidth(0.36),430,configObj.languageData["levelInfo"].levelTarget+" : " + configObj.levelData[levelNo].targetScore, { font: "35px londrina", fill: "#a26829", align: "center" });
            popUpContainer.add(this.Target);
            this.Moves = configObj.game.add.text(configObj.percentOfWidth(0.36),490,configObj.languageData["levelInfo"].levelMoves + " \t: "+ configObj.levelData[levelNo].moves, { font: "35px londrina", fill: "#a26829", align: "center" });
            popUpContainer.add(this.Moves);
            this.play_butn = configObj.game.add.button(configObj.percentOfWidth(0.284), 576, "spriteAtlas", this.OnPlayButtonClick.bind(this,popUpContainer), this);
            this.play_butn.frameName = "ingame_play_btn.png";
            popUpContainer.add(this.play_butn);
            this.play_butn.inputEnabled = false;
            this.close_click = configObj.game.add.button(configObj.percentOfWidth(0.84), 40, "spriteAtlas", this.closePopUp.bind(this, popUpContainer), this);
            this.close_click.frameName = "close_btn.png";
            popUpContainer.add(this.close_click);
            popUpContainer.scale.x = 0.5;
            popUpContainer.scale.y = 0.5;
            this.close_click.inputEnabled = false;
            configObj.levelNo = levelNo;
            this.animatePopUp(popUpContainer);
            var levelData = configObj.getLevelInfo(levelNo - 1);
            var startPos = configObj.percentOfWidth(0.29);
            var starCount = levelData != null ? levelData.stars : 0;
            if(starCount > 0){
                this.buttonState(false);
                this.starImg = configObj.game.add.sprite(startPos, 276, "bigStar");
                popUpContainer.add(this.starImg);
                this.starImg.scale.x = 2;
                this.starImg.scale.y = 2;
                this.starImg.anchor.setTo(0.5, 0.5);
                startPos += 137;
                var self = this;
                var starTween = configObj.game.add.tween(this.starImg.scale).to({x : 0.2, y : 0.2}, 500, Phaser.Easing.Bounce.Out, true, 100);
                configObj.playAudio(this.punch, false);
                starTween.onComplete.add(function(){
                    self.starImg.destroy();
                    self.starImg = null;
                    self.starImg = configObj.game.add.sprite(configObj.percentOfWidth(0.221), 237, "spriteAtlas", "level_star.png");
                    popUpContainer.add(self.starImg);
                    self.play_butn.inputEnabled = self.close_click.inputEnabled = true;                    
                    starCount--;
                    if(starCount > 0){
                        self.play_butn.inputEnabled = self.close_click.inputEnabled = false;
                        self.starImg1 = configObj.game.add.sprite(startPos, 276, "bigStar");
                        self.starImg1.scale.x = 2;
                        self.starImg1.scale.y = 2;
                        popUpContainer.add(self.starImg1);
                        self.starImg1.anchor.setTo(0.5, 0.5);
                        startPos += 137;
                        var starTween = configObj.game.add.tween(self.starImg1.scale).to({x : 0.2, y : .2}, 500, Phaser.Easing.Bounce.Out, true, 100);
                        configObj.playAudio(self.punch, false);
                        starTween.onComplete.add(function(){
                            self.starImg1.destroy();
                            self.starImg1 = null;
                            self.starImg1 = configObj.game.add.sprite(configObj.percentOfWidth(0.435), 237, "spriteAtlas", "level_star.png");
                            popUpContainer.add(self.starImg1);
                            self.play_butn.inputEnabled = self.close_click.inputEnabled = true;
                            starCount--;
                            if(starCount > 0){
                                self.play_butn.inputEnabled = self.close_click.inputEnabled = false;
                                self.starImg2 = configObj.game.add.sprite(startPos, 276, "bigStar");
                                self.starImg2.scale.x = 2;
                                self.starImg2.scale.y = 2;
                                popUpContainer.add(self.starImg2);
                                self.starImg2.anchor.setTo(0.5, 0.5);
                                startPos += 137;
                                var starTween = configObj.game.add.tween(self.starImg2.scale).to({x : .2, y : .2}, 500, Phaser.Easing.Bounce.Out, true, 100);
                                configObj.playAudio(self.punch, false);
                                starTween.onComplete.add(function(){
                                    self.starImg2.destroy();
                                    self.starImg2 = null;
                                    self.starImg2 = configObj.game.add.sprite(configObj.percentOfWidth(0.65), 237, "spriteAtlas", "level_star.png");
                                    popUpContainer.add(self.starImg2);
                                    self.play_butn.inputEnabled = self.close_click.inputEnabled = true;

                                });
                            }
                        });
                    }
                });
            }
            else{
                this.play_butn.inputEnabled = this.close_click.inputEnabled = true;
            }
        }
        else if(!this.popUp &&  this.lifeCount == 0 && !this.timerPopUp){
            this.buttonState(false);
            this.timerPopUp = true;
            this.tint_BgTimer = configObj.game.add.sprite(configObj.percentOfWidth(0),0, "tint_background");
            var popUpContainer = configObj.game.add.group();
            var bg = configObj.game.add.sprite(configObj.percentOfWidth(0.07), 200, "buy_popup");
            popUpContainer.add(bg);
            var buyBtn = configObj.game.add.button(configObj.percentOfWidth(0.318), 520, "spriteAtlas1", this.OnShopClick, this);
            buyBtn.frameName = "buy_attempts_btn.png";
            popUpContainer.add(buyBtn);
            popUpContainer.add(configObj.game.add.text(configObj.percentOfWidth(0.255), 280, configObj.languageData["warning"]["noAttempts"].heading,{font :"45px londrina", fill : "red", align : "center"}));
            popUpContainer.add(configObj.game.add.text(configObj.percentOfWidth(0.23), 350, configObj.languageData["warning"]["noAttempts"].timerText, {font :"40px londrina", fill : "#a06626", align : "center"}));
            this.remainingTime = configObj.game.add.text(configObj.percentOfWidth(0.455), 400, ""+this.timerText.text, {font :"40px londrina", fill : "#a06626", align : "center"});
            popUpContainer.add(this.remainingTime);
            popUpContainer.add(configObj.game.add.text(configObj.percentOfWidth(0.19), 450, configObj.languageData["warning"]["noAttempts"]["suggestionMsg"], {font :"30px londrina", fill : "#a06626", align : "center"}));
            popUpContainer.scale.x = 0.5;
            popUpContainer.scale.y = 0.5;
            this.close_clickAlert = configObj.game.add.button(configObj.percentOfWidth(0.85), 170, "spriteAtlas", this.closeTimerPopUp.bind(this, popUpContainer), this);
            this.close_clickAlert.frameName = "close_btn.png";
            popUpContainer.add(this.close_clickAlert);
            this.animatePopUp(popUpContainer);
        }
    },
    gameTimer : function(){
        this.lifeCount  = configObj.getLifeCount();
        if(this.lifeCount < 10){
            this.totalElapsedTime = configObj.attempTimerObj.updateTime();
            if(this.lifeCount > 0){
                this.timerText.visible = false;
            }  
            if(this.lifeCount == 0){
                var timer = (configObj.attempTimeCounter * 60) - ((this.totalElapsedTime.m * 60) + this.totalElapsedTime.s);
                var minutes = Math.floor(timer / 60);
                var min = minutes < 10 ? "0"+ minutes : minutes;
                var sec = timer % 60 ;
                var seconds = sec < 10 ? "0"+sec : sec;
                if(minutes >= 0 && sec >= 0){
                    if(this.timerText)
                        this.timerText.text = min + ":"+ seconds;
                    if(this.timerPopUp){
                        this.remainingTime.text = min + ":"+ seconds;
                    }
                }
            }                  
            if(this.totalElapsedTime.m > 0 && this.totalElapsedTime.m % configObj.attempTimeCounter == 0){
                //configObj.attempTimeCounter += configObj.attempTimeCounter;
                configObj.localDataModelObj.incrementLife(1);
                this.lifeText.text = ""+configObj.getLifeCount();
            }
        }
        else{
            configObj.attempTimeCounter = 10;
            configObj.game.time.events.remove(this.loopEvent);
        }
    },
    OnPlayButtonClick : function(container)
    {
        var isAndroid = navigator.userAgent.indexOf('Android') >= 0;
        var webkitVer = parseInt((/WebKit\/([0-9]+)/.exec(navigator.appVersion) || 0)[1],10) || void 0; // also match AppleWebKit
        var isNativeAndroid = isAndroid && webkitVer <= 534 && navigator.vendor.indexOf('Google') == 0;
        if(isNativeAndroid){
            configObj.nativeBrowser = true;
        }
        this.level_start = configObj.game.add.audio('level_start');
        configObj.playAudio(this.level_start, false);
        this.play_butn.inputEnabled = false;
        var anim = configObj.game.add.tween(container.scale).to({ x: 0.5, y: 0.5}, 450, Phaser.Easing.Back.In, true);
        var anim1 = configObj.game.add.tween(container.position).to({ x: 0, y: 0}, 450, Phaser.Easing.Back.In, true);
        var self = this;
        anim.onComplete.add(function(){
            container.destroy();
            self.tint_Bg.destroy();
            self.tint_Bg = null;
            if(localStorage.tutorialShown == undefined){
                configObj.game.tweens.removeAll();
                configObj.game.state.start('InGameTutorial');
            }
            else{
                configObj.game.tweens.removeAll();
                configObj.game.state.start('MagicMonsters');
            }
        });
    },
    buttonState : function(state){
        this.ach_butn.inputEnabled = this.shop_butn.inputEnabled = this.unlock_butn.inputEnabled = this.moreGames_butn.inputEnabled = state;
    },
    update : function()
    {
    }
};