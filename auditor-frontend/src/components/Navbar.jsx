import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ isLoggedIn, onLogout, toggleDarkMode, darkMode }) => {
  return (
    <nav className="navbar navbar-expand-lg shadow-sm mb-4 bg-body-tertiary">
      <div className="container">
        <Link className="navbar-brand fw-bold text-primary" to="/">A11yAuditor</Link>
        
        <div className="d-flex align-items-center">
          {/* Dark Mode Toggle Switch */}
          <div className="form-check form-switch me-4">
            <input 
              className="form-check-input" 
              type="checkbox" 
              id="darkModeSwitch" 
              checked={darkMode}
              onChange={toggleDarkMode} 
            />
            <label className="form-check-label" htmlFor="darkModeSwitch">
              {darkMode ? '🌙' : '☀️'}
            </label>
          </div>

          {isLoggedIn ? (
            <>
              <Link className="btn btn-sm btn-outline-primary me-2" to="/dashboard">Dashboard</Link>
              <button className="btn btn-sm btn-danger" onClick={onLogout}>Logout</button>
            </>
          ) : (
            <div className="d-flex gap-2">
              {/* Added Register Link here */}
              <Link className="btn btn-sm btn-outline-primary rounded-pill px-3" to="/register">Sign Up</Link>
              <Link className="btn btn-sm btn-primary rounded-pill px-3 shadow-sm" to="/login">Login</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;