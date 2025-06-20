// src/App.jsx
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Signup from './pages/Signup';
// import Login from './pages/Login'; // if needed

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        {/* <Route path="/login" element={<Login />} /> */}
        {/* <Route path="/" element={<Home />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
