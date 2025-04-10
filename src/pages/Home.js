import React from "react";
import { useNavigate } from "react-router-dom";
import "./../css/Home.css";

function Home() {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <header className="home-header">
                <img src="/logo.png" alt="CampusVibe Logo" className="home-logo" />
                <h1>Welcome to <span>CampusVibe</span></h1>
                <p>Your central hub for Concordia campus events</p>
                <div className="home-buttons">
                    <button onClick={() => navigate("/events")} className="explore-btn">
                        Explore Events
                    </button>
                    <button onClick={() => navigate("/login")} className="login-btn">
                        Log In / Create Account
                    </button>
                </div>
            </header>

            <section className="home-info">
                <h2>Why CampusVibe?</h2>
                <p>
                    Discover and track Concordia’s on-campus events. Whether you’re into academic talks,
                    club socials, or campus-wide activities, we’ve got you covered. Don’t just attend—
                    stay in the loop and get reminded!
                </p>
            </section>
        </div>
    );
}

export default Home;
