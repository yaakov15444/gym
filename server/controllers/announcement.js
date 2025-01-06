const Announcement = require('../models/announcement');
const Course = require('../models/courseModel');
const AppError = require('../utils/handleError');
const User = require("../models/userModel");

const ctrlAnnouncement = {
    async createAnnouncement(req, res, next) {
        try {
            const { title, content, courseId, expirationDate } = req.body;

            if (expirationDate && new Date(expirationDate) < new Date()) {
                console.log('Invalid expiration date');
                return next(new AppError('Expiration date must be in the future', 400));
            }

            const announcement = await Announcement.create({
                title,
                content,
                courseId,
                expirationDate: expirationDate || null
            });

            if (!announcement) {
                console.log('Announcement creation failed');
                return next(new AppError('Announcement creation failed', 500));
            }

            res.status(201).json({ announcement, message: 'Announcement created successfully' });
        } catch (error) {
            console.log(error);
            next(new AppError('Internal server error', 500, error));
        }
    },
    async getAllAnnouncements(req, res, next) {
        try {
            const announcements = await Announcement.find().populate("courseId");
            if (!announcements) {
                console.log('No announcements found');
                return next(new AppError('No announcements found', 404));
            }
            res.status(200).json(announcements);
        } catch (error) {
            console.log(error);
            next(new AppError('Internal server error', 500, error));
        }
    },
    async getAnnouncementsForUser(req, res, next) {
        try {
            const user = await User.findOne({ _id: req.user._id });

            if (!user) {
                console.log('User not found');
                return next(new AppError('User not found', 404));
            }

            const courseIds = user.enrolledCourses.map(course => course._id);

            const announcements = await Announcement.find({
                courseId: { $in: courseIds },
                isActive: true,
            });

            if (!announcements || announcements.length === 0) {
                console.log('No announcements found for the user');
                return next(new AppError('No announcements found for the user', 404));
            }

            res.status(200).json(announcements);
        } catch (error) {
            console.log(error);
            next(new AppError('Internal server error', 500, error));
        }
    },

    async getActiveAnnouncements(req, res, next) {
        try {
            const activeAnnouncements = await Announcement.find({ isActive: true });
            if (!activeAnnouncements || activeAnnouncements.length === 0) {
                console.log('No active announcements found');
                return next(new AppError('No active announcements found', 404));
            }
            res.status(200).json(activeAnnouncements);
        } catch (error) {
            console.log(error);
            next(new AppError('Internal server error', 500, error));
        }
    },
    async getInactiveAnnouncements(req, res, next) {
        try {
            const inactiveAnnouncements = await Announcement.find({ isActive: false });
            if (!inactiveAnnouncements || inactiveAnnouncements.length === 0) {
                console.log('No inactive announcements found');
                return next(new AppError('No inactive announcements found', 404));
            }
            res.status(200).json(inactiveAnnouncements);
        } catch (error) {
            console.log(error);
            next(new AppError('Internal server error', 500, error));
        }
    },
    async deleteAnnouncement(req, res, next) {
        try {
            const { id } = req.params; // קבלת ה-ID מהפרמטרים בנתיב
            const deletedAnnouncement = await Announcement.findByIdAndDelete(id);

            if (!deletedAnnouncement) {
                console.log('Announcement not found');
                return next(new AppError('Announcement not found', 404));
            }

            res.status(200).json({ message: 'Announcement deleted successfully', deletedAnnouncement });
        } catch (error) {
            console.log(error);
            next(new AppError('Internal server error', 500, error));
        }
    },
    async updateAnnouncement(req, res, next) {
        try {
            const { id } = req.params;
            const updatedFields = req.body;
            const updatedAnnouncement = await Announcement.findByIdAndUpdate(
                id,
                { $set: updatedFields },
                { new: true, runValidators: true }
            );
            if (!updatedAnnouncement) {
                console.log('Announcement not found');
                return next(new AppError('Announcement not found', 404));
            }

            res.status(200).json({ message: 'Announcement updated successfully', updatedAnnouncement });
        } catch (error) {
            console.log(error);
            next(new AppError('Internal server error', 500, error));
        }
    },
    async getGeneralAnnouncements(req, res, next) {
        try {
            // חיפוש מודעות עם courseId שהוא null בלבד
            const generalAnnouncements = await Announcement.find({
                courseId: null, // חיפוש מודעות כלליות
                isActive: true // רק מודעות פעילות
            });

            if (!generalAnnouncements || generalAnnouncements.length === 0) {
                console.log('No general announcements found');
                return next(new AppError('No general announcements found', 404));
            }

            res.status(200).json(generalAnnouncements);
        } catch (error) {
            console.log(error);
            next(new AppError('Internal server error', 500, error));
        }
    },
    async toggleAnnouncementStatus(req, res, next) {
        try {
            const { id } = req.params;
            const announcement = await Announcement.findById(id);

            if (!announcement) {
                return next(new AppError('Announcement not found', 404));
            }

            announcement.isActive = !announcement.isActive; // החלפה בין פעיל ללא פעיל
            await announcement.save();

            res.status(200).json({
                message: `Announcement status updated to ${announcement.isActive ? 'active' : 'inactive'}`,
                announcement,
            });
        } catch (error) {
            console.log(error);
            next(new AppError('Internal server error', 500, error));
        }
    },
    async getAnnouncementStatistics(req, res, next) {
        try {
            const activeCount = await Announcement.countDocuments({ isActive: true });
            const inactiveCount = await Announcement.countDocuments({ isActive: false });
            const expiredCount = await Announcement.countDocuments({
                expirationDate: { $lte: new Date() },
            });

            res.status(200).json({
                totalAnnouncements: activeCount + inactiveCount,
                activeAnnouncements: activeCount,
                inactiveAnnouncements: inactiveCount,
                expiredAnnouncements: expiredCount,
            });
        } catch (error) {
            console.log(error);
            next(new AppError('Internal server error', 500, error));
        }
    },
    async makeReaded(req, res, next) {
        console.log(" trying כדאגשרעדקכג'קכעיעמצימעיגכגשדש ");

        try {
            console.log(" makeReaded ", req.user._id);

            const user = await User.findOne({ _id: req.user._id });
            if (!user) {
                console.log('User not found');
                return next(new AppError('User not found', 404));
            }

            const courseIds = user.enrolledCourses.map(course => course._id);
            const announcements = await Announcement.find({
                courseId: { $in: courseIds },
                isActive: true,
            });

            if (!announcements || announcements.length === 0) {
                console.log('No announcements found for the user');
                return next(new AppError('No announcements found for the user', 404));
            }

            announcements.forEach(announcement => {
                announcement.isRead = true;
                announcement.save();
            });

            res.status(200).json({
                message: 'Announcements marked as read successfully',
            })
        } catch (error) {
            console.log(error);
            next(new AppError('Internal server error', 500, error));
        }
    },

}

module.exports = ctrlAnnouncement