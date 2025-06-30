import React, { useState, useEffect } from "react";
import api from "../config/axios";

const CreateProject = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "pending",
    skill_ids: [],
  });

  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await api.get("/skills/all");
        setSkills(res.data);
      } catch (err) {
        console.error("Failed to fetch skills:", err);
      }
    };
    fetchSkills();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccessMsg("");
  };

  const handleSkillToggle = (id) => {
    setForm((f) => ({
      ...f,
      skill_ids: f.skill_ids.includes(id)
        ? f.skill_ids.filter((s) => s !== id)
        : [...f.skill_ids, id],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const payload = {
        title: form.title,
        description: form.description,
        status: form.status,
        skill_ids: form.skill_ids,
      };

      await api.post("/api/projects", payload);

      setSuccessMsg("Project created successfully!");
      setForm({
        title: "",
        description: "",
        status: "pending",
        skill_ids: [],
      });
    } catch (err) {
      const errorMessage =
        err.response?.data?.errors?.title?.[0] ||
        err.response?.data?.error ||
        "Failed to create project";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Create a New Project</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            style={styles.input}
            placeholder="Project title"
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            style={styles.textarea}
            placeholder="Project description"
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            style={styles.select}
          >
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Required Skills</label>
          <div style={styles.skillsContainer}>
            {skills.map((skill) => (
              <label key={skill.skill_id} style={styles.skillLabel}>
                <input
                  type="checkbox"
                  checked={form.skill_ids.includes(skill.skill_id)}
                  onChange={() => handleSkillToggle(skill.skill_id)}
                  style={styles.checkbox}
                />
                {skill.name}
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={styles.submitButton}
        >
          {loading ? "Creating..." : "Create Project"}
        </button>

        {error && <div style={styles.error}>{error}</div>}
        {successMsg && <div style={styles.success}>{successMsg}</div>}
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "2rem",
    backgroundColor: "#f5f7fa",
    minHeight: "100vh",

  },
  heading: {
    color: "#2d3748",
    marginBottom: "25px",
    fontSize: "24px",
  },
  form: {
    width: "100%",
    maxWidth: "600px",
    background: "white",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  inputGroup: {
    marginBottom: "20px",
    width: "95%",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    color: "#4a5568",
    fontWeight: 500,
  },
  input: {
    width: "100%",
    padding: "12px",
    border: "1px solid #e2e8f0",
    borderRadius: "6px",
    fontSize: "16px",
  },
  textarea: {
    width: "100%",
    padding: "12px",
    border: "1px solid #e2e8f0",
    borderRadius: "6px",
    fontSize: "16px",
    minHeight: "100px",
  },
  select: {
    width: "100%",
    padding: "12px",
    border: "1px solid #e2e8f0",
    borderRadius: "6px",
    fontSize: "16px",
  },
  skillsContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  },
  skillLabel: {
    display: "flex",
    color: "black",
    alignItems: "center",
    gap: "6px",
    padding: "8px 12px",
    backgroundColor: "#f7fafc",
    borderRadius: "6px",
    border: "1px solid #e2e8f0",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  checkbox: {
  width: "16px",
  height: "16px",
  border: "1px solid #cbd5e0",
  borderRadius: "3px",
  cursor: "pointer",
  accentColor: "#4361ee", 
},
  submitButton: {
    width: "100%",
    backgroundColor: "#4361ee",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: 600,
    cursor: "pointer",
  },
  error: {
    marginTop: "15px",
    padding: "12px",
    borderRadius: "6px",
    backgroundColor: "#fff5f5",
    color: "#e53e3e",
    border: "1px solid #fc8181",
  },
  success: {
    marginTop: "15px",
    padding: "12px",
    borderRadius: "6px",
    backgroundColor: "#f0fff4",
    color: "#38a169",
    border: "1px solid #9ae6b4",
  },
};

export default CreateProject;
