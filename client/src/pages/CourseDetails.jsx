import React from "react";
import styles from "../styles/courses.module.css"; // ייבוא סגנונות עיצוב
import { useUser } from "../contexts/UserProvider";

const CourseDetails = ({ course, onBack }) => {
  const { user } = useUser();
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
  const handlePurchase = async () => {
    if (!user) {
      alert("You must be logged in to purchase a package!");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/packages/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          userId: user._id,
          packageId: "675f1458af9bbfe8f3a5d823",
          selectedCourseId: course._id,
        }),
      });
      console.log("response", response);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to initiate payment process");
      }

      // פתיחת הקישור של פייפאל בחלון חדש
      window.open(data.approvalUrl, "_blank");
    } catch (error) {
      console.error("Error purchasing package:", error);
      alert("Error purchasing package: " + error.message);
    }
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
      <div className={styles.coach}>
        <strong>Coach:</strong> <span>{course.coach}</span>
      </div>
      {/* לוח זמנים */}
      <div className={styles.scheduleContainer}>
        <h2>Schedule</h2>
        <p>{formatSchedule(course.schedule)}</p>
      </div>
      <button onClick={handlePurchase} className={styles.purchaseButton}>
        Purchase Package
      </button>
      {/* אפשר להוסיף כאן פרטים נוספים כמו מדריך הקורס, מקום ועוד */}
    </div>
  );
};

export default CourseDetails;
