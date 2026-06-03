require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// 1. CREATE the app instance FIRST
const app = express();

app.use(cors());
app.use(express.json());

// 2. Import routes
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

// 3. Use routes
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

// 4. Define your app's routes AFTER creating the app
app.get('/api/ping', (req, res) => {
  res.json({ message: "pong", time: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.json({ 
    message: 'NurtureOrphan API is running!',
    status: 'active',
    documentation: 'Use /api/... endpoints'
  });
});

app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working!" });
});

// 5. Database connection and server start
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});