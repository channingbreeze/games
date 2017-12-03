/**
 * game
 * @authors H.yingzi (h.yingzi@gmail.com)
 * @modified by channingbreeze
 * @date    2015-06-01 12:10:33
 *
 */
var DO = {};
DO.bgMusic = null;

DO.Boot = function () {};
DO.Boot.prototype = {
    preload: function () {
        this.load.image("bg", "assets/images/bg.png");
        this.load.image("loading-needle", "assets/images/loading-needle.png");
        this.load.image("loading-meter", "assets/images/loading-meter.png");
        this.load.image("loading-o", "assets/images/loading-o.png");
        this.load.image("loading-meter-red", "assets/images/loading-meter-red.png");
        this.load.spritesheet("btn", "assets/images/btn.png", 167, 64);
        this.load.audio("audio-bg", "assets/music/audio-bg.mp3");
        this.load.audio("start", "assets/music/start.mp3");
        this.load.image("loading-guang", "assets/images/loading-guang.png");
        this.load.image("tips", "assets/images/tips.png");
        this.load.image("title-shadow", "assets/images/title-shadow.png");
        this.load.image("title", "assets/images/title.png");
        this.load.image("line", "assets/images/line.png");
        this.load.image("bg-shadow", "assets/images/bg-shadow.png");
        this.load.image("title1", "assets/images/title1.png");
        this.load.image("title2", "assets/images/title2.png");
        this.load.image("title3", "assets/images/title3.png");
        this.load.image("title4", "assets/images/title4.png");
        this.load.image("title5", "assets/images/title5.png");
        this.load.image("title6", "assets/images/title6.png");
        this.load.image("title7", "assets/images/title7.png");
        this.load.image("title8", "assets/images/title8.png");
        this.load.image("title9", "assets/images/title9.png");
        this.load.image("title10", "assets/images/title10.png");
        this.load.image("title11", "assets/images/title11.png");
        this.load.image("title12", "assets/images/title12.png");
        this.load.image("title13", "assets/images/title13.png");
    }, create: function () {
        this.input.maxPointers = 1;
        this.scale.scaleMode = window.screen.width > 640 ? Phaser.ScaleManager.SHOW_ALL : Phaser.ScaleManager.EXACT_FIT;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.state.start("preload");
        DO.W = this.game.width;
        DO.H = this.game.height;
        this.stage.backgroundColor = "#000";
    }
}, 

DO.Preload = function () {};
DO.Preload.prototype = {
    create: function () {
        function b(c) {
            a.add.tween(c).to({
                x: 500
            }, 1e3, "Linear", true, false).onComplete.add(function (a) {
                a.x = 120, b(c)
            }, a)
        }
        var c, a = this;
        this.stage.backgroundColor = "#000000";
        this.bg = this.add.sprite(0, 0, "bg");
        this.loadNeedle = this.add.sprite(this.world.centerX + 5, 578, "loading-needle");
        this.loadNeedle.anchor.setTo(.5, .5);
        this.loadingo = this.add.sprite(this.world.centerX + 9, 575, "loading-o");
        this.loadingo.anchor.x = .5;
        this.whitebmd = this.add.bitmapData(230, 30);
        this.whitebmd.ctx.beginPath();
        this.whitebmd.ctx.rect(0, 0, 230, 230);
        this.whitebmd.ctx.fillStyle = "#ffffff";
        this.whitebmd.ctx.fill();
        this.whiteSprite = this.add.sprite(this.world.centerX, this.world.height - 90, this.whitebmd);
        this.whiteSprite.anchor.setTo(.5);
        this.loadingMeterRed = this.add.sprite(this.world.centerX, this.world.height - 100, "loading-meter-red");
        this.loadingMeterRed.anchor.x = .5;
        this.loadMeter = this.add.sprite(this.world.centerX + 10, this.world.height - 50, "loading-meter");
        this.loadMeter.anchor.setTo(.5);
        this.loadGuang = this.add.sprite(this.world.centerX, this.world.height - 458, "loading-guang");
        this.loadGuang.anchor.setTo(.5);
        DO.bgMusic = this.add.audio("audio-bg", 1, true);
        this.startAudio = this.add.audio("start", 1, false);
        DO.bgMusic.play();
        this.btnStart = this.add.button(this.world.centerX, this.world.height, "btn", null, this, 0, 0, 0);
        this.btnStart.alpha = 0;
        this.btnStart.anchor.setTo(.5);
        this.btnStart.inputEnabled = true;
        this.btnStart.events.onInputUp.add(function () {
            this.startAudio.play();
            this.state.start("game");
        }, this);
        this.line = this.add.sprite(this.world.centerX - 44, this.world.height - 60, "line");
        this.line2 = this.add.sprite(this.world.centerX + 34, this.world.height - 121, "line");
        this.line.anchor.setTo(.5);
        this.line2.anchor.setTo(.5);
        this.line2.alpha = 0;
        this.line.alpha = 0;

        b(this.loadingMeterRed);
        this.titleArr = [];

        for (c = 1; 14 > c; c++) {
            this.titleArr.push(this.add.sprite(this.world.centerX, 100, "title" + c));
            this.titleArr[c - 1].anchor.set(.5);
            this.titleArr[c - 1].alpha = 1;
        }

        this.titleArr = this.titleArr.sort(function () {
            return Math.random() - .5;
        });
        for (c = 0; c < this.titleArr.length; c++) {
            this.add.tween(this.titleArr[c]).to({
                alpha: 0
            }, 300, "Linear", true, 100 * c, 3, true);
        }
        this.bgShadow = this.add.sprite(this.world.centerX, 574, "bg-shadow");
        this.bgShadow.anchor.setTo(.5);
        this.add.tween(this.bgShadow).to({
            alpha: .3
        }, 1e3, Phaser.Easing.Linear.None, true, 0, 999, true);
        this.graphics = this.add.graphics(this.world.centerX, 578);
        this.graphics.lineStyle(16, 4497882);
        this.graphics.angle = -90;
        this.arcValue = 2;
        this.load.onLoadStart.add(this.loadStart, this);
        this.load.onFileComplete.add(this.fileComplete, this);
        this.load.onLoadComplete.add(this.loadComplete, this);
        this.loading();
    }, descText: function (a, b, c) {
        var d, e, f;
        a = a.split("");
        d = this.add.group();
        d.x = this.world.centerX - b;
        d.y = c;
        for (e = 0; e < a.length; e++) {
            f = this.add.text(30 * e, 120, a[e], {
                fontSize: 30,
                fill: "#d6f1ff"
            }, d);
            f.anchor.set(.5, .7);
            f.scale.y = 0;
            this.add.tween(f).to({
                angle: 360
            }, 300, Phaser.Easing.Linear.None, true, 100);
            this.add.tween(f.scale).to({
                y: 1
            }, 600, Phaser.Easing.Linear.None, true, 30 * e);
        }
        return d
    }, arcProgress: function (a, b) {
        this.time.events.remove(this.aaa);
        if(this.arcValue < a) {
            this.aaa = this.time.events.repeat(20, a - this.arcValue, function () {
                this.arcValue = this.arcValue + b;
                this.graphics.arc(-3, 5, 172, this.math.degToRad(this.arcValue++), this.math.degToRad(this.arcValue), false);
                this.loadGuang.angle = 356 === this.arcValue ? 360 : this.arcValue;
                this.loadNeedle.angle = 356 === this.arcValue ? 360 : this.arcValue;
                if(this.arcValue > 354) {
                    this.time.events.removeAll();
                    this.animProgress();
                    this.loadGuang.alpha = 0;
                }
            }, this);
        }
    }, animProgress: function () {
        function b(c, d, e) {
            a.add.tween(c).to({
                x: d
            }, 2e3, "Linear", true, false).onComplete.add(function (a) {
                a.x = e, b(c, d, e)
            }, a), a.add.tween(c).to({
                alpha: 1
            }, 1e3, "Linear", true, false, 99, true)
        }
        var a = this;
        this.loadingMeterRed.alpha = 0, this.whiteSprite.alpha = 0, this.add.tween(this.loadMeter).to({
            y: this.world.height + 50,
            alpha: 0
        }, 800, Phaser.Easing.Quartic.In, true, false).onComplete.add(function () {
            this.add.tween(this.btnStart).to({
                y: this.world.height - 90,
                alpha: 1
            }, 800, Phaser.Easing.Quartic.Out, true, false).onComplete.add(function () {
                b(this.line, 380, 244), b(this.line2, 244, 380)
            }, this)
        }, this), this.descText("长按充电桩，别让车落回底线，", 190, 60), this.descText("看你行不行！", 70, 110)
    }, render: function () {}, fileComplete: function (a) {
        this.arcProgress(360 * (a / 100), 1)
    }, loadComplete: function () {}, loadStart: function () {}, loading: function () {
        this.load.image("charging", "assets/images/charging.png");
        this.load.bitmapFont("font-time", "assets/fonts/font-time.png", "assets/fonts/font-time.xml");
        this.load.bitmapFont("font-number-blue", "assets/fonts/font-number-blue.png", "assets/fonts/font-number.xml");
        this.load.bitmapFont("font-number-red", "assets/fonts/font-number-red.png", "assets/fonts/font-number.xml");
        this.load.spritesheet("game-bg", "assets/images/game-bg.jpg", 640, 1038, 3);
        this.load.spritesheet("zizizi", "assets/images/zizizi.png", 200, 100, 13);
        this.load.image("car-0", "assets/images/car-0.png");
        this.load.image("car-1", "assets/images/car-1.png");
        this.load.image("car-2", "assets/images/car-2.png");
        this.load.image("time-bg", "assets/images/time-bg.png");
        this.load.spritesheet("fire-0", "assets/images/fire-0.png", 250, 200, 6);
        this.load.spritesheet("fire-1", "assets/images/fire-1.png", 220, 200, 6);
        this.load.spritesheet("fire-2", "assets/images/fire-2.png", 200, 200, 6);
        this.load.image("gameover-number", "assets/images/gameover-number.png");
        this.load.image("ad", "assets/images/ad.png");
        this.load.image("share", "assets/images/share.png");
        this.load.image("stop", "assets/images/stop.png");
        this.load.image("luanyong", "assets/images/luanyong.png");
        this.load.image("ad-quan", "assets/images/ad-quan.png");
        this.load.image("ad-car", "assets/images/ad-car.png");
        this.load.image("ad-g-1", "assets/images/ad-g-1.png");
        this.load.image("ad-kao", "assets/images/ad-kao.png");
        this.load.image("ad-you", "assets/images/ad-you.png");
        this.load.audio("audio-zizizi", "assets/music/audio-zizizi.mp3");
        this.load.audio("audio-over", "assets/music/audio-over.mp3");
        this.load.audio("gogo", "assets/music/gogo.mp3");
        this.load.start();
    }
};

