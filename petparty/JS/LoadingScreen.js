/**
 * Created with JetBrains WebStorm.
 * User: vivek.d
 * Date: 4/10/14
 * Time: 3:16 PM
 * To change this template use File | Settings | File Templates.
 */

var Game = {};
Game.LoadingScreen = function(){
};
Game.LoadingScreen.prototype = {
    preload : function(){
        configObj.game.stage.backgroundColor = "#8f28b0";
        configObj.game.load.json("language", "language.json");
        configObj.game.load.image("background", "assets/images/loadingScreen/Loading_bg.jpg");
        configObj.game.load.image("leftBar", "assets/images/game/left_side_bar.jpg");
        configObj.game.load.image("rightBarLevelUp", "assets/images/levelup/right_bar.jpg");
        configObj.game.load.spritesheet("gameHero", "assets/images/loadingScreen/Cat_spritesheet.png", 300, 285, 20);
        configObj.game.load.spritesheet("char_anim", "assets/images/levelup/character_Anim.png", 281, 362, 12);
        configObj.game.load.spritesheet("retry_ch", "assets/images/levelup/retry_ch.png", 166, 252,12);
        configObj.game.load.image("fullscreen_icon", "assets/images/game/fullscreen_icon.png");
        if(configObj.isDevice){
            configObj.game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
            configObj.game.scale.pageAlignHorizontally = true;
            configObj.game.scale.pageAlignVertically = true;
            configObj.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            configObj.game.scale.setScreenSize();
            configObj.game.scale.refresh();
        }
        else{
            Phaser.Canvas.setSmoothingEnabled(this.game.context, false);
            configObj.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            configObj.game.scale.setScreenSize();
            configObj.game.scale.refresh();
        }

    },
    create : function() {
        var ua = navigator.userAgent;
        var samsung = /samsung|GT-/gi.test(ua);

        Booster.onOpenTab = function () { configObj.game.stage.disableVisibilityChange = true; };

        Booster.onCloseTab = function () { configObj.game.stage.disableVisibilityChange = false; };



        if(configObj.game.device.firefox){
            configObj.textMarginForBrowser = 5;
        }

        if(!configObj.isDevice){
            configObj.addPanel();
            configObj.game.add.sprite(220, 0, "background");
            this.heroImg = configObj.game.add.sprite(400, 230, 'gameHero');
            this.heroImg.loadTexture('gameHero');
            this.heroImg.animations.add('jump');
            this.heroImg.animations.play('jump', 25, true);
            this.text = configObj.game.add.text(448, 520, '', { font : "40px londrina", fill: '#a26829', fontWeight : 'bold'});
            configObj.addFullscreenButton(982,745,true);
        }
        else{

            configObj.game.add.sprite(0, 0, "background");
            this.heroImg = configObj.game.add.sprite(180, 230, 'gameHero');
            this.heroImg.loadTexture('gameHero');
            this.heroImg.animations.add('jump');
            this.heroImg.animations.play('jump', 25, true);
            this.text = configObj.game.add.text(228, 520, '', { font : "40px londrina", fill: '#a26829', fontWeight : 'bold'});
        }
        configObj.game.load.onLoadStart.add(this.loadStart, this);
        configObj.game.load.onFileComplete.add(this.fileComplete, this);
        configObj.game.load.onLoadComplete.add(this.loadComplete, this);

        //	Progress report

        this.scaleForDevice();
        this.start();
    },

    start : function () {
        //        Img pack
        configObj.game.load.atlasXML('spriteAtlas', 'assets/images/imgPack/sprites.png', 'assets/images/imgPack/sprites.xml');
        configObj.game.load.atlasXML('spriteAtlas1', 'assets/images/imgPack/Pack2/sprites.png', 'assets/images/imgPack/Pack2/sprites.xml');

//      Main menu
        configObj.game.load.image("background", "assets/images/mainmenu/bg_main_menu.png");
        configObj.game.load.image("char_img", "assets/images/mainmenu/char_img.png");
        configObj.game.load.spritesheet("char_eyes0", "assets/images/mainmenu/char_eyes0.png", 217, 90, 2);
        configObj.game.load.spritesheet("char_eyes1", "assets/images/mainmenu/char_eyes1.png", 141, 80, 2);
        configObj.game.load.spritesheet("char_eyes2", "assets/images/mainmenu/char_eyes2.png", 190, 95, 2);


        // Contains the loading of files for game settings screen
        configObj.game.load.image("tint_background", "assets/images/GameSettings/tint_bg.png");
        configObj.game.load.image("bg_disable", "assets/images/GameSettings/bg_disable.png");
        configObj.game.load.image("game_setting", "assets/images/GameSettings/game_setting.png");
        configObj.game.load.image("game_setting1", "assets/images/GameSettings/game_setting1.png");

        //Contains the loading of image files for level selection screen

        configObj.game.load.image("level_select_bg1", "assets/images/levelselection/level_selection_bg1.png");
        configObj.game.load.image("overlay", "assets/images/levelselection/overlay.png");
        configObj.game.load.image("level_info_Bg", "assets/images/levelselection/levelInfoBG.png");
        configObj.game.load.image("bigStar", "assets/images/levelselection/bigStar.png");

        configObj.game.load.image("buy_popup", "assets/images/shop/buy_popup.png");

//        Game screen
        configObj.game.load.image("Game_background", "assets/images/game/bg_game_screen.png");
        configObj.game.load.spritesheet("jelly_animation", "assets/images/game/jelly_animation.png", 343, 348, 20);
        configObj.game.load.image("rightBar", "assets/images/game/right_side_bar.png");

        configObj.game.load.spritesheet("tap_hands", "assets/images/game/tap_hand.png", 58 ,52, 2);
        configObj.game.load.spritesheet("hand_anim", "assets/images/game/hand_anim.png", 57 ,56, 10);

        configObj.game.load.spritesheet("extra_moves", "assets/images/game/extra_moves.png", 192, 137, 2);
        configObj.game.load.spritesheet("magic_ring", "assets/images/game/magic_ring.png", 192, 125, 2);
        configObj.game.load.spritesheet("magic_stick", "assets/images/game/magic_stick.png", 192, 134, 2);
        configObj.game.load.spritesheet("powerUpRing", "assets/images/game/mobile/magicRing.png", 55, 55, 2);
        configObj.game.load.spritesheet("universalPowerUp", "assets/images/game/mobile/magicStick.png", 63, 62 ,2);
        configObj.game.load.spritesheet("addMoreMoves", "assets/images/game/mobile/extraMoves.png", 61 ,59, 2);

//      Monsters Image
        configObj.game.load.spritesheet("monster0", "assets/images/game/monster0.png", 80, 80, 2);
        configObj.game.load.spritesheet("monster1", "assets/images/game/monster1.png", 80, 80, 2);
        configObj.game.load.spritesheet("monster2", "assets/images/game/monster2.png", 80, 80, 2);
        configObj.game.load.spritesheet("monster3", "assets/images/game/monster3.png", 80, 80, 2);
        configObj.game.load.spritesheet("monster4", "assets/images/game/monster4.png", 80, 80, 2);
        configObj.game.load.spritesheet("monster5", "assets/images/game/monster5.png", 80, 80, 2);
//      Power Ups
        configObj.game.load.spritesheet("super0", "assets/images/game/powerup0.png", 80, 80, 2);
        configObj.game.load.spritesheet("super1", "assets/images/game/powerup1.png", 80, 80, 2);
        configObj.game.load.spritesheet("super2", "assets/images/game/powerup2.png", 80, 80, 2);
        configObj.game.load.spritesheet("super3", "assets/images/game/powerup3.png", 80, 80, 2);
        configObj.game.load.spritesheet("super4", "assets/images/game/powerup4.png", 80, 80, 2);
        configObj.game.load.spritesheet("super5", "assets/images/game/powerup5.png", 80, 80, 2);

        configObj.game.load.spritesheet("score0", "assets/images/game/score0.png", 40, 54);
        configObj.game.load.spritesheet("score1", "assets/images/game/score1.png", 40, 54);
        configObj.game.load.spritesheet("score2", "assets/images/game/score2.png", 40, 54);
        configObj.game.load.spritesheet("score3", "assets/images/game/score3.png", 40, 54);
        configObj.game.load.spritesheet("score4", "assets/images/game/score4.png", 40, 54);
        configObj.game.load.spritesheet("score5", "assets/images/game/score5.png", 40, 54);

        configObj.game.load.image("universal", "assets/images/game/mobile/universal.png");
        configObj.game.load.image("header", "assets/images/game/mobile/header.png");
        configObj.game.load.image("footer", "assets/images/game/mobile/footer.png");
        configObj.game.load.image("Game_background_mbl", "assets/images/game/mobile/bg_game_screen.png");
        configObj.game.load.image("hud_BGLayer", "assets/images/game/mobile/hud_BGLayer.png");

//       Level Up
        configObj.game.load.image("bg_Img", "assets/images/levelup/bg_Img.jpg");
        configObj.game.load.image("win", "assets/images/levelup/win.jpg");
        configObj.game.load.image("levelup_footer", "assets/images/levelup/levelup_footer.jpg");

        configObj.game.load.image("ad_container", "assets/images/levelup/ad_container.png");
//        Level fail
        configObj.game.load.image("try_again_footer", "assets/images/levelup/try_again_footer.jpg");

        configObj.game.load.image("win_graphics", "assets/images/winScreen/win_graphics.png");
        configObj.game.load.image("winFooter", "assets/images/winScreen/winFooter.jpg");

//      Audio
        configObj.game.load.audio('splash_screen_bg', ['assets/audio/splash_screen_bgSound.mp3', 'assets/audio/splash_screen_bgSound.ogg']);
        configObj.game.load.audio('bg_sound', ['assets/audio/mm_bg.ogg', 'assets/audio/mm_bg.mp3']);
        configObj.game.load.audio('button_click', ['assets/audio/button_click.mp3', 'assets/audio/button_click.ogg']);
        configObj.game.load.audio('swipe', ['assets/audio/swipe.mp3', 'assets/audio/swipe.ogg']);
        configObj.game.load.audio('wrong_move', ['assets/audio/wrong_move.mp3', 'assets/audio/wrong_move.ogg']);
        configObj.game.load.audio('level_up', ['assets/audio/level_up.mp3', 'assets/audio/level_up.ogg']);
        configObj.game.load.audio('level_fail', ['assets/audio/level_fail.mp3', 'assets/audio/level_fail.ogg']);
        configObj.game.load.audio('new_spawn', ['assets/audio/new_spawn.mp3', 'assets/audio/new_spawn.ogg']);

        configObj.game.load.audio('monster0', ['assets/audio/monster0.mp3', 'assets/audio/monster0.ogg']);
        configObj.game.load.audio('monster1', ['assets/audio/monster1.mp3', 'assets/audio/monster1.ogg']);
        configObj.game.load.audio('monster2', ['assets/audio/monster2.mp3', 'assets/audio/monster2.ogg']);
        configObj.game.load.audio('monster3', ['assets/audio/monster3.mp3', 'assets/audio/monster3.ogg']);
        configObj.game.load.audio('monster4', ['assets/audio/monster4.mp3', 'assets/audio/monster4.ogg']);
        configObj.game.load.audio('monster5', ['assets/audio/monster5.mp3', 'assets/audio/monster5.ogg']);
        configObj.game.load.audio('level_start', ['assets/audio/level_start.mp3', 'assets/audio/level_start.ogg']);
        configObj.game.load.audio('level_finish', ['assets/audio/level_finish.mp3', 'assets/audio/level_finish.ogg']);
        configObj.game.load.audio('punch', ['assets/audio/punch.mp3', 'assets/audio/punch.ogg']);
        configObj.game.load.audio('powermonster', ['assets/audio/powermonster.mp3', 'assets/audio/powermonster.ogg']);
        configObj.game.load.audio('jellybreak', ['assets/audio/jellybreak.mp3', 'assets/audio/jellybreak.ogg']);
        configObj.game.load.audio('no_more_moves', ['assets/audio/no_more_moves.mp3', 'assets/audio/no_more_moves.ogg']);
        this.preparing = configObj.game.add.text(configObj.percentOfWidth(0.365), 610, '', { font : "30px londrina", fill: '#a26829' });

        configObj.game.load.start();
    },

    loadStart : function(){
    },

//	This callback is sent the following parameters:
    fileComplete : function (progress, cacheKey, success, totalLoaded, totalFiles) {
        this.text.setText("loading: " + progress + "%");
        this.preparing.destroy();
        this.preparing = configObj.game.add.text(configObj.percentOfWidth(0.365), 610, 'Preparing Party!', { font : "30px londrina", fill: '#a26829' });
    },

    loadComplete : function() {
        configObj.game.state.start('MainMenu');
    },
    scaleForDevice : function(){
       configObj.device = new Phaser.Device();
    },

    enterIncorrectOrientation: function () {
        Game.orientated = false;
    },
    leaveIncorrectOrientation: function () {
        Game.orientated = true;
    },
    update : function(){
//        if(this.cache.isSoundDecoded('splash_screen_bg')){
//            configObj.game.state.start('MainMenu');
//        }
//        if(this.cache.isSoundDecoded('splash_screen_bg') && this.cache.isSoundDecoded('bg_sound') &&  this.cache.isSoundDecoded('swipe') &&
//            this.cache.isSoundDecoded('wrong_move') && this.cache.isSoundDecoded('level_up') && this.cache.isSoundDecoded('level_fail') &&
//            this.cache.isSoundDecoded('monster0') && this.cache.isSoundDecoded('monster1') && this.cache.isSoundDecoded('monster2')&&
//            this.cache.isSoundDecoded('monster3') && this.cache.isSoundDecoded('monster4') && this.cache.isSoundDecoded('monster5')
//            && this.cache.isSoundDecoded('new_spawn') && this.cache.isSoundDecoded('level_start') && this.cache.isSoundDecoded('level_finish') &&
//            this.cache.isSoundDecoded('punch') && this.cache.isSoundDecoded('powermonster')){
//            configObj.game.state.start('MainMenu');
//        }
    }
};
