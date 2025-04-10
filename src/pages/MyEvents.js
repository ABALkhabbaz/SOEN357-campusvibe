import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/Events.css";
import { useNavigate, Link } from "react-router-dom";

const MyEvents = ({ user }) => {
    const [myEvents, setMyEvents] = useState([]);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
    
        const fetchMyEvents = async () => {
            try {
                const res = await axios.get(`http://localhost:3001/my-events/${user.email}`);
                setMyEvents(res.data); // directly set full event objects
            } catch (err) {
                console.error("Error fetching my events:", err);
            }
        };
    
        fetchMyEvents();
    }, [user, navigate]);
    

    const handleCancel = async (eventId) => {
        try {
            await axios.post('http://localhost:3001/cancel-event', {
                email: user.email,
                eventId
            });
            setMyEvents(prev => prev.filter(event => event.id !== eventId));
            setMessage('Registration Cancelled');
            setTimeout(() => setMessage(''), 2000);
        } catch (error) {
            console.error("Cancellation error:", error);
        }
    };

    return (
        <div className="events-container">
            <h1 className="events-title">My Events</h1>

            {message && <div className="toast-message">{message}</div>}

            {myEvents.length === 0 ? (
                <div className="empty-events">
                    <img src="/images/empty.png" alt="No Events" className="empty-image" />
                    <h2 className="empty-title">No Registered Events</h2>
                    <p className="empty-subtitle">Looks like you haven't registered for any events yet.</p>
                    <Link to="/events" className="browse-btn">Browse Events</Link>
                </div>
            ) : (
                <div className="events-list">
                    {myEvents.map(event => (
                        <div className="event-card" key={event.id}>
                            <img src={event.image} alt={event.title} className="event-image" />
                            <div className="event-content">
                                <h2>{event.title}</h2>
                                <p className="event-date">{event.date} | {event.location}</p>
                                <p className="event-description">{event.description}</p>
                                <span className="event-category">{event.category}</span>

                                <button onClick={() => handleCancel(event.id)} className="register-btn">
                                    Cancel Registration
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyEvents;
