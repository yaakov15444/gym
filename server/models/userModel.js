const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: Number,
    default: 1,
  },
  gymSubscriptionValidUntil: {
    type: Date,
    default: null,
  },
  purchasedCourses: [
    {
      course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
      accessUntil: { type: Date, required: true },
    },
  ],
  profileImageUrl: {
    type: String,
    default: null,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("User", userSchema);
