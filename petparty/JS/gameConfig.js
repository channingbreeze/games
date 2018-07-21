/**
 * Created with JetBrains WebStorm.
 * User: vivek.d
 * Date: 4/10/14
 * Time: 3:18 PM
 * To change this template use File | Settings | File Templates.
 */
var gameConfig = function() {
    this.oldLevelData = JSON.parse(localStorage.getItem('levelData')) || [];
    if(this.oldLevelData.length == 0){
        this.currentLevelData = {
            "levelNo" : 0,
            "stars"   : 0,
            "score"   : 0,
            "levelCleared" : false,
            "totalScore" : 0
        };
        this.oldLevelData[0] = this.currentLevelData;
        localStorage.setItem('levelData', JSON.stringify(this.oldLevelData));
    }
    this.community = null;
    this.audioPaused = false;
    this.currentLevelData = {};
    this.nativeBrowser = false;
    this.availablePowerUp = JSON.parse(localStorage.getItem('powerUpCount')) || {
                                                                                    "addMoreMoves" : 5,
                                                                                    "universal" : 5,
                                                                                    "powerUpRing" : 5
                                                                                };

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

    if(localStorage.getItem('livesCount') == null){
        localStorage.setItem('livesCount', 10);
    }
    if(localStorage.getItem('powerUpCount') == null){
        localStorage.setItem('powerUpCount', JSON.stringify(this.availablePowerUp));
    }

    this.localDataModelObj = new localDataModel();
    console.log(this.localDataModelObj);
    this.attempTimerObj = new AttemptTimer();
    this.attempTimeCounter = 10;

    this.updateLife(-1);
    this.currLevelStatus = {
                        "levelStarted" : false,
                        "levelCleared" : false
                     };
    this.unlockedBadgeArr = JSON.parse(localStorage.getItem('unlockedBadgeData')) || [];
    this.unlockedMonsterArr = JSON.parse(localStorage.getItem('unlockedMonsterData')) || [];
    this.isDevice = false;
    if((navigator.userAgent.indexOf("Windows") > 0 || navigator.userAgent.indexOf("Macintosh") > 0) && !navigator.userAgent.match(/iemobile/i) ) {
        this.isDevice = false;
        this.game = new Phaser.Game(1080, 836, Phaser.CANVAS, "game", null, false, false);
    }

    else {
        this.isDevice = true;
        this.game  = new Phaser.Game(640, 836, Phaser.CANVAS, "game", null, false, false);
    }


    this.textMarginForBrowser = 0;
    this.device;
    this.canWidth = this.game.width;
    this.canHeight = this.game.height;
    this.gridStructure =    [[0, 1, 1, 1, 1, 4, 0],
                             [1, 0, 3, 1, 4, 3, 3],
                             [1, 0, 2, 3, 1, 4, 2],
                             [1, 2, 3, 1, 1, 1, 5],
                             [1, 4, 4, 2, 1, 0, 3],
                             [1, 5, 3, 4, 5, 3, 2],
                             [4, 4, 5, 0, 4, 1, 5]];

    if(this.canWidth == 1080){
        this.tutorialStartXPos = 415;
        this.tutorialStartYPos = 432;
        this.tutorialgapBetweenObj = 81;
    }
    else{
        this.tutorialStartXPos = 195;
        this.tutorialStartYPos = 373;
        this.tutorialgapBetweenObj = 81;
    }
    this.tutorialGrid = [[0, 2, 1, 2, 5],
                         [0, 1, 0, 1, 1],
                         [3, 5, 3, 0, 5],
                         [2, 4, 2, 4, 3]];
    this.totalRows = 7;
    this.totalCols = 7;

    if(this.canWidth == 1080){
        this.gridStartXPos = this.percentOfWidth(0.175);
        this.gridStartYPos = 270;
        this.gapBetweenObj = 81;
    }
    else{
        this.gridStartXPos = this.percentOfWidth(0.175);
        this.gridStartYPos = 212;
        this.gapBetweenObj = 81;
    }

    this.levelNo = 1;
    this.currentLevelScore = 0;
    this.currentLEvelStars = 0;

    this.levelTarget = 50;
    this.levelClear = false;
//   Global audio
    this.button_clickAudio;
    this.languageData;

    this.levelData ={
        1: {
            moves: 10,
            targetScore: 1500,
            block: [],
            jelly: [],
            startText: "Ready? Next Target: \n 1500 points in 10 moves!"

        },
        2: {
            moves: 11,
            targetScore: 1600,
            block: [],
            jelly: [],
            startText: "Ready? Next Target: \n 1600 points in 11 moves!"
        },
        3: {
            moves: 12,
            targetScore: 1800,
            block: [],
            jelly: [],
            startText: "Ready? Next Target: \n 1800 points in 12 moves!"
        },
        4: {
            moves: 13,
            targetScore: 2000,
            block: [],
            jelly: [],
            startText: "Ready? Next Target: \n 2000 points in 13 moves!"
        },
        5: {
            moves: 14,
            targetScore: 2100,
            block: [],
            jelly: [],
            startText: "Ready? Next Target: \n 2100 points in 14 moves!"
        },
        6: {
            moves: 15,
            targetScore: 1500,
            block: [],
            jelly: [],
            startText: "Ready? Next Target: \n 1500 points in 15 moves!"
        },
        7: {
            moves: 16,
            targetScore: 2400,
            block: [],
            jelly: [],
            startText: "Ready? Next Target: \n 2400 points in 16 moves!"
        },
        8: {
            moves: 16,
            targetScore: 1600,
            block: [],
            jelly: [],
            startText: "Ready? Next Target: \n 1600 points in 16 moves!"
        },
        9: {
            moves: 18,
            targetScore: 2700,
            block: [],
            jelly: [],
            startText: "Ready? Next Target: \n 2700 points in 18 moves!"
        },
        10: {
            moves: 17,
            targetScore: 1700,
            block: [],
            jelly: [],
            startText: "Ready? Next Target: \n 1700 points in 17 moves!"
        },
        11: {
            moves: 20,
            targetScore: 2000,
            block: [15],
            jelly: [],
            startText: "Ready? Next Target: \n 2000 points in 20 moves!"
        },
        12: {
            moves: 16,
            targetScore: 2600,
            block: [],
            jelly: [],
            startText: "Ready? Next Target: \n 2600 points in 16 moves!"
        },
        13: {
            moves: 22,
            targetScore: 2200,
            block: [],
            jelly: [],
            startText: "Ready? Next Target: \n 2200 points in 22 moves!"
        },
        14: {
            moves: 19,
            targetScore: 2800,
            block: [],
            jelly: [],
            startText: "Ready? Next Target: \n 2800 points in 19 moves!"
        },
        15: {
            moves: 21,
            targetScore: 2500,
            block: [],
            jelly: [24],
            startText: "Ready? Next Target: \n 2500 points in 21 moves! \n clear all crystals"
        },
        16: {
            moves: 12,
            targetScore: 1600,
            block: [],
            jelly: [40],
            startText: "Ready? Next Target: \n Get 1600 points in 12 moves! \n clear all crystals"
        },
        17: {
            moves: 11,
            targetScore: 1300,
            block: [],
            jelly: [22,33],
            startText: "Ready? Next Target: \n Get 1300 points  in 11 moves! \n clear all crystals"
        },
        18: {
            moves: 14,
            targetScore: 1800,
            block: [],
            jelly: [10, 30, 27],
            startText: "Ready? Next Target: \n Get 1800 points in 14 moves! \n clear all crystals"
        },
        19: {
            moves: 16,
            targetScore: 2000,
            block: [],
            jelly: [17,23,25,31],
            startText: "Ready? Next Target: \n Get 2000 points in 16 moves! \n clear all crystals"
        },
        20: {
            moves: 20,
            targetScore: 3800,
            block: [],
            jelly: [1, 12, 23, 38, 41],
            startText: "Ready? Next Target: \n Get 3800 points in 20 moves! \n clear all crystals"
        },
        21: {
            moves: 18,
            targetScore: 2600,
            block: [],
            jelly: [4, 15, 25, 35, 45],
            startText: "Ready? Next Target: \n Get 2600 points in 18 moves! \n clear all crystals"
        },
        22: {
            moves: 16,
            targetScore: 2400,
            block: [],
            jelly: [6,9, 21,26,38],
            startText: "Ready? Next Target: \n Get 2400 points in 16 moves! \n clear all crystals"
        },
        23: {
            moves: 18,
            targetScore: 2800,
            block: [],
            jelly: [0,6,24,42,48],
            startText: "Ready? Next Target: \n Get 2800 points in 18 moves! \n clear all crystals"
        },
        24: {
            moves: 19,
            targetScore: 3000,
            block: [],
            jelly: [8,12,24,36,40],
            startText: "Ready? Next Target: \n Get 3000 points in 19 moves! \n clear all crystals"
        },
        25: {
            moves: 20,
            targetScore: 3200,
            block: [],
            jelly: [8,12,15,19,24,29,33,36,40],
            startText: "Ready? Next Target: \n Get 3200 points in 20 moves! \n clear all crystals"
        },
        26: {
            moves: 22,
            targetScore: 3500,
            block: [22,26],
            jelly: [],
            startText: "Ready? Next Target: \n Get 3500 points in 22 moves!"
        },
        27: {
            moves: 18,
            targetScore: 3000,
            block: [10,38],
            jelly: [],
            startText: "Ready? Next Target: \n Get 3000 points in 18 moves!"
        },
        28: {
            moves: 20,
            targetScore: 3400,
            block: [8,40],
            jelly: [],
            startText: "Ready? Next Target: \n Get 3400 points in 20 moves!"
        },

        29: {
            moves: 12,
            targetScore: 1700,
            block: [12,36],
            jelly: [],
            startText: "Ready? Next Target: \n Get 1700 points in 12 moves!"
        },
        30: {
            moves: 14,
            targetScore: 2000,
            block: [16,18,31],
            jelly: [],
            startText: "Ready? Next Target: \n Get 2000 points in 14 moves!"
        },
        31: {
            moves: 20,
            targetScore: 3200,
            block: [10,36,40],
            jelly: [],
            startText: "Ready? Next Target: \n Get 3200 points in 20 moves!"
        },
        32: {
            moves: 16,
            targetScore: 2600,
            block: [16,18,30,32],
            jelly: [],
            startText: "Ready? Next Target: \n Get 2600 points in 16 moves!"
        },
        33: {
            moves: 22,
            targetScore: 3200,
            block: [12,18,30,36],
            jelly: [],
            startText: "Ready? Next Target: \n Get 3200 points in 22 moves!"
        },
        34: {
            moves: 18,
            targetScore: 2800,
            block: [10,23,25,36,40],
            jelly: [],
            startText: "Ready? Next Target: \n Get 2800 points in 18 moves!"
        },
        35: {
            moves: 19,
            targetScore: 3100,
            block: [7,13,24,35,41],
            jelly: [],
            startText: "Ready? Next Target: \n Get 3100 points in 19 moves!"
        },
        36: {
            moves: 15,
            targetScore: 2400,
            block: [10,38],
            jelly: [8,12,36,40],
            startText: "Ready? Next Target: \n Get 2400 points in 15 moves! \n clear all the crystals"
        },
        37: {
            moves: 10,
            targetScore: 1400,
            block: [13,24,45],
            jelly: [16,18,30,32],
            startText: "Ready? Next Target: \n Get 1400 points in 10 moves! \n clear all the crystals"
        },
        38: {
            moves: 17,
            targetScore: 2800,
            block: [23,24,25],
            jelly: [8,12,36,40],
            startText: "Ready? Next Target: \n Get 2800 points in 17 moves! \n clear all the crystals"
        },
        39: {
            moves: 20,
            targetScore: 3100,
            block: [7,13,17],
            jelly: [25,37,39,41],
            startText: "Ready? Next Target: \n Get 3100 points in 20 moves! \n clear all the crystals"
        },
        40: {
            moves: 22,
            targetScore: 3300,
            block: [31,36,40],
            jelly: [17,22,26,45],
            startText: "Ready? Next Target: \n Get 3300 points in 22 moves! \n clear all the crystals"
        },
        41: {
            moves: 16,
            targetScore: 2700,
            block: [9,11,38],
            jelly: [16,18,31,45],
            startText: "Ready? Next Target: \n Get 2700 points in 16 moves!  \n clear all the crystals"
        },
        42: {
            moves: 22,
            targetScore: 3700,
            block: [7,35,13,41],
            jelly: [2,4,24,42,48],
            startText: "Ready? Next Target: \n Get 3700 points in 22 moves! \n clear all the crystals"
        },
        43: {
            moves: 23,
            targetScore: 4000,
            block: [17,31,42,48],
            jelly: [21,24,27],
            startText: "Ready? Next Target: \n Get 4000 points in 23 moves! \n clear all the crystals"
        },
        44: {
            moves: 24,
            targetScore: 4200,
            block: [8,9,22,23],
            jelly: [18,19,32,33],
            startText: "Ready? Next Target: \n Get 4200 points in 24 moves! \n clear all the crystals"
        },
        45: {
            moves: 18,
            targetScore: 3100,
            block: [14,20,24,28,34,42,48],
            jelly: [17,23,25,31],
            startText: "Ready? Next Target: \n Get 3100 points in 18 moves! \n clear all the crystals"
        },
        46: {
            moves: 21,
            targetScore: 3800,
            block: [22,24,26,42,48],
            jelly: [8,12,16,18,30,32,36,40],
            startText: "Ready? Next Target: \n Get 3800 points in 21 moves! \n clear all the crystals"
        },
        47: {
            moves: 22,
            targetScore: 4500,
            block: [7,8,9,24,39,40,41],
            jelly: [16,23,25,32],
            startText: "Ready? Next Target: \n Get 4500 points in 22 moves! \n clear all the crystals"
        },
        48: {
            moves: 23,
            targetScore: 4700,
            block: [15,19,24,28,34,43,45,47],
            jelly: [10,16,18,30,32,38],
            startText: "Ready? Next Target: \n Get 4700 points in 23 moves! \n clear all the crystals"
        },
        49: {
            moves: 24,
            targetScore: 5000,
            block: [13, 16, 18, 24, 32, 30, 35, 41, 42, 48],
            jelly: [9, 11, 37, 39, 27, 21],
            startText: "Ready? Next Target: \n Get 5000 points in 24 moves! \n clear all the crystals"
        },
        50: {
            moves: 25,
            targetScore: 5500,
            block: [16, 17, 18, 19, 25, 31, 37, 38, 39, 40],
            jelly: [8, 22, 36, 15, 27, 41],
            startText: "Ready? Next Target: \n Get 5500 points in 25 moves! \n clear all the crystals"
        }
    };
    this.fullScreen = false;
    this.objYPositionContainer = new Array();
    this.fullScreenBtn =  this.closefullScreenBtn = null;
    this.game.state.add('LoadingScreen', Game.LoadingScreen);
    this.game.state.add('GameSettings', Game.GameSettings);
    this.game.state.add('MainMenu', Game.MainMenu);
    this.game.state.add('InGameTutorial', Game.InGameTutorial);
    this.game.state.add('LevelUp', Game.LevelUp);
    this.game.state.add('LevelSelection', Game.LevelSelection);
    this.game.state.add('GameOver', Game.GameOver);
    this.game.state.add('MagicMonsters', Game.MagicMonsters);
    this.game.state.start('LoadingScreen');
};
gameConfig.prototype.addPanel = function(){
    if(!this.isDevice){
        this.game.add.sprite(0 ,0, "leftBar");
        this.game.add.sprite(860 ,0, "rightBarLevelUp");
    }
}
gameConfig.prototype.addItems = function(levelNo, stars, score, cleared, currScore){
    if(this.oldLevelData[levelNo - 2] != undefined){
        var total = this.oldLevelData[levelNo - 2].totalScore + currScore; 
        this.currentLevelData = {
                                    "levelNo" : levelNo,
                                    "stars"   : stars,
                                    "score"   : score,
                                    "levelCleared" : cleared,
                                    "totalScore" : total
                                };
        this.oldLevelData[levelNo - 1] = this.currentLevelData;
        localStorage.setItem('levelData', JSON.stringify(this.oldLevelData));
    } 
}
gameConfig.prototype.getLevelInfo = function(levelNo){
    var levelInfo = JSON.parse(localStorage.getItem('levelData'))[levelNo];
    if(levelInfo != null){
        var levelData = JSON.parse(localStorage.getItem('levelData'));
        return levelData[levelNo];
    }
    else{
        return null;
    }
    
}
gameConfig.prototype.getLifeCount = function(){
    return localStorage.getItem('livesCount');
}
gameConfig.prototype.updateLife = function(incrementFactor){
    var lastLevelInfo =   JSON.parse(localStorage.getItem('currLevelStatus'));
    if(lastLevelInfo != null && lastLevelInfo["levelCleared"] == false){
        var lifeRem = parseInt(localStorage.getItem('livesCount'));
        lifeRem += lifeRem > 0 ?  incrementFactor : 0;
        localStorage.removeItem('livesCount');
        localStorage.setItem('livesCount', lifeRem);
        localStorage.removeItem('currLevelStatus');
        if(lifeRem < 10){
            this.localDataModelObj.setstartTime(this.attempTimerObj.setTime());
        }
    }
}
gameConfig.prototype.percentOfWidth = function(factor){
        if(this.canWidth == 1080){
            if(factor == 0)
                return 220;
            else
                return 640 * factor + 220;
        }
        else
            return this.canWidth * factor;

}
gameConfig.prototype.percentOfHeight = function(factor){
    return this.canHeight * factor;
}
gameConfig.prototype.getPowerUp = function(powerUp){
    var temp = JSON.parse(localStorage.getItem('powerUpCount'));
    return temp[powerUp];
}
gameConfig.prototype.updatePowerUp = function(powerUp){
    var temp = JSON.parse(localStorage.getItem('powerUpCount'));
    var updated = temp[powerUp] - 1;
    if(updated >= 0){
        this.availablePowerUp = JSON.parse(localStorage.getItem('powerUpCount'));
        this.availablePowerUp[""+powerUp] = updated;
        localStorage.removeItem('powerUpCount')
        localStorage.setItem('powerUpCount', JSON.stringify(this.availablePowerUp));
    }
    return updated;
}
gameConfig.prototype.playAudio = function(audio, loop){
    if(this.nativeBrowser && (audio.name == "bg_sound" || audio.name == "splash_screen_bg")){
        console.log("inside if");
        if(!this.audioPaused){
            if(loop)
                audio.play('', 0, 1, true);
            else
                audio.play();
        }
    }
    else if(!this.audioPaused && !this.nativeBrowser){
        if(loop)
            audio.play('', 0, 1, true);
        else
            audio.play();
    }
}
gameConfig.prototype.pauseAudio = function(audio){
        audio.pause();
}
gameConfig.prototype.resumeAudio = function(audio){
        audio.resume();
}

