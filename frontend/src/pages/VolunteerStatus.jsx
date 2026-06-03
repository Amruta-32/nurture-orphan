import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './VolunteerStatus.css';

const VolunteerStatus = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      // Fetch ALL volunteers from database
      const response = await fetch('http://localhost:5000/api/volunteer/all');
      const data = await response.json();
      console.log("All volunteers from DB:", data);
      
      if (data.success && data.volunteers) {
        setApplications(data.volunteers);
      } else {
        setApplications([]);
      }
    } catch (error) {
      console.error("Error:", error);
      setApplications([]);
    }
    setLoading(false);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending': return <span className="badge pending">⏳ Pending Review</span>;
      case 'approved': return <span className="badge approved">✅ Approved</span>;
      case 'active': return <span className="badge active">✓ Active Volunteer</span>;
      case 'rejected': return <span className="badge rejected">❌ Rejected</span>;
      default: return <span className="badge pending">⏳ Pending</span>;
    }
  };

  return (
    <div className="volunteer-status-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <i className="fas fa-arrow-left"></i> Back
      </button>

      <button className="apply-top-btn" onClick={() => navigate('/volunteer-apply')}>
        <i className="fas fa-plus"></i> Apply Now
      </button>

      <div className="status-card">
        <h1><i className="fas fa-hands-helping"></i> Volunteer Applications</h1>
        
        {loading ? (
          <div className="loading">Loading...</div>
        ) : applications.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-file-alt"></i>
            <p>No applications found</p>
          </div>
        ) : (
          <div className="applications-list">
            {applications.map((app, index) => (
              <div className="application-card" key={app._id || index}>
                <div className="app-header">
                  <h3>{app.name}</h3>
                  {getStatusBadge(app.status)}
                </div>
                <div className="app-details">
                  <p><strong>Email:</strong> {app.email}</p>
                  <p><strong>Phone:</strong> {app.phone}</p>
                  <p><strong>City:</strong> {app.city}</p>
                  <p><strong>Submitted:</strong> {new Date(app.joinedAt).toLocaleDateString()}</p>
                  <p><strong>Skills:</strong> {app.skills?.join(', ') || 'Not specified'}</p>
                  <p><strong>Availability:</strong> {app.availability}</p>
                </div>
                {app.status === 'pending' && (
                  <div className="app-message pending">
                    <i className="fas fa-clock"></i> Under review
                  </div>
                )}
                {app.status === 'approved' && (
                  <div className="app-message approved">
                    <i className="fas fa-check-circle"></i> Approved!
                  </div>
                )}
                {app.status === 'rejected' && (
                  <div className="app-message rejected">
                    <i className="fas fa-times-circle"></i> Rejected
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VolunteerStatus;