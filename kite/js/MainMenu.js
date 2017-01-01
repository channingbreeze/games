Kiteflying.MainMenu = function(game) {};
Kiteflying.MainMenu.prototype = {
    create: function() {
        this.mainMenuBg = this.add.sprite(0, 0, 'mainMenuBg');
        this.add.button(Kiteflying.GAME_WIDTH/2-160, Kiteflying.GAME_HEIGHT/2+100,'button-start', this.startGame, this);
        this.music = this.add.audio('gameMusic', 1, true);
        this.music.play('',0,1,true);

    },
    startGame: function() {
        this.state.start('Game');
    }
};