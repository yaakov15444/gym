const jwt = require("jsonwebtoken");
const { secret_key } = require("../secrets/dotenv");

const generateToken = (payload, expires) => {
    return jwt.sign(payload, secret_key, { expiresIn: expires })
}

module.exports = generateToken