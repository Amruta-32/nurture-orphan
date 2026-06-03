const express = require('express');
const router = express.Router();
const { 
  sendVolunteerContactEmail, 
  sendAdoptionStatusEmail, 
  sendStoryApprovalEmail 
} = require('../utils/emailService');

// Send email to volunteer
router.post('/send-volunteer-email', async (req, res) => {
  try {
    const { volunteerEmail, volunteerName, senderName, senderEmail, subject, message } = req.body;
    
    console.log("📧 Sending email to volunteer:", volunteerEmail);
    
    const result = await sendVolunteerContactEmail(
      volunteerEmail,
      volunteerName,
      senderName,
      senderEmail,
      subject,
      message
    );
    
    if (result.success) {
      res.json({ 
        success: true, 
        message: 'Email sent successfully!',
        previewUrl: result.previewUrl 
      });
    } else {
      res.status(500).json({ success: false, message: result.error });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Send adoption status email
router.post('/send-adoption-status', async (req, res) => {
  try {
    const { userEmail, userName, childName, status } = req.body;
    
    const result = await sendAdoptionStatusEmail(userEmail, userName, childName, status);
    
    if (result.success) {
      res.json({ success: true, message: 'Email sent successfully!' });
    } else {
      res.status(500).json({ success: false, message: result.error });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Send story approval email
router.post('/send-story-approval', async (req, res) => {
  try {
    const { userEmail, userName, storyTitle } = req.body;
    
    const result = await sendStoryApprovalEmail(userEmail, userName, storyTitle);
    
    if (result.success) {
      res.json({ success: true, message: 'Email sent successfully!' });
    } else {
      res.status(500).json({ success: false, message: result.error });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Test email route
router.post('/test-email', async (req, res) => {
  try {
    const { to, subject, message } = req.body;
    
    const result = await sendVolunteerContactEmail(
      to,
      'Test User',
      'NurtureOrphan',
      'test@nurtureorphan.org',
      subject || 'Test Email',
      message || 'This is a test email from NurtureOrphan.'
    );
    
    if (result.success) {
      res.json({ 
        success: true, 
        message: 'Test email sent!',
        previewUrl: result.previewUrl 
      });
    } else {
      res.status(500).json({ success: false, message: result.error });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;