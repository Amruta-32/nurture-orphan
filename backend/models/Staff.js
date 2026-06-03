const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  position: { type: String, required: true },
  department: { type: String, enum: ['Teaching', 'Medical', 'Administration', 'Kitchen', 'Security', 'Counseling', 'Other'], default: 'Other' },
  joinDate: { type: Date, default: Date.now },
  salary: { type: Number },
  address: { type: String },
  city: { type: String },
  qualifications: { type: String },
  experience: { type: String },
  shift: { type: String, enum: ['Morning', 'Evening', 'Night', 'Full Day'], default: 'Full Day' },
  status: { type: String, enum: ['active', 'inactive', 'on-leave'], default: 'active' },
  orphanageId: { type: String, required: true },
  orphanageName: { type: String },
  emergencyContact: { type: String },
  emergencyContactName: { type: String },
  photo: { type: String },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Staff', staffSchema);