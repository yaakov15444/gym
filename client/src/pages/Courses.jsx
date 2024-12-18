import React from "react";
import useFetch from "../hooks/useFetch"; // שימוש ב-useFetch כדי לשלוף קורסים

const Courses = () => {
  const {
    data: courses,
    loading,
    error,
  } = useFetch("http://localhost:3000/courses/all");

  return (
    <div>
      <h1>Available Courses</h1>
      {loading && <p>Loading courses...</p>}
      {error && (
        <p>Error loading courses: {error.message || "Something went wrong!"}</p>
      )}
      {courses && (
        <ul>
          {courses.map((course) => (
            <li key={course._id}>
              <h3>{course.name}</h3>
              <p>{course.description}</p>
              <p>Coach: {course.coachName}</p> {/* אם יש שם מאמן */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Courses;
