import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/login.css"; // You'll need to create this file

// TODO: frontend pleaSe change however you want, we just needed a log-in page to handle a submit

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  // use as stattes
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle input changes more efficiently
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    // try catch debugging
    // try will attempt to log-in with credentials
    try {
      // For now, just log the data
      console.log("Form submitted!");
      console.log("Login attempt with:", formData.email);
      console.log("Password logged:", formData.password);
      
      const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    if (!response.ok) throw new Error("Invalid credentials");

    const data = await response.json();
    console.log("Login successful!", data);

  } catch (err) {
    console.error("Login error:", err);
    setError(err.message || "Login failed. Please try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Welcome Back</h2>
          <p>Sign in to access your pet care dashboard</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="form-actions">
            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>
            <Link to="/forgot-password" className="forgot-password">
              Forgot Password?
            </Link>
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Don't have an account? <Link to="/register" className="register-link">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;