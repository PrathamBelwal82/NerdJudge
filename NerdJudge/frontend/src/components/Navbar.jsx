// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav>
            <ul>
                {user ? (
                    <>
                        <li><Link to="/home">Home</Link></li>
                        <li><Link to="/problems">Problems</Link></li>
                        <li><Link to="/submissions">Submissions</Link></li>
                        <li><button onClick={logout}>Logout</button></li>
                    </>
                ) : (
                    <>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/register">Register</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
}

export default Navbar;
