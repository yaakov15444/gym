import React, { useEffect, useState } from "react";
import styles from "../styles/success.module.css";
import { useNavigate } from "react-router-dom";

const Success = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // הגדרת navigate כאן

  useEffect(() => {
    const processPayment = async () => {
      try {
        const queryParams = new URLSearchParams(window.location.search);
        const paymentId = queryParams.get("token");
        const packageId = queryParams.get("packageId");
        const userId = queryParams.get("userId");
        const courseId = queryParams.get("courseId");

        if (paymentId && packageId && userId) {
          setLoading(true);

          const response = await fetch(
            "http://localhost:3000/packages/purchase",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                packageId,
                userId,
                paymentId,
                selectedCourseId: courseId,
              }),
            }
          );

          const data = await response.json();
          setLoading(false);

          if (!response.ok) {
            throw new Error(data.message || "Failed to process payment.");
          }

          setMessage(
            "Payment Successful! Your subscription has been activated."
          );
          navigate("/successMessage", { replace: true }); // קריאה ל-navigate כאן לאחר הצלחת התשלום
        }
      } catch (err) {
        setLoading(false);
        setError(err.message || "Something went wrong. Please try again.");
        console.error("Error processing payment:", err);
      }
    };

    processPayment();
  }, [navigate]); // הוספת navigate כתלות

  if (loading) {
    return (
      <h1 className={styles.successContainer}>Loading Payment Processing...</h1>
    );
  }

  if (error) {
    return (
      <div className={styles.successContainer + styles.errorContainer}>
        <h1>Payment Failed</h1>
        <p>{error}</p>
        <button className={styles.button} onClick={() => navigate("/")}>
          {" "}
          // שימוש ב-navigate במקום window.location.href Back to Home
        </button>
      </div>
    );
  }

  if (message) {
    return <h1 className={styles.successContainer}>{message}</h1>; // הוספת תצוגת ההודעה
  }

  return (
    <h1 className={styles.successContainer}>No Payment Information Found</h1>
  );
};

export default Success;
