const express = require("express");
const router = express.Router();
const { checkInUser } = require("../controllers/gymVisitController");
const authMiddleware = require("../middleware/authMiddleware");
// נתיב GET להוספת כניסה
router.get("/", authMiddleware, checkInUser);

module.exports = router;
