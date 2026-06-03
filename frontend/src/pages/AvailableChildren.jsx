import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AvailableChildren.css';

const AvailableChildren = () => {
  const navigate = useNavigate();
  const [children, setChildren] = useState([]);
  const [filteredChildren, setFilteredChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChild, setSelectedChild] = useState(null);
  const [showAdoptionModal, setShowAdoptionModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [ageFilter, setAgeFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');

  // Load children from localStorage (combine added children and rescued children)
  useEffect(() => {
    loadChildren();
  }, []);

  useEffect(() => {
    filterChildren();
  }, [children, searchTerm, ageFilter, genderFilter]);

  const loadChildren = () => {
    setLoading(true);
    
    // Get added children from backend
    const orphanageId = localStorage.getItem('orphanageId') || '1';
    
    // For demo, using localStorage
    const addedChildren = JSON.parse(localStorage.getItem('orphanageChildren') || '[]');
    
    // Get rescued children from reports
    const reports = JSON.parse(localStorage.getItem('orphanReports') || '[]');
    const rescuedChildren = reports
      .filter(r => r.rescueStatus === 'resolved')
      .map((rescue, index) => ({
        id: `rescued_${rescue.id}`,
        name: rescue.childName || 'Unknown Child',
        age: parseInt(rescue.childAge) || 0,
        gender: rescue.childGender || 'other',
        location: rescue.location,
        city: rescue.city,
        healthStatus: 'good',
        educationLevel: 'Not specified',
        hobbies: 'None',
        status: 'available',
        isRescued: true,
        description: rescue.description,
        availableForAdoption: true
      }));
    
    // Combine all children available for adoption
    const allChildren = [...addedChildren, ...rescuedChildren].filter(c => c.status !== 'adopted');
    setChildren(allChildren);
    setFilteredChildren(allChildren);
    setLoading(false);
  };

  const filterChildren = () => {
    let filtered = [...children];
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(child => 
        child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (child.location && child.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (child.city && child.city.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Age filter
    if (ageFilter !== 'all') {
      if (ageFilter === '0-5') {
        filtered = filtered.filter(child => child.age >= 0 && child.age <= 5);
      } else if (ageFilter === '6-12') {
        filtered = filtered.filter(child => child.age >= 6 && child.age <= 12);
      } else if (ageFilter === '13-18') {
        filtered = filtered.filter(child => child.age >= 13 && child.age <= 18);
      }
    }
    
    // Gender filter
    if (genderFilter !== 'all') {
      filtered = filtered.filter(child => child.gender === genderFilter);
    }
    
    setFilteredChildren(filtered);
  };

  const handleAdoptionRequest = (child) => {
    setSelectedChild(child);
    setShowAdoptionModal(true);
  };

  const submitAdoptionRequest = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const newRequest = {
      id: Date.now(),
      childId: selectedChild.id,
      childName: selectedChild.name,
      childAge: selectedChild.age,
      childGender: selectedChild.gender,
      childLocation: `${selectedChild.location || ''}, ${selectedChild.city || ''}`,
      adopterName: formData.get('adopterName'),
      adopterEmail: formData.get('adopterEmail'),
      adopterPhone: formData.get('adopterPhone'),
      adopterAddress: formData.get('adopterAddress'),
      adopterOccupation: formData.get('adopterOccupation'),
      adopterIncome: formData.get('adopterIncome'),
      reason: formData.get('reason'),
      status: 'pending',
      requestedAt: new Date().toISOString()
    };
    
    const existingRequests = JSON.parse(localStorage.getItem('adoptionRequests') || '[]');
    existingRequests.push(newRequest);
    localStorage.setItem('adoptionRequests', JSON.stringify(existingRequests));
    
    alert('Adoption request submitted successfully! You will be contacted soon.');
    setShowAdoptionModal(false);
  };

  const totalChildren = filteredChildren.length;
  const boysCount = filteredChildren.filter(c => c.gender === 'male').length;
  const girlsCount = filteredChildren.filter(c => c.gender === 'female').length;

  return (
    <div className="available-children-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <i className="fas fa-arrow-left"></i> Back
      </button>

      <div className="available-children-header">
        <h1><i className="fas fa-heart"></i> Children Available for Adoption</h1>
        <p>Give a loving home to a child in need</p>
      </div>

      {/* Statistics Cards */}
      <div className="adoption-stats-cards">
        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-child"></i></div>
          <div className="stat-info">
            <h3>{totalChildren}</h3>
            <p>Total Children</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-mars"></i></div>
          <div className="stat-info">
            <h3>{boysCount}</h3>
            <p>Boys</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-venus"></i></div>
          <div className="stat-info">
            <h3>{girlsCount}</h3>
            <p>Girls</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-check-circle"></i></div>
          <div className="stat-info">
            <h3>100+</h3>
            <p>Successful Adoptions</p>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="filter-section">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input 
            type="text" 
            placeholder="Search by name or location..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filters">
          <select value={ageFilter} onChange={(e) => setAgeFilter(e.target.value)}>
            <option value="all">All Ages</option>
            <option value="0-5">0-5 years</option>
            <option value="6-12">6-12 years</option>
            <option value="13-18">13-18 years</option>
          </select>
          <select value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)}>
            <option value="all">All Genders</option>
            <option value="male">Boys</option>
            <option value="female">Girls</option>
          </select>
        </div>
      </div>

      {/* Children Grid */}
      {loading ? (
        <div className="loading-state">Loading children...</div>
      ) : filteredChildren.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-child"></i>
          <h3>No children available for adoption</h3>
          <p>Check back later for more children</p>
        </div>
      ) : (
        <div className="children-grid">
          {filteredChildren.map((child) => (
            <div className="child-adoption-card" key={child.id}>
              <div className="child-photo">
                {child.photo ? <img src={child.photo} alt={child.name} /> : <i className="fas fa-child"></i>}
              </div>
              <div className="child-info">
                <h3>{child.name}</h3>
                <p><i className="fas fa-calendar-alt"></i> Age: {child.age} years</p>
                <p><i className="fas fa-venus-mars"></i> {child.gender === 'male' ? 'Boy' : child.gender === 'female' ? 'Girl' : 'Other'}</p>
                <p><i className="fas fa-map-marker-alt"></i> {child.city || 'Not specified'}</p>
                <p><i className="fas fa-heartbeat"></i> Health: <span className={`health-${child.healthStatus}`}>{child.healthStatus || 'Good'}</span></p>
                {child.isRescued && <p className="rescued-tag"><i className="fas fa-check-circle"></i> Rescued Child</p>}
                <button 
                  className="adopt-now-btn"
                  onClick={() => handleAdoptionRequest(child)}
                >
                  <i className="fas fa-heart"></i> Request Adoption
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Adoption Request Modal */}
      {showAdoptionModal && selectedChild && (
        <div className="adoption-request-modal" onClick={() => setShowAdoptionModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2><i className="fas fa-heart"></i> Adoption Request</h2>
              <button className="close-modal" onClick={() => setShowAdoptionModal(false)}>&times;</button>
            </div>
            <form onSubmit={submitAdoptionRequest}>
              <div className="modal-body">
                <div className="child-summary">
                  <h4>Child Details</h4>
                  <p><strong>Name:</strong> {selectedChild.name}</p>
                  <p><strong>Age:</strong> {selectedChild.age} years</p>
                  <p><strong>Gender:</strong> {selectedChild.gender === 'male' ? 'Boy' : 'Girl'}</p>
                  <p><strong>Location:</strong> {selectedChild.city || 'Orphanage'}</p>
                </div>

                <div className="form-section">
                  <h4><i className="fas fa-user"></i> Your Information</h4>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Full Name *</label>
                      <input type="text" name="adopterName" required placeholder="Enter your full name" />
                    </div>
                    <div className="form-group">
                      <label>Email *</label>
                      <input type="email" name="adopterEmail" required placeholder="your@email.com" />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Phone Number *</label>
                      <input type="tel" name="adopterPhone" required placeholder="Contact number" />
                    </div>
                    <div className="form-group">
                      <label>Occupation</label>
                      <input type="text" name="adopterOccupation" placeholder="Your occupation" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Annual Income (approx)</label>
                    <input type="text" name="adopterIncome" placeholder="e.g., ₹5,00,000" />
                  </div>
                  <div className="form-group">
                    <label>Full Address *</label>
                    <textarea name="adopterAddress" rows="2" required placeholder="Your complete address"></textarea>
                  </div>
                </div>

                <div className="form-section">
                  <h4><i className="fas fa-heart"></i> Adoption Reason</h4>
                  <div className="form-group">
                    <label>Why do you want to adopt this child? *</label>
                    <textarea name="reason" rows="3" required placeholder="Share your motivation for adoption..."></textarea>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="cancel-btn" onClick={() => setShowAdoptionModal(false)}>Cancel</button>
                <button type="submit" className="submit-btn">Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailableChildren;