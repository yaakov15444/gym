import React, { useState } from "react";
import formStyles from "../styles/formStyles.module.css";
import styles from "../styles/LoginSIgnup.module.css";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { LOGIN_URL } from "../constants/endPoint";
import { useUser } from "../contexts/UserProvider";
import { fetchData } from "../utils/fetchData";
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
  return (
    <div className={styles.Page}>
      <div className={styles.Container}>
        <h1 className={styles.heading}>Login</h1>
        {req.loading ? (
          <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
          </div>
        ) : (
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
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
