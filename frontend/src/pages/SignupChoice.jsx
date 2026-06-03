import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SignupChoice.css";
const SignupChoice = () => {
  const navigate = useNavigate();
  useEffect(() => {
    // Create floating circles animation
    const container = document.querySelector('.choice');
    for (let i = 0; i < 8; i++) {
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
  }, []);

  const handleUserSignup = () => {
    navigate('/signup', { state: { userType: 'user' } });
  };

  const handleOrphanageSignup = () => {
    navigate('/signup', { state: { userType: 'orphanage' } });
  };

  return (
    <div className="choice">
      {/* Back to Home Button */}
      <button className="back-button" onClick={() => navigate('/')}>
        <i className="fas fa-arrow-left"></i>
        Back to Home
      </button>

      {/* Main Content Card */}
      <div className="content-card">
        <div className="decorative-icon">
          <i className="fas fa-hand-holding-heart"></i>
        </div>
        <h1>Join NurtureOrphan</h1>
        <p>Choose how you want to make a difference in the lives of orphan children</p>

        <div className="buttons">
          <button className="btn user" onClick={() => navigate("/signup-user")}>
            <i className="fas fa-user"></i>
            Signup as Supporter
          </button>
          <button className="btn orphanage" onClick={() => navigate("/signup-orphanage")}>
            <i className="fas fa-home"></i>
            Signup as Orphanage
          </button>
        </div>
        <div>
        <p className="login-text">
        Already have an account?{" "}
        <span onClick={() => navigate("/login")}>
          Login
        </span>
       </p>
       </div>

        <div style={{ marginTop: "32px", fontSize: "0.85rem", color: "#8a9a9a" }}>
          <i className="fas fa-shield-alt"></i> Your information is safe with us
        </div>

      </div>
    </div>
  );
};

export default SignupChoice;