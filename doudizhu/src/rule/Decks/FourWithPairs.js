let Deck = require('./Deck');
let Nuke = require('./Nuke');
let Bomb = require('./Bomb');
let Sole = require('./Sole');

class FourWithPairs extends Deck.Deck {
    constructor(cardIndexs) {
        super();
        let [...clone] = cardIndexs;
        clone.sort((a, b) => a - b);
        this.soles = [];
        this.pairs = [];
        this.four = [];
        for(let c of clone) {
            this.soles.push(new Sole.Sole(c));
        }
        let categoryCardsMap = FourWithPairs.classifyByCategory(clone);
        if(categoryCardsMap.size === 2) {
            this.pairs = clone.slice(0, 4).map(index => new Sole.Sole(index));
            this.four = clone.slice(4).map(index => new Sole.Sole(index));
        } else {
            for(let [category, cards] of categoryCardsMap) {
                if(cards.length === 2) {
                    this.pairs = this.pairs.concat(cards.map(index => new Sole.Sole(index)));
                }
                if(cards.length === 4) {
                    this.four = cards.map(index => new Sole.Sole(index));
                }
            }
        }
    }
    toString() {
        return `[${this.four.map(s => s.rawString).join(' ')} ${this.pairs.map(s => s.rawString).join(' ')}]`;
    }
    compareTo(deck) {
        if(deck instanceof Nuke.Nuke || deck instanceof Bomb.Bomb) {
            return -1;
        }
        if(deck instanceof FourWithPairs === false) {
            throw new Error(`FourWithPairs can only compare with (FourWithPairs|Bomb|Nuke),but current is ${deck}`)
        } else {
            return this.four[0].compareTo(deck.four[0]);
        }
    }
    static recognizeSelf(cardIndexs) {
        if(cardIndexs instanceof Array === false) {
            return false;
        }
        if(cardIndexs.length !== 8) {
            return false;
        }
        if(super.someSameCards(cardIndexs)) {
            return false;
        }
        let categoryMap = super.classifyByCategory(cardIndexs);
        if(categoryMap.size !== 2 && categoryMap.size !== 3) {
            return false;
        }
        for(let cs of categoryMap.values()) {
            if(cs.length !== 2 && cs.length !== 4) {
                return false;
            }
        }
        return true;
    }
}

exports.FourWithPairs = FourWithPairs;