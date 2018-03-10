const Errors = {
    'RPC_VERSION_ERROR': {code: -100, message: 'jsonrpc version mismatch'},
    'PARSE_ERROR': {code: -32700, message: 'Parse error'},
    'INVALID_REQUEST': {code: -32600, message: 'Invalid Request'},
    'METHOD_NOT_FOUND': {code: -32601, message: 'Method not found'},
    'INVALID_PARAMS': {code: -32602, message: 'Invalid Params'},
    'INTERNAL_ERROR': {code: -32603, message: 'Internal Error'},
};

class JsonRpc2 {
    constructor(methods) {
        if(methods instanceof Object) {
            this.methods = methods;
        } else {
            throw Error('methods is not a object');
        }
    }
    execute(requestStr) {
        let request,
            method;
        try {
            request = JSON.parse(requestStr);
        } catch(e) {
            return this._reportError(Errors.PARSE_ERROR);
        }
        if(request instanceof Object === false) {
            return  this._reportError(Errors.INVALID_REQUEST);
        }
        if(request.hasOwnProperty('jsonrpc') === false || request.jsonrpc !== '2.0') {
            return this._reportError(Errors.RPC_VERSION_ERROR);
        }
        if(this._isString(request.method)) {
            if(this.methods[request.method] instanceof Function) {
                method = this.methods[request.method].bind(this.methods);
            } else {
                return this._reportError(Errors.METHOD_NOT_FOUND);
            }
        } else {
            return this._reportError(Errors.INVALID_REQUEST);
        }
        if(request.params && request.params instanceof Array === false) {
            return this._reportError(Errors.INVALID_PARAMS);
        }
        if(!request.params) {
            request.params = [];
        }
        if(request.hasOwnProperty('id') 
            && this._isString(request.id) === false 
            && this._isInteger(request.id) === false) {
            return this._reportError(Errors.INVALID_REQUEST);
        }

        return new Promise((resolve, reject) => {
            let r = this._processMethodRet(method(...request.params));
            r.then(v => {
                if(request.hasOwnProperty('id')) {
                    resolve(this._reportResult(v, request.id));
                } else {
                    resolve(undefined);
                }
            }).catch(error => {
                reject(error);
            });
        }).catch((e) => {
            console.error(e);
            if(request.hasOwnProperty('id')) {
                return this._reportError(Errors.INTERNAL_ERROR);
            } else {
                return undefined;
            }
        });
    }
    _processMethodRet(r) {
        return new Promise((resolve, reject) => {
            if(r instanceof Promise) {
                r.then(v => {
                    resolve(v);
                }).catch(error => {
                    reject(error);
                });
            } else {
                resolve(r);
            }
        });
    }
    _isString(value) {
        return Object.prototype.toString.call(value) == '[object String]';
    }
    _isInteger(value) {
        return Number.isInteger(value);
    }
    _reportError(error) {
        return JSON.stringify({
            jsonrpc: '2.0',
            id: null,
            error,
        });
    }
    _reportResult(result, id) {
        return JSON.stringify({
            jsonrpc: '2.0',
            id,
            result: result === undefined ? null : result,
        });
    }
    static createJsonRpc(method, params, id) {
        let obj = {
            jsonrpc: '2.0',
            method: method,
        };
        if(params) {
            obj.params = params;
        }
        if(id) {
            obj.id = id;
        }
        return JSON.stringify(obj);
    }
    static reponseIsOk(reponse, id) {
        let r = JSON.parse(reponse);
        return r.hasOwnProperty('error') === false && r.id === id;
    }
    static getReponseResult(reponse) {
        return JSON.parse(reponse).result;
    }
}

module.exports = JsonRpc2;