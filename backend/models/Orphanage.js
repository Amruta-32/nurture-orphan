const mongoose = require("mongoose");

const orphanageSchema = new mongoose.Schema({
  name: String,
  email: String,
  contact: String,
  address: String,
  city: String,
  password: String
});

module.exports = mongoose.model("Orphanage", orphanageSchema);