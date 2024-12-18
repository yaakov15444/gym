const courseModel = require("../models/courseModel");
const AppError = require("../utils/handleError");
const ctrlCourse = {
    async createCourse(req, res, next) {
        try {
            const { name, description, coach } = req.body;
            if (!name || !description || !coach) {
                console.log("All fields are required");
                return next(new AppError("All fields are required", 400));
            }
            const existingCourse = await courseModel.findOne({ name });
            if (existingCourse) {
                console.log("Course already exists");
                return next(new AppError("Course already exists", 400));
            }
            const course = await courseModel.create({ name, description, coach });
            if (!course) {
                console.log("Course creation failed");
                return next(new AppError("Course creation failed", 500));
            }
            res.status(201).json({ course, message: "Course created successfully" });
        } catch (error) {
            console.log(error);
            next(new AppError("Internal server error", 500, error));
        }
    },
    async getAllCourses(req, res, next) {
        try {
            const courses = await courseModel.find({});
            if (!courses) {
                console.log("No courses found");
                return next(new AppError("No courses found", 404));
            }

            res.status(200).json(courses);
        } catch (error) {
            console.log(error);
            next(new AppError("Internal server error", 500, error));
        }
    },
    async getCourseById(req, res, next) {
        try {
            const { id } = req.params;
            const course = await courseModel.findOne({ _id: id });
            if (!course) {
                console.log("Course not found");
                return next(new AppError("Course not found", 404));
            }
            res.status(200).json(course);
        } catch (error) {
            console.log(error);
            next(new AppError("Internal server error", 500, error));
        }
    },
    async updateCourse(req, res, next) {
        try {
            const { id } = req.params;
            const course = await courseModel.findOneAndUpdate({ _id: id }, req.body, { new: true });
            if (!course) {
                console.log("Course not found");
                return next(new AppError("Course not found", 404));
            }
            res.status(200).json({ course, message: "Course updated successfully" });
        } catch (error) {
            console.log(error);
            next(new AppError("Internal server error", 500, error));
        }
    },
    async deleteCourse(req, res, next) {
        try {
            const { id } = req.params;
            const course = await courseModel.findByIdAndDelete(id);
            if (!course) {
                console.log("Course not found");
                return next(new AppError("Course not found", 404));
            }
            res.status(200).json({ message: "Course deleted successfully" });
        } catch (error) {
            console.log(error);
            next(new AppError("Internal server error", 500, error));
        }
    },
    async enrollInCourse(req, res, next) {
        try {
            const { courseId, userId } = req.body;
            if (!courseId || !userId) {
                console.log("All fields are required");
                return next(new AppError("All fields are required", 400));
            }
            const course = await courseModel.findOne({ _id: courseId });
            if (!course) {
                console.log("Course not found");
                return next(new AppError("Course not found", 404));
            }
            const user = await userModel.findOne({ _id: userId });
            if (!user) {
                console.log("User not found");
                return next(new AppError("User not found", 404));
            }
            if (course.participants.includes(userId)) {
                console.log("User is already enrolled in the course");
                return next(new AppError("User is already enrolled in the course", 400));

            }

            if (course.participants.length >= 10) {
                console.log("Course is full");
                return next(new AppError("Course is full", 400));
            }
            course.participants.push(userId);
            user.enrolledCourses.push(courseId);
            await user.save();
            await course.save();
            res.status(200).json({ message: "Enrollment successful" });
        } catch (error) {
            console.log(error);
            next(new AppError("Internal server error", 500, error));
        }
    },
    async unenrollFromCourse(req, res, next) {
        try {
            const { courseId, userId } = req.body;
            if (!courseId || !userId) {
                console.log("All fields are required");
                return next(new AppError("All fields are required", 400));
            }
            const course = await courseModel.findOne({ _id: courseId });
            if (!course) {
                console.log("Course not found");
                return next(new AppError("Course not found", 404));
            }
            const user = await userModel.findOne({ _id: userId });
            if (!user) {
                console.log("User not found");
                return next(new AppError("User not found", 404));
            }
            if (!course.participants.includes(userId)) {
                console.log("User is not enrolled in the course");
                return next(new AppError("User is not enrolled in the course", 400));
            }
            course.participants = course.participants.filter(id => id !== userId);
            user.enrolledCourses = user.enrolledCourses.filter(id => id !== courseId);
            await user.save();
            await course.save();
            res.status(200).json({ message: "Unenrollment successful" });
        } catch (error) {
            console.log(error);
            next(new AppError("Internal server error", 500, error));
        }
    },
    async checkAvailability(req, res, next) {
        try {
            const { courseId } = req.body;
            const course = await courseModel.findOne({ _id: courseId });
            if (!course) {
                console.log("Course not found");
                return next(new AppError("Course not found", 404));
            }
            res.status(200).json({
                courseId: course._id,
                name: course.name,
                currentParticipants: course.currentParticipants,
                availableSlots: course.availableSlots,
            });
        } catch (error) {
            console.log(error);
            next(new AppError("Internal server error", 500, error));
        }
    },

}


module.exports = ctrlCourse