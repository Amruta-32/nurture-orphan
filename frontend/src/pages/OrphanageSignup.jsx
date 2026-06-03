import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

const OrphanageSignup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    contact: "",
    address: "",
    city: "",
    password: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Create floating circles effect
  useEffect(() => {
    const container = document.querySelector('.signup-container');
    if (container) {
      for (let i = 0; i < 6; i++) {
        const circle = document.createElement('div');
        circle.classList.add('circle');
        const size = Math.random() * 150 + 50;
        circle.style.width = `${size}px`;
        circle.style.height = `${size}px`;
        circle.style.left = `${Math.random() * 100}%`;
        circle.style.top = `${Math.random() * 100}%`;
        circle.style.animationDelay = `${Math.random() * 10}s`;
        circle.style.animationDuration = `${Math.random() * 15 + 10}s`;
        container.appendChild(circle);
      }
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("http://localhost:5000/api/orphanages/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      
      if (res.ok) {
        setSuccess(data.message || "Orphanage registration successful! Please login.");
        setForm({
          name: "",
          email: "",
          contact: "",
          address: "",
          city: "",
          password: ""
        });
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      {/* Back Button */}
      <button className="back-button" onClick={() => navigate(-1)}>
        <i className="fas fa-arrow-left"></i>
        Back
      </button>

      {/* Main Card */}
      <div className="signup-card">
        <div className="decorative-icon">
          <i className="fas fa-home"></i>
        </div>
        
        <h2>Register Your Orphanage</h2>
        <p className="signup-subtitle">Join NurtureOrphan to receive help and support</p>

        {error && (
          <div className="error-message">
            <i className="fas fa-exclamation-circle"></i> {error}
          </div>
        )}
        
        {success && (
          <div className="success-message">
            <i className="fas fa-check-circle"></i> {success}
          </div>
        )}

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <i className="fas fa-building"></i>
            <input 
              type="text" 
              name="name" 
              placeholder="Orphanage Name" 
              value={form.name}
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="input-group">
            <i className="fas fa-envelope"></i>
            <input 
              type="email" 
              name="email" 
              placeholder="Email Address" 
              value={form.email}
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="input-group">
            <i className="fas fa-phone-alt"></i>
            <input 
              type="tel" 
              name="contact" 
              placeholder="Contact Number" 
              value={form.contact}
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="input-group">
            <i className="fas fa-location-dot"></i>
            <input 
              type="text" 
              name="address" 
              placeholder="Full Address" 
              value={form.address}
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="input-group">
            <i className="fas fa-city"></i>
            <input 
              type="text" 
              name="city" 
              placeholder="City" 
              value={form.city}
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="input-group">
            <i className="fas fa-lock"></i>
            <input 
              type="password" 
              name="password" 
              placeholder="Create Password" 
              value={form.password}
              onChange={handleChange} 
              required 
            />
          </div>

          <button type="submit" className={`signup-btn ${loading ? "loading" : ""}`} disabled={loading}>
            {loading ? "Registering..." : "Register Orphanage"}
          </button>
        </form>

        <div className="login-text">
          Already have an account? <span onClick={() => navigate("/login")}>Login here</span>
        </div>
      </div>
    </div>
  );
};

export default OrphanageSignup;