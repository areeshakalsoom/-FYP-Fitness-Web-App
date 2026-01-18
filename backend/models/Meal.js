const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide meal name'],
      trim: true,
    },
    mealType: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner', 'snack'],
      required: true,
    },
    calories: {
      type: Number,
      default: 0,
    },
    protein: {
      type: Number,
      default: 0,
    },
    carbs: {
      type: Number,
      default: 0,
    },
    fats: {
      type: Number,
      default: 0,
    },
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

// Index for user and date
mealSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Meal', mealSchema);
