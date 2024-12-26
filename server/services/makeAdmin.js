const User = require("../models/userModel");

const makeAdmin = async (email) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log(`User with email ${email} not found`);
            return;
        }
        user.role = "Admin";
        await user.save();
        console.log(`User with email ${email} setted up as Admin`);
    } catch (error) {
        console.error("Error setting admin:", error);
    }
};

const removeAdmin = async (email) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log(`User with email ${email} not found`);
            return;
        }
        user.role = "User";
        await user.save();
        console.log(`User with email ${email} setted up as User`);
    } catch (error) {
        console.error("Error setting admin:", error);
    }
};

module.exports = { makeAdmin, removeAdmin };