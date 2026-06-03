const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");


// =======================================
// CHILDREN REPORT
// =======================================
router.get("/children", async (req, res) => {

  try {

    const children =
      await mongoose.connection.db
        .collection("children")
        .find({})
        .toArray();

    const rescuedChildren =
      await mongoose.connection.db
        .collection("rescuedchildren")
        .find({})
        .toArray();

    const allChildren = [
      ...children,
      ...rescuedChildren,
    ];

    const male = allChildren.filter(
      (child) =>
        child.gender &&
        child.gender.toLowerCase() === "male"
    ).length;

    const female = allChildren.filter(
      (child) =>
        child.gender &&
        child.gender.toLowerCase() === "female"
    ).length;

    // IMPORTANT
    res.json({

      totalChildren:
        allChildren.length,

      orphanageChildren:
        children.length,

      rescuedChildren:
        rescuedChildren.length,

      male,

      female,

      // SEND FULL DATA
      children: allChildren,

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:
        "Error fetching children report",
    });

  }

});


// =======================================
// VOLUNTEER REPORT
// =======================================
router.get("/volunteers", async (req, res) => {

  try {

    const volunteers =
      await mongoose.connection.db
        .collection("volunteers")
        .find({})
        .toArray();

    const approved = volunteers.filter(
      (v) =>
        v.status &&
        v.status.toLowerCase() === "approved"
    ).length;

    const pending = volunteers.filter(
      (v) =>
        v.status &&
        v.status.toLowerCase() === "pending"
    ).length;

    const rejected = volunteers.filter(
      (v) =>
        v.status &&
        v.status.toLowerCase() === "rejected"
    ).length;

    // IMPORTANT
    res.json({

      total: volunteers.length,

      approved,

      pending,

      rejected,

      // SEND FULL DATA
      volunteers,

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:
        "Error fetching volunteer report",
    });

  }

});
// =======================================
// STAFF REPORT
// =======================================
router.get("/staffs", async (req, res) => {

  try {

    const staffs =
      await mongoose.connection.db
        .collection("staffs")
        .find({})
        .toArray();

    const active = staffs.filter(
      (s) =>
        s.status &&
        s.status.toLowerCase() === "active"
    ).length;

    const inactive = staffs.filter(
      (s) =>
        s.status &&
        s.status.toLowerCase() === "inactive"
    ).length;

    const onLeave = staffs.filter(
      (s) =>
        s.status &&
        s.status.toLowerCase() === "on-leave"
    ).length;

    res.json({

      total: staffs.length,

      active,

      inactive,

      onLeave,

      staffs,

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:
        "Error fetching staff report",
    });

  }

});
module.exports = router;