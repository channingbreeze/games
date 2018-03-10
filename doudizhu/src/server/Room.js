let Log = require('../util/Log');
let Round = require('./Round');
const CARDSIZE = 54;

class Room {
    constructor(p1, p2, p3) {
        p1.changeRoom(this);
        p2.changeRoom(this);
        p3.changeRoom(this);
        this._players = [p1, p2, p3];
        this._dizhuCards = [];
        this._dizhuIndex = -1;
        this._currentPlayerIndex = 0;
    }


    async startGame() {
        let log = new Log('Room:startGame');
        try {
            this._deal();
            this._currentPlayerIndex = Math.floor(Math.random() * 3);
            await this.boardcast('startGame');
            await this.boardcast('dealCards');
            await this.callPoints();
            await this.boardcast('sendDiZhuCards', [this._dizhuCards]);
            while(this.isGameFinished() === false) {
                await this.processOneRound();
            }
            await this.boardcast('finishGame', [this.winnnerIndexs]);
        } catch (e) {
            log.error(e.message ? e.message : e);
        }
    }


    async boardcast(methodName, params) {
        let promises = null;
        if(this._players[0][methodName] instanceof Function) {
            promises = [];
            for(let p of this._players) {
                if(params instanceof Array) {
                    promises.push(p[methodName](...params));
                } else {
                    promises.push(p[methodName]());
                }
            }
        } else {
            promises = [Promise.reject(new Error(`Player's method ${mathodName} is not defined.`))];
        }
        return await Promise.all(promises);
    }


    async callPoints() {
        let dizhuIndex = 0,
            highestPoint = 0;
        for(let i = 0; i < 3; ++i) {
            await this.boardcast('showLeftTime');
            let point = await this.currentPlayer.callPoint();
            if(point > highestPoint) {
                dizhuIndex = this.currentPlayerIndex;
                highestPoint = point;
            }
            await this.boardcast('showPoint', [point]);
            if(point === 3) {
                dizhuIndex = this.currentPlayerIndex;
                break;
            }
            this.turnToNextPlayer();
            await new Promise(cb => setTimeout(() => cb(), 1000));
        }
        this._currentPlayerIndex = this._dizhuIndex = dizhuIndex;
        this.currentPlayer.cards = this.currentPlayer.cards.concat(this._dizhuCards);
    }


    _deal() {
        let allCards = [];
        for(let i = 0; i < CARDSIZE; ++i) {
            allCards.push(i);
        }
        this._shuffle(allCards);
        this._players[0].cards = allCards.splice(0, 17);
        this._players[1].cards = allCards.splice(0, 17);
        this._players[2].cards = allCards.splice(0, 17);
        this._dizhuCards = allCards;
    }


    _shuffle(cards) {
        for (let i = cards.length; i; i--) {
            let j = Math.floor(Math.random() * i);
            [cards[i - 1], cards[j]] = [cards[j], cards[i - 1]];
        }
    }


    turnToNextPlayer() {
        this._currentPlayerIndex = (this._currentPlayerIndex + 1) % 3;
    }


    isGameFinished() {
        let playerHasNonCards = this._players.find(p => p.cards.length === 0);
        return playerHasNonCards !== undefined;
    }


    async processOneRound() {
        let round = new Round(this);
        await round.run();
    }


    get currentPlayer() {
        return this._players[this._currentPlayerIndex];
    }


    get currentPlayerIndex() {
        return this._currentPlayerIndex;
    }


    get players() {
        return this._players;
    }


    get winnnerIndexs() {
        if(this.isDizhuWin()) {
            return [this._dizhuIndex];
        } else {
            return [(this._dizhuIndex + 1) % 3, (this._dizhuIndex + 2) % 3];
        }
    }


    get dizhuIndex() {
        return this._dizhuIndex;
    }


    get hitOutCards() {
        let allCards = [];
        for(let i = 0; i < CARDSIZE; ++i) {
            allCards.push(i);
        }
        let playerCards = this._players.reduce((cards, player) => {
            return cards.concat(player.cards);
        }, []);
        return allCards.filter(card => playerCards.includes(card) === false);
    }


    isDizhuWin() {
        let dizhu = this._players[this._dizhuIndex];
        return dizhu.cards.length === 0;
    }
}

module.exports = Room;