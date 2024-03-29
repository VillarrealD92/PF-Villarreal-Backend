
export default class ChatRepository{
    constructor(dao){
        this.dao=dao
    }

    createMessage = async (user, message) => {
        return await this.dao.create(user, message)
    }

    getMessages = async () => { return await this.dao.get()}
}