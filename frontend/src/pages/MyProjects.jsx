import React, { useEffect, useState } from "react";
import api from "../config/axios";

const MyProjects = () => {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAssignedProjects();
  }, []);

  const fetchAssignedProjects = async () => {
    try {
      const res = await api.get("/api/projects/assigned");
      setProjects(res.data || []);
    } catch (err) {
      console.error("Failed to load projects", err);
      setError("Failed to load your assigned projects.");
    }
  };

  const handleMarkComplete = async (projectId) => {
    try {
      const res = await api.post(`/api/projects/${projectId}/complete`);
      alert(res.data.message || "Project marked as completed");
      fetchAssignedProjects(); // Refresh list
    } catch (err) {
      alert("❌ Failed to update project status.");
      console.error(err);
    }
  };

  return (
    <div
      style={{
        minHeight: "95vh",
        padding: "2rem",
        backgroundColor: "#6fa0ed",
        width: "100vw",
      }}
    >
      <style>{`
        html, body, #root {
          width: 100vw;
          height: 100vh;
          margin: 0;
          padding: 0;
          overflow-x: hidden;
          box-sizing: border-box;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h2
          style={{
            marginBottom: "2rem",
            color: "#1e293b",
            fontSize: "2rem",
            fontWeight: "700",
            lineHeight: "1.2",
          }}
        >
          🧑‍💻 My Assigned Projects
        </h2>

        {error && (
          <p style={{ color: "#ef4444", fontSize: "1rem", fontWeight: "bold" }}>
            {error}
          </p>
        )}
        {!error && projects.length === 0 && (
          <div
            style={{
              padding: "2rem",
              backgroundColor: "#fff",
              borderRadius: "0.5rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              textAlign: "center",
            }}
          >
            <p style={{ color: "#64748b", fontSize: "1.1rem" }}>
              You haven’t been assigned to any projects yet.
            </p>
          </div>
        )}

        {!error && projects.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {projects.map((project) => (
              <div
                key={project.project_id}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "0.75rem",
                  padding: "1.5rem",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  borderLeft: `4px solid ${
                    project.status === "completed"
                      ? "#10b981"
                      : project.status === "active"
                      ? "#3b82f6"
                      : "#f59e0b"
                  }`,
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
                }}
              >
                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      margin: "0 0 0.5rem 0",
                      fontSize: "1.25rem",
                      color: "#1e293b",
                      fontWeight: "600",
                    }}
                  >
                    {project.title}
                  </h3>
                  <p
                    style={{
                      margin: "0 0 1rem 0",
                      color: "#64748b",
                      lineHeight: 1.5,
                    }}
                  >
                    {project.description || "No description available."}
                  </p>
                </div>
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "1rem",
                    }}
                  >
                    <span
                      style={{
                        backgroundColor:
                          project.status === "completed"
                            ? "#ecfdf5"
                            : project.status === "active"
                            ? "#eff6ff"
                            : "#fffbeb",
                        color:
                          project.status === "completed"
                            ? "#047857"
                            : project.status === "active"
                            ? "#1d4ed8"
                            : "#b45309",
                        padding: "0.25rem 0.75rem",
                        borderRadius: "9999px",
                        fontWeight: "500",
                        fontSize: "0.875rem",
                      }}
                    >
                      {project.status}
                    </span>
                    <span
                      style={{
                        color: "#64748b",
                        fontSize: "0.875rem",
                      }}
                    >
                      Assigned:{" "}
                      {project.assigned_at
                        ? new Date(project.assigned_at).toLocaleString()
                        : "N/A"}
                    </span>
                  </div>
                  <div
                    style={{
                      color: "#64748b",
                      fontSize: "0.875rem",
                    }}
                  >
                    <strong>Progress:</strong> {project.progress_status || "N/A"}
                  </div>
                </div>
                {project.skills && project.skills.length > 0 && (
                  <div>
                    <div
                      style={{
                        fontSize: "0.9rem",
                        fontWeight: "500",
                        color: "#475569",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Required Skills:
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.5rem",
                      }}
                    >
                      {project.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          style={{
                            backgroundColor: "#e0e7ff",
                            color: "#1d4ed8",
                            padding: "4px 10px",
                            borderRadius: "9999px",
                            fontSize: "0.8rem",
                            fontWeight: 500,
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {project.status !== "completed" && (
                  <button
                    onClick={() => handleMarkComplete(project.project_id)}
                    style={{
                      width: "100%",
                      padding: "0.625rem",
                      backgroundColor: "#10b981",
                      color: "white",
                      border: "none",
                      borderRadius: "0.5rem",
                      cursor: "pointer",
                      fontWeight: "500",
                      fontSize: "1rem",
                      transition: "background-color 0.2s",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.backgroundColor = "#059669")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.backgroundColor = "#10b981")
                    }
                  >
                    ✅ Mark as Completed
                  </button>
                )}
                {project.status === "completed" && (
                  <p
                    style={{
                      color: "#10b981",
                      fontWeight: "bold",
                      marginTop: "0.5rem",
                    }}
                  >
                    ✅ Project Completed
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProjects;
