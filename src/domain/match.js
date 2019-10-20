export default class Match {

    constructor(playerOne, playerTwo) {
        this.playerOne = playerOne;
        this.playerTwo = playerTwo;
        this.turn = playerOne;
        this.ended = false;
    }

    isEnded() {
        return this.ended; 
    }

    finish() {
        this.ended = true;
    }

}