'use client';

import React, { useEffect, useState } from 'react';

import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import Sidebar from "../components/SideBar";
import { createContext, useContext, ReactNode } from 'react';
import "../app/globals.css";
import { SharedProvider } from './context/SharedContext';
import { currentUser } from '@clerk/nextjs/server';

function UserInfoProvider() {
  const { user } = useUser();
  const [userInfo, setUserInfo] = useState({});

export default function RootLayout({ children }: { children: React.ReactNode }) {

  const [pid, setPid] = useState<string>('')

  useEffect(() => {
    async function fetchUser() {
      const user = await currentUser()
      setPid(user.id)
    }
    return
  }, [])
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
                </SignedIn>
              </div>
              <SharedProvider pid={pid}>
                {children}
              </SharedProvider>
            </main>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}