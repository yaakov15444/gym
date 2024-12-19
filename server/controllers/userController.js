const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const generateToken = require("../utils/generateToken");
const AppError = require("../utils/handleError");


const ctrl = {
    async signup(req, res, next) {
        try {
            const { name, email, password, phone } = req.body;
            if (!name || !email || !password || !phone) {
                console.log("All fields are required");
                return next(new AppError("All fields are required", 400));
            }
            const existingUser = await userModel.findOne({ email });
            const hashedPassword = await bcrypt.hash(password, 10);
            if (existingUser) {
                console.log("User already exists");
                return next(new AppError("User already exists", 400));
            }

            const user = await userModel.create({ name, email, phone, password: hashedPassword });


            if (!user) {
                console.log("User registration failed");
                return next(new AppError("User registration failed", 500));
            }
            res.status(201).json({ user, message: "User registered successfully" });

        }

        catch (error) {
            console.log(error);
            next(new AppError("Internal server error", 500, error));
        }
    },
    async login(req, res, next) {
        try {
            const user = await userModel.findOne({ email: req.body.email });
            if (!user) {
                console.log("User not found");
                return next(new AppError("User not found", 404));
            }
            const isMatch = await bcrypt.compare(req.body.password, user.password);
            if (!isMatch) {
                console.log("Invalid password");
                return next(new AppError("Invalid password", 401));
            }
            const accessToken = generateToken({ _id: user._id, role: user.role }, "30d");
            res.cookie("accessToken", "bearer " + accessToken, { httpOnly: true, secure: false });
            res.status(200).json({ message: "User logged in successfully" });
        } catch (error) {
            console.log(error);
            next(new AppError("Internal server error", 500, error));
        }
    },
    async getUser(req, res, next) {
        try {
            const user = await userModel.findOne({ _id: req.user._id });
            if (!user) {
                console.log("User not found");
                return next(new AppError("User not found", 404));
            }
            res.status(200).json(user);
        } catch (error) {
            console.log(error);
            next(new AppError("Internal server error", 500, error));
        }
    },
    async logout(req, res, next) {
        try {
            res.clearCookie("accessToken");
            console.log("User logged out successfully");
            res.status(200).json({ message: "User logged out successfully" });
        } catch (error) {
            console.log(error);
            next(new AppError("Internal server error", 500, error));
        }
    },
    async getAllUsers(req, res, next) {
        try {
            const users = await userModel.find({});
            res.status(200).json(users);
        } catch (error) {
            console.log(error);
            next(new AppError("Internal server error", 500, error));
        }
    },
    async getUserById(req, res, next) {
        try {
            const { id } = req.params;
            const user = await userModel.findOne({ _id: id });
            if (!user) {
                console.log("User not found");
                return next(new AppError("User not found", 404));
            }
            res.status(200).json(user);
        } catch (error) {
            console.error(error);
            next(new AppError("Internal server error", 500, error));
        }
    },
    async deleteUser(req, res, next) {
        try {
            const user = await userModel.findByIdAndDelete(req.params.id);
            if (!user) {
                console.log("User not found");
                return next(new AppError("User not found", 404));
            }
            res.status(200).json({ message: "User deleted successfully" });
        } catch (error) {
            console.log(error);
            next(new AppError("Internal server error", 500, error));
        }
    },
    async isLoggedIn(req, res) {
        try {
            const token = req.cookies.accessToken;
            if (!token) {
                console.log("Token not found");
                return res.status(200).json({ isLoggedIn: false });
            }
            const { valid } = decodeToken(token);
            if (!valid) {
                return (res.status(200).json({ isLoggedIn: false }));
            }
            return res.status(200).json({ isLoggedIn: true });
        } catch (error) {
            console.log(error);
            next(new AppError("Internal server error", 500, error));
        }
    },
    async changePassword(req, res, next) {
        try {
            const { currentPassword, newPassword } = req.body;
            if (!currentPassword || !newPassword) {
                return next(new AppError("All fields are required", 400));
            }
            const user = await userModel.findById(req.user._id);
            if (!user) {
                console.log("User not found");
                return next(new AppError("User not found", 404));
            }
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                console.log("Invalid password");
                return next(new AppError("Invalid password", 401));
            }
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            await user.save();
        } catch (error) {
            console.log(error);
            next(new AppError("Internal server error", 500, error));
        }
    },
    async getAllUserCourses(req, res, next) {
        try {

            const user = await userModel.findById(req.user._id).populate('enrolledCourses');
            if (!user) {
                console.log("User not found");
                return next(new AppError("User not found", 404));
            }
            const courses = user.enrolledCourses;
            res.status(200).json(courses);
        } catch (error) {
            console.log(error);
            next(new AppError("Internal server error", 500, error));
        }
    }
}

module.exports = ctrl