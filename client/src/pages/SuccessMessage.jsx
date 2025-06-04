import React from "react";

const SuccessMessage = () => {
  const style = {
    container: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#dff0d8", // צבע רקע ירוק בהיר
      color: "#3c763d", // צבע טקסט ירוק כהה
      textAlign: "center",
      fontSize: "24px",
      fontFamily: '"Arial", sans-serif',
    },
    button: {
      marginTop: "20px",
      padding: "10px 20px",
      fontSize: "18px",
      backgroundColor: "#4CAF50", // ירוק
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    },
  };

  const navigateHome = () => {
    // הוסף את הפונקציית ניווט שמתאימה לפרויקט שלך, לדוגמה:
    // history.push('/') עם React Router
    // או window.location.href = '/' לניווט ישיר
    window.location.href = "/";
  };

  return (
    <div style={style.container}>
      <div>Payment Successful! Your subscription has been activated.</div>
      <button style={style.button} onClick={navigateHome}>
        Go to Home Page
      </button>
    </div>
  );
};

export default SuccessMessage;
