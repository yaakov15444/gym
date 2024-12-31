const express = require("express");
const GymVisit = require("../models/gymVisitModel"); // מודל הכניסה
const router = express.Router();
const AppError = require("../utils/handleError");
const User = require("../models/userModel");
const { checkInUser } = require("../controllers/gymVisitController");
// נתיב GET להוספת כניסה
router.get("/:userId", checkInUser);

module.exports = router;
