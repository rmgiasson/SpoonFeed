import React, { useState } from 'react';
import './App.css';

function Profile({ user, fetchProfile }) {
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0]; // Get the selected file
    if (!file) return;

    setIsUploading(true); // Show that the upload is in progress
    const formData = new FormData();
    formData.append('profilePicture', file); // Attach the file to the form data

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Send the token
        },
        body: formData, // Send the image
      });

      if (!response.ok) {
        throw new Error('Failed to upload image'); // Handle server error
      }

      // Refetch profile to update the UI
      fetchProfile();
    } catch (error) {
      console.error('Error uploading profile picture:', error);
    } finally {
      setIsUploading(false); // Hide the uploading state
    }
  };

  return (
    <div className="profile">
      <label>
        <img
          src={user?.profile_picture || '/images/default-profile.png'} // Display current image
          alt="Profile"
          className="profile-pic"
          style={{ cursor: 'pointer' }}
        />
        <input
          type="file"
          accept="image/*"
          style={{ display: 'none' }} // Hide the input
          onChange={handleImageUpload} // Trigger upload on file change
        />
      </label>
      <span>{user?.name || 'Guest'}</span> {/* Display username */}
      {isUploading && <p>Uploading...</p>} {/* Show upload progress */}
    </div>
  );
}

export default Profile;

