import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Events from "./pages/Events";
import Submit from "./pages/Submit";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";
import MyEvents from "./pages/MyEvents";
import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [user, setUser] = useState(null);  // null = Not Logged In

  return (
    <Router>
      <Navbar user={user} setUser={setUser} />

      <Routes>
        {/* Redirect root to login or events */}
        <Route path="/" element={user ? <Navigate to="/home" /> : <Home />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/events" element={<Events user={user} />} />
        <Route path="/submit" element={<Submit user={user} />} />
        <Route path="/myevents" element={<MyEvents user={user} />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
