const { signup, login, getUser, logout, getAllUsers, deleteUser, getUserById, isLoggedIn, getAllUserCourses, changePassword, loginWithGoogle } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddlewareAdmin = require("../middleware/adminMiddlewareAdmin");
const express = require("express");
const router = express.Router();

// User routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/google", loginWithGoogle);
router.get("/userInfo", authMiddleware, getUser);
router.post("/logout", logout);
router.get("/isLoggedIn", isLoggedIn);
router.get("/allUserCourses/:id", getAllUserCourses);
router.post("/changePassword", changePassword);
// Admin routes
const adminRouter = express.Router();
adminRouter.use(authMiddleware, adminMiddlewareAdmin);

adminRouter.get("/:id", getUserById);
adminRouter.get("/allUsers", getAllUsers);
adminRouter.delete("/:id", deleteUser);
router.use("/admin", adminRouter);


module.exports = router