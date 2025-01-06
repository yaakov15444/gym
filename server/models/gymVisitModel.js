const mongoose = require("mongoose");

const gymVisitSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    checkInTime: {
        type: Date,
        default: () => {
            const now = new Date();
            return new Date(now.toLocaleString("en-US", { timeZone: "Asia/Jerusalem" }));
        },
    },
});

module.exports = mongoose.model("GymVisit", gymVisitSchema);
