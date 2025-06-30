import React, { useEffect, useState } from "react";
import api from "../config/axios";

const ViewProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get("/api/projects/admin");
        if (Array.isArray(res.data)) {
          setProjects(res.data);
        } else {
          setError("Unexpected response format.");
        }
      } catch (err) {
        console.error("❌ Failed to fetch projects:", err);
        setError(err.response?.data?.error || "Could not load projects. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📁 Your Created Projects</h2>

      {loading && <p style={styles.loadingText}>Loading projects...</p>}
      {error && <p style={styles.errorText}>{error}</p>}
      {!loading && !error && projects.length === 0 && (
        <p style={styles.emptyText}>You haven’t created any projects yet.</p>
      )}

      {!loading && !error && projects.length > 0 && (
        <div style={styles.projectsList}>
          {projects.map((project) => (
            <div
              key={project.project_id}
              style={styles.projectCard}
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              <h3 style={styles.projectTitle}>{project.title}</h3>
              <p style={styles.projectDescription}>
                {project.description || "No description provided."}
              </p>
              <p style={styles.projectDetails}>
                <strong>Status:</strong> {project.status || "unknown"}<br />
                <strong>Created:</strong> {project.created_at ? new Date(project.created_at).toLocaleString() : "N/A"}
              </p>

              {/* Skills Display */}
              <div style={styles.skillsContainer}>
                <strong>Required Skills:</strong>
                <div style={styles.skillsList}>
                  {project.skills && project.skills.length > 0 ? (
                    project.skills.map((skill, index) => (
                      <span key={index} style={styles.skillBadge}>
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span style={styles.noSkillsText}>No skills listed</span>
                  )}
                </div>
              </div>

              {/* Join Requests Section */}
              {project.requests && project.requests.length > 0 && (
                <div style={styles.requestsContainer}>
                  <strong>Join Requests:</strong>
                  <ul style={styles.requestsList}>
                    {project.requests.map((req) => (
                      <li key={req.request_id} style={styles.requestItem}>
                        👤 {req.user_name} • <em>{req.status}</em> • {new Date(req.requested_at).toLocaleDateString()}
                        {req.status === "pending" && (
                          <button
                            style={styles.acceptButton}
                            onClick={async () => {
                              try {
                                await api.post(`/api/projects/requests/${req.request_id}/accept`);
                                alert("Request accepted and freelancer assigned!");
                                window.location.reload();
                              } catch (err) {
                                alert("Failed to accept request.");
                                console.error(err);
                              }
                            }}
                          >
                            Accept
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "2rem",
    margin: "0 auto",
    backgroundColor: "#f5f7fa",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        maxWidth:"unset",
    width: "100%",
  },
  heading: {
    marginBottom: "1.5rem",
    color: "#2d3748",
    fontSize: "28px",
  },
  loadingText: {
    fontSize: "18px",
    color: "#666",
  },
  errorText: {
    color: "red",
    fontWeight: "bold",
  },
  emptyText: {
    fontSize: "18px",
    color: "#666",
  },
  projectsList: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  projectCard: {
    background: "#ffffff",
    padding: "1.5rem",
    borderRadius: "10px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    transition: "transform 0.2s",
    cursor: "pointer",
  },
  projectTitle: {
    margin: 0,
    color: "#2d3748",
  },
  projectDescription: {
    margin: "0.3rem 0 0.6rem",
    color: "#444",
  },
  projectDetails: {
    fontSize: "0.9rem",
    color: "#666",
  },
  skillsContainer: {
    marginTop: "0.75rem",
    color: "black",
  },
  skillsList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
    marginTop: "0.4rem",
  },
  skillBadge: {
    background: "#e0e7ff",
    color: "#4338ca",
    padding: "0.3rem 0.7rem",
    borderRadius: "999px",
    fontSize: "0.85rem",
    fontWeight: "500",
  },
  noSkillsText: {
    fontSize: "0.85rem",
    color: "#999",
  },
  requestsContainer: {
    marginTop: "1.5rem",
    color: "black",
  },
  requestsList: {
    marginTop: "0.5rem",
    paddingLeft: "1rem",
    color: "black",
  },
  requestItem: {
    marginBottom: "0.5rem",
    fontSize: "0.95rem",
  },
  acceptButton: {
    marginLeft: "1rem",
    padding: "4px 10px",
    fontSize: "0.8rem",
    backgroundColor: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default ViewProjects;
