let JsonRpc2 = require('../util/JsonRpc2');
let uuid = require('uuid/v1');
let AbstractActions = require('../util/AbstractActions');
let playerQueue = require('./PlayerQueue');
let jayson = require('jayson');
let CardsAnalysis = require('../rule/CardsAnalysis');
let Log = require('../util/Log');
let TimeoutError = require('../util/errors/TimeoutError');
let config = require('./config');

const ONE_HOUR = 60 * 60 * 1000;


class Methods {
    constructor(player) {
        this.player = player;
    }


    startGame() {
        playerQueue.add(this.player);
    }
}


class Actions extends AbstractActions {
    constructor(player) {
        super();
        this.player = player;
    }


    async showAbsenceNum(num) {
        return this.sendRequest('showAbsenceNum', [num]);
    }


    async startGame() {
        return this.sendRequest('startGame', undefined, uuid());
    }


    async dealCards() {
        return this.sendRequest('dealCards', [this.player.cards, this.player.relativeCurrentPlayerIndex], uuid());
    }


    async callPoint() {
        return this.sendRequest('callPoint', undefined, uuid()).then(v => {
            return JsonRpc2.getReponseResult(v);
        });
    }


    async showPoint(point) {
        return this.sendRequest('showPoint', [point, this.player.relativeCurrentPlayerIndex]);
    }


    async sendDiZhuCards(cards) {
        return this.sendRequest('sendDiZhuCards', [cards, this.player.relativeCurrentPlayerIndex], uuid());
    }


    async playCards(timeout) {
        return this.sendRequest('playCards', undefined, uuid(), timeout).then(v => {
            return JsonRpc2.getReponseResult(v);
        });
    }


    async dropCards(cards) {
        return this.sendRequest('dropCards', [cards], uuid());
    }


    async showDroppedCards(cards, deckIndex, isCover) {
        return this.sendRequest('showDroppedCards', [cards, deckIndex, this.player.relativeCurrentPlayerIndex, isCover]);
    }


    async coverCards(sender, senderDeck, timeout) {
        return this.sendRequest('coverCards', undefined, uuid(), timeout).then(v => {
            return JsonRpc2.getReponseResult(v);
        });
    }


    async discard() {
        return this.sendRequest('discard', undefined, uuid());
    }


    async showDiscarded() {
        this.sendRequest('showDiscarded', [this.player.relativeCurrentPlayerIndex]);
    }


    async showAlarm() {
        this.sendRequest('showAlarm');
    }


    async finishGame(win) {
        return this.sendRequest('finishGame', [win], uuid());
    }


    async showLeftTime() {
        return this.sendRequest('showLeftTime', [this.player.relativeCurrentPlayerIndex, config.ACTION_TIME_OUT / 1000]);
    }
}


class SimpleAction {
    constructor(player) {
        this.player = player;
        this.timeout = 2 * 1000;
    }


    showAbsenceNum(num) {}


    startGame() {}


    dealCards() {}


    async callPoint() {
        return this.futureResult(1);
    }


    showPoint() {}


    sendDiZhuCards() {}


    async playCards() {
        return this.futureResult([this.player.cards[0]]);
    }


    dropCards(cards) {}


    showDroppedCards() {}


    async coverCards(sender, senderDeck) {
        return this.futureResult({
            covererCards: [],
            isDiscard: true
        });
    }


    discard() {}


    showDiscarded() {}


    showAlarm() {}


    finishGame() {}


    showLeftTime() {}


    futureResult(result) {
        return new Promise(r => {
            setTimeout(() => {
                r(result);
            }, this.timeout);
        });
    }
}


class AiAction extends SimpleAction {
    constructor(player) {
        super(player);
        this.client = jayson.client.http(player.aiServerUrl);
    }


    async callPoint() {
        return this._sendRequest('callPoint', [{myCards: this.player.cards}]);
    }


    async playCards() {
        return this._sendRequest('play', [{
            landlordIndex: this.getLandlordIndex(),
            myCards: this.player.cards,
            preCardLeft: this.player.prePlayer.cards.length,
            postCardLeft: this.player.postPlayer.cards.length,
            hitOutCardStack: this.player.room.hitOutCards
        }]);
    }


    coverCards(sender, senderDeck) {
        let cardsFrom;
        if(sender === this.player.prePlayer) {
            cardsFrom = -1;
        } else {
            cardsFrom = 1;
        }
        return this._sendRequest('cover', [{
            landlordIndex: this.getLandlordIndex(),
            myCards: this.player.cards,
            preCardLeft: this.player.prePlayer.cards.length,
            postCardLeft: this.player.postPlayer.cards.length,
            hitOutCardStack: this.player.room.hitOutCards,
            cardsFrom,
            cards: senderDeck.cardIndexs,
            deckIndex: CardsAnalysis.getDeckClassIndex(senderDeck)
        }]).then(cards => {
            return {
                covererCards: cards,
                isDiscard: cards.length === 0
            };
        });
    }


