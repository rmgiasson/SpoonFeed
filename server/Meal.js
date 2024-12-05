const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema(
  {
    mealName: { type: String, required: true },
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fat: { type: Number, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true } // Enable createdAt and updatedAt timestamps
);

module.exports = mongoose.model('Meal', mealSchema);
