import React, { useState } from 'react';
import axios from 'axios';
import './AddRecipe.css';

function AddRecipe({ onRecipeAdded }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!title || !description || !image) {
      setError('All fields are required!');
      return;
    }
  
    // Function to create a formatted file name
    const formatFileName = (title) => {
      return title.toLowerCase().replace(/\s+/g, '-') + '.jpg';
    };
  
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    
    // Rename the image before appending it to FormData
    const renamedFile = new File([image], formatFileName(title), { type: image.type });
    formData.append('image', renamedFile);
  
    try {
      await axios.post('/api/recipes', formData);
      onRecipeAdded(); // Trigger the fetch for new recipes
      setTitle('');
      setDescription('');
      setImage(null);
      setError('');
    } catch (err) {
      console.error("Error adding recipe:", err);
      setError("Failed to add recipe. Please try again.");
    }
  };
  

  return (
    <div className="add-recipe">
      <h2>Add Your Recipe</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Recipe Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="image">Image:</label>
          <input
            type="file"
            id="image"
            onChange={(e) => setImage(e.target.files[0])}
            required
          />
        </div>
        <button type="submit">Add Recipe</button>
      </form>
    </div>
  );
}

export default AddRecipe;
