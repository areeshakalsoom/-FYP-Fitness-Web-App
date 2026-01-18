const User = require('../models/User');
const Profile = require('../models/Profile');
const Activity = require('../models/Activity');
const WorkoutPlan = require('../models/WorkoutPlan');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const { role, isActive } = req.query;

    let query = {};
    if (role) query.role = role;
    if (isActive !== undefined && isActive !== '') query.isActive = isActive === 'true';

    const users = await User.find(query)
      .select('-password')
      .populate('profile')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all experts (trainers, doctors, dietitians)
// @route   GET /api/experts
// @access  Private (Any authenticated user)
exports.getExperts = async (req, res) => {
  try {
    const experts = await User.find({
      role: { $in: ['trainer', 'doctor', 'dietitian'] },
      isActive: true
    })
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: experts.length,
      data: experts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create new user (Admin only)
// @route   POST /api/admin/users
// @access  Private (Admin only)
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user',
    });

    // Create empty profile for user
    const profile = await Profile.create({
      user: user._id,
    });

    // Update user with profile reference
    await User.findByIdAndUpdate(user._id, { profile: profile._id });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single user
// @route   GET /api/admin/users/:id
// @access  Private (Admin only)
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('profile');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Activate/Deactivate user account
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin only)
exports.updateUserStatus = async (req, res) => {
  try {
    const { isActive } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Prevent admin from deactivating themselves
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot change your own account status',
      });
    }

    user.isActive = isActive;
    await user.save();

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin only)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account',
      });
    }

    await User.findByIdAndDelete(req.params.id);

    // Also delete associated profile
    await Profile.findOneAndDelete({ user: req.params.id });

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get system statistics
// @route   GET /api/admin/stats
// @access  Private (Admin only)
exports.getSystemStats = async (req, res) => {
  try {
    // Count users by role
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalTrainers = await User.countDocuments({ role: 'trainer' });
    const totalDoctors = await User.countDocuments({ role: 'doctor' });
    const totalDietitians = await User.countDocuments({ role: 'dietitian' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const activeUsers = await User.countDocuments({
      role: 'user',
      isActive: true,
    });

    // Count activities
    const totalActivities = await Activity.countDocuments();
    const totalWorkoutPlans = await WorkoutPlan.countDocuments({
      isActive: true,
    });

    // Recent activities (last 7 days)
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const recentActivities = await Activity.countDocuments({
      createdAt: { $gte: last7Days },
    });

    // Recent registrations
    const recentRegistrations = await User.countDocuments({
      createdAt: { $gte: last7Days },
    });

    // System Health Status
    const dbStatus = require('mongoose').connection.readyState === 1; // 1 = connected
    const uptime = process.uptime();
    
    // Comprehensive Data Registry Count
    const totalRecords = await Promise.all([
      User.countDocuments(),
      Activity.countDocuments(),
      WorkoutPlan.countDocuments(),
      require('../models/MedicalRecord').countDocuments(),
      require('../models/DietPlan').countDocuments(),
      require('../models/Feedback').countDocuments(),
      require('../models/Goal').countDocuments(),
      require('../models/Meal').countDocuments(),
      require('../models/Message').countDocuments(),
      require('../models/Notification').countDocuments(),
      require('../models/WeightLog').countDocuments()
    ]).then(counts => counts.reduce((a, b) => a + b, 0));

    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          active: activeUsers,
          inactive: totalUsers - activeUsers,
        },
        trainers: totalTrainers,
        doctors: totalDoctors,
        dietitians: totalDietitians,
        admins: totalAdmins,
        activities: {
          total: totalActivities,
          last7Days: recentActivities,
        },
        workoutPlans: totalWorkoutPlans,
        recentRegistrations,
        system: {
          dbAlive: dbStatus,
          uptime: Math.floor(uptime),
          serverTime: new Date().toLocaleTimeString(),
          totalRecords,
          apiVersion: '1.0.5 Oracle'
        }
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
