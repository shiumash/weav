import React from 'react';

const Friend = ({ friend }) => {
  return (
    <li style={{ color: '#ffffff' }}>
      <img src={friend.profile_picture} alt={friend.name} style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
      <p>Name: {friend.name}</p>
      <p>Email: {friend.email}</p>
      <p>Tags: {friend.tags.join(', ')}</p>
    </li>
  );
};

export default Friend;