let factory = require('./Decks/Factory');
const Deck = factory.deckAbstractClass();

class CardsAnalysis {
    constructor() {
        this.buildLengthToDeckMapping();
    }
    buildLengthToDeckMapping() {
        let m = new Map();
        this._setSoleMapping(m);
        this._setPairMapping(m);
        this._setTrioMapping(m);
        this._setChainMapping(m);
        this._setPlaneMapping(m);
        this._setBombMapping(m);
        this._setNukeMapping(m);
        this._setPairChainMapping(m);
        this._setTrioWithSoleMapping(m);
        this._setTrioWithPairMapping(m);
        this._setTrioWithSoleChainMapping(m);
        this._setTrioWithPairChainMapping(m);
        this._setFourWithSolesMapping(m);
        this._setFourWithPairsMapping(m);
        this.lengthToDeckMapping = m;
    }
    _setSoleMapping(m) {
        this._appendSpecialLengthDeck(m, 1, Deck.Types.SOLE);
    }
    _setPairMapping(m) {
        this._appendSpecialLengthDeck(m, 2, Deck.Types.PAIR);
    }
    _setTrioMapping(m) {
        this._appendSpecialLengthDeck(m, 3, Deck.Types.TRIO);
    }
    _setChainMapping(m) {
        this._appendSpecialLengthsDeck(m, this._intRange(5, 20), Deck.Types.CHAIN);
    }
    _setPlaneMapping(m) {
        this._appendSpecialLengthsDeck(m, this._intRange(2, 6).map(v => v * 3), Deck.Types.PLANE);
    }
    _setBombMapping(m) {
        this._appendSpecialLengthDeck(m, 4, Deck.Types.BOMB);
    }
    _setNukeMapping(m) {
        this._appendSpecialLengthDeck(m, 2, Deck.Types.NUKE);
    }
    _setPairChainMapping(m) {
        this._appendSpecialLengthsDeck(m, this._intRange(3, 10).map(v => v * 2), Deck.Types.PAIRCHAIN);
    }
    _setTrioWithSoleMapping(m) {
        this._appendSpecialLengthDeck(m, 4, Deck.Types.TRIOWITHSOLE);
    }
    _setTrioWithPairMapping(m) {
        this._appendSpecialLengthDeck(m, 5, Deck.Types.TRIOWITHPAIR);
    }
    _setTrioWithSoleChainMapping(m) {
        this._appendSpecialLengthsDeck(m, this._intRange(2, 5).map(v => v * 4), Deck.Types.TRIOWITHSOLECHAIN);
    }
    _setTrioWithPairChainMapping(m) {
        this._appendSpecialLengthsDeck(m, this._intRange(2, 4).map(v => v * 5), Deck.Types.TRIOWITHPAIRCHAIN);
    }
    _setFourWithSolesMapping(m) {
        this._appendSpecialLengthDeck(m, 6, Deck.Types.FOURWITHSOLES);
    }
    _setFourWithPairsMapping(m) {
        this._appendSpecialLengthDeck(m, 8, Deck.Types.FOURWITHPAIRS);
    }
    _appendSpecialLengthsDeck(map, lengths, deck) {
        for(let l of lengths) {
            this._appendSpecialLengthDeck(map, l, deck);
        }
    }
    _appendSpecialLengthDeck(map, length, deck) {
        let decks = map.get(length);
        if(!decks) {
            decks = [];
        }
        map.set(length, decks.concat(deck));
    }
    _intRange(min, max) {
        let range = [];
        for(let i = min; i <= max; ++i) {
            range.push(i);
        }
        return range;
    }
    toDeck(cardIndexs) {
        let suitableDeckClsIndexs = this.lengthToDeckMapping.get(cardIndexs.length);
        if(!suitableDeckClsIndexs) {
            throw new Error(`Can not found any suitable decks for cards ${cardIndexs}`);
        }
        for(let deckClsIndex of suitableDeckClsIndexs) {
            let deckCls = factory.deckClass(deckClsIndex);
            if(deckCls.recognizeSelf(cardIndexs)) {
                return factory.createDeck(deckClsIndex, cardIndexs);
            }
        }
        return null;
    }
    getDeckClassIndex(deck) {
        var ret = -1;
        for(let index of Object.values(Deck.Types)) {
            let cls = factory.deckClass(index);
            if(deck instanceof cls) {
                ret = index;
                break;
            }
        }
        return ret;
    }
}

module.exports = new CardsAnalysis();