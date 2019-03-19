"use strict";

/**
 * Created by liangdas on 16/12/15.
 * Email 1587790525@qq.com
 */




var extend = function extend(superCtor, prop) {
    return function () {
        var fnTest = /xyz/.test(function () {
            xyz;
        }) ? /\b_super\b/ : /.*/;

        var _super = superCtor.prototype;
        //// The base Class implementation (does nothing)
        function baseClass() {
            if (baseClass.prototype.ctor) {
                baseClass.prototype.ctor.apply(this, Array.from(arguments));
            }
        };
        // 空函数F:
        var F = function F() {};
        // 把F的原型指向Student.prototype:
        F.prototype = superCtor.prototype;
        //F.prototype = Object.create(superCtor.prototype);
        // 把PrimaryStudent的原型指向一个新的F对象，F对象的原型正好指向Student.prototype:
        baseClass.prototype = new F();
        // 把PrimaryStudent原型的构造函数修复为PrimaryStudent:
        baseClass.prototype.constructor = baseClass;

        var prototype = baseClass.prototype;
        if (!_super.ctor) {
            _super.ctor = superCtor;
        }

        // Copy the properties over onto the new prototype
        for (var name in prop) {
            // Check if we're overwriting an existing function
            prototype[name] = typeof prop[name] == "function" && typeof _super[name] == "function" && fnTest.test(prop[name]) ? function (name, fn) {
                return function () {
                    //var tmp_superclass = this.superclass;
                    var tmp = this._super;
                    // Add a new ._super() method that is the same method
                    // but on the super-class
                    this._super = _super[name];
                    //this.superclass=superCtor.bind(this);
                    // The method only need to be bound temporarily, so we
                    // remove it when we're done executing
                    var ret = fn.apply(this, Array.from(arguments));
                    this._super = tmp;
                    //this.superclass=tmp_superclass;
                    return ret;
                };
            }(name, prop[name]) : prop[name];
        }
        return baseClass;
    }();
};



