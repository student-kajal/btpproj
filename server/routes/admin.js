import express from 'express';
import { 
  getDashboard, 
  uploadStudents, 
  uploadFaculty, 
  createSession,
  getAllUsers 
} from '../controllers/adminController.js';
import { authenticate, authorize, adminOnly } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(authorize('admin'));
router.use(adminOnly);

router.get('/dashboard', getDashboard);
router.post('/upload/students', upload.single('file'), uploadStudents);
router.post('/upload/faculty', upload.single('file'), uploadFaculty);
router.post('/sessions', createSession);
router.get('/users', getAllUsers);

export default router;
