// import User from '../models/User.js';
// import Group from '../models/Group.js';
// import Publication from '../models/Publication.js';

// // Professor Dashboard
// export const getDashboard = async (req, res) => {
//   try {
//     const professorId = req.user.id;
//     const currentSession = '2024-25'; // Get from session or query
//     const currentSemester = 'odd';

//     // Get professor's groups
//     const totalGroups = await Group.countDocuments({ 
//       professor: professorId, 
//       session: currentSession, 
//       semester: currentSemester 
//     });
    
//     const pendingGroups = await Group.countDocuments({ 
//       professor: professorId, 
//       status: 'pending',
//       session: currentSession, 
//       semester: currentSemester 
//     });
    
//     const approvedGroups = await Group.countDocuments({ 
//       professor: professorId, 
//       status: 'approved',
//       session: currentSession, 
//       semester: currentSemester 
//     });

//     // Get professor's publications
//     const totalPublications = await Publication.countDocuments({ 
//       professor: professorId,
//       session: currentSession, 
//       semester: currentSemester 
//     });

//     // Recent activity
//     const recentGroups = await Group.find({ 
//       professor: professorId,
//       session: currentSession, 
//       semester: currentSemester 
//     })
//     .populate('members', 'name email userId')
//     .sort({ updatedAt: -1 })
//     .limit(5);

//     const recentPublications = await Publication.find({ 
//       professor: professorId,
//       session: currentSession, 
//       semester: currentSemester 
//     })
//     .populate('group', 'groupName')
//     .sort({ createdAt: -1 })
//     .limit(3);

//     res.json({
//       success: true,
//       data: {
//         stats: {
//           totalGroups,
//           pendingGroups,
//           approvedGroups,
//           totalPublications
//         },
//         recent: {
//           groups: recentGroups,
//           publications: recentPublications
//         },
//         professor: {
//           name: req.user.name,
//           email: req.user.email,
//           department: req.user.department
//         }
//       }
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // Get Pending Groups for Approval
// export const getPendingGroups = async (req, res) => {
//   try {
//     const professorId = req.user.id;
//     const { session = '2024-25', semester = 'odd' } = req.query;

//     const pendingGroups = await Group.find({
//       professor: professorId,
//       status: 'pending',
//       session,
//       semester
//     })
//     .populate('members', 'name email userId department')
//     .sort({ proposedAt: 1 }); // Oldest first

//     res.json({
//       success: true,
//       data: { groups: pendingGroups }
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // Get All Groups (Approved/Rejected)
// export const getAllGroups = async (req, res) => {
//   try {
//     const professorId = req.user.id;
//     const { session = '2024-25', semester = 'odd', status = 'all' } = req.query;

//     let filter = {
//       professor: professorId,
//       session,
//       semester
//     };

//     if (status !== 'all') {
//       filter.status = status;
//     }

//     const groups = await Group.find(filter)
//       .populate('members', 'name email userId department')
//       .sort({ updatedAt: -1 });

//     res.json({
//       success: true,
//       data: { groups }
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // Approve Group
// export const approveGroup = async (req, res) => {
//   try {
//     const { groupId } = req.params;
//     const { projectTitle, projectDescription } = req.body;
//     const professorId = req.user.id;

//     // Verify group belongs to professor
//     const group = await Group.findOne({
//       _id: groupId,
//       professor: professorId,
//       status: 'pending'
//     });

//     if (!group) {
//       return res.status(404).json({
//         success: false,
//         message: 'Group not found or already processed'
//       });
//     }

//     // Update group
//     group.status = 'approved';
//     group.projectTitle = projectTitle || '';
//     group.projectDescription = projectDescription || '';
//     group.approvedAt = new Date();
//     await group.save();

//     // Populate for response
//     await group.populate('members', 'name email userId');

//     res.json({
//       success: true,
//       message: 'Group approved successfully',
//       data: { group }
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // Reject Group
// export const rejectGroup = async (req, res) => {
//   try {
//     const { groupId } = req.params;
//     const { reason } = req.body;
//     const professorId = req.user.id;

//     // Verify group belongs to professor
//     const group = await Group.findOne({
//       _id: groupId,
//       professor: professorId,
//       status: 'pending'
//     });

//     if (!group) {
//       return res.status(404).json({
//         success: false,
//         message: 'Group not found or already processed'
//       });
//     }

