import React, { useState } from "react";
import styles from "../styles/LoginSIgnup.module.css";
import formStyles from "../styles/formStyles.module.css"; // Import styles as a module
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { SIGNUP_URL } from "../constants/endPoint";

const Signup = () => {
  const navigate = useNavigate();
  const {
    register, // Register input fields
    handleSubmit, // Handle form submission
    formState: { errors }, // Errors for validation
    watch, // Watch the password field for confirm password validation
    reset, // Add reset to clear form inputs
  } = useForm();

  const [req, setReq] = useState({
    data: null,
    loading: false,
    error: null,
  });

  // Triggered when form is submitted
  const onSubmit = async (data) => {
    setReq({ ...req, loading: true }); // Set loading state to true

    try {
      // Send data to the server via fetch
      const response = await fetch(SIGNUP_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json(); // Parse the JSON response
      console.log(result);

      if (response.ok) {
        // Handle success, navigate to login page
        setReq({ ...req, loading: false, data: result });
        console.log("Signup successful:", result);
        navigate("/login"); // Redirect to login page after successful signup
        reset(); // Reset form fields after successful signup
      } else {
        // Handle error response
        setReq({ ...req, loading: false, error: result });
        console.log("Signup failed:", result);
      }
    } catch (error) {
      // Catch network errors
      setReq({ ...req, loading: false, error: error });
      console.log("Error during signup:", error);
    }
  };

  // Show loading spinner if data is being fetched
  if (req.loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  // Error handling if the fetch fails
  if (req.error) {
    return (
      <p className={formStyles.errorMessage}>
        {req.error.message || "An error occurred"}
      </p>
    );
  }

  return (
    <div className={styles.Page}>
      <div className={styles.Container}>
        <h1 className={styles.heading}>Sign up</h1>
        <div className={formStyles.formContainer}>
          <h2>Register</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="name" className={formStyles.label}>
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                {...register("name", { required: "Name is required" })}
                className={formStyles.input}
              />
              {errors.name && (
                <p className={formStyles.errorMessage}>{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className={formStyles.label}>
                Phone
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                {...register("phone", { required: "Phone is required" })}
                className={formStyles.input}
              />
              {errors.phone && (
                <p className={formStyles.errorMessage}>
                  {errors.phone.message}
                </p>
              )}
            </div>

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
              <label htmlFor="confirmPassword" className={formStyles.label}>
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === watch("password") || "Passwords do not match",
                })}
                className={formStyles.input}
              />
              {errors.confirmPassword && (
                <p className={formStyles.errorMessage}>
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div>
              <button type="submit" className={formStyles.button}>
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
