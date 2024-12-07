import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RecipeDisplay.css';
import AddRecipe from './AddRecipe';

function RecipeDisplay() {
  const [recipes, setRecipes] = useState([]);

  // Fetch recipes on component load
  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await axios.get('/api/recipes');
      const sortedRecipes = response.data.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt); // Sort by createdAt descending
      });
      setRecipes(sortedRecipes);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  const handleShare = (title) => {
    const shareURL = `${window.location.origin}/recipes/${title.toLowerCase().replace(/\s+/g, '-')}`;
    if (navigator.share) {
      navigator.share({
        title: title,
        text: `Check out this recipe for ${title}!`,
        url: shareURL,
      }).catch((error) => console.error('Error sharing:', error));
    } else {
      navigator.clipboard.writeText(shareURL)
        .then(() => alert('Recipe link copied to clipboard!'))
        .catch((error) => console.error('Error copying link:', error));
    }
  };

  const handleRecipeAdded = () => {
    fetchRecipes(); // Re-fetch recipes after a new one is added
  };

  return (
    <div className="recipe-display">
      <h2 className="recipe-feed-heading">Recipe Feed:</h2>
      <AddRecipe onRecipeAdded={handleRecipeAdded} />
      <div className="recipe-list">
        {recipes.map((recipe, index) => (
          <div key={recipe._id} className="recipe-card">
            <h3>{`Recipe #${recipes.length - index}`}</h3>
            <hr
              style={{
                alignSelf: "stretch",
                border: ".5px solid black",
                width: "100%", 
                margin: "0px 0", 
              }}
            />
            <h4>{recipe.title}</h4>
            <p>{recipe.description}</p>
            <img
              className="recipe-image"
              src={recipe.image} // Ensure images have the correct path
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
