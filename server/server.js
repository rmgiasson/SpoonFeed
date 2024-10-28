const express = require('express');
const mongoose = require('mongoose');
const Recipe = require('./recipe');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 5001;

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'images/'); // Ensure this folder exists
  },
  filename: function(req, file, cb) {
    const timestamp = Date.now(); // Get the current timestamp
    const formattedTitle = req.body.title.toLowerCase().replace(/\s+/g, '-'); // Format title for filename
    const ext = path.extname(file.originalname);
    cb(null, `${formattedTitle}-${timestamp}${ext}`); // Create unique filename
    //cb(null, file.originalname); // Store the original file name
  }
});

const upload = multer({ storage: storage });

app.use('/images', express.static(path.join(__dirname, 'images')));

// Define API endpoint to add a new recipe
app.post('/api/recipes', upload.single('image'), async (req, res) => {
  const { title, description } = req.body;

  try {
    const newRecipe = new Recipe({
      title,
      description,
      image: req.file.path // Save the image path
    });
    
    await newRecipe.save();
    res.status(201).json(newRecipe);
  } catch (error) {
    console.error("Error adding recipe:", error);
    res.status(500).send("Error adding recipe");
  }
});


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




async function clearAllRecipes() {
  try {
    const result = await Recipe.deleteMany({});
    console.log(`${result.deletedCount} recipes deleted.`);
  } catch (err) {
    console.error("Error deleting recipes:", err);
  }
}

//clearAllRecipes();