export default class Connect4 {

    constructor (playerId, playerName) {
        this.playerId = playerId;
        this.playerName = playerName;
    }

    getPlayerId() {
        return this.playerId;
    }
}