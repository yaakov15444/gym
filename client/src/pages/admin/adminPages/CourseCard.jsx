import React, { useState } from "react";
import styles from "../styles/CourseCard.module.css";

const CourseCard = ({ course, onEdit, onDelete }) => {
  const [deletePassword, setDeletePassword] = useState(""); // State for delete password
  const [showDeleteModal, setShowDeleteModal] = useState(false); // State for showing the delete modal

  const handleEditClick = () => {
    if (onEdit) {
      onEdit(course); // Trigger the parent to open the edit mode
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true); // Show delete modal
  };

  const confirmDelete = () => {
    if (onDelete && deletePassword) {
      onDelete(course, deletePassword); // Trigger the delete callback with course and password
      setShowDeleteModal(false); // Close modal
      setDeletePassword(""); // Clear password field
    }
  };

  return (
    <div className={styles.card}>
      {course ? (
        <>
          <img
            src={course.image}
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
            <strong>Max Participants:</strong> {course.currentParticipants}
          </p>
          <p>
            <strong>availableSlots:</strong>{" "}
            {course.maxParticipants - course.participants.length}
          </p>
          <p>
            <strong>Schedule:</strong>
          </p>
          <ul>
            {course.schedule && course.schedule.length > 0 ? (
              course.schedule.map((slot, index) => (
                <li key={index}>
                  {slot.day}:{" "}
                  {new Date(slot.startTime).toLocaleTimeString("en-GB", {
                    timeZone: "Asia/Jerusalem",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  -{" "}
                  {new Date(slot.endTime).toLocaleTimeString("en-GB", {
                    timeZone: "Asia/Jerusalem",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </li>
              ))
            ) : (
              <li>No schedule available</li>
            )}
          </ul>
          <div className={styles.buttonContainer}>
            <button className={styles.editButton} onClick={handleEditClick}>
              Edit
            </button>
            <button className={styles.deleteButton} onClick={handleDeleteClick}>
              Delete
            </button>
          </div>
        </>
      ) : (
        <button className={styles.addButton}>
          <span className={styles.addIcon}>+</span> Add Course
        </button>
      )}
      {showDeleteModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Confirm Deletion</h2>
            <p>
              Are you sure you want to delete <strong>{course.name}</strong>?
              Please enter your password:
            </p>
            <input
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              placeholder="Enter password"
              required
            />
            <div className={styles.modalActions}>
              <button onClick={confirmDelete} className={styles.confirmButton}>
                Confirm
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseCard;
