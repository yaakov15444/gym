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
        <h2 style={modalStyle.title}>Select a Course</h2>
        <ul style={modalStyle.list}>
          {courses.map((course, i) => (
            <li key={i} style={modalStyle.item}>
              <button
                style={modalStyle.button}
                onClick={() => handleCourseSelection(course._id)}
              >
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
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    backdropFilter: "blur(5px)",
  },
  content: {
    background: "#1e1e2f",
    padding: "30px",
    borderRadius: "12px",
    width: "50%",
    maxHeight: "80vh",
    overflowY: "auto",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
    transform: "scale(1)",
    animation: "fadeIn 0.5s ease",
    color: "#ffffff",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    fontSize: "24px",
    marginBottom: "20px",
    color: "#f39c12",
    textAlign: "center",
    borderBottom: "2px solid #f39c12",
    paddingBottom: "10px",
  },
  list: {
    listStyleType: "none",
    padding: 0,
  },
  item: {
    marginBottom: "15px",
    textAlign: "center",
  },
  button: {
    padding: "12px 25px",
    cursor: "pointer",
    backgroundColor: "#2980b9",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "transform 0.2s, background-color 0.2s",
  },
  buttonHover: {
    backgroundColor: "#3498db",
    transform: "scale(1.05)",
  },
  closeButton: {
    marginTop: "20px",
    padding: "12px 25px",
    cursor: "pointer",
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "transform 0.2s, background-color 0.2s",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
  },
};

export default Modal;
