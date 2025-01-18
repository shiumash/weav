"use client";

import React, { useEffect, useState } from 'react';
import friendData from "@/mock_data/friends.json";
import Friend from '@/components/Friend';

interface Friend {
  email: string;
  tags: string[];
  name: string;
  profile_picture: string;
}

const FriendPage = () => {
  const [friends, setFriends] = useState<Friend[]>([]);

  useEffect(() => {
      setFriends(friendData.friends);
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <div className="ml-20 bg-slate-50 color" style={{ width: 'calc(100% - 80px)' }}>
        <section className="px-4 py-10">
          <div className="container-xl lg:container m-auto">
            <h2 className="text-3xl font-bold text-emerald- mb-6 text-center text-emerald-400">
              Your Friends
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {friends.map((friend, index) => (
                <Friend
                  key={index}
                  email={friend.email}
                  tags={friend.tags}
                  name={friend.name}
                  profile_picture={friend.profile_picture}
                />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default FriendPage;