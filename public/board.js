
const MAXSIZE = 7;

const PLAYER_COLOR = 'lawngreen';
const OPONENT_COLOR = 'tomato';
const WINNER_COLOR = 'blue';

const DIRECTION_EAST        = 1;
const DIRECTION_WEST        = -1;
const DIRECTION_NORTH       = -10;
const DIRECTION_SOUTH       = 10;
const DIRECTION_NORTHEAST   = -9;
const DIRECTION_SOUTHWEST   = 9;
const DIRECTION_NORTHWEST   = -11;
const DIRECTION_SOUTHEAST   = 11;

export default class Board {

    constructor(boardElem) {
        this.board = boardElem;
        this.boardMap = new Map();
        this.colContainerCount = new Map();
    }

    initBoard() {
        var row = 0;
        while ((++row)<(MAXSIZE+1)) {
            var col = 0;
            while((++col)<(MAXSIZE+1)) {
                var cell = document.createElement('div');
                var cellId = row + "" + col;
                cell.id = cellId;
                cell.className = 'cell';
                cell.addEventListener('click', (event) => {
                    this.play(event.currentTarget.id, this.colContainerCount);
                });

                this.board.append(cell);
                this.boardMap.set(cellId, new Cell(cellId));
            }
        }    
    }

    play(eventId, colContainerCount) {
        var id = eventId;
        var col = parseInt(id.charAt(1));
        var count = 1;
    
        if(colContainerCount.get(col)) {
            count = colContainerCount.get(col);
            if (count == MAXSIZE) {
                advertiseForAnotherColumn();
                return;
            } else {
                colContainerCount.set(col, ++count);
            }
        } else {
            colContainerCount.set(col, count);
        }
    
        var cellId = (MAXSIZE+1-count) + "" + col;
        this.boardMap.get(cellId).select(Cell.OWNER_PLAYER);
        this.updateCell(cellId, PLAYER_COLOR);
        this.detectVictory(cellId);
    }

    detectVictory(startPosition) {

        var cellsToUpdate = [startPosition];
        var intStartPosition = parseInt(startPosition);
    
        var east = this.countCellsRecursively(startPosition, 0, DIRECTION_EAST, Cell.OWNER_PLAYER);
        var west = this.countCellsRecursively(startPosition, 0, DIRECTION_WEST, Cell.OWNER_PLAYER);
    
        if (east+west >= 3) {
            this.fillCellsToUpdate(intStartPosition, east, DIRECTION_EAST, cellsToUpdate);
            this.fillCellsToUpdate(intStartPosition, west, DIRECTION_WEST, cellsToUpdate);
            cellsToUpdate.forEach(cell => this.updateCell(cell, WINNER_COLOR));
            return;
        }
    
        var north = this.countCellsRecursively(startPosition, 0, DIRECTION_NORTH, Cell.OWNER_PLAYER);
        var south = this.countCellsRecursively(startPosition, 0, DIRECTION_SOUTH, Cell.OWNER_PLAYER);
    
        if (north+south >= 3) {
            this.fillCellsToUpdate(intStartPosition, north, DIRECTION_NORTH, cellsToUpdate);
            this.fillCellsToUpdate(intStartPosition, south, DIRECTION_SOUTH, cellsToUpdate);
            cellsToUpdate.forEach(cell => this.updateCell(cell, WINNER_COLOR));
            return;
        }
    
        var northeast = this.countCellsRecursively(startPosition, 0, DIRECTION_NORTHEAST, Cell.OWNER_PLAYER);
        var southwest = this.countCellsRecursively(startPosition, 0, DIRECTION_SOUTHWEST, Cell.OWNER_PLAYER);
        
        if (northeast+southwest >= 3) {
            this.fillCellsToUpdate(intStartPosition, northeast, DIRECTION_NORTHEAST, cellsToUpdate);
            this.fillCellsToUpdate(intStartPosition, southwest, DIRECTION_SOUTHWEST, cellsToUpdate);
            cellsToUpdate.forEach(cell => this.updateCell(cell, WINNER_COLOR));
            return;
        }
    
        var northwest = this.countCellsRecursively(startPosition, 0, DIRECTION_NORTHWEST, Cell.OWNER_PLAYER);
        var southeast = this.countCellsRecursively(startPosition, 0, DIRECTION_SOUTHEAST, Cell.OWNER_PLAYER);
    
        if (northwest+southeast >= 3) {
            this.fillCellsToUpdate(intStartPosition, northwest, DIRECTION_NORTHWEST, cellsToUpdate);
            this.fillCellsToUpdate(intStartPosition, southeast, DIRECTION_SOUTHEAST, cellsToUpdate);
            cellsToUpdate.forEach(cell => this.updateCell(cell, WINNER_COLOR));
            return;
        }
    
    }

    countCellsRecursively(position, count, direction, owner) {
        var newPosition = (parseInt(position)+direction).toString();
        if (this.boardMap.has(newPosition)) {
            var cell = this.boardMap.get(newPosition);
            if (cell.isSelected() && cell.isOwner(owner)) {
                return (++count == 3) ? 
                    count : this.countCellsRecursively(newPosition, count, direction, owner);
            }
        }
        return count;
    }

    fillCellsToUpdate(defaultPosition, times, direction, cellArray) {
        while (times) {
            cellArray.push(defaultPosition+(Math.abs(direction*(times--))*Math.sign(direction)));
        }
    }

    updateCell(id, color) {
        document.getElementById(id)
                .style.backgroundColor = color;
    }

}

class Cell {

    constructor(id) {
        this.id = id;
        this.selected = false;
    }

    isSelected() {
        return this.selected;
    }

    isAvailable() {
        return this.selected == false;
    }

    select(owner) {
        this.selected = true;
        this.owner = owner;
    }

    isOwner(owner) {
        return this.owner == owner;
    }
    
}