//     // Update group
//     group.status = 'rejected';
//     group.rejectionReason = reason || 'No reason provided';
//     group.rejectedAt = new Date();
//     await group.save();

//     // Populate for response
//     await group.populate('members', 'name email userId');

//     res.json({
//       success: true,
//       message: 'Group rejected successfully',
//       data: { group }
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // Edit Project Details
// export const editProject = async (req, res) => {
//   try {
//     const { groupId } = req.params;
//     const { projectTitle, projectDescription } = req.body;
//     const professorId = req.user.id;

//     const group = await Group.findOne({
//       _id: groupId,
//       professor: professorId
//     });

//     if (!group) {
//       return res.status(404).json({
//         success: false,
//         message: 'Group not found'
//       });
//     }

//     group.projectTitle = projectTitle;
//     group.projectDescription = projectDescription;
//     await group.save();

//     await group.populate('members', 'name email userId');

//     res.json({
//       success: true,
//       message: 'Project updated successfully',
//       data: { group }
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // Add Publication
// export const addPublication = async (req, res) => {
//   try {
//     const professorId = req.user.id;
//     const {
//       doi,
//       title,
//       authors,
//       journal,
//       year,
//       volume,
//       issue,
//       pages,
//       publishedDate,
//       groupId,
//       session = '2024-25',
//       semester = 'odd'
//     } = req.body;

//     // Check if DOI already exists
//     const existingPublication = await Publication.findOne({ doi });
//     if (existingPublication) {
//       return res.status(400).json({
//         success: false,
//         message: 'Publication with this DOI already exists'
//       });
//     }

//     // Verify group belongs to professor (if groupId provided)
//     let group = null;
//     if (groupId) {
//       group = await Group.findOne({
//         _id: groupId,
//         professor: professorId
//       });
      
//       if (!group) {
//         return res.status(400).json({
//           success: false,
//           message: 'Group not found or not assigned to you'
//         });
//       }
//     }

//     const publication = await Publication.create({
//       doi,
//       title,
//       authors: Array.isArray(authors) ? authors : [authors],
//       journal,
//       year: parseInt(year),
//       volume,
//       issue,
//       pages,
//       publishedDate: publishedDate ? new Date(publishedDate) : undefined,
//       group: groupId || null,
//       professor: professorId,
//       session,
//       semester
//     });

//     // Populate for response
//     await publication.populate('group', 'groupName members');

//     res.status(201).json({
//       success: true,
//       message: 'Publication added successfully',
//       data: { publication }
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // Get Publications
// export const getPublications = async (req, res) => {
//   try {
//     const professorId = req.user.id;
//     const { session = '2024-25', semester = 'odd' } = req.query;

//     const publications = await Publication.find({
//       professor: professorId,
//       session,
//       semester,
//       isActive: true
//     })
//     .populate('group', 'groupName members')
//     .sort({ createdAt: -1 });

//     res.json({
//       success: true,
//       data: { publications }
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // Update Publication
// export const updatePublication = async (req, res) => {
//   try {
//     const { publicationId } = req.params;
//     const professorId = req.user.id;
//     const updateData = req.body;

//     const publication = await Publication.findOne({
//       _id: publicationId,
//       professor: professorId
//     });

//     if (!publication) {
//       return res.status(404).json({
//         success: false,
//         message: 'Publication not found'
//       });
//     }

//     // Update fields
//     Object.keys(updateData).forEach(key => {
//       if (key !== '_id' && key !== 'professor') {
//         publication[key] = updateData[key];
//       }
//     });

//     await publication.save();
//     await publication.populate('group', 'groupName members');

//     res.json({
//       success: true,
//       message: 'Publication updated successfully',
//       data: { publication }
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // Delete Publication
// export const deletePublication = async (req, res) => {
//   try {
//     const { publicationId } = req.params;
//     const professorId = req.user.id;

//     const publication = await Publication.findOne({
//       _id: publicationId,
//       professor: professorId
//     });

//     if (!publication) {
//       return res.status(404).json({
//         success: false,
//         message: 'Publication not found'
//       });
//     }

//     // Soft delete
//     publication.isActive = false;
//     await publication.save();

//     res.json({
//       success: true,
//       message: 'Publication deleted successfully'
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };
import Group from '../models/Group.js';
import Project from '../models/Project.js';
import Publication from '../models/Publication.js';
import User from '../models/User.js';

// Get professor dashboard stats
export const getStats = async (req, res) => {
  try {
    const professorId = req.user._id;
    
    const totalGroups = await Group.countDocuments({ professor: professorId });
    const pendingGroups = await Group.countDocuments({ professor: professorId, status: 'pending' });
    const approvedGroups = await Group.countDocuments({ professor: professorId, status: 'approved' });
    const activeProjects = await Project.countDocuments({ professor: professorId });
    
    const groups = await Group.find({ professor: professorId }).populate('members', 'name userId');
    const totalStudents = groups.reduce((sum, group) => sum + (group.members?.length || 0), 0);

    res.json({
      success: true,
      data: {
        totalGroups,
        pendingGroups,
        approvedGroups,
        activeProjects,
        totalStudents
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all groups assigned to professor
export const getMyGroups = async (req, res) => {
  try {
    const { session, semester, status } = req.query;
    const professorId = req.user._id;
    
    const query = { professor: professorId };
    if (session) query.session = session;
    if (semester) query.semester = semester;
    if (status) query.status = status;

    const groups = await Group.find(query)
      .populate('members', 'name email userId department')
      .populate('project', 'title description')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: groups });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Approve a group
export const approveGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const professorId = req.user._id;

    const group = await Group.findOne({ _id: groupId, professor: professorId });
    
    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    if (group.status === 'approved') {
      return res.status(400).json({ success: false, message: 'Group already approved' });
    }

    group.status = 'approved';
    group.approvedAt = new Date();
    await group.save();

    res.json({ success: true, message: 'Group approved successfully', data: group });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reject a group
export const rejectGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { reason } = req.body;
    const professorId = req.user._id;

    const group = await Group.findOne({ _id: groupId, professor: professorId });
    
    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    group.status = 'rejected';
    group.rejectionReason = reason || 'Group requirements not met';
    await group.save();

    res.json({ success: true, message: 'Group rejected', data: group });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Assign/Edit project title for a group
export const assignProject = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { title, description } = req.body;
    const professorId = req.user._id;

    const group = await Group.findOne({ _id: groupId, professor: professorId });
    
    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    let project;
    
    if (group.project) {
      // Update existing project
      project = await Project.findByIdAndUpdate(
        group.project,
        { title, description },
        { new: true }
      );
    } else {
      // Create new project
      project = await Project.create({
        title,
        description,
        group: groupId,
        professor: professorId,
        session: group.session,
        semester: group.semester
      });
      
      group.project = project._id;
      await group.save();
    }

    res.json({ success: true, message: 'Project assigned successfully', data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all projects
export const getMyProjects = async (req, res) => {
  try {
    const { session, semester } = req.query;
    const professorId = req.user._id;
    
    const query = { professor: professorId };
    if (session) query.session = session;
    if (semester) query.semester = semester;

    const projects = await Project.find(query)
      .populate('group', 'name members')
      .populate({
        path: 'group',
        populate: { path: 'members', select: 'name email userId' }
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add publication
export const addPublication = async (req, res) => {
  try {
    const { title, doi, authors, publishedIn, publicationDate, url, groupId, projectId } = req.body;
    const professorId = req.user._id;

    const group = await Group.findOne({ _id: groupId, professor: professorId });
    
    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    const publication = await Publication.create({
      title,
      doi,
      authors,
      publishedIn,
      publicationDate,
      url,
      group: groupId,
      project: projectId || group.project,
      professor: professorId,
      session: group.session,
      semester: group.semester
    });

    res.status(201).json({ success: true, message: 'Publication added', data: publication });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get publications
export const getPublications = async (req, res) => {
  try {
    const { groupId, session, semester } = req.query;
    const professorId = req.user._id;
    
    const query = { professor: professorId };
    if (groupId) query.group = groupId;
    if (session) query.session = session;
    if (semester) query.semester = semester;

    const publications = await Publication.find(query)
      .populate('group', 'name')
      .populate('project', 'title')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: publications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete publication
export const deletePublication = async (req, res) => {
  try {
    const { publicationId } = req.params;
    const professorId = req.user._id;

    const publication = await Publication.findOneAndDelete({
      _id: publicationId,
      professor: professorId
    });

    if (!publication) {
      return res.status(404).json({ success: false, message: 'Publication not found' });
    }

    res.json({ success: true, message: 'Publication deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
