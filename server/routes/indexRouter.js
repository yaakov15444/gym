const userRouter = require("./userRouter");
const courseRouter = require("./courseRouter");
const packageRouter = require("./packageRouter");
const announcementRoutes = require('./announcementRoutes');
const express = require("express");
const router = express.Router();
router.use("/users", userRouter);
router.use("/courses", courseRouter);
router.use("/packages", packageRouter);
router.use("/announcements", announcementRoutes);
router.use((err, req, res, next) => {
    err.print()
    res.status(err.status).json(err)
})
module.exports = router