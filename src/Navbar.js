// Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Optional CSS for styling

const Navbar = () => {
  return (
    <nav className="navbar">
    <div className="navbar-container">
      <h2 className="navbar-title">Admin Panel</h2>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/AdminDashboard">Dashboard</Link></li>
        <li><Link to="/records">📸 Extra Records</Link></li>
      </ul>
    </div>
  </nav>
  

  );
};

export default Navbar;
