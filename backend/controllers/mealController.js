const Meal = require('../models/Meal');

// @desc    Get all meals for user
// @route   GET /api/meals
// @access  Private
exports.getMeals = async (req, res) => {
  try {
    const { startDate, endDate, user } = req.query;
    let query = { user: req.user.id };

    // Allow trainers/doctors/admins to view other users' data
    if (user && ['admin', 'trainer', 'doctor', 'dietitian'].includes(req.user.role)) {
      query.user = user;
    } else if (['admin', 'trainer', 'doctor', 'dietitian'].includes(req.user.role)) {
      // If no specific user requested, let professionals see all records for their dashboard
      query = {};
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const meals = await Meal.find(query)
      .populate('user', 'name email')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: meals.length,
      data: meals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Log a meal
// @route   POST /api/meals
// @access  Private
exports.createMeal = async (req, res) => {
  try {
    const meal = await Meal.create({
      ...req.body,
      user: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: meal,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete a meal
// @route   DELETE /api/meals/:id
// @access  Private
exports.deleteMeal = async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id);

    if (!meal) {
      return res.status(404).json({
        success: false,
        message: 'Meal not found',
      });
    }

    if (meal.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized',
      });
    }

    await meal.deleteOne();

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