    async _sendRequest(methodName, params, useDelay = true) {
        let log = new Log('AiAction:_sendRequest');
        const minResponseTime = 2000;
        let p = new Promise((resolve, reject) => {
            this.client.request(methodName, params, function(err, response) {
                if(err) {
                    log.warn(err.message);
                    reject(new Error(err.message));
                    return;
                }
                if(response.error) {
                    reject(new Error(response.error));
                } else {
                    resolve(response.result);
                }
            });
        });
        let pt = new Promise(r => {
            setTimeout(() => {
                r();
            }, minResponseTime);
        });
        let pp = [];
        if(useDelay) {
            pp = [p, pt];
        } else {
            pp = [p];
        }
        return Promise.all(pp).then(values => {
            return values[0];
        });
    }


    getLandlordIndex() {
        let landlordIndex;
        let dizhuIndex = this.player.relativeDizhuIndex;
        if(dizhuIndex === 0) {
            landlordIndex = 0;
        } else if(dizhuIndex === 1) {
            landlordIndex = 1;
        } else {
            landlordIndex = -1;
        }
        return landlordIndex;
    }
}


class Player {
    constructor(id, socket, aiServerUrl) {
        this._id = id;
        this.socket = socket;
        this.room = null;
        this.methods = new Methods(this);
        this.jsonrpc = new JsonRpc2(this.methods);
        this.aiServerUrl = aiServerUrl;
        this._cards = [];
        this.aiActions = new AiAction(this);
        this.localAction = new SimpleAction(this);
        if(this.socket) {
            this.actions = new Actions(this);
            this.socket.on(data => {
                return this.jsonrpc.execute(data);
            });
            socket.socketio.on('disconnect', () => {
                this.removeFromPlayerQueue();
                if(this.room !== null) {
                    this.actions = new AiAction(this);
                }
            });
            socket.socketio.on('error', (error) => {
                let log = new Log('Player:constructor');
                log.error(error);
            });
        } else {
            this.actions = this.aiActions;
        }
    }


    get id() {
        return this._id;
    }


    set cards(c) {
        this._cards = c;
    }


    get cards() {
        return this._cards;
    }


    changeRoom(room) {
        this.room = room;
    }


    getRoom() {
        return this.room;
    }


    _send(data, callback) {
        this.socket.emit(data, callback);
    }


    isOnline() {
        return this.socket && this.socket.isConnected();
    }


    async showAbsenceNum(num) {
        return this.doAction('showAbsenceNum', [num]);
    }


    async startGame() {
        return this.doAction('startGame');
    }


    async dealCards() {
        return this.doAction('dealCards');
    }


    async callPoint() {
        return this.doAction('callPoint');
    }


    async showPoint(point) {
        return this.doAction('showPoint', [point]);
    }


    async sendDiZhuCards(cards) {
        return this.doAction('sendDiZhuCards', [cards]);
    }


    async playCards(timeout) {
        let cards;
        do {
            cards = await this.doAction('playCards', [timeout]);
        } while(this._isCardsInHand(cards) === false);
        return cards;
    }


    async dropCards(cards) {
        this._cards = this._cards.filter(c => cards.includes(c) === false);
        return this.doAction('dropCards', [cards]);
    }


    async showDroppedCards(cards, isCover) {
        return this.doAction('showDroppedCards', [cards, isCover]);
    }


    async coverCards(sender, senderDeck, timeout) {
        return this.doAction('coverCards', [sender, senderDeck, timeout]);
    }


    async discard() {
        return this.doAction('discard');
    }


    async showDiscarded() {
        return this.doAction('showDiscarded');
    }


    async showAlarm() {
        if(this.currentPlayerIsMe() === false) {
            return this.doAction('showAlarm');
        }
        return null;
    }


    async finishGame(winnnerIndexs) {
        let win = winnnerIndexs.includes(this.selfIndex);
        return this.doAction('finishGame', [win]);
    }


    async showLeftTime() {
        return this.doAction('showLeftTime');
    }


    async doAction(actionName, params = []) {
        let log = new Log('Player:doAction');
        try {
            return await this.actions[actionName](...params);
        } catch(e) {
            log.warn(e.message ? e.message : e);
            if(this.actions !== this.aiActions) {
                try {
                    return await this.aiActions[actionName](...params);
                } catch(e) {
                    log.warn(e.message ? e.message : e);
                    return this.localAction[actionName](...params);
                }
            } else {
                return this.localAction[actionName](...params);
            }
        }
    }


    _isCardsInHand(cards) {
        for(let c of cards) {
            if(this._cards.includes(c) === false) {
                return false;
            }
        }
        return true;
    }


    get selfIndex() {
        return this.room.players.findIndex(p => p === this);
    }


    get relativeCurrentPlayerIndex() {
        return this.getRelativePlayerIndex(this.room.currentPlayerIndex);
    }


    get relativeDizhuIndex() {
        return this.getRelativePlayerIndex(this.room.dizhuIndex);
    }


    get prePlayer() {
        let prePlayerIndex = (this.selfIndex + 2) % 3;
        return this.room.players[prePlayerIndex];
    }


    get postPlayer() {
        let postPlayerIndex = (this.selfIndex + 1) % 3;
        return this.room.players[postPlayerIndex];
    }


    //0代表是自己，1代表是下家，2代表是上家
    getRelativePlayerIndex(index) {
        let selfIndex = this.selfIndex;
        return (index - selfIndex + 3) % 3;
    }


    currentPlayerIsMe() {
        return this.relativeCurrentPlayerIndex === 0;
    }


    removeFromPlayerQueue() {
        playerQueue.remove(this);
    }
}

module.exports = Player;