const express = require('express');
const router = express.Router();
const Sponsorship = require('../models/Sponsorship');
const Orphanage = require('../models/Orphanage');
const paypal = require('@paypal/checkout-server-sdk');

// PayPal environment setup
function environment() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  return new paypal.core.SandboxEnvironment(clientId, clientSecret);
}

function client() {
  return new paypal.core.PayPalHttpClient(environment());
}

// ========================================
// GET all orphanages available for sponsorship
// ========================================
router.get('/orphanages', async (req, res) => {
  try {
    const orphanages = await Orphanage.find().select('-password');
    res.json({ success: true, orphanages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ========================================
// CREATE PayPal order for sponsorship (NO AUTH)
// ========================================
router.post('/create-paypal-order', async (req, res) => {
  try {
    const { amount, orphanageName, sponsorshipType, purpose } = req.body;
    
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: amount.toString()
        },
        description: `Sponsorship for ${orphanageName} - ${sponsorshipType} - ${purpose}`
      }]
    });
    
    const order = await client().execute(request);
    res.json({ id: order.result.id });
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    res.status(500).json({ error: error.message });
  }
});

// ========================================
// CREATE sponsorship after PayPal payment (NO AUTH)
// ========================================
router.post('/create', async (req, res) => {
  try {
    const {
      orphanageId,
      orphanageName,
      orphanageCity,
      amount,
      sponsorshipType,
      purpose,
      message,
      sponsorPhone,
      sponsorAddress,
      sponsorName,
      sponsorEmail,
      transactionId,
      paymentId
    } = req.body;
    
    const sponsorship = new Sponsorship({
      sponsorName: sponsorName,
      sponsorEmail: sponsorEmail,
      sponsorPhone: sponsorPhone,
      sponsorAddress: sponsorAddress,
      orphanageId,
      orphanageName,
      orphanageCity,
      amount,
      sponsorshipType,
      purpose,
      message,
      paymentId,
      transactionId,
      status: 'pending',
      startDate: new Date(),
      nextPaymentDate: sponsorshipType === 'monthly' ? new Date(Date.now() + 30*24*60*60*1000) : 
                       sponsorshipType === 'yearly' ? new Date(Date.now() + 365*24*60*60*1000) : null,
      createdAt: new Date()
    });
    
    await sponsorship.save();
    res.status(201).json({ success: true, sponsorship });
  } catch (error) {
    console.error('Error creating sponsorship:', error);
    res.status(500).json({ message: error.message });
  }
});

// ========================================
// GET my sponsorships by email (NO AUTH)
// ========================================
router.get('/my-sponsorships', async (req, res) => {
  try {
    const { email } = req.query;
    const sponsorships = await Sponsorship.find({ sponsorEmail: email })
      .sort({ createdAt: -1 });
    res.json({ success: true, sponsorships });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ========================================
// GET sponsorships for an orphanage (orphanage view)
// ========================================
// GET sponsorships for an orphanage (orphanage view)
router.get('/orphanage/:orphanageId', async (req, res) => {
  try {
    const sponsorships = await Sponsorship.find({ 
      orphanageId: req.params.orphanageId 
    }).sort({ createdAt: -1 });
    res.json({ success: true, sponsorships });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ========================================
// UPDATE sponsorship status (orphanage approves)
// ========================================
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const sponsorship = await Sponsorship.findByIdAndUpdate(
      req.params.id,
      { 
        status, 
        updatedAt: new Date(),
        ...(status === 'active' ? { nextPaymentDate: new Date(Date.now() + 30*24*60*60*1000) } : {})
      },
      { new: true }
    );
    res.json({ success: true, sponsorship });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ========================================
// GET all sponsorships (admin)
// ========================================
router.get('/all', async (req, res) => {
  try {
    const sponsorships = await Sponsorship.find().sort({ createdAt: -1 });
    res.json({ success: true, sponsorships });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;  