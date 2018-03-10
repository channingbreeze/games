let CardsAnalysis = require('../rule/CardsAnalysis');
const config = require('./config');

class Round {
    constructor(room) {
        this.room = room;
        this.sender = room.currentPlayer;
        this.senderDeck = null;
    }


    async run() {
        await this.playCards();
        while(this.room.isGameFinished() === false && 
            (this.toNextPlayer() && this.isSender() === false)) {
            await this.coverCards();
        }
    }


    async playCards() {
        let senderDeck = null;
        let senderCards = null;
        await this.room.boardcast('showLeftTime');
        let timeout = config.ACTION_TIME_OUT / 1000;
        let beginTime = (new Date()).getTime();
        do {
            let spendTime = ((new Date()).getTime() - beginTime) / 1000;
            let leftTime = timeout - spendTime;
            let actionTimeout = Math.max(Math.floor(leftTime), 0);
            senderCards = await this.sender.playCards(actionTimeout * 1000);
            senderDeck = CardsAnalysis.toDeck(senderCards);
        } while(senderDeck === null);
        this.senderDeck = senderDeck;
        await this.sender.dropCards(senderCards);
        let isCover = false;
        let deckIndex = CardsAnalysis.getDeckClassIndex(senderDeck);
        await this.showDroppedCards(senderCards, deckIndex, isCover);
    }


    async coverCards() {
        let coverer = this.room.currentPlayer;
        let covered = false;
        let covererDeck = null;
        let covererCards = null;
        let isDiscard = false;
        await this.room.boardcast('showLeftTime');
        let timeout = config.ACTION_TIME_OUT / 1000;
        let beginTime = (new Date()).getTime();
        do {
            let spendTime = ((new Date()).getTime() - beginTime) / 1000;
            let leftTime = timeout - spendTime;
            let actionTimeout = Math.max(Math.floor(leftTime), 0);
            ({covererCards, isDiscard} = await coverer.coverCards(this.sender, this.senderDeck, actionTimeout * 1000));
            if(isDiscard) {
                break;
            }
            covererDeck = CardsAnalysis.toDeck(covererCards);
            try {
                if(covererDeck && covererDeck.compareTo(this.senderDeck) > 0) {
                    covered = true;
                }
            } catch(e) {}
        } while(covered === false);
        if(isDiscard) {
            await coverer.discard();
            await this.room.boardcast('showDiscarded');
        } else {
            this.senderDeck = covererDeck;
            this.sender = coverer;
            await coverer.dropCards(covererCards);
            let isCover = true;
            let deckIndex = CardsAnalysis.getDeckClassIndex(covererDeck);
            await this.showDroppedCards(covererCards, deckIndex, isCover);
        }
    }


    toNextPlayer() {
        this.room.turnToNextPlayer();
        return this.room.currentPlayer;
    }


    isSender() {
        return this.room.currentPlayer === this.sender;
    }


    async showDroppedCards(covererCards, deckIndex, isCover) {
        let currentLength = this.sender.cards.length,
            postLength = currentLength + covererCards.length;
        if(currentLength <= 2 && postLength > 2) {
            this.room.boardcast('showAlarm');
        }
        return this.room.boardcast('showDroppedCards', [covererCards, deckIndex, isCover]);
    }
}

module.exports = Round;