var btnSound,groundSound,scoreSound;
var width,height,bird;
function menuState(game){
    this.init = function(){
        //音效
        btnSound = game.add.sound('btn_sound');
        groundSound = game.add.sound('ground_sound');
        scoreSound = game.add.sound('score_sound');
        width = game.width;
        height = game.height;
    }
    this.create = function () {
        game.stage.setBackgroundColor(0x828877);
        if(!isPc){
            game.add.button(game.width/2,game.height/2,'startButton_1',function(){
                game.state.start('play');
            }).anchor.setTo(0.5);
        }else{
            game.add.button(game.width/2-100,game.height/2,'oneButton',function(){
                game.state.start('play');
            }).anchor.setTo(0.5);
            game.add.button(game.width/2+100,game.height/2,'twoButton',function(){
                game.state.start('playTwo');
            }).anchor.setTo(0.5);
        }

    }
}