import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const base_url = import.meta.env.VITE_BASE_URL;

const PhoneLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await fetch(`${base_url}users/userInfo`, {
          method: "GET",
          credentials: "include", // מאפשר שליחת קוקיז עם הבקשה
        });

        if (response.ok) {
          // אם קיבלת פרטי משתמש, תנווט לדף /gymVisit
          navigate("/gymVisit");
        }
      } catch (error) {
        // אם הייתה שגיאה, לא נעשה כלום ונתן למשתמש לראות את האתר
      }
    };

    checkUser();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${base_url}users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Enables sending cookies with the request
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        alert("Login successful!");
      } else {
        const errorData = await response.json();
        alert(`Login failed: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      alert(`An error occurred: ${error.message}`);
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "0 auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        Login
      </h2>
      <form onSubmit={handleSubmit}>
        <div
          style={{
            marginBottom: "15px",
          }}
        >
          <label
            htmlFor="email"
            style={{
              display: "block",
              marginBottom: "5px",
            }}
          >
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
            required
          />
        </div>
        <div
          style={{
            marginBottom: "15px",
          }}
        >
          <label
            htmlFor="password"
            style={{
              display: "block",
              marginBottom: "5px",
            }}
          >
            Password:
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
            required
          />
        </div>
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            border: "none",
            borderRadius: "4px",
            background: "#007BFF",
            color: "#fff",
            cursor: "pointer",
            width: "100%",
          }}
        >
          Login
        </button>
      </form>

      <style>
        {`
          @media (max-width: 768px) {
            .login-container {
              padding: 15px;
            }
            h2 {
              font-size: 24px;
            }
            input,
            button {
              padding: 12px;
            }
          }

          @media (max-width: 480px) {
            .login-container {
              padding: 10px;
            }
            h2 {
              font-size: 20px;
            }
            input,
            button {
              padding: 10px;
            }
          }
        `}
      </style>
    </div>
  );
};

export default PhoneLogin;
