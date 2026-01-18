const express = require('express');
const router = express.Router();
const { getWeightLogs, logWeight } = require('../controllers/weightController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getWeightLogs)
  .post(logWeight);

module.exports = router;
