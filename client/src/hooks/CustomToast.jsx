import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import "./CustomToast.css";

// יצירת פונקציה להצגת ההתראה
export const toast = (message, type = "info") => {
  const toastElement = document.createElement("div");
  document.body.appendChild(toastElement);

  const removeToast = () => {
    ReactDOM.unmountComponentAtNode(toastElement);
    document.body.removeChild(toastElement);
  };

  ReactDOM.render(
    <Toast message={message} type={type} onClose={removeToast} />,
    toastElement
  );
};

// הקומפוננטה עצמה
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000); // מסיר את ההתראה לאחר 5 שניות
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`custom-toast ${type}`} onClick={onClose}>
      {message}
      <div className="progress-bar" />
    </div>
  );
}
