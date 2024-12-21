import React from "react";

const Modal = ({ courses, setSelectedCourseId, setIsModalOpen }) => {
  const handleCourseSelection = (courseId) => {
    console.log("Selected course ID:", courseId);

    setSelectedCourseId(courseId);
    setIsModalOpen(false); // סגירת המודל לאחר בחירה
  };

  const handleClose = () => {
    setIsModalOpen(false); // סגירת המודל בלי לבחור
  };

  return (
    <div style={modalStyle.overlay}>
      <div style={modalStyle.content}>
        <h2>Select a Course</h2>
        <ul style={modalStyle.list}>
          {courses.map((course, i) => (
            <li key={i} style={modalStyle.item}>
              <button onClick={() => handleCourseSelection(course._id)}>
                {course.name}
              </button>
            </li>
          ))}
        </ul>
        <button onClick={handleClose} style={modalStyle.closeButton}>
          Close
        </button>
      </div>
    </div>
  );
};

const modalStyle = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    background: "white",
    padding: "20px",
    borderRadius: "8px",
    width: "50%",
    maxHeight: "80vh",
    overflowY: "auto",
  },
  list: {
    listStyleType: "none",
    padding: 0,
  },
  item: {
    marginBottom: "10px",
  },
  closeButton: {
    marginTop: "20px",
    padding: "10px 20px",
    cursor: "pointer",
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    borderRadius: "5px",
  },
};

export default Modal;
