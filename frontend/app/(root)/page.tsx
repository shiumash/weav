"use client";

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Outing from '@/components/Outing';
import outingsData from "@/mock_data/outings.json";

const HomePage = () => {
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Profile', path: '/profile' },
    { name: 'Friends', path: '/friends' },
  ];

  interface Outing {
    score: string;
    name: string;
    date: string;
    description: string;
    location: string;
  }

  const [outings, setOutings] = useState<Outing[]>([]);

  useEffect(() => {
    setOutings(outingsData);
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }} >
      <div className="ml-20 bg-slate-50 color"  style={{ width: 'calc(100% - 80px)' }}>
        <Header />
        <section className="px-4 py-10">
          <div className="container-xl lg:container m-auto">
            <h2 className="text-3xl font-bold text-emerald- mb-6 text-center text-emerald-400">
              Your Top Wevents
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {outings.map((outing, index) => (
                <Outing
                  key={index}
                  score={outing.score}
                  name={outing.name}
                  date={outing.date}
                  description={outing.description}
                  location={outing.location}
                />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;