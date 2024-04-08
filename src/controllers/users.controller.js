import { userService } from '../repositories/index.repositories.js';
import UserDTO from "../DTO/user.dto.js";
import Mail from "../modules/mail.module.js";

export const getUsers = async (req, res) => {
    try {
        const usersData = await userService.getUsers()
        const usersDTO = usersData.map(user => new UserDTO(user));

        return res.status(200).json({ status: "success", payload: usersDTO })
    } catch (error) {
        return res.status(500).json({ status: "fail", message: "Internal server error while getting users." + error })
    }
}

export const deleteInactives = async (req, res) => {
    try {
        const inactiveMark = new Date()
        inactiveMark.setHours(inactiveMark.getHours() - 1)

        const inactiveAccounts = await userService.getInactiveUsers(inactiveMark)

        const deletingResult = await userService.deleteInactives(inactiveMark)

        const mailer = new Mail()
        inactiveAccounts.forEach(account => {
            mailer.sendDeletionReport(account.email)
        })

        return res.status(200).json({ status: "success", payload: deletingResult })
    } catch (error) {
        return res.status(500).json({ status: "fail", message: "Internal server error while deleting inactives." + error })
    }
}

export const getUserByEmail = async (req, res) => {
    try {
        const { email } = req.query
        const user = await userService.getUserByEmail(email)

        return res.status(200).json({ status: "success", payload: user })
    } catch (error) {
        return res.status(500).json({ status: "fail", message: "Internal server error while getting user by email." + error })
    }
}

export const updateUserToPremium = async (req, res) => {
    try {
        const userId = req.params.uid;
        const user = await userService.getUserById(userId);

        if (!user) {
            return res.status(404).send("Usuario no encontrado.");
        }
        
        if (user.role === "premium") {
            return res.status(400).send("El usuario ya es premium.");
        }

        user.role = "premium";
        await userService.updateUser(userId, { role: "premium" });

        return res.status(200).json(user);
    } catch (error) {
        console.error("Error al actualizar usuario a premium:", error);
        return res.status(500).send("Error interno del servidor al actualizar usuario a premium.");
    }
};


export const uploadUserDocuments = async (req, res) => {
    try {
        const userId = req.params.uid;
        const documents = req.files;
        const email = await userService.getUserById(userId).then((user) => user.email);
        
        if (!documents) {
            return res.status(400).send("No se adjuntaron archivos.");
        }

        const user = await userService.uploadUserDocuments(userId, documents);

        const mailer = new Mail
        mailer.sendPremiumRequest(email)

        return res.status(200).json(user);
    } catch (error) {
        console.error("Error al cargar documentos:", error);
        return res.status(500).send("Error interno del servidor al cargar documentos.");
    }

};

export const getUsersWithDocuments = async (req, res) => {
    try {
        const usersWithDocuments = await userService.getUsersWithDocuments();
        return res.status(200).json({ status: "success", payload: usersWithDocuments });
    } catch (error) {
        console.error("Error al obtener usuarios con documentos:", error);
        return res.status(500).json({ status: "fail", message: "Error interno del servidor al obtener usuarios con documentos." });
    }
}

export const changeUserRole = async (req, res) => {
    try {
        const { email, role } = req.query
        const user = await userService.getUserByEmail(email);
        if (!user) {
            return res.status(404).json({ status: "error", message: "User not found" });
        }

        const changes = { role: role }

        const roleUpdated = await userService.updateUser(user._id, changes);

        const mailer = new Mail
        mailer.sendRoleChangeConfirmation(email, role)

        return res.status(200).json({ status: "success", payload: roleUpdated })
    } catch (error) {
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
}

export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params
        const deletedUser = await userService.deleteUser(userId)
     
        return res.status(200).json({ status: "success", payload: deletedUser })
    } catch (error) {
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
}