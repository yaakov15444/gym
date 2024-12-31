const decodeToken = require("../utils/decodeToken");
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken;
        if (!token) {
            console.log("Token not found");
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { valid, decoded } = decodeToken(token);
        if (!valid) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        req.user = decoded;

        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}
module.exports = authMiddleware