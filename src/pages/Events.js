import React, { useEffect, useState } from "react";
import "../css/Events.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Events = ({ user }) => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [message, setMessage] = useState('');
    const [showToast, setShowToast] = useState(false);

    // Hardcoded base events (keep them!)
    const hardcodedEvents = [
        {
            id: 1,
            title: "Chess Club Tournament",
            date: "April 25, 2025",
            location: "Library Hall - Room 101",
            description: "Join us for a friendly chess tournament open to all skill levels.",
            category: "Club",
            image: "/images/chess.jpg"
        },
        {
            id: 2,
            title: "Tech Talk: Future of AI",
            date: "April 28, 2025",
            location: "John Molson Auditorium",
            description: "A guest speaker discusses how AI will shape the future.",
            category: "Academic",
            image: "/images/ai.jpg"
        },
        {
            id: 3,
            title: "Spring Social BBQ",
            date: "May 2, 2025",
            location: "Loyola Campus - Backyard",
            description: "Free food, games, and networking with other students.",
            category: "Social",
            image: "/images/bbq.jpg"
        }
    ];

    useEffect(() => {
        const fetchAllEvents = async () => {
            try {
                const response = await axios.get('http://localhost:3001/events');
                setEvents(response.data); // Backend already returns both hardcoded + submitted
            } catch (error) {
                console.error("Error fetching events:", error);
                setEvents(hardcodedEvents); // fallback to hardcoded
            }
        };
    
        fetchAllEvents();
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
            setMessage(error.response.data);
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
