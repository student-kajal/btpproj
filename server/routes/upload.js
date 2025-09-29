import express from 'express';
import { uploadFile, getFiles } from '../controllers/uploadController.js';
import { authenticate } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.use(authenticate);

router.post('/', upload.single('file'), uploadFile);
router.get('/', getFiles);

export default router;
