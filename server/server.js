const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const Recipe = require('./recipe'); // Recipe model
const User = require('./user'); // User model
const Meal = require('./meals'); // Meal model

const app = express();
const PORT = 5001;
const JWT_SECRET = 'your_jwt_secret_key_here'; // Replace with a secure key

// Middleware
app.use(express.json()); // Parses incoming JSON requests
app.use(express.urlencoded({ extended: true }));

// Multer Configuration for Image Uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../client/public/images');
    console.log('Resolved Path:', uploadPath); // Log the resolved directory path
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const formattedTitle = req.body.title
      ? req.body.title.toLowerCase().replace(/\s+/g, '-')
      : 'untitled';
    const ext = path.extname(file.originalname);
    cb(null, `${formattedTitle}-${timestamp}${ext}`);
  }
});

const upload = multer({ storage: storage });

// Serve static files from the "images" directory in client/public
app.use('/images', express.static(path.join(__dirname, '../client/public/images')));

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

// Add a New Recipe
app.post('/api/recipes', upload.single('image'), async (req, res) => {
  console.log('Uploaded File:', req.file); // Log the uploaded file details
  console.log('Request Body:', req.body); // Log the request body for debugging

  if (!req.file) {
    return res.status(400).json({ message: 'File upload failed' });
  }

  const { title, description } = req.body;

  try {
    const newRecipe = new Recipe({
      title,
      description,
      image: `/images/${req.file.filename}` // Save relative path for frontend access
    });

    await newRecipe.save();
    res.status(201).json(newRecipe);
  } catch (error) {
    console.error('Error adding recipe:', error);
    res.status(500).send('Error adding recipe');
  }
});

// Fetch All Recipes (most recent first)
app.get('/api/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find({}).sort({ _id: -1 });
    res.json(recipes);
  } catch (error) {
    console.error("Error retrieving recipes:", error);
    res.status(500).send("Error retrieving recipes");
  }
});

// User Routes

// Register User
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send('Error registering user');
  }
});

// Login User
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Fetch All Users (excluding password)
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // Exclude the password field for security
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Dietary Tracking Routes

// Log a Meal
app.post('/api/meals', async (req, res) => {
  const { mealName, calories, protein, carbs, fat } = req.body;
  console.log("Received meal data:", req.body); // Debug log

  if (!mealName || !calories || !protein || !carbs || !fat) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const newMeal = new Meal({
      mealName,
      calories,
      protein,
      carbs,
      fat,
    });
    await newMeal.save();
    console.log("Meal saved:", newMeal); // Debug log
    res.status(201).json({ message: 'Meal logged successfully!', meal: newMeal });
  } catch (error) {
    console.error("Error logging meal:", error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});


// Fetch Meals by Date
app.get('/api/meals', async (req, res) => {
  const { userId, date } = req.query;
  const start = new Date(date);
  const end = new Date(date);
  end.setDate(start.getDate() + 1);

  try {
    const meals = await Meal.find({ userId, date: { $gte: start, $lt: end } });
    res.json(meals);
  } catch (err) {
    console.error('Error fetching meals:', err);
    res.status(500).json({ message: 'Error fetching meals' });
  }
});

// Fetch Nutritional Summary
app.get('/api/meals/summary', async (req, res) => {
  const { userId } = req.query;

  try {
    const summary = await Meal.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalCalories: { $sum: '$calories' },
          totalProtein: { $sum: '$protein' },
          totalCarbs: { $sum: '$carbs' },
          totalFat: { $sum: '$fat' }
        }
      }
    ]);

    res.json(summary[0] || { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 });
  } catch (err) {
    console.error('Error fetching summary:', err);
    res.status(500).json({ message: 'Error fetching summary' });
  }
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
