import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdoptionRequests = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = () => {
    const allRequests = JSON.parse(localStorage.getItem('adoptionRequests') || '[]');
    setRequests(allRequests);
    setLoading(false);
  };

  const updateStatus = (id, status) => {
    const updated = requests.map(req => 
      req.id === id ? { ...req, status: status } : req
    );
    localStorage.setItem('adoptionRequests', JSON.stringify(updated));
    setRequests(updated);
    alert(`Request ${status}!`);
  };

  const pendingCount = requests.filter(r => r.status === 'pending').length;

  return (
    <div style={{ padding: '80px 20px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <button 
        onClick={() => navigate('/orphanage-dashboard')} 
        style={{ 
          position: 'fixed', 
          top: 20, 
          left: 20, 
          background: '#2c7a4d', 
          color: 'white', 
          border: 'none', 
          padding: '8px 16px', 
          borderRadius: '20px', 
          cursor: 'pointer', 
          zIndex: 100 
        }}
      >
        ← Back to Dashboard
      </button>

      <h1 style={{ textAlign: 'center', color: '#1a4731', marginBottom: '20px' }}>Adoption Requests</h1>
      
      <div style={{ 
        background: 'white', 
        borderRadius: '16px', 
        padding: '20px', 
        marginBottom: '20px', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)' 
      }}>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <div><strong>Total:</strong> {requests.length}</div>
          <div><strong style={{ color: '#e67e22' }}>Pending:</strong> {pendingCount}</div>
          <div><strong style={{ color: '#2c7a4d' }}>Approved:</strong> {requests.filter(r => r.status === 'approved').length}</div>
          <div><strong style={{ color: '#e74c3c' }}>Rejected:</strong> {requests.filter(r => r.status === 'rejected').length}</div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>
      ) : requests.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', background: 'white', borderRadius: '16px' }}>
          <p>No adoption requests yet.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse', 
            background: 'white', 
            borderRadius: '16px', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)' 
          }}>
            <thead>
              <tr style={{ background: '#f8faf8', borderBottom: '1px solid #ddd' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Child Name</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Age</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Applicant</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Phone</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Address</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Reason</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(req => (
                <tr key={req.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px' }}>
                    {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : 'Date not recorded'}
                  </td>
                  <td style={{ padding: '12px' }}><strong>{req.childName}</strong></td>
                  <td style={{ padding: '12px' }}>{req.childAge} years</td>
                  <td style={{ padding: '12px' }}>{req.userName}</td>
                  <td style={{ padding: '12px' }}>{req.userPhone}</td>
                  <td style={{ padding: '12px' }}>{req.userAddress}</td>
                  <td style={{ padding: '12px' }}>{req.reason}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ 
                      padding: '4px 12px', 
                      borderRadius: '20px', 
                      fontSize: '12px',
                      background: req.status === 'approved' ? '#e8f3ed' : req.status === 'rejected' ? '#fde2e2' : '#fff3e0',
                      color: req.status === 'approved' ? '#2c7a4d' : req.status === 'rejected' ? '#e74c3c' : '#e67e22'
                    }}>
                      {req.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    {req.status === 'pending' ? (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => updateStatus(req.id, 'approved')} 
                          style={{ background: '#2c7a4d', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => updateStatus(req.id, 'rejected')} 
                          style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdoptionRequests;