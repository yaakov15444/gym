const jwt = require("jsonwebtoken");
const { secret_key } = require("../secrets/dotenv");
const decodeToken = (token) => {
    try {
        const cleanToken = token.startsWith("bearer ") ? token.split(" ")[1] : token;
        const decoded = jwt.verify(cleanToken, secret_key);
        return { valid: true, decoded };
    } catch (error) {
        console.log(error);
        return { valid: false, error: error.message };
    }
}

module.exports = decodeToken