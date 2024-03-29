
export default class ProductRepository{
    constructor(dao){
        this.dao=dao
    }

    createProduct = async ({title, category, description, price, code, stock}) => { return await this.dao.create({title, category, description, price, code, stock}) }
 
    getProducts = async (search, query, page, limit, sortValue) => { 
        return await this.dao.get(search, query, page, limit, sortValue)
    }
 
    getAllProducts = async () => { return await this.dao.getAll()}
 
    getProductById = async (id) => { return await this.dao.getById(id) }
 
    updateProduct = async (id, changes) => { return await this.dao.update(id, changes)}
 
    deleteProduct = async (id) => { return await this.dao.delete(id) }
 
}