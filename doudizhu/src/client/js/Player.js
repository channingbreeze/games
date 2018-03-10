import socket from './MSocket';
import {gameObj} from './Game';
import uuid from 'uuid/v1';
let JsonRpc2 = require('../../util/JsonRpc2');
let eventMgr = require('../../util/EventMgr');
let AbstractActions = require('../../util/AbstractActions');

class Methods {
    constructor(player) {
        this.player = player;
    }


    async showAbsenceNum(num) {
        gameObj.showAbsenceNum(num);
    }


    async startGame() {
        gameObj.beginGame();
        await new Promise(resolve => {
            eventMgr.once('enterMainState', () => {
                resolve();
            });
        });
        return 'done';
    }


    async dealCards(cards, currentPlayerIndex) {
        await gameObj.dealCards(cards, currentPlayerIndex);
        return 'done';
    }


    async callPoint() {
        gameObj.startCallPoints();
        let point = await new Promise(resolve => {
            eventMgr.once('callPoint', p => {
                resolve(p);
            });
        });
        return point;
    }


    showPoint(point, playerIndex) {
        gameObj.showPoint(point, playerIndex);
    }


    async sendDiZhuCards(cards, dizhuIndex) {
        return gameObj.sendDiZhuCards(cards, dizhuIndex);
    }


    async playCards() {
        gameObj.playCards();
        let cards = await new Promise(resolve => {
            eventMgr.once('playCards', cards => {
                resolve(cards);
            });
        });
        return cards;
    }


    async dropCards(cards) {
        return gameObj.dropCards(cards);
    }


    showDroppedCards(cards, deckIndex, playerIndex, isCover) {
        gameObj.showDroppedCards(cards, deckIndex, playerIndex, isCover);
    }


    async coverCards() {
        gameObj.coverCards();
        let {cards, isdiscard} = await new Promise(resolve => {
            eventMgr.once('coverCards', obj => {
                resolve(obj);
            });
        });
        return {covererCards: cards, isDiscard: isdiscard};
    }


    async discard() {
        return gameObj.discard();
    }


    showDiscarded(playerIndex) {
        return gameObj.showDiscarded(playerIndex);
    }


    showAlarm() {
        return gameObj.showAlarm();
    }


    finishGame(win) {
        return gameObj.finishGame(win);
    }


    showLeftTime(playerIndex, leftTime) {
        return gameObj.showLeftTime(playerIndex, leftTime);
    }
}

class Actions extends AbstractActions {
    constructor(player) {
        super();
        this.player = player;
    }


    async startGame() {
        return this.sendRequest('startGame', undefined, uuid());
    }
}

class Player {
    constructor(playIndex) {
        this.playerId = playIndex;
        this.ws = new socket(this.playerId, gameObj._getServerUrl() + '/play');
        this.methods = new Methods(this);
        this.actions = new Actions(this);
        this.jsonrpc = new JsonRpc2(this.methods);
        this.ws.onmessage(data => {
            return this.jsonrpc.execute(data);
        });
        this.ws._socketio.on('connect', () => {
            gameObj.setConnected(true);
        });
    }


    _send(data, callback) {
        this.ws.send(data, callback);
    }


    async startGame() {
        return this.actions.startGame();
    }
}

export default Player;