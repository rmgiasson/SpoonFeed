import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook
import axios from 'axios';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize the navigate function

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous errors

    try {
      await axios.post('/api/register', { username, password });
      alert('Registration successful');
      navigate('/'); // Redirect the user to the home page
    } catch (error) {
      console.error("Error registering user:", error);
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="register">
      <h2>Register</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
