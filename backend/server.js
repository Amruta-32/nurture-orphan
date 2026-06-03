require('dotenv').config();
// SIMPLE TEST ROUTE - Add this FIRST
app.get("/api/ping", (req, res) => {
  res.json({ message: "pong", time: new Date().toISOString() });
});
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const orphanageRoutes = require("./routes/orphanageRoutes");
const reportRoutes = require("./routes/reportRoutes");
const volunteerRoutes = require("./routes/volunteerRoutes");
const childrenRoutes = require('./routes/childrenRoutes');
const adoptionRoutes = require('./routes/adoptionRoutes');
const staffRoutes = require('./routes/staffRoutes');
const analyticsRoutes = require("./routes/analyticsRoutes");
const sponsorshipRoutes = require("./routes/sponsorshipRoutes");
const emailRoutes = require('./routes/emailRoutes');
const paypalRoutes = require('./routes/paypalRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/orphanages", orphanageRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/volunteer", volunteerRoutes);
app.use('/api/children', childrenRoutes);
app.use('/api/adoptions', adoptionRoutes);
app.use('/api/staff', staffRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/sponsorships", sponsorshipRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/paypal', paypalRoutes);

// ✅ Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'NurtureOrphan API is running!',
    status: 'active',
    documentation: 'Use /api/... endpoints'
  });
});

// ✅ Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working!" });
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ Error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});