import React, { useEffect, useState } from "react";
import styles from "../styles/CourseManagement.module.css";
import CourseCard from "./CourseCard";
import { useAdmin } from "./AdminContext";
import EditCourse from "./EditCourse";

const CourseManagement = () => {
  const { courses } = useAdmin();
  const [editingCourse, setEditingCourse] = useState(null); // State for editing a course

  const handleEdit = (course) => {
    setEditingCourse(course); // Set the course being edited
  };

  const handleCloseEdit = () => {
    setEditingCourse(null); // Close edit mode
  };

  return (
    <div className={styles.container}>
      <h1>Course Management</h1>
      {editingCourse ? (
        <EditCourse course={editingCourse} onClose={handleCloseEdit} />
      ) : (
        <div className={styles.grid}>
          {courses?.map((course, i) => (
            <CourseCard key={i} course={course} onEdit={handleEdit} />
          ))}
          {/* <CourseCard onEdit={handleEdit} /> */}
        </div>
      )}
    </div>
  );
};

export default CourseManagement;
