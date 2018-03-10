import Phaser from './importPhaser';
import Player from './Player';
import loadState from './states/load';
import mainState from './states/main';
import prepareState from './states/prepare';
import Sounds from './Sounds';

let game,
    gameWidth = 0,
    gameHeight = 0,
    gameObj;


function setGameWidth(width) {
    gameWidth = width;
}


function setGameHeight(height) {
    gameHeight = height;
}


if(window.innerWidth > window.innerHeight) {
    game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, '');
    setGameWidth(window.innerWidth);
    setGameHeight(window.innerHeight);
} else {
    game = new Phaser.Game(window.innerHeight, window.innerWidth, Phaser.CANVAS, '');
    setGameWidth(window.innerHeight);
    setGameHeight(window.innerWidth);
}


Phaser.World.prototype.displayObjectUpdateTransform = function() {
    if (!game.scale.correct) {
        this.x = game.camera.y + game.width;
        this.y = -game.camera.x;
        this.rotation = Phaser.Math.degToRad(Phaser.Math.wrapAngle(90));
    } else {
        this.x = -game.camera.x;
        this.y = -game.camera.y;
        this.rotation = 0;
    }

    window.PIXI.DisplayObject.prototype.updateTransform.call(this);
};


gameObj = {
    init() {
        game.state.add('load', loadState);
        game.state.add('prepare', prepareState);
        game.state.add('main', mainState);
        this._load();
    },


    _load() {
        game.state.start('load');
    },


    addPlayer() {
        if(!this._player) {
            this._player = new Player(this._getPlayerIdentifier());
        }
    },


    _getPlayerIdentifier() {
        return '0';
    },


    _getServerUrl() {
        return 'http://jianfengdoudizhu.game.webxinxin.com';
    },


    get player() {
        return this._player; 
    },


    showAbsenceNum(num) {
        prepareState.showAbsenceNum(num);
    },


    beginGame() {
        Sounds.playBG();
        prepareState.beginGame();
    },


    async dealCards(cards, currentPlayerIndex) {
        await mainState.dealCards(cards, currentPlayerIndex);
    },


    startCallPoints() {
        mainState.startCallPoints();
    },


    showPoint(point, playerIndex) {
        Sounds.playCallPoint(point);
        mainState.showPoint(point, playerIndex);
    },


    async sendDiZhuCards(cards, dizhuIndex) {
        return mainState.sendDiZhuCards(cards, dizhuIndex);
    },


    playCards() {
        mainState.beginPlayCards();
    },


    dropCards(cards) {
        mainState.dropCards(cards);
    },


    showDroppedCards(cards, deckIndex, playerIndex, isCover) {
        Sounds.playCards(cards, deckIndex);
        mainState.showDroppedCards(cards, playerIndex, isCover);
    },


    coverCards() {
        mainState.beginCoverCards();
    },


    discard() {
        Sounds.playDiscard();
        mainState.discard();
    },


    showDiscarded(playerIndex) {
        mainState.showDiscarded(playerIndex);
    },


    showAlarm() {
        Sounds.playAlarm();
    },


    finishGame(win) {
        Sounds.stopBG();
        if(win) {
            Sounds.playWin();
        } else {
            Sounds.playLose();
        }
        mainState.finishGame(win);
    },


    showLeftTime(playerIndex, leftTime) {
        mainState.showLeftTime(playerIndex, leftTime);
    },


    async startGame() {
        return this._player.startGame();
    },


    setConnected(v) {
        this._isConnected = v;
        if(v) {
            prepareState.addBtns();
        }
    },


    get isConnected() {
        return this._isConnected;
    },
};

export default game;
export {gameWidth, gameHeight, setGameWidth, setGameHeight, gameObj};
