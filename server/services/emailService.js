const nodemailer = require("nodemailer");
const { myEmail, email_password } = require("../secrets/dotenv");
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: myEmail,
        pass: email_password
    },
    tls: {
        rejectUnauthorized: false // השבתת אימות SSL
    }
});
const sendEmail = async (to, subject, text, html) => {
    const mailOptions = {
        from: myEmail,
        to,
        subject,
        text,
        html
    };
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully", info.response);
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Error sending email");
    }
}

module.exports = { sendEmail };