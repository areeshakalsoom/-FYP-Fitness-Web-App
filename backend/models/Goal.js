const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema(
  {
    // Foreign Key: Reference to User (Many-to-One)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    goalType: {
      type: String,
      enum: [
        'daily_steps',
        'weekly_workouts',
        'weight_loss',
        'weight_gain',
        'distance',
        'calories',
        'custom',
      ],
      required: [true, 'Please specify goal type'],
    },
    targetValue: {
      type: Number,
      required: [true, 'Please provide a target value'],
      min: [1, 'Target value must be at least 1'],
    },
    currentValue: {
      type: Number,
      default: 0,
      min: [0, 'Current value cannot be negative'],
    },
    // Optional deadline for the goal
    deadline: {
      type: Date,
    },
    // Description or notes about the goal
    description: {
      type: String,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      trim: true,
    },
    // Status of the goal
    isActive: {
      type: Boolean,
      default: true,
    },
    // Track if goal was achieved
    isAchieved: {
      type: Boolean,
      default: false,
    },
    // Date when goal was achieved
    achievedAt: {
      type: Date,
    },
    // Unit of measurement (for custom goals)
    unit: {
      type: String,
      trim: true,
    },
    // Period for recurring goals
    period: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'one-time'],
      default: 'one-time',
    },
    // Priority level
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for efficient queries
goalSchema.index({ user: 1, isActive: 1 });
goalSchema.index({ user: 1, goalType: 1, isActive: 1 });
goalSchema.index({ user: 1, deadline: 1 });
goalSchema.index({ user: 1, isAchieved: 1 });

// Virtual for progress percentage
goalSchema.virtual('progressPercentage').get(function () {
  if (this.targetValue === 0) return 0;
  return Math.min(Math.round((this.currentValue / this.targetValue) * 100), 100);
});

// Virtual for remaining value
goalSchema.virtual('remainingValue').get(function () {
  return Math.max(this.targetValue - this.currentValue, 0);
});

// Virtual to check if deadline is approaching (within 7 days)
goalSchema.virtual('isDeadlineApproaching').get(function () {
  if (!this.deadline) return false;
  const daysUntilDeadline = Math.ceil(
    (this.deadline - new Date()) / (1000 * 60 * 60 * 24)
  );
  return daysUntilDeadline <= 7 && daysUntilDeadline > 0;
});

// Virtual to check if deadline passed
goalSchema.virtual('isOverdue').get(function () {
  if (!this.deadline) return false;
  return this.deadline < new Date() && !this.isAchieved;
});

// Method to update progress
goalSchema.methods.updateProgress = function (value) {
  this.currentValue = value;
  
  // Check if goal is achieved
  if (this.currentValue >= this.targetValue && !this.isAchieved) {
    this.isAchieved = true;
    this.achievedAt = new Date();
  }
  
  return this.save();
};

// Method to increment progress
goalSchema.methods.incrementProgress = function (amount) {
  this.currentValue += amount;
  
  // Check if goal is achieved
  if (this.currentValue >= this.targetValue && !this.isAchieved) {
    this.isAchieved = true;
    this.achievedAt = new Date();
  }
  
  return this.save();
};

// Pre-save hook to check achievement
goalSchema.pre('save', function () {
  // Auto-mark as achieved if current value reaches target
  if (this.currentValue >= this.targetValue && !this.isAchieved) {
    this.isAchieved = true;
    if (!this.achievedAt) {
      this.achievedAt = new Date();
    }
  }
  
  // If goal is achieved, it should remain active unless manually deactivated
  // This allows users to see their achievements
});

// Static method to get active goals for a user
goalSchema.statics.getActiveGoals = function (userId) {
  return this.find({ user: userId, isActive: true }).sort({ createdAt: -1 });
};

// Static method to get achieved goals for a user
goalSchema.statics.getAchievedGoals = function (userId) {
  return this.find({ user: userId, isAchieved: true }).sort({ achievedAt: -1 });
};

// Ensure virtuals are included in JSON
goalSchema.set('toJSON', { virtuals: true });
goalSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Goal', goalSchema);
