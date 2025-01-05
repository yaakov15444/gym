import React, { useEffect, useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useUser, UserProvider } from "../contexts/UserProvider";
import styles from "../styles/navbarStyles.module.css";
import gymLogo from "../../pictures/logo.png";

const Navbar = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState("");

  // פונקציה לעדכון התאריך והזמן כל שנייה
  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      const formattedDate = now.toLocaleString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
      });
      setCurrentDate(formattedDate);
    };

    // עדכון התאריך כל שנייה
    const intervalId = setInterval(updateDate, 1000);

    // ניקוי בזמן יציאה
    return () => clearInterval(intervalId);
  }, []);
  return (
    <div className={styles.navbarContainer}>
      <nav className={styles.navbar}>
        {/* Logo or Home Link */}
        <NavLink to="/">
          <img src={gymLogo} alt="logo" className={styles.logo} />
        </NavLink>
        <NavLink to="/chart" className={styles.dateButton}>
          <span>{currentDate}</span>
          <div className={styles.openingHours}>
            <span className={styles.hours}>Opening Hours: </span>06:00 - 22:00
          </div>
        </NavLink>{" "}
        {/* NavLinks based on User Authentication */}
        <ul className={styles.navbarLinks}>
          <NavLink to="/courses" className={styles.navbarLink}>
            Our Courses
          </NavLink>
          {user ? (
            <>
              <NavLink to="/info" className={styles.navbarLink}>
                {user.name}
              </NavLink>
              {/* Admin link if user.role is ADMIN */}
              {user && user.role === "Admin" && (
                <NavLink to="/admin" className={styles.navbarLink}>
                  Admin Panel
                </NavLink>
              )}{" "}
              {/* Log Out Button */}
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className={`${styles.navbarButton} ${styles.logout}`}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {/* Links for not logged-in users */}
              <NavLink to="/Login" className={styles.navbarLink}>
                Login
              </NavLink>
              <NavLink
                to="/Signup"
                className={`${styles.navbarButton} ${styles.signup}`}
              >
                Sign Up
              </NavLink>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
