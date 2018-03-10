let Deck = require('./Deck');
let Nuke = require('./Nuke');
let Sole = require('./Sole');

class Bomb extends Deck.Deck {
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
        if(deck instanceof Deck.Deck === false) {
            throw new Error(`${deck} is not a Deck`)
        }
        if(deck instanceof Nuke.Nuke) {
            return -1;
        }
        if(deck instanceof Bomb) {
            return this.soles[0].compareTo(deck.soles[0]);
        }
        return 1;
    }
    static recognizeSelf(cardIndexs) {
        if(cardIndexs instanceof Array === false) {
            return false;
        }
        if(cardIndexs.length !== 4) {
            return false;
        }
        if(super.someSameCards(cardIndexs)) {
            return false;
        }
        return super.allSameColors(cardIndexs);
    }
}

exports.Bomb = Bomb;