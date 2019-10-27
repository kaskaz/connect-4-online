export default class Board {

    constructor() {
        this.boardMap = new Map();
        this.columnCounter = new Map();
    }

    getBoard() {
        return this.boardMap;
    }

    getCounter() {
        return this.columnCounter;
    }

}