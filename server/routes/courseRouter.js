const { createCourse, getAllCourses, getCourseById, updateCourse, deleteCourse, enrollInCourse, unenrollFromCourse, checkAvailability } = require("../controllers/courseController");
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddlewareAdmin = require("../middleware/adminMiddlewareAdmin");

// user routes
router.get("/all", getAllCourses);
router.get("/:id", getCourseById);
router.post("/enroll", authMiddleware, enrollInCourse);
router.post("/unenroll", authMiddleware, unenrollFromCourse);
router.post("/availability", checkAvailability);

// admin routes
const adminRouter = express.Router();
adminRouter.use(authMiddleware, adminMiddlewareAdmin);
adminRouter.post("/create", createCourse);
adminRouter.put("/update/:id", updateCourse);
adminRouter.delete("/delete/:id", deleteCourse);
router.use("/admin", adminRouter);
module.exports = router