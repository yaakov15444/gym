const express = require("express");
const router = express.Router();
const { checkInUser, getVisitsSummary } = require("../controllers/gymVisitController");
// נתיב GET להוספת כניסה
router.get("/:userId", checkInUser);

router.get("/summary", getVisitsSummary);



module.exports = router;
