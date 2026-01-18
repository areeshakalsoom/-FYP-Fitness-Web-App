const MedicalRecord = require('../models/MedicalRecord');
const { createNotification } = require('../utils/notificationTrigger');

// @desc    Get all medical records
// @route   GET /api/medical-records
// @access  Private
exports.getMedicalRecords = async (req, res) => {
  try {
    let query;

    if (req.user.role === 'doctor') {
      // Doctors see records they created or records of assigned users
      // If no userId provided, show all (for directory/portal)
      if (req.query.userId) {
        query = { user: req.query.userId };
      } else {
        query = {}; // Broaden for the doctor dashboard
      }
    } else {
      query = { user: req.user.id };
    }

    const records = await MedicalRecord.find(query)
      .populate('user', 'name email')
      .populate('doctor', 'name email')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create medical record
// @route   POST /api/medical-records
// @access  Private
exports.createMedicalRecord = async (req, res) => {
  try {
    const { user, title, description, recordType, fileUrl, fileName, notes, date } = req.body;

    const record = await MedicalRecord.create({
      user: user || req.user.id,
      doctor: req.user.role === 'doctor' ? req.user.id : undefined,
      title,
      description,
      recordType,
      fileUrl,
      fileName,
      notes,
      date: date || Date.now(),
    });

    // Notify user if doctor created the record
    if (req.user.role === 'doctor' && user) {
      await createNotification(
        user,
        'Medical Report Published',
        `Doctor ${req.user.name} has published a new report: ${title}`,
        'medical_record'
      );
    }

    res.status(201).json({
      success: true,
      data: record,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete medical record
// @route   DELETE /api/medical-records/:id
// @access  Private
exports.deleteMedicalRecord = async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Record not found',
      });
    }

    // Check ownership
    if (record.user.toString() !== req.user.id && req.user.role !== 'admin' && record.doctor?.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized',
      });
    }

    await record.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
