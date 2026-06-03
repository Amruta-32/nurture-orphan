import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddChild.css';

const AddChild = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'other',
    healthStatus: 'good',
    educationLevel: '',
    hobbies: '',
    specialNeeds: '',
    guardianName: '',
    guardianContact: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const orphanageId = localStorage.getItem('orphanageId') || '1';
      const orphanageName = localStorage.getItem('orphanageName') || 'Sunshine Orphanage';
      
      const dataToSend = {
        name: formData.name,
        age: parseInt(formData.age),
        gender: formData.gender,
        orphanageId: orphanageId,
        orphanageName: orphanageName,
        healthStatus: formData.healthStatus,
        educationLevel: formData.educationLevel,
        hobbies: formData.hobbies,
        specialNeeds: formData.specialNeeds,
        guardianName: formData.guardianName,
        guardianContact: formData.guardianContact,
        notes: formData.notes
      };

      console.log("Sending data:", dataToSend);

      const response = await fetch('http://localhost:5000/api/children/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });

      const data = await response.json();
      console.log("Response:", data);
      
      if (response.ok) {
        alert('Child added successfully!');
        navigate('/orphanage-dashboard');
      } else {
        setError(data.message || 'Failed to add child');
      }
    } catch (err) {
      console.error("Error:", err);
      setError('Network error. Please make sure backend is running on port 5000');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-child-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <i className="fas fa-arrow-left"></i> Back to Dashboard
      </button>

      <div className="add-child-card">
        <div className="add-child-header">
          <i className="fas fa-child"></i>
          <h1>Add New Child</h1>
          <p>Register a child to your orphanage</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="add-child-form">
          <div className="form-section">
            <h3><i className="fas fa-user"></i> Basic Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Age *</label>
                <input type="number" name="age" value={formData.age} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Health Status</label>
                <select name="healthStatus" value={formData.healthStatus} onChange={handleChange}>
                  <option value="good">Good</option>
                  <option value="average">Average</option>
                  <option value="needs-attention">Needs Attention</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3><i className="fas fa-graduation-cap"></i> Education & Interests</h3>
            <div className="form-group">
              <label>Education Level</label>
              <input type="text" name="educationLevel" value={formData.educationLevel} onChange={handleChange} placeholder="e.g., 5th Grade, High School" />
            </div>
            <div className="form-group">
              <label>Hobbies</label>
              <input type="text" name="hobbies" value={formData.hobbies} onChange={handleChange} placeholder="e.g., Cricket, Drawing, Reading" />
            </div>
            <div className="form-group">
              <label>Special Needs</label>
              <textarea name="specialNeeds" rows="2" value={formData.specialNeeds} onChange={handleChange} placeholder="Any medical or special requirements..."></textarea>
            </div>
          </div>

          <div className="form-section">
            <h3><i className="fas fa-phone-alt"></i> Guardian Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Guardian Name</label>
                <input type="text" name="guardianName" value={formData.guardianName} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Guardian Contact</label>
                <input type="tel" name="guardianContact" value={formData.guardianContact} onChange={handleChange} />
              </div>
            </div>
            <div className="form-group">
              <label>Additional Notes</label>
              <textarea name="notes" rows="3" value={formData.notes} onChange={handleChange} placeholder="Any other important information..."></textarea>
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? <><i className="fas fa-spinner fa-spin"></i> Adding Child...</> : <><i className="fas fa-save"></i> Add Child to Orphanage</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddChild;