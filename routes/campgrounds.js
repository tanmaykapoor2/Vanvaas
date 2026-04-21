const express = require("express");
const Camp = require("../models/Camp");
const Review = require("../models/Review");

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

// View Single Camp
router.get("/camps/:id", async (req, res) => {
  try {
    const camp = await Camp.findById(req.params.id).populate({
      path: "reviews",
      populate: { path: "author", select: "username" },
    });
    if (!camp) return res.redirect("/campgrounds");
    res.render("camps/show", { camp });
  } catch (e) {
    res.redirect("/campgrounds");
  }
});

// Delete Camp
router.delete("/camps/:id", async (req, res) => {
  if (!req.session.userId) return res.redirect("/login");
  const camp = await Camp.findById(req.params.id);
  if (camp) {
    await Review.deleteMany({ _id: { $in: camp.reviews } });
    await camp.deleteOne();
  }
  res.redirect("/campgrounds");
});

/* ================= REVIEWS ================= */

// Add Review
router.post("/camps/:id/reviews", async (req, res) => {
  const camp = await Camp.findById(req.params.id);
  const review = new Review({
    rating: req.body.rating,
    body: req.body.body,
  });
  if (req.session.userId) {
    review.author = req.session.userId;
  }
  await review.save();
  camp.reviews.push(review);
  await camp.save();
  res.redirect(`/camps/${camp._id}`);
});

// Delete Review
router.delete("/camps/:id/reviews/:reviewId", async (req, res) => {
  if (!req.session.userId) return res.redirect("/login");
  const { id, reviewId } = req.params;
  await Camp.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/camps/${id}`);
});

module.exports = router;
