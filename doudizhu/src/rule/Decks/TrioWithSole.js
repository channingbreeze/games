let Deck = require('./Deck');
let Nuke = require('./Nuke');
let Bomb = require('./Bomb');
let Sole = require('./Sole');

class TrioWithSole extends Deck.Deck {
    constructor(cardIndexs) {
        super();
        let [...clone] = cardIndexs;
        clone.sort((a, b) => a - b);
        this.soles = [];
        for(let c of clone) {
            this.soles.push(new Sole.Sole(c));
        }
        this.trio = [];
        this.sole = [];
        let categoryMap = TrioWithSole.classifyByCategory(clone);
        for(let cards of categoryMap.values()) {
            if(cards.length === 1) {
                this.sole = cards.map(index => new Sole.Sole(index));
            }
            if(cards.length === 3) {
                this.trio = cards.map(index => new Sole.Sole(index));
            }
        }
    }
    toString() {
        return `[${this.trio.map(s => s.rawString).join(' ')} ${this.sole.map(s => s.rawString).join(' ')}]`;
    }
    compareTo(deck) {
        if(deck instanceof Nuke.Nuke || deck instanceof Bomb.Bomb) {
            return -1;
        }
        if(deck instanceof TrioWithSole === false) {
            throw new Error(`TrioWithSole can only compare with (TrioWithSole|Bomb|Nuke),but current is ${deck}`)
        } else {
            return this.trio[0].compareTo(deck.trio[0]);
        }
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
        let categoryMap = super.classifyByCategory(cardIndexs);
        if(categoryMap.size !== 2) {
            return false;
        }
        for(let cards of categoryMap.values()) {
            if(cards.length !== 3 && cards.length !== 1) {
                return false;
            }
        }
        return true;
    }
}

exports.TrioWithSole = TrioWithSole;