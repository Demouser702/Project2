const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  height: {
    type: Number,
    min: 80,
    max: 220,
    default: null,
  },
  currentWeight: {
    type: Number,
    min: 40,
    max: 220,
    default: null,
  },
  targetWeight: {
    type: Number,
    min: 40,
    max: 220,
    default: null,
  },
  age: {
    type: Number,
    min: 16,
    max: 60,
    default: null,
  },
  avatarURL: {
    type: String,
  },
  bloodType: {
    type: Number,
    enum: [1, 2, 3, 4],
    default: 1,
  },
  token: {
    type: String,
    default: null,
  },

  dailyRate: {
    type: Number,
    default: null,
  },
  verify: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    required: [true, "Verify token is required"],
  },
  notRecProducts: {
    type: Array,
    default: [],
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
