const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    // Foreign Key: Reference to User (Many-to-One)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    activityType: {
      type: String,
      enum: ['steps', 'workout', 'running', 'cycling', 'swimming', 'yoga', 'sleep', 'other'],
      required: [true, 'Please specify activity type'],
    },
    date: {
      type: Date,
      default: Date.now,
      required: true,
      index: true,
    },
    // Steps tracking
    steps: {
      type: Number,
      min: [0, 'Steps cannot be negative'],
    },
    // Distance tracking (in kilometers)
    distance: {
      type: Number,
      min: [0, 'Distance cannot be negative'],
    },
    // Duration (in minutes)
    duration: {
      type: Number,
      min: [0, 'Duration cannot be negative'],
    },
    // Calories burned
    caloriesBurned: {
      type: Number,
      min: [0, 'Calories cannot be negative'],
    },
    // For workout activities - specific workout type
    workoutType: {
      type: String,
      trim: true,
    },
    // Notes or description
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
      trim: true,
    },
    // Intensity level (optional)
    intensity: {
      type: String,
      enum: ['low', 'medium', 'high'],
    },
    // Heart rate data (optional)
    heartRate: {
      average: Number,
      max: Number,
    },
    // Sleep tracking (optional)
    sleepQuality: {
      type: String,
      enum: ['poor', 'fair', 'good', 'excellent'],
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for efficient queries
activitySchema.index({ user: 1, date: -1 });
activitySchema.index({ user: 1, activityType: 1, date: -1 });
activitySchema.index({ user: 1, createdAt: -1 });

// Virtual for formatted date
activitySchema.virtual('formattedDate').get(function () {
  return this.date.toLocaleDateString();
});

// Method to calculate estimated calories if not provided
activitySchema.methods.estimateCalories = function () {
  if (this.caloriesBurned) return this.caloriesBurned;

  // Simple estimation based on activity type and duration
  const caloriesPerMinute = {
    steps: 0.04, // per step
    workout: 8,
    running: 10,
    cycling: 7,
    swimming: 11,
    yoga: 3,
    sleep: 0,
    other: 5,
  };

  if (this.activityType === 'steps' && this.steps) {
    return Math.round(this.steps * caloriesPerMinute.steps);
  }

  if (this.duration) {
    return Math.round(this.duration * (caloriesPerMinute[this.activityType] || 5));
  }

  return 0;
};

// Pre-save hook to auto-calculate calories if not provided
activitySchema.pre('save', function () {
  if (!this.caloriesBurned) {
    this.caloriesBurned = this.estimateCalories();
  }
});

module.exports = mongoose.model('Activity', activitySchema);
