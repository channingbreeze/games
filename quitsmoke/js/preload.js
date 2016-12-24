var preload = function(game){}

preload.prototype = {
    preload: function(){

        // this add Text if come from libs/helper.js
        addText(this.game, this.game.world.centerX, 
            this.game.world.centerY-100, "Quit\n Smoking", "80px Arial");

        this.loadProcess = addText(this.game, 
            this.game.world.centerX, 
            this.game.world.centerY + 100, 
            "Loading 0%","14px Arial");
        
        addText(this.game, 
            this.game.world.centerX, 
            this.game.world.height-30, 
            "Author: hexcola\n Inspired by a Quit Smoking Poster","14px Arial");

        var preloadbarBorder = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 60, 'preloadbarBorder');
        preloadbarBorder.anchor.setTo(0.5);

        this.preloadbar = this.add.sprite(this.game.world.centerX - 83.5, this.game.world.centerY + 60, 'preloadbar');
        this.preloadbar.anchor.setTo(0, 0.5);
        this.load.setPreloadSprite(this.preloadbar);

        this.load.onLoadComplete.add(this.loadComplete, this);
        

        // load audio resource
        this.game.load.audiosprite(this.game.customConfig.audioSprite.key,
            this.game.customConfig.audioSprite.urls,
            this.game.customConfig.audioSprite.atlasURL);
        
        this.game.load.atlasJSONArray(this.game.customConfig.imageSprite.key,
            this.game.customConfig.imageSprite.textureURL,
            this.game.customConfig.imageSprite.atlasURL);
    },

    loadUpdate: function(){
        this.loadProcess.setText("Loading " + this.load.progress + "%");
    },

    loadComplete: function(){
        this.ready = true;
    },

    create: function(){
        this.game.allAudios = this.game.add.audioSprite('defaultRes_audio');
        this.game.allAudios.allowMultiple = true;

        this.game.state.start('MainMenu');
    },
}