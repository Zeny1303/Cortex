import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";
import "./availableslots.css";

const SlotsPage = () => {
  const [slots, setSlots] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showBooked, setShowBooked] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    startTime: "",
    duration: 60,
    skills: ""
  });

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const fetchSlots = async () => {
    try {
      setLoading(true);

      const url = showBooked
        ? `${API_URL}/api/slots/booked`
        : `${API_URL}/api/slots/available`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.detail || "Failed to fetch slots");
        setSlots([]);
        return;
      }

      setSlots(data);
    } catch {
      setMessage("Server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, [showBooked]);

  const handleBook = async (slotId) => {
    const res = await fetch(`${API_URL}/api/slots/book/${slotId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.detail || "Booking failed");
      return;
    }

    setMessage("Interview booked successfully");
    fetchSlots();
  };

  const handleDelete = async (slotId) => {
    if (!window.confirm("Delete this slot?")) return;

    const res = await fetch(`${API_URL}/api/slots/cancel/${slotId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.detail || "Delete failed");
      return;
    }

    setMessage("Slot deleted");
    fetchSlots();
  };

  const handleCreateSlot = async () => {
    const skills = formData.skills.split(",").map((s) => s.trim());

    const res = await fetch(`${API_URL}/api/slots/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        startTime: new Date(formData.startTime).toISOString(),
        duration: parseInt(formData.duration),
        skills
      })
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.detail || "Creation failed");
      return;
    }

    setShowModal(false);
    setMessage("Slot created successfully");
    fetchSlots();
  };

  const formatDateTime = (date) =>
    new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short"
    });

  return (
    <div className="min-h-screen bg-gray-50 p-10">

      {/* HEADER */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-8">

        <h1 className="text-3xl font-semibold text-gray-800">
          Interview Slots
        </h1>

        <div className="flex gap-3">

          <button
            onClick={() => setShowBooked(!showBooked)}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            {showBooked ? "Available Slots" : "My Bookings"}
          </button>

          {!showBooked && (
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
            >
              + Create Slot
            </button>
          )}

          <button
            onClick={() => navigate("/slots/created-and-booked")}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
          >
            My Interviews
          </button>

        </div>
      </div>

      {message && (
        <div className="max-w-6xl mx-auto mb-6 text-green-600 font-medium">
          {message}
        </div>
      )}

      {/* SLOT GRID */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {loading && <p>Loading slots...</p>}

        {!loading && slots.length === 0 && (
          <p className="text-gray-500">No slots found</p>
        )}

        {slots.map((slot) => (
          <div
            key={slot._id}
            className="bg-white rounded-xl shadow-sm p-5 flex flex-col gap-2"
          >

            <div className="text-lg font-semibold">
              {formatDateTime(slot.startTime)}
            </div>

            <div className="text-gray-500 text-sm">
              {slot.duration} minutes
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {slot.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded"
                >
                  {skill}
                </span>
              ))}
            </div>

            <div className="text-sm text-gray-400 mt-2">
              Host: {slot.createdBy?.name || "Unknown"}
            </div>

            <div className="flex gap-2 mt-4">

              {!showBooked && (
                <button
                  onClick={() => handleBook(slot._id)}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg"
                >
                  Book
                </button>
              )}

              {String(slot.createdBy?._id || slot.createdBy) ===
                String(userId) && (
                <button
                  onClick={() => handleDelete(slot._id)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
                >
                  Delete
                </button>
              )}

            </div>

          </div>
        ))}

      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">

          <div className="modal-box">

            <h2 className="text-xl font-semibold mb-4">
              Create Interview Slot
            </h2>

            <input
              type="datetime-local"
              className="input"
              value={formData.startTime}
              onChange={(e) =>
                setFormData({ ...formData, startTime: e.target.value })
              }
            />

            <input
              type="number"
              className="input"
              placeholder="Duration (minutes)"
              value={formData.duration}
              onChange={(e) =>
                setFormData({ ...formData, duration: e.target.value })
              }
            />

            <input
              className="input"
              placeholder="Skills (React, Python)"
              value={formData.skills}
              onChange={(e) =>
                setFormData({ ...formData, skills: e.target.value })
              }
            />

            <div className="flex gap-3 mt-4">

              <button
                onClick={handleCreateSlot}
                className="flex-1 bg-indigo-600 text-white py-2 rounded-lg"
              >
                Create
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border rounded-lg py-2"
              >
                Cancel
              </button>

            </div>

          </div>

        </div>
      )}
    </div>
  );
};

export default SlotsPage;