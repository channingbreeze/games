/**
 * Created with JetBrains WebStorm.
 * User: vivek.d
 * Date: 4/10/14
 * Time: 3:17 PM
 * To change this template use File | Settings | File Templates.
 */
Game.MagicMonsters = function(){
};

Game.MagicMonsters.prototype = {
    initialize : function(){
        this.starCounter = 0;
        this.groupFormed = 0;
        this.gameTimeCounter = 0;
        this.gridStartYPos = configObj.gridStartYPos;
        this.index = 0;
        this.randomNoContainer = new Array(7);
        for(var i = 0; i < 7; i++){
            this.randomNoContainer[i] = new Array(7);
        }
        this.scoreId = 0;
        this.scoreMultiplier = 30;
        this.currentLevel = configObj.levelNo;
        this.currentLevelData = configObj.levelData[configObj.levelNo];
        configObj.levelClear = false;
        this.powerUpActivated = false;
        this.levelTarget = this.currentLevelData.targetScore;
        this.newTimer = null;
        this.killAnimationComplete = false;
        this.unlockedBadgeArr = JSON.parse(localStorage.getItem('unlockedBadgeData')) || [];
        this.horizontalMatchedMonsterArray = new Array();
        this.lineArr = new Array();
        this.verticalMatchedMonsterArray = new Array();
        this.selectedMatchesArr = new Array();
        this.swapperMatchesArr = new Array();
        this.automatedMatchedArray = new Array();
        this.removedPos = new Array();
        this.monsterContainer = new Array();
//        this.objYPositionContainer = new Array();
        this.hintArray = new Array();
        this.matchesFound = false;
        this.monsterAnimIndex;
        this.MonsterState = "moving";
        this.mouseDownX = this.mouseDownY = 0;
        this.mouseUpX = this.mouseUpY = 0;
        this.thresHold = 20;
        this.containerSize;
        this.selectedMonster = null;
        this.swapperMonster = null;
        this.selectedMonsterPos;
        this.swapperMonsterPos;
        this.totalPositionUpdateCounter = 0;
        this.tweenAnimationCounter = 0;
        this.endDropAnimCounter = 0;
        this.destroyAnimation = 0;
        this.destroyAnimationComplete = 0;
        this.hintLoopEvent;
        this.powerUpData = {};
        this.powerUpUsedFlag = null;
        this.scoreId = -1;
        this.monsterFrenzyAnimFlag = false;
        this.startHintTimer = true;
//        image id
//        0, 1, 2, 3, 4, 5 - Monsters, 6 - Universal powerup, 7 - Block
    },
    preload : function(){

    },
    create : function(){
        configObj.game.inputEnabled = true;
        if(false || !!document.documentMode){
            configObj.game.stage.disableVisibilityChange = true;
        }
        configObj.boosterAPI.event('level',configObj.levelNo);
        configObj.boosterAPI.event('levelstart',configObj.levelNo);

        this.initialize();
        this.blankStarArr = new Array();
        this.textAnimation = false;
        this.score = 0;
        this.hintTimer = 0;
        this.total_moves_left = this.currentLevelData.moves;
        this.jellyBrakedArray = new Array();
        this.jellyContianer = new Array();
        this.jellyBreakContianer = new Array();
        this.powUpMonster = new Array();
        this.unlockMonsterArr = new Array();
        configObj.currLevelStatus = {
            "levelStarted" : true,
            "levelCleared" : false
        };
        localStorage.setItem('currLevelStatus', JSON.stringify(configObj.currLevelStatus));
        this.jellyCount = this.currentLevelData.jelly.length;

//      Audio
        this.new_spawnSound = configObj.game.add.audio("new_spawn");
        this.resetPos_sound = configObj.game.add.audio("wrong_move");
        this.swipe_sound = configObj.game.add.audio("swipe");
        this.bg_sound = configObj.game.add.audio('bg_sound');
        this.no_more_moves = configObj.game.add.audio('no_more_moves');
        this.level_finish = configObj.game.add.audio('level_finish');
        this.powermonster = configObj.game.add.audio('powermonster');
        this.jellybreak = configObj.game.add.audio('jellybreak');
        this.punch = configObj.game.add.audio("punch");
        configObj.playAudio(this.bg_sound, true);
//       Mouse Move callback
        configObj.game.input.mouse.mouseMoveCallback = this.mouseMoveCallBack.bind(this);
        configObj.game.input.touch.touchMoveCallback = this.mouseMoveCallBack.bind(this);
        var powerUpData = JSON.parse(localStorage.getItem('powerUpCount'));
        this.inGameTutorial = false;

        if(configObj.isDevice){
            this.diffFactorForPlacement = 65;
            this.backGroundImg1 = configObj.game.add.sprite(configObj.percentOfWidth(0), 0, "Game_background_mbl");
            configObj.game.inputEnabled = true;
            this.blockLayer = configObj.game.add.group();
            this.blockLayer.z = 0;
            this.MonsterLayer = configObj.game.add.group();
            this.MonsterLayer.z = 1;
            this.effectLayer = configObj.game.add.group();
            this.effectLayer.z = 2;
            this.footerLayer = configObj.game.add.group();
            this.footerLayer.z = 3;
            this.tint_Bg = configObj.game.add.sprite(configObj.percentOfWidth(0),0, "tint_background");
            this.tint_Bg.visible = false;
            this.jellyLayer = configObj.game.add.group();
            this.jellyLayer.z = 4;
            this.tutLayer = configObj.game.add.group();
            this.tutLayer.z = 5;
            this.tint_Bg.scale.y = 1.5;
            this.tutLayer.add(this.tint_Bg);
            this.footer = configObj.game.add.sprite(-50, 725, "footer");
            this.footerLayer.add(this.footer);
            this.hud_BGLayer = configObj.game.add.sprite(85, 0, "hud_BGLayer");
            this.footerLayer.add(this.hud_BGLayer);
            this.progressBar = configObj.game.add.sprite(25, 21, "spriteAtlas1", "progress_bar.png");
            this.progressBar.anchor.setTo(0.5, 0.5);
            this.footerLayer.add(this.progressBar);
            this.headerImg = configObj.game.add.sprite(-19 ,-78, "header");
            this.footerLayer.add(this.headerImg);
            this.blankStarLayer = configObj.game.add.group();
            this.blankStarLayer.z = 6;
            for(var i = 1; i < 4; i++){
                var xDiff = 55 * i;
                var blank = configObj.game.add.sprite(this.progressBar.x + this.progressBar.width/2 + xDiff, 50, "spriteAtlas1", "inGameBlankStar.png");
                blank.anchor.setTo(0.5, 0.5);
                this.blankStarArr.push(blank);
                this.footerLayer.add(this.blankStarArr[this.blankStarArr.length - 1]);
            }
            this.levelMovesText = configObj.game.add.text(30, 755, configObj.languageData["levelInfo"]["levelMoves"] + "\n"+this.total_moves_left , {font : "35px londrina", fill : "#e9f4ff", align: "center"});
            this.footerLayer.add(this.levelMovesText);
            this.settingBtn = configObj.game.add.button(569 ,10, "spriteAtlas", this.showSettings, this);
            this.settingBtn.frameName = "mbl_settings.png";
            this.footerLayer.add(this.settingBtn);
            this.footerLayer.add(configObj.game.add.text(13, 10, configObj.languageData["levelInfo"]["title"] + "\n"+this.currentLevel, {font : "25px londrina", fill : "#e9f4ff", align : "center"}));
            configObj.game.add.text(365, 10, "Target "+this.levelTarget, {font : "35px londrina", fill : "#FFDC4E", align : "center"});
            this.levelScoreText = configObj.game.add.text(535, 755,configObj.languageData["levelInfo"]["levelScore"] + " \n"+this.score, {font : "35px londrina", fill : "#e9f4ff", align : "center"});
            this.universalPowerBtn = configObj.game.add.button(205, 769, "universalPowerUp", this.powerUpUsed.bind(this, 'wand'), this, 0, 0, 1, 0);
            var style = {font : "24px londrina", fill : "#f5a3ff", align : "center"};
            this.universalPowerUpCount =  configObj.game.add.text(207, 765, ""+powerUpData["universal"], style);
            this.universalPowerUpCount.anchor.setTo(0.5, 0.5);
            this.ringPowerBtn = configObj.game.add.button(303, 768, "powerUpRing", this.powerUpUsed.bind(this, 'ring'), this, 0, 0, 1, 0);
            this.ringPowerUpCount =  configObj.game.add.text(297, 765, ""+powerUpData["powerUpRing"], style);
            this.ringPowerUpCount.anchor.setTo(0.5, 0.5);
            this.extraMovesBtn = configObj.game.add.button(387, 768, "addMoreMoves", this.powerUpUsed.bind(this, 'extramoves'), this, 0, 0, 1, 0);
            this.extraMovesPowerUpCount =  configObj.game.add.text(387, 765, ""+powerUpData["addMoreMoves"], style);
            this.extraMovesPowerUpCount.anchor.setTo(0.5, 0.5);

            var inGameTut = configObj.game.add.group();
            var tutBg = configObj.game.add.sprite(configObj.percentOfWidth(0), 315, "spriteAtlas", "bg_ingame_tut.png");
            inGameTut.add(tutBg);

            var tutText = configObj.game.add.text(configObj.percentOfWidth(0.465), 420, ""+configObj.languageData["levelStartText"][configObj.levelNo - 1] , { font: "32px londrina", fill: "#a26829", align: "center" });
            inGameTut.add(tutText);
            tutText.anchor.setTo(0.5, 0.5);
            this.tutLayer.add(inGameTut);
            inGameTut.x = -configObj.percentOfWidth(1.7);
            var tutTween = configObj.game.add.tween(inGameTut).to({x : configObj.percentOfWidth(0.03)}, 300, Phaser.Easing.Back.Out, true, 800);
            var self = this;
            tutTween.onComplete.add(function(){
                var tween1 = configObj.game.add.tween(inGameTut).to({x : configObj.percentOfWidth(1)}, 300, Phaser.Easing.Back.In, true, 1300);
                tween1.onComplete.add(function(){
                    self.inGameTutorial = true;
                    inGameTut.destroy();
                    self.MonsterState = "stady";
                });
            });

        }
        else{
            this.diffFactorForPlacement = 0;
            this.inGameTutorial = false;
            this.progressBar = configObj.game.add.sprite(800, 75, "spriteAtlas1", "progress_bar.png");
            this.progressBar.anchor.setTo(0.5, 0.5);
            this.backGroundImg1 = configObj.game.add.sprite(configObj.percentOfWidth(0), 0, "Game_background");
            configObj.game.inputEnabled = true;
            this.blockLayer = configObj.game.add.group();
            this.blockLayer.z = 0;
            this.MonsterLayer = configObj.game.add.group();
            this.MonsterLayer.z = 1;
            this.footerLayer = configObj.game.add.group();
            this.footerLayer.z = 2;
            this.jellyLayer = configObj.game.add.group();
            this.jellyLayer.z = 3;
            this.effectLayer = configObj.game.add.group();
            this.effectLayer.z = 4;
            this.logoLayer = configObj.game.add.group();
            this.logoLayer.z = 5;
            this.logo = configObj.game.add.sprite(configObj.percentOfWidth(0.25), 20, "spriteAtlas1", "logo.png");
            this.logoLayer.add(this.logo);
            this.pannelLayer = configObj.game.add.group();
            this.pannelLayer.z = 6;
            this.pannelLayer.add(configObj.game.add.sprite(0 ,0, "leftBar"));
            this.pannelLayer.add(configObj.game.add.sprite(860 ,0, "rightBar")) ;
            this.tint_Bg = configObj.game.add.sprite(configObj.percentOfWidth(0),0, "tint_background");
            this.tint_Bg.visible = false;
            this.pannelLayer.add(this.tint_Bg);
            configObj.game.add.text(870, 10, configObj.languageData["levelInfo"]["levelTarget"] + " "+this.levelTarget, {font : "40px londrina", fill : "#FFDC4E", align : "center"});
            configObj.game.add.sprite(875 ,120, "spriteAtlas1", "text_box.png");
            var style = {font : "25px londrina", fill : "#e9f4ff", align : "center"};
            configObj.game.add.text(895, 145, configObj.languageData["levelInfo"].title + "\t "+this.currentLevel, style);
            this.levelMovesText = configObj.game.add.text(895, 180,  configObj.languageData["levelInfo"].levelMoves + "\t "+this.total_moves_left , style);
            this.levelScoreText = configObj.game.add.text(895, 220, configObj.languageData["levelInfo"].levelScore + "\t "+this.score, style);

            this.universalPowerBtn = configObj.game.add.button(875, 300, "magic_stick", this.powerUpUsed.bind(this, 'wand'), this, 0, 0, 1, 0);
            var style = {font : "24px londrina", fill : "#f5a3ff", align : "center"};
            this.universalPowerUpCount =  configObj.game.add.text(952 , 343 + configObj.textMarginForBrowser, ""+powerUpData["universal"], style);
            this.universalPowerUpCount.anchor.setTo(0.5, 0.5);
            this.ringPowerBtn = configObj.game.add.button(875, 434, "magic_ring", this.powerUpUsed.bind(this, 'ring'), this, 0, 0, 1, 0);
            this.ringPowerUpCount =  configObj.game.add.text(952 , 470 + configObj.textMarginForBrowser, ""+powerUpData["powerUpRing"], style);
            this.ringPowerUpCount.anchor.setTo(0.5, 0.5);
            this.extraMovesBtn = configObj.game.add.button(875, 559, "extra_moves", this.powerUpUsed.bind(this, 'extramoves'), this, 0, 0, 1, 0);
            this.extraMovesPowerUpCount =  configObj.game.add.text(955, 594 + configObj.textMarginForBrowser, ""+powerUpData["addMoreMoves"], style);
            this.extraMovesPowerUpCount.anchor.setTo(0.5, 0.5);
            this.settingBtn = configObj.game.add.button(880 ,730, "spriteAtlas1", this.showSettings, this);
            this.settingBtn.frameName = "settingBtn.png";
            configObj.addFullscreenButton(982,730);

            var inGameTut = configObj.game.add.group();
            var tutBg = configObj.game.add.sprite(configObj.percentOfWidth(0.39), 385, "spriteAtlas", "bg_ingame_tut.png");
            inGameTut.add(tutBg);
            var tutText = configObj.game.add.text(configObj.percentOfWidth(0.85), 484, ""+configObj.languageData["levelStartText"][configObj.levelNo - 1], { font: "32px londrina", fill: "#a26829", align: "center" });
            inGameTut.add(tutText);
            tutText.anchor.setTo(0.5, 0.5);
            this.logoLayer.add(inGameTut);
            inGameTut.x = -configObj.percentOfWidth(1.7);
            var tutTween = configObj.game.add.tween(inGameTut).to({x : -configObj.percentOfWidth(0.01)}, 400, Phaser.Easing.Back.Out, true, 800);
            var self = this;

            tutTween.onComplete.add(function(){
                var tween1 = configObj.game.add.tween(inGameTut).to({x : configObj.percentOfWidth(0.99)}, 300, Phaser.Easing.Back.In, true, 1300);
                tween1.onComplete.add(function(){
                    self.inGameTutorial = true;
                    inGameTut.destroy(true);
                    self.MonsterState = "stady";
                })
            });
            for(var i = 1; i < 4; i ++){
                var xDiff = 55 * i;
                configObj.game.add.sprite(this.progressBar.x + this.progressBar.width/2 + xDiff, 106, "spriteAtlas1", "inGameBlankStar.png").anchor.setTo(0.5, 0.5);
            }

        }
        this.generateRandomNo();
        this.gameTimerEvent = configObj.game.time.events.loop(Phaser.Timer.SECOND / 2, this.gameTimer, this);
    },
    gameTimer : function(){
        this.gameTimeCounter++;
        if(this.gameTimeCounter == 1){
            this.automatedChecking();
        }
        if(!configObj.levelClear){
            if(this.monsterAnimIndex != undefined && this.monsterContainer[this.monsterAnimIndex] != undefined && this.monsterContainer[this.monsterAnimIndex].type != "universal" && this.gameTimeCounter % 4 == 0){
                this.monsterContainer[this.monsterAnimIndex].animations.stop(true, false);
            }
            var index = Math.floor(Math.random() * 48);
            if(index != this.monsterAnimIndex && this.gameTimeCounter % 4 == 0 && this.monsterContainer[index] != undefined && this.monsterContainer[index].monsterType != "block"){
                this.monsterContainer[index].play('blinkEyes', 1.5, true);
                this.monsterAnimIndex = index;
            }

            if(this.startHintTimer){
                this.hintTimer++;
                if(this.hintTimer % 10 == 0 && this.startHintTimer){
                    this.hintArray.splice(0, this.hintArray.length);
                    this.showHint();
                    this.startHintTimer = false;
                }
            }
        }
    },
    generateRandomNo : function(){
        this.setButtonState(true);
        for(var i = 0; i < configObj.totalRows; i++){
            for(var j = 0; j < configObj.totalCols; j++){
                this.randomNoContainer[i][j] = Math.floor(Math.random() * 6);
            }
        }
        this.verifyContainer();
    },
    verifyContainer : function(){
        for(var i = 0; i < configObj.totalRows; i++){
            for(var j = 0; j < configObj.totalCols; j++){
                if((j + 1)  < configObj.totalRows && this.randomNoContainer[i][j] == this.randomNoContainer[i][j + 1])
                {
                    if((j + 2)  < configObj.totalRows && this.randomNoContainer[i][j + 1] == this.randomNoContainer[i][j + 2]){
                        this.randomNoContainer[i][j + 2] = this.replaceValue(this.randomNoContainer[i][j + 2]);
                    }
                }
                if((i + 1)  < configObj.totalCols && this.randomNoContainer[i][j] == this.randomNoContainer[i + 1][j])
                {
                    if((i + 2)  < configObj.totalCols && this.randomNoContainer[i + 1][j] == this.randomNoContainer[i + 2][j]){
                        this.randomNoContainer[i + 2][j] = this.replaceValue(this.randomNoContainer[i + 2][j]);
                    }
                }
            }
        }
        this.generateMonsters();
    },
    generateMonsters : function(){
        if(this.inGameTutorial){
            this.MonsterState = " stady";
        }
        var xPos = configObj.gridStartXPos;
        for(var i = 0; i < configObj.totalRows; i++){
            for(var j = 0; j < configObj.totalCols; j++){
                if(this.currentLevelData.block.indexOf(this.index) != -1){
                    this.monsterContainer[this.index] = configObj.game.add.sprite(xPos, this.gridStartYPos, "spriteAtlas1", "block_box.png");
                    this.blockLayer.add(this.monsterContainer[this.index]);
                    this.monsterContainer[this.index].imageId = 7;
                    this.monsterContainer[this.index].anchor.setTo(1, 1);
                    this.monsterContainer[this.index].monsterType = "block";
                }
                else if(this.powUpMonster.length > 0 && this.powUpMonster.hasOwnProperty(this.index)){
                    if(this.powUpMonster[this.index].monsterType == "super"){
                        this.monsterContainer[this.index] = configObj.game.add.sprite(xPos, 10, 'super'+this.powUpMonster[this.index].imageId);
                        this.MonsterLayer.add(this.monsterContainer[this.index]);
                        this.monsterContainer[this.index].loadTexture('super'+this.powUpMonster[this.index].imageId, 0);
                        this.monsterContainer[this.index].animations.add('blinkEyes');
                        this.monsterContainer[this.index].imageId = this.powUpMonster[this.index].imageId;
                        //               combination - Type -> 3 - Normal, 4 - superMonster, 5 - universalMonster, Block
                        this.monsterContainer[this.index].monsterType = "super";
                    }
                    else{
                        this.monsterContainer[this.index] = configObj.game.add.sprite(xPos, 10, "universal");
                        this.monsterContainer[this.index].imageId = 6;
                        this.monsterContainer[this.index].monsterType = "universal";

                    }
                    this.monsterContainer[this.index].anchor.setTo(1, 1);
                    this.monsterContainer[this.index].inputEnabled = true;
                    this.monsterContainer[this.index].events.onInputDown.add(this.mouseDownCallBack.bind(this,this.monsterContainer[this.index]), this);
                    this.monsterContainer[this.index].events.onInputUp.add(this.mouseUpCallBack.bind(this,this.monsterContainer[this.index]), this);
                }
                else{
                    var temp = this.randomNoContainer[i][j];
                    this.monsterContainer[this.index] = configObj.game.add.sprite(xPos, 10, 'monster'+temp);
                    this.MonsterLayer.add(this.monsterContainer[this.index]);
                    this.monsterContainer[this.index].loadTexture('monster'+temp, 0);
                    this.monsterContainer[this.index].animations.add('blinkEyes');
                    this.monsterContainer[this.index].imageId = temp;
                    this.monsterContainer[this.index].anchor.setTo(1, 1);
                    this.monsterContainer[this.index].inputEnabled = true;
                    this.monsterContainer[this.index].events.onInputDown.add(this.mouseDownCallBack.bind(this,this.monsterContainer[this.index]), this);
                    this.monsterContainer[this.index].events.onInputUp.add(this.mouseUpCallBack.bind(this,this.monsterContainer[this.index]), this);
//               combination - Type -> 3 - Normal, 4 - superMonster, 5 - universalMonster, Block
                    this.monsterContainer[this.index].monsterType = "normal";
                }
                configObj.objYPositionContainer.push(this.gridStartYPos);
                xPos += configObj.gapBetweenObj;
                this.index++;
            }
            this.gridStartYPos += configObj.gapBetweenObj;
            xPos = configObj.gridStartXPos;
        }
        this.powUpMonster.splice(0, this.powUpMonster.length);
        this.containerSize = this.monsterContainer.length;
        if(this.currentLevelData.jelly.length > 0 && this.jellyContianer.length == 0){
            for(var i = 0; i < this.currentLevelData.jelly.length; i++){
                this.jellyContianer[i] = configObj.game.add.sprite(this.monsterContainer[this.currentLevelData.jelly[i]].x, configObj.objYPositionContainer[this.currentLevelData.jelly[i]], "spriteAtlas1", "jelly.png");
                this.jellyContianer[i].anchor.setTo(1, 1);
                this.jellyLayer.add(this.jellyContianer[i]);

                this.jellyBreakContianer[i] = configObj.game.add.sprite(this.monsterContainer[this.currentLevelData.jelly[i]].x, configObj.objYPositionContainer[this.currentLevelData.jelly[i]], 'jelly_animation');
                this.jellyBreakContianer[i].anchor.setTo(0.6, 0.63);
                this.jellyBreakContianer[i].loadTexture('jelly_animation', 0);
                this.jellyBreakContianer[i].animations.add('jelly_animation');
                this.jellyBreakContianer[i].visible = false;
                this.jellyLayer.add(this.jellyBreakContianer[i]);
            }
        }
        this.startDropAnim();
    },
    startDropAnim : function(){
        var dropAnim, dropAnim1, dropAnim2, dropAnim3;
        for(var i = 0; i < this.containerSize; i++){
            if(this.monsterContainer[i].monsterType != "block"){
                dropAnim = configObj.game.add.tween(this.monsterContainer[i]).to({y: configObj.objYPositionContainer[i]}, 300, Phaser.Easing.Sinusoidal.In);
                dropAnim1= configObj.game.add.tween(this.monsterContainer[i].scale).to({x : 1, y : 0.8 }, 120, Phaser.Easing.Sinusoidal.In);
                dropAnim2= configObj.game.add.tween(this.monsterContainer[i].scale).to({x : 1, y : 1.2 }, 120, Phaser.Easing.Sinusoidal.In);
                dropAnim3= configObj.game.add.tween(this.monsterContainer[i].scale).to({x : 1, y : 1 }, 120, Phaser.Easing.Sinusoidal.In);

                dropAnim.chain(dropAnim1);
                dropAnim1.chain(dropAnim2);
                dropAnim2.chain(dropAnim3);
                dropAnim.start();
            }
        }
    },
    endDropAnim : function(){
        this.endDropAnimCounter = 0;
        this.startHintTimer = false;
        this.MonsterState = "moving";
        for(var i = this.containerSize - 1; i >= 0; i--){
            if(this.monsterContainer[i].monsterType != "block"){
                var tween = configObj.game.add.tween(this.monsterContainer[i]).to({y: configObj.objYPositionContainer[i] + 800}, 400, null, true, (this.containerSize - i) * 20);
                var self = this;
                tween.onComplete.add(function(){
                    self.endDropAnimCounter++;
                    if(self.endDropAnimCounter == self.containerSize - self.currentLevelData.block.length - 2){
                        for(var i = 0; i < self.containerSize; i++){
                            self.monsterContainer[i].destroy();
                        }
                        self.monsterContainer.splice(0, self.containerSize);
                        configObj.currentLevelScore = self.score;
                        configObj.levelClear = (self.jellyCount == 0 && self.score >= self.levelTarget)? true : false;
                        var levelInfo = configObj.getLevelInfo(self.currentLevel - 1);
                        if(!configObj.levelClear && levelInfo == null)
                            configObj.addItems(self.currentLevel, 0, configObj.currentLevelScore, configObj.levelClear, configObj.currentLevelScore);

                        if(self.total_moves_left == 0){
                            self.bg_sound.stop();
                            self.bg_sound = null;
                            self.setButtonState(false);
                            if(configObj.levelClear){
                                var starCount = Math.floor(configObj.currentLevelScore / self.currentLevelData.targetScore);
                                if(starCount > 3)
                                    starCount = 3;
                                if(levelInfo == null){
                                    configObj.addItems(self.currentLevel, starCount, configObj.currentLevelScore, configObj.levelClear, configObj.currentLevelScore);
                                }
                                else{
                                    if(configObj.currentLevelScore > levelInfo.score){
                                        var totalScore = configObj.currentLevelScore + levelInfo.totalScore;
                                        var obj = {
                                            "levelNo" : self.currentLevel,
                                            "stars"   : starCount,
                                            "score"   : configObj.currentLevelScore,
                                            "levelCleared" : configObj.levelClear,
                                            "totalScore" : totalScore
                                        };
                                        configObj.oldLevelData[self.currentLevel - 1]  = obj;
                                        localStorage.removeItem('levelData');
                                        localStorage.setItem('levelData', JSON.stringify(configObj.oldLevelData));
                                    }
                                }
                            }
                            var monsterUnlocked = self.checkforMonsterUnlock();
                            if(!monsterUnlocked){
                                configObj.playAudio(self.level_finish, false);
                                if(configObj.levelNo == 50 && configObj.levelClear){
                                    configObj.game.tweens.removeAll();
                                    configObj.game.state.start('GameOver');
                                }

                                else{
                                    if(!configObj.levelClear && levelInfo != null && configObj.currentLevelScore > levelInfo.score){
                                        var totalScore = configObj.currentLevelScore + levelInfo.totalScore;
                                        var obj = {
                                            "levelNo" : self.currentLevel,
                                            "stars"   : starCount,
                                            "score"   : configObj.currentLevelScore,
                                            "levelCleared" : configObj.levelClear,
                                            "totalScore" : totalScore
                                        };
                                        configObj.oldLevelData[self.currentLevel - 1]  = obj;
                                        localStorage.removeItem('levelData');
                                        localStorage.setItem('levelData', JSON.stringify(configObj.oldLevelData));
                                    }
                                    configObj.game.tweens.removeAll();
                                    configObj.game.state.start('LevelUp');
                                }
                            }
                        }
                        else{
                            self.setButtonState(false);
                            self.gridStartYPos = configObj.gridStartYPos;
                            configObj.game.time.events.remove(self.hintLoopEvent);
                            configObj.game.tweens.removeAll();
                            self.initialize();
                            self.generateRandomNo();
                        }
                    }
                });
            }
        }
    },
    closePopUpUnlock : function(container){
        this.close_Unlockbtn.inputEnabled = false;
        this.setButtonState(true);
        var anim = configObj.game.add.tween(container.scale).to({ x: 0.5, y: 0.5}, 400, Phaser.Easing.Back.In, true);
        configObj.game.add.tween(container.position).to({ x: 0, y: 0}, 400, Phaser.Easing.Back.In, true);
        var self = this;
        anim.onComplete.add(function(){
            container.destroy(true);
            configObj.playAudio(self.level_finish, false);
            if(configObj.levelClear){
                if(self.bg_sound){
                    self.bg_sound.stop();
                    self.bg_sound = null;
                }
                if(configObj.levelNo == 50){
                    configObj.game.tweens.removeAll();
                    configObj.game.state.start('GameOver');
                }
                else{
                    configObj.game.tweens.removeAll();
                    configObj.game.state.start('LevelUp');
                }
            }
        });
    },

    replaceValue : function(val){
        var temp = Math.floor(Math.random() * 6);
        while(temp == val){
            temp = Math.floor(Math.random() * 6);
        }
        return temp;
    },
    mouseMoveCallBack : function(){
        if(this.selectedMonster != null && this.MonsterState != "moving"){
            this.selectedMonsterPos = this.monsterContainer.indexOf(this.selectedMonster);
            var rowNo = Math.floor(this.selectedMonsterPos / configObj.totalRows);
            var colNo = this.selectedMonsterPos % configObj.totalCols;
            var xDiff = this.mouseDownX - this.mouseUpX;
            var yDiff = this.mouseDownY - this.mouseUpY;
            if(this.MonsterState == "stady" && (this.mouseDownX != this.mouseUpX || this.mouseDownY != this.mouseUpY)){
                var xDiff = Math.abs(this.mouseDownX - configObj.game.input.activePointer.x);
                var yDiff = Math.abs(this.mouseDownY - configObj.game.input.activePointer.y);
                if(this.mouseDownX > 0 || this.mouseDownY > 0){

//         Direction Left/Right
                    if(xDiff > yDiff && xDiff >= this.thresHold){
//                Left Direction
                        if(this.mouseDownX > configObj.game.input.activePointer.x){
                            if(colNo - 1 >= 0){
                                this.swapMonsters("left", this.selectedMonsterPos);
                            }
                        }
                        else{
//                    Right direction
                            if(colNo + 1 < configObj.totalCols){
                                this.swapMonsters("right", this.selectedMonsterPos);
                            }
                        }
                        this.mouseDownX = this.mouseDownY = 0;
                    }
//          Direction Up/Down
                    else if(yDiff >= this.thresHold){

                        if(this.mouseDownY > configObj.game.input.activePointer.y){
//                  Upward Direction
                            if(rowNo - 1 >= 0){
                                this.swapMonsters("up", this.selectedMonsterPos);
                            }
                        }
                        else{
//                    Downward Direction
                            if(rowNo + 1 < configObj.totalRows){
                                this.swapMonsters("down", this.selectedMonsterPos);
                            }
                        }
                        this.mouseDownX = this.mouseDownY = 0;
                    }
                }
            }
            else{
                this.selectedMonster = null;
                this.startHintTimer = true;
            }
        }
    },
    mouseDownCallBack : function(obj){
        configObj.game.time.events.remove(this.hintLoopEvent);
        this.startHintTimer = false;
        if(this.MonsterState == "stady" && obj.monsterType != "block"){
            if(this.inGameTutorial && !this.textAnimation && this.hintArray.length > 0){
                configObj.game.tweens.removeAll();
            }

            for(var i = 0; i < this.hintArray.length; i++){
                var tempIndex = this.hintArray[i];
                this.monsterContainer[tempIndex].scale.y = 1;
                this.monsterContainer[tempIndex].y = configObj.objYPositionContainer[tempIndex];
            }
            this.hintArray.splice(0, this.hintArray.length);
            this.hintTimer = 0;
            this.matchesFound = false;
            this.selectedMonster = obj;
            this.mouseDownX = configObj.game.input.activePointer.x;
            this.mouseDownY = configObj.game.input.activePointer.y;
        }
        if(this.powerUpUsedFlag != "addMoreMoves" && this.selectedMonster != null){
            var tempArr = new Array();
            if(this.powerUpUsedFlag == "universal" && this.selectedMonster.monsterType != "universal"){
                this.MonsterState = "moving";
                this.universalPowerBtn.freezeFrames = false;
                this.universalPowerBtn.setFrames(0, 0, 1, 0);
                var pos = this.monsterContainer.indexOf(this.selectedMonster);
                var type = this.monsterContainer[pos].monsterType;
                var imgId = this.monsterContainer[pos].imageId;
                this.scoreId = imgId;
                this.monsterContainer[pos].destroy();
                this.monsterContainer[pos] = configObj.game.add.sprite(this.selectedMonster.x , this.selectedMonster.y, "universal");
                this.monsterContainer[pos].imageId = imgId;
                this.monsterContainer[pos].monsterType = type;
                this.monsterContainer[pos].anchor.setTo(1, 1);
                this.monsterFrenzyAnim(pos, imgId);
                this.selectedMonster = null;
                this.powerUpUsedFlag = null;
                var count = configObj.updatePowerUp('universal');
                if(count >= 0){
                    this.universalPowerUpCount.text = ""+count;
                }
            }
            else if(this.powerUpUsedFlag == "powerUpRing" && this.selectedMonster.monsterType != "universal"){
                this.MonsterState = "moving";
                this.ringPowerBtn.freezeFrames = false;
                this.ringPowerBtn.setFrames(0, 0, 1, 0);
                this.ringImg = configObj.game.add.sprite(this.selectedMonster.x - 70 , this.selectedMonster.y - 70, "spriteAtlas", "powerUpRing.png");
                var ringAnim = configObj.game.add.tween(this.ringImg.scale).to({x : 2, y : 2}, 350, Phaser.Easing.Bounce.Out);
                var ringAnim1 = configObj.game.add.tween(this.ringImg.scale).to({x : 1.2, y : 1.2}, 350, Phaser.Easing.Bounce.Out);
                ringAnim.chain(ringAnim1);
                ringAnim.start();
                this.scoreId = this.selectedMonster.imageId;
                var self = this;
                this.powerUpUsedFlag = null;
                ringAnim1.onComplete.add(function(){
                    configObj.playAudio(self.punch,false);
                    self.ringImg.destroy();
                    var pos = self.monsterContainer.indexOf(self.selectedMonster);
                    if(self.selectedMonster.monsterType == "super"){
                        configObj.playAudio(self.powermonster, false);
                        self.addHorizontalEffect(self.selectedMonster, self.selectedMonster.imageId);
                        self.addVerticalEffect(self.selectedMonster, self.selectedMonster.imageId);
                        self.addStarsHorizontal(self.selectedMonster.x, self.selectedMonster.y - 40, self.selectedMonster.imageId);
                        self.scoreId = self.selectedMonster.imageId;
                        self.powerUpActivated = true;
                        self.scoreMultiplier = 20;
                        var rowStartPos = Math.floor(pos/7) * configObj.totalRows;
                        var rowEndPos = rowStartPos + configObj.totalRows;
                        tempArr.push(self.selectedMonster);
                        for(var m = rowStartPos; m < rowEndPos; m++){
                            if(self.monsterContainer[m].monsterType != "block"){
                                tempArr.push(self.monsterContainer[m]);
                            }
                        }
                        var colPos = self.monsterContainer.indexOf(self.selectedMonster) % 7;
                        for(var m = colPos; m < self.containerSize; m += 7){
                            if(self.monsterContainer[m].monsterType != "block")
                                tempArr.push(self.monsterContainer[m]);
                        }
                    }
                    else{
                        tempArr.push(self.selectedMonster);
                    }
                    self.clearMatchedElements(tempArr);
                    self.selectedMonster = null;
                    self.powerUpUsedFlag = null;
                });
                var count = configObj.updatePowerUp('powerUpRing');
                if(count >= 0){
                    this.ringPowerUpCount.text = ""+count;
                }
            }
            else if(this.selectedMonster.monsterType == "universal" && this.powerUpActivated){
                this.selectedMonster = null;
                this.powerUpUsedFlag = null;
                this.powerUpActivated = false;
                tempArr.splice(0, tempArr.length);
                this.ringPowerBtn.freezeFrames = false;
                this.universalPowerBtn.freezeFrames = false;
                this.universalPowerBtn.setFrames(0, 0, 1, 0);
                this.ringPowerBtn.setFrames(0, 0, 1, 0);
                this.setButtonState(true);
            }
        }
    },
    mouseUpCallBack : function(){
        this.mouseUpX = configObj.game.input.activePointer.x;
        this.mouseUpY = configObj.game.input.activePointer.y;
//        if(this.mouseDownX == this.mouseUpX || this.mouseDownY == this.mouseUpY){
//            this.selectedMonster = null;
//            this.startHintTimer = true;
//            this.hintArray.splice(0, this.hintArray.length);
//            this.hintTimer = 0;
//        }
    },
    swapMonsters : function(direction, index){
        switch(direction){
            case "left":
                this.swapperMonster = this.monsterContainer[index - 1];
                this.swapperMonsterPos = index - 1;
                break;

            case "right":
                this.swapperMonster = this.monsterContainer[index + 1];
                this.swapperMonsterPos = index + 1;
                break;

            case "up":
                this.swapperMonster = this.monsterContainer[index - configObj.totalRows];
                this.swapperMonsterPos = index - configObj.totalRows;
                break;

            case "down":
                this.swapperMonster = this.monsterContainer[index + configObj.totalRows];
                this.swapperMonsterPos = index + configObj.totalRows;
                break;
        }
        this.changePosition(this.selectedMonster, index, this.swapperMonster, this.swapperMonsterPos);
    },
    changePosition : function(obj1, obj1Index, obj2, obj2Index){

        if(this.MonsterState == "stady" && (obj1.monsterType != "block" && obj2.monsterType != "block")){
            configObj.playAudio(this.swipe_sound);
            this.MonsterState = "moving";
            configObj.game.add.tween(obj1).to({x: obj2.x, y: configObj.objYPositionContainer[obj2Index]}, 180, null, true);
            var tween = configObj.game.add.tween(obj2).to({x: obj1.x, y: configObj.objYPositionContainer[obj1Index]}, 180, null, true);
            var temp = obj1;
            this.monsterContainer[this.selectedMonsterPos] = obj2;
            this.monsterContainer[this.swapperMonsterPos] = temp;
            this.selectedMonsterPos = this.monsterContainer.indexOf(this.selectedMonster);
            this.swapperMonsterPos = this.monsterContainer.indexOf(this.swapperMonster);
            var self = this;
            tween.onComplete.add(function(){
                if(self.selectedMonster.monsterType != "universal" && self.swapperMonster.monsterType != "universal"){
                    self.checkforMatches();
                }
                else if(self.selectedMonster.monsterType == "universal" && self.swapperMonster.monsterType == "universal"){
                    self.resetPosition(self.selectedMonster, self.swapperMonster);
                }
                else{
                    this.powerUpActivated = true;
                    self.deleteSameType(obj1, obj2);
                }
            }, this);
        }
    },
    resetPosition : function(obj1, obj2){
        this.selectedMonster = null;
        configObj.playAudio(this.resetPos_sound);
        configObj.game.add.tween(obj1).to({x: obj2.x, y: obj2.y}, 180, null, true);
        var tween = configObj.game.add.tween(obj2).to({x: obj1.x, y: obj1.y}, 180, null, true);
        var temp = obj1;
        this.monsterContainer[this.selectedMonsterPos] = obj2;
        this.monsterContainer[this.swapperMonsterPos] = temp;
        this.selectedMonsterPos = this.monsterContainer.indexOf(this.selectedMonster);
        this.swapperMonsterPos = this.monsterContainer.indexOf(this.swapperMonster);
        var self = this;
        tween.onComplete.add(function(){
            self.MonsterState = "stady";
            self.hintTimer = 0;
            self.startHintTimer = true;
        });
    },
    checkforMatches : function(){
        var matches = new Array();
        var selId = this.selectedMonster.imageId;
        var selIndex = this.selectedMonsterPos;
        var selRowNo = Math.floor(selIndex / 7);
        var selColNo = selIndex % 7;
        var swapperId = this.swapperMonster.imageId;
        var swapperIndex = this.swapperMonsterPos;
        var swapperRowNo = Math.floor(swapperIndex / configObj.totalCols);
        var swapperColNo = swapperIndex % configObj.totalCols;

//       Horizontal  Matches for monster
        this.checkHorizontalValuesInGrid(this.selectedMonster, selId, selColNo, selRowNo, selIndex, this.selectedMatchesArr);
        this.checkHorizontalValuesInGrid(this.swapperMonster, swapperId, swapperColNo, swapperRowNo, swapperIndex, this.swapperMatchesArr);

        if(this.horizontalMatchedMonsterArray.length >= 3){
            matches = this.horizontalMatchedMonsterArray;
        }
//       Vertical Matches for Monster
        this.checkVerticalValuesInGrid(this.selectedMonster, selId, selColNo, selRowNo, selIndex, this.selectedMatchesArr);
        this.checkVerticalValuesInGrid(this.swapperMonster, swapperId, swapperColNo, swapperRowNo, swapperIndex, this.swapperMatchesArr);
        if(this.selectedMatchesArr.length >= 4){
            this.checkforPowerUp(this.selectedMatchesArr, this.selectedMonsterPos, this.selectedMatchesArr[0].imageId);
        }
        if(this.swapperMatchesArr.length >= 4){
            this.checkforPowerUp(this.swapperMatchesArr, this.swapperMonsterPos, this.swapperMatchesArr[0].imageId);
        }
        if(this.verticalMatchedMonsterArray.length >= 3){
            matches = matches.concat(this.verticalMatchedMonsterArray);
        }
        if(matches.length >= 3){
            this.clearMatchedElements(matches);
            this.updateMoves();
        }
        if(this.verticalMatchedMonsterArray.length < 3 && this.horizontalMatchedMonsterArray.length < 3 && this.matchesFound == false){
            this.resetPosition(this.selectedMonster, this.swapperMonster);
            this.horizontalMatchedMonsterArray.splice(0, this.horizontalMatchedMonsterArray.length);
            this.selectedMatchesArr.splice(0, this.selectedMatchesArr.length);
            this.swapperMatchesArr.splice(0, this.swapperMatchesArr.length);
            this.verticalMatchedMonsterArray.splice(0, this.verticalMatchedMonsterArray.length);
            return;
        }
    },
    deleteSameType : function(obj1, obj2){
        this.scoreMultiplier = 90;
        var universalMonster, swapperMonster;
        var matchesArr = new Array();
        var superMatches = new Array();
        if(obj1.monsterType == "universal"){
            universalMonster = obj1;
            swapperMonster = obj2;
        }
        else{
            universalMonster = obj2;
            swapperMonster = obj1;
        }
        matchesArr.push(universalMonster);
        for(var i = 0; i < this.containerSize; i++){
            if(swapperMonster.imageId == this.monsterContainer[i].imageId){
                if(this.monsterContainer[i].monsterType == "super"){
                    configObj.playAudio(this.powermonster, false);
                    this.addHorizontalEffect(this.monsterContainer[i], this.monsterContainer[i].imageId);
                    this.addVerticalEffect(this.monsterContainer[i], this.monsterContainer[i].imageId);
                    this.addStarsHorizontal(this.monsterContainer[i].x, this.monsterContainer[i].y - 40, this.monsterContainer[i].imageId);
                    this.powerUpActivated = true;
                    this.scoreMultiplier = 20;
                    var rowStartPos = Math.floor(i/7) * configObj.totalRows;
                    var rowEndPos = rowStartPos + configObj.totalRows;
                    for(var m = rowStartPos; m < rowEndPos; m++){
                        if(this.monsterContainer[m].monsterType != "block"){
                            superMatches.push(this.monsterContainer[m]);
                        }
                    }
                    var colPos = i % 7;
                    for(var m = colPos; m < this.containerSize; m += 7){
                        if(this.monsterContainer[m].monsterType != "block")
                            superMatches.push(this.monsterContainer[m]);
                    }
                }
                if(superMatches.indexOf(this.monsterContainer[i]) == -1 && matchesArr.indexOf(this.monsterContainer[i]) == -1){
                    matchesArr.push(this.monsterContainer[i]);
                }
            }
        }
        this.scoreId = swapperMonster.imageId;
        this.drawElectricEffect(matchesArr, this.scoreId);
        this.updateMoves();
        var finalClear = matchesArr.concat(superMatches);
        this.clearMatchedElements(finalClear);
    },
    drawElectricEffect : function(matchesArr, imgId){
        this.lineArr.splice(0, this.lineArr.length);
        var colorCode = ["#9b4a1c", "#25acad", "#ffa30d", "#fa6100", "#6b7c90", "#d32959"];
        this.colorCode = colorCode[imgId];
        var bmd = configObj.game.add.bitmapData(configObj.game.width, configObj.game.height);
        for(var i = 1 ;i < matchesArr.length; i++){
            bmd.context.beginPath();
            bmd.context.moveTo(matchesArr[0].x - 40, matchesArr[0].y- 30);
            bmd.context.lineTo(matchesArr[i].x - 40, matchesArr[i].y - 30);
            bmd.context.strokeStyle = this.colorCode;
            bmd.context.lineWidth = 2;
            bmd.context.stroke();
            this.lineArr[i] =  configObj.game.add.sprite(0, 0, bmd);
            var temp = this.lineArr[i];
            var tween = configObj.game.add.tween(temp).to({alpha : 0.3}, 60, null, true, 0, 3, true);
            tween.onComplete.add(function(temp){
                temp.destroy(true);
            });
        }
        configObj.playAudio(this.powermonster, false);
    },
    updateMoves : function(){
        this.total_moves_left -= 1;
        if(configObj.isDevice)
            this.levelMovesText.text =  "Moves\n " + this.total_moves_left;
        else
            this.levelMovesText.text =  "Moves " + this.total_moves_left;
    },
    updateScore : function(totalMatches, id){
        this.score += this.scoreMultiplier * totalMatches;
        var currScore = this.scoreMultiplier * totalMatches;
        if(totalMatches >= 3 && !this.powerUpActivated){
            var num = (totalMatches == 4 || totalMatches == 5) ? 2 : 1;
            this.animateScore(currScore, 'score'+id, this.monsterContainer[this.removedPos[num]]);
        }
        else if(this.powerUpActivated){
            this.powerUpActivated = false;
            this.animateScore(this.scoreMultiplier, 'score'+id, this.removedPos);
        }
        if(configObj.isDevice)
            this.levelScoreText.text = "Score \n" + this.score;
        else
            this.levelScoreText.text = "Score " + this.score;
        this.checkStars(this.scoreMultiplier * totalMatches, this.score);
        configObj.levelClear = (this.score >= this.levelTarget && this.jellyCount == 0) ? true : false;
    },
    checkStars : function(currScore, levelScore){
        var star =   Math.floor(levelScore/ this.levelTarget);
        var starPos;
        if(configObj.isDevice){
            starPos = 55 * star;
            var divisor = this.levelTarget/54.5;
            var xDiff = currScore/divisor;

            this.progressBar.x = this.progressBar.x + xDiff  <= 200 ? this.progressBar.x + xDiff : 200;
            if(this.starCounter < star && star < 4 && star > 0){
                var blankStar = this.blankStarArr[star - 1];
//            this.footerLayer.remove(this.blankStarArr[star - 1]);
                this.blankStarLayer.add(blankStar);
                this.starCounter = star;
                this.animateText(""+this.starCounter);
                configObj.game.add.sprite(115 + starPos, 49, "spriteAtlas1", "inGamestar.png").anchor.setTo(0.5, 0.5);
            }
        }
        else{
            starPos = 55 * star;
            var divisor = this.levelTarget/55;
            var xDiff = currScore/divisor;
            this.progressBar.x = this.progressBar.x + xDiff <= 973 ? this.progressBar.x + xDiff : 973;
            if(this.starCounter < star && star < 4 && star > 0){
                this.starCounter = star;
                this.animateText(""+this.starCounter);
                configObj.game.add.sprite(890 + starPos, 105, "spriteAtlas1", "inGamestar.png").anchor.setTo(0.5, 0.5);
            }
        }
    },
    animateScore : function(value, scoreImg, arr){
        var digits = value.toString().split('');
        var numContainer = configObj.game.add.group();
        var xDiff = 0;
        if(arr instanceof Array){
            for(var i = 0; i < arr.length; i++){
                xDiff = 0;
                for(var j = 0; j < digits.length; j++){
                    var num = parseInt(digits[j]);
                    var numImg = configObj.game.add.sprite(this.monsterContainer[arr[i]].x - 45 + xDiff, this.monsterContainer[arr[i]].y, ''+scoreImg, num);
                    numContainer.add(numImg);
                    numImg.scale.x = 0.9;
                    numImg.scale.y = 0.9;
                    numImg.anchor.setTo(1,1);
                    var tween = configObj.game.add.tween(numImg).to({alpha : 0}, 400, null, true, 100);
                    var tween1 = configObj.game.add.tween(numImg).to({y : numImg.y - 40}, 400, null, true);
                    tween.chain(tween1);
                    tween.start();
                    tween1.onComplete.add(function(){
                        numContainer.destroy(true);
                    });
                    xDiff += 35;
                }
            }
        }
        else{
            for(var j = 0; j < digits.length; j++){
                var num = parseInt(digits[j]);
                var numImg = configObj.game.add.sprite(arr.x - 45 + xDiff, arr.y, ''+scoreImg, num);
                numContainer.add(numImg);
                numImg.scale.x = 0.9;
                numImg.scale.y = 0.9;
                numImg.anchor.setTo(1,1);
                var tween = configObj.game.add.tween(numImg).to({alpha : 0}, 400, null, true, 100);
                var tween1 = configObj.game.add.tween(numImg).to({y : numImg.y - 40}, 400, null, true);
                tween.chain(tween1);
                tween.start();
                tween1.onComplete.add(function(){
                    numContainer.destroy(true);
                });
                xDiff += 35;
            }
        }

    },
    checkHorizontalValuesInGrid : function(Obj, Id, colNo, rowNo, index, arr){
        var matchedArr = new Array();
        var incrementFactor = -1;
        matchedArr.push(Obj);
        for(var i = 0; i< 2; i ++){
            inner_loop :
                for(j = 1; j < 3; j++){
                    var pos = index + (incrementFactor * j);
                    if(pos >= 0 && this.monsterContainer[pos] != undefined && this.monsterContainer[pos].imageId == Id &&
                        ((colNo + (j * incrementFactor) >= 0) && (colNo + (j * incrementFactor) < configObj.totalCols))){
                        matchedArr.push(this.monsterContainer[pos]);
                    }
                    else{
                        break inner_loop;
                    }
                }
            incrementFactor = 1;
        }
        var rowStartPos = rowNo * configObj.totalRows;
        var rowEndPos = rowStartPos + configObj.totalRows;
        if(matchedArr.length >= 3){
            this.scoreId = Id;
            for(var k = 0; k < matchedArr.length; k++){
                if(matchedArr[k].monsterType == "super"){
                    configObj.playAudio(this.powermonster, false);
                    this.addHorizontalEffect(matchedArr[k], matchedArr[k].imageId);
                    this.addVerticalEffect(matchedArr[k], matchedArr[k].imageId);
                    this.addStarsHorizontal(matchedArr[k].x, matchedArr[k].y - 40, matchedArr[k].imageId);
                    this.powerUpActivated = true;
                    this.scoreMultiplier = 20;
                    for(var m = rowStartPos; m < rowEndPos; m++){
                        if(this.monsterContainer[m].monsterType != "block"){
                            this.horizontalMatchedMonsterArray.push(this.monsterContainer[m]);
                        }
                    }
                    var colPos = this.monsterContainer.indexOf(matchedArr[k]) % 7;
                    for(var m = colPos; m < this.containerSize; m += 7){
                        if(this.monsterContainer[m].monsterType != "block")
                            this.horizontalMatchedMonsterArray.push(this.monsterContainer[m]);
                    }
                    matchedArr.splice(0, matchedArr.length);
                    break;
                }
            }
        }
        if(matchedArr.length >= 3){
            this.scoreId = Id;
            this.scoreMultiplier = 30;
            for(var j = 0; j < matchedArr.length; j++){
                this.horizontalMatchedMonsterArray.push(matchedArr[j]);
                if(arr.indexOf(matchedArr[j]) == -1)
                    arr.push(matchedArr[j]);
            }
        }
        matchedArr.splice(0, matchedArr.length);
        if(this.horizontalMatchedMonsterArray.length < 3){
            this.horizontalMatchedMonsterArray.splice(0, this.horizontalMatchedMonsterArray.length);
        }
    },
    addHorizontalEffect : function(obj, id){
        var effect1 = configObj.game.add.sprite(obj.x - 65, obj.y - 50, "spriteAtlas1", "effect"+id+".png");
        this.effectLayer.add(effect1);
        var effect2 = configObj.game.add.sprite(obj.x - 10, obj.y - 50, "spriteAtlas1", "effect"+id+".png");
        this.effectLayer.add(effect2);
        effect2.scale.x = -1;
        var effect1Tween1 = configObj.game.add.tween(effect1.scale).to({x : 6}, 300, null);
        var effect1Tween2 = configObj.game.add.tween(effect1).to({alpha : 0}, 300, null);
        effect1Tween1.chain(effect1Tween2);
        effect1Tween1.start();

        var effect2Tween1 = configObj.game.add.tween(effect2.scale).to({x : -6}, 300, null);
        var effect2Tween2 = configObj.game.add.tween(effect2).to({alpha : 0}, 300, null);
        effect2Tween1.chain(effect2Tween2);
        effect2Tween1.start();

        effect2Tween1.onComplete.add(function(){
            effect1.destroy(true);
            effect2.destroy(true);
            effect1 = effect2 = null;
        });
    },
    addVerticalEffect : function(obj, id){
        var effect1 = configObj.game.add.sprite(obj.x - 22, obj.y - 50, "spriteAtlas1", "effect"+id+".png");
        effect1.angle = 90;
        this.effectLayer.add(effect1);
        var effect2 = configObj.game.add.sprite(obj.x - 60, obj.y - 15, "spriteAtlas1", "effect"+id+".png");
        this.effectLayer.add(effect2);
        effect2.angle = -90;
        var effect1Tween1 = configObj.game.add.tween(effect1.scale).to({x : 10}, 300, null);
        var effect1Tween2 = configObj.game.add.tween(effect1).to({alpha : 0}, 300, null);
        effect1Tween1.chain(effect1Tween2);
        effect1Tween1.start();

        var effect2Tween1 = configObj.game.add.tween(effect2.scale).to({x : 10}, 300, null);
        var effect2Tween2 = configObj.game.add.tween(effect2).to({alpha : 0}, 300, null);
        effect2Tween1.chain(effect2Tween2);
        effect2Tween1.start();

        effect2Tween1.onComplete.add(function(){
            effect1.destroy(true);
            effect2.destroy(true);
            effect1 = effect2 = null;
        });
    },
    addStarsHorizontal: function (x, y, type) {
        var startY = y - 30;
        var endY = y + 30;
        for (var i = 0; i < 6; i++) {
            var starX = x - i * 30;
            var starY = Math.random() * (endY - startY) + startY;
            var effect1 = configObj.game.add.sprite(starX , starY, "spriteAtlas1", "starEffect"+type+".png");
            effect1.alpha = 0;
            var effect1Tween1 = configObj.game.add.tween(effect1).to({alpha : 1}, 220, null, true, (6 - i) * 20);
            effect1Tween1.onComplete.add(function(effect1){
                effect1.destroy(true);
            });
        }
        for (var i = 0; i < 6; i++) {
            var starX = x + i * 30;
            var starY = Math.random() * (endY - startY) + startY;
            var effect1 = configObj.game.add.sprite(starX , starY, "spriteAtlas1", "starEffect"+type+".png");
            effect1.alpha = 0;
            var effect1Tween1 = configObj.game.add.tween(effect1).to({alpha : 1}, 220, null, true, (6 - i) * 20);
            effect1Tween1.onComplete.add(function(effect1){
                effect1.destroy(true);
            });
        }
    },
    addStarsVertical: function (x, y, type) {
        var startX = x - 30;
        var endX = x + 30;
        for (var i = 0; i < 6; i++) {
            var starX = Math.random() * (endX - startX) + startX;
            var starY = y - i * 30;
            var effect1 = configObj.game.add.sprite(starX , starY, "spriteAtlas1", "starEffect"+type+".png");
            effect1.alpha = 0;
            var effect1Tween1 = configObj.game.add.tween(effect1).to({alpha : 1}, 150, null, true, (6 - i) * 20);
            effect1Tween1.onComplete.add(function(effect1){
                effect1.destroy(true);
            });
        }
        for (var i = 0; i < 6; i++) {
            var starX = Math.random() * (endX - startX) + startX;
            var starY = y + i * 30;
            var effect1 = configObj.game.add.sprite(starX , starY, "spriteAtlas1", "starEffect"+type+".png");
            effect1.alpha = 0;
            var effect1Tween1 = configObj.game.add.tween(effect1).to({alpha : 1}, 150, null, true, (6 - i) * 20);
            effect1Tween1.onComplete.add(function(effect1){
                effect1.destroy(true);
            });
        }
    },
    checkVerticalValuesInGrid : function(Obj, Id, colNo, rowNo, index, arr){
        var matchesArr = new Array();
        var incrementFactor = -7;
        matchesArr.push(Obj);
        for(var i = 0; i< 2; i ++){
            inner_loop :
                for(j = 1; j < 3; j++){
                    var pos = index + (incrementFactor * j);
                    if(pos >= 0 && this.monsterContainer[pos] != undefined && this.monsterContainer[pos].imageId == Id &&
                        ((index + (incrementFactor * j) <= 49))){
                        matchesArr.push(this.monsterContainer[pos]);
                    }
                    else{
                        break inner_loop;
                    }
                }
            incrementFactor = 7;
        }

        if(matchesArr.length >= 3){
            this.scoreId = Id;
            for(var k = 0; k < matchesArr.length; k++){
                if(matchesArr[k].monsterType == "super"){
                    configObj.playAudio(this.powermonster, false);
                    this.addHorizontalEffect(matchesArr[k], matchesArr[k].imageId);
                    this.addVerticalEffect(matchesArr[k], matchesArr[k].imageId);
                    this.addStarsVertical(matchesArr[k].x - 50, matchesArr[k].y - 40, matchesArr[k].imageId);
                    this.powerUpActivated = true;
                    this.scoreMultiplier = 20;
                    var rowStartPos = Math.floor(this.monsterContainer.indexOf(matchesArr[k]) / configObj.totalRows) * configObj.totalRows;
                    var rowEndPos = rowStartPos + configObj.totalRows;
                    var colPos = this.monsterContainer.indexOf(matchesArr[k]) % 7;
                    for(var m = rowStartPos; m < rowEndPos; m++){
                        if(this.monsterContainer[m].monsterType != "block")
                            this.verticalMatchedMonsterArray.push(this.monsterContainer[m]);
                    }
                    for(var m = colPos; m < this.containerSize; m += 7){
                        if(this.monsterContainer[m].monsterType != "block")
                            this.verticalMatchedMonsterArray.push(this.monsterContainer[m]);
                    }
                    matchesArr.splice(0, matchesArr.length);
                    break;
                }
            }
        }

        if(matchesArr.length >= 3){
            this.scoreId = Id;
            this.scoreMultiplier = 30;
            for(var j = 0; j < matchesArr.length; j++){
                this.verticalMatchedMonsterArray.push(matchesArr[j]);
                if(arr.indexOf(matchesArr[j]) == -1)
                    arr.push(matchesArr[j]);
            }
        }
        matchesArr.splice(0, matchesArr.length);
        if(this.verticalMatchedMonsterArray.length < 3){
            this.verticalMatchedMonsterArray.splice(0, this.verticalMatchedMonsterArray.length);
        }
    },
    checkforPowerUp : function(arr, pos, id){
        var length = arr.length;
        switch(length){
            case 3:
                break;
            case 4:
                this.powerUpData[pos] = {"imageId" : id,
                    "powerUpType" : "super"};
                this.scoreMultiplier = 60;
                break;
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
            case 10:
                this.powerUpData[pos] = {"imageId" : 6,
                    "powerUpType" : "universal"};
                this.scoreMultiplier = 90;
                break;
        }
    },
    clearMatchedElements : function(arr){
        this.setButtonState(false);
        this.selectedMonster = null;
        this.killAnimationComplete = false;
        this.MonsterState = "moving";
        this.hintTimer = 0;
        this.startHintTimer = false;
        var Id = this.scoreId;
        this.monster_audio = configObj.game.add.audio("monster"+Id);
        configObj.playAudio(this.monster_audio, false);
        for(var i = 0; i < arr.length; i++){
            this.destroyAnimation++;
            var index = this.monsterContainer.indexOf(arr[i]);
            if(this.currentLevelData.jelly.indexOf(index) != -1 && this.jellyBrakedArray.indexOf(index) == -1){
                this.jellyBreakAnimation(this.currentLevelData.jelly.indexOf(index), index);
            }
            if(this.removedPos.indexOf(index) == -1){
                this.removedPos.push(index);
            }
            var self = this;
            var tween = configObj.game.add.tween(arr[i]).to({alpha : 0}, 150, null, true);
            tween.onComplete.add(function(){
                self.destroyAnimationComplete++;
                if(self.destroyAnimation == self.destroyAnimationComplete){
                    self.destroyAnimation = self.destroyAnimationComplete = 0;
                    for(var j = 0; j < arr.length; j++){
                        arr[j].destroy(true);
                    }
                    self.automatedMatchedArray.splice(0, self.automatedMatchedArray.length);
                    self.killAnimationComplete = true;
                }
            });
        }
        this.matchesFound = true;
        this.updateScore(this.removedPos.length, Id);
    },
    jellyBreakAnimation : function(pos, removedPos){
        if(this.jellyCount > 0){
            this.jellyContianer[pos].destroy(true);
            this.jellyBreakContianer[pos].visible = true;
            this.jellyBreakContianer[pos].play('jelly_animation', 18, false);
            this.jellyBrakedArray.push(removedPos);
            var self = this;
            this.tempTimer = configObj.game.time.create(false);
//                Timer set
            this.tempTimer.add(400, function(){
                configObj.playAudio(self.jellybreak);
                configObj.game.time.events.remove(self.tempTimer);
                self.tempTimer = null;
            }, this);
            this.tempTimer.start();

            this.jellyCount --;
        }
        else{
            this.jellyContianer.splice(0, this.jellyContianer.length);
            this.jellyBreakContianer.splice(0, this.jellyContianer.length);
        }
    },
    updateContainer : function(){
        this.horizontalMatchedMonsterArray.splice(0, this.horizontalMatchedMonsterArray.length);
        this.verticalMatchedMonsterArray.splice(0, this.verticalMatchedMonsterArray.length);
        this.automatedMatchedArray.splice(0, this.automatedMatchedArray.length);
        this.selectedMatchesArr.splice(0, this.selectedMatchesArr.length);
        this.swapperMatchesArr.splice(0, this.swapperMatchesArr.length);
        this.startHintTimer = false;
        this.tempTimer1 = configObj.game.time.create(false);
        var self = this;
        this.tempTimer1.add(400, function(){
            configObj.playAudio(self.new_spawnSound);
            configObj.game.time.events.remove(self.tempTimer1);
            self.tempTimer1 = null;
        }, this);
        this.tempTimer1.start();
        var index = 0;
        for(var i = 0; i < configObj.totalRows; i++){
            for(var j = 0; j < configObj.totalCols; j++){
                var selPos = this.removedPos.indexOf(index);
                if(selPos != -1){
                    var pos = index;
                    var prevPos = pos;
                    var xPos =  this.monsterContainer[prevPos].x;
                    var newPos;
                    if(!this.powerUpData.hasOwnProperty(pos)){
                        while(pos - configObj.totalRows >= 0){
                            prevPos = pos - configObj.totalRows;
                            if(this.monsterContainer[prevPos].monsterType == "block" && (prevPos - configObj.totalRows) >= 0){
                                while(this.monsterContainer[prevPos].monsterType == "block")
                                    prevPos -= configObj.totalRows;
                            }
                            newPos = configObj.objYPositionContainer[pos];
                            xPos = this.monsterContainer[prevPos].x;
                            this.monsterContainer[pos] = this.monsterContainer[prevPos];
                            this.tweenToPosition(this.monsterContainer[prevPos], newPos);
                            pos = prevPos;
                        }
                        var imgId = Math.floor(Math.random() * 6);
                        this.spawnNew(prevPos, xPos, configObj.objYPositionContainer[prevPos], "monster", imgId);
                        this.tweenToPosition(this.monsterContainer[prevPos], newPos);
                    }
                    else if(this.powerUpData.hasOwnProperty(pos)){
                        this.spawnNew(pos, xPos, configObj.objYPositionContainer[pos], this.powerUpData[pos].powerUpType, this.powerUpData[pos].imageId);
                        delete this.powerUpData[pos];
                    }
                    this.tweenToPosition(this.monsterContainer[prevPos], configObj.objYPositionContainer[prevPos]);
                }
                index++;
            }
        }
        this.removedPos.splice(0, this.removedPos.length);
    },
    tweenToPosition : function(obj, destY){
        this.setButtonState(false);
        this.startHintTimer = false;
        this.totalPositionUpdateCounter++;
        var self = this;
        var dropAnim = configObj.game.add.tween(obj).to({x : obj.x, y : destY}, 300, Phaser.Easing.Sinusoidal.In);
        var dropAnim1 = configObj.game.add.tween(obj.scale).to({x:1, y:.8}, 100, Phaser.Easing.Sinusoidal.In);
        var dropAnim2 = configObj.game.add.tween(obj.scale).to({x:1, y:1.2}, 100, Phaser.Easing.Sinusoidal.In);
        var dropAnim3 = configObj.game.add.tween(obj.scale).to({x:1, y:1}, 100, Phaser.Easing.Sinusoidal.In);
        dropAnim.chain(dropAnim1);
        dropAnim1.chain(dropAnim2);
        dropAnim2.chain(dropAnim3);
        dropAnim.start();
        dropAnim.onComplete.add(function(){
            self.tweenAnimationCounter++;
            if(self.totalPositionUpdateCounter == self.tweenAnimationCounter){
                self.totalPositionUpdateCounter = 0;
                self.tweenAnimationCounter = 0;
                self.newTimer = configObj.game.time.create(false);
//                Timer set
                self.newTimer.add(100, self.automatedChecking, self);
                self.newTimer.start();
            }
        });
    },
    spawnNew : function(pos, xPos, yPos, type, imageId){
        if(type == "monster" || type == "super"){
            var yP = type == "monster" ? 20 : yPos;
            this.monsterContainer[pos] = configObj.game.add.sprite(xPos, yP, type+imageId);
            this.monsterContainer[pos].loadTexture(type+imageId, 0);
            this.monsterContainer[pos].animations.add('blinkEyes');
            this.monsterContainer[pos].imageId = imageId;
        }
        else if(type == "universal"){
            this.monsterContainer[pos] = configObj.game.add.sprite(xPos, yPos, ""+type);
            this.monsterContainer[pos].imageId = 6;
        }
        this.MonsterLayer.add(this.monsterContainer[pos]);
        this.monsterContainer[pos].inputEnabled = true;
        this.monsterContainer[pos].anchor.setTo(1, 1);
        this.monsterContainer[pos].events.onInputDown.add(this.mouseDownCallBack.bind(this,this.monsterContainer[pos]), this);
        this.monsterContainer[pos].events.onInputUp.add(this.mouseUpCallBack.bind(this,this.monsterContainer[pos]), this);
        this.monsterContainer[pos].monsterType = type;
    },
    automatedChecking : function(){
        var position;
        configObj.game.time.events.remove(this.newTimer);
        this.startHintTimer = false;
        var tempMatchedArr = new Array();
        var horizontalMatchedArr = new Array();
        var verticalMatchedArr = new Array();
//        Horizontal matches
        for(var i = 0; i < this.containerSize; i++){
            var imgId = this.monsterContainer[i].imageId;
            var rowNo = Math.floor(i/7);
            tempMatchedArr.push(this.monsterContainer[i]);
            var nextColPos = i + 1;
            while(nextColPos < this.containerSize && Math.floor(nextColPos/7) == rowNo && this.monsterContainer[nextColPos].imageId == imgId
                && this.monsterContainer[nextColPos].monsterType != "block" && this.monsterContainer[nextColPos].imageId != 6){
                if(tempMatchedArr.indexOf(this.monsterContainer[nextColPos]) == -1){
                    tempMatchedArr.push(this.monsterContainer[nextColPos]);

                }
                i = nextColPos ;
                nextColPos = i + 1;
            }
            if(tempMatchedArr.length >= 3){
                this.scoreId = tempMatchedArr[0].imageId;
                for(var j = 0;j < tempMatchedArr.length;j++){
                    if(tempMatchedArr[j].monsterType == "super"){
                        configObj.playAudio(this.powermonster, false);
                        this.addHorizontalEffect(tempMatchedArr[j], tempMatchedArr[j].imageId);
                        this.addVerticalEffect(tempMatchedArr[j], tempMatchedArr[j].imageId);
                        this.addStarsVertical(tempMatchedArr[j].x - 50, tempMatchedArr[j].y - 40, tempMatchedArr[j].imageId);
                        this.powerUpActivated = true;
                        this.scoreMultiplier = 20;
                        var rowStartPos = Math.floor(this.monsterContainer.indexOf(tempMatchedArr[j])/7) * configObj.totalRows;
                        var rowEndPos = rowStartPos + configObj.totalRows;
                        for(var m = rowStartPos; m < rowEndPos; m++){
                            if(this.monsterContainer[m].monsterType != "block" && this.automatedMatchedArray.indexOf(this.monsterContainer[m]) == -1)
                                this.automatedMatchedArray.push(this.monsterContainer[m]);
                        }
                        var colPos = this.monsterContainer.indexOf(tempMatchedArr[j]) % 7;
                        for(var m = colPos; m < this.containerSize; m += 7){
                            if(this.monsterContainer[m].monsterType != "block" && this.automatedMatchedArray.indexOf(this.monsterContainer[m]) == -1)
                                this.automatedMatchedArray.push(this.monsterContainer[m]);
                        }
                        break;
                    }
                    else{
                        if(this.automatedMatchedArray.indexOf(tempMatchedArr[j]) == -1)
                            this.automatedMatchedArray.push(tempMatchedArr[j]);
                            horizontalMatchedArr.push(tempMatchedArr[j]);
                    }
                }
                if(tempMatchedArr.length >= 4){
                    var pos = this.monsterContainer.indexOf(tempMatchedArr[0]);
                    this.checkforPowerUp(tempMatchedArr, pos, tempMatchedArr[0].imageId);
                }
            }
            tempMatchedArr.splice(0, tempMatchedArr.length);
        }
//        Vertical matches
        for(var i = 0; i < this.containerSize; i++){
            var imgId1= this.monsterContainer[i].imageId;
            var pos = i;
            var colNo = i % 7;
            tempMatchedArr.push(this.monsterContainer[i]);
            var nextRowPos = i + 7;

            while(nextRowPos % 7 == colNo && nextRowPos < this.containerSize && this.monsterContainer[nextRowPos].imageId == imgId1
                && this.monsterContainer[nextRowPos].monsterType != "block" && this.monsterContainer[nextRowPos].imageId != 6){
                if(tempMatchedArr.indexOf(this.monsterContainer[nextRowPos]) == -1 &&
                    verticalMatchedArr.indexOf(this.monsterContainer[nextRowPos]) == -1){
                        tempMatchedArr.push(this.monsterContainer[nextRowPos]);
                        verticalMatchedArr.push(this.monsterContainer[nextRowPos]);
                }
                pos = nextRowPos ;
                nextRowPos = pos + 7;
            }
            if(tempMatchedArr.length >= 3){
                this.scoreId = tempMatchedArr[0].imageId
                for(var j = 0;j < tempMatchedArr.length;j++){
                    if(tempMatchedArr[j].monsterType == "super"){
                        configObj.playAudio(this.powermonster, false);
                        this.addHorizontalEffect(tempMatchedArr[j], tempMatchedArr[j].imageId);
                        this.addVerticalEffect(tempMatchedArr[j], tempMatchedArr[j].imageId);
                        this.addStarsVertical(tempMatchedArr[j].x - 50, tempMatchedArr[j].y - 40, tempMatchedArr[j].imageId);
                        this.powerUpActivated = true;
                        this.scoreMultiplier = tempMatchedArr.length == 3 ? 30 : 20;
                        var rowStartPos = Math.floor(this.monsterContainer.indexOf(tempMatchedArr[j])/7) * configObj.totalRows;
                        var rowEndPos = rowStartPos + configObj.totalRows;
                        for(var m = rowStartPos; m < rowEndPos; m++){
                            if(this.monsterContainer[m].monsterType != "block" && this.automatedMatchedArray.indexOf(this.monsterContainer[m]) == -1)
                                this.automatedMatchedArray.push(this.monsterContainer[m]);
                        }
                        var colPos = this.monsterContainer.indexOf(tempMatchedArr[j]) % 7;
                        for(var m = colPos; m < this.containerSize; m += 7){
                            if(this.monsterContainer[m].monsterType != "block" && this.automatedMatchedArray.indexOf(this.monsterContainer[m]) == -1)
                                this.automatedMatchedArray.push(this.monsterContainer[m]);
                        }
                        break;
                    }
                    else{
                        if(this.automatedMatchedArray.indexOf(tempMatchedArr[j]) == -1){
                            this.automatedMatchedArray.push(tempMatchedArr[j]);
                        }
                    }
                }
                if(tempMatchedArr.length >= 3){
                    var pos = this.monsterContainer.indexOf(tempMatchedArr[0]);
                    this.checkforPowerUp(tempMatchedArr, pos, tempMatchedArr[0].imageId);
                    for(var x = 0; x < tempMatchedArr.length; x++){
                        if(horizontalMatchedArr.indexOf(tempMatchedArr[x]) != -1){
                            var remPos = this.monsterContainer.indexOf(tempMatchedArr[0]);
                            if(this.powerUpData.hasOwnProperty(remPos)){
                                delete this.powerUpData[remPos];
                            }
                            position = this.monsterContainer.indexOf(tempMatchedArr[x]);
                            for(var index in this.powerUpData){
                                var temp = parseInt(index);
                                if(temp >= position - 3 && temp <= position + 3){
                                    delete this.powerUpData[temp];
                                }
                            }
                            this.powerUpData[position] = {"imageId" : 6,
                                                          "powerUpType" : "universal"};
                            this.scoreMultiplier = 90;
                        }
                    }

                }
            }
            tempMatchedArr.splice(0, tempMatchedArr.length);
        }
        horizontalMatchedArr.splice(0, horizontalMatchedArr.length);
        verticalMatchedArr.splice(0, horizontalMatchedArr.length);
        if(this.automatedMatchedArray.length >= 3){
            this.scoreId = this.automatedMatchedArray[0].imageId;
            this.setButtonState(false);
            this.scoreMultiplier = this.powerUpActivated ? 20 : 30;
            this.MonsterState = "moving";
            this.groupFormed++;
            this.clearMatchedElements(this.automatedMatchedArray);
        }
        else{
            this.setButtonState(true);
            this.hintTimer = 0;
            this.startHintTimer = true;
            if(this.inGameTutorial)
                this.MonsterState = "stady";
            if(this.total_moves_left == 0){
                var achievement = this.checkForBadgeUnlock();
                if(!achievement)
                    this.endDropAnim();
            }
            else if(this.total_moves_left > 0 && configObj.levelClear){
                this.MonsterState = "moving";

                this.startHintTimer = false;
                if(!this.monsterFrenzyAnimFlag)
                    var achievement = this.checkForBadgeUnlockOnTargetComplete();
                if(!achievement)
                    this.monsterFrenzy();
            }
            if(this.groupFormed > 0 && !configObj.levelClear){
                switch (this.groupFormed){
                    case 2 :
                        this.animateText("excellent");
                        this.groupFormed = 0;
                        break;
                    case 3:
                        this.animateText("awesom");
                        this.groupFormed = 0;
                        break;
                    case 4:
                        this.animateText("magnificent");
                        this.groupFormed = 0;
                        break;
                    case 5:
                        this.animateText("fascinating");
                        this.groupFormed = 0;
                        break;
                }
            }
        }
    },
    animateText : function(img){
        this.textAnimation = true;
        var textEffect = configObj.game.add.sprite(configObj.percentOfWidth(0.5), 480, "spriteAtlas1", img+".png");
        textEffect.anchor.setTo(0.5, 0.5);
        var tween = configObj.game.add.tween(textEffect).to({alpha : 0}, 600, Phaser.Easing.Sinusoidal.In, true, 200);
        var tween1 = configObj.game.add.tween(textEffect).to({y : textEffect.y - 40}, 600, null, true);
        tween.chain(tween1);
        tween.start();
        var self = this;
        tween1.onComplete.add(function(){
            self.textAnimation = false;
            textEffect.destroy(true);
        });
    },
    monsterFrenzy : function(){
        if(configObj.levelClear){
            this.setButtonState(false);
            if(!this.monsterFrenzyAnimFlag){
                this.animateText("target achieved");
                this.monsterFrenzyAnimFlag = true;
                this.FrenzyImage = configObj.game.add.sprite(configObj.percentOfWidth(0.50), 450, "spriteAtlas1", "frenzy.png");
                this.FrenzyImage.anchor.setTo(0.5, 0.5);
                this.FrenzyImage.scale.x = 0;
                this.FrenzyImage.scale.y = 0;
                this.FrenzyImage.rotation = 0;
                var frenzyTween = configObj.game.add.tween(this.FrenzyImage).to({angle : 360}, 800, Phaser.Easing.Elastic.Out, false, 200);
                var frenzyTween1 = configObj.game.add.tween(this.FrenzyImage.scale).to({x : 1, y : 1}, 700, Phaser.Easing.Elastic.Out, false, 200);
                frenzyTween.chain(frenzyTween1);
                frenzyTween.start();
                var self = this;
                frenzyTween1.onComplete.add(function(){
                    self.FrenzyImage.destroy(true);
                    self.setButtonState(false);
                    var pos = Math.floor(Math.random() * self.containerSize);
                    while(self.monsterContainer[pos].monsterType == "block" || self.monsterContainer[pos].monsterType == "universal" ){
                        var pos = Math.floor(Math.random() * self.containerSize);
                    }
                    var imgId = self.monsterContainer[pos].imageId;
                    self.scoreId = self.monsterContainer[pos].imageId;
                    self.monsterContainer[pos].destroy(true);
                    self.monsterContainer[pos] =  configObj.game.add.sprite(self.monsterContainer[pos].x, self.monsterContainer[pos].y, "universal");
                    self.monsterContainer[pos].imageId = imgId;
                    self.monsterContainer[pos].anchor.setTo(1, 1);
                    self.powerUpActivated = true;
                    self.updateMoves();
                    configObj.game.tweens.removeAll();
                    self.monsterFrenzyAnim(pos, imgId);
                });
            }
            else{
                this.setButtonState(false);
                var pos = Math.floor(Math.random() * this.containerSize);
                while(this.monsterContainer[pos].monsterType == "block" || this.monsterContainer[pos].monsterType == "universal" ){
                    var pos = Math.floor(Math.random() * this.containerSize);
                }
                var imgId = this.monsterContainer[pos].imageId;
                this.scoreId = this.monsterContainer[pos].imageId;
                this.monsterContainer[pos].destroy(true);
                this.monsterContainer[pos] =  configObj.game.add.sprite(this.monsterContainer[pos].x, this.monsterContainer[pos].y, "universal");
                this.monsterContainer[pos].imageId = imgId;
                this.monsterContainer[pos].anchor.setTo(1, 1);
                this.powerUpActivated = true;
                this.updateMoves();
                this.monsterFrenzyAnim(pos, imgId);
            }
        }
    },

    monsterFrenzyAnim : function(pos, imgId){
        var superMonster;
        var matchArray = new Array();
        var superMonsterArr = new Array();
        matchArray.push(this.monsterContainer[pos]);
        for(var j = 0; j < this.containerSize; j++){
            if(imgId == this.monsterContainer[j].imageId){
                if(this.monsterContainer[j].monsterType == "super"){
                    configObj.playAudio(this.powermonster, false);
                    superMonster = this.monsterContainer[j];
                    this.addHorizontalEffect(superMonster, superMonster.imageId);
                    this.addVerticalEffect(superMonster, superMonster.imageId);
                    this.addStarsHorizontal(superMonster.x, superMonster.y - 40, superMonster.imageId);
                    this.powerUpActivated = true;
                    this.scoreMultiplier = 20;
                    var rowStartPos = Math.floor(j/7) * configObj.totalRows;
                    var rowEndPos = rowStartPos + configObj.totalRows;
                    for(var m = rowStartPos; m < rowEndPos; m++){
                        if(this.monsterContainer[m].monsterType != "block" && superMonsterArr.indexOf(this.monsterContainer[m]) == -1)
                            superMonsterArr.push(this.monsterContainer[m]);
                    }
                    var colPos = j % 7;
                    for(var m = colPos; m < this.containerSize; m += 7){
                        if(this.monsterContainer[m].monsterType != "block" && superMonsterArr.indexOf(this.monsterContainer[m]) == -1)
                            superMonsterArr.push(this.monsterContainer[m]);
                    }
                }
                if(superMonsterArr.indexOf(this.monsterContainer[j]) == -1 && matchArray.indexOf(this.monsterContainer[j]) == -1 )
                    matchArray.push(this.monsterContainer[j]);
            }
        }
        this.drawElectricEffect(matchArray, imgId);
        var finalClear = matchArray.concat(superMonsterArr);
        this.clearMatchedElements(finalClear);
        matchArray.splice(0, matchArray.length);
    },

    checkForBadgeUnlockOnTargetComplete : function(){
        var message;
        if(configObj.unlockedBadgeArr.indexOf("badge1") == -1 && configObj.levelClear && this.total_moves_left == 5){
            configObj.unlockedBadgeArr.push("badge1");
            localStorage.setItem('unlockedBadgeData', JSON.stringify(configObj.unlockedBadgeArr));
            message = configObj.languageData["unlockedBadgeData"]["unlockedBadgeMessage"][0];
            this.achievementUnlockedAnim("badge_1", message, configObj.badgesRewards[0]);
            return true;
        }
        if(configObj.unlockedBadgeArr.indexOf("badge2") == -1 && configObj.levelClear && this.total_moves_left == 13){
            configObj.unlockedBadgeArr.push("badge2");
            localStorage.setItem('unlockedBadgeData', JSON.stringify(configObj.unlockedBadgeArr));
            message = configObj.languageData["unlockedBadgeData"]["unlockedBadgeMessage"][1];
            this.achievementUnlockedAnim("badge_2", message, configObj.badgesRewards[1]);
            return true;
        }
        return false;
    },

    checkForBadgeUnlock : function(){
        var message;
        if(configObj.unlockedBadgeArr.indexOf("badge3") == -1 && this.score >= 10000){
            configObj.unlockedBadgeArr.push("badge3");
            localStorage.setItem('unlockedBadgeData', JSON.stringify(configObj.unlockedBadgeArr));
            message = configObj.languageData["unlockedBadgeData"]["unlockedBadgeMessage"][2];
            this.achievementUnlockedAnim("badge_3", message, configObj.badgesRewards[2]);
            return true;
        }
        if(configObj.unlockedBadgeArr.indexOf("badge4") == -1 && this.score == 3000 && this.total_moves_left == 8){
            configObj.unlockedBadgeArr.push("badge4");
            localStorage.setItem('unlockedBadgeData', JSON.stringify(configObj.unlockedBadgeArr));
            message = configObj.languageData["unlockedBadgeData"]["unlockedBadgeMessage"][3];
            this.achievementUnlockedAnim("badge_4", message, configObj.badgesRewards[3]);
            return true;
        }
        if(configObj.unlockedBadgeArr.indexOf("badge5") == -1 && this.score == 4000 && this.total_moves_left == 3){
            configObj.unlockedBadgeArr.push("badge5");
            localStorage.setItem('unlockedBadgeData', JSON.stringify(configObj.unlockedBadgeArr));
            message = configObj.languageData["unlockedBadgeData"]["unlockedBadgeMessage"][4];
            this.achievementUnlockedAnim("badge_5", message, configObj.badgesRewards[4]);
            return true;
        }
        if(configObj.unlockedBadgeArr.indexOf("badge6") == -1 && this.score == 5000 && this.total_moves_left == 5){
            configObj.unlockedBadgeArr.push("badge6");
            localStorage.setItem('unlockedBadgeData', JSON.stringify(configObj.unlockedBadgeArr));
            message = configObj.languageData["unlockedBadgeData"]["unlockedBadgeMessage"][5];
            this.achievementUnlockedAnim("badge_6", message, configObj.badgesRewards[5]);
            return true;
        }
        return false;
    },
    checkforMonsterUnlock : function(){
        if(configObj.levelClear){
            var levelClearCount =  configObj.levelNo;
            switch(levelClearCount){
                case 5 :
                    if(configObj.unlockedMonsterArr.indexOf("char_1") == -1){
                        configObj.unlockedMonsterArr.push("char_1");
                        localStorage.setItem('unlockedMonsterData', JSON.stringify(configObj.unlockedMonsterArr));
                        this.animateMonsterUnlockPopUp(levelClearCount, configObj.monsterRewards[0], 1, 0);
                        return true;
                    }
                    break;
                case 10 :
                    if(configObj.unlockedMonsterArr.indexOf("char_2") == -1){
                        configObj.unlockedMonsterArr.push("char_2");
                        localStorage.setItem('unlockedMonsterData', JSON.stringify(configObj.unlockedMonsterArr));
                        this.animateMonsterUnlockPopUp(levelClearCount, configObj.monsterRewards[1], 2, 2);
                        return true;
                    }
                    break;
                case 15 :
                    if(configObj.unlockedMonsterArr.indexOf("char_3") == -1){
                        configObj.unlockedMonsterArr.push("char_3");
                        localStorage.setItem('unlockedMonsterData', JSON.stringify(configObj.unlockedMonsterArr));
                        this.animateMonsterUnlockPopUp(levelClearCount, configObj.monsterRewards[2], 3, 4);
                        return true;
                    }
                    break;
                case 25 :
                    if(configObj.unlockedMonsterArr.indexOf("char_4") == -1){
                        configObj.unlockedMonsterArr.push("char_4");
                        localStorage.setItem('unlockedMonsterData', JSON.stringify(configObj.unlockedMonsterArr));
                        this.animateMonsterUnlockPopUp(levelClearCount, configObj.monsterRewards[3], 4, 3);
                        return true;
                    }
                    break;
                case 35 :
                    if(configObj.unlockedMonsterArr.indexOf("char_5") == -1){
                        configObj.unlockedMonsterArr.push("char_5");
                        localStorage.setItem('unlockedMonsterData', JSON.stringify(configObj.unlockedMonsterArr));
                        this.animateMonsterUnlockPopUp(levelClearCount, configObj.monsterRewards[4], 5, 5);
                        return true;
                    }
                    break;
                case 45 :
                    if(configObj.unlockedMonsterArr.indexOf("char_6") == -1){
                        configObj.unlockedMonsterArr.push("char_6");
                        localStorage.setItem('unlockedMonsterData', JSON.stringify(configObj.unlockedMonsterArr));
                        this.animateMonsterUnlockPopUp(levelClearCount, configObj.monsterRewards[0], 6, 1);
                        return true;
                    }
                    break;
            }
        }
        return false;
    },
    animateMonsterUnlockPopUp : function(count, rewards, charIndex, soundId){
        this.tint_Bg.visible = true;
        var container = configObj.game.add.group();
        var unlockBg = configObj.game.add.sprite(configObj.percentOfWidth(0.02), 300, "spriteAtlas", "bg_unlock_popup.png");
        container.add(unlockBg);
        this.unlock_btn = configObj.game.add.button(configObj.percentOfWidth(0.185), 484, "spriteAtlas", this.OnUnlockClick.bind(this, rewards, charIndex, soundId), this);
        this.unlock_btn.frameName = "btn_unlocknow.png";
        container.add(this.unlock_btn);
        this.close_Unlockbtn = configObj.game.add.button(configObj.percentOfWidth(0.505), 484, "spriteAtlas", this.closeUnPopUp.bind(this, rewards, container), this);
        this.close_Unlockbtn.frameName = "btn_close.png";
        container.add(this.close_Unlockbtn);
        var cat_img = configObj.game.add.sprite(configObj.percentOfWidth(0.75), 260, "spriteAtlas", "Cat.png");
        container.add(cat_img);
        heading = configObj.game.add.text(configObj.percentOfWidth(0.31), 350, configObj.languageData["unlockedPetData"]["unlockMsg"]["heading"]  , {font : "35px londrina", fill : "#00436A", align: "center"});
        container.add(heading);
        message = configObj.game.add.text(configObj.percentOfWidth(0.2), 400, configObj.languageData["unlockedPetData"]["unlockMsg"]["message"] + count + configObj.languageData["unlockedPetData"]["unlockMsg"]["messageAppendText"] , {font : "30px londrina", fill : "#a26829", align: "center"});
        container.add(message);
        container.pivot.x = -450;
        container.pivot.y = -400;
        container.scale.x = 0.5;
        container.scale.y = 0.5;
        configObj.game.add.tween(container.scale).to({ x: 1, y: 1}, 400, Phaser.Easing.Back.Out, true);
        configObj.game.add.tween(container.position).to({ x: -450, y: -400}, 400, Phaser.Easing.Back.Out, true);
    },

    closeUnPopUp :function(rewards, container){
        for(var i = 0; i < rewards.length; i++){
            configObj.localDataModelObj.setPowerUp(rewards[i].powerUp, rewards[i].count);
        }
        var powerUpData = JSON.parse(localStorage.getItem('powerUpCount'));

        this.universalPowerUpCount.text = powerUpData["universal"];
        this.ringPowerUpCount.text = powerUpData["powerUpRing"];
        this.extraMovesPowerUpCount.text = powerUpData["addMoreMoves"];

        this.close_Unlockbtn.inputEnabled = false;
        this.setButtonState(true);
        var anim = configObj.game.add.tween(container.scale).to({ x: 0.5, y: 0.5}, 400, Phaser.Easing.Back.In, true);
        configObj.game.add.tween(container.position).to({ x: 0, y: 0}, 400, Phaser.Easing.Back.In, true);
        var self = this;
        anim.onComplete.add(function(){
            container.destroy(true);
            configObj.playAudio(self.level_finish, false);
            if(configObj.levelClear){
                if(self.bg_sound){
                    self.bg_sound.stop();
                    self.bg_sound = null;
                }
                if(configObj.levelNo == 50){
                    configObj.game.tweens.removeAll();
                    configObj.game.state.start('GameOver');
                }
                else{
                    configObj.game.tweens.removeAll();
                    configObj.game.state.start('LevelUp');
                }
            }
        });
    },

    OnUnlockClick : function(rewards, index, soundId)
    {
        for(var i = 0; i < rewards.length; i++){
            configObj.localDataModelObj.setPowerUp(rewards[i].powerUp, rewards[i].count);
        }
        this.close_Unlockbtn.inputEnabled = this.unlock_btn.inputEnabled = false;
        this.setButtonState(false);
        configObj.playAudio(configObj.button_clickAudio, false);
        this.tint_Bg.visible = true;
        var popUpContainer = configObj.game.add.group();
        this.unlock_screen = configObj.game.add.sprite(configObj.percentOfWidth(0.12), 70, "game_setting1");
        this.unlock_screen.scale.x = 1.2;
        this.unlock_screen.scale.y = 1.4;
        popUpContainer.add(this.unlock_screen);
        var startX = configObj.percentOfWidth(0.327);
        var startY = 220;
        var temp = 0;
        for(var i = 0; i < 6; i++){
            if(temp == 2){
                temp = 0;
                startX = configObj.percentOfWidth(0.327);
                startY += 210;
            }
            if(configObj.unlockedMonsterArr.indexOf("char_"+(i + 1)) == -1){
                this.unlockMonsterArr[i] =  configObj.game.add.button(startX, startY, "spriteAtlas1", null, this);
                this.unlockMonsterArr[i].frameName = "char_"+(i + 1)+".png";
            }
            else{
                if(i + 1 != index){
                    this.unlockMonsterArr[i] =  configObj.game.add.button(startX + 10, startY, "spriteAtlas1", null, this);
                    this.unlockMonsterArr[i].frameName = "char_unlocked"+(i + 1) +".png";
                }
                else{
                    this.unlockMonsterArr[i] =  configObj.game.add.button(startX + 10, startY, "spriteAtlas1", this.unlockableClick.bind(this,configObj.languageData["unlockedPetData"]["subHeading1"], "char_unlocked"+(i + 1), popUpContainer, configObj.languageData["unlockedPetData"]["message"], rewards, soundId, i), this);
                    this.unlockMonsterArr[i].frameName = "char_unlocked"+(i + 1) +".png";
                    configObj.game.add.tween(this.unlockMonsterArr[i]).to({alpha : 0.5}, 600, null, true, 0 , 100, true);
                }

            }
            this.unlockMonsterArr[i].anchor.setTo(0.5, 0.5);
            startX += 200;
            popUpContainer.add(this.unlockMonsterArr[i]);
            temp++;
        }
        popUpContainer.scale.x = 0.5;
        popUpContainer.scale.y = 0.5;
        this.close_click = configObj.game.add.button(configObj.percentOfWidth(0.78),60, "spriteAtlas", this.closePopUpUnlock.bind(this,popUpContainer), this);
        this.close_click.frameName = "close_btn.png";
        popUpContainer.add(this.close_click);
        this.animatePopUp(popUpContainer);
    },

    unlockableClick : function(heading, img, container, text, rewards , index, obj){
        this.unlockMonsterArr[obj].inputEnabled = false;
        this.close_click.inputEnabled = false;
        this.tint_Bg1 = configObj.game.add.sprite(configObj.percentOfWidth(0),0, "tint_background");
        var popUpContainer = configObj.game.add.group();
        this.game_setting_back = popUpContainer.create(configObj.percentOfWidth(0.15),160, "game_setting1");
        this.game_setting_back.scale.x = 1.1;
        this.game_setting_back.scale.y = 1.13;
        popUpContainer.add(this.game_setting_back);
        this.heading = configObj.game.add.text(configObj.percentOfWidth(0.37), 220, ""+heading, {font : "40px londrina", fill : "#a06626", align : "center"});
        popUpContainer.add(this.heading);
        this.pet = configObj.game.add.sprite(configObj.percentOfWidth(0.32), 260, "spriteAtlas1", img + ".png");
        popUpContainer.add(this.pet);
        this.achievement_txt = configObj.game.add.text(configObj.percentOfWidth(0.36), 470, ""+text, {font : "30px londrina", fill : "#a06626", align : "center"});
        popUpContainer.add(this.achievement_txt);
        this.rewards_txt = configObj.game.add.text(configObj.percentOfWidth(0.29), 520, configObj.languageData["unlockedPetData"]["rewards"] + " : ", {font : "30px londrina", fill : "#a06626", align : "center"});
        popUpContainer.add(this.rewards_txt);

        var startX = configObj.percentOfWidth(0.5);
        var startY = 520;
        for(var i = 0; i < rewards.length; i++){
            //configObj.localDataModelObj.setPowerUp(rewards[i].powerUp, rewards[i].count);
            var rText = configObj.game.add.text(startX, startY, ""+rewards[i].count, {font : "30px londrina", fill : "#a06626", align : "center"});
            popUpContainer.add(rText);
            var rImg = configObj.game.add.sprite(startX + 70, startY + 20, "spriteAtlas", ""+rewards[i].powerUp+".png");
            rImg.anchor.setTo(0.5, 0.5);
            popUpContainer.add(rImg);
            startY += 65;
        }
        var powerUpData = JSON.parse(localStorage.getItem('powerUpCount'));

        this.universalPowerUpCount.text = powerUpData["universal"];
        this.ringPowerUpCount.text = powerUpData["powerUpRing"];
        this.extraMovesPowerUpCount.text = powerUpData["addMoreMoves"];

        this.close_click1 = configObj.game.add.button(configObj.percentOfWidth(0.748), 135, "spriteAtlas", this.closeInfoPopUp.bind(this, popUpContainer), this);
        this.close_click1.frameName = "close_btn.png";
        popUpContainer.add(this.close_click1);
        popUpContainer.scale.x = 0.5;
        popUpContainer.scale.y = 0.5;
        this.monster_audio = configObj.game.add.audio("monster"+index);
        configObj.playAudio(this.monster_audio, false);
        this.animatePopUp(popUpContainer);
    },
    animatePopUp : function(container){
        container.pivot.x = -450;
        container.pivot.y = -400;
        container.scale.x = 0.5;
        container.scale.y = 0.5;
        configObj.game.add.tween(container.scale).to({ x: 1, y: 1}, 400, Phaser.Easing.Back.Out, true);
        configObj.game.add.tween(container.position).to({ x: -450, y: -400}, 400, Phaser.Easing.Back.Out, true);
    },

    closeInfoPopUp : function(container)
    {
        this.close_click.inputEnabled = true;
        configObj.playAudio(configObj.button_clickAudio);
        var anim = configObj.game.add.tween(container.scale).to({ x: 0.5, y: 0.5}, 450, Phaser.Easing.Back.In, true);
        var anim1 = configObj.game.add.tween(container.position).to({ x: 0, y: 0}, 450, Phaser.Easing.Back.In, true);
        var self = this;
        anim.onComplete.add(function(){
            container.destroy(true);
            self.tint_Bg1.destroy(true);
            self.unlockMonsterArr.splice(0, self.unlockMonsterArr.length);
            configObj.playAudio(self.level_finish, false);
            if(configObj.levelClear){
                if(self.bg_sound){
                    self.bg_sound.stop();
                    self.bg_sound = null;
                }
                if(configObj.levelNo == 50){
                    configObj.game.tweens.removeAll();
                    configObj.game.state.start('GameOver');
                }
                else{
                    configObj.game.tweens.removeAll();
                    configObj.game.state.start('LevelUp');
                }

            }
        });
    },

    achievementUnlockedAnim : function(achievement, text, rewards){
        this.MonsterState = "moving";
        this.setButtonState(false);
        this.tint_Bg.visible = true;
        var popUpContainer = configObj.game.add.group();
        var game_setting_back = configObj.game.add.sprite(configObj.percentOfWidth(0.18),170, "game_setting1");
        popUpContainer.add(game_setting_back);
        var heading_text = configObj.game.add.text(configObj.percentOfWidth(0.25), 220, configObj.languageData["unlockedBadgeData"]["unlockMsg"].title, {font : "35px londrina", fill : "#a06626", align : "center"});
        popUpContainer.add(heading_text);
        var badge = configObj.game.add.sprite(configObj.percentOfWidth(0.4), 270, "spriteAtlas", achievement+".png");
        popUpContainer.add(badge);
        var message = configObj.game.add.text(configObj.percentOfWidth(0.495), 420, " "+text, {font : "26px londrina", fill : "#a06626", align : "center"});
        message.anchor.setTo(0.5, 0.5);
        popUpContainer.add(message);
        var message1 = configObj.game.add.text(configObj.percentOfWidth(0.3), 480, configObj.languageData["unlockedBadgeData"]["rewards"] + " :\t\t\t ", {font : "25px londrina", fill : "#a06626", align : "center"});
        popUpContainer.add(message1);
        var startX = configObj.percentOfWidth(0.5);
        var startY = 480;
        for(var i = 0; i < rewards.length; i++){
            configObj.localDataModelObj.setPowerUp(rewards[i].powerUp, rewards[i].count);
            var rText = configObj.game.add.text(startX, startY, ""+rewards[i].count, {font : "30px londrina", fill : "#a06626", align : "center"});
            popUpContainer.add(rText);
            var rImg = configObj.game.add.sprite(startX + 70, startY + 20, "spriteAtlas", rewards[i].powerUp+".png");
            rImg.anchor.setTo(0.5, 0.5);
            popUpContainer.add(rImg);
            startY += 65;
        }
        var powerUpData = JSON.parse(localStorage.getItem('powerUpCount'));
        this.universalPowerUpCount.text = "" + powerUpData["universal"];
        this.ringPowerUpCount.text = "" + powerUpData["powerUpRing"];
        this.extraMovesPowerUpCount.text = "" + powerUpData["addMoreMoves"];
        this.close_click = configObj.game.add.button(configObj.percentOfWidth(0.7), 139, "spriteAtlas", this.closePopUp.bind(this, popUpContainer), this);
        this.close_click.frameName = "close_btn.png";
        popUpContainer.add(this.close_click);
        this.animatePopUp(popUpContainer);
    },
    closePopUp : function(container){
        this.setButtonState(true);
        if(!configObj.levelClear)
            this.MonsterState = "stady";
        if(this.settingBtn)
            this.settingBtn.inputEnabled = true;
        var anim = configObj.game.add.tween(container.scale).to({ x: 0.5, y: 0.5}, 400, Phaser.Easing.Back.In, true);
        configObj.game.add.tween(container.position).to({ x: 0, y: 0}, 400, Phaser.Easing.Back.In, true);
        var self = this;
        anim.onComplete.add(function(){
            self.tint_Bg.visible = false;
            container.destroy(true);
            if(self.total_moves_left > 0 && configObj.levelClear){
                self.setButtonState(false);
                self.monsterFrenzy();
            }
            else if(self.total_moves_left == 0){
                self.endDropAnim();
            }
        })
    },
    showHint : function(){
        var pos = nextPos = 0;
        for(var i = 0; i < this.containerSize; i++){
            var imgId = this.monsterContainer[i].imageId;
            var rowNo = Math.floor(i/7);
            var colNo = i % 7;
            var nextColPos = i + 1;
            var incFac = -1;
            if(nextColPos < this.containerSize && Math.floor(nextColPos/7) == rowNo && this.monsterContainer[nextColPos].imageId == imgId ){
                if(this.hintArray.indexOf(nextColPos) == -1){
                    this.hintArray.push(i, nextColPos);
                    i = nextColPos ;
                    nextColPos = i + 1;
                    this.checkNeighbour(imgId, incFac, "horizontal");
                    incFac = 1;
                }
                if(this.hintArray.length >= 3){
                    break;
                }
                else
                    this.hintArray.splice(0, 2);
            }
            if(this.hintArray.length == 3){
                break;
            }
        }
        if(this.hintArray.length == 0){
            for(var i = 0; i < this.containerSize; i++){
                var imgId1= this.monsterContainer[i].imageId;

                var pos = i;
                var colNo = i % 7;
                incFac = -7;
                var nextRowPos = i + 7;
                while(nextRowPos % 7 == colNo && nextRowPos < this.containerSize && this.monsterContainer[nextRowPos].imageId == imgId1){
                    if(this.hintArray.indexOf(nextRowPos) == -1){
                        this.hintArray.push(i, nextRowPos);
                        pos = nextRowPos ;
                        nextRowPos = pos + 7;
                        this.checkNeighbour(imgId1, incFac, "vertical");
                        incFac = 7;
                    }
                    if(this.hintArray.length >= 3){
                        break;
                    }
                    else
                        this.hintArray.splice(0, 2);
                }
                if(this.hintArray.length >= 3){
                    break;
                }
            }
        }
        if(this.hintArray.length == 0){
            var tempArr = new Array();
            for(var i = 0; i < this.containerSize; i++){
                var rowNo = Math.floor(i/configObj.totalRows);
                var colNo = i % 7;
                if(this.monsterContainer[i].monsterType != "block"){
                    if((i - 1) >= 0 && Math.floor((i - 1)/configObj.totalRows) == rowNo){
                        tempArr.push(i - 1);
                    }
                    if((i + 1) < this.containerSize && Math.floor((i + 1)/configObj.totalRows) == rowNo){
                        tempArr.push(i + 1);
                    }
                    if((i - 7) >= 0 && (i - 7) % configObj.totalRows == colNo){
                        tempArr.push(i - 7);
                    }
                    if((i + 7) < this.containerSize && (i + 7) % configObj.totalRows == colNo){
                        tempArr.push(i + 7);
                    }
                    for(var j = 0; j < tempArr.length; j++){
                        for(var k = j + 1; k < tempArr.length; k++){
                            if(this.monsterContainer[tempArr[j]].imageId == this.monsterContainer[tempArr[k]].imageId){
                                if(this.hintArray.indexOf(tempArr[j]) == -1 && this.monsterContainer[tempArr[j]].monsterType != "block")
                                    this.hintArray.push(tempArr[j]);
                                if(this.hintArray.indexOf(tempArr[k]) == -1 && this.monsterContainer[tempArr[k]].monsterType != "block")
                                    this.hintArray.push(tempArr[k]);
                            }
                        }
                        if(this.hintArray.length >= 3)
                            break;
                        else
                            this.hintArray.splice(0, this.hintArray.length);
                    }
                    if(this.hintArray.length >= 3)
                        break;
                    else{
                        tempArr.splice(0, tempArr.length);
                        this.hintArray.splice(0, this.hintArray.length);
                    }
                }
            }
        }
        if(this.hintArray.length == 0){
            configObj.playAudio(this.no_more_moves, false);
            for(var i = 0; i < this.containerSize; i++){
                if(this.monsterContainer[i].monsterType == "super" || this.monsterContainer[i].monsterType == "universal"){
                    var obj = {
                        "imageId" : this.monsterContainer[i].imageId,
                        "pos" : i,
                        "monsterType" : this.monsterContainer[i].monsterType
                    }
                    this.powUpMonster[i] = obj;
                }

            }
            this.endDropAnim();
        }
        if(this.hintArray.length >= 3){
            this.hintLoopEvent = configObj.game.time.events.loop(Phaser.Timer.SECOND * 2, this.animateHint, this);
        }


    },
    animateHint : function(){
        if(this.hintArray.length >= 3 && this.MonsterState == "stady"){
            for(var m = 0;m < 3; m++){
                var obj = this.monsterContainer[this.hintArray[m]];
                var yPos = obj.y;
                this.dropAnim = configObj.game.add.tween(obj.scale).to({x:1, y:.86}, 50,Phaser.Easing.Sinusoidal.In);
                this.dropAnim1 = configObj.game.add.tween(obj).to({y : obj.y - 20}, 120, Phaser.Easing.Sinusoidal.In);
                this.dropAnim2 = configObj.game.add.tween(obj.scale).to({x:1, y:.97}, 50,Phaser.Easing.Sinusoidal.In);
                this.dropAnim3 = configObj.game.add.tween(obj).to({y : obj.y + 7}, 120, Phaser.Easing.Sinusoidal.In);
                this.dropAnim4 = configObj.game.add.tween(obj.scale).to({x:1, y:.7}, 50,Phaser.Easing.Sinusoidal.In);
                this.dropAnim5 = configObj.game.add.tween(obj).to({y : obj.y - 11}, 120, Phaser.Easing.Sinusoidal.In);
                this.dropAnim6 = configObj.game.add.tween(obj.scale).to({x:1, y:1}, 50,Phaser.Easing.Sinusoidal.In);
                this.dropAnim7 = configObj.game.add.tween(obj).to({y : yPos}, 200, Phaser.Easing.Sinusoidal.In);

                this.dropAnim.chain(this.dropAnim1);
                this.dropAnim1.chain(this.dropAnim2);
                this.dropAnim2.chain(this.dropAnim3);
                this.dropAnim3.chain(this.dropAnim4);
                this.dropAnim4.chain(this.dropAnim5);
                this.dropAnim5.chain(this.dropAnim6);
                this.dropAnim6.chain(this.dropAnim7);
                this.dropAnim.start();
            }
        }
    },
    checkNeighbour : function(id, inc, check){
        var tempArr = new Array();
        var incFac = inc;
        for(var i = 0; i < this.hintArray.length; i++){
            var pos = this.hintArray[i] + incFac;
            if(pos < this.containerSize && pos >= 0 && this.monsterContainer[pos].monsterType != "block"){
                var rowNo = check == "horizontal" ?  Math.floor(this.hintArray[i]/configObj.totalRows) :  Math.floor(pos/configObj.totalRows);
                var colNo = pos % 7;
                if((pos - 1) >= 0 && Math.floor((pos - 1)/configObj.totalRows) == rowNo && this.hintArray.indexOf(pos - 1) == -1){
                    tempArr.push(pos - 1);
                }
                if((pos + 1) >= 0 && (pos + 1) < this.containerSize && Math.floor((pos + 1)/configObj.totalRows) == rowNo && this.hintArray.indexOf(pos + 1) == -1){
                    tempArr.push(pos + 1);
                }
                if((pos - 7) >= 0 && (pos - 7) % configObj.totalRows == colNo && this.hintArray.indexOf(pos - 7) == -1
                    && Math.floor(pos / configObj.totalRows) == rowNo){
                    tempArr.push(pos - 7);
                }
                if((pos + 7) < this.containerSize && (pos + 7) % configObj.totalRows == colNo && this.hintArray.indexOf(pos + 7) == -1
                    && Math.floor(pos / configObj.totalRows) == rowNo){

                    tempArr.push(pos + 7);
                }
                for(var j = 0; j < tempArr.length; j++){
                    if(this.monsterContainer[tempArr[j]].imageId == id && this.monsterContainer[tempArr[j]].monsterType != "block"){
                        if(this.hintArray.indexOf(tempArr[j]) == -1){
                            this.hintArray.push(tempArr[j]);
                            if(this.hintArray.length >= 3)
                                break;
                        }
                    }
                }
                if(this.hintArray.length >= 3)
                    break;
            }
            incFac *= -1;
            tempArr.splice(0, tempArr.length);
        }
    },
    showSettings : function(){
        if(this.inGameTutorial && this.total_moves_left > 0){
            this.setButtonState(false);
            this.settingBtn.inputEnabled = false;
            this.MonsterState = "moving";
            this.tint_Bg.visible = true;
            var settingPopup = configObj.game.add.group();
            this.game_setting_back = configObj.game.add.sprite(configObj.percentOfWidth(0.13),165 - this.diffFactorForPlacement, "game_setting");
            settingPopup.add(this.game_setting_back);
            this.level_select_click = configObj.game.add.button(configObj.percentOfWidth(0.26), 290 - this.diffFactorForPlacement, "spriteAtlas", this.OnLevelSelectionClick, this);
            this.level_select_click.frameName = "level_select_button.png"
            settingPopup.add(this.level_select_click);
            var sound_btn = configObj.audioPaused ? "sound_on_button" : "sound_off_button";
            this.sound_click = configObj.game.add.button(configObj.percentOfWidth(0.26), 430 - this.diffFactorForPlacement, "spriteAtlas", this.OnSoundClick.bind(this, "off", settingPopup), this);
            this.sound_click.frameName = sound_btn+".png";
            settingPopup.add(this.sound_click);
            var creditText = configObj.game.add.text(configObj.percentOfWidth(0.23), 720 - this.diffFactorForPlacement, configObj.languageData["Credits"]["music"],{font :"30px londrina", fill : "#BA690E", align : "center"});
            settingPopup.add(creditText);
            this.close_click = configObj.game.add.button(configObj.percentOfWidth(0.79), 143 - this.diffFactorForPlacement , "spriteAtlas", this.closePopUp.bind(this, settingPopup), this);
            this.close_click.frameName = "close_btn.png";
            settingPopup.add(this.close_click);
            settingPopup.pivot.x = -450;
            settingPopup.pivot.y = -400;
            settingPopup.scale.x = 0.5;
            settingPopup.scale.y = 0.5;
            configObj.game.add.tween(settingPopup.scale).to({ x: 1, y: 1}, 400, Phaser.Easing.Back.Out, true);
            configObj.game.add.tween(settingPopup.position).to({ x: -450, y: -400}, 400, Phaser.Easing.Back.Out, true);
        }
    },
    OnGameSettingPopUpCloseClick: function()
    {
        //This is an event called when game settings pop up is closed using close button
        this.settingBtn.inputEnabled = true;
        this.MonsterState = "stady";
        this.game_setting_back.destroy();
        this.close_click.destroy();
        this.level_select_click.destroy();
        this.sound_click.destroy();
    },
    OnLevelSelectionClick: function()
    {
        configObj.playAudio(configObj.button_clickAudio, false);
        this.bg_sound.stop();
        this.bg_sound = null;
        configObj.updateLife(-1);
        this.OnGameSettingPopUpCloseClick();
        configObj.game.state.start("LevelSelection");
    },
    OnSoundClick: function(key, container)
    {
        if(!configObj.audioPaused)
        {
            configObj.pauseAudio(this.bg_sound);
            configObj.audioPaused = true;
            this.sound_click.destroy();
            this.sound_click = configObj.game.add.button(configObj.percentOfWidth(0.26), 430 - this.diffFactorForPlacement, "spriteAtlas", this.OnSoundClick.bind(this, "on", container), this);
            this.sound_click.frameName = "sound_on_button.png";
            container.add(this.sound_click);
        }
        else
        {
            configObj.audioPaused = false;
            this.bg_sound.stop();
            this.bg_sound = null;
            this.bg_sound = configObj.game.add.audio('bg_sound');
            configObj.playAudio(this.bg_sound, true);
            this.sound_click.destroy();
            this.sound_click = configObj.game.add.button(configObj.percentOfWidth(0.26), 430 - this.diffFactorForPlacement, "spriteAtlas", this.OnSoundClick.bind(this, "off", container), this);
            this.sound_click.frameName = "sound_off_button.png";
            container.add(this.sound_click);
        }
    },
    powerUpUsed : function(type, ref){

        configObj.boosterAPI.event('powerup',type);
        configObj.playAudio(configObj.button_clickAudio, false);
        var count;
        if(!configObj.levelClear && this.inGameTutorial){
            switch(type){
                case "extramoves":
                    var count = configObj.getPowerUp('addMoreMoves');
                    if(count > 0){
                        var count = configObj.updatePowerUp('addMoreMoves');
                        this.extraMovesPowerUpCount.text = ""+count;
                        this.powerUpUsedFlag = "addMoreMoves";
                        this.animateText("+ 5 moves");
                        this.total_moves_left += 5 ;
                        if(configObj.isDevice)
                            this.levelMovesText.text =  "Moves\n " + this.total_moves_left;
                        else
                            this.levelMovesText.text =  "Moves " + this.total_moves_left;
                    }
                    break;
                case "wand":
                    if(this.powerUpUsedFlag == null){
                        this.powerUpActivated = true;
                        count = configObj.getPowerUp('universal');
                        if(count > 0){
                            this.settingBtn.inputEnabled = false;
                            this.extraMovesBtn.inputEnabled = false;
                            this.ringPowerBtn.inputEnabled = false;
                            this.universalPowerBtn.freezeFrames = true;
                            this.powerUpUsedFlag = "universal";

                        }
                    }
                    else{
                        this.settingBtn.inputEnabled = true;
                        this.extraMovesBtn.inputEnabled = true;
                        this.ringPowerBtn.inputEnabled = true;
                        this.universalPowerBtn.freezeFrames = false;
                        this.powerUpUsedFlag = null;
                    }
                    break;
                case "ring":
                    if(this.powerUpUsedFlag == null){
                        this.powerUpActivated = true;
                        count = configObj.getPowerUp('powerUpRing');
                        if(count > 0){
                            this.settingBtn.inputEnabled = false;
                            this.extraMovesBtn.inputEnabled = false;
                            this.universalPowerBtn.inputEnabled = false;
                            this.ringPowerBtn.freezeFrames = true;
                            this.powerUpUsedFlag = "powerUpRing";
                            this.ringPowerBtn.frame = 1;
                        }
                    }
                    else{
                        this.settingBtn.inputEnabled = true;
                        this.extraMovesBtn.inputEnabled = true;
                        this.universalPowerBtn.inputEnabled = true;
                        this.ringPowerBtn.freezeFrames = false;
                        this.powerUpUsedFlag = null;
                        this.ringPowerBtn.frame = 0;
                    }
                    break;
            }
        }
    },
    setButtonState : function(state){
        this.universalPowerBtn.inputEnabled = state;
        this.ringPowerBtn.inputEnabled = state;
        this.extraMovesBtn.inputEnabled = state;
        this.settingBtn.inputEnabled = state;
    },
    update : function(){
        if(this.killAnimationComplete == true){
            this.updateContainer();
            this.killAnimationComplete = false;
        }
    }
};
