import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Stories.css';

const Stories = () => {
  const navigate = useNavigate();
  const [stories, setStories] = useState([]);
  const [myStories, setMyStories] = useState([]);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    childName: '',
    age: '',
    location: '',
    story: '',
    image: '',
    category: 'success'
  });

  const userName = localStorage.getItem('userName') || 'Anonymous';
  const userEmail = localStorage.getItem('userEmail');

  // Load stories from localStorage
  useEffect(() => {
    loadStories();
    loadMyStories();
  }, []);

  const loadStories = () => {
    const allStories = JSON.parse(localStorage.getItem('stories') || '[]');
    // Sort by date (latest first)
    const sorted = allStories.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setStories(sorted);
    setLoading(false);
  };

  const loadMyStories = () => {
    const allStories = JSON.parse(localStorage.getItem('stories') || '[]');
    const mySubmittedStories = allStories.filter(s => s.submittedBy === userEmail || s.submittedByName === userName);
    setMyStories(mySubmittedStories);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newStory = {
      id: Date.now(),
      ...formData,
      submittedBy: userEmail,
      submittedByName: userName,
      status: 'pending',
      likes: 0,
      views: 0,
      createdAt: new Date().toISOString(),
      approved: false
    };
    
    const existingStories = JSON.parse(localStorage.getItem('stories') || '[]');
    existingStories.push(newStory);
    localStorage.setItem('stories', JSON.stringify(existingStories));
    
    alert('Thank you for sharing your story! It will be published after review.');
    setShowSubmitForm(false);
    setFormData({
      title: '',
      childName: '',
      age: '',
      location: '',
      story: '',
      image: '',
      category: 'success'
    });
    loadStories();
    loadMyStories();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const likeStory = (storyId) => {
    const allStories = JSON.parse(localStorage.getItem('stories') || '[]');
    const updatedStories = allStories.map(story => 
      story.id === storyId ? { ...story, likes: (story.likes || 0) + 1 } : story
    );
    localStorage.setItem('stories', JSON.stringify(updatedStories));
    loadStories();
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'success': return '🏆';
      case 'adoption': return '🏠';
      case 'education': return '📚';
      case 'health': return '🏥';
      default: return '🌟';
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'approved') {
      return <span className="badge approved">✓ Published</span>;
    } else if (status === 'pending') {
      return <span className="badge pending">⏳ Pending Review</span>;
    } else {
      return <span className="badge rejected">❌ Rejected</span>;
    }
  };

  const filteredStories = activeTab === 'all' 
    ? stories.filter(s => s.approved !== false)
    : stories.filter(s => s.category === activeTab && s.approved !== false);

  return (
    <div className="stories-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <i className="fas fa-arrow-left"></i> Back to Dashboard
      </button>

      <div className="stories-header">
        <h1><i className="fas fa-book-open"></i> Stories of Hope</h1>
        <p>Real stories of transformation, courage, and hope</p>
        <button className="share-story-btn" onClick={() => setShowSubmitForm(true)}>
          <i className="fas fa-pen-fancy"></i> Share Your Story
        </button>
      </div>

      {/* Tabs */}
      <div className="stories-tabs">
        <button className={`tab ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>
          <i className="fas fa-globe"></i> All Stories
        </button>
        <button className={`tab ${activeTab === 'success' ? 'active' : ''}`} onClick={() => setActiveTab('success')}>
          <i className="fas fa-trophy"></i> Success Stories
        </button>
        <button className={`tab ${activeTab === 'adoption' ? 'active' : ''}`} onClick={() => setActiveTab('adoption')}>
          <i className="fas fa-heart"></i> Adoption Stories
        </button>
        <button className={`tab ${activeTab === 'education' ? 'active' : ''}`} onClick={() => setActiveTab('education')}>
          <i className="fas fa-graduation-cap"></i> Education Stories
        </button>
        <button className={`tab ${activeTab === 'my' ? 'active' : ''}`} onClick={() => setActiveTab('my')}>
          <i className="fas fa-user"></i> My Stories
        </button>
      </div>

      {/* Stories Grid */}
      {loading ? (
        <div className="loading-state">Loading stories...</div>
      ) : activeTab === 'my' ? (
        myStories.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-book-open"></i>
            <h3>No Stories Yet</h3>
            <p>Share your first story to inspire others</p>
            <button className="share-btn" onClick={() => setShowSubmitForm(true)}>
              <i className="fas fa-plus"></i> Share Your Story
            </button>
          </div>
        ) : (
          <div className="stories-grid">
            {myStories.map((story) => (
              <div className="story-card my-story" key={story.id}>
                <div className="story-badge">{getStatusBadge(story.status)}</div>
                <div className="story-category">{getCategoryIcon(story.category)} {story.category}</div>
                <h3>{story.title}</h3>
                <p className="story-excerpt">{story.story.substring(0, 120)}...</p>
                <div className="story-meta">
                  <span><i className="fas fa-calendar"></i> {new Date(story.createdAt).toLocaleDateString()}</span>
                  <span><i className="fas fa-eye"></i> {story.views || 0} views</span>
                </div>
                <button className="view-btn" onClick={() => setSelectedStory(story)}>View Details</button>
              </div>
            ))}
          </div>
        )
      ) : filteredStories.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-book-open"></i>
          <h3>No Stories Found</h3>
          <p>Be the first to share a story of hope</p>
        </div>
      ) : (
        <div className="stories-grid">
          {filteredStories.map((story) => (
            <div className="story-card" key={story.id}>
              <div className="story-category">{getCategoryIcon(story.category)} {story.category}</div>
              <h3>{story.title}</h3>
              <p className="story-excerpt">{story.story.substring(0, 100)}...</p>
              <div className="story-meta">
                <span><i className="fas fa-user"></i> {story.submittedByName}</span>
                <span><i className="fas fa-calendar"></i> {new Date(story.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="story-stats">
                <button className="like-btn" onClick={() => likeStory(story.id)}>
                  <i className="fas fa-heart"></i> {story.likes || 0}
                </button>
                <button className="read-more-btn" onClick={() => setSelectedStory(story)}>
                  Read More <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Story Detail Modal */}
      {selectedStory && (
        <div className="modal-overlay" onClick={() => setSelectedStory(null)}>
          <div className="story-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedStory.title}</h2>
              <button className="close-modal" onClick={() => setSelectedStory(null)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="story-info">
                <span className="category-badge">{getCategoryIcon(selectedStory.category)} {selectedStory.category}</span>
                <span className="story-date"><i className="fas fa-calendar"></i> {new Date(selectedStory.createdAt).toLocaleDateString()}</span>
                <span className="story-author"><i className="fas fa-user"></i> By {selectedStory.submittedByName}</span>
              </div>
              {selectedStory.childName && (
                <div className="child-info">
                  <h4>Child Story</h4>
                  <p><strong>Name:</strong> {selectedStory.childName}</p>
                  <p><strong>Age:</strong> {selectedStory.age} years</p>
                  <p><strong>Location:</strong> {selectedStory.location}</p>
                </div>
              )}
              <div className="story-full-text">
                <p>{selectedStory.story}</p>
              </div>
              <div className="story-actions">
                <button className="like-story-btn" onClick={() => likeStory(selectedStory.id)}>
                  <i className="fas fa-heart"></i> Like ({selectedStory.likes || 0})
                </button>
                <button className="share-story-btn" onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copied to clipboard!');
                }}>
                  <i className="fas fa-share-alt"></i> Share
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submit Story Modal */}
      {showSubmitForm && (
        <div className="modal-overlay" onClick={() => setShowSubmitForm(false)}>
          <div className="submit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2><i className="fas fa-pen-fancy"></i> Share Your Story</h2>
              <button className="close-modal" onClick={() => setShowSubmitForm(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Story Title *</label>
                  <input type="text" name="title" value={formData.title} onChange={handleChange} required placeholder="Give your story a title" />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Child Name</label>
                    <input type="text" name="childName" value={formData.childName} onChange={handleChange} placeholder="Name of the child" />
                  </div>
                  <div className="form-group">
                    <label>Age</label>
                    <input type="number" name="age" value={formData.age} onChange={handleChange} placeholder="Age" />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Location</label>
                    <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="City, Country" />
                  </div>
                  <div className="form-group">
                    <label>Category *</label>
                    <select name="category" value={formData.category} onChange={handleChange} required>
                      <option value="success">Success Story</option>
                      <option value="adoption">Adoption Story</option>
                      <option value="education">Education Story</option>
                      <option value="health">Health Story</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Your Story *</label>
                  <textarea name="story" value={formData.story} onChange={handleChange} required rows="6" placeholder="Share your inspiring story..."></textarea>
                </div>
                
                <div className="form-group">
                  <label>Image URL (Optional)</label>
                  <input type="text" name="image" value={formData.image} onChange={handleChange} placeholder="https://example.com/image.jpg" />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="cancel-btn" onClick={() => setShowSubmitForm(false)}>Cancel</button>
                <button type="submit" className="submit-btn">Submit Story</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stories;