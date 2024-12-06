import React, { useState } from 'react';
import './Profile.css';

function Profile({ user, fetchProfile }) {
    const [isUploading, setIsUploading] = useState(false);
    const [localImage, setLocalImage] = useState(null);

    // Default image from the public/images folder
    const defaultImage = '/images/spoon.jpg';

    // Determine the image to display
    const profileImage = localImage || user?.profile_picture || defaultImage;

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Preview the uploaded image immediately
        const previewURL = URL.createObjectURL(file);
        setLocalImage(previewURL);

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

            // Fetch the updated profile to reflect the new image
            await fetchProfile();
        } catch (error) {
            console.error('Error uploading profile picture:', error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="profile-container">
            <label className="profile-picture-container">
                <img
                    src={profileImage}
                    alt="Profile"
                    className="profile-picture"
                    onError={(e) => {
                        e.target.onerror = null; // Prevent infinite loop
                        e.target.src = defaultImage; // Fallback to the default image
                    }}
                />
                <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleImageUpload}
                />
            </label>
            {isUploading && <p className="uploading-indicator">Uploading...</p>}
        </div>
    );
}

export default Profile;
