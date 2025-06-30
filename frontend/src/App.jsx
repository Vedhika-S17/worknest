// src/App.jsx
import { useState } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProfile from "./pages/AdminProfile";
import CreateProjects from "./pages/CreateProjects";
import Dashboard from "./pages/Dashboard";
import EditProfile from "./pages/EditProfile";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";
import ViewAllProjects from "./pages/ViewAllProjects"; // 👈 add this
import ViewProjects from "./pages/ViewProjects";
import MyProjects from "./pages/MyProjects";





const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("access_token");
  return token ? children : <Navigate to="/login" />;
};

const App = () => {
  const [profileStatus, setProfileStatus] = useState(null);
/*useEffect(() => {
  const fetchProfile = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    try {
      const res = await api.get("/profiles/profile");
      const pct = parseInt(res.data?.profile_completion_pct || 0);
      setProfileStatus(pct);
    } catch (err) {
      console.error("Error fetching profile completion:", err);
      setProfileStatus(0);
    }
  };

  fetchProfile(); // ✅ call it here
}, []);*/

  return (
    <Router>
      <Navbar /> {/* ✅ Always visible */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
       <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admindashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        >

        
          <Route path="create-project" element={<CreateProjects />} />
          <Route path="view-projects" element={<ViewProjects />} />
          <Route path="adminprofile" element={<AdminProfile />} />
         
          </Route>
          <Route
            path="/edit-profile"
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/view-projects"
            element={
              <ProtectedRoute>
                <ViewAllProjects />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-projects"
            element={
              <ProtectedRoute>
                <MyProjects />
              </ProtectedRoute>
            }
          />

      </Routes>
    </Router>
  );
};

export default App;
