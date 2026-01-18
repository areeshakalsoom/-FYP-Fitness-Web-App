const Goal = require('../models/Goal');

// @desc    Get all goals for logged in user
// @route   GET /api/goals
// @access  Private
exports.getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user.id, isActive: true }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: goals.length,
      data: goals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create new goal
// @route   POST /api/goals
// @access  Private
exports.createGoal = async (req, res) => {
  try {
    const { goalType, targetValue, currentValue, period, deadline, description, priority, unit } = req.body;

    // Check if active goal of same type already exists
    const existingGoal = await Goal.findOne({
      user: req.user.id,
      goalType,
      isActive: true,
    });

    if (existingGoal) {
      // Deactivate existing goal
      existingGoal.isActive = false;
      await existingGoal.save();
    }

    const goal = await Goal.create({
      user: req.user.id,
      goalType,
      targetValue,
      currentValue: currentValue || 0,
      period: period || 'one-time',
      deadline,
      description,
      priority: priority || 'medium',
      unit
    });

    res.status(201).json({
      success: true,
      data: goal,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update goal
// @route   PUT /api/goals/:id
// @access  Private
exports.updateGoal = async (req, res) => {
  try {
    let goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found',
      });
    }

    // Make sure user owns goal
    if (goal.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this goal',
      });
    }

    goal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: goal,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete goal
// @route   DELETE /api/goals/:id
// @access  Private
exports.deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found',
      });
    }

    // Make sure user owns goal
    if (goal.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this goal',
      });
    }

    // Soft delete - mark as inactive
    goal.isActive = false;
    await goal.save();

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
