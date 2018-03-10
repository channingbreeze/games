let Deck = require('./Deck');
let Nuke = require('./Nuke');
let Bomb = require('./Bomb');
let Sole = require('./Sole');
let Plane = require('./Plane');

class TrioWithPairChain extends Deck.Deck {
    constructor(cardIndexs) {
        super();
        let [...clone] = cardIndexs;
        clone.sort((a, b) => a - b);
        this.soles = [];
        for(let c of clone) {
            this.soles.push(new Sole.Sole(c));
        }
        let {pairs, trios} = TrioWithPairChain._obtainTriosAndPairs(clone);
        this.pairs = pairs.map(index => new Sole.Sole(index));
        this.trios = trios.map(index => new Sole.Sole(index));
    }
    toString() {
        return `[${this.trios.map(s => s.rawString).join(' ')} ${this.pairs.map(s => s.rawString).join(' ')}]`;
    }
    compareTo(deck) {
        if(deck instanceof Nuke.Nuke || deck instanceof Bomb.Bomb) {
            return -1;
        }
        if(deck instanceof TrioWithPairChain === false) {
            throw new Error(`TrioWithPairChain can only compare with (TrioWithPairChain|Bomb|Nuke),but current is ${deck}`)
        } else {
            if(this.soles.length !== deck.soles.length) {
                throw new Error(`TrioWithPairChain ${this} and ${deck} have different size.`)
            }
            return this.trios[0].compareTo(deck.trios[0]);
        }
    }
    static recognizeSelf(cardIndexs) {
        if(cardIndexs instanceof Array === false) {
            return false;
        }
        if(cardIndexs.length < 10 || cardIndexs.length % 5 !== 0) {
            return false;
        }
        if(super.someSameCards(cardIndexs)) {
            return false;
        }
        let {pairs, trios} = this._obtainTriosAndPairs(cardIndexs),
            totalSize = pairs.length + trios.length;
        if(totalSize !== cardIndexs.length) {
            return false;
        }
        const EACH_GROUP_SIZE = 5;
        let groupSize = totalSize / EACH_GROUP_SIZE;
        if( (pairs.length / 2) !== groupSize || (trios.length / 3) !== groupSize) {
            return false;
        }
        return Plane.Plane.recognizeSelf(trios);
    }
    static _obtainTriosAndPairs(cardIndexs) {
        let pairs = [],
            trios = [];
        let [...clone] = cardIndexs;
        clone.sort((a, b) => a - b);
        let map = super.classifyByCategory(clone);
        for(let cards of map.values()) {
            if(cards.length === 2) {
                pairs = pairs.concat(cards);
            } else if(cards.length === 3) {
                trios = trios.concat(cards);
            } else if(cards.length === 4) {
                let [...clone] = cards;
                pairs = pairs.concat(clone.slice(0, 2), clone.slice(2));
            }
        }
        return {pairs, trios};
    }
}

exports.TrioWithPairChain = TrioWithPairChain;