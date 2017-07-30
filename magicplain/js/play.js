var playState = {
    panel: null,
    player: null,
    input: null,
    popup_menu: null,
    map: null,
    level: null,
    battle_music: null,
    init: function(map, level){
        this.map = map;
        this.level = level;
    },
    preload: function(){
        game.time.advancedTiming = true;
        // load map
        var maps = game.cache.getJSON('maps');  
        var map_obj = maps[this.map];          
        game.load.tilemap(this.map, null, map_obj, Phaser.Tilemap.TILED_JSON);
    },
    resumeCallback: function(){
        this.popup_menu.visible = false;
        game.paused = false;
        sound.play('butpressed');
    },
    returnToLevel: function(){
        if(this.battle_music)
            this.battle_music.fadeOut(500);
        // fade out
        this.camera.fade('#000', 500);
        this.camera.onFadeComplete.addOnce(function() {
            sound.play('theme_music');
            this.game.state.start('level');
        }, this);   
    },
    returnCallback: function(){
        this.popup_menu.visible = false;
        game.paused = false;
        sound.play('butpressed');
        
        this.returnToLevel();

    },
    onMenu: function(){
        game.paused = true;
        // popup menu
        this.popup_menu = game.add.group();
        var cx = game.world.centerX;
        var cy = game.world.centerY;
        var popbg = game.add.sprite(cx, cy, 'image', 'popup');
        popbg.anchor.setTo(0.5, 0.5);
        this.popup_menu.add(popbg);

        this.resume_button = new ButtonPrefab(cx, cy, 'resume', playState.resumeCallback, this);
        this.popup_menu.add(this.resume_button.button);
        this.return_button = new ButtonPrefab(cx, cy + 96, 'return', playState.returnCallback, this);
        this.popup_menu.add(this.return_button.button);
    },    
    create: function(){
        // fade in
        this.camera.flash('#000000', 500);

        this.esc = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
        this.esc.onDown.add(this.onMenu, this);

        panel = new Panel(this.map);
        panel.createCharacters();

        game.time.events.add(Phaser.Timer.SECOND * 2.5, function(){
            // play music
            this.battle_music = sound.play('battle_music');
        }, this);     
 
    },
    showReadyGo : function(){
        // 'ready' 'go' text
        var cx = game.world.centerX;
        var cy = game.world.centerY;
        this.ready_label = game.add.text(cx, cy, 'READY', 
                {font: '64px Arial', fill: '#ffffff', stroke: '#a50',strokeThickness:10});
        this.ready_label.anchor.setTo(0.5, 0.5);
        this.ready_count = 0;
        this.timer = game.time.events.loop(250, function(){
            var t = ['READY', 'READY','READY', 'READY','GO'];
            if(this.ready_count < t.length){
                game.world.bringToTop(this.ready_label);
                this.ready_label.text = t[this.ready_count];
                //this.ready_label.scale.set(1,1);
                this.ready_label.alpha = 0;
                game.add.tween(this.ready_label).to( { alpha: 1 }, 200, Phaser.Easing.Quartic.InOut, true);
                //game.add.tween(this.ready_label.scale).to( { x: 1.1, y:1.1 }, 300, Phaser.Easing.Quartic.Out, true);
            }else{
                game.time.events.remove(this.timer);
                this.ready_label.visible = false;
                panel.status = 'playing';
            }
            if(this.ready_count == 0){
                sound.play('readygo');
            }
            this.ready_count++;
        }, this);

        panel.status = 'ready_waiting';
    },
    showResult : function(text){
        panel.player.standStill();
        for(var e in panel.enemies){
            panel.enemies[e].standStill();
        }
        this.battle_music.stop();

        var cx = game.world.centerX;
        var cy = game.world.centerY;       
        var menu_sprite = game.add.sprite(cx, cy, 'image', 'window');
        menu_sprite.scale.set(0.5,0.5);
        menu_sprite.anchor.setTo(0.5,0.5);
        if(text == '胜利'){
            var emitter = game.add.emitter(cx, cy, 100);
            emitter.setXSpeed(-300, 300);
            emitter.setYSpeed(-300, 300);
            var ani = Phaser.Animation.generateFrameNames('effects/effect_', 41, 48, '', 2);
            emitter.makeParticles('image', ani);
            emitter.gravity = 150;
            emitter.start(true, this.explosion_time, null, 100);            
        }        
        this.result_label = game.add.text(cx, cy, text, 
            {font: '72px Arial', fill: '#ffffff', stroke: '#850',strokeThickness:10});
        this.result_label.anchor.setTo(0.5, 0.5);
        this.result_label.scale.set(0.1,0.1);
        var tween = game.add.tween(this.result_label.scale).to( { x:1, y:1 }, 1500, Phaser.Easing.Quartic.InOut, true);
        //tween.yoyo(true, 500);
        panel.status = 'ending';

        game.time.events.add(Phaser.Timer.SECOND * 4, function(){
            this.returnToLevel();
        }, this);     
           
    },
    
    update: function(){
        panel.update();
        if(panel.status == 'ready'){
            this.showReadyGo();

            // manually victory/failed
            // panel.enemies = [];
            // panel.player.state = 'dead';
        }if(panel.status == 'victory'){
            localStorage.setItem('level'+this.level, 'true');
            this.showResult('胜利');
            // play sound
            sound.play('victory');
                
        }else if(panel.status == 'failed'){
            this.showResult('失败');
            // play sound
            sound.play('failed');                
        }
    },
    render: function() {
	    //game.debug.text('fps:'+game.time.fps, 2, 14, "#fff");
    }    
};