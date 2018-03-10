let Deck = require('./Deck');
let Nuke = require('./Nuke');
let Bomb = require('./Bomb');
let Sole = require('./Sole');

class PairChain extends Deck.Deck {
    constructor(cardIndexs) {
        super();
        let [...clone] = cardIndexs;
        clone.sort((a, b) => a - b);
        this.soles = [];
        for(let c of clone) {
            this.soles.push(new Sole.Sole(c));
        }
    }
    compareTo(deck) {
        if(deck instanceof Nuke.Nuke || deck instanceof Bomb.Bomb) {
            return -1;
        }
        if(deck instanceof PairChain === false) {
            throw new Error(`PairChain can only compare with (PairChain|Bomb|Nuke),but current is ${deck}`)
        } else {
            if(this.soles.length !== deck.soles.length) {
                throw new Error(`PairChain ${this} and ${deck} have different size.`)
            }
            return this.soles[0].compareTo(deck.soles[0]);
        }
    }
    static recognizeSelf(cardIndexs) {
        if(cardIndexs instanceof Array === false) {
            return false;
        }
        if(cardIndexs.length < 6 || cardIndexs.length % 2 !== 0) {
            return false;
        }
        if(super.someSameCards(cardIndexs)) {
            return false;
        }
        if(super.hasQueen(cardIndexs) || super.hasTwo(cardIndexs)) {
            return false;
        }
        let categoryMap = super.classifyByCategory(cardIndexs);
        if(categoryMap.size !== cardIndexs.length / 2) {
            return false;
        }
        let maxCatetory = -1,
            minCatetory = 100;
        for(let [catetory, cards] of categoryMap) {
            maxCatetory = Math.max(maxCatetory, catetory);
            minCatetory = Math.min(minCatetory, catetory);
            if(cards.length !== 2) {
                return false;
            }
        }
        return maxCatetory - minCatetory + 1 === categoryMap.size;
    }
}

exports.PairChain = PairChain;