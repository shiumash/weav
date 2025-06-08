"use client";

import React, { useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import "./Profile.css";

const ProfilePage = () => {
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const { getToken } = useAuth();
  const { isLoaded, user } = useUser();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Make sure user is loaded before proceeding
        if (!isLoaded || !user) {
          return;
        }
        
        // Get session token
        const token = await getToken();
        
        // Fetch profile data
        const response = await fetch('/api/users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
          console.error('Failed API Response:', {
            status: response.status,
            statusText: response.statusText,
            data: errorData,
          });
          throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        setProfileData(data);
        setFormData(data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, [isLoaded, user, getToken]);

  const putProfileData = async (updatedProfile) => {
    const token = await getToken();
    
    const response = await fetch('/api/users', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updatedProfile),
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    return await response.json();
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      await putProfileData(formData);
      setProfileData(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile data:', error);
    }
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

  const handleVegetarianToggleTag = () => {
    setFormData({
      ...formData,
      is_vegetarian: !formData.is_vegetarian
    });
  };
  
  const handleSpicyToggleTag = () => {
    setFormData({
      ...formData,
      is_spicy: !formData.is_spicy
    });
  };

  const handleFamilyToggleTag = () => {
    setFormData({
      ...formData,
      is_family: !formData.is_family
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          profilePic: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  if (!profileData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        {isEditing ? (
          <div className="flex items-center justify-center w-full">
            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
              </div>
              <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} />
            </label>
          </div>
        ) : (
          <img
            className="profile-image"
            src={profileData.profilePic}
            alt={profileData.username}
          />
        )}
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
              <div className="text-4xl mt-3">
                {profileData.firstName} {profileData.lastName}
              </div>
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
                    className="toggle toggle-emerald ml-1"
                    checked={formData.is_vegetarian}
                    onChange={handleVegetarianToggleTag}
                  />
                </label>
              </div>
              <div className="form-control">
                <label className="cursor-pointer label">
                  <span className="label-text">Spicy</span>
                  <input
                    type="checkbox"
                    className="toggle toggle-emerald ml-1"
                    checked={formData.is_spicy}
                    onChange={handleSpicyToggleTag}
                  />
                </label>
              </div>
              <div className="form-control">
                <label className="cursor-pointer label ml-1">
                  <span className="label-text">Family</span>
                  <input
                    type="checkbox"
                    className="toggle toggle-emerald ml-1"
                    checked={formData.is_family}
                    onChange={handleFamilyToggleTag}
                  />
                </label>
              </div>
            </div>
          ) : (
            <div>
              {profileData.is_vegetarian && <span className="badge badge-emerald mr-2">Vegetarian</span>}
              {profileData.is_spicy && <span className="badge badge-emerald mr-2">Spicy</span>}
              {profileData.is_family && <span className="badge badge-emerald mr-2">Family</span>}
            </div>
          )}
        </div>
      </div>
      {isEditing ? (
        <>
          <button onClick={handleSaveClick} className="btn btn-success bg-emerald-300 hover:bg-emerald-500">Save Changes</button>
          <button onClick={handleCancelClick} className="btn btn-secondary ml-2 bg-rose-300 hover:bg-rose-500">Cancel</button>
        </>
      ) : (
        <button onClick={handleEditClick} className="btn btn-primary profile-change bg-emerald-300 hover:bg-emerald-500">Edit Account</button>
      )}
    </div>
  );
};

export default ProfilePage;