import React from "react";
import styles from "../styles/CourseCard.module.css";

const CourseCard = ({ course, onEdit }) => {
  const handleEditClick = () => {
    if (onEdit) {
      onEdit(course); // Trigger the parent to open the edit mode
    }
  };

  return (
    <div className={styles.card}>
      {course ? (
        <>
          <h3>{course.name}</h3>
          <h2>{course.coach}</h2>
          <button className={styles.editButton} onClick={handleEditClick}>
            Edit
          </button>
        </>
      ) : (
        <>
          <button className={styles.addButton}>
            <span className={styles.addIcon}>+</span> Add Course
          </button>
        </>
      )}
    </div>
  );
};

export default CourseCard;
