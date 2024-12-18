// utils/adminSetup.js
const userModel = require("../models/userModel");
const setAdmin = async (email, role) => {
    try {

        const user = await userModel.findOne({ email });
        if (!user) {
            console.log(`User with email ${email} not found`);
            return;
        }
        user.role = role;
        await user.save();

        console.log(`User with email ${email} setted up`);
    } catch (error) {
        console.error("Error setting admin:", error);
    }
};

module.exports = setAdmin;
