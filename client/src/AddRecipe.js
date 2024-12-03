import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for routing
import axios from 'axios';
import './AddRecipe.css';

function AddRecipe({ onRecipeAdded }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !image) {
      setError('All fields are required!');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('image', image);

    try {
      await axios.post('/api/recipes', formData);
      onRecipeAdded();
      setTitle('');
      setDescription('');
      setImage(null);
      setError('');
      setSuccess('Recipe added successfully!');
    } catch (err) {
      console.error(err);
      setError('Failed to add the recipe. Please try again.');
    }
  };

  return (
    <div className="add-recipe-container">
      <div className="top-buttons">
        {/* Replace buttons with Link components */}
        <Link to="/register" className="register-button">Register</Link>
        <Link to="/login" className="login-button">Login</Link>
      </div>
      <h2>Add Your Recipe</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleSubmit} className="add-recipe-form">
        <div className="form-group">
          <label htmlFor="title">Recipe Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter recipe title"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write a short description of your recipe"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="image">Image</label>
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
