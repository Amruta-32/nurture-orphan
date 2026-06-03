const express = require('express');
const router = express.Router();
const Child = require('../models/Child');
const RescuedChild = require('../models/RescuedChild');

// Add manually added child
router.post('/add', async (req, res) => {
  try {
    const child = new Child(req.body);
    await child.save();
    res.status(201).json({ success: true, message: 'Child added successfully!', child });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add rescued child to rescued_children table
router.post('/add-rescued', async (req, res) => {
  try {
    const rescuedChild = new RescuedChild(req.body);
    await rescuedChild.save();
    res.status(201).json({ success: true, message: 'Rescued child added!', rescuedChild });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get ALL children from BOTH tables (no status filter)
router.get('/all-for-adoption', async (req, res) => {
  try {
    // Get ALL manually added children
    const addedChildren = await Child.find();
    
    // Get ALL rescued children
    const rescuedChildren = await RescuedChild.find();
    
    // Combine both with type identifier
    const allChildren = [
      ...addedChildren.map(c => ({ ...c.toObject(), type: 'manual' })),
      ...rescuedChildren.map(c => ({ ...c.toObject(), type: 'rescued' }))
    ];
    
    res.json({ success: true, children: allChildren });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get children by orphanage
router.get('/orphanage/:orphanageId', async (req, res) => {
  try {
    const addedChildren = await Child.find({ orphanageId: req.params.orphanageId });
    const rescuedChildren = await RescuedChild.find({ orphanageId: req.params.orphanageId });
    const allChildren = [...addedChildren, ...rescuedChildren];
    res.json({ success: true, children: allChildren });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;