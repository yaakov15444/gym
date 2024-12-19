const express = require("express");
const router = express.Router();
const { getAllPackages, purchasePackage, getPackageById } = require("../controllers/packageController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", getAllPackages);
router.post("/purchase", purchasePackage);
router.get("/:id", getPackageById);
module.exports = router;

