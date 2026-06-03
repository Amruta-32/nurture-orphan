import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddStaff.css';

const AddStaff = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    department: 'Other',
    salary: '',
    address: '',
    city: '',
    qualifications: '',
    experience: '',
    shift: 'Full Day',
    emergencyContact: '',
    emergencyContactName: '',
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
      
      const response = await fetch('http://localhost:5000/api/staff/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          salary: parseInt(formData.salary) || 0,
          orphanageId,
          orphanageName
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        alert('Staff member added successfully!');
        navigate('/orphanage-dashboard');
      } else {
        setError(data.message || 'Failed to add staff');
      }
    } catch (err) {
      console.error("Error:", err);
      setError('Network error. Please make sure backend is running on port 5000');
    } finally {
      setLoading(false);
    }
  };

  const positions = ['Teacher', 'Doctor', 'Nurse', 'Counselor', 'Accountant', 'Cook', 'Security Guard', 'Driver', 'Cleaner', 'Administrator', 'Social Worker', 'Other'];
  const departments = ['Teaching', 'Medical', 'Administration', 'Kitchen', 'Security', 'Counseling', 'Other'];
  const shifts = ['Morning', 'Evening', 'Night', 'Full Day'];

  return (
    <div className="add-staff-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <i className="fas fa-arrow-left"></i> Back to Dashboard
      </button>

      <div className="add-staff-card">
        <div className="add-staff-header">
          <i className="fas fa-users"></i>
          <h1>Add Staff Member</h1>
          <p>Register a new staff member to your orphanage</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="add-staff-form">
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
                <label>Phone Number *</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Position *</label>
                <select name="position" value={formData.position} onChange={handleChange} required>
                  <option value="">Select Position</option>
                  {positions.map(pos => <option key={pos} value={pos}>{pos}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Department</label>
                <select name="department" value={formData.department} onChange={handleChange}>
                  {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Shift</label>
                <select name="shift" value={formData.shift} onChange={handleChange}>
                  {shifts.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Salary (Annual)</label>
                <input type="number" name="salary" value={formData.salary} onChange={handleChange} placeholder="₹" />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3><i className="fas fa-map-marker-alt"></i> Address Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Address</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>City</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3><i className="fas fa-graduation-cap"></i> Qualifications & Experience</h3>
            <div className="form-group">
              <label>Qualifications</label>
              <textarea name="qualifications" rows="2" value={formData.qualifications} onChange={handleChange} placeholder="Educational qualifications, certifications..." />
            </div>
            <div className="form-group">
              <label>Previous Experience</label>
              <textarea name="experience" rows="2" value={formData.experience} onChange={handleChange} placeholder="Years of experience, previous organizations..." />
            </div>
          </div>

          <div className="form-section">
            <h3><i className="fas fa-phone-alt"></i> Emergency Contact</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Contact Name</label>
                <input type="text" name="emergencyContactName" value={formData.emergencyContactName} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Contact Number</label>
                <input type="tel" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} />
              </div>
            </div>
            <div className="form-group">
              <label>Additional Notes</label>
              <textarea name="notes" rows="2" value={formData.notes} onChange={handleChange} placeholder="Any other information..." />
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? <><i className="fas fa-spinner fa-spin"></i> Adding Staff...</> : <><i className="fas fa-save"></i> Add Staff Member</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddStaff;