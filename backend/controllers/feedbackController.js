const Feedback = require('../models/Feedback');

// @desc    Get all feedback
// @route   GET /api/admin/feedback
// @access  Private (Admin only)
exports.getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: feedback.length,
      data: feedback,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update feedback status
// @route   PUT /api/admin/feedback/:id
// @access  Private (Admin only)
exports.updateFeedbackStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found',
      });
    }

    res.status(200).json({
      success: true,
      data: feedback,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Submit feedback (Used by Users)
// @route   POST /api/feedback
// @access  Private
exports.submitFeedback = async (req, res) => {
  try {
    const { subject, message } = req.body;

    const feedback = await Feedback.create({
      user: req.user.id,
      subject,
      message,
    });

    res.status(201).json({
      success: true,
      data: feedback,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
