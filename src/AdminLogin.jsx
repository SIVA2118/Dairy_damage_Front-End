import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './AdminLogin.css'; // CSS file

const AdminLogin = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: "", password: "" });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/admin/login", credentials);
      if (res.status === 200) {
        navigate("/AdminDashboard");
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("❌ Worng password");
    }
  };

  return (
    <div className="admin-login-container">
      <div className="login-card">
        <h2>🔐 Admin Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            name="username"
            placeholder="👤 Username"
            value={credentials.username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="🔑 Password"
            value={credentials.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
