import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useUser, UserProvider } from "../contexts/UserProvider";
import styles from "../styles/navbarStyles.module.css";
import gymLogo from "../../pictures/logo.png";

const Navbar = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  return (
    <div>
      {/* Navbar Section */}
      <div className={styles.navbarContainer}>
        <nav className={styles.navbar}>
          {/* Logo or Home Link */}
          <NavLink to="/">
            <img src={gymLogo} alt="logo" className={styles.logo} />
          </NavLink>

          {/* NavLinks based on User Authentication */}
          <ul className={styles.navbarLinks}>
            <NavLink to="/courses" className={styles.navbarLink}>
              Our Courses
            </NavLink>
            {user ? (
              <>
                {/* Data link for logged-in users */}
                <NavLink to="/Data" className={styles.navbarLink}>
                  Data
                </NavLink>
                <NavLink to="/info" className={styles.navbarLink}>
                  {user.name}
                </NavLink>
                {/* Admin link if user.role is ADMIN */}
                {user && user.role === "Admin" && (
                  <NavLink to="/admin" className={styles.navbarLink}>
                    Admin Panel
                  </NavLink>
                )}
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
    </div>
  );
};

export default Navbar;
