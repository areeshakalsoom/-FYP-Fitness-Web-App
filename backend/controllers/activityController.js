const Activity = require('../models/Activity');
const Goal = require('../models/Goal');

// @desc    Get all activities for logged in user
// @route   GET /api/activities
// @access  Private
exports.getActivities = async (req, res) => {
  try {
    const { startDate, endDate, activityType, user } = req.query;

    let query = { user: req.user.id };

    // Allow trainers/doctors/admins to view other users' data
    if (user && ['admin', 'trainer', 'doctor', 'dietitian'].includes(req.user.role)) {
      query.user = user;
    }

    // Filter by date range if provided
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    // Filter by activity type if provided
    if (activityType) {
      query.activityType = activityType;
    }

    const activities = await Activity.find(query).sort({ date: -1 });

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

// @desc    Create new activity
// @route   POST /api/activities
// @access  Private
exports.createActivity = async (req, res) => {
  try {
    const {
      activityType,
      date,
      steps,
      distance,
      duration,
      caloriesBurned,
      workoutType,
      notes,
      intensity,
      heartRate,
    } = req.body;

    const activity = await Activity.create({
      user: req.user.id,
      activityType,
      date: date || Date.now(),
      steps,
      distance,
      duration,
      caloriesBurned,
      workoutType,
      notes,
      intensity,
      heartRate,
    });

    res.status(201).json({
      success: true,
      data: activity,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get activity statistics
// @route   GET /api/activities/stats
// @access  Private
exports.getActivityStats = async (req, res) => {
  try {
    const { period = 'week' } = req.query;

    // Calculate date range
    const now = new Date();
    let startDate = new Date();

    if (period === 'week') {
      startDate.setDate(now.getDate() - 7);
    } else if (period === 'month') {
      startDate.setMonth(now.getMonth() - 1);
    } else if (period === 'year') {
      startDate.setFullYear(now.getFullYear() - 1);
    }

    // Set start date to beginning of day
    startDate.setHours(0, 0, 0, 0);

    // Get activities in date range
    const activities = await Activity.find({
      user: req.user.id,
      date: { $gte: startDate, $lte: now },
    });

    // Calculate stats
    let totalSteps = 0;
    let totalCalories = 0;
    let workoutCount = 0;

    activities.forEach((activity) => {
      if (activity.steps) totalSteps += activity.steps;
      if (activity.caloriesBurned) totalCalories += activity.caloriesBurned;
      if (activity.activityType === 'workout' || activity.activityType === 'running' || 
          activity.activityType === 'cycling' || activity.activityType === 'swimming') {
        workoutCount++;
      }
    });

    const avgStepsPerDay = activities.length > 0 ? Math.round(totalSteps / 7) : 0; // Rough calculation for week

    // Get active goals
    const goals = await Goal.find({
      user: req.user.id,
      isActive: true,
    });

    // Calculate goal progress
    const goalProgress = goals.map((goal) => {
      let current = goal.currentValue || 0;
      
      // If it's a daily step goal, try to get today's steps
      if (goal.goalType === 'daily_steps') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayActivities = activities.filter(a => new Date(a.date) >= today);
        current = todayActivities.reduce((sum, a) => sum + (a.steps || 0), 0);
      } else if (goal.goalType === 'weekly_workouts') {
        current = workoutCount;
      }

      return {
        id: goal._id,
        goalType: goal.goalType,
        period: goal.period,
        target: goal.targetValue,
        current,
        percentage: Math.min(
          Math.round((current / goal.targetValue) * 100),
          100
        ),
      };
    });

    res.status(200).json({
      success: true,
      data: {
        period,
        totalSteps,
        totalCalories,
        totalWorkouts: workoutCount,
        avgStepsPerDay,
        goalProgress,
        recentActivities: activities.slice(0, 10).sort((a, b) => new Date(b.date) - new Date(a.date)),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete activity
// @route   DELETE /api/activities/:id
// @access  Private
exports.deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found',
      });
    }

    // Make sure user owns activity
    if (activity.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this activity',
      });
    }

    await activity.deleteOne();

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
