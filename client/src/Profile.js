import React, { useState } from 'react';
import './Profile.css';
import spoonImage from './spoon.jpg'; // Default image

function Profile({ user, fetchProfile }) {
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [showLogoutMessage, setShowLogoutMessage] = useState(false);

    const handleMouseEnter = () => {
        setIsDropdownVisible(true);
    };

    const handleMouseLeave = () => {
        setIsDropdownVisible(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove token
        setShowLogoutMessage(true); // Show the logout success message
        setTimeout(() => {
            setShowLogoutMessage(false); // Hide the message after 3 seconds
            window.location.href = '/login'; // Redirect to login page
        }, 3000);
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setIsUploading(true);

        const formData = new FormData();
        formData.append('profilePicture', file);

        try {
            const response = await fetch('/api/profile', {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to upload image');
            }

            // Fetch updated profile
            await fetchProfile();
        } catch (error) {
            console.error('Error uploading profile picture:', error);
        } finally {
            setIsUploading(false);
        }
    };

    const profileImage = user?.profile_picture || spoonImage;

    return (
        <div
            className="profile-container"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <label className="profile-picture-container">
                <img
                    src={profileImage}
                    alt="Profile"
                    className="profile-picture"
                />
                <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleImageUpload} // Handle profile picture upload
                />
            </label>
            {isDropdownVisible && (
                <div className="profile-dropdown">
                    <p>{user?.name || 'Guest'}</p>
                    <button onClick={handleLogout} className="logout-button">
                        Logout
                    </button>
                </div>
            )}
            {isUploading && <p className="uploading-indicator">Uploading...</p>}
            {showLogoutMessage && (
                <div className="logout-message">Logout successful!</div>
            )}
        </div>
    );
}

export default Profile;
