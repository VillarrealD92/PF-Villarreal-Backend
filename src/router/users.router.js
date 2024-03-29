import express from 'express';
import { uploader } from '../config/multer.config.js';
import { updateUserToPremium, uploadUserDocuments } from '../controllers/users.controller.js';

const router = express.Router();

router.post('/:uid/premium', updateUserToPremium);

router.post('/:uid/documents', uploader.array('documents'), uploadUserDocuments);

export default router;