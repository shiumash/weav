"use client";

import React, { useEffect, useState } from 'react';
import userData from '../../../mock_data/user.json';
import "./Profile.css";

const ProfilePage = () => {
  const [profileData, setProfileData] = useState(userData);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(userData);
  const [newTag, setNewTag] = useState('');

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setProfileData(formData);
    setIsEditing(false);
    // Here you would also update the JSON data on the server or local storage
  };

  const handleCancelClick = () => {
    setFormData(profileData);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove),
    });
  };

  const handleAddTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag],
      });
      setNewTag('');
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img
          className="profile-image"
          src={profileData.imageUrl}
          alt={profileData.username}
        />
        <h1 className="profile-title">
          <strong>
            {isEditing ? (
              <>
                <div className="profile-row">
                  <h3 className="profile-label">First Name:</h3>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="input input-bordered"
                  />
                </div>
                <div className="profile-row">
                  <h3 className="profile-label">Last Name:</h3>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="input input-bordered"
                  />
                </div>
              </>
            ) : (
              `${profileData.firstName} ${profileData.lastName}`
            )}
          </strong>
        </h1>
      </div>
      <div className="profile-details">
        <div>
          <strong>Username:</strong>{' '}
          {isEditing ? (
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="input input-bordered"
            />
          ) : (
            profileData.username
          )}
        </div>
        <div className="mt-3">
          <strong>Email:</strong>{' '}
          {isEditing ? (
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input input-bordered"
            />
          ) : (
            profileData.email
          )}
        </div>
        <div className="mt-3">
          <strong>Friends:</strong>{' '}
          {profileData.friends.join(', ')}
        </div>
        <div className="mt-3">
          <strong>Tags:</strong>{' '}
          {isEditing ? (
            <div>
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="badge badge-outline mr-2 cursor-pointer hover:badge-accent hover:text-black"
                  onClick={() => handleRemoveTag(tag)}
                >
                  {tag} &times;
                </span>
              ))}
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                className="input input-bordered"
              />
              <button onClick={handleAddTag} className="btn btn-primary ml-2 text-white-200">Add Tag</button>
            </div>
          ) : (
            <div>
              {profileData.tags.map((tag, index) => (
                <span key={index} className="badge badge-outline mr-2 cursor-pointer hover:badge-accent hover:badge-text-white">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      {isEditing ? (
        <>
          <button onClick={handleSaveClick} className="btn btn-success">Save Changes</button>
          <button onClick={handleCancelClick} className="btn btn-secondary ml-2">Cancel</button>
        </>
      ) : (
        <button onClick={handleEditClick} className="btn btn-primary profile-change">Edit Account</button>
      )}
    </div>
  );
};

export default ProfilePage;