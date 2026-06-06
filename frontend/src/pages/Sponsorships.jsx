import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "./Sponsorships.css";
import PayPalButton from '../components/PayPalButton';
const API_URL = 'https://nurture-orphan-api.onrender.com/api';
const Sponsorships = () => {
  const navigate = useNavigate();
  const [sponsorships, setSponsorships] = useState([]);
  const [orphanages, setOrphanages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSponsorModal, setShowSponsorModal] = useState(false);
  const [selectedOrphanage, setSelectedOrphanage] = useState(null);
  const [sponsorAmount, setSponsorAmount] = useState("");
  const [sponsorshipType, setSponsorshipType] = useState("monthly");
  const [sponsorshipPurpose, setSponsorshipPurpose] = useState("general");
  const [loadingSponsor, setLoadingSponsor] = useState(false);
  const [message, setMessage] = useState("");
  const [sponsorPhone, setSponsorPhone] = useState("");
  const [sponsorAddress, setSponsorAddress] = useState("");
  const [activeTab, setActiveTab] = useState("history");

  const userEmail = localStorage.getItem('userEmail');
  const userName = localStorage.getItem('userName');

  // Load sponsorships from API
  useEffect(() => {
    if (userEmail) {
      fetchMySponsorships();
    }
    fetchOrphanages();
  }, [userEmail]);

  const fetchMySponsorships = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/sponsorships/my-sponsorships?email=${userEmail}`);
      const data = await response.json();
      if (data.success) {
        setSponsorships(data.sponsorships || []);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchOrphanages = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/sponsorships/orphanages');
      const data = await response.json();
      if (data.success) {
        setOrphanages(data.orphanages || []);
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  // Handle Test Sponsorship (Manual)
  const handleSponsor = () => {
    if (!sponsorAmount || sponsorAmount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    if (!sponsorPhone) {
      alert("Please enter your phone number");
      return;
    }

    if (!sponsorAddress) {
      alert("Please enter your address");
      return;
    }

    setLoadingSponsor(true);

    setTimeout(async () => {
      try {
        const response = await fetch('http://localhost:5000/api/sponsorships/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orphanageId: selectedOrphanage._id,
            orphanageName: selectedOrphanage.name,
            orphanageCity: selectedOrphanage.city,
            sponsorName: userName,
            sponsorEmail: userEmail,
            sponsorPhone: sponsorPhone,
            sponsorAddress: sponsorAddress,
            amount: parseInt(sponsorAmount),
            sponsorshipType: sponsorshipType,
            purpose: sponsorshipPurpose,
            message: message,
            transactionId: `TXN${Date.now().toString().slice(-8)}`
          })
        });
        
        const data = await response.json();
        
        if (data.success) {
          alert(`✅ Sponsorship request sent to ${selectedOrphanage.name}! They will contact you soon.`);
          setShowSponsorModal(false);
          resetForm();
          fetchMySponsorships();
        } else {
          alert('Failed to submit sponsorship. Please try again.');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Network error. Please try again.');
      }
      setLoadingSponsor(false);
    }, 1500);
  };

  // Handle PayPal Sponsorship
  const handlePayPalSuccess = (result) => {
    alert(`✅ Sponsorship of $${sponsorAmount} completed! Transaction ID: ${result.transactionId}`);
    setShowSponsorModal(false);
    resetForm();
    fetchMySponsorships();
  };

  const handlePayPalError = (error) => {
    alert('Payment failed. Please try again.');
  };

  const resetForm = () => {
    setSponsorAmount("");
    setSponsorshipType("monthly");
    setSponsorshipPurpose("general");
    setMessage("");
    setSponsorPhone("");
    setSponsorAddress("");
    setLoadingSponsor(false);
  };

  const getPurposeLabel = (purpose) => {
    switch(purpose) {
      case "education": return "Education Fund";
      case "medical": return "Medical Aid";
      case "food": return "Food & Nutrition";
      case "shelter": return "Shelter Program";
      default: return "General Support";
    }
  };

  const totalSponsored = sponsorships.reduce((sum, s) => sum + (s.amount || 0), 0);
  const monthlySponsors = sponsorships.filter(s => s.sponsorshipType === "monthly" && s.status === "active").length;

  if (loading) {
    return <div className="sponsorship-loading">Loading orphanages...</div>;
  }

  return (
    <div className="sponsorship-module">
      <div className="sponsorship-header">
        <h1><i className="fas fa-hand-holding-heart"></i> Sponsor an Orphanage</h1>
        <p>Support an orphanage with monthly or yearly sponsorship</p>
      </div>
      
      <button className="back-btn" onClick={() => navigate(-1)}>
        <i className="fas fa-arrow-left"></i> Back to Dashboard
      </button>

      {/* Stats Cards */}
      <div className="sponsorship-stats">
        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-dollar-sign"></i></div>
          <div className="stat-info"><h3>${totalSponsored.toLocaleString()}</h3><p>Total Sponsored</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-calendar-week"></i></div>
          <div className="stat-info"><h3>{sponsorships.length}</h3><p>Total Sponsorships</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-sync-alt"></i></div>
          <div className="stat-info"><h3>{monthlySponsors}</h3><p>Monthly Sponsors</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-home"></i></div>
          <div className="stat-info"><h3>{orphanages.length}</h3><p>Orphanages</p></div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sponsorship-tabs">
        <button className={`tab ${activeTab === "history" ? "active" : ""}`} onClick={() => setActiveTab("history")}>
          <i className="fas fa-history"></i> My Sponsorships
        </button>
        <button className={`tab ${activeTab === "orphanages" ? "active" : ""}`} onClick={() => setActiveTab("orphanages")}>
          <i className="fas fa-home"></i> Available Orphanages
        </button>
      </div>

      {/* My Sponsorships Tab */}
      {activeTab === "history" && (
        <div className="sponsorship-history">
          {sponsorships.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-hand-holding-heart"></i>
              <h3>No Sponsorships Yet</h3>
              <p>Your first sponsorship can change lives</p>
              <button className="start-sponsoring-btn" onClick={() => setActiveTab("orphanages")}>Start Sponsoring</button>
            </div>
          ) : (
            <div className="sponsorships-list">
              {sponsorships.map((sponsorship) => (
                <div className="sponsorship-card" key={sponsorship._id}>
                  <div className="sponsorship-left">
                    <div className="sponsorship-amount">${sponsorship.amount}</div>
                    <div className="sponsorship-purpose">{getPurposeLabel(sponsorship.purpose)}</div>
                    <div className="sponsorship-type">
                      <span className={`type-badge ${sponsorship.sponsorshipType}`}>
                        {sponsorship.sponsorshipType === "monthly" ? "Monthly" : 
                         sponsorship.sponsorshipType === "yearly" ? "Yearly" : "One Time"}
                      </span>
                    </div>
                  </div>
                  <div className="sponsorship-right">
                    <div className="sponsorship-orphanage">
                      <i className="fas fa-home"></i> {sponsorship.orphanageName}
                    </div>
                    <div className="sponsorship-date">
                      <i className="fas fa-calendar"></i> {new Date(sponsorship.createdAt).toLocaleDateString()}
                    </div>
                    <div className="sponsorship-status completed">
                      <i className="fas fa-check-circle"></i> {sponsorship.status === 'pending' ? 'Pending' : 'Active'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Available Orphanages Tab */}
      {activeTab === "orphanages" && (
        <div className="orphanages-list">
          {orphanages.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-home"></i>
              <h3>No Orphanages Available</h3>
              <p>Check back later for orphanages to sponsor</p>
            </div>
          ) : (
            <div className="orphanages-grid">
              {orphanages.map((orphanage) => (
                <div className="orphanage-card" key={orphanage._id}>
                  <div className="orphanage-icon">
                    <i className="fas fa-home"></i>
                  </div>
                  <div className="orphanage-info">
                    <h3>{orphanage.name}</h3>
                    <p><i className="fas fa-map-marker-alt"></i> {orphanage.city}</p>
                    <p><i className="fas fa-phone"></i> {orphanage.contact}</p>
                    <p><i className="fas fa-envelope"></i> {orphanage.email}</p>
                  </div>
                  <button 
                    className="sponsor-now-btn"
                    onClick={() => {
                      setSelectedOrphanage(orphanage);
                      setShowSponsorModal(true);
                    }}
                  >
                    <i className="fas fa-heart"></i> Sponsor Now
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Sponsor Modal */}
      {showSponsorModal && selectedOrphanage && (
        <div className="modal-overlay" onClick={() => setShowSponsorModal(false)}>
          <div className="sponsor-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2><i className="fas fa-hand-holding-heart"></i> Sponsor {selectedOrphanage.name}</h2>
              <button className="close-modal" onClick={() => setShowSponsorModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="orphanage-info">
                <p><strong>📍 City:</strong> {selectedOrphanage.city}</p>
                <p><strong>📞 Contact:</strong> {selectedOrphanage.contact}</p>
              </div>

              <div className="amount-options">
                <button className={`amount-btn ${sponsorAmount === "10" ? "selected" : ""}`} onClick={() => setSponsorAmount("10")}>$10</button>
                <button className={`amount-btn ${sponsorAmount === "25" ? "selected" : ""}`} onClick={() => setSponsorAmount("25")}>$25</button>
                <button className={`amount-btn ${sponsorAmount === "50" ? "selected" : ""}`} onClick={() => setSponsorAmount("50")}>$50</button>
                <button className={`amount-btn ${sponsorAmount === "100" ? "selected" : ""}`} onClick={() => setSponsorAmount("100")}>$100</button>
                <input type="number" placeholder="Custom Amount" className="custom-amount" value={sponsorAmount} onChange={(e) => setSponsorAmount(e.target.value)} />
              </div>

              <div className="sponsorship-type-select">
                <label><input type="radio" value="monthly" checked={sponsorshipType === "monthly"} onChange={(e) => setSponsorshipType(e.target.value)} /><span>Monthly Sponsorship</span></label>
                <label><input type="radio" value="yearly" checked={sponsorshipType === "yearly"} onChange={(e) => setSponsorshipType(e.target.value)} /><span>Yearly Sponsorship</span></label>
                <label><input type="radio" value="one-time" checked={sponsorshipType === "one-time"} onChange={(e) => setSponsorshipType(e.target.value)} /><span>One Time Donation</span></label>
              </div>

              <div className="purpose-select">
                <label>Select Purpose</label>
                <select value={sponsorshipPurpose} onChange={(e) => setSponsorshipPurpose(e.target.value)}>
                  <option value="general">General Support</option>
                  <option value="education">Education Program</option>
                  <option value="medical">Medical Care</option>
                  <option value="food">Food & Nutrition</option>
                  <option value="shelter">Shelter Improvement</option>
                </select>
              </div>

              <div className="form-group">
                <label>Your Phone Number *</label>
                <input type="tel" value={sponsorPhone} onChange={(e) => setSponsorPhone(e.target.value)} placeholder="For orphanage to contact you" required />
              </div>

              <div className="form-group">
                <label>Your Address *</label>
                <textarea rows="2" value={sponsorAddress} onChange={(e) => setSponsorAddress(e.target.value)} placeholder="Complete address for communication" required></textarea>
              </div>

              <div className="form-group">
                <label>Message (Optional)</label>
                <textarea rows="2" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Any special message for the orphanage..."></textarea>
              </div>

              {/* Test Payment Button */}
              <button className="payment-btn" onClick={handleSponsor} disabled={loadingSponsor}>
                {loadingSponsor ? <><i className="fas fa-spinner fa-spin"></i> Processing...</> : <><i className="fas fa-credit-card"></i> Sponsor ${sponsorAmount || "0"}</>}
              </button>

              {/* PayPal Section */}
              <div className="paypal-section" style={{ marginTop: '15px', borderTop: '1px solid #ddd', paddingTop: '15px' }}>
                <h4 style={{ marginBottom: '10px' }}>Or Pay with PayPal</h4>
                <PayPalButton 
                  amount={sponsorAmount}
                  onSuccess={handlePayPalSuccess}
                  onError={handlePayPalError}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sponsorships;