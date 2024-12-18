import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useUser, UserProvider } from "../contexts/UserProvider";
import styles from "../styles/navbarStyles.module.css";

const Navbar = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  return (
    <div>
      {/* Navbar Section */}
      <div className={styles.navbarContainer}>
        <nav className={styles.navbar}>
          {/* Logo or Home Link */}
          <NavLink to="/" className={styles.navbarLogo}>
            Logo
          </NavLink>

          {/* NavLinks based on User Authentication */}
          <ul className={styles.navbarLinks}>
            {user ? (
              <>
                {/* Data link for logged-in users */}
                <NavLink to="/Data" className={styles.navbarLink}>
                  Data
                </NavLink>

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

      {/* Outlet for rendering child components */}
      <Outlet />
    </div>
  );
};

export default Navbar;
