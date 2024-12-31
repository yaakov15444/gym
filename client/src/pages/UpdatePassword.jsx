import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import formStyles from "../styles/formStyles.module.css";
const base_url = import.meta.env.VITE_BASE_URL;

const UpdatePassword = () => {
  const [req, setReq] = useState({
    loading: false,
    error: null,
  });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // חילוץ הטוקן מהכתובת

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const handleUpdatePassword = async (data) => {
    const { newPassword, confirmPassword } = data;

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setReq({ loading: true, error: null });

    try {
      const response = await fetch(`${base_url}/users/updatePassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setReq({ loading: false, error: errorData.message });
        return;
      }

      alert("Password updated successfully! You can now log in.");
      reset();
      navigate("/login");
    } catch (error) {
      console.error("Error updating password:", error);
      setReq({ loading: false, error: "An unexpected error occurred." });
    }
  };

  return (
    <div className={formStyles.formContainer}>
      <h1 className={formStyles.heading}>Update Password</h1>
      <form onSubmit={handleSubmit(handleUpdatePassword)}>
        <div>
          <label htmlFor="newPassword" className={formStyles.label}>
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            {...register("newPassword", {
              required: "New password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            className={formStyles.input}
          />
          {errors.newPassword && (
            <p className={formStyles.errorMessage}>
              {errors.newPassword.message}
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
            {...register("confirmPassword", {
              required: "Please confirm your password",
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
          <button
            type="submit"
            className={formStyles.button}
            disabled={req.loading}
          >
            {req.loading ? "Updating..." : "Update Password"}
          </button>
        </div>
        {req.error && <p className={formStyles.errorMessage}>{req.error}</p>}
      </form>
    </div>
  );
};

export default UpdatePassword;
