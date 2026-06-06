import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./SponsorshipRequests.css";

const SponsorshipRequests = () => {
  const navigate = useNavigate();
  const [sponsorships, setSponsorships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    active: 0,
    totalAmount: 0
  });

  useEffect(() => {
    fetchSponsorships();
  }, []);

  const fetchSponsorships = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/sponsorships/all');
      const data = await response.json();
      
      if (data.success) {
        const orphanageName = localStorage.getItem('orphanageName');
        const mySponsorships = data.sponsorships.filter(s => s.orphanageName === orphanageName);
        
        setSponsorships(mySponsorships);
        
        // Calculate stats
        const pending = mySponsorships.filter(s => s.status === 'pending').length;
        const active = mySponsorships.filter(s => s.status === 'active').length;
        const totalAmount = mySponsorships.reduce((sum, s) => sum + (s.amount || 0), 0);
        
        setStats({
          total: mySponsorships.length,
          pending: pending,
          active: active,
          totalAmount: totalAmount
        });
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const response = await fetch(`http://localhost:5000/api/sponsorships/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      
      if (response.ok) {
        alert(`✅ Sponsorship ${status}!`);
        fetchSponsorships();
      }
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'active': return <span className="status-badge active">✅ Active</span>;
      case 'pending': return <span className="status-badge pending">⏳ Pending</span>;
      case 'completed': return <span className="status-badge completed">✓ Completed</span>;
      case 'cancelled': return <span className="status-badge cancelled">❌ Cancelled</span>;
      default: return <span className="status-badge pending">{status}</span>;
    }
  };

  return (
    <div className="sponsorship-full-page">
      <div className="page-header">
        <h1><i className="fas fa-hand-holding-heart"></i> Sponsorship Requests</h1>
        <div className="total-sponsorships-badge">Total: ${stats.totalAmount}</div>
      </div>

      {/* Stats Cards */}
      <div className="sponsorship-stats-full">
        <div className="stat-box">
          <h3>{stats.total}</h3>
          <p>Total Sponsorships</p>
        </div>
        <div className="stat-box">
          <h3>{stats.pending}</h3>
          <p>Pending</p>
        </div>
        <div className="stat-box">
          <h3>{stats.active}</h3>
          <p>Active</p>
        </div>
        <div className="stat-box">
          <h3>${stats.totalAmount}</h3>
          <p>Total Amount</p>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading sponsorship requests...</p>
        </div>
      ) : sponsorships.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-gift"></i>
          <h3>No Sponsorship Requests Yet</h3>
          <p>When someone sponsors your orphanage, requests will appear here.</p>
        </div>
      ) : (
        <div className="sponsorships-table-container">
          <table className="sponsorships-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Sponsor Name</th>
                <th>Email / Phone</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Purpose</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {sponsorships.map((sponsorship) => (
                <tr key={sponsorship._id}>
                  <td>{new Date(sponsorship.createdAt).toLocaleDateString()}</td>
                  <td><strong>{sponsorship.sponsorName}</strong></td>
                  <td>{sponsorship.sponsorEmail}<br/><small>{sponsorship.sponsorPhone}</small></td>
                  <td className="amount-cell">${sponsorship.amount}</td>
                  <td>{sponsorship.sponsorshipType}</td>
                  <td>{sponsorship.purpose || 'General'}</td>
                  <td>{getStatusBadge(sponsorship.status)}</td>
                  <td>
                    {sponsorship.status === 'pending' && (
                      <div className="table-actions">
                        <button className="action-approve" onClick={() => updateStatus(sponsorship._id, 'active')}>
                          <i className="fas fa-check"></i> Approve
                        </button>
                        <button className="action-reject" onClick={() => updateStatus(sponsorship._id, 'cancelled')}>
                          <i className="fas fa-times"></i> Reject
                        </button>
                      </div>
                    )}
                    {sponsorship.status === 'active' && (
                      <span className="active-text">✓ Active</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button className="back-btn" onClick={() => navigate(-1)}>
        <i className="fas fa-arrow-left"></i> Back to Dashboard
      </button>
    </div>
  );
};

export default SponsorshipRequests;