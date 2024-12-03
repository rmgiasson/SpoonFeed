const mongoose = require('mongoose'); // Import mongoose

const recipeSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    image: String, // URL for the recipe image
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

module.exports = mongoose.model('Recipe', recipeSchema);
