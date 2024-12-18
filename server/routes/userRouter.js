const { signup, login, getUser, logout, getAllUsers, deleteUser, getUserById, isLoggedIn } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddlewareAdmin = require("../middleware/adminMiddlewareAdmin");
const express = require("express");
const router = express.Router();

// User routes
router.post("/signup", signup);
router.post("/login", login);
router.get("/userInfo", authMiddleware, getUser);
router.post("/logout", logout);
router.get("/isLoggedIn", isLoggedIn);

// Admin routes
const adminRouter = express.Router();
adminRouter.use(authMiddleware, adminMiddlewareAdmin);

adminRouter.get("/:id", getUserById);
adminRouter.get("/allUsers", getAllUsers);
adminRouter.delete("/:id", deleteUser);
router.use("/admin", adminRouter);


module.exports = router