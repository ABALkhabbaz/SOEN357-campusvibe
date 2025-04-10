import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/Navbar.css";
import axios from "axios";

const Navbar = ({ user, setUser }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        if (user) {
            try {
                await axios.post("http://localhost:3001/logout", {
                    email: user.email,
                });
            } catch (error) {
                console.error("Logout failed:", error);
            }
        }

        setUser(null);  // Clear frontend user
        navigate('/');  // Go Home
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <Link to="/" className="navbar-brand">CampusVibe</Link>
            </div>

            <div className="navbar-center">
                <Link to="/">Home</Link>
                <Link to="/events">Events</Link>
                <Link to="/submit">Submit</Link>
                {user && <Link to="/myevents">My Events</Link>}
            </div>

            <div className="navbar-right">
                {user ? (
                    <button onClick={handleLogout} className="navbar-login">
                        Logout
                    </button>
                ) : (
                    <Link to="/login" className="navbar-login">
                        Login
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
