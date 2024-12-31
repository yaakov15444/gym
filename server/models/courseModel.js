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
      type: String,
      required: true,
    },
    participants: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      validate: [
        function (val) {
          return val.length <= this.maxParticipants;
        },
        "{PATH} exceeds the maximum number of participants",
      ],
    },
    image: {
      // שדה חדש לתמונה
      type: String,
      required: false,
    },
    maxParticipants: {
      type: Number,
      required: true,
      default: 20, // ערך ברירת מחדל
      min: 1, // מינימום של משתתף אחד
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
    versionKey: false // ביטול מעקב גרסה
  }
);
courseSchema.virtual("isAvailable").get(function () {
  return this.maxParticipants > this.participants.length;
});
module.exports = mongoose.model("Course", courseSchema);
