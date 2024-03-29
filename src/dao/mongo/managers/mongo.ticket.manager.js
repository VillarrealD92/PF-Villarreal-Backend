import TicketModel from "../models/ticket.model.js";

class MongoTicketManager {
    constructor(){
        this.model=TicketModel
    }

    create = async (amount, purchaser) => { 
        return await TicketModel.create({amount,purchaser})
    }

    get = async () => {
        return await TicketModel.find().lean().exec()
    }
    
    getById = async (id) => {
        return await TicketModel.findById(id)
    }

    update = async (id, changes) => {
        return await TicketModel.updateOne({_id: id}, { $set: {changes} })
    }
    
    delete = async (id) => {
        return await TicketModel.deleteOne({ _id: id })
    }

    getByUserId = async (userId) => {
        return await TicketModel.find({ purchaser: userId }).lean().exec();
    }
    
    getByPurchaser = async (purchaserEmail) => {
        try {
            const tickets = await this.model.find({ purchaser: purchaserEmail }).lean().exec();
            return tickets;
        } catch (error) {
            throw new Error(`Error fetching tickets by purchaser: ${error.message}`);
        }
    }
}

export default MongoTicketManager