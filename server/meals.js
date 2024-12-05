const express = require('express');
const router = express.Router();
const Meal = require('./Meal'); // Replace with the actual path to your Meal model
const auth = require('./auth'); // Middleware for authentication

// Route to log a meal (POST /api/meals)
router.post('/api/meals', auth, async (req, res) => {
  try {
    const { mealName, calories, protein, carbs, fat } = req.body;

    // Input validation
    if (!mealName || !calories || !protein || !carbs || !fat) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Create a new meal with the user ID from the auth middleware
    const newMeal = new Meal({
      mealName,
      calories,
      protein,
      carbs,
      fat,
      userId: req.user.id, // Attach the authenticated user's ID
    });

    await newMeal.save();
    res.status(201).json(newMeal);
  } catch (error) {
    console.error('Error logging meal:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to get all meals for the logged-in user (GET /api/meals)
router.get('/api/meals', auth, async (req, res) => {
  try {
    // Fetch meals associated with the logged-in user
    const meals = await Meal.find({ userId: req.user.id }).sort({ createdAt: -1 }); // Sort by newest first
    res.json(meals);
  } catch (error) {
    console.error('Error fetching meals:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to delete a specific meal (DELETE /api/meals/:id)
router.delete('/api/meals/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Ensure the meal belongs to the logged-in user before deleting
    const meal = await Meal.findOneAndDelete({ _id: id, userId: req.user.id });

    if (!meal) {
      return res.status(404).json({ message: 'Meal not found or unauthorized' });
    }

    res.json({ message: 'Meal deleted successfully' });
  } catch (error) {
    console.error('Error deleting meal:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Optional: Route to edit a specific meal (PUT /api/meals/:id)
router.put('/api/meals/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { mealName, calories, protein, carbs, fat } = req.body;

    // Input validation
    if (!mealName || !calories || !protein || !carbs || !fat) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Ensure the meal belongs to the logged-in user before updating
    const updatedMeal = await Meal.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { mealName, calories, protein, carbs, fat },
      { new: true } // Return the updated document
    );

    if (!updatedMeal) {
      return res.status(404).json({ message: 'Meal not found or unauthorized' });
    }

    res.json(updatedMeal);
  } catch (error) {
    console.error('Error updating meal:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
