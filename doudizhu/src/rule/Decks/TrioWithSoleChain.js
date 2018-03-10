let Deck = require('./Deck');
let Nuke = require('./Nuke');
let Bomb = require('./Bomb');
let Sole = require('./Sole');
let Plane = require('./Plane');

class TrioWithSoleChain extends Deck.Deck {
    constructor(cardIndexs) {
        super();
        let [...clone] = cardIndexs;
        clone.sort((a, b) => a - b);
        this.soles = [];
        for(let c of clone) {
            this.soles.push(new Sole.Sole(c));
        }
        let {soles, trios} = TrioWithSoleChain._obtainTriosAndSoles(clone);
        this.iSoles = soles.map(index => new Sole.Sole(index));
        this.trios = trios.map(index => new Sole.Sole(index));
    }
    toString() {
        return `[${this.trios.map(s => s.rawString).join(' ')} ${this.iSoles.map(s => s.rawString).join(' ')}]`;
    }
    compareTo(deck) {
        if(deck instanceof Nuke.Nuke || deck instanceof Bomb.Bomb) {
            return -1;
        }
        if(deck instanceof TrioWithSoleChain === false) {
            throw new Error(`TrioWithSoleChain can only compare with (TrioWithSoleChain|Bomb|Nuke),but current is ${deck}`)
        } else {
            if(this.soles.length !== deck.soles.length) {
                throw new Error(`TrioWithSoleChain ${this} and ${deck} have different size.`)
            }
            return this.trios[0].compareTo(deck.trios[0]);
        }
    }
    static recognizeSelf(cardIndexs) {
        if(cardIndexs instanceof Array === false) {
            return false;
        }
        if(cardIndexs.length < 8 || cardIndexs.length % 4 !== 0) {
            return false;
        }
        if(super.someSameCards(cardIndexs)) {
            return false;
        }
        let {soles, trios} = this._obtainTriosAndSoles(cardIndexs),
            totalSize = soles.length + trios.length;
        if(totalSize !== cardIndexs.length) {
            return false;
        }
        const EACH_GROUP_SIZE = 4;
        let groupSize = totalSize / EACH_GROUP_SIZE;
        if(soles.length !== groupSize || (trios.length / 3) !== groupSize) {
            return false;
        }
        return Plane.Plane.recognizeSelf(trios);
    }
    static _obtainTriosAndSoles(cardIndexs) {
        let soles = [],
            trios = [];
        let [...clone] = cardIndexs;
        clone.sort((a, b) => a - b);
        let map = super.classifyByCategory(clone);
        for(let cards of map.values()) {
            if(cards.length === 1 || cards.length === 2) {
                soles = soles.concat(cards);
            } else if(cards.length === 3) {
                trios = trios.concat(cards);
            } else if(cards.length === 4) {
                let [...clone] = cards;
                trios = trios.concat(clone.splice(0, 3));
                soles = soles.concat(clone);
            }
        }
        return this._handSpecial({soles, trios});
    }
    static _handSpecial({soles, trios}) {
        let total = soles.length + trios.length,
            ret = {soles, trios};
        if(total === 12) {
            if(trios.length === 12) {
                ret = this._reformTrios(trios.slice(0,3), trios.slice(3, 3 + 6), trios.slice(9));
            }
        } else if(total === 16) {
            if(trios.length === 15) {
                let r = this._reformTrios(trios.slice(0,3), trios.slice(3, 3 + 9), trios.slice(12));
                ret = {soles: ret.soles.concat(r.soles), trios: r.trios};
            }
        } else if(total === 20) {
            if(trios.length === 18) {
                let r = this._reformTrios(trios.slice(0,3), trios.slice(3, 3 + 12), trios.slice(15));
                ret = {soles: ret.soles.concat(r.soles), trios: r.trios};
            }
        }
        return ret;
    }
    static _reformTrios(frontTrio, middleTrios, endTrio) {
        let ret = {soles: [], trios: frontTrio.concat(middleTrios, endTrio)};
        if(Plane.Plane.recognizeSelf(middleTrios)) {
            let endTrios = middleTrios.concat(endTrio),
                frontTrios = frontTrio.concat(middleTrios);
            if(Plane.Plane.recognizeSelf(endTrios)) {
                ret = {soles: frontTrio, trios: endTrios};
            } else if(Plane.Plane.recognizeSelf(frontTrios)) {
                ret = {soles: endTrio, trios: frontTrios};
            }
        }
        return ret;
    }
}

exports.TrioWithSoleChain = TrioWithSoleChain;