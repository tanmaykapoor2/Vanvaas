const mongoose = require("mongoose");

const campSchema = new mongoose.Schema(
  {
    title: String,
    location: String,
    price: Number,
    description: String,
    image: String,
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Camp", campSchema);
