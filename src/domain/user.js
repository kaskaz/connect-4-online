export default class User {
    constructor(name, socket) {
        this.id = socket.id;
        this.name = name;
        this.socket = socket;
    }
}