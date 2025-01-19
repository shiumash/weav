"use client";

import React, { useEffect, useState } from 'react';
import userData from '../../../mock_data/user.json';
import "./Profile.css";

const ProfilePage = () => {
  const [profileData, setProfileData] = useState(userData);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(userData);

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

  const handleToggleTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: {
        ...formData.tags,
        [tag]: !formData.tags[tag],
      },
    });
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
          <strong>Tags:</strong>{' '}
          {isEditing ? (
            <div className="flex space-x-4">
              <div className="form-control">
                <label className="cursor-pointer label">
                  <span className="label-text">Vegetarian</span>
                  <input
                    type="checkbox"
                    className="toggle toggle-emerald"
                    checked={formData.tags.vegetarian}
                    onChange={() => handleToggleTag('vegetarian')}
                  />
                </label>
              </div>
              <div className="form-control">
                <label className="cursor-pointer label">
                  <span className="label-text">Spicy</span>
                  <input
                    type="checkbox"
                    className="toggle toggle-emerald"
                    checked={formData.tags.spicy}
                    onChange={() => handleToggleTag('spicy')}
                  />
                </label>
              </div>
              <div className="form-control">
                <label className="cursor-pointer label">
                  <span className="label-text">Family</span>
                  <input
                    type="checkbox"
                    className="toggle toggle-emerald"
                    checked={formData.tags.family}
                    onChange={() => handleToggleTag('family')}
                  />
                </label>
              </div>
            </div>
          ) : (
            <div>
              {profileData.tags.vegetarian && <span className="badge badge-emerald mr-2">Vegetarian</span>}
              {profileData.tags.spicy && <span className="badge badge-emerald mr-2">Spicy</span>}
              {profileData.tags.family && <span className="badge badge-emerald mr-2">Family</span>}
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
        <button onClick={handleEditClick} className="btn btn-primary profile-change" style={{ backgroundColor: '#10B981' }}>Edit Account</button>
      )}
    </div>
  );
};

export default ProfilePage;