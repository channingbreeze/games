Game.GameOver = function(){
	
};
Game.GameOver.prototype ={
	create : function(){

        configObj.boosterAPI.event('screen','lose');

		if(!configObj.isDevice){
			configObj.addPanel();
		}
        configObj.addFullscreenButton(982,745);
        
        var levelData = configObj.getLevelInfo(configObj.levelNo - 1);
        this.backGroundImg1 = configObj.game.add.sprite(configObj.percentOfWidth(0), 0, "bg_Img");
		configObj.game.add.sprite(configObj.percentOfWidth(0), 0, "win_graphics");
        configObj.game.add.sprite(configObj.percentOfWidth(0), 685, "winFooter");
        configObj.game.add.sprite(configObj.percentOfWidth(0.20), 270, "spriteAtlas", "level_score.png");
        this.score = configObj.game.add.text(configObj.percentOfWidth(0.51), 310, configObj.languageData["levelUp"]["levelScore"] + ": " + configObj.currentLevelScore , {font : "50px londrina", fill : "#fffeff", align : "center"});
        this.score.anchor.setTo(0.5, 0.5);
        configObj.game.add.sprite(configObj.percentOfWidth(0.26), 357, "spriteAtlas", "highest_score.png");
        this.highScore = configObj.game.add.text(configObj.percentOfWidth(0.51), 375, configObj.languageData["levelUp"]["highScore"] + ": " + levelData.score , {font : "31px londrina", fill : "#ACF1F3", align : "center"});
        this.highScore.anchor.setTo(0.5, 0.5);
        //configObj.game.add.sprite(configObj.percentOfWidth(0.05), 470, "ad_container");
        var retryLevel = configObj.game.add.button(configObj.percentOfWidth(0.118) ,735, "spriteAtlas", this.restartLevel, this);
        retryLevel.frameName = "retry_level.png";
        var levelSelection = configObj.game.add.button(configObj.percentOfWidth(0.312) ,735, "spriteAtlas", this.loadLevelSelectionScreen, this);
        levelSelection.frameName = "level_selc_btn.png"
        this.charImg = configObj.game.add.sprite(configObj.percentOfWidth(0.52), 400, 'char_anim');
        this.charImg.loadTexture('char_anim', 0);
        this.charImg.animations.add('charDance');
        this.charImg.play('charDance', 30, true);
        //this.displayAdd();
	},
	restartLevel : function(){
        configObj.boosterAPI.event('restartLevel');
//        document.getElementById("div-gpt-ad-1409063445073-0").style.display = "none";
        configObj.playAudio(configObj.button_clickAudio);
        configObj.game.state.start('MagicMonsters');
    },
    loadLevelSelectionScreen : function(){
//        document.getElementById("div-gpt-ad-1409063445073-0").style.display = "none";
        configObj.game.state.start('LevelSelection');
    },
    displayAdd : function(){
//        googletag.cmd.push(function() { googletag.display('div-gpt-ad-1409063445073-0'); });
//        document.getElementById("div-gpt-ad-1409063445073-0").style.display = "block";
    },
	update : function(){

	}
}