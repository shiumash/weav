"use client";

import React, { useState } from 'react'

const Outing = ({ score, name, date, description, location }) => {
  const [isReadMore, setIsReadMore] = useState(false)

  const toggleReadMore = () => {
    setIsReadMore(!isReadMore)
  }

  return (
    <div style={{ backgroundColor: '#ffffff', width: '350px', height: '500px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} className="bg-white rounded-xl shadow-md p-4 m-2">
      <div>
        <div className="mb-6">
          <div style={{ color: '#34d399' }} className="my-2">{score}</div>
          <h3 style={{ color: '#000000' }} className="text-xl font-bold">{name}</h3>
        </div>
        <div style={{ color: '#000000' }} className="mb-5">
          {isReadMore ? description : `${description.substring(0, 100)}...`}
        </div>
        <h3 style={{ color: '#008080' }} className="mb-2">{date}</h3>
        <div className="border border-gray-100 mb-5"></div>
        <div style={{ color: '#008080' }} className="mb-3">
          <i className="fa-solid fa-location-dot text-lg"></i> {location}
        </div>
      </div>
      <button
        onClick={toggleReadMore}
        style={{ backgroundColor: '#34d399', color: '#ffffff' }}
        className="mt-auto hover:text-blue-100"
      >
        {isReadMore ? "Less" : "Read More"}
      </button>
    </div>
  )
}

export default Outing