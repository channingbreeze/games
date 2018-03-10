let JsonRpc2 = require('./JsonRpc2');
let TimeoutError = require('./errors/TimeoutError');
const config = require('../server/config');

class AbstractActions {
    async sendRequest(methodName, params, id, timeout) {
        let request = JsonRpc2.createJsonRpc(methodName, params, id);

        return await Promise.race([
            new Promise((resolve, reject) => {
                if(id) {
                    this.player._send(request, rep => {
                        if(JsonRpc2.reponseIsOk(rep, id)) {
                            resolve(rep);
                        } else {
                            reject(new Error(rep));
                        }
                    });
                } else {
                    this.player._send(request);
                    resolve(true);
                }
            }),
            new Promise((resolve, reject) => {
                setTimeout(() => reject(new TimeoutError('request timeout')), timeout === undefined ? config.ACTION_TIME_OUT : timeout);
            }),
        ]);
    }
}

module.exports = AbstractActions;