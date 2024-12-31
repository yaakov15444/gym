const mongoose = require("mongoose");

const gymVisitSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    checkInTime: {
        type: Date,
        default: Date.now, // ברירת מחדל: זמן נוכחי
    },
});

module.exports = mongoose.model("GymVisit", gymVisitSchema);
