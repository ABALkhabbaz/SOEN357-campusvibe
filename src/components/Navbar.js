import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav style={{ padding: '10px', background: '#f2f2f2' }}>
            <Link to="/" style={{ marginRight: '20px' }}>Home</Link>
            <Link to="/events" style={{ marginRight: '20px' }}>Events</Link>
            <Link to="/submit">Submit</Link>
        </nav>
    );
}

export default Navbar;
