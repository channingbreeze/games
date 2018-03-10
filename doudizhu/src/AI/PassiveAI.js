class PassiveAI {
    callPoint(args) {
        return 1;
    }


    play(args) {
        return [args.myCards[0]];
    }


    cover(args) {
        return [];
    }
}

module.exports = PassiveAI;