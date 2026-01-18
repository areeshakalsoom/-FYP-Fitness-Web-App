const express = require('express');
const router = express.Router();
const {
  getWorkoutPlans,
  getWorkoutPlan,
  createWorkoutPlan,
  updateWorkoutPlan,
  assignWorkoutPlan,
  getUserActivitySummary,
  getTeamActivities,
  deleteWorkoutPlan,
} = require('../controllers/workoutPlanController');

const { protect, authorize } = require('../middleware/auth');

router.get(
  '/team-activities',
  protect,
  authorize('trainer'),
  getTeamActivities
);

router
  .route('/')
  .get(protect, getWorkoutPlans)
  .post(protect, authorize('trainer'), createWorkoutPlan);

router
  .route('/:id')
  .get(protect, getWorkoutPlan)
  .put(protect, authorize('trainer'), updateWorkoutPlan)
  .delete(protect, authorize('trainer'), deleteWorkoutPlan);

router.post(
  '/:id/assign',
  protect,
  authorize('trainer'),
  assignWorkoutPlan
);

router.get(
  '/users/:userId/activity',
  protect,
  authorize('trainer'),
  getUserActivitySummary
);

module.exports = router;
