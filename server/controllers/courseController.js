const courseModel = require("../models/courseModel");
const AppError = require("../utils/handleError");
const userModel = require("../models/userModel");


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
      const courses = await courseModel.find({}).lean({ virtuals: true });
      if (!courses || courses.length === 0) {
        console.log("No courses found");
        return next(new AppError("No courses found", 404));
      }
      const coursesWithAvailability = courses.map((course) => ({
        ...course,
        isAvailable: course.maxParticipants > course.participants.length,
      }));

      res.status(200).json(coursesWithAvailability);
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
      console.log(req.body);

      const { id } = req.params;

      // חיפוש הקורס לפי מזהה
      const course = await courseModel.findById(id);
      if (!course) {
        return next(new AppError("Course not found", 404));
      }

      // עדכון דינמי רק של השדות שנשלחו
      const fieldsToUpdate = ["name", "description", "coach", "schedule", "maxParticipants"];
      fieldsToUpdate.forEach((field) => {
        if (req.body[field] !== undefined) {
          course[field] = req.body[field];
        }
      });

      if (req.body.schedule) {
        // המרת schedule לפורמט נכון
        req.body.schedule = req.body.schedule.map((item) => {
          const [startHour, startMinute] = item.startTime.split(":").map(Number);
          const [endHour, endMinute] = item.endTime.split(":").map(Number);

          return {
            ...item,
            startTime: new Date(1970, 0, 1, startHour, startMinute), // יצירת אובייקט Date
            endTime: new Date(1970, 0, 1, endHour, endMinute), // יצירת אובייקט Date
          };
        });

        // ולידציה ללוח הזמנים
        const isValidSchedule = req.body.schedule.every(
          (item) =>
            ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].includes(item.day) &&
            item.startTime < item.endTime
        );

        if (!isValidSchedule) {
          return next(new AppError("Invalid schedule format", 400));
        }

        // עדכון השדה schedule
        course.schedule = req.body.schedule;
      }

      // שמירת הקורס לאחר העדכון
      await course.save();

      // החזרת תגובה ללקוח
      res.status(200).json({
        course,
        message: "Course updated successfully",
      });
    } catch (error) {
      console.error("Error updating course:", error);
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
        return next(
          new AppError("User is already enrolled in the course", 400)
        );
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
      course.participants = course.participants.filter((id) => id !== userId);
      user.enrolledCourses = user.enrolledCourses.filter(
        (id) => id !== courseId
      );
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
  async getCourseStatistics(req, res, next) {
    try {
      // סך כל הקורסים
      const totalCourses = await courseModel.countDocuments();

      // קורסים מלאים (10 משתתפים)
      const fullCourses = await courseModel.countDocuments({ "participants.9": { $exists: true } });

      // קורסים ריקים (ללא משתתפים)
      const emptyCourses = await courseModel.countDocuments({
        participants: { $exists: true, $size: 0 },
      });

      // סך כל המשתתפים הייחודיים
      const uniqueParticipants = await courseModel.aggregate([
        { $unwind: "$participants" }, // פירוק מערך המשתתפים לשורות נפרדות
        { $group: { _id: "$participants" } }, // קיבוץ לפי מזהי המשתמשים
        { $count: "uniqueCount" }, // ספירה של מזהים ייחודיים
      ]);

      // סיכום נתונים לפי מאמנים
      const coachData = await courseModel.aggregate([
        { $match: { coach: { $exists: true, $ne: null } } }, // ודא שהמאמן קיים ואינו null
        {
          $group: {
            _id: "$coach", // מקבץ לפי שם המאמן
            courses: { $push: "$name" }, // רשימת שמות הקורסים של המאמן
            totalParticipants: { $sum: { $size: "$participants" } }, // סך המשתתפים בכל הקורסים של המאמן
          },
        },
      ]);

      // החזרת הנתונים בתגובה ללקוח
      res.status(200).json({
        totalCourses,
        fullCourses,
        emptyCourses,
        uniqueParticipants: uniqueParticipants[0]?.uniqueCount || 0,
        coachData,
      });
    } catch (error) {
      console.error("Error fetching course statistics:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

};

module.exports = ctrlCourse;
