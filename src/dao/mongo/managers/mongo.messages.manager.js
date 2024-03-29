import MessagesModel from "../models/messages.model.js";

class MongoMessagesManager {
    constructor(){
        this.model = MessagesModel()
    }

    create = async (user, message) => {
        return await MessagesModel.create({user, message})
    }

    get = async () => {
        return await MessagesModel.find().lean().exec()
    }
}

export default MongoMessagesManager