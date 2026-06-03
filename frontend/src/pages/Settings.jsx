import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Settings.css';

const Settings = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('role') || 'user';
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Profile State
  const [profile, setProfile] = useState({
    name: localStorage.getItem('userName') || '',
    email: localStorage.getItem('userEmail') || '',
    phone: localStorage.getItem('userPhone') || '',
    city: localStorage.getItem('userCity') || '',
    address: localStorage.getItem('userAddress') || '',
    bio: localStorage.getItem('userBio') || ''
  });

  // Password State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Notification Preferences
  const [notifications, setNotifications] = useState({
    emailNotifications: localStorage.getItem('emailNotifications') === 'true',
    smsNotifications: localStorage.getItem('smsNotifications') === 'true',
    rescueAlerts: localStorage.getItem('rescueAlerts') === 'true',
    donationReceipts: localStorage.getItem('donationReceipts') === 'true',
    storyUpdates: localStorage.getItem('storyUpdates') === 'true'
  });

  // Privacy Settings
  const [privacy, setPrivacy] = useState({
    showEmail: localStorage.getItem('showEmail') === 'true',
    showPhone: localStorage.getItem('showPhone') === 'true',
    showLocation: localStorage.getItem('showLocation') === 'true'
  });

  // Orphanage specific state
  const [orphanageProfile, setOrphanageProfile] = useState({
    name: localStorage.getItem('orphanageName') || '',
    email: localStorage.getItem('orphanageEmail') || '',
    contact: localStorage.getItem('orphanageContact') || '',
    address: localStorage.getItem('orphanageAddress') || '',
    city: localStorage.getItem('orphanageCity') || '',
    registrationNumber: localStorage.getItem('orphanageRegNo') || '',
    establishedYear: localStorage.getItem('orphanageEstYear') || '',
    description: localStorage.getItem('orphanageDesc') || ''
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = () => {
    // Load user profile
    setProfile({
      name: localStorage.getItem('userName') || '',
      email: localStorage.getItem('userEmail') || '',
      phone: localStorage.getItem('userPhone') || '',
      city: localStorage.getItem('userCity') || '',
      address: localStorage.getItem('userAddress') || '',
      bio: localStorage.getItem('userBio') || ''
    });

    // Load orphanage profile if role is orphanage
    if (userRole === 'orphanage') {
      setOrphanageProfile({
        name: localStorage.getItem('orphanageName') || '',
        email: localStorage.getItem('orphanageEmail') || '',
        contact: localStorage.getItem('orphanageContact') || '',
        address: localStorage.getItem('orphanageAddress') || '',
        city: localStorage.getItem('orphanageCity') || '',
        registrationNumber: localStorage.getItem('orphanageRegNo') || '',
        establishedYear: localStorage.getItem('orphanageEstYear') || '',
        description: localStorage.getItem('orphanageDesc') || ''
      });
    }
  };

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleOrphanageChange = (e) => {
    setOrphanageProfile({ ...orphanageProfile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotifications({ ...notifications, [name]: checked });
    localStorage.setItem(name, checked);
  };

  const handlePrivacyChange = (e) => {
    const { name, checked } = e.target;
    setPrivacy({ ...privacy, [name]: checked });
    localStorage.setItem(name, checked);
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Save to localStorage
      localStorage.setItem('userName', profile.name);
      localStorage.setItem('userEmail', profile.email);
      localStorage.setItem('userPhone', profile.phone);
      localStorage.setItem('userCity', profile.city);
      localStorage.setItem('userAddress', profile.address);
      localStorage.setItem('userBio', profile.bio);
      
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      setMessage({ text: 'Failed to update profile', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const updateOrphanageProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      localStorage.setItem('orphanageName', orphanageProfile.name);
      localStorage.setItem('orphanageEmail', orphanageProfile.email);
      localStorage.setItem('orphanageContact', orphanageProfile.contact);
      localStorage.setItem('orphanageAddress', orphanageProfile.address);
      localStorage.setItem('orphanageCity', orphanageProfile.city);
      localStorage.setItem('orphanageRegNo', orphanageProfile.registrationNumber);
      localStorage.setItem('orphanageEstYear', orphanageProfile.establishedYear);
      localStorage.setItem('orphanageDesc', orphanageProfile.description);
      
      setMessage({ text: 'Orphanage profile updated successfully!', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      setMessage({ text: 'Failed to update profile', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ text: 'New passwords do not match!', type: 'error' });
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setMessage({ text: 'Password must be at least 6 characters!', type: 'error' });
      return;
    }
    
    setLoading(true);
    
    try {
      // In real app, call API to update password
      setMessage({ text: 'Password updated successfully!', type: 'success' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      setMessage({ text: 'Failed to update password', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all your data? This action cannot be undone!')) {
      localStorage.clear();
      alert('All data cleared. You will be redirected to home page.');
      navigate('/');
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      navigate('/');
    }
  };

  return (
    <div className="settings-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <i className="fas fa-arrow-left"></i> Back to Dashboard
      </button>

      <div className="settings-wrapper">
        <h1><i className="fas fa-cog"></i> Settings</h1>

        {message.text && (
          <div className={`message ${message.type}`}>
            <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
            {message.text}
          </div>
        )}

        <div className="settings-content">
          {/* Sidebar */}
          <div className="settings-sidebar">
            <button className={`sidebar-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
              <i className="fas fa-user"></i> Profile
            </button>
            <button className={`sidebar-item ${activeTab === 'security' ? 'active' : ''}`} onClick={() => setActiveTab('security')}>
              <i className="fas fa-lock"></i> Security
            </button>
            <button className={`sidebar-item ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => setActiveTab('notifications')}>
              <i className="fas fa-bell"></i> Notifications
            </button>
            <button className={`sidebar-item ${activeTab === 'privacy' ? 'active' : ''}`} onClick={() => setActiveTab('privacy')}>
              <i className="fas fa-shield-alt"></i> Privacy
            </button>
            <button className={`sidebar-item ${activeTab === 'data' ? 'active' : ''}`} onClick={() => setActiveTab('data')}>
              <i className="fas fa-database"></i> Data Management
            </button>
            <button className={`sidebar-item logout-item`} onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>

          {/* Main Content */}
          <div className="settings-main">
            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <div className="settings-section">
                <h2><i className="fas fa-user-edit"></i> Profile Information</h2>
                
                {userRole === 'orphanage' ? (
                  <form onSubmit={updateOrphanageProfile}>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Orphanage Name *</label>
                        <input type="text" name="name" value={orphanageProfile.name} onChange={handleOrphanageChange} required />
                      </div>
                      <div className="form-group">
                        <label>Registration Number</label>
                        <input type="text" name="registrationNumber" value={orphanageProfile.registrationNumber} onChange={handleOrphanageChange} />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Email *</label>
                        <input type="email" name="email" value={orphanageProfile.email} onChange={handleOrphanageChange} required />
                      </div>
                      <div className="form-group">
                        <label>Contact Number *</label>
                        <input type="tel" name="contact" value={orphanageProfile.contact} onChange={handleOrphanageChange} required />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Established Year</label>
                        <input type="number" name="establishedYear" value={orphanageProfile.establishedYear} onChange={handleOrphanageChange} placeholder="e.g., 2010" />
                      </div>
                      <div className="form-group">
                        <label>City</label>
                        <input type="text" name="city" value={orphanageProfile.city} onChange={handleOrphanageChange} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Address</label>
                      <textarea name="address" value={orphanageProfile.address} onChange={handleOrphanageChange} rows="2" />
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <textarea name="description" value={orphanageProfile.description} onChange={handleOrphanageChange} rows="3" placeholder="About your orphanage..." />
                    </div>
                    <button type="submit" className="save-btn" disabled={loading}>
                      {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save"></i>} Save Changes
                    </button>
                  </form>
                ) : (
                  <form onSubmit={updateProfile}>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Full Name *</label>
                        <input type="text" name="name" value={profile.name} onChange={handleProfileChange} required />
                      </div>
                      <div className="form-group">
                        <label>Email *</label>
                        <input type="email" name="email" value={profile.email} onChange={handleProfileChange} required />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Phone Number</label>
                        <input type="tel" name="phone" value={profile.phone} onChange={handleProfileChange} />
                      </div>
                      <div className="form-group">
                        <label>City</label>
                        <input type="text" name="city" value={profile.city} onChange={handleProfileChange} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Address</label>
                      <textarea name="address" value={profile.address} onChange={handleProfileChange} rows="2" />
                    </div>
                    <div className="form-group">
                      <label>Bio / About Me</label>
                      <textarea name="bio" value={profile.bio} onChange={handleProfileChange} rows="3" placeholder="Tell us about yourself..." />
                    </div>
                    <button type="submit" className="save-btn" disabled={loading}>
                      {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save"></i>} Save Changes
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="settings-section">
                <h2><i className="fas fa-lock"></i> Security Settings</h2>
                
                <form onSubmit={updatePassword}>
                  <div className="form-group">
                    <label>Current Password</label>
                    <input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} required />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>New Password</label>
                      <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} required />
                    </div>
                    <div className="form-group">
                      <label>Confirm New Password</label>
                      <input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} required />
                    </div>
                  </div>
                  <div className="password-tips">
                    <p><i className="fas fa-info-circle"></i> Password must be at least 6 characters</p>
                  </div>
                  <button type="submit" className="save-btn" disabled={loading}>
                    {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-key"></i>} Update Password
                  </button>
                </form>

                <div className="security-note">
                  <h4><i className="fas fa-shield-alt"></i> Security Tips</h4>
                  <ul>
                    <li>Use a strong, unique password</li>
                    <li>Never share your password with anyone</li>
                    <li>Enable two-factor authentication for extra security</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div className="settings-section">
                <h2><i className="fas fa-bell"></i> Notification Preferences</h2>
                
                <div className="notification-options">
                  <div className="notification-item">
                    <div className="notification-info">
                      <h4>Email Notifications</h4>
                      <p>Receive updates via email</p>
                    </div>
                    <label className="switch">
                      <input type="checkbox" name="emailNotifications" checked={notifications.emailNotifications} onChange={handleNotificationChange} />
                      <span className="slider round"></span>
                    </label>
                  </div>
                  
                  <div className="notification-item">
                    <div className="notification-info">
                      <h4>SMS Notifications</h4>
                      <p>Receive updates via SMS</p>
                    </div>
                    <label className="switch">
                      <input type="checkbox" name="smsNotifications" checked={notifications.smsNotifications} onChange={handleNotificationChange} />
                      <span className="slider round"></span>
                    </label>
                  </div>
                  
                  <div className="notification-item">
                    <div className="notification-info">
                      <h4>Rescue Alerts</h4>
                      <p>Get notified about rescue operations</p>
                    </div>
                    <label className="switch">
                      <input type="checkbox" name="rescueAlerts" checked={notifications.rescueAlerts} onChange={handleNotificationChange} />
                      <span className="slider round"></span>
                    </label>
                  </div>
                  
                  <div className="notification-item">
                    <div className="notification-info">
                      <h4>Donation Receipts</h4>
                      <p>Receive donation confirmation receipts</p>
                    </div>
                    <label className="switch">
                      <input type="checkbox" name="donationReceipts" checked={notifications.donationReceipts} onChange={handleNotificationChange} />
                      <span className="slider round"></span>
                    </label>
                  </div>
                  
                  <div className="notification-item">
                    <div className="notification-info">
                      <h4>Story Updates</h4>
                      <p>Get notified about new stories</p>
                    </div>
                    <label className="switch">
                      <input type="checkbox" name="storyUpdates" checked={notifications.storyUpdates} onChange={handleNotificationChange} />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Settings */}
            {activeTab === 'privacy' && (
              <div className="settings-section">
                <h2><i className="fas fa-shield-alt"></i> Privacy Settings</h2>
                
                <div className="privacy-options">
                  <div className="privacy-item">
                    <div className="privacy-info">
                      <h4>Show Email to Others</h4>
                      <p>Allow other users to see your email address</p>
                    </div>
                    <label className="switch">
                      <input type="checkbox" name="showEmail" checked={privacy.showEmail} onChange={handlePrivacyChange} />
                      <span className="slider round"></span>
                    </label>
                  </div>
                  
                  <div className="privacy-item">
                    <div className="privacy-info">
                      <h4>Show Phone Number</h4>
                      <p>Allow other users to see your phone number</p>
                    </div>
                    <label className="switch">
                      <input type="checkbox" name="showPhone" checked={privacy.showPhone} onChange={handlePrivacyChange} />
                      <span className="slider round"></span>
                    </label>
                  </div>
                  
                  <div className="privacy-item">
                    <div className="privacy-info">
                      <h4>Show Location</h4>
                      <p>Allow other users to see your city/location</p>
                    </div>
                    <label className="switch">
                      <input type="checkbox" name="showLocation" checked={privacy.showLocation} onChange={handlePrivacyChange} />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Data Management */}
            {activeTab === 'data' && (
              <div className="settings-section">
                <h2><i className="fas fa-database"></i> Data Management</h2>
                
                <div className="data-options">
                  <div className="data-card">
                    <i className="fas fa-download"></i>
                    <h3>Export Data</h3>
                    <p>Download all your personal data</p>
                    <button className="data-btn export-btn">
                      <i className="fas fa-file-export"></i> Export Data
                    </button>
                  </div>
                  
                  <div className="data-card danger">
                    <i className="fas fa-trash-alt"></i>
                    <h3>Clear All Data</h3>
                    <p>Permanently delete all your data</p>
                    <button className="data-btn delete-btn" onClick={clearAllData}>
                      <i className="fas fa-trash"></i> Clear All Data
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;