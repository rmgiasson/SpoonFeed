const express = require('express');
const mongoose = require('mongoose');
const Recipe = require('./recipe');

const app = express();
const PORT = 5001;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/spoonfeed')
  .then(() => console.log("Connected to MongoDB"))
  .catch(error => console.error("Could not connect to MongoDB:", error));

// Root route for the API
app.get('/', (req, res) => {
  res.send("Welcome to the SpoonFeed API");
});

// Define API endpoint to retrieve recipes
app.get('/api/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find({});
    res.json(recipes);
  } catch (error) {
    console.error("Error retrieving recipes:", error);
    res.status(500).send("Error retrieving recipes");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
