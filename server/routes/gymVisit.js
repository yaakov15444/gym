const express = require("express");
const router = express.Router();
const { checkInUser, getVisitsSummary } = require("../controllers/gymVisitController");
// נתיב GET להוספת כניסה
router.get("/summary", getVisitsSummary);

router.get("/:userId", checkInUser);


module.exports = router;
