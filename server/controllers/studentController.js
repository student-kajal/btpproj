import Group from '../models/Group.js';
import Project from '../models/Project.js';
import User from '../models/User.js';
import Session from '../models/Session.js';

export const getDashboard = async (req, res) => {
  try {
    const studentId = req.user._id;
    
    // Get student's group
    const myGroup = await Group.findOne({ 
      members: studentId,
      status: { $in: ['approved', 'active'] }
    })
    .populate('members', 'name email')
    .populate('professor', 'name email')
    .populate('project', 'title description status');

    // Get available professors
    const professors = await User.find({ 
      role: 'professor',
      isActive: true,
      session: req.user.session,
      semester: req.user.semester
    }).select('name email department');

    // Get session info
    const sessionInfo = await Session.findOne({ 
      sessionYear: req.user.session 
    });

    res.status(200).json({
      success: true,
      data: {
        myGroup,
        professors,
        sessionInfo,
        user: req.user
      }
    });
  } catch (error) {
    console.error('Student dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get dashboard data'
    });
  }
};

export const proposeGroup = async (req, res) => {
  try {
    const { groupName, memberEmails, professorId } = req.body;
    const studentId = req.user._id;

    // Check if student is already in a group
    const existingGroup = await Group.findOne({ 
      members: studentId,
      status: { $in: ['proposed', 'approved', 'active'] }
    });

    if (existingGroup) {
      return res.status(400).json({
        success: false,
        message: 'You are already part of a group'
      });
    }

    // Check if group name already exists
    const existingGroupName = await Group.findOne({ 
      groupName,
      session: req.user.session,
      semester: req.user.semester
    });

    if (existingGroupName) {
      return res.status(400).json({
        success: false,
        message: 'Group name already exists. Please choose a different name.'
      });
    }

    // Get member IDs from emails
    const members = await User.find({ 
      email: { $in: memberEmails },
      role: 'student',
      session: req.user.session,
      semester: req.user.semester
    });

    if (members.length !== memberEmails.length) {
      return res.status(400).json({
        success: false,
        message: 'Some members not found or not in same session/semester'
      });
    }

    // Add proposer to members if not included
    const memberIds = members.map(member => member._id);
    if (!memberIds.some(id => id.equals(studentId))) {
      memberIds.push(studentId);
    }

    // Check group size limits
    const sessionInfo = await Session.findOne({ 
      sessionYear: req.user.session 
    });
    
    if (sessionInfo) {
      if (memberIds.length < sessionInfo.minGroupSize || 
          memberIds.length > sessionInfo.maxGroupSize) {
        return res.status(400).json({
          success: false,
          message: `Group size must be between ${sessionInfo.minGroupSize} and ${sessionInfo.maxGroupSize} members`
        });
      }
    }

    // Create group
    const group = await Group.create({
      groupName,
      members: memberIds,
      professor: professorId,
      session: req.user.session,
      semester: req.user.semester,
      proposedBy: studentId,
      status: 'proposed'
    });

    const populatedGroup = await Group.findById(group._id)
      .populate('members', 'name email')
      .populate('professor', 'name email');

    res.status(201).json({
      success: true,
      message: 'Group proposed successfully',
      data: populatedGroup
    });
  } catch (error) {
    console.error('Propose group error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to propose group'
    });
  }
};

export const getAvailableGroups = async (req, res) => {
  try {
    const studentId = req.user._id;
    
    // Get groups that are looking for members (proposed status)
    const availableGroups = await Group.find({
      session: req.user.session,
      semester: req.user.semester,
      status: 'proposed',
      members: { $ne: studentId } // Not already a member
    })
    .populate('members', 'name email')
    .populate('professor', 'name email department')
    .populate('proposedBy', 'name email');

    res.status(200).json({
      success: true,
      data: availableGroups
    });
  } catch (error) {
    console.error('Get available groups error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get available groups'
    });
  }
};

export const joinGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const studentId = req.user._id;

    // Check if student is already in a group
    const existingGroup = await Group.findOne({ 
      members: studentId,
      status: { $in: ['proposed', 'approved', 'active'] }
    });

    if (existingGroup) {
      return res.status(400).json({
        success: false,
        message: 'You are already part of a group'
      });
    }

    const group = await Group.findById(groupId);
    if (!group || group.status !== 'proposed') {
      return res.status(404).json({
        success: false,
        message: 'Group not found or not available for joining'
      });
    }

    // Check group size limits
    const sessionInfo = await Session.findOne({ 
      sessionYear: req.user.session 
    });
    
    if (sessionInfo && group.members.length >= sessionInfo.maxGroupSize) {
      return res.status(400).json({
        success: false,
        message: 'Group is full'
      });
    }

    // Add student to group
    group.members.push(studentId);
    await group.save();

    const updatedGroup = await Group.findById(groupId)
      .populate('members', 'name email')
      .populate('professor', 'name email');

    res.status(200).json({
      success: true,
      message: 'Successfully joined group',
      data: updatedGroup
    });
  } catch (error) {
    console.error('Join group error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to join group'
    });
  }
};

export const getMyGroup = async (req, res) => {
  try {
    const studentId = req.user._id;
    
    const group = await Group.findOne({ 
      members: studentId
    })
    .populate('members', 'name email userId')
    .populate('professor', 'name email department')
    .populate('project', 'title description status technologies objectives');

    res.status(200).json({
      success: true,
      data: group
    });
  } catch (error) {
    console.error('Get my group error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get group information'
    });
  }
};

export const getMyProject = async (req, res) => {
  try {
    const studentId = req.user._id;
    
    const group = await Group.findOne({ 
      members: studentId,
      status: 'active'
    });

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'No active group found'
      });
    }

    const project = await Project.findOne({ group: group._id })
      .populate('group', 'groupName members')
      .populate('professor', 'name email');

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Get my project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get project information'
    });
  }
};
