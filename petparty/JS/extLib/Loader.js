'use strict';

(function(){

    /**
     * Successfully loaded a JSON file.
     *
     * @method Phaser.Loader#jsonLoadComplete
     * @param {number} index - The index of the file in the file queue that loaded.
     */
        Phaser.Loader.prototype.jsonLoadComplete = function(index)
        {
            if (!this._fileList[index])
            {

                return;
            }

            var file = this._fileList[index];
            var data = JSON.parse(file._xhr.responseText);

            file.loaded = true;

            if (file.type === 'tilemap')
            {
                this.game.cache.addTilemap(file.key, file.url, data, file.format);
            }
            if (file.type === 'json')
            {
                this.game.cache.addJSON(file.key, file.url, data);
            }
            else
            {
                data.meta.scale = parseFloat(data.meta.scale);
                data.meta.name = data.meta.image._before('.');
                this.game.cache.addTextureAtlas(file.key, file.url, file.data, data, file.format);
            }

            //Tweak: parse the scale factor to a number
            //data.meta.scale = parseFloat(data.meta.scale);
            //Tweak: save name of spritesheets;
            // data.meta.name = data.meta.image._before('.');

            //Tweak: save meta data for tilemaps and spritesheets
            if ( file.type === 'tilemap' ||  file.type === 'spritesheets' ) this.game.cache.getFrameData(file.key).metaData = data.meta;

            this.nextFile(index, true);
        },
        Phaser.Loader.prototype.nextFile = function (previousIndex, success)
        {
            this.progressFloat += this._progressChunk;
            this.progress = Math.round(this.progressFloat);

            if (this.progress > 100)
            {
                this.progress = 100;
            }

            if (this.preloadSprite !== null)
            {
                if (this.preloadSprite.direction === 0)
                {
                    this.preloadSprite.crop.width = Math.floor((this.preloadSprite.width / 100) * this.progress);
                }
                else
                {
                    this.preloadSprite.crop.height = Math.floor((this.preloadSprite.height / 100) * this.progress);
                }

                this.preloadSprite.sprite.crop = this.preloadSprite.crop;
            }


            this.onFileComplete.dispatch(this.progress, this._fileList[previousIndex].key, success, this.totalLoadedFiles(), this._fileList.length);


            // If we have not finished loading all the files, and we have not started loading all the files, load the next one
            if (this.totalQueuedFiles() > 0 && this.currentFileIndex < this._fileList.length )
            {
                this._fileIndex++;
                this.loadFile(this.currentFileIndex++);
            }
            // If we have finished loading all the files
            else if( this.totalQueuedFiles() === 0 )
            {
                this.hasLoaded = true;
                this.isLoading = false;

                this.removeAll();

                this.onLoadComplete.dispatch();
            }

        },

        Phaser.Loader.prototype.fileComplete = function (index) {
            if (!this._fileList[index])
            {
                console.warn('Phaser.Loader fileComplete invalid index ' + index);
                return;
            }

            var file = this._fileList[index];
            file.loaded = true;

            var loadNext = true;
            var _this = this;
            switch (file.type)
            {
                case 'image':

                    this.game.cache.addImage(file.key, file.url, file.data);
                    break;

                case 'spritesheet':

                    this.game.cache.addSpriteSheet(file.key, file.url, file.data, file.frameWidth, file.frameHeight, file.frameMax, file.margin, file.spacing);
                    break;

                case 'textureatlas':

                    if (file.atlasURL == null)
                    {
                        this.game.cache.addTextureAtlas(file.key, file.url, file.data, file.atlasData, file.format);
                    }
                    else
                    {
                        //  Load the JSON or XML before carrying on with the next file
                        file.loaded = false;
                        loadNext = false;
                        file._xhr.open("GET", this.baseURL + file.atlasURL, true);
                        file._xhr.responseType = "text";

                        if (file.format == Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY || file.format == Phaser.Loader.TEXTURE_ATLAS_JSON_HASH)
                        {
                            file._xhr.onload = function () {
                                _this._xhr = file._xhr;
                                return _this.jsonLoadComplete(index);
                            };
                        }
                        else if (file.format == Phaser.Loader.TEXTURE_ATLAS_XML_STARLING)
                        {
                            file._xhr.onload = function () {
                                _this._xhr = file._xhr;
                                return _this.xmlLoadComplete(index);
                            };
                        }
                        else
                        {
                            throw new Error("Phaser.Loader. Invalid Texture Atlas format: " + file.format);
                        }

                        file._xhr.onerror = function () {
                            return _this.dataLoadError(index);
                        };
                        file._xhr.send();
                    }
                    break;

                case 'bitmapfont':

                    if (file.xmlURL == null)
                    {
                        this.game.cache.addBitmapFont(file.key, file.url, file.data, file.xmlData);
                    }
                    else
                    {
                        file.loaded = false;

                        //  Load the XML before carrying on with the next file
                        loadNext = false;
                        file._xhr.open("GET", this.baseURL + file.xmlURL, true);
                        file._xhr.responseType = "text";

                        file._xhr.onload = function () {
                            _this._xhr = file._xhr;
                            return _this.xmlLoadComplete(index);
                        };

                        file._xhr.onerror = function () {
                            return _this.dataLoadError(index);
                        };
                        file._xhr.send();
                    }
                    break;

                case 'audio':

                    if (this.game.sound.usingWebAudio)
                    {
                        file.data = file._xhr.response;

                        this.game.cache.addSound(file.key, file.url, file.data, true, false);

                        if (file.autoDecode)
                        {
                            this.game.cache.updateSound(key, 'isDecoding', true);

                            var that = this;
                            var key = file.key;

                            this.game.sound.context.decodeAudioData(file.data, function (buffer) {
                                if (buffer)
                                {
                                    that.game.cache.decodedSound(key, buffer);
                                    that.game.sound.onSoundDecode.dispatch(key, that.game.cache.getSound(key));
                                }
                            });
                        }
                    }
                    else
                    {
                        file.data.removeEventListener('canplaythrough', Phaser.GAMES[this.game.id].load.fileComplete);
                        this.game.cache.addSound(file.key, file.url, file.data, false, true);
                    }
                    break;

                case 'text':
                    file.data = file._xhr.responseText;
                    this.game.cache.addText(file.key, file.url, file.data);
                    break;

                case 'script':
                    file.data = document.createElement('script');
                    file.data.language = 'javascript';
                    file.data.type = 'text/javascript';
                    file.data.defer = false;
                    file.data.text = file._xhr.responseText;
                    document.head.appendChild(file.data);
                    break;

                case 'binary':
                    if (file.callback)
                    {
                        file.data = file.callback.call(file.callbackContext, file.key, file._xhr.response);
                    }
                    else
                    {
                        file.data = file._xhr.response;
                    }

                    this.game.cache.addBinary(file.key, file.data);

                    break;
            }

            if (loadNext)
            {
                this.nextFile(index, true);
            }

        },

        Phaser.Loader.prototype.start = function () {
            if (this.isLoading)
            {
                return;
            }

            this.progress = 0;
            this.progressFloat = 0;
            this.hasLoaded = false;
            this.isLoading = true;

            this.onLoadStart.dispatch(this._fileList.length);


            this.__maxParallelFiles = 5;
            this.maxLoadingFiles = Math.min(this._fileList.length, this.__maxParallelFiles);
            if (this._fileList.length > 0)
            {
                this.currentFileIndex = 0;
                this._fileIndex = 0;
                this._progressChunk = 100 / this._fileList.length;
                for(var loadingFiles = 0; loadingFiles<this.maxLoadingFiles; loadingFiles++)
                {
                    this.loadFile(this.currentFileIndex);
                    this.currentFileIndex++;
                }
            }
            else
            {
                this.progress = 100;
                this.progressFloat = 100;
                this.hasLoaded = true;
                this.onLoadComplete.dispatch();
            }

        }

    Phaser.Loader.prototype.loadFile = function (index) {
        if (!this._fileList[index])
        {
            console.warn('Phaser.Loader loadFile invalid index ' + index);
            return;
        }


        var file = this._fileList[index];
        file._xhr = new XMLHttpRequest();
        var _this = this;


        //  Image or Data?
        switch (file.type)
        {
            case 'image':
            case 'spritesheet':
            case 'textureatlas':
            case 'bitmapfont':
                file.data = new Image();
                file.data.name = file.key;
                file.data.onload = function () {
                    return _this.fileComplete(index);
                };
                file.data.onerror = function () {
                    return _this.fileError(index);
                };
                file.data.crossOrigin = this.crossOrigin;
                file.data.src = this.baseURL + file.url;
                break;

            case 'audio':
                file.url = this.getAudioURL(file.url);

                if (file.url !== null)
                {
                    //  WebAudio or Audio Tag?
                    if (this.game.sound.usingWebAudio)
                    {
                        file._xhr.open("GET", this.baseURL + file.url, true);
                        file._xhr.responseType = "arraybuffer";
                        file._xhr.onload = function () {
                            return _this.fileComplete(index);
                        };
                        file._xhr.onerror = function () {
                            return _this.fileError(index);
                        };
                        file._xhr.send();
                    }
                    else if (this.game.sound.usingAudioTag)
                    {
                        if (this.game.sound.touchLocked)
                        {
                            //  If audio is locked we can't do this yet, so need to queue this load request. Bum.
                            file.data = new Audio();
                            file.data.name = file.key;
                            file.data.preload = 'auto';
                            file.data.src = this.baseURL + file.url;
                            this.fileComplete(index);
                        }
                        else
                        {
                            file.data = new Audio();
                            file.data.name = file.key;
                            file.data.onerror = function () {
                                return _this.fileError(index);
                            };
                            file.data.preload = 'auto';
                            file.data.src = this.baseURL + file.url;
                            file.data.addEventListener('canplaythrough', Phaser.GAMES[this.game.id].load.fileComplete(index), false);
                            file.data.load();
                        }
                    }
                }
                else
                {
                    this.fileError(index);
                }

                break;
            case 'tilemap':
            case 'json':
                file._xhr.open("GET", this.baseURL + file.url, true);
                file._xhr.responseType = "text";

                if (!file.format || file.format === Phaser.Tilemap.TILED_JSON)
                {
                    file._xhr.onload = function () {
                        return _this.jsonLoadComplete(index);
                    };
                }
                else if (file.format === Phaser.Tilemap.CSV)
                {
                    file._xhr.onload = function () {
                        _this._xhr = file._xhr;
                        return _this.csvLoadComplete(index);
                    };
                }
                else
                {
                    throw new Error("Phaser.Loader. Invalid Tilemap format: " + file.format);
                }

                file._xhr.onerror = function () {
                    return _this.dataLoadError(index);
                };
                file._xhr.send();
                break;
            case 'text':
            case 'script':
                file._xhr.open("GET", this.baseURL + file.url, true);
                file._xhr.responseType = "text";
                file._xhr.onload = function () {
                    return _this.fileComplete(index);
                };
                file._xhr.onerror = function () {
                    return _this.fileError(index);
                };
                file._xhr.send();
                break;

            case 'binary':
                file._xhr.open("GET", this.baseURL + file.url, true);
                file._xhr.responseType = "arraybuffer";
                file._xhr.onload = function () {
                    return _this.fileComplete(index);
                };
                file._xhr.onerror = function () {
                    return _this.fileError(index);
                };
                file._xhr.send();
                break;
        }

    };
})();