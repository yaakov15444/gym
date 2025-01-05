const courseModel = require("../models/courseModel");
const AppError = require("../utils/handleError");
const userModel = require("../models/userModel");
const Announcement = require("../models/announcement");
const { delete_course_password } = require("../secrets/dotenv");
const ctrlCourse = {
  async createCourse(req, res, next) {
    try {
      const { name, description, coach, maxParticipants, image, schedule } =
        req.body;

      // בדיקה אם כל השדות הנדרשים נשלחו
      if (!name || !description || !coach || !maxParticipants || !schedule) {
        return next(new AppError("Missing required fields", 400));
      }

      // יצירת הקורס
      const newCourse = await courseModel.create({
        name,
        description,
        coach,
        maxParticipants,
        image,
        schedule,
      });

      const users = await userModel.find()
        .populate("package", "name")
        .then((users) =>
          users.filter(
            (user) =>
              user.package?.name === "Unlimited Classes Package" ||
              user.package?.name === "Seasonal Unlimited Package"
          )
        );

      // הוספת המשתמשים למערך המשתתפים בקורס
      newCourse.participants = users.map((user) => user._id);
      await newCourse.save();

      // יצירת מודעה חדשה
      const announcement = await Announcement.create({
        title: `New Course: ${newCourse.name}`,
        content: `Exciting news! We have launched a new course: "${newCourse.name}".\n
          Description: ${newCourse.description}\n
          Coach: ${newCourse.coach}\n
           Schedule: ${newCourse.schedule
            .map(
              (s) =>
                `${s.day}, ${new Date(s.startTime).toLocaleTimeString()} - ${new Date(
                  s.endTime
                ).toLocaleTimeString()}`
            )
            .join(", ")}\n
            Don't miss it!`,
        expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // תוקף של שבוע
      });


      return res.status(201).json({
        message: "Course created successfully!",
        course: newCourse,
        announcement,
      });
    } catch (error) {
      console.error(error);
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
      const fieldsToUpdate = ["name", "description", "coach", "schedule", "maxParticipants", "image"];
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
  },
  async toggleUserInCourse(req, res, next) {
    try {
      console.log(req.body);

      const { courseId } = req.params;
      const userId = req.user._id;

      // בדיקה אם אחד השדות חסר
      if (!courseId || !userId) {
        return next(new AppError("Missing required fields", 400));
      }

      // מציאת הקורס
      const course = await courseModel.findById(courseId);
      if (!course) {
        console.log("Course not found");
        return next(new AppError("Course not found", 404));
      }

      const isUserEnrolled = course.participants.includes(userId);

      if (isUserEnrolled) {
        course.participants = course.participants.filter(
          (participantId) => participantId.toString() !== userId
        );
        await course.save();

        return res.status(200).json({
          message: "User successfully removed from course",
          course,
        });
      }

      // אם הקורס מלא, מחזירים הודעת שגיאה
      if (course.participants.length >= course.maxParticipants) {
        return next(
          new AppError(
            "The course is full. Please check back later or choose another course.",
            400
          )
        );
      }

      // הוספת המשתמש למערך המשתתפים
      course.participants.push(userId);
      await course.save();

      return res.status(200).json({
        message: "User successfully added to course",
        course,
      });
    } catch (error) {
      console.error(error.message);
      next(new AppError(error.message, 500));
    }
  },
  async deleteCourse(req, res, next) {
    try {
      const { id } = req.params;
      const { password } = req.body; // הסיסמה נשלחת בגוף הבקשה

      if (!id || !password) {
        return next(new AppError("Missing required fields", 400));
      }

      // בדיקת סיסמה
      if (password !== process.env.DELETE_COURSE_PASSWORD) {
        return next(new AppError("Unauthorized: Incorrect password", 401));
      }

      const course = await courseModel.findById(id);
      if (!course) {
        return next(new AppError("Course not found", 404));
      }

      await course.deleteOne();

      res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
      console.error("Error deleting course:", error);
      next(new AppError("Internal server error", 500));
    }
  }



};

module.exports = ctrlCourse;
