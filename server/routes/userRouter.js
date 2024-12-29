const {
  signup,
  login,
  getUser,
  logout,
  getAllUsers,
  deleteUser,
  getUserById,
  isLoggedIn,
  getAllUserCourses,
  changePassword,
  loginWithGoogle,
  getUserStatistics,
  updateProfileImage
} = require("../controllers/userController");
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
router.patch("/updateProfileImage", authMiddleware, updateProfileImage);
// Admin routes
const adminRouter = express.Router();
adminRouter.use(authMiddleware, adminMiddlewareAdmin);

adminRouter.get("/allUsers", getAllUsers);
adminRouter.get("/statistics", getUserStatistics);
adminRouter.get("/:id", getUserById);
adminRouter.delete("/:id", deleteUser);
router.use("/admin", adminRouter);

module.exports = router;
