const paypal = require('@paypal/checkout-server-sdk');
const { paypal_client_id, paypal_secret } = require('../secrets/dotenv');

const environment = new paypal.core.SandboxEnvironment(paypal_client_id, paypal_secret);
const client = new paypal.core.PayPalHttpClient(environment);

const createPayment = async (amount, currency, successUrl, cancelUrl) => {
    try {
        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer("return=representation");
        request.requestBody({
            intent: "CAPTURE",
            purchase_units: [{ amount: { currency_code: currency, value: amount.toString() } }],
            application_context: { cancel_url: cancelUrl, return_url: successUrl },
        });

        const response = await client.execute(request);
        const approvalUrl = response.result.links.find(link => link.rel === 'approve').href;

        return { status: 'pending', approvalUrl, paymentId: response.result.id };
    } catch (error) {
        console.error("Error creating payment:", error);
        throw new Error("Payment creation failed");
    }
};

const capturePayment = async (paymentId) => {
    try {
        const request = new paypal.orders.OrdersCaptureRequest(paymentId);
        request.requestBody({});
        const response = await client.execute(request);

        if (response.result.status !== 'COMPLETED') {
            throw new Error("Payment capture failed");
        }

        return { status: 'success', details: response.result };
    } catch (error) {
        console.error("Error capturing payment:", error);
        throw new Error("Payment capture failed");
    }
};

module.exports = { createPayment, capturePayment };
