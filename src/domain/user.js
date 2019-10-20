export default class User {

    constructor(name, socket) {
        this.id = socket.id;
        this.name = name;
        this.socket = socket;
        this.status = this.AVAILABLE;
        this.challenges = [];
        this.challenged = [];
        this.score = Math.round(Math.random()*10);
    }

    static get AVAILABLE() {
        return 1;
    }

    static get PLAYING() {
        return 2;
    }

    changeStatus(status) {
        this.status = status;
    }

    getStatus() {
        return this.status;
    }

    addChallenge(id) {
        this.challenges.push(id);
    }

    removeChallenge(id) {
        this.challenges = this.challenges.filter(ch => ch != id);
    }

    addChallenged(id) {
        this.challenged.push(id);
    }

    removeChallenged(id) {
        this.challenged = this.challenged.filter(ch => ch != id);
    }

}