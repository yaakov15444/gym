import React, { useEffect, useState } from "react";
import useFetch from "../hooks/useFetch"; // שימוש ב-useFetch כדי לשלוף קורסים
import styles from "../styles/courses.module.css";
import CourseDetails from "./CourseDetails";
import { useLocation } from "react-router-dom";
const base_url = import.meta.env.VITE_BASE_URL;

const Courses = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === "/courses") {
      setSelectedCourse(null);
    }
  }, [location]);
  const { data: courses, loading, error } = useFetch(`${base_url}courses/all`);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const formatSchedule = (schedule) => {
    return schedule.map((s, index) => {
      const startTime = new Date(s.startTime);
      const endTime = new Date(s.endTime);
      const options = { hour: "2-digit", minute: "2-digit" };
      return (
        <div key={index}>
          {s.day}: {startTime.toLocaleTimeString("en-GB", options)} -{" "}
          {endTime.toLocaleTimeString("en-GB", options)}
        </div>
      );
    });
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
        {loading && <div className="loading"></div>}
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
                <h3 className={styles.courseName}>{course.name}</h3>
                <p className={styles.courseDescription}>{course.description}</p>
                <div className={styles.coach}>
                  <strong>Coach:</strong> <span>{course.coach}</span>
                </div>
                <div className={styles.schedule}>
                  <strong>Schedule:</strong> <br />
                  <span>{formatSchedule(course.schedule)}</span>
                </div>
                <div
                  className={
                    course.isAvailable
                      ? styles.courseAvailable
                      : styles.courseFull
                  }
                >
                  {course.isAvailable ? (
                    <span>
                      {course.maxParticipants - course.participants.length}{" "}
                      spots available
                    </span>
                  ) : (
                    <span>No spots available</span>
                  )}
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
