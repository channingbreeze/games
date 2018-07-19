var isPc;
function loadState(game){
    this.init = function () {
        game.scale.pageAlignHorizontally=true;//水平居中
        function goPC()
        {
            var userAgentInfo = navigator.userAgent;
            var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
            isPc = true;
            for (var v = 0; v < Agents.length; v++) {
                if (userAgentInfo.indexOf(Agents[v]) > 0)
                { isPc = false;
                    break; }
            }
            return isPc;
        }
        goPC();
    }
    this.preload = function () {
        if(!isPc){
            game.load.image('iBox','assets/img/IBox.png');
            game.load.image('lBox','assets/img/LBox.png');
            game.load.image('oBox','assets/img/OBox.png');
            game.load.image('tBox','assets/img/TBox.png');
            game.load.image('xBox','assets/img/XBox.png');
            game.load.image('xBox_','assets/img/XBox_.png');
            game.load.image('lBox_','assets/img/LBox_.png');
            game.load.physics('physicsData',null,Bbox);
            game.load.image('change','assets/img/change.png');
            game.load.image('fxj','assets/img/fxj.png');
        }else{
            game.load.image('line','assets/img/i.png');
            game.load.image('iBox','assets/img/pc/IBox.png');
            game.load.image('lBox','assets/img/pc/LBox.png');
            game.load.image('oBox','assets/img/pc/OBox.png');
            game.load.image('tBox','assets/img/pc/TBox.png');
            game.load.image('xBox','assets/img/pc/XBox.png');
            game.load.image('xBox_','assets/img/pc/XBox_.png');
            game.load.image('lBox_','assets/img/pc/LBox_.png');
            game.load.physics('physicsData',null,pcBox);
            game.load.tilemap('map_2',null,mapTwoJson,Phaser.Tilemap.EAST);
            game.load.tilemap('map_1',null,mapJson,Phaser.Tilemap.EAST);
        }
        game.load.image('startButton_1','assets/img/start-button.png');
        game.load.image('oneButton','assets/img/one.png');
        game.load.image('twoButton','assets/img/two.png');
        game.load.image('mario','assets/img/mario.png');
        game.load.image('down','assets/img/down.png');
        game.load.audio('btn_sound','assets/music/flap.wav');
        game.load.audio('ground_sound','assets/music/ground-hit.wav');
        game.load.audio('score_sound','assets/music/score.wav');
        game.load.spritesheet('bird','assets/img/bird.png',34,24,3);
    }
    this.create = function(){
        game.state.start('menu');
    }
}