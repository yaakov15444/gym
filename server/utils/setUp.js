const setAdmin = require("./adminSetup");
require("../db/connectToMongo");
const email = "yakov15444@gmail.com";
const stratSetup = async () => {
    await setAdmin(email, "User");
}
stratSetup();
