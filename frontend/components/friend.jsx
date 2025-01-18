import React from 'react';

const Friend = ({ email, tags, name, profile_picture }) => {
  return (
    <div className="friend-card">
      <img src={profile_picture} alt={name} style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
      <p>Name: {name}</p>
      <p>Email: {email}</p>
      <p>Tags: {tags.join(', ')}</p>
    </div>
  );
};

export default Friend;