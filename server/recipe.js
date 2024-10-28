const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String, // URL for the recipe image
});

module.exports = mongoose.model('Recipe', recipeSchema);
