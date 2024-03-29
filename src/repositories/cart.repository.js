
export default class CartRepository {
    constructor(dao){
        this.dao=dao
    }

    createNewCart = async () =>{ return await this.dao.create() } 

    getCarts = async () =>{ return await this.dao.get()} 

    getCartById = async (cartId) =>{ return await this.dao.getById(cartId)}

    getPopulatedCart = async (cartId) => { return await this.dao.getPopulate(cartId) }
    
    updateCart = async (cartId, changes) =>{ return await this.dao.update(cartId, changes) }

    deleteCart = async (cartId) => { return await this.dao.delete(cartId) }
}