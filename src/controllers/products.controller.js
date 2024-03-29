import { cloudinary } from "../config/cloudinary.config.js"
import { productService } from "../repositories/index.repositories.js"



export const getProducts = async (req, res)=> {
    try {
        const limit = parseInt(req.query.limit) || 2
        const page = parseInt(req.query.page) || 1
        const query = req.query.query || ""
        const order = req.query.sort === "Desc" ? -1 : 1
        const sortValue = req.query.sort? {price: order} :'-createdAt'
 
        const search = {}
        if (query) {
            search.title= { "$regex": query, "$options": "i" } 
            search.category= { "$regex": query, "$options": "i" }
        }

        const result = await productService.getProducts(search, limit, page, query, sortValue) 

        result.payload = result.docs
        result.query = query
        result.sortOrder = sortValue
        result.status = "success"
        delete result.docs

        res.status(200).send(result)
    } catch (error) {
        req.logger.error("Error: " + error)
        return res.status(500).send("Internal server error. Couldnt get products")
    }
}

export const getProductById = async (req, res) => {
    try {
        const id=req.params.pid
        const productRequired = await productService.getProductById(id)
        productRequired? res.json( { productRequired } ) : res.json("Not Found")
        
    } catch (error) {
        req.logger.error("Error: " + error)
        return res.status(500).send("Internal server error. Couldnt get product by id")    
    }
}

export const createProduct = async (req,res) => {
    try {
        const { title, category, description, price, thumbnail, code, stock } = req.body
        
        if (!title, !category, !description, !price, !code, !stock) {
            return res.status(400).send("Bad Request. Please check your requested fields")
        }
        
        if(req.file){
            const result = await cloudinary.uploader.upload(req.file.path);
        }

        const productAdded = await productService.createProduct(title, category, description, price, thumbnail, code, stock);

        return res.json(productAdded)

    } catch (error) {
        req.logger.error("Error: " + error)
        return res.status(500).send("Internal server error. Couldnt create product")
    }
}

export const updateProduct = async (req,res) =>{
    try {
        const id = req.params.pid
        const updateRequest = req.body

        const productUpdated = await productService.updateProduct(id, updateRequest)
        
        return res.status(200).send({productUpdated})

    } catch (error) {
        req.logger.error("Error: " + error)
        return res.status(500).send("Internal Server Error. Couldnt update product")
    }
}

export const deleteProduct = async (req,res) => {
    try {
        const id=req.params.pid
        await productService.deleteProduct(id)
        res.status(200).send("Product ID "+id+" has been deleted")
    } catch (error) {
        req.logger.error("Error: " + error)
        return res.status(500).send("Internal server error. Couldnt delete product")
    }
    
}