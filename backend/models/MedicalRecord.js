const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    title: {
      type: String,
      required: [true, 'Please provide a title for the record'],
      trim: true,
    },
    description: String,
    recordType: {
      type: String,
      enum: ['lab_report', 'prescription', 'referral', 'general', 'checkup'],
      default: 'general',
    },
    // Medical Details
    diagnosis: String,
    treatment: String,
    prescription: String,
    
    // Vital Signs
    vitals: {
      bloodPressureSystolic: Number,  // e.g., 120
      bloodPressureDiastolic: Number, // e.g., 80
      heartRate: Number,              // beats per minute
      temperature: Number,            // in Celsius
      weight: Number,                 // in kg
      height: Number,                 // in cm
      oxygenSaturation: Number,       // SpO2 percentage
    },
    
    fileUrl: {
      type: String, // Path to the uploaded file
    },
    fileName: String,
    date: {
      type: Date,
      default: Date.now,
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
