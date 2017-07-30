var menuState = {
    menus : null,
    start_button: null,
    about_button: null,
    about_panel:null,
    startCallback : function(){
        // fade out
        this.camera.fade('#000', 500);
        this.camera.onFadeComplete.addOnce(function() {
            this.game.state.start('level');
        }, this);        
    },
    aboutReturnCallback: function(){
        this.about_panel.visible = false;
        this.start_button.enable();
        this.about_button.enable();
    },
    aboutCallback : function(){
        this.start_button.disable();
        this.about_button.disable();

        this.about_panel = game.add.group();
        var cx = game.world.centerX;
        var cy = game.world.centerY;
        var aboutbg = game.add.sprite(cx, cy, 'image','window');
        aboutbg.anchor.setTo(0.5, 0.5);
        this.about_panel.add(aboutbg);
        var return_button = new ButtonPrefab(cx, cy + 128, 'return', menuState.aboutReturnCallback, this);
        this.about_panel.add(return_button.button);

        // text
        var content = "Author: lianera\n"+
                      "Link:   lianera.com\n" + 
                      "Powered by Phaser";
        var style = { font: "28px Consolas", fill: "#fff", stroke: '#555',strokeThickness:6};                        
        var text = game.add.text(cx, cy - 64, content, style);
        text.anchor.setTo(0.5,0.5);
        //text.setTextBounds(cx - 128,  cy - 128, 256, 256);
        this.about_panel.add(text);
    },
    
    create: function(){
        // fade in
        this.camera.flash('#000000', 500);
        
        var menu_sprite = game.add.sprite(0, 0, 'image', 'menu');
        //var enter_key = game.input.keyboard.addKey(Phaser.Keyboard.W);
        //enter_key.onDown.addOnce(this.start, this);
        
        this.menus = game.add.group();
        var cx = game.world.centerX;
        var cy = game.world.centerY;
        this.start_button = new ButtonPrefab(cx, cy, 'start', menuState.startCallback, this);
        this.menus.add(this.start_button.button);

        this.about_button = new ButtonPrefab(cx, cy + 96, 'about', menuState.aboutCallback, this);
        this.menus.add(this.about_button.button);
    },
};