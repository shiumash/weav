
import React from 'react'
import ActiveLink from './ActiveLink'

const SideBar = () => {

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Friends', path: '/friends' },
    { name: 'Profile', path: '/profile' },
  ]
  return (
    <div className='sticky top-0 left-0 h-screen w-48 bg-zinc-900'>
      <div className='p-5 border-b border-gray-700'>
        <h1 className='text-2xl font-bold text-zinc-100'>weav</h1>
      </div>
      <nav className='mt-6'>
        <ul>
          {
            navItems.map((item) => (
              <li key={item.name} className='mb-4 text-zinc-100'>
                <ActiveLink href={item.path}>
                  {item.name}  
                </ActiveLink> 
              </li>
            ))
          }
        </ul>
      </nav>
    </div>
  )
}

export default SideBar