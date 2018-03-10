let Deck = require('./Deck');
let Nuke = require('./Nuke');
let Bomb = require('./Bomb');
let Sole = require('./Sole');

class Pair extends Deck.Deck {
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
        if(deck instanceof Pair === false) {
            throw new Error(`Pair can only compare with (Pair|Bomb|Nuke),but current is ${deck}`)
        } else {
            return this.soles[0].compareTo(deck.soles[0]);
        }
    }
    static recognizeSelf(cardIndexs) {
        if(cardIndexs instanceof Array === false) {
            return false;
        }
        if(cardIndexs.length != 2) {
            return false;
        }
        if(super.someSameCards(cardIndexs)) {
            return false;
        }
        if(super.hasQueen(cardIndexs)) {
            return false;
        }
        return super.allSameColors(cardIndexs);
    }
}

exports.Pair = Pair;