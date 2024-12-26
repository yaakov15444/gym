import React, { useEffect, useState } from "react";
import useFetch from "../hooks/useFetch"; // שימוש ב-useFetch כדי לשלוף קורסים
import styles from "../styles/courses.module.css";
import CourseDetails from "./CourseDetails";

const Courses = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);

  const {
    data: courses,
    loading,
    error,
  } = useFetch("http://localhost:3000/courses/all");

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
  const handleCourseClick = (course) => {
    setSelectedCourse(course);
  };

  const handleBackToCourses = () => {
    setSelectedCourse(null); // חוזר לדף הקורסים
  };
  return (
    <div className={styles.page}>
      <div className={styles.coursesContainer}>
        {selectedCourse == null && (
          <>
            <h1>Available Courses</h1>
            <p className={styles.description}>
              Join our dynamic courses designed to transform your fitness
              journey. Choose from various styles and intensities to meet your
              goals.
            </p>
          </>
        )}
        {loading && <p>Loading courses...</p>}
        {error && (
          <p>
            Error loading courses: {error.message || "Something went wrong!"}
          </p>
        )}
        {!selectedCourse && courses && (
          <div className={styles.coursesGrid}>
            {courses.map((course) => (
              <div
                onClick={() => handleCourseClick(course)}
                key={course._id}
                className={styles.courseCard}
              >
                <img
                  src={course.image}
                  alt={course.name}
                  className={styles.courseImage}
                />
                <h3>{course.name}</h3>
                <p>{course.description}</p>
                <div className={styles.schedule}>
                  <strong>Schedule:</strong>{" "}
                  <span>{formatSchedule(course.schedule)}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedCourse && (
          <div className={styles.courseDetails}>
            <CourseDetails
              course={selectedCourse}
              onBack={handleBackToCourses}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
