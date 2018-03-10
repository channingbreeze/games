class Strategy {
    constructor(v, name) {
        let me = this;
        me.logLevel = 0;
        me.name = name || '';
        me.handCards = [];
        me.handDeck = me._deck();
        me.table = me._deck();
        me.suitSet = me._suitSet();
        me.allCombinations = [];
        me.players = {};
        me.receiveCards(v);
    }
    
    debug() {
        let me = this;
        if (me.logLevel >= 3) {
            console.log.apply(console.log, arguments);
        }
    }
    
    isCards(srcSet) {
        let set = this._clone(srcSet);
        if (!this._isArray(set)) {
            return false;
        }
        let a;
        while ((a = set.shift()) != undefined) {
            if (a<0 || a>53 || this._contain(set, a)) return false;
        }
        return true;
    }
    
    isDeck(set) {
        if (!this._isArray(set) || set.length != 15) {
            return false;
        }
        let i, a;
        for (i=0; i<set.length; i++) {
            a = set[i];
            if (a<0 || a>4) return false;
            if (i>12 && a>1) return false;
        }
        return true;
    }
    
    generateCards() {
        let i,
            cards = [];
        for (i=0;i<54;i++) {
            cards[i] = i;
        }
        return cards.sort(function(){ return 0.5 - Math.random(); });
    }

    _receiveCards(srcCards, cards, deck, suitSet) {
        for (let i=0;i<srcCards.length;i++) {
            cards && cards.push(srcCards[i]);
            if (srcCards[i] < 52) {
                let key = Math.floor(srcCards[i]/4),
                    suitIndex = srcCards[i] - key * 4;
                deck[key]++;
                suitSet && suitSet[key].push(suitIndex);
            } else if (srcCards[i] == 52) {
                deck[13]++;
            } else if (srcCards[i] == 53) {
                deck[14]++;
            }
        }
    }

    printDeck(deck, title) {
        let s = '';
        for (let i=0; i<deck.length; i++) {
            if (deck[i]==0) continue;
            let note = this.keyToNote(i);
            for (let j=0; j<deck[i]; j++) {
                s += (note + ' ');
            }
            s += '   ';
        }
        console.log(title + ':   ' + s);
    }

    printCombination() {
        //for (let i=0; i<)
    }

    keyToNote(i) {
        switch (i) {
        case 14:
            return 'Red Joker';
        case 13:
            return 'Black Joker';
        case 12:
            return '2';
        case 11:
            return 'A';
        case 10:
            return 'K';
        case 9:
            return 'Q';
        case 8:
            return 'J';
        default:
            return (i+3).toString();
        }
    }

    analyzeDeck(deck, allcombs) {
        this.analyze(this._comb(), deck, allcombs);
    }

    analyze(drewSet, deck, allcombs){
        let me = this;
        me.hDraw(drewSet, deck, 4, function(drewSet1, deck1) {       //firstly, draw quads
            me.hDraw(drewSet1, deck1, 3, function(drewSet2, deck2) { //secondly, draw trpls
                let vDrewList = [],     //prevent repeating
                    chainList = [];
                me.vDraw(drewSet2, deck2, 2, vDrewList, chainList, function(drewSet3, deck3){
                    let vDrewList2 = [],
                        chainList2 = [];
                    me.vDraw(drewSet3, deck3, 1, vDrewList2, chainList2, function(drewSet4, deck4) {
                        me.fragmentDraw(drewSet4, deck4, allcombs);
                    });
                });
            });
        });
    /*
        allcombs.sort(function(a, b) {
            return me.estimateSteps(a) - me.estimateSteps(b);
        });
        let getVLen = function(vSet) {
            let n=0;
            vSet.forEach(function(v) {
                n += (v[1] - v[0]);
            });
            return n;
        }, better = function(a, b) {
            if (a && getVLen(a.str1) >= getVLen(b.str1) && getVLen(a.str2) >= getVLen(b.str2)
                && a.quad.length >= b.quad.length && a.trpl.length >= b.trpl.length
                && me.estimateSteps(a) < me.estimateSteps(b)) {
                return 1;
            } else if (a && getVLen(a.str1) <= getVLen(b.str1) && getVLen(a.str2) <= getVLen(b.str2)
                && a.quad.length <= b.quad.length && a.trpl.length <= b.trpl.length
                && me.estimateSteps(a) > me.estimateSteps(b)) {
                return -1;
            } else {
                return 0;
            }
        };
        for (let i=0; i<allcombs.length; i++) {
            let bWorth = true,
                comb = allcombs[i];
            for (let j=0; j<availablecombs.length; j++) {
                let iBetter = better(availablecombs[j], comb);
                if (iBetter>0) {
                    bWorth = false;
                    break;
                } else if (iBetter<0) {
                    availablecombs.splice(j, 1, comb);
                    bWorth = false;
                    break;
                }
            }
            if (bWorth) {
                availablecombs.push(comb);
            }
        }
        allcombs.splice(0, allcombs.length);
        allcombs.push.apply(allcombs, availablecombs);
        allcombs.forEach(function(comb){
            //console.log(comb);
            me.printDrewSet(comb);
        });
    */
    }

    _isArray(item) {
        if (toString.call(item) ==='[object Array]') return true;
        return false;
    }

    _isObject(item) {
        if (toString.call(item) === '[object Object]' && item.constructor === Object) return true;
        return false;
    }

    _clone(item) {
        if (item === null || item === undefined) return item;
        let i, clone, key;

        if (this._isArray(item)) {
            i = item.length;

            clone = [];
            while (i--) {
                clone[i] = this._clone(item[i]);
            }
        } else if (this._isObject(item)) {
            clone = {};
            for (key in item) {
                clone[key] = this._clone(item[key]);
            }
        }
        return clone || item;
    }

    _equal(a, b) {
        if (a == null || b == null) {
            if (a == null && b == null) {
                return true;
            } else {
                return false;
            }
        }
        let typeA = toString.call(a),
            typeB = toString.call(b),
            i, key;
        if (typeA != typeB || a.constructor != b.constructor)  return false;
        if (this._isArray(a)) {
            if (a.length != b.length) {
                return false;
            }
            for (i=0; i<a.length; i++) {
                if (!this._equal(a[i], b[i])) {
                    return false;
                }
            }
            return true;
        } else if (this._isObject(a)) {
            for (key in a) {
                if (!this._equal(a[key], b[key])) {
                    return false;
                }
            }
            return true;
        } else {
            return (a == b);
        }
    }

    _contain(set, obj) {
        for (let i=0; i<set.length; i++) {
            if (this._equal(set[i], obj)) {
                return true;
            }
        }
        return false;
    }

    _containSet(a, b) {
        for (let i=0; i<b.length; i++) {
            if (!this._contain(a, b[i])) return false;
        }
        return true;
    }

    _include(set, obj) {
        if (!this._contain(set, obj)) {
            set.push(obj);
        }
    }

    _includeSet(a, b) {
        b.forEach(function(item) {
            this._include(a, item);
        });
    }

    _exclude(set, obj) {
        for (let i=0; i<set.length; i++) {
            if (this._equal(set[i], obj)) {
                set.splice(i, 1);
            }
        }
    }

    _excludeSet(set, objSet) {
        let me = this;
        objSet.forEach(function(obj) {
            me._exclude(set, obj);
        });
        return set;
    }

    _deck() {
        return [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    }

    _comb() {
        return {
            sngl: [],
            pair: [],
            trpl: [],
            quad: [],
            str1: [],
            str2: [],
        };
    }
    
    _suitSet() {
        return [[],[],[],[],[],[],[],[],[],[],[],[],[]];
    }
    
    _longChain(set) {
        let l = 1, lchain = [set[0]], chain = [set[0]];
        for (let i=1; i<set.length; i++) {
            if (set[i] - set[i-1] == 1) {
                chain.push(set[i]);
            } else { //chain break
                if (chain.length >= l) {
                    l = chain.length;
                    lchain = chain;
                    chain = [set[i]];
                }
            }
        }
        if (chain.length >= l) {
            lchain = chain;
        }
        return (lchain);
    }

    hDraw(srcDrewSet, srcDeck, size, callback) { //horizontal: pair, trpl, quad, up to size
        let me = this,
            ls = srcDeck.length,
            i, j,
            comboSet = [],
            type = (size == 4? 'quad' : (size == 3? 'trpl' : 'err'));
        srcDrewSet = srcDrewSet || [];
        for (i=0;i<ls;i++) {
            if (srcDeck[i]>=size) {
                comboSet.push(i);
            }
        }
        let lq = comboSet.length,
            n = Math.pow(2, lq);
        for (i=0; i<n; i++) {
            let deck = me._clone(srcDeck),
                drewSet = me._clone(srcDrewSet);
            for (j=0; j<lq; j++) {
                if (i&Math.pow(2, j)) {
                    let key = comboSet[j];
                    drewSet[type].push(key);
                    deck[key] -= size;
                }
            }
            callback(drewSet, deck);
        }
    }

    vDraw(srcDrewSet, srcDeck, size, srcVDrawList, srcChainList, callback) {
        let me = this,
            minL,
            type = 'str' + size.toString(),
            chain = [],
            vDrawList = [],
            chainList = me._clone(srcChainList);
        switch (size) {
        case 2:
            minL = 3;
            break;
        case 1:
            minL = 5;
            break;
        default:
            minL = 99;
        }
        let goThrough = function(chain) {
            let len, s;
            for (len = chain.length; len>= minL; len--) {
                for (s = chain[0]; s <= chain[0] + chain.length - len; s++) {
                    let draw = [s, s+len-1],
                        drewSet = me._clone(srcDrewSet),
                        deck = me._clone(srcDeck),
                        vDrawList = me._clone(srcVDrawList);
                    if (me._contain(vDrawList, draw)) {
                        continue;
                    }
                    vDrawList.push(draw);
                    drewSet[type].push(draw);
                    for (let j=draw[0]; j<=draw[1]; j++) {
                        deck[j] -= size;
                    }
                    me.vDraw(drewSet, deck, size, vDrawList, chainList, callback);
                }
            }
            me.vDraw(srcDrewSet, srcDeck, size, vDrawList || srcVDrawList, chainList, callback);
        };
        if (srcDeck[0] >= size) chain.push(0);
        for (let i=1; i<srcDeck.length && i < 12; i++) {
            if (srcDeck[i] >= size && srcDeck[i-1] >= size) { //chain increase
                chain.push(i);
            } else {
                if (srcDeck[i-1] >= size) { //chain break;
                    if (chain.length >= minL && !me._contain(chainList, chain)) {
                        chainList.push(chain);
                        goThrough(chain);
                    }
                } else if (srcDeck[i] >= size) { //new start
                    chain = [i];
                }
            }
        }
        if (chain.length >= minL && !me._contain(chainList, chain)) {
            chainList.push(chain);
            goThrough(chain);
        }
        callback(srcDrewSet, srcDeck);
    }

    fragmentDraw(srcDrewSet, srcDeck, allcombs) {
        let me = this,
            i,
            drewSet = me._clone(srcDrewSet),
            deck = me._clone(srcDeck);
        for (i=0; i<deck.length; i++) {
            switch (deck[i]) {
            case 0:
                continue;
            case 1:
                deck[i] = 0;
                drewSet.sngl.push(i);
                break;
            case 2:
                deck[i] = 0;
                drewSet.pair.push(i);
                break;
            default:
                return;
            }
        }
        me.printDrewSet(drewSet);
        me.sortDrewSet(drewSet);
        me._include(allcombs, drewSet);
    }

    estimateSteps(drewSet) {
        let fragmentStep = drewSet.sngl.length + drewSet.pair.length - drewSet.trpl.length - 2*drewSet.quad.length,
            steps = drewSet.str2.length + drewSet.str1.length + drewSet.trpl.length + drewSet.quad.length + (fragmentStep < 0? 0 : fragmentStep),
            i;
        [drewSet.trpl, drewSet.quad].forEach(function(type) {
            for (i=1; i<type.length; i++) {
                if (type[i] - type[i-1] == 1)
                    steps--;
            }
        });
        if (drewSet.sngl[13] ==1 && drewSet.sngl[14] ==1)
            steps--;
        return steps;
    }
    /*
    bestSolution(setList) { //to be redesign
        let i, s, min=9999, index;
        for (i=0; i<setList.length; i++) {
            s = this.estimateSteps(setList[i]);
            if (s < min) {
                index = i;
                min = s;
            }
        }
        return setList[index];
    }
    */
    sortDrewSet(drewSet) {
        let /*vSort = function(a, b) {
                if (a[0] == b[0]) {
                    return a[1] - b[1];
                } else {
                    return a[0] - b[0];
                }
            },*/
            hSort = function(a, b) {
                return a - b;
            };
        drewSet.quad.sort(hSort);
        drewSet.trpl.sort(hSort);
        drewSet.pair.sort(hSort);
        drewSet.sngl.sort(hSort);
    }

    printDrewSet(drewSet, sHead) {
        let me = this,
            i,
            note,
            //n = 0,
            str2 = '',
            str1 = '',
            quad = '',
            trpl = '',
            pair = '',
            sngl = '';
        me.debug('---------------------------------'); 
        drewSet.str2.forEach(function(combo) {
            for (i=combo[0]; i<=combo[1]; i++) {
                note = me.keyToNote(i);
                str2 += (note + ' ' + note + ' ');
            }
            str2 += '   ';
            //n++;
        });
        drewSet.str1.forEach(function(combo) {
            for (i=combo[0]; i<=combo[1]; i++) {
                str1 += (me.keyToNote(i) + ' ');
            }
            str1 += '   ';
            //n++;
        });
        drewSet.quad.forEach(function(combo) {
            note = me.keyToNote(combo);
            quad += (note + ' ' + note + ' ' + note + ' ' + note + '    ');
            //n--;
        });
        drewSet.trpl.forEach(function(combo) {
            note = me.keyToNote(combo);
            trpl += (note + ' ' + note + ' ' + note + '    ');
        });
        drewSet.pair.forEach(function(combo) {
            note = me.keyToNote(combo);
            pair += (note + ' ' + note + '    ');
            //n++;
        });
        drewSet.sngl.forEach(function(combo) {
            note = me.keyToNote(combo);
            sngl += (note + '    ');
            //n++;
        });
        sHead = sHead || me.estimateSteps(drewSet).toString() + ' steps';
        me.debug(sHead + ':   ' + str2 + str1 + quad + trpl + pair + sngl);
    }

    resolve(call, myCombs) {
        let me = this,
            callComb = me._comb(),
            answerSet = [],
            remainSet = [],
            answer = me._comb(),
            remain = me._comb(),
            i, type;
        /*
        me.analyzeDeck(call, callComb);
        callComb = me.bestSolution(callComb);*/
        callComb = me._isLegal(call);
        if (!callComb) {
            return me._comb();
        }
        let findBombs = function(){
                myCombs.forEach(function(myComb) {
                    myComb.quad.forEach(function(key) {
                        answer = me._comb();
                        remain = me._clone(myComb);
                        answer.quad.push(key);
                        me._exclude(remain.quad, key);
                        remainSet.push(remain);
                        answerSet.push(answer);
                    });
                });
            }, findRocket = function() {
                myCombs.forEach(function(myComb) {
                    answer = me._comb(),
                    remain = me._clone(myComb);
                    if (me._containSet(myComb.sngl, [13, 14])) {
                        answer.sngl.splice(0, 0, 13, 14);
                        me._excludeSet(remain.sngl, [13, 14]);
                        remainSet.push(remain);
                        answerSet.push(answer);
                    }
                });
            }, strtWin = function(a, b) {
                if (a[1] - a[0] == b[1] - b[0] && a[1] > b[1]) return true;
                return false;
            }, answerAtt = function(callComb, answer, remain, bFree) {    //to be redesign
                let type = 'none';
                if (callComb.sngl.length>0) type = 'sngl';
                else if (callComb.pair.length>0) type = 'pair';
                else return true;
                let l = callComb[type].length;
                for (i=0; i<remain[type].length; i++) {
                    if ((bFree || remain[type][i] > callComb[type][0]) && remain[type].length-i >= l) {
                        answer[type].push.apply(answer[type], remain[type].slice(i, i+l));
                        remain[type].splice(i, l);
                        return true;
                    }
                }
                return false;
            };
        if (callComb.sngl.length == 2 && !callComb.trpl.length && !callComb.quad.length) {        //Rocket
            return me._comb();
        } else if (callComb.quad.length == 1 && !callComb.sngl.length && !callComb.pair.length) { //Bomb
            findRocket();
        } else {
            findBombs();
            findRocket();
        }

        myCombs.forEach(function(myComb) {
            if (callComb.str1.length>0 || callComb.str2.length>0) {
                type = callComb.str1.length>0? 'str1' : 'str2';
                myComb[type].forEach(function(strt) {
                    if (strtWin(strt, callComb[type][0])) {
                        answer = me._comb();
                        answer[type].push(strt);
                        remain = me._clone(myComb);
                        me._exclude(remain[type], strt);
                        remainSet.push(remain);
                        answerSet.push(answer);
                    }
                });
            } else if (callComb.trpl.length>0 || callComb.quad.length>0) {
                type = callComb.trpl.length>0? 'trpl' : 'quad';
                let l = callComb[type].length,
                    typeSegSet = [],
                    //    typeSeg = new Array(l);
                    //for (i=0; i<l; i++)
                    //    typeSeg[i] = callComb[type][0] + i;
                    //find sequence of triple or quadro card set(treat single as length 1 sequence)
                    keys = myComb[type],
                    typeSeg = [];
                for (i=0; i<keys.length; i++) {
                    if (keys[i] <= callComb[type][0]) continue;
                    if (i==0 || keys[i]-keys[i-1] == 1) {
                        typeSeg.push(keys[i]);
                    } else {
                        if (typeSeg.length >= l) {
                            typeSegSet.push(typeSeg);
                        }
                        typeSeg=[keys[i]];
                    }
                    if (i == keys.length-1)
                        typeSegSet.push(typeSeg);
                }
                
                typeSegSet.forEach(function(typeSeg) { //record each answer and find attached singles or pairs
                    let segL = typeSeg.length;
                    for (i=0; i<=segL-l; i++) {
                        let seq = typeSeg.slice(i, i+segL);
                        remain = me._clone(myComb);
                        me._excludeSet(remain[type], seq);
                        answer = me._comb();
                        answer[type].push.apply(answer[type], seq);
                        if (!answerAtt(callComb, answer, remain, true)) {
                            continue;
                        }
                        remainSet.push(remain);
                        answerSet.push(answer);
                    }
                });
            } else {
                remain = me._clone(myComb);
                answer = me._comb();
                if (answerAtt(callComb, answer, remain, false)) {
                    remainSet.push(remain);
                    answerSet.push(answer);
                }
            }
        });
        for (i=0; i<answerSet.length; i++) {
            this.printDrewSet(answerSet[i], 'answer');
            this.printDrewSet(remainSet[i], 'remain');
        }
        return me.bestAnswer(answerSet, remainSet);
    }
    /*
    evaluate(combs) {
        let me = this,
            flex = me._deck(),
            usage = [];
        for (let i=0; i<15; i++) {
            usage.push(me._comb());
        }
        combs.forEach(function(comb) {
            comb.quad.forEach(function(key) {
                me._include(usage[key].quad, key);
            });
            comb.trpl.forEach(function(key) {
                me._include(usage[key].trpl, key);
            });
            comb.str2.forEach(function(str) {
                for (let i=str[0]; i<=str[1]; i++) {
                    me._include(usage[i].str2, str);
                }
            });
            comb.str1.forEach(function(str) {
                for (let i=str[0]; i<=str[1]; i++) {
                    me._include(usage[i].str1, str);
                }
            });
        });
        
    }
    */
    bestAnswer(answerSet, remainSet) { //to be redesign
        let i, index, s, min = 9999;
        for (i=0;i<remainSet.length;i++) {
            s = this.estimateSteps(remainSet[i]);
            if (s < min) {
                min = s;
                index = i;
            }
        }
        return answerSet[index] || this._comb();
    }
    
    bestComb(combinations) {           //to be redesign
        return this.bestAnswer(combinations, combinations);
    }
    
    decide(comb) {                      //to be redesign
        let me = this,
            playComb = me._comb(),
            snglSet = me._clone(comb.sngl);
        me._exclude(snglSet, [13,14]);
        comb = me._clone(comb);
        if (me.estimateSteps(comb) <=3 && me._isLegal(me.combToDeck(comb))) {
            return comb;
        }
        if (comb.str2.length>0) {
            playComb.str2.push(comb.str2[0]);
        } else if (comb.str1.length>0) {
            playComb.str1.push(comb.str1[0]);
        } else if (comb.trpl.length>0) {
            do {
                playComb.trpl.push(comb.trpl.shift());
            } while (comb.trpl.length>0 && comb.trpl[0] < 12 && comb.trpl[0] - playComb.trpl[playComb.trpl.length-1] == 1);
            if (snglSet.length > playComb.trpl.length) {
                playComb.sngl.push.apply(playComb.sngl, snglSet.slice(0, 0 + playComb.trpl.length));
            } else if (comb.pair.length > playComb.pair.length){
                playComb.pair.push(comb.pair[0]);
            }
        } else if (comb.pair.length>0) {
            playComb.pair.push(comb.pair[0]);
        } else if (snglSet.length>0 || comb.sngl.length - snglSet.length < 2) {
            playComb.sngl.push(comb.sngl[0]);
        } else if (comb.quad.length>0) {
            playComb.quad.push(comb.quad[0]);
        } else {
            playComb.sngl.splice(0, 0, 13, 14);
        }
        return playComb;
    }

    combToDeck(combination) {
        let me = this,
            deck = me._deck();
        combination.sngl.forEach(function(key) {
            deck[key] ++;
        });
        combination.pair.forEach(function(key) {
            deck[key] +=2;
        });
        combination.trpl.forEach(function(key) {
            deck[key] +=3;
        });
        combination.quad.forEach(function(key) {
            deck[key] +=4;
        });
        combination.str1.forEach(function(seq) {
            for (let key=seq[0]; key<=seq[1]; key++) {
                deck[key]++;
            }
        });
        combination.str2.forEach(function(seq) {
            for (let key=seq[0]; key<=seq[1]; key++) {
                deck[key]+=2;
            }
        });
        return deck;
    }

    deckToCards(deck, bDeduct) {
        let me = this,
            cards = [],
            i;
        for (i=0;i<13;i++) {
            for (let j=deck[i]-1; j>=0; j--) {
                cards.push(i*4 + me.suitSet[i][j]);
                if (bDeduct) {
                    me.suitSet[i].splice(j, 1);
                    me.handDeck[i]--;
                }
            }
        }
        for (i=13; i<15; i++) {
            if (deck[i]==1) {
                cards.push(39 + i);
                bDeduct && me.handDeck[i]--;
            }
        }
        return cards;
    }

    receiveCards(v) {  //发牌
        let me = this;
        if (me.isCards(v)) {
            me._receiveCards(v, me.handCards, me.handDeck, me.suitSet);
        } else if (me.isDeck(v)){
            for (let i=0; i<13; i++) {
                for (let j=0; j<v[i]; j++) {
                    me.handCards.push(i*4 + j);
                    me.suitSet[i].push(j);
                }
                me.handDeck[i] += v[i];
            }
            if (v[13] == 1) {
                me.handCards.push(52);
                me.handDeck[13]++;
            }
            if (v[14] == 1) {
                me.handCards.push(53);
                me.handDeck[14]++;
            }
        } else {
            me.debug('No cards.');
            return;
        }
        me.allCombinations = [];
        me.analyzeDeck(me.handDeck, me.allCombinations);
        let minStep = 999;
        me.allCombinations.forEach(function(comb){
            let s = me.estimateSteps(comb);
            if (s<minStep) minStep = s;
            //me.printDrewSet(comb);
        });
        console.log('===================================');
        me.printDeck(me.handDeck, me.name);
        me.debug('final result:');
        me.allCombinations.forEach(function(comb){
            let s = me.estimateSteps(comb);
            if (s<=minStep+2) me.printDrewSet(comb);
        });
    }

    otherPlay(cards, name) {      //他人出牌
        let me = this;
        if (name == me.name) return;
        me._receiveCards(cards, null, me.table);
        me.players['name'] -= cards.length;
    }
    
    otherReceive(num, name) {   //他人收牌
        let me = this;
        if (name == me.name) return;
        me.players['name'] = me.players['name'] || 0;
        me.players['name'] += num;
        if (num == 2) {
            me.landlord = name;
        }
    }

    decideCall() {      //确定要出的牌
        let me = this;
        if (!me.allCombinations || me.allCombinations.length == 0) {
            me.analyzeDeck(me.handDeck, me.allCombinations);
        }
        return me.deckToCards(me.combToDeck(me.decide(me.bestComb(me.allCombinations))));
    }

    decideAnswer(cards) {  //确定应牌
        let me = this,
            call = me._deck();
        me._receiveCards(cards, null, call);
        let resolution = me.resolve(call, me.allCombinations);
        return me.deckToCards(me.combToDeck(resolution));
    }
    
    play(cards) {        //实际出牌
        let me = this,
            deck = me._deck();
        if (!(cards && cards.length>0 && me.isCards(cards))) {
            console.log(me.name + ' pass');
            return;
        }
        cards.forEach(function(card) {
            let i, suit;
            if (card<52) {
                i = Math.floor(card/4);
                suit = card - i*4;
                me.handDeck[i]--;
                me._exclude(me.suitSet[i], suit);
                me.table[i]++;
                deck[i]++;
            } else if (card == 52) {
                me.handDeck[13]--;
                me.table[13]++;
                deck[13]++;
            } else if (card == 53) {
                me.handDeck[14]--;
                me.table[14]++;
                deck[14]++;
            }
            me._exclude(me.handCards, card);
        });
        me.printDeck(deck, me.name + ' play');
        me.printDeck(me.handDeck, me.name + ' hand');
        me.allCombinations = [];
        me.analyzeDeck(me.handDeck, me.allCombinations);
    }
    
    isLegal(v) {        //判断是否合法
        let me = this,
            deck = me._deck();
        if (me.isCards(v)) {
            me._receiveCards(v, null, deck);
        } else if (me.isDeck(v)) {
            deck = v;
        } else return false;
        if (me._isLegal(deck)) {
            return true;
        } else {
            return false;
        }
    }
    
    _isLegal(deck) {
        let me = this,
            allcombs = [],
            legalSet = [];
        if (!deck) {
            deck = me.handDeck;
            allcombs = me.allCombinations;
        }
        if (deck.length == 0) return false;
        if (!allcombs || allcombs.length == 0) {
            me.analyzeDeck(deck, allcombs);
        }
        let islegal = function(comb) {
                let i;
                if (comb.str2.length>0) {
                    if (comb.str2.length> 1 || comb.str1.length>0 || comb.sngl.length>0 || comb.pair.length>0
                        || comb.trpl.length>0 || comb.quad.length>0) {
                        return false;
                    }
                    return comb;
                } else if (comb.str1.length>0) {
                    if (comb.str1.length> 1 || comb.str2.length>0 || comb.sngl.length>0 || comb.pair.length>0
                        || comb.trpl.length>0 || comb.quad.length>0) {
                        return false;
                    }
                    return comb;
                } else if (comb.quad.length>0) {
                    if (comb.str2.length> 0 || comb.str1.length>0 || comb.trpl.length>0) {
                        return false;
                    }
                    for (i=1; i<comb.quad.length; i++) {
                        if (comb.quad[i]-comb.quad[i-1]>1) {
                            return false;
                        }
                    }
                    if (comb.pair.length > 0 && comb.sngl.length > 0) {
                        return false;
                    } else if (comb.pair.length > 0) {
                        if (comb.sngl.length != comb.quad.length && comb.sngl.length != comb.quad.length * 2) return false;
                    } else if (comb.sngl.length > 0) {
                        if (comb.sngl.length != comb.quad.length && comb.sngl.length != comb.quad.length * 2) return false;
                    }
                    return comb;
                } else if (comb.trpl.length>0) {
                    if (comb.str2.length> 0 || comb.str1.length>0 || comb.quad.length>0) {
                        return false;
                    }
                    for (i=1; i<comb.trpl.length; i++) {
                        if (comb.trpl[i]-comb.trpl[i-1]>1) {
                            return false;
                        }
                    }
                    if (comb.pair.length > 0 && comb.sngl.length > 0) {
                        return false;
                    } else if (comb.pair.length > 0) {
                        if (comb.pair.length != comb.trpl.length) return false;
                    } else if (comb.sngl.length > 0) {
                        if (comb.sngl.length != comb.trpl.length) return false;
                    }
                    return comb;
                } else if (comb.pair.length + comb.sngl.length == 1) {
                    return comb;
                } else if (me._equal(comb.sngl, [13, 14]) && comb.pair.length == 0) {
                    return comb;
                }
                return false;
            }, breakComb = function(newComb, combToBreak) {
                let deck = me.combToDeck(combToBreak),
                    newComb2 = me._clone(newComb),
                    isEven = true,
                    i, j;
                for (i=0; i<deck.length; i++) {
                    for (j=0; j<deck[i]; j++) {
                        newComb.sngl.push(i);
                    }
                }
                for (i=0; i<deck.length; i++) {
                    if (deck[i]%2 == 1) {
                        isEven = false;
                        break;
                    }
                    for (j=0; j<deck[i]/2; j++) {
                        newComb2.pair.push(i);
                    }
                }
                return islegal(newComb) || (isEven && islegal(newComb2));
            }, complex = function(comb) {
                return comb.quad.length + comb.trpl.length + comb.str2.length + comb.str1.length + comb.pair.length + comb.sngl.length;
            };
        for (let i=0; i<allcombs.length; i++) {
            let comb = allcombs[i],
                newComb,
                combToBreak,
                result;
            if (comb.trpl.length > 0 && comb.trpl.length > comb.quad.length) {
                newComb = me._comb();
                newComb.trpl = me._longChain(comb.trpl);
                combToBreak = me._clone(comb);
                me._excludeSet(combToBreak.trpl, newComb.trpl);
                result = breakComb(newComb, combToBreak);
            } else if (comb.quad.length > 0) {
                newComb = me._comb();
                newComb.quad = me._longChain(comb.quad);
                combToBreak = me._clone(comb);
                me._excludeSet(combToBreak.quad, newComb.quad);
                result = breakComb(newComb, combToBreak);
            } else
                result = islegal(comb);
            if (result)
                legalSet.push(result);
        }
        let minComplex = 999,
            minIndex;
        for (let i=0; i<legalSet.length; i++) {
            let c = complex(legalSet[i]);
            if (c<minComplex) {
                minComplex = c;
                minIndex = i;
            }
        }
        if (minComplex == 999) return false;
        else return legalSet[minIndex];
    }
    
    win (cards1, cards2) {  //判断cards1是否压过cards2
        let me = this;
        if (!me.isCards(cards1) || (!me.isCards(cards2))) return false;
        let deck1 = me._deck(),
            deck2 = me._deck();
        me._receiveCards(cards1, null, deck1);
        me._receiveCards(cards2, null, deck2);
        return this._win(deck1, deck2);
    }
    
    _win (deck1, deck2) {
        let me = this,
            comb1 = me._isLegal(deck1),
            comb2 = me._isLegal(deck2),
            bombValue = function(comb) { //2 for rocket, 1 for bomb, 0 for others
                if (comb.quad.length == 1 && (comb.trpl.length + comb.str1.length + comb.str2.length + comb.sngl.length + comb.pair.length) == 0 )
                    return 1;
                else if (me._equal(comb.sngl, [13, 14]) && (comb.quad.length + comb.trpl.length + comb.str1.length + comb.str2.length + comb.pair.length) == 0 )
                    return 2;
                else
                    return 0;
            }, win = function(comb1, comb2) {
                if (comb2.str2.length == 1) {
                    let ss1 = comb1.str2,
                        ss2 = comb2.str2;
                    if (ss1.length == 1 && ss1[0][0] > ss2[0][0] && ss1[0][1] - ss1[0][0] == ss2[0][1] - ss2[0][0])
                        return true;
                } else if (comb2.str1.length == 1) {
                    let s1 = comb1.str1,
                        s2 = comb2.str1;
                    if (s1.length == 1 && s1[0][0] > s2[0][0] && s1[0][1] - s1[0][0] == s2[0][1] - s2[0][0])
                        return true;
                } else if (comb2.trpl.length > 0) {
                    let tr1 = comb1.trpl,
                        tr2 = comb2.trpl;
                    if (tr1.length == tr2.length && tr1[0] > tr2[0] && comb1.pair.length == comb2.pair.length && comb1.sngl.length == comb2.sngl.length)
                        return true;
                } else if (comb2.quad.length > 0) {
                    let tr1 = comb1.quad,
                        tr2 = comb2.quad;
                    if (tr1.length == tr2.length && tr1[0] > tr2[0] && comb1.pair.length == comb2.pair.length && comb1.sngl.length == comb2.sngl.length)
                        return true;
                } else if (comb2.pair.length == 1) {
                    if (comb1.pair.length == 1 && comb1.pair[0] > comb2.pair[0])
                        return true;
                } else if (comb2.sngl.length == 1) {
                    if (comb1.sngl.length == 1 && comb1.sngl[0] > comb2.sngl[0])
                        return true;
                }
                return false;
            };
        if (!comb1 || !comb2) return false;
        if (bombValue(comb1) > bombValue(comb2)) {
            return true;
        } else if (bombValue(comb1) < bombValue(comb2)) {
            return false;
        } else {
            return win(comb1, comb2);
        }
    }
}

export default Strategy;

/* test win function
let s = new Strategy();
console.log(s.win([28, 30, 40, 41, 43], [5, 4, 10, 11, 8]));
*/

/* Example of 3 NPC's game
let s = [new Strategy(null, 'Jack'), new Strategy(null, 'Rose'), new Strategy(null, 'Lei')],
    cards = s[0].generateCards();

s[0].receiveCards(cards.slice(0, 17)),
s[1].receiveCards(cards.slice(17, 34));
s[2].receiveCards(cards.slice(34, 51));
let i = Math.floor(Math.random()*3);
if (i>2)
    i = 2;
s[i].receiveCards(cards.slice(51,54));    //landlord get 3 more cards
console.log(s[i].name + ' is the landlord!');

//let s = [new Strategy([1,0,0,2,1,2,1,3,1,2,1,1,2,0,0], 'Jack'), new Strategy([1,2,3,1,1,1,2,0,1,1,3,2,1,0,1], 'Rose'), new Strategy(null, 'Lei')],    i = 1;
let instruction = [i, null, false];    //who's turn, round leader, call
while (s[i].handCards.length > 0) {
    let i = instruction[0],
        leader = instruction[1],
        target = instruction[2];
    if (i == leader || !(target && target.length >0)) {
        let call = s[i].decideCall();
        instruction = [(i+1)%3, i, call];   //no one answered, back to leader and new round started
        s[i].play(call);
        [s[(i+1)%3], s[(i+2)%3]].forEach(function(player) {
            player.otherPlay(call);
        });
    } else {
        let answer = s[i].decideAnswer(target);
        if (answer && answer.length>0) {
            instruction = [(i+1)%3, i, answer];     //answer card, become leader of new round
            s[i].play(answer);
            [s[(i+1)%3], s[(i+2)%3]].forEach(function(player) {
                player.otherPlay(answer);
            });
        } else {
            instruction = [(i+1)%3, leader, target];  //can't afford, no answer, round continue;
            s[i].play([]);
        }
    }
}
s[i].printDeck(s[i].table, s[i].name + ' table');
let a = (i+1)%3;
s[a].printDeck(s[a].handDeck, s[a].name + ' hand');
a = (i+2)%3;
s[a].printDeck(s[a].handDeck, s[a].name + ' hand');
console.log(s[i].name + ' is the WINNER!');
*/