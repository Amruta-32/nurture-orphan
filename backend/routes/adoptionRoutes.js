const express = require('express');
const router = express.Router();
const Adoption = require('../models/Adoption');

// Submit adoption request
router.post('/request', async (req, res) => {
  try {
    const adoption = new Adoption(req.body);
    await adoption.save();
    res.status(201).json({ success: true, message: 'Adoption request submitted', adoption });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get user's adoption requests
router.get('/my-requests/:email', async (req, res) => {
  try {
    const requests = await Adoption.find({ userEmail: req.params.email }).sort({ createdAt: -1 });
    res.json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all adoption requests
router.get('/all', async (req, res) => {
  try {
    const requests = await Adoption.find().sort({ createdAt: -1 });
    res.json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update adoption request status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const adoption = await Adoption.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true }
    );
    res.json({ success: true, adoption });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;