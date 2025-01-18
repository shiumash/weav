"use client";

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Outing from '@/components/Outing';
import friendData from '@/mock_data/friends.json'; // Import the mock data

const HomePage = () => {
  const [friends, setFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [outings, setOutings] = useState([]); // Initialize as an empty array
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]); // State for selected tags

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

  const handleTagChange = (event) => {
    const value = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    setSelectedTags(value);
  };

  const filteredFriends = selectedTags.length > 0
    ? friends.filter((friend) => selectedTags.every((tag) => friend.tags.includes(tag)))
    : friends;

  const uniqueTags = [...new Set(friends.flatMap((friend) => friend.tags))];

  return (
    <div className="home-container" style={{ padding: '20px', fontFamily: 'Arial, sans-serif', color: '#333' }}>
      <Header />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '20px' }}>
        <div className="friends-list" style={{ textAlign: 'center', width: '100%' }}>
          <h2 className="text-3xl font-bold mb-6 text-slate-800">Select Friends!</h2>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="tag-filter" className="text-slate-800" style={{ marginRight: '10px', fontSize: '18px' }}>Filter by tags:</label>
            <select
              id="tag-filter"
              multiple
              value={selectedTags}
              onChange={handleTagChange}
              className="text-white bg-slate-800"
              style={{ height: '100px', width: '200px', fontSize: '16px', padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }}
            >
              {uniqueTags.map((tag) => (
                <option key={tag} value={tag} className="bg-slate-800 text-white">{tag}</option>
              ))}
            </select>
          </div>
          <ul style={{ listStyleType: 'none', padding: 0, display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            {filteredFriends.map((friend) => (
              <li
                key={friend.email}
                className={`mb-4 cursor-pointer ${selectedFriends.includes(friend) ? 'bg-teal-200' : 'bg-white'}`}
                onClick={() => handleFriendClick(friend)}
                style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px', margin: '10px', width: '150px', textAlign: 'center', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
              >
                {friend.name}
              </li>
            ))}
          </ul>
          <button
            onClick={handleSubmit}
            className='mt-4 p-2 text-white rounded bg-slate-800'
            style={{ fontSize: '18px', padding: '10px 20px', cursor: 'pointer', border: 'none', borderRadius: '5px' }}
          >
            Weav Your Next Outing!
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
            hasSubmitted && <p style={{ fontSize: '18px', color: '#999' }}>No outings available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;