import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config/axios";

const EditProfile = () => {
  const [backgrounds, setBackgrounds] = useState([
    { type: "education", title: "", description: "", from_date: "", to_date: "" },
  ]);
  const [skills, setSkills] = useState([]);
  const [availableSkills, setAvailableSkills] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/skills/all").then((res) => setAvailableSkills(res.data));
  }, []);

  const handleBgChange = (index, field, value) => {
    const newBgs = [...backgrounds];
    newBgs[index][field] = value;
    setBackgrounds(newBgs);
  };

  const handleAddBackground = () => {
    setBackgrounds([...backgrounds, { type: "education", title: "", description: "", from_date: "", to_date: "" }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/profiles/edit-details", {
        backgrounds,
        skills,
      });
      alert("Profile updated successfully!");
      navigate("/profile");
    } catch (err) {
      console.error("Error updating:", err);
      alert("Error updating profile");
    }
  };

  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      padding: '2rem',
      background: '#6fa0ed',
      overflow: 'auto',
      color: '#2d3748' // Ensure text is dark enough
    }}>
      <style>{`
        html, body, #root {
            width: 100vw;
            height: 100vh;
            margin: 0;
            padding: 0;
            overflow-x: hidden;
            box-sizing: border-box;`
        }</style>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '16px',
        padding: '2rem',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{
          textAlign: 'center',
          marginBottom: '2rem',
          color: '#2c3e50',
          fontSize: '2rem',
          fontWeight: '600',
          position: 'relative',
          paddingBottom: '1rem'
        }}>
          Edit Profile Details
          <div style={{
            position: 'absolute',
            bottom: '0',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80px',
            height: '4px',
            background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)',
            borderRadius: '2px'
          }}></div>
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '2rem' }}>
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
          }}>
            <h3 style={{
              color: '#6a11cb',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2s3.5 2 3.5 5l-.5 1h-6l-.5-1c0-3 3.5-5 3.5-5z"></path>
                <path d="M4 15h16v3l2 2v1H2v-1l2-2z"></path>
                <path d="M10 15l4-4s3 4 5 4"></path>
              </svg>
              Backgrounds
            </h3>
            
            <div style={{ display: 'grid', gap: '1rem' }}>
              {backgrounds.map((bg, index) => (
                <div key={index} style={{
                  backgroundColor: 'white',
                  padding: '1rem',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  display: 'grid',
                  gap: '0.75rem'
                }}>
                  <select 
                    value={bg.type} 
                    onChange={(e) => handleBgChange(index, "type", e.target.value)}
                    style={{
                      padding: '0.75rem',
                      borderRadius: '6px',
                      border: '1px solid #e9ecef',
                      background: 'white',
                      fontSize: '1rem',
                      appearance: 'none',
                      backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 0.75rem center',
                      backgroundSize: '1rem',
                      color: '#2d3748' // Dark text for better visibility
                    }}
                  >
                    <option value="education">Education</option>
                    <option value="certification">Certification</option>
                    <option value="experience">Experience</option>
                  </select>
                  
                  <input 
                    type="text" 
                    placeholder="Title" 
                    value={bg.title} 
                    onChange={(e) => handleBgChange(index, "title", e.target.value)}
                    style={{
                      padding: '0.75rem',
                      borderRadius: '6px',
                      border: '1px solid #e9ecef',
                      fontSize: '1rem',
                      boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)',
                      color: 'white' 
                    }}
                  />
                  
                  <textarea
                    placeholder="Description"
                    value={bg.description}
                    onChange={(e) => handleBgChange(index, "description", e.target.value)}
                    style={{
                      padding: '0.75rem',
                      
                      borderRadius: '6px',
                      border: '1px solid #e9ecef',
                      fontSize: '1rem',
                      minHeight: '80px',
                      resize: 'vertical',
                      boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)',
                      color: 'white'
                    }}
                  />
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <input 
                      type="date" 
                      placeholder="From" 
                      value={bg.from_date} 
                      onChange={(e) => handleBgChange(index, "from_date", e.target.value)}
                      style={{
                        padding: '0.75rem',
                        borderRadius: '6px',
                        border: '1px solid #e9ecef',
                        fontSize: '1rem',
                        color: 'white' // Dark text
                      }}
                    />
                    <input 
                      type="date" 
                      placeholder="To" 
                      value={bg.to_date} 
                      onChange={(e) => handleBgChange(index, "to_date", e.target.value)}
                      style={{
                        padding: '0.75rem',
                        borderRadius: '6px',
                        border: '1px solid #e9ecef',
                        fontSize: '1rem',
                        color: 'white' // Dark text
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            
         <button 
  type="button" 
  onClick={handleAddBackground}
  style={{
    marginTop: '1rem',
    padding: '0.75rem 1.5rem',
    borderRadius: '6px',
    border: 'none',
    background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)',
    color: 'white',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    justifyContent: 'center',
    width: '100%',
    maxWidth: '200px',
    transition: 'transform 0.2s ease'
  }}
>
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
  Add Background
</button>
</div>

<div style={{
  backgroundColor: '#f8f9fa',
  padding: '1.5rem',
  borderRadius: '12px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
}}>
  <h3 style={{
    color: '#6a11cb',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  }}>
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path>
      <line x1="16" y1="8" x2="2" y2="22"></line>
      <line x1="17.5" y1="15" x2="9" y2="15"></line>
    </svg>
    Select Skills
  </h3>

  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '0.75rem'
  }}>
    {availableSkills.map((skill) => (
      <label key={skill.skill_id} style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.75rem',
        backgroundColor: 'white',
        borderRadius: '6px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        color: '#2d3748'
      }}>
        <input
          type="checkbox"
          className="custom-checkbox"
          value={skill.skill_id}
          checked={skills.includes(skill.skill_id)}
          onChange={(e) => {
            const val = parseInt(e.target.value);
            setSkills((prev) =>
              prev.includes(val) ? prev.filter((s) => s !== val) : [...prev, val]
            );
          }}
        />
        <span>{skill.name}</span>
      </label>
    ))}
  </div>
</div>

          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button
              type="button"
              onClick={() => navigate('/profile')}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '6px',
                border: '1px solid #e9ecef',
                background: 'white',
                color: '#495057',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                ':hover': {
                  backgroundColor: '#f1f3f5'
                }
              }}
            >
              Cancel
            </button>
            
            <button
              type="submit"
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '6px',
                border: 'none',
                background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)',
                color: 'white',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                ':hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
                }
              }}
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
