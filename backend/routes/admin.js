const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  createUser,
  getUser,
  updateUserStatus,
  deleteUser,
  getSystemStats,
} = require('../controllers/adminController');
const { 
  getAllFeedback, 
  updateFeedbackStatus 
} = require('../controllers/feedbackController');
const { protect, authorize } = require('../middleware/auth');

// Basic protection
router.use(protect);

// Routes with specific roles
router.get('/users', authorize('admin', 'trainer', 'doctor', 'dietitian'), getAllUsers);
router.post('/users', authorize('admin'), createUser);
router.get('/users/:id', authorize('admin', 'trainer', 'doctor', 'dietitian'), getUser);
router.put('/users/:id/status', authorize('admin'), updateUserStatus);
router.delete('/users/:id', authorize('admin'), deleteUser);

// Public route for all authenticated users to get experts
const { getExperts } = require('../controllers/adminController');
router.get('/experts', getExperts);

router.get('/stats', authorize('admin'), getSystemStats);

// Feedback routes
router.get('/feedback', authorize('admin'), getAllFeedback);
router.put('/feedback/:id', authorize('admin'), updateFeedbackStatus);

module.exports = router;
