export default class BoardService {

    constructor() {
        this.boards = new Map();
        this.boardIdGenerator = 0;
    }

    add(board) {
        board.setId(++this.boardIdGenerator);
        this.boards.set(board.getId(), board);
    }

    get(boardId) {
        return this.boards.get(boardId);
    }

}