const express = require("express");
const GymVisit = require("../models/gymVisitModel"); // מודל הכניסה
const router = express.Router();
const AppError = require("../utils/handleError");
const User = require("../models/userModel");
const gymVisitCtrl = {
    async checkInUser(req, res, next) {
        try {
            console.log("Received check-in request");

            // מקבל את מזהה המשתמש מהטוקן
            const { userId } = req.params;
            if (!userId) {
                return next(new AppError("User ID is required", 400));
            }
            const user = await User.findById(userId);
            if (!user) {
                return next(new AppError("User not found", 404));
            }
            const lastVisit = await GymVisit.findOne({ userId }).sort({ checkInTime: -1 });
            if (lastVisit) {
                const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
                if (lastVisit.checkInTime > oneHourAgo) {
                    return res.status(400).send(
                        ` <div style="text-align: center; padding: 20px; font-family: Arial; color: red;">
                            <h1 style="font-size: 60px; font-weight: bold; text-align: center; color: red;">Check-In Already Done</h1>
                            <p style="font-size: 30px; text-align: center; color: black;">You have already checked in within the last hour.</p>
                            <p><strong>Last Check-In:</strong> ${new Date(lastVisit.checkInTime).toLocaleTimeString()}</p>
                        </div>`
                    );
                }
            }
            const gymVisit = new GymVisit({ userId });
            await gymVisit.save();

            res.status(200).send(`
                <div style="text-align: center; padding: 20px; font-family: Arial; color: green;">
                <h1 style="font-size: 60px; font-weight: bold; text-align: center; color: green;">Check-In Successful</h1>
                <p style="font-size: 30px; text-align: center; color: black;">You have successfully checked into the gym!</p>
                </div>
            `);
        } catch (error) {
            console.error("Error during check-in:", error);
            next(new AppError("Failed to check-in", 500));
        }
    },
    async getVisitsSummary(req, res, next) {
        try {
            // קיבוץ ביקורים לפי שעה
            const visitsSummary = await GymVisit.aggregate([
                {
                    $project: {
                        hour: { $hour: "$checkInTime" },
                    },
                },
                {
                    $group: {
                        _id: "$hour",
                        count: { $sum: 1 },
                    },
                },
                {
                    $sort: { _id: 1 }, // מיון לפי השעה
                },
            ]);

            res.status(200).json(visitsSummary);
        } catch (error) {
            console.error("Error fetching visits summary:", error);
            next(new AppError("Failed to fetch visits summary", 500));
        }
    },
}
module.exports = gymVisitCtrl