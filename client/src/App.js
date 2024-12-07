import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import RecipeDisplay from './RecipeDisplay';
import Register from './Register';
import Login from './Login';
import LogMeal from './LogMeal';
import MealLog from './MealLog';
import Profile from './Profile'; // Import the Profile component
import './App.css';

function App() {
  const location = useLocation();
  const [user, setUser] = useState(null);

  // Function to fetch user profile
  const fetchProfile = () => {
    fetch('/api/profile', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Failed to fetch profile');
      })
      .then((data) => setUser(data))
      .catch((err) => console.error('Error fetching profile:', err));
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token
    setUser(null); // Reset user state
    window.location.href = '/login'; // Redirect to login page
  };

  useEffect(() => {
    fetchProfile(); // Fetch profile on app load
  }, []);

  // Determine which button to display
  const renderNavButton = () => {
    if (location.pathname === '/log-meal') {
      return (
        <Link to="/" className="home-button">
          Home
        </Link>
      );
    } else if (location.pathname === '/register' || location.pathname === '/login') {
      return (
        <Link to="/" className="home-button">
          Home
        </Link>
      );
    }
    return (
      <Link to="/log-meal" className="log-meal-button">
        Log Meal
      </Link>
    );
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1 className="app-heading">Welcome to SpoonFeed 🥄</h1>
        <nav className="nav-links">
          {renderNavButton()}
        </nav>
        {/* Render Profile with user data */}
        {user && <Profile user={user} fetchProfile={fetchProfile} handleLogout={handleLogout} />}
      </header>
      <main>
        <Routes>
          <Route path="/" element={<RecipeDisplay />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login fetchProfile={fetchProfile} />} />
          <Route path="/log-meal" element={<LogMeal />} />
          <Route path="/meal-logs" element={<MealLog />} />
        </Routes>
      </main>
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;

