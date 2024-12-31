const userModel = require("../models/userModel");

const verifyUser = async () => {
    try {
        const userId = "67627105be6dfab6a4039947"; // מזהה המשתמש
        const verifiedUser = await userModel.findByIdAndUpdate(
            userId,
            { isEmailVerified: true },
            { new: true } // מחזיר את המשתמש המעודכן
        );

        if (!verifiedUser) {
            console.log(`User with ID ${userId} not found`);
        } else {
            console.log(`User with ID ${userId} successfully verified:`, verifiedUser);
        }
    } catch (error) {
        console.error("Error verifying user:", error.message);
    }
};

module.exports = verifyUser;
