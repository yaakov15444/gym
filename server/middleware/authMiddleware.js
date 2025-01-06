const decodeToken = require("../utils/decodeToken");
const userModel = require("../models/userModel");
const AppError = require("../utils/handleError");
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken;
        if (!token) {
            console.log("Token not found");
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { valid, decoded } = decodeToken(token);
        if (!valid) {
            return next(new AppError("Invalid token", 401));
        }
        const user = await userModel.findById(decoded._id);
        if (!user || !user.isActive) {
            return next(new AppError("User not found", 404));
        }

        req.user = decoded;

        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}
module.exports = authMiddleware