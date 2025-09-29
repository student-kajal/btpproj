import express from 'express';
import { 
  getDashboard,
  proposeGroup,
  getAvailableGroups,
  joinGroup,
  getMyGroup,
  getMyProject
} from '../controllers/studentController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// All student routes require authentication and student role
router.use(authenticate);
router.use(authorize('student'));

router.get('/dashboard', getDashboard);
router.post('/groups/propose', proposeGroup);
router.get('/groups/available', getAvailableGroups);
router.post('/groups/:groupId/join', joinGroup);
router.get('/groups/my', getMyGroup);
router.get('/projects/my', getMyProject);

export default router;
