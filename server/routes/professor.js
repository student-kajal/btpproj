// // import express from 'express';
// // import {
// //   getDashboard,
// //   getPendingGroups,
// //   getAllGroups,
// //   approveGroup,
// //   rejectGroup,
// //   editProject,
// //   addPublication,
// //   getPublications,
// //   updatePublication,
// //   deletePublication
// // } from '../controllers/professorController.js';
// // import { authenticate, authorize } from '../middleware/auth.js';

// // const router = express.Router();

// // // All professor routes require authentication and professor role
// // router.use(authenticate);
// // router.use(authorize('professor'));

// // // Dashboard
// // router.get('/dashboard', getDashboard);

// // // Group Management
// // router.get('/groups/pending', getPendingGroups);
// // router.get('/groups', getAllGroups);
// // router.put('/groups/:groupId/approve', approveGroup);
// // router.put('/groups/:groupId/reject', rejectGroup);
// // router.put('/groups/:groupId/project', editProject);

// // // Publication Management
// // router.post('/publications', addPublication);
// // router.get('/publications', getPublications);
// // router.put('/publications/:publicationId', updatePublication);
// // router.delete('/publications/:publicationId', deletePublication);

// // export default router;
// import express from 'express';
// import Group from '../models/Group.js';
// import Session from '../models/Session.js';
// import User from '../models/User.js';
// import Project from '../models/Project.js';
// import Publication from '../models/Publication.js';
// import { authenticate, authorize } from '../middleware/auth.js';

// const router = express.Router();

// // @route   GET /api/professor/dashboard/stats
// router.get('/dashboard/stats', authenticate, async (req, res) => {
//   try {
//     const professorId = req.user._id; // Note: using _id not id
    
//     const [totalGroups, pendingGroups, approvedGroups, rejectedGroups, totalPublications] = await Promise.all([
//       Group.countDocuments({ professor: professorId }),
//       Group.countDocuments({ professor: professorId, status: 'PROPOSED' }),
//       Group.countDocuments({ professor: professorId, status: 'APPROVED' }),
//       Group.countDocuments({ professor: professorId, status: 'REJECTED' }),
//       Publication.countDocuments({ professor: professorId })
//     ]);

//     res.json({
//       success: true,
//       stats: {
//         totalGroups,
//         pendingGroups,
//         approvedGroups,
//         rejectedGroups,
//         totalPublications
//       }
//     });
//   } catch (error) {
//     console.error('❌ Dashboard stats error:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Failed to fetch dashboard statistics',
//       error: error.message 
//     });
//   }
// });

// // @route   GET /api/professor/groups
// router.get('/groups', authenticate, async (req, res) => {
//   try {
//     const professorId = req.user._id;
//     const { status, sessionId } = req.query;
    
//     let query = { professor: professorId };
//     if (status) query.status = status.toUpperCase();
//     if (sessionId) query.session = sessionId;

//     const groups = await Group.find(query)
//       .populate('session', 'code semester module')
//       .populate('members', 'name email rollNumber phone')
//       .populate('professor', 'name email')
//       .sort({ createdAt: -1 })
//       .lean();

//     res.json({ 
//       success: true, 
//       groups
//     });
//   } catch (error) {
//     console.error('❌ Get groups error:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Failed to fetch groups',
//       error: error.message 
//     });
//   }
// });

// // @route   GET /api/professor/groups/:id
// router.get('/groups/:id', authenticate, async (req, res) => {
//   try {
//     const group = await Group.findOne({
//       _id: req.params.id,
//       professor: req.user._id
//     })
//       .populate('session')
//       .populate('members', 'name email rollNumber phone branch section')
//       .populate('professor', 'name email')
//       .lean();

//     if (!group) {
//       return res.status(404).json({ 
//         success: false, 
//         message: 'Group not found or access denied' 
//       });
//     }

//     const [project, publications] = await Promise.all([
//       Project.findOne({ group: group._id }).lean(),
//       Publication.find({ group: group._id })
//         .populate('students', 'name rollNumber')
//         .lean()
//     ]);

//     res.json({ 
//       success: true, 
//       group: {
//         ...group,
//         project,
//         publications
//       }
//     });
//   } catch (error) {
//     console.error('❌ Get group error:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Failed to fetch group details',
//       error: error.message 
//     });
//   }
// });

// // @route   POST /api/professor/groups/:id/approve
// router.post('/groups/:id/approve', authenticate, async (req, res) => {
//   try {
//     const { projectTitle } = req.body;
    
//     if (!projectTitle || projectTitle.trim().length < 5) {
//       return res.status(400).json({
//         success: false,
//         message: 'Project title must be at least 5 characters long'
//       });
//     }

//     const group = await Group.findOne({
//       _id: req.params.id,
//       professor: req.user._id,
//       status: 'PROPOSED'
//     }).populate('members', '_id name email');

//     if (!group) {
//       return res.status(404).json({ 
//         success: false, 
//         message: 'Group not found or already processed' 
//       });
//     }

//     group.status = 'APPROVED';
//     group.projectTitle = projectTitle.trim();
//     await group.save();

//     // Create project
//     const project = await Project.create({
//       session: group.session,
//       title: projectTitle.trim(),
//       professor: req.user._id,
//       group: group._id,
//       history: [{
//         title: projectTitle.trim(),
//         changedAt: new Date(),
//         changedBy: req.user._id
//       }]
//     });

