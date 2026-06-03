const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  name: String,
  age: String,
  gender: String,
  condition: String,
  image: String,
  location: {
    lat: Number,
    long: Number
  },
  status: {
    type: String,
    default: "pending"
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Orphanage"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Report", reportSchema);