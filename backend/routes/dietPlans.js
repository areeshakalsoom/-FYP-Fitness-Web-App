const express = require('express');
const router = express.Router();
const {
  getDietPlans,
  getDietPlan,
  createDietPlan,
  updateDietPlan,
  deleteDietPlan,
} = require('../controllers/dietPlanController');
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(protect, getDietPlans)
  .post(protect, authorize('doctor', 'dietitian'), createDietPlan);

router
  .route('/:id')
  .get(protect, getDietPlan)
  .put(protect, authorize('doctor', 'dietitian'), updateDietPlan)
  .delete(protect, authorize('doctor', 'dietitian'), deleteDietPlan);

module.exports = router;
