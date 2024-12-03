import React, { useState } from 'react';
import axios from 'axios';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('/api/login', { username, password });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        alert('Login successful');
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid username or password.");
    }
  };

  return (
    <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ fontSize: '28px', marginBottom: '20px', color: '#2196F3' }}>Login</h2>
      {error && (
        <p style={{ color: 'red', fontSize: '16px', marginBottom: '10px' }}>
          {error}
        </p>
      )}
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{
            display: 'block',
            margin: '10px auto',
            padding: '10px',
            fontSize: '16px',
            width: '60%',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            display: 'block',
            margin: '10px auto',
            padding: '10px',
            fontSize: '16px',
            width: '60%',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        />
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            backgroundColor: '#2196F3',
            color: '#fff',
            fontSize: '18px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
