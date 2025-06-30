import { useEffect, useState } from "react";
import api from "../config/axios";

const ViewAllProjects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [requestedProjects, setRequestedProjects] = useState([]);
    const [matchOnly, setMatchOnly] = useState(false); // Toggle switch

    useEffect(() => {
        setLoading(true);
        const endpoint = matchOnly ? "/api/projects/matched" : "/api/projects/all";
        api.get(endpoint)
            .then((res) => {
                const filtered = res.data.filter((project) => project.status !== "completed"); // 👈 exclude completed
                setProjects(filtered);
            })
            .catch((err) => {
                console.error("Error fetching projects:", err);
                setError("Unable to fetch projects. Please try again later.");
            })
            .finally(() => setLoading(false));

    }, [matchOnly]); // Re-run when toggle changes

    const handleRequest = (projectId) => {
    api.post(`/api/projects/${projectId}/request`)
        .then(() => {
            setRequestedProjects((prev) => [...prev, projectId]);
        })
        .catch(err => {
            const message = err.response?.data?.message;
            if (message === "Request already submitted.") {
                setRequestedProjects((prev) => [...prev, projectId]);
                alert("You have already submitted a request for this project.");
            } else {
                console.error("Error requesting project:", err);
                alert("Failed to request project. Please try again.");
            }
        });
};


    const filteredProjects = projects.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{
            minHeight: '95vh',
            padding: '2rem',
            backgroundColor: '#6fa0ed',
            width:'100vw',
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
                margin: '0 auto'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '2rem',
                    flexWrap: 'wrap',
                    gap: '1rem'
                }}>
                    <h1 style={{
                        fontSize: '2rem',
                        fontWeight: '700',
                        color: '#1e293b',
                        margin: 0,
                        lineHeight: 1.2
                    }}>
                        📂 All Projects
                    </h1>
                    
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="text"
                                placeholder="Search projects..."
                                style={{
                                    padding: '0.75rem 1rem',
                                    paddingLeft: '2.5rem',
                                    borderRadius: '0.5rem',
                                    border: '1px solid #e2e8f0',
                                    width: '250px',
                                    fontSize: '1rem',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                    transition: 'all 0.2s'
                                }}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <span style={{
                                position: 'absolute',
                                left: '1rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#64748b'
                            }}>
                                🔍
                            </span>
                        </div>

                        {/* Injected checkbox */}
                        <label style={{ fontSize: "0.9rem", color: "#334155", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight:"bold" }}>
                            <input
                                type="checkbox"
                                checked={matchOnly}
                                onChange={() => setMatchOnly(prev => !prev)}
                            />
                            Show only projects matching my skill
                        </label>
                    </div>
                </div>

                {loading ? (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '200px'
                    }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            border: '4px solid #e2e8f0',
                            borderTopColor: '#3b82f6',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                        }}></div>
                    </div>
                ) : error ? (
                    <div style={{
                        padding: '2rem',
                        backgroundColor: '#fff',
                        borderRadius: '0.5rem',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        textAlign: 'center'
                    }}>
                        <p style={{ color: '#ef4444', fontSize: '1rem' }}>{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            style={{
                                marginTop: '1rem',
                                padding: '0.5rem 1rem',
                                backgroundColor: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.25rem',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
                        >
                            Try Again
                        </button>
                    </div>
                ) : filteredProjects.length === 0 ? (
                    <div style={{
                        padding: '2rem',
                        backgroundColor: '#fff',
                        borderRadius: '0.5rem',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        textAlign: 'center'
                    }}>
                        <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
                            {searchTerm ? 'No projects match your search.' : 'No projects available at the moment.'}
                        </p>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        {filteredProjects.map((project) => (
                            <div
                                key={project.project_id}
                                style={{
                                    backgroundColor: '#fff',
                                    borderRadius: '0.75rem',
                                    padding: '1.5rem',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    borderLeft: `4px solid ${
                                        project.status === 'completed' ? '#10b981' :
                                        project.status === 'active' ? '#3b82f6' :
                                        '#f59e0b'
                                    }`,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '1rem'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'none';
                                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                                }}
                            >
                                <div style={{flex: 1}}>
                                    <h3 style={{
                                        margin: '0 0 0.5rem 0',
                                        fontSize: '1.25rem',
                                        color: '#1e293b',
                                        fontWeight: '600'
                                    }}>
                                        {project.title}
                                    </h3>
                                    <p style={{
                                        margin: '0 0 1rem 0',
                                        color: '#64748b',
                                        lineHeight: 1.5
                                    }}>
                                        {project.description || 'No description available.'}
                                    </p>
                                </div>

                                {/* Injected Block for Required Skills */}
                                {project.skills && project.skills.length > 0 && (
                                    <div>
                                        <div style={{
                                            fontSize: "0.9rem",
                                            fontWeight: "500",
                                            color: "#475569",
                                            marginBottom: "0.5rem"
                                        }}>
                                            Required Skills:
                                        </div>
                                        <div style={{
                                            display: "flex",
                                            flexWrap: "wrap",
                                            gap: "0.5rem"
                                        }}>
                                            {project.skills.map((skill, idx) => (
                                                <span
                                                    key={idx}
                                                    style={{
                                                        backgroundColor: "#e0e7ff",
                                                        color: "#1d4ed8",
                                                        padding: "4px 10px",
                                                        borderRadius: "9999px",
                                                        fontSize: "0.8rem",
                                                        fontWeight: 500
                                                    }}
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '1rem'
                                    }}>
                                        <span style={{
                                            backgroundColor: 
                                                project.status === 'completed' ? '#ecfdf5' :
                                                project.status === 'active' ? '#eff6ff' :
                                                '#fffbeb',
                                            color:
                                                project.status === 'completed' ? '#047857' :
                                                project.status === 'active' ? '#1d4ed8' :
                                                '#b45309',
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '9999px',
                                            fontWeight: '500',
                                            fontSize: '0.875rem'
                                        }}>
                                            {project.status}
                                        </span>
                                        <span style={{ 
                                            color: '#64748b',
                                            fontSize: '0.875rem'
                                        }}>
                                            {new Date(project.created_at).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <button
                                        onClick={() => handleRequest(project.project_id)}
                                        disabled={requestedProjects.includes(project.project_id)}
                                        style={{
                                            width: '100%',
                                            padding: '0.625rem',
                                            backgroundColor: requestedProjects.includes(project.project_id) ? '#10b981' : '#3b82f6',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '0.5rem',
                                            cursor: 'pointer',
                                            fontWeight: '500',
                                            fontSize: '1rem',
                                            transition: 'background-color 0.2s',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem'
                                        }}
                                        onMouseOver={(e) => !requestedProjects.includes(project.project_id) && 
                                            (e.currentTarget.style.backgroundColor = '#2563eb')}
                                        onMouseOut={(e) => !requestedProjects.includes(project.project_id) && 
                                            (e.currentTarget.style.backgroundColor = '#3b82f6')}
                                    >
                                        {requestedProjects.includes(project.project_id) ? (
                                            <>
                                                <span>✓ Requested</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>✉️ Request to Join</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default ViewAllProjects;
