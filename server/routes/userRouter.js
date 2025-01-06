const {
  signup,
  login,
  getUser,
  logout,
  getAllUsers,
  toggleActivation,
  getUserById,
  isLoggedIn,
  getAllUserCourses,
  changePassword,
  loginWithGoogle,
  getUserStatistics,
  updateProfileImage,
  verifyEmail,
  forgotPassword,
  verifyResetToken,
  updatePassword,

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
router.get("/verify-email/", verifyEmail);
router.post("/forgotPassword", forgotPassword);
router.get("/resetPassword", verifyResetToken);
router.post("/updatePassword", updatePassword);
// Admin routes
const adminRouter = express.Router();
adminRouter.use(authMiddleware, adminMiddlewareAdmin);

adminRouter.get("/allUsers", getAllUsers);
adminRouter.get("/statistics", getUserStatistics);
adminRouter.get("/:id", getUserById);
adminRouter.delete("/:id", toggleActivation);
router.use("/admin", adminRouter);

module.exports = router;
