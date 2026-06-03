import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './OrphanageStories.css';

const OrphanageStories = () => {
  const navigate = useNavigate();
  const [stories, setStories] = useState([]);
  const [pendingStories, setPendingStories] = useState([]);
  const [approvedStories, setApprovedStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = () => {
    const allStories = JSON.parse(localStorage.getItem('stories') || '[]');
    
    const pending = allStories.filter(s => s.status === 'pending' || !s.approved);
    const approved = allStories.filter(s => s.status === 'approved' || s.approved === true);
    const rejected = allStories.filter(s => s.status === 'rejected');
    
    setStories(allStories);
    setPendingStories(pending);
    setApprovedStories(approved);
    
    setStats({
      total: allStories.length,
      pending: pending.length,
      approved: approved.length,
      rejected: rejected.length
    });
    
    setLoading(false);
  };

  const approveStory = (storyId) => {
    const allStories = JSON.parse(localStorage.getItem('stories') || '[]');
    const updatedStories = allStories.map(story => 
      story.id === storyId ? { 
        ...story, 
        status: 'approved', 
        approved: true, 
        approvedAt: new Date().toISOString(),
        approvedBy: 'Orphanage Admin'
      } : story
    );
    localStorage.setItem('stories', JSON.stringify(updatedStories));
    loadStories();
    alert('Story approved and published successfully!');
  };

  const rejectStory = (storyId) => {
    if (window.confirm('Are you sure you want to reject this story?')) {
      const allStories = JSON.parse(localStorage.getItem('stories') || '[]');
      const updatedStories = allStories.map(story => 
        story.id === storyId ? { ...story, status: 'rejected', approved: false } : story
      );
      localStorage.setItem('stories', JSON.stringify(updatedStories));
      loadStories();
      alert('Story rejected!');
    }
  };

  const deleteStory = (storyId) => {
    if (window.confirm('Are you sure you want to permanently delete this story?')) {
      const allStories = JSON.parse(localStorage.getItem('stories') || '[]');
      const updatedStories = allStories.filter(story => story.id !== storyId);
      localStorage.setItem('stories', JSON.stringify(updatedStories));
      loadStories();
      alert('Story deleted successfully!');
    }
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

  const getStatusBadge = (status, approved) => {
    if (status === 'approved' || approved === true) {
      return <span className="status-badge approved">✓ Published</span>;
    } else if (status === 'rejected') {
      return <span className="status-badge rejected">✗ Rejected</span>;
    } else {
      return <span className="status-badge pending">⏳ Pending</span>;
    }
  };

  const displayStories = activeTab === 'pending' ? pendingStories : 
                         activeTab === 'approved' ? approvedStories : 
                         stories;

  return (
    <div className="orphanage-stories-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <i className="fas fa-arrow-left"></i> Back to Dashboard
      </button>

      <div className="stories-header">
        <h1><i className="fas fa-book-open"></i> Story Management</h1>
        <p>Review, approve, and manage user-submitted stories</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-book"></i></div>
          <div className="stat-info">
            <h3>{stats.total}</h3>
            <p>Total Stories</p>
          </div>
        </div>
        <div className="stat-card pending">
          <div className="stat-icon"><i className="fas fa-clock"></i></div>
          <div className="stat-info">
            <h3>{stats.pending}</h3>
            <p>Pending Review</p>
          </div>
        </div>
        <div className="stat-card approved">
          <div className="stat-icon"><i className="fas fa-check-circle"></i></div>
          <div className="stat-info">
            <h3>{stats.approved}</h3>
            <p>Published</p>
          </div>
        </div>
        <div className="stat-card rejected">
          <div className="stat-icon"><i className="fas fa-times-circle"></i></div>
          <div className="stat-info">
            <h3>{stats.rejected}</h3>
            <p>Rejected</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="stories-tabs">
        <button className={`tab ${activeTab === 'pending' ? 'active' : ''}`} onClick={() => setActiveTab('pending')}>
          <i className="fas fa-clock"></i> Pending ({stats.pending})
        </button>
        <button className={`tab ${activeTab === 'approved' ? 'active' : ''}`} onClick={() => setActiveTab('approved')}>
          <i className="fas fa-check-circle"></i> Published ({stats.approved})
        </button>
        <button className={`tab ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>
          <i className="fas fa-list"></i> All Stories ({stats.total})
        </button>
      </div>

      {/* Stories List */}
      {loading ? (
        <div className="loading-state">Loading stories...</div>
      ) : displayStories.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-book-open"></i>
          <h3>No Stories Found</h3>
          <p>No stories available in this category</p>
        </div>
      ) : (
        <div className="stories-list">
          {displayStories.map((story) => (
            <div className={`story-item ${story.status === 'pending' ? 'pending' : ''}`} key={story.id}>
              <div className="story-header">
                <div className="story-title">
                  <h3>{story.title}</h3>
                  {getStatusBadge(story.status, story.approved)}
                </div>
                <div className="story-date">
                  <i className="fas fa-calendar"></i> {new Date(story.createdAt).toLocaleDateString()}
                </div>
              </div>
              
              <div className="story-meta">
                <span><i className="fas fa-user"></i> By: {story.submittedByName}</span>
                <span><i className="fas fa-envelope"></i> {story.submittedBy}</span>
                <span><i className="fas fa-tag"></i> {getCategoryIcon(story.category)} {story.category}</span>
              </div>
              
              <div className="story-preview">
                <p>{story.story.substring(0, 200)}...</p>
              </div>
              
              {story.childName && (
                <div className="story-child-info">
                  <strong>Child:</strong> {story.childName} | Age: {story.age} | Location: {story.location}
                </div>
              )}
              
              <div className="story-actions">
                <button className="view-btn" onClick={() => setSelectedStory(story)}>
                  <i className="fas fa-eye"></i> View Full Story
                </button>
                {story.status !== 'approved' && story.approved !== true && (
                  <>
                    <button className="approve-btn" onClick={() => approveStory(story.id)}>
                      <i className="fas fa-check-circle"></i> Approve & Publish
                    </button>
                    <button className="reject-btn" onClick={() => rejectStory(story.id)}>
                      <i className="fas fa-times-circle"></i> Reject
                    </button>
                  </>
                )}
                <button className="delete-btn" onClick={() => deleteStory(story.id)}>
                  <i className="fas fa-trash-alt"></i> Delete
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
                <span><i className="fas fa-user"></i> By: {selectedStory.submittedByName}</span>
                <span><i className="fas fa-envelope"></i> {selectedStory.submittedBy}</span>
                <span><i className="fas fa-calendar"></i> {new Date(selectedStory.createdAt).toLocaleString()}</span>
              </div>
              
              {selectedStory.childName && (
                <div className="child-details">
                  <h4>Child Information</h4>
                  <p><strong>Name:</strong> {selectedStory.childName}</p>
                  <p><strong>Age:</strong> {selectedStory.age} years</p>
                  <p><strong>Location:</strong> {selectedStory.location}</p>
                </div>
              )}
              
              <div className="full-story">
                <h4>Story Content</h4>
                <p>{selectedStory.story}</p>
              </div>
              
              {selectedStory.image && (
                <div className="story-image">
                  <img src={selectedStory.image} alt="Story" />
                </div>
              )}
            </div>
            <div className="modal-footer">
              {selectedStory.status !== 'approved' && selectedStory.approved !== true && (
                <>
                  <button className="approve-btn" onClick={() => {
                    approveStory(selectedStory.id);
                    setSelectedStory(null);
                  }}>
                    <i className="fas fa-check-circle"></i> Approve & Publish
                  </button>
                  <button className="reject-btn" onClick={() => {
                    rejectStory(selectedStory.id);
                    setSelectedStory(null);
                  }}>
                    <i className="fas fa-times-circle"></i> Reject
                  </button>
                </>
              )}
              <button className="delete-btn" onClick={() => {
                deleteStory(selectedStory.id);
                setSelectedStory(null);
              }}>
                <i className="fas fa-trash-alt"></i> Delete Story
              </button>
              <button className="close-btn" onClick={() => setSelectedStory(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrphanageStories;