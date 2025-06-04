const os = require("os");
const QRCode = require("qrcode");
const { server_address } = require("../secrets/dotenv");
// פונקציה למציאת כתובת ה-IP של המחשב
function getLocalIPAddress() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === "IPv4" && !iface.internal) {
                return iface.address; // כתובת ה-IP
            }
        }
    }
    return "localhost"; // fallback אם לא נמצא IP
}
function getServerAddress() {
    // משתמשים בכתובת מ-ENV לפרודקשן או בכתובת מקומית
    return server_address || `${getLocalIPAddress()}:3000`;
}
// פונקציה ליצירת QR Code
async function createQRCode(userId) {

    try {
        const serverAddress = getServerAddress(); // מציאת כתובת השרת
        const url = `http://${serverAddress}/gymVisit/${userId}`; // יצירת ה-URL

        // יצירת ה-QR Code
        const qrCode = await QRCode.toDataURL(url);

        return qrCode; // מחזיר את ה-QR Code כ-Data URL
    } catch (error) {
        console.error("Error creating QR Code:", error);
        throw new Error("Failed to create QR Code");
    }
}

module.exports = createQRCode;
