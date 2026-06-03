require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const orphanageRoutes = require("./routes/orphanageRoutes");
const reportRoutes = require("./routes/reportRoutes");  // MOVED UP
const volunteerRoutes = require("./routes/volunteerRoutes"); // ADD FOR VOLUNTEER
const childrenRoutes = require('./routes/childrenRoutes');
const adoptionRoutes = require('./routes/adoptionRoutes');
const staffRoutes = require('./routes/staffRoutes');
const analyticsRoutes = require("./routes/analyticsRoutes");
const sponsorshipRoutes = require("./routes/sponsorshipRoutes");
const emailRoutes = require('./routes/emailRoutes');
// Add with other routes
const paypalRoutes = require('./routes/paypalRoutes');

// Add this line with other app.use
// Add this line
// Add this line with other routes
const app = express();

app.use(cors());
app.use(express.json());

// Routes - ALL routes must be BEFORE app.listen
app.use("/api/users", userRoutes);
app.use("/api/orphanages", orphanageRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/volunteer", volunteerRoutes);  // ADD THIS FOR VOLUNTEER
app.use('/api/children', childrenRoutes);
app.use('/api/adoptions', adoptionRoutes);
app.use('/api/staff', staffRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/sponsorships", sponsorshipRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/paypal', paypalRoutes);

// MongoDB connection
// mongoose.connect("mongodb://127.0.0.1:27017/mernDB")
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Start server
const PORT = 5000;
// A simple route for the root URL
app.get('/', (req, res) => {
  res.json({ 
    message: 'NurtureOrphan API is running!',
    status: 'active',
    documentation: 'Use /api/... endpoints'
  });
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// Test route to check if backend is running
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working!" });
});
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");

// const userRoutes = require("./routes/userRoutes");
// const orphanageRoutes = require("./routes/orphanageRoutes");

// const app = express();

// app.use(cors());
// app.use(express.json());

// // Routes
// app.use("/api/users", userRoutes);
// app.use("/api/orphanages", orphanageRoutes);

// // MongoDB connection
// mongoose.connect("mongodb://127.0.0.1:27017/mernDB")
//   .then(() => console.log("MongoDB Connected"))
//   .catch(err => console.log(err));

// // Start server
// app.listen(5000, () => {
//   console.log("Server running on port 5000");
// });

// const reportRoutes = require("./routes/reportRoutes");

// app.use("/api/reports", reportRoutes);