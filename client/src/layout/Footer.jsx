import React from "react";
import styles from "../styles/Footer.module.css";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h3>About Us</h3>
          <p>
            Your premier fitness destination for achieving your health and
            wellness goals.
          </p>
        </div>

        <div className={styles.footerSection}>
          <h3>Quick Links</h3>
          <div className={styles.footerLinks}>
            <ul>
              <li>
                <NavLink to="/about" className={styles.footerLink}>
                  About
                </NavLink>
              </li>
              <li>
                <NavLink to="/courses" className={styles.footerLink}>
                  Our Courses
                </NavLink>
              </li>
              <li>
                <NavLink to="/faq" className={styles.footerLink}>
                  FAQ
                </NavLink>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.footerSection}>
          <h3>Contact Us</h3>
          <div className={styles.footerContact}>
            <p>📞 Phone: 9999*</p>
            <p>📧 Email: contact@GymNest.co.il</p>
            <p>📍 Address: 123 Fitness Street, Tel Aviv</p>
          </div>
        </div>

        <div className={styles.footerSection}>
          <h3>Opening Hours</h3>
          <div className={styles.footerContact}>
            <p>Sunday-Saturday: 06:00-22:00</p>
          </div>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <p>&copy; 2024 GymNest. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
