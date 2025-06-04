const { createCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    checkAvailability,
    getCourseStatistics,
    toggleUserInCourse,
    deleteCourse
} = require("../controllers/courseController");
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddlewareAdmin = require("../middleware/adminMiddlewareAdmin");

// user routes
router.get("/all", getAllCourses);
router.get("/:id", getCourseById);
router.post("/availability", checkAvailability);
router.patch("/toggle/:courseId", authMiddleware, toggleUserInCourse);
// admin routes
const adminRouter = express.Router();
adminRouter.use(authMiddleware, adminMiddlewareAdmin);
adminRouter.post("/create", createCourse);
adminRouter.put("/update/:id", updateCourse);
adminRouter.get("/statistics", getCourseStatistics);
adminRouter.delete("/delete/:id", deleteCourse);
router.use("/admin", adminRouter);
module.exports = router