/**
 * Created with JetBrains WebStorm.
 * User: vivek.d
 * Date: 6/25/14
 * Time: 8:50 PM
 * To change this template use File | Settings | File Templates.
 */
Game.InGameTutorial = function(){

};
Game.InGameTutorial.prototype = {
    preload : function(){

    },
    create : function(){
        this.monsterState = "stady";
        this.totalPositionUpdateCounter = this.tweenAnimationCounter = 0;
        this.destroyedPets = new Array();
        configObj.game.inputEnabled = true;
        this.bg_sound = configObj.game.add.audio('bg_sound');
        this.level_start = configObj.game.add.audio('level_start');
        configObj.playAudio(this.bg_sound, true);

        if(false || !!document.documentMode){
            configObj.game.stage.disableVisibilityChange = true;
        }
        this.tutorialContainer = new Array();
        this.index = 0;
        this.tutorialStartYPos = configObj.tutorialStartYPos;
        this.tutorial = "tutorial1";
        this.selectedMonster = this.swapperMonster = null;
        this.mouseDownX = this.mouseDownY = this.mouseUpX = this.mouseUpY = 0;
        this.diffFactor = configObj.isDevice ? 64 : 0;
        this.selectedMonsterPos;
        this.yPosContainer = new Array();
        configObj.game.input.mouse.mouseMoveCallback = this.mouseMoveCallBack.bind(this);
        configObj.game.input.touch.touchMoveCallback = this.mouseMoveCallBack.bind(this);
        if(configObj.isDevice){
            this.backGroundImg1 = configObj.game.add.sprite(configObj.percentOfWidth(0), 0, "Game_background_mbl");
            this.backGroundImg1.inputEnabled = true;
            this.footer = configObj.game.add.sprite(-50, 725, "footer");
            this.hud_BGLayer = configObj.game.add.sprite(85 ,0, "hud_BGLayer");
            configObj.game.add.sprite(-19 ,-78, "header");
            this.levelMovesText = configObj.game.add.text(30, 755, "Moves\n"+10 , {font : "35px londrina", fill : "#e9f4ff", align: "center"});
            this.settingBtn = configObj.game.add.button(569 ,10, "spriteAtlas", this.showSettings, this);
            this.settingBtn.frameName = "mbl_settings.png";
            configObj.game.add.text(13, 10, "Level \n"+1, {font : "25px londrina", fill : "#e9f4ff", align : "center"});
            configObj.game.add.text(365, 10, "Target "+1000, {font : "35px londrina", fill : "#FFDC4E", align : "center"});
            var style = {font : "35px londrina", fill : "#e9f4ff", align : "center"};
            this.levelScoreText = configObj.game.add.text(535, 755, "Score \n"+0, style);
            this.universalPowerBtn = configObj.game.add.button(202, 770, "universalPowerUp", this.universalPowerUp, this, 0, 0, 1, 0);
            var style = {font : "25px londrina", fill : "#f5a3ff", align : "center"};
            this.universalPowerUpCount =  configObj.game.add.text(202, 750, "5", style);
            this.ringPowerBtn = configObj.game.add.button(294, 768, "powerUpRing", this.ringPowerUp, this, 0, 0, 1, 0);
            this.ringPowerBtn.frameName = "powerUpRing.png";
            this.ringPowerUpCount =  configObj.game.add.text(292, 750, "5", style);
            this.movesPowerBtn = configObj.game.add.button(390, 768, "addMoreMoves", this.movesPowerUp, this, 0, 0, 1, 0);
            this.movesPowerBtn.frameName = "addMoreMoves.png";
            this.extraMovesPowerUpCount =  configObj.game.add.text(382, 750, "5", style);
            this.universalPowerBtn.inputEnabled = this.ringPowerBtn.inputEnabled = this.movesPowerBtn.inputEnabled = false;
        }
        else{
            this.backGroundImg1 = configObj.game.add.sprite(configObj.percentOfWidth(0), 0, "Game_background");
            this.backGroundImg1.inputEnabled = true;
            configObj.game.add.sprite(0 ,0, "leftBar");
            configObj.game.add.sprite(860 ,0, "rightBar");
            configObj.game.add.text(870, 10, "Target "+1000, {font : "40px londrina", fill : "#FFDC4E", align : "center"});
            configObj.game.add.sprite(875 ,120, "spriteAtlas1", "text_box.png");
            var style = {font : "25px londrina", fill : "#e9f4ff", align : "center"};
            configObj.game.add.text(895, 145, "Level  "+1, style);
            this.levelMovesText = configObj.game.add.text(895, 180, "Moves  "+10, style);
            this.levelScoreText = configObj.game.add.text(895, 220, "Score  "+0, style);
            var style = {font : "27px londrina", fill : "#f5a3ff", align : "center"};
            this.universalPowerBtn = configObj.game.add.button(875, 300, "magic_stick", this.universalPowerUp, this, 0, 0, 1, 0);
            this.universalPowerUpCount =  configObj.game.add.text(945, 332, "5", style);
            this.ringPowerBtn = configObj.game.add.button(875, 434, "magic_ring", this.ringPowerUp, this, 0, 0, 1, 0);
            this.ringPowerUpCount =  configObj.game.add.text(945, 456, "5", style);
            this.movesPowerBtn = configObj.game.add.button(875, 559, "extra_moves", this.movesPowerUp, this, 0, 0, 1, 0);
            this.movesPowerBtn.frameName = "extra_moves.png";
            this.extraMovesPowerUpCount =  configObj.game.add.text(945, 579, "5", style);
            this.settingBtn = configObj.game.add.button(940 ,730, "spriteAtlas1", this.showSettings, this);
            this.settingBtn.frameName = "settingBtn.png";
            this.setButtonState(false);
        }
        this.monsterDisabledLayer = configObj.game.add.group();
        this.monsterDisabledLayer.z = 0;
        this.tintLayer = configObj.game.add.group();
        this.tintLayer.z = 1;
        this.monsterEnabledLayer = configObj.game.add.group();
        this.monsterEnabledLayer.z = 2;

        this.logoLayer = configObj.game.add.group();
        this.logoLayer.z = 3;
        this.activeBtnLayer = configObj.game.add.group();
        this.activeBtnLayer.z = 4;
        this.tutorialLayer = configObj.game.add.group();
        this.tutorialLayer.z = 5;

        if(!configObj.isDevice){
            this.logo = configObj.game.add.sprite(configObj.percentOfWidth(0.25), 20, "spriteAtlas1", "logo.png");
            this.logoLayer.add(this.logo);
        }
        this.startTutorial();
    },
    startTutorial : function(){
        if(localStorage.tutorialShown == undefined){
            this.messageContainer = configObj.game.add.sprite(configObj.percentOfWidth(0.027) ,370 - this.diffFactor, "spriteAtlas", "ingame_tut.png");
            this.tutorialLayer.add(this.messageContainer);
            this.tutorialText = configObj.game.add.text(configObj.percentOfWidth(0.495), 440 - this.diffFactor, configObj.languageData["tutorialText"][0] , {font : "30px londrina", fill : "#a06626", align : "center"});
            this.tutorialLayer.add(this.tutorialText);
            this.tutorialText.anchor.setTo(0.5, 0.5);
            this.skipBtn = configObj.game.add.button(configObj.percentOfWidth(0.2), 750 - this.diffFactor, "spriteAtlas", this.skipTutorial, this, 0, 0, 0);
            this.skipBtn.frameName = "skip.png";
            this.skipBtn.anchor.setTo(0.5, 0.5);
            this.nextBtn = configObj.game.add.button(configObj.percentOfWidth(0.8), 750 - this.diffFactor , "spriteAtlas", this.tutorial1, this, 0, 0, 0);
            this.nextBtn.frameName = "next.png";
            this.nextBtn.anchor.setTo(0.5, 0.5);
            var butAnim = configObj.game.add.tween(this.nextBtn).to({alpha : 0.5}, 600, null, true, 0, 1000, true);
        }
    },
    mouseMoveCallBack : function(){
        if(this.selectedMonster != null){
            this.tint_Bg.visible = false;
            var xPos = this.selectedMonster.x;
            var yPos = this.selectedMonster.y;
            var yDiff = Math.abs(this.mouseDownY - this.mouseUpY);
            if(this.selectedMonsterPos == 2){
                var tempArr = new Array();
                if(yDiff >= 20){
                    this.swapperMonster = this.tutorialContainer[7];
                    this.swapperMonsterPos = 7;
                    configObj.game.add.tween(this.selectedMonster).to({x: this.swapperMonster.x, y: this.swapperMonster.y}, 180, null, true);
                    var tween = configObj.game.add.tween(this.swapperMonster).to({x: xPos, y: yPos}, 180, null, true, 100);
                    var self = this;
                    var tempObj;
                    tween.onComplete.add(function(){
                        tempObj = self.tutorialContainer[7];
                        self.tutorialContainer[7] = self.tutorialContainer[2];
                        self.tutorialContainer[2] = tempObj;
                        tempArr.push(self.tutorialContainer[6], self.tutorialContainer[7], self.tutorialContainer[8]);
                        self.killPets(tempArr);
//
                    });
                }
                this.selectedMonsterPos = -1;
            }
        }
    },
    killPets : function(arr){
        this.monsterState = "moving";
        for(var i = 0; i <arr.length; i++){
            arr[i].destroy();
            this.destroyedPets.push(this.tutorialContainer.indexOf(arr[i]));
        }
        this.updateContainer();

    },
    updateContainer : function(){
        var index = 0;
        for(var i = 0; i < 5; i++){
            for(var j = 0; j < 4; j++){
                var selPos = this.destroyedPets.indexOf(index);
                if(selPos != -1){
                    var pos = index;
                    var prevPos = pos;
                    var xPos =  this.tutorialContainer[prevPos].x;
                    var newPos;
                    while(pos - 5 >= 0){
                        prevPos = pos - 5;
                        newPos = this.yPosContainer[pos];
                        xPos = this.tutorialContainer[prevPos].x;
                        this.tutorialContainer[pos] = this.tutorialContainer[prevPos];
                        this.tweenToPosition(this.tutorialContainer[prevPos], newPos);
                        pos = prevPos;
                    }
                    var imgId = Math.floor(Math.random() * 6);
                    this.spawnNew(prevPos, xPos, this.yPosContainer[prevPos], "monster", imgId);
                    this.tweenToPosition(this.tutorialContainer[prevPos],  this.yPosContainer[prevPos]);
                }
                index++;
            }
        }
        this.destroyedPets.splice(0, this.destroyedPets.length);
    },
    spawnNew : function(pos, xPos, yPos, type, imageId){
        var yP = 10;
        this.tutorialContainer[pos] = configObj.game.add.sprite(xPos, yP, type+imageId);
        this.tutorialContainer[pos].loadTexture(type+imageId, 0);
        this.tutorialContainer[pos].animations.add('blinkEyes');
        this.tutorialContainer[pos].imageId = imageId;
        this.monsterDisabledLayer.add(this.tutorialContainer[pos]);
        this.tutorialContainer[pos].inputEnabled = true;
        this.tutorialContainer[pos].anchor.setTo(1, 1);
        this.tutorialContainer[pos].events.onInputDown.add(this.mouseDownCallBack.bind(this,this.tutorialContainer[pos]), this);
        this.tutorialContainer[pos].events.onInputUp.add(this.mouseUpCallBack.bind(this,this.tutorialContainer[pos]), this);
        this.tutorialContainer[pos].monsterType = type;
    },
    tweenToPosition : function(obj, destY){
        var self = this;
        this.totalPositionUpdateCounter++;
        var dropAnim = configObj.game.add.tween(obj).to({x : obj.x, y : destY}, 300, Phaser.Easing.Sinusoidal.In);
        var dropAnim1 = configObj.game.add.tween(obj.scale).to({x:1, y:.8}, 100, Phaser.Easing.Sinusoidal.In);
        var dropAnim2 = configObj.game.add.tween(obj.scale).to({x:1, y:1.2}, 100, Phaser.Easing.Sinusoidal.In);
        var dropAnim3 = configObj.game.add.tween(obj.scale).to({x:1, y:1}, 100, Phaser.Easing.Sinusoidal.In);
        dropAnim.chain(dropAnim1);
        dropAnim1.chain(dropAnim2);
        dropAnim2.chain(dropAnim3);
        dropAnim.start();
        var self = this;
        dropAnim.onComplete.add(function(){
            self.tweenAnimationCounter++;
            if(self.totalPositionUpdateCounter == self.tweenAnimationCounter){
                self.totalPositionUpdateCounter = self.tweenAnimationCounter = 0;
                self.newTimer = configObj.game.time.create(false);
//                Timer set
                self.newTimer.add(300, self.nextTutorial, self);
                self.newTimer.start();
            }
        });
    },
    nextTutorial : function(){
        configObj.game.time.events.remove(this.newTimer);
        if(this.tutorial == "tutorial1"){
            this.tutorial2();
        }
        else if(this.tutorial == "tutorial2"){
            this.tutorial3();
        }
        else if(this.tutorial == "tutorial3"){
            this.tutorial4();
        }
    },
    skipTutorial : function(){
        configObj.boosterAPI.event('skipTutorial');
        localStorage.tutorialShown = true;
        this.bg_sound.stop();
        this.bg_sound = null;
        configObj.game.tweens.removeAll();
        configObj.playAudio(this.level_start, false);
        configObj.game.state.start('MagicMonsters');
    },
    setButtonState : function(state){
        this.universalPowerBtn.inputEnabled = state;
        this.ringPowerBtn.inputEnabled = state;
        this.movesPowerBtn.inputEnabled = state;
        this.settingBtn.inputEnabled = state;
    },
    animateText : function(img){
        var textEffect = configObj.game.add.sprite(configObj.percentOfWidth(0.5), 480, "spriteAtlas1", img+".png");
        textEffect.anchor.setTo(0.5, 0.5);
        var tween = configObj.game.add.tween(textEffect).to({alpha : 0}, 500, Phaser.Easing.Sinusoidal.In, true, 100);
        var tween1 = configObj.game.add.tween(textEffect).to({y : textEffect.y - 40}, 500, null, true);
        tween.chain(tween1);
        tween.start();
        tween1.onComplete.add(function(){
            textEffect.destroy(true);
        });
    },
    tutorial1 : function(){
        if(this.tutorial == "tutorial1"){
            configObj.boosterAPI.event('startTutorial');
            configObj.playAudio(configObj.button_clickAudio, false);
            this.nextBtn.visible = false;
            this.tutorialLayer.visible = false;
            var xPos = configObj.tutorialStartXPos;
            for(var i = 0; i < 4; i++){
                for(var j = 0; j < 5; j++){
                    var temp = configObj.tutorialGrid[i][j];
                    this.tutorialContainer[this.index] = configObj.game.add.sprite(xPos, 10, 'monster'+temp);
                    this.tutorialContainer[this.index].loadTexture('monster'+temp, 0);
                    this.tutorialContainer[this.index].animations.add('blinkEyes');
                    this.tutorialContainer[this.index].imageId = temp;
                    this.tutorialContainer[this.index].anchor.setTo(1, 1);
                    this.yPosContainer.push(this.tutorialStartYPos);
                    xPos += configObj.tutorialgapBetweenObj;
                    if(this.index == 2 || this.index == 6 || this.index == 8){
                        this.monsterEnabledLayer.add(this.tutorialContainer[this.index]);
                    }
                    else{
                        this.monsterDisabledLayer.add(this.tutorialContainer[this.index]);
                    }
                    this.index++;
                }
                this.tutorialStartYPos += configObj.tutorialgapBetweenObj;
                xPos = configObj.tutorialStartXPos;
            }
            this.tutorialContainer[2].inputEnabled = true;
            this.tutorialContainer[2].events.onInputDown.add(this.mouseDownCallBack.bind(this,this.tutorialContainer[2]), this);
            this.tutorialContainer[2].events.onInputUp.add(this.mouseUpCallBack.bind(this,this.tutorialContainer[this.index]), this);

            this.tint_Bg = configObj.game.add.sprite(-configObj.percentOfWidth(0),0, "bg_disable");
            this.tint_Bg.scale.x = 2.2;
            this.tintLayer.add(this.tint_Bg);
            this.handImg = configObj.game.add.sprite(configObj.percentOfWidth(0.5) , 375 - this.diffFactor, "tap_hands", 1);
            var handAnim = configObj.game.add.tween(this.handImg.scale).to({x : 1, y : 1}, 600, Phaser.Easing.Sinusoidal.In, false);
            var handAnim1 = configObj.game.add.tween(this.handImg).to({y : 465 - this.diffFactor}, 600, Phaser.Easing.Sinusoidal.In, false, 400);
            handAnim.chain(handAnim1);
            handAnim.start();
            var self = this;
            handAnim1.onComplete.add(function(){
                self.handImg.frame = 0;
                var reverseAnim = configObj.game.add.tween(self.handImg).to({y : 375 - self.diffFactor}, 650, Phaser.Easing.Sinusoidal.In, true, 400);
                reverseAnim.onComplete.add(function(){
                    self.handImg.frame = 1;
                    handAnim.start();
                });
            });
            this.startDropAnim();
        }
        if(this.tutorial == "tutorial4"){
            this.bg_sound.stop();
            this.bg_sound = null;
            localStorage.tutorialShown = true;
            this.setButtonState(true);
            this.bg_sound = null;
            configObj.playAudio(this.level_start, false);
            configObj.game.state.start('MagicMonsters');
        }
    },

    tutorial2 : function(){
        this.tint_Bg.visible = true;
        this.tintLayer.remove(this.tint_Bg);
        this.activeBtnLayer.add(this.tint_Bg);
        this.activeBtnLayer.add(this.ringPowerBtn);
        this.activeBtnLayer.add(this.ringPowerUpCount);
        this.ringPowerBtn.inputEnabled = true;
        this.universalPowerBtn.inputEnabled = false;
        this.movesPowerBtn.inputEnabled = false;
        configObj.game.input.mouse.mouseMoveCallback = null;
        configObj.game.input.touch.touchMoveCallback = null;
        this.handImg.destroy(true);
        if(!configObj.isDevice){
            this.newhandImg = configObj.game.add.sprite(this.ringPowerBtn.x + 100 , this.ringPowerBtn.y + 70, 'hand_anim');
        }
        else{
            this.newhandImg = configObj.game.add.sprite(this.ringPowerBtn.x + 20 , this.ringPowerBtn.y + 20, 'hand_anim');
        }

        this.newhandImg.loadTexture('hand_anim');
        this.newhandImg.animations.add('hand_anim');
        this.newhandImg.play('hand_anim', 10, true);

        for(var i = 0;i < 20; i++){
            this.tutorialContainer[i].inputEnabled = true;
            this.tutorialContainer[i].events.onInputDown.add(this.mouseDownCallBack.bind(this,this.tutorialContainer[i]), this);
        }
        this.tutorialLayer.visible = true;
        this.messageContainer.y = 170 - this.diffFactor;
        this.tutorialText.y = 242 - this.diffFactor;
        this.tutorialText.text = configObj.languageData["tutorialText"][1];
    },
    tutorial3 : function(){
        this.newhandImg.visible = true;
        this.ringPowerBtn.inputEnabled = false;
        this.tint_Bg.visible = true;
        this.activeBtnLayer.add(this.universalPowerBtn);
        this.activeBtnLayer.add(this.universalPowerUpCount);
        this.universalPowerBtn.inputEnabled = true;
        this.movesPowerBtn.inputEnabled = false;
        this.ringImg.destroy(true);
        if(!configObj.isDevice){
            this.newhandImg.x = this.universalPowerBtn.x + 100;
            this.newhandImg.y = this.universalPowerBtn.y + 100;
        }
        else{
            this.newhandImg.x = this.universalPowerBtn.x + 20;
            this.newhandImg.y = this.universalPowerBtn.y + 20;
        }
        this.tutorialLayer.visible = true;
        this.tutorialText.text = configObj.languageData["tutorialText"][2];
    },
    tutorial4 : function(){
        this.tutorial = "tutorial4";
        this.newhandImg.visible = true;
        this.ringPowerBtn.inputEnabled = false;
        this.universalPowerBtn.inputEnabled = false;
        this.tint_Bg.visible = true;
        this.activeBtnLayer.add(this.movesPowerBtn);
        this.activeBtnLayer.add(this.extraMovesPowerUpCount);
        this.movesPowerBtn.inputEnabled = true;
        if(!configObj.isDevice){
            this.newhandImg.x = this.movesPowerBtn.x + 100;
            this.newhandImg.y = this.movesPowerBtn.y + 100;
        }
        else{
            this.newhandImg.x = this.movesPowerBtn.x + 20;
            this.newhandImg.y = this.movesPowerBtn.y + 20;
        }
        this.tutorialLayer.visible = true;
        this.tutorialText.text = configObj.languageData["tutorialText"][3];
    },
    tutorial2Anim : function(){
        this.tutorial = "tutorial2";
        this.ringImg = configObj.game.add.sprite(this.selectedMonster.x - 70 , this.selectedMonster.y - 70, "spriteAtlas", "powerUpRing.png");
        var ringAnim = configObj.game.add.tween(this.ringImg.scale).to({x : 2, y : 2}, 350, Phaser.Easing.Bounce.Out);
        var ringAnim1 = configObj.game.add.tween(this.ringImg.scale).to({x : 1.2, y : 1.2}, 350, Phaser.Easing.Bounce.Out);
        ringAnim.chain(ringAnim1);
        ringAnim.start();
        var self = this;
        var tempMatchArr = [this.selectedMonster];
        ringAnim1.onComplete.add(function(){
            self.ringImg.destroy();
            self.killPets(tempMatchArr);
        });
    },
    tutorial3Anim : function(){
        this.tutorial = "tutorial3";
        var tempArr = [];
        var imgId = this.selectedMonster.imageId;
        tempArr.push(this.selectedMonster);
        for(var i = 0; i < 20; i++){
            if(this.tutorialContainer[i].imageId == imgId){
                tempArr.push(this.tutorialContainer[i]);
            }
        }
        this.drawElectricEffect(tempArr);
    },
    drawElectricEffect : function(matchesArr){
        var lineArr = [];
        var colorCode = ["#9b4a1c", "#25acad", "#ffa30d", "#fa6100", "#6b7c90", "#d32959"];
        this.colorCode = colorCode[matchesArr[1].imageId];
        var bmd = configObj.game.add.bitmapData(configObj.game.width, configObj.game.height);
        for(var i = 1 ;i < matchesArr.length; i++){
            bmd.context.beginPath();
            bmd.context.moveTo(matchesArr[0].x - 40, matchesArr[0].y- 30);
            bmd.context.lineTo(matchesArr[i].x - 40, matchesArr[i].y - 30);
            bmd.context.strokeStyle = this.colorCode;
            bmd.context.lineWidth = 2;
            bmd.context.stroke();
            lineArr[i] =  configObj.game.add.sprite(0, 0, bmd);
            var temp = lineArr[i];
            var self = this;
            var tween = configObj.game.add.tween(temp).to({alpha : 0.3}, 60, null, true, 0, 3, true);
            tween.onComplete.add(function(temp){
                temp.destroy(true);
                self.killPets(matchesArr);
            });
        }
    },
    startDropAnim : function(){
        var dropAnim, dropAnim1, dropAnim2, dropAnim3;
        for(var i = 0; i < 20; i++){
            dropAnim = configObj.game.add.tween(this.tutorialContainer[i]).to({y: this.yPosContainer[i]}, 300, Phaser.Easing.Sinusoidal.In);
            dropAnim1= configObj.game.add.tween(this.tutorialContainer[i].scale).to({x : 1, y : 0.8 }, 120, Phaser.Easing.Sinusoidal.In);
            dropAnim2= configObj.game.add.tween(this.tutorialContainer[i].scale).to({x : 1, y : 1.2 }, 120, Phaser.Easing.Sinusoidal.In);
            dropAnim3= configObj.game.add.tween(this.tutorialContainer[i].scale).to({x : 1, y : 1 }, 120, Phaser.Easing.Sinusoidal.In);
            dropAnim.chain(dropAnim1);
            dropAnim1.chain(dropAnim2);
            dropAnim2.chain(dropAnim3);
            dropAnim.start();
        }
    },
    mouseUpCallBack : function(){
        this.mouseUpX = configObj.game.input.activePointer.x;
        this.mouseUpY = configObj.game.input.activePointer.y;
    },
    mouseDownCallBack : function(obj){
        if(this.monsterState == "stady"){
            if(this.newhandImg)
                this.newhandImg.visible = false;
            if(this.handImg)
                this.handImg.visible = false;
            this.selectedMonster = obj;
            this.selectedMonsterPos = 2;
            this.mouseDownX = configObj.game.input.activePointer.x;
            this.mouseDownY = configObj.game.input.activePointer.y;
            if(this.tutorial == "tutorial2" && this.newhandImg != null){
                this.ringPowerBtn.setFrames(0, 0, 1, 0);
                this.tutorial2Anim();
            }
            if(this.tutorial == "tutorial3"){
                this.universalPowerBtn.setFrames(0, 0, 1, 0);
                this.tutorial3Anim();
            }
        }
        this.monsterState = "moving";
    },
    ringPowerUp : function(){
        this.ringPowerBtn.freezeFrames = true;
        this.tint_Bg.visible = false;
        this.activeBtnLayer.remove(this.ringPowerBtn);
        this.activeBtnLayer.remove(this.ringPowerUpCount);
        this.monsterDisabledLayer.add(this.ringPowerBtn);
        this.monsterDisabledLayer.add(this.ringPowerUpCount);
        this.setButtonState(false);
        configObj.playAudio(configObj.button_clickAudio, false);
        this.tutorial = "tutorial2";
        this.monsterState = "stady";
        var pos = Math.floor(Math.random() * 20);
        this.newhandImg.x = this.tutorialContainer[pos].x - 25;
        this.newhandImg.y = this.tutorialContainer[pos].y - 40;
    },
    universalPowerUp : function(){
        this.universalPowerBtn.freezeFrames = true;
        this.tint_Bg.visible = false;
        this.activeBtnLayer.remove(this.universalPowerBtn);
        this.activeBtnLayer.remove(this.universalPowerUpCount);
        this.monsterDisabledLayer.add(this.universalPowerBtn);
        this.monsterDisabledLayer.add(this.universalPowerUpCount);
        this.setButtonState(false);
        configObj.playAudio(configObj.button_clickAudio, false);
        this.tutorial = "tutorial3";
        this.monsterState = "stady";
        var pos = Math.floor(Math.random() * 20);
        this.newhandImg.x = this.tutorialContainer[pos].x - 25;
        this.newhandImg.y = this.tutorialContainer[pos].y - 40;
    },
    movesPowerUp : function(){
        this.setButtonState(false);
        configObj.playAudio(configObj.button_clickAudio, false);
        this.animateText("+ 5 moves");
        if(configObj.isDevice)
            this.levelMovesText.text = "Moves\n"+ 15;
        else
            this.levelMovesText.text = "Moves "+ 15;
        configObj.game.add.tween(this.levelMovesText.scale).to({x : 1.1, y : 1.1}, 600, null, true, 0, 5, true);
        this.nextBtn.visible = true;
        this.tint_Bg.destroy(true);
        this.newhandImg.destroy(true);
    }
};
