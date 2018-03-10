import Phaser from '../importPhaser';
import game from '../Game';
import cards from '../Cards';
let eventMgr = require('../../../util/EventMgr');

let _centerBackCard,
    _aiBackCards1,
    _aiLeftText1,
    _aiBackCards2,
    _aiLeftText2,
    _myCards,
    _movedBackCards = [],
    _onePointBtn,
    _twoPointBtn,
    _threePointBtn,
    _hintBtn,
    _playBtn,
    _coverHintBtn,
    _coverDiscardBtn,
    _coverBtn,
    _pointText0,
    _pointText1,
    _pointText2,
    _pointerStart,
    _pointerEnd,
    _beginPlayCards = false,
    _bmd,
    _playCardsGrp,
    _ai1CardsGrp,
    _ai2CardsGrp,
    _dontText0,
    _dontText1,
    _dontText2,
    _popCardsCount = 0,
    _leftTimeText0,
    _leftTimeText1,
    _leftTimeText2,
    _timerEvent;
const _TEXT_STYLE = {font: '56px', fill: 'red'},
    _LEFT_TEXT_STYLE = {font: '38px', fill: 'white'},
    _LEFT_TIME_TEXT_STYLE = {font: '56px', fill: 'red'},
    _SELECTED_MASK = 0xff7777,
    _ORIGIN_MASK = 0xffffff,
    _DISABLED_MASK = 0x8855AA;
