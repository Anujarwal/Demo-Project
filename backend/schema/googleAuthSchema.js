const mongoose = require("mongoose");

const googleAuthSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      required: [true, "Google ID is required "],
    },
    displayName: {
      type: String,
      required: [true, "Display Name is required "],
    },
    email: {
      type: String,
      required: [true, "Email is required "],
    },
    image: {
      type: String,
      required: false,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("GoogleUser", googleAuthSchema);
