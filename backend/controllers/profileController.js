const Profile = require('../models/Profile');
const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      'name email role'
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { age, height, weight, gender, bio } = req.body;

    const profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { age, height, weight, gender, bio },
      { new: true, runValidators: true }
    ).populate('user', 'name email role');

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
