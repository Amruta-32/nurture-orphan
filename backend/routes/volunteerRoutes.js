const express = require('express');
const router = express.Router();
const Volunteer = require('../models/Volunteer');

// Apply for volunteer - User side
router.post('/apply', async (req, res) => {
  try {
    const { name, email, phone, age, city, occupation, skills, availability, interests, experience, motivation } = req.body;
    
    // Check by name
    const existingApplication = await Volunteer.findOne({ name });
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied' });
    }
    
    const volunteer = await Volunteer.create({
      name, email, phone, age, city, occupation, skills, availability, interests, experience, motivation,
      status: 'pending'
    });
    
    res.status(201).json({ success: true, message: 'Application submitted successfully!', volunteer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get my applications - User side (by name)
router.get('/my-applications', async (req, res) => {
  try {
    const { name } = req.query;
    const applications = await Volunteer.find({ name });
    res.json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all volunteers - Orphanage side
router.get('/all', async (req, res) => {
  try {
    const volunteers = await Volunteer.find().sort({ joinedAt: -1 });
    res.json({ success: true, volunteers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get pending volunteers
router.get('/pending', async (req, res) => {
  try {
    const pending = await Volunteer.find({ status: 'pending' });
    res.json({ success: true, pending });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update volunteer status - Orphanage side
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const volunteer = await Volunteer.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true }
    );
    res.json({ success: true, volunteer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;