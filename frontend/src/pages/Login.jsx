import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/axios';

// === Styles ===
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
  backgroundColor: "#f9fafd",
  borderRadius: "12px",
  boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  boxSizing: "border-box",
  
};

const headingStyle = {
  textAlign: "center",
  color: "#22223b",
  marginBottom: "1.5rem",
  letterSpacing: "1px",
  width: "100%",
};

const labelStyle = {
  display: "block",
  marginBottom: "0.3rem",
  fontWeight: "600",
  color: "#3a3a3a",
  letterSpacing: "0.2px",
  width: "100%",
};

const inputStyle = {
  width: "100%",
  padding: "0.7rem",
  marginBottom: "1.2rem",
  borderRadius: "5px",
  border: "1px solid #c9c9c9",
  fontSize: "1rem",
  backgroundColor: "#fff",
  color: "#222",
  transition: "border 0.2s",
  outline: "none",
  boxSizing: "border-box",
};

const buttonStyle = {
  backgroundColor: "#4361ee",
  color: "white",
  padding: "0.85rem",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "1.05rem",
  fontWeight: "bold",
  width: "100%",
  marginTop: "0.5rem",
  boxShadow: "0 2px 8px rgba(67,97,238,0.08)",
  letterSpacing: "0.5px",
  transition: "background 0.2s",
};

const messageStyle = (isSuccess) => ({
  color: isSuccess ? "green" : "#e63946",
  marginTop: "1.2rem",
  fontWeight: "bold",
  textAlign: "center",
  width: "100%",
});

// === Component ===
const Login = () => {
  const [formData, setFormData] = useState({
    phone_number: '',
    password: ''
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await api.post('/auth/login', formData, {
        headers: { 'Content-Type': 'application/json' }
      });

      const { access_token, role } = res.data;

      localStorage.setItem('access_token', access_token);
      localStorage.setItem('role', role);

      setMessage('Login successful');
      console.log(`✅ Login complete. Redirecting to ${role === 'admin' ? '/admin' : '/dashboard'}...`);

      navigate(role === 'admin' ? '/admindashboard' : '/dashboard');
    } catch (err) {
      console.error('Login failed:', err.response?.data || err.message);
      setMessage(err.response?.data?.error || 'Invalid phone or password');
    }
  };

  const extraStyles = `
    @media (max-width: 600px) {
      .login-container {
        max-width: 100vw !important;
        padding: 1.5rem 0.5rem !important;
        border-radius: 0 !important;
      }
    }
    input, select, textarea {
      color: #222 !important;
      background: #fff !important;
    }
    input::placeholder, textarea::placeholder {
      color: #888 !important;
      opacity: 1;
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
      <div className="login-container" style={containerStyle}>
        <h2 style={headingStyle}>🔐 Login</h2>
        <form onSubmit={handleSubmit} autoComplete="off" style={{ width: "100%" }}>
          <label style={labelStyle}>📱 Phone Number</label>
          <input
            type="text"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            style={inputStyle}
            placeholder="Phone Number"
            required
          />

          <label style={labelStyle}>🔒 Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            style={inputStyle}
            placeholder="Password"
            required
          />

          <button type="submit" style={buttonStyle}>Login</button>
        </form>

        {message && (
          <p style={messageStyle(message.includes("successful"))}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
