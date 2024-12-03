import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MealList = ({ date, userId }) => {
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await axios.get(`/api/meals?userId=${userId}&date=${date}`);
        setMeals(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMeals();
  }, [date, userId]);

  return (
    <div>
      <h2>Meals for {date}</h2>
      {meals.map((meal) => (
        <div key={meal._id}>
          <h3>{meal.mealName}</h3>
          <p>Calories: {meal.calories}</p>
          <p>Protein: {meal.protein}g</p>
          <p>Carbs: {meal.carbs}g</p>
          <p>Fat: {meal.fat}g</p>
        </div>
      ))}
    </div>
  );
};

export default MealList;