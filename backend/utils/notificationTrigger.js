const Notification = require('../models/Notification');

const createNotification = async (userId, message, type = 'info') => {
  try {
    await Notification.create({
      user: userId,
      message,
      type,
    });
    return true;
  } catch (error) {
    console.error('Notification creation failed:', error);
    return false;
  }
};

module.exports = { createNotification };
