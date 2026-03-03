import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.body.setAttribute('data-bs-theme', 'dark');
    } else {
      document.body.removeAttribute('data-bs-theme','light');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div className="App">
        {/* Navbar is outside Routes so it shows on every page */}
        <Navbar 
          isLoggedIn={isLoggedIn} 
          onLogout={handleLogout} 
          toggleDarkMode={toggleDarkMode} 
          darkMode={darkMode} 
        />
        
        <Routes>
          {/* Public Intro Page */}
          <Route path="/" element={<Home />} />
          // Inside App.jsx Routes
          <Route path="/register" element={<Register />} />
          {/* Login Page: Redirects to dashboard if already logged in */}
          <Route path="/login" element={
            !isLoggedIn ? <Login onLoginSuccess={() => setIsLoggedIn(true)} /> : <Navigate to="/dashboard" />
          } />

          {/* Protected Dashboard: Redirects to login if NOT logged in */}
          <Route path="/dashboard" element={
            isLoggedIn ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/login" />
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;