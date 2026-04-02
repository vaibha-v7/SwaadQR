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
      required: function () {
        return this.provider !== "google";
      },
      default: null
    },
    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local"
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
      default: null
    },
    phone_no: {
      type: String,
      required: function () {
        return this.provider !== "google";
      },
      unique: true,
      sparse: true,
      default: null
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
