import React, { useState } from "react";

const GymVisit = () => {
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("green");
  const base_url = import.meta.env.VITE_BASE_URL;

  const handleClick = async () => {
    try {
      const response = await fetch(`${base_url}gymVisit`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // מאפשר שליחת קוקיז עם הבקשה
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message); // עדכון ההודעה להצלחה
        setMessageColor("green");
      } else {
        setMessage(data.message); // עדכון ההודעה לשגיאה
        setMessageColor("red");
      }
    } catch (error) {
      setMessage("An error occurred.");
      setMessageColor("red");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "100vh",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <button
        onClick={handleClick}
        style={{
          padding: "15px 30px",
          fontSize: "16px",
          border: "none",
          borderRadius: "8px",
          backgroundColor: "#007BFF",
          color: "#fff",
          cursor: "pointer",
          marginBottom: "20px",
          width: "100%",
          maxWidth: "300px",
          transition: "background-color 0.3s",
          textAlign: "center",
        }}
      >
        Enter Gym
      </button>

      {message && (
        <div
          style={{
            color: messageColor,
            fontSize: "18px",
            fontWeight: "bold",
            textAlign: "center",
            marginTop: "20px",
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default GymVisit;
