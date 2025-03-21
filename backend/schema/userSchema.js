const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please Add firstName"],
    },
    lastName: {
      type: String,
      required: [true, "Please Add lastName"],
    },
    gender: {
      type: String,
      required: [true, "please Add gender"],
    },
    email: {
      type: String,
      required: [true, "please Add email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "please Add password"],
    },
    city: {
      type: String,
      required: [true, "please Add city"],
    },
    state: {
      type: String,
      required: [true, "please Add state"],
    },
    zip: {
      type: String,
      required: [true, "please Add zip"],
    },
    country: {
      type: String,
      required: [true, "please Add country"],
    },
    interests: {
      type: [String],
      required: [true, "please Add interests"],
      enum: ["Reading", "Writing", "Traveling", "Playing"],
    },
    profilePicture: {
      type: String,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
