"use client";

import React, { useEffect, useState } from 'react';
import Outing from '@/components/Outing';
import friendData from '@/mock_data/friends.json'; // Import the mock data

const OutingsPage = () => {
  const [friends, setFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [outings, setOutings] = useState([]); // Initialize as an empty array
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    // Use the imported mock data to set the friends list
    setFriends(friendData.friends);
  }, []);

  const handleFriendClick = (friend) => {
    setSelectedFriends((prevSelectedFriends) => {
      if (prevSelectedFriends.includes(friend)) {
        return prevSelectedFriends.filter((f) => f !== friend);
      } else {
        return [...prevSelectedFriends, friend];
      }
    });
  };

  const handleSubmit = async () => {
    const payload = {
      selectedBy: 'currentUser', // Replace with actual current user
      selectedFriends,
    };

    try {
      // Simulate sending data to the backend
      console.log('Sending selected friends to backend:', payload);

      // Retrieve outings data from the mock data
      const outingsData = friendData.outings;

      setOutings(outingsData);
      setHasSubmitted(true);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '20px' }}>
      <div className="friends-list text-3xl" style={{ textAlign: 'center' }}>
        <h2 className="text-3xl font-bold text-emerald- mb-6 text-center text-emerald-400">Select Friends!</h2>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {friends.map((friend) => (
            <li
              key={friend.email}
              className={`mb-4 text-emerald cursor-pointer ${selectedFriends.includes(friend) ? 'bg-zinc-700' : ''}`}
              onClick={() => handleFriendClick(friend)}
              style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px', margin: '10px', display: 'inline-block' }}
            >
              {friend.name}
            </li>
          ))}
        </ul>
        <button
          onClick={handleSubmit}
          className='mt-4 p-2 bg-emerald-500 text-white rounded'
        >
          Weav!
        </button>
      </div>
      <div className="outings-container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: '20px' }}>
        {outings.length > 0 ? (
          outings.map((outing, index) => (
            <Outing
              key={index}
              score={outing.score}
              name={outing.name}
              date={outing.date}
              description={outing.description}
              location={outing.location}
            />
          ))
        ) : (
          hasSubmitted && <p>No outings available</p>
        )}
      </div>
    </div>
  );
};

export default OutingsPage;