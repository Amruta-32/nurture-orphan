import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MyReports from "./MyReports";
import Donation from "./Donation";
import "./UserDashboard.css";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [myReports, setMyReports] = useState([]);
const [myVolunteerRequests, setMyVolunteerRequests] = useState([]); 
const [mySponsorships, setMySponsorships] = useState([]);
  const [user, setUser] = useState({
    name: localStorage.getItem("userName") || "Supporter",
    email: localStorage.getItem("userEmail") || "supporter@example.com",
    city: localStorage.getItem("userCity") || "Not specified",
    joinDate: localStorage.getItem("userJoinDate") || new Date().toLocaleDateString()
  });

  useEffect(() => {
    const userName = localStorage.getItem("userName");
    const userEmail = localStorage.getItem("userEmail");
    const userCity = localStorage.getItem("userCity");
    const userJoinDate = localStorage.getItem("userJoinDate");
    
    setUser({
      name: userName || "Supporter",
      email: userEmail || "supporter@example.com",
      city: userCity || "Not specified",
      joinDate: userJoinDate || new Date().toLocaleDateString()
    });
  }, []);

  useEffect(() => {
    loadReports();
    loadMyVolunteerRequests();
     loadMySponsorships(); 
  }, []);

  const loadReports = () => {
    const reports = JSON.parse(localStorage.getItem('orphanReports') || '[]');
    console.log("Loaded reports:", reports);
    setMyReports(reports);
  };
const loadMySponsorships = async () => {
  try {
    // Fetch ALL sponsorships from your backend
    const response = await fetch('http://localhost:5000/api/sponsorships/all');
    
    if (response.ok) {
      const data = await response.json();
      console.log("✅ All sponsorships from DB:", data);
      
      // If data is { sponsorships: [...] }
      const allSponsorships = data.sponsorships || data;
      setMySponsorships(allSponsorships);
    } else {
      console.error("Failed to fetch:", response.status);
      setMySponsorships([]);
    }
  } catch (error) {
    console.error("❌ Error loading sponsorships:", error);
    setMySponsorships([]);
  }
};
  const stats = [
    { icon: "fas fa-hand-holding-heart", value: myReports.filter(r => r.rescueStatus === "resolved").length, label: "Children Rescued", color: "#2c7a4d" },
    { icon: "fas fa-rupee-sign", value: "₹8,116", label: "Total Donations", color: "#4facfe" },
    { icon: "fas fa-ambulance", value: myReports.length, label: "Reports Submitted", color: "#e25c2c" },
    { icon: "fas fa-smile", value: "4", label: "Stories Received", color: "#8fc9a5" }
  ];

  const recentDonations = [
    { id: 1, amount: "₹5,000", date: "2025-03-25", purpose: "Education Fund", status: "completed" },
    { id: 2, amount: "₹3,500", date: "2025-03-20", purpose: "Monthly Support", status: "completed" },
    { id: 3, amount: "₹2,000", date: "2025-03-15", purpose: "Medical Aid", status: "pending" }
  ];

  const sponsoredChildren = [
    { id: 1, name: "Aarav Sharma", age: 8, city: "Delhi", startDate: "2024-10-01", status: "active" },
    { id: 2, name: "Priya Patel", age: 10, city: "Mumbai", startDate: "2024-08-15", status: "active" }
  ];
