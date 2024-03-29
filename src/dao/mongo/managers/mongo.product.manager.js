import ProductsModel from "../models/products.model.js";

class MongoProductManager {
    constructor(){
        this.model = ProductsModel
    }

    create = async ({title, category, description, price, code, stock}) => {
       return await ProductsModel.create({title, category, description, price, code, stock})
    }

    get = async (search, query, page, limit, sortValue) => { 
        return await ProductsModel.paginate(search
            , {
                page: query? 1: page,
                limit: 9,
                sort: sortValue,
                lean: true
            })
    }

    getAll = async () => { return await ProductsModel.find().lean().exec()}

    getById = async (id) => { return await ProductsModel.findById(id) }

    update = async (id, changes) => { 
       return await ProductsModel.updateOne({ _id: id },{ $set: changes }) 
    }

    delete = async (id) => { return await ProductsModel.deleteOne({ _id: id }) }

}

export default MongoProductManager