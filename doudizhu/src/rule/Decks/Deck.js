class Deck {
    static recognizeSelf(cardIndexs) {
        throw new Error(`Deck's recognizeSelf must be override`);
    }
    static allSameColors(cardIndexs) {
        if(Deck.hasQueen(cardIndexs)) {
            return false;
        }
        let baseCards = cardIndexs.map(card => Math.floor(card / 4));
        return Deck.allSameCards(baseCards);
    }
    static allSameCards(cardIndexs) {
        return Deck.min(cardIndexs) === Deck.max(cardIndexs);
    }
    static someSameCards(cardIndexs) {
        let uniqueIndexs = new Set(cardIndexs);
        return uniqueIndexs.size !== cardIndexs.length;
    }
    static max(cardIndexs) {
        return cardIndexs.reduce((max,cur) => cur > max ? cur : max);
    }
    static min(cardIndexs) {
        return cardIndexs.reduce((min,cur) => cur < min ? cur : min);
    }
    static hasQueen(cardIndexs) {
        let queen = cardIndexs.find(card => card >= 52);
        return queen !== undefined;
    }
    static hasTwo(cardIndexs) {
        let two = cardIndexs.find(card => card >= 48 && card <= 51);
        return two !== undefined;
    }
    static classifyByCategory(cardIndexs) {
        let categoryCardsMap = new Map();
        cardIndexs.forEach(card => {
            let category = Math.floor(card / 4),
                cards = categoryCardsMap.get(category);
            if(cards === undefined) {
                categoryCardsMap.set(category, [card]);
            } else {
                cards.push(card);
            }
        });
        return categoryCardsMap;
    }
    toString() {
        return `[${this.soles.map(s => s.rawString).join(' ')}]`;
    }
    get cardIndexs() {
        return this.soles.map(sole => sole.cardIndexs[0]);
    }
}

Deck.Types = {
    SOLE: 1,
    PAIR: 2,
    TRIO: 3,
    CHAIN: 4,
    PLANE: 5,
    PAIRCHAIN: 6,
    TRIOWITHSOLE: 7,
    TRIOWITHPAIR: 8,
    TRIOWITHSOLECHAIN: 9,
    TRIOWITHPAIRCHAIN: 10,
    BOMB: 11,
    NUKE: 12,
    FOURWITHSOLES: 13,
    FOURWITHPAIRS: 14,
};

exports.Deck = Deck;