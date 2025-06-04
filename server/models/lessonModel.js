const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  coach: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  startDateTime: {
    type: Date,
    required: true,
  },
  endDateTime: {
    type: Date,
    required: true,
  },
  participants: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      attended: { type: Boolean, default: true },
    },
  ],
  participantsLimit: {
    type: Number,
    required: true,
  },
  waitingList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  waitingListLimit: {
    type: Number,
  },
  status: {
    type: String,
    enum: ["active", "rescheduled", "canceled", "finished"],
    default: "active",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});
lessonSchema.index({ "participants.user": 1 });
module.exports = mongoose.model("Lesson", lessonSchema);
