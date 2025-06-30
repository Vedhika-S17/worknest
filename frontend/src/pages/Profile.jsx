import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config/axios";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/profiles/profile")
      .then((res) => setProfile(res.data))
      .catch((err) => console.error("Error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-screen">Loading profile...</div>;
  if (!profile) return <div className="error-screen">No profile found</div>;

  return (
    <div className="profile-page">
      <style>{`
        :root {
          font-family: 'Segoe UI', Arial, sans-serif;
          font-size: 16px;
        }

        html, body, #root {
          width:200vh;
          margin: 0;
          padding: 0;
          background: #6fa0ed;
        }

        .profile-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .profile-header {
          background: #223047;
          color: white;
          padding: 1.5rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .profile-title {
          font-size: 1.5rem;
          font-weight: 700;
        }

        .edit-button {
          padding: 0.6rem 1.2rem;
          background: #4361ee;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s;
        }

        .edit-button:hover {
          background: #3a56d4;
          transform: translateY(-1px);
        }

        .profile-content {
          display: flex;
          flex-wrap: wrap;
          gap: 2rem;
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
          box-sizing: border-box;
        }

        .profile-left-column {
          width: 300px;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .profile-details {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .profile-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.04);
          padding: 1.5rem;
          width: 100%;
          box-sizing: border-box;
        }

        .profile-picture {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          background: #e0e7ff;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #4361ee;
          font-size: 3rem;
          font-weight: bold;
          margin: 0 auto;
        }

        .profile-name {
          text-align: center;
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
          color: #223047;
        }

        .profile-role {
          text-align: center;
          color: #64748b;
          margin-bottom: 1rem;
          font-size: 1rem;
        }

        .profile-section-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #223047;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .detail-group {
          margin-bottom: 1rem;
        }

        .detail-label {
          font-size: 0.875rem;
          color: #64748b;
          margin-bottom: 0.3rem;
        }

        .detail-value {
          font-size: 1rem;
          color: #1e293b;
          font-weight: 500;
        }

        .skills-container {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .skill-tag {
          background: #e0e7ff;
          color: #4338ca;
          padding: 0.3rem 0.8rem;
          border-radius: 20px;
          font-size: 0.875rem;
        }

        .loading-screen,
        .error-screen {
          height: 100vh;
          width: 100vw;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 1.2rem;
          color: #64748b;
          background: #f5f7fa;
        }
      `}</style>

      <header className="profile-header">
        <h1 className="profile-title">My Profile</h1>
        <button className="edit-button" onClick={() => navigate("/edit-profile")}>
          Edit Profile
        </button>
      </header>

      <main className="profile-content">
        <div className="profile-left-column">
          <div className="profile-card">
            <div className="profile-picture">
              {profile.full_name?.split(" ").map((n) => n[0]).join("") || "U"}
            </div>
            <h2 className="profile-name">{profile.full_name || "No name"}</h2>
            <p className="profile-role">{profile.title || "No title"}</p>

            <div className="detail-group">
              <div className="detail-label">Hourly Rate</div>
              <div className="detail-value">
                {profile.hourly_rate ? `₹${profile.hourly_rate}` : "Not specified"}
              </div>
            </div>

            <div className="detail-group">
              <div className="detail-label">Location</div>
              <div className="detail-value">{profile.location || "Not specified"}</div>
            </div>
          </div>
        </div>

        <div className="profile-details">
          <div className="profile-card">
            <h3 className="profile-section-title">About</h3>
            <p className="detail-value">{profile.bio || "No bio added yet"}</p>
          </div>

          <div className="profile-card">
            <h3 className="profile-section-title">Experience</h3>
            <div className="detail-group">
              <div className="detail-label">Level</div>
              <div className="detail-value">{profile.experience_level || "Not specified"}</div>
            </div>
            <div className="detail-group">
              <div className="detail-label">Years</div>
              <div className="detail-value">{profile.years_experience || "Not specified"}</div>
            </div>
          </div>

          <div className="profile-card">
            <h3 className="profile-section-title">Languages</h3>
            <div className="skills-container">
              {profile.languages?.length ? (
                profile.languages.map((lang, i) => (
                  <span key={i} className="skill-tag">{lang}</span>
                ))
              ) : (
                <div className="detail-value">No languages specified</div>
              )}
            </div>
          </div>

          <div className="profile-card">
            <h3 className="profile-section-title">Skills</h3>
            <div className="skills-container">
              {profile.skills?.length ? (
                profile.skills.map((skill, i) => (
                  <span key={i} className="skill-tag">{skill}</span>
                ))
              ) : (
                <div className="detail-value">No skills added yet</div>
              )}
            </div>
          </div>

          <div className="profile-card">
            <h3 className="profile-section-title">Education, Experience & Certifications</h3>
            {profile.backgrounds?.length ? (
              profile.backgrounds.map((bg, idx) => (
                <div key={idx} className="detail-group" style={{ marginBottom: "20px" }}>
                  <div className="detail-label" style={{ textTransform: "uppercase", color: "#334155", fontWeight: 700 }}>
                    {bg.type}
                  </div>
                  <div className="detail-label">Title</div>
                  <div className="detail-value">{bg.title || "Not specified"}</div>
                  <div className="detail-label">Description</div>
                  <div className="detail-value">{bg.description || "Not provided"}</div>
                  <div className="detail-label">Duration</div>
                  <div className="detail-value">
                    {bg.from_date ? `From: ${bg.from_date}` : "From: N/A"}<br />
                    {bg.to_date ? `To: ${bg.to_date}` : "To: N/A"}
                  </div>
                </div>
              ))
            ) : (
              <div className="detail-value">No educational or professional background added yet</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
