export default class MatchService {

    constructor() {
        this.matches = new Map();
    }

    createOrUpdate(match) {
        this.matches.set(match.id, match);
    }

    read(matchId) {
        return this.matches.get(matchId);
    }

    readAll() {
        return this.matches;
    }

    delete(matchId) {
        this.matches.delete(matchId);
    }
}