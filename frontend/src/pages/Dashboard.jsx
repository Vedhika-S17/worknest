import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config/axios";

const SIDEBAR_WIDTH = 220;

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

const Dashboard = () => {
  const [user, setUser ] = useState(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileBtnRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser  = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser (res.data);
      } catch (err) {
        setError("Session expired or not logged in");
      }
    };
    fetchUser ();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileBtnRef.current &&
        !profileBtnRef.current.contains(event.target)
      ) {
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

  const getInitials = (user) => {
    if (!user) return "U";
    if (user.name) {
      return user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (user.phone_number) return user.phone_number[0].toUpperCase();
    return "U";
  };

  const sections = [
    { id: 1, title: "Recommended Jobs", content: "Personalized based on your skills: Loading..." },
    { id: 2, title: "Recent Applications", content: "Track your recent job applications here." },
    { id: 3, title: "Skills Dashboard", content: "See how your skills match with job requirements." },
  ];

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error("Logout error:", err);
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  return (
    <div className="dashboard-grid">
      <style>{`
        html, body, #root {
          width: 100vw;
          height: 100vh;
          margin: 0;
          padding: 0;
          overflow-x: hidden;
          box-sizing: border-box;
        }
        .dashboard-grid {
          display: grid;
          grid-template-columns: ${SIDEBAR_WIDTH}px 1fr;
          grid-template-rows: 64px 1fr;
          height: 100vh;
          width: 100vw;
          background: #f5f7fa;
        }
        .sidebar {
          grid-row: 1 / span 2;
          background: #223047;
          color: #fff;
          padding: 32px 18px 0 18px;
          display: flex;
          flex-direction: column;
          gap: 32px;
          min-width: ${SIDEBAR_WIDTH}px;
        }
        .sidebar-header {
          font-size: 1.45 rem;
          font-weight: 700;
          margin-bottom: 18px;
          letter-spacing: 1px;
        }
        .nav-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .nav-link {
          padding: 12px 14px;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 1.08rem;
          transition: background 0.2s;
        }
        .nav-link.active, .nav-link:hover {
          background: #34495e;
        }
        .topbar {
          grid-column: 2 / 3;
          grid-row: 1 / 2;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding: 0 32px;
          box-shadow: 0 1px 6px rgba(0,0,0,0.04);
          z-index: 2;
          position: relative;
        }
        .profile-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #223047;
          color: #fff;
          border: none;
          font-weight: 700;
          font-size: 1.1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.12);
          transition: box-shadow 0.2s;
          position: relative;
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
        .main-content {
          grid-column: 2 / 3;
          grid-row: 2 / 3;
          padding: 40px 5vw 40px 5vw;
          overflow-y: auto;
          width: 100%;
          box-sizing: border-box;
        }
        .dashboard-section {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.04);
          padding: 28px 24px;
          margin-bottom: 28px;
        }
        .section-title {
          font-size: 1.2rem;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        @media (max-width: 800px) {
          .dashboard-grid {
            grid-template-columns: 70px 1fr;
          }
          .sidebar-header, .nav-link span {
            display: none;
          }
          .sidebar {
            padding: 20px 6px 0 6px;
            min-width: 70px;
          }
        }
        @media (max-width: 600px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
            grid-template-rows: 64px 1fr 70px;
          }
          .sidebar {
            flex-direction: row;
            height: 70px;
            width: 100vw;
            box-shadow: none;
            padding: 10px 0 0 0;
            justify-content: center;
            gap: 0;
            grid-row: 3 / 4;
            grid-column: 1 / 2;
            min-width: 0;
          }
          .main-content {
            padding: 20px 2vw;
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px);}
          to { opacity: 1; transform: translateY(0);}
        }
      `}</style>
      <aside className="sidebar">
        <div className="sidebar-header">WorkFinder</div>
        <ul className="nav-links">
          <li className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <span role="img" aria-label="dashboard">📊</span>
            <span>Dashboard</span>
          </li>
          <li className={`nav-link ${activeTab === 'jobs' ? 'active' : ''}`} onClick={() => setActiveTab('jobs')}>
            <span role="img" aria-label="jobs">💼</span>
            <span>Browse Jobs</span>
          </li>
          <li className={`nav-link ${activeTab === 'companies' ? 'active' : ''}`} onClick={() => setActiveTab('companies')}>
            <span role="img" aria-label="companies">🏢</span>
            <span>Companies</span>
          </li>
          <li className={`nav-link ${activeTab === 'messages' ? 'active' : ''}`} onClick={() => setActiveTab('messages')}>
            <span role="img" aria-label="messages">✉️</span>
            <span>Messages</span>
          </li>
          <li className={`nav-link ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
            <span role="img" aria-label="settings">⚙️</span>
            <span>Settings</span>
          </li>
        </ul>
      </aside>
      <header className="topbar">
        <div style={{ position: "relative" }} ref={profileBtnRef}>
          <button
            className="profile-btn"
            onClick={() => setProfileMenuOpen((v) => !v)}
            aria-haspopup="true"
            aria-expanded={profileMenuOpen}
            aria-label="Open profile menu"
          >
            {getInitials(user)}
          </button>
          {profileMenuOpen && (
            <div className="profile-dropdown" role="menu">
              <button
                style={menuItemStyle}
                onClick={() => {
                  setProfileMenuOpen(false);
                  navigate("/profile");
                }}
              >
                👤 View Profile
              </button>
              <button
                style={menuItemStyle}
                onClick={() => {
                  setProfileMenuOpen(false);
                }}
              >
                ❓ Help
              </button>
              <button
                style={menuItemStyle}
                onClick={() => {
                  setProfileMenuOpen(false);
                }}
              >
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
      <main className="main-content">
        {error && (
          <div style={{
            background: "#ffeaea",
            color: "#c0392b",
            borderRadius: "8px",
            padding: "1rem",
            marginBottom: "1.5rem",
            fontWeight: "bold"
          }}>{error}</div>
        )}
        {activeTab === 'dashboard' && sections.map(section => (
          <div key={section.id} className="dashboard-section">
            <div className="section-title">
              {section.id === 1 ? '🌟' : section.id === 2 ? '📝' : '📊'} {section.title}
            </div>
            <p>{section.content}</p>
          </div>
        ))}
        {activeTab !== 'dashboard' && (
          <div className="dashboard-section">
            <div className="section-title">
              {activeTab === 'jobs' ? '💼 Browse Jobs' : 
               activeTab === 'companies' ? '🏢 Companies' :
               activeTab === 'messages' ? '✉️ Messages' : '⚙️ Settings'}
            </div>
            <p>This section is under construction. Content will be added soon.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
