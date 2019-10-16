export default class User {
    constructor(name, socket) {
        this.id = socket.id;
        this.name = name;
        this.socket = socket;
        this.challenges = [];
        this.challenged = [];
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