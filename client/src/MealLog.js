import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MealLog.css';

const MealLog = () => {
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

  return (
    <div className="meal-log-container">
      <h2 className="meal-log-title">Your Meal Logs</h2>
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
  );
};

export default MealLog;
