import UserModel from "../models/user.model.js";

class MongoUserManager{
    constructor(){
        this.model = UserModel;
    }
    
    getAll = async () => { return await UserModel.find().lean().exec()}

    getAllByData = async (inactiveMark) => { return await UserModel.find({last_connection: {$lt: inactiveMark}}).lean().exec()}


    create = async (newUser) => {
        return await UserModel.create(newUser);
    }

    getByData = async (username) => {
        return await UserModel.findOne({ email: username }).lean().exec();
    }

    getById = async (id) => {
        return await UserModel.findById(id);
    }

    update = async (userId, changes) => {
        return await UserModel.updateOne({_id: userId}, { $set: changes }); // Cambio de 'email' a '_id'
    }

    delete = async (userId) => {
        return await UserModel.deleteOne({_id: userId});
    }

    uploadUserDocuments = async (userId, documents) => {
        try {
            const user = await this.model.findById(userId);

            if (!user) {
                throw new Error("Usuario no encontrado.");
            }

            user.documents = documents.map(document => ({
                name: document.originalname,
                reference: document.path 
            }));

            await user.save();

            return user;
        } catch (error) {
            throw error; 
        }
    }

    getUsersWithDocuments = async () => {
        try {
            // Encuentra todos los usuarios con el rol "user"
            const users = await this.model.find({ role: "user" }).lean().exec();
    
            // Filtra los usuarios que tengan documentos cargados
            const usersWithDocuments = users.filter(user => user.documents && user.documents.length > 0);
    
            return usersWithDocuments;
        } catch (error) {
            throw error;
        }
    }

    updateUserToPremium = async (userId) => {
        try {
            // Verifica si userId es un ObjectId válido
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                throw new Error("El ID de usuario no es válido.");
            }

            const user = await this.model.findById(userId);

            if (!user) {
                throw new Error("Usuario no encontrado.");
            }

            user.role = "premium"; // Actualiza el rol del usuario a "premium"
            await user.save(); // Guarda los cambios en la base de datos

            return user; // Devuelve el usuario actualizado
        } catch (error) {
            throw error; // Lanza el error si ocurre alguno
        }
    }

    deleteVarious = async (inactiveMark) => {
        return await UserModel.deleteMany({last_connection: {$lt: inactiveMark}})
    }
}

export default MongoUserManager;