let Deck = require('./Deck');
let Nuke = require('./Nuke');
let Bomb = require('./Bomb');
let Sole = require('./Sole');

class Chain extends Deck.Deck {
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
        if(deck instanceof Chain === false) {
            throw new Error(`Chain can only compare with (Chain|Bomb|Nuke),but current is ${deck}`)
        } else {
            if(this.soles.length !== deck.soles.length) {
                throw new Error(`Chains ${this} and ${deck} have different size.`)
            }
            return this.soles[0].compareTo(deck.soles[0]);
        }
    }
    static recognizeSelf(cardIndexs) {
        if(cardIndexs instanceof Array === false) {
            return false;
        }
        if(cardIndexs.length < 5) {
            return false;
        }
        if(super.someSameCards(cardIndexs)) {
            return false;
        }
        if(super.hasQueen(cardIndexs) || super.hasTwo(cardIndexs)) {
            return false;
        }
        let [...clone] = cardIndexs;
        clone.sort((a, b) => a - b);
        let baseCards = clone.map(card => Math.floor(card / 4));
        if(super.someSameCards(baseCards)) {
            return false;
        }
        return baseCards[baseCards.length - 1] - baseCards[0] + 1 === baseCards.length;
    }
}

exports.Chain = Chain;