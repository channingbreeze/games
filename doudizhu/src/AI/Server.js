let jayson = require('jayson');
let PassiveAI = require('./PassiveAI');

const ARGS_IS_GOOD_CODE = 0;
const NOT_ENOUGH_CARDS_CODE = -1;
const INVALID_LANDLOAD_INDEX_CODE = -2;
const EXCEED_MAX_CARD_LENGTH_CODE = -3;
const DUPLICATE_CARDS_CODE = -4;
const INVALID_DECK_INDEX_CODE = -5;
const INVALID_CARDS_FROM_CODE = -6;
const CARDS_NOT_IN_HITOUTCARDSTACK_CODE = -7;
const INVALID_PARAMS_TYPE_CODE = -8;
const INVALID_CARD_CODE = -9;
const errorMsgs = [
    'ok',
    'not enough cards',
    'invalid landload index',
    'cards length is exceeded',
    'has duplicate cards',
    'invalid deck index',
    'invalid cards from',
    'cards is not in hitOutCardstack',
    'invalid param type',
    'invalid card'
];

function checkPlayArgs(args) {
    let {landlordIndex, myCards, preCardLeft, postCardLeft, hitOutCardStack} = args;

    if(myCards instanceof Array === false ||
        typeof preCardLeft !== 'number' ||
        typeof postCardLeft !== 'number' ||
        hitOutCardStack instanceof Array === false) {
        return INVALID_PARAMS_TYPE_CODE;
    }

    if(landlordIndex !== -1 && landlordIndex !== 0 && landlordIndex !== 1) {
        return INVALID_LANDLOAD_INDEX_CODE;
    }

    let totalCardsLength = myCards.length + preCardLeft + postCardLeft + hitOutCardStack.length;
    if(myCards.length <= 0 ||
        preCardLeft <= 0 ||
        postCardLeft <=0 ||
        totalCardsLength < 54) {
        return NOT_ENOUGH_CARDS_CODE;
    }

    const FARMER_MAX_CARDS_LENGTH = 17;
    const LANDLOAD_MAX_CARDS_LEGNTH = 20;
    let landloadCardsLength, farmerOneCardsLength , farmerTwoCardsLength;
    if(landlordIndex === -1) {
        landloadCardsLength = preCardLeft;
        farmerOneCardsLength = myCards.length;
        farmerTwoCardsLength = postCardLeft;
    } else if(landlordIndex === 0) {
        landloadCardsLength = myCards.length;
        farmerOneCardsLength = preCardLeft;
        farmerTwoCardsLength = postCardLeft;
    } else {
        landloadCardsLength = postCardLeft;
        farmerOneCardsLength = myCards.length;
        farmerTwoCardsLength = preCardLeft;
    }
    if(landloadCardsLength > 20 ||
        farmerOneCardsLength > 17 ||
        farmerTwoCardsLength > 17 ||
        totalCardsLength > 54) {
        return EXCEED_MAX_CARD_LENGTH_CODE;
    }

    let showedCards = myCards.concat(hitOutCardStack);
    let showedCardsSet = new Set(showedCards);
    if(showedCards.length !== showedCardsSet.size) {
        return DUPLICATE_CARDS_CODE;
    }

    for(let card of showedCards) {
        if(card < 0 || card > 53) {
            return INVALID_CARD_CODE;
        }
    }

    return ARGS_IS_GOOD_CODE;
}

function checkCoverArgs(args) {
    let errorCode = checkPlayArgs(args);
    if(errorCode !== 0) {
        return errorCode;
    }

    let {landlordIndex, myCards, preCardLeft, postCardLeft, hitOutCardStack, cardsFrom, cards, deckIndex} = args;

    if(typeof cardsFrom !== 'number' ||
        cards instanceof Array === false ||
        typeof deckIndex !== 'number') {
        return INVALID_PARAMS_TYPE_CODE;
    }

    if(cardsFrom !== -1 && cardsFrom !== 1) {
        return INVALID_CARDS_FROM_CODE;
    }

    let hitOutCardStackSet = new Set(hitOutCardStack);
    let hitOutCardStackCombineCardsSet = new Set(hitOutCardStack.concat(cards));
    if(hitOutCardStackSet.size !== hitOutCardStackCombineCardsSet.size) {
        return CARDS_NOT_IN_HITOUTCARDSTACK_CODE;
    }

    if(deckIndex < 1 || deckIndex > 14) {
        return INVALID_DECK_INDEX_CODE;
    }

    return ARGS_IS_GOOD_CODE;
}

function checkCallPoint(args) {
    let {myCards} = args;
    if(myCards instanceof Array === false) {
        return INVALID_PARAMS_TYPE_CODE;
    }

    if(myCards.length < 17) {
        return NOT_ENOUGH_CARDS_CODE;
    }

    if(myCards.length > 17) {
        return EXCEED_MAX_CARD_LENGTH_CODE;
    }

    for(let card of myCards) {
        if(card < 0 || card > 53) {
            return INVALID_CARD_CODE;
        }
    }

    return ARGS_IS_GOOD_CODE;
}

let server = jayson.server({
    /**
    args: [{
        myCards: []
    }]
    **/
    callPoint(args, callback) {
        try {
            let errorCode = checkCallPoint(args[0]);
            if(errorCode !== 0) {
                callback({code: errorCode, message: errorMsgs[Math.abs(errorCode)]});
            } else {
                let ai = new PassiveAI();
                callback(null, ai.callPoint(args[0]));
            }
        } catch(e) {
            callback(this.error(-32603));
        }
    },


    /**
    args: [{
        landlordIndex: -1|0|1, //-1表示地主是上家，0表示地主是你，1表示地主是下家
        myCards: [],
        preCardLeft: 1,        //上家剩余手牌数量
        postCardLeft: 1,       //下家剩余手牌数量 
        hitOutCardStack: [],   //已经出过的牌
    }]
    **/
    play(args, callback) {
        try {
            let errorCode = checkPlayArgs(args[0]);
            if(errorCode !== 0) {
                callback({code: errorCode, message: errorMsgs[Math.abs(errorCode)]});
            } else {
                let ai = new PassiveAI();
                callback(null, ai.play(args[0]));
            }
        } catch(e) {
            callback(this.error(-32603));
        }
    },


    /**
    args: [{
        landlordIndex: -1|0|1, //-1表示地主是上家，0表示地主是你，1表示地主是下家
        myCards: [],
        preCardLeft: 1,        //上家剩余手牌数量
        postCardLeft: 1,       //下家剩余手牌数量 
        hitOutCardStack: [],   //已经出过的牌,
        cardsFrom: -1 | 1,     //要压谁的牌,-1表示上家,1表示下家
        cards: [],             //要压的牌
        deckIndex: 1~14        //要压的牌的类型
    }]
    **/
    cover(args, callback) {
        try {
            let errorCode = checkCoverArgs(args[0]);
            if(errorCode !== 0) {
                callback({code: errorCode, message: errorMsgs[Math.abs(errorCode)]});
            } else {
                let ai = new PassiveAI();
                callback(null, ai.cover(args[0]));
            }
        } catch(e) {
            callback(this.error(-32603));
        }
    }
});
 
server.http().listen(10003);