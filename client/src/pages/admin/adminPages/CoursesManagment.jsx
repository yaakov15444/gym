import React, { useEffect, useState } from "react";
import styles from "../styles/CourseManagement.module.css";
import CourseCard from "./CourseCard";
import { useAdmin } from "./AdminContext";
import EditCourse from "./EditCourse";
import { useNavigate } from "react-router-dom";
const base_url = import.meta.env.VITE_BASE_URL;
const CourseManagement = () => {
  const { courses, refreshCourses } = useAdmin();
  const [editingCourse, setEditingCourse] = useState(null); // State for editing a course
  const navigate = useNavigate();
  const handleEdit = (course) => {
    setEditingCourse(course);
  };

  const handleCloseEdit = () => {
    setEditingCourse(null); // Close edit mode
  };
  const handleDeleteCourse = async (course, password) => {
    try {
      console.log(password);

      const response = await fetch(
        `${base_url}courses/admin/delete/${course._id}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        }
      );
      if (response.ok) {
        refreshCourses(); // ריענון רשימת הקורסים לאחר מחיקה מוצלחת
        alert("Course deleted successfully!");
      } else {
        alert("Failed to delete course. Please check your password.");
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("An error occurred while deleting the course.");
    }
  };

  return (
    <div className={styles.container}>
      <h1>Course Management</h1>
      <button className={styles.backButton} onClick={() => navigate(-1)}>
        Back
      </button>
      {editingCourse ? (
        <EditCourse course={editingCourse} onClose={handleCloseEdit} />
      ) : (
        <div className={styles.grid}>
          {courses?.map((course, i) => (
            <CourseCard
              key={i}
              course={course}
              onEdit={handleEdit}
              onDelete={handleDeleteCourse}
            />
          ))}
          <button
            className={styles.addButton}
            onClick={() => navigate("/admin/courses/add")}
          >
            Add Course
          </button>
        </div>
      )}
    </div>
  );
};

export default CourseManagement;