const loadMyVolunteerRequests = async () => {
  const userName = localStorage.getItem('userName');
  if (!userName) return;
  
  try {
    const response = await fetch(`http://localhost:5000/api/volunteer/my-applications?name=${userName}`);
    const data = await response.json();
    if (data.success) {
      setMyVolunteerRequests(data.applications);
    } else {
      setMyVolunteerRequests([]);
    }
  } catch (error) {
    console.error("Error:", error);
    setMyVolunteerRequests([]);
  }
};
  const getStatusClass = (status) => {
    switch(status) {
      case "completed": return "status-completed";
      case "pending": return "status-pending";
      case "in-progress": return "status-in-progress";
      case "resolved": return "status-resolved";
      default: return "status-pending";
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case "completed": return "Completed";
      case "pending": return "Pending";
      case "in-progress": return "In Progress";
      case "resolved": return "Rescued ✓";
      default: return "Pending Review";
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userCity");
    localStorage.removeItem("userJoinDate");
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleReportOrphan = () => {
    navigate("/report-orphan");
  };

  const handleDonate = () => {
    navigate("/donation");
  };
const handleSponsor = () => {
  navigate("/sponsorship");
};

const handleImpactReport = () => {
  navigate("/user-reports");
};
  const handleViewReport = (reportId) => {
    alert(`Viewing full report details for ID: ${reportId}`);
  };

  return (
    <div className="user-dashboard">
      {/* Sidebar */}
      <div className="dashboard-sidebar">
        <div className="sidebar-logo">
          <i className="fas fa-hand-holding-heart"></i>
          <h2>NurtureOrphan</h2>
        </div>
        
        <div className="user-profile">
          <div className="avatar">
            <i className="fas fa-user-circle"></i>
          </div>
          <div className="user-info">
            <h4>{user.name}</h4>
            <p>{user.email}</p>
            <p className="user-location">
              <i className="fas fa-map-marker-alt"></i> {user.city}
            </p>
            <p className="user-join-date">
              <i className="fas fa-calendar-alt"></i> Joined: {user.joinDate}
            </p>
          </div>
        </div>
        
        <div className="sidebar-menu">
          <div className={`menu-item ${activeMenu === "dashboard" ? "active" : ""}`} onClick={() => setActiveMenu("dashboard")}>
            <i className="fas fa-tachometer-alt"></i>
            <span>Dashboard</span>
          </div>
          <div className="menu-item" onClick={() => navigate('/sponsorship')}>
  <i className="fas fa-hand-holding-heart"></i>
  <span>Sponsorship</span>
</div>
          <div className={`menu-item ${activeMenu === "donations" ? "active" : ""}`} onClick={() => setActiveMenu("donations")}>
            <i className="fas fa-hand-holding-usd"></i>
            <span>Donations</span>
          </div>
          <div className={`menu-item ${activeMenu === "rescue" ? "active" : ""}`} onClick={() => setActiveMenu("rescue")}>
            <i className="fas fa-ambulance"></i>
            <span>My Reports</span>
            {myReports && myReports.length > 0 && <span className="badge">{myReports.length}</span>}
          </div>
          <div className={`menu-item ${activeMenu === "volunteer" ? "active" : ""}`} onClick={() => navigate('/volunteer-status')}>
  <i className="fas fa-hands-helping"></i>
  <span>Volunteer</span>
</div>
          
<div className="menu-item" onClick={() => navigate('/adoption')}>
  <i className="fas fa-heart"></i>
  <span>Adoption</span>
</div>
          <div className={`menu-item ${activeMenu === "stories" ? "active" : ""}`} onClick={() => navigate('/stories')}>
  <i className="fas fa-book-open"></i>
  <span>Stories</span>
</div>
<div className={`menu-item ${activeMenu === "reports" ? "active" : ""}`} onClick={() => navigate('/user-reports')}>
  <i className="fas fa-chart-line"></i>
  <span>My Reports</span>
</div>
          <div className={`menu-item ${activeMenu === "settings" ? "active" : ""}`} onClick={() => navigate('/settings')}>
  <i className="fas fa-cog"></i>
  <span>Settings</span>
</div>
        </div>
        
        <button className="logout-btn" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i>
          <span>Logout</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Dashboard Home */}
        {activeMenu === "dashboard" && (
          <>
            <div className="content-header">
              <div>
                <h1>Welcome back, {user.name.split(" ")[0]}! 👋</h1>
                <p className="welcome-text">Here's what's happening with your contributions</p>
              </div>
              <div className="header-actions">
                <button className="report-btn" onClick={handleReportOrphan}>
                  <i className="fas fa-ambulance"></i> Report Orphan
                </button>
                <button className="donate-btn" onClick={handleDonate}>
                  <i className="fas fa-hand-holding-heart"></i> Donate Now
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-cards">
              {stats.map((stat, index) => (
                <div className="stat-card" key={index}>
                  <div className="card-icon" style={{ background: `linear-gradient(135deg, ${stat.color}20, ${stat.color}40)` }}>
                    <i className={stat.icon} style={{ color: stat.color }}></i>
                  </div>
                  <h3>{stat.value}</h3>
                  <p>{stat.label}</p>
                </div>
              ))}
            </div>
{/* Quick Actions */}
            <div className="section-title" style={{ marginTop: "30px" }}>
              <h2>
                <i className="fas fa-bolt"></i> Quick Actions
              </h2>
            </div>
            
            <div className="quick-actions">
              <button className="action-btn action-btn-primary" onClick={handleDonate}>
                <i className="fas fa-hand-holding-heart"></i> Make a Donation
              </button>
              <button className="action-btn action-btn-secondary" onClick={handleReportOrphan}>
                <i className="fas fa-ambulance"></i> Report Orphan in Need
              </button>
                      <button 
  className="action-btn action-btn-warning"
  onClick={handleSponsor}
>
  <i className="fas fa-child"></i>Sponsor Orphanage
</button>
              <button 
           className="action-btn action-btn-success"
            onClick={handleImpactReport}>
  <i className="fas fa-file-alt"></i>Download Impact Report
</button>
     


            </div>
            {/* Sponsored Children Section */}
           
 

            {/* Recent Donations & My Reports Row */}
            <div className="dashboard-row">
              

              {/* My Reports Section - Preview */}
              <div className="dashboard-col">
                <div className="section-title">
                  <h2>
                    <i className="fas fa-ambulance"></i> My Rescue Reports
                  </h2>
                  <a href="#" onClick={() => setActiveMenu("rescue")}>View All →</a>
                </div>
                <div className="rescue-list">
                  {myReports.length === 0 ? (
                    <div className="empty-reports">
                      <i className="fas fa-file-alt"></i>
                      <p>No reports submitted yet</p>
                      <button className="report-now-btn" onClick={handleReportOrphan}>
                        <i className="fas fa-plus"></i> Report an Orphan
                      </button>
                    </div>
                  ) : (
                    myReports.slice(0, 3).map((report) => (
                      <div className={`rescue-item ${report.urgent ? 'urgent' : ''}`} key={report.id}>
                        <div className="rescue-header">
                          <div className="rescue-title">
                            <i className="fas fa-child"></i>
                            <h4>{report.childName || 'Unknown Child'}</h4>
                          </div>
                          <span className="report-id">{report.reportId || `ORP-${report.id.toString().slice(-8)}`}</span>
                        </div>
                        
                        <div className="rescue-details">
                          <p className="location">
                            <i className="fas fa-map-marker-alt"></i> 
                            {report.location}, {report.city}
                            {report.landmark && <span className="landmark"> (Near: {report.landmark})</span>}
                          </p>
                          <p className="age-gender">
                            <i className="fas fa-calendar-alt"></i> Age: {report.childAge} years
                            {report.childGender && <span> • {report.childGender === 'male' ? 'Boy' : report.childGender === 'female' ? 'Girl' : report.childGender}</span>}
                          </p>
                          
                          {report.image && (
                            <div className="report-image-thumb">
                              <img src={report.image} alt={report.childName || "Child"} />
                            </div>
                          )}
                          
                          <p className="description">
                            <i className="fas fa-info-circle"></i> 
                            {report.description?.length > 80 ? `${report.description.substring(0, 80)}...` : report.description}
                          </p>
                          
                          <div className="report-footer">
                            <p className="report-date">
                              <i className="fas fa-calendar"></i> 
                              {new Date(report.reportedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                            <button className="view-report-btn" onClick={() => handleViewReport(report.id)}>
                              View Details <i className="fas fa-arrow-right"></i>
                            </button>
                          </div>
                        </div>
                        
                        <div className={`rescue-status-badge ${getStatusClass(report.rescueStatus)}`}>
                          {report.rescueStatus === 'pending' && <i className="fas fa-clock"></i>}
                          {report.rescueStatus === 'in-progress' && <i className="fas fa-spinner fa-spin"></i>}
                          {report.rescueStatus === 'resolved' && <i className="fas fa-check-circle"></i>}
                          {getStatusText(report.rescueStatus)}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            
          </>
        )}
        {/* My Reports Full Page */}
        {activeMenu === "rescue" && <MyReports />}

        {/* Donation Page */}
        {activeMenu === "donations" && <Donation />}
 

        {/* Coming Soon Pages for other menu items */}
       {/* Sponsorships Full Page */}
{activeMenu === "sponsorships" && (
  <div className="sponsorships-full-page">
    <div className="page-header">
      <h1><i className="fas fa-child"></i> My Sponsorships</h1>
      <div className="total-badge">Total: {mySponsorships.length}</div>
    </div>

    <div className="sponsorships-stats">
      <div className="stat-box">
        <h3>{mySponsorships.length}</h3>
        <p>Active Sponsorships</p>
      </div>
      <div className="stat-box">
        <h3>{mySponsorships.reduce((sum, s) => sum + (s.amount || 0), 0)}</h3>
        <p>Monthly Contribution</p>
      </div>
      <div className="stat-box">
        <h3>{mySponsorships.filter(s => s.duration === 'yearly').length}</h3>
        <p>Yearly Sponsors</p>
      </div>
    </div>

    {mySponsorships.length === 0 ? (
      <div className="empty-state-large">
        <i className="fas fa-hand-holding-heart"></i>
        <h3>No Active Sponsorships</h3>
        <p>Sponsor a child to make a difference in their life</p>
        <button className="sponsor-now-btn" onClick={() => navigate('/available-children')}>
          Browse Children
        </button>
      </div>
    ) : (
      <div className="sponsorships-table-container">
        <table className="sponsorships-table">
          <thead>
            <tr>
              <th>Child Name</th>
              <th>Age</th>
              <th>Location</th>
              <th>Start Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Next Payment</th>
            </tr>
          </thead>
          <tbody>
            {mySponsorships.map((sponsorship) => (
              <tr key={sponsorship.id}>
                <td><strong>{sponsorship.childName}</strong></td>
                <td>{sponsorship.childAge} years</td>
                <td>{sponsorship.childCity}</td>
                <td>{new Date(sponsorship.startDate).toLocaleDateString()}</td>
                <td>₹{sponsorship.amount}/month</td>
                <td><span className="status-active">Active</span></td>
                <td>{new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
)}
        
        
        
        {activeMenu === "settings" && (
          <div className="coming-soon">
            <i className="fas fa-cog"></i>
            <h2>Settings</h2>
            <p>This feature is coming soon!</p>
            <button className="report-now-btn" onClick={() => setActiveMenu("dashboard")}>Back to Dashboard</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;