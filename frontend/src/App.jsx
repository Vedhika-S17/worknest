// src/App.jsx
import { useEffect, useState } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import api from "./config/axios";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";

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
      </Routes>
    </Router>
  );
};

export default App;
