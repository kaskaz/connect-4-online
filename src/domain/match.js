import Board from "../../public/board";

export default class Match {

    constructor(playerOne, playerTwo, board) {
        this.playerOne = playerOne;
        this.playerTwo = playerTwo;
        this.board = board;
        this.turn = playerOne;
        this.ended = false;
    }

    isEnded() {
        return this.ended; 
    }

    finish() {
        this.ended = true;
    }

    start(turnNotification) {
        88
        // start count 
            // receive call
    }

}