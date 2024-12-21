const adminMiddleware = (req, res, next) => {
    if (req.user && req.user.role === "Admin") {
        next();
    } else {
        res.status(403).json({ message: "Forbidden: Admin access only" });
    }
};

module.exports = adminMiddleware;
