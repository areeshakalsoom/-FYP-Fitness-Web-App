const express = require('express');
const router = express.Router();
const {
  getActivities,
  createActivity,
  getActivityStats,
  deleteActivity,
} = require('../controllers/activityController');
const { protect } = require('../middleware/auth');

router.route('/').get(protect, getActivities).post(protect, createActivity);

router.get('/stats', protect, getActivityStats);

router.route('/:id').delete(protect, deleteActivity);

module.exports = router;
