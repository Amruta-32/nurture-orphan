const mongoose = require('mongoose');

const childSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, default: 'other' },
  orphanageId: { type: String, required: true },
  orphanageName: { type: String },
  photo: { type: String },
  healthStatus: { type: String, default: 'good' },
  educationLevel: { type: String },
  hobbies: { type: String },
  specialNeeds: { type: String },
  guardianName: { type: String },
  guardianContact: { type: String },
  status: { type: String, default: 'active' },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Child', childSchema);