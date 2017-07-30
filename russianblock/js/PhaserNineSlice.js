/*!
 * phaser-nineslice - version 2.0.1 
 * NineSlice plugin for Phaser.io!
 *
 * OrangeGames
 * Build at 03-07-2017
 * Released under MIT License 
 */

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var PhaserNineSlice;
(function (PhaserNineSlice) {
    var NineSlice = (function (_super) {
        __extends(NineSlice, _super);
        function NineSlice(game, x, y, key, frame, width, height, data) {
            var _this = _super.call(this, game, x, y, key, frame) || this;
            _this.baseTexture = _this.texture.baseTexture;
            _this.baseFrame = _this.texture.frame;
            if (frame !== null && !data) {
                data = game.cache.getNineSlice(frame);
            }
            else if (!data) {
                data = game.cache.getNineSlice(key);
            }
            if (undefined === data) {
                return _this;
            }
            _this.topSize = data.top;
            if (!data.left) {
                _this.leftSize = _this.topSize;
            }
            else {
                _this.leftSize = data.left;
            }
            if (!data.right) {
                _this.rightSize = _this.leftSize;
            }
            else {
                _this.rightSize = data.right;
            }
            if (!data.bottom) {
                _this.bottomSize = _this.topSize;
            }
            else {
                _this.bottomSize = data.bottom;
            }
            _this.loadTexture(new Phaser.RenderTexture(_this.game, _this.localWidth, _this.localHeight));
            _this.resize(width, height);
            return _this;
        }
        NineSlice.prototype.renderTexture = function () {
            this.texture.resize(this.localWidth, this.localHeight, true);
            var textureXs = [0, this.leftSize, this.baseFrame.width - this.rightSize, this.baseFrame.width];
            var textureYs = [0, this.topSize, this.baseFrame.height - this.bottomSize, this.baseFrame.height];
            var finalXs = [0, this.leftSize, this.localWidth - this.rightSize, this.localWidth];
            var finalYs = [0, this.topSize, this.localHeight - this.bottomSize, this.localHeight];
            this.texture.clear();
            for (var yi = 0; yi < 3; yi++) {
                for (var xi = 0; xi < 3; xi++) {
                    var s = this.createTexturePart(textureXs[xi], textureYs[yi], textureXs[xi + 1] - textureXs[xi], textureYs[yi + 1] - textureYs[yi]);
                    s.width = finalXs[xi + 1] - finalXs[xi];
                    s.height = finalYs[yi + 1] - finalYs[yi];
                    this.texture.renderXY(s, finalXs[xi], finalYs[yi]);
                }
            }
        };
        NineSlice.prototype.resize = function (width, height) {
            this.localWidth = width;
            this.localHeight = height;
            this.renderTexture();
        };
        NineSlice.prototype.destroy = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            _super.prototype.destroy.call(this, args[0]);
            this.texture.destroy(true);
            this.texture = null;
            this.baseTexture = null;
            this.baseFrame = null;
        };
        NineSlice.prototype.createTexturePart = function (x, y, width, height) {
            var frame = new PIXI.Rectangle(this.baseFrame.x + this.texture.frame.x + x, this.baseFrame.y + this.texture.frame.y + y, Math.max(width, 1), Math.max(height, 1));
            return new Phaser.Sprite(this.game, 0, 0, new PIXI.Texture(this.baseTexture, frame));
        };
        return NineSlice;
    }(Phaser.Sprite));
    PhaserNineSlice.NineSlice = NineSlice;
})(PhaserNineSlice || (PhaserNineSlice = {}));
var PhaserNineSlice;
(function (PhaserNineSlice) {
    var Plugin = (function (_super) {
        __extends(Plugin, _super);
        function Plugin(game, parent) {
            var _this = _super.call(this, game, parent) || this;
            _this.addNineSliceCache();
            _this.addNineSliceFactory();
            _this.addNineSliceLoader();
            return _this;
        }
        Plugin.prototype.addNineSliceLoader = function () {
            Phaser.Loader.prototype.nineSlice = function (key, url, top, left, right, bottom) {
                var cacheData = {
                    top: top
                };
                if (left) {
                    cacheData.left = left;
                }
                if (right) {
                    cacheData.right = right;
                }
                if (bottom) {
                    cacheData.bottom = bottom;
                }
                this.addToFileList('image', key, url);
                this.game.cache.addNineSlice(key, cacheData);
            };
        };
        Plugin.prototype.addNineSliceFactory = function () {
            Phaser.GameObjectFactory.prototype.nineSlice = function (x, y, key, frame, width, height, group) {
                if (group === undefined) {
                    group = this.world;
                }
                var nineSliceObject = new PhaserNineSlice.NineSlice(this.game, x, y, key, frame, width, height);
                return group.add(nineSliceObject);
            };
            Phaser.GameObjectCreator.prototype.nineSlice = function (x, y, key, frame, width, height) {
                return new PhaserNineSlice.NineSlice(this.game, x, y, key, frame, width, height);
            };
        };
        Plugin.prototype.addNineSliceCache = function () {
            Phaser.Cache.prototype.nineSlice = {};
            Phaser.Cache.prototype.addNineSlice = function (key, data) {
                this.nineSlice[key] = data;
            };
            Phaser.Cache.prototype.getNineSlice = function (key) {
                var data = this.nineSlice[key];
                if (undefined === data) {
                    console.warn('Phaser.Cache.getNineSlice: Key "' + key + '" not found in Cache.');
                }
                return data;
            };
        };
        return Plugin;
    }(Phaser.Plugin));
    PhaserNineSlice.Plugin = Plugin;
})(PhaserNineSlice || (PhaserNineSlice = {}));
//# sourceMappingURL=phaser-nineslice.js.map
