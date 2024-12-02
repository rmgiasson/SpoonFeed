import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RecipeDisplay.css';
import AddRecipe from './AddRecipe'; // Import the new component

function RecipeDisplay() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = () => {
    // Fetch recipes from backend when component loads
    axios.get('/api/recipes')
      .then(response => setRecipes(response.data))
      .catch(error => console.error("Error fetching recipes:", error));
  };

  const handleShare = (title) => {
    const shareURL = `${window.location.origin}/recipes/${title.toLowerCase().replace(/\s+/g, '-')}`;
    
    if (navigator.share) {
      navigator.share({
        title: title,
        text: `Check out this recipe for ${title}!`,
        url: shareURL,
      }).catch((error) => console.error("Error sharing:", error));
    } else {
      navigator.clipboard.writeText(shareURL).then(() => {
        alert("Recipe link copied to clipboard!");
      }).catch((error) => console.error("Error copying link:", error));
    }
  };

  const handleRecipeAdded = () => {
    fetchRecipes(); // Re-fetch recipes after a new one is added
  };

  return (
    <div className="recipe-display">
      <h2 className="recipe-feed-heading">Recipe Feed:</h2>
      <AddRecipe onRecipeAdded={handleRecipeAdded} /> {/* Include the new component */}
      <div className="recipe-list">
        {recipes.map((recipe) => (
          <div key={recipe._id} className="recipe-card">
            <h3>{recipe.title}</h3>
            <p>{recipe.description}</p>
            <img
              className="recipe-image"
              src={recipe.image}
              alt={recipe.title}
            />
            <button className="share-button" onClick={() => handleShare(recipe.title)}>
              Share
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecipeDisplay;