var MyScaleManager = extend(function () {}, {
    ctor: function ctor(gameDiv) {
        this.gameDiv = gameDiv;
        this.proDOM = Phaser.DOM;
        this.isMyLandscapeMode = false;
        if (this.proDOM.getScreenOrientation() != "landscape-primary") {
            //如果当前是竖屏 启动自定义横屏
            this.setMyLandscapeMode(true, true);
        } else {
            this.refresh();
        }
        var BaseDOM = extend(function () {}, Phaser.DOM);

        var MyDOM = extend(BaseDOM, {
            getScreenOrientation: function getScreenOrientation() {
                var orientation = this._super.apply(this, arguments);

                if (document.documentElement.clientWidth !== this.proDocumentWidth || document.documentElement.clientHeight !== this.proDocumentHeight) {
                    Phaser.myScaleManager.refresh(); //刷新界面宽高 非常有用
                    this.proDocumentWidth = document.documentElement.clientWidth;
                    this.proDocumentHeight = document.documentElement.clientHeight;
                }

                if (orientation != "landscape-primary") {
                    //当前是竖屏
                    if (!Phaser.myScaleManager.isMyLandscape()) {
                        //未启动 自定义横屏
                        Phaser.myScaleManager.setMyLandscapeMode(true, true);
                    }
                    return "landscape-primary";
                } else {
                    //切换到横屏模式
                    if (Phaser.myScaleManager.isMyLandscape()) {
                        //关闭自定义横屏模式
                        Phaser.myScaleManager.setMyLandscapeMode(false, true);
                    }
                    return orientation;
                }
            },
            getOffset: function getOffset() {
                var rel = this._super.apply(this, arguments);
                //console.log(rel);
                return rel;
            },
            getBounds: function getBounds() {
                var rel = this._super.apply(this, arguments);
                //console.log(rel);
                return rel;
            },
            calibrate: function calibrate() {
                var rel = this._super.apply(this, arguments);
                //console.log(rel);
                return rel;
            },
            getAspectRatio: function getAspectRatio() {
                var rel = this._super.apply(this, arguments);
                //console.log(rel);
                return rel;
            },
            inLayoutViewport: function inLayoutViewport() {
                var rel = this._super.apply(this, arguments);
                //console.log(rel);
                return rel;
            }
        });
        Phaser.DOM = new MyDOM();

        var _startPointer = Phaser.Input.prototype.startPointer;
        Phaser.Input.prototype.startPointer = function (event) {
            return _startPointer.call(this, this.copyEvent(event));
        };
        var _updatePointer = Phaser.Input.prototype.updatePointer;
        Phaser.Input.prototype.updatePointer = function (event) {
            return _updatePointer.call(this, this.copyEvent(event));
        };
        var _stopPointer = Phaser.Input.prototype.stopPointer;
        Phaser.Input.prototype.stopPointer = function (event) {
            return _stopPointer.call(this, this.copyEvent(event));
        };
        Phaser.Input.prototype.copyEvent = function (event) {
            if (!Phaser.myScaleManager.isMyLandscape()) {
                //未启动 自定义横屏
                return event;
            }
            //var target=event.target;
            //console.log(event);
            //var myevent =this.extendCopy(event);
            //
            //var cW=target.clientWidth;
            //var cH=target.clientHeight;
            //var gW=game.width;
            //var gH=game.height;
            //
            //var _cx=myevent.clientX;
            //var _cy=myevent.clientY;
            //var _px=myevent.pageX;
            //var _py=myevent.pageY;
            //var _sx=myevent.screenX;
            //var _sy=myevent.screenY;
            //myevent.clientX=_cy-cH-gW;
            //myevent.clientY=_cx-cW-gH;
            //myevent.pageX=_py-cH-gW;
            //myevent.pageY=_px-cW-gH;


            var target = event.target;
            //console.log(event);
            var myevent = this.extendCopy(event);

            var _cx = myevent.clientX;
            var _cy = myevent.clientY;
            var _px = myevent.pageX;
            var _py = myevent.pageY;
            var _sx = myevent.screenX;
            var _sy = myevent.screenY;
            myevent.clientX = _cy;
            myevent.clientY = target.clientHeight - _cx;
            myevent.pageX = _py;
            myevent.pageY = target.clientHeight - _px;
            //myevent.rotationAngle=Math.PI/2;
            return myevent;
        };
        Phaser.Input.prototype.extendCopy = function (p) {
            var c = {};
            for (var i in p) {
                c[i] = p[i];
            }
            c.uber = p;
            return c;
        };
        //var MyInput=extend(Phaser.Input,{
        //    startPointer: function (event) {
        //        return this._super.call(this,this.copyEvent(event));
        //    },
        //    updatePointer: function (event) {
        //        return this._super.call(this,this.copyEvent(event));
        //    },
        //    stopPointer: function (event) {
        //        return this._super.call(this,this.copyEvent(event));
        //    },
        //    copyEvent:function(event){
        //        if(!Phaser.myScaleManager.isMyLandscape()){
        //            //未启动 自定义横屏
        //            return event;
        //        }
        //        //var target=event.target;
        //        //console.log(event);
        //        //var myevent =this.extendCopy(event);
        //        //
        //        //var cW=target.clientWidth;
        //        //var cH=target.clientHeight;
        //        //var gW=game.width;
        //        //var gH=game.height;
        //        //
        //        //var _cx=myevent.clientX;
        //        //var _cy=myevent.clientY;
        //        //var _px=myevent.pageX;
        //        //var _py=myevent.pageY;
        //        //var _sx=myevent.screenX;
        //        //var _sy=myevent.screenY;
        //        //myevent.clientX=_cy-cH-gW;
        //        //myevent.clientY=_cx-cW-gH;
        //        //myevent.pageX=_py-cH-gW;
        //        //myevent.pageY=_px-cW-gH;
        //
        //
        //        var target=event.target;
        //        //console.log(event);
        //        var myevent =this.extendCopy(event);
        //
        //        var _cx=myevent.clientX;
        //        var _cy=myevent.clientY;
        //        var _px=myevent.pageX;
        //        var _py=myevent.pageY;
        //        var _sx=myevent.screenX;
        //        var _sy=myevent.screenY;
        //        myevent.clientX=_cy;
        //        myevent.clientY=target.offsetHeight-_cx;
        //        myevent.pageX=_py;
        //        myevent.pageY=target.offsetHeight-_px;
        //        //myevent.rotationAngle=Math.PI/2;
        //        return myevent;
        //    },
        //    extendCopy:function (p) {
        //        var c = {};
        //        for (var i in p) {
        //            c[i] = p[i];
        //        }
        //        c.uber = p;
        //        return c;
        //    }
        //});
        //
        //Phaser.Input=MyInput;

        var _getParentBounds = Phaser.ScaleManager.prototype.getParentBounds;
        Phaser.ScaleManager.prototype.getParentBounds = function () {
            var rel = _getParentBounds.apply(this, arguments);
            var _width = rel.width;
            var _height = rel.height;
            if (Phaser.myScaleManager.isMyLandscape()) {
                rel.width = _height;
                rel.height = _width;
            }
            return rel;
        };
        //var MyScaleManager=extend(Phaser.ScaleManager,{
        //    ctor:function(){
        //        return this._super.apply(this,arguments);
        //    },
        //    boot:function(){
        //        return this._super.apply(this,arguments);
        //    },
        //    preUpdate:function () {
        //        var rel=this._super.apply(this,arguments);
        //        //console.log(rel);
        //        return rel;
        //    },
        //    updateDimensions: function (width, height, resize) {
        //        var rel=this._super.apply(this,arguments);
        //        console.log(rel);
        //        return rel;
        //    },
        //    updateLayout:function () {
        //        var rel=this._super.apply(this,arguments);
        //        console.log(rel);
        //        return rel;
        //    },
        //    getParentBounds: function (target) {
        //        //console.log("target "+target);
        //        var rel=this._super.apply(this,arguments);
        //        var _width=rel.width;
        //        var _height=rel.height;
        //        if(Phaser.myScaleManager.isMyLandscape()) {
        //            rel.width = _height;
        //            rel.height = _width;
        //        }
        //        //console.log(rel);
        //
        //        //var _width=bounds.width;
        //        //var _height=bounds.height;
        //        //if(Phaser.myScaleManager.isMyLandscape()) {
        //        //    bounds.width = _height;
        //        //    bounds.height = _width;
        //        //}
        //        return rel;
        //    }
        //});
        //Phaser.ScaleManager=MyScaleManager;
    },
    boot: function boot(game) {
        this.game = game;
    },
    refresh: function refresh() {

        document.body.style.width = document.documentElement.clientWidth + "px";
        document.body.style.height = document.documentElement.clientHeight + "px";

        if (document.documentElement.clientHeight >= document.documentElement.clientWidth) {
            //竖屏
            this.gameDiv.style.height = document.body.clientWidth + "px";
            this.gameDiv.style.width = document.body.clientHeight + "px";
            this.gameDiv.style.transform = "rotate(90deg)";
            this.gameDiv.style.left = -(document.documentElement.clientHeight - document.documentElement.clientWidth) / 2 + "px";
            this.gameDiv.style.top = (document.documentElement.clientHeight - document.documentElement.clientWidth) / 2 + "px";
        } else {
            //横屏
            this.gameDiv.style.width = document.body.clientWidth + "px";
            this.gameDiv.style.height = document.body.clientHeight + "px";
            this.gameDiv.style.transform = "";
            this.gameDiv.style.left = "";
            this.gameDiv.style.top = "";
        }

        this.wMax = 1280;
        this.hScale = 1;
        this.hTrim = 0;
        this.vScale = 1;
        this.vTrim = 0;
        this.height = this.gameDiv.clientHeight;
        this.width = this.gameDiv.clientWidth;
        this.scale = 1;
        if (this.width > this.wMax) {
            this.scale = this.width / this.wMax;
        }
        if (this.scale < 1) {
            this.scale = 1;
        }
        //console.log("scale: "+scale);
        this.width = this.width / this.scale;
        this.height = this.height / this.scale;
        this.hScale = this.scale;
        this.vScale = this.scale;
        if (this.game && this.game.scale) {
            //console.log(game.state.getCurrentState());
            game.stage.width=game.width;
            game.stage.height=game.height;
            //console.log(game.state.getCurrentState());
            //console.log(game.scale);
            //game.world.setBounds(0,0,this.width, this.height);
            //game.scale.resetCanvas();
            //console.log("ssdfss");
            game.scale.width=this.width;
            game.scale.height=this.height;
            if (this.game.scale.scaleMode === Phaser.ScaleManager.USER_SCALE) {
                this.game.scale.setUserScale(this.hScale, this.vScale, this.hTrim, this.vTrim);
            }
            game.scale.setupScale(this.width,this.height);
            game.scale.parentScaleFactor = new Phaser.Point(1, 1);
            ////console.log(this.width+" ddd "+this.height);
            game.scale.setGameSize(this.width,this.height);
            game.scale.resetCanvas(this.gameDiv.style.width,this.gameDiv.style.height);
            game.scale.refresh();
        }
    },
    setMyLandscapeMode: function setMyLandscapeMode(setTo, refresh) {
        refresh = refresh || false;
        this.isMyLandscapeMode = setTo;
        if (refresh) {
            this.refresh();
        }
    },
    isMyLandscape: function isMyLandscape() {
        return this.isMyLandscapeMode;
    }

});