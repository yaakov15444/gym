const dotenv = require('dotenv');
dotenv.config({ path: '.env' });
const secrets = {
    port: process.env.PORT,
    uri: process.env.MONGO_URI,
    secret_key: process.env.SECRET_KEY,
    myEmail: process.env.EMAIL_USER,
    email_password: process.env.EMAIL_PASS,
    paypal_client_id: process.env.PAYPAL_CLIENT_ID,
    paypal_secret: process.env.PAYPAL_SECRET,
    paypal_cancel_url: process.env.PAYPAL_CANCEL_URL,
    paypal_success_url: process.env.PAYPAL_SUCCESS_URL
}

module.exports = secrets