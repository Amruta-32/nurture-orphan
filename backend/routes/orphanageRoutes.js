const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const Orphanage = require("../models/Orphanage");

// Register orphanage
router.post("/register", async (req, res) => {
  try {
    const { name, email, contact, address, city, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newOrphanage = new Orphanage({
      name,
      email,
      contact,
      address,
      city,
      password: hashedPassword
    });

    await newOrphanage.save();

    res.json({ message: "Orphanage Registered Successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login orphanage
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const orphanage = await Orphanage.findOne({ email });
    if (!orphanage) return res.status(400).json({ message: "Orphanage not found" });

    const isMatch = await bcrypt.compare(password, orphanage.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    res.json({ message: "Login successful", orphanage });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;