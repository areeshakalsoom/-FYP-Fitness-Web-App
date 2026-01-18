const WeightLog = require('../models/WeightLog');
const Profile = require('../models/Profile');

// @desc    Get all weight logs for user
// @route   GET /api/weight
// @access  Private
exports.getWeightLogs = async (req, res) => {
  try {
    const { user } = req.query;
    let query = { user: req.user.id };

    // Allow professionals to view specific user data
    if (user && ['admin', 'trainer', 'doctor', 'dietitian'].includes(req.user.role)) {
      query.user = user;
    }

    const logs = await WeightLog.find(query).sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Log current weight
// @route   POST /api/weight
// @access  Private
exports.logWeight = async (req, res) => {
  try {
    const { weight, date } = req.body;

    const log = await WeightLog.create({
      user: req.user.id,
      weight,
      date: date || Date.now(),
    });

    // Update current weight in profile too
    await Profile.findOneAndUpdate(
      { user: req.user.id },
      { weight },
      { new: true }
    );

    res.status(201).json({
      success: true,
      data: log,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
