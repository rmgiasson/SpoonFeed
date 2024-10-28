const express = require('express');
const mongoose = require('mongoose');
const Recipe = require('./recipe');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 5001;

// Set up multer for file storage in the "../client/public/images" folder
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, '../client/public/images')); // Path to images folder in client/public
  },
  filename: function(req, file, cb) {
    const timestamp = Date.now(); // Get the current timestamp
    const formattedTitle = req.body.title.toLowerCase().replace(/\s+/g, '-'); // Format title for filename
    const ext = path.extname(file.originalname);
    cb(null, `${formattedTitle}-${timestamp}${ext}`); // Create unique filename
  }
});

const upload = multer({ storage: storage });

// Serve static files from the "images" directory in client/public
app.use('/images', express.static(path.join(__dirname, '../client/public/images')));

// Middleware to parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define the API endpoint to add a new recipe
app.post('/api/recipes', upload.single('image'), async (req, res) => {
  const { title, description } = req.body;

  try {
    const newRecipe = new Recipe({
      title,
      description,
      image: `/images/${req.file.filename}` // Save the relative path for frontend access
    });
    
    await newRecipe.save();
    res.status(201).json(newRecipe);
  } catch (error) {
    console.error("Error adding recipe:", error);
    res.status(500).send("Error adding recipe");
  }
});

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/spoonfeed', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Connected to MongoDB"))
  .catch(error => console.error("Could not connect to MongoDB:", error));

// Root route for the API
app.get('/', (req, res) => {
  res.send("Welcome to the SpoonFeed API");
});

// Define the API endpoint to retrieve recipes
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

// Optional utility function to clear all recipes from the database (for testing)
async function clearAllRecipes() {
  try {
    const result = await Recipe.deleteMany({});
    console.log(`${result.deletedCount} recipes deleted.`);
  } catch (err) {
    console.error("Error deleting recipes:", err);
  }
}
// Uncomment the line below to clear recipes (use only for testing!)
// clearAllRecipes();
