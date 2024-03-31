import express from 'express';
import { uploader } from '../config/multer.config.js';
import { deleteInactives, getUserByEmail, getUsers, updateUserToPremium, uploadUserDocuments } from '../controllers/users.controller.js';

const router = express.Router();

router.get("/", getUsers)

router.delete("/", deleteInactives)

router.get("/user", getUserByEmail)

router.post('/:uid/premium', updateUserToPremium);

router.post('/:uid/documents', uploader.array('documents'), uploadUserDocuments);

export default router;