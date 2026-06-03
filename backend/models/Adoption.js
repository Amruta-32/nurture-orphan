const mongoose = require('mongoose');

const adoptionSchema = new mongoose.Schema({
  childId: { type: String, required: true },
  childName: { type: String, required: true },
  childAge: { type: Number, required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  userPhone: { type: String, required: true },
  userAddress: { type: String, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Adoption', adoptionSchema);