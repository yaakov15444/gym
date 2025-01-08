import React, { useEffect, useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useUser, UserProvider } from "../contexts/UserProvider";
import styles from "../styles/navbarStyles.module.css";
import gymLogo from "../../pictures/logo.png";
import defaultUserPic from "../../pictures/defaultUser.png";
import Bell from "../pages/Bell";

const Navbar = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    setIsProfileOpen(false);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    setIsSidebarOpen(false);
  };

  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  // פונקציה לעדכון התאריך והזמן כל שנייה
  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      const formattedDate = now.toLocaleString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour12: true,
      });
      const formattedTime = now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
      });
      setCurrentDate(formattedDate);
      setCurrentTime(formattedTime);
    };

    // עדכון התאריך כל שנייה
    const intervalId = setInterval(updateDate, 1000);

    // ניקוי בזמן יציאה
    return () => clearInterval(intervalId);
  }, []);
  return (
    <div className={styles.navbarContainer}>
      <nav className={styles.navbar}>
        {/* Hamburger Menu */}
        <button
          className={`${styles.hamburger} ${
            isSidebarOpen ? styles.active : ""
          }`}
          onClick={toggleSidebar}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <ul className={styles.navbarLogoAndTime}>
          <li>
            {/* Logo */}
            <NavLink to="/">
              <img src={gymLogo} alt="logo" className={styles.logo} />
            </NavLink>
          </li>
          <li>
            <div className={styles.dateContainer}>
              <span>{currentDate}</span>
              <span>{currentTime}</span>
            </div>
          </li>
          <li>
            <NavLink to="/chart" className={styles.dateButton}>
              <div className={styles.openingHours}>
                <span className={styles.hours}>Opening Hours: </span>06:00 -
                22:00
              </div>
            </NavLink>
          </li>
        </ul>
        {/* NavLinks based on User Authentication */}
        <ul className={styles.navbarLinks}>
          <li>
            <NavLink to="/courses" className={styles.navbarLink}>
              Our Courses
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className={styles.navbarLink}>
              About
            </NavLink>
          </li>
          {user && user.role === "Admin" && (
            <li>
              <NavLink to="/admin" className={styles.navbarLink}>
                Admin Panel
              </NavLink>
            </li>
          )}
        </ul>
        {/* User Profile Section */}
        <div className={styles.userSection}>
          {user ? (
            <div className={styles.userProfile}>
              <Bell isOpen={isOpen} setIsOpen={setIsOpen} />

              <img
                src={user.profileImageUrl || defaultUserPic}
                alt="Profile"
                className={styles.profilePic}
                onClick={toggleProfile}
              />

              {isProfileOpen && (
                <div className={styles.profileDropdown}>
                  <div className={styles.profileHeader}>
                    <img
                      src={user.profileImageUrl || defaultUserPic}
                      alt="Profile"
                      className={styles.dropdownProfilePic}
                    />
                    <span>Hello, {user.name} !</span>
                  </div>
                  <NavLink
                    to="/info"
                    className={styles.dropdownLink}
                    onClick={toggleProfile}
                  >
                    My Profile
                  </NavLink>
                  <NavLink
                    to="/calendar"
                    className={styles.dropdownLink}
                    onClick={toggleProfile}
                  >
                    My Calendar
                  </NavLink>
                  <NavLink
                    to="/qrcode"
                    className={styles.dropdownLink}
                    onClick={toggleProfile}
                  >
                    QR Code
                  </NavLink>
                  <button
                    onClick={() => {
                      logout();
                      navigate("/");
                      setIsProfileOpen(false);
                    }}
                    className={styles.dropdownButton}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.authButtons}>
              <NavLink to="/Login" className={styles.navbarLink}>
                Login
              </NavLink>
              <NavLink
                to="/Signup"
                className={`${styles.navbarButton} ${styles.signup}`}
              >
                Sign Up
              </NavLink>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div className={styles.sidebarOverlay} onClick={toggleSidebar}>
          <div className={styles.sidebar} onClick={(e) => e.stopPropagation()}>
            <div className={styles.sidebarContent}>
              <NavLink
                to="/courses"
                className={styles.sidebarLink}
                onClick={toggleSidebar}
              >
                Our Courses
              </NavLink>
              <NavLink
                to="/about"
                className={styles.sidebarLink}
                onClick={toggleSidebar}
              >
                About
              </NavLink>
              {user && user.role === "Admin" && (
                <NavLink
                  to="/admin"
                  className={styles.sidebarLink}
                  onClick={toggleSidebar}
                >
                  Admin Panel
                </NavLink>
              )}
              {/* {user && } */}
              {!user && (
                <>
                  <NavLink
                    to="/Login"
                    className={styles.sidebarLink}
                    onClick={toggleSidebar}
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/Signup"
                    className={styles.sidebarButton}
                    onClick={toggleSidebar}
                  >
                    Sign Up
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
