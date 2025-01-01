const QRCode = require("qrcode");
const { base_url_client } = require("../secrets/dotenv");
// פונקציה ליצירת QR Code
async function createQRCode() {
    try {
        const url = `https://gym-one-gray.vercel.app/phoneLogin`;
        console.log(url);

        // יצירת ה-QR Code
        const qrCode = await QRCode.toDataURL(url);
        console.log(qrCode);

        return qrCode; // מחזיר את ה-QR Code כ-Data URL
    } catch (error) {
        console.error("Error creating QR Code:", error);
        throw new Error("Failed to create QR Code");
    }
}
module.exports = createQRCode;
