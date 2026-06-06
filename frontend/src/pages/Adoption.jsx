import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Adoption.css';

 const API = 'https://nurture-orphan-api.onrender.com/api';
const Adoption = () => {
  const navigate = useNavigate();
  const [children, setChildren] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const name = localStorage.getItem('name') || 'Guest User';
    setUserName(name);
    loadAllChildren();
    loadMyRequests();
  }, []);

  const loadAllChildren = async () => {
    setLoading(true);
    try {
      const orphanageId = '1';
      const response = await fetch(`${API}/children/orphanage/${orphanageId}`);
      const data = await response.json();
      if (data.success && data.children) {
        setChildren(data.children.map(child => ({
          id: child._id, _id: child._id,
          name: child.name, age: child.age, gender: child.gender,
          city: child.city || 'Unknown',
          healthStatus: child.healthStatus || 'good',
          isRescued: child.isRescued || false
        })));
      } else {
        setChildren([]);
      }
    } catch (error) {
      console.error("Error loading children:", error);
      setChildren([]);
    }
    setLoading(false);
  };

  const loadMyRequests = () => {
    const saved = JSON.parse(localStorage.getItem('adoptionRequests') || '[]');
    setMyRequests(saved);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const newRequest = {
      id: Date.now(),
      childId: selectedChild.id,
      childName: selectedChild.name,
      childAge: selectedChild.age,
      userName: form.userName.value,
      userPhone: form.userPhone.value,
      userAddress: form.userAddress.value,
      reason: form.reason.value,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    const existing = JSON.parse(localStorage.getItem('adoptionRequests') || '[]');
    existing.push(newRequest);
    localStorage.setItem('adoptionRequests', JSON.stringify(existing));
    alert('Adoption request submitted!');
    setShowForm(false);
    loadMyRequests();
  };

  const getStatusBadge = (status) => {
    const map = {
      approved: 'badge-approved',
      rejected: 'badge-rejected',
      pending:  'badge-pending',
    };
    const labels = { approved: '✅ Approved', rejected: '❌ Rejected', pending: '⏳ Pending' };
    return <span className={`adoption-badge ${map[status] || 'badge-pending'}`}>{labels[status] || '⏳ Pending'}</span>;
  };

  return (
    <div className="adoption-page">
      <button className="adoption-back-btn" onClick={() => navigate(-1)}>
        <i className="fas fa-arrow-left"></i> Back
      </button>

      <div className="adoption-container">
        <div className="adoption-page-header">
          <h1><i className="fas fa-heart"></i> Adoption Program</h1>
          <p>Give a loving home to a child who needs one</p>
        </div>

        {/* My Requests */}
        <div className="adoption-requests-card">
          <h2><i className="fas fa-list-alt"></i> My Adoption Requests</h2>
          {myRequests.length === 0 ? (
            <div className="adoption-empty">
              <i className="fas fa-heart"></i>
              <p>No requests yet — browse children below to get started.</p>
            </div>
          ) : (
            <div className="adoption-requests-list">
              {myRequests.map(req => (
                <div className="adoption-request-row" key={req.id}>
                  <div className="request-child-info">
                    <i className="fas fa-child"></i>
                    <div>
                      <strong>{req.childName}</strong>
                      <span> (Age: {req.childAge})</span>
                      <p className="request-date">
                        <i className="fas fa-calendar-alt"></i>
                        {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : 'Date not recorded'}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(req.status)}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Available Children */}
        <div className="adoption-section">
          <h2><i className="fas fa-child"></i> Children Available for Adoption</h2>
          {loading ? (
            <div className="adoption-loading">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Loading children...</p>
            </div>
          ) : children.length === 0 ? (
            <div className="adoption-empty large">
              <i className="fas fa-baby"></i>
              <h3>No children available for adoption yet</h3>
              <p>Children rescued and registered will appear here.</p>
            </div>
          ) : (
            <div className="adoption-children-grid">
              {children.map(child => {
                const existingRequest = myRequests.find(r => r.childName === child.name);
                return (
                  <div className="adoption-child-card" key={child.id || child._id}>
                    <div className="adoption-child-avatar">
                      <i className="fas fa-child"></i>
                    </div>
                    <div className="adoption-child-details">
                      <h3>{child.name}</h3>
                      <p><i className="fas fa-calendar-alt"></i> Age: {child.age} years</p>
                      <p><i className="fas fa-venus-mars"></i> {child.gender === 'male' ? 'Boy' : 'Girl'}</p>
                      <p><i className="fas fa-map-marker-alt"></i> {child.city}</p>
                      {child.isRescued && (
                        <span className="rescued-tag"><i className="fas fa-check-circle"></i> Rescued Child</span>
                      )}
                    </div>
                    <div className="adoption-child-footer">
                      {existingRequest ? (
                        getStatusBadge(existingRequest.status)
                      ) : (
                        <button
                          className="adoption-request-btn"
                          onClick={() => { setSelectedChild(child); setShowForm(true); }}
                        >
                          <i className="fas fa-heart"></i> Request Adoption
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Form Modal */}
      {showForm && selectedChild && (
        <div className="adoption-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="adoption-modal" onClick={e => e.stopPropagation()}>
            <div className="adoption-modal-header">
              <h2><i className="fas fa-heart"></i> Adoption Request for {selectedChild.name}</h2>
              <button className="adoption-modal-close" onClick={() => setShowForm(false)}>&times;</button>
            </div>
            <div className="adoption-modal-body">
              <form onSubmit={handleSubmit}>
                <div className="adoption-form-group">
                  <label>Full Name *</label>
                  <input type="text" name="userName" placeholder="Your Full Name" defaultValue={userName} required />
                </div>
                <div className="adoption-form-group">
                  <label>Phone Number *</label>
                  <input type="tel" name="userPhone" placeholder="Phone Number" required />
                </div>
                <div className="adoption-form-group">
                  <label>Your Address *</label>
                  <textarea name="userAddress" placeholder="Your complete address" rows="2" required></textarea>
                </div>
                <div className="adoption-form-group">
                  <label>Why do you want to adopt? *</label>
                  <textarea name="reason" placeholder="Share your motivation..." rows="3" required></textarea>
                </div>
                <div className="adoption-modal-actions">
                  <button type="button" className="adoption-cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
                  <button type="submit" className="adoption-submit-btn"><i className="fas fa-paper-plane"></i> Submit</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Adoption;
