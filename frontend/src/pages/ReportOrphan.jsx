import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ReportOrphan.css";

const ReportOrphan = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    childName: "",
    childAge: "",
    childGender: "",
    location: "",
    city: "",
    landmark: "",
    description: "",
    contactPerson: "",
    contactPhone: "",
    urgent: false
  });

  // GPS Location State
  const [gpsLocation, setGpsLocation] = useState({
    latitude: null,
    longitude: null,
    address: "",
    isLoading: false
  });
  const [locationError, setLocationError] = useState("");

  // Map State
  const [mapLocation, setMapLocation] = useState({
    lat: 20.5937,  // Default center (India)
    lng: 78.9629,
    zoom: 5
  });
  const [showMap, setShowMap] = useState(false);
  
  // Image State
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  // Form State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [reportId, setReportId] = useState("");

  // Create floating circles effect
  useEffect(() => {
    const container = document.querySelector('.report-orphan-container');
    if (container) {
      for (let i = 0; i < 6; i++) {
        const circle = document.createElement('div');
        circle.classList.add('circle');
        const size = Math.random() * 150 + 50;
        circle.style.width = `${size}px`;
        circle.style.height = `${size}px`;
        circle.style.left = `${Math.random() * 100}%`;
        circle.style.top = `${Math.random() * 100}%`;
        circle.style.animationDelay = `${Math.random() * 10}s`;
        circle.style.animationDuration = `${Math.random() * 15 + 10}s`;
        container.appendChild(circle);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    setError("");
  };

  const getCurrentLocation = () => {
    setGpsLocation({ ...gpsLocation, isLoading: true });
    setLocationError("");

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setGpsLocation({ ...gpsLocation, isLoading: false });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setGpsLocation({
          latitude,
          longitude,
          address: "",
          isLoading: false
        });

        // Optional: Reverse geocoding to get address from coordinates
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
          );
          const data = await response.json();
          if (data.display_name) {
            setGpsLocation(prev => ({
              ...prev,
              address: data.display_name
            }));
          }
        } catch (err) {
          console.log("Reverse geocoding failed", err);
        }
      },
      (error) => {
        setLocationError("Unable to get location: " + error.message);
        setGpsLocation({ ...gpsLocation, isLoading: false });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const getLocationWithMap = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setGpsLocation({ ...gpsLocation, isLoading: true });
    setShowMap(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setMapLocation({
          lat: latitude,
          lng: longitude,
          zoom: 15
        });
        setGpsLocation({
          latitude,
          longitude,
          address: "",
          isLoading: false
        });
      },
      (error) => {
        setLocationError("Unable to get location: " + error.message);
        setGpsLocation({ ...gpsLocation, isLoading: false });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000
      }
    );
  };

  const updateLocationFromMap = (lat, lng) => {
    setMapLocation({ ...mapLocation, lat, lng });
    setGpsLocation({
      latitude: lat,
      longitude: lng,
      address: "",
      isLoading: false
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError("Please upload a valid image file");
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validate required fields
    if (!formData.childName || !formData.childAge || !formData.location || !formData.city) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    try {
      // Create report object
      const newReport = {
  id: Date.now(),
  reportId: `ORP-${Date.now().toString().slice(-8)}`,
  ...formData,
  image: imagePreview || null,
  gpsLocation: {
    latitude: gpsLocation.latitude,
    longitude: gpsLocation.longitude,
    address: gpsLocation.address
  },
  orphanageId: "1",
  orphanageName: "Sunshine Orphanage",
  status: "pending",
  rescueStatus: "pending",
  reportedAt: new Date().toISOString(),
  reportedBy: localStorage.getItem("userName") || "Anonymous Supporter",
  reporterName: formData.contactPerson,
  reporterPhone: formData.contactPhone
};

      // Get existing reports from localStorage
      const existingReports = JSON.parse(localStorage.getItem('orphanReports') || '[]');
      existingReports.push(newReport);
      localStorage.setItem('orphanReports', JSON.stringify(existingReports));

      setReportId(newReport.reportId);
      setSuccess("Orphan report submitted successfully! Rescue team has been notified.");
      setSubmitted(true);
      
      // Reset form
      setFormData({
        childName: "",
        childAge: "",
        childGender: "",
        location: "",
        city: "",
        landmark: "",
        description: "",
        contactPerson: "",
        contactPhone: "",
        urgent: false
      });
      setImage(null);
      setImagePreview(null);
      
      setTimeout(() => {
        navigate("/user-dashboard");
      }, 3000);
    } catch (err) {
      setError("Failed to submit report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="report-success-container">
        <div className="success-card">
          <i className="fas fa-check-circle"></i>
          <h2>Report Submitted Successfully!</h2>
          <p>Thank you for helping us rescue an orphan in need.</p>
          <p className="report-id">Report ID: {reportId}</p>
          <p>A rescue team will be dispatched to the location shortly.</p>
          <button onClick={() => navigate("/user-dashboard")} className="home-btn">
            <i className="fas fa-home"></i> Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Map Modal Component
  const LocationMapModal = ({ isOpen, onClose, onSelectLocation, currentLocation }) => {
    const mapRef = React.useRef(null);
    const markerRef = React.useRef(null);

    React.useEffect(() => {
      if (isOpen && mapRef.current) {
        // Initialize map
        const map = L.map(mapRef.current).setView([currentLocation.lat, currentLocation.lng], currentLocation.zoom);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Add marker
        const marker = L.marker([currentLocation.lat, currentLocation.lng], { draggable: true }).addTo(map);
        markerRef.current = marker;

        // Update location when marker is dragged
        marker.on('dragend', (e) => {
          const { lat, lng } = e.target.getLatLng();
          onSelectLocation(lat, lng);
        });

        // Click on map to set location
        map.on('click', (e) => {
          const { lat, lng } = e.latlng;
          marker.setLatLng([lat, lng]);
          onSelectLocation(lat, lng);
        });

        return () => {
          map.remove();
        };
      }
    }, [isOpen, currentLocation]);

    if (!isOpen) return null;

    return (
      <div className="map-modal-overlay" onClick={onClose}>
        <div className="map-modal-container" onClick={(e) => e.stopPropagation()}>
          <div className="map-modal-header">
            <h3><i className="fas fa-map-marker-alt"></i> Select Rescue Location</h3>
            <button className="map-close-btn" onClick={onClose}>&times;</button>
          </div>
          <div className="map-modal-body">
            <div ref={mapRef} className="leaflet-map" style={{ height: "400px", width: "100%" }}></div>
            <p className="map-instruction">
              <i className="fas fa-info-circle"></i> 
              Drag the marker or click anywhere on the map to set exact location
            </p>
          </div>
          <div className="map-modal-footer">
            <button className="map-confirm-btn" onClick={onClose}>
              <i className="fas fa-check-circle"></i> Confirm Location
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="report-orphan-container">
      {/* Back Button */}
      <button className="back-button" onClick={() => navigate(-1)}>
        <i className="fas fa-arrow-left"></i>
        Back to Dashboard
      </button>

      {/* Main Form Card */}
      <div className="report-card">
        <div className="decorative-icon">
          <i className="fas fa-hand-holding-heart"></i>
        </div>
        
        <h2>Report an Orphan in Need</h2>
        <p className="report-subtitle">Your report can help save a child's life. Please provide accurate information.</p>

        {error && (
          <div className="error-message">
            <i className="fas fa-exclamation-circle"></i> {error}
          </div>
        )}
        
        {success && (
          <div className="success-message">
            <i className="fas fa-check-circle"></i> {success}
          </div>
        )}

        <form className="report-form" onSubmit={handleSubmit}>
          {/* Child Information Section */}
          <div className="form-section">
            <h3>
              <i className="fas fa-child"></i> Child Information
            </h3>
            
            <div className="form-row">
              <div className="form-group">
                <label>Child's Name *</label>
                <input
                  type="text"
                  name="childName"
                  value={formData.childName}
                  onChange={handleChange}
                  required
                  placeholder="Enter child's name or 'Unknown'"
                />
              </div>
              <div className="form-group">
                <label>Approx. Age *</label>
                <input
                  type="number"
                  name="childAge"
                  value={formData.childAge}
                  onChange={handleChange}
                  required
                  placeholder="Age in years"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Gender</label>
                <select name="childGender" value={formData.childGender} onChange={handleChange}>
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Child Photo</label>
                <div className="file-upload">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    id="image-upload"
                    style={{ display: 'none' }}
                  />
                  <button 
                    type="button" 
                    className="upload-btn"
                    onClick={() => document.getElementById('image-upload').click()}
                  >
                    <i className="fas fa-camera"></i> Upload Photo
                  </button>
                  {imagePreview && (
                    <div className="image-preview">
                      <img src={imagePreview} alt="Child preview" />
                      <button type="button" className="remove-image" onClick={removeImage}>
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Location Information Section */}
          <div className="form-section">
            <h3>
              <i className="fas fa-map-marker-alt"></i> Location Details
            </h3>
            
            <div className="form-group">
              <label>📍 Current GPS Location</label>
              <div className="location-button-container">
                <button 
                  type="button" 
                  className="get-location-btn" 
                  onClick={getCurrentLocation}
                  disabled={gpsLocation.isLoading}
                >
                  {gpsLocation.isLoading ? (
                    <><i className="fas fa-spinner fa-spin"></i> Getting Location...</>
                  ) : (
                    <><i className="fas fa-map-marker-alt"></i> Get My Current Location</>
                  )}
                </button>
                
                {gpsLocation.latitude && (
                  <div className="location-display">
                    <p className="coordinates">
                      <i className="fas fa-location-dot"></i> 
                      Lat: {gpsLocation.latitude.toFixed(6)}, Lng: {gpsLocation.longitude.toFixed(6)}
                    </p>
                    {gpsLocation.address && (
                      <p className="address-preview">
                        <i className="fas fa-address-card"></i> 
                        {gpsLocation.address.substring(0, 100)}...
                      </p>
                    )}
                    <a 
                      href={`https://www.google.com/maps?q=${gpsLocation.latitude},${gpsLocation.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="view-map-link"
                    >
                      <i className="fas fa-map"></i> View on Map
                    </a>
                  </div>
                )}
                
                {locationError && (
                  <p className="location-error">
                    <i className="fas fa-exclamation-triangle"></i> {locationError}
                  </p>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Location/Area *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  placeholder="Street name, colony, etc."
                />
              </div>
              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  placeholder="City name"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Nearby Landmark</label>
              <input
                type="text"
                name="landmark"
                value={formData.landmark}
                onChange={handleChange}
                placeholder="Near temple, school, hospital, etc."
              />
            </div>

            <div className="form-group">
              <button 
                type="button" 
                className="open-map-btn"
                onClick={getLocationWithMap}
              >
                <i className="fas fa-map"></i> Open Map to Select Location
              </button>
            </div>
          </div>

          {/* Description Section */}
          <div className="form-section">
            <h3>
              <i className="fas fa-info-circle"></i> Child's Condition
            </h3>
            
            <div className="form-group">
              <label>Detailed Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                placeholder="Describe child's appearance, clothing, behavior, any injuries, health condition, etc."
              ></textarea>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="form-section">
            <h3>
              <i className="fas fa-phone-alt"></i> Your Contact Information
            </h3>
            
            <div className="form-row">
              <div className="form-group">
                <label>Contact Person</label>
                <input
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  placeholder="Your name"
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  placeholder="For emergency contact"
                />
              </div>
            </div>
          </div>

          {/* Urgent Checkbox */}
          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="urgent"
                checked={formData.urgent}
                onChange={handleChange}
              />
              <span>⚠️ This is URGENT! Child needs immediate help.</span>
            </label>
          </div>

          <button type="submit" className={`submit-btn ${loading ? "loading" : ""}`} disabled={loading}>
            {loading ? "Submitting..." : "Submit Rescue Request"}
          </button>
        </form>
      </div>

      {/* Map Modal */}
      <LocationMapModal 
        isOpen={showMap}
        onClose={() => setShowMap(false)}
        onSelectLocation={updateLocationFromMap}
        currentLocation={mapLocation}
      />
    </div>
  );
};

export default ReportOrphan;