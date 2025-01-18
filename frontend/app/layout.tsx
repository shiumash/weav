'use client';

import React, { useEffect, useState } from 'react';
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/nextjs';
import Sidebar from "../components/SideBar"; // Correct the import path
import "../app/globals.css"

function UserInfoProvider() {
  const { user } = useUser();
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    if (user) {
      const googleAccount = user.externalAccounts.find(
        account => account.provider === 'google'
      );

      const userData = {
        firstName: user.firstName,
        lastName: user.lastName,
        googleId: googleAccount?.accountIdentifier,
        email: user.primaryEmailAddress?.emailAddress,
        imageUrl: user.imageUrl,
      };
      setUserInfo(userData);

      // Send user info to the backend
      fetch('http://localhost:5000/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })
        .then(response => response.json())
        .then(data => console.log('Success:', data))
        .catch(error => console.error('Error:', error));
    }
  }, [user]);

  return null; // This component doesn't render anything
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="w-screen min-h-screen bg-zinc-100">
          
          <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 p-10 overflow-y-auto">
              <div className='flex justify-end mb-4 flex-1'>
                <SignedOut>
                  <SignInButton />
                </SignedOut>
                <SignedIn>
                  <UserButton />
                  <UserInfoProvider />
                </SignedIn>
              </div>
              {children}
            </main>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}