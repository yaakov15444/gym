import React, { useState } from "react";
import formStyles from "../styles/formStyles.module.css";
import styles from "../styles/LoginSIgnup.module.css";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { LOGIN_URL } from "../constants/endPoint";
import { useUser } from "../contexts/UserProvider";
import { fetchData } from "../utils/fetchData";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const { login } = useUser();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [req, setReq] = useState({
    data: null,
    loading: false,
    error: null,
  });
  const [isChangePassword, setIsChangePassword] = useState(false);

  const handleRequest = async (data) => {
    setReq({ ...req, loading: true });
    const {
      data: result,
      error,
      loading,
    } = await fetchData(LOGIN_URL, "POST", data);
    if (result) {
      setReq({ ...req, loading: loading, data: result });
      login();
      navigate("/");
      reset();
    } else {
      // Handle error response
      setReq({ ...req, loading: loading, error: error });
    }
  };

  const handleChangePassword = async (data) => {
    setReq({ ...req, loading: true });
    const { email, currentPassword, newPassword } = data;
    try {
      const response = await fetch(
        "http://localhost:3000/users/changePassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            currentPassword,
            newPassword,
          }),
        }
      );

      if (response.ok) {
        alert("Password changed successfully!");
        setIsChangePassword(false);
        reset();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      alert("An error occurred while changing the password.");
      console.error(error);
    } finally {
      setReq({ ...req, loading: false });
    }
  };

  return (
    <div className={styles.Page}>
      <div className={styles.Container}>
        <h1 className={styles.heading}>
          {isChangePassword ? "Change Password" : "Login"}
        </h1>
        {req.loading ? (
          <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
          </div>
        ) : (
          <div className={formStyles.formContainer}>
            {!isChangePassword ? (
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
                    autoComplete="email"
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
                    {...register("password", {
                      required: "Password is required",
                    })}
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
            ) : (
              <form onSubmit={handleSubmit(handleChangePassword)}>
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
                  <label htmlFor="currentPassword" className={formStyles.label}>
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    {...register("currentPassword", {
                      required: "Current password is required",
                    })}
                    className={formStyles.input}
                  />
                  {errors.currentPassword && (
                    <p className={formStyles.errorMessage}>
                      {errors.currentPassword.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="newPassword" className={formStyles.label}>
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    {...register("newPassword", {
                      required: "New password is required",
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
                  <button type="submit" className={formStyles.button}>
                    Change Password
                  </button>
                </div>
              </form>
            )}

            <button
              onClick={() => setIsChangePassword(!isChangePassword)}
              className={formStyles.linkButton}
            >
              {isChangePassword ? "Back to Login" : "Change Password"}
            </button>
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                try {
                  const decodedCredential = jwtDecode(
                    credentialResponse.credential
                  );
                  const email = decodedCredential.email;
                  const accessToken = decodedCredential;
                  console.log(accessToken);

                  const response = await fetch(
                    "http://localhost:3000/users/google",
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        email: email,
                        token: accessToken,
                      }),
                      credentials: "include",
                    }
                  );
                  if (!response.ok) {
                    const errorData = await response.json();
                    console.error("Login failed:", errorData.message);
                    alert("Login failed: " + errorData.message);
                    return;
                  }
                  if (response.ok) {
                    console.log("Login successful");
                    login();
                    navigate("/");
                  } else {
                    console.error("Login failed");
                  }
                } catch (error) {
                  console.error("Error during login:", error);
                }
              }}
              onError={() => {
                console.log("Login Failed");
              }}
              scope="https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.email"
              useOneTap
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
