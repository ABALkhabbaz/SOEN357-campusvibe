import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/Login.css";

const Login = ({ setUser }) => {  // this is correct now
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSuccessMessage('');
        setErrorMessage('');

        try {
            await axios.post("http://localhost:3001/login", formData);

            setSuccessMessage("Welcome back! Redirecting to Home...");

            setTimeout(() => {
                setUser({ email: formData.email });  // Pass the user data
                navigate('/');
            }, 2000);

        } catch (error) {
            setErrorMessage(error.response.data);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="login-logo">
                    <img src="/logo.png" alt="CampusVibe Logo" />
                    <h1 className="login-title">CampusVibe</h1>
                </div>

                <p className="login-subtitle">Sign in with your Netname</p>

                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        required
                        className="login-input"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        required
                        className="login-input"
                        value={formData.password}
                        onChange={handleChange}
                    />

                    <button type="submit" className="login-button">
                        Sign In
                    </button>
                </form>

                {successMessage && <p style={{ color: 'green', marginTop: '10px' }}>{successMessage}</p>}
                {errorMessage && <p style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</p>}

                <p className="signup-text">
                    Don’t have an account? <Link to="/signup">Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
