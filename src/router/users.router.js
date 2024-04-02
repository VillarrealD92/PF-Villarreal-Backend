import express from 'express';
import { uploader } from '../config/multer.config.js';
import { changeUserRole, deleteUser, deleteInactives, getUserByEmail, getUsers, updateUserToPremium, uploadUserDocuments, getUsersWithDocuments } from '../controllers/users.controller.js';

const router = express.Router();

router.get("/", getUsers)

router.delete("/", deleteInactives)

router.get("/user", getUserByEmail)

router.put("/user", changeUserRole)

router.delete("/deleteUser/:userId", deleteUser)

router.post('/:uid/premium', updateUserToPremium);

router.get("/usersWithDocuments", getUsersWithDocuments);

router.post('/:uid/documents', uploader.array('documents'), uploadUserDocuments);

export default router;