import express from 'express';
import { 
  getDashboard, 
  uploadStudents, 
  uploadFaculty, 
  createSession,
  getAllUsers ,
    getAnalytics       // <-- ADD THIS
 
} from '../controllers/adminController.js';
import { authenticate, authorize, adminOnly } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import Session from '../models/Session.js';
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
router.get('/analytics', getAnalytics);           // <-- ADD THIS
//uter.get('/users-detailed', getAllUsersDetailed); // <-- ADD THIS

// Get all sessions
router.get('/sessions', async (req, res) => {
  try {
    const sessions = await Session.find().sort({ createdAt: -1 });
    res.json({ success: true, data: { sessions } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete session
router.delete('/sessions/:id', async (req, res) => {
  try {
    await Session.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Session deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update session
router.patch('/sessions/:id', async (req, res) => {
  try {
    const session = await Session.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: { session } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
