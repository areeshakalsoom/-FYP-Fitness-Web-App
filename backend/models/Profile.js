const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    // Primary Key: Reference to User (One-to-One)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    age: {
      type: Number,
      min: [1, 'Age must be at least 1'],
      max: [150, 'Age must be less than 150'],
    },
    height: {
      type: Number, // in cm
      min: [50, 'Height must be at least 50 cm'],
      max: [300, 'Height must be less than 300 cm'],
    },
    weight: {
      type: Number, // in kg
      min: [20, 'Weight must be at least 20 kg'],
      max: [500, 'Weight must be less than 500 kg'],
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Profile', profileSchema);
