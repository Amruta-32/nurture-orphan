const express = require('express');
const router = express.Router();
const paypal = require('@paypal/checkout-server-sdk');

// Remove this line → const { protect } = require('../middleware/auth');

// PayPal environment setup
function environment() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  return new paypal.core.SandboxEnvironment(clientId, clientSecret);
}

function client() {
  return new paypal.core.PayPalHttpClient(environment());
}

// Create PayPal order - NO AUTH
router.post('/create-order', async (req, res) => {  // Removed 'protect'
  try {
    const { amount } = req.body;
    
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: amount.toString()
        },
        description: `Donation to NurtureOrphan`
      }]
    });
    
    const order = await client().execute(request);
    res.json({ id: order.result.id });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: error.message });
  }
});

// Capture payment - NO AUTH
router.post('/capture-order', async (req, res) => {  // Removed 'protect'
  try {
    const { orderId } = req.body;
    
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});
    
    const capture = await client().execute(request);
    
    res.json({ 
      success: true, 
      transactionId: capture.result.id,
      amount: capture.result.purchase_units[0].amount.value
    });
  } catch (error) {
    console.error('Error capturing payment:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;