// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../config/axios';

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('access_token');

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error("Logout error:", err);
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  return (
    <nav style={{
      padding: '1rem',
      backgroundColor: '#f1f1f1',
      display: 'flex',
      justifyContent: 'space-between'
    }}>
      <div>
        <Link to="/" style={{ marginRight: '1rem' }}>🏠 Home</Link>
        {isLoggedIn && (
          <>
            <Link to="/dashboard" style={{ marginRight: '1rem' }}>📊 Dashboard</Link>
            <Link to="/profile" style={{ marginRight: '1rem' }}>👤 Profile</Link>
          </>
        )}
      </div>
      <div>
        {isLoggedIn ? (
          <button onClick={handleLogout}>🚪 Logout</button>
        ) : (
          <>
            <Link to="/login"><button>Login</button></Link>
            <Link to="/signup" style={{ marginLeft: '0.5rem' }}><button>Signup</button></Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
