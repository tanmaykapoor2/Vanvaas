const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

// Register routes
router.get("/register", (req, res) => {
  res.render("users/register", { query: req.query });
});

router.post("/register", async (req, res) => {
  try {
    const username = req.body.username?.trim().toLowerCase();
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

    if (!username || !email || !password) {
      return res.redirect("/register?error=1&message=All+fields+required");
    }

    const existing = await User.findOne({ $or: [{ username }, { email }] });

    if (existing) {
      if (existing.username === username) {
        return res.redirect("/register?error=1&message=Username+already+taken");
      }

      if (existing.email === email) {
        return res.redirect(
          "/register?error=1&message=Email+already+registered",
        );
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    // Log the user in automatically after registration
    req.session.regenerate((err) => {
      if (err) {
        console.error("Session regeneration error:", err);
        return res.redirect(
          "/login?error=1&message=Registration+successful,+please+login.",
        );
      }
      req.session.userId = newUser._id;
      res.redirect("/");
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.redirect("/register?error=1&message=Something+went+wrong");
  }
});

// Login routes
router.get("/login", (req, res) => {
  res.render("users/login", { query: req.query });
});

router.post("/login", async (req, res) => {
  try {
    const username = req.body.username?.trim().toLowerCase();
    const password = req.body.password;

    if (!username || !password) {
      return res.redirect("/login?error=1&message=Please+enter+credentials.");
    }

    const user = await User.findOne({ username });
    const isMatch = user
      ? await bcrypt.compare(password, user.password)
      : false;

    if (!user || !isMatch) {
      return res.redirect("/login?error=1&message=Invalid+credentials.");
    }

    req.session.regenerate((err) => {
      if (err) return res.redirect("/login?error=1&message=Session+error.");
      req.session.userId = user._id;
      res.redirect("/");
    });
  } catch (err) {
    console.error("Login error:", err);
    res.redirect("/login?error=1&message=Something+went+wrong.");
  }
});

// Logout
router.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/"));
});

module.exports = router;
