import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/register', { username, password });
      alert('Registration successful');
    } catch (error) {
      console.error("Error registering user:", error);
      alert('Registration failed');
    }
  };

  return (
    <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ fontSize: '28px', marginBottom: '20px', color: '#4CAF50' }}>Register</h2>
      <form onSubmit={handleRegister}>
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
            backgroundColor: '#4CAF50',
            color: '#fff',
            fontSize: '18px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
