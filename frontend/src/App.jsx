import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import OtpVerification from './pages/OtpVerification';
import Dashboard from './pages/Dashboard'
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/Login" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/OtpVerification" element={<OtpVerification />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/Login" />} />
      </Routes>
    </Router>
  );
}

export default App;