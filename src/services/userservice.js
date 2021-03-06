export default class UserService {

    constructor() {
        this.users = new Map();
    }

    createOrUpdate(user) {
        this.users.set(user.id, user);
    }

    read(userId) {
        return this.users.get(userId);
    }

    readAllUsers() {
        return this.users;
    }

    delete(userId) {
        this.users.delete(userId);
    }
}