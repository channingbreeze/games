import postal from 'postal/lib/postal.lodash';
import Player from './Player';
import GAME from './Game';
//import AI from '../AI/AI.js';

let _sub = [];

function waitPlayerJoin() {
    postal.subscribe({
        channel: 'all',
        topic: 'socketConnecting',
        callback(identity) {
            Promise.resolve().then(() => GAME.addPlayer(new Player(identity)));
        },
    });
}

function waitPlayerReady() {
    let s = postal.subscribe({
        channel: 'server',
        topic: 'playerIsReady',
        callback() {
            if(GAME.canBegin()) {     
                GAME.begin();
                GAME.broadcast('serverSay_beginGame');
            }
        },
    });
    _sub.push(s);
}

function clearSubscribe() {
    _sub.forEach(s => s.unsubscribe());
}

async function callPoints() {
    await new Promise((resolve) => {
        let subscription = postal.subscribe({
            channel: 'server',
            topic: 'allPlayerFinishDeal',
            callback() {
                subscription.unsubscribe();
                resolve();
            },
        });
    });
    let dizhuIndex = 0,
        highestPoint = 0;
    for(let i = 0; i < 3; ++i) {
        let player = GAME.currentPlayer;
        let point = await player.emitAndExecptReponse('ServerSay_callPoints');
        if(point > highestPoint) {
            dizhuIndex = Number.parseInt(player.name);
            highestPoint = point;
        }
        GAME.broadcast('ServerSay_showPoints', {point, name: player.name});
        if(point === 3) {
            dizhuIndex = Number.parseInt(player.name);
            break;
        }
        GAME.turnToNextPlayer();
        await new Promise(cb => setTimeout(() => cb(), 1000));
    }
    GAME.currentPlayerIndex = GAME.dizhuIndex = dizhuIndex;
    GAME.diZhuCards.forEach(card => GAME.currentPlayer.cards.push(card));
}

async function broadcastWhoIsDizhu() {
    let pms = [];
    GAME.players.forEach(player => {
        pms.push(player.emitAndExecptReponse('ServerSay_sendDiZhuCards', {diZhuIndex: GAME.dizhuIndex, cards: GAME.diZhuCards}));
    });
    await Promise.all(pms);
}

async function startRound() {
    while(GAME.isBegin && !GAME.isFinish) {
        await GAME.playRound();
    }
}

async function mainLoop() {
    //叫分
    await callPoints();
    await broadcastWhoIsDizhu();
    await startRound();
}

async function start() {
    //开始监听
    waitPlayerJoin();

    /*eslint no-constant-condition: ["error", { "checkLoops": false }]*/
    // while(true) {
    //     clearSubscribe();
    //     //机器人入场
    //     let ai1 = new AI('1');
    //     let ai2 = new AI('2');


    //     waitPlayerReady();
    //     //2秒钟以后机器人准备
    //     setTimeout(() => {
    //         ai1.sendRequest('clientSay_iamReady');
    //         ai2.sendRequest('clientSay_iamReady');
    //     }, 2000);

    //     await mainLoop();
    // }
}

export default start;