import { useEffect, useState } from "react";
import api from "../config/axios";

const AssignedProjects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAssigned = async () => {
        try {
            const res = await api.get("/api/projects/assigned");
            setProjects(res.data);
        } catch (err) {
            console.error("Failed to fetch assigned projects", err);
        } finally {
            setLoading(false);
        }
        };
        fetchAssigned();
    }, []);

    const markComplete = async (project_id) => {
        try {
        await api.post(`/api/projects/${project_id}/complete`);
        alert("Project marked as completed!");
        window.location.reload();
        } catch (err) {
        alert("Failed to update project.");
        }
    };

    return (
        <div style={{ padding: "2rem" }}>
        <h2>🛠️ Your Assigned Projects</h2>
        {loading ? <p>Loading...</p> : (
            projects.length === 0 ? (
            <p>No assigned projects yet.</p>
            ) : (
            <ul>
                {projects.map(p => (
                <li key={p.project_id} style={{ marginBottom: "1rem" }}>
                    <strong>{p.title}</strong> • Status: {p.progress_status}
                    {p.progress_status === "active" && (
                    <button onClick={() => markComplete(p.project_id)} style={{ marginLeft: "1rem" }}>
                        ✅ Mark as Completed
                    </button>
                    )}
                </li>
                ))}
            </ul>
            )
        )}
        </div>
    );
};

export default AssignedProjects;
