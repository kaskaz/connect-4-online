import {STATUS} from './status.js';

export default class Connect4 {

    constructor (playerId, playerName) {
        this.playerId = playerId;
        this.playerName = playerName;
        this.status = STATUS.AVAILABLE;
    }

    getPlayerId() {
        return this.playerId;
    }

    setAvailable() {
        this.status = STATUS.AVAILABLE;
    }

    setPlaying() {
        this.status = STATUS.PLAYING;
    }

    isAvailable() {
        return this.status == STATUS.AVAILABLE;
    }

    isPlaying() {
        return this.status == STATUS.PLAYING;
    }
}