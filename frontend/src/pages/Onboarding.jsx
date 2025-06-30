import { useEffect, useState } from "react";
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
  maxWidth: "620px",
  padding: "2.5rem 2rem",
  fontFamily: "Segoe UI, Arial, sans-serif",
  backgroundColor: "rgba(255,255,255,0.96)",
  borderRadius: "14px",
  boxShadow: "0 4px 24px rgba(0,0,0,0.09)",
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
  fontWeight: 700,
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

const textareaStyle = {
  ...inputStyle,
  minHeight: "80px",
  resize: "vertical",
};

const checkboxGroupStyle = {
  display: "flex",
  flexDirection: "column",
  marginBottom: "1.2rem",
};

const checkboxLabelStyle = {
  marginBottom: "0.6rem",
  fontSize: "1rem",
  color: "#444",
  cursor: "pointer",
  fontWeight: "500",
  display: "flex",
  alignItems: "center",
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

const extraStyles = `
  @media (max-width: 600px) {
    .onboarding-container {
      max-width: 100vw !important;
      padding: 1.5rem 0.5rem !important;
      border-radius: 0 !important;
    }
  }
`;

const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

const Onboarding = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    title: "",
    bio: "",
    experience_level: "",
    goal: "",
    work_type: [],
    hourly_rate: "",
    location: "",
    availability: "",
    profile_image: "",
    languages: ""
  });

  const [error, setError] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigate = useNavigate();

  const role = localStorage.getItem("role");

  useEffect(() => {
    // Extract phone number from JWT token in localStorage
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = parseJwt(token);
      if (decoded && decoded.phone_number) {
        setPhoneNumber(decoded.phone_number);
      }
    }
  }, []);

  const toggleWorkType = (value) => {
    setFormData((prev) => ({
      ...prev,
      work_type: prev.work_type.includes(value)
        ? prev.work_type.filter((v) => v !== value)
        : [...prev.work_type, value]
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !formData.full_name ||
      !formData.goal ||
      (role !== "admin" && (!formData.experience_level || formData.work_type.length === 0))
    ) {
      setError("Please fill all required fields (*)");
      return;
    }

    const payload = {
      phone_number: phoneNumber, // Include phone number in the payload
      ...formData,
      work_type: formData.work_type.join(","),
      languages: formData.languages.split(",").map((l) => l.trim()).filter(Boolean),
      hourly_rate: formData.hourly_rate || null
    };

    try {
      await api.post("/api/onboarding/debug-onboarding", payload, {
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (role === "admin") {
        navigate("/admindashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save onboarding data");
    }
  };

  return (
    <div style={outerContainerStyle}>
      <style>{extraStyles}</style>
      <style>{`
        html, body, #root {
          width: 100vw;
          height: 100vh;
          margin: 0;
          padding: 0;
          overflow-x: hidden;
          box-sizing: border-box;
        }`}</style>
      <div className="onboarding-container" style={containerStyle}>
        <h2 style={headingStyle}>👋 Complete Your Profile</h2>
        {error && <p style={errorStyle}>{error}</p>}

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <label style={labelStyle}>Full Name *</label>
          <input
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            style={inputStyle}
            required
          />

          {role !== "admin" && (
            <>
              <label style={labelStyle}>Title</label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                style={inputStyle}
              />

              <label style={labelStyle}>Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                style={textareaStyle}
              />

              <label style={labelStyle}>Experience Level *</label>
              <select
                name="experience_level"
                value={formData.experience_level}
                onChange={handleChange}
                style={inputStyle}
                required
              >
                <option value="">Select...</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="expert">Expert</option>
              </select>

              <div style={checkboxGroupStyle}>
                <span style={labelStyle}>Work Type *</span>
                <label style={checkboxLabelStyle}>
                  <input
                    type="checkbox"
                    value="marketplace"
                    checked={formData.work_type.includes("marketplace")}
                    onChange={(e) => toggleWorkType(e.target.value)}
                    style={{ marginRight: "0.6em" }}
                  />
                  Marketplace
                </label>
                <label style={checkboxLabelStyle}>
                  <input
                    type="checkbox"
                    value="project_catalog"
                    checked={formData.work_type.includes("project_catalog")}
                    onChange={(e) => toggleWorkType(e.target.value)}
                    style={{ marginRight: "0.6em" }}
                  />
                  Project Catalog
                </label>
                <label style={checkboxLabelStyle}>
                  <input
                    type="checkbox"
                    value="contract_to_hire"
                    checked={formData.work_type.includes("contract_to_hire")}
                    onChange={(e) => toggleWorkType(e.target.value)}
                    style={{ marginRight: "0.6em" }}
                  />
                  Contract-to-Hire
                </label>
              </div>

              <label style={labelStyle}>Hourly Rate</label>
              <input
                type="number"
                name="hourly_rate"
                value={formData.hourly_rate}
                onChange={handleChange}
                style={inputStyle}
              />

              <label style={labelStyle}>Location</label>
              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                style={inputStyle}
              />

              <label style={labelStyle}>Availability</label>
              <input
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                style={inputStyle}
              />

              <label style={labelStyle}>Languages (comma separated)</label>
              <input
                name="languages"
                value={formData.languages}
                onChange={handleChange}
                style={inputStyle}
                placeholder="English, Spanish"
              />
            </>
          )}

          <label style={labelStyle}>Goal *</label>
          <select
            name="goal"
            value={formData.goal}
            onChange={handleChange}
            style={inputStyle}
            required
          >
            <option value="">Select...</option>
            <option value="main_income">Main Income</option>
            <option value="side_income">Side Income</option>
            <option value="gain_experience">Gain Experience</option>
            <option value="explore">Exploring</option>
          </select>

          <label style={labelStyle}>Profile Image URL</label>
          <input
            name="profile_image"
            value={formData.profile_image}
            onChange={handleChange}
            style={inputStyle}
          />

          <button type="submit" style={buttonStyle}>
            Complete Onboarding
          </button>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
