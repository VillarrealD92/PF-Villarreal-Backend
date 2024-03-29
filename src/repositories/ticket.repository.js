
export default class TicketRepository {
    constructor(dao){
        this.dao=dao
    }

    createTicket = async (amount, purchaser) => { 
        return await this.dao.create(amount, purchaser)
    }

    getTickets = async () => { 
        return await this.dao.get() 
    }
    
    getTicketById = async (id) => {
        return await this.dao.getById(id)
    }

    updateTicket = async (id, changes) => {
        return await this.dao.update(id,changes)
    }
    
    deleteTicket = async (id) => {
        return await this.dao.delete(id)
    }

    getTicketsByPurchaser = async (purchaserEmail) => {
        return await this.dao.getByPurchaser(purchaserEmail);
    }
    
}