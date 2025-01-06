import React, { useEffect, useState } from "react";
import formStyles from "../styles/formStyles.module.css";
import styles from "../styles/LoginSIgnup.module.css";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { LOGIN_URL } from "../constants/endPoint";
import { useUser } from "../contexts/UserProvider";
import { fetchData } from "../utils/fetchData";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { toast } from "../hooks/CustomToast";

const base_url = import.meta.env.VITE_BASE_URL;

const Login = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
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
    console.log("login request");

    setReq({ ...req, loading: true });
    const {
      data: result,
      error,
      loading,
    } = await fetchData(`${base_url}users/login`, "POST", data);
    if (result) {
      setReq({ ...req, loading: loading, data: result });
      login();
      const redirectPath = localStorage.getItem("redirectAfterLogin") || "/";
      navigate(redirectPath);
      localStorage.removeItem("redirectAfterLogin");
      reset();
    } else {
      // Handle error response
      setReq({ ...req, loading: loading, error: error });
    }
  };

  const handleChangePassword = async (data) => {
    setReq({ ...req, loading: true });
    const { email } = data;
    try {
      const response = await fetch(`${base_url}users/forgotPassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        toast(
          "A password reset email has been sent to your email address.",
          "success"
        );
        setIsChangePassword(false);
        reset();
      } else {
        const errorData = await response.json();
        toast(`Error: ${errorData.message}`, "error");
      }
    } catch (error) {
      toast(
        "An error occurred while sending the reset password email.",
        "error"
      );
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
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
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
                  <button type="submit" className={formStyles.button}>
                    Submit
                  </button>
                </div>
              </form>
            )}
            <h4 className={formStyles.haveAccount}>
              Don't have an account? <Link to="/signup">Signup</Link>
            </h4>
            <button
              onClick={() => setIsChangePassword(!isChangePassword)}
              className={formStyles.linkButton}
            >
              {isChangePassword ? "Back to Login" : "Forgot Password?"}
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

                  const response = await fetch(`${base_url}users/google`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      email: email,
                      token: accessToken,
                    }),
                    credentials: "include",
                  });
                  if (!response.ok) {
                    const errorData = await response.json();
                    console.error("Login failed:", errorData.message);
                    toast("Login failed: " + errorData.message, "error");
                    return;
                  }
                  if (response.ok) {
                    login();
                    const redirectPath =
                      localStorage.getItem("redirectAfterLogin") || "/";
                    navigate(redirectPath);
                    localStorage.removeItem("redirectAfterLogin");
                    reset();
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
