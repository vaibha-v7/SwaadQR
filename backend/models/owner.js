const mongoose = require("mongoose");

const ownerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    phone_no: {
      type: String,
      required: true,
      unique: true
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },

    emailToken: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Owner", ownerSchema);
