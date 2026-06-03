const express = require("express");
const router = express.Router();
const Report = require("../models/Report");

// GET all reports
router.get("/", async (req, res) => {
  const reports = await Report.find().sort({ createdAt: -1 });
  res.json(reports);
});

// ACCEPT report (update status)
router.put("/:id/accept", async (req, res) => {
  const { orphanageId } = req.body;

  const report = await Report.findByIdAndUpdate(
    req.params.id,
    {
      status: "accepted",
      assignedTo: orphanageId
    },
    { new: true }
  );

  res.json(report);
});

// UPDATE status
router.put("/:id/status", async (req, res) => {
  const { status } = req.body;

  const report = await Report.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  res.json(report);
});
// Get rescued children
router.get('/rescued', async (req, res) => {
  try {
    const reports = await Report.find({ rescueStatus: 'resolved' });
    const children = reports.map(r => ({
      id: r._id,
      name: r.childName,
      age: r.childAge,
      gender: r.childGender,
      city: r.city
    }));
    res.json({ success: true, children });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
module.exports = router;