'use client';

import React from 'react';
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/nextjs';
import Sidebar from "../components/SideBar";
import "../app/globals.css";

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