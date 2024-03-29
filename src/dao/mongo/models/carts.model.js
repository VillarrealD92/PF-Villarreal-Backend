import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"

const cartsCollection = "carts"

const cartsSchema = new mongoose.Schema({
    products: {
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products"
                },
                quantity: {
                    type: Number,
                    default: 0
                } 
            }   
        ],
        default: []
    } 
})

cartsSchema.plugin(mongoosePaginate)

const cartsModel = mongoose.model(cartsCollection, cartsSchema)

export default cartsModel