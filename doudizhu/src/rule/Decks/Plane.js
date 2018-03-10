let Deck = require('./Deck');
let Nuke = require('./Nuke');
let Bomb = require('./Bomb');
let Sole = require('./Sole');

class Plane extends Deck.Deck {
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
        if(deck instanceof Plane === false) {
            throw new Error(`Plane can only compare with (Plane|Bomb|Nuke),but current is ${deck}`)
        } else {
            if(this.soles.length !== deck.soles.length) {
                throw new Error(`Plane ${this} and ${deck} have different size.`)
            }
            return this.soles[0].compareTo(deck.soles[0]);
        }
    }
    static recognizeSelf(cardIndexs) {
        if(cardIndexs instanceof Array === false) {
            return false;
        }
        if(cardIndexs.length < 6 || cardIndexs.length % 3 !== 0) {
            return false;
        }
        if(super.someSameCards(cardIndexs)) {
            return false;
        }
        if(super.hasQueen(cardIndexs) || super.hasTwo(cardIndexs)) {
            return false;
        }
        let categoryMap = super.classifyByCategory(cardIndexs);
        if(categoryMap.size !== cardIndexs.length / 3) {
            return false;
        }
        let maxCatetory = -1,
            minCatetory = 100;
        for(let [catetory, cards] of categoryMap) {
            maxCatetory = Math.max(maxCatetory, catetory);
            minCatetory = Math.min(minCatetory, catetory);
            if(cards.length !== 3) {
                return false;
            }
        }
        return maxCatetory - minCatetory + 1 === categoryMap.size;
    }
}

exports.Plane = Plane;