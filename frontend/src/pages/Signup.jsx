  import React, { useState } from "react";
  import { useNavigate } from "react-router-dom";
  import api from "../config/axios";

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
    maxWidth: "420px",
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

  const selectStyle = {
    ...inputStyle,
    cursor: "pointer",
  };

  const errorStyle = {
    color: "#e63946",
    marginBottom: "1.2rem",
    fontWeight: "bold",
    textAlign: "center",
    width: "100%",
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

  const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
      phone_number: "",
      email: "",
      password: "",
      role: "freelancer", // default
    });

    const [errors, setErrors] = useState("");

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setErrors("");

      try {
        const res = await api.post("/auth/signup", formData);
        localStorage.setItem("access_token", res.data.access_token);
        navigate("/onboarding");
      } catch (err) {
        const msg = err.response?.data?.message || "Signup failed";
        setErrors(msg);
      }
    };

    // Responsive and color fixes for inputs, selects, and placeholders
    const extraStyles = `
      @media (max-width: 600px) {
        .signup-container {
          max-width: 100vw !important;
          padding: 1.5rem 0.5rem !important;
          border-radius: 0 !important;
        }
      }
      input, select {
        color: #222 !important;
        background: #fff !important;
      }
      input::placeholder {
        color: #888 !important;
        opacity: 1;
      }
      select, select option {
        color: #222 !important;
        background: #fff !important;
      }
    `;

    return (
      <div style={outerContainerStyle}>
        <style>{extraStyles}</style>
        <div className="signup-container" style={containerStyle}>
          <h2 style={headingStyle}>Sign Up</h2>
          {errors && <p style={errorStyle}>{errors}</p>}

          <form onSubmit={handleSubmit} autoComplete="off" style={{ width: "100%" }}>
            <label style={labelStyle}>📱 Phone Number</label>
            <input
              type="text"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              style={inputStyle}
              placeholder="e.g. 9876543210"
              required
            />

            <label style={labelStyle}>📧 Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={inputStyle}
              placeholder="your@email.com"
              required
            />

            <label style={labelStyle}>🔒 Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Create a password"
              required
            />

            <label style={labelStyle}>🧑‍💻 Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={selectStyle}
              required
            >
              <option value="freelancer">Freelancer</option>
              <option value="client">Client</option>
            </select>

            <button type="submit" style={buttonStyle}>
              Create My Account
            </button>
          </form>
        </div>
      </div>
    );
  };

  export default Signup;
