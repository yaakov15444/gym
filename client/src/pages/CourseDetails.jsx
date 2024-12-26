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
          "en-IL",
          options
        )} - ${endTime.toLocaleTimeString("en-IL", options)}`;
      })
      .join(", ");
  };

  return (
    <div className={styles.courseDetailsContainer}>
      <h1 className={styles.courseTitle}>{course.name}</h1>
      <div>
        <div className={styles.imageContainer}>
          <img
            src={course.image}
            alt={course.name}
            className={styles.courseImage}
          />
        </div>
        <div>
          {/* תיאור הקורס */}
          <p className={styles.courseDescription}>{course.description}</p>
          {/* לוח זמנים */}
          <div className={styles.scheduleContainer}>
            <h2>Schedule</h2>
            <p>{formatSchedule(course.schedule)}</p>
          </div>
        </div>
      </div>
      <button onClick={onBack} className={styles.backButton}>
        Back to All Courses
      </button>
    </div>
  );
};

export default CourseDetails;
