import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"

const productsCollection = "products"

const productsSchema = new mongoose.Schema({
    title: String,
    category: String,
    description: String,
    price: Number,
    thumbnail: {}, 
    code: String,
    stock: Number,
    status: Boolean,
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    }
    },{ timestamps:true }
)

productsSchema.plugin(mongoosePaginate)
const productsModel = mongoose.model(productsCollection, productsSchema)

export default productsModel