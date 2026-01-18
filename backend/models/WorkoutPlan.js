const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  sets: {
    type: Number,
    min: 1,
  },
  reps: {
    type: String, // Changed to String for flexibility (e.g., "12-15", "until failure")
  },
  duration: {
    type: Number, // in minutes
  },
  notes: String,
});

const workoutPlanSchema = new mongoose.Schema(
  {
    // Foreign Key: Reference to Trainer (Many-to-One)
    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a workout plan title'],
      trim: true,
    },
    description: {
      type: String,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    exercises: [exerciseSchema],
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    duration: {
      type: Number, // total duration in minutes
    },
    // Many-to-Many: References to assigned Users
    assignedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for trainer queries
workoutPlanSchema.index({ trainer: 1, isActive: 1 });

module.exports = mongoose.model('WorkoutPlan', workoutPlanSchema);
