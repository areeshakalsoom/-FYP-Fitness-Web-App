const WorkoutPlan = require('../models/WorkoutPlan');
const User = require('../models/User');
const { createNotification } = require('../utils/notificationTrigger');

// @desc    Get all workout plans (trainer's own or assigned to user)
// @route   GET /api/workout-plans
// @access  Private
exports.getWorkoutPlans = async (req, res) => {
  try {
    let query;

    if (req.user.role === 'trainer') {
      // Trainers see their own plans
      query = { trainer: req.user.id, isActive: true };
    } else {
      // Users see plans assigned to them
      query = { assignedUsers: req.user.id, isActive: true };
    }

    const workoutPlans = await WorkoutPlan.find(query)
      .populate('trainer', 'name email')
      .populate('assignedUsers', 'name email');

    res.status(200).json({
      success: true,
      count: workoutPlans.length,
      data: workoutPlans,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single workout plan
// @route   GET /api/workout-plans/:id
// @access  Private
exports.getWorkoutPlan = async (req, res) => {
  try {
    const workoutPlan = await WorkoutPlan.findById(req.params.id)
      .populate('trainer', 'name email')
      .populate('assignedUsers', 'name email');

    if (!workoutPlan) {
      return res.status(404).json({
        success: false,
        message: 'Workout plan not found',
      });
    }

    // Check authorization
    const isTrainer = workoutPlan.trainer._id.toString() === req.user.id;
    const isAssigned = workoutPlan.assignedUsers.some(
      (user) => user._id.toString() === req.user.id
    );

    if (!isTrainer && !isAssigned && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to view this workout plan',
      });
    }

    res.status(200).json({
      success: true,
      data: workoutPlan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create workout plan
// @route   POST /api/workout-plans
// @access  Private (Trainer only)
exports.createWorkoutPlan = async (req, res) => {
  try {
    const { title, description, exercises, difficulty, duration } = req.body;

    const workoutPlan = await WorkoutPlan.create({
      trainer: req.user.id,
      title,
      description,
      exercises,
      difficulty,
      duration,
    });

    res.status(201).json({
      success: true,
      data: workoutPlan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update workout plan
// @route   PUT /api/workout-plans/:id
// @access  Private (Trainer only)
exports.updateWorkoutPlan = async (req, res) => {
  try {
    let workoutPlan = await WorkoutPlan.findById(req.params.id);

    if (!workoutPlan) {
      return res.status(404).json({
        success: false,
        message: 'Workout plan not found',
      });
    }

    // Make sure trainer owns workout plan
    if (workoutPlan.trainer.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this workout plan',
      });
    }

    workoutPlan = await WorkoutPlan.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      data: workoutPlan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Assign workout plan to users
// @route   POST /api/workout-plans/:id/assign
// @access  Private (Trainer only)
exports.assignWorkoutPlan = async (req, res) => {
  try {
    const { userIds } = req.body;

    const workoutPlan = await WorkoutPlan.findById(req.params.id);

    if (!workoutPlan) {
      return res.status(404).json({
        success: false,
        message: 'Workout plan not found',
      });
    }

    // Make sure trainer owns workout plan
    if (workoutPlan.trainer.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to assign this workout plan',
      });
    }

    // Verify all users exist and have 'user' role
    const users = await User.find({
      _id: { $in: userIds },
      role: 'user',
    });

    if (users.length !== userIds.length) {
      return res.status(400).json({
        success: false,
        message: 'One or more user IDs are invalid',
      });
    }

    // Add users to assigned list (avoid duplicates)
    for (const userId of userIds) {
      if (!workoutPlan.assignedUsers.includes(userId)) {
        workoutPlan.assignedUsers.push(userId);
        // Trigger notification
        await createNotification(
          userId,
          `New workout plan assigned: ${workoutPlan.title}`,
          'reminder'
        );
      }
    }

    await workoutPlan.save();

    const updatedPlan = await WorkoutPlan.findById(req.params.id)
      .populate('trainer', 'name email')
      .populate('assignedUsers', 'name email');

    res.status(200).json({
      success: true,
      data: updatedPlan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get activities for all users assigned to this trainer's plans
// @route   GET /api/workout-plans/team-activities
// @access  Private (Trainer only)
exports.getTeamActivities = async (req, res) => {
  try {
    const Activity = require('../models/Activity');
    
    // 1. Get all users assigned to this trainer's plans
    const plans = await WorkoutPlan.find({
      trainer: req.user.id,
      isActive: true,
    });

    const userIds = [...new Set(plans.flatMap(p => p.assignedUsers.map(u => u.toString())))];

    if (userIds.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    // 2. Get recent activities for these users
    const activities = await Activity.find({
      user: { $in: userIds }
    })
    .populate('user', 'name email')
    .sort({ date: -1 })
    .limit(30);

    res.status(200).json({
      success: true,
      count: activities.length,
      data: activities,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   GET /api/workout-plans/users/:userId/activity
// @access  Private (Trainer only)
exports.getUserActivitySummary = async (req, res) => {
  try {
    const Activity = require('../models/Activity');
    const userId = req.params.userId;

    // Verify user exists and trainer has assigned plans to this user
    const assignedPlans = await WorkoutPlan.find({
      trainer: req.user.id,
      assignedUsers: userId,
    });

    if (assignedPlans.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to view this user activity',
      });
    }

    // Get user's recent activities
    const activities = await Activity.find({ user: userId })
      .sort({ date: -1 })
      .limit(20);

    // Calculate basic stats
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const recentActivities = activities.filter(
      (a) => new Date(a.date) >= last7Days
    );

    const totalSteps = recentActivities
      .filter((a) => a.activityType === 'steps')
      .reduce((sum, a) => sum + a.value, 0);

    const totalWorkouts = recentActivities.filter(
      (a) => a.activityType === 'workout'
    ).length;

    res.status(200).json({
      success: true,
      data: {
        userId,
        assignedPlans: assignedPlans.length,
        last7Days: {
          totalSteps,
          totalWorkouts,
        },
        recentActivities: activities.slice(0, 10),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete workout plan
// @route   DELETE /api/workout-plans/:id
// @access  Private (Trainer only)
exports.deleteWorkoutPlan = async (req, res) => {
  try {
    const workoutPlan = await WorkoutPlan.findById(req.params.id);

    if (!workoutPlan) {
      return res.status(404).json({
        success: false,
        message: 'Workout plan not found',
      });
    }

    // Make sure trainer owns workout plan
    if (workoutPlan.trainer.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this workout plan',
      });
    }

    // Soft delete
    workoutPlan.isActive = false;
    await workoutPlan.save();

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
