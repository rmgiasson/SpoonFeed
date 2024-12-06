import React from 'react';

function Logout({ onLogout }) {
  const logoutButtonStyle = {
    display: 'inline-block',
    backgroundColor: '#e63946', // Red background
    color: 'white', // White text
    padding: '10px 20px', // Add padding
    border: 'none', // Remove default button border
    fontWeight: 'bold', // Make the text bold
    borderRadius: '5px', // Add rounded corners
    marginLeft: '10px', // Space between buttons
    cursor: 'pointer', // Pointer cursor on hover
    transition: 'background-color 0.3s ease', // Smooth transition
  };

  const hoverStyle = {
    backgroundColor: '#d62828', // Darker red on hover
  };

  return (
    <button
      style={logoutButtonStyle}
      onMouseEnter={(e) => (e.target.style.backgroundColor = hoverStyle.backgroundColor)}
      onMouseLeave={(e) => (e.target.style.backgroundColor = logoutButtonStyle.backgroundColor)}
      onClick={onLogout}
    >
      Logout
    </button>
  );
}

export default Logout;