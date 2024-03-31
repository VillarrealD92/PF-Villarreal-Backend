import mongoose from "mongoose"

const UserModel = mongoose.model("users", new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    age: Number,
    password: String,
    role: {
        type: String,
        enum: ["admin", "user", "premium"],
        default: "user"
    },
    cart:
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'carts',
			},
    documents: [
            {
                name: String,
                reference: String
            }
        ],
    tickets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'tickets' }],
    last_connection:
        {
            type: Date,
            default: Date.now()
        }
    },{ timestamps:true }
))

export default UserModel