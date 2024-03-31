export default class UserRepository {
    constructor(dao){
        this.dao = dao;
    }

    getUsers = async () =>{
        return await this.dao.getAll()
    }

    getInactiveUsers = async (inactiveMark) => {
        return await this.dao.getAllByData(inactiveMark)
    }

    deleteInactives = async (inactiveMark) => {
        return await this.dao.deleteVarious(inactiveMark)
    }

    createUser = async (newUser) => {
        return await this.dao.create(newUser);
    }

    getUserByEmail = async (email) => {
        return await this.dao.getByData(email);
    }

    getUserById = async (id) => {
        return await this.dao.getById(id);
    }

    updateUser = async (userId, changes) => {
        return await this.dao.update(userId, changes); 
    }

    deleteUser = async (userId) => {
        return await this.dao.delete(userId);
    }

    updateUserToPremium = async (userId) => {
        try {
            const updatedUser = await this.dao.updateUserToPremium(userId);
            return updatedUser;
        } catch (error) {
            throw new Error(`Error al actualizar usuario a premium: ${error.message}`);
        }
    }

    uploadUserDocuments = async (userId, documents) => {
        try {
            const updatedUser = await this.dao.uploadUserDocuments(userId, documents);
            return updatedUser;
        } catch (error) {
            throw new Error(`Error al cargar documentos: ${error.message}`);
        }
    }

}