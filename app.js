const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const ejsMate = require("ejs-mate");

const app = express();

/* ================= DATABASE ================= */

mongoose
  .connect("mongodb://127.0.0.1:27017/vanvaasDB")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

/* ================= SETTINGS ================= */

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

/* ================= SESSION ================= */

app.use(
  session({
    secret: "vanvaassecret",
    resave: false,
    saveUninitialized: false,
  }),
);

/* ================= LOCALS MIDDLEWARE ================= */
// Must be registered BEFORE routes so all routes have access to res.locals.user

const User = require("./models/User");

app.use(async (req, res, next) => {
  res.locals.user = null;
  if (req.session.userId) {
    try {
      const user = await User.findById(req.session.userId).select("-password");
      res.locals.user = user;
    } catch (err) {
      console.log(err);
    }
  }
  next();
});

/* ================= ROUTES ================= */

const userRoutes = require("./routes/users");
const campgroundRoutes = require("./routes/campgrounds");

app.use("/", userRoutes);
app.use("/", campgroundRoutes);

app.get("/", (req, res) => {
  res.render("home");
});

/* ================= START SERVER ================= */

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
