class User {
    constructor(name, socket) {
        this.id = socket.id;
        this.name = name;
        this.socket = socket;
    }
}

const _User = User;
export { _User as User };