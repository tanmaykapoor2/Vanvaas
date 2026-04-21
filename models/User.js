const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required."],
      unique: true, // ← enforces uniqueness at DB level
      trim: true,
      lowercase: true, // stored lowercase so "Alice" == "alice"
      minlength: [3, "Username must be at least 3 characters."],
      maxlength: [30, "Username must be 30 characters or fewer."],
      match: [
        /^[a-zA-Z0-9_.-]+$/,
        "Username can only contain letters, numbers, underscores, hyphens, and dots.",
      ],
    },

    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true, // ← enforces uniqueness at DB level
      trim: true,
      lowercase: true,
      maxlength: [254, "Email is too long."],
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
        "Please enter a valid email address.",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required."],
      minlength: [60, "Stored password hash is too short."], // bcrypt hashes are always 60 chars
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
