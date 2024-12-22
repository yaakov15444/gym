const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    coach: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coach",
      required: true,
    },
    participants: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      validate: [arrayLimit, "{PATH} exceeds the limit of 10 participants"],
    },
    image: {
      // שדה חדש לתמונה
      type: String,
      required: false,
    },
    schedule: [
      {
        day: {
          type: String,
          required: true,
          enum: [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ],
        },
        startTime: {
          type: Date, // שעת התחלה בפורמט Date
          required: true,
        },
        endTime: {
          type: Date, // שעת סיום בפורמט Date
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
function arrayLimit(val) {
  return val.length <= 10;
}
courseSchema.virtual("currentParticipants").get(function () {
  return this.participants.length;
});

courseSchema.virtual("availableSlots").get(function () {
  return 10 - this.participants.length;
});
module.exports = mongoose.model("Course", courseSchema);
