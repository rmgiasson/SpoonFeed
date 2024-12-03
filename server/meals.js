const mongoose = require('mongoose');

const MealSchema = new mongoose.Schema({
  mealName: { type: String, required: true },
  calories: { type: Number, required: true },
  protein: { type: Number, required: true },
  carbs: { type: Number, required: true },
  fat: { type: Number, required: true },
});

module.exports = mongoose.model('Meal', MealSchema);
