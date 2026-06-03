const mongoose = require('mongoose');

const rescuedChildSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, default: 'other' },
  city: { type: String },
  location: { type: String },
  rescuedDate: { type: Date, default: Date.now },
  reportedBy: { type: String },
  contactPerson: { type: String },
  contactPhone: { type: String },
  status: { type: String, default: 'available' },
  orphanageId: { type: String },
  reportId: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RescuedChild', rescuedChildSchema);