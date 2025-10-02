import User from '../models/User.js';
import Group from '../models/Group.js';
import Project from '../models/Project.js';
import Session from '../models/Session.js';
import { ExcelService } from '../services/excelService.js';

export const getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalProfessors = await User.countDocuments({ role: 'professor' });
    const totalGroups = await Group.countDocuments();
    const activeGroups = await Group.countDocuments({ status: 'active' });
    const totalProjects = await Project.countDocuments();

    // Recent activities
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email role createdAt');

    const recentGroups = await Group.find()
      .populate('members', 'name')
      .populate('professor', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalStudents,
          totalProfessors,
          totalGroups,
          activeGroups,
          totalProjects
        },
        recent: {
          users: recentUsers,
          groups: recentGroups
        }
      }
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get dashboard data'
    });
  }
};

export const uploadStudents = async (req, res) => {
  try {
    const { session, semester } = req.body;
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    if (!session || !semester) {
      return res.status(400).json({
        success: false,
        message: 'Session and semester are required'
      });
    }

    const results = await ExcelService.processStudentExcel(
      req.file.buffer, 
      session, 
      semester
    );

    res.status(200).json({
      success: true,
      message: 'Students uploaded successfully',
      data: results
    });
  } catch (error) {
    console.error('Upload students error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload students'
    });
  }
};

export const uploadFaculty = async (req, res) => {
  try {
    const { session, semester } = req.body;
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    if (!session || !semester) {
      return res.status(400).json({
        success: false,
        message: 'Session and semester are required'
      });
    }

    const results = await ExcelService.processFacultyExcel(
      req.file.buffer, 
      session, 
      semester
    );

    res.status(200).json({
      success: true,
      message: 'Faculty uploaded successfully',
      data: results
    });
  } catch (error) {
    console.error('Upload faculty error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload faculty'
    });
  }
};

export const createSession = async (req, res) => {
  try {
    const { sessionYear, semester, minGroupSize, maxGroupSize, startDate, endDate } = req.body;

    const session = await Session.create({
      sessionYear,
      semester,
      minGroupSize,
      maxGroupSize,
      startDate,
      endDate
    });

    res.status(201).json({
      success: true,
      message: 'Session created successfully',
      data: session
    });
  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create session'
    });
  }
};
// Add this function at the end of adminController.js file

export const createAdminUser = async () => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (!adminExists) {
      await User.create({
        userId: 'ADMIN001',
        name: 'System Administrator',
        email: 'admin@nsut.ac.in',
        password: 'admin@123',
        mobile: '9999999999',
        role: 'admin',
        session: '2024-25',
        semester: 'odd',
        isActive: true
      });
      console.log('✅ Admin user created');
    }
  } catch (error) {
    console.error('❌ Admin user creation failed:', error);
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    
    const query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        users,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get users'
    });
  }
};
export const getAnalytics = async (req, res) => {
  try {
    const { session = '2024-25', semester = 'odd', page = 1, limit = 50, sortBy = 'userId' } = req.query;

    // Get all users data for stats
    const allUsers = await User.find({ session, semester }).select('-password');
    const students = allUsers.filter(u => u.role === 'student');
    const professors = allUsers.filter(u => u.role === 'professor');

    // Department-wise distribution
    const departmentStats = {};
    allUsers.forEach(user => {
      if (user.department) {
        departmentStats[user.department] = departmentStats[user.department] || { students: 0, professors: 0 };
        departmentStats[user.department][user.role === 'student' ? 'students' : 'professors']++;
      }
    });

    // Category-wise distribution (for students)
    const categoryStats = {};
    students.forEach(student => {
      if (student.category) {
        categoryStats[student.category] = (categoryStats[student.category] || 0) + 1;
      }
    });

    // Recent uploads (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentStudents = await User.find({
      role: 'student',
      createdAt: { $gte: thirtyDaysAgo }
    }).sort({ createdAt: -1 }).limit(10);

    const recentProfessors = await User.find({
      role: 'professor',
      createdAt: { $gte: thirtyDaysAgo }
    }).sort({ createdAt: -1 }).limit(10);

    // ✅ PROPER SORTING - Roll Number Ascending Order
    const skip = (page - 1) * limit;
    let sortQuery = {};
    
    if (sortBy === 'userId') {
      // Sort by userId (roll number) in ascending order
      sortQuery = { userId: 1 };
    } else if (sortBy === 'name') {
      sortQuery = { name: 1 };
    } else {
      sortQuery = { createdAt: -1 }; // Default: newest first
    }

    const paginatedUsers = await User.find({ session, semester })
      .select('-password')
      .sort(sortQuery) // ✅ PROPER SORTING
      .skip(skip)
      .limit(parseInt(limit));

    const totalUsers = allUsers.length;
    const totalPages = Math.ceil(totalUsers / limit);

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers: allUsers.length,
          totalStudents: students.length,
          totalProfessors: professors.length,
          session,
          semester
        },
        departmentStats,
        categoryStats,
        recentUploads: {
          students: recentStudents,
          professors: recentProfessors
        },
        users: paginatedUsers, // ✅ Now properly sorted
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalUsers,
          limit: parseInt(limit),
          hasNext: page < totalPages,
          hasPrev: page > 1
        },
        sortBy // Return current sort option
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
