const Course = require('../models/courseModel'); // מודל הקורס
const User = require('../models/userModel'); // מודל המשתמש

async function syncCourseParticipants() {
    try {
        // קבל את כל הקורסים מהמסד נתונים
        const courses = await Course.find().populate('participants');

        for (const course of courses) {
            // עבור כל קורס, מצא את המשתמשים שרשומים לו
            const validParticipants = await User.find({
                _id: { $in: course.participants },
                enrolledCourses: course._id,
            });

            // רשימת ה-IDs של המשתמשים שעדיין תקפים
            const validParticipantIds = validParticipants.map((user) => user._id.toString());

            // עדכן את רשימת המשתתפים בקורס
            course.participants = validParticipantIds;
            await course.save();
        }
    } catch (error) {
        console.error('Error during synchronization:', error);
    }
}
syncCourseParticipants();
module.exports = syncCourseParticipants;


