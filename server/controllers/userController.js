const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const generateToken = require("../utils/generateToken");
const AppError = require("../utils/handleError");
const createQRCode = require("../jobs/createQRCode");
const { sendEmail } = require('../services/emailService');
const jwt = require("jsonwebtoken");
const { secret_key, base_url_server, base_url_client, node_env, delete_course_password } = require("../secrets/dotenv");

const ctrl = {
  async signup(req, res, next) {
    try {
      const { name, email, password, phone } = req.body;
      if (!name || !email || !password) {
        console.log("All fields are required");
        return next(new AppError("All fields are required", 400));
      }
      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        if (!existingUser.isEmailVerified) {
          // אם המייל לא אומת, מחק את המשתמש הקודם
          console.log("Deleting unverified user");
          await userModel.deleteOne({ _id: existingUser._id });
        } else {
          console.log("User already exists and is verified");
          return next(new AppError("User already exists", 400));
        }
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await userModel.create({
        name,
        email,
        phone,
        password: hashedPassword,
      });

      if (!user) {
        console.log("User registration failed");
        return next(new AppError("User registration failed", 500));
      }
      const token = jwt.sign(
        { userId: user._id },
        secret_key,
        { expiresIn: '24h' }
      );
      const verificationLink = `${base_url_server}/users/verify-email?token=${token}`;
      const subject = "Email Verification";
      const text = "Please verify your email address.";
      const html = `
            <h1>Email Verification</h1>
            <p>Click the link below to verify your email address:</p>
            <a href="${verificationLink}">${verificationLink}</a>
        `;
      await sendEmail(user.email, subject, text, html);
      res.status(201).json({ user, message: "User registered successfully" });
    } catch (error) {
      console.log(error);
      next(new AppError("Internal server error", 500, error));
    }
  },
  async login(req, res, next) {
    try {
      console.log("Login request received");

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
      if (user.isEmailVerified === false) {
        console.log("Email not verified");
        return next(new AppError("Email not verified", 401));
      }
      const accessToken = generateToken(
        { _id: user._id, role: user.role },
        "30d"
      );
      res.cookie("accessToken", "bearer " + accessToken, {
        httpOnly: true,
        secure: node_env === "production", // חובה בפרודקשן
        sameSite: node_env === "production" ? "none" : "lax",
        maxAge: 1000 * 60 * 60 * 24 * 30, // תוקף של 30 ימים
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      });
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
      const qrCode = await createQRCode(user._id);

      userWithQr = {
        ...user.toObject(), // המרה לאובייקט JSON רגיל
        qrCode, // הוספת המפתח החדש
      };
      res.status(200).json(userWithQr);
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
      const users = await userModel.find().populate({
        path: "package",
        select: "name",
      });
      if (!users || users.length === 0) {
        console.log("No users found");
        return next(new AppError("No users found", 404));
      }
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
  async toggleActivation(req, res, next) {
    try {
      const user = await userModel.findById(req.params.id);
      if (!user) {
        console.log("User not found");
        return next(new AppError("User not found", 404));
      }
      user.isActive = !user.isActive;
      await user.save();
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
        return res.status(200).json({ isLoggedIn: false });
      }
      return res.status(200).json({ isLoggedIn: true });
    } catch (error) {
      console.log(error);
      next(new AppError("Internal server error", 500, error));
    }
  },
  async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword, email } = req.body;
      if (!currentPassword || !newPassword) {
        return next(new AppError("All fields are required", 400));
      }
      const user = await userModel.findOne({ email });
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
      console.log("Password changed successfully");

      res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
      console.log(error);
      next(new AppError("Internal server error", 500, error));
    }
  },
  async getAllUserCourses(req, res, next) {
    try {
      const { id } = req.params;
      const user = await userModel.findById(id).populate("enrolledCourses");
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
  },
  async loginWithGoogle(req, res, next) {
    try {
      const { email } = req.body;
      console.log(email);

      if (!email) {
        console.log("Email not provided");
        return next(new AppError("Email is required", 400));
      }
      const user = await userModel.findOne({ email });
      if (!user) {
        console.log("User not found");
        return next(new AppError("User not found", 404));
      }
      const accessToken = generateToken(
        { _id: user._id, role: user.role },
        "30d"
      );
      res.cookie("accessToken", "bearer " + accessToken, {
        httpOnly: true,
        secure: node_env === "production", // חובה בפרודקשן
        sameSite: node_env === "production" ? "none" : "lax",
        maxAge: 1000 * 60 * 60 * 24 * 30, // תוקף של 30 ימים
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      });
      console.log("User logged in successfully");

      res.status(200).json({ message: "User logged in successfully" });
    } catch (error) {
      console.log(error);
      next(new AppError("Internal server error", 500, error));
    }
  },
  async getUserStatistics(req, res, next) {
    try {
      // כמות משתמשים לפי תפקיד
      const rolesCount = await userModel.aggregate([
        { $group: { _id: "$role", count: { $sum: 1 } } }
      ]);

      // מנויים פעילים
      const activeSubscriptions = await userModel.countDocuments({
        subscriptionEndDate: { $gte: new Date() }
      });

      // משתמשים ללא מנוי
      const noSubscription = await userModel.countDocuments({
        $or: [
          { subscriptionStartDate: { $exists: false } },
          { subscriptionEndDate: { $exists: false } }
        ]
      });

      // משתמשים לכל חבילה
      const packageStats = await userModel.aggregate([
        { $group: { _id: "$package", count: { $sum: 1 } } }
      ]);

      // משתמשים הרשומים לקורסים
      const enrolledUsers = await userModel.countDocuments({
        enrolledCourses: { $exists: true, $ne: [] }
      });

      // משתמשים ללא קורסים
      const noCourses = await userModel.countDocuments({
        enrolledCourses: { $exists: true, $size: 0 }
      });

      // משתמשים עם מנוי שפג תוקף
      const expiredSubscriptions = await userModel.countDocuments({
        subscriptionEndDate: { $lt: new Date() }
      });

      res.status(200).json({
        totalUsers: await userModel.countDocuments(),
        rolesCount,
        activeSubscriptions,
        noSubscription,
        packageStats,
        enrolledUsers,
        noCourses,
        expiredSubscriptions,
      });
    } catch (error) {
      console.error("Error fetching user statistics:", error);
      next(new AppError("Internal server error", 500, error));
    }
  },
  async updateProfileImage(req, res, next) {
    try {
      const { profileImage } = req.body;

      if (!profileImage) {
        return next(new AppError("Profile image URL is required", 400));
      }

      const user = await userModel.findById(req.user._id);
      if (!user) {
        return next(new AppError("User not found", 404));
      }

      user.profileImageUrl = profileImage; // עדכון שדה התמונה במודל
      await user.save();

      res.status(200).json({
        message: "Profile image updated successfully",
        profileImage: user.profileImageUrl,
      });
    } catch (error) {
      console.error("Error updating profile image:", error);
      next(new AppError("Internal server error", 500, error));
    }
  },
  async verifyEmail(req, res, next) {
    try {
      const { token } = req.query;

      if (!token) {
        console.log("Token is missing");
        return next(new AppError("Token is required", 400));
      }

      // אימות הטוקן
      const decoded = jwt.verify(token, secret_key); // בודק את התוקף של הטוקן
      const { userId } = decoded;

      // חיפוש המשתמש בבסיס הנתונים
      const user = await userModel.findById(userId);
      if (!user) {
        console.log("User not found");
        return next(new AppError("User not found", 404));
      }

      if (user.isEmailVerified) {
        console.log("Email is already verified");
        return res.status(200).send(`
                <h1 style="text-align: center; color: green;">Email Already Verified</h1>
                <p style="text-align: center;">You have already verified your email address.</p>
                  <div style="text-align: center; margin-top: 20px;">
        <a href="${base_url_client}/Login" 
           style="display: inline-block; padding: 10px 20px; background-color: blue; color: white; text-decoration: none; font-size: 16px; border-radius: 5px;">
           Go to Login
        </a>
    </div>
            `);
      }

      // עדכון השדה isEmailVerified
      user.isEmailVerified = true;
      await user.save();

      res.status(200).send(`
            <h1 style="text-align: center; color: green;">Email Verified Successfully</h1>
            <p style="text-align: center;">Thank you for verifying your email address. You can now log in.</p>
              <div style="text-align: center; margin-top: 20px;">
        <a href= "${base_url_client}/Login"
           style="display: inline-block; padding: 10px 20px; background-color: blue; color: white; text-decoration: none; font-size: 16px; border-radius: 5px;">
           Go to Login
        </a>
    </div>
        `);
    } catch (error) {
      console.error("Error verifying email:", error);
      next(new AppError("Invalid or expired token", 400));
    }
  },
  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;

      if (!email) {
        console.log("Email is required");
        return next(new AppError("Email is required", 400));
      }

      // חיפוש המשתמש לפי אימייל
      const user = await userModel.findOne({ email });
      if (!user) {
        console.log("User not found");
        return next(new AppError("User not found", 404));
      }

      // יצירת טוקן לשחזור סיסמה
      const resetToken = jwt.sign({ userId: user._id }, secret_key, { expiresIn: "1h" });

      // יצירת קישור לשחזור סיסמה
      const resetLink = `${base_url_server}/users/resetPassword?token=${resetToken}`;

      // שליחת מייל למשתמש
      const subject = "Password Reset Request";
      const text = "You requested to reset your password.";
      const html = `
            <h1>Password Reset Request</h1>
            <p>Click the link below to reset your password:</p>
            <a href="${resetLink}">${resetLink}</a>
        `;
      await sendEmail(user.email, subject, text, html);

      res.status(200).json({ message: "Password reset email sent successfully" });
    } catch (error) {
      console.error("Error during password reset request:", error);
      next(new AppError("Failed to send password reset email", 500));
    }
  },
  async verifyResetToken(req, res, next) {
    try {
      const { token } = req.query;

      if (!token) {
        console.log("Token is required");
        return next(new AppError("Token is required", 400));
      }
      const { userId } = jwt.verify(token, secret_key);
      const user = await userModel.findById(userId);
      if (!user) {
        return next(new AppError("User not found", 404));
      }
      const resetPasswordUrl = `${base_url_client}/updatePassword?token=${token}`;
      res.redirect(resetPasswordUrl);
    } catch (error) {
      console.error("Invalid or expired token:", error);
      next(new AppError("Invalid or expired token", 400));
    }
  },
  async updatePassword(req, res, next) {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return next(new AppError("Token and new password are required", 400));
    }

    try {
      // 1. Verify the token
      const decoded = jwt.verify(token, secret_key);
      const userId = decoded.userId;

      // 2. Find the user in the database
      const user = await userModel.findById(userId);
      if (!user) {
        return next(new AppError("User not found", 404));
      }

      // 3. Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // 4. Update the user's password
      user.password = hashedPassword;
      await user.save();

      // 5. Send success response
      res.status(200).json({ message: "Password updated successfully." });
    } catch (error) {
      console.error("Error updating password:", error);
      res.status(500).json({ message: "An error occurred while updating the password." });
    }
  }




};

module.exports = ctrl;
