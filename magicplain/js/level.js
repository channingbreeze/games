var levelState = {
    level_background: null,
    levels : null,
    preload: function(){
    },
    levelCallback : function(i){
        var e = this.levels[i];

        theme_music.fadeOut(500);
        // fade out
        this.camera.fade('#000', 500);
        this.camera.onFadeComplete.addOnce(function() {
            this.game.state.start('play', true, false, e.map, i);
        }, this);        

    },
    returnCallback: function(){
        // fade out
        this.camera.fade('#000', 500);
        this.camera.onFadeComplete.addOnce(function() {
            this.game.state.start('menu');
        }, this);        
    },
    addButton:function(i, type){
            var e = this.levels[i];
            var b = null;
            if(type == 'passed')
                b = game.add.button(e.iconx, e.icony, 'image', () => this.levelCallback(i), this, 'system/system_06', 'system/system_05', 'system/system_07');
            else if(type == 'next')
                b = game.add.button(e.iconx, e.icony, 'image', () => this.levelCallback(i), this, 'system/system_02', 'system/system_01', 'system/system_03');
            else 
                b = game.add.sprite(e.iconx, e.icony, 'image', 'system/system_04');

            b.anchor.setTo(0.5, 0.5);

            var style = { font: "32px Arial", fill: "#ffffff", stroke: '#555555',strokeThickness:4, wordWrap: true, wordWrapWidth: 64};
            var t = game.add.text(e.iconx, e.icony, e.name, style);
            t.anchor.setTo(0.5, 0.45);
    },
    create: function(){
        this.camera.flash('#000000', 500);

        this.level_background = game.add.sprite(0, 0, 'image', 'level');
        var data = game.cache.getJSON('data');
        this.levels = data.levels;

        var is_next = new Array(this.levels.length);
        var is_passed = new Array(this.levels.length);

        var passed_count = 0;
        for(let i in  this.levels){
            var e = this.levels[i];
            var storage = localStorage.getItem('level'+i);
            if(storage == 'true'){
                this.addButton(i, 'passed');
                passed_count++;
                for(var j in e.next){
                    var n = e.next[j];
                    is_next[n] = true;
                }
                is_passed[i] = true;
            }
        }
        for(let i in  this.levels){
            if(is_passed[i])
                continue;
            if(is_next[i]){
                this.addButton(i, 'next');
            }else{
                this.addButton(i, 'unlocked');
            }
        }
        if(passed_count == 0)
            this.addButton(0, 'next');

        // add return button
        this.return_button = new ButtonPrefab(game.world.width - 16, game.world.height - 16, 'return', levelState.returnCallback, this);
        this.return_button.setAnchor(1,1);
    }
};

