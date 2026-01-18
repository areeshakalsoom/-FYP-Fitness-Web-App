const express = require('express');
const router = express.Router();
const {
  getMedicalRecords,
  createMedicalRecord,
  deleteMedicalRecord,
} = require('../controllers/medicalRecordController');
const { protect } = require('../middleware/auth');

router
  .route('/')
  .get(protect, getMedicalRecords)
  .post(protect, createMedicalRecord);

router
  .route('/:id')
  .delete(protect, deleteMedicalRecord);

module.exports = router;
