import React, { useState, useEffect } from "react";
import "../css/Events.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Events = ({ user }) => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [message, setMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:3001/events");
        setEvents(response.data);
      } catch (err) {
        console.error("Failed to load events", err);
      }
    };
    fetchEvents();
  }, []);

  const handleRegister = async (event) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await axios.post("http://localhost:3001/register-event", {
        email: user.email,
        eventId: event.id,
      });

      setMessage(`Successfully Registered for ${event.title}`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (error) {
      setMessage(error.response?.data || "Registration failed");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  return (
    <div className="events-container">
      <h1 className="events-title">Upcoming Events</h1>

      <div className="events-list">
        {events.map(event => (
          <div className="event-card" key={event.id}>
            <img src={event.image} alt={event.title} className="event-image" />
            <div className="event-content">
              <h2>{event.title}</h2>
              <p className="event-date">{event.date} | {event.location}</p>
              <p className="event-description">{event.description}</p>
              <span className="event-category">{event.category}</span>

              <button
                onClick={() => handleRegister(event)}
                className="register-btn"
              >
                Register
              </button>
            </div>
          </div>
        ))}
      </div>

      {showToast && (
        <div className="toast-message">
          {message}
        </div>
      )}
    </div>
  );
};

export default Events;
