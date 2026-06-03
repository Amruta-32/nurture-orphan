import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './OrphanageDashboard.css';
import API_URL from '../config';
const OrphanageDashboard = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [rescueRequests, setRescueRequests] = useState([]);
  const [donations, setDonations] = useState([]);
  const [completedRescues, setCompletedRescues] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [pendingVolunteers, setPendingVolunteers] = useState([]);
  const [showVolunteerModal, setShowVolunteerModal] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [totalDonations, setTotalDonations] = useState(0);
  const [donationStats, setDonationStats] = useState({
    monthly: 0,
    oneTime: 0,
    supporters: 0
  });
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [mapLocation, setMapLocation] = useState({ lat: 0, lng: 0 });
  const [children, setChildren] = useState([]);
const [adoptionRequests, setAdoptionRequests] = useState([]);
const [staff, setStaff] = useState([]); 
const [sponsorships, setSponsorships] = useState([]);
const [pendingSponsorships, setPendingSponsorships] = useState([]);
  // Load all data
  useEffect(() => {
    loadRescueRequests();
    loadDonations();
    loadCompletedRescues();
    loadVolunteers();
    loadChildren();
     loadStaff();
  loadAdoptionRequests(); 
  loadSponsorships();
  }, []);

  const loadRescueRequests = () => {
    const reports = JSON.parse(localStorage.getItem('orphanReports') || '[]');
    setRescueRequests(reports.filter(r => r.rescueStatus !== 'resolved'));
  };

  const loadDonations = () => {
    const allDonations = JSON.parse(localStorage.getItem('userDonations') || '[]');
    setDonations(allDonations);
    
    const total = allDonations.reduce((sum, d) => sum + (d.amountValue || 0), 0);
    setTotalDonations(total);
    
    const monthly = allDonations.filter(d => d.type === "monthly").length;
    const oneTime = allDonations.filter(d => d.type === "one-time").length;
    const uniqueSupporters = new Set(allDonations.map(d => d.donorName)).size;
    
    setDonationStats({ monthly, oneTime, supporters: uniqueSupporters || allDonations.length });
  };

  const loadCompletedRescues = () => {
    const reports = JSON.parse(localStorage.getItem('orphanReports') || '[]');
    const completed = reports.filter(r => r.rescueStatus === 'resolved');
    setCompletedRescues(completed);
  };

const loadVolunteers = async () => {
  try {
    const response = await fetch(`${API_URL}/volunteer/all`);
    const data = await response.json();
    console.log("Volunteers from API:", data);
    
    if (data.success) {
      setVolunteers(data.volunteers || []);
      setPendingVolunteers((data.volunteers || []).filter(v => v.status === 'pending'));
    }
  } catch (error) {
    console.error("Error fetching volunteers:", error);
  }
};

 const loadChildren = async () => {
  try {
    const orphanageId = localStorage.getItem('orphanageId') || '1';
    const response = await fetch(`${API_URL}/children/orphanage/${orphanageId}`);
    const data = await response.json();
    setChildren(data.children || []);
  } catch (error) {
    console.error("Error loading children:", error);
    setChildren([]);
  }
};

