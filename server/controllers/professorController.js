import Group from '../models/Group.js';
import Project from '../models/Project.js';
import Publication from '../models/Publication.js';
import User from '../models/User.js';

export const getDashboard = async (req, res) => {
  try {
    const professorId = req.user._id;
    
    const totalGroups = await Group.countDocuments({ professor: professorId });
    const activeGroups = await Group.countDocuments({ professor: professorId, status: 'active' });
    const pendingGroups = await Group.countDocuments({ professor: professorId, status: 'proposed' });
    const totalProjects = await Project.countDocuments({ professor: professorId });
    const totalPublications = await Publication.countDocuments({ professor: professorId });

    // Recent groups
    const recentGroups = await Group.find({ professor: professorId })
      .populate('members', 'name email')
      .populate('proposedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalGroups,
          activeGroups,
          pendingGroups,
          totalProjects,
          totalPublications
        },
        recentGroups
      }
    });
  } catch (error) {
    console.error('Professor dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get dashboard data'
    });
  }
};

export const getPendingGroups = async (req, res) => {
  try {
    const professorId = req.user._id;
    
    const pendingGroups = await Group.find({ 
      professor: professorId, 
      status: 'proposed' 
    })
    .populate('members', 'name email userId')
    .populate('proposedBy', 'name email')
    .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: pendingGroups
    });
  } catch (error) {
    console.error('Get pending groups error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get pending groups'
    });
  }
};

export const approveGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { projectTitle, projectDescription } = req.body;
    const professorId = req.user._id;

    const group = await Group.findOne({ 
      _id: groupId, 
      professor: professorId,
      status: 'proposed'
    });

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found or already processed'
      });
    }

    // Update group status
    group.status = 'approved';
    group.approvedAt = new Date();
    await group.save();

    // Create project
    const project = await Project.create({
      title: projectTitle,
      description: projectDescription,
      group: group._id,
      professor: professorId,
      session: group.session,
      semester: group.semester
    });

    // Update group with project reference
    group.project = project._id;
    group.status = 'active';
    await group.save();

    res.status(200).json({
      success: true,
      message: 'Group approved and project created successfully',
      data: { group, project }
    });
  } catch (error) {
    console.error('Approve group error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve group'
    });
  }
};

export const rejectGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { reason } = req.body;
    const professorId = req.user._id;

    const group = await Group.findOneAndUpdate(
      { 
        _id: groupId, 
        professor: professorId,
        status: 'proposed'
      },
      { 
        status: 'rejected',
        rejectionReason: reason
      },
      { new: true }
    );

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found or already processed'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Group rejected successfully',
      data: group
    });
  } catch (error) {
    console.error('Reject group error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject group'
    });
  }
};

export const getMyGroups = async (req, res) => {
  try {
    const professorId = req.user._id;
    
    const groups = await Group.find({ professor: professorId })
      .populate('members', 'name email userId')
      .populate('project', 'title description status')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: groups
    });
  } catch (error) {
    console.error('Get my groups error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get groups'
    });
  }
};

export const createProject = async (req, res) => {
  try {
    const { title, description, groupId, technologies, objectives } = req.body;
    const professorId = req.user._id;

    const group = await Group.findOne({ 
      _id: groupId, 
      professor: professorId 
    });

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }

    const project = await Project.create({
      title,
      description,
      group: groupId,
      professor: professorId,
      session: group.session,
      semester: group.semester,
      technologies: technologies || [],
      objectives: objectives || []
    });

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create project'
    });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const professorId = req.user._id;
    const updateData = req.body;

    const project = await Project.findOneAndUpdate(
      { _id: projectId, professor: professorId },
      updateData,
      { new: true }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: project
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update project'
    });
  }
};

export const addPublication = async (req, res) => {
  try {
    const { 
      title, 
      authors, 
      journal, 
      conference, 
      doi, 
      publishedDate, 
      type, 
      status,
      groupId 
    } = req.body;
    
    const professorId = req.user._id;

    const publication = await Publication.create({
      title,
      authors,
      journal,
      conference,
      doi,
      publishedDate,
      type,
      status,
      professor: professorId,
      group: groupId,
      session: req.user.session,
      semester: req.user.semester
    });

    res.status(201).json({
      success: true,
      message: 'Publication added successfully',
      data: publication
    });
  } catch (error) {
    console.error('Add publication error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add publication'
    });
  }
};
