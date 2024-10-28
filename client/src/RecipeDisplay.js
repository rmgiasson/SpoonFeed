import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RecipeDisplay.css';

function RecipeDisplay() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    // Fetch recipes from backend when component loads
    axios.get('/api/recipes')
      .then(response => setRecipes(response.data))
      .catch(error => console.error("Error fetching recipes:", error));
  }, []);

  // Function to handle sharing the recipe
  const handleShare = (title) => {
    const shareURL = `${window.location.origin}/recipes/${title.toLowerCase().replace(/\s+/g, '-')}`;
    
    if (navigator.share) {
      navigator.share({
        title: title,
        text: `Check out this recipe for ${title}!`,
        url: shareURL,
      }).catch((error) => console.error("Error sharing:", error));
    } else {
      // Fallback for browsers that don’t support Web Share API
      navigator.clipboard.writeText(shareURL).then(() => {
        alert("Recipe link copied to clipboard!");
      }).catch((error) => console.error("Error copying link:", error));
    }
  };

  return (
    <div className="recipe-display">
      <h2 className="recipe-feed-heading">Recipe Feed:</h2>
      <div className="recipe-list">
        {recipes.map((recipe) => (
          <div key={recipe._id} className="recipe-card">
            <h3>{recipe.title}</h3>
            <p>{recipe.description}</p>
            <img
              className="recipe-image"
              src={`/images/${recipe.title.toLowerCase().replace(/\s+/g, '-')}.jpg`}
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
