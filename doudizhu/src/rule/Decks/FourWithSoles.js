let Deck = require('./Deck');
let Nuke = require('./Nuke');
let Bomb = require('./Bomb');
let Sole = require('./Sole');

class FourWithSoles extends Deck.Deck {
    constructor(cardIndexs) {
        super();
        let [...clone] = cardIndexs;
        clone.sort((a, b) => a - b);
        this.soles = [];
        this.four = [];
        for(let c of clone) {
            this.soles.push(new Sole.Sole(c));
        }
        this._soles = [];
        let categoryCardsMap = FourWithSoles.classifyByCategory(clone);
        for(let [category, cards] of categoryCardsMap) {
            if(cards.length !== 4) {
                this._soles = this._soles.concat(cards.map(index => new Sole.Sole(index)));
            }
            if(cards.length === 4) {
                this.four = cards.map(index => new Sole.Sole(index));
            }
        }
    }
    toString() {
        return `[${this.four.map(s => s.rawString).join(' ')} ${this._soles.map(s => s.rawString).join(' ')}]`;
    }
    compareTo(deck) {
        if(deck instanceof Nuke.Nuke || deck instanceof Bomb.Bomb) {
            return -1;
        }
        if(deck instanceof FourWithSoles === false) {
            throw new Error(`FourWithSoles can only compare with (FourWithSoles|Bomb|Nuke),but current is ${deck}`)
        } else {
            return this.four[0].compareTo(deck.four[0]);
        }
    }
    static recognizeSelf(cardIndexs) {
        if(cardIndexs instanceof Array === false) {
            return false;
        }
        if(cardIndexs.length !== 6) {
            return false;
        }
        if(super.someSameCards(cardIndexs)) {
            return false;
        }
        let categoryMap = super.classifyByCategory(cardIndexs);
        if(categoryMap.size !== 2 && categoryMap.size !== 3) {
            return false;
        }
        let hasFour = false;
        for(let cs of categoryMap.values()) {
            if(cs.length === 4) {
                hasFour = true;
            }
        }
        return hasFour;
    }
}

exports.FourWithSoles = FourWithSoles;