export default {
    create() {
        _hintBtn = _playBtn = _coverHintBtn = _coverBtn = _coverDiscardBtn = undefined;
        _beginPlayCards = false;
        _bmd = game.add.bitmapData(game.width, game.height);
        _bmd.addToWorld();
        _popCardsCount = 0;
        _movedBackCards = [];
        cards.load();
        this.showProtraits();
        this.showCenterBackCard();
        this.showAIBackCards();
        this.showAILeftCardNums();

        _myCards = game.add.group();

        _playCardsGrp = game.add.group();
        _playCardsGrp.scale.setTo(0.7);
        _ai1CardsGrp = game.add.group();
        _ai1CardsGrp.scale.setTo(0.6);
        _ai2CardsGrp = game.add.group();
        _ai2CardsGrp.scale.setTo(0.6);
        _dontText0 = game.add.text(0, 0, '不 要', _TEXT_STYLE);
        _dontText1 = game.add.text(0, 0, '不 要', _TEXT_STYLE);
        _dontText2 = game.add.text(0, 0, '不 要', _TEXT_STYLE);
        _dontText0.kill();
        _dontText1.kill();
        _dontText2.kill();
        _leftTimeText0 = game.add.text(0, 0, '0', _LEFT_TIME_TEXT_STYLE);
        _leftTimeText0.centerX = game.world.bounds.width * 0.25 - cards.getWidth() / 2;
        _leftTimeText0.centerY = game.world.bounds.height - cards.getHeight() * 9 / 6;
        _leftTimeText1 = game.add.text(0, 0, '0', _LEFT_TIME_TEXT_STYLE);
        _leftTimeText2 = game.add.text(0, 0, '0', _LEFT_TIME_TEXT_STYLE);
        _leftTimeText0.kill();
        _leftTimeText1.kill();
        _leftTimeText2.kill();
        eventMgr.fire('enterMainState');
        this.input.onDown.add(this._onMouseDown);
        this.input.onUp.add(this.popSelectedCards, this);
    },
    _onMouseDown() {
        const {x, y} = game.device.desktop ? game.input.mousePointer : game.input.pointer1;
        _pointerStart = {x, y};
    },
    update() {
        const {x, y, isDown} = game.device.desktop ? game.input.mousePointer : game.input.pointer1;
        
        if(_beginPlayCards) {
            if(isDown) {
                _pointerEnd = {x, y};
                let rect = this.makeRectangle(_pointerStart, _pointerEnd),
                    leftTopP = {x: rect.x, y: rect.y},
                    rightBottomP = {x: rect.x + rect.width, y: rect.y + rect.height};
                this.pickCards(leftTopP, rightBottomP);
            }
        }
    },
    shutdown() {
        _bmd && _bmd.destroy();
        let [...hasTintObjs] = [_onePointBtn, _twoPointBtn, _threePointBtn, _playBtn, _hintBtn,
            _coverBtn, _coverHintBtn, _coverDiscardBtn, ...cards];
        for(let c of hasTintObjs) {
            if(c && c.tintedTexture) {
                window.PIXI.CanvasPool.removeByCanvas(c.tintedTexture);
            }
        }
    },
    getBottomPadding() {
        return cards.getHeight() / 6;
    },
    getPopHeight() {
        return cards.getHeight() / 8;
    },
    popSelectedCards() {
        if(_beginPlayCards) {
            for(let c of this.getPickedCards()) {
                if(this.isCardPop(c)) {
                    c.y += this.getPopHeight();
                    _popCardsCount--;
                } else {
                    c.y -= this.getPopHeight();
                    _popCardsCount++;
                }
                this.restoreCardMask(c);
                if(_popCardsCount > 0) {
                    this.enableBtn(_playBtn);
                    this.enableBtn(_coverBtn);
                } else {
                    this.disableBtn(_playBtn);
                    this.disableBtn(_coverBtn);
                }
            }
        }
    },
    dropCards(cs) {
        if(this._isActiveState()) {
            let popCards = this.getAliveCards().filter(card => cs.includes(card.data.index));
            this.resetMyCards();
            popCards.forEach(c => this.removeCardsFromMyCards(c));
            this.alignMyCards();
            this.hidePlayBtns();
            this.hideCoverBtns();
            this.showPlayCards(popCards);
            _beginPlayCards = false;
        }
    },
    discard() {
        if(this._isActiveState()) {
            this.resetMyCards();
            this.alignMyCards();
            this.hidePlayBtns();
            this.hideCoverBtns();
            this.showPlayDontText();
            _beginPlayCards = false;
        }
    },
    resetMyCards() {
        this.getPopCards().forEach(c => c.y += this.getPopHeight());
        _popCardsCount = 0;
        this.getPickedCards().forEach(c => this.restoreCardMask(c));
        this.disableBtn(_playBtn);
        this.disableBtn(_coverBtn);
    },
    enableBtn(btn) {
        btn && (btn.tint = _ORIGIN_MASK);
    },
    disableBtn(btn) {
        btn && (btn.tint = _DISABLED_MASK);
    },
    isBtnDisabled(btn) {
        return btn.tint == _DISABLED_MASK;
    },
    getAliveCards() {
        return _myCards.children.filter(c => c.alive);
    },
    getPopCards() {
        return this.getAliveCards().filter(c => this.isCardPop(c));
    },
    restoreCardMask(card) {
        card.tint = _ORIGIN_MASK;
    },
    isCardPop(card) {
        let b = card.getBounds();
        return (game.world.bounds.height - (b.y + b.height) - 1) > this.getBottomPadding();
    },
    getPickedCards() {
        return this.getAliveCards().filter(c => c.tint == _SELECTED_MASK);
    },
    getNonPickedCards() {
        return this.getAliveCards().filter(c => c.tint == _ORIGIN_MASK);
    },
    pickCards(p1, p2) {
        const cards = this.getAliveCards();
        function getPointCardIndex({x, y}) {
            for(let i = cards.length - 1; i >= 0; --i) {
                let child = cards[i];
                if(Phaser.Rectangle.contains(child.getBounds(), x, y)) {
                    return i;
                }
            }
            return -1;
        }
        if(Phaser.Rectangle.contains(_myCards.getBounds(), p1.x, p1.y) 
            && Phaser.Rectangle.contains(_myCards.getBounds(), p2.x, p2.y)) {
            let start = getPointCardIndex({x: p1.x, y: p1.y}),
                end = getPointCardIndex({x: p2.x, y: p2.y});

            if(start >= 0 && end >= 0) {
                for(let i = 0; i < cards.length; ++i) {
                    let child = cards[i];
                    if(i >= start && i <= end) {
                        child.tint = _SELECTED_MASK;
                    } else {
                        child.tint = _ORIGIN_MASK;
                    }
                }
            }
        }
    },
    makeRectangle(p1, p2) {
        let minX = Math.min(p1.x, p2.x),
            minY = Math.min(p1.y, p2.y),
            maxX = Math.max(p1.x, p2.x),
            maxY = Math.max(p1.y, p2.y);
        return {x: minX, y: minY, width: maxX - minX, height: maxY - minY};
    },
    showProtraits() {
        let p1 = game.add.image(game.world.bounds.width - 160, 30, 'portrait1'),
            p2 = game.add.image(30, 30, 'portrait2');
        p1.width = p1.height = p2.width = p2.height = 130;
    },
    showCenterBackCard() {
        _centerBackCard = game.add.image(game.world.bounds.width/2, game.world.bounds.height/2 - 50, 'back_card');
        _centerBackCard.anchor.set(0.5);
    },
    showDiZhuProtraits(index) {
        let p = game.add.image(0, 0, 'dizhuPic');
        p.width = p.height = 130;
        if(index == 1) {
            p.x = game.world.bounds.width - 160;
            p.y = 30;
        } else if(index == 2) {
            p.x = p.y = 30;
        } else if(index == 0) {
            p.x = game.world.bounds.width - 160;
            p.y = game.world.bounds.height - cards.getHeight() * 8 / 6 - 130;
        }
        p.bringToTop();
    },
    showAIBackCards() {
        _aiBackCards1 = game.add.image(game.world.bounds.width - 95, 200, 'back_card');
        _aiBackCards1.anchor.set(0.5, 0);
        _aiBackCards1.scale.setTo(0.7);
        _aiBackCards2 = game.add.image(95, 200, 'back_card');
        _aiBackCards2.anchor.set(0.5, 0);
        _aiBackCards2.scale.setTo(0.7);
        _aiBackCards1.kill();
        _aiBackCards2.kill();
    },
    showAILeftCardNums() {
        _aiLeftText1 = game.add.text(0, 0, '0', _LEFT_TEXT_STYLE);
        _aiLeftText1.alignTo(_aiBackCards1, Phaser.BOTTOM_CENTER, 0, 5);
        _aiLeftText2 = game.add.text(0, 0, '0', _LEFT_TEXT_STYLE);
        _aiLeftText2.alignTo(_aiBackCards2, Phaser.BOTTOM_CENTER, 0, 5);
        _aiLeftText1.kill();
        _aiLeftText2.kill();
    },
    addCardToMyCard(card) {
        _myCards.add(card);
        this.sortCards(_myCards);
        this.alignMyCards();
    },
    sortCards(cardsGroup) {
        cardsGroup.customSort(cards.sortFunc);
    },
    alignMyCards() {
        _myCards.align(-1, 1, cards.getWidth()/4, cards.getHeight());
        _myCards.alignIn(game.world.bounds, Phaser.BOTTOM_CENTER, 0, -this.getBottomPadding());
    },
    showPlayCards(cs) {
        _playCardsGrp.removeAll();
        cs.forEach(c => _playCardsGrp.add(c));
        this.alignPlayCards();
    },
    alignPlayCards() {
        let cHeight = cards.getHeight();
        _playCardsGrp.align(-1, 1, cards.getWidth()/4, cards.getHeight());
        _playCardsGrp.alignIn(game.world.bounds, Phaser.BOTTOM_CENTER, 0, -(cHeight * 8 / 6 ));
    },
    showPlayDontText() {
        _dontText0.revive();
        this.showPlayCards([_dontText0]);
    },
    showAI1PlayCards(cs) {
        _ai1CardsGrp.removeAll();
        cs.forEach(c => {
            c.revive();
            _ai1CardsGrp.add(c);
        });
        this.sortCards(_ai1CardsGrp);
        this.alignAI1PlayCards();
    },
    alignAI1PlayCards() {
        _ai1CardsGrp.align(-1, 1, cards.getWidth()/4, cards.getHeight());
        _ai1CardsGrp.alignTo(_aiBackCards1, Phaser.LEFT_CENTER, 30, 0);
        setTimeout(() => this.handlePlayCardsOverlap(), 0);
    },
    showAI1PlayDontText() {
        _dontText1.revive();
        this.showAI1PlayCards([_dontText1]);
    },
    showAI2PlayDontText() {
        _dontText2.revive();
        this.showAI2PlayCards([_dontText2]);
    },
    showAI2PlayCards(cs) {
        _ai2CardsGrp.removeAll();
        cs.forEach(c => {
            c.revive();
            _ai2CardsGrp.add(c);
        });
        this.sortCards(_ai2CardsGrp);
        this.alignAI2PlayCards();
    },
    alignAI2PlayCards() {
        _ai2CardsGrp.align(-1, 1, cards.getWidth()/4, cards.getHeight());
        _ai2CardsGrp.alignTo(_aiBackCards2, Phaser.RIGHT_CENTER, 30, 0);
        setTimeout(() => this.handlePlayCardsOverlap(), 0);
    },
    handlePlayCardsOverlap() {
        if(Phaser.Rectangle.intersects(_ai1CardsGrp.getBounds(), _ai2CardsGrp.getBounds())) {
            _ai2CardsGrp.alignTo(_aiBackCards2, Phaser.RIGHT_TOP, 30, _aiBackCards2.height / 2);
            _ai1CardsGrp.alignTo(_aiBackCards1, Phaser.LEFT_BOTTOM, 30, _aiBackCards2.height / 3);
        }
    },
    clearPlayCardsExceptByName(name) {
        if(name == '0') {
            _ai1CardsGrp.removeAll();
            _ai2CardsGrp.removeAll();
        } else if(name == '1') {
            _playCardsGrp.removeAll();
            _ai2CardsGrp.removeAll();
        } else if(name == '2') {
            _playCardsGrp.removeAll();
            _ai1CardsGrp.removeAll();
        }
        this.hidePoints();
    },
    showDiZhuCards(cs) {
        let left = game.world.bounds.width / 5,
            top = this.getBottomPadding() / 2;

        for(let c of cs.sort(cards.sortFunc)) {
            c.scale.setTo(1);
            const {x, y} = c.anchor;
            c.anchor.set(0);
            _bmd.draw(c, left, top, c.width / 2, c.height / 2);
            c.anchor.set(x, y);
            left += c.width * 1.2 / 2;
        }
    },
    removeCardsFromMyCards(c) {
        _myCards.remove(c);
    },
    getMovedBackCard() {
        let retCard = _movedBackCards.find(card => card.alive === false);
        if(retCard) {
            return retCard;
        }
        let newCard = game.add.sprite(0, 0, 'back_card');
        _movedBackCards.push(newCard);
        newCard.anchor.set(0.5);
        return newCard;
    },
    showPointBtns() {
        let cardHeight = cards.getHeight();
        _onePointBtn = game.add.button(0, 0, 'onePointBtn', this.clickOnePointBtn, this, 0, 0, 1);
        _onePointBtn.centerX = game.world.bounds.width / 3;
        _onePointBtn.centerY = game.world.bounds.height - cardHeight * 9 / 6;
        _twoPointBtn = game.add.button(0, 0, 'twoPointBtn', this.clickTwoPointBtn, this, 0, 0, 1);
        _twoPointBtn.centerX = game.world.bounds.width / 2;
        _twoPointBtn.centerY = game.world.bounds.height - cardHeight * 9 / 6;
        _threePointBtn = game.add.button(0, 0, 'threePointBtn', this.clickThreePointBtn, this, 0, 0, 1);
        _threePointBtn.centerX = game.world.bounds.width * (2 / 3);
        _threePointBtn.centerY = game.world.bounds.height - cardHeight * 9 / 6;
    },
    showPlayBtns() {
        _playCardsGrp.removeAll();
        let cardHeight = cards.getHeight();
        if(!_hintBtn) {
            _hintBtn = game.add.button(0, 0, 'hintBtn', this.clickHintBtn, this, 0, 0, 1);
            _hintBtn.centerX = game.world.bounds.width * 2 / 5;
            _hintBtn.centerY = game.world.bounds.height - cardHeight * 9 / 6;  
        } else if(!_hintBtn.alive) {
            _hintBtn.revive();
        }
        if(!_playBtn) {
            _playBtn = game.add.button(0, 0, 'playBtn', this.clickPlayBtn, this, 0, 0, 1);
            _playBtn.centerX = game.world.bounds.width * 3 / 5;
            _playBtn.centerY = game.world.bounds.height - cardHeight * 9 / 6;
        } else if(!_playBtn.alive) {
            _playBtn.revive();
        }
        this.enableBtn(_hintBtn);
    },
    hidePlayBtns() {
        if(_hintBtn) {
            _hintBtn.kill();
        }
        if(_playBtn) {
            _playBtn.kill();
        }
    },
    showCoverBtns() {
        _playCardsGrp.removeAll();
        let cardHeight = cards.getHeight();
        if(!_coverHintBtn) {
            _coverHintBtn = game.add.button(0, 0, 'hintBtn', this.clickHintBtn, this, 0, 0, 1);
            _coverHintBtn.centerX = game.world.bounds.width / 3;
            _coverHintBtn.centerY = game.world.bounds.height - cardHeight * 9 / 6;  
        } else if(!_coverHintBtn.alive) {
            _coverHintBtn.revive();
        }
        if(!_coverBtn) {
            _coverBtn = game.add.button(0, 0, 'playBtn', this.clickCoverBtn, this, 0, 0, 1);
            _coverBtn.centerX = game.world.bounds.width * 2 / 3;
            _coverBtn.centerY = game.world.bounds.height - cardHeight * 9 / 6;
        } else if(!_coverBtn.alive) {
            _coverBtn.revive();
        }
        if(!_coverDiscardBtn) {
            _coverDiscardBtn = game.add.button(0, 0, 'discardBtn', this.clickDiscardBtn, this, 0, 0, 1);
            _coverDiscardBtn.centerX = game.world.bounds.width / 2;
            _coverDiscardBtn.centerY = game.world.bounds.height - cardHeight * 9 / 6;
        } else if(!_coverDiscardBtn.alive) {
            _coverDiscardBtn.revive();
        }
        this.enableBtn(_coverHintBtn);
        this.enableBtn(_coverDiscardBtn);
    },
    hideCoverBtns() {
        if(_coverHintBtn) {
            _coverHintBtn.kill();
        }
        if(_coverBtn) {
            _coverBtn.kill();
        }
        if(_coverDiscardBtn) {
            _coverDiscardBtn.kill();
        }
    },
    showPoint(point, index) {
        if(this._isActiveState()) {
            if(index === 0) {
                _pointText0 = game.add.text(0, 0, point + ' 分', _TEXT_STYLE);
                _pointText0.centerX = game.world.bounds.width / 2;
                _pointText0.centerY = game.world.bounds.height - cards.getHeight() * 87 / 60;
            } else if (index === 1) {
                _pointText1 = game.add.text(0, 0, point + ' 分', _TEXT_STYLE);
                _pointText1.alignTo(_aiBackCards1, Phaser.LEFT_CENTER, 30, 0);
            } else if (index === 2) {
                _pointText2 = game.add.text(0, 0, point + ' 分', _TEXT_STYLE);
                _pointText2.alignTo(_aiBackCards2, Phaser.RIGHT_CENTER, 30, 0);
            }
            this.killPointBtns();
            this.stopLeftTimerEvent();
        }
    },
    hidePoints() {
        if((_pointText0 && _pointText0.alive) || 
            (_pointText1 && _pointText1.alive) ||
            (_pointText2 && _pointText2.alive)) {
            _pointText0 && _pointText0.kill();
            _pointText1 && _pointText1.kill();
            _pointText2 && _pointText2.kill();
        }
    },
    clickOnePointBtn() {
        eventMgr.fire('callPoint', 1);
        this.killPointBtns();
    },
    clickTwoPointBtn() {
        eventMgr.fire('callPoint', 2);
        this.killPointBtns();
    },
    clickThreePointBtn() {
        eventMgr.fire('callPoint', 3);
        this.killPointBtns();
    },
    clickHintBtn(btn) {
        if(this.isBtnDisabled(btn)) {
            return;
        }
    },
    clickPlayBtn(btn) {
        if(this.isBtnDisabled(btn)) {
            return;
        }
        let _cards = this.getPopCards().map(card => cards.findCardIndex(card));
        this.endPlayCards();
        eventMgr.fire('playCards', _cards);
    },
    clickCoverBtn(btn) {
        if(this.isBtnDisabled(btn)) {
            return;
        }
        let _cards = this.getPopCards().map(card => cards.findCardIndex(card));
        this.endPlayCards();
        eventMgr.fire('coverCards', {cards: _cards, isdiscard: false});
    },
    clickDiscardBtn(btn) {
        if(this.isBtnDisabled(btn)) {
            return;
        }
        this.endPlayCards();
        this.resetMyCards();
        eventMgr.fire('coverCards', {cards: [], isdiscard: true});
    },
    startCallPoints() {
        if(this._isActiveState()) {
            this.showPointBtns();
        }
    },
    async sendDiZhuCards(cs, dizhuIndex) {
        return this.dealDiZhuCards(dizhuIndex, cs).then(() => {
            this.killPointBtns();
            this.hidePoints();
            this.showDiZhuCards(cs.map(c => cards.get(c)));
        });
    },
    killPointBtns() {
        _onePointBtn && _onePointBtn.kill();
        _twoPointBtn && _twoPointBtn.kill();
        _threePointBtn && _threePointBtn.kill();
    },
    finishGame(win) {
        if(this._isActiveState()) {
            let maskPanel = game.add.graphics(0, 0);
            maskPanel.beginFill(0xffffff, 0.3);
            maskPanel.drawRect(0, 0, game.world.bounds.width, game.world.bounds.height);
            maskPanel.endFill();
            let endPanel = game.add.graphics(0 , 0);
            endPanel.lineStyle(4, 0x20bf43);
            endPanel.beginFill(0xaaaaaa, 0.3);
            endPanel.drawRoundedRect(0, 0, game.world.bounds.width / 4, game.world.bounds.height / 5, 20);
            endPanel.alignIn(game.world.bounds, Phaser.CENTER);
            endPanel.endFill();
            let endText = game.add.text(0, 0, 
                win ? '         你赢了！\n点击开始下一局！' : '         你输了！\n点击开始下一局！', 
                {font: '32px', fill: 'green'});
            endText.alignIn(game.world.bounds, Phaser.CENTER);
            game.input.onTap.addOnce(() => game.state.start('prepare'));
        }
    },
    showDroppedCards(_cs, playerIndex, isCover) {
        if(this._isActiveState()) {
            if(!isCover) {
                this.clearPlayCardsExceptByName(playerIndex);
            }
            let cs = _cs.map(i => cards.get(i));
            if(playerIndex == '1') {
                let l = Number.parseInt(_aiLeftText1.text);
                _aiLeftText1.setText(l - cs.length);
                _aiLeftText1.alignTo(_aiBackCards1, Phaser.BOTTOM_CENTER, 0, 5);
                this.showAI1PlayCards(cs);
            } else if (playerIndex == '2') {
                let l = Number.parseInt(_aiLeftText2.text);
                _aiLeftText2.setText(l - cs.length);
                _aiLeftText2.alignTo(_aiBackCards2, Phaser.BOTTOM_CENTER, 0, 5);
                this.showAI2PlayCards(cs);
            }
            this.stopLeftTimerEvent();
        }
    },
    showDiscarded(playerIndex) {
        if(this._isActiveState()) { 
            if(playerIndex == '1') {
                this.showAI1PlayDontText();
            } else if (playerIndex == '2') {
                this.showAI2PlayDontText();
            }
            this.stopLeftTimerEvent();
        }
    },
    showLeftTime(playerIndex, leftTime) {
        if(this._isActiveState()) {
            if(playerIndex == '1') {
                this.beginPlayer1LeftTimeEvent(leftTime);
            } else if (playerIndex == '2') {
                this.beginPlayer2LeftTimeEvent(leftTime);
            } else if (playerIndex == '0') {
                this.beginPlayer0LeftTimeEvent(leftTime);
            }
        }
    },
    beginPlayer0LeftTimeEvent(leftTime) {
        _leftTimeText0.revive();
        _leftTimeText0.setText(leftTime.toString(), leftTime);
        this.resetLeftTimerEvent(_leftTimeText0, leftTime);
    },
    beginPlayer1LeftTimeEvent(leftTime) {
        _leftTimeText1.revive();
        _leftTimeText1.setText(leftTime.toString(), leftTime);
        this.showAI1PlayCards([_leftTimeText1]);
        this.resetLeftTimerEvent(_leftTimeText1, leftTime);
    },
    beginPlayer2LeftTimeEvent(leftTime) {
        _leftTimeText2.revive();
        _leftTimeText2.setText(leftTime.toString(), leftTime);
        this.showAI2PlayCards([_leftTimeText2]);
        this.resetLeftTimerEvent(_leftTimeText2, leftTime);
    },
    resetLeftTimerEvent(leftTimeText, seconds) {
        let tickTime = seconds;
        if(_timerEvent) {
            game.time.events.remove(_timerEvent);
            _timerEvent = null;
        }
        _timerEvent = game.time.events.repeat(Phaser.Timer.SECOND, tickTime, this.updateLeftTime, this, leftTimeText);
    },
    updateLeftTime(leftTimeText) {
        let leftTime = Number.parseInt(leftTimeText.text) - 1;
        leftTimeText.setText(leftTime.toString());
        if(_ai1CardsGrp.contains(leftTimeText)) {
            this.alignAI1PlayCards();
        }
    },
    stopLeftTimerEvent() {
        if(_timerEvent) {
            game.time.events.remove(_timerEvent);
        }
        _leftTimeText0.kill();
        _leftTimeText1.kill();
        _leftTimeText2.kill();
    },
    beginPlayCards() {
        if(this._isActiveState()) {
            _beginPlayCards = true;
            this.showPlayBtns();
            this.resetMyCards();
        }
    },
    beginCoverCards() {
        if(this._isActiveState()) {      
            _beginPlayCards = true;
            this.showCoverBtns();
            this.resetMyCards();
        }
    },
    endPlayCards() {
        _beginPlayCards = false;
        this.disableBtn(_playBtn);
        this.disableBtn(_hintBtn);
        this.disableBtn(_coverBtn);
        this.disableBtn(_coverHintBtn);
        this.disableBtn(_coverDiscardBtn);
    },
    async distributeCard(card, toWho) {
        let animation = game.add.tween(card),
            to;
        const ANIMATION_TIME = 100;
        if(toWho === 0) {
            to = {x: game.world.bounds.width / 2, y: game.world.bounds.height - card.height * 2 / 3};
            animation.to(to, ANIMATION_TIME, null, true);
            return await new Promise(s => animation.onComplete.addOnce(() => {
                this.addCardToMyCard(card);
                s();
            }));
        } else if(toWho === 2) {
            to = {x: _aiBackCards2.centerX, y: _aiBackCards2.centerY};
            game.add.tween(card.scale).to({x:0.7, y:0.7}, ANIMATION_TIME, null, true);
            animation.to(to, ANIMATION_TIME, null, true);
            return await new Promise(cb => animation.onComplete.addOnce(() => {
                let n = parseInt(_aiLeftText2.text, 10);
                _aiLeftText2.setText(n + 1);
                _aiLeftText2.alignTo(_aiBackCards2, Phaser.BOTTOM_CENTER, 0, 5);
                if(_aiBackCards2.alive === false && _aiLeftText2.alive === false) {
                    _aiBackCards2.revive();
                    _aiLeftText2.revive();
                }
                card.kill();
                cb();
            }));
        } else if(toWho === 1) {
            to = {x: _aiBackCards1.centerX, y: _aiBackCards1.centerY};
            game.add.tween(card.scale).to({x:0.7, y:0.7}, ANIMATION_TIME, null, true);
            animation.to(to, ANIMATION_TIME, null, true);
            return await new Promise(cb => animation.onComplete.addOnce(() => {
                let n = parseInt(_aiLeftText1.text, 10);
                _aiLeftText1.setText(n + 1);
                _aiLeftText1.alignTo(_aiBackCards1, Phaser.BOTTOM_CENTER, 0, 5);
                if(_aiBackCards1.alive === false && _aiLeftText1.alive === false) {
                    _aiBackCards1.revive();
                    _aiLeftText1.revive();
                }
                card.kill();
                cb();
            }));
        }
    },
    async dealCards(cs, currentPlayerIndex) {
        let _cards = cs;

        for(let i = 0,j = 0; i < 51; ++i) {
            await new Promise(cb => setTimeout(() => cb(), 60));
            let who = (currentPlayerIndex + i) % 3;
            if( who === 0 ) {
                let card = cards.get(_cards[j++]);
                card.anchor.set(0.5);
                card.reset(_centerBackCard.x, _centerBackCard.y);
                card.bringToTop();
                if(i === 50) {
                    await this.distributeCard(card, who);
                } else {
                    this.distributeCard(card, who);
                }
            } else {
                let movedBackCard = this.getMovedBackCard();
                movedBackCard.reset(_centerBackCard.x, _centerBackCard.y);
                movedBackCard.scale.setTo(1);
                movedBackCard.bringToTop();
                if(i === 50) {
                    await this.distributeCard(movedBackCard, who);
                } else {
                    this.distributeCard(movedBackCard, who);
                }
            }
        }
        return;
    },
    async dealDiZhuCards(diZhuIndex, cs) {
        this.showDiZhuProtraits(diZhuIndex);
        for(let i = 0; i < cs.length; ++i) {
            await new Promise(cb => setTimeout(() => cb(), 60));
            let card = cards.get(cs[i]);
            card.anchor.set(0.5);
            card.reset(_centerBackCard.x, _centerBackCard.y);
            card.bringToTop();
            if( i == cs.length - 1) {
                _centerBackCard.kill();
                await this.distributeCard(card, diZhuIndex);
            } else {
                this.distributeCard(card, diZhuIndex);
            }
        }
        return;
    },
    _isActiveState() {
        return game.state.getCurrentState() === this;
    },
};