const mongoose = require('mongoose');

const sponsorshipSchema = new mongoose.Schema({
  // Sponsor Information
  sponsorName: { type: String, required: true },
  sponsorEmail: { type: String, required: true },
  sponsorPhone: { type: String },
  sponsorAddress: { type: String },
  sponsorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  // Orphanage Information
  orphanageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Orphanage', required: true },
  orphanageName: { type: String, required: true },
  orphanageCity: { type: String },
  
  // Sponsorship Details
  amount: { type: Number, required: true },
  sponsorshipType: { type: String, enum: ['monthly', 'yearly', 'one-time'], default: 'monthly' },
  purpose: { type: String, enum: ['general', 'education', 'medical', 'food', 'shelter'], default: 'general' },
  message: { type: String },
  
  // Status
  status: { type: String, enum: ['pending', 'active', 'completed', 'cancelled'], default: 'pending' },
  
  // Payment
  paymentId: { type: String },
  transactionId: { type: String },
  
  // Dates
  startDate: { type: Date, default: Date.now },
  nextPaymentDate: { type: Date },
  endDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Sponsorship', sponsorshipSchema);