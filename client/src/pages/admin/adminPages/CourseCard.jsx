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
          <img
            src={`../${course.image}`}
            alt={course.name}
            className={styles.courseImage}
          />
          <h3>{course.name}</h3>
          <p>
            <strong>Description:</strong> {course.description}
          </p>
          <p>
            <strong>Coach:</strong> {course.coach}
          </p>
          <p>
            <strong>Participants:</strong> {course.currentParticipants} / 10
          </p>
          <p>
            <strong>Status:</strong>{" "}
            {course.availableSlots > 0 ? "Available" : "Full"}
          </p>
          <p>
            <strong>Schedule:</strong>
          </p>
          <ul>
            {course.schedule.map((slot, index) => (
              <li key={index}>
                {slot.day}: {new Date(slot.startTime).toLocaleTimeString()} -{" "}
                {new Date(slot.endTime).toLocaleTimeString()}
              </li>
            ))}
          </ul>
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
