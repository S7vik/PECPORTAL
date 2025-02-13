import './App.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginSignup from './pages/LoginSignup';
import Dashboard from './pages/Dashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track authentication status
  const [user, setUser] = useState(null); // Track the logged-in user details

  // Mock login function
  const handleLogin = (email, password) => {
    if (email === 'satvik.raina@college.edu' && password === 'password123') {
      setIsAuthenticated(true);
      setUser({ name: 'Satvik Raina', email: 'satvik.raina@college.edu', branch: 'CSE', semester: '4th' });
      return true;
    }
    return false;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginSignup onLogin={handleLogin} />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
