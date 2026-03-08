import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';   // ✅ FIX: central config

const BookedSlots = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchSlots = async () => {
    try {
      setLoading(true);
      // ✅ FIX: use API_URL
      const res = await fetch(`${API_URL}/api/slots/booked`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      const data = await res.json();
      if (!res.ok) {
        // ✅ FIX: FastAPI uses "detail"
        throw new Error(data.detail || 'Failed to fetch slots');
      }

      setSlots(data);
    } catch (err) {
      console.error('Error fetching booked slots:', err.message);
      setSlots([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
    const interval = setInterval(fetchSlots, 30_000);
    return () => clearInterval(interval);
  }, []);

  const handleJoin = (roomId) => navigate(`/room/${roomId}`);

  const isTimeToJoin = (startTime, endTime) => {
    const now = new Date();
    return now >= new Date(startTime) && now <= new Date(endTime);
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Your Booked Slots</h2>
        <button
          onClick={() => navigate('/slots/available')}
          style={{ padding: '6px 10px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          🔙 View Available Slots
        </button>
      </div>

      {loading && <p>Loading slots…</p>}

      {!loading && slots.length === 0 ? (
        <p>No slots booked yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {slots.map((slot) => (
            <li key={slot._id} style={{ marginBottom: '20px', padding: '10px', background: '#111', color: '#fff', borderRadius: '8px' }}>
              <strong>Start:</strong> {new Date(slot.startTime).toLocaleString()} <br />
              <strong>End:</strong> {new Date(slot.endTime).toLocaleString()} <br />
              <strong>Duration:</strong>{' '}
              {Math.round((new Date(slot.endTime) - new Date(slot.startTime)) / (1000 * 60))} mins <br />
              <strong>With:</strong> {slot.createdBy?.name || 'Peer'} <br />
              <strong>Skills:</strong> {slot.skills.join(', ')} <br />

              {isTimeToJoin(slot.startTime, slot.endTime) ? (
                <button
                  onClick={() => handleJoin(slot.roomId)}
                  style={{ marginTop: '10px', padding: '8px 12px', backgroundColor: '#10b981', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
                >
                  Join Interview
                </button>
              ) : (
                <span style={{ marginTop: '10px', display: 'inline-block', color: 'gray' }}>
                  Not available yet
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BookedSlots;