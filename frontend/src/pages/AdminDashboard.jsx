import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";

const menuItems = [
  { key: "create-project", label: "Create Project", icon: "➕", path: "create-project" },
  { key: "view-projects", label: "View Projects", icon: "📁", path: "view-projects" },
  { key: "profile", label: "Your Profile", icon: "👤", path: "adminprofile" },
];

const menuItemStyle = {
  width: "100%",
  background: "none",
  border: "none",
  textAlign: "left",
  padding: "0.7rem 1.2rem",
  fontSize: "1rem",
  color: "#223047",
  cursor: "pointer",
  outline: "none",
  transition: "background 0.18s",
  borderRadius: "5px",
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileBtnRef = useRef();
  const location = useLocation();

  const getInitials = () => "AD";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileBtnRef.current && !profileBtnRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };
    if (profileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  };

  return (
    <div style={styles.dashboardGrid}>
      <style>{`
        html, body, #root {
          width: 100vw;
          height: 100vh;
          margin: 0;
          padding: 0;
          overflow: hidden;
          box-sizing: border-box;
        }
        .profile-dropdown {
          position: absolute;
          right: 0;
          top: 48px;
          min-width: 170px;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.13);
          padding: 0.5rem 0;
          z-index: 100;
          animation: fadeIn 0.15s;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px);}
          to { opacity: 1; transform: translateY(0);}
        }
      `}</style>

      <aside style={styles.adminSidebar}>
        <div style={styles.sidebarTitle}>Admin Panel</div>
        <ul style={styles.sidebarMenu}>
          {menuItems.map((item) => (
            <li key={item.key}>
              <NavLink
                to={item.path}
                style={({ isActive }) => ({
                  ...styles.sidebarMenuItem,
                  background: isActive ? "#34495e" : "none",
                })}
              >
                <span>{item.icon}</span>
                <span className="label">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </aside>

      <header style={styles.adminTopbar}>
        <div style={{ position: "relative" }} ref={profileBtnRef}>
          <button
            style={styles.profileBtn}
            onClick={() => setProfileMenuOpen((v) => !v)}
            aria-haspopup="true"
            aria-expanded={profileMenuOpen}
            aria-label="Open profile menu"
          >
            {getInitials()}
          </button>
          {profileMenuOpen && (
            <div className="profile-dropdown" role="menu">
              <button
                style={menuItemStyle}
                onClick={() => {
                  setProfileMenuOpen(false);
                  navigate("adminprofile");
                }}
              >
                👤 View Profile
              </button>
              <button style={menuItemStyle} onClick={() => setProfileMenuOpen(false)}>
                ❓ Help
              </button>
              <button style={menuItemStyle} onClick={() => setProfileMenuOpen(false)}>
                ⚙️ Settings
              </button>
              <hr style={{ margin: "0.4rem 0", border: "none", borderTop: "1px solid #eee" }} />
              <button
                style={menuItemStyle}
                onClick={() => {
                  setProfileMenuOpen(false);
                  handleLogout();
                }}
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <main style={styles.adminMainContent}>
        {/* Show Welcome panel ONLY on /admindashboard */}
        {location.pathname === "/admindashboard" && (
          <div
            style={{
              background: "#fff",
              padding: "24px",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
              marginBottom: "24px",
            }}
          >
            <h2 style={{ margin: "0 0 12px", color: "#223047" }}>Welcome, Admin!</h2>
            <p style={{ margin: "0 0 16px", color: "#5f6c7b" }}>
              Here's a quick overview of your admin dashboard. Use the menu to create new projects, manage existing ones, or update your profile.
            </p>
            <div
              style={{
                display: "flex",
                gap: "24px",
                marginTop: "16px",
                flexWrap: "wrap",
              }}
            >
              <div style={infoCardStyle}>
                <div style={{ fontSize: "1.4rem", marginBottom: "4px" }}>📁 12</div>
                <div style={{ color: "#34495e" }}>Total Projects</div>
              </div>
              <div style={infoCardStyle}>
                <div style={{ fontSize: "1.4rem", marginBottom: "4px" }}>🕒 3</div>
                <div style={{ color: "#34495e" }}>Pending Reviews</div>
              </div>
              <div style={infoCardStyle}>
                <div style={{ fontSize: "1.4rem", marginBottom: "4px" }}>👤 Admin</div>
                <div style={{ color: "#34495e" }}>Current Role</div>
              </div>
            </div>
          </div>
        )}
        <Outlet />
      </main>
    </div>
  );
};

const infoCardStyle = {
  flex: "1 1 160px",
  background: "#f1f4f9",
  padding: "16px",
  borderRadius: "8px",
  textAlign: "center",
};

const styles = {
  dashboardGrid: {
    display: "grid",
    gridTemplateColumns: "220px 1fr",
    gridTemplateRows: "64px 1fr",
    height: "100vh",
    width: "100vw",
    background: "#f5f7fa",
  },
  adminSidebar: {
    gridRow: "1 / span 2",
    background: "#222f3e",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    padding: "32px 18px 0 18px",
    overflow: "hidden",
  },
  sidebarTitle: {
    fontSize: "1.3rem",
    fontWeight: "bold",
    marginBottom: "32px",
    letterSpacing: "1px",
  },
  sidebarMenu: {
    width: "100%",
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  sidebarMenuItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    borderRadius: "6px",
    fontSize: "1.06rem",
    color: "inherit",
    textAlign: "left",
    cursor: "pointer",
    transition: "background 0.2s",
    textDecoration: "none",
  },
  adminTopbar: {
    gridColumn: "2 / 3",
    gridRow: "1 / 2",
    height: "64px",
    background: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 32px",
    boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
    zIndex: 2,
  },
  profileBtn: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "#4361ee",
    color: "#fff",
    border: "none",
    fontWeight: 700,
    fontSize: "1.1rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "16px",
    position: "relative",
  },
  adminMainContent: {
    gridColumn: "2 / 3",
    gridRow: "2 / 3",
    padding: "40px 5vw",
    overflow: "auto",
    display: "flex",
    flexDirection: "column",
  },
};

export default AdminDashboard;
