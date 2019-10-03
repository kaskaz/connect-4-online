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
        return [
            {id:1, name:'Jonas Brothers'},
            {id:2, name:'Gipsy'},
            {id:3, name:'Rafafel Nadal'},
            {id:4, name:'Madonna'}
        ];
    }

    delete(userId) {
        this.users.delete(userId);
    }
}