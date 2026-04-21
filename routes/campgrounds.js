const express = require("express");
const Camp = require("../models/Camp");

const router = express.Router();

// New camp form
router.get("/camps/new", (req, res) => {
  if (!req.session.userId) return res.redirect("/login");
  res.render("camps/new");
});

// Create camp
router.post("/camps", async (req, res) => {
  if (!req.session.userId) return res.redirect("/login");
  try {
    const camp = new Camp({ ...req.body, createdBy: req.session.userId });
    await camp.save();
    res.redirect("/campgrounds");
  } catch (err) {
    console.error("Camp save error:", err);
    res.redirect("/camps/new");
  }
});

// List campgrounds
router.get("/campgrounds", async (req, res) => {
  try {
    const camps = await Camp.find({});
    res.render("campgrounds", { camps });
  } catch (err) {
    console.error("Camps fetch error:", err);
    res.render("campgrounds", { camps: [] });
  }
});

module.exports = router;
