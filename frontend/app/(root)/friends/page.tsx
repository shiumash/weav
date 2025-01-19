"use client";

import React, { useState, useEffect } from 'react';

const FriendPage = (pid: string) => {
  const [friends, setFriends] = useState<any[]>([]);
  const [newFriendEmail, setNewFriendEmail] = useState('');

  const postFriendData = async (newFriend) => {
    try {
      const response = await fetch('/api/users?action=friend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newFriend),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error('Error adding friend:', error);
      throw error;
    }
  };

  const getFriendData = async () => {
    try {
      const response = await fetch(`/api/users/${pid}?action=friends`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setFriends(data);
    } catch (error) {
      console.error('Error getting friends:', error);
    }
  };

  useEffect(() => {
    getFriendData();
  }, []);

  const handleAddFriend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newFriend = { email: newFriendEmail, tags: [], name: '', profile_picture: '' };
    try {
      const addedFriend = await postFriendData(newFriend);
      setFriends([...friends, addedFriend]);
      setNewFriendEmail('');
    } catch (error) {
      // Handle error if needed
    }
  };

  const handleRefresh = () => {
    getFriendData();
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <div className="ml-20 bg-slate-50 color" style={{ width: 'calc(100% - 80px)' }}>
        <section className="px-4 py-10">
          <div className="container-xl lg:container m-auto">
            {/* Page Heading, Add Friend Button, Refresh Friends Button */}
            <div className="flex items-center justify-between px-4 mb-6">
              {/* Your Friends Heading */}
              <h2 className="text-3xl font-bold text-emerald-400">
                Your Friends
              </h2>

              {/* Button Group */}
              <div className="flex gap-4">
                {/* Add Friend Button */}
                <button 
                  className="btn border-emerald-400 bg-emerald-400 text-white hover:border-emerald-700 hover:bg-emerald-700 px-4 py-2 rounded-md shadow-md" 
                  onClick={() => (document.getElementById('my_modal_1') as HTMLDialogElement)?.showModal()}
                >
                  Add Friend
                </button>
                {/* Refresh Button */}
                <button 
                  className="btn border-emerald-400 bg-emerald-400 text-white hover:border-emerald-700 hover:bg-emerald-700 px-4 py-2 rounded-md shadow-md" 
                  onClick={handleRefresh}
                >
                  Refresh
                </button>
              </div>
            </div>

            {/* Add Friend Modal */}
            <dialog 
              id="my_modal_1" 
              className="modal"
            >
              <div 
                className="modal-box bg-gray-200 p-6 rounded-md shadow-lg"
              >
                <h3 className="font-bold text-lg text-emerald-500">
                  Add Friend
                </h3>
                <form onSubmit={handleAddFriend}>
                  <div className="flex flex-col w-full">
                    <label 
                      htmlFor="friendEmail" 
                      className="text-sm font-medium text-gray-700 mb-2"
                    >
                      Enter your friend's email address
                    </label>
                    <input
                      type="email"
                      id="friendEmail"
                      value={newFriendEmail}
                      onChange={(e) => setNewFriendEmail(e.target.value)}
                      required
                      placeholder="Enter email address"
                      className="border border-gray-400 bg-gray-200 rounded-md p-2 w-full focus:ring-emerald-400 focus:border-emerald-400 mt-3"
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="bg-emerald-400 text-white px-4 py-2 rounded-md shadow-md hover:bg-emerald-500 focus:outline-none focus:ring focus:ring-emerald-300 mt-4"
                  >
                    Submit
                  </button>
                </form>
                <div className="modal-action">
                  <form method="dialog">
                    <button className="btn">Close</button>
                  </form>
                </div>
              </div>
            </dialog>
          </div>
        </section>
      </div>
    </div>
  );
};

export default FriendPage;