gameConfig.prototype.addFullscreenButton = function(x,y,dummy)
{
    configObj.fullScreenBtn = configObj.closefullScreenBtn = null;
    configObj.fullScreenBtn = configObj.game.add.button(x ,y, "fullscreen_icon", dummy ? null : configObj.goFullscreen, this);
    configObj.closefullScreenBtn = configObj.game.add.button(x ,y, "spriteAtlas1", configObj.goFullscreen, this);
    configObj.closefullScreenBtn.frameName = "closefullscreen_icon.png";
    configObj.closefullScreenBtn.visible = this.fullScreen;
    configObj.fullScreenBtn.visible = !this.fullScreen;
    if(configObj.game.device.ie)
    {
        configObj.fullScreenBtn.alpha = 0.5;
    }
};

gameConfig.prototype.goFullscreen = function()
{
    if(configObj.game.device.ie)
        return;

    var element = document.documentElement;
    if (!document.fullscreenElement &&    // alternative standard method
        !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
        configObj.closefullScreenBtn.visible = true;
        configObj.fullScreenBtn.visible = false;
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    } else {
        configObj.closefullScreenBtn.visible = false;
        configObj.fullScreenBtn.visible = true;
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
}

gameConfig.prototype.screenChanged = function() {
    this.fullScreen = !this.fullScreen;
    if(this.fullScreen){
        configObj.closefullScreenBtn.visible = true;
        configObj.fullScreenBtn.visible = false;
    }
    else{
        configObj.closefullScreenBtn.visible = false;
        configObj.fullScreenBtn.visible = true;
    }
    configObj.game.scale.pageAlignHorizontally = true;
    configObj.game.scale.pageAlignVertically = true;
    configObj.game.scale.setShowAll();
    configObj.game.scale.refresh();
}

gameConfig.prototype.initFullscreen = function() {
    this.game.scale.pageAlignHorizontally = true;
    this.game.scale.pageAlignVertically = true;
    document.addEventListener("fullscreenchange", this.screenChanged.bind(this) );
    document.addEventListener("mozfullscreenchange", this.screenChanged.bind(this) );
    document.addEventListener("webkitfullscreenchange", this.screenChanged.bind(this) );
    document.addEventListener("MSFullscreenChange", this.screenChanged.bind(this) );
    window.onresize = this.setFinalScreenSize.bind(this);
}

gameConfig.prototype.setFinalScreenSize = function(){
    configObj.game.scale.pageAlignHorizontally = true;
    configObj.game.scale.pageAlignVertically = true;
    configObj.game.scale.setShowAll();
    configObj.game.scale.refresh();
}

var configObj = new gameConfig();