const loadStaff = async () => {
  try {
    const orphanageId = localStorage.getItem('orphanageId') || '1';
    const response = await fetch(`${API_URL}/staff/orphanage/${orphanageId}`);
    const data = await response.json();
    setStaff(data.staff || []);
  } catch (error) {
    console.error("Error loading staff:", error);
  }
};
const loadAdoptionRequests = () => {
  const requests = JSON.parse(localStorage.getItem('adoptionRequests') || '[]');
  setAdoptionRequests(requests);
};
const updateVolunteerStatus = async (volunteerId, status) => {
  console.log("Updating volunteer:", volunteerId, "to status:", status);
  
  try {
    const response = await fetch(`http://localhost:5000/api/volunteer/${volunteerId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    
    const data = await response.json();
    console.log("Update response:", data);
    
    if (response.ok) {
      alert(`Volunteer ${status === 'approved' ? 'approved' : 'rejected'} successfully!`);
      loadVolunteers(); // Refresh the list
    } else {
      alert(data.message || 'Failed to update status');
    }
  } catch (error) {
    console.error("Error updating volunteer status:", error);
    alert("Network error. Please try again.");
  }
};

 const updateRescueStatus = async (reportId, status) => {
  const reports = JSON.parse(localStorage.getItem('orphanReports') || '[]');
  const report = reports.find(r => r.id === reportId);
  
  const updatedReports = reports.map(r => 
    r.id === reportId ? { ...r, rescueStatus: status, assignedAt: new Date().toISOString() } : r
  );
  localStorage.setItem('orphanReports', JSON.stringify(updatedReports));
  
  // If status is 'resolved', add to rescued_children table
  if (status === 'resolved' && report) {
    try {
      const rescuedChildData = {
        name: report.childName,
        age: parseInt(report.childAge) || 0,
        gender: report.childGender || 'other',
        city: report.city || 'Unknown',
        location: report.location,
        rescuedDate: new Date().toISOString(),
        reportedBy: report.reportedBy,
        contactPerson: report.contactPerson,
        contactPhone: report.contactPhone,
        status: 'available',
        orphanageId: localStorage.getItem('orphanageId') || '1',
        reportId: reportId
      };
      
      const response = await fetch('http://localhost:5000/api/children/add-rescued', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rescuedChildData)
      });
      
      if (response.ok) {
        alert(`Rescued child "${report.childName}" added to rescued_children table!`);
      }
    } catch (error) {
      console.error("Error adding rescued child:", error);
    }
  }
  
  loadRescueRequests();
  loadCompletedRescues();
  loadChildren();
  
  alert(status === 'resolved' ? 'Rescue completed! Child added to rescued_children table.' : 'Status updated');
};
const updateAdoptionStatus = (requestId, status) => {
  const requests = JSON.parse(localStorage.getItem('adoptionRequests') || '[]');
  const updatedRequests = requests.map(req => 
    req.id === requestId ? { ...req, status: status, updatedAt: new Date().toISOString() } : req
  );
  localStorage.setItem('adoptionRequests', JSON.stringify(updatedRequests));
  loadAdoptionRequests();
  
  const message = status === 'approved' ? 'Adoption request approved!' : 
                  status === 'rejected' ? 'Adoption request rejected.' :
                  'Request verified';
  alert(message);
};
  const openMap = (location) => {
    const mockCoordinates = {
      'Mumbai': { lat: 19.0760, lng: 72.8777 },
      'Delhi': { lat: 28.7041, lng: 77.1025 },
      'Bangalore': { lat: 12.9716, lng: 77.5946 },
      'Chennai': { lat: 13.0827, lng: 80.2707 },
      'Kolkata': { lat: 22.5726, lng: 88.3639 }
    };
    
    const coords = mockCoordinates[location.city] || { lat: 20.5937, lng: 78.9629 };
    setMapLocation(coords);
    setSelectedRequest(location);
    setShowMap(true);
  };
const loadSponsorships = () => {
  const allSponsorships = JSON.parse(localStorage.getItem('sponsorships') || '[]');
  setSponsorships(allSponsorships);
  setPendingSponsorships(allSponsorships.filter(s => s.status === 'pending'));
};
const updateSponsorshipStatus = (sponsorshipId, status) => {
  const allSponsorships = JSON.parse(localStorage.getItem('sponsorships') || '[]');
  const updatedSponsorships = allSponsorships.map(s => 
    s.id === sponsorshipId ? { ...s, status: status, updatedAt: new Date().toISOString() } : s
  );
  localStorage.setItem('sponsorships', JSON.stringify(updatedSponsorships));
  loadSponsorships();
  alert(`Sponsorship ${status === 'approved' ? 'approved' : 'rejected'} successfully!`);
};

  const closeMap = () => {
    setShowMap(false);
    setSelectedRequest(null);
  };

  const stats = [
    { icon: 'fas fa-child', value: children.length, label: 'Total Children' },
    { icon: 'fas fa-user-friends', value: '12', label: 'Staff Members' },
    { icon: 'fas fa-hand-holding-heart', value: `₹${totalDonations.toLocaleString()}`, label: 'Donations Received' },
    { icon: 'fas fa-ambulance', value: rescueRequests.filter(r => r.rescueStatus === 'pending').length, label: 'Pending Rescues' }
  ];

  const reports = [
    { id: 1, title: 'Monthly Progress Report - March 2025', date: '2025-03-25', status: 'pending', organization: 'NurtureOrphan HQ' },
    { id: 2, title: 'Children Education Report', date: '2025-03-20', status: 'approved', organization: 'Education Department' },
    { id: 3, title: 'Medical Camp Summary', date: '2025-03-15', status: 'completed', organization: 'Care Home' },
    { id: 4, title: 'Fund Utilization Report', date: '2025-03-10', status: 'pending', organization: 'Finance Committee' }
  ];

  const getStatusClass = (status) => {
    switch(status) {
      case 'pending': return 'status-pending';
      case 'approved': return 'status-approved';
      case 'completed': return 'status-completed';
      default: return '';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'pending': return 'Pending Review';
      case 'approved': return 'Approved';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  const handleLogout = () => {
    navigate('/');
  };

  const pendingRescues = rescueRequests.filter(r => r.rescueStatus === 'pending');
  const inProgressRescues = rescueRequests.filter(r => r.rescueStatus === 'in-progress');
const sendEmailToVolunteer = async () => {
  const volunteerEmail = selectedVolunteer?.email;
  const volunteerName = selectedVolunteer?.name;
  const senderName = document.getElementById('senderName')?.value;
  const senderEmail = document.getElementById('senderEmail')?.value;
  const subject = document.getElementById('emailSubject')?.value;
  const message = document.getElementById('messageContent')?.value;
  
  if (!senderName || !senderEmail || !message) {
    alert('Please fill in your name, email, and message');
    return;
  }
  
  // Show loading state
  const sendBtn = document.querySelector('.send-message-btn');
  const originalText = sendBtn.innerHTML;
  sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  sendBtn.disabled = true;
  
  try {
    const response = await fetch('http://localhost:5000/api/email/send-volunteer-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        volunteerEmail,
        volunteerName,
        senderName,
        senderEmail,
        subject: subject || `Volunteer Opportunity from NurtureOrphan`,
        message: message
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      alert(`✓ Email sent successfully to ${volunteerName}!`);
      if (data.previewUrl) {
        console.log('Preview URL:', data.previewUrl);
      }
      setShowVolunteerModal(false);
    } else {
      alert('Failed to send email. Please try again.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Network error. Please try again.');
  } finally {
    sendBtn.innerHTML = originalText;
    sendBtn.disabled = false;
  }
};
  return (
    <div className="orphanage-dashboard">
      {/* Sidebar */}
      <div className="dashboard-sidebar">
        <div className="sidebar-logo">
          <i className="fas fa-hand-holding-heart"></i>
          <h2>NurtureOrphan</h2>
        </div>
        
        <div className="sidebar-menu">
          <div className={`menu-item ${activeMenu === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveMenu('dashboard')}>
            <i className="fas fa-tachometer-alt"></i>
            <span>Dashboard</span>
          </div>
          <div className={`menu-item ${activeMenu === 'rescue' ? 'active' : ''}`} onClick={() => setActiveMenu('rescue')}>
            <i className="fas fa-ambulance"></i>
            <span>Rescue Requests</span>
            {pendingRescues.length > 0 && <span className="badge">{pendingRescues.length}</span>}
          </div>
          <div className={`menu-item ${activeMenu === 'donations' ? 'active' : ''}`} onClick={() => setActiveMenu('donations')}>
            <i className="fas fa-hand-holding-usd"></i>
            <span>Donations</span>
            {donations.length > 0 && <span className="badge">{donations.length}</span>}
          </div>
          <div className={`menu-item ${activeMenu === 'history' ? 'active' : ''}`} onClick={() => setActiveMenu('history')}>
            <i className="fas fa-history"></i>
            <span>Rescue History</span>
            {completedRescues.length > 0 && <span className="badge">{completedRescues.length}</span>}
          </div>
          <div className={`menu-item ${activeMenu === 'volunteers' ? 'active' : ''}`} onClick={() => setActiveMenu('volunteers')}>
            <i className="fas fa-hands-helping"></i>
            <span>Volunteers</span>
            {pendingVolunteers.length > 0 && <span className="badge">{pendingVolunteers.length}</span>}
          </div>
          <div className={`menu-item ${activeMenu === 'children' ? 'active' : ''}`} onClick={() => setActiveMenu('children')}>
            <i className="fas fa-child"></i>
            <span>Our Children</span>
            {children.length > 0 && <span className="badge">{children.length}</span>}
          </div>
          <div className="menu-item" onClick={() => navigate('/sponsorship-requests')}>
  <i className="fas fa-hand-holding-heart"></i>
  <span>Sponsorship Requests</span>
  {pendingSponsorships > 0 && <span className="badge">{pendingSponsorships}</span>}
</div>
          <div className={`menu-item ${activeMenu === 'staff' ? 'active' : ''}`} onClick={() => setActiveMenu('staff')}>
  <i className="fas fa-users"></i>
  <span>Staff</span>
  {staff.length > 0 && <span className="badge">{staff.length}</span>}
</div>
         <div className={`menu-item ${activeMenu === 'reports' ? 'active' : ''}`} onClick={() => navigate('/reports')}>
  <i className="fas fa-chart-line"></i>
  <span>Reports</span>
</div>
           
<div className="menu-item" onClick={() => navigate('/adoption-requests')}>
  <i className="fas fa-heart"></i>
  <span>Adoption Requests</span>
</div>
         <div className={`menu-item ${activeMenu === "settings" ? "active" : ""}`} onClick={() => navigate('/settings')}>
  <i className="fas fa-cog"></i>
  <span>Settings</span>
</div>
       
        <div className={`menu-item ${activeMenu === 'stories' ? 'active' : ''}`} onClick={() => navigate('/orphanage-stories')}>
  <i className="fas fa-book-open"></i>
  <span>Stories</span>
  {stats.pending > 0 && <span className="badge">{stats.pending}</span>}
</div>
      </div>   <button className="logout-btn" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i>
          <span>Logout</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Dashboard Home */}
        {activeMenu === 'dashboard' && (
          <>
            <div className="content-header">
              <h1>Welcome back, Sunshine Orphanage!</h1>
              <div className="header-actions">
                </div>
            </div>

            <div className="stats-cards">
              {stats.map((stat, index) => (
                <div className="stat-card" key={index}>
                  <div className="card-icon"><i className={stat.icon}></i></div>
                  <h3>{stat.value}</h3>
                  <p>{stat.label}</p>
                </div>
              ))}
            </div>
 {/* Quick Actions */}
            <div className="section-title" style={{ marginTop: '30px' }}><h2><i className="fas fa-bolt"></i> Quick Actions</h2></div>
            <div className="quick-actions">
              <button className="action-btn action-btn-primary" onClick={() => navigate('/add-child')}><i className="fas fa-plus"></i> Add New Child</button>
              <button className="action-btn action-btn-secondary"><i className="fas fa-hand-holding-heart"></i> Request Donation</button>
              <button className="action-btn action-btn-warning"><i className="fas fa-chart-line"></i> Generate Report</button>
            </div>
          
            {/* Rescue Requests Section */}
            <div className="rescue-section">
              <div className="section-title">
                <h2><i className="fas fa-ambulance"></i> Rescue Requests from Locality</h2>
                <a href="#" onClick={() => setActiveMenu('rescue')}>View All →</a>
              </div>

              {pendingRescues.length > 0 && (
                <div className="rescue-category">
                  <h3 className="category-title"><i className="fas fa-clock"></i> Urgent Rescue Needed <span className="count">{pendingRescues.length}</span></h3>
                  <div className="rescue-requests">
                    {pendingRescues.slice(0, 3).map((request) => (
                      <div className={`rescue-card ${request.urgent ? 'urgent' : ''}`} key={request.id}>
                        <div className="rescue-header">
                          <div className="rescue-id">#{request.id.toString().slice(-8)}</div>
                          {request.urgent && <div className="urgent-badge">⚠️ URGENT</div>}
                          <div className="rescue-status status-pending">Pending Rescue</div>
                        </div>
                        <div className="rescue-body">
                          <div className="rescue-info">
                            <div className="info-row"><i className="fas fa-map-marker-alt"></i><strong>Location:</strong> {request.location}, {request.city}<button className="map-btn" onClick={() => openMap(request)}><i className="fas fa-map"></i> View Map</button></div>
                            <div className="info-row"><i className="fas fa-child"></i><strong>Child:</strong> {request.childName || 'Unknown'} • Age: {request.childAge}</div>
                            <div className="info-row"><i className="fas fa-user"></i><strong>Reported by:</strong> {request.contactPerson} ({request.contactPhone})</div>
                            <div className="info-row"><i className="fas fa-calendar"></i><strong>Reported:</strong> {new Date(request.reportedAt).toLocaleString()}</div>
                            <div className="info-row description"><i className="fas fa-info-circle"></i><strong>Description:</strong> {request.description}</div>
                          </div>
                          <div className="rescue-actions">
                            <button className="rescue-accept-btn" onClick={() => updateRescueStatus(request.id, 'in-progress')}><i className="fas fa-check-circle"></i> Accept & Dispatch Team</button>
                            <button className="rescue-reject-btn" onClick={() => updateRescueStatus(request.id, 'rejected')}><i className="fas fa-times-circle"></i> Unable to Rescue</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {inProgressRescues.length > 0 && (
                <div className="rescue-category">
                  <h3 className="category-title"><i className="fas fa-spinner fa-spin"></i> Rescue In Progress <span className="count">{inProgressRescues.length}</span></h3>
                  <div className="rescue-requests">
                    {inProgressRescues.slice(0, 3).map((request) => (
                      <div className="rescue-card in-progress" key={request.id}>
                        <div className="rescue-header">
                          <div className="rescue-id">#{request.id.toString().slice(-8)}</div>
                          <div className="rescue-status status-in-progress"><i className="fas fa-spinner fa-spin"></i> Rescue In Progress</div>
                        </div>
                        <div className="rescue-body">
                          <div className="rescue-info">
                            <div className="info-row"><i className="fas fa-map-marker-alt"></i><strong>Location:</strong> {request.location}, {request.city}<button className="map-btn" onClick={() => openMap(request)}><i className="fas fa-map"></i> Track Location</button></div>
                            <div className="info-row"><i className="fas fa-child"></i><strong>Child:</strong> {request.childName || 'Unknown'} • Age: {request.childAge}</div>
                            <div className="info-row"><i className="fas fa-truck"></i><strong>Assigned Team:</strong> Rescue Team Alpha</div>
                          </div>
                          <div className="rescue-actions">
                            <button className="rescue-complete-btn" onClick={() => updateRescueStatus(request.id, 'resolved')}><i className="fas fa-flag-checkered"></i> Mark as Rescued Successfully</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {pendingRescues.length === 0 && inProgressRescues.length === 0 && (
                <div className="empty-state"><i className="fas fa-check-circle"></i><h3>No Active Rescue Requests</h3><p>When someone reports an orphan in need, it will appear here.</p></div>
              )}
            </div>

            {/* Donations Received Section */}
            <div className="section-title" style={{ marginTop: '30px' }}>
              <h2><i className="fas fa-hand-holding-heart"></i> Donations Received</h2>
              <a href="#" onClick={() => setActiveMenu('donations')}>View All →</a>
            </div>

            <div className="donations-summary">
              {donations.length === 0 ? (
                <div className="empty-donations"><i className="fas fa-gift"></i><p>No donations received yet</p><small>Share your orphanage profile to receive donations</small></div>
              ) : (
                <div className="donations-list">
                  {donations.slice(0, 5).map((donation) => (
                    <div className="donation-item-card" key={donation.id}>
                      <div className="donation-amount-large">₹{donation.amountValue}</div>
                      <div className="donation-details">
                        <p><strong>{donation.donorName || "Anonymous Supporter"}</strong></p>
                        <p><i className="fas fa-calendar"></i> {new Date(donation.date).toLocaleDateString()}</p>
                        <p><i className="fas fa-tag"></i> {donation.type === "monthly" ? "Monthly Donation" : "One-Time Donation"}</p>
                      </div>
                      <div className="donation-purpose-badge">
                        {donation.purpose === "education" && "📚 Education"}
                        {donation.purpose === "medical" && "🏥 Medical"}
                        {donation.purpose === "food" && "🍲 Food"}
                        {donation.purpose === "shelter" && "🏠 Shelter"}
                        {!donation.purpose && "❤️ General"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Rescue History Section */}
            <div className="section-title" style={{ marginTop: '30px' }}>
              <h2><i className="fas fa-history"></i> Rescue History</h2>
              <a href="#" onClick={() => setActiveMenu('history')}>View All →</a>
            </div>

            <div className="rescue-history">
              {completedRescues.length === 0 ? (
                <div className="empty-history"><i className="fas fa-check-circle"></i><p>No completed rescues yet</p><small>When rescues are completed, they will appear here</small></div>
              ) : (
                <div className="history-list">
                  {completedRescues.slice(0, 5).map((rescue) => (
                    <div className="history-card" key={rescue.id}>
                      <div className="history-icon"><i className="fas fa-check-circle"></i></div>
                      <div className="history-details">
                        <h4>{rescue.childName || 'Unknown Child'}</h4>
                        <p><i className="fas fa-map-marker-alt"></i> {rescue.location}, {rescue.city}</p>
                        <p><i className="fas fa-calendar"></i> Rescued on: {new Date(rescue.assignedAt || rescue.reportedAt).toLocaleDateString()}</p>
                      </div>
                      <div className="history-status resolved"><span className="status-badge-resolved">✓ Resolved</span></div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Volunteers Section */}
            <div className="section-title" style={{ marginTop: '30px' }}>
              <h2><i className="fas fa-hands-helping"></i> Volunteer Applications</h2>
              <a href="#" onClick={() => setActiveMenu('volunteers')}>View All →</a>
            </div>

            <div className="volunteers-summary">
              {pendingVolunteers.length === 0 ? (
                <div className="empty-volunteers"><i className="fas fa-user-plus"></i><p>No pending volunteer applications</p></div>
              ) : (
                <div className="volunteers-list">
                  {pendingVolunteers.slice(0, 3).map((volunteer) => (
                    <div className="volunteer-card" key={volunteer.id}>
                      <div className="volunteer-info">
                        <h4>{volunteer.name}</h4>
                        <p><i className="fas fa-map-marker-alt"></i> {volunteer.city}</p>
                        <p><i className="fas fa-tools"></i> Skills: {volunteer.skills?.join(', ') || 'General'}</p>
                        <p><i className="fas fa-clock"></i> Availability: {volunteer.availability}</p>
                      </div>
                      <div className="volunteer-actions">
                        <button className="contact-volunteer-btn" onClick={() => { setSelectedVolunteer(volunteer); setShowVolunteerModal(true); }}><i className="fas fa-phone-alt"></i> Contact</button>
                       </div>
                       {volunteer.status === 'pending' && (
  <>
    <button 
      className="action-approve-btn" 
      onClick={() => updateVolunteerStatus(volunteer._id, 'approved')}
    >
      <i className="fas fa-check"></i>
    </button>
    <button 
      className="action-reject-btn" 
      onClick={() => updateVolunteerStatus(volunteer._id, 'rejected')}
    >
      <i className="fas fa-times"></i>
    </button>
  </>
)}
                       </div>
                  ))}
                </div>
              )}
            </div>

           

           </>
        )}
 
 
        {/* Rescue Requests Full Page */}
        {activeMenu === 'rescue' && (
          <div className="rescue-full-page">
            <div className="page-header"><h1><i className="fas fa-ambulance"></i> All Rescue Requests</h1><div className="total-badge">Total: {rescueRequests.length}</div></div>
            <div className="rescue-requests-full">
              {rescueRequests.length === 0 ? (
                <div className="empty-state"><i className="fas fa-check-circle"></i><h3>No Rescue Requests</h3></div>
              ) : (
                rescueRequests.map((request) => (
                  <div className={`rescue-card ${request.urgent ? 'urgent' : ''}`} key={request.id}>
                    <div className="rescue-header"><div className="rescue-id">#{request.id.toString().slice(-8)}</div>{request.urgent && <div className="urgent-badge">⚠️ URGENT</div>}<div className={`rescue-status ${request.rescueStatus === 'pending' ? 'status-pending' : 'status-in-progress'}`}>{request.rescueStatus === 'pending' ? 'Pending' : 'In Progress'}</div></div>
                    <div className="rescue-body">
                      <div className="rescue-info">
                        <div className="info-row"><i className="fas fa-map-marker-alt"></i><strong>Location:</strong> {request.location}, {request.city}<button className="map-btn" onClick={() => openMap(request)}><i className="fas fa-map"></i> View Map</button></div>
                        <div className="info-row"><i className="fas fa-child"></i><strong>Child:</strong> {request.childName || 'Unknown'} • Age: {request.childAge}</div>
                        <div className="info-row"><i className="fas fa-user"></i><strong>Reported by:</strong> {request.contactPerson} ({request.contactPhone})</div>
                        <div className="info-row"><i className="fas fa-calendar"></i><strong>Reported:</strong> {new Date(request.reportedAt).toLocaleString()}</div>
                        <div className="info-row description"><i className="fas fa-info-circle"></i><strong>Description:</strong> {request.description}</div>
                      </div>
                      <div className="rescue-actions">
                        {request.rescueStatus === 'pending' && (<><button className="rescue-accept-btn" onClick={() => updateRescueStatus(request.id, 'in-progress')}><i className="fas fa-check-circle"></i> Accept Rescue</button><button className="rescue-reject-btn" onClick={() => updateRescueStatus(request.id, 'rejected')}><i className="fas fa-times-circle"></i> Reject</button></>)}
                        {request.rescueStatus === 'in-progress' && (<button className="rescue-complete-btn" onClick={() => updateRescueStatus(request.id, 'resolved')}><i className="fas fa-flag-checkered"></i> Mark as Rescued</button>)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Donations Full Page */}
        {activeMenu === 'donations' && (
          <div className="donations-full-page">
            <div className="page-header"><h1><i className="fas fa-hand-holding-heart"></i> All Donations</h1><div className="total-donations-badge">Total: ₹{totalDonations.toLocaleString()}</div></div>
            <div className="donations-stats-full">
              <div className="stat-box"><h3>{donations.length}</h3><p>Total Donations</p></div>
              <div className="stat-box"><h3>{donationStats.supporters}</h3><p>Unique Supporters</p></div>
              <div className="stat-box"><h3>{donationStats.monthly}</h3><p>Monthly Donations</p></div>
              <div className="stat-box"><h3>{donationStats.oneTime}</h3><p>One-Time Donations</p></div>
            </div>
            {donations.length === 0 ? (
              <div className="empty-state"><i className="fas fa-gift"></i><h3>No Donations Yet</h3><p>When supporters donate, they will appear here.</p></div>
            ) : (
              <div className="donations-table-container">
                <table className="donations-table">
                  <thead><tr><th>Date</th><th>Donor</th><th>Amount</th><th>Type</th><th>Purpose</th><th>Status</th></tr></thead>
                  <tbody>
                    {donations.map((donation) => (
                      <tr key={donation.id}>
                        <td>{new Date(donation.date).toLocaleDateString()}</td>
                        <td>{donation.donorName || "Anonymous"}</td>
                        <td className="amount-cell">₹{donation.amountValue}</td>
                        <td>{donation.type === "monthly" ? "Monthly" : "One-Time"}</td>
                        <td>{donation.purpose || "General"}</td>
                        <td><span className="status-completed">Completed</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Rescue History Full Page */}
        {activeMenu === 'history' && (
          <div className="history-full-page">
            <div className="page-header"><h1><i className="fas fa-history"></i> Rescue History</h1><div className="total-badge">Total: {completedRescues.length} Rescues</div></div>
            <div className="history-stats">
              <div className="stat-box"><h3>{completedRescues.length}</h3><p>Total Rescues</p></div>
              <div className="stat-box"><h3>{completedRescues.filter(r => r.urgent).length}</h3><p>Urgent Rescues</p></div>
              <div className="stat-box"><h3>{new Set(completedRescues.map(r => r.city)).size}</h3><p>Cities Covered</p></div>
            </div>
            {completedRescues.length === 0 ? (
              <div className="empty-state"><i className="fas fa-check-circle"></i><h3>No Completed Rescues Yet</h3><p>When you complete rescues, they will appear here.</p></div>
            ) : (
              <div className="history-table-container">
                <table className="history-table">
                  <thead><tr><th>Date</th><th>Child Name</th><th>Location</th><th>Age</th><th>Status</th><th>Reported By</th></tr></thead>
                  <tbody>
                    {completedRescues.map((rescue) => (
                      <tr key={rescue.id}>
                        <td>{new Date(rescue.assignedAt || rescue.reportedAt).toLocaleDateString()}</td>
                        <td><strong>{rescue.childName || 'Unknown'}</strong></td>
                        <td>{rescue.location}, {rescue.city}</td>
                        <td>{rescue.childAge} years</td>
                        <td><span className="status-resolved-badge">✓ Resolved</span></td>
                        <td>{rescue.contactPerson || 'Anonymous'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      
{/* Adoption Requests Full Page */}
{activeMenu === 'adoptions' && (
  <div className="adoptions-full-page">
    <div className="page-header">
      <h1><i className="fas fa-heart"></i> Adoption Requests</h1>
      <div className="total-badge">
        Total: {adoptionRequests.length} | Pending: {adoptionRequests.filter(r => r.status === 'pending').length}
      </div>
    </div>

    <div className="adoption-stats">
      <div className="stat-box">
        <h3>{adoptionRequests.length}</h3>
        <p>Total Requests</p>
      </div>
      <div className="stat-box">
        <h3>{adoptionRequests.filter(r => r.status === 'pending').length}</h3>
        <p>Pending</p>
      </div>
      <div className="stat-box">
        <h3>{adoptionRequests.filter(r => r.status === 'approved').length}</h3>
        <p>Approved</p>
      </div>
      <div className="stat-box">
        <h3>{adoptionRequests.filter(r => r.status === 'rejected').length}</h3>
        <p>Rejected</p>
      </div>
    </div>

    <div className="adoptions-table-container">
      <table className="adoptions-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Child Name</th>
            <th>Age</th>
            <th>Applicant</th>
            <th>Contact</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {adoptionRequests.map((request) => (
            <tr key={request.id}>
              <td>{new Date(request.requestedAt).toLocaleDateString()}</td>
              <td><strong>{request.childName}</strong></td>
              <td>{request.childAge} years</td>
              <td>{request.adopterName}</td>
              <td>{request.adopterPhone}<br/><small>{request.adopterEmail}</small></td>
              <td>{request.reason?.substring(0, 50)}...</td>
              <td>
                <span className={`status-badge ${request.status}`}>
                  {request.status}
                </span>
              </td>
              <td>
                {request.status === 'pending' && (
                  <div className="table-actions">
                    <button className="action-approve" onClick={() => updateAdoptionStatus(request.id, 'approved')}>
                      <i className="fas fa-check"></i> Approve
                    </button>
                    <button className="action-verify" onClick={() => updateAdoptionStatus(request.id, 'verified')}>
                      <i className="fas fa-clipboard-check"></i> Verify
                    </button>
                    <button className="action-reject" onClick={() => updateAdoptionStatus(request.id, 'rejected')}>
                      <i className="fas fa-times"></i> Reject
                    </button>
                  </div>
                )}
                {request.status === 'verified' && (
                  <div className="table-actions">
                    <button className="action-approve" onClick={() => updateAdoptionStatus(request.id, 'approved')}>
                      <i className="fas fa-check"></i> Final Approve
                    </button>
                    <button className="action-reject" onClick={() => updateAdoptionStatus(request.id, 'rejected')}>
                      <i className="fas fa-times"></i> Reject
                    </button>
                  </div>
                )}
                {request.status === 'approved' && (
                  <span className="approved-text">✓ Approved</span>
                )}
                {request.status === 'rejected' && (
                  <span className="rejected-text">✗ Rejected</span>
                )}
              </td>
             </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}
        {/* Children Full Page */}
        {activeMenu === 'children' && (
          <div className="children-full-page">
            <div className="page-header">
              <h1><i className="fas fa-child"></i> Our Children</h1>
              <button className="add-child-btn" onClick={() => navigate('/add-child')}>
                <i className="fas fa-plus"></i> Add New Child
              </button>
            </div>

            {children.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-child"></i>
                <h3>No Children Added Yet</h3>
                <p>Click "Add New Child" to register a child</p>
                <button className="add-btn" onClick={() => navigate('/add-child')}>Add First Child</button>
              </div>
            ) : (
              <div className="children-grid">
  {children.map((child, index) => (
    <div className="child-profile-card" key={child._id || child.id || index}>
      <div className="child-photo">
        {child.photo ? <img src={child.photo} alt={child.name} /> : <i className="fas fa-child"></i>}
      </div>
      <div className="child-details">
        <h3>
          {child.name}
          {child.isRescued && <span className="rescued-badge">✓ Rescued</span>}
        </h3>
        <p><i className="fas fa-calendar-alt"></i> Age: {child.age} years</p>
        <p><i className="fas fa-venus-mars"></i> {child.gender === 'male' ? 'Boy' : child.gender === 'female' ? 'Girl' : 'Other'}</p>
        <p><i className="fas fa-heartbeat"></i> Health: <span className={`health-${child.healthStatus}`}>{child.healthStatus || 'Good'}</span></p>
        <p><i className="fas fa-graduation-cap"></i> Education: {child.educationLevel || 'Not specified'}</p>
        <p><i className="fas fa-star"></i> Hobbies: {child.hobbies || 'None'}</p>
        {child.isRescued && (
          <p><i className="fas fa-map-marker-alt"></i> Rescued from: {child.location}, {child.city}</p>
        )}
        <div className={`status-badge ${child.status || 'active'}`}>{child.status || 'active'}</div>
      </div>
    </div>
  ))}
</div>
            )}
          </div>
        )}
{/* Volunteers Full Page - ONLY shows when Volunteers menu is clicked */}
{activeMenu === 'volunteers' && (
  <div className="volunteers-full-page">
    <div className="page-header">
      <h1><i className="fas fa-hands-helping"></i> Volunteer Management</h1>
      <div className="total-badge">Total: {volunteers.length} | Pending: {pendingVolunteers.length}</div>
    </div>

    <div className="volunteer-stats">
      <div className="stat-box"><h3>{volunteers.length}</h3><p>Total Applications</p></div>
      <div className="stat-box"><h3>{pendingVolunteers.length}</h3><p>Pending Review</p></div>
      <div className="stat-box"><h3>{volunteers.filter(v => v.status === 'approved').length}</h3><p>Approved</p></div>
      <div className="stat-box"><h3>{volunteers.filter(v => v.status === 'active').length}</h3><p>Active Volunteers</p></div>
    </div>

    <div className="volunteers-table-container">
      <table className="volunteers-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Contact</th>
            <th>City</th>
            <th>Skills</th>
            <th>Availability</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {volunteers.map((volunteer) => (
            <tr key={volunteer._id}>
              <td><strong>{volunteer.name}</strong></td>
              <td>{volunteer.phone}<br/><small>{volunteer.email}</small></td>
              <td>{volunteer.city}</td>
              <td>{volunteer.skills?.slice(0, 2).join(', ')}{volunteer.skills?.length > 2 && '...'}</td>
              <td><span className={`availability-badge ${volunteer.availability}`}>{volunteer.availability}</span></td>
              <td><span className={`status-badge ${volunteer.status}`}>{volunteer.status}</span></td>
              <td>
                <button className="action-contact-btn" onClick={() => { setSelectedVolunteer(volunteer); setShowVolunteerModal(true); }}>
                  <i className="fas fa-envelope"></i>
                </button>
                {volunteer.status === 'pending' && (
                  <>
                    <button className="action-approve-btn" onClick={() => updateVolunteerStatus(volunteer._id, 'approved')}>
                      <i className="fas fa-check"></i>
                    </button>
                    <button className="action-reject-btn" onClick={() => updateVolunteerStatus(volunteer._id, 'rejected')}>
                      <i className="fas fa-times"></i>
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
       </table>
    </div>
  </div>
)}
        {/* Other Pages */}
    {/* Staff Full Page */}
{activeMenu === 'staff' && (
  <div className="staff-full-page">
    <div className="page-header">
      <h1><i className="fas fa-users"></i> Staff Management</h1>
      <button className="add-staff-btn" onClick={() => navigate('/add-staff')}>
        <i className="fas fa-plus"></i> Add Staff Member
      </button>
    </div>

    <div className="staff-stats">
      <div className="stat-box">
        <h3>{staff.length}</h3>
        <p>Total Staff</p>
      </div>
      <div className="stat-box">
        <h3>{staff.filter(s => s.status === 'active').length}</h3>
        <p>Active</p>
      </div>
      <div className="stat-box">
        <h3>{staff.filter(s => s.department === 'Teaching').length}</h3>
        <p>Teachers</p>
      </div>
      <div className="stat-box">
        <h3>{staff.filter(s => s.department === 'Medical').length}</h3>
        <p>Medical Staff</p>
      </div>
    </div>

    {staff.length === 0 ? (
      <div className="empty-state">
        <i className="fas fa-users"></i>
        <h3>No Staff Members Added Yet</h3>
        <p>Click "Add Staff Member" to register staff</p>
        <button className="add-btn" onClick={() => navigate('/add-staff')}>Add First Staff</button>
      </div>
    ) : (
      <div className="staff-grid">
        {staff.map((member) => (
          <div className="staff-card" key={member._id}>
            <div className="staff-photo">
              <i className="fas fa-user-circle"></i>
            </div>
            <div className="staff-details">
              <h3>{member.name}</h3>
              <p><i className="fas fa-briefcase"></i> {member.position}</p>
              <p><i className="fas fa-building"></i> {member.department}</p>
              <p><i className="fas fa-phone"></i> {member.phone}</p>
              <p><i className="fas fa-envelope"></i> {member.email}</p>
              <p><i className="fas fa-clock"></i> Shift: {member.shift}</p>
              <span className={`staff-status ${member.status}`}>{member.status}</span>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
)}
        {activeMenu === 'reports' && (
          <div className="coming-soon"><i className="fas fa-clock"></i><h2>Reports</h2><p>This feature is under development.</p><button className="back-btn" onClick={() => setActiveMenu('dashboard')}>Back to Dashboard</button></div>
        )}
        {activeMenu === 'settings' && (
          <div className="coming-soon"><i className="fas fa-clock"></i><h2>Settings</h2><p>This feature is under development.</p><button className="back-btn" onClick={() => setActiveMenu('dashboard')}>Back to Dashboard</button></div>
        )}
      </div>

      {/* Map Modal */}
      {showMap && selectedRequest && (
        <div className="map-modal" onClick={closeMap}>
          <div className="map-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="map-modal-header"><h3><i className="fas fa-map-marker-alt"></i> Rescue Location</h3><button className="close-map-btn" onClick={closeMap}>&times;</button></div>
            <div className="map-modal-body">
              <div className="location-details"><p><strong>📍 Address:</strong> {selectedRequest.location}, {selectedRequest.city}</p><p><strong>🏷️ Landmark:</strong> {selectedRequest.landmark || 'Not specified'}</p><p><strong>👤 Reported by:</strong> {selectedRequest.contactPerson}</p><p><strong>📞 Contact:</strong> {selectedRequest.contactPhone}</p></div>
              <div className="map-container"><iframe title="Rescue Location Map" width="100%" height="400" style={{ border: 0, borderRadius: '16px' }} loading="lazy" allowFullScreen src={`https://www.openstreetmap.org/export/embed.html?bbox=${mapLocation.lng - 0.05},${mapLocation.lat - 0.05},${mapLocation.lng + 0.05},${mapLocation.lat + 0.05}&layer=mapnik&marker=${mapLocation.lat},${mapLocation.lng}`}></iframe></div>
              <div className="map-actions"><a href={`https://www.google.com/maps?q=${mapLocation.lat},${mapLocation.lng}`} target="_blank" rel="noopener noreferrer" className="directions-btn"><i className="fas fa-directions"></i> Get Directions</a><button className="dispatch-btn" onClick={() => { updateRescueStatus(selectedRequest.id, 'in-progress'); closeMap(); }}><i className="fas fa-truck"></i> Dispatch Rescue Team</button></div>
            </div>
          </div>
        </div>
      )}

     {/* Contact Volunteer Modal */}
{showVolunteerModal && selectedVolunteer && (
  <div className="contact-modal" onClick={() => setShowVolunteerModal(false)}>
    <div className="contact-modal-content" onClick={(e) => e.stopPropagation()}>
      <div className="contact-modal-header">
        <h3><i className="fas fa-user"></i> Contact Volunteer</h3>
        <button className="close-contact-btn" onClick={() => setShowVolunteerModal(false)}>&times;</button>
      </div>
      
      <div className="contact-modal-body">
        <div className="contact-info">
          <div className="contact-avatar">
            <i className="fas fa-user-circle"></i>
          </div>
          <h4>{selectedVolunteer.name}</h4>
          <p><i className="fas fa-envelope"></i> {selectedVolunteer.email}</p>
          <p><i className="fas fa-phone"></i> {selectedVolunteer.phone || 'Not provided'}</p>
          <p><i className="fas fa-map-marker-alt"></i> {selectedVolunteer.city}</p>
          <p><i className="fas fa-tools"></i> <strong>Skills:</strong> {selectedVolunteer.skills?.join(', ') || 'General'}</p>
          <p><i className="fas fa-clock"></i> <strong>Availability:</strong> {selectedVolunteer.availability}</p>
          <p><i className="fas fa-heart"></i> <strong>Interests:</strong> {selectedVolunteer.interests?.join(', ') || 'Not specified'}</p>
          {selectedVolunteer.motivation && (
            <p><i className="fas fa-quote-left"></i> <strong>Motivation:</strong> {selectedVolunteer.motivation}</p>
          )}
          
          {/* Email Form */}
          <div className="contact-message">
            <label>Your Name *</label>
            <input 
              type="text" 
              id="senderName" 
              placeholder="Enter your name" 
              className="message-input" 
              defaultValue={localStorage.getItem('userName') || ''}
            />
            
            <label>Your Email *</label>
            <input 
              type="email" 
              id="senderEmail" 
              placeholder="Enter your email" 
              className="message-input" 
              defaultValue={localStorage.getItem('userEmail') || ''}
            />
            
            <label>Subject</label>
            <input 
              type="text" 
              id="emailSubject" 
              placeholder="Subject" 
              className="message-input" 
              defaultValue={`Volunteer Opportunity for ${selectedVolunteer.name}`} 
            />
            
            <label>Message *</label>
            <textarea 
              id="messageContent" 
              rows="4" 
              placeholder="Write your message to this volunteer..." 
              className="message-textarea"
            ></textarea>
          </div>
        </div>
      </div>
      
      <div className="contact-modal-footer">
        <button className="send-message-btn" onClick={sendEmailToVolunteer}>
          <i className="fas fa-paper-plane"></i> Send Email
        </button>
        <button className="call-btn" onClick={() => window.location.href = `tel:${selectedVolunteer.phone}`}>
          <i className="fas fa-phone-alt"></i> Call
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default OrphanageDashboard;
