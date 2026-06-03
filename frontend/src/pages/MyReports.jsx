import React, { useState, useEffect } from "react";

const MyReports = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const storedReports = JSON.parse(localStorage.getItem('orphanReports') || '[]');
    setReports(storedReports);
  }, []);

  const getStatusStyle = (status) => {
    switch(status) {
      case 'resolved':
        return { background: '#e8f3ed', color: '#2c7a4d' };
      case 'in-progress':
        return { background: '#e3f2fd', color: '#2196f3' };
      default:
        return { background: '#fff3e0', color: '#e67e22' };
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'resolved':
        return 'Resolved ✓';
      case 'in-progress':
        return 'In Progress';
      default:
        return 'Pending Review';
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ color: '#1a4731', marginBottom: '20px' }}>My Rescue Reports</h1>
      
      {reports.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', background: 'white', borderRadius: '20px' }}>
          <i className="fas fa-file-alt" style={{ fontSize: '50px', color: '#8fc9a5' }}></i>
          <p>No reports submitted yet</p>
          <button 
            onClick={() => window.location.href = '/report-orphan'} 
            style={{ background: '#e25c2c', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '25px', cursor: 'pointer', marginTop: '10px' }}
          >
            Report an Orphan
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {reports.map((report) => (
            <div 
              key={report.id} 
              style={{ 
                background: 'white', 
                borderRadius: '15px', 
                padding: '20px', 
                borderLeft: `4px solid ${report.urgent ? '#e25c2c' : '#2c7a4d'}`,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: '10px' }}>
                <div>
                  <h3 style={{ margin: 0 }}>{report.childName || 'Unknown Child'}</h3>
                  <p style={{ color: '#6c7a7a', margin: '5px 0 0' }}>
                    <i className="fas fa-map-marker-alt"></i> {report.location}, {report.city}
                  </p>
                </div>
                <div>
                  <span style={{ fontSize: '12px', marginRight: '10px', color: '#8a9a9a' }}>
                    <i className="fas fa-calendar"></i> {new Date(report.reportedAt).toLocaleDateString()}
                  </span>
                  <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', ...getStatusStyle(report.rescueStatus) }}>
                    {getStatusText(report.rescueStatus)}
                  </span>
                </div>
              </div>
              
              <div style={{ marginTop: '10px' }}>
                <p style={{ margin: '5px 0' }}><strong>Age:</strong> {report.childAge} years</p>
                <p style={{ margin: '5px 0' }}><strong>Contact:</strong> {report.contactPerson || 'Not provided'}</p>
                <p style={{ color: '#5f6e6b', marginTop: '10px' }}>
                  {report.description?.length > 100 ? `${report.description.substring(0, 100)}...` : report.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReports;