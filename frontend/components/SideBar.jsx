import React, { useState } from 'react';
import ActiveLink from './ActiveLink';

const SideBar = () => {
  const [userData, setUserData] = useState(null);

  const navItems = [
    { name: 'Home', path: '/home' },
    { name: 'Friends', path: '/friends' },
    { name: 'Profile', path: '/profile', onClick: () => fetchUserData(id) }, // Example ID
  ];

  const fetchUserData = async (id) => {
    try {
      const response = await fetch(`/Users/${id}`);
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  return (
    <div className='sticky top-0 left-0 h-screen w-48 shadow-inner-2xl bg-slate-800'>
      <div className='p-5 border-b border-gray-700'>
        <h1 className='text-2xl font-bold text-zinc-100'>weav</h1>
      </div>
      <nav className='mt-6'>
        <ul>
          {navItems.map((item) => (
            <li key={item.name} className='mb-4 font-bold text-zinc-100'>
              <ActiveLink href={item.path} onClick={item.onClick}>
                {item.name}
              </ActiveLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default SideBar;