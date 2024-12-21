import React from "react";
import styles from "../styles/courses.module.css"; // ייבוא סגנונות עיצוב

const CourseDetails = ({ course, onBack }) => {
  const formatSchedule = (schedule) => {
    return schedule
      .map((s) => {
        const startTime = new Date(s.startTime);
        const endTime = new Date(s.endTime);
        const options = { hour: "2-digit", minute: "2-digit" };
        return `${s.day}: ${startTime.toLocaleTimeString(
          "en-GB",
          options
        )} - ${endTime.toLocaleTimeString("en-GB", options)}`;
      })
      .join(", ");
  };

  return (
    <div className={styles.courseDetailsContainer}>
      <button onClick={onBack} className={styles.backButton}>
        Back to Courses
      </button>

      {/* כותרת פרטי הקורס */}
      <h1 className={styles.courseTitle}>{course.name}</h1>

      {/* תמונה של הקורס */}
      <div className={styles.imageContainer}>
        <img
          src={course.image}
          alt={course.name}
          className={styles.courseImage}
        />
      </div>

      {/* תיאור הקורס */}
      <p className={styles.courseDescription}>{course.description}</p>

      {/* לוח זמנים */}
      <div className={styles.scheduleContainer}>
        <h2>Schedule</h2>
        <p>{formatSchedule(course.schedule)}</p>
      </div>

      {/* אפשר להוסיף כאן פרטים נוספים כמו מדריך הקורס, מקום ועוד */}
    </div>
  );
};

export default CourseDetails;
