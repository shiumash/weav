"use client";

import React from 'react'

const Header = () => {
  return (
    <div>
        <section className=" rounded-t-2xl bg-green-200 py-20 mb-0">
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center"
      >
        <div className="text-center">
          <h1
            className="text-4xl font-bold sm:text-5l md:text-6xl"
            style={{ color: '#34d399' }}
          >
            Weav
          </h1>
          <p className="my-4 text-xl text-3 text-green-900">
            Sync your calendar with others in realtime, simplifying planning for your next outing!
          </p>
        </div>
      </div>
    </section>

    </div>
  )
}

export default Header