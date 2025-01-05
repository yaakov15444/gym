import React from "react";
import styles from "../styles/ModalStyle.module.css"; // Import the CSS module

const Modal = ({ courses, setSelectedCourseId, setIsModalOpen }) => {
  const handleCourseSelection = (courseId) => {
    console.log("Selected course ID:", courseId);

    setSelectedCourseId(courseId);
    setIsModalOpen(false); // Close the modal after selection
  };

  const handleClose = () => {
    setSelectedCourseId("");
    setIsModalOpen(false);
    window.location.reload();
    setIsModalOpen(false); // Close the modal without selection
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.content}>
        <h2 className={styles.title}>Select a Course</h2>
        <ul className={styles.list}>
          {courses.map((course, i) => (
            <li key={i} className={styles.item}>
              <button
                className={styles.button}
                onClick={() => handleCourseSelection(course._id)}
              >
                {course.name}
              </button>
            </li>
          ))}
        </ul>
        <button onClick={handleClose} className={styles.closeButton}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
