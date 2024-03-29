import mongoose from "mongoose"
import { nanoid } from "nanoid"

const TicketModel = mongoose.model("tickets", new mongoose.Schema({
    code: {
        type: String,
        default: () => nanoid(6)
    },
    purchase_datetime: {
        type: Date,
        default: Date.now
    },
    amount: Number,
    purchaser: String
}))

export default TicketModel