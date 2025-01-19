import React, { useState } from 'react';

const Outing = ({ id, name, description, userEmail, startTime, endTime, participants }) => {
  const [showParticipants, setShowParticipants] = useState(false);

  const toggleParticipants = () => {
    setShowParticipants(!showParticipants);
  };

  return (
    <div className="outing" style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '10px', margin: '10px', width: '300px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', flex: '0 0 auto' }}>
      <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>{name}</h3>
      <p style={{ fontSize: '16px', color: '#555' }}>{description}</p>
      <p style={{ fontSize: '14px', color: '#777' }}>ID: {id}</p>
      <p style={{ fontSize: '14px', color: '#777' }}>User Email: {userEmail}</p>
      <p style={{ fontSize: '14px', color: '#777' }}>Start Time: {startTime}</p>
      <p style={{ fontSize: '14px', color: '#777' }}>End Time: {endTime}</p>
      <button onClick={toggleParticipants} style={{ fontSize: '14px', color: '#007bff', cursor: 'pointer', background: 'none', border: 'none', padding: '0' }}>
        {showParticipants ? 'Hide Participants' : 'Show Participants'}
      </button>
      {showParticipants && (
        <ul style={{ listStyleType: 'none', padding: 0, marginTop: '10px' }}>
          {participants.map((participant, index) => (
            <li key={index} style={{ fontSize: '14px', color: '#555' }}>{participant}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Outing;