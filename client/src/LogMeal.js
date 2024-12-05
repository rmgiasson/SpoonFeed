import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LogMeal.css';

const LogMeal = () => {
  const [mealName, setMealName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [mealLogs, setMealLogs] = useState([]); // State to store logged meals
  const [error, setError] = useState(''); // State for error messages

  // Fetch logged meals on component mount
  useEffect(() => {
    fetchMealLogs();
  }, []);

  const fetchMealLogs = async () => {
    try {
      const response = await axios.get('/api/meals', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      // Sort the meal logs by creation date in ascending order
      setMealLogs(response.data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)));
    } catch (error) {
      console.error('Error fetching meals:', error);
      setError('Failed to fetch meal logs.');
    }
  };  

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        '/api/meals',
        {
          mealName,
          calories,
          protein,
          carbs,
          fat,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } } // Send the token in the header
      );

      alert('Meal logged successfully!');
      setMealName('');
      setCalories('');
      setProtein('');
      setCarbs('');
      setFat('');
      fetchMealLogs(); // Fetch updated meal logs
    } catch (error) {
      console.error('Error logging meal:', error);
      alert('Error logging meal');
    }
  };

  return (
    <div className="log-meal-container">
      <h2 className="log-meal-title">Log a Meal</h2>
      <form onSubmit={handleSubmit} className="log-meal-form">
        <div className="form-group">
          <label htmlFor="mealName">Meal Name</label>
          <input
            type="text"
            id="mealName"
            placeholder="Enter meal name"
            value={mealName}
            onChange={(e) => setMealName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="calories">Calories</label>
          <input
            type="number"
            id="calories"
            placeholder="Enter calories"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="protein">Protein (g)</label>
          <input
            type="number"
            id="protein"
            placeholder="Enter protein"
            value={protein}
            onChange={(e) => setProtein(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="carbs">Carbs (g)</label>
          <input
            type="number"
            id="carbs"
            placeholder="Enter carbs"
            value={carbs}
            onChange={(e) => setCarbs(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="fat">Fat (g)</label>
          <input
            type="number"
            id="fat"
            placeholder="Enter fat"
            value={fat}
            onChange={(e) => setFat(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="log-meal-button">
          Log Meal
        </button>
      </form>

      <div className="meal-logs">
        <h2 className="meal-logs-title">Your Meal Logs</h2>
        {error && <p className="error">{error}</p>}
        {mealLogs.length > 0 ? (
          mealLogs.map((meal, index) => (
            <div key={meal._id} className="meal-card">
              <h3>Meal Log #{index + 1}</h3>
              <p><strong>Meal Name:</strong> {meal.mealName}</p>
              <p><strong>Calories:</strong> {meal.calories} cal</p>
              <p><strong>Protein:</strong> {meal.protein} g</p>
              <p><strong>Carbs:</strong> {meal.carbs} g</p>
              <p><strong>Fat:</strong> {meal.fat} g</p>
            </div>
          ))
        ) : (
          <p>No meals logged yet.</p>
        )}
      </div>
    </div>
  );
};

export default LogMeal;
