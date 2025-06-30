import React from 'react';
import { Link } from 'react-router-dom';

// Styles
const outerContainerStyle = {
  minHeight: "100vh",
  width: "100vw",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(120deg, #4361ee 0%, #48bfe3 100%)",
  boxSizing: "border-box",
};

const containerStyle = {
  width: "100%",
  maxWidth: "800px",
  padding: "2.5rem 2rem",
  fontFamily: "Segoe UI, Arial, sans-serif",
  backgroundColor: "rgba(255,255,255,0.92)",
  borderRadius: "16px",
  boxShadow: "0 4px 24px rgba(0,0,0,0.09)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  boxSizing: "border-box",
  textAlign: "center",
};

const headingStyle = {
  fontSize: "2.2rem",
  color: "#22223b",
  marginBottom: "1rem",
  fontWeight: 700,
  letterSpacing: "1px",
};

const subTextStyle = {
  fontSize: "1.1rem",
  color: "#22223b",
  marginBottom: "2.2rem",
  fontWeight: 500,
};

const buttonGroupStyle = {
  display: "flex",
  justifyContent: "center",
  gap: "1rem",
  marginTop: "1rem",
  width: "100%",
};

const buttonStyle = {
  backgroundColor: "#4361ee",
  color: "white",
  padding: "0.85rem 2.2rem",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "1.1rem",
  fontWeight: "bold",
  letterSpacing: "0.5px",
  transition: "background 0.2s",
  boxShadow: "0 2px 8px rgba(67,97,238,0.08)",
};

const Home = () => {
  // Responsive: Add a <style> tag for media queries
  const extraStyles = `
    @media (max-width: 600px) {
      .home-container {
        max-width: 100vw !important;
        padding: 1.5rem 0.5rem !important;
        border-radius: 0 !important;
      }
      .home-btn-group {
        flex-direction: column !important;
        gap: 0.8rem !important;
      }
    }
  `;

  return (
    <div style={outerContainerStyle}>
      <style>{extraStyles}</style>
      <style>{`
        html, body, #root {
          width: 100vw;
          height: 100vh;
          margin: 0;
          padding: 0;
          overflow: hidden;
          box-sizing: border-box;
        }`}</style>
      <div className="home-container" style={containerStyle}>
        <h1 style={headingStyle}>🚀 Welcome to WorkNest</h1>
        <p style={subTextStyle}>The internal freelancer & project platform</p>
        <div className="home-btn-group" style={buttonGroupStyle}>
          <Link to="/signup">
            <button style={buttonStyle}>Sign Up</button>
          </Link>
          <Link to="/login">
            <button style={buttonStyle}>Log In</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
