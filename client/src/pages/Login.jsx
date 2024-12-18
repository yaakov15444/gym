import React, { useState } from "react";
import formStyles from "../styles/formStyles.module.css";
import styles from "../styles/LoginSIgnup.module.css";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { LOGIN_URL } from "../constants/endPoint";
import { useUser } from "../contexts/UserProvider";
const Login = () => {
  const { login } = useUser();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [loginData, setLoginData] = useState(null);
  const [req, setReq] = useState({
    data: null,
    loading: false,
    error: null,
  });

  const handleRequest = async (data) => {
    setReq({ ...req, loading: true });

    try {
      const response = await fetch(LOGIN_URL, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        // Handle success
        setReq({ ...req, loading: false, data: result });
        console.log("Login successful:", result);
        login();
        navigate("/");
        reset();
      } else {
        // Handle error response
        setReq({ ...req, loading: false, error: result });
        console.log("Login failed:", result);
      }
    } catch (error) {
      setReq({ ...req, loading: false, error: error });
      console.log("Error during login:", error);
    }
  };

  if (req.loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  console.log(req.error);

  return (
    <div className={styles.Page}>
      <div className={styles.Container}>
        <h1 className={styles.heading}>Login</h1>
        <div className={formStyles.formContainer}>
          <form onSubmit={handleSubmit(handleRequest)}>
            <div>
              <label htmlFor="email" className={formStyles.label}>
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Email is not valid",
                  },
                })}
                className={formStyles.input}
              />
              {errors.email && (
                <p className={formStyles.errorMessage}>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className={formStyles.label}>
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                {...register("password", { required: "Password is required" })}
                className={formStyles.input}
              />
              {errors.password && (
                <p className={formStyles.errorMessage}>
                  {errors.password.message}
                </p>
              )}
            </div>
            <div>
              <button type="submit" className={formStyles.button}>
                {req.loading ? "Logging in..." : "Login"}
              </button>
            </div>
            {req.error && (
              <p className={formStyles.errorMessage}>{req.error.message}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
