"use client";

import React, { useState } from 'react';

const FriendPage = () => {
  const [friends, setFriends] = useState([]);
  const [newFriendEmail, setNewFriendEmail] = useState('');

  const handleAddFriend = (e) => {
    e.preventDefault();
    const newFriend = { email: newFriendEmail, tags: [], name: '', profile_picture: '' };
    const updatedFriends = [...friends, newFriend];
    setFriends(updatedFriends);
    setNewFriendEmail('');
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

                {/* Refresh Friends List Button */}
                <button 
                  className="btn border-emerald-400 bg-emerald-400 text-white hover:border-emerald-700 hover:bg-emerald-700 px-4 py-2 rounded-md shadow-md" 
                  onClick={() => {}}
                >
                  Refresh Friends List
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
                    {/* Close button */}
                    <button 
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring focus:ring-gray-200"
                    >
                      Close
                    </button>
                  </form>
                </div>
              </div>
            </dialog>

            <div className="flex flex-col items-center gap-6">
              {friends.map((friend, index) => {
                const trueTags = Object.keys(friend.tags).filter((tag) => friend.tags[tag]);
                return (
                  <div 
                    key={index} 
                    className="flex items-center justify-between bg-white shadow-md border border-gray-200 rounded-lg p-4 w-full max-w-3xl"
                  >
                    {/* Profile Picture */}
                    <img 
                      src={friend.profile_picture} 
                      alt={friend.name} 
                      className="w-16 h-16 rounded-full object-cover mr-4"
                    />

                    {/* Friend Details */}
                    <div className="flex flex-col flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">{friend.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{friend.email}</p>
                    </div>

                    {/* Friend Tags */}
                    <div className="flex flex-wrap justify-end gap-1">
                      {trueTags.slice(0, 3).map((tag, idx) => (
                        <span 
                          key={idx} 
                          className="badge px-3 py-1 text-sm text-zinc-100 bg-slate-800 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default FriendPage;