import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Events from "./pages/Events";
import Submit from "./pages/Submit";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";
import MyEvents from "./pages/MyEvents";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [user, setUser] = useState(null);  // null = Not Logged In

  // Check who is logged in from users.txt on refresh
  useEffect(() => {
    axios.get('http://localhost:3001/users')
      .then(res => {
        const users = res.data;
        const loggedInUser = users.find(u => u.isLoggedIn);  // Check isLoggedIn
        if (loggedInUser) {
          setUser(loggedInUser);
        }
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <Router>
      <Navbar user={user} setUser={setUser} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events user={user} />} />
        <Route path="/submit" element={<Submit />} />
        <Route path="/myevents" element={<MyEvents user={user} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
