import React, { useState, useEffect } from "react";
import "./Donation.css";
import { useNavigate } from 'react-router-dom';
import PayPalButton from '../components/PayPalButton';
const API_URL = 'https://nurture-orphan-api.onrender.com/api';
const Donation = () => {
    const navigate = useNavigate();
    const [donations, setDonations] = useState([]);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [donationAmount, setDonationAmount] = useState("");
  const [donationType, setDonationType] = useState("one-time");
  const [donationPurpose, setDonationPurpose] = useState("general");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("history");

  // Load donations from localStorage
  useEffect(() => {
    const storedDonations = JSON.parse(localStorage.getItem('userDonations') || '[]');
    setDonations(storedDonations);
  }, []);

  const handleDonate = () => {
    if (!donationAmount || donationAmount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const newDonation = {
        id: Date.now(),
        amount: `₹${donationAmount}`,
        amountValue: parseInt(donationAmount),
        type: donationType,
        purpose: donationPurpose,
        donorName: localStorage.getItem("userName") || "Anonymous Supporter",
        donorEmail: localStorage.getItem("userEmail") || "anonymous@example.com",
        status: "completed",
        date: new Date().toISOString(),
        transactionId: `TXN${Date.now().toString().slice(-8)}`
      };

      const updatedDonations = [newDonation, ...donations];
      setDonations(updatedDonations);
      localStorage.setItem('userDonations', JSON.stringify(updatedDonations));

      alert(`Thank you for your donation of ₹${donationAmount}!`);
      setShowDonateModal(false);
      setDonationAmount("");
      setLoading(false);
    }, 1500);
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

  const totalDonated = donations.reduce((sum, d) => sum + (d.amountValue || 0), 0);
  const monthlyDonations = donations.filter(d => d.type === "monthly").length;

  return (
    <div className="donation-module">
      <div className="donation-header">
        
        <h1><i className="fas fa-hand-holding-heart"></i>      Donation Center</h1>
        <button className="donate-now-btn" onClick={() => setShowDonateModal(true)}>
          <i className="fas fa-heart"></i> Donate Now
        </button>
      </div>
  <button className="back-btn" onClick={() => navigate(-1)}>
        <i className="fas fa-arrow-left"></i> Back to Dashboard
      </button>
      <div className="donation-stats">
        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-rupee-sign"></i></div>
          <div className="stat-info"><h3>₹{totalDonated.toLocaleString()}</h3><p>Total Donated</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-calendar-week"></i></div>
          <div className="stat-info"><h3>{donations.length}</h3><p>Total Donations</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-sync-alt"></i></div>
          <div className="stat-info"><h3>{monthlyDonations}</h3><p>Monthly Donors</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-child"></i></div>
          <div className="stat-info"><h3>{Math.floor(totalDonated / 500)}</h3><p>Children Helped</p></div>
        </div>
      </div>

      <div className="donation-tabs">
        <button className={`tab ${activeTab === "history" ? "active" : ""}`} onClick={() => setActiveTab("history")}>
          <i className="fas fa-history"></i> Donation History
        </button>
        <button className={`tab ${activeTab === "impact" ? "active" : ""}`} onClick={() => setActiveTab("impact")}>
          <i className="fas fa-chart-line"></i> Your Impact
        </button>
      </div>

      {/* Donation History Tab */}
      {activeTab === "history" && (
        <div className="donation-history">
          {donations.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-gift"></i>
              <h3>No Donations Yet</h3>
              <p>Your first donation can change a child's life</p>
              <button className="start-donating-btn" onClick={() => setShowDonateModal(true)}>Start Donating</button>
            </div>
          ) : (
            <div className="donations-list">
              {donations.map((donation) => (
                <div className="donation-card" key={donation.id}>
                  <div className="donation-left">
                    <div className="donation-amount">₹{donation.amountValue}</div>
                    <div className="donation-purpose">{getPurposeLabel(donation.purpose)}</div>
                    <div className="donation-type">
                      <span className={`type-badge ${donation.type}`}>
                        {donation.type === "one-time" ? "One Time" : "Monthly"}
                      </span>
                    </div>
                  </div>
                  <div className="donation-right">
                    <div className="donation-date">
                      <i className="fas fa-calendar"></i> {new Date(donation.date).toLocaleDateString()}
                    </div>
                    <div className="donation-id">ID: {donation.transactionId}</div>
                    <div className="donation-status completed"><i className="fas fa-check-circle"></i> Completed</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Impact Tab */}
      {activeTab === "impact" && (
        <div className="impact-tab">
          <div className="impact-grid">
            <div className="impact-card"><i className="fas fa-apple-alt"></i><h3>{(totalDonated / 100).toFixed(0)}</h3><p>Meals Provided</p></div>
            <div className="impact-card"><i className="fas fa-book"></i><h3>{Math.floor(totalDonated / 2000)}</h3><p>Books Purchased</p></div>
            <div className="impact-card"><i className="fas fa-tshirt"></i><h3>{Math.floor(totalDonated / 800)}</h3><p>Clothing Sets</p></div>
            <div className="impact-card"><i className="fas fa-hospital-user"></i><h3>{Math.floor(totalDonated / 1500)}</h3><p>Medical Checkups</p></div>
          </div>
          <div className="impact-message">
            <i className="fas fa-quote-left"></i>
            <p>Your generosity has helped transform lives. Every rupee makes a difference!</p>
          </div>
        </div>
      )}

      {/* Donation Modal */}
      {showDonateModal && (
        <div className="modal-overlay" onClick={() => setShowDonateModal(false)}>
          <div className="donation-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2><i className="fas fa-hand-holding-heart"></i> Make a Donation</h2>
              <button className="close-modal" onClick={() => setShowDonateModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="amount-options">
                <button className={`amount-btn ${donationAmount === "500" ? "selected" : ""}`} onClick={() => setDonationAmount("500")}>₹500</button>
                <button className={`amount-btn ${donationAmount === "1000" ? "selected" : ""}`} onClick={() => setDonationAmount("1000")}>₹1,000</button>
                <button className={`amount-btn ${donationAmount === "2500" ? "selected" : ""}`} onClick={() => setDonationAmount("2500")}>₹2,500</button>
                <button className={`amount-btn ${donationAmount === "5000" ? "selected" : ""}`} onClick={() => setDonationAmount("5000")}>₹5,000</button>
                <input type="number" placeholder="Custom Amount" className="custom-amount" value={donationAmount} onChange={(e) => setDonationAmount(e.target.value)} />
              </div>

              <div className="donation-type-select">
                <label><input type="radio" value="one-time" checked={donationType === "one-time"} onChange={(e) => setDonationType(e.target.value)} /><span>One Time Donation</span></label>
                <label><input type="radio" value="monthly" checked={donationType === "monthly"} onChange={(e) => setDonationType(e.target.value)} /><span>Monthly Donation</span></label>
              </div>

              <div className="purpose-select">
                <label>Select Purpose</label>
                <select value={donationPurpose} onChange={(e) => setDonationPurpose(e.target.value)}>
                  <option value="general">General Support</option>
                  <option value="education">Education Fund</option>
                  <option value="medical">Medical Aid</option>
                  <option value="food">Food & Nutrition</option>
                  <option value="shelter">Shelter Program</option>
                </select>
              </div>

              <button className="payment-btn" onClick={handleDonate} disabled={loading}>
                {loading ? <><i className="fas fa-spinner fa-spin"></i> Processing...</> : <><i className="fas fa-credit-card"></i> Donate ₹{donationAmount || "0"}</>}
              </button>
              <div className="paypal-section" style={{ marginTop: '15px', borderTop: '1px solid #ddd', paddingTop: '15px' }}>
  <h4 style={{ marginBottom: '10px' }}>Or Pay with PayPal</h4>
  <PayPalButton 
    amount={donationAmount}
    onSuccess={(result) => {
      alert(`✅ Donation of $${donationAmount} completed! Transaction ID: ${result.transactionId}`);
      setShowDonateModal(false);
      setDonationAmount("");
      // Refresh donations list
      window.location.reload();
    }}
    onError={(error) => {
      alert('Payment failed. Please try again.');
    }}
  />
</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Donation;
