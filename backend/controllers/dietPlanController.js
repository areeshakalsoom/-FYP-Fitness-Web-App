const DietPlan = require('../models/DietPlan');
const User = require('../models/User');
const { createNotification } = require('../utils/notificationTrigger');

// @desc    Get all diet plans
// @route   GET /api/diet-plans
// @access  Private
exports.getDietPlans = async (req, res) => {
  try {
    const { user, isActive } = req.query;
    let query = { isActive: isActive !== 'false' };

    if (['admin', 'doctor', 'dietitian'].includes(req.user.role)) {
      if (user) {
        query.user = user;
      }
    } else {
      query.user = req.user.id;
    }

    const dietPlans = await DietPlan.find(query)
      .populate('user', 'name email')
      .populate('dietitian', 'name email');

    res.status(200).json({
      success: true,
      count: dietPlans.length,
      data: dietPlans,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single diet plan
// @route   GET /api/diet-plans/:id
// @access  Private
exports.getDietPlan = async (req, res) => {
  try {
    const dietPlan = await DietPlan.findById(req.params.id)
      .populate('user', 'name email')
      .populate('dietitian', 'name email');

    if (!dietPlan) {
      return res.status(404).json({
        success: false,
        message: 'Diet plan not found',
      });
    }

    // Check authorization
    const isDoc = dietPlan.dietitian._id.toString() === req.user.id;
    const isUser = dietPlan.user._id.toString() === req.user.id;

    if (!isDoc && !isUser && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to view this plan',
      });
    }

    res.status(200).json({
      success: true,
      data: dietPlan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create diet plan
// @route   POST /api/diet-plans
// @access  Private (Doctor/Dietitian only)
exports.createDietPlan = async (req, res) => {
  try {
    const { 
      user, 
      title, 
      description, 
      meals, 
      recommendations, 
      restrictions, 
      endDate,
      calorieTarget,
      proteinTarget,
      carbsTarget,
      fatTarget
    } = req.body;

    const dietPlan = await DietPlan.create({
      user,
      dietitian: req.user.id,
      title,
      description,
      meals,
      recommendations,
      restrictions,
      endDate,
      calorieTarget,
      proteinTarget,
      carbsTarget,
      fatTarget
    });

    // Trigger notification
    await createNotification(
      user,
      `Your dietitian has published a new diet plan: ${title}`,
      'reminder'
    );

    res.status(201).json({
      success: true,
      data: dietPlan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update diet plan
// @route   PUT /api/diet-plans/:id
// @access  Private (Doctor/Dietitian only)
exports.updateDietPlan = async (req, res) => {
  try {
    let dietPlan = await DietPlan.findById(req.params.id);

    if (!dietPlan) {
      return res.status(404).json({
        success: false,
        message: 'Diet plan not found',
      });
    }

    if (dietPlan.dietitian.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this plan',
      });
    }

    dietPlan = await DietPlan.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: dietPlan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete diet plan
// @route   DELETE /api/diet-plans/:id
// @access  Private (Doctor/Dietitian only)
exports.deleteDietPlan = async (req, res) => {
  try {
    const dietPlan = await DietPlan.findById(req.params.id);

    if (!dietPlan) {
      return res.status(404).json({
        success: false,
        message: 'Diet plan not found',
      });
    }

    if (dietPlan.dietitian.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this plan',
      });
    }

    dietPlan.isActive = false;
    await dietPlan.save();

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
