const Lesson = require("../models/lessonModel");
const AppError = require("../utils/handleError");
module.exports = {
    async createLesson(req, res, next) {
        try {
            const newLesson = await Lesson.create(req.body);
            res.status(200).json(newLesson);
        } catch (err) {
            next(new AppError(err.message, 500));
        }
    },
    async getAllLessons(req, res, next) {
        try {
            const lessons = await Lesson.find({isActive: true});
            res.status(200).json({lessons});
        } catch (err) {
            next(new AppError(err.message, 500));
        }
    },
    
}