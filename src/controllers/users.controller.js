import { userService } from '../repositories/index.repositories.js';

export const updateUserToPremium = async (req, res) => {
    try {
        const userId = req.params.uid;
        const user = await userService.getUserById(userId);

        // Verificar si el usuario existe
        if (!user) {
            return res.status(404).send("Usuario no encontrado.");
        }

        // Verificar si el usuario ya es premium
        if (user.role === "premium") {
            return res.status(400).send("El usuario ya es premium.");
        }

        // Actualizar el rol del usuario a premium
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

        // Verificar si req.files está definido y no es null
        if (!documents) {
            return res.status(400).send("No se adjuntaron archivos.");
        }

        console.log("Archivos adjuntos:", documents); // Agregamos un console.log para verificar los archivos adjuntos

        // Resto del código para procesar los documentos...
        const user = await userService.uploadUserDocuments(userId, documents);

        return res.status(200).json(user);
    } catch (error) {
        console.error("Error al cargar documentos:", error);
        return res.status(500).send("Error interno del servidor al cargar documentos.");
    }
};
