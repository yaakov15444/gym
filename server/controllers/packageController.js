const packageModel = require('../models/packageModel');
const userModel = require('../models/userModel');
const courseModel = require('../models/courseModel');
const AppError = require('../utils/handleError');
const { sendEmail } = require('../services/emailService');
const { createPayment, capturePayment } = require('../services/paymentService');
const { text } = require('express');
const packageController = {
    async getAllPackages(req, res, next) {
        try {
            const packages = await packageModel.find({});
            res.status(200).json(packages);
        } catch (error) {
            console.error("Error fetching packages:", error);
            next(new AppError("Internal server error", 500));
        }
    },

    async purchasePackage(req, res, next) {
        try {
            const { packageId, userId, selectedCourseId, paymentId } = req.body;

            // מציאת החבילה והמשתמש
            const package = await packageModel.findById(packageId);
            const user = await userModel.findById(userId);
            if (user.package && user.package.toString() === packageId) {
                return next(new AppError("You have already purchased this package.", 400));
            }

            if (!package || !user) {
                console.log("Package or user not found");
                return next(new AppError("Package or user not found", 404));
            }

            // שלב 1: אם אין Payment ID, מתחילים תשלום
            if (!paymentId) {
                const successUrl = `http://localhost:5173/success?packageId=${packageId}&userId=${userId}&courseId=${selectedCourseId}`; const cancelUrl = `http://localhost:5173/cancel`;

                const paymentResult = await createPayment(
                    package.price,
                    'ILS',
                    successUrl,
                    cancelUrl
                );

                return res.status(200).json({
                    message: "Redirect to PayPal for payment.",
                    approvalUrl: paymentResult.approvalUrl,
                    paymentId: paymentResult.paymentId,
                });
            }
            console.log(paymentId);

            // שלב 2: אם יש Payment ID, מבצעים CAPTURE
            const captureResult = await capturePayment(paymentId);
            if (captureResult.status !== 'success') {
                console.error('Payment capture failed.');
                return next(new AppError('Payment capture failed.', 500));
            }
            console.log(captureResult);

            // שלב 3: עדכון מנוי המשתמש
            const currentDate = new Date();
            const expirationDate = new Date(currentDate);
            expirationDate.setMonth(expirationDate.getMonth() + package.durationInMonths);
            user.subscriptionEndDate = expirationDate;
            user.package = packageId;
            const coursesToEnroll = [];
            if (package.name === "Single Class Package") {
                if (!selectedCourseId) {
                    return next(new AppError("Course not selected", 400));
                }
                const course = await courseModel.findById(selectedCourseId);
                if (!course) {
                    return next(new AppError("Course not found", 404));
                }
                coursesToEnroll.push(course);
            } else {
                const allCourses = await courseModel.find({});
                coursesToEnroll.push(...allCourses.filter(course => !course.participants.includes(user._id)));
            }
            user.enrolledCourses.splice(0, user.enrolledCourses.length);
            await user.save();
            for (const course of coursesToEnroll) {
                course.participants.push(user._id);
                user.enrolledCourses.push(course._id);
                console.log("Saving course:", course._id); // הדפס את הקורס לפני השמירה

                await course.save();
            }
            console.log("Saving user:", user._id); // הדפס את המשתמש לפני השמירה

            await user.save();

            // שליחת מייל אישור רכישה
            const emailData = {
                to: user.email,
                subject: "Purchase Confirmation",
                text,
                html: `
        <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; }
                    .header { color: #222222; font-size: 24px; }
                    .content { background-color: #f4f4f4; padding: 20px; }
                    .footer { font-size: 12px; color: #777777; }
                </style>
            </head>
            <body>
                <div class="content">
                    <h1 class="header">Purchase Confirmation</h1>
                    <p>Dear ${user.name},</p>
                    <p>You have successfully purchased the <strong>${package.name}</strong> package for <strong>${package.durationInMonths} months</strong> at a price of <strong>${package.price} ILS</strong>.</p>
                    <p>Your subscription will end on <strong>${expirationDate.toDateString()}</strong>.</p>
                </div>
                <div class="footer">
                    <p>Thank you for your purchase!</p>
                </div>
            </body>
        </html>
    `,
            };


            await sendEmail(emailData.to, emailData.subject, emailData.text, emailData.html);

            res.status(200).json({
                message: "Package purchased successfully.",
                subscriptionEndDate: expirationDate,
            });
        } catch (error) {
            console.error("Error purchasing package:", error);
            next(new AppError("Internal server error", 500));
        }
    }

};

module.exports = packageController;