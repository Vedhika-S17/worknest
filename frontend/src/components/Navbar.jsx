// src/components/Navbar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const path = location.pathname;

  const hideDashboardLink = 
    path === '/' ||
    path === '/login' ||
    path === '/signup' ||
    path.startsWith('/onboarding') ||
    path.startsWith('/admindashboard');

  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>
        <Link to="/" style={styles.logoLink}>WorkNest</Link>
      </div>

      {!hideDashboardLink && (
        <div style={styles.rightLinks}>
          <Link to="/dashboard" style={styles.dashboardLink}>Dashboard</Link>
        </div>
      )}
    </nav>
  );
};

const styles = {
  navbar: {
    padding: '1.5rem 2rem',
    backgroundColor: 'rgb(33, 33, 33)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontFamily: "'Segoe UI', sans-serif",
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  logoLink: {
    color: '#ffffff',
    textDecoration: 'none',
  },
  rightLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  dashboardLink: {
    color: '#ffffff',
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: '500',
  },
};

export default Navbar;
