let Deck = require('./Deck');
let Sole = require('./Sole');
let Bomb = require('./Bomb');
let Chain = require('./Chain');
let FourWithSoles = require('./FourWithSoles');
let FourWithPairs = require('./FourWithPairs');
let Nuke = require('./Nuke');
let Pair = require('./Pair');
let PairChain = require('./PairChain');
let Plane = require('./Plane');
let Trio = require('./Trio');
let TrioWithPair = require('./TrioWithPair');
let TrioWithPairChain = require('./TrioWithPairChain');
let TrioWithSole = require('./TrioWithSole');
let TrioWithSoleChain = require('./TrioWithSoleChain');

class Factory {
    constructor() {
        this.buildClassMap();
    }
    buildClassMap() {
        this.deckClassMap = {};
        this.deckClassMap[Deck.Deck.Types.SOLE] = Sole.Sole;
        this.deckClassMap[Deck.Deck.Types.PAIR] = Pair.Pair;
        this.deckClassMap[Deck.Deck.Types.TRIO] = Trio.Trio;
        this.deckClassMap[Deck.Deck.Types.CHAIN] = Chain.Chain;
        this.deckClassMap[Deck.Deck.Types.PLANE] = Plane.Plane;
        this.deckClassMap[Deck.Deck.Types.PAIRCHAIN] = PairChain.PairChain;
        this.deckClassMap[Deck.Deck.Types.TRIOWITHSOLE] = TrioWithSole.TrioWithSole;
        this.deckClassMap[Deck.Deck.Types.TRIOWITHPAIR] = TrioWithPair.TrioWithPair;
        this.deckClassMap[Deck.Deck.Types.TRIOWITHSOLECHAIN] = TrioWithSoleChain.TrioWithSoleChain;
        this.deckClassMap[Deck.Deck.Types.TRIOWITHPAIRCHAIN] = TrioWithPairChain.TrioWithPairChain;
        this.deckClassMap[Deck.Deck.Types.BOMB] = Bomb.Bomb;
        this.deckClassMap[Deck.Deck.Types.NUKE] = Nuke.Nuke;
        this.deckClassMap[Deck.Deck.Types.FOURWITHSOLES] = FourWithSoles.FourWithSoles;
        this.deckClassMap[Deck.Deck.Types.FOURWITHPAIRS] = FourWithPairs.FourWithPairs;
    }
    deckClass(classIndex) {
        return this.deckClassMap[classIndex];
    }
    deckAbstractClass() {
        return Deck.Deck;
    }
    createDeck(classIndex, cardIndexs) {
        if(this.deckClassMap[classIndex]) {
            if(classIndex === Deck.Deck.Types.SOLE) {
                return new this.deckClassMap[classIndex](cardIndexs[0]);
            } else {
                return new this.deckClassMap[classIndex](cardIndexs);
            }
        }
        return null;
    }
}

module.exports = new Factory();