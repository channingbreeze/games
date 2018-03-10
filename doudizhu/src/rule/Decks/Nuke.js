let Deck = require('./Deck');
let Sole = require('./Sole');

class Nuke extends Deck.Deck {
    constructor() {
        super();
        this.soles = [new Sole.Sole(52), new Sole.Sole(53)];
    }
    compareTo(deck) {
        if(deck instanceof Deck.Deck === false) {
            throw new Error(`${deck} is not a Deck`)
        }
        return 1;
    }
    static recognizeSelf(cardIndexs) {
        if(cardIndexs instanceof Array === false) {
            return false;
        }
        if(cardIndexs.length !== 2) {
            return false;
        }
        let [...clone] = cardIndexs;
        clone.sort();
        if(clone[0] !== 52 || clone[1] !== 53) {
            return false;
        }
        return true;
    }
}

exports.Nuke = Nuke;