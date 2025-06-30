import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config/axios";

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/profiles/adminprofiles")
      .then((res) => setAdmin(res.data))
      .catch((err) => console.error("Error loading admin profile:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={styles.loadingScreen}>Loading profile...</div>;
  if (!admin) return <div style={styles.errorScreen}>No profile found</div>;

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.title}>👤 Admin Profile</h1>
      </header>

      <main style={styles.main}>
        <div style={styles.card}>
          <div style={styles.picture}>
            {admin.phone_number?.slice(-2).toUpperCase()}
          </div>
          <h2 style={styles.name}>{admin.full_name || "Admin"}</h2>
          <p style={styles.role}>{admin.role?.toUpperCase()}</p>

          <div style={styles.infoRow}>
            <strong>📞 Phone:</strong> {admin.phone_number}
          </div>
          <div style={styles.infoRow}>
            <strong>📧 Email:</strong> {admin.email || "Not provided"}
          </div>
          <div style={styles.infoRow}>
            <strong>🟢 Status:</strong> {admin.status || "active"}
          </div>
        </div>

        <div style={styles.card}>
          <h3 style={styles.subTitle}>About This Account</h3>
          <p style={styles.description}>
            This is a privileged account used to manage the WorkNest platform. Admins can create and manage projects, approve user join requests, assign team members, and monitor progress across the system.
          </p>
        </div>
      </main>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    fontFamily: "'Segoe UI', sans-serif",
    backgroundColor: "#f5f7fa",
    padding: "0rem",
  
  },
  header: {
    backgroundColor: "#223047",
    padding: "1.5rem 2rem",
    color: "#ffffff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    margin: 0,
  },
  main: {
    padding: "2rem",
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
    maxWidth: "800px",
    margin: "0 auto",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "1.8rem",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },
  picture: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    backgroundColor: "#e0e7ff",
    color: "#1d4ed8",
    fontWeight: "700",
    fontSize: "2.5rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "0 auto 1rem",
  },
  name: {
    textAlign: "center",
    fontSize: "1.4rem",
    color: "#111827",
    marginBottom: "0.3rem",
  },
  role: {
    textAlign: "center",
    color: "#6b7280",
    fontWeight: "500",
    marginBottom: "1rem",
  },
  infoRow: {
    fontSize: "1rem",
    color: "#374151",
    margin: "0.4rem 0",
  },
  subTitle: {
    fontSize: "1.2rem",
    fontWeight: "600",
    marginBottom: "0.6rem",
    color: "#1e293b",
  },
  description: {
    fontSize: "1rem",
    color: "#4b5563",
    lineHeight: 1.6,
  },
  loadingScreen: {
    height: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "1.2rem",
    color: "#64748b",
    background: "#f5f7fa",
  },
  errorScreen: {
    height: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "1.2rem",
    color: "#e63946",
    background: "#f5f7fa",
  },
};

export default AdminProfile;
