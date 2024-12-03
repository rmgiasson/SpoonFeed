import React, { useState } from 'react';
import axios from 'axios';
import './LogMeal.css'; // External CSS for styling

const LogMeal = () => {
  const [mealName, setMealName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/meals', { mealName, calories, protein, carbs, fat });
      alert('Meal logged successfully!');
      setMealName('');
      setCalories('');
      setProtein('');
      setCarbs('');
      setFat('');
    } catch (err) {
      console.error(err);
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
    </div>
  );
};

export default LogMeal;