//     // Socket notification
//     const io = req.app.get('io');
//     if (io && group.members) {
//       group.members.forEach(member => {
//         io.to(`user:${member._id}`).emit('group:approved', {
//           groupId: group._id,
//           groupName: group.name,
//           projectTitle: projectTitle.trim(),
//           timestamp: new Date()
//         });
//       });
//     }

//     res.json({ 
//       success: true, 
//       message: 'Group approved successfully',
//       group,
//       project
//     });
//   } catch (error) {
//     console.error('❌ Approve group error:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Failed to approve group',
//       error: error.message 
//     });
//   }
// });

// // @route   POST /api/professor/groups/:id/reject
// router.post('/groups/:id/reject', authenticate, async (req, res) => {
//   try {
//     const { reason } = req.body;
    
//     if (!reason || reason.trim().length < 10) {
//       return res.status(400).json({
//         success: false,
//         message: 'Rejection reason must be at least 10 characters'
//       });
//     }
    
//     const group = await Group.findOne({
//       _id: req.params.id,
//       professor: req.user._id,
//       status: 'PROPOSED'
//     }).populate('members', '_id name email');

//     if (!group) {
//       return res.status(404).json({ 
//         success: false, 
//         message: 'Group not found or already processed' 
//       });
//     }

//     group.status = 'REJECTED';
//     group.rejectionReason = reason.trim();
//     await group.save();

//     // Socket notification
//     const io = req.app.get('io');
//     if (io && group.members) {
//       group.members.forEach(member => {
//         io.to(`user:${member._id}`).emit('group:rejected', {
//           groupId: group._id,
//           groupName: group.name,
//           reason: reason.trim(),
//           timestamp: new Date()
//         });
//       });
//     }

//     res.json({ 
//       success: true, 
//       message: 'Group rejected',
//       group 
//     });
//   } catch (error) {
//     console.error('❌ Reject group error:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Failed to reject group',
//       error: error.message 
//     });
//   }
// });

// // @route   POST /api/professor/publications
// router.post('/publications', authenticate, async (req, res) => {
//   try {
//     const { sessionId, groupId, doi, title, url, studentIds } = req.body;

//     if (!title || !doi) {
//       return res.status(400).json({
//         success: false,
//         message: 'Title and DOI are required'
//       });
//     }

//     const group = await Group.findOne({
//       _id: groupId,
//       professor: req.user._id
//     });

//     if (!group) {
//       return res.status(404).json({
//         success: false,
//         message: 'Group not found or access denied'
//       });
//     }

//     const publication = await Publication.create({
//       session: sessionId,
//       group: groupId,
//       students: studentIds || [],
//       professor: req.user._id,
//       doi: doi.trim(),
//       title: title.trim(),
//       url: url?.trim()
//     });

//     const populated = await Publication.findById(publication._id)
//       .populate('students', 'name rollNumber')
//       .populate('group', 'name')
//       .populate('session', 'code semester');

//     res.status(201).json({ 
//       success: true, 
//       message: 'Publication added successfully',
//       publication: populated
//     });
//   } catch (error) {
//     console.error('❌ Add publication error:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Failed to add publication',
//       error: error.message 
//     });
//   }
// });

// // @route   GET /api/professor/publications
// router.get('/publications', authenticate, async (req, res) => {
//   try {
//     const publications = await Publication.find({ professor: req.user._id })
//       .populate('session', 'code semester')
//       .populate('group', 'name')
//       .populate('students', 'name rollNumber')
//       .sort({ createdAt: -1 })
//       .lean();

//     res.json({ 
//       success: true, 
//       publications 
//     });
//   } catch (error) {
//     console.error('❌ Get publications error:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Failed to fetch publications',
//       error: error.message 
//     });
//   }
// });

// // @route   DELETE /api/professor/publications/:id
// router.delete('/publications/:id', authenticate, async (req, res) => {
//   try {
//     const publication = await Publication.findOneAndDelete({
//       _id: req.params.id,
//       professor: req.user._id
//     });

//     if (!publication) {
//       return res.status(404).json({ 
//         success: false, 
//         message: 'Publication not found' 
//       });
//     }

//     res.json({ 
//       success: true, 
//       message: 'Publication deleted successfully' 
//     });
//   } catch (error) {
//     console.error('❌ Delete publication error:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Failed to delete publication',
//       error: error.message 
//     });
//   }
// });

// export default router;
import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import {
  getStats,
  getMyGroups,
  approveGroup,
  rejectGroup,
  assignProject,
  getMyProjects,
  addPublication,
  getPublications,
  deletePublication
} from '../controllers/professorController.js';

const router = express.Router();

// All routes require professor authentication
router.use(authenticate, authorize('professor'));

// Stats
router.get('/stats', getStats);

// Groups
router.get('/groups', getMyGroups);
router.put('/groups/:groupId/approve', approveGroup);
router.put('/groups/:groupId/reject', rejectGroup);

// Projects
router.get('/projects', getMyProjects);
router.post('/groups/:groupId/project', assignProject);
router.put('/projects/:projectId', assignProject);

// Publications
router.get('/publications', getPublications);
router.post('/publications', addPublication);
router.delete('/publications/:publicationId', deletePublication);

export default router;
