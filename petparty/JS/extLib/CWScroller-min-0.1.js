/*!
 *   User: vivek.d
 * Zenga scroller for Phaser
 */
var CWScroller = {mIsScrollbarInitilize:false, mEnable:false, mousedown:false, mUpdatePosition:0, Enable:function (e) {
    this.mEnable = e;
    this.mousedown = !e
}, to:function (e, t, n, r, i, s) {
    this.content = e;
    if (this.mIsScrollbarInitilize) {
        delete this.scrolle;
        var o = this;
        this.scroller = new Scroller(function (e, t, n) {
            o.render(e, t, n)
        }, s)
    } else {
        var o = this;
        this.scroller = new Scroller(function (e, t, n) {
            o.render(e, t, n)
        }, s);
        this.bindEvents();
        this.mIsScrollbarInitilize = true
    }
    this.mEnable = true;
    this.scroller.setDimensions(t, n, r, i)
}, bindEvents:function () {
    var e = configObj.game.canvas;
    if ("ontouchstart"in document.documentElement && (configObj.device.android > 0 || configObj.device.iPad || configObj.device. iPhone || configObj.device.iPhone4)) {
        e.addEventListener("touchstart", this._mouseDown1.bind(this), false);
        e.addEventListener("touchmove", this._mouseMove1.bind(this), false);
        e.addEventListener("touchend", this._mouseUp1.bind(this), false)
    } else {
        e.addEventListener("mousedown", this._mouseDown.bind(this), false);
        e.addEventListener("mouseup", this._mouseUp.bind(this), false);
        e.addEventListener("mousemove", this._mouseMove.bind(this), false);

        if(false || !!document.documentMode){
            e.addEventListener("MSPointerDown", this._mouseDown.bind(this), false);
            e.addEventListener("MSPointerMove", this._mouseMove.bind(this), false);
            e.addEventListener("MSPointerUp", this._mouseUp.bind(this), false);

            e.addEventListener("pointerDown", this._mouseDown.bind(this), false);
            e.addEventListener("pointerMove", this._mouseMove.bind(this), false);
            e.addEventListener("pointerUp", this._mouseUp.bind(this), false);
        }
    }
}, render:function (e, t, n) {
    this.content.x = e ? -e / n : this.content.x;
    this.content.y = t ? -t / n : this.content.y
}, ScrollToPosition:function (e, t, n) {
    this.scroller.scrollTo(e, t, n)
}, _mouseDown:function (e) {
    if (!this.mEnable) {
        return
    }
    this.scroller.doTouchStart([
        {pageX:e.pageX, pageY:e.pageY}
    ], e.timeStamp);
    this.mousedown = true
}, _mouseMove:function (e) {
    if (!this.mousedown || !this.mEnable) {
        return
    }
    this.scroller.doTouchMove([
        {pageX:e.pageX, pageY:e.pageY}
    ], e.timeStamp);
    this.mousedown = true
}, _mouseUp:function (e) {
    if (!this.mousedown || !this.mEnable) {
        return
    }
    this.scroller.doTouchEnd(e.timeStamp);
    this.mousedown = false
}, _mouseDown1:function (e) {
    if (!this.mEnable) {
        return
    }
    this.scroller.doTouchStart([
        {pageX:e.touches[0].clientX + document.body.scrollLeft + document.documentElement.scrollLeft, pageY:e.touches[0].clientY + document.body.scrollLeft + document.documentElement.scrollLeft}
    ], e.timeStamp);
    this.mousedown = true
}, _mouseMove1:function (e) {
    if (!this.mousedown || !this.mEnable) {
        return
    }
    this.scroller.doTouchMove([
        {pageX:e.touches[0].clientX + document.body.scrollLeft + document.documentElement.scrollLeft, pageY:e.touches[0].clientY + document.body.scrollLeft + document.documentElement.scrollLeft}
    ], e.timeStamp);
    this.mousedown = true
}, _mouseUp1:function (e) {
    if (!this.mousedown || !this.mEnable) {
        return
    }
    this.scroller.doTouchEnd(e.timeStamp);
    this.mousedown = false
}};