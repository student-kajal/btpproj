import express from 'express';
import {
  getDashboard,
  getPendingGroups,
  getAllGroups,
  approveGroup,
  rejectGroup,
  editProject,
  addPublication,
  getPublications,
  updatePublication,
  deletePublication
} from '../controllers/professorController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// All professor routes require authentication and professor role
router.use(authenticate);
router.use(authorize('professor'));

// Dashboard
router.get('/dashboard', getDashboard);

// Group Management
router.get('/groups/pending', getPendingGroups);
router.get('/groups', getAllGroups);
router.put('/groups/:groupId/approve', approveGroup);
router.put('/groups/:groupId/reject', rejectGroup);
router.put('/groups/:groupId/project', editProject);

// Publication Management
router.post('/publications', addPublication);
router.get('/publications', getPublications);
router.put('/publications/:publicationId', updatePublication);
router.delete('/publications/:publicationId', deletePublication);

export default router;
