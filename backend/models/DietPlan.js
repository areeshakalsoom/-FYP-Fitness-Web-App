const mongoose = require('mongoose');

const mealItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  calories: Number,
  protein: Number,
  carbs: Number,
  fats: Number,
  portion: String,
  notes: String,
});

const dietPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    dietitian: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a diet plan title'],
      trim: true,
    },
    description: String,
    calorieTarget: {
      type: Number,
      default: 0,
    },
    proteinTarget: {
      type: Number,
      default: 0,
    },
    carbsTarget: {
      type: Number,
      default: 0,
    },
    fatTarget: {
      type: Number,
      default: 0,
    },
    meals: {
      breakfast: [mealItemSchema],
      lunch: [mealItemSchema],
      dinner: [mealItemSchema],
      snacks: [mealItemSchema],
    },
    recommendations: [String],
    restrictions: [String],
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('DietPlan', dietPlanSchema);
