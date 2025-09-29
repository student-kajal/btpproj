import express from 'express';
import { 
  getDashboard,
  getPendingGroups,
  approveGroup,
  rejectGroup,
  getMyGroups,
  createProject,
  updateProject,
  addPublication
} from '../controllers/professorController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// All professor routes require authentication and professor role
router.use(authenticate);
router.use(authorize('professor'));

router.get('/dashboard', getDashboard);
router.get('/groups/pending', getPendingGroups);
router.get('/groups/my', getMyGroups);
router.put('/groups/:groupId/approve', approveGroup);
router.put('/groups/:groupId/reject', rejectGroup);
router.post('/projects', createProject);
router.put('/projects/:projectId', updateProject);
router.post('/publications', addPublication);

export default router;
