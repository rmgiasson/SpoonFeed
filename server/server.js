require('dotenv').config(); // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const path = require('path');
const Recipe = require('./recipe');
const User = require('./user');
const Meal = require('./meals');
const authMiddleware = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../client/public/images');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const formattedTitle = req.body.title
      ? req.body.title.toLowerCase().replace(/\s+/g, '-')
      : 'untitled';
    const ext = path.extname(file.originalname);
    cb(null, `${formattedTitle}-${timestamp}${ext}`);
  },
});
const upload = multer({ storage });

// Serve static files
app.use('/images', express.static(path.join(__dirname, '../client/public/images')));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/spoonfeed', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Could not connect to MongoDB:', error));

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the SpoonFeed API');
});

// User Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, {
      expiresIn: '1h',
    });

    res.cookie('authToken', token, { httpOnly: true });
    res.status(200).json({ message: 'Login successful', user: { username: user.username }, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Logout
app.post('/api/logout', (req, res) => {
  res.clearCookie('authToken');
  res.json({ message: 'Logged out successfully' });
});

// Profile Endpoint
app.get('/api/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id, '-password'); // Fetch user details excluding password
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      name: user.username,
      profile_picture: user.profilePicture || '/images/default-profile.png',
    });
  } catch (error) {
    console.error('Error fetching profile:', error
    );
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Profile Update Endpoint
app.put('/api/profile', authMiddleware, upload.single('profilePicture'), async (req, res) => {
  try {
    const updateData = {};

    // Update profile picture if provided
    if (req.file) {
      updateData.profilePicture = `/images/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true, fields: '-password' } // Return the updated user excluding the password
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user: {
        name: updatedUser.username,
        profile_picture: updatedUser.profilePicture || '/images/default-profile.png',
      },
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add a New Recipe
app.post('/api/recipes', upload.single('image'), async (req, res) => {
  const { title, description } = req.body;

  if (!req.file || !title || !description) {
    return res.status(400).json({ message: 'Title, description, and image are required' });
  }

  try {
    const newRecipe = new Recipe({
      title,
      description,
      image: `/images/${req.file.filename}`,
    });
    await newRecipe.save();
    res.status(201).json(newRecipe);
  } catch (error) {
    console.error('Error adding recipe:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Fetch All Recipes
app.get('/api/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find({}).sort({ createdAt: -1 });
    res.json(recipes);
  } catch (error) {
    console.error('Error retrieving recipes:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Log a Meal
app.post('/api/meals', authMiddleware, async (req, res) => {
  const { mealName, calories, protein, carbs, fat } = req.body;

  if (!mealName || !calories || !protein || !carbs || !fat) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newMeal = new Meal({
      mealName,
      calories,
      protein,
      carbs,
      fat,
      userId: req.user.id,
    });
    await newMeal.save();
    res.status(201).json(newMeal);
  } catch (error) {
    console.error('Error logging meal:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Fetch Meals for Authenticated User
app.get('/api/meals', authMiddleware, async (req, res) => {
  try {
    const meals = await Meal.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(meals);
  } catch (error) {
    console.error('Error fetching meals:', error);
    res.status(500).json({ message: 'Error fetching meals' });
  }
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});