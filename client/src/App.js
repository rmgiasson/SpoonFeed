import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import RecipeDisplay from './RecipeDisplay';
import Register from './Register';
import Login from './Login';
import LogMeal from './LogMeal'; // Import the LogMeal component
import './App.css';
import MealLog from './MealLog';

function App() {
  const location = useLocation(); // Hook to get the current location

  return (
    <div className="App">
      <header className="app-header">
        <h1 className="app-heading">Welcome to SpoonFeed</h1>
        <nav className="nav-links">
          {location.pathname === '/register' || location.pathname === '/login' || location.pathname === '/log-meal' ? (
            <Link to="/" className="home-button">Home</Link> // Show Home link when on /log-meal
          ) : (
            <Link to="/log-meal" className="log-meal-button">Log Meal</Link> // Show Log Meal link otherwise
          )}
        </nav>
      </header>
      <main>
      <Routes>
        <Route path="/" element={<RecipeDisplay />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
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
