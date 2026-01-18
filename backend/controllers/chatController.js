const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Get messages between users
// @route   GET /api/chat/:userId
// @access  Private
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user.id },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Send a message
// @route   POST /api/chat
// @access  Private
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;

    const message = await Message.create({
      sender: req.user.id,
      receiver: receiverId,
      content,
    });

    res.status(201).json({
      success: true,
      data: message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
