import CartsModel from "../models/carts.model.js";

class MongoCartManager {
        
    constructor(){
        this.model=CartsModel
    }
    
    create = async () =>{ return await CartsModel.create({products:[]}) }    
    
    get = async () =>{ return await CartsModel.find().lean().exec() } 

    getById = async (cartId) =>{ return await CartsModel.findById(cartId)}

    getPopulate = async (cartId) =>{
        return await CartsModel.findById(cartId).populate("products.product").lean().exec();
    }
    
    update = async (cartId, changes) =>{ return await CartsModel.updateOne(
        {_id: cartId}, 
        { $set: { products: changes } }
    ) }
    
    delete = async (cartId) => { return await CartsModel.deleteOne({ _id: cartId }) }
}

export default MongoCartManager
