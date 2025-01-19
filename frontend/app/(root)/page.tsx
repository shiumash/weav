"use client";

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Outing from '@/components/Outing';
import friendData from '@/mock_data/friends.json'; // Import the mock data

const HomePage = (userId: string) => {
  const [friends, setFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]); // State for selected tags
  const [participantEmails, setParticipantEmails] = useState([]); // State for participant emails
  const [userData, setUserData] = useState(null); // State for user data

  useEffect(() => {
    // Use the imported mock data to set the friends list
    setFriends(friendData.friends);

    // Fetch user data
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/user/${userId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleFriendClick = (friend) => {
    setSelectedFriends((prevSelectedFriends) => {
      if (prevSelectedFriends.includes(friend.email)) {
        return prevSelectedFriends.filter((email) => email !== friend.email);
      } else {
        return [...prevSelectedFriends, friend.email];
      }
    });
  };

  const getParticipantEmails = () => {
   setParticipantEmails(selectedFriends);
  };

  const handleSubmit = async ({ user }) => {
    getParticipantEmails();

    const payload = {
      senderEmail: 'currentUser@example.com', // Replace with actual current user email
      participantEmails,
      title: 'Outing Title', // Placeholder title
    };

    try {
      // Send the selected friends to the backend
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const outingsData = await response.json();
      console.log('Retrieved outings data:', outingsData);

      setHasSubmitted(true);
      console.log('Updated outings state:', outingsData);
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
      <button
        className="btn btn-primary plan-wevent-button"
        onClick={() => window.my_modal.showModal()}
        style={{ backgroundColor: '#10B981', position: 'absolute', top: '20px', right: '150px' }}
      >
        Plan Wevent
      </button>
      <dialog id="my_modal" className="modal">
        <form method="dialog" className="modal-box" style={{ backgroundColor: '#f8f9fa', color: '#333' }}>
          <h2 className="text-3xl font-bold mb-6 text-slate-800">Plan Your Wevent</h2>
          <div className="friends-list" style={{ textAlign: 'center', width: '100%' }}>
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
            <h2 className="text-3xl font-bold mb-6 text-slate-800">Select Friends!</h2>
            <ul style={{ listStyleType: 'none', padding: 0, display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
              {filteredFriends.map((friend) => (
                <li
                  key={friend.email}
                  className={`mb-4 cursor-pointer ${selectedFriends.includes(friend.email) ? 'bg-teal-200' : 'bg-white'}`}
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
          <div className="modal-action">
            <button className="btn btn-secondary">Close</button>
          </div>
        </form>
      </dialog>
      <div className="outings-container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: '20px' }}>
        {userData ? (
          <div className="card" style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '5px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <h3 className="text-2xl font-bold mb-4">{userData.firstName} {userData.lastName}</h3>
            <p><strong>Username:</strong> {userData.username}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Tags:</strong> {userData.tags.join(', ')}</p>
          </div>
        ) : (
          <p className="text-xl text-gray-500">No current Wevents</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;