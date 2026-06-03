import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

const Login = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // Floating circles effect
  useEffect(() => {
    const container = document.querySelector(".signup-container");

    if (container) {
      for (let i = 0; i < 6; i++) {
        const circle = document.createElement("div");
        circle.classList.add("circle");

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

    const url =
      role === "user"
        ? "http://localhost:5000/api/users/login"
        : "http://localhost:5000/api/orphanages/login";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
if (data.message === "Login successful") {

  // USER LOGIN
  if (role === "user") {

    localStorage.setItem("userName", data.user?.name || "");
    localStorage.setItem("userEmail", data.user?.email || "");
    localStorage.setItem("userCity", data.user?.city || "");

    localStorage.setItem(
      "userJoinDate",
      new Date().toLocaleDateString()
    );

    localStorage.setItem("role", "user");

    navigate("/user-dashboard");

  } 
  
  // ORPHANAGE LOGIN
  else {

    localStorage.setItem(
      "orphanageName",
      data.orphanage?.name || ""
    );

    localStorage.setItem(
      "orphanageEmail",
      data.orphanage?.email || ""
    );

    localStorage.setItem("role", "orphanage");

    navigate("/orphanage-dashboard");
  }

} else {
  setError(data.message || "Invalid email or password");
}
    } catch (error) {
      console.error(error);
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      {/* Back Button */}
      <button className="back-button" onClick={() => navigate(-1)}>
        <i className="fas fa-arrow-left"></i> Back
      </button>

      {/* Main Card */}
      <div className="signup-card">
        <div className="decorative-icon">
          <i className="fas fa-sign-in-alt"></i>
        </div>

        <h2>Welcome Back</h2>
        <p className="signup-subtitle">
          Login to your NurtureOrphan account
        </p>

        {error && (
          <div className="error-message">
            <i className="fas fa-exclamation-circle"></i> {error}
          </div>
        )}

        <form className="signup-form" onSubmit={handleSubmit}>
          {/* Role Selection */}
          <div className="role-toggle">
            <button
              type="button"
              className={`role-btn ${role === "user" ? "active" : ""}`}
              onClick={() => setRole("user")}
            >
              <i className="fas fa-user"></i> Supporter
            </button>

            <button
              type="button"
              className={`role-btn ${role === "orphanage" ? "active" : ""}`}
              onClick={() => setRole("orphanage")}
            >
              <i className="fas fa-home"></i> Orphanage
            </button>
          </div>

          {/* Email */}
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

          {/* Password */}
          <div className="input-group">
            <i className="fas fa-lock"></i>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Forgot Password */}
          <div className="forgot-password">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                alert("Password reset link sent to your email");
              }}
            >
              Forgot Password?
            </a>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={`signup-btn ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Signup Redirect */}
        <div className="login-text">
          Don't have an account?{" "}
          <span onClick={() => navigate("/signup-choice")}>
            Sign up here
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;