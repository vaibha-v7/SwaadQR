const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
      required: true,
    },
    name: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    phone: String,
    description: String,
    category: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Restaurant", restaurantSchema);