DO.Game = function () {};
DO.Game.prototype = {
    preload: function () {}, create: function () {
        var b, c, d, e, f, g;
        for (this.stage.backgroundColor = "#000000", this.FPS = 60, this.SPEED = 1e4, this.isOver = false, this.bg = this.add.sprite(0, 0, "game-bg"), this.bg.alpha = 0, this.bg.animations.add("bg"), this.add.tween(this.bg).to({
            alpha: 1
        }, 2e3, Phaser.Easing.Linear.None, true, false).onComplete.add(function () {
            this.bg.animations.play("bg", 10, true)
        }, this), b = this.add.sprite(this.world.centerX, this.world.height - 260, "stop"), b.anchor.x = .5, b.alpha = 0, this.add.tween(b).to({
            alpha: 1
        }, 600, "Linear", true, 1e3), this.music = {
            zizizi: this.add.audio("audio-zizizi", 5, true),
            over: this.add.audio("audio-over", 5, false),
            gogo: this.add.audio("gogo", 5, false)
        }, c = this.add.group(), c.create(0, 0, "time-bg"), c.position = {
            x: 30,
            y: -53
        }, this.add.tween(c).to({
            y: 48
        }, 1e3, Phaser.Easing.Quartic.In, true, false), this.timeText = function (a) {
            var b = parseInt(a / 60),
                c = parseInt(b / 60),
                d = a - 60 * b;
            return b > 59 && (b -= 60), b = b > 9 ? b : "0" + b, d = d > 9 ? d : "0" + d, (c > 9 ? c : "0" + c) + ":" + b + ":" + d
        }, this.timeBox = this.add.bitmapText(74, 12, "font-time", this.timeText(0), 44, c), this.timer = this.time.create(false), this.timesecond = 0, this.timer.loop(Phaser.Timer.SECOND / this.FPS, function () {
            this.timeBox.setText(this.timeText(this.timesecond++))
        }, this), this.timer.start(), this.currentCharg = 9, this.carTime = this.time.create(false), this.carTime.loop(Phaser.Timer.SECOND / 40, this.handFrameData, this), this.carMap = [this.creatCar(260, 400, -30, 110, -100, 610, 100, 0), this.creatCar(292, 400, 26, 140, 190, 600, 90, 1), this.creatCar(320, 400, 80, 150, 440, 610, 104, 2)], this.carFrame = [0, 0, 0], this.chargBmd = [], this.chargObj = [this.createCharg(), this.createCharg(), this.createCharg()], this.chargObj[1].charg.x = 210, this.chargObj[2].charg.x = 420, d = 0, e = 0; 3 > d; d++) this.add.tween(this.chargObj[d].charg).to({
            y: -230
        }, 1e3, Phaser.Easing.Quartic.Out, true, 200 * d).onComplete.add(function () {
            this.setDefault(e), e++
        }, this);
        f = this.add.bitmapData(640, 240), f.ctx.beginPath(), f.ctx.fillStyle = "#fe0000", f.ctx.rect(0, 0, 640, this.world.height), f.ctx.fill(), g = this.add.sprite(0, this.world.height - 240, f), g.alpha = 0, g.inputEnabled = true, g.events.onInputDown.add(this.handonDown, this), g.events.onInputUp.add(this.handonUp, this)
    }, creatCar: function (a, b, c, d, e, f, g, h) {
        var j, k, l, m, i = this.add.group();
        return i.create(0, 0, "car-" + h), j = i.create(c, d, "fire-" + h), j.animations.add("fire-" + h), j.animations.play("fire-" + h, this.FPS, true), j.alpha = 0, i.position = {
            x: a,
            y: b
        }, i.alpha = 0, k = this.make.tween(i).to({
            x: e,
            y: f
        }, this.SPEED, Phaser.Easing.Linear.None, true, false), l = this.make.tween(i.scale).to({
            x: 1,
            y: 1
        }, this.SPEED, Phaser.Easing.Linear.None, true, false), m = i.create(g, 0, "luanyong"), m.alpha = 0, i.scale.setTo(.2, .2), {
            group: i,
            fire: j,
            luanyong: m,
            frameData: {
                list: k.generateData(this.FPS),
                len: k.generateData(this.FPS).length - 1
            },
            scaleFrameData: {
                list: l.generateData(this.FPS),
                len: l.generateData(this.FPS) - 1
            }
        }
    }, setDefault: function (a) {
        var b = this.carMap[a],
            c = b.frameData.len,
            d = this.random(70, 90),
            e = parseInt(c - c * (d / 100), 10);
        this.carFrame[a] = e, 2 === a && this.carTime.start(), this.oldPower = [0, 0, 0], this.updateBmd(a, d), this.add.tween(b.group).to({
            alpha: 1
        }, 100, "Linear", true, 600)
    }, handFrameData: function () {
        var a, b, c, d, e, f, h, i;
        for (a = 0; 3 > a; a++) {
            if (b = this.carMap[a], c = this.carFrame[a], d = b.frameData.list[c], e = b.frameData.len, f = b.scaleFrameData.list[c], b.scaleFrameData.len, h = 100 - parseInt(100 * (this.carFrame[a] / e), 10), this.carFrame[a] > e && !this.isOver) return this.updatePower(a, 0), this.updateBmd(a, 0), this.gameover(), void 0;
            b.group.position = {
                x: d.x,
                y: d.y
            }, b.group.scale.setTo(f.x, f.y), this.updatePower(a, h), 0 === h % 10 && this.oldPower[a] !== h && (this.updateBmd(a, h), this.oldPower[a] = h), i = parseInt(this.timesecond / 60, 10), i > 10 && 15 > i ? this.carFrame[a] = this.carFrame[a] + 2 : i > 15 && 20 > i ? this.carFrame[a] = this.carFrame[a] + 4 : i > 20 ? this.carFrame[a] = this.carFrame[a] + (i - 16) : this.carFrame[a]++, 9 !== this.currentCharg && (this.carFrame[this.currentCharg] = i > 10 && 15 > i ? this.carFrame[this.currentCharg] - 2 : i > 15 && 20 > i ? this.carFrame[this.currentCharg] - 4 : i > 20 ? this.carFrame[this.currentCharg] - (i - 16) : this.carFrame[this.currentCharg] - 1), this.carFrame[a] < 30 && (this.carFrame[a] = 30), 0 === this.carFrame[this.currentCharg] && (this.carFrame[this.currentCharg] = 2)
        }
    }, createCharg: function () {
        var b, c, d, e, a = this.add.group();
        for (a.create(-20, this.world.height, "charging"), b = this.add.bitmapData(68, 30), b.ctx.beginPath(), b.ctx.fillStyle = "#252525", c = 0; 10 > c; c++) b.ctx.rect(7 * c, 0, 5, 30);
        return b.ctx.fill(), d = this.add.bitmapText(70, this.world.height + 40, "font-number-blue", "10%", 30, a), a.create(66, this.world.height + 74, b), e = a.create(10, this.world.height - 18, "zizizi"), e.animations.add("zizizi"), e.animations.play("zizizi", 20, true), e.alpha = 0, this.chargBmd.push(0), {
            charg: a,
            bmd: b,
            text: d,
            zizizi: e
        }
    }, updatePower: function (a, b) {
        return this.chargObj[a].text.text = b > 99 ? "99%" : b + "%"
    }, updateBmd: function (a, b) {
        var c, f, d = this.chargObj[a].bmd.context,
            e = parseInt(b / 10, 10),
            g = e > this.chargBmd[a] ? false : true;
        2 >= e ? (f = "#ea0042", this.chargObj[a].text.font = "font-number-red", this.carMap[a].luanyong.alpha = 1) : (f = "#00a6ea", this.chargObj[a].text.font = "font-number-blue", this.carMap[a].luanyong.alpha = 0), g ? (c = 9, d.fillStyle = "#252525", this.time.events.repeat(10, 10, function () {
            e > c && (d.fillStyle = f), d.fillRect(7 * c, 0, 5, 30), c--
        }, this)) : (c = 0, d.fillStyle = f, this.time.events.repeat(10, 10, function () {
            c === e && (d.fillStyle = "#252525"), d.fillRect(7 * c, 0, 5, 30), c++
        }, this)), d.dirty = true, this.chargBmd[a] = e
    }, handonUp: function () {
        this.isOver || (this.chargTween(this.currentCharg, false), this.currentCharg = 9, this.music.zizizi.pause(), this.music.gogo.pause())
    }, handonDown: function (a, b) {
        if (!this.isOver) {
            var c = b.x,
                d = b.y;
            this.chargTween(this.checkClickCharg(c, d), true), this.music.zizizi.play(), this.music.gogo.play()
        }
    }, checkClickCharg: function (a, b) {
        if (b > this.world.height - 230) {
            if (210 > a) return 0;
            if (a > 210 && 400 > a) return 1;
            if (a > 450 && 620 > a) return 2
        }
    }, chargTween: function (a, b) {
        "undefined" != typeof a && 9 !== a && (this.add.tween(this.carMap[a].fire).to({
            alpha: b ? 1 : 0
        }, 600, Phaser.Easing.Linear.None, true, false), this.add.tween(this.chargObj[a].charg).to({
            y: b ? -260 : -230
        }, 300, Phaser.Easing.Linear.None, true, false), this.add.tween(this.chargObj[a].zizizi).to({
            alpha: b ? 1 : 0
        }, 600, Phaser.Easing.Linear.None, true, false), this.currentCharg = a)
    }, gameover: function () {
        function e(b) {
            a.add.tween(b).to({
                angle: 360
            }, 3e3, "Linear", true, false).onComplete.add(function (a) {
                a.angle = 0, e(b)
            }, a)
        }
        var b, c, d, f, g, a = this;
        this.isOver = true, this.carTime.pause(), this.bg.animations.stop(), this.timer.stop(), this.music.zizizi.pause(), totalTime = this.timesecond, document.title = "坚持30秒算你行！我" + parseInt(this.timesecond / 60, 10) + "秒就不行了，你行你来啊！", this.chargTween(this.currentCharg, false), b = this.add.bitmapData(640, this.world.height), b.ctx.beginPath(), b.ctx.fillStyle = "#fe0000", b.ctx.rect(0, 0, 640, this.world.height), b.ctx.fill(), c = this.add.sprite(0, 0, b), c.alpha = .29, this.time.events.repeat(300, 6, function () {
            c.alpha = .29 === c.alpha ? 0 : .29
        }), d = this.add.sprite(this.world.centerX, this.world.centerY, "gameover-number"), d.anchor = {
            x: .5,
            y: .5
        }, d.alpha = 0, this.add.tween(d).to({
            alpha: 1
        }, 1e3, "Linear", true, 1800), e(d), f = this.add.text(this.world.centerX + 20, this.world.centerY - 60, "不行啊！", {
            font: "bold 60px Arial",
            fill: "#fb0000",
            align: "center"
        }), this.timesecond = parseInt(this.timesecond / 60, 10), g = this.add.text(this.world.centerX, this.world.centerY, "你才坚持了" + this.timesecond + "秒", {
            font: "bold 35px Arial",
            fill: "#fb0000",
            align: "center"
        }), f.anchor.set(.5), g.anchor.set(.5), f.alpha = 0, g.alpha = 0, this.add.tween(f).to({
            alpha: 1
        }, 1e3, "Linear", true, 1800), this.add.tween(g).to({
            alpha: 1
        }, 1e3, "Linear", true, 1800), this.time.events.add(6e3, function () {
            c.destroy(), d.destroy(), f.destroy(), g.destroy();
            var b = this.add.sprite(this.world.centerX, this.world.centerY, "share");
            b.alpha = 0, b.anchor = {
                x: .5,
                y: .5
            }, this.add.tween(b).to({
                alpha: 1
            }, 500, "Linear", true, false), this.time.events.add(5e3, function () {
                function f(b, c, d) {
                    a.add.tween(b).to({
                        x: c
                    }, 2e3, "Linear", true, false).onComplete.add(function (a) {
                        a.x = d, f(b, c, d)
                    }, a), a.add.tween(b).to({
                        alpha: 1
                    }, 1e3, "Linear", true, false, 99, true)
                }
                var c, d, e;
                b.destroy(), c = this.add.sprite(0, 0, "ad"), c.alpha = 0, this.add.tween(c).to({
                    alpha: 1
                }, 500, "Linear", true, false), this.quan = this.add.sprite(this.world.centerX - 8, 408, "ad-quan"), this.quan.anchor.setTo(.5), this.adKao = this.add.sprite(this.world.centerX - 4, 406, "ad-kao"), this.adKao.anchor.setTo(.5), this.adKao.angle = 50, this.add.tween(this.adKao).to({
                    angle: -35
                }, 1500, "Linear", true, false, 99, true), this.adCarg1 = this.add.sprite(-30, 260, "ad-g-1"), this.adCar = this.add.sprite(-30, 260, "ad-car"), this.adCar.alpha = 0, this.adCarg1.alpha = 0, this.add.tween(this.adCar).to({
                    alpha: 1
                }, 1e3, "Linear", true, false), this.add.tween(this.adCarg1).to({
                    alpha: 1
                }, 2e3, "Linear", true, false, 99, true), d = this.add.button(this.world.centerX - 30, this.world.height - 120, "btn", null, this, 1, 1, 1), d.anchor.x = 1, d.inputEnabled = true, e = this.add.button(this.world.centerX, this.world.height - 120, "btn", null, this, 2, 2, 2), e.inputEnabled = true, this.line = this.add.sprite(this.world.centerX - 150, this.world.height - 59, "line"), this.line1 = this.add.sprite(this.world.centerX - 64, this.world.height - 119, "line"), this.line2 = this.add.sprite(this.world.centerX + 30, this.world.height - 59, "line"), this.line3 = this.add.sprite(this.world.centerX + 134, this.world.height - 119, "line"), this.line.anchor.setTo(.5), this.line1.anchor.setTo(.5), this.line2.anchor.setTo(.5), this.line3.anchor.setTo(.5), this.line.alpha = 0, this.line1.alpha = 0, this.line2.alpha = 0, this.line3.alpha = 0, f(this.line, 270, 140), f(this.line1, 140, 270), f(this.line2, 454, 350), f(this.line3, 350, 454), d.events.onInputDown.add(function () {
                    this.again()
                }, this), e.events.onInputDown.add(function () {
                    window.location.href = "https://www.phaser-china.com/"
                }, this), this.youIcon = this.add.sprite(this.world.centerX + 190, 250, "ad-you"), this.youIcon.anchor.setTo(.5), this.arcProgress(10, 34, 90, 1, 250, 0, -117, false, "0x6eaeea", "0x0b3245"), this.arcProgress(10, -124, 90, 1, 230, 0, -104, false, "0x0b3245", "0x6eaeea"), this.arcProgress(10, 88, 140, 1, 190, 0, -114, false, "0x0b3245", "0x0b3245"), this.arcProgress(20, 88, 190, 1, 220, 0, -114, false, "0x0b3245", "0x0b3245")
            }, this)
        }, this), setTimeout(function () {
            a.music.over.play()
        }, 1e3 / 60)
    }, again: function () {
        return document.title = "不充不行", this.state.start("game")
    }, random: function (a, b) {
        return Math.ceil(Math.random() * (b - a) + a)
    }, arcProgress: function (a, b, c, d, e, f, g, h, i, j) {
        var k, l, m;
        d = h ? 2 : 1, k = this.add.graphics(this.world.centerX + f, this.world.centerY + g), k.angle = 0 - b, k.lineStyle(16, i), l = h ? c : 0, this.time.events.remove(m), h ? l > 0 && (m = this.time.events.loop(a, function () {
            l -= d, 0 > l && (k.clear(), this.arcProgress(a, b, c, d, e, f, g, !h, i, j), this.time.events.remove(m)), k.arc(-3, 5, e, this.math.degToRad(l++), this.math.degToRad(l--), false)
        }, this)) : (k.lineStyle(16, j), c > l && (m = this.time.events.loop(a, function () {
            l += d, l > c && (k.clear(), this.time.events.remove(m), this.arcProgress(a, b, c, d, e, f, g, !h, i, j)), k.arc(-3, 5, e, this.math.degToRad(l++), this.math.degToRad(l), false)
        }, this)))
    }
}, ! function () {
    var b, a = new Phaser.Game(640, 1038, Phaser.CANVAS, "game");
    a.state.add("boot", DO.Boot), a.state.add("preload", DO.Preload), a.state.add("game", DO.Game), a.state.start("boot"), b = function () {
        document.getElementById("tips").style.display = 90 == window.orientation || -90 == window.orientation ? "block" : "none"
    }, window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", b, false)
}();