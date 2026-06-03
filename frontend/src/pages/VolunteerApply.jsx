import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './VolunteerApply.css';

const VolunteerApply = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: localStorage.getItem('userName') || '',
    email: localStorage.getItem('userEmail') || '',
    phone: '',
    age: '',
    city: '',
    occupation: '',
    skills: [],
    availability: 'flexible',
    interests: [],
    experience: '',
    motivation: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const skillsList = ['Teaching', 'Counseling', 'Medical Care', 'Food Distribution', 
    'Event Management', 'Fundraising', 'Social Media', 'Content Writing', 'Photography', 'Driving'];
  
  const interestsList = ['Child Education', 'Healthcare', 'Nutrition', 'Shelter', 
    'Recreation Activities', 'Counseling', 'Administrative Work'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      if (checked) {
        setFormData({ ...formData, [name]: [...formData[name], value] });
      } else {
        setFormData({ ...formData, [name]: formData[name].filter(item => item !== value) });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const response = await fetch('http://localhost:5000/api/volunteer/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const data = await response.json();
    
    if (response.ok) {
      setSubmitted(true);
      setTimeout(() => navigate('/volunteer-status'), 2000);
    } else {
      alert(data.message || 'Application failed');
    }
  } catch (error) {
    alert('Network error. Please try again.');
  } finally {
    setLoading(false);
  }
};

  if (submitted) {
    return (
      <div className="success-container">
        <div className="success-card">
          <i className="fas fa-check-circle"></i>
          <h2>Application Submitted!</h2>
          <p>Thank you for volunteering. We'll review your application and contact you soon.</p>
          <button onClick={() => navigate('/volunteer-status')}>Check Status →</button>
        </div>
      </div>
    );
  }

  return (
    <div className="volunteer-apply-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        <i className="fas fa-arrow-left"></i> Back
      </button>

      <div className="apply-card">
        <div className="apply-header">
          <i className="fas fa-hands-helping"></i>
          <h1>Become a Volunteer</h1>
          <p>Join us in making a difference in children's lives</p>
        </div>

        <form onSubmit={handleSubmit} className="volunteer-form">
          {/* Personal Information */}
          <div className="form-section">
            <h3><i className="fas fa-user"></i> Personal Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Phone *</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Age</label>
                <input type="number" name="age" value={formData.age} onChange={handleChange} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>City *</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Occupation</label>
                <input type="text" name="occupation" value={formData.occupation} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* Skills & Availability */}
          <div className="form-section">
            <h3><i className="fas fa-tools"></i> Skills & Availability</h3>
            <div className="form-group">
              <label>Select your skills</label>
              <div className="checkbox-group">
                {skillsList.map(skill => (
                  <label key={skill}>
                    <input type="checkbox" name="skills" value={skill} onChange={handleChange} />
                    <span>{skill}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Availability</label>
              <select name="availability" value={formData.availability} onChange={handleChange}>
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="weekends">Weekends Only</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>

            <div className="form-group">
              <label>Areas of interest</label>
              <div className="checkbox-group">
                {interestsList.map(interest => (
                  <label key={interest}>
                    <input type="checkbox" name="interests" value={interest} onChange={handleChange} />
                    <span>{interest}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Experience & Motivation */}
          <div className="form-section">
            <h3><i className="fas fa-heart"></i> Experience & Motivation</h3>
            <div className="form-group">
              <label>Previous Volunteer Experience</label>
              <textarea name="experience" rows="3" value={formData.experience} onChange={handleChange}
                placeholder="Tell us about any previous volunteer work..." />
            </div>
            <div className="form-group">
              <label>Why do you want to volunteer?</label>
              <textarea name="motivation" rows="3" value={formData.motivation} onChange={handleChange}
                placeholder="Share your motivation to help orphan children..." required />
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? <><i className="fas fa-spinner fa-spin"></i> Submitting...</> : <><i className="fas fa-paper-plane"></i> Submit Application</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VolunteerApply;