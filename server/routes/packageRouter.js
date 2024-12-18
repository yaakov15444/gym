const express = require("express");
const router = express.Router();
const { getAllPackages, purchasePackage } = require("../controllers/packageController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", getAllPackages);
router.post("/purchase", purchasePackage);

module.exports = router;

