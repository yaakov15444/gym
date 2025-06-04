import React, { useEffect, useState } from "react";
import { useUser } from "../../contexts/UserProvider";
import { useLocation, useNavigate } from "react-router-dom";

const GymVisit = () => {
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("green");
  const base_url = import.meta.env.VITE_BASE_URL;
  const { user } = useUser();
  const navigate = useNavigate();

  const location = useLocation();
  useEffect(() => {
    if (!user) {
      localStorage.setItem("redirectAfterLogin", location.pathname);
      navigate("/login");
    }
  }, [user, navigate, location.pathname]);

  const handleClick = async () => {
    try {
      const userId = user._id;
      const response = await fetch(`${base_url}gymVisit/${userId}`, {
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
      {user && !message && (
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
              backgroundColor: "#ff6b00",
              color: "white",
              padding: "10px 20px",
              borderRadius: "5px",
              border: "none",
              cursor: "pointer",
            }}
          >
            enter gym
          </button>
        </div>
      )}
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
